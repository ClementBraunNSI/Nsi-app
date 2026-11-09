import { PageHeader } from "@/components/ui";
import { listBugReports } from "@/app/actions/bugReports";
import BugReportsAdmin from "@/components/admin/bugs/BugReportsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminBugsPage() {
  const reports = await listBugReports();
  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Site"
        title="Bugs signalés"
        description="Signalements envoyés par les élèves depuis l'accueil : page concernée, description, capture d'écran et navigateur. Le statut sert au suivi."
      />
      <BugReportsAdmin reports={reports} />
    </div>
  );
}
