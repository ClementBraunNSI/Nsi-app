'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { ANNOUNCEMENT_MAX_LENGTH, cleanClasses } from '@/lib/announcements';

/*
 * Annonces par classe, à sens unique. L'élève lit celles de sa classe par announcement_list_mine
 * et marque sa lecture par announcement_mark_read ; l'enseignant gère les annonces par RLS.
 */

type Result = { ok: true } | { ok: false; error: string };
const fail = (error: string) => ({ ok: false as const, error });
const NOT_ALLOWED = 'Réservé aux comptes enseignant et admin.';

// ---------- Élève ----------

export type MyAnnouncement = {
  id: string;
  body: string;
  pinned: boolean;
  createdAt: string;
  author: string | null;
};

export type MyAnnouncements = {
  classe: string | null;
  lastReadAt: string | null;
  items: MyAnnouncement[];
};

export async function listMyAnnouncements(): Promise<MyAnnouncements> {
  const supabase = await createClient();
  const { data } = await supabase.rpc('announcement_list_mine');
  const value = (data ?? {}) as Partial<MyAnnouncements>;
  return {
    classe: value.classe ?? null,
    lastReadAt: value.lastReadAt ?? null,
    items: Array.isArray(value.items) ? value.items : [],
  };
}

export async function markAnnouncementsRead(): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc('announcement_mark_read');
}

// ---------- Enseignant ----------

async function teacher() {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  return { auth, supabase: await createClient() };
}

export type AdminAnnouncement = {
  id: string;
  body: string;
  pinned: boolean;
  classes: string[];
  createdAt: string;
  /** Pour chaque classe visée : élèves qui ont ouvert les annonces depuis la publication. */
  reads: { classe: string; read: number; size: number }[];
};

export async function listAnnouncements(): Promise<AdminAnnouncement[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  const [{ data: rows }, { data: students }, { data: reads }] = await Promise.all([
    ctx.supabase
      .from('class_announcements')
      .select('id, body, pinned, classes, created_at')
      .order('pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(200),
    ctx.supabase.from('profiles').select('id, classe').eq('role', 'student').not('classe', 'is', null),
    ctx.supabase.from('class_announcement_reads').select('user_id, last_read_at'),
  ]);

  const lastRead = new Map((reads ?? []).map((row) => [row.user_id as string, new Date(row.last_read_at as string).getTime()]));
  const byClass = new Map<string, string[]>();
  for (const student of students ?? []) {
    const classe = String(student.classe);
    byClass.set(classe, [...(byClass.get(classe) ?? []), student.id as string]);
  }

  return (rows ?? []).map((row) => {
    const created = new Date(row.created_at as string).getTime();
    const classes = (row.classes as string[]) ?? [];
    return {
      id: row.id as string,
      body: row.body as string,
      pinned: Boolean(row.pinned),
      classes,
      createdAt: row.created_at as string,
      reads: classes.map((classe) => {
        const ids = byClass.get(classe) ?? [];
        return { classe, size: ids.length, read: ids.filter((id) => (lastRead.get(id) ?? 0) >= created).length };
      }),
    };
  });
}

function revalidateAnnouncements() {
  revalidatePath('/admin/annonces');
  revalidatePath('/espace/classe');
}

export async function createAnnouncement(input: { classes: string[]; body: string; pinned?: boolean }): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const classes = cleanClasses(input.classes);
  const body = String(input.body ?? '').trim();
  if (classes.length === 0) return fail('Choisir au moins une classe.');
  if (!body) return fail("L'annonce est vide.");
  if (body.length > ANNOUNCEMENT_MAX_LENGTH) return fail(`L'annonce dépasse ${ANNOUNCEMENT_MAX_LENGTH} caractères.`);

  const { error } = await ctx.supabase.from('class_announcements').insert({
    classes,
    body,
    pinned: Boolean(input.pinned),
    created_by: ctx.auth.user!.id,
  });
  if (error) return fail("L'annonce n'a pas pu être enregistrée.");
  revalidateAnnouncements();
  return { ok: true };
}

export async function setAnnouncementPinned(id: string, pinned: boolean): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  if (!id) return fail('Annonce inconnue.');
  const { error } = await ctx.supabase
    .from('class_announcements')
    .update({ pinned, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) return fail("L'annonce n'a pas pu être modifiée.");
  revalidateAnnouncements();
  return { ok: true };
}

export async function deleteAnnouncement(id: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  if (!id) return fail('Annonce inconnue.');
  const { error } = await ctx.supabase.from('class_announcements').delete().eq('id', id);
  if (error) return fail("L'annonce n'a pas pu être supprimée.");
  revalidateAnnouncements();
  return { ok: true };
}
