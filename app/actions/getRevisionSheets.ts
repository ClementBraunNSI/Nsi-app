'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface RevisionSheet {
  title: string;
  path: string;
  description?: string;
}

function normalizeName(str: string) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function isStudentAllowed(data: Record<string, unknown>, studentName: string): boolean {
  const list = data.allowedStudents;
  if (!Array.isArray(list)) return false;
  const n = normalizeName(studentName);
  const ok = list.some((name: string) => normalizeName(String(name)) === n);
  const fallback = !ok && list.includes(studentName);
  return ok || fallback;
}

/**
 * Fiches avec frontmatter revisionSheet: true (même logique allowedStudents que les cours réservés).
 */
export async function getRevisionSheets(studentName: string): Promise<RevisionSheet[]> {
  if (!studentName) return [];

  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) return [];

  const out: RevisionSheet[] = [];

  function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        if (!item.startsWith('.')) scanDirectory(fullPath);
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const { data } = matter(fileContent) as { data: Record<string, unknown> };
        if (data.revisionSheet !== true) continue;
        if (!isStudentAllowed(data, studentName)) continue;

        const relativePath = path.relative(contentDir, fullPath);
        const pathParts = relativePath.split(path.sep);
        if (pathParts[0] !== 'particuliers') continue;

        const level = pathParts[0];
        const slug = pathParts.slice(1).join('/').replace(/\.mdx?$/, '');
        out.push({
          title: String(data.title || slug),
          path: `/cours/${level}/${slug}`,
          description: data.description ? String(data.description) : undefined,
        });
      }
    }
  }

  try {
    scanDirectory(contentDir);
  } catch (e) {
    console.error('getRevisionSheets:', e);
  }

  out.sort((a, b) => a.title.localeCompare(b.title, 'fr'));
  return out;
}
