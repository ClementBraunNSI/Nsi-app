import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";

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

  const files = fs.readdirSync(levelDir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  const courses: CourseItem[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(levelDir, file), "utf8");
    const { data } = matter(raw);
    const slug = file.replace(/\.mdx?$/, "");
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

