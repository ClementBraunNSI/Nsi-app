import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { listMarkdownFilesForContentLevel } from "@/lib/course-utils";
import { getNsiLevel, sortLevelIds, urlSlugFromFolder } from "@/lib/nsi-levels";
import CoursHub, { type HubLevel } from "./CoursHub";

export default async function PageTousLesCours() {
  const contentPath = path.join(process.cwd(), "content");
  if (!fs.existsSync(contentPath)) {
    return (
      <div className="mx-auto min-h-screen max-w-6xl p-8">
        <p className="text-center text-[var(--muted)]">Dossier de contenu introuvable.</p>
      </div>
    );
  }

  const levels = sortLevelIds(
    fs.readdirSync(contentPath).filter((dir) => {
      const dirPath = path.join(contentPath, dir);
      return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
    })
  );

  const hubLevels: HubLevel[] = levels.map((levelId) => {
    const meta = getNsiLevel(levelId);
    const chapterCounts = new Map<string, number>();
    const courses: HubLevel["courses"] = [];

    listMarkdownFilesForContentLevel(levelId).forEach(({ filePath, slug }) => {
      const { data } = matter(fs.readFileSync(filePath, "utf-8"));
      const chapter = String(data.chapter || "Général");
      chapterCounts.set(chapter, (chapterCounts.get(chapter) || 0) + 1);
      courses.push({
        slug,
        title: String(data.title || slug),
        chapter,
        href: `/cours/${meta.urlSlug}/${slug}`,
      });
    });

    const chapters = Array.from(chapterCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0], "fr"))
      .map(([name, count]) => ({ name, count }));

    return {
      id: urlSlugFromFolder(levelId),
      title: meta.label,
      audience: meta.audience,
      description: meta.description,
      image: meta.image,
      featured: meta.featured,
      courseCount: courses.length,
      chapters,
      courses: courses.sort((a, b) => a.title.localeCompare(b.title, "fr")),
    };
  });

  return <CoursHub levels={hubLevels} />;
}
