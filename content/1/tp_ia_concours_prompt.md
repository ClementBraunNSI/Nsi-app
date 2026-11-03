---
title: "TP : Le concours du prompt"
description: "Par binômes, obtenir avec une IA générative le résultat le plus proche d'une cible imposée, en trois manches chronométrées."
level: seconde
chapter: "Intelligence artificielle"
icon: "trophy"
prerequisites:
  - Cours_IA_prompting
  - exercices_ia_prompting
audience: public
groupe: ia-prompting
groupeTitre: "Prompter une IA"
---

# Le concours du prompt

Une **cible** est projetée au tableau : un texte ou une image. Chaque binôme doit, à l'aide d'une IA générative, obtenir le résultat le plus proche possible de cette cible. Elle ne peut pas être copiée : il faut la décrire avec ses propres mots, comme dans les exercices, et améliorer le prompt d'essai en essai.

Le binôme qui s'approche le plus de la cible gagne la manche. À la fin des trois manches, on additionne les points.

## Matériel

- Chaque binôme dispose d'un ordinateur et utilise les IA indiquées en classe.
- Pour chaque manche, une **fiche de manche** (modèle plus bas) est remplie, avec chaque prompt envoyé recopié.
- Chacun a un rôle, et les rôles s'échangent à chaque manche : l'un tape les prompts, l'autre tient la fiche et surveille le chronomètre.

## Les règles

| Règle | Ce qu'elle interdit ou impose |
|-------|-------------------------------|
| **Pas de copie de la cible** | Interdit de recopier le texte cible, de le photographier ou de téléverser l'image cible dans l'IA. On décrit avec ses mots. |
| **Nombre d'essais limité** | 5 générations maximum par manche. Chaque génération compte, même ratée. |
| **Prompt court** | Le prompt envoyé ne dépasse pas la limite de mots de la manche. |
| **Tout est noté** | Chaque prompt envoyé est recopié sur la fiche, avec ce qui change et pourquoi. |
| **Aucune donnée personnelle** | Ni nom, ni photo, ni information sur une personne réelle. |

Un binôme qui ne respecte pas une règle perd les points de la manche. Le but est d'apprendre à décrire précisément, pas de trouver une astuce pour contourner la consigne.

## Le déroulé

| Manche | Type de cible | Durée | Limite du prompt | Essais |
|--------|---------------|-------|------------------|--------|
| **1. Le texte** | Une fable en vers | 12 minutes | 60 mots | 5 |
| **2. L'image** | Une photo de paysage | 15 minutes | 50 mots | 5 |
| **3. La contrainte** | Une image avec un texte imposé dans l'image | 12 minutes | 40 mots | 4 |

Avant chaque manche, prendre 2 minutes pour observer la cible **sans toucher à l'ordinateur**. Lister ce qui la caractérise, comme la forme, la longueur, le ton, les couleurs, le cadrage ou les détails. C'est souvent cette liste qui permet de gagner la manche.

**Pour la manche 1**, penser à la forme autant qu'au sens : nombre de lignes, rimes, ponctuation, niveau de langue.

**Pour la manche 2**, reprendre le tableau du cours : sujet, attitude, décor, style, cadrage, lumière. Un détail bien décrit vaut mieux que trois adjectifs vagues.

**Pour la manche 3**, la contrainte est le texte écrit dans l'image : « La tanière du code ». Les IA d'image écrivent souvent mal, avec des lettres en trop, manquantes ou déformées. Le texte doit être lisible et sans faute, sinon le résultat reçoit 0 au critère « Les détails ».

## Les trois cibles

Chaque cible n'est ouverte qu'au début de sa manche.

<details className="concours-cible">
<summary>Manche 1 : le poème</summary>

> **Le Renard, la Mouche et le Phacochère**
>
> Dans les bois endormis, sous les grands chênes verts,\
> Un renard méditait, rusé comme un vieux sage,\
> Quand survint un phacochère au fort mauvais caractère,\
> Qui troublait le silence en ravageant les feuillages.
>
> Une mouche, en ces lieux, bourdonnait sans repos,\
> Autour du grand sanglier qui fouillait les racines,\
> « Cesse donc ton vacarme, ou tu perdras ta peau ! »\
> Dit la bête irritée, en secouant ses narines.
>
> Soudain, un ornithorynque apparut dans les bois,\
> Son pelage était roux, comme un soleil d'automne,\
> Et l'ambre de son bec éclairait chaque endroit,\
> Tandis que l'or des feuilles au vent doux tourbillonne.
>
> Le renard, d'un sourire, observa la querelle,\
> Puis souffla : « Mon ami, tu grondes sans raison ;\
> La mouche est bien petite, et pourtant bien cruelle,\
> Car l'esprit fait souvent la force du plus profond. »
>
> Le phacochère apprit qu'on ne gagne à crier,\
> La mouche, elle, comprit qu'il faut parfois se taire ;\
> Le renard s'en alla, fier de les conseiller,\
> Car le sage sait rire avant de vouloir plaire.

</details>

<details className="concours-cible">
<summary>Manche 2 : le paysage</summary>

![Cible de la manche 2 : une forêt de séquoias géants au crépuscule, avec de la brume dans la vallée, des montagnes enneigées et une cascade](/content/1/tp_concours_cible_paysage.webp)

</details>

<details className="concours-cible">
<summary>Manche 3 : le fennec</summary>

![Cible de la manche 3 : un fennec en origami blanc qui court, avec un bandana orange portant l'inscription « La tanière du code »](/content/1/tp_concours_cible_fennec.png)

</details>

## Comment on départage

À la fin de chaque manche, chaque binôme choisit **son meilleur résultat**. Tous les résultats sont affichés côte à côte avec la cible, sans le nom des binômes. Un jury, avec un représentant de chaque binôme, note la proximité avec la grille suivante.

| Critère | Ce que l'on regarde | Points |
|---------|---------------------|--------|
| **Le fond** | Le sujet, le message ou ce qui est représenté | /4 |
| **La forme** | Longueur, structure, cadrage, composition | /4 |
| **Le style** | Ton, niveau de langue, technique, couleurs | /4 |
| **Les détails** | Les éléments précis de la cible que l'on retrouve | /4 |
| **L'efficacité** | 4 points en 1 ou 2 essais, 3 points en 3 essais, 2 points en 4 essais, 1 point en 5 essais | /4 |

On ne vote pas pour son propre binôme. En cas d'égalité, le binôme qui a utilisé le prompt le plus court l'emporte.

## La fiche de manche

**Pour chaque manche, recopier et compléter :**

| Essai | IA utilisée | Prompt envoyé (en entier) | Nombre de mots | Ce qui était trop loin de la cible | Ce que l'on change au prochain essai |
|-------|-------------|---------------------------|----------------|------------------------------------|--------------------------------------|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

## Travail à rendre

À la fin de la séance, chaque binôme rend ses trois fiches de manche et répond, en quelques lignes, aux questions suivantes.

1. Quel changement de prompt a le plus rapproché le résultat de la cible ? Recopier le prompt avant et après.
2. Le binôme a-t-il changé d'IA pendant une manche ? Qu'est-ce que cela a changé ?
3. Une IA a-t-elle ignoré une partie de la consigne malgré plusieurs essais ? Laquelle, et quelle a été la réaction du binôme ?
4. Pour refaire la manche 2, quel serait le premier prompt ?

La note du TP ne dépend pas du classement. Elle porte sur la qualité des fiches : des prompts complets, des modifications expliquées, et une réflexion honnête sur ce qui a marché ou non.

<Correction>
**Prompts de référence**, invisibles sur le site, pour tester les cibles avant la séance. Chacun respecte la limite de mots de sa manche.

Manche 1 (60 mots) :

> Écris une fable en vers à la manière de La Fontaine, titrée « Le Renard, la Mouche et le Phacochère » : 5 quatrains en rimes croisées, vers longs. Dans un bois de chênes, un renard sage observe un phacochère grincheux agacé par une mouche. Un ornithorynque roux au bec ambré apparaît. Deux répliques entre guillemets. Morale finale : crier ne sert à rien.

Manche 2 (44 mots) :

> Photo réaliste au crépuscule, format panoramique : forêt de séquoias géants et de sapins vue d'une pente rocheuse et moussue. Soleil couchant orangé à gauche sous un ciel nuageux gris. Brume dans la vallée, montagnes enneigées au fond, cascade à droite. Ambiance sombre, couleurs désaturées.

Manche 3 (37 mots) :

> Photo d'un fennec en origami de papier blanc qui court, queue en papier orange. Il porte un bandana orange qui flotte derrière lui, avec l'inscription « La tanière du code ». Fond crème uni, sol couleur sable, lumière douce.

Variante plus difficile pour la manche 3 : interdire le mot « origami » dans le prompt.
</Correction>
