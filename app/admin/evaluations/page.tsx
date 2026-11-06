import { PageHeader } from "@/components/ui";
import { listClasses, listEvaluations } from "@/app/actions/evaluations";
import EvaluationsAdmin from "@/components/admin/evaluations/EvaluationsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminEvaluationsPage({ searchParams }: { searchParams: Promise<{ nouveau?: string }> }) {
  const [evaluations, classes, { nouveau }] = await Promise.all([listEvaluations(), listClasses(), searchParams]);
  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Évaluer"
        title="Évaluations"
        description="Interrogations pratiques en classe : chaque élève reçoit un sujet tiré au hasard, son code est enregistré, et la page se verrouille au moindre changement de fenêtre ou collage venu d'ailleurs."
      />
      <EvaluationsAdmin evaluations={evaluations} classes={classes} startCreating={nouveau === "1"} />
    </div>
  );
}
