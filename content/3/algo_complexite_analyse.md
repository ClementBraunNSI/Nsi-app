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

Un algorithme peut être juste et néanmoins inutilisable. S'il examine chaque paire d'éléments d'une liste de dix millions d'entrées, la réponse correcte arrive trop tard. L'analyse de complexité prévoit comment le coût grandit quand la taille des données grandit. On s'en sert pour comparer des algorithmes indépendamment de la machine : un ordinateur plus rapide divise tous les temps par une constante, mais ne change pas la façon dont ils augmentent.

## La complexité en temps

La complexité temporelle compte des opérations élémentaires en fonction de la taille de l'entrée, notée `n`. On ne mesure pas des secondes : on regarde si le nombre d'opérations reste stable, augmente comme `n`, ou augmente beaucoup plus vite.

| Notation | Croissance | Exemple |
| :--- | :--- | :--- |
| `O(1)` | Constante, indépendante de `n` | Lire `tab[i]` |
| `O(log n)` | Lente | Recherche dichotomique |
| `O(n)` | Linéaire | Parcourir une liste |
| `O(n log n)` | Un peu plus que linéaire | Tri fusion |
| `O(n^2)` | Quadratique | Deux boucles imbriquées |

Le `O` décrit un ordre de grandeur. On garde le terme qui domine quand `n` devient grand, et on supprime les constantes : `3n + 20` est ainsi en `O(n)`. Pour de petites listes, la constante peut compter davantage, mais pour de grandes listes, c'est le terme en `n`, ou en `n^2`, qui l'emporte.

Voici un parcours qui cherche le maximum. Chaque élément est examiné une seule fois, donc le nombre de comparaisons est proportionnel à la longueur de la liste : la complexité est en `O(n)`.

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

Deux boucles imbriquées qui dépendent toutes les deux de `n` donnent en général `O(n^2)`. Ce n'est pas toujours le cas : si la boucle interne s'arrête à une constante, la complexité reste linéaire. Il faut donc lire les bornes des boucles, et pas seulement compter les `for`.

## La complexité en mémoire

La complexité mémoire mesure l'espace supplémentaire utilisé pendant le calcul, en plus de l'entrée elle-même. Un algorithme **en place** se contente de quelques variables. Un tri qui recopie la liste dans une structure auxiliaire occupe souvent `O(n)` en plus.

Gagner du temps demande parfois plus de mémoire, et inversement. Un tableau de résultats déjà calculés évite par exemple de refaire les mêmes appels, mais il faut stocker ces résultats. Le choix dépend de la ressource la plus limitée : le temps ou la mémoire.

## La méthode

On commence par identifier `n`, la taille des données qui compte, comme la longueur de la liste, le nombre de sommets ou la taille du texte. On repère ensuite les boucles et les appels récursifs qui dépendent de `n`, puis on ne garde que le terme dominant pour écrire la complexité sous la forme `O(...)`.

Deux exemples suffisent pour mesurer l'écart. Une recherche séquentielle est en `O(n)` : dans le pire cas, on lit toute la liste. Une recherche dichotomique, sur une liste triée, est en `O(log n)` : chaque étape jette la moitié de ce qui reste. Quand `n` est très grand, éliminer la moitié des éléments à chaque étape est incomparablement plus rapide que de les lire tous. C'est aussi pour cela qu'un tri en `O(n log n)` remplace, sur de grandes données, un tri en `O(n^2)`.

## Exercices

1. Donner la complexité de :
   - une recherche séquentielle ;
   - une recherche dichotomique ;
   - un algorithme avec deux boucles `for` de `0` à `n-1`.
2. Expliquer pourquoi `O(n log n)` est préférable à `O(n^2)` pour trier de grandes listes.
3. Proposer un exemple où on accepte plus de mémoire pour gagner du temps.
