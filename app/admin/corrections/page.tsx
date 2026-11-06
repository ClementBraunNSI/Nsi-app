import { PageHeader } from "@/components/ui";
import { SubmissionsReview } from "@/components/admin/SubmissionsReview";

export default function AdminCorrectionsPage() {
  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Évaluer"
        title="Corrections"
        description="Réponses écrites aux exercices sans éditeur, tous élèves confondus, de la plus ancienne à la plus récente. « Valider l'exercice » le compte comme fait ; « Renvoyer à l'élève » lui rend la réponse avec le commentaire."
      />
      <SubmissionsReview />
    </div>
  );
}
