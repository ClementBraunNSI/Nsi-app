---
title: 'Fiche d''exercices : Les boucles en Python'
description: Exercices sur les boucles (for/while) en Python.
level: seconde
chapter: Programmation Python
icon: "refresh-cw"
prerequisites:
  - structures_conditionnelles
audience: public
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="fiche-boucles" courseTitle="Fiche Boucles">

<ExerciseSection id="snt-boucles-1-1" label="1.1 [Introduction] - Compte à rebours" type="python">
<Enonce>
### Compte à rebours

Demander un entier `n`, puis afficher le compte à rebours de `n` jusqu'à `0`, un nombre par ligne.

Exemple pour `3` : `3`, `2`, `1`, `0`.

<Indices>
<Indice>

`range(debut, fin, pas)` s'arrête **avant** `fin`. Avec un pas de `-1`, il compte à l'envers.

</Indice>
<Indice>

Pour que `0` soit affiché, la fin du `range` doit être `-1`.

</Indice>
<Indice>

```text
LIRE n (entier)
POUR i ALLANT DE n À 0 (en descendant)
    AFFICHER i
FIN POUR
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Départ : "))
for i in range(n, -1, -1):
    print(i)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["5"]
lignes = [l.strip() for l in SORTIE.strip().splitlines()]
assert lignes[-6:] == ["5", "4", "3", "2", "1", "0"], "Pour 5 : 5, 4, 3, 2, 1, 0, un par ligne."
_, sortie = relancer(["0"])
assert sortie.strip().splitlines()[-1].strip().endswith("0"), "Pour 0 : seul 0 s'affiche."
_, sortie = relancer(["12"])
assert [l.strip() for l in sortie.strip().splitlines()][-13:] == [str(i) for i in range(12, -1, -1)], "Pour 12 : de 12 à 0."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-1-2" label="1.2 [Introduction] - Table de multiplication" type="python">
<Enonce>
### Table de multiplication

Demander un entier `n` et afficher sa table de multiplication de 1 à 10, sous la forme :

```
7 x 1 = 7
7 x 2 = 14
...
7 x 10 = 70
```

<Indices>
<Indice>

La boucle fait varier le multiplicateur `i` de 1 à 10 : `range(1, 11)`.

</Indice>
<Indice>

`print(n, "x", i, "=", n * i)` affiche les morceaux séparés par des espaces.

</Indice>
<Indice>

```text
LIRE n (entier)
POUR i ALLANT DE 1 À 10
    AFFICHER n, "x", i, "=", n × i
FIN POUR
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Table de : "))
for i in range(1, 11):
    print(n, "x", i, "=", n * i)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["7"]
for i in range(1, 11):
    assert f"7 x {i} = {7 * i}" in SORTIE, f"La ligne « 7 x {i} = {7 * i} » s'affiche."
assert "7 x 11" not in SORTIE and "7 x 0" not in SORTIE, "La table va de 1 à 10, pas plus."
_, sortie = relancer(["12"])
assert "12 x 10 = 120" in sortie, "Pour 12, la dernière ligne est « 12 x 10 = 120 »."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-1-3" label="1.3 [Introduction] - Somme des entiers" type="python">
<Enonce>
### Somme des entiers

Demander un entier `n` et calculer dans `somme` la somme `1 + 2 + … + n`, avec une boucle.

Exemple : pour `4`, la somme vaut `10`.

<Indices>
<Indice>

Une somme se construit pas à pas : la variable part de 0 et chaque tour de boucle lui ajoute un nombre.

</Indice>
<Indice>

Créer `somme = 0` **avant** la boucle, sinon elle repart de zéro à chaque tour.

</Indice>
<Indice>

```text
LIRE n (entier)
somme ← 0
POUR i ALLANT DE 1 À n
    somme ← somme + i
FIN POUR
AFFICHER somme
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("n : "))
somme = 0
for i in range(1, n + 1):
    somme = somme + i
print(somme)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["4"]
assert somme == 10, "Pour 4 : 10."
for n, s in [(1, 1), (100, 5050), (0, 0)]:
    autre, _ = relancer([str(n)])
    assert autre["somme"] == s, f"Pour {n} : {s}."
import re
assert re.search(r"\b(for|while)\b", PROGRAMME) and "sum(" not in PROGRAMME, "Le calcul utilise une boucle."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-1-4" label="1.4 [Introduction] - Les multiples de 5" type="python">
<Enonce>
### Les multiples de 5

Afficher tous les multiples de 5 de `5` à `100`, un par ligne, et compter dans `nombre` combien il y en a.

Contrainte : la boucle ne parcourt que les multiples de 5, sans tester les autres nombres.

<Indices>
<Indice>

Le troisième nombre de `range` est le pas : `range(5, 101, 5)` avance de 5 en 5.

</Indice>
<Indice>

Un compteur part de 0 et augmente de 1 à chaque tour.

</Indice>
<Indice>

```text
nombre ← 0
POUR m ALLANT DE 5 À 100 PAR PAS DE 5
    AFFICHER m
    nombre ← nombre + 1
FIN POUR
```

</Indice>
</Indices>

<Correction>

```python
nombre = 0
for m in range(5, 101, 5):
    print(m)
    nombre = nombre + 1
```

</Correction>
</Enonce>
<Verification>

```python
lignes = [l.strip() for l in SORTIE.strip().splitlines()]
assert lignes == [str(m) for m in range(5, 101, 5)], "Les multiples de 5, de 5 à 100, un par ligne."
assert nombre == 20, "Il y en a 20."
assert "%" not in PROGRAMME, "Pas besoin de tester les nombres un à un."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-2-1" label="2.1 [Facile] - Factorielle" type="python">
<Enonce>
### Factorielle

La factorielle de `n`, notée `n!`, est le produit `1 × 2 × 3 × … × n` (et `0!` vaut 1).

Demander `n` et calculer `fact`.

<Indices>
<Indice>

Comme une somme, mais avec une multiplication. Par quelle valeur faut-il commencer ?

</Indice>
<Indice>

En partant de 0, tout produit resterait nul : la variable part de 1.

</Indice>
<Indice>

```text
LIRE n (entier)
fact ← 1
POUR i ALLANT DE 1 À n
    fact ← fact × i
FIN POUR
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("n : "))
fact = 1
for i in range(1, n + 1):
    fact = fact * i
print(fact)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["5"]
assert fact == 120, "5! = 120."
for n, f in [(0, 1), (1, 1), (10, 3628800), (20, 2432902008176640000)]:
    autre, _ = relancer([str(n)])
    assert autre["fact"] == f, f"{n}! = {f}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-2-2" label="2.2 [Facile] - Compter les voyelles" type="python">
<Enonce>
### Compter les voyelles

Demander un mot (en minuscules) et ranger dans `voyelles` le nombre de voyelles qu'il contient (`a`, `e`, `i`, `o`, `u`, `y`).

<Indices>
<Indice>

`for lettre in mot:` parcourt le mot lettre par lettre.

</Indice>
<Indice>

`lettre in "aeiouy"` vaut `True` si la lettre est une voyelle.

</Indice>
<Indice>

```text
LIRE mot
voyelles ← 0
POUR CHAQUE lettre DE mot
    SI lettre est dans "aeiouy" ALORS voyelles ← voyelles + 1 FIN SI
FIN POUR
```

</Indice>
</Indices>

<Correction>

```python
mot = input("Mot : ")
voyelles = 0
for lettre in mot:
    if lettre in "aeiouy":
        voyelles = voyelles + 1
print(voyelles)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["renard"]
assert voyelles == 2, "renard : 2 voyelles."
for m, v in [("python", 2), ("rythme", 2), ("bcd", 0), ("oiseau", 5), ("", 0)]:
    autre, _ = relancer([m])
    assert autre["voyelles"] == v, f"« {m} » : {v} voyelles."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-2-3" label="2.3 [Facile] - Moyenne de la classe" type="python">
<Enonce>
### Moyenne de la classe

Demander combien de notes seront saisies, puis demander chaque note (à virgule possible). Calculer dans `moyenne` leur moyenne, arrondie au centième.

<Indices>
<Indice>

La boucle tourne autant de fois que le nombre de notes. À chaque tour, une note est lue et ajoutée au total.

</Indice>
<Indice>

La division par le nombre de notes se fait une seule fois, **après** la boucle.

</Indice>
<Indice>

```text
LIRE n (entier)
total ← 0
RÉPÉTER n FOIS
    LIRE note (nombre à virgule)
    total ← total + note
FIN RÉPÉTER
moyenne ← arrondi(total / n, 2 chiffres)
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Nombre de notes : "))
total = 0
for i in range(n):
    note = float(input("Note : "))
    total = total + note
moyenne = round(total / n, 2)
print("Moyenne :", moyenne)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["3", "12", "15", "9"]
assert moyenne == 12, "12, 15, 9 : 12."
autre, _ = relancer(["3", "10", "11", "15.5"])
assert autre["moyenne"] == 12.17, "10, 11, 15,5 : 12,17."
autre, _ = relancer(["1", "17"])
assert autre["moyenne"] == 17, "Une seule note : elle-même."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-2-4" label="2.4 [Facile] - Mot à l'envers" type="python">
<Enonce>
### Mot à l'envers

Demander un mot et ranger dans `envers` le mot écrit à l'envers.

Contrainte : avec une boucle, sans `[::-1]` ni `reversed`.

<Indices>
<Indice>

Partir d'un texte vide `""` et y ajouter les lettres une à une.

</Indice>
<Indice>

Ajouter chaque lettre **devant** le texte déjà construit : `lettre + envers`.

</Indice>
<Indice>

```text
LIRE mot
envers ← ""
POUR CHAQUE lettre DE mot
    envers ← lettre + envers
FIN POUR
```

</Indice>
</Indices>

<Correction>

```python
mot = input("Mot : ")
envers = ""
for lettre in mot:
    envers = lettre + envers
print(envers)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["renard"]
assert envers == "draner", "renard donne draner."
for m in ["kayak", "NSI", "a", ""]:
    autre, _ = relancer([m])
    assert autre["envers"] == m[::-1], f"« {m} » à l'envers."
assert "[::-1]" not in PROGRAMME and "reversed" not in PROGRAMME, "Le mot se retourne avec une boucle."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-3-1" label="3.1 [Moyen] - Doubler son épargne" type="python">
<Enonce>
### Doubler son épargne

Un livret rapporte 3 % par an : chaque année, le capital est multiplié par `1.03`.

Demander le capital de départ et calculer dans `annees` le nombre d'années nécessaires pour qu'il **double** au moins.

<Indices>
<Indice>

On ne sait pas d'avance combien de tours faire : c'est le travail de `while`, qui répète tant qu'une condition est vraie.

</Indice>
<Indice>

Garder le capital de départ dans une variable et faire évoluer une autre variable `capital`. La boucle continue tant que `capital` est sous le double du départ.

</Indice>
<Indice>

```text
LIRE depart (nombre)
capital ← depart
annees ← 0
TANT QUE capital < 2 × depart
    capital ← capital × 1,03
    annees ← annees + 1
FIN TANT QUE
```

</Indice>
</Indices>

<Correction>

```python
depart = float(input("Capital de départ : "))
capital = depart
annees = 0
while capital < 2 * depart:
    capital = capital * 1.03
    annees = annees + 1
print(annees, "ans")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["1000"]
assert annees == 24, "À 3 %, le capital double en 24 ans."
autre, _ = relancer(["50"])
assert autre["annees"] == 24, "Le résultat ne dépend pas du capital : 24 ans."
assert "while" in PROGRAMME, "Une boucle while s'impose : le nombre de tours est inconnu."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-3-2" label="3.2 [Moyen] - Saisie contrôlée" type="python">
<Enonce>
### Saisie contrôlée

Demander une note sur 20. Tant que la note saisie n'est pas entre 0 et 20, afficher `Note invalide` et la redemander.

À la fin, `note` contient la note valide et `essais` le nombre total de saisies.

<Indices>
<Indice>

Lire une première note avant la boucle, puis redemander dans la boucle tant qu'elle est invalide.

</Indice>
<Indice>

« Pas entre 0 et 20 » : `note < 0 or note > 20`.

</Indice>
<Indice>

```text
LIRE note (nombre)
essais ← 1
TANT QUE note < 0 OU note > 20
    AFFICHER "Note invalide"
    LIRE note
    essais ← essais + 1
FIN TANT QUE
```

</Indice>
</Indices>

<Correction>

```python
note = float(input("Note : "))
essais = 1
while note < 0 or note > 20:
    print("Note invalide")
    note = float(input("Note : "))
    essais = essais + 1
print("Note enregistrée :", note)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["25", "-1", "14"]
assert note == 14 and essais == 3, "25, -1 puis 14 : note 14 après 3 saisies."
assert SORTIE.count("Note invalide") == 2, "« Note invalide » s'affiche pour chaque mauvaise saisie."
autre, sortie = relancer(["20"])
assert autre["note"] == 20 and autre["essais"] == 1 and "Note invalide" not in sortie, "20 est accepté du premier coup."
autre, _ = relancer(["20.5", "0"])
assert autre["note"] == 0 and autre["essais"] == 2, "20,5 est refusé, 0 est accepté."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-3-3" label="3.3 [Moyen] - Record de la série" type="python">
<Enonce>
### Record de la série

Demander combien de scores seront saisis (au moins un), puis chaque score (un entier, parfois négatif). Ranger dans `record` le plus grand et dans `position` son numéro de saisie (1 pour le premier). En cas d'égalité, garder la première position.

Contrainte : sans `max`.

<Indices>
<Indice>

Le premier score est le record provisoire. Chaque score suivant est comparé au record.

</Indice>
<Indice>

Le numéro de saisie est le compteur de la boucle (plus 1 si la boucle compte à partir de 0).

</Indice>
<Indice>

Pour garder la première position en cas d'égalité, la comparaison est stricte : `>`.

</Indice>
<Indice>

```text
LIRE n (entier)
LIRE record (entier)
position ← 1
POUR i ALLANT DE 2 À n
    LIRE score (entier)
    SI score > record ALORS
        record ← score
        position ← i
    FIN SI
FIN POUR
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Nombre de scores : "))
record = int(input("Score : "))
position = 1
for i in range(2, n + 1):
    score = int(input("Score : "))
    if score > record:
        record = score
        position = i
print("Record :", record, "à la saisie", position)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["5", "12", "40", "7", "40", "3"]
assert record == 40 and position == 2, "12, 40, 7, 40, 3 : record 40, saisie 2."
autre, _ = relancer(["3", "-5", "-2", "-9"])
assert autre["record"] == -2 and autre["position"] == 2, "-5, -2, -9 : record -2, saisie 2."
autre, _ = relancer(["1", "8"])
assert autre["record"] == 8 and autre["position"] == 1, "Un seul score : il est le record."
import re
assert not re.search(r"\bmax\s*\(", PROGRAMME), "Sans la fonction max."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-3-4" label="3.4 [Moyen] - Nombre de chiffres" type="python">
<Enonce>
### Nombre de chiffres

Demander un entier positif ou nul et ranger dans `chiffres` son nombre de chiffres.

Contrainte : par des divisions, sans transformer le nombre en texte. (0 s'écrit avec un chiffre.)

<Indices>
<Indice>

`n // 10` enlève le dernier chiffre de `n`. Combien de fois peut-on le faire avant d'arriver à 0 ?

</Indice>
<Indice>

Le cas 0 piège la boucle `while n > 0` : il n'entre jamais dedans. Une boucle qui fait au moins un tour, ou un compteur qui part de 1, règle ce cas.

</Indice>
<Indice>

```text
LIRE n (entier)
chiffres ← 1
TANT QUE n ≥ 10
    n ← quotient de n par 10
    chiffres ← chiffres + 1
FIN TANT QUE
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Entier : "))
chiffres = 1
while n >= 10:
    n = n // 10
    chiffres = chiffres + 1
print(chiffres, "chiffre(s)")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["2026"]
assert chiffres == 4, "2026 : 4 chiffres."
for n, c in [(0, 1), (9, 1), (10, 2), (99999, 5), (1000000, 7)]:
    autre, _ = relancer([str(n)])
    assert autre["chiffres"] == c, f"{n} : {c} chiffre(s)."
assert "len(" not in PROGRAMME and "str(" not in PROGRAMME, "Le nombre n'est pas transformé en texte."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-4-1" label="4.1 [Difficile] - Nombre premier" type="python">
<Enonce>
### Nombre premier

Un nombre premier a exactement deux diviseurs : 1 et lui-même (1 n'est donc pas premier).

Demander un entier `n` (au moins 1) et ranger dans `premier` le booléen `True` ou `False`.

<Indices>
<Indice>

Chercher un diviseur entre 2 et `n - 1` : s'il en existe un, `n` n'est pas premier.

</Indice>
<Indice>

Partir de `premier = n >= 2`, puis passer à `False` dès qu'un diviseur est trouvé.

</Indice>
<Indice>

Inutile de chercher au-delà de la racine carrée de `n` : `while d * d <= n` va beaucoup plus vite.

</Indice>
<Indice>

```text
LIRE n (entier)
premier ← (n ≥ 2)
d ← 2
TANT QUE d × d ≤ n ET premier
    SI reste de n par d = 0 ALORS premier ← FAUX FIN SI
    d ← d + 1
FIN TANT QUE
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Entier : "))
premier = n >= 2
d = 2
while d * d <= n and premier:
    if n % d == 0:
        premier = False
    d = d + 1
print(premier)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["97"]
assert premier is True, "97 est premier."
for n, p in [(1, False), (2, True), (9, False), (25, False), (29, True), (1000003, True), (1000001, False)]:
    autre, _ = relancer([str(n)])
    assert autre["premier"] is p, f"{n} : {'premier' if p else 'pas premier'}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-4-2" label="4.2 [Difficile] - Pyramide" type="python">
<Enonce>
### Pyramide

Demander un entier `n` et afficher une pyramide de `n` étages faite d'étoiles, centrée avec des espaces. Pour `3` :

```
  *
 ***
*****
```

L'étage `i` (de 1 à `n`) a `n - i` espaces puis `2 × i - 1` étoiles.

<Indices>
<Indice>

`" " * 3` donne trois espaces, `"*" * 5` cinq étoiles : une ligne se construit en collant les deux.

</Indice>
<Indice>

Une seule boucle suffit : elle fait varier `i` de 1 à `n`.

</Indice>
<Indice>

```text
LIRE n (entier)
POUR i ALLANT DE 1 À n
    AFFICHER (" " répété n - i fois) + ("*" répété 2i - 1 fois)
FIN POUR
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Étages : "))
for i in range(1, n + 1):
    print(" " * (n - i) + "*" * (2 * i - 1))
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["3"]
lignes = [l.rstrip() for l in SORTIE.splitlines() if "*" in l]
assert lignes == ["  *", " ***", "*****"], "Pour 3 : la pyramide de l'exemple."
_, sortie = relancer(["5"])
lignes = [l.rstrip() for l in sortie.splitlines() if "*" in l]
assert lignes == [" " * (5 - i) + "*" * (2 * i - 1) for i in range(1, 6)], "Pour 5 : cinq étages, la base fait 9 étoiles."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-4-3" label="4.3 [Difficile] - Suite de Syracuse" type="python">
<Enonce>
### Suite de Syracuse

Partant d'un entier `n` supérieur à 0, la suite de Syracuse applique la règle : si `n` est pair, on le divise par 2, sinon on le remplace par `3n + 1`. On s'arrête en atteignant 1.

Demander `n` et calculer :
- `etapes` : le nombre de transformations pour arriver à 1 ;
- `altitude` : la plus grande valeur atteinte (départ compris).

<Indices>
<Indice>

Une boucle `while n != 1` applique la règle, et un `if` choisit entre les deux transformations.

</Indice>
<Indice>

`altitude` part de la valeur de départ et se met à jour après chaque transformation, comme un record.

</Indice>
<Indice>

Utiliser `//` pour la division : avec `/`, `n` deviendrait un nombre à virgule.

</Indice>
<Indice>

```text
LIRE n (entier)
etapes ← 0
altitude ← n
TANT QUE n ≠ 1
    SI n pair ALORS n ← quotient de n par 2 SINON n ← 3n + 1 FIN SI
    etapes ← etapes + 1
    SI n > altitude ALORS altitude ← n FIN SI
FIN TANT QUE
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Départ : "))
etapes = 0
altitude = n
while n != 1:
    if n % 2 == 0:
        n = n // 2
    else:
        n = 3 * n + 1
    etapes = etapes + 1
    if n > altitude:
        altitude = n
print(etapes, "étapes, altitude", altitude)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["6"]
assert etapes == 8 and altitude == 16, "Depuis 6 : 8 étapes, altitude 16."
for n, e, a in [(1, 0, 1), (7, 16, 52), (27, 111, 9232), (16, 4, 16)]:
    autre, _ = relancer([str(n)])
    assert (autre["etapes"], autre["altitude"]) == (e, a), f"Depuis {n} : {e} étapes, altitude {a}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-4-4" label="4.4 [Difficile] - PGCD" type="python">
<Enonce>
### PGCD

Le plus grand diviseur commun de deux entiers s'obtient par l'algorithme d'Euclide : tant que `b` n'est pas nul, remplacer le couple `(a, b)` par `(b, reste de a par b)`. Le PGCD est alors la valeur de `a`.

Demander deux entiers positifs et ranger leur PGCD dans `pgcd`.

<Indices>
<Indice>

Les deux nouvelles valeurs se calculent à partir des anciennes : attention à ne pas écraser `a` trop tôt.

</Indice>
<Indice>

`a, b = b, a % b` met à jour les deux variables en une fois, avec les anciennes valeurs.

</Indice>
<Indice>

```text
LIRE a, b (entiers)
TANT QUE b ≠ 0
    (a, b) ← (b, reste de a par b)
FIN TANT QUE
pgcd ← a
```

</Indice>
</Indices>

<Correction>

```python
a = int(input("a : "))
b = int(input("b : "))
while b != 0:
    a, b = b, a % b
pgcd = a
print("PGCD :", pgcd)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["84", "36"]
assert pgcd == 12, "PGCD(84, 36) = 12."
for x, y, g in [(36, 84, 12), (17, 5, 1), (100, 75, 25), (7, 0, 7), (1071, 462, 21)]:
    autre, _ = relancer([str(x), str(y)])
    assert autre["pgcd"] == g, f"PGCD({x}, {y}) = {g}."
import re
assert not re.search(r"gcd\s*\(", PROGRAMME), "Le calcul suit l'algorithme d'Euclide, sans math.gcd."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-5-1" label="5.1 [Expert] - Nombres parfaits" type="python">
<Enonce>
### Nombres parfaits

Un nombre est parfait s'il est égal à la somme de ses diviseurs autres que lui-même : `6 = 1 + 2 + 3`.

Demander un entier `limite` et afficher tous les nombres parfaits de 2 à `limite`, un par ligne. Compter dans `nb_parfaits` combien il y en a.

<Indices>
<Indice>

Deux boucles imbriquées : la première parcourt les candidats, la seconde cherche les diviseurs de chaque candidat.

</Indice>
<Indice>

La somme des diviseurs doit repartir de 0 pour chaque nouveau candidat : la créer **dans** la première boucle.

</Indice>
<Indice>

Les diviseurs autres que le nombre lui-même vont de 1 à sa moitié.

</Indice>
<Indice>

```text
LIRE limite (entier)
nb_parfaits ← 0
POUR n ALLANT DE 2 À limite
    somme ← 0
    POUR d ALLANT DE 1 À n // 2
        SI d divise n ALORS somme ← somme + d FIN SI
    FIN POUR
    SI somme = n ALORS
        AFFICHER n
        nb_parfaits ← nb_parfaits + 1
    FIN SI
FIN POUR
```

</Indice>
</Indices>

<Correction>

```python
limite = int(input("Limite : "))
nb_parfaits = 0
for n in range(2, limite + 1):
    somme = 0
    for d in range(1, n // 2 + 1):
        if n % d == 0:
            somme = somme + d
    if somme == n:
        print(n)
        nb_parfaits = nb_parfaits + 1
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["500"]
lignes = [l.strip() for l in SORTIE.strip().splitlines()]
assert lignes[-3:] == ["6", "28", "496"] and nb_parfaits == 3, "Jusqu'à 500 : 6, 28 et 496."
autre, _ = relancer(["27"])
assert autre["nb_parfaits"] == 1, "Jusqu'à 27, seul 6 est parfait."
autre, _ = relancer(["5"])
assert autre["nb_parfaits"] == 0, "Jusqu'à 5 : aucun."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-5-2" label="5.2 [Expert] - L'ordinateur devine" type="python">
<Enonce>
### L'ordinateur devine

L'utilisateur pense à un nombre entre 1 et 100 et l'ordinateur doit le trouver. À chaque proposition, l'utilisateur répond `+` (son nombre est plus grand), `-` (plus petit) ou `=` (trouvé).

L'ordinateur propose toujours le milieu de l'intervalle encore possible : `(bas + haut) // 2`, en partant de `bas = 1` et `haut = 100`.

À la fin, `proposition` contient le nombre trouvé et `essais` le nombre de propositions faites.

<Indices>
<Indice>

Après une réponse `+`, le nombre est au-dessus de la proposition : la borne `bas` remonte juste au-dessus.

</Indice>
<Indice>

Après `-`, c'est la borne `haut` qui descend juste en dessous de la proposition.

</Indice>
<Indice>

La boucle continue tant que la réponse n'est pas `=`. Initialiser la réponse avant la boucle pour pouvoir y entrer.

</Indice>
<Indice>

```text
bas ← 1 ; haut ← 100 ; essais ← 0 ; reponse ← ""
TANT QUE reponse ≠ "="
    proposition ← quotient de (bas + haut) par 2
    essais ← essais + 1
    AFFICHER proposition
    LIRE reponse
    SI reponse = "+" ALORS bas ← proposition + 1
    SINON SI reponse = "-" ALORS haut ← proposition - 1
    FIN SI
FIN TANT QUE
```

</Indice>
</Indices>

<Correction>

```python
bas = 1
haut = 100
essais = 0
reponse = ""
while reponse != "=":
    proposition = (bas + haut) // 2
    essais = essais + 1
    reponse = input("Je propose " + str(proposition) + " (+, - ou =) : ")
    if reponse == "+":
        bas = proposition + 1
    elif reponse == "-":
        haut = proposition - 1
print("Trouvé", proposition, "en", essais, "essais")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["-", "+", "="]
assert proposition == 37 and essais == 3, "Pour 37 : propositions 50, 25 puis 37, 3 essais."
autre, _ = relancer(["="])
assert autre["proposition"] == 50 and autre["essais"] == 1, "Pour 50 : trouvé du premier coup."
autre, _ = relancer(["+", "+", "+", "+", "+", "+", "="])
assert autre["proposition"] == 100 and autre["essais"] == 7, "Pour 100 : 7 essais."
autre, _ = relancer(["-", "-", "-", "-", "-", "="])
assert autre["proposition"] == 1 and autre["essais"] == 6, "Pour 1 : 6 essais."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-5-3" label="5.3 [Expert] - Écriture binaire" type="python">
<Enonce>
### Écriture binaire

Demander un entier positif ou nul et ranger dans `binaire` son écriture en base 2, sous forme de texte (par exemple `"1101"` pour 13).

Méthode : diviser le nombre par 2 tant qu'il n'est pas nul. Les restes successifs, lus **du dernier au premier**, forment l'écriture binaire.

Contrainte : sans la fonction `bin`.

<Indices>
<Indice>

Chaque reste vaut 0 ou 1. Le premier reste obtenu est le chiffre de droite.

</Indice>
<Indice>

Ajouter chaque nouveau reste **devant** le texte déjà construit : `str(n % 2) + binaire`.

</Indice>
<Indice>

0 s'écrit `"0"` : la boucle ne fait aucun tour dans ce cas, il faut le prévoir.

</Indice>
<Indice>

```text
LIRE n (entier)
SI n = 0 ALORS binaire ← "0"
SINON
    binaire ← ""
    TANT QUE n > 0
        binaire ← texte(reste de n par 2) + binaire
        n ← quotient de n par 2
    FIN TANT QUE
FIN SI
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Entier : "))
if n == 0:
    binaire = "0"
else:
    binaire = ""
    while n > 0:
        binaire = str(n % 2) + binaire
        n = n // 2
print(binaire)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["13"]
assert binaire == "1101", "13 s'écrit 1101."
for n in [0, 1, 2, 8, 255, 1024, 2026]:
    autre, _ = relancer([str(n)])
    assert autre["binaire"] == format(n, "b"), f"{n} s'écrit {format(n, 'b')}."
assert "bin(" not in PROGRAMME and "format(" not in PROGRAMME, "Sans bin ni format."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-5-4" label="5.4 [Expert] - Le mot le plus long" type="python">
<Enonce>
### Le mot le plus long

Demander une phrase (les mots sont séparés par une espace, sans ponctuation) et ranger dans `plus_long` son mot le plus long. En cas d'égalité, garder le premier.

Contrainte : parcourir la phrase caractère par caractère, sans `split`.

<Indices>
<Indice>

Construire le mot en cours lettre par lettre. Une espace marque la fin d'un mot.

</Indice>
<Indice>

À la fin de chaque mot, le comparer au plus long trouvé jusque-là, puis repartir d'un mot vide.

</Indice>
<Indice>

Le dernier mot n'est suivi d'aucune espace : il faut aussi le comparer après la boucle.

</Indice>
<Indice>

```text
LIRE phrase
plus_long ← "" ; mot ← ""
POUR CHAQUE c DE phrase
    SI c = " " ALORS
        SI longueur(mot) > longueur(plus_long) ALORS plus_long ← mot FIN SI
        mot ← ""
    SINON
        mot ← mot + c
    FIN SI
FIN POUR
SI longueur(mot) > longueur(plus_long) ALORS plus_long ← mot FIN SI
```

</Indice>
</Indices>

<Correction>

```python
phrase = input("Phrase : ")
plus_long = ""
mot = ""
for c in phrase:
    if c == " ":
        if len(mot) > len(plus_long):
            plus_long = mot
        mot = ""
    else:
        mot = mot + c
if len(mot) > len(plus_long):
    plus_long = mot
print(plus_long)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["le renard roux court vite"]
assert plus_long == "renard", "« le renard roux court vite » : renard."
for p, m in [("un chat", "chat"), ("bonjour", "bonjour"), ("ab cd ef", "ab"), ("la programmation en python", "programmation")]:
    autre, _ = relancer([p])
    assert autre["plus_long"] == m, f"« {p} » : {m}."
assert "split" not in PROGRAMME, "Sans split."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-6-1" label="6.1 [Mini-projet] - Mastermind" type="python">
<Enonce>
### Mastermind

**Contexte.** Le club de jeux du lycée veut une version du Mastermind à jouer seul sur ordinateur, avec des chiffres à la place des pions de couleur. L'ordinateur choisit un code secret. Le joueur propose ensuite des codes et, à chaque essai, l'ordinateur lui indique combien de chiffres sont à la bonne place et combien sont présents mais mal placés. Le joueur a 10 essais pour trouver.

**Règles du jeu**
- Le code secret est formé de **4 chiffres de 1 à 6** (un même chiffre peut revenir). Il est tiré avec quatre appels à `random.randint(1, 6)`, après `import random`, et rangé sous forme de texte, par exemple `"1523"`.
- Une saisie qui n'est pas formée d'exactement 4 chiffres de 1 à 6 fait afficher `saisie invalide` et ne compte pas comme un essai : le joueur ne perd pas d'essai pour une faute de frappe.
- Après chaque essai valide, le programme affiche le nombre de chiffres **bien placés** et de chiffres **mal placés** (présents dans le secret mais ailleurs), sous la forme `2 bien placé(s), 1 mal placé(s)`. Chaque chiffre du secret ne peut servir qu'une fois : avec le secret `1123`, l'essai `3111` donne 1 bien placé et 2 mal placés.
- La partie s'arrête quand le code est trouvé ou après **10 essais valides**.

**Ce que le programme doit produire**
- `secret` : le code tiré, que le joueur doit deviner.
- `essais` : le nombre d'essais valides, qui sert de score (moins il y en a, meilleure est la partie).
- `gagne` : `True` si le code a été trouvé.
- Un message de fin : la victoire avec le nombre d'essais, ou la défaite en révélant le code secret.

<Indices>
<Indice>

Découper le programme en deux parties : le tirage du secret, puis une boucle de jeu. Dans la boucle, lire et valider la saisie, puis calculer les chiffres bien placés et enfin les mal placés.

</Indice>
<Indice>

Les bien placés se comptent en comparant `essai[i]` et `secret[i]` pour `i` de 0 à 3.

</Indice>
<Indice>

Pour les mal placés, compter pour chaque chiffre `c` de `"123456"` le minimum de ses apparitions dans le secret et dans l'essai (`secret.count(c)`) : cela donne le nombre de chiffres communs, bien placés compris. Il reste à retirer les bien placés.

</Indice>
<Indice>

```text
(cœur du programme : bien et mal placés)
bien ← 0
POUR i ALLANT DE 0 À 3 : SI essai[i] = secret[i] ALORS bien ← bien + 1
communs ← 0
POUR CHAQUE c DE "123456"
    communs ← communs + min(nombre de c dans secret, nombre de c dans essai)
mal ← communs - bien
```

</Indice>
</Indices>

<Correction>

```python
import random

secret = ""
for _ in range(4):
    secret = secret + str(random.randint(1, 6))

essais = 0
gagne = False
while not gagne and essais < 10:
    essai = input("Code : ")
    valide = len(essai) == 4
    for c in essai:
        if c not in "123456":
            valide = False
    if not valide:
        print("saisie invalide")
    else:
        essais = essais + 1
        bien = 0
        for i in range(4):
            if essai[i] == secret[i]:
                bien = bien + 1
        communs = 0
        for c in "123456":
            communs = communs + min(secret.count(c), essai.count(c))
        print(bien, "bien placé(s),", communs - bien, "mal placé(s)")
        if bien == 4:
            gagne = True
if gagne:
    print("Gagné en", essais, "essais !")
else:
    print("Perdu, le code était", secret)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["1111", "2222", "3333", "4444", "5555", "6666", "1234", "4321", "1212", "3434"]
import random
_tirage = random.randint
def _suite(chiffres):
    reste = list(chiffres)
    return lambda a, b: reste.pop(0)
try:
    random.randint = _suite([1, 1, 2, 3])
    autre, sortie = relancer(["3111", "12a4", "123", "1123"])
    assert autre["secret"] == "1123", "Le secret est formé des quatre tirages."
    assert "1 bien placé(s), 2 mal placé(s)" in sortie, "Secret 1123, essai 3111 : 1 bien placé, 2 mal placés."
    assert sortie.count("saisie invalide") == 2, "12a4 et 123 sont refusés."
    assert autre["gagne"] is True and autre["essais"] == 2, "Trouvé au 2e essai valide."
    random.randint = _suite([6, 5, 4, 3])
    autre, sortie = relancer(["3456", "6543"])
    assert "0 bien placé(s), 4 mal placé(s)" in sortie and autre["essais"] == 2, "3456 contre 6543 : 0 bien placé, 4 mal placés."
    random.randint = _suite([2, 2, 2, 2])
    autre, sortie = relancer(["1111"] * 10)
    assert autre["gagne"] is False and autre["essais"] == 10, "Dix essais ratés : perdu."
    assert "2222" in sortie.strip().splitlines()[-1], "Le code est révélé à la fin."
    random.randint = _suite([1, 2, 1, 2])
    autre, sortie = relancer(["2121", "1122", "1212"])
    assert "0 bien placé(s), 4 mal placé(s)" in sortie and "2 bien placé(s), 2 mal placé(s)" in sortie, "Chiffres répétés."
finally:
    random.randint = _tirage
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-boucles-6-2" label="6.2 [Mini-projet] - Chronos d'une course" type="python">
<Enonce>
### Chronos d'une course

**Contexte.** Lors du cross du lycée, un professeur d'EPS note sur des fiches le temps de chaque coureur à l'arrivée. Il veut un programme où il tape les temps les uns après les autres, et qui lui donne aussitôt les résultats à afficher dans le gymnase : nombre d'arrivants, meilleur temps, temps moyen, podium, et la plus belle série de progression. Le programme se passe de liste.

**Données saisies** : les temps des coureurs, dans l'ordre des fiches, au format `mm:ss` (par exemple `12:05`). La saisie de `fin` arrête la série. Un temps mal écrit (pas de la forme deux chiffres, `:`, deux chiffres, ou des secondes au-delà de 59) fait afficher `temps invalide` et est ignoré, pour que le professeur puisse le retaper.

Exemple de saisie : `12:30`, `11:45`, `13:02`, `10:59`, `10:50`, `fin`.

**Ce que le programme doit produire**
- `nb` : le nombre de temps valides, c'est-à-dire de coureurs classés.
- `meilleur` : le temps du vainqueur, au format `"mm:ss"`.
- `moyenne` : le temps moyen des coureurs, arrondi à la seconde, au format `"mm:ss"`, pour comparer d'une année sur l'autre.
- `podium` : les trois meilleurs temps, du meilleur au moins bon, séparés par ` / ` (moins de trois s'il y a moins de coureurs), affiché sur le panneau des résultats.
- `progression` : la plus longue suite de temps **consécutifs** (dans l'ordre de saisie) qui s'améliorent à chaque fois. Un seul temps forme une suite de longueur 1. Cette valeur sert à commenter la course.
- Si aucun temps n'est valide, le programme affiche `aucun temps` (et `nb` vaut 0).

Dans l'exemple, on obtient `nb = 5`, `meilleur = "10:50"`, `moyenne = "11:49"`, `podium = "10:50 / 10:59 / 11:45"` et `progression = 3`.

<Indices>
<Indice>

Travailler en secondes : `12:05` vaut 725 s. Une petite conversion à l'aller (texte vers secondes) et une au retour (secondes vers `mm:ss`, avec `f"{m:02d}:{s:02d}"`).

</Indice>
<Indice>

Sans liste, le podium tient dans trois variables `p1 <= p2 <= p3` (au départ, une valeur impossible comme 10 ** 9). Un nouveau temps s'insère en faisant descendre les autres d'une place.

</Indice>
<Indice>

Pour la progression, garder le temps précédent, la longueur de la suite en cours et la plus grande longueur vue.

</Indice>
<Indice>

```text
(cœur du programme : insérer un temps t dans le podium p1 ≤ p2 ≤ p3)
SI t < p1 ALORS p3 ← p2 ; p2 ← p1 ; p1 ← t
SINON SI t < p2 ALORS p3 ← p2 ; p2 ← t
SINON SI t < p3 ALORS p3 ← t
```

</Indice>
</Indices>

<Correction>

```python
INFINI = 10 ** 9
nb = 0
total = 0
p1 = p2 = p3 = INFINI
precedent = INFINI
en_cours = 0
progression = 0

saisie = input("Temps (mm:ss ou fin) : ")
while saisie != "fin":
    ok = len(saisie) == 5 and saisie[2] == ":" and saisie[0:2].isdigit() and saisie[3:5].isdigit() and int(saisie[3:5]) <= 59
    if not ok:
        print("temps invalide")
    else:
        t = int(saisie[0:2]) * 60 + int(saisie[3:5])
        nb = nb + 1
        total = total + t
        if t < p1:
            p3, p2, p1 = p2, p1, t
        elif t < p2:
            p3, p2 = p2, t
        elif t < p3:
            p3 = t
        if t < precedent:
            en_cours = en_cours + 1
        else:
            en_cours = 1
        precedent = t
        if en_cours > progression:
            progression = en_cours
    saisie = input("Temps (mm:ss ou fin) : ")

if nb == 0:
    print("aucun temps")
else:
    meilleur = f"{p1 // 60:02d}:{p1 % 60:02d}"
    m = round(total / nb)
    moyenne = f"{m // 60:02d}:{m % 60:02d}"
    podium = meilleur
    for p in (p2, p3):
        if p != INFINI:
            podium = podium + f" / {p // 60:02d}:{p % 60:02d}"
    print(nb, "coureurs - meilleur", meilleur, "- moyenne", moyenne)
    print("Podium :", podium, "- progression :", progression)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["12:30", "11:45", "13:02", "10:59", "10:50", "fin"]
assert nb == 5 and meilleur == "10:50" and moyenne == "11:49", "Exemple : 5 temps, meilleur 10:50, moyenne 11:49."
assert podium == "10:50 / 10:59 / 11:45" and progression == 3, "Podium et progression de l'exemple."
autre, sortie = relancer(["9:59", "10:60", "ab:cd", "08:00", "fin"])
assert autre["nb"] == 1 and sortie.count("temps invalide") == 3 and autre["podium"] == "08:00", "Trois saisies invalides, un seul temps."
autre, _ = relancer(["10:00", "09:00", "08:00", "07:00", "07:30", "fin"])
assert autre["progression"] == 4 and autre["podium"] == "07:00 / 07:30 / 08:00", "Quatre améliorations de suite."
autre, _ = relancer(["10:00", "10:00", "fin"])
assert autre["progression"] == 1 and autre["podium"] == "10:00 / 10:00", "Égalité : pas d'amélioration ; deux coureurs."
autre, sortie = relancer(["fin"])
assert autre["nb"] == 0 and "aucun temps" in sortie, "Aucun temps."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
