---
title: Modularité et Mise au Point
description: >-
  Apprenez à structurer vos programmes, gérer les erreurs et valider votre code
  avec des tests.
level: TNSI
order: 80
chapter: Langages et Programmation
icon: "🐛"
badgeId: terminale_modularite
prerequisites: []
---

# 🧩 Modularité et Mise au Point

En Terminale NSI, il ne s'agit plus seulement d'écrire du code qui "marche", mais d'écrire du code **robuste**, **maintenable** et **vérifié**. Ce chapitre aborde les bonnes pratiques pour structurer vos programmes et chasser les bugs efficacement.

---

## 1. La Modularité

La **modularité** consiste à découper un programme complexe en plusieurs fichiers ou composants plus petits et indépendants, appelés **modules**.

### Pourquoi modulariser ?

*   **Organisation** : Le code est plus lisible et plus facile à naviguer.
*   **Réutilisabilité** : Une fonction bien écrite dans un module peut être utilisée dans plusieurs projets (ex: le module `math`).
*   **Collaboration** : Plusieurs développeurs peuvent travailler sur des modules différents sans se gêner.

### Créer et importer un module en Python

Un module Python est simplement un fichier `.py`.

**Exemple :**
Imaginons un fichier `geometrie.py` :
```python
# Fichier: geometrie.py
PI = 3.14159

def aire_cercle(rayon):
    """Calcule l'aire d'un cercle."""
    return PI * rayon * rayon

def perimetre_cercle(rayon):
    return 2 * PI * rayon
```

Pour l'utiliser dans un autre fichier `main.py` :

```python
# Fichier: main.py
import geometrie

r = 5
aire = geometrie.aire_cercle(r)
print(f"L'aire est {aire}")
```

<ExerciseTabs courseId="prog_mod_import" courseTitle="Imports">
  <ExerciseSection id="mod-import-1" label="Variantes d'import">
    <Enonce>
      Il existe plusieurs façons d'importer. Que font les commandes suivantes ?
      1. `import geometrie`
      2. `from geometrie import aire_cercle`
      3. `from geometrie import *`
      4. `import geometrie as geo`
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

---

## 2. Gestion des Bugs et Exceptions

Un **bug** est une erreur dans un programme informatique. On distingue trois types d'erreurs principales :

1.  **Erreurs de syntaxe** : Le code ne respecte pas les règles du langage (ex: oubli de `: ` après un `if`). Python arrête l'exécution immédiatement.
2.  **Erreurs d'exécution (Exceptions)** : Le code est syntaxiquement correct, mais une opération impossible est demandée pendant l'exécution (ex: division par zéro, index hors liste).
3.  **Erreurs de logique** : Le programme ne plante pas, mais le résultat est faux (ex: formule mathématique incorrecte). Ce sont les plus difficiles à détecter !

### Gérer les exceptions avec `try` / `except`

Pour éviter qu'un programme ne plante brutalement, on peut "attraper" les exceptions.

```python
def division_sur(a, b):
    try:
        resultat = a / b
        return resultat
    except ZeroDivisionError:
        print("Erreur : Division par zéro impossible !")
        return None
    except TypeError:
        print("Erreur : Les arguments doivent être des nombres.")
        return None
```

---

## 3. Programmation Défensive : `assert`

La programmation défensive consiste à anticiper les problèmes. L'instruction `assert` permet de vérifier une condition en cours d'exécution. Si la condition est fausse, le programme s'arrête avec une erreur (`AssertionError`).

C'est très utile pour vérifier les **préconditions** d'une fonction (ce que la fonction attend en entrée).

```python
def calcul_moyenne(notes):
    # Précondition : la liste ne doit pas être vide
    assert len(notes) > 0, "La liste de notes ne doit pas être vide"
    
    somme = 0
    for note in notes:
        # Invariant : chaque note doit être valide
        assert 0 <= note <= 20, f"Note invalide trouvée : {note}"
        somme += note
    return somme / len(notes)
```

<ExerciseTabs courseId="prog_mod_assert" courseTitle="Assertions">
  <ExerciseSection id="mod-assert-1" label="Pratique">
    <Enonce>
      Écrivez une fonction `racine_carree(x)` qui utilise `math.sqrt`.
      Ajoutez une assertion pour vérifier que `x` est positif ou nul.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

---

## 4. Tests Unitaires et Doctests

Pour vérifier qu'une fonction fait bien ce qu'elle est censée faire (pas d'erreur de logique), on écrit des **tests**.

### Les Doctests

C'est une spécificité géniale de Python : on écrit les tests directement dans la documentation de la fonction (docstring). Ils servent à la fois d'exemple pour l'utilisateur et de test automatique.

```python
def somme(a, b):
    """
    Calcule la somme de deux nombres.

    Exemples :
    >>> somme(2, 3)
    5
    >>> somme(-1, 1)
    0
    >>> somme(0, 0)
    0
    """
    return a + b

if __name__ == "__main__":
    import doctest
    doctest.testmod()
```

Si tout va bien, `doctest.testmod()` n'affiche rien. S'il y a une erreur, il l'affiche en détail.

### Les Tests Unitaires (`unittest`)

Pour des projets plus gros, on utilise le module `unittest`. On crée une classe qui hérite de `unittest.TestCase`.

```python
import unittest

def multiplication(a, b):
    return a * b

class TestCalculs(unittest.TestCase):
    def test_multiplication_simple(self):
        self.assertEqual(multiplication(3, 4), 12)

    def test_multiplication_zero(self):
        self.assertEqual(multiplication(10, 0), 0)

if __name__ == '__main__':
    unittest.main()
```

<ExerciseTabs courseId="prog_mod_doctest" courseTitle="Doctests">
  <ExerciseSection id="mod-doctest-1" label="Écrire un doctest">
    <Enonce>
      Ajoutez des doctests à la fonction suivante qui vérifie si un nombre est pair.
      ```python
      def est_pair(n):
          return n % 2 == 0
      ```
      Testez avec 4 (True), 5 (False) et 0 (True).
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

---

## 📝 Résumé

| Concept | Description | Outil Python |
| :--- | :--- | :--- |
| **Modularité** | Découper le code en fichiers indépendants | `import`, `from ... import` |
| **Exception** | Gérer les erreurs d'exécution proprement | `try ... except` |
| **Assertion** | Vérifier les conditions en cours de développement | `assert condition, "message"` |
| **Doctest** | Tests simples intégrés à la documentation | `import doctest`, `>>>` dans docstring |
| **Test Unitaire** | Tests complets et structurés | `import unittest` |
