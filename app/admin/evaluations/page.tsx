import { PageHeader } from "@/components/ui";
import { listClasses, listEvaluations } from "@/app/actions/evaluations";
import EvaluationsAdmin from "@/components/admin/evaluations/EvaluationsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminEvaluationsPage() {
  const [evaluations, classes] = await Promise.all([listEvaluations(), listClasses()]);
  return (
    <div className="px-4 md:px-8 pb-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader
          eyebrow="Administration"
          title="Évaluations"
          description="Interrogations pratiques en classe : chaque élève reçoit un sujet tiré au hasard, son code est enregistré, et la page se verrouille au moindre changement de fenêtre ou collage venu d'ailleurs."
        />
        <EvaluationsAdmin evaluations={evaluations} classes={classes} />
      </div>
    </div>
  );
}
