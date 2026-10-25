"use client";

import type { PublicEnquete as Enquete } from "./types";
import { buildSqlScript, tableToCsv } from "./build";

/** total : nombre réel de lignes quand rows a été raccourci pour la sauvegarde. */
export type QueryResult = { columns: string[]; rows: unknown[][]; total?: number };
export type RunOutcome = { results: QueryResult[]; printed?: string; error?: string; errorLine?: number };

// ---------- SQL (sql.js dans le navigateur) ----------

type SqlDb = { exec: (sql: string) => { columns: string[]; values: unknown[][] }[]; close: () => void };
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
    const results = db.exec(query).map((set) => ({ columns: set.columns, rows: set.values }));
    return { results };
  } catch (error) {
    return { results: [], error: friendlySqlError(error instanceof Error ? error.message : String(error)) };
  } finally {
    db.close();
  }
}

function friendlySqlError(message: string) {
  const noTable = message.match(/no such table: (\w+)/i);
  if (noTable) return `La table « ${noTable[1]} » n'existe pas. Vérifie son nom dans le dossier.`;
  const noColumn = message.match(/no such column: ([\w.]+)/i);
  if (noColumn) return `La colonne « ${noColumn[1]} » n'existe pas. Vérifie son nom (et sa table).`;
  if (/syntax error/i.test(message)) return `Erreur de syntaxe SQL : ${message.replace(/^.*?syntax error/i, "près de").trim()}`;
  if (/ambiguous column/i.test(message)) return "Une colonne existe dans deux tables : précise laquelle, par exemple animaux.id.";
  return message;
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
