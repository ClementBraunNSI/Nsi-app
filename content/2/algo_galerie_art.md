---
title: Galerie d'images en HTML
description: >-
  Mini-activité pour intégrer des images dans une page HTML (balise img, alt,
  chemins) — ressource liée au chapitre Web.
level: premiere
chapter: Web et Interaction
icon: "\U0001F3A8"
badgeId: premiere_galerie_d_art
prerequisites:
  - web_html
---

## Objectifs

- Utiliser la balise `<img>` correctement (`src`, `alt`)
- Distinguer chemin relatif et chemin absolu
- Structurer une petite galerie d'images en HTML

## Idée clé

Une image web n'est pas « collée » dans le fichier HTML : on **pointe** vers un fichier (chemin) et on fournit un texte alternatif pour l'accessibilité.

## La balise `img`

```html
<img src="chemin/vers/image.png" alt="Description courte de l'image">
```

| Attribut | Rôle |
| :--- | :--- |
| `src` | Chemin ou URL du fichier image |
| `alt` | Texte lu si l'image ne charge pas, et par les lecteurs d'écran |

Exemple minimal :

```html
<figure>
  <img src="oeuvres/cri_renard.png" alt="Parodie du Cri avec un renard">
  <figcaption>Le Cri — version renard</figcaption>
</figure>
```

## Chemins : relative vs absolue

- **Relatif** : `oeuvres/cri_renard.png` (par rapport au fichier HTML)
- **Absolu** (sur ce site) : `/content/2/10_Web_et_HTTP/cri_renard.png`

Préférez les chemins relatifs dans un projet élève (`index.html` + dossier `images/`).

## Galerie minimale

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Galerie d'art — renards</title>
</head>
<body>
  <h1>Galerie d'art</h1>
  <section>
    <h2>Œuvres</h2>
    <figure>
      <img src="/content/2/10_Web_et_HTTP/cri_renard.png"
           alt="Renard inspiré du Cri de Munch" width="320">
      <figcaption>Le Cri</figcaption>
    </figure>
    <figure>
      <img src="/content/2/10_Web_et_HTTP/kanagawa_fox.png"
           alt="Renard sur la vague de Kanagawa" width="320">
      <figcaption>La Vague</figcaption>
    </figure>
    <figure>
      <img src="/content/2/10_Web_et_HTTP/starry_night_fox.png"
           alt="Renard sous un ciel étoilé façon Van Gogh" width="320">
      <figcaption>Nuit étoilée</figcaption>
    </figure>
    <figure>
      <img src="/content/2/10_Web_et_HTTP/voyageur_renard.png"
           alt="Renard voyageur face à un paysage" width="320">
      <figcaption>Le Voyageur</figcaption>
    </figure>
  </section>
</body>
</html>
```

## Aperçu des images de démonstration

![Le Cri — renard](/content/2/10_Web_et_HTTP/cri_renard.png)

![La Vague — renard](/content/2/10_Web_et_HTTP/kanagawa_fox.png)

![Nuit étoilée — renard](/content/2/10_Web_et_HTTP/starry_night_fox.png)

![Le Voyageur — renard](/content/2/10_Web_et_HTTP/voyageur_renard.png)

## Piège fréquent

Oublier `alt`, ou se tromper de chemin (`src`) : l'image apparaît alors « cassée » (icône vide). Vérifier que le fichier existe bien au chemin indiqué, en respectant majuscules et accents.

## À retenir

- `<img>` a besoin de `src` (où est le fichier) et `alt` (ce que ça représente)
- Une galerie = plusieurs `<figure>` / `<img>` dans une `<section>`
- Les chemins relatifs facilitent le partage d'un projet hors ligne
- `width` / CSS permettent de contrôler la taille d'affichage
- Accessibilité : un `alt` vide `alt=""` seulement pour les images purement décoratives
- Suite logique : [CSS](/cours/2/web_css_introduction) pour disposer la galerie en grille

## Pour s'entraîner

1. Créer un dossier `galerie/` avec `index.html` et un sous-dossier `images/`.
2. Y placer au moins 3 images et afficher chacune avec un `alt` et une `figcaption`.
3. Ajouter un lien retour vers une page d'accueil (`<a href="...">`).
