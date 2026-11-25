/**
 * Verrouillage des niveaux d'une fiche (`<ExerciseTabs unlockAfter="Pas à pas">`) : tant qu'un élève n'a pas validé
 * tous les exercices du niveau `unlockAfter`, les exercices des autres niveaux restent fermés.
 * Seuls les élèves (rôles student et invite) sont concernés : leur progression est enregistrée.
 */
export type GateItem = { id: string; difficulty: string };

export type LevelGate = {
  /** Exercices du niveau à réussir d'abord. */
  gateIds: string[];
  /** Combien d'entre eux sont validés. */
  gateDone: number;
  /** Vrai tant que le verrou s'applique à ce visiteur. */
  active: boolean;
  isLocked: (id: string | null | undefined) => boolean;
};

const fold = (text: string) => text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

export function levelGate(items: GateItem[], done: Set<string>, role: string | null, unlockAfter?: string): LevelGate {
  const gateIds = unlockAfter ? items.filter((item) => fold(item.difficulty) === fold(unlockAfter)).map((item) => item.id) : [];
  const gateDone = gateIds.filter((id) => done.has(id)).length;
  const isStudent = role === 'student' || role === 'invite';
  const active = isStudent && gateIds.length > 0 && gateDone < gateIds.length;
  const known = new Set(items.map((item) => item.id));
  return {
    gateIds,
    gateDone,
    active,
    isLocked: (id) => Boolean(id && active && known.has(id) && !gateIds.includes(id)),
  };
}
