import { PageHeader } from "@/components/ui";
import { listClasses, listEvaluations } from "@/app/actions/evaluations";
import { listGradableChallenges } from "@/app/actions/challengeGrading";
import EvaluationsAdmin from "@/components/admin/evaluations/EvaluationsAdmin";
import { EvaluationsTabs } from "@/components/admin/evaluations/EvaluationsTabs";

export const dynamic = "force-dynamic";

export default async function AdminEvaluationsPage({ searchParams }: { searchParams: Promise<{ nouveau?: string; revision?: string }> }) {
  const [evaluations, classes, challenges, { nouveau, revision }] = await Promise.all([
    listEvaluations(),
    listClasses(),
    listGradableChallenges().catch(() => []),
    searchParams,
  ]);
  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Évaluer"
        title="Évaluations"
        description="Interrogations pratiques en classe : chaque élève reçoit un sujet tiré au hasard, son code est enregistré, et la page se verrouille au moindre changement de fenêtre ou collage venu d'ailleurs."
      />
      <EvaluationsTabs current="evaluations" />
      <EvaluationsAdmin
        evaluations={evaluations}
        classes={classes}
        challenges={challenges}
        startCreating={nouveau === "1"}
        startRevision={revision === "1"}
      />
    </div>
  );
}
