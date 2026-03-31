---
title: TP KNN
description: >-
  Travaux pratiques pour implémenter l'algorithme KNN sur des cas concrets
  (Fruits, Iris, Spam).
level: premiere
chapter: Algorithmique
icon: "\U0001F3AF"
badgeId: premiere_tp_knn
prerequisites:
  - algo_tris
---


# Travaux Pratiques : Algorithme des K Plus Proches Voisins (KNN)

## Objectif

L'objectif de ce TP est de mettre en pratique l'algorithme des K Plus Proches Voisins (KNN) sur de petits ensembles de données, en partant de zéro.

## Exercice 1 : Douceur d'un fruit

### Contexte

Nous avons des données sur des fruits, caractérisés par leur **douceur** (1 à 10) et leur **acidité** (1 à 10). Nous voulons prédire si un nouveau fruit est une "Pomme" ou une "Orange".

**Données d'entraînement :**

| Fruit | Douceur | Acidité | Type |
| :--- | :---: | :---: | :--- |
| Fruit 1 | 7 | 3 | Pomme |
| Fruit 2 | 8 | 2 | Pomme |
| Fruit 3 | 3 | 7 | Orange |
| Fruit 4 | 4 | 8 | Orange |
| Fruit 5 | 6 | 4 | Pomme |
| Fruit 6 | 2 | 6 | Orange |

**Nouveau fruit à classifier :** Fruit X (Douceur = 5, Acidité = 5)

!!! tip "À réaliser"
    1.  **Représenter les données** :
        Créer une liste de dictionnaires pour stocker les données d'entraînement.
    
    2.  **Calculer la distance euclidienne** :
        Écrire une fonction `distance_euclidienne(point1, point2)` qui prend deux points (chacun étant un tuple ou une liste de coordonnées `[douceur, acidite]`) et retourne leur distance.
        *Rappel : $d = \sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$*
    
    3.  **Trouver les K voisins** :
        Écrire une fonction `trouver_voisins(donnees, point_test, k)` qui :
        *   Calcule la distance entre `point_test` et chaque point dans `donnees`.
        *   Stocke ces distances avec les types de fruits.
        *   Trie les voisins par distance croissante.
        *   Retourne les `k` premiers voisins.
    
    4.  **Prédire la classe** :
        Écrire une fonction `predire_classe(voisins)` qui retourne la classe majoritaire.
    
    5.  **Mettre tout ensemble** :
        Prédire la classe du **Fruit X** avec **K=3**.

## Exercice 2 : Classification de fleurs Iris (simplifié)

### Contexte

Nous allons appliquer KNN à un ensemble simplifié de fleurs Iris, caractérisées par la longueur de leurs sépales et pétales.
Types : **Setosa** et **Versicolor**.

**Données d'entraînement :**

| Fleur | Longueur Sépale | Longueur Pétale | Type |
| :--- | :---: | :---: | :--- |
| Fleur A | 5.1 | 1.4 | Setosa |
| Fleur B | 4.9 | 1.4 | Setosa |
| Fleur C | 6.0 | 5.1 | Versicolor |
| Fleur D | 5.5 | 4.0 | Versicolor |
| Fleur E | 5.2 | 1.5 | Setosa |
| Fleur F | 6.3 | 4.8 | Versicolor |

**Nouvelle fleur :** Fleur Y (Sépale = 5.8, Pétale = 3.5)

!!! tip "À réaliser"
    1.  **Représenter les données** : Liste de dictionnaires.
    2.  **Calculer la distance** : Réutiliser votre fonction (avec `[longueur_sepale, longueur_petale]`).
    3.  **Trouver les K voisins** : Trouver les voisins de la Fleur Y.
    4.  **Prédire** : Prédire la classe de la **Fleur Y** avec **K=5**.

## Exercice 3 : Détection de spam (conceptuel)

### Contexte

Système simplifié de détection de spam.
Mesures : **Nombre de mots clés suspects** et **Longueur de l'email** (échelle 1-10).

**Données :**

| Email | Mots clés | Longueur | Type |
| :--- | :---: | :---: | :--- |
| Email 1 | 8 | 9 | Spam |
| Email 2 | 2 | 3 | Non-Spam |
| Email 3 | 7 | 8 | Spam |
| Email 4 | 1 | 2 | Non-Spam |
| Email 5 | 9 | 7 | Spam |
| Email 6 | 3 | 4 | Non-Spam |

**Nouvel email :** Email Z (Mots clés = 6, Longueur = 6)

!!! tip "À réaliser"
    1.  Représenter les données.
    2.  Utiliser vos fonctions KNN pour prédire la classe de l'**Email Z** avec **K=3**.
