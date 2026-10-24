---
title: 'Structures : Bibliothèque'
description: Système de gestion d'une collection de livres numériques en Python
level: premiere
chapter: Projets
icon: "\U0001F4DA"
badgeId: premiere_gestion_bibliotheque
prerequisites:
  - projet_tournoi_esport
audience: public
---

# 📚 Projet - Système de Gestion de Bibliothèque Numérique

Le but de ce projet est de créer un programme qui gère une collection de livres : ajout, recherche, affichage, suppression, et conservation des données dans un fichier CSV entre deux lancements.
Dans ce projet, chaque livre est un dictionnaire, et la bibliothèque est une liste de ces dictionnaires.

L'ISBN identifie un livre : deux fiches ne partagent pas le même ISBN.

## 1. Les livres 📖

Une fiche contient :

*   `titre` (`str`)
*   `auteur` (`str`)
*   `annee_publication` (`int`)
*   `genre` (`str`)
*   `isbn` (`str`, unique)

<ExerciseTabs courseId="proj_lib_struct" courseTitle="Structure des Données">
  <ExerciseSection id="lib-struct-1" label="Initialisation" type="python">
    <Enonce>
      Créez `bibliotheque = []`. Chaque élément sera un dictionnaire avec les clés `titre`, `auteur`, `annee_publication`, `genre` et `isbn`.

      Les fonctions se testent d'abord sans fichier, sur cette liste écrite dans le programme.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="lib-struct-2" label="Ajout d'un livre" type="python">
    <Enonce>
      Écrivez `ajouter_livre(bibliotheque, titre, auteur, annee, genre, isbn)`.

      Parcourez la liste. Si un livre a déjà cet `isbn`, affichez `ISBN déjà présent.` et renvoyez `False`. La liste ne gagne pas de doublon.

      Sinon construisez le dictionnaire, ajoutez-le en fin de liste, et renvoyez `True`. `annee` est stockée en `int`.

      ```python
      bibliotheque = []
      ajouter_livre(bibliotheque, "Les Misérables", "Victor Hugo", 1862, "Roman", "978123")
      # True
      ajouter_livre(bibliotheque, "Notre-Dame de Paris", "Victor Hugo", 1831, "Roman", "978456")
      # True
      ajouter_livre(bibliotheque, "Autre titre", "Autre auteur", 2000, "Essai", "978123")
      # False, l'ISBN 978123 est déjà pris
      ```

      Après le troisième appel, la liste contient deux livres, pas trois.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="lib-struct-3" label="Recherche" type="lecture">
    <Enonce>
      Écrivez `rechercher_livres(bibliotheque, critere, valeur)`.

      Si `critere` n'est pas l'une des cinq clés, renvoyez `[]`. Sinon renvoyez la liste des livres dont le champ, converti en texte avec `str(livre[critere])`, est égal à `valeur`. L'année `"1862"` tapée au clavier trouve ainsi l'entier `1862`. L'ordre d'ajout est conservé.

      La comparaison est exacte : `"victor hugo"` ne trouve pas `"Victor Hugo"`.

      *Testez avec :*

      - `rechercher_livres(bibliotheque, "auteur", "Victor Hugo")` : les deux dictionnaires de Hugo, tant qu'aucun n'a été supprimé ;
      - `rechercher_livres(bibliotheque, "annee_publication", "1862")` : uniquement Les Misérables ;
      - `rechercher_livres(bibliotheque, "editeur", "Folio")` : `[]`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="lib-struct-4" label="Affichage" type="lecture">
    <Enonce>
      Écrivez `afficher_livre(livre)` : une seule ligne, avec le séparateur ` | `, dans l'ordre Titre, Auteur, Année, Genre, ISBN.

      ```text
      Titre : Les Misérables | Auteur : Victor Hugo | Année : 1862 | Genre : Roman | ISBN : 978123
      ```

      Écrivez `afficher_tout(bibliotheque)`. Liste vide : `La bibliothèque est vide.` Sinon, une ligne par livre via `afficher_livre`.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Le fichier CSV 💾

Fichier `bibliotheque.csv` attendu quand les deux livres sont encore là, virgule comme séparateur, UTF-8 :

```text
titre,auteur,annee_publication,genre,isbn
Les Misérables,Victor Hugo,1862,Roman,978123
Notre-Dame de Paris,Victor Hugo,1831,Roman,978456
```

L'en-tête est obligatoire : sans ces noms de colonnes, `DictWriter` et `DictReader` ne se parlent pas. Dans un CSV, tout est texte au départ : au chargement, `annee_publication` redevient un `int`.

<ExerciseTabs courseId="proj_lib_data" courseTitle="Persistance des Données">
  <ExerciseSection id="lib-data-1" label="Sauvegarde" type="lecture">
    <Enonce>
      Écrivez `sauvegarder(bibliotheque, nom_fichier)` avec le module `csv` et `DictWriter`.

      `fieldnames` vaut, dans cet ordre : `titre`, `auteur`, `annee_publication`, `genre`, `isbn`. Écrivez l'en-tête, puis une ligne par livre. Ouvrez le fichier en écriture UTF-8.

      Après les deux ajouts de l'exemple, le fichier produit a trois lignes : l'en-tête et les deux livres. L'ISBN `978123` est sur la ligne des Misérables.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="lib-data-2" label="Chargement" type="lecture">
    <Enonce>
      Écrivez `charger(nom_fichier)`.

      Si le fichier n'existe pas, renvoyez `[]` sans message d'erreur bloquant. Le programme démarre quand même. S'il existe, lisez-le avec `DictReader` et reconstruisez la liste. Convertissez `annee_publication` en `int` à ce moment-là.

      Test : sauvegardez, repartez de `bibliotheque = []`, rechargez. `rechercher_livres(..., "auteur", "Victor Hugo")` retrouve les deux livres, et `annee_publication` supporte une comparaison avec l'entier `1862`.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. Menu et suppression 🗑️

<ExerciseTabs courseId="proj_lib_ui" courseTitle="Menu Principal">
  <ExerciseSection id="lib-ui-2" label="Suppression" type="lecture">
    <Enonce>
      Écrivez `supprimer_livre(bibliotheque, isbn)`.

      Parcourez la liste. Au premier livre dont l'ISBN est exactement celui demandé, retirez-le et renvoyez `True`. On enlève au plus un livre. Si aucun livre ne correspond, affichez `ISBN introuvable.` et renvoyez `False`. La liste ne change pas.

      Sur l'exemple, `supprimer_livre(bibliotheque, "978456")` renvoie `True`. Il ne reste que Les Misérables. Un second appel avec `"978456"` renvoie `False`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="lib-ui-1" label="Menu interactif" type="lecture">
    <Enonce>
      Écrivez `menu_principal`. Au début, `bibliotheque = charger("bibliotheque.csv")`.

      ```text
      --- MA BIBLIOTHÈQUE ---
      1. Ajouter un livre
      2. Rechercher un livre
      3. Afficher tout
      4. Supprimer un livre (par ISBN)
      5. Sauvegarder et quitter
      ```

      Le choix `1` demande les cinq champs. L'année tapée est convertie en `int`. Le choix `2` demande le critère puis la valeur, affiche chaque livre trouvé, ou `Aucun résultat.` si la liste renvoyée est vide. Le choix `4` demande l'ISBN et appelle `supprimer_livre`. Le choix `5` appelle `sauvegarder` puis termine. Tout autre choix affiche `Choix invalide.`

      Le CSV réécrit après avoir supprimé `978456` ne contient plus Notre-Dame de Paris.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.**

*   `bibliotheque.py`, avec un commentaire d'en-tête (nom et classe), les fonctions, et le menu qui charge le CSV au démarrage et le réécrit au choix Quitter ;
*   un `bibliotheque.csv` produit par `sauvegarder`, contenant au moins les deux livres de l'exemple.
