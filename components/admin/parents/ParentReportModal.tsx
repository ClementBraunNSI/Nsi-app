"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Loader2, Printer, X } from "lucide-react";
import { getParentReport, type ParentReport } from "@/app/actions/adminClasses";
import { PositionGauge } from "@/components/admin/students/StudentModal";
import { levelFox } from "@/components/admin/students/StudentTiles";
import { gapLabel } from "@/lib/student-overview";
import { standingSentence, type ExercisesStanding } from "@/lib/parent-meeting";
import { lastActivityLabel } from "@/lib/activity-board";
import styles from "@/components/admin/students/Students.module.css";

const num = (value: number) => value.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
const dayFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Paris" });
/** « 3 fiches commencées » : chaque mot prend la marque du pluriel. */
const plural = (count: number, words: string) => `${count} ${count > 1 ? words.replace(/(\S+)/g, "$1s") : words}`;
const STATUS = { validated: ["Terminée", "is-ok"], in_progress: ["En cours", "is-accent"], not_started: ["Pas commencée", ""] } as const;

/** Place de l'élève dans sa classe en nombre d'exercices réussis : médiane (trait) et moyenne (pointillés) de la classe. */
function ExercisesGauge({ standing }: { standing: ExercisesStanding }) {
  const top = Math.max(1, standing.max);
  const pct = (value: number) => `${Math.min(100, Math.max(0, (value / top) * 100))}%`;
  return (
    <div className={styles.gauge}>
      <div className={styles.gaugeHead}>
        <span>
          <b>{standing.average}</b> exercice{standing.average > 1 ? "s" : ""} réussi{standing.average > 1 ? "s" : ""}
        </span>
        <span>
          Rang <b>{standing.rank}</b> sur {standing.count}
        </span>
      </div>
      <div className={styles.rail}>
        {standing.median !== null ? <span className={styles.tick} style={{ left: pct(standing.median) }} title={`Médiane de la classe : ${num(standing.median)}`} /> : null}
        {standing.mean !== null ? <span className={`${styles.tick} ${styles.tickMean}`} style={{ left: pct(standing.mean) }} title={`Moyenne de la classe : ${num(standing.mean)}`} /> : null}
        <span className={styles.pin} style={{ left: pct(standing.average) }} />
      </div>
      <div className={styles.axis} aria-hidden>
        {[...new Set([0, Math.round(top / 2), top])].map((tick) => (
          <span key={tick} style={{ left: pct(tick) }}>
            {tick}
          </span>
        ))}
      </div>
      <div className={styles.gaugeFoot}>
        <span className={styles.beats}>
          <b>{standing.beats} %</b> de la classe a réussi moins d&apos;exercices
        </span>
        <span>
          {gapLabel(standing.vsMedian, "médiane")} ({standing.median !== null ? num(standing.median) : "—"}) · {gapLabel(standing.vsMean, "moyenne")} (
          {standing.mean !== null ? num(standing.mean) : "—"})
        </span>
      </div>
    </div>
  );
}

/** Contenu du bilan : chiffres clés, place dans la classe, évaluations, fiches d'exercices. */
export function ParentReportBody({ report }: { report: ParentReport }) {
  const { detail, work } = report;
  const { card } = detail;
  const graded = card.evaluations.filter((item) => item.grade !== null);
  return (
    <div className={`${styles.body} parent-print-body`}>
      <dl className={styles.kpis}>
        <div>
          <dt>Moyenne des évaluations</dt>
          <dd>{card.average !== null ? `${num(card.average)}/20` : "—"}</dd>
          <small>{detail.position ? `rang ${detail.position.rank} sur ${detail.position.count}` : plural(graded.length, "note validée")}</small>
        </div>
        <div>
          <dt>Fiches d&apos;exercices terminées</dt>
          <dd>{work.sheetsDone}</dd>
          <small>sur {plural(work.sheets.length, "fiche commencée")}</small>
        </div>
        <div>
          <dt>Exercices réussis</dt>
          <dd>{work.exercisesValidated}</dd>
          <small>
            {work.classExercises?.median != null
              ? `médiane de la classe : ${num(work.classExercises.median)}`
              : work.exercisesTried
                ? `${work.exercisesTried} essayé${work.exercisesTried > 1 ? "s" : ""} sans réussite`
                : "aucun essai en suspens"}
          </small>
        </div>
        <div>
          <dt>Défis du lundi réussis</dt>
          <dd>{detail.challengesPassed}</dd>
          <small>sur {plural(detail.challengesTried, "défi tenté")}</small>
        </div>
      </dl>

      <section className={styles.section}>
        <h3>Place dans la classe {card.student.classe ? `(${card.student.classe})` : ""}</h3>
        <p className="admin-muted">{standingSentence(card.average, detail.classMedian)}</p>
        <PositionGauge detail={detail} />
      </section>

      <section className={styles.section}>
        <h3>Évaluations</h3>
        {card.evaluations.length ? (
          <div className="admin-table-wrap is-flat">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Évaluation</th>
                  <th className="admin-num">Note</th>
                  <th className="admin-num">Moyenne classe</th>
                  <th className="admin-num">Médiane classe</th>
                  <th>Situation</th>
                </tr>
              </thead>
              <tbody>
                {card.evaluations.map((item) => (
                  <tr key={item.attemptId}>
                    <td>
                      <b className="admin-strong">{item.title}</b>
                      {item.submittedAt ? <small className="admin-subtle">{dayFormat.format(new Date(item.submittedAt))}</small> : null}
                    </td>
                    <td className="admin-num">
                      {item.grade !== null ? (
                        <b className={`admin-note${item.grade < 10 ? " is-low" : ""}`}>{num(item.grade)}</b>
                      ) : (
                        <span className="admin-note is-wait">{item.handedIn ? "à corriger" : "en cours"}</span>
                      )}
                    </td>
                    <td className="admin-num">{item.stats.mean !== null ? num(item.stats.mean) : "—"}</td>
                    <td className="admin-num">{item.stats.median !== null ? num(item.stats.median) : "—"}</td>
                    <td className="admin-muted">
                      {item.grade !== null && item.stats.count >= 2 && item.stats.median !== null ? gapLabel(item.grade - item.stats.median, "médiane") : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-muted">Aucune évaluation passée pour le moment.</p>
        )}
      </section>

      <section className={styles.section}>
        <h3>Fiches d&apos;exercices</h3>
        <p className="admin-muted">
          {work.sheets.length
            ? `${plural(work.sheets.length, "fiche commencée")}, ${plural(work.sheetsDone, "terminée")}, ${plural(work.exercisesValidated, "exercice réussi")}.`
            : "Aucune fiche d'exercices commencée pour le moment."}
          {work.levelSheets ? ` Fiches du niveau pas encore ouvertes : ${work.levelNotStarted} sur ${work.levelSheets}.` : ""}
        </p>
        {work.classExercises ? <ExercisesGauge standing={work.classExercises} /> : null}
        {work.sheets.length ? (
          <div className="admin-table-wrap is-flat">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Fiche</th>
                  <th>Exercices réussis</th>
                  <th className="admin-num">Moyenne classe</th>
                  <th className="admin-num">Médiane classe</th>
                  <th>Situation</th>
                  <th className="admin-num">Essayés</th>
                  <th>Dernière activité</th>
                  <th>État</th>
                </tr>
              </thead>
              <tbody>
                {work.sheets.map((sheet) => {
                  const [label, tone] = STATUS[sheet.status];
                  const mates = sheet.classStats;
                  return (
                    <tr key={sheet.courseId}>
                      <td>
                        <b className="admin-strong">{sheet.title}</b>
                        <small className="admin-subtle">{sheet.chapter}</small>
                      </td>
                      <td>
                        <span className="admin-avg">
                          <b>
                            {sheet.validated}/{sheet.total}
                          </b>
                          <span className="admin-meter" aria-hidden>
                            <i style={{ width: `${sheet.total ? (sheet.validated / sheet.total) * 100 : 0}%` }} />
                          </span>
                        </span>
                      </td>
                      <td className="admin-num">{mates?.mean != null ? num(mates.mean) : "—"}</td>
                      <td className="admin-num">{mates?.median != null ? num(mates.median) : "—"}</td>
                      <td className="admin-muted">
                        {mates?.median != null ? gapLabel(sheet.validated - mates.median, "médiane") : "—"}
                        {mates ? <small className="admin-subtle">{plural(mates.started, "élève")} sur {mates.count} l&apos;ont commencée</small> : null}
                      </td>
                      <td className="admin-num">{sheet.tried || "—"}</td>
                      <td>{sheet.lastAt ? dayFormat.format(new Date(sheet.lastAt)) : "—"}</td>
                      <td>
                        <span className={`admin-pill ${tone}`}>{label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>
    </div>
  );
}

/**
 * Bilan d'un élève pour la réunion parents-professeur : moyenne et place dans la classe, chaque évaluation située
 * par rapport à la classe, et le travail fait fiche par fiche. Imprimable tel quel.
 */
export function ParentReportModal({ studentId, onClose }: { studentId: string; onClose: () => void }) {
  const [report, setReport] = useState<ParentReport | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    setReport(undefined);
    getParentReport(studentId)
      .then((value) => alive && setReport(value))
      .catch(() => alive && setReport(null));
    return () => {
      alive = false;
    };
  }, [studentId]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const now = new Date();
  const card = report?.detail.card;

  // Rendue dans <body> : la page est dans un conteneur animé qui ferait passer l'en-tête du site devant la fenêtre.
  return createPortal(
    <div id="parent-report" className={`${styles.modal} parent-print`} role="dialog" aria-modal="true" aria-labelledby="parent-report-title">
      <button type="button" className={`${styles.backdrop} parent-print-hide`} aria-label="Fermer" onClick={onClose} />
      <div className={`${styles.panel} parent-print-panel`}>
        <header className={styles.panelHead}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={levelFox(card?.student.level ?? null)} alt="" width={56} height={56} className={styles.fox} />
          <div className="min-w-0">
            <p className={styles.kicker}>Réunion parents-professeur</p>
            <h2 id="parent-report-title">{card ? card.student.name : "Chargement"}</h2>
            {card ? (
              <p>
                {card.student.classe || "Sans classe"} · dernière activité : {lastActivityLabel(card.lastWorkAt, now)} · bilan du {dayFormat.format(now)}
              </p>
            ) : null}
          </div>
          <button type="button" className={`${styles.ghost} parent-print-hide`} onClick={() => window.print()} disabled={!report}>
            <Printer size={14} aria-hidden /> Imprimer
          </button>
          <Link href={`/admin/eleves/${studentId}`} className={`${styles.ghost} parent-print-hide`}>
            Fiche complète <ArrowUpRight size={14} aria-hidden />
          </Link>
          <button type="button" className={`${styles.icon} parent-print-hide`} onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </header>

        {report === undefined ? (
          <p className={styles.loading}>
            <Loader2 size={18} className="animate-spin" aria-hidden /> Préparation du bilan
          </p>
        ) : !report ? (
          <p className={styles.loading}>Le bilan de cet élève n&apos;a pas pu être chargé.</p>
        ) : (
          <ParentReportBody report={report} />
        )}
      </div>
    </div>,
    document.body,
  );
}
