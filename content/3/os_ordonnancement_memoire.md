---
title: "Systèmes d'exploitation : ordonnancement et mémoire"
description: "Approfondir processus, CPU, mémoire virtuelle et appels système"
level: TNSI
order: 220
chapter: Architectures matérielles, OS & Réseaux
icon: "brain"
badgeId: terminale_os_avance
prerequisites:
  - archi_soc
audience: public
---

# Ordonnancement et mémoire

En Première, le système d'exploitation a été présenté comme la couche située entre les programmes et le matériel. En Terminale, on étudie la façon dont il partage deux ressources : le processeur, en décidant quel programme peut l'utiliser à chaque instant, et la mémoire, en donnant à chaque programme l'illusion de disposer d'un espace continu alors qu'il la partage avec les autres.

## Processus et threads

Un **processus** est un programme en cours d'exécution, avec son propre espace mémoire. Deux processus ne lisent pas les variables l'un de l'autre, sauf s'ils passent par un mécanisme prévu pour cela. Un **thread** est un fil d'exécution à l'intérieur d'un processus. Les threads d'un même processus se partagent sa mémoire, ce qui les rend légers, mais aussi dangereux s'ils modifient la même variable sans se coordonner.

Un navigateur actuel n'est pas un seul processus. Il en lance souvent un par onglet, ou par site, et chacun contient plusieurs threads : l'un affiche la page, un autre attend les données du réseau, un autre exécute le JavaScript. Si un onglet plante, les autres peuvent continuer à fonctionner, justement parce qu'ils sont dans des processus différents.

## L'ordonnancement des processus

Sur la plupart des machines, il y a moins de cœurs que de processus prêts à travailler. L'**ordonnanceur** choisit donc quel processus s'exécute, et à quel moment il doit rendre le processeur.

La file **FIFO** (*first in, first out*) sert les processus dans l'ordre d'arrivée. Cette méthode est simple, mais un calcul très long peut bloquer tous les processus suivants, y compris un programme qui n'aurait besoin que d'un instant pour réagir à un clic.

Le **round-robin** donne à chacun un quantum, une petite durée, puis passe au suivant, quitte à revenir plus tard sur le premier. Aucun processus ne peut monopoliser la machine, mais chaque changement de processus fait perdre un peu de temps.

Les **priorités** décident que certains travaux passent avant les autres, une tâche temps réel avant une sauvegarde par exemple. Mal réglées, elles peuvent provoquer une **famine** : les processus de faible priorité attendent alors indéfiniment sans jamais être choisis.

Une politique d'ordonnancement se juge selon trois critères, difficiles à satisfaire en même temps : la réactivité (un clic doit obtenir une réponse rapide), l'équité (chaque processus doit avancer) et le débit global (la machine doit faire beaucoup de travail utile, et ne pas passer son temps à changer de tâche).

## La mémoire virtuelle

La **mémoire virtuelle** présente à chaque processus un grand espace d'adresses continu, comme s'il était seul sur la machine. En réalité, cet espace est découpé en **pages**, dispersées dans la RAM, et certaines ne sont même pas en RAM.

La **table des pages** fait la traduction entre l'adresse que le programme croit utiliser et l'adresse physique. Quand la page demandée n'est pas en mémoire, le processeur lève un **défaut de page**. Le système va chercher la page sur le disque, dans la zone de **swap**, et la ramène en RAM, quitte à en chasser une autre.

Quelques défauts de page sont normaux. Mais s'ils deviennent permanents, la machine passe son temps à déplacer des pages au lieu d'exécuter le programme. Comme le disque est bien plus lent que la RAM, le système semble alors figé, alors que le processeur fonctionne normalement.

## Les appels système

Un programme ordinaire n'a pas le droit d'ouvrir un fichier, de créer un processus ou d'envoyer un paquet réseau en accédant directement au matériel. Il doit faire un **appel système**, c'est-à-dire une demande au noyau, qui vérifie les droits puis exécute l'action. C'est cette frontière qui empêche une application de lire la mémoire des autres, ou d'écrire n'importe où sur le disque.

## Exercices

1. Expliquer la différence entre un processus et un thread.
2. Simuler 3 tours d'un ordonnanceur Round-Robin.
3. Donner un exemple concret de défaut de page.
