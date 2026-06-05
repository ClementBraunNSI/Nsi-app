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

export function levelFoxFromNiveau(niveaux: string): string {
  const normalized = niveaux.trim();
  if (["0", "1", "2", "3", "4"].includes(normalized)) {
    return `/images/fox_${normalized}.png`;
  }
  return "/images/fox_2.png";
}

export function chapterImageFromData(niveaux: string, chapterName: string): string {
  const normalizedLevel = niveaux.trim();
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
    "programmation orientee objet": "/images/chapitres/1/chap_python.png",
    projets: "/images/chapitres/2/chap_web.png",
    "representation des donnees": "/images/chapitres/1/chap_donnees.png",
    "structures de donnees lineaires": "/images/chapitres/2/chap_dictio.png",
    histoire: "/images/chapitres/2/chap_archi.png",
    "introduction a python": "/images/chapitres/1/chap_python.png",
  };

  const chapterMapLevel3: Record<string, string> = {
    algorithmique: "/images/chapitres/2/chap_algo.png",
    "structures de donnees": "/images/chapitres/2/chap_dictio.png",
    "langages et programmation": "/images/chapitres/1/chap_python.png",
    "bases de donnees": "/images/chapitres/2/chap_dictio.png",
    "architectures materielles os reseaux": "/images/chapitres/2/chap_res.png",
    "architectures materielles, os & reseaux": "/images/chapitres/2/chap_res.png",
    histoire: "/images/chapitres/2/chap_archi.png",
    entrainement: "/images/chapitres/2/chap_algo.png",
    projets: "/images/chapitres/2/chap_web.png",
  };

  if (normalizedLevel === "1") {
    return chapterMapLevel1[key] ?? levelFoxFromNiveau(niveaux);
  }
  if (normalizedLevel === "2") {
    return chapterMapLevel2[key] ?? levelFoxFromNiveau(niveaux);
  }
  if (normalizedLevel === "3") {
    return chapterMapLevel3[key] ?? levelFoxFromNiveau(niveaux);
  }

  return levelFoxFromNiveau(niveaux);
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
