export type Cell = string | number | null;

export type Column = {
  name: string;
  type: "INTEGER" | "TEXT";
  description: string;
};

export type Table = {
  name: string;
  description: string;
  columns: Column[];
  rows: Cell[][];
};

/** Une étape d'enquête : un récit, des registres, un coupable à désigner. */
export type Etape = {
  title: string;
  story: string[];
  objective: string;
  /** Registres ouverts à cette étape. Une table qui porte le nom d'une table déjà ouverte la remplace. */
  tables: Table[];
  /** Nom du coupable, comparé sans accents ni majuscules. */
  culprit: string;
  hints: string[];
  explanation: string;
  /** Ce qui relance l'enquête une fois ce coupable désigné. Absent à la dernière étape. */
  twist?: string;
  /** Requêtes de la solution, utilisées par les tests pour vérifier que l'étape se résout. */
  solutionSql: string[];
};

export type Enquete = {
  slug: string;
  numero: number;
  title: string;
  difficulty: "Facile" | "Moyen" | "Difficile";
  /** Notions SQL ou Python que l'enquête fait travailler. */
  skills: string[];
  pitch: string;
  story: string[];
  objective: string;
  tables: Table[];
  /** Nom du coupable, comparé sans accents ni majuscules. */
  culprit: string;
  hints: string[];
  explanation: string;
  /** Requêtes de la solution, utilisées par les tests pour vérifier que l'enquête se résout. */
  solutionSql: string[];
  /** Enquête en plusieurs étapes : titre de la première, puis rebondissement qui ouvre la suivante. */
  stageTitle?: string;
  twist?: string;
  /** Les étapes qui suivent la première. */
  next?: Etape[];
};

/** Une étape déjà élucidée, rappelée dans le dossier des étapes suivantes. */
export type EtapeAcquise = { title: string; culprit: string; explanation: string; twist: string };

/** Ce que le navigateur reçoit : l'étape en cours, sans sa solution ni les étapes à venir. */
export type PublicEnquete = Omit<Enquete, "culprit" | "explanation" | "solutionSql" | "stageTitle" | "twist" | "next"> & {
  stage?: { index: number; total: number; title: string };
  /** Étapes précédentes, avec leur coupable : envoyées seulement après vérification des réponses. */
  solvedStages?: EtapeAcquise[];
};

/** Toutes les étapes d'une enquête, la première comprise. */
export function stagesOf(enquete: Enquete): Etape[] {
  const { stageTitle, title, story, objective, tables, culprit, hints, explanation, twist, solutionSql } = enquete;
  return [{ title: stageTitle ?? title, story, objective, tables, culprit, hints, explanation, twist, solutionSql }, ...(enquete.next ?? [])];
}

/** Registres ouverts à une étape : ceux des étapes précédentes, complétés ou remplacés. */
export function stageTables(enquete: Enquete, index: number): Table[] {
  const tables = new Map<string, Table>();
  for (const stage of stagesOf(enquete).slice(0, index + 1)) {
    for (const table of stage.tables) {
      tables.delete(table.name);
      tables.set(table.name, table);
    }
  }
  // La table des animaux, commune à toutes les enquêtes, reste en fin de liste.
  return [...tables.values()].sort((a, b) => Number(a.name === "animaux") - Number(b.name === "animaux"));
}

/** Vue publique d'une étape. */
export function toPublic(enquete: Enquete, index = 0): PublicEnquete {
  const stages = stagesOf(enquete);
  const stage = stages[Math.min(Math.max(index, 0), stages.length - 1)];
  const at = stages.indexOf(stage);
  const { slug, numero, title, difficulty, skills, pitch } = enquete;
  const view: PublicEnquete = {
    slug,
    numero,
    title,
    difficulty,
    skills,
    pitch,
    story: stage.story,
    objective: stage.objective,
    tables: stageTables(enquete, at),
    hints: stage.hints,
  };
  if (stages.length === 1) return view;
  return {
    ...view,
    stage: { index: at, total: stages.length, title: stage.title },
    solvedStages: stages.slice(0, at).map((done) => ({ title: done.title, culprit: done.culprit, explanation: done.explanation, twist: done.twist ?? "" })),
  };
}
