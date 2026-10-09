'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { achievementForSheet, type Achievement } from '@/lib/achievements';
import { getExercisesForCourses } from '@/app/actions/getExercises';
import { syncMyHomework } from '@/app/actions/homeworkCompletion';

export type ValidationResult = {
  error: string | null;
  sheetComplete: boolean;
  newBadge: boolean;
  newAchievement: Achievement | null;
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
  };

  const auth = await getAuthContext();
  if (!auth.user) return { ...empty, error: 'unauthenticated' };
  if (auth.role !== 'student' && auth.role !== 'invite') {
    return { ...empty, error: 'forbidden' };
  }

  const exerciseId = String(input.exerciseId || '').trim();
  const courseId = String(input.courseId || '').trim();
  const courseTitle = String(input.courseTitle || '').trim() || courseId;
  if (!exerciseId || exerciseId.length > 200 || !courseId || courseId.length > 200) {
    return { ...empty, error: 'invalid' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('user_progress').upsert(
    {
      exercise_id: exerciseId,
      user_id: auth.user.id,
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
  const { data: progress } = await supabase
    .from('user_progress')
    .select('exercise_id')
    .eq('user_id', auth.user.id)
    .eq('course_id', courseId);

  const done = new Set((progress || []).map((row) => row.exercise_id));
  done.add(exerciseId);
  const sheetComplete =
    sheetExercises.length > 0 && sheetExercises.every((exercise) => done.has(exercise.id));

  if (!sheetComplete) {
    revalidatePath('/espace');
    return empty;
  }

  const { data: existingBadge } = await supabase
    .from('badges')
    .select('id')
    .eq('user_id', auth.user.id)
    .eq('course_id', courseId)
    .maybeSingle();

  if (existingBadge) {
    revalidatePath('/espace');
    return { ...empty, sheetComplete: true };
  }

  const { error: badgeError } = await supabase.from('badges').upsert(
    {
      user_id: auth.user.id,
      course_id: courseId,
      badge_name: courseTitle,
      unlocked_at: new Date().toISOString(),
    },
    { onConflict: 'user_id, course_id' },
  );

  if (badgeError) return { ...empty, error: 'badge_failed', sheetComplete: true };

  revalidatePath('/espace');
  revalidatePath('/admin');
  return {
    error: null,
    sheetComplete: true,
    newBadge: true,
    newAchievement: achievementForSheet(courseId, courseTitle),
  };
}
