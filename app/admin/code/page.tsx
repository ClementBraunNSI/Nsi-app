import { PageHeader } from "@/components/ui";
import { SolvedCodePanel } from "@/components/admin/SolvedCodePanel";

export default function AdminSolvedCodePage() {
  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Évaluer"
        title="Codes réussis"
        description="Dernière version réussie de chaque exercice, par classe, fiche ou élève, avec export."
      />
      <SolvedCodePanel />
    </div>
  );
}
