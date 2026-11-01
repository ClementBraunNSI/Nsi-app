---
title: Exercices Booléens
description: >-
  Exercices sur les booléens, les opérateurs de comparaison et les opérateurs
  logiques en Python.
level: premiere
chapter: Représentation des données
icon: "circle-check"
badgeId: premiere_fiche_exercices_bool
prerequisites:
  - donnees_caracteres
audience: public
groupe: booleens
groupeTitre: "Booléens"
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="premiere_fiche_exercices_bool" courseTitle="Exercices Booléens">

<ExerciseSection id="1nsi-bool-1-1" label="1.1 [Introduction] - Droit de vote" type="python">
<Enonce>
### Droit de vote

Pour voter, il faut avoir au moins 18 ans **et** être inscrit sur les listes.

Écrire une fonction `peut_voter(age, inscrit)` (`inscrit` est un booléen).

Contrainte : sans `if`.

<Indices>
<Indice>

`age >= 18` est déjà un booléen.

</Indice>
<Indice>

Deux conditions qui doivent être vraies ensemble se relient par `and`.

</Indice>
<Indice>

```text
FONCTION peut_voter(age, inscrit)
    RENVOYER (age ≥ 18) ET inscrit
```

</Indice>
</Indices>

<Correction>

```python
def peut_voter(age: int, inscrit: bool) -> bool:
    return age >= 18 and inscrit
```

</Correction>
</Enonce>
<Verification>

```python
assert peut_voter(18, True) is True and peut_voter(40, True) is True, "Majeur et inscrit."
assert peut_voter(17, True) is False and peut_voter(30, False) is False, "Mineur, ou pas inscrit."

import re
assert not re.search(r"\bif\b", PROGRAMME), "Sans if : une expression booléenne suffit."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-1-2" label="1.2 [Introduction] - Non-et" type="python">
<Enonce>
### Non-et

La porte logique **NON-ET** (NAND) renvoie `False` seulement quand ses deux entrées valent `True`.

Écrire une fonction `non_et(a, b)`.

Contrainte : sans `if`.

<Indices>
<Indice>

NON-ET est le contraire de ET.

</Indice>
<Indice>

`not (a and b)`.

</Indice>
<Indice>

```text
FONCTION non_et(a, b)
    RENVOYER NON (a ET b)
```

</Indice>
</Indices>

<Correction>

```python
def non_et(a: bool, b: bool) -> bool:
    return not (a and b)
```

</Correction>
</Enonce>
<Verification>

```python
assert non_et(True, True) is False, "Vrai, vrai : faux."
assert non_et(True, False) is True and non_et(False, True) is True and non_et(False, False) is True, "Les trois autres cas : vrai."

import re
assert not re.search(r"\bif\b", PROGRAMME), "Sans if : une expression booléenne suffit."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-1-3" label="1.3 [Introduction] - Est-ce une voyelle ?" type="python">
<Enonce>
### Est-ce une voyelle ?

Écrire une fonction `est_voyelle(c)` qui renvoie `True` si le caractère `c` est une voyelle minuscule ou majuscule (`a e i o u y`, sans accent).

Contrainte : sans `if` ni `or`.

<Indices>
<Indice>

L'opérateur `in` teste la présence d'un caractère dans un texte : `"e" in "aeiouy"` vaut `True`.

</Indice>
<Indice>

`c.lower()` ramène la majuscule à la minuscule.

</Indice>
<Indice>

```text
FONCTION est_voyelle(c)
    RENVOYER minuscule(c) ∈ "aeiouy"
```

</Indice>
</Indices>

<Correction>

```python
def est_voyelle(c: str) -> bool:
    return c.lower() in "aeiouy"
```

</Correction>
</Enonce>
<Verification>

```python
for c in "aEiOuY":
    assert est_voyelle(c) is True, f"{c} est une voyelle."
for c in "bZ1 ":
    assert est_voyelle(c) is False, f"« {c} » n'en est pas une."
import re
assert not re.search(r"\b(if|or)\b", PROGRAMME), "Sans if ni or."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-1-4" label="1.4 [Introduction] - Même signe" type="python">
<Enonce>
### Même signe

Écrire une fonction `meme_signe(a, b)` qui renvoie `True` si les deux nombres sont tous les deux strictement positifs ou tous les deux strictement négatifs.

Contrainte : sans `if` et sans multiplier `a` par `b`.

<Indices>
<Indice>

Deux situations possibles, reliées par `or`.

</Indice>
<Indice>

Chaque situation combine deux comparaisons avec `and`.

</Indice>
<Indice>

```text
FONCTION meme_signe(a, b)
    RENVOYER (a > 0 ET b > 0) OU (a < 0 ET b < 0)
```

</Indice>
</Indices>

<Correction>

```python
def meme_signe(a: float, b: float) -> bool:
    return (a > 0 and b > 0) or (a < 0 and b < 0)
```

</Correction>
</Enonce>
<Verification>

```python
assert meme_signe(3, 7) is True and meme_signe(-1, -9) is True, "Deux positifs, deux négatifs."
assert meme_signe(3, -7) is False and meme_signe(0, 5) is False and meme_signe(0, 0) is False, "Signes différents, ou zéro."
assert "*" not in PROGRAMME, "Sans multiplication."

import re
assert not re.search(r"\bif\b", PROGRAMME), "Sans if : une expression booléenne suffit."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-2-1" label="2.1 [Facile] - Table de vérité du ET" type="python">
<Enonce>
### Table de vérité du ET

Écrire une fonction `table_et()` qui renvoie la table de vérité du ET sous forme de liste de tuples `(a, b, a et b)`, dans l'ordre : `(False, False)`, `(False, True)`, `(True, False)`, `(True, True)`.

Contrainte : construire la table avec des boucles, sans l'écrire à la main.

<Indices>
<Indice>

Deux boucles imbriquées sur `(False, True)` produisent les 4 combinaisons dans le bon ordre.

</Indice>
<Indice>

Ajouter le tuple `(a, b, a and b)` à chaque tour.

</Indice>
<Indice>

```text
FONCTION table_et()
    table ← liste vide
    POUR CHAQUE a DE (FAUX, VRAI)
        POUR CHAQUE b DE (FAUX, VRAI)
            ajouter (a, b, a ET b) à table
    RENVOYER table
```

</Indice>
</Indices>

<Correction>

```python
def table_et() -> list:
    table = []
    for a in (False, True):
        for b in (False, True):
            table.append((a, b, a and b))
    return table
```

</Correction>
</Enonce>
<Verification>

```python
assert table_et() == [(False, False, False), (False, True, False), (True, False, False), (True, True, True)], "La table du ET."
import re
assert re.search(r"\bfor\b", PROGRAMME), "Construite avec des boucles."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-2-2" label="2.2 [Facile] - Implication" type="python">
<Enonce>
### Implication

En logique, « `a` implique `b` » est faux dans un seul cas : `a` vrai et `b` faux (« s'il pleut, je prends un parapluie » n'est contredit que s'il pleut sans parapluie).

Écrire une fonction `implique(a, b)`.

Contrainte : sans `if`.

<Indices>
<Indice>

L'implication est vraie dès que `a` est faux, ou dès que `b` est vrai.

</Indice>
<Indice>

`not a or b`.

</Indice>
<Indice>

```text
FONCTION implique(a, b)
    RENVOYER (NON a) OU b
```

</Indice>
</Indices>

<Correction>

```python
def implique(a: bool, b: bool) -> bool:
    return not a or b
```

</Correction>
</Enonce>
<Verification>

```python
assert implique(True, False) is False, "Vrai implique faux : faux."
assert implique(True, True) is True and implique(False, True) is True and implique(False, False) is True, "Les autres cas : vrai."

import re
assert not re.search(r"\bif\b", PROGRAMME), "Sans if : une expression booléenne suffit."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-2-3" label="2.3 [Facile] - Équivalence" type="python">
<Enonce>
### Équivalence

« `a` équivaut à `b` » est vrai quand `a` et `b` ont la même valeur.

Écrire une fonction `equivalent(a, b)`.

Contrainte : avec `and`, `or` et `not` seulement (pas de `==`, `!=` ni `if`).

<Indices>
<Indice>

Deux cas rendent l'équivalence vraie : les deux sont vrais, ou les deux sont faux.

</Indice>
<Indice>

`(a and b) or (not a and not b)`.

</Indice>
<Indice>

```text
FONCTION equivalent(a, b)
    RENVOYER (a ET b) OU (NON a ET NON b)
```

</Indice>
</Indices>

<Correction>

```python
def equivalent(a: bool, b: bool) -> bool:
    return (a and b) or (not a and not b)
```

</Correction>
</Enonce>
<Verification>

```python
assert equivalent(True, True) is True and equivalent(False, False) is True, "Mêmes valeurs : vrai."
assert equivalent(True, False) is False and equivalent(False, True) is False, "Valeurs différentes : faux."
assert "==" not in PROGRAMME and "!=" not in PROGRAMME, "Sans == ni !=."

import re
assert not re.search(r"\bif\b", PROGRAMME), "Sans if : une expression booléenne suffit."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-2-4" label="2.4 [Facile] - Majorité" type="python">
<Enonce>
### Majorité

Un jury de trois personnes vote oui (`True`) ou non (`False`). Écrire une fonction `majorite(a, b, c)` qui renvoie `True` si au moins deux votes sont oui.

Contrainte : avec `and` et `or` seulement (pas de `if`, pas de somme).

<Indices>
<Indice>

Au moins deux oui : soit `a` et `b`, soit `a` et `c`, soit `b` et `c`.

</Indice>
<Indice>

Trois paires reliées par `or`.

</Indice>
<Indice>

```text
FONCTION majorite(a, b, c)
    RENVOYER (a ET b) OU (a ET c) OU (b ET c)
```

</Indice>
</Indices>

<Correction>

```python
def majorite(a: bool, b: bool, c: bool) -> bool:
    return (a and b) or (a and c) or (b and c)
```

</Correction>
</Enonce>
<Verification>

```python
from itertools import product
for a, b, c in product([False, True], repeat=3):
    assert majorite(a, b, c) == ((a + b + c) >= 2), f"Votes {a}, {b}, {c}."
assert "+" not in PROGRAMME and "sum" not in PROGRAMME, "Sans somme."

import re
assert not re.search(r"\bif\b", PROGRAMME), "Sans if : une expression booléenne suffit."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-3-1" label="3.1 [Moyen] - Table d'une fonction" type="python">
<Enonce>
### Table d'une fonction

Une fonction peut être passée en paramètre à une autre fonction, comme n'importe quelle valeur.

Écrire une fonction `table(f)` qui reçoit une fonction booléenne `f` à deux entrées et renvoie la liste de ses 4 sorties pour les entrées `(False, False)`, `(False, True)`, `(True, False)`, `(True, True)`.

Exemple : `table(non_et)` renvoie `[True, True, True, False]`.

<Indices>
<Indice>

`f(a, b)` appelle la fonction reçue en paramètre.

</Indice>
<Indice>

Mêmes boucles imbriquées que pour la table du ET.

</Indice>
<Indice>

```text
FONCTION table(f)
    sorties ← liste vide
    POUR CHAQUE a DE (FAUX, VRAI)
        POUR CHAQUE b DE (FAUX, VRAI) : ajouter f(a, b)
    RENVOYER sorties
```

</Indice>
</Indices>

<Correction>

```python
def table(f) -> list:
    sorties = []
    for a in (False, True):
        for b in (False, True):
            sorties.append(f(a, b))
    return sorties
```

</Correction>
</Enonce>
<Verification>

```python
def ou(a, b):
    return a or b

assert table(ou) == [False, True, True, True], "Table du OU."
assert table(lambda a, b: not (a and b)) == [True, True, True, False], "Table du NON-ET."
assert table(lambda a, b: a) == [False, False, True, True], "Fonction qui recopie a."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-3-2" label="3.2 [Moyen] - Lois de De Morgan" type="python">
<Enonce>
### Lois de De Morgan

Deux expressions booléennes sont **équivalentes** si elles donnent le même résultat pour toutes les valeurs des variables.

Écrire une fonction `equivalentes(f, g)` qui reçoit deux fonctions booléennes à deux entrées et renvoie `True` si elles sont équivalentes.

Elle permet de vérifier les lois de De Morgan : `not (a and b)` équivaut à `not a or not b`.

<Indices>
<Indice>

Tester les quatre combinaisons d'entrées.

</Indice>
<Indice>

Dès qu'une combinaison donne deux résultats différents, renvoyer `False`.

</Indice>
<Indice>

```text
FONCTION equivalentes(f, g)
    POUR CHAQUE a DE (FAUX, VRAI)
        POUR CHAQUE b DE (FAUX, VRAI)
            SI f(a, b) ≠ g(a, b) ALORS RENVOYER FAUX
    RENVOYER VRAI
```

</Indice>
</Indices>

<Correction>

```python
def equivalentes(f, g) -> bool:
    for a in (False, True):
        for b in (False, True):
            if f(a, b) != g(a, b):
                return False
    return True
```

</Correction>
</Enonce>
<Verification>

```python
assert equivalentes(lambda a, b: not (a and b), lambda a, b: not a or not b) is True, "Première loi de De Morgan."
assert equivalentes(lambda a, b: not (a or b), lambda a, b: not a and not b) is True, "Seconde loi."
assert equivalentes(lambda a, b: not (a and b), lambda a, b: not a and not b) is False, "Erreur classique : non équivalentes."
assert equivalentes(lambda a, b: a, lambda a, b: a or (a and b)) is True, "Loi d'absorption."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-3-3" label="3.3 [Moyen] - Parité de trois bits" type="python">
<Enonce>
### Parité de trois bits

Écrire une fonction `impair(a, b, c)` qui renvoie `True` si un nombre **impair** des trois booléens est vrai (un seul, ou les trois).

Contrainte : sans `if` et sans compter (pas de `+`, `sum` ni `count`). Un « ou exclusif » de deux booléens s'écrit `a != b`.

<Indices>
<Indice>

Le ou exclusif de deux booléens est vrai quand un nombre impair d'entre eux est vrai.

</Indice>
<Indice>

Appliquer le ou exclusif deux fois : d'abord à `a` et `b`, puis au résultat et à `c`.

</Indice>
<Indice>

```text
FONCTION impair(a, b, c)
    RENVOYER (a OUX b) OUX c
```

</Indice>
</Indices>

<Correction>

```python
def impair(a: bool, b: bool, c: bool) -> bool:
    return (a != b) != c
```

</Correction>
</Enonce>
<Verification>

```python
from itertools import product
for a, b, c in product([False, True], repeat=3):
    assert impair(a, b, c) == ((a + b + c) % 2 == 1), f"Bits {a}, {b}, {c}."
assert "+" not in PROGRAMME and "sum" not in PROGRAMME and "count" not in PROGRAMME, "Sans compter."

import re
assert not re.search(r"\bif\b", PROGRAMME), "Sans if : une expression booléenne suffit."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-3-4" label="3.4 [Moyen] - ET bit à bit" type="python">
<Enonce>
### ET bit à bit

Un octet peut s'écrire comme un texte de `0` et de `1`. Le « ET bit à bit » de deux textes de même longueur applique le ET à chaque position : `"1100"` et `"1010"` donnent `"1000"`.

Écrire une fonction `et_bits(x, y)`.

<Indices>
<Indice>

Parcourir les positions avec `range(len(x))`.

</Indice>
<Indice>

Le bit du résultat vaut `"1"` seulement si les deux bits valent `"1"`.

</Indice>
<Indice>

```text
FONCTION et_bits(x, y)
    resultat ← ""
    POUR i ALLANT DE 0 À longueur(x) - 1
        SI x[i] = "1" ET y[i] = "1" ALORS resultat ← resultat + "1" SINON resultat ← resultat + "0"
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def et_bits(x: str, y: str) -> str:
    resultat = ""
    for i in range(len(x)):
        if x[i] == "1" and y[i] == "1":
            resultat = resultat + "1"
        else:
            resultat = resultat + "0"
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert et_bits("1100", "1010") == "1000", "1100 ET 1010 = 1000."
assert et_bits("11111111", "10110010") == "10110010" and et_bits("0000", "1111") == "0000", "Masques tout à 1 et tout à 0."
assert et_bits("", "") == "", "Textes vides."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-4-1" label="4.1 [Difficile] - Additionneur complet" type="python">
<Enonce>
### Additionneur complet

Un **additionneur complet** additionne deux bits `a` et `b` et une retenue d'entrée `r` (des booléens, `True` valant 1). Il produit :
- une `somme`, vraie quand un nombre impair des trois entrées est vrai ;
- une `retenue` de sortie, vraie quand au moins deux des trois entrées sont vraies.

Écrire une fonction `additionneur(a, b, r)` qui renvoie le tuple `(somme, retenue)`.

Contrainte : avec des opérateurs booléens (`and`, `or`, `not`, `!=`), sans `if` ni addition.

<Indices>
<Indice>

La somme est le ou exclusif des trois entrées.

</Indice>
<Indice>

La retenue est la fonction « majorité ».

</Indice>
<Indice>

```text
FONCTION additionneur(a, b, r)
    somme ← (a OUX b) OUX r
    retenue ← (a ET b) OU (a ET r) OU (b ET r)
    RENVOYER (somme, retenue)
```

</Indice>
</Indices>

<Correction>

```python
def additionneur(a: bool, b: bool, r: bool) -> tuple:
    somme = (a != b) != r
    retenue = (a and b) or (a and r) or (b and r)
    return (somme, retenue)
```

</Correction>
</Enonce>
<Verification>

```python
from itertools import product
for a, b, r in product([False, True], repeat=3):
    total = a + b + r
    assert additionneur(a, b, r) == (total % 2 == 1, total >= 2), f"{int(a)} + {int(b)} + {int(r)} = {total}."
assert "+" not in PROGRAMME, "Sans addition."

import re
assert not re.search(r"\bif\b", PROGRAMME), "Sans if : une expression booléenne suffit."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-4-2" label="4.2 [Difficile] - Addition binaire" type="python">
<Enonce>
### Addition binaire

Écrire une fonction `addition(x, y)` qui additionne deux nombres binaires écrits sous forme de textes de **même longueur** et renvoie le résultat, éventuellement plus long d'un chiffre.

Exemple : `addition("0110", "0111")` renvoie `"1101"`. `addition("11", "01")` renvoie `"100"`.

Contrainte : en enchaînant des additionneurs complets, de droite à gauche, sans convertir en entier.

<Indices>
<Indice>

Parcourir les positions de la droite vers la gauche, avec une retenue qui part de `False`.

</Indice>
<Indice>

À chaque position, l'additionneur complet donne le bit du résultat (à placer **devant** le texte déjà construit) et la retenue pour la position suivante.

</Indice>
<Indice>

Une retenue finale à `True` ajoute un `1` devant le résultat.

</Indice>
<Indice>

```text
FONCTION addition(x, y)
    resultat ← "" ; r ← FAUX
    POUR i ALLANT DE longueur(x) - 1 À 0 (en descendant)
        (s, r) ← additionneur(x[i] = "1", y[i] = "1", r)
        resultat ← ("1" si s sinon "0") + resultat
    SI r ALORS resultat ← "1" + resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def additionneur(a: bool, b: bool, r: bool) -> tuple:
    return ((a != b) != r, (a and b) or (a and r) or (b and r))


def addition(x: str, y: str) -> str:
    resultat = ""
    r = False
    for i in range(len(x) - 1, -1, -1):
        s, r = additionneur(x[i] == "1", y[i] == "1", r)
        resultat = ("1" if s else "0") + resultat
    if r:
        resultat = "1" + resultat
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert addition("0110", "0111") == "1101", "6 + 7 = 13."
assert addition("11", "01") == "100", "3 + 1 = 4 : un chiffre de plus."
assert addition("11111111", "00000001") == "100000000" and addition("0", "0") == "0", "255 + 1 et 0 + 0."
assert "int(" not in PROGRAMME, "Sans conversion en entier."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-4-3" label="4.3 [Difficile] - Forme normale disjonctive" type="python">
<Enonce>
### Forme normale disjonctive

Toute fonction booléenne de deux variables s'écrit comme un « ou » de cas où elle est vraie. Par exemple, la fonction vraie seulement pour `(a, b) = (False, True)` et `(True, True)` s'écrit `(non a et b) ou (a et b)`.

Écrire une fonction `expression(sorties)` qui reçoit la liste des 4 sorties (pour les entrées dans l'ordre FF, FV, VF, VV) et renvoie l'expression sous cette forme : les cas vrais dans l'ordre, chacun entre parenthèses, séparés par ` ou `. Une fonction toujours fausse donne `"faux"`.

<Indices>
<Indice>

Pour le cas d'indice `i`, les valeurs de `a` et `b` sont `(False, False)`, `(False, True)`, `(True, False)`, `(True, True)`.

</Indice>
<Indice>

Une variable fausse s'écrit `non a`, une variable vraie `a`. Construire la liste des morceaux, puis les assembler avec `" ou ".join(...)`.

</Indice>
<Indice>

```text
FONCTION expression(sorties)
    entrees ← [(FAUX, FAUX), (FAUX, VRAI), (VRAI, FAUX), (VRAI, VRAI)]
    morceaux ← liste vide
    POUR i ALLANT DE 0 À 3
        SI sorties[i] ALORS
            (a, b) ← entrees[i]
            ajouter "(" + ("a" ou "non a") + " et " + ("b" ou "non b") + ")" à morceaux
    SI morceaux vide ALORS RENVOYER "faux"
    RENVOYER morceaux joints par " ou "
```

</Indice>
</Indices>

<Correction>

```python
def expression(sorties: list) -> str:
    entrees = [(False, False), (False, True), (True, False), (True, True)]
    morceaux = []
    for i in range(4):
        if sorties[i]:
            a, b = entrees[i]
            texte_a = "a" if a else "non a"
            texte_b = "b" if b else "non b"
            morceaux.append("(" + texte_a + " et " + texte_b + ")")
    if not morceaux:
        return "faux"
    return " ou ".join(morceaux)
```

</Correction>
</Enonce>
<Verification>

```python
assert expression([False, True, False, True]) == "(non a et b) ou (a et b)", "Exemple."
assert expression([False, False, False, True]) == "(a et b)", "Le ET."
assert expression([False, True, True, False]) == "(non a et b) ou (a et non b)", "Le OU exclusif."
assert expression([False] * 4) == "faux" and expression([True] * 4).count(" ou ") == 3, "Toujours faux, toujours vrai."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-4-4" label="4.4 [Difficile] - Masque de sous-réseau" type="python">
<Enonce>
### Masque de sous-réseau

Un masque de sous-réseau s'écrit en quatre nombres de 0 à 255 (`"255.255.255.0"`). Écrit en binaire sur 32 bits, un masque valide est une suite de `1` suivie d'une suite de `0` (`11…1100…00`).

Écrire une fonction `masque_valide(masque)`.

<Indices>
<Indice>

Convertir chaque nombre en 8 bits avec `format(n, "08b")`, puis coller les quatre morceaux.

</Indice>
<Indice>

Un masque est valide s'il ne contient jamais `"01"` : un 1 ne doit jamais suivre un 0.

</Indice>
<Indice>

Vérifier aussi qu'il y a exactement quatre nombres, chacun entre 0 et 255.

</Indice>
<Indice>

```text
FONCTION masque_valide(masque)
    parties ← masque découpé aux "."
    SI longueur(parties) ≠ 4 OU une partie n'est pas un nombre de 0 à 255 ALORS RENVOYER FAUX
    bits ← concaténation des parties écrites sur 8 bits
    RENVOYER "01" n'apparaît pas dans bits
```

</Indice>
</Indices>

<Correction>

```python
def masque_valide(masque: str) -> bool:
    parties = masque.split(".")
    if len(parties) != 4:
        return False
    bits = ""
    for p in parties:
        if not p.isdigit() or int(p) > 255:
            return False
        bits = bits + format(int(p), "08b")
    return "01" not in bits
```

</Correction>
</Enonce>
<Verification>

```python
for m in ["255.255.255.0", "255.255.0.0", "255.255.255.252", "0.0.0.0", "255.255.255.255", "255.128.0.0"]:
    assert masque_valide(m) is True, f"{m} est valide."
for m in ["255.0.255.0", "255.255.255.1", "256.0.0.0", "255.255.0", "255.255.a.0", "255.254.255.0"]:
    assert masque_valide(m) is False, f"{m} est invalide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-5-1" label="5.1 [Expert] - Table de vérité à n entrées" type="python">
<Enonce>
### Table de vérité à n entrées

Écrire une fonction `table_n(f, n)` qui reçoit une fonction booléenne `f` à `n` entrées et renvoie sa table de vérité : la liste des tuples `(e1, …, en, sortie)` pour les `2ⁿ` combinaisons d'entrées, dans l'ordre binaire (de `(False, …, False)` à `(True, …, True)`, la dernière entrée variant le plus vite).

<Indices>
<Indice>

La combinaison numéro `k` (de 0 à `2ⁿ - 1`) correspond à l'écriture binaire de `k` sur `n` bits : `format(k, "0" + str(n) + "b")`.

</Indice>
<Indice>

Transformer ces bits en tuple de booléens, puis appeler `f(*entrees)` : l'étoile passe les éléments du tuple comme paramètres séparés.

</Indice>
<Indice>

```text
FONCTION table_n(f, n)
    table ← liste vide
    POUR k ALLANT DE 0 À 2ⁿ - 1
        bits ← k écrit en binaire sur n chiffres
        entrees ← tuple des (bit = "1") pour chaque bit
        ajouter entrees + (f(entrees…),) à table
    RENVOYER table
```

</Indice>
</Indices>

<Correction>

```python
def table_n(f, n: int) -> list:
    table = []
    for k in range(2 ** n):
        bits = format(k, "0" + str(n) + "b") if n > 0 else ""
        entrees = tuple(bit == "1" for bit in bits)
        table.append(entrees + (f(*entrees),))
    return table
```

</Correction>
</Enonce>
<Verification>

```python
t = table_n(lambda a, b: a and b, 2)
assert t == [(False, False, False), (False, True, False), (True, False, False), (True, True, True)], "Table du ET."
t3 = table_n(lambda a, b, c: (a or b) and not c, 3)
assert len(t3) == 8 and t3[0] == (False, False, False, False) and t3[6] == (True, True, False, True), "Table à 3 entrées, dans l'ordre binaire."
assert len(table_n(lambda *x: True, 5)) == 32, "5 entrées : 32 lignes."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-5-2" label="5.2 [Expert] - Tautologie" type="python">
<Enonce>
### Tautologie

Une **tautologie** est une expression vraie pour toutes les valeurs de ses variables. Une expression **satisfiable** est vraie pour au moins une.

Écrire deux fonctions :
- `tautologie(f, n)` : `True` si la fonction `f` à `n` entrées est toujours vraie ;
- `satisfiable(f, n)` : `True` si elle est vraie au moins une fois.

<Indices>
<Indice>

Parcourir les `2ⁿ` combinaisons (comme pour la table de vérité à n entrées).

</Indice>
<Indice>

`tautologie` renvoie `False` au premier cas faux. `satisfiable` renvoie `True` au premier cas vrai.

</Indice>
<Indice>

```text
FONCTION combinaisons(n) : les 2ⁿ tuples de booléens
FONCTION tautologie(f, n)
    POUR CHAQUE e DE combinaisons(n) : SI NON f(e…) ALORS RENVOYER FAUX
    RENVOYER VRAI
FONCTION satisfiable(f, n)
    POUR CHAQUE e DE combinaisons(n) : SI f(e…) ALORS RENVOYER VRAI
    RENVOYER FAUX
```

</Indice>
</Indices>

<Correction>

```python
def combinaisons(n: int) -> list:
    resultat = []
    for k in range(2 ** n):
        resultat.append(tuple((k >> (n - 1 - i)) & 1 == 1 for i in range(n)))
    return resultat


def tautologie(f, n: int) -> bool:
    for e in combinaisons(n):
        if not f(*e):
            return False
    return True


def satisfiable(f, n: int) -> bool:
    for e in combinaisons(n):
        if f(*e):
            return True
    return False
```

</Correction>
</Enonce>
<Verification>

```python
assert tautologie(lambda a: a or not a, 1) is True, "a ou non a : tautologie."
assert tautologie(lambda a, b: (not a) or b or a, 2) is True, "Autre tautologie."
assert tautologie(lambda a, b: a or b, 2) is False, "a ou b n'en est pas une."
assert satisfiable(lambda a, b, c: a and not b and c, 3) is True, "Satisfiable pour (vrai, faux, vrai)."
assert satisfiable(lambda a, b: a and not a, 2) is False, "a et non a : jamais vraie."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-5-3" label="5.3 [Expert] - L'île des menteurs" type="python">
<Enonce>
### L'île des menteurs

Sur une île, chaque habitant est soit un **chevalier** (il dit toujours vrai), soit un **menteur** (il ment toujours). Trois habitants A, B et C font chacun une affirmation.

Une affirmation est représentée par une fonction qui reçoit `(a, b, c)` (`True` si l'habitant correspondant est chevalier) et renvoie la valeur de vérité de ce qui est affirmé.

Écrire une fonction `solutions(affirmations)` qui reçoit la liste des trois affirmations (celle de A, de B, de C) et renvoie la liste de tous les tuples `(a, b, c)` cohérents, dans l'ordre binaire.

Une situation est cohérente si chaque habitant dit vrai **exactement** quand il est chevalier.

<Indices>
<Indice>

Essayer les 8 situations possibles.

</Indice>
<Indice>

Pour l'habitant numéro `i`, la cohérence s'écrit `affirmations[i](a, b, c) == situation[i]`.

</Indice>
<Indice>

```text
FONCTION solutions(affirmations)
    resultat ← liste vide
    POUR CHAQUE (a, b, c) DES 8 combinaisons, dans l'ordre binaire
        SI pour chaque i : affirmations[i](a, b, c) = (a, b, c)[i] ALORS ajouter (a, b, c)
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def solutions(affirmations: list) -> list:
    resultat = []
    for a in (False, True):
        for b in (False, True):
            for c in (False, True):
                situation = (a, b, c)
                if all(affirmations[i](a, b, c) == situation[i] for i in range(3)):
                    resultat.append(situation)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
# A : « B est un menteur. » B : « A et C sont du même type. » C : « Je suis un chevalier. »
enigme = [lambda a, b, c: not b, lambda a, b, c: a == c, lambda a, b, c: c]
assert solutions(enigme) == [(False, True, False), (True, False, False)], "Deux situations cohérentes."
# A : « Nous sommes tous des menteurs. »
seul = [lambda a, b, c: not a and not b and not c, lambda a, b, c: b, lambda a, b, c: c]
assert (False, False, True) in solutions(seul) and all(s[0] is False for s in solutions(seul)), "A ne peut pas être chevalier."
assert solutions([lambda a, b, c: not a, lambda a, b, c: b, lambda a, b, c: c]) == [], "« Je suis un menteur » : aucune solution."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-5-4" label="5.4 [Expert] - Code de Hamming" type="python">
<Enonce>
### Code de Hamming

Le code de Hamming (7, 4) protège 4 bits de données `d1 d2 d3 d4` en ajoutant 3 bits de contrôle, calculés par des ou exclusifs :
- `p1 = d1 ⊕ d2 ⊕ d4`, `p2 = d1 ⊕ d3 ⊕ d4`, `p3 = d2 ⊕ d3 ⊕ d4`.

Le mot envoyé est `p1 p2 d1 p3 d2 d3 d4`.

Écrire :
- `coder(d)` : reçoit un texte de 4 bits et renvoie le mot de 7 bits ;
- `corriger(m)` : reçoit un mot de 7 bits dont **au plus un** bit a été inversé pendant la transmission, et renvoie les 4 bits de données corrigés.

Pour corriger : recalculer `c1 = m1 ⊕ m3 ⊕ m5 ⊕ m7`, `c2 = m2 ⊕ m3 ⊕ m6 ⊕ m7`, `c3 = m4 ⊕ m5 ⊕ m6 ⊕ m7` (positions numérotées de 1 à 7). Le nombre binaire `c3 c2 c1` donne la position du bit faux (0 si aucun).

<Indices>
<Indice>

Travailler avec des entiers 0 ou 1 : le ou exclusif de deux bits s'écrit `x ^ y` en Python, ou `(x + y) % 2`.

</Indice>
<Indice>

Dans `corriger`, transformer le mot en liste d'entiers avec un indice qui commence à 1 (une case vide en position 0 aide), inverser le bit fautif, puis extraire les positions 3, 5, 6 et 7.

</Indice>
<Indice>

```text
FONCTION coder(d)
    d1, d2, d3, d4 ← les 4 bits (entiers)
    p1 ← d1 ⊕ d2 ⊕ d4 ; p2 ← d1 ⊕ d3 ⊕ d4 ; p3 ← d2 ⊕ d3 ⊕ d4
    RENVOYER le texte p1 p2 d1 p3 d2 d3 d4
FONCTION corriger(m)
    m ← [rien] + bits de m (positions 1 à 7)
    c1 ← m1 ⊕ m3 ⊕ m5 ⊕ m7 ; c2 ← m2 ⊕ m3 ⊕ m6 ⊕ m7 ; c3 ← m4 ⊕ m5 ⊕ m6 ⊕ m7
    position ← 4 × c3 + 2 × c2 + c1
    SI position ≠ 0 ALORS inverser m[position]
    RENVOYER m3 m5 m6 m7
```

</Indice>
</Indices>

<Correction>

```python
def coder(d: str) -> str:
    d1, d2, d3, d4 = (int(x) for x in d)
    p1 = d1 ^ d2 ^ d4
    p2 = d1 ^ d3 ^ d4
    p3 = d2 ^ d3 ^ d4
    return "".join(str(x) for x in (p1, p2, d1, p3, d2, d3, d4))


def corriger(m: str) -> str:
    b = [0] + [int(x) for x in m]
    c1 = b[1] ^ b[3] ^ b[5] ^ b[7]
    c2 = b[2] ^ b[3] ^ b[6] ^ b[7]
    c3 = b[4] ^ b[5] ^ b[6] ^ b[7]
    position = 4 * c3 + 2 * c2 + c1
    if position != 0:
        b[position] = 1 - b[position]
    return "".join(str(b[i]) for i in (3, 5, 6, 7))
```

</Correction>
</Enonce>
<Verification>

```python
assert coder("1011") == "0110011" and coder("0000") == "0000000", "Codage de 1011 et 0000."
for d in ["0000", "1011", "1111", "0110", "1001"]:
    mot = coder(d)
    assert corriger(mot) == d, f"Sans erreur, {d} est retrouvé."
    for i in range(7):
        abime = mot[:i] + ("1" if mot[i] == "0" else "0") + mot[i + 1:]
        assert corriger(abime) == d, f"{d} est retrouvé même avec le bit {i + 1} inversé."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-6-1" label="6.1 [Mini-projet] - Unité de calcul 4 bits" type="python">
<Enonce>
### Unité de calcul 4 bits

**Contexte.** Au cœur d'un processeur se trouve l'unité arithmétique et logique (UAL), qui additionne, soustrait et combine des nombres binaires. Elle est faite de portes logiques, et une seule sorte de porte suffit : la porte NON-ET. Le projet reconstruit l'UAL d'un petit processeur 4 bits en n'utilisant **que la porte `nand`**, comme le ferait un fabricant de puces.

**Les données** : un nombre de 4 bits est une liste de 4 booléens, **bit de poids fort en premier** : `[False, True, True, False]` représente 6. Le code de départ fournit `nand`, ainsi que `vers_bits` et `vers_entier` pour passer des entiers aux listes de bits pendant les tests.

**Les composants à construire** (toutes ces fonctions, sauf `ual`, n'utilisent que `nand` et les fonctions déjà écrites : aucun `and`, `or`, `not`, `if`, `==` ni `!=`)
- `non(a)`, `et(a, b)`, `ou(a, b)`, `oux(a, b)` : les portes de base, construites à partir de `nand`. Chacune reçoit des booléens et renvoie la sortie de la porte.
- `additionneur(a, b, r)` : additionne deux bits et une retenue venue du bit précédent. Renvoie le tuple `(somme, retenue)`.
- `additionner(x, y)` : l'additionneur 4 bits du processeur. Reçoit deux nombres de 4 bits et renvoie le tuple `(resultat, retenue_finale)`, le résultat sur 4 bits et la retenue indiquant un dépassement (par exemple 9 + 7).
- `oppose(x)` : prépare la soustraction. Renvoie le complément à deux de `x` (tous les bits inversés, puis 1 ajouté), qui représente `-x` sur 4 bits.
- `soustraire(x, y)` : renvoie `x - y` sur 4 bits, calculé comme `x + oppose(y)`.
- `est_nul(x)` : alimente le drapeau « zéro » du processeur. Renvoie `True` si les 4 bits valent `False`.
- `ual(op, x, y)` : l'unité complète, appelée par le processeur à chaque instruction. Selon `op` (`"ADD"`, `"SUB"`, `"AND"`, `"OR"`, `"XOR"`), renvoie le tuple `(resultat, zero, retenue)` : le résultat sur 4 bits, `zero` qui dit s'il est nul, et `retenue` la retenue finale (`False` pour les opérations logiques, qui travaillent bit à bit). Seule cette fonction a le droit d'utiliser `if` et `==` pour choisir l'opération.

<Indices>
<Indice>

Construire du plus simple au plus complexe : `non(a)` est `nand(a, a)`, puis `et`, `ou`, `oux` (4 portes), puis l'additionneur d'un bit, puis celui de 4 bits.

</Indice>
<Indice>

L'addition de 4 bits enchaîne 4 additionneurs du bit de poids faible (indice 3) au bit de poids fort (indice 0), la retenue passant de l'un à l'autre.

</Indice>
<Indice>

`oppose` ajoute 1 : c'est `additionner(inverse, [False, False, False, True])`.

</Indice>
<Indice>

```text
(cœur du programme : l'addition de deux nombres de 4 bits)
FONCTION additionner(x, y)
    resultat ← [FAUX, FAUX, FAUX, FAUX] ; r ← FAUX
    POUR i ALLANT DE 3 À 0 (en descendant)
        (resultat[i], r) ← additionneur(x[i], y[i], r)
    RENVOYER (resultat, r)
```

</Indice>
</Indices>

<Correction>

```python
def nand(a: bool, b: bool) -> bool:
    return not (a and b)


def vers_bits(n: int) -> list:
    """Entier de 0 à 15 vers 4 booléens, bit de poids fort en premier : 6 donne [False, True, True, False]."""
    return [(n >> i) & 1 == 1 for i in (3, 2, 1, 0)]


def vers_entier(bits: list) -> int:
    return sum(2 ** (3 - i) for i in range(4) if bits[i])


def non(a: bool) -> bool:
    return nand(a, a)


def et(a: bool, b: bool) -> bool:
    return non(nand(a, b))


def ou(a: bool, b: bool) -> bool:
    return nand(non(a), non(b))


def oux(a: bool, b: bool) -> bool:
    m = nand(a, b)
    return nand(nand(a, m), nand(b, m))


def additionneur(a: bool, b: bool, r: bool) -> tuple:
    s1 = oux(a, b)
    return (oux(s1, r), ou(et(a, b), et(s1, r)))


def additionner(x: list, y: list) -> tuple:
    resultat = [False, False, False, False]
    r = False
    for i in (3, 2, 1, 0):
        resultat[i], r = additionneur(x[i], y[i], r)
    return (resultat, r)


def oppose(x: list) -> list:
    return additionner([non(b) for b in x], [False, False, False, True])[0]


def soustraire(x: list, y: list) -> list:
    return additionner(x, oppose(y))[0]


def est_nul(x: list) -> bool:
    return non(ou(ou(x[0], x[1]), ou(x[2], x[3])))


def ual(op: str, x: list, y: list) -> tuple:
    retenue = False
    if op == "ADD":
        resultat, retenue = additionner(x, y)
    elif op == "SUB":
        resultat = soustraire(x, y)
    elif op == "AND":
        resultat = [et(a, b) for a, b in zip(x, y)]
    elif op == "OR":
        resultat = [ou(a, b) for a, b in zip(x, y)]
    else:
        resultat = [oux(a, b) for a, b in zip(x, y)]
    return (resultat, est_nul(resultat), retenue)
```

</Correction>
</Enonce>
<CodeDepart>

```python
def nand(a: bool, b: bool) -> bool:
    return not (a and b)


def vers_bits(n: int) -> list:
    """Entier de 0 à 15 vers 4 booléens, bit de poids fort en premier : 6 donne [False, True, True, False]."""
    return [(n >> i) & 1 == 1 for i in (3, 2, 1, 0)]


def vers_entier(bits: list) -> int:
    return sum(2 ** (3 - i) for i in range(4) if bits[i])
```

</CodeDepart>
<Verification>

```python
from itertools import product
for a, b, r in product([False, True], repeat=3):
    assert non(a) == (not a) and et(a, b) == (a and b) and ou(a, b) == (a or b) and oux(a, b) == (a != b), "Portes logiques."
    assert additionneur(a, b, r) == ((a + b + r) % 2 == 1, a + b + r >= 2), f"Additionneur pour {a}, {b}, {r}."
for x in range(16):
    for y in range(16):
        res, ret = additionner(vers_bits(x), vers_bits(y))
        assert vers_entier(res) == (x + y) % 16 and ret == (x + y >= 16), f"{x} + {y} sur 4 bits."
        assert vers_entier(soustraire(vers_bits(x), vers_bits(y))) == (x - y) % 16, f"{x} - {y} sur 4 bits."
assert vers_entier(oppose(vers_bits(3))) == 13 and vers_entier(oppose(vers_bits(0))) == 0, "Complément à deux : -3 s'écrit 1101."
assert est_nul(vers_bits(0)) and not est_nul(vers_bits(8)), "Test de nullité."
assert ual("ADD", vers_bits(9), vers_bits(7)) == (vers_bits(0), True, True), "9 + 7 : dépassement, résultat nul."
assert ual("SUB", vers_bits(5), vers_bits(5)) == (vers_bits(0), True, False) and ual("SUB", vers_bits(5), vers_bits(2))[0] == vers_bits(3), "Soustractions."
assert ual("AND", vers_bits(12), vers_bits(10)) == (vers_bits(8), False, False) and ual("OR", vers_bits(12), vers_bits(10))[0] == vers_bits(14), "Opérations bit à bit."
assert ual("XOR", vers_bits(12), vers_bits(12)) == (vers_bits(0), True, False), "XOR d'un nombre avec lui-même."
import ast
arbre = ast.parse(PROGRAMME)
for f in arbre.body:
    if isinstance(f, ast.FunctionDef) and f.name not in ("nand", "vers_bits", "vers_entier", "ual"):
        interdits = [n for n in ast.walk(f) if isinstance(n, (ast.BoolOp, ast.If, ast.IfExp, ast.Compare)) or (isinstance(n, ast.UnaryOp) and isinstance(n.op, ast.Not))]
        assert not interdits, f"{f.name} n'utilise que nand et les fonctions déjà écrites."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-bool-6-2" label="6.2 [Mini-projet] - Évaluateur logique" type="python">
<Enonce>
### Évaluateur logique

**Contexte.** En cours de logique, les élèves passent du temps à remplir des tables de vérité et à vérifier des égalités comme les lois de De Morgan. Le projet est un petit calculateur de logique : il lit des expressions écrites en français, les évalue, dresse leur table de vérité, compare deux expressions et produit leur forme normale. Les élèves pourront ainsi vérifier leurs exercices.

**Les données** : une expression utilise des variables (une lettre minuscule), les opérateurs `non`, `et`, `ou` et des parenthèses, par exemple `"(a et non b) ou c"`. Comme en Python, `non` est prioritaire sur `et`, lui-même prioritaire sur `ou` : `a ou b et c` se lit `a ou (b et c)`. Les valeurs des variables sont données par un dictionnaire, par exemple `{"a": True, "b": False, "c": False}`.

**Les fonctions du calculateur**
- `jetons(expr)` : découpe l'expression en éléments, première étape de la lecture. Renvoie la liste des éléments (`"(a et non b)"` donne `["(", "a", "et", "non", "b", ")"]`). Les parenthèses peuvent être collées aux variables dans le texte.
- `variables(expr)` : les variables de l'expression, qui donnent les colonnes de la table. Renvoie leur liste triée, sans doublon.
- `evaluer(expr, valeurs)` : calcule la valeur de l'expression pour des valeurs données des variables. Renvoie un booléen. **Sans `eval`.**
- `table(expr)` : la table de vérité. Renvoie la liste des tuples `(valeur de chaque variable…, resultat)`, dans l'ordre binaire (variables dans l'ordre alphabétique, la dernière variant le plus vite).
- `equivalentes(e1, e2)` : vérifie une égalité logique, comme une loi de De Morgan. Renvoie `True` si les deux expressions ont toujours la même valeur (sur l'ensemble de leurs variables).
- `tautologie(expr)` : renvoie `True` si l'expression est toujours vraie.
- `forme_normale(expr)` : réécrit l'expression sous une forme standard, la forme normale disjonctive : un `ou` de parenthèses, une par ligne vraie de la table, chacune un `et` de toutes les variables (précédées de `non` si elles sont fausses), par exemple `"(non a et b) ou (a et non b)"`. Si l'expression n'est jamais vraie, la fonction renvoie `"faux"`.

<Indices>
<Indice>

Pour les jetons, entourer chaque parenthèse d'espaces (`replace`) avant de découper.

</Indice>
<Indice>

L'évaluation se fait par **descente récursive** : une fonction lit un « ou » de termes, chaque terme est un « et » de facteurs, chaque facteur est `non facteur`, une parenthèse ou une variable. Chaque fonction avance dans la liste des jetons grâce à une position partagée.

</Indice>
<Indice>

`table`, `equivalentes`, `tautologie` et `forme_normale` reposent toutes sur le parcours des `2ⁿ` combinaisons de valeurs.

</Indice>
<Indice>

```text
(cœur du programme : la descente récursive, pos est la position courante dans les jetons)
FONCTION lire_ou()
    v ← lire_et()
    TANT QUE jeton courant = "ou" : avancer ; v ← lire_et() OU v        (lire d'abord, pour tout consommer)
    RENVOYER v
FONCTION lire_et()
    v ← lire_facteur()
    TANT QUE jeton courant = "et" : avancer ; v ← lire_facteur() ET v
    RENVOYER v
FONCTION lire_facteur()
    SI jeton courant = "non" ALORS avancer ; RENVOYER NON lire_facteur()
    SI jeton courant = "(" ALORS avancer ; v ← lire_ou() ; avancer (sur ")") ; RENVOYER v
    v ← valeurs[jeton courant] ; avancer ; RENVOYER v
```

</Indice>
</Indices>

<Correction>

```python
def jetons(expr: str) -> list:
    return expr.replace("(", " ( ").replace(")", " ) ").split()


def variables(expr: str) -> list:
    return sorted({j for j in jetons(expr) if j not in ("(", ")", "et", "ou", "non")})


def evaluer(expr: str, valeurs: dict) -> bool:
    t = jetons(expr)
    pos = [0]

    def courant():
        return t[pos[0]] if pos[0] < len(t) else None

    def lire_ou():
        v = lire_et()
        while courant() == "ou":
            pos[0] += 1
            v = lire_et() or v
        return v

    def lire_et():
        v = lire_facteur()
        while courant() == "et":
            pos[0] += 1
            v = lire_facteur() and v
        return v

    def lire_facteur():
        j = courant()
        pos[0] += 1
        if j == "non":
            return not lire_facteur()
        if j == "(":
            v = lire_ou()
            pos[0] += 1
            return v
        return valeurs[j]

    return lire_ou()


def combinaisons(noms: list) -> list:
    n = len(noms)
    return [tuple((k >> (n - 1 - i)) & 1 == 1 for i in range(n)) for k in range(2 ** n)]


def table(expr: str) -> list:
    noms = variables(expr)
    return [c + (evaluer(expr, dict(zip(noms, c))),) for c in combinaisons(noms)]


def equivalentes(e1: str, e2: str) -> bool:
    noms = sorted(set(variables(e1)) | set(variables(e2)))
    return all(evaluer(e1, dict(zip(noms, c))) == evaluer(e2, dict(zip(noms, c))) for c in combinaisons(noms))


def tautologie(expr: str) -> bool:
    return all(ligne[-1] for ligne in table(expr))


def forme_normale(expr: str) -> str:
    noms = variables(expr)
    morceaux = []
    for ligne in table(expr):
        if ligne[-1]:
            termes = [nom if v else "non " + nom for nom, v in zip(noms, ligne[:-1])]
            morceaux.append("(" + " et ".join(termes) + ")")
    return " ou ".join(morceaux) if morceaux else "faux"
```

</Correction>
</Enonce>
<Verification>

```python
assert jetons("(a et non b)") == ["(", "a", "et", "non", "b", ")"] and jetons("a ou(b)") == ["a", "ou", "(", "b", ")"], "Jetons."
assert variables("(c et non a) ou c ou b") == ["a", "b", "c"], "Variables."
assert evaluer("a ou b et c", {"a": True, "b": False, "c": False}) is True and evaluer("(a ou b) et c", {"a": True, "b": False, "c": False}) is False, "Priorité de et sur ou."
assert evaluer("non a et b", {"a": False, "b": True}) is True and evaluer("non (a et b)", {"a": True, "b": True}) is False, "Priorité de non."
assert evaluer("non non a", {"a": True}) is True and evaluer("((a))", {"a": False}) is False, "Double négation ; parenthèses imbriquées."
assert evaluer("a et b et c ou non a", {"a": False, "b": False, "c": False}) is True, "Enchaînements."
assert table("a et b") == [(False, False, False), (False, True, False), (True, False, False), (True, True, True)], "Table du et."
assert len(table("a ou b ou c")) == 8 and table("non x") == [(False, True), (True, False)], "Autres tables."
assert equivalentes("non (a et b)", "non a ou non b") and equivalentes("non (a ou b)", "non a et non b"), "Lois de De Morgan."
assert not equivalentes("non (a et b)", "non a et non b") and equivalentes("a ou (a et b)", "a"), "Fausse loi ; absorption (variables différentes)."
assert tautologie("a ou non a") and not tautologie("a ou b") and tautologie("(a et b) ou non a ou non b"), "Tautologies."
assert forme_normale("a ou b") == "(non a et b) ou (a et non b) ou (a et b)" and forme_normale("a et non a") == "faux", "Formes normales."
assert equivalentes(forme_normale("(a et non b) ou c"), "(a et non b) ou c"), "La forme normale est équivalente à l'expression."
assert "eval(" not in PROGRAMME.replace("evaluer(", ""), "Sans eval."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
