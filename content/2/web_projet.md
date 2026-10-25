---
title: 'Web : Site Personnel'
description: Créer une page web sur un tableau revisité avec des renards.
level: premiere
chapter: Projets
icon: "rocket"
badgeId: premiere_projet
prerequisites:
  - projet_empreinte_carbone
audience: public
---

# <Icone nom="rocket" /> Projet - Un tableau revisité par les renards

Le but de ce projet est de créer une page web qui présente un tableau connu, puis une version de ce tableau où des renards ont pris la place des personnages.
Dans ce projet, la page raconte une courte histoire à partir de cette scène, et le visiteur bascule entre les deux images.

Le sujet est bien un tableau, sa version renard, et une histoire.

## 1. Le tableau et les fichiers <Icone nom="image" />

Vous partez d'un vrai tableau, que vous pouvez décrire et dont vous pouvez montrer une reproduction que vous avez le droit d'utiliser en classe (fichier fourni, ou image que vous dessinez). La page indique l'auteur, la date et le lieu de conservation.

L'exemple fixe la quantité de texte. Vous pouvez le suivre avec *La Nuit étoilée*, ou le remplacer par un autre tableau. Dans ce cas, gardez les mêmes blocs, avec vos propres phrases.

*   **Original.** Vincent van Gogh, 1889, huile sur toile, Museum of Modern Art, New York. Quatre à six lignes : le ciel tourbillonne au-dessus d'un village, un cyprès occupe le premier plan, la peinture est visible en touches épaisses.
*   **Version renard.** Le cyprès devient un renard dressé, ou un renard est assis sur le clocher. Quatre à six lignes sur ce qui a changé et ce qui reste (le ciel, le village, les couleurs).
*   **Histoire.** Huit à douze lignes. Un renard sort du tableau la nuit où le musée ferme, suit le tourbillon du ciel, et doit y rentrer avant l'ouverture. Un récit avec un début, un événement, une fin.

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

Les extensions peuvent être `.png` si vos fichiers le sont, à condition que le HTML utilise la même extension. Les chemins fonctionnent quand on ouvre `index.html` depuis le dossier rendu.

`index.html` relie la feuille de style et le script. Les règles d'apparence sont dans `style.css`, pas dans un gros attribut `style` répété sur chaque balise. Le JavaScript est dans `script.js`.

Blocs HTML, dans cet ordre : un titre de page, une section « Le tableau original », une section « La version renard », une section « L'histoire ».

<ExerciseTabs courseId="premiere_projet" courseTitle="Tableau et renards">
  <ExerciseSection id="web-projet-1" label="La page" type="python">
    <Enonce>
      Créez l'arborescence du sujet. `index.html` contient un titre `h1`, trois sections avec des `h2` (« Le tableau original », « La version renard », « L'histoire »), et les textes aux longueurs indiquées.

      L'original cite l'auteur, la date et le lieu de conservation. L'histoire fait entre huit et douze lignes et raconte une scène.

      Au chargement, la page montre l'image originale et le bouton `Voir la version renard`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="web-projet-2" label="La mise en forme" type="lecture">
    <Enonce>
      Dans `style.css`, limitez la largeur du contenu, espacez les sections, et faites tenir l'image dans la page (`max-width: 100%`).

      La page reste lisible sur une fenêtre étroite : le texte ne dépasse pas de l'écran, l'image ne dépasse pas la largeur de la page.

      Le bouton a un style distinct du texte. La classe `mode-nuit`, si vous la faites, change le fond et la couleur du texte. La classe `cachee`, si vous l'utilisez, masque l'histoire au chargement.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Le bouton qui change l'image <Renard />

Les programmes ci-dessous sont des points de départ. Adaptez les identifiants, les textes et les chemins à votre page. Copier un bloc sans le relier à vos sections ne suffit pas : le bouton doit agir sur votre image.

```html
<button id="bouton-image">Voir la version renard</button>
<img id="image-tableau" src="images/tableau-original.jpg" alt="Le tableau original" />
```

```javascript
const bouton = document.getElementById("bouton-image");
const image = document.getElementById("image-tableau");
let imageOriginale = true;

bouton.addEventListener("click", function () {
  if (imageOriginale) {
    image.src = "images/tableau-renard.jpg";
    image.alt = "La version du tableau avec des renards";
    bouton.textContent = "Voir l'original";
    imageOriginale = false;
  } else {
    image.src = "images/tableau-original.jpg";
    image.alt = "Le tableau original";
    bouton.textContent = "Voir la version renard";
    imageOriginale = true;
  }
});
```

*Attention : l'attribut `alt` change avec l'image. Ce n'est pas le même texte pour les deux versions.*

Un second geste, au choix, fait apparaître l'histoire (cachée au départ) ou passe la page en mode nuit. Les deux peuvent coexister. Un seul des deux est obligatoire en plus du bouton d'image.

### Mode jour / nuit

Le bouton ajoute ou retire la classe `mode-nuit` sur `body`. Les couleurs de cette classe sont définies dans `style.css` (fond sombre, texte clair). Le libellé passe de `Mode nuit` à `Mode jour`.

```html
<button id="bouton-mode">Mode nuit</button>
```

```javascript
const boutonMode = document.getElementById("bouton-mode");
const body = document.body;

boutonMode.addEventListener("click", function () {
  body.classList.toggle("mode-nuit");
  if (body.classList.contains("mode-nuit")) {
    boutonMode.textContent = "Mode jour";
  } else {
    boutonMode.textContent = "Mode nuit";
  }
});
```

### Afficher l'histoire

L'histoire est dans la page dès le chargement, avec la classe CSS `cachee`. Le clic retire ou remet cette classe. On n'écrit pas l'histoire dans le JavaScript.

```html
<button id="bouton-histoire">Lire l'histoire</button>
<p id="texte-histoire" class="cachee">Les renards ont envahi ce tableau.</p>
```

```javascript
const boutonHistoire = document.getElementById("bouton-histoire");
const texteHistoire = document.getElementById("texte-histoire");

boutonHistoire.addEventListener("click", function () {
  texteHistoire.classList.toggle("cachee");
});
```

<ExerciseTabs courseId="premiere_projet" courseTitle="Interaction">
  <ExerciseSection id="web-projet-3" label="L'interaction" type="python">
    <Enonce>
      Dans `script.js`, le bouton d'image alterne les deux sources et les deux `alt`, et son texte alterne `Voir la version renard` et `Voir l'original`.

      Ajoutez en plus soit le mode nuit, soit l'affichage de l'histoire. Les identifiants HTML et ceux lus par `getElementById` sont les mêmes.

      Contrôle : au premier clic on voit les renards, au second on revient au tableau, et l'image ne se casse pas (pas d'icône de fichier manquant). Ouvrez la page en double-cliquant sur `index.html`.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Une archive zip du dossier entier `projet-tableau-renard` :

*   `index.html`
*   `styles/style.css`
*   `scripts/script.js`
*   les deux images dans `images/`

Le zip porte votre nom et votre prénom, par exemple `NOM_Prenom_tableau_renard.zip`. On doit pouvoir l'extraire et ouvrir `index.html` sans remettre les images à la main.
