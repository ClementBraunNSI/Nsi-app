import { requireElevated } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireElevated();
  return children;
}
