"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ClipboardCheck, LifeBuoy, Loader2, Lock, Plus, Trash2 } from "lucide-react";
import { createEvaluation, deleteEvaluation, type EvaluationSummary } from "@/app/actions/evaluations";
import { gradeChallenge, type GradableChallenge } from "@/app/actions/challengeGrading";
import EvaluationForm, { type EvaluationFormValues } from "./EvaluationForm";
import RevisionForm from "./RevisionForm";
import { createRevisionEvaluation, type RevisionInput } from "@/app/actions/studentSheets";

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

export default function EvaluationsAdmin({
  evaluations,
  classes,
  challenges = [],
  startCreating = false,
  startRevision = false,
}: {
  evaluations: EvaluationSummary[];
  classes: string[];
  /** Défis du lundi surveillés : ceux pas encore notés se mettent en notation d'ici. */
  challenges?: GradableChallenge[];
  startCreating?: boolean;
  startRevision?: boolean;
}) {
  const router = useRouter();
  // Une évaluation de classe, ou une évaluation de révision pour les élèves sous 12 d'une interrogation fermée.
  const [creating, setCreating] = useState<"evaluation" | "revision" | null>(startRevision ? "revision" : startCreating ? "evaluation" : null);
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

  const [deleting, setDeleting] = useState<string | null>(null);
  // Suppression définitive : l'évaluation, ses sujets et toutes ses copies.
  const remove = async (evaluation: EvaluationSummary) => {
    const copies = evaluation.attempts;
    const detail = copies
      ? `Ses sujets et ${copies === 1 ? "la copie rendue ou commencée" : `les ${copies} copies rendues ou commencées`} seront effacés définitivement.`
      : "Ses sujets seront effacés définitivement.";
    if (!window.confirm(`Supprimer « ${evaluation.title} » ? ${detail}`)) return;
    setDeleting(evaluation.id);
    setError(null);
    const result = await deleteEvaluation(evaluation.id).catch(() => ({ ok: false as const, error: "L'évaluation n'a pas pu être supprimée." }));
    setDeleting(null);
    if (!result.ok) setError(result.error);
    else router.refresh();
  };

  // Défi du lundi évalué : une évaluation fermée est créée avec les copies du défi, puis s'ouvre pour la correction.
  const [gradingChallenge, setGradingChallenge] = useState<string | null>(null);
  const toGrade = challenges.filter((challenge) => !challenge.evaluationId);
  const startGrading = async (challenge: GradableChallenge) => {
    const stillOpen = Date.parse(challenge.closesAt) > Date.now();
    if (stillOpen && !window.confirm(`« ${challenge.title} » est encore ouvert jusqu'au ${scheduleLabel(challenge.closesAt)}. Le noter maintenant ? Les copies pourront être reprises plus tard depuis l'évaluation.`)) return;
    setGradingChallenge(challenge.id);
    setError(null);
    const result = await gradeChallenge(challenge.id).catch(() => ({ ok: false as const, error: "Le défi n'a pas pu être mis en notation." }));
    setGradingChallenge(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/admin/evaluations/${result.evaluationId}`);
  };

  const createRevision = async (values: RevisionInput) => {
    setBusy(true);
    setError(null);
    const result = await createRevisionEvaluation(values).catch(() => ({ ok: false as const, error: "L'évaluation de révision n'a pas pu être créée." }));
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push(`/admin/evaluations/${result.id}?onglet=sujets`);
  };

  return (
    <div className="space-y-6">
      {creating === "evaluation" ? (
        <section className="adm-eval-panel">
          <h2>Nouvelle évaluation</h2>
          <EvaluationForm classes={classes} busy={busy} submitLabel="Créer et ajouter les sujets" onSubmit={create} onCancel={() => setCreating(null)} requireSchedule />
          {error ? <p className="adm-eval-error">{error}</p> : null}
        </section>
      ) : creating === "revision" ? (
        <section className="adm-eval-panel">
          <h2>Nouvelle évaluation de révision</h2>
          <p className="text-sm text-slate-500">Pour les élèves sous 12 à une interrogation : les mêmes notions, avec un pense-bête à côté de chaque exercice.</p>
          <RevisionForm busy={busy} onSubmit={createRevision} onCancel={() => setCreating(null)} />
          {error ? <p className="adm-eval-error">{error}</p> : null}
        </section>
      ) : (
        <div className="adm-eval-actions is-start">
          <button type="button" className="adm-eval-primary" onClick={() => setCreating("evaluation")}>
            <Plus size={16} aria-hidden /> Nouvelle évaluation
          </button>
          <button type="button" className="adm-eval-secondary adm-rev-button" onClick={() => setCreating("revision")}>
            <LifeBuoy size={16} aria-hidden /> Nouvelle évaluation de révision
          </button>
        </div>
      )}

      {error && !creating ? <p className="adm-eval-error">{error}</p> : null}
      {toGrade.length > 0 ? (
        <section className="adm-eval-challenges" aria-labelledby="defis-a-noter">
          <h2 id="defis-a-noter">
            <ClipboardCheck size={16} aria-hidden /> Défis du lundi évalués à noter
          </h2>
          <ul>
            {toGrade.map((challenge) => (
              <li key={challenge.id}>
                <span className="min-w-0">
                  <b>{challenge.title}</b>
                  <small>
                    {challenge.classes.join(", ") || "Aucune classe"} · {scheduleLabel(challenge.opensAt)} · {challenge.started} élève
                    {challenge.started > 1 ? "s" : ""}
                    {Date.parse(challenge.closesAt) > Date.now() ? ` · ouvert jusqu'au ${scheduleLabel(challenge.closesAt)}` : ""}
                  </small>
                </span>
                <button
                  type="button"
                  className="adm-eval-secondary"
                  disabled={gradingChallenge !== null || challenge.started === 0}
                  title={challenge.started === 0 ? "Aucun élève n'a ouvert ce défi" : undefined}
                  onClick={() => void startGrading(challenge)}
                >
                  {gradingChallenge === challenge.id ? <Loader2 size={15} className="animate-spin" aria-hidden /> : <ClipboardCheck size={15} aria-hidden />}
                  Noter ce défi
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {evaluations.length === 0 ? (
        <p className="text-sm text-slate-500">Aucune évaluation pour le moment.</p>
      ) : (
        <ul className="adm-eval-list">
          {evaluations.map((evaluation) => (
            <li key={evaluation.id} className="adm-eval-item">
              <Link href={`/admin/evaluations/${evaluation.id}`} className="adm-eval-row">
                <span className={`adm-eval-status is-${evaluation.status}`}>{STATUS_LABELS[evaluation.status]}</span>
                <span className="min-w-0">
                  <b>{evaluation.title}</b>
                  <small>
                    {evaluation.challengeId ? "Défi du lundi · " : ""}
                    {evaluation.kind === "rattrapage" ? "Révision · " : evaluation.kind === "travail" ? "Fiche particulière · " : ""}
                    {evaluation.kind !== "evaluation"
                      ? `${evaluation.targeted} élève${evaluation.targeted > 1 ? "s" : ""}`
                      : evaluation.classes.join(", ") || "Aucune classe"}{" "}
                    · {evaluation.subjects} sujet{evaluation.subjects > 1 ? "s" : ""} ·{" "}
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
              <button
                type="button"
                className="adm-eval-delete"
                disabled={deleting !== null}
                onClick={() => void remove(evaluation)}
                aria-label={`Supprimer l'évaluation ${evaluation.title}`}
                title="Supprimer l'évaluation"
              >
                {deleting === evaluation.id ? <Loader2 size={16} className="animate-spin" aria-hidden /> : <Trash2 size={16} aria-hidden />}
              </button>
            </li>
          ))}
        </ul>
      )}
      {busy ? <Loader2 className="animate-spin text-slate-400" size={18} aria-hidden /> : null}
    </div>
  );
}
