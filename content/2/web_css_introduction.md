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

Le HTML définit les titres, les paragraphes et les différentes zones de la page, mais il ne décide ni de la couleur, ni de la police, ni de l'alignement. La présentation est le rôle du **CSS** (*Cascading Style Sheets*). Séparer les deux permet de changer l'apparence sans réécrire le contenu, et d'utiliser la même feuille de style pour plusieurs pages.

## Relier la feuille à la page

La forme recommandée est une feuille externe. Le HTML ne contient qu'un lien, dans le `<head>`.

```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

Pour un essai rapide, un bloc `<style>` dans la page suffit. On ne le garde pas dans un vrai site, car le style serait alors copié dans chaque document, et la moindre correction obligerait à tous les rouvrir.

```html
<style>
  h1 { color: #ea580c; }
</style>
```

Une règle se compose d'un **sélecteur**, qui indique à quels éléments elle s'applique, puis de déclarations `propriété: valeur` entre accolades.

## Les sélecteurs

Trois sélecteurs suffisent pour commencer. Le nom d'un élément vise toutes les balises de ce type : `p { }` concerne tous les paragraphes. Une **classe**, préfixée par un point, vise les éléments qui portent `class="carte"`. On la réutilise autant qu'on veut. Un **identifiant**, préfixé par `#`, vise l'unique élément dont `id` a cette valeur. Un même `id` ne doit donc pas être utilisé deux fois.

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

Le même en-tête reçoit les deux règles. Le fond vient de l'identifiant, et le centrage de la classe. Quand deux règles se disputent la même propriété, le navigateur **cascade** : il combine ce qui ne se contredit pas, et, en cas de conflit, la règle la plus spécifique l'emporte. À spécificité égale, c'est la dernière écrite. Un `id` est plus spécifique qu'une classe, et une classe plus spécifique qu'un nom d'élément.

Mettre le style dans l'attribut `style="..."` fonctionne, mais le style n'est plus réutilisable. De même, utiliser un `id` là où une classe suffirait empêche d'appliquer la même apparence à une deuxième carte.

## Les propriétés les plus courantes

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

Chaque élément est une **boîte**, composée, de l'intérieur vers l'extérieur, du **contenu**, du `padding` (le remplissage entre le texte et le bord), de la bordure (`border`) et de la `margin` (l'espace qui sépare cette boîte des autres). `width` et `height` mesurent le contenu, sauf avec `box-sizing: border-box`. Dans ce cas, le padding et la bordure sont compris dans la largeur indiquée, ce qui est plus pratique pour aligner des colonnes. Il ne faut pas confondre `margin` et `padding`, sous peine de décaler toute la page : la marge éloigne la boîte des autres éléments, alors que le padding agrandit l'intérieur de la boîte.

## Aligner avec Flexbox

```css
.menu {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
```

`display: flex` range les enfants sur une ligne. `gap` ajoute un espace entre eux, sans avoir à régler des marges. `justify-content: center` centre la rangée. `flex-wrap: wrap` autorise le retour à la ligne quand la fenêtre se rétrécit. Pour une colonne, on ajoute `flex-direction: column`.

En résumé, le HTML structure la page et le CSS la met en forme. La feuille de style se relie avec `<link rel="stylesheet">`. Les règles ciblent un élément, une classe ou un identifiant, et la cascade règle les conflits selon la spécificité, puis selon l'ordre d'écriture. Chaque boîte comprend un contenu, un padding, une bordure et une marge. Enfin, Flexbox permet d'aligner des éléments sans calculer leurs positions à la main.

## Pour s'entraîner / Suite

Appliquer une feuille de style à une page HTML déjà structurée, puis enchaîner avec [Interactions JavaScript](/cours/2/web_javascript_interactions) pour rendre la page dynamique.

!!! info "Programme Première"
    Le BO attend la capacité à structurer une page (HTML) et à en contrôler la présentation (CSS), avant d'ajouter des scripts côté client.
