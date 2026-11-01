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

Une page web affichée a d'abord été un fichier texte. Ce fichier ne contient pas seulement les phrases visibles. Il contient aussi des indications qui précisent au navigateur ce qui est un titre, un paragraphe ou une image. Ces indications forment le HTML.

> **HTML** (*HyperText Markup Language*) est le langage de balisage qui structure le contenu d'une page. Les titres, les paragraphes, les images et les liens sont des éléments délimités par des balises.

## La structure d'un fichier HTML

Tout document HTML5 commence à peu près de la même façon. Le navigateur a besoin de savoir dans quelle langue est la page, comment lire les caractères, et quel titre afficher dans l'onglet. Ce qui s'affiche vraiment se trouve ensuite dans le corps du document.

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

`<!DOCTYPE html>` prévient le navigateur qu'il s'agit d'HTML5. La balise `<html>` englobe tout le document. La balise `<head>` contient les informations qui décrivent la page sans s'afficher, comme le titre de l'onglet ou l'encodage des caractères. L'encodage `UTF-8` sait représenter les accents, ce qui évite d'obtenir « Ã© » à la place de « é ». Enfin, `<body>` contient ce que la personne devant l'écran voit, c'est-à-dire les titres, les paragraphes et les images.

<HtmlStructureExplorer />

## Les balises principales

Les titres vont de `<h1>` à `<h6>`. Le `h1` est le titre principal de la page. Ce n'est pas forcément le texte le plus gros, car la taille est choisie par le navigateur ou par la feuille de style. On n'en met en général qu'un seul.

```html
<h1>Mon titre principal</h1>
<h2>Mon sous-titre</h2>
```

Un paragraphe se marque avec `<p>`. Une ligne sautée dans le fichier sans balise est souvent ignorée par le navigateur. C'est `<p>` qui crée vraiment le paragraphe.

```html
<p>Ceci est un paragraphe.</p>
```

Un lien utilise `<a>`, et l'adresse se place dans l'attribut `href`. Le texte entre les balises est ce qui s'affiche et se clique.

```html
<a href="https://www.example.com">Visiter Example.com</a>
```

Une image utilise `<img>`. Elle n'a pas de balise fermante, et toutes ses informations sont données par ses attributs. `src` indique où trouver le fichier. `alt` décrit l'image pour quelqu'un qui ne la voit pas, et pour l'auteur de la page le jour où le fichier manque.

```html
<img src="source de l'image" alt="Mon image">
```

Il existe deux formes de listes, que l'on confond souvent. `<ul>` donne une liste à puces, sans ordre. `<ol>` numérote les éléments. Dans les deux cas, chaque ligne est un `<li>`.

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

Pour écrire une première page, commencer par ce squelette, puis ajouter un titre, un paragraphe et un lien. Le reste des balises viendra au fil des besoins.
