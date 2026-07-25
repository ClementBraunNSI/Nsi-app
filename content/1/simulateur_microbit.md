---
title: 'Simulateur Micro:bit'
description: 'Programmer la carte Micro:bit avec le simulateur en ligne officiel.'
level: seconde
chapter: Micro-controleurs
icon: "\U0001F5A5️"
prerequisites:
  - objets_connectes
---

# Simulateur BBC Micro:bit

Vous pouvez tester vos programmes **sans carte physique** grâce au simulateur intégré à l'éditeur officiel Micro:bit.

![Carte Micro:bit](/content/1/microbit.png)

## 1. Ouvrir le simulateur

1. Rendez-vous sur **[python.microbit.org](https://python.microbit.org/v/3)**.
2. Un aperçu de la carte s'affiche à gauche : matrice LED 5×5, boutons **A** et **B**.
3. Le code Python s'écrit dans la zone de droite.

![Environnement de travail](/content/1/editor.png)

## 2. Premier test

Copiez ce programme, puis cliquez sur **Run** (ou le bouton lecture) :

```python
from microbit import *

while True:
    display.show(Image.HEART)
    sleep(1000)
    display.clear()
    sleep(1000)
```

Vous devez voir un **cœur** clignoter sur la matrice LED.

## 3. Fonctionnalités du simulateur

| Élément | Usage en Python |
|---------|-----------------|
| Matrice LED 5×5 | `display.show()`, `display.scroll()`, `display.clear()` |
| Bouton A / B | `button_a.is_pressed()`, `button_b.was_pressed()` |
| Température | `temperature()` |
| Luminosité | `display.read_light_level()` |
| Accéléromètre | `accelerometer.get_x()`, `get_y()`, `get_z()` |
| Pause | `sleep(millisecondes)` |

## 4. Exemple avec interaction

```python
from microbit import *

compteur = 0

while True:
    if button_a.was_pressed():
        compteur += 1
        display.scroll(str(compteur))
    sleep(100)
```

Appuyez sur le **bouton A** dans le simulateur pour incrémenter le compteur.

## 5. Dépannage

- **Le programme ne s'arrête pas** : cliquez sur Stop dans l'éditeur.
- **Rien ne s'affiche** : vérifiez l'indentation et la boucle `while True`.
- **Erreur d'import** : la ligne `from microbit import *` doit être présente en haut du fichier.

---

Passez ensuite à l'[activité système connecté](activite_objets_connectes.md) puis au [TP Micro:bit](tp_microbit.md).
