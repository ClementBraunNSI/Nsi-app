'use client';

import { useState, type ReactNode } from 'react';
import { ChevronDown, Code2 } from 'lucide-react';
import { getStudentExerciseCode, type StudentExerciseCode } from '@/app/actions/solvedCode';
import { isAbortError } from '@/lib/is-abort-error';
import { TypingReport } from '@/components/admin/TypingReport';

const dateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' });

/** Bloc de code d'un élève, en lecture seule. */
export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="max-h-[28rem] overflow-auto rounded-xl bg-slate-900 p-4 text-left text-sm leading-relaxed text-slate-100">
      <code>{code.trim() || '(code vide)'}</code>
    </pre>
  );
}

/**
 * Un exercice réalisé : un clic affiche le dernier code réussi de l'élève.
 * Les exercices validés avant l'enregistrement des essais n'ont pas de code gardé ; c'est dit à la place.
 */
export function ExerciseCode({ studentId, exerciseId, children }: { studentId: string; exerciseId: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [solved, setSolved] = useState<StudentExerciseCode | null | 'error' | undefined>(undefined);

  const toggle = () => {
    setOpen((value) => !value);
    if (solved === undefined || solved === 'error') {
      setSolved(undefined);
      getStudentExerciseCode(studentId, exerciseId)
        .then(setSolved)
        .catch((error) => {
          if (!isAbortError(error)) setSolved('error');
        });
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        className="group flex w-full items-baseline gap-2 rounded-lg text-left hover:text-orange-700"
      >
        <Code2 size={14} className="shrink-0 translate-y-0.5 text-slate-400 group-hover:text-orange-500" aria-hidden />
        <span className="min-w-0 flex-1">{children}</span>
        <ChevronDown size={14} className={`shrink-0 translate-y-0.5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {open && (
        <div className="mt-2 mb-3 space-y-2">
          {solved === undefined && <p className="animate-pulse text-sm text-slate-400">Chargement du code</p>}
          {solved === 'error' && <p className="text-sm font-semibold text-slate-600">Le code n'a pas pu être chargé.</p>}
          {solved === null && (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
              Code non conservé : cet exercice a été validé avant que le site garde le code des exercices réussis.
            </p>
          )}
          {solved && solved !== 'error' && (
            <>
              <p className="text-xs text-slate-400">
                {solved.kind === 'reponse' ? 'Réponse écrite' : 'Code'}{' '}
                {solved.status === 'validee' ? 'validé par l\'enseignant' : 'qui passe les tests'}, enregistré le {dateFormat.format(new Date(solved.solvedAt))}
              </p>
              <CodeBlock code={solved.content} />
              {solved.kind === 'code' ? (
                <TypingReport summary={solved.typing?.summary ?? null} trace={solved.typing?.trace} levelFlags={solved.levelFlags ?? []} />
              ) : null}
            </>
          )}
        </div>
      )}
    </div>
  );
}
