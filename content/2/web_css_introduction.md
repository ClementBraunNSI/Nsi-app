---
title: Introduction au CSS
description: 'Mise en forme des pages web : sélecteurs, couleurs et mise en page de base.'
level: premiere
chapter: Web et Interaction
icon: "palette"
badgeId: premiere_css_intro
prerequisites:
  - web_html
order: 25
audience: public
---

# Introduction au CSS

Le HTML a posé les titres, les paragraphes et les zones. Il ne décide pas de la couleur, de la police, ni de l'alignement. C'est le rôle du **CSS** (*Cascading Style Sheets*) : la présentation. On sépare les deux pour pouvoir changer l'apparence sans réécrire le contenu, et pour que la même feuille habille plusieurs pages.

## Relier la feuille à la page

La forme recommandée est une feuille externe. Le HTML ne contient qu'un lien, dans le `<head>`.

```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

Pour un essai rapide, un bloc `<style>` dans la page suffit. On ne le garde pas dans un vrai site : le style se retrouve copié dans chaque document, et une correction demande de tout rouvrir.

```html
<style>
  h1 { color: #ea580c; }
</style>
```

Une règle se lit ainsi : un **sélecteur** dit à qui elle s'applique, puis des déclarations `propriété: valeur` entre accolades.

## Qui est visé

Trois sélecteurs suffisent pour commencer. Le nom d'un élément vise toutes les balises de ce type : `p { }` concerne tous les paragraphes. Une **classe**, préfixée par un point, vise les éléments qui portent `class="carte"`. On la réutilise autant qu'on veut. Un **identifiant**, préfixé par `#`, vise l'unique élément dont `id` a cette valeur. Un `id` n'est pas fait pour être recopié.

| Sélecteur | Exemple | Cible |
| --- | --- | --- |
| Élément | `p { }` | Tous les `<p>` |
| Classe | `.carte { }` | `class="carte"` |
| Identifiant | `#entete { }` | `id="entete"` (unique) |

```html
<header id="entete" class="bandeau">Mon site</header>
```

```css
#entete { background: #1e293b; color: white; padding: 1rem; }
.bandeau { text-align: center; }
```

Le même en-tête reçoit les deux règles. Le fond vient de l'identifiant, le centrage de la classe. Quand deux règles se disputent la même propriété, le navigateur **cascade** : il combine ce qui ne se contredit pas, et, en cas de conflit, la règle la plus spécifique l'emporte. À spécificité égale, c'est la dernière écrite. Un `id` est plus spécifique qu'une classe, une classe plus spécifique qu'un élément.

Mettre le style dans l'attribut `style="..."` fonctionne, mais le style n'est plus réutilisable. Et prendre un `id` là où une classe suffirait empêche d'appliquer la même apparence à une deuxième carte.

## Ce qu'on règle le plus souvent

```css
body {
  font-family: system-ui, sans-serif;
  line-height: 1.5;
  margin: 0;
  background: #f8fafc;
}

.carte {
  max-width: 40rem;
  margin: 2rem auto;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
}
```

`font-family` liste des polices de repli : si la première manque, le navigateur prend la suivante. `margin: 2rem auto` sur une carte de largeur bornée la centre horizontalement. `auto` répartit l'espace qui reste à gauche et à droite.

Chaque élément est une **boîte**. De l'intérieur vers l'extérieur : le **contenu**, puis le `padding` (le remplissage entre le texte et le bord), puis la `border`, puis la `margin` (l'espace qui sépare cette boîte des autres). `width` et `height` mesurent le contenu, sauf si `box-sizing: border-box` : dans ce cas, padding et bordure sont compris dans la largeur annoncée. C'est plus prévisible dès qu'on aligne des colonnes. Confondre `margin` et `padding` est le geste qui décale toute une page : l'une pousse à l'extérieur, l'autre gonfle l'intérieur.

## Aligner avec Flexbox

```css
.menu {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
```

`display: flex` range les enfants sur une ligne. `gap` pose un espace entre eux, sans bricoler des marges. `justify-content: center` centre la rangée. `flex-wrap: wrap` autorise le retour à la ligne quand la fenêtre se rétrécit. Pour une colonne, on ajoute `flex-direction: column`.

Pour fermer : le CSS habille, le HTML structure. On lie la feuille avec `<link rel="stylesheet">`. On cible par l'élément, la classe ou l'identifiant. La cascade tranche les conflits par la spécificité, puis par l'ordre. Une boîte, c'est contenu, padding, bordure, marge. Flexbox aligne une rangée sans calculer les positions à la main.

## Pour s'entraîner / Suite

Appliquez une feuille de style à une page HTML déjà structurée, puis enchaînez avec [Interactions JavaScript](/cours/2/web_javascript_interactions) pour rendre la page dynamique.

!!! info "Programme Première"
    Le BO attend la capacité à structurer une page (HTML) et à en contrôler la présentation (CSS), avant d'ajouter des scripts côté client.
