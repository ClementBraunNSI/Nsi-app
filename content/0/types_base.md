---
title: "Valeur et type des données"
description: "Découverte des types fondamentaux en Python : nombres, chaînes et booléens."
level: SNI
chapter: "Programmation_Python"
icon: "🐍"
---

<ExerciseTabs courseId="types-base" courseTitle="Types de base">
  <ExerciseSection id="cours-types" label="Cours">
    <Enonce>
## Introduction

En informatique, les données que nous manipulons ont différentes natures : des nombres, du texte, des réponses vrai/faux, etc. Chaque donnée possède un **type** qui détermine ce que l'on peut faire avec elle.

## Qu'est-ce un type de données ?

Le **type** d'une donnée correspond à :
1. L'ensemble des **valeurs possibles** pour cette donnée
2. Les **opérateurs autorisés** (ce qu'on peut faire avec)

### Analogie
C'est comme les ingrédients en cuisine :
- La farine (type "solide") : on peut la mélanger, la peser, la tamiser
- L'eau (type "liquide") : on peut la verser, la chauffer, la mesurer en litres
- On ne peut pas faire les mêmes opérations avec les deux !

## Les types de base en Python

### 1. Le type NOMBRE (int et float)

**Nombres entiers (int)** : 
- Valeurs possibles : ..., -2, -1, 0, 1, 2, 3, ...
- Exemples : `42`, `-7`, `0`, `2024`

**Nombres décimaux (float)** :
- Valeurs possibles : nombres avec virgule
- Exemples : `3.14`, `-0.5`, `2.0`, `98.6`

**Opérations autorisées sur les nombres :**

```python
# Addition
a = 10 + 5  # 15

# Soustraction
b = 10 - 3  # 7

# Multiplication
c = 4 * 5  # 20

# Division
d = 10 / 2  # 5.0 (résultat toujours en float)

# Division entière
e = 10 // 3  # 3 (partie entière)

# Modulo (reste de la division)
f = 10 % 3  # 1 (le reste de 10 divisé par 3)

# Puissance
g = 2 ** 3  # 8 (2 à la puissance 3)
```

**Exemples d'utilisation :**
```python
age = 15  # int
taille = 1.65  # float
temperature = -5  # int

# Calculs
dans_10_ans = age + 10
prix_total = 12.50 * 3
```

### 2. Le type CHAÎNE DE CARACTÈRES (str)

Une **chaîne de caractères** (string) représente du texte.

- Valeurs possibles : n'importe quel texte
- Délimitée par des guillemets simples `'...'` ou doubles `"..."`
- Exemples : `"Bonjour"`, `'Python'`, `"123"`, `"Marie"`

**Opérations autorisées sur les chaînes :**

```python
# Concaténation (coller deux textes)
prenom = "Marie"
nom = "Dupont"
nom_complet = prenom + " " + nom  # "Marie Dupont"

# Répétition
rire = "Ha" * 3  # "HaHaHa"

# Longueur
message = "Bonjour"
longueur = len(message)  # 7

# Accès à un caractère (index commence à 0)
premiere_lettre = message[0]  # "B"
derniere_lettre = message[-1]  # "r"

# Extraction (slicing)
debut = message[0:3]  # "Bon"

# Mise en majuscules/minuscules
majuscule = message.upper()  # "BONJOUR"
minuscule = message.lower()  # "bonjour"
```

## Vérifier le type d'une variable

En Python, on peut vérifier le type avec la fonction `type()` :

```python
age = 15
nom = "Alice"
est_present = True
note = 15.5

print(type(age))        # <class 'int'>
print(type(nom))        # <class 'str'>
print(type(est_present)) # <class 'bool'>
print(type(note))       # <class 'float'>
```

## Conversion entre types

On peut transformer une donnée d'un type vers un autre (quand c'est possible) :

```python
# Chaîne vers nombre
age_texte = "15"
age_nombre = int(age_texte)  # 15

note_texte = "15.5"
note_nombre = float(note_texte)  # 15.5

# Nombre vers chaîne
age = 15
age_en_texte = str(age)  # "15"

# Nombre vers booléen
nombre = 5
en_bool = bool(nombre)  # True (tout sauf 0 donne True)

nombre_zero = 0
en_bool2 = bool(nombre_zero)  # False

# Chaîne vers booléen
texte1 = "Bonjour"
bool1 = bool(texte1)  # True (chaîne non vide)

texte2 = ""
bool2 = bool(texte2)  # False (chaîne vide)
```

## Erreurs courantes liées aux types

### Erreur 1 : Mélanger texte et nombre
```python
# ❌ ERREUR
age = 15
message = "J'ai " + age + " ans"  # TypeError !

# ✅ CORRECT
age = 15
message = "J'ai " + str(age) + " ans"  # "J'ai 15 ans"
```

### Erreur 2 : Mauvaise conversion
```python
# ❌ ERREUR
texte = "Bonjour"
nombre = int(texte)  # ValueError ! (on ne peut pas convertir du texte en nombre)

# ✅ CORRECT
texte = "123"
nombre = int(texte)  # 123
```

### Erreur 3 : Division par zéro
```python
# ❌ ERREUR
resultat = 10 / 0  # ZeroDivisionError !

# ✅ CORRECT : vérifier avant
diviseur = 0
if diviseur != 0:
    resultat = 10 / diviseur
else:
    print("Impossible de diviser par zéro")
```
    </Enonce>
    <Verification>
```python
assert True
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="ex-types-pratique" label="Exercice Pratique">
    <Enonce>
### Exercice Pratique

**Déclarez trois variables :**
1. `annee` (entier) valant 2024
2. `langage` (chaîne) valant "Python"
3. `version` (flottant) valant 3.12

**Puis affichez la phrase :** "En 2024, j'apprends Python 3.12" en utilisant ces variables.
    </Enonce>
    <Verification>
```python
assert 'annee' in locals() and annee == 2024, "La variable 'annee' doit valoir 2024."
assert 'langage' in locals() and langage == "Python", "La variable 'langage' doit valoir 'Python'."
assert 'version' in locals() and version == 3.12, "La variable 'version' doit valoir 3.12."
assert isinstance(annee, int), "'annee' doit être un entier."
assert isinstance(langage, str), "'langage' doit être une chaîne."
assert isinstance(version, float), "'version' doit être un flottant."
```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>
