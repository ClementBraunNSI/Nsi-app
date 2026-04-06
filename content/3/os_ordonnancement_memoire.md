---
title: "Systèmes d'exploitation : ordonnancement et mémoire"
description: "Approfondir processus, CPU, mémoire virtuelle et appels système"
level: TNSI
order: 220
chapter: Architectures matérielles, OS & Réseaux
icon: "🧠"
badgeId: terminale_os_avance
prerequisites:
  - archi_soc
---

# Systèmes d'exploitation : ordonnancement et mémoire

## Introduction

En Première, on voit le rôle général d'un OS.
En Terminale, on étudie plus précisément comment il répartit les ressources.

## 1. Processus et threads

- **Processus** : programme en cours d'exécution, avec son espace mémoire.
- **Thread** : unité d'exécution dans un processus.

Un navigateur moderne combine plusieurs processus et plusieurs threads.

## 2. Ordonnancement CPU

L'OS choisit quel processus utilise le processeur et pendant combien de temps.

### Politiques classiques

- FIFO ;
- Round-Robin ;
- priorités.

Objectifs : réactivité, équité, bon débit global.

## 3. Mémoire virtuelle

La mémoire virtuelle donne l'illusion d'un espace mémoire continu, même si les données sont réparties en pages.

Notions importantes :

- pagination ;
- table des pages ;
- défaut de page ;
- swap disque.

!!! warning "Conséquence pratique"
    Trop de défauts de page ralentissent fortement le système.

## 4. Appels système

Un programme utilisateur passe par le noyau pour certaines opérations :

- accès fichiers ;
- création de processus ;
- communication réseau.

## Exercices

1. Expliquer la différence processus / thread.
2. Simuler 3 tours d'un ordonnanceur Round-Robin.
3. Donner un exemple concret de défaut de page.
