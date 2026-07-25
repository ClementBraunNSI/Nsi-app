---
title: Le Web et HTTP
description: 'Introduction au Web, architecture client-serveur, protocole HTTP et URL.'
level: premiere
chapter: Web et Interaction
icon: "\U0001F310"
badgeId: premiere_web_protocoles
prerequisites:
  - web_javascript_interactions
---

# Le Web et HTTP

## Objectifs

- Décrire le modèle client-serveur du Web.
- Décomposer une URL et expliquer le rôle du DNS.
- Distinguer les méthodes HTTP GET et POST, et lire un code de statut.
- Situer HTTPS et, brièvement, le rôle des cookies.

## Idée clé

Le Web repose sur des échanges **requête → réponse** entre un **navigateur** (client) et un **serveur**, via le protocole **HTTP(S)**. Une **URL** nomme la ressource ; le **DNS** traduit le nom de domaine en adresse IP.

## Client, serveur, Web

Le Web (1989, CERN — Tim Berners-Lee et Robert Cailliau) permet d'accéder à des ressources via des **hyperliens**.

1. L'utilisateur saisit une URL ou clique un lien.
2. Le client envoie une **requête** au serveur.
3. Le serveur renvoie une **réponse** (page, image, erreur…).
4. Le navigateur affiche le résultat.

!!! tip "Première page web"
    Toujours accessible : [http://info.cern.ch/hypertext/WWW/TheProject.html](http://info.cern.ch/hypertext/WWW/TheProject.html)

## URL et DNS

Une **URL** localise une ressource :

```
https://www.example.com/dossier/page.html
```

<UrlBuilder />

| Partie | Exemple | Rôle |
| --- | --- | --- |
| Protocole | `https://` | Comment communiquer |
| Domaine | `www.example.com` | Quel serveur (nom lisible) |
| Chemin | `/dossier/page.html` | Quelle ressource sur le serveur |

Le **DNS** convertit le nom (`www.example.com`) en **adresse IP**. Sans DNS, il faudrait mémoriser des IP.

<DnsResolver />

## Requête et réponse HTTP

**HTTP** définit le format des messages. Chaque message a une ligne de départ, des **en-têtes**, et parfois un **corps**.

### Méthodes : GET et POST

| Méthode | Usage | Données |
| --- | --- | --- |
| **GET** | Lire / demander une ressource | Souvent dans l'URL (`?id=123`) — ne doit pas modifier l'état du serveur |
| **POST** | Envoyer des données (formulaire, création) | Dans le **corps** de la requête |

<HttpMethodVisualizer />

```http
GET /utilisateurs/profil?id=123 HTTP/1.1
Host: www.example.com
```

```http
POST /utilisateurs/inscription HTTP/1.1
Host: www.example.com
Content-Type: application/x-www-form-urlencoded

nom=Dupont&prenom=Jean
```

### Codes de statut

Le serveur répond avec un **code** à 3 chiffres :

| Famille | Sens | Exemples à connaître |
| --- | --- | --- |
| **2xx** | Succès | `200 OK`, `201 Created` |
| **3xx** | Redirection | `301` (déplacé), `304` (non modifié) |
| **4xx** | Erreur **client** | `404 Not Found`, `403 Forbidden` |
| **5xx** | Erreur **serveur** | `500 Internal Server Error` |

Mnemonic : **4** = « c'est de ta faute (client) », **5** = « c'est la mienne (serveur) ».

## HTTPS

**HTTPS** = HTTP + chiffrement **TLS**. Avantages : confidentialité, intégrité, authentification du serveur (certificat).

<HttpsSimulator />

## Pages statiques et dynamiques

| | Statique | Dynamique |
| --- | --- | --- |
| Contenu | Identique pour tous | Généré / personnalisé |
| Serveur | Fichiers servis tels quels | Traitement (base, session…) |

## Cookies (bref)

Un **cookie** est un petit texte stocké par le navigateur, renvoyé ensuite au site (session, préférences…). Les cookies de session disparaissent à la fermeture ; les persistants ont une date d'expiration. Attention au suivi (cookies tiers).

<CookieManager />

## Piège fréquent

Croire que **GET** « cache » les données : elles sont dans l'URL (historique, logs). Pour un mot de passe ou un formulaire sensible, utiliser **POST** (et HTTPS). Autre confusion : un **404** est une erreur client (mauvaise URL), pas une panne serveur.

## À retenir

- Client (navigateur) ↔ serveur : requête / réponse.
- URL = protocole + domaine + chemin ; DNS = nom → IP.
- GET = obtenir ; POST = envoyer des données dans le corps.
- Codes : 2xx OK, 4xx client, 5xx serveur.
- HTTPS protège l'échange (TLS).
- Cookie = petite mémoire côté navigateur (à utiliser avec parcimonie).

## Pour s'entraîner / Suite

Manipulez les interactifs (URL, DNS, méthodes, HTTPS, cookies). Reliez ce cours au modèle TCP/IP : HTTP est un protocole de la **couche application**.
