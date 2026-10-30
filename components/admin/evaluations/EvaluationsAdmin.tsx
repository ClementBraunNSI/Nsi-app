"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Plus } from "lucide-react";
import { createEvaluation, type EvaluationSummary } from "@/app/actions/evaluations";
import EvaluationForm, { type EvaluationFormValues } from "./EvaluationForm";

export const STATUS_LABELS: Record<EvaluationSummary["status"], string> = {
  brouillon: "Brouillon",
  ouverte: "Ouverte",
  fermee: "Fermée",
};

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeZone: "Europe/Paris" });

export default function EvaluationsAdmin({ evaluations, classes }: { evaluations: EvaluationSummary[]; classes: string[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (values: EvaluationFormValues) => {
    setBusy(true);
    setError(null);
    const result = await createEvaluation(values);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/admin/evaluations/${result.id}?onglet=sujets`);
  };

  return (
    <div className="space-y-6">
      {creating ? (
        <section className="adm-eval-panel">
          <h2>Nouvelle évaluation</h2>
          <EvaluationForm classes={classes} busy={busy} submitLabel="Créer et ajouter les sujets" onSubmit={create} onCancel={() => setCreating(false)} />
          {error ? <p className="adm-eval-error">{error}</p> : null}
        </section>
      ) : (
        <button type="button" className="adm-eval-primary" onClick={() => setCreating(true)}>
          <Plus size={16} aria-hidden /> Nouvelle évaluation
        </button>
      )}

      {evaluations.length === 0 ? (
        <p className="text-sm text-slate-500">Aucune évaluation pour le moment.</p>
      ) : (
        <ul className="adm-eval-list">
          {evaluations.map((evaluation) => (
            <li key={evaluation.id}>
              <Link href={`/admin/evaluations/${evaluation.id}`} className="adm-eval-row">
                <span className={`adm-eval-status is-${evaluation.status}`}>{STATUS_LABELS[evaluation.status]}</span>
                <span className="min-w-0">
                  <b>{evaluation.title}</b>
                  <small>
                    {evaluation.classes.join(", ") || "Aucune classe"} · {evaluation.subjects} sujet{evaluation.subjects > 1 ? "s" : ""} ·{" "}
                    {evaluation.durationMinutes ? `${evaluation.durationMinutes} min` : "sans limite"} · créée le {dateFormat.format(new Date(evaluation.createdAt))}
                  </small>
                </span>
                <span className="adm-eval-counts">
                  {evaluation.locked > 0 ? (
                    <span className="adm-eval-alert"><Lock size={13} aria-hidden /> {evaluation.locked} verrouillée{evaluation.locked > 1 ? "s" : ""}</span>
                  ) : null}
                  <span>{evaluation.submitted} / {evaluation.attempts} rendue{evaluation.submitted > 1 ? "s" : ""}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {busy ? <Loader2 className="animate-spin text-slate-400" size={18} aria-hidden /> : null}
    </div>
  );
}
