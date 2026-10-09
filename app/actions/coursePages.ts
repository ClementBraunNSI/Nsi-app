"use server";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getAuthContext } from "@/lib/auth";
import { courseVisibility, isRestrictedCourse } from "@/lib/course-access";
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
      const visibility = courseVisibility(data, folder, slug);
      pages.push({
        path: coursePath(folder, slug),
        title: String(data.title || slug),
        levelLabel: meta.label,
        chapter: String(data.chapter || "Cours"),
        privateLesson: isRestrictedCourse(visibility),
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

export type LandingPrivateGroup = {
  student: string;
  courses: LandingPrivateCourse[];
};

export type LandingPrivateCard = {
  show: boolean;
  grouped: boolean;
  groups: LandingPrivateGroup[];
};

const emptyCard: LandingPrivateCard = { show: false, grouped: false, groups: [] };

function normalizeName(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function reservedNames(allowedStudents: unknown): string[] {
  if (!Array.isArray(allowedStudents)) return [];
  const seen = new Set<string>();
  const names: string[] = [];
  for (const raw of allowedStudents) {
    const name = String(raw || "").trim();
    const key = normalizeName(name);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    names.push(name);
  }
  return names;
}

function nameMatches(allowedStudents: unknown, studentName: string) {
  const current = normalizeName(studentName);
  if (!current) return false;
  return reservedNames(allowedStudents).some((name) => normalizeName(name) === current);
}

/** Dossier content/particuliers/<élève>/… quand le cours n’a pas de allowedStudents. */
function folderStudent(folder: string, slug: string): string | null {
  if (folder !== "particuliers") return null;
  const parts = slug.split("/").filter(Boolean);
  if (parts.length < 2) return null;
  const raw = parts[0].replace(/[-_]+/g, " ").trim();
  if (!raw) return null;
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

type PrivateCourseHit = LandingPrivateCourse & { reserved: string[]; groups: string[] };

function scanPrivateCourses(): PrivateCourseHit[] {
  const root = contentRoot();
  if (!fs.existsSync(root)) return [];
  const levels = sortLevelIds(
    fs.readdirSync(root).filter((dir) => fs.statSync(path.join(root, dir)).isDirectory()),
  );
  const hits: PrivateCourseHit[] = [];
  for (const folder of levels) {
    const meta = getNsiLevel(folder);
    for (const { filePath, slug } of listMarkdownFilesForContentLevel(folder)) {
      const { data } = matter(fs.readFileSync(filePath, "utf8"));
      if (data.revisionSheet === true) continue;
      const visibility = courseVisibility(data, folder, slug);
      if (!isRestrictedCourse(visibility)) continue;
      const reserved = reservedNames(data.allowedStudents);
      const folderName = folderStudent(folder, slug);
      const groups = reserved.length > 0 ? reserved : folderName ? [folderName] : ["Non attribué"];
      hits.push({
        path: coursePath(folder, slug),
        title: String(data.title || slug),
        levelLabel: meta.label,
        reserved,
        groups,
      });
    }
  }
  return hits;
}

function groupHits(hits: PrivateCourseHit[]): LandingPrivateGroup[] {
  const groups = new Map<string, LandingPrivateGroup>();
  for (const hit of hits) {
    for (const student of hit.groups) {
      const key = normalizeName(student);
      const group = groups.get(key) || { student, courses: [] };
      if (!group.courses.some((course) => course.path === hit.path)) {
        group.courses.push({ path: hit.path, title: hit.title, levelLabel: hit.levelLabel });
      }
      groups.set(key, group);
    }
  }
  return [...groups.values()]
    .map((group) => ({
      ...group,
      courses: group.courses.sort((a, b) => a.title.localeCompare(b.title, "fr")),
    }))
    .sort((a, b) => a.student.localeCompare(b.student, "fr"));
}

/** Une carte d’accueil : tous les cours privés pour l’enseignant, seulement les siens pour un élève en particuliers. */
export async function getLandingPrivateCard(): Promise<LandingPrivateCard> {
  const auth = await getAuthContext();
  if (!auth.user || auth.role === "invite") return emptyCard;
  if (!auth.isElevated && !auth.hasPrivateLessons) return emptyCard;

  const hits = scanPrivateCourses();
  if (auth.isElevated) {
    return { show: true, grouped: true, groups: groupHits(hits) };
  }

  if (!auth.fullName) return { show: true, grouped: false, groups: [] };
  const courses = hits
    .filter((hit) => nameMatches(hit.reserved, auth.fullName!))
    .map(({ path, title, levelLabel }) => ({ path, title, levelLabel }))
    .sort((a, b) => a.title.localeCompare(b.title, "fr"));
  const unique = courses.filter((course, index) => courses.findIndex((item) => item.path === course.path) === index);
  return {
    show: true,
    grouped: false,
    groups: unique.length ? [{ student: auth.fullName, courses: unique }] : [],
  };
}
