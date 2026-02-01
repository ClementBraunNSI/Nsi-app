---
title: Entiers négatifs en Binaire
description: Représentation des nombres signés et complément à 2
level: premiere
chapter: 2
icon: minus-square
---

# Entiers négatifs en Binaire

## Les entiers négatifs

Le cours précédent a permis d'expliquer comment représenter les **nombres entiers positifs** en base 2. Cependant, toutes les grandeurs ne sont pas exclusivement positives (température, coordonnées, etc.). Pour pouvoir réaliser des simulations ou des traitements, il va falloir pouvoir représenter les **nombres négatifs**.

## Première tentative : le bit de signe

Une première technique de représentation des nombres négatifs est d'ajouter un **bit de poids fort** (tout à gauche) qui représente le signe :
*   **0** représente un nombre **positif**
*   **1** représente un nombre **négatif**

**Exemples :**
*   $1001_{2}$ représente sur 4 bits signés le chiffre -1
*   $0100_{2}$ représente sur 4 bits signés le chiffre +4

### Problèmes identifiés

Cela pourrait sembler être une bonne tentative, cependant **deux problèmes majeurs** se posent :

1.  **Double représentation du zéro :**
    *   $1000_{2}$ (zéro "négatif")
    *   $0000_{2}$ (zéro "positif")
    Avoir 2 représentations pour un même chiffre n'est pas concevable.

2.  **Opérations incorrectes :**
    Les opérations arithmétiques ne donnent pas les bons résultats.
    Exemple : $-13 + 13$ sur 5 bits.
    $11101_{2} (-13) + 01101_{2} (13) = 01010_{2} (+10)$
    Résultat attendu : 0. Résultat obtenu : 10. ❌

> **Conclusion :** Cette représentation n'est pas utilisable pour les calculs informatiques.

## Seconde tentative : le complément à 2

Le **complément à 2** est une technique qui a été proposée pour représenter les nombres négatifs de manière efficace et sans ambiguïté.

### Analogie : le compteur kilométrique

On peut illustrer cela comme un **compteur kilométrique de vieille voiture** :
*   Si on recule au kilomètre 000000, le compteur étant circulaire, en reculant d'un kilomètre de plus, ce compteur va afficher : 999999.
*   Cette valeur 999999 peut donc représenter le kilomètre -1.

**Principe de représentation :**
$1_{10} = 0001_{2} \rightarrow 0_{10} = 0000_{2} \rightarrow -1_{10} = 1111_{2} \rightarrow -2_{10} = 1110_{2} \rightarrow ...$

### Méthode de conversion

**Étapes pour convertir un nombre négatif :**
1.  Convertir la valeur absolue du nombre en base 2.
2.  Inverser chaque bit : 0 devient 1 et inversement (Complément à 1).
3.  Ajouter 1 à la représentation binaire du nombre inversé.

**Exemple : Représenter -14 en base 2 (sur 8 bits)**
1.  $14_{10} = 00001110_{2}$
2.  Inversion : $11110001_{2}$
3.  Ajout de 1 : $11110001_{2} + 1_{2} = 11110010_{2}$
Donc $-14_{10} = 11110010_{2}$ (en complément à 2 sur 8 bits).

### Vérification des opérations

Testons si cette méthode résout le problème des opérations.
**Test : 14 + (-4) sur 4 bits**
$-4_{10} = 1100_{2}$ (complément à 2)
$14_{10} = 1110_{2}$

Calcul : $1110_{2} + 1100_{2} = 11010_{2}$

Sur 4 bits : on garde les 4 derniers bits : $1010_{2}$
Résultat : $1010_{2} = 10_{10}$ ✅
Vérification : $14 + (-4) = 10$

> **Succès !** Le complément à 2 permet de réaliser toutes les opérations possibles sans erreur. C'est la méthode utilisée dans tous les ordinateurs modernes.

### Comparaison des méthodes

| Critère | Bit de signe | Complément à 2 |
|---|---|---|
| Représentation unique du zéro | ❌ Non (deux représentations) | ✅ Oui (une seule) |
| Opérations arithmétiques correctes | ❌ Non | ✅ Oui |
| Simplicité d'implémentation | ⚠️ Complexe | ✅ Simple |
| Utilisation actuelle | ❌ Abandonnée | ✅ Standard universel |
