import { Check, X } from "lucide-react";
import type { RunReport, RunTest } from "@/lib/python-check";

function ratioText(passed: number, total: number) {
  const noun = total > 1 ? "tests réussis" : "test réussi";
  return `${passed}/${total} ${noun}`;
}

function displayLabel(test: RunTest) {
  if (!test.ok) return test.label;
  const defined = test.label
    .replace(/n['’]est pas définie/gi, "est définie")
    .replace(/n['’]est pas défini/gi, "est défini");
  if (defined !== test.label) return defined;
  return test.label;
}

function valueLabels(test: RunTest) {
  if (test.printCompare && (test.op === "in" || test.op === "not in")) {
    return { expected: "Texte attendu", actual: "Affichage obtenu" };
  }
  if (test.printCompare) {
    return { expected: "Affichage attendu", actual: "Affichage obtenu" };
  }
  return { expected: "Attendu", actual: "Obtenu" };
}

function usable(value: string | undefined) {
  return value !== undefined && value.length > 0 && value.length <= 180;
}

function TestCard({ test, index }: { test: RunTest; index: number }) {
  const labels = valueLabels(test);
  const showValues = !test.ok && usable(test.expected) && usable(test.actual) && (test.actual !== test.expected || test.printCompare);
  return (
    <li className={test.ok ? "exercise-test-card is-ok" : "exercise-test-card is-bad"}>
      <p className="exercise-test-name">Test {index + 1} : {displayLabel(test)}</p>
      <p className="exercise-test-state">
        {test.ok ? <Check size={15} aria-hidden /> : <X size={15} aria-hidden />}
        {test.ok ? "Réussi" : "Échec"}
      </p>
      {test.detail && test.detail.trim() !== test.label.trim() ? (
        <p className="exercise-test-detail">{test.detail}</p>
      ) : null}
      {showValues ? (
        <div className="exercise-values">
          {test.expected !== undefined ? (
            <div>
              <p>{labels.expected}</p>
              <pre>{test.expected || "∅"}</pre>
            </div>
          ) : null}
          {test.actual !== undefined ? (
            <div>
              <p>{labels.actual}</p>
              <pre>{test.actual || "∅"}</pre>
            </div>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

function joinedPrints(report: RunReport) {
  const prints = report.prints.replace(/\s+$/g, "");
  const testPrints = report.testPrints.replace(/\s+$/g, "");
  const parts = [prints];
  if (testPrints && testPrints !== prints) parts.push(testPrints);
  return parts.filter(Boolean).join("\n\n");
}

export function RunResultPanel({ report }: { report: RunReport }) {
  const passed = report.tests.filter((test) => test.ok).length;
  const total = report.tests.length;
  const allOk = report.status === "success" && total > 0 && passed === total;
  const summaryClass = allOk ? "is-ok" : total > 0 ? "is-bad" : "is-warn";
  const summary = total > 0
    ? ratioText(passed, total)
    : (report.error || "Les tests n’ont pas été lancés.");
  const prints = joinedPrints(report);

  return (
    <div id="exercice-resultat" className="exercise-test-panel" role="status" aria-live="polite">
      <p className={`exercise-test-summary ${summaryClass}`}>
        {allOk ? <Check size={16} aria-hidden /> : <X size={16} aria-hidden />}
        <span>{summary}</span>
      </p>
      {report.validationNote ? <p className="exercise-validation-note">{report.validationNote}</p> : null}
      {total > 0 && report.error ? <p className="exercise-test-detail">{report.error}</p> : null}
      {total > 0 ? (
        <ul className="exercise-test-row">
          {report.tests.map((test, index) => <TestCard key={`${test.label}-${index}`} test={test} index={index} />)}
        </ul>
      ) : null}
      {report.validationNote && prints ? (
        <div className="exercise-test-prints">
          <p>Affichage</p>
          <pre>{prints}</pre>
        </div>
      ) : null}
      {report.saveWarning ? <p className="exercise-save-warning">{report.saveWarning}</p> : null}
    </div>
  );
}
