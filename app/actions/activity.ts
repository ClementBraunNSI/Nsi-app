"use server";

import { createClient } from "@/utils/supabase/server";
import { getAuthContext } from "@/lib/auth";
import { getAllExercises } from "@/app/actions/getExercises";
import { lastWorkByStudent } from "@/lib/last-work";
import { fetchSubmissionDates } from "@/lib/last-work-server";
import { WINDOW_DAYS, type BoardEvent, type BoardStudent, type TypingSeverity } from "@/lib/activity-board";

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
  studentId: string;
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
    studentId: id,
    fullName: profileRes.data.full_name || "Élève",
    sheets,
    groups,
  };
}

/**
 * Page Activité : les 30 derniers jours de chaque élève (exercices, fiches, devoirs, messages envoyés),
 * avec le résumé du suivi de frappe des exercices réussis quand il existe. Réservé à l'enseignant.
 */
export async function getActivityBoard(): Promise<BoardStudent[] | null> {
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
  if (ids.length === 0) return [];

  const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000).toISOString();
  // Résumé de frappe : seulement la gravité, pas l'historique. La colonne peut manquer tant que sa migration n'est pas appliquée.
  const typingQuery = supabase
    .from("exercise_submissions")
    .select("user_id, exercise_id, created_at, severity:typing->summary->>severity")
    .in("user_id", ids)
    .in("status", ["auto", "validee"])
    .not("typing", "is", null)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5000);

  const [progressRes, badgesRes, completionsRes, individualRes, messagesRes, typingRes, exercises, submissionDates] = await Promise.all([
    supabase.from("user_progress").select("user_id, exercise_id, course_id, completed_at").in("user_id", ids),
    supabase.from("badges").select("user_id, badge_name, unlocked_at").in("user_id", ids),
    supabase.from("homework_completions").select("user_id, completed_at, homework_id").in("user_id", ids),
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
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(1000),
    typingQuery,
    getAllExercises(),
    fetchSubmissionDates(supabase, ids),
  ]);

  const exerciseInfo = new Map(exercises.map((exercise) => [exercise.id, exercise]));
  const homeworkIds = [...new Set((completionsRes.data || []).map((row) => row.homework_id))];
  const titles = new Map<string, string>();
  if (homeworkIds.length) {
    const { data: homework } = await supabase.from("homework").select("id, title").in("id", homeworkIds);
    for (const row of homework || []) titles.set(row.id, row.title);
  }

  // Dernier essai réussi suivi, par élève et par exercice.
  const severity = new Map<string, TypingSeverity>();
  if (!typingRes.error) {
    for (const row of (typingRes.data || []) as unknown as { user_id: string; exercise_id: string; severity: string | null }[]) {
      const key = `${row.user_id}|${row.exercise_id}`;
      if (severity.has(key)) continue;
      if (row.severity === "ok" || row.severity === "attention" || row.severity === "suspect") severity.set(key, row.severity);
    }
  }

  // Dernière activité : le même calcul que la liste des élèves et la page Aujourd'hui (lib/last-work.ts).
  const lastWork = lastWorkByStudent({
    progress: progressRes.data || [],
    badges: badgesRes.data || [],
    homework: completionsRes.data || [],
    submissions: submissionDates,
  });

  type Bucket = { events: BoardEvent[]; lastExercise: { at: string; sheet: string | null } | null; undated: string[] };
  const byStudent = new Map<string, Bucket>();
  for (const id of ids) byStudent.set(id, { events: [], lastExercise: null, undated: [] });

  for (const row of progressRes.data || []) {
    const bucket = byStudent.get(row.user_id);
    if (!bucket || !row.completed_at) continue;
    const exercise = exerciseInfo.get(row.exercise_id);
    const sheet = exercise?.courseTitle || row.course_id || null;
    if (!bucket.lastExercise || row.completed_at > bucket.lastExercise.at) bucket.lastExercise = { at: row.completed_at, sheet };
    if (row.completed_at < since) continue;
    bucket.events.push({
      at: row.completed_at,
      kind: "exercise",
      label: exercise?.label || row.exercise_id,
      exerciseId: row.exercise_id,
      sheet: sheet || undefined,
      severity: severity.get(`${row.user_id}|${row.exercise_id}`) ?? null,
    });
  }

  for (const row of badgesRes.data || []) {
    const bucket = byStudent.get(row.user_id);
    if (!bucket || !row.unlocked_at) continue;
    if (row.unlocked_at >= since) bucket.events.push({ at: row.unlocked_at, kind: "sheet", label: `Fiche terminée : ${row.badge_name}` });
  }

  for (const row of completionsRes.data || []) {
    const bucket = byStudent.get(row.user_id);
    if (!bucket || !row.completed_at) continue;
    if (row.completed_at >= since) {
      bucket.events.push({ at: row.completed_at, kind: "homework", label: `Devoir de classe rendu : ${titles.get(row.homework_id) || "Devoir"}` });
    }
  }

  for (const row of individualRes.data || []) {
    const bucket = row.student_id ? byStudent.get(row.student_id) : undefined;
    if (bucket) bucket.undated.push(row.title);
  }

  for (const row of messagesRes.data || []) {
    const bucket = byStudent.get(row.sender_id);
    if (bucket && row.created_at) bucket.events.push({ at: row.created_at, kind: "message", label: "Message envoyé" });
  }

  return rows.map((student) => {
    const bucket = byStudent.get(student.id)!;
    return {
      id: student.id,
      fullName: student.full_name || "Élève",
      classe: student.classe,
      privateLesson: Boolean(student.has_private_lessons),
      lastWorkAt: lastWork.get(student.id) ?? null,
      currentSheet: bucket.lastExercise?.sheet ?? null,
      events: bucket.events.sort((a, b) => b.at.localeCompare(a.at)),
      undated: bucket.undated,
    };
  });
}
