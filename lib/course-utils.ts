import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface CourseSummary {
  title: string;
  slug: string;
  order: number;
  chapter: string;
}

/** Fichiers .md/.mdx sous content/{level} : plat sauf `particuliers` (sous-dossiers élèves / thèmes). */
export function listMarkdownFilesForContentLevel(level: string): { filePath: string; slug: string }[] {
  const contentDir = path.join(process.cwd(), 'content', level);
  if (!fs.existsSync(contentDir)) return [];

  if (level === 'particuliers') {
    const out: { filePath: string; slug: string }[] = [];
    const walk = (dir: string, rel: string) => {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        const st = fs.statSync(full);
        if (st.isDirectory()) {
          walk(full, rel ? `${rel}/${name}` : name);
        } else if (name.endsWith('.md') || name.endsWith('.mdx')) {
          const base = name.replace(/\.mdx?$/, '');
          out.push({ filePath: full, slug: rel ? `${rel}/${base}` : base });
        }
      }
    };
    walk(contentDir, '');
    return out;
  }

  return fs
    .readdirSync(contentDir)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map((file) => ({
      filePath: path.join(contentDir, file),
      slug: file.replace(/\.mdx?$/, ''),
    }));
}

export function getCoursesForLevel(level: string): CourseSummary[] {
  const entries = listMarkdownFilesForContentLevel(level);
  const courses: CourseSummary[] = [];

  for (const { filePath, slug } of entries) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    const fileName = path.basename(filePath);

    let order = 999;

    if (data.order !== undefined) {
      order = parseInt(String(data.order), 10);
    } else {
      const match = fileName.match(/^(\d+)_/);
      if (match) {
        order = parseInt(match[1], 10);
      }
    }

    courses.push({
      title: (data.title as string) || slug.replace(/[_-]/g, ' '),
      slug,
      order,
      chapter: String(data.chapter || 'Général'),
    });
  }

  courses.sort((a, b) => {
    if (a.chapter !== b.chapter) {
      return a.chapter.localeCompare(b.chapter, 'fr');
    }
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title, 'fr');
  });

  return courses;
}

function normalizeChapterKey(chapter: string): string {
  return chapter
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

export function getAdjacentCourses(level: string, currentSlug: string) {
  const courses = getCoursesForLevel(level);
  const current = courses.find((c) => c.slug === currentSlug);

  if (!current) return { prev: null, next: null };

  const chapterKey = normalizeChapterKey(current.chapter);
  const inChapter = courses.filter((c) => normalizeChapterKey(c.chapter) === chapterKey);
  const pool = inChapter.length > 1 ? inChapter : courses;
  const currentIndex = pool.findIndex((c) => c.slug === currentSlug);

  if (currentIndex === -1) return { prev: null, next: null };

  return {
    prev: currentIndex > 0 ? pool[currentIndex - 1] : null,
    next: currentIndex < pool.length - 1 ? pool[currentIndex + 1] : null,
  };
}
