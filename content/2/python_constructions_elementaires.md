---
title: "Constructions élémentaires en Python"
description: "Variables, opérateurs, entrées-sorties, conditions et boucles : les briques de base d'un programme."
level: premiere
chapter: Introduction à Python
icon: "🧱"
badgeId: premiere_python_intro
prerequisites: []
---

## Objectifs

- Affecter une valeur à une variable avec `=`.
- Utiliser les opérateurs arithmétiques et de comparaison.
- Lire une entrée avec `input()` et l'afficher avec `print()`.
- Écrire une condition `if` / `elif` / `else`.
- Répéter des instructions avec `for` et `while`.

## Idée clé

Un programme Python exécute des **instructions dans l'ordre**. Les constructions élémentaires — affectation, calcul, test, boucle — sont les briques que l'on combine ensuite dans des fonctions et des structures de données.

## Programme et affectation

Un **programme** est une suite d'instructions exécutées **séquentiellement**.

L'**affectation** associe une valeur à un nom de variable grâce à l'opérateur `=`. Ce n'est ni une égalité mathématique, ni une « instanciation » (terme réservé à la POO).

```python
score = 0
score = score + 10   # réaffectation : score vaut maintenant 10
message = "Bonjour"
```

## Opérateurs arithmétiques

| Opérateur | Opération | Exemple |
| --- | --- | --- |
| `+` | Addition | `3 + 2` → `5` |
| `-` | Soustraction | `5 - 3` → `2` |
| `*` | Multiplication | `4 * 3` → `12` |
| `/` | Division réelle | `7 / 2` → `3.5` |
| `//` | Division entière | `7 // 2` → `3` |
| `%` | Reste (modulo) | `7 % 2` → `1` |
| `**` | Puissance | `2 ** 3` → `8` |

```python
a = 3 + 2
b = 10 % 3   # 1
```

## Comparaisons et conditions

Les comparaisons renvoient un booléen. Attention : `==` teste l'égalité ; `=` affecte.

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

L'indentation (4 espaces) délimite le bloc exécuté sous chaque branche.

## Entrées et sorties

- `print(...)` affiche à l'écran.
- `input(...)` lit une **chaîne** saisie par l'utilisateur.

```python
nom = input("Nom : ")
print("Bonjour", nom)
age = int(input("Âge : "))  # conversion obligatoire pour calculer
```

## Boucles `for` et `while`

`for` répète un nombre de fois connu (souvent avec `range`).  
`while` répète **tant qu'une condition** reste vraie — penser à faire évoluer la variable de contrôle.

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

## Piège fréquent

- Oublier `int(input(...))` : `"18" >= 18` provoque une erreur de types.
- Boucle `while` sans mise à jour de la variable → boucle infinie.

## À retenir

- `=` = affectation ; `==` = comparaison.
- `input()` renvoie toujours une `str` ; convertir si besoin.
- `if` / `elif` / `else` choisissent un chemin selon des booléens.
- `for` : répétition bornée ; `while` : répétition conditionnelle.
- L'indentation structure les blocs.
- Les instructions s'exécutent de haut en bas, sauf branchement ou boucle.

## Pour s'entraîner

- [Exercices : Les conditions](/cours/2/python_exercices_conditions)
- [Exercices : Les boucles](/cours/2/python_exercices_boucles)
