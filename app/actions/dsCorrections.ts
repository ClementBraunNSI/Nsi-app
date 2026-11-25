'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { checkDsInput, dsRow, type DsCorrectionInput } from '@/lib/ds-corrections';

export type { DsCorrectionInput } from '@/lib/ds-corrections';

/*
 * Corrections de DS : sujet et correction en Markdown, déposés par l'enseignant depuis le panel admin.
 * Les textes ne vivent qu'en base (table ds_corrections). Côté élève, la RLS ne laisse lire une ligne
 * qu'à partir de sa date de mise à disposition et pour les classes visées : rien n'est filtré ici à la main.
 */

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const fail = (error: string) => ({ ok: false as const, error });
const NOT_ALLOWED = 'Réservé aux comptes enseignant et admin.';

async function teacher() {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  return { auth, supabase: await createClient() };
}

export type DsCorrectionSummary = {
  id: string;
  title: string;
  classes: string[];
  visibleAt: string;
  updatedAt: string;
  hasSubject: boolean;
  hasCorrection: boolean;
};

export type DsCorrection = DsCorrectionSummary & { subject: string; correction: string };

function toSummary(row: any): DsCorrectionSummary {
  return {
    id: row.id,
    title: row.title,
    classes: row.classes ?? [],
    visibleAt: row.visible_at,
    updatedAt: row.updated_at,
    hasSubject: Boolean(String(row.subject_md ?? '').trim()),
    hasCorrection: Boolean(String(row.correction_md ?? '').trim()),
  };
}

function toFull(row: any): DsCorrection {
  return { ...toSummary(row), subject: row.subject_md ?? '', correction: row.correction_md ?? '' };
}

const COLUMNS = 'id, title, classes, visible_at, updated_at, subject_md, correction_md';

function refresh() {
  revalidatePath('/admin/evaluations/ds');
  revalidatePath('/espace/ds');
}

// ---------- Enseignant ----------

export async function listDsCorrections(): Promise<DsCorrectionSummary[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  const { data } = await ctx.supabase.from('ds_corrections').select(COLUMNS).order('visible_at', { ascending: false });
  return (data ?? []).map(toSummary);
}

export async function getDsCorrection(id: string): Promise<DsCorrection | null> {
  const ctx = await teacher();
  if (!ctx) return null;
  const { data } = await ctx.supabase.from('ds_corrections').select(COLUMNS).eq('id', id).maybeSingle();
  return data ? toFull(data) : null;
}

export async function saveDsCorrection(id: string | null, input: DsCorrectionInput): Promise<Result<{ id: string }>> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const problem = checkDsInput(input);
  if (problem) return fail(problem);
  const row = dsRow(input);
  const query = id
    ? ctx.supabase.from('ds_corrections').update({ ...row, updated_at: new Date().toISOString() }).eq('id', id).select('id').single()
    : ctx.supabase.from('ds_corrections').insert({ ...row, created_by: ctx.auth.user!.id }).select('id').single();
  const { data, error } = await query;
  if (error || !data) return fail("Le DS n'a pas pu être enregistré.");
  refresh();
  return { ok: true, id: String(data.id) };
}

export async function deleteDsCorrection(id: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const { error } = await ctx.supabase.from('ds_corrections').delete().eq('id', id);
  if (error) return fail("Le DS n'a pas pu être supprimé.");
  refresh();
  return { ok: true };
}

// ---------- Élève ----------

/** DS dont la date est passée, pour la classe de l'élève (filtrés par la RLS). */
export async function listMyDsCorrections(): Promise<DsCorrectionSummary[]> {
  const auth = await getAuthContext();
  if (!auth.user) return [];
  const supabase = await createClient();
  const { data } = await supabase.from('ds_corrections').select(COLUMNS).order('visible_at', { ascending: false });
  return (data ?? []).map(toSummary);
}

/** Un DS disponible pour l'élève, ou null (inexistant, pas sa classe ou date pas encore passée). */
export async function getMyDsCorrection(id: string): Promise<DsCorrection | null> {
  const auth = await getAuthContext();
  if (!auth.user || !/^[0-9a-f-]{36}$/i.test(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase.from('ds_corrections').select(COLUMNS).eq('id', id).maybeSingle();
  return data ? toFull(data) : null;
}
