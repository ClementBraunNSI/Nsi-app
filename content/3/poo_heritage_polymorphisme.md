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
---

# Héritage et polymorphisme

L'**héritage** permet de créer une classe fille à partir d'une classe mère pour **réutiliser** du code et **spécialiser** un comportement.

## 1. Héritage simple

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

## 2. `super()` et le constructeur parent

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

## 3. Polymorphisme

Le **polymorphisme** : plusieurs classes partagent la même interface (même nom de méthode) avec des implémentations différentes.

```python
def afficher_surface(forme) -> None:
    print(f"Aire = {forme.aire():.2f}")

afficher_surface(Rectangle("bleu", 4, 5))
```

## 4. Quand utiliser l'héritage ?

- Relation **« est un »** : un `Chien` **est un** `Animal`.
- Éviter les hiérarchies trop profondes (préférer la composition si besoin).
- Documenter les méthodes que les sous-classes doivent redéfinir.

!!! tip "Lien avec le programme"
    En Terminale, l'héritage sert à factoriser des structures de données ou des modèles métier (jeu, simulation, API).
