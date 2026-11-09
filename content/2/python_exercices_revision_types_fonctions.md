---
title: 'Révision : types et fonctions'
icon: "repeat"
chapter: Introduction à Python
badgeId: revision-types-fonctions
meta: 'Types, opérateurs, conditions et fonctions : 15 exercices pour réviser'
level: premiere
prerequisites:
  - python_exercices_types
  - python_exercices_fonctions
audience: public
groupe: revision-python
groupeTitre: "Révisions"
---

Cette fiche reprend les notions des fiches **Types en Python** et **Les Fonctions** avec des exercices nouveaux : trois par niveau, de **Introduction** à **Expert**.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="revision-types-fonctions" courseTitle="Révision : types et fonctions">

<ExerciseSection id="1nsi-revision-1-1" label="1.1 [Introduction] - Périmètre d'un rectangle" type="python">
<Enonce>
### Périmètre d'un rectangle

Écrire une fonction `perimetre(longueur, largeur)` qui renvoie le périmètre d'un rectangle.

Exemple : `perimetre(5, 3)` renvoie `16`.

<Indices>
<Indice>

Le périmètre est la longueur du tour du rectangle : deux longueurs et deux largeurs.

</Indice>
<Indice>

La fonction doit **renvoyer** la valeur avec `return`, pas l'afficher avec `print`.

</Indice>
<Indice>

```text
FONCTION perimetre(longueur, largeur)
    RENVOYER 2 × (longueur + largeur)
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def perimetre(longueur: float, largeur: float) -> float:
    return 2 * (longueur + largeur)
```

</Correction>
</Enonce>
<Verification>

```python
assert perimetre(5, 3) == 16, "perimetre(5, 3) vaut 16."
assert perimetre(1, 1) == 4, "Un carré de côté 1 a un périmètre de 4."
assert perimetre(2.5, 1) == 7.0, "perimetre(2.5, 1) vaut 7.0."
assert perimetre(0, 0) == 0, "perimetre(0, 0) vaut 0."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-1-2" label="1.2 [Introduction] - De km/h en m/s" type="python">
<Enonce>
### De km/h en m/s

Pour passer d'une vitesse en km/h à une vitesse en m/s, on divise par 3,6.

Écrire une fonction `kmh_vers_ms(vitesse)` qui renvoie la vitesse en m/s, **arrondie au dixième**.

Exemple : `kmh_vers_ms(90)` renvoie `25.0`.

<Indices>
<Indice>

En Python, le nombre 3,6 s'écrit `3.6`, avec un point.

</Indice>
<Indice>

`round(x, 1)` arrondit `x` au dixième.

</Indice>
<Indice>

```text
FONCTION kmh_vers_ms(vitesse)
    RENVOYER arrondi(vitesse / 3,6, 1 chiffre)
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def kmh_vers_ms(vitesse: float) -> float:
    return round(vitesse / 3.6, 1)
```

</Correction>
</Enonce>
<Verification>

```python
assert kmh_vers_ms(90) == 25.0, "kmh_vers_ms(90) vaut 25.0."
assert kmh_vers_ms(36) == 10.0, "kmh_vers_ms(36) vaut 10.0."
assert kmh_vers_ms(50) == 13.9, "kmh_vers_ms(50) vaut 13.9 (arrondi au dixième)."
assert kmh_vers_ms(0) == 0, "kmh_vers_ms(0) vaut 0."
assert type(kmh_vers_ms(90)) == float, "La fonction renvoie un float."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-1-3" label="1.3 [Introduction] - Initiales" type="python">
<Enonce>
### Initiales

Écrire une fonction `initiales(prenom, nom)` qui renvoie les initiales, chacune suivie d'un point.

Exemple : `initiales("Léa", "Dupont")` renvoie `"L.D."`.

<Indices>
<Indice>

Le premier caractère d'un texte `mot` s'obtient avec `mot[0]`.

</Indice>
<Indice>

Les textes se collent avec `+` : `"L" + "."` donne `"L."`.

</Indice>
<Indice>

```text
FONCTION initiales(prenom, nom)
    RENVOYER premier caractère de prenom + "." + premier caractère de nom + "."
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def initiales(prenom: str, nom: str) -> str:
    return prenom[0] + "." + nom[0] + "."
```

</Correction>
</Enonce>
<Verification>

```python
assert initiales("Léa", "Dupont") == "L.D.", "initiales(\"Léa\", \"Dupont\") vaut \"L.D.\"."
assert initiales("Sam", "Martin") == "S.M.", "initiales(\"Sam\", \"Martin\") vaut \"S.M.\"."
assert initiales("Éloi", "Ba") == "É.B.", "Les lettres accentuées restent telles quelles."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-2-1" label="2.1 [Facile] - Prix au kilo" type="python">
<Enonce>
### Prix au kilo

Au marché, les fruits sont vendus au kilo. Écrire une fonction `prix_total(prix_kilo, grammes)` qui renvoie le prix à payer pour `grammes` grammes, **arrondi au centime**.

Exemple : `prix_total(3.5, 500)` renvoie `1.75`.

<Indices>
<Indice>

1 kg = 1 000 g : 500 g, c'est `500 / 1000` kg.

</Indice>
<Indice>

Prix à payer = prix au kilo × masse en kilos, puis `round(..., 2)`.

</Indice>
<Indice>

```text
FONCTION prix_total(prix_kilo, grammes)
    RENVOYER arrondi(prix_kilo × grammes / 1000, 2 chiffres)
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def prix_total(prix_kilo: float, grammes: int) -> float:
    return round(prix_kilo * grammes / 1000, 2)
```

</Correction>
</Enonce>
<Verification>

```python
assert prix_total(3.5, 500) == 1.75, "prix_total(3.5, 500) vaut 1.75."
assert prix_total(2, 1000) == 2, "1 kg à 2 € coûte 2 €."
assert prix_total(4.99, 350) == 1.75, "prix_total(4.99, 350) vaut 1.75 (arrondi au centime)."
assert prix_total(12, 0) == 0, "0 g ne coûte rien."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-2-2" label="2.2 [Facile] - Peut voter ?" type="python">
<Enonce>
### Peut voter ?

En France, pour voter, il faut avoir au moins 18 ans et la nationalité française.

Écrire une fonction `peut_voter(age, nationalite)` qui renvoie `True` ou `False`, **sans utiliser `if`**.

Exemples : `peut_voter(20, "française")` renvoie `True` ; `peut_voter(16, "française")` renvoie `False`.

<Indices>
<Indice>

Une comparaison comme `age >= 18` est déjà un booléen : `True` ou `False`.

</Indice>
<Indice>

`and` combine deux booléens : le résultat est `True` seulement si les deux le sont.

</Indice>
<Indice>

```text
FONCTION peut_voter(age, nationalite)
    RENVOYER (age ≥ 18) ET (nationalite = "française")
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def peut_voter(age: int, nationalite: str) -> bool:
    return age >= 18 and nationalite == "française"
```

</Correction>
</Enonce>
<Verification>

```python
assert peut_voter(20, "française") is True, "20 ans et française : True."
assert peut_voter(18, "française") is True, "18 ans tout juste : True."
assert peut_voter(17, "française") is False, "17 ans : False."
assert peut_voter(30, "belge") is False, "Sans la nationalité française : False."
assert peut_voter(15, "italienne") is False, "Ni l'âge ni la nationalité : False."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-2-3" label="2.3 [Facile] - Nombre de chiffres" type="python">
<Enonce>
### Nombre de chiffres

Écrire une fonction `nb_chiffres(n)` qui renvoie le nombre de chiffres d'un entier positif `n`.

Exemple : `nb_chiffres(2026)` renvoie `4`.

<Indices>
<Indice>

Convertir le nombre en texte : `str(2026)` donne `"2026"`.

</Indice>
<Indice>

`len(texte)` donne le nombre de caractères d'un texte.

</Indice>
<Indice>

```text
FONCTION nb_chiffres(n)
    RENVOYER longueur(texte(n))
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def nb_chiffres(n: int) -> int:
    return len(str(n))
```

</Correction>
</Enonce>
<Verification>

```python
assert nb_chiffres(2026) == 4, "nb_chiffres(2026) vaut 4."
assert nb_chiffres(7) == 1, "nb_chiffres(7) vaut 1."
assert nb_chiffres(0) == 1, "0 s'écrit avec un chiffre."
assert nb_chiffres(1000000) == 7, "nb_chiffres(1000000) vaut 7."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-3-1" label="3.1 [Moyen] - Ressenti de la température" type="python">
<Enonce>
### Ressenti de la température

Écrire une fonction `ressenti(temperature)` qui renvoie :

- `"froid"` en dessous de 10 °C ;
- `"doux"` de 10 °C à 24 °C compris ;
- `"chaud"` à partir de 25 °C.

`temperature` peut être un nombre à virgule.

<Indices>
<Indice>

Trois cas : `if`, `elif`, `else`.

</Indice>
<Indice>

Bien regarder les bornes : 10 donne `"doux"`, 24,5 donne `"doux"`, 25 donne `"chaud"`.

</Indice>
<Indice>

```text
FONCTION ressenti(temperature)
    SI temperature < 10 ALORS RENVOYER "froid"
    SINON SI temperature < 25 ALORS RENVOYER "doux"
    SINON RENVOYER "chaud"
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def ressenti(temperature: float) -> str:
    if temperature < 10:
        return "froid"
    elif temperature < 25:
        return "doux"
    else:
        return "chaud"
```

</Correction>
</Enonce>
<Verification>

```python
assert ressenti(3) == "froid", "3 °C : froid."
assert ressenti(-5) == "froid", "-5 °C : froid."
assert ressenti(10) == "doux", "10 °C : doux (borne comprise)."
assert ressenti(24.5) == "doux", "24,5 °C : doux."
assert ressenti(25) == "chaud", "25 °C : chaud."
assert ressenti(9.9) == "froid", "9,9 °C : froid."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-3-2" label="3.2 [Moyen] - Ticket de parking" type="python">
<Enonce>
### Ticket de parking

Un parking est gratuit pendant la première heure. Ensuite, chaque heure **commencée** coûte 2 €.

Écrire une fonction `tarif_parking(minutes)` qui renvoie le prix à payer (un entier) pour une durée en minutes.

Exemples : `tarif_parking(45)` renvoie `0` ; `tarif_parking(61)` renvoie `2` ; `tarif_parking(120)` renvoie `2` ; `tarif_parking(121)` renvoie `4`.

<Indices>
<Indice>

D'abord retirer la première heure gratuite : il reste `minutes - 60` minutes payantes, si ce nombre est positif.

</Indice>
<Indice>

Nombre d'heures commencées pour `m` minutes payantes : `(m + 59) // 60`. Par exemple, 1 minute donne 1 heure, 60 minutes donnent 1 heure, 61 minutes donnent 2 heures.

</Indice>
<Indice>

```text
FONCTION tarif_parking(minutes)
    SI minutes ≤ 60 ALORS RENVOYER 0
    payantes ← minutes - 60
    heures ← (payantes + 59) // 60
    RENVOYER heures × 2
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def tarif_parking(minutes: int) -> int:
    if minutes <= 60:
        return 0
    payantes = minutes - 60
    heures = (payantes + 59) // 60
    return heures * 2
```

</Correction>
</Enonce>
<Verification>

```python
assert tarif_parking(45) == 0, "45 min : gratuit."
assert tarif_parking(60) == 0, "1 h tout juste : gratuit."
assert tarif_parking(61) == 2, "61 min : une heure payante commencée, 2 €."
assert tarif_parking(120) == 2, "2 h : une heure payante, 2 €."
assert tarif_parking(121) == 4, "2 h et 1 min : deux heures payantes commencées, 4 €."
assert tarif_parking(300) == 8, "5 h : quatre heures payantes, 8 €."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-3-3" label="3.3 [Moyen] - Fonctions qui s'appellent" type="python">
<Enonce>
### Fonctions qui s'appellent

Écrire trois fonctions, chacune utilisant la précédente :

- `carre(x)` renvoie `x` au carré ;
- `somme_carres(a, b)` renvoie `a² + b²`, **en appelant `carre`** ;
- `hypotenuse(a, b)` renvoie la longueur de l'hypoténuse d'un triangle rectangle de côtés `a` et `b` (théorème de Pythagore), **arrondie au centième**, en appelant `somme_carres`.

Exemple : `hypotenuse(3, 4)` renvoie `5.0`.

<Indices>
<Indice>

Une fonction peut en appeler une autre : `return carre(a) + carre(b)`.

</Indice>
<Indice>

La racine carrée de `x` s'écrit `x ** 0.5`.

</Indice>
<Indice>

```text
FONCTION carre(x)
    RENVOYER x × x
FONCTION somme_carres(a, b)
    RENVOYER carre(a) + carre(b)
FONCTION hypotenuse(a, b)
    RENVOYER arrondi(racine(somme_carres(a, b)), 2 chiffres)
```

</Indice>
</Indices>

<Correction>

```python
def carre(x: float) -> float:
    return x * x

def somme_carres(a: float, b: float) -> float:
    return carre(a) + carre(b)

def hypotenuse(a: float, b: float) -> float:
    return round(somme_carres(a, b) ** 0.5, 2)
```

</Correction>
</Enonce>
<Verification>

```python
assert carre(7) == 49 and carre(-3) == 9, "carre(7) vaut 49, carre(-3) vaut 9."
assert somme_carres(3, 4) == 25, "somme_carres(3, 4) vaut 25."
assert hypotenuse(3, 4) == 5.0, "hypotenuse(3, 4) vaut 5.0."
assert hypotenuse(1, 1) == 1.41, "hypotenuse(1, 1) vaut 1.41 (arrondi)."
assert hypotenuse(5, 12) == 13.0, "hypotenuse(5, 12) vaut 13.0."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-4-1" label="4.1 [Difficile] - Note sur 20" type="python">
<Enonce>
### Note sur 20

Un contrôle est noté sur `total` points. Écrire une fonction `note_sur_20(points, total)` qui renvoie la note ramenée sur 20, **arrondie au demi-point le plus proche** (15, 15.5, 16…).

Exemples : `note_sur_20(12, 15)` renvoie `16.0` ; `note_sur_20(7, 9)` renvoie `15.5`.

`total` est toujours strictement positif.

<Indices>
<Indice>

Sur 20 : `points / total * 20`. Pour `7 / 9 * 20`, cela donne `15.555...`.

</Indice>
<Indice>

Arrondir au demi-point : multiplier par 2, arrondir à l'entier, puis diviser par 2. `15.555... × 2 = 31.11...`, arrondi à `31`, divisé par 2 : `15.5`.

</Indice>
<Indice>

```text
FONCTION note_sur_20(points, total)
    note ← points / total × 20
    RENVOYER arrondi(note × 2) / 2
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def note_sur_20(points: float, total: float) -> float:
    note = points / total * 20
    return round(note * 2) / 2
```

</Correction>
</Enonce>
<Verification>

```python
assert note_sur_20(12, 15) == 16.0, "12/15 vaut 16 sur 20."
assert note_sur_20(7, 9) == 15.5, "7/9 vaut 15,55... : arrondi à 15.5."
assert note_sur_20(10, 30) == 6.5, "10/30 vaut 6,66... : arrondi à 6.5."
assert note_sur_20(17, 17) == 20.0, "Toutes les réponses justes : 20."
assert note_sur_20(0, 12) == 0.0, "Aucun point : 0."
assert note_sur_20(23, 40) == 11.5, "23/40 vaut 11,5."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-4-2" label="4.2 [Difficile] - Heure valide ?" type="python">
<Enonce>
### Heure valide ?

Une heure s'écrit sur cinq caractères, sous la forme `"hh:mm"`, par exemple `"08:05"` ou `"23:59"`.

Écrire une fonction `heure_valide(texte)` qui renvoie `True` si `texte` est une heure correcte, `False` sinon. Il faut :

- exactement 5 caractères, avec `:` au milieu ;
- des chiffres avant et après les deux-points ;
- des heures de 00 à 23 et des minutes de 00 à 59.

<Indices>
<Indice>

`texte[0:2]` donne les deux premiers caractères, `texte[3:5]` les deux derniers.

</Indice>
<Indice>

`"08".isdigit()` vaut `True` si le texte ne contient que des chiffres. Il faut le vérifier **avant** d'appeler `int(...)`, sinon `int("ab")` provoque une erreur.

</Indice>
<Indice>

```text
FONCTION heure_valide(texte)
    SI longueur(texte) ≠ 5 OU texte[2] ≠ ":" ALORS RENVOYER Faux
    hh ← texte[0:2] ; mm ← texte[3:5]
    SI hh ou mm contient autre chose que des chiffres ALORS RENVOYER Faux
    RENVOYER entier(hh) < 24 ET entier(mm) < 60
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def heure_valide(texte: str) -> bool:
    if len(texte) != 5 or texte[2] != ":":
        return False
    hh = texte[0:2]
    mm = texte[3:5]
    if not hh.isdigit() or not mm.isdigit():
        return False
    return int(hh) < 24 and int(mm) < 60
```

</Correction>
</Enonce>
<Verification>

```python
assert heure_valide("08:05") is True, "\"08:05\" est valide."
assert heure_valide("23:59") is True, "\"23:59\" est valide."
assert heure_valide("00:00") is True, "\"00:00\" est valide."
assert heure_valide("24:00") is False, "24 h n'existe pas."
assert heure_valide("12:60") is False, "60 minutes n'existe pas."
assert heure_valide("8:05") is False, "Il faut deux chiffres pour l'heure."
assert heure_valide("08h05") is False, "Le séparateur est « : »."
assert heure_valide("ab:cd") is False, "Des lettres ne forment pas une heure."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-4-3" label="4.3 [Difficile] - Facture d'eau" type="python">
<Enonce>
### Facture d'eau

Une commune facture l'eau par tranches, plus un abonnement de 50 € par an :

| Consommation | Prix du m³ |
|---|---|
| les 30 premiers m³ | 1,50 € |
| du 31ᵉ au 100ᵉ m³ | 2,00 € |
| au-delà de 100 m³ | 3,00 € |

Écrire une fonction `facture_eau(m3)` qui renvoie le montant de la facture annuelle, **arrondi au centime**.

Exemples : `facture_eau(20)` renvoie `80.0` ; `facture_eau(50)` renvoie `135.0`.

<Indices>
<Indice>

Pour 50 m³ : les 30 premiers coûtent `30 × 1,5 = 45` €, les 20 suivants `20 × 2 = 40` €, plus 50 € d'abonnement : 135 €.

</Indice>
<Indice>

Traiter les trois cas : jusqu'à 30, jusqu'à 100, au-delà. Les tranches précédentes sont alors complètes : 30 × 1,5 et 70 × 2.

</Indice>
<Indice>

```text
FONCTION facture_eau(m3)
    SI m3 ≤ 30 ALORS eau ← m3 × 1,5
    SINON SI m3 ≤ 100 ALORS eau ← 30 × 1,5 + (m3 - 30) × 2
    SINON eau ← 30 × 1,5 + 70 × 2 + (m3 - 100) × 3
    RENVOYER arrondi(eau + 50, 2 chiffres)
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def facture_eau(m3: float) -> float:
    if m3 <= 30:
        eau = m3 * 1.5
    elif m3 <= 100:
        eau = 30 * 1.5 + (m3 - 30) * 2
    else:
        eau = 30 * 1.5 + 70 * 2 + (m3 - 100) * 3
    return round(eau + 50, 2)
```

</Correction>
</Enonce>
<Verification>

```python
assert facture_eau(20) == 80.0, "20 m³ : 30 € d'eau + 50 € d'abonnement."
assert facture_eau(30) == 95.0, "30 m³ : 45 € + 50 €."
assert facture_eau(50) == 135.0, "50 m³ : 45 € + 40 € + 50 €."
assert facture_eau(100) == 235.0, "100 m³ : 45 € + 140 € + 50 €."
assert facture_eau(120) == 295.0, "120 m³ : 45 € + 140 € + 60 € + 50 €."
assert facture_eau(0) == 50.0, "Sans consommation, l'abonnement reste dû."
assert facture_eau(12.4) == 68.6, "12,4 m³ : 18,60 € + 50 €."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-5-1" label="5.1 [Expert] - Temps de lecture" type="python">
<Enonce>
### Temps de lecture

Un lecteur lit 200 mots par minute. Écrire une fonction `temps_de_lecture(nb_mots)` qui renvoie le temps de lecture sous forme de texte, **arrondi à la seconde** :

- moins d'une minute : `"45 s"` ;
- un nombre exact de minutes : `"3 min"` ;
- sinon : `"3 min 20 s"`.

Exemples : `temps_de_lecture(150)` renvoie `"45 s"` ; `temps_de_lecture(600)` renvoie `"3 min"` ; `temps_de_lecture(666)` renvoie `"3 min 20 s"`.

<Indices>
<Indice>

À 200 mots par minute, un mot prend 60 / 200 = 0,3 seconde. Le temps total en secondes est `round(nb_mots * 0.3)`.

</Indice>
<Indice>

Avec le temps total en secondes : `// 60` donne les minutes et `% 60` les secondes restantes. Il reste à construire le bon texte selon le cas.

</Indice>
<Indice>

```text
FONCTION temps_de_lecture(nb_mots)
    total ← arrondi(nb_mots × 0,3)
    minutes ← total // 60 ; secondes ← total % 60
    SI minutes = 0 ALORS RENVOYER texte(secondes) + " s"
    SI secondes = 0 ALORS RENVOYER texte(minutes) + " min"
    RENVOYER texte(minutes) + " min " + texte(secondes) + " s"
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def temps_de_lecture(nb_mots: int) -> str:
    total = round(nb_mots * 0.3)
    minutes = total // 60
    secondes = total % 60
    if minutes == 0:
        return str(secondes) + " s"
    if secondes == 0:
        return str(minutes) + " min"
    return str(minutes) + " min " + str(secondes) + " s"
```

</Correction>
</Enonce>
<Verification>

```python
assert temps_de_lecture(150) == "45 s", "150 mots : 45 s."
assert temps_de_lecture(600) == "3 min", "600 mots : 3 min tout juste."
assert temps_de_lecture(666) == "3 min 20 s", "666 mots : 199,8 s, arrondi à 3 min 20 s."
assert temps_de_lecture(200) == "1 min", "200 mots : 1 min."
assert temps_de_lecture(10) == "3 s", "10 mots : 3 s."
assert temps_de_lecture(1001) == "5 min", "1001 mots : 300,3 s, arrondi à 5 min."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-5-2" label="5.2 [Expert] - Lendemain d'une date" type="python">
<Enonce>
### Lendemain d'une date

Écrire deux fonctions :

- `nb_jours(mois, annee)` renvoie le nombre de jours du mois (28, 29, 30 ou 31) ;
- `lendemain(jour, mois, annee)` renvoie la date du lendemain sous la forme `"jj/mm/aaaa"`, avec deux chiffres pour le jour et le mois.

Une année est bissextile si elle est divisible par 4 mais pas par 100, ou si elle est divisible par 400.

Exemples : `lendemain(31, 12, 2026)` renvoie `"01/01/2027"` ; `lendemain(28, 2, 2028)` renvoie `"29/02/2028"`.

<Indices>
<Indice>

Avril, juin, septembre et novembre ont 30 jours ; février en a 28, ou 29 les années bissextiles ; les autres mois ont 31 jours.

</Indice>
<Indice>

Ajouter 1 au jour. S'il dépasse `nb_jours(mois, annee)`, revenir au jour 1 du mois suivant ; si le mois dépasse 12, revenir à janvier de l'année suivante. Pour écrire `5` sur deux chiffres : `f"{5:02d}"` donne `"05"`.

</Indice>
<Indice>

```text
FONCTION nb_jours(mois, annee)
    SI mois = 2 ALORS RENVOYER 29 si annee bissextile, sinon 28
    SI mois dans (4, 6, 9, 11) ALORS RENVOYER 30
    RENVOYER 31
FONCTION lendemain(jour, mois, annee)
    jour ← jour + 1
    SI jour > nb_jours(mois, annee) ALORS jour ← 1 ; mois ← mois + 1
    SI mois > 12 ALORS mois ← 1 ; annee ← annee + 1
    RENVOYER jour sur 2 chiffres + "/" + mois sur 2 chiffres + "/" + annee
```

</Indice>
</Indices>

<Correction>

```python
def nb_jours(mois: int, annee: int) -> int:
    if mois == 2:
        bissextile = (annee % 4 == 0 and annee % 100 != 0) or annee % 400 == 0
        if bissextile:
            return 29
        return 28
    if mois == 4 or mois == 6 or mois == 9 or mois == 11:
        return 30
    return 31

def lendemain(jour: int, mois: int, annee: int) -> str:
    jour = jour + 1
    if jour > nb_jours(mois, annee):
        jour = 1
        mois = mois + 1
    if mois > 12:
        mois = 1
        annee = annee + 1
    return f"{jour:02d}/{mois:02d}/{annee}"
```

</Correction>
</Enonce>
<Verification>

```python
assert nb_jours(1, 2026) == 31 and nb_jours(4, 2026) == 30, "Janvier : 31 jours, avril : 30 jours."
assert nb_jours(2, 2026) == 28 and nb_jours(2, 2028) == 29, "Février 2026 : 28 jours, février 2028 : 29 jours."
assert nb_jours(2, 1900) == 28 and nb_jours(2, 2000) == 29, "1900 n'est pas bissextile, 2000 l'est."
assert lendemain(9, 11, 2026) == "10/11/2026", "Lendemain du 9/11/2026."
assert lendemain(5, 3, 2026) == "06/03/2026", "Le jour et le mois s'écrivent sur deux chiffres."
assert lendemain(30, 4, 2026) == "01/05/2026", "Après le 30 avril vient le 1er mai."
assert lendemain(31, 12, 2026) == "01/01/2027", "Après le 31 décembre vient le 1er janvier."
assert lendemain(28, 2, 2028) == "29/02/2028" and lendemain(28, 2, 2027) == "01/03/2027", "Février bissextile ou non."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-revision-5-3" label="5.3 [Expert] - Mot de passe solide" type="python">
<Enonce>
### Mot de passe solide

Un mot de passe est jugé solide s'il contient :

- au moins 8 caractères ;
- au moins une lettre minuscule ;
- au moins une lettre majuscule ;
- au moins un chiffre.

Écrire une fonction `mot_de_passe_solide(mdp)` qui renvoie `True` si le mot de passe est solide, `False` sinon.

Exemples : `mot_de_passe_solide("Renard2026")` renvoie `True` ; `mot_de_passe_solide("renard2026")` renvoie `False`.

<Indices>
<Indice>

Parcourir les caractères avec `for c in mdp:` et noter ce qui a été rencontré dans trois booléens, qui valent `False` au départ.

</Indice>
<Indice>

`c.islower()`, `c.isupper()` et `c.isdigit()` disent si le caractère `c` est une minuscule, une majuscule ou un chiffre.

</Indice>
<Indice>

```text
FONCTION mot_de_passe_solide(mdp)
    minuscule ← Faux ; majuscule ← Faux ; chiffre ← Faux
    POUR chaque caractère c de mdp
        SI c est une minuscule ALORS minuscule ← Vrai
        SI c est une majuscule ALORS majuscule ← Vrai
        SI c est un chiffre ALORS chiffre ← Vrai
    RENVOYER longueur(mdp) ≥ 8 ET minuscule ET majuscule ET chiffre
FIN FONCTION
```

</Indice>
</Indices>

<Correction>

```python
def mot_de_passe_solide(mdp: str) -> bool:
    minuscule = False
    majuscule = False
    chiffre = False
    for c in mdp:
        if c.islower():
            minuscule = True
        if c.isupper():
            majuscule = True
        if c.isdigit():
            chiffre = True
    return len(mdp) >= 8 and minuscule and majuscule and chiffre
```

</Correction>
</Enonce>
<Verification>

```python
assert mot_de_passe_solide("Renard2026") is True, "\"Renard2026\" est solide."
assert mot_de_passe_solide("renard2026") is False, "Pas de majuscule."
assert mot_de_passe_solide("RENARD2026") is False, "Pas de minuscule."
assert mot_de_passe_solide("RenardRoux") is False, "Pas de chiffre."
assert mot_de_passe_solide("Ren4rd") is False, "Moins de 8 caractères."
assert mot_de_passe_solide("aB3aB3aB") is True, "8 caractères tout juste, avec les trois sortes : solide."
assert mot_de_passe_solide("") is False, "Le mot de passe vide n'est pas solide."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
