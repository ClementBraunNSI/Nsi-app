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

Ce cours relève du bloc 1 du BTS SIO. Un service informatique ne s'installe pas tout seul. Derrière un site, une application, un réseau mis en place, il y a un **projet** : un ensemble d'activités temporaires, uniques et coordonnées, menées pour atteindre un objectif précis, dans un délai fixé, avec des ressources limitées. Le projet a un début et une fin. Passé cette fin, on n'est plus en train de le construire. On l'exploite.

Quatre traits le séparent du travail courant. L'**objectif** est un résultat attendu, écrit, mesurable, et tenable dans le temps imparti. La **temporalité** pose une date de début et une date de fin. L'**unicité** veut dire que le livrable n'existait pas tel quel : refaire le même site pour un autre client, c'est un autre projet. Les **ressources** (budget, personnes, moyens techniques) sont comptées. On ne peut pas en ajouter sans le décider.

Ces trois contraintes se tiennent dans ce qu'on appelle le **triangle** qualité, délai, coût. En bouger un déplace les deux autres. Raccourcir le délai sans retirer de fonctionnalités augmente le coût, ou abîme la qualité. Promettre les trois en même temps sans le dire, c'est laisser le projet choisir à votre place, plus tard, en général au moment de la recette.

## Qui fait quoi

Une équipe tient quand les compétences se complètent et quand chacun sait ce qu'on attend de lui. Les rôles qui suivent ne sont pas tous présents en même temps. Le chef de projet structure un projet mené de façon classique. Le product owner et le scrum master apparaissent quand on travaille en Scrum. On les nomme ici parce qu'on les croise selon la méthode retenue.

Le **chef de projet** planifie et coordonne. Il suit les risques, les délais et le budget, et il rend compte aux parties prenantes.

Le **product owner** porte le besoin. Il décrit les fonctionnalités, les ordonne, valide ce qui est livré, et sert d'interface avec les utilisateurs. Il ne distribue pas les tâches techniques une par une.

Le **scrum master** tient le cadre agile. Il anime les cérémonies, enlève les obstacles, et aide l'équipe à rester dans la méthode. Il ne décide ni du contenu ni des estimations.

Les **développeurs** conçoivent, écrivent, font les tests unitaires, documentent, et estiment la charge de ce qu'on leur demande.

Les **testeurs** préparent les plans de tests, les exécutent, signalent les anomalies, et disent si la qualité obtenue est celle qui était promise.

Le **designer** UX/UI conçoit le parcours de la personne qui s'en sert, produit les maquettes, les fait essayer, et veille à l'accessibilité.

Rien de cela ne tient si l'information ne circule pas. Un retard qu'on tait, un besoin mal reformulé, des tests qui n'arrivent qu'à la toute fin : le triangle se déforme sans que personne l'ait décidé ouvertement.

## Le diagramme de Gantt

Le **diagramme de Gantt** place chaque tâche sur une échelle de temps. On y lit la date de début et de fin, les liens entre tâches (ce qui doit finir avant qu'autre chose commence, ce qui peut avancer en parallèle) et l'écart entre le prévu et le réalisé. La plus longue chaîne de tâches qui dépendent les unes des autres est le **chemin critique**. Elle fixe la durée minimale du projet. Raccourcir une tâche qui n'est pas sur cette chaîne ne raccourcit pas le projet.

Voici un développement d'application web sur douze semaines. Les cases marquées sont les semaines où la tâche est ouverte.

| Tâches | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | S9 | S10 | S11 | S12 |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **Analyse des besoins** | ██ | ██ | | | | | | | | | | |
| **Conception UX/UI** | | ██ | ██ | ██ | | | | | | | | |
| **Dév. Backend** | | | | ██ | ██ | ██ | ██ | | | | | |
| **Dév. Frontend** | | | | | ██ | ██ | ██ | ██ | | | | |
| **Tests & Intégration** | | | | | | | | ██ | ██ | | | |
| **Déploiement** | | | | | | | | | | ██ | | |

L'analyse occupe les deux premières semaines. La conception la chevauche dès la semaine 2, puis court jusqu'à la semaine 4. Le backend démarre alors, le frontend une semaine plus tard : les deux avancent ensemble. Les tests n'arrivent qu'en semaines 8 et 9, le déploiement en semaine 10. Le dessin montre aussi le risque. Si la conception glisse, le backend qui en dépend glisse avec elle, et la date de déploiement recule.

## Deux façons d'enchaîner le travail

La **méthode en V** est séquentielle. On ne passe à la phase suivante que lorsque la précédente est validée. On descend du besoin vers la conception, puis le code. On remonte ensuite par les tests, chaque niveau de test répondant au niveau de conception qui lui correspond. Le cadre est strict, la documentation est lourde. Cela convient quand le périmètre est connu tôt, par un contrat ou une réglementation. Le défaut est l'effet tunnel : le logiciel ne se voit fonctionner qu'à la fin, et un changement de besoin coûte cher parce qu'il remonte toute la descente.

Les **méthodes agiles**, Scrum ou Kanban, travaillent par itérations. On livre souvent, on montre le résultat, on ajuste le contenu du cycle suivant. On voit plus tôt si l'on construit la mauvaise chose. Cela suppose un client qui reste disponible pour regarder ce qui est livré. La documentation y est plus légère : elle accompagne le logiciel, elle ne le précède pas entièrement. Le cours sur les méthodes agiles détaille les rôles et les cérémonies. Ici, le choix tient en une phrase. Périmètre stable et preuves à produire : le cycle en V. Besoin qui se précise en voyant tourner le logiciel : l'agile.

## Les outils, et le geste Git

Quatre familles d'outils suffisent à piloter. Le suivi des tâches passe par Trello, Jira ou Asana : tickets, colonnes, sprints. Les échanges rapides passent par Slack, Teams ou Discord. Les spécifications et les comptes-rendus vivent dans Confluence, Notion ou un wiki. Le code est versionné avec **Git**, hébergé sur GitLab ou GitHub.

Git mérite qu'on en fasse le geste, parce que c'est lui qui permet à plusieurs personnes d'écrire sans s'écraser le travail. On récupère d'abord le dépôt.

```bash
git clone https://github.com/projet/repo.git
# Télécharge le dépôt distant sur votre machine
```

On ne travaille pas directement sur la branche principale. On ouvre une branche pour la fonctionnalité en cours, le temps de la terminer.

```bash
git checkout -b feature/ma-fonctionnalite
# Crée une branche dédiée pour travailler isolément
```

Quand le morceau est prêt, on l'enregistre localement. Le message de commit dit ce qui a été ajouté, pas « modifs ».

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

Au quotidien, Git se résume à cloner, créer une branche, commiter et pousser. Le reste du projet (qui décide du contenu, dans quel ordre, avec quelle méthode) se joue en dehors de ces quatre commandes. Git garde l'historique. Il ne remplace ni le Gantt, ni le product owner, ni la conversation qui dit si la fonctionnalité est la bonne.
