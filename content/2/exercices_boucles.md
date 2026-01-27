---
title: "Exercices : Les Boucles"
chapter: "Introduction à Python"
badgeId: "les-boucles-python"
meta: "Boucles for et while, itérations et conditions"
---

<ExerciseTabs courseId="les-boucles-python" courseTitle="Les Boucles">
  <ExerciseSection id="boucles-1-1" label="1.1 - Afficher les nombres de 1 à 100">
    <Enonce>
    ### Exercice 1.1 : Afficher les nombres de 1 à 100
    **Écrire un programme qui affiche dans le terminal tous les nombres entre 1 et 100 (à l'aide d'une boucle `for` puis d'une boucle `while`).**

    *Pour la vérification, stockez la liste des nombres de 1 à 100 dans une variable `nombres` (ex: `[1, 2, ..., 100]`).*

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
    </Enonce>
    <Verification>
    ```python
assert 'nombres' in locals(), "La variable 'nombres' n'est pas définie."
assert nombres == list(range(1, 101)), "La liste des nombres est incorrecte."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-1-2" label="1.2 - Table de multiplication">
    <Enonce>
    ### Exercice 1.2 : Table de multiplication
    **Écrire un programme qui prend un nombre entier et affiche sa table de multiplication (jusqu'à 10).**

    *Pour la vérification, stockez le nombre choisi dans `n` et la liste des résultats dans `table`.*

    <Correction>
    ```python
    nombre = int(input("Entrez un nombre entier : "))

    for i in range(1, 11):
        print(i, "x", nombre, "=", i * nombre)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'n' in locals(), "La variable 'n' n'est pas définie."
assert 'table' in locals(), "La variable 'table' n'est pas définie."
expected = [n * i for i in range(1, 11)]
assert table == expected, f"La table de multiplication pour {n} est incorrecte."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-1-3" label="1.3 - Somme des nombres">
    <Enonce>
    ### Exercice 1.3 : Somme des nombres de 1 à 100
    **Écrire un programme qui réalise la somme des nombres entiers de 1 jusque 100.**

    *Pour la vérification, stockez le résultat dans une variable `somme`.*

    <Correction>
    ```python
    somme = 0
    for i in range(1, 101):
        somme += i
    print("La somme de 1 à 100 est", somme)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'somme' in locals(), "La variable 'somme' n'est pas définie."
assert somme == 5050, "La somme des nombres de 1 à 100 doit être 5050."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-2-1" label="2.1 - Nombres pairs (Facile)">
    <Enonce>
    ### Exercice 2.1 : Afficher les nombres pairs entre 1 à 100
    **Écrire un programme qui affiche dans le terminal tous les nombres pairs entre 1 et 100.**

    *Pour la vérification, stockez la liste des nombres pairs dans une variable `pairs`.*

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
    </Enonce>
    <Verification>
    ```python
assert 'pairs' in locals(), "La variable 'pairs' n'est pas définie."
assert pairs == [i for i in range(1, 101) if i % 2 == 0], "La liste des nombres pairs est incorrecte."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-2-2" label="2.2 - Compter les voyelles (Facile)">
    <Enonce>
    ### Exercice 2.2 : Compter les voyelles
    **Écrire un programme qui lit une chaîne de caractères et affiche le nombre de voyelles présentes dans cette chaîne.**

    *Pour la vérification, stockez la phrase dans `phrase` et le nombre de voyelles dans `nb_voyelles`.*

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
    </Enonce>
    <Verification>
    ```python
assert 'phrase' in locals(), "La variable 'phrase' n'est pas définie."
assert 'nb_voyelles' in locals(), "La variable 'nb_voyelles' n'est pas définie."
vowels = "aeiouyAEIOUY"
expected = sum(1 for char in phrase if char in vowels)
assert nb_voyelles == expected, f"Le nombre de voyelles pour '{phrase}' devrait être {expected}."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-2-3" label="2.3 - Inverser une chaîne (Facile)">
    <Enonce>
    ### Exercice 2.3 : Inverser une chaîne de caractères
    **Écrire un programme qui affiche les caractères d'une chaîne de caractères dans l'autre sens.**
    *Exemple : "bonjour" → "ruojnob".*

    *Pour la vérification, stockez la phrase dans `phrase` et le résultat inversé dans `resultat`.*

    <Correction>
    ```python
    phrase = input("Donnez votre phrase : ")
    resultat = ""
    for carac in phrase:
        resultat = carac + resultat
    print(resultat)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'phrase' in locals(), "La variable 'phrase' n'est pas définie."
assert 'resultat' in locals(), "La variable 'resultat' n'est pas définie."
assert resultat == phrase[::-1], f"L'inverse de '{phrase}' doit être '{phrase[::-1]}'."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-2-4" label="2.4 - Somme des chiffres (Facile)">
    <Enonce>
    ### Exercice 2.4 : Somme des chiffres d'un nombre
    **Écrire un programme qui calcule la somme des chiffres d'un nombre donné par l'utilisateur.**
    *Exemple : pour 123, il affichera 6.*

    *Pour la vérification, stockez le nombre (sous forme de chaîne ou d'entier) dans `nombre` et la somme dans `somme`.*

    <Correction>
    ```python
    nombre = input("Donnez votre nombre : ")
    resultat = 0
    for chiffre in nombre:
        resultat = resultat + int(chiffre)
    print("La somme des chiffres est :", resultat)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'nombre' in locals(), "La variable 'nombre' n'est pas définie."
assert 'somme' in locals(), "La variable 'somme' n'est pas définie."
s_num = str(nombre)
expected = sum(int(d) for d in s_num)
assert somme == expected, f"La somme des chiffres de {nombre} doit être {expected}."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-3-1" label="3.1 - Boucle conditionnelle (Moyen)">
    <Enonce>
    ### Exercice 3.1 : Boucle jusqu'à un nombre négatif
    **Écrire un programme qui demande en boucle un nombre à l'utilisateur. Si le nombre est positif, la boucle continue, si le nombre est négatif, la boucle s'arrête.**

    *Pour la vérification, stockez la liste des nombres positifs saisis dans une variable `nombres`.*

    <Correction>
    ```python
    nombre = int(input("Donnez un nombre : "))
    while nombre >= 0:
        nombre = int(input("Donnez un autre nombre : "))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'nombres' in locals(), "La variable 'nombres' n'est pas définie."
assert all(n >= 0 for n in nombres), "Tous les nombres stockés doivent être positifs."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-3-2" label="3.2 - Multiples de 3 (Moyen)">
    <Enonce>
    ### Exercice 3.2 : Multiples de 3
    **Écrire un programme qui demande à l'utilisateur un nombre et affiche les 10 multiples par 3 consécutifs.**
    *Exemple : 1 → 3, 9, 27, 81...*

    *Pour la vérification, stockez le nombre de départ dans `depart` et la liste des 10 valeurs calculées dans `suite`.*

    <Correction>
    ```python
    nombre = int(input("Donnez un nombre : "))
    for i in range(10):
        nombre *= 3
        print(nombre)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'depart' in locals(), "La variable 'depart' n'est pas définie."
assert 'suite' in locals(), "La variable 'suite' n'est pas définie."
assert len(suite) == 10, "La suite doit contenir 10 nombres."
expected = []
curr = depart
for _ in range(10):
    curr *= 3
    expected.append(curr)
assert suite == expected, "La suite de multiples est incorrecte."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-3-3" label="3.3 - Divisions par 2 (Moyen)">
    <Enonce>
    ### Exercice 3.3 : Divisions par 2
    **Écrire un programme qui demande un nombre à l'utilisateur et affiche dans le terminal combien de fois celui-ci est divisible par 2.**

    *Pour la vérification, stockez le nombre de départ dans `depart` et le compteur final dans `compteur`.*

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
    </Enonce>
    <Verification>
assert 'depart' in locals(), "La variable 'depart' n'est pas définie."
assert 'compteur' in locals(), "La variable 'compteur' n'est pas définie."
n = depart
c = 0
while n > 1:
    n //= 2
    c += 1
assert compteur == c, f"Le nombre de divisions par 2 pour {depart} devrait être {c}."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-4-1" label="4.1 - Nombres premiers (Difficile)">
    <Enonce>
    ### Exercice 4.1 : Diviseurs et nombres premiers
    **Écrire un programme qui demande un nombre `n` à un utilisateur et affiche dans le terminal ses diviseurs (autre que lui-même et 1). S'il n'en a aucun, affiche : "Aucun diviseur, n est premier."**

    *Pour la vérification, stockez le nombre dans `n` et la liste des diviseurs trouvés dans `diviseurs` (liste vide si premier).*

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
    </Enonce>
    <Verification>
    ```python
assert 'n' in locals(), "La variable 'n' n'est pas définie."
assert 'diviseurs' in locals(), "La variable 'diviseurs' n'est pas définie."
expected = [i for i in range(2, n) if n % i == 0]
assert diviseurs == expected, f"Les diviseurs pour {n} sont incorrects."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-4-2" label="4.2 - Conjecture de Syracuse (Difficile)">
    <Enonce>
    ### Exercice 4.2 : Conjecture de Syracuse
    **Écrire un programme qui réalise la conjecture de Syracuse pour un nombre demandé par l'utilisateur. Tant que le nombre n'est pas 1, s'il est pair, on le divise par 2 sinon on le multiplie par 3 et on ajoute 1.**
    *Exemple : 10 → 5 → 16 → 8 → 4 → 2 → 1*

    *Pour la vérification, stockez le nombre de départ dans `depart` et la suite complète des nombres (y compris le 1 final) dans `suite`.*

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
    </Enonce>
    <Verification>
    ```python
assert 'depart' in locals(), "La variable 'depart' n'est pas définie."
assert 'suite' in locals(), "La variable 'suite' n'est pas définie."
assert suite[-1] == 1, "La suite doit se terminer par 1."
# On vérifie la logique
curr = depart
# On ne vérifie pas tout si la liste est longue, mais au moins le début/fin ou la logique
# Recalculons la suite
calc_suite = []
temp = depart
while temp != 1:
    calc_suite.append(temp)
    if temp % 2 == 0:
        temp //= 2
    else:
        temp = temp * 3 + 1
calc_suite.append(1)

# Note: l'énoncé dit "Tant que le nombre n'est pas 1", donc le 1 est affiché à la fin.
# Si l'utilisateur a stocké le départ dans suite[0], alors ok.
assert suite == calc_suite, f"La suite de Syracuse pour {depart} est incorrecte."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>