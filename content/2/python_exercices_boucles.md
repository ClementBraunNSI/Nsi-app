---
title: 'Exercices : Les Boucles'
description: 'for, while, range et parcours de chaînes : fiche progressive par niveau.'
icon: "refresh-cw"
chapter: Introduction à Python
badgeId: premiere_exercices_boucles
meta: 'for, while, range et parcours de chaînes'
level: premiere
prerequisites:
  - python_exercices_conditions
audience: public
---

Les exercices vont de **Introduction** à **Expert**, puis viennent les **mini-projets**, pour qui avance vite.
Chaque exercice propose des indices à ouvrir un par un : le dernier donne le pseudo-code, qui reste à traduire en Python.
Les noms de variables et de fonctions demandés servent aux tests du bouton **Vérifier** : les garder tels quels.

<ExerciseTabs courseId="les-boucles-python" courseTitle="Les Boucles">

<ExerciseSection id="1nsi-boucles-1-1" label="1.1 [Introduction] - Somme des carrés" type="python">
<Enonce>
### Somme des carrés

Écrire une fonction `somme_carres(n)` qui renvoie `1² + 2² + … + n²` (et 0 pour `n = 0`).

<Indices>
<Indice>

Un accumulateur qui part de 0 et une boucle `for i in range(1, n + 1)`.

</Indice>
<Indice>

À chaque tour, ajouter `i ** 2`.

</Indice>
<Indice>

```text
FONCTION somme_carres(n)
    total ← 0
    POUR i ALLANT DE 1 À n
        total ← total + i²
    RENVOYER total
```

</Indice>
</Indices>

<Correction>

```python
def somme_carres(n: int) -> int:
    total = 0
    for i in range(1, n + 1):
        total = total + i ** 2
    return total
```

</Correction>
</Enonce>
<Verification>

```python
assert somme_carres(3) == 14, "1 + 4 + 9 = 14."
assert somme_carres(0) == 0 and somme_carres(1) == 1, "Pour 0 et 1."
assert somme_carres(10) == 385, "Jusqu'à 10 : 385."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-1-2" label="1.2 [Introduction] - Rire en boucle" type="python">
<Enonce>
### Rire en boucle

Écrire une fonction `repeter(mot, n, separateur)` qui renvoie `mot` répété `n` fois, avec `separateur` **entre** les répétitions (pas à la fin).

Exemple : `repeter("ha", 3, "-")` renvoie `"ha-ha-ha"`. Pour `n = 0`, le résultat est `""`.

Contrainte : avec une boucle, sans `join` ni `*`.

<Indices>
<Indice>

Le séparateur s'ajoute avant chaque mot, sauf avant le premier.

</Indice>
<Indice>

Une autre façon : ajouter `mot + separateur` à chaque tour, puis retirer le dernier séparateur à la fin.

</Indice>
<Indice>

```text
FONCTION repeter(mot, n, separateur)
    resultat ← ""
    POUR i ALLANT DE 0 À n - 1
        SI i > 0 ALORS resultat ← resultat + separateur
        resultat ← resultat + mot
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def repeter(mot: str, n: int, separateur: str) -> str:
    resultat = ""
    for i in range(n):
        if i > 0:
            resultat = resultat + separateur
        resultat = resultat + mot
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert repeter("ha", 3, "-") == "ha-ha-ha", "ha ×3 avec - : ha-ha-ha."
assert repeter("ou", 1, "!") == "ou" and repeter("x", 0, ",") == "", "Une fois, puis zéro fois."
assert repeter("bip", 4, " ") == "bip bip bip bip", "Avec une espace."
assert "join" not in PROGRAMME and "*" not in PROGRAMME, "Sans join ni *."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-1-3" label="1.3 [Introduction] - Compter une lettre" type="python">
<Enonce>
### Compter une lettre

Écrire une fonction `compter(texte, lettre)` qui renvoie le nombre d'apparitions de `lettre` dans `texte`.

Contrainte : sans la méthode `count`.

<Indices>
<Indice>

Parcourir `texte` caractère par caractère avec `for c in texte:`.

</Indice>
<Indice>

Un compteur augmente de 1 quand `c == lettre`.

</Indice>
<Indice>

```text
FONCTION compter(texte, lettre)
    n ← 0
    POUR CHAQUE c DE texte
        SI c = lettre ALORS n ← n + 1
    RENVOYER n
```

</Indice>
</Indices>

<Correction>

```python
def compter(texte: str, lettre: str) -> int:
    n = 0
    for c in texte:
        if c == lettre:
            n = n + 1
    return n
```

</Correction>
</Enonce>
<Verification>

```python
assert compter("abracadabra", "a") == 5, "5 a dans abracadabra."
assert compter("renard", "z") == 0 and compter("", "a") == 0, "Absente ou texte vide : 0."
assert compter("Aa", "a") == 1, "La majuscule est une autre lettre."
assert "count" not in PROGRAMME, "Sans count."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-1-4" label="1.4 [Introduction] - Multiples de 3 ou de 5" type="python">
<Enonce>
### Multiples de 3 ou de 5

Écrire une fonction `somme_multiples(n)` qui renvoie la somme de tous les entiers **strictement inférieurs** à `n` qui sont multiples de 3 ou de 5.

Exemple : sous 10, ce sont 3, 5, 6 et 9, de somme 23.

<Indices>
<Indice>

Parcourir tous les entiers de 1 à `n - 1` : `range(1, n)` s'arrête déjà avant `n`.

</Indice>
<Indice>

Un nombre multiple de 3 **et** de 5 (comme 15) ne doit être compté qu'une fois : un seul test avec `or`.

</Indice>
<Indice>

```text
FONCTION somme_multiples(n)
    total ← 0
    POUR i ALLANT DE 1 À n - 1
        SI i multiple de 3 OU i multiple de 5 ALORS total ← total + i
    RENVOYER total
```

</Indice>
</Indices>

<Correction>

```python
def somme_multiples(n: int) -> int:
    total = 0
    for i in range(1, n):
        if i % 3 == 0 or i % 5 == 0:
            total = total + i
    return total
```

</Correction>
</Enonce>
<Verification>

```python
assert somme_multiples(10) == 23, "Sous 10 : 23."
assert somme_multiples(16) == 60, "Sous 16 : 60 (15 compté une seule fois)."
assert somme_multiples(1000) == 233168, "Sous 1000 : 233168."
assert somme_multiples(3) == 0, "Sous 3 : 0."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-2-1" label="2.1 [Facile] - Puissance" type="python">
<Enonce>
### Puissance

Écrire une fonction `puissance(x, n)` qui renvoie `x` à la puissance `n` (`n` entier positif ou nul).

Contrainte : sans `**` ni `pow`.

<Indices>
<Indice>

`x` puissance `n`, c'est `x` multiplié `n` fois par lui-même.

</Indice>
<Indice>

Le résultat part de 1, l'élément neutre de la multiplication : ainsi `x⁰` vaut bien 1.

</Indice>
<Indice>

```text
FONCTION puissance(x, n)
    resultat ← 1
    RÉPÉTER n FOIS
        resultat ← resultat × x
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def puissance(x: float, n: int) -> float:
    resultat = 1
    for _ in range(n):
        resultat = resultat * x
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert puissance(2, 10) == 1024 and puissance(5, 3) == 125, "2¹⁰ et 5³."
assert puissance(7, 0) == 1 and puissance(0, 0) == 1, "Puissance 0 : 1."
assert puissance(-2, 3) == -8 and puissance(1.5, 2) == 2.25, "Négatif et décimal."
assert "**" not in PROGRAMME and "pow" not in PROGRAMME, "Sans ** ni pow."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-2-2" label="2.2 [Facile] - Compter les majuscules" type="python">
<Enonce>
### Compter les majuscules

Écrire une fonction `nb_majuscules(texte)` qui renvoie le nombre de lettres majuscules de `A` à `Z` (sans accent) dans `texte`.

Contrainte : sans `isupper`.

<Indices>
<Indice>

Les caractères se comparent comme des mots du dictionnaire : `"A" <= c <= "Z"` teste si `c` est une majuscule.

</Indice>
<Indice>

Même structure qu'un compteur de lettres, seule la condition change.

</Indice>
<Indice>

```text
FONCTION nb_majuscules(texte)
    n ← 0
    POUR CHAQUE c DE texte
        SI "A" ≤ c ≤ "Z" ALORS n ← n + 1
    RENVOYER n
```

</Indice>
</Indices>

<Correction>

```python
def nb_majuscules(texte: str) -> int:
    n = 0
    for c in texte:
        if "A" <= c <= "Z":
            n = n + 1
    return n
```

</Correction>
</Enonce>
<Verification>

```python
assert nb_majuscules("La Tanière Du Code") == 4, "4 majuscules."
assert nb_majuscules("nsi") == 0 and nb_majuscules("") == 0, "Aucune."
assert nb_majuscules("NSI 2026 !") == 3, "Chiffres et ponctuation ne comptent pas."
assert "isupper" not in PROGRAMME, "Sans isupper."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-2-3" label="2.3 [Facile] - Première position" type="python">
<Enonce>
### Première position

Écrire une fonction `position(texte, c)` qui renvoie l'indice de la **première** apparition du caractère `c` dans `texte`, ou `-1` s'il n'y apparaît pas.

Contrainte : sans `find` ni `index`.

<Indices>
<Indice>

Pour connaître la position, parcourir les indices : `for i in range(len(texte)):` puis regarder `texte[i]`.

</Indice>
<Indice>

Dès que le caractère est trouvé, `return i` arrête la fonction. Si la boucle se termine sans le trouver, renvoyer `-1` après la boucle.

</Indice>
<Indice>

```text
FONCTION position(texte, c)
    POUR i ALLANT DE 0 À longueur(texte) - 1
        SI texte[i] = c ALORS RENVOYER i
    RENVOYER -1
```

</Indice>
</Indices>

<Correction>

```python
def position(texte: str, c: str) -> int:
    for i in range(len(texte)):
        if texte[i] == c:
            return i
    return -1
```

</Correction>
</Enonce>
<Verification>

```python
assert position("renard", "n") == 2, "n est à l'indice 2 de renard."
assert position("banane", "a") == 1, "La première apparition compte."
assert position("renard", "z") == -1 and position("", "a") == -1, "Absent : -1."
assert position("abc", "a") == 0 and position("abc", "c") == 2, "Au début et à la fin."
assert "find" not in PROGRAMME and "index" not in PROGRAMME, "Sans find ni index."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-2-4" label="2.4 [Facile] - Sans espaces" type="python">
<Enonce>
### Sans espaces

Écrire une fonction `sans_espaces(texte)` qui renvoie le texte privé de toutes ses espaces.

Contrainte : sans `replace`, `split` ni `join`.

<Indices>
<Indice>

Construire un nouveau texte en ne recopiant que les caractères à garder.

</Indice>
<Indice>

`if c != " ":` sélectionne les caractères à recopier.

</Indice>
<Indice>

```text
FONCTION sans_espaces(texte)
    resultat ← ""
    POUR CHAQUE c DE texte
        SI c ≠ " " ALORS resultat ← resultat + c
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def sans_espaces(texte: str) -> str:
    resultat = ""
    for c in texte:
        if c != " ":
            resultat = resultat + c
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert sans_espaces("le renard roux") == "lerenardroux", "Les espaces disparaissent."
assert sans_espaces("   ") == "" and sans_espaces("nsi") == "nsi", "Que des espaces, ou aucune."
assert sans_espaces(" a b ") == "ab", "Au début et à la fin aussi."
assert "replace" not in PROGRAMME and "split" not in PROGRAMME and "join" not in PROGRAMME, "Sans replace, split ni join."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-3-1" label="3.1 [Moyen] - Racine entière" type="python">
<Enonce>
### Racine entière

Écrire une fonction `racine_entiere(n)` qui renvoie le plus grand entier `k` tel que `k × k <= n` (`n` entier positif ou nul).

Exemples : `racine_entiere(17)` renvoie `4`, `racine_entiere(16)` renvoie `4`.

Contrainte : sans `**`, `sqrt` ni `math`.

<Indices>
<Indice>

On ne sait pas d'avance combien de tours faire : une boucle `while`.

</Indice>
<Indice>

Augmenter `k` tant que le carré **suivant**, `(k + 1) × (k + 1)`, reste inférieur ou égal à `n`.

</Indice>
<Indice>

```text
FONCTION racine_entiere(n)
    k ← 0
    TANT QUE (k + 1) × (k + 1) ≤ n
        k ← k + 1
    RENVOYER k
```

</Indice>
</Indices>

<Correction>

```python
def racine_entiere(n: int) -> int:
    k = 0
    while (k + 1) * (k + 1) <= n:
        k = k + 1
    return k
```

</Correction>
</Enonce>
<Verification>

```python
assert racine_entiere(17) == 4 and racine_entiere(16) == 4 and racine_entiere(15) == 3, "Autour de 16."
assert racine_entiere(0) == 0 and racine_entiere(1) == 1 and racine_entiere(3) == 1, "Petites valeurs."
assert racine_entiere(1000000) == 1000, "Un million : 1000."
assert "**" not in PROGRAMME and "sqrt" not in PROGRAMME and "math" not in PROGRAMME, "Sans **, sqrt ni math."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-3-2" label="3.2 [Moyen] - Palindrome" type="python">
<Enonce>
### Palindrome

Un palindrome se lit de la même façon dans les deux sens (`"kayak"`, `"ressasser"`).

Écrire une fonction `est_palindrome(mot)` qui renvoie `True` si `mot` en est un.

Contrainte : comparer les lettres avec leurs indices, sans `[::-1]` ni `reversed`.

<Indices>
<Indice>

La première lettre doit être égale à la dernière, la deuxième à l'avant-dernière, etc. L'indice symétrique de `i` est `len(mot) - 1 - i`.

</Indice>
<Indice>

Il suffit d'aller jusqu'au milieu, et de renvoyer `False` dès qu'une paire diffère.

</Indice>
<Indice>

```text
FONCTION est_palindrome(mot)
    n ← longueur(mot)
    POUR i ALLANT DE 0 À n // 2 - 1
        SI mot[i] ≠ mot[n - 1 - i] ALORS RENVOYER FAUX
    RENVOYER VRAI
```

</Indice>
</Indices>

<Correction>

```python
def est_palindrome(mot: str) -> bool:
    n = len(mot)
    for i in range(n // 2):
        if mot[i] != mot[n - 1 - i]:
            return False
    return True
```

</Correction>
</Enonce>
<Verification>

```python
for m in ["kayak", "ressasser", "a", "", "abba"]:
    assert est_palindrome(m) is True, f"« {m} » est un palindrome."
for m in ["renard", "ab", "abca"]:
    assert est_palindrome(m) is False, f"« {m} » n'en est pas un."
assert "[::-1]" not in PROGRAMME and "reversed" not in PROGRAMME, "Sans [::-1] ni reversed."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-3-3" label="3.3 [Moyen] - Somme des chiffres" type="python">
<Enonce>
### Somme des chiffres

Écrire une fonction `somme_chiffres(n)` qui renvoie la somme des chiffres de l'entier positif `n`.

Exemple : `somme_chiffres(2026)` renvoie `10`.

Contrainte : par le calcul, sans convertir `n` en texte.

<Indices>
<Indice>

`n % 10` donne le dernier chiffre, `n // 10` le retire.

</Indice>
<Indice>

Répéter tant qu'il reste des chiffres, c'est-à-dire tant que `n > 0`.

</Indice>
<Indice>

```text
FONCTION somme_chiffres(n)
    total ← 0
    TANT QUE n > 0
        total ← total + reste de n par 10
        n ← quotient de n par 10
    RENVOYER total
```

</Indice>
</Indices>

<Correction>

```python
def somme_chiffres(n: int) -> int:
    total = 0
    while n > 0:
        total = total + n % 10
        n = n // 10
    return total
```

</Correction>
</Enonce>
<Verification>

```python
assert somme_chiffres(2026) == 10, "2 + 0 + 2 + 6 = 10."
assert somme_chiffres(0) == 0 and somme_chiffres(7) == 7, "0 et 7."
assert somme_chiffres(999999) == 54, "999999 : 54."
assert "str(" not in PROGRAMME, "Sans conversion en texte."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-3-4" label="3.4 [Moyen] - Casse alternée" type="python">
<Enonce>
### Casse alternée

Écrire une fonction `alterner(texte)` qui renvoie le texte avec les caractères d'indice pair en majuscules et ceux d'indice impair en minuscules.

Exemple : `alterner("renard")` renvoie `"ReNaRd"`.

<Indices>
<Indice>

La position compte : parcourir les indices avec `range(len(texte))`.

</Indice>
<Indice>

`i % 2 == 0` repère les indices pairs.

</Indice>
<Indice>

```text
FONCTION alterner(texte)
    resultat ← ""
    POUR i ALLANT DE 0 À longueur(texte) - 1
        SI i pair ALORS resultat ← resultat + majuscule(texte[i])
        SINON resultat ← resultat + minuscule(texte[i])
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def alterner(texte: str) -> str:
    resultat = ""
    for i in range(len(texte)):
        if i % 2 == 0:
            resultat = resultat + texte[i].upper()
        else:
            resultat = resultat + texte[i].lower()
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert alterner("renard") == "ReNaRd", "renard : ReNaRd."
assert alterner("PYTHON") == "PyThOn", "PYTHON : PyThOn."
assert alterner("") == "" and alterner("a b") == "A B", "Texte vide, puis avec une espace."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-4-1" label="4.1 [Difficile] - Compression" type="python">
<Enonce>
### Compression

Écrire une fonction `compresser(texte)` qui remplace chaque suite de caractères identiques par le caractère suivi du nombre de répétitions.

Exemple : `compresser("aaabccdddd")` renvoie `"a3b1c2d4"`. Un texte vide donne `""`.

<Indices>
<Indice>

Garder le caractère courant et un compteur. Quand le caractère change, écrire la paire et repartir avec le nouveau caractère.

</Indice>
<Indice>

La dernière suite n'est suivie d'aucun changement : l'écrire après la boucle.

</Indice>
<Indice>

Le texte vide est un cas à part, à traiter au début.

</Indice>
<Indice>

```text
FONCTION compresser(texte)
    SI texte vide ALORS RENVOYER ""
    resultat ← "" ; courant ← texte[0] ; n ← 0
    POUR CHAQUE c DE texte
        SI c = courant ALORS n ← n + 1
        SINON
            resultat ← resultat + courant + texte(n)
            courant ← c ; n ← 1
    RENVOYER resultat + courant + texte(n)
```

</Indice>
</Indices>

<Correction>

```python
def compresser(texte: str) -> str:
    if texte == "":
        return ""
    resultat = ""
    courant = texte[0]
    n = 0
    for c in texte:
        if c == courant:
            n = n + 1
        else:
            resultat = resultat + courant + str(n)
            courant = c
            n = 1
    return resultat + courant + str(n)
```

</Correction>
</Enonce>
<Verification>

```python
assert compresser("aaabccdddd") == "a3b1c2d4", "aaabccdddd : a3b1c2d4."
assert compresser("") == "" and compresser("z") == "z1", "Vide, puis un seul caractère."
assert compresser("abab") == "a1b1a1b1", "Pas de suite : que des 1."
assert compresser("xxxxxxxxxxxx") == "x12", "Douze x."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-4-2" label="4.2 [Difficile] - Nombres amicaux" type="python">
<Enonce>
### Nombres amicaux

Deux nombres sont **amicaux** si chacun est égal à la somme des diviseurs de l'autre (diviseurs autres que le nombre lui-même). Exemple : 220 et 284.

Écrire deux fonctions :
- `somme_diviseurs(n)` : la somme des diviseurs de `n` autres que `n` ;
- `sont_amicaux(a, b)` : `True` si `a` et `b` sont amicaux et différents.

<Indices>
<Indice>

Pour `somme_diviseurs`, tester tous les entiers de 1 à `n // 2`.

</Indice>
<Indice>

`sont_amicaux` appelle deux fois `somme_diviseurs`, une fois pour chaque nombre.

</Indice>
<Indice>

```text
FONCTION somme_diviseurs(n)
    total ← 0
    POUR d ALLANT DE 1 À n // 2
        SI d divise n ALORS total ← total + d
    RENVOYER total
FONCTION sont_amicaux(a, b)
    RENVOYER a ≠ b ET somme_diviseurs(a) = b ET somme_diviseurs(b) = a
```

</Indice>
</Indices>

<Correction>

```python
def somme_diviseurs(n: int) -> int:
    total = 0
    for d in range(1, n // 2 + 1):
        if n % d == 0:
            total = total + d
    return total


def sont_amicaux(a: int, b: int) -> bool:
    return a != b and somme_diviseurs(a) == b and somme_diviseurs(b) == a
```

</Correction>
</Enonce>
<Verification>

```python
assert somme_diviseurs(220) == 284 and somme_diviseurs(284) == 220, "220 et 284."
assert somme_diviseurs(1) == 0 and somme_diviseurs(12) == 16, "1 et 12."
assert sont_amicaux(220, 284) is True and sont_amicaux(1184, 1210) is True, "Deux paires amicales."
assert sont_amicaux(6, 6) is False and sont_amicaux(10, 20) is False, "6 avec lui-même, ou 10 et 20 : non."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-4-3" label="4.3 [Difficile] - Code de César" type="python">
<Enonce>
### Code de César

Le code de César décale chaque lettre de l'alphabet : avec un décalage de 3, `a` devient `d` et `z` devient `c`.

Écrire une fonction `cesar(texte, decalage)` qui chiffre un texte en minuscules. Les caractères qui ne sont pas des lettres de `a` à `z` restent inchangés. Le décalage peut être négatif (pour déchiffrer).

<Indices>
<Indice>

`ord(c) - ord("a")` donne le rang de la lettre (0 pour `a`, 25 pour `z`). `chr` fait le chemin inverse.

</Indice>
<Indice>

Après `z`, on revient à `a` : le rang décalé se ramène entre 0 et 25 avec `% 26` (qui marche aussi avec un nombre négatif en Python).

</Indice>
<Indice>

```text
FONCTION cesar(texte, decalage)
    resultat ← ""
    POUR CHAQUE c DE texte
        SI "a" ≤ c ≤ "z" ALORS
            rang ← reste de (ord(c) - ord("a") + decalage) par 26
            resultat ← resultat + chr(ord("a") + rang)
        SINON resultat ← resultat + c
    RENVOYER resultat
```

</Indice>
</Indices>

<Correction>

```python
def cesar(texte: str, decalage: int) -> str:
    resultat = ""
    for c in texte:
        if "a" <= c <= "z":
            rang = (ord(c) - ord("a") + decalage) % 26
            resultat = resultat + chr(ord("a") + rang)
        else:
            resultat = resultat + c
    return resultat
```

</Correction>
</Enonce>
<Verification>

```python
assert cesar("abc", 3) == "def" and cesar("xyz", 3) == "abc", "Décalage de 3."
assert cesar("le renard !", 1) == "mf sfobse !", "Les espaces et la ponctuation restent."
assert cesar(cesar("tanière du code", 7), -7) == "tanière du code", "Chiffrer puis déchiffrer redonne le texte (è reste è)."
assert cesar("nsi", 26) == "nsi" and cesar("a", -1) == "z", "Décalage de 26, puis négatif."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-4-4" label="4.4 [Difficile] - Damier" type="python">
<Enonce>
### Damier

Écrire une fonction `damier(n)` qui renvoie un damier de `n` lignes et `n` colonnes, sous forme d'un seul texte : `#` et `.` alternent, la case en haut à gauche est `#`, et les lignes sont séparées par `"\n"` (pas de retour à la ligne final).

Pour `n = 3` : `"#.#\n.#.\n#.#"`.

<Indices>
<Indice>

Deux boucles imbriquées : une pour les lignes `l`, une pour les colonnes `c`.

</Indice>
<Indice>

La case est `#` quand `l + c` est pair.

</Indice>
<Indice>

Ajouter `"\n"` à la fin de chaque ligne sauf la dernière.

</Indice>
<Indice>

```text
FONCTION damier(n)
    texte ← ""
    POUR l ALLANT DE 0 À n - 1
        POUR c ALLANT DE 0 À n - 1
            SI l + c pair ALORS texte ← texte + "#" SINON texte ← texte + "."
        SI l < n - 1 ALORS texte ← texte + retour à la ligne
    RENVOYER texte
```

</Indice>
</Indices>

<Correction>

```python
def damier(n: int) -> str:
    texte = ""
    for l in range(n):
        for c in range(n):
            if (l + c) % 2 == 0:
                texte = texte + "#"
            else:
                texte = texte + "."
        if l < n - 1:
            texte = texte + "\n"
    return texte
```

</Correction>
</Enonce>
<Verification>

```python
assert damier(3) == "#.#\n.#.\n#.#", "Damier 3 × 3."
assert damier(1) == "#" and damier(0) == "", "1 × 1 puis 0."
assert damier(4).split("\n") == ["#.#.", ".#.#", "#.#.", ".#.#"], "Damier 4 × 4."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-5-1" label="5.1 [Expert] - Premier suivant" type="python">
<Enonce>
### Premier suivant

Écrire une fonction `premier_suivant(n)` qui renvoie le plus petit nombre premier **strictement supérieur** à `n`.

Exemples : `premier_suivant(10)` renvoie `11`, `premier_suivant(13)` renvoie `17`.

<Indices>
<Indice>

Écrire d'abord une fonction `est_premier(k)`, puis tester `n + 1`, `n + 2`… jusqu'au premier qui convient.

</Indice>
<Indice>

Dans `est_premier`, inutile de chercher un diviseur au-delà de la racine : `while d * d <= k`.

</Indice>
<Indice>

```text
FONCTION est_premier(k)
    SI k < 2 ALORS RENVOYER FAUX
    d ← 2
    TANT QUE d × d ≤ k
        SI d divise k ALORS RENVOYER FAUX
        d ← d + 1
    RENVOYER VRAI
FONCTION premier_suivant(n)
    k ← n + 1
    TANT QUE NON est_premier(k) : k ← k + 1
    RENVOYER k
```

</Indice>
</Indices>

<Correction>

```python
def est_premier(k: int) -> bool:
    if k < 2:
        return False
    d = 2
    while d * d <= k:
        if k % d == 0:
            return False
        d = d + 1
    return True


def premier_suivant(n: int) -> int:
    k = n + 1
    while not est_premier(k):
        k = k + 1
    return k
```

</Correction>
</Enonce>
<Verification>

```python
assert premier_suivant(10) == 11 and premier_suivant(13) == 17, "Après 10 : 11 ; après 13 : 17."
assert premier_suivant(0) == 2 and premier_suivant(1) == 2 and premier_suivant(2) == 3, "Petites valeurs."
assert premier_suivant(1000000) == 1000003, "Après un million : 1000003."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-5-2" label="5.2 [Expert] - Algorithme de Luhn" type="python">
<Enonce>
### Algorithme de Luhn

Les numéros de carte bancaire contiennent un contrôle d'erreur, l'algorithme de Luhn :
1. en partant de la **droite**, doubler un chiffre sur deux, en commençant par le deuxième ;
2. si un chiffre doublé dépasse 9, lui retirer 9 ;
3. additionner tous les chiffres (doublés ou non) : le numéro est valide si la somme est un multiple de 10.

Écrire une fonction `luhn_valide(numero)` où `numero` est un texte de chiffres.

<Indices>
<Indice>

Parcourir le texte de droite à gauche : `range(len(numero) - 1, -1, -1)`, en comptant la position depuis la droite.

</Indice>
<Indice>

La position depuis la droite vaut `len(numero) - 1 - i` : les chiffres à doubler ont une position impaire.

</Indice>
<Indice>

```text
FONCTION luhn_valide(numero)
    total ← 0
    POUR i ALLANT DE 0 À longueur(numero) - 1
        chiffre ← entier(numero[i])
        SI (longueur(numero) - 1 - i) impair ALORS
            chiffre ← chiffre × 2
            SI chiffre > 9 ALORS chiffre ← chiffre - 9
        total ← total + chiffre
    RENVOYER total multiple de 10
```

</Indice>
</Indices>

<Correction>

```python
def luhn_valide(numero: str) -> bool:
    total = 0
    for i in range(len(numero)):
        chiffre = int(numero[i])
        if (len(numero) - 1 - i) % 2 == 1:
            chiffre = chiffre * 2
            if chiffre > 9:
                chiffre = chiffre - 9
        total = total + chiffre
    return total % 10 == 0
```

</Correction>
</Enonce>
<Verification>

```python
assert luhn_valide("79927398713") is True, "79927398713 est valide."
assert luhn_valide("4970101234567899") is False, "Un chiffre faux est détecté."
assert luhn_valide("4970101234567893") is True, "4970101234567893 est valide."
assert luhn_valide("0") is True and luhn_valide("18") is True and luhn_valide("19") is False, "Numéros courts."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-5-3" label="5.3 [Expert] - Décomposition en facteurs premiers" type="python">
<Enonce>
### Décomposition en facteurs premiers

Écrire une fonction `decomposer(n)` (`n` au moins 2) qui renvoie la décomposition de `n` en facteurs premiers sous forme de texte, les facteurs du plus petit au plus grand, séparés par ` x `.

Exemples : `decomposer(60)` renvoie `"2 x 2 x 3 x 5"`, `decomposer(13)` renvoie `"13"`.

<Indices>
<Indice>

Essayer de diviser `n` par `d = 2`, 3, 4… : tant que `d` divise `n`, noter `d` et diviser `n` par `d`. Un diviseur non premier comme 4 ne divisera plus jamais, car ses facteurs 2 auront déjà été retirés.

</Indice>
<Indice>

S'arrêter quand `n` vaut 1. Pour le séparateur, ajouter ` x ` seulement si le texte n'est pas encore vide.

</Indice>
<Indice>

```text
FONCTION decomposer(n)
    texte ← "" ; d ← 2
    TANT QUE n > 1
        TANT QUE d divise n
            SI texte ≠ "" ALORS texte ← texte + " x "
            texte ← texte + texte(d)
            n ← n // d
        d ← d + 1
    RENVOYER texte
```

</Indice>
</Indices>

<Correction>

```python
def decomposer(n: int) -> str:
    texte = ""
    d = 2
    while n > 1:
        while n % d == 0:
            if texte != "":
                texte = texte + " x "
            texte = texte + str(d)
            n = n // d
        d = d + 1
    return texte
```

</Correction>
</Enonce>
<Verification>

```python
assert decomposer(60) == "2 x 2 x 3 x 5", "60 = 2 x 2 x 3 x 5."
assert decomposer(13) == "13" and decomposer(2) == "2", "Nombres premiers."
assert decomposer(1024) == " x ".join(["2"] * 10), "1024 = 2 puissance 10."
assert decomposer(9991) == "97 x 103", "9991 = 97 x 103."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-5-4" label="5.4 [Expert] - Chiffres romains" type="python">
<Enonce>
### Chiffres romains

Écrire une fonction `romain(n)` qui renvoie l'écriture en chiffres romains de l'entier `n` (de 1 à 3999).

Le code de départ donne deux tuples alignés : `VALEURS` et `SYMBOLES` (`900` s'écrit `CM`, `4` s'écrit `IV`…). Exemple : `romain(1994)` renvoie `"MCMXCIV"`.

<Indices>
<Indice>

Méthode gloutonne : prendre la plus grande valeur qui tient dans `n`, écrire son symbole, la retirer de `n`, et recommencer.

</Indice>
<Indice>

Une boucle `for` parcourt les indices des tuples. À l'intérieur, une boucle `while` répète un symbole tant que sa valeur tient.

</Indice>
<Indice>

```text
FONCTION romain(n)
    texte ← ""
    POUR i ALLANT DE 0 À longueur(VALEURS) - 1
        TANT QUE n ≥ VALEURS[i]
            texte ← texte + SYMBOLES[i]
            n ← n - VALEURS[i]
    RENVOYER texte
```

</Indice>
</Indices>

<Correction>

```python
VALEURS = (1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1)
SYMBOLES = ("M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I")


def romain(n: int) -> str:
    texte = ""
    for i in range(len(VALEURS)):
        while n >= VALEURS[i]:
            texte = texte + SYMBOLES[i]
            n = n - VALEURS[i]
    return texte
```

</Correction>
</Enonce>
<CodeDepart>

```python
VALEURS = (1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1)
SYMBOLES = ("M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I")


def romain(n: int) -> str:
    ...
```

</CodeDepart>
<Verification>

```python
assert romain(1994) == "MCMXCIV", "1994 : MCMXCIV."
assert romain(4) == "IV" and romain(9) == "IX" and romain(14) == "XIV", "4, 9, 14."
assert romain(2026) == "MMXXVI" and romain(3999) == "MMMCMXCIX", "2026 et 3999."
assert romain(1) == "I" and romain(40) == "XL", "1 et 40."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-6-1" label="6.1 [Mini-projet] - Calendrier perpétuel" type="python">
<Enonce>
### Calendrier perpétuel

**Contexte.** La vie scolaire prépare l'agenda papier distribué aux élèves. Elle a besoin d'un **calendrier perpétuel** : un programme qui sait quel jour de la semaine tombe n'importe quelle date et qui imprime la grille d'un mois, comme en haut des pages de l'agenda. Pour la page « dates à retenir », elle veut aussi compter les vendredis 13. Le programme part d'un seul fait connu : **le 1er janvier 1900 était un lundi**. Il n'utilise ni le module `datetime` ni le module `calendar`.

**Les fonctions du calendrier**
- `bissextile(a)` et `jours_mois(m, a)` : les règles du calendrier. Reçoivent une année (et un mois) et renvoient si l'année est bissextile et le nombre de jours du mois.
- `jours_depuis_1900(j, m, a)` : le point de départ de tous les calculs. Reçoit une date à partir de 1900 et renvoie le nombre de jours écoulés depuis le 01/01/1900 (0 pour cette date).
- `jour_semaine(j, m, a)` et `nom_jour(j, m, a)` : donnent le jour de la semaine d'une date. Renvoient 0 pour lundi… 6 pour dimanche, et le nom (`"lundi"`, `"mardi"`…).
- `calendrier(m, a)` : la grille imprimée dans l'agenda. Reçoit un mois et une année. Renvoie un texte dont la première ligne est `Lu Ma Me Je Ve Sa Di`, puis une ligne par semaine. Chaque jour est écrit sur 2 caractères (aligné à droite), les cases sont séparées par une espace, les cases vides avant le 1er sont des espaces, et aucune ligne ne finit par une espace. Les lignes sont séparées par `"\n"`. Exemple : le 1er novembre 2026 est un dimanche, donc la deuxième ligne de `calendrier(11, 2026)` compte 19 espaces suivies de `1`.
- `vendredis_13(a)` : pour la page « dates à retenir ». Renvoie le nombre de vendredis 13 de l'année.
- `prochain_vendredi_13(j, m, a)` : pour annoncer le prochain. Renvoie le tuple `(jour, mois, annee)` du premier vendredi 13 **strictement après** la date donnée.

<Indices>
<Indice>

Tout repose sur `jours_depuis_1900` : additionner la longueur des années complètes depuis 1900, puis des mois complets de l'année, puis les jours. Le jour de la semaine est alors ce nombre modulo 7.

</Indice>
<Indice>

Pour le calendrier, construire chaque ligne case par case : avant le 1er, autant de cases vides que `jour_semaine(1, m, a)`. Après chaque dimanche, passer à la ligne. `.rstrip()` retire les espaces de fin d'une ligne.

</Indice>
<Indice>

Le texte `"lundi mardi mercredi jeudi vendredi samedi dimanche"` et `split()` donnent les noms des jours.

</Indice>
<Indice>

```text
(cœur du programme : le nombre de jours depuis 1900)
FONCTION jours_depuis_1900(j, m, a)
    total ← 0
    POUR annee ALLANT DE 1900 À a - 1 : total ← total + (366 si bissextile(annee) sinon 365)
    POUR mois ALLANT DE 1 À m - 1 : total ← total + jours_mois(mois, a)
    RENVOYER total + j - 1
jour_semaine(j, m, a) = reste de jours_depuis_1900(j, m, a) par 7
```

</Indice>
</Indices>

<Correction>

```python
def bissextile(a: int) -> bool:
    return (a % 4 == 0 and a % 100 != 0) or a % 400 == 0


def jours_mois(m: int, a: int) -> int:
    if m == 2:
        return 29 if bissextile(a) else 28
    if m in (4, 6, 9, 11):
        return 30
    return 31


def jours_depuis_1900(j: int, m: int, a: int) -> int:
    total = 0
    for annee in range(1900, a):
        total = total + (366 if bissextile(annee) else 365)
    for mois in range(1, m):
        total = total + jours_mois(mois, a)
    return total + j - 1


def jour_semaine(j: int, m: int, a: int) -> int:
    return jours_depuis_1900(j, m, a) % 7


def nom_jour(j: int, m: int, a: int) -> str:
    return "lundi mardi mercredi jeudi vendredi samedi dimanche".split()[jour_semaine(j, m, a)]


def calendrier(m: int, a: int) -> str:
    texte = "Lu Ma Me Je Ve Sa Di"
    ligne = ""
    case = jour_semaine(1, m, a)
    for _ in range(case):
        ligne = ligne + "   "
    for j in range(1, jours_mois(m, a) + 1):
        ligne = ligne + f"{j:2d} "
        case = case + 1
        if case == 7:
            texte = texte + "\n" + ligne.rstrip()
            ligne = ""
            case = 0
    if ligne != "":
        texte = texte + "\n" + ligne.rstrip()
    return texte


def vendredis_13(a: int) -> int:
    n = 0
    for m in range(1, 13):
        if jour_semaine(13, m, a) == 4:
            n = n + 1
    return n


def prochain_vendredi_13(j: int, m: int, a: int) -> tuple:
    if j >= 13:
        m = m + 1
        if m > 12:
            m = 1
            a = a + 1
    while jour_semaine(13, m, a) != 4:
        m = m + 1
        if m > 12:
            m = 1
            a = a + 1
    return (13, m, a)
```

</Correction>
</Enonce>
<Verification>

```python
import datetime
assert bissextile(2024) and not bissextile(1900) and bissextile(2000) and jours_mois(2, 2026) == 28, "Années bissextiles."
assert jours_depuis_1900(1, 1, 1900) == 0 and jours_depuis_1900(1, 1, 1901) == 365, "Jours depuis 1900."
for d in [datetime.date(1900, 3, 1), datetime.date(1969, 7, 21), datetime.date(2000, 2, 29), datetime.date(2026, 11, 1), datetime.date(2099, 12, 31)]:
    assert jour_semaine(d.day, d.month, d.year) == d.weekday(), f"Jour de la semaine du {d}."
assert nom_jour(1, 11, 2026) == "dimanche" and nom_jour(14, 7, 2000) == "vendredi", "Noms des jours."
cal = calendrier(11, 2026).split("\n")
assert cal[0] == "Lu Ma Me Je Ve Sa Di" and cal[1] == " " * 19 + "1", "En-tête et première semaine de novembre 2026."
assert cal[2] == " 2  3  4  5  6  7  8" and cal[-1] == "30" and len(cal) == 7, "Semaines suivantes et dernière ligne."
fev = calendrier(2, 2027).split("\n")
assert fev[1] == " 1  2  3  4  5  6  7" and fev[-1] == "22 23 24 25 26 27 28" and len(fev) == 5, "Février 2027 commence un lundi et tient sur 4 semaines."
assert all(not l.endswith(" ") for l in cal + fev), "Aucune ligne ne finit par une espace."
assert vendredis_13(2026) == 3 and vendredis_13(2027) == 1, "Vendredis 13 en 2026 et 2027."
assert prochain_vendredi_13(1, 11, 2026) == (13, 11, 2026) and prochain_vendredi_13(13, 11, 2026) == (13, 8, 2027), "Prochains vendredis 13."
assert "datetime" not in PROGRAMME and "calendar" not in PROGRAMME, "Sans datetime ni calendar."
```

</Verification>
</ExerciseSection>

<ExerciseSection id="1nsi-boucles-6-2" label="6.2 [Mini-projet] - Pendu imbattable" type="python">
<Enonce>
### Pendu imbattable

**Contexte.** Pour la journée portes ouvertes, la section NSI présente un jeu du pendu en deux modes : un joueur humain contre l'ordinateur, puis l'ordinateur qui joue seul et devine le mot caché presque à chaque fois. Le programme doit donc savoir arbitrer une partie, puis choisir intelligemment les lettres à proposer en s'appuyant sur un dictionnaire.

**Les données** : le **dictionnaire** est un texte de mots en minuscules séparés par des espaces (`"renard loup lapin blaireau"`). Un **motif** est le mot tel que le voit le joueur, les lettres non trouvées étant remplacées par `_` (`"r_n_r_"`). Les lettres déjà proposées sont rangées dans un texte, par exemple `"rnz"`.

**Les fonctions du jeu**
- `masque(mot, proposees)` : ce qu'affiche l'écran pendant la partie. Reçoit le mot caché et les lettres proposées. Renvoie le motif.
- `partie(mot, propositions, vies)` : l'arbitre d'une partie humaine. Reçoit le mot, les lettres proposées par le joueur dans l'ordre et le nombre de vies. Une lettre déjà proposée est ignorée. Une lettre absente du mot coûte une vie. La partie s'arrête dès que le mot est trouvé ou que les vies sont épuisées (les lettres restantes sont ignorées). Renvoie le tuple `(gagne, erreurs, motif_final)`.
- `compatible(mot, motif, proposees)` : sert à l'ordinateur pour savoir quels mots du dictionnaire peuvent encore être le mot caché. Renvoie `True` si `mot` a la même longueur que le motif, les mêmes lettres aux positions découvertes, et aucune lettre déjà proposée aux positions encore cachées (elle aurait été découverte).
- `meilleure_lettre(dictionnaire, motif, proposees)` : le choix de l'ordinateur. Renvoie, parmi les lettres pas encore proposées, celle qui apparaît dans le plus grand nombre de mots **compatibles** (la première dans l'alphabet en cas d'égalité) : c'est la lettre qui a le plus de chances d'être dans le mot.
- `ordinateur(mot, dictionnaire, vies)` : le mode démonstration. L'ordinateur joue seul en proposant à chaque fois la meilleure lettre. Renvoie le tuple `(gagne, propositions)` où `propositions` est le texte des lettres proposées, dans l'ordre.

<Indices>
<Indice>

`partie` et `ordinateur` partagent le même déroulement : à chaque tour de boucle, une lettre est proposée, puis les vies et le motif sont mis à jour. Écrire `masque` d'abord : un mot est trouvé quand son motif ne contient plus de `_`.

</Indice>
<Indice>

Dans `compatible`, parcourir les positions : une position découverte impose la lettre, une position cachée interdit les lettres déjà proposées.

</Indice>
<Indice>

Pour `meilleure_lettre`, compter les mots compatibles qui **contiennent** chaque lettre (un mot compte une fois, même si la lettre y apparaît plusieurs fois).

</Indice>
<Indice>

```text
(cœur du programme : le choix de l'ordinateur)
FONCTION meilleure_lettre(dictionnaire, motif, proposees)
    meilleure ← "" ; record ← -1
    POUR CHAQUE lettre DE "abcdefghijklmnopqrstuvwxyz"
        SI lettre ∉ proposees ALORS
            n ← nombre de mots du dictionnaire compatibles avec (motif, proposees) qui contiennent lettre
            SI n > record ALORS meilleure ← lettre ; record ← n
    RENVOYER meilleure
```

</Indice>
</Indices>

<Correction>

```python
ALPHABET = "abcdefghijklmnopqrstuvwxyz"


def masque(mot: str, proposees: str) -> str:
    resultat = ""
    for c in mot:
        resultat = resultat + (c if c in proposees else "_")
    return resultat


def partie(mot: str, propositions: str, vies: int) -> tuple:
    proposees = ""
    erreurs = 0
    for lettre in propositions:
        if "_" not in masque(mot, proposees) or erreurs >= vies:
            break
        if lettre in proposees:
            continue
        proposees = proposees + lettre
        if lettre not in mot:
            erreurs = erreurs + 1
    motif = masque(mot, proposees)
    return ("_" not in motif, erreurs, motif)


def compatible(mot: str, motif: str, proposees: str) -> bool:
    if len(mot) != len(motif):
        return False
    for i in range(len(mot)):
        if motif[i] == "_":
            if mot[i] in proposees:
                return False
        elif mot[i] != motif[i]:
            return False
    return True


def meilleure_lettre(dictionnaire: str, motif: str, proposees: str) -> str:
    meilleure = ""
    record = -1
    for lettre in ALPHABET:
        if lettre not in proposees:
            n = 0
            for mot in dictionnaire.split():
                if compatible(mot, motif, proposees) and lettre in mot:
                    n = n + 1
            if n > record:
                meilleure = lettre
                record = n
    return meilleure


def ordinateur(mot: str, dictionnaire: str, vies: int) -> tuple:
    proposees = ""
    erreurs = 0
    while "_" in masque(mot, proposees) and erreurs < vies:
        lettre = meilleure_lettre(dictionnaire, masque(mot, proposees), proposees)
        proposees = proposees + lettre
        if lettre not in mot:
            erreurs = erreurs + 1
    return ("_" not in masque(mot, proposees), proposees)
```

</Correction>
</Enonce>
<Verification>

```python
D = "renard loup lapin blaireau belette fouine herisson chevreuil sanglier ecureuil hibou chouette corbeau pie mesange merle grive moineau pinson faucon"
assert masque("renard", "rnz") == "r_n_r_" and masque("loup", "") == "____" and masque("pie", "pie") == "pie", "Motifs."
assert partie("loup", "aeloup", 6) == (True, 2, "loup"), "Gagné avec 2 erreurs."
assert partie("loup", "llzzyxo", 2) == (False, 2, "l___"), "Lettre répétée ignorée ; perdu après 2 erreurs."
assert partie("pie", "piexyz", 1) == (True, 0, "pie"), "Les lettres après la victoire sont ignorées."
assert compatible("renard", "r_n_r_", "rnz") and not compatible("sanglier", "r_n_r_", "rnz"), "Compatibilité et longueur."
assert not compatible("lapin", "l____", "lpz") and compatible("loup", "l__p", "lpz"), "Une lettre proposée ne peut pas rester cachée."
assert meilleure_lettre(D, "_____", "") == "i", "Sur les mots de 5 lettres, i est dans le plus de mots."
assert meilleure_lettre(D, "r_____", "r") == "a" and meilleure_lettre("ab ac", "__", "") == "a", "Choix avec un motif ; égalité alphabétique."
for mot in D.split():
    gagne, props = ordinateur(mot, D, 3)
    assert gagne and sum(1 for c in props if c not in mot) < 3, f"L'ordinateur trouve « {mot} » avec moins de 3 erreurs."
gagne, props = ordinateur("renard", D, 6)
assert props[0] in "aeinr" and masque("renard", props) == "renard", "Il commence par une lettre fréquente et trouve le mot."
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
