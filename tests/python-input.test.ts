import { describe, expect, it } from "vitest";
import { buildPythonCheckSource, parsePythonCheckResult } from "../lib/python-check";

// Exécution libre avec input() : le programme s'arrête sur la première question sans réponse, puis repart du début
// avec les réponses déjà données et la même graine du hasard (c'est ce que fait l'éditeur dans le navigateur).
const PROGRAMME = [
  "import random",
  "tirage = random.randint(1, 1000)",
  'nom = input("Prénom ? ")',
  'age = int(input("Âge ? "))',
  'print("Bonjour", nom, "tu as", age, "ans", tirage)',
].join("\n");

describe("input() in a free run", { timeout: 120_000 }, () => {
  it("asks for each answer in turn, keeps the earlier output and the same randomness", async () => {
    const { loadPyodide } = await import("pyodide");
    const pyodide = await loadPyodide();
    const run = async (inputs: string[], seed: number) =>
      parsePythonCheckResult(await pyodide.runPythonAsync(buildPythonCheckSource(PROGRAMME, null, { inputs, seed })));

    const first = await run([], 42);
    expect(first).toMatchObject({ needsInput: true, inputPrompt: "Prénom ? ", status: "success" });
    expect(first.prints).toBe("");

    const second = await run(["Léa"], 42);
    expect(second).toMatchObject({ needsInput: true, inputPrompt: "Âge ? " });
    expect(second.prints).toBe("Prénom ? Léa\n");

    const done = await run(["Léa", "16"], 42);
    expect(done.needsInput).toBeUndefined();
    expect(done.error).toBeUndefined();
    expect(done.prints).toMatch(/^Prénom \? Léa\nÂge \? 16\nBonjour Léa tu as 16 ans \d+\n$/);
    // Même graine : le même tirage d'une relance à l'autre.
    expect((await run(["Léa", "16"], 42)).prints).toBe(done.prints);

    // Une erreur de l'élève après la saisie reste une erreur normale.
    const wrong = await run(["Léa", "seize"], 42);
    expect(wrong.status).toBe("error");
    expect(wrong.needsInput).toBeUndefined();

    // Sans le mode interactif (tests du bouton Vérifier), input() garde son comportement : pas de saisie demandée.
    const plain = parsePythonCheckResult(await pyodide.runPythonAsync(buildPythonCheckSource('print("ok")', null)));
    expect(plain.prints).toBe("ok\n");
    expect(plain.needsInput).toBeUndefined();
  });
});
