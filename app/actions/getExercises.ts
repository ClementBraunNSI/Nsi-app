
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
  chapter: string;
  level: string;
  fileName: string;
}

export async function getAllExercises(): Promise<LabExercise[]> {
  const contentDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(contentDir)) return [];

  const exercises: LabExercise[] = [];
  const levels = fs.readdirSync(contentDir).filter(f => !f.startsWith('.'));

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

    const files = fs.readdirSync(levelPath).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

    for (const file of files) {
      const filePath = path.join(levelPath, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      // We look for <ExerciseTabs ...> to get courseId and Title
      const tabsRegex = /<ExerciseTabs[^>]*courseId="([^"]*)"[^>]*courseTitle="([^"]*)"[^>]*>/;
      const tabsMatch = content.match(tabsRegex);

      if (tabsMatch) {
        const courseId = tabsMatch[1];
        const courseTitle = tabsMatch[2];

        // Now we look for <ExerciseSection ...> blocks
        // This regex tries to capture id, label and the content inside
        // It's a simple regex and might fail on nested components, but sufficient for this structure
        const sectionRegex = /<ExerciseSection[^>]*id="([^"]*)"[^>]*label="([^"]*)"[^>]*>([\s\S]*?)<\/ExerciseSection>/g;
        
        let match;
        while ((match = sectionRegex.exec(content)) !== null) {
          const rawContent = match[3]; // Don't trim yet to preserve relative indentation for dedent
          
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
              .replace(/^```python\s*\n?/, '') // Remove ```python at start
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

          exercises.push({
            id: match[1],
            label: match[2],
            courseId: courseId,
            courseTitle: courseTitle,
            content: exerciseContent, // The markdown content inside <Enonce> or the section
            verificationCode: verificationCode,
            chapter: data.chapter || 'Divers',
            level: level,
            fileName: file.replace(/\.mdx?$/, '')
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
