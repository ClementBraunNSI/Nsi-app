import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { attemptFileName, attemptText, type ExportedAttempt } from '@/lib/evaluation-export';
import { buildZip } from '@/lib/zip';
import type { EvaluationExercise } from '@/lib/evaluation-subject';

export const dynamic = 'force-dynamic';

/** Copies d'une évaluation : un fichier texte par élève (?copie=<id>), ou toutes les copies dans un zip. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return new NextResponse('Réservé aux enseignants.', { status: 403 });
  const { id } = await params;
  const only = new URL(request.url).searchParams.get('copie');

  const supabase = await createClient();
  const { data: evaluation } = await supabase.from('evaluations').select('id, title').eq('id', id).maybeSingle();
  if (!evaluation) return new NextResponse('Évaluation introuvable.', { status: 404 });

  let query = supabase
    .from('evaluation_attempts')
    .select('id, user_id, status, started_at, submitted_at, evaluation_subjects(label, exercises), evaluation_answers(exercise_id, code, passed, tests_passed, tests_total), evaluation_incidents(kind, detail, created_at)')
    .eq('evaluation_id', id);
  if (only) query = query.eq('id', only);
  const { data: attempts } = await query;
  if (!attempts?.length) return new NextResponse('Aucune copie.', { status: 404 });

  const { data: profiles } = await supabase.from('profiles').select('id, full_name, classe').in('id', attempts.map((attempt) => attempt.user_id));
  const people = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  const files = attempts.map((attempt: any) => {
    const person = people.get(attempt.user_id);
    const exercises: EvaluationExercise[] = attempt.evaluation_subjects?.exercises ?? [];
    const exported: ExportedAttempt = {
      studentName: person?.full_name || 'Élève',
      classe: person?.classe ?? null,
      subjectLabel: attempt.evaluation_subjects?.label ?? '',
      status: attempt.status,
      startedAt: attempt.started_at,
      submittedAt: attempt.submitted_at,
      incidents: (attempt.evaluation_incidents ?? [])
        .map((incident: any) => ({ kind: incident.kind, createdAt: incident.created_at, detail: incident.detail }))
        .sort((a: any, b: any) => Date.parse(a.createdAt) - Date.parse(b.createdAt)),
      exercises: exercises.map((exercise) => ({ id: exercise.id, label: exercise.label, type: exercise.type })),
      answers: Object.fromEntries(
        (attempt.evaluation_answers ?? []).map((answer: any) => [
          answer.exercise_id,
          { code: answer.code, passed: answer.passed, testsPassed: answer.tests_passed, testsTotal: answer.tests_total },
        ]),
      ),
    };
    return { name: attemptFileName(exported.studentName, exported.classe), content: attemptText(evaluation.title, exported) };
  });

  // Deux élèves au même nom : le second fichier prend un numéro.
  const used = new Map<string, number>();
  for (const file of files) {
    const count = used.get(file.name) ?? 0;
    used.set(file.name, count + 1);
    if (count > 0) file.name = file.name.replace(/\.txt$/, `_${count + 1}.txt`);
  }

  const base = evaluation.title.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'evaluation';
  if (only) {
    return new NextResponse(files[0].content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${files[0].name}"`,
        'Cache-Control': 'no-store',
      },
    });
  }
  const zip = buildZip(files);
  return new NextResponse(new Blob([zip as BlobPart], { type: 'application/zip' }), {
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${base}.zip"`,
      'Cache-Control': 'no-store',
    },
  });
}
