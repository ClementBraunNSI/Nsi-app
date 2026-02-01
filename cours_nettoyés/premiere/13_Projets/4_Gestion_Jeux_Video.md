---
title: Projet - Gestion Jeux Vidéo
description: Création d'un gestionnaire de collection de jeux vidéo en Python
level: Première
chapter: 13 - Projets
icon: fa-solid fa-gamepad
---

# Projet - Gestionnaire de Jeux Vidéo

Le but de ce projet est de reproduire le fonctionnement d’un gestionnaire de collection, appliqué ici à une collection de jeux vidéo.

Vous pourrez trouver une proposition de correction ici : [Code correction](resources/gestion_jeux_video_correction.py).

## Fonctionnalités principales

L’objectif est de permettre à un utilisateur de gérer sa collection de jeux vidéo à travers plusieurs fonctionnalités :
- Ajouter un jeu à la collection.
- Rechercher un jeu pour afficher ses détails.
- Modifier les informations d’un jeu.
- Supprimer un jeu.
- Afficher la liste complète des jeux dans la collection.

Chaque jeu sera représenté par un ensemble d’informations :
- Titre : le nom du jeu vidéo.
- Plateforme : la console ou support sur lequel le jeu est jouable (par exemple : PC, PS5, Switch, etc.).
- Année de sortie : l’année où le jeu a été publié.
- Genre : le type de jeu (RPG, FPS, aventure, etc.).
- Statut : un état indiquant si le jeu est possédé ou souhaité.

Exemple de structure de données pour un jeu vidéo :

```python
{
	'The Legend of Zelda : Breath of the Wild' : {'plateforme' : "Switch", "année" : 2017, "genre" : "Aventure", "statut":"possédé"}
}
```

## Ajouter un jeu à la collection

Créer une fonction `ajouter_jeu` qui permet à l’utilisateur d’ajouter un jeu à la collection.
Pour cela, le programme demandera à l’utilisateur de saisir les informations suivantes :
- Titre
- Plateforme
- Année de sortie
- Genre
- Statut

Les données saisies seront enregistrées dans le dictionnaire `ludotheque`.

## Afficher la collection complète

Créer une fonction `afficher_collection` qui prend en paramètre une ludothèque (dictionnaire) et un nom de jeu et renvoie une chaîne de caractère réalisant l'affichage suivant:
Exemple d’affichage :

```
Titre : The Legend of Zelda: Breath of the Wild
Plateforme : Switch
Année : 2017
Genre : Aventure
Statut : Possédé
```

## Rechercher un jeu

Créer une fonction `rechercher_jeu` qui prend en paramètre une ludothèque (dictionnaire) et un nom de jeu (str).
Si le jeu est trouvé, ses informations seront affichées. Sinon, un message indiquera qu’il n’existe pas dans la collection.

## Modifier un jeu

Créer une fonction `modifier_jeu` qui prend en paramètre une ludothèque, un jeu, un champ et une valeur et modifie le champ du jeu par la valeur donnée.
Le programme devra permettre de modifier le statut, le genre ou tout autre champ.

## Supprimer un jeu

Créer une fonction `supprimer_jeu` qui prend en paramètre une ludothèque et un nom de jeu et retire le jeu de la ludothèque.
Le jeu sera retiré de la liste s’il est trouvé. Sinon, un message informera qu’il n’a pas été trouvé.

## Organisation du programme

Créer une fonction `menu_principal` qui propose à l’utilisateur les différentes actions disponibles :  

- 1.Ajouter un jeu.
- 2.Afficher la collection complète. 
- 3.Rechercher un jeu.
- 4.Modifier un jeu.
- 5.Supprimer un jeu.
- 6.Afficher les statistiques (optionnel).
- 7.Quitter le programme.

À chaque choix, le programme devra exécuter la fonction correspondante.

Exemple d’affichage pour le menu principal :

```
############### Gestionnaire de Jeux Vidéo ###############
# Application réalisée par : Nom Prénom                  #
##########################################################

1. Ajouter un jeu  
2. Afficher la collection complète  
3. Rechercher un jeu  
4. Modifier un jeu  
5. Supprimer un jeu  
6. Afficher les statistiques  
7. Quitter  
```

## Fonctionnalités avancées (optionnelles)
