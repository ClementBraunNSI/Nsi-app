---
title: 'Exercices : POO en Python'
description: Classes, encapsulation, composition et héritage en Python.
level: TNSI
order: 146
chapter: Langages et Programmation
icon: "construction"
badgeId: terminale_exercices_poo
prerequisites:
  - poo_classes_objets
  - poo_heritage_polymorphisme
audience: public
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="terminale_exercices_poo" courseTitle="Exercices POO">

<ExerciseSection id="tnsi-poo-1-1" label="1.1 [Introduction] - Température protégée" type="python">
<Enonce>
### Température protégée

Écrire une classe `Temperature` construite avec une valeur en degrés Celsius, rangée dans un attribut **protégé** `_celsius` (par convention, le `_` signale qu'il ne faut pas y toucher de l'extérieur).
- `celsius()` renvoie la valeur ;
- `fahrenheit()` renvoie la valeur en degrés Fahrenheit (`c × 9 / 5 + 32`) ;
- `regler(c)` change la valeur, mais lève une `ValueError` si `c` est sous le zéro absolu (-273,15 °C). Le constructeur applique la même vérification.

<Indices>
<Indice>

`raise ValueError("message")` interrompt la méthode en signalant l'erreur.

</Indice>
<Indice>

Le constructeur peut appeler `self.regler(c)` : la vérification n'est écrite qu'une fois.

</Indice>
<Indice>

```text
CLASSE Temperature
    CONSTRUCTEUR(c) : self.regler(c)
    MÉTHODE regler(c)
        SI c < -273,15 ALORS LEVER ValueError
        self._celsius ← c
    MÉTHODE celsius() : RENVOYER self._celsius
    MÉTHODE fahrenheit() : RENVOYER self._celsius × 9 / 5 + 32
```

</Indice>
</Indices>

<Correction>

```python
class Temperature:
    def __init__(self, c: float):
        self.regler(c)

    def regler(self, c: float) -> None:
        if c < -273.15:
            raise ValueError("Température sous le zéro absolu")
        self._celsius = c

    def celsius(self) -> float:
        return self._celsius

    def fahrenheit(self) -> float:
        return self._celsius * 9 / 5 + 32
```

</Correction>
</Enonce>
<Verification>

```python
t = Temperature(100)
assert t.celsius() == 100 and t.fahrenheit() == 212, "100 °C = 212 °F."
t.regler(-40)
assert t._celsius == -40 and t.fahrenheit() == -40, "La valeur est rangée dans _celsius."
try:
    t.regler(-300)
    assert False, "regler(-300) lève une ValueError."
except ValueError:
    pass
assert t.celsius() == -40, "Après l'erreur, la valeur n'a pas changé."
try:
    Temperature(-500)
    assert False, "Le constructeur refuse aussi -500."
except ValueError:
    pass
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-1-2" label="1.2 [Introduction] - Égalité et affichage" type="python">
<Enonce>
### Égalité et affichage

Écrire une classe `Point` construite avec `x` et `y`, avec deux méthodes spéciales :
- `__eq__(self, autre)` : deux points sont égaux (`==`) si leurs coordonnées sont égales ;
- `__repr__(self)` : renvoie `"Point(1, 2)"`, le texte qu'affiche la console pour l'objet.

<Indices>
<Indice>

Sans `__eq__`, `Point(1, 2) == Point(1, 2)` vaut `False` : Python compare alors les objets, pas leur contenu.

</Indice>
<Indice>

`__eq__` renvoie `self.x == autre.x and self.y == autre.y`.

</Indice>
<Indice>

```text
CLASSE Point
    MÉTHODE __eq__(autre) : RENVOYER self.x = autre.x ET self.y = autre.y
    MÉTHODE __repr__() : RENVOYER "Point(" + x + ", " + y + ")"
```

</Indice>
</Indices>

<Correction>

```python
class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def __eq__(self, autre: object) -> bool:
        return isinstance(autre, Point) and self.x == autre.x and self.y == autre.y

    def __repr__(self) -> str:
        return f"Point({self.x}, {self.y})"
```

</Correction>
</Enonce>
<Verification>

```python
assert Point(1, 2) == Point(1, 2) and Point(1, 2) != Point(2, 1), "Égalité selon les coordonnées."
assert repr(Point(1, 2)) == "Point(1, 2)" and str([Point(0, 5)]) == "[Point(0, 5)]", "Affichage."
assert Point(3, 4) in [Point(0, 0), Point(3, 4)], "in utilise __eq__."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-1-3" label="1.3 [Introduction] - Attribut de classe" type="python">
<Enonce>
### Attribut de classe

Un **attribut de classe** est partagé par tous les objets de la classe.

Écrire une classe `Eleve` construite avec un `nom`, qui a un attribut de classe `effectif` (0 au départ) augmenté de 1 à chaque création d'élève, et un attribut d'instance `numero` qui vaut l'effectif au moment de la création (le premier élève a le numéro 1).

<Indices>
<Indice>

L'attribut de classe se déclare dans la classe, hors des méthodes : `effectif = 0`.

</Indice>
<Indice>

Dans le constructeur, il se modifie avec `Eleve.effectif` (et non `self.effectif`, qui créerait un attribut propre à l'objet).

</Indice>
<Indice>

```text
CLASSE Eleve
    effectif ← 0                 (attribut de classe)
    CONSTRUCTEUR(nom)
        Eleve.effectif ← Eleve.effectif + 1
        self.nom ← nom ; self.numero ← Eleve.effectif
```

</Indice>
</Indices>

<Correction>

```python
class Eleve:
    effectif = 0

    def __init__(self, nom: str):
        Eleve.effectif = Eleve.effectif + 1
        self.nom = nom
        self.numero = Eleve.effectif
```

</Correction>
</Enonce>
<Verification>

```python
depart = Eleve.effectif
a = Eleve("Léa")
b = Eleve("Tom")
assert Eleve.effectif == depart + 2, "Deux élèves créés."
assert b.numero == a.numero + 1 and a.numero == depart + 1, "Numéros successifs."
assert "effectif" not in a.__dict__, "effectif reste un attribut de la classe."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-1-4" label="1.4 [Introduction] - Additionner des durées" type="python">
<Enonce>
### Additionner des durées

Écrire une classe `Duree` construite avec un nombre de `minutes` et de `secondes`, toujours **normalisée** (les secondes restent entre 0 et 59 : `Duree(1, 75)` vaut 2 min 15 s), avec :
- `__add__(self, autre)` : `d1 + d2` renvoie une nouvelle `Duree` ;
- `__str__` : `"2 min 15 s"`.

<Indices>
<Indice>

Pour normaliser, convertir en secondes totales, puis revenir aux minutes et secondes avec `//` et `%`.

</Indice>
<Indice>

`__add__` construit `Duree(0, total1 + total2)` : le constructeur normalise.

</Indice>
<Indice>

```text
CLASSE Duree
    CONSTRUCTEUR(minutes, secondes)
        total ← minutes × 60 + secondes
        self.minutes ← total // 60 ; self.secondes ← reste de total par 60
    MÉTHODE __add__(autre) : RENVOYER Duree(self.minutes + autre.minutes, self.secondes + autre.secondes)
    MÉTHODE __str__() : minutes + " min " + secondes + " s"
```

</Indice>
</Indices>

<Correction>

```python
class Duree:
    def __init__(self, minutes: int, secondes: int):
        total = minutes * 60 + secondes
        self.minutes = total // 60
        self.secondes = total % 60

    def __add__(self, autre: "Duree") -> "Duree":
        return Duree(self.minutes + autre.minutes, self.secondes + autre.secondes)

    def __str__(self) -> str:
        return f"{self.minutes} min {self.secondes} s"
```

</Correction>
</Enonce>
<Verification>

```python
d = Duree(1, 75)
assert (d.minutes, d.secondes) == (2, 15) and str(d) == "2 min 15 s", "Normalisation."
s = Duree(3, 50) + Duree(0, 20)
assert str(s) == "4 min 10 s" and isinstance(s, Duree), "Addition avec retenue."
assert str(Duree(0, 0) + Duree(0, 0)) == "0 min 0 s", "Durées nulles."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-2-1" label="2.1 [Facile] - Propriétés" type="python">
<Enonce>
### Propriétés

Écrire une classe `Rectangle` construite avec `largeur` et `hauteur`, où :
- `largeur` est une **propriété** : lire `r.largeur` renvoie la valeur, écrire `r.largeur = -2` lève une `ValueError` (une largeur négative est refusée) ;
- `aire` est une propriété en **lecture seule**, calculée : `r.aire` (sans parenthèses) renvoie la surface.

<Indices>
<Indice>

`@property` au-dessus d'une méthode `largeur(self)` permet de l'utiliser comme un attribut ; la valeur est rangée dans `self._largeur`.

</Indice>
<Indice>

Le décorateur `@largeur.setter` définit ce qui se passe lors d'une affectation `r.largeur = …`.

</Indice>
<Indice>

```text
CLASSE Rectangle
    CONSTRUCTEUR(largeur, hauteur) : self.largeur ← largeur (passe par le setter) ; self.hauteur ← hauteur
    PROPRIÉTÉ largeur : RENVOYER self._largeur
    AFFECTATION largeur(v) : SI v < 0 ALORS LEVER ValueError ; self._largeur ← v
    PROPRIÉTÉ aire : RENVOYER self._largeur × self.hauteur
```

</Indice>
</Indices>

<Correction>

```python
class Rectangle:
    def __init__(self, largeur: float, hauteur: float):
        self.largeur = largeur
        self.hauteur = hauteur

    @property
    def largeur(self) -> float:
        return self._largeur

    @largeur.setter
    def largeur(self, v: float) -> None:
        if v < 0:
            raise ValueError("Largeur négative")
        self._largeur = v

    @property
    def aire(self) -> float:
        return self._largeur * self.hauteur
```

</Correction>
</Enonce>
<Verification>

```python
r = Rectangle(4, 3)
assert r.largeur == 4 and r.aire == 12, "Lecture des propriétés."
r.largeur = 10
assert r.aire == 30, "L'aire suit la largeur."
try:
    r.largeur = -2
    assert False, "Une largeur négative lève une ValueError."
except ValueError:
    pass
assert r.largeur == 10, "La largeur n'a pas changé."
try:
    r.aire = 5
    assert False, "L'aire est en lecture seule."
except AttributeError:
    pass
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-2-2" label="2.2 [Facile] - Trier des objets" type="python">
<Enonce>
### Trier des objets

Écrire une classe `Joueur` construite avec `nom` et `score`, avec une méthode `__lt__(self, autre)` (l'opérateur `<`) telle que `sorted(joueurs)` range les joueurs par **score croissant**, et à score égal par ordre alphabétique des noms.

Ajouter `__repr__` qui renvoie `"Léa (120)"`.

<Indices>
<Indice>

`sorted` n'a besoin que de l'opérateur `<` pour comparer deux objets.

</Indice>
<Indice>

Comparer des tuples fait le travail : `(self.score, self.nom) < (autre.score, autre.nom)`.

</Indice>
<Indice>

```text
CLASSE Joueur
    MÉTHODE __lt__(autre) : RENVOYER (self.score, self.nom) < (autre.score, autre.nom)
    MÉTHODE __repr__() : nom + " (" + score + ")"
```

</Indice>
</Indices>

<Correction>

```python
class Joueur:
    def __init__(self, nom: str, score: int):
        self.nom = nom
        self.score = score

    def __lt__(self, autre: "Joueur") -> bool:
        return (self.score, self.nom) < (autre.score, autre.nom)

    def __repr__(self) -> str:
        return f"{self.nom} ({self.score})"
```

</Correction>
</Enonce>
<Verification>

```python
j = [Joueur("Tom", 80), Joueur("Léa", 120), Joueur("Ali", 80)]
assert repr(sorted(j)) == "[Ali (80), Tom (80), Léa (120)]", "Tri par score, puis par nom."
assert Joueur("A", 1) < Joueur("B", 2) and not (Joueur("B", 2) < Joueur("A", 1)), "Opérateur <."
assert max(j).nom == "Léa", "max utilise aussi la comparaison."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-2-3" label="2.3 [Facile] - Longueur et appartenance" type="python">
<Enonce>
### Longueur et appartenance

Écrire une classe `Playlist` construite avec un `nom`, qui contient une liste de titres, avec :
- `ajouter(titre)` ;
- `__len__` : `len(p)` renvoie le nombre de titres ;
- `__contains__` : `"Titre" in p` renvoie `True` si le titre y est ;
- `__getitem__` : `p[0]` renvoie le premier titre.

<Indices>
<Indice>

Chaque méthode spéciale délègue à la liste interne : `len(self.titres)`, `titre in self.titres`, `self.titres[i]`.

</Indice>
<Indice>

Ces méthodes font qu'un objet se comporte comme une collection de Python.

</Indice>
<Indice>

```text
CLASSE Playlist
    CONSTRUCTEUR(nom) : self.nom ← nom ; self.titres ← liste vide
    MÉTHODE ajouter(titre) : ajouter à self.titres
    MÉTHODE __len__() : RENVOYER longueur(self.titres)
    MÉTHODE __contains__(titre) : RENVOYER titre ∈ self.titres
    MÉTHODE __getitem__(i) : RENVOYER self.titres[i]
```

</Indice>
</Indices>

<Correction>

```python
class Playlist:
    def __init__(self, nom: str):
        self.nom = nom
        self.titres = []

    def ajouter(self, titre: str) -> None:
        self.titres.append(titre)

    def __len__(self) -> int:
        return len(self.titres)

    def __contains__(self, titre: str) -> bool:
        return titre in self.titres

    def __getitem__(self, i: int) -> str:
        return self.titres[i]
```

</Correction>
</Enonce>
<Verification>

```python
p = Playlist("Révisions")
assert len(p) == 0, "Playlist vide."
for t in ["Lofi", "Jazz", "Pluie"]:
    p.ajouter(t)
assert len(p) == 3 and "Jazz" in p and "Rock" not in p, "len et in."
assert p[0] == "Lofi" and p[-1] == "Pluie" and list(p) == ["Lofi", "Jazz", "Pluie"], "Accès par indice (et parcours)."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-2-4" label="2.4 [Facile] - Héritage et super()" type="python">
<Enonce>
### Héritage et super()

Écrire une classe `Vehicule` construite avec `marque` et `vitesse_max`, avec une méthode `description()` qui renvoie `"Renault, 180 km/h"`.

Écrire une classe `Voiture` qui hérite de `Vehicule`, construite avec `marque`, `vitesse_max` et `places`. Son constructeur et sa méthode `description()` **réutilisent** ceux de `Vehicule` grâce à `super()` : la description d'une voiture est `"Renault, 180 km/h, 5 places"`.

<Indices>
<Indice>

`super().__init__(marque, vitesse_max)` appelle le constructeur de la classe mère.

</Indice>
<Indice>

`super().description()` renvoie la description du véhicule, à compléter.

</Indice>
<Indice>

```text
CLASSE Vehicule
    MÉTHODE description() : RENVOYER marque + ", " + vitesse_max + " km/h"
CLASSE Voiture HÉRITE DE Vehicule
    CONSTRUCTEUR(marque, vitesse_max, places)
        super().__init__(marque, vitesse_max) ; self.places ← places
    MÉTHODE description() : RENVOYER super().description() + ", " + places + " places"
```

</Indice>
</Indices>

<Correction>

```python
class Vehicule:
    def __init__(self, marque: str, vitesse_max: int):
        self.marque = marque
        self.vitesse_max = vitesse_max

    def description(self) -> str:
        return f"{self.marque}, {self.vitesse_max} km/h"


class Voiture(Vehicule):
    def __init__(self, marque: str, vitesse_max: int, places: int):
        super().__init__(marque, vitesse_max)
        self.places = places

    def description(self) -> str:
        return super().description() + f", {self.places} places"
```

</Correction>
</Enonce>
<Verification>

```python
assert Vehicule("Vélo", 40).description() == "Vélo, 40 km/h", "Description d'un véhicule."
v = Voiture("Renault", 180, 5)
assert v.marque == "Renault" and v.places == 5 and isinstance(v, Vehicule), "Une voiture est un véhicule."
assert v.description() == "Renault, 180 km/h, 5 places", "Description complétée."
assert "super()" in PROGRAMME, "Les méthodes de la classe mère sont réutilisées avec super()."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-3-1" label="3.1 [Moyen] - File avec deux piles" type="python">
<Enonce>
### File avec deux piles

Une **file** sert les éléments dans leur ordre d'arrivée (premier entré, premier sorti). On peut la réaliser avec deux piles : une pile d'**entrée** où l'on empile les arrivées, et une pile de **sortie** d'où l'on dépile.

Écrire une classe `File` avec `enfiler(x)`, `defiler()` (lève une `IndexError` si la file est vide), `est_vide()` et `__len__`, en n'utilisant que deux listes manipulées comme des piles (`append` et `pop()` sans argument).

<Indices>
<Indice>

Quand la pile de sortie est vide, y verser toute la pile d'entrée : l'ordre se retrouve inversé, donc le plus ancien est au sommet.

</Indice>
<Indice>

Ne verser que lorsque la sortie est vide : sinon l'ordre serait mélangé.

</Indice>
<Indice>

```text
CLASSE File
    CONSTRUCTEUR() : entree ← [] ; sortie ← []
    MÉTHODE enfiler(x) : empiler x sur entree
    MÉTHODE defiler()
        SI sortie vide ALORS
            TANT QUE entree non vide : empiler sur sortie le sommet dépilé de entree
        SI sortie vide ALORS LEVER IndexError
        RENVOYER le sommet dépilé de sortie
    MÉTHODE __len__() : longueur(entree) + longueur(sortie)
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.entree = []
        self.sortie = []

    def enfiler(self, x) -> None:
        self.entree.append(x)

    def defiler(self):
        if not self.sortie:
            while self.entree:
                self.sortie.append(self.entree.pop())
        if not self.sortie:
            raise IndexError("File vide")
        return self.sortie.pop()

    def est_vide(self) -> bool:
        return len(self) == 0

    def __len__(self) -> int:
        return len(self.entree) + len(self.sortie)
```

</Correction>
</Enonce>
<Verification>

```python
f = File()
assert f.est_vide() and len(f) == 0, "File vide."
for x in [1, 2, 3]:
    f.enfiler(x)
assert f.defiler() == 1, "Premier entré, premier sorti."
f.enfiler(4)
assert [f.defiler(), f.defiler(), f.defiler()] == [2, 3, 4] and f.est_vide(), "L'ordre d'arrivée est respecté."
try:
    f.defiler()
    assert False, "Défiler une file vide lève une IndexError."
except IndexError:
    pass
assert "pop(0)" not in PROGRAMME and "insert" not in PROGRAMME, "Seulement des opérations de pile."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-3-2" label="3.2 [Moyen] - Polymorphisme" type="python">
<Enonce>
### Polymorphisme

Écrire une classe `Forme` dont la méthode `aire()` lève une `NotImplementedError` (elle doit être redéfinie), et une méthode `decrire()` qui renvoie par exemple `"Cercle d'aire 3.14"` (le nom de la classe et l'aire arrondie au centième).

Écrire trois classes filles : `Cercle(rayon)`, `Carre(cote)` et `Triangle(base, hauteur)`, puis une fonction `aire_totale(formes)` qui additionne les aires d'une liste de formes, arrondie au centième.

<Indices>
<Indice>

`type(self).__name__` donne le nom de la classe de l'objet : `decrire` n'a besoin d'être écrite qu'une fois, dans `Forme`.

</Indice>
<Indice>

`aire_totale` appelle `f.aire()` sans se soucier du type exact de `f` : c'est le polymorphisme.

</Indice>
<Indice>

```text
CLASSE Forme
    MÉTHODE aire() : LEVER NotImplementedError
    MÉTHODE decrire() : RENVOYER nom de la classe + " d'aire " + arrondi(self.aire(), 2)
CLASSE Cercle HÉRITE DE Forme : aire = π × rayon²
CLASSE Carre HÉRITE DE Forme : aire = cote²
CLASSE Triangle HÉRITE DE Forme : aire = base × hauteur / 2
FONCTION aire_totale(formes) : arrondi(somme des f.aire(), 2)
```

</Indice>
</Indices>

<Correction>

```python
from math import pi


class Forme:
    def aire(self) -> float:
        raise NotImplementedError

    def decrire(self) -> str:
        return f"{type(self).__name__} d'aire {round(self.aire(), 2)}"


class Cercle(Forme):
    def __init__(self, rayon: float):
        self.rayon = rayon

    def aire(self) -> float:
        return pi * self.rayon ** 2


class Carre(Forme):
    def __init__(self, cote: float):
        self.cote = cote

    def aire(self) -> float:
        return self.cote ** 2


class Triangle(Forme):
    def __init__(self, base: float, hauteur: float):
        self.base = base
        self.hauteur = hauteur

    def aire(self) -> float:
        return self.base * self.hauteur / 2


def aire_totale(formes: list) -> float:
    return round(sum(f.aire() for f in formes), 2)
```

</Correction>
</Enonce>
<Verification>

```python
assert Cercle(1).decrire() == "Cercle d'aire 3.14" and Carre(3).decrire() == "Carre d'aire 9", "Descriptions."
assert Triangle(4, 3).aire() == 6, "Aire du triangle."
assert aire_totale([Cercle(1), Carre(2), Triangle(4, 3)]) == 13.14 and aire_totale([]) == 0, "Aire totale."
try:
    Forme().aire()
    assert False, "Forme.aire lève NotImplementedError."
except NotImplementedError:
    pass
assert all(isinstance(f, Forme) for f in [Cercle(1), Carre(1), Triangle(1, 1)]), "Toutes héritent de Forme."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-3-3" label="3.3 [Moyen] - Compte épargne" type="python">
<Enonce>
### Compte épargne

Écrire une classe `Compte` dont le solde est **privé** (`__solde`, avec deux tirets bas) :
- `solde()` le renvoie ;
- `deposer(m)` et `retirer(m)` lèvent une `ValueError` si `m` n'est pas strictement positif, et `retirer` aussi si le solde est insuffisant.

Écrire une classe `CompteEpargne(Compte)` construite avec un `taux` (par exemple `0.03`), avec une méthode `appliquer_interets()` qui dépose les intérêts du solde actuel (arrondis au centime).

<Indices>
<Indice>

Dans la classe fille, `self.__solde` n'est pas accessible (Python renomme l'attribut) : passer par `self.solde()` et `self.deposer(...)`.

</Indice>
<Indice>

Les vérifications sont écrites une seule fois, dans `Compte`.

</Indice>
<Indice>

```text
CLASSE Compte
    CONSTRUCTEUR() : self.__solde ← 0
    MÉTHODE solde() : RENVOYER self.__solde
    MÉTHODE deposer(m) : SI m ≤ 0 ALORS LEVER ValueError ; self.__solde ← self.__solde + m
    MÉTHODE retirer(m) : SI m ≤ 0 OU m > solde ALORS LEVER ValueError ; retirer
CLASSE CompteEpargne HÉRITE DE Compte
    CONSTRUCTEUR(taux) : super().__init__() ; self.taux ← taux
    MÉTHODE appliquer_interets() : interets ← arrondi(solde() × taux, 2) ; SI interets > 0 ALORS deposer(interets)
```

</Indice>
</Indices>

<Correction>

```python
class Compte:
    def __init__(self):
        self.__solde = 0

    def solde(self) -> float:
        return self.__solde

    def deposer(self, m: float) -> None:
        if m <= 0:
            raise ValueError("Montant invalide")
        self.__solde = round(self.__solde + m, 2)

    def retirer(self, m: float) -> None:
        if m <= 0 or m > self.__solde:
            raise ValueError("Retrait impossible")
        self.__solde = round(self.__solde - m, 2)


class CompteEpargne(Compte):
    def __init__(self, taux: float):
        super().__init__()
        self.taux = taux

    def appliquer_interets(self) -> None:
        interets = round(self.solde() * self.taux, 2)
        if interets > 0:
            self.deposer(interets)
```

</Correction>
</Enonce>
<Verification>

```python
c = Compte()
c.deposer(100)
c.retirer(40)
assert c.solde() == 60, "Dépôt puis retrait."
for action in [lambda: c.retirer(100), lambda: c.deposer(-5), lambda: c.retirer(0)]:
    try:
        action()
        assert False, "Opération invalide : ValueError attendue."
    except ValueError:
        pass
assert c.solde() == 60, "Les opérations refusées ne changent rien."
assert not hasattr(c, "__solde") and not hasattr(c, "solde_"), "Le solde n'est pas un attribut public."
e = CompteEpargne(0.03)
e.deposer(1000)
e.appliquer_interets()
e.appliquer_interets()
assert e.solde() == 1060.9, "Deux années à 3 % : 1060,90 €."
assert isinstance(e, Compte) and CompteEpargne(0.05).solde() == 0, "Un compte épargne est un compte."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-3-4" label="3.4 [Moyen] - Classe et élèves" type="python">
<Enonce>
### Classe et élèves

Écrire une classe `Eleve` (`nom`, et une liste `notes`) avec une méthode `moyenne()` (arrondie au centième, 0 sans note), puis une classe `Classe` qui **contient** des élèves :
- `inscrire(eleve)` ;
- `meilleur()` renvoie l'élève de meilleure moyenne (`None` si la classe est vide) ;
- `__iter__` permet d'écrire `for e in classe:` ;
- `moyenne_generale()` renvoie la moyenne des moyennes, arrondie au centième.

<Indices>
<Indice>

`__iter__` peut simplement renvoyer `iter(self.eleves)`.

</Indice>
<Indice>

Une fois `__iter__` écrit, les autres méthodes de `Classe` peuvent elles-mêmes parcourir `self` avec `for e in self`.

</Indice>
<Indice>

```text
CLASSE Eleve : nom, notes ; MÉTHODE moyenne()
CLASSE Classe
    CONSTRUCTEUR() : self.eleves ← liste vide
    MÉTHODE inscrire(e) : ajouter e
    MÉTHODE __iter__() : RENVOYER itérateur sur self.eleves
    MÉTHODE meilleur() : élève de plus grande moyenne, ou None
    MÉTHODE moyenne_generale() : arrondi(moyenne des e.moyenne(), 2)
```

</Indice>
</Indices>

<Correction>

```python
class Eleve:
    def __init__(self, nom: str, notes: list):
        self.nom = nom
        self.notes = notes

    def moyenne(self) -> float:
        if not self.notes:
            return 0
        return round(sum(self.notes) / len(self.notes), 2)


class Classe:
    def __init__(self):
        self.eleves = []

    def inscrire(self, eleve: Eleve) -> None:
        self.eleves.append(eleve)

    def __iter__(self):
        return iter(self.eleves)

    def meilleur(self):
        if not self.eleves:
            return None
        return max(self, key=lambda e: e.moyenne())

    def moyenne_generale(self) -> float:
        if not self.eleves:
            return 0
        return round(sum(e.moyenne() for e in self) / len(self.eleves), 2)
```

</Correction>
</Enonce>
<Verification>

```python
c = Classe()
assert c.meilleur() is None, "Classe vide."
for nom, notes in [("Léa", [14, 16]), ("Tom", [9, 12, 12]), ("Inès", [17])]:
    c.inscrire(Eleve(nom, notes))
assert [e.nom for e in c] == ["Léa", "Tom", "Inès"], "Parcours avec for."
assert c.meilleur().nom == "Inès" and Eleve("X", []).moyenne() == 0, "Meilleure moyenne ; élève sans note."
assert c.moyenne_generale() == 14.33, "Moyenne des moyennes : (15 + 11 + 17) / 3."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-4-1" label="4.1 [Difficile] - Fractions et opérateurs" type="python">
<Enonce>
### Fractions et opérateurs

Écrire une classe `Fraction` (toujours simplifiée, dénominateur positif) qui se manipule avec les opérateurs de Python :
- `+`, `-` et `*` entre fractions (`__add__`, `__sub__`, `__mul__`) ;
- `==` et `<` (`__eq__`, `__lt__`) ;
- `float(f)` (`__float__`) ;
- `__repr__` : `"3/4"`, ou `"2"` si le dénominateur vaut 1.

Une fraction de dénominateur nul lève une `ZeroDivisionError`.

<Indices>
<Indice>

La simplification se fait dans le constructeur, avec `math.gcd` : toutes les opérations construisent une nouvelle `Fraction` et en profitent.

</Indice>
<Indice>

Pour comparer sans flottants : `a/b < c/d` équivaut à `a × d < c × b` quand les dénominateurs sont positifs.

</Indice>
<Indice>

```text
CLASSE Fraction
    CONSTRUCTEUR(n, d) : SI d = 0 ALORS LEVER ZeroDivisionError ; signe sur n ; diviser par pgcd
    __add__(o) : Fraction(n × o.d + o.n × d, d × o.d) ; __sub__ et __mul__ de même
    __eq__(o) : n = o.n ET d = o.d ; __lt__(o) : n × o.d < o.n × d
    __float__() : n / d ; __repr__() : "n" ou "n/d"
```

</Indice>
</Indices>

<Correction>

```python
from math import gcd


class Fraction:
    def __init__(self, n: int, d: int = 1):
        if d == 0:
            raise ZeroDivisionError("Dénominateur nul")
        if d < 0:
            n, d = -n, -d
        g = gcd(n, d)
        self.n = n // g
        self.d = d // g

    def __add__(self, o: "Fraction") -> "Fraction":
        return Fraction(self.n * o.d + o.n * self.d, self.d * o.d)

    def __sub__(self, o: "Fraction") -> "Fraction":
        return Fraction(self.n * o.d - o.n * self.d, self.d * o.d)

    def __mul__(self, o: "Fraction") -> "Fraction":
        return Fraction(self.n * o.n, self.d * o.d)

    def __eq__(self, o: object) -> bool:
        return isinstance(o, Fraction) and self.n == o.n and self.d == o.d

    def __lt__(self, o: "Fraction") -> bool:
        return self.n * o.d < o.n * self.d

    def __float__(self) -> float:
        return self.n / self.d

    def __repr__(self) -> str:
        return str(self.n) if self.d == 1 else f"{self.n}/{self.d}"
```

</Correction>
</Enonce>
<Verification>

```python
a, b = Fraction(1, 2), Fraction(1, 3)
assert repr(a + b) == "5/6" and repr(a - b) == "1/6" and repr(a * b) == "1/6", "Opérations."
assert Fraction(2, 4) == a and Fraction(6, -3) == Fraction(-2, 1) and repr(Fraction(6, -3)) == "-2", "Simplification et signe."
assert b < a and not (a < b) and sorted([a, b, Fraction(0, 1)]) == [Fraction(0, 1), b, a], "Comparaisons."
assert float(Fraction(3, 4)) == 0.75, "Conversion en flottant."
try:
    Fraction(1, 0)
    assert False, "Dénominateur nul : ZeroDivisionError."
except ZeroDivisionError:
    pass
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-4-2" label="4.2 [Difficile] - Arbre binaire" type="python">
<Enonce>
### Arbre binaire

Un arbre binaire est fait de nœuds ; chaque nœud a une `valeur`, un sous-arbre `gauche` et un sous-arbre `droit` (`None` si absent).

Écrire une classe `Noeud` avec les méthodes **récursives** :
- `taille()` : le nombre de nœuds de l'arbre ;
- `hauteur()` : le nombre de nœuds du plus long chemin de la racine à une feuille (1 pour une feuille) ;
- `infixe()` : la liste des valeurs en parcours infixe (gauche, nœud, droit) ;
- `feuilles()` : la liste des valeurs des feuilles, de gauche à droite.

<Indices>
<Indice>

Chaque méthode traite le nœud lui-même, puis s'appelle sur `self.gauche` et `self.droit` **s'ils ne valent pas** `None`.

</Indice>
<Indice>

`hauteur` vaut 1 plus la plus grande des hauteurs des deux sous-arbres (0 pour un sous-arbre absent).

</Indice>
<Indice>

```text
CLASSE Noeud(valeur, gauche = None, droit = None)
    MÉTHODE taille() : 1 + taille(gauche) + taille(droit)      (0 pour un sous-arbre absent)
    MÉTHODE hauteur() : 1 + max(hauteur(gauche), hauteur(droit))
    MÉTHODE infixe() : infixe(gauche) + [valeur] + infixe(droit)
    MÉTHODE feuilles() : [valeur] si pas d'enfant, sinon feuilles(gauche) + feuilles(droit)
```

</Indice>
</Indices>

<Correction>

```python
class Noeud:
    def __init__(self, valeur, gauche=None, droit=None):
        self.valeur = valeur
        self.gauche = gauche
        self.droit = droit

    def taille(self) -> int:
        t = 1
        for enfant in (self.gauche, self.droit):
            if enfant is not None:
                t = t + enfant.taille()
        return t

    def hauteur(self) -> int:
        hg = self.gauche.hauteur() if self.gauche is not None else 0
        hd = self.droit.hauteur() if self.droit is not None else 0
        return 1 + max(hg, hd)

    def infixe(self) -> list:
        g = self.gauche.infixe() if self.gauche is not None else []
        d = self.droit.infixe() if self.droit is not None else []
        return g + [self.valeur] + d

    def feuilles(self) -> list:
        if self.gauche is None and self.droit is None:
            return [self.valeur]
        g = self.gauche.feuilles() if self.gauche is not None else []
        d = self.droit.feuilles() if self.droit is not None else []
        return g + d
```

</Correction>
</Enonce>
<Verification>

```python
#        5
#      /   \
#     3     8
#    / \     \
#   1   4     9
a = Noeud(5, Noeud(3, Noeud(1), Noeud(4)), Noeud(8, None, Noeud(9)))
assert a.taille() == 6 and a.hauteur() == 3, "Taille 6, hauteur 3."
assert a.infixe() == [1, 3, 4, 5, 8, 9], "Parcours infixe."
assert a.feuilles() == [1, 4, 9], "Feuilles."
f = Noeud("x")
assert f.taille() == 1 and f.hauteur() == 1 and f.infixe() == ["x"] and f.feuilles() == ["x"], "Une feuille seule."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-4-3" label="4.3 [Difficile] - Pile chaînée" type="python">
<Enonce>
### Pile chaînée

Écrire une classe `Pile` réalisée avec des **maillons chaînés** (une classe `Maillon` avec `valeur` et `suivant`), sans liste Python :
- `empiler(x)`, `depiler()` (lève une `IndexError` si la pile est vide), `est_vide()` ;
- `__len__` en temps constant (un compteur mis à jour) ;
- `__repr__` : `"Pile[3, 2, 1]"`, du sommet vers le fond.

<Indices>
<Indice>

Le sommet est le premier maillon : empiler crée un maillon dont le suivant est l'ancien sommet.

</Indice>
<Indice>

Pour `__repr__`, parcourir les maillons depuis le sommet et assembler les valeurs.

</Indice>
<Indice>

```text
CLASSE Maillon(valeur, suivant)
CLASSE Pile
    CONSTRUCTEUR() : sommet ← None ; taille ← 0
    MÉTHODE empiler(x) : sommet ← Maillon(x, sommet) ; taille ← taille + 1
    MÉTHODE depiler()
        SI sommet = None ALORS LEVER IndexError
        v ← sommet.valeur ; sommet ← sommet.suivant ; taille ← taille - 1 ; RENVOYER v
    MÉTHODE __repr__() : "Pile[" + valeurs du sommet au fond séparées par ", " + "]"
```

</Indice>
</Indices>

<Correction>

```python
class Maillon:
    def __init__(self, valeur, suivant=None):
        self.valeur = valeur
        self.suivant = suivant


class Pile:
    def __init__(self):
        self.sommet = None
        self.taille = 0

    def empiler(self, x) -> None:
        self.sommet = Maillon(x, self.sommet)
        self.taille = self.taille + 1

    def depiler(self):
        if self.sommet is None:
            raise IndexError("Pile vide")
        v = self.sommet.valeur
        self.sommet = self.sommet.suivant
        self.taille = self.taille - 1
        return v

    def est_vide(self) -> bool:
        return self.sommet is None

    def __len__(self) -> int:
        return self.taille

    def __repr__(self) -> str:
        valeurs = []
        m = self.sommet
        while m is not None:
            valeurs.append(repr(m.valeur))
            m = m.suivant
        return "Pile[" + ", ".join(valeurs) + "]"
```

</Correction>
</Enonce>
<Verification>

```python
p = Pile()
assert p.est_vide() and len(p) == 0 and repr(p) == "Pile[]", "Pile vide."
for x in [1, 2, 3]:
    p.empiler(x)
assert repr(p) == "Pile[3, 2, 1]" and len(p) == 3, "Affichage du sommet vers le fond."
assert p.depiler() == 3 and len(p) == 2 and isinstance(p.sommet, Maillon), "Dépiler le sommet."
p.depiler()
p.depiler()
try:
    p.depiler()
    assert False, "Pile vide : IndexError."
except IndexError:
    pass
assert "[]" not in PROGRAMME.split("def __repr__")[0], "Pas de liste Python pour stocker les éléments."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-4-4" label="4.4 [Difficile] - Matrices" type="python">
<Enonce>
### Matrices

Écrire une classe `Matrice` construite avec une liste de lignes, avec :
- `__add__` et `__mul__` (produit matriciel) qui renvoient une nouvelle `Matrice` et lèvent une `ValueError` si les dimensions ne conviennent pas ;
- `__eq__` ;
- une **méthode de classe** `identite(n)` qui renvoie la matrice identité `n × n` : `Matrice.identite(3)`.

<Indices>
<Indice>

Une méthode de classe se déclare avec `@classmethod` ; son premier paramètre est la classe (`cls`), ce qui permet d'écrire `return cls([...])`.

</Indice>
<Indice>

Le produit `a × b` exige que le nombre de colonnes de `a` soit égal au nombre de lignes de `b`.

</Indice>
<Indice>

```text
CLASSE Matrice(lignes)
    __add__(o) : SI dimensions différentes ALORS LEVER ValueError ; somme case par case
    __mul__(o) : SI colonnes ≠ lignes de o ALORS LEVER ValueError ; produit matriciel
    __eq__(o) : mêmes lignes
    MÉTHODE DE CLASSE identite(n) : 1 sur la diagonale, 0 ailleurs
```

</Indice>
</Indices>

<Correction>

```python
class Matrice:
    def __init__(self, lignes: list):
        self.lignes = [list(l) for l in lignes]

    def dimensions(self) -> tuple:
        return (len(self.lignes), len(self.lignes[0]) if self.lignes else 0)

    def __add__(self, o: "Matrice") -> "Matrice":
        if self.dimensions() != o.dimensions():
            raise ValueError("Dimensions différentes")
        return Matrice([[a + b for a, b in zip(l1, l2)] for l1, l2 in zip(self.lignes, o.lignes)])

    def __mul__(self, o: "Matrice") -> "Matrice":
        n, p = self.dimensions()
        p2, q = o.dimensions()
        if p != p2:
            raise ValueError("Dimensions incompatibles")
        return Matrice([[sum(self.lignes[i][k] * o.lignes[k][j] for k in range(p)) for j in range(q)] for i in range(n)])

    def __eq__(self, o: object) -> bool:
        return isinstance(o, Matrice) and self.lignes == o.lignes

    @classmethod
    def identite(cls, n: int) -> "Matrice":
        return cls([[1 if i == j else 0 for j in range(n)] for i in range(n)])
```

</Correction>
</Enonce>
<Verification>

```python
a = Matrice([[1, 2], [3, 4]])
b = Matrice([[5, 6], [7, 8]])
assert a + b == Matrice([[6, 8], [10, 12]]) and a * b == Matrice([[19, 22], [43, 50]]), "Somme et produit."
assert a * Matrice.identite(2) == a and Matrice.identite(3).lignes[1] == [0, 1, 0], "Identité."
for calcul in [lambda: a + Matrice([[1, 2, 3]]), lambda: Matrice([[1, 2, 3]]) * a]:
    try:
        calcul()
        assert False, "Dimensions incompatibles : ValueError."
    except ValueError:
        pass
assert "classmethod" in PROGRAMME, "identite est une méthode de classe."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-5-1" label="5.1 [Expert] - Graphe et parcours" type="python">
<Enonce>
### Graphe et parcours

Écrire une classe `Graphe` (non orienté) dont l'attribut `adj` est un dictionnaire sommet → liste des voisins, avec :
- `ajouter_arete(a, b)` (crée les sommets si besoin, sans arête en double) ;
- `voisins(s)` : la liste triée des voisins ;
- `largeur(depart)` : la liste des sommets dans l'ordre d'un **parcours en largeur**, les voisins étant visités par ordre croissant ;
- `chemin(a, b)` : un plus court chemin (en nombre d'arêtes) de `a` à `b` sous forme de liste, ou `None`.

<Indices>
<Indice>

Le parcours en largeur utilise une file : retirer le premier sommet, ajouter à la fin ses voisins pas encore vus.

</Indice>
<Indice>

Pour le plus court chemin, retenir pendant le parcours en largeur le **parent** de chaque sommet découvert, puis remonter de `b` jusqu'à `a`.

</Indice>
<Indice>

```text
CLASSE Graphe
    MÉTHODE ajouter_arete(a, b) : b dans adj[a] et a dans adj[b], sans doublon
    MÉTHODE largeur(depart)
        vus ← {depart} ; file ← [depart] ; ordre ← []
        TANT QUE file non vide
            s ← retirer le premier de file ; ajouter s à ordre
            POUR CHAQUE v DE voisins(s) triés : SI v ∉ vus ALORS marquer v ; ajouter v à file
        RENVOYER ordre
    MÉTHODE chemin(a, b) : parcours en largeur en retenant parent[v] ← s, puis remonter de b à a
```

</Indice>
</Indices>

<Correction>

```python
from collections import deque


class Graphe:
    def __init__(self):
        self.adj = {}

    def ajouter_arete(self, a, b) -> None:
        self.adj.setdefault(a, [])
        self.adj.setdefault(b, [])
        if b not in self.adj[a]:
            self.adj[a].append(b)
        if a not in self.adj[b]:
            self.adj[b].append(a)

    def voisins(self, s) -> list:
        return sorted(self.adj.get(s, []))

    def largeur(self, depart) -> list:
        vus = {depart}
        file = deque([depart])
        ordre = []
        while file:
            s = file.popleft()
            ordre.append(s)
            for v in self.voisins(s):
                if v not in vus:
                    vus.add(v)
                    file.append(v)
        return ordre

    def chemin(self, a, b):
        if a not in self.adj or b not in self.adj:
            return None
        parent = {a: None}
        file = deque([a])
        while file:
            s = file.popleft()
            if s == b:
                break
            for v in self.voisins(s):
                if v not in parent:
                    parent[v] = s
                    file.append(v)
        if b not in parent:
            return None
        trajet = [b]
        while parent[trajet[-1]] is not None:
            trajet.append(parent[trajet[-1]])
        return trajet[::-1]
```

</Correction>
</Enonce>
<Verification>

```python
g = Graphe()
for a, b in [("A", "B"), ("A", "C"), ("B", "D"), ("C", "D"), ("D", "E"), ("F", "G"), ("A", "B")]:
    g.ajouter_arete(a, b)
assert g.voisins("A") == ["B", "C"] and g.voisins("D") == ["B", "C", "E"], "Voisins, sans doublon."
assert g.largeur("A") == ["A", "B", "C", "D", "E"], "Parcours en largeur depuis A."
assert g.chemin("A", "E") == ["A", "B", "D", "E"] and g.chemin("E", "E") == ["E"], "Plus courts chemins."
assert g.chemin("A", "G") is None and g.chemin("A", "Z") is None, "Pas de chemin."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-5-2" label="5.2 [Expert] - Arbre binaire de recherche" type="python">
<Enonce>
### Arbre binaire de recherche

Dans un **arbre binaire de recherche**, les valeurs du sous-arbre gauche d'un nœud sont plus petites que la sienne, celles du sous-arbre droit plus grandes.

Écrire une classe `ABR` (avec une classe `Noeud` interne ou séparée) :
- `inserer(x)` (une valeur déjà présente est ignorée) ;
- `__contains__` : `x in arbre`, en descendant d'un seul côté à chaque nœud ;
- `__len__` ;
- `en_liste()` : les valeurs dans l'ordre croissant ;
- `minimum()` (`None` pour un arbre vide).

<Indices>
<Indice>

Une boucle `while` qui descend à gauche ou à droite selon la comparaison suffit pour insérer et pour chercher.

</Indice>
<Indice>

L'ordre croissant est le parcours infixe de l'arbre.

</Indice>
<Indice>

```text
CLASSE ABR
    racine ← None ; nombre ← 0
    MÉTHODE inserer(x)
        SI racine = None ALORS racine ← Noeud(x)
        SINON descendre depuis la racine (gauche si x < valeur, droite si x > valeur) jusqu'à une place libre ; ignorer si égal
    MÉTHODE __contains__(x) : descendre ; VRAI si une valeur est égale à x
    MÉTHODE en_liste() : parcours infixe
    MÉTHODE minimum() : descendre toujours à gauche
```

</Indice>
</Indices>

<Correction>

```python
class Noeud:
    def __init__(self, valeur):
        self.valeur = valeur
        self.gauche = None
        self.droit = None


class ABR:
    def __init__(self):
        self.racine = None
        self.nombre = 0

    def inserer(self, x) -> None:
        if self.racine is None:
            self.racine = Noeud(x)
            self.nombre = 1
            return
        n = self.racine
        while True:
            if x == n.valeur:
                return
            cote = "gauche" if x < n.valeur else "droit"
            suivant = getattr(n, cote)
            if suivant is None:
                setattr(n, cote, Noeud(x))
                self.nombre = self.nombre + 1
                return
            n = suivant

    def __contains__(self, x) -> bool:
        n = self.racine
        while n is not None:
            if x == n.valeur:
                return True
            n = n.gauche if x < n.valeur else n.droit
        return False

    def __len__(self) -> int:
        return self.nombre

    def en_liste(self) -> list:
        def infixe(n):
            return [] if n is None else infixe(n.gauche) + [n.valeur] + infixe(n.droit)
        return infixe(self.racine)

    def minimum(self):
        n = self.racine
        if n is None:
            return None
        while n.gauche is not None:
            n = n.gauche
        return n.valeur
```

</Correction>
</Enonce>
<Verification>

```python
import random
a = ABR()
assert len(a) == 0 and a.minimum() is None and 3 not in a, "Arbre vide."
for x in [8, 3, 10, 1, 6, 14, 4, 7, 13, 6]:
    a.inserer(x)
assert len(a) == 9 and a.en_liste() == [1, 3, 4, 6, 7, 8, 10, 13, 14], "Insertion, doublon ignoré, ordre croissant."
assert 7 in a and 5 not in a and a.minimum() == 1, "Recherche et minimum."
assert a.racine.valeur == 8 and a.racine.gauche.valeur == 3 and a.racine.droit.valeur == 10, "La structure respecte la règle."
b = ABR()
valeurs = random.sample(range(100000), 5000)
for x in valeurs:
    b.inserer(x)
assert b.en_liste() == sorted(valeurs) and all(x in b for x in valeurs[:200]), "5000 valeurs aléatoires."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-5-3" label="5.3 [Expert] - Itérateur" type="python">
<Enonce>
### Itérateur

Un objet est **itérable** (utilisable dans un `for`) si sa méthode `__iter__` renvoie un **itérateur** : un objet dont la méthode `__next__` donne l'élément suivant, puis lève `StopIteration` quand il n'y en a plus.

Écrire une classe `Intervalle(debut, fin, pas)` qui se comporte comme `range` pour des **flottants** : `list(Intervalle(0, 1, 0.25))` vaut `[0, 0.25, 0.5, 0.75]` (la fin est exclue, le pas peut être négatif, un pas nul lève une `ValueError`). Elle doit pouvoir être parcourue **plusieurs fois**.

Contrainte : sans liste ni `range` pour stocker les valeurs.

<Indices>
<Indice>

Séparer l'itérable (`Intervalle`) et l'itérateur (une seconde classe qui garde la position courante) : chaque appel à `__iter__` crée un nouvel itérateur, ce qui permet plusieurs parcours.

</Indice>
<Indice>

Pour éviter l'accumulation d'erreurs d'arrondi, calculer le `k`-ième élément comme `debut + k × pas` plutôt que d'ajouter le pas à chaque fois.

</Indice>
<Indice>

La condition d'arrêt dépend du signe du pas : `valeur >= fin` pour un pas positif, `valeur <= fin` pour un pas négatif.

</Indice>
<Indice>

```text
CLASSE Intervalle(debut, fin, pas)
    CONSTRUCTEUR : SI pas = 0 ALORS LEVER ValueError
    MÉTHODE __iter__() : RENVOYER IterateurIntervalle(self)
CLASSE IterateurIntervalle(intervalle)
    k ← 0
    MÉTHODE __iter__() : RENVOYER self
    MÉTHODE __next__()
        v ← debut + k × pas
        SI (pas > 0 ET v ≥ fin) OU (pas < 0 ET v ≤ fin) ALORS LEVER StopIteration
        k ← k + 1 ; RENVOYER v
```

</Indice>
</Indices>

<Correction>

```python
class Intervalle:
    def __init__(self, debut: float, fin: float, pas: float):
        if pas == 0:
            raise ValueError("Pas nul")
        self.debut = debut
        self.fin = fin
        self.pas = pas

    def __iter__(self):
        return IterateurIntervalle(self)


class IterateurIntervalle:
    def __init__(self, intervalle: Intervalle):
        self.i = intervalle
        self.k = 0

    def __iter__(self):
        return self

    def __next__(self) -> float:
        v = self.i.debut + self.k * self.i.pas
        if (self.i.pas > 0 and v >= self.i.fin) or (self.i.pas < 0 and v <= self.i.fin):
            raise StopIteration
        self.k = self.k + 1
        return v
```

</Correction>
</Enonce>
<Verification>

```python
assert list(Intervalle(0, 1, 0.25)) == [0, 0.25, 0.5, 0.75], "De 0 à 1 par pas de 0,25."
assert list(Intervalle(2, 0, -0.5)) == [2, 1.5, 1, 0.5], "Pas négatif."
assert list(Intervalle(0, 0, 1)) == [] and len(list(Intervalle(0, 1, 0.1))) == 10, "Vide, puis 10 valeurs sans dérive d'arrondi."
i = Intervalle(1, 4, 1)
assert [x for x in i] == [1, 2, 3] and sum(i) == 6, "Deux parcours du même intervalle."
it = iter(Intervalle(0, 2, 1))
assert next(it) == 0 and next(it) == 1, "next sur l'itérateur."
try:
    next(it)
    assert False, "Fin de l'itération : StopIteration."
except StopIteration:
    pass
try:
    Intervalle(0, 1, 0)
    assert False, "Pas nul : ValueError."
except ValueError:
    pass
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-5-4" label="5.4 [Expert] - File de priorité" type="python">
<Enonce>
### File de priorité

Une **file de priorité** sert toujours en premier le plus petit élément. On la réalise efficacement avec un **tas binaire** : une liste où l'élément d'indice `i` est plus petit que ses enfants d'indices `2i + 1` et `2i + 2`. Le minimum est donc toujours en tête.

Écrire une classe `FilePriorite` avec `ajouter(x)`, `retirer_min()` (lève une `IndexError` si vide), `minimum()` et `__len__`.

Contrainte : sans `heapq`, `sort`, `sorted` ni `min`.

<Indices>
<Indice>

Ajouter : placer l'élément à la fin, puis le faire **remonter** en l'échangeant avec son parent (indice `(i - 1) // 2`) tant qu'il est plus petit que lui.

</Indice>
<Indice>

Retirer le minimum : le remplacer par le dernier élément, puis faire **descendre** celui-ci en l'échangeant avec le plus petit de ses enfants tant qu'un enfant est plus petit.

</Indice>
<Indice>

```text
CLASSE FilePriorite
    tas ← liste vide
    MÉTHODE ajouter(x)
        ajouter x à la fin ; i ← dernier indice
        TANT QUE i > 0 ET tas[i] < tas[(i - 1) // 2] : échanger avec le parent ; i ← parent
    MÉTHODE retirer_min()
        SI vide ALORS LEVER IndexError
        m ← tas[0] ; tas[0] ← dernier élément retiré de la fin
        i ← 0 ; TANT QUE un enfant est plus petit que tas[i] : échanger avec le plus petit enfant
        RENVOYER m
```

</Indice>
</Indices>

<Correction>

```python
class FilePriorite:
    def __init__(self):
        self.tas = []

    def __len__(self) -> int:
        return len(self.tas)

    def minimum(self):
        if not self.tas:
            raise IndexError("File vide")
        return self.tas[0]

    def ajouter(self, x) -> None:
        self.tas.append(x)
        i = len(self.tas) - 1
        while i > 0 and self.tas[i] < self.tas[(i - 1) // 2]:
            p = (i - 1) // 2
            self.tas[i], self.tas[p] = self.tas[p], self.tas[i]
            i = p

    def retirer_min(self):
        if not self.tas:
            raise IndexError("File vide")
        m = self.tas[0]
        dernier = self.tas.pop()
        if self.tas:
            self.tas[0] = dernier
            i = 0
            n = len(self.tas)
            while True:
                g, d = 2 * i + 1, 2 * i + 2
                petit = i
                if g < n and self.tas[g] < self.tas[petit]:
                    petit = g
                if d < n and self.tas[d] < self.tas[petit]:
                    petit = d
                if petit == i:
                    break
                self.tas[i], self.tas[petit] = self.tas[petit], self.tas[i]
                i = petit
        return m
```

</Correction>
</Enonce>
<Verification>

```python
import random
f = FilePriorite()
for x in [5, 3, 8, 1, 9, 2]:
    f.ajouter(x)
assert len(f) == 6 and f.minimum() == 1, "Le minimum est en tête."
assert [f.retirer_min() for _ in range(6)] == [1, 2, 3, 5, 8, 9] and len(f) == 0, "Sortie dans l'ordre croissant."
try:
    f.retirer_min()
    assert False, "File vide : IndexError."
except IndexError:
    pass
valeurs = [random.randint(0, 10 ** 6) for _ in range(20000)]
for x in valeurs:
    f.ajouter(x)
assert [f.retirer_min() for _ in range(20000)] == sorted(valeurs), "20 000 valeurs, rapidement."
import re
assert "heapq" not in PROGRAMME and not re.search(r"\b(sorted|min)\s*\(|\.sort\s*\(", PROGRAMME), "Sans heapq, tri ni min."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-6-1" label="6.1 [Mini-projet] - Réservation de salles" type="python">
<Enonce>
### Réservation de salles

**Contexte.** Au lycée, les salles sont réservées sur un tableau papier et les conflits sont fréquents : deux classes dans la même salle, un cours d'informatique dans une salle sans ordinateurs, un amphi trop petit. Le projet est le système de réservation qui remplace ce tableau. Les heures sont des entiers (8 pour 8 h) et un créneau va de `debut` (inclus) à `fin` (exclu) : un cours de 8 h à 10 h libère la salle pour un cours qui commence à 10 h.

**Les données** : une salle a un nom, une capacité et un **ensemble** d'équipements, par exemple `Salle("Info1", 18, {"projecteur", "ordinateurs"})`. Une réservation associe une salle, un créneau, un groupe (`"1NSI"`) et un effectif.

**Les classes et leurs rôles**
- `Creneau(debut, fin)` : une plage horaire. Le constructeur lève une `ValueError` si `fin <= debut`. `duree()` renvoie sa longueur en heures ; `chevauche(autre)` dit si deux créneaux se recouvrent (deux créneaux qui se touchent seulement, comme 8-10 et 10-12, ne se chevauchent pas) ; `__repr__` renvoie `"[8-10]"` pour l'affichage.
- `Salle(nom, capacite, equipements)` : une salle du lycée.
- `Reservation(salle, creneau, groupe, effectif)` : une réservation enregistrée.
- `Planning` : le système lui-même, qui connaît les salles et toutes les réservations.
  - `ajouter_salle(salle)` : enregistre une salle.
  - `reserver(nom_salle, debut, fin, groupe, effectif)` : appelée quand un professeur réserve. Crée et renvoie la réservation, ou lève une `ValueError` dont le message, affiché au professeur, vaut `"salle inconnue"`, `"capacité"` ou `"conflit"` (dans cet ordre de vérification).
  - `annuler(groupe, debut)` : supprime la réservation de ce groupe qui commence à cette heure ; renvoie `True`, ou `False` si elle n'existe pas.
  - `disponibles(debut, fin, effectif, equipements)` : la recherche d'une salle libre. Renvoie la liste triée des noms des salles libres sur tout le créneau, assez grandes, et qui ont **au moins** tous les équipements demandés.
  - `occupation(nom_salle, ouverture, fermeture)` : pour savoir quelles salles sont sous-utilisées. Renvoie le pourcentage de la journée (de `ouverture` à `fermeture`) pendant lequel la salle est réservée, arrondi au dixième.
  - `agenda(groupe)` : l'emploi du temps d'un groupe. Renvoie la liste des tuples `(debut, fin, nom_salle)` de ses réservations, par heure de début.
  - `__len__` : renvoie le nombre de réservations.

<Indices>
<Indice>

`Creneau` porte toute la logique horaire : une fois `chevauche` juste, les conflits et les disponibilités se ramènent à des appels à cette méthode.

</Indice>
<Indice>

Deux créneaux `[a, b[` et `[c, d[` se chevauchent si et seulement si `a < d` et `c < b`.

</Indice>
<Indice>

Pour les équipements, l'inclusion d'ensembles s'écrit `demandes <= salle.equipements` (ou `issubset`).

</Indice>
<Indice>

```text
(cœur du programme : réserver)
MÉTHODE reserver(nom_salle, debut, fin, groupe, effectif)
    SI nom_salle ∉ salles ALORS LEVER ValueError("salle inconnue")
    salle ← salles[nom_salle] ; c ← Creneau(debut, fin)
    SI effectif > salle.capacite ALORS LEVER ValueError("capacité")
    SI une réservation r de cette salle vérifie r.creneau.chevauche(c) ALORS LEVER ValueError("conflit")
    r ← Reservation(salle, c, groupe, effectif) ; ajouter r ; RENVOYER r
```

</Indice>
</Indices>

<Correction>

```python
class Creneau:
    def __init__(self, debut: int, fin: int):
        if fin <= debut:
            raise ValueError("créneau vide")
        self.debut = debut
        self.fin = fin

    def duree(self) -> int:
        return self.fin - self.debut

    def chevauche(self, autre: "Creneau") -> bool:
        return self.debut < autre.fin and autre.debut < self.fin

    def __repr__(self) -> str:
        return f"[{self.debut}-{self.fin}]"


class Salle:
    def __init__(self, nom: str, capacite: int, equipements: set):
        self.nom = nom
        self.capacite = capacite
        self.equipements = set(equipements)


class Reservation:
    def __init__(self, salle: Salle, creneau: Creneau, groupe: str, effectif: int):
        self.salle = salle
        self.creneau = creneau
        self.groupe = groupe
        self.effectif = effectif


class Planning:
    def __init__(self):
        self.salles = {}
        self.reservations = []

    def ajouter_salle(self, salle: Salle) -> None:
        self.salles[salle.nom] = salle

    def _libre(self, nom: str, c: Creneau) -> bool:
        return not any(r.salle.nom == nom and r.creneau.chevauche(c) for r in self.reservations)

    def reserver(self, nom_salle: str, debut: int, fin: int, groupe: str, effectif: int) -> Reservation:
        if nom_salle not in self.salles:
            raise ValueError("salle inconnue")
        salle = self.salles[nom_salle]
        c = Creneau(debut, fin)
        if effectif > salle.capacite:
            raise ValueError("capacité")
        if not self._libre(nom_salle, c):
            raise ValueError("conflit")
        r = Reservation(salle, c, groupe, effectif)
        self.reservations.append(r)
        return r

    def annuler(self, groupe: str, debut: int) -> bool:
        for r in self.reservations:
            if r.groupe == groupe and r.creneau.debut == debut:
                self.reservations.remove(r)
                return True
        return False

    def disponibles(self, debut: int, fin: int, effectif: int, equipements: set) -> list:
        c = Creneau(debut, fin)
        return sorted(s.nom for s in self.salles.values()
                      if s.capacite >= effectif and set(equipements) <= s.equipements and self._libre(s.nom, c))

    def occupation(self, nom_salle: str, ouverture: int, fermeture: int) -> float:
        total = sum(r.creneau.duree() for r in self.reservations if r.salle.nom == nom_salle)
        return round(total / (fermeture - ouverture) * 100, 1)

    def agenda(self, groupe: str) -> list:
        return sorted((r.creneau.debut, r.creneau.fin, r.salle.nom) for r in self.reservations if r.groupe == groupe)

    def __len__(self) -> int:
        return len(self.reservations)
```

</Correction>
</Enonce>
<Verification>

```python
assert repr(Creneau(8, 10)) == "[8-10]" and Creneau(8, 11).duree() == 3, "Créneaux."
assert Creneau(8, 10).chevauche(Creneau(9, 12)) and Creneau(9, 12).chevauche(Creneau(8, 10)) and Creneau(8, 12).chevauche(Creneau(9, 10)), "Chevauchements."
assert not Creneau(8, 10).chevauche(Creneau(10, 12)) and not Creneau(14, 15).chevauche(Creneau(8, 10)), "Créneaux qui se touchent ou séparés."
try:
    Creneau(10, 10)
    assert False, "Créneau vide : ValueError."
except ValueError:
    pass
p = Planning()
p.ajouter_salle(Salle("B12", 30, {"projecteur"}))
p.ajouter_salle(Salle("Info1", 18, {"projecteur", "ordinateurs"}))
p.ajouter_salle(Salle("A01", 35, set()))
r = p.reserver("Info1", 8, 10, "1NSI", 16)
assert isinstance(r, Reservation) and isinstance(r.creneau, Creneau) and len(p) == 1, "Première réservation."
for args, motif in [(("Z9", 8, 9, "T1", 5), "salle inconnue"), (("Info1", 10, 12, "T2", 25), "capacité"), (("Info1", 9, 11, "TNSI", 12), "conflit")]:
    try:
        p.reserver(*args)
        assert False, f"Refus attendu : {motif}."
    except ValueError as e:
        assert str(e) == motif, f"Motif du refus : {motif}."
p.reserver("Info1", 10, 12, "TNSI", 12)
p.reserver("B12", 9, 11, "1NSI", 28)
assert p.disponibles(9, 10, 10, {"projecteur"}) == [] and p.disponibles(9, 10, 10, set()) == ["A01"], "Salles disponibles."
assert p.disponibles(12, 14, 15, {"ordinateurs"}) == ["Info1"] and p.disponibles(12, 14, 20, {"ordinateurs"}) == [], "Équipements et capacité."
assert p.occupation("Info1", 8, 18) == 40.0 and p.occupation("A01", 8, 18) == 0, "Taux d'occupation."
assert p.agenda("1NSI") == [(8, 10, "Info1"), (9, 11, "B12")], "Agenda du groupe."
assert p.annuler("1NSI", 9) and not p.annuler("1NSI", 9) and len(p) == 2, "Annulation."
assert p.disponibles(9, 10, 10, {"projecteur"}) == ["B12"], "La salle annulée redevient disponible."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-poo-6-2" label="6.2 [Mini-projet] - Combat d'équipes" type="python">
<Enonce>
### Combat d'équipes

**Contexte.** Une équipe du club jeu vidéo développe un jeu de rôle tactique : deux équipes de personnages s'affrontent au tour par tour. Avant de dessiner les graphismes, elle a besoin du **moteur de combat**, entièrement déterministe pour pouvoir équilibrer les personnages en rejouant les mêmes combats. Chaque type de personnage a une façon d'agir différente : c'est le terrain idéal de l'héritage et du polymorphisme.

**Les données** : un personnage a un nom, des points de vie, une attaque et une vitesse, par exemple `Guerrier("Gus", 30, 5, 3)` ; une équipe a un nom et une liste de membres.

**Les classes et leurs rôles**
- `Personnage(nom, pv, attaque, vitesse)` : le personnage de base. `est_vivant()` dit s'il lui reste des points de vie ; `subir(degats)` lui retire des points de vie (sans descendre sous 0) ; `agir(allies, ennemis)` est son action pendant un tour : par défaut, il attaque l'ennemi **vivant** qui a le moins de points de vie (le premier de la liste en cas d'égalité) en lui infligeant `attaque` dégâts.
- Trois spécialités, qui redéfinissent `agir` :
  - `Guerrier` : frappe comme un personnage ordinaire, mais une action sur trois (la 3ᵉ, la 6ᵉ…) inflige le double de dégâts ;
  - `Mage` : frappe **tous** les ennemis vivants à la fois, avec `attaque // 2` dégâts (au moins 1) ;
  - `Soigneur` : si un allié vivant (lui compris) a au plus la moitié de ses points de vie de départ, il soigne le plus blessé d'entre eux (le moins de points de vie, le premier en cas d'égalité) de `2 × attaque`, sans dépasser ses points de vie de départ ; sinon, il attaque comme un personnage ordinaire.
- `Equipe(nom, membres)` : `vivants()` renvoie la liste des membres encore debout ; `vaincue()` dit si plus aucun ne l'est.
- `combat(e1, e2, max_tours)` : le déroulement d'un combat. À chaque tour, tous les personnages vivants agissent, par **vitesse décroissante** (à vitesse égale : ceux de `e1` avant ceux de `e2`, puis dans l'ordre des listes) ; un personnage mis à terre avant son tour n'agit pas. Le combat s'arrête dès qu'une équipe est vaincue (même au milieu d'un tour) ou après `max_tours` tours. Renvoie `(nom de l'équipe gagnante ou None, nombre de tours commencés)`.

<Indices>
<Indice>

La méthode `agir` reçoit les listes des alliés et des ennemis : chaque classe y choisit sa cible. Le choix « ennemi vivant le plus faible » est une petite fonction réutilisable.

</Indice>
<Indice>

Pour l'ordre d'action, construire la liste de tous les personnages avec une clé de tri `(-vitesse, numéro d'équipe, position)` : `sorted` est **stable**, mais une clé complète est plus sûre.

</Indice>
<Indice>

Tester chaque classe seule, sur un petit cas calculé à la main, avant d'écrire `combat`.

</Indice>
<Indice>

```text
(cœur du programme : un combat)
FONCTION combat(e1, e2, max_tours)
    POUR tour DE 1 À max_tours
        ordre ← tous les personnages, triés par (-vitesse, équipe, position)
        POUR CHAQUE p DE ordre
            SI p est vivant ALORS
                p.agir(son équipe, l'autre équipe)
                SI e1 ou e2 est vaincue ALORS RENVOYER (nom de l'autre équipe, tour)
    RENVOYER (None, max_tours)
```

</Indice>
</Indices>

<Correction>

```python
def plus_faible(personnages: list):
    vivants = [p for p in personnages if p.est_vivant()]
    if not vivants:
        return None
    return min(vivants, key=lambda p: p.pv)


class Personnage:
    def __init__(self, nom: str, pv: int, attaque: int, vitesse: int):
        self.nom = nom
        self.pv = pv
        self.pv_max = pv
        self.attaque = attaque
        self.vitesse = vitesse

    def est_vivant(self) -> bool:
        return self.pv > 0

    def subir(self, degats: int) -> None:
        self.pv = max(0, self.pv - degats)

    def agir(self, allies: list, ennemis: list) -> None:
        cible = plus_faible(ennemis)
        if cible is not None:
            cible.subir(self.attaque)


class Guerrier(Personnage):
    def __init__(self, nom: str, pv: int, attaque: int, vitesse: int):
        super().__init__(nom, pv, attaque, vitesse)
        self.actions = 0

    def agir(self, allies: list, ennemis: list) -> None:
        self.actions += 1
        cible = plus_faible(ennemis)
        if cible is not None:
            cible.subir(self.attaque * 2 if self.actions % 3 == 0 else self.attaque)


class Mage(Personnage):
    def agir(self, allies: list, ennemis: list) -> None:
        for e in ennemis:
            if e.est_vivant():
                e.subir(max(1, self.attaque // 2))


class Soigneur(Personnage):
    def agir(self, allies: list, ennemis: list) -> None:
        blesses = [a for a in allies if a.est_vivant() and a.pv * 2 <= a.pv_max]
        if blesses:
            cible = min(blesses, key=lambda a: a.pv)
            cible.pv = min(cible.pv_max, cible.pv + 2 * self.attaque)
        else:
            super().agir(allies, ennemis)


class Equipe:
    def __init__(self, nom: str, membres: list):
        self.nom = nom
        self.membres = membres

    def vivants(self) -> list:
        return [m for m in self.membres if m.est_vivant()]

    def vaincue(self) -> bool:
        return not self.vivants()


def combat(e1: Equipe, e2: Equipe, max_tours: int) -> tuple:
    for tour in range(1, max_tours + 1):
        ordre = [(p, e1, e2, 0, i) for i, p in enumerate(e1.membres)] + [(p, e2, e1, 1, i) for i, p in enumerate(e2.membres)]
        ordre.sort(key=lambda t: (-t[0].vitesse, t[3], t[4]))
        for p, amis, ennemis, _, _ in ordre:
            if p.est_vivant():
                p.agir(amis.membres, ennemis.membres)
                if e1.vaincue():
                    return (e2.nom, tour)
                if e2.vaincue():
                    return (e1.nom, tour)
    return (None, max_tours)
```

</Correction>
</Enonce>
<Verification>

```python
a, b, c = Personnage("A", 10, 3, 1), Personnage("B", 4, 1, 1), Personnage("C", 6, 1, 1)
a.agir([a], [b, c])
assert b.pv == 1 and c.pv == 6, "Attaque de l'ennemi le plus faible."
a.agir([a], [b, c])
assert b.pv == 0 and not b.est_vivant(), "Pas de points de vie négatifs."
a.agir([a], [b, c])
assert c.pv == 3, "Un ennemi à terre n'est plus visé."
g = Guerrier("G", 20, 4, 1)
sac = Personnage("Sac", 100, 0, 1)
for _ in range(6):
    g.agir([g], [sac])
assert sac.pv == 100 - 4 * 8 and isinstance(g, Personnage), "Un coup sur trois doublé."
m = Mage("M", 10, 5, 1)
x, y, z = Personnage("X", 10, 0, 1), Personnage("Y", 1, 0, 1), Personnage("Z", 0, 0, 1)
m.agir([m], [x, y, z])
assert (x.pv, y.pv, z.pv) == (8, 0, 0) and Mage("m", 1, 1, 1).attaque // 2 == 0, "Le mage frappe tout le monde."
m2 = Mage("m", 5, 1, 1)
m2.agir([m2], [x])
assert x.pv == 7, "Au moins 1 dégât."
s = Soigneur("S", 10, 3, 1)
blesse, autre = Personnage("Bl", 20, 1, 1), Personnage("Au", 10, 1, 1)
blesse.subir(12)
s.agir([s, blesse, autre], [x])
assert blesse.pv == 14 and x.pv == 7, "Soin du plus blessé, sans attaque."
blesse.subir(10)
s.agir([s, blesse, autre], [x])
assert blesse.pv == 10 and x.pv == 7, "Soin de 6 points."
s.agir([s, blesse, autre], [x])
assert blesse.pv == 16 and x.pv == 7, "Exactement la moitié : encore soigné."
s.agir([s, blesse, autre], [x])
assert x.pv == 4, "Plus personne à soigner : le soigneur attaque."
e = Equipe("E", [Personnage("e1", 0, 1, 1), Personnage("e2", 3, 1, 1)])
assert [p.nom for p in e.vivants()] == ["e2"] and not e.vaincue(), "Vivants."
rapide = Equipe("Rapides", [Personnage("R", 5, 5, 9)])
lent = Equipe("Lents", [Personnage("L", 5, 100, 1)])
assert combat(lent, rapide, 10) == ("Rapides", 1), "Le plus rapide frappe d'abord et gagne."
e1 = Equipe("Renards", [Guerrier("Gus", 30, 5, 3), Soigneur("Sia", 20, 3, 2)])
e2 = Equipe("Loups", [Mage("Mia", 25, 6, 4), Personnage("Lou", 28, 4, 1)])
gagnant, tours = combat(e1, e2, 50)
assert gagnant in ("Renards", "Loups") and 1 <= tours <= 50, "Un combat d'équipes se termine."
assert e1.vaincue() != e2.vaincue() and (gagnant == "Renards") == e2.vaincue(), "L'équipe gagnante est celle qui reste debout."
e3 = Equipe("A", [Personnage("a", 10, 0, 1)])
e4 = Equipe("B", [Personnage("b", 10, 0, 1)])
assert combat(e3, e4, 7) == (None, 7), "Personne ne peut gagner : arrêt après max_tours."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
