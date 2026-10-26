---
title: 'Structures : Bibliothèque'
description: Système de gestion d'une collection de livres numériques en Python
level: premiere
chapter: Projets
icon: "library"
badgeId: premiere_gestion_bibliotheque
prerequisites:
  - projet_tournoi_esport
audience: public
---

# <Icone nom="library" /> Projet - Système de Gestion de Bibliothèque Numérique

Le but de ce projet est de créer un programme qui gère une collection de livres : ajout, recherche, affichage, suppression, et conservation des données dans un fichier CSV entre deux lancements.
Dans ce projet, chaque livre est un dictionnaire, et la bibliothèque est une liste de ces dictionnaires.

L'ISBN identifie un livre : deux fiches ne partagent pas le même ISBN.

## 1. Les livres <Icone nom="book-open" />

Une fiche contient :

*   `titre` (`str`)
*   `auteur` (`str`)
*   `annee_publication` (`int`)
*   `genre` (`str`)
*   `isbn` (`str`, unique)

<ExerciseTabs courseId="proj_lib_struct" courseTitle="Structure des Données">
  <ExerciseSection id="lib-struct-1" label="Initialisation" type="python">
    <Enonce>
      Créer `bibliotheque = []`. Chaque élément sera un dictionnaire avec les clés `titre`, `auteur`, `annee_publication`, `genre` et `isbn`.

      Les fonctions se testent d'abord sans fichier, sur cette liste écrite dans le programme.

    <Correction>
    ```python
    bibliotheque = []
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'bibliotheque' in globals(), "La liste doit s'appeler bibliotheque."
    assert bibliotheque == [], "bibliotheque doit être une liste vide au départ."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="lib-struct-2" label="Ajout d'un livre" type="python">
    <Enonce>
      Écrire `ajouter_livre(bibliotheque, titre, auteur, annee, genre, isbn)`.

      Parcourir la liste. Si un livre a déjà cet `isbn`, afficher `ISBN déjà présent.` et renvoyer `False`. La liste ne gagne pas de doublon.

      Sinon construire le dictionnaire, l'ajouter en fin de liste, et renvoyer `True`. `annee` est stockée en `int`.

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

    <Correction>
    ```python
    def ajouter_livre(bibliotheque, titre, auteur, annee, genre, isbn):
        for livre in bibliotheque:
            if livre["isbn"] == isbn:
                print("ISBN déjà présent.")
                return False
        bibliotheque.append({"titre": titre, "auteur": auteur, "annee_publication": int(annee), "genre": genre, "isbn": isbn})
        return True

    bibliotheque = []
    print(ajouter_livre(bibliotheque, "Les Misérables", "Victor Hugo", 1862, "Roman", "978123"))
    print(ajouter_livre(bibliotheque, "Notre-Dame de Paris", "Victor Hugo", 1831, "Roman", "978456"))
    print(ajouter_livre(bibliotheque, "Autre titre", "Autre auteur", 2000, "Essai", "978123"))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    essai = []
    assert ajouter_livre(essai, "Les Misérables", "Victor Hugo", 1862, "Roman", "978123") is True, "Un nouvel ISBN : ajouter_livre renvoie True."
    assert essai == [{"titre": "Les Misérables", "auteur": "Victor Hugo", "annee_publication": 1862, "genre": "Roman", "isbn": "978123"}], "Le livre ajouté a les clés titre, auteur, annee_publication, genre et isbn."
    assert ajouter_livre(essai, "Notre-Dame de Paris", "Victor Hugo", 1831, "Roman", "978456") is True, "Le deuxième livre est ajouté."
    assert ajouter_livre(essai, "Autre titre", "Autre auteur", 2000, "Essai", "978123") is False, "Un ISBN déjà présent : ajouter_livre renvoie False."
    assert len(essai) == 2, "Après le refus, la liste contient toujours deux livres."
    ajouter_livre(essai, "Dune", "Frank Herbert", "1965", "SF", "978789")
    assert essai[-1]["annee_publication"] == 1965, "L'année est stockée en int."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="lib-struct-3" label="Recherche" type="python">
    <CodeDepart>
    ```python
    bibliotheque = [
        {"titre": "Les Misérables", "auteur": "Victor Hugo", "annee_publication": 1862, "genre": "Roman", "isbn": "978123"},
        {"titre": "Notre-Dame de Paris", "auteur": "Victor Hugo", "annee_publication": 1831, "genre": "Roman", "isbn": "978456"},
    ]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `rechercher_livres(bibliotheque, critere, valeur)`.

      Si `critere` n'est pas l'une des cinq clés, renvoyer `[]`. Sinon renvoyer la liste des livres dont le champ, converti en texte avec `str(livre[critere])`, est égal à `valeur`. L'année `"1862"` tapée au clavier trouve ainsi l'entier `1862`. L'ordre d'ajout est conservé.

      La comparaison est exacte : `"victor hugo"` ne trouve pas `"Victor Hugo"`.

      *Tester avec :*

      - `rechercher_livres(bibliotheque, "auteur", "Victor Hugo")` : les deux dictionnaires de Hugo, tant qu'aucun n'a été supprimé ;
      - `rechercher_livres(bibliotheque, "annee_publication", "1862")` : uniquement Les Misérables ;
      - `rechercher_livres(bibliotheque, "editeur", "Folio")` : `[]`.

    <Correction>
    ```python
    def rechercher_livres(bibliotheque, critere, valeur):
        if critere not in ("titre", "auteur", "annee_publication", "genre", "isbn"):
            return []
        trouves = []
        for livre in bibliotheque:
            if str(livre[critere]) == valeur:
                trouves.append(livre)
        return trouves

    print(rechercher_livres(bibliotheque, "auteur", "Victor Hugo"))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    essai = [
        {"titre": "Les Misérables", "auteur": "Victor Hugo", "annee_publication": 1862, "genre": "Roman", "isbn": "978123"},
        {"titre": "Notre-Dame de Paris", "auteur": "Victor Hugo", "annee_publication": 1831, "genre": "Roman", "isbn": "978456"},
    ]
    assert rechercher_livres(essai, "auteur", "Victor Hugo") == essai, "Les deux livres de Victor Hugo, dans l'ordre d'ajout."
    assert rechercher_livres(essai, "annee_publication", "1862") == [essai[0]], "L'année 1862 tapée en texte trouve Les Misérables."
    assert rechercher_livres(essai, "editeur", "Folio") == [], "Un critère inconnu renvoie []."
    assert rechercher_livres(essai, "auteur", "victor hugo") == [], "La comparaison est exacte, majuscules comprises."
    assert rechercher_livres(essai, "isbn", "978456") == [essai[1]], "La recherche par ISBN fonctionne."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="lib-struct-4" label="Affichage" type="python">
    <CodeDepart>
    ```python
    bibliotheque = [
        {"titre": "Les Misérables", "auteur": "Victor Hugo", "annee_publication": 1862, "genre": "Roman", "isbn": "978123"},
        {"titre": "Notre-Dame de Paris", "auteur": "Victor Hugo", "annee_publication": 1831, "genre": "Roman", "isbn": "978456"},
    ]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `afficher_livre(livre)` : une seule ligne, avec le séparateur ` | `, dans l'ordre Titre, Auteur, Année, Genre, ISBN.

      ```text
      Titre : Les Misérables | Auteur : Victor Hugo | Année : 1862 | Genre : Roman | ISBN : 978123
      ```

      Écrire `afficher_tout(bibliotheque)`. Liste vide : `La bibliothèque est vide.` Sinon, une ligne par livre via `afficher_livre`.

    <Correction>
    ```python
    def afficher_livre(livre):
        print("Titre : " + livre["titre"] + " | Auteur : " + livre["auteur"] + " | Année : " + str(livre["annee_publication"]) + " | Genre : " + livre["genre"] + " | ISBN : " + livre["isbn"])

    def afficher_tout(bibliotheque):
        if len(bibliotheque) == 0:
            print("La bibliothèque est vide.")
        for livre in bibliotheque:
            afficher_livre(livre)

    afficher_tout(bibliotheque)
    afficher_tout([])
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
    essai = [
        {"titre": "Les Misérables", "auteur": "Victor Hugo", "annee_publication": 1862, "genre": "Roman", "isbn": "978123"},
        {"titre": "Notre-Dame de Paris", "auteur": "Victor Hugo", "annee_publication": 1831, "genre": "Roman", "isbn": "978456"},
    ]
    _, texte = _sortie(afficher_livre, essai[0])
    assert texte.strip() == "Titre : Les Misérables | Auteur : Victor Hugo | Année : 1862 | Genre : Roman | ISBN : 978123", "afficher_livre affiche : Titre : Les Misérables | Auteur : Victor Hugo | Année : 1862 | Genre : Roman | ISBN : 978123"
    _, texte = _sortie(afficher_tout, essai)
    assert len(texte.strip().splitlines()) == 2 and "Notre-Dame de Paris" in texte, "afficher_tout affiche une ligne par livre."
    _, texte = _sortie(afficher_tout, [])
    assert texte.strip() == "La bibliothèque est vide.", "Une liste vide affiche La bibliothèque est vide."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 2. Le fichier CSV <Icone nom="save" />

Fichier `bibliotheque.csv` attendu quand les deux livres sont encore là, virgule comme séparateur, UTF-8 :

```text
titre,auteur,annee_publication,genre,isbn
Les Misérables,Victor Hugo,1862,Roman,978123
Notre-Dame de Paris,Victor Hugo,1831,Roman,978456
```

L'en-tête est obligatoire : sans ces noms de colonnes, `DictWriter` et `DictReader` ne se parlent pas. Dans un CSV, tout est texte au départ : au chargement, `annee_publication` redevient un `int`.

<ExerciseTabs courseId="proj_lib_data" courseTitle="Persistance des Données">
  <ExerciseSection id="lib-data-1" label="Sauvegarde" type="python">
    <CodeDepart>
    ```python
    bibliotheque = [
        {"titre": "Les Misérables", "auteur": "Victor Hugo", "annee_publication": 1862, "genre": "Roman", "isbn": "978123"},
        {"titre": "Notre-Dame de Paris", "auteur": "Victor Hugo", "annee_publication": 1831, "genre": "Roman", "isbn": "978456"},
    ]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `sauvegarder(bibliotheque, nom_fichier)` avec le module `csv` et `DictWriter`.

      `fieldnames` vaut, dans cet ordre : `titre`, `auteur`, `annee_publication`, `genre`, `isbn`. Écrire l'en-tête, puis une ligne par livre. Ouvrir le fichier en écriture UTF-8.

      Après les deux ajouts de l'exemple, le fichier produit a trois lignes : l'en-tête et les deux livres. L'ISBN `978123` est sur la ligne des Misérables.

    <Correction>
    ```python
    import csv

    def sauvegarder(bibliotheque, nom_fichier):
        with open(nom_fichier, "w", encoding="utf-8", newline="") as f:
            ecrivain = csv.DictWriter(f, fieldnames=["titre", "auteur", "annee_publication", "genre", "isbn"])
            ecrivain.writeheader()
            for livre in bibliotheque:
                ecrivain.writerow(livre)

    sauvegarder(bibliotheque, "bibliotheque.csv")
    with open("bibliotheque.csv", encoding="utf-8") as f:
        print(f.read())
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    essai = [
        {"titre": "Les Misérables", "auteur": "Victor Hugo", "annee_publication": 1862, "genre": "Roman", "isbn": "978123"},
        {"titre": "Notre-Dame de Paris", "auteur": "Victor Hugo", "annee_publication": 1831, "genre": "Roman", "isbn": "978456"},
    ]
    sauvegarder(essai, "essai.csv")
    with open("essai.csv", encoding="utf-8") as f:
        lignes = [l.rstrip("\r\n") for l in f.read().strip().splitlines()]
    assert lignes[0] == "titre,auteur,annee_publication,genre,isbn", "La première ligne est l'en-tête : titre,auteur,annee_publication,genre,isbn"
    assert len(lignes) == 3, "Le fichier a trois lignes : l'en-tête et les deux livres."
    assert lignes[1] == "Les Misérables,Victor Hugo,1862,Roman,978123", "Deuxième ligne : Les Misérables,Victor Hugo,1862,Roman,978123"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="lib-data-2" label="Chargement" type="python">
    <CodeDepart>
    ```python
    import csv

    def sauvegarder(bibliotheque, nom_fichier):
        with open(nom_fichier, "w", encoding="utf-8", newline="") as f:
            ecrivain = csv.DictWriter(f, fieldnames=["titre", "auteur", "annee_publication", "genre", "isbn"])
            ecrivain.writeheader()
            for livre in bibliotheque:
                ecrivain.writerow(livre)

    def rechercher_livres(bibliotheque, critere, valeur):
        if critere not in ("titre", "auteur", "annee_publication", "genre", "isbn"):
            return []
        trouves = []
        for livre in bibliotheque:
            if str(livre[critere]) == valeur:
                trouves.append(livre)
        return trouves

    bibliotheque = [
        {"titre": "Les Misérables", "auteur": "Victor Hugo", "annee_publication": 1862, "genre": "Roman", "isbn": "978123"},
        {"titre": "Notre-Dame de Paris", "auteur": "Victor Hugo", "annee_publication": 1831, "genre": "Roman", "isbn": "978456"},
    ]

    sauvegarder(bibliotheque, "bibliotheque.csv")
    ```
    </CodeDepart>
    <Enonce>
      Écrire `charger(nom_fichier)`.

      Si le fichier n'existe pas, renvoyer `[]` sans message d'erreur bloquant. Le programme démarre quand même. S'il existe, le lire avec `DictReader` et reconstruire la liste. Convertir `annee_publication` en `int` à ce moment-là.

      Test : sauvegarder, repartir de `bibliotheque = []`, recharger. `rechercher_livres(..., "auteur", "Victor Hugo")` retrouve les deux livres, et `annee_publication` supporte une comparaison avec l'entier `1862`.

    <Correction>
    ```python
    import csv
    import os

    def charger(nom_fichier):
        if not os.path.exists(nom_fichier):
            return []
        bibliotheque = []
        with open(nom_fichier, encoding="utf-8", newline="") as f:
            for ligne in csv.DictReader(f):
                ligne["annee_publication"] = int(ligne["annee_publication"])
                bibliotheque.append(ligne)
        return bibliotheque

    bibliotheque = charger("bibliotheque.csv")
    print(rechercher_livres(bibliotheque, "auteur", "Victor Hugo"))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    essai = [
        {"titre": "Les Misérables", "auteur": "Victor Hugo", "annee_publication": 1862, "genre": "Roman", "isbn": "978123"},
        {"titre": "Notre-Dame de Paris", "auteur": "Victor Hugo", "annee_publication": 1831, "genre": "Roman", "isbn": "978456"},
    ]
    sauvegarder(essai, "essai2.csv")
    relu = charger("essai2.csv")
    assert [dict(l) for l in relu] == essai, "Après sauvegarde puis chargement, on retrouve les deux livres, avec les mêmes valeurs."
    assert relu[0]["annee_publication"] == 1862 and isinstance(relu[0]["annee_publication"], int), "annee_publication redevient un int."
    assert charger("absent.csv") == [], "Un fichier absent : charger renvoie []."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 3. Menu et suppression <Icone nom="trash-2" />

<ExerciseTabs courseId="proj_lib_ui" courseTitle="Menu Principal">
  <ExerciseSection id="lib-ui-2" label="Suppression" type="python">
    <CodeDepart>
    ```python
    bibliotheque = [
        {"titre": "Les Misérables", "auteur": "Victor Hugo", "annee_publication": 1862, "genre": "Roman", "isbn": "978123"},
        {"titre": "Notre-Dame de Paris", "auteur": "Victor Hugo", "annee_publication": 1831, "genre": "Roman", "isbn": "978456"},
    ]
    ```
    </CodeDepart>
    <Enonce>
      Écrire `supprimer_livre(bibliotheque, isbn)`.

      Parcourir la liste. Au premier livre dont l'ISBN est exactement celui demandé, le retirer et renvoyer `True`. On enlève au plus un livre. Si aucun livre ne correspond, afficher `ISBN introuvable.` et renvoyer `False`. La liste ne change pas.

      Sur l'exemple, `supprimer_livre(bibliotheque, "978456")` renvoie `True`. Il ne reste que Les Misérables. Un second appel avec `"978456"` renvoie `False`.

    <Correction>
    ```python
    def supprimer_livre(bibliotheque, isbn):
        for i in range(len(bibliotheque)):
            if bibliotheque[i]["isbn"] == isbn:
                del bibliotheque[i]
                return True
        print("ISBN introuvable.")
        return False

    print(supprimer_livre(bibliotheque, "978456"))
    print(supprimer_livre(bibliotheque, "978456"))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    essai = [
        {"titre": "Les Misérables", "auteur": "Victor Hugo", "annee_publication": 1862, "genre": "Roman", "isbn": "978123"},
        {"titre": "Notre-Dame de Paris", "auteur": "Victor Hugo", "annee_publication": 1831, "genre": "Roman", "isbn": "978456"},
    ]
    assert supprimer_livre(essai, "978456") is True, "Un ISBN présent : supprimer_livre renvoie True."
    assert [l["isbn"] for l in essai] == ["978123"], "Il ne reste que Les Misérables."
    assert supprimer_livre(essai, "978456") is False, "Un ISBN absent : supprimer_livre renvoie False."
    assert len(essai) == 1, "Un refus ne change pas la liste."
    double = [{"isbn": "1"}, {"isbn": "1"}]
    supprimer_livre(double, "1")
    assert len(double) == 1, "On enlève au plus un livre."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="lib-ui-1" label="Menu interactif" type="python">
    <CodeDepart>
    ```python
    def ajouter_livre(bibliotheque, titre, auteur, annee, genre, isbn):
        for livre in bibliotheque:
            if livre["isbn"] == isbn:
                print("ISBN déjà présent.")
                return False
        bibliotheque.append({"titre": titre, "auteur": auteur, "annee_publication": int(annee), "genre": genre, "isbn": isbn})
        return True

    def rechercher_livres(bibliotheque, critere, valeur):
        if critere not in ("titre", "auteur", "annee_publication", "genre", "isbn"):
            return []
        trouves = []
        for livre in bibliotheque:
            if str(livre[critere]) == valeur:
                trouves.append(livre)
        return trouves

    def afficher_livre(livre):
        print("Titre : " + livre["titre"] + " | Auteur : " + livre["auteur"] + " | Année : " + str(livre["annee_publication"]) + " | Genre : " + livre["genre"] + " | ISBN : " + livre["isbn"])

    def afficher_tout(bibliotheque):
        if len(bibliotheque) == 0:
            print("La bibliothèque est vide.")
        for livre in bibliotheque:
            afficher_livre(livre)

    import csv

    def sauvegarder(bibliotheque, nom_fichier):
        with open(nom_fichier, "w", encoding="utf-8", newline="") as f:
            ecrivain = csv.DictWriter(f, fieldnames=["titre", "auteur", "annee_publication", "genre", "isbn"])
            ecrivain.writeheader()
            for livre in bibliotheque:
                ecrivain.writerow(livre)

    import csv
    import os

    def charger(nom_fichier):
        if not os.path.exists(nom_fichier):
            return []
        bibliotheque = []
        with open(nom_fichier, encoding="utf-8", newline="") as f:
            for ligne in csv.DictReader(f):
                ligne["annee_publication"] = int(ligne["annee_publication"])
                bibliotheque.append(ligne)
        return bibliotheque

    def supprimer_livre(bibliotheque, isbn):
        for i in range(len(bibliotheque)):
            if bibliotheque[i]["isbn"] == isbn:
                del bibliotheque[i]
                return True
        print("ISBN introuvable.")
        return False
    ```
    </CodeDepart>
    <Enonce>
      Écrire `menu_principal`. Au début de la fonction, charger les données avec `bibliotheque = charger("bibliotheque.csv")`.

      ```text
      --- MA BIBLIOTHÈQUE ---
      1. Ajouter un livre
      2. Rechercher un livre
      3. Afficher tout
      4. Supprimer un livre (par ISBN)
      5. Sauvegarder et quitter
      ```

      Le choix `1` demande les cinq champs, dans l'ordre titre, auteur, année, genre, ISBN. L'année tapée est convertie en `int`. Le choix `2` demande le critère puis la valeur, affiche chaque livre trouvé, ou `Aucun résultat.` si la liste renvoyée est vide. Le choix `4` demande l'ISBN et appelle `supprimer_livre`. Le choix `5` appelle `sauvegarder` puis termine. Tout autre choix affiche `Choix invalide.`

      Le CSV réécrit après avoir supprimé `978456` ne contient plus Notre-Dame de Paris.
      Les fonctions des étapes précédentes sont déjà dans l'éditeur. Appeler `menu_principal()` à la fin du programme.

    <Correction>
    ```python
    def menu_principal():
        bibliotheque = charger("bibliotheque.csv")
        while True:
            print("--- MA BIBLIOTHÈQUE ---")
            print("1. Ajouter un livre")
            print("2. Rechercher un livre")
            print("3. Afficher tout")
            print("4. Supprimer un livre (par ISBN)")
            print("5. Sauvegarder et quitter")
            choix = input("Choix : ")
            if choix == "1":
                titre = input("Titre : ")
                auteur = input("Auteur : ")
                annee = int(input("Année : "))
                genre = input("Genre : ")
                isbn = input("ISBN : ")
                ajouter_livre(bibliotheque, titre, auteur, annee, genre, isbn)
            elif choix == "2":
                critere = input("Critère : ")
                valeur = input("Valeur : ")
                trouves = rechercher_livres(bibliotheque, critere, valeur)
                if len(trouves) == 0:
                    print("Aucun résultat.")
                for livre in trouves:
                    afficher_livre(livre)
            elif choix == "3":
                afficher_tout(bibliotheque)
            elif choix == "4":
                supprimer_livre(bibliotheque, input("ISBN : "))
            elif choix == "5":
                sauvegarder(bibliotheque, "bibliotheque.csv")
                return
            else:
                print("Choix invalide.")

    menu_principal()
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["5"]
    import io, contextlib, os
    if os.path.exists("bibliotheque.csv"):
        os.remove("bibliotheque.csv")
    saisies = ["1", "Les Misérables", "Victor Hugo", "1862", "Roman", "978123", "1", "Notre-Dame de Paris", "Victor Hugo", "1831", "Roman", "978456", "2", "auteur", "Zola", "4", "978456", "8", "5"]
    def input(question=""):
        return saisies.pop(0)
    tampon = io.StringIO()
    with contextlib.redirect_stdout(tampon):
        menu_principal()
    texte = tampon.getvalue()
    assert saisies == [], "Le menu lit les saisies dans l'ordre : choix, puis les champs titre, auteur, année, genre, ISBN ; et s'arrête au choix 5."
    assert "Aucun résultat." in texte, "Une recherche sans résultat affiche Aucun résultat."
    assert "Choix invalide." in texte, "Un choix inconnu affiche Choix invalide."
    with open("bibliotheque.csv", encoding="utf-8") as f:
        contenu = f.read()
    assert "Les Misérables" in contenu and "Notre-Dame de Paris" not in contenu, "Le choix 5 sauvegarde : le CSV contient Les Misérables, plus Notre-Dame de Paris."
    saisies = ["3", "5"]
    tampon = io.StringIO()
    with contextlib.redirect_stdout(tampon):
        menu_principal()
    assert "Les Misérables" in tampon.getvalue(), "Au lancement suivant, le menu recharge le CSV."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.**

*   `bibliotheque.py`, avec un commentaire d'en-tête (nom et classe), les fonctions, et le menu qui charge le CSV au démarrage et le réécrit au choix Quitter ;
*   un `bibliotheque.csv` produit par `sauvegarder`, contenant au moins les deux livres de l'exemple.
