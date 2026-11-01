---
title: 'Exercices : Les listes'
description: 'Création, parcours, modification et algorithmes sur les listes : fiche progressive par niveau.'
icon: "mouse"
chapter: Structures de données linéaires
badgeId: premiere_exercices_listes
meta: 'Listes Python : indices, parcours, méthodes et algorithmes'
level: premiere
prerequisites:
  - python_exercices_fonctions
audience: public
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="les-listes-python" courseTitle="Les listes">

<ExerciseSection id="1nsi-listes-1-1" label="1.1 [Introduction] - Premier et dernier" type="python">
<Enonce>
### Premier et dernier

Écrire une fonction `extremites(liste)` qui renvoie une nouvelle liste contenant le premier et le dernier élément de `liste` (non vide).

Exemple : `extremites([4, 8, 15, 16])` renvoie `[4, 16]`.

<Indices>
<Indice>

Le premier élément a l'indice 0.

</Indice>
<Indice>

`liste[-1]` désigne le dernier élément, quelle que soit la longueur.

</Indice>
<Indice>

```text
FONCTION extremites(liste)
    RENVOYER [liste[0], liste[dernier indice]]
```

</Indice>
</Indices>

<Correction>

```python
def extremites(liste: list) -> list:
    return [liste[0], liste[-1]]
```

</Correction>
</Enonce>
<Verification>

```python
assert extremites([4, 8, 15, 16]) == [4, 16], "[4, 8, 15, 16] : [4, 16]."
assert extremites(["a"]) == ["a", "a"], "Un seul élément : il est à la fois premier et dernier."
assert extremites([1, 2]) == [1, 2], "Deux éléments."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-1-2" label="1.2 [Introduction] - Somme d'une liste" type="python">
<Enonce>
### Somme d'une liste

Écrire une fonction `somme(liste)` qui renvoie la somme des nombres de `liste` (0 pour une liste vide).

Contrainte : sans la fonction `sum`.

<Indices>
<Indice>

`for x in liste:` parcourt directement les valeurs.

</Indice>
<Indice>

Un total qui part de 0 et grandit à chaque tour.

</Indice>
<Indice>

```text
FONCTION somme(liste)
    total ← 0
    POUR CHAQUE x DE liste : total ← total + x
    RENVOYER total
```

</Indice>
</Indices>

<Correction>

```python
def somme(liste: list) -> float:
    total = 0
    for x in liste:
        total = total + x
    return total
```

</Correction>
</Enonce>
<Verification>

```python
assert somme([3, 5, 2]) == 10 and somme([]) == 0, "[3, 5, 2] : 10 ; vide : 0."
assert somme([-4, 4, 1.5]) == 1.5, "Avec des négatifs et des décimaux."
import re
assert not re.search(r"\bsum\s*\(", PROGRAMME), "Sans sum."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-1-3" label="1.3 [Introduction] - Liste des carrés" type="python">
<Enonce>
### Liste des carrés

Écrire une fonction `carres(n)` qui renvoie la liste `[1, 4, 9, …, n²]` des carrés des entiers de 1 à `n`.

<Indices>
<Indice>

Partir d'une liste vide `[]` et la remplir dans une boucle.

</Indice>
<Indice>

`liste.append(x)` ajoute `x` à la fin de la liste.

</Indice>
<Indice>

```text
FONCTION carres(n)
    resultat ← liste vide
    POUR i ALLANT DE 1 À n : ajouter i² à la fin de resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def carres(n: int) -> list:
    resultat = []
    for i in range(1, n + 1):
        resultat.append(i ** 2)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert carres(4) == [1, 4, 9, 16], "carres(4)."
assert carres(0) == [] and carres(1) == [1], "carres(0) et carres(1)."
assert len(carres(100)) == 100 and carres(100)[-1] == 10000, "carres(100) a 100 éléments, le dernier vaut 10000."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-1-4" label="1.4 [Introduction] - Combien de positifs ?" type="python">
<Enonce>
### Combien de positifs ?

Écrire une fonction `nb_positifs(liste)` qui renvoie le nombre d'éléments strictement positifs de `liste`.

<Indices>
<Indice>

Un compteur et une condition dans la boucle.

</Indice>
<Indice>

0 n'est pas strictement positif.

</Indice>
<Indice>

```text
FONCTION nb_positifs(liste)
    n ← 0
    POUR CHAQUE x DE liste : SI x > 0 ALORS n ← n + 1
    RENVOYER n
```

</Indice>
</Indices>

<Correction>

```python
def nb_positifs(liste: list) -> int:
    n = 0
    for x in liste:
        if x > 0:
            n = n + 1
    return n
```

</Correction>
</Enonce>
<Verification>

```python
assert nb_positifs([3, -1, 0, 7, -5]) == 2, "[3, -1, 0, 7, -5] : 2."
assert nb_positifs([]) == 0 and nb_positifs([-1, -2]) == 0, "Aucun positif."
assert nb_positifs([0.5, 1, 2]) == 3, "Trois positifs."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-2-1" label="2.1 [Facile] - Maximum" type="python">
<Enonce>
### Maximum

Écrire une fonction `maximum(liste)` qui renvoie la plus grande valeur d'une liste non vide.

Contrainte : sans `max` ni `sort`.

<Indices>
<Indice>

Le premier élément sert de maximum provisoire.

</Indice>
<Indice>

Chaque élément plus grand que le maximum provisoire le remplace.

</Indice>
<Indice>

```text
FONCTION maximum(liste)
    m ← liste[0]
    POUR CHAQUE x DE liste : SI x > m ALORS m ← x
    RENVOYER m
```

</Indice>
</Indices>

<Correction>

```python
def maximum(liste: list) -> float:
    m = liste[0]
    for x in liste:
        if x > m:
            m = x
    return m
```

</Correction>
</Enonce>
<Verification>

```python
assert maximum([3, 9, 2, 9, 4]) == 9, "[3, 9, 2, 9, 4] : 9."
assert maximum([-7, -3, -12]) == -3, "Que des négatifs : -3 (et pas 0)."
assert maximum([42]) == 42, "Un seul élément."
import re
assert not re.search(r"\b(max|sorted)\s*\(|\.sort\s*\(", PROGRAMME), "Sans max ni tri."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-2-2" label="2.2 [Facile] - Moyenne" type="python">
<Enonce>
### Moyenne

Écrire une fonction `moyenne(liste)` qui renvoie la moyenne des nombres de `liste`, arrondie au centième, ou `None` si la liste est vide.

<Indices>
<Indice>

Une liste vide ferait diviser par zéro : la traiter en premier.

</Indice>
<Indice>

`len(liste)` donne le nombre d'éléments.

</Indice>
<Indice>

```text
FONCTION moyenne(liste)
    SI liste vide ALORS RENVOYER None
    total ← somme des éléments
    RENVOYER arrondi(total / longueur(liste), 2 chiffres)
```

</Indice>
</Indices>

<Correction>

```python
def moyenne(liste: list):
    if len(liste) == 0:
        return None
    total = 0
    for x in liste:
        total = total + x
    return round(total / len(liste), 2)
```

</Correction>
</Enonce>
<Verification>

```python
assert moyenne([12, 15, 9]) == 12, "[12, 15, 9] : 12."
assert moyenne([10, 11, 15.5]) == 12.17, "Arrondi au centième."
assert moyenne([]) is None, "Liste vide : None."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-2-3" label="2.3 [Facile] - Garder les pairs" type="python">
<Enonce>
### Garder les pairs

Écrire une fonction `pairs(liste)` qui renvoie une **nouvelle** liste contenant seulement les nombres pairs de `liste`, dans le même ordre. La liste d'origine ne doit pas être modifiée.

<Indices>
<Indice>

Construire une liste vide, puis y ajouter les éléments qui passent le test.

</Indice>
<Indice>

Un nombre est pair si `x % 2 == 0`.

</Indice>
<Indice>

```text
FONCTION pairs(liste)
    resultat ← liste vide
    POUR CHAQUE x DE liste : SI x pair ALORS ajouter x à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def pairs(liste: list) -> list:
    resultat = []
    for x in liste:
        if x % 2 == 0:
            resultat.append(x)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
donnees = [5, 8, 2, 7, 10, 3]
assert pairs(donnees) == [8, 2, 10], "[5, 8, 2, 7, 10, 3] : [8, 2, 10]."
assert donnees == [5, 8, 2, 7, 10, 3], "La liste d'origine n'est pas modifiée."
assert pairs([1, 3]) == [] and pairs([]) == [], "Aucun pair."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-2-4" label="2.4 [Facile] - Liste à l'envers" type="python">
<Enonce>
### Liste à l'envers

Écrire une fonction `a_l_envers(liste)` qui renvoie une nouvelle liste avec les éléments dans l'ordre inverse.

Contrainte : sans `reverse`, `reversed` ni `[::-1]`.

<Indices>
<Indice>

Parcourir les indices du dernier au premier : `range(len(liste) - 1, -1, -1)`.

</Indice>
<Indice>

Ou bien insérer chaque élément au début : `resultat.insert(0, x)`.

</Indice>
<Indice>

```text
FONCTION a_l_envers(liste)
    resultat ← liste vide
    POUR i ALLANT DE longueur(liste) - 1 À 0 (en descendant)
        ajouter liste[i] à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def a_l_envers(liste: list) -> list:
    resultat = []
    for i in range(len(liste) - 1, -1, -1):
        resultat.append(liste[i])
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
donnees = [1, 2, 3, 4]
assert a_l_envers(donnees) == [4, 3, 2, 1] and donnees == [1, 2, 3, 4], "Nouvelle liste, l'originale ne change pas."
assert a_l_envers([]) == [] and a_l_envers(["x"]) == ["x"], "Vide et un élément."
assert "reverse" not in PROGRAMME and "[::-1]" not in PROGRAMME, "Sans reverse ni [::-1]."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-3-1" label="3.1 [Moyen] - Où est le minimum ?" type="python">
<Enonce>
### Où est le minimum ?

Écrire une fonction `indice_min(liste)` qui renvoie l'**indice** du plus petit élément d'une liste non vide (le premier en cas d'égalité).

<Indices>
<Indice>

Garder en mémoire l'indice du minimum provisoire, pas sa valeur : la valeur se retrouve avec `liste[i_min]`.

</Indice>
<Indice>

Parcourir les indices avec `range(len(liste))`.

</Indice>
<Indice>

```text
FONCTION indice_min(liste)
    i_min ← 0
    POUR i ALLANT DE 1 À longueur(liste) - 1
        SI liste[i] < liste[i_min] ALORS i_min ← i
    RENVOYER i_min
```

</Indice>
</Indices>

<Correction>

```python
def indice_min(liste: list) -> int:
    i_min = 0
    for i in range(1, len(liste)):
        if liste[i] < liste[i_min]:
            i_min = i
    return i_min
```

</Correction>
</Enonce>
<Verification>

```python
assert indice_min([5, 3, 8, 1, 9]) == 3, "[5, 3, 8, 1, 9] : indice 3."
assert indice_min([2, 1, 1]) == 1, "En cas d'égalité, le premier."
assert indice_min([7]) == 0 and indice_min([0, 4]) == 0, "Au début."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-3-2" label="3.2 [Moyen] - Sans doublons" type="python">
<Enonce>
### Sans doublons

Écrire une fonction `sans_doublons(liste)` qui renvoie une nouvelle liste où chaque valeur n'apparaît qu'une fois, en gardant l'ordre des **premières** apparitions.

Exemple : `[3, 1, 3, 2, 1]` donne `[3, 1, 2]`.

<Indices>
<Indice>

Ajouter un élément au résultat seulement s'il n'y est pas déjà.

</Indice>
<Indice>

`x not in resultat` teste l'absence de `x` dans la liste.

</Indice>
<Indice>

```text
FONCTION sans_doublons(liste)
    resultat ← liste vide
    POUR CHAQUE x DE liste
        SI x n'est pas dans resultat ALORS ajouter x à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def sans_doublons(liste: list) -> list:
    resultat = []
    for x in liste:
        if x not in resultat:
            resultat.append(x)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert sans_doublons([3, 1, 3, 2, 1]) == [3, 1, 2], "[3, 1, 3, 2, 1] : [3, 1, 2]."
assert sans_doublons([]) == [] and sans_doublons([4, 4, 4]) == [4], "Vide, puis tout identique."
assert sans_doublons(["b", "a", "b"]) == ["b", "a"], "Avec des textes."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-3-3" label="3.3 [Moyen] - Rotation" type="python">
<Enonce>
### Rotation

Écrire une fonction `rotation(liste, k)` qui renvoie une nouvelle liste décalée de `k` positions vers la droite : les éléments qui sortent à droite reviennent à gauche.

Exemple : `rotation([1, 2, 3, 4, 5], 2)` renvoie `[4, 5, 1, 2, 3]`. `k` peut dépasser la longueur.

<Indices>
<Indice>

L'élément d'indice `i` va à l'indice `(i + k) % n`, avec `n` la longueur.

</Indice>
<Indice>

Commencer par une liste de la bonne taille, par exemple `[None] * n`, puis placer chaque élément.

</Indice>
<Indice>

```text
FONCTION rotation(liste, k)
    n ← longueur(liste)
    resultat ← liste de n cases vides
    POUR i ALLANT DE 0 À n - 1
        resultat[reste de (i + k) par n] ← liste[i]
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def rotation(liste: list, k: int) -> list:
    n = len(liste)
    resultat = [None] * n
    for i in range(n):
        resultat[(i + k) % n] = liste[i]
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert rotation([1, 2, 3, 4, 5], 2) == [4, 5, 1, 2, 3], "Décalage de 2."
assert rotation([1, 2, 3], 0) == [1, 2, 3] and rotation([1, 2, 3], 3) == [1, 2, 3], "Décalage de 0 ou de la longueur : rien ne change."
assert rotation([1, 2, 3], 4) == [3, 1, 2], "Décalage de 4 sur 3 éléments : comme 1."
assert rotation([], 5) == [], "Liste vide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-3-4" label="3.4 [Moyen] - Liste triée ?" type="python">
<Enonce>
### Liste triée ?

Écrire une fonction `est_triee(liste)` qui renvoie `True` si les éléments sont rangés dans l'ordre croissant (des valeurs égales qui se suivent sont permises).

Contrainte : sans `sorted` ni `sort`.

<Indices>
<Indice>

Comparer chaque élément à son voisin de droite : `liste[i]` et `liste[i + 1]`.

</Indice>
<Indice>

Attention à l'indice de fin : le dernier voisin de droite existe pour `i = len(liste) - 2`.

</Indice>
<Indice>

```text
FONCTION est_triee(liste)
    POUR i ALLANT DE 0 À longueur(liste) - 2
        SI liste[i] > liste[i + 1] ALORS RENVOYER FAUX
    RENVOYER VRAI
```

</Indice>
</Indices>

<Correction>

```python
def est_triee(liste: list) -> bool:
    for i in range(len(liste) - 1):
        if liste[i] > liste[i + 1]:
            return False
    return True
```

</Correction>
</Enonce>
<Verification>

```python
assert est_triee([1, 2, 2, 5]) is True and est_triee([]) is True and est_triee([3]) is True, "Listes triées."
assert est_triee([1, 3, 2]) is False and est_triee([2, 1]) is False, "Listes non triées."
assert est_triee(["a", "b", "c"]) is True, "Avec des textes."
assert "sort" not in PROGRAMME, "Sans tri."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-4-1" label="4.1 [Difficile] - Deuxième plus grand" type="python">
<Enonce>
### Deuxième plus grand

Écrire une fonction `deuxieme(liste)` qui renvoie la deuxième plus grande valeur **distincte** de `liste`, ou `None` s'il n'y en a pas.

Exemples : `[4, 9, 7, 9]` donne `7` ; `[5, 5]` donne `None`.

Contrainte : un seul parcours de la liste, sans tri.

<Indices>
<Indice>

Garder deux variables pendant le parcours : `premier` et `second`, au départ à `None`.

</Indice>
<Indice>

Une valeur plus grande que `premier` fait descendre `premier` en `second`. Une valeur entre les deux ne remplace que `second`. Une valeur égale à `premier` ne change rien.

</Indice>
<Indice>

```text
FONCTION deuxieme(liste)
    premier ← None ; second ← None
    POUR CHAQUE x DE liste
        SI premier = None OU x > premier ALORS
            second ← premier ; premier ← x
        SINON SI x < premier ET (second = None OU x > second) ALORS
            second ← x
    RENVOYER second
```

</Indice>
</Indices>

<Correction>

```python
def deuxieme(liste: list):
    premier = None
    second = None
    for x in liste:
        if premier is None or x > premier:
            second = premier
            premier = x
        elif x < premier and (second is None or x > second):
            second = x
    return second
```

</Correction>
</Enonce>
<Verification>

```python
assert deuxieme([4, 9, 7, 9]) == 7, "[4, 9, 7, 9] : 7."
assert deuxieme([5, 5]) is None and deuxieme([1]) is None and deuxieme([]) is None, "Pas de deuxième valeur : None."
assert deuxieme([1, 2, 3, 4]) == 3 and deuxieme([4, 3, 2, 1]) == 3, "Dans les deux ordres."
assert deuxieme([-1, -5, -1, -3]) == -3, "Avec des négatifs."
assert "sort" not in PROGRAMME, "Sans tri."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-4-2" label="4.2 [Difficile] - Plus longue hausse" type="python">
<Enonce>
### Plus longue hausse

Écrire une fonction `plus_longue_hausse(liste)` qui renvoie la longueur de la plus longue suite d'éléments **consécutifs** strictement croissants.

Exemple : dans `[1, 3, 5, 2, 4, 6, 8, 1]`, la plus longue hausse est `2, 4, 6, 8`, de longueur 4. Une liste vide donne 0.

<Indices>
<Indice>

Garder la longueur de la hausse en cours, et la plus grande longueur vue.

</Indice>
<Indice>

Quand un élément est plus grand que le précédent, la hausse en cours s'allonge ; sinon, elle repart à 1.

</Indice>
<Indice>

```text
FONCTION plus_longue_hausse(liste)
    SI liste vide ALORS RENVOYER 0
    en_cours ← 1 ; record ← 1
    POUR i ALLANT DE 1 À longueur(liste) - 1
        SI liste[i] > liste[i - 1] ALORS en_cours ← en_cours + 1 SINON en_cours ← 1
        record ← max(record, en_cours)
    RENVOYER record
```

</Indice>
</Indices>

<Correction>

```python
def plus_longue_hausse(liste: list) -> int:
    if len(liste) == 0:
        return 0
    en_cours = 1
    record = 1
    for i in range(1, len(liste)):
        if liste[i] > liste[i - 1]:
            en_cours = en_cours + 1
        else:
            en_cours = 1
        if en_cours > record:
            record = en_cours
    return record
```

</Correction>
</Enonce>
<Verification>

```python
assert plus_longue_hausse([1, 3, 5, 2, 4, 6, 8, 1]) == 4, "Exemple : 4."
assert plus_longue_hausse([]) == 0 and plus_longue_hausse([7]) == 1, "Vide et un élément."
assert plus_longue_hausse([5, 4, 3]) == 1 and plus_longue_hausse([2, 2, 2]) == 1, "Aucune hausse stricte."
assert plus_longue_hausse([1, 2, 3, 4]) == 4, "Toute la liste."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-4-3" label="4.3 [Difficile] - Supprimer sur place" type="python">
<Enonce>
### Supprimer sur place

Écrire une fonction `supprimer(liste, x)` qui retire **toutes** les apparitions de `x` de `liste`, en modifiant la liste elle-même (sans en créer une nouvelle). Elle ne renvoie rien.

Exemple : après `supprimer(l, 2)`, la liste `l = [2, 1, 2, 2, 3]` devient `[1, 3]`.

<Indices>
<Indice>

Retirer un élément pendant un `for` sur la même liste fait sauter des éléments : préférer un `while` avec un indice.

</Indice>
<Indice>

Si `liste[i] == x`, `liste.pop(i)` le retire et l'indice ne doit **pas** avancer ; sinon, avancer.

</Indice>
<Indice>

```text
FONCTION supprimer(liste, x)
    i ← 0
    TANT QUE i < longueur(liste)
        SI liste[i] = x ALORS retirer l'élément d'indice i de liste
        SINON i ← i + 1
```

</Indice>
</Indices>

<Correction>

```python
def supprimer(liste: list, x) -> None:
    i = 0
    while i < len(liste):
        if liste[i] == x:
            liste.pop(i)
        else:
            i = i + 1
```

</Correction>
</Enonce>
<Verification>

```python
l = [2, 1, 2, 2, 3]
meme = l
assert supprimer(l, 2) is None, "La fonction ne renvoie rien."
assert l == [1, 3] and meme is l, "La liste elle-même est modifiée : [1, 3]."
l = [4, 4, 4]
supprimer(l, 4)
assert l == [], "Tout est retiré."
l = [1, 2, 3]
supprimer(l, 9)
assert l == [1, 2, 3], "Rien à retirer."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-4-4" label="4.4 [Difficile] - Histogramme des notes" type="python">
<Enonce>
### Histogramme des notes

Écrire une fonction `histogramme(notes)` qui reçoit une liste de notes entières de 0 à 20 et renvoie une liste de **21** entiers : la case d'indice `k` contient le nombre d'élèves ayant eu la note `k`.

Exemple : `histogramme([12, 15, 12])` renvoie une liste de 21 zéros, sauf `2` en case 12 et `1` en case 15.

<Indices>
<Indice>

Créer d'abord la liste de 21 zéros : `[0] * 21`.

</Indice>
<Indice>

Chaque note sert directement d'indice : `compte[note] = compte[note] + 1`.

</Indice>
<Indice>

```text
FONCTION histogramme(notes)
    compte ← liste de 21 zéros
    POUR CHAQUE note DE notes
        compte[note] ← compte[note] + 1
    RENVOYER compte
```

</Indice>
</Indices>

<Correction>

```python
def histogramme(notes: list) -> list:
    compte = [0] * 21
    for note in notes:
        compte[note] = compte[note] + 1
    return compte
```

</Correction>
</Enonce>
<Verification>

```python
h = histogramme([12, 15, 12])
assert len(h) == 21 and h[12] == 2 and h[15] == 1 and sum(h) == 3, "Deux 12 et un 15."
assert histogramme([]) == [0] * 21, "Aucune note : 21 zéros."
assert histogramme([0, 20, 20])[0] == 1 and histogramme([0, 20, 20])[20] == 2, "Les bornes 0 et 20."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-5-1" label="5.1 [Expert] - Crible d'Ératosthène" type="python">
<Enonce>
### Crible d'Ératosthène

Le crible d'Ératosthène trouve tous les nombres premiers jusqu'à `n` : on part de la liste des entiers de 2 à `n`, et pour chaque nombre encore « non barré », on barre tous ses multiples.

Écrire une fonction `crible(n)` qui renvoie la liste des nombres premiers inférieurs ou égaux à `n`, en appliquant cette méthode.

<Indices>
<Indice>

Une liste de booléens `est_premier` de taille `n + 1` : la case `k` dit si `k` est encore non barré.

</Indice>
<Indice>

Pour chaque `k` non barré, barrer `2k`, `3k`… avec `range(2 * k, n + 1, k)`. On peut même commencer à `k * k`.

</Indice>
<Indice>

Il reste à rassembler les indices restés à `True`, à partir de 2.

</Indice>
<Indice>

```text
FONCTION crible(n)
    est_premier ← liste de n + 1 valeurs VRAI
    POUR k ALLANT DE 2 À n
        SI est_premier[k] ALORS
            POUR m ALLANT DE k × k À n PAR PAS DE k : est_premier[m] ← FAUX
    RENVOYER la liste des k de 2 à n tels que est_premier[k]
```

</Indice>
</Indices>

<Correction>

```python
def crible(n: int) -> list:
    est_premier = [True] * (n + 1)
    for k in range(2, n + 1):
        if est_premier[k]:
            for m in range(k * k, n + 1, k):
                est_premier[m] = False
    premiers = []
    for k in range(2, n + 1):
        if est_premier[k]:
            premiers.append(k)
    return premiers
```

</Correction>
</Enonce>
<Verification>

```python
assert crible(30) == [2, 3, 5, 7, 11, 13, 17, 19, 23, 29], "Jusqu'à 30."
assert crible(1) == [] and crible(2) == [2], "Petites valeurs."
assert len(crible(100000)) == 9592, "9592 nombres premiers jusqu'à 100 000 (et le calcul doit rester rapide)."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-5-2" label="5.2 [Expert] - Meilleure affaire" type="python">
<Enonce>
### Meilleure affaire

La liste `prix` donne le cours d'une action jour après jour. On peut l'acheter un jour et la revendre un jour **plus tard**.

Écrire une fonction `meilleur_gain(prix)` qui renvoie le plus grand gain possible (0 si aucun gain n'est possible).

Contrainte : un seul parcours de la liste (pas de boucles imbriquées).

<Indices>
<Indice>

Si l'on revend au jour `i`, il fallait acheter au plus bas prix vu **avant** le jour `i`.

</Indice>
<Indice>

Pendant le parcours, tenir à jour deux valeurs : le prix minimal rencontré et le meilleur gain trouvé.

</Indice>
<Indice>

```text
FONCTION meilleur_gain(prix)
    SI prix vide ALORS RENVOYER 0
    plus_bas ← prix[0] ; gain ← 0
    POUR CHAQUE p DE prix
        gain ← max(gain, p - plus_bas)
        plus_bas ← min(plus_bas, p)
    RENVOYER gain
```

</Indice>
</Indices>

<Correction>

```python
def meilleur_gain(prix: list) -> float:
    if len(prix) == 0:
        return 0
    plus_bas = prix[0]
    gain = 0
    for p in prix:
        if p - plus_bas > gain:
            gain = p - plus_bas
        if p < plus_bas:
            plus_bas = p
    return gain
```

</Correction>
</Enonce>
<Verification>

```python
assert meilleur_gain([7, 1, 5, 3, 6, 4]) == 5, "Acheter à 1, vendre à 6 : 5."
assert meilleur_gain([7, 6, 4, 3, 1]) == 0, "Le cours ne fait que baisser : 0."
assert meilleur_gain([3, 8, 1, 4]) == 5, "Acheter à 3, vendre à 8 (vendre avant d'acheter est interdit)."
assert meilleur_gain([]) == 0 and meilleur_gain([5]) == 0, "Liste vide ou un seul jour."
import random
grands = [random.randint(1, 1000) for _ in range(200000)]
assert meilleur_gain(grands) <= 999, "Une longue liste se traite rapidement."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-5-3" label="5.3 [Expert] - Tranche de somme maximale" type="python">
<Enonce>
### Tranche de somme maximale

Écrire une fonction `somme_max(liste)` qui renvoie la plus grande somme d'une tranche d'éléments **consécutifs** (non vide) d'une liste non vide.

Exemple : dans `[-2, 1, -3, 4, -1, 2, 1, -5, 4]`, la tranche `[4, -1, 2, 1]` a la plus grande somme : 6.

Contrainte : un seul parcours de la liste.

<Indices>
<Indice>

Pour chaque position, se demander : quelle est la meilleure somme d'une tranche qui **se termine ici** ?

</Indice>
<Indice>

Cette somme vaut soit l'élément seul, soit l'élément ajouté à la meilleure somme qui se terminait juste avant : on garde le plus grand des deux.

</Indice>
<Indice>

```text
FONCTION somme_max(liste)
    ici ← liste[0] ; record ← liste[0]
    POUR i ALLANT DE 1 À longueur(liste) - 1
        ici ← max(liste[i], ici + liste[i])
        record ← max(record, ici)
    RENVOYER record
```

</Indice>
</Indices>

<Correction>

```python
def somme_max(liste: list) -> float:
    ici = liste[0]
    record = liste[0]
    for i in range(1, len(liste)):
        ici = max(liste[i], ici + liste[i])
        record = max(record, ici)
    return record
```

</Correction>
</Enonce>
<Verification>

```python
assert somme_max([-2, 1, -3, 4, -1, 2, 1, -5, 4]) == 6, "Exemple : 6."
assert somme_max([-3, -1, -2]) == -1, "Que des négatifs : le plus grand seul."
assert somme_max([5, -1, 5]) == 9 and somme_max([2]) == 2, "Toute la liste, puis un seul élément."
import random
grands = [random.randint(-50, 50) for _ in range(200000)]
assert somme_max(grands) >= max(grands), "Une longue liste se traite rapidement."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-5-4" label="5.4 [Expert] - Triangle de Pascal" type="python">
<Enonce>
### Triangle de Pascal

Dans le triangle de Pascal, chaque ligne commence et finit par 1, et chaque autre nombre est la somme des deux nombres situés au-dessus de lui :

```
1
1 1
1 2 1
1 3 3 1
```

Écrire une fonction `ligne_pascal(n)` qui renvoie la ligne numéro `n` (la première ligne est la ligne 0) sous forme de liste.

<Indices>
<Indice>

Partir de la ligne 0, `[1]`, et construire les lignes suivantes une par une à partir de la précédente.

</Indice>
<Indice>

La nouvelle ligne vaut `[1]`, puis les sommes `precedente[i] + precedente[i + 1]`, puis `[1]`.

</Indice>
<Indice>

```text
FONCTION ligne_pascal(n)
    ligne ← [1]
    RÉPÉTER n FOIS
        nouvelle ← [1]
        POUR i ALLANT DE 0 À longueur(ligne) - 2
            ajouter ligne[i] + ligne[i + 1] à nouvelle
        ajouter 1 à nouvelle
        ligne ← nouvelle
    RENVOYER ligne
```

</Indice>
</Indices>

<Correction>

```python
def ligne_pascal(n: int) -> list:
    ligne = [1]
    for _ in range(n):
        nouvelle = [1]
        for i in range(len(ligne) - 1):
            nouvelle.append(ligne[i] + ligne[i + 1])
        nouvelle.append(1)
        ligne = nouvelle
    return ligne
```

</Correction>
</Enonce>
<Verification>

```python
assert ligne_pascal(0) == [1] and ligne_pascal(1) == [1, 1], "Lignes 0 et 1."
assert ligne_pascal(3) == [1, 3, 3, 1] and ligne_pascal(4) == [1, 4, 6, 4, 1], "Lignes 3 et 4."
assert ligne_pascal(20)[10] == 184756 and len(ligne_pascal(20)) == 21, "Ligne 20."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-6-1" label="6.1 [Mini-projet] - Mastermind : l'ordinateur cherche" type="python">
<Enonce>
### Mastermind : l'ordinateur cherche

**Contexte.** Au Mastermind, un joueur cache un code de 4 pions de couleur ; l'autre doit le retrouver. Après chaque essai, il apprend combien de pions sont de la bonne couleur à la bonne place (**bien placés**) et combien sont de la bonne couleur mais ailleurs (**mal placés**). Le but du projet est un ordinateur qui joue le rôle du chercheur et trouve **toujours** le code en 9 essais au plus, avec 6 couleurs possibles.

**Les données** : un code est une liste de couleurs, par exemple `["R", "V", "R", "B"]`, les couleurs étant choisies parmi `"RVBJOM"`. La réponse à un essai est le tuple `(bien_places, mal_places)` ; chaque pion du secret ne compte qu'une fois. L'**historique** d'une partie est la liste des couples `(essai, reponse)` déjà joués.

**Les fonctions du programme**
- `evaluer(secret, essai)` : l'arbitre, qui répond à un essai. Reçoit le code secret et l'essai ; renvoie la réponse. Exemple : `evaluer(["R","R","V","B"], ["V","R","R","R"])` vaut `(1, 2)`.
- `tous_les_codes(couleurs, n)` : la liste de départ des codes possibles. Reçoit les couleurs et le nombre de pions ; renvoie tous les codes, dans l'ordre « du dictionnaire » des couleurs données (pour `"AB"` et `n = 2` : `AA`, `AB`, `BA`, `BB`), sans `itertools`.
- `coherent(code, historique)` : permet d'éliminer les codes impossibles. Renvoie `True` si `code` aurait donné les mêmes réponses à tous les essais de l'historique s'il était le secret.
- `ordinateur(historique, couleurs, n)` : le coup suivant de l'ordinateur. Renvoie le premier code de `tous_les_codes(couleurs, n)` cohérent avec l'historique.
- `resoudre(secret, couleurs)` : une partie complète, pour mesurer l'efficacité de l'ordinateur. Renvoie la liste de ses essais, jusqu'au bon code compris. Avec 6 couleurs et 4 pions, il doit trouver en 9 essais au plus, et rapidement.

<Indices>
<Indice>

Pour les mal placés, compter les pions communs (pour chaque couleur, le minimum des deux comptes) puis retirer les bien placés.

</Indice>
<Indice>

`tous_les_codes` se construit étape par étape : partir de `[[]]`, puis, `n` fois, prolonger chaque code partiel par chacune des couleurs.

</Indice>
<Indice>

Pour aller vite dans `resoudre`, garder la liste des codes encore possibles et la **filtrer** après chaque réponse, plutôt que de tout revérifier depuis le début.

</Indice>
<Indice>

```text
(cœur du programme : la stratégie de l'ordinateur)
FONCTION resoudre(secret, couleurs)
    possibles ← tous_les_codes(couleurs, longueur(secret)) ; essais ← []
    RÉPÉTER
        essai ← possibles[0] ; ajouter essai à essais
        reponse ← evaluer(secret, essai)
        SI reponse = (longueur(secret), 0) ALORS RENVOYER essais
        possibles ← [c POUR c DANS possibles SI evaluer(c, essai) = reponse]
```

</Indice>
</Indices>

<Correction>

```python
def evaluer(secret: list, essai: list) -> tuple:
    bien = 0
    for i in range(len(secret)):
        if secret[i] == essai[i]:
            bien = bien + 1
    communs = 0
    for couleur in set(essai):
        communs = communs + min(secret.count(couleur), essai.count(couleur))
    return (bien, communs - bien)


def tous_les_codes(couleurs: str, n: int) -> list:
    codes = [[]]
    for _ in range(n):
        nouveaux = []
        for code in codes:
            for c in couleurs:
                nouveaux.append(code + [c])
        codes = nouveaux
    return codes


def coherent(code: list, historique: list) -> bool:
    for essai, reponse in historique:
        if evaluer(code, essai) != reponse:
            return False
    return True


def ordinateur(historique: list, couleurs: str, n: int):
    for code in tous_les_codes(couleurs, n):
        if coherent(code, historique):
            return code
    return None


def resoudre(secret: list, couleurs: str) -> list:
    possibles = tous_les_codes(couleurs, len(secret))
    essais = []
    while True:
        essai = possibles[0]
        essais.append(essai)
        reponse = evaluer(secret, essai)
        if reponse == (len(secret), 0):
            return essais
        possibles = [c for c in possibles if evaluer(c, essai) == reponse]
```

</Correction>
</Enonce>
<Verification>

```python
import random
assert evaluer(["R", "R", "V", "B"], ["V", "R", "R", "R"]) == (1, 2), "Exemple de l'énoncé."
assert evaluer(list("RVBJ"), list("RVBJ")) == (4, 0) and evaluer(list("RRRR"), list("VVVV")) == (0, 0), "Tout juste, tout faux."
assert evaluer(list("RVBJ"), list("JBVR")) == (0, 4), "Tout mal placé."
assert tous_les_codes("AB", 2) == [["A", "A"], ["A", "B"], ["B", "A"], ["B", "B"]], "Codes de 2 pions."
assert len(tous_les_codes("RVBJOM", 4)) == 1296 and tous_les_codes("RVBJOM", 4)[7] == list("RRVV"), "1296 codes, dans l'ordre."
h = [(list("RRVV"), (1, 1))]
assert coherent(list("RBRB"), h) and not coherent(list("RRBB"), h), "Cohérence avec l'historique."
assert ordinateur([], "RVBJOM", 4) == list("RRRR") and ordinateur(h, "RVBJOM", 4) == list("RVBB"), "Premier code cohérent."
for secret in [list("OMJB"), list("MMMM"), list("RRRR"), list("BJRV")] + [[random.choice("RVBJOM") for _ in range(4)] for _ in range(40)]:
    essais = resoudre(secret, "RVBJOM")
    assert essais[-1] == secret and len(essais) <= 9, f"Le code {''.join(secret)} est trouvé en 9 essais au plus."
    assert all(coherent(essais[k], [(e, evaluer(secret, e)) for e in essais[:k]]) for k in range(len(essais))), "Chaque essai respecte les réponses précédentes."
assert "itertools" not in PROGRAMME, "Sans itertools."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-listes-6-2" label="6.2 [Mini-projet] - Classement du championnat" type="python">
<Enonce>
### Classement du championnat

**Contexte.** L'association sportive du lycée organise un championnat de football entre établissements. Le responsable saisit les scores au fur et à mesure et veut que le site de l'association affiche automatiquement le classement, la fiche de chaque équipe, sa forme du moment et le bilan des confrontations directes.

**Les données** : les matchs sont rangés dans une liste, chaque match étant une liste `[domicile, exterieur, buts_domicile, buts_exterieur]`, par exemple `["Lyon", "Metz", 2, 0]`. Une victoire rapporte 3 points, un nul 1, une défaite 0.

**Les fonctions du site**
- `equipes(matchs)` : la liste des engagés. Renvoie la liste triée des équipes, sans doublon.
- `bilan(matchs, equipe)` : la fiche d'une équipe, base de toutes les autres fonctions. Renvoie la liste `[joues, gagnes, nuls, perdus, buts_pour, buts_contre, difference, points]`.
- `classement(matchs)` : le tableau affiché en page d'accueil. Renvoie la liste des équipes, de la première à la dernière : par points, puis différence de buts, puis buts marqués (décroissants), puis par ordre alphabétique. Ce classement est **trié à la main**, sans `sort` ni `sorted`.
- `forme(matchs, equipe, k)` : les petites pastilles de forme affichées à côté de chaque équipe. Renvoie le texte des `k` derniers résultats de l'équipe, du plus ancien au plus récent (`"V"`, `"N"` ou `"D"`), par exemple `"VVNDV"` (moins de `k` lettres si l'équipe a moins joué).
- `invincibilite(matchs, equipe)` : une statistique mise en avant. Renvoie la plus longue suite de matchs consécutifs de l'équipe sans défaite.
- `face_a_face(matchs, a, b)` : l'avant-match entre deux équipes. Renvoie la liste `[victoires de a, nuls, victoires de b]` sur leurs confrontations.

<Indices>
<Indice>

`bilan` est la fonction centrale : parcourir les matchs où l'équipe joue, en distinguant si elle est à domicile ou à l'extérieur. Les autres fonctions s'appuient dessus.

</Indice>
<Indice>

Pour trier à la main, une fonction `devant(a, b)` qui dit si l'équipe `a` doit être classée avant `b` simplifie le tri par insertion. Comparer des listes `[points, difference, buts_pour]` fait déjà l'essentiel.

</Indice>
<Indice>

Une fonction `resultats(matchs, equipe)` qui renvoie la liste des lettres `V`, `N`, `D` dans l'ordre sert à `forme` et à `invincibilite`.

</Indice>
<Indice>

```text
(cœur du programme : le classement par insertion)
FONCTION devant(a, b) : comparer (points, différence, buts pour) de a et de b, puis les noms
FONCTION classement(matchs)
    liste ← liste vide
    POUR CHAQUE e DE equipes(matchs)
        i ← longueur(liste)
        TANT QUE i > 0 ET devant(e, liste[i - 1]) : i ← i - 1
        insérer e à la position i de liste
    RENVOYER liste
```

</Indice>
</Indices>

<Correction>

```python
def equipes(matchs: list) -> list:
    noms = []
    for d, e, bd, be in matchs:
        for nom in (d, e):
            if nom not in noms:
                noms.append(nom)
    return sorted(noms)


def bilan(matchs: list, equipe: str) -> list:
    j = g = n = p = bp = bc = 0
    for d, e, bd, be in matchs:
        if equipe == d:
            pour, contre = bd, be
        elif equipe == e:
            pour, contre = be, bd
        else:
            continue
        j = j + 1
        bp = bp + pour
        bc = bc + contre
        if pour > contre:
            g = g + 1
        elif pour == contre:
            n = n + 1
        else:
            p = p + 1
    return [j, g, n, p, bp, bc, bp - bc, 3 * g + n]


def devant(matchs: list, a: str, b: str) -> bool:
    ba, bb = bilan(matchs, a), bilan(matchs, b)
    cle_a = [ba[7], ba[6], ba[4]]
    cle_b = [bb[7], bb[6], bb[4]]
    if cle_a != cle_b:
        return cle_a > cle_b
    return a < b


def classement(matchs: list) -> list:
    liste = []
    for e in equipes(matchs):
        i = len(liste)
        while i > 0 and devant(matchs, e, liste[i - 1]):
            i = i - 1
        liste.insert(i, e)
    return liste


def resultats(matchs: list, equipe: str) -> list:
    lettres = []
    for d, e, bd, be in matchs:
        if equipe in (d, e):
            pour, contre = (bd, be) if equipe == d else (be, bd)
            lettres.append("V" if pour > contre else ("N" if pour == contre else "D"))
    return lettres


def forme(matchs: list, equipe: str, k: int) -> str:
    return "".join(resultats(matchs, equipe)[-k:]) if k > 0 else ""


def invincibilite(matchs: list, equipe: str) -> int:
    en_cours = record = 0
    for r in resultats(matchs, equipe):
        en_cours = en_cours + 1 if r != "D" else 0
        record = max(record, en_cours)
    return record


def face_a_face(matchs: list, a: str, b: str) -> list:
    bilan_ab = [0, 0, 0]
    for d, e, bd, be in matchs:
        if {d, e} == {a, b}:
            buts_a, buts_b = (bd, be) if d == a else (be, bd)
            if buts_a > buts_b:
                bilan_ab[0] += 1
            elif buts_a == buts_b:
                bilan_ab[1] += 1
            else:
                bilan_ab[2] += 1
    return bilan_ab
```

</Correction>
</Enonce>
<Verification>

```python
M = [
    ["Lyon", "Metz", 2, 0], ["Brest", "Nice", 1, 1], ["Metz", "Brest", 3, 1], ["Nice", "Lyon", 0, 0],
    ["Lyon", "Brest", 1, 2], ["Metz", "Nice", 2, 2], ["Brest", "Lyon", 0, 3], ["Nice", "Metz", 4, 1],
    ["Lyon", "Nice", 1, 1], ["Brest", "Metz", 2, 2],
]
assert equipes(M) == ["Brest", "Lyon", "Metz", "Nice"], "Quatre équipes, triées."
assert bilan(M, "Lyon") == [5, 2, 2, 1, 7, 3, 4, 8], "Bilan de Lyon."
assert bilan(M, "Nice") == [5, 1, 4, 0, 8, 5, 3, 7] and bilan(M, "Paris") == [0, 0, 0, 0, 0, 0, 0, 0], "Bilan de Nice ; équipe absente."
assert classement(M) == ["Lyon", "Nice", "Metz", "Brest"], "Classement."
egal = [["B", "A", 1, 1], ["C", "D", 0, 0]]
assert classement(egal) == ["A", "B", "C", "D"], "Égalité parfaite : ordre alphabétique (A et B ont marqué plus que C et D)."
assert forme(M, "Lyon", 3) == "DVN" and forme(M, "Metz", 10) == "DVNDN", "Forme récente."
assert invincibilite(M, "Nice") == 5 and invincibilite(M, "Lyon") == 2, "Séries sans défaite."
assert face_a_face(M, "Lyon", "Brest") == [1, 0, 1] and face_a_face(M, "Nice", "Lyon") == [0, 2, 0], "Confrontations."
import re
corps = PROGRAMME.split("def classement", 1)[-1].split("\ndef ", 1)[0]
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", corps), "Le classement est trié à la main."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
