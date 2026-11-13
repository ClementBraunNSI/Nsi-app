/*
 * Classe affichée dans tout l'admin : choisie une fois dans la barre du haut, gardée dans un cookie de session
 * (pas de date d'expiration, rien d'autre que le nom de la classe). "" = toutes les classes.
 */

export const ADMIN_CLASS_COOKIE = "admin_classe";
/** Valeur du sélecteur pour les élèves en cours particuliers. */
export const ADMIN_PRIVATE = "__particuliers__";

export type AdminClassChoice = { value: string; label: string };

/** Choix du sélecteur : toutes les classes, chaque classe, puis les cours particuliers s'il y en a. */
export function adminClassChoices(classes: string[], hasPrivate: boolean): AdminClassChoice[] {
  return [
    { value: "", label: "Toutes" },
    ...classes.map((name) => ({ value: name, label: name })),
    ...(hasPrivate ? [{ value: ADMIN_PRIVATE, label: "Particuliers" }] : []),
  ];
}

/** Valeur lue dans le cookie, ramenée à un choix qui existe encore. */
export function cleanAdminClass(raw: string | undefined | null, classes: string[], hasPrivate: boolean) {
  let value = raw ?? "";
  try {
    value = decodeURIComponent(value);
  } catch {
    value = "";
  }
  if (value === ADMIN_PRIVATE) return hasPrivate ? value : "";
  return classes.includes(value) ? value : "";
}

/** L'élève fait-il partie de la sélection ? */
export function inAdminClass(selection: string, student: { classe?: string | null; has_private_lessons?: boolean | null; privateLesson?: boolean }) {
  if (!selection) return true;
  const isPrivate = Boolean(student.has_private_lessons ?? student.privateLesson);
  if (selection === ADMIN_PRIVATE) return isPrivate;
  return !isPrivate && (student.classe ?? "").trim() === selection;
}

/** Un élément lié à des classes (évaluation, défi, annonce…) concerne-t-il la sélection ? */
export function touchesAdminClass(selection: string, classes: (string | null | undefined)[] | null | undefined) {
  if (!selection) return true;
  if (selection === ADMIN_PRIVATE) return false;
  return (classes ?? []).some((name) => (name ?? "").trim() === selection);
}

/** Libellé court de la sélection : « 1NSI1 », « Particuliers », « Toutes les classes ». */
export function adminClassLabel(selection: string) {
  if (!selection) return "Toutes les classes";
  return selection === ADMIN_PRIVATE ? "Cours particuliers" : selection;
}
