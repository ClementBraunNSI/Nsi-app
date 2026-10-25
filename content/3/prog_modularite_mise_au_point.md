---
title: Modularité et Mise au Point
description: >-
  Apprenez à structurer vos programmes, gérer les erreurs et valider votre code
  avec des tests.
level: TNSI
order: 80
chapter: Langages et Programmation
icon: "bug"
badgeId: terminale_modularite
prerequisites: []
audience: public
---

# Modularité et mise au point

En Terminale, un programme qui « marche sur l'exemple du cours » ne suffit plus. Il doit rester lisible dans six mois, survivre à une entrée absurde, et pouvoir être vérifié sans le relire en entier. Trois outils portent ce travail : découper en modules, traiter les erreurs au lieu de les laisser planter, et écrire des tests qui rejouent les cas connus.

## Découper en modules

La **modularité** consiste à répartir un programme dans plusieurs fichiers, les **modules**, chacun avec une responsabilité. On s'y retrouve. Une fonction écrite une fois, comme celles du module `math`, sert dans plusieurs projets. Deux personnes peuvent modifier deux fichiers sans réécrire la même fonction en parallèle.

Un module Python est un fichier `.py`. Son nom, sans l'extension, est le nom qu'on importe.

```python
# Fichier: geometrie.py
PI = 3.14159

def aire_cercle(rayon):
    """Calcule l'aire d'un cercle."""
    return PI * rayon * rayon

def perimetre_cercle(rayon):
    return 2 * PI * rayon
```

Depuis un autre fichier du même dossier, `import geometrie` charge le module. On appelle ensuite `geometrie.aire_cercle(r)` : le préfixe dit d'où vient le nom, et évite d'écraser une fonction `aire_cercle` que le fichier courant aurait déjà.

```python
# Fichier: main.py
import geometrie

r = 5
aire = geometrie.aire_cercle(r)
print(f"L'aire est {aire}")
```

Quatre formes reviennent. `import geometrie` charge tout le module, et l'on préfixe. `from geometrie import aire_cercle` ne récupère que cette fonction, appelable sans préfixe. `from geometrie import *` verse tous les noms dans le fichier courant : pratique pour un essai, illisible ensuite, parce qu'on ne sait plus qui a défini quoi. `import geometrie as geo` donne un surnom, utile quand le nom du module est long. On choisit le préfixe dès que deux modules pourraient offrir le même nom.

<ExerciseTabs courseId="prog_mod_import" courseTitle="Imports">
  <ExerciseSection id="mod-import-1" label="Variantes d'import" type="lecture">
    <Enonce>
      Il existe plusieurs façons d'importer. Que font les commandes suivantes ?
      1. `import geometrie`
      2. `from geometrie import aire_cercle`
      3. `from geometrie import *`
      4. `import geometrie as geo`
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## Trois sortes d'erreurs

Un **bug** est un écart entre ce que le programme fait et ce qu'on voulait. Il n'arrive pas toujours de la même façon.

Une **erreur de syntaxe** viole la grammaire du langage : un `:` oublié après `if`. Python n'exécute rien. Il faut corriger avant même le premier test.

Une **exception** survient pendant l'exécution, sur un code pourtant syntaxiquement correct. C'est le cas quand on divise par zéro, quand on lit un indice hors de la liste ou quand on additionne un texte et un entier. Le programme s'arrête sur la ligne impossible, sauf si on a prévu de rattraper l'erreur.

Une **erreur de logique** ne plante pas. La formule est fausse, le résultat est plausible, et l'on peut le croire. C'est la plus difficile : seuls des exemples dont on connaît la réponse la trahissent.

`try` / `except` rattrape une exception. Le bloc `try` tente l'opération. Si l'exception nommée se produit, le bloc `except` correspondant s'exécute, et le programme continue. Une exception non prévue continue de remonter.

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

`ZeroDivisionError` et `TypeError` ne se mélangent pas. Un `except:` sans nom avalerait tout, y compris une faute de frappe dans le corps, et l'on mettrait des heures à comprendre pourquoi le calcul ne se fait plus. On attrape ce qu'on sait traiter. Le reste doit rester visible.

## Dire ce que la fonction exige

`assert` vérifie une condition au moment de l'exécution. Si elle est fausse, Python lève `AssertionError` et s'arrête, avec le message qu'on a fourni. On s'en sert pour les **préconditions** : ce que la fonction a le droit d'attendre de ses arguments, pendant qu'on développe. Ce n'est pas un dialogue avec l'utilisateur. Une saisie incorrecte se traite avec `if` et `except`. Une assertion qui échoue dit : le programme est arrivé dans un état que le développeur jugeait impossible.

```python
def calcul_moyenne(notes):
    # Précondition : la liste ne doit pas être vide
    assert len(notes) > 0, "La liste de notes ne doit pas être vide"
    
    somme = 0
    for note in notes:
        # Chaque note lue doit appartenir à l'intervalle attendu
        assert 0 <= note <= 20, f"Note invalide trouvée : {note}"
        somme += note
    return somme / len(notes)
```

La précondition porte sur la liste entière : elle n'est pas vide, sinon la division finale n'a pas de sens. L'assertion dans la boucle contrôle chaque note. L'**invariant** de cette boucle, lui, est autre chose : après chaque tour, `somme` vaut la somme des notes déjà parcourues. On ne l'écrit pas toujours en `assert`. On le garde en tête quand on relit la boucle, parce que c'est lui qui justifie le `return`.

<ExerciseTabs courseId="prog_mod_assert" courseTitle="Assertions">
  <ExerciseSection id="mod-assert-1" label="Pratique" type="python">
    <Enonce>
      Écrivez une fonction `racine_carree(x)` qui utilise `math.sqrt`.
      Ajoutez une assertion pour vérifier que `x` est positif ou nul.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## Des tests qui rejouent les exemples

Une erreur de logique ne lève pas d'exception. On l'attrape en comparant le résultat à une valeur qu'on a calculée à la main. Un **test** est ce comparaison, écrite dans le projet, rejouée à chaque modification.

Un **doctest** vit dans la docstring. Les lignes qui commencent par `>>>` sont des appels, la ligne suivante est le résultat attendu. La docstring documente et vérifie en même temps.

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

`if __name__ == "__main__"` évite de lancer les tests quand un autre fichier importe `somme`. Exécuté directement, `doctest.testmod()` rejoue les exemples. S'ils passent, il n'affiche rien. S'ils échouent, il montre la valeur obtenue et la valeur attendue.

Pour un projet plus gros, `unittest` range les tests dans une classe qui hérite de `unittest.TestCase`. Chaque méthode dont le nom commence par `test` est un cas. `assertEqual` échoue si les deux arguments diffèrent.

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

Un test raconte un cas : des arguments, un résultat. Il ne relit pas le corps de la fonction. Quand on modifie `multiplication`, on relance la classe. Les cas déjà justes doivent le rester.

<ExerciseTabs courseId="prog_mod_doctest" courseTitle="Doctests">
  <ExerciseSection id="mod-doctest-1" label="Écrire un doctest" type="python">
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

| Concept | Description | Outil Python |
| :--- | :--- | :--- |
| **Modularité** | Découper le code en fichiers indépendants | `import`, `from ... import` |
| **Exception** | Gérer les erreurs d'exécution proprement | `try ... except` |
| **Assertion** | Vérifier les conditions en cours de développement | `assert condition, "message"` |
| **Doctest** | Tests simples intégrés à la documentation | `import doctest`, `>>>` dans docstring |
| **Test Unitaire** | Tests complets et structurés | `import unittest` |
