import fs from "fs";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { listMarkdownFilesForContentLevel } from "@/lib/course-utils";
import { contentFolderFromParam, urlSlugFromFolder } from "@/lib/nsi-levels";
import { canAccessCourse } from "@/lib/course-access";
import { getAuthContext, viewerFromAuth } from "@/lib/auth";

type CourseItem = {
  title: string;
  slug: string;
  chapter: string;
  badgeId: string;
  level: string;
};

export async function GET(_: Request, { params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const folder = contentFolderFromParam(level);
  if (!folder) return NextResponse.json({ courses: [] });

  const viewer = viewerFromAuth(await getAuthContext());
  const entries = listMarkdownFilesForContentLevel(folder);
  const courses: CourseItem[] = entries
    .map(({ filePath, slug }) => {
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);
      return { data, slug };
    })
    .filter(({ data }) => canAccessCourse(data, viewer))
    .map(({ slug, data }) => ({
      title: String(data.title || slug),
      slug,
      chapter: String(data.chapter || "Cours"),
      badgeId: String(data.badgeId || slug),
      level: urlSlugFromFolder(folder),
    }));

  courses.sort((a, b) => a.chapter.localeCompare(b.chapter, "fr") || a.title.localeCompare(b.title, "fr"));
  return NextResponse.json({ courses });
}
