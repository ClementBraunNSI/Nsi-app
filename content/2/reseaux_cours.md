---
title: "Introduction aux réseaux"
description: "Comprendre les fondements de la communication numérique, le modèle TCP/IP et l'adressage"
level: premiere
chapter: "Réseaux et Internet"
icon: "🕸️"
badgeId: "premiere_cours"
audience: public
---

# Introduction aux réseaux

En Seconde, vous avez vu un réseau comme un ensemble de machines reliées. En Première, on met des noms précis sur ce qui circule, et on sépare des mots que le langage courant mélange. Une machine a besoin d'une identité locale, l'adresse MAC, et d'une adresse logique, l'adresse IP. Les données partent en paquets. IP cherche le chemin. TCP, ou parfois UDP, s'occupe du transport entre deux programmes.

Un **réseau** relie des machines pour qu'elles échangent des données. Le **réseau local**, le LAN, reste dans un même lieu, la maison ou la salle, derrière un switch ou une box. **Internet** est un réseau de réseaux, tenu par des routeurs. Le **Web** n'est ni l'un ni l'autre : c'est une application, des pages et des liens, qui a besoin d'Internet pour fonctionner, comme le mail ou le streaming. Dire « Internet » en parlant d'un site, c'est prendre le service pour la route.

| Élément | Rôle |
| --- | --- |
| Client | L'appareil qui produit ou consomme les données : ordinateur, téléphone |
| Switch | Relie les machines *dans* le réseau local, en se servant des adresses MAC |
| Routeur | Relie *plusieurs* réseaux et achemine les paquets selon les adresses IP |

Le lien physique peut être un câble Ethernet (prise RJ45), le Wi-Fi, ou la fibre. Un **protocole** est l'ensemble des règles partagées : le format des messages, leur ordre, et ce qu'on fait quand l'autre ne répond pas. Sans protocole, le câble transporte un signal que personne ne sait lire.

## Deux adresses, deux échelles

L'adresse **MAC** est l'adresse physique d'une interface réseau, en principe unique à la carte. Elle s'écrit en six octets hexadécimaux, par exemple `a8:9f:d9:4c:5c:d9`. Le switch s'en sert pour livrer une trame à la bonne machine du réseau local. Au-delà du routeur, elle ne sert plus à trouver le destinataire.

L'adresse **IP** est logique. On l'attribue à une connexion, souvent automatiquement par DHCP, et elle peut changer. En **IPv4**, quatre octets suffisent, par exemple `192.168.1.42`. Cela laisse environ quatre milliards d'adresses, et ce n'est plus assez. **IPv6** passe à 128 bits, par exemple `2001:0db8:85a3::8a2e:0370:7334`, justement pour sortir de cette pénurie.

Une adresse IP se coupe en deux. La **partie réseau** est commune à toutes les machines du même réseau. La **partie hôte** distingue chaque machine. Le masque dit où tombe la coupe.

## Masque et notation CIDR

En notation **CIDR**, on écrit l'adresse suivie de `/n`, où *n* est le nombre de bits réservés au réseau. Pour `123.32.41.74/16`, les 16 premiers bits sont le réseau. Le masque correspondant est `255.255.0.0`. L'adresse du réseau s'obtient par un ET bit à bit :

```
masque   11111111.11111111.00000000.00000000
IP       01111011.00100000.00101001.01001010
ET       01111011.00100000.00000000.00000000  → 123.32.0.0
```

Deux adresses de chaque réseau sont réservées : l'adresse du réseau elle-même, et l'adresse de **broadcast**, qui s'adresse à toutes les machines d'un coup. Le nombre d'hôtes utilisables vaut donc à peu près \(2^{\text{bits hôtes}} - 2\).

Les anciennes classes A, B et C fixaient des tailles de réseau une fois pour toutes. On ne s'en sert plus pour découper : le CIDR autorise des masques de longueur variable, adaptés au nombre de machines qu'on a vraiment.

## Privée ou publique

Certaines plages IPv4 sont **privées**. On peut les utiliser chez soi ou dans une entreprise, et les routeurs d'Internet refusent de les acheminer telles quelles.

| Plage | Exemple typique |
| --- | --- |
| `10.0.0.0/8` | Un grand réseau d'entreprise |
| `172.16.0.0/12` | Un réseau privé de taille moyenne |
| `192.168.0.0/16` | La box de la maison |

Une adresse **publique** est visible sur Internet. À la maison, le routeur fait en général le **NAT** : il traduit les adresses privées des téléphones et des ordinateurs vers l'adresse publique fournie par le fournisseur d'accès. De l'extérieur, on ne voit qu'une adresse. Dedans, le `192.168...` peut se répéter d'un logement à l'autre, justement parce qu'il n'en sort pas.

## Quatre couches, et des enveloppes

Le modèle TCP/IP décrit la communication en couches. À l'envoi, chaque couche ajoute ses informations autour des données. À la réception, elle les retire. C'est l'**encapsulation**.

![Introduction aux réseaux](/content/2/6_Internet_Reseaux/Modele_IP.png)

<TcpIpLayers />

| Couche | Rôle | Exemples |
| --- | --- | --- |
| Application | Le service, du point de vue de l'utilisateur | HTTP, DNS, SMTP |
| Transport | Le dialogue entre deux programmes, via des ports | **TCP** (fiable), **UDP** (rapide, sans garantie) |
| Internet | L'adressage et le routage des paquets | **IP**, ICMP |
| Accès réseau | La transmission sur le lien local | Ethernet, Wi-Fi, donc les MAC |

IP livre un paquet d'une machine à une autre, au mieux : si un paquet se perd, IP ne le renvoie pas. TCP, au-dessus, construit un flux ordonné et fiable entre deux programmes, avec des retransmissions et un contrôle de débit. UDP, lui, envoie sans attendre d'accusé. On le choisit quand arriver tout de suite compte plus qu'arriver complet, la voix ou la vidéo en direct par exemple.

!!! info "Analogie postale"
    L'application écrit la lettre. Le transport la met sous enveloppe et la numérote. La couche Internet écrit l'adresse et choisit l'acheminement. L'accès réseau fait la livraison physique, sur le câble ou dans l'air.

<EncapsulationVisualizer />

Le piège le plus courant est de traiter MAC, IP et TCP comme trois synonymes de « l'adresse ». La MAC identifie l'interface dans la pièce. L'IP situe la machine dans un réseau et permet le routage. TCP ne situe rien : il fiabilise la conversation entre deux programmes, une fois que IP a trouvé à qui parler.

IPv6 ne change pas ce découpage. Il répond seulement au manque d'adresses IPv4.

## Pour s'entraîner

Les visualisations ci-dessus montrent les couches et l'encapsulation. Le cours sur le Web et HTTP reprend les mêmes idées au moment où une URL, un nom DNS et une requête deviennent une page.
