---
title: "Structures : Bibliothèque"
description: "Système de gestion d'une collection de livres numériques en Python"
level: premiere
chapter: "Projets"
icon: "📚"
badgeId: "premiere_gestion_bibliotheque"
---

import ExerciseTabs from '../../components/interactive/ExerciseTabs';
import { Enonce } from '../../components/interactive/ExerciseTabs';

# 📚 Projet - Système de Gestion de Bibliothèque Numérique

Le but de ce projet est de créer un système en Python pour gérer une collection de livres numériques.

**Concepts Abordés :**
- Structures de données : listes, dictionnaires
- Manipulation de fichiers (CSV)
- Fonctions : définition, appel, paramètres, valeurs de retour
- Boucles et conditions

## 1. Gestion des Livres

Chaque livre sera représenté par un dictionnaire avec les clés suivantes :
- `titre` (str)
- `auteur` (str)
- `annee_publication` (int)
- `genre` (str)
- `isbn` (str, unique)

<ExerciseTabs courseId="proj_lib_struct" courseTitle="Structure des Données">
  <ExerciseSection id="lib-struct-1" label="Initialisation">
    <Enonce>
      Créez une liste vide `bibliotheque` qui contiendra tous les dictionnaires représentant les livres.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="lib-struct-2" label="Ajout d'un livre">
    <Enonce>
      Créez une fonction `ajouter_livre(bibliotheque, titre, auteur, annee, genre, isbn)` qui :
      1. Vérifie si un livre avec le même ISBN existe déjà.
      2. Si non, crée le dictionnaire et l'ajoute à la liste.
      3. Renvoie `True` si ajouté, `False` sinon.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="lib-struct-3" label="Recherche">
    <Enonce>
      Créez une fonction `rechercher_livres(bibliotheque, critere, valeur)` qui :
      1. Prend un `critere` ("titre", "auteur", etc.) et une `valeur`.
      2. Renvoie une liste des livres correspondants.
      
      Exemple : `rechercher_livres(bibliotheque, "auteur", "Victor Hugo")`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="lib-struct-4" label="Affichage">
    <Enonce>
      Créez une fonction `afficher_livre(livre)` qui affiche les détails proprement (ex: "Titre : ... | Auteur : ...").
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Sauvegarde et Chargement 💾

Pour que les données persistent, nous allons utiliser un fichier CSV.

<ExerciseTabs courseId="proj_lib_data" courseTitle="Persistance des Données">
  <ExerciseSection id="lib-data-1" label="Sauvegarde">
    <Enonce>
      Créez une fonction `sauvegarder(bibliotheque, nom_fichier)` qui écrit le contenu de la liste dans un fichier CSV.
      
      *Utilisez le module `csv` et `DictWriter`.*
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="lib-data-2" label="Chargement">
    <Enonce>
      Créez une fonction `charger(nom_fichier)` qui :
      1. Lit le fichier CSV.
      2. Reconstruit la liste de dictionnaires (attention à convertir l'année en `int`).
      3. Renvoie la liste chargée (ou une liste vide si le fichier n'existe pas).
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. Interface Utilisateur

<ExerciseTabs courseId="proj_lib_ui" courseTitle="Menu Principal">
  <ExerciseSection id="lib-ui-1" label="Menu Interactif">
    <Enonce>
      Créez une fonction `menu_principal()` :

      ```text
      --- MA BIBLIOTHÈQUE ---
      1. Ajouter un livre
      2. Rechercher un livre
      3. Afficher tout
      4. Supprimer un livre (par ISBN)
      5. Sauvegarder et Quitter
      ```

      Le programme doit charger les données au démarrage et proposer de sauvegarder à la fermeture.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="lib-ui-2" label="Suppression">
    <Enonce>
      Implémentez l'option 4 : `supprimer_livre(bibliotheque, isbn)`.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>
