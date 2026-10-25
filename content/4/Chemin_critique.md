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

Un projet est un réseau de tâches qui s'attendent. Certaines peuvent prendre du retard sans décaler la livraison, d'autres ne le peuvent pas. Le **chemin critique** est la plus longue chaîne de tâches dépendantes, en durée. Sa longueur est la **durée minimale** du projet : on ne peut pas finir plus tôt que le plus long chemin. Tout retard sur une tâche de ce chemin retarde la date de fin, d'autant. Le chef de projet les suit en priorité, parce que c'est là que le temps ne se rattrape pas.

Une **tâche critique** a une **marge totale** nulle. La marge totale est le retard qu'une tâche peut prendre sans décaler la fin du projet. La **marge libre** est plus étroite : c'est le retard possible sans décaler le début au plus tôt de la tâche suivante. Une tâche peut avoir de la marge totale et plus de marge libre, si le successeur avait lui-même un peu de jeu. Une **dépendance** dit qu'une tâche n'a pas le droit de commencer avant la fin d'une autre.

## Calculer

On liste les tâches, leur durée, leurs prédécesseurs. On dessine le réseau : dans le diagramme utilisé ici, un nœud est une tâche, un lien est une dépendance. On énumère tous les chemins qui vont des tâches sans prédécesseur jusqu'aux tâches sans successeur. On additionne les durées de chaque chemin. Le plus long est le chemin critique. S'il y en a deux de même longueur, les deux sont critiques.

Prenons une application mobile.

| Tâche | Description | Durée (jours) | Prédécesseurs |
| :--- | :--- | :--- | :--- |
| **A** | Analyse des besoins | 5 | - |
| **B** | Conception UI/UX | 8 | A |
| **C** | Développement Backend | 15 | A |
| **D** | Développement Frontend | 12 | B |
| **E** | Intégration API | 6 | C, D |
| **F** | Tests et débogage | 7 | E |
| **G** | Déploiement | 3 | F |

A dure 5 jours et ne dépend de rien. B et C partent ensuite, en parallèle. D attend B. E attend que C **et** D soient finies : elle commence à la date la plus tardive des deux.

Le chemin A, B, D, E, F, G dure $5 + 8 + 12 + 6 + 7 + 3 = 41$ jours. Le chemin A, C, E, F, G dure $5 + 15 + 6 + 7 + 3 = 36$ jours. Le plus long est le premier. Le chemin critique est A, B, D, E, F, G, et le projet ne peut pas durer moins de 41 jours. C se termine au jour 20, alors que D se termine au jour 25. E attend D. C a donc cinq jours de marge totale : un retard de C inférieur à cinq jours ne touche pas la fin. Un retard d'un jour sur B, sur D, sur E, sur F ou sur G décale la livraison d'un jour.

Le même outil sert dès qu'un livrable dépend d'un enchaînement : un déploiement, un chantier, un lancement. On l'utilise pour savoir où mettre les gens, où un glissement est encore absorbable, et quoi dire aux parties prenantes quand elles demandent pourquoi telle tâche ne peut pas attendre.

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
