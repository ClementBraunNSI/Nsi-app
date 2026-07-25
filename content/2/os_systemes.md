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
  - archi_von_neumann
---

# Systèmes d'exploitation

## Objectifs

- Définir le rôle d'un **système d'exploitation** (OS)
- Distinguer noyau, système de fichiers, permissions, interfaces
- Comparer logiciel libre et propriétaire

## Idée clé

L'OS est la couche qui **gère le matériel** et **offre des services** aux programmes et à l'utilisateur : sans lui, chaque application devrait parler directement au processeur, à la mémoire et aux périphériques.

## À quoi sert un OS ?

1. Relier **matériel** et **logiciels**
2. Partager les ressources (CPU, RAM, disques)
3. Fournir une **interface** (graphique ou terminal)

Historiquement, les OS automatisent des tâches autrefois manuelles : lancer un programme, gérer les fichiers, partager la machine entre utilisateurs.

| Type | Idée | Exemples |
| :--- | :--- | :--- |
| **Libre** | Code ouvert, modifiable, redistribuable | Linux (Ubuntu, Debian), FreeBSD |
| **Propriétaire** | Code fermé, licence commerciale | Windows, macOS, iOS |

## Le noyau (kernel)

Cœur de l'OS, avec un accès privilégié au matériel :

- **Mémoire** : allouer / libérer la RAM
- **Processeur** : choisir quel processus tourne (*ordonnancement*)
- **Périphériques** : pilotes (*drivers*) pour clavier, écran, disque…

## Système de fichiers

Organisation **arborescente** des données.

- **Linux / UNIX** : une seule racine `/`
  - `/home` utilisateurs, `/etc` config, `/bin` exécutables
- **Windows** : racines par lecteur (`C:\`, …)
  - `C:\Users`, `C:\Windows`, `C:\Program Files`

Tout chemin se lit depuis la racine jusqu'au fichier.

## Permissions (modèle UNIX)

OS multi-utilisateurs : chaque fichier a des droits **UGO** (User, Group, Others) :

| Droit | Lettre | Effet |
|---|:---:|---|
| Lecture | `r` | Lire / lister |
| Écriture | `w` | Modifier / supprimer |
| Exécution | `x` | Lancer un programme / traverser un dossier |

## Interfaces : CLI et GUI

- **CLI** (ligne de commande) : terminal, scripts, peu de ressources, très précis
- **GUI** (interface graphique) : fenêtres, souris, plus accessible, plus lourd

Les deux coexistent : on administre souvent un serveur en CLI, on utilise un PC en GUI.

## Piège fréquent

Confondre **application** et **système d'exploitation**. Un navigateur tourne *sur* l'OS ; c'est l'OS qui lui alloue CPU et mémoire et qui parle au disque.

## À retenir

- OS = intermédiaire matériel ↔ logiciels / utilisateur
- Noyau : CPU, RAM, périphériques
- Fichiers organisés en arbre (racine `/` ou `C:\`)
- Permissions `rwx` pour propriétaire, groupe, autres
- Libre vs propriétaire : ouverture du code et licence
- CLI et GUI sont deux façons de piloter le même OS

## Pour s'entraîner

Passer aux [commandes Linux](/cours/2/os_linux_commandes) pour manipuler fichiers et permissions en pratique.
