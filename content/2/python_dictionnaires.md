---
title: Dictionnaires en Python
description: "Structure clé-valeur : créer, lire, modifier et parcourir un dictionnaire."
level: premiere
chapter: Dictionnaires et Tables
icon: "key-round"
badgeId: premiere_dictionnaires
prerequisites: []
audience: public
groupe: dictionnaires
groupeTitre: "Dictionnaires"
---

# Dictionnaires en Python

Une liste se lit par un **indice** : `notes[0]` est la première note, et l'ordre compte. Un **dictionnaire** se lit par une **clé** : `eleve["prenom"]` nomme l'information qu'on veut. La clé désigne, la valeur contient. On ne dit pas « attribut » ici. Ce mot appartient à la programmation orientée objet. Ici, on parle de clés.

## Créer

Les accolades `{ }` ouvrent le dictionnaire. Chaque couple s'écrit `clé: valeur`, et les couples se séparent par des virgules. Les clés sont souvent des chaînes, parce qu'un nom se retient mieux qu'un numéro.

```python
eleve = {
    "prenom": "Léa",
    "classe": "1ère NSI",
    "moyenne": 14.5
}

# ou construction progressive
voiture = {}
voiture["couleur"] = "bleu"
voiture["puissance"] = 110
```

On peut tout écrire d'un coup, comme `eleve`, ou partir d'un dictionnaire vide et ajouter les couples un par un. `voiture["couleur"] = "bleu"` crée la clé si elle n'existe pas encore.

| Structure | Délimiteurs | Accès |
| --- | --- | --- |
| Liste | `[ ]` | indice entier |
| Tuple | `( )` | indice entier |
| Dictionnaire | `{ }` | clé |

Liste et tuple se ressemblent par l'accès : un entier dit « le combien-ième ». Le dictionnaire répond à une autre question : « la valeur associée à ce nom ».

## Lire, modifier, retirer

La même écriture `d["cle"]` sert à lire et à modifier. Si la clé existe, on remplace la valeur. Si elle n'existe pas, on l'ajoute. `pop` retire une clé et sa valeur.

```python
print(eleve["prenom"])       # Léa
eleve["moyenne"] = 15.0      # modification
eleve["option"] = "Maths"    # ajout
eleve.pop("classe")          # suppression de la clé "classe"
```

Une valeur peut elle-même être une liste. On la manipule alors comme n'importe quelle liste, après avoir ouvert la clé.

```python
options = {"langues": ["anglais", "espagnol"]}
options["langues"].append("allemand")
```

!!! tip "Tester avant d'accéder"
    `eleve["absent"]` lève une `KeyError` si la clé n'existe pas. Vérifier avec `"absent" in eleve`.

`in` teste la présence de la **clé**, pas de la valeur. `"Léa" in eleve` est faux, parce que `"Léa"` est une valeur, pas une clé.

## Parcourir

`for cle in eleve` itère sur les **clés**, dans l'ordre d'insertion en Python actuel. Pour avoir la valeur, on réouvre le dictionnaire avec cette clé, ou on demande les couples avec `.items()`.

```python
for cle in eleve:
    print(cle, "->", eleve[cle])

# variante explicite
for cle, valeur in eleve.items():
    print(cle, valeur)
```

Les deux boucles affichent la même information. La seconde évite de chercher la valeur une deuxième fois.

Deux erreurs reviennent. `eleve[0]` ne marche que si `0` est vraiment une clé. Un dictionnaire n'a pas de « premier élément » au sens d'une liste. Et appeler une clé un attribut mélange deux chapitres : la clé est un nom dans une table, l'attribut est une donnée d'objet.

Pour fermer : un dictionnaire associe des clés à des valeurs. On crée avec `{ "cle": valeur }` ou avec `d["cle"] = valeur`. On lit et on modifie avec `d["cle"]`. `"cle" in d` teste, `d.pop("cle")` retire. `for cle in d` parcourt les clés. Liste : indices. Dictionnaire : noms.

## Pour s'entraîner

- [Exercices : Dictionnaires](/cours/2/python_exercices_dictionnaires)
- Suite logique : [Traitement de données en tables (CSV)](/cours/2/python_csv)
