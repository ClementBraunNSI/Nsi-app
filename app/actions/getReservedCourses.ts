'use server'

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAuthContext } from '@/lib/auth';
import { canAccessCourse, parseAudience, type CourseViewer } from '@/lib/course-access';
import { contentRoot } from '@/lib/content-path';
import { coursePath } from '@/lib/nsi-levels';
import { createClient } from '@/utils/supabase/server';

export interface ReservedCourse {
  title: string;
  level: string;
  slug: string;
  path: string;
}

function listAccountCourses(viewer: CourseViewer): ReservedCourse[] {
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

      const { data } = matter(fs.readFileSync(fullPath, 'utf-8'));
      if (data.revisionSheet === true) continue;
      if (parseAudience(data).kind !== 'accounts') continue;
      if (!canAccessCourse(data, viewer)) continue;

      const relativePath = path.relative(contentDir, fullPath);
      const pathParts = relativePath.split(path.sep);
      const level = pathParts[0];
      const slug = pathParts.slice(1).join('/').replace(/\.mdx?$/, '');
      reservedCourses.push({
        title: String(data.title || item.replace(/\.mdx?$/, '')),
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

  return reservedCourses.sort((a, b) => a.title.localeCompare(b.title, 'fr'));
}

/** Cours dont l'audience liste un compte. `studentId` sert à l'enseignant ; sinon le visiteur connecté. */
export async function getReservedCourses(studentId?: string): Promise<ReservedCourse[]> {
  const auth = await getAuthContext();
  if (!auth.user) return [];

  const requested = String(studentId || '').trim();
  if (requested && requested !== auth.user.id) {
    if (!auth.isElevated) return [];
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, email, has_private_lessons, classe')
      .eq('id', requested)
      .eq('role', 'student')
      .maybeSingle();
    if (!profile) return [];
    return listAccountCourses({
      isElevated: false,
      isAuthenticated: true,
      userId: profile.id,
      userEmail: profile.email,
      hasPrivateLessons: Boolean(profile.has_private_lessons),
      classe: profile.classe,
    });
  }

  return listAccountCourses({
    isElevated: false,
    isAuthenticated: true,
    userId: auth.user.id,
    userEmail: auth.email,
    hasPrivateLessons: auth.hasPrivateLessons,
    classe: auth.classe,
  });
}
