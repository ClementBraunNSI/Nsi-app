/*
 * Fiche d'un élève dans l'admin : calculs sans base (quartiles d'une évaluation, activité jour par jour),
 * testés dans tests/student-card.test.ts.
 */

const DAY_MS = 86_400_000;
export const HEAT_DAYS = 42;

const parisDay = new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" });

/** Quantile par interpolation linéaire, comme percentile_cont en base. */
export function quantile(sorted: number[], fraction: number) {
  if (sorted.length === 0) return null;
  const position = (sorted.length - 1) * fraction;
  const low = Math.floor(position);
  const high = Math.ceil(position);
  return Math.round((sorted[low] + (sorted[high] - sorted[low]) * (position - low)) * 100) / 100;
}

export type GradeStats = { count: number; mean: number | null; q1: number | null; median: number | null; q3: number | null };

/** Moyenne, Q1, médiane et Q3 des notes validées d'une évaluation. */
export function gradeStats(values: number[]): GradeStats {
  const sorted = [...values].sort((a, b) => a - b);
  return {
    count: sorted.length,
    mean: sorted.length ? Math.round((sorted.reduce((sum, value) => sum + value, 0) / sorted.length) * 100) / 100 : null,
    q1: quantile(sorted, 0.25),
    median: quantile(sorted, 0.5),
    q3: quantile(sorted, 0.75),
  };
}

export type HeatDay = { day: string; count: number; level: 0 | 1 | 2 | 3 };

/**
 * Nombre d'exercices travaillés par jour (heure de Paris) sur les 42 derniers jours, du plus ancien au plus récent.
 * Un même exercice ne compte qu'une fois par jour. Niveau 1 : 1 ou 2 exercices, 2 : 3 à 5, 3 : 6 et plus.
 */
export function activityHeat(rows: { exerciseId: string; at: string | null }[], now: Date): HeatDay[] {
  const seen = new Map<string, Set<string>>();
  for (const row of rows) {
    if (!row.at) continue;
    const day = parisDay.format(new Date(row.at));
    if (!seen.has(day)) seen.set(day, new Set());
    seen.get(day)!.add(row.exerciseId);
  }
  return Array.from({ length: HEAT_DAYS }, (_, index) => {
    const day = parisDay.format(new Date(now.getTime() - (HEAT_DAYS - 1 - index) * DAY_MS));
    const count = seen.get(day)?.size ?? 0;
    return { day, count, level: count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : 3 };
  });
}

/** Exercices travaillés sur les 7 derniers jours. */
export function weekCount(heat: HeatDay[]) {
  return heat.slice(-7).reduce((sum, day) => sum + day.count, 0);
}
