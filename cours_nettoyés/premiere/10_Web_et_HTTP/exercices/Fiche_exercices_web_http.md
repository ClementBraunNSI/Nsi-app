---
title: Fiche d'exercices - Web et HTTP
description: Exercices sur le protocole HTTP, les URLs, le HTML, le CSS et JavaScript.
level: Première
chapter: 10
icon: edit
---

# Fiche d'exercices : Web et HTTP

## Partie 1 : Protocole HTTP et URLs

### Exercice 1 - Anatomie d'une URL
**Analysez cette URL et identifiez ses composants :**

`https://www.example.com:8080/path/to/page?param1=value1&param2=value2#section`

Identifiez :
1.  Le protocole
2.  Le nom de domaine
3.  Le port
4.  Le chemin
5.  Les paramètres de requête
6.  L'ancre (fragment)

??? tip "Correction"
    **Composants de l'URL :**
    1.  **Protocole :** `https`
    2.  **Nom de domaine :** `www.example.com`
    3.  **Port :** `8080`
    4.  **Chemin :** `/path/to/page`
    5.  **Paramètres :** `param1=value1&param2=value2`
    6.  **Ancre :** `section`

### Exercice 2 - Méthodes HTTP
**Associez chaque méthode HTTP à son usage :**

**Méthodes :** GET, POST, PUT, DELETE, HEAD, PATCH

**Usages :**
1.  Récupérer des données sans les modifier
2.  Envoyer des données pour créer une ressource
3.  Remplacer complètement une ressource
4.  Supprimer une ressource
5.  Récupérer seulement les en-têtes
6.  Modifier partiellement une ressource

??? tip "Correction"
    **Associations :**
    *   GET → 1. Récupérer des données sans les modifier
    *   POST → 2. Envoyer des données pour créer une ressource
    *   PUT → 3. Remplacer complètement une ressource
    *   DELETE → 4. Supprimer une ressource
    *   HEAD → 5. Récupérer seulement les en-têtes
    *   PATCH → 6. Modifier partiellement une ressource

### Exercice 3 - Codes de statut HTTP
**Expliquez la signification de ces codes de statut :**
1.  200
2.  301
3.  404
4.  401
5.  500
6.  403
7.  302
8.  418

??? tip "Correction"
    **Significations :**
    1.  **200 OK :** Requête réussie
    2.  **301 Moved Permanently :** Redirection permanente
    3.  **404 Not Found :** Ressource non trouvée
    4.  **401 Unauthorized :** Authentification requise
    5.  **500 Internal Server Error :** Erreur serveur
    6.  **403 Forbidden :** Accès interdit
    7.  **302 Found :** Redirection temporaire
    8.  **418 I'm a teapot :** Code humoristique (RFC 2324)

### Exercice 4 - En-têtes HTTP
**Analysez cette requête HTTP et répondez aux questions :**

```http
GET /api/users HTTP/1.1
Host: api.example.com
User-Agent: Mozilla/5.0
Accept: application/json
Authorization: Bearer abc123
Content-Type: application/json
```

1.  Quelle est la méthode utilisée ?
2.  Quel type de contenu est accepté ?
3.  Comment l'utilisateur s'authentifie-t-il ?
4.  Y a-t-il une erreur dans cette requête ?

??? tip "Correction"
    **Analyse :**
    1.  **Méthode :** GET
    2.  **Type accepté :** application/json
    3.  **Authentification :** Bearer token (abc123)
    4.  **Erreur :** `Content-Type` ne devrait pas être présent dans une requête GET (pas de corps)

### Exercice 5 - Session et cookies
**Analysez cet échange HTTP et expliquez le mécanisme :**

**Requête 1 :**
```http
POST /login HTTP/1.1
Content-Type: application/x-www-form-urlencoded

username=alice&password=secret
```

**Réponse 1 :**
```http
HTTP/1.1 200 OK
Set-Cookie: sessionid=xyz789; HttpOnly; Secure
Location: /dashboard
```

**Requête 2 :**
```http
GET /dashboard HTTP/1.1
Cookie: sessionid=xyz789
```

1.  Que se passe-t-il dans la première requête ?
2.  Que fait le serveur avec Set-Cookie ?
3.  Pourquoi HttpOnly et Secure sont-ils importants ?
4.  Comment le client prouve-t-il son identité dans la requête 2 ?

??? tip "Correction"
    **Analyse du mécanisme :**
    1.  **Requête 1 :** L'utilisateur envoie ses identifiants de connexion.
    2.  **Set-Cookie :** Le serveur crée une session et envoie un identifiant de session.
    3.  **Sécurité :**
        *   `HttpOnly` : empêche l'accès JavaScript (protection XSS).
        *   `Secure` : transmission uniquement en HTTPS.
    4.  **Requête 2 :** Le client renvoie automatiquement le cookie pour prouver son identité.

## Partie 2 : HTML et CSS

### Exercice 6 - Structure HTML
**Corrigez ce code HTML qui contient des erreurs :**

```html
<html>
<head>
    <title>Ma page
</head>
<body>
    <h1>Titre principal</h1>
    <p>Un paragraphe avec <b>du texte en gras</p>
    <img src="image.jpg">
    <ul>
        <li>Item 1
        <li>Item 2</li>
    </ul>
</body>
```

??? tip "Correction"
    **Code corrigé :**
    ```html
    <!DOCTYPE html>
    <html>
    <head>
        <title>Ma page</title>
    </head>
    <body>
        <h1>Titre principal</h1>
        <p>Un paragraphe avec <b>du texte en gras</b></p>
        <img src="image.jpg" alt="Description">
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
        </ul>
    </body>
    </html>
    ```

    **Erreurs corrigées :**
    *   Ajout du DOCTYPE.
    *   Fermeture de la balise title.
    *   Fermeture de la balise b.
    *   Fermeture de la balise p.
    *   Ajout de l'attribut alt à img.
    *   Fermeture de la première balise li.
    *   Fermeture de la balise html.

### Exercice 7 - Sélecteurs CSS
**Écrivez les sélecteurs CSS pour :**
1.  Tous les paragraphes
2.  L'élément avec l'id "header"
3.  Tous les éléments avec la classe "highlight"
4.  Les liens dans les listes
5.  Le premier paragraphe de chaque article
6.  Les éléments survolés par la souris

??? tip "Correction"
    **Sélecteurs CSS :**
    1.  `p`
    2.  `#header`
    3.  `.highlight`
    4.  `li a` ou `ul a`
    5.  `article p:first-child`
    6.  `:hover`

### Exercice 8 - Responsive Design
**Créez un CSS responsive pour cette structure :**

```html
<div class="container">
    <div class="sidebar">Menu</div>
    <div class="content">Contenu principal</div>
</div>
```

**Contraintes :**
*   Desktop : sidebar 25%, content 75%
*   Tablet : sidebar 30%, content 70%
*   Mobile : sidebar au-dessus, pleine largeur

??? tip "Correction"
    **CSS Responsive :**
    ```css
    .container {
        display: flex;
    }

    .sidebar {
        width: 25%;
        background: #f0f0f0;
    }

    .content {
        width: 75%;
        padding: 1rem;
    }

    /* Tablet */
    @media (max-width: 768px) {
        .sidebar {
            width: 30%;
        }
        .content {
            width: 70%;
        }
    }

    /* Mobile */
    @media (max-width: 480px) {
        .container {
            flex-direction: column;
        }
        .sidebar, .content {
            width: 100%;
        }
    }
    ```

## Partie 3 : JavaScript et interactivité

### Exercice 9 - Manipulation du DOM
**Écrivez le JavaScript pour :**
1.  Changer le texte d'un élément avec l'id "title"
2.  Ajouter la classe "active" à tous les boutons
3.  Créer un nouvel élément `<p>` et l'ajouter au body
4.  Supprimer tous les éléments avec la classe "temp"

??? tip "Correction"
    **Code JavaScript :**
    ```javascript
    // 1. Changer le texte
    document.getElementById('title').textContent = 'Nouveau titre';

    // 2. Ajouter une classe à tous les boutons
    document.querySelectorAll('button').forEach(btn => {
        btn.classList.add('active');
    });

    // 3. Créer et ajouter un paragraphe
    const p = document.createElement('p');
    p.textContent = 'Nouveau paragraphe';
    document.body.appendChild(p);

    // 4. Supprimer les éléments temporaires
    document.querySelectorAll('.temp').forEach(el => {
        el.remove();
    });
    ```

### Exercice 10 - Requêtes AJAX
**Créez une fonction qui :**
1.  Fait une requête GET vers "/api/users"
2.  Affiche les données dans une liste HTML
3.  Gère les erreurs de réseau
4.  Affiche un indicateur de chargement

??? tip "Correction"
    **Fonction AJAX complète :**
    ```javascript
    async function loadUsers() {
        const loadingEl = document.getElementById('loading');
        const usersList = document.getElementById('users-list');
        const errorEl = document.getElementById('error');
        
        try {
            // Afficher le chargement
            loadingEl.style.display = 'block';
            errorEl.style.display = 'none';
            
            // Faire la requête
            const response = await fetch('/api/users');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const users = await response.json();
            
            // Afficher les utilisateurs
            usersList.innerHTML = '';
            users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.name;
                usersList.appendChild(li);
            });
            
        } catch (error) {
            // Gérer les erreurs
            errorEl.textContent = 'Erreur: ' + error.message;
            errorEl.style.display = 'block';
        } finally {
            // Cacher le chargement
            loadingEl.style.display = 'none';
        }
    }
    ```
