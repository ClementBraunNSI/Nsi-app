---
title: Simulation de Serveurs WEB et DNS
description: Mise en place de serveurs WEB et DNS dans un réseau simulé avec Filius.
level: '2'
chapter: Internet
icon: "earth"
prerequisites:
  - Activite
audience: public
---

> **Objectif de l'activité**
> Comprendre le fonctionnement des **serveurs WEB** et **DNS** en simulant un environnement réseau complet avec Filius.

## 1. <Icone nom="wrench" /> Création du réseau

> **Prérequis**
> Reprendre le réseau du TP précédent comme base de travail.

## 2. <Icone nom="monitor" /> Configuration d'un serveur WEB

1. Ajouter un ordinateur dans le réseau `192.168.5.0` et le configurer pour y avoir accès.
2. En mode lecture, ajouter le **logiciel de serveur web** sur l'ordinateur.
3. Double-cliquer sur l'application serveur web et **démarrer le serveur**.
4. Sur la machine `192.168.1.11`, ajouter le logiciel de navigation internet et entrer l'adresse IP du serveur web dans la barre d'adresse. La page devrait s'actualiser.

## 3. <Icone nom="globe" /> Configuration d'un serveur DNS

> **Préparation**
> Ajouter une interface au routeur et créer un réseau `192.168.2.11` avec un ordinateur.

1. Sur la machine `192.168.2.11`, ajouter l'application **serveur DNS** et l'ouvrir.
2. Comme nom de domaine, ajouter `www.nsi.fr` et associer l'adresse `192.168.3.12` (le serveur WEB).
3. Ajouter l'adresse du serveur DNS pour tous les ordinateurs.

## 4. <Icone nom="file-text" /> Ajout d'une page web personnalisée

1. Sur le serveur WEB, ajouter l'application **explorateur de fichiers**.
2. Importer le fichier `index.html` et le placer dans le dossier **webserver**.
3. Actualiser et tester l'accès à la page depuis la machine `192.168.1.10`.

> **Résultat attendu**
> La page web personnalisée devrait maintenant être accessible via le nom de domaine configuré !
