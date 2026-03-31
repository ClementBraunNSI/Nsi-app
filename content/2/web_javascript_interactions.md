---
title: 'Interactions Web : JavaScript'
description: Rendre les pages web dynamiques et interactives avec le DOM et les événements.
level: premiere
chapter: Web et Interaction
icon: ⚡
badgeId: js_interactions
prerequisites:
  - algo_galerie_art
---

# ⚡ Interactions Web : JavaScript

## 1. Introduction

HTML définit la **structure**, CSS définit l'**apparence**. Le **JavaScript** (JS) est le langage de programmation qui permet de rendre la page **dynamique** et **interactive**.

> **Note Historique** : Créé en 10 jours par Brendan Eich en 1995, JavaScript est aujourd'hui le langage le plus utilisé au monde pour le web (côté client et serveur).

## 2. Syntaxe de base

Contrairement au Python, la syntaxe du JavaScript utilise des accolades `{}` pour les blocs de code et des points-virgules `;` (optionnels mais recommandés) à la fin des instructions.

### Variables
On utilise `let` pour une variable modifiable et `const` pour une constante.

```javascript
let score = 0;        // Variable modifiable
const viesMax = 3;    // Constante (ne peut pas changer)
let nom = "Alice";    // Chaîne de caractères
```

### Fonctions
```javascript
function direBonjour(prenom) {
    return "Bonjour " + prenom;
}

// Appel
console.log(direBonjour("Thomas"));
```

## 3. Le DOM (Document Object Model)

Pour que le JavaScript puisse modifier la page HTML, le navigateur crée une représentation de la page sous forme d'arbre : le **DOM**.

### 🔍 Sélectionner un élément
Pour agir sur un élément HTML, il faut d'abord le "récupérer".

```javascript
// Par son ID (le plus rapide)
let titre = document.getElementById("mon-titre");

// Par sélecteur CSS (plus polyvalent)
let bouton = document.querySelector(".btn-rouge");
```

### ✏️ Modifier le contenu
```javascript
// Changer le texte
titre.textContent = "Nouveau Titre !";

// Changer le HTML (attention aux failles XSS !)
titre.innerHTML = "Titre en <em>Italique</em>";
```

### 🎨 Modifier le style
On accède aux propriétés CSS via l'objet `.style`. Notez le CamelCase (`backgroundColor` au lieu de `background-color`).

```javascript
titre.style.color = "orange";
titre.style.fontSize = "24px";
```

## 4. Les Événements

Un événement est un signal envoyé par le système : un clic, un appui sur une touche, le chargement de la page, etc.
On utilise la méthode `addEventListener` pour "écouter" ces signaux.

```javascript
let monBouton = document.getElementById("btn-action");

function reaction() {
    alert("Bouton cliqué !");
}

// Syntaxe : élément.addEventListener(type_événement, fonction_a_lancer)
monBouton.addEventListener("click", reaction);
```

### Principaux événements

| Événement | Description |
|-----------|-------------|
| `click` | Clic de souris sur l'élément |
| `mouseover` | La souris passe au-dessus de l'élément |
| `keydown` | Une touche du clavier est enfoncée |
| `submit` | Un formulaire est envoyé |
| `input` | La valeur d'un champ texte change |

## 5. Exercices Pratiques

<ExerciseTabs courseId="js_interactions" courseTitle="Le Compteur Interactif">

  <ExerciseSection id="js-compteur" label="Le Compteur">
    <Enonce>
    ### Objectif : Créer un compteur de likes
    
    Nous allons créer un bouton qui incrémente un compteur affiché à l'écran.
    
    **Code HTML fourni :**
    ```html
    <p>Likes : <span id="compteur">0</span></p>
    <button id="btn-like">J'aime 👍</button>
    ```
    
    **Consignes :**
    1.  Sélectionner l'élément `span` (le nombre) et le bouton dans des variables.
    2.  Créer une variable `nombre` initialisée à 0.
    3.  Ajouter un écouteur d'événement `click` sur le bouton.
    4.  Dans la fonction :
        *   Augmenter `nombre` de 1.
        *   Mettre à jour le texte du `span`.
        *   **Bonus** : Si le nombre dépasse 10, changer la couleur du texte en rouge.
    
    <Correction>
    ```javascript
    // 1. Sélection des éléments
    let spanCompteur = document.getElementById("compteur");
    let btnLike = document.getElementById("btn-like");
    
    // 2. Variable d'état
    let nombre = 0;
    
    // 3. Écouteur d'événement
    btnLike.addEventListener("click", function() {
        // 4. Logique
        nombre = nombre + 1;
        spanCompteur.textContent = nombre;
        
        // Bonus
        if (nombre > 10) {
            spanCompteur.style.color = "red";
        }
    });
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>
  
  <ExerciseSection id="js-input" label="Champ Miroir">
    <Enonce>
    ### Objectif : Recopier du texte en direct
    
    Créer un champ de texte qui affiche ce que l'utilisateur tape en temps réel dans un paragraphe en dessous.
    
    **Code HTML :**
    ```html
    <input type="text" id="saisie" placeholder="Tapez ici...">
    <p id="miroir"></p>
    ```
    
    **Consignes :**
    Utiliser l'événement `input` sur le champ de texte pour mettre à jour le `textContent` du paragraphe `#miroir` à chaque frappe.
    
    <Correction>
    ```javascript
    let champ = document.getElementById("saisie");
    let paragraphe = document.getElementById("miroir");
    
    champ.addEventListener("input", function() {
        // On récupère la valeur actuelle du champ avec .value
        let texte = champ.value;
        paragraphe.textContent = texte;
    });
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
