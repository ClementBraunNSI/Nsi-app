import { requireUser } from "@/lib/auth";

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  await requireUser("/espace");
  return children;
}
