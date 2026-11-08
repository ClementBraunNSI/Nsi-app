/**
 * Code au-dessus du niveau de l'élève : constructions Python rarement vues à ce niveau, ou typiques d'un code
 * généré (docstrings, annotations de type, commentaires en anglais). Une construction n'est signalée que si la
 * correction de l'exercice ne l'emploie pas elle-même.
 */

/** Rang des niveaux : SNI et SNT, Première, Terminale, BTS. Une construction est attendue à partir de son rang. */
const LEVEL_RANK: Record<string, number> = { SNI: 0, SNT: 1, "1NSI": 2, TNSI: 3, SIO: 4 };
const NEVER = 9;

type Construct = { id: string; label: string; from: number; test: (code: CodeParts) => number | null };
type CodeParts = { code: string; lines: string[]; comments: string[]; source: string };

/** Le code sans les chaînes ni les commentaires (pour ne pas confondre un mot dans un texte avec une instruction). */
function split(source: string): CodeParts {
  const comments: string[] = [];
  const code = source
    .replace(/("""|''')[\s\S]*?\1/g, (match) => match.replace(/[^\n]/g, " "))
    .replace(/(["'])(?:\\.|(?!\1)[^\\\n])*\1/g, (match) => match[0] + " ".repeat(Math.max(0, match.length - 2)) + match[0])
    .replace(/#.*$/gm, (match) => {
      comments.push(match.slice(1).trim());
      return " ".repeat(match.length);
    });
  return { code, lines: code.split("\n"), comments, source };
}

/** Première ligne (numérotée à partir de 1) qui vérifie le motif, ou null. */
function lineOf(lines: string[], pattern: RegExp) {
  const index = lines.findIndex((line) => pattern.test(line));
  return index === -1 ? null : index + 1;
}

const ALLOWED_IMPORTS = new Set(["math", "random", "time", "turtle", "csv", "sqlite3", "matplotlib", "pyplot", "folium", "PIL"]);
const ENGLISH = /\b(the|this|that|returns?|function|list of|if the|check|loop|iterate|calculate|value|number of|empty)\b/i;

const CONSTRUCTS: Construct[] = [
  {
    id: "comprehension",
    label: "liste ou dictionnaire en compréhension",
    from: 3,
    test: ({ lines }) => lineOf(lines, /[[{(][^\]})]*\bfor\b[^\]})]*\bin\b/),
  },
  { id: "lambda", label: "fonction lambda", from: 4, test: ({ lines }) => lineOf(lines, /\blambda\b/) },
  {
    id: "ternaire",
    label: "expression conditionnelle « a if c else b »",
    from: 3,
    test: ({ lines }) => lineOf(lines, /^\s*(?!if\b|elif\b|else\b|while\b).*\bif\b.+\belse\b/),
  },
  { id: "try", label: "try / except", from: 3, test: ({ lines }) => lineOf(lines, /^\s*(try|except\b.*)\s*:/) },
  { id: "with", label: "bloc with", from: 3, test: ({ lines }) => lineOf(lines, /^\s*with\b.+:/) },
  { id: "decorateur", label: "décorateur @", from: NEVER, test: ({ lines }) => lineOf(lines, /^\s*@\w/) },
  { id: "yield", label: "générateur (yield)", from: NEVER, test: ({ lines }) => lineOf(lines, /\byield\b/) },
  { id: "morse", label: "opérateur :=", from: NEVER, test: ({ lines }) => lineOf(lines, /:=/) },
  {
    id: "annotations",
    label: "annotations de type (x: int, -> bool)",
    from: 4,
    test: ({ lines }) => lineOf(lines, /^\s*def\s+\w+\s*\([^)]*\w\s*:\s*[A-Za-z_]|\)\s*->\s*\w/),
  },
  { id: "raise", label: "lever une exception (raise)", from: 3, test: ({ lines }) => lineOf(lines, /\braise\b/) },
  { id: "enumerate", label: "enumerate()", from: 3, test: ({ lines }) => lineOf(lines, /\benumerate\s*\(/) },
  { id: "zip", label: "zip()", from: 3, test: ({ lines }) => lineOf(lines, /\bzip\s*\(/) },
  { id: "map", label: "map() ou filter()", from: 4, test: ({ lines }) => lineOf(lines, /\b(map|filter)\s*\(/) },
  { id: "any", label: "any() ou all()", from: 3, test: ({ lines }) => lineOf(lines, /\b(any|all)\s*\(/) },
  { id: "sorted-key", label: "tri avec key=", from: 3, test: ({ lines }) => lineOf(lines, /\b(sorted|sort|max|min)\s*\(.*\bkey\s*=/) },
  { id: "isinstance", label: "isinstance()", from: 3, test: ({ lines }) => lineOf(lines, /\bisinstance\s*\(/) },
  { id: "pas", label: "tranche avec un pas ([::-1])", from: 3, test: ({ lines }) => lineOf(lines, /\[[^\]]*:[^\]]*:[^\]]*\]/) },
  { id: "join", label: "str.join()", from: 3, test: ({ lines }) => lineOf(lines, /\.join\s*\(/) },
  { id: "classe", label: "classe (POO)", from: 3, test: ({ lines }) => lineOf(lines, /^\s*class\s+\w+/) },
  { id: "global", label: "global ou nonlocal", from: NEVER, test: ({ lines }) => lineOf(lines, /^\s*(global|nonlocal)\b/) },
  { id: "main", label: "if __name__ == \"__main__\"", from: NEVER, test: ({ lines }) => lineOf(lines, /__name__\s*==/) },
  {
    id: "import",
    label: "import d'un module non vu en cours",
    from: 4,
    test: ({ lines }) => {
      const index = lines.findIndex((line) => {
        const match = line.match(/^\s*(?:from|import)\s+([\w.]+)/);
        return Boolean(match && !ALLOWED_IMPORTS.has(match[1].split(".")[0]));
      });
      return index === -1 ? null : index + 1;
    },
  },
  {
    id: "docstring",
    label: "docstring (texte \"\"\" sous une fonction)",
    from: NEVER,
    test: ({ source }) => {
      const lines = source.split("\n");
      const index = lines.findIndex((line, position) => /^\s*("""|''')/.test(line) && /^\s*(def|class)\b/.test(lines[position - 1] ?? ""));
      return index === -1 ? null : index + 1;
    },
  },
  {
    id: "anglais",
    label: "commentaires en anglais",
    from: NEVER,
    test: ({ comments, source }) => {
      if (comments.filter((comment) => ENGLISH.test(comment)).length < 2) return null;
      const index = source.split("\n").findIndex((line) => {
        const hash = line.indexOf("#");
        return hash !== -1 && ENGLISH.test(line.slice(hash + 1));
      });
      return index === -1 ? null : index + 1;
    },
  },
];

export type LevelFlag = { id: string; label: string; line: number | null };

/**
 * Constructions présentes dans le code de l'élève, au-dessus de son niveau, que la correction n'utilise pas.
 * `level` : SNI, SNT, 1NSI, TNSI ou SIO (un niveau inconnu compte comme la Première).
 */
export function codeAboveLevel(code: string, level: string, reference = ""): LevelFlag[] {
  if (!code.trim()) return [];
  const rank = LEVEL_RANK[level] ?? 2;
  const student = split(code);
  const expected = reference.trim() ? split(reference) : null;
  const flags: LevelFlag[] = [];
  for (const construct of CONSTRUCTS) {
    if (rank >= construct.from) continue;
    const line = construct.test(student);
    if (line === null) continue;
    if (expected && construct.test(expected) !== null) continue;
    flags.push({ id: construct.id, label: construct.label, line });
  }
  return flags;
}

export type ForbiddenUse = { word: string; line: number };

/**
 * Mots-clés interdits présents dans le code (hors chaînes et commentaires), avec la première ligne où chacun apparaît.
 * Sert aux exercices de défi qui imposent d'écrire sans for, sans while…
 */
export function forbiddenWordsUsed(code: string, words: string[]): ForbiddenUse[] {
  if (!words.length || !code.trim()) return [];
  const { lines } = split(code);
  const uses: ForbiddenUse[] = [];
  for (const word of words) {
    const pattern = new RegExp(String.raw`(^|[^\w.])${word.replace(/[^\w]/g, "")}(?!\w)`);
    const index = lines.findIndex((line) => pattern.test(line));
    if (index !== -1) uses.push({ word, line: index + 1 });
  }
  return uses;
}
