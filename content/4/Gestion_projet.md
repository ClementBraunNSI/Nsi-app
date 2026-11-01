---
title: Gestion de Projet Informatique
description: 'Fondamentaux de la gestion de projet, rôles, méthodes et outils'
level: '4'
chapter: 'BTS SIO 2 : B1 - Support et mise à disposition de services informatiques'
icon: "chart-column"
prerequisites:
  - Patrimoine_informatique
audience: public
---

# Gestion de projet informatique

Ce cours relève du bloc 1 du BTS SIO. La mise en place d'un site, d'une application ou d'un réseau passe par un **projet**, c'est-à-dire un ensemble d'activités temporaires, uniques et coordonnées, menées pour atteindre un objectif précis, dans un délai fixé et avec des ressources limitées. Un projet a un début et une fin : une fois le projet terminé, son résultat n'est plus en construction, il est exploité.

Quatre caractéristiques distinguent un projet du travail courant. L'**objectif** est un résultat attendu, écrit, mesurable et atteignable dans le temps imparti. La **temporalité** fixe une date de début et une date de fin. L'**unicité** signifie que le livrable n'existait pas sous cette forme : refaire le même site pour un autre client constitue un autre projet. Enfin, les **ressources** (budget, personnes, moyens techniques) sont limitées, et on ne peut pas en ajouter sans le décider explicitement.

Trois contraintes sont liées dans ce qu'on appelle le **triangle** qualité, délai, coût : en modifier une a des conséquences sur les deux autres. Raccourcir le délai sans retirer de fonctionnalités augmente le coût ou dégrade la qualité. Si l'on promet les trois à la fois sans faire de choix, ce choix finit par s'imposer plus tard, en général au moment de la recette.

## Les rôles dans un projet

Une équipe fonctionne bien quand les compétences se complètent et que chacun sait ce que l'on attend de lui. Les rôles suivants ne sont pas tous présents en même temps : le chef de projet structure un projet mené de façon classique, alors que le product owner et le scrum master apparaissent quand on travaille en Scrum. Ils sont présentés ici car on les rencontre selon la méthode retenue.

Le **chef de projet** planifie et coordonne. Il suit les risques, les délais et le budget, et il rend compte aux parties prenantes.

Le **product owner** représente le besoin. Il décrit les fonctionnalités, fixe leur ordre de priorité, valide ce qui est livré et fait le lien avec les utilisateurs. Il ne distribue pas les tâches techniques une par une.

Le **scrum master** veille au respect du cadre agile. Il anime les cérémonies, lève les obstacles et aide l'équipe à appliquer la méthode. Il ne décide ni du contenu ni des estimations.

Les **développeurs** conçoivent et écrivent le code, réalisent les tests unitaires, rédigent la documentation et estiment la charge de travail des tâches demandées.

Les **testeurs** préparent les plans de tests, les exécutent, signalent les anomalies, et vérifient que la qualité obtenue correspond à celle qui était prévue.

Le **designer** UX/UI conçoit le parcours des utilisateurs, réalise les maquettes, les fait tester et veille à l'accessibilité.

Cette organisation ne fonctionne que si l'information circule. Un retard passé sous silence, un besoin mal compris ou des tests repoussés à la toute fin déséquilibrent le triangle sans que personne l'ait décidé.

## Le diagramme de Gantt

Le **diagramme de Gantt** place chaque tâche sur une échelle de temps. On y lit les dates de début et de fin, les liens entre les tâches (ce qui doit finir avant qu'autre chose commence, ce qui peut avancer en parallèle) et l'écart entre le prévu et le réalisé. La plus longue chaîne de tâches dépendantes est le **chemin critique** : elle fixe la durée minimale du projet, et raccourcir une tâche qui n'en fait pas partie ne raccourcit pas le projet.

Voici le planning du développement d'une application web sur douze semaines. Les cases marquées sont les semaines où la tâche est ouverte.

| Tâches | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | S9 | S10 | S11 | S12 |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **Analyse des besoins** | ██ | ██ | | | | | | | | | | |
| **Conception UX/UI** | | ██ | ██ | ██ | | | | | | | | |
| **Dév. Backend** | | | | ██ | ██ | ██ | ██ | | | | | |
| **Dév. Frontend** | | | | | ██ | ██ | ██ | ██ | | | | |
| **Tests & Intégration** | | | | | | | | ██ | ██ | | | |
| **Déploiement** | | | | | | | | | | ██ | | |

L'analyse occupe les deux premières semaines. La conception commence dès la semaine 2 et se poursuit jusqu'à la semaine 4. Le backend démarre alors, suivi du frontend une semaine plus tard, et les deux avancent en parallèle. Les tests n'ont lieu qu'aux semaines 8 et 9, et le déploiement à la semaine 10. Le diagramme montre aussi les risques : si la conception prend du retard, le backend, qui en dépend, est retardé lui aussi, et la date de déploiement recule.

## Cycle en V et méthodes agiles

La **méthode en V** est séquentielle : on ne passe à la phase suivante qu'une fois la précédente validée. On descend du besoin vers la conception, puis vers le code, avant de remonter par les tests, chaque niveau de test correspondant à un niveau de conception. Le cadre est strict et la documentation importante. Cette méthode convient quand le périmètre est connu tôt, par exemple grâce à un contrat ou à une réglementation. Son défaut est l'effet tunnel : on ne voit le logiciel fonctionner qu'à la fin, et un changement de besoin coûte cher, car il oblige à reprendre toutes les étapes.

Les **méthodes agiles**, comme Scrum ou Kanban, fonctionnent par itérations. On livre souvent, on montre le résultat et on ajuste le contenu du cycle suivant, ce qui permet de voir plus tôt si l'on fait fausse route. Cela suppose que le client reste disponible pour examiner ce qui est livré. La documentation y est plus légère : elle accompagne le logiciel au lieu d'être entièrement écrite avant lui. Le cours sur les méthodes agiles détaille les rôles et les cérémonies. Pour choisir, on retiendra que le cycle en V convient à un périmètre stable qui exige des preuves formelles, et l'agilité à un besoin qui se précise en voyant le logiciel fonctionner.

## Les outils et Git

Quatre familles d'outils suffisent pour piloter un projet. Le suivi des tâches se fait avec Trello, Jira ou Asana, qui gèrent des tickets, des colonnes et des sprints. Les échanges rapides passent par Slack, Teams ou Discord. Les spécifications et les comptes rendus sont rédigés dans Confluence, Notion ou un wiki. Enfin, le code est versionné avec **Git** et hébergé sur GitLab ou GitHub.

Git mérite d'être pratiqué, car c'est lui qui permet à plusieurs personnes de travailler sur le même code sans écraser le travail des autres. On commence par récupérer le dépôt.

```bash
git clone https://github.com/projet/repo.git
# Télécharge le dépôt distant sur votre machine
```

On ne travaille pas directement sur la branche principale. On ouvre une branche pour la fonctionnalité en cours, le temps de la terminer.

```bash
git checkout -b feature/ma-fonctionnalite
# Crée une branche dédiée pour travailler isolément
```

Quand le morceau est prêt, on l'enregistre localement. Le message de commit doit décrire ce qui a été ajouté, plutôt qu'un vague « modifs ».

```bash
git add .
git commit -m "Ajout de la fonctionnalité de login"
# Enregistre les modifications localement
```

Puis on envoie la branche sur le serveur, pour qu'une autre personne puisse la relire avant de la fusionner.

```bash
git push origin feature/ma-fonctionnalite
# Envoie la branche sur le serveur distant
```

Au quotidien, l'utilisation de Git se résume à cloner, créer une branche, commiter et pousser. Le reste du pilotage (qui décide du contenu, dans quel ordre, avec quelle méthode) se fait en dehors de ces commandes. Git conserve l'historique, mais il ne remplace ni le diagramme de Gantt, ni le product owner, ni les échanges qui permettent de vérifier que la fonctionnalité répond au besoin.
