---
title: "Photographie Noir et Blanc"
description: "Comprendre la numérisation des images en noir et blanc, les pixels et la définition"
level: "seconde"
chapter: 5
icon: "camera"
---

# 1. Histoire de la photographie

La photographie numérique est une évolution majeure de la photographie argentique.

> **Définition** : Le mot "photographie" vient du grec *photos* (lumière) et *graphein* (écrire), signifiant littéralement "écrire avec la lumière".

Quelques dates clés :
- **1826** : Nicéphore Niépce réalise la première photographie ("Point de vue du Gras").
- **1957** : Première image numérique par Russell Kirsch (176x176 pixels).
- **1969** : Invention du capteur CCD par Willard Boyle et George E. Smith (Prix Nobel 2009).
- **1975** : Premier appareil photo numérique par Steven Sasson (Kodak).

# 2. Numérisation d'une image

Pour qu'un ordinateur puisse traiter une image, celle-ci doit être **numérisée**, c'est-à-dire transformée en une suite de nombres.

## 2.1 Le Pixel

Une image numérique est composée d'une grille de petits carrés appelés **pixels** (contraction de *picture element*).

> **Définition** : Un **pixel** est le plus petit élément constitutif d'une image numérique. C'est un point de couleur uniforme.

Si l'on zoome sur une image, on finit par voir ces carrés : c'est la **pixellisation**.

## 2.2 La Définition

La **définition** d'une image correspond au nombre total de pixels qui la composent.
Elle se calcule en multipliant le nombre de pixels en largeur par le nombre de pixels en hauteur.

$$ \text{Définition} = \text{Nombre de colonnes} \times \text{Nombre de lignes} $$

*Exemple :* Une image de 800 pixels de large et 600 pixels de haut a une définition de :
$800 \times 600 = 480 000 \text{ pixels} = 0,48 \text{ Mpx (Mégapixels)}$

## 2.3 La Résolution

La **résolution** indique la densité de pixels sur un support physique (écran ou papier). Elle s'exprime en **ppp** (points par pouce) ou **dpi** (dots per inch).

> **Note** : 1 pouce (inch) $\approx$ 2,54 cm.

$$ \text{Résolution} = \frac{\text{Nombre de pixels sur une ligne}}{\text{Longueur de la ligne en pouces}} $$

# 3. Codage du Noir et Blanc

## 3.1 Image binaire (1 bit)

L'image la plus simple est composée uniquement de noir et de blanc pur.
Chaque pixel peut être codé sur **1 bit** :

| Couleur | Valeur numérique | Représentation binaire |
|---------|------------------|------------------------|
| **Noir** | 0 | 0 |
| **Blanc** | 1 | 1 |

## 3.2 Image en niveaux de gris (8 bits)

Pour obtenir des nuances (du gris), on utilise plus de bits pour coder chaque pixel.
Le standard actuel est le codage sur **8 bits** (1 octet) par pixel.

- Avec 1 bit : $2^1 = 2$ nuances (Noir / Blanc)
- Avec 8 bits : $2^8 = 256$ nuances possibles

Les valeurs vont de **0** à **255** :
- **0** : Noir absolu
- **255** : Blanc absolu
- Les valeurs intermédiaires sont des gris de plus en plus clairs.

> **À retenir** : Plus la valeur est élevée, plus le gris est clair (proche du blanc).
