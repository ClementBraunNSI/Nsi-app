import { createClient } from "@/utils/supabase/server";
import { getAllExercises, type LabExercise } from "@/app/actions/getExercises";
import {
  buildHistory,
  difficultyRank,
  isProjectChapter,
  matchAssessmentSheets,
  MINI_PROJECT,
  pickRevisionExercises,
  type RevisionExercise,
  type RevisionReason,
  type SheetRef,
} from "./revisions";
import type { ClassStats, EvaluationResult } from "./evaluation-result";

/*
 * Page de résultat d'une évaluation fermée, côté élève. La note, les statistiques de la classe et le résumé de la
 * copie viennent de eval_my_result (session de l'élève) ; les exercices pour s'entraîner sont pris dans les fiches
 * accessibles à l'élève, rapprochées des notions à retravailler comme les chapitres d'une interro.
 */

export type ResultSuggestion = {
  id: string;
  label: string;
  courseTitle: string;
  difficulty: number;
  reason: RevisionReason;
  when?: string;
};

export type MyEvaluationResult = {
  evaluation: { id: string; title: string; closedAt: string | null };
  submittedAt: string | null;
  result: EvaluationResult | null;
  stats: ClassStats;
  /** Exercices proposés, par exercice de l'évaluation où des points sont perdus. */
  suggestions: Record<string, ResultSuggestion[]>;
};

const PER_EXERCISE = 3;

const asRevision = (exercise: LabExercise): RevisionExercise => ({
  id: exercise.id,
  label: exercise.label,
  courseId: exercise.courseId,
  courseTitle: exercise.courseTitle,
  chapter: exercise.chapter,
  level: exercise.level,
  type: exercise.type,
  pagePath: exercise.pagePath,
});

function sheetsOf(exercises: LabExercise[]): SheetRef[] {
  const sheets = new Map<string, SheetRef>();
  for (const exercise of exercises) {
    if (!sheets.has(exercise.courseId)) {
      sheets.set(exercise.courseId, { courseId: exercise.courseId, courseTitle: exercise.courseTitle, chapter: exercise.chapter, level: exercise.level });
    }
  }
  return [...sheets.values()];
}

const asNumber = (value: unknown) => (value === null || value === undefined || value === "" ? null : Number(value));

function readStats(raw: any): ClassStats {
  return {
    classe: raw?.classe ?? null,
    count: Number(raw?.count ?? 0),
    pending: Number(raw?.pending ?? 0),
    mean: asNumber(raw?.mean),
    q1: asNumber(raw?.q1),
    median: asNumber(raw?.median),
    q3: asNumber(raw?.q3),
  };
}

/** Exercices à refaire pour chaque exercice de l'évaluation où des points sont perdus, sans doublon d'un exercice à l'autre. */
async function suggestionsFor(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  result: EvaluationResult,
): Promise<Record<string, ResultSuggestion[]>> {
  const targets = result.exercises.filter((exercise) => exercise.review.length > 0);
  if (targets.length === 0) return {};

  const [catalog, profile, submissions, progress] = await Promise.all([
    getAllExercises(),
    supabase.from("profiles").select("level").eq("id", userId).maybeSingle(),
    supabase
      .from("exercise_submissions")
      .select("exercise_id, passed, created_at")
      .eq("user_id", userId)
      .eq("kind", "code")
      .order("created_at", { ascending: false })
      .limit(3000),
    supabase.from("user_progress").select("exercise_id, completed_at").eq("user_id", userId).limit(3000),
  ]);
  const practicable = catalog.filter(
    (exercise) => exercise.hasVerification && difficultyRank(exercise.label) < MINI_PROJECT && !isProjectChapter(exercise.chapter),
  );
  const sheets = sheetsOf(practicable);
  const level = (profile.data?.level as string | null) ?? null;
  const history = buildHistory(
    (submissions.data ?? []) as { exercise_id: string; passed: boolean | null; created_at: string }[],
    (progress.data ?? []) as { exercise_id: string; completed_at: string | null }[],
  );
  const now = new Date();
  const used = new Set<string>();
  const suggestions: Record<string, ResultSuggestion[]> = {};

  // Les exercices où le plus de points sont perdus choisissent en premier.
  for (const exercise of [...targets].sort((a, b) => b.max - b.points - (a.max - a.points))) {
    const match = matchAssessmentSheets(exercise.review.join(", "), sheets, { level });
    const ids = new Set(match.sheets.map((sheet) => sheet.courseId));
    const picks = pickRevisionExercises(practicable.filter((item) => ids.has(item.courseId)).map(asRevision), history, now);
    suggestions[exercise.id] = picks
      .filter((pick) => !used.has(pick.id))
      .slice(0, PER_EXERCISE)
      .map((pick) => {
        used.add(pick.id);
        return { id: pick.id, label: pick.label, courseTitle: pick.courseTitle, difficulty: pick.difficulty, reason: pick.reason, when: pick.when };
      });
  }
  return suggestions;
}

/** Résultat de l'élève connecté pour une évaluation fermée, ou null (pas fermée, pas de copie, pas un élève). */
export async function loadMyEvaluationResult(evaluationId: string, userId: string): Promise<MyEvaluationResult | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("eval_my_result", { p_evaluation: evaluationId });
  if (error || !data) return null;
  const raw = data as any;
  const result = (raw.result ?? null) as EvaluationResult | null;
  return {
    evaluation: { id: raw.evaluation?.id ?? evaluationId, title: raw.evaluation?.title ?? "", closedAt: raw.evaluation?.closedAt ?? null },
    submittedAt: raw.submittedAt ?? null,
    result,
    stats: readStats(raw.stats),
    suggestions: result ? await suggestionsFor(supabase, userId, result) : {},
  };
}
