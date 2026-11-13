'use client';

import { useAdminClass } from '@/components/admin/AdminClassContext';
import { ADMIN_PRIVATE } from '@/lib/admin-class';
import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronDown, Download } from 'lucide-react';
import { getSolvedCode, listSolvedCode } from '@/app/actions/solvedCode';
import { NO_CLASS, type SolvedEntry } from '@/lib/solved-code';
import { isAbortError } from '@/lib/is-abort-error';
import { CodeBlock } from '@/components/admin/ExerciseCode';

const dateFormat = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Europe/Paris' });

function exportHref(filters: { classe: string; courseId: string; studentId: string }) {
  const params = new URLSearchParams();
  if (filters.classe) params.set('classe', filters.classe);
  if (filters.courseId) params.set('fiche', filters.courseId);
  if (filters.studentId) params.set('eleve', filters.studentId);
  const query = params.toString();
  return `/admin/code/export${query ? `?${query}` : ''}`;
}

/** Un exercice réussi : le code s'ouvre à la demande. */
function SolvedRow({ entry }: { entry: SolvedEntry }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<string | null | undefined>(undefined);

  const toggle = () => {
    setOpen((value) => !value);
    if (code === undefined) {
      getSolvedCode(entry.id)
        .then(setCode)
        .catch((error) => {
          if (!isAbortError(error)) setCode(null);
        });
    }
  };

  return (
    <li className="rounded-2xl border border-slate-200 bg-white">
      <button type="button" onClick={toggle} aria-expanded={open} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <Check size={16} className="shrink-0 text-emerald-600" aria-hidden />
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-slate-800">{entry.exerciseLabel}</span>
          <span className="block text-xs text-slate-400">
            {entry.status === 'validee' ? 'Validé par l\'enseignant' : 'Tests réussis'} le {dateFormat.format(new Date(entry.solvedAt))}
            {entry.versions > 1 && ` · ${entry.versions} versions réussies, la dernière est affichée`}
          </span>
        </span>
        <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500">{entry.type}</span>
        <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      {open && (
        <div className="border-t border-slate-100 p-3">
          {code === undefined && <p className="animate-pulse text-sm text-slate-400">Chargement du code</p>}
          {code === null && <p className="text-sm font-semibold text-slate-600">Le code n'a pas pu être chargé.</p>}
          {typeof code === 'string' && <CodeBlock code={code} />}
        </div>
      )}
    </li>
  );
}

/** Codes réussis par les élèves : dernière version de chaque exercice, filtrée par classe, fiche ou élève. */
export function SolvedCodePanel({ studentId: fixedStudent }: { studentId?: string } = {}) {
  const { selection } = useAdminClass();
  const [entries, setEntries] = useState<SolvedEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  // La classe vient de la barre du haut ; dans une fiche élève, seul cet élève est affiché.
  const classe = fixedStudent || selection === ADMIN_PRIVATE ? '' : selection;
  const [courseId, setCourseId] = useState('');
  const [studentId, setStudentId] = useState(fixedStudent ?? '');

  useEffect(() => {
    if (fixedStudent) return;
    setCourseId('');
    setStudentId('');
  }, [selection, fixedStudent]);

  useEffect(() => {
    let cancelled = false;
    listSolvedCode()
      .then((rows) => {
        if (!cancelled) setEntries(rows);
      })
      .catch((error) => {
        if (!cancelled && !isAbortError(error)) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const all = entries ?? [];
  const inClass = useMemo(
    () => all.filter((entry) => !classe || (classe === NO_CLASS ? !entry.classe : entry.classe === classe)),
    [all, classe],
  );
  const shown = useMemo(
    () => inClass.filter((entry) => (!courseId || entry.courseId === courseId) && (!studentId || entry.userId === studentId)),
    [inClass, courseId, studentId],
  );

  const courses = useMemo(() => {
    const titles = new Map<string, string>();
    for (const entry of inClass) titles.set(entry.courseId, entry.courseTitle);
    return [...titles].sort((a, b) => a[1].localeCompare(b[1], 'fr'));
  }, [inClass]);
  const students = useMemo(() => {
    const names = new Map<string, string>();
    for (const entry of inClass) names.set(entry.userId, entry.studentName);
    return [...names].sort((a, b) => a[1].localeCompare(b[1], 'fr'));
  }, [inClass]);

  const groups = useMemo(() => {
    const byStudent = new Map<string, { name: string; classe: string | null; courses: Map<string, SolvedEntry[]> }>();
    for (const entry of shown) {
      const student = byStudent.get(entry.userId) ?? { name: entry.studentName, classe: entry.classe, courses: new Map() };
      const list = student.courses.get(entry.courseTitle) ?? [];
      list.push(entry);
      student.courses.set(entry.courseTitle, list);
      byStudent.set(entry.userId, student);
    }
    return [...byStudent];
  }, [shown]);

  if (failed) return <p className="text-sm font-semibold text-slate-600">Les codes réussis n'ont pas pu être chargés.</p>;
  if (!entries) return <p className="animate-pulse text-sm text-slate-400">Chargement des codes réussis</p>;
  if (entries.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
        <p className="font-bold text-slate-600">Aucun exercice réussi pour l'instant.</p>
        <p className="mt-1 text-sm text-slate-400">Le code apparaît ici dès qu'un élève passe les tests d'un exercice.</p>
      </div>
    );
  }

  const select = 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs font-bold text-slate-500">
          Fiche
          <select className={select} value={courseId} onChange={(event) => setCourseId(event.target.value)}>
            <option value="">Toutes</option>
            {courses.map(([id, title]) => (
              <option key={id} value={id}>{title}</option>
            ))}
          </select>
        </label>
        {fixedStudent ? null : (
          <label className="flex flex-col gap-1 text-xs font-bold text-slate-500">
            Élève
            <select className={select} value={studentId} onChange={(event) => setStudentId(event.target.value)}>
              <option value="">Tous</option>
              {students.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </label>
        )}
        <a
          href={exportHref({ classe, courseId, studentId })}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent-fg)]"
        >
          <Download size={16} aria-hidden />
          {studentId ? 'Télécharger (.txt)' : 'Exporter (.zip)'}
        </a>
      </div>

      <p className="text-sm text-slate-500">
        {shown.length} exercice{shown.length > 1 ? 's' : ''} réussi{shown.length > 1 ? 's' : ''}, {groups.length} élève{groups.length > 1 ? 's' : ''}.
      </p>

      {groups.map(([userId, student]) => (
        <section key={userId} className="space-y-3 rounded-3xl border border-slate-200 bg-slate-50/60 p-4 md:p-5">
          <header className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-bold text-slate-800">
              {student.name}
              {student.classe && <span className="ml-2 text-sm font-medium text-slate-400">{student.classe}</span>}
            </h3>
            <a
              href={exportHref({ classe: '', courseId, studentId: userId })}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
            >
              <Download size={14} aria-hidden />
              .txt
            </a>
          </header>
          {[...student.courses].map(([title, list]) => (
            <div key={title} className="space-y-2">
              <h4 className="text-sm font-bold text-slate-500">{title}</h4>
              <ul className="space-y-2">
                {list.map((entry) => (
                  <SolvedRow key={entry.id} entry={entry} />
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}
