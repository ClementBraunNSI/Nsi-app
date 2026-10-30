/**
 * Sujet d'évaluation écrit par l'enseignant, au même format que les fiches :
 * des blocs <ExerciseSection id="..." label="..." type="python|sql"> avec <Enonce>, <CodeDepart>,
 * <BaseSQL>, <Verification> (tests) et <Correction>.
 * La partie « exercises » part chez l'élève ; « grading » (tests, correction) reste côté enseignant.
 */

export type EvaluationExercise = {
  id: string;
  label: string;
  type: "python" | "sql";
  statement: string;
  starter: string;
  sqlSetup: string;
  packages: string[];
};

export type EvaluationGrading = {
  id: string;
  verification: string;
  correction: string;
};

export type ParsedSubject = {
  exercises: EvaluationExercise[];
  grading: EvaluationGrading[];
  /** Problèmes bloquants : le sujet n'est pas enregistré. */
  errors: string[];
  /** Remarques : le sujet est enregistré, mais l'enseignant doit le savoir. */
  warnings: string[];
};

function dedent(text: string) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  let indent = Infinity;
  for (const line of lines) {
    if (!line.trim()) continue;
    indent = Math.min(indent, line.match(/^[ \t]*/)![0].length);
  }
  if (indent === Infinity) return text.trim();
  return lines.map((line) => line.slice(Math.min(indent, line.match(/^[ \t]*/)![0].length))).join("\n").trim();
}

/** Contenu d'une balise, sans indentation commune ni clôture de bloc de code. */
function block(source: string, tag: string) {
  const match = source.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`));
  if (!match) return "";
  return dedent(match[1])
    .replace(/^```[a-z]*\s*\n?/i, "")
    .replace(/\n?```\s*$/, "")
    .trim();
}

function statementOf(raw: string) {
  const enonce = raw.match(/<Enonce>([\s\S]*?)<\/Enonce>/)?.[1] ?? raw;
  return dedent(
    enonce
      .replace(/<Correction>[\s\S]*?<\/Correction>/gi, "")
      .replace(/<Verification>[\s\S]*?<\/Verification>/gi, "")
      .replace(/<CodeDepart>[\s\S]*?<\/CodeDepart>/gi, "")
      .replace(/<BaseSQL>[\s\S]*?<\/BaseSQL>/gi, ""),
  );
}

const attr = (attrs: string, name: string) => attrs.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1]?.trim() ?? "";

export function parseEvaluationSubject(source: string): ParsedSubject {
  const exercises: EvaluationExercise[] = [];
  const grading: EvaluationGrading[] = [];
  const errors: string[] = [];
  const warnings: string[] = [];
  const seen = new Set<string>();
  // Une base SQL écrite hors exercice sert aux exercices SQL qui n'ont pas la leur.
  const sharedSql = block(source.replace(/<ExerciseSection\b[\s\S]*?<\/ExerciseSection>/g, ""), "BaseSQL");

  const sections = [...source.matchAll(/<ExerciseSection\b([^>]*)>([\s\S]*?)<\/ExerciseSection>/g)];
  sections.forEach((match, index) => {
    const attrs = match[1];
    const raw = match[2];
    const label = attr(attrs, "label") || `Exercice ${index + 1}`;
    let id = attr(attrs, "id") || `exercice-${index + 1}`;
    const type = attr(attrs, "type").toLowerCase() || "python";

    if (type !== "python" && type !== "sql") {
      errors.push(`« ${label} » : le type « ${type} » n'est pas possible en évaluation (python ou sql).`);
      return;
    }
    if (seen.has(id)) {
      warnings.push(`« ${label} » : l'identifiant « ${id} » est déjà pris, il devient « ${id}-${index + 1} ».`);
      id = `${id}-${index + 1}`;
    }
    seen.add(id);

    const statement = statementOf(raw);
    const verification = block(raw, "Verification");
    if (!statement) errors.push(`« ${label} » : l'énoncé est vide.`);
    if (!verification) warnings.push(`« ${label} » : pas de <Verification>, le code sera récupéré mais pas corrigé automatiquement.`);
    const sqlSetup = type === "sql" ? block(raw, "BaseSQL") || sharedSql : "";
    if (type === "sql" && !sqlSetup) warnings.push(`« ${label} » : exercice SQL sans <BaseSQL>.`);

    exercises.push({
      id,
      label,
      type,
      statement,
      starter: block(raw, "CodeDepart"),
      sqlSetup,
      packages: attr(attrs, "packages").split(",").map((name) => name.trim()).filter(Boolean),
    });
    grading.push({ id, verification, correction: block(raw, "Correction") });
  });

  if (sections.length === 0) errors.push("Aucun bloc <ExerciseSection> : le sujet ne contient pas d'exercice.");
  return { exercises, grading, errors, warnings };
}

/** Modèle proposé dans l'administration pour écrire un nouveau sujet. */
export const SUBJECT_TEMPLATE = `<ExerciseSection id="ex1" label="Exercice 1 - Somme de deux nombres" type="python">
<Enonce>
Écrire une fonction \`somme(a, b)\` qui renvoie la somme des deux nombres \`a\` et \`b\`.

Exemple : \`somme(2, 3)\` renvoie \`5\`.
</Enonce>
<CodeDepart>
def somme(a, b):
    pass
</CodeDepart>
<Verification>
assert somme(2, 3) == 5, "somme(2, 3) doit renvoyer 5."
assert somme(-1, 1) == 0, "somme(-1, 1) doit renvoyer 0."
</Verification>
<Correction>
def somme(a, b):
    return a + b
</Correction>
</ExerciseSection>
`;
