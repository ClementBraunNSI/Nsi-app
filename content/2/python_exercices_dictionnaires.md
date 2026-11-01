---
title: 'Exercices : Dictionnaires'
description: 'Création, accès, modification et parcours des dictionnaires : fiche progressive par niveau.'
icon: "book-open"
chapter: Dictionnaires et Tables
badgeId: premiere_exercices_dictionnaires
meta: 'Dictionnaires Python : clés, valeurs, parcours et dictionnaires imbriqués'
level: premiere
prerequisites:
  - python_exercices_listes
audience: public
groupe: dictionnaires
groupeTitre: "Dictionnaires"
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="les-dictionnaires-python" courseTitle="Les dictionnaires">

<ExerciseSection id="1nsi-dicos-1-1" label="1.1 [Introduction] - Prix d'un article" type="python">
<Enonce>
### Prix d'un article

`catalogue` est un dictionnaire qui associe à chaque article son prix, par exemple `{"pomme": 0.5, "pain": 1.2}`.

Écrire une fonction `prix_de(catalogue, article)` qui renvoie le prix de l'article, ou `None` s'il n'est pas au catalogue.

<Indices>
<Indice>

`catalogue[article]` provoque une erreur si l'article est absent : tester d'abord `article in catalogue`.

</Indice>
<Indice>

La méthode `catalogue.get(article)` renvoie déjà `None` pour une clé absente.

</Indice>
<Indice>

```text
FONCTION prix_de(catalogue, article)
    SI article est une clé de catalogue ALORS RENVOYER catalogue[article]
    RENVOYER None
```

</Indice>
</Indices>

<Correction>

```python
def prix_de(catalogue: dict, article: str):
    if article in catalogue:
        return catalogue[article]
    return None
```

</Correction>
</Enonce>
<Verification>

```python
cat = {"pomme": 0.5, "pain": 1.2}
assert prix_de(cat, "pain") == 1.2 and prix_de(cat, "pomme") == 0.5, "Articles présents."
assert prix_de(cat, "lait") is None and prix_de({}, "pain") is None, "Article absent : None."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-1-2" label="1.2 [Introduction] - Fiche d'identité" type="python">
<Enonce>
### Fiche d'identité

Écrire une fonction `fiche(nom, age, ville)` qui renvoie un dictionnaire avec les clés `"nom"`, `"age"` et `"ville"`.

Exemple : `fiche("Roux", 4, "Lyon")` renvoie `{"nom": "Roux", "age": 4, "ville": "Lyon"}`.

<Indices>
<Indice>

Un dictionnaire s'écrit entre accolades, avec des paires `clé: valeur` séparées par des virgules.

</Indice>
<Indice>

Les clés sont des textes : elles prennent des guillemets.

</Indice>
<Indice>

```text
FONCTION fiche(nom, age, ville)
    RENVOYER le dictionnaire "nom" → nom, "age" → age, "ville" → ville
```

</Indice>
</Indices>

<Correction>

```python
def fiche(nom: str, age: int, ville: str) -> dict:
    return {"nom": nom, "age": age, "ville": ville}
```

</Correction>
</Enonce>
<Verification>

```python
assert fiche("Roux", 4, "Lyon") == {"nom": "Roux", "age": 4, "ville": "Lyon"}, "Fiche de Roux."
assert fiche("Goupil", 7, "Metz")["age"] == 7, "La clé age contient l'âge."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-1-3" label="1.3 [Introduction] - Enregistrer une note" type="python">
<Enonce>
### Enregistrer une note

`notes` est un dictionnaire qui associe un élève à sa note.

Écrire une fonction `enregistrer(notes, eleve, note)` qui ajoute la note de l'élève, ou la remplace s'il en avait déjà une. Elle modifie `notes` et ne renvoie rien.

<Indices>
<Indice>

`d[cle] = valeur` ajoute la clé si elle n'existe pas, et remplace la valeur sinon.

</Indice>
<Indice>

Un dictionnaire passé à une fonction n'est pas copié : le modifier dans la fonction le modifie partout.

</Indice>
<Indice>

```text
FONCTION enregistrer(notes, eleve, note)
    notes[eleve] ← note
```

</Indice>
</Indices>

<Correction>

```python
def enregistrer(notes: dict, eleve: str, note: float) -> None:
    notes[eleve] = note
```

</Correction>
</Enonce>
<Verification>

```python
n = {"Léa": 12}
assert enregistrer(n, "Tom", 15) is None, "La fonction ne renvoie rien."
assert n == {"Léa": 12, "Tom": 15}, "Tom est ajouté."
enregistrer(n, "Léa", 18)
assert n == {"Léa": 18, "Tom": 15}, "La note de Léa est remplacée."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-1-4" label="1.4 [Introduction] - Total du stock" type="python">
<Enonce>
### Total du stock

`stock` associe chaque produit à la quantité en réserve.

Écrire une fonction `total(stock)` qui renvoie le nombre total d'objets en réserve.

Contrainte : avec une boucle.

<Indices>
<Indice>

`for produit in stock:` parcourt les clés ; `stock[produit]` donne la quantité.

</Indice>
<Indice>

`for quantite in stock.values():` parcourt directement les valeurs.

</Indice>
<Indice>

```text
FONCTION total(stock)
    t ← 0
    POUR CHAQUE quantite DES valeurs de stock : t ← t + quantite
    RENVOYER t
```

</Indice>
</Indices>

<Correction>

```python
def total(stock: dict) -> int:
    t = 0
    for quantite in stock.values():
        t = t + quantite
    return t
```

</Correction>
</Enonce>
<Verification>

```python
assert total({"vis": 120, "écrous": 80, "clous": 0}) == 200, "120 + 80 + 0."
assert total({}) == 0, "Stock vide."
import re
assert re.search(r"\b(for|while)\b", PROGRAMME), "Avec une boucle."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-2-1" label="2.1 [Facile] - Compter les lettres" type="python">
<Enonce>
### Compter les lettres

Écrire une fonction `occurrences(mot)` qui renvoie un dictionnaire associant à chaque caractère de `mot` son nombre d'apparitions.

Exemple : `occurrences("renard")` renvoie `{"r": 2, "e": 1, "n": 1, "a": 1, "d": 1}`.

<Indices>
<Indice>

Partir d'un dictionnaire vide et parcourir le mot.

</Indice>
<Indice>

Si le caractère est déjà une clé, augmenter sa valeur ; sinon, créer la clé avec la valeur 1.

</Indice>
<Indice>

```text
FONCTION occurrences(mot)
    compte ← dictionnaire vide
    POUR CHAQUE c DE mot
        SI c est une clé de compte ALORS compte[c] ← compte[c] + 1
        SINON compte[c] ← 1
    RENVOYER compte
```

</Indice>
</Indices>

<Correction>

```python
def occurrences(mot: str) -> dict:
    compte = {}
    for c in mot:
        if c in compte:
            compte[c] = compte[c] + 1
        else:
            compte[c] = 1
    return compte
```

</Correction>
</Enonce>
<Verification>

```python
assert occurrences("renard") == {"r": 2, "e": 1, "n": 1, "a": 1, "d": 1}, "renard."
assert occurrences("") == {} and occurrences("aaa") == {"a": 3}, "Vide, puis une seule lettre."
assert "Counter" not in PROGRAMME and "count(" not in PROGRAMME, "Sans Counter ni count."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-2-2" label="2.2 [Facile] - Meilleur score" type="python">
<Enonce>
### Meilleur score

`scores` associe chaque joueur à son score. Écrire une fonction `champion(scores)` qui renvoie le nom du joueur au plus haut score (le premier rencontré en cas d'égalité), ou `None` si le dictionnaire est vide.

<Indices>
<Indice>

Comme pour un maximum dans une liste, mais en gardant la **clé** du meilleur.

</Indice>
<Indice>

`for joueur, score in scores.items():` donne la clé et la valeur à chaque tour.

</Indice>
<Indice>

```text
FONCTION champion(scores)
    meilleur ← None
    POUR CHAQUE (joueur, score) DE scores
        SI meilleur = None OU score > scores[meilleur] ALORS meilleur ← joueur
    RENVOYER meilleur
```

</Indice>
</Indices>

<Correction>

```python
def champion(scores: dict):
    meilleur = None
    for joueur, score in scores.items():
        if meilleur is None or score > scores[meilleur]:
            meilleur = joueur
    return meilleur
```

</Correction>
</Enonce>
<Verification>

```python
assert champion({"Léa": 120, "Tom": 340, "Inès": 210}) == "Tom", "Tom a le meilleur score."
assert champion({"A": 5, "B": 5}) == "A", "Égalité : le premier."
assert champion({}) is None, "Aucun joueur : None."
assert champion({"Solo": -3}) == "Solo", "Un seul joueur, même avec un score négatif."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-2-3" label="2.3 [Facile] - À recommander" type="python">
<Enonce>
### À recommander

Écrire une fonction `a_commander(stock, seuil)` qui renvoie un **nouveau** dictionnaire contenant seulement les produits dont la quantité est strictement inférieure à `seuil`.

<Indices>
<Indice>

Parcourir les paires `(produit, quantite)` et recopier celles qui passent le test.

</Indice>
<Indice>

Le dictionnaire `stock` reçu ne doit pas changer.

</Indice>
<Indice>

```text
FONCTION a_commander(stock, seuil)
    resultat ← dictionnaire vide
    POUR CHAQUE (produit, quantite) DE stock
        SI quantite < seuil ALORS resultat[produit] ← quantite
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def a_commander(stock: dict, seuil: int) -> dict:
    resultat = {}
    for produit, quantite in stock.items():
        if quantite < seuil:
            resultat[produit] = quantite
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
s = {"vis": 120, "écrous": 8, "clous": 0, "colle": 10}
assert a_commander(s, 10) == {"écrous": 8, "clous": 0}, "Sous 10 : écrous et clous."
assert len(s) == 4, "Le stock d'origine n'est pas modifié."
assert a_commander(s, 0) == {}, "Seuil 0 : rien."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-2-4" label="2.4 [Facile] - Fusionner deux paniers" type="python">
<Enonce>
### Fusionner deux paniers

Un panier associe un article à une quantité. Écrire une fonction `fusionner(p1, p2)` qui renvoie un nouveau panier contenant les articles des deux, en **additionnant** les quantités des articles communs.

Exemple : `{"pomme": 3, "pain": 1}` et `{"pomme": 2, "lait": 1}` donnent `{"pomme": 5, "pain": 1, "lait": 1}`.

<Indices>
<Indice>

Commencer par une copie de `p1` : `dict(p1)`.

</Indice>
<Indice>

Puis ajouter chaque article de `p2`, en additionnant si l'article existe déjà.

</Indice>
<Indice>

```text
FONCTION fusionner(p1, p2)
    resultat ← copie de p1
    POUR CHAQUE (article, q) DE p2
        SI article ∈ resultat ALORS resultat[article] ← resultat[article] + q
        SINON resultat[article] ← q
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def fusionner(p1: dict, p2: dict) -> dict:
    resultat = dict(p1)
    for article, q in p2.items():
        if article in resultat:
            resultat[article] = resultat[article] + q
        else:
            resultat[article] = q
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
a = {"pomme": 3, "pain": 1}
b = {"pomme": 2, "lait": 1}
assert fusionner(a, b) == {"pomme": 5, "pain": 1, "lait": 1}, "Fusion de l'exemple."
assert a == {"pomme": 3, "pain": 1} and b == {"pomme": 2, "lait": 1}, "Les paniers d'origine ne changent pas."
assert fusionner({}, b) == b and fusionner(a, {}) == a, "Avec un panier vide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-3-1" label="3.1 [Moyen] - Dictionnaire inversé" type="python">
<Enonce>
### Dictionnaire inversé

Écrire une fonction `inverser(d)` qui renvoie un nouveau dictionnaire où les clés et les valeurs de `d` sont échangées. Les valeurs de `d` sont toutes différentes.

Exemple : `{"a": 1, "b": 2}` donne `{1: "a", 2: "b"}`.

<Indices>
<Indice>

Parcourir les paires `(cle, valeur)` de `d`.

</Indice>
<Indice>

Dans le nouveau dictionnaire, la valeur devient la clé : `resultat[valeur] = cle`.

</Indice>
<Indice>

```text
FONCTION inverser(d)
    resultat ← dictionnaire vide
    POUR CHAQUE (cle, valeur) DE d : resultat[valeur] ← cle
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def inverser(d: dict) -> dict:
    resultat = {}
    for cle, valeur in d.items():
        resultat[valeur] = cle
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert inverser({"a": 1, "b": 2}) == {1: "a", 2: "b"}, "Inversion de l'exemple."
code = {"A": ".-", "B": "-...", "C": "-.-."}
assert inverser(inverser(code)) == code, "Inverser deux fois redonne le dictionnaire."
assert inverser({}) == {}, "Dictionnaire vide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-3-2" label="3.2 [Moyen] - Ranger par initiale" type="python">
<Enonce>
### Ranger par initiale

Écrire une fonction `par_initiale(mots)` qui reçoit une liste de mots (non vides) et renvoie un dictionnaire associant à chaque première lettre la liste des mots qui commencent par elle, dans l'ordre d'origine.

Exemple : `["renard", "loup", "raton"]` donne `{"r": ["renard", "raton"], "l": ["loup"]}`.

<Indices>
<Indice>

Les valeurs du dictionnaire sont des listes : la première fois qu'une lettre apparaît, créer la liste vide.

</Indice>
<Indice>

Ensuite, `groupes[lettre].append(mot)` ajoute le mot à la bonne liste.

</Indice>
<Indice>

```text
FONCTION par_initiale(mots)
    groupes ← dictionnaire vide
    POUR CHAQUE mot DE mots
        lettre ← mot[0]
        SI lettre ∉ groupes ALORS groupes[lettre] ← liste vide
        ajouter mot à groupes[lettre]
    RENVOYER groupes
```

</Indice>
</Indices>

<Correction>

```python
def par_initiale(mots: list) -> dict:
    groupes = {}
    for mot in mots:
        lettre = mot[0]
        if lettre not in groupes:
            groupes[lettre] = []
        groupes[lettre].append(mot)
    return groupes
```

</Correction>
</Enonce>
<Verification>

```python
assert par_initiale(["renard", "loup", "raton"]) == {"r": ["renard", "raton"], "l": ["loup"]}, "Exemple."
assert par_initiale([]) == {}, "Aucun mot."
assert par_initiale(["a", "b", "a"]) == {"a": ["a", "a"], "b": ["b"]}, "Doublons gardés."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-3-3" label="3.3 [Moyen] - Traducteur mot à mot" type="python">
<Enonce>
### Traducteur mot à mot

Écrire une fonction `traduire(phrase, dico)` qui traduit une phrase (mots séparés par une espace) avec le dictionnaire `dico`. Un mot absent du dictionnaire est gardé tel quel.

Exemple : avec `{"le": "the", "renard": "fox"}`, `"le renard roux"` donne `"the fox roux"`.

<Indices>
<Indice>

`phrase.split(" ")` découpe la phrase en liste de mots ; `" ".join(liste)` recolle une liste de mots.

</Indice>
<Indice>

`dico.get(mot, mot)` renvoie la traduction, ou le mot lui-même s'il est absent.

</Indice>
<Indice>

```text
FONCTION traduire(phrase, dico)
    traduits ← liste vide
    POUR CHAQUE mot DE phrase découpée aux espaces
        SI mot ∈ dico ALORS ajouter dico[mot] SINON ajouter mot
    RENVOYER traduits recollés avec des espaces
```

</Indice>
</Indices>

<Correction>

```python
def traduire(phrase: str, dico: dict) -> str:
    traduits = []
    for mot in phrase.split(" "):
        traduits.append(dico.get(mot, mot))
    return " ".join(traduits)
```

</Correction>
</Enonce>
<Verification>

```python
d = {"le": "the", "renard": "fox", "dort": "sleeps"}
assert traduire("le renard roux", d) == "the fox roux", "Mot inconnu gardé."
assert traduire("le renard dort", d) == "the fox sleeps", "Tout est traduit."
assert traduire("bonjour", {}) == "bonjour", "Dictionnaire vide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-3-4" label="3.4 [Moyen] - Montant d'un panier" type="python">
<Enonce>
### Montant d'un panier

`panier` associe un article à une quantité, `prix` associe un article à son prix unitaire.

Écrire une fonction `montant(panier, prix)` qui renvoie le prix total du panier, arrondi au centime. Un article du panier absent de `prix` est ignoré.

<Indices>
<Indice>

Parcourir le panier ; pour chaque article, chercher son prix dans l'autre dictionnaire.

</Indice>
<Indice>

Ignorer un article revient à ne rien ajouter si `article not in prix`.

</Indice>
<Indice>

```text
FONCTION montant(panier, prix)
    total ← 0
    POUR CHAQUE (article, quantite) DE panier
        SI article ∈ prix ALORS total ← total + quantite × prix[article]
    RENVOYER arrondi(total, 2 chiffres)
```

</Indice>
</Indices>

<Correction>

```python
def montant(panier: dict, prix: dict) -> float:
    total = 0
    for article, quantite in panier.items():
        if article in prix:
            total = total + quantite * prix[article]
    return round(total, 2)
```

</Correction>
</Enonce>
<Verification>

```python
prix = {"pomme": 0.35, "pain": 1.2, "lait": 0.99}
assert montant({"pomme": 6, "pain": 2}, prix) == 4.5, "6 pommes et 2 pains : 4,50 €."
assert montant({"lait": 3, "caviar": 1}, prix) == 2.97, "L'article inconnu est ignoré."
assert montant({}, prix) == 0, "Panier vide."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-4-1" label="4.1 [Difficile] - Anagrammes" type="python">
<Enonce>
### Anagrammes

Deux mots sont des anagrammes s'ils utilisent exactement les mêmes lettres, autant de fois chacune (`"chien"` et `"niche"`).

Écrire une fonction `anagrammes(m1, m2)`.

Contrainte : sans trier, en comparant des dictionnaires d'occurrences.

<Indices>
<Indice>

Écrire (ou réutiliser) une fonction qui compte les lettres d'un mot dans un dictionnaire.

</Indice>
<Indice>

Deux dictionnaires se comparent avec `==` : l'ordre des clés n'a pas d'importance.

</Indice>
<Indice>

```text
FONCTION compter(mot) : dictionnaire lettre → nombre d'apparitions
FONCTION anagrammes(m1, m2)
    RENVOYER compter(m1) = compter(m2)
```

</Indice>
</Indices>

<Correction>

```python
def compter(mot: str) -> dict:
    d = {}
    for c in mot:
        d[c] = d.get(c, 0) + 1
    return d


def anagrammes(m1: str, m2: str) -> bool:
    return compter(m1) == compter(m2)
```

</Correction>
</Enonce>
<Verification>

```python
assert anagrammes("chien", "niche") is True and anagrammes("marie", "aimer") is True, "Deux paires d'anagrammes."
assert anagrammes("aab", "abb") is False, "Même lettres, pas le même nombre."
assert anagrammes("renard", "renards") is False and anagrammes("", "") is True, "Longueurs différentes ; mots vides."
assert "sort" not in PROGRAMME, "Sans tri."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-4-2" label="4.2 [Difficile] - Mot le plus fréquent" type="python">
<Enonce>
### Mot le plus fréquent

Écrire une fonction `plus_frequent(texte)` qui renvoie le mot le plus fréquent d'un texte en minuscules (mots séparés par des espaces). En cas d'égalité, renvoyer le premier dans l'ordre alphabétique.

<Indices>
<Indice>

Compter les mots dans un dictionnaire, puis chercher le maximum.

</Indice>
<Indice>

Pour l'égalité : un mot remplace le meilleur s'il est plus fréquent, **ou** aussi fréquent et plus petit alphabétiquement (`mot < meilleur`).

</Indice>
<Indice>

```text
FONCTION plus_frequent(texte)
    compte ← occurrences de chaque mot de texte.split()
    meilleur ← None
    POUR CHAQUE (mot, n) DE compte
        SI meilleur = None OU n > compte[meilleur] OU (n = compte[meilleur] ET mot < meilleur) ALORS meilleur ← mot
    RENVOYER meilleur
```

</Indice>
</Indices>

<Correction>

```python
def plus_frequent(texte: str) -> str:
    compte = {}
    for mot in texte.split():
        compte[mot] = compte.get(mot, 0) + 1
    meilleur = None
    for mot, n in compte.items():
        if meilleur is None or n > compte[meilleur] or (n == compte[meilleur] and mot < meilleur):
            meilleur = mot
    return meilleur
```

</Correction>
</Enonce>
<Verification>

```python
assert plus_frequent("le renard et le loup et le chat") == "le", "le apparaît 3 fois."
assert plus_frequent("b a b a c") == "a", "Égalité entre a et b : a."
assert plus_frequent("seul") == "seul", "Un seul mot."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-4-3" label="4.3 [Difficile] - Inverser sans perdre" type="python">
<Enonce>
### Inverser sans perdre

Quand plusieurs clés ont la même valeur, une inversion simple en perd. Écrire une fonction `regrouper(d)` qui renvoie un dictionnaire associant à chaque valeur de `d` la **liste triée** des clés qui l'ont.

Exemple : `{"Léa": "A", "Tom": "B", "Inès": "A"}` donne `{"A": ["Inès", "Léa"], "B": ["Tom"]}`.

<Indices>
<Indice>

Même structure que le rangement par initiale : chaque valeur de `d` devient une clé dont la valeur est une liste.

</Indice>
<Indice>

Trier chaque liste à la fin, avec `.sort()`.

</Indice>
<Indice>

```text
FONCTION regrouper(d)
    resultat ← dictionnaire vide
    POUR CHAQUE (cle, valeur) DE d
        SI valeur ∉ resultat ALORS resultat[valeur] ← liste vide
        ajouter cle à resultat[valeur]
    trier chaque liste de resultat
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def regrouper(d: dict) -> dict:
    resultat = {}
    for cle, valeur in d.items():
        if valeur not in resultat:
            resultat[valeur] = []
        resultat[valeur].append(cle)
    for liste in resultat.values():
        liste.sort()
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert regrouper({"Léa": "A", "Tom": "B", "Inès": "A"}) == {"A": ["Inès", "Léa"], "B": ["Tom"]}, "Exemple."
assert regrouper({}) == {} and regrouper({1: 1}) == {1: [1]}, "Cas simples."
assert regrouper({"x": 0, "y": 0, "z": 0}) == {0: ["x", "y", "z"]}, "Toutes les clés ensemble."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-4-4" label="4.4 [Difficile] - Moyenne par classe" type="python">
<Enonce>
### Moyenne par classe

`eleves` est une liste de dictionnaires, chacun avec les clés `"nom"`, `"classe"` et `"note"`.

Écrire une fonction `moyennes_par_classe(eleves)` qui renvoie un dictionnaire associant à chaque classe la moyenne de ses élèves, arrondie au centième.

<Indices>
<Indice>

Deux dictionnaires de travail : un pour la somme des notes de chaque classe, un pour le nombre d'élèves.

</Indice>
<Indice>

Les moyennes se calculent seulement à la fin, quand toutes les notes ont été parcourues.

</Indice>
<Indice>

```text
FONCTION moyennes_par_classe(eleves)
    sommes ← dictionnaire vide ; effectifs ← dictionnaire vide
    POUR CHAQUE e DE eleves
        c ← e["classe"]
        sommes[c] ← sommes[c] (ou 0) + e["note"]
        effectifs[c] ← effectifs[c] (ou 0) + 1
    RENVOYER classe → arrondi(sommes[classe] / effectifs[classe], 2 chiffres)
```

</Indice>
</Indices>

<Correction>

```python
def moyennes_par_classe(eleves: list) -> dict:
    sommes = {}
    effectifs = {}
    for e in eleves:
        c = e["classe"]
        sommes[c] = sommes.get(c, 0) + e["note"]
        effectifs[c] = effectifs.get(c, 0) + 1
    resultat = {}
    for c in sommes:
        resultat[c] = round(sommes[c] / effectifs[c], 2)
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
eleves = [{"nom": "Léa", "classe": "1A", "note": 14}, {"nom": "Tom", "classe": "1B", "note": 9},
          {"nom": "Inès", "classe": "1A", "note": 17}, {"nom": "Noé", "classe": "1A", "note": 10}]
assert moyennes_par_classe(eleves) == {"1A": 13.67, "1B": 9.0}, "1A : 13,67 ; 1B : 9."
assert moyennes_par_classe([]) == {}, "Aucun élève."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-5-1" label="5.1 [Expert] - Chiffres romains vers entier" type="python">
<Enonce>
### Chiffres romains vers entier

Écrire une fonction `entier_romain(texte)` qui convertit un nombre écrit en chiffres romains (valide, en majuscules) en entier.

Règle : on additionne la valeur des symboles (`I` 1, `V` 5, `X` 10, `L` 50, `C` 100, `D` 500, `M` 1000), sauf quand un symbole est suivi d'un symbole **plus grand** : il est alors soustrait (`IV` = 4, `CM` = 900).

<Indices>
<Indice>

Un dictionnaire associe chaque symbole à sa valeur.

</Indice>
<Indice>

Parcourir les indices : comparer la valeur du symbole `i` à celle du symbole `i + 1` (s'il existe) pour décider s'il faut ajouter ou retirer.

</Indice>
<Indice>

```text
VALEUR ← I → 1, V → 5, X → 10, L → 50, C → 100, D → 500, M → 1000
FONCTION entier_romain(texte)
    total ← 0
    POUR i ALLANT DE 0 À longueur(texte) - 1
        v ← VALEUR[texte[i]]
        SI i + 1 < longueur(texte) ET VALEUR[texte[i + 1]] > v ALORS total ← total - v
        SINON total ← total + v
    RENVOYER total
```

</Indice>
</Indices>

<Correction>

```python
VALEUR = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}


def entier_romain(texte: str) -> int:
    total = 0
    for i in range(len(texte)):
        v = VALEUR[texte[i]]
        if i + 1 < len(texte) and VALEUR[texte[i + 1]] > v:
            total = total - v
        else:
            total = total + v
    return total
```

</Correction>
</Enonce>
<Verification>

```python
assert entier_romain("MCMXCIV") == 1994 and entier_romain("MMXXVI") == 2026, "1994 et 2026."
assert entier_romain("IV") == 4 and entier_romain("IX") == 9 and entier_romain("XL") == 40, "Soustractions."
assert entier_romain("III") == 3 and entier_romain("MMMCMXCIX") == 3999, "3 et 3999."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-5-2" label="5.2 [Expert] - Les k mots les plus fréquents" type="python">
<Enonce>
### Les k mots les plus fréquents

Écrire une fonction `top(texte, k)` qui renvoie la liste des `k` mots les plus fréquents d'un texte en minuscules, du plus fréquent au moins fréquent, les mots de même fréquence étant rangés par ordre alphabétique. S'il y a moins de `k` mots différents, les renvoyer tous.

<Indices>
<Indice>

Compter d'abord les mots dans un dictionnaire.

</Indice>
<Indice>

`sorted(compte, key=lambda mot: (-compte[mot], mot))` trie les mots par fréquence décroissante (le signe moins), puis par ordre alphabétique.

</Indice>
<Indice>

Une tranche `[:k]` garde les `k` premiers.

</Indice>
<Indice>

```text
FONCTION top(texte, k)
    compte ← occurrences de chaque mot
    tries ← mots de compte triés par (fréquence décroissante, puis ordre alphabétique)
    RENVOYER les k premiers de tries
```

</Indice>
</Indices>

<Correction>

```python
def top(texte: str, k: int) -> list:
    compte = {}
    for mot in texte.split():
        compte[mot] = compte.get(mot, 0) + 1
    tries = sorted(compte, key=lambda mot: (-compte[mot], mot))
    return tries[:k]
```

</Correction>
</Enonce>
<Verification>

```python
t = "le chat et le chien et le renard dort"
assert top(t, 2) == ["le", "et"], "le (3), puis et (2)."
assert top(t, 4) == ["le", "et", "chat", "chien"], "Égalité à 1 : ordre alphabétique."
assert top("a b", 10) == ["a", "b"] and top("", 3) == [], "Moins de k mots."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-5-3" label="5.3 [Expert] - Index d'un moteur de recherche" type="python">
<Enonce>
### Index d'un moteur de recherche

Un moteur de recherche prépare un **index inversé** : pour chaque mot, la liste des documents qui le contiennent.

`documents` associe un nom de document à son texte (en minuscules, mots séparés par des espaces). Écrire :
- `indexer(documents)` : renvoie un dictionnaire mot → liste **triée** et sans doublon des noms de documents qui contiennent ce mot ;
- `rechercher(index, requete)` : renvoie la liste triée des documents qui contiennent **tous** les mots de la requête.

<Indices>
<Indice>

Dans `indexer`, deux boucles : sur les documents, puis sur leurs mots. N'ajouter un nom que s'il n'est pas déjà dans la liste du mot.

</Indice>
<Indice>

Dans `rechercher`, partir des documents du premier mot, puis ne garder, mot après mot, que ceux qui apparaissent aussi dans la liste du mot suivant.

</Indice>
<Indice>

```text
FONCTION indexer(documents)
    index ← dictionnaire vide
    POUR CHAQUE (nom, texte) DE documents
        POUR CHAQUE mot DE texte.split()
            ajouter nom à index[mot] s'il n'y est pas
    trier chaque liste ; RENVOYER index
FONCTION rechercher(index, requete)
    mots ← requete.split()
    resultat ← index[mots[0]] (ou liste vide)
    POUR CHAQUE autre mot : garder dans resultat les documents présents dans index[mot]
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def indexer(documents: dict) -> dict:
    index = {}
    for nom, texte in documents.items():
        for mot in texte.split():
            if mot not in index:
                index[mot] = []
            if nom not in index[mot]:
                index[mot].append(nom)
    for liste in index.values():
        liste.sort()
    return index


def rechercher(index: dict, requete: str) -> list:
    mots = requete.split()
    if not mots:
        return []
    resultat = list(index.get(mots[0], []))
    for mot in mots[1:]:
        resultat = [doc for doc in resultat if doc in index.get(mot, [])]
    return sorted(resultat)
```

</Correction>
</Enonce>
<Verification>

```python
docs = {"b.txt": "le renard roux dort", "a.txt": "le loup et le renard", "c.txt": "le chat dort dort"}
idx = indexer(docs)
assert idx["le"] == ["a.txt", "b.txt", "c.txt"] and idx["dort"] == ["b.txt", "c.txt"], "Listes triées, sans doublon."
assert idx["loup"] == ["a.txt"], "Un seul document."
assert rechercher(idx, "renard") == ["a.txt", "b.txt"], "Un mot."
assert rechercher(idx, "renard dort") == ["b.txt"], "Deux mots : seul b.txt contient les deux."
assert rechercher(idx, "renard tigre") == [] and rechercher(idx, "tigre") == [], "Mot absent : aucun résultat."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-5-4" label="5.4 [Expert] - Élection à deux tours" type="python">
<Enonce>
### Élection à deux tours

Au premier tour d'une élection, chaque bulletin porte un nom (une liste de textes). Un candidat qui obtient **strictement plus de la moitié** des voix est élu. Sinon, les deux candidats arrivés en tête vont au second tour.

Écrire une fonction `premier_tour(bulletins)` qui renvoie :
- `("élu", nom)` si un candidat a la majorité absolue ;
- `("second tour", [nom1, nom2])` sinon, `nom1` ayant le plus de voix (en cas d'égalité de voix, l'ordre alphabétique départage).

<Indices>
<Indice>

Compter les voix dans un dictionnaire, puis classer les candidats avec `sorted` et une clé `(-voix, nom)`.

</Indice>
<Indice>

La majorité absolue se teste sur le premier du classement : `voix * 2 > len(bulletins)`.

</Indice>
<Indice>

```text
FONCTION premier_tour(bulletins)
    voix ← compte de chaque nom
    classement ← noms triés par (voix décroissantes, puis nom)
    SI 2 × voix[classement[0]] > nombre de bulletins ALORS RENVOYER ("élu", classement[0])
    RENVOYER ("second tour", les 2 premiers du classement)
```

</Indice>
</Indices>

<Correction>

```python
def premier_tour(bulletins: list) -> tuple:
    voix = {}
    for nom in bulletins:
        voix[nom] = voix.get(nom, 0) + 1
    classement = sorted(voix, key=lambda nom: (-voix[nom], nom))
    if voix[classement[0]] * 2 > len(bulletins):
        return ("élu", classement[0])
    return ("second tour", classement[:2])
```

</Correction>
</Enonce>
<Verification>

```python
assert premier_tour(["A", "B", "A", "A", "C"]) == ("élu", "A"), "A a 3 voix sur 5 : élu."
assert premier_tour(["A", "B", "A", "B"]) == ("second tour", ["A", "B"]), "2 voix sur 4 : pas de majorité absolue."
assert premier_tour(["C", "B", "C", "A", "B", "D"]) == ("second tour", ["B", "C"]), "B et C à égalité : ordre alphabétique."
assert premier_tour(["Z"]) == ("élu", "Z"), "Un seul bulletin."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-6-1" label="6.1 [Mini-projet] - Logiciel de médiathèque" type="python">
<Enonce>
### Logiciel de médiathèque

Réaliser le logiciel de prêt d'une médiathèque. Toutes les données tiennent dans un dictionnaire `bib` :
- `bib["livres"]` associe un ISBN à un dictionnaire `{"titre": …, "auteur": …, "exemplaires": …, "disponibles": …}` ;
- `bib["adherents"]` associe un nom à un dictionnaire `{"emprunts": …, "amende": …}`, où `emprunts` associe l'ISBN de chaque livre emprunté au jour de l'emprunt (un entier) ;
- `bib["historique"]` est la liste des ISBN de tous les prêts effectués, dans l'ordre.

**Objectifs**
- `creer()` : une médiathèque vide.
- `ajouter_livre(bib, isbn, titre, auteur, n)` : ajoute `n` exemplaires (à un livre existant, ou à un nouveau livre).
- `inscrire(bib, nom)` : inscrit un adhérent (sans effet s'il l'est déjà).
- `emprunter(bib, nom, isbn, jour)` : renvoie `"ok"` si le prêt a lieu, sinon le motif du refus, testé dans cet ordre : `"inconnu"` (adhérent ou livre inconnu), `"amende"` (une amende reste à payer), `"limite"` (déjà 3 livres en cours), `"deja"` (ce livre est déjà emprunté par l'adhérent), `"indisponible"` (aucun exemplaire libre).
- `rendre(bib, nom, isbn, jour)` : rend le livre et renvoie l'amende ajoutée : 0,20 € par jour au-delà de 21 jours de prêt (arrondie au centime).
- `payer(bib, nom)` : remet l'amende à 0 et renvoie la somme payée.
- `disponibles(bib)` : la liste triée des titres dont au moins un exemplaire est libre.
- `top(bib, k)` : les `k` titres les plus empruntés (nombre décroissant, puis ordre alphabétique).

<Indices>
<Indice>

Écrire `creer`, `ajouter_livre` et `inscrire` d'abord, et les tester en affichant `bib` : toutes les autres fonctions lisent et modifient cette structure.

</Indice>
<Indice>

Dans `emprunter`, tester les refus un par un avec des `return` : le premier motif rencontré est le bon. Ne modifier `bib` qu'une fois tous les tests passés.

</Indice>
<Indice>

Pour `top`, compter les prêts par titre dans un dictionnaire, puis trier avec `sorted(…, key=lambda t: (-compte[t], t))`.

</Indice>
<Indice>

```text
(cœur du programme : un prêt)
FONCTION emprunter(bib, nom, isbn, jour)
    SI nom ∉ adherents OU isbn ∉ livres ALORS RENVOYER "inconnu"
    a ← adherents[nom] ; l ← livres[isbn]
    SI a["amende"] > 0 ALORS RENVOYER "amende"
    SI longueur(a["emprunts"]) ≥ 3 ALORS RENVOYER "limite"
    SI isbn ∈ a["emprunts"] ALORS RENVOYER "deja"
    SI l["disponibles"] = 0 ALORS RENVOYER "indisponible"
    a["emprunts"][isbn] ← jour ; l["disponibles"] ← l["disponibles"] - 1
    ajouter isbn à historique ; RENVOYER "ok"
```

</Indice>
</Indices>

<Correction>

```python
def creer() -> dict:
    return {"livres": {}, "adherents": {}, "historique": []}


def ajouter_livre(bib: dict, isbn: str, titre: str, auteur: str, n: int) -> None:
    if isbn in bib["livres"]:
        bib["livres"][isbn]["exemplaires"] += n
        bib["livres"][isbn]["disponibles"] += n
    else:
        bib["livres"][isbn] = {"titre": titre, "auteur": auteur, "exemplaires": n, "disponibles": n}


def inscrire(bib: dict, nom: str) -> None:
    if nom not in bib["adherents"]:
        bib["adherents"][nom] = {"emprunts": {}, "amende": 0}


def emprunter(bib: dict, nom: str, isbn: str, jour: int) -> str:
    if nom not in bib["adherents"] or isbn not in bib["livres"]:
        return "inconnu"
    a = bib["adherents"][nom]
    livre = bib["livres"][isbn]
    if a["amende"] > 0:
        return "amende"
    if len(a["emprunts"]) >= 3:
        return "limite"
    if isbn in a["emprunts"]:
        return "deja"
    if livre["disponibles"] == 0:
        return "indisponible"
    a["emprunts"][isbn] = jour
    livre["disponibles"] -= 1
    bib["historique"].append(isbn)
    return "ok"


def rendre(bib: dict, nom: str, isbn: str, jour: int) -> float:
    a = bib["adherents"][nom]
    debut = a["emprunts"].pop(isbn)
    bib["livres"][isbn]["disponibles"] += 1
    amende = round(max(0, jour - debut - 21) * 0.20, 2)
    a["amende"] = round(a["amende"] + amende, 2)
    return amende


def payer(bib: dict, nom: str) -> float:
    somme = bib["adherents"][nom]["amende"]
    bib["adherents"][nom]["amende"] = 0
    return somme


def disponibles(bib: dict) -> list:
    return sorted(l["titre"] for l in bib["livres"].values() if l["disponibles"] > 0)


def top(bib: dict, k: int) -> list:
    compte = {}
    for isbn in bib["historique"]:
        titre = bib["livres"][isbn]["titre"]
        compte[titre] = compte.get(titre, 0) + 1
    return sorted(compte, key=lambda t: (-compte[t], t))[:k]
```

</Correction>
</Enonce>
<Verification>

```python
b = creer()
assert b == {"livres": {}, "adherents": {}, "historique": []}, "Médiathèque vide."
ajouter_livre(b, "111", "Dune", "Herbert", 1)
ajouter_livre(b, "222", "Ubik", "Dick", 2)
ajouter_livre(b, "333", "Candide", "Voltaire", 1)
ajouter_livre(b, "444", "Zadig", "Voltaire", 1)
ajouter_livre(b, "111", "Dune", "Herbert", 1)
assert b["livres"]["111"] == {"titre": "Dune", "auteur": "Herbert", "exemplaires": 2, "disponibles": 2}, "Exemplaires ajoutés."
for nom in ["Léa", "Tom", "Léa"]:
    inscrire(b, nom)
assert b["adherents"]["Léa"] == {"emprunts": {}, "amende": 0} and len(b["adherents"]) == 2, "Deux adhérents."
assert emprunter(b, "Zoé", "111", 1) == "inconnu" and emprunter(b, "Léa", "999", 1) == "inconnu", "Inconnus."
assert emprunter(b, "Léa", "111", 1) == "ok" and emprunter(b, "Léa", "111", 2) == "deja", "Pas deux fois le même livre."
assert emprunter(b, "Léa", "222", 1) == "ok" and emprunter(b, "Léa", "333", 1) == "ok" and emprunter(b, "Léa", "444", 1) == "limite", "Trois livres au plus."
assert emprunter(b, "Tom", "333", 2) == "indisponible" and emprunter(b, "Tom", "111", 2) == "ok", "Plus d'exemplaire libre de Candide."
assert disponibles(b) == ["Ubik", "Zadig"], "Livres disponibles."
assert rendre(b, "Léa", "111", 20) == 0 and rendre(b, "Léa", "333", 30) == 1.6, "Rendu à temps, puis 8 jours de retard."
assert emprunter(b, "Léa", "444", 31) == "amende" and payer(b, "Léa") == 1.6 and emprunter(b, "Léa", "444", 31) == "ok", "Amende à payer avant d'emprunter."
assert b["livres"]["333"]["disponibles"] == 1 and "333" not in b["adherents"]["Léa"]["emprunts"], "Le livre rendu est de nouveau libre."
emprunter(b, "Tom", "333", 32)
assert top(b, 2) == ["Candide", "Dune"] and top(b, 10) == ["Candide", "Dune", "Ubik", "Zadig"], "Livres les plus empruntés."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-dicos-6-2" label="6.2 [Mini-projet] - Réseau social" type="python">
<Enonce>
### Réseau social

Réaliser le cœur d'un réseau social. Le réseau est un dictionnaire `{"amis": …, "messages": …}` : `amis` associe chaque membre à la **liste** de ses amis (l'amitié est réciproque), `messages` est la liste des tuples `(instant, auteur, texte)` publiés.

**Objectifs**
- `creer()` : un réseau vide.
- `ajouter_amitie(r, a, b)` et `retirer_amitie(r, a, b)` : dans les deux sens, sans doublon, en créant les membres absents.
- `suggestions(r, a)` : les amis d'amis de `a` qui ne sont ni `a` ni ses amis, triés par nombre d'amis communs décroissant puis par ordre alphabétique.
- `publier(r, auteur, texte, instant)` : ajoute un message.
- `hashtags(texte)` : la liste triée, sans doublon, des mots qui commencent par `#`, en minuscules et sans la ponctuation finale (`.`, `,`, `!`, `?`) : `"Vive la #NSI ! #nsi, #Python."` donne `["#nsi", "#python"]`.
- `fil(r, membre, k)` : les `k` messages les plus récents écrits par le membre ou par ses amis, du plus récent au plus ancien, sous la forme `"auteur : texte"`.
- `tendances(r, k)` : les `k` hashtags les plus utilisés dans tous les messages (un hashtag compte une fois par message), du plus fréquent au moins fréquent puis par ordre alphabétique.
- `separation(r, a, b)` : le nombre minimal de liens d'amitié pour aller de `a` à `b` (0 si `a == b`, -1 s'il n'existe aucun chemin).

<Indices>
<Indice>

Plusieurs fonctions se ressemblent : réutiliser `hashtags` dans `tendances`, et les listes d'amis dans `fil` et `suggestions`.

</Indice>
<Indice>

Pour `separation`, avancer « par vagues » : la vague 0 contient `a`, la vague suivante contient les amis des membres de la vague, pas encore vus. Si `b` apparaît dans la vague `d`, la réponse est `d`.

</Indice>
<Indice>

`texte.split()` découpe en mots ; `mot.rstrip(".,!?")` retire la ponctuation finale.

</Indice>
<Indice>

```text
(cœur du programme : les degrés de séparation)
FONCTION separation(r, a, b)
    SI a = b ALORS RENVOYER 0
    vus ← {a} ; vague ← [a] ; d ← 0
    TANT QUE vague non vide
        d ← d + 1 ; suivante ← []
        POUR CHAQUE m DE vague
            POUR CHAQUE x DES amis de m
                SI x = b ALORS RENVOYER d
                SI x ∉ vus ALORS ajouter x à vus et à suivante
        vague ← suivante
    RENVOYER -1
```

</Indice>
</Indices>

<Correction>

```python
def creer() -> dict:
    return {"amis": {}, "messages": []}


def ajouter_amitie(r: dict, a: str, b: str) -> None:
    for x, y in ((a, b), (b, a)):
        r["amis"].setdefault(x, [])
        if y not in r["amis"][x]:
            r["amis"][x].append(y)


def retirer_amitie(r: dict, a: str, b: str) -> None:
    for x, y in ((a, b), (b, a)):
        if y in r["amis"].get(x, []):
            r["amis"][x].remove(y)


def suggestions(r: dict, a: str) -> list:
    amis = r["amis"].get(a, [])
    compte = {}
    for ami in amis:
        for x in r["amis"][ami]:
            if x != a and x not in amis:
                compte[x] = compte.get(x, 0) + 1
    return sorted(compte, key=lambda x: (-compte[x], x))


def publier(r: dict, auteur: str, texte: str, instant: int) -> None:
    r["messages"].append((instant, auteur, texte))


def hashtags(texte: str) -> list:
    return sorted({mot.rstrip(".,!?").lower() for mot in texte.split() if mot.startswith("#")})


def fil(r: dict, membre: str, k: int) -> list:
    auteurs = [membre] + r["amis"].get(membre, [])
    choisis = [m for m in r["messages"] if m[1] in auteurs]
    choisis.sort(key=lambda m: m[0], reverse=True)
    return [f"{auteur} : {texte}" for instant, auteur, texte in choisis[:k]]


def tendances(r: dict, k: int) -> list:
    compte = {}
    for instant, auteur, texte in r["messages"]:
        for h in hashtags(texte):
            compte[h] = compte.get(h, 0) + 1
    return sorted(compte, key=lambda h: (-compte[h], h))[:k]


def separation(r: dict, a: str, b: str) -> int:
    if a == b:
        return 0
    vus = {a}
    vague = [a]
    d = 0
    while vague:
        d = d + 1
        suivante = []
        for m in vague:
            for x in r["amis"].get(m, []):
                if x == b:
                    return d
                if x not in vus:
                    vus.add(x)
                    suivante.append(x)
        vague = suivante
    return -1
```

</Correction>
</Enonce>
<Verification>

```python
r = creer()
for a, b in [("Léa", "Tom"), ("Léa", "Inès"), ("Tom", "Noé"), ("Inès", "Noé"), ("Inès", "Zoé"), ("Noé", "Max"), ("Léa", "Tom")]:
    ajouter_amitie(r, a, b)
assert sorted(r["amis"]["Léa"]) == ["Inès", "Tom"] and "Léa" in r["amis"]["Tom"], "Amitiés réciproques, sans doublon."
assert suggestions(r, "Léa") == ["Noé", "Zoé"], "Noé (2 amis communs) puis Zoé."
assert separation(r, "Léa", "Max") == 3 and separation(r, "Léa", "Léa") == 0 and separation(r, "Zoé", "Tom") == 3, "Degrés de séparation."
ajouter_amitie(r, "Ugo", "Eva")
assert separation(r, "Léa", "Eva") == -1, "Pas de chemin."
retirer_amitie(r, "Léa", "Inès")
assert "Inès" not in r["amis"]["Léa"] and "Léa" not in r["amis"]["Inès"] and separation(r, "Léa", "Zoé") == 4, "Amitié retirée."
assert hashtags("Vive la #NSI ! #nsi, #Python.") == ["#nsi", "#python"] and hashtags("rien") == [], "Hashtags."
publier(r, "Tom", "Révisions #NSI #bac", 3)
publier(r, "Max", "Match ce soir #foot", 4)
publier(r, "Léa", "Projet terminé ! #nsi", 5)
publier(r, "Noé", "Qui vient ? #foot #nsi", 2)
publier(r, "Zoé", "#bac blanc demain", 6)
assert fil(r, "Léa", 5) == ["Léa : Projet terminé ! #nsi", "Tom : Révisions #NSI #bac"], "Fil de Léa (elle et son ami Tom)."
assert fil(r, "Noé", 2) == ["Max : Match ce soir #foot", "Tom : Révisions #NSI #bac"], "Les 2 plus récents du fil de Noé."
assert tendances(r, 2) == ["#nsi", "#bac"] and tendances(r, 10) == ["#nsi", "#bac", "#foot"], "Tendances."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
