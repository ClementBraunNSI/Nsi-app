---
title: Gestion des Risques
description: 'Identification, analyse et traitement des risques en projet informatique'
level: '4'
chapter: 'BTS SIO 2 : B1 - Support et mise à disposition de services informatiques'
icon: ⚠️
prerequisites:
  - ITIL
---

# ⚠️ Gestion des Risques
**BTS SIO SLAM - Bloc 1 : Gestion des risques en projet informatique**

## 🎯 Fondamentaux de la Gestion des Risques

> **Qu'est-ce qu'un Risque Projet ?**
>
> Un risque projet est un **événement incertain** qui, s'il se produit, peut avoir un **impact positif ou négatif** sur les objectifs du projet (délais, coûts, qualité, périmètre). La gestion des risques consiste à les **identifier**, les **analyser**, les **traiter** et les **surveiller**.

En gestion de projet informatique, la gestion des risques est cruciale pour anticiper les problèmes et assurer le succès des projets. Elle démontre la maturité professionnelle et la capacité à gérer l'incertitude dans un environnement technologique complexe.

### Processus de Gestion des Risques

1. **Identification** : Détecter les risques potentiels
2. **Analyse** : Évaluer probabilité et impact
3. **Traitement** : Définir les stratégies
4. **Surveillance** : Suivre et contrôler

## 📊 Matrice des Risques

> **Évaluation Probabilité × Impact**
>
> La matrice des risques permet de **prioriser** les risques en croisant leur **probabilité d'occurrence** avec leur **impact** sur le projet. Cette visualisation aide à concentrer les efforts sur les risques les plus critiques.

### Matrice Simplifiée (Impact vs Probabilité)

| Probabilité \ Impact | 1 - Très Faible | 2 - Faible | 3 - Moyen | 4 - Fort | 5 - Très Fort |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **5 - Très Forte** | Moyen (5) | Moyen (10) | Élevé (15) | Critique (20) | Critique (25) |
| **4 - Forte** | Faible (4) | Moyen (8) | Élevé (12) | Élevé (16) | Critique (20) |
| **3 - Moyenne** | Faible (3) | Faible (6) | Moyen (9) | Élevé (12) | Élevé (15) |
| **2 - Faible** | Faible (2) | Faible (4) | Faible (6) | Moyen (8) | Élevé (10) |
| **1 - Très Faible** | Faible (1) | Faible (2) | Faible (3) | Faible (4) | Moyen (5) |

### 📐 Règles de Calcul de la Criticité

**Formule :** Criticité = Probabilité × Impact

**Seuils de criticité :**
* **Risque Faible :** 1 à 6 points
* **Risque Moyen :** 8 à 9 points
* **Risque Élevé :** 10 à 16 points
* **Risque Critique :** 20 à 25 points

**Actions recommandées :**
* **Faible (1-6) :** Surveillance passive
* **Moyen (8-9) :** Plan de contingence
* **Élevé (10-16) :** Actions préventives obligatoires
* **Critique (20-25) :** Traitement immédiat prioritaire

### Échelle de Probabilité
* **1 - Très Faible** : Très improbable
* **2 - Faible** : Peu probable
* **3 - Moyenne** : Possible
* **4 - Forte** : Probable
* **5 - Très Forte** : Très probable

## 📝 Travaux Dirigés : Calcul de Risques

### Exercice 1 : Calcul de la Criticité

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

### Exercice 2 : Stratégies de Mitigation

Proposez une action préventive (avant l'incident) et une action corrective (après l'incident) pour le risque suivant :

**Risque : Panne disque dur serveur**
Le serveur de fichiers principal subit une défaillance matérielle de son disque dur.

#### Pistes de solution

**Préventif (Réduire la probabilité ou l'impact avant) :**
* Mise en place d'un système RAID (Redondance de disques)
* Surveillance SMART des disques pour anticiper les pannes
* Planification de sauvegardes automatiques régulières

**Correctif (Réduire l'impact après survenance) :**
* Restauration des données depuis la dernière sauvegarde
* Basculement sur un serveur de secours (Failover)
* Remplacement à chaud du disque défectueux (Hot Swap)

### Exercice 3 : Analyse de Cas Concret

Vous êtes chef de projet sur le développement d'une application mobile. Le lancement est prévu dans 2 semaines.
Votre développeur principal tombe malade pour une durée indéterminée.

1. Qualifiez ce risque (Type, Probabilité, Impact).
2. Quelle est la criticité si aucun backup n'est prévu ?
3. Quelle action immédiate proposez-vous ?

#### Analyse

1. **Type :** Risque Humain / Ressource
   **Probabilité :** 3 (Moyenne - cela arrive)
   **Impact :** 5 (Très Fort - blocage du projet critique)

2. **Criticité :** 3 × 5 = 15 => **Risque Élevé**

3. **Actions possibles :**
   * Redistribuer les tâches critiques aux autres développeurs (surcharge temporaire).
   * Faire appel à un freelance ou un prestataire en urgence (coût supplémentaire).
   * Réduire le périmètre fonctionnel pour la V1 (dégrader la qualité/contenu pour tenir le délai).
   * Négocier un report de la date de lancement (dégrader le délai).
