import rawManifest from '../public/projets/chasse-aux-renards/edition_2025_2026/manifest.json';

export type ChasseLevel2025 = 'secondes' | '3e';

export type ChasseArtwork2025 = {
  id: string;
  src: string;
  file: string;
  slug: string;
  level: ChasseLevel2025;
  artist: string;
  title: string;
  original: string;
  story: string;
  siteUrl: string | null;
  isPlaceholder?: boolean;
};

export const LEVEL_LABELS: Record<ChasseLevel2025, string> = {
  secondes: 'Secondes',
  '3e': '3e',
};

export const artworks2025 = (rawManifest as ChasseArtwork2025[]).map((art) => ({
  ...art,
  level: art.level ?? 'secondes',
}));
