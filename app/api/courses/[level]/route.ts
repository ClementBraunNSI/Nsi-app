import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ level: string }> }
) {
  const { level } = await params;

  try {
    const contentPath = path.join(process.cwd(), 'content', level);

    if (!fs.existsSync(contentPath)) {
      return NextResponse.json({ courses: [] });
    }

    const files = fs.readdirSync(contentPath);
    const mdxFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

    const courses = mdxFiles.map(fileName => {
      const filePath = path.join(contentPath, fileName);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);

      return {
        slug: fileName.replace(/\.mdx?$/, ''),
        title: String(data.title || fileName.replace(/\.mdx?$/, '')),
        description: String(data.description || "Consulter la leçon"),
        chapter: String(data.chapter || "Général"),
        badgeId: String(data.badgeId || ""),
        icon: String(data.icon || '📘'),
      };
    });

    return NextResponse.json({ courses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load courses' }, { status: 500 });
  }
}