export const NSI_LEVELS = {
  '0': { label: 'SNI', short: 'SNI', profileCode: 'SNI' },
  '1': { label: 'SNT', short: '2de', profileCode: 'SNT' },
  '2': { label: 'Première NSI', short: '2de', profileCode: '1NSI' },
  '3': { label: 'Terminale NSI', short: 'Tle', profileCode: 'TNSI' },
  '4': { label: 'BTS SIO', short: 'BTS', profileCode: 'SIO' },
  particuliers: { label: 'Programmation en C', short: 'C', profileCode: '' },
} as const;

export type NsiLevelId = keyof typeof NSI_LEVELS;

export function nsiLevelLabel(niveaux: string): string {
  const entry = NSI_LEVELS[niveaux as NsiLevelId];
  return entry?.label ?? `Niveau ${niveaux}`;
}

export function profileCodeToLevelId(code: string): string | null {
  for (const [id, meta] of Object.entries(NSI_LEVELS)) {
    if (meta.profileCode === code) return id;
  }
  return null;
}
