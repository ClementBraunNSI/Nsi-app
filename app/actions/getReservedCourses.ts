'use server'

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface ReservedCourse {
  title: string;
  level: string;
  slug: string;
  path: string;
}

export async function getReservedCourses(studentName: string): Promise<ReservedCourse[]> {
  if (!studentName) return [];

  const contentDir = path.join(process.cwd(), 'content');
  
  if (!fs.existsSync(contentDir)) return [];

  const reservedCourses: ReservedCourse[] = [];

  function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!item.startsWith('.')) {
          scanDirectory(fullPath);
        }
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        const fileContent = fs.readFileSync(fullPath, 'utf-8');
        const { data } = matter(fileContent);

        if (data.allowedStudents && Array.isArray(data.allowedStudents)) {
          const normalize = (str: string) => String(str).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, ' ').trim();
          const studentNameNormalized = normalize(studentName);
          
          const isAllowed = data.allowedStudents.some((name: string) => 
            normalize(name) === studentNameNormalized
          );

          // Fallback check without normalization if normalization fails to match
          const isAllowedFallback = !isAllowed && data.allowedStudents.includes(studentName);

          if (isAllowed || isAllowedFallback) {
            // Fiches de révision : listées via getRevisionSheets, pas dans les modules privés
            if (data.revisionSheet === true) {
              continue;
            }
            // Determine relative path parts for URL construction
            const relativePath = path.relative(contentDir, fullPath);
            const pathParts = relativePath.split(path.sep);
            
            // Handle different path structures
            let urlPath = '';
            let level = '';
            
            if (pathParts[0] === 'particuliers') {
               // content/particuliers/student/course.md -> /cours/particuliers/student/course
               // We might need a special route for this or map it to existing /cours/[level]/[slug]
               // If the [level] param can be 'particuliers', then:
               // /cours/particuliers/cleo/course-affectations-types
               // But [slug] is usually the last part.
               // Let's assume the route /cours/[...slug] or /cours/[level]/[slug] handles this.
               // If the file is at content/particuliers/cleo/course.md
               // level = 'particuliers', slug = 'cleo/course' ? 
               // Or level = 'particuliers/cleo', slug = 'course' ?
               
               // The existing page is app/cours/[niveaux]/[slug]/page.tsx
               // It expects 2 params.
               
               // If I map:
               // niveaux = 'particuliers'
               // slug = 'cleo/course' -> This would require [slug] to be a catch-all [[...slug]] or similar if it has slashes.
               // Let's check the [slug] folder.
               
               // Ideally, we want /student/courses/view?path=... or reuse the existing course viewer.
               // The existing course viewer is /cours/[niveaux]/[slug]
               
               // If I construct the URL as /cours/particuliers/cleo/course-name
               // Then [niveaux] = 'particuliers', [slug] = 'cleo/course-name' (if slug captures slashes)
               // OR [niveaux] = 'particuliers', [slug] = 'cleo%2Fcourse-name'
               
               // Let's check app/cours/[niveaux]/[slug]/page.tsx to see if slug is catch-all.
               
               // For now, I'll construct a path that matches the file structure relative to content.
               // If content/4/course.md -> /cours/4/course
               // If content/particuliers/cleo/course.md -> /cours/particuliers/cleo/course
               
               // We need to check if [slug] is [...slug] or just [slug].
               
               level = pathParts[0];
               const slug = pathParts.slice(1).join('/').replace(/\.mdx?$/, '');
               urlPath = `/cours/${level}/${slug}`;
            } else {
               // content/4/course.md
               level = pathParts[0];
               const slug = pathParts.slice(1).join('/').replace(/\.mdx?$/, '');
               urlPath = `/cours/${level}/${slug}`;
            }

            reservedCourses.push({
              title: data.title || item.replace(/\.mdx?$/, ''),
              level: level,
              slug: pathParts.slice(1).join('/').replace(/\.mdx?$/, ''),
              path: urlPath
            });
          }
        }
      }
    }
  }

  try {
    scanDirectory(contentDir);
  } catch (error) {
    console.error('Error scanning content directory:', error);
  }

  return reservedCourses;
}
