---
title: Structures de données linéaires
description: >-
  Listes et tuples : accès par indice, parcours, et modifications des listes.
level: premiere
chapter: Structures de données linéaires
icon: "\U0001F517"
badgeId: premiere_cours
prerequisites: []
---

## Objectifs

- Distinguer **liste** (mutable) et **tuple** (immuable).
- Accéder à un élément par son indice (à partir de 0).
- Parcourir une séquence avec `for`.
- Ajouter ou retirer des éléments dans une liste (`append`, `pop`, `remove`).
- Lire une compréhension de liste simple.

## Idée clé

Une structure **linéaire** range des éléments **les uns après les autres**. Chaque case a un **indice**. En Python, le tuple fige le contenu ; la liste le laisse évoluer. Même idée d'organisation, règles de modification différentes.

## Listes et tuples

| | Tuple | Liste |
| --- | --- | --- |
| Syntaxe | `(1, 2, 3)` | `[1, 2, 3]` |
| Modifiable ? | Non (immuable) | Oui (mutable) |
| Usage typique | Coordonnées, enregistrement fixe | Collection qui évolue |

```python
point = (3.5, 2.0)      # tuple
notes = [12, 15, 9]     # liste
notes[1] = 16           # OK
# point[0] = 4          # TypeError : tuple non modifiable
```

| Indice | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Valeur | 312 | 354 | 1234 |

!!! warning "Indice 0"
    Le premier élément est à l'indice **0**, le dernier à `len(t) - 1` (ou `-1`).

## Accès et parcours

```python
animaux = ["chien", "chat", "poisson"]
print(len(animaux))   # 3
print(animaux[0])     # chien
print(animaux[-1])    # poisson

for animal in animaux:
    print(animal)

for i in range(len(animaux)):
    print(i, animaux[i])
```

La concaténation `+` produit une **nouvelle** séquence : `(1, 2) + (3, 4)` → `(1, 2, 3, 4)`.

## Modifier une liste

```python
nombres = []
for i in range(5):
    nombres.append(i * 2)   # [0, 2, 4, 6, 8]

x = nombres.pop()    # retire 8, nombres = [0, 2, 4, 6]
nombres.pop(0)       # retire 0
nombres.remove(4)    # retire la première occurrence de 4
```

| Méthode | Effet |
| --- | --- |
| `append(e)` | ajoute `e` à la fin |
| `pop()` / `pop(i)` | retire et renvoie le dernier / l'indice `i` |
| `remove(e)` | retire la première occurrence de `e` |

Préférer `append` à `liste = liste + [e]` dans une boucle (plus efficace).

## Compréhension de liste

Forme compacte pour construire une liste :

```python
pairs = [i for i in range(10) if i % 2 == 0]
# [0, 2, 4, 6, 8]

cubes = [n ** 3 for n in range(1, 5)]
# [1, 8, 27, 64]
```

Pour une logique longue ou imbriquée, une boucle `for` classique reste plus lisible.

## Piège fréquent

- Modifier un tuple → `TypeError`. Utiliser une liste si le contenu doit changer.
- `pop` retire un **indice** (ou le dernier) ; `remove` cherche une **valeur**.

## À retenir

- Linéaire = éléments ordonnés, accès par indice dès 0.
- Tuple `()` immuable ; liste `[]` mutable.
- `len`, indexation, `for element in seq`.
- Listes : `append`, `pop`, `remove`.
- `+` concatène en créant une nouvelle séquence.
- Compréhension : `[expr for x in iterable if cond]`.

## Pour s'entraîner

- [Exercices : Listes](/cours/2/python_exercices_listes)
- [TP structures linéaires](/cours/2/structures_lineaires_tp)
- Suite : [Piles et files](/cours/2/structures_lineaires_piles_files)
