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

Un programme Python est une suite d'**instructions** exécutées dans l'ordre, de haut en bas, sauf quand un test ou une boucle décide de sauter ou de recommencer. Les briques de cette suite sont peu nombreuses : affecter une valeur, calculer, lire, afficher, choisir, répéter. Tout le reste de l'année s'appuie dessus.

## L'affectation

L'**affectation** associe une valeur à un nom, avec `=`. Ce n'est pas une égalité mathématique. En maths, `score = score + 10` serait absurde. En Python, on lit à droite d'abord, puis on range le résultat dans le nom de gauche. Ce n'est pas non plus une instanciation : ce mot est réservé à la programmation orientée objet, plus tard.

```python
score = 0
score = score + 10   # réaffectation : score vaut maintenant 10
message = "Bonjour"
```

Au départ `score` vaut 0. La ligne suivante calcule `0 + 10` et range 10 sous le même nom. L'ancienne valeur est perdue.

## Calculer

Les opérateurs arithmétiques s'écrivent presque comme en cours de maths. Deux détails changent le résultat. `/` fait une division réelle et renvoie un flottant : `7 / 2` vaut `3.5`. `//` ne garde que le quotient entier : `7 // 2` vaut `3`. `%` donne le reste : `7 % 2` vaut `1`. `**` élève à une puissance : `2 ** 3` vaut `8`.

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

## Choisir un chemin

Une comparaison renvoie un booléen, `True` ou `False`. `>` et `<` comparent, `>=` et `<=` aussi, `==` teste l'égalité, `!=` la différence. Le piège d'écriture est `=`, qui affecte, contre `==`, qui compare. Dans un `if`, on veut presque toujours `==`.

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

Python exécute la première branche dont la condition est vraie, et ignore les autres. `elif` veut dire « sinon, si ». `else` ramasse tout ce qui reste. L'**indentation**, quatre espaces, dit quelles lignes appartiennent à la branche. Sans elle, Python ne sait pas où le bloc s'arrête.

## Lire et afficher

`print(...)` écrit à l'écran. `input(...)` lit ce que l'utilisateur tape, et renvoie **toujours une chaîne**, même si la personne a tapé des chiffres. Pour calculer un âge, il faut convertir : `int(input(...))`.

```python
nom = input("Nom : ")
print("Bonjour", nom)
age = int(input("Âge : "))  # conversion obligatoire pour calculer
```

Oublier `int` est l'erreur classique. `"18" >= 18` mélange une chaîne et un entier, et Python lève une erreur de types.

## Répéter

`for` répète un nombre de fois connu à l'avance. On le couple souvent à `range`. `while` répète **tant qu'une condition** reste vraie. Il faut alors faire évoluer la variable de contrôle, sinon la condition ne devient jamais fausse et la boucle ne s'arrête pas.

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

Les deux boucles affichent les mêmes nombres. Dans le `for`, `range` fournit les valeurs. Dans le `while`, c'est au programme d'avancer `n`. Sans `n = n + 1`, `n` reste à 1, la condition reste vraie, et le programme ne sort plus.

En résumé, `=` affecte, `==` compare. `input` renvoie une chaîne, à convertir avant un calcul. `if`, `elif` et `else` choisissent un chemin. `for` répète un nombre de fois connu, `while` répète tant qu'une condition tient. L'indentation dessine les blocs. Le reste du programme se lit de haut en bas, sauf quand un test ou une boucle dévie.

## Pour s'entraîner

- [Exercices : Les conditions](/cours/2/python_exercices_conditions)
- [Exercices : Les boucles](/cours/2/python_exercices_boucles)
