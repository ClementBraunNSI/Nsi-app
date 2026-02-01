---
title: Algorithmes de Tri
description: Étude des algorithmes de tri par comparaison (sélection, insertion) et sans comparaison (dénombrement)
level: Première
chapter: 7
icon: sort-numeric-ascending
---

# Algorithmes sur les Tableaux : Optimisation du Tri

## Définitions et Problématiques

### Qu'est-ce que trier ?

Trier consiste à organiser un ensemble d'éléments dans un ordre précis (généralement croissant ou décroissant). C'est une opération fondamentale en informatique.

Pourquoi trier ?
*   **Classement de Données** : Organisation et structuration des informations pour faciliter leur consultation.
*   **Préparation Algorithmique** : Certains algorithmes (comme la recherche dichotomique) nécessitent des données ordonnées.
*   **Optimisation des Performances** : Amélioration de la recherche et de l'accès aux données.

Il existe deux grandes familles de stratégies :
1.  **Par comparaison :** on compare les éléments entre eux (ex: Sélection, Insertion).
2.  **Sans comparaison :** on utilise des propriétés spécifiques des données (ex: Dénombrement).

---

## Tri par Sélection

### Principe de Fonctionnement

Le tri par sélection consiste à rechercher le plus petit élément de la partie non triée de la liste et à l'échanger avec le premier élément de cette partie.

À chaque étape :
1.  On cherche la valeur la plus petite de la zone non triée.
2.  On place cette valeur au début de la zone non triée (échange).
3.  On étend la zone triée d'un élément.
4.  On répète jusqu'à ce que toute la liste soit triée.

### Exemple Illustratif

Liste initiale : `[5, 2, 4, 6, 1, 3]`

| Étapes | Liste en cours | Min sélectionné | Action |
| :--- | :--- | :---: | :--- |
| Début | `[5, 2, 4, 6, 1, 3]` | 1 | Échange 1 et 5 |
| Étape 1 | `[1, 2, 4, 6, 5, 3]` | 2 | Déjà bien placé |
| Étape 2 | `[1, 2, 4, 6, 5, 3]` | 3 | Échange 3 et 4 |
| Étape 3 | `[1, 2, 3, 6, 5, 4]` | 4 | Échange 4 et 6 |
| Étape 4 | `[1, 2, 3, 4, 5, 6]` | 5 | Échange 5 et 6 |
| Final | `[1, 2, 3, 4, 5, 6]` | - | Liste triée |

### Implémentation en Python

Pour implémenter ce tri, nous allons décomposer le problème en plusieurs fonctions.

!!! example "Exercice : Indice du minimum"
    Écrire une fonction `indice_minimum_tranche(liste, debut)` qui renvoie l'indice de la valeur la plus petite dans la tranche commençant à l'indice `debut`.
    
    ```python
    def indice_minimum_tranche(liste, debut):
        # Votre code ici
        pass

    # Exemple
    # liste = [1, 5, 2, 4, 0, 8]
    # indice_minimum_tranche(liste, 1) -> renvoie 4 (car 0 est à l'indice 4)
    ```

!!! example "Exercice : Échange de valeurs"
    Écrire une fonction `echange_valeur(liste, i, j)` qui échange les valeurs aux indices `i` et `j`.
    
    ```python
    def echange_valeur(liste, i, j):
        # Votre code ici
        pass
    ```

!!! example "Exercice : Tri par sélection complet"
    En utilisant les fonctions précédentes, écrire la fonction `tri_selection(liste)` qui trie la liste en place (ou renvoie une nouvelle liste triée selon la consigne).
    
    ```python
    def tri_selection(liste):
        # Votre code ici
        pass
    ```

---

## Tri par Insertion

### Principe de Fonctionnement

Le tri par insertion fonctionne comme le tri d'un jeu de cartes dans une main. On considère une partie triée (au début) et on insère les éléments suivants un par un à leur bonne place dans cette partie triée.

À chaque étape :
1.  On prend l'élément suivant de la zone non triée.
2.  On l'insère à sa place correcte dans la zone triée (en décalant les autres si nécessaire).
3.  On répète jusqu'à la fin de la liste.

### Exemple Illustratif

Liste initiale : `[5, 2, 4, 6, 1, 3]`

| Étapes | Liste en cours | Élément traité | Action |
| :--- | :--- | :---: | :--- |
| Début | `[5, 2, 4, 6, 1, 3]` | - | 5 est "trié" seul |
| Étape 1 | `[2, 5, 4, 6, 1, 3]` | 2 | Inséré devant 5 |
| Étape 2 | `[2, 4, 5, 6, 1, 3]` | 4 | Inséré entre 2 et 5 |
| Étape 3 | `[2, 4, 5, 6, 1, 3]` | 6 | Reste à sa place |
| Étape 4 | `[1, 2, 4, 5, 6, 3]` | 1 | Inséré au début |
| Étape 5 | `[1, 2, 3, 4, 5, 6]` | 3 | Inséré entre 2 et 4 |

### Implémentation en Python

!!! example "Exercice : Insertion dans une zone triée"
    Écrire une fonction `insertion_zone_triee(liste, indice)` qui insère la valeur située à `indice` à sa bonne place dans la partie précédente (de 0 à indice-1) supposée triée.
    
    ```python
    def insertion_zone_triee(liste, indice):
        # Votre code ici
        pass
    ```

!!! example "Exercice : Tri par insertion complet"
    Écrire la fonction `tri_insertion(liste)` qui parcourt la liste et appelle la fonction d'insertion pour chaque élément.
    
    ```python
    def tri_insertion(liste):
        # Votre code ici
        pass
    ```

---

## Tris Sans Comparaison : Le Tri par Dénombrement

### Principe

Le tri par dénombrement (Counting Sort) n'utilise pas de comparaisons. Il compte le nombre d'occurrences de chaque valeur, puis reconstruit la liste. Il est très efficace mais ne fonctionne que si les valeurs sont des entiers bornés (ex: notes entre 0 et 20).

### Algorithme

1.  **Création des compteurs** : Créer une liste de taille `max + 1` initialisée à 0.
2.  **Comptage** : Parcourir la liste à trier et incrémenter le compteur correspondant à chaque valeur.
3.  **Reconstruction** : Parcourir la liste des compteurs et ajouter les valeurs dans la liste triée selon leur nombre d'occurrences.

### Exemple

Liste `L = [3, 2, 1, 2]`

1.  **Comptage** :
    *   0: 0 fois
    *   1: 1 fois
    *   2: 2 fois
    *   3: 1 fois
    *   Occurrences : `[0, 1, 2, 1]`

2.  **Reconstruction** :
    *   On met 0 fois la valeur 0.
    *   On met 1 fois la valeur 1 -> `[1]`
    *   On met 2 fois la valeur 2 -> `[1, 2, 2]`
    *   On met 1 fois la valeur 3 -> `[1, 2, 2, 3]`
