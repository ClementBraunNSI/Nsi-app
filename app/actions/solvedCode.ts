"use server";

import { createClient } from "@/utils/supabase/server";
import { getAuthContext } from "@/lib/auth";
import { getExerciseReference, listExerciseLabels } from "@/app/actions/getExercises";
import { codeAboveLevel, type LevelFlag } from "@/lib/code-level";
import type { TraceSummary, TypingTrace } from "@/lib/typing-trace";
import { latestSolved, compareSolved, NO_CLASS, type SolvedEntry } from "@/lib/solved-code";

export type SolvedCodeFilters = { classe?: string; courseId?: string; studentId?: string };

type Row = {
  id: string;
  user_id: string;
  exercise_id: string;
  course_id: string;
  kind: "code" | "reponse";
  status: "auto" | "validee";
  created_at: string;
  content?: string;
};

const PAGE = 1000;

/**
 * Dernière version réussie de chaque exercice, par élève : code passé aux tests ou travail validé par l'enseignant.
 * Les essais sont déjà gardés dans exercise_submissions à chaque vérification ; rien n'est recopié.
 * Réservé à l'enseignant : la lecture passe par la session, la RLS ne montre tout qu'à un compte élevé.
 */
export async function listSolvedCode(filters: SolvedCodeFilters = {}, withContent = false): Promise<SolvedEntry[]> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return [];
  const supabase = await createClient();

  let studentIds: string[] | null = null;
  if (filters.classe) {
    const profiles = supabase.from("profiles").select("id");
    const { data } = await (filters.classe === NO_CLASS ? profiles.is("classe", null) : profiles.eq("classe", filters.classe));
    studentIds = (data ?? []).map((profile) => String(profile.id));
    if (studentIds.length === 0) return [];
  }

  const columns = `id, user_id, exercise_id, course_id, kind, status, created_at${withContent ? ", content" : ""}`;
  const rows: Row[] = [];
  for (let from = 0; ; from += PAGE) {
    let query = supabase
      .from("exercise_submissions")
      .select(columns)
      .in("status", ["auto", "validee"])
      .order("created_at", { ascending: false })
      .range(from, from + PAGE - 1);
    if (filters.studentId) query = query.eq("user_id", filters.studentId);
    if (filters.courseId) query = query.eq("course_id", filters.courseId);
    if (studentIds) query = query.in("user_id", studentIds);
    const { data, error } = await query;
    if (error || !data) break;
    rows.push(...(data as unknown as Row[]));
    if (data.length < PAGE) break;
  }
  if (rows.length === 0) return [];

  const latest = latestSolved(rows);
  const ids = [...new Set(latest.map(({ row }) => row.user_id))];
  const [labels, { data: profiles }] = await Promise.all([
    listExerciseLabels(),
    supabase.from("profiles").select("id, full_name, classe").in("id", ids),
  ]);
  const people = new Map((profiles ?? []).map((profile) => [String(profile.id), profile]));

  return latest
    .map(({ row, versions }) => {
      const person = people.get(row.user_id);
      const label = labels[row.exercise_id];
      return {
        id: row.id,
        userId: row.user_id,
        studentName: String(person?.full_name || "Élève"),
        classe: person?.classe ? String(person.classe) : null,
        exerciseId: row.exercise_id,
        exerciseLabel: label?.label || row.exercise_id,
        courseId: row.course_id,
        courseTitle: label?.courseTitle || row.course_id,
        type: row.kind === "reponse" ? "reponse" : label?.type ?? "python",
        status: row.status,
        versions,
        solvedAt: row.created_at,
        ...(withContent ? { content: row.content ?? "" } : {}),
      } satisfies SolvedEntry;
    })
    .sort(compareSolved);
}

/** Code d'une version réussie, chargé quand l'enseignant l'ouvre. */
export async function getSolvedCode(submissionId: string): Promise<string | null> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  const id = String(submissionId || "").trim();
  if (!id || id.length > 80) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("exercise_submissions")
    .select("content")
    .eq("id", id)
    .in("status", ["auto", "validee"])
    .maybeSingle();
  return data ? String(data.content ?? "") : null;
}

export type StudentTyping = { summary: TraceSummary; trace?: TypingTrace } | null;

export type StudentExerciseCode = {
  content: string;
  solvedAt: string;
  status: "auto" | "validee";
  kind: "code" | "reponse";
  /** Suivi de frappe de l'essai ; null pour un essai envoyé avant le suivi. */
  typing: StudentTyping;
  /** Constructions au-dessus du niveau de l'élève, absentes de la correction. */
  levelFlags: LevelFlag[];
};

/**
 * Dernière version réussie d'un exercice pour un élève, ouverte depuis l'activité.
 * null : l'exercice a été validé sans que le code soit gardé (avant l'enregistrement des essais).
 */
export async function getStudentExerciseCode(studentId: string, exerciseId: string): Promise<StudentExerciseCode | null> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  const student = String(studentId || "").trim();
  const exercise = String(exerciseId || "").trim();
  if (!student || student.length > 80 || !exercise || exercise.length > 200) return null;
  const supabase = await createClient();
  const latest = (columns: string) =>
    supabase
      .from("exercise_submissions")
      .select(columns)
      .eq("user_id", student)
      .eq("exercise_id", exercise)
      .in("status", ["auto", "validee"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
  // La colonne du suivi peut manquer tant que sa migration n'est pas appliquée : on relit alors sans elle.
  let { data, error } = await latest("content, created_at, status, kind, typing");
  if (error) ({ data, error } = await latest("content, created_at, status, kind"));
  if (!data) return null;
  const row = data as unknown as { content?: string; created_at: string; status: string; kind: string; typing?: StudentTyping };
  const content = String(row.content ?? "");
  const kind = row.kind === "reponse" ? "reponse" : "code";
  const reference = kind === "code" ? await getExerciseReference(exercise) : null;
  return {
    content,
    solvedAt: String(row.created_at),
    status: row.status === "validee" ? "validee" : "auto",
    kind,
    typing: row.typing && typeof row.typing === "object" && "summary" in row.typing ? row.typing : null,
    levelFlags: reference?.type === "python" ? codeAboveLevel(content, reference.level, reference.correction) : [],
  };
}
