---
title: Gestion des Risques
description: 'Identification, analyse et traitement des risques en projet informatique'
level: '4'
chapter: 'BTS SIO 2 : B1 - Support et mise à disposition de services informatiques'
icon: "triangle-alert"
prerequisites:
  - ITIL
audience: public
---

# Gestion des risques

**BTS SIO, Bloc 1 : gestion des risques en projet informatique**

Un **risque de projet** est un événement incertain qui, s'il se produit, écarte le projet de ses objectifs de délai, de coût, de qualité ou de périmètre. L'écart peut être négatif, comme l'absence d'un développeur la semaine de la livraison. Il peut aussi être positif, comme une bibliothèque qui fait gagner dix jours : on parle alors d'opportunité, et on la traite aussi pour ne pas la laisser passer. Gérer les risques consiste à les identifier, à les analyser, à les traiter, puis à les surveiller dans la durée, car un registre que personne ne rouvre ne sert à rien.

La démarche se déroule en quatre étapes. On **identifie** d'abord ce qui pourrait arriver, avec toute l'équipe et pas seulement le chef de projet. On **analyse** ensuite la probabilité et l'impact de chaque risque. On **traite** le risque en choisissant une stratégie, un responsable et une échéance. Enfin, on **surveille** l'évolution du risque et la mise en place des actions prévues. Un nouveau risque apparu en cours de sprint suit le même circuit, sans attendre le bilan final.

## La criticité

On croise une probabilité et un impact, notés chacun de 1 à 5. La **criticité** est leur produit. Ce n'est pas une probabilité au sens mathématique : elle sert seulement à classer les risques pour savoir lesquels traiter en priorité.

| Probabilité \ Impact | 1 - Très Faible | 2 - Faible | 3 - Moyen | 4 - Fort | 5 - Très Fort |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **5 - Très Forte** | Moyen (5) | Moyen (10) | Élevé (15) | Critique (20) | Critique (25) |
| **4 - Forte** | Faible (4) | Moyen (8) | Élevé (12) | Élevé (16) | Critique (20) |
| **3 - Moyenne** | Faible (3) | Faible (6) | Moyen (9) | Élevé (12) | Élevé (15) |
| **2 - Faible** | Faible (2) | Faible (4) | Faible (6) | Moyen (8) | Élevé (10) |
| **1 - Très Faible** | Faible (1) | Faible (2) | Faible (3) | Faible (4) | Moyen (5) |

**Criticité = probabilité × impact.**

Les produits utiles vont de 1 à 25. Les seuils du cours :

- risque **faible** : 1 à 6, surveillance passive
- risque **moyen** : 8 à 9, un plan de contingence
- risque **élevé** : 10 à 16, des actions préventives obligatoires
- risque **critique** : 20 à 25, un traitement immédiat

La valeur 7 n'apparaît pas, car ce n'est pas le produit de deux entiers compris entre 1 et 5. Il ne faut donc pas « arrondir » un 6 vers le niveau moyen.

L'échelle de probabilité va de 1 à 5 : 1 signifie très improbable, 2 peu probable, 3 possible, 4 probable et 5 très probable. L'impact suit la même graduation, du très faible au très fort, selon ce que l'événement ferait au délai, au coût, à la qualité ou au périmètre. Deux personnes qui notent seules ne trouvent pas toujours la même valeur : il vaut donc mieux noter ensemble, en justifiant chaque note par écrit.

## Travaux dirigés : calcul de risques

### Exercice 1 : Calcul de la criticité

Pour chacun des risques suivants, calculer la criticité et déterminer le niveau de risque.

1. **Risque A : Perte de données non sauvegardées**
   - Probabilité : 2 (Faible)
   - Impact : 5 (Très Fort)

2. **Risque B : Retard de livraison d'un module mineur**
   - Probabilité : 4 (Forte)
   - Impact : 2 (Faible)

3. **Risque C : Indisponibilité du serveur principal**
   - Probabilité : 3 (Moyenne)
   - Impact : 5 (Très Fort)

#### Correction

| Risque | Calcul | Résultat | Niveau |
| :--- | :--- | :--- | :--- |
| A | 2 × 5 | 10 | **Élevé** |
| B | 4 × 2 | 8 | **Moyen** |
| C | 3 × 5 | 15 | **Élevé** |

### Exercice 2 : Stratégies de mitigation

Proposer une action préventive (avant l'incident) et une action corrective (après l'incident) pour le risque suivant :

**Risque : Panne disque dur serveur**
Le serveur de fichiers principal subit une défaillance matérielle de son disque dur.

#### Pistes de solution

**Préventif (réduire la probabilité ou l'impact avant) :**
- Mise en place d'un système RAID (redondance de disques)
- Surveillance SMART des disques pour anticiper les pannes
- Planification de sauvegardes automatiques régulières

**Correctif (réduire l'impact après survenance) :**
- Restauration des données depuis la dernière sauvegarde
- Basculement sur un serveur de secours (failover)
- Remplacement à chaud du disque défectueux (hot swap)

### Exercice 3 : Analyse de cas concret

Un chef de projet pilote le développement d'une application mobile. Le lancement est prévu dans 2 semaines.
Son développeur principal tombe malade pour une durée indéterminée.

1. Qualifier ce risque (type, probabilité, impact).
2. Quelle est la criticité si aucun backup n'est prévu ?
3. Quelle action immédiate proposer ?

#### Analyse

1. **Type :** risque humain / ressource.
   **Probabilité :** 3 (moyenne, cela arrive).
   **Impact :** 5 (très fort, blocage du projet à un moment critique).

2. **Criticité :** 3 × 5 = 15, donc un risque **élevé**.

3. **Actions possibles :**
   - Redistribuer les tâches critiques aux autres développeurs, au prix d'une surcharge temporaire.
   - Faire appel à un freelance ou à un prestataire, au prix d'un coût supplémentaire.
   - Réduire le périmètre de la première version, pour tenir la date avec moins de fonctionnalités.
   - Négocier un report de la date de lancement.
