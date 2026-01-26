---
title: "TP - Micro:bit"
description: "S'initier à la programmation embarquée avec la carte Micro:bit"
level: "seconde"
chapter: 8
icon: "microchip"
---

# Travail Pratique : Cartes Micro:bit

## 1. Présentation

La carte **Micro:bit** est un petit ordinateur de poche programmable. Elle permet de découvrir l'informatique embarquée de manière ludique.

**Éléments principaux :**
- Matrice de 25 LEDs (5x5) pour l'affichage.
- 2 boutons programmables (A et B).
- Capteurs intégrés : accéléromètre, boussole, capteur de température, capteur de lumière.
- Connectivité Bluetooth et Radio.

![carte](microbit.png)

## 2. Premiers pas en Python

Pour programmer la carte, on utilise le langage Python sur l'éditeur en ligne : [python.microbit.org](https://python.microbit.org).

Voici la structure de base d'un programme :

```python
from microbit import *

while True:
    display.show(Image.HEART)
    sleep(1000)
    display.clear()
    sleep(1000)
```

**Commandes utiles :**
- `display.show(Image.HAPPY)` : Affiche une image prédéfinie.
- `display.scroll("Bonjour")` : Fait défiler du texte.
- `sleep(1000)` : Pause de 1000 millisecondes (1 seconde).
- `button_a.is_pressed()` : Renvoie `True` si le bouton A est appuyé.

## 3. Exercices

### 🌟 Exercice 1 : Affichage simple (⭐)
Affichez le motif d'un visage souriant (`Image.HAPPY`) sur l'écran LED.

### 🎨 Exercice 2 : Message défilant (⭐)
Faites défiler votre prénom sur l'écran LED.
*Indice : Utilisez `display.scroll()`.*

### 🎮 Exercice 3 : Interaction Bouton (⭐⭐)
Affichez un cœur quand on appuie sur le bouton A.

```python
from microbit import *

while True:
    if button_a.is_pressed():
        display.show(Image.HEART)
    else:
        display.clear()
```

### 🎨 Exercice 4 : Animation (⭐⭐)
Alternez entre deux images toutes les secondes (par exemple un cœur et un carré) indéfiniment.

### 🦊 Exercice 5 : Pixel Art (⭐⭐⭐)
Créez votre propre image (par exemple une tête de renard) en définissant l'intensité de chaque LED (de 0 à 9).

```python
# Exemple de création d'image
mon_image = Image("09090:" 
                 "99999:" 
                 "90909:" 
                 "09990:" 
                 "00900")
display.show(mon_image)
```

### 🌟 Exercice 6 : Compteur (⭐⭐)
Créez un programme qui affiche "A" quand on appuie sur A, et "B" quand on appuie sur B.
*Bonus : Incrémentez un compteur à chaque appui et affichez sa valeur.*
