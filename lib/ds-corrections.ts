/** Corrections de DS : contrôle de la saisie de l'enseignant, avant l'écriture en base. */

export const DS_MAX_MARKDOWN = 200000;

export type DsCorrectionInput = {
  title: string;
  classes: string[];
  /** Date et heure de mise à disposition (ISO). */
  visibleAt: string;
  subject: string;
  correction: string;
};

export function cleanDsClasses(classes: string[]) {
  return [...new Set(classes.map((value) => value.trim()).filter(Boolean))].sort();
}

/** Message d'erreur à afficher, ou null si la saisie est complète. */
export function checkDsInput(input: DsCorrectionInput): string | null {
  const title = input.title.trim();
  if (!title || title.length > 200) return 'Le titre doit faire entre 1 et 200 caractères.';
  const classes = cleanDsClasses(input.classes);
  if (classes.length === 0) return 'Au moins une classe doit être choisie.';
  if (classes.length > 40) return 'Pas plus de 40 classes.';
  if (!input.visibleAt || Number.isNaN(Date.parse(input.visibleAt))) return 'La date de mise à disposition est obligatoire.';
  if (input.subject.length > DS_MAX_MARKDOWN || input.correction.length > DS_MAX_MARKDOWN) return 'Un texte dépasse 200 000 caractères.';
  if (!input.subject.trim() && !input.correction.trim()) return 'Le sujet ou la correction doit être fourni.';
  return null;
}

/** Ligne de la table ds_corrections, saisie déjà contrôlée. */
export function dsRow(input: DsCorrectionInput) {
  return {
    title: input.title.trim(),
    classes: cleanDsClasses(input.classes),
    visible_at: new Date(input.visibleAt).toISOString(),
    subject_md: input.subject,
    correction_md: input.correction,
  };
}
