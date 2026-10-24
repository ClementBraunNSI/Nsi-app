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
audience: public
---

# Systèmes d'exploitation

Vous avez vu le processeur, la mémoire et les bus. Aucun programme que vous écrivez ne leur parle directement. Entre votre code et le matériel, il y a un **système d'exploitation**. Sans lui, chaque application devrait savoir allumer un pixel, réserver une case mémoire et attraper une touche du clavier. L'OS fait ce travail une fois pour toutes, et prête ces services aux programmes.

Il relie donc le matériel et les logiciels, il partage les ressources (processeur, mémoire, disques) quand plusieurs programmes tournent ensemble, et il vous offre une interface, graphique ou en texte. Historiquement, il automatise ce qu'un opérateur faisait à la main : lancer un travail, ranger les fichiers, donner la machine à tour de rôle.

On oppose souvent deux familles, selon ce qu'on a le droit de faire du code.

| Type | Idée | Exemples |
| :--- | :--- | :--- |
| **Libre** | Le code est ouvert, on peut le lire, le modifier, le redistribuer | Linux (Ubuntu, Debian), FreeBSD |
| **Propriétaire** | Le code est fermé, une licence encadre l'usage | Windows, macOS, iOS |

« Libre » ne veut pas dire « sans auteur », ni toujours « gratuit ». Cela veut dire que les règles de la licence vous autorisent à étudier le système et à le modifier. « Propriétaire » veut dire que l'éditeur garde ce droit.

## Le noyau

Le **noyau**, ou *kernel*, est la partie qui a un accès privilégié au matériel. Le reste de l'OS et vos applications passent par lui.

C'est lui qui alloue la RAM et la rend quand un programme se termine. C'est lui qui choisit quel processus occupe le processeur, et pendant combien de temps : l'**ordonnancement**. C'est lui, via des pilotes (*drivers*), qui sait parler au clavier, à l'écran, au disque. Un pilote est un traducteur. Le noyau dit « lis ce secteur », le pilote sait quels signaux envoyer à ce modèle précis de disque.

## Où sont les fichiers

Les fichiers ne sont pas un tas. Ils forment un arbre, et tout chemin part d'une racine.

Sous Linux et les autres UNIX, il n'y a qu'une racine, `/`. `/home` contient les dossiers des utilisateurs, `/etc` la configuration, `/bin` des programmes exécutables. Une clé USB, un second disque, apparaissent quelque part sous cet arbre : on les « monte », ils n'ont pas de lettre.

Sous Windows, chaque lecteur a sa racine : `C:\`, parfois `D:\`. `C:\Users` correspond à peu près à `/home`, `C:\Windows` au système, `C:\Program Files` aux applications installées. Dans les deux mondes, un chemin se lit de la racine jusqu'au fichier. Seule l'écriture change.

## Qui a le droit

Un OS prévu pour plusieurs utilisateurs ne laisse pas tout le monde tout modifier. Sous UNIX, chaque fichier porte des droits pour trois publics : le propriétaire (*user*), le groupe (*group*), et les autres (*others*). Ce triplet s'abrège UGO.

| Droit | Lettre | Effet |
|---|:---:|---|
| Lecture | `r` | Lire le fichier, ou lister le dossier |
| Écriture | `w` | Modifier, supprimer |
| Exécution | `x` | Lancer un programme, ou traverser un dossier |

Le `x` sur un dossier surprend. Il ne lance rien : il autorise à entrer dans le dossier pour atteindre ce qu'il contient. Sans lui, connaître le nom d'un fichier ne suffit pas à l'ouvrir.

## Deux façons de commander

La **ligne de commande** (CLI) passe par un terminal. Elle est précise, scriptable, légère. On administre souvent un serveur ainsi, parce qu'il n'a pas d'écran. L'**interface graphique** (GUI) propose des fenêtres et une souris. Elle est plus abordable, et plus coûteuse en ressources. Ce ne sont pas deux systèmes. Ce sont deux portes d'entrée vers le même OS. Votre session graphique lance d'ailleurs des programmes qui, eux, parlent encore au noyau.

Une erreur fréquente est de prendre le navigateur pour le système. Le navigateur est une application. C'est l'OS qui lui prête du temps processeur, de la mémoire, et l'accès au disque. Fermez l'OS, et le navigateur n'a plus rien sur quoi tourner.

## Pour s'entraîner

Les [commandes Linux](/cours/2/os_linux_commandes) font manipuler fichiers et permissions, au lieu de seulement les nommer.
