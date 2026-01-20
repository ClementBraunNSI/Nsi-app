---
title: "Exercices : Les Boucles"
chapter: "Introduction à Python"
meta: "Boucles for et while, itérations et conditions"
---

<ExerciseTabs>
  <ExerciseSection id="intro" label="1. Introduction">
    ## Premiers pas avec les boucles

    ### Exercice 1.1 : Afficher les nombres de 1 à 100
    **Écrire un programme qui affiche dans le terminal tous les nombres entre 1 et 100 (à l'aide d'une boucle `for` puis d'une boucle `while`).**

    <Correction>
    ```python
    # Utilisation d'une boucle for
    for i in range(1, 101):
        print(i)

    # Utilisation d'une boucle while
    i = 1
    while i <= 100:
        print(i)
        i += 1
    ```
    </Correction>

    ### Exercice 1.2 : Table de multiplication
    **Écrire un programme qui prend un nombre entier et affiche sa table de multiplication (jusqu'à 10).**

    <Correction>
    ```python
    nombre = int(input("Entrez un nombre entier : "))

    for i in range(1, 11):
        print(i, "x", nombre, "=", i * nombre)
    ```
    </Correction>

    ### Exercice 1.3 : Somme des nombres de 1 à 100
    **Écrire un programme qui réalise la somme des nombres entiers de 1 jusque 100.**

    <Correction>
    ```python
    somme = 0
    for i in range(1, 101):
        somme += i
    print("La somme de 1 à 100 est", somme)
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="easy" label="2. Niveau Facile">
    ## Manipulation de boucles simples

    ### Exercice 2.1 : Afficher les nombres pairs entre 1 à 100
    **Écrire un programme qui affiche dans le terminal tous les nombres pairs entre 1 et 100.**

    <Correction>
    ```python
    # Utilisation d'une boucle for
    for i in range(1, 101):
        if i % 2 == 0:
            print(i)

    # Utilisation d'une boucle while
    i = 1
    while i <= 100:
        if i % 2 == 0:
            print(i)
        i += 1
    ```
    </Correction>

    ### Exercice 2.2 : Compter les voyelles
    **Écrire un programme qui lit une chaîne de caractères et affiche le nombre de voyelles présentes dans cette chaîne.**

    <Correction>
    ```python
    phrase = input("Donnez votre phrase : ")
    nb_voyelles = 0
    for lettre in phrase:
        if lettre in 'aeiouyAEIOUY':
            nb_voyelles += 1
    print("La phrase compte", nb_voyelles, "voyelles.")
    ```
    </Correction>

    ### Exercice 2.3 : Inverser une chaîne de caractères
    **Écrire un programme qui affiche les caractères d'une chaîne de caractères dans l'autre sens.**
    *Exemple : "bonjour" → "ruojnob".*

    <Correction>
    ```python
    phrase = input("Donnez votre phrase : ")
    resultat = ""
    for carac in phrase:
        resultat = carac + resultat
    print(resultat)
    ```
    </Correction>

    ### Exercice 2.4 : Somme des chiffres d'un nombre
    **Écrire un programme qui calcule la somme des chiffres d'un nombre donné par l'utilisateur.**
    *Exemple : pour 123, il affichera 6.*

    <Correction>
    ```python
    nombre = input("Donnez votre nombre : ")
    resultat = 0
    for chiffre in nombre:
        resultat = resultat + int(chiffre)
    print("La somme des chiffres est :", resultat)
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="medium" label="3. Intermédiaire">
    ## Logique itérative

    ### Exercice 3.1 : Boucle jusqu'à un nombre négatif
    **Écrire un programme qui demande en boucle un nombre à l'utilisateur. Si le nombre est positif, la boucle continue, si le nombre est négatif, la boucle s'arrête.**

    <Correction>
    ```python
    nombre = int(input("Donnez un nombre : "))
    while nombre >= 0:
        nombre = int(input("Donnez un autre nombre : "))
    ```
    </Correction>

    ### Exercice 3.2 : Multiples de 3
    **Écrire un programme qui demande à l'utilisateur un nombre et affiche les 10 multiples par 3 consécutifs.**
    *Exemple : 1 → 3, 9, 27, 81...*

    <Correction>
    ```python
    nombre = int(input("Donnez un nombre : "))
    for i in range(10):
        nombre *= 3
        print(nombre)
    ```
    </Correction>

    ### Exercice 3.3 : Divisions par 2
    **Écrire un programme qui demande un nombre à l'utilisateur et affiche dans le terminal combien de fois celui-ci est divisible par 2.**

    <Correction>
    ```python
    nombre = int(input("Donnez un nombre : "))
    compteur = 0
    while nombre > 1:
        nombre //= 2
        compteur += 1
    print("Nombre de divisions par 2 :", compteur)
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="hard" label="4. Niveau Difficile">
    ## Algorithmes avancés

    ### Exercice 4.1 : Diviseurs et nombres premiers
    **Écrire un programme qui demande un nombre `n` à un utilisateur et affiche dans le terminal ses diviseurs (autre que lui-même et 1). S'il n'en a aucun, affiche : "Aucun diviseur, n est premier."**

    <Correction>
    ```python
    nombre = int(input("Donnez un nombre : "))
    diviseurs_trouves = False

    for i in range(2, nombre):
        if nombre % i == 0:
            print(i, "divise", nombre)
            diviseurs_trouves = True
    
    if not diviseurs_trouves:
        print("Aucun diviseur, n est premier.")
    ```
    </Correction>

    ### Exercice 4.2 : Conjecture de Syracuse
    **Écrire un programme qui réalise la conjecture de Syracuse pour un nombre demandé par l'utilisateur. Tant que le nombre n'est pas 1, s'il est pair, on le divise par 2 sinon on le multiplie par 3 et on ajoute 1.**
    *Exemple : 10 → 5 → 16 → 8 → 4 → 2 → 1*

    <Correction>
    ```python
    nombre = int(input("Donnez un nombre : "))
    while nombre != 1:
        print(nombre, end=" → ")
        if nombre % 2 == 0:
            nombre = nombre // 2
        else:
            nombre = nombre * 3 + 1
    print(1)
    ```
    </Correction>
  </ExerciseSection>
</ExerciseTabs>