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

Ce cours relève du bloc 1 du BTS SIO. Le chemin critique suppose qu'on connaît les tâches et leurs durées assez tôt pour figer un réseau. Beaucoup de projets informatiques n'ont pas cette stabilité : le besoin se précise quand on voit le logiciel tourner. Les méthodes **agiles** organisent le travail pour livrer souvent, montrer le résultat, et changer le plan sans reprendre tout le projet.

Le **manifeste agile** (2001) pose quatre préférences. Les personnes et leurs échanges passent avant les processus et les outils. Un logiciel qui fonctionne passe avant une documentation exhaustive. La collaboration avec le client passe avant la négociation du contrat. L'adaptation au changement passe avant le suivi d'un plan. Les quatre seconds termes existent encore. Un contrat, une doc, un outil, un plan restent utiles. Ils ne remplacent pas un incrément qu'on peut essayer, ni une conversation avec la personne qui s'en servira.

On travaille donc par **itérations** courtes, chacune livrant quelque chose d'utilisable. On choisit d'abord ce qui a de la **valeur** pour l'utilisateur. On **collabore** en continu avec lui, et avec les parties prenantes. On **adapte** le contenu du prochain cycle à ce qu'on a appris, au lieu de protéger le planning initial.

## Scrum

**Scrum** cadence cette idée. Le **sprint** est une itération d'une à quatre semaines, souvent deux, dont l'objectif ne change pas en cours de route. Le cadre tient par des rôles, des événements, et des artefacts.

Le **product owner** porte le besoin. En entreprise, c'est souvent le responsable produit, ou la personne qui représente le client. Il écrit les user stories, ordonne le backlog, et accepte ou refuse ce qui est livré. Il est l'interface avec les utilisateurs. Il ne répartit pas les tâches dans l'équipe.

Le **scrum master** tient le cadre. Il anime les cérémonies, enlève les obstacles qui bloquent l'équipe, la protège des demandes qui arriveraient au milieu du sprint, et l'aide à s'améliorer. Il n'est pas le chef de projet : il ne décide ni du contenu ni des estimations.

L'**équipe de développement** réalise le produit. Elle mélange les métiers dont le sprint a besoin, développement, test, conception. Elle s'organise, estime les stories, et livre un incrément qui fonctionne. Personne de l'extérieur ne lui assigne les tâches une par une.

Pour un sprint de deux semaines, les durées usuelles sont les suivantes. Le **sprint planning** ouvre le sprint, environ quatre heures : quel objectif, quelles stories, découpées en tâches. Le **daily scrum**, quinze minutes chaque jour, sert à synchroniser l'équipe, pas à rendre compte à un chef. La **sprint review**, environ deux heures, montre l'incrément aux parties prenantes et recueille leurs retours. La **rétrospective**, environ une heure et demie, regarde la façon de travailler, pas le produit, et choisit une amélioration pour le sprint suivant.

## Kanban

**Kanban** ne cadence pas en sprints. Il rend le flux visible sur un tableau, et limite le travail en cours, le *WIP*. Les colonnes typiques sont : à faire, en cours, terminé, déployé. Une carte est une tâche. Elle avance d'une colonne à l'autre. On ne commence pas une cinquième carte quand la limite de la colonne « en cours » est atteinte : on finit, ou l'on débloque, ce qui est déjà ouvert.

Cela convient à la maintenance, aux bugs, aux demandes dont la priorité change d'un jour à l'autre. Une limite de deux ou trois cartes par personne évite d'ouvrir dix sujets et de n'en terminer aucun. Le flux se mesure au temps qu'une carte passe dans le tableau, pas à la vélocité d'un sprint.

## Une story, des critères, une définition de fini

Une **user story** décrit une fonctionnalité du point de vue de la personne qui s'en sert, et le bénéfice qu'elle en retire.

`En tant que <rôle>, je veux <action> afin de <bénéfice>.`

« En tant qu'étudiant, je veux ajouter une tâche avec une date limite afin d'organiser mes révisions. » La story ne dit pas encore comment la coder. Elle dit pour qui, quoi, et pourquoi. Sans le « afin de », on a une tâche technique déguisée.

Les **critères d'acceptation** rendent la fin vérifiable. Pour l'exemple : le titre est obligatoire, la date est sélectionnable, la tâche apparaît dans la liste triée. Si un critère manque, la review se transforme en discussion de goût.

**INVEST** rappelle la forme d'une bonne story. Indépendante, autant que possible, pour qu'on puisse la sortir du sprint sans emporter les autres. Négociable : le détail se précise avec l'équipe, la story n'est pas un cahier des charges fermé. Valorisante : elle apporte quelque chose à quelqu'un. Estimable : l'équipe sait en parler en taille. Petite : elle tient dans un sprint. Testable : les critères d'acceptation existent.

Le **product backlog** est la liste ordonnée de tout ce qu'on pourrait faire : stories, corrections, améliorations. Chaque élément a un titre, une description, des critères, une estimation, une priorité. L'ordre est celui du product owner. Le **sprint backlog** est le sous-ensemble retenu pour le sprint, découpé en tâches par l'équipe. L'**incrément** est ce qui est terminé à la fin du sprint. Il doit être **potentiellement livrable** : pas une démo qui ne tourne que sur la machine du développeur.

La **definition of ready** dit quand une story a le droit d'entrer dans un sprint. Sa description doit être claire, ses critères d'acceptation écrits, son estimation faite et ses dépendances identifiées. Une story floue qu'on tire quand même dans le sprint consomme le planning à la découvrir.

La **definition of done** dit quand elle est finie, pour toute l'équipe, pas selon l'humeur de chacun. Le code compile et a été testé. Les tests unitaires sont écrits et passent. La revue de code a eu lieu. La documentation minimale est là. Le livrable est déployé sur un environnement de test. Une story « presque finie » n'entre pas dans l'incrément.

## Quand plusieurs équipes avancent ensemble

**SAFe** (*Scaled Agile Framework*) reprend Scrum à l'échelle de plusieurs équipes qui construisent une même solution. Le **program increment** est un cycle de huit à douze semaines, qui aligne ces équipes sur des objectifs communs. L'**agile release train** est l'ensemble des équipes qui partagent ce rythme. Le **PI planning** réunit tout le monde, en général sur deux jours, pour poser ces objectifs et voir les dépendances entre équipes. Le **lean portfolio** décide, au-dessus, où l'organisation met l'argent et les gens. On n'en déploie pas le détail dans un projet de classe. On retient que l'agilité d'une équipe ne se copie pas telle quelle le jour où dix équipes livrent le même produit : il faut un rythme commun et un endroit où les dépendances se voient.
