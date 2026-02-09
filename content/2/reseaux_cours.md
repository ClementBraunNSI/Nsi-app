---
title: "Introduction aux réseaux"
description: "Comprendre les fondements de la communication numérique, le modèle TCP/IP et l'adressage"
level: premiere
chapter: "Réseaux et Internet"
icon: "🕸️"
badgeId: "premiere_cours"
---


# Introduction aux réseaux

## Qu'est-ce qu'un réseau internet

### Définitions Fondamentales

*   **Réseau local** : Ensemble de machines reliées entre elles qui échangent des informations en ne passant que par le routeur ou un switch.
*   **Réseau internet** : Ensemble de réseaux locaux qui communiquent entre eux en passant par Internet.

### Composants d'un réseau

*   **Appareils Clients** : Ordinateurs, smartphones, tablettes, consoles... Tous les appareils qui consomment ou produisent des données sur le réseau.
*   **Objets Connectés (IoT)** : Ensemble des objets connectés comme la domotique, capteurs intelligents, appareils électroménagers connectés.
*   **Switch** : Élément d'un réseau qui permet de relier les machines entre elles pour s'échanger des données dans un réseau local.
*   **Routeur** : Élément qui permet de relier plusieurs réseaux entre eux et d'acheminer les données vers leur destination.

### Types de Connexions

Les machines sont reliées par différents moyens de communication :

*   **Câbles RJ45** : Connexion filaire standard pour les réseaux Ethernet, offrant une connexion stable et rapide.
*   **Ondes Radio** : WiFi (Wireless Fidelity), 5G, Bluetooth... Connexions sans fil pour la mobilité et la flexibilité.
*   **Fibre Optique** : Transmission par signaux lumineux, offrant les débits les plus élevés pour les longues distances.

### Protocoles de Communication

La communication est définie et régie par des **protocoles**.
Un protocole est un ensemble de règles et d'actions prédéfinies à réaliser dans un ordre précis.

## Distinction Web et Internet

*   **Internet** : Correspond à **l'ensemble des réseaux organisés** communiquant ensemble. C'est l'infrastructure physique et logique mondiale.
*   **Web** : Correspond à une application d'Internet qui rend accessible des ressources grâce aux **liens hypertextes** (hyperliens).

### Topologies de Réseaux

Une topologie dans les réseaux correspond à la disposition des machines dans un réseau.

*   **Anneau** : Chaque machine est connectée à deux autres, formant un cercle fermé. Les données circulent dans une direction.
*   **Étoile** : Toutes les machines sont connectées à un point central (switch/hub). Topologie la plus utilisée domestiquement.
*   **Bus** : Toutes les machines partagent un même câble de communication principal.
*   **Hiérarchique** : Structure arborescente avec plusieurs niveaux de connexions, du plus général au plus spécifique.
*   **P2P (Pair-à-Pair)** : Chaque machine peut communiquer directement avec toutes les autres sans point central.

## Adresses MAC et IP

Pour identifier et localiser les machines sur un réseau, deux types d'adresses sont utilisés : les adresses MAC (physiques) et les adresses IP (logiques).

### Adresse MAC

**Media Access Control** - Adresse physique d'une interface de carte réseau, **unique** et propre à la carte.

*   **Format :** 6 groupes de 16 bits en hexadécimal
*   **Exemple :** `a8:9f:d9:4c:5c:d9`

*Le switch utilise l'adresse MAC pour retransmettre les données à la bonne machine.*

### Adresse IP

Adresse logique d'une machine sur un réseau, attribuée à la première connexion.

*   **Format :** 4 octets en décimal
*   **Exemple humain :** `123.32.41.74`
*   **Exemple machine :** `01111011.00100000.00101001.01001010`

*Permet 2³² = 4 294 967 296 adresses différentes.*

### Composition d'une Adresse IP

Une adresse IP est composée de deux parties :

1.  **L'adresse du réseau** : Partie commune à toutes les machines du réseau
2.  **L'adresse de la machine** : Partie spécifique à chaque machine du réseau

Ces deux parties sont distinguées par le nombre de bits qui leurs sont associés.

### Masque de Sous-réseau

On définit un **masque** comme étant le nombre de bits nécessaires pour représenter l'adresse du réseau.
Pour retrouver l'adresse du réseau, on réalise une opération logique **ET** sur chacun des bits.
Ce masque est représenté à la fin de l'adresse IP précédée d'un / (slash), appelé notation **CIDR**.

!!! example "Exemple de Calcul d'Adresse Réseau"
    *   **Adresse** : `123.32.41.74/16` (16 bits pour l'adresse réseau)
    *   **Masque** : `11111111.11111111.00000000.00000000`
    *   **Adresse binaire** : `01111011.00100000.00101001.01001010`

    **ET logique :**
    ```
    11111111.11111111.00000000.00000000
    01111011.00100000.00101001.01001010
    ────────────────────────────────────
    01111011.00100000.00000000.00000000
    ```
    **Résultat :** `123.32.0.0` (adresse du réseau)

!!! warning "Adresses Réservées"
    *   L'adresse du réseau (inutilisable pour les machines)
    *   L'adresse de broadcast (se termine par 255, pour diffusion générale)

!!! tip "Calcul du nombre de machines"
    Nombre d'adresses disponibles = 2^(nombre de bits partie machine) - 2
    Exemple : 16 bits machine → 2^16 - 2 = 65 534 machines possibles

## Classes d'Adresses IP

Historiquement, les adresses IP étaient regroupées en classes pour leur attribution à divers organismes.

*   **Classe A** : `1.0.0.0` - `126.0.0.0`. Réseaux très grands (128 réseaux, ~16M hôtes/réseau).
*   **Classe B** : `128.0.0.0` - `191.255.0.0`. Réseaux moyens (16k réseaux, ~65k hôtes/réseau).
*   **Classe C** : `192.0.0.0` - `223.255.255.0`. Petits réseaux (~2M réseaux, 254 hôtes/réseau).
*   **Classe D** : `224.0.0.0` - `239.255.255.255`. Multicast.
*   **Classe E** : `240.0.0.0` - `255.255.255.255`. Réservé (expérimental).

## IPv6 - Évolution du Protocole

Le protocole IPv4 permet de définir 2³² adresses (≈ 4 milliards). Avec l'explosion du nombre d'appareils connectés, ce nombre devient insuffisant.

*   **IPv4** : 32 bits → 2³² ≈ 4 milliards d'adresses
*   **IPv6** : 128 bits → 2¹²⁸ ≈ 3,4 × 10³⁸ adresses
*   **Format IPv6** : 8 groupes de 4 chiffres hexadécimaux
*   **Exemple** : `2001:0db8:85a3:0000:0000:8a2e:0370:7334`

## Adresses Privées

Certaines plages d'adresses IP sont réservées pour un usage privé (réseaux locaux) et ne sont pas routées sur Internet.

*   **Classe A Privée** : `10.0.0.0` à `10.255.255.255` (/8). Grands réseaux privés.
*   **Classe B Privée** : `172.16.0.0` à `172.31.255.255` (/12). Réseaux privés moyens.
*   **Classe C Privée** : `192.168.0.0` à `192.168.255.255` (/16). Petits réseaux domestiques/entreprise.

!!! tip "Avantage des Adresses Privées"
    Permettent aux réseaux locaux d'utiliser des adresses IP sans risquer de conflit avec les adresses publiques d'Internet.

## Modèle TCP/IP

Le modèle TCP/IP est un modèle en couche qui permet d'illustrer l'encapsulation des données pour permettre leur envoi, leur réception et leur traitement.

![Introduction aux réseaux](/content/2/6_Internet_Reseaux/Modele_IP.png)

### Processus d'Encapsulation

L'encapsulation est un concept clé du modèle TCP/IP :

1.  Les données sont générées au niveau de la couche Application
2.  Chaque couche inférieure ajoute ses propres informations (en-têtes)
3.  À la réception, chaque couche retire ses informations
4.  Les données sont reconstituées dans leur état original

!!! info "Analogie Postale"
    On peut comparer le modèle TCP/IP à un système postal :
    
    *   **Couche Application** = Rédaction de la lettre
    *   **Couche Transport** = Mise sous enveloppe, numérotation
    *   **Couche Internet** = Adressage, choix de l'acheminement
    *   **Couche Accès Réseau** = Distribution physique

### Structure des Couches

1.  **Couche Accès Réseau**
    *   Gère la transmission physique des données sur le réseau local. Combine les fonctions des couches physique et liaison de données du modèle OSI.
    *   **Fonctions** : Transmission des bits, détection d'erreurs, adressage physique (MAC).
    *   **Protocoles** : Ethernet, Wi-Fi, Bluetooth.

2.  **Couche Internet**
    *   Responsable du routage des paquets à travers différents réseaux pour atteindre leur destination.
    *   **Fonctions** : Adressage logique (IP), routage, fragmentation.
    *   **Protocoles** : IP (IPv4/IPv6), ICMP, ARP.

3.  **Couche Transport**
    *   Assure la transmission fiable des données entre les applications.
    *   **Fonctions** : Segmentation, contrôle de flux, multiplexage.
    *   **Protocoles** :
        *   **TCP** : Fiable, avec contrôle d'erreurs
        *   **UDP** : Rapide, sans garantie de livraison

4.  **Couche Application**
    *   Fournit les services réseau directement aux applications utilisateur.
    *   **Fonctions** : Interface avec les applications, formatage des données.
    *   **Protocoles** : HTTP/HTTPS, FTP, SMTP, DNS, SSH.
