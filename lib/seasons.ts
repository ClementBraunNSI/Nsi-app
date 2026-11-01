/**
 * Calendrier des moments de l'année pour le renard de l'accueil. Les dates sont des jours du calendrier de Paris,
 * bornes comprises ; une période peut chevaucher le 31 décembre (début après la fin).
 * Les périodes courtes passent avant les longues : la première qui contient le jour l'emporte.
 */

export type SeasonId =
  | "rentree"
  | "automne"
  | "halloween"
  | "noel"
  | "nouvel-an"
  | "hiver"
  | "poisson-avril"
  | "printemps"
  | "fin-annee"
  | "ete";

/** Jour de l'année au format [mois, jour], mois de 1 à 12. */
type MonthDay = readonly [number, number];

export type Season = { id: SeasonId; label: string; start: MonthDay; end: MonthDay };

export const SEASONS: readonly Season[] = [
  { id: "halloween", label: "Halloween", start: [10, 24], end: [11, 2] },
  { id: "poisson-avril", label: "Poisson d'avril", start: [4, 1], end: [4, 1] },
  { id: "noel", label: "Noël", start: [12, 1], end: [12, 26] },
  { id: "nouvel-an", label: "Nouvel an", start: [12, 27], end: [1, 6] },
  { id: "hiver", label: "Hiver", start: [1, 7], end: [3, 19] },
  { id: "printemps", label: "Printemps", start: [3, 20], end: [5, 31] },
  { id: "fin-annee", label: "Fin d'année", start: [6, 1], end: [7, 5] },
  { id: "ete", label: "Été", start: [7, 6], end: [8, 24] },
  { id: "rentree", label: "Rentrée", start: [8, 25], end: [9, 30] },
  { id: "automne", label: "Automne", start: [10, 1], end: [11, 30] },
];

const SEASON_IDS = new Set<string>(SEASONS.map((season) => season.id));

const parisDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", month: "numeric", day: "numeric" });

/** Mois et jour à Paris pour un instant donné. */
export function parisMonthDay(date: Date): MonthDay {
  const parts = parisDay.formatToParts(date);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return [value("month"), value("day")];
}

const rank = ([month, day]: MonthDay) => month * 100 + day;

function contains(season: Season, day: MonthDay) {
  const at = rank(day);
  const start = rank(season.start);
  const end = rank(season.end);
  return start <= end ? at >= start && at <= end : at >= start || at <= end;
}

/** Période de l'année à Paris pour cet instant. */
export function seasonAt(date: Date): Season {
  const day = parisMonthDay(date);
  return SEASONS.find((season) => contains(season, day)) ?? SEASONS[SEASONS.length - 1];
}

/** Période forcée par `?saison=…` dans l'adresse ; `aucune` retire le décor, une valeur inconnue est ignorée. */
export function seasonOverride(search: string): SeasonId | "aucune" | null {
  const value = new URLSearchParams(search).get("saison");
  if (value === "aucune") return value;
  return value && SEASON_IDS.has(value) ? (value as SeasonId) : null;
}
