import type { createClient } from "@/utils/supabase/server";
import { lastWorkByStudent, type LastWorkRows } from "./last-work";

type Supabase = Awaited<ReturnType<typeof createClient>>;

/** Essais d'exercices récents : assez pour la dernière date de chaque élève sans tout relire. */
const SUBMISSION_ROWS = 5000;

/** Les essais envoyés, du plus récent au plus ancien. RLS : l'enseignant les lit tous. */
export async function fetchSubmissionDates(supabase: Supabase, ids: string[]): Promise<LastWorkRows["submissions"]> {
  if (!ids.length) return [];
  const { data } = await supabase
    .from("exercise_submissions")
    .select("user_id, created_at")
    .in("user_id", ids)
    .order("created_at", { ascending: false })
    .limit(SUBMISSION_ROWS);
  return (data || []) as LastWorkRows["submissions"];
}

/** Dernière activité de travail de chaque élève (voir lib/last-work.ts), lue en base. */
export async function fetchLastWork(supabase: Supabase, ids: string[]): Promise<Map<string, string>> {
  if (!ids.length) return new Map();
  const [progress, badges, homework, submissions] = await Promise.all([
    supabase.from("user_progress").select("user_id, completed_at").in("user_id", ids),
    supabase.from("badges").select("user_id, unlocked_at").in("user_id", ids),
    supabase.from("homework_completions").select("user_id, completed_at").in("user_id", ids),
    fetchSubmissionDates(supabase, ids),
  ]);
  return lastWorkByStudent({
    progress: progress.data || [],
    badges: badges.data || [],
    homework: homework.data || [],
    submissions,
  });
}
