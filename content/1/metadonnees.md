---
title: Métadonnées et Formats
description: >-
  Comprendre les formats de fichiers image, la compression et les métadonnées
  EXIF
level: seconde
chapter: Photographie Numérique
icon: "image"
prerequisites:
  - activite_photo_interactive
audience: public
---

# Métadonnées et formats

Une image « brute », au format RAW, garde à peu près tout ce que le capteur a vu. Elle est très fidèle, mais son fichier est énorme. Pour la stocker ou l'envoyer, on choisit un format de fichier, et ce choix détermine ce qu'on accepte de perdre.

Il existe deux familles de compression. Avec une compression **sans perte**, l'image rouverte est identique à l'image d'origine, car les mêmes informations ont seulement été rangées de façon plus compacte. Avec une compression **avec perte**, on retire des détails que l'œil remarque peu, et le fichier devient beaucoup plus léger. La photo reste convaincante, mais elle n'est plus exactement la même.

| Format | Extension | Compression | Transparence | Usage principal |
|--------|-----------|-------------|--------------|------------------|
| **JPEG** | .jpg, .jpeg | Avec perte | Non | Photos, web, réseaux sociaux |
| **PNG** | .png | Sans perte | Oui | Logos, schémas, illustrations |
| **GIF** | .gif | Sans perte, 256 couleurs au plus | Oui | Petites animations |
| **TIFF** | .tiff | Sans perte | Oui | Impression, archivage |
| **WEBP** | .webp | Avec ou sans perte | Oui | Web actuel |

Le JPEG convient aux photos, parce que l'œil remarque peu qu'un ciel a été légèrement simplifié. Il convient mal à un logo, car les aplats de couleur et le texte se dégradent, et il ne gère pas la transparence. Le PNG garde chaque pixel et accepte un fond transparent, mais ses fichiers sont plus lourds. Le GIF est un format ancien, limité à 256 couleurs : c'est suffisant pour un petit dessin animé, mais pas pour un portrait. Le TIFF sert à l'archivage et à l'impression, quand on ne veut rien perdre. Enfin, le WebP, développé par Google, permet une compression avec ou sans perte et gère la transparence.

## Les métadonnées

Un fichier image ne contient pas seulement la grille de couleurs. Il contient aussi des informations sur la photo elle-même. Ces informations s'appellent des **métadonnées**, c'est-à-dire des données sur les données.

Pour la photographie, la norme courante est l'**EXIF** (*Exchangeable Image File Format*). L'appareil écrit ces informations au moment de la prise de vue. On y trouve la date et l'heure, la marque et le modèle de l'appareil, ainsi que les réglages utilisés, comme le temps de pose, l'ouverture, la sensibilité ISO, la focale ou l'usage du flash. On y trouve souvent aussi l'auteur, et, si le téléphone ou l'appareil avait le GPS allumé, la latitude, la longitude et l'altitude.

![Exemple de données EXIF](/content/1/exif.png)

Partager une photo peut donc revenir à partager toutes ces informations, y compris l'endroit précis de la prise de vue. Beaucoup de réseaux sociaux effacent ces champs avant de publier l'image, mais tous les services de transfert ne le font pas. Si la photo ne doit pas révéler un domicile, il faut vérifier ces données, ou les retirer avant l'envoi.

## Lire les métadonnées

Sur un ordinateur, le système les affiche souvent dans les propriétés du fichier. Sous Windows : clic droit, Propriétés, puis Détails. Sous macOS : clic droit, Lire les informations, ou Cmd+I. Sous Linux : clic droit, Propriétés, puis Image.

En ligne de commande, `exiftool` lit ces champs directement. En Python, la bibliothèque `PIL` (Pillow) permet de les ouvrir dans un script, ce qui devient utile dès qu'on a plus que deux ou trois photos.

![Exemple de script PIL](/content/1/prog_pil.png)

# Exercice

Relier chaque format à sa description :

![Exercice - Relier les formats](/content/1/exo_relier.png)

## Pour s'entraîner

Ces images peuvent être téléchargées pour en lire les métadonnées :

- [Photo Nikon COOLPIX P1](/content/1/Nikon_COOLPIX_P1.jpg)
- [Photo iPhone X](/content/1/IMG_0716.jpeg)
- [Photo Japon](/content/1/japan-katsura-river.jpg)
