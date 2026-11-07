import { PageHeader } from "@/components/ui";
import { ClassHomeworkPanel } from "@/components/admin/ClassHomeworkPanel";
import { PrivateHomeworkPanel } from "@/components/admin/PrivateHomeworkPanel";
import { AssessmentsPanel } from "@/components/admin/AssessmentsPanel";
import { VisioPanel } from "@/components/admin/VisioPanel";
import { listAssessments } from "@/app/actions/classInfo";
import { listVisios } from "@/app/actions/visio";
import { listClasses } from "@/app/actions/evaluations";
import { listExerciseSheets } from "@/app/actions/getExercises";

export const dynamic = "force-dynamic";

const SECTIONS = [
  { id: "devoirs-classe", label: "Devoirs de classe" },
  { id: "interros", label: "Interros et DS" },
  { id: "visio", label: "Visio" },
  { id: "devoirs-particuliers", label: "Devoirs particuliers" },
];

export default async function AdminClassHomeworkPage() {
  const [assessments, visios, classes, sheets] = await Promise.all([listAssessments(), listVisios(), listClasses(), listExerciseSheets()]);
  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Classe"
        title="Devoirs et dates"
        description="Un devoir de classe va à tous les élèves qui ont cette classe ; un devoir particulier va à un seul élève. Une semaine après sa date limite, un devoir est supprimé automatiquement ; sans date limite, il reste jusqu'à sa suppression."
      />
      <nav className="admin-jump" aria-label="Sections de la page">
        {SECTIONS.map((section) => (
          <a key={section.id} href={`#${section.id}`}>
            {section.label}
          </a>
        ))}
      </nav>
      <section id="devoirs-classe" className="admin-section">
        <h2>Devoirs de classe</h2>
        <ClassHomeworkPanel />
      </section>
      <section id="interros" className="admin-section">
        <h2>Interros et DS</h2>
        <p>
          Les élèves des classes choisies voient la date sur la page Ma classe et dans l&apos;extension. Dans les 14 jours qui précèdent, leur espace
          propose des exercices à refaire, pris dans les fiches des chapitres annoncés.
        </p>
        <AssessmentsPanel assessments={assessments} classes={classes} sheets={sheets} />
      </section>
      <section id="visio" className="admin-section">
        <h2>Visio</h2>
        <p>
          Lien invité vers une classe virtuelle de l&apos;Éducation nationale. Seuls les élèves connectés de la classe voient le bouton, quand la visio est
          ouverte ou dans les 15 minutes qui précèdent une séance planifiée.
        </p>
        <VisioPanel visios={visios} classes={classes} />
      </section>
      <section id="devoirs-particuliers" className="admin-section">
        <h2>Devoirs particuliers</h2>
        <PrivateHomeworkPanel />
      </section>
    </div>
  );
}
