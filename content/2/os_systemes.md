---
title: Systèmes d'Exploitation
description: >-
  Introduction aux systèmes d'exploitation (OS), leur histoire, composants et
  fonctionnement.
level: premiere
chapter: Systèmes d'exploitation
icon: "laptop"
badgeId: premiere_systemes_exploitation
prerequisites:
  - archi_von_neumann
audience: public
---

# Systèmes d'exploitation

Le processeur, la mémoire et les bus ont déjà été étudiés. Pourtant, les programmes ordinaires ne communiquent pas directement avec eux : entre le code et le matériel, il y a un **système d'exploitation**. Sans lui, chaque application devrait savoir allumer un pixel, réserver une case mémoire ou lire une touche du clavier. Le système d'exploitation (OS) fait ce travail une fois pour toutes et le met à la disposition des programmes.

Il fait le lien entre le matériel et les logiciels, partage les ressources (processeur, mémoire, disques) entre les programmes qui fonctionnent en même temps, et propose une interface, graphique ou textuelle. Historiquement, il automatise des tâches qu'un opérateur faisait à la main, comme lancer un travail, ranger les fichiers ou attribuer la machine à chacun à tour de rôle.

On distingue souvent deux familles de systèmes, selon ce que l'on a le droit de faire avec leur code.

| Type | Idée | Exemples |
| :--- | :--- | :--- |
| **Libre** | Le code est ouvert, on peut le lire, le modifier, le redistribuer | Linux (Ubuntu, Debian), FreeBSD |
| **Propriétaire** | Le code est fermé, une licence encadre l'usage | Windows, macOS, iOS |

« Libre » ne veut pas dire « sans auteur », ni toujours « gratuit ». Cela veut dire que les règles de la licence autorisent à étudier le système et à le modifier. « Propriétaire » veut dire que l'éditeur garde ce droit.

## Le noyau

Le **noyau**, ou *kernel*, est la partie qui a un accès privilégié au matériel. Le reste de l'OS et les applications passent par lui.

Il attribue la mémoire vive aux programmes et la récupère quand ils se terminent. Il choisit aussi quel processus utilise le processeur, et pendant combien de temps : c'est l'**ordonnancement**. Enfin, grâce aux pilotes (*drivers*), il communique avec le clavier, l'écran ou le disque. Un pilote joue le rôle de traducteur : quand le noyau demande de lire un secteur, le pilote sait quels signaux envoyer à ce modèle précis de disque.

## L'arborescence des fichiers

Les fichiers sont organisés en arbre, et tout chemin part d'une racine.

Sous Linux et les autres UNIX, il n'y a qu'une racine, `/`. `/home` contient les dossiers des utilisateurs, `/etc` la configuration, `/bin` des programmes exécutables. Une clé USB ou un second disque apparaissent à un endroit de cet arbre : on dit qu'on les « monte ». Contrairement à Windows, ils n'ont pas de lettre.

Sous Windows, chaque lecteur a sa racine : `C:\`, parfois `D:\`. `C:\Users` correspond à peu près à `/home`, `C:\Windows` au système, `C:\Program Files` aux applications installées. Dans les deux systèmes, un chemin se lit de la racine jusqu'au fichier, et seule l'écriture change.

## Les droits d'accès

Un OS prévu pour plusieurs utilisateurs ne laisse pas tout le monde tout modifier. Sous UNIX, chaque fichier porte des droits pour trois publics : le propriétaire (*user*), le groupe (*group*), et les autres (*others*). Ce triplet s'abrège UGO.

| Droit | Lettre | Effet |
|---|:---:|---|
| Lecture | `r` | Lire le fichier, ou lister le dossier |
| Écriture | `w` | Modifier, supprimer |
| Exécution | `x` | Lancer un programme, ou traverser un dossier |

Le droit `x` sur un dossier peut surprendre : il ne lance rien, mais il autorise à entrer dans le dossier pour atteindre ce qu'il contient. Sans lui, connaître le nom d'un fichier ne suffit pas à l'ouvrir.

## Ligne de commande et interface graphique

La **ligne de commande** (CLI) passe par un terminal. Elle est précise et légère, et elle permet d'écrire des scripts. On administre souvent un serveur de cette façon, parce qu'il n'a pas d'écran. L'**interface graphique** (GUI) propose des fenêtres et une souris. Elle est plus facile à prendre en main, mais elle consomme plus de ressources. Il s'agit de deux façons d'accéder au même système d'exploitation, et la session graphique lance d'ailleurs des programmes qui communiquent eux aussi avec le noyau.

Une erreur fréquente consiste à confondre le navigateur et le système. Le navigateur n'est qu'une application, à laquelle l'OS attribue du temps processeur, de la mémoire et l'accès au disque. Sans le système d'exploitation, le navigateur ne pourrait pas fonctionner.

## Pour s'entraîner

Les [commandes Linux](/cours/2/os_linux_commandes) permettent de manipuler concrètement les fichiers et les permissions.
