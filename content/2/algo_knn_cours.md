---
title: Algorithme des K Plus Proches Voisins
description: >-
  Comprendre l'algorithme KNN, son fonctionnement, la distance euclidienne et
  ses applications en classification et régression.
level: premiere
chapter: Algorithmique
icon: "\U0001F9E0"
badgeId: premiere_cours
prerequisites: []
---

## Objectifs

- Comprendre l'idée « un objet ressemble à ses voisins »
- Calculer une distance entre deux points (formule et code Python)
- Classer un nouvel élément en regardant ses $K$ voisins
- Choisir $K$ de façon raisonnable, sans jargon inutile

## Idée clé

Pour classer un nouvel élément, on regarde les **$K$ exemples déjà connus les plus proches**, puis on suit la majorité (ou on moyenne leurs valeurs). Pas de formule magique : proximité = similarité.

## À quoi ça sert ?

On part d'exemples **déjà étiquetés** (on connaît la bonne réponse) :

- **Classification** : prédire une catégorie (spam / pas spam, pomme / orange)
- **Régression** : prédire un nombre (prix d'une maison)

Principe : des éléments proches dans l'espace des données ont tendance à partager la même étiquette.

## Les 4 étapes

1. Choisir $K$ (nombre de voisins à consulter)
2. Calculer la distance entre le nouvel élément et **tous** les exemples connus
3. Garder les $K$ plus proches
4. Décider :
   - classification → **vote majoritaire**
   - régression → **moyenne** des valeurs

!!! example "Exemple"
    Points de classes **A** et **B**, point inconnu **X**, $K = 3$.
    Si parmi les 3 plus proches on a 2 A et 1 B → on classe X comme **A**.

## Mesurer la distance

En Première, on utilise surtout la **distance euclidienne** (la « règle » du plan) :

$$
d(P, Q) = \sqrt{(p_1-q_1)^2 + (p_2-q_2)^2 + \cdots + (p_n-q_n)^2}
$$

En 2D, avec Python :

```python
import math

def distance_euclidienne(p1, p2):
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)
```

!!! warning "Échelles différentes"
    Si une coordonnée va de 0 à 100 et une autre de 0 à 100 000, la seconde **écrase** la distance.
    Avant de comparer, on met souvent les valeurs sur une même échelle (par exemple entre 0 et 1).

## Choisir K

| Valeur de K | Effet |
| :--- | :--- |
| **K petit** (ex. $K=1$) | Très sensible aux points aberrants : un voisin « bizarre » peut décider seul |
| **K grand** | Plus stable, mais on peut mélanger des voisins trop éloignés ; à l'extrême, c'est toujours la classe la plus fréquente globalement qui gagne |

Conseils simples :

- Pas de $K$ universel : on teste quelques valeurs sur des exemples connus
- Pour 2 classes, un $K$ **impair** évite les égalités au vote (2 contre 2)

## Forces et limites

**Forces**

- Simple à comprendre et à coder
- Aucune hypothèse forte sur la forme des données
- Classifie et estime des valeurs numériques

**Limites**

- Pour chaque nouveau point, il faut calculer la distance avec **tous** les exemples → lent si beaucoup de données
- Il faut stocker tout le jeu d'exemples
- Sensible à l'échelle des coordonnées

## Piège fréquent

Confondre « proche » avec « même classe » sans calculer réellement les distances, ou prendre $K=1$ sans vérifier : un seul point bruité fausse alors toute la prédiction.

## À retenir

- KNN : classer grâce aux **$K$ voisins les plus proches**
- Distance usuelle : **euclidienne**
- Classification = vote ; régression = moyenne
- $K$ trop petit → sensible au bruit ; $K$ trop grand → décision trop « floue »
- Les coordonnées doivent être **comparables** (même ordre de grandeur)
- Méthode simple, mais coûteuse si le jeu d'exemples est très grand

## Pour s'entraîner

Mettre en pratique sur des jeux de données concrets : [TP KNN](/cours/2/algo_knn) et [exercices KNN](/cours/2/algo_knn_exercices).
