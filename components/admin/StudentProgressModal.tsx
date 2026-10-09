'use client';

import { useEffect, useMemo, useState } from 'react';
import { Award, CheckCircle2, ChevronLeft, ChevronRight, Circle, X } from 'lucide-react';
import { SheetBadgeFox } from '@/components/fox/SheetBadgeFox';
import { getStudentSheetProgress, type StudentSheetProgress, type StudentProgressSheet } from '@/app/actions/studentProgress';
import { isAbortError } from '@/lib/is-abort-error';
import { levelLabel, pickDefaultLevel, sortLevels, validatedPhrase, type SheetProgressStatus } from '@/lib/student-progress';

type ProgressStudent = {
  id: string;
  full_name: string | null;
  email: string | null;
  level: string | null;
  has_private_lessons?: boolean | null;
};

const STATUS_LABEL: Record<SheetProgressStatus, string> = {
  validated: 'Fiche validée',
  in_progress: 'En cours',
  not_started: 'Non commencée',
};

function statusClass(status: SheetProgressStatus) {
  if (status === 'validated') return 'border-emerald-200 bg-emerald-50/70';
  if (status === 'in_progress') return 'border-orange-200 bg-white';
  return 'border-slate-200 bg-white';
}

function SheetCard({ sheet, onOpen }: { sheet: StudentProgressSheet; onOpen: () => void }) {
  const percent = sheet.total > 0 ? Math.round((sheet.validatedCount / sheet.total) * 100) : 0;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`group flex w-full flex-col rounded-3xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-300 ${statusClass(sheet.status)}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <SheetBadgeFox
          courseId={sheet.courseId}
          title={sheet.courseTitle}
          earned={sheet.status === 'validated'}
          size={56}
        />
        <ChevronRight size={18} className="shrink-0 text-slate-300 transition group-hover:text-orange-500" />
      </div>
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{sheet.chapter}</p>
      <h3 className="text-lg font-semibold tracking-tight text-slate-800">{sheet.courseTitle}</h3>
      <p className="mt-2 text-sm font-bold text-slate-600">{validatedPhrase(sheet.validatedCount, sheet.total)}</p>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full ${sheet.status === 'validated' ? 'bg-emerald-500' : 'bg-orange-500'}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span
        className={`mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
          sheet.status === 'validated'
            ? 'border-emerald-200 bg-white text-emerald-700'
            : sheet.status === 'in_progress'
              ? 'border-orange-200 bg-orange-50 text-orange-700'
              : 'border-slate-200 bg-slate-50 text-slate-500'
        }`}
      >
        {sheet.status === 'validated' && <Award size={12} />}
        {STATUS_LABEL[sheet.status]}
      </span>
    </button>
  );
}

export function StudentProgressModal({ student, onClose }: { student: ProgressStudent; onClose: () => void }) {
  const [data, setData] = useState<StudentSheetProgress | null>(null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [level, setLevel] = useState('');
  const [sheetId, setSheetId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    setData(null);
    setLevel('');
    setSheetId(null);

    getStudentSheetProgress(student.id)
      .then((result) => {
        if (cancelled) return;
        if (!result) {
          setFailed(true);
          return;
        }
        setData(result);
        const available = result.sheets.map((sheet) => sheet.level);
        setLevel(pickDefaultLevel(result.profileLevel || student.level, available));
      })
      .catch((error) => {
        if (cancelled || isAbortError(error)) return;
        setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [student.id, student.level]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (sheetId) setSheetId(null);
      else onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, sheetId]);

  const levels = useMemo(() => sortLevels((data?.sheets || []).map((sheet) => sheet.level)), [data]);
  const visibleSheets = useMemo(
    () => (data?.sheets || []).filter((sheet) => sheet.level === level),
    [data, level],
  );
  const openSheet = visibleSheets.find((sheet) => sheet.courseId === sheetId) || null;
  const validatedExercises = visibleSheets.reduce((sum, sheet) => sum + sheet.validatedCount, 0);
  const validatedSheets = visibleSheets.filter((sheet) => sheet.status === 'validated').length;
  const displayName = student.full_name || data?.fullName || 'Élève sans nom';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-progress-title"
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-white/90 p-6 backdrop-blur-md">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 text-2xl font-black text-orange-500 shadow-inner">
              {displayName[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-500">Progression</p>
              <h2 id="student-progress-title" className="truncate text-2xl font-black tracking-tight text-slate-800">
                {displayName}
              </h2>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                  {levelLabel(student.level || data?.profileLevel || '') || 'Niveau inconnu'}
                </span>
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${
                    student.has_private_lessons ? 'bg-orange-50 text-orange-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {student.has_private_lessons ? 'Cours particuliers' : 'Élève de classe'}
                </span>
                {student.email && <span className="truncate text-sm font-medium text-slate-400">{student.email}</span>}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-slate-400">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-500" />
              <p className="animate-pulse font-medium">Chargement de la progression…</p>
            </div>
          ) : failed || !data ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <p className="font-bold text-slate-600">La progression n’a pas pu être chargée.</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500">
                Un exercice compte comme validé seulement si les tests sont réussis.
              </p>

              {levels.length > 0 && (
                <div className="flex flex-wrap gap-2" role="group" aria-label="Niveau">
                  {levels.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setLevel(id);
                        setSheetId(null);
                      }}
                      aria-pressed={level === id}
                      className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${
                        level === id ? 'bg-orange-500 text-white' : 'border border-slate-200 bg-white text-slate-500'
                      }`}
                    >
                      {levelLabel(id)}
                    </button>
                  ))}
                </div>
              )}

              {levels.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                  <p className="font-bold text-slate-600">Aucune fiche pour ce niveau.</p>
                  <p className="mt-1 text-sm text-slate-400">Les fiches du site apparaîtront ici, même sans exercice validé.</p>
                </div>
              ) : openSheet ? (
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setSheetId(null)}
                    className="inline-flex items-center gap-1 text-sm font-bold text-orange-600 hover:text-orange-700"
                  >
                    <ChevronLeft size={16} />
                    Retour aux fiches
                  </button>
                  <div className={`flex items-start gap-4 rounded-3xl border p-5 ${statusClass(openSheet.status)}`}>
                    <SheetBadgeFox
                      courseId={openSheet.courseId}
                      title={openSheet.courseTitle}
                      earned={openSheet.status === 'validated'}
                      size={72}
                    />
                    <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">{openSheet.chapter}</p>
                    <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-800">{openSheet.courseTitle}</h3>
                    <p className="mt-2 text-sm font-bold text-slate-600">
                      {validatedPhrase(openSheet.validatedCount, openSheet.total)}
                    </p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {openSheet.exercises.map((exercise) => (
                      <li
                        key={exercise.id}
                        className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white px-4 py-3"
                      >
                        <span className="font-semibold text-slate-800">{exercise.label}</span>
                        {exercise.validated ? (
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                            <CheckCircle2 size={14} />
                            Validé
                          </span>
                        ) : (
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-500">
                            <Circle size={14} />
                            Non validé
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : visibleSheets.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
                  <p className="font-bold text-slate-600">Aucune fiche pour ce niveau.</p>
                  <p className="mt-1 text-sm text-slate-400">Les fiches du site apparaîtront ici, même sans exercice validé.</p>
                </div>
              ) : (
                <>
                  <p className="text-sm font-semibold text-slate-600">
                    {validatedExercises === 1 ? '1 exercice validé' : `${validatedExercises} exercices validés`}
                    {' · '}
                    {validatedSheets === 1 ? '1 fiche terminée' : `${validatedSheets} fiches terminées`}
                  </p>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {visibleSheets.map((sheet) => (
                      <SheetCard key={sheet.courseId} sheet={sheet} onOpen={() => setSheetId(sheet.courseId)} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-100 bg-slate-50 p-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 font-bold text-slate-600 shadow-sm transition hover:bg-slate-100"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
