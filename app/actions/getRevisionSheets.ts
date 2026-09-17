'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAuthContext } from '@/lib/auth';
import { contentRoot } from '@/lib/content-path';
import { coursePath } from '@/lib/nsi-levels';

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
  return list.some((name) => normalizeName(String(name)) === n);
}

export async function getRevisionSheets(studentName?: string): Promise<RevisionSheet[]> {
  const auth = await getAuthContext();
  if (!auth.user) return [];

  let name = auth.fullName;
  if (studentName && normalizeName(studentName) !== normalizeName(name || '')) {
    if (!auth.isElevated) return [];
    name = studentName;
  }
  if (!name) return [];

  const contentDir = contentRoot();
  if (!fs.existsSync(contentDir)) return [];

  const out: RevisionSheet[] = [];

  function scanDirectory(dir: string) {
    for (const item of fs.readdirSync(dir)) {
      if (item.startsWith('.') || item === 'build' || item === 'node_modules') continue;
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
        continue;
      }
      if (!item.endsWith('.md') && !item.endsWith('.mdx')) continue;

      const fileContent = fs.readFileSync(fullPath, 'utf-8');
      const { data } = matter(fileContent) as { data: Record<string, unknown> };
      if (data.revisionSheet !== true) continue;
      if (!isStudentAllowed(data, name!)) continue;

      const relativePath = path.relative(contentDir, fullPath);
      const pathParts = relativePath.split(path.sep);
      if (pathParts[0] !== 'particuliers') continue;

      const slug = pathParts.slice(1).join('/').replace(/\.mdx?$/, '');
      out.push({
        title: String(data.title || slug),
        path: coursePath('particuliers', slug),
        description: data.description ? String(data.description) : undefined,
      });
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
