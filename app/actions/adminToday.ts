'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { getAdminDashboardData } from '@/app/actions/admin';
import { listPendingSubmissions } from '@/app/actions/submissions';
import { getClassHomeworkBoard, getPrivateLessonSchedule, getTeacherInbox } from '@/app/actions/followup';
import { listEvaluations } from '@/app/actions/evaluations';
import { listChallenges } from '@/app/actions/challenges';
import { listAssessments } from '@/app/actions/classInfo';
import { listVisios } from '@/app/actions/visio';
import { getAllExercises } from '@/app/actions/getExercises';
import { buildAdminToday, buildTodayExtra, type AdminTodayData, type AdminTodayExtra } from '@/lib/admin-today';
import { adminClassLabel, inAdminClass, touchesAdminClass } from '@/lib/admin-class';
import { readAdminClass } from '@/lib/admin-class-server';

export type AdminTodayPage = { data: AdminTodayData; extra: AdminTodayExtra; selection: string; classLabel: string };

/**
 * Page « Aujourd'hui » : relit les listes existantes, limitées à la classe choisie dans la barre du haut,
 * plus trois comptes légers (notes à valider, bugs, saisies suspectes). Réservé à l'enseignant.
 */
export async function getAdminToday(): Promise<AdminTodayPage | null> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  const supabase = await createClient();
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();

  const [chosen, dashboard, pending, inbox, evaluations, challenges, assessments, lessons, visios, homework, gradeRows, bugRows, suspectRows] = await Promise.all([
    readAdminClass(),
    getAdminDashboardData(),
    listPendingSubmissions(),
    getTeacherInbox(),
    listEvaluations(),
    listChallenges(),
    listAssessments(),
    getPrivateLessonSchedule(),
    listVisios(),
    getClassHomeworkBoard(),
    supabase.from('evaluation_attempts').select('user_id, evaluations(title)').eq('status', 'rendue').is('result', null),
    supabase.from('bug_reports').select('id', { count: 'exact', head: true }).eq('status', 'nouveau'),
    supabase
      .from('exercise_submissions')
      .select('user_id, severity:typing->summary->>severity')
      .gte('created_at', weekAgo)
      .not('typing', 'is', null)
      .limit(2000),
  ]);

  const { selection } = chosen;
  const students = dashboard.students.filter((student) => inAdminClass(selection, student));
  const ids = new Set(students.map((student) => student.id));
  const now = new Date();
  const shownEvaluations = evaluations.filter((item) => touchesAdminClass(selection, item.classes));

  const data = buildAdminToday({
    now,
    students,
    pending: pending.filter((item) => ids.has(item.userId)),
    inbox: (inbox?.threads ?? []).filter((thread) => !selection || ids.has(thread.id)),
    evaluations: shownEvaluations,
    challenges: challenges.filter((item) => touchesAdminClass(selection, item.classes)),
    assessments: assessments.map((item) => ({ ...item, classes: item.classes ?? [] })).filter((item) => touchesAdminClass(selection, item.classes)),
    lessons: (lessons?.rows ?? []).filter((row) => !selection || ids.has(row.id)),
    visios: visios.filter((item) => touchesAdminClass(selection, item.classes)),
    homework: (homework?.homework ?? []).filter((row) => touchesAdminClass(selection, [row.classe])),
  });
  const extra = buildTodayExtra({
    now,
    students,
    grades: gradeRows.error ? [] : ((gradeRows.data ?? []) as any[]).map((row) => ({ userId: row.user_id, title: row.evaluations?.title ?? 'Évaluation' })),
    bugs: bugRows.error ? 0 : bugRows.count ?? 0,
    suspects: suspectRows.error
      ? []
      : ((suspectRows.data ?? []) as unknown as { user_id: string; severity: string | null }[]).filter((row) => row.severity === 'suspect').map((row) => ({ userId: row.user_id })),
    evaluations: shownEvaluations,
  });
  return { data, extra, selection, classLabel: adminClassLabel(selection) };
}

export type AdminNavCounts = {
  corrections: number;
  messages: number;
  bugs: number;
  /** Copies d'évaluation rendues dont la note n'est pas encore validée. */
  grades: number;
  /** Une évaluation est ouverte en ce moment. */
  live: boolean;
};

const NO_COUNTS: AdminNavCounts = { corrections: 0, messages: 0, bugs: 0, grades: 0, live: false };

/** Pastilles du menu : ce qui attend dans « À corriger », et le voyant « En classe ». Des comptes seulement, sans contenu. */
export async function getAdminNavCounts(): Promise<AdminNavCounts> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return NO_COUNTS;
  const supabase = await createClient();
  const [pending, unread, bugs, grades, live] = await Promise.all([
    listPendingSubmissions(),
    supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', auth.user.id)
      .is('read_at', null),
    // Nouveaux signalements de bugs ; 0 tant que la table n'existe pas.
    supabase.from('bug_reports').select('id', { count: 'exact', head: true }).eq('status', 'nouveau'),
    // Le résumé de la copie n'est écrit qu'à la validation de la note : sans résumé, la note reste à valider.
    supabase.from('evaluation_attempts').select('id', { count: 'exact', head: true }).eq('status', 'rendue').is('result', null),
    supabase.from('evaluations').select('id', { count: 'exact', head: true }).eq('status', 'ouverte'),
  ]);
  return {
    corrections: pending.length,
    messages: unread.count ?? 0,
    bugs: bugs.error ? 0 : bugs.count ?? 0,
    grades: grades.error ? 0 : grades.count ?? 0,
    live: !live.error && (live.count ?? 0) > 0,
  };
}

export type AdminSearchItem = { kind: 'eleve' | 'evaluation' | 'defi' | 'exercice'; id: string; label: string; hint: string; href: string };

/** Index de la recherche de la barre du haut : élèves, évaluations, défis et exercices des fiches. */
export async function getAdminSearchIndex(): Promise<AdminSearchItem[]> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return [];
  const [dashboard, evaluations, challenges, exercises] = await Promise.all([
    getAdminDashboardData(),
    listEvaluations(),
    listChallenges(),
    getAllExercises(),
  ]);
  return [
    ...dashboard.students.map((student) => ({
      kind: 'eleve' as const,
      id: student.id,
      label: student.full_name || student.email || 'Élève',
      hint: student.classe || (student.has_private_lessons ? 'Cours particuliers' : 'Sans classe'),
      href: `/admin/eleves/${student.id}`,
    })),
    ...evaluations.map((item) => ({ kind: 'evaluation' as const, id: item.id, label: item.title, hint: item.classes.join(', '), href: `/admin/evaluations/${item.id}` })),
    ...challenges.map((item) => ({ kind: 'defi' as const, id: item.id, label: item.title, hint: item.classes.join(', '), href: `/admin/defis/${item.id}` })),
    ...exercises.map((item) => ({ kind: 'exercice' as const, id: item.id, label: item.label, hint: item.courseTitle, href: `/exercice/${encodeURIComponent(item.id)}` })),
  ];
}
