import { requireElevated } from "@/lib/auth";
import { readAdminClass } from "@/lib/admin-class-server";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireElevated();
  const { selection, classes, hasPrivate } = await readAdminClass();
  return (
    <AdminShell classSelection={selection} classes={classes} hasPrivate={hasPrivate}>
      {children}
    </AdminShell>
  );
}
