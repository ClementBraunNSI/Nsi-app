'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { parseEvaluationSubject, type EvaluationExercise, type EvaluationGrading } from '@/lib/evaluation-subject';
import type { IncidentKind } from '@/lib/evaluation-guard';
import { everyTestPassed, unexpectedRunReport, CHECK_UNAVAILABLE, type RunReport } from '@/lib/python-check';
import { runPythonCheck, runSqlCheck } from '@/lib/run-exercise-check';

/*
 * Élève : tout passe par les fonctions eval_* de la base, avec sa propre session.
 * Elles ne renvoient que son sujet, sans tests ni code de déverrouillage.
 * Enseignant : accès direct aux tables, ouvert par RLS aux seuls comptes admin et enseignant.
 */

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };

const fail = (error: string) => ({ ok: false as const, error });

/** Correction à jour : faite après la dernière modification du code. */
function isGraded(answer: { graded_at?: string | null; updated_at?: string | null }) {
  return Boolean(answer.graded_at) && Date.parse(answer.graded_at!) >= Date.parse(answer.updated_at ?? '');
}

function messageOf(error: { message?: string } | null | undefined, fallback: string) {
  const text = error?.message?.trim();
  return text && text.length < 200 ? text : fallback;
}

// ---------- Élève ----------

export type MyEvaluation = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number | null;
  evaluationStatus: 'ouverte' | 'fermee';
  attemptStatus: 'en_cours' | 'rendue' | null;
  locked: boolean;
  startedAt: string | null;
  submittedAt: string | null;
};

export async function listMyEvaluations(): Promise<MyEvaluation[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc('eval_list_mine');
  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    durationMinutes: row.duration_minutes,
    evaluationStatus: row.evaluation_status,
    attemptStatus: row.attempt_status,
    locked: Boolean(row.locked),
    startedAt: row.started_at,
    submittedAt: row.submitted_at,
  }));
}

export async function startEvaluation(evaluationId: string): Promise<Result<{ attemptId: string }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('eval_start', { p_evaluation: evaluationId });
  if (error || !data) return fail(messageOf(error, "L'évaluation n'a pas pu commencer."));
  revalidatePath(`/evaluations/${evaluationId}`);
  return { ok: true, attemptId: String(data) };
}

export async function saveEvaluationAnswer(attemptId: string, exerciseId: string, code: string): Promise<Result<{ savedAt: string }>> {
  if (code.length > 60000) return fail('Le code dépasse 60 000 caractères.');
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('eval_save_answer', { p_attempt: attemptId, p_exercise: exerciseId, p_code: code });
  if (error) return fail(messageOf(error, "Le code n'a pas pu être enregistré."));
  return { ok: true, savedAt: String(data) };
}

export async function reportEvaluationIncident(attemptId: string, kind: IncidentKind, detail: string): Promise<Result<{ incidentId: number | null }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('eval_report_incident', {
    p_attempt: attemptId,
    p_kind: kind,
    p_detail: detail.slice(0, 20000),
  });
  if (error) return fail(messageOf(error, "L'incident n'a pas pu être enregistré."));
  return { ok: true, incidentId: data === null ? null : Number(data) };
}

export async function evaluationHeartbeat(attemptId: string): Promise<Result<{ locked: boolean; status: string; evaluationStatus: string }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('eval_heartbeat', { p_attempt: attemptId });
  if (error || !data) return fail(messageOf(error, 'Connexion perdue.'));
  return { ok: true, locked: Boolean(data.locked), status: String(data.status), evaluationStatus: String(data.evaluationStatus) };
}

export type UnlockedIncident = { kind: IncidentKind; detail: string; screenshot: string | null; createdAt: string };

export async function unlockEvaluation(
  attemptId: string,
  code: string,
): Promise<Result<{ status: 'ok' | 'refuse' | 'attente' | 'deverrouillee'; incidents: UnlockedIncident[] }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('eval_unlock', { p_attempt: attemptId, p_code: code.slice(0, 40) });
  if (error || !data) return fail(messageOf(error, 'Le déverrouillage a échoué.'));
  return { ok: true, status: data.status, incidents: data.incidents ?? [] };
}

export async function submitEvaluation(attemptId: string, evaluationId: string): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('eval_submit', { p_attempt: attemptId });
  if (error) return fail(messageOf(error, "La copie n'a pas pu être rendue."));
  revalidatePath(`/evaluations/${evaluationId}`);
  revalidatePath('/evaluations');
  return { ok: true };
}

// ---------- Enseignant ----------

async function teacher() {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  return { auth, supabase: await createClient() };
}

const NOT_ALLOWED = 'Réservé aux comptes enseignant et admin.';

export type EvaluationInput = {
  title: string;
  description: string;
  classes: string[];
  durationMinutes: number | null;
};

function cleanInput(input: EvaluationInput) {
  const duration = input.durationMinutes ? Math.round(Number(input.durationMinutes)) : null;
  return {
    title: String(input.title || '').trim().slice(0, 200),
    description: String(input.description || '').trim().slice(0, 4000),
    classes: [...new Set((input.classes || []).map((value) => String(value).trim()).filter(Boolean))],
    duration_minutes: duration && duration >= 5 && duration <= 600 ? duration : null,
  };
}

export async function listClasses(): Promise<string[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  const { data } = await ctx.supabase.from('profiles').select('classe').not('classe', 'is', null);
  return [...new Set((data ?? []).map((row) => String(row.classe).trim()).filter(Boolean))].sort();
}

export type EvaluationSummary = {
  id: string;
  title: string;
  status: 'brouillon' | 'ouverte' | 'fermee';
  classes: string[];
  durationMinutes: number | null;
  createdAt: string;
  subjects: number;
  attempts: number;
  submitted: number;
  locked: number;
};

export async function listEvaluations(): Promise<EvaluationSummary[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  const { data } = await ctx.supabase
    .from('evaluations')
    .select('id, title, status, classes, duration_minutes, created_at, evaluation_subjects(id), evaluation_attempts(status, locked)')
    .order('created_at', { ascending: false });
  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    classes: row.classes ?? [],
    durationMinutes: row.duration_minutes,
    createdAt: row.created_at,
    subjects: row.evaluation_subjects?.length ?? 0,
    attempts: row.evaluation_attempts?.length ?? 0,
    submitted: (row.evaluation_attempts ?? []).filter((attempt: any) => attempt.status === 'rendue').length,
    locked: (row.evaluation_attempts ?? []).filter((attempt: any) => attempt.status === 'en_cours' && attempt.locked).length,
  }));
}

export async function createEvaluation(input: EvaluationInput): Promise<Result<{ id: string }>> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const values = cleanInput(input);
  if (!values.title) return fail('Le titre est obligatoire.');
  const { data, error } = await ctx.supabase
    .from('evaluations')
    .insert({ ...values, created_by: ctx.auth.user!.id })
    .select('id')
    .single();
  if (error || !data) return fail(messageOf(error, "L'évaluation n'a pas pu être créée."));
  revalidatePath('/admin/evaluations');
  return { ok: true, id: data.id };
}

export async function updateEvaluation(id: string, input: EvaluationInput): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const values = cleanInput(input);
  if (!values.title) return fail('Le titre est obligatoire.');
  const { error } = await ctx.supabase.from('evaluations').update(values).eq('id', id);
  if (error) return fail(messageOf(error, "L'évaluation n'a pas pu être enregistrée."));
  revalidatePath(`/admin/evaluations/${id}`);
  return { ok: true };
}

export async function setEvaluationStatus(id: string, status: 'brouillon' | 'ouverte' | 'fermee'): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  if (status === 'ouverte') {
    const { data: subjects } = await ctx.supabase.from('evaluation_subjects').select('id, exercises').eq('evaluation_id', id);
    if (!(subjects ?? []).some((subject: any) => Array.isArray(subject.exercises) && subject.exercises.length > 0)) {
      return fail("Ajouter au moins un sujet avant d'ouvrir l'évaluation.");
    }
    const { data: evaluation } = await ctx.supabase.from('evaluations').select('classes').eq('id', id).single();
    if (!evaluation?.classes?.length) return fail("Choisir au moins une classe avant d'ouvrir l'évaluation.");
  }
  const now = new Date().toISOString();
  const patch = status === 'ouverte' ? { status, opened_at: now, closed_at: null } : status === 'fermee' ? { status, closed_at: now } : { status };
  const { error } = await ctx.supabase.from('evaluations').update(patch).eq('id', id);
  if (error) return fail(messageOf(error, "Le statut n'a pas pu changer."));
  if (status === 'fermee') {
    // Fermer l'évaluation rend toutes les copies encore ouvertes.
    await ctx.supabase
      .from('evaluation_attempts')
      .update({ status: 'rendue', submitted_at: now, locked: false })
      .eq('evaluation_id', id)
      .eq('status', 'en_cours');
  }
  revalidatePath(`/admin/evaluations/${id}`);
  revalidatePath('/admin/evaluations');
  return { ok: true };
}

export async function deleteEvaluation(id: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  await ctx.supabase.from('evaluation_attempts').delete().eq('evaluation_id', id);
  const { error } = await ctx.supabase.from('evaluations').delete().eq('id', id);
  if (error) return fail(messageOf(error, "L'évaluation n'a pas pu être supprimée."));
  revalidatePath('/admin/evaluations');
  return { ok: true };
}

export type SubjectSaveResult = Result<{ id: string; warnings: string[] }> | { ok: false; error: string; errors: string[] };

export async function saveEvaluationSubject(input: {
  evaluationId: string;
  subjectId?: string | null;
  label: string;
  source: string;
}): Promise<SubjectSaveResult> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const label = String(input.label || '').trim().slice(0, 120) || 'Sujet';
  const source = String(input.source || '');
  if (source.length > 200000) return fail('Le sujet dépasse 200 000 caractères.');
  const parsed = parseEvaluationSubject(source);
  if (parsed.errors.length > 0) return { ok: false, error: 'Le sujet contient des erreurs.', errors: parsed.errors };

  const values = { label, source, exercises: parsed.exercises, grading: parsed.grading };
  if (input.subjectId) {
    const { error } = await ctx.supabase.from('evaluation_subjects').update(values).eq('id', input.subjectId).eq('evaluation_id', input.evaluationId);
    if (error) return fail(messageOf(error, "Le sujet n'a pas pu être enregistré."));
    revalidatePath(`/admin/evaluations/${input.evaluationId}`);
    return { ok: true, id: input.subjectId, warnings: parsed.warnings };
  }
  const { count } = await ctx.supabase.from('evaluation_subjects').select('id', { count: 'exact', head: true }).eq('evaluation_id', input.evaluationId);
  const { data, error } = await ctx.supabase
    .from('evaluation_subjects')
    .insert({ ...values, evaluation_id: input.evaluationId, position: count ?? 0 })
    .select('id')
    .single();
  if (error || !data) return fail(messageOf(error, "Le sujet n'a pas pu être enregistré."));
  revalidatePath(`/admin/evaluations/${input.evaluationId}`);
  return { ok: true, id: data.id, warnings: parsed.warnings };
}

export async function deleteEvaluationSubject(evaluationId: string, subjectId: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const { count } = await ctx.supabase.from('evaluation_attempts').select('id', { count: 'exact', head: true }).eq('subject_id', subjectId);
  if (count) return fail('Des élèves ont déjà reçu ce sujet : il ne peut plus être supprimé.');
  const { error } = await ctx.supabase.from('evaluation_subjects').delete().eq('id', subjectId).eq('evaluation_id', evaluationId);
  if (error) return fail(messageOf(error, "Le sujet n'a pas pu être supprimé."));
  revalidatePath(`/admin/evaluations/${evaluationId}`);
  return { ok: true };
}

export type BoardRow = {
  studentId: string;
  name: string;
  classe: string | null;
  attemptId: string | null;
  status: 'pas_commencee' | 'en_cours' | 'verrouillee' | 'rendue';
  subjectLabel: string | null;
  unlockCode: string | null;
  failedUnlocks: number;
  startedAt: string | null;
  submittedAt: string | null;
  lastSeenAt: string | null;
  incidents: number;
  openIncidents: number;
  exercisesWritten: number;
  exercisesTotal: number;
  passed: number;
  graded: number;
  toGrade: number;
};

export type EvaluationBoard = {
  evaluation: {
    id: string;
    title: string;
    description: string;
    status: 'brouillon' | 'ouverte' | 'fermee';
    classes: string[];
    durationMinutes: number | null;
  };
  subjects: { id: string; label: string; source: string; exercises: EvaluationExercise[]; grading: EvaluationGrading[]; attempts: number }[];
  rows: BoardRow[];
  now: string;
};

export async function getEvaluationBoard(id: string): Promise<EvaluationBoard | null> {
  const ctx = await teacher();
  if (!ctx) return null;
  const { supabase } = ctx;
  const { data: evaluation } = await supabase
    .from('evaluations')
    .select('id, title, description, status, classes, duration_minutes')
    .eq('id', id)
    .maybeSingle();
  if (!evaluation) return null;

  const [{ data: subjects }, { data: attempts }, { data: students }] = await Promise.all([
    supabase.from('evaluation_subjects').select('id, label, source, exercises, grading, position').eq('evaluation_id', id).order('position'),
    supabase
      .from('evaluation_attempts')
      .select('id, user_id, subject_id, status, locked, unlock_code, failed_unlocks, started_at, submitted_at, last_seen_at, evaluation_answers(exercise_id, code, passed, graded_at, updated_at), evaluation_incidents(id, locks, resolved_at)')
      .eq('evaluation_id', id),
    evaluation.classes?.length
      ? supabase.from('profiles').select('id, full_name, classe, role').in('classe', evaluation.classes).eq('role', 'student')
      : Promise.resolve({ data: [] as any[] }),
  ]);

  const subjectById = new Map((subjects ?? []).map((subject: any) => [subject.id, subject]));
  const attemptByUser = new Map((attempts ?? []).map((attempt: any) => [attempt.user_id, attempt]));
  const people = new Map<string, { name: string; classe: string | null }>();
  for (const student of students ?? []) people.set(student.id, { name: student.full_name || 'Élève', classe: student.classe });
  // Un élève qui a changé de classe garde sa copie dans le tableau.
  const missing = (attempts ?? []).map((attempt: any) => attempt.user_id).filter((userId: string) => !people.has(userId));
  if (missing.length) {
    const { data: others } = await supabase.from('profiles').select('id, full_name, classe').in('id', missing);
    for (const other of others ?? []) people.set(other.id, { name: other.full_name || 'Élève', classe: other.classe });
  }

  const rows: BoardRow[] = [...people.entries()].map(([studentId, person]) => {
    const attempt: any = attemptByUser.get(studentId);
    const subject: any = attempt ? subjectById.get(attempt.subject_id) : null;
    const exercises: EvaluationExercise[] = subject?.exercises ?? [];
    const answers: any[] = attempt?.evaluation_answers ?? [];
    const written = answers.filter((answer) => answer.code?.trim()).length;
    const graded = answers.filter(isGraded);
    const incidents: any[] = attempt?.evaluation_incidents ?? [];
    const tested = new Set((subject?.grading ?? []).filter((item: EvaluationGrading) => item.verification?.trim()).map((item: EvaluationGrading) => item.id));
    return {
      studentId,
      name: person.name,
      classe: person.classe,
      attemptId: attempt?.id ?? null,
      status: !attempt ? 'pas_commencee' : attempt.status === 'rendue' ? 'rendue' : attempt.locked ? 'verrouillee' : 'en_cours',
      subjectLabel: subject?.label ?? null,
      unlockCode: attempt?.unlock_code ?? null,
      failedUnlocks: attempt?.failed_unlocks ?? 0,
      startedAt: attempt?.started_at ?? null,
      submittedAt: attempt?.submitted_at ?? null,
      lastSeenAt: attempt?.last_seen_at ?? null,
      incidents: incidents.length,
      openIncidents: incidents.filter((incident) => incident.locks && !incident.resolved_at).length,
      exercisesWritten: written,
      exercisesTotal: exercises.length,
      passed: graded.filter((answer) => answer.passed).length,
      graded: graded.length,
      // Copies rendues dont un exercice écrit n'a pas encore été corrigé (ou a changé depuis).
      toGrade: attempt?.status === 'rendue'
        ? answers.filter((answer) => answer.code?.trim() && tested.has(answer.exercise_id) && !isGraded(answer)).length
        : 0,
    };
  });
  rows.sort((a, b) => (a.classe ?? '').localeCompare(b.classe ?? '') || a.name.localeCompare(b.name, 'fr'));

  const attemptCount = new Map<string, number>();
  for (const attempt of attempts ?? []) attemptCount.set(attempt.subject_id, (attemptCount.get(attempt.subject_id) ?? 0) + 1);

  return {
    evaluation: {
      id: evaluation.id,
      title: evaluation.title,
      description: evaluation.description,
      status: evaluation.status,
      classes: evaluation.classes ?? [],
      durationMinutes: evaluation.duration_minutes,
    },
    subjects: (subjects ?? []).map((subject: any) => ({
      id: subject.id,
      label: subject.label,
      source: subject.source,
      exercises: subject.exercises ?? [],
      grading: subject.grading ?? [],
      attempts: attemptCount.get(subject.id) ?? 0,
    })),
    rows,
    now: new Date().toISOString(),
  };
}

export type AttemptDetail = {
  attemptId: string;
  name: string;
  classe: string | null;
  subjectLabel: string;
  unlockCode: string;
  status: string;
  locked: boolean;
  exercises: (EvaluationExercise & { correction: string; hasTests: boolean })[];
  answers: Record<string, { code: string; updatedAt: string; passed: boolean | null; testsPassed: number | null; testsTotal: number | null; report: RunReport | null; gradedAt: string | null }>;
  incidents: { id: number; kind: IncidentKind; detail: string; screenshot: string | null; locks: boolean; createdAt: string; resolvedAt: string | null }[];
};

export async function getAttemptDetail(attemptId: string): Promise<AttemptDetail | null> {
  const ctx = await teacher();
  if (!ctx) return null;
  const { data: attempt } = await ctx.supabase
    .from('evaluation_attempts')
    .select('id, user_id, status, locked, unlock_code, evaluation_subjects(label, exercises, grading), evaluation_answers(exercise_id, code, updated_at, passed, tests_passed, tests_total, report, graded_at), evaluation_incidents(id, kind, detail, screenshot, locks, created_at, resolved_at)')
    .eq('id', attemptId)
    .maybeSingle();
  if (!attempt) return null;
  const { data: profile } = await ctx.supabase.from('profiles').select('full_name, classe').eq('id', attempt.user_id).maybeSingle();
  const subject: any = attempt.evaluation_subjects;
  const grading = new Map<string, EvaluationGrading>((subject?.grading ?? []).map((item: EvaluationGrading) => [item.id, item]));
  return {
    attemptId: attempt.id,
    name: profile?.full_name || 'Élève',
    classe: profile?.classe ?? null,
    subjectLabel: subject?.label ?? '',
    unlockCode: attempt.unlock_code,
    status: attempt.status,
    locked: attempt.locked,
    exercises: (subject?.exercises ?? []).map((exercise: EvaluationExercise) => ({
      ...exercise,
      correction: grading.get(exercise.id)?.correction ?? '',
      hasTests: Boolean(grading.get(exercise.id)?.verification),
    })),
    answers: Object.fromEntries(
      ((attempt as any).evaluation_answers ?? []).map((answer: any) => [
        answer.exercise_id,
        {
          code: answer.code,
          updatedAt: answer.updated_at,
          passed: answer.passed,
          testsPassed: answer.tests_passed,
          testsTotal: answer.tests_total,
          report: answer.report,
          gradedAt: answer.graded_at,
        },
      ]),
    ),
    incidents: ((attempt as any).evaluation_incidents ?? [])
      .map((incident: any) => ({
        id: incident.id,
        kind: incident.kind,
        detail: incident.detail,
        screenshot: incident.screenshot,
        locks: incident.locks,
        createdAt: incident.created_at,
        resolvedAt: incident.resolved_at,
      }))
      .sort((a: any, b: any) => a.createdAt.localeCompare(b.createdAt)),
  };
}

export async function unlockAttemptRemotely(attemptId: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const now = new Date().toISOString();
  const { error } = await ctx.supabase.from('evaluation_attempts').update({ locked: false, failed_unlocks: 0 }).eq('id', attemptId);
  if (error) return fail(messageOf(error, 'Le déverrouillage a échoué.'));
  await ctx.supabase.from('evaluation_incidents').update({ resolved_at: now }).eq('attempt_id', attemptId).is('resolved_at', null);
  return { ok: true };
}

/** Rouvre la copie d'un élève (rendue par erreur, ou fermée avant la fin). */
export async function reopenAttempt(attemptId: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const { error } = await ctx.supabase.from('evaluation_attempts').update({ status: 'en_cours', submitted_at: null }).eq('id', attemptId);
  if (error) return fail(messageOf(error, 'La copie n\'a pas pu être rouverte.'));
  return { ok: true };
}

/** Efface la copie : l'élève recommence avec un nouveau sujet tiré au hasard. */
export async function resetAttempt(attemptId: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const { error } = await ctx.supabase.from('evaluation_attempts').delete().eq('id', attemptId);
  if (error) return fail(messageOf(error, "La copie n'a pas pu être effacée."));
  return { ok: true };
}

/** Correction automatique d'un exercice d'une copie, avec les tests du sujet (jamais envoyés à l'élève). */
export async function gradeEvaluationAnswer(attemptId: string, exerciseId: string): Promise<Result<{ passed: boolean }>> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const { data: attempt } = await ctx.supabase
    .from('evaluation_attempts')
    .select('id, evaluation_subjects(exercises, grading), evaluation_answers(exercise_id, code, updated_at)')
    .eq('id', attemptId)
    .maybeSingle();
  if (!attempt) return fail('Copie introuvable.');
  const subject: any = attempt.evaluation_subjects;
  const exercise: EvaluationExercise | undefined = (subject?.exercises ?? []).find((item: EvaluationExercise) => item.id === exerciseId);
  const verification = (subject?.grading ?? []).find((item: EvaluationGrading) => item.id === exerciseId)?.verification?.trim() ?? '';
  const answer = ((attempt as any).evaluation_answers ?? []).find((item: any) => item.exercise_id === exerciseId);
  if (!exercise || !answer) return fail('Exercice introuvable.');
  if (!verification) return fail("Cet exercice n'a pas de tests.");

  let report: RunReport;
  try {
    report = exercise.type === 'sql'
      ? await runSqlCheck(answer.code, verification, exercise.sqlSetup ?? '')
      : await runPythonCheck(answer.code, verification, exercise.packages ?? []);
  } catch {
    report = unexpectedRunReport(CHECK_UNAVAILABLE);
  }
  const passed = everyTestPassed(report);
  const { error } = await ctx.supabase
    .from('evaluation_answers')
    .update({
      passed,
      tests_passed: report.tests.filter((test) => test.ok).length,
      tests_total: report.tests.length,
      report,
      // Date de la version corrigée : une modification plus récente redemandera une correction.
      graded_at: new Date(Math.max(Date.now(), Date.parse(answer.updated_at) + 1)).toISOString(),
    })
    .eq('attempt_id', attemptId)
    .eq('exercise_id', exerciseId);
  if (error) return fail(messageOf(error, "La correction n'a pas pu être enregistrée."));
  return { ok: true, passed };
}

/**
 * Exercices écrits des copies rendues qui attendent une correction automatique.
 * `all` reprend aussi ceux déjà corrigés (après une modification des tests du sujet).
 */
export async function answersToGrade(evaluationId: string, all = false): Promise<{ attemptId: string; exerciseId: string }[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  const { data } = await ctx.supabase
    .from('evaluation_attempts')
    .select('id, status, evaluation_subjects(grading), evaluation_answers(exercise_id, code, graded_at, updated_at)')
    .eq('evaluation_id', evaluationId)
    .eq('status', 'rendue');
  const work: { attemptId: string; exerciseId: string }[] = [];
  for (const attempt of data ?? []) {
    const tested = new Set(((attempt as any).evaluation_subjects?.grading ?? []).filter((item: EvaluationGrading) => item.verification?.trim()).map((item: EvaluationGrading) => item.id));
    for (const answer of (attempt as any).evaluation_answers ?? []) {
      if (!answer.code?.trim() || !tested.has(answer.exercise_id)) continue;
      if (!all && isGraded(answer)) continue;
      work.push({ attemptId: attempt.id, exerciseId: answer.exercise_id });
    }
  }
  return work;
}
