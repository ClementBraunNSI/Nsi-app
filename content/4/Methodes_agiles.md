---
title: Méthodes Agiles
description: >-
  Introduction aux méthodes agiles (Scrum, Kanban) et à la gestion de projet
  moderne
level: '4'
chapter: 'BTS SIO 2 : B1 - Support et mise à disposition de services informatiques'
icon: "\U0001F680"
prerequisites:
  - Chemin_critique
---

# Méthodes Agiles Avancées

> BTS SIO SLAM - Bloc 1 : Gestion de projet informatique

## 🎯 L'Agilité dans les Projets Informatiques

> **Manifeste Agile**
>
> Les méthodes agiles privilégient **les individus et leurs interactions** plutôt que les processus et les outils, **des logiciels opérationnels** plutôt qu'une documentation exhaustive, **la collaboration avec les clients** plutôt que la négociation contractuelle, et **l'adaptation au changement** plutôt que le suivi d'un plan.

Dans le développement de projets informatiques, l'agilité permet de gérer efficacement l'incertitude, de livrer de la valeur rapidement et de s'adapter aux retours des utilisateurs et des parties prenantes.

- **👥 Collaboration** : Communication constante entre l'équipe, les utilisateurs et les parties prenantes du projet.
- **🔄 Itération** : Développement par cycles courts avec livraisons fréquentes et amélioration continue.
- **📈 Valeur** : Focus sur les fonctionnalités qui apportent le plus de valeur aux utilisateurs finaux.
- **🎯 Adaptation** : Capacité à réagir rapidement aux changements et aux retours d'expérience.

## 🏃‍♂️ Scrum : Framework Agile

> **Scrum en Action**
>
> Scrum est un framework agile structuré autour de **sprints** (itérations de 1-4 semaines), d'**événements** (réunions rituelles) et d'**artefacts** (documents de travail). Parfait pour organiser des projets informatiques avec des livrables réguliers.

### Rôles Scrum

#### 👑 Product Owner
En entreprise, c'est souvent le responsable produit ou le représentant client qui définit les besoins.
- ✅ Définit les user stories
- ✅ Priorise le backlog produit
- ✅ Valide les fonctionnalités
- ✅ Interface avec les utilisateurs

#### 🎯 Scrum Master
Facilitateur du processus Scrum qui aide l'équipe à éliminer les obstacles et à s'améliorer.
- ✅ Anime les cérémonies Scrum
- ✅ Résout les blocages
- ✅ Protège l'équipe des perturbations
- ✅ Coach l'équipe sur Scrum

#### 💻 Équipe de Développement
Équipe pluridisciplinaire (développeurs, testeurs, designers) qui réalise concrètement le produit.
- ✅ Auto-organisée et pluridisciplinaire
- ✅ Estime et réalise les user stories
- ✅ Livre un incrément fonctionnel
- ✅ Améliore continuellement ses pratiques

### Le Sprint

- **📋 Sprint Planning** (4h pour 2 semaines)
- **🔄 Daily Scrum** (15 min/jour)
- **🎯 Sprint Review** (2h pour 2 semaines)
- **🔍 Retrospective** (1h30 pour 2 semaines)

## 📋 Kanban : Visualiser le Flux

> **Tableau Kanban**
>
> Kanban visualise le flux de travail et limite le travail en cours (WIP). Idéal pour gérer les tâches de maintenance, les bugs ou les projets avec des priorités changeantes.

### Exemple de Tableau Kanban

#### 📝 À Faire
- Créer la base de données
- Concevoir l'interface utilisateur
- Rédiger les tests unitaires

#### 🔄 En Cours
- Développer l'API REST
- Intégrer l'authentification

#### ✅ Terminé
- Analyser les besoins
- Configurer l'environnement
- Créer le repository Git

#### 🚀 Déployé
- Page de connexion
- Module de gestion utilisateurs

> 💡 **Limite WIP :** Ne travaillez que sur 2-3 tâches maximum par personne pour éviter la dispersion et améliorer la qualité.

## 📝 User Stories

> **Définition**
>
> Une **user story** décrit une fonctionnalité du point de vue de l’utilisateur et la valeur qu’elle apporte.

🔹 *Template :* `En tant que <rôle>, je veux <action> afin de <bénéfice>.`
🔹 Chaque story doit avoir des **critères d’acceptation** : conditions précises permettant de valider si la fonctionnalité est terminée.
🔹 Bonnes pratiques : utiliser le modèle **INVEST** (Indépendante, Négociable, Valorisante, Estimable, Petite, Testable).

> 💡 **Exemple :** « En tant qu’étudiant, je veux ajouter une tâche avec une date limite afin d’organiser mes révisions. »
>
> **Critères d’acceptation :** titre obligatoire, date sélectionnable, tâche visible dans la liste triée.

## 📂 Les Artefacts Scrum

> **📋 Product Backlog**
>
> Liste priorisée de toutes les fonctionnalités, améliorations et corrections. Chaque item contient : titre, description (user story), critères d’acceptation, estimation et priorité.

> **🗂️ Sprint Backlog**
>
> Sous-ensemble du product backlog sélectionné pour un sprint, découpé en tâches techniques par l’équipe de développement.

> **🚀 Incrément**
>
> Ensemble des éléments « Done » à la fin d’un sprint. L’incrément doit être **potentiellement livrable** au client.

## ✅ Definition of Ready & Definition of Done

### 📥 Definition of Ready (DoR)
Une user story est prête à entrer en sprint si :
- Description claire et complète
- Critères d’acceptation définis
- Estimation réalisée
- Dépendances identifiées

### 📤 Definition of Done (DoD)
Une user story est considérée comme terminée si :
- Code compilé et testé
- Tests unitaires écrits et passés
- Revue de code effectuée
- Documentation minimale ajoutée
- Livrable déployé en environnement de test

## 🔧 SAFe : Scaled Agile pour Grandes Organisations

> **Scaled Agile Framework**
>
> SAFe (Scaled Agile Framework) étend l'agilité aux grandes organisations avec plusieurs équipes. Comprendre SAFe est essentiel pour travailler dans des environnements professionnels complexes.

- **🎯 Program Increment (PI)** : Cycle de 8-12 semaines synchronisant plusieurs équipes Scrum sur des objectifs communs.
- **🚂 Agile Release Train** : Ensemble d'équipes agiles travaillant ensemble sur une solution commune avec un rythme partagé.
- **📋 PI Planning** : Événement de planification de 2 jours réunissant toutes les équipes pour aligner les objectifs.
- **📊 Lean Portfolio** : Gestion stratégique des investissements et allocation des ressources selon les principes Lean.
