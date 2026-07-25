---
title: Introduction POO
description: >-
  Classes, objets, attributs et méthodes : premiers pas en programmation orientée objet.
level: premiere
chapter: Programmation Orientée Objet
icon: "\U0001F4E6"
badgeId: premiere_introduction_poo
prerequisites: []
---

## Objectifs

- Définir une **classe** et créer une **instance** (objet).
- Distinguer **attributs** (données) et **méthodes** (actions).
- Expliquer le rôle de `__init__` et de `self`.
- Accéder à un attribut et appeler une méthode sur un objet.

## Idée clé

En POO, on regroupe dans un même **objet** ce qu'il **est** (attributs) et ce qu'il **sait faire** (méthodes). La **classe** est le moule ; l'**instanciation** produit un objet concret à partir de ce moule. Ici, le mot « attribut » est à sa place — contrairement aux clés d'un dictionnaire.

## Objet et classe

Un **objet** combine :

- des **attributs** : variables propres à l'objet ;
- des **méthodes** : fonctions liées à l'objet.

Une **classe** décrit la structure commune de tous les objets du même type.

```python
class Compte:
    def __init__(self, titulaire: str, solde: float = 0.0):
        self.titulaire = titulaire
        self.solde = solde

    def deposer(self, montant: float) -> None:
        self.solde = self.solde + montant

    def __str__(self) -> str:
        return f"Compte de {self.titulaire} : {self.solde} €"
```

| Terme | Sens |
| --- | --- |
| `class Compte` | définit le moule (nom en `CamelCase`) |
| `__init__` | **constructeur**, appelé à la création |
| `self` | l'instance courante, dans les méthodes |
| `self.solde` | attribut de l'instance |

## Instanciation et utilisation

Créer un objet = **instancier** la classe (appeler le nom de la classe comme une fonction).

```python
c1 = Compte("Alice", 100)
c2 = Compte("Bob")          # solde par défaut = 0.0

print(c1.titulaire)         # Alice
c1.deposer(50)
print(c1.solde)             # 150.0
print(c1)                   # via __str__
```

Chaque instance a sa **propre** copie des attributs : modifier `c1` ne change pas `c2`.

!!! tip "Dictionnaire vs objet"
    Un dictionnaire `{"titulaire": "Alice", "solde": 100}` stocke des données sous des **clés**.  
    Un objet `Compte` ajoute des **méthodes** (`deposer`) et un typage clair via la classe.

## Pourquoi la POO ?

| Intérêt | En pratique |
| --- | --- |
| Organisation | données + comportements au même endroit |
| Réutilisation | une classe → beaucoup d'instances |
| Modularité | on peut faire évoluer une classe sans tout casser |
| Abstraction | `c1.deposer(50)` cache les détails internes |

## Piège fréquent

- Oublier `self` comme premier paramètre d'une méthode → erreur à l'appel.
- Confondre la classe `Compte` et l'instance `c1` : les méthodes s'appellent sur l'**objet**.

## À retenir

- Classe = moule ; objet = instance créée par instanciation.
- Attributs = données ; méthodes = actions (`self` obligatoire).
- `__init__` initialise les attributs à la création.
- Accès : `objet.attribut` ; appel : `objet.methode(...)`.
- Chaque instance a ses propres valeurs d'attributs.
- « Attribut » = POO ; « clé » = dictionnaire ; « affectation » = `x = ...`.

## Pour s'entraîner

- [Exercices POO](/cours/2/poo_exercices)
- Projet : [Pokénsi](/cours/2/poo_projet_pokensi)
