---
title: Introduction POO
description: >-
  Classes, objets, attributs et méthodes : premiers pas en programmation orientée objet.
level: premiere
chapter: Programmation Orientée Objet
icon: "\U0001F4E6"
badgeId: premiere_introduction_poo
prerequisites: []
audience: public
---

# Introduction à la programmation orientée objet

Jusqu'ici, une donnée d'un côté et une fonction de l'autre vivaient séparées. On passait la donnée à la fonction quand on en avait besoin. En programmation orientée objet, on change de geste : ce qu'une chose *est* et ce qu'elle *sait faire* voyagent ensemble. Aujourd'hui, on apprend à écrire ce regroupement, et à ne pas le confondre avec un dictionnaire.

En POO, un **objet** réunit des **attributs**, ses données, et des **méthodes**, ses actions. La **classe** est le moule. L'**instanciation** produit un objet concret à partir de ce moule. Le mot « attribut » a ici son sens propre. Ce n'est pas une clé de dictionnaire, et ce n'est pas non plus une simple variable posée au milieu du programme.

## La classe décrit, l'objet existe

Une classe décrit la structure commune de tous les objets du même type. Elle ne *est* pas un compte bancaire : elle dit de quoi un compte est fait. L'objet, lui, est un compte particulier, avec un titulaire et un solde.

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

`class Compte` ouvre le moule. Par convention, le nom prend une majuscule à chaque mot, le *CamelCase*. `__init__` est le **constructeur** : Python l'appelle au moment où l'objet naît, pour remplir ses attributs. `self` désigne l'instance en cours. Dans le corps des méthodes, c'est par lui qu'on atteint `self.solde` plutôt qu'une variable locale qui disparaîtrait à la fin de la fonction.

## Créer, puis s'en servir

Instancier, c'est appeler le nom de la classe comme une fonction. Les arguments vont à `__init__`, sauf `self`, que Python passe tout seul.

```python
c1 = Compte("Alice", 100)
c2 = Compte("Bob")          # solde par défaut = 0.0

print(c1.titulaire)         # Alice
c1.deposer(50)
print(c1.solde)             # 150.0
print(c1)                   # via __str__
```

`c1` et `c2` sont deux objets. Modifier le solde d'Alice ne touche pas celui de Bob : chaque instance a sa propre copie des attributs. On lit un attribut avec `objet.attribut`, on appelle une méthode avec `objet.methode(...)`. `print(c1)` n'affiche pas une adresse mémoire illisible parce que `__str__` a dit à Python quelle phrase produire.

!!! tip "Dictionnaire vs objet"
    Un dictionnaire `{"titulaire": "Alice", "solde": 100}` stocke des données sous des **clés**.  
    Un objet `Compte` ajoute des **méthodes** (`deposer`) et un typage clair via la classe.

Le dictionnaire répond à « quelle est la valeur associée à cette clé ? ». L'objet répond aussi à « que sait faire ce compte ? ». `deposer` vérifie, dans une version plus complète, que le montant a un sens, et met à jour le solde. L'appelant n'a pas à connaître la ligne qui fait l'addition.

## Pourquoi se donner cette peine

On range les données et les comportements au même endroit, donc on sait où modifier le solde : dans la classe, pas dans dix fonctions éparpillées. Une seule classe donne autant d'instances qu'on veut, sans recopier le code. On peut faire évoluer `deposer` sans réécrire le reste du programme, tant que l'appel `c1.deposer(50)` garde le même sens. C'est cela, l'abstraction : le reste du code ne voit pas l'addition, il voit un dépôt.

## Deux erreurs qui reviennent

Oublier `self` en premier paramètre d'une méthode provoque une erreur à l'appel, parce que Python passe quand même l'instance, et elle atterrit dans le mauvais paramètre. L'autre confusion est de prendre la classe pour l'objet. `Compte.deposer(50)` n'a pas de compte sur lequel travailler. C'est `c1.deposer(50)` : la méthode s'appelle sur l'instance.

Pour fermer le vocabulaire : la classe est le moule, l'objet est l'instance, les attributs sont les données, les méthodes sont les actions. `__init__` les initialise. « Attribut » appartient à la POO, « clé » au dictionnaire, « affectation » à une ligne comme `x = ...`.

## Pour s'entraîner

- [Exercices POO](/cours/2/poo_exercices)
- Projet : [Pokénsi](/cours/2/poo_projet_pokensi)
