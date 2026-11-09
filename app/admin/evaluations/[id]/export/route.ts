import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getAuthContext } from '@/lib/auth';
import { attemptFileName, attemptText, gradesCsv, type ExportedAttempt } from '@/lib/evaluation-export';
import { gradeCopy } from '@/lib/evaluation-grade';
import { buildZip } from '@/lib/zip';
import type { EvaluationExercise } from '@/lib/evaluation-subject';

export const dynamic = 'force-dynamic';

/**
 * Copies d'une évaluation : un fichier texte par élève (?copie=<id>), toutes les copies dans un zip,
 * ou les notes de toutes les copies en CSV (?format=notes).
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return new NextResponse('Réservé aux enseignants.', { status: 403 });
  const { id } = await params;
  const searchParams = new URL(request.url).searchParams;
  const only = searchParams.get('copie');
  const notes = searchParams.get('format') === 'notes';

  const supabase = await createClient();
  const { data: evaluation } = await supabase.from('evaluations').select('id, title').eq('id', id).maybeSingle();
  if (!evaluation) return new NextResponse('Évaluation introuvable.', { status: 404 });

  const columns =
    'id, user_id, status, started_at, submitted_at, evaluation_subjects(label, exercises, grading), evaluation_answers(exercise_id, code, passed, tests_passed, tests_total, report, graded_at, manual_points, reviewed_at), evaluation_incidents(kind, detail, created_at)';
  const read = (selected: string) => {
    let query = supabase.from('evaluation_attempts').select(selected).eq('evaluation_id', id);
    if (only) query = query.eq('id', only);
    return query;
  };
  const first = await read(columns);
  // Colonnes de la vérification absentes (migration des notes pas encore passée) : on relit sans elles.
  const attempts = (first.error ? (await read(columns.replace(', manual_points, reviewed_at', ''))).data : first.data) as any[] | null;
  if (!attempts?.length) return new NextResponse('Aucune copie.', { status: 404 });

  const { data: profiles } = await supabase.from('profiles').select('id, full_name, classe').in('id', attempts.map((attempt: any) => attempt.user_id));
  const people = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

  const files = attempts.map((attempt: any) => {
    const person = people.get(attempt.user_id);
    const exercises: EvaluationExercise[] = attempt.evaluation_subjects?.exercises ?? [];
    const grading = new Map<string, any>((attempt.evaluation_subjects?.grading ?? []).map((item: any) => [item.id, item]));
    const grade = gradeCopy(
      exercises.map((exercise) => ({
        ...exercise,
        correction: grading.get(exercise.id)?.correction ?? '',
        hasTests: Boolean(grading.get(exercise.id)?.verification?.trim()),
      })),
      Object.fromEntries(
        (attempt.evaluation_answers ?? []).map((answer: any) => [
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
      ),
    );
    const exported: ExportedAttempt = {
      grade,
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
    return { name: attemptFileName(exported.studentName, exported.classe), content: attemptText(evaluation.title, exported), exported };
  });

  const base = evaluation.title.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_+|_+$/g, '') || 'evaluation';
  if (notes) {
    const rows = files
      .map(({ exported }) => ({ studentName: exported.studentName, classe: exported.classe, subjectLabel: exported.subjectLabel, grade: exported.grade! }))
      .sort((a, b) => (a.classe ?? '').localeCompare(b.classe ?? '') || a.studentName.localeCompare(b.studentName, 'fr'));
    return new NextResponse(gradesCsv(rows), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${base}_notes.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  }

  // Deux élèves au même nom : le second fichier prend un numéro.
  const used = new Map<string, number>();
  for (const file of files) {
    const count = used.get(file.name) ?? 0;
    used.set(file.name, count + 1);
    if (count > 0) file.name = file.name.replace(/\.txt$/, `_${count + 1}.txt`);
  }

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
