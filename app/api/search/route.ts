import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { listMarkdownFilesForContentLevel } from "@/lib/course-utils";
import { contentFolderFromParam, urlSlugFromFolder, sortLevelIds } from "@/lib/nsi-levels";
import { isRestrictedCourse } from "@/lib/course-access";
import { contentRoot } from "@/lib/content-path";

type SearchResult = {
  title: string;
  slug: string;
  level: string;
  category: string;
  score: number;
};

function scoreQuery(query: string, title: string, chapter: string) {
  const q = query.toLowerCase();
  let score = 0;
  if (title.toLowerCase().includes(q)) score += 5;
  if (chapter.toLowerCase().includes(q)) score += 3;
  return score;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json([]);

  const contentRootDir = contentRoot();
  if (!fs.existsSync(contentRootDir)) return NextResponse.json([]);

  const levels = sortLevelIds(
    fs
      .readdirSync(contentRootDir)
      .filter((d) => fs.statSync(path.join(contentRootDir, d)).isDirectory()),
  );

  const results: SearchResult[] = [];
  for (const level of levels) {
    const folder = contentFolderFromParam(level) ?? level;
    const entries = listMarkdownFilesForContentLevel(folder);
    for (const { filePath, slug } of entries) {
      const raw = fs.readFileSync(filePath, "utf8");
      const { data } = matter(raw);
      if (isRestrictedCourse(data)) continue;
      const title = String(data.title || slug);
      const chapter = String(data.chapter || "Cours");
      const score = scoreQuery(q, title, chapter);
      if (score > 0) {
        results.push({
          title,
          slug,
          level: urlSlugFromFolder(folder),
          category: chapter,
          score,
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "fr"));
  return NextResponse.json(results.slice(0, 25).map(({ score, ...rest }) => rest));
}
