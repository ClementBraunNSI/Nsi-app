---
title: "TP - Structures Imbriquées (Spotify)"
description: "Manipuler des listes de dictionnaires contenant des listes"
level: premiere
chapter: Dictionnaires et Tables
icon: "headphones"
badgeId: "tp_spotify"
audience: public
---

# <Icone nom="headphones" /> TP : Structures Imbriquées (Spotify)

## <Icone nom="target" /> Objectif
Comprendre comment naviguer dans des données complexes : **une liste de dictionnaires**, où chaque dictionnaire contient lui-même **des listes**.

C'est exactement comme cela que Spotify ou Netflix stockent les données !

---

## 1. Analyse de la Structure

Voici la base de données musicale `spotify_db`. C'est une **liste** qui contient 3 **dictionnaires** (les artistes).

```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```

### <Icone nom="brain" /> Comment lire ça ?

Imaginer un GPS. Pour trouver une info, il doit suivre le chemin étape par étape.

*   `spotify_db` est une **Liste** `[...]`. Donc on utilise un **indice** `[0]`, `[1]`, etc.
*   `spotify_db[0]` est un **Dictionnaire** `{...}` (C'est Orelsan). Donc on utilise une **clé** `["nom"]`, `["albums"]`.
*   `spotify_db[0]["albums"]` est une **Liste** `[...]`. Donc on utilise un **indice**.

**Schéma Visuel :**
```
spotify_db (Liste)
   │
   ├── [0] (Dictionnaire : Orelsan)
   │    ├── "nom": "Orelsan"
   │    ├── "albums" (Liste) ───► [0]: "Civilisation"
   │    │                         [1]: "La fête est finie"
   │
   ├── [1] (Dictionnaire : Angèle)
   │    ├── "nom": "Angèle"
   │    ...
```

**Exemple :** Je veux le premier album d'Angèle.
1.  Angèle est le 2ème élément de la liste principale -> `spotify_db[1]`
2.  Je veux ses albums -> `spotify_db[1]["albums"]` (C'est une liste : `["Brol", "Nonante-Cinq"]`)
3.  Je veux le premier -> `spotify_db[1]["albums"][0]`
4.  **Résultat :** `"Brol"`

---

## 2. Exercices d'Échauffement (Lecture)

<ExerciseTabs courseId="tp_spotify_1" courseTitle="Structures Imbriquées">

<ExerciseSection id="ex-1-lecture" label="1. Lecture simple" type="python">
<CodeDepart>
```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```
</CodeDepart>
<Enonce>
Sans utiliser de boucle, écrire les instructions pour afficher :

1.  Le genre musical de **The Weeknd**.
2.  Le deuxième album d'**Orelsan** ("La fête est finie").
3.  Le nombre d'écoutes de "Balance ton quoi" (Angèle).

*Astuce : Procéder étape par étape. Trouver d'abord l'artiste, puis la clé, puis l'indice...*
</Enonce>
<Verification>
```python
lignes = [l.strip() for l in SORTIE.strip().splitlines()]
assert len(lignes) == 3, "Le programme doit afficher trois lignes."
assert lignes[0] == "RnB", "Ligne 1 : le genre de The Weeknd, RnB."
assert lignes[1] == "La fête est finie", "Ligne 2 : le deuxième album d'Orelsan, La fête est finie."
assert lignes[2] == "20000000", "Ligne 3 : les écoutes de Balance ton quoi, 20000000."
```
</Verification>

<Correction>
```python
# 1. Genre de The Weeknd (Indice 2)
print(spotify_db[2]["genre"])

# 2. 2ème album d'Orelsan (Indice 0, Clé "albums", Indice 1)
print(spotify_db[0]["albums"][1])

# 3. Écoutes de "Balance ton quoi" (Indice 1, Clé "top_titres", Indice 1, Clé "ecoutes")
print(spotify_db[1]["top_titres"][1]["ecoutes"])
```
</Correction>
</ExerciseSection>

<ExerciseSection id="ex-2-parcours" label="2. Parcours simple" type="python">
<CodeDepart>
```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```
</CodeDepart>
<Enonce>
On veut afficher le nom de chaque artiste suivi de son genre musical.
Le format attendu :
`Orelsan - Rap`
`Angèle - Pop`
...

Utiliser une boucle `for` qui parcourt la liste principale.
</Enonce>
<Verification>
```python
lignes = [l.strip() for l in SORTIE.strip().splitlines()]
assert lignes == ["Orelsan - Rap", "Angèle - Pop", "The Weeknd - RnB"], "Afficher une ligne par artiste : Orelsan - Rap, Angèle - Pop, The Weeknd - RnB."
```
</Verification>

<Correction>
```python
for artiste in spotify_db:
    # 'artiste' est un dictionnaire complet à chaque tour
    nom = artiste["nom"]
    genre = artiste["genre"]
    print(f"{nom} - {genre}")
```
</Correction>
</ExerciseSection>

</ExerciseTabs>

---

## 3. Exercices Avancés (Listes dans Dictionnaires)

Ici, on va devoir entrer dans les sous-listes. C'est souvent là que ça bloque !
À retenir : **Si c'est une liste, il faut (souvent) une boucle pour la parcourir.**

<ExerciseTabs courseId="tp_spotify_2" courseTitle="Niveau Avancé">

<ExerciseSection id="ex-3-albums" label="3. Lister les albums" type="python">
<CodeDepart>
```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```
</CodeDepart>
<Enonce>
L'objectif est d'afficher **tous les albums** présents dans la base de données, peu importe l'artiste.

1.  Parcourir chaque artiste.
2.  Pour chaque artiste, parcourir sa liste d'albums.
3.  Afficher le nom de l'album.
</Enonce>
<Verification>
```python
lignes = [l.strip() for l in SORTIE.strip().splitlines()]
assert lignes == ["Civilisation", "La fête est finie", "Brol", "Nonante-Cinq", "After Hours", "Starboy"], "Afficher les six albums, un par ligne, artiste après artiste."
```
</Verification>

<Correction>
```python
for artiste in spotify_db:
    # artiste["albums"] est une LISTE ["...", "..."]
    # On doit donc faire une boucle DANS la boucle
    for album in artiste["albums"]:
        print(album)
```
</Correction>
</ExerciseSection>

<ExerciseSection id="ex-4-populaire" label="4. Le plus écouté" type="python">
<CodeDepart>
```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```
</CodeDepart>
<Enonce>
On cherche le titre de la chanson qui a le plus d'écoutes **tous artistes confondus**.

1.  Créer une variable `max_ecoutes = 0` et `meilleur_titre = ""`.
2.  Parcourir les artistes.
3.  Parcourir les `top_titres` de chaque artiste.
4.  Si `titre["ecoutes"]` est plus grand que `max_ecoutes`, mettre à jour les variables.
5.  Afficher le gagnant à la fin.
</Enonce>
<Verification>
```python
assert meilleur_titre == "Blinding Lights", "Le titre le plus écouté est Blinding Lights."
assert max_ecoutes == 90000000, "Blinding Lights a 90000000 écoutes."
assert "Blinding Lights" in SORTIE, "Le programme doit afficher le titre gagnant."
```
</Verification>

<Correction>
```python
max_ecoutes = 0
meilleur_titre = ""

for artiste in spotify_db:
    for chanson in artiste["top_titres"]:
        # chanson est un dictionnaire {"titre": "...", "ecoutes": ...}
        nb_ecoutes = chanson["ecoutes"]
        
        if nb_ecoutes > max_ecoutes:
            max_ecoutes = nb_ecoutes
            meilleur_titre = chanson["titre"]

print(f"Le titre le plus écouté est {meilleur_titre} avec {max_ecoutes} écoutes.")
```
</Correction>
</ExerciseSection>

<ExerciseSection id="ex-5-ajout" label="5. Ajouter un album" type="python">
<CodeDepart>
```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```
</CodeDepart>
<Enonce>
Orelsan vient de sortir un nouvel album : "Épilogue".
Ajouter cet album à la liste des albums d'Orelsan **en modifiant la structure**.

*Indice : `append()`*
</Enonce>
<Verification>
```python
assert spotify_db[0]["albums"] == ["Civilisation", "La fête est finie", "Épilogue"], "Les albums d'Orelsan doivent se terminer par Épilogue, ajouté une seule fois."
assert spotify_db[1]["albums"] == ["Brol", "Nonante-Cinq"], "Les albums des autres artistes ne changent pas."
```
</Verification>

<Correction>
```python
# On sait qu'Orelsan est à l'indice 0
spotify_db[0]["albums"].append("Épilogue")

print(spotify_db[0]["albums"])
```
</Correction>
</ExerciseSection>

</ExerciseTabs>

---

## 4. Défis Experts (Calculs & Filtrage)

Maintenant, on mélange tout : conditions `if`, boucles `for` et accès aux dictionnaires !

<ExerciseTabs courseId="tp_spotify_3" courseTitle="Niveau Expert">

<ExerciseSection id="ex-6-filtrage" label="6. Filtrage par genre" type="python">
<CodeDepart>
```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```
</CodeDepart>
<Enonce>
Afficher le nom de tous les artistes dont le genre est **"Pop"**.

1.  Parcourir la liste des artistes.
2.  Si le genre de l'artiste est égal à "Pop"...
3.  ... Afficher son nom.
</Enonce>
<Verification>
```python
lignes = [l.strip() for l in SORTIE.strip().splitlines()]
assert lignes == ["Angèle"], "Seule Angèle est Pop : le programme affiche Angèle."
```
</Verification>

<Correction>
```python
for artiste in spotify_db:
    if artiste["genre"] == "Pop":
        print(artiste["nom"])
```
</Correction>
</ExerciseSection>

<ExerciseSection id="ex-7-total" label="7. Total des écoutes" type="python">
<CodeDepart>
```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```
</CodeDepart>
<Enonce>
Calculer le nombre **total** d'écoutes cumulées pour **The Weeknd**.

1.  Cibler l'artiste The Weeknd (indice 2).
2.  Initialiser une variable `total = 0`.
3.  Parcourir sa liste `top_titres`.
4.  Ajouter les écoutes de chaque titre au total.
5.  Afficher le résultat.
</Enonce>
<Verification>
```python
assert total == 175000000, "The Weeknd cumule 90000000 + 85000000 = 175000000 écoutes."
assert "175000000" in SORTIE, "Le programme doit afficher le total."
```
</Verification>

<Correction>
```python
the_weeknd = spotify_db[2]
total = 0

for chanson in the_weeknd["top_titres"]:
    total = total + chanson["ecoutes"]

print(f"Total écoutes The Weeknd : {total}")
```
</Correction>
</ExerciseSection>

<ExerciseSection id="ex-8-recherche" label="8. Qui a fait cet album ?" type="python">
<CodeDepart>
```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```
</CodeDepart>
<Enonce>
On cherche l'artiste qui a sorti l'album **"Civilisation"**.
Le programme doit parcourir la base et afficher : `C'est Orelsan qui a fait Civilisation`.

*Indice : il faudra une boucle `for` (artistes) ET d'une condition `if "Civilisation" in ...`*
</Enonce>
<Verification>
```python
assert " ".join(SORTIE.split()) == "C'est Orelsan qui a fait Civilisation", "Afficher : C'est Orelsan qui a fait Civilisation"
```
</Verification>

<Correction>
```python
album_cherche = "Civilisation"

for artiste in spotify_db:
    # artiste["albums"] est une liste de strings
    if album_cherche in artiste["albums"]:
        print(f"C'est {artiste['nom']} qui a fait {album_cherche}")
```
</Correction>
</ExerciseSection>

<ExerciseSection id="ex-9-ajout-complexe" label="9. Ajouter un titre (Dur !)" type="python">
<CodeDepart>
```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```
</CodeDepart>
<Enonce>
Angèle vient de sortir "Démons" (30 000 000 écoutes).
Ajouter cette chanson à sa liste `top_titres`.

<Icone nom="triangle-alert" /> Attention : `top_titres` est une liste de **dictionnaires**. Il faut donc ajouter un objet de la forme `{"titre": "...", "ecoutes":...}`.
</Enonce>
<Verification>
```python
assert spotify_db[1]["top_titres"][-1] == {"titre": "Démons", "ecoutes": 30000000}, "Le dernier titre d'Angèle doit être le dictionnaire {'titre': 'Démons', 'ecoutes': 30000000}."
assert len(spotify_db[1]["top_titres"]) == 3, "Angèle doit avoir 3 titres."
```
</Verification>

<Correction>
```python
nouveau_titre = {
    "titre": "Démons", 
    "ecoutes": 30000000
}

# Angèle est à l'indice 1
spotify_db[1]["top_titres"].append(nouveau_titre)

print(spotify_db[1]["top_titres"])
```
</Correction>
</ExerciseSection>

</ExerciseTabs>

---

## 5. Défis Ultimes (Data Analyst) <Icone nom="user" />

Ici, on ne rigole plus. On va faire de la vraie analyse de données comme un Data Scientist chez Spotify.

<ExerciseTabs courseId="tp_spotify_4" courseTitle="Niveau Data Analyst">

<ExerciseSection id="ex-10-moyenne" label="10. Moyenne d'écoutes" type="python">
<CodeDepart>
```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```
</CodeDepart>
<Enonce>
Calculer la **moyenne** des écoutes par chanson pour **Angèle**.

1.  Cibler Angèle.
2.  Calculer la somme totale de ses écoutes (comme à l'exercice 7).
3.  Compter combien elle a de titres dans `top_titres` (avec `len()`).
4.  Diviser la somme par le nombre de titres.
</Enonce>
<Verification>
```python
assert moyenne == 19000000, "La moyenne d'Angèle vaut (18000000 + 20000000) / 2 = 19000000."
assert "19000000" in SORTIE, "Le programme doit afficher la moyenne."
```
</Verification>

<Correction>
```python
angele = spotify_db[1]
somme = 0
nb_titres = len(angele["top_titres"])

for chanson in angele["top_titres"]:
    somme = somme + chanson["ecoutes"]

moyenne = somme / nb_titres
print(f"Moyenne d'écoutes pour Angèle : {moyenne}")
```
</Correction>
</ExerciseSection>

<ExerciseSection id="ex-11-playlist" label="11. Générer une Playlist" type="python">
<CodeDepart>
```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```
</CodeDepart>
<Enonce>
On veut créer une "Playlist de Soirée" avec uniquement les tubes.
Créer une nouvelle liste `playlist_soiree` qui contient **tous les titres** (de tous les artistes) ayant **plus de 50 000 000 d'écoutes**.

1.  Créer une liste vide `playlist_soiree = []`.
2.  Parcourir chaque artiste.
3.  Parcourir chaque chanson de l'artiste.
4.  Si les écoutes > 50 000 000, ajouter le **titre** à la playlist.
5.  Afficher la playlist finale.
</Enonce>
<Verification>
```python
assert playlist_soiree == ["Blinding Lights", "Save Your Tears"], "Seuls Blinding Lights et Save Your Tears dépassent 50000000 écoutes."
assert "Blinding Lights" in SORTIE, "Le programme doit afficher la playlist."
```
</Verification>

<Correction>
```python
playlist_soiree = []

for artiste in spotify_db:
    for chanson in artiste["top_titres"]:
        if chanson["ecoutes"] > 50000000:
            playlist_soiree.append(chanson["titre"])

print("Ma Playlist de Soirée :", playlist_soiree)
```
</Correction>
</ExerciseSection>

<ExerciseSection id="ex-12-populaire-artiste" label="12. L'Artiste N°1" type="python">
<CodeDepart>
```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```
</CodeDepart>
<Enonce>
Qui est l'artiste le plus populaire au total ?
Calculer le cumul des écoutes pour **chaque** artiste, et afficher celui qui a le plus gros score.

*Astuce : il faudra une boucle pour calculer le total de chaque artiste, et comparer ce total avec un `max_total`.*
</Enonce>
<Verification>
```python
assert "The Weeknd" in SORTIE and "175000000" in SORTIE, "L'artiste N°1 est The Weeknd avec 175000000 écoutes."
assert "Angèle" not in SORTIE and "Orelsan" not in SORTIE, "Seul l'artiste N°1 est affiché."
```
</Verification>

<Correction>
```python
meilleur_artiste = ""
max_ecoutes_global = 0

for artiste in spotify_db:
    # 1. Calcul du total pour CET artiste
    total_artiste = 0
    for chanson in artiste["top_titres"]:
        total_artiste += chanson["ecoutes"]
    
    # 2. Est-ce que c'est le meilleur jusqu'ici ?
    if total_artiste > max_ecoutes_global:
        max_ecoutes_global = total_artiste
        meilleur_artiste = artiste["nom"]

print(f"L'artiste N°1 est {meilleur_artiste} avec {max_ecoutes_global} écoutes.")
```
</Correction>
</ExerciseSection>

<ExerciseSection id="ex-13-nettoyage" label="13. Nettoyage (Suppression)" type="python">
<CodeDepart>
```python
spotify_db = [
    {
        "nom": "Orelsan",
        "genre": "Rap",
        "albums": ["Civilisation", "La fête est finie"],
        "top_titres": [
            {"titre": "Basique", "ecoutes": 15000000},
            {"titre": "La Terre est ronde", "ecoutes": 12000000}
        ]
    },
    {
        "nom": "Angèle",
        "genre": "Pop",
        "albums": ["Brol", "Nonante-Cinq"],
        "top_titres": [
            {"titre": "Bruxelles je t'aime", "ecoutes": 18000000},
            {"titre": "Balance ton quoi", "ecoutes": 20000000}
        ]
    },
    {
        "nom": "The Weeknd",
        "genre": "RnB",
        "albums": ["After Hours", "Starboy"],
        "top_titres": [
            {"titre": "Blinding Lights", "ecoutes": 90000000},
            {"titre": "Save Your Tears", "ecoutes": 85000000}
        ]
    }
]
```
</CodeDepart>
<Enonce>
Orelsan renie son album "La fête est finie". Il veut le supprimer de la base.
Trouver Orelsan dans la base, et supprimer "La fête est finie" de sa liste d'albums.

*Indice : La méthode `.remove("Valeur")` est bien utile.*
</Enonce>
<Verification>
```python
assert spotify_db[0]["albums"] == ["Civilisation"], "Il ne reste que Civilisation dans les albums d'Orelsan."
assert spotify_db[1]["albums"] == ["Brol", "Nonante-Cinq"], "Les autres artistes ne changent pas."
```
</Verification>

<Correction>
```python
# Orelsan est à l'indice 0
orelsan_albums = spotify_db[0]["albums"]

if "La fête est finie" in orelsan_albums:
    orelsan_albums.remove("La fête est finie")

print(spotify_db[0]["albums"])
```
</Correction>
</ExerciseSection>

</ExerciseTabs>
