export type ColleagueTag = "SNT" | "Première" | "Terminale" | "Outils" | "Bac";

export type Colleague = {
  name: string;
  site: string;
  phrase: string;
  tags: ColleagueTag[];
};

export const COLLEAGUES: Colleague[] = [
  {
    name: "Lucas Relmy",
    site: "https://lucasrelmynsi.gitlab.io/site_cours/",
    phrase:
      "Parcours de Seconde SNT, Première et Terminale NSI, du web et de Python jusqu'aux graphes et aux bases de données.",
    tags: ["Première", "Terminale"],
  },
  {
    name: "Erwan Demerville",
    site: "https://nsi.erwandemerville.fr/",
    phrase:
      "Cours, exercices et sujets de bac de Première et Terminale NSI, avec Python, piles, files et un projet de jeu en Pyxel.",
    tags: ["Première", "Terminale", "Bac"],
  },
  {
    name: "Stéphane Ramstein",
    site: "https://stephane_ramstein.gitlab.io/nsi/",
    phrase:
      "Un portail pour la spécialité NSI : programmes, logiciels, sujets du bac, concours et orientation vers les études d'informatique.",
    tags: ["Première", "Terminale", "Outils", "Bac"],
  },
  {
    name: "Mathieu Marchand",
    site: "https://mmarchand-nsi.github.io/",
    phrase:
      "Cours de Première et de Terminale NSI, projets en Flask, en images et en jeux, et une page d'outils de développement.",
    tags: ["Première", "Terminale", "Outils"],
  },
  {
    name: "Nicolas Leal",
    site: "https://www.prof-leal.fr/",
    phrase:
      "Cours et activités de Seconde SNT, Première et Terminale NSI, des objets numériques aux algorithmes et aux bases de données.",
    tags: ["SNT", "Première", "Terminale"],
  },
  {
    name: "Théo Quertier",
    site: "https://ge0rgi0.github.io/TAQ/",
    phrase:
      "Cours de SNT et de NSI, de la Seconde à la Terminale, autour des réseaux, des données et de la programmation.",
    tags: ["SNT", "Première", "Terminale"],
  },
  {
    name: "Mathieu Cardoso",
    site: "https://profcardoso.github.io/",
    phrase:
      "Sommaire de cours de Seconde SNT, Première et Terminale NSI, avec exercices, liens d'entraînement et un club informatique.",
    tags: ["SNT", "Première", "Terminale"],
  },
  {
    name: "Nicolas Mathieu",
    site: "https://nsi.rocks/",
    phrase:
      "Cours de Seconde, Première et Terminale, fiches mémo et modules interactifs sur le binaire, les tris et les structures de données.",
    tags: ["Première", "Terminale"],
  },
  {
    name: "Timothé Vanoverberghe",
    site: "https://vanoverberghe.github.io/prof/NSI_Tale/index_Tale/",
    phrase:
      "Cours de Terminale NSI, de la programmation objet aux graphes, et une banque de sujets d'épreuve pratique corrigés.",
    tags: ["Terminale", "Bac"],
  },
  {
    name: "Perrine Clabau",
    site: "https://nsi_clabau.gitlab.io/",
    phrase:
      "Cours de Première NSI en Python, des fonctions aux boucles, et parcours SNT sur le web, Internet et la photographie.",
    tags: ["Première", "SNT"],
  },
  {
    name: "Corentin Dupont",
    site: "https://www.lycode.xyz/",
    phrase:
      "Cours de Seconde SNT, Première et Terminale NSI, du web et des réseaux jusqu'aux épreuves du bac et au Grand Oral.",
    tags: ["Première", "SNT", "Terminale"],
  },
  {
    name: "Florian Mathieu",
    site: "https://florianmathieu.prof/ ",
    phrase:
      "Outils d'apprentissage pour créer son sujet de bac, de veille informatique et cours de la seconde à la Terminale NSI. ",
    tags: ["Première", "SNT", "Terminale"],
  }
  
];

export const COLLEAGUE_TAG_ORDER: ColleagueTag[] = [
  "SNT",
  "Première",
  "Terminale",
  "Outils",
  "Bac",
];

export function lastNameOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] ?? name;
}

export function colleaguesAlphabetical(colleagues: Colleague[] = COLLEAGUES): Colleague[] {
  return [...colleagues].sort((a, b) => {
    const byLast = lastNameOf(a.name).localeCompare(lastNameOf(b.name), "fr", { sensitivity: "base" });
    if (byLast !== 0) return byLast;
    return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
  });
}

export function orderedTags(tags: ColleagueTag[]): ColleagueTag[] {
  return COLLEAGUE_TAG_ORDER.filter((tag) => tags.includes(tag));
}

export const HOMEPAGE_EXAMPLES = ["Nicolas Leal", "Timothé Vanoverberghe", "Stéphane Ramstein"];

export function colleagueByName(name: string): Colleague {
  const colleague = COLLEAGUES.find((item) => item.name === name);
  if (!colleague) throw new Error(`Collègue introuvable : ${name}`);
  return colleague;
}
