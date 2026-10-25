---
title: Notice sur HTML
description: 'Introduction au HTML, structure d''un fichier et principales balises.'
level: '2'
chapter: Web
icon: "notebook-pen"
prerequisites: []
audience: public
---

# Notice sur HTML

Une page web que vous lisez a d'abord été un fichier texte. Ce fichier ne contient pas seulement les phrases visibles. Il contient aussi des indications qui disent au navigateur : ceci est un titre, ceci est un paragraphe, ceci est une image. Ces indications forment le HTML.

> **HTML** (*HyperText Markup Language*) est le langage de balisage qui structure le contenu d'une page. Titres, paragraphes, images et liens sont des éléments délimités par des balises.

## À quoi ressemble un fichier

Tout document HTML5 commence à peu près de la même façon. Le navigateur a besoin de savoir dans quelle langue est la page, comment lire les caractères, et quel titre afficher dans l'onglet. Le reste, ce que vous voyez vraiment, se trouve dans le corps du document.

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Titre de la page</title>
</head>
<body>
    <!-- Contenu visible de la page -->
    <h1>Bienvenue sur mon site</h1>
    <p>Ceci est un paragraphe.</p>
</body>
</html>
```

`<!DOCTYPE html>` prévient le navigateur qu'il s'agit d'HTML5. La balise `<html>` englobe tout le document. Dans `<head>`, on range ce qui décrit la page sans s'afficher : le titre de l'onglet, l'encodage des caractères. `UTF-8` est cet encodage. Il sait représenter les accents, ce qui évite les « Ã© » à la place des « é ». `<body>` contient enfin ce que la personne devant l'écran voit : titres, paragraphes, images.

<HtmlStructureExplorer />

## Les balises que vous allez écrire tout de suite

Les titres vont de `<h1>` à `<h6>`. Le `h1` est le titre principal de la page, pas « le plus gros texte » : c'est le navigateur, ou la feuille de style, qui décide de la taille. On n'en met en général qu'un seul.

```html
<h1>Mon titre principal</h1>
<h2>Mon sous-titre</h2>
```

Un paragraphe se marque avec `<p>`. Si vous sautez une ligne dans le fichier sans balise, le navigateur l'ignore souvent. C'est `<p>` qui crée vraiment le paragraphe.

```html
<p>Ceci est un paragraphe.</p>
```

Un lien utilise `<a>`, et l'adresse se place dans l'attribut `href`. Le texte entre les balises est ce qui s'affiche et se clique.

```html
<a href="https://www.example.com">Visiter Example.com</a>
```

Une image utilise `<img>`. Elle n'a pas de balise fermante : tout tient dans les attributs. `src` indique où trouver le fichier. `alt` décrit l'image pour quelqu'un qui ne la voit pas, et pour vous le jour où le fichier manque.

```html
<img src="source de l'image" alt="Mon image">
```

Les listes ont deux formes, et on les mélange souvent. `<ul>` donne une liste à puces, sans ordre. `<ol>` numérote les éléments. Dans les deux cas, chaque ligne est un `<li>`.

```html
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>
```

```html
<ol>
    <li>Item 1</li>
    <li>Item 2</li>
</ol>
```

Quand vous écrirez votre première page, commencez par ce squelette, puis ajoutez un titre, un paragraphe et un lien. Le reste des balises viendra quand vous en aurez besoin.
