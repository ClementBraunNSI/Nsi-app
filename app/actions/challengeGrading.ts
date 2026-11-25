'use server';

import { randomInt } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { parseEvaluationSubject } from '@/lib/evaluation-subject';
import {
  challengeAnswerCodes,
  challengeDuration,
  challengeEvaluationTitle,
  challengeSubmittedAt,
  withoutBonusLevels,
} from '@/lib/challenge-grading';

/*
 * Défi du lundi évalué : « Noter ce défi » crée une évaluation fermée, liée au défi (evaluations.challenge_id),
 * dont le sujet est celui du défi sans les niveaux bonus et dont les copies sont les réponses des élèves.
 * Tout le reste (correction automatique, relecture, validation, export des notes, moyennes) est celui des évaluations.
 */

type Result<T = object> = ({ ok: true } & T) | { ok: false; error: string };
const fail = (error: string) => ({ ok: false as const, error });
const NOT_ALLOWED = 'Réservé aux comptes enseignant et admin.';

async function teacher() {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  return { auth, supabase: await createClient() };
}

export type GradableChallenge = {
  id: string;
  title: string;
  classes: string[];
  opensAt: string;
  closesAt: string;
  /** Élèves qui ont ouvert le défi. */
  started: number;
  /** Évaluation liée, une fois le défi mis en notation. */
  evaluationId: string | null;
};

/** Défis surveillés (« évalués »), du plus récent au plus ancien, avec leur évaluation liée s'il y en a une. */
export async function listGradableChallenges(): Promise<GradableChallenge[]> {
  const ctx = await teacher();
  if (!ctx) return [];
  const [{ data: challenges }, { data: linked }] = await Promise.all([
    ctx.supabase
      .from('challenges')
      .select('id, title, classes, opens_at, closes_at, challenge_submissions(user_id)')
      .eq('proctored', true)
      .order('opens_at', { ascending: false }),
    ctx.supabase.from('evaluations').select('id, challenge_id').not('challenge_id', 'is', null),
  ]);
  const byChallenge = new Map((linked ?? []).map((row: any) => [row.challenge_id as string, row.id as string]));
  return (challenges ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    classes: row.classes ?? [],
    opensAt: row.opens_at,
    closesAt: row.closes_at,
    started: row.challenge_submissions?.length ?? 0,
    evaluationId: byChallenge.get(row.id) ?? null,
  }));
}

/**
 * Met un défi surveillé en notation, ou reprend ses copies si c'est déjà fait : les élèves qui n'avaient pas de copie
 * en reçoivent une, et le code d'une copie pas encore corrigée ni relue suit les dernières réponses du défi.
 */
export async function gradeChallenge(challengeId: string): Promise<Result<{ evaluationId: string; added: number; updated: number }>> {
  const ctx = await teacher();
  if (!ctx) return fail(NOT_ALLOWED);
  const { supabase } = ctx;

  const { data: challenge } = await supabase
    .from('challenges')
    .select('id, title, classes, source, opens_at, closes_at, time_limit_minutes, proctored')
    .eq('id', challengeId)
    .maybeSingle();
  if (!challenge) return fail('Défi introuvable.');
  if (!challenge.proctored) return fail('Seuls les défis surveillés (évalués) se notent comme une évaluation.');

  // Le sujet noté : celui du défi, sans les niveaux bonus.
  const parsed = parseEvaluationSubject(withoutBonusLevels(challenge.source ?? ''));
  if (parsed.errors.length > 0 || parsed.exercises.length === 0) return fail("Le sujet du défi n'a pas pu être relu.");
  const exerciseIds = parsed.exercises.map((exercise) => exercise.id);

  // L'évaluation liée, créée au premier passage.
  let evaluationId: string;
  let subjectId: string;
  const { data: existing } = await supabase.from('evaluations').select('id').eq('challenge_id', challengeId).maybeSingle();
  if (existing) {
    evaluationId = existing.id;
    const { data: subject } = await supabase.from('evaluation_subjects').select('id').eq('evaluation_id', evaluationId).order('position').limit(1).maybeSingle();
    if (!subject) return fail("L'évaluation liée à ce défi n'a plus de sujet.");
    subjectId = subject.id;
  } else {
    const { data: created, error } = await supabase
      .from('evaluations')
      .insert({
        title: challengeEvaluationTitle(challenge.title),
        description: 'Défi du lundi noté : les copies sont les réponses données pendant le défi.',
        classes: challenge.classes ?? [],
        status: 'fermee',
        kind: 'evaluation',
        duration_minutes: challengeDuration(challenge.time_limit_minutes),
        scheduled_at: challenge.opens_at,
        opened_at: challenge.opens_at,
        closed_at: challengeSubmittedAt(null, challenge.closes_at),
        challenge_id: challengeId,
        created_by: ctx.auth.user!.id,
      })
      .select('id')
      .single();
    if (error || !created) {
      // Deux clics en même temps : l'autre a déjà créé l'évaluation.
      const { data: again } = await supabase.from('evaluations').select('id').eq('challenge_id', challengeId).maybeSingle();
      if (!again) return fail("L'évaluation du défi n'a pas pu être créée.");
      return gradeChallenge(challengeId);
    }
    evaluationId = created.id;
    const { data: subject, error: subjectError } = await supabase
      .from('evaluation_subjects')
      .insert({ evaluation_id: evaluationId, label: 'Sujet du défi', source: withoutBonusLevels(challenge.source ?? ''), exercises: parsed.exercises, grading: parsed.grading, position: 0 })
      .select('id')
      .single();
    if (subjectError || !subject) {
      await supabase.from('evaluations').delete().eq('id', evaluationId);
      return fail("Le sujet de l'évaluation n'a pas pu être créé.");
    }
    subjectId = subject.id;
  }

  // Copies : élèves des classes du défi qui l'ont ouvert (pas les comptes enseignant qui l'ont essayé).
  const { data: submissions } = await supabase
    .from('challenge_submissions')
    .select('user_id, answers, started_at, finished_at')
    .eq('challenge_id', challengeId);
  const userIds = (submissions ?? []).map((row: any) => row.user_id as string);
  const { data: students } = userIds.length
    ? await supabase.from('profiles').select('id').in('id', userIds).eq('role', 'student').in('classe', challenge.classes ?? [])
    : { data: [] as { id: string }[] };
  const studentIds = new Set((students ?? []).map((row: any) => row.id as string));

  const { data: attempts } = await supabase.from('evaluation_attempts').select('id, user_id, result').eq('evaluation_id', evaluationId);
  const attemptOf = new Map((attempts ?? []).map((row: any) => [row.user_id as string, row as { id: string; result: unknown }]));
  const { data: answerRows } = attempts?.length
    ? await supabase
        .from('evaluation_answers')
        .select('attempt_id, exercise_id, code, graded_at, reviewed_at, manual_points')
        .in('attempt_id', attempts.map((row: any) => row.id))
    : { data: [] as any[] };
  const answerOf = new Map((answerRows ?? []).map((row: any) => [`${row.attempt_id}:${row.exercise_id}`, row]));

  let added = 0;
  let updated = 0;
  for (const submission of submissions ?? []) {
    if (!studentIds.has(submission.user_id)) continue;
    let attempt = attemptOf.get(submission.user_id);
    if (!attempt) {
      const { data: inserted } = await supabase
        .from('evaluation_attempts')
        .insert({
          evaluation_id: evaluationId,
          user_id: submission.user_id,
          subject_id: subjectId,
          status: 'rendue',
          unlock_code: String(randomInt(100000, 1000000)),
          started_at: submission.started_at ?? new Date().toISOString(),
          submitted_at: challengeSubmittedAt(submission.finished_at, challenge.closes_at),
        })
        .select('id, result')
        .single();
      if (!inserted) continue;
      attempt = inserted as { id: string; result: unknown };
      added += 1;
    }
    // Une note déjà validée ne bouge plus.
    if (attempt.result) continue;
    const codes = challengeAnswerCodes(submission.answers, exerciseIds);
    for (const [exerciseId, code] of Object.entries(codes)) {
      const current = answerOf.get(`${attempt.id}:${exerciseId}`);
      if (!current) {
        await supabase.from('evaluation_answers').insert({ attempt_id: attempt.id, exercise_id: exerciseId, code });
      } else if (current.code !== code && !current.reviewed_at && current.manual_points == null) {
        // Nouveau code : la correction automatique repasse (graded_at remis à zéro).
        await supabase
          .from('evaluation_answers')
          .update({ code, graded_at: null, passed: null, tests_passed: null, tests_total: null, report: null, updated_at: new Date().toISOString() })
          .eq('attempt_id', attempt.id)
          .eq('exercise_id', exerciseId);
        updated += 1;
      }
    }
  }

  revalidatePath('/admin/evaluations');
  revalidatePath(`/admin/evaluations/${evaluationId}`);
  return { ok: true, evaluationId, added, updated };
}
