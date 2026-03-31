---
title: "TP Python : Traitement d'Image"
description: "Manipuler les pixels d'une image numérique avec Python."
level: "seconde"
chapter: "Photographie Numérique"
icon: "🐍"
---

<ExerciseTabs courseId="python-photo" courseTitle="TP Python : Photographie">

  <ExerciseSection id="photo-1" label="1. Analyser un pixel">
    <Enonce>
### 1. Analyser un pixel

Un pixel couleur est représenté par un tuple de 3 valeurs `(R, V, B)` comprises entre 0 et 255.
Exemple : `pixel = (255, 0, 0)` est un pixel rouge pur.

**Mission :**
Écrire une fonction `est_rouge(pixel)` qui retourne `True` si la composante Rouge est supérieure à 200, et `False` sinon.
*Rappel : `pixel[0]` donne la composante Rouge.*
    </Enonce>
    <Verification>
```python
def est_rouge(p):
    return p[0] > 200

assert est_rouge((255, 0, 0)) == True, "Rouge pur doit être True"
assert est_rouge((100, 255, 0)) == False, "Vert ne doit pas être True"
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="photo-2" label="2. Filtre Noir et Blanc">
    <Enonce>
### 2. Filtre Noir et Blanc (Moyenne)

Pour transformer un pixel couleur en niveau de gris, une méthode simple consiste à faire la moyenne des trois composantes.
$$ Gris = \frac{R + V + B}{3} $$

**Mission :**
Écrire une fonction `niveau_gris(pixel)` qui prend un tuple `(r, v, b)` et retourne la valeur entière moyenne.
*Astuce : Utilisez `// 3` pour la division entière.*
    </Enonce>
    <Verification>
```python
def niveau_gris(p):
    return (p[0] + p[1] + p[2]) // 3

assert niveau_gris((0, 0, 0)) == 0, "Noir donne 0"
assert niveau_gris((255, 255, 255)) == 255, "Blanc donne 255"
assert 84 <= niveau_gris((100, 50, 105)) <= 86, "Moyenne incorrecte"
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="photo-3" label="3. Inverser les couleurs (Négatif)">
    <Enonce>
### 3. Inverser les couleurs (Négatif)

Le filtre "Négatif" consiste à inverser chaque composante de couleur.
$$ Nouveau = 255 - Ancien $$

**Mission :**
Écrire une fonction `negatif(pixel)` qui prend un tuple `(r, v, b)` et retourne un nouveau tuple avec les couleurs inversées.
    </Enonce>
    <Verification>
```python
def negatif(p):
    return (255 - p[0], 255 - p[1], 255 - p[2])

assert negatif((0, 0, 0)) == (255, 255, 255), "L'inverse du noir est blanc"
assert negatif((255, 0, 0)) == (0, 255, 255), "L'inverse du rouge est cyan"
```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
