import { it, expect } from "vitest";
import fs from "fs";
import { everyTestPassed } from "../lib/python-check";
import { runPythonCheck } from "../lib/run-exercise-check";

// Fichier temporaire : solutions fausses ou contournées, qui doivent échouer.
const sheet = fs.readFileSync("content/2/python_exercices_revision_bases.md", "utf8").replace(/\r/g, "");
const tests = (id: string) => {
  const section = sheet.split(`id="${id}"`)[1].split("</ExerciseSection>")[0];
  return section.match(/<Verification>\s*```python\n([\s\S]*?)\n```/)![1];
};
const P = "1nsi-revbases-";

const WRONG: [string, string, string][] = [
  [P + "1-1", "texte recopié", 'nom = "Goupil"\nage = 4\nprint("Goupil a 4 ans")'],
  [P + "1-1", "âge en texte", 'nom = "Goupil"\nage = "4"\nprint(nom, "a", age, "ans")'],
  [P + "1-2", "sans conversion", 'texte = "17"\nnombre = texte\ndouble = nombre * 2\nmessage = "Le double vaut " + str(double)\nprint(message)'],
  [P + "1-2", "34 écrit", 'texte = "17"\nnombre = int(texte)\ndouble = nombre * 2\nmessage = "Le double vaut 34"\nprint(message)'],
  [P + "1-3", "minutes sans modulo", 'secondes = int(input("Durée en secondes : "))\nheures = secondes // 3600\nminutes = secondes // 60\nreste = secondes % 60\nprint(heures, "h", minutes, "min", reste, "s")'],
  [P + "1-3", "division décimale", 'secondes = int(input("Durée en secondes : "))\nheures = secondes / 3600\nminutes = (secondes % 3600) / 60\nreste = secondes % 60\nprint(heures, "h", minutes, "min", reste, "s")'],
  [P + "1-4", "sans variable de côté", 'a = int(input("a : "))\nb = int(input("b : "))\nc = int(input("c : "))\na = b\nb = c\nc = a\nprint(a, b, c)'],
  [P + "1-5", "score écrit", "points = 0\npoints = 15\nprint(\"Score :\", points)"],
  [P + "1-5", "ordre changé", 'points = 0\npoints += 10\npoints *= 2\npoints -= 3\npoints += 1\nprint("Score :", points)'],
  [P + "2-1", "<= au lieu de <", 'age = int(input("Âge : "))\nif age <= 12:\n    tarif = 5\nelse:\n    tarif = 9\nprint("Tarif :", tarif, "€")'],
  [P + "2-2", "ordre inversé", 'note = float(input("Note : "))\nif note >= 10:\n    mention = "Passable"\nelif note >= 12:\n    mention = "Assez bien"\nelif note >= 14:\n    mention = "Bien"\nelif note >= 16:\n    mention = "Très bien"\nelse:\n    mention = "Insuffisant"\nprint(mention)'],
  [P + "2-3", "règle des 100 oubliée", 'annee = int(input("Année : "))\nbissextile = annee % 4 == 0 or annee % 400 == 0\nprint(bissextile)'],
  [P + "2-3", "texte au lieu de booléen", 'annee = int(input("Année : "))\nif (annee % 4 == 0 and annee % 100 != 0) or annee % 400 == 0:\n    bissextile = "True"\nelse:\n    bissextile = "False"\nprint(bissextile)'],
  [P + "2-4", "isocèle testé en premier", 'a = float(input("a : "))\nb = float(input("b : "))\nc = float(input("c : "))\nif a == b or b == c or a == c:\n    sorte = "isocèle"\nelif a == b == c:\n    sorte = "équilatéral"\nelse:\n    sorte = "quelconque"\nprint(sorte)'],
  [P + "2-4", "paire a/c oubliée", 'a = float(input("a : "))\nb = float(input("b : "))\nc = float(input("c : "))\nif a == b == c:\n    sorte = "équilatéral"\nelif a == b or b == c:\n    sorte = "isocèle"\nelse:\n    sorte = "quelconque"\nprint(sorte)'],
  [P + "2-5", "adhérent ignoré", 'montant = float(input("Montant : "))\nadherent = input("Adhérent (oui/non) : ")\nif montant >= 50:\n    frais = 0\nelif montant >= 25:\n    frais = 3\nelse:\n    frais = 6\nprint("Frais :", frais, "€")'],
  [P + "3-1", "fin à 1 exclue", 'n = int(input("Départ : "))\nfor i in range(n, 1, -1):\n    print(i)\nprint("Décollage !")'],
  [P + "3-1", "affichage écrit", 'n = int(input("Départ : "))\nfor i in range(1):\n    print(5)\nprint(4)\nprint(3)\nprint(2)\nprint(1)\nprint("Décollage !")'],
  [P + "3-2", "n exclu", 'n = int(input("n : "))\ntotal = 0\nfor i in range(1, n):\n    total = total + i ** 2\nprint(total)'],
  [P + "3-3", "count", 'mot = input("Mot : ")\nnb_voyelles = 0\nfor v in "aeiouy":\n    nb_voyelles += mot.count(v)\nprint(nb_voyelles)'],
  [P + "3-3", "y oublié", 'mot = input("Mot : ")\nnb_voyelles = 0\nfor lettre in mot:\n    if lettre in "aeiou":\n        nb_voyelles += 1\nprint(nb_voyelles)'],
  [P + "3-4", "une étape de trop", 'n = int(input("Nombre : "))\netapes = 0\nwhile n >= 1:\n    n = n // 2\n    etapes += 1\nprint(etapes)'],
  [P + "3-5", "une seule boucle", 'n = int(input("Taille : "))\nfor i in range(1, n + 1):\n    print(i, i * 2, i * 3)'],
  [P + "3-5", "pas de passage à la ligne", 'n = int(input("Taille : "))\nfor i in range(1, n + 1):\n    for j in range(1, n + 1):\n        print(i * j, end=" ")'],
  [P + "4-1", "print au lieu de return", "def prix_ttc(prix_ht):\n    print(round(prix_ht * 1.2, 2))"],
  [P + "4-1", "sans arrondi", "def prix_ttc(prix_ht):\n    return prix_ht * 1.2"],
  [P + "4-2", "print dans est_pair", "def est_pair(n):\n    print(n % 2 == 0)\n    return n % 2 == 0\n\ndef compte_pairs(debut, fin):\n    c = 0\n    for i in range(debut, fin + 1):\n        if est_pair(i):\n            c += 1\n    return c"],
  [P + "4-2", "fin exclue", "def est_pair(n):\n    return n % 2 == 0\n\ndef compte_pairs(debut, fin):\n    c = 0\n    for i in range(debut, fin):\n        if est_pair(i):\n            c += 1\n    return c"],
  [P + "4-3", "max", "def maximum3(a, b, c):\n    return max(a, b, c)"],
  [P + "4-3", "c oublié", "def maximum3(a, b, c):\n    if a > b:\n        return a\n    return b"],
  [P + "4-4", "return dans la boucle", "def compte(mot, lettre):\n    n = 0\n    for caractere in mot:\n        if caractere == lettre:\n            n += 1\n        return n\n    return n"],
  [P + "4-4", "count", "def compte(mot, lettre):\n    return mot.count(lettre)"],
  [P + "4-5", "1 premier", "def nb_diviseurs(n):\n    return len([d for d in range(1, n + 1) if n % d == 0])\n\ndef est_premier(n):\n    return nb_diviseurs(n) <= 2\n\ndef compter_premiers(n):\n    return len([k for k in range(1, n + 1) if est_premier(k)])"],
  [P + "4-5", "diviseurs sans n", "def nb_diviseurs(n):\n    t = 0\n    for d in range(1, n):\n        if n % d == 0:\n            t += 1\n    return t\n\ndef est_premier(n):\n    return nb_diviseurs(n) == 2\n\ndef compter_premiers(n):\n    c = 0\n    for k in range(1, n + 1):\n        if est_premier(k):\n            c += 1\n    return c"],
];

it("rejects wrong revision solutions", async () => {
  const passed: string[] = [];
  for (const [id, why, code] of WRONG) {
    const report = await runPythonCheck(code, tests(id));
    const failed = report.tests?.filter((t) => !t.ok).map((t) => t.label) ?? [];
    console.log(`${id} (${why}) : ${everyTestPassed(report) ? "PASSE" : "refusé"} — ${failed[0] ?? report.error}`);
    if (everyTestPassed(report)) passed.push(`${id} ${why}`);
  }
  expect(passed).toEqual([]);
}, 600_000);
