
'use server';

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getAuthContext, viewerFromAuth } from '@/lib/auth';
import { canAccessCourse } from '@/lib/course-access';
import { contentRoot } from '@/lib/content-path';
import { acceptsWrittenAnswer, canOpenExerciseIde, isEditorExercise, readExerciseType } from '@/lib/exercise-type';
import { stripHiddenExerciseBlocks } from '@/lib/exercise-statement';
import { coursePath } from '@/lib/nsi-levels';
import { CHECK_UNAVAILABLE, SAVE_WARNING, everyTestPassed, testsUnavailableReport, unexpectedRunReport, type RunReport } from '@/lib/python-check';
import { runPythonCheck, runSqlCheck } from '@/lib/run-exercise-check';
import { recordSubmission } from '@/lib/submissions';
import type { Achievement } from '@/lib/achievements';

export interface LabExercise {
  id: string;
  label: string;
  courseId: string; // The Badge ID associated with the sheet
  courseTitle: string;
  content: string; // The markdown content of the exercise
  /** <CodeDepart> : code déjà présent dans l'éditeur (données de l'énoncé, en-tête à compléter). */
  starterCode?: string;
  /** <BaseSQL> : tables et lignes chargées avant chaque requête, dans le navigateur comme pour la vérification. */
  sqlSetup?: string;
  pythonPackages?: string[]; // Pyodide packages to load before execution
  chapter: string;
  level: string;
  fileName: string;
  type: 'python' | 'sql';
  hasVerification: boolean;
  pagePath?: string;
}

type CatalogExercise = LabExercise & {
  verificationCode?: string;
  audience?: unknown;
};

export type ExternalExercise = {
  id: string;
  label: string;
  courseTitle: string;
  pagePath?: string;
  runtime: 'autre';
  audience?: unknown;
};

/** Exercice sans éditeur (lecture, autre) : l'élève rend une réponse écrite, corrigée par l'enseignant. */
export type WrittenExercise = {
  id: string;
  label: string;
  courseId: string;
  courseTitle: string;
  pagePath?: string;
  audience?: unknown;
};

export type ExerciseSheet = {
  courseId: string;
  courseTitle: string;
  chapter: string;
  level: string;
  exerciseCount: number;
};

function toPublicExercise(ex: CatalogExercise): LabExercise {
  return {
    id: ex.id,
    label: ex.label,
    courseId: ex.courseId,
    courseTitle: ex.courseTitle,
    content: ex.content,
    starterCode: ex.starterCode,
    sqlSetup: ex.sqlSetup,
    pythonPackages: ex.pythonPackages,
    chapter: ex.chapter,
    level: ex.level,
    fileName: ex.fileName,
    type: ex.type,
    hasVerification: Boolean(ex.verificationCode),
    pagePath: ex.pagePath,
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

type ExerciseCatalog = { exercises: CatalogExercise[]; external: ExternalExercise[]; written: WrittenExercise[] };

let catalogCache: ExerciseCatalog | null = null;

/**
 * Catalogue des exercices de toutes les fiches. En production, les fichiers de cours ne changent qu'au déploiement :
 * il est construit une fois par serveur. En développement, il est relu à chaque appel pour suivre les modifications.
 */
function buildExerciseCatalog(): ExerciseCatalog {
  if (process.env.NODE_ENV !== 'production') return scanExerciseCatalog();
  catalogCache ??= scanExerciseCatalog();
  return catalogCache;
}

function scanExerciseCatalog(): ExerciseCatalog {
  const contentDir = contentRoot();
  if (!fs.existsSync(contentDir)) return { exercises: [], external: [], written: [] };

  const exercises: CatalogExercise[] = [];
  const external: ExternalExercise[] = [];
  const written: WrittenExercise[] = [];
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
          const writtenType = readExerciseType(sectionAttrs);
          
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

          const starterMatch = rawContent.match(/<CodeDepart>([\s\S]*?)<\/CodeDepart>/);
          const starterCode = starterMatch
            ? dedent(starterMatch[1]).replace(/^```(python|sql)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim()
            : '';

          // La base de la section, sinon la dernière base écrite plus haut dans la fiche.
          const setupMatch = rawContent.match(/<BaseSQL>([\s\S]*?)<\/BaseSQL>/)
            ?? [...beforeSection.matchAll(/<BaseSQL>([\s\S]*?)<\/BaseSQL>/g)].at(-1);
          const sqlSetup = setupMatch
            ? dedent(setupMatch[1]).replace(/^```(sql)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim()
            : '';

          exerciseContent = stripHiddenExerciseBlocks(exerciseContent);
          
          // One final trim
          exerciseContent = exerciseContent.trim();

          // Normalize level.
          // For numeric content folders (0..4), the folder is the source of truth.
          // This avoids inconsistencies when frontmatter `level` drifts from the directory.
          const rawLevel = /^[0-4]$/.test(level) ? level : (data.level || level);
          const normalizedLevel = LEVEL_MAPPING[String(rawLevel).toLowerCase()] || rawLevel;

          const relParts = path.relative(contentDir, filePath).split(path.sep);
          const pagePath = coursePath(relParts[0], relParts.slice(1).join('/').replace(/\.mdx?$/, ''));

          if (!isEditorExercise(writtenType)) {
            if (acceptsWrittenAnswer(writtenType, sectionLabel)) {
              written.push({
                id: sectionId,
                label: sectionLabel,
                courseId: nearestCourseId,
                courseTitle: nearestCourseTitle,
                pagePath,
                audience: data.audience,
              });
            }
            if (writtenType === 'autre') {
              external.push({
                id: sectionId,
                label: sectionLabel,
                courseTitle: nearestCourseTitle,
                pagePath,
                runtime: 'autre',
                audience: data.audience,
              });
            }
            continue;
          }

          exercises.push({
            id: sectionId,
            label: sectionLabel,
            courseId: nearestCourseId,
            courseTitle: nearestCourseTitle,
            content: exerciseContent, // The markdown content inside <Enonce> or the section
            starterCode: starterCode || undefined,
            sqlSetup: writtenType === 'sql' && sqlSetup ? sqlSetup : undefined,
            verificationCode: verificationCode,
            pythonPackages: pythonPackages.length > 0 ? pythonPackages : undefined,
            chapter: data.chapter || 'Divers',
            level: normalizedLevel,
            fileName: fileName.replace(/\.mdx?$/, ''),
            audience: data.audience,
            type: writtenType,
            hasVerification: Boolean(verificationCode),
            pagePath,
          });
        }
      }
    }
  }

  // Ensure unique IDs
  const uniqueExercises: CatalogExercise[] = [];
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

  return { exercises: uniqueExercises, external, written };
}

export type SheetSummary = {
  courseId: string;
  courseTitle: string;
  chapter: string;
};

/** Fiches Python/SQL que l’élève peut terminer, une ligne par course id. */
export async function listAccessibleSheetSummaries(): Promise<SheetSummary[]> {
  const auth = await getAuthContext();
  const sheets = new Map<string, SheetSummary>();
  for (const exercise of buildExerciseCatalog().exercises) {
    if (!canAccessCourse(exercise, viewerFromAuth(auth))) continue;
    if (sheets.has(exercise.courseId)) continue;
    sheets.set(exercise.courseId, {
      courseId: exercise.courseId,
      courseTitle: exercise.courseTitle,
      chapter: exercise.chapter,
    });
  }
  return [...sheets.values()];
}

export async function getAllExercises(): Promise<LabExercise[]> {
  const auth = await getAuthContext();
  return buildExerciseCatalog().exercises
    .filter((ex) => canAccessCourse(ex, viewerFromAuth(auth)))
    .map(toPublicExercise);
}

export async function getExercisesForCourses(courseIds: string[]): Promise<LabExercise[]> {
  const ids = [...new Set(courseIds.map((id) => String(id || '').trim()).filter(Boolean))];
  if (ids.length === 0) return [];

  const allowed = new Set(ids);
  const auth = await getAuthContext();
  return buildExerciseCatalog().exercises
    .filter((ex) => allowed.has(ex.courseId) && canAccessCourse(ex, viewerFromAuth(auth)))
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

export type ExerciseSheetNav = {
  index: number;
  total: number;
  marker: string;
  previous: { id: string; label: string } | null;
  next: { id: string; label: string } | null;
};

function sheetMarker(label: string, index: number) {
  const match = label.match(/^(\d+(?:\.\d+)*)\b/);
  return match?.[1] ?? String(index);
}

/** Editor exercises of the same sheet, in fiche order. Course points and non-editor sections are already absent from the catalog. */
export async function getExerciseSheetNav(exerciseId: string): Promise<ExerciseSheetNav | null> {
  const id = String(exerciseId || '').trim();
  if (!id || id.length > 200) return null;

  const auth = await getAuthContext();
  if (!auth.user) return null;

  const { exercises } = buildExerciseCatalog();
  const current = exercises.find((item) => item.id === id);
  if (!current || !canAccessCourse(current, viewerFromAuth(auth))) return null;

  const sheet = exercises.filter((item) => item.courseId === current.courseId && canAccessCourse(item, viewerFromAuth(auth)));
  const position = sheet.findIndex((item) => item.id === current.id);
  if (position < 0 || sheet.length === 0) return null;

  const index = position + 1;
  return {
    index,
    total: sheet.length,
    marker: sheetMarker(current.label, index),
    previous: position > 0 ? { id: sheet[position - 1].id, label: sheet[position - 1].label } : null,
    next: position < sheet.length - 1 ? { id: sheet[position + 1].id, label: sheet[position + 1].label } : null,
  };
}

export async function getExerciseById(exerciseId: string): Promise<LabExercise | null> {
  const id = String(exerciseId || '').trim();
  if (!id || id.length > 200) return null;

  const auth = await getAuthContext();
  if (!auth.user) return null;

  const exercise = buildExerciseCatalog().exercises.find((item) => item.id === id);
  if (!exercise || !canAccessCourse(exercise, viewerFromAuth(auth))) return null;
  return toPublicExercise(exercise);
}

/** Exercice présent sur une fiche, mais pas réalisable dans l'éditeur Python/SQL. */
/** Exercice à réponse écrite que l'utilisateur connecté a le droit de voir. */
export async function findWrittenExercise(exerciseId: string): Promise<Omit<WrittenExercise, 'audience'> | null> {
  const id = String(exerciseId || '').trim();
  if (!id || id.length > 200) return null;

  const auth = await getAuthContext();
  if (!auth.user) return null;

  const exercise = buildExerciseCatalog().written.find((item) => item.id === id);
  if (!exercise || !canAccessCourse(exercise, viewerFromAuth(auth))) return null;
  const { audience: _audience, ...rest } = exercise;
  return rest;
}

/** Libellés de tous les exercices, éditeur et réponse écrite : pour l'écran de correction. */
export async function listExerciseLabels(): Promise<Record<string, { label: string; courseTitle: string; pagePath?: string }>> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return {};
  const { exercises, written } = buildExerciseCatalog();
  const labels: Record<string, { label: string; courseTitle: string; pagePath?: string }> = {};
  for (const item of [...exercises, ...written]) {
    labels[item.id] = { label: item.label, courseTitle: item.courseTitle, pagePath: item.pagePath };
  }
  return labels;
}

export async function getExternalExercise(exerciseId: string): Promise<ExternalExercise | null> {
  const id = String(exerciseId || '').trim();
  if (!id || id.length > 200) return null;

  const auth = await getAuthContext();
  if (!auth.user) return null;

  const exercise = buildExerciseCatalog().external.find((item) => item.id === id);
  if (!exercise || !canAccessCourse(exercise, viewerFromAuth(auth))) {
    return null;
  }
  const { audience: _audience, ...rest } = exercise;
  return rest;
}

export type ExerciseCheckResult = {
  report: RunReport;
  newBadge: boolean;
  newAchievements: Achievement[];
  /** False for an admin or enseignant: the check is shown, nothing is stored. */
  recorded: boolean;
};

const CHECK_CODE_LIMIT = 60_000;

function unavailableCheck(): ExerciseCheckResult {
  return { report: testsUnavailableReport(), newBadge: false, newAchievements: [], recorded: false };
}

function previewNote(report: RunReport) {
  return everyTestPassed(report)
    ? 'Cette solution serait validée.'
    : 'Cette solution ne serait pas validée.';
}

/** Grade on the server. The verification source stays here; the browser receives the report only. */
export async function checkExerciseSolution(exerciseId: string, code: string): Promise<ExerciseCheckResult> {
  const id = String(exerciseId || '').trim();
  const source = String(code ?? '');
  if (!id || id.length > 200 || source.length > CHECK_CODE_LIMIT) return unavailableCheck();

  const auth = await getAuthContext();
  if (!auth.user || !canOpenExerciseIde(auth.role)) return unavailableCheck();

  const exercise = buildExerciseCatalog().exercises.find((item) => item.id === id);
  const verification = exercise?.verificationCode?.trim() || '';
  if (!exercise || !verification || !canAccessCourse(exercise, viewerFromAuth(auth))) return unavailableCheck();

  let report: RunReport;
  try {
    report = exercise.type === 'sql'
      ? await runSqlCheck(source, verification, exercise.sqlSetup ?? '')
      : await runPythonCheck(source, verification, exercise.pythonPackages ?? []);
  } catch {
    report = unexpectedRunReport(CHECK_UNAVAILABLE);
  }

  if (auth.isElevated) {
    return {
      report: { ...report, validationNote: previewNote(report) },
      newBadge: false,
      newAchievements: [],
      recorded: false,
    };
  }

  const passed = everyTestPassed(report);
  // Chaque essai vérifié est gardé : l'enseignant relit le code, et peut valider un essai que les tests refusent.
  await recordSubmission({
    userId: auth.user.id,
    exerciseId: exercise.id,
    courseId: exercise.courseId,
    kind: 'code',
    content: source,
    passed,
    status: passed ? 'auto' : 'en_attente',
  });

  if (!passed) {
    return { report, newBadge: false, newAchievements: [], recorded: false };
  }

  const { saveValidatedExercise } = await import('@/app/actions/progress');
  const saved = await saveValidatedExercise({
    exerciseId: exercise.id,
    courseId: exercise.courseId,
    courseTitle: exercise.courseTitle,
  });
  if (saved.error) {
    return {
      report: { ...report, saveWarning: SAVE_WARNING },
      newBadge: false,
      newAchievements: [],
      recorded: false,
    };
  }

  return {
    report,
    newBadge: saved.newBadge,
    newAchievements: saved.newAchievements ?? [],
    recorded: true,
  };
}
