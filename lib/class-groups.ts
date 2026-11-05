/** Valeur d'un filtre de classe pour les élèves sans classe. */
export const NO_CLASS = "__sans_classe__";

/** Libellé du groupe des élèves de classe dont la classe n'est pas renseignée. */
export const NO_CLASS_LABEL = "Sans classe";

/**
 * Regroupe des élèves par classe, dans l'ordre des classes (1NSI1 avant 1NSI2, 1NSI10 après 1NSI9),
 * « Sans classe » en dernier. L'ordre des élèves dans chaque classe est gardé.
 */
export function classGroups<T>(items: T[], classeOf: (item: T) => string | null | undefined) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const key = classeOf(item)?.trim() || "";
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }
  return [...groups]
    .sort(([a], [b]) => (a ? (b ? a.localeCompare(b, "fr", { numeric: true }) : -1) : b ? 1 : 0))
    .map(([key, list]) => ({ key: key || NO_CLASS, label: key || NO_CLASS_LABEL, items: list }));
}
