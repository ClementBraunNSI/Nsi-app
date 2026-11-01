---
title: Nombres réels en Binaire
description: Représentation en virgule fixe et flottante (IEEE754)
level: premiere
chapter: Représentation des données
icon: "waves"
badgeId: premiere_reels
prerequisites:
  - donnees_entiers_positifs
audience: public
---

# Nombres réels en binaire

Un entier peut toujours être codé exactement avec assez de bits, mais ce n'est souvent pas le cas d'un réel. On code les réels avec une sorte de notation scientifique en base 2 :

$$N = (-1)^{S} \times m \times 2^{e}$$

$S$ est le signe, $m$ la **mantisse** et $e$ l'**exposant**. La mantisse et l'exposant sont codés sur un nombre **fini** de bits. C'est pourquoi beaucoup de nombres décimaux courants, à commencer par $0{,}1$, n'ont pas de représentation exacte. Il ne s'agit pas d'un bug de Python, mais d'une conséquence de ce format.

## La partie après la virgule

À gauche de la virgule, les colonnes valent $2^0, 2^1, 2^2, \ldots$ À droite, ce sont les puissances négatives : $2^{-1} = 0{,}5$, $2^{-2} = 0{,}25$, $2^{-3} = 0{,}125$, et ainsi de suite.

$$0{,}75 = 0{,}5 + 0{,}25 = 0{,}11_{(2)}$$

Pour trouver les bits d'une partie décimale, on multiplie par 2. Le chiffre passé devant la virgule est le prochain bit. On recommence avec ce qui reste après la virgule.

| Étape | × 2 | Bit |
|:-----:|:---:|:---:|
| 0,75 | 1,5 | 1 |
| 0,5 | 1,0 | 1 |

On s'arrête quand la partie fractionnaire tombe à 0. Ainsi $14{,}75_{(10)} = 1110{,}11_{(2)}$ : $14$ s'écrit $1110$, et $0{,}75$ s'écrit $0{,}11$. Certains nombres ne s'arrêtent jamais. $0{,}1$ produit une suite infinie de bits, comme $1/3$ produit $0{,}333\ldots$ en décimal. Avec un nombre fini de bits, il faut couper cette suite, ce qui donne une valeur approchée.

## La norme IEEE 754

La norme **IEEE 754** fixe ce découpage. En simple précision, sur 32 bits, elle utilise 1 bit de signe, 8 bits d'exposant et 23 bits de mantisse. Les `float` de Python sont en pratique en double précision, sur 64 bits : le principe est le même, seules les largeurs changent. L'exemple ci-dessous est le format 32 bits, plus court à écrire à la main.

| Signe (1) | Exposant (8) | Mantisse (23) |
|:---------:|:------------:|:-------------:|
| $S$ | $E$ (biais 127) | bits après le `1.` implicite |

L'exposant n'est pas stocké tel quel : on lui ajoute un **biais**, 127 en simple précision, pour pouvoir coder aussi les exposants négatifs avec un entier positif. Le nombre est également **normalisé**, c'est-à-dire que la virgule est décalée pour qu'il s'écrive $1{,}\ldots \times 2^{e}$. Le `1` placé avant la virgule est implicite : il n'est pas rangé dans les 23 bits, qui ne contiennent que les chiffres qui le suivent.

### $14{,}75$ pas à pas

1. Binaire : $1110{,}11_{(2)}$
2. Normaliser : $1{,}11011_{(2)} \times 2^{3}$
3. Signe : $S = 0$, le nombre est positif
4. Exposant biaisé : $E = 3 + 127 = 130 = 10000010_{(2)}$
5. Mantisse : les bits après le `1.` sont `11011`, complétés de zéros jusqu'à 23 bits

$$14{,}75 = \underbrace{0}_{S}\ \underbrace{10000010}_{E}\ \underbrace{11011000000000000000000}_{M}$$

Le biais de 127 ne concerne que l'exposant sur 8 bits. En double précision, l'exposant tient sur 11 bits et le biais vaut 1023.

## Ce que Python affiche vraiment

```python
>>> 0.1 + 0.2
0.30000000000000004

>>> (3.3 + 2.1) * 4.2
22.680000000000003
```

$0{,}1$ et $0{,}2$ ne sont pas exacts en binaire. Leur somme n'est donc pas exactement $0{,}3$. Comparer deux flottants avec `==` peut ainsi indiquer qu'ils sont différents alors que le calcul décimal les donne égaux. On les compare plutôt avec une tolérance, ou bien on utilise `Decimal` quand on a besoin d'une arithmétique décimale exacte, par exemple pour des sommes d'argent.

```python
# Tolérance
abs((0.1 + 0.2) - 0.3) < 1e-9  # True

# Ou Decimal pour de l'arithmétique décimale exacte
from decimal import Decimal
Decimal("0.1") + Decimal("0.2") == Decimal("0.3")  # True
```

`Decimal("0.1")` part du texte `"0.1"`, donc du décimal écrit. `Decimal(0.1)` partirait du flottant déjà arrondi : ce n'est pas la même chose.

En résumé, après la virgule, les poids des chiffres sont $2^{-1}$, $2^{-2}$, et ainsi de suite. Un flottant est formé d'un signe, d'un exposant et d'une mantisse, codés sur un nombre fini de bits. L'exposant est stocké avec un biais, 127 en simple précision. En Python, `float` suit la norme IEEE 754 en double précision, c'est-à-dire sur 64 bits. Pour comparer des flottants, on utilise une tolérance, ou `Decimal` si le calcul décimal doit être exact.

## Pour s'entraîner

[Exercices : données binaires](/cours/2/donnees_binaires_exercices)
