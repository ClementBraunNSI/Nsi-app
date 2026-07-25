---
title: Représentation des caractères
description: Codage ASCII et Unicode (UTF-8)
level: premiere
chapter: Représentation des données
icon: "\U0001F524"
badgeId: premiere_caracteres
prerequisites:
  - donnees_entiers_positifs
---

# Représentation des caractères

## Objectifs

- Comprendre qu'un caractère est un **entier** associé à un symbole
- Connaître les limites d'**ASCII** (7 bits)
- Situer **Unicode** / **UTF-8** comme standard actuel

## Idée clé

La machine ne stocke que des bits. Un caractère est donc un **code numérique** (souvent affiché en décimal ou hexadécimal) relié à un glyphe : « A », « é », « 字 », etc. Le système de règles qui fait ce lien s'appelle un **codage**.

## Qu'est-ce qu'un caractère ?

Lettre, chiffre, ponctuation, symbole, emoji… Pour la machine, c'est un **nombre**.

Exemple : en ASCII / Unicode, la lettre **A** a le code **65** ($41_{(16)}$).

## ASCII (7 bits)

**ASCII** (*American Standard Code for Information Interchange*) code un caractère sur **7 bits** → $2^7 = 128$ symboles.

Cela couvre notamment :

- lettres latines a–z, A–Z
- chiffres 0–9
- ponctuation et caractères de contrôle (espace, retour à la ligne…)

| Caractère | Décimal | Hex |
|:---------:|:-------:|:---:|
| espace | 32 | 20 |
| `0` | 48 | 30 |
| `@` | 64 | 40 |
| `A` | 65 | 41 |
| `a` | 97 | 61 |

**Limite :** pas d'accents français (`é`), ni d'alphabets non latins. D'où l'extension vers Unicode.

## Unicode et UTF-8

**Unicode** attribue à chaque symbole un **point de code** unique, noté souvent `U+XXXX` (hexadécimal).

Exemples :

- `A` → U+0041
- `é` → U+00E9
- `字` → U+5B57

**UTF-8** est un **encodage** de ces points de code en une suite d'**octets** (1 à 4 octets selon le caractère). C'est le format dominant sur le Web et en Python.

- Les caractères ASCII restent sur **1 octet** (compatibilité)
- Les caractères plus « riches » prennent plusieurs octets

```python
>>> ord("A")
65
>>> hex(ord("é"))
'0xe9'
>>> "é".encode("utf-8")
b'\xc3\xa9'   # deux octets en UTF-8
```

Table de référence : [charset.org/utf-8](https://www.charset.org/utf-8)

## Piège fréquent

Confondre **point de code Unicode** et **suite d'octets UTF-8**. Le point de code de `é` est U+00E9 ; en UTF-8, ce n'est pas un seul octet `E9`, mais `\xc3\xa9`.

## À retenir

- Caractère = symbole ↔ nombre (code)
- ASCII : 7 bits, 128 caractères, alphabet latin de base
- Unicode : catalogue universel de points de code
- UTF-8 : encodage variable (1 à 4 octets), compatible ASCII
- En Python : `ord`, `chr`, `.encode("utf-8")`
- Toujours connaître l'encodage d'un fichier texte (UTF-8 de préférence)

## Pour s'entraîner

[Exercices — données binaires](/cours/2/donnees_binaires_exercices)
