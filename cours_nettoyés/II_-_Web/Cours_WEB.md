---
title: "Web"
description: "L'évolution du World Wide Web et ses technologies fondamentales"
level: "Seconde"
chapter: 2
icon: "globe"
---

# Web

## 📅 L'Histoire du World Wide Web

### 1989 : Naissance du Web
Tim Berners-Lee et Robert Cailliau créent le World Wide Web au CERN en Suisse. L'objectif : permettre l'échange de données sur Internet via des hyperliens.

### 1991 : Premier Site Web
Mise en ligne de la toute première page web au CERN, expliquant le concept du World Wide Web et comment l'utiliser.

### 1993 : Web Libre
Le CERN annonce que le Web sera libre d'utilisation pour tous, sans redevances. Cette décision révolutionnaire permet l'explosion du Web.

### Aujourd'hui : Web Moderne
Plus de 1,7 milliard de sites web actifs, avec des technologies avancées permettant des applications complexes et interactives.

> **Concept Fondamental : Les Hyperliens**
>
> La technologie du Web repose sur les **hyperliens** - des liens cliquables qui permettent de naviguer entre les ressources stockées sur différents serveurs à travers le monde.

> 🔗 **Exemple d'hyperlien :** [Lien menant à l'accueil du site](../../index.md)

> 🌍 **Anecdote historique :** Découvrez la [toute première page web](http://info.cern.ch/hypertext/WWW/TheProject.html) créée par les chercheurs du CERN !

## 🔄 Le Modèle Client-Serveur

> **Architecture Fondamentale**
>
> Le Web fonctionne selon un modèle **client-serveur** où les machines communiquent selon des rôles bien définis.

### Les Rôles

*   **💻 Client** : Machine qui souhaite recevoir des informations ou des données. Correspond à la machine *réceptrice* dans les échanges TCP. Exemple : votre navigateur web.
*   **🖥️ Serveur** : Machine qui dispose d'informations et a pour rôle de les envoyer. Correspond à la machine *émettrice*. Exemple : serveur hébergeant un site web.

> **Communication par Requêtes**
>
> Les échanges entre client et serveur se font via des **requêtes** - des messages formalisés qui permettent de demander ou d'envoyer des données.

![Schéma du modèle client-serveur](img/client_serveur.png)

## 🏷️ Adresses IP et URL

> **De l'IP à l'URL**
>
> Plutôt que de retenir des adresses IP comme **216.58.214.163** pour accéder à Google, nous utilisons des **URL** (Uniform Resource Locator) - des adresses intelligibles par l'humain.

### 🧩 Structure d'une URL

📝 **Exemple d'URL décomposée**
```
https://www.google.com/search?q=exemple
│      │   │      │   │
│      │   │      │   └─ Paramètres de requête
│      │   │      └───── Chemin vers la ressource
│      │   └──────────── Nom de domaine
│      └──────────────── Sous-domaine
└─────────────────────── Protocole utilisé
```

*   **🔒 Protocole** : http:// ou https://
*   **🌍 Sous-domaine** : www (optionnel)
*   **🏠 Nom de domaine** : google, facebook, etc.
*   **🏷️ Extension** : .com, .fr, .org, etc.

> **Serveur DNS (Domain Name Server)**
>
> Le serveur DNS maintient une table de correspondance entre les adresses IP et les adresses symboliques, permettant la traduction automatique des URL en adresses IP.

### 📊 Exemple de Table DNS

| Site | Adresse symbolique | Adresse IP |
| :--- | :--- | :--- |
| Google | www.google.fr | 172.217.20.163 |
| YouTube | www.youtube.fr | 142.250.178.142 |
| Leboncoin | www.leboncoin.fr | 18.164.52.43 |
| Amazon | www.amazon.fr | 52.95.116.113 |

## 🔍 Fonctionnement du Serveur DNS

> **Résolution DNS**
>
> Le serveur DNS associe une adresse symbolique avec une adresse IP. Le processus varie selon que l'adresse est déjà connue ou non.

*   **💾 Adresse Connue (Cache)** : Si l'adresse symbolique est stockée dans le cache du navigateur, celui-ci utilise directement l'adresse IP correspondante sans interroger de serveur DNS externe.
*   **🔄 Adresse Inconnue (Récursif)** : Si l'adresse n'est pas connue, une série de requêtes récursives est lancée pour trouver le serveur DNS qui dispose de l'information recherchée.

> 💡 **Exemple pratique :** Recherche de www.google.fr → Le navigateur utilise directement l'IP **172.217.20.163** si elle est en cache.

![Processus de résolution DNS récursive](img/dns.png)

## 📝 Le Langage HTML

> **HTML (HyperText Markup Language)**
>
> Créé en **1991** par **Tim Berners-Lee** au CERN, HTML est un langage **à balises** qui structure et organise le contenu des pages web.

### 🏷️ Principe des Balises

Les balises sont des éléments entourés de crochets angulaires (`< >`) qui indiquent comment le contenu doit être interprété ou affiché. Chaque élément a une balise d'ouverture et de fermeture.

**💻 Exemple de Balise HTML**
```html
<p>Ceci est un paragraphe.</p>

<h1>Titre principal</h1>
<h2>Sous-titre</h2>

<a href="https://example.com">Lien hypertexte</a>

<img src="image.jpg" alt="Description de l'image" />
```

> ✨ **Caractéristiques clés :** Les balises ne sont pas visibles par l'utilisateur final - elles servent uniquement à structurer le document et contrôler son rendu.

> 🎯 **Usage :** HTML permet d'ajouter une signification **sémantique** aux données et de contrôler la mise en forme du contenu web.

## 📡 Protocole HTTP

> **HTTP (HyperText Transfer Protocol)**
>
> HTTP est le **protocole de communication** qui permet l'échange de données sur le Web selon un modèle client-serveur. Le client envoie des requêtes, le serveur répond avec des codes de statut et les ressources demandées.

### 🔧 Les Méthodes HTTP

*   **📥 Méthode GET** : Utilisée pour **récupérer** des informations. Ne modifie aucune donnée sur le serveur. Permet d'obtenir des pages web, images, fichiers CSS/JS, etc.

    ```http
    GET /utilisateurs/profil?id=123 HTTP/1.1
    Host: www.reseausocial.com
    User-Agent: Mozilla/5.0
    Accept-Language: fr-FR
    ```

*   **📤 Méthode POST** : Utilisée pour **envoyer** des données au serveur (formulaire, upload).
