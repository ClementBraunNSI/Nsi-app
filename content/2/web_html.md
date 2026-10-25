---
title: Le langage HTML
description: 'Introduction au langage HTML, structure d''une page et principales balises.'
level: premiere
chapter: Web et Interaction
icon: "file-text"
badgeId: premiere_langage_html
prerequisites: []
audience: public
---

# Le langage HTML

Une page web n'est pas un dessin. C'est un texte balisé, que le navigateur interprète. Le **HTML** (*HyperText Markup Language*) décrit la **structure** et le **sens** du contenu : ceci est un titre, ceci un paragraphe, ceci un lien. Il ne dit pas la couleur, et il ne réagit pas au clic. C'est le CSS qui donnera la couleur, et le JavaScript qui réagira au clic. Mélanger les trois rôles, c'est ce qui rend une page impossible à maintenir.

## Le squelette d'un document

<HtmlStructureExplorer />

Un document HTML5 commence par `<!DOCTYPE html>`, qui dit au navigateur quelle grammaire lire. Puis `<html>` enveloppe deux parties. `<head>` porte les métadonnées : le titre de l'onglet, l'encodage, le lien vers la feuille de style. Rien de ce qui est dans `<head>` n'est le contenu de la page. `<body>` est ce que la personne voit.

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

`charset="UTF-8"` évite les accents cassés. `viewport` dit au téléphone de ne pas afficher la page comme un bureau miniature. `lang="fr"` indique la langue, utile aux lecteurs d'écran.

## Des balises qui veulent dire quelque chose

On pourrait tout mettre dans des `<div>`. Le navigateur afficherait quand même. Mais une balise **sémantique** dit le rôle de la zone. `<header>`, `<main>` et `<footer>` découpent la page. `<nav>` est la navigation. `<section>` et `<article>` sont des blocs de contenu. Un lecteur d'écran, et un moteur de recherche, s'appuient sur ces noms. Une `<div>` ne dit rien.

| Balise | Rôle |
| --- | --- |
| `<header>`, `<main>`, `<footer>` | Grandes zones de la page |
| `<nav>` | Navigation |
| `<section>`, `<article>` | Blocs de contenu |

Les titres vont de `<h1>` à `<h6>`. On n'en saute pas les niveaux pour « faire plus petit » : la taille, c'est le CSS. En général, une page a un seul `<h1>`. `<p>` est un paragraphe. `<strong>` marque une importance, que le navigateur rend souvent en gras. `<em>` marque une emphase, souvent en italique. Gras et italique sont l'apparence. L'importance et l'emphase sont le sens.

Un lien s'écrit `<a href="...">`. L'adresse est dans l'attribut `href`. Une image s'écrit `<img src="photo.jpg" alt="Description courte">`. `alt` décrit l'image pour qui ne la voit pas, et pour qui le fichier n'a pas chargé. Une liste non ordonnée est un `<ul>` de `<li>`. Une liste d'étapes est un `<ol>`.

```html
<a href="https://exemple.fr">Un lien</a>
<img src="photo.jpg" alt="Description courte">
<ul><li>puce</li></ul>
<ol><li>étape 1</li></ol>
```

Un tableau se lit en lignes. `<table>` contient des `<tr>`. Chaque ligne contient des `<th>` pour les en-têtes, ou des `<td>` pour les données.

<WebPreview />

Oublier de fermer une balise, ou glisser du texte visible dans `<head>`, casse la lecture que fait le navigateur. L'autre réflexe à perdre : styler avec des balises comme `<font>`. Elles sont obsolètes. La structure reste dans le HTML.

## Un formulaire envoie des données

`<form>` rassemble des champs et les envoie à une URL. `action` est cette URL. `method` dit comment les données voyagent.

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

`method="get"` place les données dans l'URL. Elles sont visibles, elles restent dans l'historique, et leur longueur est limitée. Cela convient à une recherche. `method="post"` place les données dans le corps de la requête. C'est le bon choix pour un formulaire qui crée ou modifie quelque chose.

`name` est le nom du champ côté serveur : c'est la clé que le programme lira. `id` sert au document. `for` sur le `<label>` reprend cet `id`, pour que cliquer sur le texte « Nom » place le curseur dans le champ. `required` empêche l'envoi si le champ est vide. Le navigateur fait ce contrôle avant même d'appeler le serveur.

En résumé, le HTML dit la structure et le sens, le navigateur construit la page à partir des balises. Un document, c'est un type, puis `<head>` pour les métadonnées et `<body>` pour le contenu. On préfère les balises qui nomment les zones. Liens, images avec `alt`, listes, tableaux et formulaires sont le vocabulaire de base. Le HTML ne remplace ni le CSS ni le JavaScript.

## Pour s'entraîner / Suite

Tester la structure avec l'explorateur et l'aperçu ci-dessus, puis passer à [Introduction au CSS](/cours/2/web_css_introduction) pour la mise en forme, puis [Interactions JavaScript](/cours/2/web_javascript_interactions).
