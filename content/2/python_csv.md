---
title: Traitement de données en tables
description: "Charger un CSV en liste de dictionnaires, puis projeter et sélectionner des données."
level: premiere
chapter: Dictionnaires et Tables
icon: "chart-column"
badgeId: premiere_traitement_tables_csv
prerequisites:
  - python_dictionnaires
audience: public
groupe: csv
groupeTitre: "Données en tables (CSV)"
---

# Traitement de données en tables

Un tableur et un fichier texte contiennent souvent les mêmes informations, organisées en lignes et en colonnes avec un en-tête. Le format **CSV** (*Comma-Separated Values*) est un fichier texte de ce type. Chaque ligne est un enregistrement, et les champs sont séparés par une virgule ou, très souvent en France, par un point-virgule. Une fois chargé, le fichier devient une liste de dictionnaires, dont les clés sont les noms de colonnes, appelés **descripteurs**. Il reste alors à choisir les colonnes et les lignes à garder.

## Charger le fichier

`csv.DictReader` lit chaque ligne et en fait un dictionnaire. Les clés viennent de la **première ligne**, les en-têtes. `delimiter=";"` indique que le séparateur est le point-virgule et non la virgule. `with open(...)` ouvre le fichier et le ferme à la sortie du bloc, même si quelque chose échoue au milieu.

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

`newline=""` évite que le module `csv` interprète mal les fins de ligne. `encoding="utf-8"` lit correctement les accents. `dict(ligne)` copie la ligne lue dans un vrai dictionnaire, que l'on range dans la liste.

!!! example "Aperçu"
    ```csv
    code_commune_INSEE;nom_commune;code_departement;nom_departement
    01001;L'Abergement-Clémenciat;01;Ain
    59000;Lille;59;Nord
    ```
    Après chargement, `villes[0]["nom_commune"]` vaut `"L'Abergement-Clémenciat"`.

Sur le fichier des communes, les descripteurs utiles sont notamment `nom_commune`, `code_postal`, `code_departement`, `nom_departement`, `latitude`, `longitude`. Tout ce que `DictReader` renvoie est une **chaîne**. Ainsi, `"59"` n'est pas l'entier 59, et une latitude n'est pas encore un `float` : il faut convertir ces valeurs avant de comparer des nombres.

Une erreur fréquente consiste à recevoir `nom_de_fichier` en paramètre, puis à ouvrir quand même `"communes.csv"` dans le corps de la fonction. Le paramètre ne sert alors plus à rien. C'est `nom_de_fichier` qu'il faut passer à `open`.

## Choisir des colonnes : la projection

La **projection** extrait une ou plusieurs clés pour chaque enregistrement. Aucune ligne n'est supprimée : on choisit seulement les informations à afficher.

```python
# Tous les noms de communes (une colonne)
for ligne in villes:
    print(ligne["nom_commune"])

# Deux colonnes : nom + département
for ligne in villes:
    print(ligne["nom_commune"], "->", ligne["nom_departement"])
```

La première boucle ne garde que le nom. La seconde en garde deux. Dans les deux cas, Lille et L'Abergement-Clémenciat apparaissent toutes les deux.

## Choisir des lignes : la sélection

La **sélection** garde les enregistrements qui vérifient une condition. Les autres disparaissent du résultat.

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

On compare `code_departement` à la chaîne `"59"`, pas à l'entier `59`, parce que le CSV a tout lu comme du texte. Pour une latitude, il faut `float(ligne["latitude"])` avant de la comparer à un nombre. Sinon, Python refuse de comparer une chaîne et un flottant, et lève une erreur.

On enchaîne souvent les deux opérations : d'abord les lignes du Nord, ensuite seulement le nom et la latitude.

| Opération | Question | Exemple |
| --- | --- | --- |
| Projection | Quelles **colonnes** ? | afficher seulement `nom_commune` |
| Sélection | Quelles **lignes** ? | garder `code_departement == "59"` |

## Atelier interactif

<DataProcessor />

### Exercices guidés

**Faciles**

1. `afficher_noms_communes(villes)` : affiche tous les noms (projection).
2. `afficher_communes_par_code_postal(villes, code_postal)` : filtre par code postal (sélection).
3. `afficher_communes_avec_coordonnees(villes)` : nom, latitude, longitude (projection).

**Intermédiaires**

1. `afficher_communes_par_departement(villes, departement)` : sélection sur le département.
2. `afficher_noms_longueur_min(villes, longueur)` : renvoie les noms assez longs.
3. `afficher_communes_par_latitude(villes, max_latitude)` : latitude inférieure au seuil (penser à convertir en `float`).

En résumé, un CSV est une table enregistrée sous forme de texte, et `DictReader` la transforme en liste de dictionnaires dont les clés sont les descripteurs. La projection choisit les colonnes et la sélection filtre les lignes. Les valeurs lues sont toujours des chaînes, et `with` ferme le fichier automatiquement. En général, on sélectionne d'abord les lignes, puis on les projette.

## Pour s'entraîner

- [Exercices : Traitement CSV](/cours/2/python_csv_exercices)
