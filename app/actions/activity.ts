"use server";

import { createClient } from "@/utils/supabase/server";
import { getAuthContext } from "@/lib/auth";
import { getAllExercises } from "@/app/actions/getExercises";

export type ActivityEvent = {
  at: string | null;
  label: string;
  work: boolean;
};

export type StudentActivity = {
  id: string;
  fullName: string;
  classe: string | null;
  privateLesson: boolean;
  lastWorkAt: string | null;
  events: ActivityEvent[];
};

const PER_STUDENT = 4;

export type DoneSheet = {
  courseId: string;
  title: string;
  at: string;
};

export type DoneExercise = {
  id: string;
  label: string;
  at: string;
};

export type ExerciseSheetGroup = {
  courseId: string;
  title: string;
  exercises: DoneExercise[];
};

export type StudentWorkDetail = {
  fullName: string;
  sheets: DoneSheet[];
  groups: ExerciseSheetGroup[];
};

export async function getStudentWorkDetail(studentId: string): Promise<StudentWorkDetail | null> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;

  const id = String(studentId || "").trim();
  if (!id) return null;

  const supabase = await createClient();
  const [profileRes, progressRes, badgesRes, exercises] = await Promise.all([
    supabase.from("profiles").select("id, full_name, role").eq("id", id).eq("role", "student").maybeSingle(),
    supabase.from("user_progress").select("exercise_id, course_id, completed_at").eq("user_id", id),
    supabase.from("badges").select("course_id, badge_name, unlocked_at").eq("user_id", id),
    getAllExercises(),
  ]);

  if (!profileRes.data) return null;

  const byId = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const sheetExercises = new Map<string, string[]>();
  const sheetTitle = new Map<string, string>();
  for (const exercise of exercises) {
    const list = sheetExercises.get(exercise.courseId) || [];
    list.push(exercise.id);
    sheetExercises.set(exercise.courseId, list);
    if (!sheetTitle.has(exercise.courseId)) sheetTitle.set(exercise.courseId, exercise.courseTitle);
  }

  const progress = progressRes.data || [];
  const doneIds = new Set(progress.map((row) => row.exercise_id));
  const latestByCourse = new Map<string, string>();
  for (const row of progress) {
    if (!row.completed_at) continue;
    const current = latestByCourse.get(row.course_id);
    if (!current || row.completed_at > current) latestByCourse.set(row.course_id, row.completed_at);
  }

  const sheets: DoneSheet[] = [];
  const seenSheets = new Set<string>();
  for (const badge of badgesRes.data || []) {
    const courseId = badge.course_id;
    seenSheets.add(courseId);
    const fallback = latestByCourse.get(courseId);
    sheets.push({
      courseId,
      title: badge.badge_name || sheetTitle.get(courseId) || courseId,
      at: badge.unlocked_at || fallback || "",
    });
  }
  for (const [courseId, ids] of sheetExercises) {
    if (seenSheets.has(courseId) || ids.length === 0) continue;
    if (!ids.every((exerciseId) => doneIds.has(exerciseId))) continue;
    const at = latestByCourse.get(courseId);
    if (!at) continue;
    seenSheets.add(courseId);
    sheets.push({
      courseId,
      title: sheetTitle.get(courseId) || courseId,
      at,
    });
  }
  sheets.sort((a, b) => b.at.localeCompare(a.at) || a.title.localeCompare(b.title, "fr"));

  const grouped = new Map<string, ExerciseSheetGroup>();
  for (const row of progress) {
    const known = byId.get(row.exercise_id);
    const courseId = row.course_id || known?.courseId || "inconnu";
    const group = grouped.get(courseId) || {
      courseId,
      title: known?.courseTitle || sheetTitle.get(courseId) || courseId,
      exercises: [] as DoneExercise[],
    };
    group.exercises.push({
      id: row.exercise_id,
      label: known?.label || row.exercise_id,
      at: row.completed_at,
    });
    grouped.set(courseId, group);
  }
  const groups = [...grouped.values()]
    .map((group) => ({
      ...group,
      exercises: group.exercises.sort((a, b) => b.at.localeCompare(a.at) || a.label.localeCompare(b.label, "fr")),
    }))
    .sort((a, b) => {
      const aAt = a.exercises[0]?.at || "";
      const bAt = b.exercises[0]?.at || "";
      return bAt.localeCompare(aAt) || a.title.localeCompare(b.title, "fr");
    });

  return {
    fullName: profileRes.data.full_name || "Élève",
    sheets,
    groups,
  };
}

export async function getStudentActivity(): Promise<{
  particuliers: StudentActivity[];
  classe: StudentActivity[];
} | null> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;

  const supabase = await createClient();
  const { data: students } = await supabase
    .from("profiles")
    .select("id, full_name, classe, has_private_lessons")
    .eq("role", "student")
    .order("full_name", { ascending: true });

  const rows = students || [];
  const ids = rows.map((student) => student.id);
  if (ids.length === 0) return { particuliers: [], classe: [] };

  const [progressRes, badgesRes, completionsRes, individualRes, messagesRes, exercises] = await Promise.all([
    supabase
      .from("user_progress")
      .select("user_id, exercise_id, course_id, completed_at")
      .in("user_id", ids),
    supabase
      .from("badges")
      .select("user_id, badge_name, unlocked_at")
      .in("user_id", ids),
    supabase
      .from("homework_completions")
      .select("user_id, completed_at, homework_id")
      .in("user_id", ids),
    supabase
      .from("homework")
      .select("student_id, title")
      .eq("status", "done")
      .not("student_id", "is", null)
      .in("student_id", ids),
    supabase
      .from("messages")
      .select("sender_id, created_at")
      .in("sender_id", ids)
      .order("created_at", { ascending: false })
      .limit(300),
    getAllExercises(),
  ]);

  const exerciseLabel = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const homeworkIds = [...new Set((completionsRes.data || []).map((row) => row.homework_id))];
  const titles = new Map<string, string>();
  if (homeworkIds.length) {
    const { data: homework } = await supabase.from("homework").select("id, title").in("id", homeworkIds);
    for (const row of homework || []) titles.set(row.id, row.title);
  }

  const byStudent = new Map<string, { dated: ActivityEvent[]; undated: ActivityEvent[]; message: ActivityEvent | null }>();
  for (const id of ids) byStudent.set(id, { dated: [], undated: [], message: null });

  for (const row of progressRes.data || []) {
    const bucket = byStudent.get(row.user_id);
    if (!bucket || !row.completed_at) continue;
    const exercise = exerciseLabel.get(row.exercise_id);
    const name = exercise?.label || row.exercise_id;
    const sheet = exercise?.courseTitle || row.course_id;
    bucket.dated.push({
      at: row.completed_at,
      label: `Exercice validé · ${name}${sheet ? ` · ${sheet}` : ""}`,
      work: true,
    });
  }

  for (const row of badgesRes.data || []) {
    const bucket = byStudent.get(row.user_id);
    if (!bucket || !row.unlocked_at) continue;
    bucket.dated.push({
      at: row.unlocked_at,
      label: `Fiche terminée · ${row.badge_name}`,
      work: true,
    });
  }

  for (const row of completionsRes.data || []) {
    const bucket = byStudent.get(row.user_id);
    if (!bucket || !row.completed_at) continue;
    bucket.dated.push({
      at: row.completed_at,
      label: `Devoir de classe rendu · ${titles.get(row.homework_id) || "Devoir"}`,
      work: true,
    });
  }

  for (const row of individualRes.data || []) {
    if (!row.student_id) continue;
    const bucket = byStudent.get(row.student_id);
    if (!bucket) continue;
    bucket.undated.push({
      at: null,
      label: `Devoir particulier rendu · ${row.title} · date de rendu non enregistrée`,
      work: true,
    });
  }

  for (const row of messagesRes.data || []) {
    const bucket = byStudent.get(row.sender_id);
    if (!bucket || !row.created_at || bucket.message) continue;
    bucket.message = {
      at: row.created_at,
      label: "Message envoyé",
      work: false,
    };
  }

  const built: StudentActivity[] = rows.map((student) => {
    const bucket = byStudent.get(student.id)!;
    const dated = bucket.dated
      .filter((event) => event.at)
      .sort((a, b) => String(b.at).localeCompare(String(a.at)));
    const events = dated.slice(0, PER_STUDENT);
    if (bucket.message && !events.some((event) => event.label === "Message envoyé")) {
      events.push(bucket.message);
      events.sort((a, b) => String(b.at || "").localeCompare(String(a.at || "")));
    }
    for (const extra of bucket.undated.slice(0, 2)) events.push(extra);
    return {
      id: student.id,
      fullName: student.full_name || "Élève",
      classe: student.classe,
      privateLesson: Boolean(student.has_private_lessons),
      lastWorkAt: dated[0]?.at || null,
      events: events.slice(0, PER_STUDENT + 2),
    };
  });

  const sortGroup = (list: StudentActivity[]) =>
    list.sort((a, b) => {
      if (a.lastWorkAt && b.lastWorkAt) return b.lastWorkAt.localeCompare(a.lastWorkAt);
      if (a.lastWorkAt) return -1;
      if (b.lastWorkAt) return 1;
      return a.fullName.localeCompare(b.fullName, "fr");
    });

  return {
    particuliers: sortGroup(built.filter((student) => student.privateLesson)),
    classe: sortGroup(built.filter((student) => !student.privateLesson)),
  };
}
