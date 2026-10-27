import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { everyTestPassed, finalizeReport, parsePythonCheckResult, buildPythonCheckSource } from '../lib/python-check';
import { PYTHON_CHECK_RUNNER } from '../lib/python-check-runner';

// Windows lit sinon le code source en cp1252 : les accents des messages se perdent.
const PYTHON_ENV = { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' };

function runCheck(user: string, tests: string | null) {
  const source = `${buildPythonCheckSource(user, tests)}\nprint(__nsi_out)\n`;
  const raw = execFileSync('python3', ['-c', source], {
    encoding: 'utf8',
    maxBuffer: 20_000_000,
    timeout: 20000,
    env: PYTHON_ENV,
  });
  return parsePythonCheckResult(raw);
}

describe('python exercise check', () => {
  it('keeps a failed test from validating and still reports the ones that passed', () => {
    const report = runCheck(
      [
        'def est_majeur(age):',
        '    return age > 18',
      ].join('\n'),
      [
        'assert \'est_majeur\' in locals(), "La fonction \'est_majeur\' n\'est pas définie."',
        'assert est_majeur(20) is True, "20 ans : majeur."',
        'assert est_majeur(15) is False, "15 ans : mineur."',
        'assert est_majeur(18) is True, "18 ans : majeur."',
      ].join('\n'),
    );

    expect(report.validated).toBe(false);
    expect(report.status).toBe('failure');
    expect(report.tests.map((test) => [test.ok, test.label])).toEqual([
      [true, "La fonction 'est_majeur' n'est pas définie."],
      [true, '20 ans : majeur.'],
      [true, '15 ans : mineur.'],
      [false, '18 ans : majeur.'],
    ]);
    const failed = report.tests.find((test) => !test.ok);
    expect(failed?.actual).toBe('False');
    expect(failed?.expected).toBe('True');
  });

  it('shows every passed test and the program prints when the solution is correct', () => {
    const report = runCheck(
      [
        'def est_majeur(age):',
        '    if age >= 18:',
        '        return True',
        '    return False',
        'print("verification locale")',
      ].join('\n'),
      [
        'assert \'est_majeur\' in locals(), "La fonction \'est_majeur\' n\'est pas définie."',
        'assert est_majeur(20) is True, "20 ans : majeur."',
        'assert est_majeur(15) is False, "15 ans : mineur."',
        'assert est_majeur(18) is True, "18 ans : majeur."',
      ].join('\n'),
    );

    expect(report.validated).toBe(true);
    expect(report.status).toBe('success');
    expect(report.tests.every((test) => test.ok)).toBe(true);
    expect(report.tests.map((test) => test.label)).toEqual([
      "La fonction 'est_majeur' n'est pas définie.",
      '20 ans : majeur.',
      '15 ans : mineur.',
      '18 ans : majeur.',
    ]);
    expect(report.prints).toContain('verification locale');
  });

  it('shows the unsorted list against the expected one', () => {
    const report = runCheck(
      'def tri_selection(liste):\n    return liste\n',
      [
        'ma_liste = [5, 2, 4, 6, 1, 3]',
        'tri_selection(ma_liste)',
        'assert ma_liste == [1, 2, 3, 4, 5, 6]',
      ].join('\n'),
    );

    expect(report.validated).toBe(false);
    expect(report.tests).toHaveLength(1);
    expect(report.tests[0]?.ok).toBe(false);
    expect(report.tests[0]?.actual).toBe('[5, 2, 4, 6, 1, 3]');
    expect(report.tests[0]?.expected).toBe('[1, 2, 3, 4, 5, 6]');
  });

  it('shows expected and actual printed text when they differ', () => {
    const report = runCheck(
      'def saluer():\n    print("Bonjour")\n',
      [
        'import io, sys',
        'buf = io.StringIO()',
        'sys.stdout = buf',
        'saluer()',
        'sys.stdout = sys.__stdout__',
        'assert buf.getvalue().strip() == "Bonsoir", "Le message affiché est incorrect."',
      ].join('\n'),
    );

    expect(report.validated).toBe(false);
    const failed = report.tests.find((test) => !test.ok);
    expect(failed?.label).toBe('Le message affiché est incorrect.');
    expect(failed?.printCompare).toBe(true);
    expect(failed?.expected).toBe('Bonsoir');
    expect(failed?.actual).toBe('Bonjour');
  });

  it('keeps prints produced while the tests call the program', () => {
    const report = runCheck(
      'def afficher_somme(a, b):\n    print(a + b)\n',
      [
        'assert \'afficher_somme\' in locals(), "La fonction \'afficher_somme\' n\'est pas définie."',
        'assert afficher_somme(2, 3) is None, "La fonction ne doit rien renvoyer (None)."',
      ].join('\n'),
    );

    expect(report.validated).toBe(true);
    expect(report.testPrints).toContain('5');
  });

  it('runs only the assertion of the branch that applies', () => {
    const report = runCheck(
      'age = 20\nmessage = "Vous êtes majeur"\n',
      [
        'assert \'age\' in locals(), "La variable \'age\' n\'est pas définie."',
        'assert \'message\' in locals(), "La variable \'message\' n\'est pas définie."',
        'if age >= 18:',
        '    assert "majeur" in message.lower(), f"Pour age={age}, le message doit contenir \'majeur\'."',
        'else:',
        '    assert "mineur" in message.lower(), f"Pour age={age}, le message doit contenir \'mineur\'."',
      ].join('\n'),
    );

    expect(report.validated).toBe(true);
    expect(report.tests.map((test) => test.label)).toEqual([
      "La variable 'age' n'est pas définie.",
      "La variable 'message' n'est pas définie.",
      "Pour age=20, le message doit contenir 'majeur'.",
    ]);
  });

  it('returns prints for a bare run but does not treat it as a passed test suite', () => {
    const report = runCheck('print("bonjour")\n', null);
    expect(report.tests).toEqual([]);
    expect(report.prints).toContain('bonjour');
    expect(everyTestPassed(report)).toBe(false);
  });

  it('does not validate a program that fails before the tests', () => {
    const report = runCheck('print("demi")\nest_majeur(18)\n', 'assert False, "ne doit pas tourner"');
    expect(report.validated).toBe(false);
    expect(report.status).toBe('error');
    expect(report.testsSkipped).toBe(true);
    expect(report.prints).toContain('demi');
    expect(report.error).toMatch(/est_majeur/);
    expect(report.tests).toEqual([]);
  });

  it('answers input() with the ENTREES of the tests and shows them like a terminal', () => {
    const user = 'nom = input("Nom ? ")\nage = int(input("Âge ? "))\nprint(nom, age + 1)\n';
    const report = runCheck(user, 'ENTREES = ["Marguerite", "4"]\nassert age == 4\nassert nom == "Marguerite"');
    expect(report.validated).toBe(true);
    expect(report.prints).toContain('Nom ? Marguerite');
    expect(report.prints).toContain('Marguerite 5');

    const rerun = runCheck(
      'n = int(input())\nprint("pair" if n % 2 == 0 else "impair")\n',
      'ENTREES = ["3"]\nassert SORTIE.strip().endswith("impair")\nvariables, sortie = relancer(["8"])\nassert variables["n"] == 8\nassert sortie.strip().endswith("pair") and "impair" not in sortie',
    );
    expect(rerun.validated).toBe(true);
    expect(rerun.tests).toHaveLength(3);

    const short = runCheck(user, 'ENTREES = ["Marguerite"]\nassert age == 4');
    expect(short.validated).toBe(false);
    expect(short.error).toMatch(/saisies/);
  });

  it('refuses to validate when the runner claims success but a test failed', () => {
    const report = finalizeReport({
      status: 'success',
      validated: true,
      stdout: 'salut',
      tests: [{ ok: false, label: 'Échec du tri' }],
    });
    expect(report.validated).toBe(false);
    expect(report.status).toBe('failure');
    expect(report.prints).toBe('salut');
  });
});

function dedent(str: string) {
  const lines = str.split('\n');
  if (lines[0]?.trim() === '') lines.shift();
  if (lines[lines.length - 1]?.trim() === '') lines.pop();
  let minIndent = Infinity;
  for (const line of lines) {
    if (line.trim()) minIndent = Math.min(minIndent, line.search(/\S/));
  }
  if (minIndent === Infinity) return str.trim();
  return lines.map((line) => (line.length >= minIndent ? line.slice(minIndent) : line)).join('\n').trim();
}

function stripFence(code: string) {
  return dedent(code)
    .replace(/^```(?:python|py|sql|c|cs|javascript|js)?\s*\n?/i, '')
    .replace(/\n?```\s*$/, '')
    .trim();
}

function pythonBlocks(source: string) {
  const blocks: string[] = [];
  const pattern = /```python\s*\n([\s\S]*?)```/gi;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source))) blocks.push(dedent(match[1] || ''));
  return blocks.filter(Boolean);
}

describe('existing exercise verifications', () => {
  it('agrees with a direct run of each Python correction', () => {
    const contentDir = path.join(process.cwd(), 'content');
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.mdx?$/.test(entry.name)) files.push(full);
      }
    };
    walk(contentDir);

    const cases: { id: string; user: string; tests: string }[] = [];
    const sectionPattern = /<ExerciseSection\b([^>]*)>([\s\S]*?)<\/ExerciseSection>/g;
    for (const file of files) {
      const text = fs.readFileSync(file, 'utf8');
      let section: RegExpExecArray | null;
      while ((section = sectionPattern.exec(text))) {
        const idMatch = section[1].match(/\bid="([^"]+)"/);
        const body = section[2];
        const verification = body.match(/<Verification>([\s\S]*?)<\/Verification>/);
        if (!verification) continue;
        const tests = stripFence(verification[1] || '');
        if (!/^\s*assert\b/m.test(tests) && !tests.includes('assert ')) continue;
        const corrections = [...body.matchAll(/<Correction>([\s\S]*?)<\/Correction>/g)]
          .flatMap((match) => pythonBlocks(match[1] || ''));
        if (corrections.length === 0) continue;
        // Ces aides n'existent que dans le programme de vérification : une exécution brute ne peut pas les rejouer.
        if (/\b(ENTREES|SORTIE|relancer|PROGRAMME)\b/.test(tests)) continue;
        const starter = body.match(/<CodeDepart>([\s\S]*?)<\/CodeDepart>/);
        const user = [...(starter ? pythonBlocks(starter[1] || '') : []), ...corrections].join('\n\n');
        if (/\binput\s*\(/.test(user) || /\binput\s*\(/.test(tests)) continue;
        cases.push({
          id: `${path.basename(file)}:${idMatch?.[1] || cases.length}`,
          user,
          tests,
        });
      }
    }

    expect(cases.length).toBeGreaterThan(20);

    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nsi-check-'));
    const driverPath = path.join(dir, 'driver.py');
    const casesPath = path.join(dir, 'cases.json');
    fs.writeFileSync(casesPath, JSON.stringify(cases));
    fs.writeFileSync(driverPath, `${PYTHON_CHECK_RUNNER}
import json, signal, sys

class _Timeout(Exception):
    pass

def _alarm(signum, frame):
    raise _Timeout()

# SIGALRM n'existe pas sous Windows : la limite de temps n'y est pas appliquée.
_ALARM = hasattr(signal, "SIGALRM")
if _ALARM:
    signal.signal(signal.SIGALRM, _alarm)
cases = json.loads(open(sys.argv[1], encoding="utf-8").read())
out = []
for case in cases:
    if _ALARM:
        signal.alarm(3)
    try:
        report = _nsi_run(case["user"], case["tests"])
        ns = {"__name__": "__main__", "__builtins__": __builtins__}
        raw_ok = True
        try:
            exec(compile(case["user"], "<programme>", "exec"), ns)
            if str(case["tests"]).strip():
                exec(compile(case["tests"], "<verification>", "exec"), ns)
        except _Timeout:
            raise
        except Exception:
            raw_ok = False
        out.append({
            "id": case["id"],
            "rawOk": raw_ok,
            "validated": report["validated"],
            "instrumented": report["instrumented"],
            "status": report["status"],
            "failed": [item.get("label") for item in report["tests"] if not item.get("ok")],
        })
    except _Timeout:
        out.append({"id": case["id"], "timeout": True})
    except Exception as exc:
        out.append({"id": case["id"], "crash": type(exc).__name__ + ": " + str(exc)})
    finally:
        if _ALARM:
            signal.alarm(0)
open(sys.argv[2], "w", encoding="utf-8").write(json.dumps(out, ensure_ascii=False))
`);

    const resultPath = path.join(dir, 'result.json');
    execFileSync('python3', [driverPath, casesPath, resultPath], {
      encoding: 'utf8',
      maxBuffer: 50_000_000,
      timeout: 90000,
      env: { ...PYTHON_ENV, MPLBACKEND: 'Agg' },
      // Les corrections écrivent des fichiers (pokedex.csv, systeme.log…) : pas dans le dépôt.
      cwd: dir,
    });
    const results = JSON.parse(fs.readFileSync(resultPath, 'utf8')) as Array<{
      id: string;
      rawOk?: boolean;
      validated?: boolean;
      instrumented?: boolean;
      timeout?: boolean;
      crash?: string;
      failed?: string[];
      status?: string;
    }>;

    const problems = results.filter((result) => {
      if (result.timeout || result.crash) return true;
      if (result.validated !== result.rawOk) return true;
      if (result.rawOk && result.instrumented !== true) return true;
      if (result.rawOk && result.status !== 'success') return true;
      return false;
    });

    expect(problems.slice(0, 12)).toEqual([]);
  }, 90000);
});
