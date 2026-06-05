---
title: 'Dictionnaires : Collection Jeux'
description: Création d'un gestionnaire de collection de jeux vidéo en Python
level: premiere
chapter: Projets
icon: "\U0001F3AE"
badgeId: premiere_gestion_jeux_video
prerequisites:
  - projet_application_bancaire
---

# 🎮 Projet - Gestionnaire de Jeux Vidéo

Le but de ce projet est de reproduire le fonctionnement d’un gestionnaire de collection, appliqué ici à une collection de jeux vidéo.

## 1. Structure des données

L’objectif est de permettre à un utilisateur de gérer sa collection de jeux vidéo à travers plusieurs fonctionnalités :
- Ajouter un jeu à la collection.
- Rechercher un jeu pour afficher ses détails.
- Modifier les informations d’un jeu.
- Supprimer un jeu.
- Afficher la liste complète des jeux dans la collection.

Chaque jeu sera représenté par un ensemble d’informations :
- **Titre** : le nom du jeu vidéo.
- **Plateforme** : la console ou support (PC, PS5, Switch, etc.).
- **Année de sortie** : l’année de publication.
- **Genre** : le type de jeu (RPG, FPS, aventure, etc.).
- **Statut** : "possédé" ou "souhaité".

<ExerciseTabs courseId="proj_jv_struct" courseTitle="Structure de Données">
  <ExerciseSection id="pjv-struct-1" label="Modélisation">
    <Enonce>
      Nous allons utiliser un **dictionnaire de dictionnaires**.
      La clé principale sera le **titre du jeu**, et la valeur sera un autre dictionnaire contenant les détails.

      Exemple :
      ```python
      ludotheque = {
          'The Legend of Zelda : Breath of the Wild' : {
              'plateforme' : "Switch",
              'annee' : 2017,
              'genre' : "Aventure",
              'statut' : "possédé"
          },
          'Elden Ring': {
              'plateforme': "PC",
              'annee': 2022,
              'genre': "RPG",
              'statut': "souhaité"
          }
      }
      ```
      Initialisez votre variable `ludotheque` avec quelques jeux de votre choix.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Fonctionnalités de base

<ExerciseTabs courseId="proj_jv_base" courseTitle="Fonctions de Base">
  <ExerciseSection id="pjv-base-1" label="Ajouter un jeu">
    <Enonce>
      Créez une fonction `ajouter_jeu(ludotheque)` qui demande à l'utilisateur de saisir les informations (Titre, Plateforme, Année, Genre, Statut) et ajoute le jeu au dictionnaire `ludotheque`.
      
      *Indice : Utilisez `input()` pour récupérer les saisies.*
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="pjv-base-2" label="Afficher un jeu">
    <Enonce>
      Créez une fonction `afficher_jeu(ludotheque, titre)` qui prend en paramètre la ludothèque et un titre de jeu.
      
      Si le jeu existe, elle doit afficher ses détails proprement, par exemple :
      ```text
      Titre : The Legend of Zelda: Breath of the Wild
      Plateforme : Switch
      Année : 2017
      Genre : Aventure
      Statut : Possédé
      ```
      Sinon, elle affiche un message d'erreur.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="pjv-base-3" label="Rechercher">
    <Enonce>
      Créez une fonction `rechercher_jeu(ludotheque)` qui demande un titre à l'utilisateur et appelle la fonction `afficher_jeu` précédente.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. Gestion Avancée

<ExerciseTabs courseId="proj_jv_adv" courseTitle="Gestion Avancée">
  <ExerciseSection id="pjv-adv-1" label="Modifier un jeu">
    <Enonce>
      Créez une fonction `modifier_jeu(ludotheque)` qui :
      1. Demande quel jeu modifier.
      2. Si le jeu existe, demande quel champ modifier (statut, genre, etc.).
      3. Demande la nouvelle valeur.
      4. Met à jour le dictionnaire.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="pjv-adv-2" label="Supprimer un jeu">
    <Enonce>
      Créez une fonction `supprimer_jeu(ludotheque)` qui demande le nom d'un jeu et le retire de la collection s'il existe (utilisez `del` ou `.pop()`).
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Menu Principal

<ExerciseTabs courseId="proj_jv_menu" courseTitle="Interface">
  <ExerciseSection id="pjv-menu-1" label="Menu Interactif">
    <Enonce>
      Créez une fonction `menu_principal()` qui affiche les choix possibles et boucle indéfiniment jusqu'à ce que l'utilisateur choisisse de quitter.

      ```text
      ############### Gestionnaire de Jeux Vidéo ###############
      # Application réalisée par : Votre Nom                   #
      ##########################################################

      1. Ajouter un jeu  
      2. Afficher la collection complète  
      3. Rechercher un jeu  
      4. Modifier un jeu  
      5. Supprimer un jeu  
      6. Quitter  
      ```
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 5. Pour aller plus loin (Bonus) 🚀

*   **Sauvegarde** : Utilisez le module `json` ou `csv` pour sauvegarder votre collection dans un fichier et la recharger au lancement du programme.
*   **Statistiques** : Ajoutez une option pour afficher le nombre de jeux par plateforme ou par genre.
*   **Filtres** : Affichez seulement les jeux "souhaités" (Wishlist).
