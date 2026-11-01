---
title: "Introduction aux réseaux"
description: "Comprendre les fondements de la communication numérique, le modèle TCP/IP et l'adressage"
level: premiere
chapter: "Réseaux et Internet"
icon: "network"
badgeId: "premiere_cours"
audience: public
---

# Introduction aux réseaux

En Seconde, un réseau a été vu comme un ensemble de machines reliées. En Première, il s'agit de nommer précisément ce qui circule et de distinguer des mots que le langage courant confond. Une machine a besoin d'une identité locale, l'adresse MAC, et d'une adresse logique, l'adresse IP. Les données sont envoyées en paquets : IP cherche le chemin, et TCP, ou parfois UDP, assure le transport entre deux programmes.

Un **réseau** relie des machines pour qu'elles échangent des données. Le **réseau local**, ou LAN, reste dans un même lieu, comme une maison ou une salle, et ses machines sont reliées par un switch ou une box. **Internet** est un réseau de réseaux, reliés entre eux par des routeurs. Le **Web** n'est ni l'un ni l'autre : c'est une application, faite de pages et de liens, qui a besoin d'Internet pour fonctionner, comme le mail ou le streaming. Parler d'« Internet » pour désigner un site revient donc à confondre le service et le réseau qui le transporte.

| Élément | Rôle |
| --- | --- |
| Client | L'appareil qui produit ou utilise les données, comme un ordinateur ou un téléphone |
| Switch | Relie les machines *dans* le réseau local, en se servant des adresses MAC |
| Routeur | Relie *plusieurs* réseaux et achemine les paquets selon les adresses IP |

Le lien physique peut être un câble Ethernet (prise RJ45), le Wi-Fi, ou la fibre. Un **protocole** est un ensemble de règles communes, qui fixent le format des messages, leur ordre et ce qu'il faut faire quand l'autre machine ne répond pas. Sans protocole, le câble transporterait un signal que personne ne saurait interpréter.

## Adresse MAC et adresse IP

L'adresse **MAC** est l'adresse physique d'une interface réseau, en principe unique à la carte. Elle s'écrit en six octets hexadécimaux, par exemple `a8:9f:d9:4c:5c:d9`. Le switch s'en sert pour livrer une trame à la bonne machine du réseau local. Au-delà du routeur, elle ne sert plus à trouver le destinataire.

L'adresse **IP** est logique. Elle est attribuée à une connexion, souvent automatiquement par DHCP, et elle peut changer. En **IPv4**, elle s'écrit sur quatre octets, par exemple `192.168.1.42`. Cela donne environ quatre milliards d'adresses, ce qui ne suffit plus aujourd'hui. **IPv6** utilise donc 128 bits, par exemple `2001:0db8:85a3::8a2e:0370:7334`, pour résoudre cette pénurie.

Une adresse IP se divise en deux parties. La **partie réseau** est commune à toutes les machines du même réseau, et la **partie hôte** distingue chaque machine. Le masque indique où se situe la séparation entre les deux.

## Masque et notation CIDR

En notation **CIDR**, on écrit l'adresse suivie de `/n`, où *n* est le nombre de bits réservés au réseau. Pour `123.32.41.74/16`, les 16 premiers bits sont le réseau. Le masque correspondant est `255.255.0.0`. L'adresse du réseau s'obtient par un ET bit à bit :

```
masque   11111111.11111111.00000000.00000000
IP       01111011.00100000.00101001.01001010
ET       01111011.00100000.00000000.00000000  -> 123.32.0.0
```

Deux adresses de chaque réseau sont réservées : l'adresse du réseau elle-même, et l'adresse de **broadcast**, qui s'adresse à toutes les machines d'un coup. Le nombre d'hôtes utilisables vaut donc à peu près $2^{\text{bits hôtes}} - 2$.

Les anciennes classes A, B et C imposaient des tailles de réseau fixes. Elles ne sont plus utilisées, car le CIDR permet des masques de longueur variable, adaptés au nombre réel de machines.

## Adresses privées et publiques

Certaines plages IPv4 sont **privées**. On peut les utiliser chez soi ou dans une entreprise, et les routeurs d'Internet refusent de les acheminer telles quelles.

| Plage | Exemple typique |
| --- | --- |
| `10.0.0.0/8` | Un grand réseau d'entreprise |
| `172.16.0.0/12` | Un réseau privé de taille moyenne |
| `192.168.0.0/16` | La box de la maison |

Une adresse **publique** est visible sur Internet. À la maison, le routeur fait en général le **NAT** : il traduit les adresses privées des téléphones et des ordinateurs vers l'adresse publique fournie par le fournisseur d'accès. Vu de l'extérieur, tout le logement n'a donc qu'une seule adresse. À l'intérieur, les mêmes adresses en `192.168...` peuvent être utilisées dans de nombreux logements, justement parce qu'elles ne sortent pas du réseau local.

## Le modèle en couches

Le modèle TCP/IP décrit la communication en couches. À l'envoi, chaque couche ajoute ses informations autour des données. À la réception, elle les retire. C'est l'**encapsulation**.

![Introduction aux réseaux](/content/2/6_Internet_Reseaux/Modele_IP.png)

<TcpIpLayers />

| Couche | Rôle | Exemples |
| --- | --- | --- |
| Application | Le service, du point de vue de l'utilisateur | HTTP, DNS, SMTP |
| Transport | Le dialogue entre deux programmes, via des ports | **TCP** (fiable), **UDP** (rapide, sans garantie) |
| Internet | L'adressage et le routage des paquets | **IP**, ICMP |
| Accès réseau | La transmission sur le lien local | Ethernet, Wi-Fi, donc les MAC |

IP achemine un paquet d'une machine à une autre sans garantie : si le paquet se perd, IP ne le renvoie pas. TCP, au-dessus, construit un flux ordonné et fiable entre deux programmes, avec des retransmissions et un contrôle de débit. UDP, lui, envoie les données sans attendre d'accusé de réception. On le choisit quand la rapidité compte plus que l'arrivée de toutes les données, par exemple pour la voix ou la vidéo en direct.

!!! info "Analogie postale"
    L'application écrit la lettre. Le transport la met sous enveloppe et la numérote. La couche Internet écrit l'adresse et choisit l'acheminement. L'accès réseau fait la livraison physique, sur le câble ou dans l'air.

<EncapsulationVisualizer />

L'erreur la plus courante consiste à considérer MAC, IP et TCP comme trois synonymes d'« adresse ». L'adresse MAC identifie l'interface dans le réseau local, et l'adresse IP situe la machine dans un réseau et permet le routage. TCP, lui, n'est pas une adresse : il rend fiable l'échange entre deux programmes, une fois qu'IP a trouvé le destinataire.

IPv6 ne change pas ce découpage. Il répond seulement au manque d'adresses IPv4.

## Pour s'entraîner

Les visualisations ci-dessus montrent les couches et l'encapsulation. Le cours sur le Web et HTTP reprend ces idées pour expliquer comment une URL, un nom de domaine et une requête aboutissent à l'affichage d'une page.
