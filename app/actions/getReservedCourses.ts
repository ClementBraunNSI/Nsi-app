'use server'

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAuthContext } from '@/lib/auth';
import { contentRoot } from '@/lib/content-path';
import { coursePath } from '@/lib/nsi-levels';

export interface ReservedCourse {
  title: string;
  level: string;
  slug: string;
  path: string;
}

function normalize(str: string) {
  return String(str)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isStudentAllowed(allowedStudents: unknown, studentName: string): boolean {
  if (!Array.isArray(allowedStudents)) return false;
  const n = normalize(studentName);
  return allowedStudents.some((name) => normalize(String(name)) === n);
}

export async function getReservedCourses(studentName?: string): Promise<ReservedCourse[]> {
  const auth = await getAuthContext();
  if (!auth.user) return [];

  let name = auth.fullName;
  if (studentName && normalize(studentName) !== normalize(name || "")) {
    if (!auth.isElevated) return [];
    name = studentName;
  }
  if (!name) return [];

  const contentDir = contentRoot();
  if (!fs.existsSync(contentDir)) return [];

  const reservedCourses: ReservedCourse[] = [];

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
      const { data } = matter(fileContent);
      if (!isStudentAllowed(data.allowedStudents, name!)) continue;
      if (data.revisionSheet === true) continue;

      const relativePath = path.relative(contentDir, fullPath);
      const pathParts = relativePath.split(path.sep);
      const level = pathParts[0];
      const slug = pathParts.slice(1).join('/').replace(/\.mdx?$/, '');

      reservedCourses.push({
        title: data.title || item.replace(/\.mdx?$/, ''),
        level,
        slug,
        path: coursePath(level, slug),
      });
    }
  }

  try {
    scanDirectory(contentDir);
  } catch (error) {
    console.error('Error scanning content directory:', error);
  }

  return reservedCourses;
}
