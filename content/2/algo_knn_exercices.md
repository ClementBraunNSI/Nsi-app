---
title: Exercices KNN
description: >-
  Exercices pratiques sur l'algorithme des K Plus Proches Voisins (calculs
  manuels, implémentation Python, analyse).
level: premiere
chapter: Algorithmique
icon: "dumbbell"
badgeId: premiere_exercices
prerequisites:
  - algo_knn
audience: public
groupe: knn
groupeTitre: "k plus proches voisins (KNN)"
---

Pour classer un nouvel élément, l'algorithme des **k plus proches voisins** cherche les `k` éléments connus les plus proches de lui et lui attribue la classe la plus représentée parmi eux.

Dans ces exercices, un élément connu est un tuple `(x, y, classe)` et la distance est la distance euclidienne, sauf mention contraire.

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite. Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.

<ExerciseTabs courseId="premiere_exercices" courseTitle="Exercices KNN">

<ExerciseSection id="1nsi-knn-1-1" label="1.1 [Introduction] - Distance euclidienne" type="python">
<Enonce>
### Distance euclidienne

Écrire une fonction `distance(a, b)` qui renvoie la distance euclidienne entre deux points `a` et `b`. Les points sont des tuples dont les deux premiers éléments sont les coordonnées `x` et `y` (un troisième élément éventuel, la classe, est ignoré).

<Indices>
<Indice>

La distance vaut la racine carrée de `(xb - xa)² + (yb - ya)²`.

</Indice>
<Indice>

`a[0]` et `a[1]` sont les coordonnées de `a`, quelle que soit la longueur du tuple.

</Indice>
<Indice>

```text
FONCTION distance(a, b)
    RENVOYER racine((a[0] - b[0])² + (a[1] - b[1])²)
```

</Indice>
</Indices>

<Correction>

```python
def distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5
```

</Correction>
</Enonce>
<Verification>

```python
assert distance((0, 0), (3, 4)) == 5, "De (0, 0) à (3, 4) : 5."
assert distance((1, 1, "A"), (1, 1)) == 0, "La classe est ignorée."
assert abs(distance((2, 5), (5, 9)) - 5) < 1e-9 and abs(distance((0, 0), (1, 1)) - 2 ** 0.5) < 1e-9, "Autres distances."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-1-2" label="1.2 [Introduction] - Distance de Manhattan" type="python">
<Enonce>
### Distance de Manhattan

Dans une ville quadrillée, on ne se déplace qu'horizontalement et verticalement : la distance « de Manhattan » entre deux points est la somme des écarts en `x` et en `y`.

Écrire une fonction `manhattan(a, b)`.

<Indices>
<Indice>

Un écart se mesure en valeur absolue : `abs(a[0] - b[0])`.

</Indice>
<Indice>

Additionner l'écart horizontal et l'écart vertical.

</Indice>
<Indice>

```text
FONCTION manhattan(a, b)
    RENVOYER |a[0] - b[0]| + |a[1] - b[1]|
```

</Indice>
</Indices>

<Correction>

```python
def manhattan(a: tuple, b: tuple) -> float:
    return abs(a[0] - b[0]) + abs(a[1] - b[1])
```

</Correction>
</Enonce>
<Verification>

```python
assert manhattan((0, 0), (3, 4)) == 7, "De (0, 0) à (3, 4) : 7."
assert manhattan((5, 1), (2, 3)) == 5 and manhattan((1, 1, "A"), (1, 1)) == 0, "Autres cas."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-1-3" label="1.3 [Introduction] - Vote majoritaire" type="python">
<Enonce>
### Vote majoritaire

Écrire une fonction `majoritaire(etiquettes)` qui renvoie l'étiquette la plus fréquente d'une liste non vide. En cas d'égalité, renvoyer la première dans l'ordre alphabétique.

<Indices>
<Indice>

Compter les étiquettes dans un dictionnaire.

</Indice>
<Indice>

Parcourir ensuite le dictionnaire : une étiquette remplace la meilleure si elle a plus de voix, ou autant et vient avant dans l'alphabet.

</Indice>
<Indice>

```text
FONCTION majoritaire(etiquettes)
    compte ← nombre d'apparitions de chaque étiquette
    meilleure ← None
    POUR CHAQUE (e, n) DE compte
        SI meilleure = None OU n > compte[meilleure] OU (n = compte[meilleure] ET e < meilleure) ALORS meilleure ← e
    RENVOYER meilleure
```

</Indice>
</Indices>

<Correction>

```python
def majoritaire(etiquettes: list) -> str:
    compte = {}
    for e in etiquettes:
        compte[e] = compte.get(e, 0) + 1
    return sorted(compte, key=lambda e: (-compte[e], e))[0]
```

</Correction>
</Enonce>
<Verification>

```python
assert majoritaire(["A", "B", "A"]) == "A", "A a deux voix."
assert majoritaire(["chat", "chien", "chien", "chat"]) == "chat", "Égalité : ordre alphabétique."
assert majoritaire(["Z"]) == "Z", "Une seule étiquette."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-1-4" label="1.4 [Introduction] - Le plus proche voisin" type="python">
<Enonce>
### Le plus proche voisin

Écrire une fonction `plus_proche(donnees, cible)` qui renvoie la **classe** de l'élément de `donnees` le plus proche du point `cible` (le premier en cas d'égalité). C'est l'algorithme avec `k = 1`.

<Indices>
<Indice>

Une recherche de minimum, où l'on compare des distances mais où l'on garde l'élément entier.

</Indice>
<Indice>

Réutiliser la fonction `distance`.

</Indice>
<Indice>

```text
FONCTION plus_proche(donnees, cible)
    meilleur ← donnees[0]
    POUR CHAQUE p DE donnees
        SI distance(p, cible) < distance(meilleur, cible) ALORS meilleur ← p
    RENVOYER meilleur[2]
```

</Indice>
</Indices>

<Correction>

```python
def distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5


def plus_proche(donnees: list, cible: tuple) -> str:
    meilleur = donnees[0]
    for p in donnees:
        if distance(p, cible) < distance(meilleur, cible):
            meilleur = p
    return meilleur[2]
```

</Correction>
</Enonce>
<Verification>

```python
D = [(1, 1, "A"), (2, 1, "A"), (1, 2, "A"), (3, 3, "A"), (5, 5, "B"), (6, 5, "B"), (6, 6, "B"), (7, 7, "B")]
assert plus_proche(D, (0, 0)) == "A" and plus_proche(D, (8, 8)) == "B", "Près des A, puis près des B."
assert plus_proche(D, (4.6, 4.6)) == "B", "(4.6, 4.6) est plus près de (5, 5)."
assert plus_proche([(0, 0, "X"), (2, 0, "Y")], (1, 0)) == "X", "Égalité : le premier."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-2-1" label="2.1 [Facile] - Toutes les distances" type="python">
<Enonce>
### Toutes les distances

Écrire une fonction `distances(donnees, cible)` qui renvoie la liste des tuples `(distance, classe)` de chaque élément de `donnees` par rapport à `cible`, dans l'ordre des données.

<Indices>
<Indice>

Une boucle sur les données, un `append` par élément.

</Indice>
<Indice>

Le tuple ajouté est `(distance(p, cible), p[2])`.

</Indice>
<Indice>

```text
FONCTION distances(donnees, cible)
    resultat ← liste vide
    POUR CHAQUE p DE donnees : ajouter (distance(p, cible), p[2])
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5


def distances(donnees: list, cible: tuple) -> list:
    resultat = []
    for p in donnees:
        resultat.append((distance(p, cible), p[2]))
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
r = distances([(0, 0, "A"), (3, 4, "B")], (0, 0))
assert r == [(0, "A"), (5, "B")], "Deux distances."
assert distances([], (1, 1)) == [], "Aucune donnée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-2-2" label="2.2 [Facile] - Les k plus proches" type="python">
<Enonce>
### Les k plus proches

Écrire une fonction `k_voisins(donnees, cible, k)` qui renvoie la liste des **classes** des `k` éléments les plus proches de `cible`, du plus proche au plus éloigné.

<Indices>
<Indice>

`sorted(donnees, key=lambda p: distance(p, cible))` trie les éléments du plus proche au plus loin.

</Indice>
<Indice>

Une tranche `[:k]` garde les `k` premiers ; il reste à extraire leurs classes.

</Indice>
<Indice>

```text
FONCTION k_voisins(donnees, cible, k)
    tries ← donnees triées par distance à cible
    RENVOYER [p[2] pour p dans tries[0:k]]
```

</Indice>
</Indices>

<Correction>

```python
def distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5


def k_voisins(donnees: list, cible: tuple, k: int) -> list:
    tries = sorted(donnees, key=lambda p: distance(p, cible))
    return [p[2] for p in tries[:k]]
```

</Correction>
</Enonce>
<Verification>

```python
D = [(1, 1, "A"), (2, 1, "A"), (1, 2, "A"), (3, 3, "A"), (5, 5, "B"), (6, 5, "B"), (6, 6, "B"), (7, 7, "B")]
assert k_voisins(D, (5.2, 5.1), 3) == ["B", "B", "B"], "Trois B autour de (5.2, 5.1)."
assert k_voisins(D, (3.6, 3.6), 2) == ["A", "B"], "(3, 3) puis (5, 5)."
assert len(k_voisins(D, (0, 0), 100)) == 8, "k plus grand que les données : toutes."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-2-3" label="2.3 [Facile] - Normalisation" type="python">
<Enonce>
### Normalisation

Quand une coordonnée varie de 0 à 1 et une autre de 0 à 1000, la seconde écrase la première dans les distances. On **normalise** donc chaque coordonnée : `(v - min) / (max - min)` ramène toutes les valeurs entre 0 et 1.

Écrire une fonction `normaliser(valeurs)` qui renvoie la liste normalisée, chaque valeur arrondie au millième. Si toutes les valeurs sont égales, renvoyer une liste de 0.

<Indices>
<Indice>

Calculer une seule fois le minimum et le maximum.

</Indice>
<Indice>

Le cas `max == min` ferait diviser par zéro : le traiter à part.

</Indice>
<Indice>

```text
FONCTION normaliser(valeurs)
    mini ← min(valeurs) ; maxi ← max(valeurs)
    SI maxi = mini ALORS RENVOYER une liste de 0 de même longueur
    RENVOYER [arrondi((v - mini) / (maxi - mini), 3) pour v dans valeurs]
```

</Indice>
</Indices>

<Correction>

```python
def normaliser(valeurs: list) -> list:
    mini = min(valeurs)
    maxi = max(valeurs)
    if maxi == mini:
        return [0] * len(valeurs)
    return [round((v - mini) / (maxi - mini), 3) for v in valeurs]
```

</Correction>
</Enonce>
<Verification>

```python
assert normaliser([10, 20, 30]) == [0, 0.5, 1], "10, 20, 30 : 0, 0.5, 1."
assert normaliser([5, 0, 15]) == [0.333, 0, 1], "Arrondi au millième."
assert normaliser([7, 7]) == [0, 0], "Valeurs toutes égales."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-2-4" label="2.4 [Facile] - Distance en dimension n" type="python">
<Enonce>
### Distance en dimension n

Un élément peut avoir plus de deux caractéristiques (taille, poids, âge…). Écrire une fonction `distance_n(a, b)` qui renvoie la distance euclidienne entre deux tuples de **même longueur**, tous les éléments étant des nombres.

<Indices>
<Indice>

La formule se généralise : racine de la somme des `(a[i] - b[i])²` pour tous les `i`.

</Indice>
<Indice>

Une boucle sur `range(len(a))` accumule la somme des carrés.

</Indice>
<Indice>

```text
FONCTION distance_n(a, b)
    s ← 0
    POUR i ALLANT DE 0 À longueur(a) - 1 : s ← s + (a[i] - b[i])²
    RENVOYER racine(s)
```

</Indice>
</Indices>

<Correction>

```python
def distance_n(a: tuple, b: tuple) -> float:
    s = 0
    for i in range(len(a)):
        s = s + (a[i] - b[i]) ** 2
    return s ** 0.5
```

</Correction>
</Enonce>
<Verification>

```python
assert distance_n((0, 0), (3, 4)) == 5, "En dimension 2."
assert distance_n((1, 2, 3), (1, 2, 3)) == 0 and distance_n((0, 0, 0), (2, 3, 6)) == 7, "En dimension 3."
assert distance_n((1,), (4,)) == 3 and distance_n((), ()) == 0, "Dimensions 1 et 0."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-3-1" label="3.1 [Moyen] - L'algorithme complet" type="python">
<Enonce>
### L'algorithme complet

Écrire une fonction `knn(donnees, cible, k)` qui renvoie la classe attribuée à `cible` par l'algorithme des `k` plus proches voisins. En cas d'égalité des votes, la première classe dans l'ordre alphabétique l'emporte.

<Indices>
<Indice>

Assembler les briques : trier par distance, garder les `k` premiers, puis voter.

</Indice>
<Indice>

Les fonctions `distance` et `majoritaire` des exercices précédents peuvent être recopiées.

</Indice>
<Indice>

```text
FONCTION knn(donnees, cible, k)
    voisins ← les k éléments de donnees les plus proches de cible
    RENVOYER majoritaire(classes des voisins)
```

</Indice>
</Indices>

<Correction>

```python
def distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5

def majoritaire(etiquettes: list) -> str:
    compte = {}
    for e in etiquettes:
        compte[e] = compte.get(e, 0) + 1
    return sorted(compte, key=lambda e: (-compte[e], e))[0]


def knn(donnees: list, cible: tuple, k: int) -> str:
    voisins = sorted(donnees, key=lambda p: distance(p, cible))[:k]
    return majoritaire([p[2] for p in voisins])
```

</Correction>
</Enonce>
<Verification>

```python
D = [(1, 1, "A"), (2, 1, "A"), (1, 2, "A"), (3, 3, "A"), (5, 5, "B"), (6, 5, "B"), (6, 6, "B"), (7, 7, "B")]
assert knn(D, (2, 2), 3) == "A" and knn(D, (6, 6), 3) == "B", "Au milieu de chaque groupe."
assert knn(D, (4.2, 4.2), 1) == "B" and knn(D, (3.9, 3.9), 1) == "A", "k = 1 : le plus proche décide."
assert knn(D, (4, 4), 8) == "A", "k = 8 : 4 voix chacun, égalité tranchée par l'alphabet."
assert knn(D, (4.4, 4.4), 3) == "B", "(5, 5), (3, 3) puis (6, 5) : B gagne 2 contre 1."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-3-2" label="3.2 [Moyen] - Prédire une valeur" type="python">
<Enonce>
### Prédire une valeur

L'algorithme sert aussi à prédire un **nombre** (on parle de régression) : la valeur prédite est la moyenne des valeurs des `k` voisins.

Ici, les éléments connus sont des tuples `(x, y, valeur)`. Écrire une fonction `knn_valeur(donnees, cible, k)` qui renvoie la moyenne des valeurs des `k` plus proches voisins, arrondie au centième.

Exemple d'usage : estimer le prix d'un appartement d'après ceux qui lui ressemblent.

<Indices>
<Indice>

Même tri par distance, mais la classe est remplacée par une valeur numérique : `p[2]`.

</Indice>
<Indice>

La moyenne se fait sur le nombre de voisins réellement gardés (au plus `k`).

</Indice>
<Indice>

```text
FONCTION knn_valeur(donnees, cible, k)
    voisins ← les k éléments les plus proches de cible
    RENVOYER arrondi(somme des p[2] des voisins / nombre de voisins, 2)
```

</Indice>
</Indices>

<Correction>

```python
def distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5


def knn_valeur(donnees: list, cible: tuple, k: int) -> float:
    voisins = sorted(donnees, key=lambda p: distance(p, cible))[:k]
    return round(sum(p[2] for p in voisins) / len(voisins), 2)
```

</Correction>
</Enonce>
<Verification>

```python
appart = [(30, 1, 150000), (45, 2, 210000), (50, 2, 230000), (80, 3, 320000), (100, 4, 400000)]
assert knn_valeur(appart, (48, 2), 2) == 220000, "Un 48 m² à 2 pièces : moyenne des deux plus proches."
assert knn_valeur(appart, (90, 3), 3) == 316666.67, "Trois voisins, arrondi au centième."
assert knn_valeur(appart, (0, 0), 10) == 262000, "k trop grand : moyenne de tous."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-3-3" label="3.3 [Moyen] - Taux de réussite" type="python">
<Enonce>
### Taux de réussite

Pour évaluer un classifieur, on compare ses prédictions aux vraies classes.

Écrire une fonction `taux_reussite(predictions, verites)` qui renvoie la proportion de prédictions justes (entre 0 et 1), arrondie au centième. Les deux listes ont la même longueur, non nulle.

<Indices>
<Indice>

Parcourir les deux listes en parallèle avec les indices.

</Indice>
<Indice>

Compter les égalités, puis diviser par la longueur.

</Indice>
<Indice>

```text
FONCTION taux_reussite(predictions, verites)
    justes ← nombre d'indices i tels que predictions[i] = verites[i]
    RENVOYER arrondi(justes / longueur(verites), 2)
```

</Indice>
</Indices>

<Correction>

```python
def taux_reussite(predictions: list, verites: list) -> float:
    justes = 0
    for i in range(len(verites)):
        if predictions[i] == verites[i]:
            justes = justes + 1
    return round(justes / len(verites), 2)
```

</Correction>
</Enonce>
<Verification>

```python
assert taux_reussite(["A", "B", "A"], ["A", "B", "B"]) == 0.67, "2 sur 3."
assert taux_reussite(["A"], ["A"]) == 1 and taux_reussite(["A", "A"], ["B", "B"]) == 0, "Tout juste, tout faux."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-3-4" label="3.4 [Moyen] - Vote pondéré" type="python">
<Enonce>
### Vote pondéré

Dans un vote **pondéré**, un voisin proche pèse plus lourd qu'un voisin éloigné : chaque voisin vote avec un poids `1 / distance`.

Écrire une fonction `vote_pondere(voisins)` qui reçoit une liste de tuples `(distance, classe)` et renvoie la classe de plus grand poids total. Si un voisin est à distance 0, sa classe l'emporte directement.

<Indices>
<Indice>

Un dictionnaire classe → somme des poids.

</Indice>
<Indice>

Traiter le cas `distance == 0` au début de la boucle, avec un `return` immédiat.

</Indice>
<Indice>

```text
FONCTION vote_pondere(voisins)
    poids ← dictionnaire vide
    POUR CHAQUE (d, c) DE voisins
        SI d = 0 ALORS RENVOYER c
        poids[c] ← poids[c] (ou 0) + 1 / d
    RENVOYER la classe de plus grand poids
```

</Indice>
</Indices>

<Correction>

```python
def vote_pondere(voisins: list) -> str:
    poids = {}
    for d, c in voisins:
        if d == 0:
            return c
        poids[c] = poids.get(c, 0) + 1 / d
    meilleure = None
    for c in poids:
        if meilleure is None or poids[c] > poids[meilleure]:
            meilleure = c
    return meilleure
```

</Correction>
</Enonce>
<Verification>

```python
assert vote_pondere([(1, "A"), (4, "B"), (4, "B")]) == "A", "A pèse 1, B pèse 0,5 : A gagne malgré la minorité."
assert vote_pondere([(2, "A"), (1, "B"), (3, "A")]) == "B", "B pèse 1, A pèse 0,83."
assert vote_pondere([(5, "A"), (0, "B")]) == "B", "Distance nulle : B directement."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-4-1" label="4.1 [Difficile] - Classifieur pondéré" type="python">
<Enonce>
### Classifieur pondéré

Écrire une fonction `knn_pondere(donnees, cible, k)` qui classe `cible` avec les `k` plus proches voisins et un vote pondéré par `1 / distance` (un voisin à distance 0 impose sa classe).

<Indices>
<Indice>

Construire la liste des `(distance, classe)` des `k` plus proches, puis appeler le vote pondéré.

</Indice>
<Indice>

Réutiliser `distance` et `vote_pondere`.

</Indice>
<Indice>

```text
FONCTION knn_pondere(donnees, cible, k)
    voisins ← les k plus proches, sous forme (distance, classe)
    RENVOYER vote_pondere(voisins)
```

</Indice>
</Indices>

<Correction>

```python
def distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5


def vote_pondere(voisins: list) -> str:
    poids = {}
    for d, c in voisins:
        if d == 0:
            return c
        poids[c] = poids.get(c, 0) + 1 / d
    return max(poids, key=lambda c: poids[c])


def knn_pondere(donnees: list, cible: tuple, k: int) -> str:
    tries = sorted(donnees, key=lambda p: distance(p, cible))[:k]
    return vote_pondere([(distance(p, cible), p[2]) for p in tries])
```

</Correction>
</Enonce>
<Verification>

```python
donnees = [(0, 0, "A"), (10, 0, "B"), (11, 0, "B")]
assert knn_pondere(donnees, (3, 0), 3) == "A", "A est proche (poids 1/3), les deux B loin (1/7 + 1/8)."
assert knn_pondere(donnees, (8, 0), 3) == "B", "Près des B."
assert knn_pondere(donnees, (10, 0), 3) == "B", "Sur un point connu : sa classe."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-4-2" label="4.2 [Difficile] - Évaluer sur un jeu de test" type="python">
<Enonce>
### Évaluer sur un jeu de test

On évalue un classifieur sur des données qu'il n'a pas vues : un jeu d'**apprentissage** sert aux voisins, un jeu de **test** sert à mesurer.

Écrire une fonction `evaluer(apprentissage, test, k)` qui classe chaque élément de `test` (ses coordonnées) à l'aide de `apprentissage`, et renvoie le taux de réussite (proportion de classes justes, arrondie au centième).

<Indices>
<Indice>

Pour chaque élément `(x, y, vraie_classe)` du test, prédire avec `knn(apprentissage, (x, y), k)` et comparer à `vraie_classe`.

</Indice>
<Indice>

Réutiliser `knn` et ses briques.

</Indice>
<Indice>

```text
FONCTION evaluer(apprentissage, test, k)
    justes ← 0
    POUR CHAQUE (x, y, c) DE test
        SI knn(apprentissage, (x, y), k) = c ALORS justes ← justes + 1
    RENVOYER arrondi(justes / longueur(test), 2)
```

</Indice>
</Indices>

<Correction>

```python
def distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5

def majoritaire(etiquettes: list) -> str:
    compte = {}
    for e in etiquettes:
        compte[e] = compte.get(e, 0) + 1
    return sorted(compte, key=lambda e: (-compte[e], e))[0]


def knn(donnees: list, cible: tuple, k: int) -> str:
    voisins = sorted(donnees, key=lambda p: distance(p, cible))[:k]
    return majoritaire([p[2] for p in voisins])


def evaluer(apprentissage: list, test: list, k: int) -> float:
    justes = 0
    for x, y, c in test:
        if knn(apprentissage, (x, y), k) == c:
            justes = justes + 1
    return round(justes / len(test), 2)
```

</Correction>
</Enonce>
<Verification>

```python
D = [(1, 1, "A"), (2, 1, "A"), (1, 2, "A"), (3, 3, "A"), (5, 5, "B"), (6, 5, "B"), (6, 6, "B"), (7, 7, "B")]
test = [(2, 2, "A"), (6, 7, "B"), (4, 4, "B"), (0, 1, "A")]
assert evaluer(D, test, 1) == 0.75, "k = 1 : 3 sur 4 ((4, 4) est classé A)."
assert evaluer(D, [(6, 6, "A")], 3) == 0, "Une seule prédiction, fausse."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-4-3" label="4.3 [Difficile] - Choisir k" type="python">
<Enonce>
### Choisir k

Écrire une fonction `meilleur_k(apprentissage, test, candidats)` qui renvoie la valeur de `k`, parmi la liste `candidats`, qui donne le meilleur taux de réussite sur `test`. En cas d'égalité, renvoyer la plus petite.

<Indices>
<Indice>

Évaluer chaque candidat et garder le meilleur, comme une recherche de maximum.

</Indice>
<Indice>

Pour l'égalité, parcourir les candidats triés et ne remplacer le meilleur que si le taux est **strictement** supérieur.

</Indice>
<Indice>

```text
FONCTION meilleur_k(apprentissage, test, candidats)
    meilleur ← None ; record ← -1
    POUR CHAQUE k DE candidats triés
        t ← evaluer(apprentissage, test, k)
        SI t > record ALORS meilleur ← k ; record ← t
    RENVOYER meilleur
```

</Indice>
</Indices>

<Correction>

```python
def distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5

def majoritaire(etiquettes: list) -> str:
    compte = {}
    for e in etiquettes:
        compte[e] = compte.get(e, 0) + 1
    return sorted(compte, key=lambda e: (-compte[e], e))[0]


def knn(donnees: list, cible: tuple, k: int) -> str:
    voisins = sorted(donnees, key=lambda p: distance(p, cible))[:k]
    return majoritaire([p[2] for p in voisins])


def evaluer(apprentissage: list, test: list, k: int) -> float:
    justes = sum(1 for x, y, c in test if knn(apprentissage, (x, y), k) == c)
    return round(justes / len(test), 2)


def meilleur_k(apprentissage: list, test: list, candidats: list) -> int:
    meilleur = None
    record = -1
    for k in sorted(candidats):
        t = evaluer(apprentissage, test, k)
        if t > record:
            meilleur = k
            record = t
    return meilleur
```

</Correction>
</Enonce>
<Verification>

```python
app = [(0, 0, "A"), (1, 0, "A"), (0, 1, "A"), (5, 5, "B"), (6, 5, "B"), (5, 6, "B"), (2, 2, "B")]
test = [(1, 1, "A"), (2, 1, "A"), (5, 4, "B")]
assert meilleur_k(app, test, [1, 3]) == 3, "Le B isolé en (2, 2) trompe k = 1 ; k = 3 fait mieux."
assert meilleur_k(app, test, [5, 3, 7]) == 3, "Égalité éventuelle : le plus petit k."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-4-4" label="4.4 [Difficile] - Normaliser un jeu de données" type="python">
<Enonce>
### Normaliser un jeu de données

Écrire une fonction `normaliser_donnees(donnees)` qui reçoit une liste de tuples `(x, y, classe)` et renvoie une nouvelle liste où `x` et `y` sont chacun ramenés entre 0 et 1 (normalisation min-max colonne par colonne, arrondie au millième). Une colonne constante devient une colonne de 0.

<Indices>
<Indice>

Extraire la colonne des `x` et celle des `y`, les normaliser séparément.

</Indice>
<Indice>

Recomposer ensuite les tuples avec `zip` ou avec les indices.

</Indice>
<Indice>

```text
FONCTION normaliser(valeurs) : (v - min) / (max - min), arrondi, ou 0 si colonne constante
FONCTION normaliser_donnees(donnees)
    xs ← normaliser(colonne des x) ; ys ← normaliser(colonne des y)
    RENVOYER [(xs[i], ys[i], classe de donnees[i]) pour chaque i]
```

</Indice>
</Indices>

<Correction>

```python
def normaliser(valeurs: list) -> list:
    mini, maxi = min(valeurs), max(valeurs)
    if maxi == mini:
        return [0] * len(valeurs)
    return [round((v - mini) / (maxi - mini), 3) for v in valeurs]


def normaliser_donnees(donnees: list) -> list:
    xs = normaliser([p[0] for p in donnees])
    ys = normaliser([p[1] for p in donnees])
    return [(xs[i], ys[i], donnees[i][2]) for i in range(len(donnees))]
```

</Correction>
</Enonce>
<Verification>

```python
d = [(150, 40, "A"), (180, 90, "B"), (165, 65, "A")]
assert normaliser_donnees(d) == [(0, 0, "A"), (1, 1, "B"), (0.5, 0.5, "A")], "Taille et poids ramenés entre 0 et 1."
assert normaliser_donnees([(1, 5, "X"), (3, 5, "Y")]) == [(0, 0, "X"), (1, 0, "Y")], "Colonne constante : des 0."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-5-1" label="5.1 [Expert] - Validation croisée" type="python">
<Enonce>
### Validation croisée

Avec peu de données, on évalue un classifieur par **validation croisée « un contre tous »** : chaque élément est classé à l'aide de **tous les autres**, puis on calcule le taux de réussite.

Écrire une fonction `validation_croisee(donnees, k)` qui renvoie ce taux, arrondi au centième.

<Indices>
<Indice>

Pour l'élément d'indice `i`, le jeu d'apprentissage est `donnees[:i] + donnees[i + 1:]`.

</Indice>
<Indice>

Classer `(x, y)` de l'élément `i` avec ce jeu, et comparer à sa vraie classe.

</Indice>
<Indice>

```text
FONCTION validation_croisee(donnees, k)
    justes ← 0
    POUR i ALLANT DE 0 À longueur(donnees) - 1
        autres ← donnees sans l'élément i
        SI knn(autres, coordonnées de donnees[i], k) = classe de donnees[i] ALORS justes ← justes + 1
    RENVOYER arrondi(justes / longueur(donnees), 2)
```

</Indice>
</Indices>

<Correction>

```python
def distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5

def majoritaire(etiquettes: list) -> str:
    compte = {}
    for e in etiquettes:
        compte[e] = compte.get(e, 0) + 1
    return sorted(compte, key=lambda e: (-compte[e], e))[0]


def knn(donnees: list, cible: tuple, k: int) -> str:
    voisins = sorted(donnees, key=lambda p: distance(p, cible))[:k]
    return majoritaire([p[2] for p in voisins])


def validation_croisee(donnees: list, k: int) -> float:
    justes = 0
    for i in range(len(donnees)):
        autres = donnees[:i] + donnees[i + 1:]
        x, y, c = donnees[i]
        if knn(autres, (x, y), k) == c:
            justes = justes + 1
    return round(justes / len(donnees), 2)
```

</Correction>
</Enonce>
<Verification>

```python
D = [(1, 1, "A"), (2, 1, "A"), (1, 2, "A"), (3, 3, "A"), (5, 5, "B"), (6, 5, "B"), (6, 6, "B"), (7, 7, "B")]
assert validation_croisee(D, 1) == 1, "Deux groupes bien séparés : tout est juste avec k = 1."
assert validation_croisee(D + [(2, 2, "B")], 1) == 0.78, "Un B perdu chez les A crée deux erreurs : 7 sur 9."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-5-2" label="5.2 [Expert] - Matrice de confusion" type="python">
<Enonce>
### Matrice de confusion

La **matrice de confusion** détaille les erreurs : `m[vraie][predite]` compte les éléments de classe `vraie` classés `predite`.

Écrire une fonction `confusion(predictions, verites, classes)` qui renvoie cette matrice sous forme de dictionnaire de dictionnaires, avec une entrée (éventuellement 0) pour **chaque** couple de classes de la liste `classes`.

<Indices>
<Indice>

Créer d'abord toutes les entrées à 0 avec deux boucles sur `classes`.

</Indice>
<Indice>

Puis, pour chaque indice `i`, ajouter 1 à `m[verites[i]][predictions[i]]`.

</Indice>
<Indice>

```text
FONCTION confusion(predictions, verites, classes)
    m ← pour chaque a de classes : pour chaque b de classes : m[a][b] ← 0
    POUR i ALLANT DE 0 À longueur(verites) - 1
        m[verites[i]][predictions[i]] ← m[verites[i]][predictions[i]] + 1
    RENVOYER m
```

</Indice>
</Indices>

<Correction>

```python
def confusion(predictions: list, verites: list, classes: list) -> dict:
    m = {a: {b: 0 for b in classes} for a in classes}
    for i in range(len(verites)):
        m[verites[i]][predictions[i]] = m[verites[i]][predictions[i]] + 1
    return m
```

</Correction>
</Enonce>
<Verification>

```python
m = confusion(["A", "B", "B", "A", "B"], ["A", "B", "A", "A", "B"], ["A", "B"])
assert m == {"A": {"A": 2, "B": 1}, "B": {"A": 0, "B": 2}}, "Un A a été pris pour un B."
m = confusion([], [], ["x", "y", "z"])
assert m["z"] == {"x": 0, "y": 0, "z": 0} and len(m) == 3, "Toutes les cases existent, à 0."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-5-3" label="5.3 [Expert] - Voisins sans tout trier" type="python">
<Enonce>
### Voisins sans tout trier

Trier toutes les données pour garder `k` voisins est coûteux quand il y en a beaucoup.

Écrire une fonction `k_plus_proches(donnees, cible, k)` qui renvoie la liste des `k` éléments les plus proches (du plus proche au plus loin) en **un seul parcours**, en tenant à jour une petite liste triée des `k` meilleurs trouvés.

Contrainte : sans `sort` ni `sorted`.

<Indices>
<Indice>

La liste des meilleurs contient des couples `(distance, element)`, triée par distance, de longueur au plus `k`.

</Indice>
<Indice>

Pour chaque nouvel élément, l'insérer à sa place (comme dans le tri par insertion) puis, si la liste dépasse `k`, retirer le dernier.

</Indice>
<Indice>

```text
FONCTION k_plus_proches(donnees, cible, k)
    meilleurs ← liste vide
    POUR CHAQUE p DE donnees
        d ← distance(p, cible)
        insérer (d, p) dans meilleurs à sa place (par distance croissante, après les égaux)
        SI longueur(meilleurs) > k ALORS retirer le dernier
    RENVOYER [p pour (d, p) dans meilleurs]
```

</Indice>
</Indices>

<Correction>

```python
def distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5


def k_plus_proches(donnees: list, cible: tuple, k: int) -> list:
    meilleurs = []
    for p in donnees:
        d = distance(p, cible)
        i = len(meilleurs)
        while i > 0 and meilleurs[i - 1][0] > d:
            i = i - 1
        meilleurs.insert(i, (d, p))
        if len(meilleurs) > k:
            meilleurs.pop()
    return [p for d, p in meilleurs]
```

</Correction>
</Enonce>
<Verification>

```python
import random
D = [(1, 1, "A"), (2, 1, "A"), (1, 2, "A"), (3, 3, "A"), (5, 5, "B"), (6, 5, "B"), (6, 6, "B"), (7, 7, "B")]
assert k_plus_proches(D, (5.2, 5.1), 2) == [(5, 5, "B"), (6, 5, "B")], "Les deux plus proches."
assert k_plus_proches(D, (0, 0), 0) == [], "k = 0."
grand = [(random.random() * 100, random.random() * 100, "A") for _ in range(20000)]
r = k_plus_proches(grand, (50, 50), 5)
attendu = sorted(grand, key=lambda p: (p[0] - 50) ** 2 + (p[1] - 50) ** 2)[:5]
assert r == attendu, "Sur 20 000 points, les 5 plus proches, dans l'ordre."
import re
assert not re.search(r"\bsorted\s*\(|\.sort\s*\(", PROGRAMME), "Sans sort ni sorted."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-5-4" label="5.4 [Expert] - Carte des zones" type="python">
<Enonce>
### Carte des zones

Pour visualiser les zones de décision, on classe chaque point d'une grille.

Écrire une fonction `carte(donnees, k, largeur, hauteur)` qui renvoie une liste de `hauteur` textes de `largeur` caractères : le caractère en colonne `x` de la ligne `y` est la classe (une lettre) attribuée au point `(x, hauteur - 1 - y)` par l'algorithme des `k` plus proches voisins. Ainsi, la première ligne du résultat correspond au haut de la grille.

<Indices>
<Indice>

Deux boucles : sur les lignes `y` de 0 à `hauteur - 1`, et sur les colonnes `x`.

</Indice>
<Indice>

Le point à classer est `(x, hauteur - 1 - y)` : l'axe vertical est retourné pour que le haut de la carte soit en premier.

</Indice>
<Indice>

```text
FONCTION carte(donnees, k, largeur, hauteur)
    lignes ← liste vide
    POUR y ALLANT DE 0 À hauteur - 1
        ligne ← ""
        POUR x ALLANT DE 0 À largeur - 1
            ligne ← ligne + knn(donnees, (x, hauteur - 1 - y), k)
        ajouter ligne à lignes
    RENVOYER lignes
```

</Indice>
</Indices>

<Correction>

```python
def distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5

def majoritaire(etiquettes: list) -> str:
    compte = {}
    for e in etiquettes:
        compte[e] = compte.get(e, 0) + 1
    return sorted(compte, key=lambda e: (-compte[e], e))[0]


def knn(donnees: list, cible: tuple, k: int) -> str:
    voisins = sorted(donnees, key=lambda p: distance(p, cible))[:k]
    return majoritaire([p[2] for p in voisins])


def carte(donnees: list, k: int, largeur: int, hauteur: int) -> list:
    lignes = []
    for y in range(hauteur):
        ligne = ""
        for x in range(largeur):
            ligne = ligne + knn(donnees, (x, hauteur - 1 - y), k)
        lignes.append(ligne)
    return lignes
```

</Correction>
</Enonce>
<Verification>

```python
d = [(0, 0, "A"), (4, 0, "B"), (0, 4, "C")]
c = carte(d, 1, 5, 5)
assert len(c) == 5 and all(len(l) == 5 for l in c), "5 lignes de 5 caractères."
assert c[0][0] == "C" and c[4][0] == "A" and c[4][4] == "B", "Coins : C en haut à gauche, A en bas à gauche, B en bas à droite."
assert c == ["CCCCB", "CCCBB", "AAABB", "AAABB", "AAABB"], "La carte complète."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-6-1" label="6.1 [Mini-projet] - Reconnaissance des iris" type="python">
<Enonce>
### Reconnaissance des iris

**Contexte.** Un club de botanique veut une application qui reconnaît l'espèce d'un iris d'après la longueur et la largeur de ses pétales, mesurées sur le terrain. Le projet construit le classifieur des k plus proches voisins, l'évalue honnêtement sur les fleurs déjà connues, puis choisit automatiquement le meilleur réglage avant de faire des prédictions.

**Les données** : le code de départ contient un extrait du jeu de données des iris, `IRIS` : 15 fleurs sous forme de tuples `(longueur, largeur, espece)`, en cm, par exemple `(1.4, 0.2, "setosa")`. Les espèces sont `setosa`, `versicolor` et `virginica`.

**Les fonctions du classifieur**
- `bornes(donnees)` : nécessaire pour normaliser. Renvoie le tuple `((min_x, max_x), (min_y, max_y))` des deux caractéristiques.
- `normaliser(point, b)` et `normaliser_tout(donnees)` : ramènent les mesures entre 0 et 1, pour que longueur et largeur pèsent autant dans les distances. La première reçoit un point `(x, y)` (une classe éventuelle en troisième position est conservée) et des bornes ; la seconde normalise toutes les données avec leurs propres bornes.
- `knn(donnees, cible, k, pondere)` : la prédiction. Renvoie la classe la plus représentée parmi les `k` plus proches voisins de `cible` ; avec `pondere` à `True`, chaque voisin vote avec le poids `1 / distance` (un voisin à distance nulle impose sa classe). En cas d'égalité des votes, l'ordre alphabétique départage.
- `fiabilite(donnees, k, pondere)` : mesure la qualité d'un réglage. Classe chaque fleur à l'aide de toutes les **autres** (validation croisée « un contre tous ») et renvoie le taux de réussite, arrondi au centième.
- `meilleur_reglage(donnees, ks)` : choisit le réglage. Renvoie le couple `(k, pondere)` le plus fiable parmi les `k` de la liste `ks` et les deux valeurs de `pondere` ; en cas d'égalité, le plus petit `k`, puis le vote non pondéré.
- `confusion(donnees, k, pondere)` : montre quelles espèces sont confondues. Renvoie la matrice de confusion de la validation croisée, sous forme de dictionnaire `m[vraie][predite]` avec toutes les classes.
- `predire(longueur, largeur)` : la fonction appelée par l'application. Renvoie l'espèce d'une nouvelle fleur, avec les données **normalisées** et le meilleur réglage parmi `k` = 1, 3, 5, 7 ; la fleur est normalisée avec les mêmes bornes que les données.

<Indices>
<Indice>

Réutiliser les briques des exercices : distance, vote, tri des voisins. Le vote pondéré et le vote simple ne diffèrent que par le poids ajouté à chaque classe (1 ou `1 / d`).

</Indice>
<Indice>

La validation croisée et la matrice de confusion font le même parcours : classer chaque fleur avec toutes les autres. Une fonction auxiliaire qui renvoie la liste des couples `(vraie, predite)` sert aux deux.

</Indice>
<Indice>

Attention à `predire` : les bornes viennent des données d'origine, et la fleur à classer doit être normalisée avec elles, pas avec ses propres valeurs.

</Indice>
<Indice>

```text
(cœur du programme : le vote, pondéré ou non)
FONCTION knn(donnees, cible, k, pondere)
    voisins ← les k éléments les plus proches de cible
    poids ← dictionnaire vide
    POUR CHAQUE v DE voisins
        d ← distance(v, cible)
        SI pondere ET d = 0 ALORS RENVOYER classe de v
        poids[classe de v] ← poids[classe de v] (ou 0) + (1 / d si pondere sinon 1)
    RENVOYER la classe de plus grand poids (ordre alphabétique en cas d'égalité)
```

</Indice>
</Indices>

<Correction>

```python
IRIS = [
    (1.4, 0.2, "setosa"), (1.3, 0.2, "setosa"), (1.5, 0.2, "setosa"), (1.7, 0.4, "setosa"), (1.6, 0.6, "setosa"),
    (4.7, 1.4, "versicolor"), (4.5, 1.5, "versicolor"), (4.9, 1.5, "versicolor"), (4.0, 1.3, "versicolor"), (5.0, 1.7, "versicolor"),
    (6.0, 2.5, "virginica"), (5.1, 1.9, "virginica"), (5.9, 2.1, "virginica"), (5.6, 1.8, "virginica"), (4.8, 1.8, "virginica"),
]


def distance(a: tuple, b: tuple) -> float:
    return ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2) ** 0.5


def bornes(donnees: list) -> tuple:
    xs = [p[0] for p in donnees]
    ys = [p[1] for p in donnees]
    return ((min(xs), max(xs)), (min(ys), max(ys)))


def normaliser(point: tuple, b: tuple) -> tuple:
    (x0, x1), (y0, y1) = b
    return ((point[0] - x0) / (x1 - x0), (point[1] - y0) / (y1 - y0)) + tuple(point[2:])


def normaliser_tout(donnees: list) -> list:
    b = bornes(donnees)
    return [normaliser(p, b) for p in donnees]


def knn(donnees: list, cible: tuple, k: int, pondere: bool) -> str:
    voisins = sorted(donnees, key=lambda p: distance(p, cible))[:k]
    poids = {}
    for v in voisins:
        d = distance(v, cible)
        if pondere and d == 0:
            return v[2]
        poids[v[2]] = poids.get(v[2], 0) + (1 / d if pondere else 1)
    return sorted(poids, key=lambda c: (-poids[c], c))[0]


def couples(donnees: list, k: int, pondere: bool) -> list:
    resultat = []
    for i in range(len(donnees)):
        autres = donnees[:i] + donnees[i + 1:]
        resultat.append((donnees[i][2], knn(autres, donnees[i], k, pondere)))
    return resultat


def fiabilite(donnees: list, k: int, pondere: bool) -> float:
    c = couples(donnees, k, pondere)
    return round(sum(1 for vraie, predite in c if vraie == predite) / len(c), 2)


def meilleur_reglage(donnees: list, ks: list) -> tuple:
    meilleur = None
    for k in sorted(ks):
        for pondere in (False, True):
            f = fiabilite(donnees, k, pondere)
            if meilleur is None or f > meilleur[0]:
                meilleur = (f, k, pondere)
    return (meilleur[1], meilleur[2])


def confusion(donnees: list, k: int, pondere: bool) -> dict:
    classes = sorted({p[2] for p in donnees})
    m = {a: {b: 0 for b in classes} for a in classes}
    for vraie, predite in couples(donnees, k, pondere):
        m[vraie][predite] += 1
    return m


def predire(longueur: float, largeur: float) -> str:
    b = bornes(IRIS)
    donnees = normaliser_tout(IRIS)
    k, pondere = meilleur_reglage(donnees, [1, 3, 5, 7])
    return knn(donnees, normaliser((longueur, largeur), b), k, pondere)
```

</Correction>
</Enonce>
<CodeDepart>

```python
IRIS = [
    (1.4, 0.2, "setosa"), (1.3, 0.2, "setosa"), (1.5, 0.2, "setosa"), (1.7, 0.4, "setosa"), (1.6, 0.6, "setosa"),
    (4.7, 1.4, "versicolor"), (4.5, 1.5, "versicolor"), (4.9, 1.5, "versicolor"), (4.0, 1.3, "versicolor"), (5.0, 1.7, "versicolor"),
    (6.0, 2.5, "virginica"), (5.1, 1.9, "virginica"), (5.9, 2.1, "virginica"), (5.6, 1.8, "virginica"), (4.8, 1.8, "virginica"),
]
```

</CodeDepart>
<Verification>

```python
assert bornes(IRIS) == ((1.3, 6.0), (0.2, 2.5)), "Bornes des deux caractéristiques."
n = normaliser((3.65, 1.35, "x"), bornes(IRIS))
assert abs(n[0] - 0.5) < 1e-9 and abs(n[1] - 0.5) < 1e-9 and n[2] == "x", "Normalisation d'un point."
N = normaliser_tout(IRIS)
assert len(N) == 15 and min(p[0] for p in N) == 0 and max(p[1] for p in N) == 1 and N[0][2] == "setosa", "Données normalisées."
D = [(0, 0, "A"), (3, 0, "B"), (4, 0, "B")]
assert knn(D, (1, 0), 3, False) == "B" and knn(D, (1, 0), 3, True) == "A", "Vote simple : B ; vote pondéré : A, tout proche."
assert knn(D, (3, 0), 3, True) == "B" and knn([(0, 0, "Z"), (2, 0, "A")], (1, 0), 2, False) == "A", "Distance nulle ; égalité alphabétique."
assert fiabilite(IRIS, 1, False) == 0.87 and fiabilite(IRIS, 3, False) == 0.8, "Fiabilité sur les données brutes."
r = meilleur_reglage(N, [1, 3, 5, 7])
assert r in [(k, p) for k in (1, 3, 5, 7) for p in (False, True)] and fiabilite(N, *r) == max(fiabilite(N, k, p) for k in (1, 3, 5, 7) for p in (False, True)), "Le réglage choisi est le plus fiable."
assert meilleur_reglage(IRIS, [1, 3]) == (1, False), "Égalité : le plus petit k, vote simple."
m = confusion(IRIS, 1, False)
assert sorted(m) == ["setosa", "versicolor", "virginica"] and m["setosa"] == {"setosa": 5, "versicolor": 0, "virginica": 0}, "Confusion : les setosa sont toujours reconnues."
assert sum(m[c][c] for c in m) == 13 and sum(sum(l.values()) for l in m.values()) == 15, "13 fleurs bien classées sur 15."
assert predire(1.5, 0.3) == "setosa" and predire(4.3, 1.3) == "versicolor" and predire(6.3, 2.3) == "virginica", "Prédictions."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-knn-6-2" label="6.2 [Mini-projet] - Prédire les notes de films" type="python">
<Enonce>
### Prédire les notes de films

**Contexte.** Le ciné-club du lycée tient un registre des films vus par ses membres, avec la note que chacun leur a donnée. Il veut proposer à chaque membre les films qu'il aimerait sans doute, en **prédisant la note** qu'il leur donnerait d'après les membres qui ont les mêmes goûts que lui. Avant de l'utiliser, le club veut aussi mesurer si ces prédictions sont fiables.

**Les données** : le code de départ contient les notes, `NOTES`, un dictionnaire de dictionnaires : `NOTES[membre][film]` est une note de 1 à 5, et un film non vu n'apparaît pas. Exemple : `NOTES["Léa"]` vaut `{"Alien": 5, "Up": 2, "Coco": 3, "Dune": 4}`.

**Les fonctions du moteur de recommandation**
- `ecart(notes, a, b)` : mesure à quel point deux membres ont des goûts différents. Renvoie la moyenne des écarts absolus de leurs notes sur les films vus par les deux, ou `None` s'ils n'ont aucun film en commun.
- `voisins(notes, a, film, k)` : les membres dont l'avis compte pour prédire la note de `a` sur `film`. Renvoie les `k` membres les plus proches de `a` (écart croissant, puis ordre alphabétique) **parmi ceux qui ont noté `film`**, en excluant `a` et ceux sans film commun avec lui.
- `predire(notes, a, film, k)` : la note probable. Renvoie la moyenne des notes données au film par ces voisins, pondérée par `1 / (1 + ecart)` (un voisin aux goûts proches compte plus), arrondie au dixième ; `None` sans voisin.
- `recommander(notes, a, n, k)` : la liste envoyée au membre. Renvoie les `n` films non vus par `a` dont la note prédite est la plus haute (puis ordre alphabétique), sous forme de liste de tuples `(film, note_predite)` ; les films sans prédiction sont ignorés.
- `erreur(notes, k)` : contrôle la qualité du système. Pour chaque note connue, la **cacher**, la prédire avec les autres notes et mesurer l'écart absolu ; renvoie la moyenne de ces écarts, arrondie au centième (les notes impossibles à prédire sont ignorées). Les données reçues ne doivent pas être modifiées.
- `meilleur_k(notes, ks)` : règle le système. Renvoie le `k` de la liste qui donne la plus petite erreur (le plus petit en cas d'égalité).

<Indices>
<Indice>

`predire` s'appuie sur `voisins`, qui s'appuie sur `ecart` : les écrire et les tester dans cet ordre.

</Indice>
<Indice>

Pour cacher une note sans abîmer les données, travailler sur une copie : `copie = {s: dict(f) for s, f in notes.items()}`, puis `del copie[a][film]`.

</Indice>
<Indice>

Une moyenne pondérée vaut `somme(poids × note) / somme(poids)`.

</Indice>
<Indice>

```text
(cœur du programme : mesurer l'erreur)
FONCTION erreur(notes, k)
    ecarts ← liste vide
    POUR CHAQUE spectateur a, POUR CHAQUE film f noté par a
        copie ← copie de notes, sans la note de a pour f
        p ← predire(copie, a, f, k)
        SI p ≠ None ALORS ajouter |p - notes[a][f]| à ecarts
    RENVOYER arrondi(moyenne de ecarts, 2)
```

</Indice>
</Indices>

<Correction>

```python
NOTES = {
    "Léa": {"Alien": 5, "Up": 2, "Coco": 3, "Dune": 4},
    "Tom": {"Alien": 4, "Up": 2, "Matrix": 5, "Dune": 5},
    "Inès": {"Alien": 1, "Up": 5, "Coco": 5, "Frozen": 5},
    "Noé": {"Up": 1, "Matrix": 4, "Dune": 5, "Alien": 5},
    "Zoé": {"Frozen": 4, "Coco": 4, "Up": 4},
    "Max": {"Tron": 3},
}


def ecart(notes: dict, a: str, b: str):
    communs = [f for f in notes[a] if f in notes[b]]
    if not communs:
        return None
    return sum(abs(notes[a][f] - notes[b][f]) for f in communs) / len(communs)


def voisins(notes: dict, a: str, film: str, k: int) -> list:
    candidats = []
    for b in notes:
        if b != a and film in notes[b]:
            e = ecart(notes, a, b)
            if e is not None:
                candidats.append((e, b))
    candidats.sort()
    return [b for e, b in candidats[:k]]


def predire(notes: dict, a: str, film: str, k: int):
    vs = voisins(notes, a, film, k)
    if not vs:
        return None
    poids = [1 / (1 + ecart(notes, a, b)) for b in vs]
    return round(sum(p * notes[b][film] for p, b in zip(poids, vs)) / sum(poids), 1)


def recommander(notes: dict, a: str, n: int, k: int) -> list:
    films = {f for s in notes.values() for f in s if f not in notes[a]}
    predits = [(f, predire(notes, a, f, k)) for f in films]
    predits = [(f, p) for f, p in predits if p is not None]
    predits.sort(key=lambda t: (-t[1], t[0]))
    return predits[:n]


def erreur(notes: dict, k: int) -> float:
    ecarts = []
    for a in notes:
        for film in notes[a]:
            copie = {s: dict(f) for s, f in notes.items()}
            del copie[a][film]
            p = predire(copie, a, film, k)
            if p is not None:
                ecarts.append(abs(p - notes[a][film]))
    return round(sum(ecarts) / len(ecarts), 2)


def meilleur_k(notes: dict, ks: list) -> int:
    meilleur = None
    for k in sorted(ks):
        e = erreur(notes, k)
        if meilleur is None or e < meilleur[0]:
            meilleur = (e, k)
    return meilleur[1]
```

</Correction>
</Enonce>
<CodeDepart>

```python
NOTES = {
    "Léa": {"Alien": 5, "Up": 2, "Coco": 3, "Dune": 4},
    "Tom": {"Alien": 4, "Up": 2, "Matrix": 5, "Dune": 5},
    "Inès": {"Alien": 1, "Up": 5, "Coco": 5, "Frozen": 5},
    "Noé": {"Up": 1, "Matrix": 4, "Dune": 5, "Alien": 5},
    "Zoé": {"Frozen": 4, "Coco": 4, "Up": 4},
    "Max": {"Tron": 3},
}
```

</CodeDepart>
<Verification>

```python
assert abs(ecart(NOTES, "Léa", "Tom") - 2 / 3) < 1e-9 and ecart(NOTES, "Léa", "Max") is None, "Écarts."
assert voisins(NOTES, "Léa", "Matrix", 5) == ["Noé", "Tom"] and voisins(NOTES, "Léa", "Frozen", 1) == ["Zoé"], "Voisins ayant vu le film (Noé et Tom à égalité : ordre alphabétique)."
assert predire(NOTES, "Léa", "Matrix", 2) == 4.5 and predire(NOTES, "Léa", "Frozen", 2) == 4.4, "Moyennes pondérées des voisins."
assert predire(NOTES, "Léa", "Tron", 3) is None and predire(NOTES, "Max", "Up", 3) is None, "Aucun voisin."
r = recommander(NOTES, "Léa", 5, 2)
assert [f for f, p in r] == ["Matrix", "Frozen"] and all(p is not None for f, p in r), "Recommandations de Léa (Tron est ignoré)."
copie = {s: dict(f) for s, f in NOTES.items()}
e1 = erreur(NOTES, 1)
assert NOTES == copie, "Les notes ne sont pas modifiées par le calcul de l'erreur."
assert 0 < e1 < 4 and isinstance(e1, float), "Erreur moyenne plausible."
assert meilleur_k(NOTES, [1, 2, 3]) in (1, 2, 3) and erreur(NOTES, meilleur_k(NOTES, [1, 2, 3])) == min(erreur(NOTES, k) for k in (1, 2, 3)), "Le meilleur k minimise l'erreur."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
