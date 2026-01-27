---

title: "Fiche d'exercices : Les boucles en Python"
description: "Exercices sur les boucles (for/while) en Python."
level: "2"
chapter: "Programmation Python"
icon: "🔄"
---

<ExerciseTabs courseId="fiche-boucles" courseTitle="Fiche Boucles">
  <ExerciseSection id="boucles-1" label="Important ⚠️ - Consignes importantes">
    <Enonce>
### Important ⚠️ - Consignes importantes

**Pour tous les exercices :**

- N'oubliez pas les deux points `:` après la boucle
- Faites attention à l'indentation dans la boucle
- Testez votre code avec différentes valeurs
- Créez un fichier Python différent pour chaque exercice (ex: `exercice1.py`, `exercice2.py`, etc.)
- Recopiez vos programmes sur votre cahier pour pouvoir les réviser plus tard
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="boucles-2" label="Introduction 🦊 - Compte à rebours">
    <Enonce>
### Introduction 🦊 - Compte à rebours

**Écrire un programme qui :**

- Demande un nombre de départ
- Affiche le compte à rebours jusqu'à 0

*Pour la vérification, stockez le nombre de départ dans une variable `n` et la liste des nombres affichés dans une variable `rebours` (ex: `[5, 4, 3, 2, 1, 0]`).*
    </Enonce>
    <Verification>
```python
assert 'n' in locals(), "La variable 'n' n'est pas définie."
assert 'rebours' in locals(), "La variable 'rebours' n'est pas définie."
assert isinstance(rebours, list), "La variable 'rebours' doit être une liste."
assert rebours == list(range(n, -1, -1)), f"Le compte à rebours est incorrect pour n={n}."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-3" label="Introduction 🦊 - Tables de multiplication">
    <Enonce>
### Introduction 🦊 - Tables de multiplication

**Écrire un programme qui :**

- Demande un nombre
- Affiche sa table de multiplication de 1 à 10

*Pour la vérification, stockez le nombre choisi dans `n` et la liste des résultats dans `table` (ex: `[5, 10, ..., 50]`).*
    </Enonce>
    <Verification>
```python
assert 'n' in locals(), "La variable 'n' n'est pas définie."
assert 'table' in locals(), "La variable 'table' n'est pas définie."
assert isinstance(table, list), "La variable 'table' doit être une liste."
assert len(table) == 10, "La table doit contenir 10 valeurs."
expected = [n * i for i in range(1, 11)]
assert table == expected, f"La table de multiplication pour {n} est incorrecte."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-4" label="Introduction 🦊 - Escalier d'étoiles">
    <Enonce>
### Introduction 🦊 - Escalier d'étoiles

**Écrire un programme qui :**

- Demande un nombre n
- Affiche un escalier de n marches avec des étoiles

*Astuce : pour afficher `x` fois un caractère, on peut utiliser la syntaxe `'x' * n`.*

*La chaîne de caractère "XXXXX" peut être créée via la syntaxe python suivante :*

```python
chaine_1 = "XXXXX"
chaine_2 = "X"*5
# avec chaine_1 == chaine_2
```

*Exemple pour n=3:*

```
*
**
***
```

*Pour la vérification, stockez le nombre de marches dans `n` et la liste des lignes (chaînes de caractères) dans `lignes` (ex: `['*', '**', '***']`).*
    </Enonce>
    <Verification>
```python
assert 'n' in locals(), "La variable 'n' n'est pas définie."
assert 'lignes' in locals(), "La variable 'lignes' n'est pas définie."
assert isinstance(lignes, list), "La variable 'lignes' doit être une liste."
expected = ['*' * i for i in range(1, n + 1)]
assert lignes == expected, f"L'escalier est incorrect pour n={n}."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-5" label="Introduction 🦊 - Somme des nombres">
    <Enonce>
### Introduction 🦊 - Somme des nombres

**Écrire un programme qui :**

- Demande un nombre n
- Calcule la somme des nombres de 1 à n
- Affiche le résultat

*Pour la vérification, stockez le nombre choisi dans `n` et le résultat dans `somme`.*
    </Enonce>
    <Verification>
```python
assert 'n' in locals(), "La variable 'n' n'est pas définie."
assert 'somme' in locals(), "La variable 'somme' n'est pas définie."
expected = sum(range(1, n + 1))
assert somme == expected, f"La somme des nombres de 1 à {n} doit être {expected}."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-6" label="Introduction 🦊 - Puissance de 2">
    <Enonce>
### Introduction 🦊 - Puissance de 2

**Écrire un programme qui :**

- Demande un nombre n
- Affiche les puissances de 2 jusqu'à 2^n

*Pour la vérification, stockez le nombre choisi dans `n` et la liste des puissances calculées dans `puissances` (ex: `[1, 2, 4, ..., 2^n]`).*
    </Enonce>
    <Verification>
```python
assert 'n' in locals(), "La variable 'n' n'est pas définie."
assert 'puissances' in locals(), "La variable 'puissances' n'est pas définie."
assert isinstance(puissances, list), "La variable 'puissances' doit être une liste."
expected = [2**i for i in range(n + 1)]
assert puissances == expected, f"Les puissances de 2 jusqu'à 2^{n} sont incorrectes."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-7" label="Introduction 🦊 - Message répété">
    <Enonce>
### Introduction 🦊 - Message répété

**Écrire un programme qui :**

- Demande une phrase
- Demande un nombre de répétitions
- Affiche la phrase autant de fois que demandé

## 🌟 Niveau Facile

*Pour la vérification, stockez la phrase dans `phrase`, le nombre de répétitions dans `n`, et créez une liste `resultats` contenant la phrase répétée `n` fois.*
    </Enonce>
    <Verification>
```python
assert 'phrase' in locals(), "La variable 'phrase' n'est pas définie."
assert 'n' in locals(), "La variable 'n' n'est pas définie."
assert 'resultats' in locals(), "La variable 'resultats' n'est pas définie."
assert isinstance(resultats, list), "La variable 'resultats' doit être une liste."
assert len(resultats) == n, f"La liste doit contenir {n} éléments."
assert all(r == phrase for r in resultats), "Tous les éléments doivent être égaux à la phrase."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-8" label="Facile 🦊 - Calculatrice continue">
    <Enonce>
### Facile 🦊 - Calculatrice continue

**Écrire un programme qui :**

- Demande deux nombres et une opération
- Affiche le résultat
- Demande si on veut continuer (oui/non)
- Recommence si la réponse est "oui"

## 🔥 Niveau Intermédiaire

*Pour la vérification, assurez-vous que votre boucle se termine correctement quand on entre 'non'. Aucune variable spécifique n'est vérifiée automatiquement ici car c'est un programme interactif.*
    </Enonce>
    <Verification>
```python
# Pas de vérification automatique stricte pour ce programme interactif complexe
assert True
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-9" label="Intermédiaire 🦊🦊 - Devinette avec limite">
    <Enonce>
### Intermédiaire 🦊🦊 - Devinette avec limite

**Écrire un programme qui :**

- Donne 5 essais pour deviner un nombre entre 1 et 100
- Affiche "Perdu!" si le nombre n'est pas trouvé après 5 essais
- Affiche le nombre d'essais utilisés en cas de victoire

*Pour la vérification, utilisez une variable `essais_restants` qui décrémente à chaque tour.*
    </Enonce>
    <Verification>
```python
assert 'essais_restants' in locals() or 'essais' in locals(), "Utilisez une variable pour compter les essais."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="boucles-10" label="Intermédiaire 🦊🦊 - Caisse enregistreuse">
    <Enonce>
### Intermédiaire 🦊🦊 - Caisse enregistreuse

**Écrire un programme qui :**

- Demande des prix d'articles un par un
- S'arrête quand on entre 0
- Affiche le total à payer

*Pour la vérification, stockez le montant total calculé dans une variable `total`.*
    </Enonce>
    <Verification>
```python
assert 'total' in locals(), "La variable 'total' n'est pas définie."
assert isinstance(total, (int, float)), "Le total doit être un nombre."
```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>
