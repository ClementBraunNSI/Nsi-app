---
title: Traitement de données en tables
description: "Charger un CSV en liste de dictionnaires, puis projeter et sélectionner des données."
level: premiere
chapter: Dictionnaires et Tables
icon: "\U0001F4CA"
badgeId: premiere_traitement_tables_csv
prerequisites:
  - python_dictionnaires
---

## Objectifs

- Expliquer le format CSV (séparateur, une ligne = un enregistrement).
- Charger un fichier avec `csv.DictReader` en liste de dictionnaires.
- Distinguer **projection** (quelles colonnes) et **sélection** (quelles lignes).
- Écrire une boucle qui filtre ou extrait des champs.

## Idée clé

Une **table** (fichier CSV) se lit comme une liste de fiches : chaque ligne devient un **dictionnaire** dont les clés sont les noms de colonnes (descripteurs). Ensuite, deux opérations classiques : garder certaines **colonnes** (projection) ou certaines **lignes** (sélection).

## Format CSV et chargement

CSV (*Comma-Separated Values*) : texte tabulaire, champs séparés par `,` ou `;`.

`csv.DictReader` transforme chaque ligne en dictionnaire. Les clés viennent de la **première ligne** (en-têtes).

```python
import csv

def creer_liste_villes(nom_de_fichier: str) -> list:
    villes = []
    with open(nom_de_fichier, newline="", encoding="utf-8") as fichier_csv:
        lecteur = csv.DictReader(fichier_csv, delimiter=";")
        for ligne in lecteur:
            villes.append(dict(ligne))
    return villes

villes = creer_liste_villes("communes.csv")
```

!!! example "Aperçu"
    ```csv
    code_commune_INSEE;nom_commune;code_departement;nom_departement
    01001;L'Abergement-Clémenciat;01;Ain
    59000;Lille;59;Nord
    ```
    Après chargement, `villes[0]["nom_commune"]` vaut `"L'Abergement-Clémenciat"`.

Descripteurs utiles du fichier communes : `nom_commune`, `code_postal`, `code_departement`, `nom_departement`, `latitude`, `longitude`, etc.

## Projection : choisir des colonnes

La **projection** extrait une ou plusieurs **clés** pour chaque enregistrement, **sans filtrer** les lignes.

```python
# Tous les noms de communes (une colonne)
for ligne in villes:
    print(ligne["nom_commune"])

# Deux colonnes : nom + département
for ligne in villes:
    print(ligne["nom_commune"], "→", ligne["nom_departement"])
```

En résumé : on décide **quelles informations** afficher ou garder, pour **toutes** les lignes.

## Sélection : filtrer des lignes

La **sélection** garde uniquement les enregistrements qui vérifient une **condition**.

```python
# Communes du département 59
for ligne in villes:
    if ligne["code_departement"] == "59":
        print(ligne["nom_commune"])

# Noms commençant par C
for ligne in villes:
    if ligne["nom_commune"].startswith("C"):
        print(ligne["nom_commune"])
```

On peut **combiner** les deux : sélectionner des lignes, puis ne projeter que certains champs.

| Opération | Question | Exemple |
| --- | --- | --- |
| Projection | Quelles **colonnes** ? | afficher seulement `nom_commune` |
| Sélection | Quelles **lignes** ? | garder `code_departement == "59"` |

## Atelier interactif

<DataProcessor />

### Exercices guidés

**Faciles**

1. `afficher_noms_communes(villes)` — affiche tous les noms (projection).
2. `afficher_communes_par_code_postal(villes, code_postal)` — filtre par code postal (sélection).
3. `afficher_communes_avec_coordonnees(villes)` — nom, latitude, longitude (projection).

**Intermédiaires**

1. `afficher_communes_par_departement(villes, departement)` — sélection sur le département.
2. `afficher_noms_longueur_min(villes, longueur)` — renvoie les noms assez longs.
3. `afficher_communes_par_latitude(villes, max_latitude)` — latitude inférieure au seuil (penser à convertir en `float`).

## Piège fréquent

- Ouvrir un fichier en dur (`open("communes.csv")`) alors que la fonction reçoit `nom_de_fichier` : utiliser le **paramètre**.
- Comparer une latitude (`str` issue du CSV) à un nombre sans `float(...)`.

## À retenir

- CSV = table texte ; `DictReader` → liste de dictionnaires.
- Clés = noms de colonnes (descripteurs).
- **Projection** = choisir des colonnes ; **sélection** = filtrer des lignes.
- Les valeurs lues sont des `str` : convertir pour comparer des nombres.
- `with open(...)` ferme le fichier proprement.
- On enchaîne souvent sélection puis projection.

## Pour s'entraîner

- [Exercices : Traitement CSV](/cours/2/python_csv_exercices)
