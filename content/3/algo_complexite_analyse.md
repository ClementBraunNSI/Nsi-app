---
title: "Analyse de complexité"
description: "Évaluer et comparer l'efficacité des algorithmes en temps et en mémoire"
level: TNSI
order: 190
chapter: Algorithmique
icon: "⏱️"
badgeId: terminale_complexite
prerequisites:
  - algo_programmation_dynamique
---

# Analyse de complexité

## Pourquoi la complexité est indispensable ?

En NSI, un algorithme peut être **correct** mais inutilisable en pratique s'il est trop lent.
L'analyse de complexité permet de prévoir le comportement d'un algorithme quand la taille des données augmente.

!!! info "Objectif"
    La complexité sert à comparer des algorithmes **indépendamment de la machine** utilisée.

## 1. Complexité temporelle

La complexité temporelle mesure le nombre d'opérations effectuées en fonction de la taille de l'entrée, notée `n`.

### Notations usuelles

| Notation | Signification | Exemple classique |
| :--- | :--- | :--- |
| `O(1)` | Coût constant | Accès à `tab[i]` |
| `O(log n)` | Croissance lente | Recherche dichotomique |
| `O(n)` | Coût linéaire | Parcours d'une liste |
| `O(n log n)` | Bon compromis | Tri fusion |
| `O(n^2)` | Coût quadratique | Double boucle imbriquée |

### Exemple 1 : parcours simple

```python
def maximum(tab):
    m = tab[0]
    for x in tab:
        if x > m:
            m = x
    return m
```

Ici, chaque élément est examiné une fois : complexité `O(n)`.

### Exemple 2 : double boucle

```python
def couples(tab):
    res = []
    for i in range(len(tab)):
        for j in range(i + 1, len(tab)):
            res.append((tab[i], tab[j]))
    return res
```

Deux boucles imbriquées : complexité `O(n^2)`.

## 2. Complexité mémoire

La complexité mémoire mesure l'espace supplémentaire utilisé pendant l'exécution.

- **Algorithme en place** : peu de mémoire additionnelle.
- **Algorithme avec structure auxiliaire** : souvent `O(n)` en mémoire.

!!! warning "Attention"
    Optimiser le temps peut augmenter la mémoire, et inversement.

## 3. Méthode d'analyse

1. Identifier la variable de taille (`n`).
2. Repérer les boucles et appels récursifs.
3. Conserver le terme dominant.
4. Donner la notation `O(...)`.

## 4. Comparaison utile en Terminale

- Une recherche séquentielle est en `O(n)`.
- Une recherche dichotomique est en `O(log n)` (si la liste est triée).

Pour de très grandes valeurs de `n`, la différence est énorme.

## Exercices

1. Donner la complexité de :
   - une recherche séquentielle ;
   - une recherche dichotomique ;
   - un algorithme avec deux boucles `for` de `0` à `n-1`.
2. Expliquer pourquoi `O(n log n)` est préférable à `O(n^2)` pour trier de grandes listes.
3. Proposer un exemple où on accepte plus de mémoire pour gagner du temps.
