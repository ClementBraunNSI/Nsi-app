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
---

## Objectifs

- Comprendre le principe « meilleur choix local à chaque étape »
- Appliquer une stratégie gloutonne au rendu de monnaie, au sac à dos et à la planification de tâches
- Savoir qu'un glouton n'est **pas toujours** optimal — et reconnaître un contre-exemple

## Idée clé

Un algorithme **glouton** prend, à chaque étape, le choix qui paraît le meilleur **maintenant**, sans revenir en arrière. Simple et rapide… mais ce n'est pas toujours la meilleure solution globale.

!!! quote "Analogie"
    Un alpiniste qui grimpe toujours la pente la plus raide peut atteindre un pic local, pas forcément le plus haut sommet de la chaîne.

## Rendu de monnaie

**Problème :** rendre une somme avec le **minimum** de pièces (ou billets).

**Stratégie gloutonne :**

1. Prendre la plus grande pièce ≤ montant restant
2. L'ajouter au rendu, diminuer le montant
3. Recommencer jusqu'à zéro

Avec le système euro (`1, 2, 5, 10, 20, 50…`), le glouton est **toujours** optimal : on dit que le système est **canonique**.

### Contre-exemple (système non canonique)

Pièces `{1, 3, 4}`, montant **6** :

| Stratégie | Pièces | Nombre |
| :--- | :--- | :---: |
| Glouton | 4 + 1 + 1 | **3** |
| Optimal | 3 + 3 | **2** |

Le glouton prend d'abord 4 (le « meilleur » local) et rate la solution à 2 pièces.

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

## Sac à dos

**Problème :** capacité max (ex. 15 kg), objets avec **poids** et **valeur**. Maximiser la valeur sans dépasser le poids.

Plusieurs critères gloutons possibles :

1. Plus précieux d'abord (risque : objets lourds)
2. Plus légers d'abord (risque : faible valeur)
3. Meilleur rapport valeur / poids (souvent le plus raisonnable)

### Contre-exemple

Capacité : 15 kg.

| Objet | Poids (kg) | Valeur (€) | Rapport V/P |
| :--- | :---: | :---: | :---: |
| A | 12 | 100 | 8,3 |
| B | 4 | 40 | 10 |
| C | 4 | 40 | 10 |
| D | 4 | 40 | 10 |

- **Glouton (valeur max)** : prend A → 100 €, reste 3 kg, plus rien ne rentre → **100 €**
- **Optimal** : B + C + D → **120 €**

Le glouton donne une approximation rapide, pas une garantie d'optimum.

## Planification de tâches

**Problème :** tâches avec début et fin, une seule à la fois. Maximiser le **nombre** de tâches compatibles.

**Stratégie efficace :** toujours choisir la tâche qui **se termine le plus tôt** parmi celles encore possibles.

1. Trier les tâches par **heure de fin croissante**
2. Prendre la première
3. Ajouter chaque suivante si elle commence après la fin de la dernière choisie

Pour ce critère précis, le glouton est optimal. Choisir d'abord la tâche la plus longue, ou celle qui commence le plus tôt, peut au contraire être sous-optimal.

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

## Piège fréquent

Croire que « glouton » = « toujours optimal ». C'est vrai pour certains problèmes (euro, tâches triées par fin), **faux** pour d'autres (monnaie non canonique, sac à dos). Toujours se demander : *existe-t-il un contre-exemple ?*

## À retenir

- Glouton = meilleur choix **local** à chaque étape, sans regret
- Avantage : simple et souvent rapide
- Inconvénient : pas toujours la solution globale optimale
- Les **contre-exemples** (monnaie `{1,3,4}`, sac à dos A vs BCD) sont essentiels
- Pour les tâches, trier par **fin croissante** est la bonne heuristique
- Un système monétaire **canonique** rend le glouton optimal

## Pour s'entraîner

1. Avec les pièces `{1, 5, 6}`, rendre 10 en glouton, puis chercher une meilleure combinaison.
2. Inventer un petit sac à dos (3 objets) où le glouton « rapport V/P » échoue.
3. Relire le code de planification et tester avec 4 tâches qui se chevauchent.
