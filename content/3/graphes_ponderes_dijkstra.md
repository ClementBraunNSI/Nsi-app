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
audience: public
---

# Graphes pondérés et plus court chemin

Dans un graphe non pondéré, le plus court chemin est celui qui traverse le moins d'arêtes. Dès qu'une arête porte un **poids** — une distance, un coût, une durée — ce n'est plus le nombre d'arêtes qui compte, c'est la **somme des poids**. Un détour par trois arêtes légères peut être meilleur qu'une arête directe très chère. On cherche alors un chemin de coût minimal.

On se fixe un sommet de départ. L'objectif de Dijkstra est la distance minimale de ce départ vers chacun des autres sommets, pas vers une seule cible. Les cibles se déduisent du tableau, une fois qu'il est rempli.

## Valider le plus proche, puis relâcher

L'algorithme de **Dijkstra** maintient, pour chaque sommet, une distance provisoire depuis la source. Au départ, la source est à 0 et tous les autres sont à $+\infty$ : on ne sait pas encore les atteindre. Un sommet est soit encore en attente, soit déjà **validé**.

À chaque tour, on valide le sommet encore en attente dont la distance provisoire est la plus petite. Cette distance-là est définitive. On **relâche** ensuite ses arêtes : pour chaque voisin, on compare la distance déjà notée avec « distance du sommet validé + poids de l'arête ». Si le passage par le sommet qu'on vient de valider est meilleur, on met à jour la distance du voisin, et l'on retient le prédécesseur qui a permis cette mise à jour. On recommence jusqu'à ce que tous les sommets soient validés.

L'idée tient parce qu'on valide toujours le plus proche restant. Tout chemin qui ferait un détour par un sommet encore plus loin ne pourrait pas améliorer cette distance, **à condition que les poids soient positifs ou nuls**. Un poids négatif casserait le raisonnement : un sommet déjà validé pourrait être amélioré plus tard par une arête négative, et l'on aurait figé trop tôt. Dijkstra ne s'applique pas aux poids négatifs. D'autres algorithmes, comme Bellman-Ford, existent pour ce cas. Ils ne sont pas au programme de cette page.

!!! warning "Condition de validité"
    Dijkstra fonctionne uniquement si les poids sont **positifs ou nuls**.

## Le graphe en dictionnaire

Chaque sommet est une clé. La valeur est la liste des couples `(voisin, poids)`. Une liste vide veut dire : aucune arête sortante.

```python
graphe = {
    "A": [("B", 4), ("C", 2)],
    "B": [("D", 3)],
    "C": [("B", 1), ("D", 7)],
    "D": []
}
```

De A, on peut aller en B pour 4 ou en C pour 2. De C, on rejoint B pour 1, ce qui est mieux que l'arête directe A→B. C'est exactement le genre d'amélioration que la relaxation doit découvrir.

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

`dist` porte les distances provisoires, puis définitives. `visites` contient les sommets déjà validés. Le `min` cherche le sommet non visité de plus petite distance : c'est l'implantation simple, en $O(n^2)$ comparaisons sur un graphe à $n$ sommets. Une file de priorité ferait mieux sur un graphe creux. Le résultat, lui, est le même. `pred[voisin] = courant` mémorise par quelle arête la meilleure distance connue a été obtenue.

## Remonter le chemin

`dist` dit combien. `pred` dit par où. Pour reconstruire le chemin vers une cible, on part de la cible et l'on suit les prédécesseurs jusqu'à la source, dont le prédécesseur vaut `None`. On obtient le chemin à l'envers. On l'inverse. Si une distance reste infinie, le sommet n'est pas atteignable depuis la source, et la remontée n'a pas de sens.

## Exercices

1. Appliquer Dijkstra au graphe d'exemple depuis `A`.
2. Donner la distance minimale de `A` vers `D`.
3. Reconstituer le chemin complet.
4. Expliquer pourquoi l'algorithme échoue avec des poids négatifs.
