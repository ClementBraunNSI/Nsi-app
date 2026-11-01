---
title: Photographie Noir et Blanc
description: >-
  Comprendre la numérisation des images en noir et blanc, les pixels et la
  définition
level: seconde
chapter: Photographie Numérique
icon: "camera"
prerequisites:
  - photographie_couleur
audience: public
---

# Photographie noir et blanc

Avant de parler de couleur, il faut voir comment une image devient une suite de nombres. Le noir et blanc est le cas le plus simple, car chaque point n'a qu'une valeur de luminosité, au lieu de trois composantes.

> **Définition**
> Le mot *photographie* vient du grec *photos*, la lumière, et *graphein*, écrire. Photographier, c'est donc écrire avec la lumière.

La photographie numérique a remplacé progressivement la photographie argentique. En 1826, Nicéphore Niépce obtient la première photographie conservée, *Point de vue du Gras*. En 1957, Russell Kirsch produit la première image numérique : un portrait de son fils, dans un carré de 176 pixels de côté. En 1969, Willard Boyle et George E. Smith inventent le capteur CCD, ce qui leur vaudra le prix Nobel de physique en 2009. En 1975, Steven Sasson, chez Kodak, construit le premier appareil photo numérique.

## La numérisation

Pour qu'un ordinateur traite une image, il faut la **numériser**, c'est-à-dire la transformer en une suite de nombres. L'ordinateur ne stocke pas « un ciel » ou « un visage », mais des valeurs, case par case.

### Le pixel

L'image est une grille de petits carrés, les **pixels**, contraction de *picture element*.

![Grille de pixels](/content/1/img_to_tab.png)

> **Définition**
> Un **pixel** est le plus petit élément d'une image numérique. Sur toute sa surface, il a une seule couleur, uniforme.

Quand on zoome assez, les carrés apparaissent. C'est la pixellisation. Elle ne vient pas du zoom lui-même : elle révèle la grille qui forme l'image.

### Définition et résolution

La **définition** est le nombre total de pixels. On multiplie la largeur par la hauteur.

$$ \text{Définition} = \text{Nombre de colonnes} \times \text{Nombre de lignes} $$

Une image de 800 pixels sur 600 en contient $800 \times 600 = 480\,000$, soit 0,48 mégapixel. Une définition plus grande décrit l'image plus finement. Elle ne dit pas, en revanche, si ces pixels seront serrés ou espacés une fois l'image imprimée.

C'est le rôle de la **résolution**. Elle mesure la densité de pixels sur un support (écran ou papier), en points par pouce, notés ppp ou dpi (*dots per inch*). Un pouce vaut environ 2,54 cm.

$$ \text{Résolution} = \frac{\text{Nombre de pixels sur une ligne}}{\text{Longueur de la ligne en pouces}} $$

Deux images de même définition peuvent donc paraître très différentes une fois imprimées. Celle qui est imprimée sur une grande feuille a une résolution plus faible, et ses pixels sont plus gros.

## Coder le noir, le blanc et les gris

### Un seul bit

L'image la plus simple ne contient que du noir et du blanc. Un seul bit suffit alors pour chaque pixel : 0 ou 1.

![Tableau binaire](/content/1/stab.png)

![Image originale](/content/1/maya.png)
![Image en niveaux de gris](/content/1/maya_gris.png)

| Couleur | Valeur | Binaire |
|---------|--------|---------|
| **Noir** | 0 | 0 |
| **Blanc** | 1 | 1 |

Avec un seul bit, il n'y a pas de gris : chaque pixel est soit noir, soit blanc.

### Huit bits, 256 gris

Pour obtenir des nuances, on attribue plus de bits à chaque pixel. Le standard courant est 8 bits, un octet.

![Nuances de gris](/content/1/img_nuances.png)

Un bit donne $2^1 = 2$ possibilités. Huit bits en donnent $2^8 = 256$, de 0 à 255. Par convention, **0 correspond au noir** et **255 au blanc**. Plus la valeur augmente, plus le gris est clair, car la valeur mesure une quantité de lumière.

## Le négatif

Pour inverser une image en niveaux de gris, on retourne l'échelle. Le pixel $P'$ vaut :

$$ P' = 255 - P $$

Un noir, 0, devient 255, donc blanc. Un blanc devient noir. Un gris à 200 devient $255 - 200 = 55$, un gris sombre. La formule s'applique à chaque pixel séparément, sans tenir compte de ses voisins.

![Image inversée (Négatif)](/content/1/mayainv.png)
