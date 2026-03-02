---
title: "Listes : Tournoi E-Sport"
description: "Gérer les scores et le classement d'un tournoi de jeu vidéo."
level: premiere
chapter: "Projets"
icon: "🏆"
badgeId: "premiere_projet_esport"
---

# 🏆 Projet - Gestionnaire de Tournoi E-Sport

Dans ce projet, nous allons créer un outil pour gérer les scores d'une compétition (type League of Legends, Rocket League ou Valorant). Nous utiliserons les **listes** pour stocker les équipes et les scores, et nous apprendrons à les manipuler.

## 1. Cahier des Charges

Le programme doit permettre de :
1.  Enregistrer une liste de noms d'équipes.
2.  Saisir les scores de chaque équipe pour une manche donnée.
3.  Calculer la moyenne des scores.
4.  Trouver l'équipe gagnante (score maximal).
5.  Afficher le classement final.

## 2. Étapes de réalisation

### Étape 1 : Inscription des équipes
Créez une liste vide `equipes`.
Utilisez une boucle `while` ou `for` pour demander à l'utilisateur de saisir les noms des équipes. Arrêtez la saisie quand l'utilisateur tape "fin".

```python
equipes = []
# ... boucle de saisie ...
```

### Étape 2 : Saisie des scores
Une fois les équipes connues, nous devons saisir un score pour chacune.
Nous pouvons utiliser une deuxième liste `scores` de même taille, où `scores[i]` correspondra aux points de l'équipe `equipes[i]`.

Parcourez la liste des équipes et demandez le score pour chacune.

### Étape 3 : Analyse des données
*   **Moyenne** : Somme des éléments de `scores` divisée par la longueur de la liste.
*   **Vainqueur** : Il faut trouver l'indice de la valeur maximale dans `scores` pour retrouver le nom correspondant dans `equipes`.
    *   *Astuce* : On peut utiliser une boucle qui parcourt les indices `range(len(scores))`.

### Étape 4 : Affichage du Podium
Affichez les résultats de manière propre.

## 3. Pour aller plus loin (Bonus) 🚀

*   **Liste de Tuples** : Au lieu de deux listes séparées, utilisez une seule liste contenant des tuples `(nom, score)`. Ex: `[("T1", 15), ("G2", 12)]`. Cela rend le tri plus facile !
*   **Tri automatique** : Utilisez `.sort()` ou `sorted()` pour afficher le classement du premier au dernier.
*   **Élimination** : Supprimez les équipes ayant un score inférieur à une certaine valeur (fonction `.pop()` ou création d'une nouvelle liste filtrée).

---

<ExerciseTabs courseId="premiere_projet_esport" courseTitle="Gestion Tournoi">
  <ExerciseSection id="proj-esport-1" label="À vous de jouer !">
    <Enonce>
    À vous de coder ! Suivez les étapes ci-dessus pour réaliser votre propre gestionnaire de tournoi.
    Commencez simple, puis essayez d'ajouter des fonctionnalités bonus.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>
