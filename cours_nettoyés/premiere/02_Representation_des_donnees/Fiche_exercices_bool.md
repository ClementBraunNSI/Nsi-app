---
title: "Exercices Booléens"
description: "Exercices sur les booléens, les opérateurs de comparaison et les opérateurs logiques en Python."
difficulty: "Débutant"
duration: "1h"
tags:
  - Booléens
  - Logique
  - Conditions
  - Python
---

# 🔄 Fiche d'exercices : Booléens et Comparaisons

Cette fiche propose une série d'exercices progressifs pour maîtriser les booléens et les opérations logiques en Python.

<ExerciseTabs>

<ExerciseSection title="1. Comprendre les booléens" difficulty="easy">
<Enonce>

Quel sera le résultat de ces expressions ? `True` ou `False`.

1. `10 > 5`
2. `7 == 9`
3. `3 <= 3`
4. `False != True`
5. `not False`
6. `5 != 5`

Complétez le code ci-dessous pour vérifier vos réponses.

</Enonce>
<Correction>

```python
# 1. 10 > 5 -> True
# 2. 7 == 9 -> False
# 3. 3 <= 3 -> True
# 4. False != True -> True
# 5. not False -> True
# 6. 5 != 5 -> False

print(f"1. {10 > 5}")
print(f"2. {7 == 9}")
print(f"3. {3 <= 3}")
print(f"4. {False != True}")
print(f"5. {not False}")
print(f"6. {5 != 5}")
```

</Correction>
<Verification>

```python
assert (10 > 5) == True
assert (7 == 9) == False
assert (3 <= 3) == True
assert (False != True) == True
assert (not False) == True
assert (5 != 5) == False
```

</Verification>
</ExerciseSection>

<ExerciseSection title="2. Comparaisons simples" difficulty="easy">
<Enonce>

Donner le résultat des expressions suivantes :

1. `8 == 8`
2. `4 != 2`
3. `7 > 10`
4. `6 >= 6`
5. `3 < 8`

</Enonce>
<Correction>

```python
# 1. 8 == 8 -> True
# 2. 4 != 2 -> True
# 3. 7 > 10 -> False
# 4. 6 >= 6 -> True
# 5. 3 < 8 -> True

print(f"1. {8 == 8}")
print(f"2. {4 != 2}")
print(f"3. {7 > 10}")
print(f"4. {6 >= 6}")
print(f"5. {3 < 8}")
```

</Correction>
<Verification>

```python
assert (8 == 8) == True
assert (4 != 2) == True
assert (7 > 10) == False
assert (6 >= 6) == True
assert (3 < 8) == True
```

</Verification>
</ExerciseSection>

<ExerciseSection title="3. Opérateurs logiques" difficulty="medium">
<Enonce>

Pour chaque expression, déterminer le résultat (`True` ou `False`) :

1. `(5 > 3) and (2 == 2)`
2. `(4 < 1) or (6 != 5)`
3. `not (10 == 10)`
4. `(7 <= 7) and (8 > 9)`
5. `not ((3 != 3) or (5 < 2))`

</Enonce>
<Correction>

```python
# 1. (5 > 3) and (2 == 2) -> True and True -> True
# 2. (4 < 1) or (6 != 5) -> False or True -> True
# 3. not (10 == 10) -> not True -> False
# 4. (7 <= 7) and (8 > 9) -> True and False -> False
# 5. not ((3 != 3) or (5 < 2)) -> not (False or False) -> not False -> True

print(f"1. {(5 > 3) and (2 == 2)}")
print(f"2. {(4 < 1) or (6 != 5)}")
print(f"3. {not (10 == 10)}")
print(f"4. {(7 <= 7) and (8 > 9)}")
print(f"5. {not ((3 != 3) or (5 < 2))}")
```

</Correction>
<Verification>

```python
assert ((5 > 3) and (2 == 2)) == True
assert ((4 < 1) or (6 != 5)) == True
assert (not (10 == 10)) == False
assert ((7 <= 7) and (8 > 9)) == False
assert (not ((3 != 3) or (5 < 2))) == True
```

</Verification>
</ExerciseSection>

<ExerciseSection title="4. Expressions complexes" difficulty="medium">
<Enonce>

Évaluer les expressions suivantes étape par étape :

1. `(3 < 5) and (not (2 == 3)) or (4 >= 4)`
2. `not ((10 > 5) and (7 != 7)) or (3 <= 3)`
3. `(True and False) or (not False and True)`
4. `((5 > 3) or (2 < 1)) and (not (4 == 4))`

</Enonce>
<Correction>

```python
# 1. True and (not False) or True -> True and True or True -> True
# 2. not (True and False) or True -> not False or True -> True
# 3. False or (True and True) -> False or True -> True
# 4. (True or False) and (not True) -> True and False -> False

print(f"1. {(3 < 5) and (not (2 == 3)) or (4 >= 4)}")
print(f"2. {not ((10 > 5) and (7 != 7)) or (3 <= 3)}")
print(f"3. {(True and False) or (not False and True)}")
print(f"4. {((5 > 3) or (2 < 1)) and (not (4 == 4))}")
```

</Correction>
<Verification>

```python
assert ((3 < 5) and (not (2 == 3)) or (4 >= 4)) == True
assert (not ((10 > 5) and (7 != 7)) or (3 <= 3)) == True
assert ((True and False) or (not False and True)) == True
assert (((5 > 3) or (2 < 1)) and (not (4 == 4))) == False
```

</Verification>
</ExerciseSection>

<ExerciseSection title="5. Fonctions booléennes" difficulty="important">
<Enonce>

Écrire les fonctions Python suivantes qui retournent un booléen :

1. `est_pair(n)` : retourne `True` si n est pair.
2. `est_dans_intervalle(x, a, b)` : retourne `True` si x est entre a et b (inclus).
3. `est_voyelle(lettre)` : retourne `True` si la lettre est une voyelle (minuscule).
4. `est_triangle_rectangle(a, b, c)` : retourne `True` si les côtés a, b, c forment un triangle rectangle (théorème de Pythagore).

</Enonce>
<Correction>

```python
def est_pair(n: int) -> bool:
    """Retourne True si n est pair."""
    return n % 2 == 0

def est_dans_intervalle(x: float, a: float, b: float) -> bool:
    """Retourne True si a <= x <= b."""
    return a <= x <= b

def est_voyelle(lettre: str) -> bool:
    """Retourne True si la lettre est une voyelle."""
    return lettre.lower() in 'aeiouy'

def est_triangle_rectangle(a: float, b: float, c: float) -> bool:
    """Retourne True si le triangle est rectangle."""
    # On teste si l'une des relations de Pythagore est vérifiée
    return (a**2 + b**2 == c**2) or (a**2 + c**2 == b**2) or (b**2 + c**2 == a**2)
```

</Correction>
<Verification>

```python
assert est_pair(4) == True
assert est_pair(5) == False
assert est_dans_intervalle(5, 1, 10) == True
assert est_dans_intervalle(0, 1, 10) == False
assert est_voyelle('a') == True
assert est_voyelle('b') == False
assert est_triangle_rectangle(3, 4, 5) == True
assert est_triangle_rectangle(3, 4, 6) == False
```

</Verification>
</ExerciseSection>

<ExerciseSection title="6. Applications pratiques" difficulty="hard">
<Enonce>

Résoudre les problèmes suivants en écrivant les fonctions correspondantes :

1. `reussite_examen(note, note_oral)` : Un étudiant réussit son examen s'il a au moins 10/20 ET qu'il n'a pas eu 0 à l'oral.
2. `divisible_par_6(n)` : Un nombre est divisible par 6 s'il est divisible par 2 ET par 3.
3. `est_bissextile(annee)` : Une année est bissextile si elle est divisible par 4, SAUF si elle est divisible par 100, SAUF si elle est divisible par 400.

</Enonce>
<Correction>

```python
def reussite_examen(note: float, note_oral: float) -> bool:
    """Retourne True si l'étudiant réussit."""
    return (note >= 10) and (note_oral != 0)

def divisible_par_6(n: int) -> bool:
    """Retourne True si n est divisible par 6."""
    return (n % 2 == 0) and (n % 3 == 0)

def est_bissextile(annee: int) -> bool:
    """Retourne True si l'année est bissextile."""
    return (annee % 4 == 0) and ((annee % 100 != 0) or (annee % 400 == 0))
```

</Correction>
<Verification>

```python
assert reussite_examen(12, 10) == True
assert reussite_examen(12, 0) == False
assert reussite_examen(8, 10) == False

assert divisible_par_6(12) == True
assert divisible_par_6(9) == False
assert divisible_par_6(10) == False

assert est_bissextile(2020) == True  # Divisible par 4
assert est_bissextile(1900) == False # Divisible par 100 mais pas 400
assert est_bissextile(2000) == True  # Divisible par 400
assert est_bissextile(2021) == False
```

</Verification>
</ExerciseSection>

</ExerciseTabs>
