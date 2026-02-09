---
title: "Structures de données linéaires"
description: "Maîtrisez les listes et tuples en Python pour organiser vos données efficacement"
level: premiere
chapter: "Structures de données linéaires"
icon: "🔗"
badgeId: "premiere_cours"
---


# Structures de données linéaires

## Définition Fondamentale

Une **structure de données linéaire** est une collection d'**éléments** stockés séquentiellement. En Python, les deux principales implémentations de tableaux sont les **listes** (mutables) et les **tuples** (immuables).

*   **Organisation séquentielle** : Les éléments sont stockés dans un ordre spécifique, chaque élément ayant une position unique (indice).
*   **Accès par indice** : Chaque élément est accessible via son indice, permettant un accès direct et rapide aux données.
*   **Stockage efficace** : Évite la création de variables distinctes pour chaque élément, optimisant l'utilisation de la mémoire.

!!! warning "Important"
    En Python, comme dans la plupart des langages, les indices commencent à **0**.

## Tuples vs Listes

### Tuples (Immuables)

*   **Syntaxe :** `()`
*   **Caractéristique :** Non modifiables après création
*   **Usage :** Données fixes, coordonnées, configurations

```python
# Tuple vide
mon_tuple_vide = ()

# Tuple avec valeurs
mon_tuple = (312, 354, 1234)
coordonnees = (10.5, 20.3)
```

### Listes (Mutables)

*   **Syntaxe :** `[]`
*   **Caractéristique :** Modifiables après création
*   **Usage :** Collections dynamiques, données évolutives

```python
# Liste vide
ma_liste_vide = []

# Liste avec valeurs
ma_liste = [312, 354, 1234]
notes = [14, 15, 20, 19]
```

### Exemple de tableau d'indices

| Indice | Élément | Type |
| :--- | :--- | :--- |
| 0 | 312 | Premier élément |
| 1 | 354 | Deuxième élément |
| 2 | 1234 | Troisième élément |

!!! tip "Conseil"
    Privilégiez des tableaux contenant des données de même type pour éviter les erreurs et améliorer la lisibilité.

## Accès et Manipulation

### Taille d'un tableau

La fonction `len()` permet d'obtenir la longueur d'un tableau, identique au fonctionnement avec les chaînes de caractères.

```python
tableau_animaux = ("chien", "chat", "oiseau", "poisson")
print(len(tableau_animaux))  # Affiche: 4
```

### Accès par indice

Utilisez la syntaxe `tableau[indice]` pour accéder à un élément spécifique.

```python
animaux = ["chien", "chat", "poisson", "vache"]
print(animaux[0])  # "chien"
print(animaux[3])  # "vache"
```

### Parcours avec boucles

Utilisez les boucles `for` et `while` pour parcourir tous les éléments.

```python
# Avec for et range
for i in range(len(tableau)):
    print(tableau[i])

# Avec for et in
for element in tableau:
    print(element)
```

### Concaténation

L'opérateur `+` permet de fusionner plusieurs tableaux.

```python
tableau_1 = (1, 2, 3)
tableau_2 = (4, 5, 6)
tableau_3 = tableau_1 + tableau_2
# Résultat: (1, 2, 3, 4, 5, 6)
```

## Manipulation des Listes

Les listes permettent d'ajouter, supprimer et modifier des éléments après leur création, offrant une flexibilité essentielle pour les données dynamiques.

### Ajout d'éléments

**Méthode `append()`** : Ajoute un élément à la fin de la liste. Modifie la liste en place.

```python
multiples_de_2 = []
for i in range(0, 11):
    multiples_de_2.append(i * 2)
# Résultat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
```

**Concaténation** : Utilise l'opérateur `+` mais crée une nouvelle liste à chaque opération (moins efficace).

```python
multiples_de_2 = []
for i in range(0, 11):
    multiples_de_2 = multiples_de_2 + [i * 2]
```

### Suppression d'éléments

**Méthode `pop()`** :
*   `pop(i)` : retire l'élément à l'indice `i`
*   `pop()` : retire le dernier élément

```python
tableau = [1, 2, 3, 4]
print(tableau.pop(1))  # Affiche: 2
print(tableau.pop())   # Affiche: 4
print(tableau)         # Affiche: [1, 3]
```

**Méthode `remove()`** : Retire la première occurrence de l'élément spécifié.

```python
tableau = [1, 2, 2, 3, 4, 4]
tableau.remove(2)
print(tableau)  # Affiche: [1, 2, 3, 4, 4]
```

## Techniques Avancées

### Compréhension de liste

Technique permettant de créer des listes de manière concise et élégante, en une seule ligne de code.

```python
# Syntaxe générale
# [expression for element in iterable]
# [expression for element in iterable if condition]

# Exemple: multiples de 3
multiples_de_3 = [i * 3 for i in range(0, 11)]
# Résultat: [0, 3, 6, 9, 12, 15, 18, 21, 24, 27, 30]

# Avec condition: nombres pairs
pairs = [i for i in range(20) if i % 2 == 0]
# Résultat: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

**Avantages :**
*   Code plus concis et lisible
*   Performance optimisée
*   Syntaxe proche des mathématiques

!!! tip "Conseil"
    La compréhension de liste est idéale pour les transformations simples. Pour des logiques complexes, préférez les boucles traditionnelles pour maintenir la lisibilité.
