---
title: "Introduction aux réseaux"
description: "Comprendre les fondements de la communication numérique, le modèle TCP/IP et l'adressage"
level: premiere
chapter: "Réseaux et Internet"
icon: "🕸️"
badgeId: "premiere_cours"
---

# Introduction aux réseaux

## Objectifs

- Distinguer Internet et Web, réseau local et Internet.
- Expliquer le rôle des adresses MAC et IP, du masque et de la notation CIDR.
- Différencier adresses privées et publiques.
- Comprendre le modèle TCP/IP et l'encapsulation (TCP vs IP).

## Idée clé

Pour communiquer, une machine a besoin d'une **identité locale** (MAC) et d'une **adresse logique** (IP). Les données voyageant en **paquets** sont encapsulées couche par couche : IP s'occupe du **chemin**, TCP (ou UDP) s'occupe du **transport** entre applications.

## Qu'est-ce qu'un réseau ?

Un **réseau** relie des machines pour échanger des données.

- **Réseau local (LAN)** : machines d'un même lieu (maison, salle) reliées via un switch / un box.
- **Internet** : réseau de réseaux, interconnectés par des routeurs.

**Internet ≠ Web.** Internet est l'infrastructure ; le **Web** est une application (pages, liens) qui s'appuie sur Internet.

### Composants utiles

| Élément | Rôle |
| --- | --- |
| Client | Appareil qui consomme / produit des données (PC, téléphone…) |
| Switch | Relie les machines **dans** un réseau local (travaille avec les MAC) |
| Routeur | Relie **plusieurs** réseaux et achemine les paquets (travaille avec les IP) |

Connexions possibles : câble Ethernet (RJ45), Wi-Fi, fibre optique.

Un **protocole** est un ensemble de règles partagées pour communiquer (format, ordre, réactions).

## Adresses MAC et IP

### Adresse MAC

Adresse **physique** d'une interface réseau, en principe unique à la carte.

- Format : 6 octets en hexadécimal — ex. `a8:9f:d9:4c:5c:d9`
- Utilisée surtout **dans le réseau local** (le switch s'en sert pour livrer la trame).

### Adresse IP

Adresse **logique** d'une machine sur un réseau (attribuée à la connexion, souvent par DHCP).

- **IPv4** : 4 octets — ex. `192.168.1.42` (environ 4 milliards d'adresses)
- **IPv6** : 128 bits — ex. `2001:0db8:85a3::8a2e:0370:7334` (réponse à la pénurie d'IPv4)

Une adresse IP se découpe en :

1. **partie réseau** — commune à toutes les machines du même réseau ;
2. **partie hôte** — propre à chaque machine.

## Masque et notation CIDR

Le **masque** indique combien de bits appartiennent au réseau. En notation **CIDR**, on écrit l'adresse suivie de `/n` (n = nombre de bits réseau).

Exemple : `123.32.41.74/16`

- masque : `255.255.0.0` (16 bits à 1) ;
- adresse réseau (ET bit à bit) : `123.32.0.0`.

!!! example "Calcul rapide"
    ```
    masque   11111111.11111111.00000000.00000000
    IP       01111011.00100000.00101001.01001010
    ET       01111011.00100000.00000000.00000000  → 123.32.0.0
    ```

Deux adresses sont **réservées** dans chaque réseau : l'adresse du réseau elle-même, et l'adresse de **broadcast** (diffusion). Nombre d'hôtes utilisables ≈ \(2^{\text{bits hôtes}} - 2\).

> Les anciennes « classes A/B/C » sont un héritage historique. Aujourd'hui on utilise le **CIDR** (masques de longueur variable).

## Privé vs public

Certaines plages IPv4 sont **privées** : utilisables en local, **non routées** sur Internet.

| Plage | Exemple typique |
| --- | --- |
| `10.0.0.0/8` | grands réseaux d'entreprise |
| `172.16.0.0/12` | réseaux privés moyens |
| `192.168.0.0/16` | box / réseau domestique |

Une adresse **publique** est visible sur Internet. Le routeur (NAT) fait souvent le lien entre le privé du domicile et le public du FAI.

## Modèle TCP/IP et encapsulation

Le modèle TCP/IP décrit la communication en **couches**. Chaque couche ajoute (à l'envoi) ou retire (à la réception) ses informations : c'est l'**encapsulation**.

![Introduction aux réseaux](/content/2/6_Internet_Reseaux/Modele_IP.png)

<TcpIpLayers />

| Couche | Rôle | Exemples |
| --- | --- | --- |
| Application | Services pour l'utilisateur | HTTP, DNS, SMTP |
| Transport | Dialogue entre applications (ports) | **TCP** (fiable), **UDP** (rapide) |
| Internet | Adressage et routage des paquets | **IP**, ICMP |
| Accès réseau | Transmission locale (câble, Wi-Fi) | Ethernet, Wi-Fi (MAC) |

**TCP vs IP** : IP livre des paquets d'une machine à une autre (meilleur effort) ; TCP assure, au-dessus, un flux ordonné et fiable entre deux programmes (retransmission, contrôle de flux).

!!! info "Analogie postale"
    Application = lettre ; Transport = enveloppe / numérotation ; Internet = adresse et acheminement ; Accès réseau = livraison physique.

<EncapsulationVisualizer />

## Piège fréquent

Confondre **MAC** et **IP** : la MAC identifie l'interface **localement** ; l'IP situe la machine dans un réseau (et permet le routage). Confondre aussi **TCP** et **IP** : IP trouve le chemin, TCP (souvent) sécurise le transport applicatif.

## À retenir

- Internet = réseaux interconnectés ; Web = service (pages, hyperliens) sur Internet.
- MAC = adresse physique locale ; IP = adresse logique (réseau + hôte).
- Le masque / CIDR définit où s'arrête le réseau.
- Privé (`192.168…`, `10…`, etc.) vs public : le privé ne sort pas directement sur Internet.
- Encapsulation : chaque couche ajoute un en-tête ; TCP ≠ IP.
- IPv6 répond à la limite d'IPv4.

## Pour s'entraîner / Suite

Explorez les visualisations TCP/IP et d'encapsulation ci-dessus, puis enchaînez avec le cours sur le **Web et HTTP** pour voir ces idées à l'œuvre (URL, DNS, requêtes).
