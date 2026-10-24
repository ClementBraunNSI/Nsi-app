import { PYTHON_CHECK_RUNNER } from './python-check-runner';

export type RunTest = {
  ok: boolean;
  label: string;
  source?: string;
  detail?: string;
  actual?: string;
  expected?: string;
  printCompare?: boolean;
  op?: string;
};

export type RunReport = {
  status: 'success' | 'failure' | 'error';
  validated: boolean;
  tests: RunTest[];
  prints: string;
  testPrints: string;
  stderr: string;
  error?: string;
  errorDetail?: string;
  testsSkipped?: boolean;
  saveWarning?: string;
  /** Présent pour un essai admin ou enseignant : la solution n'est pas enregistrée. */
  validationNote?: string;
};

export const SAVE_WARNING = 'La validation n’a pas pu être enregistrée.';

/** Le serveur n'a pas pu exécuter la vérification : ce n'est pas une erreur de l'élève. */
export const CHECK_UNAVAILABLE = 'La vérification n’a pas pu être lancée.';

export function buildPythonCheckSource(userCode: string, verification: string | null): string {
  const payload = JSON.stringify({ user: userCode ?? '', tests: verification ?? '' });
  return `${PYTHON_CHECK_RUNNER}
__nsi_out = json.dumps(_nsi_entry(json.loads(${JSON.stringify(payload)})), ensure_ascii=False)
__nsi_out
`;
}

function asText(value: unknown, limit = 8000): string {
  if (typeof value !== 'string') return '';
  return value.length > limit ? `${value.slice(0, limit)}\n… (affichage tronqué)` : value;
}

function asTest(value: unknown): RunTest | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  const label = asText(item.label, 400);
  if (!label) return null;
  const test: RunTest = { ok: item.ok === true, label };
  const source = asText(item.source, 400);
  const detail = asText(item.detail, 400);
  if (source) test.source = source;
  if (detail) test.detail = detail;
  if (typeof item.actual === 'string') test.actual = asText(item.actual, 500);
  if (typeof item.expected === 'string') test.expected = asText(item.expected, 500);
  if (item.printCompare === true) test.printCompare = true;
  if (typeof item.op === 'string' && item.op) test.op = item.op;
  return test;
}

export function finalizeReport(raw: unknown): RunReport {
  const data = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const tests = Array.isArray(data.tests) ? data.tests.map(asTest).filter((test): test is RunTest => Boolean(test)) : [];
  const anyFail = tests.some((test) => !test.ok);
  let status: RunReport['status'] = 'error';
  if (data.status === 'success' || data.status === 'failure' || data.status === 'error') {
    status = data.status;
  }
  if (status === 'error') {
    status = 'error';
  } else if (anyFail) {
    status = 'failure';
  } else {
    status = 'success';
  }
  const error = asText(data.error, 400);
  const errorDetail = asText(data.errorDetail, 2500);
  return {
    status,
    validated: status === 'success' && tests.every((test) => test.ok),
    tests,
    prints: asText(data.stdout),
    testPrints: asText(data.testStdout),
    stderr: asText(data.stderr),
    error: error || undefined,
    errorDetail: errorDetail && errorDetail !== error ? errorDetail : undefined,
    testsSkipped: data.testsSkipped === true,
  };
}

/** Fields the browser may see: pass/fail, labels, Attendu/Obtenu, and the student output. */
export function reportForClient(report: RunReport): RunReport {
  return {
    status: report.status,
    validated: report.validated,
    tests: report.tests.map((test) => {
      const next: RunTest = { ok: test.ok, label: test.label };
      if (test.detail) next.detail = test.detail;
      if (test.actual !== undefined) next.actual = test.actual;
      if (test.expected !== undefined) next.expected = test.expected;
      if (test.printCompare) next.printCompare = true;
      if (test.op) next.op = test.op;
      return next;
    }),
    prints: report.prints,
    testPrints: report.testPrints,
    stderr: report.stderr,
    error: report.error,
    errorDetail: report.errorDetail,
    testsSkipped: report.testsSkipped,
    saveWarning: report.saveWarning,
    validationNote: report.validationNote,
  };
}

/** True only when the verification ran and every test passed. A bare run has no tests and must not validate. */
export function everyTestPassed(report: RunReport) {
  return report.status === 'success'
    && report.validated
    && report.tests.length > 0
    && report.tests.every((test) => test.ok);
}

export function parsePythonCheckResult(raw: unknown): RunReport {
  const text = typeof raw === 'string' ? raw.trim() : String(raw ?? '').trim();
  return finalizeReport(JSON.parse(text));
}

export function unexpectedRunReport(message: string): RunReport {
  const lines = message.split('\n').map((line) => line.trim()).filter(Boolean);
  const last = (lines[lines.length - 1] || 'Erreur inattendue.').replace(/^PythonError:\s*/, '');
  return {
    status: 'error',
    validated: false,
    tests: [],
    prints: '',
    testPrints: '',
    stderr: '',
    error: last.length > 400 ? `${last.slice(0, 399)}…` : last,
    errorDetail: message.length > 2500 ? message.slice(-2500) : message,
    testsSkipped: true,
  };
}

export function testsUnavailableReport(): RunReport {
  return {
    status: 'failure',
    validated: false,
    tests: [{
      ok: false,
      label: 'Impossible de charger le jeu de tests.',
      detail: 'Réessaie dans un instant.',
    }],
    prints: '',
    testPrints: '',
    stderr: '',
    testsSkipped: true,
  };
}

export function reportFromQuery(input: {
  phase: 'student-error' | 'verification-error' | 'verified' | 'ran';
  message?: string;
}): RunReport {
  const message = (input.message || '').trim();
  if (input.phase === 'student-error') {
    return {
      status: 'error',
      validated: false,
      tests: [],
      prints: '',
      testPrints: '',
      stderr: '',
      error: message ? `Erreur SQL : ${message}` : 'Erreur SQL.',
      testsSkipped: true,
    };
  }
  if (input.phase === 'verification-error') {
    return {
      status: 'failure',
      validated: false,
      tests: [{
        ok: false,
        label: 'La vérification SQL a échoué.',
        detail: message || 'La requête de vérification a renvoyé une erreur.',
      }],
      prints: '',
      testPrints: '',
      stderr: '',
    };
  }
  if (input.phase === 'verified') {
    return {
      status: 'success',
      validated: true,
      tests: [{ ok: true, label: 'La vérification SQL s’est exécutée.' }],
      prints: '',
      testPrints: '',
      stderr: '',
    };
  }
  return {
    status: 'success',
    validated: true,
    tests: [],
    prints: '',
    testPrints: '',
    stderr: '',
  };
}
