import { PageHeader } from "@/components/ui";
import { listChallenges } from "@/app/actions/challenges";
import { listClasses } from "@/app/actions/evaluations";
import ChallengesAdmin from "@/components/admin/challenges/ChallengesAdmin";

export const dynamic = "force-dynamic";
// « Tester la correction » lance Python dans un processus séparé.
export const maxDuration = 60;

export default async function AdminChallengesPage() {
  const [challenges, classes] = await Promise.all([listChallenges(), listClasses()]);
  return (
    <div className="px-4 md:px-8 pb-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader
          eyebrow="Administration"
          title="Défi du lundi"
          description="Un exercice inédit, ouvert chaque lundi à 7 h 30 aux classes choisies. Énoncé, tests et correction restent en base jusqu'à l'ouverture ; la correction est montrée aux élèves à la fermeture."
        />
        <ChallengesAdmin challenges={challenges} classes={classes} />
      </div>
    </div>
  );
}
