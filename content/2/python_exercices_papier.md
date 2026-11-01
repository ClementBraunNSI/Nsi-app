---
title: 'Exercices : Listes et tuples'
description: "Tuples, listes de tuples et tableaux à deux dimensions."
level: premiere
chapter: Structures de données linéaires
icon: "notebook-pen"
badgeId: premiere_fiche_exercices_papier
prerequisites:
  - python_exercices_listes
audience: public
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="listes-tuples" courseTitle="Listes et tuples">

<ExerciseSection id="1nsi-tuples-1-1" label="1.1 [Introduction] - Milieu d'un segment" type="python">
<Enonce>
### Milieu d'un segment

Un point est représenté par un tuple `(x, y)`.

Écrire une fonction `milieu(a, b)` qui renvoie le tuple du milieu du segment `[ab]`.

Exemple : `milieu((0, 0), (4, 2))` renvoie `(2.0, 1.0)`.

<Indices>
<Indice>

`xa, ya = a` récupère les deux coordonnées d'un coup : c'est le « déballage » d'un tuple.

</Indice>
<Indice>

Les coordonnées du milieu sont les moyennes des coordonnées.

</Indice>
<Indice>

```text
FONCTION milieu(a, b)
    (xa, ya) ← a ; (xb, yb) ← b
    RENVOYER ((xa + xb) / 2, (ya + yb) / 2)
```

</Indice>
</Indices>

<Correction>

```python
def milieu(a: tuple, b: tuple) -> tuple:
    xa, ya = a
    xb, yb = b
    return ((xa + xb) / 2, (ya + yb) / 2)
```

</Correction>
</Enonce>
<Verification>

```python
assert milieu((0, 0), (4, 2)) == (2.0, 1.0), "Milieu de (0, 0) et (4, 2)."
assert milieu((-1, 3), (1, -3)) == (0.0, 0.0), "Milieu de (-1, 3) et (1, -3)."
assert type(milieu((0, 0), (1, 1))) == tuple, "Le résultat est un tuple."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-1-2" label="1.2 [Introduction] - Échange" type="python">
<Enonce>
### Échange

Écrire une fonction `echanger(couple)` qui renvoie un nouveau tuple avec les deux éléments de `couple` dans l'ordre inverse.

Exemple : `echanger(("nord", 12))` renvoie `(12, "nord")`.

<Indices>
<Indice>

Un tuple ne se modifie pas : `couple[0] = ...` provoque une erreur. Il faut en construire un nouveau.

</Indice>
<Indice>

`couple[1]` et `couple[0]` donnent les deux éléments.

</Indice>
<Indice>

```text
FONCTION echanger(couple)
    RENVOYER (couple[1], couple[0])
```

</Indice>
</Indices>

<Correction>

```python
def echanger(couple: tuple) -> tuple:
    return (couple[1], couple[0])
```

</Correction>
</Enonce>
<Verification>

```python
assert echanger(("nord", 12)) == (12, "nord"), "(\"nord\", 12) devient (12, \"nord\")."
assert echanger((1, 1)) == (1, 1), "Deux éléments égaux."
c = (3, 4)
echanger(c)
assert c == (3, 4), "Le tuple d'origine n'a pas changé."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-1-3" label="1.3 [Introduction] - Fiche d'un élève" type="python">
<Enonce>
### Fiche d'un élève

Un élève est décrit par un tuple `(prenom, nom, age)`.

Écrire une fonction `etiquette(eleve)` qui renvoie le texte `"Léa MARTIN (16 ans)"` pour `("Léa", "Martin", 16)`.

<Indices>
<Indice>

Déballer le tuple en trois variables : `prenom, nom, age = eleve`.

</Indice>
<Indice>

`.upper()` met le nom en majuscules ; une f-string assemble le tout.

</Indice>
<Indice>

```text
FONCTION etiquette(eleve)
    (prenom, nom, age) ← eleve
    RENVOYER prenom + " " + majuscules(nom) + " (" + texte(age) + " ans)"
```

</Indice>
</Indices>

<Correction>

```python
def etiquette(eleve: tuple) -> str:
    prenom, nom, age = eleve
    return f"{prenom} {nom.upper()} ({age} ans)"
```

</Correction>
</Enonce>
<Verification>

```python
assert etiquette(("Léa", "Martin", 16)) == "Léa MARTIN (16 ans)", "Léa MARTIN (16 ans)."
assert etiquette(("Yanis", "Ben Ali", 15)) == "Yanis BEN ALI (15 ans)", "Nom composé."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-1-4" label="1.4 [Introduction] - Dimensions d'une grille" type="python">
<Enonce>
### Dimensions d'une grille

Une grille est une liste de lignes, chaque ligne étant une liste de même longueur.

Écrire une fonction `dimensions(grille)` qui renvoie le tuple `(nombre de lignes, nombre de colonnes)` d'une grille non vide.

Exemple : `dimensions([[1, 2, 3], [4, 5, 6]])` renvoie `(2, 3)`.

<Indices>
<Indice>

`len(grille)` compte les lignes.

</Indice>
<Indice>

Le nombre de colonnes est la longueur d'une ligne, par exemple la première : `grille[0]`.

</Indice>
<Indice>

```text
FONCTION dimensions(grille)
    RENVOYER (longueur(grille), longueur(grille[0]))
```

</Indice>
</Indices>

<Correction>

```python
def dimensions(grille: list) -> tuple:
    return (len(grille), len(grille[0]))
```

</Correction>
</Enonce>
<Verification>

```python
assert dimensions([[1, 2, 3], [4, 5, 6]]) == (2, 3), "2 lignes, 3 colonnes."
assert dimensions([[0]]) == (1, 1) and dimensions([[1], [2], [3]]) == (3, 1), "1 × 1 et 3 × 1."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-2-1" label="2.1 [Facile] - Distance entre deux points" type="python">
<Enonce>
### Distance entre deux points

Écrire une fonction `distance(a, b)` qui renvoie la distance entre les points `a` et `b` (des tuples `(x, y)`), arrondie au centième.

<Indices>
<Indice>

Déballer les deux tuples, puis appliquer la formule `racine((xb - xa)² + (yb - ya)²)`.

</Indice>
<Indice>

`** 0.5` calcule une racine carrée.

</Indice>
<Indice>

```text
FONCTION distance(a, b)
    (xa, ya) ← a ; (xb, yb) ← b
    RENVOYER arrondi(racine((xb - xa)² + (yb - ya)²), 2 chiffres)
```

</Indice>
</Indices>

<Correction>

```python
def distance(a: tuple, b: tuple) -> float:
    xa, ya = a
    xb, yb = b
    return round(((xb - xa) ** 2 + (yb - ya) ** 2) ** 0.5, 2)
```

</Correction>
</Enonce>
<Verification>

```python
assert distance((0, 0), (3, 4)) == 5, "De (0, 0) à (3, 4) : 5."
assert distance((1, 1), (1, 1)) == 0, "Un point et lui-même : 0."
assert distance((0, 0), (1, 1)) == 1.41 and distance((-2, 5), (1, 1)) == 5, "Autres distances."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-2-2" label="2.2 [Facile] - Le doyen" type="python">
<Enonce>
### Le doyen

`personnes` est une liste non vide de tuples `(prenom, age)`.

Écrire une fonction `doyen(personnes)` qui renvoie le prénom de la personne la plus âgée (la première en cas d'égalité).

<Indices>
<Indice>

`for prenom, age in personnes:` déballe chaque tuple directement dans la boucle.

</Indice>
<Indice>

Garder le prénom **et** l'âge du doyen provisoire : l'âge sert aux comparaisons, le prénom au résultat.

</Indice>
<Indice>

```text
FONCTION doyen(personnes)
    (nom_doyen, age_doyen) ← personnes[0]
    POUR CHAQUE (prenom, age) DE personnes
        SI age > age_doyen ALORS nom_doyen ← prenom ; age_doyen ← age
    RENVOYER nom_doyen
```

</Indice>
</Indices>

<Correction>

```python
def doyen(personnes: list) -> str:
    nom_doyen, age_doyen = personnes[0]
    for prenom, age in personnes:
        if age > age_doyen:
            nom_doyen = prenom
            age_doyen = age
    return nom_doyen
```

</Correction>
</Enonce>
<Verification>

```python
assert doyen([("Léa", 16), ("Tom", 17), ("Inès", 15)]) == "Tom", "Tom est le plus âgé."
assert doyen([("Ali", 15), ("Zoé", 15)]) == "Ali", "Égalité : le premier."
assert doyen([("Solo", 40)]) == "Solo", "Une seule personne."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-2-3" label="2.3 [Facile] - Diagonale" type="python">
<Enonce>
### Diagonale

Écrire une fonction `diagonale(matrice)` qui renvoie la liste des éléments de la diagonale principale d'une matrice carrée (de haut en gauche à bas en droite).

Exemple : pour `[[1, 2], [3, 4]]`, la diagonale est `[1, 4]`.

<Indices>
<Indice>

Sur la diagonale, le numéro de ligne est égal au numéro de colonne.

</Indice>
<Indice>

Une seule boucle suffit : `matrice[i][i]`.

</Indice>
<Indice>

```text
FONCTION diagonale(matrice)
    resultat ← liste vide
    POUR i ALLANT DE 0 À longueur(matrice) - 1 : ajouter matrice[i][i]
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def diagonale(matrice: list) -> list:
    resultat = []
    for i in range(len(matrice)):
        resultat.append(matrice[i][i])
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert diagonale([[1, 2], [3, 4]]) == [1, 4], "[[1, 2], [3, 4]] : [1, 4]."
assert diagonale([[5, 0, 0], [0, 6, 0], [0, 0, 7]]) == [5, 6, 7], "Matrice 3 × 3."
assert diagonale([[9]]) == [9], "Matrice 1 × 1."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-2-4" label="2.4 [Facile] - Sommes de lignes et de colonnes" type="python">
<Enonce>
### Sommes de lignes et de colonnes

Écrire deux fonctions pour une grille de nombres :
- `somme_ligne(grille, l)` : la somme des nombres de la ligne `l` ;
- `somme_colonne(grille, c)` : la somme des nombres de la colonne `c`.

<Indices>
<Indice>

Une ligne est déjà une liste : `grille[l]`.

</Indice>
<Indice>

Une colonne n'existe pas en tant que liste : il faut parcourir les lignes et prendre l'élément d'indice `c` de chacune.

</Indice>
<Indice>

```text
FONCTION somme_ligne(grille, l)
    RENVOYER somme des éléments de grille[l]
FONCTION somme_colonne(grille, c)
    total ← 0
    POUR CHAQUE ligne DE grille : total ← total + ligne[c]
    RENVOYER total
```

</Indice>
</Indices>

<Correction>

```python
def somme_ligne(grille: list, l: int) -> float:
    total = 0
    for x in grille[l]:
        total = total + x
    return total


def somme_colonne(grille: list, c: int) -> float:
    total = 0
    for ligne in grille:
        total = total + ligne[c]
    return total
```

</Correction>
</Enonce>
<Verification>

```python
g = [[1, 2, 3], [4, 5, 6]]
assert somme_ligne(g, 0) == 6 and somme_ligne(g, 1) == 15, "Sommes des lignes : 6 et 15."
assert somme_colonne(g, 0) == 5 and somme_colonne(g, 2) == 9, "Sommes des colonnes 0 et 2 : 5 et 9."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-3-1" label="3.1 [Moyen] - Transposée" type="python">
<Enonce>
### Transposée

La transposée d'une matrice échange lignes et colonnes : la ligne `i` devient la colonne `i`.

Écrire une fonction `transposer(m)` qui renvoie la transposée de la matrice `m` (pas forcément carrée), sans modifier `m`.

Exemple : `transposer([[1, 2, 3], [4, 5, 6]])` renvoie `[[1, 4], [2, 5], [3, 6]]`.

<Indices>
<Indice>

Le résultat a autant de lignes que `m` a de colonnes.

</Indice>
<Indice>

La ligne `c` du résultat se construit en prenant `m[l][c]` pour chaque ligne `l` de `m`.

</Indice>
<Indice>

```text
FONCTION transposer(m)
    resultat ← liste vide
    POUR c ALLANT DE 0 À nombre de colonnes - 1
        nouvelle_ligne ← [m[l][c] pour chaque ligne l]
        ajouter nouvelle_ligne à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def transposer(m: list) -> list:
    resultat = []
    for c in range(len(m[0])):
        nouvelle_ligne = []
        for l in range(len(m)):
            nouvelle_ligne.append(m[l][c])
        resultat.append(nouvelle_ligne)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
m = [[1, 2, 3], [4, 5, 6]]
assert transposer(m) == [[1, 4], [2, 5], [3, 6]], "Transposée d'une matrice 2 × 3."
assert m == [[1, 2, 3], [4, 5, 6]], "La matrice d'origine n'est pas modifiée."
assert transposer([[7]]) == [[7]] and transposer([[1, 2]]) == [[1], [2]], "1 × 1 et 1 × 2."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-3-2" label="3.2 [Moyen] - Grille vide (piège)" type="python">
<Enonce>
### Grille vide (piège)

Écrire une fonction `grille(n, p, valeur)` qui renvoie une grille de `n` lignes et `p` colonnes remplie de `valeur`. Chaque ligne doit être une liste **indépendante** : modifier une case ne doit modifier qu'une seule case.

Attention : `[[valeur] * p] * n` semble fonctionner, mais ce n'est pas le cas.

<Indices>
<Indice>

`[ligne] * n` ne copie pas la ligne : il met `n` fois **la même** liste. Modifier `g[0][0]` modifie alors toute la colonne.

</Indice>
<Indice>

Créer une nouvelle ligne à chaque tour de boucle : `[valeur] * p` placé dans la boucle crée une liste neuve à chaque fois.

</Indice>
<Indice>

```text
FONCTION grille(n, p, valeur)
    g ← liste vide
    RÉPÉTER n FOIS : ajouter une NOUVELLE liste [valeur] × p à g
    RENVOYER g
```

</Indice>
</Indices>

<Correction>

```python
def grille(n: int, p: int, valeur) -> list:
    g = []
    for _ in range(n):
        g.append([valeur] * p)
    return g
```

</Correction>
</Enonce>
<Verification>

```python
g = grille(3, 2, 0)
assert g == [[0, 0], [0, 0], [0, 0]], "Grille 3 × 2 de zéros."
g[0][0] = 9
assert g == [[9, 0], [0, 0], [0, 0]], "Modifier une case ne modifie qu'elle : les lignes sont indépendantes."
assert grille(0, 4, ".") == [] and grille(1, 3, ".") == [[".", ".", "."]], "0 ligne, puis 1 ligne."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-3-3" label="3.3 [Moyen] - Admis au concours" type="python">
<Enonce>
### Admis au concours

`resultats` est une liste de tuples `(nom, note)`.

Écrire une fonction `admis(resultats, seuil)` qui renvoie la liste des **noms** des candidats dont la note atteint au moins `seuil`, dans l'ordre de la liste.

<Indices>
<Indice>

Déballer chaque tuple dans la boucle : `for nom, note in resultats:`.

</Indice>
<Indice>

Seul le nom est ajouté au résultat.

</Indice>
<Indice>

```text
FONCTION admis(resultats, seuil)
    noms ← liste vide
    POUR CHAQUE (nom, note) DE resultats
        SI note ≥ seuil ALORS ajouter nom à noms
    RENVOYER noms
```

</Indice>
</Indices>

<Correction>

```python
def admis(resultats: list, seuil: float) -> list:
    noms = []
    for nom, note in resultats:
        if note >= seuil:
            noms.append(nom)
    return noms
```

</Correction>
</Enonce>
<Verification>

```python
r = [("Léa", 14), ("Tom", 9.5), ("Inès", 10), ("Noé", 18)]
assert admis(r, 10) == ["Léa", "Inès", "Noé"], "Seuil 10 : Léa, Inès, Noé."
assert admis(r, 20) == [] and admis([], 10) == [], "Personne."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-3-4" label="3.4 [Moyen] - Rectangle englobant" type="python">
<Enonce>
### Rectangle englobant

Écrire une fonction `englobant(points)` qui reçoit une liste non vide de points `(x, y)` et renvoie le tuple `((xmin, ymin), (xmax, ymax))` : les coins du plus petit rectangle qui contient tous les points.

<Indices>
<Indice>

Quatre records à suivre en un seul parcours : x le plus petit, x le plus grand, y le plus petit, y le plus grand.

</Indice>
<Indice>

Les initialiser avec les coordonnées du premier point.

</Indice>
<Indice>

```text
FONCTION englobant(points)
    (xmin, ymin) ← points[0] ; (xmax, ymax) ← points[0]
    POUR CHAQUE (x, y) DE points
        mettre à jour xmin, xmax, ymin, ymax
    RENVOYER ((xmin, ymin), (xmax, ymax))
```

</Indice>
</Indices>

<Correction>

```python
def englobant(points: list) -> tuple:
    xmin, ymin = points[0]
    xmax, ymax = points[0]
    for x, y in points:
        xmin = min(xmin, x)
        xmax = max(xmax, x)
        ymin = min(ymin, y)
        ymax = max(ymax, y)
    return ((xmin, ymin), (xmax, ymax))
```

</Correction>
</Enonce>
<Verification>

```python
assert englobant([(1, 5), (-2, 3), (4, -1)]) == ((-2, -1), (4, 5)), "Trois points."
assert englobant([(2, 2)]) == ((2, 2), (2, 2)), "Un seul point."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-4-1" label="4.1 [Difficile] - Voisins vivants" type="python">
<Enonce>
### Voisins vivants

Une grille contient des 0 (case vide) et des 1 (case occupée).

Écrire une fonction `voisins(grille, l, c)` qui renvoie le nombre de cases occupées parmi les **8 voisines** de la case `(l, c)`. Les cases hors de la grille ne comptent pas.

<Indices>
<Indice>

Les voisines sont aux positions `(l + dl, c + dc)` avec `dl` et `dc` valant -1, 0 ou 1, sauf `(0, 0)` qui est la case elle-même.

</Indice>
<Indice>

Avant de lire une voisine, vérifier qu'elle est dans la grille : `0 <= ligne < len(grille)` et de même pour la colonne.

</Indice>
<Indice>

```text
FONCTION voisins(grille, l, c)
    n ← 0
    POUR dl ALLANT DE -1 À 1
        POUR dc ALLANT DE -1 À 1
            SI (dl, dc) ≠ (0, 0) ET (l + dl, c + dc) dans la grille ALORS
                n ← n + grille[l + dl][c + dc]
    RENVOYER n
```

</Indice>
</Indices>

<Correction>

```python
def voisins(grille: list, l: int, c: int) -> int:
    n = 0
    for dl in (-1, 0, 1):
        for dc in (-1, 0, 1):
            ll, cc = l + dl, c + dc
            if (dl, dc) != (0, 0) and 0 <= ll < len(grille) and 0 <= cc < len(grille[0]):
                n = n + grille[ll][cc]
    return n
```

</Correction>
</Enonce>
<Verification>

```python
g = [[1, 1, 0],
     [0, 1, 0],
     [1, 0, 1]]
assert voisins(g, 1, 1) == 4, "La case du centre a 4 voisines occupées (elle-même ne compte pas)."
assert voisins(g, 0, 0) == 2, "Dans un coin : 2."
assert voisins(g, 2, 2) == 1 and voisins(g, 0, 2) == 2, "Autres coins."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-4-2" label="4.2 [Difficile] - Carré magique" type="python">
<Enonce>
### Carré magique

Un carré est **magique** si les sommes de chaque ligne, de chaque colonne et des deux diagonales sont toutes égales.

Écrire une fonction `est_magique(carre)` pour une matrice carrée de nombres.

<Indices>
<Indice>

Calculer une somme de référence (la première ligne), puis comparer chaque autre somme à celle-ci.

</Indice>
<Indice>

Les deux diagonales : `carre[i][i]` et `carre[i][n - 1 - i]`.

</Indice>
<Indice>

```text
FONCTION est_magique(carre)
    n ← longueur(carre) ; reference ← somme(carre[0])
    POUR i ALLANT DE 0 À n - 1
        SI somme ligne i ≠ reference OU somme colonne i ≠ reference ALORS RENVOYER FAUX
    SI somme diagonale ≠ reference OU somme antidiagonale ≠ reference ALORS RENVOYER FAUX
    RENVOYER VRAI
```

</Indice>
</Indices>

<Correction>

```python
def est_magique(carre: list) -> bool:
    n = len(carre)
    reference = sum(carre[0])
    for i in range(n):
        if sum(carre[i]) != reference:
            return False
        if sum(carre[l][i] for l in range(n)) != reference:
            return False
    diag = sum(carre[i][i] for i in range(n))
    anti = sum(carre[i][n - 1 - i] for i in range(n))
    return diag == reference and anti == reference
```

</Correction>
</Enonce>
<Verification>

```python
assert est_magique([[2, 7, 6], [9, 5, 1], [4, 3, 8]]) is True, "Le carré de Lo Shu est magique."
assert est_magique([[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]]) is True, "Carré 4 × 4 de Dürer."
assert est_magique([[1, 2], [3, 4]]) is False, "[[1, 2], [3, 4]] ne l'est pas."
assert est_magique([[2, 2], [2, 3]]) is False, "Une seule colonne fausse suffit."
assert est_magique([[1, 2, 3], [3, 1, 2], [2, 3, 1]]) is False, "Lignes et colonnes égales mais diagonales différentes."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-4-3" label="4.3 [Difficile] - Produit de matrices" type="python">
<Enonce>
### Produit de matrices

Le produit `a × b` d'une matrice `a` de taille `n × p` par une matrice `b` de taille `p × q` est une matrice `n × q` : sa case `(i, j)` vaut la somme des `a[i][k] × b[k][j]` pour `k` de 0 à `p - 1`.

Écrire une fonction `produit(a, b)`.

<Indices>
<Indice>

Trois boucles imbriquées : sur `i` (lignes de a), sur `j` (colonnes de b), et sur `k` pour la somme.

</Indice>
<Indice>

Construire chaque ligne du résultat dans une nouvelle liste.

</Indice>
<Indice>

```text
FONCTION produit(a, b)
    resultat ← liste vide
    POUR i ALLANT DE 0 À n - 1
        ligne ← liste vide
        POUR j ALLANT DE 0 À q - 1
            s ← somme des a[i][k] × b[k][j] pour k de 0 à p - 1
            ajouter s à ligne
        ajouter ligne à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def produit(a: list, b: list) -> list:
    resultat = []
    for i in range(len(a)):
        ligne = []
        for j in range(len(b[0])):
            s = 0
            for k in range(len(b)):
                s = s + a[i][k] * b[k][j]
            ligne.append(s)
        resultat.append(ligne)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert produit([[1, 2], [3, 4]], [[5, 6], [7, 8]]) == [[19, 22], [43, 50]], "Produit de deux matrices 2 × 2."
assert produit([[1, 0], [0, 1]], [[9, 8], [7, 6]]) == [[9, 8], [7, 6]], "L'identité ne change rien."
assert produit([[1, 2, 3]], [[1], [2], [3]]) == [[14]], "Ligne × colonne : 1 × 1."
assert produit([[1], [2]], [[3, 4]]) == [[3, 4], [6, 8]], "Colonne × ligne : 2 × 2."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-4-4" label="4.4 [Difficile] - Chemin dans un labyrinthe" type="python">
<Enonce>
### Chemin dans un labyrinthe

Un labyrinthe est une grille de 0 (passage) et de 1 (mur). Un chemin est une liste de cases `(l, c)`.

Écrire une fonction `chemin_valide(grille, chemin)` qui renvoie `True` si toutes les cases du chemin sont dans la grille et sont des passages, et si chaque case est voisine de la précédente (un pas en haut, en bas, à gauche ou à droite, pas en diagonale).

<Indices>
<Indice>

Vérifier chaque case une par une, puis chaque paire de cases consécutives.

</Indice>
<Indice>

Deux cases sont voisines si `abs(l1 - l2) + abs(c1 - c2) == 1`.

</Indice>
<Indice>

```text
FONCTION chemin_valide(grille, chemin)
    POUR CHAQUE (l, c) DE chemin
        SI (l, c) hors de la grille OU grille[l][c] = 1 ALORS RENVOYER FAUX
    POUR i ALLANT DE 1 À longueur(chemin) - 1
        SI |l(i) - l(i-1)| + |c(i) - c(i-1)| ≠ 1 ALORS RENVOYER FAUX
    RENVOYER VRAI
```

</Indice>
</Indices>

<Correction>

```python
def chemin_valide(grille: list, chemin: list) -> bool:
    for l, c in chemin:
        if not (0 <= l < len(grille) and 0 <= c < len(grille[0])) or grille[l][c] == 1:
            return False
    for i in range(1, len(chemin)):
        (l1, c1), (l2, c2) = chemin[i - 1], chemin[i]
        if abs(l1 - l2) + abs(c1 - c2) != 1:
            return False
    return True
```

</Correction>
</Enonce>
<Verification>

```python
lab = [[0, 0, 1],
       [1, 0, 1],
       [1, 0, 0]]
assert chemin_valide(lab, [(0, 0), (0, 1), (1, 1), (2, 1), (2, 2)]) is True, "Le chemin à travers le labyrinthe."
assert chemin_valide(lab, [(0, 0), (1, 0)]) is False, "Un mur bloque."
assert chemin_valide(lab, [(0, 0), (1, 1)]) is False, "Pas de diagonale."
assert chemin_valide(lab, [(2, 2), (2, 3)]) is False, "Sortie de la grille."
assert chemin_valide(lab, [(0, 1), (0, 1)]) is False, "Rester sur place n'est pas un pas."
assert chemin_valide(lab, []) is True, "Le chemin vide est valide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-5-1" label="5.1 [Expert] - Jeu de la vie" type="python">
<Enonce>
### Jeu de la vie

Dans le jeu de la vie, une grille de cellules (1 vivante, 0 morte) évolue selon deux règles appliquées **en même temps** à toutes les cases :
- une cellule morte avec exactement 3 voisines vivantes naît ;
- une cellule vivante avec 2 ou 3 voisines vivantes survit, sinon elle meurt.

Écrire une fonction `generation(grille)` qui renvoie la grille suivante, sans modifier `grille` (les bords ne sont pas reliés entre eux).

<Indices>
<Indice>

« En même temps » : les voisines se comptent toujours sur l'**ancienne** grille. Écrire dans une nouvelle grille.

</Indice>
<Indice>

Une fonction `voisins(grille, l, c)` (8 voisines, hors grille ignorées) allège beaucoup le code.

</Indice>
<Indice>

```text
FONCTION generation(grille)
    nouvelle ← grille de même taille remplie de 0
    POUR CHAQUE case (l, c)
        v ← voisins(grille, l, c)
        SI grille[l][c] = 1 ET v ∈ (2, 3) ALORS nouvelle[l][c] ← 1
        SI grille[l][c] = 0 ET v = 3 ALORS nouvelle[l][c] ← 1
    RENVOYER nouvelle
```

</Indice>
</Indices>

<Correction>

```python
def voisins(grille: list, l: int, c: int) -> int:
    n = 0
    for dl in (-1, 0, 1):
        for dc in (-1, 0, 1):
            ll, cc = l + dl, c + dc
            if (dl, dc) != (0, 0) and 0 <= ll < len(grille) and 0 <= cc < len(grille[0]):
                n = n + grille[ll][cc]
    return n


def generation(grille: list) -> list:
    nouvelle = []
    for l in range(len(grille)):
        ligne = []
        for c in range(len(grille[0])):
            v = voisins(grille, l, c)
            vivante = (grille[l][c] == 1 and v in (2, 3)) or (grille[l][c] == 0 and v == 3)
            ligne.append(1 if vivante else 0)
        nouvelle.append(ligne)
    return nouvelle
```

</Correction>
</Enonce>
<Verification>

```python
clignotant = [[0, 0, 0], [1, 1, 1], [0, 0, 0]]
assert generation(clignotant) == [[0, 1, 0], [0, 1, 0], [0, 1, 0]], "Le clignotant passe à la verticale."
assert generation(generation(clignotant)) == clignotant, "Puis revient à l'horizontale."
assert clignotant == [[0, 0, 0], [1, 1, 1], [0, 0, 0]], "La grille d'origine n'est pas modifiée."
bloc = [[0, 0, 0, 0], [0, 1, 1, 0], [0, 1, 1, 0], [0, 0, 0, 0]]
assert generation(bloc) == bloc, "Le bloc 2 × 2 reste stable."
assert generation([[1]]) == [[0]], "Une cellule seule meurt."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-5-2" label="5.2 [Expert] - Morpion" type="python">
<Enonce>
### Morpion

Une grille de morpion est une liste de 3 lignes de 3 caractères : `"X"`, `"O"` ou `" "` (case vide).

Écrire une fonction `gagnant(grille)` qui renvoie `"X"` ou `"O"` si ce joueur a aligné trois symboles (ligne, colonne ou diagonale), et `None` sinon.

<Indices>
<Indice>

Il y a 8 alignements possibles. Les lister sous forme de triplets de cases évite d'écrire 8 conditions.

</Indice>
<Indice>

Un alignement est gagnant si ses trois cases sont égales **et** non vides.

</Indice>
<Indice>

```text
FONCTION gagnant(grille)
    alignements ← les 3 lignes, les 3 colonnes et les 2 diagonales (triplets de cases)
    POUR CHAQUE (a, b, c) DE alignements
        SI a = b = c ET a ≠ " " ALORS RENVOYER a
    RENVOYER None
```

</Indice>
</Indices>

<Correction>

```python
def gagnant(grille: list):
    alignements = []
    for i in range(3):
        alignements.append((grille[i][0], grille[i][1], grille[i][2]))
        alignements.append((grille[0][i], grille[1][i], grille[2][i]))
    alignements.append((grille[0][0], grille[1][1], grille[2][2]))
    alignements.append((grille[0][2], grille[1][1], grille[2][0]))
    for a, b, c in alignements:
        if a == b == c and a != " ":
            return a
    return None
```

</Correction>
</Enonce>
<Verification>

```python
assert gagnant([["X", "X", "X"], ["O", "O", " "], [" ", " ", " "]]) == "X", "Ligne de X."
assert gagnant([["O", "X", " "], ["O", "X", " "], ["O", " ", "X"]]) == "O", "Colonne de O."
assert gagnant([["X", "O", "O"], [" ", "X", " "], ["O", " ", "X"]]) == "X", "Diagonale de X."
assert gagnant([["X", "O", "O"], [" ", "O", " "], ["O", " ", "X"]]) == "O", "Antidiagonale de O."
assert gagnant([[" "] * 3 for _ in range(3)]) is None, "Grille vide : aucun gagnant."
assert gagnant([["X", "O", "X"], ["X", "O", "O"], ["O", "X", "X"]]) is None, "Match nul."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-5-3" label="5.3 [Expert] - Rotation d'image" type="python">
<Enonce>
### Rotation d'image

Une image est une grille de pixels de `n` lignes et `p` colonnes.

Écrire une fonction `tourner(image)` qui renvoie l'image tournée d'un quart de tour **dans le sens des aiguilles d'une montre** (elle a alors `p` lignes et `n` colonnes).

Exemple : `[[1, 2, 3], [4, 5, 6]]` devient `[[4, 1], [5, 2], [6, 3]]`.

<Indices>
<Indice>

Sur l'exemple, la première ligne du résultat est la première colonne de l'image, lue de **bas en haut**.

</Indice>
<Indice>

La case `(i, j)` du résultat vaut `image[n - 1 - j][i]`.

</Indice>
<Indice>

```text
FONCTION tourner(image)
    n ← nombre de lignes ; p ← nombre de colonnes
    resultat ← liste vide
    POUR i ALLANT DE 0 À p - 1
        ligne ← [image[n - 1 - j][i] pour j de 0 à n - 1]
        ajouter ligne à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def tourner(image: list) -> list:
    n = len(image)
    p = len(image[0])
    resultat = []
    for i in range(p):
        ligne = []
        for j in range(n):
            ligne.append(image[n - 1 - j][i])
        resultat.append(ligne)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert tourner([[1, 2, 3], [4, 5, 6]]) == [[4, 1], [5, 2], [6, 3]], "Exemple 2 × 3."
img = [[1, 2], [3, 4]]
assert tourner(img) == [[3, 1], [4, 2]], "Carré 2 × 2."
assert tourner(tourner(tourner(tourner(img)))) == img, "Quatre quarts de tour ramènent l'image."
assert tourner([[7]]) == [[7]], "Un seul pixel."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-5-4" label="5.4 [Expert] - Pot de peinture" type="python">
<Enonce>
### Pot de peinture

L'outil « pot de peinture » d'un logiciel de dessin colorie une zone : à partir d'une case de départ, il change la couleur de toutes les cases de **même couleur** reliées à elle par des voisines haut, bas, gauche ou droite.

Écrire une fonction `remplir(image, l, c, couleur)` qui modifie `image` (une grille de couleurs) sur place.

<Indices>
<Indice>

Retenir la couleur d'origine de la case de départ. Si elle est déjà égale à `couleur`, il n'y a rien à faire (sinon, attention à la boucle infinie).

</Indice>
<Indice>

Utiliser une liste « à traiter » : y mettre la case de départ ; tant qu'elle n'est pas vide, en retirer une case, la colorier si elle a la couleur d'origine, et ajouter ses 4 voisines.

</Indice>
<Indice>

```text
FONCTION remplir(image, l, c, couleur)
    origine ← image[l][c]
    SI origine = couleur ALORS RENVOYER
    a_traiter ← [(l, c)]
    TANT QUE a_traiter non vide
        (i, j) ← retirer une case de a_traiter
        SI (i, j) dans l'image ET image[i][j] = origine ALORS
            image[i][j] ← couleur
            ajouter les 4 voisines de (i, j) à a_traiter
```

</Indice>
</Indices>

<Correction>

```python
def remplir(image: list, l: int, c: int, couleur) -> None:
    origine = image[l][c]
    if origine == couleur:
        return
    a_traiter = [(l, c)]
    while a_traiter:
        i, j = a_traiter.pop()
        if 0 <= i < len(image) and 0 <= j < len(image[0]) and image[i][j] == origine:
            image[i][j] = couleur
            a_traiter.extend([(i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1)])
```

</Correction>
</Enonce>
<Verification>

```python
img = [["b", "b", "n"],
       ["b", "n", "n"],
       ["n", "b", "b"]]
remplir(img, 0, 0, "r")
assert img == [["r", "r", "n"], ["r", "n", "n"], ["n", "b", "b"]], "La zone blanche du coin est peinte, pas celle d'en bas (pas de diagonale)."
remplir(img, 1, 1, "n")
assert img[1][1] == "n", "Même couleur : rien ne change, et pas de boucle infinie."
grand = [[0] * 200 for _ in range(200)]
remplir(grand, 100, 100, 7)
assert all(x == 7 for ligne in grand for x in ligne), "Une grande image se remplit entièrement."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-6-1" label="6.1 [Mini-projet] - Démineur" type="python">
<Enonce>
### Démineur

**Contexte.** Pour le concours de programmation du lycée, une équipe reprogramme le démineur. Le **moteur** du jeu (ce projet) gère deux grilles : le plateau caché, connu du programme seul, et la grille visible par le joueur. L'interface graphique, réalisée par une autre équipe, n'appellera que les fonctions décrites ci-dessous.

**Les données**
- Le plateau caché est une grille `n × p` d'entiers : `-1` pour une mine, sinon le nombre de mines parmi les 8 cases voisines.
- La grille du joueur, `etat`, contient des caractères : `"#"` pour une case cachée, `"F"` pour un drapeau, `"*"` pour une mine révélée, ou le chiffre de la case (`"0"`, `"1"`…).
- Une position est un tuple `(ligne, colonne)` ; les mines d'une partie sont données par la liste de leurs positions, par exemple `[(0, 0), (2, 3)]`.

**Les fonctions du moteur**
- `voisines(n, p, l, c)` : utile partout (compter les mines, propager les zéros). Renvoie la liste des positions voisines de `(l, c)` qui existent dans la grille (8 au plus), dans l'ordre des lignes puis des colonnes.
- `creer(n, p, mines)` : prépare une partie. Reçoit les dimensions et la liste des mines ; renvoie le plateau caché.
- `etat_initial(n, p)` : la grille affichée au début, entièrement cachée.
- `drapeau(etat, l, c)` : appelée quand le joueur fait un clic droit. Pose ou retire un drapeau sur une case cachée ; sans effet sur une case révélée.
- `reveler(plateau, etat, l, c)` : appelée quand le joueur clique sur une case. Met à jour `etat` et renvoie `"perdu"` (c'est une mine, qui s'affiche `"*"`), `"gagne"` (toutes les cases sans mine sont révélées) ou `"continue"`. Comme dans le vrai jeu, une case à `0` révèle automatiquement ses voisines, et ainsi de suite tant qu'on rencontre des `0`. Une case déjà révélée ou sous drapeau n'est pas touchée.
- `affichage(etat)` : la version texte de la grille, pour tester le moteur sans interface. Renvoie une ligne de texte par rangée.

<Indices>
<Indice>

Commencer par `voisines` : elle sert à compter les mines dans `creer`, et à propager les zéros dans `reveler`.

</Indice>
<Indice>

Pour la propagation, une liste de cases « à révéler » : en retirer une, la révéler, et si c'est un 0, ajouter ses voisines encore cachées. Une boucle, pas de récursivité nécessaire.

</Indice>
<Indice>

Pour savoir si la partie est gagnée, compter les cases encore cachées (ou sous drapeau) : il en reste exactement autant que de mines.

</Indice>
<Indice>

```text
(cœur du programme : révéler avec propagation)
FONCTION reveler(plateau, etat, l, c)
    SI etat[l][c] ≠ "#" ALORS RENVOYER "continue"
    SI plateau[l][c] = -1 ALORS etat[l][c] ← "*" ; RENVOYER "perdu"
    a_reveler ← [(l, c)]
    TANT QUE a_reveler non vide
        (i, j) ← retirer une case
        SI etat[i][j] = "#" ALORS
            etat[i][j] ← texte(plateau[i][j])
            SI plateau[i][j] = 0 ALORS ajouter toutes les voisines de (i, j) à a_reveler
    RENVOYER "gagne" si le nombre de cases non révélées = nombre de mines, sinon "continue"
```

</Indice>
</Indices>

<Correction>

```python
def voisines(n: int, p: int, l: int, c: int) -> list:
    resultat = []
    for i in range(l - 1, l + 2):
        for j in range(c - 1, c + 2):
            if (i, j) != (l, c) and 0 <= i < n and 0 <= j < p:
                resultat.append((i, j))
    return resultat


def creer(n: int, p: int, mines: list) -> list:
    plateau = [[0] * p for _ in range(n)]
    for l, c in mines:
        plateau[l][c] = -1
    for l in range(n):
        for c in range(p):
            if plateau[l][c] != -1:
                plateau[l][c] = sum(1 for i, j in voisines(n, p, l, c) if plateau[i][j] == -1)
    return plateau


def etat_initial(n: int, p: int) -> list:
    return [["#"] * p for _ in range(n)]


def drapeau(etat: list, l: int, c: int) -> None:
    if etat[l][c] == "#":
        etat[l][c] = "F"
    elif etat[l][c] == "F":
        etat[l][c] = "#"


def reveler(plateau: list, etat: list, l: int, c: int) -> str:
    if etat[l][c] != "#":
        return "continue"
    if plateau[l][c] == -1:
        etat[l][c] = "*"
        return "perdu"
    n, p = len(plateau), len(plateau[0])
    a_reveler = [(l, c)]
    while a_reveler:
        i, j = a_reveler.pop()
        if etat[i][j] == "#":
            etat[i][j] = str(plateau[i][j])
            if plateau[i][j] == 0:
                a_reveler.extend(voisines(n, p, i, j))
    caches = sum(1 for ligne in etat for x in ligne if x in "#F")
    mines = sum(1 for ligne in plateau for x in ligne if x == -1)
    return "gagne" if caches == mines else "continue"


def affichage(etat: list) -> str:
    return "\n".join("".join(ligne) for ligne in etat)
```

</Correction>
</Enonce>
<Verification>

```python
assert voisines(3, 3, 1, 1) == [(0, 0), (0, 1), (0, 2), (1, 0), (1, 2), (2, 0), (2, 1), (2, 2)] and voisines(3, 4, 0, 0) == [(0, 1), (1, 0), (1, 1)], "Voisines."
P = creer(4, 5, [(0, 0), (2, 3)])
assert P == [[-1, 1, 0, 0, 0], [1, 1, 1, 1, 1], [0, 0, 1, -1, 1], [0, 0, 1, 1, 1]], "Plateau caché."
E = etat_initial(4, 5)
assert E == [["#"] * 5 for _ in range(4)], "Tout est caché."
E[0][0] = "X"
assert E[1][0] == "#", "Les lignes de la grille du joueur sont indépendantes."
E = etat_initial(4, 5)
drapeau(E, 0, 0)
assert E[0][0] == "F" and reveler(P, E, 0, 0) == "continue" and E[0][0] == "F", "Une case sous drapeau ne se révèle pas."
assert reveler(P, E, 0, 4) == "continue", "Révéler un 0."
assert affichage(E) == "F1000\n#1111\n#####\n#####", "Propagation des zéros jusqu'aux chiffres."
assert reveler(P, E, 3, 0) == "continue" and affichage(E).split("\n")[2] == "001##", "Seconde zone de zéros."
assert reveler(P, E, 1, 0) == "continue" and reveler(P, E, 1, 1) == "continue" and reveler(P, E, 0, 1) == "continue", "Cases chiffrées."
assert reveler(P, E, 3, 3) == "continue" and reveler(P, E, 2, 4) == "continue" and reveler(P, E, 3, 4) == "gagne", "Dernière case sans mine : gagné."
E2 = etat_initial(4, 5)
assert reveler(P, E2, 2, 3) == "perdu" and E2[2][3] == "*", "Mine : perdu."
drapeau(E2, 2, 3)
assert E2[2][3] == "*", "Pas de drapeau sur une case révélée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-tuples-6-2" label="6.2 [Mini-projet] - Puissance 4" type="python">
<Enonce>
### Puissance 4

**Contexte.** Le foyer du lycée installe une borne de jeux. Le premier jeu est un Puissance 4 qu'on peut jouer à deux ou contre l'ordinateur. Le projet en écrit le moteur : la grille, la chute des pions, la détection des alignements, et un adversaire informatique simple mais qui ne rate jamais un coup gagnant.

**Les données** : la grille a 6 lignes et 7 colonnes ; la ligne 0 est en haut, la ligne 5 en bas. Une case contient `"."` (vide), `"X"` ou `"O"`. Un pion joué dans une colonne tombe dans la case vide la plus basse. Une partie enregistrée est la liste des colonnes jouées, `"X"` commençant : `[3, 3, 4, 4, 5, 5, 6]`.

**Les fonctions du moteur**
- `grille_vide()` : la grille d'une nouvelle partie.
- `jouer(grille, col, pion)` : fait tomber un pion. Renvoie la ligne où il s'arrête, ou `-1` (sans rien modifier) si la colonne est pleine ou n'existe pas.
- `aligne(grille, l, c)` : vérifie, après un coup, si le pion posé fait gagner. Renvoie `True` si le pion de la case `(l, c)` fait partie d'un alignement d'au moins 4 pions identiques (horizontal, vertical ou diagonal).
- `gagnant(grille)` : utilisée pour vérifier une grille quelconque. Renvoie `"X"`, `"O"` ou `None`.
- `colonnes_jouables(grille)` : les coups permis. Renvoie la liste des colonnes non pleines.
- `coup_gagnant(grille, pion)` : repère une victoire immédiate. Renvoie la première colonne (de gauche à droite) où `pion` gagne en un coup, ou `-1`, **sans modifier** la grille.
- `coup_ordinateur(grille, pion)` : le choix de l'ordinateur. Il gagne si c'est possible ; sinon il bloque un coup gagnant de l'adversaire ; sinon il joue la colonne jouable la plus proche du centre (ordre de préférence 3, 2, 4, 1, 5, 0, 6). Renvoie la colonne choisie.
- `partie(coups)` : rejoue une partie enregistrée, pour les tests et le mode « revoir la partie ». S'arrête au premier alignement et renvoie le tuple `(gagnant, nombre_de_coups_joues)` (`None` comme gagnant si personne n'a gagné).

<Indices>
<Indice>

Pour `aligne`, compter les pions identiques dans une direction `(dl, dc)` et dans la direction opposée, à partir de la case. Quatre directions suffisent : `(0, 1)`, `(1, 0)`, `(1, 1)` et `(1, -1)`.

</Indice>
<Indice>

`coup_gagnant` essaie chaque colonne : jouer, tester `aligne`, puis **retirer** le pion (remettre `"."`) avant d'essayer la suivante.

</Indice>
<Indice>

`coup_ordinateur` n'est qu'un enchaînement de `coup_gagnant` (pour soi, puis pour l'adversaire) et d'un choix par défaut.

</Indice>
<Indice>

```text
(cœur du programme : détecter un alignement)
FONCTION aligne(grille, l, c)
    pion ← grille[l][c]
    POUR CHAQUE (dl, dc) DE (0, 1), (1, 0), (1, 1), (1, -1)
        total ← 1
        POUR CHAQUE sens DE 1, -1
            i ← l + sens × dl ; j ← c + sens × dc
            TANT QUE (i, j) dans la grille ET grille[i][j] = pion
                total ← total + 1 ; i ← i + sens × dl ; j ← j + sens × dc
        SI total ≥ 4 ALORS RENVOYER VRAI
    RENVOYER FAUX
```

</Indice>
</Indices>

<Correction>

```python
LIGNES, COLONNES = 6, 7


def grille_vide() -> list:
    return [["."] * COLONNES for _ in range(LIGNES)]


def jouer(grille: list, col: int, pion: str) -> int:
    if not 0 <= col < COLONNES:
        return -1
    for l in range(LIGNES - 1, -1, -1):
        if grille[l][col] == ".":
            grille[l][col] = pion
            return l
    return -1


def aligne(grille: list, l: int, c: int) -> bool:
    pion = grille[l][c]
    if pion == ".":
        return False
    for dl, dc in ((0, 1), (1, 0), (1, 1), (1, -1)):
        total = 1
        for sens in (1, -1):
            i, j = l + sens * dl, c + sens * dc
            while 0 <= i < LIGNES and 0 <= j < COLONNES and grille[i][j] == pion:
                total = total + 1
                i, j = i + sens * dl, j + sens * dc
        if total >= 4:
            return True
    return False


def gagnant(grille: list):
    for l in range(LIGNES):
        for c in range(COLONNES):
            if aligne(grille, l, c):
                return grille[l][c]
    return None


def colonnes_jouables(grille: list) -> list:
    return [c for c in range(COLONNES) if grille[0][c] == "."]


def coup_gagnant(grille: list, pion: str) -> int:
    for c in colonnes_jouables(grille):
        l = jouer(grille, c, pion)
        gagne = aligne(grille, l, c)
        grille[l][c] = "."
        if gagne:
            return c
    return -1


def coup_ordinateur(grille: list, pion: str) -> int:
    adversaire = "O" if pion == "X" else "X"
    for joueur in (pion, adversaire):
        c = coup_gagnant(grille, joueur)
        if c != -1:
            return c
    for c in (3, 2, 4, 1, 5, 0, 6):
        if c in colonnes_jouables(grille):
            return c
    return -1


def partie(coups: list) -> tuple:
    grille = grille_vide()
    pion = "X"
    for k in range(len(coups)):
        l = jouer(grille, coups[k], pion)
        if l != -1 and aligne(grille, l, coups[k]):
            return (pion, k + 1)
        pion = "O" if pion == "X" else "X"
    return (None, len(coups))
```

</Correction>
</Enonce>
<Verification>

```python
g = grille_vide()
assert len(g) == 6 and all(len(l) == 7 for l in g) and g[0] is not g[1], "Grille 6 × 7, lignes indépendantes."
assert jouer(g, 3, "X") == 5 and jouer(g, 3, "O") == 4 and g[5][3] == "X" and g[4][3] == "O", "Les pions s'empilent."
for _ in range(4):
    jouer(g, 3, "X")
assert jouer(g, 3, "O") == -1 and jouer(g, 7, "O") == -1 and colonnes_jouables(g) == [0, 1, 2, 4, 5, 6], "Colonne pleine, colonne inexistante."
h = grille_vide()
for c in range(4):
    jouer(h, c, "O")
assert aligne(h, 5, 2) and gagnant(h) == "O", "Alignement horizontal."
d = grille_vide()
for c, hauteur in [(0, 0), (1, 1), (2, 2), (3, 3)]:
    for _ in range(hauteur):
        jouer(d, c, "O")
    jouer(d, c, "X")
assert aligne(d, 2, 3) and gagnant(d) == "X", "Alignement diagonal."
assert not aligne(d, 5, 1) and gagnant(grille_vide()) is None, "Pas d'alignement."
v = grille_vide()
for _ in range(3):
    jouer(v, 6, "X")
copie = [l[:] for l in v]
assert coup_gagnant(v, "X") == 6 and v == copie and coup_gagnant(v, "O") == -1, "Coup gagnant détecté, grille intacte."
assert coup_ordinateur(v, "X") == 6 and coup_ordinateur(v, "O") == 6, "Gagner, ou bloquer."
assert coup_ordinateur(grille_vide(), "O") == 3, "Par défaut : le centre."
assert partie([3, 3, 4, 4, 5, 5, 6, 6]) == ("X", 7), "X aligne au 7e coup ; le coup suivant n'est pas joué."
assert partie([0, 1, 0, 1, 0, 1, 2, 1]) == ("O", 8) and partie([0, 1]) == (None, 2), "O gagne verticalement ; partie inachevée."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
