"use server";

import { revalidatePath } from "next/cache";
import { getAuthContext } from "@/lib/auth";
import { syncHomeworkFor } from "@/lib/homework-sync";

function revalidateHomework() {
  revalidatePath("/espace");
  revalidatePath("/admin");
  revalidatePath("/admin/devoirs");
}

/** Marque les devoirs liés à une page dont tous les exercices sont dans user_progress. */
export async function syncMyHomework(): Promise<void> {
  const auth = await getAuthContext();
  if (!auth.user || auth.role !== "student") return;
  if (await syncHomeworkFor(auth.user.id)) revalidateHomework();
}
