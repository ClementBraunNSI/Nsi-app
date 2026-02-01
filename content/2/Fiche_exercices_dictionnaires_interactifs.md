---
title: "Exercices : Dictionnaires"
description: "Cours sur Exercices : Dictionnaires"
level: premiere
chapter: "Dictionnaires et Tables"
icon: "📖"
badgeId: "premiere_fiche_exercices_dictionnaires_interactifs"
---


<ExerciseTabs courseId="dictionnaires" courseTitle="Dictionnaires">

  <ExerciseSection id="intro" label="Introduction">
    <Enonce>
    ### Exercice Intro : Manipulation de base
    
    Un dictionnaire `notes` représente les notes d'une interrogation.
    ```python
    notes = {
        'Alice': 15,
        'Bob': 12,
        'Charlie': 18,
        'Diana': 14
    }
    ```
    
    **1. Affichage**
    Écrire une fonction `afficher_notes(notes)` qui affiche la moyenne de chaque élève.
    Ajouter un commentaire : `"Excellent"` (≥ 16), `"Bien"` (12-15), `"À améliorer"` (< 12).
    
    **2. Ajout**
    Écrire une fonction `ajouter_eleve(notes, nom, moyenne)` qui ajoute un nouvel élève si celui-ci n'existe pas déjà.
    
    <Correction>
    ```python
    def afficher_notes(notes):
        for eleve in notes:
            moyenne = notes[eleve]
            print(f"{eleve} a une moyenne de {moyenne}.")
            if moyenne >= 16:
                print("Excellent")
            elif 12 <= moyenne <= 15:
                print("Bien")
            else:
                print("À améliorer")

    def ajouter_eleve(notes, nom, moyenne):
        if nom in notes:
            print(f"L'élève {nom} existe déjà !")
        else:
            notes[nom] = moyenne
            print(f"L'élève {nom} a été ajouté avec la moyenne de {moyenne}")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    notes = {'Alice': 15}
    
    # Test Ajout
    ajouter_eleve(notes, 'Eve', 16)
    assert 'Eve' in notes
    assert notes['Eve'] == 16
    
    # Test Doublon
    ajouter_eleve(notes, 'Alice', 0)
    assert notes['Alice'] == 15
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="easy-notes" label="Easy - Notes">
    <Enonce>
    ### Exercice Facile : Gestion des notes
    
    On reprend le dictionnaire `notes`.
    
    **1. Modification**
    Écrire une fonction `modifier_moyenne(notes, nom, nouvelle_moyenne)` qui modifie la moyenne d'un élève. Gérer le cas où l'élève n'existe pas.
    
    **2. Mention**
    Écrire une fonction `eleves_mention(notes, seuil)` qui renvoie la liste des élèves ayant une moyenne ≥ seuil.
    
    <Correction>
    ```python
    def modifier_moyenne(notes, nom, nouvelle_moyenne):
        if nom in notes:
            notes[nom] = nouvelle_moyenne
            print(f"La moyenne de {nom} a été mise à jour à {nouvelle_moyenne}")
        else:
            print(f"L'élève {nom} n'existe pas")

    def eleves_mention(notes, seuil):
        eleves_avec_mention = []
        for eleve in notes:
            if notes[eleve] >= seuil:
                eleves_avec_mention.append(eleve)
        return eleves_avec_mention
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    notes = {'Alice': 15, 'Bob': 10}
    
    # Test Modification
    modifier_moyenne(notes, 'Alice', 18)
    assert notes['Alice'] == 18
    modifier_moyenne(notes, 'Inconnu', 20) # Ne doit pas planter
    
    # Test Mention
    assert 'Alice' in eleves_mention(notes, 12)
    assert 'Bob' not in eleves_mention(notes, 12)
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="easy-concessionnaire" label="Easy - Voitures">
    <Enonce>
    ### Exercice Facile : Concessionnaire
    
    ```python
    voitures = {
        'Peugeot 208': {'prix': 15000, 'couleur': 'rouge', 'année': 2020},
        'Renault Clio': {'prix': 12000, 'couleur': 'bleu', 'année': 2019}
    }
    ```
    
    **1. Recherche par couleur**
    Écrire une fonction `voitures_par_couleur(voitures, couleur)` qui renvoie la liste des modèles de cette couleur.
    
    **2. Recherche par budget**
    Écrire une fonction `voitures_budget(voitures, budget)` qui renvoie les modèles dont le prix est ≤ budget.
    
    <Correction>
    ```python
    def voitures_par_couleur(voitures, couleur):
        voitures_couleur = []
        for modele, infos in voitures.items():
            if infos['couleur'] == couleur:
                voitures_couleur.append(modele)
        return voitures_couleur

    def voitures_budget(voitures, budget):
        voitures_abordables = []
        for modele, infos in voitures.items():
            if infos['prix'] <= budget:
                voitures_abordables.append(modele)
        return voitures_abordables
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    voitures = {
        'A': {'prix': 10000, 'couleur': 'rouge'},
        'B': {'prix': 20000, 'couleur': 'bleu'},
        'C': {'prix': 15000, 'couleur': 'rouge'}
    }
    
    assert set(voitures_par_couleur(voitures, 'rouge')) == {'A', 'C'}
    assert set(voitures_budget(voitures, 16000)) == {'A', 'C'}
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="easy-inventaire" label="Easy - Inventaire">
    <Enonce>
    ### Exercice Facile : Inventaire
    
    ```python
    inventaire = {
        'pommes': {'prix': 2.5, 'stock': 50},
        'bananes': {'prix': 1.8, 'stock': 30},
        'oranges': {'prix': 3.0, 'stock': 5}
    }
    ```
    
    Écrire les fonctions suivantes :
    1. `afficher_inventaire()` : affiche produit, prix et stock.
    2. `produits_en_rupture()` : retourne la liste des produits avec un stock ≤ 10.
    3. `valeur_totale_stock()` : calcule la valeur totale (prix × stock).
    
    <Correction>
    ```python
    def afficher_inventaire():
        print("=== INVENTAIRE ===")
        for produit, infos in inventaire.items():
            print(f"{produit}: {infos['prix']}€ - Stock: {infos['stock']}")

    def produits_en_rupture():
        rupture = []
        for produit, infos in inventaire.items():
            if infos['stock'] <= 10:
                rupture.append(produit)
        return rupture

    def valeur_totale_stock():
        total = 0
        for infos in inventaire.values():
            total += infos['prix'] * infos['stock']
        return total
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    inventaire = {
        'pommes': {'prix': 2.5, 'stock': 50},
        'oranges': {'prix': 3.0, 'stock': 5}
    }
    
    assert 'oranges' in produits_en_rupture()
    assert 'pommes' not in produits_en_rupture()
    assert valeur_totale_stock() == (2.5*50 + 3.0*5)
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-biblio" label="Medium - Bibliothèque">
    <Enonce>
    ### Exercice Moyen : Bibliothèque
    
    ```python
    bibliotheque = {
        'Le Petit Prince': {'auteur': 'Saint-Exupéry', 'disponible': True},
        '1984': {'auteur': 'Orwell', 'disponible': False}
    }
    ```
    
    1. `livres_disponibles(bibliotheque)` : renvoie la liste des titres disponibles.
    2. `emprunter_livre(bibliotheque, titre)` : passe `disponible` à `False` si le livre est dispo.
    
    <Correction>
    ```python
    def livres_disponibles(bibliotheque):
        livres_dispo = []
        for titre, infos in bibliotheque.items():
            if infos['disponible']:
                livres_dispo.append(titre)
        return livres_dispo

    def emprunter_livre(bibliotheque, titre):
        if titre in bibliotheque:
            if bibliotheque[titre]['disponible']:
                bibliotheque[titre]['disponible'] = False
                return "Livre emprunté"
            else:
                return "Livre déjà emprunté"
        return "Livre non trouvé"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    bib = {'A': {'disponible': True}, 'B': {'disponible': False}}
    assert livres_disponibles(bib) == ['A']
    
    emprunter_livre(bib, 'A')
    assert bib['A']['disponible'] == False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-contacts" label="Medium - Contacts">
    <Enonce>
    ### Exercice Moyen : Contacts
    
    ```python
    contacts = {
        'Alice': {'téléphone': '0123456789', 'ville': 'Paris'},
        'Bob': {'téléphone': '0987654321', 'ville': 'Lyon'}
    }
    ```
    
    1. `rechercher_contact(nom)` : affiche les infos.
    2. `contacts_par_ville(ville)` : liste des noms dans cette ville.
    3. `modifier_telephone(nom, nouveau_tel)` : met à jour le numéro.
    
    <Correction>
    ```python
    def rechercher_contact(nom):
        if nom in contacts:
            print(f"Informations de {nom}:")
            for k, v in contacts[nom].items():
                print(f"  {k}: {v}")
        else:
            print(f"Contact {nom} non trouvé.")

    def contacts_par_ville(ville):
        res = []
        for nom, infos in contacts.items():
            if infos['ville'] == ville:
                res.append(nom)
        return res

    def modifier_telephone(nom, nouveau_tel):
        if nom in contacts:
            contacts[nom]['téléphone'] = nouveau_tel
            print("Mis à jour.")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    contacts = {
        'Alice': {'téléphone': '01', 'ville': 'Paris'},
        'Bob': {'téléphone': '02', 'ville': 'Lyon'}
    }
    assert contacts_par_ville('Paris') == ['Alice']
    modifier_telephone('Alice', '99')
    assert contacts['Alice']['téléphone'] == '99'
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-notes" label="Medium - Notes">
    <Enonce>
    ### Exercice Moyen : Système de notes (Liste)
    
    ```python
    classe = {
        'Alice': { 'Maths': [15, 12], 'Français': [14] },
        'Bob': { 'Maths': [10], 'Français': [13, 11] }
    }
    ```
    
    1. `moyenne_matiere(eleve, matiere)` : moyenne de l'élève dans la matière.
    2. `moyenne_generale(eleve)` : moyenne de toutes les moyennes par matière.
    3. `ajouter_note(eleve, matiere, note)` : ajoute une note.
    
    <Correction>
    ```python
    def moyenne_matiere(eleve, matiere):
        if eleve in classe and matiere in classe[eleve]:
            notes = classe[eleve][matiere]
            if notes:
                return round(sum(notes) / len(notes), 2)
        return 0

    def moyenne_generale(eleve):
        if eleve in classe:
            moyennes = []
            for mat in classe[eleve]:
                m = moyenne_matiere(eleve, mat)
                moyennes.append(m)
            if moyennes:
                return round(sum(moyennes) / len(moyennes), 2)
        return 0

    def ajouter_note(eleve, matiere, note):
        if eleve in classe:
            if matiere not in classe[eleve]:
                classe[eleve][matiere] = []
            classe[eleve][matiere].append(note)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    classe = {'Test': {'M1': [10, 20]}}
    assert moyenne_matiere('Test', 'M1') == 15
    ajouter_note('Test', 'M1', 0)
    assert moyenne_matiere('Test', 'M1') == 10  # (10+20+0)/3 = 10
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-ventes" label="Medium - Ventes">
    <Enonce>
    ### Exercice Moyen : Analyse de ventes
    
    ```python
    ventes = {
        'Janvier': {'A': 150, 'B': 200},
        'Février': {'A': 180, 'B': 150}
    }
    ```
    
    1. `ventes_totales_mois(mois)`
    2. `ventes_totales_produit(produit)`
    3. `produit_le_plus_vendu()` : produit avec le plus de ventes totales.
    
    <Correction>
    ```python
    def ventes_totales_mois(mois):
        if mois in ventes:
            return sum(ventes[mois].values())
        return 0

    def ventes_totales_produit(produit):
        total = 0
        for m in ventes:
            if produit in ventes[m]:
                total += ventes[m][produit]
        return total

    def produit_le_plus_vendu():
        produits = set()
        for m in ventes:
            produits.update(ventes[m].keys())
        
        meilleur = None
        max_ventes = -1
        
        for p in produits:
            total = ventes_totales_produit(p)
            if total > max_ventes:
                max_ventes = total
                meilleur = p
        return meilleur, max_ventes
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ventes = {'J': {'A': 10, 'B': 5}, 'F': {'A': 5, 'B': 5}}
    assert ventes_totales_mois('J') == 15
    assert ventes_totales_produit('A') == 15
    assert produit_le_plus_vendu()[0] == 'A'
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="hard-inventaire" label="Hard - Inventaire">
    <Enonce>
    ### Exercice Difficile : Inventaire Avancé
    
    ```python
    inventaire = {
        'pommes': {'quantite': 50, 'prix': 2.5, 'categorie': 'fruits'},
        'bananes': {'quantite': 30, 'prix': 1.8, 'categorie': 'fruits'},
        'carottes': {'quantite': 25, 'prix': 1.2, 'categorie': 'legumes'}
    }
    ```
    
    1. `valeur_totale_inventaire(inventaire)`
    2. `produit_plus_cher(inventaire)` : retourne `(nom, prix)`.
    3. `produits_par_categorie(inventaire, categorie)`
    
    <Correction>
    ```python
    def valeur_totale_inventaire(inventaire):
        total = 0
        for infos in inventaire.values():
            total += infos['quantite'] * infos['prix']
        return total

    def produit_plus_cher(inventaire):
        nom_max = None
        prix_max = -1
        for nom, infos in inventaire.items():
            if infos['prix'] > prix_max:
                prix_max = infos['prix']
                nom_max = nom
        return nom_max, prix_max

    def produits_par_categorie(inventaire, categorie):
        res = []
        for nom, infos in inventaire.items():
            if infos['categorie'] == categorie:
                res.append(nom)
        return res
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    inv = {
        'A': {'quantite': 10, 'prix': 100, 'categorie': 'X'},
        'B': {'quantite': 5, 'prix': 200, 'categorie': 'Y'}
    }
    assert valeur_totale_inventaire(inv) == 2000
    assert produit_plus_cher(inv) == ('B', 200)
    assert produits_par_categorie(inv, 'X') == ['A']
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="hard-freq" label="Hard - Fréquence">
    <Enonce>
    ### Exercice Difficile : Fréquence de mots
    
    Écrire une fonction `compter_mots(texte)` qui compte la fréquence de chaque mot dans un texte.
    La fonction doit ignorer la casse (tout mettre en minuscule) et la ponctuation.
    
    Exemple: `"Salut salut!"` -> `{'salut': 2}`
    
    <Correction>
    ```python
    import string

    def compter_mots(texte):
        # Nettoyage
        texte = texte.lower()
        for p in string.punctuation:
            texte = texte.replace(p, '')
        
        mots = texte.split()
        freq = {}
        for mot in mots:
            freq[mot] = freq.get(mot, 0) + 1
        return freq
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    texte = "Bonjour, le monde! Bonjour le monde."
    res = compter_mots(texte)
    assert res['bonjour'] == 2
    assert res['monde'] == 2
    assert res['le'] == 2
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
