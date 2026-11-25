import { canOpenExerciseIde } from './exercise-type';

/**
 * Verrouillage d'une fiche (`<ExerciseTabs unlockAfter="Pas à pas">`) :
 * - les exercices du niveau `unlockAfter` s'ouvrent un par un, chacun une fois le précédent validé ;
 * - les autres niveaux restent fermés tant que tout ce niveau n'est pas validé, puis toute la fiche s'ouvre.
 * Le verrou vaut pour tout compte qui peut valider des exercices (élève, invité, enseignant). Un visiteur sans compte
 * ne peut rien valider : il voit toute la fiche. `ouvert` lève le verrou (aperçu de l'enseignant).
 */
export type GateItem = { id: string; difficulty: string };

export type LevelGate = {
  /** Exercices du niveau à réussir d'abord, dans l'ordre de la fiche. */
  gateIds: string[];
  /** Combien d'entre eux sont validés. */
  gateDone: number;
  /** Vrai tant que le verrou s'applique à ce visiteur. */
  active: boolean;
  isLocked: (id: string | null | undefined) => boolean;
};

const fold = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export function levelGate(
  items: GateItem[],
  done: Set<string>,
  role: string | null,
  unlockAfter?: string,
  ouvert = false,
): LevelGate {
  const gateIds = unlockAfter ? items.filter((item) => fold(item.difficulty) === fold(unlockAfter)).map((item) => item.id) : [];
  const gateDone = gateIds.filter((id) => done.has(id)).length;
  const active = !ouvert && canOpenExerciseIde(role) && gateIds.length > 0 && gateDone < gateIds.length;
  const known = new Set(items.map((item) => item.id));
  // Premier exercice du niveau pas encore validé : il est ouvert, ceux qui le suivent ne le sont pas encore.
  const firstTodo = gateIds.findIndex((id) => !done.has(id));
  return {
    gateIds,
    gateDone,
    active,
    isLocked: (id) => {
      if (!id || !active || !known.has(id)) return false;
      const rank = gateIds.indexOf(id);
      return rank < 0 || rank > firstTodo;
    },
  };
}
