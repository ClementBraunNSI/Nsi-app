import type { SeasonId } from "@/lib/seasons";
import { s, type SeasonArt } from "./shared";

/** Un fichier par période : le navigateur ne télécharge que le décor du moment, après l'affichage de la page. */
const LOADERS: Record<SeasonId, () => Promise<{ default: SeasonArt }>> = {
  rentree: () => import("./rentree"),
  automne: () => import("./automne"),
  halloween: () => import("./halloween"),
  noel: () => import("./noel"),
  "nouvel-an": () => import("./nouvel-an"),
  hiver: () => import("./hiver"),
  "poisson-avril": () => import("./poisson-avril"),
  printemps: () => import("./printemps"),
  "fin-annee": () => import("./fin-annee"),
  ete: () => import("./ete"),
};

/** Décor de la période, chaque slot enveloppé pour apparaître en fondu et se mettre en pause hors de l'écran. */
export async function loadSeasonArt(id: SeasonId): Promise<SeasonArt> {
  const { default: art } = await LOADERS[id]();
  return Object.fromEntries(
    Object.entries(art).map(([slot, node]) => [slot, <g key={slot} className={s.layer}>{node}</g>]),
  ) as SeasonArt;
}

export type { SeasonArt };
