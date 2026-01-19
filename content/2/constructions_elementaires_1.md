---
title: "Constructions élémentaires en Python"
description: "Les fondements de la programmation Python : variables, opérateurs, conditions et boucles."
---

## 🤖 Qu'est-ce qu'un programme ?

Un **programme** est une suite d'instructions élémentaires destinées à être exécutées par un ordinateur.

* **Langage Python** : Python est un langage de **haut niveau**, plus proche de l'utilisateur que du processeur.
* **Exécution Séquentielle** : Les instructions sont réalisées de manière **séquentielle**, les unes après les autres.

> **Définition :** Un **opérateur** est un caractère ou un ensemble de caractères qui correspond à une opération réalisée par le processeur.

---

## 💾 Instanciation

L'**instanciation** est une instruction qui permet d'associer une **valeur** à une **variable**. 

* **Opérateur d'Assignation** : L'instanciation utilise l'opérateur **`=`**.
* **Espace mémoire** : Pour la machine, cela revient à associer un espace mémoire à la valeur désignée.

```python
# Instancier a à la valeur 42
a = 42

# Instancier ma_chaine_de_caractere à la valeur 'Hello World!'
ma_chaine_de_caractere = 'Hello World!'
```

## 🧮 Opérations Mathématiques

Python permet de réaliser des opérations mathématiques classiques grâce à des opérateurs utilisant deux valeurs.

|Opérateur|Opération|Description|
|-|-|-|
|+|Addition|Additionne deux nombres|
|-|Soustraction|Soustrait le second du premier|
|*|Multiplication|Multiplie deux nombres|
|/|Division|Divise le premier par le second|

```python
    a = 3 + 2  # Addition : a = 5
    b = 5 - 3  # Soustraction : b = 2
    c = a * b  # Multiplication : c = 10
    d = b / a  # Division : d = 0.4
```

⚠️ Important : Les opérations mathématiques sont réservées aux variables de type entiers ou nombres réels.

## ⚖️ Opérations de Comparaisons
Elles permettent d'évaluer des relations d'ordre ou d'égalité. Attention : on ne peut comparer que des éléments du même type.

* `a>b` : Supérieur
* `a<b` : Inférieur
* `a==b` : Égalité (à ne pas confondre avec = l'assignation)
* `a!=b` : Différence
  
## 💬 Affichage et Entrées
print() : Affiche des informations à l'écran.

input() : Capture les données saisies par l'utilisateur sous forme de chaîne de caractères.

```python
nom = input("Quel est votre nom ? ")
print("Bonjour", nom)

# Conversion nécessaire pour les calculs
age = int(input("Quel est votre âge ? "))
```

## 🔀 Conditions (if, elif, else)
Les conditions permettent d'exécuter du code selon des critères spécifiques.

```python
age = int(input('Quel est votre âge ? '))

if age >= 18:
    print('Vous êtes majeur')
else:
    print('Vous êtes mineur')
```

## 🔄 Boucles

### Boucle for

Répète un code un nombre défini de fois, souvent avec la fonction range().

```python
for i in range(1, 31):
    print(i) # Affiche de 1 à 30
```

### Boucle while

Répète un code tant qu'une condition reste vraie. L'incrémentation manuelle est obligatoire pour éviter une boucle infinie.

```python
i = 1
while i <= 30:
    print(i)
    i = i + 1
```