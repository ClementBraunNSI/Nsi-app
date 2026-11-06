/*
 * Dernière activité de travail d'un élève, la même partout dans l'admin (liste des élèves, Activité, Aujourd'hui).
 * Compte : un essai d'exercice envoyé (réussi ou non), un exercice validé, une fiche terminée, un devoir de classe rendu.
 * Ne compte pas : un message envoyé, ni la date de modification du profil (profiles.updated_at), qui bouge pour d'autres raisons.
 */

export type LastWorkRows = {
  /** user_progress : exercices validés. */
  progress: { user_id: string; completed_at: string | null }[];
  /** badges : fiches terminées. */
  badges: { user_id: string; unlocked_at: string | null }[];
  /** homework_completions : devoirs de classe rendus. */
  homework: { user_id: string; completed_at: string | null }[];
  /** exercise_submissions : essais envoyés, réussis ou non. */
  submissions: { user_id: string; created_at: string | null }[];
};

const later = (a: string | undefined, b: string) => (!a || Date.parse(b) > Date.parse(a) ? b : a);

export function lastWorkByStudent(rows: LastWorkRows): Map<string, string> {
  const last = new Map<string, string>();
  const add = (userId: string, at: string | null) => {
    if (!userId || !at || Number.isNaN(Date.parse(at))) return;
    last.set(userId, later(last.get(userId), at));
  };
  for (const row of rows.progress) add(row.user_id, row.completed_at);
  for (const row of rows.badges) add(row.user_id, row.unlocked_at);
  for (const row of rows.homework) add(row.user_id, row.completed_at);
  for (const row of rows.submissions) add(row.user_id, row.created_at);
  return last;
}
