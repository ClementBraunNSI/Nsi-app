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
import { buildAdminToday, type AdminTodayData } from '@/lib/admin-today';

/** Page « Aujourd'hui » : relit les listes existantes, sans requête propre. Réservé à l'enseignant. */
export async function getAdminToday(): Promise<AdminTodayData | null> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;

  const [dashboard, pending, inbox, evaluations, challenges, assessments, lessons, visios, homework] = await Promise.all([
    getAdminDashboardData(),
    listPendingSubmissions(),
    getTeacherInbox(),
    listEvaluations(),
    listChallenges(),
    listAssessments(),
    getPrivateLessonSchedule(),
    listVisios(),
    getClassHomeworkBoard(),
  ]);

  return buildAdminToday({
    now: new Date(),
    students: dashboard.students,
    pending,
    inbox: inbox?.threads ?? [],
    evaluations,
    challenges,
    assessments: assessments.map((item) => ({ ...item, classes: item.classes ?? [] })),
    lessons: lessons?.rows ?? [],
    visios,
    homework: homework?.homework ?? [],
  });
}

/** Pastilles du menu : réponses en attente et messages non lus. Deux comptes seulement, sans contenu. */
export async function getAdminNavCounts(): Promise<{ corrections: number; messages: number; bugs: number }> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return { corrections: 0, messages: 0, bugs: 0 };
  const supabase = await createClient();
  const [pending, unread, bugs] = await Promise.all([
    listPendingSubmissions(),
    supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', auth.user.id)
      .is('read_at', null),
    // Nouveaux signalements de bugs ; 0 tant que la table n'existe pas.
    supabase.from('bug_reports').select('id', { count: 'exact', head: true }).eq('status', 'nouveau'),
  ]);
  return { corrections: pending.length, messages: unread.count ?? 0, bugs: bugs.error ? 0 : bugs.count ?? 0 };
}
