import { createAdminClient } from "@/utils/supabase/admin";

/** Taille maximale d'un rendu, alignée sur la contrainte de la table. */
export const SUBMISSION_LIMIT = 60_000;

export type SubmissionKind = "code" | "reponse";
export type SubmissionStatus = "auto" | "en_attente" | "validee" | "a_revoir";

/**
 * Garde une trace du travail d'un élève dans exercise_submissions.
 * Module serveur, sans "use server" : l'appelant a déjà vérifié l'élève et l'exercice.
 */
export async function recordSubmission(row: {
  userId: string;
  exerciseId: string;
  courseId: string;
  kind: SubmissionKind;
  content: string;
  passed: boolean | null;
  status: SubmissionStatus;
  /** Suivi de frappe : résumé calculé par le serveur, et l'historique complet pour un essai réussi. */
  typing?: unknown;
  /** Carnet d'erreurs : résumé de l'erreur d'un essai refusé. */
  error?: unknown;
}): Promise<{ id: string } | null> {
  const admin = createAdminClient();
  if (!admin) return null;
  const base = {
    user_id: row.userId,
    exercise_id: row.exerciseId,
    course_id: row.courseId,
    kind: row.kind,
    content: row.content.slice(0, SUBMISSION_LIMIT),
    passed: row.passed,
    status: row.status,
    ...(row.typing ? { typing: row.typing } : {}),
  };
  const insert = (values: Record<string, unknown>) => admin.from("exercise_submissions").insert(values).select("id").maybeSingle();
  let { data, error } = await insert(row.error ? { ...base, error: row.error } : base);
  // Base pas encore migrée (colonne error absente) : l'essai est gardé sans le résumé.
  if (error && row.error) ({ data, error } = await insert(base));
  if (error || !data) return null;
  return { id: String(data.id) };
}
