import { requireElevated } from "@/lib/auth";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireElevated();
  return <AdminShell>{children}</AdminShell>;
}
