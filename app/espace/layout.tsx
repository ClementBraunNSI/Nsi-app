import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const auth = await requireUser("/espace");
  if (auth.isElevated) redirect("/admin");
  return children;
}
