import fs from "fs";
import matter from "gray-matter";
import HomeView, { type HomeLevel } from "./HomeView";
import { isPublicCourse } from "@/lib/course-access";
import { listMarkdownFilesForContentLevel } from "@/lib/course-utils";
import { NESTED_LEVELS, NSI_LEVEL_ORDER, getNsiLevel } from "@/lib/nsi-levels";

/** Chapitres et ressources publics de chaque niveau, pour les tuiles de l'accueil. */
function levelSummaries(): HomeLevel[] {
  // Ressources et cours particuliers ont leur propre tuile, ce ne sont pas des niveaux de classe.
  return NSI_LEVEL_ORDER.filter((folder) => !NESTED_LEVELS.has(folder)).map((folder) => {
    const level = getNsiLevel(folder);
    const chapters = new Set<string>();
    let resources = 0;
    for (const { filePath } of listMarkdownFilesForContentLevel(folder)) {
      const { data } = matter(fs.readFileSync(filePath, "utf8"));
      if (!isPublicCourse(data)) continue;
      resources += 1;
      chapters.add(String(data.chapter || "Général"));
    }
    return {
      folder,
      urlSlug: level.urlSlug,
      label: level.label,
      audience: level.audience,
      description: level.description,
      image: level.image,
      chapters: chapters.size,
      resources,
    };
  });
}

export default function LandingPage() {
  return <HomeView levels={levelSummaries()} />;
}
