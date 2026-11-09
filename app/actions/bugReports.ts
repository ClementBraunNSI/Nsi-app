"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getAuthContext } from "@/lib/auth";
import {
  BUG_MESSAGE_MAX,
  BUG_MESSAGE_MIN,
  BUG_STATUSES,
  isValidScreenshot,
  type BugReport,
  type BugStatus,
} from "@/lib/bug-reports";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

function messageOf(error: { message?: string } | null | undefined, fallback: string) {
  const text = error?.message?.trim();
  return text && text.length < 200 ? text : fallback;
}

// ---------- Élève ----------

export type BugReportInput = {
  page: string;
  message: string;
  screenshot: string | null;
  context: { userAgent?: string; viewport?: string; language?: string };
};

/** Envoi d'un signalement par un élève connecté (la base contrôle aussi la taille et le nombre par jour). */
export async function reportBug(input: BugReportInput): Promise<Result<{ id: string }>> {
  const auth = await getAuthContext();
  if (!auth.user) return { ok: false, error: "Se connecter pour signaler un bug." };
  const message = String(input.message || "").trim();
  if (message.length < BUG_MESSAGE_MIN) return { ok: false, error: "Décrire le bug en quelques mots." };
  if (message.length > BUG_MESSAGE_MAX) return { ok: false, error: `La description dépasse ${BUG_MESSAGE_MAX} caractères.` };
  const screenshot = input.screenshot || null;
  if (!isValidScreenshot(screenshot)) return { ok: false, error: "La capture d'écran n'a pas pu être lue." };
  const context = {
    userAgent: String(input.context?.userAgent || "").slice(0, 300),
    viewport: String(input.context?.viewport || "").slice(0, 40),
    language: String(input.context?.language || "").slice(0, 20),
  };

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("bug_report_create", {
    p_page: String(input.page || "").slice(0, 300),
    p_message: message,
    p_screenshot: screenshot,
    p_context: context,
  });
  if (error || !data) return { ok: false, error: messageOf(error, "Le signalement n'a pas pu être envoyé.") };
  revalidatePath("/admin/bugs");
  return { ok: true, id: String(data) };
}

// ---------- Enseignant ----------

async function teacher() {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  return await createClient();
}

/** Signalements, du plus récent au plus ancien ; les captures se chargent à part (getBugScreenshot). */
export async function listBugReports(status: BugStatus | "tous" = "tous"): Promise<BugReport[]> {
  const supabase = await teacher();
  if (!supabase) return [];
  let query = supabase
    .from("bug_reports")
    .select("id, created_at, status, page, message, context, note, user_id, has_screenshot")
    .order("created_at", { ascending: false })
    .limit(300);
  if (status !== "tous") query = query.eq("status", status);
  const { data } = await query;
  const rows = (data ?? []) as any[];
  const ids = [...new Set(rows.map((row) => row.user_id).filter(Boolean))];
  const { data: profiles } = ids.length
    ? await supabase.from("profiles").select("id, full_name, classe").in("id", ids)
    : { data: [] as any[] };
  const people = new Map((profiles ?? []).map((profile: any) => [String(profile.id), profile]));
  return rows.map((row) => {
    const person: any = row.user_id ? people.get(String(row.user_id)) : null;
    return {
      id: row.id,
      createdAt: row.created_at,
      status: row.status,
      page: row.page,
      message: row.message,
      context: row.context ?? {},
      note: row.note,
      hasScreenshot: Boolean(row.has_screenshot),
      student: { id: row.user_id ?? null, name: person?.full_name || (row.user_id ? "Élève" : "Compte supprimé"), classe: person?.classe ?? null },
    };
  });
}

export async function getBugScreenshot(id: string): Promise<string | null> {
  const supabase = await teacher();
  if (!supabase || !id) return null;
  const { data } = await supabase.from("bug_reports").select("screenshot").eq("id", id).maybeSingle();
  return data?.screenshot ? String(data.screenshot) : null;
}

export async function updateBugReport(id: string, patch: { status?: BugStatus; note?: string }): Promise<Result> {
  const supabase = await teacher();
  if (!supabase) return { ok: false, error: "Réservé aux comptes enseignant et admin." };
  const values: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.status) {
    if (!BUG_STATUSES.some((item) => item.id === patch.status)) return { ok: false, error: "Statut inconnu." };
    values.status = patch.status;
  }
  if (patch.note !== undefined) values.note = String(patch.note).slice(0, 2000) || null;
  const { error } = await supabase.from("bug_reports").update(values).eq("id", id);
  if (error) return { ok: false, error: messageOf(error, "La modification n'a pas été enregistrée.") };
  revalidatePath("/admin/bugs");
  return { ok: true };
}

export async function deleteBugReport(id: string): Promise<Result> {
  const supabase = await teacher();
  if (!supabase) return { ok: false, error: "Réservé aux comptes enseignant et admin." };
  const { error } = await supabase.from("bug_reports").delete().eq("id", id);
  if (error) return { ok: false, error: messageOf(error, "Le signalement n'a pas été supprimé.") };
  revalidatePath("/admin/bugs");
  return { ok: true };
}
