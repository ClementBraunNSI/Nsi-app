import { PageHeader } from "@/components/ui";
import { listAnnouncements } from "@/app/actions/announcements";
import { listClasses } from "@/app/actions/evaluations";
import AnnouncementsAdmin from "@/components/admin/announcements/AnnouncementsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementsPage() {
  const [announcements, classes] = await Promise.all([listAnnouncements(), listClasses()]);
  return (
    <div className="px-4 md:px-8 pb-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <PageHeader
          eyebrow="Administration"
          title="Annonces par classe"
          description="Une annonce est lue par les seuls élèves des classes choisies, sur la page Ma classe de leur espace. Les élèves ne peuvent pas répondre ici."
        />
        <AnnouncementsAdmin announcements={announcements} classes={classes} />
      </div>
    </div>
  );
}
