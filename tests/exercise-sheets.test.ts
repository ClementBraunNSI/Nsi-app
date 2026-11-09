import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { everyTestPassed } from "../lib/python-check";
import { runPythonCheck } from "../lib/run-exercise-check";
import { extractHints, splitStatement, stripHiddenExerciseBlocks } from "../lib/exercise-statement";

/** Fiches d'exercices refondues : niveaux, indices progressifs et corrections vérifiées. */
const SHEETS = [
  "1/Fiche_exercices_python.md",
  "1/Fiche_exercices_conditions.md",
  "1/Fiche_exercices_boucles.md",
  "2/python_exercices_types.md",
  "2/python_exercices_conditions.md",
  "2/python_exercices_boucles.md",
  "2/python_exercices_listes.md",
  "2/python_exercices_papier.md",
  "2/python_exercices_dictionnaires.md",
  "2/python_csv_exercices.md",
  "2/algo_tris_exercices_fusion.md",
  "2/algo_knn_exercices.md",
  "2/donnees_booleens_exercices.md",
  "2/poo_exercices.md",
  "3/listes-comprehension-exercices.md",
  "3/exercices_poo.md",
  "3/exercices_terminale_fondamentaux.md",
  "particuliers/anatole/exercices-revision-poo.md",
];

/** Fiches de révision : trois exercices par niveau, sans mini-projet ; mêmes règles pour les indices et les tests. */
const REVISION_SHEETS = ["2/python_exercices_revision_types_fonctions.md"];

const LEVELS = ["Introduction", "Facile", "Moyen", "Difficile", "Expert"];

type Section = {
  sheet: string;
  id: string;
  label: string;
  level: string;
  type: string;
  enonce: string;
  correction: string;
  verification: string;
};

function dedent(text: string) {
  const lines = text.replace(/\r/g, "").split("\n");
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop();
  const indents = lines.filter((line) => line.trim()).map((line) => line.search(/\S/));
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((line) => line.slice(Math.min(min, line.search(/\S|$/)))).join("\n");
}

/** Code d'un bloc ```python ... ``` (ou le texte brut s'il n'y a pas de bloc). */
function fenced(block: string) {
  const text = dedent(block);
  const match = text.match(/```[a-z]*\n([\s\S]*?)\n```/);
  return (match ? match[1] : text).trim();
}

function read(sheet: string) {
  return matter(fs.readFileSync(path.join(process.cwd(), "content", sheet), "utf8")).content.replace(/\r/g, "");
}

function sectionsOf(sheet: string): Section[] {
  const out: Section[] = [];
  for (const match of read(sheet).matchAll(/<ExerciseSection\b([^>]*)>([\s\S]*?)<\/ExerciseSection>/g)) {
    const attrs = match[1];
    const body = match[2];
    const label = attrs.match(/\blabel="([^"]*)"/)?.[1] ?? "";
    out.push({
      sheet,
      id: attrs.match(/\bid="([^"]*)"/)?.[1] ?? "",
      label,
      level: label.match(/\[([^\]]+)\]/)?.[1] ?? "",
      type: attrs.match(/\btype="([^"]*)"/)?.[1] ?? "",
      enonce: body.match(/<Enonce>([\s\S]*?)<\/Enonce>/)?.[1] ?? "",
      correction: fenced(body.match(/<Correction>([\s\S]*?)<\/Correction>/)?.[1] ?? ""),
      verification: fenced(body.match(/<Verification>([\s\S]*?)<\/Verification>/)?.[1] ?? ""),
    });
  }
  return out;
}

async function pool<T>(items: T[], size: number, work: (item: T) => Promise<void>) {
  const queue = [...items];
  await Promise.all(Array.from({ length: size }, async () => {
    while (queue.length) await work(queue.shift() as T);
  }));
}

describe("hints in an exercise statement", () => {
  const enonce = [
    "Écrire le programme.",
    "<Indices>",
    "<Indice>Penser à `range`.</Indice>",
    "<Indice>",
    "```text",
    "POUR i ALLANT DE 1 À n",
    "```",
    "</Indice>",
    "</Indices>",
    "<Correction>",
    "```python",
    "print(1)",
    "```",
    "</Correction>",
  ].join("\n");

  it("keeps hints on the student page but drops the correction", () => {
    const sent = stripHiddenExerciseBlocks(enonce);
    expect(sent).toContain("<Indice>");
    expect(sent).not.toContain("print(1)");
  });

  it("gives the editor the hints in order, the pseudo-code last, outside the énoncé", () => {
    const parts = splitStatement(enonce, "Exercice");
    expect(parts.hints).toEqual(["Penser à `range`.", "```text\nPOUR i ALLANT DE 1 À n\n```"]);
    expect(parts.enonce).toBe("Écrire le programme.");
  });
});

describe("reworked exercise sheets", () => {
  // SHEET=boucles npx vitest run tests/exercise-sheets.test.ts : une seule fiche, le temps de l'écrire.
  const only = process.env.SHEET;
  const sheets = only ? SHEETS.filter((sheet) => sheet.includes(only)) : SHEETS;
  const revisions = only ? REVISION_SHEETS.filter((sheet) => sheet.includes(only)) : REVISION_SHEETS;
  const all = [...sheets, ...revisions].flatMap(sectionsOf);

  it.each(sheets)("%s has 4 exercises or more on each of the 5 levels, and mini-projects", (sheet) => {
    const sections = all.filter((section) => section.sheet === sheet);
    for (const level of LEVELS) {
      expect(sections.filter((section) => section.level === level).length, `${sheet} ${level}`).toBeGreaterThanOrEqual(4);
    }
    expect(sections.filter((section) => section.level === "Mini-projet").length, `${sheet} Mini-projet`).toBeGreaterThanOrEqual(1);
    expect(sections.every((section) => [...LEVELS, "Mini-projet"].includes(section.level)), `${sheet} niveau inconnu`).toBe(true);
  });

  it.each(revisions)("%s has exactly 3 exercises on each of the 5 levels", (sheet) => {
    const sections = all.filter((section) => section.sheet === sheet);
    for (const level of LEVELS) {
      expect(sections.filter((section) => section.level === level).length, `${sheet} ${level}`).toBe(3);
    }
    expect(sections).toHaveLength(15);
  });

  it("gives every exercise hints that end with pseudo-code, and no correction in the énoncé", () => {
    for (const section of all) {
      const where = `${section.sheet} ${section.id}`;
      const { hints } = extractHints(section.enonce);
      expect(hints.length, `${where} : au moins 2 indices`).toBeGreaterThanOrEqual(2);
      expect(hints.at(-1), `${where} : le dernier indice est un pseudo-code`).toMatch(/^```text\n/);
      expect(section.type, where).toBe("python");
      expect(section.correction, `${where} : correction`).not.toBe("");
      expect(section.verification, `${where} : tests`).toMatch(/\bassert\b/);
    }
  });

  it("uses exercise ids found nowhere else on the site", () => {
    const ids = new Map<string, string>();
    const walk = (dir: string) => {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) walk(full);
        else if (/\.mdx?$/.test(name)) {
          for (const match of fs.readFileSync(full, "utf8").matchAll(/<ExerciseSection\b[^>]*\bid="([^"]*)"/g)) {
            expect(ids.get(match[1]), `id ${match[1]} en double`).toBeUndefined();
            ids.set(match[1], full);
          }
        }
      }
    };
    walk(path.join(process.cwd(), "content"));
  });

  it("passes every correction through its own tests, and rejects an empty program", async () => {
    const failures: string[] = [];
    await pool(all, 6, async (section) => {
      const report = await runPythonCheck(section.correction, section.verification);
      if (!everyTestPassed(report)) {
        const failed = report.tests?.filter((test) => !test.ok).map((test) => `${test.label} ${test.detail ?? ""}`) ?? [];
        failures.push(`${section.sheet} ${section.id} : ${report.error || failed.join(" | ") || report.status}`);
      }
      const empty = await runPythonCheck("pass", section.verification);
      if (everyTestPassed(empty)) failures.push(`${section.sheet} ${section.id} : un programme vide passe les tests`);
    });
    expect(failures).toEqual([]);
  }, 1_800_000);
});
