---
title: 'Exercices : Les listes de listes'
description: 'Tableaux à deux dimensions : lire et modifier une case, parcourir lignes et colonnes, grilles de jeux et images : fiche progressive par niveau.'
icon: "hash"
chapter: Structures de données linéaires
badgeId: premiere_exercices_listes_2d
meta: 'Listes de listes en Python : tableaux à deux dimensions, double indice, parcours de lignes et de colonnes, grilles de jeux'
level: premiere
prerequisites:
  - python_exercices_listes
audience: public
---

Une liste peut contenir d'autres listes : on obtient un tableau à deux dimensions, fait de lignes et de colonnes. Les **premiers pas** reprennent les gestes de base (lire une case, modifier une case, parcourir les lignes, parcourir toutes les cases), avec un pense-bête de syntaxe à côté de chaque énoncé. Les exercices vont ensuite de **Introduction** à **Expert** (grilles de jeux, images, chemins dans un tableau), puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

## Exemple : un tableau de notes

Trois élèves ont passé trois contrôles. Leurs notes se rangent dans une liste de trois lignes, une par élève :

```python
notes = [
    [12, 15, 9],    # ligne 0 : Ada
    [8, 14, 11],    # ligne 1 : Alan
    [17, 10, 13],   # ligne 2 : Grace
]
```

`notes[1]` est la ligne d'Alan, `[8, 14, 11]`. Dans cette ligne, l'élément d'indice 2 est la note du troisième contrôle, donc `notes[1][2]` vaut `11`. Le premier indice choisit la ligne, le second la colonne.

| Écriture | Valeur | Rôle |
|---|---|---|
| `notes[1]` | `[8, 14, 11]` | la ligne d'indice 1 |
| `notes[1][2]` | `11` | la case de la ligne 1, colonne 2 |
| `len(notes)` | `3` | le nombre de lignes |
| `len(notes[0])` | `3` | le nombre de colonnes |

Pour passer par toutes les cases, deux boucles s'imbriquent : la première parcourt les lignes, la seconde les colonnes de chaque ligne.

```python
for i in range(len(notes)):
    for j in range(len(notes[i])):
        print(i, j, notes[i][j])
```

<ExerciseTabs courseId="listes-de-listes-premiere" courseTitle="Les listes de listes">

<ExerciseSection id="1nsi-l2d-0-1" label="0.1 [Premiers pas] - Lire une case" type="python">
<Enonce>
### Lire une case

Le tableau `grille` est déjà écrit dans l'éditeur :

```python
grille = [
    [1, 2, 3],
    [4, 5, 6],
]
```

Ranger dans la variable `valeur` la case de la ligne 1 et de la colonne 2, et dans la variable `coin` la case de la ligne 0 et de la colonne 0, puis afficher ces deux variables.

Affichage attendu :

```
6
1
```

<PostIt>

- `grille[i]` : la ligne d'indice `i`, qui est une liste
- `grille[i][j]` : la case de la ligne `i`, colonne `j`
- les indices commencent à 0
- d'abord la ligne, ensuite la colonne

</PostIt>

<Indices>
<Indice>

La ligne d'indice 1 est `[4, 5, 6]`. Son élément d'indice 2 est `6`.

</Indice>
<Indice>

Les deux indices s'écrivent l'un après l'autre, chacun entre crochets : `grille[1][2]`.

</Indice>
<Indice>

```text
valeur ← grille[1][2]
coin ← grille[0][0]
AFFICHER valeur
AFFICHER coin
```

</Indice>
</Indices>

<Correction>

```python
grille = [
    [1, 2, 3],
    [4, 5, 6],
]
valeur = grille[1][2]
coin = grille[0][0]
print(valeur)
print(coin)
```

</Correction>
</Enonce>
<CodeDepart>

```python
grille = [
    [1, 2, 3],
    [4, 5, 6],
]
```

</CodeDepart>
<Verification>

```python
import re
assert valeur == 6, "valeur est la case de la ligne 1, colonne 2 : 6."
assert coin == 1, "coin est la case de la ligne 0, colonne 0 : 1."
assert re.search(r"grille\[1\]\[2\]", PROGRAMME), "Lire la case avec grille[1][2]."
assert SORTIE.split() == ["6", "1"], "Afficher valeur puis coin."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-0-2" label="0.2 [Premiers pas] - Lignes et dimensions" type="python">
<Enonce>
### Lignes et dimensions

Le tableau `notes` est déjà écrit dans l'éditeur. Chaque ligne contient les notes d'un élève :

```python
notes = [
    [12, 15, 9],
    [8, 14, 11],
    [17, 10, 13],
    [9, 12, 16],
]
```

Ranger dans `deuxieme` la ligne d'indice 1 tout entière, dans `nb_lignes` le nombre de lignes du tableau et dans `nb_colonnes` le nombre de colonnes, puis afficher ces trois variables. Les nombres ne doivent pas être écrits à la main.

Affichage attendu :

```
[8, 14, 11]
4
3
```

<PostIt>

- `notes[1]` : une ligne entière, qui est une liste
- `len(notes)` : le nombre de lignes
- `len(notes[0])` : le nombre de cases de la première ligne, donc de colonnes
- toutes les lignes ont ici la même longueur

</PostIt>

<Indices>
<Indice>

Avec un seul indice, on obtient une ligne : `notes[1]`.

</Indice>
<Indice>

`len` appliqué au tableau compte ses lignes. Appliqué à une ligne, il compte ses cases.

</Indice>
<Indice>

```text
deuxieme ← notes[1]
nb_lignes ← longueur(notes)
nb_colonnes ← longueur(notes[0])
AFFICHER deuxieme, nb_lignes, nb_colonnes
```

</Indice>
</Indices>

<Correction>

```python
notes = [
    [12, 15, 9],
    [8, 14, 11],
    [17, 10, 13],
    [9, 12, 16],
]
deuxieme = notes[1]
nb_lignes = len(notes)
nb_colonnes = len(notes[0])
print(deuxieme)
print(nb_lignes)
print(nb_colonnes)
```

</Correction>
</Enonce>
<CodeDepart>

```python
notes = [
    [12, 15, 9],
    [8, 14, 11],
    [17, 10, 13],
    [9, 12, 16],
]
```

</CodeDepart>
<Verification>

```python
import re
assert deuxieme == [8, 14, 11], "deuxieme est la ligne d'indice 1 : [8, 14, 11]."
assert nb_lignes == 4 and nb_colonnes == 3, "4 lignes et 3 colonnes."
assert PROGRAMME.count("len(") >= 2, "Calculer les dimensions avec len."
assert not re.search(r"nb_lignes\s*=\s*\d|nb_colonnes\s*=\s*\d", PROGRAMME), "Les dimensions ne sont pas écrites à la main."
assert SORTIE.strip().splitlines() == ["[8, 14, 11]", "4", "3"], "Afficher deuxieme, nb_lignes puis nb_colonnes."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-0-3" label="0.3 [Premiers pas] - Modifier une case" type="python">
<Enonce>
### Modifier une case

Le plateau d'un morpion est déjà écrit dans l'éditeur. Chaque case vide contient `"."` :

```python
plateau = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
]
```

Placer un `"X"` dans la case du centre et un `"O"` dans la case en haut à droite, puis afficher le plateau ligne par ligne.

Affichage attendu :

```
['.', '.', 'O']
['.', 'X', '.']
['.', '.', '.']
```

<PostIt>

- `plateau[i][j] = valeur` : change la case de la ligne `i`, colonne `j`
- le centre d'un plateau 3 × 3 : ligne 1, colonne 1
- en haut à droite : ligne 0, colonne 2
- `for ligne in plateau:` puis `print(ligne)` : une ligne par affichage

</PostIt>

<Indices>
<Indice>

Une case se modifie comme un élément de liste, avec ses deux indices : `plateau[1][1] = "X"`.

</Indice>
<Indice>

Une boucle `for` sur le plateau donne les lignes une par une. Chacune s'affiche avec `print`.

</Indice>
<Indice>

```text
plateau[1][1] ← "X"
plateau[0][2] ← "O"
POUR CHAQUE ligne DE plateau
    AFFICHER ligne
```

</Indice>
</Indices>

<Correction>

```python
plateau = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
]
plateau[1][1] = "X"
plateau[0][2] = "O"
for ligne in plateau:
    print(ligne)
```

</Correction>
</Enonce>
<CodeDepart>

```python
plateau = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
]
```

</CodeDepart>
<Verification>

```python
import re
assert plateau == [[".", ".", "O"], [".", "X", "."], [".", ".", "."]], "Un X au centre, un O en haut à droite."
assert re.search(r"plateau\[1\]\[1\]\s*=", PROGRAMME) and re.search(r"plateau\[0\]\[2\]\s*=", PROGRAMME), "Modifier les cases avec leurs deux indices."
assert SORTIE.strip().splitlines() == ["['.', '.', 'O']", "['.', 'X', '.']", "['.', '.', '.']"], "Afficher le plateau ligne par ligne."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-0-4" label="0.4 [Premiers pas] - Parcourir les lignes" type="python">
<Enonce>
### Parcourir les lignes

Le tableau `notes` est déjà écrit dans l'éditeur, avec une ligne par élève :

```python
notes = [
    [12, 15, 9],
    [8, 14, 11],
    [17, 10, 13],
]
```

Avec une boucle `for` qui parcourt les lignes, afficher le total des notes de chaque élève, un total par ligne. Construire aussi la liste `totaux` de ces trois totaux.

Affichage attendu :

```
36
33
40
```

<PostIt>

- `for ligne in notes:` : `ligne` prend la valeur de chaque ligne, une liste
- `sum(ligne)` : la somme des nombres d'une liste
- `totaux = []` avant la boucle, puis `totaux.append(...)`
- `print(...)` dans la boucle : un affichage par ligne

</PostIt>

<Indices>
<Indice>

À chaque tour de boucle, `ligne` est une liste de trois notes, par exemple `[12, 15, 9]`.

</Indice>
<Indice>

Calculer le total avec `sum(ligne)`, l'afficher, puis l'ajouter à `totaux`.

</Indice>
<Indice>

```text
totaux ← liste vide
POUR CHAQUE ligne DE notes
    total ← somme de ligne
    AFFICHER total
    ajouter total à totaux
```

</Indice>
</Indices>

<Correction>

```python
notes = [
    [12, 15, 9],
    [8, 14, 11],
    [17, 10, 13],
]
totaux = []
for ligne in notes:
    total = sum(ligne)
    print(total)
    totaux.append(total)
```

</Correction>
</Enonce>
<CodeDepart>

```python
notes = [
    [12, 15, 9],
    [8, 14, 11],
    [17, 10, 13],
]
```

</CodeDepart>
<Verification>

```python
import re
assert totaux == [36, 33, 40], "totaux vaut [36, 33, 40]."
assert re.search(r"for\s+\w+\s+in\s+notes\s*:", PROGRAMME), "Parcourir les lignes avec for ... in notes."
assert "36" not in PROGRAMME and "40" not in PROGRAMME, "Calculer les totaux plutôt que les écrire."
assert SORTIE.split() == ["36", "33", "40"], "Afficher un total par ligne."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-0-5" label="0.5 [Premiers pas] - Parcourir toutes les cases" type="python">
<Enonce>
### Parcourir toutes les cases

Le tableau `grille` est déjà écrit dans l'éditeur :

```python
grille = [
    [3, 8, 1, 6],
    [7, 2, 9, 4],
    [5, 0, 6, 2],
]
```

Avec deux boucles imbriquées qui parcourent les indices, calculer dans la variable `total` la somme de toutes les cases, et dans `nb_pairs` le nombre de cases paires, puis afficher ces deux variables.

Contrainte : sans `sum`.

Affichage attendu :

```
53
7
```

<PostIt>

```python
for i in range(len(grille)):
    for j in range(len(grille[i])):
        ...  # grille[i][j] : la case (i, j)
```

- la boucle sur `i` parcourt les lignes, celle sur `j` les colonnes
- `x % 2 == 0` : vrai si `x` est pair

</PostIt>

<Indices>
<Indice>

Les deux variables commencent à 0, avant les boucles.

</Indice>
<Indice>

Dans la boucle intérieure, ajouter `grille[i][j]` à `total`, et augmenter `nb_pairs` de 1 si la case est paire.

</Indice>
<Indice>

```text
total ← 0 ; nb_pairs ← 0
POUR i ALLANT DE 0 À longueur(grille) - 1
    POUR j ALLANT DE 0 À longueur(grille[i]) - 1
        total ← total + grille[i][j]
        SI grille[i][j] est pair ALORS nb_pairs ← nb_pairs + 1
AFFICHER total, nb_pairs
```

</Indice>
</Indices>

<Correction>

```python
grille = [
    [3, 8, 1, 6],
    [7, 2, 9, 4],
    [5, 0, 6, 2],
]
total = 0
nb_pairs = 0
for i in range(len(grille)):
    for j in range(len(grille[i])):
        total = total + grille[i][j]
        if grille[i][j] % 2 == 0:
            nb_pairs = nb_pairs + 1
print(total)
print(nb_pairs)
```

</Correction>
</Enonce>
<CodeDepart>

```python
grille = [
    [3, 8, 1, 6],
    [7, 2, 9, 4],
    [5, 0, 6, 2],
]
```

</CodeDepart>
<Verification>

```python
import re
assert total == 53, "La somme de toutes les cases vaut 53."
assert nb_pairs == 7, "7 cases sont paires (0 compris)."
assert len(re.findall(r"\bfor\b", PROGRAMME)) >= 2, "Deux boucles imbriquées."
assert "sum(" not in PROGRAMME, "Sans sum."
assert SORTIE.split() == ["53", "7"], "Afficher total puis nb_pairs."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-0-6" label="0.6 [Premiers pas] - Construire une grille" type="python">
<Enonce>
### Construire une grille

Construire, avec des boucles et `append`, le tableau `grille` de 3 lignes et 4 colonnes dont toutes les cases valent 0. Placer ensuite un 1 dans la case de la ligne 0, colonne 3, puis afficher la grille ligne par ligne.

Contrainte : l'écriture `[[0] * 4] * 3` est interdite, car elle crée trois fois **la même** ligne.

Affichage attendu :

```
[0, 0, 0, 1]
[0, 0, 0, 0]
[0, 0, 0, 0]
```

<PostIt>

- `grille = []` : le tableau, vide au départ
- une nouvelle ligne à chaque tour : `ligne = []`
- `ligne.append(0)` remplit la ligne, `grille.append(ligne)` l'ajoute au tableau
- `[[0] * 4] * 3` répète trois fois la même liste : modifier une case modifie les trois lignes

</PostIt>

<Indices>
<Indice>

La boucle extérieure tourne 3 fois, une fois par ligne. À chaque tour, elle crée une ligne vide, la remplit, puis l'ajoute à `grille`.

</Indice>
<Indice>

La boucle intérieure tourne 4 fois et ajoute un 0 à la ligne.

</Indice>
<Indice>

```text
grille ← liste vide
RÉPÉTER 3 FOIS
    ligne ← liste vide
    RÉPÉTER 4 FOIS
        ajouter 0 à ligne
    ajouter ligne à grille
grille[0][3] ← 1
POUR CHAQUE ligne DE grille : AFFICHER ligne
```

</Indice>
</Indices>

<Correction>

```python
grille = []
for i in range(3):
    ligne = []
    for j in range(4):
        ligne.append(0)
    grille.append(ligne)
grille[0][3] = 1
for ligne in grille:
    print(ligne)
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert grille == [[0, 0, 0, 1], [0, 0, 0, 0], [0, 0, 0, 0]], "Seule la case (0, 3) vaut 1."
assert grille[0] is not grille[1] and grille[1] is not grille[2], "Chaque ligne est une liste différente."
assert ".append(" in PROGRAMME and not re.search(r"\]\s*\*\s*3", PROGRAMME), "Construire avec append, sans [[0] * 4] * 3."
assert SORTIE.strip().splitlines() == ["[0, 0, 0, 1]", "[0, 0, 0, 0]", "[0, 0, 0, 0]"], "Afficher la grille ligne par ligne."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-0-7" label="0.7 [Premiers pas] - Lire une colonne" type="python">
<Enonce>
### Lire une colonne

Le tableau `notes` est déjà écrit dans l'éditeur, avec une ligne par élève et une colonne par contrôle :

```python
notes = [
    [12, 15, 9],
    [8, 14, 11],
    [17, 10, 13],
]
```

Une colonne n'est pas rangée dans une seule liste : il faut prendre la même case dans chaque ligne. Construire la liste `controle_2` des notes du contrôle d'indice 1 (la deuxième colonne), puis l'afficher. Ajouter ensuite un quatrième élève, dont les notes sont `[11, 13, 15]`, et afficher le nombre de lignes.

Affichage attendu :

```
[15, 14, 10]
4
```

<PostIt>

- `ligne[1]` : la case d'indice 1 d'une ligne
- `for ligne in notes:` puis `controle_2.append(ligne[1])`
- `notes.append([11, 13, 15])` : ajoute une ligne entière à la fin
- `len(notes)` : le nombre de lignes

</PostIt>

<Indices>
<Indice>

La deuxième colonne est formée de `notes[0][1]`, `notes[1][1]` et `notes[2][1]`.

</Indice>
<Indice>

Une boucle sur les lignes ajoute à `controle_2` la case d'indice 1 de chacune.

</Indice>
<Indice>

```text
controle_2 ← liste vide
POUR CHAQUE ligne DE notes
    ajouter ligne[1] à controle_2
AFFICHER controle_2
ajouter [11, 13, 15] à notes
AFFICHER longueur(notes)
```

</Indice>
</Indices>

<Correction>

```python
notes = [
    [12, 15, 9],
    [8, 14, 11],
    [17, 10, 13],
]
controle_2 = []
for ligne in notes:
    controle_2.append(ligne[1])
print(controle_2)
notes.append([11, 13, 15])
print(len(notes))
```

</Correction>
</Enonce>
<CodeDepart>

```python
notes = [
    [12, 15, 9],
    [8, 14, 11],
    [17, 10, 13],
]
```

</CodeDepart>
<Verification>

```python
assert controle_2 == [15, 14, 10], "La deuxième colonne : [15, 14, 10]."
assert notes[-1] == [11, 13, 15] and len(notes) == 4, "Le quatrième élève est ajouté à la fin."
assert "[15, 14, 10]" not in PROGRAMME, "Construire la colonne avec une boucle."
assert SORTIE.strip().splitlines() == ["[15, 14, 10]", "4"], "Afficher la colonne, puis le nombre de lignes."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-1-1" label="1.1 [Introduction] - Nombre de cases" type="python">
<Enonce>
### Nombre de cases

Écrire une fonction `nb_cases(grille)` qui renvoie le nombre total de cases d'un tableau. Les lignes n'ont pas forcément toutes la même longueur.

Exemple : `nb_cases([[1, 2], [3], [4, 5, 6]])` renvoie `6`.

<PostIt>

- `for ligne in grille:` : chaque ligne
- `len(ligne)` : le nombre de cases d'une ligne
- un compteur qui démarre à 0
- `[]` n'a aucune ligne, `[[]]` a une ligne vide

</PostIt>

<Indices>
<Indice>

Le nombre de cases est la somme des longueurs des lignes.

</Indice>
<Indice>

Parcourir les lignes et ajouter `len(ligne)` à un compteur.

</Indice>
<Indice>

```text
FONCTION nb_cases(grille)
    n ← 0
    POUR CHAQUE ligne DE grille
        n ← n + longueur(ligne)
    RENVOYER n
```

</Indice>
</Indices>

<Correction>

```python
def nb_cases(grille: list) -> int:
    n = 0
    for ligne in grille:
        n = n + len(ligne)
    return n
```

</Correction>
</Enonce>
<Verification>

```python
assert nb_cases([[1, 2], [3], [4, 5, 6]]) == 6, "[[1, 2], [3], [4, 5, 6]] : 6 cases."
assert nb_cases([[0] * 4 for _ in range(3)]) == 12, "3 lignes de 4 cases : 12."
assert nb_cases([]) == 0 and nb_cases([[]]) == 0, "Aucune ligne, puis une ligne vide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-1-2" label="1.2 [Introduction] - Compter une valeur" type="python">
<Enonce>
### Compter une valeur

Écrire une fonction `compter(grille, valeur)` qui renvoie le nombre de cases de `grille` égales à `valeur`.

Exemple : dans `[["X", "O", "X"], [".", "X", "."]]`, la valeur `"X"` apparaît 3 fois.

Contrainte : sans la méthode `count`.

<PostIt>

- deux boucles : les lignes, puis les cases de chaque ligne
- `for case in ligne:` : chaque case d'une ligne
- `case == valeur` : la comparaison
- `count` est interdit ici

</PostIt>

<Indices>
<Indice>

Parcourir chaque case de chaque ligne, et augmenter un compteur quand la case vaut `valeur`.

</Indice>
<Indice>

La boucle intérieure peut parcourir directement les cases : `for case in ligne:`.

</Indice>
<Indice>

```text
FONCTION compter(grille, valeur)
    n ← 0
    POUR CHAQUE ligne DE grille
        POUR CHAQUE case DE ligne
            SI case = valeur ALORS n ← n + 1
    RENVOYER n
```

</Indice>
</Indices>

<Correction>

```python
def compter(grille: list, valeur) -> int:
    n = 0
    for ligne in grille:
        for case in ligne:
            if case == valeur:
                n = n + 1
    return n
```

</Correction>
</Enonce>
<Verification>

```python
assert compter([["X", "O", "X"], [".", "X", "."]], "X") == 3, "Trois X."
assert compter([["X", "O", "X"], [".", "X", "."]], "O") == 1 and compter([[1, 2], [3]], 7) == 0, "Un O, puis aucune case égale à 7."
assert compter([], 0) == 0 and compter([[0, 0], [0]], 0) == 3, "Tableau vide, puis lignes de longueurs différentes."
assert "count" not in PROGRAMME, "Sans count."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-1-3" label="1.3 [Introduction] - Plus grande valeur" type="python">
<Enonce>
### Plus grande valeur

Écrire une fonction `maximum(grille)` qui renvoie la plus grande valeur d'un tableau dont aucune ligne n'est vide.

Exemple : `maximum([[3, 8], [12, 1], [7, 5]])` renvoie `12`.

Contrainte : sans `max`.

<PostIt>

- `meilleur = grille[0][0]` : une première valeur candidate
- deux boucles pour voir toutes les cases
- `if case > meilleur:` : une valeur plus grande remplace la candidate
- `max` est interdit ici

</PostIt>

<Indices>
<Indice>

Partir de la première case comme maximum provisoire, puis la comparer à toutes les autres.

</Indice>
<Indice>

Ne pas partir de 0 : toutes les valeurs du tableau peuvent être négatives.

</Indice>
<Indice>

```text
FONCTION maximum(grille)
    meilleur ← grille[0][0]
    POUR CHAQUE ligne DE grille
        POUR CHAQUE case DE ligne
            SI case > meilleur ALORS meilleur ← case
    RENVOYER meilleur
```

</Indice>
</Indices>

<Correction>

```python
def maximum(grille: list):
    meilleur = grille[0][0]
    for ligne in grille:
        for case in ligne:
            if case > meilleur:
                meilleur = case
    return meilleur
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert maximum([[3, 8], [12, 1], [7, 5]]) == 12, "[[3, 8], [12, 1], [7, 5]] : 12."
assert maximum([[-4, -2], [-9]]) == -2, "Toutes les valeurs sont négatives : -2."
assert maximum([[5]]) == 5 and maximum([[1, 2, 3], [3, 2, 1]]) == 3, "Une seule case, puis un maximum présent deux fois."
assert not re.search(r"\bmax\s*\(", PROGRAMME), "Sans max."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-1-4" label="1.4 [Introduction] - Créer une grille" type="python">
<Enonce>
### Créer une grille

Écrire une fonction `creer_grille(n, p, valeur)` qui renvoie un nouveau tableau de `n` lignes et `p` colonnes dont toutes les cases valent `valeur`. Les lignes doivent être des listes différentes : modifier une case ne change qu'une seule ligne.

Exemple : `creer_grille(2, 3, ".")` renvoie `[[".", ".", "."], [".", ".", "."]]`.

<PostIt>

- `[valeur] * p` : **une** ligne de `p` cases
- une nouvelle ligne à chaque tour de boucle : `grille.append([valeur] * p)`
- `[[valeur] * p] * n` répète la même ligne : interdit ici
- `for _ in range(n):` : répéter `n` fois

</PostIt>

<Indices>
<Indice>

Une ligne s'écrit `[valeur] * p`. Le piège est de répéter cette même ligne `n` fois.

</Indice>
<Indice>

Avec une boucle, une nouvelle ligne est créée à chaque tour, puis ajoutée au tableau.

</Indice>
<Indice>

```text
FONCTION creer_grille(n, p, valeur)
    grille ← liste vide
    RÉPÉTER n FOIS
        ajouter une nouvelle ligne de p cases valant valeur à grille
    RENVOYER grille
```

</Indice>
</Indices>

<Correction>

```python
def creer_grille(n: int, p: int, valeur) -> list:
    grille = []
    for _ in range(n):
        grille.append([valeur] * p)
    return grille
```

</Correction>
</Enonce>
<Verification>

```python
g = creer_grille(2, 3, ".")
assert g == [[".", ".", "."], [".", ".", "."]], "creer_grille(2, 3, '.') : 2 lignes de 3 points."
g[0][0] = "X"
assert g[1][0] == ".", "Modifier une case ne change qu'une ligne : les lignes sont des listes différentes."
assert creer_grille(3, 1, 0) == [[0], [0], [0]] and creer_grille(0, 4, 1) == [], "3 lignes d'une case, puis aucune ligne."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-2-1" label="2.1 [Facile] - Sommes des lignes" type="python">
<Enonce>
### Sommes des lignes

Écrire une fonction `sommes_lignes(grille)` qui renvoie la liste des sommes de chaque ligne, dans l'ordre.

Exemple : `sommes_lignes([[1, 2, 3], [4, 5], []])` renvoie `[6, 9, 0]`.

Contrainte : sans `sum`.

<PostIt>

- `resultat = []` : la liste des sommes
- pour chaque ligne, un total qui repart de 0
- `for x in ligne:` puis `total = total + x`
- `resultat.append(total)` après la boucle intérieure

</PostIt>

<Indices>
<Indice>

Le total d'une ligne se remet à 0 au début de chaque ligne, donc dans la boucle extérieure.

</Indice>
<Indice>

Le total s'ajoute au résultat une fois la ligne entièrement parcourue, c'est-à-dire après la boucle intérieure.

</Indice>
<Indice>

```text
FONCTION sommes_lignes(grille)
    resultat ← liste vide
    POUR CHAQUE ligne DE grille
        total ← 0
        POUR CHAQUE x DE ligne : total ← total + x
        ajouter total à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def sommes_lignes(grille: list) -> list:
    resultat = []
    for ligne in grille:
        total = 0
        for x in ligne:
            total = total + x
        resultat.append(total)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert sommes_lignes([[1, 2, 3], [4, 5], []]) == [6, 9, 0], "[[1, 2, 3], [4, 5], []] : [6, 9, 0]."
assert sommes_lignes([[12, 15, 9], [8, 14, 11]]) == [36, 33], "Deux lignes de notes."
assert sommes_lignes([]) == [] and sommes_lignes([[-1, 1]]) == [0], "Aucune ligne, puis une somme nulle."
assert "sum(" not in PROGRAMME, "Sans sum."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-2-2" label="2.2 [Facile] - Somme d'une colonne" type="python">
<Enonce>
### Somme d'une colonne

Écrire une fonction `somme_colonne(grille, j)` qui renvoie la somme des cases de la colonne `j`. Toutes les lignes ont au moins `j + 1` cases.

Exemple : `somme_colonne([[1, 2], [3, 4], [5, 6]], 1)` renvoie `12`.

<PostIt>

- une colonne : la case d'indice `j` de chaque ligne
- `ligne[j]` dans une boucle sur les lignes
- une seule boucle suffit
- `total = total + ligne[j]`

</PostIt>

<Indices>
<Indice>

La colonne `j` est formée de `grille[0][j]`, `grille[1][j]`, et ainsi de suite.

</Indice>
<Indice>

Une boucle sur les lignes donne accès à `ligne[j]` à chaque tour.

</Indice>
<Indice>

```text
FONCTION somme_colonne(grille, j)
    total ← 0
    POUR CHAQUE ligne DE grille
        total ← total + ligne[j]
    RENVOYER total
```

</Indice>
</Indices>

<Correction>

```python
def somme_colonne(grille: list, j: int) -> int:
    total = 0
    for ligne in grille:
        total = total + ligne[j]
    return total
```

</Correction>
</Enonce>
<Verification>

```python
assert somme_colonne([[1, 2], [3, 4], [5, 6]], 1) == 12, "Colonne 1 : 2 + 4 + 6 = 12."
assert somme_colonne([[1, 2], [3, 4], [5, 6]], 0) == 9, "Colonne 0 : 1 + 3 + 5 = 9."
assert somme_colonne([[7, 0, -2]], 2) == -2 and somme_colonne([], 0) == 0, "Une seule ligne, puis aucune ligne."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-2-3" label="2.3 [Facile] - Trouver une valeur" type="python">
<Enonce>
### Trouver une valeur

Écrire une fonction `trouver(grille, valeur)` qui renvoie la position `(i, j)` de la première case égale à `valeur`, en lisant les lignes de haut en bas et chaque ligne de gauche à droite. Si la valeur est absente, la fonction renvoie `None`.

Exemple : `trouver([[4, 7], [2, 7]], 7)` renvoie `(0, 1)`.

<PostIt>

- les indices : `for i in range(len(grille)):` puis `for j in range(len(grille[i])):`
- `return (i, j)` arrête la fonction dès la première case trouvée
- `return None` après les deux boucles
- `(i, j)` : un couple, ou tuple

</PostIt>

<Indices>
<Indice>

Il faut les indices de la case, pas seulement sa valeur : parcourir avec `range`.

</Indice>
<Indice>

Le `return None` se place après les boucles : on n'y arrive que si aucune case ne convient.

</Indice>
<Indice>

```text
FONCTION trouver(grille, valeur)
    POUR i ALLANT DE 0 À longueur(grille) - 1
        POUR j ALLANT DE 0 À longueur(grille[i]) - 1
            SI grille[i][j] = valeur ALORS RENVOYER (i, j)
    RENVOYER None
```

</Indice>
</Indices>

<Correction>

```python
def trouver(grille: list, valeur):
    for i in range(len(grille)):
        for j in range(len(grille[i])):
            if grille[i][j] == valeur:
                return (i, j)
    return None
```

</Correction>
</Enonce>
<Verification>

```python
assert trouver([[4, 7], [2, 7]], 7) == (0, 1), "Le premier 7 est en (0, 1)."
assert trouver([[4, 7], [2, 7]], 2) == (1, 0), "2 est en (1, 0)."
assert trouver([[4, 7], [2, 7]], 9) is None and trouver([], 1) is None, "Valeur absente : None."
assert trouver([[], [0, 5]], 5) == (1, 1), "Avec une ligne vide au début."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-2-4" label="2.4 [Facile] - Tableau rectangulaire ?" type="python">
<Enonce>
### Tableau rectangulaire ?

Un tableau est **rectangulaire** si toutes ses lignes ont la même longueur. Écrire une fonction `est_rectangulaire(grille)` qui renvoie `True` dans ce cas, et `False` sinon. Un tableau sans ligne est considéré comme rectangulaire.

Exemples : `[[1, 2], [3, 4], [5, 6]]` est rectangulaire, mais pas `[[1, 2], [3], [4, 5]]`.

<PostIt>

- `len(grille[0])` : la longueur de référence
- comparer `len(ligne)` à cette référence pour chaque ligne
- un `return False` dans la boucle l'arrête aussitôt
- traiter `grille == []` à part

</PostIt>

<Indices>
<Indice>

La première ligne sert de référence. Une seule ligne de longueur différente suffit pour répondre `False`.

</Indice>
<Indice>

Pour un tableau vide, `grille[0]` n'existe pas : ce cas se traite avant tout le reste.

</Indice>
<Indice>

```text
FONCTION est_rectangulaire(grille)
    SI grille est vide ALORS RENVOYER Vrai
    reference ← longueur(grille[0])
    POUR CHAQUE ligne DE grille
        SI longueur(ligne) ≠ reference ALORS RENVOYER Faux
    RENVOYER Vrai
```

</Indice>
</Indices>

<Correction>

```python
def est_rectangulaire(grille: list) -> bool:
    if len(grille) == 0:
        return True
    reference = len(grille[0])
    for ligne in grille:
        if len(ligne) != reference:
            return False
    return True
```

</Correction>
</Enonce>
<Verification>

```python
assert est_rectangulaire([[1, 2], [3, 4], [5, 6]]) is True, "Trois lignes de 2 cases."
assert est_rectangulaire([[1, 2], [3], [4, 5]]) is False and est_rectangulaire([[1], [2, 3]]) is False, "Une ligne de longueur différente."
assert est_rectangulaire([]) is True and est_rectangulaire([[]]) is True and est_rectangulaire([[1, 2, 3]]) is True, "Cas limites."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-3-1" label="3.1 [Moyen] - Image miroir" type="python">
<Enonce>
### Image miroir

Une image en noir et blanc est un tableau de 0 (blanc) et de 1 (noir). Écrire une fonction `miroir(image)` qui renvoie une **nouvelle** image, symétrique de la première par rapport à un axe vertical : chaque ligne est lue de droite à gauche. L'image de départ n'est pas modifiée.

Exemple : `miroir([[1, 0, 0], [1, 1, 0]])` renvoie `[[0, 0, 1], [0, 1, 1]]`.

Contrainte : sans `reverse`, `reversed` ni `[::-1]`.

<PostIt>

- `ligne[len(ligne) - 1 - j]` : la case symétrique de `ligne[j]`
- une nouvelle ligne vide pour chaque ligne de l'image
- `nouvelle.append(...)` puis `resultat.append(nouvelle)`
- l'image de départ ne doit pas changer

</PostIt>

<Indices>
<Indice>

Dans une ligne de longueur `p`, la case d'indice `j` de la nouvelle ligne est la case d'indice `p - 1 - j` de l'ancienne.

</Indice>
<Indice>

Construire chaque nouvelle ligne avec `append`, puis l'ajouter à la nouvelle image.

</Indice>
<Indice>

```text
FONCTION miroir(image)
    resultat ← liste vide
    POUR CHAQUE ligne DE image
        p ← longueur(ligne) ; nouvelle ← liste vide
        POUR j ALLANT DE 0 À p - 1
            ajouter ligne[p - 1 - j] à nouvelle
        ajouter nouvelle à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def miroir(image: list) -> list:
    resultat = []
    for ligne in image:
        p = len(ligne)
        nouvelle = []
        for j in range(p):
            nouvelle.append(ligne[p - 1 - j])
        resultat.append(nouvelle)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
import re
depart = [[1, 0, 0], [1, 1, 0]]
assert miroir(depart) == [[0, 0, 1], [0, 1, 1]], "Chaque ligne est lue de droite à gauche."
assert depart == [[1, 0, 0], [1, 1, 0]], "L'image de départ n'est pas modifiée."
assert miroir([]) == [] and miroir([[1]]) == [[1]] and miroir([[0, 1], []]) == [[1, 0], []], "Cas limites."
assert not re.search(r"reverse|\[::-1\]", PROGRAMME), "Sans reverse, reversed ni [::-1]."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-3-2" label="3.2 [Moyen] - Additionner deux tableaux" type="python">
<Enonce>
### Additionner deux tableaux

Deux tableaux de mêmes dimensions s'additionnent case par case. Écrire une fonction `additionner(a, b)` qui renvoie le nouveau tableau dont chaque case est la somme des cases correspondantes de `a` et de `b`.

Exemple : `additionner([[1, 2], [3, 4]], [[10, 20], [30, 40]])` renvoie `[[11, 22], [33, 44]]`.

<PostIt>

- `a[i][j] + b[i][j]` : la case du résultat
- `for i in range(len(a)):` puis `for j in range(len(a[i])):`
- une nouvelle ligne pour chaque `i`
- les deux tableaux ont les mêmes dimensions

</PostIt>

<Indices>
<Indice>

Les indices `i` et `j` servent à la fois pour `a` et pour `b` : parcourir avec `range`.

</Indice>
<Indice>

Construire le résultat ligne par ligne, comme dans l'exercice « Image miroir ».

</Indice>
<Indice>

```text
FONCTION additionner(a, b)
    resultat ← liste vide
    POUR i ALLANT DE 0 À longueur(a) - 1
        ligne ← liste vide
        POUR j ALLANT DE 0 À longueur(a[i]) - 1
            ajouter a[i][j] + b[i][j] à ligne
        ajouter ligne à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def additionner(a: list, b: list) -> list:
    resultat = []
    for i in range(len(a)):
        ligne = []
        for j in range(len(a[i])):
            ligne.append(a[i][j] + b[i][j])
        resultat.append(ligne)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
a = [[1, 2], [3, 4]]
assert additionner(a, [[10, 20], [30, 40]]) == [[11, 22], [33, 44]], "Somme case par case."
assert a == [[1, 2], [3, 4]], "Les tableaux de départ ne sont pas modifiés."
assert additionner([[1, 2, 3]], [[-1, 0, 1]]) == [[0, 2, 4]] and additionner([], []) == [], "Une ligne, puis aucune ligne."
assert additionner([[5], [6], [7]], [[1], [1], [1]]) == [[6], [7], [8]], "Une colonne."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-3-3" label="3.3 [Moyen] - Remettre en forme" type="python">
<Enonce>
### Remettre en forme

Écrire une fonction `remettre_en_forme(liste, p)` qui range les éléments d'une liste simple dans un tableau dont les lignes ont `p` éléments, dans l'ordre. La dernière ligne peut être plus courte.

Exemple : `remettre_en_forme([1, 2, 3, 4, 5, 6, 7], 3)` renvoie `[[1, 2, 3], [4, 5, 6], [7]]`.

<PostIt>

- `ligne = []` : la ligne en cours de remplissage
- `len(ligne) == p` : la ligne est pleine
- une ligne pleine s'ajoute au tableau, puis on en commence une nouvelle
- à la fin, ne pas oublier la dernière ligne si elle n'est pas vide

</PostIt>

<Indices>
<Indice>

Remplir une ligne avec les éléments de la liste. Dès qu'elle contient `p` éléments, l'ajouter au tableau et repartir d'une ligne vide.

</Indice>
<Indice>

Après la boucle, la ligne en cours contient les derniers éléments. Elle n'est ajoutée que si elle n'est pas vide.

</Indice>
<Indice>

```text
FONCTION remettre_en_forme(liste, p)
    tableau ← liste vide ; ligne ← liste vide
    POUR CHAQUE x DE liste
        ajouter x à ligne
        SI longueur(ligne) = p ALORS
            ajouter ligne à tableau ; ligne ← liste vide
    SI ligne n'est pas vide ALORS ajouter ligne à tableau
    RENVOYER tableau
```

</Indice>
</Indices>

<Correction>

```python
def remettre_en_forme(liste: list, p: int) -> list:
    tableau = []
    ligne = []
    for x in liste:
        ligne.append(x)
        if len(ligne) == p:
            tableau.append(ligne)
            ligne = []
    if len(ligne) > 0:
        tableau.append(ligne)
    return tableau
```

</Correction>
</Enonce>
<Verification>

```python
assert remettre_en_forme([1, 2, 3, 4, 5, 6, 7], 3) == [[1, 2, 3], [4, 5, 6], [7]], "7 éléments par lignes de 3."
assert remettre_en_forme([1, 2, 3, 4], 2) == [[1, 2], [3, 4]], "La dernière ligne est complète."
assert remettre_en_forme(["a", "b"], 5) == [["a", "b"]] and remettre_en_forme([], 3) == [], "Une seule ligne courte, puis aucune ligne."
assert remettre_en_forme([1, 2, 3], 1) == [[1], [2], [3]], "Lignes d'un élément."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-3-4" label="3.4 [Moyen] - Tableau symétrique ?" type="python">
<Enonce>
### Tableau symétrique ?

Un tableau carré est **symétrique** si la case `(i, j)` est toujours égale à la case `(j, i)` : la diagonale qui va du coin en haut à gauche au coin en bas à droite sert de miroir. Écrire une fonction `est_symetrique(carre)` qui renvoie `True` dans ce cas, et `False` sinon.

Exemple : `[[1, 7, 3], [7, 4, 5], [3, 5, 6]]` est symétrique.

<PostIt>

- `carre[i][j]` et `carre[j][i]` : deux cases symétriques
- `n = len(carre)` : le nombre de lignes, égal au nombre de colonnes
- une seule différence suffit pour répondre `False`
- `return True` après les deux boucles

</PostIt>

<Indices>
<Indice>

Comparer `carre[i][j]` et `carre[j][i]` pour tous les couples d'indices.

</Indice>
<Indice>

Il suffit de regarder les cases au-dessus de la diagonale (`j > i`) : les autres sont comparées en même temps.

</Indice>
<Indice>

```text
FONCTION est_symetrique(carre)
    n ← longueur(carre)
    POUR i ALLANT DE 0 À n - 1
        POUR j ALLANT DE i + 1 À n - 1
            SI carre[i][j] ≠ carre[j][i] ALORS RENVOYER Faux
    RENVOYER Vrai
```

</Indice>
</Indices>

<Correction>

```python
def est_symetrique(carre: list) -> bool:
    n = len(carre)
    for i in range(n):
        for j in range(i + 1, n):
            if carre[i][j] != carre[j][i]:
                return False
    return True
```

</Correction>
</Enonce>
<Verification>

```python
assert est_symetrique([[1, 7, 3], [7, 4, 5], [3, 5, 6]]) is True, "Ce tableau 3 × 3 est symétrique."
assert est_symetrique([[1, 7, 3], [7, 4, 5], [3, 8, 6]]) is False, "5 et 8 ne correspondent pas."
assert est_symetrique([[1, 2], [3, 1]]) is False and est_symetrique([[2, 0], [0, 9]]) is True, "Tableaux 2 × 2."
assert est_symetrique([[5]]) is True and est_symetrique([]) is True, "Une case, puis aucune."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-4-1" label="4.1 [Difficile] - Les sommets d'un relief" type="python">
<Enonce>
### Les sommets d'un relief

Une carte de relief est un tableau d'altitudes. Une case est un **sommet** si son altitude est strictement plus grande que celle de chacune de ses voisines, en haut, en bas, à gauche et à droite (les cases du bord ont moins de voisines).

Écrire une fonction `sommets(relief)` qui renvoie la liste des positions `(i, j)` des sommets, en lisant les lignes de haut en bas et chaque ligne de gauche à droite.

Exemple : pour `[[1, 2, 1], [3, 1, 4], [1, 5, 1]]`, la fonction renvoie `[(0, 1), (1, 0), (1, 2), (2, 1)]`.

<Indices>
<Indice>

Les quatre voisines de `(i, j)` s'obtiennent en ajoutant `(-1, 0)`, `(1, 0)`, `(0, -1)` et `(0, 1)`. Une voisine n'existe que si ses deux indices restent dans le tableau.

</Indice>
<Indice>

Une case est un sommet tant qu'aucune voisine existante n'est aussi haute qu'elle. Une variable booléenne passe à `False` dès qu'une voisine est plus haute ou de même altitude.

</Indice>
<Indice>

```text
FONCTION sommets(relief)
    resultat ← liste vide
    POUR CHAQUE case (i, j) DU relief
        sommet ← Vrai
        POUR CHAQUE (di, dj) DE [(-1, 0), (1, 0), (0, -1), (0, 1)]
            SI (i + di, j + dj) est dans le tableau ET relief[i + di][j + dj] ≥ relief[i][j] ALORS
                sommet ← Faux
        SI sommet ALORS ajouter (i, j) à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def sommets(relief: list) -> list:
    resultat = []
    for i in range(len(relief)):
        for j in range(len(relief[i])):
            sommet = True
            for di, dj in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                a, b = i + di, j + dj
                if 0 <= a < len(relief) and 0 <= b < len(relief[a]) and relief[a][b] >= relief[i][j]:
                    sommet = False
            if sommet:
                resultat.append((i, j))
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert sommets([[1, 2, 1], [3, 1, 4], [1, 5, 1]]) == [(0, 1), (1, 0), (1, 2), (2, 1)], "Quatre sommets."
assert sommets([[5]]) == [(0, 0)] and sommets([]) == [], "Une case seule est un sommet ; aucun sommet sans case."
assert sommets([[1, 1]]) == [] and sommets([[1, 3, 2]]) == [(0, 1)], "Strictement plus haute que ses voisines."
assert sommets([[9, 1], [1, 9]]) == [(0, 0), (1, 1)], "Les diagonales ne sont pas des voisines."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-4-2" label="4.2 [Difficile] - Faire tomber un jeton" type="python">
<Enonce>
### Faire tomber un jeton

Dans un jeu de type « quatre en ligne », la grille est verticale. Le tableau `grille` la décrit de haut en bas : la ligne 0 est en haut, et une case vide contient `"."`. Un jeton lâché dans une colonne tombe jusqu'à la case vide la plus basse de cette colonne.

Écrire une fonction `jouer(grille, colonne, symbole)` qui place le jeton `symbole` dans `colonne` et renvoie l'indice de la ligne où il s'arrête. Si la colonne est pleine, la grille n'est pas modifiée et la fonction renvoie `-1`.

Exemple : dans une grille vide de 4 lignes, le premier jeton s'arrête sur la ligne 3, le suivant dans la même colonne sur la ligne 2.

<Indices>
<Indice>

Parcourir la colonne en partant du bas : `i` va de `len(grille) - 1` à `0`.

</Indice>
<Indice>

La première case vide rencontrée en remontant reçoit le jeton, et la fonction s'arrête aussitôt.

</Indice>
<Indice>

```text
FONCTION jouer(grille, colonne, symbole)
    POUR i ALLANT DE longueur(grille) - 1 À 0 EN DESCENDANT
        SI grille[i][colonne] = "." ALORS
            grille[i][colonne] ← symbole
            RENVOYER i
    RENVOYER -1
```

</Indice>
</Indices>

<Correction>

```python
def jouer(grille: list, colonne: int, symbole: str) -> int:
    for i in range(len(grille) - 1, -1, -1):
        if grille[i][colonne] == ".":
            grille[i][colonne] = symbole
            return i
    return -1
```

</Correction>
</Enonce>
<Verification>

```python
g = [["."] * 3 for _ in range(4)]
assert jouer(g, 1, "R") == 3 and g[3][1] == "R", "Dans une colonne vide, le jeton tombe sur la ligne du bas."
assert jouer(g, 1, "J") == 2 and g[2][1] == "J", "Le jeton suivant s'arrête juste au-dessus."
assert jouer(g, 0, "J") == 3, "Une autre colonne est encore vide."
jouer(g, 1, "R")
jouer(g, 1, "J")
avant = [ligne[:] for ligne in g]
assert jouer(g, 1, "R") == -1 and g == avant, "Colonne pleine : -1, et la grille ne change pas."
assert [g[i][1] for i in range(4)] == ["J", "R", "J", "R"], "La colonne 1 contient les jetons empilés."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-4-3" label="4.3 [Difficile] - Qui a gagné au morpion ?" type="python">
<Enonce>
### Qui a gagné au morpion ?

Un plateau de morpion est un tableau 3 × 3 de `"X"`, de `"O"` et de `"."` pour les cases vides. Un joueur gagne s'il a trois symboles alignés sur une ligne, une colonne ou l'une des deux diagonales.

Écrire une fonction `gagnant(plateau)` qui renvoie `"X"` ou `"O"` selon le gagnant, ou `None` si personne n'a gagné. On suppose qu'au plus un joueur a gagné.

<Indices>
<Indice>

Il y a 8 alignements possibles : 3 lignes, 3 colonnes et 2 diagonales. Les construire tous comme des listes de trois cases rend la suite plus simple.

</Indice>
<Indice>

Un alignement est gagnant si ses trois cases sont égales et ne sont pas vides.

</Indice>
<Indice>

```text
FONCTION gagnant(plateau)
    alignements ← les 3 lignes, les 3 colonnes et les 2 diagonales, chacune en liste de 3 cases
    POUR CHAQUE a DE alignements
        SI a[0] ≠ "." ET a[0] = a[1] ET a[1] = a[2] ALORS RENVOYER a[0]
    RENVOYER None
```

</Indice>
</Indices>

<Correction>

```python
def gagnant(plateau: list):
    alignements = []
    for i in range(3):
        alignements.append(plateau[i])
        alignements.append([plateau[0][i], plateau[1][i], plateau[2][i]])
    alignements.append([plateau[0][0], plateau[1][1], plateau[2][2]])
    alignements.append([plateau[0][2], plateau[1][1], plateau[2][0]])
    for a in alignements:
        if a[0] != "." and a[0] == a[1] and a[1] == a[2]:
            return a[0]
    return None
```

</Correction>
</Enonce>
<Verification>

```python
assert gagnant([["X", "X", "X"], ["O", "O", "."], [".", ".", "."]]) == "X", "Une ligne de X."
assert gagnant([["O", "X", "."], ["O", "X", "."], ["O", ".", "X"]]) == "O", "Une colonne de O."
assert gagnant([["X", "O", "O"], [".", "X", "."], ["O", ".", "X"]]) == "X", "La première diagonale."
assert gagnant([["X", "X", "O"], [".", "O", "."], ["O", ".", "X"]]) == "O", "La seconde diagonale."
assert gagnant([[".", ".", "."], [".", ".", "."], [".", ".", "."]]) is None, "Trois cases vides alignées ne font pas gagner."
assert gagnant([["X", "O", "X"], ["X", "O", "O"], ["O", "X", "X"]]) is None, "Match nul."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-4-4" label="4.4 [Difficile] - Agrandir une image" type="python">
<Enonce>
### Agrandir une image

Pour agrandir une image `k` fois, chaque pixel devient un carré de `k` × `k` pixels de la même couleur. Écrire une fonction `zoom(image, k)` qui renvoie la nouvelle image. Ses lignes doivent être des listes différentes.

Exemple : `zoom([[1, 0], [0, 1]], 2)` renvoie `[[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]]`.

<Indices>
<Indice>

Chaque ligne de l'image donne d'abord une ligne élargie, où chaque pixel est répété `k` fois.

</Indice>
<Indice>

Cette ligne élargie est ensuite ajoutée `k` fois à la nouvelle image, en créant une **copie** à chaque fois, par exemple avec `list(ligne_large)`.

</Indice>
<Indice>

```text
FONCTION zoom(image, k)
    resultat ← liste vide
    POUR CHAQUE ligne DE image
        large ← liste vide
        POUR CHAQUE pixel DE ligne
            RÉPÉTER k FOIS : ajouter pixel à large
        RÉPÉTER k FOIS : ajouter une copie de large à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def zoom(image: list, k: int) -> list:
    resultat = []
    for ligne in image:
        large = []
        for pixel in ligne:
            for _ in range(k):
                large.append(pixel)
        for _ in range(k):
            resultat.append(list(large))
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert zoom([[1, 0], [0, 1]], 2) == [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]], "Chaque pixel devient un carré 2 × 2."
assert zoom([[7, 8, 9]], 3) == [[7, 7, 7, 8, 8, 8, 9, 9, 9]] * 3, "Une ligne agrandie 3 fois."
assert zoom([[1, 2]], 1) == [[1, 2]] and zoom([], 4) == [], "k = 1 ne change rien ; image vide."
g = zoom([[0]], 2)
g[0][0] = 5
assert g == [[5, 0], [0, 0]], "Les lignes de la nouvelle image sont des listes différentes."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-5-1" label="5.1 [Expert] - Lecture en spirale" type="python">
<Enonce>
### Lecture en spirale

Écrire une fonction `spirale(grille)` qui renvoie la liste des cases d'un tableau rectangulaire lues en spirale : la première ligne de gauche à droite, puis la dernière colonne de haut en bas, la dernière ligne de droite à gauche, la première colonne de bas en haut, et ainsi de suite vers le centre.

Exemple : `spirale([[1, 2, 3], [4, 5, 6], [7, 8, 9]])` renvoie `[1, 2, 3, 6, 9, 8, 7, 4, 5]`.

<Indices>
<Indice>

Garder quatre limites : `haut`, `bas`, `gauche` et `droite`. Après avoir lu la ligne du haut, `haut` augmente de 1. Après la colonne de droite, `droite` diminue de 1, et ainsi de suite.

</Indice>
<Indice>

Quand il ne reste qu'une ligne ou qu'une colonne, il ne faut pas la lire deux fois : vérifier `haut <= bas` avant de lire la ligne du bas, et `gauche <= droite` avant de lire la colonne de gauche.

</Indice>
<Indice>

```text
FONCTION spirale(grille)
    SI grille est vide ALORS RENVOYER liste vide
    haut ← 0 ; bas ← nombre de lignes - 1 ; gauche ← 0 ; droite ← nombre de colonnes - 1
    TANT QUE haut ≤ bas ET gauche ≤ droite
        lire la ligne haut, de gauche à droite ; haut ← haut + 1
        lire la colonne droite, de haut à bas ; droite ← droite - 1
        SI haut ≤ bas ALORS lire la ligne bas, de droite à gauche ; bas ← bas - 1
        SI gauche ≤ droite ALORS lire la colonne gauche, de bas à haut ; gauche ← gauche + 1
    RENVOYER les cases lues
```

</Indice>
</Indices>

<Correction>

```python
def spirale(grille: list) -> list:
    lues = []
    if len(grille) == 0:
        return lues
    haut, bas = 0, len(grille) - 1
    gauche, droite = 0, len(grille[0]) - 1
    while haut <= bas and gauche <= droite:
        for j in range(gauche, droite + 1):
            lues.append(grille[haut][j])
        haut = haut + 1
        for i in range(haut, bas + 1):
            lues.append(grille[i][droite])
        droite = droite - 1
        if haut <= bas:
            for j in range(droite, gauche - 1, -1):
                lues.append(grille[bas][j])
            bas = bas - 1
        if gauche <= droite:
            for i in range(bas, haut - 1, -1):
                lues.append(grille[i][gauche])
            gauche = gauche + 1
    return lues
```

</Correction>
</Enonce>
<Verification>

```python
assert spirale([[1, 2, 3], [4, 5, 6], [7, 8, 9]]) == [1, 2, 3, 6, 9, 8, 7, 4, 5], "Tableau 3 × 3."
assert spirale([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]) == [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7], "Tableau 3 × 4."
assert spirale([[1], [2], [3]]) == [1, 2, 3] and spirale([[1, 2, 3]]) == [1, 2, 3], "Une seule colonne, une seule ligne."
assert spirale([]) == [] and spirale([[1, 2], [3, 4]]) == [1, 2, 4, 3], "Vide, puis 2 × 2."
g = [list(range(5 * i, 5 * i + 5)) for i in range(5)]
assert sorted(spirale(g)) == list(range(25)), "Chaque case est lue exactement une fois."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-5-2" label="5.2 [Expert] - Grille de sudoku" type="python">
<Enonce>
### Grille de sudoku

Une grille de sudoku remplie est un tableau 9 × 9 d'entiers. Elle est **valide** si chaque ligne, chaque colonne et chacun des neuf blocs 3 × 3 contient exactement une fois chacun des chiffres de 1 à 9.

Écrire une fonction `sudoku_valide(grille)` qui renvoie `True` si la grille est valide, et `False` sinon. Écrire d'abord une fonction `groupe_valide(valeurs)` qui renvoie `True` si une liste de 9 valeurs contient chacun des chiffres de 1 à 9.

<Indices>
<Indice>

`groupe_valide` peut comparer `sorted(valeurs)` à `[1, 2, 3, 4, 5, 6, 7, 8, 9]`.

</Indice>
<Indice>

Le bloc dont le coin en haut à gauche est `(3 * a, 3 * b)` contient les cases `(3 * a + i, 3 * b + j)` pour `i` et `j` de 0 à 2.

</Indice>
<Indice>

```text
FONCTION sudoku_valide(grille)
    POUR k ALLANT DE 0 À 8
        SI NON groupe_valide(ligne k) ALORS RENVOYER Faux
        SI NON groupe_valide(colonne k) ALORS RENVOYER Faux
    POUR a ALLANT DE 0 À 2
        POUR b ALLANT DE 0 À 2
            bloc ← les 9 cases (3a + i, 3b + j)
            SI NON groupe_valide(bloc) ALORS RENVOYER Faux
    RENVOYER Vrai
```

</Indice>
</Indices>

<Correction>

```python
def groupe_valide(valeurs: list) -> bool:
    return sorted(valeurs) == [1, 2, 3, 4, 5, 6, 7, 8, 9]


def sudoku_valide(grille: list) -> bool:
    for k in range(9):
        colonne = []
        for i in range(9):
            colonne.append(grille[i][k])
        if not groupe_valide(grille[k]) or not groupe_valide(colonne):
            return False
    for a in range(3):
        for b in range(3):
            bloc = []
            for i in range(3):
                for j in range(3):
                    bloc.append(grille[3 * a + i][3 * b + j])
            if not groupe_valide(bloc):
                return False
    return True
```

</Correction>
</Enonce>
<Verification>

```python
G = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2], [6, 7, 2, 1, 9, 5, 3, 4, 8], [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3], [4, 2, 6, 8, 5, 3, 7, 9, 1], [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4], [2, 8, 7, 4, 1, 9, 6, 3, 5], [3, 4, 5, 2, 8, 6, 1, 7, 9],
]
assert groupe_valide([9, 1, 8, 2, 7, 3, 6, 4, 5]) is True and groupe_valide([1, 1, 2, 3, 4, 5, 6, 7, 8]) is False, "groupe_valide."
assert sudoku_valide(G) is True, "Une grille valide."
echange = [ligne[:] for ligne in G]
echange[0][0], echange[0][1] = echange[0][1], echange[0][0]
assert sudoku_valide(echange) is False, "Lignes justes, mais deux colonnes fausses."
latin = [[(i + j) % 9 + 1 for j in range(9)] for i in range(9)]
assert sudoku_valide(latin) is False, "Lignes et colonnes justes, mais blocs faux."
zero = [ligne[:] for ligne in G]
zero[4][4] = 0
assert sudoku_valide(zero) is False, "Une case à 0."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-5-3" label="5.3 [Expert] - Le chemin le plus riche" type="python">
<Enonce>
### Le chemin le plus riche

Un renard traverse un champ découpé en cases, chacune contenant un nombre de baies. Il part de la case en haut à gauche et doit arriver à la case en bas à droite, en se déplaçant uniquement vers la **droite** ou vers le **bas**. Il ramasse les baies de toutes les cases où il passe, départ et arrivée compris.

Écrire une fonction `chemin_max(grille)` qui renvoie le plus grand nombre de baies que le renard peut ramasser. La grille n'est pas vide.

Exemple : pour `[[1, 3, 1], [1, 5, 1], [4, 2, 1]]`, le meilleur chemin passe par 1, 3, 5, 2, 1 : la fonction renvoie `12`.

Tester tous les chemins est beaucoup trop long pour une grande grille : la fonction doit construire un second tableau, `meilleur`, où `meilleur[i][j]` est le plus grand nombre de baies pour arriver jusqu'à la case `(i, j)`.

<Indices>
<Indice>

On arrive en `(i, j)` soit depuis la case du dessus, soit depuis celle de gauche. Donc `meilleur[i][j]` vaut `grille[i][j]` plus le plus grand des deux nombres `meilleur[i - 1][j]` et `meilleur[i][j - 1]`.

</Indice>
<Indice>

Sur la première ligne, on ne peut venir que de la gauche. Sur la première colonne, on ne peut venir que du dessus. Remplir `meilleur` ligne par ligne, de gauche à droite : les cases utilisées sont alors déjà calculées.

</Indice>
<Indice>

```text
FONCTION chemin_max(grille)
    meilleur ← tableau de mêmes dimensions que grille
    POUR CHAQUE case (i, j), ligne par ligne
        SI i = 0 ET j = 0 ALORS avant ← 0
        SINON SI i = 0 ALORS avant ← meilleur[i][j - 1]
        SINON SI j = 0 ALORS avant ← meilleur[i - 1][j]
        SINON avant ← maximum(meilleur[i - 1][j], meilleur[i][j - 1])
        meilleur[i][j] ← grille[i][j] + avant
    RENVOYER la dernière case de meilleur
```

</Indice>
</Indices>

<Correction>

```python
def chemin_max(grille: list) -> int:
    n = len(grille)
    p = len(grille[0])
    meilleur = []
    for _ in range(n):
        meilleur.append([0] * p)
    for i in range(n):
        for j in range(p):
            if i == 0 and j == 0:
                avant = 0
            elif i == 0:
                avant = meilleur[i][j - 1]
            elif j == 0:
                avant = meilleur[i - 1][j]
            else:
                avant = max(meilleur[i - 1][j], meilleur[i][j - 1])
            meilleur[i][j] = grille[i][j] + avant
    return meilleur[n - 1][p - 1]
```

</Correction>
</Enonce>
<Verification>

```python
assert chemin_max([[1, 3, 1], [1, 5, 1], [4, 2, 1]]) == 12, "Le meilleur chemin passe par 1, 3, 5, 2, 1."
assert chemin_max([[7]]) == 7 and chemin_max([[1, 2, 3]]) == 6 and chemin_max([[1], [2], [3]]) == 6, "Une case, une ligne, une colonne."
assert chemin_max([[0, 9], [9, 0]]) == 9, "On ne peut pas ramasser les deux 9."
depart = [[1, 2], [3, 4]]
assert chemin_max(depart) == 8 and depart == [[1, 2], [3, 4]], "La grille n'est pas modifiée."
assert chemin_max([[1] * 60 for _ in range(60)]) == 119, "Une grande grille se traite vite."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-5-4" label="5.4 [Expert] - Le pot de peinture" type="python">
<Enonce>
### Le pot de peinture

Dans un logiciel de dessin, l'outil « pot de peinture » colorie une zone d'un seul clic : la case cliquée et toutes les cases de même couleur qui lui sont reliées, de proche en proche, par le haut, le bas, la gauche ou la droite.

Écrire une fonction `remplir(image, i, j, couleur)` qui modifie l'image de cette façon à partir de la case `(i, j)` et renvoie le nombre de cases repeintes. Si la case a déjà la couleur demandée, rien ne change et la fonction renvoie 0.

La fonction n'est pas récursive : elle garde dans une liste `a_traiter` les cases qui restent à examiner.

Exemple : avec `image = [[0, 0, 1], [0, 1, 1], [1, 0, 0]]`, l'appel `remplir(image, 0, 0, 2)` renvoie `3`, et l'image devient `[[2, 2, 1], [2, 1, 1], [1, 0, 0]]`.

<Indices>
<Indice>

Retenir d'abord l'ancienne couleur de la case `(i, j)`. Seules les cases de cette couleur seront repeintes.

</Indice>
<Indice>

Repeindre une case dès qu'elle est ajoutée à `a_traiter` : elle n'a plus l'ancienne couleur, et ne sera donc jamais ajoutée deux fois.

</Indice>
<Indice>

```text
FONCTION remplir(image, i, j, couleur)
    ancienne ← image[i][j]
    SI ancienne = couleur ALORS RENVOYER 0
    image[i][j] ← couleur ; a_traiter ← [(i, j)] ; n ← 1
    TANT QUE a_traiter n'est pas vide
        (a, b) ← retirer le dernier élément de a_traiter
        POUR CHAQUE voisine (x, y) de (a, b) dans l'image
            SI image[x][y] = ancienne ALORS
                image[x][y] ← couleur ; ajouter (x, y) à a_traiter ; n ← n + 1
    RENVOYER n
```

</Indice>
</Indices>

<Correction>

```python
def remplir(image: list, i: int, j: int, couleur) -> int:
    ancienne = image[i][j]
    if ancienne == couleur:
        return 0
    image[i][j] = couleur
    a_traiter = [(i, j)]
    n = 1
    while len(a_traiter) > 0:
        a, b = a_traiter.pop()
        for da, db in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            x, y = a + da, b + db
            if 0 <= x < len(image) and 0 <= y < len(image[x]) and image[x][y] == ancienne:
                image[x][y] = couleur
                a_traiter.append((x, y))
                n = n + 1
    return n
```

</Correction>
</Enonce>
<Verification>

```python
image = [[0, 0, 1], [0, 1, 1], [1, 0, 0]]
assert remplir(image, 0, 0, 2) == 3 and image == [[2, 2, 1], [2, 1, 1], [1, 0, 0]], "La zone de 0 en haut à gauche."
assert remplir(image, 0, 2, 5) == 3 and image == [[2, 2, 5], [2, 5, 5], [1, 0, 0]], "Le 1 en bas à gauche n'est pas relié."
assert remplir(image, 2, 2, 0) == 0 and image[2] == [1, 0, 0], "Déjà de la bonne couleur : rien ne change."
assert remplir(image, 2, 1, 7) == 2 and image[2] == [1, 7, 7], "Deux cases en bas à droite."
grande = [[0] * 60 for _ in range(60)]
assert remplir(grande, 30, 30, 1) == 3600, "Une grande image se remplit sans fonction récursive."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-6-1" label="6.1 [Mini-projet] - La salle de cinéma" type="python">
<Enonce>
### La salle de cinéma

**Contexte.** Un petit cinéma veut un programme de réservation pour sa salle. La caisse doit voir le plan de la salle, réserver une place précise, ou trouver des places côte à côte pour un groupe. En fin de soirée, le programme calcule le taux de remplissage et la recette de la séance.

**Les données** : la salle est un tableau de rangs. Le rang 0 est le plus proche de l'écran, le dernier rang est au fond. Chaque rang est une liste de places : `"."` pour une place libre, `"X"` pour une place réservée. Les tarifs dépendent du rang : `tarifs[r]` est le prix, en euros, d'une place du rang `r`.

**Les fonctions du programme**
- `creer_salle(rangs, places)` : une salle vide pour une nouvelle séance. Renvoie un tableau de `rangs` rangs de `places` places libres, chaque rang étant une liste différente.
- `afficher(salle)` : le plan affiché à la caisse. Renvoie une chaîne avec un rang par ligne, par exemple `"..X.\n...."`.
- `places_libres(salle)` : renvoie le nombre de places libres.
- `reserver(salle, rang, place)` : réserve une place précise. Renvoie `True` si la place existait et était libre (elle devient alors `"X"`), `False` sinon.
- `debut_suite(rang, n)` : cherche `n` places libres côte à côte dans un rang. Renvoie l'indice de la première de ces places, la plus à gauche possible, ou `None`. Exemple : `debut_suite(["X", ".", ".", ".", "X"], 2)` vaut `1`.
- `trouver_places(salle, n)` : les spectateurs préfèrent le fond de la salle. En partant du dernier rang et en avançant vers l'écran, renvoie le couple `(rang, premiere_place)` du premier rang qui a `n` places libres côte à côte, ou `None`.
- `reserver_groupe(salle, n)` : réserve les places trouvées par `trouver_places`. Renvoie le même couple, ou `None` si aucun rang ne convient (la salle n'est alors pas modifiée).
- `taux_remplissage(salle)` : renvoie le pourcentage de places réservées, arrondi à l'entier le plus proche avec `round`.
- `recette(salle, tarifs)` : renvoie la somme payée pour toutes les places réservées.

<Indices>
<Indice>

`afficher` colle d'abord les places de chaque rang avec `"".join(rang)`, puis colle les rangs avec `"\n".join(...)`.

</Indice>
<Indice>

Dans `debut_suite`, compter les places libres consécutives : le compteur augmente sur une place libre et repart de 0 sur une place réservée. Quand il atteint `n` à l'indice `j`, la suite commence à l'indice `j - n + 1`.

</Indice>
<Indice>

`trouver_places` parcourt les rangs à l'envers, avec `range(len(salle) - 1, -1, -1)`, et s'arrête au premier rang où `debut_suite` ne renvoie pas `None`.

</Indice>
<Indice>

```text
(cœur du programme : placer un groupe)
FONCTION debut_suite(rang, n)
    suite ← 0
    POUR j ALLANT DE 0 À longueur(rang) - 1
        SI rang[j] = "." ALORS
            suite ← suite + 1
            SI suite = n ALORS RENVOYER j - n + 1
        SINON suite ← 0
    RENVOYER None

FONCTION trouver_places(salle, n)
    POUR r ALLANT DU dernier rang AU rang 0
        debut ← debut_suite(salle[r], n)
        SI debut ≠ None ALORS RENVOYER (r, debut)
    RENVOYER None
```

</Indice>
</Indices>

<Correction>

```python
def creer_salle(rangs: int, places: int) -> list:
    salle = []
    for _ in range(rangs):
        salle.append(["."] * places)
    return salle


def afficher(salle: list) -> str:
    lignes = []
    for rang in salle:
        lignes.append("".join(rang))
    return "\n".join(lignes)


def places_libres(salle: list) -> int:
    n = 0
    for rang in salle:
        for place in rang:
            if place == ".":
                n = n + 1
    return n


def reserver(salle: list, rang: int, place: int) -> bool:
    if not (0 <= rang < len(salle) and 0 <= place < len(salle[rang])):
        return False
    if salle[rang][place] != ".":
        return False
    salle[rang][place] = "X"
    return True


def debut_suite(rang: list, n: int):
    suite = 0
    for j in range(len(rang)):
        if rang[j] == ".":
            suite = suite + 1
            if suite == n:
                return j - n + 1
        else:
            suite = 0
    return None


def trouver_places(salle: list, n: int):
    for r in range(len(salle) - 1, -1, -1):
        debut = debut_suite(salle[r], n)
        if debut is not None:
            return (r, debut)
    return None


def reserver_groupe(salle: list, n: int):
    trouve = trouver_places(salle, n)
    if trouve is None:
        return None
    r, debut = trouve
    for j in range(debut, debut + n):
        reserver(salle, r, j)
    return trouve


def taux_remplissage(salle: list) -> int:
    total = 0
    for rang in salle:
        total = total + len(rang)
    if total == 0:
        return 0
    return round(100 * (total - places_libres(salle)) / total)


def recette(salle: list, tarifs: list) -> int:
    somme = 0
    for r in range(len(salle)):
        for place in salle[r]:
            if place == "X":
                somme = somme + tarifs[r]
    return somme
```

</Correction>
</Enonce>
<Verification>

```python
s = creer_salle(4, 6)
assert s == [["."] * 6 for _ in range(4)], "Une salle de 4 rangs de 6 places libres."
s[0][0] = "X"
assert s[1][0] == ".", "Chaque rang est une liste différente."
s = creer_salle(4, 6)
assert reserver(s, 3, 2) is True and reserver(s, 3, 2) is False, "Une place ne se réserve qu'une fois."
assert reserver(s, 9, 0) is False and reserver(s, 0, -1) is False and reserver(s, 0, 6) is False, "Une place qui n'existe pas."
for j in [0, 1, 4]:
    reserver(s, 2, j)
assert afficher(s) == "......\n......\nXX..X.\n..X...", "Le plan de la salle."
assert places_libres(s) == 20, "20 places libres."
assert debut_suite(s[3], 3) == 3 and debut_suite(s[2], 3) is None and debut_suite(["X", ".", ".", ".", "X"], 2) == 1, "Places côte à côte dans un rang."
assert trouver_places(s, 3) == (3, 3) and trouver_places(s, 4) == (1, 0) and trouver_places(s, 7) is None, "Le rang le plus au fond qui convient."
assert reserver_groupe(s, 4) == (1, 0) and s[1] == ["X", "X", "X", "X", ".", "."], "Un groupe de 4 au rang 1."
assert reserver_groupe(s, 4) == (0, 0) and reserver_groupe(s, 6) is None, "Le groupe suivant va au rang 0 ; 6 places côte à côte : impossible."
avant = afficher(s)
reserver_groupe(s, 6)
assert afficher(s) == avant, "Un groupe impossible à placer ne modifie pas la salle."
assert reserver_groupe(s, 1) == (3, 0), "Une personne seule : au fond, le plus à gauche possible."
assert taux_remplissage(s) == 54 and taux_remplissage(creer_salle(2, 2)) == 0, "13 places sur 24 : 54 %."
assert recette(s, [8, 9, 10, 12]) == 122, "La recette de la séance : 122 euros."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-l2d-6-2" label="6.2 [Mini-projet] - La bataille navale" type="python">
<Enonce>
### La bataille navale

**Contexte.** Le projet programme l'arbitre d'une bataille navale. Chaque joueur place ses bateaux sur une grille carrée, puis l'adversaire tire case par case. L'arbitre annonce le résultat de chaque tir, et la partie s'arrête quand tous les bateaux sont coulés. L'adversaire ne doit jamais voir les bateaux qui n'ont pas été touchés.

**Les données** : la grille est un tableau carré. Une case contient `"."` (de l'eau), `"B"` (un morceau de bateau), `"x"` (un tir tombé dans l'eau) ou `"#"` (un morceau de bateau touché). Un bateau est la liste des positions `(i, j)` qu'il occupe. Un tir est un couple `(i, j)`.

**Les fonctions du programme**
- `grille_vide(n)` : renvoie une grille `n` × `n` remplie d'eau, chaque ligne étant une liste différente.
- `positions(i, j, longueur, sens)` : renvoie la liste des positions d'un bateau qui commence en `(i, j)` et s'étend vers la droite si `sens` vaut `"H"`, vers le bas si `sens` vaut `"V"`. Exemple : `positions(1, 2, 3, "V")` vaut `[(1, 2), (2, 2), (3, 2)]`.
- `peut_placer(grille, i, j, longueur, sens)` : renvoie `True` si toutes les positions du bateau sont dans la grille et sur de l'eau.
- `placer(grille, i, j, longueur, sens)` : si c'est possible, place le bateau (ses cases deviennent `"B"`) et renvoie la liste de ses positions. Sinon, renvoie `None` sans modifier la grille.
- `tirer(grille, i, j)` : joue un tir et renvoie le message de l'arbitre : `"à l'eau"` (la case devient `"x"`), `"touché"` (la case devient `"#"`), `"déjà joué"` sur une case `"x"` ou `"#"`, ou `"hors grille"`.
- `coule(grille, bateau)` : renvoie `True` si toutes les cases du bateau sont touchées.
- `bateaux_restants(grille, bateaux)` : renvoie le nombre de bateaux de la liste `bateaux` qui ne sont pas coulés.
- `vue_adversaire(grille)` : renvoie une nouvelle grille où les cases `"B"` sont remplacées par de l'eau. Les autres cases sont recopiées.
- `partie(grille, bateaux, tirs)` : joue les tirs dans l'ordre et renvoie la liste des messages. Un tir qui coule un bateau donne `"coulé"` au lieu de `"touché"`. Un tir qui coule le dernier bateau donne `"gagné"`, et les tirs suivants ne sont pas joués.

<Indices>
<Indice>

`peut_placer` parcourt la liste renvoyée par `positions`. Une position hors de la grille doit être écartée **avant** de lire la case, sinon Python lève une erreur d'indice.

</Indice>
<Indice>

Dans `partie`, un tir `"touché"` peut changer de message : chercher le bateau qui contient la case `(i, j)` et vérifier s'il est coulé, puis vérifier s'il reste des bateaux.

</Indice>
<Indice>

```text
(cœur du programme : l'arbitre de la partie)
FONCTION partie(grille, bateaux, tirs)
    messages ← liste vide
    POUR CHAQUE (i, j) DE tirs
        m ← tirer(grille, i, j)
        SI m = "touché" ALORS
            SI le bateau qui contient (i, j) est coulé ALORS m ← "coulé"
            SI bateaux_restants(grille, bateaux) = 0 ALORS
                ajouter "gagné" à messages ; RENVOYER messages
        ajouter m à messages
    RENVOYER messages
```

</Indice>
</Indices>

<Correction>

```python
def grille_vide(n: int) -> list:
    grille = []
    for _ in range(n):
        grille.append(["."] * n)
    return grille


def positions(i: int, j: int, longueur: int, sens: str) -> list:
    cases = []
    for k in range(longueur):
        if sens == "H":
            cases.append((i, j + k))
        else:
            cases.append((i + k, j))
    return cases


def peut_placer(grille: list, i: int, j: int, longueur: int, sens: str) -> bool:
    for a, b in positions(i, j, longueur, sens):
        if not (0 <= a < len(grille) and 0 <= b < len(grille[a])):
            return False
        if grille[a][b] != ".":
            return False
    return True


def placer(grille: list, i: int, j: int, longueur: int, sens: str):
    if not peut_placer(grille, i, j, longueur, sens):
        return None
    bateau = positions(i, j, longueur, sens)
    for a, b in bateau:
        grille[a][b] = "B"
    return bateau


def tirer(grille: list, i: int, j: int) -> str:
    if not (0 <= i < len(grille) and 0 <= j < len(grille[i])):
        return "hors grille"
    if grille[i][j] == ".":
        grille[i][j] = "x"
        return "à l'eau"
    if grille[i][j] == "B":
        grille[i][j] = "#"
        return "touché"
    return "déjà joué"


def coule(grille: list, bateau: list) -> bool:
    for a, b in bateau:
        if grille[a][b] != "#":
            return False
    return True


def bateaux_restants(grille: list, bateaux: list) -> int:
    n = 0
    for bateau in bateaux:
        if not coule(grille, bateau):
            n = n + 1
    return n


def vue_adversaire(grille: list) -> list:
    vue = []
    for ligne in grille:
        nouvelle = []
        for case in ligne:
            if case == "B":
                nouvelle.append(".")
            else:
                nouvelle.append(case)
        vue.append(nouvelle)
    return vue


def partie(grille: list, bateaux: list, tirs: list) -> list:
    messages = []
    for i, j in tirs:
        m = tirer(grille, i, j)
        if m == "touché":
            for bateau in bateaux:
                if (i, j) in bateau and coule(grille, bateau):
                    m = "coulé"
            if bateaux_restants(grille, bateaux) == 0:
                messages.append("gagné")
                return messages
        messages.append(m)
    return messages
```

</Correction>
</Enonce>
<Verification>

```python
g = grille_vide(5)
assert g == [["."] * 5 for _ in range(5)], "Une grille 5 × 5 remplie d'eau."
g[0][0] = "B"
assert g[1][0] == ".", "Chaque ligne est une liste différente."
assert positions(1, 2, 3, "V") == [(1, 2), (2, 2), (3, 2)] and positions(0, 0, 2, "H") == [(0, 0), (0, 1)], "Positions d'un bateau."
g = grille_vide(5)
b1 = placer(g, 0, 0, 3, "H")
b2 = placer(g, 1, 4, 3, "V")
assert b1 == [(0, 0), (0, 1), (0, 2)] and b2 == [(1, 4), (2, 4), (3, 4)], "Deux bateaux placés."
assert placer(g, 0, 2, 2, "V") is None and placer(g, 4, 3, 3, "H") is None, "Sur un autre bateau, puis en dehors de la grille."
assert peut_placer(g, 2, 0, 3, "V") is True and peut_placer(g, 3, 0, 3, "V") is False, "peut_placer."
assert g == [["B", "B", "B", ".", "."], [".", ".", ".", ".", "B"], [".", ".", ".", ".", "B"], [".", ".", ".", ".", "B"], ["."] * 5], "La grille après les placements refusés."
tirs = [(0, 0), (4, 4), (0, 1), (0, 0), (9, 9), (0, 2), (1, 4), (2, 4), (3, 4), (0, 3)]
assert partie(g, [b1, b2], tirs) == ["touché", "à l'eau", "touché", "déjà joué", "hors grille", "coulé", "touché", "touché", "gagné"], "Une partie complète."
assert g[0][3] == ".", "Le tir qui suit la victoire n'est pas joué."
g2 = grille_vide(3)
bb = placer(g2, 1, 0, 2, "H")
assert tirer(g2, 1, 0) == "touché" and tirer(g2, 2, 2) == "à l'eau", "Deux tirs."
assert coule(g2, bb) is False and bateaux_restants(g2, [bb]) == 1, "Le bateau n'est touché qu'une fois."
assert vue_adversaire(g2) == [[".", ".", "."], ["#", ".", "."], [".", ".", "x"]], "L'adversaire ne voit que ses tirs."
assert g2[1][1] == "B", "vue_adversaire ne modifie pas la grille."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
