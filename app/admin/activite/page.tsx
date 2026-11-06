import { PageHeader } from "@/components/ui";
import { getStudentActivity } from "@/app/actions/activity";
import { ActivityGroup } from "@/components/admin/ActivityList";

export default async function AdminActivityPage() {
  const activity = await getStudentActivity();

  return (
    <div className="admin-page">
      <PageHeader
        eyebrow="Élèves"
        title="Activité"
        description="Exercices validés, fiches terminées et devoirs rendus. Un message envoyé n'est pas compté comme du travail. Cliquer sur un exercice validé affiche le code de l'élève."
      />
      {activity ? (
        <>
          <ActivityGroup title="Cours particuliers" students={activity.particuliers} />
          <ActivityGroup title="Élèves de classe" students={activity.classe} byClass />
        </>
      ) : (
        <p className="admin-muted">Cette page est réservée à l&apos;enseignant.</p>
      )}
    </div>
  );
}
