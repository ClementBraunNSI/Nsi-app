import { redirect } from "next/navigation";
import { getStudentEspaceData } from "@/app/actions/espace";
import { getRevisionPlans } from "@/app/actions/revisions";
import { getAuthContext } from "@/lib/auth";
import { EspacePanel } from "./EspacePanel";
import { InvitePreview } from "./InvitePreview";

export default async function StudentDashboard() {
  const auth = await getAuthContext();
  if (auth.role === "invite") {
    return <InvitePreview name={auth.fullName || "Invité"} />;
  }
  const [data, revisions] = await Promise.all([getStudentEspaceData(), getRevisionPlans()]);
  if (!data) redirect("/connexion?next=/espace");
  return <EspacePanel data={data} revisions={revisions} now={new Date().toISOString()} />;
}
