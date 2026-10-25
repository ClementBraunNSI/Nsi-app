---
title: Types de données en Python
subtitle: Les types fondamentaux pour structurer vos données
description: "Booléens, entiers, flottants et chaînes : reconnaître un type et l'utiliser correctement."
level: premiere
chapter: Introduction à Python
icon: "hash"
badgeId: premiere_types_base
prerequisites:
  - python_constructions_elementaires
audience: public
groupe: types-python
groupeTitre: "Types de données en Python"
---

# Types de données en Python

Vous avez déjà écrit des affectations, des tests et des boucles. Chaque valeur que ces lignes manipulent a un **type**, et le type décide ce que Python accepte d'en faire. Comparer des booléens, calculer avec des nombres, indexer une chaîne : ce ne sont pas les mêmes opérations. La confusion la plus fréquente en début d'année est de prendre `"3"` pour `3`. L'une est un texte, l'autre un entier. Python ne devine pas à votre place.

## Les booléens

Un **booléen** (`bool`) n'a que deux valeurs, `True` et `False`. C'est le type des conditions. Trois opérateurs les combinent. `and` n'est vrai que si les deux côtés le sont. `or` est vrai dès qu'un côté au moins l'est. `not` inverse.

| Opérateur | Signification | Exemple |
| --- | --- | --- |
| `and` | Vrai si **les deux** sont vrais | `True and False` donne `False` |
| `or` | Vrai si **au moins un** est vrai | `True or False` donne `True` |
| `not` | Inverse la valeur | `not True` donne `False` |

```python
age = 16
a_permis = False
peut_conduire = age >= 18 and a_permis  # False
```

`age >= 18` produit déjà un booléen. `and` le combine avec `a_permis`. Ici les deux ne sont pas vrais ensemble, donc `peut_conduire` vaut `False`.

## Les nombres

L'**entier** (`int`) n'a pas de partie décimale : `-2`, `0`, `42`. Le **flottant** (`float`) en a une : `3.14`, `-0.5`. On écrit le séparateur avec un **point**, jamais une virgule. `3,14` n'est pas un nombre en Python.

```python
n = 10
x = 3.5
print(n / 4)   # 2.5  (float)
print(n // 4)  # 2    (int, quotient)
print(n % 4)   # 2    (reste)
```

La division `/` donne toujours un flottant, même quand le résultat tombe juste. `//` donne le quotient entier, `%` le reste. Dix divisé par quatre : on peut faire deux fois quatre, il reste deux. D'où `2` et `2`.

!!! warning "Point décimal"
    On écrit `3.14` avec un **point**, jamais une virgule. Les flottants peuvent produire de petites erreurs d'arrondi (norme IEEE 754) : `0.1 + 0.2` n'est pas exactement `0.3`.

On reviendra sur cette norme dans le cours sur les réels. Pour l'instant, retenez qu'un `float` est une approximation, pas toujours le nombre décimal que vous croyez avoir écrit.

## Les chaînes

Textes et caractères partagent le type **chaîne** (`str`). On lit un caractère par son **indice**, et le premier indice est **0**, pas 1. L'indice `-1` désigne le dernier caractère.

```python
mot = "Python"
print(mot[0])   # 'P'
print(mot[-1])  # 'n'
print(mot + "!")  # 'Python!'
print(len(mot))   # 6
```

`+` entre deux chaînes **concatène** : il colle les textes. `len` compte les caractères.

On convertit quand la conversion a un sens. `int("42")` donne l'entier `42`. `str(42)` donne la chaîne `"42"`. `float("3.5")` donne `3.5`. `int("bonjour")` n'a pas de sens : Python lève une erreur.

## Vérifier un type

`type()` affiche le type d'une valeur. C'est l'outil à sortir quand un calcul refuse de se faire et que vous ne savez plus ce que contient la variable.

```python
print(type(True))   # <class 'bool'>
print(type(7))      # <class 'int'>
print(type(7.0))    # <class 'float'>
print(type("7"))    # <class 'str'>
```

`7` et `7.0` s'affichent presque pareil, mais l'un est un `int`, l'autre un `float`. `"7"` n'est ni l'un ni l'autre.

Deux pièges reviennent tout le temps. `"15" + "3"` donne `"153"`, la concaténation, pas `18`. Il faut convertir d'abord : `int("15") + int("3")`. Et `=` affecte une valeur, tandis que `==` compare. Dans un `if`, on veut presque toujours `==`. Mélanger des types incompatibles, comme `"3" + 1`, provoque une `TypeError` : Python refuse d'additionner un texte et un nombre.

En résumé, `bool` pour les conditions, `int` et `float` pour les calculs, `str` pour le texte. `/` donne un flottant, `//` et `%` le quotient et le reste. Une chaîne s'indexe à partir de 0. `type` révèle, `int`, `float` et `str` convertissent.

## Pour s'entraîner

- [Exercices : Types en Python](/cours/2/python_exercices_types)
- [Exercices : Les conditions](/cours/2/python_exercices_conditions)
