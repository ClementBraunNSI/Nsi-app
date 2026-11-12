'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { gradeCopy, type CopyGrade, type GradedAnswer } from '@/lib/evaluation-grade';
import { buildResult, sameResult, type EvaluationResult } from '@/lib/evaluation-result';
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
  /** Note sur 20, une fois l'évaluation fermée et la copie validée. */
  grade: number | null;
};

/** Évaluations programmées dont l'heure est arrivée : elles passent « ouvertes » (sans effet si rien n'est dû). */
async function openDueEvaluations(supabase: Awaited<ReturnType<typeof createClient>>) {
  await supabase.rpc('eval_open_due');
}

export async function listMyEvaluations(): Promise<MyEvaluation[]> {
  const supabase = await createClient();
  await openDueEvaluations(supabase);
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
    grade: row.grade != null ? Number(row.grade) : null,
  }));
}

export async function startEvaluation(evaluationId: string): Promise<Result<{ attemptId: string }>> {
  const supabase = await createClient();
  await openDueEvaluations(supabase);
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

export async function evaluationHeartbeat(
  attemptId: string,
): Promise<Result<{ locked: boolean; status: string; evaluationStatus: string; lockReason: IncidentKind | null }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('eval_heartbeat', { p_attempt: attemptId });
  if (error || !data) return fail(messageOf(error, 'Connexion perdue.'));
  return {
    ok: true,
    locked: Boolean(data.locked),
    status: String(data.status),
    evaluationStatus: String(data.evaluationStatus),
    lockReason: data.lockReason ?? null,
  };
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
  /** Date et heure de passage (ISO), choisies par l'enseignant à l'heure de Paris. */
  scheduledAt: string | null;
};

export type EvaluationStatus = 'brouillon' | 'programmee' | 'ouverte' | 'fermee';

function cleanInput(input: EvaluationInput) {
  const duration = input.durationMinutes ? Math.round(Number(input.durationMinutes)) : null;
  return {
    title: String(input.title || '').trim().slice(0, 200),
    description: String(input.description || '').trim().slice(0, 4000),
    classes: [...new Set((input.classes || []).map((value) => String(value).trim()).filter(Boolean))],
    duration_minutes: duration && duration >= 5 && duration <= 600 ? duration : null,
    scheduled_at: input.scheduledAt && !Number.isNaN(Date.parse(input.scheduledAt)) ? new Date(input.scheduledAt).toISOString() : null,
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
  status: EvaluationStatus;
  classes: string[];
  durationMinutes: number | null;
  scheduledAt: string | null;
  createdAt: string;
  subjects: number;
  attempts: number;
  submitted: number;
  locked: number;
};

export async function listEvaluations(): Promise<EvaluationSummary[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  await openDueEvaluations(ctx.supabase);
  const { data } = await ctx.supabase
    .from('evaluations')
    .select('id, title, status, classes, duration_minutes, scheduled_at, created_at, evaluation_subjects(id), evaluation_attempts(status, locked)')
    .order('created_at', { ascending: false });
  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    classes: row.classes ?? [],
    durationMinutes: row.duration_minutes,
    scheduledAt: row.scheduled_at ?? null,
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
  if (!values.scheduled_at) return fail("Choisir la date et l'heure de passage.");
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

export async function setEvaluationStatus(id: string, status: EvaluationStatus): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  if (status === 'programmee') {
    const { data: planned } = await ctx.supabase.from('evaluations').select('scheduled_at').eq('id', id).single();
    if (!planned?.scheduled_at) return fail("Choisir la date et l'heure de passage dans les réglages.");
    // Heure déjà passée : l'évaluation s'ouvre tout de suite.
    if (Date.parse(planned.scheduled_at) <= Date.now()) status = 'ouverte';
  }
  if (status === 'ouverte' || status === 'programmee') {
    const { data: subjects } = await ctx.supabase.from('evaluation_subjects').select('id, exercises').eq('evaluation_id', id);
    if (!(subjects ?? []).some((subject: any) => Array.isArray(subject.exercises) && subject.exercises.length > 0)) {
      return fail("Ajouter au moins un sujet avant d'ouvrir ou de programmer l'évaluation.");
    }
    const { data: evaluation } = await ctx.supabase.from('evaluations').select('classes').eq('id', id).single();
    if (!evaluation?.classes?.length) return fail("Choisir au moins une classe avant d'ouvrir ou de programmer l'évaluation.");
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
  /** Cause du verrouillage en cours : le dernier incident qui verrouille, pas encore débloqué. */
  lockReason: IncidentKind | null;
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
  /** Note de la copie (null tant que l'élève n'a pas commencé). */
  grade: { total: number; pendingReview: number; toValidate: number; ungraded: number; final: boolean } | null;
};

function summarize(grade: CopyGrade) {
  return { total: grade.total, pendingReview: grade.pendingReview, toValidate: grade.toValidate, ungraded: grade.ungraded, final: grade.final };
}

/** Réponses lues en base, telles que le calcul de la note les attend. */
function gradedAnswers(rows: any[]): Record<string, GradedAnswer> {
  return Object.fromEntries(
    rows.map((answer) => [
      answer.exercise_id,
      {
        code: answer.code ?? '',
        testsPassed: answer.tests_passed ?? null,
        testsTotal: answer.tests_total ?? null,
        report: answer.report ?? null,
        gradedAt: answer.graded_at ?? null,
        manualPoints: answer.manual_points != null ? Number(answer.manual_points) : null,
        reviewedAt: answer.reviewed_at ?? null,
      },
    ]),
  );
}

/** Note d'une copie du tableau ; repère au passage un résumé élève qui ne correspond plus à la note. */
function copyGrade(attempt: any, subject: any, answers: any[], stale: { id: string; result: EvaluationResult | null }[] | null) {
  const exercises = gradableExercises(subject);
  const graded = gradedAnswers(answers);
  const grade = gradeCopy(exercises, graded);
  if (stale) {
    const result = buildResult(exercises, graded, grade);
    if (!sameResult(attempt.result, result)) stale.push({ id: attempt.id, result });
  }
  return grade;
}

/**
 * Résumé de la copie lu par l'élève une fois l'évaluation fermée : réécrit après chaque changement de la note
 * (null tant que la note n'est pas validée). Sans effet si la colonne n'existe pas encore.
 */
async function syncAttemptResult(supabase: Awaited<ReturnType<typeof createClient>>, attemptId: string) {
  const { data: attempt, error } = await supabase
    .from('evaluation_attempts')
    .select('id, result, evaluation_subjects(exercises, grading), evaluation_answers(exercise_id, code, tests_passed, tests_total, report, graded_at, manual_points, reviewed_at)')
    .eq('id', attemptId)
    .maybeSingle();
  if (error || !attempt) return;
  const exercises = gradableExercises((attempt as any).evaluation_subjects);
  const answers = gradedAnswers((attempt as any).evaluation_answers ?? []);
  const result = buildResult(exercises, answers, gradeCopy(exercises, answers));
  if (sameResult((attempt as any).result, result)) return;
  await supabase.from('evaluation_attempts').update({ result }).eq('id', attemptId);
}

/** Exercices d'un sujet avec leur correction, pour le calcul de la note. */
function gradableExercises(subject: any) {
  const grading = new Map<string, EvaluationGrading>((subject?.grading ?? []).map((item: EvaluationGrading) => [item.id, item]));
  return ((subject?.exercises ?? []) as EvaluationExercise[]).map((exercise) => ({
    ...exercise,
    correction: grading.get(exercise.id)?.correction ?? '',
    hasTests: Boolean(grading.get(exercise.id)?.verification?.trim()),
  }));
}

export type EvaluationBoard = {
  evaluation: {
    id: string;
    title: string;
    description: string;
    status: EvaluationStatus;
    classes: string[];
    durationMinutes: number | null;
    scheduledAt: string | null;
  };
  subjects: { id: string; label: string; source: string; exercises: EvaluationExercise[]; grading: EvaluationGrading[]; attempts: number }[];
  rows: BoardRow[];
  now: string;
};

const BOARD_ATTEMPT_COLUMNS =
  'id, user_id, subject_id, status, locked, unlock_code, failed_unlocks, started_at, submitted_at, last_seen_at, result, evaluation_answers(exercise_id, code, passed, graded_at, updated_at, tests_passed, tests_total, report, manual_points, reviewed_at), evaluation_incidents(id, kind, locks, resolved_at, created_at)';

export async function getEvaluationBoard(id: string): Promise<EvaluationBoard | null> {
  const ctx = await teacher();
  if (!ctx) return null;
  const { supabase } = ctx;
  // Le tableau de suivi se recharge tout seul : il suffit à ouvrir l'évaluation à l'heure prévue.
  await openDueEvaluations(supabase);
  const { data: evaluation } = await supabase
    .from('evaluations')
    .select('id, title, description, status, classes, duration_minutes, scheduled_at')
    .eq('id', id)
    .maybeSingle();
  if (!evaluation) return null;

  const readAttempts = (columns: string) => supabase.from('evaluation_attempts').select(columns).eq('evaluation_id', id);
  const [{ data: subjects }, attemptsRead, { data: students }] = await Promise.all([
    supabase.from('evaluation_subjects').select('id, label, source, exercises, grading, position').eq('evaluation_id', id).order('position'),
    readAttempts(BOARD_ATTEMPT_COLUMNS),
    evaluation.classes?.length
      ? supabase.from('profiles').select('id, full_name, classe, role').in('classe', evaluation.classes).eq('role', 'student')
      : Promise.resolve({ data: [] as any[] }),
  ]);

  // Colonnes de la vérification ou du résultat absentes (migrations pas encore passées) : on relit sans elles.
  let attempts: any[] | null = attemptsRead.data as any[] | null;
  if (attemptsRead.error) {
    const withoutResult = await readAttempts(BOARD_ATTEMPT_COLUMNS.replace(', result,', ','));
    attempts = (withoutResult.error
      ? (await readAttempts(BOARD_ATTEMPT_COLUMNS.replace(', result,', ',').replace(', manual_points, reviewed_at', ''))).data
      : withoutResult.data) as any[] | null;
  }
  // Résumés pour les élèves à réécrire : barème ou tests du sujet modifiés après la validation, copies validées avant.
  const staleResults: { id: string; result: EvaluationResult | null }[] = [];
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
    const openLocks = incidents
      .filter((incident) => incident.locks && !incident.resolved_at)
      .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at) || b.id - a.id);
    return {
      studentId,
      name: person.name,
      classe: person.classe,
      attemptId: attempt?.id ?? null,
      status: !attempt ? 'pas_commencee' : attempt.status === 'rendue' ? 'rendue' : attempt.locked ? 'verrouillee' : 'en_cours',
      lockReason: attempt?.locked && attempt.status !== 'rendue' ? (openLocks[0]?.kind ?? null) : null,
      subjectLabel: subject?.label ?? null,
      unlockCode: attempt?.unlock_code ?? null,
      failedUnlocks: attempt?.failed_unlocks ?? 0,
      startedAt: attempt?.started_at ?? null,
      submittedAt: attempt?.submitted_at ?? null,
      lastSeenAt: attempt?.last_seen_at ?? null,
      incidents: incidents.length,
      openIncidents: openLocks.length,
      exercisesWritten: written,
      exercisesTotal: exercises.length,
      passed: graded.filter((answer) => answer.passed).length,
      graded: graded.length,
      // Copies rendues dont un exercice écrit n'a pas encore été corrigé (ou a changé depuis).
      toGrade: attempt?.status === 'rendue'
        ? answers.filter((answer) => answer.code?.trim() && tested.has(answer.exercise_id) && !isGraded(answer)).length
        : 0,
      grade: attempt ? summarize(copyGrade(attempt, subject, answers, attemptsRead.error ? null : staleResults)) : null,
    };
  });
  if (staleResults.length) {
    await Promise.all(staleResults.map((item) => supabase.from('evaluation_attempts').update({ result: item.result }).eq('id', item.id)));
  }
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
      scheduledAt: evaluation.scheduled_at ?? null,
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
  answers: Record<string, { code: string; updatedAt: string; passed: boolean | null; testsPassed: number | null; testsTotal: number | null; report: RunReport | null; gradedAt: string | null; manualPoints: number | null; reviewedAt: string | null }>;
  grade: CopyGrade;
  incidents: { id: number; kind: IncidentKind; detail: string; screenshot: string | null; locks: boolean; createdAt: string; resolvedAt: string | null }[];
};

export async function getAttemptDetail(attemptId: string): Promise<AttemptDetail | null> {
  const ctx = await teacher();
  if (!ctx) return null;
  const detailColumns = 'id, user_id, status, locked, unlock_code, evaluation_subjects(label, exercises, grading), evaluation_answers(exercise_id, code, updated_at, passed, tests_passed, tests_total, report, graded_at, manual_points, reviewed_at), evaluation_incidents(id, kind, detail, screenshot, locks, created_at, resolved_at)';
  const readAttempt = (columns: string) => ctx.supabase.from('evaluation_attempts').select(columns).eq('id', attemptId).maybeSingle();
  const first = await readAttempt(detailColumns);
  // Colonnes de la vérification absentes (migration des notes pas encore passée) : on relit sans elles.
  const attempt: any = first.error ? (await readAttempt(detailColumns.replace(', manual_points, reviewed_at', ''))).data : first.data;
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
          manualPoints: answer.manual_points != null ? Number(answer.manual_points) : null,
          reviewedAt: answer.reviewed_at ?? null,
        },
      ]),
    ),
    grade: gradeCopy(gradableExercises(subject), gradedAnswers((attempt as any).evaluation_answers ?? [])),
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

/**
 * Vérification d'un exercice par l'enseignant : `points` remplace la note automatique ; null garde la note
 * automatique. `undo` efface la vérification (l'exercice redevient « à vérifier » s'il l'était).
 */
export async function reviewEvaluationAnswer(attemptId: string, exerciseId: string, points: number | null, undo = false): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const value = points === null || undo ? null : Math.round(Number(points) * 100) / 100;
  if (value !== null && !(value >= 0 && value <= 100)) return fail('Des points entre 0 et le barème de l\'exercice.');
  const { data, error } = await ctx.supabase
    .from('evaluation_answers')
    .update({ manual_points: value, reviewed_at: undo ? null : new Date().toISOString() })
    .eq('attempt_id', attemptId)
    .eq('exercise_id', exerciseId)
    .select('exercise_id');
  if (error) return fail(messageOf(error, "La vérification n'a pas été enregistrée."));
  if (!data?.length) return fail("Aucun code écrit pour cet exercice : il compte 0.");
  await syncAttemptResult(ctx.supabase, attemptId);
  return { ok: true };
}

/**
 * Validation de la note d'une copie par l'enseignant, après relecture : chaque exercice écrit pas encore vu garde
 * sa note automatique. Refusée tant qu'un exercice écrit n'est pas passé aux tests (sa note serait 0 à tort).
 */
export async function validateAttemptGrade(attemptId: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const { data: attempt, error: readError } = await ctx.supabase
    .from('evaluation_attempts')
    .select('evaluation_subjects(grading), evaluation_answers(exercise_id, code, graded_at, updated_at, reviewed_at, manual_points)')
    .eq('id', attemptId)
    .maybeSingle();
  if (readError || !attempt) return fail(messageOf(readError, "La copie n'a pas pu être lue."));
  const tested = new Set(((attempt as any).evaluation_subjects?.grading ?? []).filter((item: EvaluationGrading) => item.verification?.trim()).map((item: EvaluationGrading) => item.id));
  const written = ((attempt as any).evaluation_answers ?? []).filter((answer: any) => answer.code?.trim());
  if (written.some((answer: any) => tested.has(answer.exercise_id) && !isGraded(answer))) {
    return fail("Correction automatique en cours sur cette copie : attendre la fin, ou lancer « Corriger » sur l'exercice.");
  }
  if (written.some((answer: any) => !tested.has(answer.exercise_id) && answer.manual_points == null)) {
    return fail("Un exercice sans tests attend des points donnés à la main avant de valider la copie.");
  }
  const ids = written.filter((answer: any) => !answer.reviewed_at).map((answer: any) => answer.exercise_id);
  if (ids.length > 0) {
    const { error } = await ctx.supabase
      .from('evaluation_answers')
      .update({ reviewed_at: new Date().toISOString() })
      .eq('attempt_id', attemptId)
      .in('exercise_id', ids);
    if (error) return fail(messageOf(error, "La validation n'a pas été enregistrée."));
  }
  await syncAttemptResult(ctx.supabase, attemptId);
  return { ok: true };
}

/** Rouvre la vérification d'une copie validée : les points donnés à la main restent, le reste redevient à valider. */
export async function reopenAttemptGrade(attemptId: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const { error } = await ctx.supabase
    .from('evaluation_answers')
    .update({ reviewed_at: null })
    .eq('attempt_id', attemptId)
    .is('manual_points', null);
  if (error) return fail(messageOf(error, "La vérification n'a pas pu être rouverte."));
  await syncAttemptResult(ctx.supabase, attemptId);
  return { ok: true };
}

/** Rouvre la copie d'un élève (rendue par erreur, ou fermée avant la fin). */
export async function reopenAttempt(attemptId: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const { error } = await ctx.supabase.from('evaluation_attempts').update({ status: 'en_cours', submitted_at: null }).eq('id', attemptId);
  if (error) return fail(messageOf(error, 'La copie n\'a pas pu être rouverte.'));
  await syncAttemptResult(ctx.supabase, attemptId);
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
  const result = await gradeOne(ctx.supabase, attemptId, exerciseId);
  if (result.ok) await syncAttemptResult(ctx.supabase, attemptId);
  return result;
}

// Exercices corrigés en même temps dans un même appel : chacun lance son propre processus Python.
const GRADING_CONCURRENCY = 4;
const GRADING_BATCH = 8;

/**
 * Correction d'un lot d'exercices (au plus 8), quatre à la fois.
 * Next.js traite les actions d'une même page l'une après l'autre : le parallélisme se fait donc ici, côté serveur.
 */
export async function gradeEvaluationAnswers(items: { attemptId: string; exerciseId: string }[]): Promise<Result<{ graded: number }>> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const batch = items.slice(0, GRADING_BATCH);
  let next = 0;
  let graded = 0;
  const worker = async () => {
    while (next < batch.length) {
      const item = batch[next];
      next += 1;
      const result = await gradeOne(ctx.supabase, item.attemptId, item.exerciseId);
      if (result.ok) graded += 1;
    }
  };
  await Promise.all(Array.from({ length: Math.min(GRADING_CONCURRENCY, batch.length) }, worker));
  // Une seule réécriture du résumé par copie, une fois tous ses exercices corrigés (pas de courses entre corrections).
  for (const attemptId of new Set(batch.map((item) => item.attemptId))) await syncAttemptResult(ctx.supabase, attemptId);
  return { ok: true, graded };
}

async function gradeOne(
  supabase: Awaited<ReturnType<typeof createClient>>,
  attemptId: string,
  exerciseId: string,
): Promise<Result<{ passed: boolean }>> {
  const { data: attempt } = await supabase
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
      : await runPythonCheck(answer.code, verification, exercise.packages ?? [], { keepSources: true });
  } catch {
    report = unexpectedRunReport(CHECK_UNAVAILABLE);
  }
  const passed = everyTestPassed(report);
  const { error } = await supabase
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
