---
title: "Web"
description: "L'évolution du World Wide Web et ses technologies fondamentales : Client-Serveur, HTTP, HTML et DNS."
level: "2"
chapter: "Web"
icon: "🌐"
---

# 🌐 Web
> L'évolution du World Wide Web et ses technologies fondamentales

## 📅 L'Histoire du World Wide Web

### 1989 : Naissance du Web
Tim Berners-Lee et Robert Cailliau créent le World Wide Web au CERN en Suisse. L'objectif : permettre l'échange de données sur Internet via des hyperliens.

### 1991 : Premier Site Web
Mise en ligne de la toute première page web au CERN, expliquant le concept du World Wide Web et comment l'utiliser.

### 1993 : Web Libre
Le CERN annonce que le Web sera libre d'utilisation pour tous, sans redevances. Cette décision révolutionnaire permet l'explosion du Web.

### Aujourd'hui : Web Moderne
Plus de 1,7 milliard de sites web actifs, avec des technologies avancées permettant des applications complexes et interactives.

### 📜 L'Évolution : Du Web 1.0 au Web 2.0

- **Web 1.0 (1990-2000)** : Le Web "statique". On ne pouvait que *lire* des informations (comme un journal en ligne).
- **Web 2.0 (2000-présent)** : Le Web "participatif". L'utilisateur devient acteur : il publie, commente, partage (Réseaux sociaux, Blogs, Wikis).

> **⚔️ La Guerre des Navigateurs**
>
> Dans les années 90, deux logiciels se sont battus pour dominer le marché : **Netscape** et **Internet Explorer**. C'est Microsoft qui a gagné cette première bataille, avant d'être détrôné plus tard par **Google Chrome**.

> **🎯 Concept Fondamental : Les Hyperliens**
>
> La technologie du Web repose sur les **hyperliens** - des liens cliquables qui permettent de naviguer entre les ressources stockées sur différents serveurs à travers le monde.

> 🔗 **Exemple d'hyperlien :** [Lien menant à l'accueil du site](../../index.md)

> 🌍 **Anecdote historique :** Découvrez la [toute première page web](http://info.cern.ch/hypertext/WWW/TheProject.html) créée par les chercheurs du CERN !

## 🔄 Le Modèle Client-Serveur

> **🎯 Architecture Fondamentale**
>
> Le Web fonctionne selon un modèle **client-serveur** où les machines communiquent selon des rôles bien définis.

### 💻 Client
Machine qui souhaite recevoir des informations ou des données. Correspond à la machine *réceptrice* dans les échanges TCP. Exemple : votre navigateur web.

### 🖥️ Serveur
Machine qui dispose d'informations et a pour rôle de les envoyer. Correspond à la machine *émettrice*. Exemple : serveur hébergeant un site web.

> **📡 Communication par Requêtes**
>
> Les échanges entre client et serveur se font via des **requêtes** - des messages formalisés qui permettent de demander ou d'envoyer des données.

![Schéma du modèle client-serveur](/content/1/client_serveur.png)

## 🏷️ Adresses IP et URL

> **🌐 De l'IP à l'URL**
>
> Plutôt que de retenir des adresses IP comme **216.58.214.163** pour accéder à Google, nous utilisons des **URL** (Uniform Resource Locator) - des adresses intelligibles par l'humain.

### 🧩 Structure d'une URL

<UrlBuilder />

> **🗂️ Serveur DNS (Domain Name Server)**
>
> Le serveur DNS maintient une table de correspondance entre les adresses IP et les adresses symboliques, permettant la traduction automatique des URL en adresses IP.

### 📊 Exemple de Table DNS

| Site | Adresse symbolique | Adresse IP |
|------|-------------------|------------|
| Google | www.google.fr | 172.217.20.163 |
| YouTube | www.youtube.fr | 142.250.178.142 |
| Leboncoin | www.leboncoin.fr | 18.164.52.43 |
| Amazon | www.amazon.fr | 52.95.116.113 |

## 🔍 Fonctionnement du Serveur DNS

> **🎯 Résolution DNS**
>
> Le serveur DNS associe une adresse symbolique avec une adresse IP. Le processus varie selon que l'adresse est déjà connue ou non.

### 💾 Adresse Connue (Cache)
Si l'adresse symbolique est stockée dans le cache du navigateur, celui-ci utilise directement l'adresse IP correspondante sans interroger de serveur DNS externe.

### 🔄 Adresse Inconnue (Récursif)
Si l'adresse n'est pas connue, une série de requêtes récursives est lancée pour trouver le serveur DNS qui dispose de l'information recherchée.

> 💡 **Exemple pratique :** Recherche de www.google.fr → Le navigateur utilise directement l'IP **172.217.20.163** si elle est en cache.

<DnsResolver />

## 📝 Le Langage HTML

> **🎯 HTML (HyperText Markup Language)**
>
> Créé en **1991** par **Tim Berners-Lee** au CERN, HTML est un langage **à balises** qui structure et organise le contenu des pages web.

### 🏷️ Principe des Balises
Les balises sont des éléments entourés de crochets angulaires (`< >`) qui indiquent comment le contenu doit être interprété ou affiché. Chaque élément a une balise d'ouverture et de fermeture.

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

> **🎯 HTTP (HyperText Transfer Protocol)**
>
> HTTP est le **protocole de communication** qui permet l'échange de données sur le Web selon un modèle client-serveur. Le client envoie des requêtes, le serveur répond avec des codes de statut et les ressources demandées.

### 🔧 Les Méthodes HTTP

#### 📥 Méthode GET vs 📤 Méthode POST

<HttpMethodVisualizer />

### 📊 Codes de Statut HTTP

- **200 OK** : La requête a réussi
- **404 Not Found** : La ressource demandée n'existe pas
- **500 Internal Server Error** : Problème côté serveur

> 🔄 **Usage courant :** Ces méthodes sont utilisées lors de l'envoi de formulaires ou de l'initialisation de pages par le navigateur.

## 🏆 L'Algorithme PageRank

> **🎯 Révolution de la Recherche Web**
>
> Développé par **Larry Page** et **Sergey Brin** à Stanford en 1996, PageRank révolutionne la recherche en classant les pages selon leur **importance** dans le réseau Internet, pas seulement leur contenu.

### 🗳️ Principe du "Vote"
PageRank fonctionne sur la logique de **votes** : une page "vote" pour une autre lorsqu'elle possède un lien vers celle-ci. Plus une page reçoit de liens, plus elle semble pertinente.

### ⚖️ Pondération des Votes
Pour éviter les biais, certaines pages ont des votes plus importants que d'autres. Une page de haute qualité qui fait un lien vers votre site apporte plus de "poids" que de nombreux liens de faible qualité.

> 💡 **Analogie :** Comme le maire au Loup-Garou de Thiercelieux, certaines pages ont un vote qui compte double !

> 🎯 **Impact :** Cette logique de calcul de pertinence est aujourd'hui utilisée par la plupart des moteurs de recherche pour classer les résultats.

> 🚀 **Héritage :** PageRank a permis à Google de devenir le moteur de recherche dominant en proposant des résultats plus pertinents que ses concurrents.

<PageRankVisualizer />

## 🍪 Cookies et Traceurs

> **Définition : Cookie**
> Un **cookie** est un petit fichier texte déposé sur votre ordinateur par les sites web que vous visitez. Il permet de "mémoriser" des informations d'une page à l'autre (panier d'achat, connexion, préférences).

### 🕵️ Le Traçage Publicitaire
Certains cookies (tiers) ne servent pas au fonctionnement du site, mais à vous suivre de site en site pour établir votre **profil publicitaire**. C'est pour cela que vous voyez des pubs de chaussures après avoir visité un site de sport !

<CookieManager />

## 🔒 Sécurité : HTTPS et Cadenas

> **HTTP vs HTTPS**
> - **HTTP** : Les données circulent "en clair". N'importe qui sur le réseau peut les lire.
> - **HTTPS** (S = Secure) : Les données sont **chiffrées**. Seul le destinataire peut les lire.

### 🛡️ Simulation d'une attaque "Man-in-the-Middle"
Essayez d'envoyer un mot de passe avec et sans HTTPS pour voir ce qu'un pirate peut intercepter.

<HttpsSimulator />

> **⚠️ Règle d'or**
> Ne jamais entrer de mot de passe ou de numéro de carte bancaire si le petit cadenas 🔒 n'est pas présent dans la barre d'adresse !
