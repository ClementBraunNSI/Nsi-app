---
title: Le Web et HTTP
description: Introduction au Web, architecture client-serveur, protocole HTTP et URL.
level: Première
chapter: 10
icon: globe
---

# Le Web et HTTP

## Historique et définitions

### Naissance du Web
Le **Web** (World Wide Web) a été créé en 1989 au CERN (Centre Européen pour la Recherche Nucléaire) par une équipe dirigée par **Tim Berners-Lee** et **Robert Cailliau**. L'objectif initial était de développer une application permettant l'échange de données scientifiques sur Internet.

!!! info "Les hyperliens"
    La technologie du Web repose sur l'utilisation d'**hyperliens**, qui sont des liens cliquables permettant de naviguer entre différentes ressources. Ces hyperliens permettent d'accéder à des données stockées sur des **serveurs**, comme des pages web, des images ou tout autre type de contenu.

!!! tip "Anecdote"
    La toute première page web, créée par Tim Berners-Lee, est toujours accessible à l'adresse : [http://info.cern.ch/hypertext/WWW/TheProject.html](http://info.cern.ch/hypertext/WWW/TheProject.html)

## Architecture client-serveur

### Le modèle client-serveur
Le Web fonctionne selon un modèle **client-serveur** :

*   Le **client** est généralement un navigateur web (Chrome, Firefox, Safari, etc.) qui envoie des requêtes pour obtenir des ressources.
*   Le **serveur** est un ordinateur qui héberge les ressources web et répond aux requêtes des clients.

### Processus de communication
Le processus de communication se déroule ainsi :
1.  L'utilisateur saisit une URL ou clique sur un lien dans son navigateur (client).
2.  Le client envoie une requête au serveur approprié.
3.  Le serveur traite la requête et renvoie une réponse.
4.  Le client (navigateur) interprète la réponse et affiche le contenu à l'utilisateur.

## Les URL et le système DNS

### Qu'est-ce qu'une URL ?
Une **URL** (Uniform Resource Locator) est l'adresse qui permet de localiser une ressource sur le Web.

Structure d'une URL :
```
protocole://sous-domaine.nom-de-domaine.extension/chemin/ressource

Exemple : https://www.example.com/dossier/page.html
```

**Composants d'une URL :**
*   **Protocole** : `https://` (indique le protocole de communication utilisé)
*   **Sous-domaine** : `www` (subdivision du domaine principal)
*   **Nom de domaine** : `example` (nom unique identifiant le site)
*   **Extension** : `.com` (catégorie du domaine)
*   **Chemin** : `/dossier/page.html` (localisation de la ressource sur le serveur)

### Le système DNS
Le système **DNS** (Domain Name System) est un service qui traduit les noms de domaine en adresses IP. Sans DNS, nous devrions mémoriser les adresses IP de chaque site web (par exemple, 172.217.20.163 pour Google).

**Processus de résolution DNS :**
1.  Le navigateur vérifie d'abord son cache local pour voir s'il connaît déjà l'adresse IP correspondante.
2.  Si non, une requête DNS est envoyée à un serveur DNS.
3.  Le serveur DNS renvoie l'adresse IP correspondante.
4.  Le navigateur peut alors établir une connexion avec le serveur web à cette adresse IP.

## Le protocole HTTP

### Qu'est-ce que HTTP ?
**HTTP** (HyperText Transfer Protocol) est le protocole de communication utilisé pour échanger des informations sur le Web. Il définit comment les messages sont formatés et transmis entre clients et serveurs.

HTTP fonctionne selon un principe de **requête-réponse** :
1.  Le client envoie une **requête HTTP** au serveur.
2.  Le serveur traite la requête et renvoie une **réponse HTTP**.

Chaque requête et réponse HTTP contient :
*   Une **ligne de départ** (méthode, URL, version pour les requêtes ; version, code d'état pour les réponses).
*   Des **en-têtes** (headers) contenant des métadonnées.
*   Un **corps** (body) optionnel contenant les données.

### Les méthodes HTTP

| Méthode | Description | Exemple |
| :--- | :--- | :--- |
| **GET** | Demande une ressource au serveur (sans modifier les données). | `GET /page.html` |
| **POST** | Envoie des données au serveur (pour créer ou modifier une ressource). | `POST /formulaire` |

Exemple de requête GET :
```http
GET /utilisateurs/profil?id=123 HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept-Language: fr-FR
```

Exemple de requête POST :
```http
POST /utilisateurs/inscription HTTP/1.1
Host: www.example.com
Content-Type: application/x-www-form-urlencoded
Content-Length: 54

nom=Dupont&prenom=Jean&email=jean.dupont@email.com
```

## Les codes de statut HTTP

Les réponses HTTP contiennent un code de statut qui indique le résultat du traitement de la requête.

| Code | Catégorie | Exemples |
| :--- | :--- | :--- |
| **1xx** | Information | La requête a été reçue et le processus continue. |
| **2xx** | Succès | `200 OK` (Réussite), `201 Created` (Ressource créée). |
| **3xx** | Redirection | `301 Moved Permanently` (Déplacé), `304 Not Modified` (Non modifié). |
| **4xx** | Erreur client | `400 Bad Request` (Requête mal formée), `404 Not Found` (Ressource introuvable), `403 Forbidden` (Interdit). |
| **5xx** | Erreur serveur | `500 Internal Server Error` (Erreur interne), `503 Service Unavailable` (Service indisponible). |

## HTTP et sécurité : HTTPS

**HTTPS** (HTTP Secure) est une version sécurisée du protocole HTTP qui utilise le chiffrement SSL/TLS pour protéger les communications entre le client et le serveur.

**Avantages de HTTPS :**
*   **Confidentialité** : Les données échangées sont chiffrées et ne peuvent pas être lues par des tiers.
*   **Intégrité** : Garantit que les données n'ont pas été modifiées pendant la transmission.
*   **Authentification** : Vérifie l'identité du serveur auquel le client se connecte.

!!! note "Certificats SSL/TLS"
    Le fonctionnement de HTTPS repose sur des certificats numériques délivrés par des autorités de certification (CA) qui attestent de l'identité du site web.

## Pages Web statiques et dynamiques

| Type | Description | Caractéristiques |
| :--- | :--- | :--- |
| **Statique** | Contenu fixe et identique pour tous les utilisateurs. | • Pas de traitement serveur<br>• Chargement rapide<br>• Facile à mettre en cache |
| **Dynamique** | Générée à la volée, contenu personnalisé. | • Traitement côté serveur<br>• Interactions complexes<br>• Gestion de contenu/utilisateurs |

## Cookies et sessions

Les **cookies** sont de petits fichiers texte stockés par le navigateur sur l'ordinateur de l'utilisateur. Ils permettent aux sites web de stocker des informations sur l'utilisateur et de les récupérer lors de visites ultérieures.

**Types de cookies :**
*   **Cookies de session** : Supprimés à la fermeture du navigateur.
*   **Cookies persistants** : Conservés jusqu'à une date d'expiration spécifiée.
*   **Cookies first-party** : Créés par le site visité.
*   **Cookies third-party** : Créés par des domaines autres que celui visité (souvent pour le suivi publicitaire).
