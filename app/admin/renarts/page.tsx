import { PageHeader } from "@/components/ui";
import { RenartsGallery } from "@/components/admin/chasse/RenartsGallery";

export default function AdminRenartsPage() {
  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Site"
        title="Chasse aux Ren'Arts"
        description="Tableaux envoyés par les élèves depuis l'accueil, par classe. Un clic ouvre le tableau en plein écran ; les flèches ← → passent au suivant. « Tout télécharger » range les tableaux dans un fichier .zip, un dossier par classe, puis propose de les retirer du site une fois la réception confirmée."
      />
      <RenartsGallery />
    </div>
  );
}
