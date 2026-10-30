import Link from "next/link";
import { redirect } from "next/navigation";
import { ClipboardCheck } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { listMyEvaluations } from "@/app/actions/evaluations";
import { EmptyState, PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Évaluations", robots: { index: false } };

const STATUS: Record<string, { label: string; tone: string; action: string }> = {
  a_faire: { label: "À faire", tone: "is-todo", action: "Commencer" },
  en_cours: { label: "En cours", tone: "is-progress", action: "Reprendre" },
  verrouillee: { label: "Verrouillée", tone: "is-locked", action: "Reprendre" },
  rendue: { label: "Rendue", tone: "is-done", action: "Voir" },
};

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" });

export default async function EvaluationsPage() {
  const auth = await requireUser("/evaluations");
  if (auth.isElevated) redirect("/admin/evaluations");
  const evaluations = await listMyEvaluations();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHeader
        eyebrow="Classe"
        title="Évaluations"
        description="Les évaluations ouvertes par le professeur pour la classe. Chacune se fait une seule fois, sur cette page, sans changer de fenêtre."
      />
      {evaluations.length === 0 ? (
        <EmptyState
          icon={<ClipboardCheck size={28} />}
          title="Aucune évaluation"
          description={auth.classe ? "Aucune évaluation n'est ouverte pour le moment." : "Les évaluations sont réservées aux élèves inscrits dans une classe."}
        />
      ) : (
        <ul className="eval-cards">
          {evaluations.map((evaluation) => {
            const key = !evaluation.attemptStatus
              ? "a_faire"
              : evaluation.attemptStatus === "rendue"
                ? "rendue"
                : evaluation.locked
                  ? "verrouillee"
                  : "en_cours";
            const status = STATUS[key];
            return (
              <li key={evaluation.id}>
                <Link href={`/evaluations/${evaluation.id}`} className="eval-card-link">
                  <span className={`eval-status ${status.tone}`}>{status.label}</span>
                  <b>{evaluation.title}</b>
                  {evaluation.description ? <span className="eval-card-desc">{evaluation.description}</span> : null}
                  <span className="eval-card-meta">
                    {evaluation.submittedAt
                      ? `Rendue le ${dateFormat.format(new Date(evaluation.submittedAt))}`
                      : evaluation.durationMinutes
                        ? `${evaluation.durationMinutes} minutes`
                        : "Sans limite de temps"}
                  </span>
                  <span className="eval-card-action">{status.action}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
