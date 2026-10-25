---
title: Premiers pas en Python
chapter: 'BTS SIO 1 : B3 - CyberSécurité'
badgeId: bts_python_intro
meta: 'Variables, Conditions, Fonctions, Boucles et Listes'
prerequisites:
  - introduction_cybersecurite
audience: public
---

<ExerciseTabs courseId="bts_python_intro" courseTitle="Badge Premiers Pas en Python">

<ExerciseSection id="python-variables-1" label="1. Variables & Affichage" type="autre">

## Variables, affichage, saisie

`print` écrit dans le terminal. On peut lui passer plusieurs valeurs, séparées par des virgules : il les affiche à la suite, avec un espace entre elles.

```python
print("Hello World!")

prenom = "Maya"
print("Bonjour", prenom)
```

L'interpréteur ci-dessous exécute ce qui est tapé, sans quitter la page. Changer le message, relancer, et regarder ce qui sort.

<Admonition type="experiment" title="Tester son code en direct !">
Utiliser l'interpréteur ci-dessous pour tester les commandes Python sans quitter la page. Essayer de modifier le message !
</Admonition>

<PythonPlayground initialCode="print('Hello NSI !')
prenom = 'Maya'
print('Bonjour', prenom)" />

`input` pose une question et renvoie toujours une chaîne, un `str`, même quand la personne a tapé des chiffres. On range cette chaîne dans une variable pour s'en resservir. Pour calculer avec, on la convertit : `int` vers un entier, `float` vers un décimal. `str` fait le chemin inverse, d'un nombre vers une chaîne.

```python
# Demande de l'âge à l'utilisateur
age = input("Quel est votre âge ? ")

# l'utilisateur remplit 19
print(age)  # '19'
type(age)   # str

# convertir en entier
age = int(age)
```

Tant que `age` est la chaîne `'19'`, on peut l'afficher et la coller à une autre chaîne. On ne peut pas lui ajouter 1. Après `int(age)`, c'est l'entier 19, et le calcul devient possible. Oublier la conversion est la première erreur de ce chapitre : le programme ne se plaint pas à l'`input`, il se plaint à l'opération suivante.

### Exercice 1.1 : Mon premier message
**Créer un programme qui affiche "Bienvenue en Python !" dans le terminal.**

<Correction>
```python
print("Bienvenue en Python !")
```
</Correction>

### Exercice 1.2 : Afficher mon prénom
**Créer une variable `prenom` avec son prénom, puis l'afficher avec `print()`.**

<Correction>
```python
prenom = "Alice"
print(prenom)
```
</Correction>

### Exercice 1.3 : Dire bonjour
**Demander le prénom de l'utilisateur avec `input()`, puis afficher "Bonjour" suivi de son prénom.**

<Correction>
```python
prenom = input("Quel est votre prénom ? ")
print("Bonjour", prenom)
```
</Correction>

### Exercice 1.4 : Mon âge
**Demander l'âge de l'utilisateur et afficher "Vous avez X ans" (où X est l'âge saisi).**

<Correction>
```python
age = input("Quel est votre âge ? ")
print("Vous avez " + age + " ans")
```
</Correction>

### Exercice 1.5 : Deux informations
**Demander le prénom et la ville de l'utilisateur, puis afficher les deux informations dans une seule phrase.**

<Correction>
```python
prenom = input("Votre prénom ? ")
ville = input("Votre ville ? ")
print("Je m'appelle " + prenom + " et j'habite " + ville)
```
</Correction>

### Exercice 1.6 : Animal préféré
**Demander l'animal préféré de l'utilisateur, le stocker dans une variable, puis afficher "Mon animal préféré est" suivi de l'animal.**

<Correction>
```python
animal = input("Votre animal préféré ? ")
print("Mon animal préféré est " + animal)
```
</Correction>

</ExerciseSection>

<ExerciseSection id="python-conditions-2" label="2. Conditions" type="autre">

## Choisir selon une condition

Un programme qui fait toujours la même chose ne décide rien. `if` n'exécute le bloc indenté que lorsque la condition est vraie. Les deux-points annoncent le bloc. L'indentation le délimite : en Python, le décalage n'est pas décoratif, c'est la syntaxe.

```python
age = 18
if age >= 18:
    print("Vous êtes majeur")
```

`else` prend le cas restant, quand la condition est fausse. Un seul des deux blocs s'exécute.

```python
age = 15

if age >= 18:
    print("Vous êtes majeur")
else:
    print("Vous êtes mineur")
```

Dès qu'il y a plus de deux issues, `elif` teste une condition suivante, seulement si les précédentes ont échoué. L'ordre compte. Une note de 17 satisfait aussi `>= 14` et `>= 12`. Si le test le plus exigeant n'est pas écrit en premier, il ne sera jamais atteint.

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

| Opérateur | Signification | Exemple |
| :---: | :--- | :--- |
| `>` | supérieur | `3 > 1` |
| `<` | inférieur | `3 < 1` |
| `>=` | supérieur ou égal | `3 >= 1` |
| `<=` | inférieur ou égal | `3 <= 1` |
| `==` | égal à | `3 == 1` |
| `!=` | différent de | `3 != 1` |

`=` affecte, `==` compare. `if age = 18` n'est pas une condition. C'est une erreur.

`and` exige que les deux côtés soient vrais. `or` se contente d'un seul. `not` inverse.

```python
age = 20
permis = True

if age >= 18 and permis == True:
    print("Vous pouvez conduire")
```

```python
jour = "samedi"

if jour == "samedi" or jour == "dimanche":
    print("C'est le week-end !")
```

```python
pluie = False

if not pluie:
    print("On peut sortir sans parapluie")
```

`permis == True` se simplifie souvent en `if permis`, puisque la variable est déjà un booléen. Les deux formes disent la même chose. Autant lire la plus courte une fois qu'elle ne surprend plus.

### Exercice 2.1 : Comparaison de deux nombres
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

### Exercice 2.2 : Vérification de longueur
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

### Exercice 2.3 : Catégorie d'âge
**Demander l'âge de l'utilisateur et afficher sa catégorie : 0-12 : Enfant ; 13-17 : Adolescent ; 18-59 : Adulte ; 60+ : Senior.**

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

### Exercice 2.4 : Calculatrice de moyenne
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

### Exercice 2.5 : Prix du billet de train
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

<ExerciseSection id="python-fonctions-3" label="3. Fonctions" type="autre">

## Ranger un geste dans une fonction

Une **fonction** est un bloc qu'on nomme pour le rappeler. Elle évite de recopier le même code, et elle donne un nom au geste : `dire_bonjour` se lit mieux que trois `print` perdus au milieu du script. On la définit avec `def`, on l'appelle par son nom suivi de parenthèses.

```python
def dire_bonjour():
    print("Bonjour !")
    print("Comment allez-vous ?")

dire_bonjour()
```

Sans l'appel, la fonction existe et ne s'exécute pas. Définir n'est pas lancer.

Un **paramètre** est une valeur que l'appel fournit. Le même `saluer` sert pour Alice et pour Bob. Plusieurs paramètres se séparent par des virgules, et l'ordre de l'appel est l'ordre de la définition.

```python
def dire_bonjour(prenom):
    print("Bonjour", prenom)

dire_bonjour("Alice")
dire_bonjour("Bob")
```

```python
def additionner(a, b):
    resultat = a + b
    print("La somme est :", resultat)

additionner(5, 3)
```

`print` montre une valeur. Il ne la rend pas au reste du programme. `return` la renvoie : l'appel peut la stocker, la passer à une autre fonction, s'en servir dans un calcul. Une fonction qui affiche et une fonction qui calcule ne jouent pas le même rôle. On préfère calculer dans la fonction, et afficher là où l'on décide de montrer le résultat.

```python
def additionner(a, b):
    resultat = a + b
    return resultat

somme = additionner(10, 20)
print(somme)  # 30
```

```python
def calculer_double(nombre):
    return nombre * 2

resultat = calculer_double(5)
print("Le double est :", resultat)
```

### Exercice 3.1 : Ma première fonction
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

### Exercice 3.2 : Fonction avec paramètre
**Créer une fonction `saluer(nom)` qui prend un nom et affiche "Bonjour" suivi du nom. Appeler avec différents noms.**

<Correction>
```python
def saluer(nom):
    print("Bonjour", nom)

saluer("Alice")
saluer("Bob")
```
</Correction>

### Exercice 3.3 : Calcul du carré
**Créer une fonction `calculer_carre(nombre)` qui retourne le carré. Demander un nombre, utiliser la fonction et afficher le résultat.**

<Correction>
```python
def calculer_carre(nombre):
    return nombre * 2 * 0.5 + nombre * nombre - nombre

n = int(input("Nombre ? "))
print(calculer_carre(n))
```
</Correction>

### Exercice 3.4 : Vérification de parité
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

### Exercice 3.5 : Calcul de prix TTC
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

### Exercice 3.6 : Calculatrice complète
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

<ExerciseSection id="python-boucles-4" label="4. Boucles" type="autre">

## Répéter

`for` parcourt une suite. `range(debut, fin)` produit les entiers de `debut` inclus à `fin` exclu : `range(1, 6)` donne 1, 2, 3, 4, 5. Un troisième argument est le pas. On parcourt aussi une liste directement : la variable de boucle prend chaque valeur, l'une après l'autre.

```python
# Parcourir une séquence de nombres de 1 à 5
for i in range(1, 6):
    print(i)

# Parcourir une liste
animaux = ["renard", "lapin", "hibou"]
for a in animaux:
    print(a)
```

`while` répète tant que la condition reste vraie. Il faut que quelque chose, dans le corps, la rende fausse un jour. Ici, `compteur` augmente. S'il n'augmentait pas, la condition `compteur < 3` resterait vraie, et la boucle ne s'arrêterait pas.

```python
# Répéter tant qu'une condition est vraie
compteur = 0
while compteur < 3:
    print("tour", compteur)
    compteur += 1
```

`break` sort de la boucle tout de suite. `continue` saute le reste du tour et passe à l'itération suivante. Dans l'exemple, les pairs sont sautés, et l'arrivée à 5 arrête tout. On affiche donc 1 et 3.

```python
for i in range(1, 10):
    if i == 5:
        break      # Arrête la boucle
    if i % 2 == 0:
        continue   # Passe à l'itération suivante
    print(i)
```

On prend `for` quand on sait quoi parcourir. On prend `while` quand l'arrêt dépend d'une condition qu'on ne sait pas compter à l'avance, une saisie, une valeur qui décroît.

### Exercice 4.1 : 1 à 100
**Écrire une fonction `liste_de_1_a_100()` qui retourne la liste des nombres de 1 à 100.**

### Exercice 4.2 : Table de multiplication
**Écrire une fonction `table_multiplication(n)` qui retourne une liste de 10 chaînes sous la forme `"i x n = produit"` pour `i` allant de 1 à 10.**

### Exercice 4.3 : Somme de 1 à 100
**Écrire une fonction `somme_1_a_100()` qui retourne la somme des entiers de 1 à 100.**

### Exercice 4.4 : Pairs 1..100
**Écrire une fonction `pairs_1_a_100()` qui retourne la liste des nombres pairs entre 1 et 100.**

### Exercice 4.5 : Compter les voyelles
**Écrire une fonction `compter_voyelles(chaine)` qui retourne le nombre de voyelles dans `chaine`.**
*Indice : utiliser un ensemble comme `voyelles = "aeiouyAEIOUY"`.*

### Exercice 4.6 : Inverser une chaîne
**Écrire une fonction `inverser_chaine(chaine)` qui retourne `chaine` inversée.**
*Indice : l'opérateur + permet de mettre 2 chaînes de caractères à la suite.*
```python
chaine1 = "bonjour"
chaine2 = "au revoir"
chaine1+chaine2 => "bonjouraurevoir"
chaine2+chaine1 => "aurevoirbonjour"
```

### Exercice 4.7 : Somme des chiffres
**Écrire une fonction `somme_chiffres(n)` qui retourne la somme des chiffres de l'entier `n`.**

### Exercice 4.8 : Jusqu'au premier négatif
**Écrire une fonction `compter_positifs_avant_negatif(entiers)` qui parcourt la liste `entiers` (ex: `[1,5,2,-5,1,2,6,-9]`) et retourne le nombre de valeurs lues avant de rencontrer le premier négatif (ou la longueur si aucun négatif).**

### Exercice 4.9 : Multiples de 3
**Écrire une fonction `multiples_de_trois(start, count)` qui retourne la liste obtenue en partant de `start` et en le multipliant par 3, `count` fois de suite.**

### Exercice 4.10 : Divisions par 2
**Écrire une fonction `nb_divisions_par_2(n)` qui retourne le nombre de fois où `n` est divisible par 2 (division entière) jusqu'à devenir strictement inférieur à 2.**

### Exercice 4.11 : Diviseurs et primalité
**Écrire une fonction `diviseurs_propres(n)` qui retourne la liste des diviseurs de `n` (hors 1 et `n`). Puis écrire `est_premier(n)` qui retourne `True` si `n` est premier.**

### Exercice 4.12 : Conjecture de Syracuse
**Écrire une fonction `sequence_syracuse(n)` qui retourne la liste des termes de la suite de Syracuse en partant de `n` jusqu'à 1 (si pair: `n // 2`, sinon: `3*n + 1`).**

### Exercice 4.13 : Occurrences d'un caractère
**Écrire une fonction `compter_occurrences_caractere(chaine, c)` qui retourne le nombre d'occurrences de `c` dans `chaine` en parcourant la chaîne caractère par caractère.**

### Exercice 4.14 : Supprimer un caractère
**Écrire une fonction `supprimer_caractere(chaine, c)` qui retourne une nouvelle chaîne sans aucune occurrence de `c`.**

### Exercice 4.15 : Doubler chaque caractère
**Écrire une fonction `doubler_caracteres(chaine)` qui retourne une chaîne où chaque caractère de `chaine` est répété deux fois (ex: `"abc" -> "aabbcc"`).**

### Exercice 4.16 : Alterner majuscules/minuscules
**Écrire une fonction `alterner_casse(chaine)` qui retourne la chaîne avec une lettre sur deux en majuscule.**

</ExerciseSection>

<ExerciseSection id="python-listes-5" label="5. Listes & Tuples" type="autre">

## Listes et tuples

Une **liste** garde plusieurs valeurs dans l'ordre, sous un seul nom. L'indice commence à 0. L'indice `-1` désigne le dernier élément, sans qu'on ait à calculer `len` soi-même. `len` donne le nombre d'éléments.

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

On parcourt par valeur quand seule la note compte. On parcourt par indice quand on a aussi besoin de la position. La compréhension de liste construit une nouvelle liste en une expression : ici, les carrés de 0 à 4.

Les méthodes modifient souvent la liste sur place. `append` ajoute un élément à la fin. `extend` ajoute ceux d'une autre liste. `insert` place un élément à un indice, et décale le reste. `remove` retire la première occurrence d'une valeur. `pop` retire et renvoie, par défaut le dernier, ou celui de l'indice donné. `count` et `index` interrogent sans modifier. `sort` et `reverse` réordonnent. Le découpage `liste[2:5]` fabrique une nouvelle liste, de l'indice 2 inclus à l'indice 5 exclu. `liste[::-1]` la renverse.

```python
liste = [3, 1, 4]

# Ajouter / étendre / insérer
liste.append(2)             # [3, 1, 4, 2]
liste.extend([5, 6])        # [3, 1, 4, 2, 5, 6]
liste.insert(1, 99)         # [3, 99, 1, 4, 2, 5, 6]

# Retirer / dépiler
liste.remove(99)            # supprime la première occurrence de 99
x = liste.pop()             # retire et retourne le dernier élément
y = liste.pop(2)            # retire à l'indice 2

# Compter / trouver indice
c = liste.count(3)          # nombre d'occurrences de 3
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

Une liste est **mutable**. `autre = liste` ne copie pas : les deux noms désignent le même objet, et modifier l'un modifie l'autre. `liste[:]` ou `liste.copy()` fabrique une liste distincte. On copie quand on veut trier ou filtrer sans perdre l'original.

Un **tuple** se parcourt et s'indexe comme une liste. Il est **immuable** : on ne peut pas remplacer un élément, ni l'`append`. On s'en sert pour une valeur qui ne doit pas bouger, des coordonnées, une paire qu'on rend depuis une fonction.

```python
coord = (10, 20)
x = coord[0]  # 10
y = coord[1]  # 20
# coord[0] = 99  # Erreur : tuple immuable
```

### Exercice 5.1 : Somme des éléments
**Écrire une fonction `somme_elements(liste)` qui retourne la somme des éléments de `liste`.**

### Exercice 5.2 : Compter les pairs
**Écrire une fonction `compter_pairs(liste)` qui retourne le nombre d'éléments pairs dans `liste`.**

### Exercice 5.3 : Longueurs des chaînes
**Écrire une fonction `longueur_chaines(liste)` qui retourne une nouvelle liste contenant la longueur de chaque chaîne de `liste`.**

### Exercice 5.4 : Produit des éléments
**Écrire une fonction `produit_elements(liste)` qui retourne le produit des éléments; pour une liste vide, retourner `1`.**

### Exercice 5.5 : Occurrences
**Écrire une fonction `compter_occurrences(liste, valeur)` qui retourne le nombre d'occurrences de `valeur` dans `liste`.**

### Exercice 5.6 : Inverser une liste
**Écrire une fonction `inverser_liste(liste)` qui retourne une nouvelle liste avec les éléments dans l'ordre inverse.**

### Exercice 5.7 : Concaténation
**Écrire une fonction `concatener_listes(a, b)` qui retourne une nouvelle liste contenant les éléments de `a` suivis de ceux de `b`.**

### Exercice 5.8 : Premiers éléments
**Écrire une fonction `premiers_elements(liste, n)` qui retourne les `n` premiers éléments de `liste` (ou toute la liste si `n` est plus grand).**

</ExerciseSection>

</ExerciseTabs>
