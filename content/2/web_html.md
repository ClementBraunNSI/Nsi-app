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

## Objectifs

- Expliquer le rôle du HTML dans une page web.
- Lire et écrire la structure de base d'un document HTML5.
- Utiliser les balises sémantiques, de texte, de lien, de liste et de formulaire.
- Distinguer le contenu (HTML) de la mise en forme (CSS) et du comportement (JS).

## Idée clé

Le **HTML** (HyperText Markup Language) décrit la **structure** et le **sens** du contenu : titres, paragraphes, liens, images… Ce ne sont pas des instructions de dessin, mais des **balises** que le navigateur interprète pour construire la page.

## Anatomie d'un document

<HtmlStructureExplorer />

Structure minimale :

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
            </ul>
        </nav>
    </header>

    <main>
        <section>
            <h2>Section 1</h2>
            <p>Contenu de la section 1.</p>
        </section>
    </main>

    <footer>
        <p>&copy; 2024 Mon Site Web</p>
    </footer>
</body>
</html>
```

- `<!DOCTYPE html>` : document HTML5.
- `<head>` : métadonnées (titre onglet, encodage, CSS) — **pas** le contenu visible.
- `<body>` : ce que l'utilisateur voit.

## Balises essentielles

### Structure sémantique

| Balise | Rôle |
| --- | --- |
| `<header>`, `<main>`, `<footer>` | Grandes zones de la page |
| `<nav>` | Navigation |
| `<section>`, `<article>` | Blocs de contenu |

Utiliser ces balises plutôt que des `<div>` partout : le sens aide l'accessibilité et le référencement.

### Texte

- `<h1>` … `<h6>` : titres (un seul `<h1>` principal en général).
- `<p>` : paragraphe.
- `<strong>` : importance (souvent gras) ; `<em>` : emphase (souvent italique).

### Liens, médias, listes

```html
<a href="https://exemple.fr">Un lien</a>
<img src="photo.jpg" alt="Description courte">
<ul><li>puce</li></ul>
<ol><li>étape 1</li></ol>
```

L'attribut `alt` d'une image décrit le contenu pour l'accessibilité.

### Tableaux (rappel)

`<table>` → lignes `<tr>` → cellules `<th>` (en-tête) ou `<td>` (donnée).

<WebPreview />

## Formulaires

Un formulaire envoie des données au serveur via `<form>`.

```html
<form action="/traitement" method="post">
    <label for="nom">Nom :</label>
    <input type="text" id="nom" name="nom" required>

    <label for="email">Email :</label>
    <input type="email" id="email" name="email" required>

    <label for="message">Message :</label>
    <textarea id="message" name="message"></textarea>

    <button type="submit">Envoyer</button>
</form>
```

- **`action`** : URL de traitement.
- **`method="get"`** : données dans l'URL (visibles, limitées).
- **`method="post"`** : données dans le corps de la requête (plus adaptées aux formulaires).

`name` identifie le champ côté serveur ; `id` + `for` lient le label pour l'accessibilité.

## Piège fréquent

Oublier de fermer une balise, ou mettre du contenu visible dans `<head>`. Autre classique : confondre **structure** (HTML) et **style** (CSS) — ne pas « styler » avec des balises obsolètes comme `<font>`.

## À retenir

- HTML = structure et sémantique ; le navigateur affiche d'après les balises.
- Document type + `<html>` → `<head>` (méta) + `<body>` (contenu).
- Préférer les balises sémantiques (`header`, `main`, `nav`…).
- Liens (`<a>`), images (`<img alt="…">`), listes (`ul`/`ol`/`li`).
- Formulaire : `action`, `method` (GET/POST), `name` sur les champs.
- HTML ne remplace ni le CSS ni le JavaScript.

## Pour s'entraîner / Suite

Testez la structure avec l'explorateur et l'aperçu ci-dessus, puis passez à [Introduction au CSS](/cours/2/web_css_introduction) pour la mise en forme, puis [Interactions JavaScript](/cours/2/web_javascript_interactions).
