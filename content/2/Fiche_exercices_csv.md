---
title: "Exercices : Traitement CSV"
description: "Cours sur Exercices : Traitement CSV"
level: premiere
chapter: "Dictionnaires et Tables"
icon: "📑"
badgeId: "premiere_fiche_exercices_csv"
---


<ExerciseTabs courseId="csv" courseTitle="Traitement de Tables">

  <ExerciseSection id="setup" label="Configuration">
    <Enonce>
    ### Chargement des données
    
    Pour ces exercices, nous utiliserons le fichier `communes.csv`.
    Voici le code pour charger les données dans une liste de dictionnaires :
    
    ```python
    import csv

    def charger_villes(fichier):
        villes = []
        try:
            with open(fichier, mode='r', encoding='utf-8') as f:
                reader = csv.DictReader(f, delimiter=';')
                for row in reader:
                    villes.append(dict(row))
        except FileNotFoundError:
            print(f"Fichier {fichier} non trouvé")
        return villes

    # Chargement global pour les exercices
    villes = charger_villes('communes.csv')
    
    # Exemple d'une ville (dictionnaire) :
    # {
    #   'code_commune_INSEE': '01001',
    #   'nom_commune_postal': "L'Abergement-Clémenciat",
    #   'code_postal': '01400',
    #   'latitude': '46.1667',
    #   'longitude': '4.9',
    #   ...
    # }
    ```
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="easy-csv" label="Easy - Affichage">
    <Enonce>
    ### Exercice Facile : Affichage simple
    
    **1. Noms des communes**
    Écrire une fonction `afficher_noms_communes(villes)` qui affiche le nom de toutes les communes (`nom_commune_postal`).
    *(Attention, il y en a beaucoup, affichez seulement les 5 premières pour tester)*
    
    **2. Recherche par Code Postal**
    Écrire une fonction `afficher_communes_par_code_postal(villes, code_postal)` qui affiche les noms des communes ayant ce code postal.
    
    **3. Coordonnées**
    Écrire une fonction `afficher_communes_avec_coordonnees(villes)` qui affiche pour chaque commune : "Nom : [latitude, longitude]".
    
    <Correction>
    ```python
    def afficher_noms_communes(villes):
        # Affiche les 5 premières pour l'exemple
        for i in range(min(5, len(villes))):
            print(villes[i]['nom_commune_postal'])

    def afficher_communes_par_code_postal(villes, code_postal):
        trouve = False
        for ville in villes:
            if ville['code_postal'] == code_postal:
                print(ville['nom_commune_postal'])
                trouve = True
        if not trouve:
            print("Aucune commune trouvée pour ce code postal.")

    def afficher_communes_avec_coordonnees(villes):
        # Affiche les 5 premières pour l'exemple
        for i in range(min(5, len(villes))):
            nom = villes[i]['nom_commune_postal']
            lat = villes[i]['latitude']
            lon = villes[i]['longitude']
            print(f"{nom} : [{lat}, {lon}]")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    # Jeu de données test réduit
    villes_test = [
        {'nom_commune_postal': 'Paris', 'code_postal': '75000', 'latitude': '48.85', 'longitude': '2.35', 'nom_departement': 'Paris'},
        {'nom_commune_postal': 'Lyon', 'code_postal': '69000', 'latitude': '45.75', 'longitude': '4.85', 'nom_departement': 'Rhône'}
    ]
    
    # Test Code Postal
    import io
    import sys
    
    # Capture stdout
    captured_output = io.StringIO()
    sys.stdout = captured_output
    afficher_communes_par_code_postal(villes_test, '75000')
    sys.stdout = sys.__stdout__
    assert 'Paris' in captured_output.getvalue()
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-csv" label="Medium - Filtrage">
    <Enonce>
    ### Exercice Moyen : Filtrage avancé
    
    **1. Par Département**
    Écrire une fonction `communes_par_departement(villes, departement)` qui **retourne une liste** des noms de communes du département donné (`nom_departement`).
    
    **2. Longueur du nom**
    Écrire une fonction `noms_longueur_min(villes, longueur)` qui retourne la liste des communes dont le nom a au moins `longueur` caractères.
    
    **3. Par Latitude**
    Écrire une fonction `communes_sud(villes, latitude_limite)` qui retourne la liste des communes situées au sud de la latitude donnée (latitude < latitude_limite).
    *Note : Les coordonnées sont des chaînes de caractères dans le CSV, pensez à les convertir en `float`.*
    
    <Correction>
    ```python
    def communes_par_departement(villes, departement):
        resultat = []
        for ville in villes:
            if ville['nom_departement'] == departement:
                resultat.append(ville['nom_commune_postal'])
        return resultat

    def noms_longueur_min(villes, longueur):
        resultat = []
        for ville in villes:
            if len(ville['nom_commune_postal']) >= longueur:
                resultat.append(ville['nom_commune_postal'])
        return resultat

    def communes_sud(villes, latitude_limite):
        resultat = []
        for ville in villes:
            # Conversion nécessaire car le CSV contient des strings
            try:
                lat = float(ville['latitude'])
                if lat < latitude_limite:
                    resultat.append(ville['nom_commune_postal'])
            except ValueError:
                continue # Ignorer les données invalides
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    villes_test = [
        {'nom_commune_postal': 'NordVille', 'nom_departement': 'Nord', 'latitude': '50.0'},
        {'nom_commune_postal': 'SudVille', 'nom_departement': 'Sud', 'latitude': '40.0'}
    ]
    
    assert 'NordVille' in communes_par_departement(villes_test, 'Nord')
    assert 'SudVille' not in communes_par_departement(villes_test, 'Nord')
    
    assert 'NordVille' in noms_longueur_min(villes_test, 5)
    
    assert 'SudVille' in communes_sud(villes_test, 45.0)
    assert 'NordVille' not in communes_sud(villes_test, 45.0)
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
