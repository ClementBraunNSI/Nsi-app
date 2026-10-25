---
title: 'TP - Micro:bit'
description: 'S''initier à la programmation embarquée avec la carte Micro:bit'
level: seconde
chapter: Micro-controleurs
icon: "bot"
prerequisites:
  - activite_objets_connectes
audience: public
---

# Travail Pratique : Cartes Micro:bit

## 1. Présentation

La carte **Micro:bit** est un petit ordinateur de poche programmable. Elle permet de découvrir l'informatique embarquée de manière ludique.

**Éléments principaux :**
- Matrice de 25 LEDs (5x5) pour l'affichage.
- 2 boutons programmables (A et B).
- Capteurs intégrés : accéléromètre, boussole, capteur de température, capteur de lumière.
- Connectivité Bluetooth et Radio.

![carte](/content/1/microbit.png)

## 2. Premiers pas en Python

Pour programmer la carte, on utilise le langage Python sur l'éditeur en ligne : [python.microbit.org](https://python.microbit.org).

![Environnement de travail](/content/1/editor.png)

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

### <Icone nom="star" /> Exercice 1 : Affichage simple <Renards n="1" />
Afficher le motif d'un visage souriant (`Image.HAPPY`) sur l'écran LED.

### <Icone nom="palette" /> Exercice 2 : Message défilant <Renards n="1" />
Faire défiler son prénom sur l'écran LED.
*Indice : Utiliser `display.scroll()`.*

### <Icone nom="gamepad-2" /> Exercice 3 : Interaction Bouton <Renards n="2" />
Afficher un cœur quand on appuie sur le bouton A.

```python
from microbit import *

while True:
    if button_a.is_pressed():
        display.show(Image.HEART)
    else:
        display.clear()
```

### <Icone nom="palette" /> Exercice 4 : Animation <Renards n="2" />
Alterner entre deux images toutes les secondes (par exemple un cœur et un carré) indéfiniment.

### <Renard /> Exercice 5 : Pixel Art <Renards n="3" />
Créer sa propre image (par exemple une tête de renard) en définissant l'intensité de chaque LED (de 0 à 9).

![Renard](/content/1/fox_microbit.png)

```python
# Exemple de création d'image
mon_image = Image("09090:" 
                 "99999:" 
                 "90909:" 
                 "09990:" 
                 "00900")
display.show(mon_image)
```

### <Icone nom="star" /> Exercice 6 : Compteur <Renards n="2" />
Créer un programme qui affiche "A" quand on appuie sur A, et "B" quand on appuie sur B.
*Bonus : Incrémenter un compteur à chaque appui et afficher sa valeur.*
