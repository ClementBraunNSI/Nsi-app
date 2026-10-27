import { createAdminClient } from "@/utils/supabase/admin";
import { exerciseIdsForPage } from "@/lib/page-exercises";

/**
 * Marque les devoirs liés à une page dont tous les exercices sont dans user_progress.
 * Module serveur, sans "use server" : l'appelant a déjà vérifié qui est l'élève.
 * Renvoie true si un devoir a changé d'état.
 */
export async function syncHomeworkFor(userId: string): Promise<boolean> {
  const admin = createAdminClient();
  if (!admin || !userId) return false;

  const { data: profile } = await admin
    .from("profiles")
    .select("classe, role")
    .eq("id", userId)
    .maybeSingle();
  if (profile?.role !== "student") return false;

  const [progressRes, ownRes, classRes, doneRes] = await Promise.all([
    admin.from("user_progress").select("exercise_id").eq("user_id", userId),
    admin
      .from("homework")
      .select("id, page_path, status, student_id")
      .eq("student_id", userId),
    profile?.classe
      ? admin
          .from("homework")
          .select("id, page_path, student_id, classe")
          .eq("classe", profile.classe)
          .is("student_id", null)
      : Promise.resolve({ data: [] as { id: string; page_path: string | null; student_id: null; classe: string }[] }),
    admin.from("homework_completions").select("homework_id").eq("user_id", userId),
  ]);

  const doneIds = new Set((progressRes.data || []).map((row) => row.exercise_id));
  const already = new Set((doneRes.data || []).map((row) => row.homework_id));
  let changed = false;

  const ready = (pagePath: string | null) => {
    const ids = exerciseIdsForPage(pagePath);
    return ids.length > 0 && ids.every((id) => doneIds.has(id));
  };

  for (const row of ownRes.data || []) {
    if (row.status === "done" || !ready(row.page_path)) continue;
    const { error } = await admin.from("homework").update({ status: "done" }).eq("id", row.id).eq("student_id", userId);
    if (!error) changed = true;
  }

  for (const row of classRes.data || []) {
    if (already.has(row.id) || !ready(row.page_path)) continue;
    const { error } = await admin.from("homework_completions").insert({
      homework_id: row.id,
      user_id: userId,
    });
    if (!error) changed = true;
  }

  return changed;
}
