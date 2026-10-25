---
title: La Géolocalisation
description: 'Fonctionnement du GPS, enjeux de vie privée et cartographie numérique.'
level: '2'
chapter: Localisation
icon: "earth"
prerequisites: []
audience: public
---

> **Définition : géolocalisation**
> La **géolocalisation** situe un lieu, une personne ou un objet sur la Terre à l'aide de coordonnées géographiques.

Un téléphone le fait plusieurs fois par jour, souvent sans qu'on le lui demande. Le cours sert à voir d'où vient cette position, comment on la calcule, et ce qu'elle révèle quand elle reste collée à une photo.

## D'un système militaire à une puce dans la poche

Dans les années 1960, l'armée américaine met au point le **GPS** (*Global Positioning System*) pour savoir où sont ses unités, avec une précision que les cartes papier ne donnaient pas. Le premier satellite est lancé dans les années 1980. Dans les années 1990, le signal devient accessible au public. Aujourd'hui, le même principe est dans les téléphones, les voitures et les montres.

Le GPS n'est pas le seul système. L'Europe a **Galileo**, en général plus précis que le GPS civil. La Russie a **GLONASS**, la Chine a **BeiDou**. Un téléphone récent en écoute souvent plusieurs à la fois, et recoupe.

## Trois nombres pour un point

Un point sur Terre se décrit avec trois coordonnées.

| Coordonnée | Définition | Unité | Exemple (Paris) |
|------------|------------|-------|------------------|
| **Latitude** | Angle par rapport à l'équateur, vers le nord ou le sud | Degrés | 48.8588897° N |
| **Longitude** | Angle par rapport au méridien de Greenwich, vers l'est ou l'ouest | Degrés | 2.320041° E |
| **Altitude** | Hauteur par rapport au niveau de la mer | Mètres | 35 m |

La latitude et la longitude suffisent à poser un point sur la carte. L'altitude dit si ce point est au sol, sur une colline, ou dans un immeuble. Sans elle, deux lieux l'un au-dessus de l'autre se confondent.

<GpsCoordinates />

## Comment le récepteur se situe

> **Définition : trilatération**
> La **trilatération** détermine une position en mesurant les distances à au moins trois points de référence connus. Ici, ces points sont des satellites.

Le récepteur n'envoie rien vers l'espace. Il écoute. Il capte les signaux d'au moins quatre satellites : trois pour la position dans l'espace, un quatrième pour recaler l'horloge, qui doit être extrêmement juste. La distance se déduit du temps de trajet. Le signal voyage à la vitesse de la lumière, environ 300 000 km/s, donc $d = v \times t$. Autour de chaque satellite, cette distance dessine une sphère. La position cherchée est à l'intersection de ces sphères.

La précision n'est pas garantie. Elle dépend du nombre de satellites visibles, de la météo, des obstacles (un immeuble, un tunnel) et de la qualité du récepteur. En ville, entre les façades, le signal rebondit et la position saute.

Les satellites se déplacent sur la carte pour retrouver le renard : c'est le même calcul, rendu visible.

<TrilaterationMap />

## Afficher le point sur une carte

Connaître 48,8° N et 2,3° E ne montre encore rien. Il faut une carte, et il en existe deux sortes.

Une carte **matricielle**, ou raster, est une image faite de pixels. Une photo satellite, ou une carte papier scannée, en sont des exemples. Le détail est réaliste. Si l'on zoome trop, les carrés apparaissent, et le fichier est lourd. C'est la vue Satellite de Google Maps.

Une carte **vectorielle** est un dessin mathématique : des points, des lignes, des polygones. On zoome sans perdre la netteté, le fichier reste léger, et l'on peut changer les couleurs, le mode nuit par exemple, sans refaire la carte. Elle est moins « vraie » qu'une photo. C'est la vue Plan, Waze, ou OpenStreetMap.

| Type | Composition | Zoom | Usage |
|------|-------------|------|-------|
| **Matricielle** | Pixels | Flou si l'on zoome trop | Photo aérienne, scan |
| **Vectorielle** | Formes | Reste net | GPS, plans de ville |

## Trouver un chemin

Une fois les deux points posés sur une carte vectorielle, encore faut-il les relier. Google Maps ou Waze s'appuient sur des algorithmes de plus court chemin, dont celui de Dijkstra. « Le meilleur » chemin n'est pas unique. On peut minimiser la distance, le temps, éviter un bouchon, refuser un péage, ou imposer la marche et le vélo. Le graphe des rues est le même. Ce qui change, c'est ce que l'on compte comme coût.

## La phrase que le GPS envoie

> **Définition : NMEA**
> Le protocole **NMEA-0183** est un standard texte. Le récepteur GPS s'en sert pour transmettre sa position, l'heure et la qualité du signal à un autre appareil.

Une trame `$GPGGA` ressemble à ceci :

```text
$GPGGA,064036.289,4836.5375,N,00740.9373,E,1,04,3.2,200.2,M,,,,0000*0E
```

Les champs se suivent, séparés par des virgules : l'heure, la latitude, l'hémisphère, la longitude, le nombre de satellites, l'altitude. Le décodeur ci-dessous les sépare. La trame de l'exemple peut y être collée, ou une autre.

<NmeaDecoder />

## Exercices d'application

### Exercice 1 : Localisation du lycée
1.  Sur un téléphone ou sur Google Maps, retrouver les coordonnées GPS exactes du lycée.
2.  Les noter au format décimal (ex: 48.85, 2.35) et au format DMS (Degrés, Minutes, Secondes).

### Exercice 2 : Exploration urbaine
1.  Rechercher les coordonnées GPS de la **Tour Eiffel** à Paris et de la **Statue de la Liberté** à New York.
2.  Calculer la distance à vol d'oiseau entre ces deux lieux (à l'aide d'un outil comme [Lexilogos](https://www.lexilogos.com/calcul_distances.htm)).

### Exercice 3 : Métadonnées EXIF
Les photos numériques contiennent souvent des métadonnées (EXIF) incluant les coordonnées GPS de la prise de vue.
1.  Retrouver les coordonnées GPS d'une photo prise avec un smartphone (si la localisation était activée).
2.  Pourquoi cela peut-il poser un problème de **vie privée** si cette photo est partagée sur les réseaux sociaux ?

!!! danger "Attention à les données"
    La géolocalisation permet de suivre quelqu'un à la trace. Penser à désactiver la localisation de l'appareil photo pour préserver son anonymat géographique.

### Exercice 4 : Décodage de trames NMEA
À l'aide d'un décodeur en ligne (ex: [NMEA Decoder](https://rl.se/gprmc)) ou manuellement, identifier les villes correspondant aux trames suivantes :

```text
$GPGGA,175737.303,4449.833,N,00034.772,W,1,04,1.0,0.0,M,0.0,M,,*7C
$GPGGA,175736.303,5038.047,N,00303.695,E,1,03,1.0,0.0,M,0.0,M,,*68
$GPGGA,175738.303,4545.175,N,00450.039,E,1,12,1.0,0.0,M,0.0,M,,*69
```

### Exercice 5 : Analyse détaillée
Analyser la trame suivante :
```text
$GPGGA,175736.303,4533.786,N,00554.803,E,1,05,1.0,154.3,M,0.0,M,,*68
```
1.  **Combien de satellites** ont été utilisés pour ce relevé ?
2.  **À quelle altitude** se trouve l'objet ?
3.  À quelle ville correspondent approximativement les coordonnées **45°33' N, 5°54' E** ?
