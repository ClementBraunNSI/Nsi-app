---
title: Circuits électroniques
description: 'Portes logiques, transistors et tables de vérité'
level: premiere
chapter: Architecture matérielle
icon: "plug"
badgeId: premiere_circuits
prerequisites:
  - archi_von_neumann
  - donnees_booleens
audience: public
groupe: circuits-logiques
groupeTitre: "Circuits logiques"
---

# Circuits électroniques

Le cours sur les booléens a montré comment calculer avec vrai et faux. Le processeur fait les mêmes calculs, mais avec des tensions électriques. Un **transistor** est un interrupteur commandé : selon la tension appliquée sur sa grille, il laisse passer le courant ou le bloque. En assemblant quelques transistors, on obtient une **porte logique**, qui réalise ET, OU ou NON sur des signaux notés 0 et 1. Un **circuit** est un assemblage de portes. L'additionneur d'un processeur, par exemple, n'est qu'un ensemble de portes qui se transmettent des retenues.

![transistor](transistor.png)

À chaque porte correspond une **table de vérité**, la liste complète de ses sorties. Avec deux entrées, la table compte quatre lignes. Le comportement d'une porte ne se devine pas à partir d'un seul exemple : il se lit dans sa table.

## Les portes logiques

Le **NON**, $S = \overline{A}$, inverse son unique entrée : 0 devient 1 et 1 devient 0.

| Entrée | Sortie |
| :---: | :---: |
| 0 | 1 |
| 1 | 0 |

![rprnot](repr_not.png)

Le **ET**, noté $S = A \wedge B$, et aussi $A \cdot B$ ou $A \times B$, ne vaut 1 que si **toutes** les entrées valent 1. Il suffit qu'une seule entrée vaille 0 pour que la sortie vaille 0.

| A | B | Sortie |
| :---: | :---: | :---: |
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

![rprand](repr_and.png)

Le **OU**, noté $S = A \vee B$, et aussi $A + B$, vaut 1 dès qu'**au moins une** entrée vaut 1. Si les deux entrées valent 1, la sortie vaut 1 aussi : ce OU n'est pas exclusif. Le symbole $+$ ne désigne pas ici l'addition des entiers, et en logique $1 + 1$ vaut 1.

| A | B | Sortie |
| :---: | :---: | :---: |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

![rpror](repr_or.png)

Le **OU exclusif**, le XOR, noté $S = A \oplus B$, vaut 1 quand **exactement une** entrée vaut 1. La sortie vaut donc 0 quand les deux entrées valent 0, mais aussi quand elles valent toutes les deux 1. On peut l'écrire avec les portes précédentes :

$$S = \overline{A}B + A\overline{B}$$

| A | B | Sortie |
| :---: | :---: | :---: |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

![rprxor](repr_xor.png)

Il faut faire attention à ne pas confondre les symboles. **ET** s'écrit $\wedge$ et **OU** s'écrit $\vee$. Le rond ou la barre désignent le NON, et le signe $\oplus$ désigne le XOR.

## Lire une équation

On compose les opérateurs comme on compose des calculs. La priorité usuelle est : parenthèses, puis NON, puis ET, puis OU. $A \vee B \wedge C$ se lit donc $A \vee (B \wedge C)$, parce que le ET passe avant le OU. Si l'on veut « (A ou B) et C », il faut écrire les parenthèses : $S = (A \vee B) \wedge C$.

Avec $A = 1$, $B = 0$, $C = 0$ : $(1 \vee 0) \wedge 0 = 1 \wedge 0 = 0$. On calcule d'abord l'intérieur des parenthèses, puis le ET. Deux écritures différentes peuvent décrire le même circuit. Pour le vérifier, il faut comparer leurs tables de vérité ligne par ligne, et non leurs symboles.

## Exemple : une alarme

Le simulateur ci-dessous assemble des capteurs et une porte ET. Comme avec une table de vérité, il s'agit de trouver quelle combinaison d'entrées met la sortie à 1 et déclenche donc l'alarme.

<IotSimulator />

En résumé, les portes logiques sont les briques de base du processeur, et elles sont réalisées avec des transistors. Le NON inverse son entrée, le ET s'écrit $\wedge$, le OU $\vee$ et le XOR $\oplus$. La table de vérité décrit entièrement le comportement d'une porte. Les portes se combinent en équations, avec la priorité suivante : parenthèses, NON, ET, puis OU. Un même comportement peut s'écrire de plusieurs façons équivalentes.

## Pour s'entraîner

[Exercices : circuits](/cours/2/archi_circuits_exercices)
