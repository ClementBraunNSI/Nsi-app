---
title: Le langage HTML
description: 'Introduction au langage HTML, structure d''une page et principales balises.'
level: premiere
chapter: Web et Interaction
icon: "\U0001F4C4"
badgeId: premiere_langage_html
prerequisites: []
---


# Le langage HTML

## Introduction

**HTML** (HyperText Markup Language) est le langage de balisage standard utilisé pour créer et structurer le contenu des pages web. Créé par Tim Berners-Lee en 1991, HTML utilise un système de balises pour définir la structure et le contenu d'une page web.

## Structure d'un document HTML

<HtmlStructureExplorer />

Voici la structure de base d'un document HTML :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Titre de la page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Titre principal</h1>
        <nav>
            <ul>
                <li><a href="#">Accueil</a></li>
                <li><a href="#">À propos</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <main>
        <section>
            <h2>Section 1</h2>
            <p>Contenu de la section 1.</p>
        </section>
        
        <section>
            <h2>Section 2</h2>
            <p>Contenu de la section 2.</p>
        </section>
    </main>
    
    <footer>
        <p>&copy; 2023 Mon Site Web</p>
    </footer>
</body>
</html>
```

## Les principales balises HTML

Les balises HTML sont organisées en différentes catégories selon leur fonction.

### Balises de structure
*   `<!DOCTYPE html>` : Déclare le type de document (HTML5).
*   `<html>` : Élément racine du document.
*   `<head>` : Contient les métadonnées (titre, encodage, liens CSS).
*   `<body>` : Contient le contenu visible de la page.
*   `<header>`, `<main>`, `<footer>` : Balises sémantiques définissant les grandes zones de la page.
*   `<section>`, `<article>`, `<nav>` : Balises pour structurer le contenu.

### Balises de texte
*   `<h1>` à `<h6>` : Titres de différents niveaux (h1 étant le plus important).
*   `<p>` : Paragraphe.
*   `<strong>` : Texte important (généralement affiché en **gras**).
*   `<em>` : Texte mis en emphase (généralement affiché en *italique*).

### Balises de lien et média
*   `<a href="url">` : Lien hypertexte.
*   `<img src="image.jpg" alt="description">` : Image.
*   `<video>`, `<audio>` : Éléments multimédias.

### Balises de liste
*   `<ul>` : Liste non ordonnée (à puces).
*   `<ol>` : Liste ordonnée (numérotée).
*   `<li>` : Élément de liste.

### Balises de tableau
*   `<table>` : Définit un tableau.
*   `<tr>` : Ligne de tableau (Table Row).
*   `<th>` : Cellule d'en-tête (Table Header).
*   `<td>` : Cellule de données (Table Data).

<WebPreview />

## Formulaires et transmission de données

Les formulaires HTML permettent aux utilisateurs d'envoyer des données au serveur. Ils sont définis par la balise `<form>` et contiennent divers éléments interactifs.

### Structure d'un formulaire

```html
<form action="/traitement.php" method="post">
    <label for="nom">Nom :</label>
    <input type="text" id="nom" name="nom" required>
    
    <label for="email">Email :</label>
    <input type="email" id="email" name="email" required>
    
    <label for="message">Message :</label>
    <textarea id="message" name="message"></textarea>
    
    <button type="submit">Envoyer</button>
</form>
```

### Attributs importants de la balise `<form>`
*   **action** : URL où les données du formulaire seront envoyées pour être traitées.
*   **method** : Méthode HTTP utilisée pour envoyer les données.
    *   **GET** : Les données sont ajoutées à l'URL (visible, limité en taille).
    *   **POST** : Les données sont envoyées dans le corps de la requête (invisible, pas de limite de taille).
