'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { getExercisesForCourses } from '@/app/actions/getExercises';
import { ACHIEVEMENTS } from '@/lib/achievements';

export type EspaceHomework = {
  id: string;
  title: string;
  description: string | null;
  due_at: string | null;
  course_id: string | null;
  page_path: string | null;
  page_title: string | null;
  status: 'assigned' | 'done';
  shared: boolean;
};

export type EspaceLesson = {
  id: string;
  starts_at: string;
  duration_minutes: number;
  title: string | null;
};

export type EspaceMessage = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
  mine: boolean;
};

export type EspaceExercise = {
  id: string;
  label: string;
  hasVerification: boolean;
  completed: boolean;
};

export type EspaceSheet = {
  courseId: string;
  courseTitle: string;
  chapter: string;
  level: string | null;
  completedCount: number;
  total: number;
  badgeUnlocked: boolean;
  exercises: EspaceExercise[];
};

export type EspaceAchievement = {
  id: string;
  title: string;
  description: string;
  source: 'fiche' | 'global';
};

export type EspaceData = {
  profile: {
    id: string;
    full_name: string;
    level: string | null;
    email: string | null;
    classe: string | null;
  };
  teacher: { id: string; full_name: string } | null;
  homework: EspaceHomework[];
  nextLesson: EspaceLesson | null;
  pastLessons: EspaceLesson[];
  messages: EspaceMessage[];
  work: EspaceSheet[];
  badges: { id: string; course_id: string; badge_name: string; unlocked_at: string }[];
  achievements: EspaceAchievement[];
  exercisesCount: number;
};

async function findTeacher(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<{ id: string; full_name: string } | null> {
  const { data } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .in('role', ['admin', 'enseignant']);
  if (!data?.length) return null;
  const teacher = data.find((row) => row.role === 'admin') || data[0];
  return { id: teacher.id, full_name: teacher.full_name || 'Enseignant' };
}

export async function getStudentEspaceData(): Promise<EspaceData | null> {
  const auth = await getAuthContext();
  if (!auth.user || auth.role === 'invite') return null;
  const userId = auth.user.id;

  const supabase = await createClient();
  const now = new Date().toISOString();

  const profileRes = await supabase
    .from('profiles')
    .select('id, full_name, level, email, classe')
    .eq('id', userId)
    .maybeSingle();
  const profile = profileRes.data;
  if (!profile) return null;

  const classHomeworkRes = profile.classe
    ? await supabase
        .from('homework')
        .select('id, title, description, due_at, course_id, status, page_path, page_title, student_id, classe')
        .eq('classe', profile.classe)
        .is('student_id', null)
    : { data: [] as never[] };

  const [
    homeworkRes,
    lessonsRes,
    assignedRes,
    badgesRes,
    achievementsRes,
    progressRes,
    teacher,
  ] = await Promise.all([
    supabase
      .from('homework')
      .select('id, title, description, due_at, course_id, status, page_path, page_title, student_id, classe')
      .eq('student_id', userId)
      .order('due_at', { ascending: true, nullsFirst: false }),
    supabase
      .from('lessons')
      .select('id, starts_at, duration_minutes, title')
      .eq('student_id', userId)
      .order('starts_at', { ascending: true }),
    supabase
      .from('assigned_work')
      .select('course_id, course_title, chapter, level')
      .eq('student_id', userId)
      .order('created_at', { ascending: true }),
    supabase
      .from('badges')
      .select('id, course_id, badge_name, unlocked_at')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false }),
    supabase
      .from('user_achievements')
      .select('achievement_id, title, description')
      .eq('user_id', userId)
      .order('unlocked_at', { ascending: false }),
    supabase.from('user_progress').select('exercise_id, course_id').eq('user_id', userId),
    findTeacher(supabase),
  ]);

  const completionRes = await supabase
    .from('homework_completions')
    .select('homework_id')
    .eq('user_id', userId);
  const doneShared = new Set((completionRes.data || []).map((row) => row.homework_id));

  const homework: EspaceHomework[] = [
    ...(homeworkRes.data || []).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      due_at: row.due_at,
      course_id: row.course_id,
      page_path: row.page_path,
      page_title: row.page_title,
      status: row.status as 'assigned' | 'done',
      shared: false,
    })),
    ...(classHomeworkRes.data || []).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      due_at: row.due_at,
      course_id: row.course_id,
      page_path: row.page_path,
      page_title: row.page_title,
      status: (doneShared.has(row.id) ? 'done' : 'assigned') as 'assigned' | 'done',
      shared: true,
    })),
  ].sort((a, b) => (a.due_at || '9999').localeCompare(b.due_at || '9999'));

  let messages: EspaceMessage[] = [];
  if (teacher) {
    const { data: thread } = await supabase
      .from('messages')
      .select('id, sender_id, recipient_id, body, created_at')
      .or(
        `and(sender_id.eq.${userId},recipient_id.eq.${teacher.id}),and(sender_id.eq.${teacher.id},recipient_id.eq.${userId})`,
      )
      .order('created_at', { ascending: true })
      .limit(50);

    messages = (thread || []).map((row) => ({
      id: row.id,
      sender_id: row.sender_id,
      body: row.body,
      created_at: row.created_at,
      mine: row.sender_id === userId,
    }));

    await supabase
      .from('messages')
      .update({ read_at: now })
      .eq('recipient_id', userId)
      .is('read_at', null);
  }

  const assigned = assignedRes.data || [];
  const catalog = await getExercisesForCourses(assigned.map((row) => row.course_id));
  const completed = new Set((progressRes.data || []).map((row) => row.exercise_id));
  const badgeIds = new Set((badgesRes.data || []).map((row) => row.course_id));

  const work: EspaceSheet[] = assigned.map((row) => {
    const exercises = catalog
      .filter((exercise) => exercise.courseId === row.course_id)
      .map((exercise) => ({
        id: exercise.id,
        label: exercise.label,
        hasVerification: exercise.hasVerification,
        completed: completed.has(exercise.id),
      }));
    const completedCount = exercises.filter((exercise) => exercise.completed).length;
    return {
      courseId: row.course_id,
      courseTitle: row.course_title,
      chapter: row.chapter || 'Travail en cours',
      level: row.level,
      completedCount,
      total: exercises.length,
      badgeUnlocked: badgeIds.has(row.course_id),
      exercises,
    };
  });

  const lessons = lessonsRes.data || [];
  const upcoming = lessons.filter((lesson) => lesson.starts_at >= now);
  const past = lessons.filter((lesson) => lesson.starts_at < now).reverse();

  const badges = badgesRes.data || [];
  const exercisesCount = progressRes.data?.length || 0;
  const globalUnlocked = ACHIEVEMENTS.filter((achievement) =>
    achievement.condition({
      badgesCount: badges.length,
      exercisesCount,
      badges,
      completedChapters: [],
    }),
  ).map((achievement) => ({
    id: achievement.id,
    title: achievement.title,
    description: achievement.description,
    source: 'global' as const,
  }));

  const ficheUnlocked = (achievementsRes.data || []).map((row) => ({
    id: row.achievement_id,
    title: row.title,
    description: row.description || 'Tous les exercices de cette fiche sont validés.',
    source: 'fiche' as const,
  }));

  const seen = new Set<string>();
  const achievements: EspaceAchievement[] = [];
  for (const item of [...ficheUnlocked, ...globalUnlocked]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    achievements.push(item);
  }

  return {
    profile: {
      id: profile.id,
      full_name: profile.full_name,
      level: profile.level,
      email: profile.email,
      classe: profile.classe,
    },
    teacher,
    homework,
    nextLesson: upcoming[0] || null,
    pastLessons: past.slice(0, 8),
    messages,
    work,
    badges,
    achievements,
    exercisesCount,
  };
}

export async function sendStudentMessage(body: string): Promise<{ error: string | null }> {
  const auth = await getAuthContext();
  if (!auth.user) return { error: 'unauthenticated' };
  if (auth.role === 'invite' || auth.isElevated) return { error: 'forbidden' };

  const text = String(body || '').trim();
  if (text.length < 2) return { error: 'empty' };
  if (text.length > 2000) return { error: 'too_long' };

  const supabase = await createClient();
  const teacher = await findTeacher(supabase);
  if (!teacher) return { error: 'no_teacher' };

  const { error } = await supabase.from('messages').insert({
    sender_id: auth.user.id,
    recipient_id: teacher.id,
    body: text,
  });

  if (error) return { error: 'save_failed' };
  revalidatePath('/espace');
  revalidatePath('/admin');
  return { error: null };
}

export async function markHomeworkDone(homeworkId: string): Promise<{ error: string | null }> {
  const auth = await getAuthContext();
  if (!auth.user) return { error: 'unauthenticated' };
  if (auth.role !== 'student') return { error: 'forbidden' };

  const id = String(homeworkId || '').trim();
  if (!id) return { error: 'invalid' };

  const supabase = await createClient();
  const { data: row } = await supabase
    .from('homework')
    .select('id, student_id, classe')
    .eq('id', id)
    .maybeSingle();
  if (!row) return { error: 'invalid' };

  if (row.student_id === auth.user.id) {
    const { error } = await supabase
      .from('homework')
      .update({ status: 'done' })
      .eq('id', id)
      .eq('student_id', auth.user.id);
    if (error) return { error: 'save_failed' };
    revalidatePath('/espace');
    return { error: null };
  }

  if (row.classe) {
    const { error } = await supabase.from('homework_completions').insert({
      homework_id: id,
      user_id: auth.user.id,
    });
    if (error && !error.message.toLowerCase().includes('duplicate')) return { error: 'save_failed' };
    revalidatePath('/espace');
    return { error: null };
  }

  return { error: 'forbidden' };
}
