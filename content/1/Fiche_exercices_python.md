---
title: "Fiche d'exercices : Python"
description: "Premiers pas avec Python : variables, input/output, et calculs simples."
level: "2"
chapter: "IV - Programmation Python"
icon: "🐍"
---

<ExerciseTabs courseId="fiche-python" courseTitle="Fiche Python">
  <ExerciseSection id="python-1" label="Important ⚠️ - Consignes importantes">
    <Enonce>
### Important ⚠️ - Consignes importantes

**Pour tous les exercices :**

- Créez un fichier Python différent pour chaque exercice (ex: `exercice1.py`, `exercice2.py`, etc.)
- Testez votre code en l'exécutant
- N'hésitez pas à modifier les valeurs pour voir comment le programme réagit
- Recopiez vos programmes sur votre cahier pour pouvoir les réviser plus tard
    </Enonce>
    <Verification>
assert True, "Consignes lues."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-2" label="Introduction 🦊 - Premier programme">
    <Enonce>
### Introduction 🦊 - Premier programme

**Écrire un programme qui affiche "Bonjour le monde !"**

*Pour la vérification, stockez le texte dans une variable `message` avant de l'afficher.*
    </Enonce>
    <Verification>
assert 'message' in locals(), "La variable 'message' n'est pas définie."
assert message == "Bonjour le monde !", "Le message doit être 'Bonjour le monde !'"
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-3" label="Introduction 🦊 - Affichage simple">
    <Enonce>
### Introduction 🦊 - Affichage simple

**Écrire un programme qui affiche votre prénom et votre âge sur deux lignes différentes.**

*Utilisez les variables `prenom` (texte) et `age` (entier).*
    </Enonce>
    <Verification>
assert 'prenom' in locals(), "La variable 'prenom' n'est pas définie."
assert 'age' in locals(), "La variable 'age' n'est pas définie."
assert isinstance(prenom, str), "Le prénom doit être du texte."
assert isinstance(age, int), "L'âge doit être un nombre entier."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-4" label="Introduction 🦊 - Calcul simple">
    <Enonce>
### Introduction 🦊 - Calcul simple

**Écrire un programme qui calcule et affiche le résultat de 15 + 27.**

*Stockez le résultat dans une variable nommée `resultat`.*
    </Enonce>
    <Verification>
assert 'resultat' in locals(), "La variable 'resultat' n'est pas définie."
assert resultat == 42, "Le calcul 15 + 27 devrait donner 42."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-5" label="Introduction 🦊 - Variables">
    <Enonce>
### Introduction 🦊 - Variables

**Écrire un programme qui :**

- Crée une variable `nom` avec votre nom
- Crée une variable `age` avec votre âge
- Affiche ces informations
    </Enonce>
    <Verification>
assert 'nom' in locals(), "La variable 'nom' n'est pas définie."
assert 'age' in locals(), "La variable 'age' n'est pas définie."
assert isinstance(nom, str), "La variable 'nom' doit être du texte (str)."
assert isinstance(age, int), "La variable 'age' doit être un nombre entier (int)."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-6" label="Introduction 🦊 - Première interaction">
    <Enonce>
### Introduction 🦊 - Première interaction

**Écrire un programme qui demande le prénom de l'utilisateur et lui dit bonjour.**

*Stockez la réponse de l'utilisateur dans une variable `prenom`.*
    </Enonce>
    <Verification>
assert 'prenom' in locals(), "La variable 'prenom' n'est pas définie."
assert isinstance(prenom, str), "La variable 'prenom' doit être du texte."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-7" label="Introduction 🦊 - Calcul avec variables">
    <Enonce>
### Introduction 🦊 - Calcul avec variables

**Écrire un programme qui :**

- Crée deux variables `a` et `b` avec des nombres de votre choix
- Calcule leur somme dans une variable `somme`
- Affiche le résultat

## 🌟 Niveau Facile
    </Enonce>
    <Verification>
assert 'a' in locals(), "La variable 'a' n'est pas définie."
assert 'b' in locals(), "La variable 'b' n'est pas définie."
assert 'somme' in locals(), "La variable 'somme' n'est pas définie."
assert isinstance(a, (int, float)), "La variable 'a' doit être un nombre."
assert isinstance(b, (int, float)), "La variable 'b' doit être un nombre."
assert somme == a + b, "Le calcul de la somme est incorrect."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-8" label="Facile 🦊 - Addition de deux nombres">
    <Enonce>
### Facile 🦊 - Addition de deux nombres

**Écrire un programme qui demande deux nombres à l'utilisateur et affiche leur somme.**

*Utilisez les variables `a`, `b` et `somme`.*
*N'oubliez pas de convertir les entrées en nombres avec `int()` ou `float()`*
    </Enonce>
    <Verification>
assert 'a' in locals(), "La variable 'a' n'est pas définie."
assert 'b' in locals(), "La variable 'b' n'est pas définie."
assert 'somme' in locals(), "La variable 'somme' n'est pas définie."
assert isinstance(a, (int, float)), "La variable 'a' doit être un nombre."
assert isinstance(b, (int, float)), "La variable 'b' doit être un nombre."
assert somme == a + b, "Le calcul de la somme est incorrect."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-9" label="Facile 🦊 - Calcul de périmètre">
    <Enonce>
### Facile 🦊 - Calcul de périmètre

**Écrire un programme qui demande la longueur et la largeur d'un rectangle et calcule son périmètre.**

*Utilisez les variables `longueur`, `largeur` et `perimetre`.*
*Rappel : Périmètre = 2 × (longueur + largeur)*
    </Enonce>
    <Verification>
assert 'longueur' in locals(), "La variable 'longueur' n'est pas définie."
assert 'largeur' in locals(), "La variable 'largeur' n'est pas définie."
assert 'perimetre' in locals(), "La variable 'perimetre' n'est pas définie."
assert isinstance(longueur, (int, float)), "La longueur doit être un nombre."
assert isinstance(largeur, (int, float)), "La largeur doit être un nombre."
assert perimetre == 2 * (longueur + largeur), "Le calcul du périmètre est incorrect."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-10" label="Facile 🦊 - Calcul d'aire">
    <Enonce>
### Facile 🦊 - Calcul d'aire

**Écrire un programme qui demande le rayon d'un cercle et calcule son aire.**

*Utilisez les variables `rayon` et `aire`.*
*Rappel : Aire = π × rayon² (utilisez 3.14 pour π)*
    </Enonce>
    <Verification>
assert 'rayon' in locals(), "La variable 'rayon' n'est pas définie."
assert 'aire' in locals(), "La variable 'aire' n'est pas définie."
assert isinstance(rayon, (int, float)), "Le rayon doit être un nombre."
assert abs(aire - (3.14 * rayon ** 2)) < 0.01, "Le calcul de l'aire est incorrect."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-11" label="Facile 🦊 - Conversion de température">
    <Enonce>
### Facile 🦊 - Conversion de température

**Écrire un programme qui convertit une température de Celsius en Fahrenheit.**

*Utilisez les variables `celsius` et `fahrenheit`.*
*Formule : F = C × 9/5 + 32*
    </Enonce>
    <Verification>
assert 'celsius' in locals(), "La variable 'celsius' n'est pas définie."
assert 'fahrenheit' in locals(), "La variable 'fahrenheit' n'est pas définie."
assert isinstance(celsius, (int, float)), "La température doit être un nombre."
assert abs(fahrenheit - (celsius * 9/5 + 32)) < 0.01, "Le calcul de la conversion est incorrect."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-12" label="Facile 🦊 - Calcul de TVA">
    <Enonce>
### Facile 🦊 - Calcul de TVA

**Écrire un programme qui :**

- Demande un prix hors taxes (`prix_ht`)
- Calcule le montant de la TVA (20%) (`montant_tva`)
- Affiche le prix TTC (`prix_ttc`)
    </Enonce>
    <Verification>
assert 'prix_ht' in locals(), "La variable 'prix_ht' n'est pas définie."
assert 'montant_tva' in locals(), "La variable 'montant_tva' n'est pas définie."
assert 'prix_ttc' in locals(), "La variable 'prix_ttc' n'est pas définie."
assert isinstance(prix_ht, (int, float)), "Le prix HT doit être un nombre."
assert abs(montant_tva - (prix_ht * 0.2)) < 0.01, "Le calcul de la TVA est incorrect."
assert abs(prix_ttc - (prix_ht + montant_tva)) < 0.01, "Le calcul du prix TTC est incorrect."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-13" label="Facile 🦊 - Manipulation de chaînes">
    <Enonce>
### Facile 🦊 - Manipulation de chaînes

**Écrire un programme qui :**

- Demande le prénom et le nom de l'utilisateur (`prenom` et `nom`)
- Affiche son nom complet en majuscules dans une variable `nom_complet`

*Utilisez la méthode `.upper()` pour mettre en majuscules*

## 🔥 Niveau Intermédiaire
    </Enonce>
    <Verification>
assert 'prenom' in locals(), "La variable 'prenom' n'est pas définie."
assert 'nom' in locals(), "La variable 'nom' n'est pas définie."
assert 'nom_complet' in locals(), "La variable 'nom_complet' n'est pas définie."
assert nom_complet == (prenom + " " + nom).upper() or nom_complet == (prenom + nom).upper() or nom_complet == (nom + " " + prenom).upper() or nom_complet == (nom + prenom).upper(), "Le nom complet n'est pas correctement formé ou mis en majuscules."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-14" label="Intermédiaire 🦊🦊 - Calculatrice simple">
    <Enonce>
### Intermédiaire 🦊🦊 - Calculatrice simple

**Écrire un programme qui demande deux nombres (`a` et `b`) et effectue les quatre opérations de base.**

*Stockez les résultats dans : `somme`, `difference`, `produit`, `quotient`.*
    </Enonce>
    <Verification>
assert 'a' in locals(), "La variable 'a' n'est pas définie."
assert 'b' in locals(), "La variable 'b' n'est pas définie."
assert 'somme' in locals(), "La variable 'somme' n'est pas définie."
assert 'difference' in locals(), "La variable 'difference' n'est pas définie."
assert 'produit' in locals(), "La variable 'produit' n'est pas définie."
assert 'quotient' in locals(), "La variable 'quotient' n'est pas définie."
assert somme == a + b, "Erreur dans la somme."
assert difference == a - b, "Erreur dans la différence."
assert produit == a * b, "Erreur dans le produit."
assert quotient == a / b, "Erreur dans le quotient."
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="python-15" label="Intermédiaire 🦊🦊 - Conversion d'unités">
    <Enonce>
### Intermédiaire 🦊🦊 - Conversion d'unités

**Écrire un programme qui convertit des mètres en centimètres, millimètres et kilomètres.**

*Variable d'entrée : `metres`*
*Variables de sortie : `cm`, `mm`, `km`*
    </Enonce>
    <Verification>
assert 'metres' in locals(), "La variable 'metres' n'est pas définie."
assert 'cm' in locals(), "La variable 'cm' n'est pas définie."
assert 'mm' in locals(), "La variable 'mm' n'est pas définie."
assert 'km' in locals(), "La variable 'km' n'est pas définie."
assert cm == metres * 100, "Erreur conversion cm."
assert mm == metres * 1000, "Erreur conversion mm."
assert km == metres / 1000, "Erreur conversion km."
    </Verification>
  </ExerciseSection>
</ExerciseTabs>
