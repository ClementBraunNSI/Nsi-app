'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { activityHeat, gradeStats, weekCount, type GradeStats, type HeatDay } from '@/lib/student-card';

/*
 * Fiche d'un élève : identité, chiffres, notes d'évaluation situées dans la classe, activité des six dernières
 * semaines et liste des élèves de la même classe (pour passer de l'un à l'autre). Réservé à l'enseignant.
 */

export type StudentCardEvaluation = {
  id: string;
  title: string;
  status: string;
  attemptId: string;
  submittedAt: string | null;
  /** Note validée, ou null tant que la copie est à valider. */
  grade: number | null;
  handedIn: boolean;
  stats: GradeStats;
};

export type StudentCard = {
  student: {
    id: string;
    name: string;
    email: string | null;
    level: string | null;
    classe: string | null;
    privateLessons: boolean;
  };
  lastWorkAt: string | null;
  exercisesDone: number;
  badges: number;
  weekExercises: number;
  /** Essais des 7 derniers jours dont la saisie est jugée suspecte. */
  suspects: number;
  heat: HeatDay[];
  evaluations: StudentCardEvaluation[];
  /** Moyenne des notes validées de l'élève. */
  average: number | null;
  classmates: { id: string; name: string }[];
};

const UUID = /^[0-9a-f-]{36}$/i;

export async function getStudentCard(studentId: string): Promise<StudentCard | null> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated || !UUID.test(studentId)) return null;
  const supabase = await createClient();
  const now = new Date();
  const since = new Date(now.getTime() - 43 * 86_400_000).toISOString();
  const weekAgo = new Date(now.getTime() - 7 * 86_400_000).toISOString();

  const [{ data: profile }, submissions, progress, progressCount, badges, attempts] = await Promise.all([
    supabase.from('profiles').select('id, full_name, email, level, classe, has_private_lessons, role').eq('id', studentId).maybeSingle(),
    supabase
      .from('exercise_submissions')
      .select('exercise_id, created_at, severity:typing->summary->>severity')
      .eq('user_id', studentId)
      .gte('created_at', since)
      .order('created_at', { ascending: false })
      .limit(3000),
    supabase.from('user_progress').select('exercise_id, completed_at').eq('user_id', studentId).gte('completed_at', since).limit(3000),
    supabase.from('user_progress').select('exercise_id', { count: 'exact', head: true }).eq('user_id', studentId),
    supabase.from('badges').select('id', { count: 'exact', head: true }).eq('user_id', studentId),
    supabase
      .from('evaluation_attempts')
      .select('id, status, submitted_at, result, evaluations(id, title, status, created_at)')
      .eq('user_id', studentId),
  ]);
  if (!profile || profile.role !== 'student') return null;

  const rows = (submissions.data ?? []) as unknown as { exercise_id: string; created_at: string; severity: string | null }[];
  const done = (progress.data ?? []) as { exercise_id: string; completed_at: string | null }[];
  const heat = activityHeat(
    [...rows.map((row) => ({ exerciseId: row.exercise_id, at: row.created_at })), ...done.map((row) => ({ exerciseId: row.exercise_id, at: row.completed_at }))],
    now,
  );
  const lastWorkAt = [rows[0]?.created_at, ...done.map((row) => row.completed_at)].filter((value): value is string => Boolean(value)).sort().at(-1) ?? null;

  // Notes validées des autres copies des mêmes évaluations : la classe de l'élève si elle est connue.
  const mine = attempts.error ? [] : ((attempts.data ?? []) as any[]).filter((row) => row.evaluations);
  const evaluationIds = mine.map((row) => row.evaluations.id);
  const classe = (profile.classe ?? '').trim();
  const [others, classmates] = await Promise.all([
    evaluationIds.length
      ? supabase.from('evaluation_attempts').select('evaluation_id, user_id, result').in('evaluation_id', evaluationIds).eq('status', 'rendue').not('result', 'is', null)
      : Promise.resolve({ data: [] as any[] }),
    classe && !profile.has_private_lessons
      ? supabase.from('profiles').select('id, full_name').eq('role', 'student').eq('classe', profile.classe).order('full_name')
      : Promise.resolve({ data: [] as any[] }),
  ]);
  const mates = new Set(((classmates.data ?? []) as any[]).map((row) => row.id));
  const totals = new Map<string, number[]>();
  for (const row of (others.data ?? []) as any[]) {
    if (mates.size > 0 && !mates.has(row.user_id)) continue;
    const total = Number(row.result?.total);
    if (!Number.isFinite(total)) continue;
    totals.set(row.evaluation_id, [...(totals.get(row.evaluation_id) ?? []), total]);
  }

  const evaluations: StudentCardEvaluation[] = mine
    .sort((a, b) => String(b.evaluations.created_at).localeCompare(String(a.evaluations.created_at)))
    .map((row) => {
      const total = row.status === 'rendue' && row.result ? Number(row.result.total) : null;
      return {
        id: row.evaluations.id,
        title: row.evaluations.title,
        status: row.evaluations.status,
        attemptId: row.id,
        submittedAt: row.submitted_at ?? null,
        grade: total !== null && Number.isFinite(total) ? total : null,
        handedIn: row.status === 'rendue',
        stats: gradeStats(totals.get(row.evaluations.id) ?? []),
      };
    });
  const validated = evaluations.map((item) => item.grade).filter((value): value is number => value !== null);

  return {
    student: {
      id: profile.id,
      name: profile.full_name || profile.email || 'Élève',
      email: profile.email ?? null,
      level: profile.level ?? null,
      classe: profile.classe ?? null,
      privateLessons: Boolean(profile.has_private_lessons),
    },
    lastWorkAt,
    exercisesDone: progressCount.count ?? 0,
    badges: badges.count ?? 0,
    weekExercises: weekCount(heat),
    suspects: rows.filter((row) => row.severity === 'suspect' && row.created_at >= weekAgo).length,
    heat,
    evaluations,
    average: validated.length ? Math.round((validated.reduce((sum, value) => sum + value, 0) / validated.length) * 100) / 100 : null,
    classmates: ((classmates.data ?? []) as any[]).map((row) => ({ id: row.id, name: row.full_name || 'Élève' })),
  };
}
