---
title: 'Mini-projet : Carte GPS du Renard'
description: 'Modifier du code Python pour placer des points sur une carte interactive avec folium.'
level: seconde
chapter: Localisation
icon: "🗺️"
prerequisites:
  - tp_python_localisation
audience: public
---

# Mini-projet : Carte GPS du Renard

Le but de ce projet est de construire une carte interactive du passage du renard, en modifiant du code Python.
Dans ce projet, nous allons afficher une carte de France, poser des marqueurs, parcourir une liste de lieux, puis ajouter votre propre endroit.

La carte se met à jour à droite quand le programme crée une variable nommée `carte`.

*Attention : le programme doit toujours contenir `carte = folium.Map(...)`. Sans cette variable, rien ne s'affiche.*

## 1. Une carte de France 🗺️

Lancez ce code sans le modifier. Le centre `[46.5, 2.5]` vise le milieu de la France, et `zoom_start=6` montre le pays entier. Le message `Carte de France chargée !` confirme que le programme a tourné.

<CarteGpsPlayground initialCode="import folium

carte = folium.Map(location=[46.5, 2.5], zoom_start=6)

print('Carte de France chargée !')" />

## 2. Le marqueur de Paris 📍

Un marqueur se pose avec `folium.Marker([latitude, longitude], popup='...', tooltip='...').add_to(carte)`.

Paris : latitude `48.8566`, longitude `2.3522`.

<CarteGpsPlayground initialCode="import folium

carte = folium.Map(location=[46.5, 2.5], zoom_start=6)

# ↓ Décommentez les 2 lignes suivantes
# folium.Marker([48.8566, 2.3522], popup='Paris', tooltip='Capitale').add_to(carte)
# print('Marqueur Paris ajouté')

print('Décommentez le code pour afficher Paris')" />

Enlevez le `#` au début des deux lignes commentées, puis exécutez. Un clic sur le marqueur affiche `Paris`. Le survol affiche `Capitale`.

## 3. Lyon et Marseille 🏙️

Paris est déjà placé. Ajoutez Lyon et Marseille en complétant les `TODO`, sur le même modèle que Paris.

| Ville | Latitude | Longitude |
| --- | --- | --- |
| Lyon | 45.7640 | 4.8357 |
| Marseille | 43.2965 | 5.3698 |

<CarteGpsPlayground initialCode="import folium

carte = folium.Map(location=[46.5, 2.5], zoom_start=6)

folium.Marker([48.8566, 2.3522], popup='Paris').add_to(carte)

# TODO : marqueur pour Lyon
# TODO : marqueur pour Marseille

print('Ajoutez Lyon et Marseille')" />

Exemple pour Lyon, à adapter pour Marseille :

```python
folium.Marker([45.7640, 4.8357], popup='Lyon').add_to(carte)
```

Après exécution, les trois villes sont cliquables. Si un marqueur manque, relisez la latitude et la longitude : un couple inversé place la ville au mauvais endroit.

## 4. Une boucle sur les lieux 🔁

Plutôt que répéter le même code, on parcourt une liste de dictionnaires. `lieu['lat']` donne la latitude, `lieu['lon']` la longitude, `lieu['nom']` le nom.

<CarteGpsPlayground initialCode="import folium

lieux = [
    {'nom': 'Paris', 'lat': 48.8566, 'lon': 2.3522},
    {'nom': 'Lyon', 'lat': 45.7640, 'lon': 4.8357},
    {'nom': 'Marseille', 'lat': 43.2965, 'lon': 5.3698},
    {'nom': 'Lille', 'lat': 50.6292, 'lon': 3.0573},
]

carte = folium.Map(location=[46.8, 2.5], zoom_start=6)

# TODO : for lieu in lieux:
#           folium.Marker([lieu['lat'], lieu['lon']], popup=lieu['nom']).add_to(carte)

print('Écrivez la boucle for')" />

La boucle attendue :

```python
for lieu in lieux:
    folium.Marker([lieu['lat'], lieu['lon']], popup=lieu['nom']).add_to(carte)
```

Les quatre villes du tableau apparaissent : Paris, Lyon, Marseille et Lille. Ajouter une cinquième ville se fait dans la liste `lieux`, pas en recopiant un `Marker`.

## 5. Votre lieu 🏫

Personnalisez la carte avec votre ville ou votre établissement. Cherchez les coordonnées sur [openstreetmap.org](https://www.openstreetmap.org) : clic droit, puis « Afficher l'adresse ».

<CarteGpsPlayground initialCode="import folium

carte = folium.Map(location=[46.5, 2.5], zoom_start=6)

villes = [
    ('Paris', 48.8566, 2.3522),
    ('Lyon', 45.7640, 4.8357),
]

for nom, lat, lon in villes:
    folium.Marker([lat, lon], popup=nom).add_to(carte)

# TODO : remplacez NOM, LAT et LON par votre lieu
# folium.Marker([LAT, LON], popup='NOM', icon=folium.Icon(color='green')).add_to(carte)

print('Ajoutez votre marqueur vert')" />

Décommentez la ligne du marqueur vert et remplacez `NOM`, `LAT` et `LON`. Le marqueur vert est le vôtre : il se distingue de Paris et de Lyon. `folium.Icon(color='green')` fixe la couleur.

## 6. Le trajet (bonus) 🧵

Un trajet se dessine avec `folium.PolyLine` : une ligne entre plusieurs coordonnées, dans l'ordre de la liste.

<CarteGpsPlayground initialCode="import folium

carte = folium.Map(location=[46.5, 2.5], zoom_start=6)

trajet = [
    [48.8566, 2.3522],
    [45.7640, 4.8357],
]

folium.Marker(trajet[0], popup='Paris').add_to(carte)
folium.Marker(trajet[1], popup='Lyon').add_to(carte)

# ↓ Décommentez pour tracer le trajet
# folium.PolyLine(trajet, color='blue', weight=4, opacity=0.8).add_to(carte)

print('Tracez le trajet Paris → Lyon')" />

Décommentez la ligne `PolyLine`. Une ligne bleue relie Paris à Lyon. `weight=4` règle l'épaisseur, `opacity=0.8` la transparence.

**Ce qu'on rend.** Le programme de l'étape 5, avec Paris, Lyon, et votre marqueur vert aux coordonnées que vous avez cherchées. Le nom dans `popup` est celui de votre lieu. Si vous faites le bonus, le trajet Paris → Lyon est dans le même fichier.

Sur votre ordinateur, en dehors de cette page, `carte.save('ma_carte.html')` écrit la carte dans un fichier qu'on ouvre dans le navigateur.
