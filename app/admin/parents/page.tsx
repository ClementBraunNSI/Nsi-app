import { getClassesBoard } from "@/app/actions/adminClasses";
import { ParentMeeting } from "@/components/admin/parents/ParentMeeting";

export const dynamic = "force-dynamic";

export default async function AdminParentsPage() {
  const board = await getClassesBoard();
  if (!board) return <p className="admin-muted">Cette page est réservée à l&apos;enseignant.</p>;
  return <ParentMeeting board={board} />;
}
