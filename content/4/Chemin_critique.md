---
title: Le Chemin Critique
description: Méthode de planification et d'optimisation de projets
level: '4'
chapter: 'BTS SIO 2 : B1 - Support et mise à disposition de services informatiques'
icon: "target"
prerequisites:
  - Gestion_risques
audience: public
---

# Le chemin critique

Un projet est un ensemble de tâches qui dépendent les unes des autres. Certaines peuvent prendre du retard sans décaler la livraison, d'autres non. Le **chemin critique** est la plus longue chaîne de tâches dépendantes, en durée. Sa longueur correspond à la **durée minimale** du projet, puisqu'on ne peut pas finir avant la fin de ce chemin. Tout retard sur l'une de ses tâches retarde d'autant la date de fin. Le chef de projet surveille donc ces tâches en priorité, car un retard pris sur elles ne peut pas être rattrapé.

Une **tâche critique** a une **marge totale** nulle. La marge totale est le retard qu'une tâche peut prendre sans décaler la fin du projet. La **marge libre** est plus réduite : c'est le retard possible sans décaler le début au plus tôt de la tâche suivante. Une tâche peut donc avoir une marge totale sans avoir de marge libre, quand c'est la tâche suivante qui dispose d'une marge. Enfin, une **dépendance** indique qu'une tâche ne peut pas commencer avant la fin d'une autre.

## Déterminer le chemin critique

On commence par lister les tâches, avec leur durée et leurs prédécesseurs, puis on dessine le réseau : dans le diagramme utilisé ici, chaque nœud est une tâche et chaque lien une dépendance. On énumère ensuite tous les chemins qui vont des tâches sans prédécesseur jusqu'aux tâches sans successeur, et on additionne les durées de chaque chemin. Le plus long est le chemin critique. Si deux chemins ont la même longueur maximale, ils sont tous les deux critiques.

Prenons l'exemple du développement d'une application mobile.

| Tâche | Description | Durée (jours) | Prédécesseurs |
| :--- | :--- | :--- | :--- |
| **A** | Analyse des besoins | 5 | - |
| **B** | Conception UI/UX | 8 | A |
| **C** | Développement Backend | 15 | A |
| **D** | Développement Frontend | 12 | B |
| **E** | Intégration API | 6 | C, D |
| **F** | Tests et débogage | 7 | E |
| **G** | Déploiement | 3 | F |

A dure 5 jours et ne dépend d'aucune autre tâche. B et C commencent ensuite en parallèle, et D attend la fin de B. E attend que C **et** D soient terminées : elle commence donc à la date de fin la plus tardive des deux.

Le chemin A, B, D, E, F, G dure $5 + 8 + 12 + 6 + 7 + 3 = 41$ jours. Le chemin A, C, E, F, G dure $5 + 15 + 6 + 7 + 3 = 36$ jours. Le premier est le plus long : le chemin critique est donc A, B, D, E, F, G, et le projet ne peut pas durer moins de 41 jours. C se termine au jour 20, alors que D se termine au jour 25, et E doit attendre D. C a donc cinq jours de marge totale : un retard d'au plus cinq jours sur C ne change pas la date de fin. En revanche, un retard d'un jour sur B, D, E, F ou G décale la livraison d'un jour.

Cette méthode s'applique dès qu'un livrable dépend d'un enchaînement de tâches, comme un déploiement, un chantier ou le lancement d'un produit. Elle permet de savoir où affecter les personnes et quelles tâches peuvent prendre un peu de retard. Elle aide aussi à expliquer aux parties prenantes pourquoi certaines tâches ne peuvent pas attendre.

## Exercices pratiques

### Exercice 1 : Mise en place d'un serveur web

**Contexte :** Un projet de mise en place d'un serveur web est découpé en tâches :

| Tâche | Description | Durée (jours) | Prédécesseurs |
| :--- | :--- | :--- | :--- |
| **A** | Installer Linux | 2 | - |
| **B** | Configurer le réseau | 1 | A |
| **C** | Installer Apache | 2 | A |
| **D** | Installer la base MySQL | 3 | A |
| **E** | Déployer le site web | 2 | B, C, D |
| **F** | Tests et validation | 1 | E |

**Questions :**

1. **Tracer le graphe PERT** : Représenter les tâches et leurs dépendances sous forme de réseau.
2. **Calculer tous les chemins possibles** : Identifier tous les chemins du début à la fin et calculer leur durée.
3. **Déterminer le chemin critique** : Trouver le chemin le plus long et la durée totale du projet.

### Exercice 2 : Développement d'une application interne
