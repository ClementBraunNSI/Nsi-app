import { getActivityBoard } from "@/app/actions/activity";
import { ActivityBoard } from "@/components/admin/ActivityBoard";

export const dynamic = "force-dynamic";

export default async function AdminActivityPage() {
  const students = await getActivityBoard();

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
    </div>
  );
}
