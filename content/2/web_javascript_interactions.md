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

Le HTML décrit la page et le CSS la met en forme, mais rien ne se passe encore quand on clique. Le **JavaScript**, créé par Brendan Eich en 1995, est le troisième langage du Web : il s'exécute dans le navigateur et modifie la page pendant qu'on la consulte. C'est aujourd'hui le langage qui gère le comportement des pages côté client.

Le navigateur ne garde pas le HTML sous forme de texte : il le transforme en un arbre, le **DOM** (*Document Object Model*), dans lequel chaque balise devient un nœud. Un script peut **sélectionner** un nœud, le **modifier**, et **réagir** aux actions de l'utilisateur, comme un clic, une frappe au clavier ou l'envoi d'un formulaire.

| Langage | Rôle |
| --- | --- |
| HTML | Structure |
| CSS | Apparence |
| JavaScript | Comportement dynamique |

## Les bases de la syntaxe

Les blocs s'écrivent entre accolades. `let` déclare une variable qu'on pourra réaffecter. `const` déclare un nom qu'on ne réaffecte pas. Une fonction se déclare avec `function`, et `return` renvoie une valeur, comme en Python. `console.log` écrit dans la console du navigateur, pas sur la page.

```javascript
let score = 0;
const viesMax = 3;

function direBonjour(prenom) {
    return "Bonjour " + prenom;
}

console.log(direBonjour("Thomas"));
```

Entre deux chaînes, `+` concatène. `score` pourra ensuite passer à 1, alors que `viesMax` restera égal à 3 : si le code tente de le réaffecter, le navigateur signale une erreur.

## Sélectionner et modifier un élément

`document` représente la page. `getElementById` cherche l'élément qui a l'`id` indiqué, et `querySelector` cherche à partir d'un sélecteur CSS : `.btn-rouge` désigne une classe, et `#mon-titre` désignerait un id.

```javascript
let titre = document.getElementById("mon-titre");
let bouton = document.querySelector(".btn-rouge");
```

Une fois l'élément sélectionné, `textContent` permet de remplacer son texte et `style` de changer une propriété CSS. En JavaScript, les noms de propriétés passent en *camelCase* : `font-size` devient `fontSize`, `background-color` devient `backgroundColor`.

```javascript
titre.textContent = "Nouveau titre";
titre.style.color = "orange";
titre.style.fontSize = "24px"; // camelCase : backgroundColor, etc.
```

`innerHTML` interprète du HTML. C'est utile pour insérer une balise, mais dangereux avec un texte saisi par un utilisateur, car une balise `<script>` glissée dans ce texte serait exécutée : c'est une faille XSS. Pour afficher du texte, il faut donc utiliser `textContent`.

Si `getElementById` ne trouve rien, il renvoie `null`, et utiliser `.textContent` sur `null` provoque une erreur. Cela arrive quand le script, placé dans le `<head>`, s'exécute avant que le `<body>` existe. Il faut alors placer le script à la fin du `<body>`, ou attendre l'événement `DOMContentLoaded`. Attention aussi : le texte d'un champ de saisie se lit avec `.value`, et non avec `.textContent`.

## Réagir aux événements

`addEventListener` associe une fonction à un type d'événement. Cette fonction ne s'exécute pas tout de suite, mais seulement quand l'événement se produit.

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

La démarche se déroule en trois temps : **sélectionner** l'élément, **écouter** un événement, puis **réagir**. Avant d'ajouter un écouteur, il faut vérifier que l'élément existe. L'événement `input` permet de suivre une saisie lettre par lettre, et `submit` de réagir à l'envoi d'un formulaire.

En résumé, JavaScript gère le comportement de la page, et le DOM est l'arbre qui la représente. `getElementById` et `querySelector` permettent de sélectionner un élément, `textContent` et `.style` de le modifier, et `addEventListener` de réagir à un événement. `.value` lit le contenu d'un champ. Enfin, on n'utilise un élément qu'après avoir vérifié qu'il existe.

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
