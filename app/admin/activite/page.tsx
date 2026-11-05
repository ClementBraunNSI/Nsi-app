import { PageHeader } from "@/components/ui";
import { getStudentActivity } from "@/app/actions/activity";
import { ActivityGroup } from "@/components/admin/ActivityList";

export default async function AdminActivityPage() {
  const activity = await getStudentActivity();

  return (
    <div className="px-4 md:px-8 pb-10">
      <div className="max-w-7xl mx-auto space-y-8">
        <PageHeader
          eyebrow="Administration"
          title="Activité"
          description="Exercices validés, fiches terminées et devoirs rendus. Un message envoyé n'est pas compté comme du travail. Cliquer sur un exercice validé affiche le code de l'élève."
        />
        {activity ? (
          <>
            <ActivityGroup title="Cours particuliers" students={activity.particuliers} />
            <ActivityGroup title="Élèves de classe" students={activity.classe} byClass />
          </>
        ) : (
          <p className="text-sm text-slate-400">Cette page est réservée à l'enseignant.</p>
        )}
      </div>
    </div>
  );
}
