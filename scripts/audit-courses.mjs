/**
 * Audit des cours Première (content/2) et Terminale (content/3).
 * Usage: node scripts/audit-courses.mjs
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const LEVELS = ['2', '3'];
const ROOT = process.cwd();

function listMd(level) {
  const dir = path.join(ROOT, 'content', level);
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
}

/** Vrai doublon (ex. python_types_base), pas les séparateurs Markdown `---`. */
function hasDuplicateFrontmatter(raw) {
  const lines = raw.split(/\r?\n/);
  if (lines[0]?.trim() !== '---') return false;
  let firstClose = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      firstClose = i;
      break;
    }
  }
  if (firstClose < 0) return false;
  for (let i = firstClose + 1; i < Math.min(firstClose + 50, lines.length); i++) {
    if (lines[i].trim() !== '---') continue;
    const between = lines.slice(firstClose + 1, i).join('\n');
    if (/^\s*(title|level|chapter|description|badgeId)\s*:/m.test(between)) {
      return true;
    }
  }
  return false;
}

function parsePrerequisites(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

function auditLevel(level) {
  const files = listMd(level);
  const slugs = new Set(files.map((f) => f.replace(/\.mdx?$/, '')));
  const issues = [];

  for (const file of files) {
    const filePath = path.join(ROOT, 'content', level, file);
    const raw = fs.readFileSync(filePath, 'utf8');
    const slug = file.replace(/\.mdx?$/, '');

    if (hasDuplicateFrontmatter(raw)) {
      issues.push({ level, slug, type: 'duplicate_frontmatter', message: 'Second bloc frontmatter YAML détecté' });
    }

    let data;
    let content;
    try {
      const parsed = matter(raw);
      data = parsed.data;
      content = parsed.content;
    } catch (e) {
      issues.push({ level, slug, type: 'parse_error', message: String(e.message) });
      continue;
    }

    if (!data.title) {
      issues.push({ level, slug, type: 'missing_title', message: 'Pas de title dans le frontmatter' });
    }
    if (!data.chapter) {
      issues.push({ level, slug, type: 'missing_chapter', message: 'Pas de chapter dans le frontmatter' });
    }

    if (/^import\s+.*from\s+['"]\.\.\//m.test(content)) {
      issues.push({
        level,
        slug,
        type: 'invalid_mdx_import',
        message: 'Import relatif interdit (utiliser les composants MDX globaux)',
      });
    }

    for (const prereq of parsePrerequisites(data.prerequisites)) {
      if (!slugs.has(prereq)) {
        issues.push({
          level,
          slug,
          type: 'broken_prerequisite',
          message: `Prérequis introuvable: ${prereq}`,
        });
      }
    }
  }

  return { level, count: files.length, issues };
}

function main() {
  const reports = LEVELS.map(auditLevel);
  let totalIssues = 0;

  for (const report of reports) {
    const label = report.level === '2' ? 'Première' : 'Terminale';
    console.log(`\n=== ${label} (content/${report.level}) — ${report.count} cours ===`);
    if (report.issues.length === 0) {
      console.log('  Aucun problème détecté.');
    } else {
      for (const issue of report.issues) {
        console.log(`  [${issue.type}] ${issue.slug}: ${issue.message}`);
      }
      totalIssues += report.issues.length;
    }
  }

  console.log(`\nTotal: ${totalIssues} problème(s).`);
  process.exit(totalIssues > 0 ? 1 : 0);
}

main();
