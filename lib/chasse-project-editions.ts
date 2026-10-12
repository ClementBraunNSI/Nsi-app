import { coursePath, getNsiLevel } from "./nsi-levels";

/** Illustration historique du projet. Les éditions françaises et les premières la conservent. */
export const CHASSE_BASE_IMAGE = "/images/fox_chasse_renard.png";

export const CHASSE_EN_IMAGE = "/images/fox_chasse_renard_anglais_v2.png";
export const CHASSE_ES_IMAGE = "/images/fox_chasse_renard_espagnol_v2.png";

export const CHASSE_PROJECT_SLUGS = {
  original: "Projet_Chasse_aux_ren_arts",
  anglais: "Projet_Chasse_aux_ren_arts_anglais",
  espagnol: "Projet_Chasse_aux_ren_arts_espagnol",
} as const;

export type ChasseYear = "2026-2027" | "premieres";
export type ChasseLang = "fr" | "en" | "es";

const CHASSE_SLUGS = new Set<string>(Object.values(CHASSE_PROJECT_SLUGS));

export function isChasseProjectSlug(slug: string) {
  return CHASSE_SLUGS.has(slug);
}

/**
 * Seconde ne propose jamais les premières : ni sur la carte du chapitre, ni sur les fiches.
 * Sur un autre niveau, la carte et la fiche française les gardent ; l'anglais et l'espagnol les masquent.
 */
export function chasseShowsPremieresChoice(niveaux?: string, activeSlug?: string) {
  if (niveaux && getNsiLevel(niveaux).audience === "Seconde") return false;
  if (!activeSlug) return true;
  return activeSlug === CHASSE_PROJECT_SLUGS.original;
}

export function chasseImage(year: ChasseYear, lang: ChasseLang) {
  if (year === "2026-2027" && lang === "en") return CHASSE_EN_IMAGE;
  if (year === "2026-2027" && lang === "es") return CHASSE_ES_IMAGE;
  return CHASSE_BASE_IMAGE;
}

export function chasseSelectionFromSlug(
  slug: string,
  editionParam?: string | null
): { year: ChasseYear; lang: ChasseLang } {
  if (slug === CHASSE_PROJECT_SLUGS.anglais) return { year: "2026-2027", lang: "en" };
  if (slug === CHASSE_PROJECT_SLUGS.espagnol) return { year: "2026-2027", lang: "es" };
  if (editionParam === "2026-2027") return { year: "2026-2027", lang: "fr" };
  return { year: "premieres", lang: "fr" };
}

export function chasseEditionHref(niveaux: string, year: ChasseYear, lang: ChasseLang) {
  if (year === "premieres") return coursePath(niveaux, CHASSE_PROJECT_SLUGS.original);
  if (lang === "en") return coursePath(niveaux, CHASSE_PROJECT_SLUGS.anglais);
  if (lang === "es") return coursePath(niveaux, CHASSE_PROJECT_SLUGS.espagnol);
  return `${coursePath(niveaux, CHASSE_PROJECT_SLUGS.original)}?edition=2026-2027`;
}

export function chasseImageAlt(year: ChasseYear, lang: ChasseLang) {
  if (year === "2026-2027" && lang === "en") {
    return "Illustration du projet Chasse aux Ren'Arts, édition 2026-2027 en anglais";
  }
  if (year === "2026-2027" && lang === "es") {
    return "Illustration du projet Chasse aux Ren'Arts, édition 2026-2027 en espagnol";
  }
  if (year === "2026-2027") {
    return "Illustration du projet Chasse aux Ren'Arts, édition 2026-2027 en français";
  }
  return "Illustration du projet Chasse aux Ren'Arts, éditions premières";
}
