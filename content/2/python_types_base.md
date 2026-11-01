---
title: Types de données en Python
subtitle: Les types fondamentaux pour structurer les données
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

Les affectations, les tests et les boucles sont déjà connus. Chaque valeur que manipulent ces instructions a un **type**, qui détermine les opérations que Python accepte de faire avec elle. On ne fait pas les mêmes opérations sur des booléens, des nombres ou des chaînes. La confusion la plus fréquente en début d'année consiste à prendre `"3"` pour `3` : le premier est un texte, le second un entier, et Python ne devine pas lequel des deux le programmeur voulait.

## Les booléens

Un **booléen** (`bool`) n'a que deux valeurs, `True` et `False`. C'est le type des conditions. Trois opérateurs permettent de les combiner : `and` n'est vrai que si les deux côtés le sont, `or` est vrai dès qu'un côté au moins l'est, et `not` inverse la valeur.

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

L'**entier** (`int`) n'a pas de partie décimale, comme `-2`, `0` ou `42`. Le **flottant** (`float`) en a une, comme `3.14` ou `-0.5`. On écrit le séparateur avec un **point**, jamais une virgule. `3,14` n'est pas un nombre en Python.

```python
n = 10
x = 3.5
print(n / 4)   # 2.5  (float)
print(n // 4)  # 2    (int, quotient)
print(n % 4)   # 2    (reste)
```

La division `/` donne toujours un flottant, même quand le résultat tombe juste. `//` donne le quotient entier et `%` le reste. Dans dix, on peut mettre deux fois quatre, et il reste deux : on obtient donc `2` et `2`.

!!! warning "Point décimal"
    On écrit `3.14` avec un **point**, jamais une virgule. Les flottants peuvent produire de petites erreurs d'arrondi (norme IEEE 754) : `0.1 + 0.2` n'est pas exactement `0.3`.

On reviendra sur cette norme dans le cours sur les réels. Pour l'instant, il suffit de retenir qu'un `float` est une valeur approchée, qui n'est pas toujours exactement le nombre décimal écrit.

## Les chaînes de caractères

Les textes et les caractères ont le même type, **chaîne** (`str`). On lit un caractère par son **indice**, et le premier indice est **0**, pas 1. L'indice `-1` désigne le dernier caractère.

```python
mot = "Python"
print(mot[0])   # 'P'
print(mot[-1])  # 'n'
print(mot + "!")  # 'Python!'
print(len(mot))   # 6
```

Entre deux chaînes, `+` **concatène**, c'est-à-dire qu'il colle les textes. `len` compte les caractères.

Une conversion est possible quand elle a un sens. `int("42")` donne l'entier `42`. `str(42)` donne la chaîne `"42"`. `float("3.5")` donne `3.5`. `int("bonjour")` n'a pas de sens : Python lève une erreur.

## Vérifier un type

`type()` affiche le type d'une valeur. C'est l'outil à utiliser quand un calcul échoue et qu'on ne sait plus ce que contient la variable.

```python
print(type(True))   # <class 'bool'>
print(type(7))      # <class 'int'>
print(type(7.0))    # <class 'float'>
print(type("7"))    # <class 'str'>
```

`7` et `7.0` s'affichent presque pareil, mais l'un est un `int`, l'autre un `float`. `"7"` n'est ni l'un ni l'autre.

Deux pièges reviennent tout le temps. D'abord, `"15" + "3"` donne `"153"` par concaténation, et non `18` : il faut convertir avant de calculer, avec `int("15") + int("3")`. Ensuite, `=` affecte une valeur, tandis que `==` compare. Dans un `if`, on veut presque toujours `==`. Mélanger des types incompatibles, comme `"3" + 1`, provoque une `TypeError` : Python refuse d'additionner un texte et un nombre.

En résumé, on utilise `bool` pour les conditions, `int` et `float` pour les calculs et `str` pour le texte. `/` donne un flottant, alors que `//` et `%` donnent le quotient et le reste. Une chaîne s'indexe à partir de 0. Enfin, `type` permet de connaître le type d'une valeur, et `int`, `float` et `str` permettent de la convertir.

## Pour s'entraîner

- [Exercices : Types en Python](/cours/2/python_exercices_types)
- [Exercices : Les conditions](/cours/2/python_exercices_conditions)
