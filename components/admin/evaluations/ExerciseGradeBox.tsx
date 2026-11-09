"use client";

import { useState } from "react";
import { AlertTriangle, Check, Loader2, RotateCcw } from "lucide-react";
import { reviewEvaluationAnswer } from "@/app/actions/evaluations";
import type { ExerciseGrade } from "@/lib/evaluation-grade";

const points = (value: number) => String(value).replace(".", ",");

/**
 * Note d'un exercice dans le panneau d'une copie : points obtenus sur le barème, raisons d'une vérification,
 * et la décision de l'enseignant (garder la note automatique ou donner des points à la main).
 */
export function ExerciseGradeBox({ attemptId, grade, onSaved }: { attemptId: string; grade: ExerciseGrade; onSaved: () => Promise<void> }) {
  const [value, setValue] = useState(grade.manual ? String(grade.points) : "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async (manual: number | null, undo = false) => {
    setBusy(true);
    setError(null);
    const result = await reviewEvaluationAnswer(attemptId, grade.id, manual, undo);
    setBusy(false);
    if (!result.ok) setError(result.error);
    else await onSaved();
  };

  const typed = value.trim() === "" ? null : Number(value.replace(",", "."));
  const typedValid = typed !== null && typed >= 0 && typed <= grade.max;
  const status = !grade.written
    ? "Rien d'écrit : 0 point."
    : !grade.graded
      ? "Pas encore passé aux tests."
      : `${grade.testsPassed} / ${grade.testsTotal} tests réussis : ${points(grade.auto)} point${grade.auto > 1 ? "s" : ""} automatique${grade.auto > 1 ? "s" : ""}.`;

  return (
    <div className={`adm-grade-box ${grade.needsReview && !grade.reviewed ? "is-review" : grade.reviewed ? "is-reviewed" : grade.written ? "is-pending" : ""}`}>
      <div className="adm-grade-line">
        <b>
          {points(grade.points)} / {points(grade.max)}
        </b>
        <span>{status}</span>
        {grade.manual ? <span className="adm-grade-tag">points donnés à la main</span> : null}
        {grade.reviewed && !grade.manual ? <span className="adm-grade-tag">note automatique gardée</span> : null}
        {grade.written && !grade.reviewed ? <span className="adm-grade-tag is-todo">à valider</span> : null}
      </div>

      {grade.needsReview && !grade.reviewed ? (
        <p className="adm-grade-reasons">
          <AlertTriangle size={14} aria-hidden /> À vérifier : {grade.reasons.join(" ; ")}.
        </p>
      ) : null}

      {grade.written ? (
        <div className="adm-grade-actions">
          <label>
            <span className="sr-only">Points donnés à la main</span>
            <input
              type="number"
              min={0}
              max={grade.max}
              step={0.25}
              value={value}
              placeholder={`0 à ${points(grade.max)}`}
              onChange={(event) => setValue(event.target.value)}
            />
          </label>
          <button type="button" className="adm-eval-primary" disabled={busy || !typedValid} onClick={() => save(typed)}>
            {busy ? <Loader2 size={14} className="animate-spin" aria-hidden /> : <Check size={14} aria-hidden />} Donner ces points
          </button>
          {!grade.reviewed ? (
            <button type="button" className="adm-eval-secondary" disabled={busy || !grade.graded} onClick={() => save(null)}>
              Garder la note automatique ({points(grade.auto)})
            </button>
          ) : null}
          {grade.reviewed ? (
            <button
              type="button"
              className="adm-eval-link"
              disabled={busy}
              onClick={() => {
                setValue("");
                void save(null, true);
              }}
            >
              <RotateCcw size={13} aria-hidden /> Revenir à la note automatique
            </button>
          ) : null}
        </div>
      ) : null}
      {error ? <p className="adm-eval-error">{error}</p> : null}
    </div>
  );
}
