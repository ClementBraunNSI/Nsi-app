import type { Cell, Enquete, PublicEnquete, Table } from "./types";

function sqlValue(value: Cell) {
  if (value === null) return "NULL";
  if (typeof value === "number") return String(value);
  return `'${value.replace(/'/g, "''")}'`;
}

/** Script SQL qui crée et remplit toutes les tables d'une enquête. */
export function buildSqlScript(enquete: PublicEnquete): string {
  return enquete.tables
    .map((table) => {
      const columns = table.columns.map((column) => `${column.name} ${column.type}`).join(", ");
      const rows = table.rows.map((row) => `(${row.map(sqlValue).join(", ")})`).join(",\n  ");
      return `CREATE TABLE ${table.name} (${columns});\nINSERT INTO ${table.name} VALUES\n  ${rows};`;
    })
    .join("\n\n");
}

function csvValue(value: Cell) {
  if (value === null) return "";
  const text = String(value);
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

/** Contenu CSV (séparateur virgule, en-tête en première ligne) d'une table. */
export function tableToCsv(table: Table): string {
  const header = table.columns.map((column) => column.name).join(",");
  const lines = table.rows.map((row) => row.map(csvValue).join(","));
  return `${header}\n${lines.join("\n")}\n`;
}

export function normalizeName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

/** Accepte « Zélie », « zelie », « Zélie la belette »… */
export function isCulprit(enquete: Enquete, answer: string) {
  const guess = normalizeName(answer);
  const culprit = normalizeName(enquete.culprit);
  if (!guess) return false;
  return guess === culprit || guess.split(/[\s,.;'’-]+/).includes(culprit);
}

/** Toutes les colonnes, sous la forme « table.colonne », pour les menus de Blockly. */
export function qualifiedColumns(enquete: PublicEnquete) {
  return enquete.tables.flatMap((table) => table.columns.map((column) => `${table.name}.${column.name}`));
}
