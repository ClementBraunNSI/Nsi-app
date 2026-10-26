import { spawn } from 'node:child_process';
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

function runPythonProcess(userCode: string, verification: string, packages: string[], cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // Sans eval ni new Function, `obj.constructor("return import('fs')")()` ne rouvre pas le disque.
    const child = spawn(process.execPath, ['--disallow-code-generation-from-strings', CHILD_SCRIPT], {
      cwd,
      env: childEnv(),
      stdio: ['pipe', 'pipe', 'pipe'],
    });
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
  const cwd = await mkdtemp(path.join(tmpdir(), 'nsi-run-'));
  try {
    const stdout = await runPythonProcess(userCode, verification, packages, cwd);
    return reportFromStdout(stdout) ?? unexpectedRunReport(UNAVAILABLE);
  } catch (error) {
    const stdout = error && typeof error === 'object' && 'stdout' in error && typeof error.stdout === 'string'
      ? error.stdout
      : '';
    return reportFromStdout(stdout) ?? unexpectedRunReport(UNAVAILABLE);
  } finally {
    await rm(cwd, { recursive: true, force: true });
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
