import { redirect } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { listMyChallenges } from "@/app/actions/challenges";
import { EmptyState, PageHeader } from "@/components/ui";
import ChallengeView from "@/components/challenges/ChallengeView";

export const dynamic = "force-dynamic";
// La vérification lance Python dans un processus séparé.
export const maxDuration = 60;
export const metadata = { title: "Défi du lundi", robots: { index: false } };

export default async function ChallengePage() {
  const auth = await requireUser("/defi");
  if (auth.isElevated) redirect("/admin/defis");
  const { challenges, streak } = await listMyChallenges();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <PageHeader
        eyebrow="Chaque lundi"
        title="Défi du lundi"
        description="Un exercice inédit chaque semaine, à réussir avant le lundi suivant. La correction apparaît à la fin de la semaine."
      />
      {challenges.length === 0 ? (
        <EmptyState
          icon={<CalendarDays size={28} />}
          title="Pas encore de défi"
          description={auth.classe ? "Le premier défi arrive lundi." : "Les défis sont réservés aux élèves inscrits dans une classe."}
        />
      ) : (
        <ChallengeView challenges={challenges} streak={streak} />
      )}
    </div>
  );
}
