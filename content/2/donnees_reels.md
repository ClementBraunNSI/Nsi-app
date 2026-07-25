---
title: Nombres réels en Binaire
description: Représentation en virgule fixe et flottante (IEEE754)
level: premiere
chapter: Représentation des données
icon: "\U0001F30A"
badgeId: premiere_reels
prerequisites:
  - donnees_entiers_positifs
---

# Nombres réels en binaire

## Objectifs

- Écrire une partie fractionnaire avec les puissances négatives de 2
- Comprendre le principe de la **virgule flottante** (IEEE 754)
- Identifier les **pièges** des flottants en Python

## Idée clé

Un réel se code souvent comme en notation scientifique, mais en base 2 :

$$N = (-1)^{S} \times m \times 2^{e}$$

La mantisse $m$ et l'exposant $e$ sont stockés sur un nombre **fini** de bits : beaucoup de décimaux (comme $0{,}1$) n'ont donc **pas** de représentation exacte.

## Partie fractionnaire en binaire

Après la virgule : $2^{-1}=0{,}5$, $2^{-2}=0{,}25$, $2^{-3}=0{,}125$, …

Exemple : $0{,}75 = 0{,}5 + 0{,}25 = 0{,}11_{(2)}$.

**Méthode** (partie décimale) : multiplier par 2 ; le chiffre avant la virgule est le prochain bit ; recommencer avec la partie fractionnaire.

| Étape | × 2 | Bit |
|:-----:|:---:|:---:|
| 0,75 | 1,5 | 1 |
| 0,5 | 1,0 | 1 |

Ainsi $14{,}75_{(10)} = 1110{,}11_{(2)}$.

Certains nombres (ex. $0{,}1$) donnent une suite **infinie** de bits → impossible à stocker exactement.

## IEEE 754 (simple précision, 32 bits)

Format courant des `float` (souvent 64 bits en pratique ; le principe est le même).

| Signe (1) | Exposant (8) | Mantisse (23) |
|:---------:|:------------:|:-------------:|
| $S$ | $E$ (biais 127) | bits après le `1.` implicite |

### Exemple travaillé : $14{,}75$

1. Binaire : $1110{,}11_{(2)}$
2. Normaliser : $1{,}11011_{(2)} \times 2^{3}$
3. Signe $S = 0$ (positif)
4. Exposant biaisé : $E = 3 + 127 = 130 = 10000010_{(2)}$
5. Mantisse : bits après le `1.` → `11011` puis compléter avec des 0

$$14{,}75 = \underbrace{0}_{S}\ \underbrace{10000010}_{E}\ \underbrace{11011000000000000000000}_{M}$$

## Pièges des flottants en Python

```python
>>> 0.1 + 0.2
0.30000000000000004

>>> (3.3 + 2.1) * 4.2
22.680000000000003
```

Cause : $0{,}1$ et $0{,}2$ ne sont pas exacts en binaire. Conséquence : **ne pas comparer** des flottants avec `==` sans précaution.

```python
# Tolérance
abs((0.1 + 0.2) - 0.3) < 1e-9  # True

# Ou Decimal pour de l'arithmétique décimale exacte
from decimal import Decimal
Decimal("0.1") + Decimal("0.2") == Decimal("0.3")  # True
```

## Piège fréquent

Croire que `0.1 + 0.2 == 0.3` est vrai « en maths donc en machine ». En flottant binaire, c'est souvent faux : ce n'est pas un bug Python, c'est la norme IEEE 754.

## À retenir

- Après la virgule : puissances $2^{-1}$, $2^{-2}$, …
- Virgule flottante = signe + exposant + mantisse
- IEEE 754 stocke un nombre fini de bits → approximations
- Exposant stocké avec un **biais** (127 en simple précision)
- En Python, `float` ≈ IEEE 754 double (64 bits)
- Comparer avec une tolérance, ou utiliser `Decimal` si besoin d'exactitude décimale

## Pour s'entraîner

[Exercices — données binaires](/cours/2/donnees_binaires_exercices)
