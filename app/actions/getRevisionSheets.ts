'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAuthContext, viewerFromAuth } from '@/lib/auth';
import { canAccessCourse } from '@/lib/course-access';
import { contentRoot } from '@/lib/content-path';
import { coursePath } from '@/lib/nsi-levels';

export interface RevisionSheet {
  title: string;
  path: string;
  description?: string;
}

export async function getRevisionSheets(): Promise<RevisionSheet[]> {
  const auth = await getAuthContext();
  if (!auth.user) return [];
  const viewer = viewerFromAuth(auth);

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

      const { data } = matter(fs.readFileSync(fullPath, 'utf-8')) as { data: Record<string, unknown> };
      if (data.revisionSheet !== true) continue;
      if (!canAccessCourse(data, viewer)) continue;

      const relativePath = path.relative(contentDir, fullPath);
      const pathParts = relativePath.split(path.sep);
      const level = pathParts[0];
      const slug = pathParts.slice(1).join('/').replace(/\.mdx?$/, '');
      out.push({
        title: String(data.title || slug),
        path: coursePath(level, slug),
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
