---
title: Introduction POO
description: >-
  Classes, objets, attributs et méthodes : premiers pas en programmation orientée objet.
level: premiere
chapter: Programmation Orientée Objet
icon: "package"
badgeId: premiere_introduction_poo
prerequisites: []
audience: public
groupe: poo
groupeTitre: "Programmation orientée objet"
---

# Introduction à la programmation orientée objet

Jusqu'ici, les données et les fonctions étaient séparées : on passait une donnée à une fonction quand on en avait besoin. La programmation orientée objet procède autrement, en regroupant ce qu'une chose *est* et ce qu'elle *sait faire*. Ce cours montre comment écrire ce regroupement, et pourquoi il ne faut pas le confondre avec un dictionnaire.

En POO, un **objet** réunit des **attributs**, qui sont ses données, et des **méthodes**, qui sont ses actions. La **classe** sert de moule, et l'**instanciation** produit un objet concret à partir de ce moule. Le mot « attribut » a ici un sens précis : il ne désigne ni une clé de dictionnaire, ni une simple variable du programme.

## Classe et objet

Une classe décrit la structure commune de tous les objets du même type. Une classe `Compte` n'est donc pas un compte bancaire : elle décrit de quoi un compte est fait. L'objet, lui, est un compte particulier, avec un titulaire et un solde.

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

`class Compte` commence la définition de la classe. Par convention, le nom prend une majuscule à chaque mot, le *CamelCase*. `__init__` est le **constructeur** : Python l'appelle au moment où l'objet est créé, pour initialiser ses attributs. `self` désigne l'instance en cours. Dans le corps des méthodes, c'est grâce à lui qu'on accède à `self.solde`, et non à une variable locale qui disparaîtrait à la fin de la fonction.

## Créer et utiliser des objets

Pour instancier une classe, on appelle son nom comme une fonction. Les arguments sont transmis à `__init__`, sauf `self`, que Python fournit automatiquement.

```python
c1 = Compte("Alice", 100)
c2 = Compte("Bob")          # solde par défaut = 0.0

print(c1.titulaire)         # Alice
c1.deposer(50)
print(c1.solde)             # 150.0
print(c1)                   # via __str__
```

`c1` et `c2` sont deux objets. Modifier le solde d'Alice ne change pas celui de Bob, car chaque instance a sa propre copie des attributs. On lit un attribut avec `objet.attribut` et on appelle une méthode avec `objet.methode(...)`. Enfin, `print(c1)` affiche une phrase lisible, et non une adresse mémoire, parce que la méthode `__str__` indique à Python quel texte produire.

!!! tip "Dictionnaire vs objet"
    Un dictionnaire `{"titulaire": "Alice", "solde": 100}` stocke des données sous des **clés**.  
    Un objet `Compte` ajoute des **méthodes** (`deposer`) et un typage clair via la classe.

Un dictionnaire permet seulement de retrouver la valeur associée à une clé, alors qu'un objet indique en plus ce qu'il sait faire. Dans une version plus complète, la méthode `deposer` vérifierait par exemple que le montant est valide avant de mettre à jour le solde. Le programme qui l'appelle n'a pas besoin de savoir comment ce calcul est fait.

## L'intérêt de la programmation orientée objet

Les données et les comportements sont rangés au même endroit, ce qui permet de savoir où modifier le solde : dans la classe, et non dans dix fonctions éparpillées. Une seule classe permet aussi de créer autant d'instances que nécessaire, sans recopier le code. Enfin, on peut faire évoluer `deposer` sans réécrire le reste du programme, tant que l'appel `c1.deposer(50)` garde le même sens. C'est le principe de l'**abstraction** : le reste du code ne voit pas l'addition, mais seulement un dépôt.

## Deux erreurs fréquentes

Oublier `self` en premier paramètre d'une méthode provoque une erreur à l'appel, parce que Python transmet quand même l'instance, qui se retrouve alors dans le mauvais paramètre. L'autre erreur consiste à confondre la classe et l'objet : `Compte.deposer(50)` n'a aucun compte sur lequel travailler. Il faut écrire `c1.deposer(50)`, car la méthode s'appelle sur une instance.

Pour résumer le vocabulaire, la classe est le moule et l'objet est une instance de cette classe. Les attributs sont ses données et les méthodes ses actions, et `__init__` initialise les attributs. Le mot « attribut » appartient à la POO, le mot « clé » aux dictionnaires, et le mot « affectation » désigne une instruction comme `x = ...`.

## Pour s'entraîner

- [Exercices POO](/cours/2/poo_exercices)
- Projet : [Pokénsi](/cours/2/poo_projet_pokensi)
