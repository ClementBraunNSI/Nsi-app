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

Les éléments d'une liste sont repérés par un **indice** : `notes[0]` est la première note, et l'ordre compte. Ceux d'un **dictionnaire** sont repérés par une **clé** : `eleve["prenom"]` désigne directement l'information voulue. La clé sert à désigner l'information, et la valeur la contient. On ne parle pas ici d'« attribut », car ce mot appartient à la programmation orientée objet.

## Créer un dictionnaire

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

Les listes et les tuples se ressemblent : on accède à leurs éléments par un entier, qui indique leur position. Un dictionnaire permet au contraire d'obtenir la valeur associée à un nom.

## Lire, modifier et retirer une valeur

La même écriture `d["cle"]` sert à lire et à modifier. Si la clé existe, on remplace la valeur. Si elle n'existe pas, on l'ajoute. `pop` retire une clé et sa valeur.

```python
print(eleve["prenom"])       # Léa
eleve["moyenne"] = 15.0      # modification
eleve["option"] = "Maths"    # ajout
eleve.pop("classe")          # suppression de la clé "classe"
```

Une valeur peut elle-même être une liste. On la manipule alors comme n'importe quelle liste, après y avoir accédé par sa clé.

```python
options = {"langues": ["anglais", "espagnol"]}
options["langues"].append("allemand")
```

!!! tip "Tester avant d'accéder"
    `eleve["absent"]` lève une `KeyError` si la clé n'existe pas. Vérifier avec `"absent" in eleve`.

`in` teste la présence de la **clé**, pas de la valeur. `"Léa" in eleve` est faux, parce que `"Léa"` est une valeur, pas une clé.

## Parcourir un dictionnaire

`for cle in eleve` parcourt les **clés**, dans l'ordre où elles ont été ajoutées. Pour obtenir la valeur, il faut accéder au dictionnaire avec cette clé, ou bien demander directement les couples avec `.items()`.

```python
for cle in eleve:
    print(cle, "->", eleve[cle])

# variante explicite
for cle, valeur in eleve.items():
    print(cle, valeur)
```

Les deux boucles affichent la même information. La seconde évite de chercher la valeur une deuxième fois.

Deux erreurs sont fréquentes. La première consiste à écrire `eleve[0]`, qui ne fonctionne que si `0` est vraiment une clé, car un dictionnaire n'a pas de « premier élément » comme une liste. La seconde consiste à appeler une clé un attribut, ce qui mélange deux chapitres : la clé est un nom dans une table, alors que l'attribut est une donnée d'un objet.

En résumé, un dictionnaire associe des clés à des valeurs. On le crée avec `{ "cle": valeur }` ou avec `d["cle"] = valeur`. On lit et on modifie avec `d["cle"]`. `"cle" in d` teste la présence d'une clé et `d.pop("cle")` la retire. `for cle in d` parcourt les clés. Une liste repère ses valeurs par des indices, alors qu'un dictionnaire les repère par des noms.

## Pour s'entraîner

- [Exercices : Dictionnaires](/cours/2/python_exercices_dictionnaires)
- Suite logique : [Traitement de données en tables (CSV)](/cours/2/python_csv)
