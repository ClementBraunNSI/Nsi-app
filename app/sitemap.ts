import fs from "fs";
import type { MetadataRoute } from "next";
import matter from "gray-matter";
import { isPublicCourse } from "@/lib/course-access";
import { listMarkdownFilesForContentLevel } from "@/lib/course-utils";
import { NSI_LEVEL_ORDER, coursePath } from "@/lib/nsi-levels";

const SITE_ORIGIN = "https://www.clementbraun.info";

const STATIC_PATHS = ["/", "/a-propos", "/autres-cours-nsi", "/cours/snt", "/cours/1nsi", "/cours/tnsi"];

export default function sitemap(): MetadataRoute.Sitemap {
  const courses = NSI_LEVEL_ORDER.filter((level) => level !== "particuliers").flatMap((level) =>
    listMarkdownFilesForContentLevel(level).flatMap(({ filePath, slug }) => {
      const { data } = matter(fs.readFileSync(filePath, "utf8"));
      if (!isPublicCourse(data)) return [];
      return [
        {
          url: `${SITE_ORIGIN}${coursePath(level, slug)}`,
          lastModified: fs.statSync(filePath).mtime,
        },
      ];
    }),
  );

  courses.sort((a, b) => a.url.localeCompare(b.url, "fr"));

  return [
    ...STATIC_PATHS.map((path) => ({
      url: path === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`,
    })),
    ...courses,
  ];
}
