import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { practiceRemaining } from "@/lib/revisions";

/*
 * Entraînement chronométré, côté serveur. Module sans "use server" : les fonctions ne sont pas appelables
 * depuis le navigateur. L'élève lit ses entraînements par RLS ; la réussite d'un exercice est notée par le
 * serveur après la vérification (practice_mark_solved, clé de service).
 */

export type PracticeSession = {
  id: string;
  label: string;
  exerciseIds: string[];
  minutes: number;
  solved: string[];
  startedAt: string;
  finishedAt: string | null;
  /** Ni terminé ni hors délai (une minute de marge pour la dernière vérification). */
  running: boolean;
};

export const PRACTICE_GRACE_MS = 60_000;

type Row = {
  id: string;
  label: string;
  exercise_ids: string[];
  duration_minutes: number;
  solved: string[];
  started_at: string;
  finished_at: string | null;
};

export const PRACTICE_COLUMNS = "id, label, exercise_ids, duration_minutes, solved, started_at, finished_at";

export function toPracticeSession(row: Row, now = Date.now()): PracticeSession {
  return {
    id: row.id,
    label: row.label,
    exerciseIds: row.exercise_ids ?? [],
    minutes: row.duration_minutes,
    solved: row.solved ?? [],
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    running: !row.finished_at && practiceRemaining(row.started_at, row.duration_minutes, now) > -PRACTICE_GRACE_MS,
  };
}

/** Un entraînement de l'élève connecté (RLS), ou null. */
export async function loadPracticeSession(id: string): Promise<PracticeSession | null> {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data } = await supabase.from("practice_sessions").select(PRACTICE_COLUMNS).eq("id", id).eq("user_id", auth.user.id).maybeSingle();
  return data ? toPracticeSession(data as Row) : null;
}

export async function markPracticeSolved(userId: string, sessionId: string, exerciseId: string) {
  const admin = createAdminClient();
  if (!admin) return false;
  const { data } = await admin.rpc("practice_mark_solved", { p_user: userId, p_id: sessionId, p_exercise: exerciseId });
  return data === true;
}
