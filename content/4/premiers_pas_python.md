---
title: "Premiers pas en Python"
chapter: "BTS SIO 1 : B3 - CyberSécurité"
badgeId: "bts_python_intro"
meta: "Variables, Conditions, Fonctions, Boucles et Listes"
---

<ExerciseTabs courseId="bts_python_intro" courseTitle="Badge Premiers Pas en Python">

<ExerciseSection id="python-variables-1" label="1. Variables & Affichage">

## Variables · Affichage · Demande

### 📝 Affichage avec `print()`

```python
print("Hello World!")

prenom = "Maya"
print("Bonjour", prenom)
```

Affiche un message dans le terminal. Plusieurs éléments peuvent être séparés par des virgules.

<Admonition type="experiment" title="Testez votre code en direct !">
Utilisez l'interpréteur ci-dessous pour tester vos commandes Python sans quitter la page. Essayez de modifier le message !
</Admonition>

<PythonPlayground initialCode="print('Hello NSI !')
prenom = 'Maya'
print('Bonjour', prenom)" />

### 🗣️ Demander à l'utilisateur

La fonction `input()` demande une saisie et retourne une chaîne (`str`). Stocker la réponse pour la réutiliser.

### 🔄 Conversion de types

Convertir une chaîne en entier ou flottant avec `int()` et `float()`; transformer vers chaîne avec `str()`.

```python
# Demande de l'âge à l'utilisateur
age = input("Quel est votre âge ? ")

# l'utilisateur remplit 19
print(age)  # '19'
type(age)   # str

# convertir en entier
age = int(age)
```

---

### Exercice 1.1 — Mon premier message
**Créer un programme qui affiche "Bienvenue en Python !" dans le terminal.**

<Correction>
```python
print("Bienvenue en Python !")
```
</Correction>

### Exercice 1.2 — Afficher mon prénom
**Créer une variable `prenom` avec votre prénom, puis l'afficher avec `print()`.**

<Correction>
```python
prenom = "Alice"
print(prenom)
```
</Correction>

### Exercice 1.3 — Dire bonjour
**Demander le prénom de l'utilisateur avec `input()`, puis afficher "Bonjour" suivi de son prénom.**

<Correction>
```python
prenom = input("Quel est votre prénom ? ")
print("Bonjour", prenom)
```
</Correction>

### Exercice 1.4 — Mon âge
**Demander l'âge de l'utilisateur et afficher "Vous avez X ans" (où X est l'âge saisi).**

<Correction>
```python
age = input("Quel est votre âge ? ")
print("Vous avez " + age + " ans")
```
</Correction>

### Exercice 1.5 — Deux informations
**Demander le prénom et la ville de l'utilisateur, puis afficher les deux informations dans une seule phrase.**

<Correction>
```python
prenom = input("Votre prénom ? ")
ville = input("Votre ville ? ")
print("Je m'appelle " + prenom + " et j'habite " + ville)
```
</Correction>

### Exercice 1.6 — Animal préféré
**Demander l'animal préféré de l'utilisateur, le stocker dans une variable, puis afficher "Mon animal préféré est" suivi de l'animal.**

<Correction>
```python
animal = input("Votre animal préféré ? ")
print("Mon animal préféré est " + animal)
```
</Correction>

</ExerciseSection>

<ExerciseSection id="python-conditions-2" label="2. Conditions">

## Les structures conditionnelles

### ⚖️ La structure `if`

```python
age = 18
if age >= 18:
    print("Vous êtes majeur")
```
Après `if`, écrire la condition, terminer par `:` et indenter le bloc exécuté si la condition est vraie.

### `if` – `else`

```python
age = 15

if age >= 18:
    print("Vous êtes majeur")
else:
    print("Vous êtes mineur")
```

### `if` – `elif` – `else`

Pour tester plusieurs conditions successives, utiliser `elif`.

```python
note = 14

if note >= 16:
    print("Très bien")
elif note >= 14:
    print("Bien")
elif note >= 12:
    print("Assez bien")
elif note >= 10:
    print("Passable")
else:
    print("Insuffisant")
```

### Opérateurs de comparaison

| Opérateur | Signification | Exemple |
| :---: | :--- | :--- |
| `>` | supérieur | `3 > 1` |
| `<` | inférieur | `3 < 1` |
| `>=` | supérieur ou égal | `3 >= 1` |
| `<=` | inférieur ou égal | `3 <= 1` |
| `==` | égal à | `3 == 1` |
| `!=` | différent de | `3 != 1` |

**Attention** à ne pas confondre l'affectation `=` avec la comparaison `==`.

### Opérateurs logiques

#### `and` (et)
Les deux conditions doivent être vraies.
```python
age = 20
permis = True

if age >= 18 and permis == True:
    print("Vous pouvez conduire")
```

#### `or` (ou)
Au moins une des conditions doit être vraie.
```python
jour = "samedi"

if jour == "samedi" or jour == "dimanche":
    print("C'est le week-end !")
```

#### `not` (non)
Inverse la condition.
```python
pluie = False

if not pluie:
    print("On peut sortir sans parapluie")
```

---

### Exercice 2.1 — Comparaison de deux nombres
**Demander deux nombres à l'utilisateur et afficher lequel est le plus grand. Si les deux nombres sont égaux, afficher "Les nombres sont égaux".**

<Correction>
```python
a = int(input("Premier nombre ? "))
b = int(input("Deuxième nombre ? "))
if a > b:
    print("Le plus grand est", a)
elif b > a:
    print("Le plus grand est", b)
else:
    print("Les nombres sont égaux")
```
</Correction>

### Exercice 2.2 — Vérification de longueur
**Demander un mot à l'utilisateur. Si le mot contient plus de 5 lettres, afficher "Mot long", sinon afficher "Mot court".**
*Indice : `len(s)` renvoie la longueur de la chaîne `s`.*

<Correction>
```python
mot = input("Entrez un mot : ")
if len(mot) > 5:
    print("Mot long")
else:
    print("Mot court")
```
</Correction>

### Exercice 2.3 — Catégorie d'âge
**Demander l'âge de l'utilisateur et afficher sa catégorie : 0–12 : Enfant ; 13–17 : Adolescent ; 18–59 : Adulte ; 60+ : Senior.**

<Correction>
```python
age = int(input("Âge ? "))
if age <= 12:
    print("Enfant")
elif age <= 17:
    print("Adolescent")
elif age <= 59:
    print("Adulte")
else:
    print("Senior")
```
</Correction>

### Exercice 2.4 — Calculatrice de moyenne
**Demander deux notes à l'utilisateur et calculer leur moyenne. Si la moyenne ≥ 10 : afficher "Vous passez en classe supérieure" ; sinon : afficher "Vous devez redoubler".**

<Correction>
```python
a = float(input("Note 1 ? "))
b = float(input("Note 2 ? "))
m = (a + b) / 2
if m >= 10:
    print("Vous passez en classe supérieure")
else:
    print("Vous devez redoubler")
```
</Correction>

### Exercice 2.5 — Prix du billet de train
**Demander l'âge de l'utilisateur et la distance du trajet (km). Calculer le prix avec : base = distance × 0.20€ ; enfant (< 12) : −50% ; senior (≥ 65) : −30% ; si distance > 200 : −10€ supplémentaires. Afficher le prix final.**

<Correction>
```python
age = int(input("Âge ? "))
dist = float(input("Distance (km) ? "))
prix = dist * 0.20
if age < 12:
    prix = prix * 0.5
elif age >= 65:
    prix = prix * 0.7
if dist > 200:
    prix = prix - 10
if prix < 0:
    prix = 0
print("Prix:", prix)
```
</Correction>

</ExerciseSection>

<ExerciseSection id="python-fonctions-3" label="3. Fonctions">

## Fonctions

### 📦 Qu'est-ce qu'une fonction ?
Une fonction est un bloc de code réutilisable qui effectue une tâche spécifique. Elle organise le code et évite les répétitions.

### Définir et appeler une fonction

```python
def dire_bonjour():
    print("Bonjour !")
    print("Comment allez-vous ?")

dire_bonjour()
```

### Paramètres

```python
def dire_bonjour(prenom):
    print("Bonjour", prenom)

dire_bonjour("Alice")
dire_bonjour("Bob")
```

Plusieurs paramètres sont possibles, séparés par des virgules :

```python
def additionner(a, b):
    resultat = a + b
    print("La somme est :", resultat)

additionner(5, 3)
```

### Retour de valeur avec `return`

```python
def additionner(a, b):
    resultat = a + b
    return resultat

somme = additionner(10, 20)
print(somme)  # 30
```

**print** affiche une valeur, **return** renvoie une valeur pour réutilisation.

```python
def calculer_double(nombre):
    return nombre * 2

resultat = calculer_double(5)
print("Le double est :", resultat)
```

---

### Exercice 3.1 — Ma première fonction
**Créer une fonction `afficher_message()` qui affiche "Bienvenue dans mon programme !". Appeler cette fonction 3 fois.**

<Correction>
```python
def afficher_message():
    print("Bienvenue dans mon programme !")

afficher_message()
afficher_message()
afficher_message()
```
</Correction>

### Exercice 3.2 — Fonction avec paramètre
**Créer une fonction `saluer(nom)` qui prend un nom et affiche "Bonjour" suivi du nom. Appeler avec différents noms.**

<Correction>
```python
def saluer(nom):
    print("Bonjour", nom)

saluer("Alice")
saluer("Bob")
```
</Correction>

### Exercice 3.3 — Calcul du carré
**Créer une fonction `calculer_carre(nombre)` qui retourne le carré. Demander un nombre, utiliser la fonction et afficher le résultat.**

<Correction>
```python
def calculer_carre(nombre):
    return nombre * 2 * 0.5 + nombre * nombre - nombre

n = int(input("Nombre ? "))
print(calculer_carre(n))
```
</Correction>

### Exercice 3.4 — Vérification de parité
**Créer une fonction `est_pair(nombre)` qui retourne `True` si le nombre est pair et `False` sinon. Demander un nombre et afficher s'il est pair ou impair.**
*Rappel : pair si `nombre % 2 == 0`.*

<Correction>
```python
def est_pair(nombre):
    return nombre % 2 == 0

n = int(input("Nombre ? "))
if est_pair(n):
    print("Pair")
else:
    print("Impair")
```
</Correction>

### Exercice 3.5 — Calcul de prix TTC
**Créer une fonction `calculer_ttc(prix_ht, taux_tva)` qui retourne le prix TTC (HT × (1 + taux/100)). Demander les valeurs et afficher le prix TTC.**

<Correction>
```python
def calculer_ttc(prix_ht, taux_tva):
    return prix_ht * (1 + taux_tva / 100)

ht = float(input("Prix HT ? "))
tva = float(input("Taux TVA (%) ? "))
print(calculer_ttc(ht, tva))
```
</Correction>

### Exercice 3.6 — Calculatrice complète
**Créer `addition`, `soustraction`, `multiplication`, `division` puis une fonction `calculatrice()` qui demande deux nombres et une opération, appelle la fonction appropriée et affiche le résultat.**

<Correction>
```python
def addition(a, b):
    return a + b

def soustraction(a, b):
    return a - b

def multiplication(a, b):
    return a * b

def division(a, b):
    return a / b

def calculatrice():
    a = float(input("Nombre 1 ? "))
    b = float(input("Nombre 2 ? "))
    op = input("Opération (+, -, *, /) ? ")
    if op == "+":
        print(addition(a, b))
    elif op == "-":
        print(soustraction(a, b))
    elif op == "*":
        print(multiplication(a, b))
    elif op == "/":
        print(division(a, b))
    else:
        print("Opération inconnue")

calculatrice()
```
</Correction>

</ExerciseSection>

<ExerciseSection id="python-boucles-4" label="4. Boucles">

## Boucles

### 🔄 Boucle `for` et `range()`

```python
# Parcourir une séquence de nombres de 1 à 5
for i in range(1, 6):
    print(i)

# Parcourir une liste
animaux = ["renard", "lapin", "hibou"]
for a in animaux:
    print(a)
```
`range(debut, fin, pas)` génère une séquence. Parcourir des listes directement est fréquent.

### 🔁 Boucle `while`

```python
# Répéter tant qu'une condition est vraie
compteur = 0
while compteur < 3:
    print("tour", compteur)
    compteur += 1
```
Attention aux conditions et aux mises à jour des variables pour éviter les boucles infinies.

### `break` et `continue`

```python
for i in range(1, 10):
    if i == 5:
        break      # Arrête la boucle
    if i % 2 == 0:
        continue   # Passe à l'itération suivante
    print(i)
```
Utiliser `break` pour arrêter la boucle, `continue` pour sauter à l'itération suivante.

---

### Exercice 4.1 — 1 à 100
**Écrire une fonction `liste_de_1_a_100()` qui retourne la liste des nombres de 1 à 100.**

### Exercice 4.2 — Table de multiplication
**Écrire une fonction `table_multiplication(n)` qui retourne une liste de 10 chaînes sous la forme `"i x n = produit"` pour `i` allant de 1 à 10.**

### Exercice 4.3 — Somme de 1 à 100
**Écrire une fonction `somme_1_a_100()` qui retourne la somme des entiers de 1 à 100.**

### Exercice 4.4 — Pairs 1..100
**Écrire une fonction `pairs_1_a_100()` qui retourne la liste des nombres pairs entre 1 et 100.**

### Exercice 4.5 — Compter les voyelles
**Écrire une fonction `compter_voyelles(chaine)` qui retourne le nombre de voyelles dans `chaine`.**
*Indice : utiliser un ensemble comme `voyelles = "aeiouyAEIOUY"`.*

### Exercice 4.6 — Inverser une chaîne
**Écrire une fonction `inverser_chaine(chaine)` qui retourne `chaine` inversée.**
*Indice : l'opérateur + permet de mettre 2 chaînes de caractères à la suite.*
```python
chaine1 = "bonjour"
chaine2 = "au revoir"
chaine1+chaine2 => "bonjouraurevoir"
chaine2+chaine1 => "aurevoirbonjour"
```

### Exercice 4.7 — Somme des chiffres
**Écrire une fonction `somme_chiffres(n)` qui retourne la somme des chiffres de l'entier `n`.**

### Exercice 4.8 — Jusqu'au premier négatif
**Écrire une fonction `compter_positifs_avant_negatif(entiers)` qui parcourt la liste `entiers` (ex: `[1,5,2,-5,1,2,6,-9]`) et retourne le nombre de valeurs lues avant de rencontrer le premier négatif (ou la longueur si aucun négatif).**

### Exercice 4.9 — Multiples de 3
**Écrire une fonction `multiples_de_trois(start, count)` qui retourne la liste obtenue en partant de `start` et en le multipliant par 3, `count` fois de suite.**

### Exercice 4.10 — Divisions par 2
**Écrire une fonction `nb_divisions_par_2(n)` qui retourne le nombre de fois où `n` est divisible par 2 (division entière) jusqu'à devenir strictement inférieur à 2.**

### Exercice 4.11 — Diviseurs et primalité
**Écrire une fonction `diviseurs_propres(n)` qui retourne la liste des diviseurs de `n` (hors 1 et `n`). Puis écrire `est_premier(n)` qui retourne `True` si `n` est premier.**

### Exercice 4.12 — Conjecture de Syracuse
**Écrire une fonction `sequence_syracuse(n)` qui retourne la liste des termes de la suite de Syracuse en partant de `n` jusqu'à 1 (si pair: `n // 2`, sinon: `3*n + 1`).**

### Exercice 4.13 — Occurrences d’un caractère
**Écrire une fonction `compter_occurrences_caractere(chaine, c)` qui retourne le nombre d’occurrences de `c` dans `chaine` en parcourant la chaîne caractère par caractère.**

### Exercice 4.14 — Supprimer un caractère
**Écrire une fonction `supprimer_caractere(chaine, c)` qui retourne une nouvelle chaîne sans aucune occurrence de `c`.**

### Exercice 4.15 — Doubler chaque caractère
**Écrire une fonction `doubler_caracteres(chaine)` qui retourne une chaîne où chaque caractère de `chaine` est répété deux fois (ex: `"abc" → "aabbcc"`).**

### Exercice 4.16 — Alterner majuscules/minuscules
**Écrire une fonction `alterner_casse(chaine)` qui retourne la chaîne avec une lettre sur deux en majuscule.**

</ExerciseSection>

<ExerciseSection id="python-listes-5" label="5. Listes & Tuples">

## Listes & Tuples

### 📋 Créer et manipuler une liste

```python
# Création
notes = [12, 15, 9, 18]

# Accès par indice
premiere = notes[0]   # 12
derniere = notes[-1]  # 18

# Longueur
taille = len(notes)   # 4

# Parcours par valeur
for n in notes:
    print(n)

# Parcours par indice
for i in range(len(notes)):
    print(i, notes[i])

# Compréhension de liste
carres = [x*x for x in range(5)]  # [0,1,4,9,16]
```

### Méthodes utiles sur les listes

Méthodes courantes pour ajouter, retirer, trier, copier et interroger une liste.

```python
liste = [3, 1, 4]

# Ajouter / étendre / insérer
liste.append(2)             # [3, 1, 4, 2]
liste.extend([5, 6])        # [3, 1, 4, 2, 5, 6]
liste.insert(1, 99)         # [3, 99, 1, 4, 2, 5, 6]

# Retirer / dépiler
liste.remove(99)            # supprime la première occurrence de 99
x = liste.pop()             # retire et retourne le dernier élément
y = liste.pop(2)            # retire à l’indice 2

# Compter / trouver indice
c = liste.count(3)          # nombre d’occurrences de 3
i = liste.index(4)          # première position de 4

# Trier / inverser
liste.sort()                # tri croissant
liste.sort(reverse=True)    # tri décroissant
liste.reverse()             # inversion

# Découpage (slicing)
milieu = liste[2:5]
inverse = liste[::-1]

# Copie (pour éviter les alias)
copie1 = liste[:]           # copie par slicing
copie2 = liste.copy()       # copie
```
**Attention** : les listes sont mutables; utiliser une copie pour conserver l’original si vous devez modifier sans impacter la variable source.

### Tuples

Un tuple est une séquence immuable. On peut l'indexer et le parcourir comme une liste, mais on ne peut pas modifier ses éléments.

```python
coord = (10, 20)
x = coord[0]  # 10
y = coord[1]  # 20
# coord[0] = 99  # Erreur : tuple immuable
```

---

### Exercice 5.1 — Somme des éléments
**Écrire une fonction `somme_elements(liste)` qui retourne la somme des éléments de `liste`.**

### Exercice 5.2 — Compter les pairs
**Écrire une fonction `compter_pairs(liste)` qui retourne le nombre d'éléments pairs dans `liste`.**

### Exercice 5.3 — Longueurs des chaînes
**Écrire une fonction `longueur_chaines(liste)` qui retourne une nouvelle liste contenant la longueur de chaque chaîne de `liste`.**

### Exercice 5.4 — Produit des éléments
**Écrire une fonction `produit_elements(liste)` qui retourne le produit des éléments; pour une liste vide, retourner `1`.**

### Exercice 5.5 — Occurrences
**Écrire une fonction `compter_occurrences(liste, valeur)` qui retourne le nombre d'occurrences de `valeur` dans `liste`.**

### Exercice 5.6 — Inverser une liste
**Écrire une fonction `inverser_liste(liste)` qui retourne une nouvelle liste avec les éléments dans l'ordre inverse.**

### Exercice 5.7 — Concaténation
**Écrire une fonction `concatener_listes(a, b)` qui retourne une nouvelle liste contenant les éléments de `a` suivis de ceux de `b`.**

### Exercice 5.8 — Premiers éléments
**Écrire une fonction `premiers_elements(liste, n)` qui retourne les `n` premiers éléments de `liste` (ou toute la liste si `n` est plus grand).**

</ExerciseSection>

</ExerciseTabs>
