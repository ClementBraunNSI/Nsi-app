import { getChallengeDetail } from "@/app/actions/challenges";
import { listClasses } from "@/app/actions/evaluations";
import ResourceNotFound from "@/components/ResourceNotFound";
import ChallengeDetailView from "@/components/admin/challenges/ChallengeDetailView";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export default async function AdminChallengePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [detail, classes] = await Promise.all([getChallengeDetail(id), listClasses()]);
  if (!detail) {
    return <ResourceNotFound title="Défi introuvable" description="Il a peut-être été supprimé." actionHref="/admin/defis" actionLabel="Tous les défis" />;
  }
  return (
    <div className="px-4 md:px-8 pb-10">
      <div className="max-w-7xl mx-auto">
        <ChallengeDetailView detail={detail} classes={classes} />
      </div>
    </div>
  );
}
