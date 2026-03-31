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


# Algorithme des K Plus Proches Voisins (KNN)

## 1. Introduction

!!! info "Qu'est-ce que l'algorithme KNN ?"
    L'algorithme des **K Plus Proches Voisins** (K-Nearest Neighbors ou **KNN**) est une méthode d'**apprentissage supervisé** simple et intuitive, utilisée principalement pour des problèmes de :
    
    *   **Classification** : Prédire à quelle catégorie appartient un nouvel élément (ex: email spam ou non).
    *   **Régression** : Prédire une valeur continue pour un nouvel élément (ex: estimer le prix d'une maison).

### Concepts clés

*   **Apprentissage supervisé** : L'algorithme apprend à partir d'un ensemble de données où les "bonnes réponses" (étiquettes ou valeurs) sont déjà connues.
*   **Principe fondamental** : Des éléments similaires ont tendance à se trouver à proximité les uns des autres. Un nouvel élément sera probablement similaire à ses voisins les plus proches dans l'espace des données.

## 2. Fonctionnement de l'algorithme

L'algorithme suit une procédure simple en 4 étapes :

1.  **Choisir le nombre K** : On définit $K$, le nombre de voisins les plus proches à considérer. C'est un hyperparamètre du modèle.
2.  **Calculer les distances** : Pour un nouvel élément à classer, on calcule la distance entre cet élément et **tous** les autres éléments de l'ensemble d'entraînement.
3.  **Identifier les K voisins** : On sélectionne les $K$ éléments de l'ensemble d'entraînement qui ont la distance la plus faible avec le nouvel élément.
4.  **Prendre une décision** :
    *   **Classification** : On attribue la classe majoritaire parmi les $K$ voisins.
    *   **Régression** : On calcule la moyenne des valeurs des $K$ voisins.

!!! example "Exemple simple de classification"
    Imaginons des points de deux catégories (**A** et **B**) et un point inconnu **X**. Si nous choisissons $K=3$ :
    
    1.  On calcule la distance entre X et tous les autres points.
    2.  On trouve les 3 points les plus proches de X.
    3.  Si 2 voisins sont **A** et 1 voisin est **B**, alors X sera classifié comme **A** (majorité).

## 3. La mesure de distance

La mesure de distance la plus couramment utilisée est la **distance euclidienne**.

!!! abstract "Distance Euclidienne"
    Pour deux points $P(p_1, p_2, ..., p_n)$ et $Q(q_1, q_2, ..., q_n)$ dans un espace à $n$ dimensions, la distance euclidienne est donnée par la formule :
    
    $$ d(P, Q) = \sqrt{(p_1-q_1)^2 + (p_2-q_2)^2 + ... + (p_n-q_n)^2} $$

En Python, pour deux points en 2D $(x_1, y_1)$ et $(x_2, y_2)$ :
```python
import math

def distance_euclidienne(p1, p2):
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)
```

!!! warning "Attention : Normalisation des données"
    Si les caractéristiques (dimensions) ont des échelles très différentes (ex: âge 0-100 vs salaire 0-100000), celles avec de grandes valeurs domineront le calcul de la distance.
    
    Il est donc **crucial de normaliser** les données (les mettre sur une même échelle, souvent entre 0 et 1) avant d'appliquer KNN.

## 4. Choisir la valeur de K

Le choix de $K$ est déterminant pour la performance du modèle.

| Valeur de K | Effet sur le modèle |
| :--- | :--- |
| **K petit (ex: K=1)** | Très sensible au bruit et aux points aberrants. Risque de **surapprentissage** (overfitting). Les frontières de décision sont très morcelées. |
| **K grand** | Plus robuste au bruit, mais les frontières de décision deviennent trop lisses. Risque de sous-apprentissage. Si $K$ est trop grand, la classe majoritaire globale l'emporte toujours. |

!!! tip "Conseils pratiques"
    *   Il n'y a pas de "meilleur" $K$ universel. On utilise souvent la **validation croisée** pour le trouver.
    *   Pour une classification binaire (2 classes), on choisit souvent un $K$ **impair** pour éviter les égalités lors du vote majoritaire.

## 5. Avantages et Inconvénients

=== "✅ Avantages"
    *   **Simple** à comprendre et à implémenter.
    *   **Non paramétrique** : Ne suppose aucune distribution spécifique des données (comme la loi normale).
    *   **Polyvalent** : Fonctionne pour la classification et la régression.
    *   **Apprentissage paresseux (Lazy learning)** : Pas de phase d'entraînement coûteuse (le modèle stocke juste les données). L'ajout de nouvelles données est instantané.

=== "❌ Inconvénients"
    *   **Coûteux en prédiction** : Pour chaque nouveau point, il faut calculer la distance avec **tous** les points d'entraînement. Lent sur de gros datasets.
    *   **Gourmand en mémoire** : Doit stocker tout le dataset.
    *   **Sensible à la dimensionnalité** : La performance se dégrade quand le nombre de dimensions augmente ("fléau de la dimensionnalité").
    *   **Sensible à l'échelle** : Nécessite une normalisation rigoureuse des données.
