'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import {
  achievementForSheet,
  completedChapterNames,
  globalAchievementsUnlockedBetween,
  ACHIEVEMENTS,
  type Achievement,
  type AchievementStats,
} from '@/lib/achievements';
import { getExercisesForCourses, listAccessibleSheetSummaries } from '@/app/actions/getExercises';
import { syncMyHomework } from '@/app/actions/homeworkCompletion';

export type ValidationResult = {
  error: string | null;
  sheetComplete: boolean;
  newBadge: boolean;
  newAchievement: Achievement | null;
  newAchievements: Achievement[];
};

export async function saveValidatedExercise(input: {
  exerciseId: string;
  courseId: string;
  courseTitle: string;
}): Promise<ValidationResult> {
  const empty: ValidationResult = {
    error: null,
    sheetComplete: false,
    newBadge: false,
    newAchievement: null,
    newAchievements: [],
  };

  const auth = await getAuthContext();
  if (!auth.user) return { ...empty, error: 'unauthenticated' };
  if (auth.role !== 'student' && auth.role !== 'invite') {
    return { ...empty, error: 'forbidden' };
  }
  const userId = auth.user.id;

  const exerciseId = String(input.exerciseId || '').trim();
  const courseId = String(input.courseId || '').trim();
  const courseTitle = String(input.courseTitle || '').trim() || courseId;
  if (!exerciseId || exerciseId.length > 200 || !courseId || courseId.length > 200) {
    return { ...empty, error: 'invalid' };
  }

  const supabase = await createClient();
  const { data: priorRow } = await supabase
    .from('user_progress')
    .select('id')
    .eq('user_id', userId)
    .eq('exercise_id', exerciseId)
    .maybeSingle();
  const alreadyValidated = Boolean(priorRow);

  const { error } = await supabase.from('user_progress').upsert(
    {
      exercise_id: exerciseId,
      user_id: userId,
      course_id: courseId,
    },
    { onConflict: 'user_id, exercise_id' },
  );

  if (error) return { ...empty, error: 'save_failed' };

  await syncMyHomework();

  const sheetExercises = await getExercisesForCourses([courseId]);
  if (!sheetExercises.some((exercise) => exercise.id === exerciseId)) {
    return { ...empty, error: 'invalid' };
  }
  const [progressRes, badgesRes, achievementsRes, exerciseCountRes, sheets] = await Promise.all([
    supabase
      .from('user_progress')
      .select('exercise_id')
      .eq('user_id', userId)
      .eq('course_id', courseId),
    supabase.from('badges').select('course_id, badge_name').eq('user_id', userId),
    supabase.from('user_achievements').select('achievement_id').eq('user_id', userId),
    supabase.from('user_progress').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    listAccessibleSheetSummaries(),
  ]);

  const done = new Set((progressRes.data || []).map((row) => row.exercise_id));
  done.add(exerciseId);
  const sheetComplete =
    sheetExercises.length > 0 && sheetExercises.every((exercise) => done.has(exercise.id));

  const priorBadges = badgesRes.data || [];
  const alreadyBadge = priorBadges.some((badge) => badge.course_id === courseId);
  const newBadge = sheetComplete && !alreadyBadge;

  if (newBadge) {
    const { error: badgeError } = await supabase.from('badges').upsert(
      {
        user_id: userId,
        course_id: courseId,
        badge_name: courseTitle,
        unlocked_at: new Date().toISOString(),
      },
      { onConflict: 'user_id, course_id' },
    );
    if (badgeError) return { ...empty, error: 'badge_failed', sheetComplete: true };
  }

  const afterBadges = newBadge
    ? [...priorBadges, { course_id: courseId, badge_name: courseTitle }]
    : priorBadges;
  const exercisesAfter = exerciseCountRes.count || 0;
  const exercisesBefore = alreadyValidated ? exercisesAfter : Math.max(0, exercisesAfter - 1);
  const beforeStats: AchievementStats = {
    badgesCount: priorBadges.length,
    exercisesCount: exercisesBefore,
    badges: priorBadges,
    completedChapters: completedChapterNames(sheets, priorBadges.map((badge) => badge.course_id)),
  };
  const afterStats: AchievementStats = {
    badgesCount: afterBadges.length,
    exercisesCount: exercisesAfter,
    badges: afterBadges,
    completedChapters: completedChapterNames(sheets, afterBadges.map((badge) => badge.course_id)),
  };

  const stored = new Set((achievementsRes.data || []).map((row) => row.achievement_id));
  const titles = new Map(sheets.map((sheet) => [sheet.courseId, sheet.courseTitle]));
  const desired: Achievement[] = [];
  const seenDesired = new Set<string>();
  const remember = (item: Achievement) => {
    if (seenDesired.has(item.id)) return;
    seenDesired.add(item.id);
    desired.push(item);
  };
  for (const badge of afterBadges) {
    if (!badge.course_id) continue;
    remember(achievementForSheet(badge.course_id, titles.get(badge.course_id) || badge.badge_name || badge.course_id));
  }
  for (const item of ACHIEVEMENTS) {
    if (item.condition(afterStats)) remember(item);
  }
  const missing = desired.filter((item) => !stored.has(item.id));
  if (missing.length > 0) {
    await supabase.from('user_achievements').upsert(
      missing.map((item) => ({
        user_id: userId,
        achievement_id: item.id,
        title: item.title,
        description: item.description,
        unlocked_at: new Date().toISOString(),
      })),
      { onConflict: 'user_id,achievement_id', ignoreDuplicates: true },
    );
  }

  const announced: Achievement[] = [];
  if (newBadge) announced.push(achievementForSheet(courseId, courseTitle));
  for (const item of globalAchievementsUnlockedBetween(beforeStats, afterStats)) {
    if (!announced.some((current) => current.id === item.id)) announced.push(item);
  }

  revalidatePath('/espace');
  if (newBadge || announced.length > 0) revalidatePath('/admin');
  return {
    error: null,
    sheetComplete,
    newBadge,
    newAchievement: announced[0] ?? null,
    newAchievements: announced,
  };
}
