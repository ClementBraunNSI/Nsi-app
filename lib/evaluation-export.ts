import { INCIDENT_LABELS, type IncidentKind } from "./evaluation-guard";

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
};

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
