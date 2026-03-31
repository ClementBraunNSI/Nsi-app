---
title: Systèmes d'Exploitation
description: >-
  Introduction aux systèmes d'exploitation (OS), leur histoire, composants et
  fonctionnement.
level: premiere
chapter: Systèmes d'exploitation
icon: "\U0001F4BB"
badgeId: premiere_systemes_exploitation
prerequisites:
  - os_linux_commandes
---


# Introduction aux Systèmes d'Exploitation

## Définition

Un **Système d'Exploitation** (SE ou *OS* pour *Operating System*) est un ensemble de programmes qui permet :
1.  La liaison entre le matériel (hardware) et les logiciels (software).
2.  La gestion des ressources de l'ordinateur (mémoire, processeur, disques).
3.  De fournir une interface à l'utilisateur pour interagir avec la machine.

Sans OS, un ordinateur ne serait qu'un amas de composants électroniques inertes.

## Contexte Historique

Au début de l'informatique, les utilisateurs devaient configurer physiquement la machine ou écrire des instructions très bas niveau pour chaque tâche. Les systèmes d'exploitation sont nés du besoin de simplifier et d'automatiser ces tâches répétitives (gestion des fichiers, exécution de programmes).

### Types de Systèmes

| Type | Description | Exemples |
| :--- | :--- | :--- |
| **Système Libre** | Code source ouvert, modifiable et partageable gratuitement. | **Linux** (Ubuntu, Debian), FreeBSD |
| **Système Propriétaire** | Code source fermé, propriété d'une entreprise, utilisation sous licence. | **Windows**, **macOS**, iOS |

## Composants d'un OS

L'architecture d'un OS s'articule autour de plusieurs couches, dont la plus critique est le **Noyau**.

### Le Noyau (Kernel)

C'est le cœur du système. Il a les pleins pouvoirs sur le matériel et gère :
*   **La Mémoire (RAM)** : Il alloue de l'espace aux programmes.
*   **Le Processeur (CPU)** : Il décide quel programme s'exécute à quel moment (ordonnancement).
*   **Les Périphériques** : Il communique avec le clavier, l'écran, le disque dur via des pilotes (*drivers*).

### Le Système de Fichiers

C'est la méthode d'organisation des données sur le disque dur. La structure est **arborescente** (comme un arbre inversé), partant d'une **racine**.

*   **Sous UNIX / Linux** : La racine est notée `/`. Tout est fichier ou dossier à partir de cette racine.
    *   `/home` : Dossiers des utilisateurs.
    *   `/etc` : Fichiers de configuration.
    *   `/bin` : Programmes exécutables.
*   **Sous Windows** : La racine est souvent `C:\`. Chaque lecteur a sa propre lettre.
    *   `C:\Users` : Dossiers des utilisateurs.
    *   `C:\Windows` : Système.
    *   `C:\Program Files` : Logiciels installés.

## Les Permissions

Pour la sécurité, un OS moderne est **multi-utilisateurs**. Chaque fichier possède des permissions définissant qui peut faire quoi.

Le modèle UNIX utilise le système **UGO** (User, Group, Others) avec 3 droits :
*   **Read (r)** : Lecture.
*   **Write (w)** : Écriture (modification/suppression).
*   **Execute (x)** : Exécution (lancer un programme).

## Les Interfaces Utilisateur

Comment l'humain parle-t-il à la machine ?

### 1. Interface en Ligne de Commande (CLI)
*   **Principe** : L'utilisateur tape des commandes textuelles dans un terminal (*shell*).
*   **Avantages** : Très rapide, puissant, automatisable (scripts), peu gourmand en ressources.
*   **Utilisation** : Serveurs, administration système, développement.

### 2. Interface Graphique (GUI)
*   **Principe** : Fenêtres, icônes, souris, menus.
*   **Avantages** : Intuitif, visuel, facile d'accès pour les débutants.
*   **Inconvénients** : Plus lourd, parfois moins précis pour des tâches complexes.
