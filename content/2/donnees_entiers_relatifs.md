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

Les entiers positifs tiennent dans des puissances de 2. Une température, un score, une coordonnée descendent aussi en dessous de zéro. Il faut donc coder des entiers **signés**, et d'abord fixer la taille : 4 bits, 8 bits, 32 bits. Le domaine représentable dépend de ce choix. Sur 8 bits, le codage qu'utilisent les processeurs va de $-128$ à $+127$.

## Le bit de signe ne suffit pas

La première idée est simple. Le bit de gauche dit le signe : **0** pour un positif, **1** pour un négatif. Les autres bits codent la valeur absolue. Sur 4 bits, $0100_{(2)}$ vaut $+4$, et $1001_{(2)}$ se lit « négatif, et 001 », donc $-1$.

Deux défauts rendent cette convention inutilisable pour calculer. Il existe **deux zéros** : $0000$ et $1000$, « plus zéro » et « moins zéro ». Et l'addition ordinaire ne tombe pas juste. Avec cette écriture, $-13 + 13$ ne donne pas 0. Il faudrait un circuit spécial pour la soustraction. Les machines n'ont pas choisi ce chemin.

## Le complément à deux

Le **complément à deux** règle les deux problèmes d'un coup. Sur $n$ bits, le bit de poids fort pèse $-2^{n-1}$, et les autres bits gardent leur poids positif habituel. L'addition se fait alors **comme pour les positifs**. La retenue qui sort des $n$ bits est ignorée. Pas de circuit à part pour soustraire : soustraire $b$, c'est ajouter l'opposé de $b$.

L'image utile est le compteur kilométrique. Après $0000$, si l'on recule d'un cran, tous les rouleaux passent à 9, ou ici à 1. $1111$ joue le rôle de $-1$, $1110$ celui de $-2$, et ainsi de suite. On n'a qu'un seul zéro, $0000$. La plage sur $n$ bits est $[-2^{n-1}\,;\,2^{n-1}-1]$.

Pour écrire un négatif :

1. Écrire la **valeur absolue** en binaire, sur les $n$ bits, avec les zéros de tête.
2. **Inverser** tous les bits. C'est le complément à un.
3. **Ajouter 1**.

Exemple : $-14$ sur 8 bits.

1. $14 = 00001110_{(2)}$
2. Inversion : $11110001_{(2)}$
3. $+1$ : $11110010_{(2)}$

Donc $-14_{(10)} = 11110010_{(2)}$ en complément à deux sur 8 bits. Oublier le $+1$ laisse le complément à un, qui n'est pas le codage de la machine. Changer de taille en cours de route non plus : un nombre sur 4 bits n'a pas les mêmes zéros de tête que sur 8 bits, et l'inversion ne donne pas le même résultat.

On vérifie par l'addition. Sur 4 bits, on prend $6 + (-4)$, puisque 14 ne tient pas dans 4 bits en positif.

- $6 = 0110_{(2)}$
- $-4$ : valeur absolue $0100$, inversion $1011$, plus un $\rightarrow 1100_{(2)}$
- Somme : $0110 + 1100 = 10010$. On ne garde que 4 bits : $0010_{(2)} = 2$.

La retenue sortie du quatrième bit est jetée. Le résultat est bien $6 - 4 = 2$.

| Critère | Bit de signe | Complément à 2 |
|---|---|---|
| Un seul zéro | Non | Oui |
| Addition correcte | Non | Oui |
| Usage actuel | Non | Standard |

En résumé, le bit de signe seul fabrique deux zéros et casse l'addition. Le complément à deux inverse les bits puis ajoute 1. Sur $n$ bits, on représente de $-2^{n-1}$ à $2^{n-1}-1$. On additionne comme pour les positifs et on tronque à $n$ bits. Le bit de poids fort vaut $-2^{n-1}$. C'est le codage des processeurs.

## Pour s'entraîner

[Exercices : données binaires](/cours/2/donnees_binaires_exercices)
