import { getActivityBoard } from "@/app/actions/activity";
import { listPracticeSessions } from "@/app/actions/revisions";
import { ActivityBoard } from "@/components/admin/ActivityBoard";
import { PracticeSessionsList } from "@/components/admin/PracticeSessionsList";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const [students, practice] = await Promise.all([getActivityBoard(), listPracticeSessions()]);

  return (
    <div className="admin-page act-page">
      <header className="admin-page-head">
        <div>
          <p className="admin-eyebrow">Élèves</p>
          <h1>Activité</h1>
          <p>
            Exercices validés, fiches terminées, devoirs rendus. Un clic sur un élève déplie son activité jour par jour ; un clic sur un exercice
            affiche son code et son suivi de frappe.
          </p>
        </div>
      </header>
      {students ? (
        <ActivityBoard students={students} now={new Date().toISOString()} />
      ) : (
        <p className="admin-muted">Cette page est réservée à l&apos;enseignant.</p>
      )}
      {students ? (
        <section className="admin-section" aria-labelledby="entrainements">
          <h2 id="entrainements">Entraînements chronométrés</h2>
          <p>Sujets blancs lancés par les élèves depuis leur espace, ces 30 derniers jours. Sans note ni résultat ; les essais apparaissent avec les autres.</p>
          <PracticeSessionsList sessions={practice} />
        </section>
      ) : null}
    </div>
  );
}
