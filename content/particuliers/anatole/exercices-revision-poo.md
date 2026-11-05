---
title: 'Exercices : réviser la POO'
description: 'Classes, attributs et méthodes, puis piles et files écrites en classes.'
icon: "layers"
chapter: Programmation orientée objet
level: particuliers
audience:
  accounts:
    - 77a341a1-dc82-4fe5-a94c-d24ce93c4cbe
---

Cette fiche sert à retrouver les automatismes de la programmation objet. Tous les exercices suivent le même schéma, avec un constructeur `__init__` qui crée les attributs, des méthodes qui lisent ou modifient ces attributs, et parfois une méthode d'affichage. Les premiers exercices portent sur de petits objets de la vie courante. Viennent ensuite les piles et les files écrites en classes, puis des programmes qui s'en servent.

Chaque exercice commence par la structure attendue. Des tableaux donnent le nom de la classe, ses attributs, et chaque méthode avec ce qu'elle reçoit et ce qu'elle renvoie. Le paramètre `self` est toujours le premier paramètre d'une méthode, mais il n'est pas compté dans la colonne « Reçoit ». Les tests du bouton **Vérifier** utilisent ces noms, qui doivent donc rester tels quels.

Les indices s'ouvrent un par un. Le dernier donne le pseudo-code, qui reste à traduire en Python.

## Rappel : le schéma d'une classe

```python
class Lampe:
    def __init__(self, piece):
        self.piece = piece        # attribut reçu en paramètre
        self.allumee = False      # attribut avec une valeur de départ

    def basculer(self):           # modifie l'état et ne renvoie rien
        self.allumee = not self.allumee

    def est_allumee(self):        # lit l'état et renvoie un booléen
        return self.allumee

    def __repr__(self):           # texte qui représente l'objet
        return f"Lampe({self.piece})"


lampe = Lampe("cuisine")    # appelle __init__
lampe.basculer()
print(lampe.est_allumee())  # True
print(lampe)                # Lampe(cuisine)
```

`__repr__` et `__str__` renvoient tous les deux un texte, sans rien afficher. `print` utilise `__str__` s'il existe, et sinon `__repr__`. La console et l'affichage d'une liste d'objets utilisent `__repr__`.

Pour signaler une erreur, une méthode peut lever une exception. L'instruction `raise IndexError("pile vide")` arrête la méthode tout de suite.

<ExerciseTabs courseId="anatole-revision-poo" courseTitle="Réviser la POO">

<ExerciseSection id="anat-poo-1-1" label="1.1 [Introduction] - Livre" type="python">
<Enonce>
### Livre

Une médiathèque enregistre ses livres. Écrire la classe `Livre`.

**Attributs**

| Attribut | Contenu |
|---|---|
| `titre` | le titre du livre (texte) |
| `auteur` | le nom de l'auteur (texte) |
| `pages` | le nombre de pages (entier) |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self, titre, auteur, pages)` | le titre, l'auteur et le nombre de pages | rien | range les trois valeurs dans les attributs du même nom |
| `est_long(self)` | rien | un booléen | `True` si le livre a plus de 300 pages, `False` sinon |

**Exemple**

```python
livre = Livre("Dune", "Frank Herbert", 412)
livre.titre       # "Dune"
livre.est_long()  # True
```

<Indices>
<Indice>

Dans `__init__`, chaque attribut se crée avec `self.nom_attribut = valeur`, par exemple `self.titre = titre`.

</Indice>
<Indice>

`est_long` peut renvoyer directement la comparaison `self.pages > 300`, qui vaut déjà `True` ou `False`.

</Indice>
<Indice>

```text
CLASSE Livre
    CONSTRUCTEUR(titre, auteur, pages)
        self.titre ← titre
        self.auteur ← auteur
        self.pages ← pages
    MÉTHODE est_long()
        RENVOYER self.pages > 300
```

</Indice>
</Indices>

<Correction>

```python
class Livre:
    def __init__(self, titre, auteur, pages):
        self.titre = titre
        self.auteur = auteur
        self.pages = pages

    def est_long(self):
        return self.pages > 300
```

</Correction>
</Enonce>
<Verification>

```python
livre = Livre("Dune", "Frank Herbert", 412)
assert livre.titre == "Dune" and livre.auteur == "Frank Herbert" and livre.pages == 412, "Les trois attributs s'appellent titre, auteur et pages."
assert livre.est_long() is True, "412 pages : le livre est long."
assert Livre("Le Petit Prince", "Saint-Exupéry", 96).est_long() is False, "96 pages : le livre n'est pas long."
assert Livre("Un livre", "Une autrice", 300).est_long() is False, "300 pages tout juste : ce n'est pas plus de 300."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-1-2" label="1.2 [Introduction] - Rectangle" type="python">
<Enonce>
### Rectangle

Un logiciel de dessin manipule des rectangles. Écrire la classe `Rectangle`.

**Attributs**

| Attribut | Contenu |
|---|---|
| `largeur` | la largeur (nombre) |
| `hauteur` | la hauteur (nombre) |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self, largeur, hauteur)` | la largeur et la hauteur | rien | range les deux valeurs dans les attributs |
| `aire(self)` | rien | un nombre | l'aire du rectangle |
| `perimetre(self)` | rien | un nombre | le périmètre du rectangle |
| `est_carre(self)` | rien | un booléen | `True` si la largeur est égale à la hauteur |

**Exemple**

```python
r = Rectangle(4, 3)
r.aire()       # 12
r.perimetre()  # 14
r.est_carre()  # False
```

<Indices>
<Indice>

Dans une méthode, les attributs se lisent avec `self.largeur` et `self.hauteur`. Écrire seulement `largeur` provoque une erreur, car cette variable n'existe pas dans la méthode.

</Indice>
<Indice>

Le périmètre vaut 2 × (largeur + hauteur).

</Indice>
<Indice>

```text
CLASSE Rectangle
    CONSTRUCTEUR(largeur, hauteur)
        self.largeur ← largeur
        self.hauteur ← hauteur
    MÉTHODE aire()
        RENVOYER self.largeur × self.hauteur
    MÉTHODE perimetre()
        RENVOYER 2 × (self.largeur + self.hauteur)
    MÉTHODE est_carre()
        RENVOYER self.largeur = self.hauteur
```

</Indice>
</Indices>

<Correction>

```python
class Rectangle:
    def __init__(self, largeur, hauteur):
        self.largeur = largeur
        self.hauteur = hauteur

    def aire(self):
        return self.largeur * self.hauteur

    def perimetre(self):
        return 2 * (self.largeur + self.hauteur)

    def est_carre(self):
        return self.largeur == self.hauteur
```

</Correction>
</Enonce>
<Verification>

```python
r = Rectangle(4, 3)
assert r.largeur == 4 and r.hauteur == 3, "Les attributs s'appellent largeur et hauteur."
assert r.aire() == 12, "Aire d'un rectangle 4 × 3 : 12."
assert r.perimetre() == 14, "Périmètre d'un rectangle 4 × 3 : 14."
assert r.est_carre() is False, "Un rectangle 4 × 3 n'est pas un carré."
c = Rectangle(5, 5)
assert c.est_carre() is True and c.aire() == 25 and c.perimetre() == 20, "Un rectangle 5 × 5 est un carré d'aire 25."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-1-3" label="1.3 [Introduction] - Point" type="python">
<Enonce>
### Point

Dans un jeu, un personnage se déplace sur une grille. Sa position est un point. Écrire la classe `Point`.

**Attributs**

| Attribut | Contenu |
|---|---|
| `x` | l'abscisse (nombre) |
| `y` | l'ordonnée (nombre) |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self, x, y)` | les deux coordonnées | rien | range les coordonnées dans les attributs |
| `deplacer(self, dx, dy)` | deux nombres | rien | ajoute `dx` à `x` et `dy` à `y` |
| `distance_origine(self)` | rien | un nombre | la distance entre le point et l'origine (0, 0), qui vaut √(x² + y²) |

**Exemple**

```python
p = Point(1, 2)
p.deplacer(2, 2)
p.x, p.y              # (3, 4)
p.distance_origine()  # 5.0
```

<Indices>
<Indice>

`deplacer` ne renvoie rien. Elle change les attributs, par exemple avec `self.x = self.x + dx`.

</Indice>
<Indice>

La racine carrée d'un nombre `n` s'obtient avec `n ** 0.5`, ou avec `sqrt` du module `math`.

</Indice>
<Indice>

```text
CLASSE Point
    CONSTRUCTEUR(x, y)
        self.x ← x
        self.y ← y
    MÉTHODE deplacer(dx, dy)
        self.x ← self.x + dx
        self.y ← self.y + dy
    MÉTHODE distance_origine()
        RENVOYER racine(self.x² + self.y²)
```

</Indice>
</Indices>

<Correction>

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def deplacer(self, dx, dy):
        self.x = self.x + dx
        self.y = self.y + dy

    def distance_origine(self):
        return (self.x ** 2 + self.y ** 2) ** 0.5
```

</Correction>
</Enonce>
<Verification>

```python
p = Point(1, 2)
assert p.x == 1 and p.y == 2, "Les attributs s'appellent x et y."
resultat = p.deplacer(2, 2)
assert resultat is None, "deplacer modifie le point et ne renvoie rien."
assert p.x == 3 and p.y == 4, "Après deplacer(2, 2), le point (1, 2) est en (3, 4)."
assert abs(p.distance_origine() - 5) < 1e-9, "Le point (3, 4) est à 5 de l'origine."
p.deplacer(-3, -4)
assert p.x == 0 and p.y == 0 and p.distance_origine() == 0, "Les déplacements peuvent être négatifs."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-1-4" label="1.4 [Introduction] - Compteur de visiteurs" type="python">
<Enonce>
### Compteur de visiteurs

À l'entrée d'un musée, un agent compte les visiteurs avec un compteur à main. Écrire la classe `Compteur`.

**Attribut**

| Attribut | Contenu |
|---|---|
| `valeur` | le nombre de visiteurs comptés, 0 à la création |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self)` | rien | rien | crée l'attribut `valeur` à 0 |
| `incrementer(self)` | rien | rien | ajoute 1 à la valeur |
| `lire(self)` | rien | un entier | la valeur du compteur |
| `remettre_a_zero(self)` | rien | rien | remet la valeur à 0 |

**Exemple**

```python
c = Compteur()
c.incrementer()
c.incrementer()
c.lire()  # 2
```

<Indices>
<Indice>

Un attribut ne vient pas forcément d'un paramètre. La ligne `self.valeur = 0` dans `__init__` lui donne une valeur de départ.

</Indice>
<Indice>

Chaque objet a son propre attribut `valeur`, donc deux compteurs créés séparément comptent chacun de leur côté.

</Indice>
<Indice>

```text
CLASSE Compteur
    CONSTRUCTEUR()
        self.valeur ← 0
    MÉTHODE incrementer()
        self.valeur ← self.valeur + 1
    MÉTHODE lire()
        RENVOYER self.valeur
    MÉTHODE remettre_a_zero()
        self.valeur ← 0
```

</Indice>
</Indices>

<Correction>

```python
class Compteur:
    def __init__(self):
        self.valeur = 0

    def incrementer(self):
        self.valeur = self.valeur + 1

    def lire(self):
        return self.valeur

    def remettre_a_zero(self):
        self.valeur = 0
```

</Correction>
</Enonce>
<Verification>

```python
c = Compteur()
assert c.valeur == 0 and c.lire() == 0, "Un compteur neuf vaut 0."
c.incrementer()
c.incrementer()
c.incrementer()
assert c.lire() == 3 and c.valeur == 3, "Trois appels à incrementer donnent 3."
d = Compteur()
assert d.lire() == 0, "Un second compteur ne partage pas la valeur du premier."
c.remettre_a_zero()
assert c.lire() == 0, "remettre_a_zero remet le compteur à 0."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-2-1" label="2.1 [Facile] - Compte bancaire" type="python">
<Enonce>
### Compte bancaire

Une banque en ligne gère les comptes de ses clients. Écrire la classe `CompteBancaire`.

**Attributs**

| Attribut | Contenu |
|---|---|
| `titulaire` | le nom du titulaire (texte) |
| `solde` | l'argent sur le compte, en euros (nombre) |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self, titulaire, solde=0)` | le nom et le solde de départ (0 s'il n'est pas donné) | rien | range les deux valeurs dans les attributs |
| `deposer(self, montant)` | un montant | rien | ajoute le montant au solde |
| `retirer(self, montant)` | un montant | un booléen | si le solde suffit, retire le montant et renvoie `True` ; sinon, laisse le solde tel quel et renvoie `False` |
| `__str__(self)` | rien | un texte | par exemple `"Compte de Léa : 120 €"` |

**Exemple**

```python
compte = CompteBancaire("Léa")
compte.deposer(150)
compte.retirer(30)    # True
compte.retirer(500)   # False
print(compte)         # Compte de Léa : 120 €
```

<Indices>
<Indice>

Un paramètre avec une valeur par défaut s'écrit directement dans la ligne `def` : `def __init__(self, titulaire, solde=0):`.

</Indice>
<Indice>

`retirer` commence par un test. Si `montant > self.solde`, elle renvoie `False` sans toucher au solde. Retirer tout l'argent du compte est autorisé.

</Indice>
<Indice>

`__str__` renvoie un texte construit avec une f-string : `f"Compte de {self.titulaire} : {self.solde} €"`.

</Indice>
<Indice>

```text
CLASSE CompteBancaire
    CONSTRUCTEUR(titulaire, solde = 0)
        self.titulaire ← titulaire
        self.solde ← solde
    MÉTHODE deposer(montant)
        self.solde ← self.solde + montant
    MÉTHODE retirer(montant)
        SI montant > self.solde ALORS
            RENVOYER Faux
        self.solde ← self.solde - montant
        RENVOYER Vrai
    MÉTHODE __str__()
        RENVOYER "Compte de " + titulaire + " : " + solde + " €"
```

</Indice>
</Indices>

<Correction>

```python
class CompteBancaire:
    def __init__(self, titulaire, solde=0):
        self.titulaire = titulaire
        self.solde = solde

    def deposer(self, montant):
        self.solde = self.solde + montant

    def retirer(self, montant):
        if montant > self.solde:
            return False
        self.solde = self.solde - montant
        return True

    def __str__(self):
        return f"Compte de {self.titulaire} : {self.solde} €"
```

</Correction>
</Enonce>
<Verification>

```python
compte = CompteBancaire("Léa")
assert compte.titulaire == "Léa" and compte.solde == 0, "Sans solde donné, le compte commence à 0."
assert CompteBancaire("Sam", 50).solde == 50, "Le solde de départ peut être donné."
compte.deposer(150)
assert compte.solde == 150, "deposer(150) ajoute 150 au solde."
assert compte.retirer(30) is True and compte.solde == 120, "retirer(30) sur 150 € réussit et laisse 120 €."
assert compte.retirer(500) is False and compte.solde == 120, "retirer(500) sur 120 € échoue et ne change pas le solde."
assert str(compte) == "Compte de Léa : 120 €", "Le texte attendu est 'Compte de Léa : 120 €'."
assert compte.retirer(120) is True and compte.solde == 0, "Retirer tout le solde est autorisé."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-2-2" label="2.2 [Facile] - Chronomètre" type="python">
<Enonce>
### Chronomètre

Un chronomètre de sport compte les secondes écoulées et les affiche sous la forme minutes:secondes. Écrire la classe `Chronometre`.

**Attribut**

| Attribut | Contenu |
|---|---|
| `total` | le nombre de secondes écoulées, 0 à la création |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self)` | rien | rien | crée l'attribut `total` à 0 |
| `avancer(self, secondes)` | un nombre de secondes | rien | ajoute ces secondes au total |
| `remettre_a_zero(self)` | rien | rien | remet le total à 0 |
| `__str__(self)` | rien | un texte | le temps au format `"mm:ss"`, minutes et secondes toujours sur deux chiffres |

**Exemple**

```python
ch = Chronometre()
ch.avancer(125)
print(ch)   # 02:05
```

<Indices>
<Indice>

Les minutes sont le quotient `self.total // 60` et les secondes sont le reste `self.total % 60`.

</Indice>
<Indice>

Dans une f-string, `{n:02d}` écrit l'entier `n` sur deux chiffres, avec un zéro devant si besoin.

</Indice>
<Indice>

```text
CLASSE Chronometre
    CONSTRUCTEUR()
        self.total ← 0
    MÉTHODE avancer(secondes)
        self.total ← self.total + secondes
    MÉTHODE remettre_a_zero()
        self.total ← 0
    MÉTHODE __str__()
        minutes ← self.total // 60
        secondes ← self.total % 60
        RENVOYER minutes et secondes sur deux chiffres, séparées par ":"
```

</Indice>
</Indices>

<Correction>

```python
class Chronometre:
    def __init__(self):
        self.total = 0

    def avancer(self, secondes):
        self.total = self.total + secondes

    def remettre_a_zero(self):
        self.total = 0

    def __str__(self):
        minutes = self.total // 60
        secondes = self.total % 60
        return f"{minutes:02d}:{secondes:02d}"
```

</Correction>
</Enonce>
<Verification>

```python
ch = Chronometre()
assert ch.total == 0 and str(ch) == "00:00", "Un chronomètre neuf affiche 00:00."
ch.avancer(59)
assert str(ch) == "00:59", "59 secondes : 00:59."
ch.avancer(66)
assert ch.total == 125 and str(ch) == "02:05", "125 secondes : 02:05."
ch.avancer(600)
assert str(ch) == "12:05", "725 secondes : 12:05."
ch.remettre_a_zero()
assert ch.total == 0 and str(ch) == "00:00", "remettre_a_zero revient à 00:00."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-2-3" label="2.3 [Facile] - Thermostat" type="python">
<Enonce>
### Thermostat

Un thermostat de chauffage règle la température voulue, appelée consigne. La consigne reste toujours entre 5 °C et 30 °C. Écrire la classe `Thermostat`.

**Attribut**

| Attribut | Contenu |
|---|---|
| `consigne` | la température voulue, en °C (nombre) |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self, consigne)` | la consigne de départ | rien | range la consigne dans l'attribut |
| `augmenter(self)` | rien | rien | ajoute 0,5 °C à la consigne, sans dépasser 30 |
| `baisser(self)` | rien | rien | retire 0,5 °C à la consigne, sans descendre sous 5 |
| `est_au_maximum(self)` | rien | un booléen | `True` si la consigne vaut 30 |
| `__repr__(self)` | rien | un texte | par exemple `"Thermostat(19.5)"` |

**Exemple**

```python
t = Thermostat(19)
t.augmenter()
t                   # Thermostat(19.5)
t.est_au_maximum()  # False
```

<Indices>
<Indice>

Pour ne pas dépasser 30, il suffit de garder le plus petit des deux nombres : `min(self.consigne + 0.5, 30)`. De la même façon, `max` empêche de descendre sous 5.

</Indice>
<Indice>

`__repr__` renvoie un texte avec `return`. Elle n'affiche rien, donc pas de `print` dans cette méthode.

</Indice>
<Indice>

```text
CLASSE Thermostat
    CONSTRUCTEUR(consigne)
        self.consigne ← consigne
    MÉTHODE augmenter()
        self.consigne ← minimum(self.consigne + 0,5 ; 30)
    MÉTHODE baisser()
        self.consigne ← maximum(self.consigne - 0,5 ; 5)
    MÉTHODE est_au_maximum()
        RENVOYER self.consigne = 30
    MÉTHODE __repr__()
        RENVOYER "Thermostat(" + consigne + ")"
```

</Indice>
</Indices>

<Correction>

```python
class Thermostat:
    def __init__(self, consigne):
        self.consigne = consigne

    def augmenter(self):
        self.consigne = min(self.consigne + 0.5, 30)

    def baisser(self):
        self.consigne = max(self.consigne - 0.5, 5)

    def est_au_maximum(self):
        return self.consigne == 30

    def __repr__(self):
        return f"Thermostat({self.consigne})"
```

</Correction>
</Enonce>
<Verification>

```python
t = Thermostat(19)
assert t.consigne == 19, "L'attribut s'appelle consigne."
t.augmenter()
assert t.consigne == 19.5 and repr(t) == "Thermostat(19.5)", "Après augmenter, 19 devient 19.5."
t.baisser()
t.baisser()
assert t.consigne == 18.5, "Deux appels à baisser depuis 19.5 donnent 18.5."
assert t.est_au_maximum() is False, "18.5 n'est pas le maximum."
chaud = Thermostat(29.5)
chaud.augmenter()
chaud.augmenter()
assert chaud.consigne == 30 and chaud.est_au_maximum() is True, "La consigne ne dépasse pas 30."
froid = Thermostat(5.5)
froid.baisser()
froid.baisser()
assert froid.consigne == 5, "La consigne ne descend pas sous 5."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-2-4" label="2.4 [Facile] - Panier d'achats" type="python">
<Enonce>
### Panier d'achats

Un site de vente garde le panier de chaque client. Un article est rangé dans le panier sous la forme d'un tuple `(nom, prix)`. Écrire la classe `Panier`.

**Attribut**

| Attribut | Contenu |
|---|---|
| `articles` | la liste des tuples `(nom, prix)`, vide à la création |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self)` | rien | rien | crée une liste d'articles vide |
| `ajouter(self, nom, prix)` | le nom et le prix d'un article | rien | ajoute le tuple `(nom, prix)` à la fin de la liste |
| `nombre_articles(self)` | rien | un entier | le nombre d'articles dans le panier |
| `total(self)` | rien | un nombre | la somme des prix |
| `contient(self, nom)` | un nom d'article | un booléen | `True` si un article de ce nom est dans le panier |

**Exemple**

```python
p = Panier()
p.ajouter("pain", 1.2)
p.ajouter("lait", 0.95)
p.nombre_articles()  # 2
p.total()            # 2.15
p.contient("beurre") # False
```

<Indices>
<Indice>

La ligne `self.articles = []` va dans le constructeur. Ainsi, chaque panier a sa propre liste.

</Indice>
<Indice>

Dans `total` et dans `contient`, la boucle `for nom, prix in self.articles:` donne le nom et le prix de chaque article.

</Indice>
<Indice>

```text
CLASSE Panier
    CONSTRUCTEUR()
        self.articles ← liste vide
    MÉTHODE ajouter(nom, prix)
        ajouter (nom, prix) à la fin de self.articles
    MÉTHODE nombre_articles()
        RENVOYER longueur de self.articles
    MÉTHODE total()
        somme ← 0
        POUR CHAQUE (nom, prix) DANS self.articles
            somme ← somme + prix
        RENVOYER somme
    MÉTHODE contient(nom_cherche)
        POUR CHAQUE (nom, prix) DANS self.articles
            SI nom = nom_cherche ALORS RENVOYER Vrai
        RENVOYER Faux
```

</Indice>
</Indices>

<Correction>

```python
class Panier:
    def __init__(self):
        self.articles = []

    def ajouter(self, nom, prix):
        self.articles.append((nom, prix))

    def nombre_articles(self):
        return len(self.articles)

    def total(self):
        somme = 0
        for nom, prix in self.articles:
            somme = somme + prix
        return somme

    def contient(self, nom_cherche):
        for nom, prix in self.articles:
            if nom == nom_cherche:
                return True
        return False
```

</Correction>
</Enonce>
<Verification>

```python
p = Panier()
assert p.articles == [] and p.nombre_articles() == 0 and p.total() == 0, "Un panier neuf est vide."
p.ajouter("pain", 1.2)
p.ajouter("lait", 0.95)
assert p.articles == [("pain", 1.2), ("lait", 0.95)], "Les articles sont rangés en tuples (nom, prix), dans l'ordre d'ajout."
assert p.nombre_articles() == 2, "Deux articles dans le panier."
assert abs(p.total() - 2.15) < 1e-9, "Total : 1.2 + 0.95 = 2.15."
assert p.contient("lait") is True and p.contient("beurre") is False, "contient cherche un article par son nom."
autre = Panier()
assert autre.nombre_articles() == 0, "Chaque panier a sa propre liste."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-3-1" label="3.1 [Moyen] - Fraction" type="python">
<Enonce>
### Fraction

Une calculatrice de collège travaille avec des fractions exactes, sans nombres à virgule. Écrire la classe `Fraction`. Deux de ses méthodes reçoivent une autre fraction.

**Attributs**

| Attribut | Contenu |
|---|---|
| `numerateur` | le numérateur (entier) |
| `denominateur` | le dénominateur (entier non nul) |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self, numerateur, denominateur)` | deux entiers | rien | range les deux entiers dans les attributs |
| `__str__(self)` | rien | un texte | par exemple `"3/4"` |
| `valeur(self)` | rien | un nombre à virgule | le quotient numérateur / dénominateur |
| `multiplier(self, autre)` | une autre `Fraction` | une nouvelle `Fraction` | le produit des deux fractions, sans simplifier. Les deux fractions de départ ne changent pas. |
| `est_egale(self, autre)` | une autre `Fraction` | un booléen | `True` si les deux fractions représentent le même nombre, comme 1/2 et 2/4 |

**Exemple**

```python
f = Fraction(1, 2)
g = Fraction(3, 4)
print(f.multiplier(g))           # 3/8
f.valeur()                       # 0.5
f.est_egale(Fraction(2, 4))      # True
```

<Indices>
<Indice>

Dans `multiplier`, `autre` est un objet `Fraction` comme `self`. Son numérateur se lit avec `autre.numerateur`.

</Indice>
<Indice>

`multiplier` crée un nouvel objet et le renvoie : `return Fraction(..., ...)`. Elle ne modifie aucun attribut.

</Indice>
<Indice>

Pour comparer sans calcul à virgule, a/b = c/d revient à a × d = b × c.

</Indice>
<Indice>

```text
CLASSE Fraction
    CONSTRUCTEUR(numerateur, denominateur)
        self.numerateur ← numerateur
        self.denominateur ← denominateur
    MÉTHODE __str__()
        RENVOYER numerateur + "/" + denominateur
    MÉTHODE valeur()
        RENVOYER self.numerateur / self.denominateur
    MÉTHODE multiplier(autre)
        RENVOYER Fraction(self.numerateur × autre.numerateur, self.denominateur × autre.denominateur)
    MÉTHODE est_egale(autre)
        RENVOYER self.numerateur × autre.denominateur = self.denominateur × autre.numerateur
```

</Indice>
</Indices>

<Correction>

```python
class Fraction:
    def __init__(self, numerateur, denominateur):
        self.numerateur = numerateur
        self.denominateur = denominateur

    def __str__(self):
        return f"{self.numerateur}/{self.denominateur}"

    def valeur(self):
        return self.numerateur / self.denominateur

    def multiplier(self, autre):
        return Fraction(self.numerateur * autre.numerateur, self.denominateur * autre.denominateur)

    def est_egale(self, autre):
        return self.numerateur * autre.denominateur == self.denominateur * autre.numerateur
```

</Correction>
</Enonce>
<Verification>

```python
f = Fraction(1, 2)
g = Fraction(3, 4)
assert f.numerateur == 1 and f.denominateur == 2, "Les attributs s'appellent numerateur et denominateur."
assert str(f) == "1/2" and str(g) == "3/4", "Le texte attendu pour un demi est '1/2'."
assert f.valeur() == 0.5, "1/2 vaut 0.5."
produit = f.multiplier(g)
assert isinstance(produit, Fraction), "multiplier renvoie un objet Fraction."
assert str(produit) == "3/8", "1/2 × 3/4 = 3/8."
assert str(f) == "1/2" and str(g) == "3/4", "multiplier ne change pas les deux fractions de départ."
assert Fraction(1, 2).est_egale(Fraction(2, 4)) is True, "1/2 et 2/4 sont égales."
assert Fraction(1, 3).est_egale(Fraction(1, 2)) is False, "1/3 et 1/2 ne sont pas égales."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-3-2" label="3.2 [Moyen] - Pile" type="python">
<Enonce>
### Pile

Une pile range ses éléments les uns sur les autres, comme une pile d'assiettes où la dernière posée est la première reprise. Écrire la classe `Pile`, qui stocke ses éléments dans une liste Python. Le sommet de la pile est la fin de la liste.

**Attribut**

| Attribut | Contenu |
|---|---|
| `contenu` | la liste des éléments, du bas vers le sommet, vide à la création |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self)` | rien | rien | crée une pile vide |
| `est_vide(self)` | rien | un booléen | `True` si la pile ne contient aucun élément |
| `empiler(self, element)` | un élément | rien | pose l'élément au sommet |
| `depiler(self)` | rien | l'élément du sommet | retire l'élément du sommet et le renvoie. Lève une `IndexError` si la pile est vide. |
| `sommet(self)` | rien | l'élément du sommet | renvoie l'élément du sommet sans le retirer. Lève une `IndexError` si la pile est vide. |
| `taille(self)` | rien | un entier | le nombre d'éléments |

**Exemple**

```python
p = Pile()
p.empiler(4)
p.empiler(7)
p.sommet()   # 7
p.depiler()  # 7
p.taille()   # 1
```

<Indices>
<Indice>

`append` ajoute un élément à la fin d'une liste. `pop()` retire le dernier élément et le renvoie. Ce sont exactement « empiler » et « dépiler ».

</Indice>
<Indice>

Le dernier élément d'une liste est `self.contenu[-1]`.

</Indice>
<Indice>

Avant de dépiler, tester `self.est_vide()`, puis lever l'erreur avec `raise IndexError("pile vide")`.

</Indice>
<Indice>

```text
CLASSE Pile
    CONSTRUCTEUR()
        self.contenu ← liste vide
    MÉTHODE est_vide()
        RENVOYER longueur de self.contenu = 0
    MÉTHODE empiler(element)
        ajouter element à la fin de self.contenu
    MÉTHODE depiler()
        SI self.est_vide() ALORS LEVER IndexError
        retirer le dernier élément de self.contenu et le RENVOYER
    MÉTHODE sommet()
        SI self.est_vide() ALORS LEVER IndexError
        RENVOYER le dernier élément de self.contenu
    MÉTHODE taille()
        RENVOYER longueur de self.contenu
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu[-1]

    def taille(self):
        return len(self.contenu)
```

</Correction>
</Enonce>
<Verification>

```python
p = Pile()
assert p.contenu == [] and p.est_vide() is True and p.taille() == 0, "Une pile neuve est vide."
assert p.empiler(4) is None, "empiler ne renvoie rien."
p.empiler(7)
p.empiler(1)
assert p.contenu == [4, 7, 1], "Le sommet est la fin de la liste contenu."
assert p.taille() == 3 and p.est_vide() is False, "Trois éléments empilés."
assert p.sommet() == 1 and p.taille() == 3, "sommet renvoie le dernier élément empilé sans le retirer."
assert p.depiler() == 1 and p.depiler() == 7, "depiler renvoie les éléments dans l'ordre inverse de l'empilement."
assert p.contenu == [4], "Il reste 4 au fond de la pile."
p.depiler()
assert p.est_vide() is True, "La pile est vide après trois dépilements."
try:
    p.depiler()
    assert False, "depiler sur une pile vide lève une IndexError."
except IndexError:
    pass
try:
    p.sommet()
    assert False, "sommet sur une pile vide lève une IndexError."
except IndexError:
    pass
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-3-3" label="3.3 [Moyen] - File" type="python">
<Enonce>
### File

Une file fonctionne comme une file d'attente, où le premier arrivé est le premier servi. Écrire la classe `File`, qui stocke ses éléments dans une liste Python. Les éléments entrent à la fin de la liste et sortent par le début.

**Attribut**

| Attribut | Contenu |
|---|---|
| `contenu` | la liste des éléments, du premier arrivé (indice 0) au dernier, vide à la création |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self)` | rien | rien | crée une file vide |
| `est_vide(self)` | rien | un booléen | `True` si la file ne contient aucun élément |
| `enfiler(self, element)` | un élément | rien | ajoute l'élément à la fin de la file |
| `defiler(self)` | rien | le premier élément | retire le premier élément et le renvoie. Lève une `IndexError` si la file est vide. |
| `premier(self)` | rien | le premier élément | renvoie le premier élément sans le retirer. Lève une `IndexError` si la file est vide. |
| `taille(self)` | rien | un entier | le nombre d'éléments |
| `__repr__(self)` | rien | un texte | par exemple `"File([3, 8, 5])"` |

**Exemple**

```python
f = File()
f.enfiler(3)
f.enfiler(8)
f            # File([3, 8])
f.defiler()  # 3
f.premier()  # 8
```

<Indices>
<Indice>

`pop(0)` retire le premier élément d'une liste et le renvoie.

</Indice>
<Indice>

Dans une f-string, `{self.contenu}` écrit la liste avec ses crochets : `f"File({self.contenu})"`.

</Indice>
<Indice>

```text
CLASSE File
    CONSTRUCTEUR()
        self.contenu ← liste vide
    MÉTHODE est_vide()
        RENVOYER longueur de self.contenu = 0
    MÉTHODE enfiler(element)
        ajouter element à la fin de self.contenu
    MÉTHODE defiler()
        SI self.est_vide() ALORS LEVER IndexError
        retirer le premier élément de self.contenu et le RENVOYER
    MÉTHODE premier()
        SI self.est_vide() ALORS LEVER IndexError
        RENVOYER self.contenu[0]
    MÉTHODE taille()
        RENVOYER longueur de self.contenu
    MÉTHODE __repr__()
        RENVOYER "File(" + texte de self.contenu + ")"
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def enfiler(self, element):
        self.contenu.append(element)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.contenu.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.contenu[0]

    def taille(self):
        return len(self.contenu)

    def __repr__(self):
        return f"File({self.contenu})"
```

</Correction>
</Enonce>
<Verification>

```python
f = File()
assert f.contenu == [] and f.est_vide() is True and f.taille() == 0, "Une file neuve est vide."
f.enfiler(3)
f.enfiler(8)
f.enfiler(5)
assert f.contenu == [3, 8, 5], "Les éléments entrent à la fin de la liste contenu."
assert repr(f) == "File([3, 8, 5])", "Le texte attendu est 'File([3, 8, 5])'."
assert f.premier() == 3 and f.taille() == 3, "premier renvoie le premier arrivé sans le retirer."
assert f.defiler() == 3 and f.defiler() == 8, "defiler renvoie les éléments dans leur ordre d'arrivée."
assert f.contenu == [5] and f.est_vide() is False, "Il reste 5 dans la file."
f.defiler()
try:
    f.defiler()
    assert False, "defiler sur une file vide lève une IndexError."
except IndexError:
    pass
try:
    f.premier()
    assert False, "premier sur une file vide lève une IndexError."
except IndexError:
    pass
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-3-4" label="3.4 [Moyen] - Pile bornée" type="python">
<Enonce>
### Pile bornée

À la cantine, la colonne de plateaux propres ne peut pas dépasser un certain nombre de plateaux. Une pile bornée fonctionne de la même façon, avec une capacité maximale. Écrire la classe `PileBornee`.

**Attributs**

| Attribut | Contenu |
|---|---|
| `contenu` | la liste des éléments, du bas vers le sommet, vide à la création |
| `capacite` | le nombre maximal d'éléments (entier) |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self, capacite)` | la capacité | rien | crée une pile vide de cette capacité |
| `est_vide(self)` | rien | un booléen | `True` si la pile ne contient aucun élément |
| `est_pleine(self)` | rien | un booléen | `True` si le nombre d'éléments a atteint la capacité |
| `empiler(self, element)` | un élément | un booléen | s'il reste de la place, pose l'élément au sommet et renvoie `True` ; sinon, ne change rien et renvoie `False` |
| `depiler(self)` | rien | l'élément du sommet | retire l'élément du sommet et le renvoie. Lève une `IndexError` si la pile est vide. |
| `taille(self)` | rien | un entier | le nombre d'éléments |

**Exemple**

```python
p = PileBornee(2)
p.empiler("A")   # True
p.empiler("B")   # True
p.empiler("C")   # False, la pile est pleine
p.depiler()      # "B"
```

<Indices>
<Indice>

`est_pleine` compare le nombre d'éléments de `self.contenu` à `self.capacite`.

</Indice>
<Indice>

Une méthode peut en appeler une autre du même objet avec `self.` : `empiler` peut commencer par `if self.est_pleine():`.

</Indice>
<Indice>

```text
CLASSE PileBornee
    CONSTRUCTEUR(capacite)
        self.contenu ← liste vide
        self.capacite ← capacite
    MÉTHODE est_vide()
        RENVOYER longueur de self.contenu = 0
    MÉTHODE est_pleine()
        RENVOYER longueur de self.contenu = self.capacite
    MÉTHODE empiler(element)
        SI self.est_pleine() ALORS RENVOYER Faux
        ajouter element à la fin de self.contenu
        RENVOYER Vrai
    MÉTHODE depiler()
        SI self.est_vide() ALORS LEVER IndexError
        retirer le dernier élément de self.contenu et le RENVOYER
    MÉTHODE taille()
        RENVOYER longueur de self.contenu
```

</Indice>
</Indices>

<Correction>

```python
class PileBornee:
    def __init__(self, capacite):
        self.contenu = []
        self.capacite = capacite

    def est_vide(self):
        return len(self.contenu) == 0

    def est_pleine(self):
        return len(self.contenu) == self.capacite

    def empiler(self, element):
        if self.est_pleine():
            return False
        self.contenu.append(element)
        return True

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def taille(self):
        return len(self.contenu)
```

</Correction>
</Enonce>
<Verification>

```python
p = PileBornee(2)
assert p.capacite == 2 and p.contenu == [], "Une pile bornée neuve est vide et garde sa capacité."
assert p.est_vide() is True and p.est_pleine() is False, "Une pile neuve est vide et pas pleine."
assert p.empiler("A") is True and p.empiler("B") is True, "Les deux premiers empilements réussissent."
assert p.est_pleine() is True, "Avec 2 éléments sur 2 places, la pile est pleine."
assert p.empiler("C") is False, "Une pile pleine refuse un nouvel élément."
assert p.contenu == ["A", "B"] and p.taille() == 2, "L'élément refusé n'est pas ajouté."
assert p.depiler() == "B" and p.est_pleine() is False, "Après un dépilement, il reste une place."
assert p.empiler("C") is True and p.contenu == ["A", "C"], "La place libérée peut servir."
p.depiler()
p.depiler()
try:
    p.depiler()
    assert False, "depiler sur une pile vide lève une IndexError."
except IndexError:
    pass
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-4-1" label="4.1 [Difficile] - Méthodes spéciales d'une pile" type="python">
<Enonce>
### Méthodes spéciales d'une pile

Python appelle certaines méthodes tout seul. Par exemple, `len(p)` appelle `p.__len__()` et `p1 == p2` appelle `p1.__eq__(p2)`. La classe `Pile` de l'exercice 3.2 est déjà dans l'éditeur. Lui ajouter les quatre méthodes ci-dessous.

**Attribut** (déjà présent)

| Attribut | Contenu |
|---|---|
| `contenu` | la liste des éléments, du bas vers le sommet |

**Méthodes à ajouter**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__len__(self)` | rien | un entier | le nombre d'éléments, pour que `len(p)` fonctionne |
| `__eq__(self, autre)` | une autre `Pile` | un booléen | `True` si les deux piles ont les mêmes éléments dans le même ordre |
| `__repr__(self)` | rien | un texte | par exemple `"Pile([4, 7])"` |
| `copie(self)` | rien | une nouvelle `Pile` | une pile avec les mêmes éléments, mais indépendante : la modifier ne change pas la pile de départ |

**Exemple**

```python
p = Pile()
p.empiler(4)
p.empiler(7)
len(p)        # 2
p             # Pile([4, 7])
q = p.copie()
q == p        # True
q.empiler(9)
q == p        # False
len(p)        # 2
```

<Indices>
<Indice>

Deux piles sont égales quand leurs listes `contenu` sont égales, et `==` sait déjà comparer deux listes.

</Indice>
<Indice>

Pour `copie`, créer une nouvelle pile vide puis y empiler les éléments de `self.contenu`, du bas vers le sommet. Écrire `nouvelle.contenu = self.contenu` ne suffit pas, car les deux piles partageraient alors la même liste.

</Indice>
<Indice>

```text
(méthodes à ajouter à la classe Pile)
MÉTHODE __len__()
    RENVOYER longueur de self.contenu
MÉTHODE __eq__(autre)
    RENVOYER self.contenu = autre.contenu
MÉTHODE __repr__()
    RENVOYER "Pile(" + texte de self.contenu + ")"
MÉTHODE copie()
    nouvelle ← Pile()
    POUR CHAQUE element DANS self.contenu
        nouvelle.empiler(element)
    RENVOYER nouvelle
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu[-1]

    def taille(self):
        return len(self.contenu)

    def __len__(self):
        return len(self.contenu)

    def __eq__(self, autre):
        return self.contenu == autre.contenu

    def __repr__(self):
        return f"Pile({self.contenu})"

    def copie(self):
        nouvelle = Pile()
        for element in self.contenu:
            nouvelle.empiler(element)
        return nouvelle
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu[-1]

    def taille(self):
        return len(self.contenu)

    # Ajouter ici __len__, __eq__, __repr__ et copie
```

</CodeDepart>
<Verification>

```python
p = Pile()
assert len(p) == 0, "len d'une pile vide : 0."
p.empiler(4)
p.empiler(7)
assert len(p) == 2, "len(p) donne le nombre d'éléments."
assert repr(p) == "Pile([4, 7])", "Le texte attendu est 'Pile([4, 7])'."
assert Pile() == Pile(), "Deux piles vides sont égales."
q = p.copie()
assert isinstance(q, Pile) and q is not p, "copie renvoie un nouvel objet Pile."
assert q == p and q.contenu == [4, 7], "La copie a les mêmes éléments, dans le même ordre."
q.empiler(9)
assert len(p) == 2 and p.contenu == [4, 7], "Modifier la copie ne change pas la pile de départ."
assert (q == p) is False, "Des piles aux éléments différents ne sont pas égales."
autre = Pile()
autre.empiler(7)
autre.empiler(4)
assert (autre == p) is False, "L'ordre des éléments compte."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-4-2" label="4.2 [Difficile] - File avec deux piles" type="python">
<Enonce>
### File avec deux piles

Une file peut se construire avec deux piles. Les éléments qui arrivent sont empilés sur la pile `entree`. Pour défiler, l'élément est pris au sommet de la pile `sortie`. Quand `sortie` est vide, toute la pile `entree` y est d'abord transvasée, ce qui retourne l'ordre des éléments.

La classe `Pile` de l'exercice 3.2 est déjà dans l'éditeur. Écrire la classe `FileDeuxPiles` en utilisant seulement les méthodes de `Pile`, sans liste Python.

**Attributs**

| Attribut | Contenu |
|---|---|
| `entree` | un objet `Pile`, qui reçoit les éléments enfilés |
| `sortie` | un objet `Pile`, d'où partent les éléments défilés |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self)` | rien | rien | crée les deux piles vides |
| `est_vide(self)` | rien | un booléen | `True` si les deux piles sont vides |
| `enfiler(self, element)` | un élément | rien | empile l'élément sur `entree` |
| `defiler(self)` | rien | le premier élément arrivé | le retire de la file et le renvoie. Lève une `IndexError` si la file est vide. |
| `taille(self)` | rien | un entier | le nombre total d'éléments dans les deux piles |

**Exemple**

```python
f = FileDeuxPiles()
f.enfiler("a")
f.enfiler("b")
f.defiler()   # "a"
f.enfiler("c")
f.defiler()   # "b"
f.defiler()   # "c"
```

<Indices>
<Indice>

Un attribut peut être un objet : `self.entree = Pile()`.

</Indice>
<Indice>

Le transvasement se fait avec une boucle. Tant que `entree` n'est pas vide, dépiler un élément de `entree` et l'empiler sur `sortie`.

</Indice>
<Indice>

Il ne faut transvaser que si `sortie` est vide. Sinon, les éléments déjà présents dans `sortie` passent après les nouveaux et l'ordre d'arrivée est perdu.

</Indice>
<Indice>

```text
CLASSE FileDeuxPiles
    CONSTRUCTEUR()
        self.entree ← Pile()
        self.sortie ← Pile()
    MÉTHODE est_vide()
        RENVOYER self.entree.est_vide() ET self.sortie.est_vide()
    MÉTHODE enfiler(element)
        self.entree.empiler(element)
    MÉTHODE defiler()
        SI self.est_vide() ALORS LEVER IndexError
        SI self.sortie.est_vide() ALORS
            TANT QUE NON self.entree.est_vide()
                self.sortie.empiler(self.entree.depiler())
        RENVOYER self.sortie.depiler()
    MÉTHODE taille()
        RENVOYER self.entree.taille() + self.sortie.taille()
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu[-1]

    def taille(self):
        return len(self.contenu)


class FileDeuxPiles:
    def __init__(self):
        self.entree = Pile()
        self.sortie = Pile()

    def est_vide(self):
        return self.entree.est_vide() and self.sortie.est_vide()

    def enfiler(self, element):
        self.entree.empiler(element)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        if self.sortie.est_vide():
            while not self.entree.est_vide():
                self.sortie.empiler(self.entree.depiler())
        return self.sortie.depiler()

    def taille(self):
        return self.entree.taille() + self.sortie.taille()
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu[-1]

    def taille(self):
        return len(self.contenu)


class FileDeuxPiles:
    pass
```

</CodeDepart>
<Verification>

```python
f = FileDeuxPiles()
assert isinstance(f.entree, Pile) and isinstance(f.sortie, Pile), "Les attributs entree et sortie sont des objets Pile."
assert f.est_vide() is True and f.taille() == 0, "Une file neuve est vide."
f.enfiler(1)
f.enfiler(2)
assert f.entree.contenu == [1, 2], "enfiler empile sur la pile entree."
assert f.taille() == 2 and f.est_vide() is False, "Deux éléments dans la file."
assert f.defiler() == 1, "Le premier arrivé sort en premier."
f.enfiler(3)
assert f.defiler() == 2, "2 sort avant 3 : il ne faut transvaser que si sortie est vide."
assert f.defiler() == 3, "Puis 3."
assert f.est_vide() is True, "La file est vide."
try:
    f.defiler()
    assert False, "defiler sur une file vide lève une IndexError."
except IndexError:
    pass
for lettre in "abcde":
    f.enfiler(lettre)
assert "".join(f.defiler() for _ in range(5)) == "abcde", "Cinq lettres ressortent dans l'ordre."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-4-3" label="4.3 [Difficile] - Navigateur web" type="python">
<Enonce>
### Navigateur web

Les boutons « précédent » et « suivant » d'un navigateur web utilisent deux piles. La pile `precedentes` garde les pages déjà vues. La pile `suivantes` garde les pages quittées avec le bouton « précédent », pour pouvoir y revenir avec « suivant ». Visiter une nouvelle page vide la pile `suivantes`.

La classe `Pile` de l'exercice 3.2 est déjà dans l'éditeur. Écrire la classe `Navigateur`.

**Attributs**

| Attribut | Contenu |
|---|---|
| `page` | l'adresse de la page affichée (texte) |
| `precedentes` | un objet `Pile` des pages déjà vues |
| `suivantes` | un objet `Pile` des pages quittées avec « précédent » |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self, accueil)` | l'adresse de la page d'accueil | rien | affiche la page d'accueil et crée les deux piles vides |
| `visiter(self, adresse)` | une adresse | rien | empile la page affichée sur `precedentes`, affiche la nouvelle adresse et vide `suivantes` |
| `precedent(self)` | rien | un booléen | s'il y a une page précédente, empile la page affichée sur `suivantes`, affiche la page dépilée de `precedentes` et renvoie `True` ; sinon, ne change rien et renvoie `False` |
| `suivant(self)` | rien | un booléen | le même travail que `precedent`, en échangeant le rôle des deux piles |

**Exemple**

```python
nav = Navigateur("accueil.fr")
nav.visiter("meteo.fr")
nav.visiter("sport.fr")
nav.precedent()   # True
nav.page          # "meteo.fr"
nav.suivant()     # True
nav.page          # "sport.fr"
nav.suivant()     # False
```

<Indices>
<Indice>

« Afficher une page » revient à changer l'attribut `page`.

</Indice>
<Indice>

Vider une pile revient à la remplacer par une pile neuve : `self.suivantes = Pile()`.

</Indice>
<Indice>

```text
CLASSE Navigateur
    CONSTRUCTEUR(accueil)
        self.page ← accueil
        self.precedentes ← Pile()
        self.suivantes ← Pile()
    MÉTHODE visiter(adresse)
        self.precedentes.empiler(self.page)
        self.page ← adresse
        self.suivantes ← Pile()
    MÉTHODE precedent()
        SI self.precedentes.est_vide() ALORS RENVOYER Faux
        self.suivantes.empiler(self.page)
        self.page ← self.precedentes.depiler()
        RENVOYER Vrai
    MÉTHODE suivant()
        (comme precedent, en échangeant precedentes et suivantes)
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu[-1]

    def taille(self):
        return len(self.contenu)


class Navigateur:
    def __init__(self, accueil):
        self.page = accueil
        self.precedentes = Pile()
        self.suivantes = Pile()

    def visiter(self, adresse):
        self.precedentes.empiler(self.page)
        self.page = adresse
        self.suivantes = Pile()

    def precedent(self):
        if self.precedentes.est_vide():
            return False
        self.suivantes.empiler(self.page)
        self.page = self.precedentes.depiler()
        return True

    def suivant(self):
        if self.suivantes.est_vide():
            return False
        self.precedentes.empiler(self.page)
        self.page = self.suivantes.depiler()
        return True
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu[-1]

    def taille(self):
        return len(self.contenu)


class Navigateur:
    pass
```

</CodeDepart>
<Verification>

```python
nav = Navigateur("accueil.fr")
assert nav.page == "accueil.fr", "Le navigateur s'ouvre sur la page d'accueil."
assert isinstance(nav.precedentes, Pile) and isinstance(nav.suivantes, Pile), "precedentes et suivantes sont des objets Pile."
assert nav.precedent() is False and nav.page == "accueil.fr", "Pas de page précédente au départ."
nav.visiter("meteo.fr")
nav.visiter("sport.fr")
assert nav.page == "sport.fr" and nav.precedentes.contenu == ["accueil.fr", "meteo.fr"], "Les pages vues sont empilées sur precedentes."
assert nav.precedent() is True and nav.page == "meteo.fr", "precedent revient à meteo.fr."
assert nav.precedent() is True and nav.page == "accueil.fr", "Puis à accueil.fr."
assert nav.suivant() is True and nav.page == "meteo.fr", "suivant repart vers meteo.fr."
nav.visiter("cinema.fr")
assert nav.suivantes.est_vide(), "Visiter une page vide la pile suivantes."
assert nav.suivant() is False and nav.page == "cinema.fr", "Plus de page suivante après une visite."
assert nav.precedent() is True and nav.page == "meteo.fr", "La page précédente de cinema.fr est meteo.fr."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-4-4" label="4.4 [Difficile] - File circulaire" type="python">
<Enonce>
### File circulaire

Dans un lecteur de musique, la file des prochains morceaux a une place limitée. Pour ne jamais décaler les éléments, cette file utilise une liste de taille fixe et deux nombres : l'indice du premier élément et le nombre d'éléments. Arrivé au bout de la liste, l'indice repart à 0, d'où le nom de file circulaire. Écrire la classe `FileCirculaire`.

**Attributs**

| Attribut | Contenu |
|---|---|
| `capacite` | le nombre de cases (entier) |
| `cases` | une liste de `capacite` cases, toutes à `None` à la création |
| `debut` | l'indice de la case du premier élément, 0 à la création |
| `nombre` | le nombre d'éléments dans la file, 0 à la création |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self, capacite)` | la capacité | rien | crée une file vide de cette capacité |
| `est_vide(self)` | rien | un booléen | `True` si la file ne contient aucun élément |
| `est_pleine(self)` | rien | un booléen | `True` si toutes les cases sont occupées |
| `enfiler(self, element)` | un élément | un booléen | si la file n'est pas pleine, range l'élément dans la case qui suit le dernier élément et renvoie `True` ; sinon, renvoie `False` |
| `defiler(self)` | rien | le premier élément | le retire, remet sa case à `None` et le renvoie. Lève une `IndexError` si la file est vide. |

**Exemple**

```python
f = FileCirculaire(3)
f.enfiler("a")
f.enfiler("b")
f.enfiler("c")
f.defiler()     # "a"
f.enfiler("d")  # True, "d" va dans la case 0
f.cases         # ["d", "b", "c"]
```

<Indices>
<Indice>

Une liste de 3 cases vides se crée avec `[None] * 3`.

</Indice>
<Indice>

L'élément enfilé va dans la case d'indice `(self.debut + self.nombre) % self.capacite`. Le `%` fait repartir l'indice à 0 en bout de liste.

</Indice>
<Indice>

Après un défilement, `debut` avance d'une case, en repartant à 0 en bout de liste : `(self.debut + 1) % self.capacite`.

</Indice>
<Indice>

```text
CLASSE FileCirculaire
    CONSTRUCTEUR(capacite)
        self.capacite ← capacite
        self.cases ← liste de capacite fois None
        self.debut ← 0
        self.nombre ← 0
    MÉTHODE est_vide()
        RENVOYER self.nombre = 0
    MÉTHODE est_pleine()
        RENVOYER self.nombre = self.capacite
    MÉTHODE enfiler(element)
        SI self.est_pleine() ALORS RENVOYER Faux
        self.cases[(self.debut + self.nombre) % self.capacite] ← element
        self.nombre ← self.nombre + 1
        RENVOYER Vrai
    MÉTHODE defiler()
        SI self.est_vide() ALORS LEVER IndexError
        element ← self.cases[self.debut]
        self.cases[self.debut] ← None
        self.debut ← (self.debut + 1) % self.capacite
        self.nombre ← self.nombre - 1
        RENVOYER element
```

</Indice>
</Indices>

<Correction>

```python
class FileCirculaire:
    def __init__(self, capacite):
        self.capacite = capacite
        self.cases = [None] * capacite
        self.debut = 0
        self.nombre = 0

    def est_vide(self):
        return self.nombre == 0

    def est_pleine(self):
        return self.nombre == self.capacite

    def enfiler(self, element):
        if self.est_pleine():
            return False
        self.cases[(self.debut + self.nombre) % self.capacite] = element
        self.nombre = self.nombre + 1
        return True

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        element = self.cases[self.debut]
        self.cases[self.debut] = None
        self.debut = (self.debut + 1) % self.capacite
        self.nombre = self.nombre - 1
        return element
```

</Correction>
</Enonce>
<Verification>

```python
f = FileCirculaire(3)
assert f.capacite == 3 and f.cases == [None, None, None], "Une file neuve a 3 cases à None."
assert f.debut == 0 and f.nombre == 0 and f.est_vide() is True, "debut et nombre valent 0 au départ."
assert f.enfiler("a") and f.enfiler("b") and f.enfiler("c"), "Trois éléments entrent dans 3 cases."
assert f.est_pleine() is True and f.enfiler("x") is False, "Une file pleine refuse un élément."
assert f.cases == ["a", "b", "c"], "L'élément refusé n'est rangé nulle part."
assert f.defiler() == "a", "Le premier arrivé sort en premier."
assert f.cases == [None, "b", "c"] and f.debut == 1 and f.nombre == 2, "La case libérée revient à None et debut avance."
assert f.enfiler("d") is True and f.cases == ["d", "b", "c"], "d va dans la case 0 : la file repart au début de la liste."
assert [f.defiler(), f.defiler(), f.defiler()] == ["b", "c", "d"], "Les éléments sortent dans leur ordre d'arrivée."
assert f.est_vide() is True and f.debut == 1, "Après trois défilements depuis la case 1, debut revient à 1."
try:
    f.defiler()
    assert False, "defiler sur une file vide lève une IndexError."
except IndexError:
    pass
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-5-1" label="5.1 [Expert] - Parenthèses équilibrées" type="python">
<Enonce>
### Parenthèses équilibrées

Un éditeur de code signale les parenthèses mal fermées. Un texte est équilibré quand chaque parenthèse `(`, chaque crochet `[` et chaque accolade `{` ouvrant est refermé par le bon symbole, et dans le bon ordre. Les autres caractères ne comptent pas. Ce contrôle se fait avec une pile.

La classe `Pile` de l'exercice 3.2 est déjà dans l'éditeur. Écrire la fonction `est_equilibree`, qui utilise un objet `Pile`.

**Fonction**

| Fonction | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `est_equilibree(texte)` | un texte | un booléen | `True` si le texte est équilibré, `False` sinon |

**Exemple**

```python
est_equilibree("(a + b) * [c - d]")  # True
est_equilibree("{[()()]}")           # True
est_equilibree("([)]")               # False, le crochet est fermé avant la parenthèse
est_equilibree("((")                 # False, rien n'est fermé
est_equilibree("())")                # False, une parenthèse fermante de trop
```

<Indices>
<Indice>

Parcourir le texte caractère par caractère. Chaque symbole ouvrant est empilé.

</Indice>
<Indice>

Un symbole fermant doit correspondre au symbole ouvrant du sommet de la pile. Le dictionnaire `{")": "(", "]": "[", "}": "{"}` donne l'ouvrant attendu pour chaque fermant. Si la pile est vide à ce moment-là, le texte n'est pas équilibré.

</Indice>
<Indice>

À la fin du texte, la pile doit être vide. Sinon, un symbole est resté ouvert.

</Indice>
<Indice>

```text
FONCTION est_equilibree(texte)
    ouvrant_de ← dictionnaire { ")": "(", "]": "[", "}": "{" }
    pile ← Pile()
    POUR CHAQUE caractere DANS texte
        SI caractere est un ouvrant ALORS
            pile.empiler(caractere)
        SINON SI caractere est un fermant ALORS
            SI pile.est_vide() ALORS RENVOYER Faux
            SI pile.depiler() ≠ ouvrant_de[caractere] ALORS RENVOYER Faux
    RENVOYER pile.est_vide()
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu[-1]

    def taille(self):
        return len(self.contenu)


def est_equilibree(texte):
    ouvrant_de = {")": "(", "]": "[", "}": "{"}
    pile = Pile()
    for caractere in texte:
        if caractere in "([{":
            pile.empiler(caractere)
        elif caractere in ")]}":
            if pile.est_vide():
                return False
            if pile.depiler() != ouvrant_de[caractere]:
                return False
    return pile.est_vide()
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu[-1]

    def taille(self):
        return len(self.contenu)


def est_equilibree(texte):
    pass
```

</CodeDepart>
<Verification>

```python
assert est_equilibree("(a + b) * [c - d]") is True, "(a + b) * [c - d] est équilibré."
assert est_equilibree("{[()()]}") is True, "{[()()]} est équilibré."
assert est_equilibree("print(liste[0])") is True, "print(liste[0]) est équilibré."
assert est_equilibree("") is True, "Un texte vide est équilibré."
assert est_equilibree("([)]") is False, "([)] : le crochet est fermé avant la parenthèse."
assert est_equilibree("((") is False, "(( : rien n'est fermé."
assert est_equilibree("())") is False, "()) : une parenthèse fermante de trop."
assert est_equilibree(")") is False, ") : une fermante sans ouvrante."
assert est_equilibree("f(x]") is False, "f(x] : la parenthèse est fermée par un crochet."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-5-2" label="5.2 [Expert] - Calculatrice polonaise" type="python">
<Enonce>
### Calculatrice polonaise

Certaines calculatrices utilisent la notation polonaise inversée, où l'opérateur s'écrit après ses deux nombres. « 3 4 + » veut dire 3 + 4, et « 3 4 + 2 * » veut dire (3 + 4) × 2. Cette notation n'a pas besoin de parenthèses et se calcule avec une pile. Chaque nombre lu est empilé. Chaque opérateur dépile deux nombres, fait le calcul et empile le résultat. À la fin, la pile contient le résultat.

La classe `Pile` de l'exercice 3.2 est déjà dans l'éditeur. Écrire la fonction `evaluer_npi`, qui utilise un objet `Pile`. Les nombres de l'expression sont des entiers, les opérateurs sont `+`, `-`, `*` et `/`, et tous sont séparés par des espaces. L'expression est toujours correcte.

**Fonction**

| Fonction | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `evaluer_npi(expression)` | un texte | un nombre | le résultat du calcul |

**Exemple**

```python
evaluer_npi("3 4 + 2 *")          # 14
evaluer_npi("10 4 -")             # 6
evaluer_npi("5 1 2 + 4 * + 3 -")  # 14
```

<Indices>
<Indice>

`expression.split()` découpe le texte aux espaces : `"3 4 +".split()` donne `["3", "4", "+"]`. Un morceau qui n'est pas un opérateur se convertit en nombre avec `int`.

</Indice>
<Indice>

L'ordre compte pour `-` et `/`, car le premier nombre dépilé est celui de droite. Pour « 10 4 - », la pile donne 4 puis 10, et le calcul est 10 - 4.

</Indice>
<Indice>

```text
FONCTION evaluer_npi(expression)
    pile ← Pile()
    POUR CHAQUE morceau DANS expression découpée aux espaces
        SI morceau est un opérateur ALORS
            droite ← pile.depiler()
            gauche ← pile.depiler()
            pile.empiler(gauche morceau droite)
        SINON
            pile.empiler(morceau converti en entier)
    RENVOYER pile.depiler()
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu[-1]

    def taille(self):
        return len(self.contenu)


def evaluer_npi(expression):
    pile = Pile()
    for morceau in expression.split():
        if morceau in ("+", "-", "*", "/"):
            droite = pile.depiler()
            gauche = pile.depiler()
            if morceau == "+":
                pile.empiler(gauche + droite)
            elif morceau == "-":
                pile.empiler(gauche - droite)
            elif morceau == "*":
                pile.empiler(gauche * droite)
            else:
                pile.empiler(gauche / droite)
        else:
            pile.empiler(int(morceau))
    return pile.depiler()
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu[-1]

    def taille(self):
        return len(self.contenu)


def evaluer_npi(expression):
    pass
```

</CodeDepart>
<Verification>

```python
assert evaluer_npi("7") == 7, "Un nombre seul vaut lui-même."
assert evaluer_npi("3 4 +") == 7, "3 4 + vaut 3 + 4."
assert evaluer_npi("3 4 + 2 *") == 14, "3 4 + 2 * vaut (3 + 4) × 2."
assert evaluer_npi("10 4 -") == 6, "10 4 - vaut 10 - 4 : le premier nombre dépilé est celui de droite."
assert evaluer_npi("8 2 /") == 4, "8 2 / vaut 8 / 2."
assert evaluer_npi("5 1 2 + 4 * + 3 -") == 14, "5 1 2 + 4 * + 3 - vaut 5 + (1 + 2) × 4 - 3."
assert evaluer_npi("6 2 3 * -") == 0, "6 2 3 * - vaut 6 - 2 × 3."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-5-3" label="5.3 [Expert] - Pile qui connaît son minimum" type="python">
<Enonce>
### Pile qui connaît son minimum

Une station météo empile ses relevés de température. Elle doit pouvoir donner à tout moment la plus basse des températures de la pile, même après des dépilements, et sans parcourir toute la pile. Pour cela, la pile tient une seconde liste, `minimums`, de même longueur que `contenu`. La case d'indice `i` de `minimums` contient le plus petit des éléments de `contenu`, du bas de la pile jusqu'à l'indice `i`. Écrire la classe `PileMin`.

**Attributs**

| Attribut | Contenu |
|---|---|
| `contenu` | la liste des éléments, du bas vers le sommet, vide à la création |
| `minimums` | la liste des minimums décrite plus haut, vide à la création |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self)` | rien | rien | crée les deux listes vides |
| `est_vide(self)` | rien | un booléen | `True` si la pile ne contient aucun élément |
| `empiler(self, element)` | un élément | rien | pose l'élément au sommet et met `minimums` à jour |
| `depiler(self)` | rien | l'élément du sommet | le retire, met `minimums` à jour et le renvoie. Lève une `IndexError` si la pile est vide. |
| `minimum(self)` | rien | un élément | le plus petit élément de la pile, sans parcourir `contenu`. Lève une `IndexError` si la pile est vide. |
| `taille(self)` | rien | un entier | le nombre d'éléments |

**Exemple**

```python
p = PileMin()
for t in [5, 3, 7, 3, 1]:
    p.empiler(t)
p.minimums   # [5, 3, 3, 3, 1]
p.minimum()  # 1
p.depiler()  # 1
p.minimum()  # 3
```

<Indices>
<Indice>

Quand un élément est empilé, le nouveau minimum est le plus petit entre cet élément et l'ancien minimum, qui est le dernier élément de `minimums`. Si la pile était vide, le minimum est l'élément lui-même.

</Indice>
<Indice>

Dépiler retire aussi le dernier élément de `minimums`. Le minimum d'avant redevient alors le bon, sans aucun calcul.

</Indice>
<Indice>

```text
CLASSE PileMin
    CONSTRUCTEUR()
        self.contenu ← liste vide
        self.minimums ← liste vide
    MÉTHODE est_vide()
        RENVOYER longueur de self.contenu = 0
    MÉTHODE empiler(element)
        ajouter element à la fin de self.contenu
        SI self.minimums est vide ALORS
            ajouter element à la fin de self.minimums
        SINON
            ajouter minimum(element ; dernier de self.minimums) à la fin de self.minimums
    MÉTHODE depiler()
        SI self.est_vide() ALORS LEVER IndexError
        retirer le dernier élément de self.minimums
        retirer le dernier élément de self.contenu et le RENVOYER
    MÉTHODE minimum()
        SI self.est_vide() ALORS LEVER IndexError
        RENVOYER le dernier élément de self.minimums
    MÉTHODE taille()
        RENVOYER longueur de self.contenu
```

</Indice>
</Indices>

<Correction>

```python
class PileMin:
    def __init__(self):
        self.contenu = []
        self.minimums = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)
        if len(self.minimums) == 0:
            self.minimums.append(element)
        else:
            self.minimums.append(min(element, self.minimums[-1]))

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        self.minimums.pop()
        return self.contenu.pop()

    def minimum(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.minimums[-1]

    def taille(self):
        return len(self.contenu)
```

</Correction>
</Enonce>
<Verification>

```python
p = PileMin()
assert p.contenu == [] and p.minimums == [] and p.est_vide() is True, "Une pile neuve a deux listes vides."
for t in [5, 3, 7, 3, 1]:
    p.empiler(t)
assert p.contenu == [5, 3, 7, 3, 1], "Les éléments sont empilés dans contenu."
assert p.minimums == [5, 3, 3, 3, 1], "minimums contient le plus petit élément à chaque hauteur."
assert p.minimum() == 1 and p.taille() == 5, "Le minimum est 1."
assert p.depiler() == 1 and p.minimum() == 3, "Après avoir dépilé 1, le minimum est 3."
assert p.depiler() == 3 and p.minimum() == 3, "Il reste un autre 3 dans la pile."
assert p.depiler() == 7 and p.minimum() == 3, "Dépiler 7 ne change pas le minimum."
assert p.depiler() == 3 and p.minimum() == 5, "Il ne reste que 5."
assert p.minimums == [5] and p.taille() == 1, "minimums a toujours la même longueur que contenu."
p.depiler()
try:
    p.minimum()
    assert False, "minimum sur une pile vide lève une IndexError."
except IndexError:
    pass
try:
    p.depiler()
    assert False, "depiler sur une pile vide lève une IndexError."
except IndexError:
    pass
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-5-4" label="5.4 [Expert] - La comptine du loup" type="python">
<Enonce>
### La comptine du loup

Des enfants en cercle choisissent le loup avec une comptine. La comptine compte `k` enfants en tournant dans le cercle, en commençant par le premier de la liste. Le `k`-ième enfant sort du cercle, puis le compte reprend à l'enfant suivant. Le dernier enfant qui reste est le loup.

Une file représente bien le cercle. Un enfant compté mais pas éliminé passe du début à la fin de la file. La classe `File` de l'exercice 3.3 est déjà dans l'éditeur. Écrire les deux fonctions ci-dessous, qui utilisent un objet `File`.

**Fonctions**

| Fonction | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `ordre_elimination(enfants, k)` | une liste de prénoms et un entier `k` (au moins 1) | une liste de prénoms | les prénoms dans l'ordre où les enfants sortent du cercle. La liste `enfants` ne doit pas être modifiée. |
| `loup(enfants, k)` | une liste de prénoms et un entier `k` | un prénom | le prénom du loup, c'est-à-dire du dernier enfant à sortir |

**Exemple**

```python
enfants = ["Ana", "Bob", "Céa", "Dan", "Eli"]
ordre_elimination(enfants, 2)  # ["Bob", "Dan", "Ana", "Eli", "Céa"]
loup(enfants, 2)               # "Céa"
```

Avec `k = 2`, Ana et Bob sont comptés et Bob sort. Puis Céa et Dan sont comptés et Dan sort. Puis Eli et Ana sont comptés et Ana sort, et ainsi de suite.

<Indices>
<Indice>

Commencer par enfiler tous les prénoms dans une file. Cette file est une copie du cercle, donc la liste `enfants` ne change pas.

</Indice>
<Indice>

Tant que la file n'est pas vide, faire passer `k - 1` enfants du début à la fin (`cercle.enfiler(cercle.defiler())`), puis défiler l'enfant suivant, qui sort du cercle.

</Indice>
<Indice>

`loup` n'a pas besoin de refaire le travail, car le loup est le dernier prénom de la liste renvoyée par `ordre_elimination`.

</Indice>
<Indice>

```text
FONCTION ordre_elimination(enfants, k)
    cercle ← File()
    POUR CHAQUE enfant DANS enfants
        cercle.enfiler(enfant)
    ordre ← liste vide
    TANT QUE NON cercle.est_vide()
        RÉPÉTER k - 1 FOIS
            cercle.enfiler(cercle.defiler())
        ajouter cercle.defiler() à la fin de ordre
    RENVOYER ordre

FONCTION loup(enfants, k)
    RENVOYER le dernier élément de ordre_elimination(enfants, k)
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def enfiler(self, element):
        self.contenu.append(element)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.contenu.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.contenu[0]

    def taille(self):
        return len(self.contenu)

    def __repr__(self):
        return f"File({self.contenu})"


def ordre_elimination(enfants, k):
    cercle = File()
    for enfant in enfants:
        cercle.enfiler(enfant)
    ordre = []
    while not cercle.est_vide():
        for _ in range(k - 1):
            cercle.enfiler(cercle.defiler())
        ordre.append(cercle.defiler())
    return ordre


def loup(enfants, k):
    return ordre_elimination(enfants, k)[-1]
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def enfiler(self, element):
        self.contenu.append(element)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.contenu.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.contenu[0]

    def taille(self):
        return len(self.contenu)

    def __repr__(self):
        return f"File({self.contenu})"


def ordre_elimination(enfants, k):
    pass


def loup(enfants, k):
    pass
```

</CodeDepart>
<Verification>

```python
enfants = ["Ana", "Bob", "Céa", "Dan", "Eli"]
assert ordre_elimination(enfants, 2) == ["Bob", "Dan", "Ana", "Eli", "Céa"], "Avec k = 2, Bob sort en premier, puis Dan, Ana, Eli et Céa."
assert enfants == ["Ana", "Bob", "Céa", "Dan", "Eli"], "La liste enfants n'est pas modifiée."
assert loup(enfants, 2) == "Céa", "Avec k = 2, Céa est le loup."
assert ordre_elimination(enfants, 3) == ["Céa", "Ana", "Eli", "Bob", "Dan"], "Avec k = 3, Céa sort en premier."
assert loup(enfants, 3) == "Dan", "Avec k = 3, Dan est le loup."
assert ordre_elimination(enfants, 1) == enfants, "Avec k = 1, les enfants sortent dans l'ordre de la liste."
assert ordre_elimination(["Zoé"], 4) == ["Zoé"] and loup(["Zoé"], 4) == "Zoé", "Un enfant seul est le loup."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-6-1" label="6.1 [Mini-projet] - Le guichet de la poste" type="python">
<Enonce>
### Le guichet de la poste

**Contexte.** Dans un petit bureau de poste, un seul guichet est ouvert. Les clients arrivent, prennent place dans la file et sont servis dans l'ordre d'arrivée. La responsable veut savoir combien de temps les clients attendent, pour décider s'il faut ouvrir un second guichet. Le programme simule la journée. Le temps est compté en minutes depuis l'ouverture.

**Comment se passe un service.** Le guichet est libre à partir d'une certaine minute, rangée dans l'attribut `heure` (0 à l'ouverture). Le service d'un client ne commence que lorsque le guichet est libre et que le client est arrivé, donc au plus tard de ces deux moments. L'attente du client est le temps entre son arrivée et le début de son service. Une fois le client servi, le guichet est libre de nouveau à la fin du service.

Par exemple, Ana arrive à 0 pour 5 minutes, Bob arrive à 2 pour 3 minutes et Céa arrive à 20 pour 4 minutes. Ana est servie de 0 à 5 et n'attend pas. Bob est servi de 5 à 8 et attend 3 minutes. Le guichet est libre à 8, mais Céa n'arrive qu'à 20. Elle est servie de 20 à 24 et n'attend pas.

La classe `File` de l'exercice 3.3 est déjà dans l'éditeur. Écrire les classes `Client` et `Guichet`. Les clients sont toujours donnés au guichet dans leur ordre d'arrivée.

**Classe `Client`**

| Attribut | Contenu |
|---|---|
| `nom` | le prénom du client (texte) |
| `arrivee` | la minute d'arrivée (entier) |
| `duree` | la durée de son service, en minutes (entier) |
| `attente` | son attente en minutes, `None` tant qu'il n'est pas servi |

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self, nom, arrivee, duree)` | le prénom, la minute d'arrivée et la durée | rien | crée les quatre attributs |
| `__repr__(self)` | rien | un texte | par exemple `"Client(Ana)"` |

**Classe `Guichet`**

| Attribut | Contenu |
|---|---|
| `file` | un objet `File` des clients qui attendent |
| `heure` | la minute à partir de laquelle le guichet est libre, 0 à la création |
| `servis` | la liste des clients déjà servis, dans l'ordre, vide à la création |

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self)` | rien | rien | crée une file vide, l'heure à 0 et une liste de clients servis vide |
| `arriver(self, client)` | un `Client` | rien | met le client dans la file |
| `en_attente(self)` | rien | un entier | le nombre de clients dans la file |
| `servir_suivant(self)` | rien | le `Client` servi, ou `None` | sert le premier client de la file : calcule son attente, met `heure` à jour et l'ajoute à `servis`. Renvoie `None` si la file est vide. |
| `servir_tous(self)` | rien | rien | sert les clients jusqu'à ce que la file soit vide |
| `attente_moyenne(self)` | rien | un nombre | l'attente moyenne des clients servis, arrondie au dixième, ou 0 si personne n'a été servi |
| `plus_longue_attente(self)` | rien | un `Client`, ou `None` | le client servi qui a le plus attendu (le premier servi en cas d'égalité), ou `None` si personne n'a été servi |
| `__str__(self)` | rien | un texte | par exemple `"Guichet : 2 en attente, 3 servis"` |

**Exemple**

```python
g = Guichet()
g.arriver(Client("Ana", 0, 5))
g.arriver(Client("Bob", 2, 3))
g.arriver(Client("Céa", 20, 4))
print(g)                 # Guichet : 3 en attente, 0 servis
g.servir_suivant()       # Client(Ana)
g.servir_tous()
g.heure                  # 24
g.attente_moyenne()      # 1.0
g.plus_longue_attente()  # Client(Bob)
```

<Indices>
<Indice>

Commencer par `Client`, qui ne fait que ranger des valeurs. Dans `Guichet`, les méthodes `arriver` et `en_attente` ne font qu'appeler une méthode de `self.file`.

</Indice>
<Indice>

Le début du service est `max(self.heure, client.arrivee)`. L'attente est ce début moins l'arrivée, et le guichet se libère au début du service plus la durée.

</Indice>
<Indice>

`servir_tous` appelle `self.servir_suivant()` dans une boucle `while`. Pour `plus_longue_attente`, garder le meilleur client trouvé et ne le remplacer que par un client qui a attendu strictement plus longtemps.

</Indice>
<Indice>

```text
(cœur du programme : servir le client suivant)
MÉTHODE servir_suivant()
    SI self.file.est_vide() ALORS RENVOYER None
    client ← self.file.defiler()
    debut ← maximum(self.heure ; client.arrivee)
    client.attente ← debut - client.arrivee
    self.heure ← debut + client.duree
    ajouter client à la fin de self.servis
    RENVOYER client
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def enfiler(self, element):
        self.contenu.append(element)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.contenu.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.contenu[0]

    def taille(self):
        return len(self.contenu)

    def __repr__(self):
        return f"File({self.contenu})"


class Client:
    def __init__(self, nom, arrivee, duree):
        self.nom = nom
        self.arrivee = arrivee
        self.duree = duree
        self.attente = None

    def __repr__(self):
        return f"Client({self.nom})"


class Guichet:
    def __init__(self):
        self.file = File()
        self.heure = 0
        self.servis = []

    def arriver(self, client):
        self.file.enfiler(client)

    def en_attente(self):
        return self.file.taille()

    def servir_suivant(self):
        if self.file.est_vide():
            return None
        client = self.file.defiler()
        debut = max(self.heure, client.arrivee)
        client.attente = debut - client.arrivee
        self.heure = debut + client.duree
        self.servis.append(client)
        return client

    def servir_tous(self):
        while not self.file.est_vide():
            self.servir_suivant()

    def attente_moyenne(self):
        if len(self.servis) == 0:
            return 0
        total = 0
        for client in self.servis:
            total = total + client.attente
        return round(total / len(self.servis), 1)

    def plus_longue_attente(self):
        if len(self.servis) == 0:
            return None
        meilleur = self.servis[0]
        for client in self.servis:
            if client.attente > meilleur.attente:
                meilleur = client
        return meilleur

    def __str__(self):
        return f"Guichet : {self.en_attente()} en attente, {len(self.servis)} servis"
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def enfiler(self, element):
        self.contenu.append(element)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.contenu.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.contenu[0]

    def taille(self):
        return len(self.contenu)

    def __repr__(self):
        return f"File({self.contenu})"


class Client:
    pass


class Guichet:
    pass
```

</CodeDepart>
<Verification>

```python
ana = Client("Ana", 0, 5)
assert ana.nom == "Ana" and ana.arrivee == 0 and ana.duree == 5 and ana.attente is None, "Un client a un nom, une arrivée, une durée, et une attente à None."
assert repr(ana) == "Client(Ana)", "Le texte attendu est 'Client(Ana)'."
g = Guichet()
assert isinstance(g.file, File) and g.heure == 0 and g.servis == [], "Un guichet neuf a une File vide, l'heure à 0 et aucun client servi."
assert g.servir_suivant() is None, "Sans client, servir_suivant renvoie None."
assert g.attente_moyenne() == 0 and g.plus_longue_attente() is None, "Sans client servi, attente moyenne 0 et aucun client."
bob = Client("Bob", 2, 3)
cea = Client("Céa", 20, 4)
g.arriver(ana)
g.arriver(bob)
g.arriver(cea)
assert g.en_attente() == 3, "Trois clients dans la file."
assert str(g) == "Guichet : 3 en attente, 0 servis", "Le texte attendu est 'Guichet : 3 en attente, 0 servis'."
assert g.servir_suivant() is ana and ana.attente == 0 and g.heure == 5, "Ana est servie de 0 à 5 sans attendre."
assert g.servir_suivant() is bob and bob.attente == 3 and g.heure == 8, "Bob arrive à 2, il est servi de 5 à 8 : 3 minutes d'attente."
assert str(g) == "Guichet : 1 en attente, 2 servis", "Après deux services : 1 en attente, 2 servis."
g.servir_tous()
assert cea.attente == 0 and g.heure == 24, "Céa arrive à 20 sur un guichet libre : servie de 20 à 24."
assert g.servis == [ana, bob, cea] and g.en_attente() == 0, "Les trois clients sont servis dans l'ordre."
assert g.attente_moyenne() == 1.0 and g.plus_longue_attente() is bob, "Attente moyenne 1.0, Bob a le plus attendu."
h = Guichet()
for nom, arrivee, duree in [("Xia", 0, 5), ("Yan", 1, 5), ("Zed", 3, 1)]:
    h.arriver(Client(nom, arrivee, duree))
h.servir_tous()
assert [c.attente for c in h.servis] == [0, 4, 7], "Attentes 0, 4 et 7 minutes."
assert h.attente_moyenne() == 3.7, "Moyenne de 0, 4 et 7 arrondie au dixième : 3.7."
assert h.plus_longue_attente().nom == "Zed" and h.heure == 11, "Zed a attendu le plus longtemps, le guichet est libre à 11."
egal = Guichet()
egal.arriver(Client("Lou", 0, 2))
egal.arriver(Client("Max", 0, 2))
egal.arriver(Client("Noé", 2, 1))
egal.servir_tous()
assert [c.attente for c in egal.servis] == [0, 2, 2] and egal.plus_longue_attente().nom == "Max", "En cas d'égalité, le premier servi est gardé."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="anat-poo-6-2" label="6.2 [Mini-projet] - Annuler et rétablir" type="python">
<Enonce>
### Annuler et rétablir

**Contexte.** Un petit éditeur de texte propose les boutons « Annuler » et « Rétablir ». Avant chaque modification, le texte est enregistré sur une pile, ce qui permet de revenir en arrière autant de fois que nécessaire. « Rétablir » refait une modification qui vient d'être annulée. Dès qu'une nouvelle modification est faite, les modifications annulées ne peuvent plus être rétablies.

**Les deux piles.** La pile `annulations` contient les textes d'avant chaque modification, le plus récent au sommet. La pile `retablissements` contient les textes quittés avec « Annuler ». Annuler empile le texte actuel sur `retablissements` et reprend le texte du sommet de `annulations`. Rétablir fait l'inverse.

La classe `Pile` de l'exercice 3.2 est déjà dans l'éditeur. Écrire la classe `Editeur`.

**Attributs**

| Attribut | Contenu |
|---|---|
| `texte` | le texte affiché, `""` à la création |
| `annulations` | un objet `Pile` des textes d'avant chaque modification |
| `retablissements` | un objet `Pile` des textes quittés avec « Annuler » |

**Méthodes**

| Méthode | Reçoit | Renvoie | Rôle |
|---|---|---|---|
| `__init__(self)` | rien | rien | crée un texte vide et les deux piles vides |
| `enregistrer(self)` | rien | rien | empile le texte actuel sur `annulations` et vide `retablissements`. Chaque modification l'appelle avant de changer le texte. |
| `ecrire(self, morceau)` | un texte | rien | ajoute le morceau à la fin du texte |
| `effacer(self, n)` | un entier | rien | retire les `n` derniers caractères du texte, ou tout le texte s'il est plus court |
| `remplacer(self, ancien, nouveau)` | deux textes | un entier | remplace chaque `ancien` par `nouveau` et renvoie le nombre de remplacements. S'il n'y en a aucun, rien n'est enregistré. |
| `annuler(self)` | rien | un booléen | revient au texte d'avant la dernière modification et renvoie `True`, ou renvoie `False` s'il n'y a rien à annuler |
| `retablir(self)` | rien | un booléen | refait la dernière modification annulée et renvoie `True`, ou renvoie `False` s'il n'y a rien à rétablir |
| `nombre_mots(self)` | rien | un entier | le nombre de mots du texte, séparés par des espaces |
| `__str__(self)` | rien | un texte | le texte affiché |

**Exemple**

```python
ed = Editeur()
ed.ecrire("Bonjour")
ed.ecrire(" tout le monde")
ed.effacer(5)
print(ed)                                  # "Bonjour tout le "
ed.annuler()                               # True
print(ed)                                  # "Bonjour tout le monde"
ed.remplacer("tout le monde", "à tous")    # 1
print(ed)                                  # "Bonjour à tous"
ed.nombre_mots()                           # 3
```

<Indices>
<Indice>

Commencer par `enregistrer`, puis `ecrire`. Une fois `annuler` écrite, il est possible de tester tout de suite avec ces deux modifications.

</Indice>
<Indice>

Les méthodes des textes Python font une bonne partie du travail. `texte[:k]` garde les `k` premiers caractères, `texte.count(ancien)` compte les apparitions et `texte.replace(ancien, nouveau)` renvoie le texte remplacé. Pour `effacer`, attention à ne pas calculer un nombre de caractères négatif.

</Indice>
<Indice>

`retablir` a la même forme que `annuler`, en échangeant le rôle des deux piles. Elle n'appelle pas `enregistrer`, sinon la pile `retablissements` serait vidée.

</Indice>
<Indice>

```text
(cœur du programme : une modification, puis annuler)
MÉTHODE enregistrer()
    self.annulations.empiler(self.texte)
    self.retablissements ← Pile()
MÉTHODE ecrire(morceau)
    self.enregistrer()
    self.texte ← self.texte + morceau
MÉTHODE annuler()
    SI self.annulations.est_vide() ALORS RENVOYER Faux
    self.retablissements.empiler(self.texte)
    self.texte ← self.annulations.depiler()
    RENVOYER Vrai
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu[-1]

    def taille(self):
        return len(self.contenu)


class Editeur:
    def __init__(self):
        self.texte = ""
        self.annulations = Pile()
        self.retablissements = Pile()

    def enregistrer(self):
        self.annulations.empiler(self.texte)
        self.retablissements = Pile()

    def ecrire(self, morceau):
        self.enregistrer()
        self.texte = self.texte + morceau

    def effacer(self, n):
        self.enregistrer()
        garder = max(0, len(self.texte) - n)
        self.texte = self.texte[:garder]

    def remplacer(self, ancien, nouveau):
        nombre = self.texte.count(ancien)
        if nombre > 0:
            self.enregistrer()
            self.texte = self.texte.replace(ancien, nouveau)
        return nombre

    def annuler(self):
        if self.annulations.est_vide():
            return False
        self.retablissements.empiler(self.texte)
        self.texte = self.annulations.depiler()
        return True

    def retablir(self):
        if self.retablissements.est_vide():
            return False
        self.annulations.empiler(self.texte)
        self.texte = self.retablissements.depiler()
        return True

    def nombre_mots(self):
        return len(self.texte.split())

    def __str__(self):
        return self.texte
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.contenu = []

    def est_vide(self):
        return len(self.contenu) == 0

    def empiler(self, element):
        self.contenu.append(element)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.contenu[-1]

    def taille(self):
        return len(self.contenu)


class Editeur:
    pass
```

</CodeDepart>
<Verification>

```python
ed = Editeur()
assert ed.texte == "" and isinstance(ed.annulations, Pile) and isinstance(ed.retablissements, Pile), "Un éditeur neuf a un texte vide et deux objets Pile."
assert ed.annuler() is False and ed.retablir() is False, "Rien à annuler ni à rétablir au départ."
ed.ecrire("Bonjour")
ed.ecrire(" tout le monde")
assert str(ed) == "Bonjour tout le monde", "ecrire ajoute à la fin du texte."
assert ed.annulations.contenu == ["", "Bonjour"], "Chaque modification empile le texte d'avant sur annulations."
ed.effacer(5)
assert ed.texte == "Bonjour tout le ", "effacer(5) retire les 5 derniers caractères."
assert ed.annuler() is True and ed.texte == "Bonjour tout le monde", "annuler revient au texte d'avant effacer."
assert ed.retablir() is True and ed.texte == "Bonjour tout le ", "retablir refait l'effacement."
assert ed.annuler() is True and ed.texte == "Bonjour tout le monde", "Puis annuler le défait à nouveau."
assert ed.remplacer("tout le monde", "à tous") == 1 and ed.texte == "Bonjour à tous", "Un remplacement."
assert ed.retablissements.est_vide() and ed.retablir() is False, "Une nouvelle modification empêche de rétablir."
assert ed.nombre_mots() == 3, "Bonjour à tous : 3 mots."
assert ed.remplacer("xyz", "a") == 0 and ed.texte == "Bonjour à tous", "Sans remplacement, le texte ne change pas."
assert ed.annuler() is True and ed.texte == "Bonjour tout le monde", "Un remplacement raté n'est pas enregistré."
assert ed.annuler() and ed.texte == "Bonjour", "Retour à Bonjour."
assert ed.annuler() and ed.texte == "", "Retour au texte vide."
assert ed.annuler() is False, "Plus rien à annuler."
court = Editeur()
court.ecrire("abc")
court.effacer(10)
assert court.texte == "", "Effacer plus de caractères qu'il n'y en a vide le texte."
assert court.annuler() and court.texte == "abc", "Et cet effacement s'annule."
assert Editeur().nombre_mots() == 0, "Un texte vide n'a aucun mot."
r = Editeur()
r.ecrire("la la la")
assert r.remplacer("la", "do") == 3 and str(r) == "do do do", "remplacer renvoie le nombre de remplacements."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
