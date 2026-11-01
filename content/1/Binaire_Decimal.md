---
title: 'Le binaire : Définition'
description: 'Comprendre la base 2, les bits, octets et les conversions avec le décimal.'
level: '2'
chapter: Internet
icon: "hash"
prerequisites:
  - Cours_Internet
audience: public
---

On compte d'habitude en base 10. Cela veut dire qu'on dispose de dix symboles, de 0 à 9, et que la position d'un chiffre change sa valeur. Un ordinateur, lui, n'utilise que deux symboles, 0 et 1, appelés des **bits**. Huit bits regroupés forment un **octet**.

Il n'y a que deux symboles parce qu'un circuit électronique distingue facilement deux états : soit le courant passe, soit il ne passe pas. Les nombres, le texte et les images sont ensuite tous codés à partir de ces deux états.

## Compter en base 10, pour s'en souvenir

En base 10, la colonne de droite est celle des unités, puis viennent les dizaines, les centaines. Le nombre 154 se décompose ainsi :

$$154 = 10^2 \times 1 + 10^1 \times 5 + 10^0 \times 4$$

C'est une décomposition selon la base, qui vaut ici 10. La même méthode fonctionne en base 2, en remplaçant simplement les puissances de 10 par des puissances de 2.

## Du binaire vers le décimal

Un nombre binaire est lui aussi positionnel. La colonne de droite vaut $2^0$, celle d'à côté $2^1$, puis $2^2$, et ainsi de suite vers la gauche.

Prenons $11001$ en base 2 :

$$11001_2 = 1 \times 2^4 + 1 \times 2^3 + 0 \times 2^2 + 0 \times 2^1 + 1 \times 2^0 = 16 + 8 + 0 + 0 + 1 = 25_{10}$$

On n'additionne que les puissances de 2 dont le bit vaut 1. Les 0 n'ajoutent rien à la somme, mais ils restent indispensables, car ils fixent la position des autres chiffres.

> **Exercice**
> Convertir les nombres binaires suivants en base 10 :
> a. $1101_2$
> b. $10101_2$
> c. $111000_2$
> d. $10010_2$

## Du décimal vers le binaire

Dans l'autre sens, on utilise les **divisions successives** par 2.

On divise le nombre par 2. Le reste, 0 ou 1, est un bit du résultat. Le quotient est divisé à nouveau par 2, et on recommence. On s'arrête lorsque le quotient vaut 0. Le dernier reste vaut alors 1, sauf si le nombre de départ était 0.

![div_succ](/content/1/div_succ.png)

Il faut faire attention à l'ordre des restes. Le premier reste obtenu donne le bit de droite, appelé bit de poids faible. Les restes se lisent donc dans le sens de la flèche du schéma, du dernier calcul vers le premier. S'ils sont recopiés dans l'ordre où ils apparaissent, le nombre obtenu est écrit à l'envers.
