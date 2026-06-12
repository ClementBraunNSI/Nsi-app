---
title: 'Exercices : Les Boucles'
description: 'for, while, range et parcours de séquences — fiche progressive par niveau.'
icon: "\U0001F504"
chapter: Introduction à Python
badgeId: premiere_exercices_boucles
meta: 'for, while, range et parcours de séquences'
level: premiere
prerequisites:
  - python_exercices_conditions
---

<ExerciseTabs courseId="les-boucles-python" courseTitle="Les Boucles">

  {/* ========================================== */}
  {/* CATÉGORIE 1 : INTRODUCTION (1.1 à 1.6)      */}
  {/* ========================================== */}

  <ExerciseSection id="boucles-1-1" label="1.1 [Introduction] - Nombres de 1 à 100">
    <Enonce>
    ### Exercice 1.1 [Introduction] : Nombres de 1 à 100
    **Écrire une fonction `nombres_jusqua` qui prend un entier `limite` et renvoie la liste des entiers de 1 à `limite` inclus (utilisez `range` et une boucle `for` ou une liste en compréhension).**

    <Correction>
    ```python
    def nombres_jusqua(limite: int) -> list:
        resultat = []
        for i in range(1, limite + 1):
            resultat.append(i)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'nombres_jusqua' in locals(), "La fonction 'nombres_jusqua' n'est pas définie."
assert nombres_jusqua(100) == list(range(1, 101))
assert nombres_jusqua(5) == [1, 2, 3, 4, 5]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-1-2" label="1.2 [Introduction] - Table de multiplication">
    <Enonce>
    ### Exercice 1.2 [Introduction] : Table de multiplication
    **Écrire une fonction `table_multiplication` qui prend un entier `n` et renvoie la liste des 10 produits `n × 1`, `n × 2`, …, `n × 10`.**

    <Correction>
    ```python
    def table_multiplication(n: int) -> list:
        return [n * i for i in range(1, 11)]
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'table_multiplication' in locals(), "La fonction 'table_multiplication' n'est pas définie."
assert table_multiplication(7) == [7, 14, 21, 28, 35, 42, 49, 56, 63, 70]
assert table_multiplication(3) == [3, 6, 9, 12, 15, 18, 21, 24, 27, 30]
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
    **Écrire une fonction `compter_de_zero` qui prend un entier `n` (≥ 0) et renvoie la liste `[0, 1, 2, …, n]`.**

    <Correction>
    ```python
    def compter_de_zero(n: int) -> list:
        resultat = []
        for i in range(n + 1):
            resultat.append(i)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'compter_de_zero' in locals(), "La fonction 'compter_de_zero' n'est pas définie."
assert compter_de_zero(5) == [0, 1, 2, 3, 4, 5]
assert compter_de_zero(0) == [0]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-1-5" label="1.5 [Introduction] - Lettres d'une chaîne">
    <Enonce>
    ### Exercice 1.5 [Introduction] : Lettres d'une chaîne
    **Écrire une fonction `lettres_de` qui prend une chaîne `texte` et renvoie la liste de ses caractères, dans l'ordre (parcours avec `for`).**

    <Correction>
    ```python
    def lettres_de(texte: str) -> list:
        resultat = []
        for car in texte:
            resultat.append(car)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'lettres_de' in locals(), "La fonction 'lettres_de' n'est pas définie."
assert lettres_de("nsi") == ["n", "s", "i"]
assert lettres_de("") == []
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-1-6" label="1.6 [Introduction] - Ligne d'étoiles">
    <Enonce>
    ### Exercice 1.6 [Introduction] : Ligne d'étoiles
    **Écrire une fonction `ligne_etoiles` qui prend un entier `n` et renvoie une chaîne de `n` caractères `*` (ex. `ligne_etoiles(4)` → `"****"`).**

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

  <ExerciseSection id="boucles-2-1" label="2.1 [Facile] - Nombres pairs">
    <Enonce>
    ### Exercice 2.1 [Facile] : Nombres pairs
    **Écrire une fonction `nombres_pairs_jusqua` qui prend un entier `limite` et renvoie la liste des nombres pairs entre 1 et `limite` inclus.**

    <Correction>
    ```python
    def nombres_pairs_jusqua(limite: int) -> list:
        resultat = []
        for i in range(1, limite + 1):
            if i % 2 == 0:
                resultat.append(i)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'nombres_pairs_jusqua' in locals(), "La fonction 'nombres_pairs_jusqua' n'est pas définie."
assert nombres_pairs_jusqua(10) == [2, 4, 6, 8, 10]
assert nombres_pairs_jusqua(7) == [2, 4, 6]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-2-2" label="2.2 [Facile] - Compter les voyelles">
    <Enonce>
    ### Exercice 2.2 [Facile] : Compter les voyelles
    **Écrire une fonction `compter_voyelles` qui prend une chaîne `phrase` et renvoie le nombre de voyelles (`a, e, i, o, u, y`, majuscules ou minuscules).**

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
    **Écrire une fonction `inverser` qui prend une chaîne `texte` et renvoie cette chaîne à l'envers, en utilisant une boucle `for` et une accumulation.**

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
    *Exemple : `somme_chiffres("123")` → `6`.*

    <Correction>
    ```python
    def somme_chiffres(nombre) -> int:
        texte = str(nombre)
        somme = 0
        for chiffre in texte:
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
    **Écrire une fonction `compter_consonnes` qui prend une chaîne alphabétique et renvoie le nombre de consonnes (lettres qui ne sont pas des voyelles).**

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

  <ExerciseSection id="boucles-3-1" label="3.1 [Moyen] - Éléments avant le premier négatif">
    <Enonce>
    ### Exercice 3.1 [Moyen] : Éléments avant le premier négatif
    **Écrire une fonction `avant_premier_negatif` qui prend une liste de nombres et renvoie tous les éléments **avant** le premier nombre strictement négatif. Si aucun négatif, renvoyer toute la liste.**

    <Correction>
    ```python
    def avant_premier_negatif(nombres: list) -> list:
        resultat = []
        for n in nombres:
            if n < 0:
                break
            resultat.append(n)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'avant_premier_negatif' in locals(), "La fonction 'avant_premier_negatif' n'est pas définie."
assert avant_premier_negatif([3, 7, 0, -1, 5]) == [3, 7, 0]
assert avant_premier_negatif([1, 2, 3]) == [1, 2, 3]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-3-2" label="3.2 [Moyen] - Multiples de 3">
    <Enonce>
    ### Exercice 3.2 [Moyen] : Multiples de 3
    **Écrire une fonction `suite_multiples_3` qui prend un entier `depart` et renvoie la liste des 10 premières valeurs obtenues en multipliant `depart` par 3 à chaque étape.**
    *Exemple : `suite_multiples_3(1)` → `[3, 9, 27, 81, …]` (10 termes).*

    <Correction>
    ```python
    def suite_multiples_3(depart: int) -> list:
        suite = []
        valeur = depart
        for _ in range(10):
            valeur *= 3
            suite.append(valeur)
        return suite
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'suite_multiples_3' in locals(), "La fonction 'suite_multiples_3' n'est pas définie."
assert suite_multiples_3(1)[:4] == [3, 9, 27, 81]
assert len(suite_multiples_3(2)) == 10
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-3-3" label="3.3 [Moyen] - Divisions par 2">
    <Enonce>
    ### Exercice 3.3 [Moyen] : Divisions par 2
    **Écrire une fonction `divisions_par_deux` qui prend un entier `n` et renvoie combien de fois on peut diviser `n` par 2 (division entière) avant d'obtenir une valeur ≤ 1. Utilisez une boucle `while`.**

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

  <ExerciseSection id="boucles-3-5" label="3.5 [Moyen] - Moyenne d'une liste">
    <Enonce>
    ### Exercice 3.5 [Moyen] : Moyenne d'une liste
    **Écrire une fonction `moyenne_liste` qui prend une liste de nombres non vide et renvoie leur moyenne (flottant), sans utiliser `sum()` ni `len()`.**

    <Correction>
    ```python
    def moyenne_liste(valeurs: list) -> float:
        total = 0
        compteur = 0
        for v in valeurs:
            total += v
            compteur += 1
        return total / compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'moyenne_liste' in locals(), "La fonction 'moyenne_liste' n'est pas définie."
assert moyenne_liste([10, 20]) == 15.0
assert moyenne_liste([1, 2, 3, 4]) == 2.5
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-3-6" label="3.6 [Moyen] - Maximum d'une liste">
    <Enonce>
    ### Exercice 3.6 [Moyen] : Maximum d'une liste
    **Écrire une fonction `maximum_liste` qui prend une liste de nombres non vide et renvoie le plus grand élément, sans utiliser `max()`.**

    <Correction>
    ```python
    def maximum_liste(valeurs: list) -> float:
        meilleur = valeurs[0]
        for v in valeurs[1:]:
            if v > meilleur:
                meilleur = v
        return meilleur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'maximum_liste' in locals(), "La fonction 'maximum_liste' n'est pas définie."
assert maximum_liste([3, 9, 2]) == 9
assert maximum_liste([-5, -1, -3]) == -1
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 4 : AVANCÉ (4.1 à 4.6)            */}
  {/* ========================================== */}

  <ExerciseSection id="boucles-4-1" label="4.1 [Avancé] - Suite de Fibonacci">
    <Enonce>
    ### Exercice 4.1 [Avancé] : Suite de Fibonacci
    **Écrire une fonction `fibonacci` qui prend un entier `n` ≥ 1 et renvoie la liste des `n` premiers termes de Fibonacci, en commençant par `[1, 1]`.**

    <Correction>
    ```python
    def fibonacci(n: int) -> list:
        if n == 1:
            return [1]
        suite = [1, 1]
        for _ in range(n - 2):
            suite.append(suite[-1] + suite[-2])
        return suite
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'fibonacci' in locals(), "La fonction 'fibonacci' n'est pas définie."
assert fibonacci(1) == [1]
assert fibonacci(6) == [1, 1, 2, 3, 5, 8]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-4-2" label="4.2 [Avancé] - Compter une lettre">
    <Enonce>
    ### Exercice 4.2 [Avancé] : Compter une lettre
    **Écrire une fonction `compter_lettre` qui prend une chaîne `texte` et un caractère `lettre`, puis renvoie le nombre d'occurrences de `lettre` dans `texte`.**

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
    **Écrire une fonction `est_palindrome` qui prend une chaîne `texte` et renvoie `True` si elle se lit identiquement à l'envers, `False` sinon (utilisez une boucle).**

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
    **Écrire une fonction `pgcd_soustractions` qui calcule le PGCD de deux entiers positifs en soustrayant le plus petit du plus grand jusqu'à égalité (boucle `while`).**

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
    **Écrire une fonction `vers_binaire` qui prend un entier `n` ≥ 0 et renvoie sa représentation binaire sous forme de chaîne, par divisions successives par 2.**

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

  <ExerciseSection id="boucles-4-6" label="4.6 [Avancé] - Recherche linéaire">
    <Enonce>
    ### Exercice 4.6 [Avancé] : Recherche linéaire
    **Écrire une fonction `recherche_index` qui prend une liste `valeurs` et une valeur `cible`, et renvoie l'index de la première occurrence, ou `-1` si absente.**

    <Correction>
    ```python
    def recherche_index(valeurs: list, cible) -> int:
        for i in range(len(valeurs)):
            if valeurs[i] == cible:
                return i
        return -1
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'recherche_index' in locals(), "La fonction 'recherche_index' n'est pas définie."
assert recherche_index([4, 7, 2, 7], 7) == 1
assert recherche_index([1, 2, 3], 9) == -1
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 5 : DIFFICILE (5.1 à 5.6)         */}
  {/* ========================================== */}

  <ExerciseSection id="boucles-5-1" label="5.1 [Difficile] - Diviseurs d'un nombre">
    <Enonce>
    ### Exercice 5.1 [Difficile] : Diviseurs d'un nombre
    **Écrire une fonction `diviseurs` qui prend un entier `n` > 1 et renvoie la liste de ses diviseurs stricts (entre 2 et `n - 1`). Liste vide si `n` est premier.**

    <Correction>
    ```python
    def diviseurs(n: int) -> list:
        resultat = []
        for i in range(2, n):
            if n % i == 0:
                resultat.append(i)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'diviseurs' in locals(), "La fonction 'diviseurs' n'est pas définie."
assert diviseurs(12) == [2, 3, 4, 6]
assert diviseurs(13) == []
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-5-2" label="5.2 [Difficile] - Suite de Syracuse">
    <Enonce>
    ### Exercice 5.2 [Difficile] : Suite de Syracuse
    **Écrire une fonction `suite_syracuse` qui prend un entier `depart` et renvoie la liste complète de la suite de Syracuse jusqu'à `1` inclus.**
    *Règle : si pair → diviser par 2 ; sinon → `3n + 1`.*

    <Correction>
    ```python
    def suite_syracuse(depart: int) -> list:
        suite = [depart]
        n = depart
        while n != 1:
            if n % 2 == 0:
                n //= 2
            else:
                n = n * 3 + 1
            suite.append(n)
        return suite
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'suite_syracuse' in locals(), "La fonction 'suite_syracuse' n'est pas définie."
assert suite_syracuse(10) == [10, 5, 16, 8, 4, 2, 1]
assert suite_syracuse(1) == [1]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-5-3" label="5.3 [Difficile] - Nombres premiers jusqu'à n">
    <Enonce>
    ### Exercice 5.3 [Difficile] : Nombres premiers jusqu'à n
    **Écrire une fonction `premiers_jusqua` qui prend un entier `n` et renvoie la liste de tous les nombres premiers de 2 à `n` inclus.**

    <Correction>
    ```python
    def premiers_jusqua(n: int) -> list:
        premiers = []
        for candidat in range(2, n + 1):
            est_premier = True
            for diviseur in range(2, candidat):
                if candidat % diviseur == 0:
                    est_premier = False
                    break
            if est_premier:
                premiers.append(candidat)
        return premiers
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'premiers_jusqua' in locals(), "La fonction 'premiers_jusqua' n'est pas définie."
assert premiers_jusqua(10) == [2, 3, 5, 7]
assert premiers_jusqua(2) == [2]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-5-4" label="5.4 [Difficile] - Temps de vol Syracuse">
    <Enonce>
    ### Exercice 5.4 [Difficile] : Temps de vol Syracuse
    **Écrire une fonction `syracuse_vol` qui prend un entier `n` et renvoie le nombre d'étapes pour atteindre 1 dans la suite de Syracuse (0 si `n` vaut déjà 1).**

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

  <ExerciseSection id="boucles-5-5" label="5.5 [Difficile] - Carré par additions impaires">
    <Enonce>
    ### Exercice 5.5 [Difficile] : Carré par additions impaires
    **Écrire une fonction `carre_par_additions` qui prend un entier `n` ≥ 0 et calcule `n²` en additionnant les `n` premiers nombres impairs (1 + 3 + 5 + …).**
    *Exemple : `carre_par_additions(4)` → `1+3+5+7` = 16.*

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
    **Écrire une fonction `somme_impairs_jusqua` qui prend un entier `n` et renvoie la somme de tous les entiers impairs positifs inférieurs ou égaux à `n`.**

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

  <ExerciseSection id="boucles-6-1" label="6.1 [Expert] - Crible d'Ératosthène">
    <Enonce>
    ### Exercice 6.1 [Expert] : Crible d'Ératosthène
    **Écrire une fonction `crible_eratosthene` qui prend un entier `n` ≥ 2 et renvoie la liste des nombres premiers inférieurs ou égaux à `n`.**

    <Correction>
    ```python
    def crible_eratosthene(n: int) -> list:
        if n < 2:
            return []
        est_premier = [True] * (n + 1)
        est_premier[0] = est_premier[1] = False
        for i in range(2, int(n ** 0.5) + 1):
            if est_premier[i]:
                for multiple in range(i * i, n + 1, i):
                    est_premier[multiple] = False
        return [i for i in range(2, n + 1) if est_premier[i]]
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'crible_eratosthene' in locals(), "La fonction 'crible_eratosthene' n'est pas définie."
assert crible_eratosthene(10) == [2, 3, 5, 7]
assert crible_eratosthene(20) == [2, 3, 5, 7, 11, 13, 17, 19]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-6-2" label="6.2 [Expert] - Chiffrement de César">
    <Enonce>
    ### Exercice 6.2 [Expert] : Chiffrement de César
    **Écrire une fonction `cesar` qui prend une chaîne de lettres minuscules `texte` et un entier `decalage`, puis renvoie le texte chiffré (décalage circulaire dans l'alphabet). Les autres caractères sont ignorés.**

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
    **Écrire une fonction `annees_doublement` qui prend un capital initial et un taux d'intérêt annuel (ex. `0.05` pour 5 %), et renvoie le nombre d'années nécessaires pour que le capital au moins double, en appliquant les intérêts chaque année dans une boucle `while`.**

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
