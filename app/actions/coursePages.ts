"use server";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAuthContext, viewerFromAuth } from "@/lib/auth";
import { canAccessCourse, parseAudience } from "@/lib/course-access";
import { contentRoot } from "@/lib/content-path";
import { listMarkdownFilesForContentLevel } from "@/lib/course-utils";
import { coursePath, getNsiLevel, sortLevelIds } from "@/lib/nsi-levels";

export type SiteCoursePage = {
  path: string;
  title: string;
  levelLabel: string;
  chapter: string;
  privateLesson: boolean;
};

function scanCoursePages(): SiteCoursePage[] {
  const root = contentRoot();
  if (!fs.existsSync(root)) return [];

  const levels = sortLevelIds(
    fs.readdirSync(root).filter((dir) => {
      const dirPath = path.join(root, dir);
      return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
    }),
  );

  const pages: SiteCoursePage[] = [];
  for (const folder of levels) {
    const meta = getNsiLevel(folder);
    for (const { filePath, slug } of listMarkdownFilesForContentLevel(folder)) {
      const { data } = matter(fs.readFileSync(filePath, "utf8"));
      if (data.revisionSheet === true) continue;
      pages.push({
        path: coursePath(folder, slug),
        title: String(data.title || slug),
        levelLabel: meta.label,
        chapter: String(data.chapter || "Cours"),
        privateLesson: parseAudience(data).kind === "accounts",
      });
    }
  }

  pages.sort(
    (a, b) =>
      a.levelLabel.localeCompare(b.levelLabel, "fr") ||
      a.chapter.localeCompare(b.chapter, "fr") ||
      a.title.localeCompare(b.title, "fr"),
  );
  return pages;
}

export async function listAllCoursePages(): Promise<SiteCoursePage[]> {
  const auth = await getAuthContext();
  if (!auth.isElevated) return [];
  return scanCoursePages();
}

export type LandingPrivateCourse = {
  path: string;
  title: string;
  levelLabel: string;
};

export type LandingPrivateCard = {
  show: boolean;
  courses: LandingPrivateCourse[];
};

const emptyCard: LandingPrivateCard = { show: false, courses: [] };

function scanAccountCourses(): Array<LandingPrivateCourse & { audience: unknown }> {
  const root = contentRoot();
  if (!fs.existsSync(root)) return [];
  const levels = sortLevelIds(
    fs.readdirSync(root).filter((dir) => fs.statSync(path.join(root, dir)).isDirectory()),
  );
  const hits: Array<LandingPrivateCourse & { audience: unknown }> = [];
  for (const folder of levels) {
    const meta = getNsiLevel(folder);
    for (const { filePath, slug } of listMarkdownFilesForContentLevel(folder)) {
      const { data } = matter(fs.readFileSync(filePath, "utf8"));
      if (data.revisionSheet === true) continue;
      if (parseAudience(data).kind !== "accounts") continue;
      hits.push({
        path: coursePath(folder, slug),
        title: String(data.title || slug),
        levelLabel: meta.label,
        audience: data.audience,
      });
    }
  }
  return hits;
}

/** Carte d'accueil : cours dont l'audience est une liste de comptes, sans nom d'élève. */
export async function getLandingPrivateCard(): Promise<LandingPrivateCard> {
  const auth = await getAuthContext();
  if (!auth.user || auth.role === "invite") return emptyCard;
  if (!auth.isElevated && !auth.hasPrivateLessons) return emptyCard;

  const viewer = viewerFromAuth(auth);
  const courses = scanAccountCourses()
    .filter((hit) => canAccessCourse({ audience: hit.audience }, viewer))
    .map(({ path, title, levelLabel }) => ({ path, title, levelLabel }))
    .sort((a, b) => a.title.localeCompare(b.title, "fr"));
  const unique = courses.filter((course, index) => courses.findIndex((item) => item.path === course.path) === index);
  return { show: true, courses: unique };
}
