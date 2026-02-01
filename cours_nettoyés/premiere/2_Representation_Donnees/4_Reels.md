---
title: Nombres réels en Binaire
description: Représentation en virgule fixe et flottante (IEEE754)
level: Première
chapter: Représentation des données
icon: material/decimal-comma
---

# 🔢 Nombres réels en Binaire

## 💫 Les nombres réels en binaire

### 📖 Contexte

Après avoir représenté les **nombres entiers**, il est nécessaire de représenter les **nombres réels**, nombres dits décimaux ou à virgule.

Les nombres décimaux permettent de représenter des valeurs qui peuvent être analogiques :

- π (pi) ≈ 3.14159...
- Température : 36.7°C
- Altitude : 1847.5 mètres
- Coordonnées GPS : 48.8566° N

La représentation des nombres réels a été approchée de **plusieurs manières différentes**.

### ✏️ Écriture en binaire de la partie réelle

### 🔍 Principe

Pour écrire la partie réelle d'un nombre en binaire, on utilise les **puissances négatives de 2**.

**Rappel des puissances négatives :**

- $2^{-1} = 1/2 = 0,5$
- $2^{-2} = 1/4 = 0,25$
- $2^{-3} = 1/8 = 0,125$
- $2^{-4} = 1/16 = 0,0625$

### 📝 Exemple : 0,75 en binaire

```
0,75 = 0,5 + 0,25
     = 2⁻¹ + 2⁻²
     = 0,11₂
```

### 🔄 Méthode des multiplications successives

#### 📋 Algorithme

Pour convertir la partie décimale d'un nombre en binaire :

1. **Multiplier** la partie décimale par 2
2. Si le résultat ≥ 1 : écrire **1** et soustraire 1
3. Sinon : écrire **0**
4. **Répéter** avec la nouvelle partie décimale

#### 🎯 Exemple pratique : 14,75

**Partie entière :** $14_{10} = 1110_2$

**Partie décimale :** 0,75

| Partie décimale | Bit | Multiplication × 2 |
|:-:|:-:|:-:|
| 0,75 | - | 0,75 |
| **1**,5 | 1 | 0,5 |
| **1**,0 | 1 | 0,0 |

**Résultat final**

```
14,75₁₀ = 1110₂ + 0,11₂ = 1110,11₂
```

!!! warning "Attention"
    Certains nombres décimaux ne peuvent pas être représentés exactement en binaire (ex: 0,1 donne une suite infinie en binaire).

### 🧮 Test d'opération

#### 🔍 Vérification pratique

On a vu dans le cours précédent que pour qu'une représentation soit utilisable, elle doit permettre les **opérations sans erreurs**.

Faisons un test sur l'opération **14,75 + 1,25**.

#### 📝 Conversion de 1,25₁₀ en binaire

**Partie entière :** $1_{10} = 1_2$

**Partie décimale :** 0,25

| Partie décimale | Bit | Multiplication × 2 |
|:-:|:-:|:-:|
| 0,25 | - | 0,25 |
| **0**,5 | 0 | 0,5 |
| **1**,0 | 1 | 0,0 |
| **0**,0 | 0 | 0 |

**Résultat**

```
0,25₁₀ = 0,010₂
Donc : 1,25₁₀ = 1,010₂
```

#### 🧮 Vérification de l'opération

```
14,75₁₀ + 1,25₁₀ = 16₁₀
1110,110₂ + 1,010₂ = 10000,000₂ = 16₁₀ ✅
```

!!! info "Observation"
    Cette représentation fonctionne, mais les machines (ordinateurs et smartphones) n'utilisent pas cette méthode. Elles utilisent la méthode de la **virgule flottante**.

## 🏛️ La Norme IEEE754

### 📖 Principe général

La norme **IEEE754** permet de représenter les nombres réels en utilisant le principe de **virgule flottante**.

Cette norme permet d'écrire chaque nombre comme une **écriture scientifique** avec pour base 2.

Un nombre N s'écrit : $N = (-1)^S \times m \times 2^n$ avec $m \in [1;2[$

#### 🏗️ Structure IEEE754 (32 bits - simple précision)

```
S E E E E E E E E M M M M M M M M M M M M M M M M M M M M M M M
```

- **S** = **Signe** (1 bit) : 0 = positif, 1 = négatif
- **E** = **Exposant** (8 bits) : puissance de 2 (biaisée de 127)
- **M** = **Mantisse** (23 bits) : partie fractionnaire

#### 🎯 Exemple : 14,75 en IEEE754

**Étape 1 : Représenter en base 2**

$14_{10} = 1110,110_2$

**Étape 2 : Écriture scientifique**

$1110,110_2 = 1,110110_2 \times 2^3$

**Résultat :** s=0, m=110110₂, n=3

#### 🔧 Calcul des composants

**Étape 3 : Exposant biaisé**

E = n + 127 = 3 + 127 = 130
$130_{10} = 10000010_2$

**Étape 4 : Assemblage final**

$14,75_{10} = 0 \ 10000010 \ 11011000000000000000000$

## ⚠️ Problème d'imprécision des flottants

### 🚨 Limitation importante

La représentation des nombres réels en binaire peut poser des **problèmes d'imprécision**.

Certains nombres décimaux ne peuvent pas être représentés **exactement** en binaire.

Par exemple, le nombre **0,1** en décimal ne peut pas être représenté exactement en binaire.

### 🐍 Exemple en Python

#### Démonstration du problème

```python
>>> 0.1 + 0.2
0.30000000000000004

>>> a = 3.3
>>> b = 2.1
>>> c = 4.2
>>> (a+b)*c
22.680000000000003
>>> a*c + b*c
22.68
```

Ce problème est dû au fait que **0,1** et **0,2** ne peuvent pas être représentés exactement en binaire.

### 🔧 Solutions pratiques

**Solution 1 : Bibliothèque decimal**

```python
from decimal import Decimal

a = Decimal('0.1')
b = Decimal('0.2')
print(a + b)  # 0.3
print(a + b == Decimal('0.3'))  # True
```

**Solution 2 : Tolérance pour comparaisons**

```python
def almost_equal(a, b, tolerance=1e-9):
    return abs(a - b) < tolerance

print(almost_equal(0.1 + 0.2, 0.3))  # True
```

!!! tip "Conseil"
    Toujours être prudent avec les comparaisons de nombres flottants et utiliser des méthodes appropriées selon le contexte d'application.
