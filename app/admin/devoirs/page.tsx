import { PageHeader } from "@/components/ui";
import { ClassHomeworkPanel } from "@/components/admin/ClassHomeworkPanel";
import { PrivateHomeworkPanel } from "@/components/admin/PrivateHomeworkPanel";
import { AssessmentsPanel } from "@/components/admin/AssessmentsPanel";
import { VisioPanel } from "@/components/admin/VisioPanel";
import { listAssessments } from "@/app/actions/classInfo";
import { listVisios } from "@/app/actions/visio";
import { listClasses } from "@/app/actions/evaluations";

export const dynamic = "force-dynamic";

export default async function AdminClassHomeworkPage() {
  const [assessments, visios, classes] = await Promise.all([listAssessments(), listVisios(), listClasses()]);
  return (
    <div className="px-4 md:px-8 pb-10">
      <div className="max-w-7xl mx-auto space-y-10">
        <PageHeader
          eyebrow="Administration"
          title="Devoirs"
          description="Un devoir particulier va à un seul élève. Un devoir de classe va à tous les élèves qui ont cette classe. Une semaine après sa date limite, un devoir est supprimé automatiquement ; sans date limite, il reste jusqu'à ce que tu le supprimes."
        />
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Devoirs particuliers</h2>
          <PrivateHomeworkPanel />
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Devoirs de classe</h2>
          <ClassHomeworkPanel />
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Interros et DS</h2>
          <p className="text-sm text-slate-500">Les élèves des classes choisies voient la date sur la page Ma classe et dans l&apos;extension.</p>
          <AssessmentsPanel assessments={assessments} classes={classes} />
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-slate-800">Visio</h2>
          <p className="text-sm text-slate-500">
            Lien invité vers une classe virtuelle de l&apos;Éducation nationale. Seuls les élèves connectés de la classe voient le bouton, quand la visio est
            ouverte ou dans les 15 minutes qui précèdent une séance planifiée.
          </p>
          <VisioPanel visios={visios} classes={classes} />
        </section>
      </div>
    </div>
  );
}
