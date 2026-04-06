---
title: "Exercices fondamentaux - Terminale NSI"
description: "Série d'exercices guidés sur les notions clés du programme"
level: TNSI
order: 230
chapter: Entrainement
icon: "🧪"
badgeId: terminale_exercices_fondamentaux
prerequisites:
  - prog_recursivite
  - structures_graphes
  - sql-bases-donnees
---

# Exercices fondamentaux

Cette fiche propose des exercices courts et progressifs pour consolider les notions de Terminale.

## Bloc A - Récursivité

1. Écrire `somme(n)` qui renvoie `1 + 2 + ... + n`.
2. Écrire une fonction récursive qui compte les nœuds d'un arbre binaire.
3. Identifier clairement le cas de base et le cas récursif.

## Bloc B - ABR

1. Rechercher une valeur dans un ABR.
2. Insérer une valeur sans doublon.
3. Donner la complexité dans le meilleur et le pire cas.

## Bloc C - Graphes

1. Réaliser un parcours BFS.
2. Réaliser un parcours DFS itératif.
3. Déterminer un plus court chemin sur un petit graphe pondéré.

## Bloc D - SQL

Tables : `vehicule(id, marque, prix, etat)` et `location(id, vehicule_id, jours)`.

1. Lister les véhicules disponibles.
2. Compter le nombre de locations par véhicule.
3. Trouver les véhicules jamais loués (`LEFT JOIN`).

## Bloc E - Complexité

1. Donner `O(...)` pour une boucle simple, une double boucle et une dichotomie.
2. Comparer deux stratégies (temps / mémoire).
3. Justifier un choix algorithmique en quelques lignes.
