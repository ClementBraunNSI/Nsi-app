import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { listMarkdownFilesForContentLevel } from "@/lib/course-utils";

type CourseItem = {
  title: string;
  slug: string;
  chapter: string;
  badgeId: string;
  level: string;
};

export async function GET(_: Request, { params }: { params: Promise<{ level: string }> }) {
  const { level } = await params;
  const levelDir = path.join(process.cwd(), "content", level);
  if (!fs.existsSync(levelDir)) return NextResponse.json({ courses: [] });

  const entries = listMarkdownFilesForContentLevel(level);
  const courses: CourseItem[] = entries.map(({ filePath, slug }) => {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data } = matter(raw);
    return {
      title: String(data.title || slug),
      slug,
      chapter: String(data.chapter || "Cours"),
      badgeId: String(data.badgeId || slug),
      level,
    };
  });

  courses.sort((a, b) => a.chapter.localeCompare(b.chapter, "fr") || a.title.localeCompare(b.title, "fr"));
  return NextResponse.json({ courses });
}

