import { getClassesBoard } from "@/app/actions/adminClasses";
import { ClassesBoard } from "@/components/admin/classes/ClassesBoard";

export const dynamic = "force-dynamic";

export default async function AdminClassesPage() {
  const board = await getClassesBoard();
  if (!board) return <p className="admin-muted">Cette page est réservée à l&apos;enseignant.</p>;
  return <ClassesBoard board={board} />;
}
