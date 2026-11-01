---
title: "Constructions élémentaires en Python"
description: "Variables, opérateurs, entrées-sorties, conditions et boucles : les briques de base d'un programme."
level: premiere
chapter: Introduction à Python
icon: "brick-wall"
badgeId: premiere_python_intro
prerequisites: []
audience: public
---

# Constructions élémentaires en Python

Un programme Python est une suite d'**instructions** exécutées dans l'ordre, de haut en bas, sauf quand un test ou une boucle décide de sauter ou de recommencer. Ces instructions sont de quelques types seulement : affecter une valeur, calculer, lire une saisie, afficher, choisir entre plusieurs chemins et répéter. Tout le reste de l'année s'appuie sur ces bases.

## L'affectation

L'**affectation** associe une valeur à un nom, avec `=`. Ce n'est pas une égalité mathématique : en maths, `score = score + 10` serait absurde. En Python, on calcule d'abord la partie droite, puis on range le résultat dans la variable de gauche. Il ne faut pas non plus parler d'instanciation, car ce mot est réservé à la programmation orientée objet, vue plus tard.

```python
score = 0
score = score + 10   # réaffectation : score vaut maintenant 10
message = "Bonjour"
```

Au départ `score` vaut 0. La ligne suivante calcule `0 + 10` et range 10 sous le même nom. L'ancienne valeur est perdue.

## Les calculs

Les opérateurs arithmétiques s'écrivent presque comme en cours de maths, mais quelques-uns méritent attention. `/` fait une division réelle et renvoie un flottant : `7 / 2` vaut `3.5`. `//` ne garde que le quotient entier : `7 // 2` vaut `3`. `%` donne le reste : `7 % 2` vaut `1`. `**` élève à une puissance : `2 ** 3` vaut `8`.

| Opérateur | Opération | Exemple |
| --- | --- | --- |
| `+` | Addition | `3 + 2` donne `5` |
| `-` | Soustraction | `5 - 3` donne `2` |
| `*` | Multiplication | `4 * 3` donne `12` |
| `/` | Division réelle | `7 / 2` donne `3.5` |
| `//` | Division entière | `7 // 2` donne `3` |
| `%` | Reste (modulo) | `7 % 2` donne `1` |
| `**` | Puissance | `2 ** 3` donne `8` |

```python
a = 3 + 2
b = 10 % 3   # 1
```

## Les conditions

Une comparaison renvoie un booléen, `True` ou `False`. Les opérateurs `>`, `<`, `>=` et `<=` comparent deux valeurs, `==` teste l'égalité et `!=` la différence. Il ne faut pas confondre `=`, qui affecte une valeur, et `==`, qui compare. Dans un `if`, on veut presque toujours `==`.

| Opérateur | Signification |
| --- | --- |
| `>` / `<` | supérieur / inférieur |
| `>=` / `<=` | supérieur ou égal / inférieur ou égal |
| `==` | égal |
| `!=` | différent |

```python
age = int(input("Quel est votre âge ? "))

if age >= 18:
    print("Majeur")
elif age >= 13:
    print("Adolescent")
else:
    print("Enfant")
```

Python exécute la première branche dont la condition est vraie, et ignore les autres. `elif` signifie « sinon, si », et `else` traite tous les cas restants. L'**indentation**, de quatre espaces, indique quelles lignes appartiennent à chaque branche. Sans elle, Python ne sait pas où le bloc s'arrête.

## Les entrées et sorties

`print(...)` écrit à l'écran. `input(...)` lit ce que l'utilisateur tape, et renvoie **toujours une chaîne**, même si la personne a tapé des chiffres. Pour calculer un âge, il faut convertir : `int(input(...))`.

```python
nom = input("Nom : ")
print("Bonjour", nom)
age = int(input("Âge : "))  # conversion obligatoire pour calculer
```

Oublier `int` est l'erreur classique. `"18" >= 18` mélange une chaîne et un entier, et Python lève une erreur de types.

## Les boucles

`for` répète un nombre de fois connu à l'avance. On l'utilise souvent avec `range`. `while` répète **tant qu'une condition** reste vraie. Il faut alors faire évoluer la variable de contrôle, sinon la condition ne devient jamais fausse et la boucle ne s'arrête pas.

```python
for i in range(1, 6):
    print(i)   # 1, 2, 3, 4, 5

n = 1
while n <= 5:
    print(n)
    n = n + 1
```

!!! tip "`range`"
    `range(5)` produit `0, 1, 2, 3, 4`. `range(1, 6)` produit `1` à `5` (la borne de droite est exclue).

Les deux boucles affichent les mêmes nombres. Dans le `for`, `range` fournit les valeurs. Dans le `while`, c'est au programme de faire avancer `n`. Sans `n = n + 1`, `n` resterait égal à 1, la condition resterait vraie et le programme ne sortirait jamais de la boucle.

En résumé, `=` affecte une valeur et `==` compare. `input` renvoie une chaîne, qu'il faut convertir avant de calculer. `if`, `elif` et `else` permettent de choisir un chemin. `for` répète un nombre de fois connu à l'avance, alors que `while` répète tant qu'une condition reste vraie. L'indentation délimite les blocs, et le programme s'exécute de haut en bas, sauf quand un test ou une boucle modifie cet ordre.

## Pour s'entraîner

- [Exercices : Les conditions](/cours/2/python_exercices_conditions)
- [Exercices : Les boucles](/cours/2/python_exercices_boucles)
