'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { getAuthContext } from '@/lib/auth';
import { getAllExercises, type LabExercise } from '@/app/actions/getExercises';
import { parseErrorSummary, type ErrorSummary } from '@/lib/error-notebook';
import { PRACTICE_COLUMNS, toPracticeSession, type PracticeSession } from '@/lib/practice-server';
import {
  buildHistory,
  difficultyRank,
  drawPracticeSubject,
  isProjectChapter,
  matchAssessmentSheets,
  MINI_PROJECT,
  pickRevisionExercises,
  practiceStatement,
  PRACTICE_DURATIONS,
  type PracticeDuration,
  type RevisionExercise,
  type RevisionReason,
  type SheetRef,
} from '@/lib/revisions';

/*
 * Outils de révision de l'espace élève. Lecture par la session de l'élève (RLS) ; le catalogue des fiches
 * vient de getAllExercises (exercices accessibles à l'élève, sans tests ni correction).
 */

export type RevisionAssessment = {
  id: string;
  kind: 'interro' | 'ds';
  title: string;
  day: string;
  time: string | null;
  chapters: string;
  courseIds: string[];
};

export type RevisionItem = {
  id: string;
  label: string;
  courseTitle: string;
  reason: RevisionReason;
  when?: string;
  difficulty: number;
};

export type RevisionPlan = {
  assessment: RevisionAssessment;
  items: RevisionItem[];
  sheets: { courseId: string; courseTitle: string }[];
  unmatched: string[];
  chosen: boolean;
};

type Student = {
  userId: string;
  level: string | null;
  supabase: Awaited<ReturnType<typeof createClient>>;
};

async function student(): Promise<Student | null> {
  const auth = await getAuthContext();
  if (!auth.user || auth.isElevated || auth.role !== 'student') return null;
  const supabase = await createClient();
  const { data } = await supabase.from('profiles').select('level').eq('id', auth.user.id).maybeSingle();
  return { userId: auth.user.id, level: (data?.level as string | null) ?? null, supabase };
}

/** Exercices vérifiables par les tests (Python ou SQL), hors mini-projets et hors fiches de projets. */
async function practicableExercises(): Promise<LabExercise[]> {
  return (await getAllExercises()).filter(
    (exercise) => exercise.hasVerification && difficultyRank(exercise.label) < MINI_PROJECT && !isProjectChapter(exercise.chapter),
  );
}

function sheetsOf(exercises: LabExercise[]): SheetRef[] {
  const sheets = new Map<string, SheetRef>();
  for (const exercise of exercises) {
    if (!sheets.has(exercise.courseId)) {
      sheets.set(exercise.courseId, { courseId: exercise.courseId, courseTitle: exercise.courseTitle, chapter: exercise.chapter, level: exercise.level });
    }
  }
  return [...sheets.values()];
}

const asRevision = (exercise: LabExercise): RevisionExercise => ({
  id: exercise.id,
  label: exercise.label,
  courseId: exercise.courseId,
  courseTitle: exercise.courseTitle,
  chapter: exercise.chapter,
  level: exercise.level,
  type: exercise.type,
  pagePath: exercise.pagePath,
});

async function loadHistory(ctx: Student) {
  const [submissions, progress] = await Promise.all([
    ctx.supabase
      .from('exercise_submissions')
      .select('exercise_id, passed, created_at')
      .eq('user_id', ctx.userId)
      .eq('kind', 'code')
      .order('created_at', { ascending: false })
      .limit(3000),
    ctx.supabase.from('user_progress').select('exercise_id, completed_at').eq('user_id', ctx.userId).limit(3000),
  ]);
  return buildHistory(
    (submissions.data ?? []) as { exercise_id: string; passed: boolean | null; created_at: string }[],
    (progress.data ?? []) as { exercise_id: string; completed_at: string | null }[],
  );
}

async function upcomingAssessments(ctx: Student, days = 14): Promise<RevisionAssessment[]> {
  const { data, error } = await ctx.supabase.rpc('revision_assessments_mine', { p_days: days });
  if (error || !Array.isArray(data)) return [];
  return (data as RevisionAssessment[]).map((item) => ({ ...item, courseIds: Array.isArray(item.courseIds) ? item.courseIds : [] }));
}

// ---------- Révisions avant une interro ----------

/** Pour chaque interro ou DS des 14 prochains jours : les exercices à refaire, pris dans les fiches visées. */
export async function getRevisionPlans(): Promise<RevisionPlan[]> {
  const ctx = await student();
  if (!ctx) return [];
  const assessments = await upcomingAssessments(ctx);
  if (assessments.length === 0) return [];
  const [exercises, history] = await Promise.all([practicableExercises(), loadHistory(ctx)]);
  const sheets = sheetsOf(exercises);
  const now = new Date();

  return assessments.map((assessment) => {
    const match = matchAssessmentSheets(assessment.chapters, sheets, { courseIds: assessment.courseIds, level: ctx.level });
    const ids = new Set(match.sheets.map((sheet) => sheet.courseId));
    const picks = pickRevisionExercises(exercises.filter((exercise) => ids.has(exercise.courseId)).map(asRevision), history, now);
    return {
      assessment,
      items: picks.map((pick) => ({ id: pick.id, label: pick.label, courseTitle: pick.courseTitle, reason: pick.reason, when: pick.when, difficulty: pick.difficulty })),
      sheets: match.sheets.map((sheet) => ({ courseId: sheet.courseId, courseTitle: sheet.courseTitle })),
      unmatched: match.unmatched,
      chosen: match.chosen,
    };
  });
}

// ---------- Carnet d'erreurs ----------

export type NotebookItem = {
  id: string;
  exerciseId: string;
  exerciseLabel: string;
  courseTitle: string;
  createdAt: string;
  code: string;
  summary: ErrorSummary | null;
  fix: { code: string; createdAt: string } | null;
};

const NOTEBOOK_LIMIT = 150;

type SubmissionRow = { id: string; exercise_id: string; content: string; passed: boolean | null; created_at: string; error?: unknown };

/**
 * Erreurs Python passées de l'élève : ses 150 derniers essais refusés sur un exercice Python des fiches,
 * chacun avec le premier essai réussi qui le suit sur le même exercice.
 */
export async function getErrorNotebook(): Promise<NotebookItem[] | null> {
  const ctx = await student();
  if (!ctx) return null;
  const python = new Map((await getAllExercises()).filter((exercise) => exercise.type === 'python').map((exercise) => [exercise.id, exercise]));

  const select = (columns: string) =>
    ctx.supabase
      .from('exercise_submissions')
      .select(columns)
      .eq('user_id', ctx.userId)
      .eq('kind', 'code')
      .order('created_at', { ascending: false })
      .limit(1500);
  let { data, error } = await select('id, exercise_id, content, passed, created_at, error');
  // Base pas encore migrée : le carnet s'affiche, chaque essai sera analysé à l'ouverture.
  if (error) ({ data, error } = await select('id, exercise_id, content, passed, created_at'));
  const rows = ((error ? [] : data) ?? []) as unknown as SubmissionRow[];
  const known = rows.filter((row) => python.has(row.exercise_id));

  const items: NotebookItem[] = [];
  for (const row of known) {
    if (row.passed !== false) continue;
    const at = Date.parse(row.created_at);
    let fix: SubmissionRow | null = null;
    for (const other of known) {
      if (other.passed !== true || other.exercise_id !== row.exercise_id || Date.parse(other.created_at) <= at) continue;
      if (!fix || Date.parse(other.created_at) < Date.parse(fix.created_at)) fix = other;
    }
    const exercise = python.get(row.exercise_id)!;
    items.push({
      id: row.id,
      exerciseId: row.exercise_id,
      exerciseLabel: exercise.label,
      courseTitle: exercise.courseTitle,
      createdAt: row.created_at,
      code: row.content,
      summary: parseErrorSummary(row.error),
      fix: fix ? { code: fix.content, createdAt: fix.created_at } : null,
    });
    if (items.length >= NOTEBOOK_LIMIT) break;
  }
  return items;
}

// ---------- Entraînement chronométré ----------

export type PracticeChoice = { key: string; group: string; label: string; count: number };

export type PracticeExercise = {
  id: string;
  label: string;
  courseTitle: string;
  pagePath?: string;
  difficulty: number;
  statement: string;
  starterCode?: string;
  sqlSetup?: string;
  pythonPackages?: string[];
  type: 'python' | 'sql';
};

export type PracticeRun = Omit<PracticeSession, 'exerciseIds'> & { exercises: PracticeExercise[] };

export type PracticeSetup = {
  choices: PracticeChoice[];
  current: PracticeRun | null;
  history: PracticeRun[];
};

const ASSESSMENT_GROUP = 'Interros et DS à venir';
const kindLabel = (kind: string) => (kind === 'ds' ? 'DS' : 'Interro');

/** Exercices de l'élève au niveau de sa classe (tous les accessibles s'il n'y en a aucun). */
function forLevel(exercises: LabExercise[], level: string | null) {
  const same = level ? exercises.filter((exercise) => exercise.level === level) : [];
  return same.length > 0 ? same : exercises;
}

async function resolveChoice(ctx: Student, key: string, exercises: LabExercise[]): Promise<{ label: string; pool: LabExercise[] } | null> {
  const [type, ...rest] = key.split(':');
  const value = rest.join(':');
  if (type === 'a') {
    const assessment = (await upcomingAssessments(ctx, 60)).find((item) => item.id === value);
    if (!assessment) return null;
    const match = matchAssessmentSheets(assessment.chapters, sheetsOf(exercises), { courseIds: assessment.courseIds, level: ctx.level });
    const ids = new Set(match.sheets.map((sheet) => sheet.courseId));
    const label = `${kindLabel(assessment.kind)}${assessment.title ? ` : ${assessment.title}` : ''}`;
    return { label, pool: exercises.filter((exercise) => ids.has(exercise.courseId)) };
  }
  const own = forLevel(exercises, ctx.level);
  if (type === 'c') return { label: value, pool: own.filter((exercise) => exercise.chapter === value) };
  if (type === 's') {
    const pool = exercises.filter((exercise) => exercise.courseId === value);
    return pool.length ? { label: pool[0].courseTitle, pool } : null;
  }
  return null;
}

function toRun(session: PracticeSession, catalog: Map<string, LabExercise>): PracticeRun {
  const { exerciseIds, ...rest } = session;
  return {
    ...rest,
    exercises: exerciseIds.flatMap((id) => {
      const exercise = catalog.get(id);
      if (!exercise) return [];
      return [{
        id: exercise.id,
        label: exercise.label,
        courseTitle: exercise.courseTitle,
        pagePath: exercise.pagePath,
        difficulty: difficultyRank(exercise.label),
        statement: practiceStatement(exercise.content, exercise.label),
        starterCode: exercise.starterCode,
        sqlSetup: exercise.sqlSetup,
        pythonPackages: exercise.pythonPackages,
        type: exercise.type,
      }];
    }),
  };
}

/** Choix proposés (interros à venir, chapitres, fiches), entraînement en cours et derniers bilans. */
export async function getPracticeSetup(): Promise<PracticeSetup | null> {
  const ctx = await student();
  if (!ctx) return null;
  const exercises = await practicableExercises();
  const catalog = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const sheets = sheetsOf(exercises);

  const choices: PracticeChoice[] = [];
  for (const assessment of await upcomingAssessments(ctx, 60)) {
    const match = matchAssessmentSheets(assessment.chapters, sheets, { courseIds: assessment.courseIds, level: ctx.level });
    const ids = new Set(match.sheets.map((sheet) => sheet.courseId));
    const count = exercises.filter((exercise) => ids.has(exercise.courseId)).length;
    if (count === 0) continue;
    const [year, month, day] = assessment.day.split('-').map(Number);
    const date = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(Date.UTC(year, month - 1, day)));
    choices.push({ key: `a:${assessment.id}`, group: ASSESSMENT_GROUP, label: `${kindLabel(assessment.kind)} du ${date}${assessment.title ? ` : ${assessment.title}` : ''}`, count });
  }
  const own = forLevel(exercises, ctx.level);
  const chapters = new Map<string, LabExercise[]>();
  for (const exercise of own) chapters.set(exercise.chapter, [...(chapters.get(exercise.chapter) ?? []), exercise]);
  for (const [chapter, list] of [...chapters.entries()].sort((a, b) => a[0].localeCompare(b[0], 'fr'))) {
    const bySheet = new Map<string, LabExercise[]>();
    for (const exercise of list) bySheet.set(exercise.courseId, [...(bySheet.get(exercise.courseId) ?? []), exercise]);
    if (bySheet.size > 1) choices.push({ key: `c:${chapter}`, group: chapter, label: `Tout le chapitre (${bySheet.size} fiches)`, count: list.length });
    for (const [courseId, sheet] of bySheet) choices.push({ key: `s:${courseId}`, group: chapter, label: sheet[0].courseTitle, count: sheet.length });
  }

  const { data } = await ctx.supabase
    .from('practice_sessions')
    .select(PRACTICE_COLUMNS)
    .eq('user_id', ctx.userId)
    .order('started_at', { ascending: false })
    .limit(10);
  const sessions = ((data ?? []) as Parameters<typeof toPracticeSession>[0][]).map((row) => toPracticeSession(row));
  const current = sessions.find((session) => session.running) ?? null;
  return {
    choices,
    current: current ? toRun(current, catalog) : null,
    history: sessions.filter((session) => session !== current).map((session) => toRun(session, catalog)),
  };
}

export async function startPractice(key: string, minutes: number): Promise<{ ok: true; run: PracticeRun } | { ok: false; error: string }> {
  const ctx = await student();
  if (!ctx) return { ok: false, error: 'Réservé aux comptes élève.' };
  if (!PRACTICE_DURATIONS.includes(minutes as PracticeDuration)) return { ok: false, error: 'Durée inconnue.' };
  const exercises = await practicableExercises();
  const choice = await resolveChoice(ctx, String(key || ''), exercises);
  if (!choice || choice.pool.length === 0) return { ok: false, error: 'Aucun exercice à tirer pour ce choix.' };

  const history = await loadHistory(ctx);
  const solved = new Set(Object.entries(history).filter(([, item]) => item.passedAt).map(([id]) => id));
  const subject = drawPracticeSubject(choice.pool.map(asRevision), minutes as PracticeDuration, { solved });
  const { data, error } = await ctx.supabase.rpc('practice_start', {
    p_label: choice.label,
    p_exercise_ids: subject.map((exercise) => exercise.id),
    p_minutes: minutes,
  });
  const started = data as { id?: string; startedAt?: string } | null;
  if (error || !started?.id || !started.startedAt) return { ok: false, error: "L'entraînement n'a pas pu commencer." };
  const session: PracticeSession = {
    id: started.id,
    label: choice.label,
    exerciseIds: subject.map((exercise) => exercise.id),
    minutes,
    solved: [],
    startedAt: started.startedAt,
    finishedAt: null,
    running: true,
  };
  return { ok: true, run: toRun(session, new Map(exercises.map((exercise) => [exercise.id, exercise]))) };
}

/** Fin de l'entraînement (bouton ou temps écoulé) : renvoie le bilan relu en base. */
export async function finishPractice(id: string): Promise<PracticeRun | null> {
  const ctx = await student();
  if (!ctx || !/^[0-9a-f-]{36}$/i.test(String(id))) return null;
  await ctx.supabase.rpc('practice_finish', { p_id: id });
  const { data } = await ctx.supabase.from('practice_sessions').select(PRACTICE_COLUMNS).eq('id', id).eq('user_id', ctx.userId).maybeSingle();
  if (!data) return null;
  const exercises = await practicableExercises();
  revalidatePath('/espace/entrainement');
  return toRun(toPracticeSession(data as Parameters<typeof toPracticeSession>[0]), new Map(exercises.map((exercise) => [exercise.id, exercise])));
}

// ---------- Enseignant ----------

export type AdminPracticeSession = {
  id: string;
  studentName: string;
  classe: string | null;
  label: string;
  minutes: number;
  exercises: number;
  startedAt: string;
};

/** Entraînements des 30 derniers jours : qui, quand, sur quoi. Ni note ni nombre d'exercices réussis. */
export async function listPracticeSessions(): Promise<AdminPracticeSession[]> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return [];
  const supabase = await createClient();
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const { data, error } = await supabase
    .from('practice_sessions')
    .select(`${PRACTICE_COLUMNS}, user_id`)
    .gte('started_at', since)
    .order('started_at', { ascending: false })
    .limit(200);
  if (error || !data?.length) return [];
  const ids = [...new Set(data.map((row) => String(row.user_id)))];
  const names = new Map<string, { name: string; classe: string | null }>();
  const reader = createAdminClient() ?? supabase;
  const { data: profiles } = await reader.from('profiles').select('id, full_name, classe').in('id', ids);
  for (const profile of profiles ?? []) names.set(String(profile.id), { name: String(profile.full_name || 'Élève'), classe: (profile.classe as string | null) ?? null });
  return data.map((row) => {
    const session = toPracticeSession(row as Parameters<typeof toPracticeSession>[0]);
    const who = names.get(String(row.user_id));
    return {
      id: session.id,
      studentName: who?.name ?? 'Élève',
      classe: who?.classe ?? null,
      label: session.label,
      minutes: session.minutes,
      exercises: session.exerciseIds.length,
      startedAt: session.startedAt,
    };
  });
}
