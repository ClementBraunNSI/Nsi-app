'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { StudentActivity } from '@/app/actions/activity';
import { ExerciseCode } from '@/components/admin/ExerciseCode';
import { classGroups, NO_CLASS_LABEL } from '@/lib/class-groups';

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  });
}

function StudentCard({ student }: { student: StudentActivity }) {
  return (
    <li className="bg-white rounded-3xl border border-slate-200 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-800">{student.fullName}</p>
          <p className="text-xs text-slate-400">
            {student.privateLesson ? 'Cours particuliers' : student.classe || 'Élève de classe'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {student.lastWorkAt ? (
            <p className="text-sm font-semibold text-slate-600">
              Dernière activité : {formatWhen(student.lastWorkAt)}
            </p>
          ) : (
            <span className="inline-flex px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold border border-red-100">
              Aucune activité
            </span>
          )}
          <Link href={`/admin/activite/${student.id}`} className="text-sm font-semibold text-orange-600">
            Fiches et exercices
          </Link>
        </div>
      </div>
      {student.events.length === 0 ? (
        <p className="mt-3 text-sm text-slate-400">Pas encore de travail enregistré.</p>
      ) : (
        <ul className="mt-3 space-y-1">
          {student.events.map((event, index) => {
            const line = (
              <>
                {event.at ? <span className="text-slate-400">{formatWhen(event.at)} : </span> : null}
                {event.label}
              </>
            );
            return (
              <li key={`${student.id}-${index}`} className="text-sm text-slate-600">
                {event.exerciseId ? (
                  <ExerciseCode studentId={student.id} exerciseId={event.exerciseId}>{line}</ExerciseCode>
                ) : (
                  line
                )}
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

function StudentCards({ students }: { students: StudentActivity[] }) {
  return (
    <ul className="space-y-3">
      {students.map((student) => (
        <StudentCard key={student.id} student={student} />
      ))}
    </ul>
  );
}

/** Activité d'un groupe d'élèves ; avec byClass, regroupée par classe et filtrable. */
export function ActivityGroup({ title, students, byClass = false }: { title: string; students: StudentActivity[]; byClass?: boolean }) {
  const [classe, setClasse] = useState('');
  const groups = useMemo(() => classGroups(students, (student) => student.classe), [students]);
  const shown = classe ? groups.filter((group) => group.key === classe) : groups;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-800">
          {title} ({students.length})
        </h2>
        {byClass && groups.length > 1 && (
          <label className="flex flex-col gap-1 text-xs font-bold text-slate-500">
            Classe
            <select
              value={classe}
              onChange={(event) => setClasse(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              <option value="">Toutes</option>
              {groups.map((group) => (
                <option key={group.key} value={group.key}>{group.label} ({group.items.length})</option>
              ))}
            </select>
          </label>
        )}
      </div>
      {students.length === 0 ? (
        <p className="text-sm text-slate-400">Aucun élève dans ce groupe.</p>
      ) : byClass ? (
        <div className="space-y-6">
          {shown.map((group) => (
            <div key={group.key} className="space-y-3">
              <h3 className={`text-lg font-bold ${group.label === NO_CLASS_LABEL ? 'text-slate-400' : 'text-slate-700'}`}>
                {group.label} <span className="text-sm font-medium text-slate-400">({group.items.length})</span>
              </h3>
              <StudentCards students={group.items} />
            </div>
          ))}
        </div>
      ) : (
        <StudentCards students={students} />
      )}
    </section>
  );
}
