---
title: Modèle de Von Neumann
description: >-
  Comprendre les fondements de l'architecture informatique moderne et le modèle
  séquentiel
level: premiere
chapter: Architecture matérielle
icon: "settings"
badgeId: premiere_von_neumann
prerequisites: []
audience: public
---

# Modèle de Von Neumann

Il y a plusieurs manières de définir un ordinateur. À l'origine, c'est une machine qui sert à réaliser des calculs. Le mot « ordinateur » a été choisi en 1955 par François Girard, responsable chez IBM France, sur le conseil de son ancien professeur de lettres Jacques Perret. Il vient du mot « ordonnateur », qui désigne celui qui met de l'ordre.

Parmi toutes les définitions possibles, la plus concrète reste celle du modèle de **von Neumann**.

Ce modèle décrit les blocs qui composent un ordinateur et, surtout, l'ordre dans lequel ils travaillent. Un ordinateur moderne exécute un programme **stocké en mémoire**, au même endroit que les données, et il en traite les instructions **une par une, dans l'ordre**. L'unité de contrôle coordonne l'ensemble, un peu comme un chef d'orchestre.

John von Neumann décrit cette architecture en 1945, dans un rapport consacré à l'EDVAC. Elle repose sur deux idées. D'abord, les calculs se font en binaire. Ensuite, le programme n'est plus câblé dans la machine : il est écrit dans la mémoire, comme les données. Pour changer de programme, il suffit donc de modifier la mémoire, sans rien ressouder.

<VonNeumann />

![L'EDVAC installé au laboratoire de recherche balistique de l'armée américaine](/content/2/edvac.jpg)

*L'EDVAC dans les années 1950. La machine occupe à elle seule une pièce entière. Photo de l'armée américaine, domaine public (Wikimedia Commons).*

## Dans le processeur

Le processeur réunit deux unités. La première, l'**unité arithmétique et logique** (UAL), effectue les opérations, comme les additions, les comparaisons, les décalages ou les opérations logiques. Elle s'appuie sur des **registres**, de toutes petites mémoires internes beaucoup plus rapides que la RAM, dans lesquelles elle range les valeurs en cours de calcul.

La seconde, l'**unité de contrôle** (UC), ne calcule rien elle-même. Elle décide de ce qui doit être fait à chaque instant, en répétant un cycle en quatre étapes. Elle **lit** d'abord l'instruction en mémoire (*fetch*), puis elle la **décode** pour connaître son code d'opération (*opcode*) et ses opérandes (*decode*). Elle **fait** ensuite **calculer** l'UAL (*execute*) et **range** enfin le résultat dans un registre ou en mémoire (*store*). Ce cycle est cadencé par une horloge. La fréquence d'un processeur, exprimée en gigahertz, indique le nombre de battements d'horloge qu'il enchaîne chaque seconde.

## Les différentes mémoires

| Type | Rôle |
|---|---|
| **Cache** | Mémoire très rapide placée tout près du processeur, qui accélère les accès répétés |
| **RAM** | Mémoire volatile qui contient les programmes et les données en cours d'utilisation, perdus quand la machine est éteinte |
| **ROM** | Mémoire non volatile qui contient ce qu'il faut pour démarrer la machine (firmware, BIOS) |
| **Stockage** | Disque dur, SSD ou clé USB, qui conservent les données sur le long terme |

Dans le modèle de von Neumann, les instructions et les données sont rangées ensemble dans la RAM. C'est le principe du **programme enregistré**. Une instruction peut donc, en théorie, être traitée comme une donnée, ce qui permet par exemple à un programme d'en écrire un autre.

Pour échanger des valeurs avec la mémoire, le processeur passe par des **bus**. Le bus de données transporte les valeurs elles-mêmes, le bus d'adresses indique l'endroit où lire ou écrire, et le bus de contrôle transmet les signaux de commande, comme l'ordre de lecture ou d'écriture. Les périphériques sont reliés à cet ensemble. Certains servent à entrer des informations (clavier, souris), d'autres à en sortir (écran, imprimante), et quelques-uns font les deux (écran tactile, disque).

## Le goulot d'étranglement

Le processeur, la mémoire et les bus ne fonctionnent pas à la même vitesse, et l'élément le plus lent ralentit tous les autres. Ce phénomène s'appelle le **goulot d'étranglement** (*bottleneck* en anglais). Il ressemble à un tuyau trop fin au milieu d'une canalisation, qui impose son débit à toute l'installation. Un processeur très rapide relié à une mémoire lente passe ainsi une grande partie de son temps à attendre la prochaine instruction, et augmenter sa fréquence n'y change rien.

En résumé, le modèle de von Neumann comporte quatre blocs : le processeur (avec l'UC et l'UAL), la mémoire, les bus et les entrées-sorties. L'UC répète le cycle *fetch*, *decode*, *execute*, *store*. La RAM s'efface quand le courant est coupé, alors que la ROM et le stockage conservent leur contenu.

## Pour s'entraîner

Poursuivre avec [Circuits électroniques](/cours/2/archi_circuits) puis les [exercices sur les circuits](/cours/2/archi_circuits_exercices).
