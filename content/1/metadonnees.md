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
---

# 1. Les formats de fichiers

Une image brute (RAW) prend beaucoup de place. Pour stocker et transmettre les images efficacement, on utilise différents formats de fichiers, qui peuvent compresser les données.

Il existe deux types de compression :
1.  **Compression sans perte** (*lossless*) : L'image restituée est identique à l'originale.
2.  **Compression avec perte** (*lossy*) : On supprime des informations peu visibles pour l'œil humain afin de réduire drastiquement la taille du fichier.

| Format | Extension | Compression | Transparence | Usage principal |
|--------|-----------|-------------|--------------|------------------|
| **JPEG** | .jpg, .jpeg | Avec perte | Non | Photos, web, réseaux sociaux |
| **PNG** | .png | Sans perte | Oui | Logos, illustrations, graphiques |
| **GIF** | .gif | Sans perte (256 couleurs max) | Oui | Animations simples |
| **TIFF** | .tiff | Sans perte | Oui | Impression professionnelle, archivage |
| **WEBP** | .webp | Avec ou sans perte | Oui | Web moderne (Google) |

# 2. Les Métadonnées (EXIF)

Un fichier image ne contient pas que les pixels. Il contient aussi des informations sur l'image elle-même, appelées **métadonnées**.

Pour les photographies, la norme standard est l'**EXIF** (Exchangeable Image File Format).

Ces données sont inscrites par l'appareil photo au moment de la prise de vue et peuvent contenir :

- **Date et heure** de la prise de vue
- **Modèle de l'appareil** et marque
- **Réglages techniques** :
    - Temps d'exposition (vitesse d'obturation)
    - Ouverture du diaphragme (f/...)
    - Sensibilité ISO
    - Longueur focale
    - Utilisation du flash
- **Géolocalisation** (coordonnées GPS : latitude, longitude, altitude)
- **Auteur** / Copyright

![Exemple de données EXIF](/content/1/exif.png)

> **Attention à la vie privée** : Lorsque vous partagez une photo sur internet, vous partagez potentiellement ces informations (notamment votre localisation précise). La plupart des réseaux sociaux les effacent automatiquement, mais pas tous les services de partage.

## 2.1 Lire les métadonnées

Sur ordinateur, on peut souvent lire ces informations via les propriétés du fichier :
- **Windows** : Clic droit > Propriétés > Détails
- **macOS** : Clic droit > Lire les informations (ou Cmd+I)
- **Linux** : Clic droit > Propriétés > Image

On peut aussi utiliser des outils en ligne de commande comme `exiftool` ou des scripts Python (bibliothèque `PIL` / `Pillow`).

![Exemple de script PIL](/content/1/prog_pil.png)

# 3. Exercice

Reliez chaque format à sa description :

![Exercice - Relier les formats](/content/1/exo_relier.png)

## 4. Pour s'entraîner

Voici quelques images originales que vous pouvez télécharger pour analyser leurs métadonnées :

- [Photo Nikon COOLPIX P1](/content/1/Nikon_COOLPIX_P1.jpg)
- [Photo iPhone X](/content/1/IMG_0716.jpeg)
- [Photo Japon](/content/1/japan-katsura-river.jpg)
