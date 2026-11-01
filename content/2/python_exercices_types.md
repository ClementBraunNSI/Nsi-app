---
title: 'Exercices : Types en Python'
icon: "tag"
chapter: Introduction à Python
badgeId: types-python
meta: 'Variables, Types, Opérateurs et Conditions'
level: premiere
prerequisites:
  - python_fonctions
audience: public
groupe: types-python
groupeTitre: "Types de données en Python"
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="types-python" courseTitle="Types en Python">

<ExerciseSection id="1nsi-types-1-1" label="1.1 [Introduction] - Prix TTC" type="python">
<Enonce>
### Prix TTC

Écrire une fonction `prix_ttc(ht)` qui renvoie le prix toutes taxes comprises d'un article de prix hors taxes `ht`, avec une TVA de 20 %, **arrondi au centime**.

Exemple : `prix_ttc(10)` renvoie `12.0`.

<Indices>
<Indice>

Ajouter 20 %, c'est multiplier par `1.2` ; le résultat est un `float`.

</Indice>
<Indice>

`round(x, 2)` arrondit au centième.

</Indice>
<Indice>

```text
FONCTION prix_ttc(ht)
    RENVOYER arrondi(ht × 1,2, 2 chiffres)
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def prix_ttc(ht: float) -> float:
    return round(ht * 1.2, 2)
```

</Correction>
</Enonce>
<Verification>

```python
assert prix_ttc(10) == 12.0, "prix_ttc(10) vaut 12.0."
assert prix_ttc(0) == 0, "prix_ttc(0) vaut 0."
assert prix_ttc(19.99) == 23.99, "prix_ttc(19.99) vaut 23.99 (arrondi)."
assert prix_ttc(3.33) == 4.0, "prix_ttc(3.33) vaut 4.0 (arrondi)."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-1-2" label="1.2 [Introduction] - Phrase de présentation" type="python">
<Enonce>
### Phrase de présentation

Écrire une fonction `presentation(prenom, age)` qui renvoie le texte `"Léa a 16 ans"` pour `presentation("Léa", 16)`.

`age` est un entier.

<Indices>
<Indice>

`"a" + 16` déclenche une erreur : un texte et un entier ne s'additionnent pas.

</Indice>
<Indice>

`str(16)` convertit l'entier en texte `"16"`. Une f-string (`f"..."`) fait aussi la conversion.

</Indice>
<Indice>

```text
FONCTION presentation(prenom, age)
    RENVOYER prenom + " a " + texte(age) + " ans"
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def presentation(prenom: str, age: int) -> str:
    return prenom + " a " + str(age) + " ans"
```

</Correction>
</Enonce>
<Verification>

```python
assert presentation("Léa", 16) == "Léa a 16 ans", "presentation(\"Léa\", 16)."
assert presentation("Sam", 7) == "Sam a 7 ans", "presentation(\"Sam\", 7)."
assert type(presentation("A", 1)) == str, "La fonction renvoie un texte (et n'affiche rien)."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-1-3" label="1.3 [Introduction] - Partage de bonbons" type="python">
<Enonce>
### Partage de bonbons

Des bonbons sont partagés équitablement entre des enfants ; ceux qui restent vont au renard.

Écrire deux fonctions :
- `par_enfant(bonbons, enfants)` : le nombre (entier) de bonbons reçus par chaque enfant ;
- `pour_le_renard(bonbons, enfants)` : le nombre de bonbons restants.

<Indices>
<Indice>

`/` donne toujours un `float` (`7 / 2` vaut `3.5`). Pour une division entière, il existe un autre opérateur.

</Indice>
<Indice>

`//` donne le quotient entier, `%` le reste.

</Indice>
<Indice>

```text
FONCTION par_enfant(bonbons, enfants)
    RENVOYER quotient entier de bonbons par enfants
FONCTION pour_le_renard(bonbons, enfants)
    RENVOYER reste de bonbons par enfants
```

</Indice>
</Indices>

<Correction>

```python
def par_enfant(bonbons: int, enfants: int) -> int:
    return bonbons // enfants


def pour_le_renard(bonbons: int, enfants: int) -> int:
    return bonbons % enfants
```

</Correction>
</Enonce>
<Verification>

```python
assert par_enfant(23, 5) == 4 and pour_le_renard(23, 5) == 3, "23 bonbons pour 5 : 4 chacun, 3 pour le renard."
assert par_enfant(20, 4) == 5 and pour_le_renard(20, 4) == 0, "20 pour 4 : 5 chacun, aucun reste."
assert par_enfant(3, 7) == 0 and pour_le_renard(3, 7) == 3, "3 pour 7 : rien pour les enfants."
assert type(par_enfant(23, 5)) == int, "par_enfant renvoie un entier, pas un flottant."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-1-4" label="1.4 [Introduction] - Nom du type" type="python">
<Enonce>
### Nom du type

Écrire une fonction `nom_du_type(valeur)` qui renvoie `"entier"`, `"flottant"`, `"texte"` ou `"booléen"` selon le type de `valeur`.

Exemple : `nom_du_type(3.0)` renvoie `"flottant"`.

<Indices>
<Indice>

`type(valeur)` donne le type ; il se compare avec `==` à `int`, `float`, `str` ou `bool` (sans guillemets).

</Indice>
<Indice>

Quatre cas : `if`, deux `elif` et un `else`.

</Indice>
<Indice>

```text
FONCTION nom_du_type(valeur)
    SI type(valeur) = int ALORS RENVOYER "entier"
    SINON SI type(valeur) = float ALORS RENVOYER "flottant"
    SINON SI type(valeur) = str ALORS RENVOYER "texte"
    SINON RENVOYER "booléen"
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def nom_du_type(valeur) -> str:
    if type(valeur) == int:
        return "entier"
    elif type(valeur) == float:
        return "flottant"
    elif type(valeur) == str:
        return "texte"
    else:
        return "booléen"
```

</Correction>
</Enonce>
<Verification>

```python
assert nom_du_type(3) == "entier", "3 est un entier."
assert nom_du_type(3.0) == "flottant", "3.0 est un flottant."
assert nom_du_type("3") == "texte", "\"3\" est un texte."
assert nom_du_type(True) == "booléen", "True est un booléen."
assert nom_du_type(7 / 7) == "flottant", "7 / 7 donne un flottant."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-2-1" label="2.1 [Facile] - Pair, sans if" type="python">
<Enonce>
### Pair, sans if

Écrire une fonction `est_pair(n)` qui renvoie `True` si l'entier `n` est pair et `False` sinon.

Contrainte : sans `if`.

<Indices>
<Indice>

Une comparaison comme `x == 0` est déjà une valeur booléenne.

</Indice>
<Indice>

Il suffit de renvoyer directement le résultat de la comparaison.

</Indice>
<Indice>

```text
FONCTION est_pair(n)
    RENVOYER (reste de n par 2 = 0)
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def est_pair(n: int) -> bool:
    return n % 2 == 0
```

</Correction>
</Enonce>
<Verification>

```python
assert est_pair(4) is True and est_pair(7) is False, "4 est pair, 7 ne l'est pas."
assert est_pair(0) is True and est_pair(-3) is False, "0 est pair, -3 ne l'est pas."
import re
assert not re.search(r"\bif\b", PROGRAMME), "Sans if."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-2-2" label="2.2 [Facile] - Majuscule de politesse" type="python">
<Enonce>
### Majuscule de politesse

Écrire une fonction `capitaliser(mot)` qui renvoie le mot avec sa première lettre en majuscule et toutes les autres en minuscules.

Exemple : `capitaliser("pYTHON")` renvoie `"Python"`. Le mot n'est jamais vide.

<Indices>
<Indice>

`mot[0]` est la première lettre, `mot[1:]` tout le reste.

</Indice>
<Indice>

`.upper()` et `.lower()` renvoient une nouvelle chaîne : un texte ne se modifie pas sur place.

</Indice>
<Indice>

```text
FONCTION capitaliser(mot)
    RENVOYER majuscules(mot[0]) + minuscules(mot[à partir de 1])
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def capitaliser(mot: str) -> str:
    return mot[0].upper() + mot[1:].lower()
```

</Correction>
</Enonce>
<Verification>

```python
assert capitaliser("pYTHON") == "Python", "pYTHON donne Python."
assert capitaliser("renard") == "Renard", "renard donne Renard."
assert capitaliser("A") == "A" and capitaliser("b") == "B", "Un mot d'une lettre."
assert "capitalize" not in PROGRAMME and "title" not in PROGRAMME, "Sans capitalize ni title."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-2-3" label="2.3 [Facile] - Dernier chiffre" type="python">
<Enonce>
### Dernier chiffre

Écrire une fonction `dernier_chiffre(n)` qui renvoie le chiffre des unités de l'entier `n` (positif ou négatif), sous forme d'entier.

Exemples : `dernier_chiffre(2026)` renvoie `6`, `dernier_chiffre(-47)` renvoie `7`.

<Indices>
<Indice>

`n % 10` donne le chiffre des unités d'un nombre positif.

</Indice>
<Indice>

Avec un nombre négatif, `-47 % 10` vaut `3` en Python. `abs(n)` donne la valeur absolue.

</Indice>
<Indice>

```text
FONCTION dernier_chiffre(n)
    RENVOYER reste de |n| par 10
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def dernier_chiffre(n: int) -> int:
    return abs(n) % 10
```

</Correction>
</Enonce>
<Verification>

```python
assert dernier_chiffre(2026) == 6, "2026 se termine par 6."
assert dernier_chiffre(-47) == 7, "-47 se termine par 7."
assert dernier_chiffre(0) == 0 and dernier_chiffre(10) == 0, "0 et 10 se terminent par 0."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-2-4" label="2.4 [Facile] - Moyenne pondérée" type="python">
<Enonce>
### Moyenne pondérée

Écrire une fonction `moyenne_ponderee(n1, c1, n2, c2)` qui renvoie la moyenne de deux notes `n1` et `n2` affectées des coefficients `c1` et `c2`, arrondie au centième.

Exemple : 12 coefficient 1 et 15 coefficient 2 donnent `14.0`.

<Indices>
<Indice>

Chaque note compte autant de fois que son coefficient : on additionne `note × coefficient`, puis on divise par la somme des coefficients.

</Indice>
<Indice>

Les parenthèses autour de la somme des coefficients sont indispensables.

</Indice>
<Indice>

```text
FONCTION moyenne_ponderee(n1, c1, n2, c2)
    RENVOYER arrondi((n1 × c1 + n2 × c2) / (c1 + c2), 2 chiffres)
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def moyenne_ponderee(n1: float, c1: float, n2: float, c2: float) -> float:
    return round((n1 * c1 + n2 * c2) / (c1 + c2), 2)
```

</Correction>
</Enonce>
<Verification>

```python
assert moyenne_ponderee(12, 1, 15, 2) == 14.0, "12 (coef 1) et 15 (coef 2) : 14.0."
assert moyenne_ponderee(10, 3, 16, 1) == 11.5, "10 (coef 3) et 16 (coef 1) : 11.5."
assert moyenne_ponderee(13, 1, 14, 2) == 13.67, "13 (coef 1) et 14 (coef 2) : 13.67."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-3-1" label="3.1 [Moyen] - 0,1 + 0,2" type="python">
<Enonce>
### 0,1 + 0,2

En Python, `0.1 + 0.2 == 0.3` vaut `False` : les flottants sont des valeurs approchées.

Écrire une fonction `presque_egaux(a, b)` qui renvoie `True` si les flottants `a` et `b` diffèrent de moins de `1e-9` (un milliardième).

<Indices>
<Indice>

L'écart entre deux nombres est la valeur absolue de leur différence : `abs(a - b)`.

</Indice>
<Indice>

`1e-9` s'écrit tel quel en Python.

</Indice>
<Indice>

```text
FONCTION presque_egaux(a, b)
    RENVOYER |a - b| < 0,000000001
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def presque_egaux(a: float, b: float) -> bool:
    return abs(a - b) < 1e-9
```

</Correction>
</Enonce>
<Verification>

```python
assert presque_egaux(0.1 + 0.2, 0.3) is True, "0.1 + 0.2 et 0.3 sont presque égaux."
assert presque_egaux(0.3, 0.1 + 0.2) is True, "Dans l'autre sens aussi."
assert presque_egaux(1.0, 1.001) is False, "1.0 et 1.001 sont différents."
assert presque_egaux(2.0, 2.0) is True, "Deux valeurs identiques."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-3-2" label="3.2 [Moyen] - Affichage d'un chronomètre" type="python">
<Enonce>
### Affichage d'un chronomètre

Écrire une fonction `chrono(secondes)` qui renvoie la durée sous la forme `"HH:MM:SS"`, chaque nombre sur deux chiffres.

Exemple : `chrono(3725)` renvoie `"01:02:05"`. La durée reste sous 100 heures.

<Indices>
<Indice>

Découper d'abord la durée en heures, minutes et secondes avec `//` et `%`.

</Indice>
<Indice>

Dans une f-string, `{x:02d}` écrit l'entier `x` sur deux chiffres, complété par un zéro.

</Indice>
<Indice>

```text
FONCTION chrono(secondes)
    h ← quotient de secondes par 3600
    m ← quotient de (reste de secondes par 3600) par 60
    s ← reste de secondes par 60
    RENVOYER h, m, s écrits sur deux chiffres, séparés par ":"
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def chrono(secondes: int) -> str:
    h = secondes // 3600
    m = secondes % 3600 // 60
    s = secondes % 60
    return f"{h:02d}:{m:02d}:{s:02d}"
```

</Correction>
</Enonce>
<Verification>

```python
assert chrono(3725) == "01:02:05", "3725 s : 01:02:05."
assert chrono(0) == "00:00:00", "0 s : 00:00:00."
assert chrono(59) == "00:00:59" and chrono(60) == "00:01:00", "59 s puis 60 s."
assert chrono(359999) == "99:59:59", "359999 s : 99:59:59."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-3-3" label="3.3 [Moyen] - Dans l'intervalle ?" type="python">
<Enonce>
### Dans l'intervalle ?

Écrire une fonction `dans_intervalle(x, a, b)` qui renvoie `True` si `x` est compris entre `a` et `b` (bornes incluses), **quel que soit l'ordre** de `a` et `b`.

Exemples : `dans_intervalle(5, 1, 10)` et `dans_intervalle(5, 10, 1)` renvoient `True`.

<Indices>
<Indice>

Python accepte les comparaisons enchaînées : `a <= x <= b`.

</Indice>
<Indice>

`min(a, b)` et `max(a, b)` donnent la borne basse et la borne haute, quel que soit l'ordre.

</Indice>
<Indice>

```text
FONCTION dans_intervalle(x, a, b)
    RENVOYER min(a, b) ≤ x ≤ max(a, b)
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def dans_intervalle(x: float, a: float, b: float) -> bool:
    return min(a, b) <= x <= max(a, b)
```

</Correction>
</Enonce>
<Verification>

```python
assert dans_intervalle(5, 1, 10) is True and dans_intervalle(5, 10, 1) is True, "5 est entre 1 et 10, dans les deux ordres."
assert dans_intervalle(1, 1, 10) is True and dans_intervalle(10, 10, 1) is True, "Les bornes sont incluses."
assert dans_intervalle(0, 1, 10) is False and dans_intervalle(11, 10, 1) is False, "0 et 11 sont dehors."
assert dans_intervalle(-2.5, -3, -2) is True, "Avec des négatifs."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-3-4" label="3.4 [Moyen] - Coller deux nombres" type="python">
<Enonce>
### Coller deux nombres

Écrire une fonction `coller(a, b)` qui renvoie l'**entier** obtenu en écrivant les chiffres de `b` à la suite de ceux de `a` (deux entiers positifs).

Exemple : `coller(12, 345)` renvoie `12345`.

<Indices>
<Indice>

Passer par le texte : les chaînes se collent avec `+`.

</Indice>
<Indice>

`str` transforme un entier en texte, `int` fait le chemin inverse.

</Indice>
<Indice>

```text
FONCTION coller(a, b)
    RENVOYER entier(texte(a) + texte(b))
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def coller(a: int, b: int) -> int:
    return int(str(a) + str(b))
```

</Correction>
</Enonce>
<Verification>

```python
assert coller(12, 345) == 12345, "12 et 345 : 12345."
assert type(coller(1, 2)) == int, "Le résultat est un entier."
assert coller(7, 0) == 70 and coller(0, 7) == 7, "7 et 0 : 70 ; 0 et 7 : 7."
assert coller(100, 1) == 1001, "100 et 1 : 1001."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-4-1" label="4.1 [Difficile] - Ou exclusif" type="python">
<Enonce>
### Ou exclusif

Le « ou exclusif » de deux booléens vaut `True` quand **exactement un** des deux est vrai.

Écrire une fonction `ou_exclusif(a, b)` qui le calcule.

Contrainte : avec `and`, `or` et `not` seulement (pas de `!=`, de `^` ni de `if`).

<Indices>
<Indice>

Écrire la table de vérité : seuls les cas (vrai, faux) et (faux, vrai) donnent vrai.

</Indice>
<Indice>

« a vrai et b faux » ou « a faux et b vrai » : la phrase se traduit mot à mot.

</Indice>
<Indice>

```text
FONCTION ou_exclusif(a, b)
    RENVOYER (a ET NON b) OU (NON a ET b)
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def ou_exclusif(a: bool, b: bool) -> bool:
    return (a and not b) or (not a and b)
```

</Correction>
</Enonce>
<Verification>

```python
assert ou_exclusif(True, False) is True and ou_exclusif(False, True) is True, "Un seul vrai : True."
assert ou_exclusif(True, True) is False and ou_exclusif(False, False) is False, "Deux pareils : False."
import re
assert "!=" not in PROGRAMME and "^" not in PROGRAMME and not re.search(r"\bif\b", PROGRAMME), "Avec and, or, not seulement."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-4-2" label="4.2 [Difficile] - Arrondi au-dessus" type="python">
<Enonce>
### Arrondi au-dessus

Écrire une fonction `plafond(x)` qui renvoie le plus petit entier supérieur ou égal au flottant `x`.

Exemples : `plafond(2.1)` renvoie `3`, `plafond(2.0)` renvoie `2`, `plafond(-2.7)` renvoie `-2`.

Contrainte : sans le module `math`.

<Indices>
<Indice>

`int(x)` supprime la partie décimale : il arrondit **vers zéro** (`int(-2.7)` vaut `-2`, `int(2.1)` vaut `2`).

</Indice>
<Indice>

Pour un nombre positif qui a une partie décimale, `int` donne un de moins que le résultat voulu. Pour un négatif, il donne déjà le bon résultat.

</Indice>
<Indice>

```text
FONCTION plafond(x)
    n ← entier(x)          (partie entière, vers zéro)
    SI x > n ALORS RENVOYER n + 1
    RENVOYER n
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def plafond(x: float) -> int:
    n = int(x)
    if x > n:
        return n + 1
    return n
```

</Correction>
</Enonce>
<Verification>

```python
assert plafond(2.1) == 3 and plafond(2.0) == 2, "2.1 donne 3, 2.0 donne 2."
assert plafond(-2.7) == -2 and plafond(-3.0) == -3, "-2.7 donne -2, -3.0 donne -3."
assert plafond(0.0001) == 1 and plafond(-0.5) == 0, "0.0001 donne 1, -0.5 donne 0."
assert type(plafond(1.5)) == int, "Le résultat est un entier."
assert "math" not in PROGRAMME, "Sans le module math."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-4-3" label="4.3 [Difficile] - Évolution en pourcentage" type="python">
<Enonce>
### Évolution en pourcentage

Écrire une fonction `evolution(avant, apres)` qui renvoie l'évolution en pourcentage sous forme de texte, avec **toujours un signe** et une décimale.

Exemples : `evolution(80, 90)` renvoie `"+12.5 %"`, `evolution(50, 40)` renvoie `"-20.0 %"`, `evolution(10, 10)` renvoie `"+0.0 %"`.

<Indices>
<Indice>

Le taux d'évolution vaut `(apres - avant) / avant × 100`.

</Indice>
<Indice>

Dans une f-string, `{t:+.1f}` écrit `t` avec son signe et une décimale.

</Indice>
<Indice>

```text
FONCTION evolution(avant, apres)
    taux ← (apres - avant) / avant × 100
    RENVOYER taux écrit avec son signe et 1 décimale, suivi de " %"
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def evolution(avant: float, apres: float) -> str:
    taux = (apres - avant) / avant * 100
    return f"{taux:+.1f} %"
```

</Correction>
</Enonce>
<Verification>

```python
assert evolution(80, 90) == "+12.5 %", "80 vers 90 : +12.5 %."
assert evolution(50, 40) == "-20.0 %", "50 vers 40 : -20.0 %."
assert evolution(10, 10) == "+0.0 %", "Sans changement : +0.0 %."
assert evolution(3, 4) == "+33.3 %", "3 vers 4 : +33.3 %."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-4-4" label="4.4 [Difficile] - Est-ce un entier ?" type="python">
<Enonce>
### Est-ce un entier ?

Écrire une fonction `est_entier(texte)` qui renvoie `True` si le texte représente un entier écrit en chiffres, éventuellement précédé d'un signe `-`.

Exemples : `"42"` et `"-7"` donnent `True` ; `""`, `"-"`, `"4.2"`, `"12a"` et `"--3"` donnent `False`.

Contrainte : sans `try` ni boucle.

<Indices>
<Indice>

`"123".isdigit()` vaut `True`, mais `"-123".isdigit()` vaut `False` à cause du signe.

</Indice>
<Indice>

Si le texte commence par `-`, il suffit de tester le reste : `texte[1:]`. Un texte vide n'est pas fait de chiffres (`"".isdigit()` vaut `False`).

</Indice>
<Indice>

```text
FONCTION est_entier(texte)
    SI texte commence par "-" ALORS
        RENVOYER texte[à partir de 1] n'est fait que de chiffres
    RENVOYER texte n'est fait que de chiffres
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def est_entier(texte: str) -> bool:
    if texte.startswith("-"):
        return texte[1:].isdigit()
    return texte.isdigit()
```

</Correction>
</Enonce>
<Verification>

```python
for t in ["42", "-7", "0", "007"]:
    assert est_entier(t) is True, f"« {t} » est un entier."
for t in ["", "-", "4.2", "12a", "--3", " 5"]:
    assert est_entier(t) is False, f"« {t} » n'est pas un entier."
import re
assert not re.search(r"\b(try|for|while)\b", PROGRAMME), "Sans try ni boucle."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-5-1" label="5.1 [Expert] - Heure d'arrivée" type="python">
<Enonce>
### Heure d'arrivée

Écrire une fonction `arrivee(depart, duree)` : `depart` est une heure sous la forme `"HH:MM"` et `duree` un nombre de minutes. Elle renvoie l'heure d'arrivée au même format, en revenant à `00:00` après minuit.

Exemples : `arrivee("08:45", 30)` renvoie `"09:15"`, `arrivee("23:30", 90)` renvoie `"01:00"`.

<Indices>
<Indice>

Convertir l'heure de départ en minutes depuis minuit simplifie tout : une seule addition.

</Indice>
<Indice>

Une journée compte 1440 minutes ; le reste de la division par 1440 fait revenir à 0 après minuit.

</Indice>
<Indice>

`texte[0:2]` et `texte[3:5]` découpent les heures et les minutes.

</Indice>
<Indice>

```text
FONCTION arrivee(depart, duree)
    total ← entier(depart[0:2]) × 60 + entier(depart[3:5]) + duree
    total ← reste de total par 1440
    RENVOYER (quotient de total par 60) et (reste de total par 60), sur deux chiffres, séparés par ":"
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def arrivee(depart: str, duree: int) -> str:
    total = int(depart[0:2]) * 60 + int(depart[3:5]) + duree
    total = total % 1440
    return f"{total // 60:02d}:{total % 60:02d}"
```

</Correction>
</Enonce>
<Verification>

```python
assert arrivee("08:45", 30) == "09:15", "08:45 + 30 min : 09:15."
assert arrivee("23:30", 90) == "01:00", "23:30 + 90 min : 01:00."
assert arrivee("00:00", 0) == "00:00", "Sans durée."
assert arrivee("12:00", 1440 * 2 + 5) == "12:05", "Deux jours et 5 minutes plus tard."
assert arrivee("09:05", 54) == "09:59", "09:05 + 54 min : 09:59."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-5-2" label="5.2 [Expert] - Angle des aiguilles" type="python">
<Enonce>
### Angle des aiguilles

Écrire une fonction `angle(h, m)` qui renvoie le plus petit angle, en degrés, entre l'aiguille des heures et celle des minutes d'une horloge à `h` heures et `m` minutes (`h` de 0 à 23).

Exemples : à 3 h 00 l'angle vaut `90.0` ; à 12 h 30, `165.0` (l'aiguille des heures a avancé de 15°).

<Indices>
<Indice>

L'aiguille des minutes tourne de 6° par minute. Celle des heures de 30° par heure, **plus** 0,5° par minute.

</Indice>
<Indice>

Sur un cadran, 15 h et 3 h sont au même endroit : `h % 12`.

</Indice>
<Indice>

L'écart entre les deux aiguilles peut dépasser 180° : l'autre angle vaut alors `360 - écart`.

</Indice>
<Indice>

```text
FONCTION angle(h, m)
    minutes ← 6 × m
    heures ← 30 × (reste de h par 12) + 0,5 × m
    ecart ← |heures - minutes|
    RENVOYER min(ecart, 360 - ecart)
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def angle(h: int, m: int) -> float:
    minutes = 6 * m
    heures = 30 * (h % 12) + 0.5 * m
    ecart = abs(heures - minutes)
    return float(min(ecart, 360 - ecart))
```

</Correction>
</Enonce>
<Verification>

```python
assert angle(3, 0) == 90, "3 h 00 : 90°."
assert angle(12, 30) == 165, "12 h 30 : 165°."
assert angle(15, 0) == 90, "15 h vaut 3 h sur le cadran."
assert angle(9, 0) == 90, "9 h 00 : 90°, pas 270°."
assert angle(0, 0) == 0 and angle(6, 0) == 180, "Minuit : 0° ; 6 h : 180°."
assert angle(10, 10) == 115, "10 h 10 : 115°."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-5-3" label="5.3 [Expert] - Plaque d'immatriculation" type="python">
<Enonce>
### Plaque d'immatriculation

Une plaque française s'écrit `AB-123-CD` : deux lettres majuscules, un tiret, trois chiffres, un tiret, deux lettres majuscules.

Écrire une fonction `plaque_valide(plaque)` qui renvoie `True` si le texte respecte exactement ce format.

Contrainte : sans boucle.

<Indices>
<Indice>

Vérifier d'abord la longueur : sans cela, les découpages risquent de ne pas exister.

</Indice>
<Indice>

Découper la plaque en morceaux avec `plaque[0:2]`, `plaque[3:6]`, etc. et tester chaque morceau.

</Indice>
<Indice>

`.isalpha()`, `.isupper()` et `.isdigit()` testent un morceau entier d'un coup.

</Indice>
<Indice>

```text
FONCTION plaque_valide(p)
    SI longueur(p) ≠ 9 ALORS RENVOYER FAUX
    lettres_ok ← p[0:2] et p[7:9] ne sont que des lettres majuscules
    chiffres_ok ← p[3:6] n'est fait que de chiffres
    tirets_ok ← p[2] = "-" ET p[6] = "-"
    RENVOYER lettres_ok ET chiffres_ok ET tirets_ok
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def plaque_valide(plaque: str) -> bool:
    if len(plaque) != 9:
        return False
    debut, milieu, fin = plaque[0:2], plaque[3:6], plaque[7:9]
    lettres_ok = debut.isalpha() and debut.isupper() and fin.isalpha() and fin.isupper()
    return lettres_ok and milieu.isdigit() and plaque[2] == "-" and plaque[6] == "-"
```

</Correction>
</Enonce>
<Verification>

```python
assert plaque_valide("AB-123-CD") is True and plaque_valide("ZZ-000-AA") is True, "Deux plaques valides."
for p in ["ab-123-cd", "AB-12-CD", "AB123CD", "AB-1234-CD", "A1-123-CD", "AB_123_CD", "AB-123-C9", ""]:
    assert plaque_valide(p) is False, f"« {p} » est refusée."
import re
assert not re.search(r"\b(for|while)\b", PROGRAMME), "Sans boucle."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-5-4" label="5.4 [Expert] - Montant à la française" type="python">
<Enonce>
### Montant à la française

Écrire une fonction `montant(x)` qui renvoie un montant positif écrit à la française : espace entre les milliers, virgule décimale, deux décimales, suivi de ` €`.

Exemples : `montant(1234.5)` renvoie `"1 234,50 €"`, `montant(7)` renvoie `"7,00 €"`, `montant(1000000)` renvoie `"1 000 000,00 €"`.

Contrainte : sans boucle.

<Indices>
<Indice>

Une f-string sait déjà grouper les milliers à l'anglaise : `f"{x:,.2f}"` donne `"1,234.50"`.

</Indice>
<Indice>

Il reste à échanger les virgules et le point. Attention : remplacer directement `,` par `.` puis `.` par `,` mélange tout. Un caractère intermédiaire aide.

</Indice>
<Indice>

```text
FONCTION montant(x)
    anglais ← x écrit avec séparateur de milliers "," et 2 décimales
    RENVOYER anglais où "," devient " " et "." devient ",", suivi de " €"
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def montant(x: float) -> str:
    anglais = f"{x:,.2f}"
    return anglais.replace(",", " ").replace(".", ",") + " €"
```

</Correction>
</Enonce>
<Verification>

```python
assert montant(1234.5) == "1 234,50 €", "1234.5 : 1 234,50 €."
assert montant(7) == "7,00 €", "7 : 7,00 €."
assert montant(1000000) == "1 000 000,00 €", "Un million."
assert montant(999.999) == "1 000,00 €", "999.999 s'arrondit à 1 000,00 €."
assert montant(0.5) == "0,50 €", "0.5 : 0,50 €."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-6-1" label="6.1 [Mini-projet] - Calculateur d'adresses IP" type="python">
<Enonce>
### Calculateur d'adresses IP

Une adresse IPv4 s'écrit avec quatre nombres de 0 à 255 (`"192.168.1.37"`) mais représente un seul entier sur 32 bits : `192 × 256³ + 168 × 256² + 1 × 256 + 37`. Un réseau se note avec un **préfixe** (`/24`) : le nombre de bits à 1 au début du masque.

Réaliser le calculateur réseau d'un administrateur, sans le module `ipaddress`.

**Objectifs**
- `ip_valide(ip)` : `True` si le texte est formé de 4 nombres de 0 à 255 séparés par des points (que des chiffres).
- `ip_vers_entier(ip)` et `entier_vers_ip(n)` : les conversions dans les deux sens.
- `masque(prefixe)` : le masque en notation pointée (`masque(24)` vaut `"255.255.255.0"`, `masque(0)` vaut `"0.0.0.0"`).
- `reseau(ip, prefixe)` et `diffusion(ip, prefixe)` : la première et la dernière adresse du réseau qui contient `ip` (`reseau("192.168.1.37", 24)` vaut `"192.168.1.0"`, la diffusion `"192.168.1.255"`).
- `nb_hotes(prefixe)` : le nombre d'adresses utilisables pour des machines, c'est-à-dire toutes sauf la première et la dernière (cas particuliers : 2 pour `/31`, 1 pour `/32`).
- `meme_reseau(ip1, ip2, prefixe)` : `True` si les deux adresses sont dans le même réseau.
- `est_privee(ip)` : `True` pour les plages privées `10.0.0.0/8`, `172.16.0.0/12` et `192.168.0.0/16`.

<Indices>
<Indice>

Tout passe par les entiers : convertir en entier, calculer, reconvertir. Écrire et tester `ip_vers_entier` et `entier_vers_ip` en premier.

</Indice>
<Indice>

Le masque `/p` est l'entier `2**32 - 2**(32 - p)` : `p` bits à 1 suivis de zéros. Les opérateurs `&` (et bit à bit) et `|` (ou bit à bit) travaillent directement sur les entiers.

</Indice>
<Indice>

`est_privee` se ramène à `meme_reseau` avec la première adresse de chaque plage.

</Indice>
<Indice>

```text
(cœur du programme : conversions et réseau)
FONCTION ip_vers_entier(ip)
    a, b, c, d ← entiers des 4 parties de ip
    RENVOYER ((a × 256 + b) × 256 + c) × 256 + d
FONCTION entier_vers_ip(n)
    RENVOYER texte(n // 256³) . texte((n // 256²) % 256) . texte((n // 256) % 256) . texte(n % 256)
FONCTION reseau(ip, p)
    RENVOYER entier_vers_ip(ip_vers_entier(ip) ET_BIT_À_BIT (2³² - 2^(32 - p)))
```

</Indice>
</Indices>

<Correction>

```python
def ip_valide(ip: str) -> bool:
    parties = ip.split(".")
    return len(parties) == 4 and all(p.isdigit() and int(p) <= 255 for p in parties)


def ip_vers_entier(ip: str) -> int:
    a, b, c, d = (int(p) for p in ip.split("."))
    return ((a * 256 + b) * 256 + c) * 256 + d


def entier_vers_ip(n: int) -> str:
    return f"{n // 256 ** 3}.{n // 256 ** 2 % 256}.{n // 256 % 256}.{n % 256}"


def _masque_entier(prefixe: int) -> int:
    return 2 ** 32 - 2 ** (32 - prefixe)


def masque(prefixe: int) -> str:
    return entier_vers_ip(_masque_entier(prefixe))


def reseau(ip: str, prefixe: int) -> str:
    return entier_vers_ip(ip_vers_entier(ip) & _masque_entier(prefixe))


def diffusion(ip: str, prefixe: int) -> str:
    return entier_vers_ip(ip_vers_entier(ip) | (2 ** (32 - prefixe) - 1))


def nb_hotes(prefixe: int) -> int:
    if prefixe == 32:
        return 1
    if prefixe == 31:
        return 2
    return 2 ** (32 - prefixe) - 2


def meme_reseau(ip1: str, ip2: str, prefixe: int) -> bool:
    return reseau(ip1, prefixe) == reseau(ip2, prefixe)


def est_privee(ip: str) -> bool:
    return meme_reseau(ip, "10.0.0.0", 8) or meme_reseau(ip, "172.16.0.0", 12) or meme_reseau(ip, "192.168.0.0", 16)
```

</Correction>
</Enonce>
<Verification>

```python
for ip in ["192.168.1.37", "0.0.0.0", "255.255.255.255"]:
    assert ip_valide(ip) is True, f"{ip} est valide."
for ip in ["256.1.1.1", "1.2.3", "1.2.3.4.5", "a.b.c.d", "1..2.3", "-1.2.3.4"]:
    assert ip_valide(ip) is False, f"{ip} est invalide."
assert ip_vers_entier("192.168.1.37") == 3232235813 and ip_vers_entier("0.0.0.1") == 1, "Conversions vers l'entier."
assert entier_vers_ip(3232235813) == "192.168.1.37" and entier_vers_ip(2 ** 32 - 1) == "255.255.255.255", "Conversions vers le texte."
assert masque(24) == "255.255.255.0" and masque(20) == "255.255.240.0" and masque(0) == "0.0.0.0" and masque(32) == "255.255.255.255", "Masques."
assert reseau("192.168.1.37", 24) == "192.168.1.0" and diffusion("192.168.1.37", 24) == "192.168.1.255", "Réseau /24."
assert reseau("10.45.200.7", 13) == "10.40.0.0" and diffusion("10.45.200.7", 13) == "10.47.255.255", "Réseau /13."
assert nb_hotes(24) == 254 and nb_hotes(30) == 2 and nb_hotes(31) == 2 and nb_hotes(32) == 1 and nb_hotes(8) == 16777214, "Nombre d'hôtes."
assert meme_reseau("192.168.1.3", "192.168.1.250", 24) is True and meme_reseau("192.168.1.3", "192.168.2.3", 24) is False, "Même réseau /24."
assert meme_reseau("192.168.1.3", "192.168.2.3", 22) is True, "Même réseau /22."
assert est_privee("10.1.2.3") and est_privee("172.31.255.1") and est_privee("192.168.0.42"), "Adresses privées."
assert not est_privee("172.32.0.1") and not est_privee("8.8.8.8") and not est_privee("192.169.1.1"), "Adresses publiques."
assert "ipaddress" not in PROGRAMME, "Sans le module ipaddress."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-types-6-2" label="6.2 [Mini-projet] - Vérificateur de numéros" type="python">
<Enonce>
### Vérificateur de numéros

Beaucoup de numéros officiels contiennent une **clé de contrôle** qui détecte les fautes de frappe. Réaliser un module qui les vérifie (les boucles sont permises).

**Livres (ISBN-13)** : 13 chiffres ; la clé est le dernier chiffre. On multiplie les 12 premiers chiffres alternativement par 1 et par 3 (en commençant par 1) et on fait la somme ; la clé vaut `(10 - somme % 10) % 10`.

**Sécurité sociale** : 13 caractères suivis d'une clé de 2 chiffres valant `97 - (numéro % 97)`. Le premier chiffre donne le sexe (1 homme, 2 femme), les deux suivants l'année de naissance, puis deux pour le mois, puis deux pour le département. Pour les départements corses `2A` et `2B`, le calcul de la clé remplace `2A` par `19` et `2B` par `18`.

**Objectifs**
- `nettoyer(code)` : le code sans ses espaces ni ses tirets.
- `cle_isbn(debut)` : la clé d'un début d'ISBN de 12 chiffres ; `isbn_valide(code)` : vérifie un ISBN-13 (après nettoyage).
- `isbn10_vers_13(isbn10)` : convertit un ancien ISBN à 10 caractères en ISBN-13 : `978`, puis ses 9 premiers chiffres, puis la nouvelle clé.
- `cle_secu(numero13)` et `secu_valide(numero)` (après nettoyage, 15 caractères).
- `infos_secu(numero)` : le tuple `(sexe, mois, departement)`, avec `sexe` valant `"homme"` ou `"femme"`, `mois` un entier et `departement` un texte (`"2A"` compris).

<Indices>
<Indice>

Les fonctions s'appuient les unes sur les autres : `isbn_valide` utilise `nettoyer` et `cle_isbn`, `isbn10_vers_13` utilise `cle_isbn`.

</Indice>
<Indice>

Une tranche avec un pas sélectionne un chiffre sur deux : `debut[0::2]` et `debut[1::2]`.

</Indice>
<Indice>

Le remplacement corse se fait sur le texte, avant la conversion en entier : `.replace("2A", "19")`.

</Indice>
<Indice>

```text
(cœur du programme : les deux clés)
FONCTION cle_isbn(debut)
    somme ← 0
    POUR i ALLANT DE 0 À 11
        SI i pair ALORS somme ← somme + entier(debut[i]) SINON somme ← somme + 3 × entier(debut[i])
    RENVOYER (10 - somme % 10) % 10
FONCTION cle_secu(numero13)
    n ← entier(numero13 où "2A" devient "19" et "2B" devient "18")
    RENVOYER 97 - n % 97
```

</Indice>
</Indices>

<Correction>

```python
def nettoyer(code: str) -> str:
    return code.replace(" ", "").replace("-", "")


def cle_isbn(debut: str) -> int:
    somme = 0
    for i in range(12):
        somme = somme + int(debut[i]) * (1 if i % 2 == 0 else 3)
    return (10 - somme % 10) % 10


def isbn_valide(code: str) -> bool:
    code = nettoyer(code)
    return len(code) == 13 and code.isdigit() and cle_isbn(code[:12]) == int(code[12])


def isbn10_vers_13(isbn10: str) -> str:
    debut = "978" + nettoyer(isbn10)[:9]
    return debut + str(cle_isbn(debut))


def cle_secu(numero13: str) -> int:
    n = int(numero13.replace("2A", "19").replace("2B", "18"))
    return 97 - n % 97


def secu_valide(numero: str) -> bool:
    numero = nettoyer(numero)
    if len(numero) != 15 or not numero[13:].isdigit():
        return False
    corps = numero[:13].replace("2A", "19").replace("2B", "18")
    return corps.isdigit() and cle_secu(numero[:13]) == int(numero[13:])


def infos_secu(numero: str) -> tuple:
    numero = nettoyer(numero)
    sexe = "homme" if numero[0] == "1" else "femme"
    return (sexe, int(numero[3:5]), numero[5:7])
```

</Correction>
</Enonce>
<Verification>

```python
assert nettoyer("978-0 306-40615-7") == "9780306406157", "Nettoyage."
assert cle_isbn("978030640615") == 7 and isbn_valide("978-0-306-40615-7") is True, "ISBN valide."
assert isbn_valide("978-0-306-40615-8") is False and isbn_valide("978-0-306-4061") is False and isbn_valide("97803064061X7") is False, "ISBN invalides."
assert isbn10_vers_13("0-306-40615-2") == "9780306406157" and isbn10_vers_13("2-07-036822-X") == "9782070368228", "Conversion ISBN-10 vers 13."
assert cle_secu("2690549588157") == 80 and secu_valide("2 69 05 49 588 157 80") is True, "Numéro de sécurité sociale valide."
assert secu_valide("269054958815781") is False and secu_valide("26905495881578") is False, "Clé fausse ou longueur fausse."
corse = "1850" + "52A" + "123456"
cle = cle_secu(corse)
assert cle == 97 - int("1850519123456") % 97 and secu_valide(corse + f"{cle:02d}") is True, "Département corse 2A."
assert infos_secu("269054958815780") == ("femme", 5, "49") and infos_secu(corse + f"{cle:02d}") == ("homme", 5, "2A"), "Informations du numéro."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
