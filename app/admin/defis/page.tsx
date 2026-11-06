import { PageHeader } from "@/components/ui";
import { listChallenges } from "@/app/actions/challenges";
import { listClasses } from "@/app/actions/evaluations";
import ChallengesAdmin from "@/components/admin/challenges/ChallengesAdmin";

export const dynamic = "force-dynamic";
// « Tester la correction » lance Python dans un processus séparé.
export const maxDuration = 60;

export default async function AdminChallengesPage({ searchParams }: { searchParams: Promise<{ nouveau?: string }> }) {
  const [challenges, classes, { nouveau }] = await Promise.all([listChallenges(), listClasses(), searchParams]);
  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Évaluer"
        title="Défi du lundi"
        description="Un exercice inédit, ouvert chaque lundi à 7 h 30 aux classes choisies. Énoncé, tests et correction restent en base jusqu'à l'ouverture ; la correction est montrée aux élèves à la fermeture."
      />
      <ChallengesAdmin challenges={challenges} classes={classes} startCreating={nouveau === "1"} />
    </div>
  );
}
