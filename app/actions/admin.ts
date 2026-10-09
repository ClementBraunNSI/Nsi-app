'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { getReservedCourses, type ReservedCourse } from '@/app/actions/getReservedCourses';

export type AdminStudent = {
  id: string;
  full_name: string | null;
  email: string | null;
  level: string | null;
  classe: string | null;
  updated_at: string | null;
  has_private_lessons: boolean | null;
};

export async function getAdminDashboardData() {
  const auth = await getAuthContext();
  if (!auth.isElevated) {
    return { error: 'forbidden' as const, students: [] as AdminStudent[], totalExercises: 0, totalBadges: 0 };
  }

  const supabase = await createClient();
  const [{ data: studentsData }, { count: countEx }, { count: countBadges }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, email, level, classe, updated_at, has_private_lessons')
      .eq('role', 'student')
      .order('full_name', { ascending: true }),
    supabase.from('user_progress').select('*', { count: 'exact', head: true }),
    supabase.from('badges').select('*', { count: 'exact', head: true }),
  ]);

  return {
    error: null as null,
    students: (studentsData || []) as AdminStudent[],
    totalExercises: countEx || 0,
    totalBadges: countBadges || 0,
  };
}

export async function getStudentAdminDetails(studentId: string) {
  const empty = {
    badges: [] as Record<string, unknown>[],
    exercisesCount: 0,
    reservedCourses: [] as ReservedCourse[],
  };

  const auth = await getAuthContext();
  if (!auth.isElevated) return { error: 'forbidden' as const, ...empty };

  const id = String(studentId || '').trim();
  if (!id || id.length > 80) return { error: 'invalid' as const, ...empty };

  const supabase = await createClient();
  const [{ data: profile }, { data: badges }, { count }] = await Promise.all([
    supabase.from('profiles').select('id, full_name, has_private_lessons').eq('id', id).maybeSingle(),
    supabase.from('badges').select('id, course_id, badge_name, unlocked_at').eq('user_id', id),
    supabase.from('user_progress').select('*', { count: 'exact', head: true }).eq('user_id', id),
  ]);

  if (!profile) return { error: 'not_found' as const, ...empty };

  const reservedCourses = profile.has_private_lessons
    ? await getReservedCourses(profile.full_name || undefined)
    : [];

  return {
    error: null as null,
    badges: badges || [],
    exercisesCount: count || 0,
    reservedCourses,
  };
}
