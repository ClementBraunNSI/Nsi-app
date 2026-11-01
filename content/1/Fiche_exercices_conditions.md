---
title: 'Fiche d''exercices : Les conditions en Python'
description: Exercices sur les conditions (if/else) en Python.
level: seconde
chapter: Programmation Python
icon: "circle-question-mark"
prerequisites:
  - Fiche_exercices_boucles
audience: public
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="fiche-conditions" courseTitle="Fiche Conditions">

<ExerciseSection id="snt-cond-1-1" label="1.1 [Introduction] - Majeur ou mineur" type="python">
<Enonce>
### Majeur ou mineur

Demander un âge, puis ranger dans `statut` le texte `"majeur"` à partir de 18 ans et `"mineur"` sinon. Afficher `statut`.

<Indices>
<Indice>

La structure s'écrit `if condition:` puis `else:`. Les deux points et le décalage des lignes en dessous sont obligatoires.

</Indice>
<Indice>

« À partir de 18 ans » inclut 18 : la comparaison est `>=`.

</Indice>
<Indice>

```text
LIRE age (entier)
SI age ≥ 18 ALORS
    statut ← "majeur"
SINON
    statut ← "mineur"
FIN SI
AFFICHER statut
```

</Indice>
</Indices>

<Correction>

```python
age = int(input("Âge : "))
if age >= 18:
    statut = "majeur"
else:
    statut = "mineur"
print(statut)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["18"]
assert statut == "majeur", "18 ans : majeur."
for a, s in [(17, "mineur"), (45, "majeur"), (0, "mineur")]:
    autre, _ = relancer([str(a)])
    assert autre["statut"] == s, f"{a} ans : {s}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-1-2" label="1.2 [Introduction] - Signe d'un nombre" type="python">
<Enonce>
### Signe d'un nombre

Demander un nombre (à virgule possible) et ranger dans `signe` le texte `"positif"`, `"négatif"` ou `"nul"`.

<Indices>
<Indice>

Il y a trois cas possibles. Le premier se teste avec `if`, le deuxième avec `elif`, et le dernier se traite avec `else`.

</Indice>
<Indice>

Zéro n'est ni positif ni négatif : le tester à part.

</Indice>
<Indice>

```text
LIRE x (nombre à virgule)
SI x > 0 ALORS
    signe ← "positif"
SINON SI x < 0 ALORS
    signe ← "négatif"
SINON
    signe ← "nul"
FIN SI
AFFICHER signe
```

</Indice>
</Indices>

<Correction>

```python
x = float(input("Nombre : "))
if x > 0:
    signe = "positif"
elif x < 0:
    signe = "négatif"
else:
    signe = "nul"
print(signe)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["4.5"]
assert signe == "positif", "4,5 est positif."
for v, s in [("-0.1", "négatif"), ("0", "nul"), ("-12", "négatif")]:
    autre, _ = relancer([v])
    assert autre["signe"] == s, f"{v} : {s}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-1-3" label="1.3 [Introduction] - Porte du terrier" type="python">
<Enonce>
### Porte du terrier

La porte du terrier s'ouvre avec le code `renard42`.

Demander le code, puis ranger dans `message` le texte `"Entrée autorisée"` si le code est le bon, `"Code incorrect"` sinon. Afficher `message`.

<Indices>
<Indice>

L'égalité se teste avec `==` (deux signes), le `=` seul sert à ranger une valeur.

</Indice>
<Indice>

Le code est un texte : le comparer à `"renard42"`, avec les guillemets.

</Indice>
<Indice>

```text
LIRE code
SI code = "renard42" ALORS
    message ← "Entrée autorisée"
SINON
    message ← "Code incorrect"
FIN SI
AFFICHER message
```

</Indice>
</Indices>

<Correction>

```python
code = input("Code : ")
if code == "renard42":
    message = "Entrée autorisée"
else:
    message = "Code incorrect"
print(message)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["renard42"]
assert message == "Entrée autorisée", "Le bon code ouvre la porte."
for c in ["Renard42", "renard 42", "42"]:
    autre, _ = relancer([c])
    assert autre["message"] == "Code incorrect", f"« {c} » est refusé."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-1-4" label="1.4 [Introduction] - Pair ou impair" type="python">
<Enonce>
### Pair ou impair

Demander un entier et ranger dans `parite` le texte `"pair"` ou `"impair"`.

<Indices>
<Indice>

Un nombre est pair quand le reste de sa division par 2 vaut 0.

</Indice>
<Indice>

Le reste d'une division s'obtient avec `%`.

</Indice>
<Indice>

```text
LIRE n (entier)
SI reste de n par 2 = 0 ALORS
    parite ← "pair"
SINON
    parite ← "impair"
FIN SI
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Entier : "))
if n % 2 == 0:
    parite = "pair"
else:
    parite = "impair"
print(parite)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["14"]
assert parite == "pair", "14 est pair."
for v, p in [(7, "impair"), (0, "pair"), (-3, "impair")]:
    autre, _ = relancer([str(v)])
    assert autre["parite"] == p, f"{v} est {p}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-2-1" label="2.1 [Facile] - Mention" type="python">
<Enonce>
### Mention

Demander une note sur 20 (à virgule possible) et ranger dans `mention` :
- `"Insuffisant"` en dessous de 10 ;
- `"Passable"` de 10 à moins de 12 ;
- `"Assez bien"` de 12 à moins de 14 ;
- `"Bien"` de 14 à moins de 16 ;
- `"Très bien"` à partir de 16.

<Indices>
<Indice>

Avec une suite de `elif`, Python s'arrête au premier test vrai : tester les seuils dans l'ordre.

</Indice>
<Indice>

En partant du haut (`note >= 16`, puis `note >= 14`…), chaque test n'a besoin que d'une comparaison.

</Indice>
<Indice>

```text
LIRE note (nombre à virgule)
SI note ≥ 16 ALORS mention ← "Très bien"
SINON SI note ≥ 14 ALORS mention ← "Bien"
SINON SI note ≥ 12 ALORS mention ← "Assez bien"
SINON SI note ≥ 10 ALORS mention ← "Passable"
SINON mention ← "Insuffisant"
FIN SI
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
<Verification>

```python
ENTREES = ["13.5"]
assert mention == "Assez bien", "13,5 : Assez bien."
for n, m in [(9.99, "Insuffisant"), (10, "Passable"), (12, "Assez bien"), (14, "Bien"), (15.9, "Bien"), (16, "Très bien"), (20, "Très bien")]:
    autre, _ = relancer([str(n)])
    assert autre["mention"] == m, f"{n} : {m}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-2-2" label="2.2 [Facile] - Tarif du cinéma" type="python">
<Enonce>
### Tarif du cinéma

Au cinéma du quartier, la place coûte 5 € pour les moins de 14 ans, 7 € à partir de 65 ans et 10 € pour les autres.

Demander l'âge et ranger le prix dans `prix`.

<Indices>
<Indice>

Il y a trois tarifs, donc trois cas à traiter avec `if`, `elif` et `else`.

</Indice>
<Indice>

Bien lire les bornes : 14 ans paie plein tarif, 65 ans paie 7 €.

</Indice>
<Indice>

```text
LIRE age (entier)
SI age < 14 ALORS prix ← 5
SINON SI age ≥ 65 ALORS prix ← 7
SINON prix ← 10
FIN SI
AFFICHER prix
```

</Indice>
</Indices>

<Correction>

```python
age = int(input("Âge : "))
if age < 14:
    prix = 5
elif age >= 65:
    prix = 7
else:
    prix = 10
print(prix, "€")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["8"]
assert prix == 5, "8 ans : 5 €."
for a, p in [(13, 5), (14, 10), (64, 10), (65, 7), (90, 7)]:
    autre, _ = relancer([str(a)])
    assert autre["prix"] == p, f"{a} ans : {p} €."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-2-3" label="2.3 [Facile] - Conseil météo" type="python">
<Enonce>
### Conseil météo

Demander la température du jour (à virgule possible) et ranger dans `conseil` :
- `"Bonnet et gants"` en dessous de 0 ;
- `"Manteau"` de 0 à moins de 15 ;
- `"Pull"` de 15 à moins de 25 ;
- `"T-shirt"` à partir de 25.

<Indices>
<Indice>

Partir de la plus petite température et monter : `temperature < 0`, puis `temperature < 15`…

</Indice>
<Indice>

Un `elif` n'est testé que si les tests précédents sont faux : inutile de répéter la borne basse.

</Indice>
<Indice>

```text
LIRE temperature (nombre à virgule)
SI temperature < 0 ALORS conseil ← "Bonnet et gants"
SINON SI temperature < 15 ALORS conseil ← "Manteau"
SINON SI temperature < 25 ALORS conseil ← "Pull"
SINON conseil ← "T-shirt"
FIN SI
```

</Indice>
</Indices>

<Correction>

```python
temperature = float(input("Température : "))
if temperature < 0:
    conseil = "Bonnet et gants"
elif temperature < 15:
    conseil = "Manteau"
elif temperature < 25:
    conseil = "Pull"
else:
    conseil = "T-shirt"
print(conseil)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["-3"]
assert conseil == "Bonnet et gants", "-3 °C : Bonnet et gants."
for t, c in [(0, "Manteau"), (14.9, "Manteau"), (15, "Pull"), (24, "Pull"), (25, "T-shirt"), (38, "T-shirt")]:
    autre, _ = relancer([str(t)])
    assert autre["conseil"] == c, f"{t} °C : {c}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-2-4" label="2.4 [Facile] - Frais de livraison" type="python">
<Enonce>
### Frais de livraison

Une boutique en ligne offre la livraison à partir de 50 € d'achat ; en dessous, elle coûte 4,90 €.

Demander le montant du panier, puis calculer `frais` et `total` (panier + frais).

<Indices>
<Indice>

Décider d'abord des frais avec un `if`, calculer le total ensuite, une seule fois, après le `if`.

</Indice>
<Indice>

La virgule s'écrit avec un point : `4.90`.

</Indice>
<Indice>

```text
LIRE panier (nombre à virgule)
SI panier ≥ 50 ALORS frais ← 0
SINON frais ← 4,90
FIN SI
total ← panier + frais
AFFICHER total
```

</Indice>
</Indices>

<Correction>

```python
panier = float(input("Montant du panier : "))
if panier >= 50:
    frais = 0
else:
    frais = 4.90
total = panier + frais
print("Total :", total, "€")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["32"]
assert frais == 4.9 and abs(total - 36.9) < 1e-9, "Panier de 32 € : 4,90 € de frais, 36,90 €."
for p, f, t in [(50, 0, 50), (49.99, 4.9, 54.89), (120, 0, 120)]:
    autre, _ = relancer([str(p)])
    assert autre["frais"] == f and abs(autre["total"] - t) < 1e-9, f"Panier de {p} € : {t} €."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-3-1" label="3.1 [Moyen] - Le plus grand des trois" type="python">
<Enonce>
### Le plus grand des trois

Demander trois nombres et ranger le plus grand dans `maximum`.

Contrainte : sans utiliser la fonction `max`.

<Indices>
<Indice>

Une idée : supposer que le premier est le plus grand, puis le comparer aux deux autres l'un après l'autre.

</Indice>
<Indice>

Deux `if` séparés (pas de `elif`) : chaque nombre doit être comparé au maximum provisoire.

</Indice>
<Indice>

```text
LIRE a, b, c (nombres)
maximum ← a
SI b > maximum ALORS maximum ← b FIN SI
SI c > maximum ALORS maximum ← c FIN SI
AFFICHER maximum
```

</Indice>
</Indices>

<Correction>

```python
a = float(input("a : "))
b = float(input("b : "))
c = float(input("c : "))
maximum = a
if b > maximum:
    maximum = b
if c > maximum:
    maximum = c
print("Le plus grand :", maximum)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["4", "9", "2"]
assert maximum == 9, "4, 9, 2 : 9."
for t, m in [(("9", "4", "2"), 9), (("2", "4", "9"), 9), (("-5", "-1", "-8"), -1), (("3", "3", "3"), 3)]:
    autre, _ = relancer(list(t))
    assert autre["maximum"] == m, f"{', '.join(t)} : {m}."
import re
assert not re.search(r"\bmax\s*\(", PROGRAMME), "La fonction max n'est pas utilisée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-3-2" label="3.2 [Moyen] - Magasin ouvert ?" type="python">
<Enonce>
### Magasin ouvert ?

Le magasin du village ouvre du lundi au samedi, de 9 h à 19 h (il ferme à 19 h pile). Il est fermé le dimanche.

Demander le jour (en minuscules, par exemple `mardi`) puis l'heure (un entier de 0 à 23), et ranger dans `ouvert` le booléen `True` ou `False`.

<Indices>
<Indice>

Deux conditions doivent être vraies en même temps : elles se combinent avec `and`.

</Indice>
<Indice>

Une condition est déjà un booléen : `ouvert = heure >= 9` est permis, sans `if`.

</Indice>
<Indice>

```text
LIRE jour
LIRE heure (entier)
ouvert ← (jour ≠ "dimanche") ET (heure ≥ 9) ET (heure < 19)
AFFICHER ouvert
```

</Indice>
</Indices>

<Correction>

```python
jour = input("Jour : ")
heure = int(input("Heure : "))
ouvert = jour != "dimanche" and heure >= 9 and heure < 19
print("Ouvert" if ouvert else "Fermé")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["mardi", "10"]
assert ouvert is True, "Mardi à 10 h : ouvert."
for j, h, o in [("samedi", 18, True), ("samedi", 19, False), ("lundi", 8, False), ("lundi", 9, True), ("dimanche", 11, False)]:
    autre, _ = relancer([j, str(h)])
    assert autre["ouvert"] is o, f"{j} à {h} h : {'ouvert' if o else 'fermé'}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-3-3" label="3.3 [Moyen] - Fizz Buzz" type="python">
<Enonce>
### Fizz Buzz

Demander un entier positif et ranger dans `reponse` :
- `"FizzBuzz"` s'il est divisible par 3 et par 5 ;
- `"Fizz"` s'il est divisible seulement par 3 ;
- `"Buzz"` s'il est divisible seulement par 5 ;
- le nombre lui-même, sous forme de texte, sinon.

<Indices>
<Indice>

« Divisible par 3 » : le reste de la division par 3 vaut 0.

</Indice>
<Indice>

L'ordre des tests compte : 15 est divisible par 3, mais il doit donner `FizzBuzz`. Quel cas tester en premier ?

</Indice>
<Indice>

```text
LIRE n (entier)
SI n divisible par 3 ET n divisible par 5 ALORS reponse ← "FizzBuzz"
SINON SI n divisible par 3 ALORS reponse ← "Fizz"
SINON SI n divisible par 5 ALORS reponse ← "Buzz"
SINON reponse ← texte(n)
FIN SI
```

</Indice>
</Indices>

<Correction>

```python
n = int(input("Nombre : "))
if n % 3 == 0 and n % 5 == 0:
    reponse = "FizzBuzz"
elif n % 3 == 0:
    reponse = "Fizz"
elif n % 5 == 0:
    reponse = "Buzz"
else:
    reponse = str(n)
print(reponse)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["15"]
assert reponse == "FizzBuzz", "15 : FizzBuzz."
for n, r in [(9, "Fizz"), (10, "Buzz"), (7, "7"), (30, "FizzBuzz"), (1, "1")]:
    autre, _ = relancer([str(n)])
    assert autre["reponse"] == r, f"{n} : {r}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-3-4" label="3.4 [Moyen] - Année bissextile" type="python">
<Enonce>
### Année bissextile

Une année est bissextile si elle est divisible par 4 mais pas par 100, **ou** si elle est divisible par 400.

Demander une année et ranger dans `bissextile` le booléen `True` ou `False`.

<Indices>
<Indice>

La règle se traduit presque mot à mot avec `and`, `or` et `!=`.

</Indice>
<Indice>

Les parenthèses lèvent toute ambiguïté : `(… and …) or …`.

</Indice>
<Indice>

```text
LIRE annee (entier)
bissextile ← (annee divisible par 4 ET annee non divisible par 100) OU (annee divisible par 400)
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
<Verification>

```python
ENTREES = ["2024"]
assert bissextile is True, "2024 est bissextile."
for a, b in [(2026, False), (1900, False), (2000, True), (2100, False), (2400, True)]:
    autre, _ = relancer([str(a)])
    assert autre["bissextile"] is b, f"{a} : {'bissextile' if b else 'non bissextile'}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-4-1" label="4.1 [Difficile] - Nature d'un triangle" type="python">
<Enonce>
### Nature d'un triangle

Demander les trois longueurs des côtés d'un triangle et ranger dans `nature` :
- `"impossible"` si un côté est plus long que la somme des deux autres (ou lui est égal) ;
- `"équilatéral"` si les trois côtés sont égaux ;
- `"isocèle"` si exactement deux côtés sont égaux ;
- `"quelconque"` sinon.

<Indices>
<Indice>

Tester d'abord le cas impossible : les autres n'ont de sens que pour un vrai triangle.

</Indice>
<Indice>

Équilatéral se teste avant isocèle, puisqu'un triangle équilatéral a aussi deux côtés égaux.

</Indice>
<Indice>

Pour isocèle, trois paires de côtés sont à comparer, reliées par `or`.

</Indice>
<Indice>

```text
LIRE a, b, c (nombres)
SI a ≥ b + c OU b ≥ a + c OU c ≥ a + b ALORS nature ← "impossible"
SINON SI a = b ET b = c ALORS nature ← "équilatéral"
SINON SI a = b OU b = c OU a = c ALORS nature ← "isocèle"
SINON nature ← "quelconque"
FIN SI
```

</Indice>
</Indices>

<Correction>

```python
a = float(input("a : "))
b = float(input("b : "))
c = float(input("c : "))
if a >= b + c or b >= a + c or c >= a + b:
    nature = "impossible"
elif a == b and b == c:
    nature = "équilatéral"
elif a == b or b == c or a == c:
    nature = "isocèle"
else:
    nature = "quelconque"
print(nature)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["3", "4", "5"]
assert nature == "quelconque", "3, 4, 5 : quelconque."
for t, n in [(("2", "2", "2"), "équilatéral"), (("5", "3", "5"), "isocèle"), (("1", "2", "3"), "impossible"), (("1", "10", "2"), "impossible"), (("4", "4", "7"), "isocèle")]:
    autre, _ = relancer(list(t))
    assert autre["nature"] == n, f"{', '.join(t)} : {n}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-4-2" label="4.2 [Difficile] - Pierre, feuille, ciseaux" type="python">
<Enonce>
### Pierre, feuille, ciseaux

Demander le choix du joueur 1 puis celui du joueur 2 (`pierre`, `feuille` ou `ciseaux`) et ranger dans `gagnant` le texte `"joueur 1"`, `"joueur 2"` ou `"égalité"`.

Rappel : la pierre casse les ciseaux, les ciseaux coupent la feuille, la feuille enveloppe la pierre.

<Indices>
<Indice>

Traiter l'égalité en premier : les deux choix sont identiques.

</Indice>
<Indice>

Le joueur 1 gagne dans exactement trois situations : les écrire avec `or` et des parenthèses. Tous les autres cas sont gagnés par le joueur 2.

</Indice>
<Indice>

```text
LIRE j1, j2
SI j1 = j2 ALORS gagnant ← "égalité"
SINON SI (j1 = "pierre" ET j2 = "ciseaux") OU (j1 = "ciseaux" ET j2 = "feuille") OU (j1 = "feuille" ET j2 = "pierre") ALORS
    gagnant ← "joueur 1"
SINON gagnant ← "joueur 2"
FIN SI
```

</Indice>
</Indices>

<Correction>

```python
j1 = input("Joueur 1 : ")
j2 = input("Joueur 2 : ")
if j1 == j2:
    gagnant = "égalité"
elif (j1 == "pierre" and j2 == "ciseaux") or (j1 == "ciseaux" and j2 == "feuille") or (j1 == "feuille" and j2 == "pierre"):
    gagnant = "joueur 1"
else:
    gagnant = "joueur 2"
print(gagnant)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["pierre", "ciseaux"]
assert gagnant == "joueur 1", "Pierre contre ciseaux : joueur 1."
cas = [("ciseaux", "pierre", "joueur 2"), ("feuille", "pierre", "joueur 1"), ("pierre", "feuille", "joueur 2"),
       ("ciseaux", "feuille", "joueur 1"), ("feuille", "ciseaux", "joueur 2"), ("feuille", "feuille", "égalité")]
for a, b, g in cas:
    autre, _ = relancer([a, b])
    assert autre["gagnant"] == g, f"{a} contre {b} : {g}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-4-3" label="4.3 [Difficile] - Calculatrice" type="python">
<Enonce>
### Calculatrice

Demander un premier nombre, un opérateur (`+`, `-`, `*` ou `/`) puis un second nombre, et ranger le résultat dans `resultat`.

Deux cas d'erreur : une division par zéro et un opérateur inconnu rangent le texte `"erreur"` dans `resultat`.

<Indices>
<Indice>

Un `elif` par opérateur, et un `else` final pour l'opérateur inconnu.

</Indice>
<Indice>

Dans le cas de la division, un `if` à l'intérieur du `elif` vérifie que le diviseur n'est pas nul.

</Indice>
<Indice>

```text
LIRE a (nombre), op, b (nombre)
SI op = "+" ALORS resultat ← a + b
SINON SI op = "-" ALORS resultat ← a - b
SINON SI op = "*" ALORS resultat ← a × b
SINON SI op = "/" ALORS
    SI b = 0 ALORS resultat ← "erreur" SINON resultat ← a / b FIN SI
SINON resultat ← "erreur"
FIN SI
```

</Indice>
</Indices>

<Correction>

```python
a = float(input("Premier nombre : "))
op = input("Opérateur : ")
b = float(input("Second nombre : "))
if op == "+":
    resultat = a + b
elif op == "-":
    resultat = a - b
elif op == "*":
    resultat = a * b
elif op == "/":
    if b == 0:
        resultat = "erreur"
    else:
        resultat = a / b
else:
    resultat = "erreur"
print(resultat)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["6", "*", "7"]
assert resultat == 42, "6 * 7 = 42."
for t, r in [(("10", "-", "4"), 6), (("9", "/", "2"), 4.5), (("1", "+", "1"), 2), (("5", "/", "0"), "erreur"), (("5", "%", "2"), "erreur")]:
    autre, _ = relancer(list(t))
    assert autre["resultat"] == r, f"{' '.join(t)} : {r}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-4-4" label="4.4 [Difficile] - Une seconde plus tard" type="python">
<Enonce>
### Une seconde plus tard

Demander une heure sous la forme de trois entiers `h`, `m`, `s` (par exemple `13`, `59`, `59`), puis calculer `h2`, `m2`, `s2` : l'heure qu'il sera **une seconde plus tard**.

Exemples : `13:59:59` devient `14:00:00`, et `23:59:59` devient `00:00:00`.

<Indices>
<Indice>

Ajouter 1 aux secondes. Si elles atteignent 60, elles repartent à 0 et une minute s'ajoute.

</Indice>
<Indice>

La même retenue se propage des minutes vers les heures, puis les heures repartent à 0 après 23.

</Indice>
<Indice>

```text
LIRE h, m, s (entiers)
h2 ← h ; m2 ← m ; s2 ← s + 1
SI s2 = 60 ALORS
    s2 ← 0 ; m2 ← m2 + 1
    SI m2 = 60 ALORS
        m2 ← 0 ; h2 ← h2 + 1
        SI h2 = 24 ALORS h2 ← 0 FIN SI
    FIN SI
FIN SI
```

</Indice>
</Indices>

<Correction>

```python
h = int(input("Heures : "))
m = int(input("Minutes : "))
s = int(input("Secondes : "))
h2, m2, s2 = h, m, s + 1
if s2 == 60:
    s2 = 0
    m2 = m2 + 1
    if m2 == 60:
        m2 = 0
        h2 = h2 + 1
        if h2 == 24:
            h2 = 0
print(h2, ":", m2, ":", s2)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["13", "59", "59"]
assert (h2, m2, s2) == (14, 0, 0), "13:59:59 devient 14:00:00."
for t, r in [((8, 30, 12), (8, 30, 13)), ((8, 30, 59), (8, 31, 0)), ((23, 59, 59), (0, 0, 0)), ((0, 0, 0), (0, 0, 1))]:
    autre, _ = relancer([str(v) for v in t])
    assert (autre["h2"], autre["m2"], autre["s2"]) == r, f"{t} devient {r}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-5-1" label="5.1 [Expert] - Équation du second degré" type="python">
<Enonce>
### Équation du second degré

Une équation `a x² + b x + c = 0` (avec `a` non nul) a 0, 1 ou 2 solutions selon le signe de son discriminant `delta = b² - 4ac`.

Demander `a`, `b` et `c`, puis calculer :
- `delta` ;
- `nb_solutions` : 0, 1 ou 2 ;
- `solutions` : un texte qui donne les solutions arrondies au centième, la plus petite d'abord, séparées par ` et ` (par exemple `"-1.0 et 3.0"`), ou `"aucune"`.

<Indices>
<Indice>

Si delta est positif, les deux solutions valent `(-b - racine(delta)) / (2a)` et `(-b + racine(delta)) / (2a)`. Si delta est nul, une seule : `-b / (2a)`.

</Indice>
<Indice>

Selon le signe de `a`, la formule avec `-` ne donne pas toujours la plus petite : comparer les deux avant de construire le texte.

</Indice>
<Indice>

`x ** 0.5` calcule une racine carrée, `round(x, 2)` arrondit au centième et `str(...)` transforme un nombre en texte.

</Indice>
<Indice>

```text
LIRE a, b, c (nombres)
delta ← b² - 4ac
SI delta < 0 ALORS nb_solutions ← 0 ; solutions ← "aucune"
SINON SI delta = 0 ALORS nb_solutions ← 1 ; solutions ← texte(arrondi(-b / 2a))
SINON
    nb_solutions ← 2
    x1 ← (-b - racine(delta)) / 2a ; x2 ← (-b + racine(delta)) / 2a
    SI x1 > x2 ALORS échanger x1 et x2 FIN SI
    solutions ← texte(arrondi(x1)) + " et " + texte(arrondi(x2))
FIN SI
```

</Indice>
</Indices>

<Correction>

```python
a = float(input("a : "))
b = float(input("b : "))
c = float(input("c : "))
delta = b ** 2 - 4 * a * c
if delta < 0:
    nb_solutions = 0
    solutions = "aucune"
elif delta == 0:
    nb_solutions = 1
    solutions = str(round(-b / (2 * a), 2))
else:
    nb_solutions = 2
    x1 = (-b - delta ** 0.5) / (2 * a)
    x2 = (-b + delta ** 0.5) / (2 * a)
    if x1 > x2:
        x1, x2 = x2, x1
    solutions = str(round(x1, 2)) + " et " + str(round(x2, 2))
print(nb_solutions, "solution(s) :", solutions)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["1", "-2", "-3"]
assert delta == 16 and nb_solutions == 2, "x² - 2x - 3 : delta = 16, deux solutions."
assert solutions == "-1.0 et 3.0", "Les solutions sont -1 et 3, la plus petite d'abord."
cas = [(("1", "2", "1"), 1, "-1.0"), (("1", "0", "1"), 0, "aucune"), (("-1", "0", "4"), 2, "-2.0 et 2.0"), (("2", "-3", "-1"), 2, "-0.28 et 1.78")]
for t, n, s in cas:
    autre, _ = relancer(list(t))
    assert autre["nb_solutions"] == n and autre["solutions"] == s, f"a, b, c = {', '.join(t)} : {s}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-5-2" label="5.2 [Expert] - Date valide ?" type="python">
<Enonce>
### Date valide ?

Demander un jour, un mois et une année (trois entiers) et ranger dans `valide` le booléen `True` si la date existe, `False` sinon.

À savoir : avril, juin, septembre et novembre ont 30 jours ; février en a 29 les années bissextiles et 28 sinon ; les autres mois en ont 31.

<Indices>
<Indice>

Commencer par le nombre de jours du mois, rangé dans une variable `jours_du_mois`, puis comparer le jour à ce nombre.

</Indice>
<Indice>

Pour tester « le mois est 4, 6, 9 ou 11 », plusieurs `==` reliés par `or` suffisent.

</Indice>
<Indice>

Un mois en dehors de 1 à 12, ou un jour inférieur à 1, rend la date invalide.

</Indice>
<Indice>

```text
LIRE jour, mois, annee (entiers)
SI mois = 2 ALORS
    SI annee bissextile ALORS jours_du_mois ← 29 SINON jours_du_mois ← 28 FIN SI
SINON SI mois ∈ (4, 6, 9, 11) ALORS jours_du_mois ← 30
SINON jours_du_mois ← 31
FIN SI
valide ← (1 ≤ mois ≤ 12) ET (1 ≤ jour ≤ jours_du_mois)
```

</Indice>
</Indices>

<Correction>

```python
jour = int(input("Jour : "))
mois = int(input("Mois : "))
annee = int(input("Année : "))
bissextile = (annee % 4 == 0 and annee % 100 != 0) or annee % 400 == 0
if mois == 2:
    if bissextile:
        jours_du_mois = 29
    else:
        jours_du_mois = 28
elif mois == 4 or mois == 6 or mois == 9 or mois == 11:
    jours_du_mois = 30
else:
    jours_du_mois = 31
valide = 1 <= mois <= 12 and 1 <= jour <= jours_du_mois
print(valide)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["29", "2", "2024"]
assert valide is True, "29/02/2024 existe."
cas = [((29, 2, 2026), False), ((31, 4, 2026), False), ((30, 4, 2026), True), ((31, 12, 2026), True),
       ((0, 5, 2026), False), ((12, 13, 2026), False), ((29, 2, 1900), False), ((29, 2, 2000), True)]
for t, v in cas:
    autre, _ = relancer([str(x) for x in t])
    assert autre["valide"] is v, f"{t[0]}/{t[1]}/{t[2]} : {'valide' if v else 'invalide'}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-5-3" label="5.3 [Expert] - Robustesse d'un mot de passe" type="python">
<Enonce>
### Robustesse d'un mot de passe

Demander un mot de passe et ranger dans `niveau` :
- `"fort"` s'il a au moins 12 caractères, au moins une majuscule, au moins une minuscule et au moins un caractère qui n'est pas une lettre ;
- `"moyen"` s'il n'est pas fort mais a au moins 8 caractères ;
- `"faible"` sinon.

Contrainte : sans boucle.

<Indices>
<Indice>

Sans boucle, les méthodes des textes aident : `mdp.lower()` met tout en minuscules. Si le résultat est différent de `mdp`, c'est qu'il contenait une majuscule.

</Indice>
<Indice>

`mdp.isalpha()` vaut `True` quand le texte ne contient que des lettres.

</Indice>
<Indice>

Ranger chaque critère dans un booléen (`a_majuscule`, `a_minuscule`, `a_autre`) rend la condition finale lisible.

</Indice>
<Indice>

```text
LIRE mdp
a_majuscule ← minuscules(mdp) ≠ mdp
a_minuscule ← majuscules(mdp) ≠ mdp
a_autre ← mdp ne contient pas que des lettres
SI longueur(mdp) ≥ 12 ET a_majuscule ET a_minuscule ET a_autre ALORS niveau ← "fort"
SINON SI longueur(mdp) ≥ 8 ALORS niveau ← "moyen"
SINON niveau ← "faible"
FIN SI
```

</Indice>
</Indices>

<Correction>

```python
mdp = input("Mot de passe : ")
a_majuscule = mdp.lower() != mdp
a_minuscule = mdp.upper() != mdp
a_autre = not mdp.isalpha()
if len(mdp) >= 12 and a_majuscule and a_minuscule and a_autre:
    niveau = "fort"
elif len(mdp) >= 8:
    niveau = "moyen"
else:
    niveau = "faible"
print(niveau)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["Renard-Roux-2026"]
assert niveau == "fort", "Renard-Roux-2026 est fort."
for m, n in [("renard", "faible"), ("renardroux", "moyen"), ("RenardRouxNSI", "moyen"), ("renard-roux-26", "moyen"), ("RENARD-ROUX-26", "moyen"), ("Re-2", "faible"), ("Tanière_du_c0de", "fort")]:
    autre, _ = relancer([m])
    assert autre["niveau"] == n, f"{m} : {n}."
import re
assert not re.search(r"\b(for|while)\b", PROGRAMME), "Pas de boucle."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-5-4" label="5.4 [Expert] - Deux rendez-vous" type="python">
<Enonce>
### Deux rendez-vous

Deux rendez-vous sont donnés par leur heure de début et leur heure de fin (des entiers, la fin après le début).

Demander `debut1`, `fin1`, `debut2`, `fin2` et ranger dans `conflit` le booléen `True` si les deux rendez-vous se chevauchent. Un rendez-vous qui commence exactement quand l'autre finit ne crée pas de conflit.

<Indices>
<Indice>

Lister les cas de conflit est long. Il est plus simple de chercher quand il n'y a **pas** de conflit : l'un finit avant que l'autre commence.

</Indice>
<Indice>

Il n'y a pas de conflit si `fin1 <= debut2` ou si `fin2 <= debut1`. Le conflit est le contraire de cette condition.

</Indice>
<Indice>

```text
LIRE debut1, fin1, debut2, fin2 (entiers)
pas_de_conflit ← (fin1 ≤ debut2) OU (fin2 ≤ debut1)
conflit ← NON pas_de_conflit
AFFICHER conflit
```

</Indice>
</Indices>

<Correction>

```python
debut1 = int(input("Début du 1er : "))
fin1 = int(input("Fin du 1er : "))
debut2 = int(input("Début du 2e : "))
fin2 = int(input("Fin du 2e : "))
conflit = not (fin1 <= debut2 or fin2 <= debut1)
print("Conflit" if conflit else "Pas de conflit")
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["9", "11", "10", "12"]
assert conflit is True, "9-11 et 10-12 se chevauchent."
cas = [((9, 10, 10, 11), False), ((14, 16, 8, 9), False), ((8, 18, 12, 13), True), ((12, 13, 8, 18), True), ((10, 12, 10, 12), True), ((15, 16, 14, 15), False)]
for t, c in cas:
    autre, _ = relancer([str(x) for x in t])
    assert autre["conflit"] is c, f"{t[0]}-{t[1]} et {t[2]}-{t[3]} : {'conflit' if c else 'pas de conflit'}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-6-1" label="6.1 [Mini-projet] - Billet de train" type="python">
<Enonce>
### Billet de train

**Contexte.** Une petite compagnie ferroviaire régionale veut une borne qui calcule le prix d'un billet sans erreur. Les guichetiers se trompent souvent, car les règles se combinent : prix au kilomètre, majoration aux heures de pointe, réductions selon l'âge ou la carte, aller-retour. Le programme pose les questions au voyageur, applique les règles dans l'ordre et affiche le prix avec un message.

**Données saisies, dans cet ordre** : l'âge du voyageur, la distance en km (entier), le jour du départ (`lundi`… `dimanche`), l'heure du départ (entier de 0 à 23), la carte de réduction (`aucune`, `jeune` ou `senior`) et s'il s'agit d'un aller-retour (`oui` ou `non`). Exemple : `20`, `300`, `mardi`, `8`, `jeune`, `oui`.

**Règles de la compagnie, appliquées dans cet ordre**
1. Prix de base : 0,12 € par km, avec un minimum de 8 €.
2. Heure de pointe : du lundi au vendredi, pour un départ de 7 h à 9 h ou de 17 h à 19 h (bornes comprises), le prix augmente de 20 %.
3. Réduction (une seule s'applique) :
   - moins de 4 ans : voyage **gratuit**, quelles que soient les autres règles ;
   - de 4 à 11 ans : -50 % ;
   - sinon, carte `jeune` (valable de 12 à 27 ans) : -30 % ; carte `senior` (valable à partir de 60 ans) : -25 %. Une carte non valable pour l'âge est ignorée.
4. Aller-retour : le prix est doublé, puis diminué de 10 %.

**Ce que le programme doit produire**
- `pointe` : `True` si le départ tombe en heure de pointe. La borne l'affiche pour inciter à voyager à un autre moment.
- `prix` : le prix final, arrondi au centime, affiché au voyageur.
- `message` : le texte affiché sous le prix. Il vaut `"gratuit"` pour un enfant de moins de 4 ans, `"carte refusée"` si une carte a été présentée mais n'est pas valable pour l'âge (le voyageur paie alors sans réduction), et `"ok"` sinon.

Dans l'exemple, le départ tombe en heure de pointe, la carte jeune est valable et le billet est un aller-retour. Le prix final est de 54,43 €.

<Indices>
<Indice>

Suivre l'ordre des règles avec une seule variable `prix`, modifiée étape par étape. Chaque étape correspond à un `if` séparé.

</Indice>
<Indice>

L'heure de pointe se range d'abord dans un booléen `pointe`, qui combine le jour (`jour != "samedi" and jour != "dimanche"`) et deux plages horaires reliées par `or`.

</Indice>
<Indice>

Le cas « moins de 4 ans » court-circuite tout : le traiter en premier, ou en dernier en remettant le prix à 0.

</Indice>
<Indice>

```text
(cœur du programme : la réduction)
SI age < 4 ALORS prix ← 0 ; message ← "gratuit"
SINON SI age ≤ 11 ALORS prix ← prix × 0,5
SINON SI carte = "jeune" ALORS
    SI 12 ≤ age ≤ 27 ALORS prix ← prix × 0,7 SINON message ← "carte refusée"
SINON SI carte = "senior" ALORS
    SI age ≥ 60 ALORS prix ← prix × 0,75 SINON message ← "carte refusée"
FIN SI
```

</Indice>
</Indices>

<Correction>

```python
age = int(input("Âge : "))
distance = int(input("Distance (km) : "))
jour = input("Jour : ")
heure = int(input("Heure de départ : "))
carte = input("Carte (aucune, jeune, senior) : ")
aller_retour = input("Aller-retour (oui/non) : ")

prix = distance * 0.12
if prix < 8:
    prix = 8
semaine = jour != "samedi" and jour != "dimanche"
pointe = semaine and (7 <= heure <= 9 or 17 <= heure <= 19)
if pointe:
    prix = prix * 1.2

message = "ok"
if age < 4:
    prix = 0
    message = "gratuit"
elif age <= 11:
    prix = prix * 0.5
elif carte == "jeune":
    if 12 <= age <= 27:
        prix = prix * 0.7
    else:
        message = "carte refusée"
elif carte == "senior":
    if age >= 60:
        prix = prix * 0.75
    else:
        message = "carte refusée"

if aller_retour == "oui":
    prix = prix * 2 * 0.9
prix = round(prix, 2)
print("Prix :", prix, "€ -", message)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["20", "300", "mardi", "8", "jeune", "oui"]
assert pointe is True and prix == 54.43 and message == "ok", "Exemple : 54,43 €."
cas = [
    (["35", "300", "samedi", "8", "aucune", "non"], 36, False, "ok"),
    (["35", "50", "lundi", "12", "aucune", "non"], 8, False, "ok"),
    (["35", "50", "vendredi", "19", "aucune", "oui"], 17.28, True, "ok"),
    (["3", "500", "lundi", "8", "aucune", "oui"], 0, True, "gratuit"),
    (["8", "100", "dimanche", "18", "jeune", "non"], 6, False, "ok"),
    (["30", "100", "jeudi", "10", "jeune", "non"], 12, False, "carte refusée"),
    (["65", "200", "mercredi", "17", "senior", "non"], 21.6, True, "ok"),
    (["59", "200", "mercredi", "20", "senior", "oui"], 43.2, False, "carte refusée"),
    (["12", "1000", "lundi", "6", "jeune", "non"], 84, False, "ok"),
]
for entrees, p, pt, m in cas:
    autre, _ = relancer(entrees)
    assert (autre["prix"], autre["pointe"], autre["message"]) == (p, pt, m), f"{', '.join(entrees)} : {p} €, {m}."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="snt-cond-6-2" label="6.2 [Mini-projet] - Date du lendemain" type="python">
<Enonce>
### Date du lendemain

**Contexte.** L'agenda en ligne du lycée a besoin d'un petit outil de calendrier : quand un professeur tape une date, l'agenda doit savoir si elle existe, quel jour de l'année c'est (pour les statistiques d'absences), dans quelle saison elle tombe (pour le menu de la cantine) et quelle est la date du lendemain (pour programmer un rappel). Le programme le fait sans boucle.

**Données saisies** : un jour, un mois et une année (trois entiers). Exemple : `28`, `2`, `2024`.

**Ce que le programme doit produire**
- `valide` : `True` si la date existe, c'est-à-dire si le mois va de 1 à 12 et si le jour est possible dans ce mois, en tenant compte des années bissextiles (février a 29 jours en 2024, 28 en 2026). Une date qui n'existe pas fait afficher `date invalide`, et rien d'autre n'est calculé.
- `numero` : le rang du jour dans l'année, de 1 pour le 1er janvier à 365 (ou 366) pour le 31 décembre.
- `saison` : `"hiver"` du 21 décembre au 19 mars, `"printemps"` du 20 mars au 20 juin, `"été"` du 21 juin au 21 septembre, `"automne"` du 22 septembre au 20 décembre.
- `lendemain` : la date du jour suivant, sous forme de texte `"JJ/MM/AAAA"` (sur 2, 2 et 4 chiffres), en passant au mois suivant ou à l'année suivante si besoin.
- Les résultats sont affichés.

Avec l'exemple : le 28/02/2024 est le jour 59, en hiver, et son lendemain est `"29/02/2024"`.

<Indices>
<Indice>

Commencer par le nombre de jours du mois (`jours_mois`) : il sert à la validité, puis au lendemain.

</Indice>
<Indice>

Pour le numéro du jour, ajouter au jour la longueur de tous les mois précédents. Cela peut se faire avec une suite de `if` sur le mois, ou avec l'astuce `cumul = [0, 31, 59, 90, …]` si les listes sont connues. Ne pas oublier le jour en plus après février dans une année bissextile.

</Indice>
<Indice>

Pour la saison, comparer un seul nombre `mois * 100 + jour` aux bornes : le 20 mars devient 320.

</Indice>
<Indice>

```text
(cœur du programme : le lendemain)
j ← jour + 1 ; m ← mois ; a ← annee
SI j > jours_mois ALORS
    j ← 1 ; m ← m + 1
    SI m > 12 ALORS m ← 1 ; a ← a + 1
lendemain ← j, m, a écrits sur 2, 2 et 4 chiffres, séparés par "/"
```

</Indice>
</Indices>

<Correction>

```python
jour = int(input("Jour : "))
mois = int(input("Mois : "))
annee = int(input("Année : "))

bissextile = (annee % 4 == 0 and annee % 100 != 0) or annee % 400 == 0
if mois == 2:
    jours_mois = 29 if bissextile else 28
elif mois == 4 or mois == 6 or mois == 9 or mois == 11:
    jours_mois = 30
else:
    jours_mois = 31
valide = 1 <= mois <= 12 and 1 <= jour <= jours_mois

if not valide:
    print("date invalide")
else:
    cumul = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
    numero = cumul[mois - 1] + jour
    if bissextile and mois > 2:
        numero = numero + 1

    code = mois * 100 + jour
    if code >= 1221 or code <= 319:
        saison = "hiver"
    elif code <= 620:
        saison = "printemps"
    elif code <= 921:
        saison = "été"
    else:
        saison = "automne"

    j, m, a = jour + 1, mois, annee
    if j > jours_mois:
        j = 1
        m = m + 1
        if m > 12:
            m = 1
            a = a + 1
    lendemain = f"{j:02d}/{m:02d}/{a:04d}"
    print("Jour", numero, "-", saison, "- lendemain :", lendemain)
```

</Correction>
</Enonce>
<Verification>

```python
ENTREES = ["28", "2", "2024"]
assert valide is True and numero == 59 and saison == "hiver" and lendemain == "29/02/2024", "28/02/2024."
cas = [
    (["29", "2", "2024"], 60, "hiver", "01/03/2024"),
    (["31", "12", "2026"], 365, "hiver", "01/01/2027"),
    (["31", "12", "2024"], 366, "hiver", "01/01/2025"),
    (["20", "3", "2026"], 79, "printemps", "21/03/2026"),
    (["21", "6", "2026"], 172, "été", "22/06/2026"),
    (["21", "9", "2026"], 264, "été", "22/09/2026"),
    (["22", "9", "2026"], 265, "automne", "23/09/2026"),
    (["30", "4", "2026"], 120, "printemps", "01/05/2026"),
    (["1", "1", "2000"], 1, "hiver", "02/01/2000"),
]
for entrees, n, s, l in cas:
    autre, _ = relancer(entrees)
    assert (autre["numero"], autre["saison"], autre["lendemain"]) == (n, s, l), f"{'/'.join(entrees)} : jour {n}, {s}, lendemain {l}."
for entrees in [["29", "2", "2026"], ["31", "4", "2026"], ["0", "5", "2026"], ["12", "13", "2026"], ["29", "2", "1900"]]:
    autre, sortie = relancer(entrees)
    assert autre["valide"] is False and "date invalide" in sortie, f"{'/'.join(entrees)} est invalide."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
