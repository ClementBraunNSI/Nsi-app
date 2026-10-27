import { contentFolderFromParam, NSI_LEVELS, type NsiLevelId } from "./nsi-levels";
import CHAPTER_IMAGES from "./chapter-images.json";

export type ResourceKind = "cours" | "exercices" | "tp" | "projet";

export function normalizeChapterName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function slugifyChapterName(value: string): string {
  return normalizeChapterName(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Fox of a known level (folder id or public slug). Null when that level has no file of its own. */
export function levelFoxFromNiveau(niveaux: string): string | null {
  const folder = contentFolderFromParam(niveaux.trim());
  if (!folder || !(folder in NSI_LEVELS)) return null;
  if (folder === "particuliers") return null;
  return NSI_LEVELS[folder as NsiLevelId].image;
}

/** Illustration d'un chapitre (renard du niveau + accessoire, générée par scripts/chapter-illustrations.mjs). */
export function chapterImageFromData(niveaux: string, chapterName: string): string | null {
  const folder = contentFolderFromParam(niveaux.trim());
  const images = folder ? (CHAPTER_IMAGES as Record<string, Record<string, string>>)[folder] : undefined;
  return images?.[normalizeChapterName(chapterName)] ?? levelFoxFromNiveau(niveaux);
}

export function getResourceKind(course: {
  title: string;
  slug: string;
  description: string;
}): ResourceKind {
  const text = normalizeChapterName(`${course.title} ${course.slug} ${course.description}`)
    .replace(/[^a-z0-9]+/g, " ");

  if (/\b(projet|quete)\b/.test(text)) {
    return "projet";
  }
  if (/\b(tp|atelier|activite|labo|lab)\b/.test(text)) {
    return "tp";
  }
  if (/\b(exercice|exercices|fiche)\b/.test(text)) {
    return "exercices";
  }

  return "cours";
}
