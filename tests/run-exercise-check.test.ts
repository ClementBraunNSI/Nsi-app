import { describe, expect, it } from 'vitest';
import { stripHiddenExerciseBlocks } from '../lib/exercise-statement';
import { runPythonCheck, runSqlCheck } from '../lib/run-exercise-check';

describe('hidden exercise blocks', () => {
  it('keeps the énoncé and drops correction and verification before the page is sent', () => {
    const source = [
      '<Enonce>',
      'Écrire `est_majeur`.',
      '<Correction>',
      '```python',
      'def est_majeur(age):',
      '    return age >= 18',
      '```',
      '</Correction>',
      '</Enonce>',
      '<Verification>',
      'assert est_majeur(20) is True',
      '</Verification>',
    ].join('\n');

    const visible = stripHiddenExerciseBlocks(source);
    expect(visible).toMatch(/Écrire `est_majeur`/);
    expect(visible).toMatch(/<Enonce>/);
    expect(visible).not.toMatch(/return age/);
    expect(visible).not.toMatch(/assert est_majeur/);
    expect(visible).not.toMatch(/<Correction>/);
    expect(visible).not.toMatch(/<Verification>/);
  });
});

describe('server exercise check', () => {
  it('returns pass/fail, labels, expected and actual, and prints, without the test source', async () => {
    const passed = await runPythonCheck(
      'def est_majeur(age):\n    return age >= 18\nprint("bonjour")\n',
      'assert est_majeur(20) is True, "majeur"\nassert est_majeur(15) is False, "mineur"\n',
    );
    const failed = await runPythonCheck(
      'def est_majeur(age):\n    return age > 18\n',
      'assert est_majeur(18) is True, "18 ans"\n',
    );

    expect(passed.status).toBe('success');
    expect(passed.validated).toBe(true);
    expect(passed.prints).toContain('bonjour');
    expect(passed.tests.map((test) => test.label)).toEqual(['majeur', 'mineur']);
    expect(passed.tests.every((test) => test.ok && test.source === undefined)).toBe(true);

    expect(failed.validated).toBe(false);
    expect(failed.tests[0]?.expected).toBe('True');
    expect(failed.tests[0]?.actual).toBe('False');
    expect(failed.tests[0]?.source).toBeUndefined();
    expect(JSON.stringify(failed)).not.toContain('return age');
  });

  it('keeps student code away from server secrets, host files and Node internals', async () => {
    process.env.NSI_TEST_SECRET = 'ne-doit-pas-sortir';
    const probe = [
      'import os',
      'res = {}',
      'res["env"] = sorted(os.environ.get(k, "") for k in ["NSI_TEST_SECRET", "SUPABASE_SERVICE_ROLE_KEY"])',
      'for name, target in [("passwd", "/etc/passwd"), ("win", "C:/Windows/win.ini"), ("pkg", "' + process.cwd().replace(/\\/g, '/') + '/package.json")]:',
      '    try:',
      '        open(target).read()',
      '        res[name] = "lu"',
      '    except Exception:',
      '        res[name] = "bloque"',
      'import js',
      'res["js"] = hasattr(js, "process")',
      'import pyodide_js',
      'res["nodefs"] = hasattr(pyodide_js.FS.filesystems, "NODEFS")',
      'try:',
      '    from pyodide.code import run_js',
      '    res["run_js"] = run_js("typeof process")',
      'except Exception:',
      '    res["run_js"] = "bloque"',
      'try:',
      '    res["function"] = pyodide_js.runPython.constructor("return typeof process.getBuiltinModule")()',
      'except Exception:',
      '    res["function"] = "bloque"',
      'print(res)',
    ].join('\n');
    const report = await runPythonCheck(probe, 'assert True\n');
    delete process.env.NSI_TEST_SECRET;

    expect(report.error).toBeUndefined();
    expect(report.prints).not.toContain('ne-doit-pas-sortir');
    expect(report.prints).toContain("'env': ['', '']");
    expect(report.prints).toContain("'passwd': 'bloque'");
    expect(report.prints).toContain("'win': 'bloque'");
    expect(report.prints).toContain("'pkg': 'bloque'");
    expect(report.prints).toContain("'js': False");
    expect(report.prints).toContain("'nodefs': False");
    expect(report.prints).toContain("'run_js': 'bloque'");
    expect(report.prints).toContain("'function': 'bloque'");
  });

  it('grades SQL without returning the verification query', async () => {
    const passed = await runSqlCheck(
      'CREATE TABLE etudiants(id INTEGER); INSERT INTO etudiants VALUES (1);',
      'SELECT * FROM etudiants;',
    );
    const failed = await runSqlCheck('SELECT * FROM missing;', 'SELECT 1;');

    expect(passed.status).toBe('success');
    expect(passed.validated).toBe(true);
    expect(failed.status).toBe('error');
    expect(failed.validated).toBe(false);
    expect(JSON.stringify(passed)).not.toContain('SELECT * FROM etudiants');
  });
});
