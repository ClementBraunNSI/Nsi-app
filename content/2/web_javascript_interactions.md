---
title: 'Interactions Web : JavaScript'
description: Rendre les pages web dynamiques et interactives avec le DOM et les événements.
level: premiere
chapter: Web et Interaction
icon: ⚡
badgeId: js_interactions
prerequisites:
  - web_html
  - web_css_introduction
---

# Interactions Web : JavaScript

## Objectifs

- Situer le rôle du JavaScript par rapport au HTML et au CSS.
- Sélectionner un élément du DOM et modifier son contenu ou son style.
- Réagir à un événement (`click`, `input`…) avec `addEventListener`.
- Réaliser un petit script interactif (compteur, miroir de saisie).

## Idée clé

Le navigateur expose la page sous forme d'arbre : le **DOM**. Le JavaScript **sélectionne** des nœuds, les **modifie**, et s'**abonne** aux événements utilisateur.

## HTML, CSS, JS

| Langage | Rôle |
| --- | --- |
| HTML | Structure |
| CSS | Apparence |
| JavaScript | Comportement dynamique |

Le JS côté client s'exécute dans le navigateur (créé en 1995 par Brendan Eich ; aujourd'hui omniprésent sur le Web).

## Syntaxe minimale

Blocs avec `{}` ; `let` (modifiable), `const` (constante).

```javascript
let score = 0;
const viesMax = 3;

function direBonjour(prenom) {
    return "Bonjour " + prenom;
}

console.log(direBonjour("Thomas"));
```

## Le DOM

### Sélectionner

```javascript
let titre = document.getElementById("mon-titre");
let bouton = document.querySelector(".btn-rouge");
```

### Modifier contenu et style

```javascript
titre.textContent = "Nouveau titre";
titre.style.color = "orange";
titre.style.fontSize = "24px"; // camelCase : backgroundColor, etc.
```

`innerHTML` interprète du HTML : à éviter avec du texte utilisateur (risque XSS). Préférer `textContent` quand c'est possible.

## Événements

```javascript
let monBouton = document.getElementById("btn-action");

monBouton.addEventListener("click", function() {
    alert("Bouton cliqué !");
});
```

| Événement | Quand |
| --- | --- |
| `click` | Clic |
| `mouseover` | Survol |
| `keydown` | Touche enfoncée |
| `input` | Champ qui change |
| `submit` | Envoi de formulaire |

Schéma mental : **sélectionner → écouter → réagir**.

## Piège fréquent

Appeler `getElementById` **avant** que le HTML existe (script trop haut dans la page) : l'élément est `null`. Placer le script en fin de `<body>`, ou écouter l'événement `DOMContentLoaded`. Autre erreur : oublier que `.value` lit un champ, pas `.textContent`.

## À retenir

- JS = interactions ; DOM = représentation de la page.
- `getElementById` / `querySelector` pour cibler.
- `textContent` et `.style` pour mettre à jour.
- `addEventListener(type, fonction)` pour réagir.
- `input` + `.value` pour suivre une saisie.
- Toujours vérifier que l'élément existe avant de l'utiliser.

## Pour s'entraîner / Suite

Entraînez-vous avec les exercices ci-dessous. Ensuite, le cours [Web et HTTP](/cours/2/web_protocoles) situe ces pages dans le modèle client-serveur.

## Exercices pratiques

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
