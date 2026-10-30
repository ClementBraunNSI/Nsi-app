"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, FileDown, Loader2, LockOpen, RotateCcw, Trash2, Wand2, X } from "lucide-react";
import {
  getAttemptDetail,
  gradeEvaluationAnswer,
  reopenAttempt,
  resetAttempt,
  unlockAttemptRemotely,
  type AttemptDetail,
} from "@/app/actions/evaluations";
import { INCIDENT_LABELS } from "@/lib/evaluation-guard";

const timeFormat = new Intl.DateTimeFormat("fr-FR", { timeStyle: "medium", timeZone: "Europe/Paris" });

export default function AttemptPanel({
  attemptId,
  evaluationId,
  onClose,
  onChange,
}: {
  attemptId: string;
  evaluationId: string;
  onClose: () => void;
  onChange: () => Promise<void>;
}) {
  const [detail, setDetail] = useState<AttemptDetail | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);

  const load = useCallback(async () => setDetail(await getAttemptDetail(attemptId)), [attemptId]);

  useEffect(() => {
    void load();
    const timer = window.setInterval(load, 6000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") (zoom ? setZoom(null) : onClose());
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, zoom]);

  const run = async (key: string, action: () => Promise<unknown>) => {
    setBusy(key);
    await action();
    setBusy(null);
    await load();
    await onChange();
  };

  return (
    <div className="adm-eval-drawer" role="dialog" aria-modal="true" aria-label="Copie de l'élève">
      <button type="button" className="adm-eval-drawer-backdrop" aria-label="Fermer" onClick={onClose} />
      <aside className="adm-eval-drawer-panel">
        <header>
          <div className="min-w-0">
            <h2>{detail?.name ?? "Copie"}</h2>
            {detail ? (
              <p>
                {detail.classe} · {detail.subjectLabel} · code <b className="adm-eval-code">{detail.unlockCode}</b> ·{" "}
                {detail.status === "rendue" ? "rendue" : detail.locked ? "verrouillée" : "en cours"}
              </p>
            ) : null}
          </div>
          <button type="button" className="adm-eval-icon" onClick={onClose} aria-label="Fermer"><X size={18} /></button>
        </header>

        {!detail ? (
          <Loader2 className="animate-spin text-slate-400" aria-hidden />
        ) : (
          <div className="space-y-6">
            <div className="adm-eval-actions is-start">
              {detail.locked && detail.status !== "rendue" ? (
                <button type="button" className="adm-eval-primary" disabled={busy !== null} onClick={() => run("unlock", () => unlockAttemptRemotely(attemptId))}>
                  <LockOpen size={15} aria-hidden /> Déverrouiller à distance
                </button>
              ) : null}
              <a className="adm-eval-secondary" href={`/admin/evaluations/${evaluationId}/export?copie=${attemptId}`}>
                <FileDown size={15} aria-hidden /> Copie (.txt)
              </a>
              {detail.status === "rendue" ? (
                <button type="button" className="adm-eval-secondary" disabled={busy !== null} onClick={() => run("reopen", () => reopenAttempt(attemptId))}>
                  <RotateCcw size={15} aria-hidden /> Rouvrir la copie
                </button>
              ) : null}
              <button
                type="button"
                className="adm-eval-danger"
                disabled={busy !== null}
                onClick={() => {
                  if (!window.confirm("Effacer cette copie ? L'élève recommencera avec un nouveau sujet tiré au hasard.")) return;
                  void run("reset", async () => {
                    await resetAttempt(attemptId);
                    onClose();
                  });
                }}
              >
                <Trash2 size={15} aria-hidden /> Effacer la copie
              </button>
            </div>

            <section>
              <h3>Incidents ({detail.incidents.length})</h3>
              {detail.incidents.length === 0 ? <p className="text-sm text-slate-500">Aucun incident.</p> : null}
              <ol className="adm-eval-incidents">
                {detail.incidents.map((incident) => (
                  <li key={incident.id} className={incident.locks ? "is-lock" : ""}>
                    <p>
                      <b>{INCIDENT_LABELS[incident.kind] ?? incident.kind}</b>
                      <span>{timeFormat.format(new Date(incident.createdAt))}</span>
                      {incident.locks ? <span className={incident.resolvedAt ? "is-resolved" : "is-open"}>{incident.resolvedAt ? "débloqué" : "en attente"}</span> : null}
                    </p>
                    {incident.detail ? <pre>{incident.detail}</pre> : null}
                    {incident.screenshot ? (
                      <button type="button" className="adm-eval-shot" onClick={() => setZoom(incident.screenshot)}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={incident.screenshot} alt={`Écran de l'élève : ${INCIDENT_LABELS[incident.kind] ?? incident.kind}`} />
                      </button>
                    ) : incident.locks ? <small className="text-slate-500">Pas de capture (partage d&apos;écran indisponible).</small> : null}
                  </li>
                ))}
              </ol>
            </section>

            {detail.exercises.map((exercise, index) => {
              const answer = detail.answers[exercise.id];
              const report = answer?.report;
              return (
                <section key={exercise.id} className="adm-eval-answer">
                  <div className="adm-eval-answer-head">
                    <h3>{index + 1}. {exercise.label}</h3>
                    {answer?.gradedAt ? (
                      <span className={answer.passed ? "adm-eval-pass" : "adm-eval-fail"}>
                        {answer.passed ? <Check size={14} aria-hidden /> : <X size={14} aria-hidden />} {answer.testsPassed ?? 0} / {answer.testsTotal ?? 0} tests
                      </span>
                    ) : null}
                    {exercise.hasTests && answer?.code?.trim() ? (
                      <button
                        type="button"
                        className="adm-eval-link"
                        disabled={busy !== null}
                        onClick={() => run(`grade-${exercise.id}`, () => gradeEvaluationAnswer(attemptId, exercise.id))}
                      >
                        {busy === `grade-${exercise.id}` ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Wand2 size={14} aria-hidden />} Corriger
                      </button>
                    ) : null}
                  </div>
                  <pre className="adm-eval-code-block">{answer?.code?.trim() ? answer.code : "(aucun code écrit)"}</pre>
                  {report?.tests?.length ? (
                    <ul className="adm-eval-tests">
                      {report.tests.map((test, testIndex) => (
                        <li key={testIndex} className={test.ok ? "is-ok" : "is-ko"}>
                          {test.ok ? "✓" : "✗"} {test.label || test.source || `Test ${testIndex + 1}`}
                          {!test.ok && (test.detail || test.actual !== undefined) ? (
                            <small> — {test.detail || `obtenu ${test.actual}${test.expected !== undefined ? `, attendu ${test.expected}` : ""}`}</small>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  ) : report?.error ? <p className="adm-eval-error">{report.error}</p> : null}
                  <details>
                    <summary>Énoncé et correction</summary>
                    <pre className="adm-eval-statement">{exercise.statement}</pre>
                    {exercise.correction ? <pre className="adm-eval-code-block">{exercise.correction}</pre> : null}
                  </details>
                </section>
              );
            })}
          </div>
        )}
      </aside>

      {zoom ? (
        <button type="button" className="adm-eval-zoom" onClick={() => setZoom(null)} aria-label="Fermer la capture">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={zoom} alt="Capture de l'écran de l'élève" />
        </button>
      ) : null}
    </div>
  );
}
