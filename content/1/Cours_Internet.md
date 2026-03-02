---
title: "Internet"
description: "L'histoire et le fonctionnement du réseau mondial, des pionniers à la révolution TCP/IP."
level: "2"
chapter: "Internet"
icon: "🌐"
---

> **Définition : Internet**
> **Internet** est un réseau informatique à échelle mondiale sur lequel de nombreuses applications sont basées (email, transfert de fichiers, navigation web, etc.).

## 📅 L'Histoire d'Internet : Des Pionniers à la Révolution Mondiale

### 1960s - Les Pionniers d'ARPANET
L'idée révolutionnaire de relier des machines pour échanger des données naît dans les laboratoires et universités. Robert Kahn dirige le projet ARPANET pour la Defense Advanced Research Projects Agency.

### 1969 - Premier Message de l'Histoire
Le 20 septembre 1969, la première communication voit le jour entre l'université de Californie et Stanford. Le premier message transmis était simplement "login".

### 1970-80s - Naissance des Protocoles
Développement des règles de communication appelées "protocoles". Ces normes permettent aux machines de communiquer de manière standardisée.

### 1983 - Révolution TCP/IP
Installation du protocole TCP/IPv4 sur ARPANET. Création simultanée des règles des systèmes de nom de domaine (DNS).

### 1990s - Explosion du Web
Tim Berners-Lee et Robert Cailliau créent le World Wide Web au CERN en Suisse, révolutionnant l'accès à l'information.

![Tim Berners-Lee et Robert Cailliau](/content/1/tblrc.jpeg)

### Aujourd'hui - Internet Mondial
Plus de 4 milliards d'internautes connectés, échangeant emails, fichiers et accédant à une quantité incommensurable de données.

![Réseau ARPANET](/content/1/arpanet.jpeg)

> **Le saviez-vous ?**
> L'objectif initial était de relier seulement trois universités : Stanford, Los Angeles et l'Utah.

![Carte mondiale d'Internet](/content/1/geo-mercator.svg)

## 🔧 Anatomie d'un Réseau Informatique

> **Définition : Réseau Informatique**
> Un **réseau informatique** est un ensemble de machines reliées, par différents moyens, qui communiquent entre elles pour échanger des données ou des informations.

### 🧩 Les Composants Essentiels

#### 💻 Machines
Éléments qui cherchent à communiquer, envoyer ou recevoir des données.
*Exemples : Ordinateurs, tablettes, consoles, smartphones*

#### 🔀 Switch
Élément qui relie de manière locale des machines dans un même réseau.
*Exemples : Box internet, switch RJ45*

#### 🌐 Routeur
Élément qui permet de relier un réseau local à Internet ou d'autres réseaux.
*Exemples : Box internet, routeur spécialisé*

#### 📡 Supports de Transmission
Éléments qui permettent de relier les diverses machines au switch ou au routeur.
*Exemples : Câble Ethernet, Fibre optique, WiFi*

### 🗺️ Typologie des Réseaux

#### 🏠 Réseau Local (LAN)
Réseau localisé dans une même zone géographique (maison, bureau, école).

#### 🌍 Réseau Internet (WAN)
Réseau accessible à Internet, connectant des réseaux locaux du monde entier.

![Schéma réseau local et Internet](/content/1/rlinternet.png)

> **Question clé**
> On dispose de machines et d'un réseau, mais comment se retrouvent-elles pour communiquer ? Quelles techniques sont utilisées ?

## 🏷️ L'Adressage dans les Réseaux

### 🔗 Adressage Local : MAC

Une machine dispose d'une ou plusieurs **cartes réseaux** qui permettent de communiquer localement ou globalement vers Internet. Chaque carte possède une adresse unique.

> **📍 Adresse MAC**
> L'adresse **MAC (Media Access Control)** est aussi appelée **adresse physique** car elle correspond à l'adresse utilisée par le port Ethernet et le protocole Ethernet.

**Caractéristiques :**
- **Format** : 6 blocs de 2 caractères
- **Base** : Hexadécimale (16 caractères)
- **Portée** : Réseau local uniquement
- **Unicité** : Unique au monde

> **Exemple** : `a1:b2:c3:d4:e5:f6`

> **Base hexadécimale** : Représentation en 16 caractères (0-9, A-F)

### 🌐 Adressage Internet : IP

Pour qu'un réseau soit accessible sur Internet, chaque machine doit posséder une adresse unique permettant de l'identifier parmi des milliards d'autres.

> **🎯 Adresse IP**
> L'**Adresse IP (Internet Protocol)** est constituée de 4 nombres allant de 0 à 255, représentés en binaire par l'ordinateur mais affichés en décimal pour l'humain.

**Caractéristiques :**
- **Format** : 4 nombres (0-255)
- **Base humaine** : Décimale (base 10)
- **Base machine** : Binaire (0 et 1)
- **Portée** : Internet mondial

> **Exemple** : `127.0.0.1` (localhost)

## 🌐 Le Protocole TCP/IP

Maintenant que nous savons comment les machines se reconnaissent sur Internet grâce aux adresses, découvrons comment les données transitent réellement d'une machine à une autre à travers le monde.

> **🔗 Protocole TCP/IP**
> Le protocole **TCP/IP** est un protocole de communication qui permet l'échange de données entre machines sur Internet. Il constitue le langage universel d'Internet, permettant à des milliards d'appareils de communiquer ensemble.

### 🏗️ Les 4 Couches du Modèle

Le modèle TCP/IP découpe la communication en 4 couches distinctes, chacune ayant un rôle précis.
Cliquez sur chaque couche ci-dessous pour découvrir son rôle et une analogie simple.

<TcpIpLayers />

### 📦 Le Principe d'Encapsulation

Lorsqu'on envoie un message (par exemple une page web), les données descendent les couches comme une poupée russe.

<EncapsulationVisualizer />

### ✂️ Le Découpage en Paquets

Sur Internet, les données ne circulent pas d'un seul bloc. Elles sont découpées en petits paquets indépendants qui peuvent emprunter des chemins différents.

> **🚦 Comment les routeurs choisissent le chemin ?**
> Comme un **GPS** (Waze ou Google Maps), les routeurs connaissent l'état du trafic en temps réel.
> Ils ne choisissent pas toujours le chemin le plus court en distance, mais le plus **rapide**. Si une route est encombrée (bouchon), le routeur envoie le paquet par un autre chemin, même s'il est plus long.

<PacketTracer />

> **Note :** Utilisez le simulateur ci-dessus pour lancer un "Ping" et visualiser le trajet d'un paquet à travers les routeurs.

## 📖 Le DNS : L'Annuaire d'Internet

Les ordinateurs communiquent avec des adresses IP (ex: `142.250.179.142`), mais les humains préfèrent des noms faciles à retenir (ex: `google.com`).

> **📒 DNS (Domain Name System)**
> Le **DNS** est l'annuaire d'Internet. Il traduit les noms de domaine (compréhensibles par l'humain) en adresses IP (compréhensibles par la machine).

Imaginez que vous voulez appeler un ami. Vous cherchez son nom dans votre répertoire ("Maman") et votre téléphone compose le numéro (`06 12 34 56 78`). Le DNS fait exactement la même chose pour les sites web !

## 🤝 Client-Serveur et Peer-to-Peer

Il existe deux grandes façons d'organiser les communications sur Internet :

### 🍽️ Le Modèle Client-Serveur
C'est le modèle le plus courant (Web, Email, Streaming).
- **Le Client** (vous) demande un service (une page web, une vidéo).
- **Le Serveur** (Google, Netflix) fournit le service.
*Analogie : Au restaurant, vous (client) commandez un plat, et le cuisinier (serveur) vous le prépare et vous l'apporte.*

### 🔄 Le Modèle Peer-to-Peer (P2P)
Dans ce modèle, il n'y a pas de chef ! Tous les ordinateurs sont égaux.
- Chaque ordinateur est à la fois **client et serveur**.
- Ils s'échangent des données directement entre eux.
*Analogie : Un repas partagé (auberge espagnole) où tout le monde apporte quelque chose et partage avec les autres.*

## 🌍 L'Infrastructure Physique

On parle souvent du "Cloud" (nuage), mais Internet est bien réel et physique !

> **📡 Le saviez-vous ?**
> 99% du trafic Internet intercontinental passe sous les océans par des **câbles sous-marins** en fibre optique, pas par des satellites !

Internet, c'est :
1.  **Des Câbles** : Des milliers de kilomètres de fibre optique sous les mers et sous nos rues.
2.  **Des Data Centers** : D'immenses hangars remplis d'ordinateurs (serveurs) qui stockent les vidéos, photos et sites web. Le "Cloud", c'est juste l'ordinateur de quelqu'un d'autre !
3.  **Des Points d'Échange (IXP)** : Des carrefours où les réseaux des opérateurs (Orange, Free, Google...) se connectent pour s'échanger du trafic.

