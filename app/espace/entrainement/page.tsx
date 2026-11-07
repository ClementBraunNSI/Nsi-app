import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPracticeSetup } from "@/app/actions/revisions";
import { PageHeader } from "@/components/ui";
import { PracticeView } from "@/components/revisions/PracticeView";

export const dynamic = "force-dynamic";
export const metadata = { title: "Entraînement chronométré", robots: { index: false } };

export default async function PracticePage({ searchParams }: { searchParams: Promise<{ choix?: string }> }) {
  const [setup, params] = await Promise.all([getPracticeSetup(), searchParams]);
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 space-y-6">
      <Link href="/espace" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]">
        <ArrowLeft size={16} aria-hidden /> Retour à l&apos;espace élève
      </Link>
      <PageHeader
        eyebrow="Espace élève"
        title="Entraînement chronométré"
        description="Un sujet blanc de 3 ou 4 exercices tirés des fiches d'un chapitre, dans les conditions d'une évaluation, sans note. À la fin : le bilan et les corrections des fiches."
      />
      {setup ? (
        <PracticeView setup={setup} initialChoice={typeof params.choix === "string" ? params.choix : undefined} />
      ) : (
        <p className="carnet-empty">L&apos;entraînement chronométré est réservé aux comptes élève.</p>
      )}
    </div>
  );
}
