"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useAdminClass } from "@/components/admin/AdminClassContext";
import { ADMIN_PRIVATE } from "@/lib/admin-class";
import { gapLabel } from "@/lib/student-overview";
import type { ClassesBoard } from "@/lib/admin-classes";
import { ParentReportModal } from "./ParentReportModal";

const num = (value: number | null, digits = 2) => (value === null ? "—" : value.toLocaleString("fr-FR", { maximumFractionDigits: digits }));

/**
 * Réunion parents-professeur : la liste des élèves de chaque classe, par ordre alphabétique (les parents arrivent
 * dans le désordre). Un clic sur un nom ouvre le bilan de l'élève.
 */
export function ParentMeeting({ board }: { board: ClassesBoard }) {
  const { selection, label } = useAdminClass();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const classes = useMemo(() => {
    const words = query.trim().toLowerCase();
    return board.classes
      .filter((item) => !selection || item.name === selection)
      .map((item) => ({
        ...item,
        members: board.students
          .filter((student) => student.classe === item.name && (!words || student.name.toLowerCase().includes(words)))
          .sort((a, b) => a.name.localeCompare(b.name, "fr")),
      }))
      .filter((item) => item.members.length > 0 || !words);
  }, [board, selection, query]);

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <p className="admin-kicker">Réunion parents · {label}</p>
          <h1>Bilan de chaque élève</h1>
          <p>Un clic sur un nom ouvre le bilan à montrer aux parents : moyenne et place dans la classe, évaluations, fiches d&apos;exercices faites.</p>
        </div>
        <label className="admin-search">
          <Search size={16} aria-hidden />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Chercher un élève…" aria-label="Chercher un élève" />
        </label>
      </header>

      {selection === ADMIN_PRIVATE ? (
        <p className="admin-card admin-muted">Les élèves en cours particuliers n&apos;ont pas de classe : leur suivi est sur leur fiche, depuis « Élèves et comptes ».</p>
      ) : classes.length === 0 ? (
        <p className="admin-card admin-muted">{query ? "Aucun élève ne correspond." : "Aucun élève rangé dans une classe pour le moment."}</p>
      ) : (
        classes.map((item) => (
          <section key={item.name} className="admin-page-section" aria-labelledby={`parents-${item.name}`}>
            <h2 id={`parents-${item.name}`} className="admin-sec">
              {item.name}{" "}
              <small>
                {item.students} élève{item.students > 1 ? "s" : ""} · moyenne {num(item.stats.mean, 1)} · médiane {num(item.stats.median, 1)}
              </small>
            </h2>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Élève</th>
                    <th className="admin-num">Moyenne</th>
                    <th className="admin-num">Rang</th>
                    <th>Par rapport à la classe</th>
                    <th className="admin-num">Notes</th>
                    <th className="admin-num">Défis réussis</th>
                  </tr>
                </thead>
                <tbody>
                  {item.members.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <button type="button" className="admin-who-name" onClick={() => setOpen(student.id)}>
                          {student.name}
                        </button>
                      </td>
                      <td className="admin-num">
                        <b className={`admin-note${student.average !== null && student.average < 10 ? " is-low" : ""}`}>{num(student.average)}</b>
                      </td>
                      <td className="admin-num">{student.rank !== null ? `${student.rank}/${item.stats.count}` : "—"}</td>
                      <td className="admin-muted">
                        {student.average !== null && item.stats.median !== null ? gapLabel(student.average - item.stats.median, "médiane") : "pas encore de note"}
                      </td>
                      <td className="admin-num">{student.gradeCount}</td>
                      <td className="admin-num">
                        {student.challengesPassed}/{item.challenges}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}

      {open ? <ParentReportModal studentId={open} onClose={() => setOpen(null)} /> : null}
    </div>
  );
}
