'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { listPendingSubmissions, type Submission } from '@/app/actions/submissions';
import { getTeacherInbox } from '@/app/actions/followup';
import { listBugReports } from '@/app/actions/bugReports';
import type { BugReport } from '@/lib/bug-reports';

/*
 * File « À corriger » : tout ce qui attend l'enseignant, dans une seule liste triée de la plus ancienne demande
 * à la plus récente. Notes d'évaluation à valider, réponses écrites, messages non lus, bugs signalés.
 */

type Who = { who: string; classe: string | null; privateLessons: boolean; at: string | null };

export type QueueItem =
  | (Who & { kind: 'note'; id: string; evaluationId: string; title: string })
  | (Who & { kind: 'ecrit'; id: string; submission: Submission })
  | (Who & { kind: 'message'; id: string; count: number; preview: string })
  | (Who & { kind: 'bug'; id: string; report: BugReport });

export type QueueKind = QueueItem['kind'];

export async function getReviewQueue(): Promise<QueueItem[] | null> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  const supabase = await createClient();

  const [attempts, pending, inbox, bugs, profiles] = await Promise.all([
    // Le résumé de la copie n'est écrit qu'à la validation de la note : sans résumé, la note reste à valider.
    supabase
      .from('evaluation_attempts')
      .select('id, user_id, submitted_at, evaluations(id, title, created_at)')
      .eq('status', 'rendue')
      .is('result', null)
      .order('submitted_at', { ascending: true })
      .limit(400),
    listPendingSubmissions(),
    getTeacherInbox(),
    listBugReports('nouveau'),
    supabase.from('profiles').select('id, full_name, classe, has_private_lessons').eq('role', 'student'),
  ]);

  const people = new Map(((profiles.data ?? []) as any[]).map((row) => [String(row.id), row]));
  const who = (userId: string | null, at: string | null): Who => {
    const person: any = userId ? people.get(userId) : null;
    return { who: person?.full_name || 'Élève', classe: person?.classe ?? null, privateLessons: Boolean(person?.has_private_lessons), at };
  };

  const items: QueueItem[] = [];
  if (!attempts.error) {
    for (const row of (attempts.data ?? []) as any[]) {
      if (!row.evaluations) continue;
      items.push({ kind: 'note', id: row.id, evaluationId: row.evaluations.id, title: row.evaluations.title, ...who(row.user_id, row.submitted_at) });
    }
  }
  for (const submission of pending) items.push({ kind: 'ecrit', id: submission.id, submission, ...who(submission.userId, submission.createdAt) });
  for (const thread of inbox?.threads ?? []) {
    if (thread.unread > 0) {
      items.push({ kind: 'message', id: thread.id, count: thread.unread, preview: (thread.lastBody ?? '').slice(0, 140), ...who(thread.id, thread.lastAt) });
    }
  }
  for (const report of bugs) items.push({ kind: 'bug', id: report.id, report, ...who(report.student.id, report.createdAt), who: report.student.name });

  return items.sort((a, b) => (a.at ?? '').localeCompare(b.at ?? ''));
}
