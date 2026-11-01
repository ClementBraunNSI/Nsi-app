---
title: Modularité et Mise au Point
description: >-
  Structurer ses programmes, gérer les erreurs et valider son code
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

En Terminale, il ne suffit plus qu'un programme fonctionne sur l'exemple du cours. Il doit rester lisible plusieurs mois plus tard, résister à des entrées incorrectes et pouvoir être vérifié sans être relu en entier. Trois outils y contribuent : le découpage en modules, le traitement des erreurs et l'écriture de tests qui rejouent les cas connus.

## Découper en modules

La **modularité** consiste à répartir un programme dans plusieurs fichiers, les **modules**, chacun ayant une responsabilité précise. Le programme est alors plus facile à parcourir. Une fonction écrite une seule fois, comme celles du module `math`, peut servir dans plusieurs projets, et deux personnes peuvent travailler sur deux fichiers différents en même temps.

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

Depuis un autre fichier du même dossier, `import geometrie` charge le module. On appelle ensuite `geometrie.aire_cercle(r)` : le préfixe indique d'où vient la fonction, et évite d'écraser une fonction `aire_cercle` déjà définie dans le fichier courant.

```python
# Fichier: main.py
import geometrie

r = 5
aire = geometrie.aire_cercle(r)
print(f"L'aire est {aire}")
```

On rencontre quatre formes d'import. `import geometrie` charge tout le module, et ses fonctions s'utilisent avec le préfixe. `from geometrie import aire_cercle` ne récupère que cette fonction, qui s'appelle alors sans préfixe. `from geometrie import *` importe tous les noms dans le fichier courant : c'est pratique pour un essai, mais le code devient vite illisible, car on ne sait plus d'où vient chaque nom. Enfin, `import geometrie as geo` donne un nom plus court au module, ce qui est utile quand son nom est long. Il vaut mieux garder le préfixe dès que deux modules risquent de contenir le même nom.

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

## Les différents types d'erreurs

Un **bug** est un écart entre ce que fait le programme et ce que l'on voulait. Il peut prendre plusieurs formes.

Une **erreur de syntaxe** ne respecte pas la grammaire du langage, comme un `:` oublié après un `if`. Dans ce cas, Python n'exécute rien, et il faut corriger l'erreur avant tout test.

Une **exception** survient pendant l'exécution, sur un code pourtant syntaxiquement correct. C'est le cas quand on divise par zéro, quand on lit un indice hors de la liste ou quand on additionne un texte et un entier. Le programme s'arrête sur la ligne impossible, sauf si on a prévu de rattraper l'erreur.

Une **erreur de logique** n'arrête pas le programme : la formule est fausse, mais le résultat semble plausible. C'est l'erreur la plus difficile à repérer, car seuls des exemples dont on connaît la réponse permettent de la détecter.

`try` / `except` permet de rattraper une exception. Le bloc `try` tente l'opération. Si l'exception indiquée se produit, le bloc `except` correspondant s'exécute, puis le programme continue. Une exception qui n'est pas prévue n'est pas rattrapée et arrête le programme.

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

`ZeroDivisionError` et `TypeError` sont traitées séparément. Un `except:` sans nom d'exception rattraperait toutes les erreurs, y compris une faute de frappe dans le code, et il deviendrait très difficile de comprendre pourquoi le calcul ne se fait plus. Il ne faut donc rattraper que les erreurs que l'on sait traiter, et laisser les autres s'afficher.

## Les assertions

`assert` vérifie une condition au moment de l'exécution. Si elle est fausse, Python lève une `AssertionError` et s'arrête, en affichant le message fourni. On l'utilise pendant le développement pour vérifier les **préconditions**, c'est-à-dire ce que la fonction attend de ses arguments. Une assertion ne sert pas à dialoguer avec l'utilisateur : une saisie incorrecte se traite avec `if` et `except`. Quand une assertion échoue, cela signifie que le programme est arrivé dans un état que le développeur jugeait impossible.

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

La précondition porte sur la liste entière : elle n'est pas vide, sinon la division finale n'a pas de sens. L'assertion dans la boucle contrôle chaque note. L'**invariant** de cette boucle est une autre notion : après chaque tour, `somme` vaut la somme des notes déjà parcourues. On ne l'écrit pas toujours sous forme d'`assert`, mais il faut l'avoir en tête en relisant la boucle, car c'est lui qui garantit que le `return` est correct.

<ExerciseTabs courseId="prog_mod_assert" courseTitle="Assertions">
  <ExerciseSection id="mod-assert-1" label="Pratique" type="python">
    <Enonce>
      Écrire une fonction `racine_carree(x)` qui utilise `math.sqrt`.
      Ajouter une assertion pour vérifier que `x` est positif ou nul.

    <Correction>
    ```python
    import math

    def racine_carree(x):
        assert x >= 0, "x doit être positif ou nul"
        return math.sqrt(x)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert racine_carree(9) == 3, "racine_carree(9) doit renvoyer 3."
    assert racine_carree(0) == 0, "racine_carree(0) doit renvoyer 0."
    assert abs(racine_carree(2) - 1.41421356) < 1e-6, "racine_carree(2) doit renvoyer environ 1.414."
    refus = False
    try:
        racine_carree(-4)
    except AssertionError:
        refus = True
    assert refus, "racine_carree(-4) doit déclencher une AssertionError."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## Les tests

Une erreur de logique ne lève pas d'exception : pour la détecter, il faut comparer le résultat obtenu à une valeur calculée à la main. Un **test** est une comparaison de ce type, écrite dans le projet et relancée à chaque modification.

Un **doctest** est écrit dans la docstring. Les lignes qui commencent par `>>>` sont des appels, et la ligne suivante donne le résultat attendu. La docstring sert ainsi à la fois de documentation et de test.

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

`if __name__ == "__main__"` évite de lancer les tests quand un autre fichier importe `somme`. Quand le fichier est exécuté directement, `doctest.testmod()` rejoue les exemples. S'ils réussissent, rien ne s'affiche, et s'ils échouent, la valeur obtenue et la valeur attendue sont affichées.

Pour un projet plus gros, `unittest` range les tests dans une classe qui hérite de `unittest.TestCase`. Chaque méthode dont le nom commence par `test` correspond à un cas de test. `assertEqual` échoue si les deux arguments diffèrent.

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

Un test décrit un cas précis, avec des arguments et le résultat attendu, sans dépendre du code de la fonction. Quand on modifie `multiplication`, on relance les tests : les cas qui étaient déjà justes doivent le rester.

<ExerciseTabs courseId="prog_mod_doctest" courseTitle="Doctests">
  <ExerciseSection id="mod-doctest-1" label="Écrire un doctest" type="python">
    <CodeDepart>
    ```python
    def est_pair(n):
        """Renvoie True si n est pair."""
        return n % 2 == 0
    ```
    </CodeDepart>
    <Enonce>
      Ajouter des doctests à la fonction suivante qui vérifie si un nombre est pair.
      ```python
      def est_pair(n):
          return n % 2 == 0
      ```
      Tester avec 4 (True), 5 (False) et 0 (True).

    <Correction>
    ```python
    def est_pair(n):
        """Renvoie True si n est pair.

        >>> est_pair(4)
        True
        >>> est_pair(5)
        False
        >>> est_pair(0)
        True
        """
        return n % 2 == 0
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import doctest
    exemples = [e for test in doctest.DocTestFinder().find(est_pair, "est_pair", globs={"est_pair": est_pair}) for e in test.examples]
    appels = " ".join(e.source for e in exemples)
    assert len(exemples) >= 3, "La docstring doit contenir au moins trois exemples >>>."
    assert "est_pair(4)" in appels, "Un exemple doit tester est_pair(4)."
    assert "est_pair(5)" in appels, "Un exemple doit tester est_pair(5)."
    assert "est_pair(0)" in appels, "Un exemple doit tester est_pair(0)."
    lanceur = doctest.DocTestRunner(verbose=False)
    for test in doctest.DocTestFinder().find(est_pair, "est_pair", globs={"est_pair": est_pair}):
        lanceur.run(test, out=lambda _texte: None)
    assert lanceur.failures == 0, "Les résultats attendus écrits dans les doctests doivent être justes."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

| Concept | Description | Outil Python |
| :--- | :--- | :--- |
| **Modularité** | Découper le code en fichiers indépendants | `import`, `from ... import` |
| **Exception** | Gérer les erreurs d'exécution proprement | `try ... except` |
| **Assertion** | Vérifier les conditions en cours de développement | `assert condition, "message"` |
| **Doctest** | Tests simples intégrés à la documentation | `import doctest`, `>>>` dans docstring |
| **Test Unitaire** | Tests complets et structurés | `import unittest` |
