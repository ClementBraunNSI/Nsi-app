import { PageHeader } from "@/components/ui";
import { listClasses } from "@/app/actions/evaluations";
import { getDsCorrection, listDsCorrections } from "@/app/actions/dsCorrections";
import { EvaluationsTabs } from "@/components/admin/evaluations/EvaluationsTabs";
import DsCorrectionsAdmin from "@/components/admin/evaluations/DsCorrectionsAdmin";
import { ADMIN_PRIVATE, touchesAdminClass } from "@/lib/admin-class";
import { readAdminClass } from "@/lib/admin-class-server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Corrections de DS", robots: { index: false } };

export default async function AdminDsCorrectionsPage({ searchParams }: { searchParams: Promise<{ nouveau?: string; modifier?: string }> }) {
  const { nouveau, modifier } = await searchParams;
  const [items, classes, { selection }, editing] = await Promise.all([
    listDsCorrections(),
    listClasses(),
    readAdminClass(),
    modifier ? getDsCorrection(modifier) : Promise.resolve(null),
  ]);
  // Classe choisie dans la barre du haut : seuls ses DS sont listés.
  const shown = items.filter((item) => touchesAdminClass(selection, item.classes));
  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Évaluer"
        title="Corrections de DS"
        description="Sujet et correction d'un DS, en Markdown, rendus visibles aux élèves des classes choisies à partir de la date indiquée. Avant cette date, rien n'est lisible côté élève, pas même le titre."
      />
      <EvaluationsTabs current="ds" />
      <DsCorrectionsAdmin
        key={editing?.id ?? (nouveau === "1" ? "nouveau" : "liste")}
        items={shown}
        hiddenCount={items.length - shown.length}
        classes={classes}
        editing={editing}
        startCreating={nouveau === "1"}
        defaultClass={selection && selection !== ADMIN_PRIVATE ? selection : ""}
      />
    </div>
  );
}
