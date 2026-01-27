---
title: "Simulateur Micro:bit"
description: "Guide d'utilisation du simulateur Python pour Micro:bit"
level: "seconde"
chapter: "Micro-controleurs"
icon: "🖥️"
---

# Simulateur BBC Micro:bit V2

Ce guide décrit l'utilisation de l'application de simulation Python fournie pour le cours.

## 1. Fonctionnalités

Le simulateur permet de tester vos programmes Python pour Micro:bit sans avoir la carte physique.

- **Matrice LED 5x5** : Visualisez vos affichages (`display.show`, `display.scroll`).
- **Boutons A et B** : Interagissez en cliquant dessus.
- **Capteurs** : Simulez la température, la luminosité et l'accéléromètre.

## 2. Utilisation

1.  **Lancer le simulateur** : Exécutez le script `microbit_simulator.py`.
2.  **Écrire le code** : Utilisez l'onglet "Code Python" pour écrire votre script.
3.  **Exécuter** : Cliquez sur le bouton "Play" pour lancer le programme.

## 3. Exemple de code compatible

```python
from microbit import *

compteur = 0

while True:
    if button_a.was_pressed():
        compteur += 1
        display.scroll(str(compteur))
    sleep(100)
```

## 4. Dépannage

- Si les LEDs ne s'allument pas, vérifiez que votre boucle `while True` tourne bien.
- Vérifiez la syntaxe Python (indentation).
- Utilisez le bouton "Stop" pour arrêter l'exécution avant de modifier le code.
