'use client';

import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, Clock, ExternalLink, MessageSquareWarning, RotateCcw, XCircle } from 'lucide-react';
import {
  listPendingSubmissions,
  listStudentSubmissions,
  reviewSubmission,
  type Submission,
} from '@/app/actions/submissions';
import { isAbortError } from '@/lib/is-abort-error';

const dateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short' });

const STATUS: Record<Submission['status'], { label: string; className: string; icon: typeof Check }> = {
  auto: { label: 'Validé par les tests', className: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: Check },
  validee: { label: 'Validé par l\'enseignant', className: 'border-emerald-200 bg-emerald-50 text-emerald-700', icon: Check },
  en_attente: { label: 'À corriger', className: 'border-orange-200 bg-orange-50 text-orange-700', icon: Clock },
  a_revoir: { label: 'Renvoyé à l\'élève', className: 'border-slate-200 bg-slate-50 text-slate-600', icon: MessageSquareWarning },
};

function StatusChip({ submission }: { submission: Submission }) {
  const failedCode = submission.kind === 'code' && submission.status === 'en_attente';
  const info = failedCode
    ? { label: 'Tests non réussis', className: 'border-rose-200 bg-rose-50 text-rose-700', icon: XCircle }
    : STATUS[submission.status];
  const Icon = info.icon;
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${info.className}`}>
      <Icon size={13} aria-hidden />
      {info.label}
    </span>
  );
}

/** Un rendu : le code ou la réponse de l'élève, et la décision de l'enseignant. */
function SubmissionCard({
  submission,
  attempts,
  showStudent,
  onReviewed,
}: {
  submission: Submission;
  attempts: number;
  showStudent: boolean;
  onReviewed: (id: string, status: Submission['status'], feedback: string | null) => void;
}) {
  const [open, setOpen] = useState(submission.status === 'en_attente' && submission.kind === 'reponse');
  const [feedback, setFeedback] = useState(submission.feedback || '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const settled = submission.status === 'auto' || submission.status === 'validee';

  const decide = async (decision: 'validee' | 'a_revoir') => {
    setBusy(true);
    setError(null);
    const result = await reviewSubmission(submission.id, decision, feedback).catch(() => ({ ok: false, error: 'La décision n\'a pas pu être enregistrée.' }));
    setBusy(false);
    if (!result.ok) {
      setError(result.error || 'La décision n\'a pas pu être enregistrée.');
      return;
    }
    onReviewed(submission.id, decision, feedback.trim() || null);
  };

  return (
    <li className="rounded-2xl border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-start justify-between gap-3 p-4 text-left"
      >
        <div className="min-w-0">
          {showStudent && <p className="text-xs font-bold text-orange-600">{submission.studentName}</p>}
          <p className="font-semibold text-slate-800">{submission.exerciseLabel}</p>
          <p className="mt-0.5 text-xs text-slate-500">
            {submission.courseTitle} · {submission.kind === 'code' ? 'Code' : 'Réponse écrite'} · {dateFormat.format(new Date(submission.createdAt))}
            {attempts > 1 ? ` · ${attempts} essais` : ''}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusChip submission={submission} />
          <ChevronDown size={16} className={`text-slate-400 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
        </div>
      </button>
      {open && (
        <div className="space-y-3 border-t border-slate-100 p-4">
          <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-900 p-4 font-mono text-xs leading-relaxed text-slate-100">
            {submission.content}
          </pre>
          {submission.pagePath && (
            <a
              href={submission.pagePath}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              Voir l'énoncé sur la fiche
              <ExternalLink size={12} aria-hidden />
            </a>
          )}
          {!settled && (
            <>
              <label className="block text-xs font-bold text-slate-500" htmlFor={`retour-${submission.id}`}>
                Retour pour l'élève (facultatif)
              </label>
              <textarea
                id={`retour-${submission.id}`}
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                rows={2}
                maxLength={2000}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-700 outline-none focus:border-orange-300"
              />
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => decide('validee')}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  <Check size={15} aria-hidden />
                  Valider l'exercice
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => decide('a_revoir')}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <RotateCcw size={15} aria-hidden />
                  Renvoyer à l'élève
                </button>
              </div>
            </>
          )}
          {settled && submission.feedback && <p className="text-sm text-slate-600">Retour : {submission.feedback}</p>}
          {error && <p className="text-sm font-semibold text-rose-600" role="alert">{error}</p>}
        </div>
      )}
    </li>
  );
}

/** Le dernier rendu de chaque exercice, avec le nombre d'essais. */
function latestByExercise(submissions: Submission[]) {
  const latest = new Map<string, { submission: Submission; attempts: number }>();
  for (const submission of submissions) {
    const key = `${submission.userId}:${submission.exerciseId}`;
    const known = latest.get(key);
    if (known) known.attempts += 1;
    else latest.set(key, { submission, attempts: 1 });
  }
  return [...latest.values()];
}

/**
 * studentId : le travail d'un élève (fiche de progression).
 * Sans studentId : les réponses écrites de tous les élèves qui attendent une correction.
 */
export function SubmissionsReview({ studentId }: { studentId?: string }) {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [onlyPending, setOnlyPending] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSubmissions(null);
    setFailed(false);
    (studentId ? listStudentSubmissions(studentId) : listPendingSubmissions())
      .then((rows) => {
        if (!cancelled) setSubmissions(rows);
      })
      .catch((error) => {
        if (!cancelled && !isAbortError(error)) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [studentId]);

  const items = useMemo(() => {
    const all = latestByExercise(submissions || []);
    return onlyPending ? all.filter((item) => item.submission.status === 'en_attente') : all;
  }, [submissions, onlyPending]);

  const onReviewed = (id: string, status: Submission['status'], feedback: string | null) => {
    setSubmissions((rows) => (rows || []).map((row) => (row.id === id ? { ...row, status, feedback } : row)));
  };

  if (failed) return <p className="text-sm font-semibold text-slate-600">Le travail rendu n'a pas pu être chargé.</p>;
  if (!submissions) return <p className="animate-pulse text-sm text-slate-400">Chargement du travail rendu</p>;
  if (submissions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <p className="font-bold text-slate-600">{studentId ? 'Aucun travail rendu pour l\'instant.' : 'Aucune réponse à corriger.'}</p>
        {studentId && (
          <p className="mt-1 text-sm text-slate-400">Chaque vérification de code et chaque réponse écrite apparaît ici.</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {studentId && (
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
          <input type="checkbox" checked={onlyPending} onChange={(event) => setOnlyPending(event.target.checked)} />
          Seulement ce qui reste à corriger
        </label>
      )}
      <ul className="space-y-2">
        {items.map(({ submission, attempts }) => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            attempts={attempts}
            showStudent={!studentId}
            onReviewed={onReviewed}
          />
        ))}
      </ul>
    </div>
  );
}
