'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { getAuthContext } from '@/lib/auth';
import { parseEvaluationSubject, type EvaluationExercise, type EvaluationGrading } from '@/lib/evaluation-subject';
import {
  allExercisesPassed,
  CHALLENGE_GRACE_MS,
  challengeDeadline,
  challengeStreak,
  earnedChallengeAchievements,
  parisTime,
  type ChallengeAnswer,
  type MyChallenge,
} from '@/lib/challenges';
import type { IncidentKind } from '@/lib/evaluation-guard';
import { CHECK_UNAVAILABLE, everyTestPassed, unexpectedRunReport, type RunReport } from '@/lib/python-check';
import { runPythonCheck, runSqlCheck } from '@/lib/run-exercise-check';

/*
 * Défi du lundi. L'élève lit ses défis par challenge_list_mine (sans les tests) et démarre son chrono par
 * challenge_start ; la vérification lit les tests avec la clé de service, côté serveur seulement.
 * Défi surveillé : mêmes règles que les évaluations pratiques (fonctions challenge_* de la base, comme eval_*).
 * L'enseignant gère les défis par RLS (compte admin ou enseignant).
 */

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };
const fail = (error: string) => ({ ok: false as const, error });
const NOT_ALLOWED = 'Réservé aux comptes enseignant et admin.';
const CODE_LIMIT = 60_000;
const MAX_EXERCISES = 5;

function messageOf(error: { message?: string } | null | undefined, fallback: string) {
  const text = error?.message?.trim();
  return text && text.length < 200 ? text : fallback;
}

async function runCheck(exercise: EvaluationExercise, code: string, verification: string): Promise<RunReport> {
  try {
    return exercise.type === 'sql'
      ? await runSqlCheck(code, verification, exercise.sqlSetup ?? '')
      : await runPythonCheck(code, verification, exercise.packages ?? []);
  } catch {
    return unexpectedRunReport(CHECK_UNAVAILABLE);
  }
}

// ---------- Élève ----------

export async function listMyChallenges(): Promise<{ challenges: MyChallenge[]; streak: number }> {
  const supabase = await createClient();
  const { data } = await supabase.rpc('challenge_list_mine');
  const challenges = (Array.isArray(data) ? data : []) as MyChallenge[];
  return { challenges, streak: challengeStreak(challenges) };
}

/** Ouverture de la page : démarre le chrono de l'élève (une seule fois) et renvoie l'heure de départ. */
export async function startChallenge(challengeId: string): Promise<string | null> {
  if (!challengeId) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('challenge_start', { p_challenge: challengeId });
  return error || !data ? null : String(data);
}

export type ChallengeCheckResult = {
  report: RunReport;
  /** Essai enregistré (défi ouvert, compte élève de la classe, dans le temps). */
  recorded: boolean;
  /** Le temps de l'élève est écoulé : rien n'est plus enregistré. */
  expired: boolean;
  /** Tous les exercices du défi sont réussis. */
  challengePassed: boolean;
  /** Succès débloqués par cette réussite (identifiants de CHALLENGE_ACHIEVEMENTS). */
  newAchievements: string[];
};

const EXPIRED_REPORT = unexpectedRunReport("Temps écoulé : ce code n'est plus enregistré pour le défi.");
const FINISHED_REPORT = unexpectedRunReport("Défi arrêté : ce code n'est plus enregistré.");
const LOCKED_REPORT = unexpectedRunReport('Le défi est verrouillé : attendre le professeur.');

export async function checkChallenge(challengeId: string, exerciseId: string, code: string): Promise<ChallengeCheckResult> {
  const unavailable = { report: unexpectedRunReport(CHECK_UNAVAILABLE), recorded: false, expired: false, challengePassed: false, newAchievements: [] };
  const source = String(code ?? '');
  if (!challengeId || !exerciseId || source.length > CODE_LIMIT) return unavailable;

  const auth = await getAuthContext();
  if (!auth.user) return unavailable;
  const admin = createAdminClient();
  if (!admin) return unavailable;

  const { data: challenge } = await admin
    .from('challenges')
    .select('id, classes, exercises, grading, opens_at, closes_at, time_limit_minutes, proctored')
    .eq('id', challengeId)
    .maybeSingle();
  if (!challenge) return unavailable;
  const now = Date.now();
  const inClass = Boolean(auth.classe && (challenge.classes as string[]).includes(auth.classe));
  if (!auth.isElevated && (!inClass || Date.parse(challenge.opens_at) > now)) return unavailable;

  const exercises = (challenge.exercises ?? []) as EvaluationExercise[];
  const exercise = exercises.find((item) => item.id === exerciseId);
  const verification = String(((challenge.grading ?? []) as EvaluationGrading[]).find((item) => item.id === exerciseId)?.verification ?? '').trim();
  if (!exercise || !verification) return unavailable;

  // L'enseignant essaie sans rien enregistrer ; un défi fermé reste faisable pour s'entraîner.
  const open = now < Date.parse(challenge.closes_at);
  if (auth.isElevated || !open) {
    const report = await runCheck(exercise, source, verification);
    return { report, recorded: false, expired: false, challengePassed: false, newAchievements: [] };
  }

  const userId = auth.user.id;
  const { data: previous } = await admin
    .from('challenge_submissions')
    .select('attempts, passed, first_passed_at, started_at, answers, locked, finished_at')
    .eq('challenge_id', challengeId)
    .eq('user_id', userId)
    .maybeSingle();

  // Défi surveillé : il se commence par la page (partage d'écran, règles acceptées), jamais par un simple essai.
  if (challenge.proctored && !previous?.started_at) return unavailable;
  if (previous?.locked) {
    return { report: LOCKED_REPORT, recorded: false, expired: false, challengePassed: Boolean(previous.passed), newAchievements: [] };
  }
  if (previous?.finished_at) {
    return { report: FINISHED_REPORT, recorded: false, expired: true, challengePassed: Boolean(previous.passed), newAchievements: [] };
  }

  // Chrono : compté depuis l'ouverture de la page ; à défaut (page ouverte sans démarrage), depuis ce premier essai.
  const startedAt = previous?.started_at ?? new Date(now).toISOString();
  const deadline = challengeDeadline(startedAt, challenge.time_limit_minutes);
  if (deadline !== null && now > deadline + CHALLENGE_GRACE_MS) {
    return { report: EXPIRED_REPORT, recorded: false, expired: true, challengePassed: Boolean(previous?.passed), newAchievements: [] };
  }

  const report = await runCheck(exercise, source, verification);
  const passed = everyTestPassed(report);
  const answers = { ...((previous?.answers ?? {}) as Record<string, ChallengeAnswer>) };
  const before = answers[exerciseId];
  answers[exerciseId] = { code: source, passed: Boolean(before?.passed) || passed, attempts: (before?.attempts ?? 0) + 1 };
  const challengePassed = allExercisesPassed(exercises.map((item) => item.id), answers);
  const firstSuccess = challengePassed && !previous?.passed;

  const { error } = await admin.from('challenge_submissions').upsert(
    {
      challenge_id: challengeId,
      user_id: userId,
      code: source,
      answers,
      started_at: startedAt,
      attempts: (previous?.attempts ?? 0) + 1,
      passed: challengePassed,
      tests_passed: report.tests.filter((test) => test.ok).length,
      tests_total: report.tests.length,
      first_passed_at: previous?.first_passed_at ?? (challengePassed ? new Date().toISOString() : null),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'challenge_id,user_id' },
  );
  if (error) return { report, recorded: false, expired: false, challengePassed: false, newAchievements: [] };

  let newAchievements: string[] = [];
  if (firstSuccess) newAchievements = await awardChallengeAchievements(admin, userId, auth.classe!);
  revalidatePath('/defi');
  return { report, recorded: true, expired: false, challengePassed, newAchievements };
}

export async function reportChallengeIncident(challengeId: string, kind: IncidentKind, detail: string): Promise<Result<{ incidentId: number | null }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('challenge_report_incident', {
    p_challenge: challengeId,
    p_kind: kind,
    p_detail: detail.slice(0, 20000),
  });
  if (error) return fail(messageOf(error, "L'incident n'a pas pu être enregistré."));
  return { ok: true, incidentId: data === null ? null : Number(data) };
}

export async function challengeHeartbeat(challengeId: string): Promise<Result<{ locked: boolean; lockReason: IncidentKind | null }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('challenge_heartbeat', { p_challenge: challengeId });
  if (error || !data) return fail(messageOf(error, 'Connexion perdue.'));
  return { ok: true, locked: Boolean(data.locked), lockReason: data.lockReason ?? null };
}

export type UnlockedIncident = { kind: IncidentKind; detail: string; screenshot: string | null; createdAt: string };

export async function unlockChallenge(
  challengeId: string,
  code: string,
): Promise<Result<{ status: 'ok' | 'refuse' | 'attente' | 'deverrouillee'; incidents: UnlockedIncident[] }>> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('challenge_unlock', { p_challenge: challengeId, p_code: code.slice(0, 40) });
  if (error || !data) return fail(messageOf(error, 'Le déverrouillage a échoué.'));
  return { ok: true, status: data.status, incidents: data.incidents ?? [] };
}

/** L'élève arrête le défi avant la fin du temps : plus rien n'est enregistré, la surveillance s'arrête. */
export async function finishChallenge(challengeId: string): Promise<Result> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('challenge_finish', { p_challenge: challengeId });
  if (error) return fail(messageOf(error, "Le défi n'a pas pu être arrêté."));
  revalidatePath('/defi');
  return { ok: true };
}

/** Série de la classe recalculée après une réussite ; enregistre les succès qui manquent. */
async function awardChallengeAchievements(admin: NonNullable<ReturnType<typeof createAdminClient>>, userId: string, classe: string) {
  const { data: rows } = await admin
    .from('challenges')
    .select('id, opens_at, closes_at, challenge_submissions(user_id, passed)')
    .contains('classes', [classe])
    .lte('opens_at', new Date().toISOString())
    .order('opens_at', { ascending: false })
    .limit(60);
  const now = Date.now();
  const streak = challengeStreak(
    (rows ?? []).map((row: any) => ({
      opensAt: row.opens_at,
      open: now < Date.parse(row.closes_at),
      mine: { passed: (row.challenge_submissions ?? []).some((sub: any) => sub.user_id === userId && sub.passed) } as MyChallenge['mine'],
    })),
  );
  const earned = earnedChallengeAchievements(streak);
  if (earned.length === 0) return [];
  const { data: stored } = await admin.from('user_achievements').select('achievement_id').eq('user_id', userId).in('achievement_id', earned);
  const owned = new Set((stored ?? []).map((row) => row.achievement_id));
  const missing = earned.filter((id) => !owned.has(id));
  if (missing.length === 0) return [];
  const { CHALLENGE_ACHIEVEMENTS } = await import('@/lib/challenges');
  await admin.from('user_achievements').upsert(
    missing.map((id) => {
      const item = CHALLENGE_ACHIEVEMENTS.find((achievement) => achievement.id === id)!;
      return { user_id: userId, achievement_id: id, title: item.title, description: item.description, unlocked_at: new Date().toISOString() };
    }),
    { onConflict: 'user_id,achievement_id', ignoreDuplicates: true },
  );
  return missing;
}

// ---------- Enseignant ----------

async function teacher() {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  return { auth, supabase: await createClient() };
}

export type ChallengeSummary = {
  id: string;
  title: string;
  classes: string[];
  opensAt: string;
  closesAt: string;
  timeLimitMinutes: number | null;
  proctored: boolean;
  exerciseCount: number;
  submitted: number;
  passed: number;
  locked: number;
};

export async function listChallenges(): Promise<ChallengeSummary[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  const { data } = await ctx.supabase
    .from('challenges')
    .select('id, title, classes, opens_at, closes_at, time_limit_minutes, proctored, exercises, challenge_submissions(passed, locked)')
    .order('opens_at', { ascending: false });
  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    classes: row.classes ?? [],
    opensAt: row.opens_at,
    closesAt: row.closes_at,
    timeLimitMinutes: row.time_limit_minutes ?? null,
    proctored: Boolean(row.proctored),
    exerciseCount: Array.isArray(row.exercises) ? row.exercises.length : 0,
    submitted: row.challenge_submissions?.length ?? 0,
    passed: (row.challenge_submissions ?? []).filter((sub: any) => sub.passed).length,
    locked: (row.challenge_submissions ?? []).filter((sub: any) => sub.locked).length,
  }));
}

export type ChallengeInput = {
  id?: string | null;
  title: string;
  classes: string[];
  source: string;
  /** Jour d'ouverture « AAAA-MM-JJ », à 7 h 30 (heure de Paris). */
  openDay: string;
  durationDays: number;
  /** Temps par élève, en minutes, compté depuis l'ouverture de la page ; 0 ou vide : pas de limite. */
  timeLimitMinutes: number | null;
  /** Surveillance des évaluations pratiques : verrouillage, incidents, capture d'écran. */
  proctored: boolean;
};

/** Lecture du défi : un à cinq exercices, chacun avec ses tests. */
function readChallenge(source: string) {
  const parsed = parseEvaluationSubject(source);
  const errors = [...parsed.errors];
  if (parsed.exercises.length === 0) errors.push('Un défi contient au moins un bloc <ExerciseSection>.');
  if (parsed.exercises.length > MAX_EXERCISES) errors.push(`Un défi contient au plus ${MAX_EXERCISES} exercices.`);
  parsed.exercises.forEach((exercise, index) => {
    if (!parsed.grading[index]?.verification) errors.push(`« ${exercise.label} » a besoin de tests dans <Verification>.`);
  });
  return { parsed, errors };
}

export async function saveChallenge(input: ChallengeInput): Promise<Result<{ id: string }> | { ok: false; error: string; errors: string[] }> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const title = String(input.title || '').trim().slice(0, 200);
  if (!title) return fail('Le titre est obligatoire.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.openDay)) return fail("Choisir le jour d'ouverture.");
  const source = String(input.source || '');
  if (source.length > 100_000) return fail('Le défi dépasse 100 000 caractères.');
  const { parsed, errors } = readChallenge(source);
  if (errors.length > 0) return { ok: false, error: 'Le défi contient des erreurs.', errors };

  const opens = parisTime(input.openDay, 7, 30);
  const days = Math.min(Math.max(Math.round(Number(input.durationDays) || 7), 1), 30);
  const minutes = Math.round(Number(input.timeLimitMinutes) || 0);
  const values = {
    title,
    classes: [...new Set((input.classes || []).map((value) => String(value).trim()).filter(Boolean))],
    source,
    exercises: parsed.exercises,
    grading: parsed.grading.map((item) => ({ id: item.id, verification: item.verification, correction: item.correction })),
    time_limit_minutes: minutes > 0 ? Math.min(minutes, 240) : null,
    proctored: Boolean(input.proctored),
    opens_at: opens.toISOString(),
    closes_at: new Date(opens.getTime() + days * 86_400_000).toISOString(),
  };
  if (values.classes.length === 0) return fail('Choisir au moins une classe.');

  const query = input.id
    ? ctx.supabase.from('challenges').update(values).eq('id', input.id).select('id').single()
    : ctx.supabase.from('challenges').insert({ ...values, created_by: ctx.auth.user!.id }).select('id').single();
  const { data, error } = await query;
  if (error || !data) return fail(messageOf(error, "Le défi n'a pas pu être enregistré."));
  revalidatePath('/admin/defis');
  return { ok: true, id: data.id };
}

export async function deleteChallenge(id: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const { error } = await ctx.supabase.from('challenges').delete().eq('id', id);
  if (error) return fail(messageOf(error, "Le défi n'a pas pu être supprimé."));
  revalidatePath('/admin/defis');
  return { ok: true };
}

export type CorrectionTest = { id: string; label: string; passed: boolean; report: RunReport | null; missing: boolean };

/** Chaque correction passe-t-elle ses propres tests ? À lancer avant de publier un défi. */
export async function testChallengeCorrection(source: string): Promise<Result<{ passed: boolean; results: CorrectionTest[] }> | { ok: false; error: string; errors: string[] }> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const { parsed, errors } = readChallenge(String(source || ''));
  if (errors.length > 0) return { ok: false, error: 'Le défi contient des erreurs.', errors };
  const results = await Promise.all(
    parsed.exercises.map(async (exercise, index): Promise<CorrectionTest> => {
      const correction = parsed.grading[index]?.correction?.trim();
      if (!correction) return { id: exercise.id, label: exercise.label, passed: false, report: null, missing: true };
      const report = await runCheck(exercise, correction, parsed.grading[index].verification);
      return { id: exercise.id, label: exercise.label, passed: everyTestPassed(report), report, missing: false };
    }),
  );
  return { ok: true, passed: results.every((item) => item.passed), results };
}

export type ChallengeDetail = {
  challenge: {
    id: string;
    title: string;
    classes: string[];
    source: string;
    opensAt: string;
    closesAt: string;
    timeLimitMinutes: number | null;
    proctored: boolean;
    exercises: { id: string; label: string }[];
  };
  rows: {
    studentId: string;
    name: string;
    classe: string | null;
    attempts: number;
    passed: boolean;
    startedAt: string | null;
    firstPassedAt: string | null;
    finishedAt: string | null;
    lastSeenAt: string | null;
    locked: boolean;
    /** Cause du verrouillage en cours : le dernier incident qui verrouille, pas encore débloqué. */
    lockReason: IncidentKind | null;
    unlockCode: string | null;
    failedUnlocks: number;
    incidents: number;
    answers: Record<string, ChallengeAnswer>;
  }[];
};

export async function getChallengeDetail(id: string): Promise<ChallengeDetail | null> {
  const ctx = await teacher();
  if (!ctx) return null;
  const { data: challenge } = await ctx.supabase
    .from('challenges')
    .select(
      'id, title, classes, source, opens_at, closes_at, time_limit_minutes, proctored, exercises, challenge_submissions(user_id, attempts, passed, started_at, first_passed_at, finished_at, last_seen_at, locked, unlock_code, failed_unlocks, answers), challenge_incidents(user_id, kind, locks, resolved_at, created_at)',
    )
    .eq('id', id)
    .maybeSingle();
  if (!challenge) return null;
  const { data: students } = challenge.classes?.length
    ? await ctx.supabase.from('profiles').select('id, full_name, classe').in('classe', challenge.classes).eq('role', 'student')
    : { data: [] as any[] };
  const submissions = new Map(((challenge as any).challenge_submissions ?? []).map((sub: any) => [sub.user_id, sub]));
  // Sans les captures d'écran : elles se chargent à l'ouverture de la ligne d'un élève (getChallengeIncidents).
  const incidents: any[] = (challenge as any).challenge_incidents ?? [];
  const rows = (students ?? []).map((student: any) => {
    const sub: any = submissions.get(student.id);
    const own = incidents.filter((incident) => incident.user_id === student.id);
    const openLock = own
      .filter((incident) => incident.locks && !incident.resolved_at)
      .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))[0];
    return {
      studentId: student.id,
      name: student.full_name || 'Élève',
      classe: student.classe,
      attempts: sub?.attempts ?? 0,
      passed: Boolean(sub?.passed),
      startedAt: sub?.started_at ?? null,
      firstPassedAt: sub?.first_passed_at ?? null,
      finishedAt: sub?.finished_at ?? null,
      lastSeenAt: sub?.last_seen_at ?? null,
      locked: Boolean(sub?.locked),
      lockReason: sub?.locked ? (openLock?.kind ?? null) : null,
      unlockCode: sub?.locked ? (sub.unlock_code ?? null) : null,
      failedUnlocks: sub?.failed_unlocks ?? 0,
      incidents: own.length,
      answers: (sub?.answers ?? {}) as Record<string, ChallengeAnswer>,
    };
  });
  rows.sort((a, b) => (a.classe ?? '').localeCompare(b.classe ?? '') || a.name.localeCompare(b.name, 'fr'));
  return {
    challenge: {
      id: challenge.id,
      title: challenge.title,
      classes: challenge.classes ?? [],
      source: challenge.source,
      opensAt: challenge.opens_at,
      closesAt: challenge.closes_at,
      timeLimitMinutes: challenge.time_limit_minutes ?? null,
      proctored: Boolean(challenge.proctored),
      exercises: ((challenge.exercises ?? []) as EvaluationExercise[]).map((item) => ({ id: item.id, label: item.label })),
    },
    rows,
  };
}

export type ChallengeIncident = { id: number; kind: IncidentKind; detail: string; screenshot: string | null; locks: boolean; createdAt: string; resolvedAt: string | null };

/** Incidents d'un élève pendant le défi, avec les captures d'écran. */
export async function getChallengeIncidents(challengeId: string, userId: string): Promise<ChallengeIncident[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  const { data } = await ctx.supabase
    .from('challenge_incidents')
    .select('id, kind, detail, screenshot, locks, created_at, resolved_at')
    .eq('challenge_id', challengeId)
    .eq('user_id', userId)
    .order('created_at');
  return (data ?? []).map((incident: any) => ({
    id: incident.id,
    kind: incident.kind,
    detail: incident.detail,
    screenshot: incident.screenshot,
    locks: incident.locks,
    createdAt: incident.created_at,
    resolvedAt: incident.resolved_at,
  }));
}

export async function unlockChallengeRemotely(challengeId: string, userId: string): Promise<Result> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const { error } = await ctx.supabase
    .from('challenge_submissions')
    .update({ locked: false, failed_unlocks: 0 })
    .eq('challenge_id', challengeId)
    .eq('user_id', userId);
  if (error) return fail(messageOf(error, 'Le déverrouillage a échoué.'));
  await ctx.supabase
    .from('challenge_incidents')
    .update({ resolved_at: new Date().toISOString() })
    .eq('challenge_id', challengeId)
    .eq('user_id', userId)
    .is('resolved_at', null);
  revalidatePath(`/admin/defis/${challengeId}`);
  return { ok: true };
}
