---
title: Méthodes Agiles
description: >-
  Introduction aux méthodes agiles (Scrum, Kanban) et à la gestion de projet
  moderne
level: '4'
chapter: 'BTS SIO 2 : B1 - Support et mise à disposition de services informatiques'
icon: "rocket"
prerequisites:
  - Chemin_critique
audience: public
---

# Méthodes agiles

Ce cours relève du bloc 1 du BTS SIO. La méthode du chemin critique suppose de connaître assez tôt les tâches et leurs durées pour fixer le réseau des dépendances. Beaucoup de projets informatiques n'ont pas cette stabilité, car le besoin se précise en voyant le logiciel fonctionner. Les méthodes **agiles** organisent donc le travail pour livrer souvent, montrer régulièrement le résultat et modifier le plan sans reprendre tout le projet.

Le **manifeste agile** (2001) pose quatre préférences. Les personnes et leurs échanges passent avant les processus et les outils. Un logiciel qui fonctionne passe avant une documentation exhaustive. La collaboration avec le client passe avant la négociation du contrat. L'adaptation au changement passe avant le suivi d'un plan. Les seconds termes de ces préférences gardent leur importance : un contrat, une documentation, un outil ou un plan restent utiles. Mais ils ne remplacent ni une version du logiciel que l'on peut essayer, ni une discussion avec la personne qui l'utilisera.

Le travail est donc organisé en **itérations** courtes, qui livrent chacune quelque chose d'utilisable. On réalise en priorité ce qui a de la **valeur** pour l'utilisateur, on **collabore** en continu avec lui et avec les parties prenantes, et on **adapte** le contenu du cycle suivant à ce que l'on a appris, plutôt que de s'en tenir au planning initial.

## Scrum

**Scrum** organise ce travail selon un rythme régulier. Le **sprint** est une itération d'une à quatre semaines, souvent deux, dont l'objectif ne change pas en cours de route. Ce cadre repose sur des rôles, des événements et des artefacts.

Le **product owner** représente le besoin. En entreprise, c'est souvent le responsable produit, ou la personne qui représente le client. Il écrit les user stories, ordonne le backlog, et accepte ou refuse ce qui est livré. Il fait le lien avec les utilisateurs, mais il ne répartit pas les tâches au sein de l'équipe.

Le **scrum master** veille au respect du cadre. Il anime les cérémonies, enlève les obstacles qui bloquent l'équipe, la protège des demandes qui arriveraient au milieu du sprint, et l'aide à s'améliorer. Il n'est pas le chef de projet : il ne décide ni du contenu ni des estimations.

L'**équipe de développement** réalise le produit. Elle réunit les compétences dont le sprint a besoin, comme le développement, le test ou la conception. Elle s'organise elle-même, estime les stories et livre un incrément qui fonctionne, sans que personne de l'extérieur ne lui attribue les tâches une par une.

Pour un sprint de deux semaines, les durées habituelles sont les suivantes. Le **sprint planning**, d'environ quatre heures, ouvre le sprint : l'équipe y fixe l'objectif et choisit les stories, qu'elle découpe en tâches. Le **daily scrum**, de quinze minutes chaque jour, sert à synchroniser l'équipe, et non à rendre des comptes à un chef. La **sprint review**, d'environ deux heures, présente l'incrément aux parties prenantes et recueille leurs retours. La **rétrospective**, d'environ une heure et demie, porte sur la façon de travailler, et non sur le produit, et permet de choisir une amélioration pour le sprint suivant.

## Kanban

**Kanban** ne découpe pas le travail en sprints. Il rend le flux de travail visible sur un tableau et limite le travail en cours (*WIP*, pour *work in progress*). Les colonnes typiques sont « à faire », « en cours », « terminé » et « déployé ». Chaque carte représente une tâche, qui avance d'une colonne à l'autre. Quand la limite de la colonne « en cours » est atteinte, on ne commence pas de nouvelle carte : on termine ou on débloque d'abord les tâches déjà commencées.

Cette méthode convient à la maintenance, à la correction de bugs et aux demandes dont la priorité change d'un jour à l'autre. Une limite de deux ou trois cartes par personne évite d'ouvrir dix sujets sans en terminer aucun. L'efficacité se mesure au temps qu'une carte passe dans le tableau, et non à la vélocité d'un sprint.

## User stories, critères d'acceptation et définition de fini

Une **user story** décrit une fonctionnalité du point de vue de la personne qui s'en sert, et le bénéfice qu'elle en retire.

`En tant que <rôle>, je veux <action> afin de <bénéfice>.`

« En tant qu'étudiant, je veux ajouter une tâche avec une date limite afin d'organiser mes révisions. » La story n'indique pas comment la programmer : elle précise pour qui, quoi et pourquoi. Sans le « afin de », il ne s'agit plus que d'une tâche technique.

Les **critères d'acceptation** permettent de vérifier que la story est terminée. Dans l'exemple, le titre est obligatoire, la date peut être choisie et la tâche apparaît dans la liste triée. Sans critères précis, la review risque de se réduire à une discussion de goûts.

L'acronyme **INVEST** résume les qualités d'une bonne story. Elle doit être **I**ndépendante autant que possible, pour pouvoir être retirée du sprint sans entraîner les autres, et **N**égociable, car ses détails se précisent avec l'équipe. Elle doit aussi apporter de la **V**aleur à quelqu'un, être **E**stimable par l'équipe, rester **S**uffisamment petite pour tenir dans un sprint, et être **T**estable grâce à ses critères d'acceptation.

Le **product backlog** est la liste ordonnée de tout ce que l'on pourrait faire, qu'il s'agisse de stories, de corrections ou d'améliorations. Chaque élément a un titre, une description, des critères, une estimation et une priorité, et c'est le product owner qui fixe l'ordre. Le **sprint backlog** est le sous-ensemble retenu pour le sprint, découpé en tâches par l'équipe. L'**incrément** est ce qui est terminé à la fin du sprint. Il doit être **potentiellement livrable**, et non une démonstration qui ne fonctionne que sur la machine du développeur.

La **definition of ready** indique à quelles conditions une story peut entrer dans un sprint. Sa description doit être claire, ses critères d'acceptation écrits, son estimation faite et ses dépendances identifiées. Une story floue intégrée malgré tout au sprint fait perdre du temps, car il faut d'abord la clarifier.

La **definition of done** fixe, pour toute l'équipe, les conditions qui permettent de considérer une story comme terminée. Le code compile et a été testé. Les tests unitaires sont écrits et passent. La revue de code a eu lieu. La documentation minimale est là. Le livrable est déployé sur un environnement de test. Une story « presque finie » n'entre pas dans l'incrément.

## L'agilité à grande échelle

**SAFe** (*Scaled Agile Framework*) reprend Scrum à l'échelle de plusieurs équipes qui construisent une même solution. Le **program increment** est un cycle de huit à douze semaines, qui aligne ces équipes sur des objectifs communs. L'**agile release train** est l'ensemble des équipes qui partagent ce rythme. Le **PI planning** réunit tout le monde, en général sur deux jours, pour poser ces objectifs et voir les dépendances entre équipes. Au-dessus, le **lean portfolio** décide où l'organisation investit son budget et ses équipes. Ce cadre ne s'applique pas en détail dans un projet de classe, mais il faut retenir que l'organisation d'une seule équipe agile ne suffit plus quand dix équipes livrent le même produit : il faut alors un rythme commun et un moment où les dépendances entre équipes deviennent visibles.
