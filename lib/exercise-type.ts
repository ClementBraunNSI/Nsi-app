import { isElevatedUser } from "./course-access";

/** Type écrit sur `<ExerciseSection type="...">`. */
export const WRITTEN_EXERCISE_TYPES = ["python", "sql", "lecture", "autre"] as const;
export type WrittenExerciseType = (typeof WRITTEN_EXERCISE_TYPES)[number];

export function readExerciseType(attrs: string): WrittenExerciseType | null {
  const raw = attrs.match(/\btype="([^"]*)"/i)?.[1]?.trim().toLowerCase();
  if (raw === "python" || raw === "sql" || raw === "lecture" || raw === "autre") return raw;
  return null;
}

/** Seule décision : python et sql s'ouvrent dans l'éditeur et comptent pour les badges. */
export function isEditorExercise(type: string | null | undefined): type is "python" | "sql" {
  return type === "python" || type === "sql";
}

/** Élève, invite, admin ou enseignant connecté. Un visiteur sans rôle ne passe pas. */
export function canOpenExerciseIde(role: string | null | undefined) {
  const normalized = (role || "").toLowerCase().trim();
  return normalized === "student" || normalized === "invite" || isElevatedUser(normalized);
}

/** Bouton « Réaliser » : un exercice d'éditeur, pour un élève, un invite, un admin ou un enseignant. */
export function showsRealizeButton(type: string | null | undefined, role: string | null | undefined) {
  return canOpenExerciseIde(role) && isEditorExercise(type);
}

/**
 * Destination de /exercice/[id].
 * `null` laisse l'élève, l'invite, l'admin et l'enseignant sur l'IDE.
 */
export function exercisePageTarget(input: { signedIn: boolean; exercisePath: string }): string | null {
  if (!input.signedIn) return `/connexion?next=${encodeURIComponent(input.exercisePath)}`;
  return null;
}

/** /lab n'est pas l'IDE. L'admin et l'enseignant ne sont pas renvoyés vers /admin. */
export function labPageTarget(input: { signedIn: boolean; elevated: boolean }): string {
  if (!input.signedIn) return "/connexion?next=%2Flab";
  if (input.elevated) return "/";
  return "/espace";
}
