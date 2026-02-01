---
title: Projet - Gestion Bibliothèque
description: Système de gestion d'une collection de livres numériques en Python
level: Première
chapter: 13 - Projets
icon: fa-solid fa-book
---

# Projet - Système de Gestion de Bibliothèque Numérique 📚

Le but de ce projet est de créer un système en Python pour gérer une collection de livres numériques.

## Concepts Abordés

- Structures de données : listes, dictionnaires
- Manipulation de fichiers (CSV ou JSON pour stocker les données des livres)
- Fonctions : définition, appel, paramètres, valeurs de retour
- Boucles et conditions
- Interfaces utilisateur simples en mode texte

## Fonctionnalités à Implémenter

### 1. Gestion des Livres

Chaque livre sera représenté par un dictionnaire avec les clés suivantes :
- `titre` (chaîne de caractères)
- `auteur` (chaîne de caractères)
- `annee_publication` (entier)
- `genre` (chaîne de caractères)
- `isbn` (chaîne de caractères, unique)

!!! question "Initialisation de la bibliothèque"
    Créer une liste vide nommée `bibliotheque` qui contiendra tous les dictionnaires représentant les livres.

!!! question "Ajout d'un livre"
    Créer une fonction `ajouter_livre(bibliotheque, titre, auteur, annee_publication, genre, isbn)` qui :
    1. Vérifie si un livre avec le même ISBN existe déjà dans la `bibliotheque`.
    2. Si non, crée un dictionnaire pour le nouveau livre et l'ajoute à la liste `bibliotheque`.
    3. Renvoie `True` si le livre a été ajouté, `False` sinon (par exemple, si l'ISBN existe déjà).

!!! question "Recherche de livres"
    Créer une fonction `rechercher_livres(bibliotheque, critere, valeur)` qui :
    1. Prend en paramètre la `bibliotheque`, un `critere` de recherche (par exemple, "titre", "auteur", "genre") et une `valeur` à rechercher.
    2. Renvoie une liste de tous les livres (dictionnaires) qui correspondent au critère et à la valeur.
    Par exemple, `rechercher_livres(bibliotheque, "auteur", "Victor Hugo")` devrait renvoyer tous les livres de Victor Hugo.

!!! question "Affichage des détails d'un livre"
    Créer une fonction `afficher_details_livre(livre)` qui prend un dictionnaire de livre en paramètre et affiche ses informations de manière lisible.

!!! example "Tests de la gestion des livres"
    1. Initialiser une bibliothèque vide.
    2. Ajouter plusieurs livres avec des informations variées. Tenter d'ajouter un livre avec un ISBN déjà existant pour vérifier la gestion des doublons.
    3. Rechercher des livres par titre, auteur et genre.
    4. Afficher les détails des livres trouvés.

### 2. Sauvegarde et Chargement des Données

Pour que les données persistent entre les sessions, nous allons les sauvegarder dans un fichier.

!!! question "Sauvegarde de la bibliothèque"
    Créer une fonction `sauvegarder_bibliotheque(bibliotheque, nom_fichier)` qui :
    1. Prend la liste `bibliotheque` et un `nom_fichier` (par exemple, "bibliotheque.csv") en paramètres.
    2. Écrit les données de chaque livre dans le fichier CSV. Chaque ligne du CSV représentera un livre, et les colonnes correspondront aux attributs du livre (titre, auteur, etc.).
    *Astuce : Vous pouvez utiliser le module `csv` de Python pour cela.*

!!! question "Chargement de la bibliothèque"
    Créer une fonction `charger_bibliotheque(nom_fichier)` qui :
    1. Prend un `nom_fichier` en paramètre.
    2. Lit les données depuis le fichier CSV et reconstruit la liste de dictionnaires `bibliotheque`.
    3. Renvoie la `bibliotheque` chargée. Si le fichier n'existe pas, elle doit renvoyer une liste vide.
    *Attention à bien convertir les types de données (par exemple, `annee_publication` en entier) lors du chargement.*

!!! example "Tests de sauvegarde et chargement"
    1. Créer une bibliothèque et y ajouter quelques livres.
    2. Sauvegarder la bibliothèque dans un fichier.
    3. Effacer la variable `bibliotheque` actuelle (ou redémarrez votre script).
    4. Charger la bibliothèque depuis le fichier et vérifier que tous les livres sont correctement restaurés.

### 3. Interface Utilisateur (Menu Principal)

Créer une interface simple en mode texte pour interagir avec le système.

!!! question "Menu principal"
    Créer une fonction `menu_principal()` qui affiche les options suivantes à l'utilisateur :
    1. Ajouter un nouveau livre
    2. Rechercher des livres
    3. Afficher tous les livres
    4. Supprimer un livre (par ISBN)
    5. Sauvegarder et quitter
    6. Quitter sans sauvegarder
    
    La fonction doit lire le choix de l'utilisateur et appeler les fonctions correspondantes.
    La boucle du menu doit continuer jusqu'à ce que l'utilisateur choisisse de quitter.

!!! question "Suppression d'un livre"
    Créer une fonction `supprimer_livre(bibliotheque, isbn)` qui :
    1. Recherche le livre par `isbn`.
    2. Si trouvé, le supprime de la `bibliotheque` et renvoie `True`.
    3. Sinon, renvoie `False`.

!!! example "Test de l'interface utilisateur"
    1. Lancer le `menu_principal()`.
    2. Tester chaque option du menu :
        - Ajouter plusieurs livres.
        - Rechercher des livres.
        - Afficher tous les livres.
        - Supprimer un livre existant, puis essayer de supprimer un livre inexistant.
        - Sauvegarder la bibliothèque et quitter. Relancer le programme pour vérifier que les données ont bien été sauvegardées et chargées au démarrage.
