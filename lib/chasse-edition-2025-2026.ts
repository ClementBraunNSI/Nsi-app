import rawManifest from '../public/projets/chasse-aux-renards/edition_2025_2026/manifest.json';

export type ChasseArtwork2025 = {
  id: string;
  src: string;
  file: string;
  slug: string;
  artist: string;
  title: string;
  original: string;
  story: string;
  siteUrl: string | null;
  isPlaceholder?: boolean;
};

export const artworks2025 = rawManifest as ChasseArtwork2025[];
