---
title: 'Fiche d''exercices : Les conditions en Python'
description: Exercices sur les conditions (if/else) en Python.
level: seconde
chapter: Programmation Python
icon: "circle-question-mark"
prerequisites:
  - Fiche_exercices_boucles
audience: public
---

<ExerciseTabs courseId="fiche-conditions" courseTitle="Fiche Conditions">
  <ExerciseSection id="conditions-1" label="Important - Consignes importantes" type="lecture">
    <Enonce>
      ### Important <Icone nom="triangle-alert" /> - Consignes importantes

      **Pour tous les exercices :**

      - Ne pas oublier les deux points `:` après la condition
      - Faire attention à l'indentation dans les blocs if/else
      - Tester le code avec différentes valeurs
      - Créer un fichier Python différent pour chaque exercice (ex: `exercice1.py`, `exercice2.py`, etc.)
      - Recopier les programmes sur le cahier pour pouvoir les réviser plus tard
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="conditions-2" label="Introduction - Majorité" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Majorité

      **Écrire un programme qui :**

      - Demande l'âge d'une personne
      - Affiche "Vous êtes majeur" si l'âge est supérieur ou égal à 18
      - Affiche "Vous êtes mineur" sinon

      *Pour la vérification, stocker l'âge saisi dans une variable `age` et le message affiché dans une variable `message`.*

    <Correction>
    ```python
    age = int(input("Âge : "))
    if age >= 18:
        message = "Vous êtes majeur"
    else:
        message = "Vous êtes mineur"
    print(message)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["18"]
    assert age == 18 and message == "Vous êtes majeur", "18 ans : Vous êtes majeur."
    assert "Vous êtes majeur" in SORTIE, "Le programme affiche le message."
    variables, sortie = relancer(["17"])
    assert variables["message"] == "Vous êtes mineur" and "Vous êtes mineur" in sortie, "17 ans : Vous êtes mineur."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-3" label="Introduction - Nombre positif ou négatif" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Nombre positif ou négatif

      **Écrire un programme qui :**

      - Demande un nombre
      - Affiche si le nombre est positif, négatif ou nul

      *Pour la vérification, stocker le nombre dans `n` et le message affiché dans `message`.*

    <Correction>
    ```python
    n = float(input("Nombre : "))
    if n > 0:
        message = "positif"
    elif n < 0:
        message = "négatif"
    else:
        message = "nul"
    print(message)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["5"]
    assert n == 5 and "positif" in message, "5 est positif."
    variables, sortie = relancer(["-2"])
    assert "négatif" in variables["message"] or "negatif" in variables["message"], "-2 est négatif."
    variables, sortie = relancer(["0"])
    assert "nul" in variables["message"], "0 est nul."
    assert "nul" in sortie, "Le programme affiche le message."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-4" label="Introduction - Comparaison de deux nombres" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Comparaison de deux nombres

      **Écrire un programme qui :**

      - Demande deux nombres
      - Affiche lequel est le plus grand (ou s'ils sont égaux)

      *Pour la vérification, stocker les deux nombres dans `a` et `b`, et stocker la valeur la plus grande dans une variable `maximum` (ou `a` ou `b` si égaux).*

    <Correction>
    ```python
    a = float(input("Premier nombre : "))
    b = float(input("Deuxième nombre : "))
    if a > b:
        maximum = a
        print(a, "est le plus grand")
    elif b > a:
        maximum = b
        print(b, "est le plus grand")
    else:
        maximum = a
        print("Les deux nombres sont égaux")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["3", "8"]
    assert a == 3 and b == 8 and maximum == 8, "Pour 3 et 8, maximum vaut 8."
    variables, sortie = relancer(["9", "2"])
    assert variables["maximum"] == 9, "Pour 9 et 2, maximum vaut 9."
    variables, sortie = relancer(["4", "4"])
    assert variables["maximum"] == 4 and ("égaux" in sortie or "egaux" in sortie), "Pour 4 et 4, afficher qu'ils sont égaux."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-5" label="Introduction - Mot de passe" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Mot de passe

      **Écrire un programme qui :**

      - Demande un mot de passe
      - Affiche "Accès autorisé" si le mot de passe est "secret123"
      - Affiche "Accès refusé" sinon

      *Pour la vérification, stocker le mot de passe entré dans `mdp` et le message final dans `message`.*

    <Correction>
    ```python
    mdp = input("Mot de passe : ")
    if mdp == "secret123":
        message = "Accès autorisé"
    else:
        message = "Accès refusé"
    print(message)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["secret123"]
    assert mdp == "secret123" and message == "Accès autorisé", "Le bon mot de passe : Accès autorisé."
    assert "Accès autorisé" in SORTIE, "Le programme affiche le message."
    variables, sortie = relancer(["Secret123"])
    assert variables["message"] == "Accès refusé", "Un autre mot de passe (même à une majuscule près) : Accès refusé."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-6" label="Introduction - Nombre pair ou impair" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Nombre pair ou impair

      **Écrire un programme qui :**

      - Demande un nombre entier
      - Affiche si le nombre est pair ou impair

      *Astuce : Un nombre est pair si le reste de sa division par 2 est égal à 0. En Python, on utilise l'opérateur `%` pour obtenir le reste d'une division.*

      *Pour la vérification, stocker le nombre dans `n` et le message dans `message`.*

    <Correction>
    ```python
    n = int(input("Nombre entier : "))
    if n % 2 == 0:
        message = "pair"
    else:
        message = "impair"
    print(message)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["8"]
    assert n == 8 and "pair" in message and "impair" not in message, "8 est pair."
    variables, sortie = relancer(["7"])
    assert "impair" in variables["message"], "7 est impair."
    variables, sortie = relancer(["0"])
    assert "impair" not in variables["message"], "0 est pair."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-7" label="Introduction - Calculatrice simple" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Calculatrice simple

      **Écrire un programme qui :**

      - Demande deux nombres, puis une opération (+, -, *, /)
      - Affiche le résultat de l'opération
      - Gère le cas de la division par zéro

      ## <Icone nom="star" /> Niveau Facile

      *Pour la vérification, stocker les deux nombres dans `a` et `b`, l'opération dans `op` (chaine de caractères) et le résultat calculé dans `resultat`. En cas d'erreur (division par zéro), `resultat` peut valoir `None` ou un message d'erreur.*

    <Correction>
    ```python
    a = float(input("Premier nombre : "))
    b = float(input("Deuxième nombre : "))
    op = input("Opération (+, -, *, /) : ")
    if op == "+":
        resultat = a + b
    elif op == "-":
        resultat = a - b
    elif op == "*":
        resultat = a * b
    elif op == "/":
        if b == 0:
            resultat = None
            print("Division par zéro impossible")
        else:
            resultat = a / b
    print(resultat)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["6", "7", "*"]
    assert a == 6 and b == 7 and op == "*", "Saisies dans l'ordre : a, b, puis l'opération."
    assert resultat == 42, "6 * 7 = 42."
    for saisies, attendu in ((["9", "4", "+"], 13), (["9", "4", "-"], 5), (["9", "4", "/"], 2.25)):
        variables, sortie = relancer(saisies)
        assert variables["resultat"] == attendu, saisies[0] + " " + saisies[2] + " " + saisies[1] + " = " + str(attendu) + "."
    variables, sortie = relancer(["5", "0", "/"])
    assert variables["resultat"] is None or isinstance(variables["resultat"], str), "Division par zéro : resultat vaut None ou un message, sans planter."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-8" label="Facile - Note et mention" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Note et mention

      **Écrire un programme qui :**

      - Demande une note sur 20
      - Affiche la mention correspondante :
        - Note >= 16 : "Très bien"
        - Note >= 14 : "Bien"
        - Note >= 12 : "Assez bien"
        - Note >= 10 : "Passable"
        - Note < 10 : "Insuffisant"

      *Pour la vérification, stocker la note dans `note` et la mention dans `mention`.*

    <Correction>
    ```python
    note = float(input("Note sur 20 : "))
    if note >= 16:
        mention = "Très bien"
    elif note >= 14:
        mention = "Bien"
    elif note >= 12:
        mention = "Assez bien"
    elif note >= 10:
        mention = "Passable"
    else:
        mention = "Insuffisant"
    print(mention)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["17"]
    assert note == 17 and mention == "Très bien", "17 : Très bien."
    for saisie, attendu in (("16", "Très bien"), ("15", "Bien"), ("14", "Bien"), ("12", "Assez bien"), ("10", "Passable"), ("9.5", "Insuffisant")):
        variables, sortie = relancer([saisie])
        assert variables["mention"] == attendu and attendu in sortie, saisie + " : " + attendu + "."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-9" label="Facile - Température et conseil" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Température et conseil

      **Écrire un programme qui :**

      - Demande la température extérieure
      - Donne un conseil vestimentaire :
        - Moins de 0°C : "Porter un manteau d'hiver"
        - De 0 à 15°C : "Porter une veste"
        - De 16 à 25°C : "Un pull suffit"
        - Plus de 25°C : "T-shirt recommandé"

      *Pour la vérification, stocker la température dans `temp` et le conseil dans `conseil`.*

    <Correction>
    ```python
    temp = float(input("Température : "))
    if temp < 0:
        conseil = "Porter un manteau d'hiver"
    elif temp <= 15:
        conseil = "Porter une veste"
    elif temp <= 25:
        conseil = "Un pull suffit"
    else:
        conseil = "T-shirt recommandé"
    print(conseil)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["-5"]
    assert temp == -5 and conseil == "Porter un manteau d'hiver", "-5 °C : Porter un manteau d'hiver."
    for saisie, attendu in (("0", "Porter une veste"), ("15", "Porter une veste"), ("16", "Un pull suffit"), ("25", "Un pull suffit"), ("30", "T-shirt recommandé")):
        variables, sortie = relancer([saisie])
        assert variables["conseil"] == attendu, saisie + " °C : " + attendu + "."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-10" label="Facile - Jours du mois" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Jours du mois

      **Écrire un programme qui :**

      - Demande un numéro de mois (1-12)
      - Affiche le nombre de jours dans ce mois
      - Considère février avec 28 jours

      *Pour la vérification, stocker le numéro du mois dans `mois` et le nombre de jours dans `jours`.*

    <Correction>
    ```python
    mois = int(input("Numéro du mois : "))
    if mois == 2:
        jours = 28
    elif mois == 4 or mois == 6 or mois == 9 or mois == 11:
        jours = 30
    else:
        jours = 31
    print(jours)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["2"]
    assert mois == 2 and jours == 28, "Février : 28 jours."
    for saisie, attendu in (("1", 31), ("4", 30), ("6", 30), ("7", 31), ("8", 31), ("9", 30), ("11", 30), ("12", 31)):
        variables, sortie = relancer([saisie])
        assert variables["jours"] == attendu, "Mois " + saisie + " : " + str(attendu) + " jours."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-11" label="Facile - Triangle possible" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Triangle possible

      **Écrire un programme qui :**

      - Demande trois longueurs
      - Vérifie si on peut former un triangle avec ces longueurs

      *Pour la vérification, stocker les trois longueurs dans `a`, `b`, `c` et une variable booléenne `possible` (True si possible, False sinon).*

    <Correction>
    ```python
    a = float(input("Longueur a : "))
    b = float(input("Longueur b : "))
    c = float(input("Longueur c : "))
    possible = a < b + c and b < a + c and c < a + b
    if possible:
        print("Triangle possible")
    else:
        print("Triangle impossible")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["3", "4", "5"]
    assert (a, b, c) == (3, 4, 5) and possible is True, "3, 4, 5 forment un triangle."
    variables, sortie = relancer(["1", "2", "10"])
    assert variables["possible"] is False, "1, 2, 10 ne forment pas de triangle."
    variables, sortie = relancer(["10", "2", "3"])
    assert variables["possible"] is False, "10, 2, 3 ne forment pas de triangle : chaque côté doit être plus petit que la somme des deux autres."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>
