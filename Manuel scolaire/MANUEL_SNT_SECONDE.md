---
title: "Manuel SNT Seconde - Programmation Python"
description: "Manuel complet de Python pour la classe de Seconde SNT : Variables, Conditions, Fonctions, Boucles et Listes."
level: "2"
chapter: "SNT : Programmation Python"
icon: "�"
badgeId: "snt_python_manuel"
meta: "Manuel, Python, SNT, Seconde, Cours, Exercices"
---

<ExerciseTabs courseId="snt_python_manuel" courseTitle="Manuel Python SNT">

<ExerciseSection id="chapitre-1-variables" label="Chapitre 1 : Variables & Affichage">
<Enonce>

## 🌟 Chapitre 1 : Variables & Affichage

### 📚 Cours

#### 1. Qu'est-ce qu'une variable ?
Une **variable** est une zone mémoire dans laquelle on stocke une valeur. Elle possède un **nom** et une **valeur**.

```python
x = 10          # Entier (int)
prix = 19.99    # Décimal (float)
message = "Hi"  # Chaîne de caractères (str)
```

#### 2. Affichage (`print`)
La fonction `print()` permet d'afficher du texte ou le contenu d'une variable dans la console.

```python
prenom = "Alice"
print("Bonjour", prenom)  # Affiche : Bonjour Alice
```

#### 3. Saisie utilisateur (`input`)
La fonction `input()` met le programme en pause et attend que l'utilisateur tape quelque chose au clavier.
**Attention :** `input()` renvoie toujours une chaîne de caractères (`str`).

```python
nom = input("Quel est votre nom ? ")
```

#### 4. Conversion de type (`int`, `float`, `str`)
Pour faire des calculs avec une saisie, il faut souvent convertir le type.

```python
age_txt = input("Votre âge ? ")  # "15" (texte)
age = int(age_txt)               # 15 (nombre entier)
```

### 📝 Je m'entraîne

#### Exercice 1.1 : Mon premier message
**Énoncé :** Écrire un programme qui affiche "Bienvenue en Python !" dans le terminal.

<Correction>
```python
print("Bienvenue en Python !")
```
</Correction>

#### Exercice 1.2 : Identité
**Énoncé :** Créer une variable `nom` avec votre nom de famille et une variable `prenom` avec votre prénom. Afficher la phrase : "Je m'appelle Prénom Nom".

<Correction>
```python
nom = "Dupont"
prenom = "Jean"
print("Je m'appelle", prenom, nom)
```
</Correction>

#### Exercice 1.3 : Âge futur
**Énoncé :** Demander l'âge de l'utilisateur, le convertir en entier, ajouter 10, et afficher "Dans 10 ans, vous aurez ... ans".

<Correction>
```python
age = int(input("Quel est votre âge ? "))
futur = age + 10
print("Dans 10 ans, vous aurez", futur, "ans")
```
</Correction>

</Enonce>
</ExerciseSection>

<ExerciseSection id="chapitre-2-conditions" label="Chapitre 2 : Conditions">
<Enonce>

## 🌟 Chapitre 2 : Structures Conditionnelles

### 📚 Cours

#### 1. La structure `if` / `else`
Les conditions permettent d'exécuter un bloc de code seulement si une condition est vraie.
**L'indentation (décalage vers la droite)** est obligatoire pour définir les blocs.

```python
note = 15

if note >= 10:
    print("Bravo, vous avez la moyenne !")
else:
    print("Il faut réviser...")
```

#### 2. Comparaisons
| Symbole | Signification |
| :---: | :--- |
| `==` | Égal à |
| `!=` | Différent de |
| `<` | Strictement inférieur |
| `<=` | Inférieur ou égal |
| `>` | Strictement supérieur |
| `>=` | Supérieur ou égal |

#### 3. Conditions multiples (`elif`)
Pour tester plusieurs cas à la suite :

```python
age = 14
if age < 12:
    print("Enfant")
elif age < 18:
    print("Adolescent")
else:
    print("Adulte")
```

### 📝 Je m'entraîne

#### Exercice 2.1 : Majeur ou Mineur
**Énoncé :** Demander l'âge de l'utilisateur. Si l'âge est supérieur ou égal à 18, afficher "Majeur", sinon afficher "Mineur".

<Correction>
```python
age = int(input("Quel est votre âge ? "))
if age >= 18:
    print("Majeur")
else:
    print("Mineur")
```
</Correction>

#### Exercice 2.2 : Le plus grand
**Énoncé :** Demander deux nombres entiers à l'utilisateur. Afficher le plus grand des deux.

<Correction>
```python
a = int(input("Nombre 1 ? "))
b = int(input("Nombre 2 ? "))
if a > b:
    print("Le plus grand est", a)
else:
    print("Le plus grand est", b)
```
</Correction>

#### Exercice 2.3 : Mot de passe
**Énoncé :** Créer une variable `mot_de_passe = "SNT2024"`. Demander à l'utilisateur de saisir le mot de passe. Si c'est le bon, afficher "Accès autorisé", sinon "Accès refusé".

<Correction>
```python
mdp = "SNT2024"
saisie = input("Entrez le mot de passe : ")
if saisie == mdp:
    print("Accès autorisé")
else:
    print("Accès refusé")
```
</Correction>

</Enonce>
</ExerciseSection>

<ExerciseSection id="chapitre-3-fonctions" label="Chapitre 3 : Fonctions">
<Enonce>

## 🌟 Chapitre 3 : Fonctions

### 📚 Cours

#### 1. Définition
Une fonction est un sous-programme qui permet de regrouper des instructions pour les réutiliser.
Elle peut prendre des **paramètres** (entrées) et retourner un **résultat** (sortie).

#### 2. Syntaxe
On utilise le mot-clé `def`.

```python
def carre(x):
    resultat = x * x
    return resultat

# Utilisation
valeur = carre(5)
print(valeur)  # Affiche 25
```

#### 3. `return` vs `print`
*   `print` : Affiche quelque chose à l'écran (pour l'humain).
*   `return` : Renvoie une valeur au programme (pour être utilisée dans un calcul).

### 📝 Je m'entraîne

#### Exercice 3.1 : Dire bonjour
**Énoncé :** Écrire une fonction `dire_bonjour(prenom)` qui affiche "Bonjour [prenom] !".

<Correction>
```python
def dire_bonjour(prenom):
    print("Bonjour " + prenom + " !")

# Test
dire_bonjour("Paul")
```
</Correction>

#### Exercice 3.2 : Surface d'un rectangle
**Énoncé :** Écrire une fonction `surface(longueur, largeur)` qui **retourne** la surface (longueur × largeur). Utiliser cette fonction pour calculer la surface d'un rectangle de 10x5.

<Correction>
```python
def surface(L, l):
    return L * l

s = surface(10, 5)
print("La surface est :", s)
```
</Correction>

#### Exercice 3.3 : Est pair ?
**Énoncé :** Écrire une fonction `est_pair(n)` qui retourne `True` si `n` est pair, et `False` sinon. (Rappel : un nombre est pair si le reste de la division par 2 est 0, soit `n % 2 == 0`).

<Correction>
```python
def est_pair(n):
    if n % 2 == 0:
        return True
    else:
        return False
```
</Correction>

</Enonce>
</ExerciseSection>

<ExerciseSection id="chapitre-4-boucles" label="Chapitre 4 : Boucles">
<Enonce>

## 🌟 Chapitre 4 : Boucles

### 📚 Cours

#### 1. La boucle `for` (pour)
On l'utilise quand on sait combien de fois on veut répéter une action.

```python
# Compter de 0 à 4
for i in range(5):
    print(i)

# Compter de 1 à 10
for i in range(1, 11):
    print(i)
```

#### 2. La boucle `while` (tant que)
On l'utilise quand on ne sait pas à l'avance combien de fois on va répéter (on répète tant qu'une condition est vraie).

```python
reponse = ""
while reponse != "oui":
    reponse = input("Voulez-vous arrêter ? ")
```

### 📝 Je m'entraîne

#### Exercice 4.1 : Punition
**Énoncé :** Afficher 100 fois la phrase "Je ne dois pas bavarder en classe" à l'aide d'une boucle.

<Correction>
```python
for i in range(100):
    print("Je ne dois pas bavarder en classe")
```
</Correction>

#### Exercice 4.2 : Compte à rebours
**Énoncé :** Afficher un compte à rebours de 10 à 0, puis afficher "Décollage !".

<Correction>
```python
for i in range(10, -1, -1):
    print(i)
print("Décollage !")
```
</Correction>

#### Exercice 4.3 : Table de multiplication
**Énoncé :** Demander un nombre `n` à l'utilisateur et afficher sa table de multiplication de 1 à 10.
*Exemple pour 5 : 1x5=5, 2x5=10...*

<Correction>
```python
n = int(input("Quel nombre ? "))
for i in range(1, 11):
    resultat = i * n
    print(i, "x", n, "=", resultat)
```
</Correction>

</Enonce>
</ExerciseSection>

<ExerciseSection id="chapitre-5-listes" label="Chapitre 5 : Listes">
<Enonce>

## 🌟 Chapitre 5 : Listes

### 📚 Cours

#### 1. Création d'une liste
Une liste permet de stocker plusieurs valeurs dans une seule variable.

```python
fruits = ["pomme", "banane", "orange"]
notes = [12, 15, 8, 19]
```

#### 2. Accéder aux éléments
On utilise l'indice (position), qui commence à **0**.

```python
print(fruits[0])  # pomme
print(fruits[1])  # banane
```

#### 3. Ajouter des éléments (`append`)

```python
fruits.append("fraise")  # Ajoute à la fin
```

#### 4. Parcourir une liste

```python
for f in fruits:
    print("J'aime les", f)
```

### 📝 Je m'entraîne

#### Exercice 5.1 : Ma liste de courses
**Énoncé :** Créer une liste vide `courses`. Demander à l'utilisateur d'entrer 3 articles (un par un) et les ajouter à la liste. Afficher la liste finale.

<Correction>
```python
courses = []
for i in range(3):
    article = input("Article à ajouter ? ")
    courses.append(article)
print("Votre liste :", courses)
```
</Correction>

#### Exercice 5.2 : Moyenne de la classe
**Énoncé :** Voici une liste de notes : `notes = [12, 15, 8, 19, 10, 14]`. Calculer et afficher la moyenne de ces notes.
*Indice : On peut parcourir la liste pour faire la somme, puis diviser par le nombre de notes (`len(notes)`).*

<Correction>
```python
notes = [12, 15, 8, 19, 10, 14]
somme = 0
for n in notes:
    somme = somme + n
moyenne = somme / len(notes)
print("La moyenne est :", moyenne)
```
</Correction>

</Enonce>
</ExerciseSection>

</ExerciseTabs>
