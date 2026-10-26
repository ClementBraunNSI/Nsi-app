---
title: 'Fiche d''exercices : Les boucles en Python'
description: Exercices sur les boucles (for/while) en Python.
level: seconde
chapter: Programmation Python
icon: "refresh-cw"
prerequisites:
  - structures_conditionnelles
audience: public
---

<ExerciseTabs courseId="fiche-boucles" courseTitle="Fiche Boucles">
  <ExerciseSection id="boucles-1" label="Important - Consignes importantes" type="lecture">
    <Enonce>
      ### Important <Icone nom="triangle-alert" /> - Consignes importantes

      **Pour tous les exercices :**

      - Ne pas oublier les deux points `:` après la boucle
      - Faire attention à l'indentation dans la boucle
      - Tester le code avec différentes valeurs
      - Créer un fichier Python différent pour chaque exercice (ex: `exercice1.py`, `exercice2.py`, etc.)
      - Recopier les programmes sur le cahier pour pouvoir les réviser plus tard
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="boucles-2" label="Introduction - Compte à rebours" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Compte à rebours

      **Écrire un programme qui :**

      - Demande un nombre de départ
      - Affiche le compte à rebours jusqu'à 0

      *Pour la vérification, stocker le nombre de départ dans une variable `n` et la liste des nombres affichés dans une variable `rebours` (ex: `[5, 4, 3, 2, 1, 0]`).*

    <Correction>
    ```python
    n = int(input("Nombre de départ : "))
    rebours = []
    for i in range(n, -1, -1):
        print(i)
        rebours.append(i)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["5"]
    assert n == 5 and rebours == [5, 4, 3, 2, 1, 0], "Pour 5, rebours vaut [5, 4, 3, 2, 1, 0]."
    assert [l.strip() for l in SORTIE.strip().splitlines()][-6:] == ["5", "4", "3", "2", "1", "0"], "Le programme affiche 5, 4, 3, 2, 1, 0, un nombre par ligne."
    variables, sortie = relancer(["0"])
    assert variables["rebours"] == [0], "Pour 0, rebours vaut [0]."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-3" label="Introduction - Tables de multiplication" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Tables de multiplication

      **Écrire un programme qui :**

      - Demande un nombre
      - Affiche sa table de multiplication de 1 à 10

      *Pour la vérification, stocker le nombre choisi dans `n` et la liste des résultats dans `table` (ex: `[5, 10, ..., 50]`).*

    <Correction>
    ```python
    n = int(input("Nombre : "))
    table = []
    for i in range(1, 11):
        print(i, "x", n, "=", i * n)
        table.append(i * n)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["5"]
    assert n == 5 and table == [5, 10, 15, 20, 25, 30, 35, 40, 45, 50], "Table de 5 : [5, 10, …, 50]."
    assert "50" in SORTIE, "Le programme affiche la table."
    variables, sortie = relancer(["7"])
    assert variables["table"] == [7 * i for i in range(1, 11)], "Table de 7."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-4" label="Introduction - Escalier d'étoiles" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Escalier d'étoiles

      **Écrire un programme qui :**

      - Demande un nombre n
      - Affiche un escalier de n marches avec des étoiles

      *Astuce : pour afficher `x` fois un caractère, on peut utiliser la syntaxe `'x' * n`.*

      *La chaîne de caractère "XXXXX" peut être créée via la syntaxe python suivante :*

      ```python
      chaine_1 = "XXXXX"
      chaine_2 = "X"*5
      # avec chaine_1 == chaine_2
      ```

      *Exemple pour n=3:*

      ```
      *
      **
      ***
      ```

      *Pour la vérification, stocker le nombre de marches dans `n` et la liste des lignes (chaînes de caractères) dans `lignes` (ex: `['*', '**', '***']`).*

    <Correction>
    ```python
    n = int(input("Nombre de marches : "))
    lignes = []
    for i in range(1, n + 1):
        print("*" * i)
        lignes.append("*" * i)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["3"]
    assert n == 3 and lignes == ["*", "**", "***"], "Pour 3 : ['*', '**', '***']."
    assert [l.strip() for l in SORTIE.strip().splitlines()][-3:] == ["*", "**", "***"], "L'escalier s'affiche ligne par ligne."
    variables, sortie = relancer(["5"])
    assert variables["lignes"][-1] == "*****" and len(variables["lignes"]) == 5, "Pour 5 : 5 marches, la dernière a 5 étoiles."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-5" label="Introduction - Somme des nombres" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Somme des nombres

      **Écrire un programme qui :**

      - Demande un nombre n
      - Calcule la somme des nombres de 1 à n
      - Affiche le résultat

      *Pour la vérification, stocker le nombre choisi dans `n` et le résultat dans `somme`.*

    <Correction>
    ```python
    n = int(input("Nombre : "))
    somme = 0
    for i in range(1, n + 1):
        somme = somme + i
    print(somme)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["10"]
    assert n == 10 and somme == 55, "Somme de 1 à 10 : 55."
    assert "55" in SORTIE, "Le programme affiche le résultat."
    variables, sortie = relancer(["100"])
    assert variables["somme"] == 5050, "Somme de 1 à 100 : 5050."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-6" label="Introduction - Puissance de 2" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Puissance de 2

      **Écrire un programme qui :**

      - Demande un nombre n
      - Affiche les puissances de 2 jusqu'à 2^n

      *Pour la vérification, stocker le nombre choisi dans `n` et la liste des puissances calculées dans `puissances` (ex: `[1, 2, 4, ..., 2^n]`).*

    <Correction>
    ```python
    n = int(input("Nombre : "))
    puissances = []
    for i in range(n + 1):
        print(2 ** i)
        puissances.append(2 ** i)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["4"]
    assert n == 4 and puissances == [1, 2, 4, 8, 16], "Pour 4 : [1, 2, 4, 8, 16], de 2^0 à 2^4."
    assert "16" in SORTIE, "Le programme affiche les puissances."
    variables, sortie = relancer(["0"])
    assert variables["puissances"] == [1], "Pour 0 : [1]."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-7" label="Introduction - Message répété" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Message répété

      **Écrire un programme qui :**

      - Demande une phrase
      - Demande un nombre de répétitions
      - Affiche la phrase autant de fois que demandé

      ## <Icone nom="star" /> Niveau Facile

      *Pour la vérification, stocker la phrase dans `phrase`, le nombre de répétitions dans `n`, et créer une liste `resultats` contenant la phrase répétée `n` fois.*

    <Correction>
    ```python
    phrase = input("Phrase : ")
    n = int(input("Nombre de répétitions : "))
    resultats = []
    for i in range(n):
        print(phrase)
        resultats.append(phrase)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["Le renard court", "3"]
    assert phrase == "Le renard court" and n == 3, "phrase et n contiennent les saisies."
    assert resultats == ["Le renard court"] * 3, "resultats contient la phrase 3 fois."
    assert [l.strip() for l in SORTIE.splitlines()].count("Le renard court") == 3, "La phrase est affichée 3 fois, seule sur sa ligne."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-8" label="Facile - Calculatrice continue" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Calculatrice continue

      **Écrire un programme qui :**

      - Demande deux nombres et une opération
      - Affiche le résultat
      - Demande si on veut continuer (oui/non)
      - Recommence si la réponse est "oui"

      ## <Icone nom="flame" /> Niveau Intermédiaire

      *Pour la vérification, s'assurer que la boucle se termine correctement quand on entre 'non'. Aucune variable spécifique n'est vérifiée automatiquement ici car cest un programme interactif.*

    <Correction>
    ```python
    continuer = "oui"
    while continuer == "oui":
        a = float(input("Premier nombre : "))
        b = float(input("Deuxième nombre : "))
        op = input("Opération : ")
        if op == "+":
            print(a + b)
        elif op == "-":
            print(a - b)
        elif op == "*":
            print(a * b)
        elif op == "/":
            print(a / b)
        continuer = input("Continuer ? (oui/non) : ")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import re as _re
    def _nombres(texte):
        return [float(x) for x in _re.findall(r"-?\d+(?:[.,]\d+)?", texte.replace(",", "."))]
    ENTREES = ["6", "7", "*", "oui", "1", "2", "+", "non"]
    nombres = _nombres(SORTIE)
    assert 42 in nombres, "Premier calcul : 6 * 7 affiche 42."
    assert 3 in nombres, "Après oui, le programme recommence : 1 + 2 affiche 3."
    variables, sortie = relancer(["5", "5", "-", "non"])
    assert 0 in _nombres(sortie), "La réponse non arrête le programme après un seul calcul."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-9" label="Intermédiaire - Devinette avec limite" type="python">
    <Enonce>
      ### Intermédiaire <Renards n="2" /> - Devinette avec limite

      **Écrire un programme qui :**

      - Tire un nombre secret avec `random.randint(1, 100)`, au début du programme
      - Donne 5 essais pour deviner ce nombre
      - Affiche "Perdu!" si le nombre n'est pas trouvé après 5 essais
      - Affiche le nombre d'essais utilisés en cas de victoire

      *Pour la vérification, utiliser une variable `essais_restants` qui décrémente à chaque tour.*

    <Correction>
    ```python
    import random

    secret = random.randint(1, 100)
    essais_restants = 5
    trouve = False
    while essais_restants > 0 and not trouve:
        proposition = int(input("Nombre : "))
        essais_restants = essais_restants - 1
        if proposition == secret:
            trouve = True
    if trouve:
        print("Gagné en", 5 - essais_restants, "essais")
    else:
        print("Perdu!")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import re as _re
    def _nombres(texte):
        return [float(x) for x in _re.findall(r"-?\d+(?:[.,]\d+)?", texte.replace(",", "."))]
    ENTREES = ["0", "0", "0", "0", "0"]
    assert essais_restants == 0, "Après 5 essais ratés, essais_restants vaut 0."
    assert "Perdu!" in SORTIE, "Après 5 essais ratés, afficher Perdu!"
    import random
    random.seed(7)
    secret_attendu = random.randint(1, 100)
    random.seed(7)
    autre = 1 if secret_attendu != 1 else 2
    variables, sortie = relancer([str(autre), str(secret_attendu)])
    assert "Perdu!" not in sortie and 2 in _nombres(sortie.strip().splitlines()[-1]), "Trouvé au 2e essai : afficher le nombre d'essais utilisés, 2."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-10" label="Intermédiaire - Caisse enregistreuse" type="python">
    <Enonce>
      ### Intermédiaire <Renards n="2" /> - Caisse enregistreuse

      **Écrire un programme qui :**

      - Demande des prix d'articles un par un
      - S'arrête quand on entre 0
      - Affiche le total à payer

      *Pour la vérification, stocker le montant total calculé dans une variable `total`.*

    <Correction>
    ```python
    total = 0
    prix = float(input("Prix : "))
    while prix != 0:
        total = total + prix
        prix = float(input("Prix : "))
    print("Total à payer :", total)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import re as _re
    def _nombres(texte):
        return [float(x) for x in _re.findall(r"-?\d+(?:[.,]\d+)?", texte.replace(",", "."))]
    ENTREES = ["2.5", "4", "10", "0"]
    assert total == 16.5, "2.5 + 4 + 10 = 16.5, le 0 arrête la saisie."
    assert 16.5 in _nombres(SORTIE.strip().splitlines()[-1]), "Le programme affiche le total."
    variables, sortie = relancer(["0"])
    assert variables["total"] == 0, "Un 0 immédiat : total 0."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>
