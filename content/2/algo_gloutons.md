---
title: Algorithmes Gloutons
description: >-
  Introduction aux stratégies d'optimisation gloutonnes (Rendu de monnaie, Sac à
  dos)
level: premiere
chapter: Algorithmique
icon: "cookie"
badgeId: premiere_introduction_gloutons
prerequisites:
  - activite_algo_interactive
audience: public
---

# Algorithmes gloutons

Un algorithme **glouton** prend, à chaque étape, le choix qui paraît le meilleur **maintenant**, et il ne revient pas dessus. Il est simple à écrire et souvent rapide. En revanche, il ne garantit pas de trouver la meilleure solution globale.

Ce chapitre a deux objectifs : savoir appliquer une stratégie gloutonne, et savoir reconnaître un **contre-exemple**, c'est-à-dire un cas où cette stratégie ne donne pas la solution optimale.

!!! quote "Analogie"
    Un alpiniste qui grimpe toujours la pente la plus raide peut atteindre un sommet qui n'est pas forcément le plus haut de la chaîne.

## Rendre la monnaie

On veut rendre une somme avec le **moins de pièces** possible. La stratégie gloutonne consiste, tant qu'il reste une somme à rendre, à prendre la plus grande pièce qui ne dépasse pas ce reste, puis à diminuer le montant d'autant.

```python
def rendu_monnaie(montant, systeme):
    """systeme : liste de pièces en ordre décroissant."""
    pieces_rendues = []
    for piece in systeme:
        while montant >= piece:
            pieces_rendues.append(piece)
            montant = montant - piece
    return pieces_rendues

systeme_euro = [50, 20, 10, 5, 2, 1]
print(rendu_monnaie(49, systeme_euro))
# [20, 20, 5, 2, 2]
```

Le système est parcouru du plus grand au plus petit. Pour 49 euros, 50 est trop grand. On pose deux billets de 20, il reste 9. On pose ensuite une pièce de 5, il reste 4, puis deux pièces de 2. Cela fait cinq pièces et billets en tout, et on ne peut pas faire moins. Avec les pièces et billets de l'euro, ce glouton est **toujours** optimal. On dit que le système est **canonique**.

Ce n'est pas le cas de tous les systèmes de pièces. Avec les pièces `{1, 3, 4}` et un montant de **6** :

| Stratégie | Pièces | Nombre |
| :--- | :--- | :---: |
| Glouton | 4 + 1 + 1 | **3** |
| Optimal | 3 + 3 | **2** |

Le glouton prend 4 parce que c'est la plus grosse pièce qui tient. Il lui reste 2, qu'il ne peut faire qu'avec deux pièces de 1. Pourtant, deux pièces de 3 auraient suffi : le meilleur choix immédiat a empêché d'obtenir le meilleur total.

## Le problème du sac à dos

On dispose d'une capacité, par exemple 15 kg, et d'objets qui ont un poids et une valeur. On veut obtenir la plus grande valeur sans dépasser le poids autorisé. Plusieurs critères de choix sont possibles, et ils ne donnent pas le même sac.

1. Prendre d'abord l'objet le plus précieux. Un objet lourd risque alors d'occuper presque toute la place.
2. Prendre d'abord l'objet le plus léger. On risque alors de remplir le sac avec des objets de faible valeur.
3. Prendre d'abord l'objet qui a le meilleur rapport valeur / poids. C'est souvent le choix le plus raisonnable, mais il ne garantit toujours pas le meilleur résultat.

Capacité : 15 kg.

| Objet | Poids (kg) | Valeur (€) | Rapport V/P |
| :--- | :---: | :---: | :---: |
| A | 12 | 100 | 8,3 |
| B | 4 | 40 | 10 |
| C | 4 | 40 | 10 |
| D | 4 | 40 | 10 |

Le glouton qui prend d'abord la plus grande valeur choisit A, qui vaut 100 €. Il reste alors 3 kg, et plus aucun objet ne rentre : le total est de **100 €**. Pourtant, B, C et D pèsent ensemble 12 kg et valent **120 €**. Le glouton a donc donné une réponse rapide, mais pas la meilleure. Ici, le critère du rapport valeur / poids aurait choisi B, C et D en premier et trouvé la solution optimale, mais il échoue lui aussi sur d'autres sacs, comme le montreront les exercices. Aucun de ces trois critères ne garantit donc la meilleure solution.

## La planification de tâches

Des tâches ont une heure de début et une heure de fin, et on ne peut en faire qu'une à la fois. On cherche à réaliser le plus grand **nombre** de tâches compatibles, et non à occuper la plus longue durée.

La stratégie efficace consiste à trier les tâches par **heure de fin croissante**, à prendre la première, puis à prendre chaque tâche suivante qui commence après la fin de la dernière tâche choisie. Pour ce problème, le glouton est optimal. Choisir d'abord la tâche la plus longue, ou celle qui commence le plus tôt, peut en revanche faire perdre deux tâches courtes qui auraient pu tenir à sa place.

```python
def planification_taches(taches):
    # taches : liste de (nom, debut, fin)
    taches_triees = sorted(taches, key=lambda x: x[2])

    selection = []
    derniere_fin = 0

    for nom, debut, fin in taches_triees:
        if debut >= derniere_fin:
            selection.append((nom, debut, fin))
            derniere_fin = fin

    return selection
```

`x[2]` est la fin, le troisième élément du triplet. `sorted` ne modifie pas la liste d'origine. `debut >= derniere_fin` autorise une tâche qui commence à l'instant où la précédente finit. On suppose ici que les horaires sont des nombres, et que 0 est avant toutes les fins.

En résumé, un algorithme glouton fait à chaque étape le meilleur choix immédiat, sans jamais revenir en arrière. Il est simple, mais il n'est optimal que pour certains problèmes, comme le rendu de monnaie avec les pièces de l'euro ou la planification de tâches triées par heure de fin. Pour les autres, un seul contre-exemple suffit à montrer qu'il n'est pas optimal. Les contre-exemples à connaître sont les pièces `{1, 3, 4}` pour un montant de 6, et le sac où A vaut 100 € alors que B, C et D ensemble valent plus. Face à un nouveau problème, il faut toujours se demander s'il existe un cas où le choix immédiat empêche de trouver une meilleure solution.

## Pour s'entraîner

1. Avec les pièces `{1, 5, 6}`, rendre 10 en glouton, puis chercher une meilleure combinaison.
2. Inventer un petit sac à dos (3 objets) où le glouton « rapport V/P » échoue.
3. Relire le code de planification et tester avec 4 tâches qui se chevauchent.
