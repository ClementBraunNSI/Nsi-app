---
title: 'Exercices : Les Fonctions'
icon: "🧩"
chapter: Introduction à Python
badgeId: les-fonctions-python
meta: 'Définition, Paramètres et Valeurs de retour'
level: premiere
prerequisites:
  - python_exercices_boucles
---

{/* L'id 'les-fonctions-python' doit correspondre à l'identifiant 
  utilisé dans votre base de données pour cette fiche précise. 
*/}
<ExerciseTabs courseId="les-fonctions-python" courseTitle="Les Fonctions">
  
  {/* ========================================== */}
  {/* CPTÉGORIE 1 : FACILE (1.1 à 1.6)            */}
  {/* ========================================== */}

  <ExerciseSection id="fonctions-1-1" label="1.1 [Facile] - Calcul de la moyenne">
    <Enonce>
    ### Exercice 1.1 [Facile] : Calcul de la moyenne
    **Écrire une fonction `moyenne` qui prend deux nombres en paramètres et renvoie leur moyenne.**

    <Correction>
    ```python
    def moyenne(a, b):
        return (a + b) / 2
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'moyenne' in locals(), "La fonction 'moyenne' n'est pas définie."
assert callable(moyenne), "'moyenne' doit être une fonction."
assert moyenne(10, 20) == 15, "moyenne(10, 20) devrait renvoyer 15."
assert moyenne(0, 10) == 5, "moyenne(0, 10) devrait renvoyer 5."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-1-2" label="1.2 [Facile] - Fonction est_pair (En-tête)">
    <Enonce>
    ### Exercice 1.2 [Facile] : Fonction est_pair (En-tête)
    **Écrire l'en-tête d'une fonction `est_pair` qui prend en paramètre un nombre entier et renvoie un booléen.**

    <Correction>
    ```python
    def est_pair(n: int) -> bool:
        # L'en-tête est la ligne au-dessus
        return n % 2 == 0
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'est_pair' in locals(), "La fonction 'est_pair' n'est pas définie."
assert callable(est_pair), "'est_pair' doit être une fonction."
assert est_pair(4) is True, "est_pair(4) doit renvoyer True."
assert est_pair(5) is False, "est_pair(5) doit renvoyer False."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-1-3" label="1.3 [Facile] - Afficher la somme">
    <Enonce>
    ### Exercice 1.3 [Facile] : Afficher la somme
    **Écrire l'en-tête d'une fonction `afficher_somme` qui prend deux nombres en paramètres et ne renvoie rien (procédure).**

    <Correction>
    ```python
    def afficher_somme(a, b) -> None:
        print(a + b)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'afficher_somme' in locals(), "La fonction 'afficher_somme' n'est pas définie."
assert callable(afficher_somme), "'afficher_somme' doit être une fonction."
assert afficher_somme(2, 3) is None, "La fonction ne doit rien renvoyer (None)."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-1-4" label="1.4 [Facile] - Fonction parité">
    <Enonce>
    ### Exercice 1.4 [Facile] : Fonction parité
    **Écrire une fonction `parite` qui prend un entier un paramètre et renvoie `True` si le nombre est pair, `False` sinon. Utilisez le type hinting.**
    *Exemple : parite(7) doit renvoyer False.*

    <Correction>
    ```python
    def parite(nombre: int) -> bool:
        return nombre % 2 == 0
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'parite' in locals(), "La fonction 'parite' n'est pas définie."
assert callable(parite), "'parite' doit être une fonction."
assert parite(8) is True, "parite(8) doit renvoyer True."
assert parite(7) is False, "parite(7) doit renvoyer False."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-1-5" label="1.5 [Facile] - Aire d'un triangle">
    <Enonce>
    ### Exercice 1.5 [Facile] : Aire d'un triangle
    **Écrire une fonction `aire_triangle` qui prend en paramètres la base et la hauteur d'un triangle (nombres flottants) et renvoie son aire.**

    <Correction>
    ```python
    def aire_triangle(base: float, hauteur: float) -> float:
        return (base * hauteur) / 2
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'aire_triangle' in locals(), "La fonction 'aire_triangle' n'est pas définie."
assert callable(aire_triangle), "'aire_triangle' doit être une fonction."
assert aire_triangle(10.0, 5.0) == 25.0, "aire_triangle(10.0, 5.0) devrait renvoyer 25.0."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-1-6" label="1.6 [Facile] - Salutation">
    <Enonce>
    ### Exercice 1.6 [Facile] : Salutation
    **Écrire une fonction `saluer` qui prend une chaîne de caractères `nom` en paramètre et renvoie une salutation de la forme `"Bonjour, ... !"`.**

    <Correction>
    ```python
    def saluer(nom: str) -> str:
        return "Bonjour, " + nom + " !"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'saluer' in locals(), "La fonction 'saluer' n'est pas définie."
assert saluer("Alice") == "Bonjour, Alice !", "Le format de salutation est incorrect."
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 2 : MOYEN (2.1 à 2.6)             */}
  {/* ========================================== */}

  <ExerciseSection id="fonctions-2-1" label="2.1 [Moyen] - Signe d'un nombre">
    <Enonce>
    ### Exercice 2.1 [Moyen] : Signe d'un nombre
    **Écrire une fonction `signe` qui prend un nombre entier en paramètre et renvoie `"positif"` s'il est strictement supérieur à 0, `"negatif"` s'il est strictement inférieur à 0, et `"nul"` sinon.**

    <Correction>
    ```python
    def signe(n: int) -> str:
        if n > 0:
            return "positif"
        elif n < 0:
            return "negatif"
        else:
            return "nul"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'signe' in locals(), "La fonction 'signe' n'est pas définie."
assert signe(5) == "positif", "signe(5) devrait renvoyer 'positif'."
assert signe(-3) == "negatif", "signe(-3) devrait renvoyer 'negatif'."
assert signe(0) == "nul", "signe(0) devrait renvoyer 'nul'."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-2-2" label="2.2 [Moyen] - Tarif cinéma">
    <Enonce>
    ### Exercice 2.2 [Moyen] : Tarif cinéma
    **Écrire une fonction `prix_ticket` qui prend l'âge d'un spectateur (entier) et renvoie le prix en euros : `5` si moins de 14 ans, `8` si moins de 26 ans, et `11` sinon.**

    <Correction>
    ```python
    def prix_ticket(age: int) -> int:
        if age < 14:
            return 5
        elif age < 26:
            return 8
        else:
            return 11
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'prix_ticket' in locals(), "La fonction 'prix_ticket' n'est pas définie."
assert prix_ticket(12) == 5, "prix_ticket(12) devrait renvoyer 5."
assert prix_ticket(20) == 8, "prix_ticket(20) devrait renvoyer 8."
assert prix_ticket(35) == 11, "prix_ticket(35) devrait renvoyer 11."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-2-3" label="2.3 [Moyen] - Année bissextile">
    <Enonce>
    ### Exercice 2.3 [Moyen] : Année bissextile
    **Écrire une fonction `est_bissextile` qui prend une année en paramètre et renvoie `True` si elle est bissextile, `False` sinon. (Rappel : divisible par 4 mais pas par 100, ou divisible par 400).**

    <Correction>
    ```python
    def est_bissextile(annee: int) -> bool:
        return (annee % 4 == 0 and annee % 100 != 0) or (annee % 400 == 0)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'est_bissextile' in locals(), "La fonction 'est_bissextile' n'est pas définie."
assert est_bissextile(2024) is True, "2024 est bissextile."
assert est_bissextile(2100) is False, "2100 n'est pas bissextile."
assert est_bissextile(2000) is True, "2000 est bissextile."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-2-4" label="2.4 [Moyen] - Maximum de deux nombres">
    <Enonce>
    ### Exercice 2.4 [Moyen] : Maximum de deux nombres
    **Écrire une fonction `maximum_deux` qui renvoie le plus grand de deux nombres passés en arguments, sans utiliser la fonction native `max()`.**

    <Correction>
    ```python
    def maximum_deux(a: float, b: float) -> float:
        if a > b:
            return a
        return b
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'maximum_deux' in locals(), "La fonction 'maximum_deux' n'est pas définie."
assert maximum_deux(12, 4) == 12, "Le maximum entre 12 et 4 est 12."
assert maximum_deux(-5, -1) == -1, "Le maximum entre -5 et -1 est -1."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-2-5" label="2.5 [Moyen] - Conversion de secondes">
    <Enonce>
    ### Exercice 2.5 [Moyen] : Conversion de secondes
    **Écrire une fonction `minutes_restantes` qui prend un nombre total de secondes en paramètre et renvoie le nombre de secondes restantes après avoir extrait les minutes complètes (opérateur modulo).**

    <Correction>
    ```python
    def minutes_restantes(secondes: int) -> int:
        return secondes % 60
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'minutes_restantes' in locals(), "La fonction 'minutes_restantes' n'est pas définie."
assert minutes_restantes(125) == 5, "125 secondes correspondent à 2 minutes et 5 secondes."
assert minutes_restantes(60) == 0, "60 secondes correspondent à 1 minute pile."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-2-6" label="2.6 [Moyen] - Mention au Baccalauréat">
    <Enonce>
    ### Exercice 2.6 [Moyen] : Mention au Baccalauréat
    **Écrire une fonction `mention` qui prend une note (flottant entre 0 et 20) et renvoie `"Très Bien"` si la note est supérieure ou égale à 16, `"Bien"` si elle est entre 14 et 16 (exclu), `"Assez Bien"` entre 12 et 14 (exclu), et `"Pas de mention"` sinon.**

    <Correction>
    ```python
    def mention(note: float) -> str:
        if note >= 16:
            return "Très Bien"
        elif note >= 14:
            return "Bien"
        elif note >= 12:
            return "Assez Bien"
        else:
            return "Pas de mention"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'mention' in locals(), "La fonction 'mention' n'est pas définie."
assert mention(16.5) == "Très Bien"
assert mention(14.0) == "Bien"
assert mention(11.5) == "Pas de mention"
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 3 : AVANCÉ (3.1 à 3.6)            */}
  {/* ========================================== */}

  <ExerciseSection id="fonctions-3-1" label="3.1 [Avancé] - Compter une lettre">
    <Enonce>
    ### Exercice 3.1 [Avancé] : Compter une lettre
    **Écrire une fonction `compter_lettre` qui prend en paramètres une chaîne de caractères `chaine` et un caractère `lettre`, puis renvoie le nombre de fois où cette lettre apparaît.**

    <Correction>
    ```python
    def compter_lettre(chaine: str, lettre: str) -> int:
        compteur = 0
        for car in chaine:
            if car == lettre:
                compteur += 1
        return compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'compter_lettre' in locals(), "La fonction 'compter_lettre' n'est pas définie."
assert compter_lettre("nsi", "z") == 0, "La lettre z n'est pas dans 'nsi'."
assert compter_lettre("gagner", "g") == 2, "La lettre g apparaît 2 fois."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-3-2" label="3.2 [Avancé] - Inverser une chaîne">
    <Enonce>
    ### Exercice 3.2 [Avancé] : Inverser une chaîne
    **Écrire une fonction `inverser` qui prend une chaîne de caractères en paramètre et renvoie cette même chaîne écrite à l'envers, en utilisant une accumulation dans une boucle.**

    <Correction>
    ```python
    def inverser(chaine: str) -> str:
        resultat = ""
        for car in chaine:
            resultat = car + resultat
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'inverser' in locals(), "La fonction 'inverser' n'est pas définie."
assert inverser("abc") == "cba", "L'inverse de 'abc' est 'cba'."
assert inverser("radar") == "radar", "'radar' est un palindrome."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-3-3" label="3.3 [Avancé] - Détection d'espace">
    <Enonce>
    ### Exercice 3.3 [Avancé] : Détection d'espace
    **Écrire une fonction `a_espace` qui prend une chaîne de caractères en paramètre et renvoie `True` si elle contient au moins un espace, et `False` sinon.**

    <Correction>
    ```python
    def a_espace(chaine: str) -> bool:
        for car in chaine:
            if car == " ":
                return True
        return False
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'a_espace' in locals(), "La fonction 'a_espace' n'est pas définie."
assert a_espace("Numérique") is False
assert a_espace("Hello World") is True
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-3-4" label="3.4 [Avancé] - Somme des impairs">
    <Enonce>
    ### Exercice 3.4 [Avancé] : Somme des impairs
    **Écrire une fonction `somme_impairs` qui prend un entier `n` en paramètre et renvoie la somme de tous les entiers impairs positifs inférieurs ou égaux à `n`.**

    <Correction>
    ```python
    def somme_impairs(n: int) -> int:
        somme = 0
        for i in range(1, n + 1, 2):
            somme += i
        return somme
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'somme_impairs' in locals(), "La fonction 'somme_impairs' n'est pas définie."
assert somme_impairs(5) == 9, "1 + 3 + 5 = 9."
assert somme_impairs(6) == 9, "1 + 3 + 5 = 9."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-3-5" label="3.5 [Avancé] - Calcul de factorielle">
    <Enonce>
    ### Exercice 3.5 [Avancé] : Calcul de factorielle
    **Écrire une fonction `factorielle` qui prend un entier positif `n` en paramètre et renvoie son produit factoriel ($n! = 1 \times 2 \times \dots \times n$). On rappelle que `factorielle(0)` vaut 1.**

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
assert factorielle(0) == 1, "Par convention factorielle(0) vaut 1."
assert factorielle(4) == 24, "1 * 2 * 3 * 4 = 24."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-3-6" label="3.6 [Avancé] - Répéter une chaîne">
    <Enonce>
    ### Exercice 3.6 [Avancé] : Répéter une chaîne
    **Écrire une fonction `repeter` qui prend une chaîne `texte` et un entier `n` en paramètres, et renvoie une nouvelle chaîne contenant `n` fois le `texte` d'origine séparé par un tiret `"-"`.**
    *Exemple : repeter("NSI", 3) doit renvoyer "NSI-NSI-NSI".*

    <Correction>
    ```python
    def repeter(texte: str, n: int) -> str:
        if n <= 0:
            return ""
        resultat = texte
        for _ in range(n - 1):
            resultat += "-" + texte
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'repeter' in locals(), "La fonction 'repeter' n'est pas définie."
assert repeter("NSI", 3) == "NSI-NSI-NSI"
assert repeter("A", 1) == "A"
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 4 : DIFFICILE (4.1 à 4.4)         */}
  {/* ========================================== */}

  <ExerciseSection id="fonctions-4-1" label="4.1 [Difficile] - Syracuse (Temps de vol)">
    <Enonce>
    ### Exercice 4.1 [Difficile] : Syracuse (Temps de vol)
    **Écrire une fonction `syracuse_vol` qui applique la conjecture de Syracuse à un entier `n`. Tant que la valeur n'atteint pas 1, si le nombre est pair on le divise par 2, s'il est impair on le multiplie par 3 et on ajoute 1. La fonction doit renvoyer le nombre d'étapes (le temps de vol) pour atteindre 1.**

    <Correction>
    ```python
    def syracuse_vol(n: int) -> int:
        etapes = 0
        while n > 1:
            if n % 2 == 0:
                n = n // 2
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
assert syracuse_vol(1) == 0, "Déjà à 1, 0 étape."
assert syracuse_vol(3) == 7, "Le temps de vol pour 3 est de 7 étapes."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-4-2" label="4.2 [Difficile] - Placement financier">
    <Enonce>
    ### Exercice 4.2 [Difficile] : Placement financier
    **Écrire une fonction `temps_doublement` qui prend un capital initial et un taux d'intérêt annuel (ex: `0.03` pour 3%). À l'aide d'une boucle `while`, calculez et renvoyez le nombre d'années nécessaires pour que le capital double.**

    <Correction>
    ```python
    def temps_doublement(capital: float, taux: float) -> int:
        capital_cible = capital * 2
        annees = 0
        while capital < capital_cible:
            capital += capital * taux
            annees += 1
        return annees
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'temps_doublement' in locals(), "La fonction 'temps_doublement' n'est pas définie."
assert temps_doublement(1000, 0.05) == 15, "À 5%, un capital double en 15 ans."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-4-3" label="4.3 [Difficile] - Chiffrement de César (Lettre)">
    <Enonce>
    ### Exercice 4.3 [Difficile] : Chiffrement de César (Lettre)
    **Écrire une fonction `decaler_lettre` qui prend une lettre minuscule (caractère unique) et un entier `decalage`, puis renvoie la nouvelle lettre minuscule après décalage circulaire dans l'alphabet. On utilisera `ord()` et `chr()`.**

    <Correction>
    ```python
    def decaler_lettre(lettre: str, decalage: int) -> str:
        code_initial = ord(lettre) - ord('a')
        code_decale = (code_initial + decalage) % 26
        return chr(code_decale + ord('a'))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'decaler_lettre' in locals(), "La fonction 'decaler_lettre' n'est pas définie."
assert decaler_lettre("a", 3) == "d"
assert decaler_lettre("z", 1) == "a", "Le décalage doit être circulaire."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-4-4" label="4.4 [Difficile] - Physique (Chute libre)">
    <Enonce>
    ### Exercice 4.4 [Difficile] : Physique (Chute libre)
    **En physique, la vitesse d'un objet en chute libre sans frottements après un temps $t$ (en secondes) est donnée par la formule $v = g \times t$ avec $g = 9.81$ m/s². Écrire une fonction `vitesse_chute` qui prend le temps `t` (flottant) en paramètre et renvoie la vitesse arrondie à deux décimales grâce à la fonction `round(valeur, 2)`.**

    <Correction>
    ```python
    def vitesse_chute(t: float) -> float:
        g = 9.81
        vitesse = g * t
        return round(vitesse, 2)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'vitesse_chute' in locals(), "La fonction 'vitesse_chute' n'est pas définie."
assert vitesse_chute(2.0) == 19.62, "9.81 * 2 = 19.62."
assert vitesse_chute(0) == 0.0
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 5 : EXPERT (5.1 à 5.3)            */}
  {/* ========================================== */}

  <ExerciseSection id="fonctions-5-1" label="5.1 [Expert] - Algorithme d'Euclide (PGCD)">
    <Enonce>
    ### Exercice 5.1 [Expert] : Algorithme d'Euclide (PGCD)
    **Écrire une fonction `pgcd` qui calcule le Plus Grand Commun Diviseur de deux entiers positifs `a` et `b` à l'aide de l'algorithme d'Euclide itératif (boucle `while` exploitant les restes successifs).**

    <Correction>
    ```python
    def pgcd(a: int, b: int) -> int:
        while b != 0:
            a, b = b, a % b
        return a
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'pgcd' in locals(), "La fonction 'pgcd' n'est pas définie."
assert pgcd(12, 18) == 6, "Le PGCD de 12 et 18 est 6."
assert pgcd(7, 5) == 1, "7 et 5 sont premiers entre eux."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-5-2" label="5.2 [Expert] - Test de primalité">
    <Enonce>
    ### Exercice 5.2 [Expert] : Test de primalité
    **Écrire une fonction `est_premier` qui prend un entier `n` en paramètre et renvoie `True` si le nombre est premier, et `False` sinon. On rappelle que les nombres inférieurs ou égaux à 1 ne sont pas premiers.**

    <Correction>
    ```python
    def est_premier(n: int) -> bool:
        if n <= 1:
            return False
        for i in range(2, n):
            if n % i == 0:
                return False
        return True
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'est_premier' in locals(), "La fonction 'est_premier' n'est pas définie."
assert est_premier(1) is False, "1 n'est pas premier."
assert est_premier(13) is True, "13 est un nombre premier."
assert est_premier(15) is False, "15 est divisible par 3 et 5."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonctions-5-3" label="5.3 [Expert] - Conversion en binaire (Chaîne)">
    <Enonce>
    ### Exercice 5.3 [Expert] : Conversion en binaire (Chaîne)
    **Écrire une fonction `vers_binaire` qui prend un entier positif `n` et renvoie sa représentation binaire sous forme de chaîne de caractères (`str`), obtenue par divisions successives par 2. On gérera le cas particulier où `n == 0`.**

    <Correction>
    ```python
    def vers_binaire(n: int) -> str:
        if n == 0:
            return "0"
        binaire = ""
        while n > 0:
            reste = n % 2
            binaire = str(reste) + binaire
            n = n // 2
        return binaire
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'vers_binaire' in locals(), "La fonction 'vers_binaire' n'est pas définie."
assert vers_binaire(0) == "0"
assert vers_binaire(6) == "110", "6 s'écrit 110 en binaire."
assert vers_binaire(13) == "1101", "13 s'écrit 1101 en binaire."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
