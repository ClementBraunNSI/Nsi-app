"use server";

import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { getAuthContext } from "@/lib/auth";

export async function changeTemporaryPassword(
  password: string,
  confirm: string,
): Promise<{ error: string | null }> {
  const auth = await getAuthContext();
  if (!auth.user || !auth.mustChangePassword) return { error: "forbidden" };
  if (auth.role !== "student" || auth.hasPrivateLessons) return { error: "forbidden" };

  const next = String(password || "");
  const again = String(confirm || "");
  if (next.length < 8 || next.length > 72) return { error: "weak_password" };
  if (next !== again) return { error: "mismatch" };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) {
    const message = (error.message || "").toLowerCase();
    if (message.includes("weak") || message.includes("pwned") || message.includes("leaked") || message.includes("known")) {
      return { error: "weak_password" };
    }
    return { error: "save_failed" };
  }

  const admin = createAdminClient();
  if (!admin) return { error: "save_failed" };
  const { error: flagError } = await admin
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", auth.user.id)
    .eq("role", "student");
  if (flagError) return { error: "save_failed" };
  return { error: null };
}
