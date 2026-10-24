---
title: Nombres réels en Binaire
description: Représentation en virgule fixe et flottante (IEEE754)
level: premiere
chapter: Représentation des données
icon: "\U0001F30A"
badgeId: premiere_reels
prerequisites:
  - donnees_entiers_positifs
audience: public
---

# Nombres réels en binaire

Un entier tombe juste sur un nombre fini de bits. Un réel, souvent non. On le code comme une notation scientifique, mais en base 2 :

$$N = (-1)^{S} \times m \times 2^{e}$$

$S$ est le signe, $m$ la **mantisse**, $e$ l'**exposant**. Mantisse et exposant tiennent sur un nombre **fini** de bits. Beaucoup de décimaux familiers, à commencer par $0{,}1$, n'ont donc pas de représentation exacte. Ce n'est pas un bug de Python. C'est le format.

## Après la virgule

À gauche de la virgule, les colonnes valent $2^0, 2^1, 2^2, \ldots$ À droite, ce sont les puissances négatives : $2^{-1} = 0{,}5$, $2^{-2} = 0{,}25$, $2^{-3} = 0{,}125$, et ainsi de suite.

$$0{,}75 = 0{,}5 + 0{,}25 = 0{,}11_{(2)}$$

Pour trouver les bits d'une partie décimale, on multiplie par 2. Le chiffre passé devant la virgule est le prochain bit. On recommence avec ce qui reste après la virgule.

| Étape | × 2 | Bit |
|:-----:|:---:|:---:|
| 0,75 | 1,5 | 1 |
| 0,5 | 1,0 | 1 |

On s'arrête quand la partie fractionnaire tombe à 0. Ainsi $14{,}75_{(10)} = 1110{,}11_{(2)}$ : $14$ s'écrit $1110$, et $0{,}75$ s'écrit $0{,}11$. Certains nombres ne s'arrêtent jamais. $0{,}1$ produit une suite infinie de bits, comme $1/3$ produit $0{,}333\ldots$ en décimal. Avec un nombre fini de bits, on coupe, donc on approxime.

## IEEE 754, simple précision

La norme **IEEE 754** fixe ce découpage. En simple précision, 32 bits : 1 bit de signe, 8 bits d'exposant, 23 bits de mantisse. Les `float` de Python sont en pratique des doubles précisions, 64 bits. Le principe est le même, les largeurs changent. L'exemple ci-dessous est le format 32 bits, plus court à écrire à la main.

| Signe (1) | Exposant (8) | Mantisse (23) |
|:---------:|:------------:|:-------------:|
| $S$ | $E$ (biais 127) | bits après le `1.` implicite |

On ne stocke pas l'exposant tel quel. On lui ajoute un **biais**, 127 en simple précision, pour coder aussi les exposants négatifs avec un entier positif. Et on **normalise** : on décale la virgule pour que le nombre s'écrive $1{,}\ldots \times 2^{e}$. Le `1` avant la virgule est implicite. On ne le range pas dans les 23 bits. On range seulement ce qui suit.

### $14{,}75$ pas à pas

1. Binaire : $1110{,}11_{(2)}$
2. Normaliser : $1{,}11011_{(2)} \times 2^{3}$
3. Signe : $S = 0$, le nombre est positif
4. Exposant biaisé : $E = 3 + 127 = 130 = 10000010_{(2)}$
5. Mantisse : les bits après le `1.` sont `11011`, complétés de zéros jusqu'à 23 bits

$$14{,}75 = \underbrace{0}_{S}\ \underbrace{10000010}_{E}\ \underbrace{11011000000000000000000}_{M}$$

Le biais de 127 ne concerne que l'exposant sur 8 bits. En double précision, l'exposant tient sur 11 bits et le biais vaut 1023. Même idée, autre constante.

## Ce que Python affiche vraiment

```python
>>> 0.1 + 0.2
0.30000000000000004

>>> (3.3 + 2.1) * 4.2
22.680000000000003
```

$0{,}1$ et $0{,}2$ ne sont pas exacts en binaire. Leur somme n'est pas exactement $0{,}3$. Comparer deux flottants avec `==` dit donc souvent « différent » pour deux résultats que le calcul décimal juge égaux. On compare à une tolérance, ou l'on passe par `Decimal` quand on veut une arithmétique décimale exacte, par exemple pour de l'argent.

```python
# Tolérance
abs((0.1 + 0.2) - 0.3) < 1e-9  # True

# Ou Decimal pour de l'arithmétique décimale exacte
from decimal import Decimal
Decimal("0.1") + Decimal("0.2") == Decimal("0.3")  # True
```

`Decimal("0.1")` part du texte `"0.1"`, donc du décimal que vous avez écrit. `Decimal(0.1)` partirait du flottant déjà arrondi : ce n'est pas la même chose.

Pour fermer : après la virgule, les poids sont $2^{-1}$, $2^{-2}$, et la suite. Un flottant, c'est un signe, un exposant et une mantisse, sur un nombre fini de bits. L'exposant est stocké avec un biais, 127 en simple précision. En Python, `float` suit IEEE 754 en double précision, 64 bits. On compare avec une tolérance, ou avec `Decimal` si le décimal doit tomber juste.

## Pour s'entraîner

[Exercices — données binaires](/cours/2/donnees_binaires_exercices)
