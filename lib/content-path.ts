import fs from "fs";
import path from "path";

export function contentRoot(): string {
  return path.resolve(process.cwd(), "content");
}

function isInside(root: string, candidate: string): boolean {
  const rel = path.relative(root, candidate);
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

export function resolveContentLevelDir(folder: string): string | null {
  if (!folder || folder.includes("\0") || path.isAbsolute(folder)) return null;
  const segments = folder.split(/[/\\]/);
  if (segments.some((part) => part === "" || part === "." || part === "..")) return null;

  const root = contentRoot();
  const resolved = path.resolve(root, folder);
  if (!isInside(root, resolved)) return null;
  if (!fs.existsSync(resolved) || !fs.statSync(resolved).isDirectory()) return null;
  return resolved;
}

export function resolveCourseFile(folder: string, slug: string): string | null {
  const dir = resolveContentLevelDir(folder);
  if (!dir) return null;

  const parts = slug
    .split("/")
    .map((part) => decodeURIComponent(part))
    .filter(Boolean);

  if (parts.length === 0) return null;
  if (parts.some((part) => part === "." || part === ".." || part.includes("\0"))) return null;

  for (const ext of [".md", ".mdx"] as const) {
    const resolved = `${path.resolve(dir, ...parts)}${ext}`;
    if (!isInside(dir, resolved)) continue;
    if (fs.existsSync(resolved) && fs.statSync(resolved).isFile()) return resolved;
  }

  return null;
}
