---
title: "Graphes pondérés et plus court chemin"
description: "Comprendre et appliquer l'algorithme de Dijkstra"
level: TNSI
order: 200
chapter: Structures de données
icon: "compass"
badgeId: terminale_graphes_ponderes
prerequisites:
  - structures_graphes
audience: public
---

# Graphes pondérés et plus court chemin

Dans un graphe non pondéré, le plus court chemin est celui qui traverse le moins d'arêtes. Dès qu'une arête porte un **poids** (une distance, un coût, une durée), ce n'est plus le nombre d'arêtes qui compte, mais la **somme des poids**. Un détour par trois arêtes légères peut être meilleur qu'une arête directe très chère. On cherche alors un chemin de coût minimal.

On part d'un sommet donné. L'algorithme de Dijkstra calcule la distance minimale entre ce sommet et chacun des autres sommets, et non vers une seule cible. Une fois le tableau rempli, il suffit d'y lire la distance vers la cible voulue.

## Le principe de l'algorithme

L'algorithme de **Dijkstra** maintient, pour chaque sommet, une distance provisoire depuis la source. Au départ, la source est à 0 et tous les autres sont à $+\infty$ : on ne sait pas encore les atteindre. Un sommet est soit encore en attente, soit déjà **validé**.

À chaque tour, on valide le sommet encore en attente dont la distance provisoire est la plus petite. Sa distance est alors définitive. On **relâche** ensuite ses arêtes : pour chaque voisin, on compare la distance déjà notée avec « distance du sommet validé + poids de l'arête ». Si le passage par le sommet qu'on vient de valider est meilleur, on met à jour la distance du voisin, et l'on retient le prédécesseur qui a permis cette mise à jour. On recommence jusqu'à ce que tous les sommets soient validés.

Cette méthode fonctionne parce qu'on valide toujours le sommet restant le plus proche. Tout chemin qui ferait un détour par un sommet encore plus loin ne pourrait pas améliorer cette distance, **à condition que les poids soient positifs ou nuls**. Un poids négatif rendrait ce raisonnement faux : un sommet déjà validé pourrait être amélioré plus tard grâce à une arête négative, alors que sa distance aurait été fixée trop tôt. Dijkstra ne s'applique donc pas aux graphes qui ont des poids négatifs. D'autres algorithmes, comme celui de Bellman-Ford, traitent ce cas, mais ils ne sont pas au programme.

!!! warning "Condition de validité"
    Dijkstra fonctionne uniquement si les poids sont **positifs ou nuls**.

## Le graphe en dictionnaire

Chaque sommet est une clé. La valeur est la liste des couples `(voisin, poids)`. Une liste vide signifie que le sommet n'a aucune arête sortante.

```python
graphe = {
    "A": [("B", 4), ("C", 2)],
    "B": [("D", 3)],
    "C": [("B", 1), ("D", 7)],
    "D": []
}
```

De A, on peut aller en B pour 4 ou en C pour 2. De C, on rejoint B pour 1, ce qui est mieux que l'arête directe A-B. C'est exactement le genre d'amélioration que la relaxation doit découvrir.

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

`dist` contient les distances provisoires, qui deviennent ensuite définitives. `visites` contient les sommets déjà validés. Le `min` cherche le sommet non visité de plus petite distance : c'est l'implémentation la plus simple, qui demande $O(n^2)$ comparaisons sur un graphe à $n$ sommets. Une file de priorité serait plus efficace sur un graphe qui a peu d'arêtes, mais le résultat serait le même. `pred[voisin] = courant` mémorise par quelle arête la meilleure distance connue a été obtenue.

## Reconstruire le chemin

`dist` donne la longueur du plus court chemin, et `pred` indique par où il passe. Pour reconstruire le chemin vers une cible, on part de la cible et on suit les prédécesseurs jusqu'à la source, dont le prédécesseur vaut `None`. On obtient ainsi le chemin à l'envers, qu'il suffit d'inverser. Si une distance reste infinie, le sommet n'est pas accessible depuis la source, et il n'y a pas de chemin à reconstruire.

## Exercices

1. Appliquer Dijkstra au graphe d'exemple depuis `A`.
2. Donner la distance minimale de `A` vers `D`.
3. Reconstituer le chemin complet.
4. Expliquer pourquoi l'algorithme échoue avec des poids négatifs.
