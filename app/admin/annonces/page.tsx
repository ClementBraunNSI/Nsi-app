import { PageHeader } from "@/components/ui";
import { listAnnouncements } from "@/app/actions/announcements";
import { listClasses } from "@/app/actions/evaluations";
import AnnouncementsAdmin from "@/components/admin/announcements/AnnouncementsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const [announcements, classes] = await Promise.all([listAnnouncements(), listClasses()]);
  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Classe"
        title="Annonces par classe"
        description="Une annonce est lue par les seuls élèves des classes choisies, sur la page Ma classe de leur espace. Les élèves ne peuvent pas répondre ici."
      />
      <div id="nouvelle" className="admin-anchor">
        <AnnouncementsAdmin announcements={announcements} classes={classes} />
      </div>
    </div>
  );
}
