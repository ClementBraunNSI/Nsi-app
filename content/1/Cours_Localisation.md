---
title: La Géolocalisation
description: 'Fonctionnement du GPS, enjeux de vie privée et cartographie numérique.'
level: '2'
chapter: Localisation
icon: "\U0001F30D"
prerequisites: []
---

> **📖 Définition : Géolocalisation**
> **La géolocalisation** est une technique permettant de situer de manière précise un lieu, une personne ou un objet sur la planète grâce à des coordonnées géographiques.

## 📅 Point Historique

> **📚 L'évolution du GPS**
>
> *   **Années 1960** : L'armée américaine développe le **GPS (Global Positioning System)** pour améliorer la précision de ses opérations militaires.
> *   **Années 1980** : Le premier satellite GPS est envoyé dans l'espace.
> *   **Années 1990** : Le GPS devient accessible au grand public.
> *   **Aujourd'hui** : La géolocalisation est omniprésente (smartphones, voitures, montres connectées, etc.).

D'autres puissances ont développé leurs propres systèmes :
*   🇪🇺 **Galileo** (Europe, plus précis que le GPS)
*   🇷🇺 **GLONASS** (Russie)
*   🇨🇳 **BeiDou** (Chine)

<Quiz 
  question="Quel est le nom du système de positionnement par satellite européen ?" 
  options={["GPS", "Galileo", "GLONASS", "BeiDou"]} 
  answer={1} 
  explanation="Galileo est le système européen, souvent plus précis que le GPS américain car plus récent."
/>

## 📍 Coordonnées Géographiques

Pour localiser un point sur Terre, on utilise un système de coordonnées en trois dimensions :

| Coordonnée | Définition | Unité | Exemple (Paris) |
|------------|------------|-------|------------------|
| **Latitude** | Angle par rapport à l'équateur (Nord/Sud) | Degrés | 48.8588897° N |
| **Longitude** | Angle par rapport au méridien de Greenwich (Est/Ouest) | Degrés | 2.320041° E |
| **Altitude** | Hauteur par rapport au niveau de la mer | Mètres | 35 m |

<Quiz 
  question="Que représente la Latitude ?" 
  options={["La position Est/Ouest", "La hauteur par rapport à la mer", "La position Nord/Sud par rapport à l'équateur", "La vitesse de déplacement"]} 
  answer={2} 
  explanation="La Latitude indique si on est au Nord ou au Sud de l'équateur (0°)."
/>

<GpsCoordinates />

## 🛰️ Fonctionnement par Satellite

### La Trilatération

> **📖 Définition : Trilatération**
> **La trilatération** est la technique mathématique utilisée pour déterminer une position en mesurant les distances depuis au moins trois points de référence connus (les satellites).

**Le processus :**
1.  Le récepteur GPS capte les signaux d'au moins **4 satellites** (3 pour la position, 1 pour la synchronisation temporelle).
2.  Il calcule la distance grâce au temps de trajet du signal ($d = v \times t$, avec $v = 300\,000 \text{ km/s}$).
3.  L'intersection des sphères de distance donne la position exacte.

<Quiz 
  question="Combien de satellites sont nécessaires au minimum pour obtenir une position GPS précise (latitude, longitude et altitude) ?" 
  options={["1", "2", "3", "4"]} 
  answer={3} 
  explanation="Il faut 3 satellites pour trianguler la position (X, Y, Z) et un 4ème pour synchroniser l'horloge du récepteur avec celle, atomique, des satellites."
/>

!!! warning "Précision du signal"
    La précision dépend de nombreux facteurs : nombre de satellites visibles, météo, obstacles (bâtiments, tunnels) et qualité du récepteur.

### 🎮 Activité Interactive

Comprenez le principe de la trilatération en manipulant les satellites pour retrouver le renard !

<TrilaterationMap />

## 🗺️ Cartographie Numérique

Une fois que l'on connaît sa position (latitude, longitude), il faut l'afficher sur une carte. Il existe deux façons de représenter une carte numérique :

### 1. Cartes Matricielles (Raster)
C'est une **image** composée de pixels (comme une photo satellite ou une carte papier scannée).
*   **Avantage** : Très détaillé, réaliste (photo aérienne).
*   **Inconvénient** : Si on zoome trop, l'image devient floue (pixelisée). Elle prend beaucoup de place en mémoire.
*   *Exemple : Vue "Satellite" de Google Maps.*

### 2. Cartes Vectorielles
C'est un **dessin** mathématique composé de formes géométriques (points, lignes, polygones).
*   **Avantage** : On peut zoomer à l'infini sans perte de qualité (c'est toujours net). Le fichier est très léger. On peut changer le style (couleurs, nuit/jour) facilement.
*   **Inconvénient** : Moins réaliste qu'une photo.
*   *Exemple : Vue "Plan" de Google Maps, Waze, OpenStreetMap.*

| Type | Composition | Zoom | Usage |
|------|-------------|------|-------|
| **Matricielle** | Pixels (Image) | Flou si zoomé | Photo aérienne, Scan |
| **Vectorielle** | Formes (Maths) | Toujours net | GPS, Plans de ville |

## 🛣️ Calcul d'Itinéraires

Les applications comme **Google Maps** ou **Waze** utilisent des algorithmes (comme l'algorithme de Dijkstra) pour trouver le meilleur chemin en fonction de :
*   La distance (plus court)
*   Le temps (plus rapide)
*   Le trafic (embouteillages, accidents)
*   Les préférences (sans péage, à pied, à vélo)

## 💻 Le Protocole NMEA-0183

> **📖 Définition : NMEA**
> Le protocole **NMEA-0183** est un standard textuel qui permet aux récepteurs GPS de communiquer leurs données (position, heure, qualité du signal) aux autres appareils.

### Structure d'une trame `$GPGGA`

Exemple de trame reçue :
```text
$GPGGA,064036.289,4836.5375,N,00740.9373,E,1,04,3.2,200.2,M,,,,0000*0E
```

Utilisez le décodeur ci-dessous pour analyser cette trame ou tester d'autres exemples :

<NmeaDecoder />

## 📝 Exercices d'Application

### Exercice 1 : Localisation du lycée
1.  Sur votre téléphone ou sur Google Maps, retrouvez les coordonnées GPS exactes du lycée.
2.  Notez-les au format décimal (ex: 48.85, 2.35) et au format DMS (Degrés, Minutes, Secondes).

### Exercice 2 : Exploration urbaine
1.  Recherchez les coordonnées GPS de la **Tour Eiffel** à Paris et de la **Statue de la Liberté** à New York.
2.  Calculez la distance à vol d'oiseau entre ces deux lieux (vous pouvez utiliser un outil comme [Lexilogos](https://www.lexilogos.com/calcul_distances.htm)).

### Exercice 3 : Métadonnées EXIF
Les photos numériques contiennent souvent des métadonnées (EXIF) incluant les coordonnées GPS de la prise de vue.
1.  Retrouvez les coordonnées GPS d'une photo prise avec votre smartphone (si la localisation était activée).
2.  Pourquoi cela peut-il poser un problème de **vie privée** si vous partagez cette photo sur les réseaux sociaux ?

!!! danger "Attention à vos données"
    La géolocalisation permet de vous suivre à la trace. Pensez à désactiver la localisation de l'appareil photo si vous souhaitez préserver votre anonymat géographique.

### Exercice 4 : Décodage de trames NMEA
À l'aide d'un décodeur en ligne (ex: [NMEA Decoder](https://rl.se/gprmc)) ou manuellement, identifiez les villes correspondant aux trames suivantes :

```text
$GPGGA,175737.303,4449.833,N,00034.772,W,1,04,1.0,0.0,M,0.0,M,,*7C
$GPGGA,175736.303,5038.047,N,00303.695,E,1,03,1.0,0.0,M,0.0,M,,*68
$GPGGA,175738.303,4545.175,N,00450.039,E,1,12,1.0,0.0,M,0.0,M,,*69
```

### Exercice 5 : Analyse détaillée
Analysez la trame suivante :
```text
$GPGGA,175736.303,4533.786,N,00554.803,E,1,05,1.0,154.3,M,0.0,M,,*68
```
1.  **Combien de satellites** ont été utilisés pour ce relevé ?
2.  **À quelle altitude** se trouve l'objet ?
3.  À quelle ville correspondent approximativement les coordonnées **45°33' N, 5°54' E** ?
