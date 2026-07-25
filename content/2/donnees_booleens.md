---
title: Booléens et Fonctions booléennes
description: L'algèbre de George Boole et la logique binaire
level: premiere
chapter: Représentation des données
icon: "\U0001F4A1"
badgeId: premiere_booleens
prerequisites: []
---

# Booléens et fonctions booléennes

## Objectifs

- Définir une variable et une fonction booléenne
- Lire et construire une **table de vérité**
- Utiliser NOT, AND, OR, XOR (et les opérateurs Python)

## Idée clé

Un booléen ne prend que deux valeurs : **Vrai / Faux** (ou **1 / 0**). En machine, cela correspond à la présence ou non d'un signal. Les **portes logiques** et une grande partie des conditions en programmation reposent sur ces opérations.

## Variables et tables de vérité

**Variable booléenne** : `True` ou `False` (1 ou 0).

**Fonction booléenne** : prend une ou plusieurs variables booléennes et renvoie un booléen.

La **table de vérité** liste toutes les combinaisons d'entrées et le résultat associé.

## Les quatre opérations de base

### NOT (non) — $\overline{a}$ ou `not`

| a | s |
|:-:|:-:|
| 0 | 1 |
| 1 | 0 |

### AND (et) — $a \cdot b$ ou `and`

Vrai **seulement** si les deux entrées sont vraies.

| a | b | s |
|:-:|:-:|:-:|
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

### OR (ou) — $a + b$ ou `or`

Vrai si **au moins une** entrée est vraie.

| a | b | s |
|:-:|:-:|:-:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

### XOR (ou exclusif) — $a \oplus b$

Vrai si **exactement une** entrée est vraie.

| a | b | s |
|:-:|:-:|:-:|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

## Évaluer une expression

Notation classique : $+$ pour OU, $\times$ (ou $\cdot$) pour ET, barre pour NON.

Exemple : $S = (a + b) \times c$ avec $a=1$, $b=0$, $c=0$.

1. $a + b = 1 + 0 = 1$
2. $1 \times 0 = 0$
3. $S = 0$

Priorité usuelle : NON > ET > OU (les parenthèses clarifient toujours).

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

| Math / logique | Python |
|---|---|
| ET | `and` |
| OU | `or` |
| NON | `not` |

## Piège fréquent

Confondre **OU** et **XOR** : avec OR, `True or True` vaut `True` ; avec XOR, ce serait `False`. En Python, `^` sur des booléens fait un XOR, mais on utilise surtout `and` / `or` / `not`.

## À retenir

- Booléen = deux états (Vrai/Faux ou 1/0)
- Table de vérité = toutes les combinaisons d'entrées
- AND : les deux à 1 ; OR : au moins un à 1 ; XOR : exactement un à 1
- NOT inverse une valeur
- En Python : `and`, `or`, `not` (et `True` / `False`)
- Les parenthèses évitent les ambiguïtés de priorité

## Pour s'entraîner

[Exercices — booléens](/cours/2/donnees_booleens_exercices)
