---
title: 'Atelier : éditeur HTML en direct'
description: 'Écrire du code HTML et observer immédiatement le rendu dans le navigateur.'
level: '1'
chapter: Web
icon: "\U0001F4BB"
prerequisites:
  - Cours_html
---

# Atelier : éditeur HTML en direct

Dans cette activité, il s'agit d'écrire du code HTML et d'observer directement le résultat dans un aperçu de page web.

L'objectif est de comprendre qu'une page web est composée de **balises** qui donnent du sens au contenu : titre, paragraphe, liste, image, lien, etc.

## Objectifs

À la fin de l'activité, les compétences travaillées sont les suivantes :

- modifier le contenu d'une page HTML ;
- utiliser des balises simples comme `<h1>`, `<p>`, `<ul>`, `<li>`, `<img>` et `<a>` ;
- observer le lien entre le code écrit et le rendu affiché par le navigateur.

## 1. Découverte de l'éditeur

Dans l'éditeur ci-dessous :

1. modifier le texte du titre ;
2. modifier le contenu du paragraphe ;
3. observer le résultat dans la partie de droite.

<WebPreview />

## 2. Défi guidé

Dans l'éditeur, transformer la page pour présenter un animal, un personnage ou un objet au choix.

La page doit contenir :

- un titre principal avec `<h1>` ;
- deux paragraphes avec `<p>` ;
- une liste à puces avec `<ul>` et `<li>` ;
- une image avec `<img>` ;
- un lien avec `<a>`.

Il est possible de partir de cet exemple :

```html
<h1>Le renard</h1>

<p>Le renard est un animal rusé que l'on retrouve souvent dans les histoires.</p>
<p>Il vit dans différents milieux et s'adapte très bien à son environnement.</p>

<h2>Ses caractéristiques</h2>
<ul>
  <li>Il est rapide</li>
  <li>Il possède une bonne ouïe</li>
  <li>Il est discret</li>
</ul>

<img src="https://placehold.co/300x180" alt="Image d'exemple">

<p>
  Pour en savoir plus :
  <a href="https://fr.wikipedia.org/wiki/Renard" target="_blank">lire la page Wikipédia</a>
</p>
```

## 3. Petit rappel

Une balise HTML s'écrit souvent avec une balise d'ouverture et une balise de fermeture.

```html
<p>Ceci est un paragraphe.</p>
```

Certaines balises, comme `<img>`, n'ont pas besoin de texte entre deux balises. On indique directement les informations dans les attributs :

```html
<img src="image.png" alt="Description de l'image">
```

## 4. À vérifier avant de terminer

Avant de valider le travail, vérifier que :

- le titre apparaît bien en grand ;
- les paragraphes sont lisibles ;
- la liste contient au moins trois éléments ;
- l'image possède un attribut `alt` ;
- le lien est cliquable.
