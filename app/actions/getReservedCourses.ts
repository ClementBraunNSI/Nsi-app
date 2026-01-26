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

  const levels = fs.readdirSync(contentDir).filter(f => !f.startsWith('.'));
  const reservedCourses: ReservedCourse[] = [];

  for (const level of levels) {
    const levelPath = path.join(contentDir, level);
    if (!fs.statSync(levelPath).isDirectory()) continue;
    
    const files = fs.readdirSync(levelPath).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    
    for (const file of files) {
      const filePath = path.join(levelPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data } = matter(fileContent);
      
      if (data.allowedStudents && Array.isArray(data.allowedStudents)) {
         // Recherche insensible à la casse et tolérante
         const isAllowed = data.allowedStudents.some((name: string) => 
            name.toLowerCase().trim() === studentName.toLowerCase().trim()
         );

         if (isAllowed) {
           reservedCourses.push({
             title: data.title || file.replace(/\.mdx?$/, ''),
             level: level,
             slug: file.replace(/\.mdx?$/, ''),
             path: `/cours/${level}/${file.replace(/\.mdx?$/, '')}`
           });
         }
      }
    }
  }
  
  return reservedCourses;
}
