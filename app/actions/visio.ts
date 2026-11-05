'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { cleanClasses } from '@/lib/announcements';
import { checkVisioSession, checkVisioUrl } from '@/lib/visio';

/*
 * Visio de classe. L'enseignant gère les visios et leurs séances par RLS ; l'élève reçoit l'adresse
 * par class_info_mine, seulement pour sa classe et quand la visio est rejoignable.
 */

type Result = { ok: true; warning?: string | null } | { ok: false; error: string };
const fail = (error: string) => ({ ok: false as const, error });
const NOT_ALLOWED = 'Réservé aux comptes enseignant et admin.';

async function teacher() {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  return { auth, supabase: await createClient() };
}

export type AdminVisioSession = { id: string; day: string; start: string; end: string };

export type AdminVisio = {
  id: string;
  classes: string[];
  title: string;
  url: string;
  code: string;
  note: string;
  isOpen: boolean;
  /** Avertissement sur le domaine, recalculé à l'affichage. */
  warning: string | null;
  sessions: AdminVisioSession[];
};

export type VisioInput = { id?: string; classes: string[]; title: string; url: string; code: string; note: string; isOpen: boolean };

export async function listVisios(): Promise<AdminVisio[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  const since = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const { data } = await ctx.supabase
    .from('class_visios')
    .select('id, classes, title, url, access_code, note, is_open, class_visio_sessions(id, day, start_time, end_time)')
    .order('created_at', { ascending: true });
  return (data ?? []).map((row) => {
    const check = checkVisioUrl(row.url as string);
    const sessions = ((row.class_visio_sessions as { id: string; day: string; start_time: string; end_time: string }[]) ?? [])
      .filter((session) => session.day >= since)
      .map((session) => ({ id: session.id, day: session.day, start: session.start_time.slice(0, 5), end: session.end_time.slice(0, 5) }))
      .sort((a, b) => `${a.day} ${a.start}`.localeCompare(`${b.day} ${b.start}`));
    return {
      id: row.id as string,
      classes: (row.classes as string[]) ?? [],
      title: (row.title as string) ?? '',
      url: row.url as string,
      code: (row.access_code as string) ?? '',
      note: (row.note as string) ?? '',
      isOpen: Boolean(row.is_open),
      warning: check.ok ? check.warning : null,
      sessions,
    };
  });
}

function revalidateVisio() {
  revalidatePath('/admin/devoirs');
  revalidatePath('/espace/classe');
}

export async function saveVisio(input: VisioInput): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const classes = cleanClasses(input.classes);
  if (classes.length === 0) return fail('Choisir au moins une classe.');
  const check = checkVisioUrl(input.url);
  if (!check.ok) return fail(check.error);
  const title = String(input.title ?? '').trim();
  const code = String(input.code ?? '').trim();
  const note = String(input.note ?? '').trim();
  if (title.length > 200 || code.length > 100 || note.length > 500) return fail('Texte trop long.');

  const row = { classes, title, url: check.url, access_code: code, note, is_open: Boolean(input.isOpen), updated_at: new Date().toISOString() };
  const { error } = input.id
    ? await ctx.supabase.from('class_visios').update(row).eq('id', input.id)
    : await ctx.supabase.from('class_visios').insert({ ...row, created_by: ctx.auth.user!.id });
  if (error) return fail("La visio n'a pas pu être enregistrée.");
  revalidateVisio();
  return { ok: true, warning: check.warning };
}

export async function setVisioOpen(id: string, isOpen: boolean): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  if (!id) return fail('Visio inconnue.');
  const { error } = await ctx.supabase
    .from('class_visios')
    .update({ is_open: isOpen, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return fail("La visio n'a pas pu être modifiée.");
  revalidateVisio();
  return { ok: true };
}

export async function deleteVisio(id: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  if (!id) return fail('Visio inconnue.');
  const { error } = await ctx.supabase.from('class_visios').delete().eq('id', id);
  if (error) return fail("La visio n'a pas pu être supprimée.");
  revalidateVisio();
  return { ok: true };
}

export async function addVisioSession(input: { visioId: string; day: string; start: string; end: string }): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  if (!input.visioId) return fail('Visio inconnue.');
  const times = { day: String(input.day ?? '').trim(), start: String(input.start ?? '').trim(), end: String(input.end ?? '').trim() };
  const invalid = checkVisioSession(times);
  if (invalid) return fail(invalid);
  const { error } = await ctx.supabase
    .from('class_visio_sessions')
    .insert({ visio_id: input.visioId, day: times.day, start_time: times.start, end_time: times.end });
  if (error) return fail("La séance n'a pas pu être enregistrée.");
  revalidateVisio();
  return { ok: true };
}

export async function deleteVisioSession(id: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  if (!id) return fail('Séance inconnue.');
  const { error } = await ctx.supabase.from('class_visio_sessions').delete().eq('id', id);
  if (error) return fail("La séance n'a pas pu être supprimée.");
  revalidateVisio();
  return { ok: true };
}
