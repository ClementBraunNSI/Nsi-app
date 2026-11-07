'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { cleanClasses } from '@/lib/announcements';
import { parseClassInfo, type ClassAssessment, type ClassInfo } from '@/lib/class-info';

/*
 * Informations de classe. L'élève lit les siennes par class_info_mine et gère le jeton de son extension
 * par extension_token_* ; l'enseignant gère les interros et DS par RLS (compte admin ou enseignant).
 */

type Result = { ok: true } | { ok: false; error: string };
const fail = (error: string) => ({ ok: false as const, error });
const NOT_ALLOWED = 'Réservé aux comptes enseignant et admin.';

// ---------- Élève ----------

export async function getMyClassInfo(): Promise<ClassInfo | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc('class_info_mine');
  return parseClassInfo(data);
}

export async function getExtensionTokenDate(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc('extension_token_created_at');
  return typeof data === 'string' ? data : null;
}

/** Nouveau jeton (l'ancien cesse de fonctionner). Le jeton en clair n'est montré qu'une fois. */
export async function createExtensionToken(): Promise<{ token: string } | { error: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('extension_token_create');
  if (error || typeof data !== 'string') return { error: "Le jeton n'a pas pu être créé." };
  return { token: data };
}

export async function revokeExtensionToken(): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('extension_token_revoke');
  return error ? fail("Le jeton n'a pas pu être révoqué.") : { ok: true };
}

// ---------- Enseignant ----------

async function teacher() {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  return { auth, supabase: await createClient() };
}

export type AdminAssessment = ClassAssessment & { classes: string[]; courseIds: string[] };

export type AssessmentInput = {
  id?: string;
  classes: string[];
  kind: string;
  title: string;
  day: string;
  time: string;
  chapters: string;
  /** Fiches à réviser choisies par l'enseignant (facultatif : sinon le texte des chapitres est rapproché des fiches). */
  courseIds?: string[];
};

export async function listAssessments(): Promise<AdminAssessment[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  // Les épreuves passées depuis plus d'un mois ne sont plus utiles à l'écran.
  const since = new Date(Date.now() - 31 * 86_400_000).toISOString().slice(0, 10);
  const select = (columns: string) =>
    ctx.supabase
      .from('class_assessments')
      .select(columns)
      .gte('day', since)
      .order('day', { ascending: true })
      .order('at_time', { ascending: true, nullsFirst: true })
      .limit(200);
  let { data, error } = await select('id, classes, kind, title, day, at_time, chapters, course_ids');
  // Base pas encore migrée (pas de colonne course_ids).
  if (error) ({ data, error } = await select('id, classes, kind, title, day, at_time, chapters'));
  return ((data ?? []) as unknown as Record<string, unknown>[]).map((row) => ({
    id: row.id as string,
    classes: (row.classes as string[]) ?? [],
    kind: row.kind as ClassAssessment['kind'],
    title: (row.title as string) ?? '',
    day: row.day as string,
    time: row.at_time ? String(row.at_time).slice(0, 5) : null,
    chapters: (row.chapters as string) ?? '',
    courseIds: Array.isArray(row.course_ids) ? (row.course_ids as string[]) : [],
  }));
}

function revalidateClassInfo() {
  revalidatePath('/admin/devoirs');
  revalidatePath('/espace/classe');
  revalidatePath('/espace');
}

export async function saveAssessment(input: AssessmentInput): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const classes = cleanClasses(input.classes);
  const kind = input.kind === 'ds' ? 'ds' : input.kind === 'interro' ? 'interro' : null;
  const day = String(input.day ?? '').trim();
  const time = String(input.time ?? '').trim();
  const title = String(input.title ?? '').trim();
  const chapters = String(input.chapters ?? '').trim();
  if (classes.length === 0) return fail('Choisir au moins une classe.');
  if (!kind) return fail('Choisir interro ou DS.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || Number.isNaN(Date.parse(day))) return fail('Date invalide.');
  if (time && !/^\d{2}:\d{2}$/.test(time)) return fail('Heure invalide.');
  if (title.length > 200 || chapters.length > 1000) return fail('Texte trop long.');
  const courseIds = [...new Set((Array.isArray(input.courseIds) ? input.courseIds : []).map((id) => String(id).trim()).filter((id) => id && id.length <= 200))];
  if (courseIds.length > 30) return fail('30 fiches au plus.');

  const base = { classes, kind, title, day, at_time: time || null, chapters, updated_at: new Date().toISOString() };
  const write = (row: Record<string, unknown>) =>
    input.id
      ? ctx.supabase.from('class_assessments').update(row).eq('id', input.id)
      : ctx.supabase.from('class_assessments').insert({ ...row, created_by: ctx.auth.user!.id });
  let { error } = await write({ ...base, course_ids: courseIds });
  // Base pas encore migrée : sans fiche choisie, la date s'enregistre quand même.
  if (error && courseIds.length === 0) ({ error } = await write(base));
  if (error) return fail("La date n'a pas pu être enregistrée.");
  revalidateClassInfo();
  return { ok: true };
}

export async function deleteAssessment(id: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  if (!id) return fail('Date inconnue.');
  const { error } = await ctx.supabase.from('class_assessments').delete().eq('id', id);
  if (error) return fail("La date n'a pas pu être supprimée.");
  revalidateClassInfo();
  return { ok: true };
}
