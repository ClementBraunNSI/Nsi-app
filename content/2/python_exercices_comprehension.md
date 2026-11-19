---
title: 'Exercices : Les listes par compréhension'
description: 'Construire, filtrer et transformer des listes en une ligne, jusqu''aux tableaux à deux dimensions : fiche progressive par niveau.'
icon: "code"
chapter: Structures de données linéaires
badgeId: premiere_exercices_comprehension
meta: 'Listes par compréhension en Python : transformer, filtrer, choisir une valeur, tableaux de tableaux'
level: premiere
prerequisites:
  - python_exercices_listes
audience: public
---

Une liste par compréhension construit une liste en une seule ligne, là où il fallait une liste vide, une boucle `for` et des `append`. Les **premiers pas** passent d'une forme à l'autre, avec un pense-bête de syntaxe à côté de chaque énoncé. Les exercices vont ensuite de **Introduction** à **Expert** (filtrer, choisir une valeur avec `if … else`, parcourir des chaînes et des `range`, construire des tableaux de tableaux), puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

## Exemple : une liste, deux écritures

Après un contrôle, chaque élève reçoit un point de bonus. Avec une boucle, la liste des nouvelles notes se remplit élément par élément :

```python
notes = [12, 8, 15, 9, 17]
notes_bonus = []
for note in notes:
    notes_bonus.append(note + 1)
print(notes_bonus)  # [13, 9, 16, 10, 18]
```

Avec une liste par compréhension, la même liste s'écrit en une ligne :

```python
notes = [12, 8, 15, 9, 17]
notes_bonus = [note + 1 for note in notes]
print(notes_bonus)  # [13, 9, 16, 10, 18]
```

Cette ligne se lit « `note + 1` pour chaque `note` de `notes` ».

| Morceau | Rôle |
|---|---|
| `note + 1` | la valeur placée dans la nouvelle liste (ce qui était dans l'`append`) |
| `for note in notes` | le parcours, comme dans la boucle, sans les deux-points |
| `[` … `]` | le résultat est une liste |

Un `if` placé à la fin ne garde que certains éléments, par exemple les notes supérieures ou égales à 10 :

```python
reussites = [note for note in notes if note >= 10]
print(reussites)  # [12, 15, 17]
```

Le code est plus court et plus facile à relire, car il n'y a plus de liste vide à créer ni d'`append` à écrire.

<ExerciseTabs courseId="listes-comprehension-premiere" courseTitle="Les listes par compréhension">

<ExerciseSection id="1nsi-comp-0-1" label="0.1 [Premiers pas] - De la boucle à la compréhension" type="python">
<Enonce>
### De la boucle à la compréhension

Le programme de l'éditeur construit la liste `carres` avec une boucle :

```python
nombres = [1, 2, 3, 4, 5]
carres = []
for n in nombres:
    carres.append(n * n)
print(carres)
```

Remplacer les trois lignes qui construisent `carres` par une seule ligne qui utilise une liste par compréhension. L'affichage doit rester le même.

Affichage attendu :

```
[1, 4, 9, 16, 25]
```

<PostIt>

Une boucle qui remplit une liste :

```python
resultat = []
for x in liste:
    resultat.append(x + 1)
```

s'écrit en une ligne :

```python
resultat = [x + 1 for x in liste]
```

- entre crochets : d'abord la valeur à ajouter, puis le `for`
- pas de deux-points, pas d'`append`

</PostIt>

<Indices>
<Indice>

Ce qui était dans l'`append` (ici `n * n`) se place au début, juste après le crochet ouvrant.

</Indice>
<Indice>

La ligne `for n in nombres` se recopie ensuite, sans les deux-points, avant le crochet fermant.

</Indice>
<Indice>

```text
carres ← [n × n POUR CHAQUE n DE nombres]
AFFICHER carres
```

</Indice>
</Indices>

<Correction>

```python
nombres = [1, 2, 3, 4, 5]
carres = [n * n for n in nombres]
print(carres)
```

</Correction>
</Enonce>
<CodeDepart>

```python
nombres = [1, 2, 3, 4, 5]
carres = []
for n in nombres:
    carres.append(n * n)
print(carres)
```

</CodeDepart>
<Verification>

```python
import re
assert carres == [1, 4, 9, 16, 25], "carres vaut [1, 4, 9, 16, 25]."
assert ".append(" not in PROGRAMME, "Plus d'append : la compréhension construit la liste d'un coup."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\]", PROGRAMME), "Construire carres avec une compréhension : [... for n in nombres]."
assert SORTIE.strip().endswith("[1, 4, 9, 16, 25]"), "Afficher carres à la fin."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-0-2" label="0.2 [Premiers pas] - Une valeur calculée" type="python">
<Enonce>
### Une valeur calculée

La liste `prenoms` est déjà écrite dans l'éditeur :

```python
prenoms = ["Ada", "Alan", "Grace", "Linus"]
```

Construire, avec une compréhension, la liste `longueurs` qui contient le nombre de lettres de chaque prénom, dans le même ordre, puis l'afficher.

Affichage attendu :

```
[3, 4, 5, 5]
```

<PostIt>

- `[expression for x in liste]` : une valeur par élément de `liste`
- l'expression peut appeler une fonction : `[f(x) for x in liste]`
- `len(texte)` : le nombre de caractères d'un texte
- la nouvelle liste a autant d'éléments que `liste`

</PostIt>

<Indices>
<Indice>

Pour un prénom `p`, son nombre de lettres est `len(p)`.

</Indice>
<Indice>

Il reste à placer `len(p)` devant `for p in prenoms`, entre crochets.

</Indice>
<Indice>

```text
longueurs ← [longueur(p) POUR CHAQUE p DE prenoms]
AFFICHER longueurs
```

</Indice>
</Indices>

<Correction>

```python
prenoms = ["Ada", "Alan", "Grace", "Linus"]
longueurs = [len(p) for p in prenoms]
print(longueurs)
```

</Correction>
</Enonce>
<CodeDepart>

```python
prenoms = ["Ada", "Alan", "Grace", "Linus"]
```

</CodeDepart>
<Verification>

```python
import re
assert longueurs == [3, 4, 5, 5], "longueurs vaut [3, 4, 5, 5]."
assert "len(" in PROGRAMME, "Calculer chaque longueur avec len."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\]", PROGRAMME), "Construire longueurs avec une compréhension."
assert SORTIE.strip().endswith("[3, 4, 5, 5]"), "Afficher longueurs à la fin."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-0-3" label="0.3 [Premiers pas] - Avec range" type="python">
<Enonce>
### Avec range

Construire, avec une compréhension qui parcourt un `range`, la liste `multiples` des dix premiers multiples de 5 (de 5 à 50), puis l'afficher. Les valeurs de la liste ne doivent pas être écrites à la main.

Affichage attendu :

```
[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]
```

<PostIt>

- `[expression for i in range(n)]` : une valeur pour `i` = 0, 1, …, `n - 1`
- `range(1, n + 1)` : de 1 à `n` inclus
- exemple : `[i + 100 for i in range(3)]` vaut `[100, 101, 102]`

</PostIt>

<Indices>
<Indice>

Les multiples de 5 sont `5 * 1`, `5 * 2`, …, `5 * 10`.

</Indice>
<Indice>

`range(1, 11)` donne les entiers de 1 à 10.

</Indice>
<Indice>

```text
multiples ← [5 × k POUR k ALLANT DE 1 À 10]
AFFICHER multiples
```

</Indice>
</Indices>

<Correction>

```python
multiples = [5 * k for k in range(1, 11)]
print(multiples)
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert multiples == [5, 10, 15, 20, 25, 30, 35, 40, 45, 50], "multiples vaut [5, 10, …, 50]."
assert "range(" in PROGRAMME, "Parcourir un range."
assert "15" not in PROGRAMME and "50" not in PROGRAMME, "Calculer les multiples plutôt que les écrire."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\]", PROGRAMME), "Construire multiples avec une compréhension."
assert SORTIE.strip().endswith("[5, 10, 15, 20, 25, 30, 35, 40, 45, 50]"), "Afficher multiples à la fin."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-0-4" label="0.4 [Premiers pas] - Filtrer avec if" type="python">
<Enonce>
### Filtrer avec if

Les notes d'un contrôle sont déjà écrites dans l'éditeur :

```python
notes = [12, 8, 15, 9, 17, 10]
```

Construire, avec une compréhension, la liste `reussies` qui ne garde que les notes supérieures ou égales à 10, dans le même ordre, puis l'afficher.

Affichage attendu :

```
[12, 15, 17, 10]
```

<PostIt>

Garder seulement certains éléments :

```python
[x for x in liste if condition]
```

- le `if` se place **après** le `for`
- un élément n'entre dans la nouvelle liste que si la condition est vraie
- exemple : `[x for x in [3, -1, 4] if x > 0]` vaut `[3, 4]`

</PostIt>

<Indices>
<Indice>

La valeur gardée est la note elle-même, donc la compréhension commence par `[n for n in notes …`.

</Indice>
<Indice>

La condition `n >= 10` se place à la fin, après `if`.

</Indice>
<Indice>

```text
reussies ← [n POUR CHAQUE n DE notes SI n ≥ 10]
AFFICHER reussies
```

</Indice>
</Indices>

<Correction>

```python
notes = [12, 8, 15, 9, 17, 10]
reussies = [n for n in notes if n >= 10]
print(reussies)
```

</Correction>
</Enonce>
<CodeDepart>

```python
notes = [12, 8, 15, 9, 17, 10]
```

</CodeDepart>
<Verification>

```python
import re
assert reussies == [12, 15, 17, 10], "reussies vaut [12, 15, 17, 10] : 10 est gardé."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\bif\b.*\]", PROGRAMME), "Filtrer dans la compréhension : [... for ... in notes if ...]."
assert SORTIE.strip().endswith("[12, 15, 17, 10]"), "Afficher reussies à la fin."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-0-5" label="0.5 [Premiers pas] - Filtrer et transformer" type="python">
<Enonce>
### Filtrer et transformer

La liste `mots` est déjà écrite dans l'éditeur :

```python
mots = ["chat", "hippopotame", "lion", "crocodile", "ours", "girafe"]
```

Construire, avec une compréhension, la liste `longs` des mots de plus de 4 lettres, écrits en majuscules, puis l'afficher.

Affichage attendu :

```
['HIPPOPOTAME', 'CROCODILE', 'GIRAFE']
```

<PostIt>

```python
[expression for x in liste if condition]
```

- la condition choisit les éléments gardés
- l'expression dit ce qui est ajouté pour chacun d'eux
- `texte.upper()` : le texte en majuscules
- `len(texte) > 4` : plus de 4 caractères

</PostIt>

<Indices>
<Indice>

La valeur ajoutée est `m.upper()`, la condition porte sur `len(m)`.

</Indice>
<Indice>

« Plus de 4 lettres » s'écrit `len(m) > 4`, donc `"chat"` et `"ours"` ne sont pas gardés.

</Indice>
<Indice>

```text
longs ← [majuscules(m) POUR CHAQUE m DE mots SI longueur(m) > 4]
AFFICHER longs
```

</Indice>
</Indices>

<Correction>

```python
mots = ["chat", "hippopotame", "lion", "crocodile", "ours", "girafe"]
longs = [m.upper() for m in mots if len(m) > 4]
print(longs)
```

</Correction>
</Enonce>
<CodeDepart>

```python
mots = ["chat", "hippopotame", "lion", "crocodile", "ours", "girafe"]
```

</CodeDepart>
<Verification>

```python
import re
assert longs == ["HIPPOPOTAME", "CROCODILE", "GIRAFE"], "longs vaut ['HIPPOPOTAME', 'CROCODILE', 'GIRAFE']."
assert ".upper()" in PROGRAMME, "Mettre en majuscules avec upper()."
assert ".append(" not in PROGRAMME and "HIPPO" not in PROGRAMME, "Construire la liste avec une compréhension, sans recopier les mots."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\bif\b.*\]", PROGRAMME), "Une compréhension avec un if."
assert SORTIE.strip().endswith("['HIPPOPOTAME', 'CROCODILE', 'GIRAFE']"), "Afficher longs à la fin."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-0-6" label="0.6 [Premiers pas] - Choisir une valeur avec if … else" type="python">
<Enonce>
### Choisir une valeur avec if … else

La liste `nombres` est déjà écrite dans l'éditeur :

```python
nombres = [4, 7, 10, 3, 8]
```

Construire, avec une compréhension, la liste `parites` qui contient `"pair"` ou `"impair"` pour chaque nombre, dans le même ordre, puis l'afficher. Aucun élément n'est retiré, et la liste obtenue a autant de valeurs que `nombres`.

Affichage attendu :

```
['pair', 'impair', 'pair', 'impair', 'pair']
```

<PostIt>

Choisir entre deux valeurs :

```python
a if condition else b
```

vaut `a` si la condition est vraie, `b` sinon.

```python
[a if condition else b for x in liste]
```

- le `if … else` se place **avant** le `for` et choisit une valeur pour chaque élément
- `x % 2 == 0` : `x` est pair

</PostIt>

<Indices>
<Indice>

Pour un nombre `n`, l'expression `"pair" if n % 2 == 0 else "impair"` donne `"pair"` ou `"impair"`.

</Indice>
<Indice>

Cette expression se place en tête de la compréhension, avant `for n in nombres`.

</Indice>
<Indice>

```text
parites ← ["pair" SI n pair SINON "impair" POUR CHAQUE n DE nombres]
AFFICHER parites
```

</Indice>
</Indices>

<Correction>

```python
nombres = [4, 7, 10, 3, 8]
parites = ["pair" if n % 2 == 0 else "impair" for n in nombres]
print(parites)
```

</Correction>
</Enonce>
<CodeDepart>

```python
nombres = [4, 7, 10, 3, 8]
```

</CodeDepart>
<Verification>

```python
import re
assert parites == ["pair", "impair", "pair", "impair", "pair"], "parites vaut ['pair', 'impair', 'pair', 'impair', 'pair']."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bif\b.*\belse\b.*\bfor\b.*\bin\b.*\]", PROGRAMME), "Choisir la valeur dans la compréhension : [... if ... else ... for n in nombres]."
assert SORTIE.strip().endswith("['pair', 'impair', 'pair', 'impair', 'pair']"), "Afficher parites à la fin."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-0-7" label="0.7 [Premiers pas] - Parcourir un texte" type="python">
<Enonce>
### Parcourir un texte

La variable `phrase` est déjà écrite dans l'éditeur :

```python
phrase = "un renard dans le code"
```

Construire, avec une compréhension qui parcourt directement le texte, la liste `voyelles` des voyelles de la phrase, dans l'ordre où elles apparaissent. Afficher ensuite la liste, puis le nombre de voyelles.

Affichage attendu :

```
['u', 'e', 'a', 'a', 'e', 'o', 'e']
7
```

<PostIt>

- `for c in texte` : `c` prend chaque caractère du texte, espaces compris
- `[c for c in texte if condition]` : les caractères qui vérifient la condition
- `c in "aeiouy"` : vrai si `c` est l'une de ces lettres
- `len(liste)` : le nombre d'éléments

</PostIt>

<Indices>
<Indice>

Un texte se parcourt comme une liste : `for c in phrase` passe par chaque caractère.

</Indice>
<Indice>

La condition `c in "aeiouy"` ne garde que les voyelles. Les espaces et les consonnes ne sont pas gardés.

</Indice>
<Indice>

```text
voyelles ← [c POUR CHAQUE c DE phrase SI c EST DANS "aeiouy"]
AFFICHER voyelles
AFFICHER longueur(voyelles)
```

</Indice>
</Indices>

<Correction>

```python
phrase = "un renard dans le code"
voyelles = [c for c in phrase if c in "aeiouy"]
print(voyelles)
print(len(voyelles))
```

</Correction>
</Enonce>
<CodeDepart>

```python
phrase = "un renard dans le code"
```

</CodeDepart>
<Verification>

```python
import re
lignes = SORTIE.strip().splitlines()
assert voyelles == ["u", "e", "a", "a", "e", "o", "e"], "voyelles vaut ['u', 'e', 'a', 'a', 'e', 'o', 'e']."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\bif\b.*\]", PROGRAMME), "Une compréhension qui parcourt phrase, avec un if."
assert lignes[-2:] == ["['u', 'e', 'a', 'a', 'e', 'o', 'e']", "7"], "Afficher la liste, puis le nombre de voyelles."
assert "len(" in PROGRAMME, "Compter les voyelles avec len."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-1-1" label="1.1 [Introduction] - Prix TTC" type="python">
<Enonce>
### Prix TTC

Écrire une fonction `prix_ttc(prix)` qui reçoit une liste de prix hors taxes et renvoie la liste des prix toutes taxes comprises (prix multiplié par 1,2), arrondis au centime. Le corps de la fonction tient en une ligne, un `return` suivi d'une compréhension.

Exemple : `prix_ttc([10, 25, 4.5])` renvoie `[12.0, 30.0, 5.4]`.

<PostIt>

- `return [expression for x in liste]` : renvoie directement la liste construite
- `round(v, 2)` : `v` arrondi à 2 chiffres après la virgule
- en Python, la virgule des décimaux s'écrit avec un point : `1.2`

</PostIt>

<Indices>
<Indice>

Pour un prix `p`, le prix TTC arrondi est `round(p * 1.2, 2)`.

</Indice>
<Indice>

Sans arrondi, `4.5 * 1.2` donne `5.3999999999999995` , d'où l'utilisation de `round`.

</Indice>
<Indice>

```text
FONCTION prix_ttc(prix)
    RENVOYER [arrondi(p × 1,2 ; 2 chiffres) POUR CHAQUE p DE prix]
```

</Indice>
</Indices>

<Correction>

```python
def prix_ttc(prix: list) -> list:
    return [round(p * 1.2, 2) for p in prix]
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert prix_ttc([10, 25, 4.5]) == [12.0, 30.0, 5.4], "[10, 25, 4.5] : [12.0, 30.0, 5.4]."
assert prix_ttc([]) == [], "Liste vide : liste vide."
assert prix_ttc([0.99, 100]) == [1.19, 120.0], "[0.99, 100] : [1.19, 120.0]."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\]", PROGRAMME), "Renvoyer une compréhension."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-1-2" label="1.2 [Introduction] - Garder les positifs" type="python">
<Enonce>
### Garder les positifs

Écrire une fonction `positifs(liste)` qui renvoie la liste des éléments strictement positifs de `liste`, dans le même ordre, avec une compréhension.

Exemple : `positifs([3, -1, 0, 7, -5])` renvoie `[3, 7]`.

<PostIt>

- `[x for x in liste if condition]` : garde les éléments qui vérifient la condition
- `>` : strictement supérieur, donc 0 n'est pas gardé
- la liste reçue n'est pas modifiée : une nouvelle liste est renvoyée

</PostIt>

<Indices>
<Indice>

La valeur gardée est l'élément lui-même : `[x for x in liste …]`.

</Indice>
<Indice>

La condition `x > 0` exclut 0 et les négatifs.

</Indice>
<Indice>

```text
FONCTION positifs(liste)
    RENVOYER [x POUR CHAQUE x DE liste SI x > 0]
```

</Indice>
</Indices>

<Correction>

```python
def positifs(liste: list) -> list:
    return [x for x in liste if x > 0]
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert positifs([3, -1, 0, 7, -5]) == [3, 7], "[3, -1, 0, 7, -5] : [3, 7]."
assert positifs([]) == [] and positifs([-2, 0]) == [], "Aucun positif : liste vide."
assert positifs([0.5, 2, 1]) == [0.5, 2, 1], "Tous positifs : la même liste, dans le même ordre."
l = [1, -1]
positifs(l)
assert l == [1, -1], "La liste reçue n'est pas modifiée."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\bif\b.*\]", PROGRAMME), "Une compréhension avec un if."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-1-3" label="1.3 [Introduction] - Initiales" type="python">
<Enonce>
### Initiales

Écrire une fonction `initiales(prenoms)` qui reçoit une liste de prénoms (non vides) et renvoie la liste de leurs premières lettres, avec une compréhension.

Exemple : `initiales(["Ada", "Grace", "Linus"])` renvoie `["A", "G", "L"]`.

<PostIt>

- `texte[0]` : le premier caractère d'un texte
- `[expression for x in liste]` : une valeur par élément
- `return` renvoie la liste construite

</PostIt>

<Indices>
<Indice>

Le premier caractère d'un prénom `p` est `p[0]`, comme le premier élément d'une liste.

</Indice>
<Indice>

L'expression de la compréhension est donc `p[0]`.

</Indice>
<Indice>

```text
FONCTION initiales(prenoms)
    RENVOYER [p[0] POUR CHAQUE p DE prenoms]
```

</Indice>
</Indices>

<Correction>

```python
def initiales(prenoms: list) -> list:
    return [p[0] for p in prenoms]
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert initiales(["Ada", "Grace", "Linus"]) == ["A", "G", "L"], "['Ada', 'Grace', 'Linus'] : ['A', 'G', 'L']."
assert initiales([]) == [], "Liste vide : liste vide."
assert initiales(["éloïse", "Zoé"]) == ["é", "Z"], "La première lettre telle quelle, accent compris."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\]", PROGRAMME), "Renvoyer une compréhension."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-1-4" label="1.4 [Introduction] - Table de multiplication" type="python">
<Enonce>
### Table de multiplication

Écrire une fonction `table(n)` qui renvoie la liste `[n × 1, n × 2, …, n × 10]`, avec une compréhension qui parcourt un `range`.

Exemple : `table(7)` renvoie `[7, 14, 21, 28, 35, 42, 49, 56, 63, 70]`.

<PostIt>

- `range(1, 11)` : les entiers de 1 à 10
- `[expression for k in range(...)]` : une valeur par entier
- la variable `n` reçue peut servir dans l'expression

</PostIt>

<Indices>
<Indice>

La compréhension parcourt les multiplicateurs `k`, de 1 à 10.

</Indice>
<Indice>

Pour chaque `k`, la valeur ajoutée est `n * k`.

</Indice>
<Indice>

```text
FONCTION table(n)
    RENVOYER [n × k POUR k ALLANT DE 1 À 10]
```

</Indice>
</Indices>

<Correction>

```python
def table(n: int) -> list:
    return [n * k for k in range(1, 11)]
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert table(7) == [7, 14, 21, 28, 35, 42, 49, 56, 63, 70], "table(7)."
assert table(1) == list(range(1, 11)) and table(0) == [0] * 10, "table(1) et table(0)."
assert len(table(12)) == 10 and table(12)[-1] == 120, "Dix valeurs, de n × 1 à n × 10."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\brange\b.*\]", PROGRAMME), "Une compréhension qui parcourt un range."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-2-1" label="2.1 [Facile] - Valeurs absolues" type="python">
<Enonce>
### Valeurs absolues

Écrire une fonction `valeurs_absolues(liste)` qui renvoie la liste des valeurs absolues des nombres de `liste` : un nombre négatif devient son opposé, les autres ne changent pas.

Exemple : `valeurs_absolues([3, -4, 0, -1.5])` renvoie `[3, 4, 0, 1.5]`.

Contrainte : une compréhension avec `if … else`, sans la fonction `abs`.

<PostIt>

- `a if condition else b` : vaut `a` si la condition est vraie, `b` sinon
- `[a if condition else b for x in liste]` : une valeur choisie pour chaque élément
- `-x` : l'opposé de `x`
- `abs` est interdit ici

</PostIt>

<Indices>
<Indice>

Aucun élément n'est retiré, donc le `if … else` se place avant le `for`.

</Indice>
<Indice>

Pour un nombre `x`, la valeur absolue est `x` s'il est positif ou nul, `-x` sinon.

</Indice>
<Indice>

```text
FONCTION valeurs_absolues(liste)
    RENVOYER [x SI x ≥ 0 SINON -x POUR CHAQUE x DE liste]
```

</Indice>
</Indices>

<Correction>

```python
def valeurs_absolues(liste: list) -> list:
    return [x if x >= 0 else -x for x in liste]
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert valeurs_absolues([3, -4, 0, -1.5]) == [3, 4, 0, 1.5], "[3, -4, 0, -1.5] : [3, 4, 0, 1.5]."
assert valeurs_absolues([]) == [], "Liste vide."
assert valeurs_absolues([-7, -7]) == [7, 7], "Des négatifs répétés."
assert not re.search(r"\babs\s*\(", PROGRAMME), "Sans abs."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bif\b.*\belse\b.*\bfor\b.*\]", PROGRAMME), "Une compréhension avec if … else devant le for."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-2-2" label="2.2 [Facile] - Diviseurs" type="python">
<Enonce>
### Diviseurs

Écrire une fonction `diviseurs(n)` qui renvoie la liste croissante des diviseurs de l'entier `n` (avec `n` ≥ 1), avec une compréhension.

Exemple : `diviseurs(12)` renvoie `[1, 2, 3, 4, 6, 12]`.

<PostIt>

- `d` divise `n` quand le reste de la division est nul : `n % d == 0`
- `range(1, n + 1)` : de 1 à `n` inclus
- `[x for x in range(...) if condition]` : les entiers qui vérifient la condition

</PostIt>

<Indices>
<Indice>

Les diviseurs possibles de `n` vont de 1 à `n`.

</Indice>
<Indice>

Un entier `d` est gardé si `n % d == 0`.

</Indice>
<Indice>

```text
FONCTION diviseurs(n)
    RENVOYER [d POUR d ALLANT DE 1 À n SI n mod d = 0]
```

</Indice>
</Indices>

<Correction>

```python
def diviseurs(n: int) -> list:
    return [d for d in range(1, n + 1) if n % d == 0]
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert diviseurs(12) == [1, 2, 3, 4, 6, 12], "diviseurs(12)."
assert diviseurs(1) == [1] and diviseurs(13) == [1, 13], "diviseurs(1) et diviseurs(13)."
assert diviseurs(36) == [1, 2, 3, 4, 6, 9, 12, 18, 36], "diviseurs(36)."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\bif\b.*\]", PROGRAMME), "Une compréhension avec un if."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-2-3" label="2.3 [Facile] - Positions d'une lettre" type="python">
<Enonce>
### Positions d'une lettre

Écrire une fonction `positions(texte, lettre)` qui renvoie la liste des indices où `lettre` apparaît dans `texte`, avec une compréhension.

Exemples : `positions("banane", "a")` renvoie `[1, 3]`, et `positions("banane", "z")` renvoie `[]`.

<PostIt>

- `range(len(texte))` : les indices du texte, de 0 au dernier
- `texte[i]` : le caractère d'indice `i`
- `[i for i in range(...) if condition]` : les indices qui vérifient la condition

</PostIt>

<Indices>
<Indice>

La fonction renvoie des indices, donc la compréhension parcourt `range(len(texte))`.

</Indice>
<Indice>

L'indice `i` est gardé si `texte[i] == lettre`.

</Indice>
<Indice>

```text
FONCTION positions(texte, lettre)
    RENVOYER [i POUR i ALLANT DE 0 À longueur(texte) - 1 SI texte[i] = lettre]
```

</Indice>
</Indices>

<Correction>

```python
def positions(texte: str, lettre: str) -> list:
    return [i for i in range(len(texte)) if texte[i] == lettre]
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert positions("banane", "a") == [1, 3] and positions("banane", "n") == [2, 4], "Dans « banane »."
assert positions("banane", "z") == [] and positions("", "a") == [], "Lettre absente ou texte vide : liste vide."
assert positions("aaa", "a") == [0, 1, 2], "Toutes les positions."
assert ".find(" not in PROGRAMME and ".index(" not in PROGRAMME, "Sans find ni index."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\bif\b.*\]", PROGRAMME), "Une compréhension avec un if."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-2-4" label="2.4 [Facile] - Remplacer une valeur" type="python">
<Enonce>
### Remplacer une valeur

Écrire une fonction `remplacer(liste, ancien, nouveau)` qui renvoie une **nouvelle** liste, copie de `liste` où chaque `ancien` est remplacé par `nouveau`. La liste reçue n'est pas modifiée.

Exemple : `remplacer([1, 0, 3, 0], 0, 9)` renvoie `[1, 9, 3, 9]`.

<PostIt>

- `[a if condition else b for x in liste]` : une valeur choisie pour chaque élément
- `x == ancien` : `x` est la valeur à remplacer
- une compréhension crée une nouvelle liste : la liste parcourue ne change pas

</PostIt>

<Indices>
<Indice>

La nouvelle liste a autant d'éléments que `liste`, donc le `if … else` se place avant le `for`.

</Indice>
<Indice>

Pour chaque `x`, la valeur est `nouveau` si `x == ancien`, et `x` sinon.

</Indice>
<Indice>

```text
FONCTION remplacer(liste, ancien, nouveau)
    RENVOYER [nouveau SI x = ancien SINON x POUR CHAQUE x DE liste]
```

</Indice>
</Indices>

<Correction>

```python
def remplacer(liste: list, ancien, nouveau) -> list:
    return [nouveau if x == ancien else x for x in liste]
```

</Correction>
</Enonce>
<Verification>

```python
import re
l = [1, 0, 3, 0]
assert remplacer(l, 0, 9) == [1, 9, 3, 9], "[1, 0, 3, 0] : [1, 9, 3, 9]."
assert l == [1, 0, 3, 0], "La liste reçue n'est pas modifiée."
assert remplacer(["a", "b"], "c", "d") == ["a", "b"] and remplacer([], 1, 2) == [], "Rien à remplacer."
assert remplacer(["oui", "non", "oui"], "oui", "si") == ["si", "non", "si"], "Avec des textes."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bif\b.*\belse\b.*\bfor\b.*\]", PROGRAMME), "Une compréhension avec if … else devant le for."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-3-1" label="3.1 [Moyen] - Grille" type="python">
<Enonce>
### Grille

Une grille de `n` lignes et `m` colonnes se représente par une liste de `n` listes, chacune de longueur `m`. Écrire une fonction `grille(n, m, valeur)` qui renvoie une telle grille remplie de `valeur`, avec une compréhension dans une compréhension.

Exemple : `grille(2, 3, 0)` renvoie `[[0, 0, 0], [0, 0, 0]]`.

Les lignes doivent être **indépendantes** : modifier `g[0][0]` ne change pas `g[1][0]`. L'écriture `[[valeur] * m] * n` ne convient pas, car elle répète `n` fois la même ligne.

<PostIt>

- `[expression for i in range(n)]` : `n` valeurs
- l'expression peut elle-même être une liste par compréhension : `[[...] for i in range(n)]`
- `g[i][j]` : la case de la ligne `i`, colonne `j`
- chaque tour de la compréhension extérieure crée une nouvelle ligne

</PostIt>

<Indices>
<Indice>

Une ligne s'écrit `[valeur for j in range(m)]`.

</Indice>
<Indice>

Pour obtenir `n` lignes, la compréhension d'une ligne devient l'expression d'une compréhension sur `range(n)`.

</Indice>
<Indice>

```text
FONCTION grille(n, m, valeur)
    RENVOYER [[valeur POUR j ALLANT DE 0 À m - 1] POUR i ALLANT DE 0 À n - 1]
```

</Indice>
</Indices>

<Correction>

```python
def grille(n: int, m: int, valeur) -> list:
    return [[valeur for j in range(m)] for i in range(n)]
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert grille(2, 3, 0) == [[0, 0, 0], [0, 0, 0]], "grille(2, 3, 0)."
assert grille(1, 1, "x") == [["x"]] and grille(0, 4, 1) == [], "Grille 1 × 1 ; grille sans ligne."
g = grille(3, 2, 0)
g[0][0] = 5
assert g[1][0] == 0 and g[2][0] == 0, "Les lignes sont indépendantes : modifier g[0][0] ne change que la première ligne."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[\s*\[.*\bfor\b.*\]\s*for\b.*\]", PROGRAMME), "Une compréhension dans une compréhension : [[... for j ...] for i ...]."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-3-2" label="3.2 [Moyen] - Table de Pythagore" type="python">
<Enonce>
### Table de Pythagore

Écrire une fonction `table_pythagore(n)` qui renvoie la table de multiplication de 1 à `n` sous forme de grille : la ligne `i` (en comptant à partir de 1) contient `i × 1, i × 2, …, i × n`.

Exemple : `table_pythagore(3)` renvoie `[[1, 2, 3], [2, 4, 6], [3, 6, 9]]`.

<PostIt>

- `[[expression for j in ...] for i in ...]` : une ligne par `i`, une valeur par `j` dans chaque ligne
- l'expression intérieure peut utiliser `i` et `j`
- `range(1, n + 1)` : de 1 à `n` inclus

</PostIt>

<Indices>
<Indice>

La ligne de `i` est `[i * j for j in range(1, n + 1)]`.

</Indice>
<Indice>

Il reste à construire cette ligne pour chaque `i` de 1 à `n`.

</Indice>
<Indice>

```text
FONCTION table_pythagore(n)
    RENVOYER [[i × j POUR j ALLANT DE 1 À n] POUR i ALLANT DE 1 À n]
```

</Indice>
</Indices>

<Correction>

```python
def table_pythagore(n: int) -> list:
    return [[i * j for j in range(1, n + 1)] for i in range(1, n + 1)]
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert table_pythagore(3) == [[1, 2, 3], [2, 4, 6], [3, 6, 9]], "table_pythagore(3)."
assert table_pythagore(1) == [[1]] and table_pythagore(0) == [], "n = 1 et n = 0."
t = table_pythagore(10)
assert len(t) == 10 and t[6][7] == 56 and t[9][9] == 100, "table_pythagore(10) : 7 × 8 = 56 en t[6][7]."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[\s*\[.*\bfor\b.*\]\s*for\b.*\]", PROGRAMME), "Une compréhension dans une compréhension."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-3-3" label="3.3 [Moyen] - Aplatir" type="python">
<Enonce>
### Aplatir

Écrire une fonction `aplatir(tableau)` qui reçoit une liste de listes et renvoie la liste de tous leurs éléments, ligne après ligne, avec **une seule** compréhension à deux `for`.

Exemple : `aplatir([[1, 2], [3], [4, 5, 6]])` renvoie `[1, 2, 3, 4, 5, 6]`.

<PostIt>

Deux `for` dans une même compréhension :

```python
[x for ligne in tableau for x in ligne]
```

- se lit comme deux boucles imbriquées, dans le même ordre : d'abord `for ligne in tableau`, puis `for x in ligne`
- une seule paire de crochets, car le résultat est une liste sans sous-listes

</PostIt>

<Indices>
<Indice>

Avec deux boucles, le programme serait : pour chaque ligne du tableau, pour chaque élément de la ligne, ajouter l'élément.

</Indice>
<Indice>

Dans la compréhension, les deux `for` s'écrivent dans l'ordre des boucles, après l'élément ajouté.

</Indice>
<Indice>

```text
FONCTION aplatir(tableau)
    RENVOYER [x POUR CHAQUE ligne DE tableau POUR CHAQUE x DE ligne]
```

</Indice>
</Indices>

<Correction>

```python
def aplatir(tableau: list) -> list:
    return [x for ligne in tableau for x in ligne]
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert aplatir([[1, 2], [3], [4, 5, 6]]) == [1, 2, 3, 4, 5, 6], "[[1, 2], [3], [4, 5, 6]]."
assert aplatir([]) == [] and aplatir([[], []]) == [], "Rien à aplatir."
assert aplatir([["a", "b"], ["c"]]) == ["a", "b", "c"], "Avec des textes, ligne après ligne."
assert ".append(" not in PROGRAMME and "sum(" not in PROGRAMME, "Sans append ni sum."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\bfor\b.*\bin\b.*\]", PROGRAMME), "Une seule compréhension à deux for."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-3-4" label="3.4 [Moyen] - Colonne et diagonale" type="python">
<Enonce>
### Colonne et diagonale

Un tableau est une liste de lignes de même longueur. Écrire, chacune avec une compréhension :
- `colonne(tableau, j)` : renvoie la liste des valeurs de la colonne `j`, de haut en bas ;
- `diagonale(tableau)` : pour un tableau carré, renvoie la liste des valeurs `tableau[0][0]`, `tableau[1][1]`, … jusqu'au coin en bas à droite.

Exemple, avec `t = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]` : `colonne(t, 1)` renvoie `[2, 5, 8]` et `diagonale(t)` renvoie `[1, 5, 9]`.

<PostIt>

- `tableau[i][j]` : ligne `i`, colonne `j`
- `for ligne in tableau` : chaque ligne du tableau, de haut en bas
- `ligne[j]` : la valeur de la colonne `j` dans cette ligne
- `range(len(tableau))` : les indices des lignes

</PostIt>

<Indices>
<Indice>

Une colonne contient une valeur de chaque ligne. La compréhension parcourt donc les lignes et garde `ligne[j]`.

</Indice>
<Indice>

Sur la diagonale, le numéro de ligne et le numéro de colonne sont égaux. La compréhension parcourt les indices `i` et garde `tableau[i][i]`.

</Indice>
<Indice>

```text
FONCTION colonne(tableau, j)
    RENVOYER [ligne[j] POUR CHAQUE ligne DE tableau]
FONCTION diagonale(tableau)
    RENVOYER [tableau[i][i] POUR i ALLANT DE 0 À longueur(tableau) - 1]
```

</Indice>
</Indices>

<Correction>

```python
def colonne(tableau: list, j: int) -> list:
    return [ligne[j] for ligne in tableau]


def diagonale(tableau: list) -> list:
    return [tableau[i][i] for i in range(len(tableau))]
```

</Correction>
</Enonce>
<Verification>

```python
import re
t = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
assert colonne(t, 1) == [2, 5, 8] and colonne(t, 0) == [1, 4, 7], "Colonnes 1 et 0."
assert colonne([[1, 2], [3, 4], [5, 6]], 1) == [2, 4, 6], "Un tableau de 3 lignes et 2 colonnes."
assert diagonale(t) == [1, 5, 9] and diagonale([[7]]) == [7] and diagonale([]) == [], "Diagonales."
assert ".append(" not in PROGRAMME, "Sans append."
assert len(re.findall(r"\[.*\bfor\b.*\bin\b.*\]", PROGRAMME)) >= 2, "Une compréhension dans chaque fonction."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-4-1" label="4.1 [Difficile] - Transposée" type="python">
<Enonce>
### Transposée

La transposée d'un tableau échange lignes et colonnes : la colonne `j` du tableau devient la ligne `j` du résultat. Écrire une fonction `transposee(tableau)` qui la renvoie, pour un tableau non vide dont toutes les lignes ont la même longueur.

Exemple : `transposee([[1, 2, 3], [4, 5, 6]])` renvoie `[[1, 4], [2, 5], [3, 6]]`.

Contrainte : une compréhension dans une compréhension, et le tableau reçu n'est pas modifié.

<Indices>
<Indice>

Le résultat a autant de lignes que le tableau a de colonnes : `len(tableau[0])`.

</Indice>
<Indice>

La ligne `j` du résultat est la colonne `j` du tableau, déjà rencontrée dans l'exercice 3.4.

</Indice>
<Indice>

```text
FONCTION transposee(tableau)
    RENVOYER [[ligne[j] POUR CHAQUE ligne DE tableau] POUR j ALLANT DE 0 À longueur(tableau[0]) - 1]
```

</Indice>
</Indices>

<Correction>

```python
def transposee(tableau: list) -> list:
    return [[ligne[j] for ligne in tableau] for j in range(len(tableau[0]))]
```

</Correction>
</Enonce>
<Verification>

```python
import re
t = [[1, 2, 3], [4, 5, 6]]
assert transposee(t) == [[1, 4], [2, 5], [3, 6]], "Tableau 2 × 3 : résultat 3 × 2."
assert t == [[1, 2, 3], [4, 5, 6]], "Le tableau reçu n'est pas modifié."
assert transposee([[1, 2], [3, 4]]) == [[1, 3], [2, 4]], "Tableau carré."
assert transposee([[5]]) == [[5]] and transposee([[1, 2, 3]]) == [[1], [2], [3]], "Une seule ligne."
assert transposee(transposee(t)) == t, "Transposer deux fois redonne le tableau."
assert ".append(" not in PROGRAMME and "zip(" not in PROGRAMME, "Sans append ni zip."
assert re.search(r"\[\s*\[.*\bfor\b.*\]\s*for\b.*\]", PROGRAMME), "Une compréhension dans une compréhension."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-4-2" label="4.2 [Difficile] - Nombres premiers" type="python">
<Enonce>
### Nombres premiers

Un entier est premier s'il a exactement deux diviseurs : 1 et lui-même. Écrire une fonction `premiers_jusqua(n)` qui renvoie la liste croissante des nombres premiers inférieurs ou égaux à `n`.

Exemple : `premiers_jusqua(20)` renvoie `[2, 3, 5, 7, 11, 13, 17, 19]`.

Contrainte : le corps de la fonction est un seul `return`, dont la condition contient elle-même une compréhension (celle qui liste les diviseurs).

<Indices>
<Indice>

L'exercice 2.2 donne la liste des diviseurs d'un entier `k` en une compréhension.

</Indice>
<Indice>

`k` est premier si cette liste a exactement 2 éléments : `len([...]) == 2`. Cette condition se place après le `if` de la compréhension extérieure.

</Indice>
<Indice>

```text
FONCTION premiers_jusqua(n)
    RENVOYER [k POUR k ALLANT DE 2 À n
              SI longueur([d POUR d ALLANT DE 1 À k SI k mod d = 0]) = 2]
```

</Indice>
</Indices>

<Correction>

```python
def premiers_jusqua(n: int) -> list:
    return [k for k in range(2, n + 1) if len([d for d in range(1, k + 1) if k % d == 0]) == 2]
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert premiers_jusqua(20) == [2, 3, 5, 7, 11, 13, 17, 19], "premiers_jusqua(20)."
assert premiers_jusqua(1) == [] and premiers_jusqua(2) == [2], "n = 1 et n = 2."
p = premiers_jusqua(200)
assert len(p) == 46 and p[-1] == 199, "46 nombres premiers jusqu'à 200, le dernier est 199."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\bif\b.*\[.*\bfor\b.*\]", PROGRAMME), "Une compréhension dans la condition."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-4-3" label="4.3 [Difficile] - Voisins d'une case" type="python">
<Enonce>
### Voisins d'une case

Dans une grille (liste de lignes de même longueur), les voisins de la case `(i, j)` sont les cases qui la touchent par un côté ou par un coin, soit 8 cases au plus (moins sur les bords). Écrire une fonction `voisins(grille, i, j)` qui renvoie la liste des **valeurs** de ces voisins, ligne par ligne de haut en bas, puis de gauche à droite. La case `(i, j)` elle-même n'en fait pas partie.

Exemple, avec `g = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]` : `voisins(g, 1, 1)` renvoie `[1, 2, 3, 4, 6, 7, 8, 9]` et `voisins(g, 0, 0)` renvoie `[2, 4, 5]`.

Contrainte : une seule compréhension à deux `for`, avec un `if`.

<Indices>
<Indice>

Les lignes candidates vont de `i - 1` à `i + 1`, les colonnes de `j - 1` à `j + 1` : `range(i - 1, i + 2)` et `range(j - 1, j + 2)`.

</Indice>
<Indice>

Une case `(a, b)` est gardée si elle est dans la grille (`0 <= a < len(grille)` et `0 <= b < len(grille[0])`) et si ce n'est pas la case `(i, j)`.

</Indice>
<Indice>

```text
FONCTION voisins(grille, i, j)
    h ← longueur(grille) ; l ← longueur(grille[0])
    RENVOYER [grille[a][b] POUR a ALLANT DE i - 1 À i + 1 POUR b ALLANT DE j - 1 À j + 1
              SI 0 ≤ a < h ET 0 ≤ b < l ET (a, b) ≠ (i, j)]
```

</Indice>
</Indices>

<Correction>

```python
def voisins(grille: list, i: int, j: int) -> list:
    h = len(grille)
    l = len(grille[0])
    return [grille[a][b] for a in range(i - 1, i + 2) for b in range(j - 1, j + 2)
            if 0 <= a < h and 0 <= b < l and (a, b) != (i, j)]
```

</Correction>
</Enonce>
<Verification>

```python
g = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
assert voisins(g, 1, 1) == [1, 2, 3, 4, 6, 7, 8, 9], "Case du milieu : 8 voisins."
assert voisins(g, 0, 0) == [2, 4, 5] and voisins(g, 2, 2) == [5, 6, 8], "Coins : 3 voisins."
assert voisins(g, 0, 1) == [1, 3, 4, 5, 6], "Bord : 5 voisins."
assert voisins([[4]], 0, 0) == [], "Grille d'une seule case : aucun voisin."
assert voisins([[1, 2, 3, 4]], 0, 2) == [2, 4], "Grille d'une seule ligne."
assert voisins([[1, 1], [1, 1]], 0, 0) == [1, 1, 1], "La case elle-même n'est pas comptée, même si sa valeur se répète."
assert ".append(" not in PROGRAMME, "Sans append."
assert "for" in PROGRAMME and PROGRAMME.count("for") >= 2 and "[" in PROGRAMME, "Une compréhension à deux for."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-4-4" label="4.4 [Difficile] - Paires de somme donnée" type="python">
<Enonce>
### Paires de somme donnée

Écrire une fonction `paires(liste, cible)` qui renvoie la liste des couples d'indices `[i, j]`, avec `i < j`, tels que `liste[i] + liste[j] == cible`. Les couples sont rangés par `i` croissant, puis par `j` croissant.

Exemple : `paires([3, 1, 4, 2, 5], 6)` renvoie `[[1, 4], [2, 3]]`, car `1 + 5 = 6` et `4 + 2 = 6`.

Contrainte : une seule compréhension à deux `for`.

<Indices>
<Indice>

Le second indice `j` commence juste après `i`, avec `range(i + 1, len(liste))`. Chaque paire n'est alors comptée qu'une fois, et un élément n'est jamais associé à lui-même.

</Indice>
<Indice>

La valeur ajoutée est la liste `[i, j]`, la condition porte sur `liste[i] + liste[j]`.

</Indice>
<Indice>

```text
FONCTION paires(liste, cible)
    n ← longueur(liste)
    RENVOYER [[i, j] POUR i ALLANT DE 0 À n - 1 POUR j ALLANT DE i + 1 À n - 1
              SI liste[i] + liste[j] = cible]
```

</Indice>
</Indices>

<Correction>

```python
def paires(liste: list, cible) -> list:
    n = len(liste)
    return [[i, j] for i in range(n) for j in range(i + 1, n) if liste[i] + liste[j] == cible]
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert paires([3, 1, 4, 2, 5], 6) == [[1, 4], [2, 3]], "[3, 1, 4, 2, 5] et 6 : [[1, 4], [2, 3]]."
assert paires([3, 3, 3], 6) == [[0, 1], [0, 2], [1, 2]], "Valeurs égales : chaque paire une fois, i < j."
assert paires([3], 6) == [] and paires([], 0) == [], "Pas de paire possible."
assert paires([1, 2, 3], 2) == [], "Un élément n'est pas associé à lui-même."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bfor\b.*\bin\b.*\bfor\b.*\bin\b.*\]", PROGRAMME), "Une seule compréhension à deux for."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-5-1" label="5.1 [Expert] - Quart de tour" type="python">
<Enonce>
### Quart de tour

Une image en niveaux de gris est une grille de nombres. Écrire une fonction `rotation(image)` qui renvoie l'image tournée d'un quart de tour dans le sens des aiguilles d'une montre. L'image reçue (non vide, rectangulaire) n'est pas modifiée.

Exemple : `rotation([[1, 2, 3], [4, 5, 6]])` renvoie `[[4, 1], [5, 2], [6, 3]]`.

```
1 2 3       4 1
4 5 6  →    5 2
            6 3
```

Contrainte : une compréhension dans une compréhension, sans `reverse` ni tranche `[::-1]`.

<Indices>
<Indice>

Une image de `h` lignes et `l` colonnes devient une image de `l` lignes et `h` colonnes.

</Indice>
<Indice>

La ligne `j` du résultat est la colonne `j` de l'image lue de bas en haut : `image[h - 1][j]`, puis `image[h - 2][j]`, … jusqu'à `image[0][j]`.

</Indice>
<Indice>

```text
FONCTION rotation(image)
    h ← longueur(image) ; l ← longueur(image[0])
    RENVOYER [[image[h - 1 - i][j] POUR i ALLANT DE 0 À h - 1] POUR j ALLANT DE 0 À l - 1]
```

</Indice>
</Indices>

<Correction>

```python
def rotation(image: list) -> list:
    h = len(image)
    l = len(image[0])
    return [[image[h - 1 - i][j] for i in range(h)] for j in range(l)]
```

</Correction>
</Enonce>
<Verification>

```python
import re
img = [[1, 2, 3], [4, 5, 6]]
assert rotation(img) == [[4, 1], [5, 2], [6, 3]], "Exemple de l'énoncé."
assert img == [[1, 2, 3], [4, 5, 6]], "L'image reçue n'est pas modifiée."
assert rotation([[1, 2], [3, 4]]) == [[3, 1], [4, 2]] and rotation([[9]]) == [[9]], "Image carrée ; une seule case."
c = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
assert rotation(rotation(rotation(rotation(c)))) == c, "Quatre quarts de tour : l'image de départ."
assert rotation(rotation(c)) == [[9, 8, 7], [6, 5, 4], [3, 2, 1]], "Deux quarts de tour : un demi-tour."
assert "reverse" not in PROGRAMME and "::-1" not in PROGRAMME and "zip(" not in PROGRAMME, "Sans reverse, [::-1] ni zip."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[\s*\[.*\bfor\b.*\]\s*for\b.*\]", PROGRAMME), "Une compréhension dans une compréhension."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-5-2" label="5.2 [Expert] - Carré magique" type="python">
<Enonce>
### Carré magique

Un carré de nombres est **magique** quand toutes ses lignes, toutes ses colonnes et ses deux diagonales ont la même somme. Écrire une fonction `est_magique(carre)` qui renvoie `True` si le carré (non vide) est magique, `False` sinon.

Exemple : `[[2, 7, 6], [9, 5, 1], [4, 3, 8]]` est magique (toutes les sommes valent 15) ; `[[1, 2], [3, 4]]` ne l'est pas.

Contrainte : construire la liste de toutes les sommes avec des compréhensions (`sum` est permis), puis comparer, sans boucle `for` en dehors des compréhensions.

<Indices>
<Indice>

Les sommes des lignes : `[sum(ligne) for ligne in carre]`. Celles des colonnes demandent une compréhension dans la compréhension.

</Indice>
<Indice>

La seconde diagonale part du coin en haut à droite : `carre[i][n - 1 - i]`. Une fois toutes les sommes réunies dans une liste, le carré est magique si aucune n'est différente de la première.

</Indice>
<Indice>

```text
FONCTION est_magique(carre)
    n ← longueur(carre)
    lignes ← [somme(ligne) POUR CHAQUE ligne DE carre]
    colonnes ← [somme([carre[i][j] POUR i DE 0 À n - 1]) POUR j DE 0 À n - 1]
    diagonales ← [somme([carre[i][i] ...]), somme([carre[i][n - 1 - i] ...])]
    sommes ← lignes + colonnes + diagonales
    RENVOYER [s POUR CHAQUE s DE sommes SI s ≠ sommes[0]] est vide
```

</Indice>
</Indices>

<Correction>

```python
def est_magique(carre: list) -> bool:
    n = len(carre)
    lignes = [sum(ligne) for ligne in carre]
    colonnes = [sum([carre[i][j] for i in range(n)]) for j in range(n)]
    diagonales = [sum([carre[i][i] for i in range(n)]), sum([carre[i][n - 1 - i] for i in range(n)])]
    sommes = lignes + colonnes + diagonales
    return [s for s in sommes if s != sommes[0]] == []
```

</Correction>
</Enonce>
<Verification>

```python
assert est_magique([[2, 7, 6], [9, 5, 1], [4, 3, 8]]) is True, "Le carré de l'énoncé est magique."
assert est_magique([[1, 2], [3, 4]]) is False, "[[1, 2], [3, 4]] n'est pas magique."
assert est_magique([[5]]) is True and est_magique([[1, 1], [1, 1]]) is True, "Une case ; que des 1."
assert est_magique([[1, 2, 3], [3, 1, 2], [2, 3, 1]]) is False, "Lignes, colonnes et seconde diagonale justes, mais pas la première."
assert est_magique([[16, 3, 2, 13], [5, 10, 11, 8], [9, 6, 7, 12], [4, 15, 14, 1]]) is True, "Carré de Dürer, 4 × 4."
assert est_magique([[1, 2, 3], [2, 3, 1], [3, 1, 2]]) is False, "Première diagonale juste, mais pas la seconde."
assert ".append(" not in PROGRAMME, "Sans append."
assert PROGRAMME.count("for") >= 4, "Construire les sommes avec des compréhensions."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-5-3" label="5.3 [Expert] - Chiffre de César" type="python">
<Enonce>
### Chiffre de César

Le chiffre de César décale chaque lettre de l'alphabet d'un même nombre de rangs, en repartant au début après le `z` : avec un décalage de 3, `a` devient `d` et `y` devient `b`. Écrire une fonction `cesar(texte, decalage)` qui renvoie le texte chiffré. Seules les lettres minuscules de `a` à `z` sont décalées ; les autres caractères (espaces, ponctuation, lettres accentuées) sont recopiés tels quels. Un décalage négatif sert à déchiffrer.

Exemple : `cesar("ave cesar !", 3)` renvoie `"dyh fhvdu !"`.

Contrainte : une compréhension avec `if … else` construit la liste des caractères du résultat ; `"".join(liste)` les colle ensuite en un seul texte.

<Indices>
<Indice>

`ord(c) - ord("a")` donne le rang de la lettre `c` (0 pour `a`, 25 pour `z`), et `chr(ord("a") + r)` la lettre de rang `r`.

</Indice>
<Indice>

Le rang décalé est `(rang + decalage) % 26`. Le reste de la division par 26 ramène au début de l'alphabet, même avec un décalage négatif. Une lettre minuscule vérifie `"a" <= c <= "z"`.

</Indice>
<Indice>

```text
FONCTION cesar(texte, decalage)
    caracteres ← [chr(ord("a") + (ord(c) - ord("a") + decalage) mod 26) SI "a" ≤ c ≤ "z" SINON c
                  POUR CHAQUE c DE texte]
    RENVOYER caracteres collés en un texte
```

</Indice>
</Indices>

<Correction>

```python
def cesar(texte: str, decalage: int) -> str:
    caracteres = [chr(ord("a") + (ord(c) - ord("a") + decalage) % 26) if "a" <= c <= "z" else c for c in texte]
    return "".join(caracteres)
```

</Correction>
</Enonce>
<Verification>

```python
import re
assert cesar("ave cesar !", 3) == "dyh fhvdu !", "Exemple de l'énoncé."
assert cesar("xyz", 3) == "abc" and cesar("abc", -1) == "zab", "Retour au début de l'alphabet, dans les deux sens."
assert cesar("été, 2026", 1) == "éué, 2026", "Accents, chiffres et ponctuation recopiés."
assert cesar("", 5) == "" and cesar("renard", 26) == "renard", "Texte vide ; décalage de 26."
t = "le code est dans la taniere"
assert cesar(cesar(t, 11), -11) == t, "Déchiffrer avec le décalage opposé."
assert ".append(" not in PROGRAMME, "Sans append."
assert re.search(r"\[.*\bif\b.*\belse\b.*\bfor\b.*\]", PROGRAMME), "Une compréhension avec if … else."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-5-4" label="5.4 [Expert] - Flou d'une image" type="python">
<Enonce>
### Flou d'une image

Pour flouter une image en niveaux de gris (grille d'entiers), chaque pixel est remplacé par la moyenne de son **voisinage** : le pixel lui-même et ses voisins présents dans l'image (9 pixels au milieu, 6 sur un bord, 4 dans un coin). La moyenne est arrondie à l'entier inférieur avec `//`.

Écrire :
- `voisinage(image, i, j)` : renvoie la liste des valeurs du voisinage du pixel `(i, j)`, lui compris ;
- `flouter(image)` : renvoie la nouvelle image floutée, sans modifier `image`.

Exemple : `flouter([[0, 0, 0], [0, 9, 0], [0, 0, 0]])` renvoie `[[2, 1, 2], [1, 1, 1], [2, 1, 2]]`. Dans le coin, le voisinage est `[0, 0, 0, 9]`, de moyenne `9 // 4 = 2`.

Contrainte : chaque fonction est un `return` avec une compréhension.

<Indices>
<Indice>

`voisinage` ressemble à `voisins` de l'exercice 4.3, sans exclure la case `(i, j)`.

</Indice>
<Indice>

Dans `flouter`, chaque nouvelle valeur se calcule à partir de la liste `v = voisinage(image, i, j)` : `sum(v) // len(v)`. Le résultat se construit comme la grille de l'exercice 3.1, en parcourant les indices.

</Indice>
<Indice>

```text
FONCTION voisinage(image, i, j)
    RENVOYER [image[a][b] POUR a DE i - 1 À i + 1 POUR b DE j - 1 À j + 1 SI (a, b) dans l'image]
FONCTION flouter(image)
    RENVOYER [[somme(voisinage(image, i, j)) // longueur(voisinage(image, i, j))
               POUR j DE 0 À largeur - 1] POUR i DE 0 À hauteur - 1]
```

</Indice>
</Indices>

<Correction>

```python
def voisinage(image: list, i: int, j: int) -> list:
    return [image[a][b] for a in range(i - 1, i + 2) for b in range(j - 1, j + 2)
            if 0 <= a < len(image) and 0 <= b < len(image[0])]


def flouter(image: list) -> list:
    return [[sum(voisinage(image, i, j)) // len(voisinage(image, i, j)) for j in range(len(image[0]))]
            for i in range(len(image))]
```

</Correction>
</Enonce>
<Verification>

```python
img = [[0, 0, 0], [0, 9, 0], [0, 0, 0]]
assert voisinage(img, 0, 0) == [0, 0, 0, 9] and len(voisinage(img, 1, 1)) == 9 and len(voisinage(img, 0, 1)) == 6, "Taille des voisinages : 4, 9 et 6."
assert flouter(img) == [[2, 1, 2], [1, 1, 1], [2, 1, 2]], "Exemple de l'énoncé."
assert img == [[0, 0, 0], [0, 9, 0], [0, 0, 0]], "L'image reçue n'est pas modifiée."
assert flouter([[7]]) == [[7]] and flouter([[5, 5], [5, 5]]) == [[5, 5], [5, 5]], "Image d'un pixel ; image uniforme."
assert flouter([[0, 10, 20, 30]]) == [[5, 10, 20, 25]], "Image d'une ligne."
assert ".append(" not in PROGRAMME, "Sans append."
assert PROGRAMME.count("for") >= 4, "Des compréhensions dans les deux fonctions."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-6-1" label="6.1 [Mini-projet] - Le jeu de la vie" type="python">
<Enonce>
### Le jeu de la vie

**Contexte.** Le jeu de la vie a été imaginé par le mathématicien John Conway en 1970. Une grille de cellules vivantes ou mortes évolue de génération en génération en suivant deux règles. Certains motifs restent immobiles, d'autres clignotent et d'autres se déplacent. Le but du projet est d'écrire un simulateur, puis de s'en servir pour classer les motifs.

**Les données** : une grille est une liste de lignes ; chaque case vaut `1` (cellule vivante) ou `0` (cellule morte). Pour la saisir et l'afficher, une grille s'écrit aussi en texte, une chaîne par ligne, avec `"#"` pour une cellule vivante et `"."` pour une cellule morte, par exemple `[".#.", ".#.", ".#."]`. La grille ne se replie pas sur elle-même, et il n'y a aucune cellule au-delà des bords.

**Les règles**, appliquées à toutes les cellules en même temps :
- une cellule vivante qui a 2 ou 3 voisines vivantes reste vivante, sinon elle meurt ;
- une cellule morte qui a exactement 3 voisines vivantes devient vivante, sinon elle reste morte.

**Les fonctions du programme**
- `depuis_texte(lignes)` : reçoit une liste de chaînes et renvoie la grille de 0 et de 1 correspondante.
- `vers_texte(grille)` : reçoit une grille et renvoie la liste de chaînes correspondante (`"".join` colle une liste de caractères).
- `nb_voisins(grille, i, j)` : reçoit une grille et une position, et renvoie le nombre de cellules vivantes parmi les 8 voisines (moins sur les bords), sans compter la cellule elle-même.
- `etat_suivant(cellule, voisins)` : reçoit l'état d'une cellule (0 ou 1) et son nombre de voisines vivantes, et renvoie son état à la génération suivante en appliquant les règles.
- `etape(grille)` : renvoie la grille de la génération suivante, sans modifier celle reçue.
- `evoluer(grille, n)` : renvoie la grille après `n` générations.
- `population(grille)` : renvoie le nombre de cellules vivantes.
- `periode(grille, maximum)` : renvoie le plus petit nombre de générations `p` (entre 1 et `maximum`) au bout duquel la grille redevient exactement celle de départ, ou `None` si cela n'arrive pas. Un motif immobile a une période de 1, un clignotant une période de 2.

Contrainte : aucune liste n'est construite avec `append` ; seules `evoluer` et `periode` contiennent une boucle en dehors des compréhensions.

<Indices>
<Indice>

`depuis_texte` et `vers_texte` sont des compréhensions dans une compréhension : une liste par ligne, une valeur par caractère (ou par case), avec `if … else` pour choisir `1` ou `0`, `"#"` ou `"."`.

</Indice>
<Indice>

`nb_voisins` reprend `voisins` de l'exercice 4.3 : la somme des valeurs voisines est le nombre de cellules vivantes.

</Indice>
<Indice>

`etape` ne doit pas modifier la grille pendant le calcul, car chaque cellule dépend de ses voisines **de la génération en cours**. La nouvelle grille se construit donc entièrement par compréhension, à côté de l'ancienne.

</Indice>
<Indice>

```text
(cœur du programme : une génération)
FONCTION etape(grille)
    RENVOYER [[etat_suivant(grille[i][j], nb_voisins(grille, i, j)) POUR j DE 0 À largeur - 1]
              POUR i DE 0 À hauteur - 1]
FONCTION periode(grille, maximum)
    g ← grille
    POUR p ALLANT DE 1 À maximum
        g ← etape(g)
        SI g = grille ALORS RENVOYER p
    RENVOYER None
```

</Indice>
</Indices>

<Correction>

```python
def depuis_texte(lignes: list) -> list:
    return [[1 if c == "#" else 0 for c in ligne] for ligne in lignes]


def vers_texte(grille: list) -> list:
    return ["".join(["#" if v == 1 else "." for v in ligne]) for ligne in grille]


def nb_voisins(grille: list, i: int, j: int) -> int:
    h = len(grille)
    l = len(grille[0])
    return sum([grille[a][b] for a in range(i - 1, i + 2) for b in range(j - 1, j + 2)
                if 0 <= a < h and 0 <= b < l and (a, b) != (i, j)])


def etat_suivant(cellule: int, voisins: int) -> int:
    if cellule == 1:
        return 1 if voisins == 2 or voisins == 3 else 0
    return 1 if voisins == 3 else 0


def etape(grille: list) -> list:
    return [[etat_suivant(grille[i][j], nb_voisins(grille, i, j)) for j in range(len(grille[0]))]
            for i in range(len(grille))]


def evoluer(grille: list, n: int) -> list:
    for _ in range(n):
        grille = etape(grille)
    return grille


def population(grille: list) -> int:
    return sum([sum(ligne) for ligne in grille])


def periode(grille: list, maximum: int):
    g = grille
    for p in range(1, maximum + 1):
        g = etape(g)
        if g == grille:
            return p
    return None
```

</Correction>
</Enonce>
<Verification>

```python
clignotant = [".....", "..#..", "..#..", "..#..", "....."]
g = depuis_texte(clignotant)
assert g[1] == [0, 0, 1, 0, 0] and len(g) == 5, "depuis_texte : une liste de 0 et de 1 par ligne."
assert vers_texte(g) == clignotant and vers_texte([[1, 0]]) == ["#."], "vers_texte : l'opération inverse."
assert nb_voisins(g, 2, 1) == 3 and nb_voisins(g, 2, 2) == 2 and nb_voisins(g, 0, 0) == 0, "nb_voisins au centre et dans un coin."
assert nb_voisins([[1, 1], [1, 1]], 0, 0) == 3, "La cellule elle-même n'est pas comptée."
assert [etat_suivant(1, v) for v in range(9)] == [0, 0, 1, 1, 0, 0, 0, 0, 0], "Règle des cellules vivantes."
assert [etat_suivant(0, v) for v in range(9)] == [0, 0, 0, 1, 0, 0, 0, 0, 0], "Règle des cellules mortes."
assert vers_texte(etape(g)) == [".....", ".....", ".###.", ".....", "....."], "Le clignotant se couche."
assert vers_texte(g) == clignotant, "etape ne modifie pas la grille reçue."
assert evoluer(g, 2) == g and evoluer(g, 0) == g, "Deux générations : retour au départ."
assert population(g) == 3 and population(depuis_texte(["...", "..."])) == 0, "population."
planeur = depuis_texte([".#....", "..#...", "###...", "......", "......", "......"])
assert vers_texte(evoluer(planeur, 4)) == ["......", "..#...", "...#..", ".###..", "......", "......"], "Le planeur avance d'une case en diagonale en 4 générations."
assert periode(g, 10) == 2, "Le clignotant a une période de 2."
assert periode(depuis_texte(["....", ".##.", ".##.", "...."]), 10) == 1, "Le bloc est immobile : période 1."
assert periode(planeur, 30) is None, "Le planeur ne revient jamais à sa place de départ."
assert ".append(" not in PROGRAMME, "Aucune liste construite avec append."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-comp-6-2" label="6.2 [Mini-projet] - Le conseil de classe" type="python">
<Enonce>
### Le conseil de classe

**Contexte.** Avant le conseil de classe, l'équipe pédagogique prépare un tableau de bord avec la moyenne de chaque élève, les mentions, les élèves en difficulté, les meilleures moyennes et la répartition de la classe. Le but du projet est d'écrire le programme qui calcule ces informations à partir des notes.

**Les données** : la classe est une liste d'élèves ; chaque élève est une liste `[nom, notes]`, où `notes` est la liste (non vide) de ses notes sur 20, une par matière, toujours dans le même ordre de matières. Par exemple :

```python
classe = [["Ada", [14, 16, 12]], ["Alan", [8, 11, 9]], ["Grace", [17, 19, 18]]]
```

**Les fonctions du programme**
- `moyenne(notes)` : reçoit une liste de notes. Renvoie leur moyenne arrondie à 2 chiffres après la virgule (`round(x, 2)`).
- `moyennes(classe)` : renvoie la liste des couples `[nom, moyenne]`, dans l'ordre de la classe. Exemple : `[["Ada", 14.0], ["Alan", 9.33], ["Grace", 18.0]]`.
- `notes_matiere(classe, k)` : renvoie la liste des notes de tous les élèves dans la matière d'indice `k`.
- `admis(classe)` : renvoie la liste des noms des élèves dont la moyenne vaut au moins 10.
- `mention(m)` : reçoit une moyenne. Renvoie `"TB"` à partir de 16, `"B"` à partir de 14, `"AB"` à partir de 12, et `""` sinon.
- `mentions(classe)` : renvoie la liste des couples `[nom, mention]` des élèves qui ont une mention.
- `majors(classe)` : renvoie la liste des noms des élèves qui ont la meilleure moyenne (plusieurs en cas d'égalité), dans l'ordre de la classe.
- `repartition(classe)` : renvoie la liste des 5 effectifs d'élèves dont la moyenne est dans les tranches `[0 ; 4[`, `[4 ; 8[`, `[8 ; 12[`, `[12 ; 16[` et `[16 ; 20]` (20 compte dans la dernière tranche).

Contrainte : aucune liste n'est construite avec `append` ; `sum`, `len`, `max` et `min` sont permis.

<Indices>
<Indice>

Un élève `e` est une liste de deux éléments : `e[0]` est son nom, `e[1]` la liste de ses notes. `moyennes`, `notes_matiere` et `admis` sont alors des compréhensions d'une ligne sur `classe`.

</Indice>
<Indice>

`mentions` peut parcourir `moyennes(classe)` et filtrer avec `if mention(m) != ""`. `majors` calcule d'abord la meilleure moyenne avec `max` sur une compréhension, puis garde les élèves qui l'atteignent.

</Indice>
<Indice>

Pour `repartition`, la tranche d'une moyenne `m` a pour numéro `int(m // 4)`, sauf pour 20, qui donnerait 5. `min(int(m // 4), 4)` range 20 dans la tranche 4. L'effectif de la tranche `k` est la longueur d'une liste filtrée.

</Indice>
<Indice>

```text
(cœur du programme : la répartition)
FONCTION repartition(classe)
    ms ← [moyenne(e[1]) POUR CHAQUE e DE classe]
    RENVOYER [longueur([m POUR CHAQUE m DE ms SI min(partie entière(m / 4), 4) = k])
              POUR k ALLANT DE 0 À 4]
```

</Indice>
</Indices>

<Correction>

```python
def moyenne(notes: list) -> float:
    return round(sum(notes) / len(notes), 2)


def moyennes(classe: list) -> list:
    return [[e[0], moyenne(e[1])] for e in classe]


def notes_matiere(classe: list, k: int) -> list:
    return [e[1][k] for e in classe]


def admis(classe: list) -> list:
    return [e[0] for e in classe if moyenne(e[1]) >= 10]


def mention(m: float) -> str:
    if m >= 16:
        return "TB"
    if m >= 14:
        return "B"
    if m >= 12:
        return "AB"
    return ""


def mentions(classe: list) -> list:
    return [[nom, mention(m)] for nom, m in moyennes(classe) if mention(m) != ""]


def majors(classe: list) -> list:
    meilleure = max([moyenne(e[1]) for e in classe])
    return [e[0] for e in classe if moyenne(e[1]) == meilleure]


def repartition(classe: list) -> list:
    ms = [moyenne(e[1]) for e in classe]
    return [len([m for m in ms if min(int(m // 4), 4) == k]) for k in range(5)]
```

</Correction>
</Enonce>
<Verification>

```python
C = [["Ada", [14, 16, 12]], ["Alan", [8, 11, 9]], ["Grace", [17, 19, 18]],
     ["Linus", [10, 7, 12]], ["Margaret", [9, 9, 8]], ["Katherine", [18, 17, 19]]]
assert moyenne([14, 16, 12]) == 14.0 and moyenne([8, 11, 9]) == 9.33 and moyenne([20]) == 20, "moyenne, arrondie au centième."
assert moyennes(C)[:3] == [["Ada", 14.0], ["Alan", 9.33], ["Grace", 18.0]] and len(moyennes(C)) == 6, "moyennes, dans l'ordre de la classe."
assert notes_matiere(C, 1) == [16, 11, 19, 7, 9, 17] and notes_matiere(C, 0)[0] == 14, "notes_matiere."
assert admis(C) == ["Ada", "Grace", "Katherine"], "admis : moyenne d'au moins 10."
assert admis([["Zoé", [10, 10]]]) == ["Zoé"], "10 de moyenne : admis."
assert [mention(m) for m in [16, 15.99, 14, 12, 11.99]] == ["TB", "B", "B", "AB", ""], "mention, aux seuils."
assert mentions(C) == [["Ada", "B"], ["Grace", "TB"], ["Katherine", "TB"]], "mentions : seulement les élèves qui en ont une."
assert majors(C) == ["Grace", "Katherine"] and majors(C[:2]) == ["Ada"], "majors, avec une égalité."
assert repartition(C) == [0, 0, 3, 1, 2], "repartition de la classe."
assert repartition([["A", [20]], ["B", [0]], ["C", [5, 6]], ["D", [16]]]) == [1, 1, 0, 0, 2], "Bords des tranches : 20 compte dans la dernière."
assert ".append(" not in PROGRAMME, "Aucune liste construite avec append."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
