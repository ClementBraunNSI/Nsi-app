"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, FileDown, Loader2, LockOpen, RotateCcw, ShieldCheck, Trash2, Wand2, X } from "lucide-react";
import {
  getAttemptDetail,
  gradeEvaluationAnswer,
  reopenAttempt,
  reopenAttemptGrade,
  validateAttemptGrade,
  resetAttempt,
  unlockAttemptRemotely,
  type AttemptDetail,
} from "@/app/actions/evaluations";
import { INCIDENT_LABELS } from "@/lib/evaluation-guard";
import { formatGrade } from "@/lib/evaluation-grade";
import { ExerciseGradeBox } from "./ExerciseGradeBox";

const timeFormat = new Intl.DateTimeFormat("fr-FR", { timeStyle: "medium", timeZone: "Europe/Paris" });

export default function AttemptPanel({
  attemptId,
  evaluationId,
  onClose,
  onChange,
  order = [],
  onNavigate,
}: {
  attemptId: string;
  evaluationId: string;
  onClose: () => void;
  onChange: () => Promise<void>;
  /** Copies rendues, dans l'ordre du tableau : pour passer d'une copie à l'autre pendant la vérification. */
  order?: string[];
  onNavigate?: (attemptId: string) => void;
}) {
  const [detail, setDetail] = useState<AttemptDetail | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [zoom, setZoom] = useState<string | null>(null);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const position = order.indexOf(attemptId);
  const previous = position > 0 ? order[position - 1] : null;
  const next = position >= 0 && position < order.length - 1 ? order[position + 1] : null;

  // Nouvelle copie affichée : on repart de son contenu, pas de celui de la précédente.
  useEffect(() => {
    setDetail(null);
    setGradeError(null);
  }, [attemptId]);

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
          {position >= 0 && onNavigate ? (
            <div className="adm-copy-nav">
              <button type="button" className="adm-eval-icon" disabled={!previous} onClick={() => previous && onNavigate(previous)} aria-label="Copie précédente">
                <ChevronLeft size={18} />
              </button>
              <span>Copie {position + 1} / {order.length}</span>
              <button type="button" className="adm-eval-icon" disabled={!next} onClick={() => next && onNavigate(next)} aria-label="Copie suivante">
                <ChevronRight size={18} />
              </button>
            </div>
          ) : null}
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

            <section className={`adm-grade-total ${detail.grade.final ? "is-final" : ""}`}>
              <b>{formatGrade(detail.grade.total)}</b>
              <span>
                {detail.grade.final
                  ? "Note validée : chaque exercice a été relu."
                  : `Note à valider : ${[
                      detail.grade.pendingReview
                        ? `${detail.grade.pendingReview} exercice${detail.grade.pendingReview > 1 ? "s" : ""} signalé${detail.grade.pendingReview > 1 ? "s" : ""}`
                        : "",
                      detail.grade.ungraded ? `${detail.grade.ungraded} pas encore corrigé${detail.grade.ungraded > 1 ? "s" : ""}` : "",
                      `${detail.grade.toValidate} exercice${detail.grade.toValidate > 1 ? "s" : ""} à relire`,
                    ]
                      .filter(Boolean)
                      .join(", ")}. Ajuster les points d'un exercice si la note automatique est trop généreuse ou trop sévère.`}
              </span>
              {detail.status === "rendue" ? (
                <div className="adm-grade-copy-actions">
                  {detail.grade.final ? (
                    <button type="button" className="adm-eval-link" disabled={busy !== null} onClick={() => run("reopen-grade", () => reopenAttemptGrade(attemptId))}>
                      <RotateCcw size={14} aria-hidden /> Rouvrir la vérification
                    </button>
                  ) : (
                    <>
                      {([false, true] as const).map((andNext) =>
                        andNext && !next ? null : (
                          <button
                            key={String(andNext)}
                            type="button"
                            className={andNext ? "adm-eval-primary" : "adm-eval-secondary"}
                            disabled={busy !== null || detail.grade.ungraded > 0}
                            title={detail.grade.ungraded > 0 ? "Attendre la fin de la correction automatique" : undefined}
                            onClick={async () => {
                              if (detail.grade.pendingReview > 0 && !window.confirm(`${detail.grade.pendingReview} exercice(s) signalé(s) : garder leur note automatique ?`)) return;
                              setGradeError(null);
                              setBusy("validate");
                              const result = await validateAttemptGrade(attemptId);
                              setBusy(null);
                              if (!result.ok) {
                                setGradeError(result.error);
                                return;
                              }
                              await onChange();
                              if (andNext && next && onNavigate) onNavigate(next);
                              else await load();
                            }}
                          >
                            <ShieldCheck size={15} aria-hidden /> {andNext ? "Valider et passer à la suivante" : `Valider la copie (${formatGrade(detail.grade.total)})`}
                          </button>
                        ),
                      )}
                    </>
                  )}
                </div>
              ) : null}
              {gradeError ? <p className="adm-eval-error">{gradeError}</p> : null}
            </section>

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
              const grade = detail.grade.exercises.find((item) => item.id === exercise.id);
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
                  {grade ? (
                    <ExerciseGradeBox
                      key={`${grade.id}-${grade.reviewed}-${grade.manual}-${grade.points}`}
                      attemptId={attemptId}
                      grade={grade}
                      onSaved={async () => {
                        await load();
                        await onChange();
                      }}
                    />
                  ) : null}
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
