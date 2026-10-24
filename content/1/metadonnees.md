---
title: Métadonnées et Formats
description: >-
  Comprendre les formats de fichiers image, la compression et les métadonnées
  EXIF
level: seconde
chapter: Photographie Numérique
icon: "\U0001F5BC️"
prerequisites:
  - activite_photo_interactive
audience: public
---

# Métadonnées et formats

Une image « brute », au format RAW, garde à peu près tout ce que le capteur a vu. Elle est fidèle, et elle est énorme. Pour la stocker ou l'envoyer, on choisit un format de fichier, et ce choix décide de ce qu'on accepte de perdre.

Il y a deux familles de compression. **Sans perte**, l'image qu'on rouvre est identique à celle qu'on a comprimée : on a seulement rangé les mêmes informations plus serré. **Avec perte**, on retire des détails que l'œil remarque peu, et le fichier maigrit beaucoup. La photo reste convaincante. Elle n'est plus exactement la même.

| Format | Extension | Compression | Transparence | Usage principal |
|--------|-----------|-------------|--------------|------------------|
| **JPEG** | .jpg, .jpeg | Avec perte | Non | Photos, web, réseaux sociaux |
| **PNG** | .png | Sans perte | Oui | Logos, schémas, illustrations |
| **GIF** | .gif | Sans perte, 256 couleurs au plus | Oui | Petites animations |
| **TIFF** | .tiff | Sans perte | Oui | Impression, archivage |
| **WEBP** | .webp | Avec ou sans perte | Oui | Web actuel |

Le JPEG convient aux photos parce que l'œil pardonne un ciel un peu simplifié. Il convient mal à un logo : les aplats et le texte se dégradent, et il ne sait pas faire de transparence. Le PNG garde chaque pixel et peut avoir un fond transparent, au prix d'un fichier plus lourd. Le GIF est ancien : 256 couleurs, ce qui suffit à un petit dessin animé, pas à un portrait. Le TIFF sert quand on archive ou qu'on imprime, et qu'on ne veut rien jeter. Le WebP, poussé par Google, reprend les deux logiques, avec ou sans perte, y compris la transparence.

## Ce que le fichier sait en plus des pixels

Un fichier image ne contient pas seulement la grille de couleurs. Il contient aussi des informations sur la photo elle-même. On les appelle des **métadonnées** : des données sur les données.

Pour la photographie, la norme courante est l'**EXIF** (*Exchangeable Image File Format*). L'appareil les écrit au moment de la prise de vue. On y trouve la date et l'heure, la marque et le modèle, et les réglages : temps de pose, ouverture, sensibilité ISO, focale, usage du flash. On y trouve souvent aussi l'auteur, et, si le téléphone ou l'appareil avait le GPS allumé, la latitude, la longitude et l'altitude.

![Exemple de données EXIF](/content/1/exif.png)

Quand vous partagez la photo, vous partagez potentiellement tout cela, y compris l'endroit précis où vous étiez. Beaucoup de réseaux sociaux effacent ces champs avant de republier l'image. Tous les services de transfert ne le font pas. Si la photo ne doit pas dire où vous habitez, il faut vérifier, ou retirer ces données avant l'envoi.

## Les lire

Sur un ordinateur, le système les affiche souvent dans les propriétés du fichier. Sous Windows : clic droit, Propriétés, puis Détails. Sous macOS : clic droit, Lire les informations, ou Cmd+I. Sous Linux : clic droit, Propriétés, puis Image.

En ligne de commande, `exiftool` lit ces champs directement. En Python, la bibliothèque `PIL` (Pillow) permet de les ouvrir dans un script, ce qui devient utile dès qu'on a plus que deux ou trois photos.

![Exemple de script PIL](/content/1/prog_pil.png)

# Exercice

Reliez chaque format à sa description :

![Exercice - Relier les formats](/content/1/exo_relier.png)

## Pour s'entraîner

Ces images peuvent être téléchargées pour en lire les métadonnées :

- [Photo Nikon COOLPIX P1](/content/1/Nikon_COOLPIX_P1.jpg)
- [Photo iPhone X](/content/1/IMG_0716.jpeg)
- [Photo Japon](/content/1/japan-katsura-river.jpg)
