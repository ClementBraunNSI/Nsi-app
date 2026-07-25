---
title: Entiers Positifs en Binaire et Hexadécimal
description: Comprendre les systèmes de numération et les conversions entre bases
level: premiere
chapter: Représentation des données
icon: "\U0001F522"
badgeId: premiere_entiers_positifs
prerequisites: []
---

# Entiers positifs en binaire et hexadécimal

## Objectifs

- Comprendre ce qu'est une **base** de numération
- Convertir un entier **binaire ↔ décimal**
- Convertir un entier **décimal ↔ hexadécimal**
- Relier 4 bits à un chiffre hexadécimal

## Idée clé

Une machine ne « voit » que deux états (courant / pas de courant). On code donc les entiers avec **deux symboles** : 0 et 1. L'**hexadécimal** (16 symboles) sert surtout à écrire le binaire de façon compacte : **1 chiffre hex = 4 bits**.

## Bases et colonnes

Dans toute base $b$, chaque colonne vaut une puissance de $b$.

**Décimal (base 10)** — symboles $\{0,\ldots,9\}$ :

$$154_{(10)} = 1\times10^{2} + 5\times10^{1} + 4\times10^{0}$$

**Binaire (base 2)** — symboles $\{0,1\}$ :

$$1101_{(2)} = 1\times2^{3} + 1\times2^{2} + 0\times2^{1} + 1\times2^{0} = 13_{(10)}$$

Un chiffre binaire s'appelle un **bit** ; 8 bits forment un **octet**.

<BinaryPixelArt />

## Binaire → décimal

On additionne les puissances de 2 là où le bit vaut 1.

| $2^3$ | $2^2$ | $2^1$ | $2^0$ |
|:-----:|:-----:|:-----:|:-----:|
| 1 | 1 | 0 | 1 |

$$1101_{(2)} = 8 + 4 + 0 + 1 = 13_{(10)}$$

Toujours préciser la base si elle n'est pas évidente : $1101_{(2)}$, $13_{(10)}$.

## Décimal → binaire

### Divisions successives

On divise par 2 ; les **restes** lus **de bas en haut** donnent le binaire.

Exemple : $29_{(10)}$

```
29 ÷ 2 = 14  reste 1
14 ÷ 2 =  7  reste 0
 7 ÷ 2 =  3  reste 1
 3 ÷ 2 =  1  reste 1
 1 ÷ 2 =  0  reste 1
```

Résultat : $29_{(10)} = 11101_{(2)}$.

Vérification : $16+8+4+0+1 = 29$.

### Soustractions (puissances de 2)

On pose le plus grand $2^k$ ≤ au nombre, on met 1, on continue avec le reste.

Exemple : $42_{(10)}$ → $2^5=32$ oui, $2^4=16$ non, $2^3=8$ oui, $2^2=4$ non, $2^1=2$ oui, $2^0=1$ non.

$$42_{(10)} = 101010_{(2)}$$

## Hexadécimal

Base 16 : $\{0,\ldots,9,A,B,C,D,E,F\}$ (A = 10 … F = 15).

| Déc. | Hex | Binaire (4 bits) |
|:----:|:---:|:----------------:|
| 0 | 0 | 0000 |
| 10 | A | 1010 |
| 15 | F | 1111 |

**Astuce :** regrouper le binaire par paquets de 4 bits.

$$1111\,1111_{(2)} = \mathrm{FF}_{(16)} = 255_{(10)}$$

Conversion décimal → hex : divisions successives par **16**.

Exemple : $255 \div 16 = 15$ reste $15$ (F), puis $15 \div 16 = 0$ reste $15$ (F) → $\mathrm{FF}_{(16)}$.

## Piège fréquent

Oublier l'ordre de lecture des restes (divisions successives) : on lit **du dernier reste vers le premier**, pas l'inverse. Vérifier toujours en reconvertissant vers le décimal.

## À retenir

- Base $b$ = $b$ symboles ; valeur = somme des chiffres × puissances de $b$
- Binaire : colonnes $1, 2, 4, 8, 16, \ldots$
- Décimal → binaire : divisions par 2 (restes de bas en haut)
- 1 chiffre hex = 4 bits ; F = 15 = $1111_{(2)}$
- Toujours indiquer la base quand elle n'est pas claire
- Un octet = 8 bits

## Pour s'entraîner

[Exercices — données binaires](/cours/2/donnees_binaires_exercices)
