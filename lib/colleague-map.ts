import {
  colleaguesAlphabetical,
  COLLEAGUES,
  type Colleague,
  type ColleagueTerritory,
} from "./colleagues";

/** Taille du dessin de la carte (unités du viewBox). */
export const MAP_W = 1000;
export const MAP_H = 640;
/** Entrée de la tanière, d'où partent les sentiers. */
export const DEN = { x: 500, y: 330 };

export type Territory = {
  label: string;
  color: string;
  /** Centre de l'étiquette du territoire. */
  labelX: number;
  labelY: number;
  /** Emplacements libres pour les terriers, dans l'ordre de remplissage. */
  slots: Array<[number, number]>;
};

export const TERRITORY_ORDER: ColleagueTerritory[] = ["SNT", "Première", "Terminale", "Bac"];

export const TERRITORIES: Record<ColleagueTerritory, Territory> = {
  SNT: {
    label: "Prairie de Seconde",
    color: "#3b82f6",
    labelX: 290,
    labelY: 622,
    slots: [[110, 470], [260, 440], [140, 560], [340, 545], [400, 470], [60, 600]],
  },
  "Première": {
    label: "Forêt de Première",
    color: "#f97316",
    labelX: 190,
    labelY: 70,
    slots: [[130, 190], [280, 150], [210, 290], [400, 280], [70, 300]],
  },
  Terminale: {
    label: "Montagnes de Terminale",
    color: "#a855f7",
    labelX: 790,
    labelY: 60,
    slots: [[700, 230], [860, 250], [940, 150], [660, 140]],
  },
  Bac: {
    label: "Rocher du bac",
    color: "#e11d48",
    labelX: 900,
    labelY: 622,
    slots: [[690, 480], [880, 525], [760, 585], [660, 600]],
  },
};

export type ColleaguePin = {
  colleague: Colleague;
  territory: ColleagueTerritory;
  x: number;
  y: number;
};

/** Range chaque collègue dans son territoire, par ordre alphabétique des noms. */
export function placeColleagues(colleagues: Colleague[] = COLLEAGUES): ColleaguePin[] {
  const used: Partial<Record<ColleagueTerritory, number>> = {};
  return colleaguesAlphabetical(colleagues).map((colleague) => {
    const territory = colleague.territory;
    const index = used[territory] ?? 0;
    used[territory] = index + 1;
    const slot = TERRITORIES[territory].slots[index];
    if (!slot) throw new Error(`Plus de place dans le territoire ${territory} : ajouter un emplacement dans lib/colleague-map.ts`);
    return { colleague, territory, x: slot[0], y: slot[1] };
  });
}
