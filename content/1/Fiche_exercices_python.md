---
title: 'Fiche d''exercices : Python'
description: 'Premiers pas avec Python : variables, input/output, et calculs simples.'
level: seconde
chapter: Programmation Python
icon: "code"
prerequisites:
  - Fiche_exercices_conditions
audience: public
---

<ExerciseTabs courseId="fiche-python" courseTitle="Fiche Python">
  <ExerciseSection id="python-1" label="Important - Consignes importantes" type="lecture">
    <Enonce>
      ### Important <Icone nom="triangle-alert" /> - Consignes importantes

      **Pour tous les exercices :**

      - Créer un fichier Python différent pour chaque exercice (ex: `exercice1.py`, `exercice2.py`, etc.)
      - Tester le code en l'exécutant
      - N'hésitez pas à modifier les valeurs pour voir comment le programme réagit
      - Recopier les programmes sur le cahier pour pouvoir les réviser plus tard
    </Enonce>
    <Verification>
```python
assert True, "Consignes lues."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-2" label="Introduction - Premier programme" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Premier programme

      **Écrire un programme qui affiche "Bonjour le monde !"**

      *Pour la vérification, stocker le texte dans une variable `message` avant de l'afficher.*

    <Correction>
    ```python
    message = "Bonjour le monde !"
    print(message)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'message' in globals(), "La variable 'message' n'est pas définie."
    assert message == "Bonjour le monde !", "Le message doit être 'Bonjour le monde !'"
    assert SORTIE.strip() == "Bonjour le monde !", "Le programme affiche Bonjour le monde !"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-3" label="Introduction - Affichage simple" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Affichage simple

      **Écrire un programme qui affiche son prénom et son âge sur deux lignes différentes.**

      *Utiliser les variables `prenom` (texte) et `age` (entier).*

    <Correction>
    ```python
    prenom = "Maya"
    age = 16
    print(prenom)
    print(age)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'prenom' in globals() and isinstance(prenom, str), "La variable prenom contient le prénom (du texte)."
    assert 'age' in globals() and isinstance(age, int), "La variable age contient l'âge (un entier)."
    lignes = [l.strip() for l in SORTIE.strip().splitlines()]
    assert len(lignes) == 2 and prenom in lignes[0] and str(age) in lignes[1], "Le prénom puis l'âge, sur deux lignes différentes."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-4" label="Introduction - Calcul simple" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Calcul simple

      **Écrire un programme qui calcule et affiche le résultat de 15 + 27.**

      *Stocker le résultat dans une variable nommée `resultat`.*

    <Correction>
    ```python
    resultat = 15 + 27
    print(resultat)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'resultat' in globals(), "La variable 'resultat' n'est pas définie."
    assert resultat == 42, "Le calcul 15 + 27 donne 42."
    assert "42" in SORTIE, "Le programme affiche 42."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-5" label="Introduction - Variables" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Variables

      **Écrire un programme qui :**

      - Crée une variable `nom` avec le nom de l'élève
      - Crée une variable `age` avec l'âge de l'élève
      - Affiche ces informations

    <Correction>
    ```python
    nom = "Martin"
    age = 16
    print(nom, age)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'nom' in globals() and isinstance(nom, str), "La variable 'nom' doit être du texte (str)."
    assert 'age' in globals() and isinstance(age, int), "La variable 'age' doit être un nombre entier (int)."
    assert nom in SORTIE and str(age) in SORTIE, "Le programme affiche le nom et l'âge."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-6" label="Introduction - Première interaction" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Première interaction

      **Écrire un programme qui demande le prénom de l'utilisateur et lui dit bonjour.**

      *Stocker la réponse de l'utilisateur dans une variable `prenom`.*

    <Correction>
    ```python
    prenom = input("Quel est ton prénom ? ")
    print("Bonjour", prenom)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["Maya"]
    assert prenom == "Maya", "prenom contient la réponse saisie."
    assert "Bonjour" in SORTIE and "Maya" in SORTIE.strip().splitlines()[-1], "Pour la saisie Maya, afficher Bonjour Maya."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-7" label="Introduction - Calcul avec variables" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Calcul avec variables

      **Écrire un programme qui :**

      - Crée deux variables `a` et `b` avec des nombres au choix
      - Calcule leur somme dans une variable `somme`
      - Affiche le résultat

      ## <Icone nom="star" /> Niveau Facile

    <Correction>
    ```python
    a = 12
    b = 30
    somme = a + b
    print(somme)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert isinstance(a, (int, float)) and isinstance(b, (int, float)), "a et b sont des nombres."
    assert somme == a + b, "somme vaut a + b."
    assert str(somme) in SORTIE, "Le programme affiche la somme."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-8" label="Facile - Addition de deux nombres" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Addition de deux nombres

      **Écrire un programme qui demande deux nombres à l'utilisateur et affiche leur somme.**

      *Utiliser les variables `a`, `b` et `somme`.*
      *Ne pas oublier de convertir les entrées en nombres avec `int()` ou `float()`*

    <Correction>
    ```python
    a = int(input("Premier nombre : "))
    b = int(input("Deuxième nombre : "))
    somme = a + b
    print(somme)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["12", "30"]
    assert a == 12 and b == 30, "Les saisies 12 et 30 sont converties en nombres dans a et b."
    assert somme == 42, "12 + 30 = 42 dans somme."
    assert "42" in SORTIE, "Le programme affiche 42."
    variables, sortie = relancer(["5", "-8"])
    assert variables["somme"] == -3, "5 + (-8) = -3."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-9" label="Facile - Calcul de périmètre" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Calcul de périmètre

      **Écrire un programme qui demande la longueur et la largeur d'un rectangle et calcule son périmètre.**

      *Utiliser les variables `longueur`, `largeur` et `perimetre`.*
      *Rappel : Périmètre = 2 × (longueur + largeur)*

    <Correction>
    ```python
    longueur = float(input("Longueur : "))
    largeur = float(input("Largeur : "))
    perimetre = 2 * (longueur + largeur)
    print(perimetre)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import re as _re
    def _nombres(texte):
        return [float(x) for x in _re.findall(r"-?\d+(?:[.,]\d+)?", texte.replace(",", "."))]
    ENTREES = ["5", "3"]
    assert longueur == 5 and largeur == 3, "Les saisies sont converties en nombres."
    assert perimetre == 16, "Rectangle 5 × 3 : périmètre 16."
    assert 16 in _nombres(SORTIE), "Le programme affiche le périmètre."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-10" label="Facile - Calcul d'aire" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Calcul d'aire

      **Écrire un programme qui demande le rayon d'un cercle et calcule son aire.**

      *Utiliser les variables `rayon` et `aire`.*
      *Rappel : Aire = π × rayon² (utiliser 3.14 pour π)*

    <Correction>
    ```python
    rayon = float(input("Rayon : "))
    aire = 3.14 * rayon ** 2
    print(aire)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import re as _re
    def _nombres(texte):
        return [float(x) for x in _re.findall(r"-?\d+(?:[.,]\d+)?", texte.replace(",", "."))]
    ENTREES = ["2"]
    assert rayon == 2, "Le rayon saisi est converti en nombre."
    assert abs(aire - 12.56) < 0.01, "Rayon 2 : aire 3.14 × 4 = 12.56."
    assert any(abs(x - 12.56) < 0.01 for x in _nombres(SORTIE)), "Le programme affiche l'aire."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-11" label="Facile - Conversion de température" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Conversion de température

      **Écrire un programme qui convertit une température de Celsius en Fahrenheit.**

      *Utiliser les variables `celsius` et `fahrenheit`.*
      *Formule : F = C × 9/5 + 32*

    <Correction>
    ```python
    celsius = float(input("Température en °C : "))
    fahrenheit = celsius * 9 / 5 + 32
    print(fahrenheit)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import re as _re
    def _nombres(texte):
        return [float(x) for x in _re.findall(r"-?\d+(?:[.,]\d+)?", texte.replace(",", "."))]
    ENTREES = ["100"]
    assert isinstance(celsius, (int, float)), "La température est un nombre."
    assert abs(fahrenheit - (celsius * 9 / 5 + 32)) < 0.01, "F = C × 9/5 + 32."
    assert any(abs(x - fahrenheit) < 0.01 for x in _nombres(SORTIE)), "Le programme affiche la température en Fahrenheit."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-12" label="Facile - Calcul de TVA" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Calcul de TVA

      **Écrire un programme qui :**

      - Demande un prix hors taxes (`prix_ht`)
      - Calcule le montant de la TVA (20%) (`montant_tva`)
      - Affiche le prix TTC (`prix_ttc`)

    <Correction>
    ```python
    prix_ht = float(input("Prix HT : "))
    montant_tva = prix_ht * 0.2
    prix_ttc = prix_ht + montant_tva
    print(prix_ttc)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import re as _re
    def _nombres(texte):
        return [float(x) for x in _re.findall(r"-?\d+(?:[.,]\d+)?", texte.replace(",", "."))]
    ENTREES = ["50"]
    assert prix_ht == 50, "Le prix HT saisi est converti en nombre."
    assert abs(montant_tva - 10) < 0.01, "TVA de 20 % sur 50 : 10."
    assert abs(prix_ttc - 60) < 0.01, "Prix TTC : 60."
    assert any(abs(x - 60) < 0.01 for x in _nombres(SORTIE)), "Le programme affiche le prix TTC."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-13" label="Facile - Manipulation de chaînes" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Manipulation de chaînes

      **Écrire un programme qui :**

      - Demande le prénom et le nom de l'utilisateur (`prenom` et `nom`)
      - Affiche son nom complet en majuscules dans une variable `nom_complet`

      *Utiliser la méthode `.upper()` pour mettre en majuscules*

      ## <Icone nom="flame" /> Niveau Intermédiaire

    <Correction>
    ```python
    prenom = input("Prénom : ")
    nom = input("Nom : ")
    nom_complet = (prenom + " " + nom).upper()
    print(nom_complet)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["Maya", "Martin"]
    assert prenom == "Maya" and nom == "Martin", "prenom et nom contiennent les saisies."
    assert nom_complet in ("MAYA MARTIN", "MAYAMARTIN", "MARTIN MAYA", "MARTINMAYA"), "nom_complet est le nom complet en majuscules."
    assert nom_complet in SORTIE, "Le programme affiche le nom complet."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-14" label="Intermédiaire - Calculatrice simple" type="python">
    <Enonce>
      ### Intermédiaire <Renards n="2" /> - Calculatrice simple

      **Écrire un programme qui demande deux nombres (`a` et `b`) et effectue les quatre opérations de base.**

      *Stocker les résultats dans : `somme`, `difference`, `produit`, `quotient`.*

    <Correction>
    ```python
    a = float(input("a : "))
    b = float(input("b : "))
    somme = a + b
    difference = a - b
    produit = a * b
    quotient = a / b
    print(somme, difference, produit, quotient)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["8", "2"]
    assert a == 8 and b == 2, "Les saisies 8 et 2 sont converties en nombres."
    assert somme == 10 and difference == 6 and produit == 16 and quotient == 4, "8 et 2 : somme 10, différence 6, produit 16, quotient 4."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-15" label="Intermédiaire - Conversion d'unités" type="python">
    <Enonce>
      ### Intermédiaire <Renards n="2" /> - Conversion d'unités

      **Écrire un programme qui convertit des mètres en centimètres, millimètres et kilomètres.**

      *Variable d'entrée : `metres`*
      *Variables de sortie : `cm`, `mm`, `km`*

    <Correction>
    ```python
    metres = float(input("Mètres : "))
    cm = metres * 100
    mm = metres * 1000
    km = metres / 1000
    print(cm, mm, km)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["2500"]
    assert metres == 2500, "La saisie est convertie en nombre."
    assert cm == 250000 and mm == 2500000 and km == 2.5, "2500 m : 250000 cm, 2500000 mm, 2.5 km."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>
