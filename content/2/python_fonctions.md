---
title: Fonctions en Python
description: >-
  Définir, appeler et documenter des fonctions pour modulariser un programme.
level: premiere
chapter: Introduction à Python
icon: "\U0001F40D"
badgeId: premiere_python_fonctions
prerequisites:
  - python_types_base
---

## Objectifs

- Définir une fonction avec `def` et l'appeler.
- Distinguer **paramètres** (définition) et **arguments** (appel).
- Utiliser `return` pour renvoyer un résultat.
- Expliquer la différence entre variable locale et variable globale.
- Rédiger une docstring courte pour documenter une fonction.

## Idée clé

Une **fonction** est une boîte noire réutilisable : on lui donne des entrées (arguments), elle calcule, puis **renvoie** un résultat. Cela évite de copier-coller du code et clarifie le rôle de chaque partie du programme.

## Définir et appeler

```python
def aire_rectangle(longueur: float, largeur: float) -> float:
    """Calcule l'aire d'un rectangle."""
    return longueur * largeur

a = aire_rectangle(5, 3)  # a vaut 15.0
print(a)
```

| Mot | Rôle |
| --- | --- |
| Paramètre | Nom dans la définition (`longueur`, `largeur`) |
| Argument | Valeur fournie à l'appel (`5`, `3`) |
| `return` | Renvoie le résultat à l'appelant |

Sans `return`, la fonction renvoie `None`.

!!! warning "`print` n'est pas `return`"
    `print` affiche à l'écran. `return` transmet une valeur utilisable ensuite (`x = ma_fonction()`). Les deux rôles sont différents.

## Portée des variables

- **Locale** : créée dans la fonction, invisible à l'extérieur.
- **Globale** : créée hors de toute fonction ; lisible partout, mais à modifier avec prudence.

```python
compteur = 0  # globale

def incrementer():
    global compteur
    compteur = compteur + 1

incrementer()
print(compteur)  # 1
```

En Première, on préfère **passer des paramètres** et **retourner un résultat** plutôt que d'abuser de `global`.

## Bonnes pratiques

1. Un nom qui décrit l'action : `calculer_moyenne`, pas `f`.
2. Une fonction = **une** responsabilité claire.
3. Une docstring en début de corps pour expliquer le rôle.

```python
def est_pair(n: int) -> bool:
    """Renvoie True si n est pair, False sinon."""
    return n % 2 == 0
```

## Piège fréquent

- Oublier les parenthèses à l'appel : `aire_rectangle` (la fonction elle-même) ≠ `aire_rectangle(2, 3)` (le résultat).
- Croire qu'une variable locale modifie automatiquement la globale du même nom — sans `global` ou sans `return`, non.

## À retenir

- `def nom(...):` définit ; `nom(...)` appelle.
- Paramètres ≠ arguments.
- `return` fournit le résultat ; sans `return` → `None`.
- Variables locales limitées au corps de la fonction.
- Préférer paramètres + `return` à `global`.
- Docstring + nom explicite = code plus lisible.

## Pour s'entraîner

- [Exercices : Les fonctions](/cours/2/python_exercices_fonctions)
- [Exercices : Spécifications](/cours/2/python_exercices_specifications)
