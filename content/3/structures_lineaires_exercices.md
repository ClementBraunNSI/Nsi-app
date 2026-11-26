---
title: 'Exercices : Piles et files'
description: 'Programmer les classes Pile et File, puis les utiliser pour résoudre des problèmes : fiche progressive par niveau.'
icon: "layers"
level: TNSI
order: 155
chapter: Structures de données
badgeId: terminale_exercices_piles_files
meta: 'Piles et files en Python : classes Pile et File, parenthésage, notation polonaise inverse, files d''attente'
prerequisites:
  - structures_lineaires
audience: public
---

Le niveau **Pas à pas** fait programmer la classe `Pile`, puis la classe `File`, une méthode à la fois, avec un pense-bête à côté de chaque énoncé. Les autres niveaux se débloquent quand ces neuf exercices sont validés. Dans chacun d'eux, le code de départ fournit une classe `Pile` ou `File` toute faite, qu'il faut utiliser ou compléter pour résoudre le problème posé. Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de classes, de méthodes et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

## Les classes de la fiche

Après le niveau Pas à pas, le code de départ de chaque exercice contient ces deux classes, ou l'une des deux. Les éléments sont rangés dans une liste Python, `elements`. Le sommet de la pile est le dernier élément de cette liste. La tête de la file est le premier élément, et sa queue le dernier.

| `Pile` | `File` | Rôle |
| --- | --- | --- |
| `Pile()` | `File()` | crée une structure vide |
| `p.est_vide()` | `f.est_vide()` | renvoie `True` si la structure est vide |
| `p.empiler(x)` | `f.enfiler(x)` | ajoute `x` au sommet de la pile, ou en queue de la file |
| `p.depiler()` | `f.defiler()` | retire et renvoie le sommet de la pile, ou la tête de la file |
| `p.sommet()` | `f.premier()` | renvoie le sommet, ou la tête, sans le retirer |
| `p.taille()` | `f.taille()` | renvoie le nombre d'éléments |

Retirer ou lire un élément d'une structure vide lève une erreur `IndexError`. Sauf mention contraire, les fonctions écrites hors des classes n'utilisent que ces méthodes et ne touchent pas directement à l'attribut `elements`.

<ExerciseTabs courseId="terminale-piles-files" courseTitle="Piles et files" unlockAfter="Pas à pas">

<ExerciseSection id="tnsi-pf-0-1" label="0.1 [Pas à pas] - Créer la classe Pile" type="python">
<Enonce>
### Créer la classe Pile

Une pile est représentée par un objet de la classe `Pile`. Ses éléments sont rangés dans un attribut `elements`, une liste Python dont le dernier élément est le sommet de la pile.

Compléter la classe `Pile` de l'éditeur :

- le constructeur `__init__` crée l'attribut `elements`, une liste vide ;
- la méthode `est_vide()` renvoie `True` si la pile ne contient aucun élément, et `False` sinon.

```python
p = Pile()
print(p.est_vide())   # True
```

<PostIt>

```python
class Boite:
    def __init__(self):
        self.contenu = []

    def est_pleine(self):
        return len(self.contenu) > 3
```

- `self.contenu` : un attribut propre à chaque objet
- chaque méthode reçoit `self` en premier paramètre
- `len(liste) == 0` : vrai si la liste est vide

</PostIt>

<Indices>
<Indice>

L'attribut se crée dans `__init__`, avec `self.elements = []`. Une liste écrite en dehors de `__init__` serait partagée par toutes les piles.

</Indice>
<Indice>

`est_vide` compare la longueur de `self.elements` à 0 et renvoie le résultat de la comparaison.

</Indice>
<Indice>

```text
CLASSE Pile
    CONSTRUCTEUR
        elements ← liste vide
    MÉTHODE est_vide()
        RENVOYER longueur(elements) = 0
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        ...

    def est_vide(self):
        ...
```

</CodeDepart>
<Verification>

```python
p = Pile()
assert p.elements == [], "Une nouvelle pile a un attribut elements égal à []."
assert p.est_vide() is True, "Une nouvelle pile est vide : est_vide() renvoie True."
p.elements.append(5)
assert p.est_vide() is False, "Une pile qui contient un élément n'est pas vide."
q = Pile()
assert q.est_vide() is True and q.elements is not p.elements, "Chaque pile a sa propre liste : la créer dans __init__."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-0-2" label="0.2 [Pas à pas] - Empiler" type="python">
<Enonce>
### Empiler

Ajouter à la classe `Pile` la méthode `empiler(x)`, qui place `x` au sommet de la pile, c'est-à-dire à la fin de la liste `elements`. Elle ne renvoie rien.

```python
p = Pile()
p.empiler(4)
p.empiler(8)
print(p.elements)   # [4, 8]
```

<PostIt>

- `liste.append(x)` : ajoute `x` à la fin de la liste
- dans une méthode, la liste de la pile s'écrit `self.elements`
- une méthode sans `return` renvoie `None`
- appel : `p.empiler(4)`

</PostIt>

<Indices>
<Indice>

Le sommet est la fin de la liste, et `append` ajoute justement un élément à la fin.

</Indice>
<Indice>

La méthode reçoit deux paramètres : `self`, la pile, et `x`, l'élément à empiler.

</Indice>
<Indice>

```text
MÉTHODE empiler(x)
    ajouter x à la fin de elements
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        ...
```

</CodeDepart>
<Verification>

```python
p = Pile()
r = p.empiler(4)
p.empiler(8)
assert p.elements == [4, 8], "Après empiler(4) puis empiler(8), elements vaut [4, 8] : le sommet est à la fin."
assert r is None, "empiler ne renvoie rien."
assert p.est_vide() is False, "Une pile où l'on vient d'empiler n'est pas vide."
q = Pile()
assert q.elements == [], "Empiler sur une pile ne change pas les autres piles."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-0-3" label="0.3 [Pas à pas] - Dépiler" type="python">
<Enonce>
### Dépiler

Ajouter à la classe `Pile` la méthode `depiler()`, qui retire le sommet de la pile et le renvoie.

Dépiler une pile vide n'a pas de sens : dans ce cas, la méthode lève l'erreur `IndexError("pile vide")`.

```python
p = Pile()
p.empiler(4)
p.empiler(8)
print(p.depiler())   # 8
print(p.elements)    # [4]
```

<PostIt>

- `liste.pop()` : retire le dernier élément et le renvoie
- `raise IndexError("message")` : arrête la méthode avec une erreur
- `self.est_vide()` : appelle une autre méthode de la pile
- tester le cas vide avant de retirer

</PostIt>

<Indices>
<Indice>

`pop()` sans argument retire la fin de la liste, c'est-à-dire le sommet, et renvoie l'élément retiré.

</Indice>
<Indice>

Sur une liste vide, `pop` lève aussi une `IndexError`, mais avec un autre message. Il faut donc tester `self.est_vide()` d'abord.

</Indice>
<Indice>

```text
MÉTHODE depiler()
    SI est_vide() ALORS lever IndexError("pile vide")
    RENVOYER le dernier élément de elements, après l'avoir retiré
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        ...
```

</CodeDepart>
<Verification>

```python
p = Pile()
p.empiler(4)
p.empiler(8)
assert p.depiler() == 8, "depiler renvoie le dernier élément empilé : 8."
assert p.elements == [4], "Le sommet est retiré : il reste [4]."
p.empiler(1)
avant = list(p.elements)
p.empiler(9)
assert p.depiler() == 9 and p.elements == avant, "Empiler x puis dépiler renvoie x, et la pile retrouve son contenu."
try:
    Pile().depiler()
    message = None
except IndexError as erreur:
    message = str(erreur)
assert message == "pile vide", "Dépiler une pile vide lève IndexError('pile vide')."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-0-4" label="0.4 [Pas à pas] - Lire le sommet" type="python">
<Enonce>
### Lire le sommet

Ajouter à la classe `Pile` la méthode `sommet()`, qui renvoie le sommet de la pile **sans le retirer**. Sur une pile vide, elle lève l'erreur `IndexError("pile vide")`.

```python
p = Pile()
p.empiler(4)
p.empiler(8)
print(p.sommet())    # 8
print(p.elements)    # [4, 8]
```

<PostIt>

- `liste[-1]` : le dernier élément, sans le retirer
- sur une liste vide, `liste[-1]` lève une erreur
- `raise IndexError("pile vide")`
- `sommet` ne modifie pas `self.elements`

</PostIt>

<Indices>
<Indice>

Le sommet est le dernier élément de `self.elements`. L'indice `-1` le désigne sans le retirer.

</Indice>
<Indice>

Comme pour `depiler`, le cas de la pile vide se traite en premier.

</Indice>
<Indice>

```text
MÉTHODE sommet()
    SI est_vide() ALORS lever IndexError("pile vide")
    RENVOYER le dernier élément de elements
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        ...
```

</CodeDepart>
<Verification>

```python
p = Pile()
p.empiler(4)
p.empiler(8)
assert p.sommet() == 8, "Le sommet est le dernier élément empilé : 8."
assert p.elements == [4, 8], "sommet ne retire rien : elements vaut toujours [4, 8]."
p.empiler("x")
assert p.sommet() == "x", "Juste après empiler(x), le sommet vaut x."
p.depiler()
p.depiler()
assert p.sommet() == 4, "Après deux dépilements, le sommet vaut 4."
try:
    Pile().sommet()
    message = None
except IndexError as erreur:
    message = str(erreur)
assert message == "pile vide", "Lire le sommet d'une pile vide lève IndexError('pile vide')."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-0-5" label="0.5 [Pas à pas] - Taille et remplissage" type="python">
<Enonce>
### Taille et remplissage

1. Ajouter à la classe `Pile` la méthode `taille()`, qui renvoie le nombre d'éléments de la pile.
2. En dehors de la classe, écrire la fonction `pile_de(liste)`, qui crée une nouvelle pile, y empile les éléments de `liste` dans l'ordre, puis la renvoie. Le dernier élément de `liste` se retrouve ainsi au sommet.

```python
p = pile_de([3, 1, 4])
print(p.taille())    # 3
print(p.sommet())    # 4
```

<PostIt>

- `len(liste)` : nombre d'éléments d'une liste
- `p = Pile()` : crée une pile vide
- `for x in liste:` puis `p.empiler(x)`
- une fonction hors de la classe n'a pas de `self`

</PostIt>

<Indices>
<Indice>

La taille de la pile est la longueur de la liste `self.elements`.

</Indice>
<Indice>

Dans `pile_de`, créer la pile avec `Pile()`, puis appeler sa méthode `empiler` pour chaque élément de `liste`.

</Indice>
<Indice>

```text
MÉTHODE taille()
    RENVOYER longueur(elements)

FONCTION pile_de(liste)
    p ← nouvelle Pile
    POUR CHAQUE x DE liste
        empiler x sur p
    RENVOYER p
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def pile_de(liste):
    p = Pile()
    for x in liste:
        p.empiler(x)
    return p
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        ...


def pile_de(liste):
    ...
```

</CodeDepart>
<Verification>

```python
assert Pile().taille() == 0, "Une pile vide a une taille de 0."
p = pile_de([3, 1, 4])
assert isinstance(p, Pile), "pile_de renvoie un objet Pile."
assert p.taille() == 3 and p.sommet() == 4, "pile_de([3, 1, 4]) : taille 3, sommet 4."
n = p.taille()
p.empiler(7)
assert p.taille() == n + 1, "Empiler augmente la taille de 1."
assert [p.depiler(), p.depiler(), p.depiler(), p.depiler()] == [7, 4, 1, 3], "Les éléments ressortent dans l'ordre inverse : 7, 4, 1, 3."
assert pile_de([]).est_vide() and pile_de(["a"]).sommet() == "a", "Liste vide, puis un seul élément."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-0-6" label="0.6 [Pas à pas] - Afficher la pile" type="python">
<Enonce>
### Afficher la pile

`print(p)` affiche pour l'instant quelque chose comme `<__main__.Pile object at 0x7f…>`. Python appelle en fait la méthode spéciale `__str__` de l'objet, si elle existe, pour savoir quoi afficher.

Ajouter à la classe `Pile` la méthode `__str__()`, qui renvoie une chaîne montrant les éléments **un par ligne, du sommet vers le fond**. Une pile vide est affichée `(pile vide)`.

```python
p = pile_de([4, 8, 2])
print(p)
```

Affichage attendu :

```
2
8
4
```

<PostIt>

- `print(objet)` affiche `str(objet)`, c'est-à-dire ce que renvoie `__str__`
- `reversed(liste)` : parcourt la liste de la fin vers le début
- `"\n".join(textes)` : colle des textes en passant à la ligne entre eux
- `str(x)` : le texte d'une valeur

</PostIt>

<Indices>
<Indice>

Le sommet est à la fin de `self.elements` : il faut donc parcourir la liste à l'envers.

</Indice>
<Indice>

`join` n'accepte que des textes. Il faut d'abord transformer chaque élément avec `str`, par exemple dans une liste par compréhension.

</Indice>
<Indice>

```text
MÉTHODE __str__()
    SI est_vide() ALORS RENVOYER "(pile vide)"
    lignes ← [texte de x POUR CHAQUE x DE elements, de la fin vers le début]
    RENVOYER les lignes collées avec un passage à la ligne entre elles
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)

    def __str__(self):
        if self.est_vide():
            return "(pile vide)"
        return "\n".join([str(x) for x in reversed(self.elements)])


def pile_de(liste):
    p = Pile()
    for x in liste:
        p.empiler(x)
    return p
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)

    def __str__(self):
        ...


def pile_de(liste):
    p = Pile()
    for x in liste:
        p.empiler(x)
    return p


print(pile_de([4, 8, 2]))
```

</CodeDepart>
<Verification>

```python
assert not str(pile_de([4, 8, 2])).endswith("\n"), "Pas de passage à la ligne après le dernier élément affiché (le fond de la pile)."
assert str(pile_de([4, 8, 2])) == "2\n8\n4", "La pile 4, 8, 2 s'affiche 2, 8, 4, un par ligne : le sommet en haut."
assert str(Pile()) == "(pile vide)", "Une pile vide s'affiche (pile vide)."
assert str(pile_de(["a"])) == "a", "Une pile d'un seul élément."
p = pile_de([1, 2])
str(p)
assert p.elements == [1, 2], "Afficher la pile ne la modifie pas : après str(p), elements vaut toujours [1, 2]."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-0-7" label="0.7 [Pas à pas] - Créer la classe File" type="python">
<Enonce>
### Créer la classe File

Une file est représentée par un objet de la classe `File`. Ses éléments sont rangés dans un attribut `elements` : la **tête** de la file, qui sortira la première, est le premier élément de la liste, et la **queue** est le dernier.

Écrire la classe `File` avec :

- un constructeur qui crée l'attribut `elements`, une liste vide ;
- la méthode `est_vide()` ;
- la méthode `enfiler(x)`, qui ajoute `x` en queue de file.

```python
f = File()
f.enfiler("Ada")
f.enfiler("Alan")
print(f.elements)     # ['Ada', 'Alan']
print(f.est_vide())   # False
```

<PostIt>

- même construction que la classe `Pile`
- `self.elements = []` dans `__init__`
- la queue est la fin de la liste : `append`
- `len(self.elements) == 0` : file vide

</PostIt>

<Indices>
<Indice>

`__init__` et `est_vide` s'écrivent comme pour la pile.

</Indice>
<Indice>

Enfiler, c'est ajouter en queue, donc à la fin de la liste.

</Indice>
<Indice>

```text
CLASSE File
    CONSTRUCTEUR
        elements ← liste vide
    MÉTHODE est_vide()
        RENVOYER longueur(elements) = 0
    MÉTHODE enfiler(x)
        ajouter x à la fin de elements
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        ...

    def est_vide(self):
        ...

    def enfiler(self, x):
        ...
```

</CodeDepart>
<Verification>

```python
f = File()
assert f.elements == [] and f.est_vide() is True, "Une nouvelle file est vide et son attribut elements vaut []."
f.enfiler("Ada")
f.enfiler("Alan")
assert f.elements == ["Ada", "Alan"], "Ada arrive en premier : elements vaut ['Ada', 'Alan']."
assert f.est_vide() is False, "Une file où l'on vient d'enfiler n'est pas vide."
g = File()
assert g.est_vide() is True and g.elements is not f.elements, "Chaque file a sa propre liste."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-0-8" label="0.8 [Pas à pas] - Défiler" type="python">
<Enonce>
### Défiler

Ajouter à la classe `File` :

- la méthode `defiler()`, qui retire la tête de la file et la renvoie ;
- la méthode `premier()`, qui renvoie la tête sans la retirer.

Sur une file vide, les deux méthodes lèvent l'erreur `IndexError("file vide")`.

```python
f = File()
f.enfiler("Ada")
f.enfiler("Alan")
print(f.defiler())    # Ada
print(f.premier())    # Alan
```

<PostIt>

- `liste.pop(0)` : retire le premier élément et le renvoie
- `liste[0]` : le premier élément, sans le retirer
- `raise IndexError("file vide")`
- la tête est au début de la liste

</PostIt>

<Indices>
<Indice>

La tête est le premier élément de `self.elements`, d'indice 0. `pop(0)` la retire et la renvoie.

</Indice>
<Indice>

Les deux méthodes commencent par le même test : `if self.est_vide():`.

</Indice>
<Indice>

```text
MÉTHODE defiler()
    SI est_vide() ALORS lever IndexError("file vide")
    RENVOYER le premier élément de elements, après l'avoir retiré

MÉTHODE premier()
    SI est_vide() ALORS lever IndexError("file vide")
    RENVOYER elements[0]
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        ...

    def premier(self):
        ...
```

</CodeDepart>
<Verification>

```python
f = File()
for nom in ["Ada", "Alan", "Grace"]:
    f.enfiler(nom)
assert f.defiler() == "Ada", "Le premier arrivé sort le premier : Ada."
assert f.premier() == "Alan" and f.elements == ["Alan", "Grace"], "premier lit la tête sans la retirer."
f.enfiler("Linus")
assert f.defiler() == "Alan", "Un élément qui vient d'arriver ne passe pas devant les autres."
g = File()
g.enfiler(5)
assert g.defiler() == 5 and g.est_vide(), "Enfiler 5 dans une file vide puis défiler renvoie 5, et la file est de nouveau vide."
for methode in ["defiler", "premier"]:
    try:
        getattr(File(), methode)()
        message = None
    except IndexError as erreur:
        message = str(erreur)
    assert message == "file vide", "Sur une file vide, defiler et premier lèvent IndexError('file vide')."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-0-9" label="0.9 [Pas à pas] - Taille et affichage de la file" type="python">
<Enonce>
### Taille et affichage de la file

Ajouter à la classe `File` :

- la méthode `taille()`, qui renvoie le nombre d'éléments ;
- la méthode `__str__()`, qui renvoie les éléments de la tête vers la queue, séparés par `" | "`. Une file vide est affichée `(file vide)`.

```python
f = File()
for x in [4, 8, 2]:
    f.enfiler(x)
print(f.taille())   # 3
print(f)            # 4 | 8 | 2
```

<PostIt>

- `len(self.elements)` : nombre d'éléments
- `" | ".join(textes)` : colle des textes avec `" | "` entre eux
- `str(x)` : le texte d'une valeur
- la tête est déjà au début : pas besoin de retourner la liste

</PostIt>

<Indices>
<Indice>

`taille` s'écrit comme pour la pile.

</Indice>
<Indice>

Pour `__str__`, transformer chaque élément en texte, puis les coller avec `" | ".join(...)`.

</Indice>
<Indice>

```text
MÉTHODE taille()
    RENVOYER longueur(elements)

MÉTHODE __str__()
    SI est_vide() ALORS RENVOYER "(file vide)"
    RENVOYER les textes des éléments, de la tête à la queue, collés avec " | "
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)

    def __str__(self):
        if self.est_vide():
            return "(file vide)"
        return " | ".join([str(x) for x in self.elements])
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        ...

    def __str__(self):
        ...
```

</CodeDepart>
<Verification>

```python
f = File()
assert f.taille() == 0 and str(f) == "(file vide)", "Une file vide : taille 0, affichée (file vide)."
for x in [4, 8, 2]:
    f.enfiler(x)
assert f.taille() == 3, "Après trois enfilements, la taille vaut 3."
assert str(f) == "4 | 8 | 2", "La file s'affiche de la tête à la queue : 4 | 8 | 2."
f.defiler()
f.enfiler("fin")
assert str(f) == "8 | 2 | fin" and f.taille() == 3, "Après un défilement et un enfilement : 8 | 2 | fin."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-1-1" label="1.1 [Introduction] - Suivre une pile à la main" type="python">
<Enonce>
### Suivre une pile à la main

Les instructions suivantes sont exécutées dans l'ordre :

```python
p = Pile()
p.empiler(5)
p.empiler(8)
p.empiler(3)
a = p.depiler()
p.empiler(1)
p.empiler(6)
b = p.depiler()
c = p.sommet()
d = p.taille()
```

Sans exécuter ce code, compléter les variables du code de départ :

- `contenu` : la liste des éléments de la pile à la fin, du fond vers le sommet ;
- `a`, `b`, `c` et `d` : la valeur de chacune de ces variables à la fin.

En cas d'erreur, recopier les instructions sous la classe et afficher `p.elements` après chaque ligne.

<PostIt>

- `p.empiler(x)` : `x` se pose au sommet
- `p.depiler()` : retire le sommet et le renvoie
- `p.sommet()` : renvoie le sommet sans le retirer
- `p.taille()` : le nombre d'éléments

</PostIt>

<Indices>
<Indice>

Écrire l'état de la pile après chaque instruction, du fond vers le sommet, en partant de `[]`. Après les trois premiers empilements, la pile est `[5, 8, 3]`.

</Indice>
<Indice>

`sommet()` et `taille()` ne changent pas la pile : seules `empiler` et `depiler` la modifient.

</Indice>
<Indice>

```text
etat ← []  (le fond à gauche, le sommet à droite)
POUR CHAQUE instruction, dans l'ordre
    empiler(x) : ajouter x à droite de etat
    depiler()  : retirer l'élément le plus à droite et noter sa valeur
    sommet()   : noter l'élément le plus à droite, sans le retirer
    taille()   : noter le nombre d'éléments de etat
contenu ← etat à la fin
```

</Indice>
</Indices>

<Correction>

```python
contenu = [5, 8, 1]
a = 3
b = 6
c = 1
d = 3
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


contenu = ...
a = ...
b = ...
c = ...
d = ...
```

</CodeDepart>
<Verification>

```python
assert contenu == [5, 8, 1], "contenu : les éléments restants, du fond vers le sommet."
assert a == 3, "a : le sommet au moment du premier depiler()."
assert b == 6, "b : le sommet au moment du second depiler()."
assert c == 1, "c : sommet() lit le sommet sans le retirer."
assert d == 3, "d : le nombre d'éléments à la fin."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-1-2" label="1.2 [Introduction] - Suivre une file à la main" type="python">
<Enonce>
### Suivre une file à la main

Les instructions suivantes sont exécutées dans l'ordre :

```python
f = File()
f.enfiler("A")
f.enfiler("B")
f.enfiler("C")
a = f.defiler()
f.enfiler("D")
b = f.defiler()
f.enfiler(a)
c = f.premier()
d = f.taille()
e = f.est_vide()
```

Sans exécuter ce code, compléter les variables du code de départ :

- `contenu` : la liste des éléments de la file à la fin, de la tête vers la queue ;
- `a`, `b`, `c`, `d` et `e` : la valeur de chacune de ces variables à la fin.

<PostIt>

- `f.enfiler(x)` : `x` arrive en queue
- `f.defiler()` : retire la tête et la renvoie
- `f.premier()` : renvoie la tête sans la retirer
- `f.est_vide()` : `True` ou `False`

</PostIt>

<Indices>
<Indice>

Écrire l'état de la file après chaque instruction, la tête à gauche et la queue à droite. Après les trois premières instructions, la file est `["A", "B", "C"]`.

</Indice>
<Indice>

L'élément qui sort est toujours le plus à gauche. `f.enfiler(a)` remet en queue la valeur gardée dans `a`.

</Indice>
<Indice>

```text
etat ← []  (la tête à gauche, la queue à droite)
POUR CHAQUE instruction, dans l'ordre
    enfiler(x) : ajouter x à droite de etat
    defiler()  : retirer l'élément le plus à gauche et noter sa valeur
    premier()  : noter l'élément le plus à gauche, sans le retirer
    taille()   : noter le nombre d'éléments de etat
    est_vide() : noter True si etat est vide, False sinon
contenu ← etat à la fin
```

</Indice>
</Indices>

<Correction>

```python
contenu = ["C", "D", "A"]
a = "A"
b = "B"
c = "C"
d = 3
e = False
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


contenu = ...
a = ...
b = ...
c = ...
d = ...
e = ...
```

</CodeDepart>
<Verification>

```python
assert contenu == ["C", "D", "A"], "contenu : les éléments restants, de la tête vers la queue."
assert a == "A", "a : la tête au moment du premier defiler()."
assert b == "B", "b : la tête au moment du second defiler()."
assert c == "C", "c : premier() lit la tête sans la retirer."
assert d == 3, "d : le nombre d'éléments à la fin."
assert e is False, "e : est_vide() renvoie un booléen."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-1-3" label="1.3 [Introduction] - Obtenir une pile donnée" type="python">
<Enonce>
### Obtenir une pile donnée

La fonction `modifier_pile(p)` reçoit une pile qui contient, du fond vers le sommet, `2`, `4` et `6`. Écrire cette fonction pour qu'à la fin la pile contienne, du fond vers le sommet, `2`, `5`, `6` et `1`.

La fonction ne renvoie rien. Elle utilise seulement `empiler` et `depiler`, sans créer d'autre pile.

```python
p = Pile()
p.empiler(2)
p.empiler(4)
p.empiler(6)
modifier_pile(p)
print(p.elements)   # [2, 5, 6, 1]
```

<PostIt>

- seul le sommet est accessible
- `x = p.depiler()` : retire le sommet et le garde dans `x`
- `p.empiler(x)` : remet `x` au sommet
- la fonction n'a pas besoin de boucle

</PostIt>

<Indices>
<Indice>

Le `4` est sous le `6`. Pour le retirer, il faut d'abord dépiler le `6`.

</Indice>
<Indice>

Garder le `6` dans une variable au moment de le dépiler. Une fois le `4` retiré, empiler `5`, puis le `6` gardé, puis `1`.

</Indice>
<Indice>

```text
FONCTION modifier_pile(p)
    haut ← depiler(p)       (le 6)
    depiler(p)              (le 4 disparaît)
    empiler 5 sur p
    empiler haut sur p
    empiler 1 sur p
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def modifier_pile(p):
    haut = p.depiler()
    p.depiler()
    p.empiler(5)
    p.empiler(haut)
    p.empiler(1)
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def modifier_pile(p):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def modifier_pile", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
p = Pile()
p.empiler(2)
p.empiler(4)
p.empiler(6)
assert modifier_pile(p) is None, "La fonction modifie la pile reçue et ne renvoie rien."
assert p.elements == [2, 5, 6, 1], "À la fin, la pile contient 2, 5, 6, 1, du fond vers le sommet."
assert ".depiler()" in corps and ".empiler(" in corps, "Utiliser depiler et empiler."
assert ".elements" not in corps and "Pile()" not in corps, "Modifier la pile reçue avec ses méthodes, sans en créer une autre."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-1-4" label="1.4 [Introduction] - Obtenir une file donnée" type="python">
<Enonce>
### Obtenir une file donnée

La fonction `modifier_file(f)` reçoit une file qui contient, de la tête vers la queue, `"a"`, `"b"` et `"c"`. Écrire cette fonction pour qu'à la fin la file contienne, de la tête vers la queue, `"c"`, `"a"` et `"x"`.

La fonction ne renvoie rien. Elle utilise seulement `enfiler` et `defiler`, sans créer d'autre file.

```python
f = File()
f.enfiler("a")
f.enfiler("b")
f.enfiler("c")
modifier_file(f)
print(f.elements)   # ['c', 'a', 'x']
```

<PostIt>

- seule la tête peut sortir de la file
- un nouvel élément arrive toujours en queue
- `x = f.defiler()` : retire la tête et la garde dans `x`
- un élément sorti peut être enfilé de nouveau

</PostIt>

<Indices>
<Indice>

`"c"` doit se retrouver en tête : les deux éléments placés devant lui doivent sortir.

</Indice>
<Indice>

`"a"` revient ensuite en queue, suivi de `"x"`. `"b"` n'est pas remis dans la file.

</Indice>
<Indice>

```text
FONCTION modifier_file(f)
    tete ← defiler(f)       (le "a")
    defiler(f)              (le "b" disparaît)
    enfiler tete dans f
    enfiler "x" dans f
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def modifier_file(f):
    tete = f.defiler()
    f.defiler()
    f.enfiler(tete)
    f.enfiler("x")
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def modifier_file(f):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def modifier_file", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
f = File()
f.enfiler("a")
f.enfiler("b")
f.enfiler("c")
assert modifier_file(f) is None, "La fonction modifie la file reçue et ne renvoie rien."
assert f.elements == ["c", "a", "x"], "À la fin, la file contient \"c\", \"a\", \"x\", de la tête vers la queue."
assert ".defiler()" in corps and ".enfiler(" in corps, "Utiliser defiler et enfiler."
assert ".elements" not in corps and "File()" not in corps, "Modifier la file reçue avec ses méthodes, sans en créer une autre."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-1-5" label="1.5 [Introduction] - Regarder sous le sommet" type="python">
<Enonce>
### Regarder sous le sommet

Écrire la fonction `sous_sommet(p)`, qui renvoie l'élément placé juste sous le sommet de la pile `p`. À la fin, la pile doit avoir retrouvé son contenu de départ. Si la pile contient moins de deux éléments, la fonction renvoie `None`.

```python
p = Pile()
p.empiler(3)
p.empiler(7)
p.empiler(9)
print(sous_sommet(p))   # 7
print(p.elements)       # [3, 7, 9]
```

<PostIt>

- `p.taille()` : le nombre d'éléments
- `p.sommet()` : lit le sommet sans le retirer
- retirer le sommet, lire, puis remettre le sommet
- `return None` si la pile est trop petite

</PostIt>

<Indices>
<Indice>

Une fois le sommet retiré, l'élément cherché devient le nouveau sommet.

</Indice>
<Indice>

Remettre l'élément retiré avant de renvoyer le résultat, sinon la pile a perdu un élément.

</Indice>
<Indice>

```text
FONCTION sous_sommet(p)
    SI taille(p) < 2 ALORS RENVOYER None
    haut ← depiler(p)
    resultat ← sommet(p)
    empiler haut sur p
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def sous_sommet(p):
    if p.taille() < 2:
        return None
    haut = p.depiler()
    resultat = p.sommet()
    p.empiler(haut)
    return resultat
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def sous_sommet(p):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def sous_sommet", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
p = Pile()
for x in [3, 7, 9]:
    p.empiler(x)
assert sous_sommet(p) == 7, "Sous le sommet 9 se trouve 7."
assert p.elements == [3, 7, 9], "La pile retrouve son contenu de départ."
q = Pile()
q.empiler("x")
q.empiler("y")
assert sous_sommet(q) == "x" and q.elements == ["x", "y"], "Avec deux éléments, sous_sommet renvoie celui du fond."
r = Pile()
assert sous_sommet(r) is None, "Une pile vide : None."
r.empiler(4)
assert sous_sommet(r) is None and r.elements == [4], "Un seul élément : None, et la pile ne change pas."
assert ".elements" not in corps and "Pile()" not in corps, "Utiliser les méthodes de la pile reçue, sans toucher à elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-1-6" label="1.6 [Introduction] - Une file d'attente limitée" type="python">
<Enonce>
### Une file d'attente limitée

Un guichet n'accepte pas plus de `place_max` personnes dans sa file d'attente. Écrire deux fonctions :

- `arriver(f, nom, place_max)` : si la file `f` compte moins de `place_max` personnes, enfile `nom` et renvoie `True` ; sinon, la file ne change pas et la fonction renvoie `False` ;
- `servir(f)` : défile et renvoie la personne en tête, ou renvoie `None` si la file est vide.

```python
f = File()
print(arriver(f, "Ada", 2))     # True
print(arriver(f, "Alan", 2))    # True
print(arriver(f, "Grace", 2))   # False : la file est pleine
print(servir(f))                # Ada
print(servir(f))                # Alan
print(servir(f))                # None
```

<PostIt>

- `f.taille()` : le nombre de personnes dans la file
- `f.est_vide()` : `True` si personne n'attend
- `f.enfiler(nom)` et `f.defiler()`
- chaque fonction tient en un `if`

</PostIt>

<Indices>
<Indice>

`arriver` compare la taille de la file à `place_max` avant d'enfiler.

</Indice>
<Indice>

`servir` teste si la file est vide avant de défiler : défiler une file vide provoque une erreur.

</Indice>
<Indice>

```text
FONCTION arriver(f, nom, place_max)
    SI taille(f) < place_max ALORS
        enfiler nom dans f
        RENVOYER Vrai
    RENVOYER Faux

FONCTION servir(f)
    SI f est vide ALORS RENVOYER None
    RENVOYER defiler(f)
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def arriver(f, nom, place_max):
    if f.taille() < place_max:
        f.enfiler(nom)
        return True
    return False


def servir(f):
    if f.est_vide():
        return None
    return f.defiler()
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def arriver(f, nom, place_max):
    ...


def servir(f):
    ...
```

</CodeDepart>
<Verification>

```python
corps_arriver = PROGRAMME.split("def arriver", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
corps_servir = PROGRAMME.split("def servir", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
f = File()
assert arriver(f, "Ada", 2) is True and arriver(f, "Alan", 2) is True, "Deux places : Ada puis Alan entrent."
assert arriver(f, "Grace", 2) is False, "La file est pleine : Grace n'entre pas."
assert f.elements == ["Ada", "Alan"], "Une file pleine ne change pas."
assert servir(f) == "Ada" and servir(f) == "Alan", "Les personnes sont servies dans leur ordre d'arrivée."
assert servir(f) is None, "File vide : servir renvoie None."
assert arriver(f, "Linus", 1) is True and arriver(f, "Guido", 0) is False, "place_max est relu à chaque appel."
assert ".elements" not in corps_arriver + corps_servir, "Utiliser les méthodes de la file, sans toucher à elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-2-1" label="2.1 [Facile] - Renverser une file" type="python">
<Enonce>
### Renverser une file

Écrire la fonction `renverser(f)`, qui modifie la file `f` pour que ses éléments se retrouvent dans l'ordre inverse. La fonction passe par une pile : elle y empile tous les éléments de la file, puis les dépile un par un pour les enfiler de nouveau. Elle ne renvoie rien.

Exemple : si `f` contient `1 | 2 | 3`, la tête à gauche, après `renverser(f)` elle contient `3 | 2 | 1`.

<PostIt>

- `p = Pile()` : une pile vide
- `p.empiler(f.defiler())` : la tête de la file passe sur la pile
- `while not f.est_vide():` : tant que la file n'est pas vide
- le dernier empilé sort le premier

</PostIt>

<Indices>
<Indice>

Après avoir défilé `1`, `2` puis `3` et les avoir empilés, le sommet de la pile est `3`. Dépiler donne donc `3`, puis `2`, puis `1`.

</Indice>
<Indice>

Deux boucles `while` suffisent : la première vide la file dans la pile, la seconde vide la pile dans la file.

</Indice>
<Indice>

```text
FONCTION renverser(f)
    p ← nouvelle Pile
    TANT QUE f n'est pas vide
        empiler defiler(f) sur p
    TANT QUE p n'est pas vide
        enfiler depiler(p) dans f
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def renverser(f):
    p = Pile()
    while not f.est_vide():
        p.empiler(f.defiler())
    while not p.est_vide():
        f.enfiler(p.depiler())
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def renverser(f):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def renverser", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
def file_de(elements):
    f = File()
    for x in elements:
        f.enfiler(x)
    return f
f = file_de([1, 2, 3])
assert renverser(f) is None and f.elements == [3, 2, 1], "1 | 2 | 3 devient 3 | 2 | 1."
f = file_de(["a"])
renverser(f)
assert f.elements == ["a"], "Un seul élément : la file ne change pas."
f = file_de([])
renverser(f)
assert f.elements == [], "Une file vide reste vide."
f = file_de([4, 4, 1, 9])
renverser(f)
assert f.elements == [9, 1, 4, 4], "4 | 4 | 1 | 9 devient 9 | 1 | 4 | 4."
assert "Pile()" in corps and ".depiler()" in corps, "Passer par une pile : Pile(), empiler, depiler."
assert ".elements" not in corps and "reverse" not in corps, "Utiliser les méthodes de la file et de la pile, sans toucher à elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-2-2" label="2.2 [Facile] - Passage en caisse" type="python">
<Enonce>
### Passage en caisse

Des clients font la queue à une caisse, dans la file `f`. Écrire la fonction `caisse(f, n)` :

- la caisse sert `n` clients, ou tous les clients s'il y en a moins de `n` ;
- la fonction renvoie une nouvelle file, qui contient les clients servis dans l'ordre où ils sont passés ;
- les clients qui n'ont pas été servis restent dans `f`, dans leur ordre.

Exemple : si `f` contient `"Ada" | "Alan" | "Grace" | "Linus"`, la tête à gauche, `servis = caisse(f, 2)` donne une file `servis` qui contient `"Ada" | "Alan"`, et `f` contient encore `"Grace" | "Linus"`.

<PostIt>

- `servis = File()` : la file des clients servis
- `servis.enfiler(f.defiler())` : un client passe d'une file à l'autre
- `for _ in range(n):` : répéter `n` fois
- `f.est_vide()` : plus personne dans la file

</PostIt>

<Indices>
<Indice>

Défiler `n` fois depuis `f`, en s'arrêtant plus tôt si `f` se vide. Chaque client défilé est enfilé dans `servis`.

</Indice>
<Indice>

Il n'y a rien à faire pour les clients qui attendent encore : ils sont restés dans `f`, dans leur ordre d'arrivée.

</Indice>
<Indice>

```text
FONCTION caisse(f, n)
    servis ← nouvelle File
    RÉPÉTER n FOIS
        SI f n'est pas vide ALORS
            enfiler defiler(f) dans servis
    RENVOYER servis
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def caisse(f, n):
    servis = File()
    for _ in range(n):
        if not f.est_vide():
            servis.enfiler(f.defiler())
    return servis
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def caisse(f, n):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def caisse", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
def file_de(elements):
    f = File()
    for x in elements:
        f.enfiler(x)
    return f
f = file_de(["Ada", "Alan", "Grace", "Linus"])
servis = caisse(f, 2)
assert isinstance(servis, File), "caisse renvoie une File."
assert servis.elements == ["Ada", "Alan"] and f.elements == ["Grace", "Linus"], "Deux clients servis, deux en attente."
f = file_de(["Ada", "Alan"])
servis = caisse(f, 5)
assert servis.elements == ["Ada", "Alan"] and f.est_vide(), "Moins de clients que n : tout le monde est servi."
f = file_de(["Ada", "Alan"])
assert caisse(f, 0).est_vide() and f.elements == ["Ada", "Alan"], "n = 0 : personne n'est servi."
assert caisse(File(), 3).est_vide(), "Aucun client : la file renvoyée est vide."
assert "File()" in corps and ".defiler()" in corps, "Passer par une file : File(), enfiler, defiler."
assert ".elements" not in corps, "Utiliser les méthodes de la file, sans toucher à elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-2-3" label="2.3 [Facile] - Vider une pile" type="python">
<Enonce>
### Vider une pile

Ajouter à la classe `Pile` du code de départ la méthode `vider()`, qui retire tous les éléments de la pile et renvoie une `File` contenant les éléments retirés, dans leur ordre de sortie. La méthode utilise `self.depiler()`.

```python
p = Pile()
p.empiler(1)
p.empiler(2)
p.empiler(3)
sortis = p.vider()
print(sortis.defiler())   # 3 : le premier élément sorti de la pile
print(sortis.taille())    # 2
print(p.est_vide())       # True
```

<PostIt>

- une méthode appelle une autre méthode avec `self.` : `self.depiler()`
- `while not self.est_vide():`
- `sortis = File()`, puis `sortis.enfiler(x)`
- la méthode s'écrit dans la classe, avec la même indentation que les autres

</PostIt>

<Indices>
<Indice>

Tant que la pile n'est pas vide, dépiler un élément et l'enfiler dans la file.

</Indice>
<Indice>

Le premier élément dépilé est le sommet : il se retrouve en tête de la file. Pour une pile déjà vide, la boucle ne tourne pas et la méthode renvoie une file vide.

</Indice>
<Indice>

```text
MÉTHODE vider()
    sortis ← nouvelle File
    TANT QUE la pile n'est pas vide
        enfiler depiler() dans sortis
    RENVOYER sortis
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)

    def vider(self):
        sortis = File()
        while not self.est_vide():
            sortis.enfiler(self.depiler())
        return sortis
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)

    def vider(self):
        ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def vider", 1)[-1].split("\n    def ", 1)[0].split("\nclass ", 1)[0]
p = Pile()
for x in [1, 2, 3]:
    p.empiler(x)
sortis = p.vider()
assert isinstance(sortis, File), "vider renvoie une File."
assert sortis.elements == [3, 2, 1], "Les éléments sortent du sommet vers le fond : 3 en tête de la file."
assert p.est_vide(), "Après vider(), la pile est vide."
assert Pile().vider().est_vide(), "Vider une pile vide renvoie une file vide."
assert "self.depiler()" in corps, "vider utilise self.depiler()."
assert ".elements" not in corps, "Utiliser les méthodes de la pile et de la file, sans toucher à elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-2-4" label="2.4 [Facile] - Le bouton Précédent" type="python">
<Enonce>
### Le bouton Précédent

Un navigateur garde dans une pile les pages déjà visitées. La navigation commence sur la page `"accueil"`. La file `actions` contient, dans l'ordre, ce que fait l'utilisateur :

- un nom de page, par exemple `"cours"`, signifie que l'utilisateur ouvre cette page ;
- `"retour"` signifie qu'il clique sur le bouton Précédent, qui ramène à la page visitée juste avant. S'il n'y a pas de page précédente, rien ne se passe.

Écrire la fonction `naviguer(actions)`, qui renvoie la page affichée à la fin. La file `actions` peut être vidée par la fonction.

Exemples : si `actions` contient `"cours" | "exercices" | "retour"`, la tête à gauche, `naviguer(actions)` renvoie `"cours"`. Si `actions` contient seulement `"retour"`, la fonction renvoie `"accueil"`.

<PostIt>

- `courante` : la page affichée, au départ `"accueil"`
- `while not actions.est_vide():`, puis `action = actions.defiler()`
- ouvrir une page : empiler `courante`, puis changer de page
- `"retour"` : la page précédente est le sommet de la pile, si elle n'est pas vide

</PostIt>

<Indices>
<Indice>

La pile ne contient pas la page affichée, seulement celles qui ont été quittées.

</Indice>
<Indice>

À l'ouverture d'une page, la page affichée est empilée. Au retour, la page affichée devient le sommet dépilé.

</Indice>
<Indice>

```text
FONCTION naviguer(actions)
    p ← nouvelle Pile ; courante ← "accueil"
    TANT QUE actions n'est pas vide
        action ← defiler(actions)
        SI action = "retour" ALORS
            SI p n'est pas vide ALORS courante ← depiler(p)
        SINON
            empiler courante sur p ; courante ← action
    RENVOYER courante
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def naviguer(actions):
    p = Pile()
    courante = "accueil"
    while not actions.est_vide():
        action = actions.defiler()
        if action == "retour":
            if not p.est_vide():
                courante = p.depiler()
        else:
            p.empiler(courante)
            courante = action
    return courante
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def naviguer(actions):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def naviguer", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
def file_de(elements):
    f = File()
    for x in elements:
        f.enfiler(x)
    return f
assert naviguer(file_de(["cours", "exercices", "retour"])) == "cours", "Un retour ramène de exercices à cours."
assert naviguer(file_de(["retour"])) == "accueil" and naviguer(File()) == "accueil", "Sans page précédente, on reste sur accueil."
assert naviguer(file_de(["cours", "exercices", "retour", "retour", "retour"])) == "accueil", "Trois retours : le dernier ne fait rien."
assert naviguer(file_de(["cours", "exercices", "retour", "corrections", "retour"])) == "cours", "Après un retour, une nouvelle page est empilée normalement."
assert "Pile()" in corps and ".defiler()" in corps, "Lire les actions dans la file et garder les pages quittées dans une pile."
assert ".elements" not in corps, "Utiliser les méthodes de la pile et de la file, sans toucher à elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-2-5" label="2.5 [Facile] - Faire tourner une file" type="python">
<Enonce>
### Faire tourner une file

Écrire la fonction `tourner(f, k)`, qui modifie la file `f` : `k` fois de suite, la tête de la file sort et revient se placer en queue. La fonction ne renvoie rien. Sur une file vide, elle ne fait rien.

Exemple : si `f` contient `1 | 2 | 3 | 4 | 5`, après `tourner(f, 2)`, elle contient `3 | 4 | 5 | 1 | 2`.

<PostIt>

- `f.enfiler(f.defiler())` : la tête passe en queue
- `for _ in range(k):` : répéter `k` fois
- une file vide ne peut pas être défilée
- la fonction modifie `f` et ne renvoie rien

</PostIt>

<Indices>
<Indice>

Une seule ligne suffit pour faire passer la tête en queue : défiler, puis enfiler la valeur obtenue.

</Indice>
<Indice>

Le cas de la file vide se traite avant la boucle.

</Indice>
<Indice>

```text
FONCTION tourner(f, k)
    SI f est vide ALORS RENVOYER rien
    RÉPÉTER k FOIS
        enfiler defiler(f) dans f
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def tourner(f, k):
    if f.est_vide():
        return None
    for _ in range(k):
        f.enfiler(f.defiler())
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def tourner(f, k):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def tourner", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
f = File()
for x in [1, 2, 3, 4, 5]:
    f.enfiler(x)
r = tourner(f, 2)
assert f.elements == [3, 4, 5, 1, 2], "1 | 2 | 3 | 4 | 5 tourne de 2 : 3 | 4 | 5 | 1 | 2."
assert r is None, "tourner modifie la file et ne renvoie rien."
tourner(f, 0)
assert f.elements == [3, 4, 5, 1, 2], "Tourner de 0 ne change rien."
tourner(f, 8)
assert f.elements == [1, 2, 3, 4, 5], "Tourner de 8 sur 5 éléments revient à tourner de 3."
vide = File()
tourner(vide, 3)
assert vide.est_vide(), "Une file vide reste vide, sans erreur."
assert ".elements" not in corps, "Utiliser defiler et enfiler, sans toucher à elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-2-6" label="2.6 [Facile] - Parenthèses" type="python">
<Enonce>
### Parenthèses

Une expression est bien parenthésée si chaque parenthèse fermante correspond à une parenthèse ouvrante placée avant elle, et si toutes les parenthèses ouvertes sont refermées.

Écrire la fonction `bien_parenthesee(expression)`, qui renvoie `True` si `expression` est bien parenthésée, et `False` sinon. Les autres caractères sont ignorés. La fonction utilise une pile : elle empile chaque `(` et dépile à chaque `)`.

Exemples : `"(a + b) * (c - (d))"` est bien parenthésée, mais pas `"(a + b"` ni `"a) + (b"`.

<PostIt>

- `for c in expression:` : chaque caractère
- `(` : empiler
- `)` sur une pile vide : parenthèse fermante en trop
- à la fin, la pile doit être vide

</PostIt>

<Indices>
<Indice>

Une parenthèse fermante qui arrive alors que la pile est vide n'a pas d'ouvrante : la réponse est `False` tout de suite.

</Indice>
<Indice>

À la fin du parcours, une pile non vide signifie qu'une parenthèse ouvrante n'a jamais été refermée.

</Indice>
<Indice>

```text
FONCTION bien_parenthesee(expression)
    p ← nouvelle Pile
    POUR CHAQUE c DE expression
        SI c = "(" ALORS empiler c sur p
        SINON SI c = ")" ALORS
            SI p est vide ALORS RENVOYER Faux
            depiler(p)
    RENVOYER p est vide
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def bien_parenthesee(expression):
    p = Pile()
    for c in expression:
        if c == "(":
            p.empiler(c)
        elif c == ")":
            if p.est_vide():
                return False
            p.depiler()
    return p.est_vide()
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def bien_parenthesee(expression):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def bien_parenthesee", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
assert bien_parenthesee("(a + b) * (c - (d))") is True, "(a + b) * (c - (d)) est bien parenthésée."
assert bien_parenthesee("(a + b") is False, "(a + b : une parenthèse n'est pas refermée."
assert bien_parenthesee("a) + (b") is False, "a) + (b : la fermante arrive avant l'ouvrante."
assert bien_parenthesee("") is True and bien_parenthesee("abc") is True, "Sans parenthèse, l'expression est bien parenthésée."
assert bien_parenthesee("(()())") is True and bien_parenthesee("())(") is False, "(()()) puis ())(."
assert "Pile()" in corps and ".empiler(" in corps, "Utiliser une pile."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-2-7" label="2.7 [Facile] - Alterner deux files" type="python">
<Enonce>
### Alterner deux files

Deux files d'attente fusionnent devant un guichet : on prend une personne de la première, puis une de la seconde, et ainsi de suite. Quand l'une des files est vide, les personnes de l'autre passent dans l'ordre.

Écrire la fonction `alterner(f1, f2)`, qui renvoie une nouvelle `File` construite de cette façon. Les files `f1` et `f2` peuvent être vidées par la fonction.

Exemple : si `f1` contient `a | b | c` et `f2` contient `1 | 2`, la file renvoyée contient `a | 1 | b | 2 | c`.

<PostIt>

- `resultat = File()` : la nouvelle file
- `while not f1.est_vide() or not f2.est_vide():`
- défiler une file seulement si elle n'est pas vide
- `resultat.enfiler(f1.defiler())`

</PostIt>

<Indices>
<Indice>

À chaque tour de boucle, prendre un élément de `f1` s'il en reste, puis un élément de `f2` s'il en reste.

</Indice>
<Indice>

La boucle s'arrête quand les deux files sont vides.

</Indice>
<Indice>

```text
FONCTION alterner(f1, f2)
    resultat ← nouvelle File
    TANT QUE f1 n'est pas vide OU f2 n'est pas vide
        SI f1 n'est pas vide ALORS enfiler defiler(f1) dans resultat
        SI f2 n'est pas vide ALORS enfiler defiler(f2) dans resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def alterner(f1, f2):
    resultat = File()
    while not f1.est_vide() or not f2.est_vide():
        if not f1.est_vide():
            resultat.enfiler(f1.defiler())
        if not f2.est_vide():
            resultat.enfiler(f2.defiler())
    return resultat
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def alterner(f1, f2):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def alterner", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
def file_de(valeurs):
    f = File()
    for x in valeurs:
        f.enfiler(x)
    return f
r = alterner(file_de(["a", "b", "c"]), file_de([1, 2]))
assert isinstance(r, File), "alterner renvoie une File."
assert r.elements == ["a", 1, "b", 2, "c"], "a | b | c et 1 | 2 donnent a | 1 | b | 2 | c."
assert alterner(file_de([1]), file_de([2, 3, 4])).elements == [1, 2, 3, 4], "La seconde file est plus longue."
assert alterner(File(), File()).est_vide(), "Deux files vides donnent une file vide."
assert ".elements" not in corps, "Utiliser les méthodes des files, sans toucher à elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-2-8" label="2.8 [Facile] - Compter sans abîmer" type="python">
<Enonce>
### Compter sans abîmer

Écrire la fonction `compter(p)`, qui renvoie le nombre d'éléments de la pile `p` en n'utilisant que les méthodes `est_vide`, `empiler` et `depiler`. Les méthodes `taille` et `len` sont interdites, de même que l'attribut `elements`.

À la fin, la pile `p` doit avoir retrouvé exactement son contenu, dans le même ordre.

<PostIt>

- dépiler compte les éléments, mais vide la pile
- une seconde pile, `aux`, garde les éléments retirés
- remettre chaque élément de `aux` dans `p`
- passer d'une pile à l'autre retourne l'ordre

</PostIt>

<Indices>
<Indice>

Dépiler les éléments de `p` un par un en les comptant, et les empiler au fur et à mesure sur une pile auxiliaire.

</Indice>
<Indice>

La pile auxiliaire contient les éléments dans l'ordre inverse. Les dépiler pour les remettre sur `p` rétablit l'ordre de départ.

</Indice>
<Indice>

```text
FONCTION compter(p)
    aux ← nouvelle Pile ; n ← 0
    TANT QUE p n'est pas vide
        empiler depiler(p) sur aux ; n ← n + 1
    TANT QUE aux n'est pas vide
        empiler depiler(aux) sur p
    RENVOYER n
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def compter(p):
    aux = Pile()
    n = 0
    while not p.est_vide():
        aux.empiler(p.depiler())
        n = n + 1
    while not aux.est_vide():
        p.empiler(aux.depiler())
    return n
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def compter(p):
    ...
```

</CodeDepart>
<Verification>

```python
import re
corps = PROGRAMME.split("def compter", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
p = Pile()
for x in [3, 1, 4, 1, 5]:
    p.empiler(x)
assert compter(p) == 5, "La pile contient 5 éléments."
assert p.elements == [3, 1, 4, 1, 5], "La pile a retrouvé son contenu, dans le même ordre."
assert compter(Pile()) == 0, "Une pile vide contient 0 élément."
assert not re.search(r"\.taille\(|\blen\s*\(|\.elements", corps), "Sans taille, sans len et sans elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-3-1" label="3.1 [Moyen] - Trois sortes de parenthèses" type="python">
<Enonce>
### Trois sortes de parenthèses

Une expression peut maintenant contenir des parenthèses `( )`, des crochets `[ ]` et des accolades `{ }`. Elle est bien formée si chaque symbole fermant correspond au **dernier** symbole ouvrant encore ouvert, et si tout ce qui est ouvert est refermé.

Écrire la fonction `bien_formee(expression)`, qui renvoie `True` si l'expression est bien formée, et `False` sinon. Les autres caractères sont ignorés.

Exemples : `"{[(a)(b)]}"` est bien formée, mais pas `"([)]"`, car le crochet se ferme avant la parenthèse.

<PostIt>

- `c in "([{"` : vrai si `c` est un ouvrant, `c in ")]}"` si c'est un fermant
- une petite fonction `associes(ouvrant, fermant)` dit si deux symboles vont ensemble
- un fermant : `associes(p.depiler(), c)` doit être vrai
- à la fin, `p.est_vide()`

</PostIt>

<Indices>
<Indice>

Comme pour les seules parenthèses, chaque ouvrant est empilé. Un fermant doit correspondre au sommet de la pile.

</Indice>
<Indice>

Un fermant sur une pile vide, ou un sommet qui n'est pas l'ouvrant attendu, donne `False` tout de suite.

</Indice>
<Indice>

```text
FONCTION associes(ouvrant, fermant)
    RENVOYER (ouvrant = "(" ET fermant = ")") OU (ouvrant = "[" ET fermant = "]")
             OU (ouvrant = "{" ET fermant = "}")

FONCTION bien_formee(expression)
    p ← nouvelle Pile
    POUR CHAQUE c DE expression
        SI c est un ouvrant ALORS empiler c sur p
        SINON SI c est un fermant ALORS
            SI p est vide OU NON associes(depiler(p), c) ALORS RENVOYER Faux
    RENVOYER p est vide
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def associes(ouvrant, fermant):
    return (ouvrant == "(" and fermant == ")") or (ouvrant == "[" and fermant == "]") or (ouvrant == "{" and fermant == "}")


def bien_formee(expression):
    p = Pile()
    for c in expression:
        if c in "([{":
            p.empiler(c)
        elif c in ")]}":
            if p.est_vide() or not associes(p.depiler(), c):
                return False
    return p.est_vide()
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def bien_formee(expression):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def bien_formee", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
assert bien_formee("{[(a)(b)]}") is True, "{[(a)(b)]} est bien formée."
assert bien_formee("([)]") is False, "([)] : le crochet se ferme avant la parenthèse."
assert bien_formee("((]") is False and bien_formee("(") is False and bien_formee("}") is False, "Ouvrant sans fermant, fermant sans ouvrant."
assert bien_formee("") is True and bien_formee("t[i] = {x: (1, 2)}") is True, "Expression vide, puis du code Python."
assert bien_formee("[(])") is False and bien_formee("[]{}()") is True, "[(]) puis []{}()."
assert "Pile()" in corps, "Utiliser une pile."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-3-2" label="3.2 [Moyen] - Notation polonaise inverse" type="python">
<Enonce>
### Notation polonaise inverse

En **notation polonaise inverse** (NPI), l'opérateur s'écrit après ses deux opérandes : `3 4 +` signifie `3 + 4`, et `3 4 + 2 *` signifie `(3 + 4) * 2`. Cette notation n'a besoin d'aucune parenthèse. Certaines calculatrices l'utilisent.

Écrire la fonction `evaluer_npi(f)`, qui calcule la valeur d'une expression en NPI. L'expression est donnée par la file `f`, dans l'ordre de lecture : chaque élément est un entier positif ou l'un des opérateurs `"+"`, `"-"` et `"*"`. La file peut être vidée par la fonction.

Exemples, la tête à gauche :

- si `f` contient `3 | 4 | "+" | 2 | "*"`, `evaluer_npi(f)` renvoie `14` ;
- si `f` contient `7 | 2 | "-"`, `evaluer_npi(f)` renvoie `5`.

<PostIt>

- `morceau = f.defiler()` : le morceau suivant de l'expression
- un entier est empilé
- un opérateur : dépiler `b`, puis `a`, et empiler `a op b`
- à la fin, le résultat est le seul élément de la pile

</PostIt>

<Indices>
<Indice>

Défiler les morceaux un par un. Les nombres attendent sur la pile que leur opérateur arrive.

</Indice>
<Indice>

Pour `7 | 2 | "-"`, le premier élément dépilé est `2`, le second `7`. Le résultat est `7 - 2`, donc le second dépilé moins le premier.

</Indice>
<Indice>

```text
FONCTION evaluer_npi(f)
    p ← nouvelle Pile
    TANT QUE f n'est pas vide
        morceau ← defiler(f)
        SI morceau est "+", "-" ou "*" ALORS
            b ← depiler(p) ; a ← depiler(p)
            empiler (a morceau b) sur p
        SINON
            empiler morceau sur p
    RENVOYER depiler(p)
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def evaluer_npi(f):
    p = Pile()
    while not f.est_vide():
        morceau = f.defiler()
        if morceau == "+" or morceau == "-" or morceau == "*":
            b = p.depiler()
            a = p.depiler()
            if morceau == "+":
                p.empiler(a + b)
            elif morceau == "-":
                p.empiler(a - b)
            else:
                p.empiler(a * b)
        else:
            p.empiler(morceau)
    return p.depiler()
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def evaluer_npi(f):
    ...
```

</CodeDepart>
<Verification>

```python
import re
corps = PROGRAMME.split("def evaluer_npi", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
def npi(texte):
    f = File()
    for morceau in texte.split():
        f.enfiler(morceau if morceau in "+-*" else int(morceau))
    return f
assert evaluer_npi(npi("3 4 + 2 *")) == 14, "3 | 4 | \"+\" | 2 | \"*\" vaut (3 + 4) * 2 = 14."
assert evaluer_npi(npi("7 2 -")) == 5, "7 | 2 | \"-\" vaut 7 - 2 = 5 : attention à l'ordre."
assert evaluer_npi(npi("42")) == 42, "Un nombre seul."
assert evaluer_npi(npi("2 3 4 * +")) == 14 and evaluer_npi(npi("5 1 2 + 4 * + 3 -")) == 14, "Plusieurs opérateurs."
assert evaluer_npi(npi("10 20 30 - -")) == 20, "10 - (20 - 30) = 20."
assert "Pile()" in corps and ".defiler()" in corps, "Lire l'expression dans la file, calculer avec une pile."
assert ".elements" not in corps and not re.search(r"\beval\s*\(", corps), "Utiliser les méthodes de la pile et de la file, sans eval."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-3-3" label="3.3 [Moyen] - Une file avec deux piles" type="python">
<Enonce>
### Une file avec deux piles

Avec une liste Python, `defiler` utilise `pop(0)`, qui décale toutes les cases. Une file peut aussi se programmer avec **deux piles**, sans ce décalage.

Écrire la classe `FileDeuxPiles`, qui a deux attributs de type `Pile` : `entree` et `sortie`.

- `enfiler(x)` empile `x` sur `entree`.
- `defiler()` dépile le sommet de `sortie`. Si `sortie` est vide, on y transvase d'abord **tous** les éléments de `entree`, en les dépilant un par un. Si les deux piles sont vides, la méthode lève `IndexError("file vide")`.
- `est_vide()` renvoie `True` si les deux piles sont vides.

La classe n'utilise que les méthodes des deux piles, sans toucher à leur attribut `elements`.

<PostIt>

- `self.entree = Pile()` et `self.sortie = Pile()` dans `__init__`
- transvaser : `while not a.est_vide(): b.empiler(a.depiler())`
- transvaser retourne l'ordre : le plus ancien arrive au sommet
- ne transvaser que si `sortie` est vide

</PostIt>

<Indices>
<Indice>

Après `enfiler(1)`, `enfiler(2)` et `enfiler(3)`, la pile `entree` contient 1, 2, 3, avec 3 au sommet. Transvasée, la pile `sortie` contient 3, 2, 1, avec 1 au sommet : c'est bien le premier arrivé.

</Indice>
<Indice>

Si `sortie` n'est pas vide, son sommet est déjà le plus ancien élément. Transvaser à ce moment mélangerait l'ordre.

</Indice>
<Indice>

```text
MÉTHODE defiler()
    SI est_vide() ALORS lever IndexError("file vide")
    SI sortie est vide ALORS
        TANT QUE entree n'est pas vide
            empiler depiler(entree) sur sortie
    RENVOYER depiler(sortie)
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class FileDeuxPiles:
    def __init__(self):
        self.entree = Pile()
        self.sortie = Pile()

    def est_vide(self):
        return self.entree.est_vide() and self.sortie.est_vide()

    def enfiler(self, x):
        self.entree.empiler(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        if self.sortie.est_vide():
            while not self.entree.est_vide():
                self.sortie.empiler(self.entree.depiler())
        return self.sortie.depiler()
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class FileDeuxPiles:
    def __init__(self):
        ...

    def est_vide(self):
        ...

    def enfiler(self, x):
        ...

    def defiler(self):
        ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("class FileDeuxPiles", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
f = FileDeuxPiles()
assert isinstance(f.entree, Pile) and isinstance(f.sortie, Pile), "Les attributs entree et sortie sont des piles."
assert f.est_vide() is True, "Une nouvelle file est vide."
for x in [1, 2, 3]:
    f.enfiler(x)
assert f.defiler() == 1, "Le premier arrivé sort le premier : 1."
f.enfiler(4)
assert f.entree.elements == [4] and f.sortie.elements == [3, 2], "4 attend dans entree : sortie n'est transvasée que lorsqu'elle est vide."
assert [f.defiler(), f.defiler(), f.defiler()] == [2, 3, 4] and f.est_vide(), "Ensuite 2, 3, puis 4, et la file est vide."
try:
    f.defiler()
    message = None
except IndexError as erreur:
    message = str(erreur)
assert message == "file vide", "Défiler une file vide lève IndexError('file vide')."
assert ".elements" not in corps and ".pop(" not in corps, "Utiliser les méthodes des piles, sans toucher à elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-3-4" label="3.4 [Moyen] - Annuler et rétablir" type="python">
<Enonce>
### Annuler et rétablir

Un éditeur de texte très simple part d'un texte vide. La file `actions` contient, dans l'ordre :

- `"+abc"` : écrire `abc` à la fin du texte (tout ce qui suit le `+`) ;
- `"annuler"` : revenir au texte d'avant la dernière écriture qui n'a pas été annulée ;
- `"retablir"` : refaire la dernière action annulée.

Une nouvelle écriture efface les actions annulées : après elle, `"retablir"` ne fait plus rien. Annuler ou rétablir quand c'est impossible ne fait rien non plus.

Écrire la fonction `editer(actions)`, qui renvoie le texte final. La file `actions` peut être vidée par la fonction. La fonction utilise deux piles de textes : `historique`, qui garde les textes précédents, et `annules`, qui garde les textes annulés.

Exemples, la tête à gauche :

- si `actions` contient `"+Bon" | "+jour" | "annuler" | "+soir"`, `editer(actions)` renvoie `"Bonsoir"` ;
- si `actions` contient `"+a" | "+b" | "annuler" | "annuler" | "retablir"`, `editer(actions)` renvoie `"a"`.

<PostIt>

- `action = actions.defiler()` ; `action[0] == "+"` repère une écriture, et `action[1:]` est le texte écrit
- écrire : empiler le texte actuel dans `historique`
- annuler : empiler le texte actuel dans `annules`, reprendre le sommet d'`historique`
- une écriture vide la pile `annules` : `annules = Pile()`

</PostIt>

<Indices>
<Indice>

Les piles gardent des textes entiers. Annuler remet simplement le texte d'avant.

</Indice>
<Indice>

Rétablir fait le chemin inverse d'annuler : le texte actuel retourne dans `historique` et le texte repris vient de `annules`.

</Indice>
<Indice>

```text
FONCTION editer(actions)
    texte ← "" ; historique ← nouvelle Pile ; annules ← nouvelle Pile
    TANT QUE actions n'est pas vide
        action ← defiler(actions)
        SI action commence par "+" ALORS
            empiler texte sur historique ; texte ← texte + action sans le "+"
            annules ← nouvelle Pile
        SINON SI action = "annuler" ET historique n'est pas vide ALORS
            empiler texte sur annules ; texte ← depiler(historique)
        SINON SI action = "retablir" ET annules n'est pas vide ALORS
            empiler texte sur historique ; texte ← depiler(annules)
    RENVOYER texte
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def editer(actions):
    texte = ""
    historique = Pile()
    annules = Pile()
    while not actions.est_vide():
        action = actions.defiler()
        if action[0] == "+":
            historique.empiler(texte)
            texte = texte + action[1:]
            annules = Pile()
        elif action == "annuler" and not historique.est_vide():
            annules.empiler(texte)
            texte = historique.depiler()
        elif action == "retablir" and not annules.est_vide():
            historique.empiler(texte)
            texte = annules.depiler()
    return texte
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def editer(actions):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def editer", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
def file_de(elements):
    f = File()
    for x in elements:
        f.enfiler(x)
    return f
assert editer(file_de(["+Bon", "+jour"])) == "Bonjour", "Deux écritures : Bonjour."
assert editer(file_de(["+Bon", "+jour", "annuler", "+soir"])) == "Bonsoir", "Annuler jour, puis écrire soir."
assert editer(file_de(["+a", "+b", "annuler", "annuler", "retablir"])) == "a", "Deux annulations puis un rétablissement : a."
assert editer(file_de(["+a", "+b", "annuler", "annuler", "retablir", "retablir"])) == "ab", "Tout est rétabli : ab."
assert editer(file_de(["+a", "annuler", "+b", "retablir"])) == "b", "Après une nouvelle écriture, rétablir ne fait rien."
assert editer(file_de(["annuler", "retablir", "+x", "annuler", "annuler"])) == "", "Annuler ou rétablir sans rien à faire ne change rien."
assert editer(File()) == "", "Aucune action : le texte reste vide."
assert corps.count("Pile()") >= 2 and ".defiler()" in corps, "Lire les actions dans la file et utiliser deux piles."
assert ".elements" not in corps, "Utiliser les méthodes des piles et de la file, sans toucher à elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-3-5" label="3.5 [Moyen] - Inverser le début d'une file" type="python">
<Enonce>
### Inverser le début d'une file

Écrire la fonction `inverser_debut(f, k)`, qui inverse l'ordre des `k` premiers éléments de la file `f`, à partir de la tête. Les autres éléments gardent leur ordre et restent derrière. Si `k` dépasse la taille de la file, toute la file est inversée. La fonction ne renvoie rien.

La fonction utilise une pile auxiliaire et les méthodes de la file.

Exemple : si `f` contient `1 | 2 | 3 | 4 | 5`, la tête à gauche, après `inverser_debut(f, 3)` elle contient `3 | 2 | 1 | 4 | 5`.

<PostIt>

- défiler les `k` premiers éléments et les empiler
- les dépiler pour les enfiler : leur ordre est inversé
- ils se retrouvent alors derrière les autres
- faire passer les autres, un par un, de la tête à la queue

</PostIt>

<Indices>
<Indice>

Avec `1 | 2 | 3 | 4 | 5` et `k = 3` : après avoir défilé `1`, `2`, `3` vers une pile, puis les avoir dépilés vers la file, la file contient `4 | 5 | 3 | 2 | 1`.

</Indice>
<Indice>

Il reste à faire passer en queue, une fois chacun, les éléments qui étaient derrière les `k` premiers. Leur nombre est la taille de départ moins `k`.

</Indice>
<Indice>

```text
FONCTION inverser_debut(f, k)
    k ← minimum de k et de taille(f)
    reste ← taille(f) - k
    p ← nouvelle Pile
    RÉPÉTER k FOIS
        empiler defiler(f) sur p
    TANT QUE p n'est pas vide
        enfiler depiler(p) dans f
    RÉPÉTER reste FOIS
        enfiler defiler(f) dans f
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def inverser_debut(f, k):
    k = min(k, f.taille())
    reste = f.taille() - k
    p = Pile()
    for _ in range(k):
        p.empiler(f.defiler())
    while not p.est_vide():
        f.enfiler(p.depiler())
    for _ in range(reste):
        f.enfiler(f.defiler())
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def inverser_debut(f, k):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def inverser_debut", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
def file_de(liste):
    f = File()
    for x in liste:
        f.enfiler(x)
    return f
f = file_de([1, 2, 3, 4, 5])
assert inverser_debut(f, 3) is None and f.elements == [3, 2, 1, 4, 5], "k = 3 : [1, 2, 3, 4, 5] devient [3, 2, 1, 4, 5]."
f = file_de([1, 2, 3, 4, 5])
inverser_debut(f, 5)
assert f.elements == [5, 4, 3, 2, 1], "k = taille : toute la file est inversée."
f = file_de(["a", "b", "c"])
inverser_debut(f, 0)
assert f.elements == ["a", "b", "c"], "k = 0 : la file ne change pas."
f = file_de([1, 2])
inverser_debut(f, 7)
assert f.elements == [2, 1], "k plus grand que la taille : toute la file est inversée."
f = file_de([])
inverser_debut(f, 2)
assert f.elements == [], "Une file vide reste vide."
assert "Pile()" in corps, "Passer par une pile auxiliaire."
assert ".elements" not in corps, "Utiliser les méthodes de la file, sans toucher à elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-3-6" label="3.6 [Moyen] - Effacer les paires" type="python">
<Enonce>
### Effacer les paires

Dans un mot, deux lettres identiques placées côte à côte s'effacent. L'effacement continue tant qu'il reste une telle paire. Par exemple, dans `"abbaca"`, la paire `"bb"` s'efface et laisse `"aaca"`, puis la paire `"aa"` s'efface et laisse `"ca"`.

Écrire la fonction `reduire(mot)`, qui renvoie le mot qui reste à la fin. La fonction parcourt le mot une seule fois, avec une pile.

Exemples : `reduire("abbaca")` renvoie `"ca"`, `reduire("aabb")` renvoie `""` et `reduire("abc")` renvoie `"abc"`.

Contrainte : sans `replace`.

<PostIt>

- parcourir le mot lettre par lettre
- comparer la lettre au sommet de la pile
- égale au sommet : dépiler ; sinon : empiler
- à la fin, dépiler en ajoutant chaque lettre **devant** le résultat

</PostIt>

<Indices>
<Indice>

La pile contient le début du mot, déjà réduit. Une nouvelle lettre égale au sommet forme une paire avec lui : les deux disparaissent.

</Indice>
<Indice>

Après le parcours, la pile contient le mot final, sa dernière lettre au sommet. En dépilant, les lettres sortent de la dernière à la première.

</Indice>
<Indice>

```text
FONCTION reduire(mot)
    p ← nouvelle Pile
    POUR CHAQUE lettre DE mot
        SI p n'est pas vide ET sommet(p) = lettre ALORS
            depiler(p)
        SINON
            empiler lettre sur p
    resultat ← ""
    TANT QUE p n'est pas vide
        resultat ← depiler(p) + resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def reduire(mot):
    p = Pile()
    for lettre in mot:
        if not p.est_vide() and p.sommet() == lettre:
            p.depiler()
        else:
            p.empiler(lettre)
    resultat = ""
    while not p.est_vide():
        resultat = p.depiler() + resultat
    return resultat
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def reduire(mot):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def reduire", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
assert reduire("abbaca") == "ca", "\"abbaca\" : bb s'efface, puis aa, il reste \"ca\"."
assert reduire("aabb") == "" and reduire("abba") == "", "Tout s'efface : le mot vide."
assert reduire("abc") == "abc", "Aucune paire : le mot ne change pas."
assert reduire("") == "", "Le mot vide reste vide."
assert reduire("azxxzy") == "ay", "\"azxxzy\" : xx, puis zz, il reste \"ay\"."
assert reduire("aaa") == "a", "\"aaa\" : une paire s'efface, il reste \"a\"."
assert "Pile()" in corps and ".elements" not in corps, "Passer par une pile et ses méthodes."
assert "replace" not in corps, "Sans replace."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-4-1" label="4.1 [Difficile] - Le problème de Josèphe" type="python">
<Enonce>
### Le problème de Josèphe

`n` personnes, numérotées de 1 à `n`, sont assises en cercle. On compte à partir de la personne 1 : la `k`-ième personne comptée quitte le cercle. On recommence à compter à partir de la personne suivante, et ainsi de suite jusqu'à ce que tout le monde soit sorti.

Écrire la fonction `josephe(n, k)`, qui renvoie la liste des numéros dans leur ordre de sortie. Le dernier numéro de la liste est celui du survivant. La fonction utilise une file pour représenter le cercle.

Exemple : `josephe(7, 3)` renvoie `[3, 6, 2, 7, 5, 1, 4]`.

<Indices>
<Indice>

Le cercle se représente par une file : une personne qui est comptée sans sortir passe de la tête à la queue.

</Indice>
<Indice>

À chaque tour, `k - 1` personnes passent en queue, puis la suivante sort.

</Indice>
<Indice>

```text
FONCTION josephe(n, k)
    f ← nouvelle File ; enfiler 1, 2, …, n dans f
    sorties ← liste vide
    TANT QUE f n'est pas vide
        RÉPÉTER k - 1 FOIS
            enfiler defiler(f) dans f
        ajouter defiler(f) à sorties
    RENVOYER sorties
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def josephe(n, k):
    f = File()
    for i in range(1, n + 1):
        f.enfiler(i)
    sorties = []
    while not f.est_vide():
        for _ in range(k - 1):
            f.enfiler(f.defiler())
        sorties.append(f.defiler())
    return sorties
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def josephe(n, k):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def josephe", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
assert josephe(7, 3) == [3, 6, 2, 7, 5, 1, 4], "7 personnes, on compte jusqu'à 3."
assert josephe(5, 2) == [2, 4, 1, 5, 3], "5 personnes, on compte jusqu'à 2."
assert josephe(4, 1) == [1, 2, 3, 4], "k = 1 : les personnes sortent dans l'ordre."
assert josephe(1, 5) == [1] and josephe(0, 3) == [], "Une seule personne, puis personne."
assert josephe(41, 3)[-1] == 31, "Avec 41 personnes et k = 3, le survivant est le numéro 31."
assert "File()" in corps and ".elements" not in corps, "Représenter le cercle par une file."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-4-2" label="4.2 [Difficile] - Trier une pile" type="python">
<Enonce>
### Trier une pile

Écrire la fonction `trier_pile(p)`, qui renvoie une nouvelle `Pile` contenant les éléments de `p` triés, le plus grand au sommet. La pile `p` est vidée par la fonction.

La fonction n'utilise que des piles et leurs méthodes : pas de liste Python, pas de `sort` ni de `sorted`, pas d'accès à `elements`.

Exemple : si `p` contient, du fond vers le sommet, `3, 1, 4, 1, 5`, la pile renvoyée contient `1, 1, 3, 4, 5`.

<Indices>
<Indice>

La pile résultat reste triée à tout moment. Il faut y insérer chaque élément dépilé de `p` à sa place.

</Indice>
<Indice>

Pour placer `x`, les éléments de la pile résultat plus grands que `x` repartent provisoirement dans `p`. Ils reviendront plus tard dans le résultat.

</Indice>
<Indice>

```text
FONCTION trier_pile(p)
    r ← nouvelle Pile
    TANT QUE p n'est pas vide
        x ← depiler(p)
        TANT QUE r n'est pas vide ET sommet(r) > x
            empiler depiler(r) sur p
        empiler x sur r
    RENVOYER r
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def trier_pile(p):
    r = Pile()
    while not p.est_vide():
        x = p.depiler()
        while not r.est_vide() and r.sommet() > x:
            p.empiler(r.depiler())
        r.empiler(x)
    return r
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def trier_pile(p):
    ...
```

</CodeDepart>
<Verification>

```python
import re
corps = PROGRAMME.split("def trier_pile", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
def pile_de(valeurs):
    p = Pile()
    for x in valeurs:
        p.empiler(x)
    return p
depart = pile_de([3, 1, 4, 1, 5])
r = trier_pile(depart)
assert isinstance(r, Pile) and r.elements == [1, 1, 3, 4, 5], "3, 1, 4, 1, 5 donne 1, 1, 3, 4, 5, avec 5 au sommet."
assert depart.est_vide(), "La pile de départ est vidée."
assert trier_pile(pile_de([9, 8, 7, 6])).elements == [6, 7, 8, 9] and trier_pile(Pile()).est_vide(), "Pile décroissante, puis pile vide."
assert trier_pile(pile_de(["poire", "abricot", "kiwi"])).elements == ["abricot", "kiwi", "poire"], "Avec des textes."
assert not re.search(r"sort|\.elements|\[", corps), "Seulement des piles : sans liste, sans tri, sans elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-4-3" label="4.3 [Difficile] - Une pile qui connaît son minimum" type="python">
<Enonce>
### Une pile qui connaît son minimum

Écrire la classe `PileMin`, une pile qui donne à tout moment son plus petit élément, sans parcourir ses éléments. Elle a deux attributs de type `Pile` : `valeurs`, qui contient les éléments, et `minimums`, dont le sommet est toujours le minimum actuel.

Méthodes à écrire : `est_vide()`, `empiler(x)`, `depiler()`, `sommet()` et `minimum()`. Sur une pile vide, `depiler`, `sommet` et `minimum` lèvent `IndexError("pile vide")`.

Contrainte : sans `min`, sans boucle et sans accès à `elements` dans la classe `PileMin`.

```python
p = PileMin()
for x in [5, 3, 7]:
    p.empiler(x)
print(p.minimum())   # 3
p.depiler()
p.depiler()
print(p.minimum())   # 5
```

<Indices>
<Indice>

Quand on empile `x`, le nouveau minimum est `x` s'il est plus petit que le minimum actuel (ou si la pile était vide). Sinon, le minimum ne change pas.

</Indice>
<Indice>

La pile `minimums` reçoit un élément à chaque empilement : le minimum en vigueur à ce moment. Elle perd donc aussi un élément à chaque dépilement.

</Indice>
<Indice>

```text
MÉTHODE empiler(x)
    empiler x sur valeurs
    SI minimums est vide OU x < sommet(minimums) ALORS empiler x sur minimums
    SINON empiler sommet(minimums) sur minimums

MÉTHODE depiler()
    SI est_vide() ALORS lever IndexError("pile vide")
    depiler(minimums)
    RENVOYER depiler(valeurs)
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class PileMin:
    def __init__(self):
        self.valeurs = Pile()
        self.minimums = Pile()

    def est_vide(self):
        return self.valeurs.est_vide()

    def empiler(self, x):
        self.valeurs.empiler(x)
        if self.minimums.est_vide() or x < self.minimums.sommet():
            self.minimums.empiler(x)
        else:
            self.minimums.empiler(self.minimums.sommet())

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        self.minimums.depiler()
        return self.valeurs.depiler()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.valeurs.sommet()

    def minimum(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.minimums.sommet()
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class PileMin:
    def __init__(self):
        self.valeurs = Pile()
        self.minimums = Pile()
```

</CodeDepart>
<Verification>

```python
import re
corps = PROGRAMME.split("class PileMin", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
p = PileMin()
assert isinstance(p.valeurs, Pile) and isinstance(p.minimums, Pile) and p.est_vide(), "Deux attributs de type Pile, et une pile vide au départ."
for x in [5, 3, 7, 3, 1]:
    p.empiler(x)
assert p.minimum() == 1 and p.sommet() == 1, "Après 5, 3, 7, 3, 1 : minimum 1."
assert p.depiler() == 1 and p.minimum() == 3, "On retire 1 : minimum 3."
assert p.depiler() == 3 and p.minimum() == 3, "On retire un 3 : il en reste un autre, minimum 3."
assert p.depiler() == 7 and p.minimum() == 3 and p.depiler() == 3 and p.minimum() == 5, "Puis 7, puis le dernier 3 : minimum 5."
for methode in ["depiler", "sommet", "minimum"]:
    try:
        getattr(PileMin(), methode)()
        message = None
    except IndexError as erreur:
        message = str(erreur)
    assert message == "pile vide", "Sur une pile vide, depiler, sommet et minimum lèvent IndexError('pile vide')."
assert not re.search(r"\bmin\s*\(|\bfor\b|\bwhile\b|\.elements", corps), "Sans min, sans boucle et sans elements."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-4-4" label="4.4 [Difficile] - Le prochain plus grand" type="python">
<Enonce>
### Le prochain plus grand

Pour chaque élément d'une liste, on cherche le **premier élément strictement plus grand situé à sa droite**. S'il n'y en a pas, la réponse est `None`.

Écrire la fonction `prochains_plus_grands(liste)`, qui renvoie la liste de ces réponses, dans l'ordre. Elle parcourt `liste` une seule fois et garde dans une pile les **indices** des éléments qui attendent encore leur réponse.

Exemple : `prochains_plus_grands([2, 7, 3, 5, 4, 6, 8])` renvoie `[7, 8, 5, 6, 6, 8, None]`.

<Indices>
<Indice>

Quand l'élément `liste[i]` arrive, il est la réponse de tous les éléments en attente plus petits que lui. Ceux-ci sont justement au sommet de la pile.

</Indice>
<Indice>

Les valeurs des indices en attente, du fond vers le sommet, sont toujours décroissantes. Il suffit donc de dépiler tant que le sommet désigne une valeur plus petite que `liste[i]`.

</Indice>
<Indice>

```text
FONCTION prochains_plus_grands(liste)
    reponses ← liste de longueur(liste) cases valant None
    p ← nouvelle Pile
    POUR i ALLANT DE 0 À longueur(liste) - 1
        TANT QUE p n'est pas vide ET liste[sommet(p)] < liste[i]
            reponses[depiler(p)] ← liste[i]
        empiler i sur p
    RENVOYER reponses
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def prochains_plus_grands(liste):
    reponses = [None] * len(liste)
    p = Pile()
    for i in range(len(liste)):
        while not p.est_vide() and liste[p.sommet()] < liste[i]:
            reponses[p.depiler()] = liste[i]
        p.empiler(i)
    return reponses
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def prochains_plus_grands(liste):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def prochains_plus_grands", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
assert prochains_plus_grands([2, 7, 3, 5, 4, 6, 8]) == [7, 8, 5, 6, 6, 8, None], "[2, 7, 3, 5, 4, 6, 8]."
assert prochains_plus_grands([5, 4, 3]) == [None, None, None] and prochains_plus_grands([]) == [], "Liste décroissante, puis liste vide."
assert prochains_plus_grands([1, 1, 2]) == [2, 2, None], "Strictement plus grand : 1 n'est pas la réponse de 1."
grand = list(range(20000, 0, -1)) + [30000]
assert prochains_plus_grands(grand)[0] == 30000, "Une longue liste se traite en un seul parcours."
assert "Pile()" in corps, "Garder les indices en attente dans une pile."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-4-5" label="4.5 [Difficile] - La voie de garage" type="python">
<Enonce>
### La voie de garage

Des wagons numérotés `1, 2, …, n` arrivent sur une voie, dans cet ordre. Avant de partir, chaque wagon entre dans une voie de garage en cul-de-sac, qui fonctionne comme une pile : seul le dernier wagon entré peut ressortir. À tout moment, le wagon au bout de la voie de garage peut partir sur la voie de sortie.

Écrire la fonction `est_realisable(sortie)`, qui renvoie `True` si les wagons peuvent partir dans l'ordre donné par la liste `sortie`, et `False` sinon. La liste `sortie` contient chaque numéro de `1` à `n` une fois.

Exemples :

- `est_realisable([3, 2, 1])` renvoie `True` : les trois wagons entrent, puis partent ;
- `est_realisable([2, 1, 3])` renvoie `True` ;
- `est_realisable([3, 1, 2])` renvoie `False` : une fois le wagon 3 parti, le wagon 2 bloque le wagon 1.

<Indices>
<Indice>

Parcourir `sortie` dans l'ordre. Pour faire partir le wagon attendu, faire entrer dans la voie de garage les wagons qui arrivent, jusqu'à ce qu'il soit au bout.

</Indice>
<Indice>

Si le wagon attendu est déjà entré dans la voie de garage mais n'est pas au sommet, l'ordre est impossible. Une variable `prochain` garde le numéro du prochain wagon à arriver.

</Indice>
<Indice>

```text
FONCTION est_realisable(sortie)
    p ← nouvelle Pile ; prochain ← 1
    POUR CHAQUE w DE sortie
        TANT QUE prochain ≤ w
            empiler prochain sur p ; prochain ← prochain + 1
        SI p est vide OU sommet(p) ≠ w ALORS RENVOYER Faux
        depiler(p)
    RENVOYER Vrai
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def est_realisable(sortie):
    p = Pile()
    prochain = 1
    for w in sortie:
        while prochain <= w:
            p.empiler(prochain)
            prochain = prochain + 1
        if p.est_vide() or p.sommet() != w:
            return False
        p.depiler()
    return True
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def est_realisable(sortie):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def est_realisable", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
assert est_realisable([3, 2, 1]) is True and est_realisable([1, 2, 3]) is True, "[3, 2, 1] et [1, 2, 3] sont réalisables."
assert est_realisable([2, 1, 3]) is True and est_realisable([2, 3, 1]) is True, "[2, 1, 3] et [2, 3, 1] sont réalisables."
assert est_realisable([3, 1, 2]) is False, "[3, 1, 2] : le wagon 2 bloque le wagon 1."
assert est_realisable([4, 5, 3, 2, 1]) is True and est_realisable([1, 5, 4, 3, 2]) is True, "Deux ordres réalisables avec 5 wagons."
assert est_realisable([4, 3, 5, 1, 2]) is False, "[4, 3, 5, 1, 2] : le wagon 2 bloque le wagon 1."
assert est_realisable([]) is True and est_realisable([1]) is True, "Aucun wagon, puis un seul wagon."
assert "Pile()" in corps and ".elements" not in corps, "Représenter la voie de garage par une pile."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-4-6" label="4.6 [Difficile] - Le tourniquet" type="python">
<Enonce>
### Le tourniquet

Un processeur exécute plusieurs programmes à tour de rôle. Chaque programme est un couple `(nom, duree)`, où `duree` est le temps de calcul dont il a besoin. Les programmes attendent dans une file, dans l'ordre de la liste. Le temps commence à `0`.

À chaque tour, le programme en tête sort de la file et s'exécute pendant `quantum` unités de temps, ou moins s'il lui en reste moins. S'il n'a pas fini, il retourne en queue avec le temps de calcul qui lui reste.

Écrire la fonction `tourniquet(programmes, quantum)`, qui renvoie la liste des couples `(nom, fin)`, où `fin` est l'instant où le programme se termine, dans l'ordre où les programmes se terminent.

```python
print(tourniquet([("A", 5), ("B", 2), ("C", 4)], 2))
# [('B', 4), ('C', 10), ('A', 11)]
```

Dans cet exemple, A s'exécute de 0 à 2, B de 2 à 4 et se termine, C de 4 à 6, A de 6 à 8, C de 8 à 10 et se termine, puis A de 10 à 11.

<Indices>
<Indice>

La file contient des couples `(nom, reste)`. Une variable `temps` avance de la durée de chaque exécution.

</Indice>
<Indice>

Une exécution dure `min(quantum, reste)`. Si le reste tombe à `0`, le programme est terminé à l'instant `temps` ; sinon il est enfilé de nouveau.

</Indice>
<Indice>

```text
FONCTION tourniquet(programmes, quantum)
    f ← nouvelle File ; enfiler chaque couple de programmes dans f
    temps ← 0 ; fins ← liste vide
    TANT QUE f n'est pas vide
        (nom, reste) ← defiler(f)
        duree ← minimum de quantum et de reste
        temps ← temps + duree ; reste ← reste - duree
        SI reste = 0 ALORS ajouter (nom, temps) à fins
        SINON enfiler (nom, reste) dans f
    RENVOYER fins
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def tourniquet(programmes, quantum):
    f = File()
    for programme in programmes:
        f.enfiler(programme)
    temps = 0
    fins = []
    while not f.est_vide():
        nom, reste = f.defiler()
        duree = min(quantum, reste)
        temps = temps + duree
        reste = reste - duree
        if reste == 0:
            fins.append((nom, temps))
        else:
            f.enfiler((nom, reste))
    return fins
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def tourniquet(programmes, quantum):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def tourniquet", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
assert tourniquet([("A", 5), ("B", 2), ("C", 4)], 2) == [("B", 4), ("C", 10), ("A", 11)], "L'exemple de l'énoncé."
assert tourniquet([("A", 4), ("B", 4)], 2) == [("A", 6), ("B", 8)], "A et B alternent : A finit à 6, B à 8."
assert tourniquet([("A", 3), ("B", 1)], 10) == [("A", 3), ("B", 4)], "Un grand quantum : chacun s'exécute d'un coup, dans l'ordre."
assert tourniquet([("A", 3)], 1) == [("A", 3)], "Un seul programme."
assert tourniquet([], 3) == [], "Aucun programme."
programmes = [("A", 2)]
tourniquet(programmes, 1)
assert programmes == [("A", 2)], "La liste de départ n'est pas modifiée."
assert "File()" in corps and ".elements" not in corps, "Faire attendre les programmes dans une file."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-5-1" label="5.1 [Expert] - Sortir du labyrinthe" type="python">
<Enonce>
### Sortir du labyrinthe

Un labyrinthe est donné par une liste de chaînes de même longueur : `"#"` est un mur et `"."` une case libre. Une case est repérée par le couple `(ligne, colonne)`. À chaque pas, on passe à une case libre voisine en haut, en bas, à gauche ou à droite.

Écrire la fonction `distance(grille, depart, arrivee)`, qui renvoie le nombre minimal de pas pour aller de `depart` à `arrivee`, ou `-1` si l'arrivée est inaccessible.

La fonction fait un **parcours en largeur** : une file contient les cases à explorer, dans l'ordre où elles ont été découvertes, et un dictionnaire associe à chaque case découverte sa distance au départ.

```python
grille = ["....#",
          ".##.#",
          "...#.",
          "#...."]
print(distance(grille, (0, 0), (3, 4)))   # 7
```

<Indices>
<Indice>

Les cases sortent de la file dans l'ordre de leur distance au départ : toutes celles à distance 1, puis toutes celles à distance 2, etc. La première fois que l'arrivée sort de la file, sa distance est donc minimale.

</Indice>
<Indice>

Une case déjà présente dans le dictionnaire a déjà été découverte par un chemin plus court ou égal : il ne faut pas l'enfiler une seconde fois.

</Indice>
<Indice>

```text
FONCTION distance(grille, depart, arrivee)
    dist ← {depart: 0} ; f ← nouvelle File ; enfiler depart dans f
    TANT QUE f n'est pas vide
        case ← defiler(f)
        SI case = arrivee ALORS RENVOYER dist[case]
        POUR CHAQUE voisine de case dans la grille, libre et absente de dist
            dist[voisine] ← dist[case] + 1 ; enfiler voisine dans f
    RENVOYER -1
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def distance(grille, depart, arrivee):
    dist = {depart: 0}
    f = File()
    f.enfiler(depart)
    while not f.est_vide():
        case = f.defiler()
        if case == arrivee:
            return dist[case]
        ligne, colonne = case
        for dl, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            l, c = ligne + dl, colonne + dc
            if 0 <= l < len(grille) and 0 <= c < len(grille[0]) and grille[l][c] != "#" and (l, c) not in dist:
                dist[(l, c)] = dist[case] + 1
                f.enfiler((l, c))
    return -1
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def distance(grille, depart, arrivee):
    ...


grille = ["....#",
          ".##.#",
          "...#.",
          "#...."]
print(distance(grille, (0, 0), (3, 4)))
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def distance", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
G = ["....#", ".##.#", "...#.", "#...."]
assert distance(G, (0, 0), (3, 4)) == 7, "De (0, 0) à (3, 4) : 7 pas."
assert distance(G, (0, 0), (2, 4)) == 8 and distance(G, (0, 0), (0, 3)) == 3, "Vers (2, 4), puis vers (0, 3)."
assert distance(G, (2, 2), (2, 2)) == 0, "Départ et arrivée confondus : 0 pas."
assert distance([".#."], (0, 0), (0, 2)) == -1, "Arrivée inaccessible : -1."
vaste = ["." * 60 for _ in range(60)]
assert distance(vaste, (0, 0), (59, 59)) == 118, "Une grande salle vide se traverse vite."
assert "File()" in corps, "Parcours en largeur avec une file."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-5-2" label="5.2 [Expert] - Les tours de Hanoï" type="python">
<Enonce>
### Les tours de Hanoï

Le jeu des tours de Hanoï comporte trois tiges, `"A"`, `"B"` et `"C"`. Au départ, `n` disques de tailles 1 à `n` sont empilés sur la tige `"A"`, le plus grand en bas. Il faut tous les amener sur la tige `"C"`, en déplaçant un seul disque à la fois et sans jamais poser un disque sur un disque plus petit.

1. Écrire la classe `Tour`, **sous-classe** de `Pile`, dont la méthode `empiler(disque)` lève l'erreur `ValueError("disque trop grand")` si `disque` est plus grand que le sommet actuel.
2. Écrire la fonction `hanoi(n)`, qui crée les trois tours dans un dictionnaire `{"A": …, "B": …, "C": …}`, place les `n` disques sur `"A"`, puis les déplace tous sur `"C"`. Elle renvoie le couple `(tours, coups)`, où `coups` est la liste des déplacements effectués, chacun sous la forme `(origine, destination)`, par exemple `("A", "C")`.

Le nombre de coups doit être minimal, c'est-à-dire égal à $2^n - 1$.

<Indices>
<Indice>

Dans `Tour`, la méthode `empiler` vérifie la règle, puis appelle la méthode de `Pile` avec `super().empiler(disque)`.

</Indice>
<Indice>

Pour déplacer `k` disques de l'origine vers la destination, on déplace les `k - 1` disques du dessus vers la tige intermédiaire, puis le plus grand vers la destination, puis les `k - 1` disques de l'intermédiaire vers la destination. Une fonction récursive `deplacer(k, origine, destination, intermediaire, tours, coups)` s'en charge.

</Indice>
<Indice>

```text
FONCTION deplacer(k, origine, destination, intermediaire, tours, coups)
    SI k = 0 ALORS RENVOYER rien
    deplacer(k - 1, origine, intermediaire, destination, tours, coups)
    empiler depiler(tours[origine]) sur tours[destination]
    ajouter (origine, destination) à coups
    deplacer(k - 1, intermediaire, destination, origine, tours, coups)
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class Tour(Pile):
    def empiler(self, disque):
        if not self.est_vide() and disque > self.sommet():
            raise ValueError("disque trop grand")
        super().empiler(disque)


def deplacer(k, origine, destination, intermediaire, tours, coups):
    if k == 0:
        return None
    deplacer(k - 1, origine, intermediaire, destination, tours, coups)
    tours[destination].empiler(tours[origine].depiler())
    coups.append((origine, destination))
    deplacer(k - 1, intermediaire, destination, origine, tours, coups)


def hanoi(n):
    tours = {"A": Tour(), "B": Tour(), "C": Tour()}
    for disque in range(n, 0, -1):
        tours["A"].empiler(disque)
    coups = []
    deplacer(n, "A", "C", "B", tours, coups)
    return (tours, coups)
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


class Tour(Pile):
    ...


def hanoi(n):
    ...
```

</CodeDepart>
<Verification>

```python
t = Tour()
t.empiler(3)
t.empiler(1)
try:
    t.empiler(2)
    message = None
except ValueError as erreur:
    message = str(erreur)
assert isinstance(t, Pile) and message == "disque trop grand", "Tour est une Pile qui refuse un disque plus grand que le sommet."
assert t.elements == [3, 1], "Le disque refusé n'est pas posé."
tours, coups = hanoi(3)
assert tours["C"].elements == [3, 2, 1] and tours["A"].est_vide() and tours["B"].est_vide(), "Les trois disques finissent sur C."
assert all(isinstance(tours[nom], Tour) for nom in "ABC"), "Les trois tiges sont des objets Tour."
assert len(coups) == 7 and coups[0] == ("A", "C"), "3 disques : 7 coups, le premier de A vers C."
tours, coups = hanoi(6)
assert len(coups) == 63 and tours["C"].elements == [6, 5, 4, 3, 2, 1], "6 disques : 63 coups."
tiges = {"A": list(range(6, 0, -1)), "B": [], "C": []}
for origine, destination in coups:
    disque = tiges[origine].pop()
    assert not tiges[destination] or tiges[destination][-1] > disque, "Chaque coup de la liste respecte la règle."
    tiges[destination].append(disque)
assert hanoi(0)[1] == [], "Sans disque, aucun coup."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-5-3" label="5.3 [Expert] - De l'écriture usuelle à la NPI" type="python">
<Enonce>
### De l'écriture usuelle à la NPI

Une expression écrite de façon usuelle, comme `3 + 4 * 2`, se convertit en notation polonaise inverse (`3 4 2 * +`) avec l'**algorithme de la gare de triage**, dû à Edsger Dijkstra. Les nombres passent directement dans la sortie, et les opérateurs attendent sur une pile.

Écrire la fonction `vers_npi(expression)`. Les morceaux de l'expression sont séparés par des espaces : des entiers, les opérateurs `+ - * /` et des parenthèses. La fonction renvoie l'expression en NPI, sous forme de chaîne aux morceaux séparés par des espaces.

Règles :

- `*` et `/` sont prioritaires sur `+` et `-` ;
- à priorité égale, on calcule de gauche à droite : `8 - 3 - 2` donne `8 3 - 2 -`.

Exemples : `vers_npi("( 3 + 4 ) * 2")` renvoie `"3 4 + 2 *"`.

<Indices>
<Indice>

Avant d'empiler un opérateur, on dépile vers la sortie les opérateurs du sommet de priorité **supérieure ou égale**. On s'arrête sur une parenthèse ouvrante.

</Indice>
<Indice>

Une parenthèse ouvrante est empilée. Une parenthèse fermante fait passer dans la sortie tous les opérateurs jusqu'à la parenthèse ouvrante, qui est retirée. À la fin, les opérateurs restants passent dans la sortie.

</Indice>
<Indice>

```text
FONCTION vers_npi(expression)
    priorite ← {"+": 1, "-": 1, "*": 2, "/": 2}
    sortie ← liste vide ; p ← nouvelle Pile
    POUR CHAQUE m DE expression découpée aux espaces
        SI m est un opérateur ALORS
            TANT QUE p n'est pas vide ET sommet(p) ≠ "(" ET priorite[sommet(p)] ≥ priorite[m]
                ajouter depiler(p) à sortie
            empiler m sur p
        SINON SI m = "(" ALORS empiler m sur p
        SINON SI m = ")" ALORS
            TANT QUE sommet(p) ≠ "(" : ajouter depiler(p) à sortie
            depiler(p)
        SINON ajouter m à sortie
    TANT QUE p n'est pas vide : ajouter depiler(p) à sortie
    RENVOYER sortie, morceaux séparés par des espaces
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def vers_npi(expression):
    priorite = {"+": 1, "-": 1, "*": 2, "/": 2}
    sortie = []
    p = Pile()
    for m in expression.split():
        if m in priorite:
            while not p.est_vide() and p.sommet() != "(" and priorite[p.sommet()] >= priorite[m]:
                sortie.append(p.depiler())
            p.empiler(m)
        elif m == "(":
            p.empiler(m)
        elif m == ")":
            while p.sommet() != "(":
                sortie.append(p.depiler())
            p.depiler()
        else:
            sortie.append(m)
    while not p.est_vide():
        sortie.append(p.depiler())
    return " ".join(sortie)
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def vers_npi(expression):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def vers_npi", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
assert vers_npi("3 + 4 * 2") == "3 4 2 * +", "3 + 4 * 2 : la multiplication d'abord."
assert vers_npi("( 3 + 4 ) * 2") == "3 4 + 2 *", "Les parenthèses changent l'ordre."
assert vers_npi("8 - 3 - 2") == "8 3 - 2 -" and vers_npi("8 / 4 * 2") == "8 4 / 2 *", "À priorité égale, de gauche à droite."
assert vers_npi("2 * ( 3 + 4 ) - 5 / ( 1 + 4 )") == "2 3 4 + * 5 1 4 + / -", "Une expression complète."
assert vers_npi("42") == "42" and vers_npi("( ( 7 ) )") == "7", "Un nombre seul, même entre parenthèses."
assert "Pile()" in corps, "Les opérateurs attendent sur une pile."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-5-4" label="5.4 [Expert] - Le plus grand rectangle" type="python">
<Enonce>
### Le plus grand rectangle

Un histogramme est donné par la liste des hauteurs de ses barres, toutes de largeur 1 et posées côte à côte. On cherche l'aire du plus grand rectangle entièrement contenu dans l'histogramme.

Pour `[2, 1, 5, 6, 2, 3]`, le plus grand rectangle a une hauteur de 5 et couvre les deux barres de hauteur 5 et 6 : son aire vaut 10.

Écrire la fonction `plus_grand_rectangle(hauteurs)`, qui renvoie cette aire, ou 0 pour une liste vide. Elle parcourt les barres une seule fois, en gardant dans une pile les indices de barres de hauteurs croissantes.

<Indices>
<Indice>

Pour chaque barre, le rectangle le plus large de sa hauteur s'étend vers la gauche et vers la droite jusqu'à la première barre plus basse. Quand une barre plus basse arrive, les barres plus hautes du sommet de la pile connaissent donc leur limite droite.

</Indice>
<Indice>

Quand l'indice `j` est dépilé, sa limite gauche est l'indice resté au sommet (ou -1 si la pile est vide), et sa limite droite est l'indice `i` de la barre qui vient d'arriver. La largeur vaut `i - gauche - 1`. Ajouter une barre de hauteur 0 à la fin force tous les dépilements.

</Indice>
<Indice>

```text
FONCTION plus_grand_rectangle(hauteurs)
    h ← hauteurs suivie d'une barre de hauteur 0
    p ← nouvelle Pile ; meilleur ← 0
    POUR i ALLANT DE 0 À longueur(h) - 1
        TANT QUE p n'est pas vide ET h[sommet(p)] ≥ h[i]
            haut ← h[depiler(p)]
            gauche ← -1 SI p est vide, SINON sommet(p)
            meilleur ← maximum(meilleur, haut × (i - gauche - 1))
        empiler i sur p
    RENVOYER meilleur
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def plus_grand_rectangle(hauteurs):
    h = hauteurs + [0]
    p = Pile()
    meilleur = 0
    for i in range(len(h)):
        while not p.est_vide() and h[p.sommet()] >= h[i]:
            haut = h[p.depiler()]
            gauche = -1 if p.est_vide() else p.sommet()
            meilleur = max(meilleur, haut * (i - gauche - 1))
        p.empiler(i)
    return meilleur
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def plus_grand_rectangle(hauteurs):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def plus_grand_rectangle", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
assert plus_grand_rectangle([2, 1, 5, 6, 2, 3]) == 10, "[2, 1, 5, 6, 2, 3] : 10."
assert plus_grand_rectangle([2, 4]) == 4 and plus_grand_rectangle([3, 3, 3]) == 9, "[2, 4], puis trois barres égales."
assert plus_grand_rectangle([]) == 0 and plus_grand_rectangle([7]) == 7, "Liste vide, puis une seule barre."
assert plus_grand_rectangle([6, 2, 5, 4, 5, 1, 6]) == 12, "[6, 2, 5, 4, 5, 1, 6] : 12."
depart = [1, 2]
plus_grand_rectangle(depart)
assert depart == [1, 2], "La liste des hauteurs n'est pas modifiée."
assert plus_grand_rectangle(list(range(1, 20001))) == 100010000, "Une longue liste se traite en un seul parcours."
assert "Pile()" in corps, "Garder les indices dans une pile."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-5-5" label="5.5 [Expert] - Décompresser un texte" type="python">
<Enonce>
### Décompresser un texte

Un texte est compressé avec la règle suivante : `k[texte]` remplace `texte` répété `k` fois. Le nombre `k` est un entier positif, qui peut avoir plusieurs chiffres. Les crochets peuvent être imbriqués, et les lettres hors des crochets restent telles quelles.

Écrire la fonction `decompresser(code)`, qui renvoie le texte complet.

```python
print(decompresser("3[ab]c"))      # abababc
print(decompresser("2[a3[b]]"))    # abbbabbb
print(decompresser("10[x]"))       # xxxxxxxxxx
```

La fonction lit `code` une seule fois, caractère par caractère, avec une pile.

<Indices>
<Indice>

À chaque crochet ouvrant, le texte déjà construit et le nombre qui vient d'être lu sont mis de côté sur la pile, sous la forme d'un couple. La construction repart alors d'un texte vide.

</Indice>
<Indice>

Au crochet fermant, le texte en cours est répété, puis placé derrière le texte mis de côté. Un nombre de plusieurs chiffres se lit avec `nombre = nombre * 10 + int(c)`.

</Indice>
<Indice>

```text
FONCTION decompresser(code)
    p ← nouvelle Pile ; courant ← "" ; nombre ← 0
    POUR CHAQUE caractère c DE code
        SI c est un chiffre ALORS
            nombre ← nombre × 10 + valeur de c
        SINON SI c = "[" ALORS
            empiler (courant, nombre) sur p
            courant ← "" ; nombre ← 0
        SINON SI c = "]" ALORS
            (avant, k) ← depiler(p)
            courant ← avant + courant répété k fois
        SINON
            courant ← courant + c
    RENVOYER courant
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def decompresser(code):
    p = Pile()
    courant = ""
    nombre = 0
    for c in code:
        if c.isdigit():
            nombre = nombre * 10 + int(c)
        elif c == "[":
            p.empiler((courant, nombre))
            courant = ""
            nombre = 0
        elif c == "]":
            avant, k = p.depiler()
            courant = avant + courant * k
        else:
            courant = courant + c
    return courant
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def decompresser(code):
    ...
```

</CodeDepart>
<Verification>

```python
corps = PROGRAMME.split("def decompresser", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
assert decompresser("3[ab]c") == "abababc", "3[ab]c donne abababc."
assert decompresser("2[a3[b]]") == "abbbabbb", "Crochets imbriqués : 2[a3[b]] donne abbbabbb."
assert decompresser("10[x]") == "x" * 10 and decompresser("12[z]") == "z" * 12, "Un nombre de deux chiffres."
assert decompresser("3[a2[c]]") == "accaccacc", "3[a2[c]] donne accaccacc."
assert decompresser("2[ab]3[c]d") == "ababcccd", "Deux groupes à la suite."
assert decompresser("abc") == "abc" and decompresser("") == "", "Sans crochets, le texte ne change pas."
assert decompresser("x2[y2[z]]w") == "xyzzyzzw", "Des lettres avant, entre et après les groupes."
assert "Pile()" in corps and ".elements" not in corps, "Passer par une pile et ses méthodes."
assert "eval" not in corps and "replace" not in corps, "Sans eval ni replace."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-5-6" label="5.6 [Expert] - Le tri par base" type="python">
<Enonce>
### Le tri par base

Le tri par base range des entiers positifs ou nuls à l'aide de dix files, numérotées de `0` à `9` :

1. chaque nombre de la liste, dans l'ordre, est enfilé dans la file qui porte le numéro de son chiffre des unités ;
2. les files `0`, `1`, …, `9` sont ensuite vidées dans cet ordre, ce qui reforme la liste ;
3. les deux étapes recommencent avec le chiffre des dizaines, puis celui des centaines, et ainsi de suite, autant de fois que le plus grand nombre a de chiffres.

Écrire la fonction `tri_base(nombres)`, qui renvoie une nouvelle liste contenant les éléments de `nombres` dans l'ordre croissant. La liste `nombres` n'est pas modifiée.

```python
print(tri_base([170, 45, 75, 90, 802, 24, 2, 66]))
# [2, 24, 45, 66, 75, 90, 170, 802]
```

Contrainte : sans `sort`, `sorted` ni `str`.

<Indices>
<Indice>

Le chiffre de rang `r` d'un nombre `x` (le rang `0` pour les unités, `1` pour les dizaines…) vaut `(x // 10 ** r) % 10`. Le nombre de passages se calcule en divisant le plus grand élément par 10 jusqu'à obtenir 0.

</Indice>
<Indice>

Une file garde l'ordre d'arrivée : deux nombres qui ont le même chiffre au rang étudié restent dans l'ordre obtenu au passage précédent. C'est pour cela que le tri est correct à la fin. Les dix files se rangent dans une liste : `files = [File() for _ in range(10)]`.

</Indice>
<Indice>

```text
FONCTION tri_base(nombres)
    liste ← copie de nombres
    SI liste est vide ALORS RENVOYER liste
    passages ← 0 ; m ← maximum de liste
    RÉPÉTER
        passages ← passages + 1 ; m ← m // 10
    JUSQU'À m = 0
    POUR r ALLANT DE 0 À passages - 1
        files ← liste de 10 nouvelles Files
        POUR CHAQUE x DE liste
            enfiler x dans files[(x // 10^r) mod 10]
        liste ← liste vide
        POUR CHAQUE file DE files, dans l'ordre
            TANT QUE file n'est pas vide
                ajouter defiler(file) à liste
    RENVOYER liste
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def tri_base(nombres):
    liste = list(nombres)
    if len(liste) == 0:
        return liste
    passages = 0
    m = max(liste)
    while True:
        passages = passages + 1
        m = m // 10
        if m == 0:
            break
    for r in range(passages):
        files = [File() for _ in range(10)]
        for x in liste:
            files[(x // 10 ** r) % 10].enfiler(x)
        liste = []
        for file in files:
            while not file.est_vide():
                liste.append(file.defiler())
    return liste
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def tri_base(nombres):
    ...
```

</CodeDepart>
<Verification>

```python
import re
corps = PROGRAMME.split("def tri_base", 1)[-1].split("\nclass ", 1)[0].split("\ndef ", 1)[0]
assert tri_base([170, 45, 75, 90, 802, 24, 2, 66]) == [2, 24, 45, 66, 75, 90, 170, 802], "L'exemple de l'énoncé."
assert tri_base([3, 1, 2]) == [1, 2, 3] and tri_base([5]) == [5] and tri_base([]) == [], "Petites listes."
assert tri_base([0, 0, 10, 0]) == [0, 0, 0, 10], "Des zéros et un nombre à deux chiffres."
assert tri_base([1000, 1, 100, 10]) == [1, 10, 100, 1000], "Des nombres de longueurs très différentes."
assert tri_base([42, 7, 42, 7]) == [7, 7, 42, 42], "Les doublons sont gardés."
depart = [9, 8, 7]
tri_base(depart)
assert depart == [9, 8, 7], "La liste de départ n'est pas modifiée."
assert "File()" in corps and ".elements" not in corps, "Passer par dix files et leurs méthodes."
assert not re.search(r"\bsort|\bstr\(", corps), "Sans sort, sorted ni str."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-6-1" label="6.1 [Mini-projet] - Une calculatrice" type="python">
<Enonce>
### Une calculatrice

**Contexte.** Une calculatrice de bureau reçoit une expression tapée au clavier, par exemple `12*(3+4)-5`. Elle doit vérifier les parenthèses, respecter les priorités des opérations et afficher le résultat ou un message d'erreur. Le projet enchaîne les techniques de la fiche : une pile pour les parenthèses, l'algorithme de la gare de triage, puis l'évaluation d'une expression en NPI.

**Les données** : l'expression est une chaîne qui contient des entiers positifs, les opérateurs `+ - * /`, des parenthèses et éventuellement des espaces. Le symbole `/` désigne la division entière, comme `//` en Python. Un **jeton** est un entier (de type `int`) ou l'un des caractères `"+"`, `"-"`, `"*"`, `"/"`, `"("`, `")"`.

**Les fonctions du programme**
- `decouper(expression)` : transforme le texte en jetons. Reçoit l'expression. Renvoie la liste des jetons, sans les espaces. Exemple : `decouper("12*(3+4)")` vaut `[12, "*", "(", 3, "+", 4, ")"]`.
- `parentheses_ok(jetons)` : vérifie, avec une pile, que les parenthèses sont bien placées. Renvoie un booléen.
- `priorite(operateur)` : renvoie 1 pour `+` et `-`, 2 pour `*` et `/`.
- `vers_postfixe(jetons)` : applique l'algorithme de la gare de triage. Renvoie la liste des jetons en NPI. Exemple : pour les jetons de `3+4*2`, elle renvoie `[3, 4, 2, "*", "+"]`.
- `appliquer(operateur, a, b)` : renvoie le résultat de `a operateur b`. Une division par zéro lève `ZeroDivisionError`.
- `evaluer_postfixe(postfixe)` : calcule, avec une pile, la valeur d'une liste de jetons en NPI.
- `calculer(expression)` : la fonction appelée par la calculatrice. Renvoie la valeur de l'expression, ou le texte `"erreur de parenthèses"`, ou le texte `"division par zéro"`.
- `historique(expressions)` : le ruban de la calculatrice. Reçoit une liste d'expressions. Renvoie la liste des lignes `"expression = résultat"`, par exemple `"7/2 = 3"`.

Contrainte : sans `eval`.

<Indices>
<Indice>

Dans `decouper`, accumuler les chiffres d'un nombre dans une chaîne, et ne l'ajouter aux jetons, converti en `int`, qu'au premier caractère qui n'est pas un chiffre (ou à la fin du texte).

</Indice>
<Indice>

`vers_postfixe` et `evaluer_postfixe` reprennent les exercices « De l'écriture usuelle à la NPI » et « Notation polonaise inverse ». La seule différence est que les jetons sont déjà découpés : un nombre se reconnaît avec `isinstance(jeton, int)`.

</Indice>
<Indice>

Dans `calculer`, tester d'abord les parenthèses. La division par zéro se rattrape avec `try` et `except ZeroDivisionError`.

</Indice>
<Indice>

```text
(cœur du programme : l'enchaînement des étapes)
FONCTION calculer(expression)
    jetons ← decouper(expression)
    SI NON parentheses_ok(jetons) ALORS RENVOYER "erreur de parenthèses"
    ESSAYER
        RENVOYER evaluer_postfixe(vers_postfixe(jetons))
    EN CAS DE division par zéro
        RENVOYER "division par zéro"
```

</Indice>
</Indices>

<Correction>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)


def decouper(expression):
    jetons = []
    nombre = ""
    for c in expression:
        if c.isdigit():
            nombre = nombre + c
        else:
            if nombre != "":
                jetons.append(int(nombre))
                nombre = ""
            if c in "+-*/()":
                jetons.append(c)
    if nombre != "":
        jetons.append(int(nombre))
    return jetons


def parentheses_ok(jetons):
    p = Pile()
    for j in jetons:
        if j == "(":
            p.empiler(j)
        elif j == ")":
            if p.est_vide():
                return False
            p.depiler()
    return p.est_vide()


def priorite(operateur):
    if operateur in "+-":
        return 1
    return 2


def vers_postfixe(jetons):
    sortie = []
    p = Pile()
    for j in jetons:
        if isinstance(j, int):
            sortie.append(j)
        elif j == "(":
            p.empiler(j)
        elif j == ")":
            while p.sommet() != "(":
                sortie.append(p.depiler())
            p.depiler()
        else:
            while not p.est_vide() and p.sommet() != "(" and priorite(p.sommet()) >= priorite(j):
                sortie.append(p.depiler())
            p.empiler(j)
    while not p.est_vide():
        sortie.append(p.depiler())
    return sortie


def appliquer(operateur, a, b):
    if operateur == "+":
        return a + b
    if operateur == "-":
        return a - b
    if operateur == "*":
        return a * b
    return a // b


def evaluer_postfixe(postfixe):
    p = Pile()
    for j in postfixe:
        if isinstance(j, int):
            p.empiler(j)
        else:
            b = p.depiler()
            a = p.depiler()
            p.empiler(appliquer(j, a, b))
    return p.depiler()


def calculer(expression):
    jetons = decouper(expression)
    if not parentheses_ok(jetons):
        return "erreur de parenthèses"
    try:
        return evaluer_postfixe(vers_postfixe(jetons))
    except ZeroDivisionError:
        return "division par zéro"


def historique(expressions):
    return [e + " = " + str(calculer(e)) for e in expressions]
```

</Correction>
</Enonce>
<CodeDepart>

```python
class Pile:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def empiler(self, x):
        self.elements.append(x)

    def depiler(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements.pop()

    def sommet(self):
        if self.est_vide():
            raise IndexError("pile vide")
        return self.elements[-1]

    def taille(self):
        return len(self.elements)
```

</CodeDepart>
<Verification>

```python
import re
assert decouper("12*(3+4)") == [12, "*", "(", 3, "+", 4, ")"], "Découpage de 12*(3+4)."
assert decouper(" 7 - 25 ") == [7, "-", 25] and decouper("") == [], "Les espaces sont ignorés."
assert parentheses_ok(decouper("(1+(2*3))")) is True and parentheses_ok(decouper("(1+2))(")) is False, "Vérification des parenthèses."
assert priorite("+") == 1 and priorite("-") == 1 and priorite("*") == 2 and priorite("/") == 2, "Priorités."
assert vers_postfixe(decouper("3+4*2")) == [3, 4, 2, "*", "+"] and vers_postfixe(decouper("(3+4)*2")) == [3, 4, "+", 2, "*"], "Gare de triage."
assert vers_postfixe(decouper("8-3-2")) == [8, 3, "-", 2, "-"], "À priorité égale, de gauche à droite."
assert appliquer("/", 7, 2) == 3 and appliquer("-", 2, 9) == -7, "Division entière, soustraction."
assert evaluer_postfixe([3, 4, "+", 2, "*"]) == 14, "Évaluation en NPI."
assert calculer("12*(3+4)-5") == 79 and calculer("2*(3+4)-10/(1+4)") == 12, "Calculs complets."
assert calculer("100/(5-5)") == "division par zéro" and calculer("(1+2") == "erreur de parenthèses", "Messages d'erreur."
assert historique(["1+1", "7/0", "7/2"]) == ["1+1 = 2", "7/0 = division par zéro", "7/2 = 3"], "Le ruban de la calculatrice."
assert "Pile()" in PROGRAMME and not re.search(r"\beval\s*\(", PROGRAMME), "Avec des piles, sans eval."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="tnsi-pf-6-2" label="6.2 [Mini-projet] - Combien de guichets ouvrir ?" type="python">
<Enonce>
### Combien de guichets ouvrir ?

**Contexte.** Le secrétariat d'un lycée reçoit les élèves à un ou plusieurs guichets. Avant la rentrée, la direction veut savoir combien de guichets ouvrir pour que personne n'attende trop longtemps. Le programme simule la journée à partir de la liste des arrivées, puis calcule des statistiques sur l'attente.

**Les données** : une arrivée est un triplet `(nom, heure, duree)`, où `heure` est l'heure d'arrivée en minutes depuis l'ouverture et `duree` le temps nécessaire pour traiter la demande. La liste des arrivées est rangée par heure croissante. Les guichets sont numérotés à partir de 1. Les élèves sont servis dans leur ordre d'arrivée : chacun va au guichet qui se libère le plus tôt (le plus petit numéro en cas d'égalité), et commence dès qu'il est arrivé et que ce guichet est libre.

Exemple : `A = [("Ada", 0, 5), ("Alan", 1, 3), ("Grace", 2, 4), ("Linus", 2, 2), ("Margaret", 8, 1), ("Tim", 9, 6)]`.

**Les fonctions du programme**
- `file_des_arrivees(arrivees)` : la file d'attente de la journée. Renvoie une `File` contenant les arrivées, dans l'ordre.
- `servir(arrivees, nb_guichets)` : la simulation. Défile les élèves un par un depuis la file des arrivées. Renvoie la liste des quadruplets `(nom, guichet, debut, fin)`, dans l'ordre de passage. Avec 2 guichets, Grace passe au guichet 2 de la minute 4 à la minute 8.
- `attentes(arrivees, nb_guichets)` : renvoie un dictionnaire qui associe à chaque nom son temps d'attente, `debut - heure`.
- `attente_moyenne(arrivees, nb_guichets)` : la moyenne des attentes, arrondie au dixième (0 s'il n'y a personne).
- `attente_max(arrivees, nb_guichets)` : la plus longue attente (0 s'il n'y a personne).
- `fin_de_service(arrivees, nb_guichets)` : l'heure à laquelle le dernier élève repart (0 s'il n'y a personne).
- `longueur_max(arrivees, nb_guichets)` : la plus longue file observée. À l'heure `t` de chaque arrivée, on compte les élèves arrivés (à l'heure `t` ou avant) dont le service n'a pas encore commencé (début strictement après `t`). La fonction renvoie le plus grand de ces nombres.
- `guichets_necessaires(arrivees, limite)` : la réponse à la direction. Renvoie le plus petit nombre de guichets, au moins 1, pour lequel aucune attente ne dépasse `limite` minutes.

<Indices>
<Indice>

Dans `servir`, une liste `libre` donne, pour chaque guichet, l'heure à laquelle il se libère. Au départ, tous les guichets sont libres à l'heure 0.

</Indice>
<Indice>

Les autres fonctions n'ont pas à refaire la simulation à la main : elles appellent `servir` et parcourent son résultat, en le mettant en regard de la liste des arrivées.

</Indice>
<Indice>

`guichets_necessaires` essaie 1 guichet, puis 2, puis 3… Avec autant de guichets que d'élèves, personne n'attend : la boucle s'arrête toujours.

</Indice>
<Indice>

```text
(cœur du programme : la simulation)
FONCTION servir(arrivees, nb_guichets)
    f ← file_des_arrivees(arrivees) ; libre ← liste de nb_guichets zéros
    passages ← liste vide
    TANT QUE f n'est pas vide
        (nom, heure, duree) ← defiler(f)
        g ← indice du plus petit élément de libre (le premier en cas d'égalité)
        debut ← maximum(heure, libre[g]) ; fin ← debut + duree ; libre[g] ← fin
        ajouter (nom, g + 1, debut, fin) à passages
    RENVOYER passages
```

</Indice>
</Indices>

<Correction>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


def file_des_arrivees(arrivees):
    f = File()
    for arrivee in arrivees:
        f.enfiler(arrivee)
    return f


def servir(arrivees, nb_guichets):
    f = file_des_arrivees(arrivees)
    libre = [0] * nb_guichets
    passages = []
    while not f.est_vide():
        nom, heure, duree = f.defiler()
        g = 0
        for i in range(nb_guichets):
            if libre[i] < libre[g]:
                g = i
        debut = max(heure, libre[g])
        fin = debut + duree
        libre[g] = fin
        passages.append((nom, g + 1, debut, fin))
    return passages


def attentes(arrivees, nb_guichets):
    resultat = {}
    passages = servir(arrivees, nb_guichets)
    for i in range(len(arrivees)):
        nom, heure, duree = arrivees[i]
        resultat[nom] = passages[i][2] - heure
    return resultat


def attente_moyenne(arrivees, nb_guichets):
    temps = list(attentes(arrivees, nb_guichets).values())
    if len(temps) == 0:
        return 0
    return round(sum(temps) / len(temps), 1)


def attente_max(arrivees, nb_guichets):
    temps = list(attentes(arrivees, nb_guichets).values())
    if len(temps) == 0:
        return 0
    return max(temps)


def fin_de_service(arrivees, nb_guichets):
    fin = 0
    for nom, guichet, debut, sortie in servir(arrivees, nb_guichets):
        fin = max(fin, sortie)
    return fin


def longueur_max(arrivees, nb_guichets):
    passages = servir(arrivees, nb_guichets)
    plus_longue = 0
    for nom, t, duree in arrivees:
        n = 0
        for i in range(len(arrivees)):
            if arrivees[i][1] <= t < passages[i][2]:
                n = n + 1
        plus_longue = max(plus_longue, n)
    return plus_longue


def guichets_necessaires(arrivees, limite):
    nb = 1
    while attente_max(arrivees, nb) > limite:
        nb = nb + 1
    return nb
```

</Correction>
</Enonce>
<CodeDepart>

```python
class File:
    def __init__(self):
        self.elements = []

    def est_vide(self):
        return len(self.elements) == 0

    def enfiler(self, x):
        self.elements.append(x)

    def defiler(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements.pop(0)

    def premier(self):
        if self.est_vide():
            raise IndexError("file vide")
        return self.elements[0]

    def taille(self):
        return len(self.elements)


A = [("Ada", 0, 5), ("Alan", 1, 3), ("Grace", 2, 4), ("Linus", 2, 2), ("Margaret", 8, 1), ("Tim", 9, 6)]
```

</CodeDepart>
<Verification>

```python
A = [("Ada", 0, 5), ("Alan", 1, 3), ("Grace", 2, 4), ("Linus", 2, 2), ("Margaret", 8, 1), ("Tim", 9, 6)]
f = file_des_arrivees(A)
assert isinstance(f, File) and f.defiler() == ("Ada", 0, 5) and f.taille() == 5, "La file des arrivées, dans l'ordre."
assert servir(A, 1) == [("Ada", 1, 0, 5), ("Alan", 1, 5, 8), ("Grace", 1, 8, 12), ("Linus", 1, 12, 14), ("Margaret", 1, 14, 15), ("Tim", 1, 15, 21)], "Un seul guichet."
assert servir(A, 2) == [("Ada", 1, 0, 5), ("Alan", 2, 1, 4), ("Grace", 2, 4, 8), ("Linus", 1, 5, 7), ("Margaret", 1, 8, 9), ("Tim", 2, 9, 15)], "Deux guichets."
assert attentes(A, 2) == {"Ada": 0, "Alan": 0, "Grace": 2, "Linus": 3, "Margaret": 0, "Tim": 0}, "Attentes avec deux guichets."
assert attente_moyenne(A, 1) == 5.3 and attente_moyenne(A, 2) == 0.8 and attente_moyenne([], 2) == 0, "Attente moyenne."
assert attente_max(A, 1) == 10 and attente_max(A, 3) == 2, "Attente maximale."
assert fin_de_service(A, 1) == 21 and fin_de_service(A, 2) == 15 and fin_de_service([], 1) == 0, "Fin du service."
assert longueur_max(A, 1) == 3 and longueur_max(A, 2) == 2 and longueur_max(A, 3) == 1, "Plus longue file."
assert guichets_necessaires(A, 10) == 1 and guichets_necessaires(A, 3) == 2 and guichets_necessaires(A, 2) == 3 and guichets_necessaires(A, 0) == 4, "Nombre de guichets à ouvrir."
assert "File()" in PROGRAMME and ".defiler()" in PROGRAMME, "Les élèves passent par une file."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
