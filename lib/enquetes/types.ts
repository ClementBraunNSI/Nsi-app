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
};

/** Ce que le navigateur reçoit : tout, sauf la solution. */
export type PublicEnquete = Omit<Enquete, "culprit" | "explanation" | "solutionSql">;

export function toPublic({ culprit: _culprit, explanation: _explanation, solutionSql: _solution, ...rest }: Enquete): PublicEnquete {
  return rest;
}
