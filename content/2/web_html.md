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

Une page web est un texte balisé, que le navigateur interprète. Le **HTML** (*HyperText Markup Language*) décrit la **structure** et le **sens** du contenu, en indiquant par exemple ce qui est un titre, un paragraphe ou un lien. Il ne fixe pas les couleurs et ne réagit pas aux clics : ce sont les rôles du CSS et du JavaScript. Mélanger ces trois rôles rend une page très difficile à maintenir.

## Le squelette d'un document

<HtmlStructureExplorer />

Un document HTML5 commence par `<!DOCTYPE html>`, qui indique au navigateur quelle version du langage lire. La balise `<html>` contient ensuite deux parties. `<head>` regroupe les métadonnées, comme le titre de l'onglet, l'encodage ou le lien vers la feuille de style, mais rien de ce qui s'affiche dans la page. `<body>` contient ce que voit la personne devant l'écran.

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

`charset="UTF-8"` évite les accents cassés. `viewport` demande au téléphone de ne pas afficher la page comme un écran d'ordinateur en miniature. `lang="fr"` indique la langue, utile aux lecteurs d'écran.

## Les balises sémantiques

On pourrait tout mettre dans des `<div>`, et le navigateur afficherait quand même la page. Mais une balise **sémantique** indique le rôle de la zone qu'elle contient. `<header>`, `<main>` et `<footer>` découpent la page, `<nav>` contient la navigation, et `<section>` et `<article>` délimitent des blocs de contenu. Les lecteurs d'écran et les moteurs de recherche s'appuient sur ces balises, alors qu'une `<div>` n'indique aucun rôle.

| Balise | Rôle |
| --- | --- |
| `<header>`, `<main>`, `<footer>` | Grandes zones de la page |
| `<nav>` | Navigation |
| `<section>`, `<article>` | Blocs de contenu |

Les titres vont de `<h1>` à `<h6>`. Il ne faut pas sauter de niveau pour obtenir un titre plus petit, car la taille dépend du CSS. En général, une page a un seul `<h1>`. `<p>` est un paragraphe. `<strong>` marque une importance, que le navigateur rend souvent en gras. `<em>` marque une emphase, souvent en italique. Le gras et l'italique relèvent de l'apparence, alors que l'importance et l'emphase relèvent du sens.

Un lien s'écrit `<a href="...">`. L'adresse est dans l'attribut `href`. Une image s'écrit `<img src="photo.jpg" alt="Description courte">`. `alt` décrit l'image pour les personnes qui ne la voient pas, ou quand le fichier ne se charge pas. Une liste non ordonnée est un `<ul>` de `<li>`. Une liste d'étapes est un `<ol>`.

```html
<a href="https://exemple.fr">Un lien</a>
<img src="photo.jpg" alt="Description courte">
<ul><li>puce</li></ul>
<ol><li>étape 1</li></ol>
```

Un tableau se lit en lignes. `<table>` contient des `<tr>`. Chaque ligne contient des `<th>` pour les en-têtes, ou des `<td>` pour les données.

<WebPreview />

Oublier de fermer une balise, ou placer du texte visible dans `<head>`, perturbe la lecture de la page par le navigateur. Il faut aussi éviter de mettre en forme le texte avec des balises comme `<font>`, qui sont obsolètes : le HTML se limite à la structure.

## Les formulaires

`<form>` rassemble des champs et les envoie à une URL. L'attribut `action` indique cette URL, et `method` précise comment les données sont transmises.

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

`name` est le nom du champ côté serveur : c'est la clé que le programme lira. `id` sert à identifier le champ dans la page. `for` sur le `<label>` reprend cet `id`, pour que cliquer sur le texte « Nom » place le curseur dans le champ. `required` empêche l'envoi si le champ est vide. Le navigateur fait ce contrôle avant même d'appeler le serveur.

En résumé, le HTML décrit la structure et le sens du contenu, et le navigateur construit la page à partir des balises. Un document commence par la déclaration du type, suivie de `<head>` pour les métadonnées et de `<body>` pour le contenu. On préfère les balises qui indiquent le rôle des zones. Les liens, les images avec `alt`, les listes, les tableaux et les formulaires forment le vocabulaire de base. Le HTML ne remplace ni le CSS ni le JavaScript.

## Pour s'entraîner / Suite

Tester la structure avec l'explorateur et l'aperçu ci-dessus, puis passer à [Introduction au CSS](/cours/2/web_css_introduction) pour la mise en forme, puis [Interactions JavaScript](/cours/2/web_javascript_interactions).
