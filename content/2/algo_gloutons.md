---
title: Algorithmes Gloutons
description: >-
  Introduction aux stratégies d'optimisation gloutonnes (Rendu de monnaie, Sac à
  dos)
level: premiere
chapter: Algorithmique
icon: "\U0001F36A"
badgeId: premiere_introduction_gloutons
prerequisites:
  - activite_algo_interactive
audience: public
---

# Algorithmes gloutons

Un algorithme **glouton** prend, à chaque étape, le choix qui paraît le meilleur **maintenant**, et il ne revient pas dessus. Il est simple à écrire et souvent rapide. Il ne garantit pas la meilleure solution globale. Un alpiniste qui grimpe toujours la pente la plus raide devant lui atteint un sommet. Rien ne dit que c'est le plus haut de la chaîne : un col plus bas, un peu à côté, menait plus haut.

Le travail de ce chapitre est double. Savoir appliquer le geste. Savoir reconnaître un **contre-exemple**, c'est-à-dire un cas où ce geste rate l'optimum.

!!! quote "Analogie"
    Un alpiniste qui grimpe toujours la pente la plus raide peut atteindre un pic local, pas forcément le plus haut sommet de la chaîne.

## Rendre la monnaie

On veut rendre une somme avec le **moins de pièces** possible. La stratégie gloutonne est : tant qu'il reste quelque chose à rendre, prendre la plus grande pièce qui ne dépasse pas le reste, la poser, diminuer le montant.

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

Le système est parcouru du plus grand au plus petit. Pour 49 euros, 50 est trop grand. On pose deux billets de 20, il reste 9. Une pièce de 5, il reste 4. Deux pièces de 2. Quatre pièces et un billet, et c'est optimal. Avec les pièces et billets de l'euro, ce glouton est **toujours** optimal. On dit que le système est **canonique**.

Ce n'est pas vrai de tous les systèmes. Avec les pièces `{1, 3, 4}` et un montant de **6** :

| Stratégie | Pièces | Nombre |
| :--- | :--- | :---: |
| Glouton | 4 + 1 + 1 | **3** |
| Optimal | 3 + 3 | **2** |

Le glouton prend 4 parce que c'est la plus grosse pièce qui tient. Il lui reste 2, qu'il ne peut faire qu'avec deux pièces de 1. Deux pièces de 3 auraient suffi. Le choix local a fermé la porte au meilleur total.

## Remplir un sac

On dispose d'une capacité, par exemple 15 kg, et d'objets qui ont un poids et une valeur. On veut la plus grande valeur sans dépasser le poids. Plusieurs « meilleurs choix » sont possibles, et ils ne donnent pas le même sac.

1. Le plus précieux d'abord. Risque : un objet lourd bloque la capacité.
2. Le plus léger d'abord. Risque : on remplit avec ce qui vaut peu.
3. Le meilleur rapport valeur / poids. C'est souvent le plus raisonnable, et ce n'est toujours pas une garantie.

Capacité : 15 kg.

| Objet | Poids (kg) | Valeur (€) | Rapport V/P |
| :--- | :---: | :---: | :---: |
| A | 12 | 100 | 8,3 |
| B | 4 | 40 | 10 |
| C | 4 | 40 | 10 |
| D | 4 | 40 | 10 |

Le glouton qui prend d'abord la plus grande valeur choisit A, 100 euros, et il reste 3 kg. Plus rien ne rentre. Total : **100 €**. B, C et D pèsent 12 kg ensemble et valent **120 €**. Le glouton a donné une réponse rapide, pas la meilleure. Le rapport valeur / poids, ici, aurait pris B, C et D d'abord, et aurait trouvé l'optimum. Sur un autre sac, ce rapport-là rate aussi. On le verra en exercice. Aucun de ces trois critères n'est une preuve.

## Choisir des tâches qui ne se chevauchent pas

Des tâches ont une heure de début et une heure de fin. On ne peut en faire qu'une à la fois. On veut le plus grand **nombre** de tâches compatibles, pas la plus longue durée.

La stratégie qui marche : trier par **heure de fin croissante**, prendre la première, puis prendre chaque suivante qui commence après la fin de la dernière choisie. Pour ce critère, le glouton est optimal. Choisir d'abord la tâche la plus longue, ou celle qui commence le plus tôt, peut laisser un trou et rater deux tâches courtes qui tenaient à la place.

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

Pour fermer : un glouton choisit le meilleur local et ne regrette pas. C'est simple. Ce n'est optimal que pour certains problèmes : la monnaie canonique de l'euro, les tâches triées par fin. Ailleurs, un contre-exemple suffit à le dire. Ceux à connaître sont la monnaie `{1, 3, 4}` pour un montant de 6, et le sac où A vaut 100 mais où B, C et D ensemble valent plus. La question à se poser à chaque nouvel énoncé : existe-t-il un cas où ce choix immédiat rate mieux ?

## Pour s'entraîner

1. Avec les pièces `{1, 5, 6}`, rendre 10 en glouton, puis chercher une meilleure combinaison.
2. Inventer un petit sac à dos (3 objets) où le glouton « rapport V/P » échoue.
3. Relire le code de planification et tester avec 4 tâches qui se chevauchent.
