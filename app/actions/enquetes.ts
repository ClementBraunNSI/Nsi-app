"use server";

import { accuse, solvedCount, type Accusation } from "@/lib/enquetes/build";
import { getEnquete } from "@/lib/enquetes/cases";
import { toPublic, type PublicEnquete } from "@/lib/enquetes/types";

export type AccusationResult = Accusation;

const cleanAnswers = (found: unknown) => (Array.isArray(found) ? found.slice(0, 10).map((item) => String(item ?? "").slice(0, 80)) : []);

/**
 * Vérifie l'accusation côté serveur : le nom du coupable n'est jamais envoyé avec l'enquête.
 * found : les coupables déjà trouvés aux étapes précédentes (enquête en plusieurs étapes).
 */
export async function checkAccusation(slug: string, answer: string, found: string[] = []): Promise<AccusationResult> {
  const enquete = getEnquete(String(slug || ""));
  if (!enquete) return { correct: false };
  return accuse(enquete, cleanAnswers(found), String(answer || "").slice(0, 80));
}

/** Retrouve l'étape atteinte à partir des coupables déjà trouvés, gardés sur l'appareil de l'élève. */
export async function resumeEnquete(slug: string, found: string[]): Promise<{ view: PublicEnquete; solved: number } | null> {
  const enquete = getEnquete(String(slug || ""));
  if (!enquete) return null;
  const solved = solvedCount(enquete, cleanAnswers(found));
  return { view: toPublic(enquete, solved), solved };
}
