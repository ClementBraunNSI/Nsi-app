import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getMyDsCorrection } from "@/app/actions/dsCorrections";
import { DsMarkdown } from "@/components/ds/DsMarkdown";

export const dynamic = "force-dynamic";
export const metadata = { title: "Correction de DS", robots: { index: false } };

const dayLabel = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

/**
 * Sujet puis correction d'un DS. La lecture passe par la RLS : avant la date de mise à disposition,
 * ou pour une autre classe, la base ne renvoie rien et la page répond 404.
 */
export default async function DsCorrectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ds = await getMyDsCorrection(id);
  if (!ds) notFound();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
      <Link href="/espace/ds" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]">
        <ArrowLeft size={16} aria-hidden /> Toutes les corrections de DS
      </Link>
      <header className="ds-head">
        <p className="ds-kicker">Correction de DS</p>
        <h1>{ds.title}</h1>
        <p>En ligne depuis le {dayLabel.format(new Date(ds.visibleAt))}</p>
      </header>
      {ds.subject.trim() ? (
        <section className="ds-part" aria-labelledby="ds-sujet">
          <h2 id="ds-sujet" className="ds-part-title">Sujet</h2>
          <DsMarkdown source={ds.subject} />
        </section>
      ) : null}
      {ds.correction.trim() ? (
        <section className="ds-part" aria-labelledby="ds-correction">
          <h2 id="ds-correction" className="ds-part-title is-correction">Correction</h2>
          <DsMarkdown source={ds.correction} />
        </section>
      ) : null}
    </div>
  );
}
