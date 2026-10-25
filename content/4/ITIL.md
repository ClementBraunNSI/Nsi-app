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

Un projet se termine le jour de la mise en service. Le serveur, lui, continue de tourner. Il faut surveiller, corriger, mettre à jour, répondre aux personnes qui s'en servent. Cette phase n'est plus de la gestion de projet : c'est de la **gestion des services informatiques**. **ITIL** (*Information Technology Infrastructure Library*) est le référentiel de bonnes pratiques le plus utilisé pour l'organiser. La version du cours est **ITIL 4**.

ITIL ne dit pas quelle commande taper, ni quel logiciel choisir. Il dit quoi mettre en place pour qu'un service reste fiable : qui est prévenu en cas de panne, comment on enregistre un incident, comment on améliore le service d'une année sur l'autre. La norme **ISO/CEI 20000** certifie un système de gestion des services. Elle s'est appuyée sur ces pratiques, après le standard britannique BS 15000. ITIL est le référentiel. La norme est le cadre qu'on peut faire auditer.

Trois intentions reviennent. La **continuité** : le service fonctionne, de façon prévisible. La **réaction** : un incident est pris en charge vite, pour que l'impact sur les utilisateurs reste court. L'**amélioration continue** : on ne se contente pas de réparer la même panne, on change le processus qui l'a laissée revenir.

## Livrer, puis faire vivre

La gestion de projet et la gestion de service ne se remplacent pas. L'une **conçoit et livre**. L'autre **fait durer**. Une équipe qui développe une application mobile pendant six mois est dans un projet : il y a un début, une fin, un chef de projet, des développeurs. Le jour où l'application est sur le store, le projet est livré. Corriger les bugs, répondre aux avis, déployer les mises à jour de sécurité : c'est le service. Même partage pour un site. Le développer, c'est le projet. Surveiller le serveur et appliquer les correctifs, c'est le service.

| Critère | Gestion de projet | Gestion de service (ITIL) |
| :--- | :--- | :--- |
| Objectif | Créer un nouveau produit ou service | Faire fonctionner et améliorer un service existant |
| Durée | Limitée (le projet a un début et une fin) | Continue (le service reste actif) |
| Acteurs | Chef de projet, développeurs, testeurs | Techniciens, administrateurs, support |
| Activité | Conception, développement, livraison | Maintenance, support, mise à jour |
| Période | Avant la mise en service | Après la mise en service |
| Exemple | Développer un site e-commerce | Corriger ses pannes, le mettre à jour |
| Méthodes | Gantt, PERT, Agile, Scrum | ITIL, supervision, gestion d'incidents |

Le projet crée le service. ITIL le fait vivre. Un beau livrable sans procédure d'incident redevient une panne dès la première semaine.

## Quatre dimensions

ITIL 4 considère qu'un service tient sur **quatre dimensions**. En négliger une suffit à l'arrêter, même si les trois autres sont solides.

Les **organisations et les personnes** : les rôles, les compétences, la façon de se parler. Le support, le helpdesk et l'administrateur réseau en font partie. Un serveur peut être parfait. S'il tombe et que personne ne sait qui a le droit de le redémarrer, le service est déjà arrêté.

L'**information et la technologie** : les serveurs, les bases, les outils. Un logiciel de tickets comme GLPI fait partie de cette dimension. Il ne répare rien tout seul. Il rend visible ce qui est en cours.

Les **partenaires et les fournisseurs** : l'hébergeur, l'éditeur, le sous-traitant, et les contrats qui disent jusqu'où ils s'engagent. Un contrat d'hébergement expiré n'est pas une panne technique. C'est une dimension oubliée, et le site est tout aussi inaccessible.

Les **flux de valeur et les processus** : l'enchaînement du travail. Comment un incident est qualifié, qui le prend, comment les sauvegardes sont planifiées. Sans ce flux, les trois autres dimensions travaillent chacune dans leur coin.

Le serveur du lycée qui tombe illustre le croisement. La technologie a failli. Si personne n'est désigné pour intervenir, l'organisation a failli aussi. Si le contrat d'hébergement est périmé, le fournisseur n'est plus là. Les quatre dimensions se compensent. Elles ne se remplacent pas.
