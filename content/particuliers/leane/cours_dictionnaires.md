---
title: "Python - Les Dictionnaires"
description: "Cours complet sur la structure de données clé-valeur"
level: "particuliers"
chapter: "Structures de données"
icon: "📚"
allowedStudents: ["Léane"]
badgeId: "dict-master"
---

# 📚 Les Dictionnaires en Python

## 1. Introduction

Les dictionnaires (type `dict`) sont une structure de données fondamentale en Python. Contrairement aux listes qui sont indexées par des entiers (0, 1, 2...), les dictionnaires sont indexés par des **clés** (keys), qui peuvent être de n'importe quel type immuable (chaînes de caractères, nombres, tuples).

C'est une structure de type **clé-valeur** (key-value pair).

> 💡 **Analogie** : Pense à un dictionnaire papier. Pour trouver la définition (valeur), tu utilises le mot (clé). Tu ne cherches pas par numéro de page.

## 2. Création d'un dictionnaire

Il existe deux façons principales de créer un dictionnaire : avec des accolades `{}` ou avec la fonction `dict()`.

```python
# Dictionnaire vide
mon_dico = {}
# ou
mon_dico = dict()

# Dictionnaire avec des valeurs initiales
etudiant = {
    "nom": "Dupont",
    "prenom": "Jean",
    "age": 17,
    "classe": "Terminale"
}

# Clés de types différents (possible mais déconseillé pour la lisibilité)
mixte = {
    1: "un",
    "deux": 2,
    (1, 2): "couple"
}
```

## 3. Accéder aux valeurs

### Par la clé
On utilise les crochets `[]` avec la clé à l'intérieur.

```python
print(etudiant["nom"])  # Affiche "Dupont"
print(etudiant["age"])  # Affiche 17
```

⚠️ **Attention** : Si la clé n'existe pas, Python lève une erreur `KeyError`.

### Avec la méthode `.get()`
C'est la méthode recommandée si tu n'es pas sûr que la clé existe. Elle renvoie `None` (ou une valeur par défaut) si la clé est absente, sans planter le programme.

```python
print(etudiant.get("adresse"))         # Affiche None
print(etudiant.get("adresse", "Inconnue")) # Affiche "Inconnue"
```

## 4. Modifier et Ajouter des éléments

Les dictionnaires sont **mutables** (modifiables).

```python
# Modifier une valeur existante
etudiant["age"] = 18

# Ajouter une nouvelle paire clé-valeur
etudiant["note_moyenne"] = 14.5

print(etudiant)
# {'nom': 'Dupont', 'prenom': 'Jean', 'age': 18, 'classe': 'Terminale', 'note_moyenne': 14.5}
```

## 5. Supprimer des éléments

Plusieurs méthodes existent :

- `del d[key]` : Supprime la clé et sa valeur (plante si la clé n'existe pas).
- `d.pop(key)` : Supprime la clé et **renvoie** la valeur associée.
- `d.clear()` : Vide entièrement le dictionnaire.

```python
del etudiant["classe"]
note = etudiant.pop("note_moyenne") # note vaut 14.5, la clé est supprimée
```

## 6. Parcourir un dictionnaire (Itération)

C'est une partie cruciale ! Il y a trois façons principales de boucler sur un dictionnaire.

### A. Parcourir les CLÉS (Par défaut)
```python
fruits = {"pomme": 3, "banane": 5, "orange": 2}

for fruit in fruits:
    print(fruit)
# Affiche : pomme, banane, orange
```
C'est équivalent à `for fruit in fruits.keys():`.

### B. Parcourir les VALEURS
```python
for quantite in fruits.values():
    print(quantite)
# Affiche : 3, 5, 2
```

### C. Parcourir les DEUX (Clé et Valeur) - Le plus utile !
On utilise la méthode `.items()`.

```python
for fruit, quantite in fruits.items():
    print(f"J'ai {quantite} {fruit}s.")
# Affiche :
# J'ai 3 pommes.
# J'ai 5 bananes.
# J'ai 2 oranges.
```

## 7. Vérifier l'existence d'une clé

On utilise le mot-clé `in`. C'est très rapide (complexité O(1)).

```python
if "pomme" in fruits:
    print("On a des pommes !")
    
if "kiwi" not in fruits:
    print("Pas de kiwi en stock.")
```

## 8. Quelques méthodes utiles

- `len(d)` : Nombre de paires clé-valeur.
- `d.keys()` : Renvoie une vue sur les clés.
- `d.values()` : Renvoie une vue sur les valeurs.
- `d.items()` : Renvoie une vue sur les couples (clé, valeur).
- `d.update(autre_dico)` : Fusionne deux dictionnaires (écrase les valeurs si les clés existent déjà).

## 9. Complexité Algorithmique (Pour aller plus loin)

C'est l'un des grands atouts des dictionnaires (qui sont implémentés via des **tables de hachage**).

| Opération | Complexité Moyenne |
|-----------|--------------------|
| Accès `d[k]` | **O(1)** (Constant) |
| Ajout `d[k]=v` | **O(1)** |
| Suppression `del d[k]` | **O(1)** |
| Recherche `k in d` | **O(1)** |

Comparé à une liste où la recherche est en **O(n)** (il faut parcourir toute la liste), le dictionnaire est extrêmement performant pour retrouver des données.

---

### Résumé en image

Un dictionnaire, c'est comme une série de casiers étiquetés.
- L'étiquette est la **clé**.
- Ce qu'il y a dedans est la **valeur**.
- On accède directement au casier via son étiquette.
