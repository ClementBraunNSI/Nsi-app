"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getAuthContext } from "@/lib/auth";
import { exerciseIdsForPage } from "@/lib/page-exercises";

function revalidateHomework() {
  revalidatePath("/espace");
  revalidatePath("/admin");
  revalidatePath("/admin/devoirs");
}

/** Marque les devoirs liés à une page dont tous les exercices sont dans user_progress. */
export async function syncMyHomework(): Promise<void> {
  const auth = await getAuthContext();
  if (!auth.user || auth.role !== "student") return;

  const supabase = await createClient();
  const userId = auth.user.id;
  const { data: profile } = await supabase
    .from("profiles")
    .select("classe")
    .eq("id", userId)
    .maybeSingle();

  const [progressRes, ownRes, classRes, doneRes] = await Promise.all([
    supabase.from("user_progress").select("exercise_id").eq("user_id", userId),
    supabase
      .from("homework")
      .select("id, page_path, status, student_id")
      .eq("student_id", userId),
    profile?.classe
      ? supabase
          .from("homework")
          .select("id, page_path, student_id, classe")
          .eq("classe", profile.classe)
          .is("student_id", null)
      : Promise.resolve({ data: [] as { id: string; page_path: string | null; student_id: null; classe: string }[] }),
    supabase.from("homework_completions").select("homework_id").eq("user_id", userId),
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
    const { error } = await supabase.from("homework").update({ status: "done" }).eq("id", row.id).eq("student_id", userId);
    if (!error) changed = true;
  }

  for (const row of classRes.data || []) {
    if (already.has(row.id) || !ready(row.page_path)) continue;
    const { error } = await supabase.from("homework_completions").insert({
      homework_id: row.id,
      user_id: userId,
    });
    if (!error) changed = true;
  }

  if (changed) revalidateHomework();
}
