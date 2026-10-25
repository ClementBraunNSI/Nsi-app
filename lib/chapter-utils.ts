import { contentFolderFromParam, NSI_LEVELS, type NsiLevelId } from "@/lib/nsi-levels";

export type ResourceKind = "cours" | "exercices" | "tp" | "projet";

export function normalizeChapterName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function slugifyChapterName(value: string): string {
  return normalizeChapterName(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Fox of a known level (folder id or public slug). Null when that level has no file of its own. */
export function levelFoxFromNiveau(niveaux: string): string | null {
  const folder = contentFolderFromParam(niveaux.trim());
  if (!folder || !(folder in NSI_LEVELS)) return null;
  if (folder === "particuliers") return null;
  return NSI_LEVELS[folder as NsiLevelId].image;
}

export function chapterImageFromData(niveaux: string, chapterName: string): string | null {
  const folder = contentFolderFromParam(niveaux.trim());
  const key = normalizeChapterName(chapterName);
  const chapterMapLevel1: Record<string, string> = {
    "photographie numerique": "/images/chapitres/1/chap_photo.png",
    internet: "/images/chapitres/1/chap_internet.png",
    localisation: "/images/chapitres/1/chap_geoloc.png",
    web: "/images/chapitres/1/chap_web.png",
    "reseaux sociaux": "/images/chapitres/1/chap_rsx_sociaux.png",
    "reseaux social": "/images/chapitres/1/chap_rsx_sociaux.png",
    "programmation python": "/images/chapitres/1/chap_python.png",
    "donnees structurees": "/images/chapitres/1/chap_donnees.png",
    "micro-controleurs": "/images/chapitres/1/chap_microcontrol.png",
    microcontroleurs: "/images/chapitres/1/chap_microcontrol.png",
    "intelligence artificielle": "/images/chapitres/1/chap_ia.svg",
  };

  const chapterMapLevel2: Record<string, string> = {
    "systemes d'exploitation": "/images/chapitres/2/chap_sys.png",
    "systemes d exploitation": "/images/chapitres/2/chap_sys.png",
    "systemes exploitation": "/images/chapitres/2/chap_sys.png",
    "architecture materielle": "/images/chapitres/2/chap_archi.png",
    "dictionnaires et tables": "/images/chapitres/2/chap_dictio.png",
    "reseaux et internet": "/images/chapitres/2/chap_res.png",
    "web et interaction": "/images/chapitres/2/chap_web.png",
    web: "/images/chapitres/2/chap_web.png",
    algorithmique: "/images/chapitres/2/chap_algo.png",
    "programmation orientee objet": "/images/chapitres/2/chap_poo.png",
    projets: "/images/chapitres/2/chap_web.png",
    "representation des donnees": "/images/chapitres/2/chap_types.png",
    "representation des types de base": "/images/chapitres/2/chap_types.png",
    "structures de donnees lineaires": "/images/chapitres/2/chap_dictio.png",
    histoire: "/images/chapitres/2/chap_archi.png",
    "introduction a python": "/images/chapitres/2/chap_python.png",
  };

  const chapterMapLevel3: Record<string, string> = {
    algorithmique: "/images/chapitres/3/chap_algo.png",
    "structures de donnees": "/images/chapitres/3/chap_structures.png",
    "langages et programmation": "/images/chapitres/3/chap_langages.png",
    "bases de donnees": "/images/chapitres/3/chap_bdd.png",
    "architectures materielles os reseaux": "/images/chapitres/3/chap_archi.png",
    "architectures materielles, os & reseaux": "/images/chapitres/3/chap_archi.png",
    histoire: "/images/chapitres/3/chap_histoire.png",
    entrainement: "/images/chapitres/3/chap_entrainement.png",
    projets: "/images/chapitres/3/chap_projets.png",
  };

  const levelFox = levelFoxFromNiveau(niveaux);
  if (folder === "1") return chapterMapLevel1[key] ?? levelFox;
  if (folder === "2") return chapterMapLevel2[key] ?? levelFox;
  if (folder === "3") return chapterMapLevel3[key] ?? levelFox;
  return levelFox;
}

export function getResourceKind(course: {
  title: string;
  slug: string;
  description: string;
}): ResourceKind {
  const text = normalizeChapterName(`${course.title} ${course.slug} ${course.description}`)
    .replace(/[^a-z0-9]+/g, " ");

  if (/\b(projet|quete)\b/.test(text)) {
    return "projet";
  }
  if (/\b(tp|atelier|activite|labo|lab)\b/.test(text)) {
    return "tp";
  }
  if (/\b(exercice|exercices|fiche)\b/.test(text)) {
    return "exercices";
  }

  return "cours";
}
