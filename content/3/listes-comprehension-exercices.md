---
title: Listes par compréhension - Exercices
description: >-
  Série d'exercices gradués pour maîtriser les listes par compréhension en
  Python.
level: TNSI
order: 85
chapter: Langages et Programmation
icon: "\U0001F40D"
badgeId: terminale_listes_comp
prerequisites:
  - prog_modularite_mise_au_point
---

# 🐍 Listes par compréhension

Les listes par compréhension sont un moyen concis et puissant de créer des listes en Python. Elles remplacent souvent les boucles `for` classiques pour la construction de listes.

Syntaxe de base : `[expression for element in sequence if condition]`

---

<ExerciseTabs courseId="listes-comprehension-exos" courseTitle="Maitre de la compréhension">

  <ExerciseSection id="level-1-facile" label="Niveau 1 - Facile">
    <Enonce>
    ### Exercices d'échauffement (4 exercices)

    **1. Les carrés**
    Créer une liste `carres` contenant les carrés des entiers de 0 à 10 inclus.
    *(Résultat attendu : `[0, 1, 4, 9, ..., 100]`)*

    **2. Les pairs**
    Créer une liste `pairs` contenant tous les nombres pairs entre 0 et 20 inclus.
    *(Résultat attendu : `[0, 2, 4, ..., 20]`)*

    **3. Longueurs des mots**
    Soit la liste `mots = ["chat", "chien", "oiseau", "poisson"]`.
    Créer une liste `longueurs` contenant la longueur de chaque mot.
    *(Résultat attendu : `[4, 5, 6, 7]`)*

    **4. Mots commençant par 'a'**
    Soit la liste `animaux = ["abeille", "chat", "anaconda", "chien", "aigle"]`.
    Créer une liste `commence_par_a` ne contenant que les animaux dont le nom commence par 'a'.
    *(Résultat attendu : `['abeille', 'anaconda', 'aigle']`)*

    </Enonce>
    <Verification>
    ```python
    # 1. Les carrés
    assert 'carres' in locals(), "La variable 'carres' n'est pas définie."
    assert carres == [x**2 for x in range(11)], "La liste 'carres' est incorrecte."

    # 2. Les pairs
    assert 'pairs' in locals(), "La variable 'pairs' n'est pas définie."
    assert pairs == [x for x in range(21) if x % 2 == 0], "La liste 'pairs' est incorrecte."

    # 3. Longueurs des mots
    assert 'longueurs' in locals(), "La variable 'longueurs' n'est pas définie."
    assert longueurs == [4, 5, 6, 7], "La liste 'longueurs' est incorrecte."

    # 4. Mots commençant par 'a'
    assert 'commence_par_a' in locals(), "La variable 'commence_par_a' n'est pas définie."
    assert commence_par_a == ['abeille', 'anaconda', 'aigle'], "La liste 'commence_par_a' est incorrecte."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="level-2-moyen" label="Niveau 2 - Moyen">
    <Enonce>
    ### Exercices intermédiaires (5 exercices)

    **1. Multiples de 3 mais pas de 5**
    Créer une liste contenant les nombres de 0 à 50 inclus qui sont divisibles par 3 mais **pas** par 5.

    **2. Tuples (nombre, cube)**
    Créer une liste de tuples `(x, x**3)` pour les entiers `x` de 1 à 10.

    **3. Filtrage et transformation**
    Soit `phrase = "Python est un langage puissant et rapide"`.
    Créer une liste contenant les mots de cette phrase (séparés par des espaces) qui ont plus de 4 lettres, en les mettant tous en majuscules.

    **4. Extraction de voyelles**
    Soit `texte = "Programmation"`.
    Créer une liste contenant toutes les voyelles présentes dans `texte`, dans l'ordre d'apparition.

    **5. Aplatir une matrice**
    Soit la matrice `matrice = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]`.
    Créer une liste unique `plat` contenant tous les éléments de la matrice à la suite (`[1, 2, 3, 4, ...]`).

    </Enonce>
    <Verification>
    ```python
    # 1. Multiples de 3 mais pas de 5
    assert 'resultat_1' in locals(), "La variable 'resultat_1' n'est pas définie."
    assert resultat_1 == [x for x in range(51) if x % 3 == 0 and x % 5 != 0], "La liste 'resultat_1' est incorrecte."

    # 2. Tuples (nombre, cube)
    assert 'resultat_2' in locals(), "La variable 'resultat_2' n'est pas définie."
    assert resultat_2 == [(x, x**3) for x in range(1, 11)], "La liste 'resultat_2' est incorrecte."

    # 3. Filtrage et transformation
    assert 'resultat_3' in locals(), "La variable 'resultat_3' n'est pas définie."
    phrase = "Python est un langage puissant et rapide"
    assert resultat_3 == [mot.upper() for mot in phrase.split() if len(mot) > 4], "La liste 'resultat_3' est incorrecte."

    # 4. Extraction de voyelles
    assert 'resultat_4' in locals(), "La variable 'resultat_4' n'est pas définie."
    texte = "Programmation"
    voyelles = "aeiouyAEIOUY"
    assert resultat_4 == [char for char in texte if char in voyelles], "La liste 'resultat_4' est incorrecte."

    # 5. Aplatir une matrice
    assert 'plat' in locals(), "La variable 'plat' n'est pas définie."
    matrice = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
    assert plat == [x for ligne in matrice for x in ligne], "La liste 'plat' est incorrecte."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="level-3-difficile" label="Niveau 3 - Difficile">
    <Enonce>
    ### Exercices avancés (6 exercices)

    **1. Nombres premiers**
    Créer une liste contenant tous les nombres premiers entre 2 et 50.
    *Astuce : Utiliser `all()` dans la condition.*

    **2. Jeu de cartes (Produit cartésien)**
    Soient `couleurs = ['Pique', 'Cœur', 'Carreau', 'Trèfle']` et `valeurs = ['7', '8', '9', '10', 'Valet', 'Dame', 'Roi', 'As']`.
    Créer une liste de tuples `(valeur, couleur)` représentant toutes les cartes possibles.

    **3. Transposée d'une matrice**
    Soit `matrice = [[1, 2, 3], [4, 5, 6]]` (2 lignes, 3 colonnes).
    Créer sa transposée (3 lignes, 2 colonnes) : `[[1, 4], [2, 5], [3, 6]]`.

    **4. Intersection de deux listes**
    Soient `liste_a = [1, 2, 3, 4, 5]` et `liste_b = [4, 5, 6, 7, 8]`.
    Créer une liste contenant les éléments présents dans les deux listes.

    **5. Table de multiplication**
    Générer une liste de listes représentant la table de multiplication de 1 à 5.
    `[[1, 2, 3, 4, 5], [2, 4, 6, 8, 10], ...]`

    **6. Palindromes**
    Soit `mots = ["radar", "python", "kayak", "algo", "ressasser"]`.
    Créer une liste contenant uniquement les mots qui sont des palindromes (se lisent pareil dans les deux sens).

    </Enonce>
    <Verification>
    ```python
    # 1. Nombres premiers
    assert 'premiers' in locals(), "La variable 'premiers' n'est pas définie."
    assert premiers == [x for x in range(2, 51) if all(x % d != 0 for d in range(2, int(x**0.5) + 1))], "La liste 'premiers' est incorrecte."

    # 2. Jeu de cartes
    assert 'cartes' in locals(), "La variable 'cartes' n'est pas définie."
    couleurs = ['Pique', 'Cœur', 'Carreau', 'Trèfle']
    valeurs = ['7', '8', '9', '10', 'Valet', 'Dame', 'Roi', 'As']
    assert cartes == [(v, c) for c in couleurs for v in valeurs], "La liste 'cartes' est incorrecte."

    # 3. Transposée d'une matrice
    assert 'transposee' in locals(), "La variable 'transposee' n'est pas définie."
    matrice = [[1, 2, 3], [4, 5, 6]]
    assert transposee == [[row[i] for row in matrice] for i in range(len(matrice[0]))], "La matrice 'transposee' est incorrecte."

    # 4. Intersection
    assert 'intersection' in locals(), "La variable 'intersection' n'est pas définie."
    liste_a = [1, 2, 3, 4, 5]
    liste_b = [4, 5, 6, 7, 8]
    assert intersection == [x for x in liste_a if x in liste_b], "La liste 'intersection' est incorrecte."

    # 5. Table de multiplication
    assert 'table' in locals(), "La variable 'table' n'est pas définie."
    assert table == [[i * j for j in range(1, 6)] for i in range(1, 6)], "La table de multiplication est incorrecte."

    # 6. Palindromes
    assert 'palindromes' in locals(), "La variable 'palindromes' n'est pas définie."
    mots = ["radar", "python", "kayak", "algo", "ressasser"]
    assert palindromes == [mot for mot in mots if mot == mot[::-1]], "La liste 'palindromes' est incorrecte."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
