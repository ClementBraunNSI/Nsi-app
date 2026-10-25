---
title: "Analyse de complexité"
description: "Évaluer et comparer l'efficacité des algorithmes en temps et en mémoire"
level: TNSI
order: 190
chapter: Algorithmique
icon: "timer"
badgeId: terminale_complexite
prerequisites:
  - algo_programmation_dynamique
audience: public
---

# Analyse de complexité

Un algorithme peut être juste et néanmoins inutilisable. S'il examine chaque paire d'éléments d'une liste de dix millions d'entrées, la réponse correcte arrive trop tard. L'analyse de complexité prévoit comment le coût grandit quand la taille des données grandit. On s'en sert pour comparer des algorithmes sans dépendre de la machine : un ordinateur plus rapide multiplie tout par une constante, il ne change pas la forme de la croissance.

## Le temps, compté en opérations

La complexité temporelle compte des opérations élémentaires en fonction de la taille de l'entrée, notée `n`. On ne mesure pas des secondes. On regarde si le nombre d'opérations reste stable, suit `n`, ou explose.

| Notation | Croissance | Exemple |
| :--- | :--- | :--- |
| `O(1)` | Constante, indépendante de `n` | Lire `tab[i]` |
| `O(log n)` | Lente | Recherche dichotomique |
| `O(n)` | Linéaire | Parcourir une liste |
| `O(n log n)` | Un peu plus que linéaire | Tri fusion |
| `O(n^2)` | Quadratique | Deux boucles imbriquées |

Le `O` décrit un ordre de grandeur. On garde le terme qui domine quand `n` devient grand, et on jette les constantes. `3n + 20` est en `O(n)`. Pour de petites listes, la constante peut gagner. Pour de grandes, c'est le terme en `n`, ou en `n^2`, qui décide.

Voici un parcours qui cherche le maximum. Chaque élément est regardé une fois, les comparaisons sont proportionnelles à la longueur : c'est `O(n)`.

```python
def maximum(tab):
    m = tab[0]
    for x in tab:
        if x > m:
            m = x
    return m
```

La fonction suivante construit toutes les paires. Pour chaque indice `i`, la boucle interne parcourt encore ce qui reste. Le nombre de passages suit le carré de `n`.

```python
def couples(tab):
    res = []
    for i in range(len(tab)):
        for j in range(i + 1, len(tab)):
            res.append((tab[i], tab[j]))
    return res
```

Deux boucles imbriquées qui dépendent toutes les deux de `n` donnent en général `O(n^2)`. Pas toujours : si la boucle interne va jusqu'à une constante, on reste linéaire. Il faut lire les bornes, pas seulement compter les mots `for`.

## La mémoire

La complexité mémoire mesure l'espace supplémentaire utilisé pendant le calcul, en plus de l'entrée elle-même. Un algorithme **en place** se contente de quelques variables. Un tri qui recopie la liste dans une structure auxiliaire occupe souvent `O(n)` en plus.

Gagner du temps coûte parfois de la mémoire, et l'inverse est vrai aussi. Un tableau de résultats déjà calculés évite de recommencer les mêmes appels, au prix de les stocker. Le choix dépend de ce qui manque : les secondes, ou les cases.

## Comment conclure

On commence par nommer `n`, la taille qui compte : longueur de la liste, nombre de sommets, taille du texte. On repère les boucles et les appels récursifs qui dépendent de `n`. On ne garde que le terme dominant. On écrit `O(...)`.

Deux repères de Terminale suffisent à sentir l'écart. Une recherche séquentielle est en `O(n)` : dans le pire cas, on lit toute la liste. Une recherche dichotomique, sur une liste triée, est en `O(log n)` : chaque étape jette la moitié de ce qui reste. Quand `n` est énorme, « la moitié à chaque fois » et « tout, une fois » ne jouent plus dans la même catégorie. C'est aussi pour cela qu'un tri en `O(n log n)` remplace, sur de grandes données, un tri en `O(n^2)`.

## Exercices

1. Donner la complexité de :
   - une recherche séquentielle ;
   - une recherche dichotomique ;
   - un algorithme avec deux boucles `for` de `0` à `n-1`.
2. Expliquer pourquoi `O(n log n)` est préférable à `O(n^2)` pour trier de grandes listes.
3. Proposer un exemple où on accepte plus de mémoire pour gagner du temps.
