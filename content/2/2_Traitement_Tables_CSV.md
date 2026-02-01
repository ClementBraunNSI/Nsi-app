---
title: "Traitement de données en tables"
description: "Manipulation et analyse de fichiers CSV avec Python"
level: premiere
chapter: "Dictionnaires et Tables"
icon: "📊"
badgeId: "premiere_traitement_tables_csv"
---


# Traitement de données en tables

## Introduction au format CSV

### Traitement de données

Les **dictionnaires** de Python permettent de réaliser des traitements sur des données. Ces traitements permettent notamment de **trier**, **organiser**, **sélectionner** des données en fonction de critères.

*   **Fichiers CSV** : Le format **CSV** (*Comma Separated Values*) correspond à un format où les données sont structurées par des **virgules** (ou des **points-virgules**).
*   **Tableurs** : Ces formats CSV sont manipulables via des logiciels **tableurs** (Excel, Libre Office, etc.) mais on peut également réaliser des traitements sur ces fichiers à l'aide de bibliothèques *Python*.

## La bibliothèque CSV

La bibliothèque **csv** permet de charger des fichiers et stocke les données sous forme de **listes**.
On ne traitera que de la fonction **DictReader** qui permet de traduire chaque ligne de notre fichier CSV dans des **dictionnaires**, eux-mêmes stockés dans une **liste**.

### Structure d'ouverture

Voici la structure de l'ouverture d'un fichier CSV et du remplissage d'une liste organisant nos données :

```python
import csv

liste_a_remplir = []
with open('communes.csv', newline='') as fichier_csv:
   lecteur = csv.DictReader(fichier_csv, delimiter=',')   # Objet DictReader (itérateur)
   for ligne in lecteur:
      liste_a_remplir.append(dict(ligne))
```

### Exemple pratique : Communes de France

Le fichier CSV **communes.csv** représente l'ensemble des communes de France, associée à leur code postal, département, etc.

Pour "ouvrir" ce fichier CSV et structurer toutes les données le comportant, on utilisera l'exemple de code suivant :

```python
import csv

def creer_liste_villes(nom_de_fichier : str) -> list:
   villes = []
   with open('communes.csv', newline='') as fichier_csv:
      # Méthode DictReader qui permet de structurer les données contenues dans le fichier CSV 
      # en liste de dictionnaires où chaque descripteur (ou attribut) est renseigné.
      lecteur = csv.DictReader(fichier_csv, delimiter=';')   
      for ligne in lecteur:
         villes.append(dict(ligne))
```

!!! info "Descripteurs disponibles"
    Pour ce fichier CSV, il y a les descripteurs suivants :
    `code_commune_INSEE`, `nom_commune_postal`, `code_postal`, `latitude`, `longitude`, `code_commune`, `nom_commune`, `nom_commune_complet`, `code_departement`, `nom_departement`, `code_region`, `nom_region`

**Aperçu du fichier CSV :**
```csv
code_commune_INSEE;nom_commune_postal;code_postal;latitude;longitude;code_commune;nom_commune;nom_departement
01001;L'Abergement-Clémenciat;01400;46.1667;4.9;1;L'Abergement-Clémenciat;Ain
01002;L'Abergement-de-Varey;01640;46.05;5.4833;1;L'Abergement-de-Varey;Ain
...
```

!!! note "Rappel important"
    La fonction **DictReader** permet de créer une liste de dictionnaires et chaque dictionnaire correspond à une ligne du fichier CSV à laquelle on associe chacun des attributs à chacune des valeurs de la ligne.

## Projection de données

On appelle **projection** le fait d'obtenir les valeurs de certains ou tous les attributs d'une table / base de données / fichiers CSV.

```python
# Exemple : Afficher le nom des villes
for ligne in villes:  # Pour chaque ligne dans la liste des villes
   print(ligne["nom_commune"])  # Affiche la valeur associée à la clé 'nom_commune'

# Afficher le nom de toutes les villes
for ligne in villes:
   print(ligne["nom_commune"])

# Afficher le département de chaque ville
for ligne in villes:
   print("La ville ", ligne["nom_commune"], " est dans le département : ", ligne["nom_departement"])
```

Cela permet donc d'obtenir dans notre exemple de villes, le nom de celle-ci, le département, etc. de toutes les villes **sans aucune contrainte**.

## Sélection de données

On appelle **sélection** le fait de sélectionner des valeurs suivant certains critères ou condition.
Cela permet donc d'obtenir des informations ou de réaliser des traitements sur les données d'un fichier suivant divers critères (par exemple sur les villes).

```python
# Afficher le nom des villes qui sont dans le département 59
for ligne in villes:
   if ligne['code_departement'] == '59':
      print(ligne["nom_commune"])

# Afficher les noms des villes commençant par la lettre C
for ligne in villes:
   if ligne["nom_commune"][0] == "C":
      print(ligne["nom_commune"])
```

## Exercices pratiques

### Exercices faciles

1.  **Afficher les noms des communes**
    Écrire une fonction `afficher_noms_communes` qui prend une liste de dictionnaires `villes` en paramètre et affiche le nom de toutes les communes.

2.  **Communes par code postal**
    Écrire une fonction `afficher_communes_par_code_postal` qui prend une liste de dictionnaires `villes` et une chaîne `code_postal` en paramètre, et affiche les noms des communes ayant ce code postal.

3.  **Communes avec coordonnées**
    Écrire une fonction `afficher_communes_avec_coordonnees` qui prend une liste de dictionnaires `villes` et affiche pour chaque commune son nom, sa latitude et sa longitude.

### Exercices intermédiaires

1.  **Communes par département**
    Écrire une fonction `afficher_communes_par_departement` qui prend une liste de dictionnaires `villes` et une chaîne `departement` en paramètre, et affiche les noms des communes du département donné.

2.  **Noms avec longueur minimale**
    Écrire une fonction `afficher_noms_longueur_min` qui prend une liste de dictionnaires `villes` et un entier `longueur` en paramètre, et renvoie la liste des noms des communes ayant un nom d'au moins `longueur` caractères.

3.  **Communes par latitude**
    Écrire une fonction `afficher_communes_par_latitude` qui prend une liste de dictionnaires `villes` et une latitude maximale `max_latitude` en paramètre, et affiche les noms des communes ayant une latitude inférieure à `max_latitude`.
