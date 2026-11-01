import { describe, expect, it } from "vitest";
import { runPythonCheck } from "../lib/run-exercise-check";
import { explainFailedTest, explainPythonError } from "../lib/python-error-help";

/** Erreur réelle de Pyodide pour ce programme, puis son explication. */
async function explainRun(code: string) {
  const report = await runPythonCheck(code, "assert True");
  expect(report.status, `le programme devait échouer :\n${code}`).toBe("error");
  return explainPythonError(report.error ?? "", report.errorDetail, code);
}

/** Premier test raté sur ce programme, puis sa piste. */
async function explainTest(code: string, verification: string) {
  const report = await runPythonCheck(code, verification);
  const failed = report.tests.find((test) => !test.ok);
  expect(failed, `un test devait échouer :\n${code}`).toBeDefined();
  return explainFailedTest(failed!, code);
}

describe("Python errors explained with the real interpreter", () => {
  const cases: [string, string, RegExp][] = [
    ["deux-points", "def f(x)\n    return x", /deux-points/],
    ["bloc non décalé", "if True:\nprint('oui')", /bloc qui suit n'est pas décalé/],
    ["retrait incohérent", "def f():\n    x = 1\n  return x", /retrait de cette ligne/],
    ["= au lieu de ==", "x = 3\nif x = 3:\n    print(x)", /« = » est utilisé à la place de « == »/],
    ["parenthèse", "print((1 + 2)", /n'est jamais fermée/],
    ["guillemet", "print(\"bonjour)", /n'est pas refermé/],
    ["caractère copié", "print(‘bonjour’)", /n'est pas accepté/],
    ["2x", "x = 3\ny = 2x", /collé à des lettres/],
    ["faute de frappe", "total = 3\nprint(totla)", /peut-être « total »/],
    ["majuscule de True", "x = true", /s'écrit « True »/],
    ["texte sans guillemets", "def parite(n):\n    return pair\nparite(2)", /n'a pas de valeur/],
    ["nombre + texte", "age = '15'\nprint(age + 1)", /nombre et un texte sont mélangés/],
    ["concaténation", "n = 3\nprint('n vaut ' + n)", /nombre et un texte sont mélangés/],
    ["comparaison texte/nombre", "age = '15'\nprint(age > 10)", /texte est comparé à un nombre/],
    ["None", "def f():\n    print(3)\nprint(f() + 1)", /fonction ne renvoie probablement rien/],
    ["sort renvoie None", "t = [3, 1]\nt = t.sort()\nprint(t[0])", /fonction ne renvoie probablement rien/],
    ["argument manquant", "def f(a, b):\n    return a + b\nf(1)", /trop peu de valeurs/],
    ["for sur un nombre", "for i in 5:\n    print(i)", /parcourt un nombre/],
    ["indice", "t = [1, 2, 3]\nprint(t[3])", /dépasse la taille de la liste/],
    ["indice à virgule", "t = [1, 2, 3]\nprint(t[len(t) / 2])", /nombre à virgule/],
    ["clé", "d = {'a': 1}\nprint(d['b'])", /La clé « b » n'est pas dans le dictionnaire/],
    ["division par zéro", "print(1 / 0)", /division par zéro/i],
    ["int() sur un texte", "int('douze')", /ne peut pas devenir un nombre/],
    ["append sur un texte", "mot = 'a'\nmot.append('b')", /append/],
    ["récursion", "def f(n):\n    return f(n - 1)\nf(3)", /s'appelle elle-même/],
    ["variable locale", "total = 0\ndef ajoute():\n    total = total + 1\najoute()", /utilisée dans la fonction avant/],
  ];

  for (const [name, code, expected] of cases) {
    it(name, async () => {
      const help = await explainRun(code);
      expect(help?.title ?? "(aucune explication)").toMatch(expected);
    });
  }

  it("points to the faulty line", async () => {
    const help = await explainRun("x = 1\ny = 2\nprint(z)");
    expect(help?.line).toBe(3);
    expect(help?.lineText).toBe("print(z)");
  });
});

describe("failed tests get a hint", () => {
  it("spots a function that prints instead of returning", async () => {
    const help = await explainTest("def double(x):\n    print(x * 2)", "assert double(2) == 4");
    expect(help?.title).toMatch(/ne renvoie rien/);
    expect(help?.text).toMatch(/print affiche/);
  });

  it("spots an off-by-one bound", async () => {
    const help = await explainTest("def somme(n):\n    s = 0\n    for i in range(n):\n        s = s + 1\n    return s", "assert somme(5) == 6");
    expect(help?.title).toMatch(/décalé de 1/);
  });

  it("spots / instead of //", async () => {
    const help = await explainTest("def milieu(n):\n    return n / 2", "assert milieu(5) == 2");
    expect(help?.text).toMatch(/« \/\/ »/);
  });

  it("spots a number returned as text, which looks identical on screen", async () => {
    const help = await explainTest("def f():\n    return '5'", "assert f() == 5");
    expect(help?.title).toMatch(/pas le bon type/);
  });

  it("spots a text that only differs by case or accents", async () => {
    const help = await explainTest("def parite(n):\n    return 'Pair'", "assert parite(2) == 'pair'");
    expect(help?.title).toMatch(/presque juste/);
  });

  it("spots an inverted condition", async () => {
    const help = await explainTest("def majeur(age):\n    return age > 18", "assert majeur(18) == True");
    expect(help?.title).toMatch(/False au lieu de True/);
  });

  it("explains an error raised during a test", async () => {
    const help = await explainTest("def f(t):\n    return t[10]", "assert f([1, 2]) == 1");
    expect(help?.title).toMatch(/dépasse la taille de la liste/);
  });

  it("stays quiet when it has nothing useful to say", () => {
    expect(explainFailedTest({ ok: false, label: "f(3) vaut 9", actual: "42", expected: "9" }, "def f(x):\n    return 42")).toBeNull();
    expect(explainPythonError("Message sans erreur Python", undefined, "")).toBeNull();
  });
});
