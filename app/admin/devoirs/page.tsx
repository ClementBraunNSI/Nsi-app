import { PageHeader } from "@/components/ui";
import { ClassHomeworkPanel } from "@/components/admin/ClassHomeworkPanel";
import { PrivateHomeworkPanel } from "@/components/admin/PrivateHomeworkPanel";

export default function AdminClassHomeworkPage() {
  return (
    <div className="px-4 md:px-8 pb-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <PageHeader
          eyebrow="Administration"
          title="Devoirs"
          description="Un devoir particulier va à un seul élève. Un devoir de classe va à tous les élèves qui ont cette classe."
        />
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Devoirs particuliers</h2>
          <PrivateHomeworkPanel />
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Devoirs de classe</h2>
          <ClassHomeworkPanel />
        </section>
      </div>
    </div>
  );
}
