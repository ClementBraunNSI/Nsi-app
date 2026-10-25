---
title: Fonctions en Python
description: >-
  Définir, appeler et documenter des fonctions pour modulariser un programme.
level: premiere
chapter: Introduction à Python
icon: "code"
badgeId: premiere_python_fonctions
prerequisites:
  - python_types_base
audience: public
groupe: fonctions-python
groupeTitre: "Fonctions en Python"
---

# Fonctions en Python

Dès qu'un calcul revient deux fois, le copier-coller devient un piège : on corrige une copie et on oublie l'autre. Une **fonction** donne un nom à ce calcul. On lui passe des entrées, elle travaille, elle **renvoie** un résultat. Le reste du programme n'a pas besoin de voir les lignes du milieu. Il appelle le nom.

## Définir, puis appeler

`def` ouvre la définition. Les noms entre parenthèses sont les **paramètres** : ce sont des emplacements, pas encore des valeurs. À l'appel, on fournit les **arguments**, les valeurs concrètes. `return` renvoie le résultat à celui qui a appelé. Sans `return`, la fonction se termine quand même, mais elle renvoie `None`.

```python
def aire_rectangle(longueur: float, largeur: float) -> float:
    """Calcule l'aire d'un rectangle."""
    return longueur * largeur

a = aire_rectangle(5, 3)  # a vaut 15.0
print(a)
```

Ici `longueur` et `largeur` sont les paramètres. `5` et `3` sont les arguments. `a` reçoit `15.0`, parce que `return` a transmis le produit. Les annotations `float` et `-> float` documentent les types attendus. Python ne les impose pas tout seul en Première, mais elles disent au lecteur ce que la fonction promet.

| Mot | Rôle |
| --- | --- |
| Paramètre | Nom dans la définition (`longueur`, `largeur`) |
| Argument | Valeur fournie à l'appel (`5`, `3`) |
| `return` | Renvoie le résultat à l'appelant |

!!! warning "`print` n'est pas `return`"
    `print` affiche à l'écran. `return` transmet une valeur utilisable ensuite (`x = ma_fonction()`). Les deux rôles sont différents.

En remplaçant `return` par `print`, l'aire s'affiche, mais `a` vaut `None`. On a vu le résultat, on ne l'a pas récupéré. Afficher et renvoyer sont deux gestes.

Oublier les parenthèses est l'autre confusion. `aire_rectangle` désigne la fonction elle-même. `aire_rectangle(2, 3)` lance le calcul.

## Ce qui reste dans la fonction

Une variable créée dans le corps est **locale**. Elle naît à l'appel et disparaît au `return`. Le reste du programme ne la voit pas. Une variable créée hors de toute fonction est **globale** : on peut la lire de l'intérieur, mais la modifier demande le mot `global`.

```python
compteur = 0  # globale

def incrementer():
    global compteur
    compteur = compteur + 1

incrementer()
print(compteur)  # 1
```

Sans `global`, une ligne `compteur = compteur + 1` à l'intérieur créerait une variable locale, ou planterait, et la globale resterait à 0. Le même nom ne suffit pas à dire « c'est la même boîte ».

En Première, on préfère **passer des paramètres** et **retourner un résultat**. `global` marche, mais le programme devient difficile à suivre : n'importe quelle fonction peut changer une valeur que les autres croyaient stable.

## Nommer et documenter

Un nom décrit l'action : `calculer_moyenne`, pas `f`. Une fonction porte **une** responsabilité. S'il faut dire « et aussi » pour expliquer ce qu'elle fait, elle en fait trop. La **docstring**, la chaîne juste sous `def`, dit en une phrase ce que la fonction renvoie. C'est la première chose qu'on lit six mois plus tard.

```python
def est_pair(n: int) -> bool:
    """Renvoie True si n est pair, False sinon."""
    return n % 2 == 0
```

`n % 2 == 0` est déjà un booléen. Le `return` le renvoie tel quel. Pas besoin d'un `if`.

En résumé, `def` définit, l'appel avec parenthèses lance. Paramètres et arguments ne sont pas le même mot. `return` fournit le résultat, `print` se contente de l'afficher. Les variables locales restent dans la fonction. On passe des paramètres et on renvoie, plutôt que de tout accrocher à `global`.

## Pour s'entraîner

- [Exercices : Les fonctions](/cours/2/python_exercices_fonctions)
- [Exercices : Spécifications](/cours/2/python_exercices_specifications)
