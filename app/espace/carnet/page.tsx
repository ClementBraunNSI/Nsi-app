import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getErrorNotebook } from "@/app/actions/revisions";
import { PageHeader } from "@/components/ui";
import { ErrorNotebook } from "@/components/revisions/ErrorNotebook";

export const dynamic = "force-dynamic";
export const metadata = { title: "Carnet d'erreurs", robots: { index: false } };

export default async function ErrorNotebookPage() {
  const items = await getErrorNotebook();
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">
      <Link href="/espace" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--accent)]">
        <ArrowLeft size={16} aria-hidden /> Retour à l&apos;espace élève
      </Link>
      <PageHeader
        eyebrow="Espace élève"
        title="Carnet d'erreurs"
        description="Les erreurs Python des essais refusés, regroupées par type, avec leur explication et le code réussi ensuite. Une erreur qui ne revient plus depuis trois semaines est marquée comme disparue."
      />
      {items ? (
        <ErrorNotebook initial={items} now={new Date().toISOString()} />
      ) : (
        <p className="carnet-empty">Le carnet d&apos;erreurs est réservé aux comptes élève.</p>
      )}
    </div>
  );
}
