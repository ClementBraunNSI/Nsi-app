"use client";

import type { PublicEnquete as Enquete } from "./types";
import { buildSqlScript, tableToCsv } from "./build";

/** total : nombre réel de lignes quand rows a été raccourci pour la sauvegarde. */
export type QueryResult = { columns: string[]; rows: unknown[][]; total?: number };
export type RunOutcome = { results: QueryResult[]; printed?: string; error?: string; errorLine?: number };

// ---------- SQL (sql.js dans le navigateur) ----------

type SqlStatement = { step: () => boolean; get: () => unknown[]; getColumnNames: () => string[]; free: () => boolean };
type SqlStatements = { next: () => { done: true } | { done: false; value: SqlStatement }; getRemainingSQL: () => string };
export type SqlDb = {
  exec: (sql: string) => { columns: string[]; values: unknown[][] }[];
  prepare: (sql: string) => SqlStatement;
  iterateStatements: (sql: string) => SqlStatements;
  close: () => void;
};
type SqlModule = { Database: new () => SqlDb };

let sqlModule: Promise<SqlModule> | null = null;

function loadSql(): Promise<SqlModule> {
  if (!sqlModule) {
    // sql.js n'a pas de types publiés ; SqlModule décrit ce qu'on en utilise.
    // @ts-expect-error module sans déclaration de types
    sqlModule = import("sql.js").then((mod: any) => mod.default({ locateFile: (file: string) => `/sql/${file}` }));
  }
  return sqlModule;
}

/** Exécute une requête sur une base neuve : l'élève ne peut pas abîmer les données de l'enquête. */
export async function runSql(enquete: Enquete, query: string): Promise<RunOutcome> {
  const SQL = await loadSql();
  const db = new SQL.Database();
  try {
    db.exec(buildSqlScript(enquete));
    return runStatements(db, query);
  } catch (error) {
    return { results: [], error: friendlySqlError(errorMessage(error)) };
  } finally {
    db.close();
  }
}

const errorMessage = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** Exécute la requête instruction par instruction : en cas d'erreur, on sait laquelle échoue et on y retrouve le mot fautif. */
export function runStatements(db: SqlDb, query: string): RunOutcome {
  const statements = db.iterateStatements(query);
  const results: QueryResult[] = [];
  let start = 0;
  try {
    for (;;) {
      start = query.length - statements.getRemainingSQL().length;
      const next = statements.next();
      if (next.done) return { results };
      let result: QueryResult | null = null;
      while (next.value.step()) {
        if (!result) results.push((result = { columns: next.value.getColumnNames(), rows: [] }));
        result.rows.push(next.value.get());
      }
    }
  } catch (error) {
    const message = errorMessage(error);
    const rest = query.slice(start);
    const at = locateSqlError(message, rest, (sql) => {
      try {
        db.prepare(sql).free();
        return null;
      } catch (probeError) {
        return errorMessage(probeError);
      }
    });
    // Après une erreur d'exécution, l'itérateur garde le texte de la requête : aller au bout le libère, sans rien exécuter.
    try {
      while (!statements.next().done) continue;
    } catch {
      /* déjà libéré */
    }
    return {
      results: [],
      error: friendlySqlError(message, rest),
      errorLine: at === undefined ? undefined : query.slice(0, start + at).split("\n").length,
    };
  }
}

/** Pour chaque caractère : 0 dans le code, 1 dans un commentaire, 2 à l'intérieur d'un texte ou d'un nom entre guillemets. */
function scanSql(sql: string) {
  const kind = new Uint8Array(sql.length);
  let i = 0;
  while (i < sql.length) {
    const c = sql[i];
    if ((c === "-" && sql[i + 1] === "-") || (c === "/" && sql[i + 1] === "*")) {
      const end = c === "-" ? sql.indexOf("\n", i) : sql.indexOf("*/", i + 2);
      const stop = end < 0 ? sql.length : c === "-" ? end : end + 2;
      kind.fill(1, i, stop);
      i = stop;
    } else if (c === "'" || c === '"' || c === "`" || c === "[") {
      const close = c === "[" ? "]" : c;
      let j = i + 1;
      for (; j < sql.length; j++) {
        if (sql[j] !== close) continue;
        // Un guillemet doublé ('' ou "") ne ferme pas le texte.
        if (close !== "]" && sql[j + 1] === close) j++;
        else break;
      }
      kind.fill(2, i + 1, j + 1);
      i = j + 1;
    } else i++;
  }
  return kind;
}

const WORD = /[\p{L}\p{N}_$]/u;

/** Positions où le mot apparaît dans le code (pas dans un commentaire ni au milieu d'un texte), en mot entier. */
function occurrences(sql: string, kind: Uint8Array, word: string, ignoreCase = false) {
  if (!word) return [];
  const pattern = new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), ignoreCase ? "giu" : "gu");
  const found: number[] = [];
  for (const match of sql.matchAll(pattern)) {
    const at = match.index;
    if (kind[at] !== 0) continue;
    if (WORD.test(word[0]) && WORD.test(sql[at - 1] ?? "")) continue;
    if (WORD.test(word[word.length - 1]) && WORD.test(sql[at + word.length] ?? "")) continue;
    found.push(at);
  }
  return found;
}

/** Position de la parenthèse ouverte qui n'est jamais refermée, s'il y en a une. */
function unclosedParen(sql: string, kind: Uint8Array) {
  const open: number[] = [];
  for (let i = 0; i < sql.length; i++) {
    if (kind[i] !== 0) continue;
    if (sql[i] === "(") open.push(i);
    else if (sql[i] === ")") open.pop();
  }
  return open.pop();
}

/** Premier ou dernier caractère de code (ni espace ni commentaire). */
function codeEdge(sql: string, kind: Uint8Array, from: "start" | "end") {
  const isCode = (i: number) => kind[i] !== 1 && !/\s/.test(sql[i]);
  if (from === "start") {
    for (let i = 0; i < sql.length; i++) if (isCode(i)) return i;
  } else {
    for (let i = sql.length - 1; i >= 0; i--) if (isCode(i)) return i;
  }
  return undefined;
}

/** Dernier mot de la requête (ou dernier symbole), là où elle s'arrête. */
function lastWord(sql: string, kind: Uint8Array) {
  const end = codeEdge(sql, kind, "end");
  if (end === undefined) return "";
  let begin = end;
  if (kind[end] === 2) {
    // Un texte entre guillemets : on remonte jusqu'au guillemet ouvrant.
    while (begin > 0 && kind[begin - 1] === 2) begin--;
    begin = Math.max(0, begin - 1);
  } else {
    const same = WORD.test(sql[end]) ? WORD : /[<>=!|]/;
    while (begin > 0 && same.test(sql[end]) && same.test(sql[begin - 1])) begin--;
  }
  return sql.slice(begin, end + 1);
}

/**
 * Où se trouve l'erreur dans rest (la requête à partir de l'instruction qui échoue).
 * probe prépare un début de requête et renvoie son erreur : un mot peut apparaître plus tôt sans être fautif.
 */
export function locateSqlError(message: string, rest: string, probe?: (sql: string) => string | null) {
  const kind = scanSql(rest);
  const near = message.match(/^near "([\s\S]*)": syntax error$/);
  if (near) {
    const spots = occurrences(rest, kind, near[1]);
    return spots.find((at) => probe?.(rest.slice(0, at + near[1].length)) === message) ?? spots[0];
  }
  const token = message.match(/^unrecognized token: "([\s\S]*)"$/);
  if (token) return occurrences(rest, kind, token[1])[0];
  if (message === "incomplete input") return unclosedParen(rest, kind) ?? codeEdge(rest, kind, "end");
  const name = message.match(/^(?:no such (?:table|column|function)|ambiguous column name): (.+)$/);
  if (name) {
    // Un nom signalé sans table devant est écrit sans table dans la requête.
    const unqualified = (at: number) => name[1].includes(".") || !/\.\s*$/.test(rest.slice(0, at));
    const spot = occurrences(rest, kind, name[1], true).find(unqualified);
    if (spot !== undefined) return spot;
  }
  return codeEdge(rest, kind, "start");
}

/** Un mot trop long ou sur plusieurs lignes est coupé pour le message. */
function clip(text: string) {
  const line = text.split("\n")[0];
  return line.length > 30 || line !== text ? `${line.slice(0, 30).trimEnd()}…` : line;
}

/** Traduit une erreur de sql.js en gardant ce qui l'a provoquée. rest : la requête à partir de l'instruction qui échoue. */
export function friendlySqlError(message: string, rest = "") {
  const near = message.match(/^near "([\s\S]*)": syntax error$/);
  if (near) {
    return `Erreur de syntaxe SQL près de « ${clip(near[1])} ». Vérifie ce mot et ce qui le précède : mot-clé mal écrit, virgule ou parenthèse en trop ou oubliée.`;
  }
  if (message === "incomplete input") {
    const kind = scanSql(rest);
    if (unclosedParen(rest, kind) !== undefined) return "La requête est incomplète : une parenthèse « ( » n'est jamais refermée.";
    const last = lastWord(rest, kind);
    return last ? `La requête est incomplète : elle s'arrête juste après « ${clip(last)} ». Il manque la suite.` : "La requête est incomplète.";
  }
  const token = message.match(/^unrecognized token: "([\s\S]*)"$/);
  if (token) {
    const text = token[1];
    if (text.startsWith("'")) return `Le texte « ${clip(text)} » n'est jamais refermé : il manque l'apostrophe ' de fin.`;
    if (/^["`[]/.test(text)) return `Le nom « ${clip(text)} » n'est jamais refermé : il manque le ${text[0] === "[" ? "crochet ]" : `guillemet ${text[0]}`} de fin.`;
    return `Le symbole « ${clip(text)} » n'existe pas en SQL.`;
  }
  const noTable = message.match(/^no such table: (.+)$/);
  if (noTable) return `La table « ${noTable[1]} » n'existe pas. Vérifie son nom dans le dossier.`;
  const noColumn = message.match(/^no such column: (.+)$/);
  if (noColumn) return `La colonne « ${noColumn[1]} » n'existe pas. Vérifie son nom (et sa table).`;
  const ambiguous = message.match(/^ambiguous column name: (.+)$/);
  if (ambiguous) {
    const table = rest.match(/\bFROM\s+([\p{L}_][\p{L}\p{N}_]*)/iu)?.[1] ?? "table";
    return `La colonne « ${ambiguous[1]} » existe dans plusieurs tables : précise laquelle, par exemple ${table}.${ambiguous[1]}.`;
  }
  const noFunction = message.match(/^no such function: (.+)$/);
  if (noFunction) return `La fonction « ${noFunction[1]} » n'existe pas en SQL. Vérifie son nom.`;
  return message ? `Erreur SQL : ${message}` : "Erreur SQL inconnue.";
}

// ---------- Python (Pyodide dans le navigateur, avec les tables en CSV) ----------

// window.loadPyodide et window.pyodide sont typés dans app/foxtest/global.d.ts.
const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/";
let pyodidePromise: Promise<any> | null = null;

export function loadPython(): Promise<any> {
  if (pyodidePromise) return pyodidePromise;
  pyodidePromise = new Promise((resolve, reject) => {
    const boot = () => {
      if (window.pyodide) return resolve(window.pyodide);
      window
        .loadPyodide!({ indexURL: PYODIDE_URL })
        .then((pyodide) => {
          window.pyodide = pyodide;
          resolve(pyodide);
        })
        .catch(reject);
    };
    if (window.loadPyodide) return boot();
    const script = document.createElement("script");
    script.src = `${PYODIDE_URL}pyodide.js`;
    script.async = true;
    script.onload = boot;
    script.onerror = () => reject(new Error("Impossible de charger Python. Vérifie ta connexion."));
    document.body.appendChild(script);
  }).catch((error) => {
    pyodidePromise = null;
    throw error;
  });
  return pyodidePromise;
}

/** Écrit les CSV de l'enquête dans le dossier de travail de Python, puis exécute le programme. */
export async function runPython(enquete: Enquete, code: string): Promise<RunOutcome> {
  const pyodide = await loadPython();
  const dir = `/enquetes/${enquete.slug}`;
  pyodide.FS.mkdirTree(dir);
  for (const table of enquete.tables) pyodide.FS.writeFile(`${dir}/${table.name}.csv`, tableToCsv(table));
  pyodide.runPython(`import os\nos.chdir(${JSON.stringify(dir)})`);

  const out: string[] = [];
  pyodide.setStdout({ batched: (line: string) => out.push(line) });
  pyodide.setStderr({ batched: (line: string) => out.push(line) });
  try {
    await pyodide.runPythonAsync(code);
    return { results: [], printed: out.join("\n") };
  } catch (error) {
    const raw = error instanceof Error ? error.message : String(error);
    const lineMatch = [...raw.matchAll(/File "<exec>", line (\d+)/g)].pop();
    const last = raw.trim().split("\n").pop() || raw;
    return {
      results: [],
      printed: out.join("\n"),
      error: friendlyPythonError(last),
      errorLine: lineMatch ? Number(lineMatch[1]) : undefined,
    };
  }
}

function friendlyPythonError(line: string) {
  const file = line.match(/FileNotFoundError: .*'(.+?)'/);
  if (file) return `Fichier introuvable : « ${file[1]} ». Les fichiers s'appellent comme les tables, avec .csv (par exemple animaux.csv).`;
  const key = line.match(/KeyError: '(.+?)'/);
  if (key) return `La colonne « ${key[1]} » n'existe pas dans ce fichier. Vérifie son nom dans le dossier.`;
  if (line.startsWith("SyntaxError") || line.startsWith("IndentationError")) return `${line}. Vérifie les deux-points, les parenthèses et l'indentation.`;
  return line;
}
