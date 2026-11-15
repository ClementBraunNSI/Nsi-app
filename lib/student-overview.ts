import { quantile } from "./student-card";

/*
 * Cartes des élèves dans l'admin : moyenne des évaluations validées, place par rapport à la moyenne et à la médiane
 * de la classe, rang et distribution pour la jauge. Calcul sans base, testé dans tests/student-overview.test.ts.
 * Seules les évaluations de classe comptent : ni les fiches de rattrapage ni les fiches particulières.
 */

export type GradeRow = { userId: string; total: number };

export type ClassStanding = {
  /** Moyennes des élèves de la classe qui ont au moins une note, triées de la plus basse à la plus haute. */
  averages: number[];
  mean: number | null;
  median: number | null;
};

export type StudentPosition = {
  average: number;
  /** Rang dans la classe : 1 = meilleure moyenne. */
  rank: number;
  count: number;
  /** Part des élèves de la classe dont la moyenne est strictement plus basse, de 0 à 100. */
  beats: number;
  vsMean: number | null;
  vsMedian: number | null;
  tone: "haut" | "milieu" | "bas";
};

const round2 = (value: number) => Math.round(value * 100) / 100;

/** Moyenne des notes validées de chaque élève, et nombre de notes. */
export function studentAverages(rows: GradeRow[]) {
  const sums = new Map<string, { sum: number; count: number }>();
  for (const row of rows) {
    if (!Number.isFinite(row.total)) continue;
    const entry = sums.get(row.userId) ?? { sum: 0, count: 0 };
    entry.sum += row.total;
    entry.count += 1;
    sums.set(row.userId, entry);
  }
  return new Map([...sums].map(([id, { sum, count }]) => [id, { average: round2(sum / count), count }]));
}

/** Moyenne et médiane des moyennes d'une classe. */
export function classStanding(averages: number[]): ClassStanding {
  const sorted = [...averages].sort((a, b) => a - b);
  return {
    averages: sorted,
    mean: sorted.length ? round2(sorted.reduce((sum, value) => sum + value, 0) / sorted.length) : null,
    median: quantile(sorted, 0.5),
  };
}

/** Place d'une moyenne dans sa classe. */
export function studentPosition(average: number, standing: ClassStanding): StudentPosition {
  const { averages, mean, median } = standing;
  const below = averages.filter((value) => value < average).length;
  const above = averages.filter((value) => value > average).length;
  const vsMedian = median === null ? null : round2(average - median);
  return {
    average,
    rank: above + 1,
    count: averages.length,
    beats: averages.length > 1 ? Math.round((below / (averages.length - 1)) * 100) : 100,
    vsMean: mean === null ? null : round2(average - mean),
    vsMedian,
    tone: vsMedian === null ? "milieu" : vsMedian >= 1 ? "haut" : vsMedian <= -1 ? "bas" : "milieu",
  };
}

const decimal = (value: number) => String(Math.round(Math.abs(value) * 100) / 100).replace(".", ",");

/** « 1,5 au-dessus de la médiane », « à la médiane », « 2 sous la médiane ». */
export function gapLabel(gap: number | null, reference: "médiane" | "moyenne") {
  if (gap === null) return "";
  if (Math.abs(gap) < 0.25) return `à la ${reference}`;
  return gap > 0 ? `+${decimal(gap)} sur la ${reference}` : `−${decimal(gap)} sous la ${reference}`;
}

/**
 * Distribution lissée des moyennes de la classe, de 0 à 20, en barres fines (comme un banc d'essai) : chaque moyenne
 * ajoute une petite cloche autour de sa valeur. Hauteur relative de chaque barre, de 0 à 1 ; `count` = moyennes de la barre.
 */
export function distribution(averages: number[], bars = 40, spread = 0.9) {
  const width = 20 / bars;
  const heights = Array.from({ length: bars }, (_, index) => {
    const center = (index + 0.5) * width;
    return averages.reduce((sum, value) => sum + Math.exp(-((value - center) ** 2) / (2 * spread * spread)), 0);
  });
  const peak = Math.max(...heights, 0) || 1;
  return heights.map((height, index) => ({
    height: Math.round((height / peak) * 1000) / 1000,
    count: averages.filter((value) => Math.min(bars - 1, Math.floor(value / width)) === index).length,
  }));
}

/** Dernière évaluation de classe fermée et notée de chaque classe, et les élèves sous le seuil. */
export const CATCH_UP_UNDER = 12;
