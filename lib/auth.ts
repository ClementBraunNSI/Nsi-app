import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isElevatedUser, type CourseViewer } from "@/lib/course-access";

export type AuthContext = {
  user: { id: string } | null;
  role: string | null;
  fullName: string | null;
  email: string | null;
  isElevated: boolean;
  hasPrivateLessons: boolean;
  classe: string | null;
  mustChangePassword: boolean;
};

export function viewerFromAuth(auth: AuthContext): CourseViewer {
  return {
    isElevated: auth.isElevated,
    isAuthenticated: Boolean(auth.user),
    userId: auth.user?.id ?? null,
    userEmail: auth.email,
    hasPrivateLessons: auth.hasPrivateLessons,
    classe: auth.classe,
  };
}

function safeNextPath(next?: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/espace";
  return next;
}

export async function getAuthContext(): Promise<AuthContext> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return {
      user: null,
      role: null,
      fullName: null,
      email: null,
      isElevated: false,
      hasPrivateLessons: false,
      classe: null,
      mustChangePassword: false,
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, has_private_lessons, classe, must_change_password")
    .eq("id", user.id)
    .single();

  const role = typeof profile?.role === "string" ? profile.role : null;
  return {
    user: { id: user.id },
    role,
    fullName: profile?.full_name || null,
    email: user.email?.trim() || null,
    isElevated: isElevatedUser(role),
    hasPrivateLessons: Boolean(profile?.has_private_lessons),
    classe: typeof profile?.classe === "string" && profile.classe.trim() ? profile.classe.trim() : null,
    mustChangePassword: Boolean(profile?.must_change_password),
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
