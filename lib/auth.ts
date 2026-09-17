import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isElevatedUser } from "@/lib/course-access";

export type AuthContext = {
  user: { id: string } | null;
  role: string | null;
  fullName: string | null;
  isElevated: boolean;
};

function safeNextPath(next?: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/espace";
  return next;
}

export async function getAuthContext(): Promise<AuthContext> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { user: null, role: null, fullName: null, isElevated: false };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  const role = typeof profile?.role === "string" ? profile.role : null;
  return {
    user: { id: user.id },
    role,
    fullName: profile?.full_name || null,
    isElevated: isElevatedUser(role),
  };
}

export async function requireUser(nextPath = "/espace"): Promise<AuthContext> {
  const auth = await getAuthContext();
  if (!auth.user) {
    redirect(`/connexion?next=${encodeURIComponent(safeNextPath(nextPath))}`);
  }
  return auth;
}

export async function requireElevated(): Promise<AuthContext> {
  const auth = await requireUser("/admin");
  if (!auth.isElevated) {
    redirect("/espace");
  }
  return auth;
}
