---
title: 'Web : Site Personnel'
description: Créer une page web sur un tableau revisité avec des renards.
level: premiere
chapter: Projets
icon: "🚀"
badgeId: premiere_projet
prerequisites:
  - projet_empreinte_carbone
---

## Objectif

Créer une page web qui presente un tableau de maitre revisite avec des renards.

La page doit inclure:

- une presentation du tableau original
- une presentation de la version revisitee
- une histoire courte autour de la scene
- une structure de fichiers claire

## Structure recommandee

```text
projet-tableau-renard/
├── index.html
├── images/
│   ├── tableau-original.jpg
│   └── tableau-renard.jpg
├── styles/
│   └── style.css
└── scripts/
    └── script.js
```

## Option JavaScript 1: Changer d'image

```html
<button id="bouton-image">Voir la version renard</button>
<img id="image-tableau" src="images/tableau-original.jpg" alt="Tableau" />
```

```javascript
const bouton = document.getElementById("bouton-image");
const image = document.getElementById("image-tableau");
let imageOriginale = true;

bouton.addEventListener("click", function () {
  if (imageOriginale) {
    image.src = "images/tableau-renard.jpg";
    bouton.textContent = "Voir l'original";
    imageOriginale = false;
  } else {
    image.src = "images/tableau-original.jpg";
    bouton.textContent = "Voir la version renard";
    imageOriginale = true;
  }
});
```

## Option JavaScript 2: Mode jour/nuit

```html
<button id="bouton-mode">Mode nuit</button>
```

```javascript
const boutonMode = document.getElementById("bouton-mode");
const body = document.body;

boutonMode.addEventListener("click", function () {
  body.classList.toggle("mode-nuit");
});
```

## Option JavaScript 3: Affichage d'un texte au clic

```html
<img id="image-cliquable" src="images/tableau-renard.jpg" alt="Tableau" />
<p id="texte-cache" style="display: none;">Les renards ont envahi ce tableau.</p>
```

```javascript
const imageCliquable = document.getElementById("image-cliquable");
const texteCache = document.getElementById("texte-cache");

imageCliquable.addEventListener("click", function () {
  texteCache.style.display = texteCache.style.display === "none" ? "block" : "none";
});
```

## Livrable

Rendre un dossier zip contenant:

- `index.html`
- `styles/style.css`
- `scripts/script.js`
- vos images
