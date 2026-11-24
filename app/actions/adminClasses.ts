'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { listTrackedExercises } from '@/app/actions/getExercises';
import { getStudentDetail, type StudentDetail } from '@/app/actions/studentSheets';
import { buildClassesBoard, type ClassesBoard } from '@/lib/admin-classes';
import { buildParentWork, type ParentWork } from '@/lib/parent-meeting';
import { awardedCourseIds } from '@/lib/student-progress';

/*
 * Onglets « Classes » et « Réunion parents » de l'admin : notes validées de chaque élève, statistiques de chaque
 * classe, et bilan d'un élève (place dans la classe, évaluations, fiches d'exercices). Réservé à l'enseignant.
 */

type Supabase = Awaited<ReturnType<typeof createClient>>;

type AttemptRow = { user_id: string; evaluation_id: string; total: string | null };
type ChallengeResultRow = { challenge_id: string; user_id: string; passed: boolean };
type ProgressRow = { exercise_id: string; completed_at: string | null };
type SubmissionRow = { exercise_id: string; created_at: string };

const PAGE = 1000;
const MAX_PAGES = 20;

/** Toutes les lignes d'une requête, page par page : l'API n'en renvoie qu'un millier à la fois. */
async function allRows<T>(query: (from: number, to: number) => PromiseLike<{ data: unknown[] | null; error: unknown }>): Promise<T[]> {
  const rows: T[] = [];
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const { data, error } = await query(page * PAGE, page * PAGE + PAGE - 1);
    if (error || !data) break;
    rows.push(...(data as T[]));
    if (data.length < PAGE) break;
  }
  return rows;
}

/** Évaluations de classe (ni rattrapage ni fiche particulière). */
async function classEvaluations(supabase: Supabase) {
  const columns = 'id, title, classes, created_at, opened_at, scheduled_at';
  const { data, error } = await supabase.from('evaluations').select(`${columns}, kind`).eq('kind', 'evaluation');
  // Colonne kind absente (migration pas encore passée) : toutes les évaluations comptent.
  const rows = error ? ((await supabase.from('evaluations').select(columns)).data ?? []) : (data ?? []);
  return (rows as any[]).map((row) => ({
    id: String(row.id),
    title: String(row.title ?? 'Évaluation'),
    classes: (row.classes ?? []) as string[],
    at: String(row.opened_at ?? row.scheduled_at ?? row.created_at),
  }));
}

export async function getClassesBoard(): Promise<ClassesBoard | null> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  const supabase = await createClient();

  const [profiles, evaluations, attempts, challenges, results] = await Promise.all([
    supabase.from('profiles').select('id, full_name, email, classe, level, has_private_lessons').eq('role', 'student'),
    classEvaluations(supabase),
    allRows<AttemptRow>((from, to) =>
      supabase.from('evaluation_attempts').select('user_id, evaluation_id, total:result->>total').eq('status', 'rendue').order('id').range(from, to),
    ),
    supabase.from('challenges').select('id, classes, opens_at'),
    allRows<ChallengeResultRow>((from, to) =>
      supabase.from('challenge_submissions').select('challenge_id, user_id, passed').order('challenge_id').order('user_id').range(from, to),
    ),
  ]);

  const students = ((profiles.data ?? []) as any[])
    .filter((row) => !row.has_private_lessons && (row.classe ?? '').trim())
    .map((row) => ({ id: String(row.id), name: row.full_name || row.email || 'Élève', classe: String(row.classe).trim(), level: row.level ?? null }));

  return buildClassesBoard({
    now: new Date(),
    students,
    evaluations,
    attempts: attempts.map((row: AttemptRow) => ({ userId: row.user_id, evaluationId: row.evaluation_id, total: row.total === null ? null : Number(row.total) })),
    challenges: ((challenges.data ?? []) as any[]).map((row) => ({ id: String(row.id), classes: row.classes ?? [], opensAt: String(row.opens_at) })),
    challengeResults: results.map((row: ChallengeResultRow) => ({ challengeId: row.challenge_id, userId: row.user_id, passed: Boolean(row.passed) })),
  });
}

export type ParentReport = { detail: StudentDetail; work: ParentWork };

/** Bilan d'un élève pour la réunion parents-professeur. */
export async function getParentReport(studentId: string): Promise<ParentReport | null> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  const detail = await getStudentDetail(studentId);
  if (!detail) return null;
  const supabase = await createClient();

  const [catalog, progress, submissions, badges, achievements] = await Promise.all([
    listTrackedExercises(),
    allRows<ProgressRow>((from, to) =>
      supabase.from('user_progress').select('exercise_id, completed_at').eq('user_id', studentId).order('exercise_id').range(from, to),
    ),
    allRows<SubmissionRow>((from, to) =>
      supabase.from('exercise_submissions').select('exercise_id, created_at').eq('user_id', studentId).order('created_at', { ascending: false }).range(from, to),
    ),
    supabase.from('badges').select('course_id').eq('user_id', studentId),
    supabase.from('user_achievements').select('achievement_id').eq('user_id', studentId),
  ]);

  const work = buildParentWork({
    level: detail.card.student.level,
    catalog,
    progress: progress.map((row: ProgressRow) => ({ exerciseId: row.exercise_id, at: row.completed_at })),
    submissions: submissions.map((row: SubmissionRow) => ({ exerciseId: row.exercise_id, at: row.created_at })),
    awarded: awardedCourseIds(
      ((badges.data ?? []) as any[]).map((row) => row.course_id),
      ((achievements.data ?? []) as any[]).map((row) => row.achievement_id),
    ),
  });
  return { detail, work };
}
