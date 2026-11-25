import Link from "next/link";
import { ArrowLeft, ChevronRight, FileCheck2 } from "lucide-react";
import { listMyDsCorrections } from "@/app/actions/dsCorrections";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";
export const metadata = { title: "Corrections des DS", robots: { index: false } };

const dayLabel = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });

/** Corrections de DS disponibles pour la classe de l'élève : la base ne renvoie que celles dont la date est passée. */
export default async function DsCorrectionsPage() {
  const items = await listMyDsCorrections();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
      <Link href="/espace" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]">
        <ArrowLeft size={16} aria-hidden /> Retour à l&apos;espace élève
      </Link>
      <PageHeader eyebrow="Espace élève" title="Corrections des DS" description="Le sujet et la correction de chaque DS, mis en ligne après l'épreuve." />
      {items.length === 0 ? (
        <p className="ds-empty">Aucune correction de DS disponible pour le moment.</p>
      ) : (
        <ul className="ds-list">
          {items.map((item) => (
            <li key={item.id}>
              <Link href={`/espace/ds/${item.id}`} className="ds-list-row">
                <FileCheck2 size={20} aria-hidden />
                <span className="min-w-0 flex-1">
                  <b>{item.title}</b>
                  <small>
                    En ligne depuis le {dayLabel.format(new Date(item.visibleAt))} ·{" "}
                    {[item.hasSubject ? "sujet" : null, item.hasCorrection ? "correction" : null].filter(Boolean).join(" et ")}
                  </small>
                </span>
                <ChevronRight size={18} aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
