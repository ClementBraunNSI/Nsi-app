---
title: 'TP Python : Photographie numérique'
description: 'Manipuler des pixels et des images avec la bibliothèque Pillow (PIL).'
level: seconde
chapter: Photographie Numérique
icon: "🐍"
prerequisites:
  - photographie_couleur
---

<ExerciseTabs courseId="tp-python-photo" courseTitle="TP Python : Photographie" packages="Pillow">

  <ExerciseSection id="photo-0" label="Important ⚠️ - Avant de commencer">
    <Enonce>
      ### Important ⚠️ - Avant de commencer

      Ce TP utilise **Pillow** (importé avec `from PIL import Image`), la bibliothèque Python de référence pour le **traitement d'image**.

      | Concept SNT | En Python (Pillow) |
      |------------|-------------------|
      | Pixel RVB | Tuple `(rouge, vert, bleu)` de 0 à 255 |
      | Image | Objet `Image` avec largeur × hauteur |
      | Noir et blanc | Mode `"L"` (niveaux de gris) |

      **Dans le Lab NSI**, Pillow est chargé automatiquement.

      **Exemple :**

      ```python
      from PIL import Image

      image = Image.new("RGB", (100, 100), color=(255, 0, 0))
      print(image.size)  # (100, 100)
      ```
    </Enonce>
    <Verification>
```python
assert True, "Consignes lues."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="photo-1" label="Introduction 🦊 - Créer une image">
    <Enonce>
      ### Introduction 🦊 - Créer une image

      **Mission :** Créez une image RGB de **1×1 pixel** entièrement **rouge** avec Pillow. Stockez l'image dans `image`, sa largeur dans `largeur` et sa hauteur dans `hauteur`.

      *Indice :* `Image.new("RGB", (largeur, hauteur), color=(r, v, b))` — le rouge pur correspond à `(255, 0, 0)`.
    </Enonce>
    <Verification>
```python
from PIL import Image

assert 'image' in locals(), "Créez une image nommée image."
assert 'largeur' in locals() and 'hauteur' in locals(), "Stockez largeur et hauteur."
assert image.size == (1, 1), "L'image doit faire 1×1 pixel."
assert largeur == 1 and hauteur == 1, "largeur et hauteur valent 1."
assert image.getpixel((0, 0)) == (255, 0, 0), "Le pixel doit être rouge pur."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="photo-2" label="Introduction 🦊 - Lire un pixel">
    <Enonce>
      ### Introduction 🦊 - Lire un pixel

      **Mission :** Créez une image RGB de **3×3 pixels** remplie de noir `(0, 0, 0)`, puis coloriez le **pixel central** en vert `(0, 255, 0)` avec `putpixel`. Stockez la couleur du pixel central dans `pixel_centre`.

      *Indice :* le centre d'une image 3×3 est à la position `(1, 1)`. Lisez avec `getpixel((x, y))`.
    </Enonce>
    <Verification>
```python
from PIL import Image

assert 'image' in locals(), "Créez l'image."
assert 'pixel_centre' in locals(), "Lisez le pixel central."
assert image.size == (3, 3), "L'image doit faire 3×3 pixels."
assert pixel_centre == (0, 255, 0), "Le pixel central doit être vert pur."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="photo-3" label="Introduction 🦊 - Définition d'une image">
    <Enonce>
      ### Introduction 🦊 - Définition d'une image

      La **définition** d'une image est le nombre total de pixels : largeur × hauteur.

      **Mission :** Créez une image RGB de **800×600 pixels** (couleur au choix). Stockez la largeur, la hauteur et la définition (nombre total de pixels) dans `largeur`, `hauteur` et `definition`.

      *Indice :* `image.size` renvoie `(largeur, hauteur)`.
    </Enonce>
    <Verification>
```python
from PIL import Image

assert 'image' in locals(), "Créez l'image."
assert 'largeur' in locals() and 'hauteur' in locals() and 'definition' in locals()
assert image.size == (800, 600), "L'image doit faire 800×600 pixels."
assert definition == largeur * hauteur, "definition = largeur × hauteur."
assert definition == 480000, "800 × 600 = 480 000 pixels."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="photo-4" label="Facile 🦊 - Passer en niveaux de gris">
    <Enonce>
      ### Facile 🦊 - Passer en niveaux de gris

      Pillow peut convertir une image couleur en **niveaux de gris** (noir et blanc) avec `.convert("L")`.

      **Mission :** Créez une image 1×1 de couleur `(100, 50, 105)`, convertissez-la en niveaux de gris dans `image_nb`, puis stockez le niveau de gris du pixel dans `gris`.

      *Indice :* `image_nb = image.convert("L")` puis `getpixel((0, 0))`.
    </Enonce>
    <Verification>
```python
from PIL import Image

source = Image.new("RGB", (1, 1), color=(100, 50, 105))
attendu = source.convert("L").getpixel((0, 0))

assert 'image_nb' in locals(), "Convertissez l'image en image_nb."
assert 'gris' in locals(), "Lisez le niveau de gris."
assert image_nb.mode == "L", "Le mode doit être L (niveaux de gris)."
assert gris == attendu, "Le niveau de gris doit correspondre à la conversion Pillow."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="photo-5" label="Facile 🦊 - Filtre négatif">
    <Enonce>
      ### Facile 🦊 - Filtre négatif

      Le filtre **négatif** inverse chaque composante : `nouveau = 255 - ancien`.

      **Mission :** À partir d'une image 1×1 de couleur `(200, 80, 0)`, calculez la couleur inversée et créez une **nouvelle image** `image_negatif` avec ce pixel. Stockez la couleur dans `pixel_inverse`.

      *Indice :* appliquez `255 - valeur` sur chaque composante RVB.
    </Enonce>
    <Verification>
```python
from PIL import Image

source_couleur = (200, 80, 0)
attendu = tuple(255 - c for c in source_couleur)

assert 'image_negatif' in locals(), "Créez image_negatif."
assert 'pixel_inverse' in locals(), "Stockez pixel_inverse."
assert pixel_inverse == attendu, "Inversez chaque composante avec 255 - valeur."
assert image_negatif.getpixel((0, 0)) == attendu, "L'image doit contenir le pixel inversé."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="photo-6" label="Facile 🦊 - Mégapixels">
    <Enonce>
      ### Facile 🦊 - Mégapixels

      Un **mégapixel** (Mpx) = 1 million de pixels.

      **Mission :** Créez une image de **4000×3000 pixels**. Calculez sa définition dans `definition` et le nombre de mégapixels (entier) dans `megapixels`.

      *Indice :* `megapixels = definition // 1_000_000`
    </Enonce>
    <Verification>
```python
from PIL import Image

assert 'image' in locals(), "Créez l'image."
assert 'definition' in locals() and 'megapixels' in locals()
assert image.size == (4000, 3000), "L'image doit faire 4000×3000."
assert definition == 12_000_000, "Calculez le nombre total de pixels."
assert megapixels == 12, "Convertissez en mégapixels."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="photo-7" label="Facile 🦊 - Bande de pixels colorés">
    <Enonce>
      ### Facile 🦊 - Bande de pixels colorés

      **Mission :** Créez une image **4×1 pixels** (bande horizontale) avec les couleurs suivantes de gauche à droite :

      1. Rouge `(255, 0, 0)`
      2. Vert `(0, 255, 0)`
      3. Bleu `(0, 0, 255)`
      4. Blanc `(255, 255, 255)`

      Stockez l'image dans `bande` et la couleur du **dernier pixel** (à droite) dans `dernier_pixel`.

      *Indice :* créez une image noire 4×1, puis `putpixel((x, 0), couleur)` pour chaque colonne.
    </Enonce>
    <Verification>
```python
from PIL import Image

assert 'bande' in locals(), "Créez l'image bande."
assert 'dernier_pixel' in locals(), "Lisez le dernier pixel."
assert bande.size == (4, 1), "La bande doit faire 4×1 pixels."
assert bande.getpixel((0, 0)) == (255, 0, 0), "Le 1er pixel est rouge."
assert bande.getpixel((1, 0)) == (0, 255, 0), "Le 2e pixel est vert."
assert bande.getpixel((2, 0)) == (0, 0, 255), "Le 3e pixel est bleu."
assert dernier_pixel == (255, 255, 255), "Le dernier pixel est blanc."
```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
