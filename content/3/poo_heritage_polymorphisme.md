---
title: 'POO : Héritage et polymorphisme'
description: Réutiliser et spécialiser des classes avec héritage, surcharge et redéfinition.
level: TNSI
order: 145
chapter: Langages et Programmation
icon: "dna"
badgeId: terminale_poo_heritage
prerequisites:
  - poo_classes_objets
audience: public
---

# Héritage et polymorphisme

Une classe sert de moule pour créer des objets. Quand plusieurs classes partagent les mêmes attributs et presque les mêmes méthodes, il est inutile d'écrire trois fois `__init__`. L'**héritage** permet de créer une classe fille à partir d'une classe mère : la fille **réutilise** ce qui est commun et **spécialise** ce qui change. On ne l'utilise que pour une relation « est un » : un chien est un animal. En revanche, un moteur n'est pas une voiture, il en fait partie. Dans ce second cas, on utilise la composition : la voiture a un attribut `moteur`, mais elle n'hérite pas de `Moteur`.

## Hériter et redéfinir une méthode

`class Chien(Animal)` indique que `Chien` hérite de `Animal`. Un chien a donc un `nom`, créé par le constructeur de la mère, et une méthode `parler`. Ici, la fille **redéfinit** `parler` : la méthode garde le même nom et le même rôle, mais son corps change. À l'appel, c'est la méthode de la classe réelle de l'objet qui s'exécute, et non celle de la classe mère.

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

`a.nom` fonctionne pour les deux, parce que l'attribut vient de `Animal`. `a.parler()` affiche `Wouf !` pour Rex et `Miaou !` pour Minou. La boucle ne teste pas le type des objets : elle appelle la méthode, et chaque objet répond selon sa classe. C'est le **polymorphisme** : une même interface, ici `parler`, a des implémentations différentes.

La **surcharge** est un autre mécanisme, à ne pas confondre avec la redéfinition. Dans des langages comme C#, surcharger une méthode consiste à ajouter une méthode de même nom avec une autre liste de paramètres, et à laisser le compilateur choisir la bonne. En Python, un second `def` du même nom dans la même classe **écrase** le premier. On ne peut donc pas compter sur la surcharge : on redéfinit la méthode dans la fille, ou on donne des valeurs par défaut aux paramètres.

## Appeler le constructeur de la mère

Quand la fille ajoute des attributs, elle doit quand même faire le travail de la mère. `super().__init__(...)` appelle le constructeur parent. Sans cet appel, le rectangle n'aurait pas de couleur, alors que c'est `Forme` qui doit l'enregistrer.

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

`Rectangle` est une `Forme`. Il a une couleur, ainsi qu'une largeur et une hauteur que la mère ne connaît pas. La méthode `aire` n'existe que dans `Rectangle`.

```python
def afficher_surface(forme) -> None:
    print(f"Aire = {forme.aire():.2f}")

afficher_surface(Rectangle("bleu", 4, 5))
```

`afficher_surface` ne mentionne pas `Rectangle` : elle appelle seulement `aire`. Tout objet qui possède cette méthode peut donc lui être passé, aussi bien un disque qu'un rectangle. C'est encore le polymorphisme : la fonction dépend de l'interface, et non de la classe concrète.

Il faut documenter, dans la classe mère, les méthodes que les filles doivent redéfinir. `parler` chez `Animal` renvoie `"..."` justement pour marquer cet emplacement. Il faut aussi éviter les chaînes d'héritage trop longues (animal, mammifère, canidé, chien, labrador...) quand plusieurs niveaux ne partagent aucun code. Chaque niveau doit éviter une vraie duplication, sinon la composition ou une simple fonction suffisent.

!!! tip "Lien avec le programme"
    En Terminale, l'héritage sert à factoriser des structures de données ou des modèles métier (jeu, simulation, API).
