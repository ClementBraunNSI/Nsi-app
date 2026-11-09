import { INCIDENT_LABELS, type IncidentKind } from "./evaluation-guard";
import { formatGrade, type CopyGrade } from "./evaluation-grade";

/** Copie d'un élève, prête à être écrite dans un fichier texte (un fichier par élève). */
export type ExportedAttempt = {
  studentName: string;
  classe: string | null;
  subjectLabel: string;
  status: string;
  startedAt: string | null;
  submittedAt: string | null;
  incidents: { kind: IncidentKind; createdAt: string; detail: string }[];
  exercises: { id: string; label: string; type: "python" | "sql" }[];
  answers: Record<string, { code: string; passed: boolean | null; testsPassed: number | null; testsTotal: number | null }>;
  /** Note calculée (tests et vérifications de l'enseignant). */
  grade?: CopyGrade;
};

/** État de la note : définitive, ou provisoire avec ce qui reste à faire. */
export function gradeStatus(grade: CopyGrade) {
  if (grade.final) return "validée";
  const parts = [
    grade.pendingReview ? `${grade.pendingReview} exercice${grade.pendingReview > 1 ? "s" : ""} signalé${grade.pendingReview > 1 ? "s" : ""}` : "",
    grade.ungraded ? `${grade.ungraded} pas encore corrigé${grade.ungraded > 1 ? "s" : ""}` : "",
  ].filter(Boolean);
  return `à valider${parts.length ? ` (${parts.join(", ")})` : ""}`;
}

const csvCell = (value: string) => (/[;"\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);
const decimal = (value: number) => String(value).replace(".", ",");

/**
 * Notes d'une évaluation en CSV (séparateur « ; », virgule décimale : s'ouvre tel quel dans un tableur français).
 * Une colonne par exercice du sujet le plus long ; un sujet plus court laisse ses dernières colonnes vides.
 */
export function gradesCsv(rows: { studentName: string; classe: string | null; subjectLabel: string; grade: CopyGrade }[]) {
  const width = Math.max(0, ...rows.map((row) => row.grade.exercises.length));
  const header = ["Classe", "Élève", "Sujet", "Note sur 20", "État", ...Array.from({ length: width }, (_, index) => `Exercice ${index + 1}`)];
  const lines = rows.map((row) => [
    row.classe ?? "",
    row.studentName,
    row.subjectLabel,
    decimal(row.grade.total),
    gradeStatus(row.grade),
    ...Array.from({ length: width }, (_, index) => {
      const exercise = row.grade.exercises[index];
      return exercise ? `${decimal(exercise.points)} / ${decimal(exercise.max)}` : "";
    }),
  ]);
  return `\uFEFF${[header, ...lines].map((line) => line.map(csvCell).join(";")).join("\r\n")}\r\n`;
}

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short", timeStyle: "medium", timeZone: "Europe/Paris" });

function when(value: string | null) {
  return value ? dateFormat.format(new Date(value)) : "—";
}

export function attemptText(evaluationTitle: string, attempt: ExportedAttempt) {
  const lines: string[] = [
    `# Évaluation : ${evaluationTitle}`,
    `# Élève : ${attempt.studentName}${attempt.classe ? ` (${attempt.classe})` : ""}`,
    `# Sujet : ${attempt.subjectLabel}`,
    `# Début : ${when(attempt.startedAt)}`,
    `# Rendu : ${attempt.status === "rendue" ? when(attempt.submittedAt) : "pas encore rendue"}`,
  ];

  if (attempt.grade) lines.push(`# Note : ${formatGrade(attempt.grade.total)}, ${gradeStatus(attempt.grade)}`);
  const graded = attempt.exercises.filter((exercise) => attempt.answers[exercise.id]?.passed !== null && attempt.answers[exercise.id]?.passed !== undefined);
  if (graded.length > 0) {
    const passed = graded.filter((exercise) => attempt.answers[exercise.id]?.passed).length;
    lines.push(`# Correction automatique : ${passed} / ${attempt.exercises.length} exercices réussis`);
  }

  if (attempt.incidents.length > 0) {
    lines.push(`# Incidents (${attempt.incidents.length}) :`);
    for (const incident of attempt.incidents) {
      const detail = incident.detail ? ` — ${incident.detail.replace(/\s+/g, " ").slice(0, 160)}` : "";
      lines.push(`#   ${when(incident.createdAt)} : ${INCIDENT_LABELS[incident.kind] ?? incident.kind}${detail}`);
    }
  } else {
    lines.push("# Incidents : aucun");
  }

  for (const exercise of attempt.exercises) {
    const answer = attempt.answers[exercise.id];
    const comment = exercise.type === "sql" ? "--" : "#";
    lines.push("", "", `${comment} ${"=".repeat(70)}`, `${comment} ${exercise.label} (${exercise.type})`);
    if (answer?.testsTotal) {
      lines.push(`${comment} Tests réussis : ${answer.testsPassed ?? 0} / ${answer.testsTotal}${answer.passed ? " — exercice réussi" : ""}`);
    }
    const exerciseGrade = attempt.grade?.exercises.find((item) => item.id === exercise.id);
    if (exerciseGrade) {
      const how = exerciseGrade.manual ? " (donnés à la main)" : exerciseGrade.needsReview && !exerciseGrade.reviewed ? " (à vérifier)" : "";
      lines.push(`${comment} Points : ${decimal(exerciseGrade.points)} / ${decimal(exerciseGrade.max)}${how}`);
    }
    lines.push(`${comment} ${"=".repeat(70)}`, "");
    lines.push(answer?.code?.trim() ? answer.code.replace(/\s+$/, "") : `${comment} (aucun code écrit)`);
  }
  return `${lines.join("\n")}\n`;
}

/** Nom de fichier sans accents ni caractères spéciaux : « 1NSI1_Dupont_Alice.txt ». */
export function attemptFileName(studentName: string, classe: string | null) {
  const safe = (value: string) =>
    value.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return `${[classe, studentName].filter(Boolean).map((part) => safe(String(part))).join("_") || "eleve"}.txt`;
}
