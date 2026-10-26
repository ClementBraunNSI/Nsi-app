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
Ce projet consiste à ajouter un jeu, afficher sa fiche, modifier un champ, supprimer un jeu, puis lister toute la collection depuis un menu.

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
  <ExerciseSection id="pjv-struct-1" label="Modélisation" type="python">
    <Enonce>
      Initialiser `ludotheque` avec Zelda et Elden Ring, exactement comme ci-dessus. `annee` est un `int`, pas un texte.

      Écrire `afficher_jeu(ludotheque, titre)`. Jeu trouvé : les cinq lignes de la fiche, puis `True`. Jeu absent : `Jeu introuvable.` et `False`.

      *Tester avec `"The Legend of Zelda : Breath of the Wild"` (la fiche) et avec `"Minecraft"` (`Jeu introuvable.`).*

    <Correction>
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

    def afficher_jeu(ludotheque, titre):
        if titre not in ludotheque:
            print("Jeu introuvable.")
            return False
        jeu = ludotheque[titre]
        print("Titre :", titre)
        print("Plateforme :", jeu["plateforme"])
        print("Année :", jeu["annee"])
        print("Genre :", jeu["genre"])
        print("Statut :", jeu["statut"])
        return True

    afficher_jeu(ludotheque, "The Legend of Zelda : Breath of the Wild")
    afficher_jeu(ludotheque, "Minecraft")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import io, contextlib
    def _sortie(fonction, *arguments):
        tampon = io.StringIO()
        with contextlib.redirect_stdout(tampon):
            valeur = fonction(*arguments)
        return valeur, tampon.getvalue()
    assert ludotheque["Elden Ring"] == {"plateforme": "PC", "annee": 2022, "genre": "RPG", "statut": "souhaité"}, "ludotheque contient Elden Ring exactement comme dans l'énoncé."
    assert ludotheque["The Legend of Zelda : Breath of the Wild"]["annee"] == 2017, "L'année de Zelda est l'entier 2017."
    valeur, texte = _sortie(afficher_jeu, ludotheque, "The Legend of Zelda : Breath of the Wild")
    assert valeur is True, "Jeu trouvé : afficher_jeu renvoie True."
    assert [l.strip() for l in texte.strip().splitlines()] == ["Titre : The Legend of Zelda : Breath of the Wild", "Plateforme : Switch", "Année : 2017", "Genre : Aventure", "Statut : possédé"], "La fiche de Zelda tient en cinq lignes : Titre, Plateforme, Année, Genre, Statut."
    valeur, texte = _sortie(afficher_jeu, ludotheque, "Minecraft")
    assert valeur is False and texte.strip() == "Jeu introuvable.", "Jeu absent : Jeu introuvable. et False."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 2. Ajouter et chercher <Icone nom="search" />

<ExerciseTabs courseId="proj_jv_base" courseTitle="Fonctions de Base">
  <ExerciseSection id="pjv-base-1" label="Ajouter un jeu" type="python">
    <CodeDepart>
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
    </CodeDepart>
    <Enonce>
      Écrire `ajouter_jeu_donnees(ludotheque, titre, plateforme, annee, genre, statut)`. C'est cette fonction que le scénario automatique appelle, sans `input`.

      - Titre déjà présent : `Ce jeu est déjà dans la collection.`, `False`, dictionnaire inchangé.
      - `annee` hors de 1950 à 2100 inclus : `Année invalide.`, `False`.
      - `statut` autre que `possédé` ou `souhaité` : `Statut invalide.`, `False`.
      - Sinon, ajouter le dictionnaire interne et renvoyer `True`.

      Écrire `ajouter_jeu(ludotheque)`, qui pose les questions (titre, plateforme, année, genre, statut), convertit l'année en `int`, puis appelle `ajouter_jeu_donnees`. Si l'année ou le statut est refusé, on redemande ce champ, pas tout le formulaire.

      *Test :* `ajouter_jeu_donnees(ludotheque, "Celeste", "PC", 2018, "Plateforme", "possédé")` renvoie `True`. Le même titre une seconde fois renvoie `False`. Celeste n'est pas remplacé.

    <Correction>
    ```python
    def ajouter_jeu_donnees(ludotheque, titre, plateforme, annee, genre, statut):
        if titre in ludotheque:
            print("Ce jeu est déjà dans la collection.")
            return False
        if annee < 1950 or annee > 2100:
            print("Année invalide.")
            return False
        if statut != "possédé" and statut != "souhaité":
            print("Statut invalide.")
            return False
        ludotheque[titre] = {"plateforme": plateforme, "annee": annee, "genre": genre, "statut": statut}
        return True

    def ajouter_jeu(ludotheque):
        titre = input("Titre : ")
        plateforme = input("Plateforme : ")
        annee = int(input("Année : "))
        while annee < 1950 or annee > 2100:
            print("Année invalide.")
            annee = int(input("Année : "))
        genre = input("Genre : ")
        statut = input("Statut : ")
        while statut != "possédé" and statut != "souhaité":
            print("Statut invalide.")
            statut = input("Statut : ")
        return ajouter_jeu_donnees(ludotheque, titre, plateforme, annee, genre, statut)

    print(ajouter_jeu_donnees(ludotheque, "Celeste", "PC", 2018, "Plateforme", "possédé"))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["Hades", "PC", "2020", "Rogue", "possédé"]
    essai = {"The Legend of Zelda : Breath of the Wild": {"plateforme": "Switch", "annee": 2017, "genre": "Aventure", "statut": "possédé"}, "Elden Ring": {"plateforme": "PC", "annee": 2022, "genre": "RPG", "statut": "souhaité"}}
    assert ajouter_jeu_donnees(essai, "Celeste", "PC", 2018, "Plateforme", "possédé") is True, "Celeste est ajouté : True."
    assert essai["Celeste"] == {"plateforme": "PC", "annee": 2018, "genre": "Plateforme", "statut": "possédé"}, "Le dictionnaire interne de Celeste a les quatre clés."
    assert ajouter_jeu_donnees(essai, "Celeste", "Switch", 2019, "Autre", "souhaité") is False, "Le même titre une seconde fois : False."
    assert essai["Celeste"]["plateforme"] == "PC", "Celeste n'est pas remplacé."
    assert ajouter_jeu_donnees(essai, "Pong", "Arcade", 1949, "Sport", "possédé") is False, "Année hors de 1950 à 2100 : False."
    assert ajouter_jeu_donnees(essai, "Tetris", "GameBoy", 1989, "Puzzle", "prêté") is False, "Statut inconnu : False."
    assert ajouter_jeu_donnees(essai, "Tetris", "GameBoy", 1950, "Puzzle", "souhaité") is True, "1950 est une année acceptée."
    saisies = []
    def input(question=""):
        return saisies.pop(0)
    saisies[:] = ["Hades", "PC", "3000", "2020", "Rogue", "à moitié", "possédé"]
    assert ajouter_jeu(essai) is True, "ajouter_jeu pose les questions, redemande l'année et le statut refusés, puis ajoute."
    assert saisies == [] and essai["Hades"]["annee"] == 2020, "Seuls l'année et le statut refusés sont redemandés ; l'année est convertie en int."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="pjv-base-2" label="Afficher un jeu" type="python">
    <CodeDepart>
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

    def afficher_jeu(ludotheque, titre):
        if titre not in ludotheque:
            print("Jeu introuvable.")
            return False
        jeu = ludotheque[titre]
        print("Titre :", titre)
        print("Plateforme :", jeu["plateforme"])
        print("Année :", jeu["annee"])
        print("Genre :", jeu["genre"])
        print("Statut :", jeu["statut"])
        return True

    def ajouter_jeu_donnees(ludotheque, titre, plateforme, annee, genre, statut):
        if titre in ludotheque:
            print("Ce jeu est déjà dans la collection.")
            return False
        if annee < 1950 or annee > 2100:
            print("Année invalide.")
            return False
        if statut != "possédé" and statut != "souhaité":
            print("Statut invalide.")
            return False
        ludotheque[titre] = {"plateforme": plateforme, "annee": annee, "genre": genre, "statut": statut}
        return True
    ```
    </CodeDepart>
    <Enonce>
      `afficher_jeu` est déjà spécifiée. La vérifier sur Celeste après l'ajout : la fiche complète, avec l'année `2018` en entier, la plateforme `PC`, le genre `Plateforme` et le statut `possédé`.

    <Correction>
    ```python
    ajouter_jeu_donnees(ludotheque, "Celeste", "PC", 2018, "Plateforme", "possédé")
    afficher_jeu(ludotheque, "Celeste")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    lignes = [l.strip() for l in SORTIE.strip().splitlines()]
    assert lignes[-5:] == ["Titre : Celeste", "Plateforme : PC", "Année : 2018", "Genre : Plateforme", "Statut : possédé"], "Après l'ajout, afficher la fiche complète de Celeste."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="pjv-base-3" label="Rechercher" type="python">
    <CodeDepart>
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
    ludotheque["Celeste"] = {"plateforme": "PC", "annee": 2018, "genre": "Plateforme", "statut": "possédé"}

    def afficher_jeu(ludotheque, titre):
        if titre not in ludotheque:
            print("Jeu introuvable.")
            return False
        jeu = ludotheque[titre]
        print("Titre :", titre)
        print("Plateforme :", jeu["plateforme"])
        print("Année :", jeu["annee"])
        print("Genre :", jeu["genre"])
        print("Statut :", jeu["statut"])
        return True
    ```
    </CodeDepart>
    <Enonce>
      Écrire `rechercher_jeu(ludotheque)`. Elle demande `Titre : `, appelle `afficher_jeu`, et renvoie le même booléen.

      `"Celeste"` affiche la fiche. `"celeste"` affiche `Jeu introuvable.`

    <Correction>
    ```python
    def rechercher_jeu(ludotheque):
        titre = input("Titre : ")
        return afficher_jeu(ludotheque, titre)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["Celeste"]
    import io, contextlib
    def _sortie(fonction, *arguments):
        tampon = io.StringIO()
        with contextlib.redirect_stdout(tampon):
            valeur = fonction(*arguments)
        return valeur, tampon.getvalue()
    saisies = []
    def input(question=""):
        return saisies.pop(0)
    saisies[:] = ["Celeste"]
    valeur, texte = _sortie(rechercher_jeu, ludotheque)
    assert valeur is True and "Titre : Celeste" in texte, "Celeste : la fiche s'affiche et la fonction renvoie True."
    saisies[:] = ["celeste"]
    valeur, texte = _sortie(rechercher_jeu, ludotheque)
    assert valeur is False and "Jeu introuvable." in texte, "celeste en minuscules : Jeu introuvable. et False."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 3. Modifier et supprimer <Icone nom="pencil" />

<ExerciseTabs courseId="proj_jv_adv" courseTitle="Gestion Avancée">
  <ExerciseSection id="pjv-adv-1" label="Modifier un jeu" type="python">
    <CodeDepart>
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
    ludotheque["Celeste"] = {"plateforme": "PC", "annee": 2018, "genre": "Plateforme", "statut": "possédé"}

    def afficher_jeu(ludotheque, titre):
        if titre not in ludotheque:
            print("Jeu introuvable.")
            return False
        jeu = ludotheque[titre]
        print("Titre :", titre)
        print("Plateforme :", jeu["plateforme"])
        print("Année :", jeu["annee"])
        print("Genre :", jeu["genre"])
        print("Statut :", jeu["statut"])
        return True
    ```
    </CodeDepart>
    <Enonce>
      Écrire `modifier_jeu(ludotheque)`.

      1. Demander le titre. S'il est absent : `Jeu introuvable.`, `False`.
      2. Demander le champ : `plateforme`, `annee`, `genre` ou `statut`. Un autre mot affiche `Champ inconnu.` et redemande.
      3. Demander la nouvelle valeur. L'année et le statut suivent les mêmes contrôles que l'ajout.
      4. Mettre à jour uniquement ce champ, et renvoyer `True`.

      Passer le statut de Celeste à `souhaité`. Relancer l'affichage : la ligne Statut a changé, plateforme, année et genre non.

    <Correction>
    ```python
    def modifier_jeu(ludotheque):
        titre = input("Titre : ")
        if titre not in ludotheque:
            print("Jeu introuvable.")
            return False
        champ = input("Champ : ")
        while champ not in ("plateforme", "annee", "genre", "statut"):
            print("Champ inconnu.")
            champ = input("Champ : ")
        valeur = input("Nouvelle valeur : ")
        if champ == "annee":
            valeur = int(valeur)
            while valeur < 1950 or valeur > 2100:
                print("Année invalide.")
                valeur = int(input("Nouvelle valeur : "))
        if champ == "statut":
            while valeur != "possédé" and valeur != "souhaité":
                print("Statut invalide.")
                valeur = input("Nouvelle valeur : ")
        ludotheque[titre][champ] = valeur
        return True
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["Celeste", "statut", "souhaité"]
    import io, contextlib
    def _sortie(fonction, *arguments):
        tampon = io.StringIO()
        with contextlib.redirect_stdout(tampon):
            valeur = fonction(*arguments)
        return valeur, tampon.getvalue()
    saisies = []
    def input(question=""):
        return saisies.pop(0)
    essai = {"The Legend of Zelda : Breath of the Wild": {"plateforme": "Switch", "annee": 2017, "genre": "Aventure", "statut": "possédé"}, "Elden Ring": {"plateforme": "PC", "annee": 2022, "genre": "RPG", "statut": "souhaité"}}
    essai["Celeste"] = {"plateforme": "PC", "annee": 2018, "genre": "Plateforme", "statut": "possédé"}
    saisies[:] = ["Celeste", "couleur", "statut", "souhaité"]
    valeur, texte = _sortie(modifier_jeu, essai)
    assert valeur is True and saisies == [], "Champ inconnu : on redemande le champ, puis on modifie."
    assert "Champ inconnu." in texte, "Un champ inconnu affiche Champ inconnu."
    assert essai["Celeste"] == {"plateforme": "PC", "annee": 2018, "genre": "Plateforme", "statut": "souhaité"}, "Seul le statut de Celeste change."
    saisies[:] = ["Celeste", "annee", "2019"]
    _sortie(modifier_jeu, essai)
    assert essai["Celeste"]["annee"] == 2019, "Une nouvelle année est enregistrée en int."
    saisies[:] = ["Minecraft"]
    valeur, texte = _sortie(modifier_jeu, essai)
    assert valeur is False and "Jeu introuvable." in texte, "Titre absent : Jeu introuvable. et False."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="pjv-adv-2" label="Supprimer un jeu" type="python">
    <CodeDepart>
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
    </CodeDepart>
    <Enonce>
      Écrire `supprimer_jeu(ludotheque)`. Elle demande le titre. Jeu présent : retirer la clé (`del` ou `pop`) et renvoyer `True`. Jeu absent : `Jeu introuvable.` et `False`.

      La première suppression d'`Elden Ring` renvoie `True`. La seconde renvoie `False`. Zelda est toujours là.

    <Correction>
    ```python
    def supprimer_jeu(ludotheque):
        titre = input("Titre : ")
        if titre not in ludotheque:
            print("Jeu introuvable.")
            return False
        del ludotheque[titre]
        return True
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["Elden Ring"]
    import io, contextlib
    def _sortie(fonction, *arguments):
        tampon = io.StringIO()
        with contextlib.redirect_stdout(tampon):
            valeur = fonction(*arguments)
        return valeur, tampon.getvalue()
    saisies = []
    def input(question=""):
        return saisies.pop(0)
    essai = {"The Legend of Zelda : Breath of the Wild": {"plateforme": "Switch", "annee": 2017, "genre": "Aventure", "statut": "possédé"}, "Elden Ring": {"plateforme": "PC", "annee": 2022, "genre": "RPG", "statut": "souhaité"}}
    saisies[:] = ["Elden Ring"]
    valeur, _ = _sortie(supprimer_jeu, essai)
    assert valeur is True and "Elden Ring" not in essai, "La première suppression d'Elden Ring renvoie True."
    saisies[:] = ["Elden Ring"]
    valeur, texte = _sortie(supprimer_jeu, essai)
    assert valeur is False and "Jeu introuvable." in texte, "La seconde renvoie False et affiche Jeu introuvable."
    assert "The Legend of Zelda : Breath of the Wild" in essai, "Zelda est toujours là."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 4. Menu et rendu <Icone nom="clipboard-list" />

<ExerciseTabs courseId="proj_jv_menu" courseTitle="Interface">
  <ExerciseSection id="pjv-menu-1" label="Menu interactif" type="python">
    <CodeDepart>
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

    def afficher_jeu(ludotheque, titre):
        if titre not in ludotheque:
            print("Jeu introuvable.")
            return False
        jeu = ludotheque[titre]
        print("Titre :", titre)
        print("Plateforme :", jeu["plateforme"])
        print("Année :", jeu["annee"])
        print("Genre :", jeu["genre"])
        print("Statut :", jeu["statut"])
        return True

    def ajouter_jeu_donnees(ludotheque, titre, plateforme, annee, genre, statut):
        if titre in ludotheque:
            print("Ce jeu est déjà dans la collection.")
            return False
        if annee < 1950 or annee > 2100:
            print("Année invalide.")
            return False
        if statut != "possédé" and statut != "souhaité":
            print("Statut invalide.")
            return False
        ludotheque[titre] = {"plateforme": plateforme, "annee": annee, "genre": genre, "statut": statut}
        return True

    def ajouter_jeu(ludotheque):
        titre = input("Titre : ")
        plateforme = input("Plateforme : ")
        annee = int(input("Année : "))
        while annee < 1950 or annee > 2100:
            print("Année invalide.")
            annee = int(input("Année : "))
        genre = input("Genre : ")
        statut = input("Statut : ")
        while statut != "possédé" and statut != "souhaité":
            print("Statut invalide.")
            statut = input("Statut : ")
        return ajouter_jeu_donnees(ludotheque, titre, plateforme, annee, genre, statut)

    def rechercher_jeu(ludotheque):
        titre = input("Titre : ")
        return afficher_jeu(ludotheque, titre)

    def modifier_jeu(ludotheque):
        titre = input("Titre : ")
        if titre not in ludotheque:
            print("Jeu introuvable.")
            return False
        champ = input("Champ : ")
        while champ not in ("plateforme", "annee", "genre", "statut"):
            print("Champ inconnu.")
            champ = input("Champ : ")
        valeur = input("Nouvelle valeur : ")
        if champ == "annee":
            valeur = int(valeur)
            while valeur < 1950 or valeur > 2100:
                print("Année invalide.")
                valeur = int(input("Nouvelle valeur : "))
        if champ == "statut":
            while valeur != "possédé" and valeur != "souhaité":
                print("Statut invalide.")
                valeur = input("Nouvelle valeur : ")
        ludotheque[titre][champ] = valeur
        return True

    def supprimer_jeu(ludotheque):
        titre = input("Titre : ")
        if titre not in ludotheque:
            print("Jeu introuvable.")
            return False
        del ludotheque[titre]
        return True
    ```
    </CodeDepart>
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

    <Correction>
    ```python
    def afficher_collection(ludotheque):
        if len(ludotheque) == 0:
            print("La collection est vide.")
            return
        premier = True
        for titre in ludotheque:
            if not premier:
                print()
            afficher_jeu(ludotheque, titre)
            premier = False

    def menu_principal(ludotheque):
        while True:
            print("############### Gestionnaire de Jeux Vidéo ###############")
            print("# Application réalisée par : Votre Nom                   #")
            print("##########################################################")
            print("1. Ajouter un jeu")
            print("2. Afficher la collection complète")
            print("3. Rechercher un jeu")
            print("4. Modifier un jeu")
            print("5. Supprimer un jeu")
            print("6. Quitter")
            choix = input("Choix : ")
            if choix == "1":
                ajouter_jeu(ludotheque)
            elif choix == "2":
                afficher_collection(ludotheque)
            elif choix == "3":
                rechercher_jeu(ludotheque)
            elif choix == "4":
                modifier_jeu(ludotheque)
            elif choix == "5":
                supprimer_jeu(ludotheque)
            elif choix == "6":
                return
            else:
                print("Choix invalide.")

    menu_principal(ludotheque)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["6"]
    import io, contextlib
    def _sortie(fonction, *arguments):
        tampon = io.StringIO()
        with contextlib.redirect_stdout(tampon):
            valeur = fonction(*arguments)
        return valeur, tampon.getvalue()
    saisies = []
    def input(question=""):
        return saisies.pop(0)
    essai = {"The Legend of Zelda : Breath of the Wild": {"plateforme": "Switch", "annee": 2017, "genre": "Aventure", "statut": "possédé"}, "Elden Ring": {"plateforme": "PC", "annee": 2022, "genre": "RPG", "statut": "souhaité"}}
    valeur, texte = _sortie(afficher_collection, {})
    assert texte.strip() == "La collection est vide.", "Collection vide : La collection est vide."
    saisies[:] = ["1", "Celeste", "PC", "2018", "Plateforme", "possédé", "4", "Celeste", "statut", "souhaité", "5", "Elden Ring", "2", "5", "Elden Ring", "3", "celeste", "0", "6"]
    _, texte = _sortie(menu_principal, essai)
    assert saisies == [], "Le menu enchaîne le scénario puis s'arrête au choix 6."
    assert list(essai) == ["The Legend of Zelda : Breath of the Wild", "Celeste"], "Après le scénario : Zelda puis Celeste, Elden Ring supprimé."
    assert essai["Celeste"]["statut"] == "souhaité", "Le statut de Celeste est passé à souhaité."
    assert texte.count("Jeu introuvable.") == 2, "La seconde suppression d'Elden Ring et la recherche de celeste affichent Jeu introuvable."
    assert "Choix invalide." in texte, "Un choix hors de 1 à 6 affiche Choix invalide."
    _, texte = _sortie(afficher_collection, essai)
    blocs = texte.strip().split("\n\n")
    assert len(blocs) == 2 and blocs[0].startswith("Titre : The Legend of Zelda"), "La collection affiche Zelda puis Celeste, séparés par une ligne vide."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un fichier `ludotheque.py` : commentaire d'en-tête avec le nom et la classe, la collection de départ, les fonctions, le menu, et le scénario Celeste / Elden Ring qu'on peut relire dans le fichier.

## 5. Pour aller plus loin

*   **Sauvegarde.** Avec le module `json`, écrire la collection dans `ludotheque.json` au choix `6`, et la recharger au lancement si le fichier existe.
*   **Comptages.** Afficher combien de jeux sont `possédé`, combien sont `souhaité`, et combien de jeux il y a par plateforme.
*   **Liste souhaitée.** Une option du menu n'affiche que les jeux dont le statut vaut `souhaité`.
