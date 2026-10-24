import fs from "fs";
import matter from "gray-matter";
import HomeView, { type HomeLevel } from "./HomeView";
import { isPublicCourse } from "@/lib/course-access";
import { listMarkdownFilesForContentLevel } from "@/lib/course-utils";
import { NSI_LEVEL_ORDER, getNsiLevel } from "@/lib/nsi-levels";

/** Chapitres et ressources publics de chaque niveau, pour les tuiles de l'accueil. */
function levelSummaries(): HomeLevel[] {
  return NSI_LEVEL_ORDER.filter((folder) => folder !== "particuliers").map((folder) => {
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
