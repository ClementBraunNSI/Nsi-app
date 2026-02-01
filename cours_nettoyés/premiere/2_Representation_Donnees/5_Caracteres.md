---
title: Représentation des caractères
description: Codage ASCII et Unicode (UTF-8)
level: Première
chapter: Représentation des données
icon: material/format-font
---

# 📝 La représentation des caractères

## 🎯 Objectif du cours

### 📚 Ce que vous allez apprendre

Cette leçon permettra de savoir comment **représenter en binaire** des caractères textuels.

Nous découvrirons les différents systèmes de codage et leurs évolutions.

## 📖 Définition

### 🔤 Qu'est-ce qu'un caractère ?

Un caractère est un **symbole** d'écriture représentant en général :

- Une **lettre** (A, b, C)
- Un **chiffre** (1, 2, 3, ...)
- Un **symbole** (字, Д, @, #)

!!! info "Problème informatique"
    En informatique, on ne peut pas représenter directement un caractère car **elle ne comprend que des 0 et des 1**. Il faut donc les coder pour la machine.

### 🔧 Système de codage

**Le codage d'un caractère** est une association entre celui-ci et une représentation binaire.

Un **système de codage** est un ensemble de règles pour convertir une information par une autre (ici un caractère avec sa représentation binaire).

## 🇺🇸 Un système de codage de caractère : ASCII

### 📋 ASCII (American Standard Code for Information Interchange)

L'**ASCII** est un codage qui utilise **7 bits** pour représenter des caractères alpha-numériques et d'autres caractères réservés (comme l'espace ou le retour chariot).

En ayant 7 bits pour représenter un caractère, on peut représenter **2⁷ = 128 caractères**.

### 📊 Capacité d'ASCII

**7 bits = 128 caractères possibles**

Cela inclut :

- 26 lettres minuscules (a-z)
- 26 lettres majuscules (A-Z)
- 10 chiffres (0-9)
- Symboles de ponctuation
- Caractères de contrôle

### 🔢 Exemples de codes ASCII

- **A** : 65 (décimal)
- **a** : 97 (décimal)
- **0** : 48 (décimal)
- **@** : 64 (décimal)

### 📋 Table de correspondance ASCII (extrait)

| Déc | Hex | Car | Déc | Hex | Car | Déc | Hex | Car | Déc | Hex | Car |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| 32 | 20 | (espace) | 48 | 30 | 0 | 64 | 40 | @ | 80 | 50 | P |
| 33 | 21 | ! | 49 | 31 | 1 | 65 | 41 | A | 81 | 51 | Q |
| 34 | 22 | " | 50 | 32 | 2 | 66 | 42 | B | 82 | 52 | R |
| 97 | 61 | a | 113 | 71 | q | 122 | 7A | z | 126 | 7E | ~ |

!!! warning "Limitation d'ASCII"
    À la vue de cette table, on remarque une chose importante : il n'y a que des symboles d'**alphabets latins**.

    Or, il n'existe pas uniquement les alphabets latins mais aussi le **cyrillique** ou bien les symboles des alphabets **chinois** ou **japonais**.

    💡 **Solution :** On a besoin d'un codage permettant de représenter **davantage de caractères**.

## 🌍 Un système plus inclusif : Unicode

### 🔤 Unicode - Le standard universel

**Unicode** est un système de codage de caractère qui utilise un certain nombre de bits en fonction de sa version, plus connu sous le nom de **UTF**.

On utilise plus souvent le système **UTF-8** qui utilise 8 bits pour représenter des caractères. Il peut cependant utiliser 1, 2 voire même 3 groupes de 8 bits (octets) pour représenter davantage de caractères.

### 🎯 Principe des points de code

Chaque symbole possède un **point de code**, qui est l'ensemble des bits permettant sa représentation, souvent représenté en **hexadécimal**.

### 🐍 Utilisation en Python

**Python** utilise l'encodage UTF-8 pour coder ses symboles et les représenter.

Il est possible d'observer un encodage spécial sur une chaîne de caractère en utilisant la méthode `encode` des chaînes de caractères.

### Exemples Unicode

- **풪** : U+052A (Caractère coréen)
- **A** : U+0041 (Lettre latine majuscule)
- **ᛒ** : U+16D2 (Lettre B runique)
- **字** : U+5B57 (Caractère chinois)

!!! tip "Ressource utile"
    On retrouvera la table UTF-8 complète à cette adresse : [Table UTF-8](https://www.charset.org/utf-8)
