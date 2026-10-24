'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { getAllExercises } from '@/app/actions/getExercises';
import { exerciseIdsForPage } from '@/lib/page-exercises';
import { sheetBadgeSrc } from '@/lib/sheet-badge-art';
import { coursePath, getNsiLevel, profileCodeToLevelId } from '@/lib/nsi-levels';
import { firstNameOf } from '@/lib/first-name';

export type HomeResume = {
  href: string;
  title: string;
  chapter: string;
  done: number;
  total: number;
  badgeSrc: string | null;
};

export type HomeDashboard = {
  firstName: string | null;
  level: { folder: string; label: string; href: string; percent: number } | null;
  resume: HomeResume | null;
  homework: { title: string; href: string | null; dueAt: string | null } | null;
  badges: { courseId: string; name: string; src: string }[];
  badgeCount: number;
  badgeTotal: number;
  exercisesCount: number;
};

type PageStats = { href: string; title: string; chapter: string; courseId: string; total: number; done: number };

/**
 * Accueil d'un élève connecté : prénom, avancement sur son niveau, fiche à reprendre,
 * prochain devoir et derniers badges. Lecture seule : rien n'est synchronisé ni marqué lu ici.
 */
export async function getHomeDashboard(): Promise<HomeDashboard | null> {
  const auth = await getAuthContext();
  if (!auth.user || auth.isElevated || auth.role === 'invite') return null;
  const userId = auth.user.id;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, level, classe')
    .eq('id', userId)
    .maybeSingle();

  const [progressRes, badgesRes, ownHomeworkRes, classHomeworkRes, completionRes, exercises] = await Promise.all([
    supabase.from('user_progress').select('exercise_id').eq('user_id', userId),
    supabase
      .from('badges')
      .select('course_id, badge_name, unlocked_at')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false }),
    supabase
      .from('homework')
      .select('id, title, due_at, page_path, status')
      .eq('student_id', userId),
    profile?.classe
      ? supabase
          .from('homework')
          .select('id, title, due_at, page_path, status')
          .eq('classe', profile.classe)
          .is('student_id', null)
      : Promise.resolve({ data: [] as { id: string; title: string; due_at: string | null; page_path: string | null; status: string }[] }),
    supabase.from('homework_completions').select('homework_id').eq('user_id', userId),
    getAllExercises(),
  ]);

  const completed = new Set((progressRes.data || []).map((row) => row.exercise_id));

  // Fiches avec exercices, dans l'ordre du catalogue.
  const pages = new Map<string, PageStats>();
  const levelCode = String(profile?.level || '');
  for (const exercise of exercises) {
    if (!exercise.pagePath || exercise.level !== levelCode) continue;
    const page = pages.get(exercise.pagePath) || {
      href: exercise.pagePath,
      title: exercise.courseTitle,
      chapter: exercise.chapter,
      courseId: exercise.courseId,
      total: 0,
      done: 0,
    };
    page.total += 1;
    if (completed.has(exercise.id)) page.done += 1;
    pages.set(exercise.pagePath, page);
  }
  const levelPages = [...pages.values()];
  const levelTotal = levelPages.reduce((sum, page) => sum + page.total, 0);
  const levelDone = levelPages.reduce((sum, page) => sum + page.done, 0);

  // À reprendre : la fiche commencée la plus avancée, sinon la première pas encore commencée.
  const started = levelPages
    .filter((page) => page.done > 0 && page.done < page.total)
    .sort((a, b) => b.done / b.total - a.done / a.total);
  const next = started[0] || levelPages.find((page) => page.done === 0) || null;

  const folder = profileCodeToLevelId(levelCode);
  const levelMeta = folder ? getNsiLevel(folder) : null;

  const doneShared = new Set((completionRes.data || []).map((row) => row.homework_id));
  const openHomework = [
    ...(ownHomeworkRes.data || []).filter((row) => row.status !== 'done'),
    ...(classHomeworkRes.data || []).filter((row) => !doneShared.has(row.id)),
  ]
    .filter((row) => {
      const ids = exerciseIdsForPage(row.page_path);
      return !(ids.length > 0 && ids.every((id) => completed.has(id)));
    })
    .sort((a, b) => (a.due_at || '9999').localeCompare(b.due_at || '9999'));
  const homework = openHomework[0] || null;

  const badges = (badgesRes.data || []).flatMap((row) => {
    const src = sheetBadgeSrc(row.course_id);
    return src ? [{ courseId: row.course_id, name: row.badge_name, src }] : [];
  });

  return {
    firstName: firstNameOf(profile?.full_name),
    level:
      folder && levelMeta
        ? {
            folder,
            label: levelMeta.label,
            href: coursePath(folder),
            percent: levelTotal ? Math.round((levelDone / levelTotal) * 100) : 0,
          }
        : null,
    resume: next
      ? {
          href: next.href,
          title: next.title,
          chapter: next.chapter,
          done: next.done,
          total: next.total,
          badgeSrc: sheetBadgeSrc(next.courseId),
        }
      : null,
    homework: homework ? { title: homework.title, href: homework.page_path, dueAt: homework.due_at } : null,
    badges: badges.slice(0, 3),
    badgeCount: badgesRes.data?.length || 0,
    badgeTotal: new Set(levelPages.map((page) => page.courseId)).size,
    exercisesCount: progressRes.data?.length || 0,
  };
}
