import type { EvaluationExercise } from "./evaluation-subject";

/** Réponse de l'élève à un exercice du défi. */
export type ChallengeAnswer = { code: string; passed: boolean; attempts: number };

/** Défi tel que l'élève le reçoit : énoncés sans tests, corrections seulement une fois le défi fermé. */
export type MyChallenge = {
  id: string;
  title: string;
  opensAt: string;
  closesAt: string;
  open: boolean;
  /** Temps pour faire le défi, compté depuis l'ouverture de la page ; null : pas de limite. */
  timeLimitMinutes: number | null;
  exercises: EvaluationExercise[];
  corrections: { id: string; correction: string }[] | null;
  mine: {
    code: string;
    attempts: number;
    passed: boolean;
    firstPassedAt: string | null;
    startedAt?: string | null;
    answers?: Record<string, ChallengeAnswer>;
  } | null;
  classPassed: number;
  classSize: number;
};

/** Marge accordée après la fin du chrono, pour une vérification lancée à la dernière seconde. */
export const CHALLENGE_GRACE_MS = 30_000;

/** Fin du temps de l'élève (en millisecondes), ou null sans limite ou chrono pas encore parti. */
export function challengeDeadline(startedAt: string | null | undefined, timeLimitMinutes: number | null | undefined) {
  if (!startedAt || !timeLimitMinutes) return null;
  return Date.parse(startedAt) + timeLimitMinutes * 60_000;
}

/** Le défi est réussi quand chaque exercice l'est. */
export function allExercisesPassed(exerciseIds: string[], answers: Record<string, ChallengeAnswer> | undefined) {
  return exerciseIds.length > 0 && exerciseIds.every((id) => answers?.[id]?.passed);
}

/**
 * Série de défis réussis à la suite, du plus récent au plus ancien.
 * Le défi de la semaine encore ouvert et pas encore réussi ne casse pas la série.
 */
export function challengeStreak(challenges: Pick<MyChallenge, "open" | "opensAt" | "mine">[]) {
  const ordered = [...challenges].sort((a, b) => Date.parse(b.opensAt) - Date.parse(a.opensAt));
  let streak = 0;
  for (const [index, challenge] of ordered.entries()) {
    if (challenge.mine?.passed) {
      streak += 1;
      continue;
    }
    if (index === 0 && challenge.open) continue;
    break;
  }
  return streak;
}

export type ChallengeAchievement = { id: string; title: string; description: string; image: string; streak: number };

/** Succès du défi du lundi : le premier réussi, puis des séries de semaines consécutives. */
export const CHALLENGE_ACHIEVEMENTS: ChallengeAchievement[] = [
  { id: "defi_premier", title: "Premier défi", description: "Un premier défi du lundi réussi.", image: "/images/succes/defi_premier.png", streak: 1 },
  { id: "defi_serie_3", title: "Trois lundis de suite", description: "Trois défis réussis, trois semaines de suite.", image: "/images/succes/defi_serie_3.png", streak: 3 },
  { id: "defi_serie_5", title: "Cinq lundis de suite", description: "Cinq défis réussis, cinq semaines de suite.", image: "/images/succes/defi_serie_5.png", streak: 5 },
  { id: "defi_serie_10", title: "Le renard du lundi", description: "Dix défis réussis, dix semaines de suite.", image: "/images/succes/defi_serie_10.png", streak: 10 },
];

export function challengeAchievement(id: string) {
  return CHALLENGE_ACHIEVEMENTS.find((item) => item.id === id) ?? null;
}

/** Succès mérités avec cette série (le serveur n'enregistre que ceux qui manquent). */
export function earnedChallengeAchievements(streak: number) {
  return CHALLENGE_ACHIEVEMENTS.filter((item) => streak >= item.streak).map((item) => item.id);
}

/** Décalage de Paris (heure d'été ou d'hiver) à une date donnée, en minutes. */
function parisOffsetMinutes(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Paris",
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"));
  return Math.round((asUtc - date.getTime()) / 60000);
}

/** Instant UTC d'une heure de Paris, pour une date « AAAA-MM-JJ ». */
export function parisTime(day: string, hour: number, minute = 0) {
  const [year, month, date] = day.split("-").map(Number);
  const guess = new Date(Date.UTC(year, month - 1, date, hour, minute));
  return new Date(guess.getTime() - parisOffsetMinutes(guess) * 60000);
}

/** Prochain lundi (aujourd'hui compris si on est lundi avant l'ouverture), au format « AAAA-MM-JJ ». */
export function nextMonday(from = new Date(), openingHour = 7, openingMinute = 30) {
  for (let offset = 0; offset < 8; offset += 1) {
    const day = new Date(from.getTime() + offset * 86_400_000);
    const iso = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(day);
    const weekday = new Intl.DateTimeFormat("en-US", { timeZone: "Europe/Paris", weekday: "short" }).format(day);
    if (weekday === "Mon" && parisTime(iso, openingHour, openingMinute).getTime() > from.getTime()) return iso;
  }
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(from);
}

/** Modèle proposé pour écrire un nouveau défi : un ou plusieurs blocs <ExerciseSection>, chacun avec ses tests. */
export const CHALLENGE_TEMPLATE = `<ExerciseSection id="defi" label="Défi : nombres pairs" type="python">
<Enonce>
Écrire une fonction \`pairs(liste)\` qui renvoie la liste des nombres pairs de \`liste\`, dans le même ordre.

Exemple : \`pairs([1, 2, 3, 4])\` renvoie \`[2, 4]\`.
</Enonce>
<CodeDepart>
def pairs(liste):
    pass
</CodeDepart>
<Verification>
assert pairs([1, 2, 3, 4]) == [2, 4], "pairs([1, 2, 3, 4]) doit renvoyer [2, 4]."
assert pairs([]) == [], "Une liste vide donne une liste vide."
assert pairs([7, 9]) == [], "Aucun nombre pair : liste vide."
</Verification>
<Correction>
def pairs(liste):
    resultat = []
    for n in liste:
        if n % 2 == 0:
            resultat.append(n)
    return resultat
</Correction>
</ExerciseSection>
`;
