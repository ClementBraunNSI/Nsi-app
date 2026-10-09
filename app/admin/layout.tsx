import { requireElevated } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireElevated();
  return (
    <div className="bg-[#FDFCFB] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <AdminNav />
      </div>
      {children}
    </div>
  );
}
