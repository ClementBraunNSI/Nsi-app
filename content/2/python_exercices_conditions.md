---
title: 'Exercices : Les Conditions'
icon: "shuffle"
chapter: Introduction à Python
badgeId: premiere_exercices_conditions
meta: 'if, if/else, if/elif/else et opérateurs logiques'
level: premiere
prerequisites:
  - python_constructions_elementaires
audience: public
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="les-conditions-python" courseTitle="Les Conditions">

<ExerciseSection id="1nsi-cond-1-1" label="1.1 [Introduction] - Valeur absolue" type="python">
<Enonce>
### Valeur absolue

Écrire une fonction `valeur_absolue(x)` qui renvoie `x` s'il est positif ou nul, et `-x` sinon.

Contrainte : sans la fonction `abs`.

<Indices>
<Indice>

Un seul test suffit : `x` est-il négatif ?

</Indice>
<Indice>

Une fonction peut contenir plusieurs `return` : le premier exécuté termine la fonction.

</Indice>
<Indice>

```text
FONCTION valeur_absolue(x)
    SI x < 0 ALORS RENVOYER -x
    RENVOYER x
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def valeur_absolue(x: float) -> float:
    if x < 0:
        return -x
    return x
```

</Correction>
</Enonce>
<Verification>

```python
assert valeur_absolue(-5) == 5 and valeur_absolue(5) == 5, "-5 et 5 donnent 5."
assert valeur_absolue(0) == 0 and valeur_absolue(-2.5) == 2.5, "0 donne 0, -2.5 donne 2.5."
assert "abs(" not in PROGRAMME, "Sans abs."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-1-2" label="1.2 [Introduction] - Accorder un nom" type="python">
<Enonce>
### Accorder un nom

Écrire une fonction `accorder(n, nom)` qui renvoie le nombre suivi du nom, au pluriel (avec un `s`) à partir de 2.

Exemples : `accorder(3, "renard")` renvoie `"3 renards"`, `accorder(1, "renard")` renvoie `"1 renard"`, `accorder(0, "renard")` renvoie `"0 renard"`.

<Indices>
<Indice>

En français, 0 et 1 s'écrivent au singulier : le pluriel commence à 2.

</Indice>
<Indice>

`str(n)` convertit le nombre pour le coller au texte.

</Indice>
<Indice>

```text
FONCTION accorder(n, nom)
    SI n ≥ 2 ALORS RENVOYER texte(n) + " " + nom + "s"
    RENVOYER texte(n) + " " + nom
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def accorder(n: int, nom: str) -> str:
    if n >= 2:
        return str(n) + " " + nom + "s"
    return str(n) + " " + nom
```

</Correction>
</Enonce>
<Verification>

```python
assert accorder(3, "renard") == "3 renards", "3 renards."
assert accorder(1, "renard") == "1 renard" and accorder(0, "terrier") == "0 terrier", "0 et 1 : singulier."
assert accorder(2, "point") == "2 points", "2 points."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-1-3" label="1.3 [Introduction] - Feu tricolore" type="python">
<Enonce>
### Feu tricolore

Écrire une fonction `consigne(couleur)` qui renvoie `"passer"` pour `"vert"`, `"ralentir"` pour `"orange"`, `"s'arrêter"` pour `"rouge"` et `"inconnu"` pour toute autre couleur.

<Indices>
<Indice>

Une comparaison par couleur, enchaînées avec `elif`.

</Indice>
<Indice>

Le cas `else` attrape toutes les couleurs non prévues.

</Indice>
<Indice>

```text
FONCTION consigne(couleur)
    SI couleur = "vert" ALORS RENVOYER "passer"
    SINON SI couleur = "orange" ALORS RENVOYER "ralentir"
    SINON SI couleur = "rouge" ALORS RENVOYER "s'arrêter"
    SINON RENVOYER "inconnu"
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def consigne(couleur: str) -> str:
    if couleur == "vert":
        return "passer"
    elif couleur == "orange":
        return "ralentir"
    elif couleur == "rouge":
        return "s'arrêter"
    else:
        return "inconnu"
```

</Correction>
</Enonce>
<Verification>

```python
assert consigne("vert") == "passer" and consigne("orange") == "ralentir", "Vert et orange."
assert consigne("rouge") == "s'arrêter", "Rouge."
assert consigne("bleu") == "inconnu" and consigne("Rouge") == "inconnu", "Toute autre valeur : inconnu."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-1-4" label="1.4 [Introduction] - Le plus petit" type="python">
<Enonce>
### Le plus petit

Écrire une fonction `plus_petit(a, b)` qui renvoie le plus petit des deux nombres.

Contrainte : sans la fonction `min`.

<Indices>
<Indice>

Comparer `a` et `b` et renvoyer celui qui gagne la comparaison.

</Indice>
<Indice>

En cas d'égalité, renvoyer l'un ou l'autre ne change rien.

</Indice>
<Indice>

```text
FONCTION plus_petit(a, b)
    SI a < b ALORS RENVOYER a
    RENVOYER b
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def plus_petit(a: float, b: float) -> float:
    if a < b:
        return a
    return b
```

</Correction>
</Enonce>
<Verification>

```python
assert plus_petit(3, 8) == 3 and plus_petit(8, 3) == 3, "3 et 8 dans les deux ordres."
assert plus_petit(-1, -4) == -4 and plus_petit(2, 2) == 2, "Négatifs et égalité."
import re
assert not re.search(r"\bmin\s*\(", PROGRAMME), "Sans min."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-2-1" label="2.1 [Facile] - Bonjour ou bonsoir" type="python">
<Enonce>
### Bonjour ou bonsoir

Écrire une fonction `salutation(heure)` (un entier de 0 à 23) qui renvoie :
- `"Bonjour"` de 6 h à 17 h inclus ;
- `"Bonsoir"` de 18 h à 21 h inclus ;
- `"Bonne nuit"` le reste du temps.

<Indices>
<Indice>

Écrire chaque plage sous la forme `6 <= heure <= 17`.

</Indice>
<Indice>

La nuit est à cheval sur minuit : plutôt que de la décrire, la laisser au `else`.

</Indice>
<Indice>

```text
FONCTION salutation(heure)
    SI 6 ≤ heure ≤ 17 ALORS RENVOYER "Bonjour"
    SINON SI 18 ≤ heure ≤ 21 ALORS RENVOYER "Bonsoir"
    SINON RENVOYER "Bonne nuit"
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def salutation(heure: int) -> str:
    if 6 <= heure <= 17:
        return "Bonjour"
    elif 18 <= heure <= 21:
        return "Bonsoir"
    else:
        return "Bonne nuit"
```

</Correction>
</Enonce>
<Verification>

```python
for h, s in [(6, "Bonjour"), (17, "Bonjour"), (18, "Bonsoir"), (21, "Bonsoir"), (22, "Bonne nuit"), (0, "Bonne nuit"), (5, "Bonne nuit")]:
    assert salutation(h) == s, f"{h} h : {s}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-2-2" label="2.2 [Facile] - Catégorie d'IMC" type="python">
<Enonce>
### Catégorie d'IMC

L'indice de masse corporelle vaut `poids / taille²` (poids en kg, taille en m).

Écrire une fonction `categorie_imc(poids, taille)` qui renvoie `"maigreur"` (IMC sous 18,5), `"normal"` (sous 25), `"surpoids"` (sous 30) ou `"obésité"`.

<Indices>
<Indice>

Calculer l'IMC une seule fois dans une variable, puis enchaîner les tests.

</Indice>
<Indice>

`taille ** 2` calcule le carré.

</Indice>
<Indice>

```text
FONCTION categorie_imc(poids, taille)
    imc ← poids / taille²
    SI imc < 18,5 ALORS RENVOYER "maigreur"
    SINON SI imc < 25 ALORS RENVOYER "normal"
    SINON SI imc < 30 ALORS RENVOYER "surpoids"
    SINON RENVOYER "obésité"
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def categorie_imc(poids: float, taille: float) -> str:
    imc = poids / taille ** 2
    if imc < 18.5:
        return "maigreur"
    elif imc < 25:
        return "normal"
    elif imc < 30:
        return "surpoids"
    else:
        return "obésité"
```

</Correction>
</Enonce>
<Verification>

```python
assert categorie_imc(50, 1.75) == "maigreur", "50 kg, 1,75 m : maigreur."
assert categorie_imc(70, 1.75) == "normal", "70 kg, 1,75 m : normal."
assert categorie_imc(85, 1.75) == "surpoids", "85 kg, 1,75 m : surpoids."
assert categorie_imc(100, 1.75) == "obésité", "100 kg, 1,75 m : obésité."
assert categorie_imc(25, 1) == "surpoids" and categorie_imc(18.5, 1) == "normal", "Les seuils 25 et 18,5."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-2-3" label="2.3 [Facile] - Points de permis" type="python">
<Enonce>
### Points de permis

Écrire une fonction `points_retires(vitesse, limite)` qui renvoie le nombre de points retirés selon l'excès de vitesse (`vitesse - limite`) :
- pas d'excès : 0 point ;
- excès de moins de 20 km/h : 1 point ;
- de 20 à moins de 30 : 2 points ;
- de 30 à moins de 40 : 3 points ;
- de 40 à moins de 50 : 4 points ;
- 50 km/h ou plus : 6 points.

<Indices>
<Indice>

Calculer l'excès d'abord. Un excès négatif ou nul ne retire rien.

</Indice>
<Indice>

Les tranches se testent dans l'ordre croissant avec `elif excès < 20`, `elif excès < 30`…

</Indice>
<Indice>

```text
FONCTION points_retires(vitesse, limite)
    exces ← vitesse - limite
    SI exces ≤ 0 ALORS RENVOYER 0
    SINON SI exces < 20 ALORS RENVOYER 1
    SINON SI exces < 30 ALORS RENVOYER 2
    SINON SI exces < 40 ALORS RENVOYER 3
    SINON SI exces < 50 ALORS RENVOYER 4
    SINON RENVOYER 6
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def points_retires(vitesse: int, limite: int) -> int:
    exces = vitesse - limite
    if exces <= 0:
        return 0
    elif exces < 20:
        return 1
    elif exces < 30:
        return 2
    elif exces < 40:
        return 3
    elif exces < 50:
        return 4
    else:
        return 6
```

</Correction>
</Enonce>
<Verification>

```python
cas = [(50, 50, 0), (45, 50, 0), (69, 50, 1), (70, 50, 2), (125, 90, 3), (170, 130, 4), (100, 50, 6)]
for v, l, p in cas:
    assert points_retires(v, l) == p, f"{v} km/h pour {l} : {p} point(s)."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-2-4" label="2.4 [Facile] - Quadrant" type="python">
<Enonce>
### Quadrant

Écrire une fonction `quadrant(x, y)` qui renvoie le numéro du quadrant du point `(x, y)` : 1 en haut à droite, 2 en haut à gauche, 3 en bas à gauche, 4 en bas à droite. Un point sur un axe renvoie 0.

<Indices>
<Indice>

Traiter d'abord le cas d'un point sur un axe : `x == 0 or y == 0`.

</Indice>
<Indice>

Ensuite, le signe de `y` dit « haut » ou « bas », et celui de `x` « droite » ou « gauche ».

</Indice>
<Indice>

```text
FONCTION quadrant(x, y)
    SI x = 0 OU y = 0 ALORS RENVOYER 0
    SI y > 0 ALORS
        SI x > 0 ALORS RENVOYER 1 SINON RENVOYER 2
    SINON
        SI x < 0 ALORS RENVOYER 3 SINON RENVOYER 4
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def quadrant(x: float, y: float) -> int:
    if x == 0 or y == 0:
        return 0
    if y > 0:
        if x > 0:
            return 1
        return 2
    if x < 0:
        return 3
    return 4
```

</Correction>
</Enonce>
<Verification>

```python
assert quadrant(2, 3) == 1 and quadrant(-2, 3) == 2, "Quadrants 1 et 2."
assert quadrant(-2, -3) == 3 and quadrant(2, -3) == 4, "Quadrants 3 et 4."
assert quadrant(0, 5) == 0 and quadrant(5, 0) == 0 and quadrant(0, 0) == 0, "Sur un axe : 0."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-3-1" label="3.1 [Moyen] - La valeur du milieu" type="python">
<Enonce>
### La valeur du milieu

Écrire une fonction `milieu(a, b, c)` qui renvoie la valeur du milieu de trois nombres (celle qui n'est ni la plus petite ni la plus grande).

Exemple : `milieu(7, 2, 5)` renvoie `5`.

Contrainte : sans `sorted`, `sort`, `min` ni `max`.

<Indices>
<Indice>

`a` est au milieu si elle est entre `b` et `c`, dans un sens ou dans l'autre : `b <= a <= c or c <= a <= b`.

</Indice>
<Indice>

Si `a` n'est pas au milieu, tester `b` de la même façon ; sinon c'est `c`.

</Indice>
<Indice>

```text
FONCTION milieu(a, b, c)
    SI (b ≤ a ≤ c) OU (c ≤ a ≤ b) ALORS RENVOYER a
    SINON SI (a ≤ b ≤ c) OU (c ≤ b ≤ a) ALORS RENVOYER b
    SINON RENVOYER c
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def milieu(a: float, b: float, c: float) -> float:
    if b <= a <= c or c <= a <= b:
        return a
    elif a <= b <= c or c <= b <= a:
        return b
    else:
        return c
```

</Correction>
</Enonce>
<Verification>

```python
from itertools import permutations
for t in permutations([2, 5, 7]):
    assert milieu(*t) == 5, f"milieu{t} vaut 5."
assert milieu(4, 4, 9) == 4 and milieu(9, 4, 9) == 9 and milieu(1, 1, 1) == 1, "Avec des valeurs égales."
import re
assert not re.search(r"\b(sorted|sort|min|max)\s*\(", PROGRAMME), "Sans sorted, sort, min ni max."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-3-2" label="3.2 [Moyen] - Triangle rectangle" type="python">
<Enonce>
### Triangle rectangle

Écrire une fonction `est_rectangle(a, b, c)` qui renvoie `True` si un triangle de côtés entiers `a`, `b`, `c` est rectangle. Les côtés sont donnés **dans n'importe quel ordre**.

Rappel : un triangle est rectangle si le carré du plus grand côté est égal à la somme des carrés des deux autres.

<Indices>
<Indice>

Plutôt que de chercher le plus grand côté, tester les trois possibilités pour l'hypoténuse, reliées par `or`.

</Indice>
<Indice>

`a ** 2 == b ** 2 + c ** 2` est un premier cas ; il en reste deux.

</Indice>
<Indice>

```text
FONCTION est_rectangle(a, b, c)
    RENVOYER (a² = b² + c²) OU (b² = a² + c²) OU (c² = a² + b²)
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def est_rectangle(a: int, b: int, c: int) -> bool:
    return a ** 2 == b ** 2 + c ** 2 or b ** 2 == a ** 2 + c ** 2 or c ** 2 == a ** 2 + b ** 2
```

</Correction>
</Enonce>
<Verification>

```python
assert est_rectangle(3, 4, 5) is True and est_rectangle(5, 3, 4) is True and est_rectangle(4, 5, 3) is True, "3, 4, 5 dans tous les ordres."
assert est_rectangle(5, 12, 13) is True, "5, 12, 13 est rectangle."
assert est_rectangle(2, 3, 4) is False and est_rectangle(1, 1, 1) is False, "2, 3, 4 et 1, 1, 1 ne le sont pas."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-3-3" label="3.3 [Moyen] - Frais de port" type="python">
<Enonce>
### Frais de port

Écrire une fonction `frais_port(poids, express)` : `poids` est en kg (un flottant), `express` un booléen. Le tarif normal est de 5 € jusqu'à 1 kg, 8 € jusqu'à 5 kg et 12 € au-delà. L'envoi express coûte le double.

<Indices>
<Indice>

Fixer d'abord le tarif normal dans une variable, puis le doubler si besoin : deux étapes séparées.

</Indice>
<Indice>

`if express:` suffit, inutile d'écrire `== True`.

</Indice>
<Indice>

```text
FONCTION frais_port(poids, express)
    SI poids ≤ 1 ALORS prix ← 5
    SINON SI poids ≤ 5 ALORS prix ← 8
    SINON prix ← 12
    SI express ALORS prix ← prix × 2
    RENVOYER prix
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def frais_port(poids: float, express: bool) -> float:
    if poids <= 1:
        prix = 5
    elif poids <= 5:
        prix = 8
    else:
        prix = 12
    if express:
        prix = prix * 2
    return prix
```

</Correction>
</Enonce>
<Verification>

```python
assert frais_port(0.5, False) == 5 and frais_port(1, False) == 5, "Jusqu'à 1 kg : 5 €."
assert frais_port(1.2, False) == 8 and frais_port(5, False) == 8, "Jusqu'à 5 kg : 8 €."
assert frais_port(5.1, False) == 12, "Au-delà : 12 €."
assert frais_port(0.5, True) == 10 and frais_port(3, True) == 16 and frais_port(10, True) == 24, "Express : le double."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-3-4" label="3.4 [Moyen] - Jour suivant" type="python">
<Enonce>
### Jour suivant

Écrire une fonction `jour_suivant(jour)` qui renvoie le nom du jour qui suit `jour` (en minuscules) : `"lundi"` donne `"mardi"`, `"dimanche"` donne `"lundi"`.

Contrainte : sans liste.

<Indices>
<Indice>

Une suite de `if` / `elif` fonctionne, mais il existe plus court.

</Indice>
<Indice>

Le texte `" lundi mardi mercredi jeudi vendredi samedi dimanche lundi "` contient chaque jour suivi du suivant. `texte.find(mot)` donne la position d'un mot dans un texte.

</Indice>
<Indice>

```text
FONCTION jour_suivant(jour)
    SI jour = "lundi" ALORS RENVOYER "mardi"
    SINON SI jour = "mardi" ALORS RENVOYER "mercredi"
    …
    SINON SI jour = "samedi" ALORS RENVOYER "dimanche"
    SINON RENVOYER "lundi"
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def jour_suivant(jour: str) -> str:
    if jour == "lundi":
        return "mardi"
    elif jour == "mardi":
        return "mercredi"
    elif jour == "mercredi":
        return "jeudi"
    elif jour == "jeudi":
        return "vendredi"
    elif jour == "vendredi":
        return "samedi"
    elif jour == "samedi":
        return "dimanche"
    else:
        return "lundi"
```

</Correction>
</Enonce>
<Verification>

```python
jours = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"]
for i, j in enumerate(jours):
    assert jour_suivant(j) == jours[(i + 1) % 7], f"Après {j} : {jours[(i + 1) % 7]}."
assert "[" not in PROGRAMME, "Sans liste."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-4-1" label="4.1 [Difficile] - Comparer deux versions" type="python">
<Enonce>
### Comparer deux versions

Les versions d'un logiciel s'écrivent `"majeure.mineure"`, par exemple `"1.10"`. Attention : `"1.10"` est plus récente que `"1.9"`.

Écrire une fonction `comparer(v1, v2)` qui renvoie `-1` si `v1` est plus ancienne, `1` si elle est plus récente et `0` si les versions sont égales.

<Indices>
<Indice>

Comparer les textes directement est faux (`"1.10" < "1.9"`) : il faut comparer des nombres.

</Indice>
<Indice>

`v1.split(".")` sépare la majeure et la mineure ; `int(...)` les convertit.

</Indice>
<Indice>

Comparer d'abord les majeures. Les mineures ne départagent que si les majeures sont égales.

</Indice>
<Indice>

```text
FONCTION comparer(v1, v2)
    maj1, min1 ← entiers des deux parties de v1
    maj2, min2 ← entiers des deux parties de v2
    SI maj1 ≠ maj2 ALORS
        SI maj1 < maj2 ALORS RENVOYER -1 SINON RENVOYER 1
    SINON SI min1 ≠ min2 ALORS
        SI min1 < min2 ALORS RENVOYER -1 SINON RENVOYER 1
    RENVOYER 0
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def comparer(v1: str, v2: str) -> int:
    maj1, min1 = v1.split(".")
    maj2, min2 = v2.split(".")
    maj1, min1, maj2, min2 = int(maj1), int(min1), int(maj2), int(min2)
    if maj1 != maj2:
        if maj1 < maj2:
            return -1
        return 1
    if min1 != min2:
        if min1 < min2:
            return -1
        return 1
    return 0
```

</Correction>
</Enonce>
<Verification>

```python
assert comparer("1.9", "1.10") == -1 and comparer("1.10", "1.9") == 1, "1.10 est plus récente que 1.9."
assert comparer("2.0", "1.99") == 1 and comparer("0.5", "3.1") == -1, "La majeure décide d'abord."
assert comparer("4.2", "4.2") == 0, "Versions égales."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-4-2" label="4.2 [Difficile] - Main de blackjack" type="python">
<Enonce>
### Main de blackjack

Au blackjack, les cartes de 2 à 10 valent leur nombre, le valet, la dame et le roi (`"V"`, `"D"`, `"R"`) valent 10, et l'as (`"A"`) vaut 11 ou 1, au choix du joueur.

Écrire une fonction `valeur_main(c1, c2)` qui renvoie la meilleure valeur d'une main de deux cartes données sous forme de texte (`"7"`, `"R"`, `"A"`…), sans dépasser 21 si c'est possible.

Exemples : `"A"` et `"R"` valent 21 ; `"A"` et `"A"` valent 12.

<Indices>
<Indice>

Écrire d'abord une fonction auxiliaire `valeur_carte(c)` qui compte l'as pour 11.

</Indice>
<Indice>

Avec deux cartes, seul le cas de deux as dépasse 21 : un des deux as compte alors 1.

</Indice>
<Indice>

```text
FONCTION valeur_carte(c)
    SI c = "A" ALORS RENVOYER 11
    SINON SI c ∈ ("V", "D", "R") ALORS RENVOYER 10
    SINON RENVOYER entier(c)
FONCTION valeur_main(c1, c2)
    total ← valeur_carte(c1) + valeur_carte(c2)
    SI total > 21 ALORS total ← total - 10
    RENVOYER total
```

</Indice>
</Indices>

<Correction>

```python
def valeur_carte(c: str) -> int:
    if c == "A":
        return 11
    elif c == "V" or c == "D" or c == "R":
        return 10
    else:
        return int(c)


def valeur_main(c1: str, c2: str) -> int:
    total = valeur_carte(c1) + valeur_carte(c2)
    if total > 21:
        total = total - 10
    return total
```

</Correction>
</Enonce>
<Verification>

```python
assert valeur_main("A", "R") == 21 and valeur_main("R", "A") == 21, "As et roi : 21."
assert valeur_main("A", "A") == 12, "Deux as : 12."
assert valeur_main("7", "8") == 15 and valeur_main("10", "D") == 20, "7 + 8 et 10 + dame."
assert valeur_main("2", "A") == 13 and valeur_main("V", "9") == 19, "2 + as et valet + 9."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-4-3" label="4.3 [Difficile] - Heure bien écrite" type="python">
<Enonce>
### Heure bien écrite

Écrire une fonction `heure_valide(texte)` qui renvoie `True` si `texte` est une heure au format `"HH:MM"` : exactement 5 caractères, deux chiffres, `:`, deux chiffres, des heures de 00 à 23 et des minutes de 00 à 59.

<Indices>
<Indice>

Vérifier la forme avant les valeurs : convertir `"ab"` avec `int` provoquerait une erreur.

</Indice>
<Indice>

Une fois la forme validée, `int(texte[0:2])` et `int(texte[3:5])` donnent les heures et les minutes.

</Indice>
<Indice>

```text
FONCTION heure_valide(texte)
    SI longueur(texte) ≠ 5 OU texte[2] ≠ ":" ALORS RENVOYER FAUX
    SI texte[0:2] ou texte[3:5] ne sont pas que des chiffres ALORS RENVOYER FAUX
    RENVOYER entier(texte[0:2]) ≤ 23 ET entier(texte[3:5]) ≤ 59
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def heure_valide(texte: str) -> bool:
    if len(texte) != 5 or texte[2] != ":":
        return False
    if not texte[0:2].isdigit() or not texte[3:5].isdigit():
        return False
    return int(texte[0:2]) <= 23 and int(texte[3:5]) <= 59
```

</Correction>
</Enonce>
<Verification>

```python
for t in ["00:00", "23:59", "07:30", "12:05"]:
    assert heure_valide(t) is True, f"{t} est valide."
for t in ["24:00", "12:60", "7:30", "07h30", "ab:cd", "07:3", "", "123:45"]:
    assert heure_valide(t) is False, f"« {t} » est refusée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-4-4" label="4.4 [Difficile] - Déplacement du roi" type="python">
<Enonce>
### Déplacement du roi

Sur un échiquier, une case s'écrit avec une colonne de `a` à `h` et une ligne de `1` à `8`, par exemple `"e4"`. Le roi se déplace d'une case dans n'importe quelle direction.

Écrire une fonction `roi_peut_aller(depart, arrivee)` qui renvoie `True` si le roi peut aller de `depart` à `arrivee` en un coup (rester sur place n'est pas un coup).

<Indices>
<Indice>

`ord("e") - ord("a")` vaut 4 : `ord` transforme une lettre en nombre, ce qui permet de calculer un écart de colonnes.

</Indice>
<Indice>

Le coup est permis si l'écart de colonnes et l'écart de lignes valent au plus 1 en valeur absolue, sans être tous deux nuls.

</Indice>
<Indice>

```text
FONCTION roi_peut_aller(depart, arrivee)
    dc ← |ord(arrivee[0]) - ord(depart[0])|
    dl ← |entier(arrivee[1]) - entier(depart[1])|
    RENVOYER dc ≤ 1 ET dl ≤ 1 ET (dc, dl) ≠ (0, 0)
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def roi_peut_aller(depart: str, arrivee: str) -> bool:
    dc = abs(ord(arrivee[0]) - ord(depart[0]))
    dl = abs(int(arrivee[1]) - int(depart[1]))
    return dc <= 1 and dl <= 1 and (dc, dl) != (0, 0)
```

</Correction>
</Enonce>
<Verification>

```python
for a in ["d3", "d4", "d5", "e3", "e5", "f3", "f4", "f5"]:
    assert roi_peut_aller("e4", a) is True, f"De e4 à {a} : permis."
for a in ["e4", "e6", "c4", "g6", "e2"]:
    assert roi_peut_aller("e4", a) is False, f"De e4 à {a} : interdit."
assert roi_peut_aller("a1", "b2") is True and roi_peut_aller("h8", "a1") is False, "Dans les coins."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-5-1" label="5.1 [Expert] - Impôt progressif" type="python">
<Enonce>
### Impôt progressif

L'impôt sur le revenu est **progressif** : chaque tranche du revenu est taxée à son propre taux.

| Tranche du revenu | Taux |
|---|---|
| jusqu'à 11 294 € | 0 % |
| de 11 294 € à 28 797 € | 11 % |
| de 28 797 € à 82 341 € | 30 % |
| au-delà de 82 341 € | 41 % |

Écrire une fonction `impot(revenu)` qui renvoie l'impôt dû, arrondi à l'euro.

Exemple : pour 30 000 €, l'impôt vaut `(28797 - 11294) × 0,11 + (30000 - 28797) × 0,30`, soit 2286 €.

<Indices>
<Indice>

Erreur classique : appliquer le taux de la dernière tranche à **tout** le revenu. Seule la partie du revenu dans chaque tranche est taxée à son taux.

</Indice>
<Indice>

Partir de la tranche la plus haute : si le revenu la dépasse, taxer l'excédent puis ramener le revenu à la borne de la tranche, et ainsi de suite en descendant.

</Indice>
<Indice>

```text
FONCTION impot(revenu)
    total ← 0
    SI revenu > 82341 ALORS total ← total + (revenu - 82341) × 0,41 ; revenu ← 82341
    SI revenu > 28797 ALORS total ← total + (revenu - 28797) × 0,30 ; revenu ← 28797
    SI revenu > 11294 ALORS total ← total + (revenu - 11294) × 0,11
    RENVOYER arrondi(total)
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def impot(revenu: float) -> int:
    total = 0
    if revenu > 82341:
        total = total + (revenu - 82341) * 0.41
        revenu = 82341
    if revenu > 28797:
        total = total + (revenu - 28797) * 0.30
        revenu = 28797
    if revenu > 11294:
        total = total + (revenu - 11294) * 0.11
    return round(total)
```

</Correction>
</Enonce>
<Verification>

```python
assert impot(30000) == 2286, "30 000 € : 2286 €."
assert impot(10000) == 0 and impot(11294) == 0, "Sous 11 294 € : pas d'impôt."
assert impot(20000) == 958, "20 000 € : 958 €."
assert impot(100000) == 25229, "100 000 € : 25 229 €."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-5-2" label="5.2 [Expert] - Le lendemain" type="python">
<Enonce>
### Le lendemain

Écrire une fonction `lendemain(j, m, a)` qui renvoie le tuple `(jour, mois, annee)` du jour qui suit la date valide `j/m/a`, en tenant compte de la longueur des mois et des années bissextiles.

Exemples : `lendemain(28, 2, 2026)` renvoie `(1, 3, 2026)` ; `lendemain(31, 12, 2026)` renvoie `(1, 1, 2027)`.

<Indices>
<Indice>

Écrire d'abord une fonction `jours_dans_mois(m, a)` : c'est le cœur du problème.

</Indice>
<Indice>

Ajouter 1 au jour ; s'il dépasse la longueur du mois, passer au mois suivant ; si le mois dépasse 12, passer à l'année suivante.

</Indice>
<Indice>

```text
FONCTION jours_dans_mois(m, a)
    SI m = 2 ALORS RENVOYER 29 si a est bissextile, 28 sinon
    SI m ∈ (4, 6, 9, 11) ALORS RENVOYER 30
    RENVOYER 31
FONCTION lendemain(j, m, a)
    j ← j + 1
    SI j > jours_dans_mois(m, a) ALORS j ← 1 ; m ← m + 1
    SI m > 12 ALORS m ← 1 ; a ← a + 1
    RENVOYER (j, m, a)
```

</Indice>
</Indices>

<Correction>

```python
def jours_dans_mois(m: int, a: int) -> int:
    if m == 2:
        if (a % 4 == 0 and a % 100 != 0) or a % 400 == 0:
            return 29
        return 28
    if m == 4 or m == 6 or m == 9 or m == 11:
        return 30
    return 31


def lendemain(j: int, m: int, a: int) -> tuple:
    j = j + 1
    if j > jours_dans_mois(m, a):
        j = 1
        m = m + 1
    if m > 12:
        m = 1
        a = a + 1
    return (j, m, a)
```

</Correction>
</Enonce>
<Verification>

```python
assert lendemain(28, 2, 2026) == (1, 3, 2026), "28/02/2026 : 01/03/2026."
assert lendemain(28, 2, 2024) == (29, 2, 2024) and lendemain(29, 2, 2024) == (1, 3, 2024), "Février bissextile."
assert lendemain(31, 12, 2026) == (1, 1, 2027), "Passage à la nouvelle année."
assert lendemain(30, 4, 2026) == (1, 5, 2026) and lendemain(30, 5, 2026) == (31, 5, 2026), "Mois de 30 et 31 jours."
assert lendemain(28, 2, 1900) == (1, 3, 1900), "1900 n'est pas bissextile."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-5-3" label="5.3 [Expert] - Score au tennis" type="python">
<Enonce>
### Score au tennis

Dans un jeu de tennis, les points s'annoncent `0`, `15`, `30`, `40`. À partir de 3 points chacun, on annonce `"égalité"`, puis `"avantage joueur 1"` (ou 2) avec un point d'avance. Un joueur gagne le jeu avec au moins 4 points et 2 points d'écart.

Écrire une fonction `annonce(p1, p2)` qui reçoit le nombre de points gagnés par chaque joueur et renvoie l'annonce : `"15-0"`, `"40-30"`, `"égalité"`, `"avantage joueur 2"`, `"jeu joueur 1"`…

<Indices>
<Indice>

Traiter d'abord la fin du jeu (au moins 4 points et 2 d'écart), puis le cas où les deux ont au moins 3 points, enfin le score ordinaire.

</Indice>
<Indice>

Pour le score ordinaire, une fonction `nom_point(p)` traduit 0, 1, 2, 3 en `"0"`, `"15"`, `"30"`, `"40"`.

</Indice>
<Indice>

```text
FONCTION annonce(p1, p2)
    SI p1 ≥ 4 ET p1 - p2 ≥ 2 ALORS RENVOYER "jeu joueur 1"
    SI p2 ≥ 4 ET p2 - p1 ≥ 2 ALORS RENVOYER "jeu joueur 2"
    SI p1 ≥ 3 ET p2 ≥ 3 ALORS
        SI p1 = p2 ALORS RENVOYER "égalité"
        SI p1 > p2 ALORS RENVOYER "avantage joueur 1" SINON RENVOYER "avantage joueur 2"
    RENVOYER nom_point(p1) + "-" + nom_point(p2)
```

</Indice>
</Indices>

<Correction>

```python
def nom_point(p: int) -> str:
    if p == 0:
        return "0"
    elif p == 1:
        return "15"
    elif p == 2:
        return "30"
    return "40"


def annonce(p1: int, p2: int) -> str:
    if p1 >= 4 and p1 - p2 >= 2:
        return "jeu joueur 1"
    if p2 >= 4 and p2 - p1 >= 2:
        return "jeu joueur 2"
    if p1 >= 3 and p2 >= 3:
        if p1 == p2:
            return "égalité"
        if p1 > p2:
            return "avantage joueur 1"
        return "avantage joueur 2"
    return nom_point(p1) + "-" + nom_point(p2)
```

</Correction>
</Enonce>
<Verification>

```python
cas = [((0, 0), "0-0"), ((1, 0), "15-0"), ((3, 2), "40-30"), ((2, 3), "30-40"), ((3, 3), "égalité"), ((4, 3), "avantage joueur 1"),
       ((5, 6), "avantage joueur 2"), ((4, 2), "jeu joueur 1"), ((4, 0), "jeu joueur 1"), ((6, 8), "jeu joueur 2"), ((7, 7), "égalité")]
for (a, b), s in cas:
    assert annonce(a, b) == s, f"{a} points contre {b} : {s}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-5-4" label="5.4 [Expert] - Départager deux équipes" type="python">
<Enonce>
### Départager deux équipes

En championnat, deux équipes sont départagées par le nombre de points, puis par la différence de buts (buts marqués moins buts encaissés), puis par le nombre de buts marqués.

Écrire une fonction `devant(pts1, bp1, bc1, pts2, bp2, bc2)` qui renvoie `1` si l'équipe 1 est devant, `2` si c'est l'équipe 2, et `0` si rien ne les départage.

<Indices>
<Indice>

Chaque critère ne compte que si les précédents sont à égalité : enchaîner les tests dans l'ordre.

</Indice>
<Indice>

Calculer les deux différences de buts dans des variables avant de comparer.

</Indice>
<Indice>

```text
FONCTION devant(pts1, bp1, bc1, pts2, bp2, bc2)
    SI pts1 ≠ pts2 ALORS RENVOYER 1 si pts1 > pts2, 2 sinon
    d1 ← bp1 - bc1 ; d2 ← bp2 - bc2
    SI d1 ≠ d2 ALORS RENVOYER 1 si d1 > d2, 2 sinon
    SI bp1 ≠ bp2 ALORS RENVOYER 1 si bp1 > bp2, 2 sinon
    RENVOYER 0
```

</Indice>
</Indices>

<Correction>

```python
def devant(pts1: int, bp1: int, bc1: int, pts2: int, bp2: int, bc2: int) -> int:
    if pts1 != pts2:
        return 1 if pts1 > pts2 else 2
    d1 = bp1 - bc1
    d2 = bp2 - bc2
    if d1 != d2:
        return 1 if d1 > d2 else 2
    if bp1 != bp2:
        return 1 if bp1 > bp2 else 2
    return 0
```

</Correction>
</Enonce>
<Verification>

```python
assert devant(30, 20, 25, 28, 40, 10) == 1, "Plus de points : devant, même avec moins de buts."
assert devant(30, 20, 15, 30, 25, 18) == 2, "Points égaux : la différence de buts (+5 contre +7)."
assert devant(30, 22, 12, 30, 20, 10) == 1, "Même différence : le plus de buts marqués."
assert devant(30, 20, 10, 30, 20, 10) == 0, "Rien ne les départage."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-6-1" label="6.1 [Mini-projet] - Arbitre de Uno" type="python">
<Enonce>
### Arbitre de Uno

**Contexte.** Le club de jeux du lycée organise un tournoi de Uno en ligne. Il faut un **arbitre** informatique : à chaque coup, il vérifie qu'une carte peut être jouée, calcule qui joue ensuite (avec les cartes qui inversent le sens ou font passer un tour), combien de cartes piocher, et compte les points en fin de manche. Il propose aussi un coup aux joueurs débutants.

**Les cartes** sont des textes : une couleur (`R` rouge, `V` vert, `B` bleu, `J` jaune) suivie d'une valeur : un chiffre (`"R7"`), `+2` (`"B+2"`), `I` pour inversion (`"VI"`) ou `P` pour passe (`"JP"`). Les cartes noires n'ont pas de couleur : `"N"` (joker) et `"N+4"`. Après une carte noire, le joueur qui l'a posée choisit la **couleur active**.

**Les fonctions de l'arbitre**
- `couleur(carte)` et `valeur(carte)` : découpent une carte, pour que les autres fonctions n'aient pas à manipuler le texte. Renvoient la lettre de couleur (ou `None` pour une carte noire) et le reste du texte (`""` pour le joker).
- `peut_jouer(carte, dessus, couleur_active)` : refuse les coups interdits. Reçoit la carte proposée, la carte du dessus de la pile et la couleur active ; renvoie `True` si la carte est noire, ou si elle a la couleur active, ou si elle a la même valeur que la carte du dessus.
- `points(carte)` : sert au décompte de fin de manche (les cartes restées en main pénalisent). Renvoie la valeur du chiffre pour une carte numérotée, 20 pour `+2`, `I` et `P`, 50 pour une carte noire.
- `a_piocher(carte)` : indique au joueur suivant combien de cartes il doit prendre. Renvoie 2 pour un `+2`, 4 pour un `+4`, 0 sinon.
- `nouveau_sens(carte, sens)` : tient à jour le sens de la partie. Reçoit la carte posée et le sens (`1` ou `-1`) ; renvoie le sens après la carte (une inversion le change).
- `suivant(joueur, carte, sens, nb)` : désigne le prochain joueur. Reçoit le numéro du joueur qui vient de poser `carte` (de 0 à `nb - 1`), le sens **après** la carte et le nombre de joueurs ; renvoie le numéro du joueur suivant. Une carte passe, un `+2` ou un `+4` font sauter le joueur suivant ; à deux joueurs, une inversion aussi.
- `meilleur_coup(c1, c2, c3, dessus, couleur_active)` : le conseil donné aux débutants, qui ont trois cartes en main. Renvoie la carte **de couleur** jouable qui rapporte le plus de points (la première en cas d'égalité), pour s'en débarrasser ; s'il n'y en a pas, une carte noire jouable ; sinon `None` (il faut piocher).

<Indices>
<Indice>

Écrire les petites fonctions d'abord (`couleur`, `valeur`, `points`) : les suivantes les utilisent toutes.

</Indice>
<Indice>

Une carte noire se reconnaît à son premier caractère `"N"`. Pour `points`, `valeur(carte).isdigit()` distingue les cartes numérotées.

</Indice>
<Indice>

Pour `suivant`, calculer le nombre de pas (1 ou 2), puis `(joueur + pas × sens) % nb` : le modulo gère aussi le passage de 0 à `nb - 1` en sens inverse.

</Indice>
<Indice>

```text
(cœur du programme : le joueur suivant)
FONCTION suivant(joueur, carte, sens, nb)
    v ← valeur(carte)
    SI v ∈ ("P", "+2", "+4") OU (v = "I" ET nb = 2) ALORS pas ← 2
    SINON pas ← 1
    RENVOYER reste de (joueur + pas × sens) par nb
```

</Indice>
</Indices>

<Correction>

```python
def couleur(carte: str):
    if carte[0] == "N":
        return None
    return carte[0]


def valeur(carte: str) -> str:
    return carte[1:]


def peut_jouer(carte: str, dessus: str, couleur_active: str) -> bool:
    if couleur(carte) is None:
        return True
    return couleur(carte) == couleur_active or valeur(carte) == valeur(dessus)


def points(carte: str) -> int:
    if couleur(carte) is None:
        return 50
    if valeur(carte).isdigit():
        return int(valeur(carte))
    return 20


def a_piocher(carte: str) -> int:
    if valeur(carte) == "+2":
        return 2
    if valeur(carte) == "+4":
        return 4
    return 0


def nouveau_sens(carte: str, sens: int) -> int:
    if valeur(carte) == "I":
        return -sens
    return sens


def suivant(joueur: int, carte: str, sens: int, nb: int) -> int:
    v = valeur(carte)
    if v in ("P", "+2", "+4") or (v == "I" and nb == 2):
        pas = 2
    else:
        pas = 1
    return (joueur + pas * sens) % nb


def meilleur_coup(c1: str, c2: str, c3: str, dessus: str, couleur_active: str):
    choix = None
    if couleur(c1) is not None and peut_jouer(c1, dessus, couleur_active):
        choix = c1
    if couleur(c2) is not None and peut_jouer(c2, dessus, couleur_active) and (choix is None or points(c2) > points(choix)):
        choix = c2
    if couleur(c3) is not None and peut_jouer(c3, dessus, couleur_active) and (choix is None or points(c3) > points(choix)):
        choix = c3
    if choix is None:
        if couleur(c1) is None:
            choix = c1
        elif couleur(c2) is None:
            choix = c2
        elif couleur(c3) is None:
            choix = c3
    return choix
```

</Correction>
</Enonce>
<Verification>

```python
assert couleur("R7") == "R" and couleur("N+4") is None and couleur("N") is None, "Couleurs."
assert valeur("B+2") == "+2" and valeur("VI") == "I" and valeur("N") == "", "Valeurs."
assert peut_jouer("R3", "B3", "B") and peut_jouer("B9", "B3", "B") and peut_jouer("N+4", "R1", "R"), "Même valeur, même couleur, carte noire."
assert not peut_jouer("R5", "B3", "B") and peut_jouer("J+2", "R+2", "R") and peut_jouer("V2", "N", "V"), "Après un joker, c'est la couleur choisie qui compte."
assert not peut_jouer("R2", "N", "V"), "Après un joker vert, un rouge ne passe pas."
assert points("R7") == 7 and points("R0") == 0 and points("BP") == 20 and points("N") == 50, "Points."
assert a_piocher("V+2") == 2 and a_piocher("N+4") == 4 and a_piocher("R2") == 0, "Cartes à piocher."
assert nouveau_sens("JI", 1) == -1 and nouveau_sens("JI", -1) == 1 and nouveau_sens("J5", -1) == -1, "Sens du jeu."
assert suivant(0, "R5", 1, 4) == 1 and suivant(0, "R5", -1, 4) == 3, "Joueur suivant dans les deux sens."
assert suivant(2, "RP", 1, 4) == 0 and suivant(3, "N+4", 1, 4) == 1 and suivant(0, "B+2", -1, 4) == 2, "Les cartes qui sautent un joueur."
assert suivant(1, "VI", -1, 4) == 0 and suivant(0, "VI", -1, 2) == 0, "Inversion à 4, puis à 2 joueurs."
assert meilleur_coup("R2", "B+2", "R9", "R5", "R") == "R9", "La carte de couleur qui rapporte le plus."
assert meilleur_coup("B+2", "R2", "N", "B7", "B") == "B+2", "Une carte de couleur passe avant la carte noire."
assert meilleur_coup("V1", "N+4", "J3", "B7", "B") == "N+4" and meilleur_coup("V1", "J2", "J3", "B7", "B") is None, "Carte noire en dernier recours, sinon None."
assert meilleur_coup("R4", "B4", "V8", "J4", "J") == "R4", "Égalité : la première."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-cond-6-2" label="6.2 [Mini-projet] - Fiche de paie" type="python">
<Enonce>
### Fiche de paie

**Contexte.** L'association des parents d'élèves emploie quelques surveillants à temps partiel et souhaite éditer elle-même leurs fiches de paie, avec le prélèvement de l'impôt à la source. Le trésorier saisit le taux horaire, les heures du mois et la situation familiale ; le programme calcule toute la fiche. Les règles ci-dessous sont simplifiées mais suivent la logique réelle.

**Règles**
- Salaire brut mensuel : les 151,67 premières heures sont payées au taux horaire ; les heures suivantes, jusqu'à 186,67 h, sont majorées de 25 % ; au-delà, de 50 %.
- Cotisations sociales : 22 % du brut. Net = brut - cotisations.
- Parts fiscales : 1 pour une personne seule, 2 pour un couple (`"marie"` ou `"pacse"`), plus 0,5 part pour chacun des deux premiers enfants et 1 part par enfant à partir du troisième. Une personne seule avec au moins un enfant reçoit 0,5 part de plus.
- Impôt annuel : le revenu imposable est divisé par le nombre de parts ; l'impôt progressif est calculé sur ce quotient (0 % jusqu'à 11 294 €, 11 % jusqu'à 28 797 €, 30 % jusqu'à 82 341 €, 41 % jusqu'à 177 106 €, 45 % au-delà), puis multiplié par le nombre de parts.
- Revenu imposable annuel : 90 % du net annuel.

Exemple : un surveillant célibataire sans enfant, payé 25 € de l'heure, qui a travaillé 160 heures dans le mois.

**Les fonctions du logiciel de paie**
- `brut(taux, heures)` : la première ligne de la fiche. Reçoit le taux horaire et les heures du mois ; renvoie le salaire brut, arrondi au centime.
- `cotisations(brut_mensuel)` et `net(brut_mensuel)` : les lignes suivantes. Reçoivent le brut ; renvoient les cotisations et le salaire net, arrondis au centime.
- `parts(situation, enfants)` : traduit la situation familiale pour le calcul de l'impôt. Reçoit `"celibataire"`, `"marie"` ou `"pacse"` et le nombre d'enfants ; renvoie le nombre de parts.
- `impot_annuel(revenu_imposable, nb_parts)` : l'impôt d'une année entière. Renvoie un montant arrondi à l'euro.
- `taux_prelevement(net_mensuel, situation, enfants)` : le taux personnalisé imprimé sur la fiche. Renvoie l'impôt annuel divisé par le net annuel, en pourcentage arrondi au dixième.
- `fiche(taux, heures, situation, enfants)` : assemble la fiche du mois. Renvoie le tuple `(brut, net, prelevement, net_a_payer)`, le prélèvement étant le net multiplié par le taux, arrondi au centime.

<Indices>
<Indice>

Chaque règle devient une fonction ; `fiche` ne fait qu'assembler les autres. Tester chaque fonction séparément avant d'écrire la suivante.

</Indice>
<Indice>

Pour le brut, découper les heures en trois tranches : `min(heures, 151.67)`, puis ce qui dépasse jusqu'à 186,67, puis le reste. Une tranche négative vaut 0 : `max(0, …)`.

</Indice>
<Indice>

L'impôt progressif se calcule tranche par tranche, du haut vers le bas, comme dans l'exercice sur l'impôt.

</Indice>
<Indice>

```text
(cœur du programme : l'impôt avec le quotient familial)
FONCTION impot_annuel(revenu, nb_parts)
    q ← revenu / nb_parts ; total ← 0
    SI q > 177106 ALORS total ← total + (q - 177106) × 0,45 ; q ← 177106
    SI q > 82341 ALORS total ← total + (q - 82341) × 0,41 ; q ← 82341
    SI q > 28797 ALORS total ← total + (q - 28797) × 0,30 ; q ← 28797
    SI q > 11294 ALORS total ← total + (q - 11294) × 0,11
    RENVOYER arrondi(total × nb_parts)
```

</Indice>
</Indices>

<Correction>

```python
def brut(taux: float, heures: float) -> float:
    normales = min(heures, 151.67)
    a_25 = max(0, min(heures, 186.67) - 151.67)
    a_50 = max(0, heures - 186.67)
    return round(taux * (normales + 1.25 * a_25 + 1.5 * a_50), 2)


def cotisations(brut_mensuel: float) -> float:
    return round(brut_mensuel * 0.22, 2)


def net(brut_mensuel: float) -> float:
    return round(brut_mensuel - cotisations(brut_mensuel), 2)


def parts(situation: str, enfants: int) -> float:
    p = 2 if situation in ("marie", "pacse") else 1
    if enfants >= 1 and p == 1:
        p = p + 0.5
    p = p + 0.5 * min(enfants, 2) + max(0, enfants - 2)
    return p


def impot_annuel(revenu_imposable: float, nb_parts: float) -> int:
    q = revenu_imposable / nb_parts
    total = 0
    if q > 177106:
        total = total + (q - 177106) * 0.45
        q = 177106
    if q > 82341:
        total = total + (q - 82341) * 0.41
        q = 82341
    if q > 28797:
        total = total + (q - 28797) * 0.30
        q = 28797
    if q > 11294:
        total = total + (q - 11294) * 0.11
    return round(total * nb_parts)


def taux_prelevement(net_mensuel: float, situation: str, enfants: int) -> float:
    annuel = net_mensuel * 12
    return round(impot_annuel(annuel * 0.9, parts(situation, enfants)) / annuel * 100, 1)


def fiche(taux: float, heures: float, situation: str, enfants: int) -> tuple:
    b = brut(taux, heures)
    n = net(b)
    prelevement = round(n * taux_prelevement(n, situation, enfants) / 100, 2)
    return (b, n, prelevement, round(n - prelevement, 2))
```

</Correction>
</Enonce>
<Verification>

```python
assert brut(12, 151.67) == 1820.04 and brut(12, 100) == 1200, "Sans heures supplémentaires."
assert brut(20, 170) == round(20 * (151.67 + 1.25 * 18.33), 2) and brut(10, 200) == round(10 * (151.67 + 1.25 * 35 + 1.5 * 13.33), 2), "Heures majorées à 25 % puis 50 %."
assert cotisations(2000) == 440 and net(2000) == 1560, "Cotisations et net."
assert parts("celibataire", 0) == 1 and parts("marie", 0) == 2 and parts("pacse", 2) == 3, "Parts sans enfant ou avec deux."
assert parts("marie", 3) == 4 and parts("celibataire", 1) == 2 and parts("celibataire", 3) == 3.5, "Troisième enfant ; parent seul."
assert impot_annuel(10000, 1) == 0 and impot_annuel(30000, 1) == 2286, "Impôt d'une personne seule."
assert impot_annuel(60000, 2) == 2 * 2286, "Couple : le quotient familial divise le revenu par deux."
assert impot_annuel(200000, 1) == round((200000 - 177106) * 0.45 + (177106 - 82341) * 0.41 + (82341 - 28797) * 0.30 + (28797 - 11294) * 0.11), "Toutes les tranches."
assert taux_prelevement(1000, "celibataire", 0) == 0 and taux_prelevement(3000, "celibataire", 0) == round(impot_annuel(32400, 1) / 36000 * 100, 1), "Taux de prélèvement."
assert taux_prelevement(3000, "marie", 2) < taux_prelevement(3000, "celibataire", 0), "Plus de parts : taux plus bas."
b, n, p, a = fiche(25, 160, "celibataire", 0)
assert b == brut(25, 160) and n == net(b) and p == round(n * taux_prelevement(n, "celibataire", 0) / 100, 2) and a == round(n - p, 2), "Fiche complète."
assert fiche(11, 151.67, "marie", 1)[2] == 0, "Petit salaire d'un couple : pas de prélèvement."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
