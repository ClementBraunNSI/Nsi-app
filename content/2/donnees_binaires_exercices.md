---
title: Exercices Binaire et Hexadécimal
description: >-
  Exercices sur la représentation des nombres en binaire et hexadécimal,
  opérations arithmétiques et complément à deux.
level: premiere
chapter: Représentation des données
icon: "\U0001F4BE"
badgeId: premiere_fiche_exercices_binaires
prerequisites:
  - donnees_booleens_exercices
---


# 🔢 Fiche d'exercices : Binaire et Hexadécimal

Cette fiche couvre les conversions entre bases, les opérations arithmétiques binaires, le complément à deux et l'implémentation de conversions en Python.

<ExerciseTabs courseId="premiere_fiche_exercices_binaires" courseTitle="Exercices Binaire et Hexadécimal">

<ExerciseSection title="1. Conversions de base" difficulty="easy">
<Enonce>

**1. Conversion Binaire vers Décimal**
Convertissez les nombres suivants en décimal :
- $1101_{2}$
- $10101_{2}$
- $111000_{2}$
- $10010_{2}$
- $110110_{2}$

**2. Conversion Décimal vers Binaire**
Convertissez les nombres suivants en binaire :
- $13_{10}$
- $42_{10}$
- $255_{10}$
- $76_{10}$
- $128_{10}$

**3. Conversions avec l'Hexadécimal**
- Convertir en hexadécimal : $30_{10}$, $75_{10}$, $128_{10}$, $255_{10}$
- Convertir en décimal : $1A_{16}$, $3F_{16}$, $7D_{16}$, $2A_{16}$

</Enonce>
<Correction>

```python
# 1. Binaire -> Décimal
# 1101 = 8 + 4 + 1 = 13
# 10101 = 16 + 4 + 1 = 21
# 111000 = 32 + 16 + 8 = 56
# 10010 = 16 + 2 = 18
# 110110 = 32 + 16 + 4 + 2 = 54

# 2. Décimal -> Binaire
# 13 = 8 + 4 + 1 = 1101
# 42 = 32 + 8 + 2 = 101010
# 255 = 11111111 (8 bits à 1)
# 76 = 64 + 8 + 4 = 1001100
# 128 = 10000000

# 3. Hexadécimal
# 30 -> 1E (16 + 14)
# 75 -> 4B (4*16 + 11)
# 128 -> 80 (8*16 + 0)
# 255 -> FF (15*16 + 15)

# 1A -> 16 + 10 = 26
# 3F -> 3*16 + 15 = 48 + 15 = 63
# 7D -> 7*16 + 13 = 112 + 13 = 125
# 2A -> 2*16 + 10 = 32 + 10 = 42
```

</Correction>
<Verification>

```python
# Vérification avec Python
assert int('1101', 2) == 13
assert int('10101', 2) == 21
assert int('111000', 2) == 56
assert int('10010', 2) == 18
assert int('110110', 2) == 54

assert bin(13) == '0b1101'
assert bin(42) == '0b101010'
assert bin(255) == '0b11111111'
assert bin(76) == '0b1001100'
assert bin(128) == '0b10000000'

assert hex(30) == '0x1e'
assert hex(75) == '0x4b'
assert hex(128) == '0x80'
assert hex(255) == '0xff'

assert int('1A', 16) == 26
assert int('3F', 16) == 63
assert int('7D', 16) == 125
assert int('2A', 16) == 42
```

</Verification>
</ExerciseSection>

<ExerciseSection title="2. Opérations Binaires" difficulty="medium">
<Enonce>

Effectuez les opérations suivantes sans convertir en décimal (posez les opérations) :

**Additions :**
1. $1101_{2} + 101_{2}$
2. $10000_{2} + 1101_{2}$
3. $1111_{2} + 10_{2}$

**Soustractions :**
1. $1101_{2} - 101_{2}$
2. $10000_{2} - 1101_{2}$

**Multiplications :**
1. $1101_{2} \times 101_{2}$
2. $1111_{2} \times 10_{2}$

</Enonce>
<Correction>

```text
Additions :
  1101      10000       1111
+  101    +  1101    +    10
------    -------    -------
 10010      11101      10001
 (18)       (29)       (17)

Soustractions :
  1101      10000
-  101    -  1101
------    -------
  1000       0011
  (8)        (3)

Multiplications :
   1101          1111
 x  101        x   10
 ------        ------
   1101         11110
  0000.         (30)
 1101..
 ------
1000001
 (65)
```

</Correction>
<Verification>

```python
# Vérification des opérations
assert 0b1101 + 0b101 == 0b10010
assert 0b10000 + 0b1101 == 0b11101
assert 0b1111 + 0b10 == 0b10001

assert 0b1101 - 0b101 == 0b1000
assert 0b10000 - 0b1101 == 0b0011

assert 0b1101 * 0b101 == 0b1000001
assert 0b1111 * 0b10 == 0b11110
```

</Verification>
</ExerciseSection>

<ExerciseSection title="3. Complément à deux" difficulty="important">
<Enonce>

**1. Trouver le complément à deux (sur 8 bits) des nombres binaires suivants :**
- $0110\ 0101_{2}$
- $0001\ 1110_{2}$

**2. Décimal vers Complément à Deux (8 bits) :**
Convertissez les nombres négatifs suivants :
- $-5_{10}$
- $-18_{10}$
- $-128_{10}$

**3. Complément à Deux vers Décimal :**
Convertissez les nombres binaires (signés sur 8 bits) en décimal :
- $1111\ 1011_{2}$
- $1110\ 1110_{2}$

</Enonce>
<Correction>

```text
1. Complément à deux (Inverser + 1) :
- 0110 0101 -> Inv: 1001 1010 -> +1: 1001 1011
- 0001 1110 -> Inv: 1110 0001 -> +1: 1110 0010

2. Décimal vers C2 :
- 5 = 0000 0101 -> Inv: 1111 1010 -> +1: 1111 1011 (-5)
- 18 = 0001 0010 -> Inv: 1110 1101 -> +1: 1110 1110 (-18)
- 128 : Cas limite sur 8 bits (-128 est 1000 0000)

3. C2 vers Décimal :
- 1111 1011 est négatif.
  Inv: 0000 0100 -> +1: 0000 0101 (5) -> Donc -5
- 1110 1110 est négatif.
  Inv: 0001 0001 -> +1: 0001 0010 (18) -> Donc -18
```

</Correction>
<Verification>

```python
def int_to_c2_8bit(n):
    return n & 0xff

def c2_8bit_to_int(n):
    if n & 0x80:
        return n - 0x100
    return n

# Vérification
assert int_to_c2_8bit(-5) == 0b11111011
assert int_to_c2_8bit(-18) == 0b11101110
assert c2_8bit_to_int(0b11111011) == -5
assert c2_8bit_to_int(0b11101110) == -18
```

</Verification>
</ExerciseSection>

<ExerciseSection title="4. Implémentation Python" difficulty="hard">
<Enonce>

**Exercice 1 :**
Implémentez la fonction `base10_vers_binaire(n: int) -> str` qui convertit un entier positif en sa représentation binaire (sous forme de chaîne, sans le préfixe '0b').
Utilisez l'algorithme des divisions successives.

**Exercice 2 :**
Implémentez la fonction `binaire_vers_base10(binaire: str) -> int` qui convertit une chaîne binaire en entier.

</Enonce>
<Correction>

```python
def base10_vers_binaire(n: int) -> str:
    """Convertit un entier en binaire (str)."""
    if n == 0:
        return "0"
    
    resultat = ""
    while n > 0:
        reste = n % 2
        resultat = str(reste) + resultat
        n = n // 2
    return resultat

def binaire_vers_base10(binaire: str) -> int:
    """Convertit une chaîne binaire en entier."""
    resultat = 0
    puissance = 0
    # On parcourt la chaîne de droite à gauche
    for bit in reversed(binaire):
        if bit == '1':
            resultat += 2 ** puissance
        puissance += 1
    return resultat
```

</Correction>
<Verification>

```python
assert base10_vers_binaire(13) == "1101"
assert base10_vers_binaire(42) == "101010"
assert base10_vers_binaire(0) == "0"
assert base10_vers_binaire(255) == "11111111"

assert binaire_vers_base10("1101") == 13
assert binaire_vers_base10("101010") == 42
assert binaire_vers_base10("0") == 0
assert binaire_vers_base10("11111111") == 255
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
