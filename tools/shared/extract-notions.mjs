#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_ROOT = path.resolve(__dirname, '../../content');
const OUTPUT_PATH = path.resolve(__dirname, 'referentiel-nsi.json');

const LEVEL_MAPPING = {
  '0': { id: 'sni', label: 'SNI' },
  '1': { id: 'snt', label: 'SNT' },
  '2': { id: 'premiere', label: 'Première NSI' },
  '3': { id: 'terminale', label: 'Terminale NSI' },
  '4': { id: 'sio', label: 'BTS SIO' },
};

async function loadFrontmatterParser() {
  try {
    const grayMatter = await import('gray-matter');
    return (text) => grayMatter.default(text);
  } catch {
    return parseFrontmatterManual;
  }
}

function parseFrontmatterManual(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return { data: {}, content: text };
  }

  const raw = match[1];
  const data = {};
  const lines = raw.split('\n');
  let currentKey = null;
  let listItems = null;

  for (const line of lines) {
    const listMatch = line.match(/^\s*-\s+(.*)$/);
    if (listItems !== null && listMatch) {
      listItems.push(stripQuotes(listMatch[1]));
      continue;
    }

    const kvMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kvMatch) continue;

    currentKey = kvMatch[1];
    const value = kvMatch[2];

    if (value === '' || value === '|' || value === '>') {
      listItems = [];
      data[currentKey] = listItems;
      continue;
    }

    listItems = null;
    data[currentKey] = parseScalar(value);
  }

  return {
    data,
    content: text.slice(match[0].length),
  };
}

function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseScalar(value) {
  const trimmed = stripQuotes(value.trim());
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (/^\d+$/.test(trimmed)) return Number(trimmed);
  return trimmed;
}

function walkMarkdownFiles(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMarkdownFiles(fullPath, files);
    } else if (/\.mdx?$/i.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizeChapter(value) {
  if (!value || typeof value !== 'string') return 'Sans chapitre';
  return value.trim();
}

function buildReferentiel(parseFrontmatter) {
  const levels = Object.entries(LEVEL_MAPPING).map(([folder, meta]) => ({
    id: meta.id,
    label: meta.label,
    chapters: new Set(),
    courses: [],
  }));

  const levelByFolder = Object.fromEntries(
    Object.keys(LEVEL_MAPPING).map((folder, index) => [folder, levels[index]]),
  );

  for (const folder of Object.keys(LEVEL_MAPPING)) {
    const dir = path.join(CONTENT_ROOT, folder);
    const files = walkMarkdownFiles(dir);

    for (const filePath of files) {
      const text = fs.readFileSync(filePath, 'utf8');
      const { data } = parseFrontmatter(text);
      const slug = path.basename(filePath, path.extname(filePath));
      const chapter = normalizeChapter(data.chapter);
      const title =
        typeof data.title === 'string' && data.title.trim()
          ? data.title.trim()
          : slug;
      const description =
        typeof data.description === 'string'
          ? data.description.trim()
          : typeof data.meta === 'string'
            ? data.meta.trim()
            : undefined;

      const level = levelByFolder[folder];
      level.chapters.add(chapter);
      level.courses.push({
        slug,
        title,
        chapter,
        level: level.id,
        ...(description ? { description } : {}),
      });
    }
  }

  return {
    levels: levels.map((level) => ({
      id: level.id,
      label: level.label,
      chapters: [...level.chapters].sort((a, b) => a.localeCompare(b, 'fr')),
      courses: level.courses.sort((a, b) => a.title.localeCompare(b.title, 'fr')),
    })),
    generatedAt: new Date().toISOString(),
  };
}

async function main() {
  const parseFrontmatter = await loadFrontmatterParser();
  const referentiel = buildReferentiel(parseFrontmatter);
  fs.writeFileSync(OUTPUT_PATH, `${JSON.stringify(referentiel, null, 2)}\n`, 'utf8');

  const courseCount = referentiel.levels.reduce(
    (sum, level) => sum + level.courses.length,
    0,
  );
  console.log(`Wrote ${OUTPUT_PATH} (${courseCount} courses across ${referentiel.levels.length} levels).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
