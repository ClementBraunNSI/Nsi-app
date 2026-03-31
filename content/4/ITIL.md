---
title: Introduction à ITIL
description: Gestion des services informatiques et bonnes pratiques (ITIL v4)
level: '4'
chapter: 'BTS SIO 2 : B1 - Support et mise à disposition de services informatiques'
icon: "\U0001F9ED"
prerequisites: []
---

# Introduction à ITIL

> Gestion des services informatiques et bonnes pratiques

## 🔄 De la gestion de projet à la gestion de services

> **Contexte**
>
> Une fois qu'un **projet informatique est terminé**, le travail ne s'arrête pas. Il faut **maintenir** le service livré, **corriger les pannes**, **faire les mises à jour** et **répondre aux utilisateurs**.

> **🧠 Exemple concret**
>
> Après le développement d'un site web, il faut ensuite surveiller le serveur, corriger les bugs, gérer les utilisateurs et appliquer les mises à jour de sécurité.

> 💡 Cette phase s'appelle **la gestion des services informatiques**. C'est là qu'intervient **ITIL** : une collection de **bonnes pratiques** utilisées dans le monde entier pour **organiser et améliorer les services IT**.

## 📚 Qu'est-ce qu'ITIL ?

> **Définition**
>
> **ITIL** (*Information Technology Infrastructure Library*) est un **ensemble de bonnes pratiques (dérivés de la norme BS15000 ou ISO/CEI 20000 pour les systèmes informatiques)** pour la **gestion des services informatiques**.

- **🔄 Continuité des services** : Assurer que les services informatiques fonctionnent de manière continue et fiable.
- **⚡ Réaction rapide** : Réagir rapidement en cas d'incident pour minimiser l'impact sur les utilisateurs.
- **📈 Amélioration continue** : Améliorer la qualité de service sur la durée grâce à des processus optimisés.

> 💡 ITIL ne dit pas *comment* faire techniquement, mais *quoi mettre en place* pour qu'un service fonctionne bien au quotidien.

## ⚖️ Gestion de projet vs Gestion de service

> **Complémentarité**
>
> Ces deux approches **ne s'opposent pas**, elles **se complètent**.

- **🚀 Gestion de projet** : Sert à **concevoir** et **livrer** un nouveau service (ex : créer une application, un site, un outil).
- **🔧 Gestion de service** : Sert à **faire vivre** ce service sur la durée (maintenance, support, mises à jour…).

> **🧩 Exemple concret**
>
> Une équipe développe une application mobile pendant 6 mois → c'est la **gestion de projet**.
>
> Une fois publiée sur le Play Store, il faut corriger les bugs, répondre aux utilisateurs et déployer des mises à jour → c'est la **gestion de service**.

| Critère | Gestion de projet | Gestion de service (ITIL) |
| :--- | :--- | :--- |
| 🎯 **Objectif** | Créer un nouveau produit ou service | Faire fonctionner et améliorer un service existant |
| ⏱️ **Durée** | Limitée (le projet a un début et une fin) | Continue (le service reste actif en permanence) |
| 🧑‍💻 **Acteurs principaux** | Chef de projet, développeurs, testeurs | Techniciens, administrateurs, support utilisateur |
| 🛠️ **Type d'activité** | Conception, développement, livraison | Maintenance, support, mise à jour, amélioration |
| 🗓️ **Période d'action** | Avant la mise en service | Après la mise en service |
| 💡 **Exemple** | Développer un site e-commerce | Corriger les pannes du site, le mettre à jour |
| ⚙️ **Méthodes associées** | Gantt, PERT, Agile, Scrum | ITIL, supervision, gestion d'incidents |

> 🧠 **À retenir :** La **gestion de projet** crée le service. **ITIL** fait vivre le service dans le temps.

## 🏗️ Les quatre dimensions d'ITIL

> **Les quatre piliers**
>
> ITIL considère qu'un bon service repose sur **quatre piliers**. Si l'un d'eux est négligé, le service devient instable.

1. **🧑‍💼 Organisation & personnes** : Les rôles, compétences et communication au sein de l'équipe.
   *Ex : Support technique, helpdesk, chef de projet, responsables réseau.*
2. **💻 Information & technologie** : Les outils, logiciels et infrastructures utilisés.
   *Ex : Serveurs, bases de données, outils de ticketing (ex : GLPI).*
3. **🤝 Partenaires & fournisseurs** : Les prestataires et contrats externes.
   *Ex : Hébergeur, éditeur de logiciel, sous-traitants.*
4. **🔄 Flux de valeur & processus** : Les méthodes et étapes de travail pour délivrer le service.
   *Ex : Procédure de gestion des incidents, sauvegardes planifiées.*

> ⚠️ **Exemple :** Si le serveur du lycée tombe (technologie), que personne ne sait le réparer (organisation), et que le contrat d'hébergement a expiré (fournisseur), le service est à l'arrêt. Les quatre dimensions doivent donc être équilibrées.
