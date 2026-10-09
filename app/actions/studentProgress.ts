'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { listTrackedExercises } from '@/app/actions/getExercises';
import { awardedCourseIds, sheetProgressStatus, type SheetProgressStatus } from '@/lib/student-progress';

export type StudentProgressExercise = {
  id: string;
  label: string;
  validated: boolean;
};

export type StudentProgressSheet = {
  courseId: string;
  courseTitle: string;
  chapter: string;
  level: string;
  validatedCount: number;
  total: number;
  status: SheetProgressStatus;
  exercises: StudentProgressExercise[];
};

export type StudentSheetProgress = {
  fullName: string;
  profileLevel: string | null;
  sheets: StudentProgressSheet[];
};

export async function getStudentSheetProgress(studentId: string): Promise<StudentSheetProgress | null> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;

  const id = String(studentId || '').trim();
  if (!id || id.length > 80) return null;

  const supabase = await createClient();
  const [profileRes, progressRes, badgesRes, achievementsRes, catalog] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, level, role')
      .eq('id', id)
      .eq('role', 'student')
      .maybeSingle(),
    supabase.from('user_progress').select('exercise_id').eq('user_id', id),
    supabase.from('badges').select('course_id').eq('user_id', id),
    supabase.from('user_achievements').select('achievement_id').eq('user_id', id),
    listTrackedExercises(),
  ]);

  if (profileRes.error || progressRes.error || badgesRes.error || achievementsRes.error || !profileRes.data) {
    return null;
  }

  const doneIds = new Set((progressRes.data || []).map((row) => row.exercise_id));
  const awarded = awardedCourseIds(
    (badgesRes.data || []).map((row) => row.course_id),
    (achievementsRes.data || []).map((row) => row.achievement_id),
  );
  const achievementIds = new Set((achievementsRes.data || []).map((row) => row.achievement_id));

  const sheets = new Map<string, StudentProgressSheet>();
  for (const exercise of catalog) {
    let sheet = sheets.get(exercise.courseId);
    if (!sheet) {
      sheet = {
        courseId: exercise.courseId,
        courseTitle: exercise.courseTitle,
        chapter: exercise.chapter,
        level: exercise.level,
        validatedCount: 0,
        total: 0,
        status: 'not_started',
        exercises: [],
      };
      sheets.set(exercise.courseId, sheet);
    }
    const validated = doneIds.has(exercise.id);
    sheet.exercises.push({
      id: exercise.id,
      label: exercise.label,
      validated,
    });
    sheet.total += 1;
    if (validated) sheet.validatedCount += 1;
  }

  const list = [...sheets.values()];
  for (const sheet of list) {
    sheet.status = sheetProgressStatus({
      validatedCount: sheet.validatedCount,
      total: sheet.total,
      awarded: awarded.has(sheet.courseId) || achievementIds.has(sheet.courseId),
    });
  }

  list.sort(
    (a, b) =>
      a.chapter.localeCompare(b.chapter, 'fr') ||
      a.courseTitle.localeCompare(b.courseTitle, 'fr'),
  );

  return {
    fullName: profileRes.data.full_name || 'Élève',
    profileLevel: profileRes.data.level,
    sheets: list,
  };
}
