"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AlertTriangle, FileDown, Loader2, ShieldCheck, X } from "lucide-react";
import { getEvaluationSummary, type EvaluationSummaryPage } from "@/app/actions/evaluations";
import type { EvaluationSummary } from "@/lib/evaluation-summary";

const num = (value: number) => String(Math.round(value * 100) / 100).replace(".", ",");
const percent = (value: number) => `${Math.round(value * 100)} %`;
const plural = (count: number, one: string, many: string) => `${count} ${count > 1 ? many : one}`;

/** Corps du bilan : séparé de la fenêtre pour être affiché avec des données déjà chargées. */
export function EvaluationSummaryView({ summary }: { summary: EvaluationSummary }) {
  const { grades } = summary;
  const peak = Math.max(1, ...(grades?.bins.map((bin) => bin.count) ?? []));
  const provisional = summary.validated < summary.handedIn || summary.ungraded > 0;

  if (summary.handedIn === 0) return <p className="adm-sum-empty">Aucune copie rendue : le bilan apparaîtra quand les copies seront ramassées.</p>;

  return (
    <div className="adm-sum-body">
      <p className="adm-sum-lead">
        {plural(summary.handedIn, "copie rendue", "copies rendues")} sur {plural(summary.students, "élève", "élèves")}
        {summary.missing ? ` · ${plural(summary.missing, "élève sans copie", "élèves sans copie")}` : ""} ·{" "}
        {summary.validated === summary.handedIn ? "toutes les notes sont validées" : `${plural(summary.validated, "note validée", "notes validées")} sur ${summary.handedIn}`}
      </p>
      {provisional ? (
        <p className="adm-sum-warn">
          <AlertTriangle size={15} aria-hidden />
          {summary.ungraded
            ? `Correction automatique en cours : ${plural(summary.ungraded, "exercice restant", "exercices restants")}. Le bilan se met à jour tout seul.`
            : "Bilan provisoire : il repose sur les notes automatiques des copies pas encore validées."}
        </p>
      ) : null}

      {grades ? (
        <section aria-labelledby="sum-grades">
          <h3 id="sum-grades">Notes</h3>
          <dl className="adm-sum-kpis">
            <div><dt>Moyenne</dt><dd>{num(grades.mean)}</dd></div>
            <div><dt>Médiane</dt><dd>{num(grades.median)}</dd></div>
            <div><dt>Q1 · Q3</dt><dd>{num(grades.q1)} · {num(grades.q3)}</dd></div>
            <div><dt>Plus basse · plus haute</dt><dd>{num(grades.min)} · {num(grades.max)}</dd></div>
            <div className={grades.below ? "is-alert" : ""}><dt>Sous 10</dt><dd>{grades.below} <small>sur {summary.handedIn}</small></dd></div>
          </dl>
          <div className="adm-sum-hist" role="img" aria-label={`Répartition des notes : ${grades.bins.map((bin) => `${bin.count} de ${bin.label}`).join(", ")}`}>
            {grades.bins.map((bin) => (
              <div key={bin.label} title={`${plural(bin.count, "copie", "copies")} de ${bin.label}`}>
                <b>{bin.count}</b>
                <i style={{ height: `${(bin.count / peak) * 100}%` }} />
                <span>{bin.label}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="sum-exercises">
        <h3 id="sum-exercises">
          Exercices <small>du moins réussi au mieux réussi</small>
        </h3>
        <ul className="adm-sum-exercises">
          {summary.exercises.map((exercise) => (
            <li key={exercise.key} className={exercise.rate < 0.5 ? "is-low" : ""}>
              <div className="adm-sum-ex-head">
                <b>
                  {exercise.label}
                  {summary.severalSubjects ? <small> · {exercise.subjectLabel}</small> : null}
                </b>
                <span>{percent(exercise.rate)}</span>
              </div>
              <div className="adm-sum-bar" aria-hidden>
                <i style={{ width: `${Math.round(Math.min(1, Math.max(0, exercise.rate)) * 100)}%` }} />
              </div>
              <p>
                Moyenne {num(exercise.mean)} / {num(exercise.max)} sur {plural(exercise.copies, "copie", "copies")}
                {exercise.blank ? ` · ${plural(exercise.blank, "copie sans réponse", "copies sans réponse")}` : ""}
                {exercise.zero - exercise.blank > 0 ? ` · ${exercise.zero - exercise.blank} à zéro malgré une réponse` : ""}
                {exercise.full ? ` · ${exercise.full} au maximum` : ""}
              </p>
              {exercise.functions.length ? (
                <p className="adm-sum-functions">
                  Aucun test réussi pour :{" "}
                  {exercise.functions.map((item, index) => (
                    <span key={item.name}>
                      {index ? ", " : ""}
                      <code>{item.name}</code> ({plural(item.copies, "copie", "copies")})
                    </span>
                  ))}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {summary.tests.length ? (
        <section aria-labelledby="sum-tests">
          <h3 id="sum-tests">
            Tests les plus ratés <small>parmi les copies qui ont répondu à l&apos;exercice</small>
          </h3>
          <ul className="adm-sum-tests">
            {summary.tests.map((test) => (
              <li key={test.key}>
                <span>
                  {test.label}
                  <small>
                    {test.exerciseLabel}
                    {summary.severalSubjects ? ` · ${test.subjectLabel}` : ""}
                  </small>
                </span>
                <b>
                  {test.failed} / {test.tried}
                </b>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {summary.notions.length ? (
        <section aria-labelledby="sum-notions">
          <h3 id="sum-notions">
            Notions à retravailler <small>nombre d&apos;élèves qui y perdent des points</small>
          </h3>
          <p className="adm-sum-chips">
            {summary.notions.map((item) => (
              <span key={item.notion}>
                {item.notion} <b>{item.students}</b>
              </span>
            ))}
          </p>
        </section>
      ) : null}

      {summary.struggling.length ? (
        <section aria-labelledby="sum-struggling">
          <h3 id="sum-struggling">
            Élèves à accompagner <small>note sous 8</small>
          </h3>
          <p className="adm-sum-chips">
            {summary.struggling.map((student) => (
              <Link key={student.studentId} href={`/admin/eleves/${student.studentId}`}>
                {student.name} <b>{num(student.total)}</b>
              </Link>
            ))}
          </p>
        </section>
      ) : null}
    </div>
  );
}

/**
 * Bilan d'une interrogation terminée, dans une fenêtre : s'ouvre à la fermeture de l'évaluation et depuis le bouton
 * « Bilan ». `refreshKey` change quand la correction automatique avance : le bilan se recharge.
 */
export default function EvaluationSummaryModal({
  evaluationId,
  title,
  refreshKey = 0,
  onClose,
  onReview,
}: {
  evaluationId: string;
  title: string;
  refreshKey?: number | string;
  onClose: () => void;
  /** Ouvre la relecture des copies (absent : toutes les notes sont validées). */
  onReview?: () => void;
}) {
  const [page, setPage] = useState<EvaluationSummaryPage | null | undefined>(undefined);
  // La fenêtre est rendue dans le body : au-dessus de l'en-tête du site, centrée sur l'écran et non sur la page.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const load = useCallback(async () => {
    try {
      setPage(await getEvaluationSummary(evaluationId));
    } catch {
      setPage(null);
    }
  }, [evaluationId]);

  useEffect(() => {
    void load();
  }, [load, refreshKey]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!mounted) return null;
  return createPortal(
    <div className="adm-sum" role="dialog" aria-modal="true" aria-labelledby="adm-sum-title">
      <button type="button" className="adm-sum-backdrop" aria-label="Fermer le bilan" onClick={onClose} />
      <div className="adm-sum-panel">
        <header>
          <div className="min-w-0">
            <p className="admin-kicker">Bilan de l&apos;interrogation</p>
            <h2 id="adm-sum-title">{title}</h2>
          </div>
          <button type="button" className="adm-eval-icon" onClick={onClose} aria-label="Fermer">
            <X size={18} />
          </button>
        </header>

        {page === undefined ? (
          <p className="adm-sum-empty" role="status">
            <Loader2 size={18} className="animate-spin" aria-hidden /> Calcul du bilan
          </p>
        ) : page === null ? (
          <p className="adm-sum-empty">Le bilan n&apos;a pas pu être chargé.</p>
        ) : (
          <EvaluationSummaryView summary={page.summary} />
        )}

        <footer>
          {onReview ? (
            <button type="button" className="adm-eval-primary" onClick={onReview}>
              <ShieldCheck size={15} aria-hidden /> Relire les copies une à une
            </button>
          ) : null}
          <a className="adm-eval-secondary" href={`/admin/evaluations/${evaluationId}/export?format=notes`}>
            <FileDown size={15} aria-hidden /> Notes (.csv)
          </a>
          <button type="button" className="adm-eval-secondary" onClick={onClose}>
            Fermer
          </button>
        </footer>
      </div>
    </div>,
    document.body,
  );
}
