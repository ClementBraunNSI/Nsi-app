---
title: 'Dictionnaires : Collection Jeux'
description: Création d'un gestionnaire de collection de jeux vidéo en Python
level: premiere
chapter: Projets
icon: "gamepad-2"
badgeId: premiere_gestion_jeux_video
prerequisites:
  - projet_application_bancaire
audience: public
---

# <Icone nom="gamepad-2" /> Projet - Gestionnaire de Jeux Vidéo

Le but de ce projet est de créer un gestionnaire de collection de jeux vidéo, en Python.
Dans ce projet, nous allons ajouter un jeu, afficher sa fiche, modifier un champ, supprimer un jeu, puis lister toute la collection depuis un menu.

Chaque jeu est un dictionnaire de détails. Le titre est la clé du dictionnaire principal : deux jeux ne peuvent pas porter le même titre. La comparaison est exacte, majuscules comprises : `"celeste"` ne trouve pas `"Celeste"`.

## 1. La collection <Icone nom="joystick" />

Au lancement, la collection contient déjà deux jeux, pour que les essais ne partent pas d'une base vide.

```python
ludotheque = {
    "The Legend of Zelda : Breath of the Wild": {
        "plateforme": "Switch",
        "annee": 2017,
        "genre": "Aventure",
        "statut": "possédé"
    },
    "Elden Ring": {
        "plateforme": "PC",
        "annee": 2022,
        "genre": "RPG",
        "statut": "souhaité"
    }
}
```

Les quatre clés internes sont `plateforme` (`str`), `annee` (`int`), `genre` (`str`) et `statut` (`str`). Le statut vaut exactement `"possédé"` ou `"souhaité"`.

Fiche attendue pour Zelda :

```text
Titre : The Legend of Zelda : Breath of the Wild
Plateforme : Switch
Année : 2017
Genre : Aventure
Statut : possédé
```

<ExerciseTabs courseId="proj_jv_struct" courseTitle="Structure de Données">
  <ExerciseSection id="pjv-struct-1" label="Modélisation" type="lecture">
    <Enonce>
      Initialiser `ludotheque` avec Zelda et Elden Ring, exactement comme ci-dessus. `annee` est un `int`, pas un texte.

      Écrire `afficher_jeu(ludotheque, titre)`. Jeu trouvé : les cinq lignes de la fiche, puis `True`. Jeu absent : `Jeu introuvable.` et `False`.

      *Tester avec `"The Legend of Zelda : Breath of the Wild"` (la fiche) et avec `"Minecraft"` (`Jeu introuvable.`).*
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Ajouter et chercher <Icone nom="search" />

<ExerciseTabs courseId="proj_jv_base" courseTitle="Fonctions de Base">
  <ExerciseSection id="pjv-base-1" label="Ajouter un jeu" type="python">
    <Enonce>
      Écrire `ajouter_jeu_donnees(ludotheque, titre, plateforme, annee, genre, statut)`. C'est cette fonction que le scénario automatique appelle, sans `input`.

      - Titre déjà présent : `Ce jeu est déjà dans la collection.`, `False`, dictionnaire inchangé.
      - `annee` hors de 1950 à 2100 inclus : `Année invalide.`, `False`.
      - `statut` autre que `possédé` ou `souhaité` : `Statut invalide.`, `False`.
      - Sinon, ajouter le dictionnaire interne et renvoyer `True`.

      Écrire `ajouter_jeu(ludotheque)`, qui pose les questions (titre, plateforme, année, genre, statut), convertit l'année en `int`, puis appelle `ajouter_jeu_donnees`. Si l'année ou le statut est refusé, on redemande ce champ, pas tout le formulaire.

      *Test :* `ajouter_jeu_donnees(ludotheque, "Celeste", "PC", 2018, "Plateforme", "possédé")` renvoie `True`. Le même titre une seconde fois renvoie `False`. Celeste n'est pas remplacé.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="pjv-base-2" label="Afficher un jeu" type="lecture">
    <Enonce>
      `afficher_jeu` est déjà spécifiée. La vérifier sur Celeste après l'ajout : la fiche complète, avec l'année `2018` en entier, la plateforme `PC`, le genre `Plateforme` et le statut `possédé`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="pjv-base-3" label="Rechercher" type="lecture">
    <Enonce>
      Écrire `rechercher_jeu(ludotheque)`. Elle demande `Titre : `, appelle `afficher_jeu`, et renvoie le même booléen.

      `"Celeste"` affiche la fiche. `"celeste"` affiche `Jeu introuvable.`
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. Modifier et supprimer <Icone nom="pencil" />

<ExerciseTabs courseId="proj_jv_adv" courseTitle="Gestion Avancée">
  <ExerciseSection id="pjv-adv-1" label="Modifier un jeu" type="lecture">
    <Enonce>
      Écrire `modifier_jeu(ludotheque)`.

      1. Demander le titre. S'il est absent : `Jeu introuvable.`, `False`.
      2. Demander le champ : `plateforme`, `annee`, `genre` ou `statut`. Un autre mot affiche `Champ inconnu.` et redemande.
      3. Demander la nouvelle valeur. L'année et le statut suivent les mêmes contrôles que l'ajout.
      4. Mettre à jour uniquement ce champ, et renvoyer `True`.

      Passer le statut de Celeste à `souhaité`. Relancer l'affichage : la ligne Statut a changé, plateforme, année et genre non.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="pjv-adv-2" label="Supprimer un jeu" type="lecture">
    <Enonce>
      Écrire `supprimer_jeu(ludotheque)`. Elle demande le titre. Jeu présent : retirer la clé (`del` ou `pop`) et renvoyer `True`. Jeu absent : `Jeu introuvable.` et `False`.

      La première suppression d'`Elden Ring` renvoie `True`. La seconde renvoie `False`. Zelda est toujours là.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Menu et rendu <Icone nom="clipboard-list" />

<ExerciseTabs courseId="proj_jv_menu" courseTitle="Interface">
  <ExerciseSection id="pjv-menu-1" label="Menu interactif" type="lecture">
    <Enonce>
      Écrire `afficher_collection(ludotheque)`. Elle appelle `afficher_jeu` pour chaque titre, avec une ligne vide entre deux fiches. Collection vide : `La collection est vide.`

      Écrire `menu_principal(ludotheque)`, qui boucle jusqu'au choix `6`.

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

      Un choix hors de 1 à 6 affiche `Choix invalide.` Remplacer `Votre Nom` par le vôtre.

      Le scénario à laisser dans le fichier, avant le menu ou derrière un commentaire à enlever le jour du rendu :

      1. Ajouter Celeste (PC, 2018, Plateforme, possédé).
      2. Afficher Celeste.
      3. Passer son statut à `souhaité`, puis réafficher.
      4. Supprimer Elden Ring.
      5. Afficher toute la collection : Zelda puis Celeste. Elden Ring n'apparaît plus.
      6. Supprimer Elden Ring une seconde fois : `Jeu introuvable.`
      7. Chercher `celeste` en minuscules : `Jeu introuvable.`
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un fichier `ludotheque.py` : commentaire d'en-tête avec le nom et la classe, la collection de départ, les fonctions, le menu, et le scénario Celeste / Elden Ring qu'on peut relire dans le fichier.

## 5. Pour aller plus loin

*   **Sauvegarde.** Avec le module `json`, écrire la collection dans `ludotheque.json` au choix `6`, et la recharger au lancement si le fichier existe.
*   **Comptages.** Afficher combien de jeux sont `possédé`, combien sont `souhaité`, et combien de jeux il y a par plateforme.
*   **Liste souhaitée.** Une option du menu n'affiche que les jeux dont le statut vaut `souhaité`.
