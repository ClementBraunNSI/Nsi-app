---
title: "Logique booléenne"
description: "Les valeurs Vrai/Faux et les opérateurs logiques (ET, OU, NON)."
level: SNI
chapter: "Representation_de_base"
icon: "🔘"
---

<ExerciseTabs courseId="booleens-logique" courseTitle="Logique Booléenne">
  <ExerciseSection id="bool-1" label="1. Cours : Logique Booléenne">
    <Enonce>
## Introduction

La logique booléenne est un système mathématique qui ne manipule que deux valeurs : **VRAI** (True) ou **FAUX** (False). Elle est au cœur du fonctionnement des ordinateurs et permet de prendre des décisions dans les programmes informatiques.

## Les valeurs booléennes

En informatique, on utilise deux valeurs :
- **VRAI** (True, 1, ou Oui)
- **FAUX** (False, 0, ou Non)

### Exemples de la vie quotidienne
- "La lumière est allumée" → VRAI ou FAUX
- "Il pleut aujourd'hui" → VRAI ou FAUX
- "J'ai 15 ans" → VRAI ou FAUX

## Les opérateurs booléens

### 1. L'opérateur ET (AND)

L'opérateur **ET** renvoie VRAI seulement si **les deux** conditions sont vraies.

**Table de vérité du ET :**

| A     | B     | A ET B |
|-------|-------|--------|
| FAUX  | FAUX  | FAUX   |
| FAUX  | VRAI  | FAUX   |
| VRAI  | FAUX  | FAUX   |
| VRAI  | VRAI  | VRAI   |

**Exemple :**

- "J'ai mon téléphone ET j'ai du réseau" → Je peux appeler
- Si j'ai mon téléphone mais pas de réseau : FAUX
- Si j'ai du réseau mais pas mon téléphone : FAUX
- Si j'ai les deux : VRAI

**En Python :**
```python
a = True
b = False
resultat = a and b  # Résultat : False
```

### 2. L'opérateur OU (OR)

L'opérateur **OU** renvoie VRAI si **au moins une** des conditions est vraie.

**Table de vérité du OU :**

| A     | B     | A OU B |
|-------|-------|--------|
| FAUX  | FAUX  | FAUX   |
| FAUX  | VRAI  | VRAI   |
| VRAI  | FAUX  | VRAI   |
| VRAI  | VRAI  | VRAI   |

**Exemple :**
- "Je vais au cinéma OU je reste à la maison" → Une des deux actions sera vraie
- Si je vais au cinéma : VRAI
- Si je reste à la maison : VRAI
- Si je fais les deux ou aucun des deux, c'est selon le contexte

**En Python :**
```python
a = True
b = False
resultat = a or b  # Résultat : True
```

### 3. L'opérateur NON (NOT)

L'opérateur **NON** inverse la valeur : il transforme VRAI en FAUX et FAUX en VRAI.

**Table de vérité du NON :**

| A     | NON A |
|-------|-------|
| FAUX  | VRAI  |
| VRAI  | FAUX  |

**Exemple :**
- "Il ne pleut pas" = NON "Il pleut"
- Si "Il pleut" est VRAI, alors "Il ne pleut pas" est FAUX
- Si "Il pleut" est FAUX, alors "Il ne pleut pas" est VRAI

**En Python :**
```python
a = True
resultat = not a  # Résultat : False
```

## L'opérateur OU EXCLUSIF (XOR)

Le **OU EXCLUSIF** renvoie VRAI si **une seule** des deux conditions est vraie (mais pas les deux en même temps).

**Table de vérité du OU EXCLUSIF :**

| A     | B     | A XOR B |
|-------|-------|---------|
| FAUX  | FAUX  | FAUX    |
| FAUX  | VRAI  | VRAI    |
| VRAI  | FAUX  | VRAI    |
| VRAI  | VRAI  | FAUX    |
    </Enonce>
    <Verification>
```python
assert True
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="bool-2" label="2. Exercice Pratique">
    <Enonce>
### Exercice Pratique

Déterminez le résultat des expressions logiques suivantes et assignez-les aux variables `r1`, `r2`, `r3` et `r4`.

1. `(True and False) or True` -> `r1`
2. `not (True or False)` -> `r2`
3. `(10 > 5) and (3 < 2)` -> `r3`
4. `(5 == 5) or (2 == 3)` -> `r4`

**Exemple :**
```python
r1 = False # Si vous pensez que c'est Faux
```
    </Enonce>
    <Verification>
```python
assert 'r1' in locals(), "La variable r1 n'est pas définie"
assert r1 == True, "r1 incorrect. (Faux) OU Vrai = Vrai"

assert 'r2' in locals(), "La variable r2 n'est pas définie"
assert r2 == False, "r2 incorrect. NON (Vrai) = Faux"

assert 'r3' in locals(), "La variable r3 n'est pas définie"
assert r3 == False, "r3 incorrect. (Vrai) ET (Faux) = Faux"

assert 'r4' in locals(), "La variable r4 n'est pas définie"
assert r4 == True, "r4 incorrect. (Vrai) OU (Faux) = Vrai"
```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>
