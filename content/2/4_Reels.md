---
title: Nombres réels en Binaire
description: Représentation des nombres à virgule flottante et norme IEEE754
level: premiere
chapter: "Représentation des données"
icon: wave-square
---

# Nombres réels en Binaire

## Les nombres réels en binaire

Après avoir représenté les **nombres entiers**, il est nécessaire de représenter les **nombres réels** (décimaux ou à virgule).
Exemples : $\pi$, température (36.7°C), coordonnées GPS.

## Écriture en binaire de la partie réelle

Pour écrire la partie réelle d'un nombre en binaire, on utilise les **puissances négatives de 2**.

*   $2^{-1} = 1/2 = 0,5$
*   $2^{-2} = 1/4 = 0,25$
*   $2^{-3} = 1/8 = 0,125$
*   $2^{-4} = 1/16 = 0,0625$

**Exemple : 0,75 en binaire**
$0,75 = 0,5 + 0,25 = 2^{-1} + 2^{-2} = 0,11_{2}$

### Méthode des multiplications successives

Pour convertir la partie décimale d'un nombre en binaire :
1.  **Multiplier** la partie décimale par 2.
2.  Si le résultat ≥ 1 : écrire **1** et soustraire 1 (garder la partie décimale).
3.  Sinon : écrire **0**.
4.  **Répéter** avec la nouvelle partie décimale.

**Exemple : 14,75**
Partie entière : $14_{10} = 1110_{2}$
Partie décimale : 0,75

| Partie décimale | Bit | Multiplication × 2 |
|---|---|---|
| 0,75 | - | 0,75 |
| **1**,5 | 1 | 0,5 |
| **1**,0 | 1 | 0,0 |

Résultat final : $14,75_{10} = 1110,11_{2}$

> **Attention :** Certains nombres décimaux ne peuvent pas être représentés exactement en binaire (ex: 0,1 donne une suite infinie en binaire).

## La Norme IEEE754

La norme **IEEE754** permet de représenter les nombres réels en utilisant le principe de **virgule flottante**.
Cette norme permet d'écrire chaque nombre comme une **écriture scientifique** avec pour base 2.

Un nombre N s'écrit : **$N = (-1)^S \times m \times 2^n$** avec $m \in [1;2[$

### Structure IEEE754 (32 bits - simple précision)

*   **S (Signe)** : 1 bit (0 = positif, 1 = négatif)
*   **E (Exposant)** : 8 bits (puissance de 2 biaisée de 127)
*   **M (Mantisse)** : 23 bits (partie fractionnaire)

**Exemple : 14,75 en IEEE754**

1.  **Représenter en base 2 :** $14_{10} = 1110,110_{2}$
2.  **Écriture scientifique :** $1110,110_{2} = 1,110110_{2} \times 2^{3}$
    *   Signe : positif donc S = 0
    *   Exposant : 3
    *   Mantisse : partie après la virgule : 110110
3.  **Exposant biaisé :** $E = n + 127 = 3 + 127 = 130$.
    $130_{10} = 10000010_{2}$
4.  **Assemblage final :**
    0 10000010 11011000000000000000000

## Problème d'imprécision des flottants

La représentation des nombres réels en binaire peut poser des **problèmes d'imprécision**. Certains nombres décimaux (comme 0,1) ne peuvent pas être représentés **exactement**.

**Exemple en Python :**
```python
>>> 0.1 + 0.2
0.30000000000000004
```

**Solutions pratiques :**
1.  Utiliser la bibliothèque `decimal` pour une précision arbitraire.
2.  Utiliser une tolérance pour les comparaisons (`abs(a - b) < tolerance`).
