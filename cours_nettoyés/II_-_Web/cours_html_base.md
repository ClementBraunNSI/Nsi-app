---
title: "Introduction au HTML"
description: "Notice sur HTML et création d'un site web basique"
level: "Seconde"
chapter: 2
icon: "code"
---

# Notice sur HTML et création d'un site web basique

## 1. Qu'est-ce que HTML ?

> **Définition**
>
> **HTML** (HyperText Markup Language) est le langage de balisage utilisé pour structurer le contenu des pages web. Chaque page web est un fichier HTML qui contient des balises permettant de définir différents éléments comme des titres, des paragraphes, des images, des liens, etc.

## 2. Structure d'un fichier HTML

> **Définition**
>
> Un fichier HTML est structuré de manière simple. Voici la structure de base d'un document HTML :

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

**Explication :**

- `<!DOCTYPE html>` : Indique que le document utilise HTML5.
- `<html>` : La balise qui contient tout le contenu HTML.
- `<head>` : Section contenant des informations sur la page (métadonnées), comme le titre.
- `<meta charset="UTF-8">` : Spécifie l'encodage de caractères (UTF-8).
- `<title>` : Définit le titre qui apparaît dans l'onglet du navigateur.
- `<body>` : Contient le contenu visible par l'utilisateur (titres, paragraphes, images, etc.).

## Les principales balises HTML

> **Définition**

### Titres

```html
<h1>Mon titre principal</h1>
<h2>Mon sous-titre</h2>
```

Ces balises Titres vont de h1 à h6, où h1 est le plus grand titre.

### Paragraphes

Les paragraphes sont définis par la balise `p`.

```html
<p>Ceci est un paragraphe.</p>
```

### Liens

Les liens sont créés à l'aide de la balise `a`.

```html
<a href="https://www.example.com">Visiter Example.com</a>
```

### Images

Les images sont insérées par la balise `img`.

```html
<img src="source de l'image" alt="Mon image">
```

### Listes Non ordonnées

Les listes à puces ordonnées sont définies grâce à `ul`.

```html
<ul>
    <li>Item 1</li>
    <li>Item 2</li>
</ul>
```

### Listes Ordonnées

Les listes ordonnées sont définies grâce à `ol`.

```html
<ol>
    <li>Item 1</li>
    <li>Item 2</li>
</ol>
```

## But de la séance

> **Définition**
>
> Vous devrez reproduire la page web suivante à l'aide des balises que vous avez vu.
> Vous avez aussi le site [w3school](https://www.w3schools.com/html/).

L'image à utiliser : ![image de maya](img/maya.png)
