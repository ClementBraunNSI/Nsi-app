---
title: "Exercices : Types en Python"
chapter: "Introduction à Python"
badgeId: "types-python"
meta: "Variables, Types, Opérateurs et Conditions"
---

<ExerciseTabs courseId="types-python" courseTitle="Types en Python">
  <ExerciseSection id="types-1-1" label="1.1 - Identification des types">
    <Enonce>
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
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="types-1-2" label="1.2 - Table de vérité XOR">
    <Enonce>
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
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="types-1-3" label="1.3 - Somme de deux nombres">
    <Enonce>
    ### Exercice 1.3 : Somme de deux nombres
    **Écrire un programme qui permet d'afficher la somme de deux nombres entiers de la forme `'La somme est x+y'` avec x et y définis précédemment.**

    *Pour la vérification, stockez `x`, `y` et le résultat de la somme dans une variable `s`.*

    <Correction>
    ```python
    x = 4
    y = 3
    s = x + y
    print('La somme est', s)
    ```
    </Correction>
    </Enonce>
    <Verification>
assert 'x' in locals() and 'y' in locals(), "Les variables x et y doivent être définies."
assert 's' in locals(), "La variable 's' n'est pas définie."
assert s == x + y, "La somme est incorrecte."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-1-4" label="1.4 - Affichage amélioré">
    <Enonce>
    ### Exercice 1.4 : Affichage amélioré
    **Améliorer le programme précédent pour qu'il affiche `'La somme de x et y est x+y'`.**

    *Pour la vérification, stockez `x`, `y` et le résultat de la somme dans une variable `s`.*

    <Correction>
    ```python
    x = 4
    y = 3
    s = x + y
    print('La somme de', x, 'et', y, 'est', s)
    ```
    </Correction>
    </Enonce>
    <Verification>
assert 'x' in locals() and 'y' in locals(), "Les variables x et y doivent être définies."
assert 's' in locals(), "La variable 's' n'est pas définie."
assert s == x + y, "La somme est incorrecte."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-1-5" label="1.5 - Concaténation de chaînes">
    <Enonce>
    ### Exercice 1.5 : Concaténation de chaînes
    **Écrire un programme qui instancie deux chaînes de caractères, les concatène et affiche le résultat sous la forme :**
    `'La chaîne résultante est : [résultat]'`.

    *Pour la vérification, stockez les chaînes dans `chaine_a`, `chaine_b` et le résultat concaténé dans `resultat`.*

    <Correction>
    ```python
    chaine_a = "Bonjour"
    chaine_b = "Au Revoir"
    resultat = chaine_a + chaine_b
    print("La chaîne résultante est :", resultat)
    ```
    </Correction>
    </Enonce>
    <Verification>
assert 'chaine_a' in locals() and 'chaine_b' in locals(), "Les variables chaine_a et chaine_b doivent être définies."
assert 'resultat' in locals(), "La variable resultat n'est pas définie."
assert resultat == chaine_a + chaine_b, "La concaténation est incorrecte."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-1-6" label="1.6 - Étude de code et Booléens">
    <Enonce>
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
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="types-1-7" label="1.7 - Parité d'un nombre">
    <Enonce>
    ### Exercice 1.7 : Parité d'un nombre
    **Écrire un programme qui demande un nombre à l'utilisateur et affiche dans le terminal si ce nombre est pair ou impair.**

    *Pour la vérification, stockez le nombre saisi dans une variable `a`.*

    <Correction>
    ```python
    a = int(input("Entrez un nombre : "))
    if a % 2 == 0:  # Si le reste de la division de a par 2 est 0
        print("pair")
    else:
        print("impair")
    ```
    </Correction>
    </Enonce>
    <Verification>
assert 'a' in locals(), "La variable 'a' n'est pas définie."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-2-1" label="2.1 - Maximum entre trois nombres">
    <Enonce>
    ### Exercice 2.1 : Maximum entre trois nombres
    **Écrire un programme qui permet de trouver la valeur maximale entre trois variables entières saisies.**
    Ce programme affichera dans la console : *"Le nombre [x] est plus grand que [y] et [z]"*.

    *Pour la vérification, stockez les trois valeurs dans `val_1`, `val_2`, `val_3` et la valeur maximale trouvée dans `maximum`.*

    <Correction>
    
    ```python
    val_1 = int(input("Valeur 1 : "))
    val_2 = int(input("Valeur 2 : "))
    val_3 = int(input("Valeur 3 : "))

    if val_1 > val_2 and val_1 > val_3:
        maximum = val_1
        print(val_1, " est la plus grande")
    elif val_2 > val_1 and val_2 > val_3:
        maximum = val_2
        print(val_2, " est la plus grande")
    elif val_3 > val_1 and val_3 > val_2:
        maximum = val_3
        print(val_3, " est la plus grande")
    ```
    </Correction>
    </Enonce>
    <Verification>
assert 'val_1' in locals() and 'val_2' in locals() and 'val_3' in locals(), "Les variables val_1, val_2, val_3 doivent être définies."
assert 'maximum' in locals(), "La variable 'maximum' n'est pas définie."
assert maximum == max(val_1, val_2, val_3), "Le maximum calculé est incorrect."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-2-2" label="2.2 - Calculatrice basique">
    <Enonce>
    ### Exercice 2.2 : Calculatrice basique
    **Écrire un programme qui simule une calculatrice basique.**
    Elle demandera à l'utilisateur :
    1. Deux nombres entiers `a` et `b`.
    2. Un opérateur (`+`, `-`, `*`, `/`).
    
    Le programme affichera : *L'opération a [opérateur] b vaut ...*

    *Pour la vérification, stockez les valeurs dans `a`, `b`, `operateur` et le résultat dans `resultat`.*

    <Correction>
    
    ```python
    a = int(input("Entrez un premier nombre : "))
    b = int(input("Entrez un second nombre : "))
    operateur = input("Entrez un opérateur (+ - / *) : ")

    if operateur == "+":
        resultat = a + b
    elif operateur == "-":
        resultat = a - b
    elif operateur == "*":
        resultat = a * b
    elif operateur == "/":
        if b != 0:
            resultat = a / b
        else:
            resultat = None
            print("Division par zéro impossible")
    
    if resultat is not None:
        print(resultat)
    ```
    </Correction>
    </Enonce>
    <Verification>
assert 'a' in locals() and 'b' in locals(), "Les variables a et b doivent être définies."
assert 'operateur' in locals(), "La variable operateur doit être définie."
assert 'resultat' in locals(), "La variable resultat doit être définie."
if operateur == '+': assert resultat == a + b
elif operateur == '-': assert resultat == a - b
elif operateur == '*': assert resultat == a * b
elif operateur == '/': 
    if b != 0: assert abs(resultat - (a/b)) < 0.0001
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-2-3" label="2.3 - Profit ou perte">
    <Enonce>
    ### Exercice 2.3 : Profit ou perte
    **Écrire un programme qui, étant donné deux valeurs `cout_de_production` et `prix_de_vente` (saisies par l'utilisateur), affiche dans le terminal :**
    - `profit` si le prix de vente est supérieur au coût.
    - `perte` si le prix de vente est inférieur.
    - `pas de marge` si c'est égal.

    *Pour la vérification, stockez les prix dans `cout_de_production` et `prix_de_vente`, et le message affiché dans `message`.*

    <Correction>
    
    ```python
    prix_de_vente = int(input("Entrez un prix de vente : "))
    cout_de_production = int(input("Entrez un coût de production : "))

    if prix_de_vente > cout_de_production:
        message = "profit"
    elif prix_de_vente == cout_de_production:
        message = "pas de marge"
    else:
        message = "perte"
    print(message)
    ```
    </Correction>
    </Enonce>
    <Verification>
assert 'prix_de_vente' in locals() and 'cout_de_production' in locals(), "Les variables de prix doivent être définies."
assert 'message' in locals(), "La variable message doit être définie."
if prix_de_vente > cout_de_production: assert "profit" in message
elif prix_de_vente < cout_de_production: assert "perte" in message
else: assert "marge" in message
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-3-1" label="3.1 - Mentions au baccalauréat">
    <Enonce>
    ### Exercice 3.1 : Mentions au baccalauréat
    **Écrire un programme qui prend une note sur 20 et affiche dans le terminal la mention correspondante :**
    - `Très bien` : note ≥ 16
    - `Bien` : 14 ≤ note < 16
    - `Assez bien` : 12 ≤ note < 14
    - `Passable` : 10 ≤ note < 12
    - `Échec` : note < 10

    *Pour la vérification, stockez la note dans `note` et la mention dans `mention`.*

    <Correction>
    
    ```python
    note = float(input("Entrez une note sur 20 : "))

    if note >= 16:
        mention = "Très bien"
    elif 14 <= note < 16: # On peut aussi écrire: note >= 14 and note < 16
        mention = "Bien"
    elif 12 <= note < 14:
        mention = "Assez bien"
    elif 10 <= note < 12:
        mention = "Passable"
    else:
        mention = "Échec"
    print("Mention :", mention)
    ```
    </Correction>
    </Enonce>
    <Verification>
assert 'note' in locals(), "La variable note doit être définie."
assert 'mention' in locals(), "La variable mention doit être définie."
m = mention.lower()
if note >= 16: assert "très bien" in m
elif note >= 14: assert "bien" in m and "très" not in m and "assez" not in m
elif note >= 12: assert "assez bien" in m
elif note >= 10: assert "passable" in m
else: assert "échec" in m or "echec" in m
    </Verification>
  </ExerciseSection>
</ExerciseTabs>