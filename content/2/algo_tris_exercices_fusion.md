---
title: 'Exercices : Tri et Fusion'
description: 'Cours sur Exercices : Tri et Fusion'
level: premiere
chapter: Algorithmique
icon: "shuffle"
badgeId: premiere_fiche_exercices_tri_fusion
prerequisites:
  - python_csv_exercices
audience: public
groupe: algorithmes-de-tri
groupeTitre: "Algorithmes de tri"
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="tri-fusion" courseTitle="Tri et Fusion de Données">

<ExerciseSection id="1nsi-tris-1-1" label="1.1 [Introduction] - Échanger deux cases" type="python">
<Enonce>
### Échanger deux cases

Écrire une fonction `echanger(t, i, j)` qui échange les éléments d'indices `i` et `j` de la liste `t`, **sur place** (la fonction ne renvoie rien).

C'est l'opération de base de nombreux tris.

<Indices>
<Indice>

`t[i] = t[j]` écrase l'ancienne valeur de `t[i]` : la mettre de côté avant, dans une variable.

</Indice>
<Indice>

Python permet aussi l'échange en une ligne : `t[i], t[j] = t[j], t[i]`.

</Indice>
<Indice>

```text
FONCTION echanger(t, i, j)
    temp ← t[i]
    t[i] ← t[j]
    t[j] ← temp
```

</Indice>
</Indices>

<Correction>

```python
def echanger(t: list, i: int, j: int) -> None:
    t[i], t[j] = t[j], t[i]
```

</Correction>
</Enonce>
<Verification>

```python
t = [5, 8, 1]
assert echanger(t, 0, 2) is None and t == [1, 8, 5], "Échange des cases 0 et 2."
echanger(t, 1, 1)
assert t == [1, 8, 5], "Échanger une case avec elle-même ne change rien."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-1-2" label="1.2 [Introduction] - Minimum à partir d'un indice" type="python">
<Enonce>
### Minimum à partir d'un indice

Écrire une fonction `indice_min_depuis(t, debut)` qui renvoie l'indice du plus petit élément de `t` parmi ceux d'indice `debut` ou plus (le premier en cas d'égalité).

C'est la brique du tri par sélection.

<Indices>
<Indice>

Même principe qu'une recherche d'indice du minimum, mais la boucle commence à `debut`.

</Indice>
<Indice>

L'indice provisoire du minimum part de `debut`.

</Indice>
<Indice>

```text
FONCTION indice_min_depuis(t, debut)
    i_min ← debut
    POUR i ALLANT DE debut + 1 À longueur(t) - 1
        SI t[i] < t[i_min] ALORS i_min ← i
    RENVOYER i_min
```

</Indice>
</Indices>

<Correction>

```python
def indice_min_depuis(t: list, debut: int) -> int:
    i_min = debut
    for i in range(debut + 1, len(t)):
        if t[i] < t[i_min]:
            i_min = i
    return i_min
```

</Correction>
</Enonce>
<Verification>

```python
t = [4, 1, 7, 3, 9, 3]
assert indice_min_depuis(t, 0) == 1, "Depuis 0 : indice 1 (valeur 1)."
assert indice_min_depuis(t, 2) == 3, "Depuis 2 : indice 3 (premier 3)."
assert indice_min_depuis(t, 5) == 5, "Depuis le dernier indice : lui-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-1-3" label="1.3 [Introduction] - Désordres voisins" type="python">
<Enonce>
### Désordres voisins

Écrire une fonction `nb_desordres(t)` qui renvoie le nombre de paires de cases **voisines** mal rangées, c'est-à-dire d'indices `i` tels que `t[i] > t[i + 1]`.

Une liste triée dans l'ordre croissant n'en a aucune.

<Indices>
<Indice>

Parcourir `i` de 0 à `len(t) - 2` et comparer `t[i]` à `t[i + 1]`.

</Indice>
<Indice>

Un compteur augmente à chaque paire mal rangée.

</Indice>
<Indice>

```text
FONCTION nb_desordres(t)
    n ← 0
    POUR i ALLANT DE 0 À longueur(t) - 2
        SI t[i] > t[i + 1] ALORS n ← n + 1
    RENVOYER n
```

</Indice>
</Indices>

<Correction>

```python
def nb_desordres(t: list) -> int:
    n = 0
    for i in range(len(t) - 1):
        if t[i] > t[i + 1]:
            n = n + 1
    return n
```

</Correction>
</Enonce>
<Verification>

```python
assert nb_desordres([1, 2, 3]) == 0 and nb_desordres([]) == 0, "Liste triée ou vide : 0."
assert nb_desordres([3, 2, 1]) == 2, "[3, 2, 1] : 2 paires."
assert nb_desordres([1, 5, 2, 6, 3]) == 2, "[1, 5, 2, 6, 3] : 2 paires."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-1-4" label="1.4 [Introduction] - Un passage de bulles" type="python">
<Enonce>
### Un passage de bulles

Un **passage** du tri à bulles parcourt la liste de gauche à droite et échange chaque paire de voisins mal rangés. Le plus grand élément se retrouve alors à la fin.

Écrire une fonction `passage(t)` qui effectue un passage sur place et renvoie le nombre d'échanges réalisés.

<Indices>
<Indice>

Même parcours que pour compter les désordres, mais en échangeant aussitôt une paire mal rangée.

</Indice>
<Indice>

Après l'échange, la comparaison suivante porte sur le grand élément qui vient d'avancer d'une case.

</Indice>
<Indice>

```text
FONCTION passage(t)
    echanges ← 0
    POUR i ALLANT DE 0 À longueur(t) - 2
        SI t[i] > t[i + 1] ALORS échanger t[i] et t[i + 1] ; echanges ← echanges + 1
    RENVOYER echanges
```

</Indice>
</Indices>

<Correction>

```python
def passage(t: list) -> int:
    echanges = 0
    for i in range(len(t) - 1):
        if t[i] > t[i + 1]:
            t[i], t[i + 1] = t[i + 1], t[i]
            echanges = echanges + 1
    return echanges
```

</Correction>
</Enonce>
<Verification>

```python
t = [5, 1, 4, 2, 8]
assert passage(t) == 3 and t == [1, 4, 2, 5, 8], "Un passage sur [5, 1, 4, 2, 8]."
assert passage(t) == 1 and t == [1, 2, 4, 5, 8], "Un second passage."
assert passage(t) == 0, "Liste triée : aucun échange."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-2-1" label="2.1 [Facile] - Tri par sélection" type="python">
<Enonce>
### Tri par sélection

Le tri par sélection cherche le plus petit élément et le place en première position, puis le plus petit des restants en deuxième position, et ainsi de suite.

Écrire une fonction `tri_selection(t)` qui trie la liste `t` sur place, dans l'ordre croissant.

<Indices>
<Indice>

Pour chaque position `i` de 0 à la fin, trouver l'indice du minimum à partir de `i`.

</Indice>
<Indice>

Échanger ensuite ce minimum avec la case `i`.

</Indice>
<Indice>

```text
FONCTION tri_selection(t)
    POUR i ALLANT DE 0 À longueur(t) - 1
        i_min ← indice du minimum de t à partir de i
        échanger t[i] et t[i_min]
```

</Indice>
</Indices>

<Correction>

```python
def tri_selection(t: list) -> None:
    for i in range(len(t)):
        i_min = i
        for j in range(i + 1, len(t)):
            if t[j] < t[i_min]:
                i_min = j
        t[i], t[i_min] = t[i_min], t[i]
```

</Correction>
</Enonce>
<Verification>

```python
import random
for t in [[5, 2, 9, 1, 5, 6], [], [1], [3, 2, 1], ["poire", "abricot", "kiwi"]]:
    attendu = sorted(t)
    tri_selection(t)
    assert t == attendu, f"Trier sur place donne {attendu}."
t = [random.randint(-100, 100) for _ in range(300)]
attendu = sorted(t)
tri_selection(t)
assert t == attendu, "Une liste aléatoire de 300 nombres."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted : le tri est à écrire."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-2-2" label="2.2 [Facile] - Insérer dans une liste triée" type="python">
<Enonce>
### Insérer dans une liste triée

Écrire une fonction `inserer(t, x)` qui insère `x` à sa place dans la liste **déjà triée** `t`, sur place, pour qu'elle reste triée.

Contrainte : sans `insert`, `sort` ni `sorted`. Ajouter `x` à la fin puis le faire reculer.

<Indices>
<Indice>

Après `t.append(x)`, `x` est en dernière position. Tant que l'élément à sa gauche est plus grand, les échanger.

</Indice>
<Indice>

Une boucle `while` avec un indice `i` qui part de la fin et diminue, sans descendre sous 0.

</Indice>
<Indice>

```text
FONCTION inserer(t, x)
    ajouter x à la fin de t
    i ← longueur(t) - 1
    TANT QUE i > 0 ET t[i - 1] > t[i]
        échanger t[i - 1] et t[i]
        i ← i - 1
```

</Indice>
</Indices>

<Correction>

```python
def inserer(t: list, x) -> None:
    t.append(x)
    i = len(t) - 1
    while i > 0 and t[i - 1] > t[i]:
        t[i - 1], t[i] = t[i], t[i - 1]
        i = i - 1
```

</Correction>
</Enonce>
<Verification>

```python
t = [1, 3, 7, 9]
inserer(t, 5)
assert t == [1, 3, 5, 7, 9], "5 au milieu."
inserer(t, 0)
inserer(t, 10)
assert t == [0, 1, 3, 5, 7, 9, 10], "Au début et à la fin."
t = []
inserer(t, 4)
assert t == [4], "Dans une liste vide."
assert "insert(" not in PROGRAMME, "Sans insert."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted : le tri est à écrire."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-2-3" label="2.3 [Facile] - Tri par insertion" type="python">
<Enonce>
### Tri par insertion

Le tri par insertion parcourt la liste et insère chaque élément à sa place parmi ceux qui le précèdent (déjà triés), comme on range des cartes dans sa main.

Écrire une fonction `tri_insertion(t)` qui trie `t` sur place.

<Indices>
<Indice>

Pour `i` de 1 à la fin : la partie `t[0:i]` est déjà triée, et `t[i]` doit y trouver sa place.

</Indice>
<Indice>

Faire reculer `t[i]` par échanges tant que son voisin de gauche est plus grand, comme pour l'insertion dans une liste triée.

</Indice>
<Indice>

```text
FONCTION tri_insertion(t)
    POUR i ALLANT DE 1 À longueur(t) - 1
        j ← i
        TANT QUE j > 0 ET t[j - 1] > t[j]
            échanger t[j - 1] et t[j]
            j ← j - 1
```

</Indice>
</Indices>

<Correction>

```python
def tri_insertion(t: list) -> None:
    for i in range(1, len(t)):
        j = i
        while j > 0 and t[j - 1] > t[j]:
            t[j - 1], t[j] = t[j], t[j - 1]
            j = j - 1
```

</Correction>
</Enonce>
<Verification>

```python
import random
for t in [[5, 2, 9, 1, 5, 6], [], [7], [1, 2, 3], [3, 2, 1]]:
    attendu = sorted(t)
    tri_insertion(t)
    assert t == attendu, f"Trier sur place donne {attendu}."
t = [random.randint(-100, 100) for _ in range(300)]
attendu = sorted(t)
tri_insertion(t)
assert t == attendu, "Une liste aléatoire de 300 nombres."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted : le tri est à écrire."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-2-4" label="2.4 [Facile] - Fusion de deux listes triées" type="python">
<Enonce>
### Fusion de deux listes triées

Écrire une fonction `fusion(a, b)` qui reçoit deux listes triées et renvoie une **nouvelle** liste triée contenant tous leurs éléments.

Contrainte : un seul parcours de chaque liste, sans trier.

<Indices>
<Indice>

Deux indices, `i` dans `a` et `j` dans `b`. À chaque étape, le plus petit de `a[i]` et `b[j]` part dans le résultat, et son indice avance.

</Indice>
<Indice>

Quand une liste est épuisée, recopier la fin de l'autre.

</Indice>
<Indice>

```text
FONCTION fusion(a, b)
    resultat ← liste vide ; i ← 0 ; j ← 0
    TANT QUE i < longueur(a) ET j < longueur(b)
        SI a[i] ≤ b[j] ALORS ajouter a[i] ; i ← i + 1
        SINON ajouter b[j] ; j ← j + 1
    ajouter a[i:] puis b[j:] à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def fusion(a: list, b: list) -> list:
    resultat = []
    i = 0
    j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultat.append(a[i])
            i = i + 1
        else:
            resultat.append(b[j])
            j = j + 1
    return resultat + a[i:] + b[j:]
```

</Correction>
</Enonce>
<Verification>

```python
assert fusion([1, 4, 9], [2, 3, 10, 12]) == [1, 2, 3, 4, 9, 10, 12], "Fusion de deux listes."
assert fusion([], [1, 2]) == [1, 2] and fusion([3], []) == [3], "Avec une liste vide."
assert fusion([1, 1], [1]) == [1, 1, 1], "Valeurs égales."
a = [1, 5]
fusion(a, [2])
assert a == [1, 5], "Les listes reçues ne sont pas modifiées."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted : le tri est à écrire."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-3-1" label="3.1 [Moyen] - Tri à bulles optimisé" type="python">
<Enonce>
### Tri à bulles optimisé

Le tri à bulles répète des passages jusqu'à ce que la liste soit triée. Un passage sans aucun échange prouve que la liste est triée : il est alors inutile de continuer.

Écrire une fonction `tri_bulles(t)` qui trie `t` sur place et renvoie le **nombre de passages** effectués (le dernier passage, sans échange, compte).

<Indices>
<Indice>

Une boucle `while` répète les passages tant que le passage précédent a fait au moins un échange.

</Indice>
<Indice>

Un booléen `echange` passe à `True` dès qu'un échange a lieu pendant le passage.

</Indice>
<Indice>

```text
FONCTION tri_bulles(t)
    passages ← 0 ; echange ← VRAI
    TANT QUE echange
        echange ← FAUX ; passages ← passages + 1
        POUR i ALLANT DE 0 À longueur(t) - 2
            SI t[i] > t[i + 1] ALORS échanger ; echange ← VRAI
    RENVOYER passages
```

</Indice>
</Indices>

<Correction>

```python
def tri_bulles(t: list) -> int:
    passages = 0
    echange = True
    while echange:
        echange = False
        passages = passages + 1
        for i in range(len(t) - 1):
            if t[i] > t[i + 1]:
                t[i], t[i + 1] = t[i + 1], t[i]
                echange = True
    return passages
```

</Correction>
</Enonce>
<Verification>

```python
t = [1, 2, 3, 4]
assert tri_bulles(t) == 1 and t == [1, 2, 3, 4], "Déjà triée : un seul passage."
t = [2, 1, 3, 4]
assert tri_bulles(t) == 2 and t == [1, 2, 3, 4], "Un seul désordre : deux passages."
t = [4, 3, 2, 1]
assert tri_bulles(t) == 4 and t == [1, 2, 3, 4], "Ordre inverse : quatre passages."
t = []
assert tri_bulles(t) == 1, "Liste vide : un passage sans échange."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted : le tri est à écrire."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-3-2" label="3.2 [Moyen] - Trier des élèves par âge" type="python">
<Enonce>
### Trier des élèves par âge

`eleves` est une liste de tuples `(prenom, age)`. Écrire une fonction `trier_par_age(eleves)` qui la trie sur place par âge croissant.

Le tri doit être **stable** : deux élèves du même âge gardent leur ordre de départ.

Contrainte : adapter le tri par insertion, sans `sort` ni `sorted`.

<Indices>
<Indice>

Le tri par insertion est stable s'il ne fait reculer un élément que devant un élément **strictement** plus grand.

</Indice>
<Indice>

Comparer les âges, c'est-à-dire `t[j - 1][1]` et `t[j][1]`, et non les tuples entiers (qui compareraient d'abord les prénoms).

</Indice>
<Indice>

```text
FONCTION trier_par_age(eleves)
    POUR i ALLANT DE 1 À longueur(eleves) - 1
        j ← i
        TANT QUE j > 0 ET âge de eleves[j - 1] > âge de eleves[j]
            échanger eleves[j - 1] et eleves[j] ; j ← j - 1
```

</Indice>
</Indices>

<Correction>

```python
def trier_par_age(eleves: list) -> None:
    for i in range(1, len(eleves)):
        j = i
        while j > 0 and eleves[j - 1][1] > eleves[j][1]:
            eleves[j - 1], eleves[j] = eleves[j], eleves[j - 1]
            j = j - 1
```

</Correction>
</Enonce>
<Verification>

```python
e = [("Zoé", 16), ("Ali", 15), ("Tom", 16), ("Bea", 15), ("Léo", 17)]
trier_par_age(e)
assert e == [("Ali", 15), ("Bea", 15), ("Zoé", 16), ("Tom", 16), ("Léo", 17)], "Par âge, Zoé reste avant Tom (stable)."
e = [("B", 1), ("A", 1)]
trier_par_age(e)
assert e == [("B", 1), ("A", 1)], "Même âge : l'ordre de départ est gardé."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted : le tri est à écrire."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-3-3" label="3.3 [Moyen] - Fusion sans doublons" type="python">
<Enonce>
### Fusion sans doublons

Écrire une fonction `union(a, b)` qui reçoit deux listes triées **sans doublons** et renvoie leur union triée, sans doublons.

Exemple : `union([1, 3, 5], [3, 4, 5, 8])` renvoie `[1, 3, 4, 5, 8]`.

Contrainte : en un seul parcours, comme une fusion.

<Indices>
<Indice>

Même schéma que la fusion, avec un troisième cas : `a[i] == b[j]`. On ajoute alors la valeur une seule fois et les **deux** indices avancent.

</Indice>
<Indice>

Les fins de listes se recopient telles quelles, puisqu'elles sont sans doublons.

</Indice>
<Indice>

```text
FONCTION union(a, b)
    resultat ← liste vide ; i ← 0 ; j ← 0
    TANT QUE i < longueur(a) ET j < longueur(b)
        SI a[i] < b[j] ALORS ajouter a[i] ; i ← i + 1
        SINON SI a[i] > b[j] ALORS ajouter b[j] ; j ← j + 1
        SINON ajouter a[i] ; i ← i + 1 ; j ← j + 1
    RENVOYER resultat + a[i:] + b[j:]
```

</Indice>
</Indices>

<Correction>

```python
def union(a: list, b: list) -> list:
    resultat = []
    i = 0
    j = 0
    while i < len(a) and j < len(b):
        if a[i] < b[j]:
            resultat.append(a[i])
            i = i + 1
        elif a[i] > b[j]:
            resultat.append(b[j])
            j = j + 1
        else:
            resultat.append(a[i])
            i = i + 1
            j = j + 1
    return resultat + a[i:] + b[j:]
```

</Correction>
</Enonce>
<Verification>

```python
assert union([1, 3, 5], [3, 4, 5, 8]) == [1, 3, 4, 5, 8], "Exemple."
assert union([], [2]) == [2] and union([1, 2], [1, 2]) == [1, 2], "Liste vide, puis listes identiques."
assert union([10], [1, 20]) == [1, 10, 20], "Entrelacement."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted : le tri est à écrire."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-3-4" label="3.4 [Moyen] - Compter les comparaisons" type="python">
<Enonce>
### Compter les comparaisons

Le coût d'un tri se mesure en nombre de **comparaisons** entre éléments.

Écrire une fonction `comparaisons_insertion(t)` qui trie une **copie** de `t` par insertion et renvoie le nombre de comparaisons `t[j - 1] > t[j]` effectuées.

Pour une liste de `n` éléments déjà triée, le tri par insertion n'en fait que `n - 1`. Dans l'ordre inverse, il en fait `n(n - 1) / 2`.

<Indices>
<Indice>

`copie = list(t)` évite de modifier la liste reçue.

</Indice>
<Indice>

Pour compter chaque comparaison, y compris celle qui arrête la boucle, sortir le test de la condition du `while` : `while j > 0:` puis, dans la boucle, compter, comparer, et `break` si l'élément est à sa place.

</Indice>
<Indice>

```text
FONCTION comparaisons_insertion(t)
    c ← copie de t ; n ← 0
    POUR i ALLANT DE 1 À longueur(c) - 1
        j ← i
        TANT QUE j > 0
            n ← n + 1
            SI c[j - 1] > c[j] ALORS échanger ; j ← j - 1
            SINON sortir de la boucle
    RENVOYER n
```

</Indice>
</Indices>

<Correction>

```python
def comparaisons_insertion(t: list) -> int:
    c = list(t)
    n = 0
    for i in range(1, len(c)):
        j = i
        while j > 0:
            n = n + 1
            if c[j - 1] > c[j]:
                c[j - 1], c[j] = c[j], c[j - 1]
                j = j - 1
            else:
                break
    return n
```

</Correction>
</Enonce>
<Verification>

```python
assert comparaisons_insertion([1, 2, 3, 4, 5]) == 4, "Déjà triée : n - 1 = 4."
assert comparaisons_insertion([5, 4, 3, 2, 1]) == 10, "Ordre inverse : 5 × 4 / 2 = 10."
assert comparaisons_insertion([2, 1, 3]) == 2 and comparaisons_insertion([]) == 0, "Autres cas."
t = [3, 1, 2]
comparaisons_insertion(t)
assert t == [3, 1, 2], "La liste reçue n'est pas modifiée."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted : le tri est à écrire."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-4-1" label="4.1 [Difficile] - Les k plus petits" type="python">
<Enonce>
### Les k plus petits

Écrire une fonction `k_plus_petits(t, k)` qui renvoie la liste triée des `k` plus petits éléments de `t` (ou de tous si `t` en a moins de `k`), sans modifier `t`.

Contrainte : ne pas trier toute la liste. Le tri par sélection peut s'arrêter après `k` étapes.

<Indices>
<Indice>

Travailler sur une copie, et ne faire que les `k` premières étapes du tri par sélection.

</Indice>
<Indice>

Attention si `k` dépasse la longueur : `min(k, len(t))` étapes.

</Indice>
<Indice>

```text
FONCTION k_plus_petits(t, k)
    c ← copie de t
    POUR i ALLANT DE 0 À min(k, longueur(c)) - 1
        échanger c[i] et le minimum de c à partir de i
    RENVOYER c[0:k]
```

</Indice>
</Indices>

<Correction>

```python
def k_plus_petits(t: list, k: int) -> list:
    c = list(t)
    for i in range(min(k, len(c))):
        i_min = i
        for j in range(i + 1, len(c)):
            if c[j] < c[i_min]:
                i_min = j
        c[i], c[i_min] = c[i_min], c[i]
    return c[:k]
```

</Correction>
</Enonce>
<Verification>

```python
t = [9, 4, 7, 1, 8, 2]
assert k_plus_petits(t, 3) == [1, 2, 4], "Les 3 plus petits."
assert t == [9, 4, 7, 1, 8, 2], "La liste reçue n'est pas modifiée."
assert k_plus_petits(t, 0) == [] and k_plus_petits([3, 1], 5) == [1, 3], "k = 0, puis k trop grand."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted : le tri est à écrire."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-4-2" label="4.2 [Difficile] - Tri par comptage" type="python">
<Enonce>
### Tri par comptage

Quand les valeurs sont des entiers dans un petit intervalle, on peut trier sans aucune comparaison : compter combien de fois chaque valeur apparaît, puis réécrire les valeurs dans l'ordre.

Écrire une fonction `tri_comptage(notes)` qui renvoie une nouvelle liste triée des notes (entiers de 0 à 20).

<Indices>
<Indice>

Une liste `compte` de 21 zéros : `compte[v]` est le nombre d'apparitions de la note `v`.

</Indice>
<Indice>

Ensuite, pour `v` de 0 à 20, ajouter `compte[v]` fois la valeur `v` au résultat.

</Indice>
<Indice>

```text
FONCTION tri_comptage(notes)
    compte ← 21 zéros
    POUR CHAQUE v DE notes : compte[v] ← compte[v] + 1
    resultat ← liste vide
    POUR v ALLANT DE 0 À 20
        RÉPÉTER compte[v] FOIS : ajouter v à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def tri_comptage(notes: list) -> list:
    compte = [0] * 21
    for v in notes:
        compte[v] = compte[v] + 1
    resultat = []
    for v in range(21):
        for _ in range(compte[v]):
            resultat.append(v)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
import random
assert tri_comptage([12, 5, 20, 5, 0]) == [0, 5, 5, 12, 20], "Exemple."
assert tri_comptage([]) == [] and tri_comptage([7, 7]) == [7, 7], "Vide, puis valeurs égales."
grande = [random.randint(0, 20) for _ in range(100000)]
assert tri_comptage(grande) == sorted(grande), "100 000 notes, triées rapidement."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted : le tri est à écrire."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-4-3" label="4.3 [Difficile] - Intersection de listes triées" type="python">
<Enonce>
### Intersection de listes triées

Écrire une fonction `communs(a, b)` qui renvoie la liste triée des valeurs présentes dans les deux listes triées `a` et `b` (sans doublons dans chaque liste).

Contrainte : un seul parcours de chaque liste (pas de `in`, pas de boucles imbriquées).

<Indices>
<Indice>

Deux indices, comme pour la fusion. Si `a[i] < b[j]`, la valeur `a[i]` ne peut pas être dans `b` : avancer `i`.

</Indice>
<Indice>

Si les deux valeurs sont égales, c'est un élément commun : l'ajouter et avancer les deux indices.

</Indice>
<Indice>

```text
FONCTION communs(a, b)
    resultat ← liste vide ; i ← 0 ; j ← 0
    TANT QUE i < longueur(a) ET j < longueur(b)
        SI a[i] < b[j] ALORS i ← i + 1
        SINON SI a[i] > b[j] ALORS j ← j + 1
        SINON ajouter a[i] ; i ← i + 1 ; j ← j + 1
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def communs(a: list, b: list) -> list:
    resultat = []
    i = 0
    j = 0
    while i < len(a) and j < len(b):
        if a[i] < b[j]:
            i = i + 1
        elif a[i] > b[j]:
            j = j + 1
        else:
            resultat.append(a[i])
            i = i + 1
            j = j + 1
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert communs([1, 3, 5, 7], [2, 3, 4, 7, 9]) == [3, 7], "3 et 7 sont communs."
assert communs([], [1]) == [] and communs([1, 2], [3, 4]) == [], "Aucun commun."
assert communs([1, 2, 3], [1, 2, 3]) == [1, 2, 3], "Listes identiques."
import re
assert not re.search(r"\bin\s+[ab]\b", PROGRAMME), "Sans « in » sur les listes."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-4-4" label="4.4 [Difficile] - Fusion de plusieurs listes" type="python">
<Enonce>
### Fusion de plusieurs listes

Écrire une fonction `fusion_multiple(listes)` qui reçoit une liste de listes triées et renvoie une seule liste triée contenant tous leurs éléments.

Contrainte : sans trier, en réutilisant une fonction de fusion de deux listes.

<Indices>
<Indice>

Écrire (ou recopier) `fusion(a, b)` qui fusionne deux listes triées.

</Indice>
<Indice>

Partir d'une liste vide et y fusionner les listes une par une.

</Indice>
<Indice>

```text
FONCTION fusion(a, b) : fusion de deux listes triées
FONCTION fusion_multiple(listes)
    resultat ← liste vide
    POUR CHAQUE l DE listes : resultat ← fusion(resultat, l)
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def fusion(a: list, b: list) -> list:
    resultat = []
    i = 0
    j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultat.append(a[i])
            i = i + 1
        else:
            resultat.append(b[j])
            j = j + 1
    return resultat + a[i:] + b[j:]


def fusion_multiple(listes: list) -> list:
    resultat = []
    for l in listes:
        resultat = fusion(resultat, l)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert fusion_multiple([[1, 5, 9], [2, 6], [0, 3, 10]]) == [0, 1, 2, 3, 5, 6, 9, 10], "Trois listes."
assert fusion_multiple([]) == [] and fusion_multiple([[], [4]]) == [4], "Aucune liste, puis une liste vide."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted : le tri est à écrire."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-5-1" label="5.1 [Expert] - Tri fusion sans récursivité" type="python">
<Enonce>
### Tri fusion sans récursivité

Le tri fusion trie une liste en fusionnant des morceaux triés de plus en plus grands : d'abord des morceaux d'un élément (toujours triés), fusionnés deux à deux en morceaux de 2, puis de 4, de 8… jusqu'à couvrir toute la liste.

Écrire une fonction `tri_fusion(t)` qui renvoie une nouvelle liste triée selon cette méthode.

<Indices>
<Indice>

Commencer avec une liste de morceaux : `[[x] for x in t]`.

</Indice>
<Indice>

À chaque tour, fusionner les morceaux deux à deux (le 0 avec le 1, le 2 avec le 3…). Un morceau seul en fin de liste passe tel quel au tour suivant.

</Indice>
<Indice>

S'arrêter quand il ne reste qu'un morceau (ou aucun, pour une liste vide).

</Indice>
<Indice>

```text
FONCTION tri_fusion(t)
    morceaux ← [[x] pour x dans t]
    TANT QUE longueur(morceaux) > 1
        suivants ← liste vide
        POUR i ALLANT DE 0 À longueur(morceaux) - 1 PAR PAS DE 2
            SI i + 1 < longueur(morceaux) ALORS ajouter fusion(morceaux[i], morceaux[i + 1])
            SINON ajouter morceaux[i]
        morceaux ← suivants
    RENVOYER morceaux[0] (ou liste vide)
```

</Indice>
</Indices>

<Correction>

```python
def fusion(a: list, b: list) -> list:
    resultat = []
    i = 0
    j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultat.append(a[i])
            i = i + 1
        else:
            resultat.append(b[j])
            j = j + 1
    return resultat + a[i:] + b[j:]


def tri_fusion(t: list) -> list:
    morceaux = [[x] for x in t]
    while len(morceaux) > 1:
        suivants = []
        for i in range(0, len(morceaux), 2):
            if i + 1 < len(morceaux):
                suivants.append(fusion(morceaux[i], morceaux[i + 1]))
            else:
                suivants.append(morceaux[i])
        morceaux = suivants
    if morceaux:
        return morceaux[0]
    return []
```

</Correction>
</Enonce>
<Verification>

```python
import random
assert tri_fusion([5, 2, 9, 1, 5, 6, 3]) == [1, 2, 3, 5, 5, 6, 9], "Liste de 7 éléments."
assert tri_fusion([]) == [] and tri_fusion([4]) == [4], "Vide et un élément."
grande = [random.randint(0, 10 ** 6) for _ in range(50000)]
assert tri_fusion(grande) == sorted(grande), "50 000 éléments, triés rapidement (le tri par insertion serait trop lent)."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted : le tri est à écrire."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-5-2" label="5.2 [Expert] - Compter les inversions" type="python">
<Enonce>
### Compter les inversions

Une **inversion** d'une liste est une paire d'indices `i < j` telle que `t[i] > t[j]`. Leur nombre mesure le désordre de la liste.

Écrire une fonction `inversions(t)` qui renvoie ce nombre. La liste peut contenir 50 000 éléments : deux boucles imbriquées seraient trop lentes.

<Indices>
<Indice>

Pendant une fusion de `a` et `b` (tous deux triés), quand un élément de `b` passe avant `a[i]`, il est plus petit que `a[i]` **et** que tous les éléments restants de `a` : cela fait `len(a) - i` inversions d'un coup.

</Indice>
<Indice>

Reprendre le tri fusion par morceaux et faire renvoyer à la fusion, en plus de la liste fusionnée, le nombre d'inversions trouvées. Le total est la somme de toutes les fusions.

</Indice>
<Indice>

```text
FONCTION fusion_compte(a, b)
    resultat ← liste vide ; i ← 0 ; j ← 0 ; inv ← 0
    TANT QUE i < longueur(a) ET j < longueur(b)
        SI a[i] ≤ b[j] ALORS ajouter a[i] ; i ← i + 1
        SINON ajouter b[j] ; j ← j + 1 ; inv ← inv + (longueur(a) - i)
    RENVOYER (resultat + a[i:] + b[j:], inv)
FONCTION inversions(t)
    tri fusion par morceaux en additionnant les inv de chaque fusion
```

</Indice>
</Indices>

<Correction>

```python
def fusion_compte(a: list, b: list) -> tuple:
    resultat = []
    i = 0
    j = 0
    inv = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            resultat.append(a[i])
            i = i + 1
        else:
            resultat.append(b[j])
            j = j + 1
            inv = inv + len(a) - i
    return resultat + a[i:] + b[j:], inv


def inversions(t: list) -> int:
    morceaux = [[x] for x in t]
    total = 0
    while len(morceaux) > 1:
        suivants = []
        for i in range(0, len(morceaux), 2):
            if i + 1 < len(morceaux):
                fusionne, inv = fusion_compte(morceaux[i], morceaux[i + 1])
                suivants.append(fusionne)
                total = total + inv
            else:
                suivants.append(morceaux[i])
        morceaux = suivants
    return total
```

</Correction>
</Enonce>
<Verification>

```python
assert inversions([1, 2, 3]) == 0 and inversions([]) == 0, "Liste triée ou vide : 0."
assert inversions([3, 2, 1]) == 3 and inversions([2, 4, 1, 3, 5]) == 3, "Petites listes."
assert inversions([1, 1, 1]) == 0, "Valeurs égales : pas d'inversion."
assert inversions(list(range(50000, 0, -1))) == 50000 * 49999 // 2, "50 000 éléments en ordre inverse, rapidement."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-5-3" label="5.3 [Expert] - Drapeau tricolore" type="python">
<Enonce>
### Drapeau tricolore

Une liste ne contient que des 0, des 1 et des 2. Écrire une fonction `drapeau(t)` qui la trie **sur place**, en **un seul parcours** et sans liste auxiliaire (problème du drapeau hollandais).

<Indices>
<Indice>

Maintenir trois zones : les 0 au début, les 2 à la fin, les 1 au milieu, et une zone « pas encore vue » entre les 1 et les 2.

</Indice>
<Indice>

Trois indices : `bas` (fin des 0), `i` (case examinée) et `haut` (début des 2). Un 0 est échangé vers `bas`, un 2 vers `haut`. Attention, après un échange avec `haut`, la nouvelle case `i` n'a pas encore été examinée.

</Indice>
<Indice>

```text
FONCTION drapeau(t)
    bas ← 0 ; i ← 0 ; haut ← longueur(t) - 1
    TANT QUE i ≤ haut
        SI t[i] = 0 ALORS échanger t[i] et t[bas] ; bas ← bas + 1 ; i ← i + 1
        SINON SI t[i] = 2 ALORS échanger t[i] et t[haut] ; haut ← haut - 1
        SINON i ← i + 1
```

</Indice>
</Indices>

<Correction>

```python
def drapeau(t: list) -> None:
    bas = 0
    i = 0
    haut = len(t) - 1
    while i <= haut:
        if t[i] == 0:
            t[i], t[bas] = t[bas], t[i]
            bas = bas + 1
            i = i + 1
        elif t[i] == 2:
            t[i], t[haut] = t[haut], t[i]
            haut = haut - 1
        else:
            i = i + 1
```

</Correction>
</Enonce>
<Verification>

```python
import random
for t in [[2, 0, 1, 2, 1, 0], [], [1], [2, 2, 0, 0], [0, 1, 2], [2, 1, 0]]:
    attendu = sorted(t)
    drapeau(t)
    assert t == attendu, f"Trié : {attendu}."
t = [random.randint(0, 2) for _ in range(1000)]
attendu = sorted(t)
drapeau(t)
assert t == attendu, "1000 valeurs aléatoires."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted : le tri est à écrire."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-5-4" label="5.4 [Expert] - Fusion d'intervalles" type="python">
<Enonce>
### Fusion d'intervalles

Des réservations sont données par des intervalles `(debut, fin)`, dans le désordre. Écrire une fonction `fusionner_intervalles(intervalles)` qui renvoie la liste triée des intervalles obtenus en fusionnant ceux qui se chevauchent ou se touchent.

Exemple : `[(8, 10), (1, 3), (2, 6), (10, 12)]` donne `[(1, 6), (8, 12)]`.

<Indices>
<Indice>

Trier d'abord les intervalles par début (ici, `sorted` est permis) : deux intervalles qui se chevauchent sont alors voisins.

</Indice>
<Indice>

Parcourir la liste triée en gardant l'intervalle en cours : si le suivant commence avant (ou pile à) sa fin, on l'absorbe en prolongeant la fin. Sinon, on clôt l'intervalle en cours.

</Indice>
<Indice>

```text
FONCTION fusionner_intervalles(intervalles)
    tries ← intervalles triés par début
    resultat ← liste vide
    POUR CHAQUE (d, f) DE tries
        SI resultat non vide ET d ≤ fin du dernier intervalle de resultat ALORS
            fin du dernier ← max(fin du dernier, f)
        SINON ajouter (d, f) à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def fusionner_intervalles(intervalles: list) -> list:
    tries = sorted(intervalles)
    resultat = []
    for d, f in tries:
        if resultat and d <= resultat[-1][1]:
            resultat[-1] = (resultat[-1][0], max(resultat[-1][1], f))
        else:
            resultat.append((d, f))
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert fusionner_intervalles([(8, 10), (1, 3), (2, 6), (10, 12)]) == [(1, 6), (8, 12)], "Exemple."
assert fusionner_intervalles([]) == [] and fusionner_intervalles([(5, 7)]) == [(5, 7)], "Vide et un seul."
assert fusionner_intervalles([(1, 10), (2, 3), (4, 5)]) == [(1, 10)], "Intervalles inclus dans un grand."
assert fusionner_intervalles([(1, 2), (3, 4)]) == [(1, 2), (3, 4)], "Séparés : rien à fusionner."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-6-1" label="6.1 [Mini-projet] - Banc d'essai des tris" type="python">
<Enonce>
### Banc d'essai des tris

**Contexte.** Pour un exposé sur les algorithmes de tri, un groupe d'élèves veut montrer **chiffres à l'appui** qu'ils ne se valent pas : certains brillent sur une liste presque triée, d'autres sur une grande liste mélangée. Le projet est un banc d'essai qui trie une même liste avec quatre algorithmes et compte, pour chacun, le nombre de **comparaisons entre deux éléments** de la liste.

**Règles communes** : chaque fonction de tri renvoie le tuple `(liste_triee, comparaisons)`, sans modifier la liste reçue ni utiliser `sort` ou `sorted`. Le comptage suit des règles fixées, pour que tous les groupes trouvent les mêmes nombres.

**Les fonctions du banc d'essai**
- `selection(t)` : tri par sélection. Chaque comparaison faite pendant la recherche du minimum compte.
- `insertion(t)` : tri par insertion. Chaque test `t[j - 1] > t[j]` compte, y compris celui qui arrête le recul d'un élément.
- `bulles(t)` : tri à bulles. Le passage numéro `p` (à partir de 0) compare les paires d'indices `0` à `n - 2 - p`, et l'on s'arrête après un passage sans échange (ou quand il ne reste plus de paire).
- `fusion(t)` : tri fusion récursif. La liste est coupée en `t[:m]` et `t[m:]` avec `m = len(t) // 2`, et chaque comparaison faite pendant la fusion compte.
- `profil(t)` : le tableau présenté dans l'exposé. Renvoie le dictionnaire `{"bulles": …, "fusion": …, "insertion": …, "sélection": …}` des comparaisons de chaque tri sur `t`.
- `plus_econome(t)` : la conclusion de l'expérience. Renvoie le nom de l'algorithme qui fait le moins de comparaisons sur `t` (le premier dans l'ordre alphabétique en cas d'égalité).
- `liste_test(n, sorte)` : fabrique les listes de l'expérience, toujours les mêmes pour pouvoir comparer. Renvoie une liste de `n` entiers de 0 à `n - 1`, `sorte` valant `"triee"`, `"inverse"` ou `"melangee"` (pour cette dernière, `random.Random(n).shuffle` sur la liste triée).

<Indices>
<Indice>

Partir des tris de la fiche, travailler sur une copie et ajouter un compteur. Le tri fusion récursif renvoie lui aussi un couple : additionner les comparaisons des deux moitiés et celles de la fusion.

</Indice>
<Indice>

Vérifier les compteurs sur des cas connus : sélection sur 10 éléments, toujours 45 comparaisons. Insertion sur une liste triée, `n - 1`.

</Indice>
<Indice>

`profil` appelle les quatre tris. `plus_econome` cherche le minimum dans le dictionnaire.

</Indice>
<Indice>

```text
(cœur du programme : le tri fusion qui compte)
FONCTION fusion(t)
    SI longueur(t) ≤ 1 ALORS RENVOYER (copie de t, 0)
    m ← longueur(t) // 2
    (a, ca) ← fusion(t[:m]) ; (b, cb) ← fusion(t[m:])
    resultat ← [] ; i ← 0 ; j ← 0 ; c ← ca + cb
    TANT QUE i < longueur(a) ET j < longueur(b)
        c ← c + 1
        SI a[i] ≤ b[j] ALORS ajouter a[i] ; i ← i + 1 SINON ajouter b[j] ; j ← j + 1
    RENVOYER (resultat + a[i:] + b[j:], c)
```

</Indice>
</Indices>

<Correction>

```python
import random


def selection(t: list) -> tuple:
    c = list(t)
    comp = 0
    for i in range(len(c)):
        i_min = i
        for j in range(i + 1, len(c)):
            comp += 1
            if c[j] < c[i_min]:
                i_min = j
        c[i], c[i_min] = c[i_min], c[i]
    return (c, comp)


def insertion(t: list) -> tuple:
    c = list(t)
    comp = 0
    for i in range(1, len(c)):
        j = i
        while j > 0:
            comp += 1
            if c[j - 1] > c[j]:
                c[j - 1], c[j] = c[j], c[j - 1]
                j -= 1
            else:
                break
    return (c, comp)


def bulles(t: list) -> tuple:
    c = list(t)
    comp = 0
    p = 0
    echange = True
    while echange and p < len(c) - 1:
        echange = False
        for i in range(len(c) - 1 - p):
            comp += 1
            if c[i] > c[i + 1]:
                c[i], c[i + 1] = c[i + 1], c[i]
                echange = True
        p += 1
    return (c, comp)


def fusion(t: list) -> tuple:
    if len(t) <= 1:
        return (list(t), 0)
    m = len(t) // 2
    a, ca = fusion(t[:m])
    b, cb = fusion(t[m:])
    resultat = []
    i = j = 0
    c = ca + cb
    while i < len(a) and j < len(b):
        c += 1
        if a[i] <= b[j]:
            resultat.append(a[i])
            i += 1
        else:
            resultat.append(b[j])
            j += 1
    return (resultat + a[i:] + b[j:], c)


def profil(t: list) -> dict:
    return {"bulles": bulles(t)[1], "fusion": fusion(t)[1], "insertion": insertion(t)[1], "sélection": selection(t)[1]}


def plus_econome(t: list) -> str:
    p = profil(t)
    meilleur = None
    for nom in p:
        if meilleur is None or p[nom] < p[meilleur] or (p[nom] == p[meilleur] and nom < meilleur):
            meilleur = nom
    return meilleur


def liste_test(n: int, sorte: str) -> list:
    t = list(range(n))
    if sorte == "inverse":
        t.reverse()
    elif sorte == "melangee":
        random.Random(n).shuffle(t)
    return t
```

</Correction>
</Enonce>
<Verification>

```python
import random
for f in (selection, insertion, bulles, fusion):
    t = [5, 2, 9, 1, 5, 6, 0]
    assert f(t)[0] == [0, 1, 2, 5, 5, 6, 9] and t == [5, 2, 9, 1, 5, 6, 0], f"{f.__name__} trie une copie."
    assert f([]) == ([], 0) and f([3])[0] == [3], f"{f.__name__} : cas limites."
    g = [random.randint(0, 50) for _ in range(200)]
    assert f(g)[0] == sorted(g), f"{f.__name__} : 200 valeurs aléatoires."
assert selection(list(range(10)))[1] == 45 and insertion(list(range(10)))[1] == 9 and bulles(list(range(10)))[1] == 9, "Liste déjà triée."
assert insertion(list(range(10, 0, -1)))[1] == 45 and bulles(list(range(10, 0, -1)))[1] == 45, "Liste inversée."
assert fusion(list(range(8)))[1] == 12 and fusion([4, 3, 2, 1])[1] == 4 and fusion([2, 1, 3])[1] == 3, "Comparaisons du tri fusion."
assert bulles([2, 1, 3, 4])[1] == 5, "Bulles : un passage avec échange (3 comparaisons), puis un sans (2)."
assert profil([3, 1, 2]) == {"bulles": 3, "fusion": 3, "insertion": 3, "sélection": 3}, "Profil."
assert plus_econome([3, 1, 2]) == "bulles" and plus_econome(liste_test(50, "triee")) == "bulles", "Égalité alphabétique ; liste triée."
assert plus_econome(liste_test(200, "melangee")) == "fusion" and plus_econome(liste_test(200, "inverse")) == "fusion", "Le tri fusion l'emporte sur les grandes listes."
assert liste_test(5, "inverse") == [4, 3, 2, 1, 0] and sorted(liste_test(30, "melangee")) == list(range(30)) and liste_test(30, "melangee") == liste_test(30, "melangee"), "Listes de test."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tris-6-2" label="6.2 [Mini-projet] - Catalogue de la bibliothèque" type="python">
<Enonce>
### Catalogue de la bibliothèque

**Contexte.** Le CDI fusionne son catalogue avec celui d'un collège voisin et veut un outil de recherche rapide. Les documentalistes rangent les titres par ordre alphabétique « bibliothécaire » : sans tenir compte des majuscules, des accents ni de l'article du début (`Le`, `La`, `Les`, `L'`). Ainsi « L'Étranger » se range à la lettre E, comme `etranger`. Le projet écrit les outils du catalogue, **sans `sort` ni `sorted`**.

**Les données** : un catalogue est une liste de titres (des textes), par exemple `["Bel-Ami", "Candide", "L'Étranger", "Germinal"]`.

**Les fonctions du catalogue**
- `cle(titre)` : la clé de rangement d'un titre, utilisée par toutes les autres fonctions pour comparer. Renvoie le titre en minuscules, accents retirés (`àâäéèêëîïôöùûüç` deviennent `aaaeeeeiioouuuc`), article de tête retiré (`le `, `la `, `les `, `l'`).
- `trier(titres)` : range un lot de nouveaux titres. Renvoie une nouvelle liste triée par clé, **stable** (deux titres de même clé gardent leur ordre).
- `fusionner(a, b)` : réunit les deux catalogues triés. Renvoie le catalogue fusionné, trié. Un titre de `b` dont la clé existe déjà dans `a` n'est pas ajouté.
- `chercher(catalogue, titre)` : la recherche d'un élève qui connaît le titre exact. Renvoie l'indice du titre de même clé dans le catalogue trié, ou `-1`, par **recherche dichotomique**.
- `commencant_par(catalogue, debut)` : la recherche pendant la frappe, quand seul le début du titre est tapé. Renvoie la liste des titres dont la clé commence par `cle(debut)`, en trouvant le premier par dichotomie puis en avançant.
- `doublons(titres)` : signale les livres présents en double après la fusion. Renvoie la liste triée des clés partagées par plusieurs titres.

<Indices>
<Indice>

Tout repose sur `cle` : les comparaisons se font toujours entre clés, jamais entre titres. Pour les accents, parcourir le texte et remplacer chaque caractère par son équivalent trouvé à la même position dans la seconde chaîne.

</Indice>
<Indice>

Pour un tri stable fait main, le tri par insertion convient s'il ne fait reculer un titre que devant une clé **strictement** plus grande. Le tri fusion aussi, avec `<=`.

</Indice>
<Indice>

Pour `commencant_par`, chercher par dichotomie la première position dont la clé est supérieure ou égale au début cherché : les titres voulus se suivent à partir de là.

</Indice>
<Indice>

```text
(cœur du programme : la première position ≥ debut)
FONCTION premiere_position(catalogue, d)            (d est déjà une clé)
    g ← 0 ; dr ← longueur(catalogue)
    TANT QUE g < dr
        m ← (g + dr) // 2
        SI cle(catalogue[m]) < d ALORS g ← m + 1 SINON dr ← m
    RENVOYER g
```

</Indice>
</Indices>

<Correction>

```python
ACCENTS = "àâäéèêëîïôöùûüç"
SANS = "aaaeeeeiioouuuc"


def cle(titre: str) -> str:
    t = ""
    for c in titre.lower():
        i = ACCENTS.find(c)
        t = t + (SANS[i] if i >= 0 else c)
    for article in ("le ", "la ", "les ", "l'"):
        if t.startswith(article):
            return t[len(article):]
    return t


def trier(titres: list) -> list:
    liste = []
    for titre in titres:
        i = len(liste)
        while i > 0 and cle(liste[i - 1]) > cle(titre):
            i -= 1
        liste.insert(i, titre)
    return liste


def fusionner(a: list, b: list) -> list:
    resultat = []
    i = j = 0
    while i < len(a) and j < len(b):
        ka, kb = cle(a[i]), cle(b[j])
        if ka < kb:
            resultat.append(a[i])
            i += 1
        elif kb < ka:
            resultat.append(b[j])
            j += 1
        else:
            resultat.append(a[i])
            i += 1
            j += 1
    return resultat + a[i:] + b[j:]


def premiere_position(catalogue: list, d: str) -> int:
    g, dr = 0, len(catalogue)
    while g < dr:
        m = (g + dr) // 2
        if cle(catalogue[m]) < d:
            g = m + 1
        else:
            dr = m
    return g


def chercher(catalogue: list, titre: str) -> int:
    k = cle(titre)
    i = premiere_position(catalogue, k)
    if i < len(catalogue) and cle(catalogue[i]) == k:
        return i
    return -1


def commencant_par(catalogue: list, debut: str) -> list:
    d = cle(debut)
    i = premiere_position(catalogue, d)
    resultat = []
    while i < len(catalogue) and cle(catalogue[i]).startswith(d):
        resultat.append(catalogue[i])
        i += 1
    return resultat


def doublons(titres: list) -> list:
    vus = []
    resultat = []
    for t in titres:
        k = cle(t)
        if k in vus and k not in resultat:
            resultat.append(k)
        vus.append(k)
    return trier(resultat)
```

</Correction>
</Enonce>
<Verification>

```python
assert cle("L'Étranger") == "etranger" and cle("Les Misérables") == "miserables" and cle("La Peste") == "peste", "Clés avec article."
assert cle("Lettres de mon moulin") == "lettres de mon moulin" and cle("Ça") == "ca", "Pas d'article ; accent."
titres = ["Le Rouge et le Noir", "Candide", "L'Étranger", "Germinal", "les misérables", "Les Misérables", "Bel-Ami"]
c = trier(titres)
assert c == ["Bel-Ami", "Candide", "L'Étranger", "Germinal", "les misérables", "Les Misérables", "Le Rouge et le Noir"], "Tri bibliothécaire, stable."
assert titres[0] == "Le Rouge et le Noir", "La liste reçue n'est pas modifiée."
f = fusionner(["Candide", "La Peste", "Zadig"], ["Bel-Ami", "La peste", "Ubik"])
assert f == ["Bel-Ami", "Candide", "La Peste", "Ubik", "Zadig"], "Fusion sans doublon de clé."
assert chercher(c, "germinal") == 3 and chercher(c, "L'Etranger") == 2 and chercher(c, "Nana") == -1 and chercher([], "A") == -1, "Recherche dichotomique."
assert commencant_par(c, "Les Mi") == ["les misérables", "Les Misérables"] and commencant_par(c, "C") == ["Candide"] and commencant_par(c, "x") == [], "Recherche par début."
grand = trier([f"Titre {i:05d}" for i in range(600, 0, -1)])
assert chercher(grand, "titre 00234") == 233 and len(commencant_par(grand, "Titre 005")) == 100, "Grand catalogue."
assert doublons(titres) == ["miserables"] and doublons(["A", "B"]) == [], "Doublons."

import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
