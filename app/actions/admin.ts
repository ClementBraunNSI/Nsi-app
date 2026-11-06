'use server';

import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { getReservedCourses, type ReservedCourse } from '@/app/actions/getReservedCourses';
import { fetchLastWork } from '@/lib/last-work-server';

export type AdminStudent = {
  id: string;
  full_name: string | null;
  email: string | null;
  level: string | null;
  classe: string | null;
  updated_at: string | null;
  has_private_lessons: boolean | null;
  /** Dernière activité de travail (lib/last-work.ts), la même que sur la page Activité ; null si aucune. */
  last_work_at: string | null;
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

  const profiles = (studentsData || []) as Omit<AdminStudent, 'last_work_at'>[];
  const lastWork = await fetchLastWork(supabase, profiles.map((student) => student.id));

  return {
    error: null as null,
    students: profiles.map((student) => ({ ...student, last_work_at: lastWork.get(student.id) ?? null })),
    totalExercises: countEx || 0,
    totalBadges: countBadges || 0,
  };
}

export async function getStudentAdminDetails(studentId: string) {
  const empty = {
    badges: [] as Record<string, unknown>[],
    achievements: [] as { id: string; achievement_id: string; title: string; description: string | null; unlocked_at: string }[],
    exercisesCount: 0,
    reservedCourses: [] as ReservedCourse[],
  };

  const auth = await getAuthContext();
  if (!auth.isElevated) return { error: 'forbidden' as const, ...empty };

  const id = String(studentId || '').trim();
  if (!id || id.length > 80) return { error: 'invalid' as const, ...empty };

  const supabase = await createClient();
  const [{ data: profile }, { data: badges }, { data: achievements }, { count }] = await Promise.all([
    supabase.from('profiles').select('id, full_name, has_private_lessons').eq('id', id).maybeSingle(),
    supabase.from('badges').select('id, course_id, badge_name, unlocked_at').eq('user_id', id),
    supabase
      .from('user_achievements')
      .select('id, achievement_id, title, description, unlocked_at')
      .eq('user_id', id)
      .order('unlocked_at', { ascending: false }),
    supabase.from('user_progress').select('*', { count: 'exact', head: true }).eq('user_id', id),
  ]);

  if (!profile) return { error: 'not_found' as const, ...empty };

  const reservedCourses = await getReservedCourses(id);

  return {
    error: null as null,
    badges: badges || [],
    achievements: achievements || [],
    exercisesCount: count || 0,
    reservedCourses,
  };
}
