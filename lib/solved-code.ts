import { attemptFileName } from "./evaluation-export";

export { NO_CLASS } from "./class-groups";

/** Dernière version réussie du travail d'un élève sur un exercice (tests passés ou validée par l'enseignant). */
export type SolvedEntry = {
  id: string;
  userId: string;
  studentName: string;
  classe: string | null;
  exerciseId: string;
  exerciseLabel: string;
  courseId: string;
  courseTitle: string;
  type: "python" | "sql" | "reponse";
  status: "auto" | "validee";
  /** Nombre de versions réussies gardées pour cet exercice ; seule la dernière est montrée. */
  versions: number;
  solvedAt: string;
  content?: string;
};

/** Une ligne réussie par élève et par exercice : la plus récente. */
export function latestSolved<T extends { user_id: string; exercise_id: string; created_at: string }>(rows: T[]) {
  const latest = new Map<string, { row: T; versions: number }>();
  for (const row of rows) {
    const key = `${row.user_id}\u0000${row.exercise_id}`;
    const seen = latest.get(key);
    if (!seen) latest.set(key, { row, versions: 1 });
    else {
      seen.versions += 1;
      if (Date.parse(row.created_at) > Date.parse(seen.row.created_at)) seen.row = row;
    }
  }
  return [...latest.values()];
}

/** Tri pour l'affichage et l'export : classe (sans classe en dernier), élève, fiche, puis exercice. */
export function compareSolved(a: SolvedEntry, b: SolvedEntry) {
  const byClass = a.classe ? (b.classe ? a.classe.localeCompare(b.classe, "fr", { numeric: true }) : -1) : b.classe ? 1 : 0;
  return (
    byClass ||
    a.studentName.localeCompare(b.studentName, "fr") ||
    a.courseTitle.localeCompare(b.courseTitle, "fr") ||
    a.exerciseLabel.localeCompare(b.exerciseLabel, "fr", { numeric: true })
  );
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Paris" });

/** Codes réussis d'un élève dans un seul fichier texte, regroupés par fiche. */
export function solvedCodeText(student: { name: string; classe: string | null }, entries: SolvedEntry[]) {
  const lines: string[] = [
    `# Élève : ${student.name}${student.classe ? ` (${student.classe})` : ""}`,
    `# Exercices réussis : ${entries.length}`,
  ];
  let course = "";
  for (const entry of entries) {
    if (entry.courseTitle !== course) {
      course = entry.courseTitle;
      lines.push("", "", `# ${"#".repeat(70)}`, `# Fiche : ${course}`, `# ${"#".repeat(70)}`);
    }
    const comment = entry.type === "sql" ? "--" : "#";
    const how = entry.status === "validee" ? "validé par l'enseignant" : "tests réussis";
    lines.push(
      "",
      `${comment} ${"=".repeat(70)}`,
      `${comment} ${entry.exerciseLabel} (${entry.type}) — ${how} le ${dateFormat.format(new Date(entry.solvedAt))}`,
      `${comment} ${"=".repeat(70)}`,
      "",
      entry.content?.trim() ? entry.content.replace(/\s+$/, "") : `${comment} (code vide)`,
    );
  }
  return `${lines.join("\n")}\n`;
}

/** Un fichier par élève ; deux élèves au même nom dans la même classe prennent un numéro. */
export function solvedCodeFiles(entries: SolvedEntry[]) {
  const byStudent = new Map<string, SolvedEntry[]>();
  for (const entry of [...entries].sort(compareSolved)) {
    const list = byStudent.get(entry.userId) ?? [];
    list.push(entry);
    byStudent.set(entry.userId, list);
  }
  const used = new Map<string, number>();
  return [...byStudent.values()].map((list) => {
    const { studentName, classe } = list[0];
    let name = attemptFileName(studentName, classe);
    const count = used.get(name) ?? 0;
    used.set(name, count + 1);
    if (count > 0) name = name.replace(/\.txt$/, `_${count + 1}.txt`);
    return { name, content: solvedCodeText({ name: studentName, classe }, list) };
  });
}
