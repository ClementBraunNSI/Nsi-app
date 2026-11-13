import { getAdminToday } from "@/app/actions/adminToday";
import { AdminToday } from "@/components/admin/AdminToday";

export const dynamic = "force-dynamic";

export default async function AdminTodayPage() {
  const page = await getAdminToday();
  if (!page) return <p className="admin-muted">Cette page est réservée à l&apos;enseignant.</p>;
  return <AdminToday data={page.data} extra={page.extra} classLabel={page.classLabel} showClasses={!page.selection} now={new Date().toISOString()} />;
}
