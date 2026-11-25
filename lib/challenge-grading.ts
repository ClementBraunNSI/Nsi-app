/*
 * Défi du lundi noté comme une évaluation : sujet repris du défi (sans les niveaux bonus, qui ne comptent pas
 * dans la note) et copies des élèves reprises de leurs réponses. Fonctions pures.
 */

export type ChallengeAnswerRow = { code?: string | null; passed?: boolean | null };

/** Titre de l'évaluation liée : « Défi du lundi : Mot de passe et températures ». */
export function challengeEvaluationTitle(title: string) {
  return `Défi du lundi : ${title}`.slice(0, 200);
}

/** Source du défi sans les blocs de niveau bonus (attribut suite="…") : seuls les exercices obligatoires sont notés. */
export function withoutBonusLevels(source: string) {
  return source
    .replace(/<ExerciseSection\b[^>]*\bsuite\s*=\s*["'][^"']*["'][^>]*>[\s\S]*?<\/ExerciseSection>\s*/g, "")
    .trim()
    .concat("\n");
}

/** Code de chaque exercice noté, tiré des réponses enregistrées pendant le défi (les exercices vides sont laissés). */
export function challengeAnswerCodes(answers: unknown, exerciseIds: string[]): Record<string, string> {
  const result: Record<string, string> = {};
  if (!answers || typeof answers !== "object") return result;
  for (const id of exerciseIds) {
    const answer = (answers as Record<string, ChallengeAnswerRow | undefined>)[id];
    const code = typeof answer?.code === "string" ? answer.code : "";
    if (code.trim()) result[id] = code.slice(0, 60000);
  }
  return result;
}

/** Heure de remise d'une copie : la fin du défi pour l'élève, sinon la fermeture du défi (ou maintenant s'il est encore ouvert). */
export function challengeSubmittedAt(finishedAt: string | null, closesAt: string, now = Date.now()) {
  if (finishedAt) return finishedAt;
  return Date.parse(closesAt) < now ? closesAt : new Date(now).toISOString();
}

/** Durée de l'évaluation liée : le temps du défi, dans les bornes acceptées par les évaluations (5 à 600 minutes). */
export function challengeDuration(minutes: number | null) {
  return minutes && minutes >= 5 ? Math.min(minutes, 600) : null;
}
