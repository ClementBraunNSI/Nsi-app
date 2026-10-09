import { Suspense } from "react";
import { PageHeader } from "@/components/ui";
import { TeacherInbox } from "@/components/admin/TeacherInbox";

export default function AdminMessagesPage() {
  return (
    <div className="px-4 md:px-8 pb-10">
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          eyebrow="Administration"
          title="Messagerie"
          description="Une conversation par élève. Les messages reçus apparaissent dès l’ouverture du fil."
        />
        <Suspense fallback={<p className="text-sm text-slate-400">Chargement…</p>}>
          <TeacherInbox />
        </Suspense>
      </div>
    </div>
  );
}
