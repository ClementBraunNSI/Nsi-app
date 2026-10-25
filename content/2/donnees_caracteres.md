---
title: Représentation des caractères
description: Codage ASCII et Unicode (UTF-8)
level: premiere
chapter: Représentation des données
icon: "type"
badgeId: premiere_caracteres
prerequisites:
  - donnees_entiers_positifs
audience: public
---

# Représentation des caractères

La machine ne stocke que des bits. Une lettre n'est donc pas un dessin : c'est un **nombre**, qu'on affiche ensuite comme un glyphe. « A », « é », « 字 » sont trois symboles, et chacun a un code. Le système de règles qui relie le nombre au symbole s'appelle un **codage**.

## Un caractère est un entier

Lettre, chiffre, ponctuation, espace, emoji : pour le processeur, ce sont des entiers. En ASCII comme en Unicode, la lettre **A** a le code **65**, qu'on écrit aussi $41_{(16)}$. Changer de symbole, c'est changer de nombre. Le glyphe affiché à l'écran est le dessin que la police associe à ce nombre.

## ASCII, cent vingt-huit places

**ASCII** (*American Standard Code for Information Interchange*) code un caractère sur **7 bits**. Sept bits donnent $2^7 = 128$ codes, de 0 à 127. Cela suffit pour l'alphabet latin sans accent, les chiffres, la ponctuation, et quelques caractères de contrôle comme l'espace ou le retour à la ligne.

| Caractère | Décimal | Hex |
|:---------:|:-------:|:---:|
| espace | 32 | 20 |
| `0` | 48 | 30 |
| `@` | 64 | 40 |
| `A` | 65 | 41 |
| `a` | 97 | 61 |

Le chiffre `0` n'est pas le nombre 0 : son code est 48. `A` et `a` ne partagent pas le même code. Trente-deux places les séparent, de 65 à 97. La limite arrive vite. Il n'y a pas de place pour `é`, ni pour un alphabet non latin. C'est pour cela qu'on est passé à un catalogue plus grand.

## Unicode nomme, UTF-8 range

**Unicode** attribue à chaque symbole un **point de code** unique, noté `U+XXXX` en hexadécimal. `A` est U+0041, le même 65 qu'en ASCII. `é` est U+00E9. `字` est U+5B57. Le point de code est un numéro dans le catalogue. Il ne dit pas encore combien d'octets occuperont le fichier.

**UTF-8** est un **encodage** : il transforme le point de code en une suite d'octets, de un à quatre selon le caractère. C'est le format dominant sur le Web, et celui que Python utilise par défaut pour les chaînes qu'on écrit dans un fichier en `utf-8`. Les caractères ASCII tiennent sur **un octet**, ce qui garde les vieux fichiers lisibles. Les caractères plus riches en prennent plusieurs.

```python
>>> ord("A")
65
>>> hex(ord("é"))
'0xe9'
>>> "é".encode("utf-8")
b'\xc3\xa9'   # deux octets en UTF-8
```

`ord` donne le point de code. `chr` fait le chemin inverse, du nombre vers le caractère. `.encode("utf-8")` produit les octets réellement écrits. Le point de code de `é` est U+00E9, mais en UTF-8 ce n'est pas l'octet `E9` tout seul : ce sont les deux octets `\xc3\xa9`. Confondre le numéro du catalogue et la suite d'octets est le piège du chapitre. Un fichier dont on ignore l'encodage s'affiche avec de mauvais accents, parce qu'on regroupe les octets selon la mauvaise règle. En pratique, on choisit UTF-8 et on le dit.

Table de référence : [charset.org/utf-8](https://www.charset.org/utf-8)

En résumé, un caractère est un symbole relié à un nombre. ASCII code 128 caractères sur 7 bits, ceux de l'alphabet latin de base. Unicode numérote tous les symboles par des points de code. UTF-8 range ces numéros sur 1 à 4 octets, en restant compatible avec ASCII. En Python, `ord`, `chr` et `.encode("utf-8")` font voir la différence.

## Pour s'entraîner

[Exercices : données binaires](/cours/2/donnees_binaires_exercices)
