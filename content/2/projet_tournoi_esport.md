---
title: 'Listes : Tournoi E-Sport'
description: Gérer les scores et le classement d'un tournoi de jeu vidéo.
level: premiere
chapter: Projets
icon: "\U0001F3C6"
badgeId: premiere_projet_esport
prerequisites:
  - poo_projet_pokensi
audience: public
---

# 🏆 Projet - Gestionnaire de Tournoi E-Sport

Le but de ce projet est de créer l'outil d'une soirée tournoi (League of Legends, Rocket League, Valorant, ou un jeu du lycée).
Dans ce projet, nous allons inscrire les équipes, saisir un score par équipe, calculer la moyenne, désigner le ou les vainqueurs, puis afficher le classement.

Deux listes parallèles mémorisent les données : `scores[i]` est le score de `equipes[i]`.

## 1. Les équipes 👥

<ExerciseTabs courseId="premiere_projet_esport" courseTitle="Gestion Tournoi">
  <ExerciseSection id="proj-esport-1" label="Inscription" type="python">
    <Enonce>
      Écrivez `inscrire_equipes()`. Elle renvoie la liste des noms.

      Partez de `equipes = []`. Tant que l'utilisateur n'a pas écrit exactement `fin`, demandez `Nom de l'équipe : ` et ajoutez le nom avec `append`. Un nom vide est ignoré : on repose la question. Si `fin` arrive alors que la liste est vide, affichez `Il faut au moins une équipe.` et continuez la saisie.

      Un essai `Lynx`, `Hiboux`, `Renards`, `fin` produit exactement `["Lynx", "Hiboux", "Renards"]`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="proj-esport-2" label="Scores et moyenne" type="lecture">
    <Enonce>
      Écrivez `saisir_scores(equipes)` et `moyenne(scores)`.

      `saisir_scores` parcourt `equipes` et pose une question par nom, par exemple `Score de Hiboux : `. Le score est un entier supérieur ou égal à 0. Un texte qui n'est pas un entier, ou un entier négatif, est redemandé pour cette équipe seulement. La liste renvoyée a la même longueur que `equipes`, dans le même ordre.

      `moyenne` additionne les scores dans une variable `somme` (une boucle, ou `sum`) puis divise par `len(scores)`. La moyenne affichée plus loin est arrondie avec `round(moyenne, 2)`.

      *Attention : `moyenne([])` ne doit pas planter. Renvoyez `0.0` si la liste est vide.*

      Sans saisie, on doit pouvoir tester :

      ```python
      equipes = ["Lynx", "Hiboux", "Renards"]
      scores = [12, 18, 15]
      ```

      `moyenne(scores)` vaut `15.0`. La somme vaut 45, il y a 3 équipes.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="proj-esport-3" label="Vainqueur" type="lecture">
    <Enonce>
      Écrivez `vainqueurs(equipes, scores)`. Elle renvoie les noms des équipes dont le score est égal au maximum.

      Parcourez les indices avec `range(len(scores))`. Repérez d'abord le score maximal, puis collectez tous les noms qui l'atteignent.

      `[12, 18, 15]` donne `["Hiboux"]`. `[10, 14, 14]` donne `["Hiboux", "Renards"]`.

      L'affichage met `Vainqueur :` au singulier s'il n'y en a qu'un, et `Vainqueurs :` suivi des noms séparés par une virgule et une espace s'il y en a plusieurs.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="proj-esport-4" label="Classement" type="python">
    <Enonce>
      Écrivez `classement(equipes, scores)`.

      Construisez une liste de tuples `(nom, score)`. Triez-la par score décroissant. À score égal, l'équipe inscrite en premier reste devant : un tri stable, ou une boucle qui insère chaque équipe au bon endroit, conviennent.

      Sur `[12, 18, 15]`, le classement est `[("Hiboux", 18), ("Renards", 15), ("Lynx", 12)]`.

      Sur `[10, 14, 14]`, il vaut `[("Hiboux", 14), ("Renards", 14), ("Lynx", 10)]`. Hiboux reste devant Renards, parce qu'il a été inscrit avant.

      Affichez ensuite les lignes `1. Hiboux (18)`, avec le rang qui commence à 1.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Simulation 📺

Le programme principal enchaîne inscription, scores, moyenne arrondie, vainqueurs et classement.

Saisies de référence : `Lynx`, `Hiboux`, `Renards`, `fin`, puis les scores 12, 18 et 15.

```text
Équipes : Lynx, Hiboux, Renards
Scores : 12, 18, 15
Moyenne : 15.0
Vainqueur : Hiboux
Classement :
1. Hiboux (18)
2. Renards (15)
3. Lynx (12)
```

Égalité en tête, mêmes équipes, scores 10, 14 et 14. 38 / 3 arrondi à deux décimales vaut 12,67.

```text
Moyenne : 12.67
Vainqueurs : Hiboux, Renards
Classement :
1. Hiboux (14)
2. Renards (14)
3. Lynx (10)
```

`round(moyenne([10, 14, 14]), 2)` vaut `12.67`.

**Ce qu'on rend.** Un fichier `tournoi.py` : commentaire d'en-tête avec le nom et la classe, les cinq fonctions, et un programme principal qui reproduit le récapitulatif.

## 3. Pour aller plus loin

*   **Une seule liste.** Remplacez les deux listes par une liste de tuples `(nom, score)` dès la saisie. Les fonctions de moyenne et de vainqueurs lisent cette liste-là.
*   **Seuil.** `qualifies(couples, seuil)` renvoie une nouvelle liste avec les équipes dont le score est supérieur ou égal au seuil, sans effacer la liste d'origine. Seuil 15 sur l'exemple principal : Hiboux et Renards.
*   **Deuxième manche.** Demandez un second score par équipe, additionnez-le au premier, puis recalculez le classement.
