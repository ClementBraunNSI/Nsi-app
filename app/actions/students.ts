"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { getAuthContext } from "@/lib/auth";
import { classTemporaryPassword } from "@/lib/class-password";
import { BULK_MAX_ROWS } from "@/lib/bulk-students";

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
  const classe = normalizeClasse(input.classe);
  const levelRaw = String(input.level || "").trim();
  const level = levelRaw ? levelRaw : null;
  const hasPrivateLessons = Boolean(input.hasPrivateLessons);
  const typedPassword = String(input.password || "");
  const password =
    opts.passwordRequired && !hasPrivateLessons && !typedPassword
      ? classTemporaryPassword(fullName)
      : typedPassword;

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
      hasPrivateLessons,
    },
  };
}

async function requireTeacher() {
  const auth = await getAuthContext();
  if (!auth.user || !auth.isElevated) return null;
  return auth;
}

type ParsedStudent = NonNullable<ReturnType<typeof parseStudentInput>["value"]>;
type AdminClient = NonNullable<ReturnType<typeof createAdminClient>>;
type SessionClient = Awaited<ReturnType<typeof createClient>>;

function isEmailTakenError(message: string | undefined) {
  const text = (message || "").toLowerCase();
  return text.includes("already") || text.includes("registered") || text.includes("exists");
}

/** Crée le compte Auth puis complète le profil ; annule la création si le profil n'a pas pu être écrit. */
async function insertStudentAccount(admin: AdminClient, supabase: SessionClient, value: ParsedStudent): Promise<{ error: string | null }> {
  const { data, error } = await admin.auth.admin.createUser({
    email: value.email,
    password: value.password,
    email_confirm: true,
    user_metadata: { full_name: value.fullName },
  });

  if (error || !data.user) {
    return { error: isEmailTakenError(error?.message) ? "email_taken" : "save_failed" };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: value.fullName,
      email: value.email,
      role: "student",
      classe: value.classe,
      level: value.level,
      has_private_lessons: value.hasPrivateLessons,
      must_change_password: !value.hasPrivateLessons,
    })
    .eq("id", data.user.id)
    .select("id");

  if (profileError) {
    await admin.auth.admin.deleteUser(data.user.id);
    return { error: "save_failed" };
  }
  return { error: null };
}

export async function createStudent(input: StudentInput): Promise<{ error: string | null }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden" };

  const parsed = parseStudentInput(input, { passwordRequired: true });
  if (parsed.error || !parsed.value) return { error: parsed.error || "invalid" };

  const admin = createAdminClient();
  if (!admin) return { error: "missing_key" };

  const result = await insertStudentAccount(admin, await createClient(), parsed.value);
  if (result.error) return result;

  revalidateStudents();
  return { error: null };
}

/** Adresses déjà utilisées parmi celles demandées : profils, et comptes Auth quand la clé serveur est là. */
async function findTakenEmails(emails: string[]): Promise<{ error: string | null; taken: string[] }> {
  const wanted = [...new Set(emails.map((email) => String(email || "").trim().toLowerCase()).filter(Boolean))];
  if (wanted.length === 0) return { error: null, taken: [] };

  const admin = createAdminClient();
  const reader = admin ?? (await createClient());
  const { data, error } = await reader.from("profiles").select("email").in("email", wanted);
  if (error) return { error: "save_failed", taken: [] };

  const wantedSet = new Set(wanted);
  const taken = new Set<string>();
  for (const row of data || []) {
    const email = String(row.email || "").toLowerCase();
    if (wantedSet.has(email)) taken.add(email);
  }
  if (wantedSet.has(TEACHER_EMAIL)) taken.add(TEACHER_EMAIL);

  if (admin) {
    for (let page = 1; page <= 20; page += 1) {
      const { data: users, error: listError } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
      if (listError) return { error: "save_failed", taken: [] };
      for (const user of users.users) {
        const email = (user.email || "").toLowerCase();
        if (wantedSet.has(email)) taken.add(email);
      }
      if (users.users.length < 1000) break;
    }
  }
  return { error: null, taken: [...taken] };
}

export async function checkStudentEmails(emails: string[]): Promise<{ error: string | null; taken: string[] }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden", taken: [] };
  if (!Array.isArray(emails) || emails.length > BULK_MAX_ROWS * 4) return { error: "invalid", taken: [] };
  return findTakenEmails(emails);
}

export type BulkStudentInput = {
  rows: { fullName: string; email: string }[];
  classe: string;
  level: string;
};

export type BulkStudentResult = { fullName: string; email: string; error: string | null };

/**
 * Crée les comptes d'une classe, un par un, avec les mêmes règles que createStudent : mot de passe Nsi-prenom26
 * (le suffixe de l'adresse n'en fait pas partie), changement obligatoire à la première connexion.
 * Une adresse déjà prise est refusée par Supabase : aucun compte existant n'est modifié.
 */
export async function createStudentsBatch(input: BulkStudentInput): Promise<{ error: string | null; results: BulkStudentResult[] }> {
  const auth = await requireTeacher();
  if (!auth) return { error: "forbidden", results: [] };

  const rows = Array.isArray(input?.rows) ? input.rows : [];
  if (rows.length === 0) return { error: "invalid", results: [] };
  if (rows.length > BULK_MAX_ROWS) return { error: "too_many", results: [] };

  const classe = normalizeClasse(input.classe);
  const level = String(input.level || "").trim();
  if (!classe || !LEVELS.has(level)) return { error: "invalid", results: [] };

  const admin = createAdminClient();
  if (!admin) return { error: "missing_key", results: [] };
  const supabase = await createClient();

  const seen = new Set<string>();
  const results: BulkStudentResult[] = [];
  for (const row of rows) {
    const fullName = String(row?.fullName || "").replace(/\s+/g, " ").trim();
    const email = String(row?.email || "").trim().toLowerCase();
    const parsed = parseStudentInput({ fullName, email, classe, level, hasPrivateLessons: false }, { passwordRequired: true });
    if (parsed.error || !parsed.value) {
      results.push({ fullName, email, error: parsed.error || "invalid" });
      continue;
    }
    if (seen.has(parsed.value.email)) {
      results.push({ fullName, email, error: "duplicate" });
      continue;
    }
    seen.add(parsed.value.email);
    const created = await insertStudentAccount(admin, supabase, parsed.value);
    results.push({ fullName: parsed.value.fullName, email: parsed.value.email, error: created.error });
  }

  if (results.some((result) => !result.error)) revalidateStudents();
  return { error: null, results };
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
    return { error: isEmailTakenError(authError.message) ? "email_taken" : "save_failed" };
  }

  const profilePatch: {
    full_name: string;
    email: string;
    classe: string | null;
    level: string | null;
    has_private_lessons: boolean;
    must_change_password?: boolean;
  } = {
    full_name: parsed.value.fullName,
    email: parsed.value.email,
    classe: parsed.value.classe,
    level: parsed.value.level,
    has_private_lessons: parsed.value.hasPrivateLessons,
  };
  if (parsed.value.password) {
    profilePatch.must_change_password = !parsed.value.hasPrivateLessons;
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update(profilePatch)
    .eq("id", id)
    .eq("role", "student")
    .select("id");

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
