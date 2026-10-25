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

Un **risque de projet** est un événement incertain. S'il se produit, il écarte le projet de ses objectifs : délai, coût, qualité, périmètre. L'écart peut être négatif, un développeur absent la semaine de la livraison. Il peut être positif, une bibliothèque qui fait gagner dix jours : on parle alors d'opportunité, et on la traite aussi, pour ne pas la laisser passer. Gérer les risques, c'est les identifier, les analyser, les traiter, puis les surveiller. Un registre qu'on ne rouvre plus n'est pas une gestion.

Le déroulement tient en quatre temps. On **identifie** ce qui pourrait arriver, avec l'équipe, pas seulement dans le bureau du chef de projet. On **analyse** : quelle vraisemblance, quel impact. On **traite** : quelle stratégie, qui en est responsable, pour quelle date. On **surveille** : le risque a-t-il changé, la parade a-t-elle été faite. Un risque nouveau en cours de sprint entre dans le même circuit. Il n'attend pas le bilan de fin.

## La criticité, pour savoir par quoi commencer

On croise une probabilité et un impact, chacun noté de 1 à 5. La **criticité** est le produit. Elle ne mesure pas une probabilité au sens des mathématiques. Elle classe les risques pour décider où passer le temps.

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

7 n'apparaît pas : ce n'est pas un produit de deux entiers entre 1 et 5. On ne « arrondit » pas un 6 vers le moyen pour le faire entrer dans une case.

L'échelle de probabilité se lit ainsi. 1, très improbable. 2, peu probable. 3, possible. 4, probable. 5, très probable. L'impact suit la même graduation, du très faible au très fort, selon ce que l'événement ferait au délai, au coût, à la qualité ou au périmètre. Deux personnes qui notent seules ne trouvent pas toujours le même chiffre. On note ensemble, et l'on écrit pourquoi.

## Travaux dirigés : calcul de risques

### Exercice 1 : Calcul de la criticité

Pour chacun des risques suivants, calculez la criticité et déterminez le niveau de risque.

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

Proposez une action préventive (avant l'incident) et une action corrective (après l'incident) pour le risque suivant :

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

Vous êtes chef de projet sur le développement d'une application mobile. Le lancement est prévu dans 2 semaines.
Votre développeur principal tombe malade pour une durée indéterminée.

1. Qualifiez ce risque (type, probabilité, impact).
2. Quelle est la criticité si aucun backup n'est prévu ?
3. Quelle action immédiate proposez-vous ?

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
