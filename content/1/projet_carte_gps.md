---
title: 'Mini-projet : Carte GPS du Renard'
description: 'Modifier du code Python pour placer des points sur une carte interactive avec folium.'
level: seconde
chapter: Localisation
icon: "🗺️"
prerequisites:
  - tp_python_localisation
---

# Mini-projet : Carte GPS du Renard

Le renard 🦊 a laissé des traces de son passage dans plusieurs villes de France. Votre mission : **modifier le code Python** pour construire une carte interactive et y placer des marqueurs GPS.

> **Comment ça marche ?**
> - Modifiez le code dans l'éditeur (décommentez les lignes, complétez les `TODO`, changez les coordonnées…)
> - Cliquez sur **Exécuter**
> - La carte se met à jour à droite si votre programme crée une variable nommée `carte`

**Règle importante :** votre programme doit toujours contenir une variable `carte` créée avec `folium.Map(...)`.

---

## Étape 1 — Afficher une carte de France

Lancez ce code sans le modifier pour vérifier que tout fonctionne.

<CarteGpsPlayground initialCode="import folium

carte = folium.Map(location=[46.5, 2.5], zoom_start=6)

print('Carte de France chargée !')" />

---

## Étape 2 — Ajouter Paris

**Mission :** décommentez les lignes indiquées pour placer un marqueur sur Paris.

<CarteGpsPlayground initialCode="import folium

carte = folium.Map(location=[46.5, 2.5], zoom_start=6)

# ↓ Décommentez les 2 lignes suivantes
# folium.Marker([48.8566, 2.3522], popup='Paris', tooltip='Capitale').add_to(carte)
# print('Marqueur Paris ajouté')

print('Décommentez le code pour afficher Paris')" />

*Indice :* enlevez le `#` au début des lignes à activer.

---

## Étape 3 — Compléter la carte

Paris est déjà placé. **À vous de jouer :** ajoutez Lyon et Marseille en complétant les `TODO`.

| Ville | Latitude | Longitude |
|-------|----------|-----------|
| Lyon | 45.7640 | 4.8357 |
| Marseille | 43.2965 | 5.3698 |

<CarteGpsPlayground initialCode="import folium

carte = folium.Map(location=[46.5, 2.5], zoom_start=6)

folium.Marker([48.8566, 2.3522], popup='Paris').add_to(carte)

# TODO : marqueur pour Lyon
# TODO : marqueur pour Marseille

print('Ajoutez Lyon et Marseille')" />

---

## Étape 4 — Boucle sur une liste de lieux

Plutôt que répéter le même code, on peut parcourir une **liste** de lieux avec une boucle `for`.

**Mission :** complétez la boucle pour placer automatiquement les 4 villes du tableau `lieux`.

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

*Indice :* `lieu['lat']` donne la latitude, `lieu['nom']` le nom de la ville.

---

## Étape 5 — Ajouter votre lieu

Personnalisez la carte en ajoutant **votre ville** ou **votre établissement scolaire**.

Cherchez les coordonnées GPS sur [openstreetmap.org](https://www.openstreetmap.org) (clic droit → « Afficher l'adresse »).

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

---

## Étape 6 — Tracer un trajet (bonus)

Un **trajet GPS** peut se dessiner avec `folium.PolyLine` : une ligne entre plusieurs coordonnées.

**Mission :** décommentez la ligne pour relier Paris et Lyon.

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

---

## Bilan

Vous savez maintenant :

- créer une carte avec **folium**
- placer des **marqueurs** à des coordonnées GPS
- automatiser avec une **boucle** sur une liste de lieux
- tracer un **trajet** entre des points

Pour aller plus loin, exportez votre carte en fichier HTML avec `carte.save('ma_carte.html')` en Python sur votre ordinateur.
