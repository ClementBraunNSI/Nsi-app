"use server";

import { createClient } from "@/utils/supabase/server";
import { getAuthContext } from "@/lib/auth";
import {
  RENART_CLASSE_MAX,
  RENART_IMAGE_MAX,
  RENART_PRENOM_MAX,
  RENART_THUMB_MAX,
  isValidRenartImage,
  type Renart,
} from "@/lib/chasse-renarts";

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

function messageOf(error: { message?: string } | null | undefined, fallback: string) {
  const text = error?.message?.trim();
  return text && text.length < 200 ? text : fallback;
}

// ---------- Élève ----------

export type RenartInput = { prenom: string; classe: string; image: string; thumbnail: string };

/** Envoi d'un tableau, connecté ou non. La base vérifie la classe et limite le nombre d'envois. */
export async function sendRenart(input: RenartInput): Promise<Result<{ id: string }>> {
  const prenom = String(input.prenom || "").trim().slice(0, RENART_PRENOM_MAX);
  if (!prenom) return { ok: false, error: "Indique ton prénom." };
  const classe = String(input.classe || "").trim().slice(0, RENART_CLASSE_MAX);
  if (!classe) return { ok: false, error: "Indique ta classe." };
  if (!isValidRenartImage(input.image, RENART_IMAGE_MAX) || !isValidRenartImage(input.thumbnail, RENART_THUMB_MAX)) {
    return { ok: false, error: "Le tableau n'a pas pu être lu : réessaie avec une image PNG ou JPEG." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("chasse_renart_create", {
    p_prenom: prenom,
    p_classe: classe,
    p_image: input.image,
    p_thumbnail: input.thumbnail,
  });
  if (error || !data) return { ok: false, error: messageOf(error, "Le tableau n'a pas pu être envoyé.") };
  return { ok: true, id: String(data) };
}

// ---------- Enseignant ----------

async function teacher() {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  return await createClient();
}

/** Tableaux reçus, triés par classe puis par prénom ; seules les vignettes sont chargées. */
export async function listRenarts(): Promise<Renart[]> {
  const supabase = await teacher();
  if (!supabase) return [];
  const { data } = await supabase
    .from("chasse_renarts")
    .select("id, created_at, prenom, classe, thumbnail")
    .order("classe")
    .order("prenom")
    .order("created_at", { ascending: false })
    .limit(1000);
  return ((data ?? []) as any[]).map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    prenom: row.prenom,
    classe: row.classe,
    thumbnail: row.thumbnail,
  }));
}

export async function getRenartImage(id: string): Promise<string | null> {
  const supabase = await teacher();
  if (!supabase || !id) return null;
  const { data } = await supabase.from("chasse_renarts").select("image").eq("id", id).maybeSingle();
  return data?.image ? String(data.image) : null;
}

export async function deleteRenart(id: string): Promise<Result> {
  const supabase = await teacher();
  if (!supabase) return { ok: false, error: "Réservé aux comptes enseignant et admin." };
  const { error } = await supabase.from("chasse_renarts").delete().eq("id", id);
  if (error) return { ok: false, error: messageOf(error, "Le tableau n'a pas été supprimé.") };
  return { ok: true };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Identifiants par requête : la liste passe dans l'adresse, elle doit rester courte. */
const DELETE_CHUNK = 100;

/**
 * Retrait des tableaux que l'enseignant a téléchargés et dit avoir reçus : uniquement ces identifiants,
 * pas les tableaux arrivés entre-temps. Renvoie ceux réellement supprimés.
 */
export async function deleteRenarts(ids: string[]): Promise<Result<{ deleted: string[] }>> {
  const supabase = await teacher();
  if (!supabase) return { ok: false, error: "Réservé aux comptes enseignant et admin." };
  const wanted = [...new Set((Array.isArray(ids) ? ids : []).map(String).filter((id) => UUID.test(id)))];
  const deleted: string[] = [];
  for (let start = 0; start < wanted.length; start += DELETE_CHUNK) {
    const { data, error } = await supabase
      .from("chasse_renarts")
      .delete()
      .in("id", wanted.slice(start, start + DELETE_CHUNK))
      .select("id");
    if (error) {
      if (deleted.length === 0) return { ok: false, error: messageOf(error, "Les tableaux n'ont pas été supprimés.") };
      break;
    }
    deleted.push(...((data ?? []) as { id: string }[]).map((row) => String(row.id)));
  }
  return { ok: true, deleted };
}
