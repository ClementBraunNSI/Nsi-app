---
title: Introduction à ITIL
description: Gestion des services informatiques et bonnes pratiques (ITIL v4)
level: '4'
chapter: 'BTS SIO 2 : B1 - Support et mise à disposition de services informatiques'
icon: "compass"
prerequisites: []
audience: public
---

# Introduction à ITIL

Un projet se termine le jour de la mise en service, mais le serveur, lui, continue de fonctionner. Il faut alors le surveiller, le corriger, le mettre à jour et répondre aux personnes qui l'utilisent. Cette phase ne relève plus de la gestion de projet, mais de la **gestion des services informatiques**. **ITIL** (*Information Technology Infrastructure Library*) est le référentiel de bonnes pratiques le plus utilisé pour l'organiser. La version du cours est **ITIL 4**.

ITIL n'indique ni les commandes à taper ni le logiciel à choisir. Il décrit ce qu'il faut mettre en place pour qu'un service reste fiable : qui prévenir en cas de panne, comment enregistrer un incident, comment améliorer le service d'une année sur l'autre. La norme **ISO/CEI 20000**, qui a succédé au standard britannique BS 15000, s'appuie sur ces pratiques et permet de certifier un système de gestion des services. ITIL est donc un référentiel de bonnes pratiques, alors que la norme fournit un cadre qui peut être audité.

ITIL poursuit trois objectifs. La **continuité** garantit que le service fonctionne de façon prévisible. La **réaction** consiste à prendre rapidement en charge chaque incident, pour limiter la gêne des utilisateurs. L'**amélioration continue**, enfin, ne se contente pas de réparer une panne : elle modifie le processus qui a permis à cette panne de se reproduire.

## Gestion de projet et gestion de service

La gestion de projet et la gestion de service sont complémentaires : la première **conçoit et livre** un produit, la seconde le **fait durer**. Une équipe qui développe une application mobile pendant six mois mène un projet, avec un début, une fin, un chef de projet et des développeurs. Le jour où l'application est publiée, le projet est terminé. Corriger les bugs, répondre aux avis et déployer les mises à jour de sécurité relèvent ensuite du service. Il en va de même pour un site web : son développement est un projet, alors que la surveillance du serveur et l'application des correctifs relèvent du service.

| Critère | Gestion de projet | Gestion de service (ITIL) |
| :--- | :--- | :--- |
| Objectif | Créer un nouveau produit ou service | Faire fonctionner et améliorer un service existant |
| Durée | Limitée (le projet a un début et une fin) | Continue (le service reste actif) |
| Acteurs | Chef de projet, développeurs, testeurs | Techniciens, administrateurs, support |
| Activité | Conception, développement, livraison | Maintenance, support, mise à jour |
| Période | Avant la mise en service | Après la mise en service |
| Exemple | Développer un site e-commerce | Corriger ses pannes, le mettre à jour |
| Méthodes | Gantt, PERT, Agile, Scrum | ITIL, supervision, gestion d'incidents |

Le projet crée donc le service, et ITIL permet de le maintenir. Sans procédure de gestion des incidents, même un livrable de qualité se retrouve vite en panne sans que personne ne sache comment réagir.

## Les quatre dimensions d'un service

ITIL 4 considère qu'un service repose sur **quatre dimensions**. Il suffit d'en négliger une pour que le service s'arrête, même si les trois autres sont solides.

La première dimension concerne les **organisations et les personnes** : les rôles, les compétences et la communication entre les équipes. Le support, le helpdesk et l'administrateur réseau en font partie. Même avec un serveur parfait, si personne ne sait qui a le droit de le redémarrer quand il tombe en panne, le service est arrêté.

La deuxième dimension regroupe l'**information et la technologie** : les serveurs, les bases de données et les outils. Un logiciel de tickets comme GLPI en fait partie : il ne répare rien lui-même, mais il permet de suivre les demandes en cours.

La troisième dimension concerne les **partenaires et les fournisseurs**, comme l'hébergeur, l'éditeur ou le sous-traitant, ainsi que les contrats qui fixent leurs engagements. Un contrat d'hébergement expiré n'est pas une panne technique, mais le site devient tout aussi inaccessible.

La quatrième dimension correspond aux **flux de valeur et aux processus**, c'est-à-dire à l'enchaînement du travail : comment un incident est qualifié, qui le prend en charge, comment les sauvegardes sont planifiées. Sans ces processus, les trois autres dimensions fonctionnent chacune de leur côté.

La panne du serveur du lycée montre comment ces dimensions se croisent. La technologie a fait défaut, mais si personne n'est désigné pour intervenir, l'organisation est aussi en cause, et si le contrat d'hébergement a expiré, le fournisseur n'est plus là pour aider. Les quatre dimensions sont donc toutes nécessaires, et aucune ne peut remplacer les autres.
