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
  </ExerciseSection>

  <ExerciseSection id="python-2" label="Introduction 🦊 - Premier programme">
    <Enonce>
### Introduction 🦊 - Premier programme

**Écrire un programme qui affiche "Bonjour le monde !"**
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="python-3" label="Introduction 🦊 - Affichage simple">
    <Enonce>
### Introduction 🦊 - Affichage simple

**Écrire un programme qui affiche votre prénom et votre âge sur deux lignes différentes.**
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="python-4" label="Introduction 🦊 - Calcul simple">
    <Enonce>
### Introduction 🦊 - Calcul simple

**Écrire un programme qui calcule et affiche le résultat de 15 + 27.**
    </Enonce>
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

*Utilisez la fonction `input()` pour demander une information à l'utilisateur*
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="python-7" label="Introduction 🦊 - Calcul avec variables">
    <Enonce>
### Introduction 🦊 - Calcul avec variables

**Écrire un programme qui :**

- Crée deux variables avec des nombres de votre choix
- Calcule leur somme
- Affiche le résultat

## 🌟 Niveau Facile
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="python-8" label="Facile 🦊 - Addition de deux nombres">
    <Enonce>
### Facile 🦊 - Addition de deux nombres

**Écrire un programme qui demande deux nombres à l'utilisateur et affiche leur somme.**

*N'oubliez pas de convertir les entrées en nombres avec `int()` ou `float()`*
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="python-9" label="Facile 🦊 - Calcul de périmètre">
    <Enonce>
### Facile 🦊 - Calcul de périmètre

**Écrire un programme qui demande la longueur et la largeur d'un rectangle et calcule son périmètre.**

*Rappel : Périmètre = 2 × (longueur + largeur)*
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="python-10" label="Facile 🦊 - Calcul d'aire">
    <Enonce>
### Facile 🦊 - Calcul d'aire

**Écrire un programme qui demande le rayon d'un cercle et calcule son aire.**

*Rappel : Aire = π × rayon² (utilisez 3.14 pour π)*
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="python-11" label="Facile 🦊 - Conversion de température">
    <Enonce>
### Facile 🦊 - Conversion de température

**Écrire un programme qui convertit une température de Celsius en Fahrenheit.**

*Formule : F = C × 9/5 + 32*
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="python-12" label="Facile 🦊 - Calcul de TVA">
    <Enonce>
### Facile 🦊 - Calcul de TVA

**Écrire un programme qui :**

- Demande un prix hors taxes
- Calcule le montant de la TVA (20%)
- Affiche le prix TTC
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="python-13" label="Facile 🦊 - Manipulation de chaînes">
    <Enonce>
### Facile 🦊 - Manipulation de chaînes

**Écrire un programme qui :**

- Demande le prénom et le nom de l'utilisateur
- Affiche son nom complet en majuscules

*Utilisez la méthode `.upper()` pour mettre en majuscules*

## 🔥 Niveau Intermédiaire
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="python-14" label="Intermédiaire 🦊🦊 - Calculatrice simple">
    <Enonce>
### Intermédiaire 🦊🦊 - Calculatrice simple

**Écrire un programme qui demande deux nombres et effectue les quatre opérations de base (+, -, ×, ÷).**
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="python-15" label="Intermédiaire 🦊🦊 - Conversion d'unités">
    <Enonce>
### Intermédiaire 🦊🦊 - Conversion d'unités

**Écrire un programme qui convertit des mètres en centimètres, millimètres et kilomètres.**
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>
