---
title: Exercices POO
description: >-
  Exercices pratiques sur la POO. Création de classes, méthodes, héritage et
  encapsultation.
level: premiere
chapter: Programmation Orientée Objet
icon: "construction"
badgeId: premiere_exercices_poo
prerequisites:
  - poo_introduction
audience: public
groupe: poo
groupeTitre: "Programmation orientée objet"
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="premiere_exercices_poo" courseTitle="Exercices POO">

<ExerciseSection id="1nsi-poo-1-1" label="1.1 [Introduction] - Une première classe" type="python">
<Enonce>
### Une première classe

Écrire une classe `Renard` dont le constructeur reçoit un `nom` et un `age` et les range dans deux attributs du même nom.

Exemple : `r = Renard("Roux", 4)` donne `r.nom == "Roux"` et `r.age == 4`.

<Indices>
<Indice>

Le constructeur s'appelle `__init__` et reçoit toujours `self` en premier paramètre.

</Indice>
<Indice>

`self.nom = nom` crée l'attribut `nom` de l'objet.

</Indice>
<Indice>

```text
CLASSE Renard
    CONSTRUCTEUR(nom, age)
        self.nom ← nom
        self.age ← age
```

</Indice>
</Indices>

<Correction>

```python
class Renard:
    def __init__(self, nom: str, age: int):
        self.nom = nom
        self.age = age
```

</Correction>
</Enonce>
<Verification>

```python
r = Renard("Roux", 4)
assert r.nom == "Roux" and r.age == 4, "Les deux attributs sont rangés."
g = Renard("Goupil", 7)
assert g.nom == "Goupil" and r.nom == "Roux", "Chaque objet a ses propres attributs."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-1-2" label="1.2 [Introduction] - Une méthode" type="python">
<Enonce>
### Une méthode

Reprendre la classe `Renard` et lui ajouter une méthode `fiche()` qui renvoie le texte `"Roux, 4 ans"` pour le renard de l'exemple, et une méthode `anniversaire()` qui augmente son âge de 1.

<Indices>
<Indice>

Une méthode est une fonction définie dans la classe ; son premier paramètre est `self`.

</Indice>
<Indice>

Dans une méthode, les attributs se lisent et se modifient avec `self.age`.

</Indice>
<Indice>

```text
CLASSE Renard
    CONSTRUCTEUR(nom, age) : …
    MÉTHODE fiche() : RENVOYER self.nom + ", " + texte(self.age) + " ans"
    MÉTHODE anniversaire() : self.age ← self.age + 1
```

</Indice>
</Indices>

<Correction>

```python
class Renard:
    def __init__(self, nom: str, age: int):
        self.nom = nom
        self.age = age

    def fiche(self) -> str:
        return f"{self.nom}, {self.age} ans"

    def anniversaire(self) -> None:
        self.age = self.age + 1
```

</Correction>
</Enonce>
<Verification>

```python
r = Renard("Roux", 4)
assert r.fiche() == "Roux, 4 ans", "Fiche de Roux."
r.anniversaire()
r.anniversaire()
assert r.age == 6 and r.fiche() == "Roux, 6 ans", "Deux anniversaires : 6 ans."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-1-3" label="1.3 [Introduction] - Compteur" type="python">
<Enonce>
### Compteur

Écrire une classe `Compteur` :
- à la création, son attribut `valeur` vaut 0 ;
- `incrementer()` ajoute 1 ;
- `reinitialiser()` remet à 0.

<Indices>
<Indice>

Le constructeur n'a ici aucun paramètre en plus de `self`.

</Indice>
<Indice>

Chaque méthode modifie `self.valeur`.

</Indice>
<Indice>

```text
CLASSE Compteur
    CONSTRUCTEUR() : self.valeur ← 0
    MÉTHODE incrementer() : self.valeur ← self.valeur + 1
    MÉTHODE reinitialiser() : self.valeur ← 0
```

</Indice>
</Indices>

<Correction>

```python
class Compteur:
    def __init__(self):
        self.valeur = 0

    def incrementer(self) -> None:
        self.valeur = self.valeur + 1

    def reinitialiser(self) -> None:
        self.valeur = 0
```

</Correction>
</Enonce>
<Verification>

```python
c = Compteur()
assert c.valeur == 0, "Départ à 0."
for _ in range(3):
    c.incrementer()
assert c.valeur == 3, "Trois incréments."
autre = Compteur()
assert autre.valeur == 0, "Un autre compteur reste à 0."
c.reinitialiser()
assert c.valeur == 0, "Remise à zéro."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-1-4" label="1.4 [Introduction] - Rectangle" type="python">
<Enonce>
### Rectangle

Écrire une classe `Rectangle` construite avec une `largeur` et une `hauteur`, qui a deux méthodes : `aire()` et `perimetre()`.

<Indices>
<Indice>

Ranger les deux dimensions dans des attributs.

</Indice>
<Indice>

Les méthodes calculent à partir des attributs ; elles n'ont pas d'autre paramètre que `self`.

</Indice>
<Indice>

```text
CLASSE Rectangle
    CONSTRUCTEUR(largeur, hauteur) : ranger les deux attributs
    MÉTHODE aire() : RENVOYER self.largeur × self.hauteur
    MÉTHODE perimetre() : RENVOYER 2 × (self.largeur + self.hauteur)
```

</Indice>
</Indices>

<Correction>

```python
class Rectangle:
    def __init__(self, largeur: float, hauteur: float):
        self.largeur = largeur
        self.hauteur = hauteur

    def aire(self) -> float:
        return self.largeur * self.hauteur

    def perimetre(self) -> float:
        return 2 * (self.largeur + self.hauteur)
```

</Correction>
</Enonce>
<Verification>

```python
r = Rectangle(4, 3)
assert r.aire() == 12 and r.perimetre() == 14, "Rectangle 4 × 3."
c = Rectangle(2.5, 2.5)
assert c.aire() == 6.25 and c.perimetre() == 10, "Carré de côté 2,5."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-2-1" label="2.1 [Facile] - Distance entre deux points" type="python">
<Enonce>
### Distance entre deux points

Écrire une classe `Point` construite avec `x` et `y`, et une méthode `distance(autre)` qui renvoie la distance à un autre `Point`.

<Indices>
<Indice>

Le paramètre `autre` est lui aussi un objet `Point` : ses coordonnées sont `autre.x` et `autre.y`.

</Indice>
<Indice>

La distance est la racine de `(x2 - x1)² + (y2 - y1)²`.

</Indice>
<Indice>

```text
CLASSE Point
    CONSTRUCTEUR(x, y) : …
    MÉTHODE distance(autre)
        RENVOYER racine((autre.x - self.x)² + (autre.y - self.y)²)
```

</Indice>
</Indices>

<Correction>

```python
class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def distance(self, autre: "Point") -> float:
        return ((autre.x - self.x) ** 2 + (autre.y - self.y) ** 2) ** 0.5
```

</Correction>
</Enonce>
<Verification>

```python
a = Point(0, 0)
b = Point(3, 4)
assert a.distance(b) == 5 and b.distance(a) == 5, "De (0, 0) à (3, 4) : 5, dans les deux sens."
assert a.distance(a) == 0, "Un point et lui-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-2-2" label="2.2 [Facile] - Compte bancaire" type="python">
<Enonce>
### Compte bancaire

Écrire une classe `Compte` construite avec le nom du `titulaire` ; son `solde` part de 0.
- `deposer(montant)` ajoute le montant ;
- `retirer(montant)` retire le montant et renvoie `True` si le solde suffit ; sinon, elle ne change rien et renvoie `False`.

<Indices>
<Indice>

`retirer` commence par vérifier que le solde est suffisant.

</Indice>
<Indice>

Les deux méthodes modifient `self.solde`.

</Indice>
<Indice>

```text
CLASSE Compte
    CONSTRUCTEUR(titulaire) : self.titulaire ← titulaire ; self.solde ← 0
    MÉTHODE deposer(montant) : self.solde ← self.solde + montant
    MÉTHODE retirer(montant)
        SI montant > self.solde ALORS RENVOYER FAUX
        self.solde ← self.solde - montant ; RENVOYER VRAI
```

</Indice>
</Indices>

<Correction>

```python
class Compte:
    def __init__(self, titulaire: str):
        self.titulaire = titulaire
        self.solde = 0

    def deposer(self, montant: float) -> None:
        self.solde = self.solde + montant

    def retirer(self, montant: float) -> bool:
        if montant > self.solde:
            return False
        self.solde = self.solde - montant
        return True
```

</Correction>
</Enonce>
<Verification>

```python
c = Compte("Léa")
assert c.titulaire == "Léa" and c.solde == 0, "Compte ouvert à 0."
c.deposer(100)
assert c.retirer(30) is True and c.solde == 70, "Retrait accepté."
assert c.retirer(80) is False and c.solde == 70, "Retrait refusé, solde inchangé."
assert c.retirer(70) is True and c.solde == 0, "Retrait de tout le solde."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-2-3" label="2.3 [Facile] - Station météo" type="python">
<Enonce>
### Station météo

Écrire une classe `Station` qui enregistre des températures :
- à la création, son attribut `mesures` est une liste vide ;
- `ajouter(t)` enregistre une mesure ;
- `moyenne()` renvoie la moyenne arrondie au dixième, ou `None` sans mesure ;
- `ecart()` renvoie l'écart entre la plus haute et la plus basse mesure (0 sans mesure).

<Indices>
<Indice>

Un attribut peut être une liste : `self.mesures = []` dans le constructeur.

</Indice>
<Indice>

Attention : la liste doit être créée dans `__init__`, pour que chaque station ait la sienne.

</Indice>
<Indice>

```text
CLASSE Station
    CONSTRUCTEUR() : self.mesures ← liste vide
    MÉTHODE ajouter(t) : ajouter t à self.mesures
    MÉTHODE moyenne() : None si vide, sinon arrondi(somme / nombre, 1)
    MÉTHODE ecart() : 0 si vide, sinon max - min
```

</Indice>
</Indices>

<Correction>

```python
class Station:
    def __init__(self):
        self.mesures = []

    def ajouter(self, t: float) -> None:
        self.mesures.append(t)

    def moyenne(self):
        if not self.mesures:
            return None
        return round(sum(self.mesures) / len(self.mesures), 1)

    def ecart(self) -> float:
        if not self.mesures:
            return 0
        return max(self.mesures) - min(self.mesures)
```

</Correction>
</Enonce>
<Verification>

```python
s = Station()
assert s.moyenne() is None and s.ecart() == 0, "Sans mesure."
for t in [12, 18, 15, 9]:
    s.ajouter(t)
assert s.moyenne() == 13.5 and s.ecart() == 9, "Moyenne 13,5, écart 9."
autre = Station()
assert autre.mesures == [], "Une autre station a sa propre liste, vide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-2-4" label="2.4 [Facile] - Horloge" type="python">
<Enonce>
### Horloge

Écrire une classe `Horloge` construite avec `h` et `m` (heures et minutes), qui a :
- une méthode `avancer(minutes)` qui avance l'heure, en revenant à 0 h après 23 h 59 ;
- une méthode spéciale `__str__` qui renvoie l'heure sous la forme `"07:05"`. Ainsi, `str(horloge)` et `print(horloge)` affichent l'heure.

<Indices>
<Indice>

Pour avancer, passer par le nombre total de minutes depuis minuit, puis revenir aux heures et minutes avec `//` et `%`.

</Indice>
<Indice>

`f"{self.h:02d}"` écrit un nombre sur deux chiffres.

</Indice>
<Indice>

```text
CLASSE Horloge
    CONSTRUCTEUR(h, m) : …
    MÉTHODE avancer(minutes)
        total ← reste de (self.h × 60 + self.m + minutes) par 1440
        self.h ← total // 60 ; self.m ← reste de total par 60
    MÉTHODE __str__() : RENVOYER h et m sur deux chiffres, séparés par ":"
```

</Indice>
</Indices>

<Correction>

```python
class Horloge:
    def __init__(self, h: int, m: int):
        self.h = h
        self.m = m

    def avancer(self, minutes: int) -> None:
        total = (self.h * 60 + self.m + minutes) % 1440
        self.h = total // 60
        self.m = total % 60

    def __str__(self) -> str:
        return f"{self.h:02d}:{self.m:02d}"
```

</Correction>
</Enonce>
<Verification>

```python
h = Horloge(7, 5)
assert str(h) == "07:05", "Affichage de 7 h 05."
h.avancer(70)
assert (h.h, h.m) == (8, 15) and str(h) == "08:15", "70 minutes plus tard."
h = Horloge(23, 50)
h.avancer(20)
assert str(h) == "00:10", "Passage de minuit."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-3-1" label="3.1 [Moyen] - Fraction" type="python">
<Enonce>
### Fraction

Écrire une classe `Fraction` construite avec un numérateur `num` et un dénominateur `den` (non nul), qui :
- est **toujours simplifiée** dès sa création, avec un dénominateur positif (`Fraction(6, -8)` a pour attributs `num = -3` et `den = 4`) ;
- a une méthode `plus(autre)` qui renvoie une **nouvelle** `Fraction`, somme des deux ;
- a une méthode `__str__` qui renvoie `"-3/4"`, ou seulement `"2"` si le dénominateur vaut 1.

<Indices>
<Indice>

Pour simplifier, diviser numérateur et dénominateur par leur PGCD (`from math import gcd`).

</Indice>
<Indice>

Si le dénominateur est négatif, changer le signe des deux.

</Indice>
<Indice>

`a/b + c/d = (a × d + c × b) / (b × d)` : le constructeur simplifiera le résultat.

</Indice>
<Indice>

```text
CLASSE Fraction
    CONSTRUCTEUR(num, den)
        SI den < 0 ALORS num ← -num ; den ← -den
        g ← pgcd(num, den)
        self.num ← num // g ; self.den ← den // g
    MÉTHODE plus(autre)
        RENVOYER Fraction(self.num × autre.den + autre.num × self.den, self.den × autre.den)
    MÉTHODE __str__() : "num" si den = 1, sinon "num/den"
```

</Indice>
</Indices>

<Correction>

```python
from math import gcd


class Fraction:
    def __init__(self, num: int, den: int):
        if den < 0:
            num, den = -num, -den
        g = gcd(num, den)
        self.num = num // g
        self.den = den // g

    def plus(self, autre: "Fraction") -> "Fraction":
        return Fraction(self.num * autre.den + autre.num * self.den, self.den * autre.den)

    def __str__(self) -> str:
        if self.den == 1:
            return str(self.num)
        return f"{self.num}/{self.den}"
```

</Correction>
</Enonce>
<Verification>

```python
f = Fraction(6, -8)
assert (f.num, f.den) == (-3, 4) and str(f) == "-3/4", "6/-8 se simplifie en -3/4."
s = Fraction(1, 2).plus(Fraction(1, 3))
assert (s.num, s.den) == (5, 6), "1/2 + 1/3 = 5/6."
assert str(Fraction(3, 4).plus(Fraction(5, 4))) == "2", "3/4 + 5/4 = 2."
assert str(Fraction(0, 5)) == "0", "0/5 s'affiche 0."
a = Fraction(1, 2)
a.plus(Fraction(1, 2))
assert (a.num, a.den) == (1, 2), "plus ne modifie pas la fraction de départ."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-3-2" label="3.2 [Moyen] - Panier d'achats" type="python">
<Enonce>
### Panier d'achats

Écrire une classe `Panier` dont l'attribut `articles` est un dictionnaire nom → `(prix, quantite)`.
- `ajouter(nom, prix, quantite)` ajoute l'article, ou augmente sa quantité s'il est déjà là ;
- `retirer(nom)` enlève complètement l'article (sans erreur s'il est absent) ;
- `total()` renvoie le prix total, arrondi au centime ;
- `nb_objets()` renvoie le nombre total d'objets.

<Indices>
<Indice>

Un tuple ne se modifie pas : pour augmenter une quantité, remplacer le tuple entier.

</Indice>
<Indice>

`dict.pop(cle, None)` retire une clé sans erreur si elle est absente.

</Indice>
<Indice>

```text
CLASSE Panier
    CONSTRUCTEUR() : self.articles ← dictionnaire vide
    MÉTHODE ajouter(nom, prix, quantite)
        SI nom ∈ self.articles ALORS quantite ← quantite + ancienne quantité
        self.articles[nom] ← (prix, quantite)
    MÉTHODE retirer(nom) : supprimer nom s'il est présent
    MÉTHODE total() : arrondi(somme des prix × quantités, 2)
    MÉTHODE nb_objets() : somme des quantités
```

</Indice>
</Indices>

<Correction>

```python
class Panier:
    def __init__(self):
        self.articles = {}

    def ajouter(self, nom: str, prix: float, quantite: int) -> None:
        if nom in self.articles:
            quantite = quantite + self.articles[nom][1]
        self.articles[nom] = (prix, quantite)

    def retirer(self, nom: str) -> None:
        self.articles.pop(nom, None)

    def total(self) -> float:
        return round(sum(p * q for p, q in self.articles.values()), 2)

    def nb_objets(self) -> int:
        return sum(q for p, q in self.articles.values())
```

</Correction>
</Enonce>
<Verification>

```python
p = Panier()
p.ajouter("pomme", 0.35, 6)
p.ajouter("pain", 1.2, 1)
p.ajouter("pomme", 0.35, 4)
assert p.articles["pomme"] == (0.35, 10) and p.nb_objets() == 11, "Les pommes s'additionnent."
assert p.total() == 4.7, "Total : 4,70 €."
p.retirer("pain")
p.retirer("lait")
assert p.total() == 3.5 and p.nb_objets() == 10, "Le pain est retiré ; le lait absent ne pose pas de problème."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-3-3" label="3.3 [Moyen] - Pile" type="python">
<Enonce>
### Pile

Une **pile** range des éléments les uns sur les autres : on ne peut ajouter ou retirer qu'au sommet (comme une pile d'assiettes).

Écrire une classe `Pile` avec les méthodes `empiler(x)`, `depiler()` (retire et renvoie le sommet, ou `None` si la pile est vide), `sommet()` (renvoie le sommet sans le retirer, ou `None`), `est_vide()` et `taille()`.

<Indices>
<Indice>

Une liste Python rangée dans un attribut suffit : le sommet est son dernier élément.

</Indice>
<Indice>

`liste.pop()` retire et renvoie le dernier élément.

</Indice>
<Indice>

```text
CLASSE Pile
    CONSTRUCTEUR() : self.elements ← liste vide
    MÉTHODE empiler(x) : ajouter x à la fin
    MÉTHODE depiler() : None si vide, sinon retirer et renvoyer le dernier
    MÉTHODE sommet() : None si vide, sinon le dernier
    MÉTHODE est_vide() : longueur = 0
    MÉTHODE taille() : longueur
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def empiler(self, x) -> None:
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            return None
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            return None
        return self.elements[-1]

    def est_vide(self) -> bool:
        return len(self.elements) == 0

    def taille(self) -> int:
        return len(self.elements)
```

</Correction>
</Enonce>
<Verification>

```python
p = Pile()
assert p.est_vide() is True and p.depiler() is None and p.sommet() is None, "Pile vide."
for x in [1, 2, 3]:
    p.empiler(x)
assert p.taille() == 3 and p.sommet() == 3, "Sommet 3, taille 3."
assert p.depiler() == 3 and p.depiler() == 2 and p.taille() == 1, "Dernier entré, premier sorti."
assert p.est_vide() is False, "Il reste un élément."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-3-4" label="3.4 [Moyen] - Vecteur" type="python">
<Enonce>
### Vecteur

Écrire une classe `Vecteur` construite avec `x` et `y`, avec les méthodes :
- `somme(autre)` : renvoie un **nouveau** vecteur, somme des deux ;
- `fois(k)` : renvoie un nouveau vecteur multiplié par le nombre `k` ;
- `scalaire(autre)` : renvoie le produit scalaire `x × x' + y × y'` ;
- `norme()` : renvoie la longueur du vecteur.

<Indices>
<Indice>

`somme` et `fois` construisent un objet avec `Vecteur(…, …)` et le renvoient.

</Indice>
<Indice>

La norme est la racine du produit scalaire du vecteur avec lui-même.

</Indice>
<Indice>

```text
CLASSE Vecteur
    MÉTHODE somme(autre) : RENVOYER Vecteur(self.x + autre.x, self.y + autre.y)
    MÉTHODE fois(k) : RENVOYER Vecteur(k × self.x, k × self.y)
    MÉTHODE scalaire(autre) : RENVOYER self.x × autre.x + self.y × autre.y
    MÉTHODE norme() : RENVOYER racine(self.scalaire(self))
```

</Indice>
</Indices>

<Correction>

```python
class Vecteur:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

    def somme(self, autre: "Vecteur") -> "Vecteur":
        return Vecteur(self.x + autre.x, self.y + autre.y)

    def fois(self, k: float) -> "Vecteur":
        return Vecteur(k * self.x, k * self.y)

    def scalaire(self, autre: "Vecteur") -> float:
        return self.x * autre.x + self.y * autre.y

    def norme(self) -> float:
        return self.scalaire(self) ** 0.5
```

</Correction>
</Enonce>
<Verification>

```python
u = Vecteur(1, 2)
v = Vecteur(3, -1)
w = u.somme(v)
assert (w.x, w.y) == (4, 1) and (u.x, u.y) == (1, 2), "u + v = (4, 1), u ne change pas."
f = u.fois(3)
assert (f.x, f.y) == (3, 6), "3u = (3, 6)."
assert u.scalaire(v) == 1 and Vecteur(3, 4).norme() == 5, "Produit scalaire et norme."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-4-1" label="4.1 [Difficile] - Médiathèque" type="python">
<Enonce>
### Médiathèque

Une médiathèque contient des livres. Écrire :
- une classe `Livre` construite avec un `titre` et un `auteur`, avec un attribut `emprunte` qui vaut `False` au départ ;
- une classe `Mediatheque` dont l'attribut `livres` est une liste de `Livre`, avec les méthodes `ajouter(livre)`, `emprunter(titre)` (renvoie `True` si le livre existe et était disponible, et le marque emprunté), `rendre(titre)` et `disponibles()` (liste triée des titres disponibles).

<Indices>
<Indice>

La médiathèque **contient** des objets `Livre` : c'est la composition. Ses méthodes parcourent `self.livres`.

</Indice>
<Indice>

Une méthode auxiliaire `chercher(titre)` qui renvoie le `Livre` ou `None` évite de répéter la recherche.

</Indice>
<Indice>

```text
CLASSE Livre : titre, auteur, emprunte ← FAUX
CLASSE Mediatheque
    CONSTRUCTEUR() : self.livres ← liste vide
    MÉTHODE chercher(titre) : le livre de ce titre, ou None
    MÉTHODE emprunter(titre)
        l ← chercher(titre)
        SI l = None OU l.emprunte ALORS RENVOYER FAUX
        l.emprunte ← VRAI ; RENVOYER VRAI
    MÉTHODE rendre(titre) : marquer le livre comme non emprunté
    MÉTHODE disponibles() : titres triés des livres non empruntés
```

</Indice>
</Indices>

<Correction>

```python
class Livre:
    def __init__(self, titre: str, auteur: str):
        self.titre = titre
        self.auteur = auteur
        self.emprunte = False


class Mediatheque:
    def __init__(self):
        self.livres = []

    def ajouter(self, livre: Livre) -> None:
        self.livres.append(livre)

    def chercher(self, titre: str):
        for livre in self.livres:
            if livre.titre == titre:
                return livre
        return None

    def emprunter(self, titre: str) -> bool:
        livre = self.chercher(titre)
        if livre is None or livre.emprunte:
            return False
        livre.emprunte = True
        return True

    def rendre(self, titre: str) -> None:
        livre = self.chercher(titre)
        if livre is not None:
            livre.emprunte = False

    def disponibles(self) -> list:
        return sorted(l.titre for l in self.livres if not l.emprunte)
```

</Correction>
</Enonce>
<Verification>

```python
m = Mediatheque()
for t, a in [("Dune", "Herbert"), ("Candide", "Voltaire"), ("Ubik", "Dick")]:
    m.ajouter(Livre(t, a))
assert m.disponibles() == ["Candide", "Dune", "Ubik"], "Trois livres disponibles, triés."
assert m.emprunter("Dune") is True and m.emprunter("Dune") is False, "Dune ne s'emprunte qu'une fois."
assert m.emprunter("Zadig") is False, "Livre absent."
assert m.disponibles() == ["Candide", "Ubik"], "Dune n'est plus disponible."
m.rendre("Dune")
assert "Dune" in m.disponibles() and m.livres[0].emprunte is False, "Dune est rendu."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-4-2" label="4.2 [Difficile] - Morpion" type="python">
<Enonce>
### Morpion

Écrire une classe `Morpion` :
- à la création, `grille` est une liste de 3 listes de 3 cases `" "`, et `joueur` vaut `"X"` ;
- `jouer(l, c)` place le symbole du joueur courant si la case est libre, passe la main à l'autre joueur et renvoie `True` ; sinon, elle renvoie `False` sans rien changer ;
- `gagnant()` renvoie `"X"`, `"O"` ou `None`.

<Indices>
<Indice>

Passer la main : `"O" if self.joueur == "X" else "X"`.

</Indice>
<Indice>

Pour `gagnant`, lister les 8 alignements (3 lignes, 3 colonnes, 2 diagonales) et chercher trois cases égales et non vides.

</Indice>
<Indice>

```text
CLASSE Morpion
    CONSTRUCTEUR() : grille 3 × 3 de " " ; joueur ← "X"
    MÉTHODE jouer(l, c)
        SI grille[l][c] ≠ " " ALORS RENVOYER FAUX
        grille[l][c] ← joueur ; changer de joueur ; RENVOYER VRAI
    MÉTHODE gagnant()
        POUR CHAQUE alignement : SI trois cases égales et non vides ALORS RENVOYER ce symbole
        RENVOYER None
```

</Indice>
</Indices>

<Correction>

```python
class Morpion:
    def __init__(self):
        self.grille = [[" "] * 3 for _ in range(3)]
        self.joueur = "X"

    def jouer(self, l: int, c: int) -> bool:
        if self.grille[l][c] != " ":
            return False
        self.grille[l][c] = self.joueur
        self.joueur = "O" if self.joueur == "X" else "X"
        return True

    def gagnant(self):
        g = self.grille
        lignes = [g[i] for i in range(3)]
        lignes += [[g[0][i], g[1][i], g[2][i]] for i in range(3)]
        lignes += [[g[0][0], g[1][1], g[2][2]], [g[0][2], g[1][1], g[2][0]]]
        for a, b, c in lignes:
            if a == b == c and a != " ":
                return a
        return None
```

</Correction>
</Enonce>
<Verification>

```python
m = Morpion()
assert m.jouer(1, 1) is True and m.grille[1][1] == "X" and m.joueur == "O", "X joue au centre, puis c'est à O."
assert m.jouer(1, 1) is False and m.joueur == "O", "Case occupée : refus, toujours à O."
for l, c in [(0, 0), (0, 2), (2, 2), (2, 0)]:
    m.jouer(l, c)
assert m.gagnant() == "X", "X aligne la diagonale (0, 2), (1, 1), (2, 0)."
assert Morpion().gagnant() is None, "Grille vide : aucun gagnant."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-4-3" label="4.3 [Difficile] - Premier héritage" type="python">
<Enonce>
### Premier héritage

Écrire une classe `Animal` construite avec un `nom`, avec une méthode `cri()` qui renvoie `"..."` et une méthode `presenter()` qui renvoie par exemple `"Rex dit Wouf"` (le nom, « dit », puis le cri).

Écrire ensuite deux classes **filles** `Chien` et `Chat`, qui héritent d'`Animal` et redéfinissent seulement `cri()` : `"Wouf"` et `"Miaou"`.

<Indices>
<Indice>

`class Chien(Animal):` crée une classe qui hérite de tout ce que fait `Animal`, constructeur compris.

</Indice>
<Indice>

Dans `presenter`, appeler `self.cri()` : pour un chien, c'est la version de `Chien` qui sera utilisée.

</Indice>
<Indice>

```text
CLASSE Animal
    CONSTRUCTEUR(nom) : self.nom ← nom
    MÉTHODE cri() : RENVOYER "..."
    MÉTHODE presenter() : RENVOYER self.nom + " dit " + self.cri()
CLASSE Chien HÉRITE DE Animal
    MÉTHODE cri() : RENVOYER "Wouf"
CLASSE Chat HÉRITE DE Animal
    MÉTHODE cri() : RENVOYER "Miaou"
```

</Indice>
</Indices>

<Correction>

```python
class Animal:
    def __init__(self, nom: str):
        self.nom = nom

    def cri(self) -> str:
        return "..."

    def presenter(self) -> str:
        return self.nom + " dit " + self.cri()


class Chien(Animal):
    def cri(self) -> str:
        return "Wouf"


class Chat(Animal):
    def cri(self) -> str:
        return "Miaou"
```

</Correction>
</Enonce>
<Verification>

```python
assert Chien("Rex").presenter() == "Rex dit Wouf" and Chat("Tom").presenter() == "Tom dit Miaou", "Chacun son cri."
assert Animal("Roux").presenter() == "Roux dit ...", "Un animal quelconque."
assert isinstance(Chien("Rex"), Animal), "Un chien est un animal."
assert "presenter" not in Chien.__dict__ and "__init__" not in Chat.__dict__, "Les classes filles ne redéfinissent que cri."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-4-4" label="4.4 [Difficile] - Comparer des dates" type="python">
<Enonce>
### Comparer des dates

Écrire une classe `Date` construite avec `jour`, `mois` et `annee`, avec :
- `avant(autre)` : `True` si la date est strictement antérieure à `autre` ;
- `jours_depuis_debut()` : le numéro du jour dans l'année (1 pour le 1er janvier), en tenant compte des années bissextiles ;
- `__str__` : `"05/03/2026"`.

<Indices>
<Indice>

Pour comparer, l'année décide d'abord, puis le mois, puis le jour. Comparer des tuples `(annee, mois, jour)` fait exactement cela.

</Indice>
<Indice>

Pour le numéro du jour, additionner la longueur des mois qui précèdent, puis ajouter le jour.

</Indice>
<Indice>

```text
CLASSE Date
    MÉTHODE avant(autre) : RENVOYER (annee, mois, jour) < (autre.annee, autre.mois, autre.jour)
    MÉTHODE jours_depuis_debut()
        longueurs ← [31, 28 ou 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        RENVOYER somme des longueurs des mois avant self.mois + self.jour
    MÉTHODE __str__() : jour/mois/annee sur 2, 2 et 4 chiffres
```

</Indice>
</Indices>

<Correction>

```python
class Date:
    def __init__(self, jour: int, mois: int, annee: int):
        self.jour = jour
        self.mois = mois
        self.annee = annee

    def avant(self, autre: "Date") -> bool:
        return (self.annee, self.mois, self.jour) < (autre.annee, autre.mois, autre.jour)

    def bissextile(self) -> bool:
        a = self.annee
        return (a % 4 == 0 and a % 100 != 0) or a % 400 == 0

    def jours_depuis_debut(self) -> int:
        longueurs = [31, 29 if self.bissextile() else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
        return sum(longueurs[:self.mois - 1]) + self.jour

    def __str__(self) -> str:
        return f"{self.jour:02d}/{self.mois:02d}/{self.annee:04d}"
```

</Correction>
</Enonce>
<Verification>

```python
a = Date(5, 3, 2026)
assert str(a) == "05/03/2026", "Affichage."
assert a.avant(Date(6, 3, 2026)) is True and a.avant(Date(1, 1, 2026)) is False and a.avant(a) is False, "Comparaisons."
assert Date(31, 12, 2025).avant(Date(1, 1, 2026)) is True, "L'année décide d'abord."
assert Date(1, 1, 2026).jours_depuis_debut() == 1 and a.jours_depuis_debut() == 64, "1er janvier et 5 mars 2026."
assert Date(5, 3, 2024).jours_depuis_debut() == 65 and Date(31, 12, 2024).jours_depuis_debut() == 366, "Année bissextile."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-5-1" label="5.1 [Expert] - Polynôme" type="python">
<Enonce>
### Polynôme

Un polynôme est représenté par la liste de ses coefficients, du degré 0 au plus haut : `[1, 0, 3]` représente `1 + 3x²`.

Écrire une classe `Polynome` construite avec cette liste, avec :
- `valeur(x)` : la valeur du polynôme en `x` ;
- `plus(autre)` : un nouveau polynôme, somme des deux (les listes peuvent avoir des longueurs différentes) ;
- `derivee()` : un nouveau polynôme, la dérivée (`[1, 0, 3]` donne `[0, 6]`) ;
- `__str__` : par exemple `"3x^2 + 1"` (termes non nuls, du plus haut degré au plus bas, `x` pour le degré 1), ou `"0"`.

À la création, les zéros inutiles en fin de liste sont retirés.

<Indices>
<Indice>

Pour la somme, compléter la liste la plus courte par des zéros, ou parcourir jusqu'à la plus grande longueur en lisant 0 hors liste.

</Indice>
<Indice>

La dérivée de `c × xⁱ` est `i × c × xⁱ⁻¹` : le coefficient d'indice `i` donne `i × c` à l'indice `i - 1`.

</Indice>
<Indice>

Pour l'affichage, construire la liste des morceaux (`"3x^2"`, `"x"`, `"1"`…) puis les joindre avec `" + "`.

</Indice>
<Indice>

```text
CLASSE Polynome
    CONSTRUCTEUR(coefs) : copier coefs sans les zéros finaux
    MÉTHODE valeur(x) : somme des coefs[i] × xⁱ
    MÉTHODE plus(autre) : coefficient i = (coefs[i] ou 0) + (autre.coefs[i] ou 0)
    MÉTHODE derivee() : [i × coefs[i] pour i de 1 à la fin]
    MÉTHODE __str__()
        morceaux ← pour i du plus haut au plus bas, si coefs[i] ≠ 0 : "c", "cx" ou "cx^i"
        RENVOYER morceaux joints par " + ", ou "0"
```

</Indice>
</Indices>

<Correction>

```python
class Polynome:
    def __init__(self, coefs: list):
        coefs = list(coefs)
        while coefs and coefs[-1] == 0:
            coefs.pop()
        self.coefs = coefs

    def valeur(self, x: float) -> float:
        return sum(c * x ** i for i, c in enumerate(self.coefs))

    def plus(self, autre: "Polynome") -> "Polynome":
        n = max(len(self.coefs), len(autre.coefs))
        a = self.coefs + [0] * (n - len(self.coefs))
        b = autre.coefs + [0] * (n - len(autre.coefs))
        return Polynome([a[i] + b[i] for i in range(n)])

    def derivee(self) -> "Polynome":
        return Polynome([i * self.coefs[i] for i in range(1, len(self.coefs))])

    def __str__(self) -> str:
        morceaux = []
        for i in range(len(self.coefs) - 1, -1, -1):
            c = self.coefs[i]
            if c == 0:
                continue
            if i == 0:
                morceaux.append(str(c))
            elif i == 1:
                morceaux.append(f"{c}x")
            else:
                morceaux.append(f"{c}x^{i}")
        return " + ".join(morceaux) if morceaux else "0"
```

</Correction>
</Enonce>
<Verification>

```python
p = Polynome([1, 0, 3])
assert p.valeur(2) == 13 and p.valeur(0) == 1, "1 + 3x² en 2 et en 0."
assert Polynome([1, 2, 0, 0]).coefs == [1, 2], "Zéros finaux retirés."
assert p.plus(Polynome([4, 5])).coefs == [5, 5, 3], "Somme de longueurs différentes."
assert p.plus(Polynome([0, 0, -3])).coefs == [1], "Les termes qui s'annulent disparaissent."
assert p.derivee().coefs == [0, 6] and Polynome([7]).derivee().coefs == [], "Dérivées."
assert str(p) == "3x^2 + 1" and str(Polynome([0, 2, 0, 5])) == "5x^3 + 2x" and str(Polynome([])) == "0", "Affichages."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-5-2" label="5.2 [Expert] - Liste chaînée" type="python">
<Enonce>
### Liste chaînée

Une **liste chaînée** est une suite de maillons : chaque maillon contient une valeur et une référence vers le maillon suivant (`None` pour le dernier).

Écrire :
- une classe `Maillon` construite avec `valeur` et `suivant` ;
- une classe `ListeChainee` dont l'attribut `tete` (premier maillon) vaut `None` au départ, avec les méthodes `ajouter_debut(x)`, `taille()`, `contient(x)`, `vers_liste()` (une liste Python des valeurs, dans l'ordre) et `ajouter_fin(x)`.

Contrainte : sans liste Python pour stocker les éléments.

<Indices>
<Indice>

Ajouter au début : le nouveau maillon a pour suivant l'ancienne tête, et devient la tête.

</Indice>
<Indice>

Parcourir : partir de `m = self.tete` et avancer avec `m = m.suivant` tant que `m` n'est pas `None`.

</Indice>
<Indice>

Ajouter à la fin d'une liste vide est un cas à part : le nouveau maillon devient la tête.

</Indice>
<Indice>

```text
CLASSE Maillon : valeur, suivant
CLASSE ListeChainee
    CONSTRUCTEUR() : self.tete ← None
    MÉTHODE ajouter_debut(x) : self.tete ← Maillon(x, self.tete)
    MÉTHODE taille() : compter les maillons en parcourant depuis la tête
    MÉTHODE contient(x) : parcourir, VRAI si une valeur vaut x
    MÉTHODE vers_liste() : parcourir en ajoutant chaque valeur
    MÉTHODE ajouter_fin(x)
        SI tete = None ALORS tete ← Maillon(x, None)
        SINON aller jusqu'au dernier maillon m ; m.suivant ← Maillon(x, None)
```

</Indice>
</Indices>

<Correction>

```python
class Maillon:
    def __init__(self, valeur, suivant):
        self.valeur = valeur
        self.suivant = suivant


class ListeChainee:
    def __init__(self):
        self.tete = None

    def ajouter_debut(self, x) -> None:
        self.tete = Maillon(x, self.tete)

    def taille(self) -> int:
        n = 0
        m = self.tete
        while m is not None:
            n = n + 1
            m = m.suivant
        return n

    def contient(self, x) -> bool:
        m = self.tete
        while m is not None:
            if m.valeur == x:
                return True
            m = m.suivant
        return False

    def vers_liste(self) -> list:
        valeurs = []
        m = self.tete
        while m is not None:
            valeurs.append(m.valeur)
            m = m.suivant
        return valeurs

    def ajouter_fin(self, x) -> None:
        if self.tete is None:
            self.tete = Maillon(x, None)
            return
        m = self.tete
        while m.suivant is not None:
            m = m.suivant
        m.suivant = Maillon(x, None)
```

</Correction>
</Enonce>
<Verification>

```python
l = ListeChainee()
assert l.tete is None and l.taille() == 0 and l.vers_liste() == [], "Liste vide."
l.ajouter_fin(5)
l.ajouter_debut(2)
l.ajouter_debut(1)
l.ajouter_fin(9)
assert l.vers_liste() == [1, 2, 5, 9] and l.taille() == 4, "Ajouts au début et à la fin."
assert l.contient(5) is True and l.contient(7) is False, "Recherche."
assert isinstance(l.tete, Maillon) and l.tete.valeur == 1 and l.tete.suivant.valeur == 2, "Les maillons sont reliés."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-5-3" label="5.3 [Expert] - Sac d'aventurier" type="python">
<Enonce>
### Sac d'aventurier

Dans un jeu, le sac d'un aventurier a un **poids maximal**. Un objet est décrit par un nom et un poids ; plusieurs objets de même nom s'empilent.

Écrire une classe `Sac` construite avec `poids_max`, avec :
- `ajouter(nom, poids_unitaire, quantite)` : ajoute les objets si le poids total le permet et renvoie `True`, sinon ne change rien et renvoie `False` ;
- `retirer(nom, quantite)` : retire au plus la quantité possédée et renvoie le nombre réellement retiré ; un objet dont la quantité tombe à 0 disparaît du sac ;
- `poids()` : le poids total ;
- `contenu()` : la liste triée des tuples `(nom, quantite)`.

<Indices>
<Indice>

Un dictionnaire nom → `[poids_unitaire, quantite]` (une liste, modifiable) est pratique.

</Indice>
<Indice>

Avant d'ajouter, comparer `self.poids() + poids_unitaire × quantite` à `poids_max`.

</Indice>
<Indice>

```text
CLASSE Sac
    CONSTRUCTEUR(poids_max) : self.objets ← dictionnaire vide
    MÉTHODE poids() : somme des poids × quantités
    MÉTHODE ajouter(nom, p, q)
        SI poids() + p × q > poids_max ALORS RENVOYER FAUX
        augmenter (ou créer) l'entrée nom ; RENVOYER VRAI
    MÉTHODE retirer(nom, q)
        r ← min(q, quantité possédée (0 si absent)) ; diminuer ; supprimer si 0 ; RENVOYER r
    MÉTHODE contenu() : liste triée des (nom, quantité)
```

</Indice>
</Indices>

<Correction>

```python
class Sac:
    def __init__(self, poids_max: float):
        self.poids_max = poids_max
        self.objets = {}

    def poids(self) -> float:
        return sum(p * q for p, q in self.objets.values())

    def ajouter(self, nom: str, poids_unitaire: float, quantite: int) -> bool:
        if self.poids() + poids_unitaire * quantite > self.poids_max:
            return False
        if nom in self.objets:
            self.objets[nom][1] = self.objets[nom][1] + quantite
        else:
            self.objets[nom] = [poids_unitaire, quantite]
        return True

    def retirer(self, nom: str, quantite: int) -> int:
        if nom not in self.objets:
            return 0
        r = min(quantite, self.objets[nom][1])
        self.objets[nom][1] = self.objets[nom][1] - r
        if self.objets[nom][1] == 0:
            del self.objets[nom]
        return r

    def contenu(self) -> list:
        return sorted((nom, v[1]) for nom, v in self.objets.items())
```

</Correction>
</Enonce>
<Verification>

```python
s = Sac(10)
assert s.ajouter("potion", 0.5, 4) is True and s.ajouter("épée", 3, 1) is True, "Potions et épée."
assert s.poids() == 5 and s.ajouter("armure", 6, 1) is False and s.poids() == 5, "L'armure ne rentre pas, rien ne change."
assert s.ajouter("potion", 0.5, 2) is True and s.contenu() == [("potion", 6), ("épée", 1)], "Les potions s'empilent."
assert s.retirer("potion", 10) == 6 and s.contenu() == [("épée", 1)], "On ne retire que ce qu'on a ; l'objet disparaît."
assert s.retirer("arc", 1) == 0, "Objet absent : 0."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-5-4" label="5.4 [Expert] - Ascenseur" type="python">
<Enonce>
### Ascenseur

Un ascenseur dessert les étages 0 à `n`. Il répond aux appels **dans l'ordre où ils arrivent**, un étage à la fois.

Écrire une classe `Ascenseur` construite avec `n` (l'étage courant vaut 0), avec :
- `appeler(etage)` : ajoute un appel (ignoré s'il est hors limites ou identique au dernier appel en attente) ;
- `etape()` : déplace l'ascenseur d'**un** étage vers le premier appel en attente ; arrivé à cet étage, l'appel est retiré. Sans appel, rien ne se passe ;
- `trajet()` : effectue des étapes jusqu'à ce qu'il n'y ait plus d'appel et renvoie la liste des étages traversés, étage de départ compris.

<Indices>
<Indice>

Les appels en attente forment une file : une liste où l'on ajoute à la fin et retire au début.

</Indice>
<Indice>

Dans `etape`, comparer l'étage courant au premier appel pour savoir s'il faut monter ou descendre ; puis, si l'étage atteint est celui de l'appel, le retirer.

</Indice>
<Indice>

Un appel à l'étage où se trouve déjà l'ascenseur se retire sans déplacement.

</Indice>
<Indice>

```text
CLASSE Ascenseur
    CONSTRUCTEUR(n) : self.n ← n ; self.etage ← 0 ; self.appels ← liste vide
    MÉTHODE appeler(e) : SI 0 ≤ e ≤ n ET (appels vide OU dernier appel ≠ e) ALORS ajouter e
    MÉTHODE etape()
        SI appels vide ALORS RENVOYER
        SI etage < appels[0] ALORS etage ← etage + 1
        SINON SI etage > appels[0] ALORS etage ← etage - 1
        SI etage = appels[0] ALORS retirer le premier appel
    MÉTHODE trajet()
        etages ← [etage]
        TANT QUE appels non vide : etape() ; SI l'étage a changé ALORS ajouter etage
        RENVOYER etages
```

</Indice>
</Indices>

<Correction>

```python
class Ascenseur:
    def __init__(self, n: int):
        self.n = n
        self.etage = 0
        self.appels = []

    def appeler(self, etage: int) -> None:
        if 0 <= etage <= self.n and (not self.appels or self.appels[-1] != etage):
            self.appels.append(etage)

    def etape(self) -> None:
        if not self.appels:
            return
        if self.etage < self.appels[0]:
            self.etage = self.etage + 1
        elif self.etage > self.appels[0]:
            self.etage = self.etage - 1
        if self.etage == self.appels[0]:
            self.appels.pop(0)

    def trajet(self) -> list:
        etages = [self.etage]
        while self.appels:
            avant = self.etage
            self.etape()
            if self.etage != avant:
                etages.append(self.etage)
        return etages
```

</Correction>
</Enonce>
<Verification>

```python
a = Ascenseur(5)
a.appeler(3)
a.appeler(1)
a.appeler(9)
a.appeler(1)
assert a.appels == [3, 1], "L'appel hors limites et le doublon sont ignorés."
a.etape()
assert a.etage == 1 and a.appels == [3, 1], "Une étape : un étage vers 3."
assert a.trajet() == [1, 2, 3, 2, 1] and a.appels == [], "Monte à 3, redescend à 1."
b = Ascenseur(4)
b.appeler(0)
assert b.trajet() == [0] and b.appels == [], "Appel à l'étage courant : servi sans bouger."
b.etape()
assert b.etage == 0, "Sans appel, rien ne se passe."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-6-1" label="6.1 [Mini-projet] - Gestion d'un parking" type="python">
<Enonce>
### Gestion d'un parking

Réaliser le logiciel d'un parking qui accueille des voitures et des motos. Les heures sont des nombres de **minutes** depuis l'ouverture (des entiers).

**Objectifs**
- Une classe `Ticket` construite avec l'immatriculation, la catégorie (`"voiture"` ou `"moto"`) et l'heure d'entrée ; elle a aussi des attributs `sortie` et `prix`, à `None` tant que le véhicule n'est pas sorti.
- Une classe `Parking` construite avec un dictionnaire de capacités, par exemple `{"voiture": 3, "moto": 2}`, qui garde la liste de tous ses tickets. Ses méthodes :
  - `libres(categorie)` : le nombre de places libres de la catégorie ;
  - `entrer(immat, categorie, heure)` : crée un ticket et renvoie `True`, ou renvoie `False` si la catégorie est inconnue, s'il n'y a plus de place, ou si le véhicule est déjà dans le parking ;
  - `tarif(categorie, duree)` : les 30 premières minutes sont gratuites ; ensuite, chaque heure **commencée** coûte 2 € (1 € pour une moto), avec un maximum de 15 € (8 € pour une moto) ;
  - `sortir(immat, heure)` : complète le ticket du véhicule et renvoie le prix, ou `-1` si le véhicule n'est pas dans le parking ;
  - `taux_occupation()` : le pourcentage de places occupées, toutes catégories confondues, arrondi au dixième ;
  - `recette()` : la somme de tous les prix payés ;
  - `historique(immat)` : la liste des tuples `(entree, sortie, prix)` des visites terminées du véhicule ;
  - `plus_longue_visite()` : le tuple `(immat, duree)` de la plus longue visite terminée (la première en cas d'égalité), ou `None`.

<Indices>
<Indice>

Le parking ne range que des tickets : un véhicule est « dans le parking » s'il a un ticket dont la sortie vaut `None`. Une méthode auxiliaire `ticket_en_cours(immat)` évite de répéter cette recherche.

</Indice>
<Indice>

Pour le tarif, les heures commencées au-delà des 30 minutes gratuites se comptent comme un arrondi supérieur : `(duree - 30 + 59) // 60`.

</Indice>
<Indice>

Écrire et tester `entrer`, `libres` et `sortir` avant les statistiques.

</Indice>
<Indice>

```text
(cœur du programme : le tarif)
MÉTHODE tarif(categorie, duree)
    SI duree ≤ 30 ALORS RENVOYER 0
    heures ← (duree - 30 + 59) // 60
    SI categorie = "moto" ALORS RENVOYER min(heures × 1, 8)
    RENVOYER min(heures × 2, 15)
```

</Indice>
</Indices>

<Correction>

```python
class Ticket:
    def __init__(self, immat: str, categorie: str, entree: int):
        self.immat = immat
        self.categorie = categorie
        self.entree = entree
        self.sortie = None
        self.prix = None


class Parking:
    def __init__(self, capacites: dict):
        self.capacites = dict(capacites)
        self.tickets = []

    def ticket_en_cours(self, immat: str):
        for t in self.tickets:
            if t.immat == immat and t.sortie is None:
                return t
        return None

    def libres(self, categorie: str) -> int:
        occupees = sum(1 for t in self.tickets if t.categorie == categorie and t.sortie is None)
        return self.capacites.get(categorie, 0) - occupees

    def entrer(self, immat: str, categorie: str, heure: int) -> bool:
        if categorie not in self.capacites or self.libres(categorie) == 0 or self.ticket_en_cours(immat) is not None:
            return False
        self.tickets.append(Ticket(immat, categorie, heure))
        return True

    def tarif(self, categorie: str, duree: int) -> int:
        if duree <= 30:
            return 0
        heures = (duree - 30 + 59) // 60
        if categorie == "moto":
            return min(heures, 8)
        return min(heures * 2, 15)

    def sortir(self, immat: str, heure: int) -> int:
        t = self.ticket_en_cours(immat)
        if t is None:
            return -1
        t.sortie = heure
        t.prix = self.tarif(t.categorie, heure - t.entree)
        return t.prix

    def taux_occupation(self) -> float:
        total = sum(self.capacites.values())
        occupees = sum(1 for t in self.tickets if t.sortie is None)
        return round(occupees / total * 100, 1)

    def recette(self) -> int:
        return sum(t.prix for t in self.tickets if t.prix is not None)

    def historique(self, immat: str) -> list:
        return [(t.entree, t.sortie, t.prix) for t in self.tickets if t.immat == immat and t.sortie is not None]

    def plus_longue_visite(self):
        meilleure = None
        for t in self.tickets:
            if t.sortie is not None and (meilleure is None or t.sortie - t.entree > meilleure[1]):
                meilleure = (t.immat, t.sortie - t.entree)
        return meilleure
```

</Correction>
</Enonce>
<Verification>

```python
p = Parking({"voiture": 2, "moto": 1})
assert p.libres("voiture") == 2 and p.libres("camion") == 0, "Places libres au départ."
assert p.entrer("AA-111-AA", "voiture", 0) and p.entrer("BB-222-BB", "voiture", 10), "Deux voitures entrent."
assert not p.entrer("CC-333-CC", "voiture", 20) and not p.entrer("AA-111-AA", "moto", 20) and not p.entrer("XX", "camion", 20), "Complet, déjà dedans, catégorie inconnue."
assert p.entrer("MO-1", "moto", 5) and p.libres("moto") == 0, "Une moto entre."
assert isinstance(p.tickets[0], Ticket) and p.tickets[0].sortie is None and p.tickets[0].prix is None, "Tickets en cours."
assert p.taux_occupation() == 100.0, "Parking plein."
assert [p.tarif("voiture", d) for d in (30, 31, 90, 91, 2000)] == [0, 2, 2, 4, 15] and [p.tarif("moto", d) for d in (45, 200, 2000)] == [1, 3, 8], "Tarifs."
assert p.sortir("AA-111-AA", 95) == 4 and p.sortir("AA-111-AA", 100) == -1 and p.sortir("ZZ", 100) == -1, "Sorties."
assert p.libres("voiture") == 1 and p.taux_occupation() == 66.7, "Une place se libère."
assert p.entrer("AA-111-AA", "voiture", 200) and p.sortir("AA-111-AA", 215) == 0 and p.sortir("MO-1", 365) == 6, "Deuxième visite gratuite ; moto."
assert p.recette() == 10 and p.historique("AA-111-AA") == [(0, 95, 4), (200, 215, 0)] and p.historique("BB-222-BB") == [], "Recette et historique."
assert p.plus_longue_visite() == ("MO-1", 360) and Parking({"voiture": 1}).plus_longue_visite() is None, "Plus longue visite."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-poo-6-2" label="6.2 [Mini-projet] - Jeu de la bataille" type="python">
<Enonce>
### Jeu de la bataille

Réaliser une partie complète du jeu de la bataille, entre deux joueurs, sans hasard caché : le mélange dépend d'une **graine**.

**Règles** : chaque joueur retourne la première carte de son tas ; la plus forte remporte les deux cartes, qui passent **sous** le tas du gagnant (d'abord la carte du joueur 1, puis celle du joueur 2). En cas d'égalité, c'est la bataille : chacun pose une carte face cachée puis une nouvelle carte face visible, et la plus forte des nouvelles cartes remporte **toutes** les cartes posées (celles du joueur 1, dans l'ordre où il les a posées, puis celles du joueur 2) ; s'il y a de nouveau égalité, la bataille continue de la même façon. Un joueur qui n'a plus assez de cartes pour jouer perd la partie.

**Objectifs**
- `Carte(valeur, couleur)` (valeurs de 2 à 14), avec `__str__` (`"dame de pique"`, `"7 de coeur"`…) ; `Paquet()` qui contient les 52 cartes dans l'ordre (couleurs `pique`, `coeur`, `carreau`, `trefle`, valeurs croissantes), avec `melanger(graine)` (`random.Random(graine).shuffle`) et `distribuer()` qui renvoie deux listes : les cartes d'indice pair et celles d'indice impair.
- `Joueur(nom, cartes)` avec `nb_cartes()`, `poser()` (retire et renvoie la première carte) et `ramasser(cartes)` (ajoute les cartes sous le tas, dans l'ordre).
- `Bataille(j1, j2)` avec :
  - `tour()` : joue un tour complet (bataille comprise) et renvoie le nom du gagnant du tour, ou le nom du gagnant de la partie si un joueur ne peut plus jouer pendant une bataille (toutes les cartes posées vont alors à son adversaire) ;
  - `finie()` : `True` si un joueur n'a plus de carte ;
  - `partie(max_tours)` : joue jusqu'à la fin ou jusqu'à `max_tours` tours, et renvoie le tuple `(nom du gagnant ou None, nombre de tours joués)`.
- `nouvelle_partie(graine)` : une `Bataille` entre `"Alice"` et `"Bob"` avec un paquet mélangé selon la graine puis distribué.

<Indices>
<Indice>

Les cartes ne disparaissent jamais : à tout moment, les deux tas plus les cartes posées en font 52. C'est un bon test à écrire soi-même.

</Indice>
<Indice>

Dans `tour`, garder deux listes « posées par le joueur 1 » et « posées par le joueur 2 », et boucler tant qu'il y a égalité ; avant chaque pose, vérifier que le joueur a encore assez de cartes.

</Indice>
<Indice>

```text
(cœur du programme : un tour, bataille comprise)
MÉTHODE tour()
    poses1 ← [] ; poses2 ← []
    RÉPÉTER
        SI j1 n'a plus de carte ALORS j2 ramasse poses1 + poses2 ; RENVOYER nom de j2   (et inversement)
        c1 ← j1.poser() ; c2 ← j2.poser() ; ajouter c1 à poses1 et c2 à poses2
        SI c1 bat c2 ALORS j1 ramasse poses1 + poses2 ; RENVOYER nom de j1
        SI c2 bat c1 ALORS j2 ramasse poses1 + poses2 ; RENVOYER nom de j2
        (égalité) chaque joueur qui le peut pose une carte cachée dans ses poses ; sinon il perd
```

</Indice>
</Indices>

<Correction>

```python
import random

NOMS = {11: "valet", 12: "dame", 13: "roi", 14: "as"}
COULEURS = ("pique", "coeur", "carreau", "trefle")


class Carte:
    def __init__(self, valeur: int, couleur: str):
        self.valeur = valeur
        self.couleur = couleur

    def __str__(self) -> str:
        return f"{NOMS.get(self.valeur, str(self.valeur))} de {self.couleur}"

    def __repr__(self) -> str:
        return str(self)


class Paquet:
    def __init__(self):
        self.cartes = [Carte(v, c) for c in COULEURS for v in range(2, 15)]

    def melanger(self, graine: int) -> None:
        random.Random(graine).shuffle(self.cartes)

    def distribuer(self) -> tuple:
        return (self.cartes[0::2], self.cartes[1::2])


class Joueur:
    def __init__(self, nom: str, cartes: list):
        self.nom = nom
        self.cartes = list(cartes)

    def nb_cartes(self) -> int:
        return len(self.cartes)

    def poser(self) -> Carte:
        return self.cartes.pop(0)

    def ramasser(self, cartes: list) -> None:
        self.cartes.extend(cartes)


class Bataille:
    def __init__(self, j1: Joueur, j2: Joueur):
        self.j1 = j1
        self.j2 = j2

    def finie(self) -> bool:
        return self.j1.nb_cartes() == 0 or self.j2.nb_cartes() == 0

    def tour(self) -> str:
        poses1, poses2 = [], []
        while True:
            if self.j1.nb_cartes() == 0:
                self.j2.ramasser(poses1 + poses2)
                return self.j2.nom
            if self.j2.nb_cartes() == 0:
                self.j1.ramasser(poses1 + poses2)
                return self.j1.nom
            c1, c2 = self.j1.poser(), self.j2.poser()
            poses1.append(c1)
            poses2.append(c2)
            if c1.valeur > c2.valeur:
                self.j1.ramasser(poses1 + poses2)
                return self.j1.nom
            if c2.valeur > c1.valeur:
                self.j2.ramasser(poses1 + poses2)
                return self.j2.nom
            for joueur, poses in ((self.j1, poses1), (self.j2, poses2)):
                if joueur.nb_cartes() > 0:
                    poses.append(joueur.poser())

    def partie(self, max_tours: int) -> tuple:
        tours = 0
        while not self.finie() and tours < max_tours:
            self.tour()
            tours += 1
        if self.j1.nb_cartes() == 0:
            return (self.j2.nom, tours)
        if self.j2.nb_cartes() == 0:
            return (self.j1.nom, tours)
        return (None, tours)


def nouvelle_partie(graine: int) -> Bataille:
    p = Paquet()
    p.melanger(graine)
    a, b = p.distribuer()
    return Bataille(Joueur("Alice", a), Joueur("Bob", b))
```

</Correction>
</Enonce>
<Verification>

```python
C = lambda v: Carte(v, "pique")
assert str(Carte(12, "pique")) == "dame de pique" and str(Carte(7, "coeur")) == "7 de coeur", "Noms des cartes."
p = Paquet()
assert len(p.cartes) == 52 and str(p.cartes[0]) == "2 de pique" and str(p.cartes[-1]) == "as de trefle", "Paquet ordonné."
a, b = p.distribuer()
assert len(a) == 26 and str(a[0]) == "2 de pique" and str(b[0]) == "3 de pique", "Distribution alternée."
j = Joueur("A", [C(5), C(9)])
assert j.poser().valeur == 5 and j.nb_cartes() == 1, "Poser la première carte."
j.ramasser([C(2), C(3)])
assert [c.valeur for c in j.cartes] == [9, 2, 3], "Ramasser sous le tas."
x = Bataille(Joueur("A", [C(10), C(2)]), Joueur("B", [C(4), C(7)]))
assert x.tour() == "A" and [c.valeur for c in x.j1.cartes] == [2, 10, 4] and [c.valeur for c in x.j2.cartes] == [7], "Tour simple."
y = Bataille(Joueur("A", [C(8), C(2), C(3), C(14)]), Joueur("B", [C(8), C(5), C(9), C(6)]))
assert y.tour() == "B" and [c.valeur for c in y.j2.cartes] == [6, 8, 2, 3, 8, 5, 9] and [c.valeur for c in y.j1.cartes] == [14], "Bataille : B gagne les six cartes posées."
z = Bataille(Joueur("A", [C(8)]), Joueur("B", [C(8), C(2), C(3)]))
assert z.tour() == "B" and z.finie() and z.j2.nb_cartes() == 4, "A ne peut plus jouer pendant la bataille : B gagne."
for graine in (1, 2, 3):
    jeu = nouvelle_partie(graine)
    gagnant, tours = jeu.partie(5000)
    assert jeu.j1.nb_cartes() + jeu.j2.nb_cartes() == 52, "Aucune carte ne disparaît."
    assert gagnant in ("Alice", "Bob", None) and 0 < tours <= 5000, "Résultat de partie."
    if gagnant is not None:
        perdant = jeu.j2 if gagnant == "Alice" else jeu.j1
        assert perdant.nb_cartes() == 0, "Le perdant n'a plus de carte."
r1 = nouvelle_partie(7).partie(5000)
r2 = nouvelle_partie(7).partie(5000)
assert r1 == r2, "Même graine, même partie."
assert nouvelle_partie(7).partie(3)[1] == 3, "La partie s'arrête après max_tours."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
