---
title: "Exercices fondamentaux - Terminale NSI"
description: "Série d'exercices guidés sur les notions clés du programme"
level: TNSI
order: 230
chapter: Entrainement
icon: "flask-conical"
badgeId: terminale_exercices_fondamentaux
prerequisites:
  - prog_recursivite
  - structures_graphes
  - sql-bases-donnees
audience: public
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

Dans cette fiche, un arbre binaire est représenté par `None` (arbre vide) ou par un tuple `(valeur, gauche, droit)`, et un graphe par un dictionnaire qui associe à chaque sommet la liste de ses voisins.

<ExerciseTabs courseId="terminale_exercices_fondamentaux" courseTitle="Exercices fondamentaux">

<ExerciseSection id="tnsi-fond-1-1" label="1.1 [Introduction] - Somme récursive" type="python">
<Enonce>
### Somme récursive

Écrire une fonction **récursive** `somme(n)` qui renvoie `1 + 2 + … + n` (0 pour `n = 0`), sans boucle.

<Indices>
<Indice>

Une fonction récursive a un **cas de base**, qui s'arrête sans s'appeler, et un **cas récursif**, qui s'appelle sur un problème plus petit.

</Indice>
<Indice>

`somme(n)` vaut `n + somme(n - 1)`, et `somme(0)` vaut 0.

</Indice>
<Indice>

```text
FONCTION somme(n)
    SI n = 0 ALORS RENVOYER 0
    RENVOYER n + somme(n - 1)
```

</Indice>
</Indices>

<Correction>

```python
def somme(n: int) -> int:
    if n == 0:
        return 0
    return n + somme(n - 1)
```

</Correction>
</Enonce>
<Verification>

```python
assert somme(0) == 0 and somme(4) == 10 and somme(100) == 5050, "Sommes."
import re
assert not re.search(r"\b(for|while)\b", PROGRAMME), "Sans boucle."

import ast
def _recursive(nom):
    for n in ast.walk(ast.parse(PROGRAMME)):
        if isinstance(n, ast.FunctionDef) and n.name == nom:
            return any(isinstance(c, ast.Call) and getattr(c.func, "id", None) == nom for c in ast.walk(n))
    return False
assert _recursive("somme"), "somme est récursive : elle s'appelle elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-1-2" label="1.2 [Introduction] - Puissance récursive" type="python">
<Enonce>
### Puissance récursive

Écrire une fonction récursive `puissance(x, n)` qui renvoie `x` à la puissance `n` (`n` entier positif ou nul), sans `**` ni boucle.

<Indices>
<Indice>

Cas de base : `x⁰` vaut 1.

</Indice>
<Indice>

Cas récursif : `xⁿ = x × xⁿ⁻¹`.

</Indice>
<Indice>

```text
FONCTION puissance(x, n)
    SI n = 0 ALORS RENVOYER 1
    RENVOYER x × puissance(x, n - 1)
```

</Indice>
</Indices>

<Correction>

```python
def puissance(x: float, n: int) -> float:
    if n == 0:
        return 1
    return x * puissance(x, n - 1)
```

</Correction>
</Enonce>
<Verification>

```python
assert puissance(2, 10) == 1024 and puissance(5, 0) == 1 and puissance(-3, 3) == -27, "Puissances."
assert "**" not in PROGRAMME, "Sans **."

import ast
def _recursive(nom):
    for n in ast.walk(ast.parse(PROGRAMME)):
        if isinstance(n, ast.FunctionDef) and n.name == nom:
            return any(isinstance(c, ast.Call) and getattr(c.func, "id", None) == nom for c in ast.walk(n))
    return False
assert _recursive("puissance"), "puissance est récursive : elle s'appelle elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-1-3" label="1.3 [Introduction] - Longueur sans len" type="python">
<Enonce>
### Longueur sans len

Écrire une fonction récursive `longueur(texte)` qui renvoie le nombre de caractères de `texte`, sans `len` ni boucle.

<Indices>
<Indice>

Un texte vide a une longueur 0.

</Indice>
<Indice>

Sinon, sa longueur vaut 1 plus la longueur du texte privé de son premier caractère : `texte[1:]`.

</Indice>
<Indice>

```text
FONCTION longueur(texte)
    SI texte = "" ALORS RENVOYER 0
    RENVOYER 1 + longueur(texte[1:])
```

</Indice>
</Indices>

<Correction>

```python
def longueur(texte: str) -> int:
    if texte == "":
        return 0
    return 1 + longueur(texte[1:])
```

</Correction>
</Enonce>
<Verification>

```python
assert longueur("") == 0 and longueur("renard") == 6 and longueur("a b") == 3, "Longueurs."
import re
assert not re.search(r"\blen\s*\(", PROGRAMME), "Sans len."

import ast
def _recursive(nom):
    for n in ast.walk(ast.parse(PROGRAMME)):
        if isinstance(n, ast.FunctionDef) and n.name == nom:
            return any(isinstance(c, ast.Call) and getattr(c.func, "id", None) == nom for c in ast.walk(n))
    return False
assert _recursive("longueur"), "longueur est récursive : elle s'appelle elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-1-4" label="1.4 [Introduction] - Compte à rebours en liste" type="python">
<Enonce>
### Compte à rebours en liste

Écrire une fonction récursive `rebours(n)` qui renvoie la liste `[n, n - 1, …, 1, 0]`, sans boucle.

<Indices>
<Indice>

Cas de base : `rebours(0)` vaut `[0]`.

</Indice>
<Indice>

Cas récursif : la liste commence par `n`, suivie de `rebours(n - 1)`. Deux listes se collent avec `+`.

</Indice>
<Indice>

```text
FONCTION rebours(n)
    SI n = 0 ALORS RENVOYER [0]
    RENVOYER [n] + rebours(n - 1)
```

</Indice>
</Indices>

<Correction>

```python
def rebours(n: int) -> list:
    if n == 0:
        return [0]
    return [n] + rebours(n - 1)
```

</Correction>
</Enonce>
<Verification>

```python
assert rebours(0) == [0] and rebours(3) == [3, 2, 1, 0], "Comptes à rebours."

import ast
def _recursive(nom):
    for n in ast.walk(ast.parse(PROGRAMME)):
        if isinstance(n, ast.FunctionDef) and n.name == nom:
            return any(isinstance(c, ast.Call) and getattr(c.func, "id", None) == nom for c in ast.walk(n))
    return False
assert _recursive("rebours"), "rebours est récursive : elle s'appelle elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-2-1" label="2.1 [Facile] - Palindrome récursif" type="python">
<Enonce>
### Palindrome récursif

Écrire une fonction récursive `palindrome(mot)` qui renvoie `True` si `mot` se lit de la même façon dans les deux sens.

<Indices>
<Indice>

Un mot de 0 ou 1 lettre est un palindrome : c'est le cas de base.

</Indice>
<Indice>

Sinon, le mot est un palindrome si sa première et sa dernière lettre sont égales **et** si le mot sans ses extrémités (`mot[1:-1]`) en est un.

</Indice>
<Indice>

```text
FONCTION palindrome(mot)
    SI longueur(mot) ≤ 1 ALORS RENVOYER VRAI
    RENVOYER mot[0] = mot[-1] ET palindrome(mot[1:-1])
```

</Indice>
</Indices>

<Correction>

```python
def palindrome(mot: str) -> bool:
    if len(mot) <= 1:
        return True
    return mot[0] == mot[-1] and palindrome(mot[1:-1])
```

</Correction>
</Enonce>
<Verification>

```python
for m in ["", "a", "kayak", "abba", "ressasser"]:
    assert palindrome(m) is True, f"« {m} » est un palindrome."
for m in ["ab", "renard", "abca"]:
    assert palindrome(m) is False, f"« {m} » n'en est pas un."

import ast
def _recursive(nom):
    for n in ast.walk(ast.parse(PROGRAMME)):
        if isinstance(n, ast.FunctionDef) and n.name == nom:
            return any(isinstance(c, ast.Call) and getattr(c.func, "id", None) == nom for c in ast.walk(n))
    return False
assert _recursive("palindrome"), "palindrome est récursive : elle s'appelle elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-2-2" label="2.2 [Facile] - Recherche dichotomique" type="python">
<Enonce>
### Recherche dichotomique

Écrire une fonction `dichotomie(t, x)` qui renvoie un indice de `x` dans la liste **triée** `t`, ou `-1` s'il est absent, en divisant à chaque étape l'intervalle de recherche par deux.

La liste peut contenir un million d'éléments : un parcours de toute la liste est trop lent pour les tests.

<Indices>
<Indice>

Deux bornes `g` et `d` délimitent la zone où `x` peut encore se trouver. Le milieu est `(g + d) // 2`.

</Indice>
<Indice>

Si `t[m] < x`, la recherche continue à droite du milieu : `g = m + 1`. Sinon, à gauche. La boucle s'arrête quand `g > d`.

</Indice>
<Indice>

```text
FONCTION dichotomie(t, x)
    g ← 0 ; d ← longueur(t) - 1
    TANT QUE g ≤ d
        m ← (g + d) // 2
        SI t[m] = x ALORS RENVOYER m
        SI t[m] < x ALORS g ← m + 1 SINON d ← m - 1
    RENVOYER -1
```

</Indice>
</Indices>

<Correction>

```python
def dichotomie(t: list, x) -> int:
    g = 0
    d = len(t) - 1
    while g <= d:
        m = (g + d) // 2
        if t[m] == x:
            return m
        if t[m] < x:
            g = m + 1
        else:
            d = m - 1
    return -1
```

</Correction>
</Enonce>
<Verification>

```python
t = [1, 3, 5, 7, 9, 11]
assert all(dichotomie(t, v) == i for i, v in enumerate(t)), "Chaque valeur est trouvée à son indice."
assert dichotomie(t, 4) == -1 and dichotomie([], 1) == -1 and dichotomie(t, 12) == -1, "Valeurs absentes."
grand = list(range(0, 2000000, 2))
assert all(dichotomie(grand, v) == v // 2 for v in range(0, 2000000, 1999)[::2]) and dichotomie(grand, 7) == -1, "Un million d'éléments."
assert ".index" not in PROGRAMME and " in t" not in PROGRAMME, "Sans index ni in."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-2-3" label="2.3 [Facile] - Taille d'un arbre" type="python">
<Enonce>
### Taille d'un arbre

Écrire une fonction récursive `taille(arbre)` qui renvoie le nombre de nœuds d'un arbre binaire (0 pour l'arbre vide `None`).

<Indices>
<Indice>

Cas de base : l'arbre vide a 0 nœud.

</Indice>
<Indice>

Sinon, déballer `valeur, gauche, droit = arbre` : la taille vaut 1 plus les tailles des deux sous-arbres.

</Indice>
<Indice>

```text
FONCTION taille(arbre)
    SI arbre = None ALORS RENVOYER 0
    (valeur, gauche, droit) ← arbre
    RENVOYER 1 + taille(gauche) + taille(droit)
```

</Indice>
</Indices>

<Correction>

```python
def taille(arbre) -> int:
    if arbre is None:
        return 0
    valeur, gauche, droit = arbre
    return 1 + taille(gauche) + taille(droit)
```

</Correction>
</Enonce>
<Verification>

```python
#        5
#      /   \\
#     3     8
#    / \\     \\
#   1   4     9
arbre = (5, (3, (1, None, None), (4, None, None)), (8, None, (9, None, None)))

assert taille(arbre) == 6 and taille(None) == 0 and taille((1, None, None)) == 1, "Tailles."

import ast
def _recursive(nom):
    for n in ast.walk(ast.parse(PROGRAMME)):
        if isinstance(n, ast.FunctionDef) and n.name == nom:
            return any(isinstance(c, ast.Call) and getattr(c.func, "id", None) == nom for c in ast.walk(n))
    return False
assert _recursive("taille"), "taille est récursive : elle s'appelle elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-2-4" label="2.4 [Facile] - Maximum par dichotomie" type="python">
<Enonce>
### Maximum par dichotomie

Écrire une fonction récursive `maximum(t, g, d)` qui renvoie le plus grand élément de `t[g:d + 1]` (au moins un élément) en appliquant **diviser pour régner** : couper la zone en deux moitiés, calculer le maximum de chaque moitié, garder le plus grand.

Exemple : `maximum(t, 0, len(t) - 1)` donne le maximum de toute la liste.

Contrainte : sans `max` ni boucle.

<Indices>
<Indice>

Cas de base : une zone d'un seul élément (`g == d`).

</Indice>
<Indice>

Sinon, avec `m = (g + d) // 2`, les deux moitiés sont `g..m` et `m + 1..d`.

</Indice>
<Indice>

```text
FONCTION maximum(t, g, d)
    SI g = d ALORS RENVOYER t[g]
    m ← (g + d) // 2
    a ← maximum(t, g, m) ; b ← maximum(t, m + 1, d)
    RENVOYER a si a > b sinon b
```

</Indice>
</Indices>

<Correction>

```python
def maximum(t: list, g: int, d: int):
    if g == d:
        return t[g]
    m = (g + d) // 2
    a = maximum(t, g, m)
    b = maximum(t, m + 1, d)
    return a if a > b else b
```

</Correction>
</Enonce>
<Verification>

```python
t = [3, 9, 2, 7, 9, 1]
assert maximum(t, 0, 5) == 9 and maximum(t, 2, 3) == 7 and maximum(t, 5, 5) == 1, "Maximums de zones."
assert maximum([-5, -2, -9], 0, 2) == -2, "Négatifs."
import random
grand = [random.randint(0, 10 ** 6) for _ in range(5000)]
assert maximum(grand, 0, 4999) == max(grand), "5000 éléments."
import re
assert not re.search(r"\bmax\s*\(|\b(for|while)\b", PROGRAMME), "Sans max ni boucle."

import ast
def _recursive(nom):
    for n in ast.walk(ast.parse(PROGRAMME)):
        if isinstance(n, ast.FunctionDef) and n.name == nom:
            return any(isinstance(c, ast.Call) and getattr(c.func, "id", None) == nom for c in ast.walk(n))
    return False
assert _recursive("maximum"), "maximum est récursive : elle s'appelle elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-3-1" label="3.1 [Moyen] - Fibonacci mémoïsé" type="python">
<Enonce>
### Fibonacci mémoïsé

La suite de Fibonacci vaut `F(0) = 0`, `F(1) = 1` et `F(n) = F(n - 1) + F(n - 2)`. Écrite naïvement en récursif, elle recalcule sans cesse les mêmes valeurs et devient très lente.

Écrire une fonction récursive `fib(n, memo)` qui garde dans le dictionnaire `memo` les valeurs déjà calculées. Elle s'appelle `fib(n, {})` et doit calculer `fib(300, {})` instantanément.

<Indices>
<Indice>

Avant de calculer, regarder si `n` est déjà dans `memo` : si oui, renvoyer la valeur rangée.

</Indice>
<Indice>

Après le calcul récursif, ranger le résultat dans `memo[n]` avant de le renvoyer. Le même dictionnaire est transmis aux appels récursifs.

</Indice>
<Indice>

```text
FONCTION fib(n, memo)
    SI n ≤ 1 ALORS RENVOYER n
    SI n ∈ memo ALORS RENVOYER memo[n]
    memo[n] ← fib(n - 1, memo) + fib(n - 2, memo)
    RENVOYER memo[n]
```

</Indice>
</Indices>

<Correction>

```python
def fib(n: int, memo: dict) -> int:
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib(n - 1, memo) + fib(n - 2, memo)
    return memo[n]
```

</Correction>
</Enonce>
<Verification>

```python
assert [fib(n, {}) for n in range(10)] == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34], "Les dix premiers termes."
assert fib(300, {}) == 222232244629420445529739893461909967206666939096499764990979600, "F(300), instantanément."
m = {}
fib(20, m)
assert m.get(20) == 6765 and len(m) >= 10, "Les valeurs calculées sont gardées dans memo."

import ast
def _recursive(nom):
    for n in ast.walk(ast.parse(PROGRAMME)):
        if isinstance(n, ast.FunctionDef) and n.name == nom:
            return any(isinstance(c, ast.Call) and getattr(c.func, "id", None) == nom for c in ast.walk(n))
    return False
assert _recursive("fib"), "fib est récursive : elle s'appelle elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-3-2" label="3.2 [Moyen] - Exponentiation rapide" type="python">
<Enonce>
### Exponentiation rapide

Pour calculer `xⁿ` avec peu de multiplications, on utilise : `xⁿ = (x^(n/2))²` si `n` est pair, et `xⁿ = x × (x^((n-1)/2))²` si `n` est impair.

Écrire une fonction récursive `puissance_rapide(x, n)` qui applique cette idée. Elle doit calculer `3^100000` en un instant.

<Indices>
<Indice>

Calculer **une seule fois** `y = puissance_rapide(x, n // 2)`, puis l'utiliser : appeler deux fois la fonction ferait perdre tout l'intérêt.

</Indice>
<Indice>

`n // 2` convient pour les deux cas : pour `n` impair, `(n - 1) / 2` vaut `n // 2`.

</Indice>
<Indice>

```text
FONCTION puissance_rapide(x, n)
    SI n = 0 ALORS RENVOYER 1
    y ← puissance_rapide(x, n // 2)
    SI n pair ALORS RENVOYER y × y
    RENVOYER x × y × y
```

</Indice>
</Indices>

<Correction>

```python
def puissance_rapide(x, n: int):
    if n == 0:
        return 1
    y = puissance_rapide(x, n // 2)
    if n % 2 == 0:
        return y * y
    return x * y * y
```

</Correction>
</Enonce>
<Verification>

```python
assert puissance_rapide(2, 10) == 1024 and puissance_rapide(7, 0) == 1 and puissance_rapide(3, 5) == 243, "Petites puissances."
assert puissance_rapide(3, 100000) == pow(3, 100000), "3 puissance 100 000."
assert "**" not in PROGRAMME and "pow" not in PROGRAMME, "Sans ** ni pow."

import ast
def _recursive(nom):
    for n in ast.walk(ast.parse(PROGRAMME)):
        if isinstance(n, ast.FunctionDef) and n.name == nom:
            return any(isinstance(c, ast.Call) and getattr(c.func, "id", None) == nom for c in ast.walk(n))
    return False
assert _recursive("puissance_rapide"), "puissance_rapide est récursive : elle s'appelle elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-3-3" label="3.3 [Moyen] - Hauteur et parcours" type="python">
<Enonce>
### Hauteur et parcours

Écrire deux fonctions récursives sur les arbres binaires :
- `hauteur(arbre)` : 0 pour l'arbre vide, 1 pour une feuille, et en général 1 plus la plus grande hauteur des sous-arbres ;
- `prefixe(arbre)` : la liste des valeurs en parcours **préfixe** (le nœud, puis le sous-arbre gauche, puis le droit).

<Indices>
<Indice>

Même schéma que pour la taille : cas de base `None`, puis déballage du tuple.

</Indice>
<Indice>

Le parcours préfixe s'écrit `[valeur] + prefixe(gauche) + prefixe(droit)`.

</Indice>
<Indice>

```text
FONCTION hauteur(arbre)
    SI arbre = None ALORS RENVOYER 0
    RENVOYER 1 + max(hauteur(gauche), hauteur(droit))
FONCTION prefixe(arbre)
    SI arbre = None ALORS RENVOYER []
    RENVOYER [valeur] + prefixe(gauche) + prefixe(droit)
```

</Indice>
</Indices>

<Correction>

```python
def hauteur(arbre) -> int:
    if arbre is None:
        return 0
    valeur, gauche, droit = arbre
    return 1 + max(hauteur(gauche), hauteur(droit))


def prefixe(arbre) -> list:
    if arbre is None:
        return []
    valeur, gauche, droit = arbre
    return [valeur] + prefixe(gauche) + prefixe(droit)
```

</Correction>
</Enonce>
<Verification>

```python
#        5
#      /   \\
#     3     8
#    / \\     \\
#   1   4     9
arbre = (5, (3, (1, None, None), (4, None, None)), (8, None, (9, None, None)))

assert hauteur(arbre) == 3 and hauteur(None) == 0 and hauteur((1, None, None)) == 1, "Hauteurs."
assert prefixe(arbre) == [5, 3, 1, 4, 8, 9] and prefixe(None) == [], "Parcours préfixe."

import ast
def _recursive(nom):
    for n in ast.walk(ast.parse(PROGRAMME)):
        if isinstance(n, ast.FunctionDef) and n.name == nom:
            return any(isinstance(c, ast.Call) and getattr(c.func, "id", None) == nom for c in ast.walk(n))
    return False
assert _recursive("hauteur"), "hauteur est récursive : elle s'appelle elle-même."
assert _recursive("prefixe"), "prefixe est récursive : elle s'appelle elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-3-4" label="3.4 [Moyen] - Parcours en profondeur" type="python">
<Enonce>
### Parcours en profondeur

Écrire une fonction `profondeur(graphe, depart)` qui renvoie la liste des sommets atteignables depuis `depart`, dans l'ordre d'un **parcours en profondeur** récursif : visiter un sommet, puis visiter récursivement chacun de ses voisins non encore visités, dans l'ordre de la liste des voisins.

<Indices>
<Indice>

Une fonction auxiliaire récursive `visiter(s)` ajoute `s` à la liste des visités, puis s'appelle sur chaque voisin pas encore visité.

</Indice>
<Indice>

La liste des visités, partagée par tous les appels, sert à la fois de résultat et de mémoire des sommets déjà vus.

</Indice>
<Indice>

```text
FONCTION profondeur(graphe, depart)
    vus ← liste vide
    FONCTION visiter(s)
        ajouter s à vus
        POUR CHAQUE v DE graphe[s] : SI v ∉ vus ALORS visiter(v)
    visiter(depart)
    RENVOYER vus
```

</Indice>
</Indices>

<Correction>

```python
def profondeur(graphe: dict, depart) -> list:
    vus = []

    def visiter(s):
        vus.append(s)
        for v in graphe[s]:
            if v not in vus:
                visiter(v)

    visiter(depart)
    return vus
```

</Correction>
</Enonce>
<Verification>

```python
g = {"A": ["B", "C"], "B": ["A", "D", "E"], "C": ["A", "F"], "D": ["B"], "E": ["B", "F"], "F": ["C", "E"], "G": []}
assert profondeur(g, "A") == ["A", "B", "D", "E", "F", "C"], "Depuis A : on va au bout de chaque branche avant de revenir."
assert profondeur(g, "C") == ["C", "A", "B", "D", "E", "F"] and profondeur(g, "G") == ["G"], "Depuis C, puis un sommet isolé."

import ast
def _recursive(nom):
    for n in ast.walk(ast.parse(PROGRAMME)):
        if isinstance(n, ast.FunctionDef) and n.name == nom:
            return any(isinstance(c, ast.Call) and getattr(c.func, "id", None) == nom for c in ast.walk(n))
    return False
assert _recursive("visiter"), "visiter est récursive : elle s'appelle elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-4-1" label="4.1 [Difficile] - Tri fusion récursif" type="python">
<Enonce>
### Tri fusion récursif

Le **tri fusion** applique « diviser pour régner » : couper la liste en deux moitiés, trier chaque moitié **récursivement**, puis fusionner les deux moitiés triées.

Écrire une fonction `fusion(a, b)` (fusion de deux listes triées) et une fonction récursive `tri_fusion(t)` qui renvoie une nouvelle liste triée.

Contrainte : sans `sort` ni `sorted`.

<Indices>
<Indice>

Cas de base : une liste de 0 ou 1 élément est déjà triée.

</Indice>
<Indice>

Cas récursif : `m = len(t) // 2`, trier `t[:m]` et `t[m:]`, puis les fusionner.

</Indice>
<Indice>

```text
FONCTION fusion(a, b) : deux indices, le plus petit élément part dans le résultat, puis les restes
FONCTION tri_fusion(t)
    SI longueur(t) ≤ 1 ALORS RENVOYER copie de t
    m ← longueur(t) // 2
    RENVOYER fusion(tri_fusion(t[:m]), tri_fusion(t[m:]))
```

</Indice>
</Indices>

<Correction>

```python
def fusion(a: list, b: list) -> list:
    resultat = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultat.append(a[i])
            i = i + 1
        else:
            resultat.append(b[j])
            j = j + 1
    return resultat + a[i:] + b[j:]


def tri_fusion(t: list) -> list:
    if len(t) <= 1:
        return list(t)
    m = len(t) // 2
    return fusion(tri_fusion(t[:m]), tri_fusion(t[m:]))
```

</Correction>
</Enonce>
<Verification>

```python
import random
assert tri_fusion([5, 2, 9, 1, 5, 6]) == [1, 2, 5, 5, 6, 9] and tri_fusion([]) == [] and tri_fusion([4]) == [4], "Petites listes."
grand = [random.randint(0, 10 ** 6) for _ in range(50000)]
assert tri_fusion(grand) == sorted(grand), "50 000 éléments, rapidement."
import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted."

import ast
def _recursive(nom):
    for n in ast.walk(ast.parse(PROGRAMME)):
        if isinstance(n, ast.FunctionDef) and n.name == nom:
            return any(isinstance(c, ast.Call) and getattr(c.func, "id", None) == nom for c in ast.walk(n))
    return False
assert _recursive("tri_fusion"), "tri_fusion est récursive : elle s'appelle elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-4-2" label="4.2 [Difficile] - Rendu de monnaie optimal" type="python">
<Enonce>
### Rendu de monnaie optimal

L'algorithme glouton (prendre toujours la plus grosse pièce) ne donne pas toujours le moins de pièces : avec des pièces de 1, 3 et 4, il rend 6 en `4 + 1 + 1` alors que `3 + 3` suffit.

Écrire une fonction `nb_pieces(montant, pieces)` qui renvoie le nombre **minimal** de pièces pour rendre `montant` (la pièce de 1 est toujours disponible), par **programmation dynamique**.

<Indices>
<Indice>

Construire une liste `meilleur` où `meilleur[s]` est le nombre minimal de pièces pour rendre `s`, de `s = 0` jusqu'à `montant`.

</Indice>
<Indice>

`meilleur[0] = 0`, et pour `s > 0` : `meilleur[s]` est le minimum de `1 + meilleur[s - p]` pour chaque pièce `p <= s`.

</Indice>
<Indice>

```text
FONCTION nb_pieces(montant, pieces)
    meilleur ← [0] + [∞] × montant
    POUR s ALLANT DE 1 À montant
        POUR CHAQUE p DE pieces
            SI p ≤ s ALORS meilleur[s] ← min(meilleur[s], 1 + meilleur[s - p])
    RENVOYER meilleur[montant]
```

</Indice>
</Indices>

<Correction>

```python
def nb_pieces(montant: int, pieces: list) -> int:
    meilleur = [0] + [float("inf")] * montant
    for s in range(1, montant + 1):
        for p in pieces:
            if p <= s and 1 + meilleur[s - p] < meilleur[s]:
                meilleur[s] = 1 + meilleur[s - p]
    return meilleur[montant]
```

</Correction>
</Enonce>
<Verification>

```python
assert nb_pieces(6, [1, 3, 4]) == 2, "6 = 3 + 3."
assert nb_pieces(0, [1, 2]) == 0 and nb_pieces(7, [1, 2, 5]) == 2 and nb_pieces(11, [1, 5, 6, 9]) == 2, "Autres montants."
assert nb_pieces(10000, [1, 7, 23, 100]) == 100, "Grand montant, rapidement."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-4-3" label="4.3 [Difficile] - Détection de cycle" type="python">
<Enonce>
### Détection de cycle

Écrire une fonction `a_un_cycle(graphe)` qui renvoie `True` si le graphe **non orienté** contient un cycle (un chemin qui revient à son point de départ sans repasser par une même arête). Le graphe peut avoir plusieurs morceaux non reliés.

<Indices>
<Indice>

Pendant un parcours en profondeur, retenir pour chaque sommet le sommet **par lequel on est arrivé** (son parent).

</Indice>
<Indice>

Si un voisin a déjà été visité et n'est pas le parent du sommet courant, il existe un cycle. Lancer un parcours depuis chaque sommet pas encore visité.

</Indice>
<Indice>

```text
FONCTION a_un_cycle(graphe)
    vus ← ensemble vide
    FONCTION explorer(s, parent)
        ajouter s à vus
        POUR CHAQUE v DE graphe[s]
            SI v ∉ vus ALORS SI explorer(v, s) ALORS RENVOYER VRAI
            SINON SI v ≠ parent ALORS RENVOYER VRAI
        RENVOYER FAUX
    POUR CHAQUE s DE graphe : SI s ∉ vus ET explorer(s, None) ALORS RENVOYER VRAI
    RENVOYER FAUX
```

</Indice>
</Indices>

<Correction>

```python
def a_un_cycle(graphe: dict) -> bool:
    vus = set()

    def explorer(s, parent) -> bool:
        vus.add(s)
        for v in graphe[s]:
            if v not in vus:
                if explorer(v, s):
                    return True
            elif v != parent:
                return True
        return False

    for s in graphe:
        if s not in vus and explorer(s, None):
            return True
    return False
```

</Correction>
</Enonce>
<Verification>

```python
arbre = {"A": ["B", "C"], "B": ["A", "D"], "C": ["A"], "D": ["B"]}
assert a_un_cycle(arbre) is False, "Un arbre n'a pas de cycle."
triangle = {"A": ["B", "C"], "B": ["A", "C"], "C": ["A", "B"]}
assert a_un_cycle(triangle) is True, "Un triangle est un cycle."
deux = {"A": ["B"], "B": ["A"], "C": ["D", "E"], "D": ["C", "E"], "E": ["C", "D"]}
assert a_un_cycle(deux) is True and a_un_cycle({"A": []}) is False, "Cycle dans le second morceau ; sommet seul."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-4-4" label="4.4 [Difficile] - Recherche d'un motif" type="python">
<Enonce>
### Recherche d'un motif

Écrire une fonction `occurrences(texte, motif)` qui renvoie la liste des positions où `motif` (non vide) apparaît dans `texte`, y compris les apparitions qui se chevauchent.

Exemple : `occurrences("abababa", "aba")` renvoie `[0, 2, 4]`.

Contrainte : comparer caractère par caractère, sans `find`, `index`, `count` ni découpage `texte[i:j]`.

<Indices>
<Indice>

Pour chaque position de départ `i` possible (de 0 à `len(texte) - len(motif)`), comparer le motif lettre à lettre avec le texte.

</Indice>
<Indice>

S'arrêter dès qu'une lettre diffère : c'est l'idée de base des algorithmes de recherche textuelle.

</Indice>
<Indice>

```text
FONCTION occurrences(texte, motif)
    positions ← liste vide
    POUR i ALLANT DE 0 À longueur(texte) - longueur(motif)
        j ← 0
        TANT QUE j < longueur(motif) ET texte[i + j] = motif[j] : j ← j + 1
        SI j = longueur(motif) ALORS ajouter i à positions
    RENVOYER positions
```

</Indice>
</Indices>

<Correction>

```python
def occurrences(texte: str, motif: str) -> list:
    positions = []
    for i in range(len(texte) - len(motif) + 1):
        j = 0
        while j < len(motif) and texte[i + j] == motif[j]:
            j = j + 1
        if j == len(motif):
            positions.append(i)
    return positions
```

</Correction>
</Enonce>
<Verification>

```python
assert occurrences("abababa", "aba") == [0, 2, 4], "Apparitions qui se chevauchent."
assert occurrences("le renard roux", "r") == [3, 7, 10] and occurrences("nsi", "python") == [], "Une lettre ; motif trop long."
assert occurrences("aaaa", "aa") == [0, 1, 2] and occurrences("gattaca", "ta") == [3], "Autres cas."
import re
assert not re.search(r"\.(find|index|count)\s*\(|\[[^\]]*:[^\]]*\]", PROGRAMME), "Sans find, index, count ni découpage."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-5-1" label="5.1 [Expert] - Algorithme de Dijkstra" type="python">
<Enonce>
### Algorithme de Dijkstra

Dans un graphe **pondéré**, `graphe[s]` est un dictionnaire voisin → poids de l'arête (positif).

Écrire une fonction `dijkstra(graphe, depart)` qui renvoie le dictionnaire sommet → distance minimale depuis `depart`, pour tous les sommets atteignables.

Principe : on fixe à chaque étape la distance du sommet non encore fixé le plus proche, puis on met à jour ses voisins.

<Indices>
<Indice>

Tenir un dictionnaire `dist` des meilleures distances connues et un ensemble `fixes`. Au départ, `dist = {depart: 0}`.

</Indice>
<Indice>

À chaque étape, choisir dans `dist` le sommet non fixé de plus petite distance, le fixer, puis pour chaque voisin `v` de poids `p` : si `dist[s] + p` améliore `dist[v]`, le mettre à jour.

</Indice>
<Indice>

```text
FONCTION dijkstra(graphe, depart)
    dist ← {depart: 0} ; fixes ← ensemble vide
    TANT QUE il reste dans dist un sommet non fixé
        s ← le sommet non fixé de plus petite distance ; ajouter s à fixes
        POUR CHAQUE (v, p) DE graphe[s]
            SI v ∉ dist OU dist[s] + p < dist[v] ALORS dist[v] ← dist[s] + p
    RENVOYER dist
```

</Indice>
</Indices>

<Correction>

```python
def dijkstra(graphe: dict, depart) -> dict:
    dist = {depart: 0}
    fixes = set()
    while len(fixes) < len(dist):
        s = min((v for v in dist if v not in fixes), key=lambda v: dist[v])
        fixes.add(s)
        for v, p in graphe[s].items():
            if v not in dist or dist[s] + p < dist[v]:
                dist[v] = dist[s] + p
    return dist
```

</Correction>
</Enonce>
<Verification>

```python
g = {
    "A": {"B": 4, "C": 1},
    "B": {"A": 4, "C": 2, "D": 5},
    "C": {"A": 1, "B": 2, "D": 8},
    "D": {"B": 5, "C": 8, "E": 3},
    "E": {"D": 3},
    "F": {},
}
assert dijkstra(g, "A") == {"A": 0, "C": 1, "B": 3, "D": 8, "E": 11}, "Distances depuis A (B passe par C)."
assert dijkstra(g, "E")["A"] == 11 and dijkstra(g, "F") == {"F": 0}, "Depuis E ; sommet isolé."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-5-2" label="5.2 [Expert] - Plus longue sous-suite commune" type="python">
<Enonce>
### Plus longue sous-suite commune

Une **sous-suite** d'un mot s'obtient en supprimant des lettres sans changer l'ordre des autres (`"rnd"` est une sous-suite de `"renard"`).

Écrire une fonction `plsc(a, b)` qui renvoie la **longueur** de la plus longue sous-suite commune à `a` et `b`, par programmation dynamique. Elle sert par exemple à comparer deux versions d'un fichier.

<Indices>
<Indice>

Un tableau `L` de `(len(a) + 1) × (len(b) + 1)` cases : `L[i][j]` est la réponse pour les débuts `a[:i]` et `b[:j]`. La première ligne et la première colonne valent 0.

</Indice>
<Indice>

Si `a[i - 1] == b[j - 1]`, `L[i][j] = L[i - 1][j - 1] + 1` ; sinon, c'est le plus grand de `L[i - 1][j]` et `L[i][j - 1]`.

</Indice>
<Indice>

```text
FONCTION plsc(a, b)
    L ← tableau (len(a) + 1) × (len(b) + 1) de 0
    POUR i DE 1 À len(a)
        POUR j DE 1 À len(b)
            SI a[i - 1] = b[j - 1] ALORS L[i][j] ← L[i - 1][j - 1] + 1
            SINON L[i][j] ← max(L[i - 1][j], L[i][j - 1])
    RENVOYER L[len(a)][len(b)]
```

</Indice>
</Indices>

<Correction>

```python
def plsc(a: str, b: str) -> int:
    L = [[0] * (len(b) + 1) for _ in range(len(a) + 1)]
    for i in range(1, len(a) + 1):
        for j in range(1, len(b) + 1):
            if a[i - 1] == b[j - 1]:
                L[i][j] = L[i - 1][j - 1] + 1
            else:
                L[i][j] = max(L[i - 1][j], L[i][j - 1])
    return L[len(a)][len(b)]
```

</Correction>
</Enonce>
<Verification>

```python
assert plsc("renard", "rendu") == 4, "renard et rendu : « rend », 4 lettres."
assert plsc("abcde", "ace") == 3 and plsc("abc", "def") == 0 and plsc("", "abc") == 0, "Autres cas."
assert plsc("a" * 500 + "b", "b" + "a" * 500) == 500, "Mots de 500 lettres, rapidement."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-5-3" label="5.3 [Expert] - Sac à dos" type="python">
<Enonce>
### Sac à dos

Un randonneur porte un sac de capacité `capacite` (en kg). Chaque objet a un poids (entier) et une valeur ; il ne peut prendre chaque objet qu'**une fois**.

Écrire une fonction `sac_a_dos(objets, capacite)` (`objets` est une liste de tuples `(poids, valeur)`) qui renvoie la plus grande valeur totale transportable, par programmation dynamique.

<Indices>
<Indice>

Une liste `meilleur` où `meilleur[c]` est la meilleure valeur avec une capacité `c`, mise à jour objet après objet.

</Indice>
<Indice>

Pour qu'un objet ne soit compté qu'une fois, parcourir les capacités **de la plus grande à la plus petite** : `meilleur[c] = max(meilleur[c], meilleur[c - poids] + valeur)`.

</Indice>
<Indice>

```text
FONCTION sac_a_dos(objets, capacite)
    meilleur ← capacite + 1 zéros
    POUR CHAQUE (poids, valeur) DE objets
        POUR c ALLANT DE capacite À poids (en descendant)
            meilleur[c] ← max(meilleur[c], meilleur[c - poids] + valeur)
    RENVOYER meilleur[capacite]
```

</Indice>
</Indices>

<Correction>

```python
def sac_a_dos(objets: list, capacite: int) -> int:
    meilleur = [0] * (capacite + 1)
    for poids, valeur in objets:
        for c in range(capacite, poids - 1, -1):
            meilleur[c] = max(meilleur[c], meilleur[c - poids] + valeur)
    return meilleur[capacite]
```

</Correction>
</Enonce>
<Verification>

```python
objets = [(1, 1), (3, 4), (4, 5), (5, 7)]
assert sac_a_dos(objets, 7) == 9, "Capacité 7 : poids 3 et 4, valeur 9."
assert sac_a_dos(objets, 0) == 0 and sac_a_dos([], 10) == 0 and sac_a_dos([(2, 3)], 10) == 3, "Cas limites, et pas deux fois le même objet."
assert sac_a_dos([(w, w * 2 + w % 7) for w in range(1, 60)], 500) > 0, "Beaucoup d'objets, rapidement."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-5-4" label="5.4 [Expert] - Les n reines" type="python">
<Enonce>
### Les n reines

Placer `n` reines sur un échiquier `n × n` sans qu'aucune n'en menace une autre : pas deux reines sur la même ligne, la même colonne ou la même diagonale.

Écrire une fonction `nb_solutions(n)` qui compte toutes les façons de le faire, par **retour sur trace** (backtracking) : placer une reine par ligne, essayer chaque colonne, et revenir en arrière dès qu'un placement est impossible.

<Indices>
<Indice>

Une fonction récursive `placer(ligne, colonnes)` où `colonnes` est la liste des colonnes des reines déjà placées sur les lignes précédentes.

</Indice>
<Indice>

Une colonne `c` est possible pour la ligne `l` si, pour chaque reine `(l2, c2)` déjà placée, `c != c2` et `abs(c - c2) != l - l2`. Arrivé à `ligne == n`, on a trouvé une solution.

</Indice>
<Indice>

```text
FONCTION nb_solutions(n)
    FONCTION placer(ligne, colonnes)
        SI ligne = n ALORS RENVOYER 1
        total ← 0
        POUR c ALLANT DE 0 À n - 1
            SI c compatible avec toutes les reines de colonnes ALORS total ← total + placer(ligne + 1, colonnes + [c])
        RENVOYER total
    RENVOYER placer(0, [])
```

</Indice>
</Indices>

<Correction>

```python
def nb_solutions(n: int) -> int:
    def placer(ligne: int, colonnes: list) -> int:
        if ligne == n:
            return 1
        total = 0
        for c in range(n):
            if all(c != c2 and abs(c - c2) != ligne - l2 for l2, c2 in enumerate(colonnes)):
                total = total + placer(ligne + 1, colonnes + [c])
        return total

    return placer(0, [])
```

</Correction>
</Enonce>
<Verification>

```python
assert [nb_solutions(n) for n in range(1, 7)] == [1, 0, 0, 2, 10, 4], "De 1 à 6 reines."
assert nb_solutions(8) == 92, "92 solutions pour l'échiquier classique."

import ast
def _recursive(nom):
    for n in ast.walk(ast.parse(PROGRAMME)):
        if isinstance(n, ast.FunctionDef) and n.name == nom:
            return any(isinstance(c, ast.Call) and getattr(c.func, "id", None) == nom for c in ast.walk(n))
    return False
assert _recursive("placer"), "placer est récursive : elle s'appelle elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-6-1" label="6.1 [Mini-projet] - Labyrinthe : boue, portes et clés" type="python">
<Enonce>
### Labyrinthe : boue, portes et clés

**Contexte.** Un jeu d'aventure en vue de dessus fait se déplacer un renard dans des labyrinthes. Le moteur du jeu doit répondre à trois questions : quel est le chemin le plus court en nombre de pas (pour l'animation « aller ici »), quel est le trajet le moins fatigant quand certaines cases sont boueuses, et peut-on sortir en ramassant des clés pour ouvrir des portes. Le projet écrit ce solveur.

**Les données** : un labyrinthe est une liste de textes de même longueur. Symboles : `#` mur, `.` passage, `~` boue, `S` départ, `E` sortie, une lettre minuscule (`a`, `b`…) est une **clé**, la majuscule correspondante (`A`, `B`…) une **porte** qui ne s'ouvre qu'avec cette clé. On se déplace en haut, en bas, à gauche ou à droite ; entrer dans une case coûte 1, sauf la boue qui coûte 3. Exemple :

```
S~~~E
.###.
.....
```

**Les fonctions du solveur**
- `trouver(lab, symbole)` : localise le départ, la sortie ou une clé. Renvoie la position `(ligne, colonne)` du symbole (`None` s'il n'y est pas).
- `voisines(lab, pos)` : les déplacements possibles depuis une case. Renvoie la liste des positions voisines dans la grille qui ne sont pas des murs, dans l'ordre bas, haut, droite, gauche.
- `plus_court(lab)` et `chemin(lab)` : pour l'animation, les portes étant traitées comme des murs. La première renvoie le nombre minimal de **pas** de `S` à `E` (`-1` si impossible) ; la seconde renvoie la liste des positions d'un tel chemin, de `S` à `E` compris (`None` si impossible).
- `moins_cher(lab)` : le trajet le moins fatigant. Renvoie le **coût** minimal de `S` à `E` en tenant compte de la boue, portes fermées (`-1` si impossible). Dans l'exemple, le chemin le plus court traverse la boue (4 pas, coût 10) alors que le détour par le bas coûte 8.
- `avec_cles(lab)` : le niveau à énigmes. Renvoie le nombre minimal de pas de `S` à `E` quand on ramasse les clés en passant dessus et qu'on peut alors franchir les portes correspondantes (`-1` si impossible).

<Indices>
<Indice>

`plus_court` est un parcours en largeur ; `moins_cher` en est la version pondérée (algorithme de Dijkstra) : prendre à chaque étape la case non traitée de plus petit coût.

</Indice>
<Indice>

Pour les clés, un état n'est plus seulement une position : c'est le couple `(position, clés possédées)`, avec un `frozenset` pour les clés. Le parcours en largeur se fait sur ces états ; deux passages au même endroit avec des clés différentes sont deux états différents.

</Indice>
<Indice>

Une porte est franchissable dans l'état courant si `case.lower()` fait partie des clés possédées.

</Indice>
<Indice>

```text
(cœur du programme : le parcours sur les états)
FONCTION avec_cles(lab)
    depart ← (trouver(lab, "S"), ensemble vide)
    vus ← {depart} ; file ← [(depart, 0)]
    TANT QUE file non vide
        ((pos, cles), d) ← retirer le premier de file
        SI lab[pos] = "E" ALORS RENVOYER d
        POUR CHAQUE v DE voisines(lab, pos)
            c ← lab[v]
            SI c est une porte ET minuscule(c) ∉ cles ALORS passer
            nouvelles ← cles + {c} si c est une clé, sinon cles
            SI (v, nouvelles) ∉ vus ALORS l'ajouter à vus, et ((v, nouvelles), d + 1) à file
    RENVOYER -1
```

</Indice>
</Indices>

<Correction>

```python
from collections import deque


def trouver(lab: list, symbole: str):
    for l, ligne in enumerate(lab):
        if symbole in ligne:
            return (l, ligne.index(symbole))
    return None


def voisines(lab: list, pos: tuple) -> list:
    l, c = pos
    resultat = []
    for dl, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        i, j = l + dl, c + dc
        if 0 <= i < len(lab) and 0 <= j < len(lab[0]) and lab[i][j] != "#":
            resultat.append((i, j))
    return resultat


def _ferme(case: str) -> bool:
    return case.isupper() and case not in "SE"


def chemin(lab: list):
    depart = trouver(lab, "S")
    parent = {depart: None}
    file = deque([depart])
    while file:
        pos = file.popleft()
        if lab[pos[0]][pos[1]] == "E":
            trajet = [pos]
            while parent[trajet[-1]] is not None:
                trajet.append(parent[trajet[-1]])
            return trajet[::-1]
        for v in voisines(lab, pos):
            if v not in parent and not _ferme(lab[v[0]][v[1]]):
                parent[v] = pos
                file.append(v)
    return None


def plus_court(lab: list) -> int:
    t = chemin(lab)
    return len(t) - 1 if t else -1


def moins_cher(lab: list) -> int:
    depart = trouver(lab, "S")
    cout = {depart: 0}
    fixes = set()
    while len(fixes) < len(cout):
        pos = min((p for p in cout if p not in fixes), key=lambda p: cout[p])
        fixes.add(pos)
        if lab[pos[0]][pos[1]] == "E":
            return cout[pos]
        for v in voisines(lab, pos):
            case = lab[v[0]][v[1]]
            if _ferme(case):
                continue
            c = cout[pos] + (3 if case == "~" else 1)
            if v not in cout or c < cout[v]:
                cout[v] = c
    return -1


def avec_cles(lab: list) -> int:
    depart = (trouver(lab, "S"), frozenset())
    vus = {depart}
    file = deque([(depart, 0)])
    while file:
        (pos, cles), d = file.popleft()
        if lab[pos[0]][pos[1]] == "E":
            return d
        for v in voisines(lab, pos):
            case = lab[v[0]][v[1]]
            if _ferme(case) and case.lower() not in cles:
                continue
            nouvelles = cles | {case} if case.islower() else cles
            etat = (v, nouvelles)
            if etat not in vus:
                vus.add(etat)
                file.append((etat, d + 1))
    return -1
```

</Correction>
</Enonce>
<Verification>

```python
L1 = ["S~~~E",
      ".###.",
      "....."]
assert trouver(L1, "S") == (0, 0) and trouver(L1, "E") == (0, 4) and trouver(L1, "Z") is None, "Trouver."
assert voisines(L1, (0, 0)) == [(1, 0), (0, 1)] and voisines(L1, (0, 2)) == [(0, 3), (0, 1)], "Voisines."
assert plus_court(L1) == 4, "Plus court chemin en pas : par la boue."
c = chemin(L1)
assert c == [(0, 0), (0, 1), (0, 2), (0, 3), (0, 4)], "Le chemin le plus court."
assert moins_cher(L1) == 8, "Le détour sans boue (8 pas) coûte moins que la boue (10)."
L2 = ["S.A.E",
      ".###.",
      "a....",
      "#####"]
assert plus_court(L2) == 8 and moins_cher(L2) == 8 and avec_cles(L2) == 8, "Porte fermée : le détour."
L3 = ["S.#E",
      "..#B",
      "b.A.",
      "a..#"]
assert plus_court(L3) == -1 and moins_cher(L3) == -1 and chemin(L3) is None, "Portes fermées : impossible."
assert avec_cles(L3) == 9, "Il faut ramasser les deux clés pour franchir les deux portes."
assert avec_cles(["S#E"]) == -1 and avec_cles(["SE"]) == 1, "Impossible, puis immédiat."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-fond-6-2" label="6.2 [Mini-projet] - Compression de Huffman" type="python">
<Enonce>
### Compression de Huffman

**Contexte.** Pour comprendre comment fonctionnent les fichiers ZIP, une équipe programme le codage de Huffman, l'un des algorithmes de compression qu'ils utilisent (comme les formats JPEG et MP3). L'idée : au lieu de coder chaque caractère sur 8 bits, donner des codes binaires courts aux caractères fréquents et longs aux caractères rares. L'outil compresse un texte, le décompresse sans perte et mesure le gain.

**Construction de l'arbre** : chaque caractère est d'abord une feuille, de poids son nombre d'apparitions. Tant qu'il reste plusieurs arbres, on retire les **deux de plus petit poids** et on les réunit sous un nœud dont le poids est la somme : le premier retiré à gauche, le second à droite. Pour que tout le monde obtienne le même arbre, les égalités de poids se départagent par **ordre de création** : les feuilles sont créées dans l'ordre alphabétique des caractères, puis chaque nouveau nœud reçoit le numéro suivant. Exemple : pour `"abracadabra"`, l'arbre est `("a", (("c", "d"), ("b", "r")))` et le code de `a` est `"0"`.

**Les fonctions de l'outil**
- `frequences(texte)` : la première étape. Renvoie un dictionnaire caractère → nombre d'apparitions.
- `arbre(freq)` : construit l'arbre de Huffman à partir des fréquences. Une feuille est un caractère, un nœud un tuple `(gauche, droit)`.
- `codes(a)` : la table de codage, lue dans l'arbre. Renvoie un dictionnaire caractère → code (texte de `0` et de `1`), `0` pour aller à gauche et `1` à droite ; si l'arbre est une seule feuille, son code est `"0"`.
- `encoder(texte, c)` : la compression. Renvoie le texte de bits obtenu en remplaçant chaque caractère par son code.
- `decoder(bits, a)` : la décompression, qui retrouve le texte d'origine à partir des bits et de l'arbre : `decoder(encoder(t, codes(a)), a)` redonne `t`.
- `sans_prefixe(c)` : vérifie la propriété qui rend le décodage possible. Renvoie `True` si aucun code n'est le début d'un autre.
- `taux(texte)` : mesure le gain. Renvoie la longueur du texte codé divisée par celle du texte en ASCII (8 bits par caractère), arrondie au millième.

<Indices>
<Indice>

Pour l'arbre, une liste de triplets `(poids, numero, arbre)` : la trier (ou chercher le minimum) donne directement le plus petit poids puis le plus ancien.

</Indice>
<Indice>

`codes` est récursive : un nœud transmet à son sous-arbre gauche le préfixe + `"0"` et au droit le préfixe + `"1"` ; une feuille enregistre son préfixe.

</Indice>
<Indice>

Pour décoder, partir de la racine et descendre bit par bit ; arrivé à une feuille, noter le caractère et repartir de la racine.

</Indice>
<Indice>

```text
(cœur du programme : construire l'arbre)
FONCTION arbre(freq)
    foret ← [(freq[c], i, c) pour i, c dans les caractères triés]
    numero ← nombre de caractères
    TANT QUE longueur(foret) > 1
        trier foret ; (p1, n1, a1) ← retirer le premier ; (p2, n2, a2) ← retirer le premier
        ajouter (p1 + p2, numero, (a1, a2)) à foret ; numero ← numero + 1
    RENVOYER l'arbre du seul triplet restant
```

</Indice>
</Indices>

<Correction>

```python
def frequences(texte: str) -> dict:
    f = {}
    for c in texte:
        f[c] = f.get(c, 0) + 1
    return f


def arbre(freq: dict):
    foret = [(freq[c], i, c) for i, c in enumerate(sorted(freq))]
    numero = len(foret)
    while len(foret) > 1:
        foret.sort(key=lambda t: (t[0], t[1]))
        p1, n1, a1 = foret.pop(0)
        p2, n2, a2 = foret.pop(0)
        foret.append((p1 + p2, numero, (a1, a2)))
        numero += 1
    return foret[0][2]


def codes(a, prefixe: str = "") -> dict:
    if isinstance(a, str):
        return {a: prefixe or "0"}
    resultat = codes(a[0], prefixe + "0")
    resultat.update(codes(a[1], prefixe + "1"))
    return resultat


def encoder(texte: str, c: dict) -> str:
    return "".join(c[x] for x in texte)


def decoder(bits: str, a) -> str:
    if isinstance(a, str):
        return a * len(bits)
    texte = ""
    noeud = a
    for b in bits:
        noeud = noeud[0] if b == "0" else noeud[1]
        if isinstance(noeud, str):
            texte += noeud
            noeud = a
    return texte


def sans_prefixe(c: dict) -> bool:
    valeurs = list(c.values())
    return not any(i != j and valeurs[j].startswith(valeurs[i]) for i in range(len(valeurs)) for j in range(len(valeurs)))


def taux(texte: str) -> float:
    a = arbre(frequences(texte))
    return round(len(encoder(texte, codes(a))) / (8 * len(texte)), 3)
```

</Correction>
</Enonce>
<Verification>

```python
import heapq
def _cout_optimal(freq):
    tas = list(freq.values())
    heapq.heapify(tas)
    total = 0
    while len(tas) > 1:
        x, y = heapq.heappop(tas), heapq.heappop(tas)
        total += x + y
        heapq.heappush(tas, x + y)
    return total

assert frequences("abracadabra") == {"a": 5, "b": 2, "r": 2, "c": 1, "d": 1}, "Fréquences."
a = arbre({"a": 5, "b": 2, "r": 2, "c": 1, "d": 1})
assert a == ("a", (("c", "d"), ("b", "r"))), "Arbre de abracadabra (égalités départagées par ordre de création)."
c = codes(a)
assert c == {"a": "0", "c": "100", "d": "101", "b": "110", "r": "111"} and sans_prefixe(c), "Codes."
assert encoder("abra", c) == "01101110" and decoder("01101110", a) == "abra", "Encodage et décodage."
assert codes(arbre({"z": 4})) == {"z": "0"} and decoder("000", "z") == "zzz", "Un seul caractère."
assert not sans_prefixe({"a": "0", "b": "01"}), "Code préfixe d'un autre."
for texte in ["le renard roux dort sous le chene", "aaaaaaab", "nsi " * 50 + "python"]:
    f = frequences(texte)
    cs = codes(arbre(f))
    bits = encoder(texte, cs)
    assert decoder(bits, arbre(f)) == texte and sans_prefixe(cs), "Aller-retour sans perte."
    assert len(bits) == _cout_optimal(f), "La longueur codée est la plus petite possible."
assert taux("aaaaaaab") == 0.125 and taux("le renard roux dort sous le chene") < 0.5, "Taux de compression."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
