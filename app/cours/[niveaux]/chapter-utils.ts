export { chapterImageFromData, levelFoxFromNiveau } from "@/lib/chapter-utils";

export function chapterSlugFromName(value: string): string {
  return normalizeChapterName(value)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "general";
}

export function normalizeChapterName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}
