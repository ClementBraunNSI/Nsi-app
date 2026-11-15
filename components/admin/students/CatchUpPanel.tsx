"use client";

import { useState } from "react";
import { ChevronDown, LifeBuoy } from "lucide-react";
import type { CatchUpGroup } from "@/app/actions/studentSheets";
import { firstName } from "./StudentTiles";
import styles from "./Students.module.css";

const num = (value: number) => String(Math.round(value * 100) / 100).replace(".", ",");

/**
 * Élèves de classe sous 12 à la dernière évaluation de leur classe : on en coche un ou plusieurs, puis une fiche de
 * rattrapage est préparée à partir des notions qu'ils ont manquées.
 */
export function CatchUpPanel({
  groups,
  onPrepare,
}: {
  groups: CatchUpGroup[];
  onPrepare: (group: CatchUpGroup, students: CatchUpGroup["students"]) => void;
}) {
  const [open, setOpen] = useState(true);
  const [chosen, setChosen] = useState<Record<string, Set<string>>>({});
  if (groups.length === 0) return null;
  const total = groups.reduce((sum, group) => sum + group.students.filter((student) => !student.alreadyGiven).length, 0);

  return (
    <section className={styles.catchUp} aria-labelledby="catch-up-title">
      <button type="button" className={styles.catchUpHead} aria-expanded={open} onClick={() => setOpen(!open)}>
        <LifeBuoy size={18} aria-hidden />
        <span>
          <b id="catch-up-title">Rattrapage</b>
          <small>
            {total
              ? `${total} élève${total > 1 ? "s" : ""} sous 12 à la dernière évaluation de sa classe, sans fiche de rattrapage pour l'instant`
              : "Une fiche de rattrapage a déjà été donnée à chaque élève sous 12"}
          </small>
        </span>
        <ChevronDown size={16} className={open ? styles.chevronOpen : ""} aria-hidden />
      </button>
      {open ? (
        <div className={styles.catchUpBody}>
          {groups.map((group) => {
            const picked = chosen[group.evaluationId] ?? new Set(group.students.filter((student) => !student.alreadyGiven).map((student) => student.id));
            const toggle = (id: string) => {
              const next = new Set(picked);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              setChosen({ ...chosen, [group.evaluationId]: next });
            };
            const selection = group.students.filter((student) => picked.has(student.id));
            return (
              <div key={group.evaluationId} className={styles.catchUpGroup}>
                <p>
                  <b>{group.classe}</b> · {group.title}
                </p>
                <ul>
                  {group.students.map((student) => (
                    <li key={student.id}>
                      <label>
                        <input type="checkbox" checked={picked.has(student.id)} onChange={() => toggle(student.id)} />
                        <b>{firstName(student.name)}</b>
                        <span className={styles.catchUpGrade}>{num(student.total)}</span>
                        <small>
                          {student.notions.length ? student.notions.join(", ") : "notions à préciser"}
                          {student.alreadyGiven ? " · fiche déjà donnée" : ""}
                        </small>
                      </label>
                    </li>
                  ))}
                </ul>
                <button type="button" className={styles.green} disabled={selection.length === 0} onClick={() => onPrepare(group, selection)}>
                  Préparer une fiche de rattrapage{selection.length > 1 ? ` pour ${selection.length} élèves` : selection.length === 1 ? ` pour ${firstName(selection[0].name)}` : ""}
                </button>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}
