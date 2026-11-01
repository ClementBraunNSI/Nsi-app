---
title: Patrimoine Informatique
description: Recensement et identification des ressources numériques (SIO Bloc 1)
level: '4'
chapter: 'BTS SIO 2 : B1 - Support et mise à disposition de services informatiques'
icon: "puzzle"
prerequisites:
  - Methodes_agiles
audience: public
---

# Patrimoine informatique

Ce cours relève du bloc 1 du BTS SIO. Avant de sécuriser, de sauvegarder ou de remplacer quoi que ce soit, il faut savoir ce que l'organisation possède. Le **patrimoine numérique** regroupe les ressources dont le système d'information a besoin pour fonctionner : le matériel, les logiciels, mais aussi des ressources qui ne sont ni l'un ni l'autre, comme les comptes, les droits, les bases de données ou les procédures. Un serveur oublié dans un placard fait toujours partie du patrimoine, et aussi de la surface d'attaque.

Tenir cet inventaire à jour n'est pas seulement une bonne habitude de technicien : c'est une exigence de la norme **ISO/IEC 27001:2022**. L'annexe **A.5.9** demande que les actifs liés à l'information et aux installations qui la traitent soient identifiés, et qu'un inventaire en soit établi et tenu à jour. L'annexe **A.5.10** demande une organisation qui garantisse que ces informations et ces ressources sont protégées, utilisées et gérées correctement. L'annexe **A.5.36** demande que l'organisation vérifie la conformité de l'ensemble de ses actifs avec ses politiques de sécurité, ses règles et les standards qu'elle s'impose. Sans inventaire, il est impossible de démontrer le respect de ces trois contrôles à un auditeur.

## L'intérêt d'un inventaire

Les ordres de grandeur suivants donnent une idée des gains possibles, sans être des promesses précises. Un inventaire centralisé réduit souvent le temps moyen de rétablissement, le MTTR, de l'ordre de 20 à 30 %, car on n'a plus à chercher la machine ni son rôle au moment de la panne. La conformité et le tri des licences font baisser les coûts logiciels d'environ 15 à 25 % , car on cesse de payer des licences que personne n'utilise. Quand les dépendances sont dessinées, la couverture de sauvegarde gagne de l'ordre de 30 à 50 %, car on sait enfin quelles ressources doivent être sauvegardées ensemble. Une **CMDB** à jour (une base des configurations, présentée plus loin) peut faire reculer jusqu'à 40 % les incidents liés à du matériel ou du logiciel dont l'obsolescence n'était suivie par personne.

Pour une ESN, une entreprise de services du numérique (anciennement appelée SSII), le même inventaire aide à prendre cinq types de décisions. Il permet de repérer les équipements sous-utilisés ou trop vieux, et d'éviter d'acheter du matériel déjà disponible. Il permet aussi de repérer rapidement ce qui ne respecte pas les règles internes de sécurité, de planifier les remplacements au lieu de les subir, et de savoir quelles licences sont en trop ou manquent avant un contrôle de l'éditeur. Enfin, il fournit des chiffres pour justifier un investissement, plutôt qu'une simple impression.

## Inventaire et audit

Ce recensement décrit les ressources de l'organisation. Il est aussi le point de départ d'un **audit**, qui vérifie que le système d'information est conforme, sûr et capable de supporter la charge. L'audit contrôle si les ressources recensées sont utilisées comme prévu, sécurisées, à jour et conformes aux obligations légales ou contractuelles. Sans inventaire, l'auditeur ne sait pas quoi examiner, et l'équipe ne sait pas où appliquer les corrections.

| Type d'audit | Éléments contrôlés | Objectifs |
| :--- | :--- | :--- |
| **Matériel** | Postes fixes et mobiles, serveurs, téléphones, tablettes, imprimantes, infrastructure réseau et télécom | Vérifier l'état et la disponibilité, détecter le matériel obsolète, planifier le renouvellement |
| **Sécurité** | Antivirus, pare-feu, droits utilisateurs, mots de passe, accès aux données, politiques de sécurité | Identifier les vulnérabilités, sécuriser le SI, protéger les données sensibles |
| **Solutions collaboratives** | Messagerie, outils collaboratifs, plateformes internes de communication | Vérifier l'accès, la conformité, et la performance des outils collaboratifs |
| **Sauvegarde / continuité** | Serveurs de sauvegarde, solutions cloud, data centers, procédures de restauration | Garantir la continuité d'activité et la restauration rapide en cas de panne |
| **Solutions applicatives** | Logiciels métiers, logiciels de gestion, systèmes d'exploitation et mises à jour | Vérifier la conformité, la performance et la mise à jour des logiciels |

Chaque ligne suppose que l'élément figure dans l'inventaire : un pare-feu absent de la liste n'est pas audité, il est simplement oublié.

## Les trois familles de ressources

Les **ressources matérielles** sont les équipements physiques : postes de travail, serveurs de fichiers, d'applications ou de messagerie, commutateurs, routeurs, pare-feu, imprimantes, scanners, baies de stockage, NAS, disques.

Les **ressources logicielles** sont les programmes installés : systèmes d'exploitation, applications métier et bureautique, antivirus, outils de supervision, licences et abonnements. Les licences font partie des ressources : les oublier conduit soit à payer trop, soit à se retrouver hors contrat lors d'un contrôle.

Les **ressources immatérielles** n'ont pas de support physique : ce sont les comptes et les groupes, les droits d'accès, les bases de données, la documentation technique ou les procédures internes. Une procédure de restauration qui n'existe que dans la tête d'une personne disparaît avec elle si cette personne quitte l'entreprise.

On appelle **ressource critique** une ressource dont le rôle est assez central pour qu'un dysfonctionnement ait un impact majeur sur l'activité. Un serveur de fichiers qui contient tout ce dont une application a besoin pour être mise en production est critique, même s'il n'est pas l'équipement le plus cher du parc.

## Les méthodes de recensement

Le recensement **manuel** consiste à ouvrir les machines, noter les logiciels installés, et remplir une fiche par ressource. Cette méthode est lente, mais elle reste utile pour un petit parc, ou pour vérifier qu'un outil automatique n'a pas oublié un équipement hors réseau.

Le recensement **automatisé** s'appuie sur des outils comme **GLPI**, **OCS Inventory** ou **Spiceworks**. L'inventaire est alors centralisé, les licences sont suivies, et l'outil peut signaler la disparition d'une machine ou un logiciel qui n'est plus couvert.

L'inventaire devient faux dès qu'un équipement est acheté ou jeté sans mise à jour. Il faut donc l'actualiser à chaque entrée et à chaque sortie, archiver les éléments obsolètes au lieu de les effacer sans laisser de trace, et désigner un **responsable du patrimoine**. En atelier de projet, ce rôle est confié à un membre du groupe. En entreprise, c'est une personne nommément désignée, et non « tout le monde ».

## Présenter l'inventaire

Une **fiche d'équipement** tient sur une ligne et indique l'identifiant, le type, le modèle ou la description, l'utilisateur, l'emplacement, la date, la garantie ou la licence, les observations et les dépendances.

| ID | Type | Modèle / Description | Utilisateur | Emplacement | Date | Garantie / Licence | Observations | Dépendances |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 001 | PC | Dell Latitude 3510 | Dev 1 | Bureau | 01/02/2024 | 3 ans | SSD rapide, chauffe légèrement | NAS, IDE |

La colonne des dépendances est celle que l'on oublie le plus souvent. Pourtant, ce poste ne sert à rien si le NAS est arrêté, et le développeur ne peut pas travailler sans son environnement : la fiche permet de le savoir avant la panne.

La **cartographie** du système d'information reprend les ressources principales et dessine ces liens, dans draw.io ou Lucidchart par exemple. Un code couleur simple suffit : bleu pour le matériel, vert pour le logiciel, jaune pour l'immatériel. Le schéma permet de voir qu'une application métier dépend d'une base de données, qui dépend d'un serveur, lui-même dépendant d'un onduleur.

La **CMDB** (*Configuration Management Database*) est la base qui rassemble toutes ces informations : le matériel, les logiciels, les ressources immatérielles, leurs relations, leurs dépendances et leur criticité. Elle permet d'avoir une vue d'ensemble du système, de suivre les dépendances, de préparer un changement ou de traiter un incident, et de produire les rapports demandés par la direction ou par un audit. Une CMDB qui n'est plus mise à jour perd tout son intérêt.

## Études de cas

**Cas 1 : une start-up.** Quatre personnes y développent un logiciel interne de gestion des clients. Le parc comprend des portables Dell Latitude, un NAS Synology DS220+, un routeur et un commutateur, VS Code et GitHub, Sage Start, une imprimante.

Travail demandé : réaliser un tableau d'inventaire, identifier les ressources critiques, proposer une organisation des sauvegardes et décrire les dépendances.

**Cas 2 : une PME.** Quinze personnes y développent des applications mobiles. Le parc comprend dix postes fixes de développement, cinq portables pour l'encadrement, un NAS Synology DS920+, MySQL, un réseau avec commutateurs et pare-feu, la suite JetBrains, des comptes et des droits.

Travail demandé : classer chaque ressource (matérielle, logicielle, immatérielle), réaliser un tableau complet, identifier les ressources critiques pour le développement et pour la sécurité, décrire une dépendance entre deux actifs et analyser les risques de panne ou de licence.

**Cas 3 : une société plus grande.** Cinquante personnes y mènent plusieurs projets web et mobiles en même temps. Le parc comprend trente-cinq postes de développement HP G6, quinze portables de chefs de projet Dell XPS reliés en VPN, un serveur de test et un serveur de production, un intranet, les environnements de développement, la bureautique, les outils de design, la documentation.

Travail demandé : réaliser l'inventaire complet, identifier les ressources critiques et ce qu'il faut sécuriser, décrire les dépendances avec une cartographie, proposer des améliorations de maintenance et de sécurité, puis analyser les risques de perte ou de panne en proposant une solution pour chacun.

## Inventaire du projet d'atelier

L'objectif est de produire l'inventaire des ressources dont le projet d'atelier a besoin, et non celui d'un parc imaginaire.

Lister le matériel, les logiciels et les ressources immatérielles. Remplir le tableau d'inventaire. Marquer les ressources critiques. Décrire les dépendances. Proposer comment les sauvegardes sont organisées. Indiquer ce qui sera amélioré en maintenance et en sécurité. Une ressource qui n'a ni propriétaire, ni sauvegarde, ni dépendance notée n'est pas encore inventoriée : elle est seulement citée.
