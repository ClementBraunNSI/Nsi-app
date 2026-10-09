import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { contentRoot } from "@/lib/content-path";
import { classifySection } from "@/lib/exercise-classification";
import { coursePath } from "@/lib/nsi-levels";

const SKIP = new Set(["build", "node_modules", ".git"]);

function exerciseIdsIn(content: string, levelFolder: string): string[] {
  const ids: string[] = [];
  const sectionRegex = /<ExerciseSection\b([^>]*)>([\s\S]*?)<\/ExerciseSection>/g;
  let match: RegExpExecArray | null;
  while ((match = sectionRegex.exec(content)) !== null) {
    const attrs = match[1];
    const id = attrs.match(/\bid="([^"]*)"/)?.[1];
    const label = attrs.match(/\blabel="([^"]*)"/)?.[1];
    if (!id || !label) continue;
    const before = content.slice(0, match.index);
    const openings = [...before.matchAll(/<ExerciseTabs\b([^>]*)>/g)];
    const tabAttrs = openings.at(-1)?.[1] ?? "";
    const section = classifySection({
      label,
      body: match[2],
      levelFolder,
      courseId: tabAttrs.match(/\bcourseId="([^"]*)"/)?.[1],
      courseTitle: tabAttrs.match(/\bcourseTitle="([^"]*)"/)?.[1],
    });
    if (section.role === "exercise") ids.push(id);
  }
  return ids;
}

function walk(dir: string, out: string[]) {
  for (const name of fs.readdirSync(dir)) {
    if (name.startsWith(".") || SKIP.has(name)) continue;
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full, out);
    else if (name.endsWith(".md") || name.endsWith(".mdx")) out.push(full);
  }
}

let cache: Map<string, string[]> | null = null;

/** page_path -> exercise ids declared on that markdown page. */
export function exercisesByPage(): Map<string, string[]> {
  if (cache) return cache;
  const root = contentRoot();
  const map = new Map<string, string[]>();
  if (!fs.existsSync(root)) {
    cache = map;
    return map;
  }
  const files: string[] = [];
  walk(root, files);
  for (const filePath of files) {
    const relative = path.relative(root, filePath);
    const parts = relative.split(path.sep);
    const folder = parts[0];
    const slug = parts.slice(1).join("/").replace(/\.mdx?$/, "");
    if (!folder || !slug) continue;
    const { content } = matter(fs.readFileSync(filePath, "utf8"));
    map.set(coursePath(folder, slug), exerciseIdsIn(content, folder));
  }
  cache = map;
  return map;
}

export function exerciseIdsForPage(pagePath: string | null | undefined): string[] {
  const key = String(pagePath || "").trim();
  if (!key) return [];
  return exercisesByPage().get(key) || [];
}
