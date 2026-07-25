---
title: 'TP Python : Données structurées'
description: 'Manipuler des CSV, JSON et tableaux type Excel avec pandas et le module json.'
level: seconde
chapter: Données structurées
icon: "🐍"
prerequisites:
  - donnees_structurees
---

<ExerciseTabs courseId="tp-python-donnees" courseTitle="TP Python : Données structurées" packages="pandas">

  <ExerciseSection id="donnees-0" label="Important ⚠️ - Avant de commencer">
    <Enonce>
      ### Important ⚠️ - Avant de commencer

      Ce TP utilise des **bibliothèques Python** adaptées aux données structurées vues en cours.

      | Format | Outil Python | Rôle |
      |--------|-------------|------|
      | **CSV / Excel** | `pandas` | Lire, filtrer et analyser des tableaux |
      | **JSON** | `json` (module intégré) | Lire des fiches hiérarchiques |

      **Dans le Lab NSI**, les modules sont chargés automatiquement. En local, installez pandas avec : `pip install pandas`.

      **Exemple de départ pour un exercice CSV :**

      ```python
      import pandas as pnd
      from io import StringIO

      csv_texte = """Nom,Espece,Poids_kg
      Rusty,Vulpes vulpes,6.5"""

      df = pnd.read_csv(StringIO(csv_texte))
      print(df)
      ```

      **Conseil :** explorez toujours vos données avec `print()` avant de répondre.
    </Enonce>
    <Verification>
```python
assert True, "Consignes lues."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="donnees-1" label="Introduction 🦊 - Lire un CSV avec pandas">
    <Enonce>
      ### Introduction 🦊 - Lire un CSV avec pandas

      Le module **pandas** permet de manipuler un CSV comme un **tableur Excel** en Python.

      Voici un extrait de base de données :

      ```csv
      Nom,Espece,Habitat,Poids_kg,Longueur_cm
      Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
      Arctic,Vulpes lagopus,Toundra arctique,3.2,46
      Fennec,Vulpes zerda,Désert,1.5,24
      Silver,Vulpes vulpes,Forêt boréale,7.1,61
      ```

      **Mission :** Chargez ces données dans un DataFrame `df` avec `pnd.read_csv(StringIO(...))`, puis stockez le **nombre de renards** (lignes de données) dans `nb_renards`.

      *Indice :* `len(df)` compte les lignes du tableau.
    </Enonce>
    <Verification>
```python
import pandas as pnd
from io import StringIO

csv_texte = """Nom,Espece,Habitat,Poids_kg,Longueur_cm
Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
Arctic,Vulpes lagopus,Toundra arctique,3.2,46
Fennec,Vulpes zerda,Désert,1.5,24
Silver,Vulpes vulpes,Forêt boréale,7.1,61"""

attendu = pnd.read_csv(StringIO(csv_texte))
assert 'df' in locals(), "Créez un DataFrame nommé df."
assert 'nb_renards' in locals(), "Créez la variable nb_renards."
assert len(df) == len(attendu), "Le tableau doit contenir toutes les lignes de données."
assert nb_renards == len(attendu), "nb_renards doit correspondre au nombre de lignes."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="donnees-2" label="Introduction 🦊 - Les colonnes du tableau">
    <Enonce>
      ### Introduction 🦊 - Les colonnes du tableau

      Comme dans Excel, chaque **colonne** a un nom (l'en-tête du CSV).

      **Mission :** À partir du DataFrame `df` ci-dessous, stockez la liste des noms de colonnes dans `colonnes` et le nombre de colonnes dans `nb_colonnes`.

      ```python
      import pandas as pnd
      from io import StringIO

      csv_texte = """Nom,Espece,Habitat,Poids_kg,Longueur_cm
      Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
      Arctic,Vulpes lagopus,Toundra arctique,3.2,46
      Fennec,Vulpes zerda,Désert,1.5,24
      Silver,Vulpes vulpes,Forêt boréale,7.1,61"""

      df = pnd.read_csv(StringIO(csv_texte))
      ```

      *Indice :* `df.columns` donne les noms de colonnes. Convertissez en liste avec `.tolist()`.
    </Enonce>
    <Verification>
```python
import pandas as pnd
from io import StringIO

csv_texte = """Nom,Espece,Habitat,Poids_kg,Longueur_cm
Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
Arctic,Vulpes lagopus,Toundra arctique,3.2,46
Fennec,Vulpes zerda,Désert,1.5,24
Silver,Vulpes vulpes,Forêt boréale,7.1,61"""
df = pnd.read_csv(StringIO(csv_texte))

assert 'colonnes' in locals(), "Créez la variable colonnes."
assert 'nb_colonnes' in locals(), "Créez la variable nb_colonnes."
assert colonnes == df.columns.tolist(), "colonnes doit reprendre les en-têtes du CSV."
assert nb_colonnes == len(df.columns), "nb_colonnes doit compter les colonnes."
assert "Poids_kg" in colonnes, "Le fichier contient une colonne Poids_kg."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="donnees-3" label="Introduction 🦊 - Lire une cellule">
    <Enonce>
      ### Introduction 🦊 - Lire une cellule

      On peut accéder à une **cellule** comme dans un tableur : `df.loc[ligne, "Colonne"]`.

      **Mission :** À partir du `df` fourni, stockez dans `poids_fennec` le poids (en kg) du renard dont le nom est **Fennec**.

      ```python
      import pandas as pnd
      from io import StringIO

      csv_texte = """Nom,Espece,Habitat,Poids_kg,Longueur_cm
      Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
      Arctic,Vulpes lagopus,Toundra arctique,3.2,46
      Fennec,Vulpes zerda,Désert,1.5,24
      Silver,Vulpes vulpes,Forêt boréale,7.1,61"""

      df = pnd.read_csv(StringIO(csv_texte))
      ```

      *Indice :* filtrez d'abord la ligne : `df[df["Nom"] == "Fennec"]`, puis lisez la colonne `Poids_kg`.
    </Enonce>
    <Verification>
```python
import pandas as pnd
from io import StringIO

csv_texte = """Nom,Espece,Habitat,Poids_kg,Longueur_cm
Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
Arctic,Vulpes lagopus,Toundra arctique,3.2,46
Fennec,Vulpes zerda,Désert,1.5,24
Silver,Vulpes vulpes,Forêt boréale,7.1,61"""
df = pnd.read_csv(StringIO(csv_texte))
attendu = float(df.loc[df["Nom"] == "Fennec", "Poids_kg"].iloc[0])

assert 'poids_fennec' in locals(), "Créez la variable poids_fennec."
assert float(poids_fennec) == attendu, "Lisez le poids du Fennec dans le tableau."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="donnees-4" label="Facile 🦊 - Filtrer un tableau">
    <Enonce>
      ### Facile 🦊 - Filtrer un tableau

      Le **filtrage** permet de ne garder que les lignes qui correspondent à un critère (comme un filtre Excel).

      **Mission :** À partir du `df` fourni, créez `df_desert` contenant **uniquement** les renards dont l'`Habitat` contient le mot `"Désert"`. Stockez le nombre de résultats dans `nb_resultats`.

      ```python
      import pandas as pnd
      from io import StringIO

      csv_texte = """Nom,Espece,Habitat,Poids_kg,Longueur_cm
      Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
      Arctic,Vulpes lagopus,Toundra arctique,3.2,46
      Fennec,Vulpes zerda,Désert,1.5,24
      Silver,Vulpes vulpes,Forêt boréale,7.1,61"""

      df = pnd.read_csv(StringIO(csv_texte))
      ```

      *Indice :* `df[df["Habitat"].str.contains("Désert")]`
    </Enonce>
    <Verification>
```python
import pandas as pnd
from io import StringIO

csv_texte = """Nom,Espece,Habitat,Poids_kg,Longueur_cm
Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
Arctic,Vulpes lagopus,Toundra arctique,3.2,46
Fennec,Vulpes zerda,Désert,1.5,24
Silver,Vulpes vulpes,Forêt boréale,7.1,61"""
df = pnd.read_csv(StringIO(csv_texte))
attendu = df[df["Habitat"].str.contains("Désert")]

assert 'df_desert' in locals(), "Créez le DataFrame df_desert."
assert 'nb_resultats' in locals(), "Créez la variable nb_resultats."
assert len(df_desert) == len(attendu), "Le filtre doit garder les habitats contenant Désert."
assert nb_resultats == len(attendu), "nb_resultats doit correspondre au filtre."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="donnees-5" label="Facile 🦊 - Trier un tableau">
    <Enonce>
      ### Facile 🦊 - Trier un tableau

      On peut **trier** un tableau par colonne, comme dans Excel.

      **Mission :** Triez le `df` fourni par `Poids_kg` du plus léger au plus lourd. Stockez le résultat dans `df_trie` et le nom du renard le plus lourd dans `plus_lourd`.

      ```python
      import pandas as pnd
      from io import StringIO

      csv_texte = """Nom,Espece,Habitat,Poids_kg,Longueur_cm
      Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
      Arctic,Vulpes lagopus,Toundra arctique,3.2,46
      Fennec,Vulpes zerda,Désert,1.5,24
      Silver,Vulpes vulpes,Forêt boréale,7.1,61"""

      df = pnd.read_csv(StringIO(csv_texte))
      ```

      *Indice :* `df.sort_values("Poids_kg")` trie du plus petit au plus grand.
    </Enonce>
    <Verification>
```python
import pandas as pnd
from io import StringIO

csv_texte = """Nom,Espece,Habitat,Poids_kg,Longueur_cm
Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
Arctic,Vulpes lagopus,Toundra arctique,3.2,46
Fennec,Vulpes zerda,Désert,1.5,24
Silver,Vulpes vulpes,Forêt boréale,7.1,61"""
df = pnd.read_csv(StringIO(csv_texte))
attendu = df.sort_values("Poids_kg")

assert 'df_trie' in locals(), "Créez le DataFrame df_trie."
assert 'plus_lourd' in locals(), "Créez la variable plus_lourd."
assert df_trie["Poids_kg"].tolist() == attendu["Poids_kg"].tolist(), "Triez par Poids_kg croissant."
assert plus_lourd == attendu.iloc[-1]["Nom"], "plus_lourd est le renard le plus lourd du tableau."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="donnees-6" label="Facile 🦊 - Lire un JSON">
    <Enonce>
      ### Facile 🦊 - Lire un JSON

      Le module **`json`** (intégré à Python) permet de lire une fiche hiérarchique.

      ```python
      import json

      fiche_texte = '''
      {
        "renard": {
          "nom": "Rusty",
          "habitat": {
            "type": "Forêt tempérée",
            "region": "Europe"
          },
          "alimentation": ["rongeurs", "oiseaux", "insectes", "fruits"]
        }
      }
      '''
      ```

      **Mission :** Convertissez `fiche_texte` en dictionnaire `fiche` avec `json.loads()`, puis stockez :

      - la `region` d'habitat dans `region`
      - le nombre d'aliments dans `nb_aliments`
    </Enonce>
    <Verification>
```python
import json

fiche_texte = '''
{
  "renard": {
    "nom": "Rusty",
    "habitat": {
      "type": "Forêt tempérée",
      "region": "Europe"
    },
    "alimentation": ["rongeurs", "oiseaux", "insectes", "fruits"]
  }
}
'''
fiche_ref = json.loads(fiche_texte)

assert 'fiche' in locals(), "Créez le dictionnaire fiche."
assert 'region' in locals(), "Créez la variable region."
assert 'nb_aliments' in locals(), "Créez la variable nb_aliments."
assert region == fiche_ref["renard"]["habitat"]["region"], "Lisez la région dans la structure JSON."
assert nb_aliments == len(fiche_ref["renard"]["alimentation"]), "Comptez les aliments listés."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="donnees-7" label="Facile 🦊 - Statistique sur une colonne">
    <Enonce>
      ### Facile 🦊 - Statistique sur une colonne

      Pandas peut calculer des **statistiques** sur une colonne numérique (moyenne, maximum…).

      **Mission :** À partir du `df` fourni, calculez la **moyenne** des poids dans `poids_moyen` et le **poids maximum** dans `poids_max`.

      ```python
      import pandas as pnd
      from io import StringIO

      csv_texte = """Nom,Espece,Habitat,Poids_kg,Longueur_cm
      Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
      Arctic,Vulpes lagopus,Toundra arctique,3.2,46
      Fennec,Vulpes zerda,Désert,1.5,24
      Silver,Vulpes vulpes,Forêt boréale,7.1,61"""

      df = pnd.read_csv(StringIO(csv_texte))
      ```

      *Indice :* `df["Poids_kg"].mean()` et `df["Poids_kg"].max()`
    </Enonce>
    <Verification>
```python
import pandas as pnd
from io import StringIO

csv_texte = """Nom,Espece,Habitat,Poids_kg,Longueur_cm
Rusty,Vulpes vulpes,Forêt tempérée,6.5,58
Arctic,Vulpes lagopus,Toundra arctique,3.2,46
Fennec,Vulpes zerda,Désert,1.5,24
Silver,Vulpes vulpes,Forêt boréale,7.1,61"""
df = pnd.read_csv(StringIO(csv_texte))

assert 'poids_moyen' in locals(), "Créez la variable poids_moyen."
assert 'poids_max' in locals(), "Créez la variable poids_max."
assert abs(float(poids_moyen) - float(df["Poids_kg"].mean())) < 0.01, "Calculez la moyenne des poids."
assert float(poids_max) == float(df["Poids_kg"].max()), "Trouvez le poids maximum."
```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
