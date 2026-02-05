import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

interface CourseData {
  slug: string;
  title: string;
  description: string;
  chapter: string;
  icon: string;
  level: string;
  allowedStudents?: string[];
  badgeId?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentName = searchParams.get('studentName');
    
    if (!studentName) {
      return NextResponse.json({ 
        error: 'studentName parameter is required' 
      }, { status: 400 });
    }

    // Get all courses from content directory
    const contentPath = path.join(process.cwd(), 'content');
    if (!fs.existsSync(contentPath)) {
      return NextResponse.json({ 
        courses: [], 
        message: 'No content directory found' 
      });
    }

    const levels = fs.readdirSync(contentPath).filter(dir => {
      const dirPath = path.join(contentPath, dir);
      return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
    }).sort();

    const accessibleCourses: CourseData[] = [];

    levels.forEach(level => {
      const levelPath = path.join(contentPath, level);
      const files = fs.readdirSync(levelPath);
      const mdxFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

      mdxFiles.forEach(fileName => {
        const filePath = path.join(levelPath, fileName);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);

        // Check if student has access to this course
        const allowedStudents = data.allowedStudents;
        const hasAccess = !allowedStudents || 
          (Array.isArray(allowedStudents) && allowedStudents.includes(studentName));

        if (hasAccess) {
          accessibleCourses.push({
            slug: fileName.replace(/\.mdx?$/, ''),
            title: String(data.title || fileName.replace(/\.mdx?$/, '')),
            description: String(data.description || "Consulter la leçon"),
            chapter: String(data.chapter || "Général"),
            icon: String(data.icon || '📘'),
            level: level,
            allowedStudents: allowedStudents,
            badgeId: data.badgeId
          });
        }
      });
    });

    // Also check for courses in particuliers directory
    const particuliersPath = path.join(process.cwd(), 'cours_nettoyés', 'cours-particuliers-8347291056502817346991827364507610283954340985172628975104366150974328473920561890231874651547862309');
    if (fs.existsSync(particuliersPath)) {
      const students = fs.readdirSync(particuliersPath);
      
      students.forEach(studentDir => {
        const studentPath = path.join(particuliersPath, studentDir);
        if (fs.statSync(studentPath).isDirectory()) {
          const subjects = fs.readdirSync(studentPath);
          
          subjects.forEach(subject => {
            const subjectPath = path.join(studentPath, subject);
            if (fs.statSync(subjectPath).isDirectory()) {
              const coursesPath = path.join(subjectPath, 'Cours');
              if (fs.existsSync(coursesPath) && fs.statSync(coursesPath).isDirectory()) {
                const courseFiles = fs.readdirSync(coursesPath)
                  .filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
                
                courseFiles.forEach(fileName => {
                  const filePath = path.join(coursesPath, fileName);
                  const fileContent = fs.readFileSync(filePath, 'utf-8');
                  const { data } = matter(fileContent);

                  // Check if student has access
                  const allowedStudents = data.allowedStudents;
                  const hasAccess = !allowedStudents || 
                    (Array.isArray(allowedStudents) && allowedStudents.includes(studentName));

                  if (hasAccess) {
                    accessibleCourses.push({
                      slug: `particuliers-${studentDir}-${subject}-${fileName.replace(/\.mdx?$/, '')}`,
                      title: String(data.title || fileName.replace(/\.mdx?$/, '')),
                      description: String(data.description || "Cours particulier"),
                      chapter: String(data.chapter || "Particulier"),
                      icon: String(data.icon || '👨‍🏫'),
                      level: 'particuliers',
                      allowedStudents: allowedStudents,
                      badgeId: data.badgeId
                    });
                  }
                });
              }
            }
          });
        }
      });
    }

    return NextResponse.json({ 
      courses: accessibleCourses,
      studentName: studentName,
      totalCourses: accessibleCourses.length
    });

  } catch (error) {
    console.error('Error fetching student courses:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch courses',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}