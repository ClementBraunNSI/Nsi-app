import { Check, X } from "lucide-react";
import type { RunReport, RunTest } from "@/lib/python-check";

function displayLabel(test: RunTest) {
  if (!test.ok) return test.label;
  const defined = test.label
    .replace(/n['’]est pas définie/gi, "est définie")
    .replace(/n['’]est pas défini/gi, "est défini");
  return defined;
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

function FailedTest({ test, index }: { test: RunTest; index: number }) {
  const labels = valueLabels(test);
  const showValues = usable(test.expected) && usable(test.actual) && (test.actual !== test.expected || test.printCompare);
  return (
    <li className="exercise-test is-bad">
      <p className="exercise-test-name">
        <X size={14} aria-hidden />
        <span>
          <span className="exercise-test-index">Test {index + 1}</span> {displayLabel(test)}
        </span>
      </p>
      {test.detail && test.detail.trim() !== test.label.trim() ? <p className="exercise-test-detail">{test.detail}</p> : null}
      {showValues ? (
        <div className="exercise-values">
          <div>
            <p>{labels.expected}</p>
            <pre>{test.expected || "∅"}</pre>
          </div>
          <div>
            <p>{labels.actual}</p>
            <pre>{test.actual || "∅"}</pre>
          </div>
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

/** Tests ratés en premier et détaillés ; tests réussis réduits à une ligne. */
export function RunResultPanel({ report }: { report: RunReport }) {
  const indexed = report.tests.map((test, index) => ({ test, index }));
  const failed = indexed.filter(({ test }) => !test.ok);
  const passedTests = indexed.filter(({ test }) => test.ok);
  const total = report.tests.length;
  const allOk = report.status === "success" && total > 0 && failed.length === 0;
  const prints = joinedPrints(report);

  return (
    <div id="exercice-resultat" className="exercise-test-panel" role="status">
      <p className={`exercise-test-summary ${allOk ? "is-ok" : "is-bad"}`}>
        {allOk ? <Check size={16} aria-hidden /> : <X size={16} aria-hidden />}
        <span>
          {total > 0
            ? allOk
              ? `Bravo, ${total === 1 ? "le test passe" : `les ${total} tests passent`} !`
              : `${passedTests.length} test${passedTests.length > 1 ? "s" : ""} sur ${total} réussi${passedTests.length > 1 ? "s" : ""}`
            : report.error || "Les tests n'ont pas été lancés."}
        </span>
      </p>
      {report.validationNote ? <p className="exercise-validation-note">Aperçu enseignant : {report.validationNote.toLowerCase()}</p> : null}
      {total > 0 && report.error ? <p className="exercise-test-detail">{report.error}</p> : null}

      {failed.length > 0 ? (
        <ul className="exercise-test-list">
          {failed.map(({ test, index }) => (
            <FailedTest key={`${test.label}-${index}`} test={test} index={index} />
          ))}
        </ul>
      ) : null}

      {passedTests.length > 0 ? (
        <ul className="exercise-test-passed">
          {passedTests.map(({ test, index }) => (
            <li key={`${test.label}-${index}`}>
              <Check size={13} aria-hidden />
              <span className="exercise-test-index">Test {index + 1}</span> {displayLabel(test)}
            </li>
          ))}
        </ul>
      ) : null}

      {prints && (report.validationNote || failed.length > 0) ? (
        <details className="exercise-test-prints">
          <summary>Ce que ton programme a affiché</summary>
          <pre>{prints}</pre>
        </details>
      ) : null}
      {report.saveWarning ? <p className="exercise-save-warning">{report.saveWarning}</p> : null}
    </div>
  );
}
