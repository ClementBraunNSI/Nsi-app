---
title: 'Exercices : Types en Python'
icon: "tag"
chapter: Introduction à Python
badgeId: types-python
meta: 'Variables, Types, Opérateurs et Conditions'
level: premiere
prerequisites:
  - python_fonctions
audience: public
groupe: types-python
groupeTitre: "Types de données en Python"
---

<ExerciseTabs courseId="types-python" courseTitle="Types en Python">
  <ExerciseSection id="types-1-1" label="1.1 - Identification des types" type="lecture">
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
    <Verification>
```python
assert True
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-1-2" label="1.2 - Table de vérité XOR" type="python">
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
    <Verification>
    ```python
    lignes = []
    for ligne in SORTIE.splitlines():
        valeurs = ligne.replace("True", "1").replace("False", "0").split()
        if len(valeurs) == 3 and all(v in ("0", "1") for v in valeurs):
            lignes.append(tuple(int(v) for v in valeurs))
    assert len(lignes) == 4, "La table doit afficher 4 lignes de trois valeurs : a, b et a xor b."
    assert set(lignes) == {(0, 0, 0), (0, 1, 1), (1, 0, 1), (1, 1, 0)}, "Le xor vaut 1 quand a et b sont différents, 0 sinon."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-1-3" label="1.3 - Somme de deux nombres" type="python">
    <Enonce>
    ### Exercice 1.3 : Somme de deux nombres
    **Écrire un programme qui affiche la somme de deux nombres entiers `x` et `y` définis au début du programme, sous la forme `La somme est 7` (pour `x = 4` et `y = 3`).**

    *Pour la vérification, stocker `x`, `y` et le résultat de la somme dans une variable `s`.*

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
    ```python
    assert 'x' in globals() and 'y' in globals(), "Les variables x et y doivent être définies."
    assert 's' in globals(), "La variable 's' n'est pas définie."
    assert s == x + y, "s doit valoir x + y."
    assert SORTIE.split() == ["La", "somme", "est", str(s)], "L'affichage doit être : La somme est " + str(x + y)
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-1-4" label="1.4 - Affichage amélioré" type="python">
    <Enonce>
    ### Exercice 1.4 : Affichage amélioré
    **Améliorer le programme précédent pour qu'il affiche `La somme de 4 et 3 est 7` (avec les valeurs de `x`, `y` et de leur somme).**

    *Pour la vérification, stocker `x`, `y` et le résultat de la somme dans une variable `s`.*

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
    ```python
    assert 'x' in globals() and 'y' in globals(), "Les variables x et y doivent être définies."
    assert 's' in globals(), "La variable 's' n'est pas définie."
    assert s == x + y, "s doit valoir x + y."
    assert SORTIE.split() == ["La", "somme", "de", str(x), "et", str(y), "est", str(s)], "L'affichage doit être : La somme de " + str(x) + " et " + str(y) + " est " + str(x + y)
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-1-5" label="1.5 - Concaténation de chaînes" type="python">
    <Enonce>
    ### Exercice 1.5 : Concaténation de chaînes
    **Écrire un programme qui instancie deux chaînes de caractères, les concatène et affiche le résultat sous la forme :**
    `'La chaîne résultante est : [résultat]'`.

    *Pour la vérification, stocker les chaînes dans `chaine_a`, `chaine_b` et le résultat concaténé dans `resultat`.*

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
    ```python
    assert 'chaine_a' in globals() and 'chaine_b' in globals(), "Les variables chaine_a et chaine_b doivent être définies."
    assert isinstance(chaine_a, str) and isinstance(chaine_b, str), "chaine_a et chaine_b doivent être des chaînes de caractères."
    assert 'resultat' in globals(), "La variable resultat n'est pas définie."
    assert resultat == chaine_a + chaine_b, "resultat doit être la concaténation chaine_a + chaine_b."
    assert "La chaîne résultante est" in SORTIE and resultat in SORTIE, "L'affichage doit être : La chaîne résultante est : " + resultat
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-1-6" label="1.6 - Étude de code et Booléens" type="lecture">
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
    <Verification>
```python
assert True
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-1-7" label="1.7 - Parité d'un nombre" type="python">
    <Enonce>
    ### Exercice 1.7 : Parité d'un nombre
    **Écrire un programme qui demande un nombre à l'utilisateur et affiche dans le terminal si ce nombre est pair ou impair.**

    *Pour la vérification, stocker le nombre saisi dans une variable `a`.*

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
    ```python
    ENTREES = ["7"]
    assert 'a' in globals(), "La variable 'a' n'est pas définie."
    assert a == 7, "a doit contenir le nombre saisi, converti en entier."
    assert SORTIE.strip().splitlines()[-1].strip().endswith("impair"), "Pour 7, le programme doit afficher impair."
    variables, sortie = relancer(["12"])
    assert sortie.strip().splitlines()[-1].strip().endswith("pair") and "impair" not in sortie, "Pour 12, le programme doit afficher pair."
    variables, sortie = relancer(["0"])
    assert "impair" not in sortie, "0 est pair."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-2-1" label="2.1 - Maximum entre trois nombres" type="python">
    <Enonce>
    ### Exercice 2.1 : Maximum entre trois nombres
    **Écrire un programme qui demande trois entiers différents avec `input` et trouve le plus grand.**
    Ce programme affiche par exemple `Le nombre 9 est plus grand que 4 et 2` pour les saisies 4, 9 et 2 : le maximum, puis les deux autres nombres dans l'ordre de saisie.

    *Pour la vérification, stocker les trois valeurs dans `val_1`, `val_2`, `val_3` et la valeur maximale trouvée dans `maximum`.*

    <Correction>
    ```python
    val_1 = int(input("Valeur 1 : "))
    val_2 = int(input("Valeur 2 : "))
    val_3 = int(input("Valeur 3 : "))
    if val_1 > val_2 and val_1 > val_3:
        maximum = val_1
        print("Le nombre", val_1, "est plus grand que", val_2, "et", val_3)
    elif val_2 > val_1 and val_2 > val_3:
        maximum = val_2
        print("Le nombre", val_2, "est plus grand que", val_1, "et", val_3)
    else:
        maximum = val_3
        print("Le nombre", val_3, "est plus grand que", val_1, "et", val_2)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["4", "9", "2"]
    assert 'maximum' in globals(), "La variable 'maximum' n'est pas définie."
    assert maximum == 9, "Pour 4, 9 et 2, le maximum est 9."
    assert "Le nombre 9 est plus grand que 4 et 2" in " ".join(SORTIE.split()), "Pour 4, 9 et 2, afficher : Le nombre 9 est plus grand que 4 et 2"
    for saisies, attendu in ([["15", "3", "8"], 15], [["1", "2", "30"], 30], [["-5", "-1", "-9"], -1]):
        variables, sortie = relancer(saisies)
        assert variables["maximum"] == attendu, "Pour " + ", ".join(saisies) + ", le maximum est " + str(attendu) + "."
        assert ("Le nombre " + str(attendu) + " est plus grand que") in " ".join(sortie.split()), "Pour " + ", ".join(saisies) + ", afficher : Le nombre " + str(attendu) + " est plus grand que …"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-2-2" label="2.2 - Calculatrice basique" type="python">
    <Enonce>
    ### Exercice 2.2 : Calculatrice basique
    **Écrire un programme qui simule une calculatrice basique.**
    Elle demandera à l'utilisateur :
    1. Deux nombres entiers `a` et `b`.
    2. Un opérateur (`+`, `-`, `*`, `/`).
    
    Les saisies se font dans cet ordre : `a`, puis `b`, puis l'opérateur.
    Le programme affiche par exemple `L'opération 6 * 7 vaut 42`.

    *Pour la vérification, stocker les valeurs dans `a`, `b`, `operateur` et le résultat dans `resultat`.*

    <Correction>
    ```python
    a = int(input("Entrez un premier nombre : "))
    b = int(input("Entrez un second nombre : "))
    operateur = input("Entrez un opérateur (+ - / *) : ")
    resultat = None
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
            print("Division par zéro impossible")
    if resultat is not None:
        print("L'opération", a, operateur, b, "vaut", resultat)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["6", "7", "*"]
    assert 'resultat' in globals(), "La variable resultat doit être définie."
    assert resultat == 42, "6 * 7 vaut 42."
    assert "L'opération 6 * 7 vaut 42" in " ".join(SORTIE.split()), "Afficher : L'opération 6 * 7 vaut 42"
    for saisies, attendu in ([["9", "4", "+"], 13], [["9", "4", "-"], 5], [["9", "4", "/"], 2.25]):
        variables, sortie = relancer(saisies)
        assert variables["resultat"] == attendu, saisies[0] + " " + saisies[2] + " " + saisies[1] + " vaut " + str(attendu) + "."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-2-3" label="2.3 - Profit ou perte" type="python">
    <Enonce>
    ### Exercice 2.3 : Profit ou perte
    **Écrire un programme qui demande d'abord le coût de production, puis le prix de vente (deux entiers saisis avec `input`), et affiche dans le terminal :**
    - `profit` si le prix de vente est supérieur au coût.
    - `perte` si le prix de vente est inférieur.
    - `pas de marge` si c'est égal.

    *Pour la vérification, stocker les prix dans `cout_de_production` et `prix_de_vente`, et le message affiché dans `message`.*

    <Correction>
    ```python
    cout_de_production = int(input("Entrez un coût de production : "))
    prix_de_vente = int(input("Entrez un prix de vente : "))
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
    ```python
    ENTREES = ["10", "15"]
    assert cout_de_production == 10 and prix_de_vente == 15, "Saisir d'abord le coût de production, puis le prix de vente, convertis en entiers."
    assert message == "profit", "Coût 10 et prix 15 : profit."
    assert SORTIE.strip().splitlines()[-1].strip().endswith("profit"), "Le programme doit afficher profit."
    variables, sortie = relancer(["15", "10"])
    assert variables["message"] == "perte", "Coût 15 et prix 10 : perte."
    variables, sortie = relancer(["12", "12"])
    assert variables["message"] == "pas de marge", "Coût et prix égaux : pas de marge."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="types-3-1" label="3.1 - Mentions au baccalauréat" type="python">
    <Enonce>
    ### Exercice 3.1 : Mentions au baccalauréat
    **Écrire un programme qui demande une note sur 20 (un nombre décimal, saisi avec `input`) et affiche dans le terminal la mention correspondante :**
    - `Très bien` : note ≥ 16
    - `Bien` : 14 ≤ note < 16
    - `Assez bien` : 12 ≤ note < 14
    - `Passable` : 10 ≤ note < 12
    - `Échec` : note < 10

    *Pour la vérification, stocker la note dans `note` et la mention dans `mention`.*

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
    ```python
    ENTREES = ["17"]
    assert note == 17, "La note saisie doit être convertie en nombre."
    assert mention == "Très bien", "17 : Très bien."
    assert "Très bien" in SORTIE, "Le programme doit afficher la mention."
    for saisie, attendu in (("16", "Très bien"), ("15.5", "Bien"), ("14", "Bien"), ("12", "Assez bien"), ("11.5", "Passable"), ("10", "Passable"), ("9.5", "Échec")):
        variables, sortie = relancer([saisie])
        assert variables["mention"] == attendu, saisie + " : " + attendu + "."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>
