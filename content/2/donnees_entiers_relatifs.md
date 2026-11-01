---
title: Entiers négatifs en Binaire
description: Représentation des nombres signés et complément à 2
level: premiere
chapter: Représentation des données
icon: "thermometer"
badgeId: premiere_entiers_relatifs
prerequisites:
  - donnees_entiers_positifs
audience: public
---

# Entiers négatifs en binaire

Les entiers positifs se codent avec des puissances de 2. Mais une température, un score ou une coordonnée peuvent aussi être négatifs. Il faut donc savoir coder des entiers **signés**, en commençant par fixer le nombre de bits utilisés (4, 8 ou 32 bits, par exemple), car les valeurs représentables dépendent de ce choix. Sur 8 bits, le codage qu'utilisent les processeurs va de $-128$ à $+127$.

## Le codage avec un bit de signe

La première idée consiste à utiliser le bit de gauche pour indiquer le signe : **0** pour un nombre positif, **1** pour un nombre négatif. Les autres bits codent la valeur absolue. Sur 4 bits, $0100_{(2)}$ vaut $+4$, et $1001_{(2)}$ se lit « négatif, et 001 », donc $-1$.

Cette convention a deux défauts qui la rendent inutilisable pour calculer. D'abord, il existe **deux zéros**, $0000$ et $1000$, c'est-à-dire « plus zéro » et « moins zéro ». Ensuite, l'addition habituelle ne donne pas le bon résultat : avec cette écriture, $-13 + 13$ ne donne pas 0. Il faudrait donc un circuit spécial pour la soustraction, et ce n'est pas la solution retenue dans les machines.

## Le complément à deux

Le **complément à deux** règle les deux problèmes d'un coup. Sur $n$ bits, le bit de poids fort pèse $-2^{n-1}$, et les autres bits gardent leur poids positif habituel. L'addition se fait alors **comme pour les positifs**, en ignorant la retenue qui sort des $n$ bits. Il n'y a plus besoin d'un circuit à part pour la soustraction, puisque soustraire $b$ revient à ajouter l'opposé de $b$.

On peut penser à un compteur kilométrique. Après $0000$, si l'on recule d'un cran, tous les rouleaux passent à 9, ou ici à 1. $1111$ joue le rôle de $-1$, $1110$ celui de $-2$, et ainsi de suite. Il n'y a plus qu'un seul zéro, $0000$. La plage sur $n$ bits est $[-2^{n-1}\,;\,2^{n-1}-1]$.

Pour écrire un négatif :

1. Écrire la **valeur absolue** en binaire, sur les $n$ bits, avec les zéros de tête.
2. **Inverser** tous les bits. C'est le complément à un.
3. **Ajouter 1**.

Exemple : $-14$ sur 8 bits.

1. $14 = 00001110_{(2)}$
2. Inversion : $11110001_{(2)}$
3. $+1$ : $11110010_{(2)}$

Donc $-14_{(10)} = 11110010_{(2)}$ en complément à deux sur 8 bits. Si l'on oublie d'ajouter 1, on obtient le complément à un, qui n'est pas le codage utilisé par la machine. Il ne faut pas non plus changer de taille en cours de route : un nombre sur 4 bits n'a pas les mêmes zéros de tête que sur 8 bits, et l'inversion ne donne alors pas le même résultat.

On vérifie par l'addition. Sur 4 bits, on prend $6 + (-4)$, puisque 14 ne tient pas dans 4 bits en positif.

- $6 = 0110_{(2)}$
- $-4$ : la valeur absolue $0100$ devient $1011$ après inversion, puis $1100_{(2)}$ après l'ajout de 1
- Somme : $0110 + 1100 = 10010$. On ne garde que 4 bits : $0010_{(2)} = 2$.

La retenue sortie du quatrième bit est jetée. Le résultat est bien $6 - 4 = 2$.

| Critère | Bit de signe | Complément à 2 |
|---|---|---|
| Un seul zéro | Non | Oui |
| Addition correcte | Non | Oui |
| Usage actuel | Non | Standard |

En résumé, le codage avec un simple bit de signe crée deux zéros et rend l'addition fausse. Le complément à deux, utilisé par les processeurs, consiste à inverser les bits puis à ajouter 1. Sur $n$ bits, il permet de représenter les entiers de $-2^{n-1}$ à $2^{n-1}-1$, et le bit de poids fort vaut $-2^{n-1}$. On additionne alors comme pour les positifs, en ne gardant que $n$ bits.

## Pour s'entraîner

[Exercices : données binaires](/cours/2/donnees_binaires_exercices)
