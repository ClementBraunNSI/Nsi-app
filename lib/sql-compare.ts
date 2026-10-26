/**
 * Vérification d'un exercice SQL : le résultat de la requête de l'élève est comparé
 * à celui de la requête attendue, chacune sur une copie neuve de la base de départ.
 *
 * Le bloc <Verification> contient la requête attendue. Pour un exercice qui modifie la base
 * (INSERT, UPDATE, DELETE, CREATE), une ligne `-- controle` sépare les instructions attendues
 * de la requête qui relit la base : elle est lancée sur les deux bases et les résultats sont comparés.
 *
 * Sans import ni alias : `node` lit ce fichier tel quel (scripts/audit-exercises.mjs).
 */

export type SqlResult = { columns: string[]; values: unknown[][] };
export type SqlDatabaseLike = { exec: (sql: string) => SqlResult[]; close: () => void };

export type SqlTest = {
  ok: boolean;
  label: string;
  detail?: string;
  actual?: string;
  expected?: string;
};

export type SqlComparison =
  | { phase: 'student-error'; message: string }
  | { phase: 'reference-error'; message: string }
  | { phase: 'compared'; tests: SqlTest[]; result: SqlResult | null };

const MAX_ROWS = 15;

export function splitSqlVerification(verification: string): { reference: string; control: string } {
  const lines = verification.split('\n');
  const at = lines.findIndex((line) => /^\s*--\s*contr[oô]le\b/i.test(line));
  if (at < 0) return { reference: verification.trim(), control: '' };
  return {
    reference: lines.slice(0, at).join('\n').trim(),
    control: lines.slice(at + 1).join('\n').trim(),
  };
}

function cell(value: unknown) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'number' && !Number.isInteger(value)) return String(Math.round(value * 1e6) / 1e6);
  return String(value);
}

export function formatSqlResult(result: SqlResult | null | undefined) {
  if (!result) return '(aucun résultat)';
  const rows = result.values.slice(0, MAX_ROWS).map((row) => row.map(cell).join(' | '));
  const more = result.values.length > MAX_ROWS ? [`… ${result.values.length - MAX_ROWS} lignes de plus`] : [];
  return [result.columns.join(' | '), ...rows, ...more].join('\n') || '(table vide)';
}

function rowKey(row: unknown[]) {
  return JSON.stringify(row.map(cell));
}

/** Les noms de colonnes peuvent différer (alias) ; le nombre de colonnes, les valeurs et, si demandé, l'ordre comptent. */
export function compareSqlResults(actual: SqlResult | null, expected: SqlResult | null, ordered: boolean): SqlTest {
  const label = 'Le résultat est celui attendu';
  if (!expected) {
    return { ok: false, label: 'La requête attendue ne renvoie rien', detail: 'Le jeu de tests de cet exercice est incomplet.' };
  }
  const shown = { actual: formatSqlResult(actual), expected: formatSqlResult(expected) };
  if (!actual) {
    return { ok: false, label, detail: 'La requête ne renvoie aucun résultat : une requête SELECT est attendue.', ...shown };
  }
  if (actual.columns.length !== expected.columns.length) {
    return {
      ok: false,
      label,
      detail: `${expected.columns.length} colonne(s) attendue(s), ${actual.columns.length} obtenue(s).`,
      ...shown,
    };
  }
  if (actual.values.length !== expected.values.length) {
    return {
      ok: false,
      label,
      detail: `${expected.values.length} ligne(s) attendue(s), ${actual.values.length} obtenue(s).`,
      ...shown,
    };
  }
  const got = actual.values.map(rowKey);
  const want = expected.values.map(rowKey);
  if (ordered) {
    const same = got.every((key, i) => key === want[i]);
    if (!same) {
      const sorted = [...got].sort().join('\n') === [...want].sort().join('\n');
      return {
        ok: false,
        label,
        detail: sorted ? 'Les lignes sont les bonnes, mais pas dans l\'ordre demandé.' : 'Les valeurs ne correspondent pas.',
        ...shown,
      };
    }
    return { ok: true, label };
  }
  if ([...got].sort().join('\n') !== [...want].sort().join('\n')) {
    return { ok: false, label, detail: 'Les valeurs ne correspondent pas.', ...shown };
  }
  return { ok: true, label };
}

function lastResult(results: SqlResult[]) {
  return results.length > 0 ? results[results.length - 1] : null;
}

function messageOf(error: unknown) {
  return error instanceof Error ? error.message : String(error ?? '');
}

/** `makeDb` ouvre une base vide ; la base de départ y est chargée avant chaque exécution. */
export function compareSql(
  makeDb: () => SqlDatabaseLike,
  setup: string,
  userCode: string,
  verification: string,
): SqlComparison {
  const { reference, control } = splitSqlVerification(verification);
  const userDb = makeDb();
  const refDb = makeDb();
  try {
    if (setup.trim()) {
      userDb.exec(setup);
      refDb.exec(setup);
    }
    let userResults: SqlResult[];
    try {
      userResults = userDb.exec(userCode);
    } catch (error) {
      return { phase: 'student-error', message: messageOf(error) };
    }
    let refResults: SqlResult[];
    try {
      refResults = reference ? refDb.exec(reference) : [];
    } catch (error) {
      return { phase: 'reference-error', message: messageOf(error) };
    }
    if (!control) {
      const ordered = /\border\s+by\b/i.test(reference);
      const userLast = lastResult(userResults);
      return { phase: 'compared', result: userLast, tests: [compareSqlResults(userLast, lastResult(refResults), ordered)] };
    }
    let expected: SqlResult | null;
    try {
      expected = lastResult(refDb.exec(control));
    } catch (error) {
      return { phase: 'reference-error', message: messageOf(error) };
    }
    let actual: SqlResult | null;
    try {
      actual = lastResult(userDb.exec(control));
    } catch (error) {
      return {
        phase: 'compared',
        result: lastResult(userResults),
        tests: [{ ok: false, label: 'La base a le contenu attendu', detail: `La base ne peut pas être relue : ${messageOf(error)}` }],
      };
    }
    const test = compareSqlResults(actual, expected, /\border\s+by\b/i.test(control));
    return {
      phase: 'compared',
      result: lastResult(userResults),
      tests: [{ ...test, label: 'La base a le contenu attendu' }],
    };
  } finally {
    userDb.close();
    refDb.close();
  }
}
