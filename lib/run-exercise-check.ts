import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  parsePythonCheckResult,
  reportForClient,
  reportFromQuery,
  unexpectedRunReport,
  type RunReport,
} from './python-check';
import { PYTHON_CHECK_RUNNER } from './python-check-runner';

const require = createRequire(import.meta.url);
const MAX_OUTPUT = 2_000_000;

const CHECK_PROGRAM = `${PYTHON_CHECK_RUNNER}
def _boot():
    payload = json.load(sys.stdin)
    user = ""
    tests = ""
    if isinstance(payload, dict):
        user = payload.get("user") or ""
        tests = payload.get("tests") or ""
    del payload
    return _nsi_run(user, tests)

print(json.dumps(_boot(), ensure_ascii=False))
`;

const UNAVAILABLE = 'La vérification n’a pas pu être lancée.';

function reportFromStdout(stdout: string): RunReport | null {
  const text = stdout.trim();
  if (!text.startsWith('{')) return null;
  try {
    return reportForClient(parsePythonCheckResult(text));
  } catch {
    return null;
  }
}

function pythonEnv(): NodeJS.ProcessEnv {
  return {
    PATH: process.env.PATH ?? '/usr/bin:/bin',
    NODE_ENV: 'production',
    LANG: 'C.UTF-8',
    LC_ALL: 'C.UTF-8',
    MPLBACKEND: 'Agg',
    PYTHONDONTWRITEBYTECODE: '1',
    PYTHONNOUSERSITE: '1',
    PYTHONSAFEPATH: '1',
  };
}

function runPythonProcess(userCode: string, verification: string, cwd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn('python3', ['-c', CHECK_PROGRAM], {
      cwd,
      env: pythonEnv(),
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
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      finish(new Error('timeout'));
    }, 20000);
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
    child.stdin.end(JSON.stringify({ user: userCode, tests: verification }));
  });
}

export async function runPythonCheck(userCode: string, verification: string): Promise<RunReport> {
  const cwd = await mkdtemp(path.join(tmpdir(), 'nsi-run-'));
  try {
    const stdout = await runPythonProcess(userCode, verification, cwd);
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

type SqlDatabase = {
  exec: (sql: string) => { columns: string[]; values: unknown[][] }[];
  close: () => void;
};

type SqlModule = {
  Database: new () => SqlDatabase;
};

let sqlModule: Promise<SqlModule> | null = null;

function loadSql(): Promise<SqlModule> {
  if (!sqlModule) {
    const initSqlJs = require('sql.js/dist/sql-asm.js') as () => SqlModule | Promise<SqlModule>;
    sqlModule = Promise.resolve(initSqlJs());
  }
  return sqlModule;
}

export async function runSqlCheck(userCode: string, verification: string): Promise<RunReport> {
  let db: SqlDatabase | null = null;
  try {
    const SQL = await loadSql();
    db = new SQL.Database();
    try {
      db.exec(userCode);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      return reportForClient(reportFromQuery({ phase: 'student-error', message }));
    }
    try {
      db.exec(verification);
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      return reportForClient(reportFromQuery({ phase: 'verification-error', message }));
    }
    return reportForClient(reportFromQuery({ phase: 'verified' }));
  } catch {
    return unexpectedRunReport(UNAVAILABLE);
  } finally {
    db?.close();
  }
}
