import { describe, expect, it } from "vitest";
import { buildPythonCheckSource, parsePythonCheckResult } from "../lib/python-check";
import { readError } from "../lib/python-error-help";

// Erreur levée dans une fonction de l'élève appelée par les tests : le numéro de ligne affiché doit être celui de
// son code (ligne 5 ici), jamais celui du test caché qui appelle la fonction (ligne 6 du jeu de tests).
const PROGRAMME = [
  "def saisir_scores(equipes):",
  "    scores = []",
  "    for equipe in equipes:",
  "        score = -1",
  "        while score < 0:",
  "            score = input('Score : ')",
  "        scores.append(score)",
  "    return scores",
].join("\n");

const TESTS = [
  "import io, contextlib",
  "saisies = []",
  "def _sortie(fonction, *arguments):",
  "    tampon = io.StringIO()",
  "    with contextlib.redirect_stdout(tampon):",
  "        valeur = fonction(*arguments)",
  "    return valeur, tampon.getvalue()",
  "def input(question=''):",
  "    return saisies.pop(0)",
  "saisies[:] = ['12', '18']",
  "valeur, _ = _sortie(saisir_scores, ['A', 'B'])",
  "assert valeur == [12, 18], 'Les scores sont des int.'",
].join("\n");

describe("line number of an error", { timeout: 120_000 }, () => {
  it("points at the student's code, not at the hidden tests", async () => {
    const { loadPyodide } = await import("pyodide");
    const pyodide = await loadPyodide();
    const run = async (user: string, tests: string | null) =>
      parsePythonCheckResult(await pyodide.runPythonAsync(buildPythonCheckSource(user, tests)));

    // Le test plante hors d'un assert (appel par une fonction des tests).
    const crashed = await run(PROGRAMME, TESTS);
    const detail = crashed.tests.find((test) => !test.ok)?.detail ?? "";
    expect(detail).toContain("(ligne 5)");
    expect(detail).not.toContain("(ligne 6)");
    expect(readError(detail)?.line).toBe(5);

    // Le test plante dans un assert : la ligne de l'élève est donnée aussi.
    const inAssert = await run(PROGRAMME, "saisies = ['3']\ndef input(q=''):\n    return saisies.pop(0)\nassert saisir_scores(['A']) == [3]");
    expect(inAssert.tests[0].detail).toContain("(ligne 5)");

    // Erreur qui ne vient pas du code de l'élève : pas de numéro du test caché.
    const missing = await run("x = 1", "y = 2\nresultat = fonction_absente()\nassert resultat == 1");
    const missingDetail = missing.tests.find((test) => !test.ok)?.detail ?? "";
    expect(missingDetail).toContain("fonction_absente");
    expect(missingDetail).not.toMatch(/\(ligne \d+\)/);

    // Les erreurs du programme lui-même gardent leur ligne.
    const syntax = await run("x = 1\nif x == 1\n    print(x)", null);
    expect(syntax.error).toContain("(ligne 2)");
    const runtime = await run("x = 1\ny = 0\nprint(x / y)", null);
    expect(runtime.error).toContain("(ligne 3)");
  });
});
