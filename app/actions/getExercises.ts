
'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAuthContext, type AuthContext } from '@/lib/auth';
import { canAccessCourse } from '@/lib/course-access';
import { contentRoot } from '@/lib/content-path';
import { classifySection, type ExternalRuntime } from '@/lib/exercise-classification';
import { coursePath } from '@/lib/nsi-levels';

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
  access?: 'private' | 'public';
  type: 'python' | 'sql';
  hasVerification: boolean;
  pagePath?: string;
}

export type ExternalExercise = {
  id: string;
  label: string;
  courseTitle: string;
  pagePath?: string;
  runtime: ExternalRuntime;
  access?: 'private' | 'public';
  allowedStudents?: string[];
};

export type ExerciseSheet = {
  courseId: string;
  courseTitle: string;
  chapter: string;
  level: string;
  exerciseCount: number;
};

function toPublicExercise(ex: LabExercise): LabExercise {
  const { allowedStudents: _allowed, verificationCode, access: _access, ...rest } = ex;
  return {
    ...rest,
    hasVerification: Boolean(verificationCode),
  };
}

// Helper to recursively get files
function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    if (file.startsWith('.') || file === 'build' || file === 'node_modules') return;
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

function exerciseIsAccessible(ex: { access?: 'private' | 'public'; allowedStudents?: string[] }, auth: AuthContext) {
  return canAccessCourse(
    {
      access: ex.access || (ex.allowedStudents?.length ? 'private' : 'public'),
      allowedStudents: ex.allowedStudents,
    },
    {
      isElevated: auth.isElevated,
      isAuthenticated: Boolean(auth.user),
      userFullName: auth.fullName,
      hasPrivateLessons: auth.hasPrivateLessons,
    },
  );
}

function buildExerciseCatalog(): { exercises: LabExercise[]; external: ExternalExercise[] } {
  const contentDir = contentRoot();
  if (!fs.existsSync(contentDir)) return { exercises: [], external: [] };

  const exercises: LabExercise[] = [];
  const external: ExternalExercise[] = [];
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
          const beforeSection = content.slice(0, match.index);
          const tabOpenings = [...beforeSection.matchAll(/<ExerciseTabs\b([^>]*)>/g)];
          const nearestTabs = tabOpenings.at(-1)?.[1] ?? '';
          const nearestCourseId = nearestTabs.match(/\bcourseId="([^"]*)"/)?.[1] || courseId;
          const nearestCourseTitle = nearestTabs.match(/\bcourseTitle="([^"]*)"/)?.[1] || courseTitle;
          const kind = classifySection({
            label: sectionLabel,
            body: rawContent,
            levelFolder: level,
            courseId: nearestCourseId,
            courseTitle: nearestCourseTitle,
          });
          
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

          const relParts = path.relative(contentDir, filePath).split(path.sep);
          const privateLesson = relParts[0] === 'particuliers' && relParts.length >= 3;
          const markedPrivate = String(data.access || '').toLowerCase() === 'private';
          const access = privateLesson || markedPrivate ? 'private' as const : 'public' as const;
          const pagePath = coursePath(relParts[0], relParts.slice(1).join('/').replace(/\.mdx?$/, ''));

          if (kind.role === 'external') {
            external.push({
              id: sectionId,
              label: sectionLabel,
              courseTitle: nearestCourseTitle,
              pagePath,
              runtime: kind.runtime,
              allowedStudents: data.allowedStudents,
              access,
            });
            continue;
          }
          if (kind.role !== 'exercise') continue;

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
            access,
            type: kind.runtime,
            hasVerification: Boolean(verificationCode),
            pagePath,
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
    
    if (!finalId) {
      finalId = `ex-${ex.fileName}`;
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

  return { exercises: uniqueExercises, external };
}

export async function getAllExercises(): Promise<LabExercise[]> {
  const auth = await getAuthContext();
  return buildExerciseCatalog().exercises
    .filter((ex) => exerciseIsAccessible(ex, auth))
    .map(toPublicExercise);
}

export async function getExercisesForCourses(courseIds: string[]): Promise<LabExercise[]> {
  const ids = [...new Set(courseIds.map((id) => String(id || '').trim()).filter(Boolean))];
  if (ids.length === 0) return [];

  const allowed = new Set(ids);
  const auth = await getAuthContext();
  return buildExerciseCatalog().exercises
    .filter((ex) => allowed.has(ex.courseId) && exerciseIsAccessible(ex, auth))
    .map(toPublicExercise);
}

export type TrackedExercise = {
  id: string;
  label: string;
  courseId: string;
  courseTitle: string;
  chapter: string;
  level: string;
};

/** Exercices Python/SQL suivis. Les points de cours et le BTS (hors éditeur) n'y figurent pas. */
export async function listTrackedExercises(): Promise<TrackedExercise[]> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return [];

  return buildExerciseCatalog().exercises.map((exercise) => ({
    id: exercise.id,
    label: exercise.label,
    courseId: exercise.courseId,
    courseTitle: exercise.courseTitle,
    chapter: exercise.chapter,
    level: exercise.level,
  }));
}

export async function listExerciseSheets(): Promise<ExerciseSheet[]> {
  const auth = await getAuthContext();
  if (!auth.isElevated) return [];

  const sheets = new Map<string, ExerciseSheet>();
  for (const ex of buildExerciseCatalog().exercises) {
    const current = sheets.get(ex.courseId);
    if (current) {
      current.exerciseCount += 1;
      continue;
    }
    sheets.set(ex.courseId, {
      courseId: ex.courseId,
      courseTitle: ex.courseTitle,
      chapter: ex.chapter,
      level: ex.level,
      exerciseCount: 1,
    });
  }

  return [...sheets.values()].sort(
    (a, b) =>
      a.level.localeCompare(b.level, 'fr') ||
      a.chapter.localeCompare(b.chapter, 'fr') ||
      a.courseTitle.localeCompare(b.courseTitle, 'fr'),
  );
}

export async function getExerciseById(exerciseId: string): Promise<LabExercise | null> {
  const id = String(exerciseId || '').trim();
  if (!id || id.length > 200) return null;

  const auth = await getAuthContext();
  if (!auth.user || auth.isElevated) return null;

  const exercise = buildExerciseCatalog().exercises.find((item) => item.id === id);
  if (!exercise || !exerciseIsAccessible(exercise, auth)) return null;
  return toPublicExercise(exercise);
}

/** Exercice présent sur une fiche, mais pas réalisable dans l'éditeur Python/SQL. */
export async function getExternalExercise(exerciseId: string): Promise<ExternalExercise | null> {
  const id = String(exerciseId || '').trim();
  if (!id || id.length > 200) return null;

  const auth = await getAuthContext();
  if (!auth.user || auth.isElevated) return null;

  const exercise = buildExerciseCatalog().external.find((item) => item.id === id);
  if (!exercise || !exerciseIsAccessible(exercise, auth)) {
    return null;
  }
  const { allowedStudents: _allowed, access: _access, ...rest } = exercise;
  return rest;
}

export async function getExerciseVerification(exerciseId: string): Promise<string | null> {
  const id = String(exerciseId || '').trim();
  if (!id || id.length > 200) return null;

  const auth = await getAuthContext();
  if (!auth.user || (auth.role !== 'student' && auth.role !== 'invite')) return null;

  const exercise = buildExerciseCatalog().exercises.find((item) => item.id === id);
  if (!exercise || !exerciseIsAccessible(exercise, auth)) return null;
  return exercise.verificationCode ?? null;
}
