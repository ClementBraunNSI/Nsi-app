import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { ADMIN_CLASS_COOKIE, cleanAdminClass } from "./admin-class";

/** Classes des élèves, présence de cours particuliers et classe choisie dans la barre du haut (cookie de session). */
export async function readAdminClass(): Promise<{ selection: string; classes: string[]; hasPrivate: boolean }> {
  const [store, supabase] = await Promise.all([cookies(), createClient()]);
  const { data } = await supabase.from("profiles").select("classe, has_private_lessons").eq("role", "student");
  const rows = (data ?? []) as { classe: string | null; has_private_lessons: boolean | null }[];
  const classes = [...new Set(rows.filter((row) => !row.has_private_lessons).map((row) => (row.classe ?? "").trim()).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "fr", { numeric: true }),
  );
  const hasPrivate = rows.some((row) => row.has_private_lessons);
  return { selection: cleanAdminClass(store.get(ADMIN_CLASS_COOKIE)?.value, classes, hasPrivate), classes, hasPrivate };
}
