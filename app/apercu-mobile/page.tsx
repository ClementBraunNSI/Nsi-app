// APERÇU TEMPORAIRE (vue mobile) : à supprimer avant tout commit.
import fs from "fs";
import matter from "gray-matter";
import { isPublicCourse } from "@/lib/course-access";
import { listMarkdownFilesForContentLevel } from "@/lib/course-utils";
import { NSI_LEVEL_ORDER, getNsiLevel } from "@/lib/nsi-levels";
import Preview from "./Preview";

export default function Page() {
  const levels = NSI_LEVEL_ORDER.filter((folder) => folder !== "particuliers").map((folder) => {
    const level = getNsiLevel(folder);
    const chapters = new Set<string>();
    let resources = 0;
    for (const { filePath } of listMarkdownFilesForContentLevel(folder)) {
      const { data } = matter(fs.readFileSync(filePath, "utf8"));
      if (!isPublicCourse(data)) continue;
      resources += 1;
      chapters.add(String(data.chapter || "Général"));
    }
    return { folder, urlSlug: level.urlSlug, label: level.label, audience: level.audience, description: level.description, image: level.image, chapters: chapters.size, resources };
  });
  return <Preview levels={levels} />;
}
