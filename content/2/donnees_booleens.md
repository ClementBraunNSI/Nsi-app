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

George Boole, au XIXe siècle, a voulu calculer avec des propositions vraies ou fausses, comme on calcule avec des nombres. Un siècle plus tard, les circuits ont fait de cette algèbre quelque chose de physique : un fil porte un signal, ou il n'en porte pas. En programmation, le même partage revient dans chaque `if`. Un booléen n'a que deux valeurs, **vrai** ou **faux**, qu'on note aussi **1** ou **0**.

Une **variable booléenne** contient l'une de ces deux valeurs. Une **fonction booléenne** en prend une ou plusieurs, et en renvoie une. Comme on ne peut pas « essayer un peu » : il y a peu de combinaisons, on les écrit toutes. C'est la **table de vérité**.

## Quatre opérations

Le **NON**, noté $\overline{a}$ ou `not`, inverse. Il n'a qu'une entrée.

| a | s |
|:-:|:-:|
| 0 | 1 |
| 1 | 0 |

Le **ET**, noté $a \cdot b$ ou `and`, n'est vrai que si les deux entrées le sont. Une seule suffit à le rendre faux. C'est l'opération exigeante.

| a | b | s |
|:-:|:-:|:-:|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

Le **OU**, noté $a + b$ ou `or`, est vrai dès qu'une entrée au moins est vraie. Les deux vraies ensemble restent vraies : ce n'est pas un choix exclusif.

| a | b | s |
|:-:|:-:|:-:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

Le **OU exclusif**, le XOR, noté $a \oplus b$, est vrai quand exactement une entrée est vraie. Deux zéros : faux. Deux uns : faux aussi. C'est le « l'un ou l'autre, pas les deux ».

| a | b | s |
|:-:|:-:|:-:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

En notation algébrique, $+$ veut dire OU, $\times$ ou $\cdot$ veut dire ET, et la barre veut dire NON. Ce ne sont pas l'addition et la multiplication des entiers, même si les symboles se ressemblent. $1 + 1$ en booléen vaut 1, pas 2.

## Calculer une expression

Soit $S = (a + b) \times c$, avec $a = 1$, $b = 0$, $c = 0$.

D'abord $a + b = 1 + 0 = 1$. Ensuite $1 \times 0 = 0$. Donc $S = 0$.

La priorité usuelle place le NON avant le ET, et le ET avant le OU. Les parenthèses lèvent le doute, et il vaut mieux les écrire que de compter sur la mémoire de tout le monde.

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

`True or True` vaut `True`, parce que `or` est le OU inclusif. Un XOR des deux mêmes valeurs vaudrait `False`. En Python, `^` entre booléens fait ce XOR, mais dans les conditions on écrit `and`, `or` et `not`, qui se lisent.

## Pour s'entraîner

Les [exercices sur les booléens](/cours/2/donnees_booleens_exercices) demandent de construire des tables, pas seulement de les relire.
