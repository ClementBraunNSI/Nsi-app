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

BTS SIO, bloc 1. Avant de sécuriser, de sauvegarder ou de remplacer quoi que ce soit, il faut savoir ce que l'organisation possède. Le **patrimoine numérique** regroupe les ressources dont le système d'information a besoin pour fonctionner : le matériel, les logiciels, et ce qui n'est ni l'un ni l'autre, comptes, droits, bases, procédures. Un serveur qu'on a oublié dans un placard fait encore partie du patrimoine. Il fait aussi partie de la surface d'attaque.

Tenir cet inventaire à jour est une exigence de la norme **ISO/IEC 27001:2022**, pas seulement une bonne habitude de technicien. L'annexe **A.5.9** demande que les actifs liés à l'information et aux installations qui la traitent soient identifiés, et qu'un inventaire en soit établi et tenu à jour. L'annexe **A.5.10** demande une organisation qui garantisse que ces informations et ces ressources sont protégées, utilisées et gérées comme il faut. L'annexe **A.5.36** demande que l'organisation voie l'ensemble de ses actifs au regard de ses politiques de sécurité, de ses règles et des standards qu'elle s'impose. Sans liste, ces trois contrôles ne peuvent pas être démontrés à un auditeur.

## Pourquoi l'inventaire change le quotidien

Les ordres de grandeur qu'on retient en cours donnent une idée de l'écart, pas une promesse chiffrée au pourcent près. Un inventaire centralisé réduit souvent le temps moyen de rétablissement, le MTTR, de l'ordre de 20 à 30 %, parce qu'on ne cherche plus la machine ni son rôle au moment de la panne. La conformité et le tri des licences font baisser les coûts logiciels d'environ 15 à 25 % : on arrête de payer des sièges que personne n'ouvre. Quand les dépendances sont dessinées, la couverture de sauvegarde gagne de l'ordre de 30 à 50 %, parce qu'on sait enfin ce qui doit partir avec quoi. Une **CMDB** tenue (une base des configurations, on y revient) peut faire reculer jusqu'à 40 % les incidents liés à du matériel ou du logiciel dont l'obsolescence n'était suivie par personne.

Pour une ESN, une entreprise de services du numérique (on disait SSII), le même inventaire sert à cinq décisions. On voit les équipements sous-utilisés ou déjà trop vieux, et l'on évite de racheter ce qui dort. On repère vite ce qui sort des règles internes de sécurité. On ordonne les remplacements au lieu de les subir. On sait quelles licences sont en trop, ou en moins, avant un contrôle de l'éditeur. Et l'on dispose de chiffres pour justifier un investissement, au lieu d'une impression.

## L'audit s'appuie sur la liste

Ce recensement dit de quoi l'organisation est faite. Il est aussi le point de départ d'un **audit** : on vérifie que le système d'information est conforme, sûr, et qu'il tient la charge. On regarde si les ressources recensées sont utilisées comme prévu, sécurisées, à jour, et conformes aux obligations légales ou contractuelles. Sans inventaire, l'auditeur ne sait pas quoi ouvrir, et l'équipe ne sait pas où appliquer une correction.

| Type d'audit | Éléments contrôlés | Objectifs |
| :--- | :--- | :--- |
| **Matériel** | Postes fixes et mobiles, serveurs, téléphones, tablettes, imprimantes, infrastructure réseau et télécom | Vérifier l'état et la disponibilité, détecter le matériel obsolète, planifier le renouvellement |
| **Sécurité** | Antivirus, pare-feu, droits utilisateurs, mots de passe, accès aux données, politiques de sécurité | Identifier les vulnérabilités, sécuriser le SI, protéger les données sensibles |
| **Solutions collaboratives** | Messagerie, outils collaboratifs, plateformes internes de communication | Vérifier l'accès, la conformité, et la performance des outils collaboratifs |
| **Sauvegarde / continuité** | Serveurs de sauvegarde, solutions cloud, data centers, procédures de restauration | Garantir la continuité d'activité et la restauration rapide en cas de panne |
| **Solutions applicatives** | Logiciels métiers, logiciels de gestion, systèmes d'exploitation et mises à jour | Vérifier la conformité, la performance et la mise à jour des logiciels |

Chaque ligne suppose que l'objet existe dans l'inventaire. Un pare-feu absent de la liste n'est pas audité. Il est simplement oublié.

## Trois familles de ressources

Les **ressources matérielles** se touchent : postes de travail, serveurs de fichiers, d'applications ou de messagerie, commutateurs, routeurs, pare-feu, imprimantes, scanners, baies de stockage, NAS, disques.

Les **ressources logicielles** s'installent : systèmes d'exploitation, applications métier et bureautique, antivirus, outils de supervision, licences et abonnements. Une licence est une ressource. L'oublier, c'est soit payer en trop, soit se retrouver hors contrat le jour d'un contrôle.

Les **ressources immatérielles** ne s'achètent pas en carton : comptes et groupes, droits d'accès, bases de données, documentation technique, procédures internes. Une procédure de restauration qui n'existe que dans la tête d'une personne part avec elle.

On appelle **ressource critique** une ressource dont le rôle est assez central pour qu'un dysfonctionnement ait un impact majeur sur l'activité. Un serveur de fichiers qui porte tout ce dont une application a besoin pour partir en production est critique, même s'il n'est pas le plus cher du parc.

## Comment on recense

Le recensement **manuel** consiste à ouvrir les machines, noter les logiciels installés, et remplir une fiche par ressource. Il est lent. Il reste utile pour un petit parc, ou pour vérifier qu'un outil automatique n'a pas raté un équipement hors du réseau.

Le recensement **automatisé** s'appuie sur des outils comme **GLPI**, **OCS Inventory** ou **Spiceworks**. L'inventaire est centralisé, les licences se suivent, et l'outil peut alerter quand une machine disparaît ou qu'un logiciel n'est plus couvert.

La liste se périme le jour où l'on achète ou jette sans la mettre à jour. On l'actualise à chaque entrée et à chaque sortie, on archive ce qui est obsolète au lieu de l'effacer sans trace, et l'on désigne un **responsable du patrimoine**. En atelier de projet, c'est un rôle du groupe. En entreprise, c'est une personne nommée, pas « tout le monde ».

## Comment on le montre

Une **fiche d'équipement** tient sur une ligne : identifiant, type, modèle ou description, utilisateur, emplacement, date, garantie ou licence, observations, dépendances.

| ID | Type | Modèle / Description | Utilisateur | Emplacement | Date | Garantie / Licence | Observations | Dépendances |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 001 | PC | Dell Latitude 3510 | Dev 1 | Bureau | 01/02/2024 | 3 ans | SSD rapide, chauffe légèrement | NAS, IDE |

La colonne des dépendances est celle qui manque le plus souvent. Ce poste ne sert à rien si le NAS est arrêté, et le développeur ne travaille pas sans son environnement. La fiche le dit avant la panne.

La **cartographie** du système d'information reprend les ressources principales et dessine ces liens, dans draw.io ou Lucidchart par exemple. Un code couleur simple suffit : bleu pour le matériel, vert pour le logiciel, jaune pour l'immatériel. Le dessin sert à voir qu'une application métier dépend d'une base, qui dépend d'un serveur, qui dépend d'un onduleur.

La **CMDB** (*Configuration Management Database*) est la base qui rassemble tout cela : matériel, logiciels, ressources immatérielles, relations, dépendances, criticité. On s'en sert pour voir le système d'un coup, suivre ce qui dépend de quoi, préparer un changement ou un incident, et sortir les rapports que la direction ou un audit demande. Une CMDB qui n'est plus mise à jour redevient un tableur de l'année dernière.

## Trois parcs, le même travail

**Cas 1, une start-up.** Quatre personnes, un logiciel interne de gestion des clients. Le parc : des portables Dell Latitude, un NAS Synology DS220+, un routeur et un commutateur, VS Code et GitHub, Sage Start, une imprimante.

À faire : un tableau d'inventaire, les ressources critiques, une organisation des sauvegardes, les dépendances.

**Cas 2, une PME.** Quinze personnes, des applications mobiles. Le parc : dix postes fixes de développement, cinq portables pour l'encadrement, un NAS Synology DS920+, MySQL, un réseau avec commutateurs et pare-feu, la suite JetBrains, des comptes et des droits.

À faire : classer chaque ressource (matérielle, logicielle, immatérielle), un tableau complet, les ressources critiques pour le développement et pour la sécurité, une dépendance entre deux actifs, les risques de panne ou de licence.

**Cas 3, une société plus grande.** Cinquante personnes, plusieurs projets web et mobiles en même temps. Le parc : trente-cinq postes de développement HP G6, quinze portables de chefs de projet Dell XPS reliés en VPN, un serveur de test et un serveur de production, un intranet, les environnements de développement, la bureautique, les outils de design, la documentation.

À faire : l'inventaire complet, les ressources critiques et ce qu'il faut en sécuriser, les dépendances et une cartographie, des améliorations de maintenance et de sécurité, les risques de perte ou de panne et une parade pour chacun.

## Inventaire du projet d'atelier

L'objectif est de produire l'inventaire des ressources dont votre projet d'atelier a besoin, pas un parc imaginaire.

Listez le matériel, les logiciels et les ressources immatérielles. Remplissez le tableau d'inventaire. Marquez les ressources critiques. Décrivez les dépendances. Proposez comment les sauvegardes sont organisées. Indiquez ce que vous améliorerez en maintenance et en sécurité. Une ressource qui n'a ni propriétaire, ni sauvegarde, ni dépendance notée n'est pas encore inventoriée : elle est seulement citée.
