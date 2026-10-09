"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getAuthContext } from "@/lib/auth";
import { listExerciseSheets } from "@/app/actions/getExercises";
import { listAllCoursePages, type SiteCoursePage } from "@/app/actions/coursePages";

function revalidateFollowup() {
  revalidatePath("/espace");
  revalidatePath("/admin");
  revalidatePath("/admin/messages");
  revalidatePath("/admin/devoirs");
}

async function requireTeacher() {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  return auth;
}

function cleanTitle(value: string) {
  return String(value || "").trim();
}

async function resolvePage(pagePath: string | undefined | null): Promise<SiteCoursePage | null> {
  const path = String(pagePath || "").trim();
  if (!path) return null;
  const pages = await listAllCoursePages();
  return pages.find((page) => page.path === path) || null;
}

/** Une page vide est acceptée. Seul un chemin renseigné mais inconnu est une erreur. */
async function optionalPage(pagePath: string | undefined | null): Promise<{ page: SiteCoursePage | null; error: "unknown_page" | null }> {
  const raw = String(pagePath ?? "").trim();
  if (!raw) return { page: null, error: null };
  const page = await resolvePage(raw);
  if (!page) return { page: null, error: "unknown_page" };
  return { page, error: null };
}

export async function createLesson(input: {
  studentId: string;
  startsAt: string;
  durationMinutes?: number;
  title?: string;
}): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };

  const studentId = String(input.studentId || "").trim();
  const startsAt = String(input.startsAt || "").trim();
  const durationMinutes = Number(input.durationMinutes || 60);
  if (!studentId || !startsAt || Number.isNaN(new Date(startsAt).getTime())) {
    return { error: "invalid" };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("lessons").insert({
    student_id: studentId,
    starts_at: new Date(startsAt).toISOString(),
    duration_minutes: durationMinutes >= 15 && durationMinutes <= 240 ? durationMinutes : 60,
    title: cleanTitle(input.title || "") || "Cours particulier",
  });

  if (error) return { error: "save_failed" };
  revalidateFollowup();
  return { error: null };
}

export async function updateLesson(input: {
  lessonId: string;
  startsAt: string;
  durationMinutes?: number;
  title?: string;
}): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };

  const lessonId = String(input.lessonId || "").trim();
  const startsAt = String(input.startsAt || "").trim();
  const durationMinutes = Number(input.durationMinutes || 60);
  if (!lessonId || !startsAt || Number.isNaN(new Date(startsAt).getTime())) {
    return { error: "invalid" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("lessons")
    .update({
      starts_at: new Date(startsAt).toISOString(),
      duration_minutes: durationMinutes >= 15 && durationMinutes <= 240 ? durationMinutes : 60,
      title: cleanTitle(input.title || "") || "Cours particulier",
    })
    .eq("id", lessonId);

  if (error) return { error: "save_failed" };
  revalidateFollowup();
  return { error: null };
}

export async function deleteLesson(lessonId: string): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };
  const id = String(lessonId || "").trim();
  if (!id) return { error: "invalid" };

  const supabase = await createClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) return { error: "save_failed" };
  revalidateFollowup();
  return { error: null };
}

async function pageAssignmentError(page: SiteCoursePage | null, opts: { classTarget: boolean; hasPrivateLessons: boolean }) {
  if (!page?.privateLesson) return null;
  if (opts.classTarget) return "private_class";
  if (!opts.hasPrivateLessons) return "private_student";
  return null;
}

export async function createHomework(input: {
  studentId: string;
  title: string;
  description?: string;
  dueAt?: string;
  courseId?: string;
  pagePath?: string;
  pageTitle?: string;
}): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };

  const studentId = String(input.studentId || "").trim();
  const resolved = await optionalPage(input.pagePath);
  if (resolved.error) return { error: resolved.error };
  const page = resolved.page;
  const title = cleanTitle(input.title) || page?.title || "";
  if (!studentId || !title) return { error: "invalid" };

  const supabase = await createClient();
  const { data: student } = await supabase
    .from("profiles")
    .select("id, has_private_lessons, role")
    .eq("id", studentId)
    .maybeSingle();
  if (!student || student.role !== "student") return { error: "invalid" };

  const pageError = await pageAssignmentError(page, {
    classTarget: false,
    hasPrivateLessons: Boolean(student.has_private_lessons),
  });
  if (pageError) return { error: pageError };

  const { error } = await supabase.from("homework").insert({
    student_id: studentId,
    classe: null,
    title,
    description: cleanTitle(input.description || "") || null,
    due_at: input.dueAt ? new Date(input.dueAt).toISOString() : null,
    course_id: String(input.courseId || "").trim() || null,
    page_path: page?.path || null,
    page_title: page?.title || cleanTitle(input.pageTitle || "") || null,
    created_by: auth.user!.id,
  });

  if (error) return { error: "save_failed" };
  revalidateFollowup();
  return { error: null };
}

export async function createClassHomework(input: {
  classe: string;
  title: string;
  description?: string;
  dueAt?: string;
  pagePath?: string;
}): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };

  const classe = String(input.classe || "").trim();
  const resolved = await optionalPage(input.pagePath);
  if (resolved.error) return { error: resolved.error };
  const page = resolved.page;
  const title = cleanTitle(input.title) || page?.title || "";
  if (!classe || classe.length > 80 || !title) return { error: "invalid" };
  const pageError = await pageAssignmentError(page, { classTarget: true, hasPrivateLessons: false });
  if (pageError) return { error: pageError };

  const supabase = await createClient();
  const { error } = await supabase.from("homework").insert({
    student_id: null,
    classe,
    title,
    description: cleanTitle(input.description || "") || null,
    due_at: input.dueAt ? new Date(input.dueAt).toISOString() : null,
    page_path: page?.path || null,
    page_title: page?.title || null,
    created_by: auth.user!.id,
  });

  if (error) return { error: "save_failed" };
  revalidateFollowup();
  return { error: null };
}

export async function updateHomework(input: {
  homeworkId: string;
  title: string;
  description?: string;
  dueAt?: string | null;
  pagePath?: string | null;
}): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };

  const homeworkId = String(input.homeworkId || "").trim();
  const resolved = await optionalPage(input.pagePath);
  if (resolved.error) return { error: resolved.error };
  const page = resolved.page;
  const title = cleanTitle(input.title) || page?.title || "";
  if (!homeworkId || !title) return { error: "invalid" };

  const supabase = await createClient();
  const { data: row } = await supabase
    .from("homework")
    .select("id, student_id, classe")
    .eq("id", homeworkId)
    .maybeSingle();
  if (!row) return { error: "invalid" };

  let hasPrivateLessons = false;
  if (row.student_id) {
    const { data: student } = await supabase
      .from("profiles")
      .select("has_private_lessons")
      .eq("id", row.student_id)
      .maybeSingle();
    hasPrivateLessons = Boolean(student?.has_private_lessons);
  }

  const pageError = await pageAssignmentError(page, {
    classTarget: !row.student_id,
    hasPrivateLessons,
  });
  if (pageError) return { error: pageError };

  const { error } = await supabase
    .from("homework")
    .update({
      title,
      description: cleanTitle(input.description || "") || null,
      due_at: input.dueAt ? new Date(input.dueAt).toISOString() : null,
      page_path: page?.path || null,
      page_title: page?.title || null,
    })
    .eq("id", homeworkId);

  if (error) return { error: "save_failed" };
  revalidateFollowup();
  return { error: null };
}

export async function deleteHomework(homeworkId: string): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };
  const id = String(homeworkId || "").trim();
  if (!id) return { error: "invalid" };

  const supabase = await createClient();
  const { error } = await supabase.from("homework").delete().eq("id", id);
  if (error) return { error: "save_failed" };
  revalidateFollowup();
  return { error: null };
}

export async function setStudentClasse(studentId: string, classe: string): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };

  const id = String(studentId || "").trim();
  const next = String(classe || "").trim();
  if (!id) return { error: "invalid" };
  if (next.length > 80) return { error: "invalid" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ classe: next || null })
    .eq("id", id)
    .eq("role", "student");

  if (error) return { error: "save_failed" };
  revalidateFollowup();
  return { error: null };
}

export async function assignWork(input: {
  studentId: string;
  courseId: string;
}): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };

  const studentId = String(input.studentId || "").trim();
  const courseId = String(input.courseId || "").trim();
  if (!studentId || !courseId) return { error: "invalid" };

  const sheets = await listExerciseSheets();
  const sheet = sheets.find((item) => item.courseId === courseId);
  if (!sheet) return { error: "unknown_sheet" };

  const supabase = await createClient();
  const { error } = await supabase.from("assigned_work").upsert(
    {
      student_id: studentId,
      course_id: sheet.courseId,
      course_title: sheet.courseTitle,
      chapter: sheet.chapter,
      level: sheet.level,
    },
    { onConflict: "student_id, course_id" },
  );

  if (error) return { error: "save_failed" };
  revalidateFollowup();
  return { error: null };
}

export async function unassignWork(studentId: string, courseId: string): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("assigned_work")
    .delete()
    .eq("student_id", studentId)
    .eq("course_id", courseId);

  if (error) return { error: "save_failed" };
  revalidateFollowup();
  return { error: null };
}

export async function sendTeacherMessage(studentId: string, body: string): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };

  const text = String(body || "").trim();
  const to = String(studentId || "").trim();
  if (!to || text.length < 2) return { error: "invalid" };
  if (text.length > 2000) return { error: "too_long" };

  const supabase = await createClient();
  const { data: student } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", to)
    .maybeSingle();
  if (!student || student.role !== "student") return { error: "invalid" };

  const { error } = await supabase.from("messages").insert({
    sender_id: auth.user!.id,
    recipient_id: to,
    body: text,
  });

  if (error) return { error: "save_failed" };
  revalidateFollowup();
  return { error: null };
}

export async function getStudentFollowup(studentId: string) {
  const auth = await requireTeacher();
  if (!auth) return null;

  const id = String(studentId || "").trim();
  if (!id) return null;

  const supabase = await createClient();
  const [profile, lessons, homework, classHomework, assigned, messages, sheets, pages] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, classe, has_private_lessons, level")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("lessons")
      .select("id, starts_at, duration_minutes, title")
      .eq("student_id", id)
      .order("starts_at", { ascending: true }),
    supabase
      .from("homework")
      .select("id, title, description, due_at, course_id, status, page_path, page_title, student_id, classe")
      .eq("student_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("homework")
      .select("id, title, description, due_at, page_path, page_title, classe, status")
      .is("student_id", null),
    supabase
      .from("assigned_work")
      .select("course_id, course_title, chapter, level")
      .eq("student_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("messages")
      .select("id, sender_id, recipient_id, body, created_at")
      .or(`sender_id.eq.${id},recipient_id.eq.${id}`)
      .order("created_at", { ascending: true })
      .limit(50),
    listExerciseSheets(),
    listAllCoursePages(),
  ]);

  const classe = profile.data?.classe || null;
  const shared = (classHomework.data || []).filter((row) => classe && row.classe === classe);

  return {
    profile: profile.data,
    lessons: lessons.data || [],
    homework: homework.data || [],
    classHomework: shared,
    assigned: assigned.data || [],
    messages: messages.data || [],
    sheets,
    pages,
    teacherId: auth.user!.id,
  };
}

export async function getTeacherInbox() {
  const auth = await requireTeacher();
  if (!auth) return null;

  const supabase = await createClient();
  const teacherId = auth.user!.id;
  const [{ data: students }, { data: messages }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name, email, classe, has_private_lessons")
      .eq("role", "student")
      .order("full_name", { ascending: true }),
    supabase
      .from("messages")
      .select("id, sender_id, recipient_id, body, created_at, read_at")
      .or(`sender_id.eq.${teacherId},recipient_id.eq.${teacherId}`)
      .order("created_at", { ascending: false })
      .limit(400),
  ]);

  const threads = (students || []).map((student) => {
    const related = (messages || []).filter(
      (message) => message.sender_id === student.id || message.recipient_id === student.id,
    );
    const latest = related[0];
    const unread = related.filter(
      (message) => message.recipient_id === teacherId && message.sender_id === student.id && !message.read_at,
    ).length;
    return {
      id: student.id,
      full_name: student.full_name,
      email: student.email,
      classe: student.classe,
      has_private_lessons: Boolean(student.has_private_lessons),
      lastBody: latest?.body || null,
      lastAt: latest?.created_at || null,
      unread,
    };
  });

  threads.sort((a, b) => {
    if (a.unread !== b.unread) return b.unread - a.unread;
    return (b.lastAt || "").localeCompare(a.lastAt || "");
  });

  return { teacherId, threads };
}

export async function getTeacherThread(studentId: string) {
  const auth = await requireTeacher();
  if (!auth) return null;
  const id = String(studentId || "").trim();
  if (!id) return null;

  const supabase = await createClient();
  const teacherId = auth.user!.id;
  const [{ data: student }, { data: messages }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email, classe, has_private_lessons").eq("id", id).eq("role", "student").maybeSingle(),
    supabase
      .from("messages")
      .select("id, sender_id, recipient_id, body, created_at")
      .or(
        `and(sender_id.eq.${teacherId},recipient_id.eq.${id}),and(sender_id.eq.${id},recipient_id.eq.${teacherId})`,
      )
      .order("created_at", { ascending: true })
      .limit(80),
  ]);

  if (!student) return null;

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("recipient_id", teacherId)
    .eq("sender_id", id)
    .is("read_at", null);

  return {
    student,
    teacherId,
    messages: messages || [],
  };
}

export async function getPrivateLessonSchedule() {
  const auth = await requireTeacher();
  if (!auth) return null;

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "student")
    .eq("has_private_lessons", true)
    .order("full_name", { ascending: true });

  const ids = (students || []).map((student) => student.id);
  const lessons = ids.length
    ? await supabase
        .from("lessons")
        .select("id, student_id, starts_at, duration_minutes, title")
        .in("student_id", ids)
        .gte("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
    : { data: [] as { id: string; student_id: string; starts_at: string; duration_minutes: number; title: string | null }[] };

  const next = new Map<string, NonNullable<typeof lessons.data>[number]>();
  for (const lesson of lessons.data || []) {
    if (!next.has(lesson.student_id)) next.set(lesson.student_id, lesson);
  }

  return {
    rows: (students || []).map((student) => ({
      id: student.id,
      full_name: student.full_name || "Élève",
      lesson: next.get(student.id) || null,
    })),
  };
}

export async function getPrivateHomeworkBoard() {
  const auth = await requireTeacher();
  if (!auth) return null;

  const supabase = await createClient();
  const [{ data: students }, pages] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, full_name")
      .eq("role", "student")
      .eq("has_private_lessons", true)
      .order("full_name", { ascending: true }),
    listAllCoursePages(),
  ]);

  const ids = (students || []).map((student) => student.id);
  const homework = ids.length
    ? await supabase
        .from("homework")
        .select("id, student_id, title, description, due_at, page_path, page_title, status, created_at")
        .in("student_id", ids)
        .is("classe", null)
        .order("created_at", { ascending: false })
    : { data: [] as never[] };

  const names = new Map((students || []).map((student) => [student.id, student.full_name || "Élève"]));
  return {
    students: students || [],
    pages,
    homework: (homework.data || []).map((row) => ({
      ...row,
      student_name: names.get(row.student_id) || "Élève",
    })),
  };
}

export async function getClassHomeworkBoard() {
  const auth = await requireTeacher();
  if (!auth) return null;

  const supabase = await createClient();
  const [pages, profiles, homework, completions] = await Promise.all([
    listAllCoursePages(),
    supabase.from("profiles").select("classe").eq("role", "student").not("classe", "is", null),
    supabase
      .from("homework")
      .select("id, title, description, due_at, page_path, page_title, classe, created_at")
      .is("student_id", null)
      .order("created_at", { ascending: false }),
    supabase.from("homework_completions").select("homework_id"),
  ]);

  const classes = [...new Set((profiles.data || []).map((row) => row.classe).filter(Boolean) as string[])].sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
  const counts = new Map<string, number>();
  for (const row of completions.data || []) {
    counts.set(row.homework_id, (counts.get(row.homework_id) || 0) + 1);
  }

  return {
    classes,
    pages: pages.filter((page) => !page.privateLesson),
    allPages: pages,
    homework: (homework.data || []).map((row) => ({
      ...row,
      doneCount: counts.get(row.id) || 0,
    })),
  };
}
