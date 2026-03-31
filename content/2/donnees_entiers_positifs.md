---
title: Entiers Positifs en Binaire et Hexadécimal
description: Comprendre les systèmes de numération et les conversions entre bases
level: premiere
chapter: Représentation des données
icon: "\U0001F522"
badgeId: premiere_entiers_positifs
prerequisites:
  - donnees_entiers_relatifs
---


# Entiers Positifs en Binaire et Hexadécimal

## Rappel : Les bases dans la vie courante

### Système de notation en colonnes

Notre système de notation repose sur une disposition en colonnes. Nous comptons avec 10 symboles allant de 0 à 9 que l'on nomme **chiffre**. Une fois que nous avons atteint le chiffre 9, si l'on souhaite rajouter 1, on se rend compte que l'on n'a pas de chiffres supérieurs. On crée ainsi une colonne à gauche qui contiendra un chiffre allant de 1 à 9 en remettant le chiffre de la colonne originelle (ou les suivantes) à 0.

> **Exemple :** 426 est composé des chiffres 4, 2 et 6 représentés dans les colonnes des centaines, dizaines et unités.

Notre quotidien est entouré de nombres, que ce soit pour les heures qui passent, les notes, le nombre d'œufs dans une boîte. Mais il existe une quasi infinité de bases !

*   **Base 12 (Douzaines) :** Les boîtes d'œufs, comptage avec les phalanges.
*   **Base 60 (Temps) :** Heures, minutes, secondes (Babyloniens).
*   **Base 4 (Shadoks) :** GA, BU, ZO, MEU.
*   **Base 16 (Bibi-binaire) :** Boby Lapointe (H, B, K, D...).
*   **Base 8 (Octal) :** $B_{8} = \{0,1,2,3,4,5,6,7\}$.

## Définitions Fondamentales

**Qu'est-ce qu'une base ?** Une base correspond au nombre de symboles qui permettent de représenter les chiffres ou les nombres.

> **Base décimale :** $B_{10} = \{0,1,2,...,9\}$

### Pourquoi le Binaire ?

En informatique, il a été décidé d'utiliser le binaire car **une machine peut facilement détecter la différence entre deux états**. Un processeur est composé de transistors qui traitent deux états : ouverts et fermés à la manière d'un interrupteur.

*   **Base Binaire :** Le binaire, ou représentation en base 2, est un moyen de représenter les nombres avec 2 symboles : 0 ou 1. $B_{2} = \{0,1\}$
*   **Bits et Octets :** On nomme **bit** les chiffres de la représentation en base 2 et un ensemble de 8 bits est appelé un *byte* ou *octet*.

## Compter en Base 2

<BinaryPixelArt />

Pour compter en base 2, on opère de la même manière qu'en base 10. On a une colonne qui peut valoir 0 ou 1. Une fois que la colonne atteint 1, on rajoute une colonne à sa gauche à 1 et l'on passe la colonne de droite à 0.

### Comment passer de base 2 à base 10 ?

**Rappel : Compter en base 10**
$154_{(10)} = 1\times10^{2} + 5\times10^{1} + 4\times10^{0}$

**Exemple de conversion binaire → décimal**
$1101_{(2)} = 1\times2^{3} + 1\times2^{2} + 0\times2^{1} + 1\times2^{0}$
$1101_{(2)} = 8 + 4 + 0 + 1 = 13_{(10)}$

> **Important :** À partir de maintenant, pour écrire un nombre si la base n'est pas explicite, il faut la préciser, par exemple $154_{(10)}$ ou $1101_{(2)}$.

**Exercice : Convertir de binaire en décimal**
*   $1101_{(2)}$
*   $1001_{(2)}$
*   $1010_{(2)}$
*   $1111_{(2)}$

## Comment passer de base 10 à base 2

### Méthode des divisions successives

Pour passer de la base 10 à la base 2, on peut utiliser la méthode des **divisions successives**.

**Exemple : Convertir 29 en binaire**

```
29| 2
  |---
1 | 14 | 2
       |---
     0 | 7 | 2
           |---
         1 | 3 | 2
               |---
             1 | 1 | 2
                   |---
                 1 | 0
```

On divise successivement le nombre à convertir par 2. Chaque **reste** correspond au nombre dans la représentation et chaque **quotient** est à diviser à la suite par 2. On répète ces opérations jusqu'à ce que le quotient soit 0 et le reste 1.
On lit le résultat en remontant (du dernier reste au premier).

> **Résultat :** $29_{10} = 11101_{2}$
> Vérification : $11101_{2} = 1×2^{4} + 1×2^{3} + 1×2^{2} + 0×2^{1} + 1×2^{0} = 16 + 8 + 4 + 0 + 1 = 29_{10}$

### Méthode des soustractions successives

Une autre méthode utilisable est la méthode des **soustractions successives**. Pour ce faire, il suffit de se munir d'un tableau de puissances de 2.

**Exemple : Convertir 42 en binaire**
On choisit la plus grande puissance de 2 inférieure ou égale à 42 : $2^6 = 64$ est trop grand, $2^5 = 32$ convient.

1.  Est-ce que 42 ≥ 32 ? Oui, on met **1** pour $2^5$. Reste : $42 - 32 = 10$.
2.  Est-ce que 10 ≥ 16 ($2^4$) ? Non, on met **0**.
3.  Est-ce que 10 ≥ 8 ($2^3$) ? Oui, on met **1**. Reste : $10 - 8 = 2$.
4.  Est-ce que 2 ≥ 4 ($2^2$) ? Non, on met **0**.
5.  Est-ce que 2 ≥ 2 ($2^1$) ? Oui, on met **1**. Reste : $2 - 2 = 0$.
6.  Est-ce que 0 ≥ 1 ($2^0$) ? Non, on met **0**.

| $2^{6}=64$ | $2^{5}=32$ | $2^{4}=16$ | $2^{3}=8$ | $2^{2}=4$ | $2^{1}=2$ | $2^{0}=1$ |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 0 | 1 | 0 | 1 | 0 | 1 | 0 |

> **Résultat :** $42_{10} = 101010_{2}$

## Hexadécimal

En informatique, une autre base très importante est la base **hexadécimale** (ou *hex*). Cette base représente les nombres avec **16 symboles**.
$B_{16} = \{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F\}$

### Table de correspondance

| Décimal | Hexadécimal | Décimal | Hexadécimal |
|:-------:|:-----------:|:-------:|:-----------:|
| 0 | 0 | 8 | 8 |
| 1 | 1 | 9 | 9 |
| 2 | 2 | 10 | A |
| 3 | 3 | 11 | B |
| 4 | 4 | 12 | C |
| 5 | 5 | 13 | D |
| 6 | 6 | 14 | E |
| 7 | 7 | 15 | F |

> **Important :** On représente chaque symbole de la représentation en base hexadécimale par un ensemble de **4 bits**.

### Convertir en base hexadécimale

**Méthode des divisions successives**
On divise successivement par **16**.

**Exemple : Convertir 255 en hexadécimal**
$255 \div 16 = 15$ reste $15$ (F)
$15 \div 16 = 0$ reste $15$ (F)

Résultat : $255_{10} = FF_{16}$
