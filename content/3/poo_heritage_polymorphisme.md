---
title: 'POO : Héritage et polymorphisme'
description: Réutiliser et spécialiser des classes avec héritage, surcharge et redéfinition.
level: TNSI
order: 145
chapter: Langages et Programmation
icon: "🧬"
badgeId: terminale_poo_heritage
prerequisites:
  - poo_classes_objets
audience: public
---

# Héritage et polymorphisme

Une classe décrit un moule. Quand plusieurs moules partagent les mêmes attributs et presque les mêmes méthodes, on n'écrit pas trois fois `__init__`. L'**héritage** crée une classe fille à partir d'une classe mère. La fille **réutilise** ce qui est commun, et **spécialise** ce qui change. On ne le fait que pour une relation « est un » : un chien est un animal. Un moteur n'est pas une voiture. Il en fait partie. Dans ce second cas, on compose : la voiture a un attribut `moteur`, elle n'hérite pas de `Moteur`.

## La fille reprend, puis elle redéfinit

`class Chien(Animal)` dit que `Chien` hérite de `Animal`. Un chien a donc un `nom`, parce que le constructeur de la mère en pose un, et il a une méthode `parler`. Ici, la fille **redéfinit** `parler` : même nom, même rôle, autre corps. À l'appel, c'est la méthode de la classe réelle de l'objet qui s'exécute, pas celle écrite sur la ligne de la mère.

```python
class Animal:
    def __init__(self, nom: str):
        self.nom = nom

    def parler(self) -> str:
        return "..."

class Chien(Animal):
    def parler(self) -> str:
        return "Wouf !"

class Chat(Animal):
    def parler(self) -> str:
        return "Miaou !"

animaux = [Chien("Rex"), Chat("Minou")]
for a in animaux:
    print(a.nom, "dit", a.parler())
```

`a.nom` fonctionne pour les deux, parce que l'attribut vient de `Animal`. `a.parler()` affiche `Wouf !` pour Rex et `Miaou !` pour Minou. La boucle ne teste pas le type. Elle appelle le nom de la méthode, et chaque objet répond selon sa classe. C'est le **polymorphisme** : une même interface, ici `parler`, avec des implémentations différentes.

La **surcharge** est un autre mécanisme, à ne pas confondre avec la redéfinition. Surcharger, dans des langages comme C#, c'est ajouter une méthode de même nom avec une autre liste de paramètres, et laisser le compilateur choisir. En Python, un second `def` du même nom dans la même classe **écrase** le premier. On ne s'appuie pas sur la surcharge. On redéfinit dans la fille, ou l'on donne des valeurs par défaut aux paramètres.

## Appeler le constructeur de la mère

Quand la fille ajoute des attributs, elle doit quand même faire le travail de la mère. `super().__init__(...)` appelle le constructeur parent. Oublier cet appel, c'est avoir un rectangle sans couleur, alors que `Forme` était censée la ranger.

```python
class Forme:
    def __init__(self, couleur: str):
        self.couleur = couleur

class Rectangle(Forme):
    def __init__(self, couleur: str, largeur: float, hauteur: float):
        super().__init__(couleur)
        self.largeur = largeur
        self.hauteur = hauteur

    def aire(self) -> float:
        return self.largeur * self.hauteur
```

`Rectangle` est une `Forme`. Il a une couleur, plus une largeur et une hauteur que la mère ne connaît pas. `aire` n'existe que chez lui.

```python
def afficher_surface(forme) -> None:
    print(f"Aire = {forme.aire():.2f}")

afficher_surface(Rectangle("bleu", 4, 5))
```

`afficher_surface` ne mentionne pas `Rectangle`. Elle demande `aire`. Tout objet qui possède cette méthode peut passer, un disque comme un rectangle. C'est encore le polymorphisme : la fonction dépend de l'interface, pas de la classe concrète.

On documente, sur la mère, les méthodes que les filles sont censées redéfinir. `parler` chez `Animal` renvoie `"..."` justement pour marquer l'emplacement. On évite les héritages trop longs, animal puis mammifère puis canidé puis chien puis labrador, quand trois niveaux ne servent aucun code commun. Chaque niveau doit éviter une vraie duplication. Sinon, la composition ou une simple fonction suffisent.

!!! tip "Lien avec le programme"
    En Terminale, l'héritage sert à factoriser des structures de données ou des modèles métier (jeu, simulation, API).
