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

Un tableur et un fichier texte racontent souvent la même chose : des lignes, des colonnes, un en-tête. Le format **CSV** (*Comma-Separated Values*) est ce texte. Chaque ligne est un enregistrement, les champs sont séparés par une virgule ou, très souvent en France, par un point-virgule. Une fois chargé, le fichier devient une liste de dictionnaires. Les clés sont les noms de colonnes, qu'on appelle les **descripteurs**. Ensuite, deux questions reviennent : quelles colonnes garder, quelles lignes garder.

## Charger le fichier

`csv.DictReader` lit chaque ligne et en fait un dictionnaire. Les clés viennent de la **première ligne**, les en-têtes. `delimiter=";"` dit au lecteur que le séparateur n'est pas la virgule. `with open(...)` ouvre le fichier et le ferme à la sortie du bloc, même si quelque chose échoue au milieu.

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

`newline=""` évite que le module `csv` se batte avec les fins de ligne. `encoding="utf-8"` lit correctement les accents. `dict(ligne)` copie la ligne lue dans un vrai dictionnaire, que l'on range dans la liste.

!!! example "Aperçu"
    ```csv
    code_commune_INSEE;nom_commune;code_departement;nom_departement
    01001;L'Abergement-Clémenciat;01;Ain
    59000;Lille;59;Nord
    ```
    Après chargement, `villes[0]["nom_commune"]` vaut `"L'Abergement-Clémenciat"`.

Sur le fichier des communes, les descripteurs utiles sont notamment `nom_commune`, `code_postal`, `code_departement`, `nom_departement`, `latitude`, `longitude`. Tout ce que `DictReader` renvoie est une **chaîne**. `"59"` n'est pas l'entier 59, et une latitude n'est pas encore un `float`. On convertit au moment de comparer des nombres.

Une erreur de débutant : la fonction reçoit `nom_de_fichier`, et le corps ouvre quand même `"communes.csv"` en dur. Le paramètre ne sert plus à rien. C'est `nom_de_fichier` qu'il faut passer à `open`.

## Choisir des colonnes : la projection

La **projection** extrait une ou plusieurs clés pour chaque enregistrement. On ne jette aucune ligne. On décide seulement quelles informations montrer.

```python
# Tous les noms de communes (une colonne)
for ligne in villes:
    print(ligne["nom_commune"])

# Deux colonnes : nom + département
for ligne in villes:
    print(ligne["nom_commune"], "->", ligne["nom_departement"])
```

La première boucle ne garde que le nom. La seconde en garde deux. Dans les deux cas, Lille et L'Abergement-Clémenciat passent toutes les deux.

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

On compare `code_departement` à la chaîne `"59"`, pas à l'entier `59`, parce que le CSV a tout lu comme du texte. Pour une latitude, il faut `float(ligne["latitude"])` avant de la comparer à un nombre. Sinon Python compare une chaîne et un flottant, et l'ordre n'a pas le sens que vous croyez.

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

Pour fermer : un CSV est une table en texte, `DictReader` en fait une liste de dictionnaires, les clés sont les descripteurs. La projection choisit les colonnes, la sélection filtre les lignes. Les valeurs lues sont des chaînes. `with` ferme le fichier. Le geste habituel est : sélectionner, puis projeter.

## Pour s'entraîner

- [Exercices : Traitement CSV](/cours/2/python_csv_exercices)
