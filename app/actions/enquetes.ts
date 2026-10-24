"use server";

import { isCulprit } from "@/lib/enquetes/build";
import { getEnquete } from "@/lib/enquetes/cases";

export type AccusationResult = { correct: false } | { correct: true; culprit: string; explanation: string };

/** Vérifie l'accusation côté serveur : le nom du coupable n'est jamais envoyé avec l'enquête. */
export async function checkAccusation(slug: string, answer: string): Promise<AccusationResult> {
  const enquete = getEnquete(String(slug || ""));
  const guess = String(answer || "").slice(0, 80);
  if (!enquete || !isCulprit(enquete, guess)) return { correct: false };
  return { correct: true, culprit: enquete.culprit, explanation: enquete.explanation };
}
