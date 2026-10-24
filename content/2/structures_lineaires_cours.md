---
title: Structures de données linéaires
description: >-
  Listes et tuples : accès par indice, parcours, et modifications des listes.
level: premiere
chapter: Structures de données linéaires
icon: "\U0001F517"
badgeId: premiere_cours
prerequisites: []
audience: public
---

# Structures de données linéaires

Une structure **linéaire** range des éléments les uns après les autres. Chaque case a un **indice**, et l'ordre fait partie de l'information. En Python, deux structures partagent cette idée et ne partagent pas les mêmes droits. Le **tuple** fige son contenu. La **liste** le laisse changer. On choisit l'une ou l'autre selon qu'on a le droit de modifier.

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

Un point du plan n'a pas vocation à devenir autre chose case par case : un tuple convient. Une série de notes reçoit de nouvelles valeurs : une liste convient. Tenter d'écrire dans un tuple lève une `TypeError`. Ce n'est pas une limite agaçante, c'est le contrat.

## L'indice commence à zéro

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

La première boucle donne les valeurs, quand l'indice ne sert pas. La seconde donne l'indice et la valeur, quand on doit savoir « à quelle place ». Les deux parcourent toute la séquence, dans l'ordre.

`+` concatène, et produit une **nouvelle** séquence. `(1, 2) + (3, 4)` vaut `(1, 2, 3, 4)`. Les deux tuples de départ ne changent pas. C'est cohérent : un tuple est immuable, on ne peut que fabriquer un autre tuple.

## Modifier une liste

`append` ajoute à la fin. `pop` retire un élément et le renvoie : sans argument, c'est le dernier ; avec un indice, c'est la case demandée. `remove` cherche une **valeur** et retire sa première occurrence. `pop` et `remove` ne répondent donc pas à la même question. L'un demande « la case numéro… », l'autre « la valeur… ».

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

Dans une boucle, `nombres.append(e)` est le bon geste. `nombres = nombres + [e]` fabrique une nouvelle liste à chaque tour, et recopie tout ce qui précède. Le résultat se ressemble. Le coût, non.

## Construire une liste en une expression

Une **compréhension** de liste construit une liste à partir d'un parcours, et éventuellement d'un filtre.

```python
pairs = [i for i in range(10) if i % 2 == 0]
# [0, 2, 4, 6, 8]

cubes = [n ** 3 for n in range(1, 5)]
# [1, 8, 27, 64]
```

On lit la première ainsi : les `i` de `range(10)` pour lesquels `i` est pair. La seconde : le cube de chaque `n` de 1 à 4, puisque `range` exclut la borne de droite. Quand la logique devient longue, ou quand les boucles s'imbriquent, un `for` classique se relit mieux. La compréhension n'est pas une obligation de style.

Pour fermer : une structure linéaire est ordonnée, et l'on y accède par un indice qui part de 0. Le tuple, entre parenthèses, est immuable. La liste, entre crochets, est mutable. `len`, l'indexation et `for` servent aux deux. `append`, `pop` et `remove` ne servent qu'à la liste. `+` crée une nouvelle séquence. Une compréhension s'écrit `[expr for x in iterable if cond]`.

## Pour s'entraîner

- [Exercices : Listes](/cours/2/python_exercices_listes)
- [TP structures linéaires](/cours/2/structures_lineaires_tp)
- Suite : [Piles et files](/cours/2/structures_lineaires_piles_files)
