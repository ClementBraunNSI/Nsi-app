---
title: 'Interactions Web : JavaScript'
description: Rendre les pages web dynamiques et interactives avec le DOM et les événements.
level: premiere
chapter: Web et Interaction
icon: "zap"
badgeId: js_interactions
prerequisites:
  - web_html
  - web_css_introduction
audience: public
---

# Interactions Web : JavaScript

Le HTML a décrit la page, le CSS l'a habillée. Rien ne se passe encore quand on clique. Le **JavaScript** est le troisième langage : il s'exécute dans le navigateur et change la page pendant qu'on la regarde. Brendan Eich l'a créé en 1995. Il est aujourd'hui le langage du comportement, côté client.

Le navigateur ne garde pas le HTML comme un simple texte. Il le transforme en arbre, le **DOM** (*Document Object Model*). Chaque balise devient un nœud. Un script **sélectionne** un nœud, le **modifie**, et s'**abonne** aux gestes de la personne : clic, frappe, envoi d'un formulaire.

| Langage | Rôle |
| --- | --- |
| HTML | Structure |
| CSS | Apparence |
| JavaScript | Comportement dynamique |

## Une syntaxe courte

Les blocs s'écrivent entre accolades. `let` déclare une variable qu'on pourra réaffecter. `const` déclare un nom qu'on ne réaffecte pas. Une fonction se déclare avec `function`, et `return` renvoie une valeur, comme en Python. `console.log` écrit dans la console du navigateur, pas sur la page.

```javascript
let score = 0;
const viesMax = 3;

function direBonjour(prenom) {
    return "Bonjour " + prenom;
}

console.log(direBonjour("Thomas"));
```

`+` entre chaînes concatène. `score` pourra passer à 1. `viesMax` reste 3 : si le code tente de le réaffecter, le navigateur refuse.

## Trouver un nœud, puis le changer

`document` est la page. `getElementById` cherche l'élément dont l'`id` est celui qu'on donne. `querySelector` cherche avec un sélecteur CSS : `.btn-rouge` est une classe, `#mon-titre` serait un id.

```javascript
let titre = document.getElementById("mon-titre");
let bouton = document.querySelector(".btn-rouge");
```

Une fois le nœud en main, `textContent` remplace le texte. `style` change une propriété CSS. En JavaScript, les noms de propriétés passent en *camelCase* : `font-size` devient `fontSize`, `background-color` devient `backgroundColor`.

```javascript
titre.textContent = "Nouveau titre";
titre.style.color = "orange";
titre.style.fontSize = "24px"; // camelCase : backgroundColor, etc.
```

`innerHTML` interprète du HTML. C'est utile pour insérer une balise, et dangereux avec du texte tapé par quelqu'un : une balise `<script>` glissée dans le texte s'exécuterait. C'est une faille XSS. Quand on affiche du texte, on prend `textContent`.

Si `getElementById` ne trouve rien, il renvoie `null`. Appeler `.textContent` sur `null` plante. Cela arrive quand le script est dans le `<head>` et s'exécute avant que le `<body>` existe. On place le script en fin de `<body>`, ou l'on attend l'événement `DOMContentLoaded`. Autre confusion : le texte d'un champ de saisie se lit avec `.value`, pas avec `.textContent`.

## Réagir à un geste

`addEventListener` abonne une fonction à un type d'événement. La fonction ne s'exécute pas tout de suite. Elle s'exécute quand l'événement arrive.

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

Le geste tient en trois temps : **sélectionner**, **écouter**, **réagir**. On vérifie que l'élément existe avant de lui poser un écouteur. `input` sert à suivre une saisie lettre par lettre. `submit` sert au moment où le formulaire part.

En résumé, JavaScript s'occupe du comportement, le DOM est l'arbre de la page. `getElementById` et `querySelector` ciblent. `textContent` et `.style` mettent à jour. `addEventListener` réagit. `.value` lit un champ. On n'utilise un nœud qu'une fois certain qu'il est là.

## Pour s'entraîner / Suite

S'entraîner avec les exercices ci-dessous. Ensuite, le cours [Web et HTTP](/cours/2/web_protocoles) situe ces pages dans le modèle client-serveur.

## Exercices pratiques

<ExerciseTabs courseId="js_interactions" courseTitle="Le Compteur Interactif">

  <ExerciseSection id="js-compteur" label="Le Compteur" type="autre">
    <Enonce>
    ### Objectif : Créer un compteur de likes
    
    Créer un bouton qui incrémente un compteur affiché à l'écran.
    
    **Code HTML fourni :**
    ```html
    <p>Likes : <span id="compteur">0</span></p>
    <button id="btn-like">J'aime </button>
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
  
  <ExerciseSection id="js-input" label="Champ Miroir" type="autre">
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
