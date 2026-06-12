---
title: 'Exercices : Les Conditions'
icon: "🔀"
chapter: Introduction à Python
badgeId: premiere_exercices_conditions
meta: 'if, if/else, if/elif/else et opérateurs logiques'
level: premiere
prerequisites:
  - python_constructions_elementaires
---

<ExerciseTabs courseId="les-conditions-python" courseTitle="Les Conditions">

  {/* ========================================== */}
  {/* CATÉGORIE 1 : FACILE (1.1 à 1.6)            */}
  {/* ========================================== */}

  <ExerciseSection id="conditions-1-1" label="1.1 [Facile] - Majeur ou mineur">
    <Enonce>
    ### Exercice 1.1 [Facile] : Majeur ou mineur
    **Écrire une fonction `est_majeur` qui prend un âge (entier) en paramètre et renvoie `True` si la personne est majeure (âge supérieur ou égal à 18), `False` sinon. Utilisez un `if` / `else`.**

    <Correction>
    ```python
    def est_majeur(age: int) -> bool:
        if age >= 18:
            return True
        else:
            return False
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'est_majeur' in locals(), "La fonction 'est_majeur' n'est pas définie."
assert est_majeur(20) is True, "20 ans : majeur."
assert est_majeur(15) is False, "15 ans : mineur."
assert est_majeur(18) is True, "18 ans : majeur."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-1-2" label="1.2 [Facile] - Nombre positif">
    <Enonce>
    ### Exercice 1.2 [Facile] : Nombre positif
    **Écrire une fonction `est_positif` qui prend un nombre (entier ou flottant) et renvoie `True` s'il est strictement supérieur à 0, `False` sinon.**

    <Correction>
    ```python
    def est_positif(n: float) -> bool:
        if n > 0:
            return True
        else:
            return False
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'est_positif' in locals(), "La fonction 'est_positif' n'est pas définie."
assert est_positif(3) is True
assert est_positif(0) is False
assert est_positif(-2) is False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-1-3" label="1.3 [Facile] - Parité">
    <Enonce>
    ### Exercice 1.3 [Facile] : Parité
    **Écrire une fonction `parite` qui prend un entier `n` et renvoie la chaîne `"pair"` si `n` est pair, `"impair"` sinon.**

    <Correction>
    ```python
    def parite(n: int) -> str:
        if n % 2 == 0:
            return "pair"
        else:
            return "impair"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'parite' in locals(), "La fonction 'parite' n'est pas définie."
assert parite(4) == "pair"
assert parite(7) == "impair"
assert parite(0) == "pair"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-1-4" label="1.4 [Facile] - Salutation selon l'heure">
    <Enonce>
    ### Exercice 1.4 [Facile] : Salutation selon l'heure
    **Écrire une fonction `salutation` qui prend une heure (entier entre 0 et 23) et renvoie `"Bonjour"` si l'heure est strictement inférieure à 18, `"Bonsoir"` sinon.**

    <Correction>
    ```python
    def salutation(heure: int) -> str:
        if heure < 18:
            return "Bonjour"
        else:
            return "Bonsoir"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'salutation' in locals(), "La fonction 'salutation' n'est pas définie."
assert salutation(9) == "Bonjour"
assert salutation(18) == "Bonsoir"
assert salutation(22) == "Bonsoir"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-1-5" label="1.5 [Facile] - Maximum de deux nombres">
    <Enonce>
    ### Exercice 1.5 [Facile] : Maximum de deux nombres
    **Écrire une fonction `maximum` qui prend deux nombres `a` et `b` et renvoie le plus grand des deux, sans utiliser la fonction native `max()`.**

    <Correction>
    ```python
    def maximum(a: float, b: float) -> float:
        if a > b:
            return a
        else:
            return b
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'maximum' in locals(), "La fonction 'maximum' n'est pas définie."
assert maximum(12, 5) == 12
assert maximum(3, 9) == 9
assert maximum(7, 7) == 7
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-1-6" label="1.6 [Facile] - Tarif musée">
    <Enonce>
    ### Exercice 1.6 [Facile] : Tarif musée
    **Écrire une fonction `tarif_musee` qui prend un âge et renvoie `0` si l'âge est strictement inférieur à 12 ans, `8` sinon.**

    <Correction>
    ```python
    def tarif_musee(age: int) -> int:
        if age < 12:
            return 0
        else:
            return 8
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'tarif_musee' in locals(), "La fonction 'tarif_musee' n'est pas définie."
assert tarif_musee(8) == 0
assert tarif_musee(12) == 8
assert tarif_musee(25) == 8
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 2 : MOYEN (2.1 à 2.6)             */}
  {/* ========================================== */}

  <ExerciseSection id="conditions-2-1" label="2.1 [Moyen] - Signe d'un nombre">
    <Enonce>
    ### Exercice 2.1 [Moyen] : Signe d'un nombre
    **Écrire une fonction `signe` qui prend un entier et renvoie `"positif"` s'il est strictement supérieur à 0, `"negatif"` s'il est strictement inférieur à 0, `"nul"` sinon. Utilisez `if` / `elif` / `else`.**

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
assert signe(5) == "positif"
assert signe(-3) == "negatif"
assert signe(0) == "nul"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-2-2" label="2.2 [Moyen] - Mention au collège">
    <Enonce>
    ### Exercice 2.2 [Moyen] : Mention au collège
    **Écrire une fonction `mention` qui prend une note sur 20 et renvoie :**
    - `"TB"` si la note est supérieure ou égale à 16
    - `"B"` si la note est supérieure ou égale à 14 (et inférieure à 16)
    - `"AB"` si la note est supérieure ou égale à 12 (et inférieure à 14)
    - `"Passable"` si la note est supérieure ou égale à 10 (et inférieure à 12)
    - `"Insuffisant"` sinon

    <Correction>
    ```python
    def mention(note: float) -> str:
        if note >= 16:
            return "TB"
        elif note >= 14:
            return "B"
        elif note >= 12:
            return "AB"
        elif note >= 10:
            return "Passable"
        else:
            return "Insuffisant"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'mention' in locals(), "La fonction 'mention' n'est pas définie."
assert mention(16) == "TB"
assert mention(14) == "B"
assert mention(11.5) == "Passable"
assert mention(8) == "Insuffisant"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-2-3" label="2.3 [Moyen] - Tarif cinéma">
    <Enonce>
    ### Exercice 2.3 [Moyen] : Tarif cinéma
    **Écrire une fonction `prix_cinema` qui prend un âge et renvoie le prix en euros : `5` si moins de 14 ans, `8` si moins de 26 ans, `11` sinon.**

    <Correction>
    ```python
    def prix_cinema(age: int) -> int:
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
assert 'prix_cinema' in locals(), "La fonction 'prix_cinema' n'est pas définie."
assert prix_cinema(10) == 5
assert prix_cinema(20) == 8
assert prix_cinema(30) == 11
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-2-4" label="2.4 [Moyen] - Catégorie IMC">
    <Enonce>
    ### Exercice 2.4 [Moyen] : Catégorie IMC
    **Écrire une fonction `categorie_imc` qui prend un IMC (flottant) et renvoie :**
    - `"maigreur"` si IMC &lt; 18.5
    - `"normal"` si 18.5 ≤ IMC &lt; 25
    - `"surpoids"` si 25 ≤ IMC &lt; 30
    - `"obesite"` sinon

    <Correction>
    ```python
    def categorie_imc(imc: float) -> str:
        if imc < 18.5:
            return "maigreur"
        elif imc < 25:
            return "normal"
        elif imc < 30:
            return "surpoids"
        else:
            return "obesite"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'categorie_imc' in locals(), "La fonction 'categorie_imc' n'est pas définie."
assert categorie_imc(17) == "maigreur"
assert categorie_imc(22) == "normal"
assert categorie_imc(27) == "surpoids"
assert categorie_imc(32) == "obesite"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-2-5" label="2.5 [Moyen] - Jour de la semaine">
    <Enonce>
    ### Exercice 2.5 [Moyen] : Jour de la semaine
    **Écrire une fonction `jour_semaine` qui prend un entier `n` entre 1 et 7 et renvoie le nom du jour : `1 → "lundi"`, `2 → "mardi"`, …, `7 → "dimanche"`. Si `n` est hors de cette plage, renvoyer `"invalide"`.**

    <Correction>
    ```python
    def jour_semaine(n: int) -> str:
        if n == 1:
            return "lundi"
        elif n == 2:
            return "mardi"
        elif n == 3:
            return "mercredi"
        elif n == 4:
            return "jeudi"
        elif n == 5:
            return "vendredi"
        elif n == 6:
            return "samedi"
        elif n == 7:
            return "dimanche"
        else:
            return "invalide"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'jour_semaine' in locals(), "La fonction 'jour_semaine' n'est pas définie."
assert jour_semaine(1) == "lundi"
assert jour_semaine(7) == "dimanche"
assert jour_semaine(0) == "invalide"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-2-6" label="2.6 [Moyen] - Trimestre de l'année">
    <Enonce>
    ### Exercice 2.6 [Moyen] : Trimestre de l'année
    **Écrire une fonction `trimestre` qui prend un numéro de mois (1 à 12) et renvoie `1`, `2`, `3` ou `4` selon le trimestre. Renvoyer `0` si le mois est invalide.**

    <Correction>
    ```python
    def trimestre(mois: int) -> int:
        if mois < 1 or mois > 12:
            return 0
        elif mois <= 3:
            return 1
        elif mois <= 6:
            return 2
        elif mois <= 9:
            return 3
        else:
            return 4
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'trimestre' in locals(), "La fonction 'trimestre' n'est pas définie."
assert trimestre(2) == 1
assert trimestre(5) == 2
assert trimestre(11) == 4
assert trimestre(13) == 0
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 3 : AVANCÉ (3.1 à 3.6)            */}
  {/* ========================================== */}

  <ExerciseSection id="conditions-3-1" label="3.1 [Avancé] - Mot de passe valide">
    <Enonce>
    ### Exercice 3.1 [Avancé] : Mot de passe valide
    **Écrire une fonction `mot_de_passe_valide` qui prend une chaîne `mdp` et renvoie `True` si sa longueur est au moins 8 **et** qu'elle contient au moins un chiffre (`"0"` à `"9"`), `False` sinon.**

    <Correction>
    ```python
    def mot_de_passe_valide(mdp: str) -> bool:
        if len(mdp) < 8:
            return False
        for car in mdp:
            if car.isdigit():
                return True
        return False
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'mot_de_passe_valide' in locals(), "La fonction 'mot_de_passe_valide' n'est pas définie."
assert mot_de_passe_valide("abcdefgh1") is True
assert mot_de_passe_valide("abcdefgh") is False
assert mot_de_passe_valide("abc1") is False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-3-2" label="3.2 [Avancé] - Triangle rectangle">
    <Enonce>
    ### Exercice 3.2 [Avancé] : Triangle rectangle
    **Écrire une fonction `est_triangle_rectangle` qui prend trois longueurs `a`, `b`, `c` (flottants positifs) et renvoie `True` si elles forment un triangle rectangle (théorème de Pythagore : $a^2 + b^2 = c^2$ en testant les trois combinaisons), `False` sinon.**

    <Correction>
    ```python
    def est_triangle_rectangle(a: float, b: float, c: float) -> bool:
        cotes = sorted([a, b, c])
        petit1, petit2, hypotenuse = cotes
        return abs(petit1 ** 2 + petit2 ** 2 - hypotenuse ** 2) < 0.0001
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'est_triangle_rectangle' in locals(), "La fonction 'est_triangle_rectangle' n'est pas définie."
assert est_triangle_rectangle(3, 4, 5) is True
assert est_triangle_rectangle(3, 4, 6) is False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-3-3" label="3.3 [Avancé] - Année bissextile">
    <Enonce>
    ### Exercice 3.3 [Avancé] : Année bissextile
    **Écrire une fonction `est_bissextile` qui prend une année et renvoie `True` si elle est bissextile : divisible par 400, ou divisible par 4 mais pas par 100.**

    <Correction>
    ```python
    def est_bissextile(annee: int) -> bool:
        if annee % 400 == 0:
            return True
        elif annee % 100 == 0:
            return False
        elif annee % 4 == 0:
            return True
        else:
            return False
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'est_bissextile' in locals(), "La fonction 'est_bissextile' n'est pas définie."
assert est_bissextile(2024) is True
assert est_bissextile(2100) is False
assert est_bissextile(2000) is True
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-3-4" label="3.4 [Avancé] - Accès au serveur">
    <Enonce>
    ### Exercice 3.4 [Avancé] : Accès au serveur
    **Écrire une fonction `acces_autorise` qui prend un nom d'utilisateur (`str`) et un mot de passe (`str`). Renvoie `True` uniquement si l'utilisateur est `"admin"` **et** le mot de passe est `"nsi2026"`, sinon `False`.**

    <Correction>
    ```python
    def acces_autorise(utilisateur: str, mot_de_passe: str) -> bool:
        if utilisateur == "admin" and mot_de_passe == "nsi2026":
            return True
        else:
            return False
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'acces_autorise' in locals(), "La fonction 'acces_autorise' n'est pas définie."
assert acces_autorise("admin", "nsi2026") is True
assert acces_autorise("admin", "wrong") is False
assert acces_autorise("eleve", "nsi2026") is False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-3-5" label="3.5 [Avancé] - Plage de température">
    <Enonce>
    ### Exercice 3.5 [Avancé] : Plage de température
    **Écrire une fonction `alerte_temperature` qui prend une température en °C et renvoie :**
    - `"critique"` si température &lt; 0 **ou** température &gt; 35
    - `"attention"` si température &lt; 5 **ou** température &gt; 30
    - `"ok"` sinon

    <Correction>
    ```python
    def alerte_temperature(temp: float) -> str:
        if temp < 0 or temp > 35:
            return "critique"
        elif temp < 5 or temp > 30:
            return "attention"
        else:
            return "ok"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'alerte_temperature' in locals(), "La fonction 'alerte_temperature' n'est pas définie."
assert alerte_temperature(-2) == "critique"
assert alerte_temperature(32) == "attention"
assert alerte_temperature(20) == "ok"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-3-6" label="3.6 [Avancé] - Type de triangle">
    <Enonce>
    ### Exercice 3.6 [Avancé] : Type de triangle
    **Écrire une fonction `type_triangle` qui prend trois côtés `a`, `b`, `c`. Si les trois côtés ne peuvent pas former un triangle (inégalité triangulaire), renvoyer `"invalide"`. Sinon renvoyer `"equilateral"`, `"isocele"` ou `"scalene"`.**

    <Correction>
    ```python
    def type_triangle(a: float, b: float, c: float) -> str:
        if a + b <= c or a + c <= b or b + c <= a:
            return "invalide"
        if a == b == c:
            return "equilateral"
        elif a == b or a == c or b == c:
            return "isocele"
        else:
            return "scalene"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'type_triangle' in locals(), "La fonction 'type_triangle' n'est pas définie."
assert type_triangle(3, 3, 3) == "equilateral"
assert type_triangle(3, 3, 5) == "isocele"
assert type_triangle(3, 4, 5) == "scalene"
assert type_triangle(1, 2, 5) == "invalide"
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 4 : DIFFICILE (4.1 à 4.4)         */}
  {/* ========================================== */}

  <ExerciseSection id="conditions-4-1" label="4.1 [Difficile] - FizzBuzz">
    <Enonce>
    ### Exercice 4.1 [Difficile] : FizzBuzz
    **Écrire une fonction `fizzbuzz` qui prend un entier `n` et renvoie :**
    - `"FizzBuzz"` si `n` est divisible par 3 **et** par 5
    - `"Fizz"` si divisible par 3 seulement
    - `"Buzz"` si divisible par 5 seulement
    - la chaîne du nombre sinon (ex. `"7"`)

    <Correction>
    ```python
    def fizzbuzz(n: int) -> str:
        if n % 3 == 0 and n % 5 == 0:
            return "FizzBuzz"
        elif n % 3 == 0:
            return "Fizz"
        elif n % 5 == 0:
            return "Buzz"
        else:
            return str(n)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'fizzbuzz' in locals(), "La fonction 'fizzbuzz' n'est pas définie."
assert fizzbuzz(15) == "FizzBuzz"
assert fizzbuzz(9) == "Fizz"
assert fizzbuzz(10) == "Buzz"
assert fizzbuzz(7) == "7"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-4-2" label="4.2 [Difficile] - Quadrant">
    <Enonce>
    ### Exercice 4.2 [Difficile] : Quadrant
    **Écrire une fonction `quadrant` qui prend les coordonnées `(x, y)` d'un point (flottants). Renvoie `0` si le point est sur un axe, sinon `1`, `2`, `3` ou `4` selon le quadrant cartésien.**

    <Correction>
    ```python
    def quadrant(x: float, y: float) -> int:
        if x == 0 or y == 0:
            return 0
        elif x > 0 and y > 0:
            return 1
        elif x < 0 and y > 0:
            return 2
        elif x < 0 and y < 0:
            return 3
        else:
            return 4
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'quadrant' in locals(), "La fonction 'quadrant' n'est pas définie."
assert quadrant(0, 5) == 0
assert quadrant(3, 4) == 1
assert quadrant(-2, 3) == 2
assert quadrant(-1, -1) == 3
assert quadrant(2, -3) == 4
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-4-3" label="4.3 [Difficile] - Validité d'une date">
    <Enonce>
    ### Exercice 4.3 [Difficile] : Validité d'une date
    **Écrire une fonction `date_valide` qui prend un jour, un mois et une année. Renvoie `True` si la date est valide, `False` sinon. On suppose 28 jours en février (sans gérer les années bissextiles).**

    <Correction>
    ```python
    def date_valide(jour: int, mois: int, annee: int) -> bool:
        if mois < 1 or mois > 12 or annee < 1:
            return False
        if mois in (1, 3, 5, 7, 8, 10, 12):
            max_jour = 31
        elif mois in (4, 6, 9, 11):
            max_jour = 30
        else:
            max_jour = 28
        return 1 <= jour <= max_jour
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'date_valide' in locals(), "La fonction 'date_valide' n'est pas définie."
assert date_valide(31, 1, 2026) is True
assert date_valide(31, 4, 2026) is False
assert date_valide(29, 2, 2026) is False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-4-4" label="4.4 [Difficile] - Pierre-feuille-ciseaux">
    <Enonce>
    ### Exercice 4.4 [Difficile] : Pierre-feuille-ciseaux
    **Écrire une fonction `pfc` qui prend les choix de deux joueurs (`"pierre"`, `"feuille"` ou `"ciseaux"`) et renvoie `1` si le joueur 1 gagne, `2` si le joueur 2 gagne, `0` en cas d'égalité. Renvoie `-1` si un choix est invalide.**

    <Correction>
    ```python
    def pfc(j1: str, j2: str) -> int:
        choix = {"pierre", "feuille", "ciseaux"}
        if j1 not in choix or j2 not in choix:
            return -1
        if j1 == j2:
            return 0
        if (j1 == "pierre" and j2 == "ciseaux") or (j1 == "feuille" and j2 == "pierre") or (j1 == "ciseaux" and j2 == "feuille"):
            return 1
        return 2
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'pfc' in locals(), "La fonction 'pfc' n'est pas définie."
assert pfc("pierre", "ciseaux") == 1
assert pfc("feuille", "pierre") == 1
assert pfc("pierre", "pierre") == 0
assert pfc("pierre", "feuille") == 2
assert pfc("dragon", "pierre") == -1
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 5 : EXPERT (5.1 à 5.3)            */}
  {/* ========================================== */}

  <ExerciseSection id="conditions-5-1" label="5.1 [Expert] - Impôt progressif">
    <Enonce>
    ### Exercice 5.1 [Expert] : Impôt progressif
    **Écrire une fonction `impot` qui calcule l'impôt sur un revenu annuel `r` (entier positif) selon les tranches :**
    - 0 % jusqu'à 10 000 €
    - 10 % de 10 001 à 25 000 €
    - 20 % au-delà de 25 000 €

    Renvoyer l'impôt total (entier, troncature par `int()`).

    <Correction>
    ```python
    def impot(revenu: int) -> int:
        if revenu <= 10000:
            return 0
        elif revenu <= 25000:
            return int((revenu - 10000) * 0.10)
        else:
            return int(1500 + (revenu - 25000) * 0.20)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'impot' in locals(), "La fonction 'impot' n'est pas définie."
assert impot(8000) == 0
assert impot(20000) == 1000
assert impot(30000) == 2500
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-5-2" label="5.2 [Expert] - Nombre premier">
    <Enonce>
    ### Exercice 5.2 [Expert] : Nombre premier
    **Écrire une fonction `est_premier` qui prend un entier `n` et renvoie `True` si `n` est premier, `False` sinon. Les nombres inférieurs ou égaux à 1 ne sont pas premiers.**

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
assert est_premier(1) is False
assert est_premier(2) is True
assert est_premier(15) is False
assert est_premier(17) is True
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-5-3" label="5.3 [Expert] - Résolution ax² + bx + c = 0">
    <Enonce>
    ### Exercice 5.3 [Expert] : Résolution ax² + bx + c = 0
    **Écrire une fonction `discriminant` qui prend `a`, `b`, `c` (flottants) et renvoie :**
    - `"degre_invalide"` si `a == 0`
    - `"deux_solutions"` si Δ &gt; 0
    - `"une_solution"` si Δ == 0
    - `"aucune_solution"` si Δ &lt; 0

    avec Δ = b² − 4ac.

    <Correction>
    ```python
    def discriminant(a: float, b: float, c: float) -> str:
        if a == 0:
            return "degre_invalide"
        delta = b ** 2 - 4 * a * c
        if delta > 0:
            return "deux_solutions"
        elif delta == 0:
            return "une_solution"
        else:
            return "aucune_solution"
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'discriminant' in locals(), "La fonction 'discriminant' n'est pas définie."
assert discriminant(0, 2, 1) == "degre_invalide"
assert discriminant(1, -3, 2) == "deux_solutions"
assert discriminant(1, -2, 1) == "une_solution"
assert discriminant(1, 0, 1) == "aucune_solution"
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
