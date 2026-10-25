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

Avant de parler de couleur, il faut voir comment une image devient une suite de nombres. Le noir et blanc est le cas le plus simple : chaque point n'a qu'une luminosité, pas trois composantes.

> **Définition**
> Le mot *photographie* vient du grec *photos*, la lumière, et *graphein*, écrire. Écrire avec la lumière, donc.

La photographie numérique prolonge la photographie argentique, elle ne la remplace pas d'un coup. En 1826, Nicéphore Niépce obtient la première photographie conservée, *Point de vue du Gras*. En 1957, Russell Kirsch produit la première image numérique, un carré de 176 pixels de côté, le portrait de son fils. En 1969, Willard Boyle et George E. Smith inventent le capteur CCD ; ils recevront le prix Nobel en 2009. En 1975, Steven Sasson, chez Kodak, construit le premier appareil photo numérique.

## De la lumière aux nombres

Pour qu'un ordinateur traite une image, il faut la **numériser** : la transformer en une suite de nombres. On ne range pas « le ciel » ou « un visage ». On range des valeurs, case par case.

### Le pixel

L'image est une grille de petits carrés, les **pixels**, contraction de *picture element*.

![Grille de pixels](/content/1/img_to_tab.png)

> **Définition**
> Un **pixel** est le plus petit élément d'une image numérique. Sur toute sa surface, il a une seule couleur, uniforme.

Quand on zoome assez, les carrés apparaissent. C'est la pixellisation. Elle n'est pas un défaut du zoom : elle révèle la grille qui était déjà là.

### Définition et résolution

La **définition** est le nombre total de pixels. On multiplie la largeur par la hauteur.

$$ \text{Définition} = \text{Nombre de colonnes} \times \text{Nombre de lignes} $$

Une image de 800 pixels sur 600 en contient $800 \times 600 = 480\,000$, soit 0,48 mégapixel. Une définition plus grande décrit l'image plus finement. Elle ne dit pas encore si, une fois imprimée, ces pixels seront serrés ou espacés.

C'est le rôle de la **résolution**. Elle mesure la densité de pixels sur un support, écran ou papier, en points par pouce : ppp, ou dpi (*dots per inch*). Un pouce vaut environ 2,54 cm.

$$ \text{Résolution} = \frac{\text{Nombre de pixels sur une ligne}}{\text{Longueur de la ligne en pouces}} $$

Deux images de même définition peuvent donc paraître très différentes une fois imprimées. Celle qu'on étale sur une grande feuille a une résolution plus faible : les pixels sont plus gros.

## Coder le noir, le blanc, et les gris

### Un seul bit

L'image la plus pauvre n'a que le noir et le blanc. Un bit suffit : 0 ou 1.

![Tableau binaire](/content/1/stab.png)

![Image originale](/content/1/maya.png)
![Image en niveaux de gris](/content/1/maya_gris.png)

| Couleur | Valeur | Binaire |
|---------|--------|---------|
| **Noir** | 0 | 0 |
| **Blanc** | 1 | 1 |

Avec un bit, il n'y a pas de gris. Le moindre détail intermédiaire doit choisir un camp.

### Huit bits, 256 gris

Pour des nuances, on donne plus de bits à chaque pixel. Le standard courant est 8 bits, un octet.

![Nuances de gris](/content/1/img_nuances.png)

Un bit donne $2^1 = 2$ possibilités. Huit bits en donnent $2^8 = 256$, de 0 à 255. La convention est simple, et il faut la tenir : **0 est le noir**, **255 est le blanc**. Plus la valeur monte, plus le gris s'éclaircit. Ce n'est pas « plus de noir ». C'est plus de lumière.

## Le négatif

Pour inverser une image en niveaux de gris, on retourne l'échelle. Le pixel $P'$ vaut :

$$ P' = 255 - P $$

Un noir, 0, devient 255, donc blanc. Un blanc devient noir. Un gris à 200 devient $255 - 200 = 55$, un gris sombre. La formule ne mélange pas les pixels voisins : chacun est retourné seul.

![Image inversée (Négatif)](/content/1/mayainv.png)
