---
title: 'Révision : variables, conditions, boucles, fonctions'
description: 'Les bases de Python reprises point par point, avec un rappel de cours à côté de chaque exercice.'
icon: "repeat"
chapter: Introduction à Python
badgeId: revision-bases-python
meta: 'Variables, conditions, boucles et fonctions : 20 exercices pour réviser'
level: premiere
prerequisites:
  - python_exercices_conditions
  - python_exercices_boucles
  - python_exercices_fonctions
audience: public
groupe: revision-python
groupeTitre: "Révisions"
---

Cette fiche reprend les bases de Python dans l'ordre du cours : **variables**, **conditions**, **boucles**, puis **fonctions**.
Dans chaque partie, les exercices vont du plus simple au plus complet. Un post-it à côté de l'énoncé rappelle le point de cours utile.
Chaque exercice propose aussi des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="revision-bases-python" courseTitle="Révision : variables, conditions, boucles, fonctions">

<ExerciseSection id="1nsi-revbases-1-1" label="1.1 [Variables] - Affecter et afficher" type="python">
<Enonce>
### Affecter et afficher

Créer la variable `nom`, qui contient le texte `"Goupil"`, et la variable `age`, qui contient l'entier `4`.
Afficher ensuite la phrase `Goupil a 4 ans` en utilisant ces deux variables : le texte `"Goupil"` n'est écrit qu'une seule fois dans le programme.

<PostIt>

- `variable = valeur` : range la valeur dans la variable (affectation)
- le nom est à gauche du `=`, la valeur à droite
- un texte s'écrit entre guillemets : `"Goupil"` ; un nombre sans guillemets : `4`
- `print(a, b, c)` affiche les valeurs séparées par un espace

</PostIt>

<Indices>
<Indice>

`print(nom, "a", age, "ans")` place un espace entre chaque morceau.

</Indice>
<Indice>

Écrire `print("Goupil a 4 ans")` afficherait la bonne phrase, mais sans se servir des variables.

</Indice>
<Indice>

```text
nom ← "Goupil"
age ← 4
AFFICHER nom, "a", age, "ans"
```

</Indice>
</Indices>

<Correction>

```python
nom = "Goupil"
age = 4
print(nom, "a", age, "ans")
```

</Correction>
</Enonce>
<Verification>

```python
assert nom == "Goupil", "nom contient le texte 'Goupil'."
assert age == 4 and type(age) == int, "age contient l'entier 4 (sans guillemets)."
assert SORTIE.strip() == "Goupil a 4 ans", "Le programme affiche « Goupil a 4 ans »."
assert PROGRAMME.count("Goupil") == 1, "Écrire 'Goupil' une seule fois : afficher la variable nom."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-1-2" label="1.2 [Variables] - Types et conversions" type="python">
<Enonce>
### Types et conversions

La variable `texte` est déjà écrite dans l'éditeur : `texte = "17"`. Elle contient un texte, pas un nombre.

1. Ranger dans `nombre` l'entier obtenu à partir de `texte`.
2. Ranger dans `double` le double de `nombre`.
3. Ranger dans `message` le texte `"Le double vaut 34"`, construit à partir de `double`, puis afficher `message`.

<PostIt>

- `type(x)` : le type de `x` (`int`, `float`, `str`, `bool`)
- `int("17")` → `17` ; `float("2.5")` → `2.5` ; `str(34)` → `"34"`
- `"17" * 2` → `"1717"` : un texte répété, pas un calcul
- `"Le double vaut " + "34"` : `+` colle deux textes ; texte `+` nombre provoque une erreur

</PostIt>

<Indices>
<Indice>

`int(texte)` transforme le texte `"17"` en entier `17`.

</Indice>
<Indice>

Pour coller `double` à la fin d'un texte, il faut d'abord le convertir : `str(double)`.

</Indice>
<Indice>

```text
nombre ← entier(texte)
double ← nombre × 2
message ← "Le double vaut " + texte(double)
AFFICHER message
```

</Indice>
</Indices>

<Correction>

```python
texte = "17"
nombre = int(texte)
double = nombre * 2
message = "Le double vaut " + str(double)
print(message)
```

</Correction>
</Enonce>
<CodeDepart>

```python
texte = "17"
```

</CodeDepart>
<Verification>

```python
assert nombre == 17 and type(nombre) == int, "nombre est l'entier 17 : int(texte)."
assert double == 34, "double vaut 34."
assert message == "Le double vaut 34", "message vaut 'Le double vaut 34'."
assert "str(" in PROGRAMME, "Convertir double en texte avec str."
assert "34" not in PROGRAMME, "Calculer 34 plutôt que l'écrire."
assert SORTIE.strip() == "Le double vaut 34", "Afficher message."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-1-3" label="1.3 [Variables] - Heures, minutes, secondes" type="python">
<Enonce>
### Heures, minutes, secondes

La première ligne, déjà dans l'éditeur, demande une durée en secondes :

```python
secondes = int(input("Durée en secondes : "))
```

Calculer `heures`, `minutes` et `reste` (les secondes qui restent), puis afficher la durée sous la forme `1 h 6 min 40 s` (pour 4000 secondes).

<PostIt>

- `17 / 5` → `3.4` : division décimale
- `17 // 5` → `3` : quotient entier
- `17 % 5` → `2` : reste de la division
- `2 ** 3` → `8` : puissance
- une heure fait 3600 secondes, une minute 60

</PostIt>

<Indices>
<Indice>

`secondes // 3600` donne le nombre d'heures entières.

</Indice>
<Indice>

`secondes % 3600` donne les secondes qui restent après les heures : il reste à les découper en minutes et secondes.

</Indice>
<Indice>

```text
heures ← secondes // 3600
minutes ← (secondes % 3600) // 60
reste ← secondes % 60
AFFICHER heures, "h", minutes, "min", reste, "s"
```

</Indice>
</Indices>

<Correction>

```python
secondes = int(input("Durée en secondes : "))
heures = secondes // 3600
minutes = (secondes % 3600) // 60
reste = secondes % 60
print(heures, "h", minutes, "min", reste, "s")
```

</Correction>
</Enonce>
<CodeDepart>

```python
secondes = int(input("Durée en secondes : "))
```

</CodeDepart>
<Verification>

```python
ENTREES = ["4000"]
assert (heures, minutes, reste) == (1, 6, 40), "4000 s : 1 h 6 min 40 s."
assert SORTIE.strip().splitlines()[-1] == "1 h 6 min 40 s", "Afficher « 1 h 6 min 40 s »."
for duree, attendu in [(59, (0, 0, 59)), (3600, (1, 0, 0)), (7322, (2, 2, 2)), (0, (0, 0, 0))]:
    autre, _ = relancer([str(duree)])
    assert (autre["heures"], autre["minutes"], autre["reste"]) == attendu, f"{duree} s : {attendu[0]} h {attendu[1]} min {attendu[2]} s."
assert "//" in PROGRAMME and "%" in PROGRAMME, "Utiliser // et %."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-1-4" label="1.4 [Variables] - Faire tourner trois variables" type="python">
<Enonce>
### Faire tourner trois variables

Les trois premières lignes, déjà dans l'éditeur, demandent trois entiers `a`, `b` et `c`.

Faire tourner leurs valeurs : `a` prend la valeur de `b`, `b` celle de `c`, et `c` l'ancienne valeur de `a`. Afficher ensuite `a`, `b` et `c`.

Exemple : avec 1, 2 et 3, le programme affiche `2 3 1`.

<PostIt>

- `a = b` copie la valeur de `b` dans `a` : l'ancienne valeur de `a` est perdue
- pour échanger deux variables, garder l'ancienne valeur dans une variable de côté :

```python
temp = a
a = b
b = temp
```

- en Python, `a, b = b, a` fait l'échange en une ligne

</PostIt>

<Indices>
<Indice>

Commencer par mettre `a` de côté : c'est la seule valeur écrasée avant d'être recopiée.

</Indice>
<Indice>

L'ordre compte : `a = b`, puis `b = c`, puis `c` reçoit la valeur mise de côté.

</Indice>
<Indice>

```text
temp ← a
a ← b
b ← c
c ← temp
AFFICHER a, b, c
```

</Indice>
</Indices>

<Correction>

```python
a = int(input("a : "))
b = int(input("b : "))
c = int(input("c : "))
temp = a
a = b
b = c
c = temp
print(a, b, c)
```

</Correction>
</Enonce>
<CodeDepart>

```python
a = int(input("a : "))
b = int(input("b : "))
c = int(input("c : "))
```

</CodeDepart>
<Verification>

```python
ENTREES = ["1", "2", "3"]
assert (a, b, c) == (2, 3, 1), "Avec 1, 2, 3 : a = 2, b = 3, c = 1."
assert SORTIE.strip().splitlines()[-1] == "2 3 1", "Afficher a, b et c : « 2 3 1 »."
autre, _ = relancer(["7", "-4", "10"])
assert (autre["a"], autre["b"], autre["c"]) == (-4, 10, 7), "Avec 7, -4, 10 : a = -4, b = 10, c = 7."
assert PROGRAMME.count("input(") == 3, "Garder les trois saisies de départ, sans en ajouter."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-1-5" label="1.5 [Variables] - Mettre un score à jour" type="python">
<Enonce>
### Mettre un score à jour

La variable `points` vaut 0 au début de la partie (ligne déjà dans l'éditeur). Sans réécrire `points = ...`, mettre le score à jour dans cet ordre :

1. gagner 10 points ;
2. en perdre 3 ;
3. doubler le score ;
4. gagner encore 1 point.

Afficher enfin `Score : 15`, en utilisant la variable `points`.

<PostIt>

- `x = x + 1` : calcule `x + 1` avec l'ancienne valeur, puis range le résultat dans `x`
- `x += 1` : même chose, en plus court
- `x -= 3` ; `x *= 2` ; `x /= 2` fonctionnent de la même façon

</PostIt>

<Indices>
<Indice>

`points += 10` ajoute 10 au score.

</Indice>
<Indice>

Doubler : `points *= 2`.

</Indice>
<Indice>

```text
points ← points + 10
points ← points - 3
points ← points × 2
points ← points + 1
AFFICHER "Score :", points
```

</Indice>
</Indices>

<Correction>

```python
points = 0
points += 10
points -= 3
points *= 2
points += 1
print("Score :", points)
```

</Correction>
</Enonce>
<CodeDepart>

```python
points = 0
```

</CodeDepart>
<Verification>

```python
code = PROGRAMME.replace(" ", "")
assert points == 15, "Le score final vaut 15."
assert "+=" in code and "-=" in code and "*=" in code, "Utiliser +=, -= et *=."
assert code.count("points=") == 1, "Ne pas réécrire points = ... : le mettre à jour."
assert "15" not in code, "Calculer 15 plutôt que l'écrire."
assert SORTIE.strip() == "Score : 15", "Afficher « Score : 15 »."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-2-1" label="2.1 [Conditions] - Tarif selon l'âge" type="python">
<Enonce>
### Tarif selon l'âge

La première ligne, déjà dans l'éditeur, demande un âge. Au cinéma, une place coûte 5 € avant 12 ans et 9 € à partir de 12 ans.

Ranger le prix dans `tarif`, puis afficher `Tarif : 5 €` (ou `Tarif : 9 €`).

<PostIt>

```python
if condition:
    ...   # si la condition est vraie
else:
    ...   # sinon
```

- deux-points à la fin de `if` et `else`, bloc décalé de 4 espaces
- comparaisons : `<` `<=` `>` `>=` `==` `!=`
- `=` range une valeur, `==` compare deux valeurs

</PostIt>

<Indices>
<Indice>

« Avant 12 ans » s'écrit `age < 12`.

</Indice>
<Indice>

`tarif` reçoit une valeur dans chacun des deux blocs ; l'affichage se fait après, une seule fois.

</Indice>
<Indice>

```text
SI age < 12 ALORS
    tarif ← 5
SINON
    tarif ← 9
AFFICHER "Tarif :", tarif, "€"
```

</Indice>
</Indices>

<Correction>

```python
age = int(input("Âge : "))
if age < 12:
    tarif = 5
else:
    tarif = 9
print("Tarif :", tarif, "€")
```

</Correction>
</Enonce>
<CodeDepart>

```python
age = int(input("Âge : "))
```

</CodeDepart>
<Verification>

```python
ENTREES = ["10"]
assert tarif == 5, "10 ans : 5 €."
assert SORTIE.strip().splitlines()[-1] == "Tarif : 5 €", "Afficher « Tarif : 5 € »."
for a, t in [(12, 9), (11, 5), (0, 5), (45, 9)]:
    autre, _ = relancer([str(a)])
    assert autre["tarif"] == t, f"{a} ans : {t} €."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-2-2" label="2.2 [Conditions] - Mention au bac" type="python">
<Enonce>
### Mention au bac

La première ligne, déjà dans l'éditeur, demande une note sur 20 (à virgule possible). Ranger dans `mention` :

- `"Très bien"` à partir de 16 ;
- `"Bien"` à partir de 14 ;
- `"Assez bien"` à partir de 12 ;
- `"Passable"` à partir de 10 ;
- `"Insuffisant"` en dessous de 10.

Afficher ensuite `mention`.

<PostIt>

```python
if condition1:
    ...
elif condition2:
    ...
else:
    ...
```

- les conditions sont testées dans l'ordre : seul le premier bloc vrai s'exécute
- `elif` n'est testé que si toutes les conditions au-dessus sont fausses
- `else` n'a pas de condition : c'est le cas restant

</PostIt>

<Indices>
<Indice>

Commencer par la mention la plus haute : `if note >= 16:`.

</Indice>
<Indice>

Arrivé au `elif note >= 14:`, la note est forcément inférieure à 16 : inutile de l'écrire.

</Indice>
<Indice>

```text
SI note >= 16 ALORS mention ← "Très bien"
SINON SI note >= 14 ALORS mention ← "Bien"
SINON SI note >= 12 ALORS mention ← "Assez bien"
SINON SI note >= 10 ALORS mention ← "Passable"
SINON mention ← "Insuffisant"
AFFICHER mention
```

</Indice>
</Indices>

<Correction>

```python
note = float(input("Note : "))
if note >= 16:
    mention = "Très bien"
elif note >= 14:
    mention = "Bien"
elif note >= 12:
    mention = "Assez bien"
elif note >= 10:
    mention = "Passable"
else:
    mention = "Insuffisant"
print(mention)
```

</Correction>
</Enonce>
<CodeDepart>

```python
note = float(input("Note : "))
```

</CodeDepart>
<Verification>

```python
ENTREES = ["13.5"]
assert mention == "Assez bien", "13,5 : Assez bien."
assert SORTIE.strip().splitlines()[-1] == "Assez bien", "Afficher mention."
for n, m in [("16", "Très bien"), ("20", "Très bien"), ("15.5", "Bien"), ("14", "Bien"), ("12", "Assez bien"), ("10", "Passable"), ("9.5", "Insuffisant"), ("0", "Insuffisant")]:
    autre, _ = relancer([n])
    assert autre["mention"] == m, f"{n} : {m}."
assert "elif" in PROGRAMME, "Enchaîner les cas avec elif."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-2-3" label="2.3 [Conditions] - Année bissextile" type="python">
<Enonce>
### Année bissextile

La première ligne, déjà dans l'éditeur, demande une année. Une année est bissextile si elle est divisible par 4 mais pas par 100, ou si elle est divisible par 400.

Ranger dans `bissextile` le booléen `True` ou `False`, en une seule condition écrite avec `and` et `or`. Afficher `bissextile`.

Exemples : 2024 et 2000 sont bissextiles, 1900 et 2023 ne le sont pas.

<PostIt>

- `a and b` : vrai si les deux sont vrais
- `a or b` : vrai si au moins un des deux est vrai
- `not a` : l'inverse de `a`
- « `n` divisible par 4 » s'écrit `n % 4 == 0`
- une comparaison vaut déjà `True` ou `False` : `ok = n > 0` range un booléen

</PostIt>

<Indices>
<Indice>

« Divisible par 4 mais pas par 100 » : `annee % 4 == 0 and annee % 100 != 0`.

</Indice>
<Indice>

Des parenthèses autour de la première partie rendent la condition plus lisible avant le `or`.

</Indice>
<Indice>

```text
bissextile ← (annee divisible par 4 ET annee non divisible par 100) OU annee divisible par 400
AFFICHER bissextile
```

</Indice>
</Indices>

<Correction>

```python
annee = int(input("Année : "))
bissextile = (annee % 4 == 0 and annee % 100 != 0) or annee % 400 == 0
print(bissextile)
```

</Correction>
</Enonce>
<CodeDepart>

```python
annee = int(input("Année : "))
```

</CodeDepart>
<Verification>

```python
ENTREES = ["2024"]
assert bissextile is True, "2024 est bissextile : bissextile vaut True (un booléen, pas un texte)."
assert SORTIE.strip().splitlines()[-1] == "True", "Afficher bissextile."
for an, b in [(2023, False), (1900, False), (2000, True), (2100, False), (1996, True)]:
    autre, _ = relancer([str(an)])
    assert autre["bissextile"] is b, f"{an} : {b}."
assert " and " in PROGRAMME and " or " in PROGRAMME, "Écrire la condition avec and et or."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-2-4" label="2.4 [Conditions] - Sorte de triangle" type="python">
<Enonce>
### Sorte de triangle

Les trois premières lignes, déjà dans l'éditeur, demandent les longueurs `a`, `b` et `c` des côtés d'un triangle. Ranger dans `sorte` :

- `"équilatéral"` si les trois côtés sont égaux ;
- `"isocèle"` si exactement deux côtés sont égaux ;
- `"quelconque"` sinon.

Afficher ensuite `sorte`.

<PostIt>

- `a == b == c` : vrai si les trois valeurs sont égales
- `a == b or b == c or a == c` : vrai si au moins deux sont égales
- l'ordre des tests compte : un triangle équilatéral a aussi deux côtés égaux, il faut le tester en premier

</PostIt>

<Indices>
<Indice>

Tester d'abord le cas « trois côtés égaux ».

</Indice>
<Indice>

Pour « deux côtés égaux », il y a trois paires à comparer : `a` et `b`, `b` et `c`, `a` et `c`.

</Indice>
<Indice>

```text
SI a = b = c ALORS sorte ← "équilatéral"
SINON SI a = b OU b = c OU a = c ALORS sorte ← "isocèle"
SINON sorte ← "quelconque"
AFFICHER sorte
```

</Indice>
</Indices>

<Correction>

```python
a = float(input("a : "))
b = float(input("b : "))
c = float(input("c : "))
if a == b == c:
    sorte = "équilatéral"
elif a == b or b == c or a == c:
    sorte = "isocèle"
else:
    sorte = "quelconque"
print(sorte)
```

</Correction>
</Enonce>
<CodeDepart>

```python
a = float(input("a : "))
b = float(input("b : "))
c = float(input("c : "))
```

</CodeDepart>
<Verification>

```python
ENTREES = ["3", "4", "5"]
assert sorte == "quelconque", "3, 4, 5 : quelconque."
for cotes, s in [(("3", "3", "3"), "équilatéral"), (("3", "3", "5"), "isocèle"), (("5", "3", "3"), "isocèle"), (("3", "5", "3"), "isocèle"), (("2", "7", "6"), "quelconque")]:
    autre, _ = relancer(list(cotes))
    assert autre["sorte"] == s, f"{', '.join(cotes)} : {s}."
assert SORTIE.strip().splitlines()[-1] == "quelconque", "Afficher sorte."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-2-5" label="2.5 [Conditions] - Frais de livraison" type="python">
<Enonce>
### Frais de livraison

Les deux premières lignes, déjà dans l'éditeur, demandent le `montant` d'une commande et si le client est `adherent` (réponse `"oui"` ou `"non"`). Ranger dans `frais` le prix de la livraison :

- 0 € pour un adhérent, quel que soit le montant ;
- pour les autres : 0 € à partir de 50 €, 3 € à partir de 25 €, 6 € en dessous.

Afficher ensuite `Frais : 3 €` (par exemple).

<PostIt>

Une condition peut se placer dans le bloc d'une autre :

```python
if adherent == "oui":
    ...
else:
    if montant >= 50:
        ...
```

- le bloc intérieur est décalé de 8 espaces
- il n'est testé que si la condition extérieure le permet
- comparer un texte : `reponse == "oui"` (guillemets, minuscules)

</PostIt>

<Indices>
<Indice>

Le cas de l'adhérent se règle en premier : pour lui, le montant ne compte pas.

</Indice>
<Indice>

Dans le `else`, les trois paliers de montant forment un `if` / `elif` / `else`.

</Indice>
<Indice>

```text
SI adherent = "oui" ALORS
    frais ← 0
SINON
    SI montant >= 50 ALORS frais ← 0
    SINON SI montant >= 25 ALORS frais ← 3
    SINON frais ← 6
AFFICHER "Frais :", frais, "€"
```

</Indice>
</Indices>

<Correction>

```python
montant = float(input("Montant : "))
adherent = input("Adhérent (oui/non) : ")
if adherent == "oui":
    frais = 0
else:
    if montant >= 50:
        frais = 0
    elif montant >= 25:
        frais = 3
    else:
        frais = 6
print("Frais :", frais, "€")
```

</Correction>
</Enonce>
<CodeDepart>

```python
montant = float(input("Montant : "))
adherent = input("Adhérent (oui/non) : ")
```

</CodeDepart>
<Verification>

```python
ENTREES = ["30", "non"]
assert frais == 3, "30 €, non adhérent : 3 €."
assert SORTIE.strip().splitlines()[-1] == "Frais : 3 €", "Afficher « Frais : 3 € »."
for m, ad, f in [("10", "oui", 0), ("60", "non", 0), ("50", "non", 0), ("24.99", "non", 6), ("25", "non", 3), ("49.5", "oui", 0)]:
    autre, _ = relancer([m, ad])
    assert autre["frais"] == f, f"{m} €, adhérent : {ad} → {f} €."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-3-1" label="3.1 [Boucles] - Compte à rebours" type="python">
<Enonce>
### Compte à rebours

La première ligne, déjà dans l'éditeur, demande un entier `n`. Afficher les nombres de `n` à 1, un par ligne, puis `Décollage !`.

Exemple avec 3 :

```
3
2
1
Décollage !
```

<PostIt>

- `for i in range(5):` → `i` vaut 0, 1, 2, 3, 4 (5 exclu)
- `range(2, 6)` → 2, 3, 4, 5
- `range(10, 0, -2)` → 10, 8, 6, 4, 2 : le troisième nombre est le pas
- le nombre de fin n'est jamais atteint

</PostIt>

<Indices>
<Indice>

Pour compter à l'envers, le pas vaut `-1`.

</Indice>
<Indice>

La fin est exclue : pour s'arrêter à 1, il faut écrire 0 comme fin.

</Indice>
<Indice>

```text
POUR i ALLANT DE n À 1 (en descendant)
    AFFICHER i
AFFICHER "Décollage !"
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Départ : "))
for i in range(n, 0, -1):
    print(i)
print("Décollage !")
```

</Correction>
</Enonce>
<CodeDepart>

```python
n = int(input("Départ : "))
```

</CodeDepart>
<Verification>

```python
ENTREES = ["5"]
assert SORTIE.strip().splitlines()[-6:] == ["5", "4", "3", "2", "1", "Décollage !"], "Avec 5 : 5, 4, 3, 2, 1 puis « Décollage ! »."
_, sortie = relancer(["3"])
assert sortie.strip().splitlines()[-4:] == ["3", "2", "1", "Décollage !"], "Avec 3 : 3, 2, 1 puis « Décollage ! »."
_, sortie = relancer(["1"])
assert sortie.strip().splitlines()[-2:] == ["1", "Décollage !"], "Avec 1 : 1 puis « Décollage ! »."
assert "for " in PROGRAMME and "range(" in PROGRAMME, "Utiliser une boucle for avec range."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-3-2" label="3.2 [Boucles] - Somme des carrés" type="python">
<Enonce>
### Somme des carrés

La première ligne, déjà dans l'éditeur, demande un entier `n`. Ranger dans `total` la somme des carrés des entiers de 1 à `n`, puis afficher `total`.

Exemple : avec 4, `total` vaut 1 + 4 + 9 + 16 = 30.

<PostIt>

Accumuler des valeurs dans une boucle :

```python
total = 0
for i in range(1, n + 1):
    total = total + i
```

- la variable `total` démarre avant la boucle
- elle grandit à chaque tour
- `range(1, n + 1)` va de 1 à `n` compris

</PostIt>

<Indices>
<Indice>

Le carré de `i` s'écrit `i * i` ou `i ** 2`.

</Indice>
<Indice>

L'affichage se fait après la boucle, une seule fois.

</Indice>
<Indice>

```text
total ← 0
POUR i ALLANT DE 1 À n
    total ← total + i²
AFFICHER total
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("n : "))
total = 0
for i in range(1, n + 1):
    total = total + i ** 2
print(total)
```

</Correction>
</Enonce>
<CodeDepart>

```python
n = int(input("n : "))
```

</CodeDepart>
<Verification>

```python
ENTREES = ["4"]
assert total == 30, "Avec 4 : 1 + 4 + 9 + 16 = 30."
assert SORTIE.strip().splitlines()[-1] == "30", "Afficher total."
for v, t in [(1, 1), (10, 385), (0, 0), (3, 14)]:
    autre, _ = relancer([str(v)])
    assert autre["total"] == t, f"Avec {v} : {t}."
assert "for " in PROGRAMME, "Calculer la somme avec une boucle for."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-3-3" label="3.3 [Boucles] - Compter les voyelles" type="python">
<Enonce>
### Compter les voyelles

La première ligne, déjà dans l'éditeur, demande un mot écrit en minuscules et sans accent. Ranger dans `nb_voyelles` le nombre de voyelles du mot (a, e, i, o, u, y), puis afficher `nb_voyelles`.

Contrainte : sans la méthode `count`.

<PostIt>

- `for lettre in mot:` → `lettre` prend chaque caractère du mot, dans l'ordre
- `lettre in "aeiouy"` : vrai si la lettre fait partie du texte
- un compteur démarre à 0 avant la boucle et augmente de 1 quand la condition est vraie : `compteur += 1`

</PostIt>

<Indices>
<Indice>

Dans la boucle, un `if` décide si la lettre en cours compte.

</Indice>
<Indice>

`if lettre in "aeiouy":` évite d'écrire six comparaisons.

</Indice>
<Indice>

```text
nb_voyelles ← 0
POUR CHAQUE lettre DE mot
    SI lettre est dans "aeiouy" ALORS nb_voyelles ← nb_voyelles + 1
AFFICHER nb_voyelles
```

</Indice>
</Indices>

<Correction>

```python
mot = input("Mot : ")
nb_voyelles = 0
for lettre in mot:
    if lettre in "aeiouy":
        nb_voyelles += 1
print(nb_voyelles)
```

</Correction>
</Enonce>
<CodeDepart>

```python
mot = input("Mot : ")
```

</CodeDepart>
<Verification>

```python
ENTREES = ["renard"]
assert nb_voyelles == 2, "renard : 2 voyelles."
assert SORTIE.strip().splitlines()[-1] == "2", "Afficher nb_voyelles."
for m, v in [("python", 2), ("xyz", 1), ("oiseau", 5), ("brr", 0), ("", 0)]:
    autre, _ = relancer([m])
    assert autre["nb_voyelles"] == v, f"« {m} » : {v} voyelle(s)."
assert ".count(" not in PROGRAMME, "Sans count : parcourir le mot."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-3-4" label="3.4 [Boucles] - Diviser jusqu'à 1" type="python">
<Enonce>
### Diviser jusqu'à 1

La première ligne, déjà dans l'éditeur, demande un entier `n` (au moins 1). Tant que `n` est plus grand que 1, le remplacer par le quotient entier `n // 2`.

Ranger dans `etapes` le nombre de divisions faites, puis afficher `etapes`.

Exemple : 20 → 10 → 5 → 2 → 1, donc 4 étapes.

<PostIt>

```python
while condition:
    ...
```

- le bloc se répète tant que la condition est vraie
- quelque chose doit changer dans le bloc, sinon la boucle ne s'arrête jamais
- `for` quand le nombre de tours est connu à l'avance, `while` sinon

</PostIt>

<Indices>
<Indice>

La condition de la boucle : `n > 1`.

</Indice>
<Indice>

À chaque tour, deux mises à jour : `n` est divisé, `etapes` augmente de 1.

</Indice>
<Indice>

```text
etapes ← 0
TANT QUE n > 1
    n ← n // 2
    etapes ← etapes + 1
AFFICHER etapes
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Nombre : "))
etapes = 0
while n > 1:
    n = n // 2
    etapes += 1
print(etapes)
```

</Correction>
</Enonce>
<CodeDepart>

```python
n = int(input("Nombre : "))
```

</CodeDepart>
<Verification>

```python
ENTREES = ["20"]
assert etapes == 4, "20 : 4 étapes."
assert SORTIE.strip().splitlines()[-1] == "4", "Afficher etapes."
for v, e in [(1, 0), (2, 1), (7, 2), (1000, 9), (1024, 10)]:
    autre, _ = relancer([str(v)])
    assert autre["etapes"] == e, f"{v} : {e} étape(s)."
assert "while" in PROGRAMME, "Utiliser une boucle while."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-3-5" label="3.5 [Boucles] - Table de multiplication carrée" type="python">
<Enonce>
### Table de multiplication carrée

La première ligne, déjà dans l'éditeur, demande un entier `n`. Afficher une table de `n` lignes : la ligne `i` contient `i × 1`, `i × 2`, …, `i × n`, séparés par des espaces.

Exemple avec 3 :

```
1 2 3
2 4 6
3 6 9
```

<PostIt>

Une boucle dans une boucle :

```python
for i in range(1, 4):
    for j in range(1, 4):
        print(i * j, end=" ")
    print()
```

- la boucle intérieure fait tous ses tours à chaque tour de la boucle extérieure
- `print(x, end=" ")` reste sur la même ligne
- `print()` seul passe à la ligne suivante

</PostIt>

<Indices>
<Indice>

La boucle extérieure choisit la ligne `i`, la boucle intérieure parcourt les colonnes `j`.

</Indice>
<Indice>

Le passage à la ligne se fait après la boucle intérieure, mais dans la boucle extérieure.

</Indice>
<Indice>

```text
POUR i ALLANT DE 1 À n
    POUR j ALLANT DE 1 À n
        AFFICHER i × j (sur la même ligne)
    PASSER À LA LIGNE
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Taille : "))
for i in range(1, n + 1):
    for j in range(1, n + 1):
        print(i * j, end=" ")
    print()
```

</Correction>
</Enonce>
<CodeDepart>

```python
n = int(input("Taille : "))
```

</CodeDepart>
<Verification>

```python
ENTREES = ["3"]
lignes = [ligne.split() for ligne in SORTIE.strip().splitlines()]
assert lignes[-3:] == [["1", "2", "3"], ["2", "4", "6"], ["3", "6", "9"]], "Avec 3 : les lignes « 1 2 3 », « 2 4 6 », « 3 6 9 »."
_, sortie = relancer(["4"])
lignes = [ligne.split() for ligne in sortie.strip().splitlines()]
assert lignes[-4:] == [[str(i * j) for j in range(1, 5)] for i in range(1, 5)], "Avec 4 : quatre lignes de quatre produits."
assert len(lignes) == 5, "Avec 4 : la question, puis exactement quatre lignes."
assert PROGRAMME.count("for ") >= 2, "Utiliser deux boucles for, l'une dans l'autre."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-4-1" label="4.1 [Fonctions] - Prix TTC" type="python">
<Enonce>
### Prix TTC

Écrire une fonction `prix_ttc(prix_ht)` qui renvoie le prix toutes taxes comprises (le prix hors taxe augmenté de 20 %), arrondi à deux décimales.

Exemples : `prix_ttc(10)` renvoie `12.0` ; `prix_ttc(19.99)` renvoie `23.99`.

<PostIt>

```python
def nom(parametre):
    resultat = ...
    return resultat
```

- `def` définit la fonction : rien ne s'exécute avant un appel
- `return` renvoie la valeur et termine la fonction
- appel : `x = nom(3)` range la valeur renvoyée dans `x`
- `round(x, 2)` arrondit à deux décimales

</PostIt>

<Indices>
<Indice>

Augmenter de 20 % revient à multiplier par 1,2 (écrit `1.2` en Python).

</Indice>
<Indice>

`return round(prix_ht * 1.2, 2)` calcule, arrondit et renvoie en une ligne.

</Indice>
<Indice>

```text
FONCTION prix_ttc(prix_ht)
    RENVOYER arrondi(prix_ht × 1,2 ; 2 décimales)
```

</Indice>
</Indices>

<Correction>

```python
def prix_ttc(prix_ht: float) -> float:
    return round(prix_ht * 1.2, 2)
```

</Correction>
</Enonce>
<Verification>

```python
assert prix_ttc(10) is not None, "La fonction renvoie le prix avec return."
assert prix_ttc(10) == 12.0, "prix_ttc(10) : 12.0."
assert prix_ttc(19.99) == 23.99, "prix_ttc(19.99) : 23.99 (arrondi à deux décimales)."
assert prix_ttc(0) == 0, "prix_ttc(0) : 0."
assert prix_ttc(2.5) == 3.0, "prix_ttc(2.5) : 3.0."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-4-2" label="4.2 [Fonctions] - Renvoyer plutôt qu'afficher" type="python">
<Enonce>
### Renvoyer plutôt qu'afficher

1. Écrire une fonction `est_pair(n)` qui renvoie `True` si l'entier `n` est pair, `False` sinon.
2. Écrire une fonction `compte_pairs(debut, fin)` qui renvoie le nombre d'entiers pairs entre `debut` et `fin` compris. Elle appelle `est_pair`.

Exemple : `compte_pairs(1, 10)` renvoie `5`.

Contrainte : aucun `print` dans le programme.

<PostIt>

- `print(x)` affiche `x` à l'écran, mais la fonction renvoie alors `None`
- `return x` renvoie `x` : le programme peut le ranger, le comparer, le réutiliser
- une fonction booléenne peut renvoyer directement une comparaison :

```python
def est_positif(n):
    return n > 0
```

- `if est_positif(x):` utilise la valeur renvoyée

</PostIt>

<Indices>
<Indice>

`est_pair` tient en une ligne : `return n % 2 == 0`.

</Indice>
<Indice>

`compte_pairs` est un compteur dans une boucle sur `range(debut, fin + 1)`.

</Indice>
<Indice>

```text
FONCTION est_pair(n)
    RENVOYER n % 2 = 0

FONCTION compte_pairs(debut, fin)
    compteur ← 0
    POUR i ALLANT DE debut À fin
        SI est_pair(i) ALORS compteur ← compteur + 1
    RENVOYER compteur
```

</Indice>
</Indices>

<Correction>

```python
def est_pair(n: int) -> bool:
    return n % 2 == 0


def compte_pairs(debut: int, fin: int) -> int:
    compteur = 0
    for i in range(debut, fin + 1):
        if est_pair(i):
            compteur += 1
    return compteur
```

</Correction>
</Enonce>
<Verification>

```python
assert est_pair(4) is True and est_pair(0) is True, "4 et 0 sont pairs : True."
assert est_pair(7) is False and est_pair(-3) is False, "7 et -3 sont impairs : False."
assert compte_pairs(1, 10) == 5, "Entre 1 et 10 : 5 pairs."
assert compte_pairs(4, 4) == 1 and compte_pairs(5, 5) == 0, "Bornes comprises : 4 seul compte 1, 5 seul compte 0."
assert compte_pairs(-3, 3) == 3, "Entre -3 et 3 : -2, 0, 2."
assert "print" not in PROGRAMME, "Aucun print : les fonctions renvoient leur résultat."
assert PROGRAMME.count("est_pair(") >= 2, "compte_pairs appelle est_pair."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-4-3" label="4.3 [Fonctions] - Le plus grand de trois" type="python">
<Enonce>
### Le plus grand de trois

Écrire une fonction `maximum3(a, b, c)` qui renvoie le plus grand des trois nombres.

Exemple : `maximum3(4, 9, 2)` renvoie `9`.

Contrainte : sans la fonction `max`.

<PostIt>

- les paramètres reçoivent les valeurs dans l'ordre de l'appel : `maximum3(4, 9, 2)` donne `a = 4`, `b = 9`, `c = 2`
- une variable créée dans la fonction n'existe que dans la fonction (variable locale)
- une fonction peut contenir plusieurs `return` : le premier atteint termine la fonction

</PostIt>

<Indices>
<Indice>

Une variable `plus_grand` peut partir de `a`, puis être remplacée si `b` ou `c` est plus grand.

</Indice>
<Indice>

Deux `if` à la suite suffisent, sans `else`.

</Indice>
<Indice>

```text
FONCTION maximum3(a, b, c)
    plus_grand ← a
    SI b > plus_grand ALORS plus_grand ← b
    SI c > plus_grand ALORS plus_grand ← c
    RENVOYER plus_grand
```

</Indice>
</Indices>

<Correction>

```python
def maximum3(a: float, b: float, c: float) -> float:
    plus_grand = a
    if b > plus_grand:
        plus_grand = b
    if c > plus_grand:
        plus_grand = c
    return plus_grand
```

</Correction>
</Enonce>
<Verification>

```python
assert maximum3(4, 9, 2) == 9, "maximum3(4, 9, 2) : 9."
assert maximum3(1, 2, 3) == 3 and maximum3(3, 2, 1) == 3, "Le plus grand peut être n'importe où."
assert maximum3(5, 5, 1) == 5, "Avec deux valeurs égales : 5."
assert maximum3(-1, -5, -3) == -1, "Avec des négatifs : -1."
assert maximum3(2.5, 2.4, 2.45) == 2.5, "Avec des décimaux : 2.5."
import re
assert not re.search(r"\bmax\s*\(", PROGRAMME), "Sans la fonction max."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-4-4" label="4.4 [Fonctions] - Compter une lettre" type="python">
<Enonce>
### Compter une lettre

Écrire une fonction `compte(mot, lettre)` qui renvoie le nombre de fois où `lettre` apparaît dans `mot`.

Exemple : `compte("ananas", "a")` renvoie `3`.

Contrainte : sans la méthode `count`.

<PostIt>

Boucle dans une fonction :

```python
def f(texte):
    n = 0
    for caractere in texte:
        ...
    return n
```

- le `return` se place après la boucle, au niveau du `for`
- un `return` dans la boucle arrêterait la fonction dès le premier tour

</PostIt>

<Indices>
<Indice>

Comparer chaque caractère du mot à `lettre` avec `==`.

</Indice>
<Indice>

Vérifier l'indentation du `return` : il doit être aligné avec le `for`.

</Indice>
<Indice>

```text
FONCTION compte(mot, lettre)
    n ← 0
    POUR CHAQUE caractere DE mot
        SI caractere = lettre ALORS n ← n + 1
    RENVOYER n
```

</Indice>
</Indices>

<Correction>

```python
def compte(mot: str, lettre: str) -> int:
    n = 0
    for caractere in mot:
        if caractere == lettre:
            n += 1
    return n
```

</Correction>
</Enonce>
<Verification>

```python
assert compte("ananas", "a") == 3, "« ananas », a : 3."
assert compte("renard", "r") == 2, "« renard », r : 2 (la dernière lettre compte aussi)."
assert compte("python", "z") == 0, "Lettre absente : 0."
assert compte("", "a") == 0, "Mot vide : 0."
assert compte("aaa", "a") == 3, "« aaa », a : 3."
assert ".count(" not in PROGRAMME, "Sans count : parcourir le mot."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revbases-4-5" label="4.5 [Fonctions] - Des fonctions qui s'appellent" type="python">
<Enonce>
### Des fonctions qui s'appellent

Écrire trois fonctions, chacune utilisant la précédente :

1. `nb_diviseurs(n)` renvoie le nombre de diviseurs de l'entier `n` (au moins 1). Exemple : `nb_diviseurs(12)` renvoie `6` (1, 2, 3, 4, 6, 12).
2. `est_premier(n)` renvoie `True` si `n` a exactement deux diviseurs, `False` sinon.
3. `compter_premiers(n)` renvoie le nombre de nombres premiers entre 1 et `n` compris. Exemple : `compter_premiers(10)` renvoie `4` (2, 3, 5, 7).

<PostIt>

- une fonction peut en appeler une autre, définie plus haut ou plus bas dans le fichier
- découper un problème en petites fonctions : chacune se teste à part
- tester une fonction avant d'écrire la suivante : `print(nb_diviseurs(12))`, puis retirer le test

</PostIt>

<Indices>
<Indice>

`d` divise `n` quand `n % d == 0` : il suffit de tester tous les `d` de 1 à `n`.

</Indice>
<Indice>

`est_premier` tient en une ligne grâce à `nb_diviseurs` ; `compter_premiers` est un compteur qui appelle `est_premier`.

</Indice>
<Indice>

```text
FONCTION nb_diviseurs(n)
    total ← 0
    POUR d ALLANT DE 1 À n
        SI n % d = 0 ALORS total ← total + 1
    RENVOYER total

FONCTION est_premier(n)
    RENVOYER nb_diviseurs(n) = 2

FONCTION compter_premiers(n)
    compteur ← 0
    POUR k ALLANT DE 1 À n
        SI est_premier(k) ALORS compteur ← compteur + 1
    RENVOYER compteur
```

</Indice>
</Indices>

<Correction>

```python
def nb_diviseurs(n: int) -> int:
    total = 0
    for d in range(1, n + 1):
        if n % d == 0:
            total += 1
    return total


def est_premier(n: int) -> bool:
    return nb_diviseurs(n) == 2


def compter_premiers(n: int) -> int:
    compteur = 0
    for k in range(1, n + 1):
        if est_premier(k):
            compteur += 1
    return compteur
```

</Correction>
</Enonce>
<Verification>

```python
assert nb_diviseurs(12) == 6, "nb_diviseurs(12) : 6."
assert nb_diviseurs(1) == 1 and nb_diviseurs(7) == 2, "nb_diviseurs(1) : 1 ; nb_diviseurs(7) : 2."
assert est_premier(7) is True and est_premier(2) is True, "7 et 2 sont premiers."
assert est_premier(1) is False and est_premier(9) is False, "1 et 9 ne sont pas premiers."
assert compter_premiers(10) == 4, "compter_premiers(10) : 4."
assert compter_premiers(30) == 10 and compter_premiers(1) == 0, "compter_premiers(30) : 10 ; compter_premiers(1) : 0."
assert PROGRAMME.count("nb_diviseurs(") >= 2, "est_premier appelle nb_diviseurs."
assert PROGRAMME.count("est_premier(") >= 2, "compter_premiers appelle est_premier."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
