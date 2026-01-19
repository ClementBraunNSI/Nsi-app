---
title: "Gestion de Projet Informatique"
description: "Fondamentaux de la gestion de projet, rôles, méthodes et outils"
level: "4"
chapter: "Gestion_de_Projet"
icon: "📊"
---

# 📊 Gestion de Projet Informatique

> **BTS SIO SLAM - Bloc 1** : Support et mise à disposition de services informatiques

## 🎯 Fondamentaux de la Gestion de Projet

### 📋 Qu'est-ce qu'un Projet ?

> Un **projet** est un ensemble d'activités temporaires, uniques et coordonnées, visant à atteindre un objectif spécifique dans un délai déterminé avec des ressources limitées. Il se caractérise par un début et une fin clairement définis.

Les caractéristiques principales d'un projet sont :

*   **🎯 Objectif Défini** : Résultat attendu clairement spécifié, mesurable et atteignable dans le temps imparti.
*   **⏰ Temporalité** : Durée limitée avec une date de début et une date de fin précises.
*   **🔄 Unicité** : Chaque projet est unique et produit un livrable ou service spécifique.
*   **💰 Ressources Limitées** : Budget, équipe et moyens techniques définis et contraints.

> ⚠️ **Triangle de la gestion de projet :** Qualité, Délai, Coût - modifier l'un impacte nécessairement les deux autres.

## 👥 Rôles et Responsabilités

### 🏗️ Équipe Projet

> Une équipe projet efficace réunit des **compétences complémentaires** et des rôles clairement définis pour atteindre les objectifs dans les meilleures conditions.

Les principaux rôles sont :

*   **🎯 Chef de Projet**
    *   Planification et coordination générale
    *   Gestion des risques et des délais
    *   Communication avec les parties prenantes
    *   Suivi budgétaire et reporting

*   **💼 Product Owner**
    *   Définition des besoins fonctionnels
    *   Priorisation des fonctionnalités
    *   Validation des livrables
    *   Interface avec les utilisateurs finaux

*   **🏗️ Scrum Master**
    *   Animation des cérémonies agiles
    *   Facilitation et résolution d'obstacles
    *   Coaching de l'équipe
    *   Garant de la méthodologie

*   **💻 Développeurs**
    *   Conception et développement
    *   Tests unitaires et intégration
    *   Documentation technique
    *   Estimation des charges

*   **🧪 Testeurs/QA**
    *   Conception des plans de tests
    *   Exécution des tests fonctionnels
    *   Détection et signalement des anomalies
    *   Validation de la qualité

*   **🎨 UX/UI Designer**
    *   Conception de l'expérience utilisateur
    *   Création des maquettes et prototypes
    *   Tests d'utilisabilité
    *   Respect des standards d'accessibilité

> 💡 **Communication :** La réussite d'un projet dépend principalement de la qualité de la communication entre les membres de l'équipe.

## 📈 Diagramme de Gantt

### 📊 Outil de Planification

> Le **diagramme de Gantt** est un outil graphique de planification qui représente les tâches d'un projet dans le temps, leurs dépendances et l'avancement des travaux.

Il permet :
*   **📅 Planification Temporelle** : Visualisation claire des dates de début et fin de chaque tâche sur une échelle de temps.
*   **🔗 Dépendances** : Identification des liens entre tâches : antériorité, simultanéité, succession.
*   **📊 Suivi d'Avancement** : Comparaison entre planifié et réalisé, identification des retards et ajustements.
*   **⚡ Chemin Critique** : Séquence de tâches déterminant la durée minimale du projet.

### Exemple : Projet de Développement d'Application Web

| Tâches | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | S9 | S10 | S11 | S12 |
| :--- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **Analyse des besoins** | ██ | ██ | | | | | | | | | | |
| **Conception UX/UI** | | ██ | ██ | ██ | | | | | | | | |
| **Dév. Backend** | | | | ██ | ██ | ██ | ██ | | | | | |
| **Dév. Frontend** | | | | | ██ | ██ | ██ | ██ | | | | |
| **Tests & Intégration** | | | | | | | | ██ | ██ | | | |
| **Déploiement** | | | | | | | | | | ██ | | |

## 🔄 Méthodologies de Projet

### 📅 Méthode en V (Classique)

Modèle séquentiel et linéaire où chaque phase doit être validée avant de passer à la suivante.

*   **Structure** : Phase descendante (conception) puis ascendante (tests).
*   **Avantages** : Cadre rigoureux, documentation exhaustive, idéal pour les projets à périmètre fixe.
*   **Inconvénients** : Effet tunnel, manque de souplesse face aux changements, validation tardive.

### 🔄 Méthodes Agiles (Scrum, Kanban)

Approche itérative et incrémentale focalisée sur la satisfaction client et l'adaptation au changement.

*   **Principes** : Livraisons fréquentes, collaboration constante, accueil du changement.
*   **Avantages** : Visibilité rapide, flexibilité, qualité continue, réduction des risques.
*   **Inconvénients** : Demande une forte implication client, documentation parfois légère.

## 🛠️ Outils de Gestion

Pour piloter efficacement un projet, plusieurs types d'outils sont nécessaires :

1.  **Gestion de Tâches** : Trello, Jira, Asana (Suivi des tickets, Kanban, Sprints).
2.  **Communication** : Slack, Teams, Discord (Échanges rapides, visioconférences).
3.  **Documentation** : Confluence, Notion, Wiki (Spécifications, comptes-rendus).
4.  **Versionning** : Git (GitLab, GitHub) (Gestion du code source).

### Focus : Workflow Git de base

**1. Récupération du projet**
```bash
git clone https://github.com/projet/repo.git
# Télécharge le dépôt distant sur votre machine
```

**2. Création d'une branche**
```bash
git checkout -b feature/ma-fonctionnalite
# Crée une branche dédiée pour travailler isolément
```

**3. Travail et sauvegarde**
```bash
git add .
git commit -m "Ajout de la fonctionnalité de login"
# Enregistre les modifications localement
```

**4. Partage**
```bash
git push origin feature/ma-fonctionnalite
# Envoie la branche sur le serveur distant
```
