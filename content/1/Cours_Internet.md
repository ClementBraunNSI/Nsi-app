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

Quand on dit « je vais sur Internet », on pense souvent à un site ou à une application. En réalité, on utilise un immense réseau de machines qui s'échangent des données. Le cours d'aujourd'hui sert à voir comment ce réseau s'est construit, puis comment une information trouve son chemin d'un appareil à un autre.

## D'où vient Internet

L'idée n'est pas née dans un garage. Dans les années 1960, des laboratoires et des universités cherchent un moyen de relier des ordinateurs qui, jusque-là, ne se parlent pas. Le projet s'appelle ARPANET. Il est financé par la Defense Advanced Research Projects Agency, l'agence de recherche de l'armée américaine. Le but n'est pas encore de regarder des vidéos : on veut que des machines distantes puissent s'échanger des données.

Le 29 octobre 1969, la première communication a lieu entre l'université de Californie à Los Angeles et le Stanford Research Institute. On tente d'envoyer le mot `login`. La liaison tombe après les deux premières lettres. On retient quand même l'épisode : c'est la première fois que deux machines de ce réseau se parlent vraiment.

Dans les années 1970 et 1980, on comprend qu'il faut des règles communes. Ces règles s'appellent des **protocoles**. Sans elles, chaque constructeur inventerait sa façon d'envoyer un message, et les machines ne se comprendraient plus.

En 1983, ARPANET adopte TCP/IPv4. La même année, on pose les règles du système de noms de domaine, le DNS. Ce sont deux décisions discrètes, et pourtant ce sont elles qui rendent le réseau utilisable à grande échelle : une façon unique d'acheminer les données, et une façon humaine de nommer les machines.

Au début des années 1990, Tim Berners-Lee et Robert Cailliau, au CERN, inventent le World Wide Web. Internet existait déjà. Le Web, lui, change la manière d'y accéder : on passe d'une machine à l'autre en suivant des liens.

![Tim Berners-Lee et Robert Cailliau](/content/1/tblrc.jpeg)

Aujourd'hui, plus de quatre milliards de personnes utilisent ce réseau pour écrire, envoyer des fichiers ou consulter des quantités de données qu'aucune bibliothèque ne pourrait tenir sur des étagères.

![Réseau ARPANET](/content/1/arpanet.jpeg)

> Au départ, on ne voulait relier que trois universités : Stanford, Los Angeles et l'Utah. Le réseau qu'on a dans la poche est sorti de ce projet très limité.

![Carte mondiale d'Internet](/content/1/geo-mercator.svg)

## De quoi est fait un réseau

> **Définition : réseau informatique**
> Un **réseau informatique** est un ensemble de machines reliées, par différents moyens, qui communiquent entre elles pour échanger des données.

Regarder une salle de classe, ou une maison. Il y a des appareils, des boîtiers, et des câbles ou des ondes. Chacun a un rôle, et on les confond souvent parce que la box du salon en cumule plusieurs.

Les **machines** sont celles qui veulent parler : ordinateur, tablette, console, téléphone. Le **switch** les relie entre elles tant qu'elles restent dans le même réseau local. La box de la maison fait souvent ce travail. Un switch dédié, avec des prises RJ45, fait la même chose dans une salle informatique.

Le **routeur** sert à autre chose. Il fait sortir du réseau local pour rejoindre Internet, ou un autre réseau. Là encore, la box joue souvent ce rôle en plus du switch. Dans un lycée ou une entreprise, le routeur est parfois un appareil à part.

Enfin, il faut un **support** pour que le signal circule. Ce peut être un câble Ethernet, de la fibre optique, ou le Wi-Fi. Le support ne « comprend » pas le message. Il le transporte.

On distingue ensuite l'échelle. Un **réseau local**, ou LAN, reste dans un même lieu : une maison, un bureau, le lycée. **Internet** est un WAN, un réseau de réseaux : des réseaux locaux du monde entier, reliés les uns aux autres.

![Schéma réseau local et Internet](/content/1/rlinternet.png)

## Comment une machine est reconnue

Une machine possède une ou plusieurs **cartes réseau**. C'est par elles qu'elle parle, soit aux voisines, soit vers Internet. Chaque carte a une adresse qui lui est propre.

> **Adresse MAC**
> L'adresse **MAC** (*Media Access Control*) est aussi appelée **adresse physique**. C'est l'adresse utilisée par le port Ethernet et par le protocole Ethernet.

Elle s'écrit en six blocs de deux caractères hexadécimaux, par exemple `a1:b2:c3:d4:e5:f6`. L'hexadécimal compte avec seize symboles, de 0 à 9 puis de A à F. Cette adresse ne sert que dans le réseau local, et elle est unique au monde : deux cartes ne portent pas la même.

Pour sortir sur Internet, la MAC ne suffit plus. Il faut une adresse que les routeurs du monde entier sachent lire.

> **Adresse IP**
> Une **adresse IP** (*Internet Protocol*), en version 4, est formée de quatre nombres compris entre 0 et 255. La machine les manipule en binaire. Les humains les lisent en décimal.

`127.0.0.1` est un exemple qu'on croise souvent : c'est *localhost*, l'adresse par laquelle une machine se parle à elle-même.

## Le masque, ou comment savoir si l'on reste chez soi

Une adresse IP seule ne dit pas tout. Il faut aussi un **masque** pour séparer la partie qui désigne le réseau de la partie qui désigne la machine. Penser à une adresse postale : le masque indique où s'arrête le nom du quartier et où commence le numéro de la maison.

Avec `192.168.1.42` et le masque `255.255.255.0`, les trois premiers nombres, `192.168.1`, désignent le réseau local. Le `42` désigne la machine dans ce réseau. La question pratique est simple : cette machine est-elle chez moi, ou faut-il passer par le routeur ? À la maison ou au lycée, le masque le plus courant est justement `255.255.255.0`, qu'on note aussi `/24`.

Pour retrouver l'adresse du réseau, on fait un **ET binaire** entre l'adresse IP et le masque. Rappel :

- `1 & 1 = 1`
- `1 & 0 = 0`
- `0 & 1 = 0`
- `0 & 0 = 0`

Prenons le dernier octet de `192.168.1.42`, puisque le masque y vaut 0. En binaire, 42 s'écrit `00101010` et 0 s'écrit `00000000`. Le ET des deux donne `00000000`, donc 0. L'adresse du réseau est **`192.168.1.0`**. Les trois premiers octets, masqués par 255, restent inchangés.

## Comment les données voyagent : TCP/IP

Les adresses disent *qui* parle. Elles ne disent pas encore *comment* le message est transporté.

> **Protocole TCP/IP**
> **TCP/IP** est le protocole de communication qui permet l'échange de données entre machines sur Internet. C'est le langage commun grâce auquel des appareils très différents arrivent à se comprendre.

On découpe ce travail en quatre couches. Chacune a un rôle précis, et aucune ne fait le travail des autres. Cliquer sur chaque couche pour voir ce qu'elle prend en charge, avec une analogie simple.

<TcpIpLayers />

Quand une page web est demandée, les données descendent ces couches les unes après les autres, un peu comme des enveloppes empilées. C'est l'encapsulation.

<EncapsulationVisualizer />

Sur Internet, on n'envoie pas le fichier d'un seul bloc. On le découpe en petits **paquets**, qui peuvent prendre des chemins différents. Les routeurs choisissent un peu comme un GPS : ils regardent l'état du trafic, pas seulement la distance. Si une liaison est encombrée, le paquet part par un détour, pourvu qu'il arrive plus vite.

<PacketTracer />

Le simulateur ci-dessus permet de lancer un ping et de voir le trajet d'un paquet à travers les routeurs.

## Le DNS, l'annuaire

Les machines se parlent avec des adresses IP, par exemple `142.250.179.142`. Personne n'a envie de retenir ça pour ouvrir un site. On préfère `google.com`.

> **DNS (Domain Name System)**
> Le **DNS** est l'annuaire d'Internet. Il traduit un nom de domaine, lisible par un humain, en adresse IP, lisible par les machines.

C'est le même geste que chercher « Maman » dans le répertoire du téléphone : on connaît le nom, l'appareil compose le numéro. Le DNS fait cela pour les sites.

## Deux façons de s'organiser

La plupart des services du quotidien, le Web, le mail, le streaming, suivent le modèle **client-serveur**. Le client demande quelque chose. Le serveur, chez Google ou chez Netflix, le fournit. Au restaurant, le client commande et la cuisine prépare : les rôles ne sont pas les mêmes.

Le **pair-à-pair**, ou P2P, fonctionne autrement. Il n'y a pas de machine centrale. Chaque ordinateur est à la fois client et serveur, et les données passent directement de l'un à l'autre. C'est plus proche d'un repas où chacun apporte un plat et le partage.

## Internet est physique

On parle de « cloud », de nuage, comme si les données flottaient. Elles sont dans des machines, et elles circulent dans des câbles.

> Environ 99 % du trafic intercontinental passe sous les océans, dans des câbles de fibre optique. Les satellites ne portent qu'une petite part de ce trafic.

Trois éléments tiennent l'ensemble. Il y a d'abord les **câbles**, posés sous les mers et sous les rues. Viennent ensuite les **data centers**, ces hangars pleins de serveurs où sont stockés les vidéos, les photos et les sites. Le « nuage » n'est donc rien d'autre que l'ordinateur de quelqu'un d'autre. Enfin, les **points d'échange** (IXP) sont des carrefours où les réseaux d'Orange, de Free, de Google et des autres se branchent les uns aux autres pour s'échanger du trafic.
