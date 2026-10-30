export const NSI_LEVEL_ORDER = ['0', '1', '2', '3', '4', 'ressources', 'particuliers'] as const;

/**
 * Niveaux qui ne sont pas des parcours de classe : `ressources` (cours en plus, ouverts à tous,
 * un dossier par langage) et `particuliers` (cours des élèves suivis en ce moment, un dossier par élève).
 * Quand un élève arrête, ses pages passent dans `ressources/<langage>/` avec `audience: public`.
 */
export const NESTED_LEVELS = new Set(['ressources', 'particuliers']);

export const NSI_LEVELS = {
  '0': {
    urlSlug: 'sni',
    label: 'SNI',
    short: 'SNI',
    audience: 'Découverte',
    description: 'Les bases du numérique et de l\'informatique, pour démarrer sans prérequis.',
    image: '/images/fox_0.png',
    profileCode: 'SNI',
    featured: false,
  },
  '1': {
    urlSlug: 'snt',
    label: 'SNT',
    short: '2de',
    audience: 'Seconde',
    description: 'Photo, web, données, réseaux et premiers pas en Python.',
    image: '/images/fox_1.png',
    profileCode: 'SNT',
    featured: false,
  },
  '2': {
    urlSlug: '1nsi',
    label: 'Première NSI',
    short: '1re',
    audience: 'Première',
    description: 'Algorithmique, Python et structures de données, le cœur du programme.',
    image: '/images/fox_2.png',
    profileCode: '1NSI',
    featured: true,
  },
  '3': {
    urlSlug: 'tnsi',
    label: 'Terminale NSI',
    short: 'Tle',
    audience: 'Terminale',
    description: 'Récursivité, bases de données, réseaux et préparation au bac.',
    image: '/images/fox_3.png',
    profileCode: 'TNSI',
    featured: false,
  },
  '4': {
    urlSlug: 'sio',
    label: 'BTS SIO',
    short: 'BTS',
    audience: 'Post-bac',
    description: 'Services informatiques aux organisations, pour aller plus loin après le lycée.',
    image: '/images/fox_4.png',
    profileCode: 'SIO',
    featured: false,
  },
  ressources: {
    urlSlug: 'ressources',
    label: 'Ressources supplémentaires',
    short: 'Plus',
    audience: 'Ouvert à tous',
    description: 'Cours et exercices en plus des programmes, triés par langage. Accessibles sans compte.',
    image: '/images/fox_c.svg',
    profileCode: '',
    featured: false,
  },
  particuliers: {
    urlSlug: 'particuliers',
    label: 'Cours particuliers',
    short: 'Perso',
    audience: 'Sur invitation',
    description: 'Fiches préparées pour les élèves suivis en cours particuliers.',
    image: '/images/fox_2.png',
    profileCode: '',
    featured: false,
  },
} as const;

export type NsiLevelId = keyof typeof NSI_LEVELS;

const URL_SLUG_TO_FOLDER: Record<string, string> = Object.fromEntries(
  Object.entries(NSI_LEVELS).map(([folder, meta]) => [meta.urlSlug, folder]),
);

export type NsiLevelMeta = {
  id: string;
  folder: string;
  urlSlug: string;
  label: string;
  short: string;
  audience: string;
  description: string;
  image: string;
  profileCode: string;
  featured: boolean;
};

export function contentFolderFromParam(param: string): string | null {
  const raw = decodeURIComponent(param || "").trim();
  if (!raw || raw.includes("..") || raw.includes("/") || raw.includes("\\") || raw.includes("\0")) {
    return null;
  }
  if (raw in URL_SLUG_TO_FOLDER) return URL_SLUG_TO_FOLDER[raw];
  if (raw in NSI_LEVELS) return raw;
  return null;
}

export function urlSlugFromFolder(folder: string): string {
  const entry = NSI_LEVELS[folder as NsiLevelId];
  return entry?.urlSlug ?? folder;
}

export function coursePath(levelParamOrFolder: string, slug?: string): string {
  const folder = contentFolderFromParam(levelParamOrFolder) ?? levelParamOrFolder;
  const urlSlug = urlSlugFromFolder(folder);
  if (!slug) return `/cours/${urlSlug}`;
  const slugPath = slug
    .split("/")
    .filter(Boolean)
    .map((part) => encodeURIComponent(part))
    .join("/");
  return `/cours/${urlSlug}/${slugPath}`;
}

export function nsiLevelLabel(niveaux: string): string {
  const folder = contentFolderFromParam(niveaux);
  const entry = folder ? NSI_LEVELS[folder as NsiLevelId] : undefined;
  return entry?.label ?? `Niveau ${niveaux}`;
}

/** Nom de niveau dans les titres des pages publiques (le modèle du layout ajoute la marque). */
export function seoLevelName(niveaux: string): string {
  const folder = contentFolderFromParam(niveaux);
  if (folder === "1") return "SNT seconde";
  return nsiLevelLabel(niveaux);
}

export function getNsiLevel(niveaux: string): NsiLevelMeta {
  const folder = contentFolderFromParam(niveaux) ?? niveaux.trim();
  const entry = NSI_LEVELS[folder as NsiLevelId];
  if (entry) {
    return { id: entry.urlSlug, folder, ...entry };
  }
  return {
    id: folder,
    folder,
    urlSlug: folder,
    label: `Niveau ${folder}`,
    short: folder,
    audience: "Cours",
    description: "Ressources de ce parcours.",
    image: "/images/fox_2.png",
    profileCode: "",
    featured: false,
  };
}

export function sortLevelIds(ids: string[]): string[] {
  return [...ids].sort((a, b) => {
    const ia = (NSI_LEVEL_ORDER as readonly string[]).indexOf(a);
    const ib = (NSI_LEVEL_ORDER as readonly string[]).indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b, "fr");
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}

export function profileCodeToLevelId(code: string): string | null {
  for (const [id, meta] of Object.entries(NSI_LEVELS)) {
    if (meta.profileCode === code) return id;
  }
  return null;
}

export function canonicalAppPath(pathname: string): string | null {
  const path = pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;

  if (path === "/niveaux") return "/";
  if (path === "/login" || path === "/auth/login") return "/connexion";
  if (path === "/fox" || path === "/foxtest") return "/academie";
  if (path === "/admin/dashboard") return "/admin";
  if (path === "/student/dashboard") return "/espace";
  if (path === "/student/courses") return "/espace/cours";

  const niveauxMatch = path.match(/^\/niveaux\/([^/]+)(\/.*)?$/);
  if (niveauxMatch) {
    const folder = contentFolderFromParam(niveauxMatch[1]);
    if (!folder) return `/cours${niveauxMatch[2] || ""}`;
    return `${coursePath(folder)}${niveauxMatch[2] || ""}`;
  }

  // Anciennes adresses du niveau « Programmation en C » (/cours/c) : le C est passé dans les ressources.
  const oldCMatch = path.match(/^\/cours\/c(\/.*)?$/);
  if (oldCMatch) {
    const rest = oldCMatch[1] || "";
    if (!rest) return coursePath("ressources");
    const cleo = rest.match(/^\/cleo\/(.+)$/);
    if (cleo) return coursePath("ressources", `c/${cleo[1]}`);
    return `${coursePath("particuliers")}${rest}`;
  }

  const coursMatch = path.match(/^\/cours\/([^/]+)(\/.*)?$/);
  if (coursMatch) {
    const folder = contentFolderFromParam(coursMatch[1]);
    if (!folder) return null;
    const next = `${coursePath(folder)}${coursMatch[2] || ""}`;
    return next === pathname ? null : next;
  }

  return null;
}
