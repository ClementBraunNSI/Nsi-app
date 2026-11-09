"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Plus } from "lucide-react";
import { createEvaluation, type EvaluationSummary } from "@/app/actions/evaluations";
import EvaluationForm, { type EvaluationFormValues } from "./EvaluationForm";

export const STATUS_LABELS: Record<EvaluationSummary["status"], string> = {
  brouillon: "Brouillon",
  programmee: "Programmée",
  ouverte: "Ouverte",
  fermee: "Fermée",
};

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeZone: "Europe/Paris" });
/** « mar. 10 nov. à 09:00 », à l'heure de Paris. */
export function scheduleLabel(iso: string) {
  const date = new Date(iso);
  const day = new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "Europe/Paris" }).format(date);
  const clock = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Europe/Paris" }).format(date);
  return `${day} à ${clock}`;
}

export default function EvaluationsAdmin({ evaluations, classes, startCreating = false }: { evaluations: EvaluationSummary[]; classes: string[]; startCreating?: boolean }) {
  const router = useRouter();
  const [creating, setCreating] = useState(startCreating);
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
          <EvaluationForm classes={classes} busy={busy} submitLabel="Créer et ajouter les sujets" onSubmit={create} onCancel={() => setCreating(false)} requireSchedule />
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
                    {evaluation.durationMinutes ? `${evaluation.durationMinutes} min` : "sans limite"} ·{" "}
                    {evaluation.scheduledAt ? `passage le ${scheduleLabel(evaluation.scheduledAt)}` : `créée le ${dateFormat.format(new Date(evaluation.createdAt))}`}
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
