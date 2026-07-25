
'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface LabExercise {
  id: string;
  label: string;
  courseId: string; // The Badge ID associated with the sheet
  courseTitle: string;
  content: string; // The markdown content of the exercise
  verificationCode?: string; // The hidden python code for verification
  pythonPackages?: string[]; // Pyodide packages to load before execution
  chapter: string;
  level: string;
  fileName: string;
  allowedStudents?: string[];
  type: 'python' | 'sql';
}

// Helper to recursively get files
function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath));
    } else {
      results.push(filePath);
    }
  });
  
  return results;
}

export async function getAllExercises(): Promise<LabExercise[]> {
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) return [];

  const exercises: LabExercise[] = [];
  const levels = fs.readdirSync(contentDir).filter(f => !f.startsWith('.'));

  const LEVEL_MAPPING: Record<string, string> = {
    '0': 'SNI',
    '1': 'SNT',
    '2': '1NSI',
    '3': 'TNSI',
    '4': 'SIO',
    'premiere': '1NSI',
    'terminale': 'TNSI',
    'sni': 'SNI',
    'snt': 'SNT',
    'sio': 'SIO'
  };

  // Helper to dedent content
  const dedent = (str: string) => {
    const lines = str.split('\n');
    // Remove first line if empty (often happens after opening tag)
    if (lines.length > 0 && lines[0].trim() === '') lines.shift();
    // Remove last line if empty
    if (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();

    let minIndent = Infinity;
    for (const line of lines) {
      if (line.trim().length > 0) {
        const indent = line.search(/\S/);
        if (indent !== -1 && indent < minIndent) {
          minIndent = indent;
        }
      }
    }
    if (minIndent === Infinity) return str.trim();
    return lines.map(line => (line.length >= minIndent ? line.slice(minIndent) : line)).join('\n').trim();
  };

  for (const level of levels) {
    // Filter out level 4 (BTS SIO) as requested
    if (level === '4') continue;

    const levelPath = path.join(contentDir, level);
    if (!fs.statSync(levelPath).isDirectory()) continue;

    // Get all files recursively for this level (needed for particuliers/romeo/...)
    const allFiles = getFilesRecursively(levelPath);
    const files = allFiles.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

    for (const filePath of files) {
      // Use relative path for fileName or just the basename
      const fileName = path.basename(filePath);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      // We look for <ExerciseTabs ...> to get courseId and Title
      const tabsRegex = /<ExerciseTabs[^>]*courseId="([^"]*)"[^>]*courseTitle="([^"]*)"[^>]*>/;
      const tabsMatch = content.match(tabsRegex);

      if (tabsMatch) {
        const courseId = tabsMatch[1];
        const courseTitle = tabsMatch[2];
        const coursePackagesMatch = content.match(/<ExerciseTabs[^>]*packages="([^"]*)"[^>]*>/);
        const coursePackages = coursePackagesMatch
          ? coursePackagesMatch[1].split(',').map((pkg) => pkg.trim()).filter(Boolean)
          : [];

        // Now we look for <ExerciseSection ...> blocks
        // This regex tries to capture id, label and the content inside
        // It's a simple regex and might fail on nested components, but sufficient for this structure
        const sectionRegex = /<ExerciseSection\b([^>]*)>([\s\S]*?)<\/ExerciseSection>/g;
        
        let match;
        while ((match = sectionRegex.exec(content)) !== null) {
          const sectionAttrs = match[1];
          const sectionId = sectionAttrs.match(/\bid="([^"]*)"/)?.[1];
          const sectionLabel = sectionAttrs.match(/\blabel="([^"]*)"/)?.[1];
          const sectionPackagesMatch = sectionAttrs.match(/\bpackages="([^"]*)"/)?.[1];
          if (!sectionId || !sectionLabel) continue;

          const sectionPackages = sectionPackagesMatch
            ? sectionPackagesMatch.split(',').map((pkg) => pkg.trim()).filter(Boolean)
            : [];
          const pythonPackages = [...new Set([...coursePackages, ...sectionPackages])];
          const rawContent = match[2]; // Don't trim yet to preserve relative indentation for dedent
          
          // Try to find <Enonce> content
          const enonceRegex = /<Enonce>([\s\S]*?)<\/Enonce>/;
          const enonceMatch = rawContent.match(enonceRegex);
          
          let exerciseContent = enonceMatch ? enonceMatch[1] : rawContent;

          exerciseContent = dedent(exerciseContent);

          // Try to find <Verification> content
          const verificationRegex = /<Verification>([\s\S]*?)<\/Verification>/;
          const verificationMatch = rawContent.match(verificationRegex);
          let verificationCode = verificationMatch ? dedent(verificationMatch[1]) : undefined;

          if (verificationCode) {
            // Remove markdown code fences if present (start and end)
            verificationCode = verificationCode
              .replace(/^```(python|sql)?\s*\n?/, '') // Remove ```python or ```sql at start
              .replace(/^```\s*\n?/, '')       // Remove ``` at start
              .replace(/\n?```\s*$/, '')       // Remove ``` at end
              .trim();
          }

          // Remove <Correction> and <Verification> blocks from the content shown to user
          exerciseContent = exerciseContent
            .replace(/<Correction>[\s\S]*?<\/Correction>/g, '')
            .replace(/<Verification>[\s\S]*?<\/Verification>/g, '');
          
          // One final trim
          exerciseContent = exerciseContent.trim();

          // Normalize level.
          // For numeric content folders (0..4), the folder is the source of truth.
          // This avoids inconsistencies when frontmatter `level` drifts from the directory.
          const rawLevel = /^[0-4]$/.test(level) ? level : (data.level || level);
          const normalizedLevel = LEVEL_MAPPING[String(rawLevel).toLowerCase()] || rawLevel;

          // Determine type based on courseId or title
          const isSql = (courseId && courseId.toLowerCase().includes('sql')) || 
                        (courseTitle && courseTitle.toLowerCase().includes('sql'));

          exercises.push({
            id: sectionId,
            label: sectionLabel,
            courseId: courseId,
            courseTitle: courseTitle,
            content: exerciseContent, // The markdown content inside <Enonce> or the section
            verificationCode: verificationCode,
            pythonPackages: pythonPackages.length > 0 ? pythonPackages : undefined,
            chapter: data.chapter || 'Divers',
            level: normalizedLevel,
            fileName: fileName.replace(/\.mdx?$/, ''),
            allowedStudents: data.allowedStudents,
            type: isSql ? 'sql' : 'python',
          });
        }
      }
    }
  }

  // Ensure unique IDs
  const uniqueExercises: LabExercise[] = [];
  const seenIds = new Set<string>();
  
  for (const ex of exercises) {
    let finalId = ex.id;
    
    // If ID is missing or empty, generate one
    if (!finalId) {
      finalId = `ex-${ex.fileName}-${Math.random().toString(36).substr(2, 5)}`;
    }

    // While ID exists, generate a new one to resolve collision
    let counter = 1;
    const originalId = finalId;
    while (seenIds.has(finalId)) {
      finalId = `${originalId}-${ex.fileName}-${counter}`;
      counter++;
    }

    seenIds.add(finalId);
    uniqueExercises.push({ ...ex, id: finalId });
  }

  return uniqueExercises;
}
