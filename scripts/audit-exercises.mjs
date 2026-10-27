/**
 * Audit des fiches d'exercices : type, tests et correction de chaque <ExerciseSection>.
 *
 * Pour chaque exercice python ou sql :
 * - la correction doit passer la vérification, avec le même programme que le site ;
 * - un code vide doit échouer, sinon la vérification ne teste rien.
 *
 * Usage : node scripts/audit-exercises.mjs [filtre-de-chemin] [--json fichier]
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { createRequire } from 'module';
import matter from 'gray-matter';

const require = createRequire(import.meta.url);
const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content');
const args = process.argv.slice(2);
const jsonOut = args.includes('--json') ? path.resolve(args[args.indexOf('--json') + 1]) : null;
const filter = args.find((arg, i) => !arg.startsWith('--') && args[i - 1] !== '--json') || '';

const TYPES = new Set(['python', 'sql', 'lecture', 'autre']);

function walk(dir) {
  return fs.readdirSync(dir).flatMap((name) => {
    if (name.startsWith('.') || name === 'build' || name === 'node_modules') return [];
    const full = path.join(dir, name);
    return fs.statSync(full).isDirectory() ? walk(full) : [full];
  });
}

// Même découpage que app/actions/getExercises.ts.
function dedent(str) {
  const lines = str.split('\n');
  if (lines.length > 0 && lines[0].trim() === '') lines.shift();
  if (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
  let min = Infinity;
  for (const line of lines) {
    if (line.trim()) min = Math.min(min, line.search(/\S/));
  }
  if (min === Infinity) return str.trim();
  return lines.map((line) => (line.length >= min ? line.slice(min) : line)).join('\n').trim();
}

const stripFences = (code) => code
  .replace(/^```(python|sql)?\s*\n?/, '')
  .replace(/^```\s*\n?/, '')
  .replace(/\n?```\s*$/, '')
  .trim();

/** Tous les blocs de code de la correction, mis bout à bout. */
function correctionCode(block, lang) {
  const text = dedent(block);
  const fences = [...text.matchAll(/```(\w*)[^\n]*\n([\s\S]*?)```/g)]
    .filter((m) => !m[1] || m[1].toLowerCase() === lang || (lang === 'python' && m[1].toLowerCase() === 'py'));
  if (fences.length > 0) return fences.map((m) => dedent(m[2])).join('\n\n');
  return null;
}

function looksLikeSql(code) {
  return /^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\b/im.test(code) && !/\bdef\s+\w+\s*\(|\bprint\s*\(/.test(code);
}

function collect() {
  const sections = [];
  const orphanFiles = [];
  for (const file of walk(CONTENT).filter((f) => /\.mdx?$/.test(f))) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    if (filter && !rel.includes(filter)) continue;
    const { content } = matter(fs.readFileSync(file, 'utf8'));
    const hasTabs = /<ExerciseTabs[^>]*courseId="[^"]*"[^>]*courseTitle="[^"]*"[^>]*>/.test(content);
    const re = /<ExerciseSection\b([^>]*)>([\s\S]*?)<\/ExerciseSection>/g;
    let m;
    let count = 0;
    while ((m = re.exec(content)) !== null) {
      count += 1;
      const attrs = m[1];
      const body = m[2];
      const before = content.slice(0, m.index);
      const line = before.split('\n').length;
      const rawType = attrs.match(/\btype="([^"]*)"/i)?.[1]?.trim().toLowerCase() ?? null;
      const verification = body.match(/<Verification>([\s\S]*?)<\/Verification>/)?.[1];
      const correction = body.match(/<Correction>([\s\S]*?)<\/Correction>/)?.[1];
      const starter = body.match(/<CodeDepart>([\s\S]*?)<\/CodeDepart>/)?.[1];
      const setup = body.match(/<BaseSQL>([\s\S]*?)<\/BaseSQL>/)?.[1]
        ?? [...before.matchAll(/<BaseSQL>([\s\S]*?)<\/BaseSQL>/g)].at(-1)?.[1];
      const packages = [
        ...(content.match(/<ExerciseTabs[^>]*packages="([^"]*)"/)?.[1] ?? '').split(','),
        ...(attrs.match(/\bpackages="([^"]*)"/)?.[1] ?? '').split(','),
      ].map((p) => p.trim()).filter(Boolean);
      sections.push({
        file: rel,
        line,
        id: attrs.match(/\bid="([^"]*)"/)?.[1] ?? null,
        label: attrs.match(/\blabel="([^"]*)"/)?.[1] ?? null,
        type: rawType,
        inCatalog: hasTabs,
        hasEnonce: /<Enonce>/.test(body),
        verification: verification ? stripFences(dedent(verification)) : null,
        correction: correction ?? null,
        starter: starter ? stripFences(dedent(starter)) : '',
        sqlSetup: setup ? stripFences(dedent(setup)) : '',
        packages: [...new Set(packages)],
        usesInput: /\binput\s*\(/.test(body),
      });
    }
    if (count > 0 && !hasTabs) orphanFiles.push(rel);
  }
  return { sections, orphanFiles };
}

function runnerSource() {
  const ts = fs.readFileSync(path.join(ROOT, 'lib', 'python-check-runner.ts'), 'utf8');
  const match = ts.match(/PYTHON_CHECK_RUNNER = String\.raw`([\s\S]*?)`;/);
  if (!match) throw new Error('PYTHON_CHECK_RUNNER introuvable');
  return match[1];
}

async function main() {
  const { sections, orphanFiles } = collect();
  const problems = [];
  const add = (s, kind, detail = '') => problems.push({ file: s.file, line: s.line, id: s.id, type: s.type, kind, detail });

  const ids = new Map();
  for (const s of sections) {
    if (!s.id || !s.label) add(s, 'id-ou-label-manquant');
    if (s.id) ids.set(s.id, [...(ids.get(s.id) ?? []), s]);
    if (!s.type) add(s, 'type-manquant');
    else if (!TYPES.has(s.type)) add(s, 'type-inconnu', s.type);
    // L'IDE affiche le bloc <Enonce> : seuls les exercices python et sql en ont besoin.
    if (!s.hasEnonce && (s.type === 'python' || s.type === 'sql')) add(s, 'enonce-manquant');
  }
  for (const [id, list] of ids) {
    if (list.length > 1) list.forEach((s) => add(s, 'id-en-double', `${id} ×${list.length}`));
  }

  // Sous Node, Pyodide écrit dans le vrai dossier courant : les fichiers créés par les tests restent hors du dépôt.
  const bac = fs.mkdtempSync(path.join(os.tmpdir(), 'nsi-audit-'));
  process.chdir(bac);
  process.on('exit', () => {
    process.chdir(ROOT);
    fs.rmSync(bac, { recursive: true, force: true });
  });
  const { loadPyodide } = require('pyodide');
  const pyodide = await loadPyodide({ packageCacheDir: path.join(os.tmpdir(), 'nsi-pyodide-packages'), stdout: () => {}, stderr: () => {} });
  pyodide.runPython(runnerSource());
  // Même chargement des modules que le vérificateur du site, roues de lib/pyodide-wheels comprises.
  const { loadExercisePackagesInto } = require('../lib/pyodide-extra-packages.cjs');
  const loaded = new Set();
  const runPython = async (user, tests, packages) => {
    await loadExercisePackagesInto(pyodide, packages, loaded);
    // Chaque exercice dans un espace de noms neuf, comme le processus séparé du site.
    pyodide.globals.set('__nsi_user', user);
    pyodide.globals.set('__nsi_tests', tests);
    return JSON.parse(pyodide.runPython('json.dumps(_nsi_run(__nsi_user, __nsi_tests), ensure_ascii=False)'));
  };

  const initSqlJs = require('sql.js/dist/sql-asm.js');
  const SQL = await initSqlJs();
  // Même comparaison que le serveur : Node lit le TypeScript sans compilation.
  const { compareSql } = await import('../lib/sql-compare.ts');
  const runSql = (user, tests, setup) => {
    const outcome = compareSql(() => new SQL.Database(), setup, user, tests);
    if (outcome.phase !== 'compared') return { status: outcome.phase, message: outcome.message };
    const failed = outcome.tests.filter((t) => !t.ok);
    return failed.length ? { status: 'failure', message: failed.map((t) => t.detail || t.label).join(' | ') } : { status: 'success' };
  };

  const summary = (r) => {
    const failed = (r.tests || []).filter((t) => !t.ok).map((t) => t.label + (t.detail ? " : " + t.detail : "") || t.source || '').slice(0, 2).join(' | ');
    return [r.status, r.error, r.errorDetail, failed].filter(Boolean).join(' — ').slice(0, 300);
  };

  let checked = 0;
  for (const s of sections) {
    if (s.type !== 'python' && s.type !== 'sql') {
      // Code Python dans un exercice « autre » : sans doute un oubli de type. Une lecture de code reste en lecture.
      if (s.type === 'autre' && s.correction && correctionCode(s.correction, 'python') && /def |print\(/.test(s.correction)) add(s, 'code-python-sans-type-python');
      continue;
    }
    if (!s.inCatalog) add(s, 'hors-ExerciseTabs');
    if (!s.verification) { add(s, 'verification-manquante'); continue; }
    if (!s.correction) { add(s, 'correction-manquante'); continue; }
    const own = correctionCode(s.correction, s.type);
    // Comme dans l'éditeur : la correction s'écrit à la suite du code de départ.
    const code = own && s.starter ? `${s.starter}\n\n${own}` : own;
    if (!code) { add(s, 'correction-sans-code'); continue; }
    if (s.type === 'python' && looksLikeSql(code)) add(s, 'type-python-mais-code-sql');
    if (s.type === 'sql' && /\bdef\s+\w+\s*\(/.test(code)) add(s, 'type-sql-mais-code-python');
    checked += 1;
    try {
      if (s.type === 'python') {
        if (s.usesInput && !/^\s*ENTREES\s*=/m.test(s.verification)) add(s, 'input-sans-ENTREES');
        const ok = await runPython(code, s.verification, s.packages);
        if (ok.status !== 'success' || (ok.tests || []).some((t) => !t.ok)) add(s, 'correction-refusee', summary(ok));
        if ((ok.tests || []).length === 0) add(s, 'aucun-test-compte', summary(ok));
        const empty = await runPython(s.starter, s.verification, s.packages);
        if (empty.status === 'success' && (empty.tests || []).every((t) => t.ok)) add(s, 'code-vide-accepte');
      } else {
        if (!s.sqlSetup && !/\bcreate\s+table\b/i.test(code)) add(s, 'sql-sans-BaseSQL');
        const ok = runSql(code, s.verification, s.sqlSetup);
        if (ok.status !== 'success') add(s, 'correction-refusee', `${ok.status} — ${ok.message}`);
        const empty = runSql(s.starter, s.verification, s.sqlSetup);
        if (empty.status === 'success') add(s, 'code-vide-accepte');
      }
    } catch (error) {
      add(s, 'erreur-audit', String(error?.message || error).slice(0, 200));
    }
    if (checked % 50 === 0) process.stderr.write(`… ${checked} exercices vérifiés\n`);
  }

  const byType = sections.reduce((acc, s) => ({ ...acc, [s.type ?? 'aucun']: (acc[s.type ?? 'aucun'] ?? 0) + 1 }), {});
  const byKind = problems.reduce((acc, p) => ({ ...acc, [p.kind]: (acc[p.kind] ?? 0) + 1 }), {});
  console.log(`Exercices : ${sections.length}`, byType);
  console.log(`Exécutés : ${checked}`);
  console.log('Fichiers avec exercices hors <ExerciseTabs> :', orphanFiles);
  console.log('Problèmes :', byKind);
  for (const p of problems) console.log(`- [${p.kind}] ${p.file}:${p.line} ${p.id ?? ''} (${p.type ?? '—'}) ${p.detail}`);
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify({ sections: sections.length, byType, problems, orphanFiles }, null, 2));
  process.exit(problems.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error);
  process.exit(2);
});
