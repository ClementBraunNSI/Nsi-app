"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { getAuthContext } from "@/lib/auth";

const LEVELS = new Set(["SNI", "SNT", "1NSI", "TNSI", "SIO"]);
const TEACHER_EMAIL = "clement.braun1@outlook.fr";
const TEACHER_ID = "6680cbe8-b9f9-47db-9630-020eb12ffaa2";

export type StudentInput = {
  fullName: string;
  email: string;
  password?: string;
  classe?: string;
  level?: string;
  hasPrivateLessons?: boolean;
};

function revalidateStudents() {
  revalidatePath("/admin");
  revalidatePath("/espace");
  revalidatePath("/admin/messages");
  revalidatePath("/admin/devoirs");
}

function normalizeClasse(value: string | undefined) {
  const classe = String(value || "").trim();
  if (!classe) return null;
  if (classe.length > 80) return undefined;
  return classe;
}

function parseStudentInput(input: StudentInput, opts: { passwordRequired: boolean }) {
  const fullName = String(input.fullName || "").trim();
  const email = String(input.email || "").trim().toLowerCase();
  const password = String(input.password || "");
  const classe = normalizeClasse(input.classe);
  const levelRaw = String(input.level || "").trim();
  const level = levelRaw ? levelRaw : null;

  if (fullName.length < 2 || fullName.length > 80) return { error: "invalid" as const };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) return { error: "invalid" as const };
  if (email === TEACHER_EMAIL) return { error: "protected" as const };
  if (classe === undefined) return { error: "invalid" as const };
  if (level && !LEVELS.has(level)) return { error: "invalid" as const };
  if (opts.passwordRequired && password.length < 8) return { error: "weak_password" as const };
  if (!opts.passwordRequired && password.length > 0 && password.length < 8) return { error: "weak_password" as const };
  if (password.length > 72) return { error: "weak_password" as const };

  return {
    error: null,
    value: {
      fullName,
      email,
      password,
      classe,
      level,
      hasPrivateLessons: Boolean(input.hasPrivateLessons),
    },
  };
}

async function requireTeacher() {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  return auth;
}

export async function createStudent(input: StudentInput): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };

  const parsed = parseStudentInput(input, { passwordRequired: true });
  if (parsed.error || !parsed.value) return { error: parsed.error || "invalid" };

  const admin = createAdminClient();
  if (!admin) return { error: "missing_key" };

  const { data, error } = await admin.auth.admin.createUser({
    email: parsed.value.email,
    password: parsed.value.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.value.fullName },
  });

  if (error || !data.user) {
    const message = (error?.message || "").toLowerCase();
    if (message.includes("already") || message.includes("registered") || message.includes("exists")) {
      return { error: "email_taken" };
    }
    return { error: "save_failed" };
  }

  const supabase = await createClient();
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.value.fullName,
      email: parsed.value.email,
      role: "student",
      classe: parsed.value.classe,
      level: parsed.value.level,
      has_private_lessons: parsed.value.hasPrivateLessons,
    })
    .eq("id", data.user.id);

  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { error: "save_failed" };
  }

  revalidateStudents();
  return { error: null };
}

export async function updateStudent(studentId: string, input: StudentInput): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };

  const id = String(studentId || "").trim();
  if (!id || id === auth.user!.id || id === TEACHER_ID) return { error: "protected" };

  const parsed = parseStudentInput(input, { passwordRequired: false });
  if (parsed.error || !parsed.value) return { error: parsed.error || "invalid" };

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, email")
    .eq("id", id)
    .maybeSingle();

  if (!profile || profile.role !== "student") return { error: "protected" };
  if ((profile.email || "").toLowerCase() === TEACHER_EMAIL) return { error: "protected" };

  const admin = createAdminClient();
  if (!admin) return { error: "missing_key" };

  const authPatch: { email?: string; password?: string; email_confirm?: boolean; user_metadata?: { full_name: string } } = {
    user_metadata: { full_name: parsed.value.fullName },
  };
  if ((profile.email || "").toLowerCase() !== parsed.value.email) {
    authPatch.email = parsed.value.email;
    authPatch.email_confirm = true;
  }
  if (parsed.value.password) authPatch.password = parsed.value.password;

  const { error: authError } = await admin.auth.admin.updateUserById(id, authPatch);
  if (authError) {
    const message = (authError.message || "").toLowerCase();
    if (message.includes("already") || message.includes("registered") || message.includes("exists")) {
      return { error: "email_taken" };
    }
    return { error: "save_failed" };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.value.fullName,
      email: parsed.value.email,
      classe: parsed.value.classe,
      level: parsed.value.level,
      has_private_lessons: parsed.value.hasPrivateLessons,
    })
    .eq("id", id)
    .eq("role", "student");

  if (profileError) return { error: "save_failed" };
  revalidateStudents();
  return { error: null };
}

export async function deleteStudent(studentId: string): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };

  const id = String(studentId || "").trim();
  if (!id || id === auth.user!.id || id === TEACHER_ID) return { error: "protected" };

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, email")
    .eq("id", id)
    .maybeSingle();

  if (!profile || profile.role !== "student") return { error: "protected" };
  if ((profile.email || "").toLowerCase() === TEACHER_EMAIL) return { error: "protected" };

  const admin = createAdminClient();
  if (!admin) return { error: "missing_key" };

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) return { error: "save_failed" };

  revalidateStudents();
  return { error: null };
}
