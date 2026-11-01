---
title: Listes par compréhension - Exercices
description: >-
  Série d'exercices gradués pour maîtriser les listes par compréhension en
  Python.
level: TNSI
order: 85
chapter: Langages et Programmation
icon: "code"
badgeId: terminale_listes_comp
prerequisites:
  - prog_modularite_mise_au_point
audience: public
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="listes-comprehension-exos" courseTitle="Maitre de la compréhension">

<ExerciseSection id="tnsi-comp-1-1" label="1.1 [Introduction] - Carrés" type="python">
<Enonce>
### Carrés

Écrire une fonction `carres(n)` qui renvoie la liste `[0, 1, 4, …, (n-1)²]`, construite **par compréhension**.

<Indices>
<Indice>

Une liste par compréhension s'écrit `[expression for variable in iterable]`.

</Indice>
<Indice>

L'expression est `i * i` et l'itérable `range(n)`.

</Indice>
<Indice>

```text
FONCTION carres(n)
    RENVOYER [i × i POUR i DANS range(n)]
```

</Indice>
</Indices>

<Correction>

```python
def carres(n: int) -> list:
    return [i * i for i in range(n)]
```

</Correction>
</Enonce>
<Verification>

```python
assert carres(5) == [0, 1, 4, 9, 16] and carres(0) == [], "carres(5) et carres(0)."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-1-2" label="1.2 [Introduction] - Tout en majuscules" type="python">
<Enonce>
### Tout en majuscules

Écrire une fonction `majuscules(mots)` qui renvoie la liste des mots écrits en majuscules, par compréhension.

<Indices>
<Indice>

L'expression appliquée à chaque mot est `mot.upper()`.

</Indice>
<Indice>

`[… for mot in mots]`.

</Indice>
<Indice>

```text
FONCTION majuscules(mots)
    RENVOYER [majuscules(mot) POUR mot DANS mots]
```

</Indice>
</Indices>

<Correction>

```python
def majuscules(mots: list) -> list:
    return [mot.upper() for mot in mots]
```

</Correction>
</Enonce>
<Verification>

```python
assert majuscules(["nsi", "Renard"]) == ["NSI", "RENARD"] and majuscules([]) == [], "Mise en majuscules."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-1-3" label="1.3 [Introduction] - Filtrer les pairs" type="python">
<Enonce>
### Filtrer les pairs

Écrire une fonction `pairs(nombres)` qui renvoie, par compréhension, la liste des nombres pairs de `nombres`, dans l'ordre.

<Indices>
<Indice>

Une compréhension peut filtrer : `[x for x in liste if condition]`.

</Indice>
<Indice>

La condition est `x % 2 == 0`.

</Indice>
<Indice>

```text
FONCTION pairs(nombres)
    RENVOYER [x POUR x DANS nombres SI x pair]
```

</Indice>
</Indices>

<Correction>

```python
def pairs(nombres: list) -> list:
    return [x for x in nombres if x % 2 == 0]
```

</Correction>
</Enonce>
<Verification>

```python
assert pairs([5, 8, 2, 7, 10]) == [8, 2, 10] and pairs([1, 3]) == [], "Filtre des pairs."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-1-4" label="1.4 [Introduction] - Longueurs" type="python">
<Enonce>
### Longueurs

Écrire une fonction `longueurs(mots)` qui renvoie, par compréhension, la liste des longueurs des mots.

<Indices>
<Indice>

`len(mot)` donne la longueur d'un mot.

</Indice>
<Indice>

L'expression de la compréhension est `len(mot)`.

</Indice>
<Indice>

```text
FONCTION longueurs(mots)
    RENVOYER [longueur(mot) POUR mot DANS mots]
```

</Indice>
</Indices>

<Correction>

```python
def longueurs(mots: list) -> list:
    return [len(mot) for mot in mots]
```

</Correction>
</Enonce>
<Verification>

```python
assert longueurs(["le", "renard", ""]) == [2, 6, 0], "Longueurs."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-2-1" label="2.1 [Facile] - Doubler les positifs" type="python">
<Enonce>
### Doubler les positifs

Écrire une fonction `doubles_positifs(nombres)` qui renvoie, par compréhension, le double de chaque nombre **strictement positif**, en ignorant les autres.

<Indices>
<Indice>

Combiner une transformation et un filtre : `[expression for x in liste if condition]`.

</Indice>
<Indice>

L'expression est `2 * x`, la condition `x > 0`.

</Indice>
<Indice>

```text
FONCTION doubles_positifs(nombres)
    RENVOYER [2x POUR x DANS nombres SI x > 0]
```

</Indice>
</Indices>

<Correction>

```python
def doubles_positifs(nombres: list) -> list:
    return [2 * x for x in nombres if x > 0]
```

</Correction>
</Enonce>
<Verification>

```python
assert doubles_positifs([3, -1, 0, 5]) == [6, 10] and doubles_positifs([-2]) == [], "Doubles des positifs."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-2-2" label="2.2 [Facile] - Sigle" type="python">
<Enonce>
### Sigle

Écrire une fonction `sigle(expression)` qui renvoie le sigle d'une expression : les initiales en majuscules des mots de **plus de deux lettres**.

Exemple : `sigle("numérique et sciences informatiques")` renvoie `"NSI"`.

<Indices>
<Indice>

`expression.split()` donne la liste des mots.

</Indice>
<Indice>

Une compréhension avec un filtre sur `len(mot) > 2` construit la liste des initiales ; `"".join(...)` les colle.

</Indice>
<Indice>

```text
FONCTION sigle(expression)
    initiales ← [majuscule(mot[0]) POUR mot DANS mots de expression SI longueur(mot) > 2]
    RENVOYER initiales collées
```

</Indice>
</Indices>

<Correction>

```python
def sigle(expression: str) -> str:
    return "".join([mot[0].upper() for mot in expression.split() if len(mot) > 2])
```

</Correction>
</Enonce>
<Verification>

```python
assert sigle("numérique et sciences informatiques") == "NSI", "NSI."
assert sigle("société nationale des chemins de fer") == "SNDCF" and sigle("") == "", "Autre sigle, puis texte vide."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-2-3" label="2.3 [Facile] - Table de multiplication" type="python">
<Enonce>
### Table de multiplication

Écrire une fonction `table(n)` qui renvoie, par compréhension, la liste des 10 textes `"n x i = résultat"` pour `i` de 1 à 10.

Exemple : le premier élément de `table(7)` est `"7 x 1 = 7"`.

<Indices>
<Indice>

Une f-string dans l'expression : `f"{n} x {i} = {n * i}"`.

</Indice>
<Indice>

`range(1, 11)` parcourt les multiplicateurs.

</Indice>
<Indice>

```text
FONCTION table(n)
    RENVOYER [texte "n x i = n×i" POUR i DE 1 À 10]
```

</Indice>
</Indices>

<Correction>

```python
def table(n: int) -> list:
    return [f"{n} x {i} = {n * i}" for i in range(1, 11)]
```

</Correction>
</Enonce>
<Verification>

```python
t = table(7)
assert len(t) == 10 and t[0] == "7 x 1 = 7" and t[-1] == "7 x 10 = 70", "Table de 7."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-2-4" label="2.4 [Facile] - Lettres en double" type="python">
<Enonce>
### Lettres en double

Écrire une fonction `en_double(mot)` qui renvoie, par compréhension, la liste triée **sans doublon** des lettres qui apparaissent au moins deux fois dans `mot`.

<Indices>
<Indice>

Une compréhension d'**ensemble** s'écrit avec des accolades : `{c for c in mot if …}`, et ne garde pas de doublon.

</Indice>
<Indice>

`mot.count(c)` compte les apparitions de `c` ; `sorted(...)` renvoie une liste triée.

</Indice>
<Indice>

```text
FONCTION en_double(mot)
    RENVOYER liste triée de l'ensemble {c POUR c DANS mot SI mot.count(c) ≥ 2}
```

</Indice>
</Indices>

<Correction>

```python
def en_double(mot: str) -> list:
    return sorted({c for c in mot if mot.count(c) >= 2})
```

</Correction>
</Enonce>
<Verification>

```python
assert en_double("abracadabra") == ["a", "b", "r"] and en_double("nsi") == [], "Lettres répétées."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-3-1" label="3.1 [Moyen] - Grille indépendante" type="python">
<Enonce>
### Grille indépendante

Écrire une fonction `grille(n, p, valeur)` qui renvoie, par compréhension, une grille de `n` lignes et `p` colonnes remplie de `valeur`, dont les lignes sont **indépendantes**.

<Indices>
<Indice>

Une compréhension dans une compréhension : la compréhension extérieure crée les lignes, l'intérieure les cases.

</Indice>
<Indice>

Chaque tour de la compréhension extérieure crée une **nouvelle** liste, contrairement à `[ligne] * n`.

</Indice>
<Indice>

```text
FONCTION grille(n, p, valeur)
    RENVOYER [[valeur POUR _ DANS range(p)] POUR _ DANS range(n)]
```

</Indice>
</Indices>

<Correction>

```python
def grille(n: int, p: int, valeur) -> list:
    return [[valeur for _ in range(p)] for _ in range(n)]
```

</Correction>
</Enonce>
<Verification>

```python
g = grille(2, 3, 0)
assert g == [[0, 0, 0], [0, 0, 0]], "Grille 2 × 3."
g[0][0] = 5
assert g[1][0] == 0, "Lignes indépendantes."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-3-2" label="3.2 [Moyen] - Aplatir" type="python">
<Enonce>
### Aplatir

Écrire une fonction `aplatir(matrice)` qui renvoie, par compréhension, la liste de tous les éléments d'une liste de listes, ligne après ligne.

Exemple : `[[1, 2], [3], []]` donne `[1, 2, 3]`.

<Indices>
<Indice>

Une compréhension peut contenir deux `for` à la suite : `[x for ligne in matrice for x in ligne]`.

</Indice>
<Indice>

Les `for` se lisent dans le même ordre que des boucles imbriquées.

</Indice>
<Indice>

```text
FONCTION aplatir(matrice)
    RENVOYER [x POUR ligne DANS matrice POUR x DANS ligne]
```

</Indice>
</Indices>

<Correction>

```python
def aplatir(matrice: list) -> list:
    return [x for ligne in matrice for x in ligne]
```

</Correction>
</Enonce>
<Verification>

```python
assert aplatir([[1, 2], [3], []]) == [1, 2, 3] and aplatir([]) == [], "Aplatissement."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-3-3" label="3.3 [Moyen] - Transposée" type="python">
<Enonce>
### Transposée

Écrire une fonction `transposee(m)` qui renvoie, par compréhension, la transposée d'une matrice (pas forcément carrée).

<Indices>
<Indice>

La ligne `j` de la transposée contient `m[i][j]` pour toutes les lignes `i`.

</Indice>
<Indice>

`[[m[i][j] for i in range(len(m))] for j in range(len(m[0]))]`.

</Indice>
<Indice>

```text
FONCTION transposee(m)
    RENVOYER [[m[i][j] POUR i DES lignes] POUR j DES colonnes]
```

</Indice>
</Indices>

<Correction>

```python
def transposee(m: list) -> list:
    return [[m[i][j] for i in range(len(m))] for j in range(len(m[0]))]
```

</Correction>
</Enonce>
<Verification>

```python
assert transposee([[1, 2, 3], [4, 5, 6]]) == [[1, 4], [2, 5], [3, 6]] and transposee([[7]]) == [[7]], "Transposées."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-3-4" label="3.4 [Moyen] - Dictionnaire par compréhension" type="python">
<Enonce>
### Dictionnaire par compréhension

Écrire une fonction `index_longueurs(mots)` qui renvoie, par compréhension de dictionnaire, le dictionnaire mot → longueur.

Exemple : `["le", "renard"]` donne `{"le": 2, "renard": 6}`.

<Indices>
<Indice>

Une compréhension de dictionnaire s'écrit `{cle: valeur for … in …}`.

</Indice>
<Indice>

La clé est `mot`, la valeur `len(mot)`.

</Indice>
<Indice>

```text
FONCTION index_longueurs(mots)
    RENVOYER {mot: longueur(mot) POUR mot DANS mots}
```

</Indice>
</Indices>

<Correction>

```python
def index_longueurs(mots: list) -> dict:
    return {mot: len(mot) for mot in mots}
```

</Correction>
</Enonce>
<Verification>

```python
assert index_longueurs(["le", "renard"]) == {"le": 2, "renard": 6} and index_longueurs([]) == {}, "Longueurs."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-4-1" label="4.1 [Difficile] - Nombres parfaits" type="python">
<Enonce>
### Nombres parfaits

Écrire deux fonctions, chacune en une ligne avec une compréhension :
- `diviseurs(n)` : la liste des diviseurs de `n` strictement inférieurs à `n` ;
- `parfaits(limite)` : la liste des nombres parfaits de 2 à `limite` (égaux à la somme de leurs diviseurs stricts).

<Indices>
<Indice>

`diviseurs` filtre `range(1, n)` avec `n % d == 0`.

</Indice>
<Indice>

`parfaits` filtre `range(2, limite + 1)` avec la condition `sum(diviseurs(n)) == n`.

</Indice>
<Indice>

```text
FONCTION diviseurs(n) : RENVOYER [d POUR d DE 1 À n - 1 SI d divise n]
FONCTION parfaits(limite) : RENVOYER [n POUR n DE 2 À limite SI somme(diviseurs(n)) = n]
```

</Indice>
</Indices>

<Correction>

```python
def diviseurs(n: int) -> list:
    return [d for d in range(1, n) if n % d == 0]


def parfaits(limite: int) -> list:
    return [n for n in range(2, limite + 1) if sum(diviseurs(n)) == n]
```

</Correction>
</Enonce>
<Verification>

```python
assert diviseurs(12) == [1, 2, 3, 4, 6] and diviseurs(1) == [], "Diviseurs de 12 et de 1."
assert parfaits(500) == [6, 28, 496], "Parfaits jusqu'à 500."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-4-2" label="4.2 [Difficile] - Triplets de Pythagore" type="python">
<Enonce>
### Triplets de Pythagore

Écrire une fonction `pythagore(n)` qui renvoie, par compréhension, la liste des triplets `(a, b, c)` d'entiers tels que `a < b < c <= n` et `a² + b² = c²`, dans l'ordre croissant de `a`, puis de `b`.

<Indices>
<Indice>

Trois `for` dans la compréhension, avec des bornes qui dépendent des variables précédentes pour garantir `a < b < c`.

</Indice>
<Indice>

`for a in range(1, n + 1) for b in range(a + 1, n + 1) for c in range(b + 1, n + 1) if …`.

</Indice>
<Indice>

```text
FONCTION pythagore(n)
    RENVOYER [(a, b, c) POUR a DE 1 À n POUR b DE a + 1 À n POUR c DE b + 1 À n SI a² + b² = c²]
```

</Indice>
</Indices>

<Correction>

```python
def pythagore(n: int) -> list:
    return [(a, b, c) for a in range(1, n + 1) for b in range(a + 1, n + 1) for c in range(b + 1, n + 1) if a * a + b * b == c * c]
```

</Correction>
</Enonce>
<Verification>

```python
assert pythagore(15) == [(3, 4, 5), (5, 12, 13), (6, 8, 10), (9, 12, 15)], "Jusqu'à 15."
assert pythagore(4) == [], "Aucun sous 5."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-4-3" label="4.3 [Difficile] - Écrêter" type="python">
<Enonce>
### Écrêter

Écrire une fonction `ecreter(valeurs, mini, maxi)` qui renvoie, par compréhension, la liste où chaque valeur sous `mini` est remplacée par `mini` et chaque valeur au-dessus de `maxi` par `maxi`.

Contrainte : sans `min` ni `max`.

<Indices>
<Indice>

Une expression conditionnelle s'écrit `a if condition else b` ; elle peut se placer **avant** le `for` de la compréhension.

</Indice>
<Indice>

Deux conditions s'enchaînent : `mini if v < mini else (maxi if v > maxi else v)`.

</Indice>
<Indice>

```text
FONCTION ecreter(valeurs, mini, maxi)
    RENVOYER [mini SI v < mini SINON (maxi SI v > maxi SINON v) POUR v DANS valeurs]
```

</Indice>
</Indices>

<Correction>

```python
def ecreter(valeurs: list, mini: float, maxi: float) -> list:
    return [mini if v < mini else (maxi if v > maxi else v) for v in valeurs]
```

</Correction>
</Enonce>
<Verification>

```python
assert ecreter([-5, 3, 12, 7], 0, 10) == [0, 3, 10, 7], "Valeurs ramenées entre 0 et 10."
assert ecreter([], 0, 1) == [], "Liste vide."
import re
assert not re.search(r"\b(min|max)\s*\(", PROGRAMME), "Sans min ni max."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-4-4" label="4.4 [Difficile] - Dictionnaires filtrés" type="python">
<Enonce>
### Dictionnaires filtrés

Écrire deux fonctions par compréhension de dictionnaire :
- `au_dessus(notes, seuil)` : le dictionnaire des élèves dont la note atteint au moins `seuil` ;
- `inverser(d)` : le dictionnaire inversé (valeurs ↔ clés), les valeurs de `d` étant toutes différentes.

<Indices>
<Indice>

`d.items()` donne les couples `(cle, valeur)` à parcourir : `{k: v for k, v in d.items() if …}`.

</Indice>
<Indice>

Pour inverser, échanger les rôles : `{v: k for k, v in d.items()}`.

</Indice>
<Indice>

```text
FONCTION au_dessus(notes, seuil) : RENVOYER {nom: note POUR (nom, note) DANS notes SI note ≥ seuil}
FONCTION inverser(d) : RENVOYER {v: k POUR (k, v) DANS d}
```

</Indice>
</Indices>

<Correction>

```python
def au_dessus(notes: dict, seuil: float) -> dict:
    return {nom: note for nom, note in notes.items() if note >= seuil}


def inverser(d: dict) -> dict:
    return {v: k for k, v in d.items()}
```

</Correction>
</Enonce>
<Verification>

```python
n = {"Léa": 14, "Tom": 9, "Inès": 10}
assert au_dessus(n, 10) == {"Léa": 14, "Inès": 10} and au_dessus(n, 20) == {}, "Filtre des notes."
assert inverser({"a": 1, "b": 2}) == {1: "a", 2: "b"}, "Inversion."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-5-1" label="5.1 [Expert] - Premiers en une ligne" type="python">
<Enonce>
### Premiers en une ligne

Écrire une fonction `premiers(n)` qui renvoie la liste des nombres premiers inférieurs ou égaux à `n`, en **une seule** compréhension (pas de fonction auxiliaire).

<Indices>
<Indice>

`all(condition for d in …)` vaut `True` si la condition est vraie pour tous les `d`.

</Indice>
<Indice>

`k` est premier si `k >= 2` et si aucun `d` de 2 à la racine de `k` ne le divise : `all(k % d != 0 for d in range(2, int(k ** 0.5) + 1))`.

</Indice>
<Indice>

```text
FONCTION premiers(n)
    RENVOYER [k POUR k DE 2 À n SI aucun d de 2 à racine(k) ne divise k]
```

</Indice>
</Indices>

<Correction>

```python
def premiers(n: int) -> list:
    return [k for k in range(2, n + 1) if all(k % d != 0 for d in range(2, int(k ** 0.5) + 1))]
```

</Correction>
</Enonce>
<Verification>

```python
assert premiers(30) == [2, 3, 5, 7, 11, 13, 17, 19, 23, 29] and premiers(1) == [], "Premiers jusqu'à 30, puis aucun."
assert len(premiers(10000)) == 1229, "1229 premiers jusqu'à 10 000."
assert PROGRAMME.count("def ") == 1, "Une seule fonction."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-5-2" label="5.2 [Expert] - Paires et combinaisons" type="python">
<Enonce>
### Paires et combinaisons

Écrire deux fonctions par compréhension :
- `produit(a, b)` : la liste de tous les couples `(x, y)` avec `x` dans `a` et `y` dans `b` ;
- `paires(liste)` : la liste des couples `(liste[i], liste[j])` avec `i < j`, dans l'ordre des indices.

<Indices>
<Indice>

`produit` : deux `for` successifs.

</Indice>
<Indice>

`paires` : parcourir les indices, avec `j` qui commence à `i + 1`.

</Indice>
<Indice>

```text
FONCTION produit(a, b) : RENVOYER [(x, y) POUR x DANS a POUR y DANS b]
FONCTION paires(liste)
    RENVOYER [(liste[i], liste[j]) POUR i DES indices POUR j DE i + 1 À la fin]
```

</Indice>
</Indices>

<Correction>

```python
def produit(a: list, b: list) -> list:
    return [(x, y) for x in a for y in b]


def paires(liste: list) -> list:
    return [(liste[i], liste[j]) for i in range(len(liste)) for j in range(i + 1, len(liste))]
```

</Correction>
</Enonce>
<Verification>

```python
assert produit([1, 2], ["a", "b"]) == [(1, "a"), (1, "b"), (2, "a"), (2, "b")] and produit([], [1]) == [], "Produit cartésien."
assert paires(["A", "B", "C"]) == [("A", "B"), ("A", "C"), ("B", "C")] and paires([1]) == [], "Paires."
assert len(paires(list(range(10)))) == 45, "10 éléments : 45 paires."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-5-3" label="5.3 [Expert] - Produit de matrices en une ligne" type="python">
<Enonce>
### Produit de matrices en une ligne

Écrire une fonction `produit_matrices(a, b)` qui renvoie le produit des matrices `a` (`n × p`) et `b` (`p × q`), en une seule expression par compréhension.

Rappel : la case `(i, j)` du produit vaut la somme des `a[i][k] × b[k][j]`.

<Indices>
<Indice>

La matrice résultat est une liste de lignes ; chaque case est une `sum(...)` sur `k`.

</Indice>
<Indice>

`[[sum(a[i][k] * b[k][j] for k in range(len(b))) for j in range(len(b[0]))] for i in range(len(a))]`.

</Indice>
<Indice>

```text
FONCTION produit_matrices(a, b)
    RENVOYER [[somme des a[i][k] × b[k][j] POUR k] POUR j DES colonnes de b] POUR i DES lignes de a]
```

</Indice>
</Indices>

<Correction>

```python
def produit_matrices(a: list, b: list) -> list:
    return [[sum(a[i][k] * b[k][j] for k in range(len(b))) for j in range(len(b[0]))] for i in range(len(a))]
```

</Correction>
</Enonce>
<Verification>

```python
assert produit_matrices([[1, 2], [3, 4]], [[5, 6], [7, 8]]) == [[19, 22], [43, 50]], "Produit 2 × 2."
assert produit_matrices([[1, 2, 3]], [[1], [2], [3]]) == [[14]], "Ligne × colonne."

import ast
assert "append" not in PROGRAMME, "Sans append : la liste se construit par compréhension."
assert any(isinstance(n, (ast.ListComp, ast.SetComp, ast.DictComp, ast.GeneratorExp)) for n in ast.walk(ast.parse(PROGRAMME))), "Une compréhension est utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-5-4" label="5.4 [Expert] - Sudoku valide" type="python">
<Enonce>
### Sudoku valide

Une grille de sudoku complète (9 × 9, chiffres de 1 à 9) est valide si chaque ligne, chaque colonne et chacun des 9 carrés 3 × 3 contient les 9 chiffres.

Écrire une fonction `sudoku_valide(g)` en utilisant des compréhensions (sans boucle `for` en dehors des compréhensions).

<Indices>
<Indice>

Un groupe de 9 cases est correct si l'ensemble de ses valeurs vaut `set(range(1, 10))`.

</Indice>
<Indice>

Construire par compréhension la liste des 27 groupes : 9 lignes, 9 colonnes, 9 carrés. Le carré de coin `(3r, 3c)` contient `g[3r + i][3c + j]` pour `i` et `j` de 0 à 2.

</Indice>
<Indice>

`all(...)` vérifie que tous les groupes sont corrects.

</Indice>
<Indice>

```text
FONCTION sudoku_valide(g)
    lignes ← [g[i] POUR i]
    colonnes ← [[g[i][j] POUR i] POUR j]
    carres ← [[g[3r + i][3c + j] POUR i POUR j] POUR r DE 0 À 2 POUR c DE 0 À 2]
    RENVOYER tous les groupes ont pour ensemble {1, …, 9}
```

</Indice>
</Indices>

<Correction>

```python
def sudoku_valide(g: list) -> bool:
    lignes = [g[i] for i in range(9)]
    colonnes = [[g[i][j] for i in range(9)] for j in range(9)]
    carres = [[g[3 * r + i][3 * c + j] for i in range(3) for j in range(3)] for r in range(3) for c in range(3)]
    return all(set(groupe) == set(range(1, 10)) for groupe in lignes + colonnes + carres)
```

</Correction>
</Enonce>
<Verification>

```python
base = [[(3 * (i % 3) + i // 3 + j) % 9 + 1 for j in range(9)] for i in range(9)]
assert sudoku_valide(base) is True, "Une grille valide."
faux = [ligne[:] for ligne in base]
faux[0][0], faux[0][1] = faux[0][1], faux[0][0]
assert sudoku_valide(faux) is False, "Deux cases échangées : colonnes fausses."
decale = [base[(i + 1) % 9] for i in range(9)]
assert sudoku_valide(decale) is False, "Lignes et colonnes justes, carrés faux."
import re
lignes_for = [l for l in PROGRAMME.splitlines() if re.match(r"\s*for\b", l)]
assert lignes_for == [], "Pas de boucle for en dehors des compréhensions."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-6-1" label="6.1 [Mini-projet] - Base de données de films" type="python">
<Enonce>
### Base de données de films

**Contexte.** Le ciné-club prépare sa programmation annuelle et dispose d'une petite base de films. Il veut des statistiques (genres, décennies, réalisateurs les plus présents), repérer les acteurs qui tournent souvent ensemble, et proposer des films « dans le même esprit » qu'un film donné. Le projet écrit ces analyses dans un style compact : **aucune boucle `for` ou `while`**, uniquement des compréhensions (de liste, d'ensemble, de dictionnaire) et des fonctions comme `sum`, `max`, `sorted`, `len`.

**Les données** : le code de départ contient la base, `FILMS`, une liste de dictionnaires. Exemple d'élément :

```
{"titre": "Alien", "annee": 1979, "genres": ["horreur", "sf"],
 "realisateur": "Scott", "note": 8.5, "acteurs": ["Weaver", "Hurt", "Holm"]}
```

**Les fonctions d'analyse**
- `titres_du_genre(films, genre)` : pour composer une soirée à thème. Renvoie la liste triée des titres du genre.
- `par_decennie(films)` : pour équilibrer les époques. Renvoie un dictionnaire décennie → nombre de films, la décennie étant écrite `"1980s"`.
- `prolifique(films)` : pour la rétrospective de l'année. Renvoie le réalisateur qui a le plus de films dans la base (le premier dans l'ordre alphabétique en cas d'égalité).
- `moyenne_par_genre(films)` : pour savoir quels genres plaisent le plus. Renvoie un dictionnaire genre → note moyenne des films du genre, arrondie au dixième.
- `duos(films)` : repère les acteurs qui tournent souvent ensemble. Renvoie un dictionnaire dont les clés sont les couples `(a, b)` avec `a < b` ayant joué ensemble dans **au moins deux** films, et les valeurs le nombre de ces films.
- `similaires(films, titre, n)` : la suggestion « dans le même esprit » du programme papier. Renvoie les titres des `n` autres films qui partagent le plus de genres avec `titre` (puis meilleure note, puis ordre alphabétique) ; les films sans genre commun sont exclus.
- `matrice_genres(films)` : montre quels genres vont souvent ensemble. Renvoie le tuple `(genres, m)` : la liste triée des genres et la matrice carrée `m` où `m[i][j]` compte les films qui ont à la fois le genre `i` et le genre `j` (sur la diagonale : le nombre de films du genre).

<Indices>
<Indice>

Des compréhensions imbriquées remplacent les boucles imbriquées : `{g for f in films for g in f["genres"]}` rassemble tous les genres.

</Indice>
<Indice>

Une valeur intermédiaire calculée par compréhension peut être rangée dans une variable avant le `return` : la contrainte porte sur les boucles, pas sur le nombre de lignes.

</Indice>
<Indice>

Pour les duos, construire d'abord l'ensemble des couples possibles avec deux `for` sur les acteurs d'un même film et la condition `a < b`, puis compter pour chacun le nombre de films où les deux figurent.

</Indice>
<Indice>

```text
(cœur du programme : les duos d'acteurs)
couples ← {(a, b) POUR f DANS films POUR a DANS f["acteurs"] POUR b DANS f["acteurs"] SI a < b}
compte ← {c: nombre de films f tels que c[0] ∈ f["acteurs"] ET c[1] ∈ f["acteurs"] POUR c DANS couples}
RENVOYER {c: n POUR (c, n) DANS compte SI n ≥ 2}
```

</Indice>
</Indices>

<Correction>

```python
FILMS = [
    {"titre": "Alien", "annee": 1979, "genres": ["horreur", "sf"], "realisateur": "Scott", "note": 8.5, "acteurs": ["Weaver", "Hurt", "Holm"]},
    {"titre": "Blade Runner", "annee": 1982, "genres": ["sf", "policier"], "realisateur": "Scott", "note": 8.1, "acteurs": ["Ford", "Hauer", "Young"]},
    {"titre": "Gladiator", "annee": 2000, "genres": ["action", "historique"], "realisateur": "Scott", "note": 8.5, "acteurs": ["Crowe", "Phoenix", "Nielsen"]},
    {"titre": "Aliens", "annee": 1986, "genres": ["action", "horreur", "sf"], "realisateur": "Cameron", "note": 8.4, "acteurs": ["Weaver", "Biehn", "Henriksen"]},
    {"titre": "Terminator", "annee": 1984, "genres": ["action", "sf"], "realisateur": "Cameron", "note": 8.1, "acteurs": ["Schwarzenegger", "Hamilton", "Biehn"]},
    {"titre": "Titanic", "annee": 1997, "genres": ["drame", "romance"], "realisateur": "Cameron", "note": 7.9, "acteurs": ["DiCaprio", "Winslet", "Zane"]},
    {"titre": "Inception", "annee": 2010, "genres": ["action", "sf"], "realisateur": "Nolan", "note": 8.8, "acteurs": ["DiCaprio", "Page", "Hardy"]},
    {"titre": "Dunkerque", "annee": 2017, "genres": ["historique", "guerre"], "realisateur": "Nolan", "note": 7.8, "acteurs": ["Whitehead", "Hardy", "Rylance"]},
    {"titre": "Interstellar", "annee": 2014, "genres": ["drame", "sf"], "realisateur": "Nolan", "note": 8.7, "acteurs": ["McConaughey", "Hathaway", "Chastain"]},
    {"titre": "Avatar", "annee": 2009, "genres": ["action", "sf"], "realisateur": "Cameron", "note": 7.9, "acteurs": ["Worthington", "Saldana", "Weaver"]},
]


def titres_du_genre(films: list, genre: str) -> list:
    return sorted([f["titre"] for f in films if genre in f["genres"]])


def par_decennie(films: list) -> dict:
    decennies = {f"{f['annee'] // 10 * 10}s" for f in films}
    return {d: sum(1 for f in films if f"{f['annee'] // 10 * 10}s" == d) for d in decennies}


def prolifique(films: list) -> str:
    noms = {f["realisateur"] for f in films}
    return sorted(noms, key=lambda r: (-sum(1 for f in films if f["realisateur"] == r), r))[0]


def moyenne_par_genre(films: list) -> dict:
    genres = {g for f in films for g in f["genres"]}
    return {g: round(sum(f["note"] for f in films if g in f["genres"]) / sum(1 for f in films if g in f["genres"]), 1) for g in genres}


def duos(films: list) -> dict:
    couples = {(a, b) for f in films for a in f["acteurs"] for b in f["acteurs"] if a < b}
    compte = {c: sum(1 for f in films if c[0] in f["acteurs"] and c[1] in f["acteurs"]) for c in couples}
    return {c: n for c, n in compte.items() if n >= 2}


def similaires(films: list, titre: str, n: int) -> list:
    ref = [f for f in films if f["titre"] == titre][0]
    autres = [(len(set(f["genres"]) & set(ref["genres"])), f) for f in films if f["titre"] != titre]
    return [f["titre"] for k, f in sorted([a for a in autres if a[0] > 0], key=lambda a: (-a[0], -a[1]["note"], a[1]["titre"]))[:n]]


def matrice_genres(films: list) -> tuple:
    genres = sorted({g for f in films for g in f["genres"]})
    m = [[sum(1 for f in films if a in f["genres"] and b in f["genres"]) for b in genres] for a in genres]
    return (genres, m)
```

</Correction>
</Enonce>
<CodeDepart>

```python
FILMS = [
    {"titre": "Alien", "annee": 1979, "genres": ["horreur", "sf"], "realisateur": "Scott", "note": 8.5, "acteurs": ["Weaver", "Hurt", "Holm"]},
    {"titre": "Blade Runner", "annee": 1982, "genres": ["sf", "policier"], "realisateur": "Scott", "note": 8.1, "acteurs": ["Ford", "Hauer", "Young"]},
    {"titre": "Gladiator", "annee": 2000, "genres": ["action", "historique"], "realisateur": "Scott", "note": 8.5, "acteurs": ["Crowe", "Phoenix", "Nielsen"]},
    {"titre": "Aliens", "annee": 1986, "genres": ["action", "horreur", "sf"], "realisateur": "Cameron", "note": 8.4, "acteurs": ["Weaver", "Biehn", "Henriksen"]},
    {"titre": "Terminator", "annee": 1984, "genres": ["action", "sf"], "realisateur": "Cameron", "note": 8.1, "acteurs": ["Schwarzenegger", "Hamilton", "Biehn"]},
    {"titre": "Titanic", "annee": 1997, "genres": ["drame", "romance"], "realisateur": "Cameron", "note": 7.9, "acteurs": ["DiCaprio", "Winslet", "Zane"]},
    {"titre": "Inception", "annee": 2010, "genres": ["action", "sf"], "realisateur": "Nolan", "note": 8.8, "acteurs": ["DiCaprio", "Page", "Hardy"]},
    {"titre": "Dunkerque", "annee": 2017, "genres": ["historique", "guerre"], "realisateur": "Nolan", "note": 7.8, "acteurs": ["Whitehead", "Hardy", "Rylance"]},
    {"titre": "Interstellar", "annee": 2014, "genres": ["drame", "sf"], "realisateur": "Nolan", "note": 8.7, "acteurs": ["McConaughey", "Hathaway", "Chastain"]},
    {"titre": "Avatar", "annee": 2009, "genres": ["action", "sf"], "realisateur": "Cameron", "note": 7.9, "acteurs": ["Worthington", "Saldana", "Weaver"]},
]
```

</CodeDepart>
<Verification>

```python
assert titres_du_genre(FILMS, "historique") == ["Dunkerque", "Gladiator"] and titres_du_genre(FILMS, "western") == [], "Titres par genre."
assert par_decennie(FILMS) == {"1970s": 1, "1980s": 3, "1990s": 1, "2000s": 2, "2010s": 3}, "Films par décennie."
assert prolifique(FILMS) == "Cameron", "Cameron a réalisé 4 films de la base."
m = moyenne_par_genre(FILMS)
assert m["sf"] == 8.4 and m["historique"] == 8.2 and m["romance"] == 7.9 and len(m) == 8, "Moyennes par genre."
assert duos(FILMS) == {} and duos(FILMS + [{"titre": "X", "annee": 2020, "genres": [], "realisateur": "Y", "note": 5, "acteurs": ["Weaver", "Biehn"]}]) == {("Biehn", "Weaver"): 2}, "Duos d'acteurs."
assert similaires(FILMS, "Aliens", 3) == ["Inception", "Alien", "Terminator"], "Films similaires à Aliens."
assert similaires(FILMS, "Titanic", 5) == ["Interstellar"], "Seuls les films avec un genre commun."
genres, mat = matrice_genres(FILMS)
i, j = genres.index("action"), genres.index("sf")
assert genres[0] == "action" and mat[i][j] == 4 and mat[j][i] == 4 and mat[j][j] == 7, "Matrice de co-occurrence."

import ast
noeuds = list(ast.walk(ast.parse(PROGRAMME)))
assert not any(isinstance(n, (ast.For, ast.While)) for n in noeuds), "Pas de boucle for ou while : uniquement des compréhensions."
assert "append" not in PROGRAMME, "Sans append."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-comp-6-2" label="6.2 [Mini-projet] - Casser le chiffre de Vigenère" type="python">
<Enonce>
### Casser le chiffre de Vigenère

**Contexte.** Le club de cryptographie a intercepté des messages chiffrés avec le chiffre de Vigenère, mais sans la clé. Pendant trois siècles, ce chiffre a été jugé incassable ; il cède pourtant à une analyse statistique. Le projet construit l'outil qui retrouve la longueur de la clé, puis la clé elle-même, puis le texte en clair. **Chaque fonction n'utilise que des compréhensions** (aucune boucle `for` ou `while` hors compréhension).

**Le chiffre** : chaque lettre (`a` à `z`) est décalée d'un rang donné par la lettre correspondante d'une clé répétée (`a` décale de 0, `b` de 1…) ; les autres caractères ne bougent pas et ne consomment pas de lettre de clé. Exemple : `chiffrer("attaque au renard", "nsi")` donne `"nlbnicr sc ewvnjl"`.

**L'idée de l'attaque** : l'**indice de coïncidence** d'un texte est la probabilité que deux lettres tirées au hasard dans ce texte soient identiques. Il vaut environ 0,08 pour un texte français sans accents et 0,038 pour des lettres au hasard. Si l'on découpe un message chiffré en colonnes (une lettre sur `L`) avec la bonne longueur de clé `L`, chaque colonne n'a subi qu'un seul décalage et retrouve l'indice du français.

**Les fonctions de l'outil**
- `chiffrer(texte, cle)` et `dechiffrer(texte, cle)` : pour fabriquer des messages de test et pour lire le message une fois la clé trouvée.
- `lettres(texte)` : renvoie le texte réduit à ses lettres de `a` à `z`, la matière première de l'analyse.
- `indice_coincidence(t)` : renvoie l'indice de coïncidence des lettres de `t` : `somme des n × (n - 1) / (N × (N - 1))`, où `n` parcourt les nombres d'apparitions de chaque lettre et `N` le nombre total de lettres, arrondi au millième.
- `colonnes(texte, longueur)` : découpe le message pour l'analyse. Renvoie la liste des `longueur` textes formés en prenant une lettre sur `longueur` dans `lettres(texte)`, en partant de la position 0, 1, 2…
- `longueur_cle(texte, maxi)` : première étape de l'attaque. Renvoie la plus petite longueur de 1 à `maxi` dont l'indice de coïncidence **moyen** des colonnes atteint 0,075.
- `decalage(colonne)` : deuxième étape. Renvoie le décalage le plus probable d'une colonne, en supposant que sa lettre la plus fréquente est un `e`.
- `casser(texte, maxi)` : l'attaque complète. Renvoie le tuple `(cle, texte_dechiffre)`.

<Indices>
<Indice>

Chaque colonne d'un texte chiffré avec la bonne longueur de clé a été décalée d'un seul rang : c'est un simple code de César, et sa lettre la plus fréquente correspond au `e`.

</Indice>
<Indice>

Avec une mauvaise longueur, les colonnes mélangent plusieurs décalages et leur indice de coïncidence tombe vers 0,04 : c'est ce qui permet de trouver la longueur.

</Indice>
<Indice>

La position de chaque lettre parmi les lettres s'obtient sans boucle : `[i for i, c in enumerate(texte) if "a" <= c <= "z"]` donne leurs indices dans le texte.

</Indice>
<Indice>

```text
(cœur du programme : casser)
FONCTION casser(texte, maxi)
    L ← longueur_cle(texte, maxi)
    cle ← lettres chr(ord("a") + decalage(col)) POUR col DANS colonnes(texte, L), mises bout à bout
    RENVOYER (cle, dechiffrer(texte, cle))
FONCTION decalage(colonne)
    f ← la lettre la plus fréquente de colonne
    RENVOYER (ord(f) - ord("e")) mod 26
```

</Indice>
</Indices>

<Correction>

```python
ALPHA = "abcdefghijklmnopqrstuvwxyz"


def lettres(texte: str) -> str:
    return "".join([c for c in texte if "a" <= c <= "z"])


def transformer(texte: str, cle: str, signe: int) -> str:
    rang = {i: r for r, i in enumerate([i for i, c in enumerate(texte) if "a" <= c <= "z"])}
    return "".join([
        chr((ord(c) - 97 + signe * (ord(cle[rang[i] % len(cle)]) - 97)) % 26 + 97) if i in rang else c
        for i, c in enumerate(texte)
    ])


def chiffrer(texte: str, cle: str) -> str:
    return transformer(texte, cle, 1)


def dechiffrer(texte: str, cle: str) -> str:
    return transformer(texte, cle, -1)


def indice_coincidence(t: str) -> float:
    t = lettres(t)
    return round(sum([t.count(c) * (t.count(c) - 1) for c in ALPHA]) / (len(t) * (len(t) - 1)), 3)


def colonnes(texte: str, longueur: int) -> list:
    return [lettres(texte)[i::longueur] for i in range(longueur)]


def longueur_cle(texte: str, maxi: int) -> int:
    bonnes = [L for L in range(1, maxi + 1) if sum([indice_coincidence(c) for c in colonnes(texte, L)]) / L >= 0.075]
    return bonnes[0] if bonnes else 1


def decalage(colonne: str) -> int:
    f = max(ALPHA, key=lambda c: colonne.count(c))
    return (ord(f) - ord("e")) % 26


def casser(texte: str, maxi: int) -> tuple:
    cle = "".join([chr(97 + decalage(c)) for c in colonnes(texte, longueur_cle(texte, maxi))])
    return (cle, dechiffrer(texte, cle))
```

</Correction>
</Enonce>
<Verification>

```python
TEXTE = "le renard de la foret avait decide de quitter son terrier avant le lever du soleil car il voulait observer les oiseaux qui se reveillent dans les branches des grands chenes et des hetres il marchait doucement entre les fougeres humides en prenant garde de ne pas faire craquer les feuilles mortes quelques lapins le regardaient passer sans bouger tandis que le vent apportait des odeurs de terre et de champignons arrive au bord de la riviere il se coucha dans les herbes hautes et attendit que la lumiere change de couleur les premiers chants commencerent bientot et le renard ferma les yeux pour mieux les entendre il pensait a ses petits restes au chaud et se promettait de leur raconter cette matinee en rentrant le soir venu quand la lune se leverait au dessus des collines et que la foret retrouverait son silence habituel il savait que ces moments de calme etaient rares et precieux"
assert chiffrer("attaque au renard", "nsi") == "nlbnicr sc ewvnjl" and dechiffrer("nlbnicr sc ewvnjl", "nsi") == "attaque au renard", "Chiffrement et déchiffrement."
assert dechiffrer(chiffrer("le renard, 2026 !", "cle"), "cle") == "le renard, 2026 !", "Aller-retour."
assert lettres("le renard, 2026 !") == "lerenard" and colonnes("abcdefg", 3) == ["adg", "be", "cf"], "Lettres et colonnes."
assert 0.075 <= indice_coincidence(TEXTE) <= 0.095 and indice_coincidence("abcdefghijklmnopqrstuvwxyz" * 3) < 0.03, "Indices de coïncidence."
for cle in ["nsi", "code", "renard"]:
    c = chiffrer(TEXTE, cle)
    assert longueur_cle(c, 8) == len(cle), f"Longueur de la clé {cle} retrouvée."
    assert casser(c, 8) == (cle, TEXTE), f"Clé {cle} retrouvée et texte déchiffré."
assert decalage("hhhxa") == 3 and decalage("eee") == 0, "Décalage d'une colonne."

import ast
noeuds = list(ast.walk(ast.parse(PROGRAMME)))
assert not any(isinstance(n, (ast.For, ast.While)) for n in noeuds), "Pas de boucle for ou while : uniquement des compréhensions."
assert "append" not in PROGRAMME, "Sans append."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
