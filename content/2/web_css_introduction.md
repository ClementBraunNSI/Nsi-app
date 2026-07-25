---
title: Introduction au CSS
description: Mise en forme des pages web — sélecteurs, couleurs et mise en page de base.
level: premiere
chapter: Web et Interaction
icon: "🎨"
badgeId: premiere_css_intro
prerequisites:
  - web_html
order: 25
---

# Introduction au CSS

## Objectifs

- Lier une feuille de style à une page HTML.
- Cibler des éléments avec les sélecteurs de base (élément, classe, id).
- Appliquer couleurs, polices, marges et une mise en page simple (Flexbox).
- Comprendre en une phrase la cascade et le modèle de boîte.

## Idée clé

Le **CSS** (Cascading Style Sheets) contrôle l'**apparence** : couleurs, polices, espacements, disposition. Le HTML reste la structure ; le CSS la habille.

## Lier le CSS

Feuille externe (recommandé) :

```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

Ou, pour un prototype, un bloc interne :

```html
<style>
  h1 { color: #ea580c; }
</style>
```

## Sélecteurs essentiels

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

**Cascade (en une phrase)** : si plusieurs règles s'appliquent, le navigateur combine les propriétés ; en cas de conflit, la règle la plus **spécifique** (ou la dernière écrite) l'emporte.

## Propriétés courantes

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

## Modèle de boîte (bref)

Chaque élément est une **boîte** avec, de l'intérieur vers l'extérieur :

**contenu** → `padding` (remplissage) → `border` (bordure) → `margin` (marge extérieure).

`width` / `height` concernent le contenu (sauf si `box-sizing: border-box`, qui inclut padding et border dans la largeur — pratique en mise en page).

## Flexbox (mise en page simple)

```css
.menu {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
```

`display: flex` aligne les enfants sur une ligne (ou une colonne) ; `gap`, `justify-content` et `flex-wrap` gèrent l'espace et le retour à la ligne.

## Piège fréquent

Mettre trop de styles en ligne (`style="..."`) ou utiliser un `id` là où une **classe** suffirait (réutilisation). Autre classique : oublier que `margin` pousse **à l'extérieur** et `padding` **à l'intérieur**.

## À retenir

- CSS = présentation ; HTML = structure.
- Lier via `<link rel="stylesheet" href="…">`.
- Sélecteurs : élément, `.classe`, `#id`.
- Cascade : spécificité + ordre décident en cas de conflit.
- Boîte = contenu + padding + border + margin.
- Flexbox facilite les alignements simples.

## Pour s'entraîner / Suite

Appliquez une feuille de style à une page HTML déjà structurée, puis enchaînez avec [Interactions JavaScript](/cours/2/web_javascript_interactions) pour rendre la page dynamique.

!!! info "Programme Première"
    Le BO attend la capacité à structurer une page (HTML) et à en contrôler la présentation (CSS), avant d'ajouter des scripts côté client.
