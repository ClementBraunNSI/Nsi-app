---
title: 'Activité : Composer un système connecté'
description: 'Assembler capteurs, logique et actionneurs pour simuler une alarme IoT.'
level: seconde
chapter: Micro-controleurs
icon: "\U0001F3AE"
prerequisites:
  - simulateur_microbit
---

# Activité : Composer un système connecté

Un **objet connecté** relie des **capteurs** (qui mesurent), une **logique** (qui décide) et des **actionneurs** (qui agissent).

## Mission : l'alarme anti-intrusion

Construisez un système d'alarme :

1. Déposez un **capteur de luminosité** dans la zone « Entrée ».
2. Ajoutez une **porte ET** pour combiner deux conditions.
3. Placez une **sirène** en sortie.
4. Baissez la luminosité avec le curseur et activez l'interrupteur pour déclencher l'alarme.

<IotSimulator />

## Questions

1. Que se passe-t-il si vous retirez la porte ET ?
2. Pourquoi a-t-on besoin d'un capteur **et** d'un interrupteur dans cet exemple ?
3. Donnez un exemple d'objet connecté du quotidien qui fonctionne sur le même principe.

## Programmer une vraie Micro:bit

Pour écrire du code Python sur la carte (ou son simulateur en ligne), utilisez l'éditeur officiel :

[Éditeur Python Micro:bit](https://python.microbit.org/v/3)

Puis poursuivez avec le [TP Micro:bit](tp_microbit.md).

## Extension (optionnel)

[Activité Algorea — Microcontrôleurs](https://parcours.algorea.org/fr/a/940211979874721401;p=4702,1067253748629066205,1249223707321882853;pa=0)
