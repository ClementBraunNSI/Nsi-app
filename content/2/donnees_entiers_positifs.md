---
title: Entiers Positifs en Binaire et Hexadécimal
description: Comprendre les systèmes de numération et les conversions entre bases
level: premiere
chapter: Représentation des données
icon: "hash"
badgeId: premiere_entiers_positifs
prerequisites: []
audience: public
groupe: binaire-hexadecimal
groupeTitre: "Entiers en binaire et hexadécimal"
---

# Entiers positifs en binaire et hexadécimal

Une machine ne distingue que deux états : le courant passe, ou il ne passe pas. On code donc les entiers avec deux symboles, 0 et 1. Le **binaire** est cette écriture. L'**hexadécimal**, seize symboles, sert surtout à la raccourcir : un chiffre hexadécimal remplace exactement quatre bits. Avant de convertir, il faut voir ce qu'est une base.

## Une base, des colonnes

Dans une base $b$, on dispose de $b$ symboles, et chaque colonne vaut une puissance de $b$. En **décimal**, base 10, les symboles vont de 0 à 9.

$$154_{(10)} = 1\times10^{2} + 5\times10^{1} + 4\times10^{0}$$

Le 1 pèse cent, le 5 pèse dix, le 4 pèse un. En **binaire**, base 2, les symboles sont 0 et 1, et les colonnes valent $1, 2, 4, 8, 16, \ldots$

$$1101_{(2)} = 1\times2^{3} + 1\times2^{2} + 0\times2^{1} + 1\times2^{0} = 13_{(10)}$$

Un chiffre binaire s'appelle un **bit**. Huit bits forment un **octet**. On écrit la base en indice dès qu'elle n'est pas évidente : $1101_{(2)}$ n'est pas mille cent un.

<BinaryPixelArt />

## Du binaire vers le décimal

On additionne les puissances de 2 là où le bit vaut 1. Les zéros ne pèsent rien.

| $2^3$ | $2^2$ | $2^1$ | $2^0$ |
|:-----:|:-----:|:-----:|:-----:|
| 1 | 1 | 0 | 1 |

$$1101_{(2)} = 8 + 4 + 0 + 1 = 13_{(10)}$$

La colonne de droite est toujours $2^0 = 1$. On lit les poids de droite à gauche en les doublant.

## Du décimal vers le binaire

Deux méthodes arrivent au même endroit. La première, les **divisions successives** par 2, est la plus mécanique. On note le reste à chaque étape, et on lit les restes **du dernier vers le premier**.

Exemple : $29_{(10)}$

```
29 ÷ 2 = 14  reste 1
14 ÷ 2 =  7  reste 0
 7 ÷ 2 =  3  reste 1
 3 ÷ 2 =  1  reste 1
 1 ÷ 2 =  0  reste 1
```

Le dernier reste est le bit de poids fort. Résultat : $29_{(10)} = 11101_{(2)}$. On vérifie en revenant au décimal : $16 + 8 + 4 + 0 + 1 = 29$. Lire les restes dans l'ordre où on les a calculés, de haut en bas, donne le miroir du nombre. C'est l'erreur la plus fréquente du chapitre.

L'autre méthode pose les puissances de 2. On cherche le plus grand $2^k$ inférieur ou égal au nombre, on met un 1 dans cette colonne, on soustrait, et on recommence. Pour $42_{(10)}$ : $2^5 = 32$ tient, $2^4 = 16$ ne tient pas dans le reste 10, $2^3 = 8$ tient, $2^2 = 4$ ne tient pas dans le reste 2, $2^1 = 2$ tient, $2^0 = 1$ ne tient plus.

$$42_{(10)} = 101010_{(2)}$$

Vérification : $32 + 8 + 2 = 42$.

## L'hexadécimal, quatre bits d'un coup

La base 16 utilise les symboles $\{0,\ldots,9,A,B,C,D,E,F\}$. A vaut 10, F vaut 15. Comme $16 = 2^4$, chaque chiffre hexadécimal correspond à un paquet de quatre bits.

| Déc. | Hex | Binaire (4 bits) |
|:----:|:---:|:----------------:|
| 0 | 0 | 0000 |
| 10 | A | 1010 |
| 15 | F | 1111 |

On regroupe donc le binaire par paquets de quatre, en partant de la droite, et on traduit chaque paquet.

$$1111\,1111_{(2)} = \mathrm{FF}_{(16)} = 255_{(10)}$$

Dans l'autre sens, du décimal vers l'hexadécimal, ce sont des divisions successives par **16**, et on lit encore les restes de bas en haut. $255 \div 16 = 15$ reste $15$, qu'on écrit F. Puis $15 \div 16 = 0$ reste $15$, encore F. D'où $\mathrm{FF}_{(16)}$.

Pour fermer : une base $b$ a $b$ symboles, et la valeur d'une écriture est la somme des chiffres multipliés par les puissances de $b$. En binaire, les colonnes doublent. Du décimal vers le binaire, on divise par 2 et on lit les restes du dernier au premier. Un chiffre hexadécimal vaut quatre bits, et F vaut $1111_{(2)}$. Un octet, ce sont huit bits. On indique la base dès qu'un lecteur pourrait se tromper.

## Pour s'entraîner

[Exercices : données binaires](/cours/2/donnees_binaires_exercices)
