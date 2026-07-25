---
title: Types de données en Python
subtitle: Les types fondamentaux pour structurer vos données
description: "Booléens, entiers, flottants et chaînes : reconnaître un type et l'utiliser correctement."
level: premiere
chapter: Introduction à Python
icon: "\U0001F522"
badgeId: premiere_types_base
prerequisites:
  - python_constructions_elementaires
---

## Objectifs

- Identifier le type d'une valeur (`bool`, `int`, `float`, `str`).
- Utiliser les opérateurs logiques `and`, `or`, `not`.
- Distinguer division réelle `/` et division entière `//`.
- Accéder à un caractère d'une chaîne par son indice.

## Idée clé

En Python, **chaque valeur a un type**. Le type fixe ce que l'on peut faire avec cette valeur : comparer des booléens, calculer avec des nombres, indexer une chaîne. Confondre les types (par exemple `"3"` et `3`) est la source la plus fréquente d'erreurs en début d'année.

## Les booléens (`bool`)

Un booléen ne prend que deux valeurs : `True` ou `False`. Il sert surtout dans les conditions.

| Opérateur | Signification | Exemple |
| --- | --- | --- |
| `and` | Vrai si **les deux** sont vrais | `True and False` → `False` |
| `or` | Vrai si **au moins un** est vrai | `True or False` → `True` |
| `not` | Inverse la valeur | `not True` → `False` |

```python
age = 16
a_permis = False
peut_conduire = age >= 18 and a_permis  # False
```

## Les nombres (`int` et `float`)

| Type | Rôle | Exemples |
| --- | --- | --- |
| `int` | Entiers | `-2`, `0`, `42` |
| `float` | Décimaux | `3.14`, `-0.5` |

```python
n = 10
x = 3.5
print(n / 4)   # 2.5  (float)
print(n // 4)  # 2    (int, quotient)
print(n % 4)   # 2    (reste)
```

!!! warning "Point décimal"
    On écrit `3.14` avec un **point**, jamais une virgule. Les flottants peuvent produire de petites erreurs d'arrondi (norme IEEE 754) : `0.1 + 0.2` n'est pas exactement `0.3`.

## Les chaînes (`str`)

Textes et caractères partagent le même type `str`. L'indice du premier caractère est **0**.

```python
mot = "Python"
print(mot[0])   # 'P'
print(mot[-1])  # 'n'
print(mot + "!")  # 'Python!'
print(len(mot))   # 6
```

On peut convertir un type en un autre quand c'est cohérent : `int("42")` → `42`, `str(42)` → `"42"`, `float("3.5")` → `3.5`.

## Vérifier un type

La fonction `type()` affiche le type d'une valeur. Utile pour comprendre une erreur.

```python
print(type(True))   # <class 'bool'>
print(type(7))      # <class 'int'>
print(type(7.0))    # <class 'float'>
print(type("7"))    # <class 'str'>
```

## Piège fréquent

- `"15" + "3"` donne `"153"` (concaténation), pas `18`. Convertir d'abord : `int("15") + int("3")`.
- `=` affecte une valeur ; `==` compare deux valeurs. Dans un `if`, on veut presque toujours `==`.

## À retenir

- `bool` : `True` / `False` + `and`, `or`, `not`.
- `int` : entiers ; `float` : décimaux (point, pas virgule).
- `/` renvoie un flottant ; `//` et `%` donnent quotient et reste entiers.
- Une `str` s'indexe à partir de 0 ; `+` concatène.
- `type(x)` révèle le type ; `int()`, `float()`, `str()` convertissent.
- Mélanger types incompatibles (`"3" + 1`) provoque une `TypeError`.

## Pour s'entraîner

- [Exercices : Types en Python](/cours/2/python_exercices_types)
- [Exercices : Les conditions](/cours/2/python_exercices_conditions)
