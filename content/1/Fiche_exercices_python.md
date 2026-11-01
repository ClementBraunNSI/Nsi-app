---
title: 'Fiche d''exercices : Python'
description: 'Premiers pas avec Python : variables, input/output, et calculs simples.'
level: seconde
chapter: Programmation Python
icon: "code"
prerequisites:
  - Fiche_exercices_conditions
audience: public
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="fiche-python" courseTitle="Fiche Python">

<ExerciseSection id="snt-py-1-1" label="1.1 [Introduction] - Panneau d'accueil" type="python">
<Enonce>
### Panneau d'accueil

Afficher exactement ces deux lignes :

```
Bienvenue dans la tanière du code
Bonne séance !
```

<Indices>
<Indice>

Une instruction `print(...)` affiche une ligne. Le texte s'écrit entre guillemets.

</Indice>
<Indice>

```text
AFFICHER "Bienvenue dans la tanière du code"
AFFICHER "Bonne séance !"
```

</Indice>
</Indices>

<Correction>

```python
print("Bienvenue dans la tanière du code")
print("Bonne séance !")
```

</Correction>
</Enonce>
<Verification>

```python
lignes = [l.strip() for l in SORTIE.strip().splitlines()]
assert lignes == ["Bienvenue dans la tanière du code", "Bonne séance !"], "Les deux lignes s'affichent, dans l'ordre, sans faute."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-1-2" label="1.2 [Introduction] - Fiche d'identité" type="python">
<Enonce>
### Fiche d'identité

Un renard s'appelle **Roux**, a **4** ans et vit à **Strasbourg**.

1. Ranger ces informations dans trois variables `nom`, `age` (un entier) et `ville`.
2. Afficher une phrase qui utilise les trois variables, par exemple : `Roux a 4 ans et vit à Strasbourg.`

<Indices>
<Indice>

Une variable se crée avec `=`, avec le nom à gauche et la valeur à droite. Un texte s'écrit entre guillemets, mais pas un nombre.

</Indice>
<Indice>

`print` accepte plusieurs valeurs séparées par des virgules : il les affiche avec un espace entre chacune.

</Indice>
<Indice>

```text
nom ← "Roux"
age ← 4
ville ← "Strasbourg"
AFFICHER nom, "a", age, "ans et vit à", ville
```

</Indice>
</Indices>

<Correction>

```python
nom = "Roux"
age = 4
ville = "Strasbourg"
print(nom, "a", age, "ans et vit à", ville + ".")
```

</Correction>
</Enonce>
<Verification>

```python
assert nom == "Roux" and ville == "Strasbourg", "nom et ville contiennent les bons textes."
assert age == 4 and type(age) == int, "age est l'entier 4, sans guillemets."
assert "Roux" in SORTIE and "4" in SORTIE and "Strasbourg" in SORTIE, "La phrase affichée reprend le nom, l'âge et la ville."
assert "print(\"Roux a 4" not in PROGRAMME, "La phrase utilise les variables au lieu de recopier le texte."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-1-3" label="1.3 [Introduction] - La nuit du renard" type="python">
<Enonce>
### La nuit du renard

Un renard parcourt **12 km** chaque nuit.

Calculer avec Python, sans faire le calcul de tête :
- `semaine` : la distance parcourue en 7 nuits ;
- `annee` : la distance parcourue en 365 nuits.

Afficher ensuite les deux distances.

<Indices>
<Indice>

Commencer par ranger 12 dans une variable `par_nuit` : les deux calculs l'utilisent.

</Indice>
<Indice>

La multiplication s'écrit `*`.

</Indice>
<Indice>

```text
par_nuit ← 12
semaine ← par_nuit × 7
annee ← par_nuit × 365
AFFICHER semaine
AFFICHER annee
```

</Indice>
</Indices>

<Correction>

```python
par_nuit = 12
semaine = par_nuit * 7
annee = par_nuit * 365
print(semaine)
print(annee)
```

</Correction>
</Enonce>
<Verification>

```python
assert semaine == 84, "semaine vaut 12 × 7."
assert annee == 4380, "annee vaut 12 × 365."
assert "84" in SORTIE and "4380" in SORTIE, "Les deux distances s'affichent."
assert "84" not in PROGRAMME and "4380" not in PROGRAMME, "Python fait le calcul : les résultats ne sont pas écrits dans le code."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-1-4" label="1.4 [Introduction] - Échanger deux valeurs" type="python">
<Enonce>
### Échanger deux valeurs

Le programme demande deux nombres entiers et les range dans `a` et `b`.

Échanger le contenu des deux variables, puis afficher `a` et `b`.

Exemple : avec `3` puis `8`, le programme affiche `8` puis `3`.

<Indices>
<Indice>

Écrire `a = b` efface l'ancienne valeur de `a` : il faut la mettre de côté avant.

</Indice>
<Indice>

Une troisième variable, `temporaire`, peut garder l'ancienne valeur de `a` le temps de l'échange.

</Indice>
<Indice>

```text
LIRE a (entier)
LIRE b (entier)
temporaire ← a
a ← b
b ← temporaire
AFFICHER a
AFFICHER b
```

</Indice>
</Indices>

<Correction>

```python
a = int(input("Premier nombre : "))
b = int(input("Deuxième nombre : "))
temporaire = a
a = b
b = temporaire
print(a)
print(b)
```

</Correction>
</Enonce>
<CodeDepart>

```python
a = int(input("Premier nombre : "))
b = int(input("Deuxième nombre : "))
```

</CodeDepart>
<Verification>

```python
ENTREES = ["3", "8"]
assert a == 8 and b == 3, "Avec 3 et 8 : a vaut 8 et b vaut 3."
autre, _ = relancer(["-5", "12"])
assert autre["a"] == 12 and autre["b"] == -5, "Avec -5 et 12 : a vaut 12 et b vaut -5."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-2-1" label="2.1 [Facile] - Bonjour personnalisé" type="python">
<Enonce>
### Bonjour personnalisé

Demander le prénom de l'utilisateur, puis ranger dans `message` une salutation de la forme `Bonjour Léa !` et l'afficher.

<Indices>
<Indice>

`input("Prénom : ")` affiche la question et renvoie ce que l'utilisateur tape, sous forme de texte.

</Indice>
<Indice>

Deux textes se collent avec `+`. Ne pas oublier les espaces et le point d'exclamation.

</Indice>
<Indice>

```text
LIRE prenom
message ← "Bonjour " + prenom + " !"
AFFICHER message
```

</Indice>
</Indices>

<Correction>

```python
prenom = input("Prénom : ")
message = "Bonjour " + prenom + " !"
print(message)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["Léa"]
assert message == "Bonjour Léa !", "Avec Léa : message vaut « Bonjour Léa ! »."
assert "Bonjour Léa !" in SORTIE, "Le message s'affiche."
autre, _ = relancer(["Malik"])
assert autre["message"] == "Bonjour Malik !", "Avec Malik : message vaut « Bonjour Malik ! »."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-2-2" label="2.2 [Facile] - Quel âge en 2026 ?" type="python">
<Enonce>
### Quel âge en 2026 ?

Demander l'année de naissance, puis calculer dans `age` l'âge atteint en 2026 et l'afficher.

Par exemple, une personne née en 2010 a `16` ans en 2026.

<Indices>
<Indice>

`input` renvoie toujours du texte : `"2010"` n'est pas le nombre 2010. Il faut le convertir avec `int(...)` avant de calculer.

</Indice>
<Indice>

L'âge est la différence entre 2026 et l'année de naissance.

</Indice>
<Indice>

```text
LIRE naissance (entier)
age ← 2026 - naissance
AFFICHER age
```

</Indice>
</Indices>

<Correction>

```python
naissance = int(input("Année de naissance : "))
age = 2026 - naissance
print("Âge en 2026 :", age)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["2010"]
assert age == 16, "Né en 2010 : 16 ans en 2026."
assert "16" in SORTIE, "L'âge s'affiche."
autre, _ = relancer(["1985"])
assert autre["age"] == 41, "Né en 1985 : 41 ans en 2026."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-2-3" label="2.3 [Facile] - Prix d'un panier" type="python">
<Enonce>
### Prix d'un panier

Demander le prix d'un article (il peut avoir des centimes, par exemple `2.5`) puis la quantité achetée (un entier).

Calculer dans `total` le prix à payer et l'afficher.

<Indices>
<Indice>

Un prix à virgule se convertit avec `float(...)`, une quantité avec `int(...)`.

</Indice>
<Indice>

En Python, la virgule des nombres s'écrit avec un point : `2.5`.

</Indice>
<Indice>

```text
LIRE prix (nombre à virgule)
LIRE quantite (entier)
total ← prix × quantite
AFFICHER total
```

</Indice>
</Indices>

<Correction>

```python
prix = float(input("Prix d'un article : "))
quantite = int(input("Quantité : "))
total = prix * quantite
print("Total :", total, "€")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["2.5", "4"]
assert total == 10, "2,50 € × 4 = 10 €."
autre, _ = relancer(["1.2", "3"])
assert abs(autre["total"] - 3.6) < 1e-9, "1,20 € × 3 = 3,60 €."
assert type(quantite) == int, "La quantité est convertie en entier."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-2-4" label="2.4 [Facile] - Moyenne de trois notes" type="python">
<Enonce>
### Moyenne de trois notes

Demander trois notes (elles peuvent être à virgule), calculer leur moyenne dans `moyenne`, **arrondie à 2 chiffres après la virgule**, et l'afficher.

<Indices>
<Indice>

Attention aux priorités : `a + b + c / 3` ne divise que `c`. Il faut donc des parenthèses.

</Indice>
<Indice>

`round(valeur, 2)` arrondit à 2 chiffres après la virgule.

</Indice>
<Indice>

```text
LIRE n1, n2, n3 (nombres à virgule)
moyenne ← arrondi((n1 + n2 + n3) / 3, 2 chiffres)
AFFICHER moyenne
```

</Indice>
</Indices>

<Correction>

```python
n1 = float(input("Note 1 : "))
n2 = float(input("Note 2 : "))
n3 = float(input("Note 3 : "))
moyenne = round((n1 + n2 + n3) / 3, 2)
print("Moyenne :", moyenne)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["12", "15", "9"]
assert moyenne == 12, "Moyenne de 12, 15 et 9 : 12."
autre, _ = relancer(["10", "11", "15.5"])
assert autre["moyenne"] == 12.17, "Moyenne de 10, 11 et 15,5 : 12,17 (arrondie)."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-3-1" label="3.1 [Moyen] - Durée d'un film" type="python">
<Enonce>
### Durée d'un film

Demander la durée d'un film en minutes (un entier).

Calculer `heures` et `minutes` pour l'écrire en heures et minutes, puis afficher par exemple `2 h 15 min` pour `135`.

<Indices>
<Indice>

`//` donne le quotient d'une division entière et `%` son reste : `135 // 60` vaut `2`, `135 % 60` vaut `15`.

</Indice>
<Indice>

Une heure compte 60 minutes.

</Indice>
<Indice>

```text
LIRE duree (entier)
heures ← quotient de duree par 60
minutes ← reste de duree par 60
AFFICHER heures, "h", minutes, "min"
```

</Indice>
</Indices>

<Correction>

```python
duree = int(input("Durée en minutes : "))
heures = duree // 60
minutes = duree % 60
print(heures, "h", minutes, "min")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["135"]
assert heures == 2 and minutes == 15, "135 min = 2 h 15 min."
assert "2 h 15 min" in SORTIE, "Le programme affiche « 2 h 15 min »."
autre, _ = relancer(["59"])
assert autre["heures"] == 0 and autre["minutes"] == 59, "59 min = 0 h 59 min."
autre, _ = relancer(["240"])
assert autre["heures"] == 4 and autre["minutes"] == 0, "240 min = 4 h 0 min."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-3-2" label="3.2 [Moyen] - Commande de pizzas" type="python">
<Enonce>
### Commande de pizzas

Une pizza est coupée en **8 parts** et chaque élève mange une part.

Demander le nombre d'élèves, puis calculer :
- `pizzas` : le nombre de pizzas à commander pour que chacun ait sa part ;
- `restes` : le nombre de parts qui resteront.

Exemple : pour 19 élèves, il faut 3 pizzas et il restera 5 parts.

<Indices>
<Indice>

`19 // 8` vaut `2` : deux pizzas ne suffisent pas. Il faut arrondir au-dessus.

</Indice>
<Indice>

Ajouter 7 élèves « fictifs » avant la division entière arrondit au-dessus : `(19 + 7) // 8` vaut `3`.

</Indice>
<Indice>

Les parts restantes s'obtiennent en retirant les parts mangées de toutes les parts commandées.

</Indice>
<Indice>

```text
LIRE eleves (entier)
pizzas ← quotient de (eleves + 7) par 8
restes ← pizzas × 8 - eleves
AFFICHER pizzas, restes
```

</Indice>
</Indices>

<Correction>

```python
eleves = int(input("Nombre d'élèves : "))
pizzas = (eleves + 7) // 8
restes = pizzas * 8 - eleves
print(pizzas, "pizzas,", restes, "parts en trop")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["19"]
assert pizzas == 3 and restes == 5, "19 élèves : 3 pizzas, 5 parts restantes."
for n, p, r in [(16, 2, 0), (1, 1, 7), (25, 4, 7)]:
    autre, _ = relancer([str(n)])
    assert autre["pizzas"] == p and autre["restes"] == r, f"{n} élèves : {p} pizzas et {r} parts restantes."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-3-3" label="3.3 [Moyen] - Thermomètre américain" type="python">
<Enonce>
### Thermomètre américain

Aux États-Unis, la température se donne en degrés Fahrenheit : on multiplie les degrés Celsius par 9, on divise par 5, puis on ajoute 32.

Demander une température en Celsius (à virgule possible) et ranger dans `fahrenheit` sa valeur convertie, puis l'afficher.

<Indices>
<Indice>

Écrire la formule dans l'ordre de la phrase : multiplication, division, puis addition.

</Indice>
<Indice>

Pour vérifier : 100 °C donnent 212 °F, et 0 °C donnent 32 °F.

</Indice>
<Indice>

```text
LIRE celsius (nombre à virgule)
fahrenheit ← celsius × 9 / 5 + 32
AFFICHER fahrenheit
```

</Indice>
</Indices>

<Correction>

```python
celsius = float(input("Température en °C : "))
fahrenheit = celsius * 9 / 5 + 32
print(fahrenheit, "°F")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["100"]
assert fahrenheit == 212, "100 °C = 212 °F."
for c, f in [(0, 32), (-40, -40), (37.5, 99.5)]:
    autre, _ = relancer([str(c)])
    assert abs(autre["fahrenheit"] - f) < 1e-9, f"{c} °C = {f} °F."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-3-4" label="3.4 [Moyen] - Initiales" type="python">
<Enonce>
### Initiales

Demander un prénom puis un nom, et ranger dans `initiales` les deux initiales en majuscules suivies d'un point.

Exemple : `léa` et `dupont` donnent `L.D.`

<Indices>
<Indice>

Les caractères d'un texte sont numérotés à partir de 0 : `mot[0]` est la première lettre.

</Indice>
<Indice>

`texte.upper()` renvoie le texte en majuscules.

</Indice>
<Indice>

```text
LIRE prenom
LIRE nom
initiales ← majuscule(prenom[0]) + "." + majuscule(nom[0]) + "."
AFFICHER initiales
```

</Indice>
</Indices>

<Correction>

```python
prenom = input("Prénom : ")
nom = input("Nom : ")
initiales = prenom[0].upper() + "." + nom[0].upper() + "."
print(initiales)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["léa", "dupont"]
assert initiales == "L.D.", "léa dupont donne L.D."
autre, _ = relancer(["Yanis", "martin"])
assert autre["initiales"] == "Y.M.", "Yanis martin donne Y.M."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-4-1" label="4.1 [Difficile] - Chronomètre" type="python">
<Enonce>
### Chronomètre

Demander une durée en secondes, puis calculer `h`, `m` et `s` pour l'écrire en heures, minutes et secondes.

Afficher par exemple `1 h 2 min 5 s` pour `3725`.

<Indices>
<Indice>

Une heure compte 3600 secondes : `3725 // 3600` donne les heures.

</Indice>
<Indice>

Ce qui reste après les heures (`3725 % 3600`) se découpe ensuite en minutes et secondes.

</Indice>
<Indice>

```text
LIRE total (entier)
h ← quotient de total par 3600
reste ← reste de total par 3600
m ← quotient de reste par 60
s ← reste de reste par 60
AFFICHER h, "h", m, "min", s, "s"
```

</Indice>
</Indices>

<Correction>

```python
total = int(input("Durée en secondes : "))
h = total // 3600
reste = total % 3600
m = reste // 60
s = reste % 60
print(h, "h", m, "min", s, "s")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["3725"]
assert (h, m, s) == (1, 2, 5), "3725 s = 1 h 2 min 5 s."
assert "1 h 2 min 5 s" in SORTIE, "Le programme affiche « 1 h 2 min 5 s »."
for t, attendu in [(59, (0, 0, 59)), (7200, (2, 0, 0)), (86399, (23, 59, 59))]:
    autre, _ = relancer([str(t)])
    assert (autre["h"], autre["m"], autre["s"]) == attendu, f"{t} s = {attendu[0]} h {attendu[1]} min {attendu[2]} s."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-4-2" label="4.2 [Difficile] - Distance à vol d'oiseau" type="python">
<Enonce>
### Distance à vol d'oiseau

Sur un plan, le terrier est en `(xA, yA)` et la ferme en `(xB, yB)`.

Demander les quatre coordonnées (dans l'ordre `xA`, `yA`, `xB`, `yB`), calculer dans `distance` la distance entre les deux points, **arrondie au centième**, et l'afficher.

Rappel : la distance vaut la racine carrée de `(xB - xA)² + (yB - yA)²`.

<Indices>
<Indice>

`x ** 2` calcule un carré et `x ** 0.5` une racine carrée.

</Indice>
<Indice>

Calculer d'abord les deux écarts `dx` et `dy`, puis la distance : le code reste ainsi lisible.

</Indice>
<Indice>

```text
LIRE xA, yA, xB, yB (nombres à virgule)
dx ← xB - xA
dy ← yB - yA
distance ← arrondi(racine(dx² + dy²), 2 chiffres)
AFFICHER distance
```

</Indice>
</Indices>

<Correction>

```python
xA = float(input("xA : "))
yA = float(input("yA : "))
xB = float(input("xB : "))
yB = float(input("yB : "))
dx = xB - xA
dy = yB - yA
distance = round((dx ** 2 + dy ** 2) ** 0.5, 2)
print("Distance :", distance)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["0", "0", "3", "4"]
assert distance == 5, "De (0, 0) à (3, 4) : 5."
autre, _ = relancer(["1", "2", "4", "-2"])
assert autre["distance"] == 5, "De (1, 2) à (4, -2) : 5."
autre, _ = relancer(["0", "0", "1", "1"])
assert autre["distance"] == 1.41, "De (0, 0) à (1, 1) : 1,41."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-4-3" label="4.3 [Difficile] - Rendu de monnaie" type="python">
<Enonce>
### Rendu de monnaie

Une caisse rend la monnaie avec des billets de 10 €, des pièces de 2 € et des pièces de 1 €, en utilisant le moins de pièces et de billets possible.

Demander la somme à rendre (un entier), puis calculer `billets_10`, `pieces_2` et `pieces_1`.

Exemple : pour 27 €, la caisse rend 2 billets de 10 €, 3 pièces de 2 € et 1 pièce de 1 €.

<Indices>
<Indice>

Commencer par la plus grande valeur : combien de billets de 10 € tiennent dans la somme ?

</Indice>
<Indice>

Ce qui reste après les billets (`%`) se rend ensuite en pièces de 2 €, puis le dernier reste en pièces de 1 €.

</Indice>
<Indice>

```text
LIRE somme (entier)
billets_10 ← quotient de somme par 10
reste ← reste de somme par 10
pieces_2 ← quotient de reste par 2
pieces_1 ← reste de reste par 2
AFFICHER billets_10, pieces_2, pieces_1
```

</Indice>
</Indices>

<Correction>

```python
somme = int(input("Somme à rendre : "))
billets_10 = somme // 10
reste = somme % 10
pieces_2 = reste // 2
pieces_1 = reste % 2
print(billets_10, "billets de 10 €,", pieces_2, "pièces de 2 €,", pieces_1, "pièce de 1 €")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["27"]
assert (billets_10, pieces_2, pieces_1) == (2, 3, 1), "27 € : 2 billets, 3 pièces de 2 €, 1 pièce de 1 €."
for n, attendu in [(10, (1, 0, 0)), (9, (0, 4, 1)), (134, (13, 2, 0))]:
    autre, _ = relancer([str(n)])
    assert (autre["billets_10"], autre["pieces_2"], autre["pieces_1"]) == attendu, f"{n} € : {attendu}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-4-4" label="4.4 [Difficile] - Taux de réussite" type="python">
<Enonce>
### Taux de réussite

Demander le nombre de tests réussis puis le nombre total de tests.

Calculer `pourcentage`, le taux de réussite en pourcentage **arrondi à une décimale**, puis ranger dans `bilan` un texte de la forme `7/9 soit 77.8 %` et l'afficher.

<Indices>
<Indice>

Le pourcentage s'obtient en divisant le nombre de tests réussis par le total, puis en multipliant par 100.

</Indice>
<Indice>

Un nombre ne se colle pas à un texte avec `+` : `str(7)` le transforme d'abord en texte `"7"`.

</Indice>
<Indice>

```text
LIRE reussis, total (entiers)
pourcentage ← arrondi(reussis / total × 100, 1 chiffre)
bilan ← texte(reussis) + "/" + texte(total) + " soit " + texte(pourcentage) + " %"
AFFICHER bilan
```

</Indice>
</Indices>

<Correction>

```python
reussis = int(input("Tests réussis : "))
total = int(input("Nombre de tests : "))
pourcentage = round(reussis / total * 100, 1)
bilan = str(reussis) + "/" + str(total) + " soit " + str(pourcentage) + " %"
print(bilan)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["7", "9"]
assert pourcentage == 77.8, "7 sur 9 : 77,8 %."
assert bilan == "7/9 soit 77.8 %", "bilan vaut « 7/9 soit 77.8 % »."
autre, _ = relancer(["3", "4"])
assert autre["bilan"] == "3/4 soit 75.0 %", "3 sur 4 : « 3/4 soit 75.0 % »."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-5-1" label="5.1 [Expert] - Nombre à l'envers" type="python">
<Enonce>
### Nombre à l'envers

Demander un nombre entier de **trois chiffres** et ranger dans `envers` le nombre obtenu en lisant ses chiffres de droite à gauche (un entier, pas un texte).

Exemple : `472` donne `274`, et `350` donne `53`.

Contrainte : n'utiliser que des calculs (`//` et `%`), sans transformer le nombre en texte.

<Indices>
<Indice>

`% 10` donne le chiffre des unités, `// 10` enlève ce chiffre.

</Indice>
<Indice>

Une fois les trois chiffres isolés, recomposer : l'ancien chiffre des unités devient celui des centaines.

</Indice>
<Indice>

```text
LIRE n (entier)
unites ← reste de n par 10
dizaines ← reste de (quotient de n par 10) par 10
centaines ← quotient de n par 100
envers ← unites × 100 + dizaines × 10 + centaines
AFFICHER envers
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Nombre à trois chiffres : "))
unites = n % 10
dizaines = (n // 10) % 10
centaines = n // 100
envers = unites * 100 + dizaines * 10 + centaines
print(envers)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["472"]
assert envers == 274, "472 donne 274."
assert type(envers) == int, "envers est un entier."
for n, e in [(350, 53), (101, 101), (999, 999), (120, 21)]:
    autre, _ = relancer([str(n)])
    assert autre["envers"] == e, f"{n} donne {e}."
assert "str(" not in PROGRAMME and "[::-1]" not in PROGRAMME, "Le calcul se fait avec // et %, sans passer par un texte."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-5-2" label="5.2 [Expert] - Quel siècle ?" type="python">
<Enonce>
### Quel siècle ?

Demander une année (positive) et ranger dans `siecle` le numéro du siècle auquel elle appartient.

Attention aux années rondes : l'an `1900` appartient au XIXᵉ siècle (19), l'an `1901` au XXᵉ (20), l'an `2026` au XXIᵉ (21).

Contrainte : une seule formule de calcul, sans condition.

<Indices>
<Indice>

`annee // 100` donne 19 pour 1950 : il manque 1. Mais pour 1900, ajouter 1 donnerait 20, ce qui est faux.

</Indice>
<Indice>

Décaler d'abord l'année d'une unité règle le cas des années rondes : 1900 se comporte alors comme 1899.

</Indice>
<Indice>

```text
LIRE annee (entier)
siecle ← quotient de (annee - 1) par 100, plus 1
AFFICHER siecle
```

</Indice>
</Indices>

<Correction>

```python
annee = int(input("Année : "))
siecle = (annee - 1) // 100 + 1
print("Siècle :", siecle)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["2026"]
assert siecle == 21, "2026 : XXIe siècle."
for a, s in [(1900, 19), (1901, 20), (1, 1), (100, 1), (101, 2), (2000, 20)]:
    autre, _ = relancer([str(a)])
    assert autre["siecle"] == s, f"L'année {a} est dans le siècle {s}."
import re
assert not re.search(r"if", PROGRAMME), "Une formule suffit, sans condition."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-5-3" label="5.3 [Expert] - Quel jour dans n jours ?" type="python">
<Enonce>
### Quel jour dans n jours ?

Les jours sont numérotés de 0 (lundi) à 6 (dimanche). Le texte `"lunmarmerjeuvensamdim"` contient les abréviations des sept jours, trois lettres chacune.

Demander le numéro du jour d'aujourd'hui puis un nombre de jours `n`. Calculer :
- `numero` : le numéro du jour qu'il sera dans `n` jours ;
- `nom` : son abréviation (par exemple `ven`).

Exemple : aujourd'hui jeudi (3), dans 10 jours ce sera dimanche (6, `dim`).

<Indices>
<Indice>

Après dimanche, on revient à lundi : le reste de la division par 7 fait ce retour au début.

</Indice>
<Indice>

`texte[debut:fin]` découpe un morceau du texte. L'abréviation du jour numéro `k` commence à la position `3 × k`.

</Indice>
<Indice>

```text
jours ← "lunmarmerjeuvensamdim"
LIRE aujourd_hui, n (entiers)
numero ← reste de (aujourd_hui + n) par 7
nom ← jours[de 3 × numero jusqu'à 3 × numero + 3]
AFFICHER nom
```

</Indice>
</Indices>

<Correction>

```python
jours = "lunmarmerjeuvensamdim"
aujourd_hui = int(input("Numéro du jour (0 = lundi) : "))
n = int(input("Dans combien de jours ? "))
numero = (aujourd_hui + n) % 7
nom = jours[3 * numero:3 * numero + 3]
print("Ce sera", nom)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["3", "10"]
assert numero == 6 and nom == "dim", "Jeudi + 10 jours : dimanche (6, dim)."
for j, n, num, nm in [(0, 0, 0, "lun"), (6, 1, 0, "lun"), (2, 365, 3, "jeu"), (4, 7, 4, "ven")]:
    autre, _ = relancer([str(j), str(n)])
    assert autre["numero"] == num and autre["nom"] == nm, f"Jour {j} + {n} jours : {nm}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-5-4" label="5.4 [Expert] - Mot caché" type="python">
<Enonce>
### Mot caché

Demander un mot d'au moins deux lettres et ranger dans `masque` le mot dont toutes les lettres sont remplacées par `*`, **sauf la première et la dernière**.

Exemples : `renard` donne `r****d`, `ou` donne `ou`.

Contrainte : pas de boucle, pas de condition.

<Indices>
<Indice>

`len(mot)` donne le nombre de lettres. Combien d'étoiles faut-il ?

</Indice>
<Indice>

`"*" * 4` donne `"****"`, et `mot[-1]` est la dernière lettre.

</Indice>
<Indice>

```text
LIRE mot
etoiles ← "*" répété (longueur(mot) - 2) fois
masque ← mot[0] + etoiles + mot[dernière position]
AFFICHER masque
```

</Indice>
</Indices>

<Correction>

```python
mot = input("Mot : ")
masque = mot[0] + "*" * (len(mot) - 2) + mot[-1]
print(masque)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["renard"]
assert masque == "r****d", "renard donne r****d."
for m, attendu in [("ou", "ou"), ("nsi", "n*i"), ("anticonstitutionnellement", "a" + "*" * 23 + "t")]:
    autre, _ = relancer([m])
    assert autre["masque"] == attendu, f"{m} donne {attendu}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-6-1" label="6.1 [Mini-projet] - Caisse enregistreuse" type="python">
<Enonce>
### Caisse enregistreuse

**Contexte.** La librairie du quartier, « Le Terrier des livres », change de caisse. À chaque passage, le libraire tape les articles du client. La caisse imprime alors un ticket, applique la remise du jour (par exemple 10 % pendant la rentrée), indique la TVA comprise dans le prix, puis lui dit exactement quels billets et quelles pièces rendre, pour qu'il ne se trompe jamais dans la monnaie. Le programme se limite à 3 articles par client et n'utilise ni condition ni boucle : tout se fait par des calculs.

**Données saisies, dans cet ordre** : pour chacun des 3 articles, son nom, son prix unitaire (à virgule) et la quantité. Puis le pourcentage de remise (un entier). Enfin la somme donnée par le client (à virgule).

Exemple de passage en caisse : un cahier à 2,50 € pris 4 fois, un stylo à 1,20 € pris 10 fois, un sac à 24,90 € pris une fois, remise de 10 %, le client donne 60 €.

**Ce que le programme doit produire**
- `ligne1`, `ligne2`, `ligne3` : les lignes du ticket, une par article, pour que le client vérifie ses achats. Chacune montre le nom, la quantité, le prix unitaire et le montant de la ligne, au format exact `f"{nom:<12}{quantite:>3} x {prix:>6.2f} = {montant:>7.2f}"` (le nom occupe 12 caractères, la quantité 3…). Elles sont affichées l'une sous l'autre.
- `sous_total` : ce que coûtent les articles avant remise.
- `remise` : le montant retiré, c'est-à-dire le pourcentage saisi appliqué au sous-total.
- `total` : ce que paie le client (sous-total moins remise).
- `tva` : la part de TVA à 20 % **comprise** dans le total, imprimée en bas du ticket pour la comptabilité (`total - total / 1.2`).
- Ces quatre montants sont arrondis au centime et affichés.
- `rendu` : la monnaie à rendre, **en centimes** (un entier), pour éviter les erreurs d'arrondi des nombres à virgule.
- `billets_10`, `billets_5`, `pieces_2`, `pieces_1`, `pieces_50c`, `pieces_20c`, `pieces_10c`, `pieces_5c`, `pieces_2c` et `pieces_1c` : combien rendre de chaque billet et de chaque pièce, en utilisant le moins de billets et de pièces possible.

Dans l'exemple, le total est de 42,21 € et le rendu de 1779 centimes, soit 1 billet de 10 €, 1 de 5 €, 1 pièce de 2 €, 1 de 50 c, 1 de 20 c, 1 de 5 c et 2 de 2 c.

<Indices>
<Indice>

Avancer par étapes et vérifier chaque étape avec un `print` : d'abord les saisies et les lignes du ticket, puis les totaux, enfin la monnaie.

</Indice>
<Indice>

Les centimes évitent les erreurs d'arrondi des flottants : `round(somme * 100)` donne un entier. Le rendu se décompose ensuite comme un rendu de monnaie classique, de la plus grosse valeur à la plus petite.

</Indice>
<Indice>

```text
(cœur du programme : décomposer le rendu en centimes)
rendu ← arrondi(donne × 100) - arrondi(total × 100)
billets_10 ← rendu // 1000 ; reste ← rendu % 1000
billets_5 ← reste // 500 ; reste ← reste % 500
pieces_2 ← reste // 200 ; reste ← reste % 200
… même principe pour 100, 50, 20, 10, 5, 2 …
pieces_1c ← reste
```

</Indice>
</Indices>

<Correction>

```python
nom1 = input("Article 1 : ")
prix1 = float(input("Prix : "))
q1 = int(input("Quantité : "))
nom2 = input("Article 2 : ")
prix2 = float(input("Prix : "))
q2 = int(input("Quantité : "))
nom3 = input("Article 3 : ")
prix3 = float(input("Prix : "))
q3 = int(input("Quantité : "))
pourcentage = int(input("Remise (%) : "))
donne = float(input("Somme donnée : "))

ligne1 = f"{nom1:<12}{q1:>3} x {prix1:>6.2f} = {prix1 * q1:>7.2f}"
ligne2 = f"{nom2:<12}{q2:>3} x {prix2:>6.2f} = {prix2 * q2:>7.2f}"
ligne3 = f"{nom3:<12}{q3:>3} x {prix3:>6.2f} = {prix3 * q3:>7.2f}"
print(ligne1)
print(ligne2)
print(ligne3)

sous_total = round(prix1 * q1 + prix2 * q2 + prix3 * q3, 2)
remise = round(sous_total * pourcentage / 100, 2)
total = round(sous_total - remise, 2)
tva = round(total - total / 1.2, 2)
print("Sous-total :", sous_total, "- remise :", remise, "- total :", total, "dont TVA :", tva)

rendu = round(donne * 100) - round(total * 100)
billets_10 = rendu // 1000
reste = rendu % 1000
billets_5 = reste // 500
reste = reste % 500
pieces_2 = reste // 200
reste = reste % 200
pieces_1 = reste // 100
reste = reste % 100
pieces_50c = reste // 50
reste = reste % 50
pieces_20c = reste // 20
reste = reste % 20
pieces_10c = reste // 10
reste = reste % 10
pieces_5c = reste // 5
reste = reste % 5
pieces_2c = reste // 2
pieces_1c = reste % 2
print("À rendre :", rendu / 100, "€")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["Cahier", "2.5", "4", "Stylo", "1.2", "10", "Sac", "24.9", "1", "10", "60"]
assert ligne1 == "Cahier        4 x   2.50 =   10.00", "Ligne du cahier, au format demandé."
assert ligne3 == "Sac           1 x  24.90 =   24.90", "Ligne du sac."
assert ligne1 in SORTIE and ligne2 in SORTIE, "Les lignes du ticket s'affichent."
assert sous_total == 46.9 and remise == 4.69 and total == 42.21, "Sous-total 46,90 €, remise 4,69 €, total 42,21 €."
assert abs(tva - 7.035) < 0.006, "TVA comprise : environ 7,03 ou 7,04 €."
assert rendu == 1779 and type(rendu) == int, "Rendu : 1779 centimes (un entier)."
monnaie = (billets_10, billets_5, pieces_2, pieces_1, pieces_50c, pieces_20c, pieces_10c, pieces_5c, pieces_2c, pieces_1c)
assert monnaie == (1, 1, 1, 0, 1, 1, 0, 1, 2, 0), "Décomposition de 17,79 €."
autre, _ = relancer(["Livre", "19.99", "3", "Marque-page", "0.5", "2", "Carte", "1.01", "1", "0", "100"])
assert autre["total"] == 61.98 and autre["rendu"] == 3802, "Sans remise : 61,98 €, rendu 38,02 €."
m = tuple(autre[k] for k in ["billets_10", "billets_5", "pieces_2", "pieces_1", "pieces_50c", "pieces_20c", "pieces_10c", "pieces_5c", "pieces_2c", "pieces_1c"])
assert m == (3, 1, 1, 1, 0, 0, 0, 0, 1, 0), "Décomposition de 38,02 €."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-py-6-2" label="6.2 [Mini-projet] - Fiche d'inscription" type="python">
<Enonce>
### Fiche d'inscription

**Contexte.** Chaque rentrée, le secrétariat du lycée inscrit les nouveaux élèves. Pour chacun, il faut créer un compte informatique (identifiant et adresse électronique), noter son âge et son département pour les statistiques, et imprimer une étiquette encadrée à coller sur son casier. Le programme prépare tout cela à partir de quatre informations tapées par la secrétaire, sans condition ni boucle.

**Données saisies, dans cet ordre** : le prénom, le nom, la date de naissance au format `JJ/MM/AAAA` et le code postal. Exemple : `Léa`, `Martin`, `15/12/2010`, `67000`.

**Ce que le programme doit produire**
- `jour`, `mois`, `annee` : les trois parties de la date de naissance, en entiers, qui servent aux calculs suivants.
- `age` : l'âge de l'élève au 1er novembre 2026, date des statistiques de rentrée. Attention : une élève née un 15 décembre n'a pas encore eu son anniversaire en novembre.
- `identifiant` : le nom de connexion aux ordinateurs du lycée. Il est formé de la première lettre du prénom, puis les **7 premières lettres** du nom (tout le nom s'il est plus court), sans espace et en minuscules, suivies des deux derniers chiffres de l'année de naissance. Pour Léa Martin, née en 2010 : `lmartin10`.
- `email` : l'adresse de messagerie de l'élève, `prenom.nom@lycee-renard.fr`, en minuscules (accents gardés), les espaces des prénoms et noms composés remplacées par des `-`.
- `departement` : les deux premiers caractères du code postal, pour savoir d'où viennent les élèves.
- `initiales` : par exemple `L.M.`, imprimées sur les copies d'examen.
- `cadre` : l'étiquette du casier, un texte de trois lignes qui encadre le prénom et le nom en majuscules avec des `*` et une espace de marge de chaque côté. Elle est affichée à la fin :

```
**************
* Léa MARTIN *
**************
```

<Indices>
<Indice>

Découper la date avec des tranches : `date[0:2]`, `date[3:5]`, `date[6:10]`, puis convertir avec `int`.

</Indice>
<Indice>

Une comparaison vaut `True` ou `False`, et `int(True)` vaut 1 : l'anniversaire « pas encore passé » se traduit par un nombre à retirer, sans `if`.

</Indice>
<Indice>

Pour le cadre, la largeur dépend de la longueur du texte : `"*" * (len(texte) + 4)`. Les lignes se séparent par `"\n"`.

</Indice>
<Indice>

```text
(cœur du programme : l'âge sans condition)
pas_encore ← (mois × 100 + jour) > 1101        (VRAI si l'anniversaire tombe après le 1er novembre)
age ← 2026 - annee - entier(pas_encore)
```

</Indice>
</Indices>

<Correction>

```python
prenom = input("Prénom : ")
nom = input("Nom : ")
date = input("Date de naissance (JJ/MM/AAAA) : ")
code_postal = input("Code postal : ")

jour = int(date[0:2])
mois = int(date[3:5])
annee = int(date[6:10])
age = 2026 - annee - int(mois * 100 + jour > 1101)

identifiant = (prenom[0] + nom.replace(" ", "")[:7]).lower() + date[8:10]
email = (prenom + "." + nom).lower().replace(" ", "-") + "@lycee-renard.fr"
departement = code_postal[:2]
initiales = prenom[0].upper() + "." + nom[0].upper() + "."

texte = prenom + " " + nom.upper()
bord = "*" * (len(texte) + 4)
cadre = bord + "\n* " + texte + " *\n" + bord
print(identifiant, email, age, "ans, département", departement)
print(cadre)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["Léa", "Martin", "15/12/2010", "67000"]
assert (jour, mois, annee) == (15, 12, 2010), "Les trois parties de la date."
assert age == 15, "Née le 15/12/2010 : 15 ans au 1er novembre 2026."
assert identifiant == "lmartin10", "Identifiant lmartin10."
assert email == "léa.martin@lycee-renard.fr" and departement == "67" and initiales == "L.M.", "Email, département, initiales."
assert cadre == "**************\n* Léa MARTIN *\n**************" and cadre in SORTIE, "Le cadre de l'exemple, affiché."
autre, _ = relancer(["Jean Paul", "De La Fontaine", "01/11/2009", "05000"])
assert autre["age"] == 17, "Anniversaire le jour même : 17 ans."
assert autre["identifiant"] == "jdelafon09", "Nom composé : espaces retirées, 7 lettres."
assert autre["email"] == "jean-paul.de-la-fontaine@lycee-renard.fr" and autre["departement"] == "05", "Email et département."
autre, _ = relancer(["Al", "Wu", "02/11/2008", "75001"])
assert autre["age"] == 17 and autre["identifiant"] == "awu08", "Nom court ; anniversaire le lendemain du 1er novembre."
assert autre["cadre"].split("\n")[0] == "*" * 9, "Cadre ajusté à la longueur."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
