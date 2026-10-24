---
title: Circuits électroniques
description: 'Portes logiques, transistors et tables de vérité'
level: premiere
chapter: Architecture matérielle
icon: "\U0001F50C"
badgeId: premiere_circuits
prerequisites:
  - archi_von_neumann
  - donnees_booleens
audience: public
---

# Circuits électroniques

Le cours sur les booléens a calculé avec vrai et faux. Le processeur fait le même calcul avec des tensions. Un **transistor** est un interrupteur commandé : une tension sur la grille laisse passer le courant, ou le bloque. En assemblant quelques transistors, on obtient une **porte logique**, qui réalise ET, OU ou NON sur des signaux notés 0 et 1. Un **circuit** est un assemblage de portes. L'additionneur d'un processeur, au fond, n'est que cela : des portes, et les retenues qu'elles se passent.

![transistor](transistor.png)

À chaque porte correspond une **table de vérité**, la liste complète de ses sorties. Deux entrées donnent quatre lignes. On ne devine pas le comportement sur un exemple : on le lit dans la table.

## Quatre portes

Le **NON**, $S = \overline{A}$, inverse son unique entrée. 0 devient 1, 1 devient 0.

| Entrée | Sortie |
| :---: | :---: |
| 0 | 1 |
| 1 | 0 |

![rprnot](repr_not.png)

Le **ET**, noté $S = A \wedge B$, et aussi $A \cdot B$ ou $A \times B$, ne vaut 1 que si **toutes** les entrées valent 1. Une seule à 0 suffit à bloquer la sortie. C'est la porte exigeante.

| A | B | Sortie |
| :---: | :---: | :---: |
| 0 | 0 | 0 |
| 0 | 1 | 0 |
| 1 | 0 | 0 |
| 1 | 1 | 1 |

![rprand](repr_and.png)

Le **OU**, noté $S = A \vee B$, et aussi $A + B$, vaut 1 dès qu'**au moins une** entrée vaut 1. Les deux à 1 restent à 1 : ce n'est pas un choix exclusif. Le symbole $+$ ici n'est pas l'addition des entiers. $1 + 1$ en logique vaut 1.

| A | B | Sortie |
| :---: | :---: | :---: |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 1 |

![rpror](repr_or.png)

Le **OU exclusif**, le XOR, noté $S = A \oplus B$, vaut 1 quand **exactement une** entrée vaut 1. Deux 0 : la sortie est 0. Deux 1 : la sortie est 0 aussi. On peut l'écrire avec les portes précédentes :

$$S = \overline{A}B + A\overline{B}$$

| A | B | Sortie |
| :---: | :---: | :---: |
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |

![rprxor](repr_xor.png)

Le piège de notation est d'échanger les symboles. **ET** s'écrit $\wedge$. **OU** s'écrit $\vee$. Le rond ou la barre, c'est le NON. Le signe $\oplus$, c'est le XOR.

## Lire une équation

On compose les opérateurs comme on compose des calculs. La priorité usuelle est : parenthèses, puis NON, puis ET, puis OU. $A \vee B \wedge C$ se lit donc $A \vee (B \wedge C)$, parce que le ET passe avant le OU. Si l'on veut « (A ou B) et C », il faut écrire les parenthèses : $S = (A \vee B) \wedge C$.

Avec $A = 1$, $B = 0$, $C = 0$ : $(1 \vee 0) \wedge 0 = 1 \wedge 0 = 0$. On calcule d'abord l'intérieur des parenthèses, puis le ET. Deux écritures différentes peuvent décrire le même circuit. On le vérifie en comparant les tables de vérité, ligne par ligne, pas en comparant les symboles.

## Une alarme, pour voir la table devenir un montage

Le simulateur ci-dessous assemble des capteurs et une porte ET. La question est la même que devant une table : quelle combinaison d'entrées met la sortie à 1, et donc déclenche l'alarme ?

<IotSimulator />

Pour fermer : les portes sont les briques booléennes du processeur, réalisées avec des transistors. NON inverse, ET s'écrit $\wedge$, OU s'écrit $\vee$, XOR s'écrit $\oplus$. La table de vérité dit tout le comportement. On combine les portes en équations, avec la priorité parenthèses, NON, ET, OU. Un même comportement admet plusieurs écritures équivalentes.

## Pour s'entraîner

[Exercices — circuits](/cours/2/archi_circuits_exercices)
