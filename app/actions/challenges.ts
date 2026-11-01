'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { getAuthContext } from '@/lib/auth';
import { parseEvaluationSubject, type EvaluationExercise } from '@/lib/evaluation-subject';
import { challengeStreak, earnedChallengeAchievements, parisTime, type MyChallenge } from '@/lib/challenges';
import { CHECK_UNAVAILABLE, everyTestPassed, unexpectedRunReport, type RunReport } from '@/lib/python-check';
import { runPythonCheck, runSqlCheck } from '@/lib/run-exercise-check';

/*
 * Défi du lundi. L'élève lit ses défis par challenge_list_mine (sans les tests) ; la vérification lit les tests
 * avec la clé de service, côté serveur seulement. L'enseignant gère les défis par RLS (compte admin ou enseignant).
 */

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };
const fail = (error: string) => ({ ok: false as const, error });
const NOT_ALLOWED = 'Réservé aux comptes enseignant et admin.';
const CODE_LIMIT = 60_000;

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

export type ChallengeCheckResult = {
  report: RunReport;
  /** Essai enregistré (défi ouvert, compte élève de la classe). */
  recorded: boolean;
  /** Succès débloqués par cette réussite (identifiants de CHALLENGE_ACHIEVEMENTS). */
  newAchievements: string[];
};

export async function checkChallenge(challengeId: string, code: string): Promise<ChallengeCheckResult> {
  const unavailable = { report: unexpectedRunReport(CHECK_UNAVAILABLE), recorded: false, newAchievements: [] };
  const source = String(code ?? '');
  if (!challengeId || source.length > CODE_LIMIT) return unavailable;

  const auth = await getAuthContext();
  if (!auth.user) return unavailable;
  const admin = createAdminClient();
  if (!admin) return unavailable;

  const { data: challenge } = await admin
    .from('challenges')
    .select('id, classes, exercise, grading, opens_at, closes_at')
    .eq('id', challengeId)
    .maybeSingle();
  if (!challenge) return unavailable;
  const now = Date.now();
  const inClass = Boolean(auth.classe && (challenge.classes as string[]).includes(auth.classe));
  if (!auth.isElevated && (!inClass || Date.parse(challenge.opens_at) > now)) return unavailable;

  const verification = String((challenge.grading as { verification?: string })?.verification ?? '').trim();
  if (!verification) return unavailable;
  const report = await runCheck(challenge.exercise as EvaluationExercise, source, verification);
  const passed = everyTestPassed(report);

  // L'enseignant essaie sans rien enregistrer ; un défi fermé reste faisable pour s'entraîner.
  const open = now < Date.parse(challenge.closes_at);
  if (auth.isElevated || !open) return { report, recorded: false, newAchievements: [] };

  const userId = auth.user.id;
  const { data: previous } = await admin
    .from('challenge_submissions')
    .select('attempts, passed, first_passed_at')
    .eq('challenge_id', challengeId)
    .eq('user_id', userId)
    .maybeSingle();
  const firstSuccess = passed && !previous?.passed;
  const { error } = await admin.from('challenge_submissions').upsert(
    {
      challenge_id: challengeId,
      user_id: userId,
      code: source,
      attempts: (previous?.attempts ?? 0) + 1,
      passed: Boolean(previous?.passed) || passed,
      tests_passed: report.tests.filter((test) => test.ok).length,
      tests_total: report.tests.length,
      first_passed_at: previous?.first_passed_at ?? (passed ? new Date().toISOString() : null),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'challenge_id,user_id' },
  );
  if (error) return { report, recorded: false, newAchievements: [] };

  let newAchievements: string[] = [];
  if (firstSuccess) newAchievements = await awardChallengeAchievements(admin, userId, auth.classe!);
  revalidatePath('/defi');
  return { report, recorded: true, newAchievements };
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
  submitted: number;
  passed: number;
};

export async function listChallenges(): Promise<ChallengeSummary[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  const { data } = await ctx.supabase
    .from('challenges')
    .select('id, title, classes, opens_at, closes_at, challenge_submissions(passed)')
    .order('opens_at', { ascending: false });
  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    classes: row.classes ?? [],
    opensAt: row.opens_at,
    closesAt: row.closes_at,
    submitted: row.challenge_submissions?.length ?? 0,
    passed: (row.challenge_submissions ?? []).filter((sub: any) => sub.passed).length,
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
};

/** Lecture du défi : un seul exercice, avec ses tests. */
function readChallenge(source: string) {
  const parsed = parseEvaluationSubject(source);
  const errors = [...parsed.errors];
  if (parsed.exercises.length !== 1) errors.push('Un défi contient exactement un bloc <ExerciseSection>.');
  if (parsed.exercises[0] && !parsed.grading[0]?.verification) errors.push('Le défi a besoin de tests dans <Verification>.');
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
  const values = {
    title,
    classes: [...new Set((input.classes || []).map((value) => String(value).trim()).filter(Boolean))],
    source,
    exercise: { ...parsed.exercises[0], id: 'defi' },
    grading: { verification: parsed.grading[0].verification, correction: parsed.grading[0].correction },
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

/** La correction passe-t-elle ses propres tests ? À lancer avant de publier un défi. */
export async function testChallengeCorrection(source: string): Promise<Result<{ passed: boolean; report: RunReport }> | { ok: false; error: string; errors: string[] }> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const { parsed, errors } = readChallenge(String(source || ''));
  if (errors.length > 0) return { ok: false, error: 'Le défi contient des erreurs.', errors };
  const correction = parsed.grading[0].correction?.trim();
  if (!correction) return fail('Ajouter une <Correction> pour la tester.');
  const report = await runCheck(parsed.exercises[0], correction, parsed.grading[0].verification);
  return { ok: true, passed: everyTestPassed(report), report };
}

export type ChallengeDetail = {
  challenge: { id: string; title: string; classes: string[]; source: string; opensAt: string; closesAt: string };
  rows: { studentId: string; name: string; classe: string | null; attempts: number; passed: boolean; firstPassedAt: string | null; code: string }[];
};

export async function getChallengeDetail(id: string): Promise<ChallengeDetail | null> {
  const ctx = await teacher();
  if (!ctx) return null;
  const { data: challenge } = await ctx.supabase
    .from('challenges')
    .select('id, title, classes, source, opens_at, closes_at, challenge_submissions(user_id, attempts, passed, first_passed_at, code)')
    .eq('id', id)
    .maybeSingle();
  if (!challenge) return null;
  const { data: students } = challenge.classes?.length
    ? await ctx.supabase.from('profiles').select('id, full_name, classe').in('classe', challenge.classes).eq('role', 'student')
    : { data: [] as any[] };
  const submissions = new Map(((challenge as any).challenge_submissions ?? []).map((sub: any) => [sub.user_id, sub]));
  const rows = (students ?? []).map((student: any) => {
    const sub: any = submissions.get(student.id);
    return {
      studentId: student.id,
      name: student.full_name || 'Élève',
      classe: student.classe,
      attempts: sub?.attempts ?? 0,
      passed: Boolean(sub?.passed),
      firstPassedAt: sub?.first_passed_at ?? null,
      code: sub?.code ?? '',
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
    },
    rows,
  };
}
