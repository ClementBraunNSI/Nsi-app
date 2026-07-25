---
title: Dictionnaires en Python
description: "Structure clé-valeur : créer, lire, modifier et parcourir un dictionnaire."
level: premiere
chapter: Dictionnaires et Tables
icon: "\U0001F5DD️"
badgeId: premiere_dictionnaires
prerequisites: []
---

## Objectifs

- Créer un dictionnaire avec des **clés** et des **valeurs**.
- Accéder, ajouter, modifier ou supprimer une entrée.
- Tester la présence d'une clé avec `in`.
- Parcourir les clés (et les valeurs associées) avec une boucle `for`.

## Idée clé

Une **liste** se lit par un **indice** (`notes[0]`). Un **dictionnaire** se lit par une **clé** (`eleve["prenom"]`). La clé nomme l'information ; la valeur la contient. On ne parle pas d'« attributs » ici : ce vocabulaire appartient à la POO.

## Créer un dictionnaire

Syntaxe : accolades `{ }`, couples `clé: valeur` séparés par des virgules. Les clés sont souvent des chaînes.

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

| Structure | Délimiteurs | Accès |
| --- | --- | --- |
| Liste | `[ ]` | indice entier |
| Tuple | `( )` | indice entier |
| Dictionnaire | `{ }` | clé |

## Lire, modifier, supprimer

```python
print(eleve["prenom"])       # Léa
eleve["moyenne"] = 15.0      # modification
eleve["option"] = "Maths"    # ajout
eleve.pop("classe")          # suppression de la clé "classe"
```

Si la valeur associée à une clé est une liste, on la manipule comme une liste :

```python
options = {"langues": ["anglais", "espagnol"]}
options["langues"].append("allemand")
```

!!! tip "Tester avant d'accéder"
    `eleve["absent"]` lève une `KeyError` si la clé n'existe pas. Vérifier avec `"absent" in eleve`.

## Parcourir un dictionnaire

Par défaut, `for cle in dico` itère sur les **clés**.

```python
for cle in eleve:
    print(cle, "→", eleve[cle])

# variante explicite
for cle, valeur in eleve.items():
    print(cle, valeur)
```

## Piège fréquent

- Confondre clé et indice : `eleve[0]` ne marche que si `0` est vraiment une clé.
- Dire « attribut » pour une clé de dictionnaire — réserver « attribut » aux objets (POO).

## À retenir

- Un dictionnaire associe des **clés** à des **valeurs**.
- Création : `{ "cle": valeur }` ou `d["cle"] = valeur`.
- Accès / modification : `d["cle"]`.
- `"cle" in d` teste la présence ; `d.pop("cle")` retire.
- `for cle in d` parcourt les clés.
- Listes = indices ; dictionnaires = clés nommées.

## Pour s'entraîner

- [Exercices : Dictionnaires](/cours/2/python_exercices_dictionnaires)
- Suite logique : [Traitement de données en tables (CSV)](/cours/2/python_csv)
