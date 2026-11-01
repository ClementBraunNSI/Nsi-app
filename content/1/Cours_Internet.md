---
title: Internet
description: >-
  L'histoire et le fonctionnement du réseau mondial, des pionniers à la
  révolution TCP/IP.
level: '2'
chapter: Internet
icon: "globe"
prerequisites: []
audience: public
---

> **Définition : Internet**
> **Internet** est un réseau informatique à l'échelle mondiale. Le mail, le transfert de fichiers, la navigation sur le Web et beaucoup d'autres applications s'appuient dessus.

Quand on dit « je vais sur Internet », on pense souvent à un site ou à une application. En réalité, on utilise un immense réseau de machines qui s'échangent des données. Ce cours montre comment ce réseau s'est construit, puis comment une information trouve son chemin d'un appareil à un autre.

## Les origines d'Internet

Dans les années 1960, des laboratoires et des universités cherchent un moyen de relier des ordinateurs qui, jusque-là, ne se parlent pas. Le projet s'appelle ARPANET. Il est financé par la Defense Advanced Research Projects Agency, l'agence de recherche de l'armée américaine. Il s'agit alors simplement de permettre à des machines éloignées de s'échanger des données.

Le 29 octobre 1969, la première communication a lieu entre l'université de Californie à Los Angeles et le Stanford Research Institute. On tente d'envoyer le mot `login`. La liaison tombe après les deux premières lettres. L'épisode est pourtant resté célèbre, car c'est la première fois que deux machines de ce réseau communiquent vraiment.

Dans les années 1970 et 1980, on comprend qu'il faut des règles communes. Ces règles s'appellent des **protocoles**. Sans elles, chaque constructeur inventerait sa façon d'envoyer un message, et les machines ne se comprendraient plus.

En 1983, ARPANET adopte TCP/IPv4. La même année, on pose les règles du système de noms de domaine, le DNS. Ces deux décisions rendent le réseau utilisable à grande échelle. TCP/IP fixe une façon unique d'acheminer les données, et le DNS permet de désigner les machines par des noms faciles à retenir.

Au début des années 1990, Tim Berners-Lee et Robert Cailliau, au CERN, inventent le World Wide Web. Internet existait déjà, mais le Web change la manière de l'utiliser : on passe d'un document à l'autre en suivant des liens.

![Tim Berners-Lee et Robert Cailliau](/content/1/tblrc.jpeg)

Aujourd'hui, plus de quatre milliards de personnes utilisent ce réseau pour écrire, envoyer des fichiers ou consulter des quantités de données qu'aucune bibliothèque ne pourrait tenir sur des étagères.

![Réseau ARPANET](/content/1/arpanet.jpeg)

> Au départ, ARPANET ne reliait que quatre sites : l'université de Californie à Los Angeles, le Stanford Research Institute, l'université de Californie à Santa Barbara et l'université de l'Utah. Le réseau mondial d'aujourd'hui est né de ce projet très modeste.

![Carte mondiale d'Internet](/content/1/geo-mercator.svg)

## Les éléments d'un réseau

> **Définition : réseau informatique**
> Un **réseau informatique** est un ensemble de machines reliées, par différents moyens, qui communiquent entre elles pour échanger des données.

Dans une salle de classe ou dans une maison, on trouve des appareils, des boîtiers, et des câbles ou des ondes. Chaque élément a un rôle précis. On les confond souvent, parce que la box du salon joue plusieurs de ces rôles à la fois.

Les **machines** sont les appareils qui communiquent, comme un ordinateur, une tablette, une console ou un téléphone. Le **switch** les relie entre elles tant qu'elles restent dans le même réseau local. La box de la maison fait souvent ce travail. Un switch dédié, avec des prises RJ45, fait la même chose dans une salle informatique.

Le **routeur** sert à autre chose. Il permet de sortir du réseau local pour rejoindre Internet, ou un autre réseau. Là encore, la box joue souvent ce rôle en plus du switch. Dans un lycée ou une entreprise, le routeur est parfois un appareil à part.

Enfin, il faut un **support** pour que le signal circule. Ce peut être un câble Ethernet, de la fibre optique, ou le Wi-Fi. Le support ne lit pas le message, il se contente de le transporter.

Les réseaux se distinguent aussi par leur taille. Un **réseau local**, ou LAN, reste dans un même lieu, comme une maison, un bureau ou le lycée. **Internet** est un WAN : c'est un réseau de réseaux, qui relie entre eux des réseaux locaux du monde entier.

![Schéma réseau local et Internet](/content/1/rlinternet.png)

## Comment une machine est reconnue

Une machine possède une ou plusieurs **cartes réseau**. C'est par elles qu'elle communique, avec les machines voisines ou avec Internet. Chaque carte a une adresse qui lui est propre.

> **Adresse MAC**
> L'adresse **MAC** (*Media Access Control*) est aussi appelée **adresse physique**. C'est l'adresse utilisée par le port Ethernet et par le protocole Ethernet.

Elle s'écrit en six blocs de deux caractères hexadécimaux, par exemple `a1:b2:c3:d4:e5:f6`. L'hexadécimal compte avec seize symboles, de 0 à 9 puis de A à F. Cette adresse ne sert que dans le réseau local, et elle est unique au monde : deux cartes ne portent pas la même.

Pour sortir sur Internet, la MAC ne suffit plus. Il faut une adresse que les routeurs du monde entier sachent lire.

> **Adresse IP**
> Une **adresse IP** (*Internet Protocol*), en version 4, est formée de quatre nombres compris entre 0 et 255. La machine les manipule en binaire, mais les humains les lisent en décimal.

`127.0.0.1` est un exemple qu'on croise souvent : c'est *localhost*, l'adresse par laquelle une machine se parle à elle-même.

## Le masque de sous-réseau

Une adresse IP seule ne dit pas tout. Il faut aussi un **masque** pour séparer la partie qui désigne le réseau de la partie qui désigne la machine. C'est un peu comme une adresse postale, dans laquelle le masque indiquerait où s'arrête le nom du quartier et où commence le numéro de la maison.

Avec `192.168.1.42` et le masque `255.255.255.0`, les trois premiers nombres, `192.168.1`, désignent le réseau local. Le `42` désigne la machine dans ce réseau. Le masque permet ainsi de savoir si une autre machine se trouve dans le même réseau local, ou s'il faut passer par le routeur pour la joindre. À la maison ou au lycée, le masque le plus courant est justement `255.255.255.0`, qu'on note aussi `/24`.

Pour retrouver l'adresse du réseau, on fait un **ET binaire** entre l'adresse IP et le masque. Rappel :

- `1 & 1 = 1`
- `1 & 0 = 0`
- `0 & 1 = 0`
- `0 & 0 = 0`

Prenons le dernier octet de `192.168.1.42`, puisque le masque y vaut 0. En binaire, 42 s'écrit `00101010` et 0 s'écrit `00000000`. Le ET des deux donne `00000000`, donc 0. L'adresse du réseau est **`192.168.1.0`**. Les trois premiers octets, masqués par 255, restent inchangés.

## Comment les données voyagent : TCP/IP

Les adresses indiquent *qui* communique, mais pas *comment* le message est transporté.

> **Protocole TCP/IP**
> **TCP/IP** est le protocole de communication qui permet l'échange de données entre machines sur Internet. C'est le langage commun grâce auquel des appareils très différents arrivent à se comprendre.

Ce travail est découpé en quatre couches, qui ont chacune un rôle précis. Cliquer sur chaque couche pour voir ce qu'elle prend en charge, avec une analogie simple.

<TcpIpLayers />

Quand une page web est demandée, les données descendent ces couches les unes après les autres, un peu comme des enveloppes glissées les unes dans les autres. C'est ce qu'on appelle l'encapsulation.

<EncapsulationVisualizer />

Sur Internet, on n'envoie pas le fichier d'un seul bloc. On le découpe en petits **paquets**, qui peuvent prendre des chemins différents. Les routeurs choisissent la route un peu comme un GPS, en tenant compte de l'état du trafic et pas seulement de la distance. Quand une liaison est encombrée, le paquet peut faire un détour s'il arrive ainsi plus vite.

<PacketTracer />

Le simulateur ci-dessus permet de lancer un ping et de voir le trajet d'un paquet à travers les routeurs.

## Le DNS

Les machines communiquent avec des adresses IP, par exemple `142.250.179.142`. Une telle adresse est difficile à retenir, c'est pourquoi on utilise plutôt des noms comme `google.com`.

> **DNS (Domain Name System)**
> Le **DNS** est l'annuaire d'Internet. Il traduit un nom de domaine, lisible par un humain, en adresse IP, lisible par les machines.

Le principe est le même que dans le répertoire d'un téléphone : on cherche « Maman », et le téléphone compose le numéro correspondant. Le DNS fait la même chose pour les sites.

## Client-serveur et pair-à-pair

La plupart des services du quotidien, comme le Web, le mail ou le streaming, suivent le modèle **client-serveur**. Le client demande quelque chose et le serveur, chez Google ou chez Netflix par exemple, le lui fournit. C'est comme au restaurant, où le client commande et où la cuisine prépare le plat.

Le **pair-à-pair**, ou P2P, fonctionne autrement. Il n'y a pas de machine centrale. Chaque ordinateur est à la fois client et serveur, et les données passent directement de l'un à l'autre. C'est plus proche d'un repas où chacun apporte un plat et le partage.

## L'infrastructure physique d'Internet

On parle de « cloud », de nuage, comme si les données flottaient dans les airs. En réalité, elles sont stockées dans des machines et circulent dans des câbles.

> Environ 99 % du trafic intercontinental passe sous les océans, dans des câbles de fibre optique. Les satellites ne portent qu'une petite part de ce trafic.

Cette infrastructure repose sur trois éléments. Il y a d'abord les **câbles**, posés sous les mers et sous les rues. Viennent ensuite les **data centers**, ces hangars pleins de serveurs où sont stockés les vidéos, les photos et les sites. Le « nuage » désigne donc en fait des ordinateurs qui appartiennent à d'autres. Enfin, les **points d'échange** (IXP) sont des carrefours où les réseaux d'Orange, de Free, de Google et des autres se branchent les uns aux autres pour s'échanger du trafic.
