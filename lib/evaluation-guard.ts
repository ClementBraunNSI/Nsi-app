/** Règles de surveillance d'une évaluation, partagées par la page de l'élève et le tableau de bord. */

export type IncidentKind =
  | "onglet"
  | "application"
  | "collage"
  | "depot"
  | "double_onglet"
  | "partage_arrete"
  | "fermeture"
  | "reprise";

export const INCIDENT_LABELS: Record<IncidentKind, string> = {
  onglet: "Changement d'onglet ou fenêtre réduite",
  application: "Autre application au premier plan",
  collage: "Collage d'un texte venu d'ailleurs",
  depot: "Texte glissé depuis l'extérieur",
  double_onglet: "Évaluation ouverte dans un second onglet",
  partage_arrete: "Partage d'écran arrêté",
  fermeture: "Page fermée",
  reprise: "Page rouverte",
};

/** Fermeture et réouverture sont notées sans verrouiller : extinction du poste, plantage du navigateur. */
export function incidentLocks(kind: IncidentKind) {
  return kind !== "fermeture" && kind !== "reprise";
}

function squash(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * Un collage est permis s'il recopie du code déjà écrit dans l'éditeur : texte copié ou coupé
 * dans l'évaluation, ou passage présent dans le code d'un des exercices.
 */
export function isAllowedPaste(text: string, copiedInside: Iterable<string>, codes: Iterable<string>) {
  const pasted = squash(text);
  if (!pasted) return true;
  for (const copied of copiedInside) {
    if (squash(copied) === pasted) return true;
  }
  for (const code of codes) {
    if (squash(code).includes(pasted)) return true;
  }
  return false;
}

/** Temps restant lisible : « 12 min 05 s », ou « 1 h 02 min ». */
export function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (hours > 0) return `${hours} h ${String(minutes).padStart(2, "0")} min`;
  return `${minutes} min ${String(seconds).padStart(2, "0")} s`;
}
