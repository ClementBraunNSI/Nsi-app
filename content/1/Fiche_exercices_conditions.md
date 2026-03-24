---

title: "Fiche d'exercices : Les conditions en Python"
description: "Exercices sur les conditions (if/else) en Python."
level: seconde
chapter: "Programmation Python"
icon: "❓"
---

<ExerciseTabs courseId="fiche-conditions" courseTitle="Fiche Conditions">
  <ExerciseSection id="conditions-1" label="Important ⚠️ - Consignes importantes">
    <Enonce>
      ### Important ⚠️ - Consignes importantes

      **Pour tous les exercices :**

      - N'oubliez pas les deux points `:` après la condition
      - Faites attention à l'indentation dans les blocs if/else
      - Testez votre code avec différentes valeurs
      - Créez un fichier Python différent pour chaque exercice (ex: `exercice1.py`, `exercice2.py`, etc.)
      - Recopiez vos programmes sur votre cahier pour pouvoir les réviser plus tard
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="conditions-2" label="Introduction 🦊 - Majorité">
    <Enonce>
      ### Introduction 🦊 - Majorité

      **Écrire un programme qui :**

      - Demande l'âge d'une personne
      - Affiche "Vous êtes majeur" si l'âge est supérieur ou égal à 18
      - Affiche "Vous êtes mineur" sinon

      *Pour la vérification, stockez l'âge saisi dans une variable `age` et le message affiché dans une variable `message`.*
    </Enonce>
    <Verification>
```python
assert 'age' in locals(), "La variable 'age' n'est pas définie."
assert 'message' in locals(), "La variable 'message' n'est pas définie."
if age >= 18:
    assert "majeur" in message.lower(), f"Pour age={age}, le message doit contenir 'majeur'."
else:
    assert "mineur" in message.lower(), f"Pour age={age}, le message doit contenir 'mineur'."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-3" label="Introduction 🦊 - Nombre positif ou négatif">
    <Enonce>
      ### Introduction 🦊 - Nombre positif ou négatif

      **Écrire un programme qui :**

      - Demande un nombre
      - Affiche si le nombre est positif, négatif ou nul

      *Pour la vérification, stockez le nombre dans `n` et le message affiché dans `message`.*
    </Enonce>
    <Verification>
```python
assert 'n' in locals(), "La variable 'n' n'est pas définie."
assert 'message' in locals(), "La variable 'message' n'est pas définie."
if n > 0:
    assert "positif" in message.lower(), f"Pour n={n}, le message doit indiquer positif."
elif n < 0:
    assert "négatif" in message.lower(), f"Pour n={n}, le message doit indiquer négatif."
else:
    assert "nul" in message.lower(), f"Pour n={n}, le message doit indiquer nul."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-4" label="Introduction 🦊 - Comparaison de deux nombres">
    <Enonce>
      ### Introduction 🦊 - Comparaison de deux nombres

      **Écrire un programme qui :**

      - Demande deux nombres
      - Affiche lequel est le plus grand (ou s'ils sont égaux)

      *Pour la vérification, stockez les deux nombres dans `a` et `b`, et stockez la valeur la plus grande dans une variable `maximum` (ou `a` ou `b` si égaux).*
    </Enonce>
    <Verification>
```python
assert 'a' in locals() and 'b' in locals(), "Les variables 'a' et 'b' doivent être définies."
assert 'maximum' in locals(), "La variable 'maximum' n'est pas définie."
assert maximum == max(a, b), f"Le maximum entre {a} et {b} devrait être {max(a, b)}."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-5" label="Introduction 🦊 - Mot de passe">
    <Enonce>
      ### Introduction 🦊 - Mot de passe

      **Écrire un programme qui :**

      - Demande un mot de passe
      - Affiche "Accès autorisé" si le mot de passe est "secret123"
      - Affiche "Accès refusé" sinon

      *Pour la vérification, stockez le mot de passe entré dans `mdp` et le message final dans `message`.*
    </Enonce>
    <Verification>
```python
assert 'mdp' in locals(), "La variable 'mdp' n'est pas définie."
assert 'message' in locals(), "La variable 'message' n'est pas définie."
if mdp == "secret123":
    assert "autorisé" in message.lower(), "Le message doit indiquer 'Accès autorisé'."
else:
    assert "refusé" in message.lower(), "Le message doit indiquer 'Accès refusé'."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-6" label="Introduction 🦊 - Nombre pair ou impair">
    <Enonce>
      ### Introduction 🦊 - Nombre pair ou impair

      **Écrire un programme qui :**

      - Demande un nombre entier
      - Affiche si le nombre est pair ou impair

      *Astuce : Un nombre est pair si le reste de sa division par 2 est égal à 0. En Python, on utilise l'opérateur `%` pour obtenir le reste d'une division.*

      *Pour la vérification, stockez le nombre dans `n` et le message dans `message`.*
    </Enonce>
    <Verification>
```python
assert 'n' in locals(), "La variable 'n' n'est pas définie."
assert 'message' in locals(), "La variable 'message' n'est pas définie."
if n % 2 == 0:
    assert "pair" in message.lower() and "impair" not in message.lower(), f"{n} est pair."
else:
    assert "impair" in message.lower(), f"{n} est impair."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-7" label="Introduction 🦊 - Calculatrice simple">
    <Enonce>
      ### Introduction 🦊 - Calculatrice simple

      **Écrire un programme qui :**

      - Demande deux nombres et une opération (+, -, *, /)
      - Affiche le résultat de l'opération
      - Gère le cas de la division par zéro

      ## 🌟 Niveau Facile

      *Pour la vérification, stockez les deux nombres dans `a` et `b`, l'opération dans `op` (chaine de caractères) et le résultat calculé dans `resultat`. En cas d'erreur (division par zéro), `resultat` peut valoir `None` ou un message d'erreur.*
    </Enonce>
    <Verification>
```python
assert 'a' in locals() and 'b' in locals(), "Variables 'a' et 'b' requises."
assert 'op' in locals(), "Variable 'op' requise."
assert 'resultat' in locals(), "Variable 'resultat' requise."

if op == '+':
    assert resultat == a + b
elif op == '-':
    assert resultat == a - b
elif op == '*':
    assert resultat == a * b
elif op == '/':
    if b != 0:
        assert abs(resultat - (a / b)) < 0.0001
    else:
        # Just check that it didn't crash and maybe handled it
        pass
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-8" label="Facile 🦊 - Note et mention">
    <Enonce>
      ### Facile 🦊 - Note et mention

      **Écrire un programme qui :**

      - Demande une note sur 20
      - Affiche la mention correspondante :
        - Note >= 16 : "Très bien"
        - Note >= 14 : "Bien"
        - Note >= 12 : "Assez bien"
        - Note >= 10 : "Passable"
        - Note < 10 : "Insuffisant"

      *Pour la vérification, stockez la note dans `note` et la mention dans `mention`.*
    </Enonce>
    <Verification>
```python
assert 'note' in locals(), "La variable 'note' n'est pas définie."
assert 'mention' in locals(), "La variable 'mention' n'est pas définie."
m = mention.lower()
if note >= 16: assert "très bien" in m
elif note >= 14: assert "bien" in m and "très" not in m and "assez" not in m
elif note >= 12: assert "assez bien" in m
elif note >= 10: assert "passable" in m
else: assert "insuffisant" in m
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-9" label="Facile 🦊 - Température et conseil">
    <Enonce>
      ### Facile 🦊 - Température et conseil

      **Écrire un programme qui :**

      - Demande la température extérieure
      - Donne un conseil vestimentaire :
        - Moins de 0°C : "Portez un manteau d'hiver"
        - De 0 à 15°C : "Portez une veste"
        - De 16 à 25°C : "Un pull suffit"
        - Plus de 25°C : "T-shirt recommandé"

      *Pour la vérification, stockez la température dans `temp` et le conseil dans `conseil`.*
    </Enonce>
    <Verification>
```python
assert 'temp' in locals(), "La variable 'temp' n'est pas définie."
assert 'conseil' in locals(), "La variable 'conseil' n'est pas définie."
c = conseil.lower()
if temp < 0: assert "manteau" in c or "hiver" in c
elif 0 <= temp <= 15: assert "veste" in c
elif 16 <= temp <= 25: assert "pull" in c
else: assert "t-shirt" in c
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-10" label="Facile 🦊 - Jours du mois">
    <Enonce>
      ### Facile 🦊 - Jours du mois

      **Écrire un programme qui :**

      - Demande un numéro de mois (1-12)
      - Affiche le nombre de jours dans ce mois
      - Considère février avec 28 jours

      *Pour la vérification, stockez le numéro du mois dans `mois` et le nombre de jours dans `jours`.*
    </Enonce>
    <Verification>
```python
assert 'mois' in locals(), "La variable 'mois' n'est pas définie."
assert 'jours' in locals(), "La variable 'jours' n'est pas définie."
if mois == 2:
    assert jours == 28
elif mois in [4, 6, 9, 11]:
    assert jours == 30
else:
    assert jours == 31
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="conditions-11" label="Facile 🦊 - Triangle possible">
    <Enonce>
      ### Facile 🦊 - Triangle possible

      **Écrire un programme qui :**

      - Demande trois longueurs
      - Vérifie si on peut former un triangle avec ces longueurs

      *Pour la vérification, stockez les trois longueurs dans `a`, `b`, `c` et une variable booléenne `possible` (True si possible, False sinon).*
    </Enonce>
    <Verification>
```python
assert 'a' in locals() and 'b' in locals() and 'c' in locals(), "Variables a, b, c requises."
assert 'possible' in locals(), "Variable 'possible' requise."
correct = (a < b + c) and (b < a + c) and (c < a + b)
assert possible == correct, f"Pour {a}, {b}, {c}, le résultat devrait être {correct}."
```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>
