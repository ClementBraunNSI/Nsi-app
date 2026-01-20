---
title: "Exercices : Types en Python"
chapter: "Introduction à Python"
meta: "Variables, Types, Opérateurs et Conditions"
---

<ExerciseTabs>
  <ExerciseSection id="intro" label="1. Introduction">
    ## Premiers pas avec les types

    ### Exercice 1.1 : Identification des types
    **Donner les types des valeurs suivantes :**
    `13`, `14.5`, `'Hello World!'`, `True`, `'15.5'`

    <Correction>
    ```python
    print(type(13))             # <class 'int'>
    print(type(14.5))           # <class 'float'>
    print(type('Hello World!')) # <class 'str'>
    print(type(True))           # <class 'bool'>
    print(type('15.5'))         # <class 'str'> (Attention, c'est entre guillemets)
    ```
    </Correction>

    ### Exercice 1.2 : Table de vérité XOR
    **À l'aide de Python, écrire un programme qui affiche dans le terminal la table de vérité de la fonction booléenne `xor` (ou exclusif).**

    <Correction>
    ```python
    print('Table de vérité du XOR')
    print('a', 'b', 's')
    print(0, 0, 0)
    print(0, 1, 1)
    print(1, 0, 1)
    print(1, 1, 0)
    ```
    </Correction>

    ### Exercice 1.3 : Somme de deux nombres
    **Écrire un programme qui permet d'afficher la somme de deux nombres entiers de la forme `'La somme est x+y'` avec x et y définis précédemment.**

    <Correction>
    ```python
    x = 4
    y = 3
    print('La somme est', x + y)
    ```
    </Correction>

    ### Exercice 1.4 : Affichage amélioré
    **Améliorer le programme précédent pour qu'il affiche `'La somme de x et y est x+y'`.**

    <Correction>
    ```python
    x = 4
    y = 3
    print('La somme de', x, 'et', y, 'est', x + y)
    ```
    </Correction>

    ### Exercice 1.5 : Concaténation de chaînes
    **Écrire un programme qui instancie deux chaînes de caractères, les concatène et affiche le résultat sous la forme :**
    `'La chaîne résultante est : [résultat]'`.

    <Correction>
    ```python
    chaine_a = "Bonjour"
    chaine_b = "Au Revoir"
    print("La chaîne résultante est :", chaine_a + chaine_b)
    ```
    </Correction>

    ### Exercice 1.6 : Étude de code et Booléens
    **Partie A : Évaluer les valeurs de `result` à la fin de chaque programme :**

    *Programme 1 :*
    ```python
    x = 8
    y = 6
    if x > y:
        result = x - y
    else:
        result = y - x
    ```

    *Programme 2 :*
    ```python
    a = 4
    b = 9
    if a < b:
        result = a + b
    else:
        result = a * b
    ```

    *Programme 3 :*
    ```python
    m = 7
    n = 3
    if m % 2 == 0:
        result = m * n
    else:
        result = m + n
    ```

    **Partie B : À l'aide de Python, évaluer les résultats de ces comparaisons avec `x = 5`, `x = 10` et `x = -20` :**
    1. `x < 20 and x > -20`
    2. `x > 5 or x < 3`
    3. `not (x == 10)`
    4. `x >= 0 and x <= 10`
    5. `x % 2 == 0 or x % 3 == 0`
    6. `x < 0 or (x > 0 and x % 2 != 0)`

    <Correction>
    **Partie A :**
    1. Programme 1 : `result = 2` (car 8 > 6)
    2. Programme 2 : `result = 13` (car 4 < 9)
    3. Programme 3 : `result = 10` (car 7 n'est pas pair, on fait 7+3)

    **Partie B (Code de vérification) :**
    ```python
    for x in [5, 10, -20]:
        print(f"--- Pour x = {x} ---")
        print("1.", x < 20 and x > -20)
        print("2.", x > 5 or x < 3)
        print("3.", not (x == 10))
        print("4.", x >= 0 and x <= 10)
        print("5.", x % 2 == 0 or x % 3 == 0)
        print("6.", x < 0 or (x > 0 and x % 2 != 0))
    ```
    </Correction>

    ### Exercice 1.7 : Parité d'un nombre
    **Écrire un programme qui demande un nombre à l'utilisateur et affiche dans le terminal si ce nombre est pair ou impair.**

    <Correction>
    ```python
    a = int(input("Entrez un nombre : "))
    if a % 2 == 0:  # Si le reste de la division de a par 2 est 0
        print("pair")
    else:
        print("impair")
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="facile" label="2. Facile">
    ## Conditions et comparaisons

    ### Exercice 2.1 : Maximum entre trois nombres
    **Écrire un programme qui permet de trouver la valeur maximale entre trois variables entières saisies.**
    Ce programme affichera dans la console : *"Le nombre [x] est plus grand que [y] et [z]"*.

    <Correction>
    
    ```python
    val_1 = int(input("Valeur 1 : "))
    val_2 = int(input("Valeur 2 : "))
    val_3 = int(input("Valeur 3 : "))

    if val_1 > val_2 and val_1 > val_3:
        print(val_1, " est la plus grande")
    elif val_2 > val_1 and val_2 > val_3:
        print(val_2, " est la plus grande")
    elif val_3 > val_1 and val_3 > val_2:
        print(val_3, " est la plus grande")
    ```
    </Correction>

    ### Exercice 2.2 : Calculatrice basique
    **Écrire un programme qui simule une calculatrice basique.**
    Elle demandera à l'utilisateur :
    1. Deux nombres entiers `a` et `b`.
    2. Un opérateur (`+`, `-`, `*`, `/`).
    
    Le programme affichera : *L'opération a [opérateur] b vaut ...*

    <Correction>
    
    ```python
    a = int(input("Entrez un premier nombre : "))
    b = int(input("Entrez un second nombre : "))
    operateur = input("Entrez un opérateur (+ - / *) : ")

    if operateur == "+":
        print(a + b)
    elif operateur == "-":
        print(a - b)
    elif operateur == "*":
        print(a * b)
    elif operateur == "/":
        if b != 0:
            print(a / b)
        else:
            print("Division par zéro impossible")
    ```
    </Correction>

    ### Exercice 2.3 : Profit ou perte
    **Écrire un programme qui, étant donné deux valeurs `cout_de_production` et `prix_de_vente` (saisies par l'utilisateur), affiche dans le terminal :**
    - `profit` si le prix de vente est supérieur au coût.
    - `perte` si le prix de vente est inférieur.
    - `pas de marge` si c'est égal.

    <Correction>
    
    ```python
    prix_de_vente = int(input("Entrez un prix de vente : "))
    cout_de_production = int(input("Entrez un coût de production : "))

    if prix_de_vente > cout_de_production:
        print("profit")
    elif prix_de_vente == cout_de_production:
        print("pas de marge")
    else:
        print("perte")
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="moyen" label="3. Intermédiaire">
    ## Algorithmes complets

    ### Exercice 3.1 : Mentions au baccalauréat
    **Écrire un programme qui prend une note sur 20 et affiche dans le terminal la mention correspondante :**
    - `Très bien` : note ≥ 16
    - `Bien` : 14 ≤ note < 16
    - `Assez bien` : 12 ≤ note < 14
    - `Passable` : 10 ≤ note < 12
    - `Échec` : note < 10

    <Correction>
    
    ```python
    note = float(input("Entrez une note sur 20 : "))

    if note >= 16:
        print("Mention : Très bien")
    elif 14 <= note < 16: # On peut aussi écrire: note >= 14 and note < 16
        print("Mention : Bien")
    elif 12 <= note < 14:
        print("Mention : Assez bien")
    elif 10 <= note < 12:
        print("Mention : Passable")
    else:
        print("Mention : Échec")
    ```
    </Correction>
  </ExerciseSection>
</ExerciseTabs>