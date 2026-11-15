'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { contentRoot } from '@/lib/content-path';
import { getAllExercises } from '@/app/actions/getExercises';
import { getStudentCard, type StudentCard } from '@/app/actions/studentCard';
import { parseEvaluationSubject } from '@/lib/evaluation-subject';
import { buildCatchUpDraft, DRAFT_EXERCISES, extractSection, hasPostIt, pickCatchUpExercises } from '@/lib/catch-up';
import { CATCH_UP_UNDER, classStanding, studentAverages, studentPosition, type ClassStanding, type StudentPosition } from '@/lib/student-overview';

/*
 * Élèves vus par l'enseignant : cartes (moyenne et place dans la classe, ou prochain cours particulier), détail d'un
 * élève, fiches particulières et fiches de rattrapage. Les fiches reposent sur les évaluations (kind « travail » ou
 * « rattrapage », students = élèves visés). Réservé à l'enseignant.
 */

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };
const fail = (error: string) => ({ ok: false as const, error });

async function teacher() {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  return { auth, supabase: await createClient() };
}

/** Notes validées des évaluations de classe (ni rattrapage ni fiche particulière). */
async function classGrades(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data, error } = await supabase
    .from('evaluation_attempts')
    .select('user_id, result, evaluations!inner(kind)')
    .eq('status', 'rendue')
    .not('result', 'is', null)
    .eq('evaluations.kind', 'evaluation')
    .limit(5000);
  if (error) {
    // Colonne kind absente (migration pas encore passée) : toutes les évaluations comptent.
    const fallback = await supabase.from('evaluation_attempts').select('user_id, result').eq('status', 'rendue').not('result', 'is', null).limit(5000);
    return ((fallback.data ?? []) as any[]).map((row) => ({ userId: row.user_id as string, total: Number(row.result?.total) }));
  }
  return ((data ?? []) as any[]).map((row) => ({ userId: row.user_id as string, total: Number(row.result?.total) }));
}

export type StudentTile = {
  id: string;
  name: string;
  classe: string | null;
  level: string | null;
  privateLessons: boolean;
  /** Élève de classe : moyenne et place, ou null sans note validée. */
  position: StudentPosition | null;
  grades: number;
  /** Cours particulier : prochain cours. */
  nextLesson: { at: string; title: string | null } | null;
};

export type StudentsOverview = {
  tiles: Record<string, StudentTile>;
  /** Moyenne et médiane de chaque classe (moyennes des élèves notés). */
  classes: Record<string, { mean: number | null; median: number | null; count: number }>;
};

export async function getStudentsOverview(): Promise<StudentsOverview | null> {
  const ctx = await teacher();
  if (!ctx) return null;
  const { supabase } = ctx;
  const [{ data: students }, grades, lessons] = await Promise.all([
    supabase.from('profiles').select('id, full_name, email, level, classe, has_private_lessons').eq('role', 'student'),
    classGrades(supabase),
    supabase.from('lessons').select('student_id, starts_at, title').gte('starts_at', new Date().toISOString()).order('starts_at', { ascending: true }).limit(500),
  ]);
  const averages = studentAverages(grades);
  const byClass = new Map<string, number[]>();
  for (const student of (students ?? []) as any[]) {
    const classe = (student.classe ?? '').trim();
    const mine = averages.get(student.id);
    if (!classe || student.has_private_lessons || !mine) continue;
    byClass.set(classe, [...(byClass.get(classe) ?? []), mine.average]);
  }
  const standings = new Map<string, ClassStanding>([...byClass].map(([classe, values]) => [classe, classStanding(values)]));
  const nextLesson = new Map<string, { at: string; title: string | null }>();
  for (const lesson of (lessons.data ?? []) as any[]) {
    if (!nextLesson.has(lesson.student_id)) nextLesson.set(lesson.student_id, { at: lesson.starts_at, title: lesson.title ?? null });
  }

  const tiles: Record<string, StudentTile> = {};
  for (const student of (students ?? []) as any[]) {
    const classe = (student.classe ?? '').trim() || null;
    const mine = averages.get(student.id);
    const standing = classe ? standings.get(classe) : undefined;
    tiles[student.id] = {
      id: student.id,
      name: student.full_name || student.email || 'Élève',
      classe,
      level: student.level ?? null,
      privateLessons: Boolean(student.has_private_lessons),
      position: mine && standing && !student.has_private_lessons ? studentPosition(mine.average, standing) : null,
      grades: mine?.count ?? 0,
      nextLesson: nextLesson.get(student.id) ?? null,
    };
  }
  return {
    tiles,
    classes: Object.fromEntries([...standings].map(([classe, standing]) => [classe, { mean: standing.mean, median: standing.median, count: standing.averages.length }])),
  };
}

export type StudentDetail = {
  card: StudentCard;
  position: StudentPosition | null;
  /** Moyennes de la classe, pour la jauge. */
  classAverages: number[];
  classMean: number | null;
  classMedian: number | null;
  challengesPassed: number;
  challengesTried: number;
  sheetsDone: number;
  recent: { id: string; label: string; at: string; passed: boolean | null }[];
  nextLesson: { at: string; title: string | null } | null;
  /** Fiches particulières et de rattrapage déjà données à l'élève. */
  sheets: { id: string; title: string; kind: string; status: string; createdAt: string }[];
};

export async function getStudentDetail(studentId: string): Promise<StudentDetail | null> {
  const ctx = await teacher();
  if (!ctx) return null;
  const card = await getStudentCard(studentId);
  if (!card) return null;
  const { supabase } = ctx;
  const [grades, classmates, challenges, submissions, badges, lesson, sheets, catalog] = await Promise.all([
    classGrades(supabase),
    card.student.classe && !card.student.privateLessons
      ? supabase.from('profiles').select('id').eq('role', 'student').eq('classe', card.student.classe)
      : Promise.resolve({ data: [] as any[] }),
    supabase.from('challenge_submissions').select('passed').eq('user_id', studentId),
    supabase
      .from('exercise_submissions')
      .select('exercise_id, created_at, passed')
      .eq('user_id', studentId)
      .order('created_at', { ascending: false })
      .limit(40),
    supabase.from('badges').select('course_id', { count: 'exact' }).eq('user_id', studentId),
    supabase.from('lessons').select('starts_at, title').eq('student_id', studentId).gte('starts_at', new Date().toISOString()).order('starts_at').limit(1),
    supabase
      .from('evaluations')
      .select('id, title, kind, status, created_at')
      .contains('students', [studentId])
      .order('created_at', { ascending: false })
      .limit(20),
    getAllExercises(),
  ]);

  const averages = studentAverages(grades);
  const mates = new Set(((classmates.data ?? []) as any[]).map((row) => row.id));
  const classValues = [...mates].map((id) => averages.get(id)?.average).filter((value): value is number => value !== undefined);
  const standing = classStanding(classValues);
  const mine = averages.get(studentId);

  const labels = new Map(catalog.map((exercise) => [exercise.id, exercise.label]));
  const seen = new Set<string>();
  const recent: StudentDetail['recent'] = [];
  for (const row of (submissions.data ?? []) as any[]) {
    if (seen.has(row.exercise_id)) continue;
    seen.add(row.exercise_id);
    recent.push({ id: row.exercise_id, label: labels.get(row.exercise_id) ?? row.exercise_id, at: row.created_at, passed: row.passed });
    if (recent.length >= 6) break;
  }
  const challengeRows = (challenges.data ?? []) as { passed: boolean }[];

  return {
    card,
    position: mine && classValues.length ? studentPosition(mine.average, standing) : null,
    classAverages: standing.averages,
    classMean: standing.mean,
    classMedian: standing.median,
    challengesPassed: challengeRows.filter((row) => row.passed).length,
    challengesTried: challengeRows.length,
    sheetsDone: new Set(((badges.data ?? []) as any[]).map((row) => row.course_id)).size,
    recent,
    nextLesson: ((lesson.data ?? []) as any[])[0] ? { at: (lesson.data as any[])[0].starts_at, title: (lesson.data as any[])[0].title ?? null } : null,
    sheets: sheets.error ? [] : ((sheets.data ?? []) as any[]).map((row) => ({ id: row.id, title: row.title, kind: row.kind, status: row.status, createdAt: row.created_at })),
  };
}

// ---------- Rattrapage ----------

export type CatchUpStudent = { id: string; name: string; total: number; notions: string[]; alreadyGiven: boolean };
export type CatchUpGroup = { evaluationId: string; title: string; classe: string; closedAt: string | null; students: CatchUpStudent[] };

/** Pour chaque classe : la dernière évaluation fermée, et les élèves dont la note validée est sous 12. */
export async function getCatchUpCandidates(): Promise<CatchUpGroup[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  const { supabase } = ctx;
  const { data: evaluations, error } = await supabase
    .from('evaluations')
    .select('id, title, classes, closed_at, created_at')
    .eq('status', 'fermee')
    .eq('kind', 'evaluation')
    .order('closed_at', { ascending: false, nullsFirst: false })
    .limit(40);
  if (error || !evaluations?.length) return [];

  // La dernière évaluation fermée de chaque classe.
  const latest = new Map<string, any>();
  for (const evaluation of evaluations as any[]) {
    for (const classe of evaluation.classes ?? []) if (!latest.has(classe)) latest.set(classe, evaluation);
  }
  const ids = [...new Set([...latest.values()].map((evaluation) => evaluation.id))];
  const [{ data: attempts }, { data: profiles }, { data: given }] = await Promise.all([
    supabase.from('evaluation_attempts').select('evaluation_id, user_id, result').in('evaluation_id', ids).eq('status', 'rendue').not('result', 'is', null),
    supabase.from('profiles').select('id, full_name, classe').eq('role', 'student'),
    supabase.from('evaluations').select('students, from_evaluation').eq('kind', 'rattrapage').in('from_evaluation', ids),
  ]);
  const people = new Map(((profiles ?? []) as any[]).map((row) => [row.id, row]));
  const done = new Set<string>();
  for (const row of (given ?? []) as any[]) for (const id of row.students ?? []) done.add(`${row.from_evaluation}:${id}`);

  return [...latest]
    .map(([classe, evaluation]) => ({
      evaluationId: evaluation.id,
      title: evaluation.title,
      classe,
      closedAt: evaluation.closed_at ?? null,
      students: ((attempts ?? []) as any[])
        .filter((row) => row.evaluation_id === evaluation.id && people.get(row.user_id)?.classe === classe)
        .map((row) => ({
          id: row.user_id,
          name: people.get(row.user_id)?.full_name || 'Élève',
          total: Number(row.result?.total),
          notions: [...new Set(((row.result?.exercises ?? []) as any[]).flatMap((exercise) => exercise.review ?? []))] as string[],
          alreadyGiven: done.has(`${evaluation.id}:${row.user_id}`),
        }))
        .filter((student) => Number.isFinite(student.total) && student.total < CATCH_UP_UNDER)
        .sort((a, b) => a.total - b.total || a.name.localeCompare(b.name, 'fr')),
    }))
    .filter((group) => group.students.length > 0)
    .sort((a, b) => a.classe.localeCompare(b.classe, 'fr', { numeric: true }));
}

function sheetFile(fileName: string) {
  const root = contentRoot();
  for (const folder of fs.existsSync(root) ? fs.readdirSync(root) : []) {
    for (const extension of ['.md', '.mdx']) {
      const candidate = path.join(root, folder, `${fileName}${extension}`);
      if (fs.existsSync(candidate)) return candidate;
    }
  }
  return null;
}

/**
 * Brouillon de fiche de rattrapage : des exercices Introduction à Moyen des fiches qui correspondent aux notions
 * manquées (du niveau de la classe), avec post-it de préférence, sans indices. L'enseignant le relit avant l'envoi.
 */
export async function draftCatchUpSheet(notions: string[], level: string | null): Promise<{ source: string; picked: string[] }> {
  const ctx = await teacher();
  if (!ctx) return { source: '', picked: [] };
  const wanted = notions.length ? notions : ['fonctions'];
  // Quelques exercices de plus que nécessaire : un bloc introuvable dans son fichier est remplacé par le suivant.
  const picked = pickCatchUpExercises(await getAllExercises(), wanted, level, DRAFT_EXERCISES + 4);
  const files = new Map<string, string>();
  const sections: string[] = [];
  const ids: string[] = [];
  for (const exercise of picked) {
    if (sections.length >= DRAFT_EXERCISES) break;
    const file = sheetFile(exercise.fileName);
    if (!file) continue;
    if (!files.has(file)) files.set(file, fs.readFileSync(file, 'utf8'));
    const section = extractSection(files.get(file)!, exercise.id);
    if (!section) continue;
    sections.push(section);
    ids.push(exercise.id);
  }
  sections.sort((a, b) => Number(hasPostIt(b)) - Number(hasPostIt(a)));
  return { source: buildCatchUpDraft(sections, wanted), picked: ids };
}

// ---------- Création d'une fiche pour des élèves ----------

export type SheetInput = {
  kind: 'travail' | 'rattrapage';
  students: string[];
  title: string;
  source: string;
  durationMinutes?: number | null;
  /** Rattrapage : l'évaluation d'origine (pour ne pas proposer deux fois le même rattrapage). */
  fromEvaluation?: string | null;
};

/** Vérifie le sujet sans rien enregistrer : erreurs, remarques, exercices (pour l'aperçu). */
export async function checkSheetSource(source: string, kind: 'travail' | 'rattrapage') {
  const parsed = parseEvaluationSubject(String(source || ''), { hints: kind !== 'rattrapage' });
  return { errors: parsed.errors, warnings: parsed.warnings, exercises: parsed.exercises };
}

/** Crée la fiche (une évaluation visant ces élèves), l'ouvre tout de suite et enregistre son sujet. */
export async function createStudentSheet(input: SheetInput): Promise<Result<{ id: string }>> {
  const ctx = await teacher();
  if (!ctx) return fail('Réservé à l’enseignant.');
  const kind = input.kind === 'rattrapage' ? 'rattrapage' : 'travail';
  const students = [...new Set((input.students ?? []).filter((id) => /^[0-9a-f-]{36}$/i.test(id)))];
  if (students.length === 0) return fail('Choisir au moins un élève.');
  const title = String(input.title || '').trim().slice(0, 200) || (kind === 'rattrapage' ? 'Fiche de rattrapage' : 'Fiche de travail');
  const source = String(input.source || '');
  if (source.length > 200000) return fail('La fiche dépasse 200 000 caractères.');
  const parsed = parseEvaluationSubject(source, { hints: kind !== 'rattrapage' });
  if (parsed.errors.length) return fail(`La fiche contient des erreurs : ${parsed.errors.join(' ')}`);
  const duration = input.durationMinutes ? Math.round(Number(input.durationMinutes)) : null;

  const now = new Date().toISOString();
  const { data, error } = await ctx.supabase
    .from('evaluations')
    .insert({
      title,
      description: '',
      from_evaluation: kind === 'rattrapage' && input.fromEvaluation && /^[0-9a-f-]{36}$/i.test(input.fromEvaluation) ? input.fromEvaluation : null,
      classes: [],
      students,
      kind,
      status: 'ouverte',
      opened_at: now,
      scheduled_at: now,
      duration_minutes: duration && duration >= 5 && duration <= 600 ? duration : null,
      created_by: ctx.auth.user!.id,
    })
    .select('id')
    .single();
  if (error || !data) return fail(error?.message && error.message.length < 200 ? error.message : "La fiche n'a pas pu être créée.");

  const { error: subjectError } = await ctx.supabase
    .from('evaluation_subjects')
    .insert({ evaluation_id: data.id, label: 'Fiche', source, exercises: parsed.exercises, grading: parsed.grading, position: 0 });
  if (subjectError) {
    await ctx.supabase.from('evaluations').delete().eq('id', data.id);
    return fail("Le sujet de la fiche n'a pas pu être enregistré.");
  }
  revalidatePath('/admin/eleves');
  revalidatePath('/admin/evaluations');
  return { ok: true, id: data.id };
}

// ---------- Évaluation de révision ----------

export type RevisionSourceStudent = { id: string; name: string; classe: string | null; level: string | null; total: number; notions: string[]; alreadyRevised: boolean };
export type RevisionSource = { id: string; title: string; classes: string[]; closedAt: string | null; validated: number; students: RevisionSourceStudent[] };

/** Interrogations de classe fermées (les plus récentes d'abord), avec chaque copie validée : note et notions manquées. */
export async function listRevisionSources(): Promise<RevisionSource[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  const { supabase } = ctx;
  const { data: evaluations, error } = await supabase
    .from('evaluations')
    .select('id, title, classes, closed_at, created_at')
    .eq('status', 'fermee')
    .eq('kind', 'evaluation')
    .order('closed_at', { ascending: false, nullsFirst: false })
    .limit(30);
  if (error || !evaluations?.length) return [];
  const ids = evaluations.map((row: any) => row.id);
  const [{ data: attempts }, { data: revisions }] = await Promise.all([
    supabase.from('evaluation_attempts').select('evaluation_id, user_id, result').in('evaluation_id', ids).eq('status', 'rendue').not('result', 'is', null),
    supabase.from('evaluations').select('students, from_evaluation').eq('kind', 'rattrapage').in('from_evaluation', ids),
  ]);
  const userIds = [...new Set(((attempts ?? []) as any[]).map((row) => row.user_id))];
  const { data: profiles } = userIds.length
    ? await supabase.from('profiles').select('id, full_name, classe, level').in('id', userIds)
    : { data: [] as any[] };
  const people = new Map(((profiles ?? []) as any[]).map((row) => [row.id, row]));
  const revised = new Set<string>();
  for (const row of (revisions ?? []) as any[]) for (const id of row.students ?? []) revised.add(`${row.from_evaluation}:${id}`);

  return (evaluations as any[]).map((evaluation) => {
    const students = ((attempts ?? []) as any[])
      .filter((row) => row.evaluation_id === evaluation.id)
      .map((row) => {
        const person: any = people.get(row.user_id);
        return {
          id: row.user_id as string,
          name: person?.full_name || 'Élève',
          classe: person?.classe ?? null,
          level: person?.level ?? null,
          total: Number(row.result?.total),
          notions: [...new Set(((row.result?.exercises ?? []) as any[]).flatMap((exercise) => exercise.review ?? []))] as string[],
          alreadyRevised: revised.has(`${evaluation.id}:${row.user_id}`),
        };
      })
      .filter((student) => Number.isFinite(student.total))
      .sort((a, b) => a.total - b.total || a.name.localeCompare(b.name, 'fr'));
    return { id: evaluation.id, title: evaluation.title, classes: evaluation.classes ?? [], closedAt: evaluation.closed_at ?? null, validated: students.length, students };
  });
}

export type RevisionInput = {
  fromEvaluation: string;
  students: string[];
  title: string;
  description: string;
  durationMinutes: number | null;
  scheduledAt: string | null;
  /** Préparer un sujet à partir des notions manquées par les élèves choisis (à relire dans l'onglet Sujets). */
  prefill: boolean;
};

/**
 * Évaluation de révision : vise les élèves choisis d'une interrogation fermée, se passe comme une évaluation
 * (page verrouillée, indices retirés, pense-bête gardé) et n'entre pas dans les moyennes. Créée en brouillon, avec sa
 * date de passage ; un sujet est préparé à partir des notions manquées si demandé.
 */
export async function createRevisionEvaluation(input: RevisionInput): Promise<Result<{ id: string; prefilled: boolean }>> {
  const ctx = await teacher();
  if (!ctx) return fail('Réservé à l’enseignant.');
  if (!/^[0-9a-f-]{36}$/i.test(input.fromEvaluation)) return fail("Choisir l'interrogation à réviser.");
  const sources = await listRevisionSources();
  const source = sources.find((item) => item.id === input.fromEvaluation);
  if (!source) return fail("Cette interrogation n'est pas fermée, ou n'a aucune copie validée.");
  const known = new Map(source.students.map((student) => [student.id, student]));
  const students = [...new Set(input.students)].filter((id) => known.has(id));
  if (students.length === 0) return fail('Choisir au moins un élève.');
  const title = String(input.title || '').trim().slice(0, 200) || `Révision : ${source.title}`;
  const duration = input.durationMinutes ? Math.round(Number(input.durationMinutes)) : null;
  const scheduledAt = input.scheduledAt && !Number.isNaN(Date.parse(input.scheduledAt)) ? new Date(input.scheduledAt).toISOString() : null;
  if (!scheduledAt) return fail("Choisir la date et l'heure de passage.");

  const { data, error } = await ctx.supabase
    .from('evaluations')
    .insert({
      title,
      description: String(input.description || '').trim().slice(0, 4000),
      classes: [],
      students,
      kind: 'rattrapage',
      from_evaluation: source.id,
      status: 'brouillon',
      scheduled_at: scheduledAt,
      duration_minutes: duration && duration >= 5 && duration <= 600 ? duration : null,
      created_by: ctx.auth.user!.id,
    })
    .select('id')
    .single();
  if (error || !data) return fail(error?.message && error.message.length < 200 ? error.message : "L'évaluation de révision n'a pas pu être créée.");

  let prefilled = false;
  if (input.prefill) {
    const chosen = students.map((id) => known.get(id)!);
    const notions = [...new Set(chosen.flatMap((student) => student.notions))];
    const levels = chosen.map((student) => student.level).filter(Boolean) as string[];
    const level = levels.sort((a, b) => levels.filter((value) => value === b).length - levels.filter((value) => value === a).length)[0] ?? null;
    const draft = await draftCatchUpSheet(notions, level);
    const parsed = parseEvaluationSubject(draft.source, { hints: false });
    if (draft.picked.length && parsed.errors.length === 0) {
      const { error: subjectError } = await ctx.supabase
        .from('evaluation_subjects')
        .insert({ evaluation_id: data.id, label: 'Sujet de révision', source: draft.source, exercises: parsed.exercises, grading: parsed.grading, position: 0 });
      prefilled = !subjectError;
    }
  }
  revalidatePath('/admin/evaluations');
  return { ok: true, id: data.id, prefilled };
}
