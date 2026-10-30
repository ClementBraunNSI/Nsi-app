import { getEvaluationBoard, listClasses } from "@/app/actions/evaluations";
import EvaluationManager from "@/components/admin/evaluations/EvaluationManager";
import ResourceNotFound from "@/components/ResourceNotFound";

export const dynamic = "force-dynamic";
// La correction automatique lance Python dans un processus séparé : on lui laisse le temps.
export const maxDuration = 60;

export default async function AdminEvaluationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ onglet?: string }>;
}) {
  const { id } = await params;
  const { onglet } = await searchParams;
  const [board, classes] = await Promise.all([getEvaluationBoard(id), listClasses()]);
  if (!board) {
    return <ResourceNotFound title="Évaluation introuvable" description="Elle a peut-être été supprimée." actionHref="/admin/evaluations" actionLabel="Toutes les évaluations" />;
  }
  const tab = onglet === "sujets" || onglet === "reglages" ? onglet : "suivi";
  return (
    <div className="px-4 md:px-8 pb-10">
      <div className="max-w-7xl mx-auto">
        <EvaluationManager initialBoard={board} classes={classes} initialTab={tab} />
      </div>
    </div>
  );
}
