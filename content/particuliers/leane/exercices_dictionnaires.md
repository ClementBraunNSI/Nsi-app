---
title: "Exercices - Dictionnaires"
description: "Fiche d'exercices progressive pour maîtriser les dictionnaires"
level: "particuliers"
chapter: "Structures de données"
icon: "📝"
allowedStudents: ["Léane"]
---

<ExerciseTabs courseId="python-dicos-leane" courseTitle="Exercices Python - Dictionnaires">

  <ExerciseSection id="exo-1" label="1. Premiers pas">
    <Enonce>
    ### 🍼 Exercice 1 : Premiers pas

    Soit le dictionnaire suivant représentant les informations d'un livre :

    ```python
    livre = {
        "titre": "Les Misérables",
        "auteur": "Victor Hugo",
        "pages": 1400,
        "disponible": True
    }
    ```

    1.  Affiche le titre du livre.
    2.  Ajoute une clé `annee` avec la valeur `1862`.
    3.  Modifie le nombre de pages pour qu'il soit de `1500`.
    4.  Supprime la clé `disponible` et affiche le dictionnaire modifié.
    5.  Teste si la clé `auteur` est présente dans le dictionnaire.

    <Correction>
    ```python
    livre = {
        "titre": "Les Misérables",
        "auteur": "Victor Hugo",
        "pages": 1400,
        "disponible": True
    }

    # 1. Afficher le titre
    print(f"Titre : {livre['titre']}")

    # 2. Ajouter l'année
    livre["annee"] = 1862

    # 3. Modifier le nombre de pages
    livre["pages"] = 1500

    # 4. Supprimer la clé disponible
    if "disponible" in livre:
        del livre["disponible"]
    # ou : valeur = livre.pop("disponible")

    print("Dictionnaire modifié :", livre)

    # 5. Tester la présence de la clé auteur
    if "auteur" in livre:
        print("La clé 'auteur' est présente.")
    else:
        print("La clé 'auteur' est absente.")
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="exo-2" label="2. Compteur de fréquences">
    <Enonce>
    ### 📊 Exercice 2 : Compteur de fréquences

    On te donne une phrase. L'objectif est de compter combien de fois chaque lettre apparaît dans la phrase.

    ```python
    phrase = "ananas"
    # Résultat attendu : {'a': 3, 'n': 2, 's': 1}
    ```

    **Consigne :**
    Écris une fonction `frequences(texte)` qui prend une chaîne de caractères et renvoie un dictionnaire où :
    -   Les clés sont les caractères.
    -   Les valeurs sont le nombre d'apparitions.

    _Indice : Parcours la chaîne caractère par caractère. Si le caractère est déjà dans le dictionnaire, incrémente sa valeur. Sinon, initialise-le à 1._

    <Correction>
    ```python
    def frequences(texte):
        dico = {}
        for lettre in texte:
            if lettre in dico:
                # La lettre est déjà connue, on augmente le compteur
                dico[lettre] += 1
            else:
                # C'est la première fois qu'on voit cette lettre
                dico[lettre] = 1
        return dico

    # Test
    phrase = "ananas"
    resultat = frequences(phrase)
    print(resultat)
    # Affiche : {'a': 3, 'n': 2, 's': 1}
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="exo-3" label="3. Moyenne des notes">
    <Enonce>
    ### 🎓 Exercice 3 : Moyenne des notes

    Voici un dictionnaire contenant les notes d'élèves :

    ```python
    notes = {
        "Alice": 14,
        "Bob": 10,
        "Charlie": 18,
        "David": 12
    }
    ```

    1.  Écris un programme qui calcule la **moyenne** de la classe.
    2.  Écris un programme qui affiche le nom de l'élève ayant la **meilleure note**.

    _Indice : Utilise `.values()` pour la moyenne et `.items()` pour trouver le meilleur élève._

    <Correction>
    ```python
    notes = {
        "Alice": 14,
        "Bob": 10,
        "Charlie": 18,
        "David": 12
    }

    # 1. Calcul de la moyenne
    # On récupère toutes les notes avec .values()
    liste_notes = notes.values()
    somme = sum(liste_notes)
    nombre_eleves = len(notes)

    moyenne = somme / nombre_eleves
    print(f"La moyenne de la classe est : {moyenne}")

    # 2. Meilleur élève
    meilleur_eleve = ""
    meilleure_note = -1  # On commence très bas

    # On parcourt les couples (nom, note) avec .items()
    for nom, note in notes.items():
        if note > meilleure_note:
            meilleure_note = note
            meilleur_eleve = nom

    print(f"Meilleur élève : {meilleur_eleve} avec {meilleure_note}/20")
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="exo-4" label="4. Filtrage">
    <Enonce>
    ### 🧹 Exercice 4 : Filtrage

    On te donne un dictionnaire de produits avec leurs prix :

    ```python
    produits = {
        "Pomme": 0.50,
        "Banane": 0.30,
        "Mangue": 2.50,
        "Fraise": 4.00,
        "Kiwi": 0.80
    }
    ```

    Écris une fonction `filtrer_prix(dico, prix_max)` qui renvoie un **nouveau dictionnaire** ne contenant que les produits dont le prix est inférieur ou égal à `prix_max`.

    Exemple : `filtrer_prix(produits, 1.00)` doit renvoyer `{'Pomme': 0.5, 'Banane': 0.3, 'Kiwi': 0.8}`.

    <Correction>
    ```python
    def filtrer_prix(dico, prix_max):
        # On crée un dictionnaire vide pour le résultat
        resultat = {}
        
        # On parcourt le dictionnaire d'origine
        for produit, prix in dico.items():
            # Si le prix respecte la condition
            if prix <= prix_max:
                # On ajoute le produit au nouveau dictionnaire
                resultat[produit] = prix
                
        return resultat

    # Test
    produits = {
        "Pomme": 0.50,
        "Banane": 0.30,
        "Mangue": 2.50,
        "Fraise": 4.00,
        "Kiwi": 0.80
    }

    print(filtrer_prix(produits, 1.00))
    # Affiche : {'Pomme': 0.5, 'Banane': 0.3, 'Kiwi': 0.8}
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="exo-5" label="5. Inversion">
    <Enonce>
    ### 🔄 Exercice 5 : Inversion de dictionnaire

    On souhaite inverser un dictionnaire : les clés deviennent des valeurs et les valeurs deviennent des clés.
    On suppose ici que toutes les valeurs sont uniques.

    ```python
    dico_original = {"a": 1, "b": 2, "c": 3}
    # Résultat attendu : {1: "a", 2: "b", 3: "c"}
    ```

    Écris la fonction `inverser_dico(dico)`.

    <Correction>
    ```python
    def inverser_dico(dico):
        inverse = {}
        
        for cle, valeur in dico.items():
            # La valeur devient la clé, et la clé devient la valeur
            inverse[valeur] = cle
            
        return inverse

    # Test
    dico_original = {"a": 1, "b": 2, "c": 3}
    print(inverser_dico(dico_original))
    # Affiche : {1: 'a', 2: 'b', 3: 'c'}
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="exo-6" label="6. Mini-Projet Stock">
    <Enonce>
    ### 📦 Exercice 6 : Mini-Projet - Gestion de stock

    On modélise un stock de magasin avec un dictionnaire imbriqué.
    Chaque produit a un nom (clé principale) et ses détails sont un autre dictionnaire (quantité, prix).

    ```python
    stock = {
        "Pommes": {"quantite": 50, "prix": 0.60},
        "Bananes": {"quantite": 30, "prix": 0.40},
        "Poires": {"quantite": 20, "prix": 0.80}
    }
    ```

    1.  **Vente** : Écris une fonction `vendre(produit, qte)` qui :
        -   Vérifie si le produit existe.
        -   Vérifie s'il y a assez de stock.
        -   Si oui, décrémente la quantité et affiche le prix total à payer.
        -   Si non, affiche un message d'erreur.

    2.  **Réapprovisionnement** : Écris une fonction `ajouter_stock(produit, qte)` qui ajoute `qte` au stock existant.

    3.  **Valeur totale** : Calcule la valeur totale du stock (somme des `quantité * prix` pour chaque produit).

    <Correction>
    ```python
    stock = {
        "Pommes": {"quantite": 50, "prix": 0.60},
        "Bananes": {"quantite": 30, "prix": 0.40},
        "Poires": {"quantite": 20, "prix": 0.80}
    }

    def vendre(produit, qte):
        # 1. Vérifier si le produit existe
        if produit not in stock:
            print(f"Erreur : Le produit '{produit}' n'existe pas.")
            return

        # 2. Vérifier le stock
        stock_actuel = stock[produit]["quantite"]
        if stock_actuel < qte:
            print(f"Erreur : Stock insuffisant pour '{produit}' (reste {stock_actuel}).")
            return

        # 3. Effectuer la vente
        stock[produit]["quantite"] -= qte
        prix_unitaire = stock[produit]["prix"]
        total = qte * prix_unitaire
        print(f"Vente validée : {qte} {produit} pour {total:.2f}€")

    def ajouter_stock(produit, qte):
        if produit in stock:
            stock[produit]["quantite"] += qte
            print(f"Stock mis à jour pour {produit}. Nouvelle quantité : {stock[produit]['quantite']}")
        else:
            print(f"Le produit {produit} n'est pas référencé. Impossible d'ajouter du stock.")

    # Calcul de la valeur totale
    valeur_totale = 0
    for details in stock.values():
        valeur_totale += details["quantite"] * details["prix"]

    print(f"Valeur totale du stock : {valeur_totale:.2f}€")

    # Tests
    vendre("Pommes", 10)   # Ok
    vendre("Bananes", 100) # Erreur stock
    ajouter_stock("Poires", 50)
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="exo-7" label="7. Scrabble">
    <Enonce>
    ### 🎲 Exercice 7 : Scrabble (Pour aller plus loin)

    Voici les points associés à chaque lettre au Scrabble :

    ```python
    points = {
        "A": 1, "B": 3, "C": 3, "D": 2, "E": 1, "F": 4, "G": 2, "H": 4, "I": 1, "J": 8, "K": 10, "L": 1, "M": 2, "N": 1, "O": 1, "P": 3, "Q": 8, "R": 1, "S": 1, "T": 1, "U": 1, "V": 4, "W": 10, "X": 10, "Y": 10, "Z": 10
    }
    ```

    Écris une fonction `score_scrabble(mot)` qui prend un mot (en majuscules) et renvoie son score total.

    <Correction>
    ```python
    points = {
        "A": 1, "B": 3, "C": 3, "D": 2, "E": 1, "F": 4, "G": 2, "H": 4, "I": 1, "J": 8, "K": 10, "L": 1, "M": 2, "N": 1, "O": 1, "P": 3, "Q": 8, "R": 1, "S": 1, "T": 1, "U": 1, "V": 4, "W": 10, "X": 10, "Y": 10, "Z": 10
    }

    def score_scrabble(mot):
        score_total = 0
        
        # On s'assure que le mot est en majuscules
        mot = mot.upper()
        
        for lettre in mot:
            # On utilise .get() pour éviter une erreur si un caractère spécial est présent
            # Si la lettre n'est pas trouvée (ex: espace), on ajoute 0
            valeur = points.get(lettre, 0)
            score_total += valeur
            
        return score_total

    # Test
    print("Score PYTHON :", score_scrabble("PYTHON")) # P(3)+Y(10)+T(1)+H(4)+O(1)+N(1) = 20
    print("Score WHISKY :", score_scrabble("WHISKY")) # W(10)+H(4)+I(1)+S(1)+K(10)+Y(10) = 36
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
