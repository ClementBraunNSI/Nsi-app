---
title: 'TP Python : Géolocalisation'
description: 'Manipuler des coordonnées GPS avec pandas, folium (cartes) et geopy (distances). Puis mini-projet carte interactive.'
level: seconde
chapter: Localisation
icon: "code"
prerequisites:
  - Cours_Localisation
audience: public
---

<ExerciseTabs courseId="tp-python-localisation" courseTitle="TP Python : Géolocalisation" packages="pandas,folium,geopy">

  <ExerciseSection id="loc-0" label="Important - Avant de commencer" type="lecture">
    <Enonce>
      ### Important <Icone nom="triangle-alert" /> - Avant de commencer

      Ce TP utilise des **bibliothèques Python** pour travailler sur la géolocalisation :

      | Bibliothèque | Usage |
      |-------------|-------|
      | **pandas** | Tableau de lieux avec latitude / longitude |
      | **folium** | Créer une carte interactive (comme Google Maps) |
      | **geopy** | Calculer une distance entre deux coordonnées GPS |

      **Dans le Lab NSI**, les modules sont chargés automatiquement avant l'exécution.

      **Rappel SNT :** une position GPS = **latitude** (Nord/Sud) + **longitude** (Est/Ouest), en degrés.

      **Exemple folium :**

      ```python
      import folium

      carte = folium.Map(location=[46.5, 2.5], zoom_start=6)
      folium.Marker([48.8566, 2.3522], popup="Paris").add_to(carte)
      print("Carte créée avec 1 marqueur")
      ```
    </Enonce>
    <Verification>
```python
assert True, "Consignes lues."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="loc-1" label="Introduction - Tableau de villes" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Tableau de villes

      On peut stocker des lieux dans un **tableau pandas**, comme un fichier Excel de coordonnées GPS.

      **Mission :** Créer un DataFrame `villes` à partir des données ci-dessous, puis stocker la **latitude de Lyon** dans `latitude_lyon`.

      | Ville | Latitude | Longitude |
      |-------|----------|-----------|
      | Paris | 48.8566 | 2.3522 |
      | Lyon | 45.7640 | 4.8357 |
      | Marseille | 43.2965 | 5.3698 |

      *Indice :* `pd.DataFrame({...})` ou une liste de dictionnaires. Pour lire une ville : `villes[villes["Ville"] == "Lyon"]`.
    </Enonce>
    <Verification>
```python
import pandas as pd

villes_ref = pd.DataFrame({
    "Ville": ["Paris", "Lyon", "Marseille"],
    "Latitude": [48.8566, 45.7640, 43.2965],
    "Longitude": [2.3522, 4.8357, 5.3698],
})

assert 'villes' in locals(), "Créez le DataFrame villes."
assert 'latitude_lyon' in locals(), "Créez la variable latitude_lyon."
assert len(villes) == 3, "Le tableau doit contenir 3 villes."
assert abs(float(latitude_lyon) - float(villes_ref.loc[villes_ref["Ville"] == "Lyon", "Latitude"].iloc[0])) < 0.001
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="loc-2" label="Introduction - Distance GPS" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Distance GPS

      La bibliothèque **geopy** calcule la distance réelle entre deux points GPS (en kilomètres).

      **Mission :** Calculer la distance en kilomètres entre **Paris** et **Marseille** (coordonnées dans le tableau ci-dessous). Stocker le résultat arrondi à **1 décimale** dans `distance_km`.

      | Ville | Latitude | Longitude |
      |-------|----------|-----------|
      | Paris | 48.8566 | 2.3522 |
      | Marseille | 43.2965 | 5.3698 |

      *Indice :*

      ```python
      from geopy.distance import geodesic

      distance = geodesic((lat1, lon1), (lat2, lon2)).km
      ```
    </Enonce>
    <Verification>
```python
from geopy.distance import geodesic

paris = (48.8566, 2.3522)
marseille = (43.2965, 5.3698)
attendu = round(geodesic(paris, marseille).km, 1)

assert 'distance_km' in locals(), "Créez la variable distance_km."
assert abs(float(distance_km) - attendu) < 1.0, "Calculez la distance Paris -> Marseille avec geopy."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="loc-3" label="Introduction - Créer une carte" type="python">
    <Enonce>
      ### Introduction <Renards n="1" /> - Créer une carte

      **folium** permet de créer une **carte interactive** centrée sur des coordonnées.

      **Mission :** Créer une carte `carte` centrée sur la France (`location=[46.5, 2.5]`, `zoom_start=6`).

      Vérifier que la carte est bien créée en stockant son niveau de zoom dans `zoom` (`carte.options['zoom']`).

      *Indice :* `import folium` puis `folium.Map(location=[...], zoom_start=...)`
    </Enonce>
    <Verification>
```python
assert 'carte' in locals(), "Créez une carte folium nommée carte."
assert type(carte).__name__ == "Map", "carte doit être un objet folium.Map."
assert 'zoom' in locals(), "Stockez le zoom dans la variable zoom."
assert int(zoom) == 6, "Le zoom initial doit être 6."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="loc-4" label="Facile - Placer des marqueurs" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Placer des marqueurs

      On peut **placer des marqueurs** sur une carte folium, comme des points GPS.

      **Mission :** Partir d'une carte centrée sur `[46.5, 2.5]` (zoom 6). Ajouter **deux marqueurs** :

      - Paris : `[48.8566, 2.3522]`, popup `"Paris"`
      - Lyon : `[45.7640, 4.8357]`, popup `"Lyon"`

      Stocker la carte dans `carte` et le **nombre de marqueurs ajoutés** dans `nb_marqueurs` (compter les objets `Marker` dans `carte._children`).

      *Indice :* `folium.Marker([lat, lon], popup="...").add_to(carte)`
    </Enonce>
    <Verification>
```python
assert 'carte' in locals(), "Créez la variable carte."
assert 'nb_marqueurs' in locals(), "Comptez les marqueurs dans nb_marqueurs."
assert type(carte).__name__ == "Map", "carte doit être une folium.Map."
assert nb_marqueurs == 2, "Ajoutez exactement 2 marqueurs (Paris et Lyon)."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="loc-5" label="Facile - Carte depuis un tableau" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Carte depuis un tableau

      **Mission :** Créer le DataFrame `villes` ci-dessous, puis une carte `carte` avec un marqueur pour **chaque ville** du tableau (utiliser une boucle `for`).

      | Ville | Latitude | Longitude |
      |-------|----------|-----------|
      | Paris | 48.8566 | 2.3522 |
      | Lyon | 45.7640 | 4.8357 |
      | Marseille | 43.2965 | 5.3698 |

      Stocker le nombre de marqueurs dans `nb_marqueurs`.

      *Indice :* parcourir le DataFrame avec `for _, ligne in villes.iterrows():`
    </Enonce>
    <Verification>
```python
import pandas as pd

assert 'villes' in locals(), "Créez le DataFrame villes."
assert 'carte' in locals(), "Créez la carte."
assert 'nb_marqueurs' in locals(), "Comptez les marqueurs."
assert len(villes) == 3, "Le tableau contient 3 villes."
assert nb_marqueurs == 3, "Placez un marqueur par ville."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="loc-6" label="Facile - Ville la plus au nord" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Ville la plus au nord

      La **latitude** indique la position Nord/Sud : plus elle est élevée, plus on est au nord.

      **Mission :** À partir du DataFrame `villes` fourni, trouver la ville la plus au **nord** (latitude maximale) et stocker son nom dans `ville_nord`.

      ```python
      import pandas as pd

      villes = pd.DataFrame({
          "Ville": ["Paris", "Lyon", "Marseille", "Lille"],
          "Latitude": [48.8566, 45.7640, 43.2965, 50.6292],
          "Longitude": [2.3522, 4.8357, 5.3698, 3.0573],
      })
      ```

      *Indice :* `villes.loc[villes["Latitude"].idxmax(), "Ville"]`
    </Enonce>
    <Verification>
```python
import pandas as pd

villes = pd.DataFrame({
    "Ville": ["Paris", "Lyon", "Marseille", "Lille"],
    "Latitude": [48.8566, 45.7640, 43.2965, 50.6292],
    "Longitude": [2.3522, 4.8357, 5.3698, 3.0573],
})
attendu = villes.loc[villes["Latitude"].idxmax(), "Ville"]

assert 'ville_nord' in locals(), "Créez la variable ville_nord."
assert ville_nord == attendu, "Trouvez la ville avec la latitude la plus élevée."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="loc-7" label="Facile - Exporter la carte en HTML" type="python">
    <Enonce>
      ### Facile <Renards n="1" /> - Exporter la carte en HTML

      Une carte folium peut être **exportée en HTML**, comme une page web.

      **Mission :** Créer une carte avec un marqueur sur la Tour Eiffel (`[48.8584, 2.2945]`, popup `"Tour Eiffel"`). La sauvegarder dans la variable texte `html_carte` avec `carte._repr_html_()`.

      Vérifier que le HTML contient bien le mot `"Tour Eiffel"` dans une variable booléenne `contient_nom`.

      *Indice :* `html_carte = carte._repr_html_()` puis `"Tour Eiffel" in html_carte`
    </Enonce>
    <Verification>
```python
assert 'carte' in locals(), "Créez une carte folium."
assert 'html_carte' in locals(), "Exportez la carte dans html_carte."
assert 'contient_nom' in locals(), "Vérifiez le contenu dans contient_nom."
assert isinstance(html_carte, str), "html_carte doit être une chaîne de caractères."
assert contient_nom == True, "Le HTML de la carte doit mentionner Tour Eiffel."
assert "Tour Eiffel" in html_carte, "Exportez correctement la carte avec le popup."
```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>

---

## Suite : mini-projet carte interactive

Une fois les exercices terminés, passer au **[Mini-projet : Carte GPS du Renard](projet_carte_gps.md)** : le code y est modifié pas à pas pour placer des points sur une carte visible directement dans le navigateur.
