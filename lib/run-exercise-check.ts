import { spawn, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  CHECK_UNAVAILABLE,
  finalizeReport,
  parsePythonCheckResult,
  reportForClient,
  reportFromQuery,
  unexpectedRunReport,
  type RunReport,
} from './python-check';
import { PYTHON_CHECK_RUNNER } from './python-check-runner';
import { compareSql, formatSqlResult, type SqlDatabaseLike } from './sql-compare';

const require = createRequire(import.meta.url);
const MAX_OUTPUT = 2_000_000;

// Python tourne avec Pyodide dans un processus Node séparé : Node est présent sur Vercel, python3 non.
// next.config.mjs embarque ce fichier et node_modules/pyodide avec la page d'exercice.
const CHILD_SCRIPT = path.join(process.cwd(), 'lib', 'pyodide-check-child.cjs');

const UNAVAILABLE = CHECK_UNAVAILABLE;

function reportFromStdout(stdout: string): RunReport | null {
  const text = stdout.trim();
  if (!text.startsWith('{')) return null;
  try {
    return reportForClient(parsePythonCheckResult(text));
  } catch {
    return null;
  }
}

/** Environnement minimal du processus de vérification : aucune clé du serveur n'y passe. */
function childEnv(): NodeJS.ProcessEnv {
  const env: NodeJS.ProcessEnv = {
    PATH: process.env.PATH ?? '/usr/bin:/bin',
    NODE_ENV: 'production',
    LANG: 'C.UTF-8',
  };
  // Windows : Node a besoin de ces variables pour démarrer et trouver le dossier temporaire.
  for (const key of ['SystemRoot', 'TEMP', 'TMP', 'TMPDIR']) {
    if (process.env[key]) env[key] = process.env[key];
  }
  return env;
}

/*
 * Charger Pyodide prend l'essentiel du temps d'une vérification (environ 1,3 s ; le code de l'élève, quelques ms).
 * Un processus est donc lancé à l'avance : il charge Pyodide puis attend le code sur son entrée standard.
 * Chaque vérification garde son propre processus, jeté ensuite : rien ne passe d'un élève à l'autre.
 */
type Runner = { child: ChildProcessWithoutNullStreams; cwd: string };

// Un processus prêt qui ne sert pas est arrêté au bout de ce délai, pour rendre la mémoire.
const IDLE_LIMIT = 10 * 60_000;

let ready: Runner | null = null;
let warming = false;
let idleTimer: ReturnType<typeof setTimeout> | null = null;

async function spawnRunner(): Promise<Runner> {
  const cwd = await mkdtemp(path.join(tmpdir(), 'nsi-run-'));
  // Sans eval ni new Function, `obj.constructor("return import('fs')")()` ne rouvre pas le disque.
  const child = spawn(process.execPath, ['--disallow-code-generation-from-strings', CHILD_SCRIPT], {
    cwd,
    env: childEnv(),
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  child.once('exit', () => {
    if (ready?.child === child) ready = null;
    void rm(cwd, { recursive: true, force: true });
  });
  child.once('error', () => {});
  return { child, cwd };
}

/** Le processus d'avance ne doit pas retenir le serveur (ni les tests) quand plus rien d'autre ne tourne. */
function detach(runner: Runner, detached: boolean) {
  const streams = [runner.child.stdin, runner.child.stdout, runner.child.stderr] as unknown as { ref?: () => void; unref?: () => void }[];
  if (detached) {
    runner.child.unref();
    streams.forEach((stream) => stream?.unref?.());
  } else {
    runner.child.ref();
    streams.forEach((stream) => stream?.ref?.());
  }
}

function prepareNext() {
  if (ready || warming || process.env.NSI_PYTHON_PREWARM === '0') return;
  warming = true;
  spawnRunner()
    .then((runner) => {
      detach(runner, true);
      ready = runner;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        if (ready === runner) {
          ready = null;
          runner.child.kill('SIGKILL');
        }
      }, IDLE_LIMIT);
      idleTimer.unref?.();
    })
    .catch(() => {})
    .finally(() => {
      warming = false;
    });
}

/** Prend le processus prêt s'il est encore vivant, sinon en lance un ; prépare aussitôt le suivant. */
async function takeRunner(): Promise<Runner> {
  const candidate = ready;
  ready = null;
  if (idleTimer) clearTimeout(idleTimer);
  let runner: Runner;
  if (candidate && candidate.child.exitCode === null && candidate.child.signalCode === null && !candidate.child.killed) {
    detach(candidate, false);
    runner = candidate;
  } else {
    runner = await spawnRunner();
  }
  prepareNext();
  return runner;
}

function runPythonProcess(userCode: string, verification: string, packages: string[], runner: Runner): Promise<string> {
  return new Promise((resolve, reject) => {
    const { child } = runner;
    const chunks: Buffer[] = [];
    let size = 0;
    let settled = false;
    const finish = (error: Error | null, stdout = '') => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(Object.assign(error, { stdout }));
      else resolve(stdout);
    };
    // Le premier chargement de Pyodide prend quelques secondes ; les modules (numpy…) davantage.
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish(new Error('timeout'));
    }, packages.length > 0 ? 45000 : 25000);
    child.stdout.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_OUTPUT) {
        child.kill('SIGKILL');
        finish(new Error('overflow'));
        return;
      }
      chunks.push(chunk);
    });
    child.on('error', (error) => finish(error));
    child.stdin.on('error', () => {});
    child.on('close', (code) => {
      const stdout = Buffer.concat(chunks).toString('utf8');
      if (code === 0) finish(null, stdout);
      else finish(new Error('python'), stdout);
    });
    child.stdin.end(JSON.stringify({ runner: PYTHON_CHECK_RUNNER, user: userCode, tests: verification, packages }));
  });
}

export async function runPythonCheck(userCode: string, verification: string, packages: string[] = []): Promise<RunReport> {
  const runner = await takeRunner();
  try {
    const stdout = await runPythonProcess(userCode, verification, packages, runner);
    return reportFromStdout(stdout) ?? unexpectedRunReport(UNAVAILABLE);
  } catch (error) {
    const stdout = error && typeof error === 'object' && 'stdout' in error && typeof error.stdout === 'string'
      ? error.stdout
      : '';
    return reportFromStdout(stdout) ?? unexpectedRunReport(UNAVAILABLE);
  } finally {
    // Le dossier temporaire part avec le processus (voir spawnRunner).
    if (runner.child.exitCode === null) runner.child.kill('SIGKILL');
  }
}

type SqlModule = {
  Database: new () => SqlDatabaseLike;
};

let sqlModule: Promise<SqlModule> | null = null;

function loadSql(): Promise<SqlModule> {
  if (!sqlModule) {
    const initSqlJs = require('sql.js/dist/sql-asm.js') as () => SqlModule | Promise<SqlModule>;
    sqlModule = Promise.resolve(initSqlJs());
  }
  return sqlModule;
}

export async function runSqlCheck(userCode: string, verification: string, setup = ''): Promise<RunReport> {
  try {
    const SQL = await loadSql();
    const outcome = compareSql(() => new SQL.Database(), setup, userCode, verification);
    if (outcome.phase === 'student-error') {
      return reportForClient(reportFromQuery({ phase: 'student-error', message: outcome.message }));
    }
    if (outcome.phase === 'reference-error') {
      return reportForClient(reportFromQuery({ phase: 'verification-error', message: outcome.message }));
    }
    return reportForClient(finalizeReport({
      status: 'success',
      tests: outcome.tests,
      stdout: outcome.result ? formatSqlResult(outcome.result) : '',
    }));
  } catch {
    return unexpectedRunReport(UNAVAILABLE);
  }
}
