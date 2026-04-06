---
title: "Graphes pondérés et plus court chemin"
description: "Comprendre et appliquer l'algorithme de Dijkstra"
level: TNSI
order: 200
chapter: Structures de données
icon: "🧭"
badgeId: terminale_graphes_ponderes
prerequisites:
  - structures_graphes
---

# Graphes pondérés et plus court chemin

## Rappel

Dans un graphe pondéré, chaque arête a un poids (distance, coût, durée...).
On cherche donc un chemin de **coût minimal**.

- Graphe non pondéré : minimiser le nombre d'arêtes.
- Graphe pondéré : minimiser la somme des poids.

## 1. Le problème du plus court chemin

On se place sur un sommet de départ `S`.
Objectif : trouver la distance minimale vers tous les autres sommets.

## 2. Principe de Dijkstra

L'algorithme de Dijkstra repose sur une idée simple :
à chaque étape, on valide le sommet non traité le plus proche.

### Étapes

1. Distance du départ = `0`, toutes les autres = `+inf`.
2. Choisir le sommet non traité de distance minimale.
3. Mettre à jour ses voisins (relaxation).
4. Répéter jusqu'à stabilisation.

!!! warning "Condition de validité"
    Dijkstra fonctionne uniquement si les poids sont **positifs ou nuls**.

## 3. Représentation en Python

```python
graphe = {
    "A": [("B", 4), ("C", 2)],
    "B": [("D", 3)],
    "C": [("B", 1), ("D", 7)],
    "D": []
}
```

## 4. Implémentation simplifiée

```python
def dijkstra(graphe, source):
    dist = {s: float("inf") for s in graphe}
    pred = {s: None for s in graphe}
    visites = set()
    dist[source] = 0

    while len(visites) < len(graphe):
        courant = min((s for s in graphe if s not in visites), key=lambda s: dist[s])
        visites.add(courant)

        for voisin, poids in graphe[courant]:
            nd = dist[courant] + poids
            if nd < dist[voisin]:
                dist[voisin] = nd
                pred[voisin] = courant

    return dist, pred
```

## 5. Reconstituer un chemin

La table `pred` permet de retrouver le chemin depuis la source jusqu'à une cible.
On remonte les prédécesseurs puis on inverse.

## Exercices

1. Appliquer Dijkstra au graphe d'exemple depuis `A`.
2. Donner la distance minimale de `A` vers `D`.
3. Reconstituer le chemin complet.
4. Expliquer pourquoi l'algorithme échoue avec des poids négatifs.
