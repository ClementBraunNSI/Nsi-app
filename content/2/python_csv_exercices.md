---
title: 'Exercices : Traitement CSV'
description: 'Cours sur Exercices : Traitement CSV'
level: premiere
chapter: Dictionnaires et Tables
icon: "files"
badgeId: premiere_fiche_exercices_csv
prerequisites:
  - python_exercices_dictionnaires
audience: public
groupe: csv
groupeTitre: "Données en tables (CSV)"
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.

Une table est représentée par une **liste de dictionnaires** : un dictionnaire par ligne, les clés sont les noms des colonnes. Le fichier CSV d'origine arrive sous forme de texte, avec `;` comme séparateur et une première ligne d'en-têtes :

```
nom;departement;population;altitude
Colmar;68;67214;194
Chamonix;74;8611;1035
```

<ExerciseTabs courseId="csv" courseTitle="Traitement de Tables">

<ExerciseSection id="1nsi-csv-1-1" label="1.1 [Introduction] - Les en-têtes" type="python">
<Enonce>
### Les en-têtes

Écrire une fonction `entetes(texte)` qui renvoie la liste des noms de colonnes d'un texte CSV (sa première ligne).

Exemple : pour le texte de l'introduction, `["nom", "departement", "population", "altitude"]`.

<Indices>
<Indice>

`texte.split("\n")` découpe le texte en lignes.

</Indice>
<Indice>

La première ligne se découpe à son tour avec `split(";")`.

</Indice>
<Indice>

```text
FONCTION entetes(texte)
    premiere ← première ligne de texte
    RENVOYER premiere découpée aux ";"
```

</Indice>
</Indices>

<Correction>

```python
def entetes(texte: str) -> list:
    premiere = texte.split("\n")[0]
    return premiere.split(";")
```

</Correction>
</Enonce>
<Verification>

```python
t = "nom;departement;population;altitude\nColmar;68;67214;194\n"
assert entetes(t) == ["nom", "departement", "population", "altitude"], "Les quatre en-têtes."
assert entetes("a;b") == ["a", "b"] and entetes("seul") == ["seul"], "Autres textes."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-1-2" label="1.2 [Introduction] - Nombre d'enregistrements" type="python">
<Enonce>
### Nombre d'enregistrements

Écrire une fonction `nb_enregistrements(texte)` qui renvoie le nombre de lignes de **données** d'un texte CSV : sans la ligne d'en-têtes et sans les lignes vides (un fichier se termine souvent par un retour à la ligne).

<Indices>
<Indice>

Découper en lignes, puis compter seulement les lignes non vides.

</Indice>
<Indice>

Retirer 1 pour la ligne d'en-têtes.

</Indice>
<Indice>

```text
FONCTION nb_enregistrements(texte)
    n ← nombre de lignes non vides de texte
    RENVOYER n - 1
```

</Indice>
</Indices>

<Correction>

```python
def nb_enregistrements(texte: str) -> int:
    n = 0
    for ligne in texte.split("\n"):
        if ligne.strip() != "":
            n = n + 1
    return n - 1
```

</Correction>
</Enonce>
<Verification>

```python
assert nb_enregistrements("nom;age\nLéa;16\nTom;17\n") == 2, "Deux enregistrements, malgré la ligne vide finale."
assert nb_enregistrements("nom;age") == 0, "Seulement les en-têtes."
assert nb_enregistrements("x\n1\n\n2\n3") == 3, "Une ligne vide au milieu est ignorée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-1-3" label="1.3 [Introduction] - Une colonne" type="python">
<Enonce>
### Une colonne

Écrire une fonction `colonne(table, cle)` qui renvoie la liste des valeurs de la colonne `cle`, dans l'ordre des lignes.

Exemple : `colonne(table, "nom")` renvoie la liste des noms de communes.

<Indices>
<Indice>

Chaque ligne est un dictionnaire : `ligne[cle]` donne sa valeur pour la colonne.

</Indice>
<Indice>

Parcourir la table et ajouter `ligne[cle]` à une liste.

</Indice>
<Indice>

```text
FONCTION colonne(table, cle)
    valeurs ← liste vide
    POUR CHAQUE ligne DE table : ajouter ligne[cle] à valeurs
    RENVOYER valeurs
```

</Indice>
</Indices>

<Correction>

```python
def colonne(table: list, cle: str) -> list:
    valeurs = []
    for ligne in table:
        valeurs.append(ligne[cle])
    return valeurs
```

</Correction>
</Enonce>
<Verification>

```python
table = [
    {"nom": "Colmar", "departement": "68", "population": 67214, "altitude": 194},
    {"nom": "Chamonix", "departement": "74", "population": 8611, "altitude": 1035},
    {"nom": "Mulhouse", "departement": "68", "population": 105735, "altitude": 240},
    {"nom": "Annecy", "departement": "74", "population": 130721, "altitude": 448},
    {"nom": "Obernai", "departement": "67", "population": 11873, "altitude": 185},
]
assert colonne(table, "nom") == ["Colmar", "Chamonix", "Mulhouse", "Annecy", "Obernai"], "La colonne des noms."
assert colonne(table, "altitude") == [194, 1035, 240, 448, 185], "La colonne des altitudes."
assert colonne([], "nom") == [], "Table vide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-1-4" label="1.4 [Introduction] - Population d'une commune" type="python">
<Enonce>
### Population d'une commune

Écrire une fonction `population_de(table, nom)` qui renvoie la population de la commune `nom`, ou `None` si elle n'est pas dans la table.

<Indices>
<Indice>

Parcourir la table jusqu'à trouver la ligne dont la clé `"nom"` vaut `nom`.

</Indice>
<Indice>

`return` dès qu'elle est trouvée. `return None` après la boucle.

</Indice>
<Indice>

```text
FONCTION population_de(table, nom)
    POUR CHAQUE ligne DE table
        SI ligne["nom"] = nom ALORS RENVOYER ligne["population"]
    RENVOYER None
```

</Indice>
</Indices>

<Correction>

```python
def population_de(table: list, nom: str):
    for ligne in table:
        if ligne["nom"] == nom:
            return ligne["population"]
    return None
```

</Correction>
</Enonce>
<Verification>

```python
table = [
    {"nom": "Colmar", "departement": "68", "population": 67214, "altitude": 194},
    {"nom": "Chamonix", "departement": "74", "population": 8611, "altitude": 1035},
    {"nom": "Mulhouse", "departement": "68", "population": 105735, "altitude": 240},
    {"nom": "Annecy", "departement": "74", "population": 130721, "altitude": 448},
    {"nom": "Obernai", "departement": "67", "population": 11873, "altitude": 185},
]
assert population_de(table, "Annecy") == 130721 and population_de(table, "Colmar") == 67214, "Communes présentes."
assert population_de(table, "Paris") is None, "Commune absente : None."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-2-1" label="2.1 [Facile] - Lire un CSV" type="python">
<Enonce>
### Lire un CSV

Écrire une fonction `lire_table(texte)` qui transforme un texte CSV en table : une liste de dictionnaires dont les clés sont les en-têtes. Toutes les valeurs restent des **textes**. Les lignes vides sont ignorées.

Contrainte : sans le module `csv`.

<Indices>
<Indice>

Lire les en-têtes sur la première ligne, puis parcourir les lignes suivantes.

</Indice>
<Indice>

Pour une ligne, `valeurs = ligne.split(";")`. La valeur de la colonne `i` va dans la clé `entetes[i]`.

</Indice>
<Indice>

```text
FONCTION lire_table(texte)
    lignes ← lignes non vides de texte
    entetes ← lignes[0] découpée aux ";"
    table ← liste vide
    POUR CHAQUE ligne DE lignes[1:]
        valeurs ← ligne découpée aux ";"
        enregistrement ← entetes[i] → valeurs[i] pour chaque i
        ajouter enregistrement à table
    RENVOYER table
```

</Indice>
</Indices>

<Correction>

```python
def lire_table(texte: str) -> list:
    lignes = [l for l in texte.split("\n") if l.strip() != ""]
    entetes = lignes[0].split(";")
    table = []
    for ligne in lignes[1:]:
        valeurs = ligne.split(";")
        enregistrement = {}
        for i in range(len(entetes)):
            enregistrement[entetes[i]] = valeurs[i]
        table.append(enregistrement)
    return table
```

</Correction>
</Enonce>
<Verification>

```python
t = "nom;departement;population;altitude\nColmar;68;67214;194\nChamonix;74;8611;1035\n"
assert lire_table(t) == [{"nom": "Colmar", "departement": "68", "population": "67214", "altitude": "194"},
                         {"nom": "Chamonix", "departement": "74", "population": "8611", "altitude": "1035"}], "Deux enregistrements, valeurs en texte."
assert lire_table("a;b\n") == [], "Seulement les en-têtes : table vide."
assert "import csv" not in PROGRAMME, "Sans le module csv."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-2-2" label="2.2 [Facile] - Convertir les nombres" type="python">
<Enonce>
### Convertir les nombres

Après lecture, toutes les valeurs sont des textes : `"67214" > "8611"` vaut `False` !

Écrire une fonction `convertir(table, cles)` qui renvoie une **nouvelle** table où les colonnes dont le nom est dans la liste `cles` sont converties en entiers. Les autres colonnes restent inchangées, et la table d'origine n'est pas modifiée.

<Indices>
<Indice>

Pour chaque ligne, créer une copie : `nouvelle = dict(ligne)`.

</Indice>
<Indice>

Puis, pour chaque clé de `cles`, remplacer `nouvelle[cle]` par `int(nouvelle[cle])`.

</Indice>
<Indice>

```text
FONCTION convertir(table, cles)
    resultat ← liste vide
    POUR CHAQUE ligne DE table
        nouvelle ← copie de ligne
        POUR CHAQUE cle DE cles : nouvelle[cle] ← entier(nouvelle[cle])
        ajouter nouvelle à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def convertir(table: list, cles: list) -> list:
    resultat = []
    for ligne in table:
        nouvelle = dict(ligne)
        for cle in cles:
            nouvelle[cle] = int(nouvelle[cle])
        resultat.append(nouvelle)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
brute = [{"nom": "Colmar", "departement": "68", "population": "67214"}]
assert convertir(brute, ["population"]) == [{"nom": "Colmar", "departement": "68", "population": 67214}], "La population devient un entier."
assert brute[0]["population"] == "67214", "La table d'origine n'est pas modifiée."
assert convertir(brute, []) == brute and convertir([], ["x"]) == [], "Rien à convertir."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-2-3" label="2.3 [Facile] - Sélection" type="python">
<Enonce>
### Sélection

Écrire une fonction `selection(table, departement)` qui renvoie la liste des lignes de la table dont le département vaut `departement` (un texte comme `"68"`), dans l'ordre.

<Indices>
<Indice>

Une sélection garde les lignes entières qui vérifient une condition.

</Indice>
<Indice>

Construire une nouvelle liste et y ajouter les lignes qui passent le test.

</Indice>
<Indice>

```text
FONCTION selection(table, departement)
    RENVOYER les lignes de table telles que ligne["departement"] = departement
```

</Indice>
</Indices>

<Correction>

```python
def selection(table: list, departement: str) -> list:
    resultat = []
    for ligne in table:
        if ligne["departement"] == departement:
            resultat.append(ligne)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
table = [
    {"nom": "Colmar", "departement": "68", "population": 67214, "altitude": 194},
    {"nom": "Chamonix", "departement": "74", "population": 8611, "altitude": 1035},
    {"nom": "Mulhouse", "departement": "68", "population": 105735, "altitude": 240},
    {"nom": "Annecy", "departement": "74", "population": 130721, "altitude": 448},
    {"nom": "Obernai", "departement": "67", "population": 11873, "altitude": 185},
]
assert [l["nom"] for l in selection(table, "68")] == ["Colmar", "Mulhouse"], "Le Haut-Rhin : Colmar et Mulhouse."
assert len(selection(table, "74")) == 2 and selection(table, "75") == [], "Haute-Savoie, puis aucun résultat."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-2-4" label="2.4 [Facile] - Population totale" type="python">
<Enonce>
### Population totale

Écrire une fonction `population_totale(table, departement)` qui renvoie la population cumulée des communes du département donné (0 s'il n'y en a aucune).

<Indices>
<Indice>

Combiner un filtre et une somme dans la même boucle.

</Indice>
<Indice>

Ou bien réutiliser la sélection, puis additionner.

</Indice>
<Indice>

```text
FONCTION population_totale(table, departement)
    total ← 0
    POUR CHAQUE ligne DE table
        SI ligne["departement"] = departement ALORS total ← total + ligne["population"]
    RENVOYER total
```

</Indice>
</Indices>

<Correction>

```python
def population_totale(table: list, departement: str) -> int:
    total = 0
    for ligne in table:
        if ligne["departement"] == departement:
            total = total + ligne["population"]
    return total
```

</Correction>
</Enonce>
<Verification>

```python
table = [
    {"nom": "Colmar", "departement": "68", "population": 67214, "altitude": 194},
    {"nom": "Chamonix", "departement": "74", "population": 8611, "altitude": 1035},
    {"nom": "Mulhouse", "departement": "68", "population": 105735, "altitude": 240},
    {"nom": "Annecy", "departement": "74", "population": 130721, "altitude": 448},
    {"nom": "Obernai", "departement": "67", "population": 11873, "altitude": 185},
]
assert population_totale(table, "68") == 172949, "Haut-Rhin : 172949."
assert population_totale(table, "67") == 11873 and population_totale(table, "01") == 0, "Bas-Rhin, puis aucun."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-3-1" label="3.1 [Moyen] - La plus haute" type="python">
<Enonce>
### La plus haute

Écrire une fonction `plus_haute(table)` qui renvoie le **nom** de la commune de plus haute altitude d'une table non vide.

Contrainte : sans trier la table.

<Indices>
<Indice>

Garder la ligne entière de la commune la plus haute rencontrée, pas seulement son altitude.

</Indice>
<Indice>

À la fin, renvoyer le nom de cette ligne.

</Indice>
<Indice>

```text
FONCTION plus_haute(table)
    meilleure ← table[0]
    POUR CHAQUE ligne DE table
        SI ligne["altitude"] > meilleure["altitude"] ALORS meilleure ← ligne
    RENVOYER meilleure["nom"]
```

</Indice>
</Indices>

<Correction>

```python
def plus_haute(table: list) -> str:
    meilleure = table[0]
    for ligne in table:
        if ligne["altitude"] > meilleure["altitude"]:
            meilleure = ligne
    return meilleure["nom"]
```

</Correction>
</Enonce>
<Verification>

```python
table = [
    {"nom": "Colmar", "departement": "68", "population": 67214, "altitude": 194},
    {"nom": "Chamonix", "departement": "74", "population": 8611, "altitude": 1035},
    {"nom": "Mulhouse", "departement": "68", "population": 105735, "altitude": 240},
    {"nom": "Annecy", "departement": "74", "population": 130721, "altitude": 448},
    {"nom": "Obernai", "departement": "67", "population": 11873, "altitude": 185},
]
assert plus_haute(table) == "Chamonix", "Chamonix est la plus haute."
assert plus_haute(table[2:]) == "Annecy", "Sans Colmar ni Chamonix : Annecy."
assert "sort" not in PROGRAMME, "Sans tri."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-3-2" label="3.2 [Moyen] - Trier une table" type="python">
<Enonce>
### Trier une table

Écrire une fonction `trier(table, cle, decroissant)` qui renvoie une nouvelle table triée selon la colonne `cle`, dans l'ordre décroissant si `decroissant` vaut `True`.

<Indices>
<Indice>

`sorted(table, key=...)` renvoie une nouvelle liste triée. `key` est une fonction qui donne, pour une ligne, la valeur à comparer.

</Indice>
<Indice>

`key=lambda ligne: ligne[cle]` et `reverse=decroissant` font tout le travail.

</Indice>
<Indice>

```text
FONCTION trier(table, cle, decroissant)
    RENVOYER table triée selon ligne[cle], à l'envers si decroissant
```

</Indice>
</Indices>

<Correction>

```python
def trier(table: list, cle: str, decroissant: bool) -> list:
    return sorted(table, key=lambda ligne: ligne[cle], reverse=decroissant)
```

</Correction>
</Enonce>
<Verification>

```python
table = [
    {"nom": "Colmar", "departement": "68", "population": 67214, "altitude": 194},
    {"nom": "Chamonix", "departement": "74", "population": 8611, "altitude": 1035},
    {"nom": "Mulhouse", "departement": "68", "population": 105735, "altitude": 240},
    {"nom": "Annecy", "departement": "74", "population": 130721, "altitude": 448},
    {"nom": "Obernai", "departement": "67", "population": 11873, "altitude": 185},
]
assert [l["nom"] for l in trier(table, "population", True)] == ["Annecy", "Mulhouse", "Colmar", "Obernai", "Chamonix"], "Par population décroissante."
assert [l["nom"] for l in trier(table, "nom", False)] == ["Annecy", "Chamonix", "Colmar", "Mulhouse", "Obernai"], "Par nom."
assert table[0]["nom"] == "Colmar", "La table d'origine n'est pas modifiée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-3-3" label="3.3 [Moyen] - Projection" type="python">
<Enonce>
### Projection

Une **projection** ne garde que certaines colonnes. Écrire une fonction `projection(table, cles)` qui renvoie une nouvelle table dont chaque ligne ne contient que les colonnes de la liste `cles`.

<Indices>
<Indice>

Pour chaque ligne, construire un nouveau dictionnaire avec seulement les clés voulues.

</Indice>
<Indice>

`{cle: ligne[cle] for cle in cles}` construit ce dictionnaire en une ligne.

</Indice>
<Indice>

```text
FONCTION projection(table, cles)
    RENVOYER, pour chaque ligne, le dictionnaire cle → ligne[cle] pour cle dans cles
```

</Indice>
</Indices>

<Correction>

```python
def projection(table: list, cles: list) -> list:
    resultat = []
    for ligne in table:
        nouvelle = {}
        for cle in cles:
            nouvelle[cle] = ligne[cle]
        resultat.append(nouvelle)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
table = [
    {"nom": "Colmar", "departement": "68", "population": 67214, "altitude": 194},
    {"nom": "Chamonix", "departement": "74", "population": 8611, "altitude": 1035},
    {"nom": "Mulhouse", "departement": "68", "population": 105735, "altitude": 240},
    {"nom": "Annecy", "departement": "74", "population": 130721, "altitude": 448},
    {"nom": "Obernai", "departement": "67", "population": 11873, "altitude": 185},
]
p = projection(table, ["nom", "altitude"])
assert p[1] == {"nom": "Chamonix", "altitude": 1035} and len(p) == 5, "Nom et altitude seulement."
assert projection(table, []) == [{}] * 5, "Aucune colonne gardée."
assert "population" in table[0], "La table d'origine garde toutes ses colonnes."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-3-4" label="3.4 [Moyen] - Population par département" type="python">
<Enonce>
### Population par département

Écrire une fonction `par_departement(table)` qui renvoie un dictionnaire associant à chaque département la population cumulée de ses communes.

<Indices>
<Indice>

Un dictionnaire de cumul : la clé est le département, la valeur un total.

</Indice>
<Indice>

`d.get(cle, 0)` donne 0 pour un département pas encore rencontré.

</Indice>
<Indice>

```text
FONCTION par_departement(table)
    cumul ← dictionnaire vide
    POUR CHAQUE ligne DE table
        cumul[ligne["departement"]] ← (valeur actuelle ou 0) + ligne["population"]
    RENVOYER cumul
```

</Indice>
</Indices>

<Correction>

```python
def par_departement(table: list) -> dict:
    cumul = {}
    for ligne in table:
        dep = ligne["departement"]
        cumul[dep] = cumul.get(dep, 0) + ligne["population"]
    return cumul
```

</Correction>
</Enonce>
<Verification>

```python
table = [
    {"nom": "Colmar", "departement": "68", "population": 67214, "altitude": 194},
    {"nom": "Chamonix", "departement": "74", "population": 8611, "altitude": 1035},
    {"nom": "Mulhouse", "departement": "68", "population": 105735, "altitude": 240},
    {"nom": "Annecy", "departement": "74", "population": 130721, "altitude": 448},
    {"nom": "Obernai", "departement": "67", "population": 11873, "altitude": 185},
]
assert par_departement(table) == {"68": 172949, "74": 139332, "67": 11873}, "Cumul par département."
assert par_departement([]) == {}, "Table vide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-4-1" label="4.1 [Difficile] - Écrire un CSV" type="python">
<Enonce>
### Écrire un CSV

Écrire une fonction `vers_csv(table, cles)` qui renvoie le texte CSV d'une table : une ligne d'en-têtes (les noms de `cles`, dans cet ordre), puis une ligne par enregistrement, les valeurs séparées par `;`. Chaque ligne se termine par `"\n"`.

<Indices>
<Indice>

`";".join(liste_de_textes)` assemble une ligne. Les nombres doivent d'abord passer par `str`.

</Indice>
<Indice>

Construire la liste des lignes, puis les assembler.

</Indice>
<Indice>

```text
FONCTION vers_csv(table, cles)
    texte ← cles jointes par ";" + retour à la ligne
    POUR CHAQUE ligne DE table
        texte ← texte + (texte(ligne[cle]) pour cle dans cles, joints par ";") + retour à la ligne
    RENVOYER texte
```

</Indice>
</Indices>

<Correction>

```python
def vers_csv(table: list, cles: list) -> str:
    texte = ";".join(cles) + "\n"
    for ligne in table:
        texte = texte + ";".join(str(ligne[cle]) for cle in cles) + "\n"
    return texte
```

</Correction>
</Enonce>
<Verification>

```python
table = [
    {"nom": "Colmar", "departement": "68", "population": 67214, "altitude": 194},
    {"nom": "Chamonix", "departement": "74", "population": 8611, "altitude": 1035},
    {"nom": "Mulhouse", "departement": "68", "population": 105735, "altitude": 240},
    {"nom": "Annecy", "departement": "74", "population": 130721, "altitude": 448},
    {"nom": "Obernai", "departement": "67", "population": 11873, "altitude": 185},
]
assert vers_csv(table[:2], ["nom", "altitude"]) == "nom;altitude\nColmar;194\nChamonix;1035\n", "Deux lignes, deux colonnes."
assert vers_csv([], ["a", "b"]) == "a;b\n", "Table vide : les en-têtes seulement."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-4-2" label="4.2 [Difficile] - Doublons" type="python">
<Enonce>
### Doublons

Écrire une fonction `doublons(table, cle)` qui renvoie la liste **triée** des valeurs de la colonne `cle` qui apparaissent sur plusieurs lignes.

<Indices>
<Indice>

Compter les apparitions de chaque valeur dans un dictionnaire.

</Indice>
<Indice>

Garder les valeurs dont le compte dépasse 1, puis trier.

</Indice>
<Indice>

```text
FONCTION doublons(table, cle)
    compte ← nombre d'apparitions de chaque ligne[cle]
    RENVOYER liste triée des valeurs dont le compte > 1
```

</Indice>
</Indices>

<Correction>

```python
def doublons(table: list, cle: str) -> list:
    compte = {}
    for ligne in table:
        compte[ligne[cle]] = compte.get(ligne[cle], 0) + 1
    return sorted([valeur for valeur, n in compte.items() if n > 1])
```

</Correction>
</Enonce>
<Verification>

```python
table = [
    {"nom": "Colmar", "departement": "68", "population": 67214, "altitude": 194},
    {"nom": "Chamonix", "departement": "74", "population": 8611, "altitude": 1035},
    {"nom": "Mulhouse", "departement": "68", "population": 105735, "altitude": 240},
    {"nom": "Annecy", "departement": "74", "population": 130721, "altitude": 448},
    {"nom": "Obernai", "departement": "67", "population": 11873, "altitude": 185},
]
assert doublons(table, "departement") == ["68", "74"], "Deux départements ont plusieurs communes."
assert doublons(table, "nom") == [], "Aucun nom en double."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-4-3" label="4.3 [Difficile] - Jointure" type="python">
<Enonce>
### Jointure

Une seconde table donne le nom des départements : `[{"code": "68", "nom_dep": "Haut-Rhin"}, …]`.

Écrire une fonction `jointure(communes, departements)` qui renvoie une nouvelle table : chaque ligne de `communes` complétée d'une colonne `"nom_dep"`. Une commune dont le département est inconnu reçoit `"?"`.

<Indices>
<Indice>

Préparer d'abord, à partir de `departements`, un dictionnaire qui associe à chaque code le nom du département. La recherche devient alors immédiate.

</Indice>
<Indice>

Copier chaque ligne de `communes` avant d'ajouter la colonne, pour ne pas modifier la table d'origine.

</Indice>
<Indice>

```text
FONCTION jointure(communes, departements)
    noms ← dictionnaire code → nom_dep
    POUR CHAQUE ligne DE communes
        nouvelle ← copie de ligne
        nouvelle["nom_dep"] ← noms[ligne["departement"]], ou "?"
        ajouter nouvelle au résultat
```

</Indice>
</Indices>

<Correction>

```python
def jointure(communes: list, departements: list) -> list:
    noms = {}
    for d in departements:
        noms[d["code"]] = d["nom_dep"]
    resultat = []
    for ligne in communes:
        nouvelle = dict(ligne)
        nouvelle["nom_dep"] = noms.get(ligne["departement"], "?")
        resultat.append(nouvelle)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
table = [
    {"nom": "Colmar", "departement": "68", "population": 67214, "altitude": 194},
    {"nom": "Chamonix", "departement": "74", "population": 8611, "altitude": 1035},
    {"nom": "Mulhouse", "departement": "68", "population": 105735, "altitude": 240},
    {"nom": "Annecy", "departement": "74", "population": 130721, "altitude": 448},
    {"nom": "Obernai", "departement": "67", "population": 11873, "altitude": 185},
]
deps = [{"code": "68", "nom_dep": "Haut-Rhin"}, {"code": "74", "nom_dep": "Haute-Savoie"}]
j = jointure(table, deps)
assert [l["nom_dep"] for l in j] == ["Haut-Rhin", "Haute-Savoie", "Haut-Rhin", "Haute-Savoie", "?"], "Noms des départements, ? pour l'inconnu."
assert j[0]["population"] == 67214, "Les autres colonnes sont gardées."
assert "nom_dep" not in table[0], "La table d'origine n'est pas modifiée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-4-4" label="4.4 [Difficile] - Nettoyage des données" type="python">
<Enonce>
### Nettoyage des données

Un fichier réel contient des erreurs. Écrire une fonction `nettoyer(table)` qui reçoit une table **lue en texte** (colonnes `nom`, `departement`, `population`, `altitude`) et renvoie le tuple `(propres, rejets)` :
- `propres` : la liste des lignes valides, avec `population` et `altitude` converties en entiers ;
- `rejets` : le nombre de lignes rejetées.

Une ligne est rejetée si une valeur est vide, ou si la population ou l'altitude ne sont pas écrites uniquement en chiffres.

<Indices>
<Indice>

Tester la validité **avant** de convertir : `int("")` ou `int("abc")` provoquerait une erreur.

</Indice>
<Indice>

`valeur.isdigit()` vaut `False` pour un texte vide comme pour un texte qui contient autre chose que des chiffres.

</Indice>
<Indice>

```text
FONCTION nettoyer(table)
    propres ← liste vide ; rejets ← 0
    POUR CHAQUE ligne DE table
        SI une valeur est vide OU population ou altitude pas en chiffres ALORS rejets ← rejets + 1
        SINON ajouter la ligne convertie à propres
    RENVOYER (propres, rejets)
```

</Indice>
</Indices>

<Correction>

```python
def nettoyer(table: list) -> tuple:
    propres = []
    rejets = 0
    for ligne in table:
        vide = any(valeur == "" for valeur in ligne.values())
        if vide or not ligne["population"].isdigit() or not ligne["altitude"].isdigit():
            rejets = rejets + 1
        else:
            nouvelle = dict(ligne)
            nouvelle["population"] = int(ligne["population"])
            nouvelle["altitude"] = int(ligne["altitude"])
            propres.append(nouvelle)
    return (propres, rejets)
```

</Correction>
</Enonce>
<Verification>

```python
brute = [
    {"nom": "Colmar", "departement": "68", "population": "67214", "altitude": "194"},
    {"nom": "", "departement": "68", "population": "100", "altitude": "200"},
    {"nom": "Gap", "departement": "05", "population": "40 895", "altitude": "735"},
    {"nom": "Annecy", "departement": "74", "population": "130721", "altitude": "448"},
    {"nom": "Brest", "departement": "29", "population": "139342", "altitude": "-"},
]
propres, rejets = nettoyer(brute)
assert rejets == 3, "Trois lignes rejetées : nom vide, espace dans la population, altitude « - »."
assert [l["nom"] for l in propres] == ["Colmar", "Annecy"] and propres[1]["population"] == 130721, "Deux lignes propres, converties."
assert nettoyer([]) == ([], 0), "Table vide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-5-1" label="5.1 [Expert] - Champs entre guillemets" type="python">
<Enonce>
### Champs entre guillemets

Dans un vrai CSV, un champ peut contenir le séparateur s'il est entre guillemets : la ligne `Saint-Malo;"Bretagne; Ille-et-Vilaine";35` a trois champs, le deuxième étant `Bretagne; Ille-et-Vilaine`.

Écrire une fonction `decouper(ligne)` qui renvoie la liste des champs d'une ligne. Les guillemets qui entourent un champ ne font pas partie de sa valeur.

Contrainte : sans le module `csv` (`split` ne suffit plus).

<Indices>
<Indice>

Parcourir la ligne caractère par caractère en se souvenant d'un état : est-on **à l'intérieur** de guillemets ?

</Indice>
<Indice>

Un `"` inverse l'état. Un `;` termine le champ en cours seulement si l'on n'est pas entre guillemets. Les autres caractères s'ajoutent au champ en cours.

</Indice>
<Indice>

Ne pas oublier le dernier champ, après la boucle.

</Indice>
<Indice>

```text
FONCTION decouper(ligne)
    champs ← liste vide ; courant ← "" ; dedans ← FAUX
    POUR CHAQUE c DE ligne
        SI c = '"' ALORS dedans ← NON dedans
        SINON SI c = ";" ET NON dedans ALORS ajouter courant à champs ; courant ← ""
        SINON courant ← courant + c
    ajouter courant à champs
    RENVOYER champs
```

</Indice>
</Indices>

<Correction>

```python
def decouper(ligne: str) -> list:
    champs = []
    courant = ""
    dedans = False
    for c in ligne:
        if c == '"':
            dedans = not dedans
        elif c == ";" and not dedans:
            champs.append(courant)
            courant = ""
        else:
            courant = courant + c
    champs.append(courant)
    return champs
```

</Correction>
</Enonce>
<Verification>

```python
assert decouper('Saint-Malo;"Bretagne; Ille-et-Vilaine";35') == ["Saint-Malo", "Bretagne; Ille-et-Vilaine", "35"], "Champ protégé par des guillemets."
assert decouper("a;b;c") == ["a", "b", "c"] and decouper("seul") == ["seul"], "Sans guillemets."
assert decouper('a;;"";d') == ["a", "", "", "d"], "Champs vides."
assert decouper('"x;y;z"') == ["x;y;z"], "Un seul champ protégé."
assert "import csv" not in PROGRAMME, "Sans le module csv."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-5-2" label="5.2 [Expert] - Les plus grandes de chaque groupe" type="python">
<Enonce>
### Les plus grandes de chaque groupe

Écrire une fonction `top_par_groupe(table, groupe, cle, n)` qui renvoie un dictionnaire associant à chaque valeur de la colonne `groupe` la liste des **noms** (colonne `"nom"`) des `n` lignes qui ont les plus grandes valeurs de `cle`, de la plus grande à la plus petite.

Exemple : `top_par_groupe(table, "departement", "population", 1)` donne la commune la plus peuplée de chaque département.

<Indices>
<Indice>

Regrouper d'abord les lignes par groupe dans un dictionnaire de listes.

</Indice>
<Indice>

Ensuite, pour chaque groupe, trier ses lignes par `cle` décroissante et garder les `n` premiers noms.

</Indice>
<Indice>

```text
FONCTION top_par_groupe(table, groupe, cle, n)
    groupes ← dictionnaire valeur de groupe → liste des lignes
    resultat ← dictionnaire vide
    POUR CHAQUE (g, lignes) DE groupes
        triees ← lignes triées par ligne[cle] décroissante
        resultat[g] ← les noms des n premières
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def top_par_groupe(table: list, groupe: str, cle: str, n: int) -> dict:
    groupes = {}
    for ligne in table:
        groupes.setdefault(ligne[groupe], []).append(ligne)
    resultat = {}
    for g, lignes in groupes.items():
        triees = sorted(lignes, key=lambda l: l[cle], reverse=True)
        resultat[g] = [l["nom"] for l in triees[:n]]
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
table = [
    {"nom": "Colmar", "departement": "68", "population": 67214, "altitude": 194},
    {"nom": "Chamonix", "departement": "74", "population": 8611, "altitude": 1035},
    {"nom": "Mulhouse", "departement": "68", "population": 105735, "altitude": 240},
    {"nom": "Annecy", "departement": "74", "population": 130721, "altitude": 448},
    {"nom": "Obernai", "departement": "67", "population": 11873, "altitude": 185},
]
assert top_par_groupe(table, "departement", "population", 1) == {"68": ["Mulhouse"], "74": ["Annecy"], "67": ["Obernai"]}, "La plus peuplée de chaque département."
assert top_par_groupe(table, "departement", "altitude", 5)["74"] == ["Chamonix", "Annecy"], "Moins de n communes : toutes, triées."
assert top_par_groupe([], "departement", "altitude", 2) == {}, "Table vide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-5-3" label="5.3 [Expert] - Mise à jour d'une table" type="python">
<Enonce>
### Mise à jour d'une table

Écrire une fonction `mettre_a_jour(table, nouvelles, cle)` qui renvoie une nouvelle table : chaque ligne de `nouvelles` **remplace** la ligne de `table` qui a la même valeur de `cle` (à la même position), ou s'ajoute **à la fin** si cette valeur n'existait pas. Si `nouvelles` contient plusieurs fois la même valeur de `cle`, la dernière l'emporte.

<Indices>
<Indice>

Un dictionnaire qui associe à chaque valeur de clé sa position dans le résultat permet de retrouver immédiatement la ligne à remplacer.

</Indice>
<Indice>

Copier d'abord `table` dans le résultat, remplir le dictionnaire des positions, puis traiter les nouvelles lignes une à une.

</Indice>
<Indice>

```text
FONCTION mettre_a_jour(table, nouvelles, cle)
    resultat ← copie de table
    position ← ligne[cle] → indice, pour chaque ligne de resultat
    POUR CHAQUE ligne DE nouvelles
        SI ligne[cle] ∈ position ALORS resultat[position[ligne[cle]]] ← ligne
        SINON ajouter ligne à resultat ; position[ligne[cle]] ← dernier indice
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def mettre_a_jour(table: list, nouvelles: list, cle: str) -> list:
    resultat = list(table)
    position = {}
    for i in range(len(resultat)):
        position[resultat[i][cle]] = i
    for ligne in nouvelles:
        if ligne[cle] in position:
            resultat[position[ligne[cle]]] = ligne
        else:
            resultat.append(ligne)
            position[ligne[cle]] = len(resultat) - 1
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
t = [{"id": 1, "v": "a"}, {"id": 2, "v": "b"}]
m = mettre_a_jour(t, [{"id": 2, "v": "B"}, {"id": 3, "v": "c"}, {"id": 3, "v": "C"}], "id")
assert m == [{"id": 1, "v": "a"}, {"id": 2, "v": "B"}, {"id": 3, "v": "C"}], "Remplacement, ajout, puis dernière version."
assert t == [{"id": 1, "v": "a"}, {"id": 2, "v": "b"}], "La table d'origine n'est pas modifiée."
assert mettre_a_jour([], [], "id") == [], "Tables vides."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-5-4" label="5.4 [Expert] - Tableau croisé" type="python">
<Enonce>
### Tableau croisé

Un tableau croisé compte les lignes selon deux colonnes à la fois.

Écrire une fonction `croiser(table, c1, c2)` qui renvoie un dictionnaire de dictionnaires : `resultat[a][b]` est le nombre de lignes où la colonne `c1` vaut `a` et la colonne `c2` vaut `b`. Seules les combinaisons présentes apparaissent.

Exemple : avec des colonnes `"classe"` et `"option"`, `resultat["1A"]["NSI"]` compte les élèves de 1A qui suivent NSI.

<Indices>
<Indice>

Deux niveaux de dictionnaires : créer le dictionnaire intérieur la première fois qu'une valeur de `c1` apparaît.

</Indice>
<Indice>

`resultat.setdefault(a, {})` renvoie le dictionnaire intérieur, en le créant vide si besoin.

</Indice>
<Indice>

```text
FONCTION croiser(table, c1, c2)
    resultat ← dictionnaire vide
    POUR CHAQUE ligne DE table
        a ← ligne[c1] ; b ← ligne[c2]
        SI a ∉ resultat ALORS resultat[a] ← dictionnaire vide
        resultat[a][b] ← (valeur actuelle ou 0) + 1
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def croiser(table: list, c1: str, c2: str) -> dict:
    resultat = {}
    for ligne in table:
        a, b = ligne[c1], ligne[c2]
        interieur = resultat.setdefault(a, {})
        interieur[b] = interieur.get(b, 0) + 1
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
eleves = [{"classe": "1A", "option": "NSI"}, {"classe": "1A", "option": "SVT"}, {"classe": "1B", "option": "NSI"},
          {"classe": "1A", "option": "NSI"}, {"classe": "1B", "option": "NSI"}]
assert croiser(eleves, "classe", "option") == {"1A": {"NSI": 2, "SVT": 1}, "1B": {"NSI": 2}}, "Tableau croisé classe × option."
assert croiser(eleves, "option", "classe")["NSI"] == {"1A": 2, "1B": 2}, "Dans l'autre sens."
assert croiser([], "a", "b") == {}, "Table vide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-6-1" label="6.1 [Mini-projet] - Résultats du bac blanc" type="python">
<Enonce>
### Résultats du bac blanc

**Contexte.** Après le bac blanc, chaque professeur a saisi ses notes dans un tableur partagé, exporté en un fichier CSV. Le proviseur adjoint veut, en un clic, les moyennes pondérées des élèves, leur mention, le classement, des statistiques par matière et par classe, et un fichier récapitulatif à transmettre aux professeurs principaux.

**Les données** : le fichier a pour colonnes `eleve;classe;matiere;coef;note`, une ligne par copie. Une copie non rendue est notée `abs` : elle ne compte pas dans les moyennes. Le code de départ contient un exemple, `FICHIER`, dont voici le début :

```
eleve;classe;matiere;coef;note
Léa;T1;NSI;16;17
Léa;T1;Maths;16;12.5
Tom;T1;Maths;16;abs
```

**Les fonctions du traitement**
- `charger(texte)` : transforme le fichier en table utilisable. Renvoie la liste de dictionnaires (un par ligne), avec `coef` en entier et `note` en flottant, ou `None` pour `abs`.
- `moyenne_eleve(table, eleve)` : la moyenne qui figurera sur le relevé. Renvoie la moyenne **pondérée** par les coefficients (copies absentes exclues), arrondie au centième, ou `None` si l'élève n'a aucune note.
- `mention(moyenne)` : l'appréciation du jury. Renvoie `"refusé"` sous 8, `"rattrapage"` sous 10, `"admis"` sous 12, `"assez bien"` sous 14, `"bien"` sous 16, `"très bien"` sous 18, `"félicitations"` au-delà.
- `classement(table)` : le palmarès. Renvoie la liste des tuples `(eleve, moyenne, rang)` des élèves qui ont une moyenne, par moyenne décroissante puis par nom. Deux élèves de même moyenne partagent le même rang, et le rang suivant est sauté (« 1, 2, 2, 4 »).
- `stats_matiere(table, matiere)` : pour le conseil pédagogique de chaque matière. Renvoie le tuple `(minimum, maximum, moyenne, absents)` des notes de la matière (moyenne simple, arrondie au centième).
- `stats_classes(table)` : pour comparer les classes. Renvoie un dictionnaire qui associe à chaque classe le tuple `(effectif, moyenne, reussite)`, c'est-à-dire le nombre d'élèves de la classe, moyenne de leurs moyennes (arrondie au centième, élèves sans note exclus) et pourcentage d'élèves ayant au moins 10 sur l'effectif total (arrondi au dixième).
- `rapport(table)` : le fichier envoyé aux professeurs principaux. Renvoie le texte CSV `eleve;classe;moyenne;mention;rang` (en-têtes compris, chaque ligne terminée par `"\n"`), dans l'ordre du classement.

<Indices>
<Indice>

`charger` et `moyenne_eleve` sont la base : les autres fonctions les appellent. Une fonction `eleves(table)` (liste sans doublon) et une fonction `classe_de(table, eleve)` évitent de répéter des boucles.

</Indice>
<Indice>

Une moyenne pondérée vaut `somme(note × coef) / somme(coef)`, sur les seules lignes où la note n'est pas `None`.

</Indice>
<Indice>

Pour les rangs, parcourir le classement trié : le rang d'un élève est sa position (à partir de 1), sauf s'il a la même moyenne que le précédent.

</Indice>
<Indice>

```text
(cœur du programme : le classement avec ex æquo)
FONCTION classement(table)
    liste ← [(e, moyenne_eleve(table, e)) pour chaque élève e ayant une moyenne]
    trier liste par (moyenne décroissante, nom)
    resultat ← []
    POUR i ALLANT DE 0 À longueur(liste) - 1
        SI i = 0 OU moyenne de liste[i] ≠ moyenne de liste[i - 1] ALORS rang ← i + 1
        ajouter (nom, moyenne, rang) à resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
FICHIER = """eleve;classe;matiere;coef;note
Léa;T1;NSI;16;17
Léa;T1;Maths;16;12.5
Léa;T1;Philo;8;9
Tom;T1;NSI;16;8
Tom;T1;Maths;16;abs
Tom;T1;Philo;8;11
Inès;T2;NSI;16;14
Inès;T2;Maths;16;15
Inès;T2;Philo;8;12
Noé;T2;NSI;16;10
Noé;T2;Maths;16;9
Noé;T2;Philo;8;13.5
Zoé;T2;NSI;16;abs
Zoé;T2;Maths;16;abs
Zoé;T2;Philo;8;abs
"""


def charger(texte: str) -> list:
    lignes = [l for l in texte.split("\n") if l.strip()]
    entetes = lignes[0].split(";")
    table = []
    for ligne in lignes[1:]:
        d = dict(zip(entetes, ligne.split(";")))
        d["coef"] = int(d["coef"])
        d["note"] = None if d["note"] == "abs" else float(d["note"])
        table.append(d)
    return table


def eleves(table: list) -> list:
    noms = []
    for l in table:
        if l["eleve"] not in noms:
            noms.append(l["eleve"])
    return noms


def moyenne_eleve(table: list, eleve: str):
    lignes = [l for l in table if l["eleve"] == eleve and l["note"] is not None]
    if not lignes:
        return None
    return round(sum(l["note"] * l["coef"] for l in lignes) / sum(l["coef"] for l in lignes), 2)


def mention(moyenne: float) -> str:
    for seuil, nom in ((8, "refusé"), (10, "rattrapage"), (12, "admis"), (14, "assez bien"), (16, "bien"), (18, "très bien")):
        if moyenne < seuil:
            return nom
    return "félicitations"


def classement(table: list) -> list:
    liste = [(e, moyenne_eleve(table, e)) for e in eleves(table) if moyenne_eleve(table, e) is not None]
    liste.sort(key=lambda t: (-t[1], t[0]))
    resultat = []
    rang = 0
    for i in range(len(liste)):
        if i == 0 or liste[i][1] != liste[i - 1][1]:
            rang = i + 1
        resultat.append((liste[i][0], liste[i][1], rang))
    return resultat


def stats_matiere(table: list, matiere: str) -> tuple:
    lignes = [l for l in table if l["matiere"] == matiere]
    notes = [l["note"] for l in lignes if l["note"] is not None]
    return (min(notes), max(notes), round(sum(notes) / len(notes), 2), len(lignes) - len(notes))


def stats_classes(table: list) -> dict:
    resultat = {}
    for c in sorted({l["classe"] for l in table}):
        membres = [e for e in eleves(table) if any(l["eleve"] == e and l["classe"] == c for l in table)]
        moyennes = [moyenne_eleve(table, e) for e in membres if moyenne_eleve(table, e) is not None]
        reussis = sum(1 for m in moyennes if m >= 10)
        resultat[c] = (len(membres), round(sum(moyennes) / len(moyennes), 2), round(reussis / len(membres) * 100, 1))
    return resultat


def rapport(table: list) -> str:
    texte = "eleve;classe;moyenne;mention;rang\n"
    for e, m, rang in classement(table):
        classe = [l["classe"] for l in table if l["eleve"] == e][0]
        texte = texte + f"{e};{classe};{m};{mention(m)};{rang}\n"
    return texte
```

</Correction>
</Enonce>
<CodeDepart>

```python
FICHIER = """eleve;classe;matiere;coef;note
Léa;T1;NSI;16;17
Léa;T1;Maths;16;12.5
Léa;T1;Philo;8;9
Tom;T1;NSI;16;8
Tom;T1;Maths;16;abs
Tom;T1;Philo;8;11
Inès;T2;NSI;16;14
Inès;T2;Maths;16;15
Inès;T2;Philo;8;12
Noé;T2;NSI;16;10
Noé;T2;Maths;16;9
Noé;T2;Philo;8;13.5
Zoé;T2;NSI;16;abs
Zoé;T2;Maths;16;abs
Zoé;T2;Philo;8;abs
"""
```

</CodeDepart>
<Verification>

```python
t = charger(FICHIER)
assert len(t) == 15 and t[0] == {"eleve": "Léa", "classe": "T1", "matiere": "NSI", "coef": 16, "note": 17.0} and t[4]["note"] is None, "Chargement."
assert moyenne_eleve(t, "Léa") == 13.6 and moyenne_eleve(t, "Tom") == 9.0 and moyenne_eleve(t, "Zoé") is None, "Moyennes pondérées, absences exclues."
assert [mention(m) for m in (7.9, 8, 9.99, 10, 13.6, 15, 17, 18)] == ["refusé", "rattrapage", "rattrapage", "admis", "assez bien", "bien", "très bien", "félicitations"], "Mentions."
assert classement(t) == [("Inès", 14.0, 1), ("Léa", 13.6, 2), ("Noé", 10.3, 3), ("Tom", 9.0, 4)], "Classement."
t2 = charger("eleve;classe;matiere;coef;note\nA;X;M;1;10\nB;X;M;1;12\nC;X;M;1;10\nD;X;M;1;9\n")
assert classement(t2) == [("B", 12.0, 1), ("A", 10.0, 2), ("C", 10.0, 2), ("D", 9.0, 4)], "Ex æquo : rang partagé, rang suivant sauté."
assert stats_matiere(t, "Maths") == (9.0, 15.0, 12.17, 2) and stats_matiere(t, "Philo") == (9.0, 13.5, 11.38, 1), "Statistiques par matière."
assert stats_classes(t) == {"T1": (2, 11.3, 50.0), "T2": (3, 12.15, 66.7)}, "Statistiques par classe (Zoé compte dans l'effectif)."
lignes = rapport(t).split("\n")
assert lignes[0] == "eleve;classe;moyenne;mention;rang" and lignes[1] == "Inès;T2;14.0;bien;1" and lignes[4] == "Tom;T1;9.0;rattrapage;4" and lignes[5] == "", "Rapport CSV."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-csv-6-2" label="6.2 [Mini-projet] - Vélos en libre-service" type="python">
<Enonce>
### Vélos en libre-service

**Contexte.** La ville met en place des vélos en libre-service. Chaque trajet est enregistré par les bornes et exporté chaque soir dans un fichier CSV. Le service des mobilités veut un tableau de bord : combien rapportent les trajets, à quelles heures les vélos sont le plus utilisés, quelles stations se vident ou se remplissent (pour y envoyer le camion de rééquilibrage) et quels trajets sont les plus fréquents.

**Les données** : le fichier a pour colonnes `id;depart;arrivee;debut;duree` : le numéro du trajet, les stations de départ et d'arrivée, l'instant du départ (`AAAA-MM-JJ HH:MM`) et la durée en minutes. Le code de départ contient un extrait, `FICHIER` :

```
id;depart;arrivee;debut;duree
1;Gare;Mairie;2026-10-05 08:12;14
3;Campus;Gare;2026-10-05 17:05;65
```

**Les fonctions du tableau de bord**
- `charger(texte)` : transforme l'export en table. Renvoie la liste de dictionnaires, avec `id` et `duree` en entiers.
- `cout(duree)` : la grille tarifaire, appliquée à chaque trajet. Les 30 premières minutes sont gratuites, puis 1 € par demi-heure **commencée**, avec un plafond de 12 €. Reçoit une durée et renvoie le prix.
- `recette(table, jour)` : ce que le service a encaissé un jour donné (`"AAAA-MM-JJ"`). Renvoie la somme des coûts des trajets partis ce jour-là.
- `par_heure(table)` et `heure_de_pointe(table)` : pour prévoir le personnel. La première renvoie une liste de 24 entiers, le nombre de départs pour chaque heure de la journée. La seconde renvoie l'heure qui compte le plus de départs (la plus tôt en cas d'égalité).
- `soldes(table)` et `a_reequilibrer(table, seuil)` : pour organiser le camion. La première renvoie un dictionnaire qui associe à chaque station son solde, c'est-à-dire ses arrivées moins ses départs (une station au solde négatif se vide). La seconde renvoie la liste triée des stations dont le solde vaut au moins `seuil` en valeur absolue.
- `trajets_populaires(table, k)` : pour décider où ajouter des pistes cyclables. Renvoie les `k` couples `(depart, arrivee)` les plus fréquents, sous forme de liste de tuples `((depart, arrivee), nombre)`, par nombre décroissant puis par ordre alphabétique des couples.
- `duree_moyenne(table, station)` : pour l'affichage d'une station. Renvoie la durée moyenne des trajets partis de la station, arrondie à la minute (`None` s'il n'y en a pas).

<Indices>
<Indice>

L'heure d'un départ est dans le texte : `debut[11:13]`. Le jour est `debut[:10]`.

</Indice>
<Indice>

Pour le coût, le nombre de demi-heures commencées au-delà de 30 min est l'arrondi supérieur de `(duree - 30) / 30` : avec des entiers, `(duree - 30 + 29) // 30`.

</Indice>
<Indice>

Les fonctions de comptage suivent toutes le même modèle : un dictionnaire (ou une liste) de compteurs rempli en un parcours, puis un tri ou une recherche de maximum.

</Indice>
<Indice>

```text
(cœur du programme : le coût d'un trajet)
FONCTION cout(duree)
    SI duree ≤ 30 ALORS RENVOYER 0
    demi_heures ← (duree - 30 + 29) // 30
    RENVOYER min(demi_heures, 12)
```

</Indice>
</Indices>

<Correction>

```python
FICHIER = """id;depart;arrivee;debut;duree
1;Gare;Mairie;2026-10-05 08:12;14
2;Gare;Campus;2026-10-05 08:40;31
3;Campus;Gare;2026-10-05 17:05;65
4;Mairie;Gare;2026-10-05 17:30;12
5;Gare;Mairie;2026-10-06 08:05;16
6;Port;Gare;2026-10-06 08:55;200
7;Gare;Mairie;2026-10-06 17:45;20
8;Campus;Port;2026-10-06 18:10;45
"""


def charger(texte: str) -> list:
    lignes = [l for l in texte.split("\n") if l.strip()]
    entetes = lignes[0].split(";")
    table = []
    for ligne in lignes[1:]:
        d = dict(zip(entetes, ligne.split(";")))
        d["id"] = int(d["id"])
        d["duree"] = int(d["duree"])
        table.append(d)
    return table


def cout(duree: int) -> int:
    if duree <= 30:
        return 0
    return min((duree - 30 + 29) // 30, 12)


def recette(table: list, jour: str) -> int:
    return sum(cout(t["duree"]) for t in table if t["debut"][:10] == jour)


def par_heure(table: list) -> list:
    compte = [0] * 24
    for t in table:
        compte[int(t["debut"][11:13])] += 1
    return compte


def heure_de_pointe(table: list) -> int:
    compte = par_heure(table)
    return compte.index(max(compte))


def soldes(table: list) -> dict:
    s = {}
    for t in table:
        s[t["depart"]] = s.get(t["depart"], 0) - 1
        s[t["arrivee"]] = s.get(t["arrivee"], 0) + 1
    return s


def a_reequilibrer(table: list, seuil: int) -> list:
    return sorted(station for station, v in soldes(table).items() if abs(v) >= seuil)


def trajets_populaires(table: list, k: int) -> list:
    compte = {}
    for t in table:
        couple = (t["depart"], t["arrivee"])
        compte[couple] = compte.get(couple, 0) + 1
    return [(c, compte[c]) for c in sorted(compte, key=lambda c: (-compte[c], c))[:k]]


def duree_moyenne(table: list, station: str):
    durees = [t["duree"] for t in table if t["depart"] == station]
    if not durees:
        return None
    return round(sum(durees) / len(durees))
```

</Correction>
</Enonce>
<CodeDepart>

```python
FICHIER = """id;depart;arrivee;debut;duree
1;Gare;Mairie;2026-10-05 08:12;14
2;Gare;Campus;2026-10-05 08:40;31
3;Campus;Gare;2026-10-05 17:05;65
4;Mairie;Gare;2026-10-05 17:30;12
5;Gare;Mairie;2026-10-06 08:05;16
6;Port;Gare;2026-10-06 08:55;200
7;Gare;Mairie;2026-10-06 17:45;20
8;Campus;Port;2026-10-06 18:10;45
"""
```

</CodeDepart>
<Verification>

```python
t = charger(FICHIER)
assert len(t) == 8 and t[0] == {"id": 1, "depart": "Gare", "arrivee": "Mairie", "debut": "2026-10-05 08:12", "duree": 14}, "Chargement."
assert [cout(d) for d in (0, 30, 31, 60, 61, 90, 200, 1000)] == [0, 0, 1, 1, 2, 2, 6, 12], "Coûts, avec le plafond de 12 €."
assert recette(t, "2026-10-05") == 3 and recette(t, "2026-10-06") == 7 and recette(t, "2026-10-07") == 0, "Recettes par jour."
h = par_heure(t)
assert len(h) == 24 and h[8] == 4 and h[17] == 3 and h[18] == 1 and sum(h) == 8, "Départs par heure."
assert heure_de_pointe(t) == 8 and heure_de_pointe(charger("id;depart;arrivee;debut;duree\n1;A;B;2026-01-01 09:00;5\n2;A;B;2026-01-01 07:00;5\n")) == 7, "Heure de pointe, la plus tôt en cas d'égalité."
assert soldes(t) == {"Gare": -1, "Mairie": 2, "Campus": -1, "Port": 0}, "Soldes des stations."
assert a_reequilibrer(t, 1) == ["Campus", "Gare", "Mairie"] and a_reequilibrer(t, 2) == ["Mairie"], "Stations à rééquilibrer."
assert trajets_populaires(t, 2) == [(("Gare", "Mairie"), 3), (("Campus", "Gare"), 1)], "Trajets les plus fréquents."
assert duree_moyenne(t, "Gare") == 20 and duree_moyenne(t, "Campus") == 55 and duree_moyenne(t, "Lac") is None, "Durées moyennes."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
