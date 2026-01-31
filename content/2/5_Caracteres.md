---
title: La représentation des caractères
description: Codage et encodage des symboles textuels (ASCII, Unicode)
level: premiere
chapter: "Représentation des données"
icon: font
---

# La représentation des caractères

## Définition

Un caractère est un **symbole** d'écriture représentant en général :
*   Une **lettre** (A, b, C)
*   Un **chiffre** (1, 2, 3, ...)
*   Un **symbole** (字, Д, @, #)

> **Problème informatique :** En informatique, on ne peut pas représenter directement un caractère car **elle ne comprend que des 0 et des 1**. Il faut donc les coder pour la machine.

**Le codage d'un caractère** est une association entre celui-ci et une représentation binaire.

## ASCII (American Standard Code for Information Interchange)

L'**ASCII** est un codage qui utilise **7 bits** pour représenter des caractères alpha-numériques et d'autres caractères réservés.
En ayant 7 bits, on peut représenter **$2^7 = 128$ caractères**.

Cela inclut :
*   26 lettres minuscules (a-z)
*   26 lettres majuscules (A-Z)
*   10 chiffres (0-9)
*   Symboles de ponctuation
*   Caractères de contrôle

**Exemples de codes ASCII :**
*   **A** : 65
*   **a** : 97
*   **0** : 48
*   **@** : 64
*   **(espace)** : 32

> **Limitation d'ASCII :** Il n'y a que des symboles d'**alphabets latins**. Il manque les caractères accentués, le cyrillique, le chinois, etc.

## Unicode - Le standard universel

**Unicode** est un système de codage de caractère universel.
On utilise souvent le système **UTF-8** qui utilise 8 bits (ou plus) pour représenter des caractères.

*   Chaque symbole possède un **point de code** (souvent en hexadécimal, ex: U+0041 pour 'A').
*   **Python** utilise l'encodage UTF-8 par défaut.

**Exemples Unicode :**
*   **A** : U+0041
*   **字** : U+5B57
*   **풪** : U+052A
