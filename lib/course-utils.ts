import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface CourseSummary {
  title: string;
  slug: string;
  order: number;
}

export function getCoursesForLevel(level: string): CourseSummary[] {
  const contentDir = path.join(process.cwd(), 'content', level);
  
  if (!fs.existsSync(contentDir)) {
    return [];
  }

  const files = fs.readdirSync(contentDir);
  const courses: CourseSummary[] = [];

  files.forEach(file => {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) return;
    
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    const slug = file.replace(/\.mdx?$/, '');

    let order = 999;
    
    // Check frontmatter 'order' first
    if (data.order !== undefined) {
      order = parseInt(data.order);
    } 
    // Fallback: Check filename prefix (e.g., "01_Introduction.md")
    else {
      const match = file.match(/^(\d+)_/);
      if (match) {
        order = parseInt(match[1]);
      }
    }

    courses.push({
      title: data.title || slug.replace(/[_-]/g, ' '),
      slug: slug,
      order: order
    });
  });

  // Sort by order first, then by title (or filename if needed)
  courses.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });

  return courses;
}

export function getAdjacentCourses(level: string, currentSlug: string) {
  const courses = getCoursesForLevel(level);
  const currentIndex = courses.findIndex(c => c.slug === currentSlug);

  if (currentIndex === -1) return { prev: null, next: null };

  return {
    prev: currentIndex > 0 ? courses[currentIndex - 1] : null,
    next: currentIndex < courses.length - 1 ? courses[currentIndex + 1] : null
  };
}
