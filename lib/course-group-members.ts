import fs from "fs";
import matter from "gray-matter";
import { getResourceKind } from "@/lib/chapter-utils";
import { canAccessCourse, type CourseViewer } from "@/lib/course-access";
import { parseCourseGroup } from "@/lib/course-groups";
import { listMarkdownFilesForContentLevel } from "@/lib/course-utils";
import { coursePath } from "@/lib/nsi-levels";

export type GroupMember = { slug: string; title: string; label: string; href: string; annex: boolean };

const KIND_LABELS = { cours: "Cours", exercices: "Exercices", tp: "TP", projet: "Projet" } as const;
const KIND_ORDER = ["cours", "exercices", "tp", "projet"] as const;

/** Fiches visibles d'un groupe dans un niveau, annexes en dernier. */
export function groupMembers(folder: string, groupId: string, viewer: CourseViewer): GroupMember[] {
  const members: Array<GroupMember & { rank: number }> = [];
  for (const { filePath, slug } of listMarkdownFilesForContentLevel(folder)) {
    const { data } = matter(fs.readFileSync(filePath, "utf8"));
    const group = parseCourseGroup(data);
    if (group?.id !== groupId || !canAccessCourse(data, viewer)) continue;
    const title = String(data.title || slug);
    const kind = getResourceKind({ title, slug, description: String(data.description || "") });
    members.push({
      slug,
      title,
      label: group.version || KIND_LABELS[kind],
      href: coursePath(folder, slug),
      annex: Boolean(group.annex),
      rank: group.annex ? KIND_ORDER.length : KIND_ORDER.indexOf(kind),
    });
  }
  return members
    .sort((a, b) => a.rank - b.rank || a.title.localeCompare(b.title, "fr"))
    .map(({ rank: _rank, ...member }) => member);
}
