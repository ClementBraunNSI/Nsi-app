"use client";

import type { LabExercise } from "@/app/actions/getExercises";
import type { RunReport } from "@/lib/python-check";
import { RunResultPanel } from "@/components/lab/RunResultPanel";

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
  consoleState: ConsoleState;
  sqlResults: SqlResults;
  report: RunReport | null;
  statusLine: string | null;
};

export function LabOutput({ exercise, tab, onTab, onClear, consoleState, sqlResults, report, statusLine }: Props) {
  const passed = report?.tests.filter((test) => test.ok).length ?? 0;
  const total = report?.tests.length ?? 0;
  const count = total > 0 ? ` (${passed}/${total})` : "";

  return (
    <div className="exercise-output">
      <div className="exercise-output-bar" role="tablist" aria-label="Résultat de l’exécution">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "console"}
          className={tab === "console" ? "is-active" : ""}
          onClick={() => onTab("console")}
        >
          Console
        </button>
        {exercise.hasVerification ? (
          <button
            type="button"
            role="tab"
            aria-selected={tab === "tests"}
            className={tab === "tests" ? "is-active" : ""}
            onClick={() => onTab("tests")}
          >
            Résultats des tests{count}
          </button>
        ) : null}
        <button type="button" className="exercise-clear" onClick={onClear}>
          Effacer
        </button>
      </div>
      <div className="exercise-output-body" role="tabpanel">
        {tab === "tests" && exercise.hasVerification ? (
          statusLine && !report ? (
            <p className="exercise-console is-idle">{statusLine}</p>
          ) : report ? (
            <RunResultPanel report={report} />
          ) : (
            <p className="exercise-console is-idle">Lance « Tester ma solution » pour afficher les tests.</p>
          )
        ) : (
          <>
            {statusLine ? <p className="exercise-console is-idle">{statusLine}</p> : null}
            {!statusLine ? (
              <pre className={`exercise-console is-${consoleState.tone}`}>{consoleState.text}</pre>
            ) : null}
            {consoleState.detail && !statusLine ? (
              <details className="exercise-console-detail">
                <summary>Détail technique</summary>
                <pre>{consoleState.detail}</pre>
              </details>
            ) : null}
            {exercise.type === "sql" && sqlResults ? (
              <div className="exercise-sql">
                <p>Résultat de la requête</p>
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
    </div>
  );
}
