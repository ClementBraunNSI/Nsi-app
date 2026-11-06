import { Suspense } from "react";
import { PageHeader } from "@/components/ui";
import { TeacherInbox } from "@/components/admin/TeacherInbox";

export default function AdminMessagesPage() {
  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Élèves"
        title="Messagerie"
        description="Une conversation par élève. Les messages reçus apparaissent dès l'ouverture du fil."
      />
      <Suspense fallback={<p className="admin-muted">Chargement en cours</p>}>
        <TeacherInbox />
      </Suspense>
    </div>
  );
}
