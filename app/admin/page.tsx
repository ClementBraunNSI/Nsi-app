import { getAdminToday } from "@/app/actions/adminToday";
import { AdminToday } from "@/components/admin/AdminToday";

export const dynamic = "force-dynamic";

export default async function AdminTodayPage() {
  const data = await getAdminToday();
  if (!data) return <p className="admin-muted">Cette page est réservée à l&apos;enseignant.</p>;
  return <AdminToday data={data} now={new Date().toISOString()} />;
}
