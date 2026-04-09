import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { listMarkdownFilesForContentLevel } from "@/lib/course-utils";

type SearchResult = {
  title: string;
  slug: string;
  level: string;
  category: string;
  score: number;
};

function scoreQuery(query: string, title: string, chapter: string, content: string) {
  const q = query.toLowerCase();
  let score = 0;
  if (title.toLowerCase().includes(q)) score += 5;
  if (chapter.toLowerCase().includes(q)) score += 3;
  if (content.toLowerCase().includes(q)) score += 1;
  return score;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json([]);

  const contentRoot = path.join(process.cwd(), "content");
  if (!fs.existsSync(contentRoot)) return NextResponse.json([]);

  const levels = fs
    .readdirSync(contentRoot)
    .filter((d) => fs.statSync(path.join(contentRoot, d)).isDirectory());

  const results: SearchResult[] = [];
  for (const level of levels) {
    const entries = listMarkdownFilesForContentLevel(level);
    for (const { filePath, slug } of entries) {
      const raw = fs.readFileSync(filePath, "utf8");
      const { data, content } = matter(raw);
      const title = String(data.title || slug);
      const chapter = String(data.chapter || "Cours");
      const score = scoreQuery(q, title, chapter, content.slice(0, 2500));
      if (score > 0) {
        results.push({
          title,
          slug,
          level,
          category: chapter,
          score,
        });
      }
    }
  }

  results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "fr"));
  return NextResponse.json(results.slice(0, 25).map(({ score, ...rest }) => rest));
}

