---
title: "La Géolocalisation"
description: "Comprendre le fonctionnement du GPS, la trilatération et le protocole NMEA"
level: "seconde"
chapter: 6
icon: "map-pin"
---

# 1. Point Historique et Définitions

> **Historique**
>
> La géolocalisation trouve ses origines dans les besoins militaires des années **1960**. L'armée américaine développe alors le **GPS (Global Positioning System)** pour améliorer la précision de ses opérations.
>
> Le premier satellite GPS est envoyé dans l'espace dans les **années 1980**.
>
> Dans les **années 1990**, le GPS devient accessible au grand public.
>
> D'autres puissances développent leurs propres systèmes : l'Europe lance **Galileo** (plus précis que le GPS américain), la Russie dispose de **GLONASS**, et la Chine développe **BeiDou**.

> **Définition** : **La géolocalisation** est une technique permettant de situer de manière précise un lieu, une personne ou un objet sur la planète grâce à des coordonnées géographiques.

Pour localiser un point sur Terre, on utilise un système de coordonnées basé sur trois dimensions :

| Coordonnée | Définition | Unité | Exemple (Paris) |
|------------|------------|-------|------------------|
| **Latitude** | Angle par rapport à l'équateur | Degrés | 48.8588897° N |
| **Longitude** | Angle par rapport au méridien de Greenwich | Degrés | 2.320041° E |
| **Altitude** | Hauteur par rapport au niveau de la mer | Mètres | 35 m |

![coordonnees_geographiques](im1.png)
![latitude_longitude](im2.png)

# 2. Fonctionnement de la géolocalisation par satellite

> **Définition** : **La trilatération** est la technique mathématique utilisée pour déterminer une position en mesurant les distances depuis au moins trois points de référence connus (les satellites).

Chaque satellite émet un signal contenant l'heure précise d'émission et sa position. Le récepteur GPS calcule le temps de trajet du signal pour déterminer sa distance à chaque satellite.

### Le processus de localisation

**Étape 1 :** Le récepteur GPS capte les signaux d'au moins **4 satellites**
- 3 satellites pour déterminer la position (x, y, z)
- 1 satellite supplémentaire pour la synchronisation temporelle

**Étape 2 :** Calcul des distances grâce au temps de trajet des signaux
- Vitesse du signal = vitesse de la lumière (300 000 km/s)
- Distance = Vitesse × Temps de trajet

**Étape 3 :** Résolution mathématique pour trouver le point d'intersection

> **Note** : La précision dépend de nombreux facteurs : nombre de satellites visibles, conditions météorologiques, obstacles (bâtiments, relief), qualité du récepteur.

### Applications : Le calcul d'itinéraires

Les systèmes de navigation utilisent des **algorithmes de routage** (comme l'algorithme de Dijkstra) pour calculer le meilleur chemin.

| Critère | Description | Exemple |
|---------|-------------|----------|
| **Distance** | Chemin le plus court | 15 km vs 18 km |
| **Temps** | Trajet le plus rapide | 20 min vs 25 min |
| **Trafic** | Conditions en temps réel | Embouteillages, accidents |

# 3. Le protocole NMEA-0183

> **Définition** : **Le protocole NMEA-0183** est un standard de communication pour transmettre les données de géolocalisation sous forme de trames textuelles.

### Formats de coordonnées

| Format | Description | Exemple (Paris) |
|--------|-------------|------------------|
| **Décimal** | Degrés avec décimales | 48.8588897° N |
| **DMS** | Degrés, Minutes, Secondes | 48°51'32'' N |
| **NMEA** | Degrés et minutes décimales | 4851.533' N |

> **Conversion** : 1 degré = 60 minutes, 1 minute = 60 secondes

### Structure d'une trame NMEA

**Exemple de trame GPGGA (position GPS) :**

```
$GPGGA,064036.289,4836.5375,N,00740.9373,E,1,04,3.2,200.2,M,,,,0000*0E
```

| Champ | Valeur | Signification |
|-------|--------|---------------|
| **$GPGGA** | Type de trame | Global Positioning System Fix Data |
| **064036.289** | Heure UTC | 06h 40min 36,289s |
| **4836.5375,N** | Latitude | 48°36,5375' Nord |
| **00740.9373,E** | Longitude | 7°40,9373' Est |
| **1** | Qualité du signal | 1 = GPS fixe |
| **04** | Nombre de satellites | 4 satellites utilisés |
| **3.2** | Précision horizontale | 3,2 mètres |
| **200.2,M** | Altitude | 200,2 mètres |

# 4. Applications pratiques

### Exercices sur les coordonnées GPS

**Activité 1 : Localisation du lycée**
Retrouvez les coordonnées GPS du lycée sur votre téléphone ou Google Maps.

**Activité 2 : Exploration urbaine**
Recherchez les coordonnées GPS de la Tour Eiffel et de la Statue de la Liberté. Calculez la distance entre ces deux lieux.

**Activité 3 : Métadonnées de photos**
Retrouvez les coordonnées GPS des lieux où ont été prises des photos grâce à leurs métadonnées EXIF.

### Exercices de décodage NMEA

**Activité 4 : Décodage de trames**
Identifiez les villes correspondant aux trames NMEA suivantes :

```
$GPGGA,175737.303,4449.833,N,00034.772,W,1,04,1.0,0.0,M,0.0,M,,*7C
$GPGGA,175736.303,5038.047,N,00303.695,E,1,03,1.0,0.0,M,0.0,M,,*68
$GPGGA,175738.303,4545.175,N,00450.039,E,1,12,1.0,0.0,M,0.0,M,,*69
```

**Activité 5 : Analyse détaillée**
Analysez la trame suivante :

```
$GPGGA,175736.303,4533.786,N,00554.803,E,1,05,1.0,154.3,M,0.0,M,,*68
```

- Combien de satellites ont été utilisés ?
- À quelle hauteur est situé l'objet ?
- À quelle ville correspondent ces coordonnées : 41.921; 8.735 ?

# 5. Enjeux et perspectives

La géolocalisation soulève des questions importantes :
- **Vie privée** : Traçabilité des déplacements, données personnelles
- **Sécurité** : Dépendance aux satellites, vulnérabilité aux interférences
- **Précision** : Amélioration continue (Galileo, GPS III)

> **Attention** : La géolocalisation peut être utilisée à des fins de surveillance. Il est important de maîtriser les paramètres de confidentialité de vos appareils.
