import { redirect } from "next/navigation";
import { getStudentEspaceData } from "@/app/actions/espace";
import { getRevisionPlans } from "@/app/actions/revisions";
import { listMyEvaluations } from "@/app/actions/evaluations";
import { getAuthContext } from "@/lib/auth";
import { EspacePanel } from "./EspacePanel";
import { InvitePreview } from "./InvitePreview";

export default async function StudentDashboard() {
  const auth = await getAuthContext();
  if (auth.role === "invite") {
    return <InvitePreview name={auth.fullName || "Invité"} />;
  }
  const [data, revisions, evaluations] = await Promise.all([getStudentEspaceData(), getRevisionPlans(), listMyEvaluations().catch(() => [])]);
  if (!data) redirect("/connexion?next=/espace");
  // Fiches de rattrapage et fiches particulières à faire : copie pas encore rendue, fiche encore ouverte.
  const sheets = evaluations
    .filter((item) => item.kind !== "evaluation" && item.evaluationStatus === "ouverte" && item.attemptStatus !== "rendue")
    .map((item) => ({ id: item.id, title: item.title, kind: item.kind, started: item.attemptStatus === "en_cours" }));
  return <EspacePanel data={data} revisions={revisions} sheets={sheets} now={new Date().toISOString()} />;
}
