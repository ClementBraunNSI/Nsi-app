---
title: "Patrimoine Informatique"
description: "Recensement et identification des ressources numériques (SIO Bloc 1)"
level: "4"
chapter: "Gestion de projet"
icon: "🧩"
---

# 🧩 Patrimoine informatique
**BTS SIO • Bloc 1 — Recenser et identifier les ressources numériques**

## 🎯 Introduction

> **Définition**
>
> Le **patrimoine numérique** regroupe toutes les ressources nécessaires au fonctionnement d’un système d’information : *matérielles*, *logicielles* et *immatérielles*.

Tenir un inventaire clair et précis de toutes les ressources numériques, y compris les matérielles, logicielles et imatérielles permet aussi de respecter la norme ISO-27001:2022.

> **📚 Normes ISO/IEC 27001 — Annexes clés**
>
> * **Annexe A.5.9 — Inventaire des actifs**
>   *“Les actifs associés à l’information et aux installations de traitement de l’information doivent être identifiés, et un inventaire de ces actifs doit être établi et tenu à jour.”*
> * **Annexe A.5.10 - Contrôle des systèmes d'informations**
>   *Ce contrôle vise à mettre en place une structure permettant aux organisations de garantir que les informations et autres ressources sont correctement protégées, utilisées et gérées.*
> * **Annexe A.5.36 - Politiques de sécurité**
>   *Les sociétés doivent avoir une visualisation complète de tous les actifs suivant leurs politiques de sécurité, règles fondées et standards imposés.*

## ❓ Pourquoi entretenir et maintenir l’inventaire

> **📈 Chiffres clés (ordres de grandeur)**
>
> * −20 à −30% de temps moyen de rétablissement (MTTR) avec inventaire centralisé.
> * −15 à −25% de coûts logiciels via conformité et optimisation des licences.
> * +30 à +50% de couverture de sauvegarde quand les dépendances sont cartographiées.
> * Jusqu’à −40% d’incidents liés à l’obsolescence non suivie avec une CMDB (Configuration Management DataBase) tenue.

> **🏢 Bénéfices pour une SS2I / ESN**
>
> * Optimisation des coûts : connaître les équipements sous-utilisés ou obsolètes permet d’éviter les dépenses inutiles.
> * Sécurité accrue : repérer rapidement les matériels ou logiciels non conformes aux politiques internes.
> * Planification des interventions : prioriser les actions de maintenance ou de remplacement.
> * Gestion simplifiée des licences : éviter les sanctions en cas de non-conformité.
> * Aide à la prise de décision : fournir des statistiques fiables pour orienter les investissements.

## Audits d'une SS2I

Ce recensement permet aussi de connaître tous les éléments permettant le fonctionnement de la société.
Il peut être d'une (grande) aide pour la réalisation d'**audits** pour maîtriser au mieux l'ensemble des ressources numériques (autant matérielles qu'immatérielles) de la société.

Un audit informatique consiste à vérifier la conformité, la sécurité et la performance du système d’information d’une entreprise.
L’objectif est d’évaluer si les ressources recensées (matérielles et logicielles) sont :
* **correctement utilisées,**
* **sécurisées,**
* **à jour,**
* **et conformes aux normes et obligations légales ou contractuelles.**

Un audit s’appuie toujours sur un inventaire fiable : sans inventaire, impossible de savoir ce qu’il faut vérifier, ni sur quoi appliquer des mesures correctives.

### 🔍 Types d’audits informatiques

| Type d’audit | Éléments contrôlés | Objectifs |
| :--- | :--- | :--- |
| **Matériel** | Postes fixes et mobiles, serveurs, téléphones, tablettes, imprimantes, infrastructure réseau et télécom | Vérifier l’état et la disponibilité, détecter le matériel obsolète, planifier le renouvellement |
| **Sécurité** | Antivirus, pare-feu, droits utilisateurs, mots de passe, accès aux données, politiques de sécurité | Identifier les vulnérabilités, sécuriser le SI, protéger les données sensibles |
| **Solutions collaboratives** | Messagerie, outils collaboratifs, plateformes internes de communication | Vérifier l’accès, la conformité, et la performance des outils collaboratifs |
| **Sauvegarde / continuité** | Serveurs de sauvegarde, solutions cloud, data centers, procédures de restauration | Garantir la continuité d’activité et la restauration rapide en cas de panne |
| **Solutions applicatives** | Logiciels métiers, logiciels de gestion, systèmes d’exploitation et mises à jour | Vérifier la conformité, la performance et la mise à jour des logiciels |

## 🗂️ Typologie des ressources

### 📦 Ressources matérielles
Postes de travail, serveurs (fichiers, applications, messagerie), périphériques réseau (switch, routeur, firewall), imprimantes/scanners, stockages (NAS, disques).

### 💻 Ressources logicielles
Systèmes d’exploitation, applications métiers et bureautiques, logiciels de sécurité (antivirus, monitoring), licences et abonnements.

### 🔑 Ressources immatérielles
Comptes utilisateurs et groupes, droits d’accès, bases de données, documentation technique et procédures internes.

> **Note :** On appelle **ressource critique** une ressource qui possède un rôle significatif et dont son disfonctionnement pourrait avoir **un impact majeur** sur le fonctionnement de l'entreprise.
> *Exemple : un serveur de fichier qui contient tous les fichiers relatif à une application qui doit partir en production.*

## 📝 Méthodes d’inventaire

### 🧭 Recensement manuel
Inspection des équipements, vérification des logiciels installés, fiches individuelles par ressource.

### ⚙️ Recensement automatisé
Outils recommandés : **GLPI**, **OCS Inventory**, **Spiceworks**.
Avantages : inventaire centralisé, suivi des licences, alertes.

### 🔄 Suivi et mise à jour
Mise à jour après chaque acquisition/suppression, archivage des obsolètes, **responsable du patrimoine** désigné (projet AP ou entreprise).

## 🗺️ Représentation du patrimoine

### 📄 Fiches d’équipement
Tableau avec colonnes : ID, Type, Modèle/Description, Utilisateur, Emplacement, Date, Garantie/Licence, Observations, Dépendances.

**Exemple de fiche :**

| ID | Type | Modèle / Description | Utilisateur | Emplacement | Date | Garantie / Licence | Observations | Dépendances |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 001 | PC | Dell Latitude 3510 | Dev 1 | Bureau | 01/02/2024 | 3 ans | SSD rapide, chauffe légèrement | NAS, IDE |

### 📊 Cartographie du SI
Identifier les ressources principales, leurs **dépendances** et les représenter (draw.io, Lucidchart…).
Par exemple, codes couleurs : bleu = matériel, vert = logiciel, jaune = immatériel.

### 🗃️ Modèle CMDB
La **CMDB** est une base centralisée regroupant l’ensemble des informations sur le patrimoine informatique d’une organisation.
Elle contient des données détaillées sur les ressources matérielles, logicielles et immatérielles, leurs relations et dépendances, ainsi que leur criticité.

La CMDB permet :
* De visualiser l’ensemble des composants du SI.
* De suivre les dépendances entre ressources.
* De gérer les changements, les incidents et les mises à jour.
* De produire des rapports stratégiques pour la direction et les audits.

## 🧪 Études de cas

### 🚀 Cas 1 — Start-up
**Contexte :** Start-up de 4 employés, logiciel interne de gestion client.

**Ressources :**
* PC portables Dell Latitude
* NAS Synology DS220+
* routeur/switch
* VS Code & GitHub
* Sage Start
* imprimante

**Travail à faire :**
1. Créer un **tableau d’inventaire**.
2. Identifier les **ressources critiques**.
3. Proposer une **organisation des sauvegardes**.
4. Identifier les **dépendances**.

### 🏢 Cas 2 — PME
**Contexte :** PME de 15 employés, développement d’apps mobiles.

**Ressources :**
* 10 PC fixes dev
* 5 portables managers
* NAS Synology DS920+
* MySQL
* réseau (switches+firewall)
* Suite JetBrains
* comptes/droits.

**Travail à faire :**
1. Classer les ressources : matérielles , immatérielles, logicielles
2. Créer un tableau d'inventaire complet.
3. Quelles sont les ressources critiques (dév/sécurité).
4. Donner une dépendance entre 2 ressources/actifs.
5. Risques potentiels (panne, licence…).

### 🏙️ Cas 3 — Grande société
**Contexte :** 50 employés, projets web/mobiles simultanés.

**Ressources :**
* 35 dev (HP G6)
* 15 chefs de projet (Dell XPS, VPN)
* serveur de test et de production
* intranet
* IDE/logiciel bureautique/logiciels de design
* documentation.

**Travail à faire :**
1. Inventaire complet.
2. Ressources critiques et **sécurité**.
3. Dépendances, **cartographie du SI**.
4. Améliorations maintenance/sécurité.
5. Risques de perte/panne & solutions.

## 📝 TP — Inventaire du projet d’AP

### Objectif
Créer un inventaire complet des ressources nécessaires à votre projet d’AP.

### Consignes
* Lister toutes les ressources matérielles, logicielles et immatérielles.
* Réaliser le tableau d'inventaire.
* Identifier les ressources **critiques**.
* Décrire les **dépendances**.
* Proposer une **organisation des sauvegardes**.
* Suggérer des **améliorations** (maintenance/sécurité).
