---
title: Structures de données linéaires
description: >-
  Listes et tuples : accès par indice, parcours, et modifications des listes.
level: premiere
chapter: Structures de données linéaires
icon: "link"
badgeId: premiere_cours
prerequisites: []
audience: public
---

# Structures de données linéaires

Une structure **linéaire** range des éléments les uns après les autres. Chaque case a un **indice**, et l'ordre fait partie de l'information. En Python, deux structures reposent sur cette idée, mais elles ne se manipulent pas de la même façon. Le contenu d'un **tuple** ne peut pas être modifié, alors que celui d'une **liste** peut changer. On choisit donc l'une ou l'autre selon que les données doivent pouvoir être modifiées ou non.

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

Les coordonnées d'un point du plan n'ont pas à être modifiées une par une : un tuple convient. Une série de notes, en revanche, reçoit de nouvelles valeurs : une liste convient mieux. Toute tentative de modifier un tuple lève une `TypeError`, ce qui garantit que son contenu ne change pas.

## Les indices

La première case porte l'indice **0**, la suivante 1, et ainsi de suite. La dernière a l'indice `len(t) - 1`. On peut aussi l'écrire `-1` : les indices négatifs comptent depuis la fin.

| Indice | 0 | 1 | 2 |
| --- | --- | --- | --- |
| Valeur | 312 | 354 | 1234 |

!!! warning "Indice 0"
    Le premier élément est à l'indice **0**, le dernier à `len(t) - 1` (ou `-1`).

`len` donne le nombre d'éléments, pas le dernier indice. Une séquence de longueur 3 a des indices 0, 1 et 2. L'indice 3 n'existe pas.

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

La première boucle donne les valeurs, ce qui suffit quand l'indice ne sert pas. La seconde donne l'indice et la valeur, quand il faut aussi connaître la position de chaque élément. Les deux parcourent toute la séquence, dans l'ordre.

`+` concatène deux séquences et produit une **nouvelle** séquence : `(1, 2) + (3, 4)` vaut `(1, 2, 3, 4)`, et les deux tuples de départ ne changent pas. C'est logique, puisqu'un tuple est immuable : on ne peut que fabriquer un autre tuple.

## Modifier une liste

`append` ajoute un élément à la fin. `pop` retire un élément et le renvoie : sans argument, il s'agit du dernier, et avec un indice, de l'élément placé à cet indice. `remove` cherche une **valeur** et retire sa première occurrence. `pop` travaille donc à partir d'une position, alors que `remove` travaille à partir d'une valeur.

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

Dans une boucle, il vaut mieux utiliser `nombres.append(e)`. `nombres = nombres + [e]` fabrique une nouvelle liste à chaque tour, et recopie tout ce qui précède. Le résultat est le même, mais le coût est bien plus élevé.

## Construire une liste en une expression

Une **compréhension** de liste construit une liste à partir d'un parcours, et éventuellement d'un filtre.

```python
pairs = [i for i in range(10) if i % 2 == 0]
# [0, 2, 4, 6, 8]

cubes = [n ** 3 for n in range(1, 5)]
# [1, 8, 27, 64]
```

La première se lit ainsi : « les `i` de `range(10)` pour lesquels `i` est pair ». La seconde donne le cube de chaque `n` de 1 à 4, puisque `range` exclut la borne de droite. Quand la logique devient longue, ou quand les boucles s'imbriquent, un `for` classique se relit mieux. La compréhension n'est donc jamais obligatoire.

En résumé, une structure linéaire est ordonnée, et l'on y accède par un indice qui part de 0. Le tuple, entre parenthèses, est immuable. La liste, entre crochets, est mutable. `len`, l'indexation et `for` servent aux deux. `append`, `pop` et `remove` ne servent qu'à la liste. `+` crée une nouvelle séquence. Une compréhension s'écrit `[expr for x in iterable if cond]`.

## Pour s'entraîner

- [Exercices : Listes](/cours/2/python_exercices_listes)
- [TP structures linéaires](/cours/2/structures_lineaires_tp)
- Suite : [Piles et files](/cours/2/structures_lineaires_piles_files)
