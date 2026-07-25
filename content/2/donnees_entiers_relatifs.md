---
title: Entiers négatifs en Binaire
description: Représentation des nombres signés et complément à 2
level: premiere
chapter: Représentation des données
icon: "\U0001F321️"
badgeId: premiere_entiers_relatifs
prerequisites:
  - donnees_entiers_positifs
---

# Entiers négatifs en binaire

## Objectifs

- Comprendre pourquoi un simple « bit de signe » ne suffit pas
- Représenter un entier négatif en **complément à deux**
- Vérifier qu'une addition binaire donne le bon résultat

## Idée clé

Sur $n$ bits, les ordinateurs codent les entiers relatifs en **complément à deux** : le bit de poids fort vaut $-2^{n-1}$, les autres bits restent positifs. L'addition marche alors **comme pour les positifs** (sans circuit spécial pour la soustraction).

## Pourquoi coder les négatifs ?

Températures, scores, coordonnées… Il faut des nombres **signés**. On fixe d'abord la taille : 4 bits, 8 bits, 32 bits, etc. Le domaine représentable dépend de $n$.

Sur 8 bits en complément à deux : de $-128$ à $+127$.

## Première idée : bit de signe

Le bit le plus à gauche code le signe : **0** = positif, **1** = négatif ; le reste code la valeur absolue.

Exemples sur 4 bits : $0100_{(2)} = +4$, $1001_{(2)} = -1$.

Deux problèmes :

1. **Deux zéros** : $0000$ et $1000$
2. **Additions fausses** : $-13 + 13$ ne donne pas 0 avec cette convention

Cette représentation n'est donc pas utilisée pour l'arithmétique machine.

## Complément à deux

### Analogie

Comme un compteur kilométrique : après $0000$, en reculant on obtient $1111$, $1110$, … qui jouent le rôle de $-1$, $-2$, …

### Méthode (nombre négatif)

1. Écrire la **valeur absolue** en binaire (sur $n$ bits)
2. **Inverser** tous les bits (complément à 1)
3. **Ajouter 1**

Exemple : $-14$ sur 8 bits

1. $14 = 00001110_{(2)}$
2. Inversion : $11110001_{(2)}$
3. $+1$ : $11110010_{(2)}$

Donc $-14_{(10)} = 11110010_{(2)}$ (complément à 2, 8 bits).

### Vérification par addition

Sur 4 bits : $14$ ne tient pas, prenons plutôt $6 + (-4)$.

- $6 = 0110_{(2)}$
- $-4$ : $0100$ → invert $1011$ → $+1$ → $1100_{(2)}$
- Somme : $0110 + 1100 = 10010$ → on garde 4 bits : $0010_{(2)} = 2$ ✓

Les retenues hors des $n$ bits sont **ignorées**.

| Critère | Bit de signe | Complément à 2 |
|---|---|---|
| Un seul zéro | Non | Oui |
| Addition correcte | Non | Oui |
| Usage actuel | Non | Standard |

## Piège fréquent

Oublier d'**ajouter 1** après l'inversion : on obtient alors le complément à 1, pas le complément à 2. Autre erreur : changer de taille de bits en cours de calcul (4 bits vs 8 bits).

## À retenir

- Le bit de signe seul crée un double zéro et casse l'arithmétique
- Complément à 2 : inverser les bits, puis $+1$
- Sur $n$ bits : plage $[-2^{n-1}\,;\,2^{n-1}-1]$
- L'addition se fait comme pour les positifs ; on tronque à $n$ bits
- Le bit de poids fort vaut $-2^{n-1}$ en complément à 2
- C'est la représentation utilisée par les processeurs modernes

## Pour s'entraîner

[Exercices — données binaires](/cours/2/donnees_binaires_exercices)
