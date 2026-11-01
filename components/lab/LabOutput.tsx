"use client";

import { Check, Loader2, Play, RotateCw, X } from "lucide-react";
import type { LabExercise } from "@/app/actions/getExercises";
import { CHECK_UNAVAILABLE, type RunReport } from "@/lib/python-check";
import { RunResultPanel } from "@/components/lab/RunResultPanel";
import { ErrorHelpBox } from "@/components/lab/ErrorHelpBox";
import { explainPythonError } from "@/lib/python-error-help";

type SqlResults = { columns: string[]; values: any[][] } | null;

export type ConsoleState = {
  tone: "idle" | "ok" | "error";
  text: string;
  detail?: string;
};

type Props = {
  exercise: LabExercise;
  tab: "console" | "tests";
  onTab: (tab: "console" | "tests") => void;
  onClear: () => void;
  onRetryTest: () => void;
  consoleState: ConsoleState;
  sqlResults: SqlResults;
  report: RunReport | null;
  statusLine: string | null;
  /** Code de l'élève : sert à pointer la ligne fautive et à repérer les fautes de frappe. */
  code: string;
};

/**
 * Un seul panneau de résultat : ce que le programme affiche après « Exécuter »,
 * la liste des tests après « Vérifier ». Le petit sélecteur n'apparaît que si les deux existent.
 */
export function LabOutput({ exercise, tab, onTab, onClear, onRetryTest, consoleState, sqlResults, report, statusLine, code }: Props) {
  const ran = consoleState.tone !== "idle" || sqlResults !== null;
  const both = exercise.hasVerification && report !== null && ran;
  const view: "console" | "tests" = report && (tab === "tests" || !ran) ? "tests" : "console";
  const passed = report?.tests.filter((test) => test.ok).length ?? 0;
  const total = report?.tests.length ?? 0;

  if (statusLine) {
    return (
      <section className="exercise-result" aria-live="polite">
        <p className="exercise-result-status">
          <Loader2 size={15} className="animate-spin" aria-hidden />
          {statusLine}
        </p>
      </section>
    );
  }

  if (!ran && !report) {
    return (
      <section className="exercise-result is-idle">
        <p className="exercise-result-hint">
          <Play size={13} aria-hidden /> <b>Exécuter</b> montre ce que ton programme affiche.
          {exercise.hasVerification ? (
            <>
              {" "}
              <Check size={13} aria-hidden /> <b>Vérifier</b> lance les tests.
            </>
          ) : null}
        </p>
      </section>
    );
  }

  const unavailable = view === "tests" && report?.error === CHECK_UNAVAILABLE;
  const python = exercise.type !== "sql";
  const consoleHelp = python && consoleState.tone === "error" ? explainPythonError(consoleState.text, consoleState.detail, code) : null;

  return (
    <section className="exercise-result" aria-live="polite">
      <header className="exercise-result-head">
        {both ? (
          <div className="exercise-result-switch" role="tablist" aria-label="Résultat affiché">
            <button type="button" role="tab" aria-selected={view === "console"} onClick={() => onTab("console")}>
              Affichage
            </button>
            <button type="button" role="tab" aria-selected={view === "tests"} onClick={() => onTab("tests")}>
              Tests {total > 0 ? `${passed}/${total}` : ""}
            </button>
          </div>
        ) : (
          <span className="exercise-result-title">{view === "tests" ? "Vérification" : "Affichage du programme"}</span>
        )}
        <button type="button" className="exercise-result-close" onClick={onClear} aria-label="Effacer le résultat" title="Effacer le résultat">
          <X size={15} />
        </button>
      </header>

      <div className="exercise-result-body">
        {view === "tests" && report ? (
          unavailable ? (
            <div className="exercise-result-oops">
              <p>
                <b>La vérification n'a pas pu se lancer.</b> Ton code n'est pas en cause : réessaie dans un instant.
              </p>
              <button type="button" onClick={onRetryTest}>
                <RotateCw size={14} aria-hidden /> Réessayer
              </button>
            </div>
          ) : (
            <RunResultPanel report={report} code={python ? code : undefined} />
          )
        ) : (
          <>
            <pre className={`exercise-console is-${consoleState.tone}`}>{consoleState.text}</pre>
            {consoleHelp ? <ErrorHelpBox help={consoleHelp} /> : null}
            {consoleState.detail ? (
              <details className="exercise-console-detail">
                <summary>Détail technique</summary>
                <pre>{consoleState.detail}</pre>
              </details>
            ) : null}
            {exercise.type === "sql" && sqlResults ? (
              <div className="exercise-sql">
                <div className="exercise-sql-scroll">
                  <table>
                    <thead>
                      <tr>
                        {sqlResults.columns.map((col, idx) => <th key={idx}>{col}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {sqlResults.values.map((row, rIdx) => (
                        <tr key={rIdx}>
                          {row.map((cell: any, cIdx: number) => <td key={cIdx}>{String(cell)}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </section>
  );
}
