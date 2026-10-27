"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";
import { getAuthContext } from "@/lib/auth";
import { findWrittenExercise, listExerciseLabels } from "@/app/actions/getExercises";
import { awardExercise } from "@/app/actions/progress";
import { recordSubmission, SUBMISSION_LIMIT, type SubmissionKind, type SubmissionStatus } from "@/lib/submissions";

export type Submission = {
  id: string;
  userId: string;
  studentName: string;
  exerciseId: string;
  exerciseLabel: string;
  courseId: string;
  courseTitle: string;
  pagePath?: string;
  kind: SubmissionKind;
  content: string;
  passed: boolean | null;
  status: SubmissionStatus;
  feedback: string | null;
  createdAt: string;
  reviewedAt: string | null;
};

type Row = {
  id: string;
  user_id: string;
  exercise_id: string;
  course_id: string;
  kind: SubmissionKind;
  content: string;
  passed: boolean | null;
  status: SubmissionStatus;
  feedback: string | null;
  created_at: string;
  reviewed_at: string | null;
};

const COLUMNS = "id, user_id, exercise_id, course_id, kind, content, passed, status, feedback, created_at, reviewed_at";

/** Réponse écrite à un exercice sans éditeur : enregistrée en attente de correction. */
export async function submitWrittenAnswer(
  exerciseId: string,
  content: string,
): Promise<{ ok: true; createdAt: string } | { ok: false; error: string }> {
  const auth = await getAuthContext();
  if (!auth.user) return { ok: false, error: "Se connecter pour rendre une réponse." };
  if (auth.role !== "student" && auth.role !== "invite") {
    return { ok: false, error: "Seul un compte élève rend une réponse." };
  }
  const text = String(content ?? "").trim();
  if (!text) return { ok: false, error: "La réponse est vide." };
  if (text.length > SUBMISSION_LIMIT) return { ok: false, error: "La réponse est trop longue." };

  const exercise = await findWrittenExercise(exerciseId);
  if (!exercise) return { ok: false, error: "Cet exercice n'accepte pas de réponse écrite." };

  const saved = await recordSubmission({
    userId: auth.user.id,
    exerciseId: exercise.id,
    courseId: exercise.courseId,
    kind: "reponse",
    content: text,
    passed: null,
    status: "en_attente",
  });
  if (!saved) return { ok: false, error: "La réponse n'a pas pu être enregistrée." };
  revalidatePath("/admin");
  return { ok: true, createdAt: new Date().toISOString() };
}

async function describe(rows: Row[]): Promise<Submission[]> {
  const admin = createAdminClient();
  const labels = await listExerciseLabels();
  const ids = [...new Set(rows.map((row) => row.user_id))];
  const names = new Map<string, string>();
  if (admin && ids.length > 0) {
    const { data } = await admin.from("profiles").select("id, full_name").in("id", ids);
    for (const profile of data || []) names.set(String(profile.id), String(profile.full_name || "Élève"));
  }
  return rows.map((row) => {
    const label = labels[row.exercise_id];
    return {
      id: row.id,
      userId: row.user_id,
      studentName: names.get(row.user_id) || "Élève",
      exerciseId: row.exercise_id,
      exerciseLabel: label?.label || row.exercise_id,
      courseId: row.course_id,
      courseTitle: label?.courseTitle || row.course_id,
      pagePath: label?.pagePath,
      kind: row.kind,
      content: row.content,
      passed: row.passed,
      status: row.status,
      feedback: row.feedback,
      createdAt: row.created_at,
      reviewedAt: row.reviewed_at,
    };
  });
}

/** Tout le travail rendu par un élève, du plus récent au plus ancien. Réservé à l'enseignant. */
export async function listStudentSubmissions(studentId: string): Promise<Submission[]> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return [];
  const id = String(studentId || "").trim();
  const admin = createAdminClient();
  if (!id || id.length > 80 || !admin) return [];
  const { data } = await admin
    .from("exercise_submissions")
    .select(COLUMNS)
    .eq("user_id", id)
    .order("created_at", { ascending: false })
    .limit(300);
  return describe((data || []) as Row[]);
}

/** Réponses écrites et codes refusés par les tests, en attente d'une décision. Réservé à l'enseignant. */
export async function listPendingSubmissions(): Promise<Submission[]> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return [];
  const admin = createAdminClient();
  if (!admin) return [];
  const { data } = await admin
    .from("exercise_submissions")
    .select(COLUMNS)
    .eq("status", "en_attente")
    .eq("kind", "reponse")
    .order("created_at", { ascending: true })
    .limit(200);
  return describe((data || []) as Row[]);
}

/**
 * Décision de l'enseignant sur un rendu. « validee » enregistre l'exercice comme fait pour l'élève,
 * avec le badge et les succès qui en découlent ; « a_revoir » renvoie le travail avec un commentaire.
 */
export async function reviewSubmission(
  submissionId: string,
  decision: "validee" | "a_revoir",
  feedback = "",
): Promise<{ ok: boolean; error?: string }> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return { ok: false, error: "Réservé à l'enseignant." };
  if (decision !== "validee" && decision !== "a_revoir") return { ok: false, error: "Décision inconnue." };
  const admin = createAdminClient();
  if (!admin) return { ok: false, error: "Base indisponible." };

  const { data: row } = await admin
    .from("exercise_submissions")
    .select(COLUMNS)
    .eq("id", String(submissionId || ""))
    .maybeSingle();
  if (!row) return { ok: false, error: "Rendu introuvable." };

  const note = String(feedback || "").trim().slice(0, 2000) || null;
  const { error } = await admin
    .from("exercise_submissions")
    .update({ status: decision, feedback: note, reviewed_at: new Date().toISOString(), reviewed_by: auth.user.id })
    .eq("id", row.id);
  if (error) return { ok: false, error: "La décision n'a pas pu être enregistrée." };

  if (decision === "validee") {
    const labels = await listExerciseLabels();
    const result = await awardExercise(String(row.user_id), {
      exerciseId: String(row.exercise_id),
      courseId: String(row.course_id),
      courseTitle: labels[String(row.exercise_id)]?.courseTitle || String(row.course_id),
    });
    if (result.error) return { ok: false, error: "Le rendu est marqué validé, mais la progression n'a pas pu être enregistrée." };
  }
  revalidatePath("/admin");
  return { ok: true };
}
