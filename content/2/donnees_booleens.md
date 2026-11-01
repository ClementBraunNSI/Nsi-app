---
title: Booléens et Fonctions booléennes
description: L'algèbre de George Boole et la logique binaire
level: premiere
chapter: Représentation des données
icon: "lightbulb"
badgeId: premiere_booleens
prerequisites: []
audience: public
groupe: booleens
groupeTitre: "Booléens"
---

# Booléens et fonctions booléennes

Au XIXe siècle, George Boole a cherché à calculer avec des propositions vraies ou fausses, comme on calcule avec des nombres. Un siècle plus tard, cette algèbre a trouvé une application concrète dans les circuits électroniques, où un fil porte un signal ou n'en porte pas. En programmation, on la retrouve dans chaque `if`. Un booléen n'a que deux valeurs, **vrai** ou **faux**, qu'on note aussi **1** ou **0**.

Une **variable booléenne** contient l'une de ces deux valeurs. Une **fonction booléenne** prend une ou plusieurs variables booléennes et renvoie une valeur booléenne. Comme les entrées n'ont que peu de combinaisons possibles, on peut toutes les écrire dans un tableau, appelé **table de vérité**.

## Les opérations booléennes

Le **NON**, noté $\overline{a}$ ou `not`, inverse la valeur de son unique entrée.

| a | s |
|:-:|:-:|
| 0 | 1 |
| 1 | 0 |

Le **ET**, noté $a \cdot b$ ou `and`, n'est vrai que si les deux entrées le sont. Il suffit qu'une seule entrée soit fausse pour que le résultat soit faux.

| a | b | s |
|:-:|:-:|:-:|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

Le **OU**, noté $a + b$ ou `or`, est vrai dès qu'une entrée au moins est vraie. Si les deux entrées sont vraies, le résultat est vrai aussi : ce OU n'est pas exclusif.

| a | b | s |
|:-:|:-:|:-:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

Le **OU exclusif**, le XOR, noté $a \oplus b$, est vrai quand exactement une entrée est vraie. Il est donc faux quand les deux entrées valent 0, mais aussi quand elles valent toutes les deux 1. C'est le « l'un ou l'autre, mais pas les deux ».

| a | b | s |
|:-:|:-:|:-:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

En notation algébrique, $+$ veut dire OU, $\times$ ou $\cdot$ veut dire ET, et la barre veut dire NON. Ce ne sont pas l'addition et la multiplication des entiers, même si les symboles se ressemblent. En booléen, $1 + 1$ vaut 1 et non 2.

## Calculer une expression

Soit $S = (a + b) \times c$, avec $a = 1$, $b = 0$, $c = 0$.

D'abord $a + b = 1 + 0 = 1$. Ensuite $1 \times 0 = 0$. Donc $S = 0$.

La priorité usuelle place le NON avant le ET, et le ET avant le OU. En cas de doute, il vaut mieux écrire des parenthèses que de compter sur la mémoire de chacun.

## En Python

```python
a = True
b = False
c = False

S = (a or b) and c   # False
print(not a)         # False
print(a and b)       # False
print(a or b)        # True
```

| Mathématiques | Python |
|---|---|
| ET | `and` |
| OU | `or` |
| NON | `not` |

`True or True` vaut `True`, parce que `or` est le OU inclusif. Un XOR des deux mêmes valeurs vaudrait `False`. En Python, `^` entre booléens fait ce XOR, mais dans les conditions on écrit plutôt `and`, `or` et `not`, qui sont plus lisibles.

## Pour s'entraîner

Les [exercices sur les booléens](/cours/2/donnees_booleens_exercices) demandent de construire des tables de vérité, et pas seulement de les relire.
