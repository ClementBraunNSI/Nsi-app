---
title: "Représentation des nombres en bases"
description: "Comprendre les bases 2, 10, 16 et la conversion entre elles."
level: "0"
chapter: "Representation_de_base"
icon: "🔢"
---

## Différencier comptage et dénombrement

On appelle **dénombrer** le fait de donner un par un les nombres d'une suite ou d'un ensemble.
On appelle **compter** le fait de réaliser des opérations sur des nombres.

## Définition

Une **base** est un ensemble de caractères uniques qui permettent de représenter des nombres.

Il existe un certain nombre de bases très connues :

- Base 10 : La base 10 est la base que nous utilisons quotidiennement pour compter. $B_{10}=\lbrace 0,1,2,3,4,5,6,7,8,9 \rbrace $.
- Base 12 : La base 12 est la base que nous utilisons pour remplir des boites d'oeufs, pour représenter les parties d'une journée.

La base 2 est la base utilisée par les ordinateurs pour fonctionner. Un ordinateur fonctionne grâce au courant électrique et analyse en permanence si du courant passe pour permettre de réaliser des calculs différents.

## Représentation d'un nombre

Un nombre est une combinaison de chiffres positionnés sur des colonnes.

Par exemple :  

Le nombre $154 = 1*100 + 5*10 + 4*1$.

On remarque une chose : les colonnes sont en 100 / 10 / 1 qui sont des multiples de 10.

|1000|100|10|1|
|----|---|--|-|
|$10*10*10$|$10*10$|$10*1$|$10*\frac{1}{10}$|

On peut même aller plus loin. Ces nombres sous la forme de $10*10*...*10$ sont appelés **puissances de 10**.

On peut écrire $1000 = 10^3 = 10*10*10$ ou $1000000 = 10^6 = 10*10*10*10*10*10$ où la puissance correspond au nombre de fois où l'on a multiplié ou divisé par le même nombre.

**Remarque :** Si l'on compte le nombre de fois où l'on a divisé, la puissance sera négative.  

Cependant, nous représentons nos nombres en base 10 et chaque colonne est une puissance de 10. Il y a donc un lien entre les colonnes et la base utilisée et cela nous permettra de représenter des nombres dans n'importe quelle base.

## Base 2

Au lieu d'utiliser 10 chiffres allant de 0 à 9, on va se limiter à 2 chiffres disponibles pour chacunes des colonnes.

Ces chiffres seront $B_{10} = \lbrace 0, 1 \rbrace$. Ces chiffres en base 2 sont appelés **bits**.

Pour chacune des colonnes, on ne pourra choisir que 0 ou 1 et chaque colonne correspondra à une puissance 2.

Exemple :

|8|4|2|1|
|-|-|-|-|
|1|1|0|1|

### Obtenir la représentation en base 10 d'un nombre en base 2

Pour ce nombre dans le tableau de puissances de 2, il serait écrit 1101. Pour obtenir sa valeur en base 10 pour que nous humains puissions le comprendre plus facilement, on peut utilser la technique vue pour la base 10 :

$1101_{2} = 1*8 + 1*4+ 0*2 + 1*1 = 13_{10}$.  

#### Exercice

Pour chacun de ces nombres en base 2, donner sa représentation en base 10

- $11101_2$
- $10101_2$
- $111111_2$
- $10001_2$
- $10111_2$

### Obtenir la représentation en base 2 d'un nombre en base 10

La représentation en base 2 d'un nombre est utile pour savoir comment l'ordinateur fonctionne et ce qu'il peut comprendre. On pourra anticiper des résultats, créer des programmes et plus encore en maîtrisant la représentation en base 2.

Pour obtenir la représentation en base 2 d'un nombre en base 10, il existe 2 méthodes :

#### Méthode des soustractions successives

Pour obtenir la représentation en base 2 d'un nombre en base 10, on peut utiliser la technique du tableau de puissance de 2.

**Étapes:**

1. On cherche la puissance de 2 qui se rapproche de notre nombre sans le dépasser
2. On écrit le tableau de puissances de 2 allant de la puissance trouvée à 1
3. On regarde si on peut retirer la puissance de 2 du tableau au nombre, si oui, on écrit 1 sinon 0.
4. On regarde si on peut retirer la puissance de 2 suivante au résultat de la soustraction de nombre à la puissance de 2 vue avant.

**Exemple:**

On cherche à obtenir la représentation en base 2 du nombre 154.

1. On cherche la puissance de 2 qui se rapproche : 1 -> 2 -> 4 -> 8 -> 16 -> 32 -> 64 -> **128** -> 256. Ici, ce sera 128.
2. On écrit le tableau de puissances de 2
3. Peut-on retirer 128 à 154 ? Oui. On met 1 dans la colonne correspondante et on réalise la soustraction. On ne traitera plus 154 mais 154-128 = 36.

|128|64|32|16|8|4|2|1|
|---|--|--|--|-|-|-|-|
|1||||||||
