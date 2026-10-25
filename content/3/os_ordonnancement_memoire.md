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

En Première, le système d'exploitation était la couche entre vos programmes et le matériel. En Terminale, on regarde deux partages concrets : qui a le droit d'utiliser le processeur maintenant, et comment plusieurs programmes croient chacun disposer d'une mémoire continue alors qu'ils se la disputent.

## Processus et threads

Un **processus** est un programme en cours d'exécution, avec son propre espace mémoire. Deux processus ne lisent pas les variables l'un de l'autre, sauf s'ils passent par un mécanisme prévu pour cela. Un **thread** est un fil d'exécution à l'intérieur d'un processus. Les threads d'un même processus se partagent sa mémoire, ce qui les rend légers, et dangereux s'ils écrivent la même variable sans se coordonner.

Un navigateur actuel n'est pas un seul processus. Il en ouvre souvent un par onglet, ou par site, et à l'intérieur chacun a plusieurs threads : un qui dessine la page, un qui attend le réseau, un qui exécute le JavaScript. Si un onglet plante, les autres peuvent survivre, justement parce que ce ne sont pas les mêmes processus.

## À qui donner le processeur

Il n'y a, sur beaucoup de machines, moins de cœurs que de processus prêts à travailler. L'ordonnanceur choisit qui s'exécute, et quand on lui reprend le processeur.

La file **FIFO** (*first in, first out*) sert les processus dans l'ordre d'arrivée. C'est simple, et un calcul très long peut bloquer tout ce qui est derrière, y compris un programme qui n'aurait besoin que d'un instant pour réagir à un clic.

Le **round-robin** donne à chacun un quantum, une petite durée, puis passe au suivant, quitte à revenir plus tard sur le premier. Personne ne monopolise la machine. Le prix est le temps perdu à changer de processus.

Les **priorités** décident que certains travaux passent avant les autres, une tâche temps réel avant une sauvegarde par exemple. Mal réglées, elles affament les processus de faible priorité, qui attendent sans jamais être élus.

On juge une politique à trois choses qui se tirent dessus : la réactivité (un clic doit répondre vite), l'équité (chacun doit avancer), et le débit global (la machine doit faire beaucoup de travail utile, pas seulement changer de tâche).

## Une mémoire qui n'est pas celle qu'on croit

La **mémoire virtuelle** présente à chaque processus un grand espace d'adresses, continu, comme s'il était seul. En réalité, cet espace est découpé en **pages**, dispersées dans la RAM, parfois absentes de la RAM.

La **table des pages** fait la traduction entre l'adresse que le programme croit utiliser et l'adresse physique. Quand la page demandée n'est pas en mémoire, le processeur lève un **défaut de page**. Le système va chercher la page sur le disque, dans la zone de **swap**, et la ramène en RAM, quitte à en chasser une autre.

Quelques défauts de page sont normaux. S'ils deviennent constants, la machine passe son temps à déplacer des pages au lieu d'exécuter le programme. Le disque est bien plus lent que la RAM : le système semble figé, alors que le processeur n'est pas en panne.

## Passer par le noyau

Un programme ordinaire n'a pas le droit d'ouvrir un fichier, de créer un processus ou d'envoyer un paquet réseau en touchant le matériel. Il fait un **appel système** : une demande au noyau, qui vérifie les droits, puis agit. C'est cette frontière qui empêche une application de lire la mémoire des autres, ou d'écrire n'importe où sur le disque.

## Exercices

1. Expliquer la différence processus / thread.
2. Simuler 3 tours d'un ordonnanceur Round-Robin.
3. Donner un exemple concret de défaut de page.
