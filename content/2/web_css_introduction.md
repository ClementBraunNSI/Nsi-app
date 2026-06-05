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

Le **CSS** (Cascading Style Sheets) complète le HTML : il définit l'**apparence** (couleurs, polices, espacements, disposition) sans changer la structure du document.

## 1. Lier une feuille de style

```html
<head>
  <link rel="stylesheet" href="style.css">
</head>
```

Ou en interne pour un prototype :

```html
<style>
  h1 { color: #ea580c; }
</style>
```

## 2. Sélecteurs essentiels

| Sélecteur | Exemple | Cible |
| --- | --- | --- |
| Élément | `p { }` | Tous les paragraphes |
| Classe | `.carte { }` | `class="carte"` |
| Identifiant | `#entete { }` | `id="entete"` (unique) |

```html
<header id="entete" class="bandeau">Mon site</header>
```

```css
#entete { background: #1e293b; color: white; padding: 1rem; }
.bandeau { text-align: center; }
```

## 3. Propriétés courantes

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

## 4. Flexbox (mise en page simple)

```css
.menu {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}
```

## 5. Lien avec la suite du parcours

Après ce cours, vous pouvez enchaîner avec [Interactions JavaScript](/cours/2/web_javascript_interactions) pour rendre la page dynamique.

!!! info "Programme Première"
    Le BO attend la capacité à structurer une page (HTML) et à en contrôler la présentation (CSS), avant d'ajouter des scripts côté client.
