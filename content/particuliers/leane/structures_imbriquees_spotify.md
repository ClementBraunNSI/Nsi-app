---
title: "TP - Structures Imbriquées (Spotify)"
description: "Manipuler des listes de dictionnaires contenant des listes"
level: "particuliers"
chapter: "Structures de Données"
icon: "🎧"
allowedStudents: ["Léane"]
---

# 🎧 TP : Structures Imbriquées (Spotify)

## 🎯 Objectif
Comprendre comment naviguer dans des données complexes : **une liste de dictionnaires**, où chaque dictionnaire contient lui-même **des listes**.

C'est exactement comme cela que Spotify ou Netflix stockent tes données !

---

## 1. Analyse de la Structure

Voici notre base de données musicale `spotify_db`. C'est une **liste** qui contient 3 **dictionnaires** (les artistes).

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

### 🧠 Comment lire ça ?

Imagine que tu es un GPS. Pour trouver une info, tu dois suivre le chemin étape par étape.

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

<ExerciseTabs courseId="leane_structures" courseTitle="Structures Imbriquées">

<ExerciseSection id="ex-1-lecture" label="1. Lecture simple">
<Enonce>
Sans utiliser de boucle, écris les instructions pour afficher :

1.  Le genre musical de **The Weeknd**.
2.  Le deuxième album d'**Orelsan** ("La fête est finie").
3.  Le nombre d'écoutes de "Balance ton quoi" (Angèle).

*Astuce : Procède étape par étape. Trouve d'abord l'artiste, puis la clé, puis l'indice...*
</Enonce>

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

<ExerciseSection id="ex-2-parcours" label="2. Parcours simple">
<Enonce>
On veut afficher le nom de chaque artiste suivi de son genre musical.
Le format attendu :
`Orelsan - Rap`
`Angèle - Pop`
...

Utilise une boucle `for` qui parcourt la liste principale.
</Enonce>

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
Rappelle-toi : **Si c'est une liste, il faut (souvent) une boucle pour la parcourir.**

<ExerciseTabs courseId="leane_structures_adv" courseTitle="Niveau Avancé">

<ExerciseSection id="ex-3-albums" label="3. Lister les albums">
<Enonce>
L'objectif est d'afficher **tous les albums** présents dans la base de données, peu importe l'artiste.

1.  Parcours chaque artiste.
2.  Pour chaque artiste, parcours sa liste d'albums.
3.  Affiche le nom de l'album.
</Enonce>

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

<ExerciseSection id="ex-4-populaire" label="4. Le plus écouté">
<Enonce>

On cherche le titre de la chanson qui a le plus d'écoutes **tous artistes confondus**.

1.  Crée une variable `max_ecoutes = 0` et `meilleur_titre = ""`.
2.  Parcours les artistes.
3.  Parcours les `top_titres` de chaque artiste.
4.  Si `titre["ecoutes"]` est plus grand que `max_ecoutes`, mets à jour les variables.
5.  Affiche le gagnant à la fin.
</Enonce>

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

<ExerciseSection id="ex-5-ajout" label="5. Ajouter un album">
<Enonce>
Orelsan vient de sortir un nouvel album : "Épilogue".
Ajoute cet album à la liste des albums d'Orelsan **en modifiant la structure**.

*Indice : `append()`*
</Enonce>

<Correction>
```python
# On sait qu'Orelsan est à l'indice 0
spotify_db[0]["albums"].append("Épilogue")

print(spotify_db[0]["albums"])
```
</Correction>
</ExerciseSection>

</ExerciseTabs>
