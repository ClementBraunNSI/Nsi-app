export const TRACKED_LEVELS = ['SNI', 'SNT', '1NSI', 'TNSI', 'SIO'] as const;

export const LEVEL_LABELS: Record<string, string> = {
  SNI: '2nde SNI',
  SNT: '2nde SNT',
  '1NSI': '1ère NSI',
  TNSI: 'Terminale NSI',
  SIO: 'BTS SIO',
  particuliers: 'Cours particuliers',
};

export type SheetProgressStatus = 'validated' | 'in_progress' | 'not_started';

export function levelLabel(level: string) {
  return LEVEL_LABELS[level] || level;
}

export function sortLevels(levels: string[]) {
  const rank = (level: string) => {
    const index = TRACKED_LEVELS.indexOf(level as (typeof TRACKED_LEVELS)[number]);
    return index === -1 ? TRACKED_LEVELS.length : index;
  };
  return [...new Set(levels)].sort((a, b) => rank(a) - rank(b) || a.localeCompare(b, 'fr'));
}

/** Niveau du profil s'il correspond à un vrai niveau qui a des fiches, sinon le premier niveau qui en a. */
export function pickDefaultLevel(profileLevel: string | null | undefined, available: string[]) {
  const ordered = sortLevels(available);
  const raw = String(profileLevel || '').trim().toLowerCase();
  const match = ordered.find((level) => level.toLowerCase() === raw);
  if (match && (TRACKED_LEVELS as readonly string[]).includes(match)) return match;
  return ordered[0] || '';
}

export function validatedPhrase(done: number, total: number) {
  return `${done}/${total} validé${done === 1 ? '' : 's'}`;
}

export function sheetProgressStatus(input: {
  validatedCount: number;
  total: number;
  awarded: boolean;
}): SheetProgressStatus {
  if (input.awarded || (input.total > 0 && input.validatedCount >= input.total)) return 'validated';
  if (input.validatedCount > 0) return 'in_progress';
  return 'not_started';
}

export function awardedCourseIds(badgeCourseIds: string[], achievementIds: string[]) {
  const ids = new Set(badgeCourseIds.filter(Boolean));
  for (const achievementId of achievementIds) {
    if (achievementId.startsWith('fiche:')) ids.add(achievementId.slice('fiche:'.length));
  }
  return ids;
}
