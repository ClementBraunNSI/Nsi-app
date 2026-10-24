/**
 * Regroupement de fiches, déclaré dans l'en-tête de chaque fiche :
 *
 * - `groupe: chasse-renarts` et `groupeTitre: "…"` : la fiche appartient à ce groupe ;
 * - `version: Anglais` et `versionCode: EN` : variantes d'une même activité (choix de langue) ;
 *   sans `versionCode`, le groupe réunit le cours, les exercices et le TP d'une notion ;
 * - `groupeRole: annexe` : fiche rattachée (fichiers à télécharger…), proposée dans la fenêtre de choix
 *   mais pas comme une entrée de la liste.
 *
 * Sur la page d'un niveau, un groupe occupe une seule tuile ; un clic ouvre la fenêtre de choix.
 */

export type CourseGroupRef = {
  id: string;
  title: string;
  version?: string;
  code?: string;
  image?: string;
  annex?: boolean;
};

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export function parseCourseGroup(data: Record<string, unknown> | null | undefined): CourseGroupRef | null {
  const id = text(data?.groupe);
  if (!id) return null;
  return {
    id,
    title: text(data?.groupeTitre) || id,
    version: text(data?.version) || undefined,
    code: text(data?.versionCode) || undefined,
    image: text(data?.image) || undefined,
    annex: text(data?.groupeRole) === "annexe",
  };
}

/** Liens hors fiches ajoutés à la fenêtre de choix d'un groupe. */
export const GROUP_EXTRA_LINKS: Record<string, Array<{ href: string; label: string }>> = {
  "chasse-renarts": [{ href: "/projets/chasse-aux-renards", label: "Galerie des éditions passées" }],
};
