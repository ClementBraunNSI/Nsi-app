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

Dès qu'un calcul revient plusieurs fois, le copier-coller devient risqué : on corrige une copie et on oublie l'autre. Une **fonction** permet de donner un nom à ce calcul. On lui fournit des entrées, elle effectue le calcul et **renvoie** un résultat. Le reste du programme n'a pas besoin de connaître le détail du calcul : il lui suffit d'appeler la fonction par son nom.

## Définir et appeler une fonction

`def` commence la définition. Les noms entre parenthèses sont les **paramètres** : ils représentent des valeurs qui ne sont pas encore connues. À l'appel, on fournit les **arguments**, les valeurs concrètes. `return` renvoie le résultat à celui qui a appelé. Sans `return`, la fonction se termine quand même, mais elle renvoie `None`.

```python
def aire_rectangle(longueur: float, largeur: float) -> float:
    """Calcule l'aire d'un rectangle."""
    return longueur * largeur

a = aire_rectangle(5, 3)  # a vaut 15.0
print(a)
```

Ici `longueur` et `largeur` sont les paramètres. `5` et `3` sont les arguments. `a` reçoit `15.0`, parce que `return` a transmis le produit. Les annotations `float` et `-> float` documentent les types attendus. Python ne vérifie pas ces types, mais les annotations indiquent au lecteur ce que la fonction attend et ce qu'elle renvoie.

| Mot | Rôle |
| --- | --- |
| Paramètre | Nom dans la définition (`longueur`, `largeur`) |
| Argument | Valeur fournie à l'appel (`5`, `3`) |
| `return` | Renvoie le résultat à l'appelant |

!!! warning "`print` n'est pas `return`"
    `print` affiche à l'écran. `return` transmet une valeur utilisable ensuite (`x = ma_fonction()`). Les deux rôles sont différents.

En remplaçant `return` par `print`, l'aire s'affiche, mais `a` vaut `None`. Le résultat a été affiché, mais il n'a pas été récupéré : afficher une valeur et la renvoyer sont deux actions différentes.

L'autre erreur fréquente consiste à oublier les parenthèses. `aire_rectangle` désigne la fonction elle-même. `aire_rectangle(2, 3)` lance le calcul.

## Variables locales et globales

Une variable créée dans le corps d'une fonction est **locale**. Elle est créée lors de l'appel et disparaît à la fin de la fonction, si bien que le reste du programme ne peut pas l'utiliser. Une variable créée hors de toute fonction est **globale** : on peut la lire depuis une fonction, mais pour la modifier, il faut utiliser le mot-clé `global`.

```python
compteur = 0  # globale

def incrementer():
    global compteur
    compteur = compteur + 1

incrementer()
print(compteur)  # 1
```

Sans `global`, la ligne `compteur = compteur + 1` placée dans la fonction provoquerait une erreur, car Python considérerait `compteur` comme une variable locale. La variable globale resterait alors à 0 : porter le même nom ne suffit pas pour désigner la même variable.

En Première, on préfère **passer des paramètres** et **renvoyer un résultat**. `global` fonctionne, mais le programme devient difficile à suivre, car n'importe quelle fonction peut alors modifier une valeur sur laquelle les autres comptent.

## Nommer et documenter

Le nom d'une fonction décrit ce qu'elle fait : `calculer_moyenne` est bien plus clair que `f`. Une fonction ne doit avoir qu'**une** seule responsabilité : s'il faut dire « et aussi » pour expliquer ce qu'elle fait, c'est qu'elle en fait trop. La **docstring**, la chaîne placée juste sous `def`, résume en une phrase ce que la fonction renvoie. C'est la première chose qu'on relit quand on revient sur son code des mois plus tard.

```python
def est_pair(n: int) -> bool:
    """Renvoie True si n est pair, False sinon."""
    return n % 2 == 0
```

`n % 2 == 0` est déjà un booléen, que le `return` renvoie tel quel. Il n'y a donc pas besoin d'un `if`.

En résumé, `def` définit une fonction, et l'appel avec des parenthèses l'exécute. Les paramètres apparaissent dans la définition, alors que les arguments sont les valeurs fournies à l'appel. `return` fournit le résultat, tandis que `print` se contente de l'afficher. Les variables locales n'existent que dans la fonction. Enfin, il vaut mieux passer des paramètres et renvoyer un résultat que d'utiliser des variables globales.

## Pour s'entraîner

- [Exercices : Les fonctions](/cours/2/python_exercices_fonctions)
- [Exercices : Spécifications](/cours/2/python_exercices_specifications)
