---
title: 'Exercices : Les Boucles'
description: 'for, while, range et parcours de chaînes — fiche progressive par niveau.'
icon: "\U0001F504"
chapter: Introduction à Python
badgeId: premiere_exercices_boucles
meta: 'for, while, range et parcours de chaînes'
level: premiere
prerequisites:
  - python_exercices_conditions
---

<ExerciseTabs courseId="les-boucles-python" courseTitle="Les Boucles">

  {/* ========================================== */}
  {/* CATÉGORIE 1 : INTRODUCTION (1.1 à 1.6)      */}
  {/* ========================================== */}

  <ExerciseSection id="boucles-1-1" label="1.1 [Introduction] - Chaîne de nombres">
    <Enonce>
    ### Exercice 1.1 [Introduction] : Chaîne de nombres
    **Écrire une fonction `chaine_numeros_jusqua` qui prend un entier `limite` et renvoie une chaîne des entiers de 1 à `limite` séparés par des virgules.**
    *Exemple : `chaine_numeros_jusqua(5)` → `"1,2,3,4,5"`.*

    <Correction>
    ```python
    def chaine_numeros_jusqua(limite: int) -> str:
        resultat = ""
        for i in range(1, limite + 1):
            if resultat:
                resultat += ","
            resultat += str(i)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'chaine_numeros_jusqua' in locals(), "La fonction 'chaine_numeros_jusqua' n'est pas définie."
assert chaine_numeros_jusqua(5) == "1,2,3,4,5"
assert chaine_numeros_jusqua(1) == "1"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-1-2" label="1.2 [Introduction] - Table de multiplication">
    <Enonce>
    ### Exercice 1.2 [Introduction] : Table de multiplication
    **Écrire une fonction `ligne_table_multiplication` qui prend un entier `n` et renvoie une chaîne des 10 produits `n×1` à `n×10`, séparés par des virgules.**

    <Correction>
    ```python
    def ligne_table_multiplication(n: int) -> str:
        resultat = ""
        for i in range(1, 11):
            if resultat:
                resultat += ","
            resultat += str(n * i)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'ligne_table_multiplication' in locals(), "La fonction 'ligne_table_multiplication' n'est pas définie."
assert ligne_table_multiplication(7) == "7,14,21,28,35,42,49,56,63,70"
assert ligne_table_multiplication(3) == "3,6,9,12,15,18,21,24,27,30"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-1-3" label="1.3 [Introduction] - Somme de 1 à 100">
    <Enonce>
    ### Exercice 1.3 [Introduction] : Somme de 1 à 100
    **Écrire une fonction `somme_jusqua` qui prend un entier `limite` et renvoie la somme des entiers de 1 à `limite` inclus.**

    <Correction>
    ```python
    def somme_jusqua(limite: int) -> int:
        somme = 0
        for i in range(1, limite + 1):
            somme += i
        return somme
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'somme_jusqua' in locals(), "La fonction 'somme_jusqua' n'est pas définie."
assert somme_jusqua(100) == 5050
assert somme_jusqua(10) == 55
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-1-4" label="1.4 [Introduction] - Compter de 0 à n">
    <Enonce>
    ### Exercice 1.4 [Introduction] : Compter de 0 à n
    **Écrire une fonction `compter_entiers_zero_a_n` qui prend un entier `n` (≥ 0) et renvoie combien d'entiers il y a de 0 à `n` inclus.**

    <Correction>
    ```python
    def compter_entiers_zero_a_n(n: int) -> int:
        compteur = 0
        for _ in range(n + 1):
            compteur += 1
        return compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'compter_entiers_zero_a_n' in locals(), "La fonction 'compter_entiers_zero_a_n' n'est pas définie."
assert compter_entiers_zero_a_n(5) == 6
assert compter_entiers_zero_a_n(0) == 1
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-1-5" label="1.5 [Introduction] - Majuscules">
    <Enonce>
    ### Exercice 1.5 [Introduction] : Majuscules
    **Écrire une fonction `en_majuscules` qui prend une chaîne `texte` et renvoie la même chaîne en majuscules, en parcourant chaque caractère avec une boucle `for` et `car.upper()`.**

    <Correction>
    ```python
    def en_majuscules(texte: str) -> str:
        resultat = ""
        for car in texte:
            resultat += car.upper()
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'en_majuscules' in locals(), "La fonction 'en_majuscules' n'est pas définie."
assert en_majuscules("nsi") == "NSI"
assert en_majuscules("") == ""
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-1-6" label="1.6 [Introduction] - Ligne d'étoiles">
    <Enonce>
    ### Exercice 1.6 [Introduction] : Ligne d'étoiles
    **Écrire une fonction `ligne_etoiles` qui prend un entier `n` et renvoie une chaîne de `n` caractères `*`.**

    <Correction>
    ```python
    def ligne_etoiles(n: int) -> str:
        resultat = ""
        for _ in range(n):
            resultat += "*"
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'ligne_etoiles' in locals(), "La fonction 'ligne_etoiles' n'est pas définie."
assert ligne_etoiles(4) == "****"
assert ligne_etoiles(0) == ""
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 2 : FACILE (2.1 à 2.6)            */}
  {/* ========================================== */}

  <ExerciseSection id="boucles-2-1" label="2.1 [Facile] - Compter les pairs">
    <Enonce>
    ### Exercice 2.1 [Facile] : Compter les pairs
    **Écrire une fonction `compter_pairs_jusqua` qui prend un entier `limite` et renvoie le nombre d'entiers pairs entre 1 et `limite` inclus.**

    <Correction>
    ```python
    def compter_pairs_jusqua(limite: int) -> int:
        compteur = 0
        for i in range(1, limite + 1):
            if i % 2 == 0:
                compteur += 1
        return compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'compter_pairs_jusqua' in locals(), "La fonction 'compter_pairs_jusqua' n'est pas définie."
assert compter_pairs_jusqua(10) == 5
assert compter_pairs_jusqua(7) == 3
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-2-2" label="2.2 [Facile] - Compter les voyelles">
    <Enonce>
    ### Exercice 2.2 [Facile] : Compter les voyelles
    **Écrire une fonction `compter_voyelles` qui prend une chaîne `phrase` et renvoie le nombre de voyelles.**
    *Rappel : `lettre in voyelles` teste si un caractère appartient à une chaîne (`"a" in "aeiou"` → `True`).*

    <Correction>
    ```python
    def compter_voyelles(phrase: str) -> int:
        voyelles = "aeiouyAEIOUY"
        compteur = 0
        for lettre in phrase:
            if lettre in voyelles:
                compteur += 1
        return compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'compter_voyelles' in locals(), "La fonction 'compter_voyelles' n'est pas définie."
assert compter_voyelles("bonjour") == 3
assert compter_voyelles("NSI") == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-2-3" label="2.3 [Facile] - Inverser une chaîne">
    <Enonce>
    ### Exercice 2.3 [Facile] : Inverser une chaîne
    **Écrire une fonction `inverser` qui prend une chaîne `texte` et renvoie cette chaîne à l'envers avec une boucle `for`.**

    <Correction>
    ```python
    def inverser(texte: str) -> str:
        resultat = ""
        for car in texte:
            resultat = car + resultat
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'inverser' in locals(), "La fonction 'inverser' n'est pas définie."
assert inverser("bonjour") == "ruojnob"
assert inverser("radar") == "radar"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-2-4" label="2.4 [Facile] - Somme des chiffres">
    <Enonce>
    ### Exercice 2.4 [Facile] : Somme des chiffres
    **Écrire une fonction `somme_chiffres` qui prend une chaîne ou un entier représentant un nombre et renvoie la somme de ses chiffres.**

    <Correction>
    ```python
    def somme_chiffres(nombre) -> int:
        texte = str(nombre)
        somme = 0
        for chiffre in texte:
            if chiffre in "0123456789":
                somme += int(chiffre)
        return somme
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'somme_chiffres' in locals(), "La fonction 'somme_chiffres' n'est pas définie."
assert somme_chiffres("123") == 6
assert somme_chiffres(1001) == 2
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-2-5" label="2.5 [Facile] - Somme des pairs">
    <Enonce>
    ### Exercice 2.5 [Facile] : Somme des pairs
    **Écrire une fonction `somme_pairs_jusqua` qui prend un entier `n` et renvoie la somme de tous les entiers pairs de 1 à `n` inclus.**

    <Correction>
    ```python
    def somme_pairs_jusqua(n: int) -> int:
        somme = 0
        for i in range(1, n + 1):
            if i % 2 == 0:
                somme += i
        return somme
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'somme_pairs_jusqua' in locals(), "La fonction 'somme_pairs_jusqua' n'est pas définie."
assert somme_pairs_jusqua(10) == 30
assert somme_pairs_jusqua(6) == 12
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-2-6" label="2.6 [Facile] - Compter les consonnes">
    <Enonce>
    ### Exercice 2.6 [Facile] : Compter les consonnes
    **Écrire une fonction `compter_consonnes` qui prend une chaîne alphabétique et renvoie le nombre de consonnes. Utilisez `lettre in voyelles` pour repérer les voyelles.**

    <Correction>
    ```python
    def compter_consonnes(texte: str) -> int:
        voyelles = "aeiouyAEIOUY"
        compteur = 0
        for lettre in texte:
            if lettre.isalpha() and lettre not in voyelles:
                compteur += 1
        return compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'compter_consonnes' in locals(), "La fonction 'compter_consonnes' n'est pas définie."
assert compter_consonnes("bonjour") == 4
assert compter_consonnes("aeiou") == 0
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 3 : MOYEN (3.1 à 3.6)             */}
  {/* ========================================== */}

  <ExerciseSection id="boucles-3-1" label="3.1 [Moyen] - Caractères avant un arrêt">
    <Enonce>
    ### Exercice 3.1 [Moyen] : Caractères avant un arrêt
    **Écrire une fonction `caracteres_avant` qui prend une chaîne `texte` et un caractère `arret`, et renvoie tous les caractères **avant** la première occurrence de `arret`. Si `arret` est absent, renvoyer toute la chaîne.**

    <Correction>
    ```python
    def caracteres_avant(texte: str, arret: str) -> str:
        resultat = ""
        for car in texte:
            if car == arret:
                break
            resultat += car
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'caracteres_avant' in locals(), "La fonction 'caracteres_avant' n'est pas définie."
assert caracteres_avant("bonjour", "j") == "bon"
assert caracteres_avant("nsi", "z") == "nsi"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-3-2" label="3.2 [Moyen] - Multiples de 3">
    <Enonce>
    ### Exercice 3.2 [Moyen] : Multiples de 3
    **Écrire une fonction `dernier_multiple_3` qui part d'un entier `depart`, multiplie 10 fois par 3, et renvoie la dernière valeur obtenue.**

    <Correction>
    ```python
    def dernier_multiple_3(depart: int) -> int:
        valeur = depart
        for _ in range(10):
            valeur *= 3
        return valeur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'dernier_multiple_3' in locals(), "La fonction 'dernier_multiple_3' n'est pas définie."
assert dernier_multiple_3(1) == 59049
assert dernier_multiple_3(2) == 118098
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-3-3" label="3.3 [Moyen] - Divisions par 2">
    <Enonce>
    ### Exercice 3.3 [Moyen] : Divisions par 2
    **Écrire une fonction `divisions_par_deux` qui prend un entier `n` et renvoie combien de divisions entières par 2 sont possibles avant d'obtenir une valeur ≤ 1 (boucle `while`).**

    <Correction>
    ```python
    def divisions_par_deux(n: int) -> int:
        compteur = 0
        while n > 1:
            n //= 2
            compteur += 1
        return compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'divisions_par_deux' in locals(), "La fonction 'divisions_par_deux' n'est pas définie."
assert divisions_par_deux(16) == 4
assert divisions_par_deux(10) == 3
assert divisions_par_deux(1) == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-3-4" label="3.4 [Moyen] - Factorielle">
    <Enonce>
    ### Exercice 3.4 [Moyen] : Factorielle
    **Écrire une fonction `factorielle` qui prend un entier `n` ≥ 0 et renvoie `n!`. Par convention, `factorielle(0)` vaut 1.**

    <Correction>
    ```python
    def factorielle(n: int) -> int:
        resultat = 1
        for i in range(1, n + 1):
            resultat *= i
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'factorielle' in locals(), "La fonction 'factorielle' n'est pas définie."
assert factorielle(0) == 1
assert factorielle(5) == 120
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-3-5" label="3.5 [Moyen] - Moyenne des chiffres">
    <Enonce>
    ### Exercice 3.5 [Moyen] : Moyenne des chiffres
    **Écrire une fonction `moyenne_chiffres` qui prend une chaîne de chiffres (ex. `"2040"`) et renvoie la moyenne de ses chiffres, sans utiliser `sum()` ni `len()`.**

    <Correction>
    ```python
    def moyenne_chiffres(texte: str) -> float:
        total = 0
        compteur = 0
        for car in texte:
            if car in "0123456789":
                total += int(car)
                compteur += 1
        return total / compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'moyenne_chiffres' in locals(), "La fonction 'moyenne_chiffres' n'est pas définie."
assert moyenne_chiffres("2040") == 1.5
assert moyenne_chiffres("55") == 5.0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-3-6" label="3.6 [Moyen] - Maximum des chiffres">
    <Enonce>
    ### Exercice 3.6 [Moyen] : Maximum des chiffres
    **Écrire une fonction `maximum_chiffres` qui prend une chaîne de chiffres non vide et renvoie le plus grand chiffre, sans utiliser `max()`.**

    <Correction>
    ```python
    def maximum_chiffres(texte: str) -> int:
        meilleur = int(texte[0])
        for car in texte[1:]:
            valeur = int(car)
            if valeur > meilleur:
                meilleur = valeur
        return meilleur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'maximum_chiffres' in locals(), "La fonction 'maximum_chiffres' n'est pas définie."
assert maximum_chiffres("392") == 9
assert maximum_chiffres("105") == 5
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 4 : AVANCÉ (4.1 à 4.6)            */}
  {/* ========================================== */}

  <ExerciseSection id="boucles-4-1" label="4.1 [Avancé] - Nième Fibonacci">
    <Enonce>
    ### Exercice 4.1 [Avancé] : Nième Fibonacci
    **Écrire une fonction `fibonacci_nieme` qui prend un entier `n` ≥ 1 et renvoie le `n`-ième terme de Fibonacci (suite commençant par 1, 1, 2, 3, 5…).**

    <Correction>
    ```python
    def fibonacci_nieme(n: int) -> int:
        if n == 1 or n == 2:
            return 1
        precedent = 1
        courant = 1
        for _ in range(3, n + 1):
            suivant = precedent + courant
            precedent = courant
            courant = suivant
        return courant
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'fibonacci_nieme' in locals(), "La fonction 'fibonacci_nieme' n'est pas définie."
assert fibonacci_nieme(1) == 1
assert fibonacci_nieme(6) == 8
assert fibonacci_nieme(7) == 13
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-4-2" label="4.2 [Avancé] - Compter une lettre">
    <Enonce>
    ### Exercice 4.2 [Avancé] : Compter une lettre
    **Écrire une fonction `compter_lettre` qui prend une chaîne `texte` et un caractère `lettre`, puis renvoie le nombre d'occurrences.**

    <Correction>
    ```python
    def compter_lettre(texte: str, lettre: str) -> int:
        compteur = 0
        for car in texte:
            if car == lettre:
                compteur += 1
        return compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'compter_lettre' in locals(), "La fonction 'compter_lettre' n'est pas définie."
assert compter_lettre("banane", "a") == 3
assert compter_lettre("nsi", "z") == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-4-3" label="4.3 [Avancé] - Palindrome">
    <Enonce>
    ### Exercice 4.3 [Avancé] : Palindrome
    **Écrire une fonction `est_palindrome` qui prend une chaîne `texte` et renvoie `True` si elle se lit à l'identique à l'envers (boucle sur les indices).**

    <Correction>
    ```python
    def est_palindrome(texte: str) -> bool:
        for i in range(len(texte) // 2):
            if texte[i] != texte[-1 - i]:
                return False
        return True
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'est_palindrome' in locals(), "La fonction 'est_palindrome' n'est pas définie."
assert est_palindrome("radar") is True
assert est_palindrome("python") is False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-4-4" label="4.4 [Avancé] - PGCD par soustractions">
    <Enonce>
    ### Exercice 4.4 [Avancé] : PGCD par soustractions
    **Écrire une fonction `pgcd_soustractions` qui calcule le PGCD de deux entiers positifs par soustractions successives (`while`).**

    <Correction>
    ```python
    def pgcd_soustractions(a: int, b: int) -> int:
        while a != b:
            if a > b:
                a -= b
            else:
                b -= a
        return a
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'pgcd_soustractions' in locals(), "La fonction 'pgcd_soustractions' n'est pas définie."
assert pgcd_soustractions(12, 18) == 6
assert pgcd_soustractions(7, 5) == 1
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-4-5" label="4.5 [Avancé] - Conversion en binaire">
    <Enonce>
    ### Exercice 4.5 [Avancé] : Conversion en binaire
    **Écrire une fonction `vers_binaire` qui prend un entier `n` ≥ 0 et renvoie sa représentation binaire (chaîne), par divisions successives par 2.**

    <Correction>
    ```python
    def vers_binaire(n: int) -> str:
        if n == 0:
            return "0"
        binaire = ""
        while n > 0:
            binaire = str(n % 2) + binaire
            n //= 2
        return binaire
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'vers_binaire' in locals(), "La fonction 'vers_binaire' n'est pas définie."
assert vers_binaire(0) == "0"
assert vers_binaire(6) == "110"
assert vers_binaire(13) == "1101"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-4-6" label="4.6 [Avancé] - Première position">
    <Enonce>
    ### Exercice 4.6 [Avancé] : Première position
    **Écrire une fonction `premiere_position` qui prend une chaîne `texte` et un caractère `cible`, et renvoie l'indice de la première occurrence, ou `-1` si absent.**

    <Correction>
    ```python
    def premiere_position(texte: str, cible: str) -> int:
        for i in range(len(texte)):
            if texte[i] == cible:
                return i
        return -1
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'premiere_position' in locals(), "La fonction 'premiere_position' n'est pas définie."
assert premiere_position("banane", "a") == 1
assert premiere_position("nsi", "z") == -1
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 5 : DIFFICILE (5.1 à 5.6)         */}
  {/* ========================================== */}

  <ExerciseSection id="boucles-5-1" label="5.1 [Difficile] - Nombre premier">
    <Enonce>
    ### Exercice 5.1 [Difficile] : Nombre premier
    **Écrire une fonction `est_premier` qui prend un entier `n` > 1 et renvoie `True` s'il n'a aucun diviseur strict entre 2 et `n - 1`.**

    <Correction>
    ```python
    def est_premier(n: int) -> bool:
        if n <= 1:
            return False
        for diviseur in range(2, n):
            if n % diviseur == 0:
                return False
        return True
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'est_premier' in locals(), "La fonction 'est_premier' n'est pas définie."
assert est_premier(13) is True
assert est_premier(15) is False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-5-2" label="5.2 [Difficile] - Temps de vol Syracuse">
    <Enonce>
    ### Exercice 5.2 [Difficile] : Temps de vol Syracuse
    **Écrire une fonction `syracuse_vol` qui prend un entier `n` et renvoie le nombre d'étapes pour atteindre 1 (conjecture de Syracuse).**

    <Correction>
    ```python
    def syracuse_vol(n: int) -> int:
        etapes = 0
        while n > 1:
            if n % 2 == 0:
                n //= 2
            else:
                n = n * 3 + 1
            etapes += 1
        return etapes
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'syracuse_vol' in locals(), "La fonction 'syracuse_vol' n'est pas définie."
assert syracuse_vol(1) == 0
assert syracuse_vol(3) == 7
assert syracuse_vol(10) == 6
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-5-3" label="5.3 [Difficile] - Compter les premiers">
    <Enonce>
    ### Exercice 5.3 [Difficile] : Compter les premiers
    **Écrire une fonction `compter_premiers_jusqua` qui prend un entier `n` et renvoie combien de nombres premiers il y a entre 2 et `n` inclus.**

    <Correction>
    ```python
    def compter_premiers_jusqua(n: int) -> int:
        compteur = 0
        for candidat in range(2, n + 1):
            premier = True
            for diviseur in range(2, candidat):
                if candidat % diviseur == 0:
                    premier = False
                    break
            if premier:
                compteur += 1
        return compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'compter_premiers_jusqua' in locals(), "La fonction 'compter_premiers_jusqua' n'est pas définie."
assert compter_premiers_jusqua(10) == 4
assert compter_premiers_jusqua(2) == 1
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-5-4" label="5.4 [Difficile] - Chaîne Syracuse">
    <Enonce>
    ### Exercice 5.4 [Difficile] : Chaîne Syracuse
    **Écrire une fonction `chaine_syracuse` qui prend un entier `depart` et renvoie la suite de Syracuse sous forme de chaîne, valeurs séparées par `>` jusqu'à `1`.**
    *Exemple : `chaine_syracuse(10)` → `"10>5>16>8>4>2>1"`.*

    <Correction>
    ```python
    def chaine_syracuse(depart: int) -> str:
        resultat = str(depart)
        n = depart
        while n != 1:
            if n % 2 == 0:
                n //= 2
            else:
                n = n * 3 + 1
            resultat += ">" + str(n)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'chaine_syracuse' in locals(), "La fonction 'chaine_syracuse' n'est pas définie."
assert chaine_syracuse(10) == "10>5>16>8>4>2>1"
assert chaine_syracuse(1) == "1"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-5-5" label="5.5 [Difficile] - Carré par additions impaires">
    <Enonce>
    ### Exercice 5.5 [Difficile] : Carré par additions impaires
    **Écrire une fonction `carre_par_additions` qui prend un entier `n` ≥ 0 et calcule `n²` en additionnant les `n` premiers impairs (1 + 3 + 5 + …).**

    <Correction>
    ```python
    def carre_par_additions(n: int) -> int:
        somme = 0
        impair = 1
        for _ in range(n):
            somme += impair
            impair += 2
        return somme
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'carre_par_additions' in locals(), "La fonction 'carre_par_additions' n'est pas définie."
assert carre_par_additions(4) == 16
assert carre_par_additions(0) == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-5-6" label="5.6 [Difficile] - Somme des impairs">
    <Enonce>
    ### Exercice 5.6 [Difficile] : Somme des impairs
    **Écrire une fonction `somme_impairs_jusqua` qui prend un entier `n` et renvoie la somme des impairs positifs ≤ `n`.**

    <Correction>
    ```python
    def somme_impairs_jusqua(n: int) -> int:
        somme = 0
        for i in range(1, n + 1, 2):
            somme += i
        return somme
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'somme_impairs_jusqua' in locals(), "La fonction 'somme_impairs_jusqua' n'est pas définie."
assert somme_impairs_jusqua(5) == 9
assert somme_impairs_jusqua(6) == 9
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 6 : EXPERT (6.1 à 6.3)            */}
  {/* ========================================== */}

  <ExerciseSection id="boucles-6-1" label="6.1 [Expert] - Plus longue série">
    <Enonce>
    ### Exercice 6.1 [Expert] : Plus longue série
    **Écrire une fonction `plus_longue_serie` qui prend une chaîne `texte` et renvoie la longueur de la plus longue série de caractères identiques consécutifs.**
    *Exemple : `plus_longue_serie("aaabbcc")` → `3`.*

    <Correction>
    ```python
    def plus_longue_serie(texte: str) -> int:
        if texte == "":
            return 0
        meilleur = 1
        courant = 1
        for i in range(1, len(texte)):
            if texte[i] == texte[i - 1]:
                courant += 1
                if courant > meilleur:
                    meilleur = courant
            else:
                courant = 1
        return meilleur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'plus_longue_serie' in locals(), "La fonction 'plus_longue_serie' n'est pas définie."
assert plus_longue_serie("aaabbcc") == 3
assert plus_longue_serie("abc") == 1
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-6-2" label="6.2 [Expert] - Chiffrement de César">
    <Enonce>
    ### Exercice 6.2 [Expert] : Chiffrement de César
    **Écrire une fonction `cesar` qui prend une chaîne de lettres minuscules `texte` et un entier `decalage`, puis renvoie le texte chiffré (décalage circulaire). Utilisez `if "a" <= lettre <= "z"` pour filtrer les lettres.**

    <Correction>
    ```python
    def cesar(texte: str, decalage: int) -> str:
        resultat = ""
        for lettre in texte:
            if "a" <= lettre <= "z":
                code = (ord(lettre) - ord("a") + decalage) % 26
                resultat += chr(code + ord("a"))
            else:
                resultat += lettre
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'cesar' in locals(), "La fonction 'cesar' n'est pas définie."
assert cesar("abc", 3) == "def"
assert cesar("xyz", 3) == "abc"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-6-3" label="6.3 [Expert] - Doublement d'un capital">
    <Enonce>
    ### Exercice 6.3 [Expert] : Doublement d'un capital
    **Écrire une fonction `annees_doublement` qui prend un capital initial et un taux d'intérêt annuel, et renvoie le nombre d'années pour doubler le capital (`while`).**

    <Correction>
    ```python
    def annees_doublement(capital: float, taux: float) -> int:
        cible = capital * 2
        annees = 0
        while capital < cible:
            capital += capital * taux
            annees += 1
        return annees
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'annees_doublement' in locals(), "La fonction 'annees_doublement' n'est pas définie."
assert annees_doublement(1000, 0.05) == 15
assert annees_doublement(100, 0.10) == 8
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
