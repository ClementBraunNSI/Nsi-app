---
title: 'Exercices : Programmation fonctionnelle'
description: 'map, filter, reduce et enchaînements — fiche progressive par niveau.'
icon: "λ"
chapter: Programmation fonctionnelle
level: particuliers
access: private
allowedStudents:
  - Anatole
---

`map` applique une fonction à chaque élément, `filter` ne garde que ceux qui vérifient un prédicat, `reduce` (module `functools`) accumule une seule valeur. `map` et `filter` renvoient un itérateur : on le convertit avec `list` pour obtenir une liste. Ces opérations construisent un nouveau résultat et ne modifient pas la liste d'origine. La fonction passée à `map`, `filter` ou `reduce` peut être une `lambda` ou une fonction nommée.

```python
from functools import reduce

list(map(lambda x: x * 2, [1, 2, 3]))
list(filter(lambda x: x > 0, [-1, 0, 4]))
reduce(lambda acc, x: acc + x, [1, 2, 3], 0)
```

<ExerciseTabs courseId="programmation-fonctionnelle" courseTitle="Programmation fonctionnelle">

  {/* ========================================== */}
  {/* CATÉGORIE 1 : INTRODUCTION (1.1 à 1.3)      */}
  {/* ========================================== */}

  <ExerciseSection id="fonct-1-1" label="1.1 [Introduction] - Doubler avec map">
    <Enonce>
    ### Exercice 1.1 [Introduction] : Doubler avec map
    **Écrire une fonction `doubler(nombres)` qui prend une liste de nombres et renvoie une nouvelle liste où chaque élément est multiplié par 2, en utilisant `map`. La liste d'origine ne doit pas être modifiée.**

    ```python
    def doubler(nombres):
        pass

    nombres = [1, 2, 3]
    doubler(nombres)
    doubler([])
    ```

    <Correction>
    ```python
    def doubler(nombres):
        return list(map(lambda x: x * 2, nombres))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'doubler' in locals(), "La fonction 'doubler' n'est pas définie."
nombres = [1, 2, 3]
assert doubler(nombres) == [2, 4, 6]
assert nombres == [1, 2, 3]
assert doubler([]) == []
assert doubler([-1, 4]) == [-2, 8]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonct-1-2" label="1.2 [Introduction] - Filtrer les positifs">
    <Enonce>
    ### Exercice 1.2 [Introduction] : Filtrer les positifs
    **Écrire une fonction `positifs(nombres)` qui prend une liste de nombres et renvoie une nouvelle liste contenant uniquement les nombres strictement positifs, en utilisant `filter`. La liste d'origine ne doit pas être modifiée.**

    ```python
    def positifs(nombres):
        pass

    nombres = [-1, 0, 3, -7, 8]
    positifs(nombres)
    positifs([])
    ```

    <Correction>
    ```python
    def positifs(nombres):
        return list(filter(lambda x: x > 0, nombres))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'positifs' in locals(), "La fonction 'positifs' n'est pas définie."
nombres = [-1, 0, 3, -7, 8]
assert positifs(nombres) == [3, 8]
assert nombres == [-1, 0, 3, -7, 8]
assert positifs([]) == []
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonct-1-3" label="1.3 [Introduction] - Somme avec reduce">
    <Enonce>
    ### Exercice 1.3 [Introduction] : Somme avec reduce
    **Écrire une fonction `somme(nombres)` qui prend une liste de nombres et renvoie leur somme, en utilisant `functools.reduce`. Une liste vide renvoie 0. La liste d'origine ne doit pas être modifiée.**

    ```python
    from functools import reduce

    def somme(nombres):
        pass

    nombres = [1, 2, 3, 4]
    somme(nombres)
    somme([])
    ```

    <Correction>
    ```python
    from functools import reduce

    def somme(nombres):
        return reduce(lambda acc, x: acc + x, nombres, 0)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'somme' in locals(), "La fonction 'somme' n'est pas définie."
nombres = [1, 2, 3, 4]
assert somme(nombres) == 10
assert nombres == [1, 2, 3, 4]
assert somme([]) == 0
assert somme([-2, 5]) == 3
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 2 : FACILE (2.1 à 2.3)            */}
  {/* ========================================== */}

  <ExerciseSection id="fonct-2-1" label="2.1 [Facile] - Longueurs des mots">
    <Enonce>
    ### Exercice 2.1 [Facile] : Longueurs des mots
    **Écrire une fonction `longueurs(mots)` qui prend une liste de chaînes et renvoie une nouvelle liste de leurs longueurs, en utilisant `map`. La liste d'origine ne doit pas être modifiée.**

    ```python
    def longueurs(mots):
        pass

    mots = ["chat", "chien", "os"]
    longueurs(mots)
    longueurs([])
    ```

    <Correction>
    ```python
    def longueurs(mots):
        return list(map(len, mots))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'longueurs' in locals(), "La fonction 'longueurs' n'est pas définie."
mots = ["chat", "chien", "os"]
assert longueurs(mots) == [4, 5, 2]
assert mots == ["chat", "chien", "os"]
assert longueurs([]) == []
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonct-2-2" label="2.2 [Facile] - Nombres pairs">
    <Enonce>
    ### Exercice 2.2 [Facile] : Nombres pairs
    **Écrire une fonction `pairs(nombres)` qui prend une liste d'entiers et renvoie une nouvelle liste des entiers pairs, en utilisant `filter`. 0 est pair, et un entier négatif pair est conservé. La liste d'origine ne doit pas être modifiée.**

    ```python
    def pairs(nombres):
        pass

    nombres = [1, 2, 3, 4, 5]
    pairs(nombres)
    pairs([-4, -3, 0])
    pairs([])
    ```

    <Correction>
    ```python
    def pairs(nombres):
        return list(filter(lambda n: n % 2 == 0, nombres))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'pairs' in locals(), "La fonction 'pairs' n'est pas définie."
nombres = [1, 2, 3, 4, 5]
assert pairs(nombres) == [2, 4]
assert nombres == [1, 2, 3, 4, 5]
assert pairs([-4, -3, 0]) == [-4, 0]
assert pairs([]) == []
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonct-2-3" label="2.3 [Facile] - Produit des nombres">
    <Enonce>
    ### Exercice 2.3 [Facile] : Produit des nombres
    **Écrire une fonction `produit(nombres)` qui prend une liste de nombres et renvoie leur produit, en utilisant `functools.reduce`. Une liste vide renvoie 1. La liste d'origine ne doit pas être modifiée.**

    ```python
    from functools import reduce

    def produit(nombres):
        pass

    nombres = [2, 3, 4]
    produit(nombres)
    produit([])
    ```

    <Correction>
    ```python
    from functools import reduce

    def produit(nombres):
        return reduce(lambda acc, x: acc * x, nombres, 1)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'produit' in locals(), "La fonction 'produit' n'est pas définie."
nombres = [2, 3, 4]
assert produit(nombres) == 24
assert nombres == [2, 3, 4]
assert produit([]) == 1
assert produit([-2, 5]) == -10
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 3 : MOYEN (3.1 à 3.3)             */}
  {/* ========================================== */}

  <ExerciseSection id="fonct-3-1" label="3.1 [Moyen] - Doubles des pairs">
    <Enonce>
    ### Exercice 3.1 [Moyen] : Doubles des pairs
    **Écrire une fonction `doubles_des_pairs(nombres)` qui prend une liste d'entiers, ne garde que les pairs avec `filter`, puis renvoie une nouvelle liste de leurs doubles avec `map`. La liste d'origine ne doit pas être modifiée.**

    ```python
    def doubles_des_pairs(nombres):
        pass

    nombres = [1, 2, 3, 4]
    doubles_des_pairs(nombres)
    doubles_des_pairs([])
    ```

    <Correction>
    ```python
    def doubles_des_pairs(nombres):
        pairs = filter(lambda n: n % 2 == 0, nombres)
        return list(map(lambda n: n * 2, pairs))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'doubles_des_pairs' in locals(), "La fonction 'doubles_des_pairs' n'est pas définie."
nombres = [1, 2, 3, 4]
assert doubles_des_pairs(nombres) == [4, 8]
assert nombres == [1, 2, 3, 4]
assert doubles_des_pairs([-2, 0, 5]) == [-4, 0]
assert doubles_des_pairs([]) == []
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonct-3-2" label="3.2 [Moyen] - Longueurs au-dessus d'un seuil">
    <Enonce>
    ### Exercice 3.2 [Moyen] : Longueurs au-dessus d'un seuil
    **Écrire une fonction `longueurs_au_dessus(mots, seuil)` qui prend une liste de chaînes non vides et un entier `seuil`. Elle ne garde, avec `filter`, que les mots dont la longueur est strictement supérieure à `seuil`, puis renvoie avec `map` la liste de ces longueurs. La liste d'origine ne doit pas être modifiée.**

    ```python
    def longueurs_au_dessus(mots, seuil):
        pass

    mots = ["chat", "python", "os", "loup"]
    longueurs_au_dessus(mots, 3)
    longueurs_au_dessus([], 0)
    ```

    <Correction>
    ```python
    def longueurs_au_dessus(mots, seuil):
        gardes = filter(lambda mot: len(mot) > seuil, mots)
        return list(map(len, gardes))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'longueurs_au_dessus' in locals(), "La fonction 'longueurs_au_dessus' n'est pas définie."
mots = ["chat", "python", "os", "loup"]
assert longueurs_au_dessus(mots, 3) == [4, 6, 4]
assert mots == ["chat", "python", "os", "loup"]
assert longueurs_au_dessus(["a", "bb"], 2) == []
assert longueurs_au_dessus([], 0) == []
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonct-3-3" label="3.3 [Moyen] - Somme des positifs">
    <Enonce>
    ### Exercice 3.3 [Moyen] : Somme des positifs
    **Écrire une fonction `somme_positifs(nombres)` qui prend une liste de nombres, ne garde que les strictement positifs avec `filter`, puis renvoie leur somme avec `functools.reduce`. S'il n'y a aucun positif, le résultat est 0. La liste d'origine ne doit pas être modifiée.**

    ```python
    from functools import reduce

    def somme_positifs(nombres):
        pass

    nombres = [-1, 0, 3, 5]
    somme_positifs(nombres)
    somme_positifs([])
    ```

    <Correction>
    ```python
    from functools import reduce

    def somme_positifs(nombres):
        positifs = filter(lambda x: x > 0, nombres)
        return reduce(lambda acc, x: acc + x, positifs, 0)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'somme_positifs' in locals(), "La fonction 'somme_positifs' n'est pas définie."
nombres = [-1, 0, 3, 5]
assert somme_positifs(nombres) == 8
assert nombres == [-1, 0, 3, 5]
assert somme_positifs([-4, 0]) == 0
assert somme_positifs([]) == 0
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 4 : AVANCÉ (4.1 à 4.3)            */}
  {/* ========================================== */}

  <ExerciseSection id="fonct-4-1" label="4.1 [Avancé] - Somme des carrés">
    <Enonce>
    ### Exercice 4.1 [Avancé] : Somme des carrés
    **Écrire une fonction `somme_carres(nombres)` qui prend une liste de nombres, calcule le carré de chaque élément avec `map`, puis renvoie la somme de ces carrés avec `functools.reduce`. Une liste vide renvoie 0. La liste d'origine ne doit pas être modifiée.**

    ```python
    from functools import reduce

    def somme_carres(nombres):
        pass

    nombres = [1, 2, 3]
    somme_carres(nombres)
    somme_carres([])
    ```

    <Correction>
    ```python
    from functools import reduce

    def somme_carres(nombres):
        carres = map(lambda x: x * x, nombres)
        return reduce(lambda acc, x: acc + x, carres, 0)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'somme_carres' in locals(), "La fonction 'somme_carres' n'est pas définie."
nombres = [1, 2, 3]
assert somme_carres(nombres) == 14
assert nombres == [1, 2, 3]
assert somme_carres([-2, 4]) == 20
assert somme_carres([]) == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonct-4-2" label="4.2 [Avancé] - Doubler au-dessus d'un seuil">
    <Enonce>
    ### Exercice 4.2 [Avancé] : Doubler au-dessus d'un seuil
    **Écrire une fonction `doubler_au_dessus(nombres, seuil)` qui prend une liste de nombres et un nombre `seuil`. Avec `filter`, elle ne garde que les valeurs strictement supérieures à `seuil`, puis avec `map` elle renvoie une nouvelle liste de leurs doubles. La liste d'origine ne doit pas être modifiée.**

    ```python
    def doubler_au_dessus(nombres, seuil):
        pass

    nombres = [1, 5, 3, 8]
    doubler_au_dessus(nombres, 3)
    doubler_au_dessus([], 0)
    ```

    <Correction>
    ```python
    def doubler_au_dessus(nombres, seuil):
        gardes = filter(lambda n: n > seuil, nombres)
        return list(map(lambda n: n * 2, gardes))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'doubler_au_dessus' in locals(), "La fonction 'doubler_au_dessus' n'est pas définie."
nombres = [1, 5, 3, 8]
assert doubler_au_dessus(nombres, 3) == [10, 16]
assert nombres == [1, 5, 3, 8]
assert doubler_au_dessus([2, 2], 2) == []
assert doubler_au_dessus([], 0) == []
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonct-4-3" label="4.3 [Avancé] - Initiales des mots longs">
    <Enonce>
    ### Exercice 4.3 [Avancé] : Initiales des mots longs
    **Écrire une fonction `initiales_longues(mots, seuil)` qui prend une liste de mots non vides et un entier `seuil`. Avec `filter`, elle ne garde que les mots dont la longueur est supérieure ou égale à `seuil`, puis avec `map` elle renvoie la liste de leur première lettre. La liste d'origine ne doit pas être modifiée.**

    ```python
    def initiales_longues(mots, seuil):
        pass

    mots = ["chat", "python", "os", "loup"]
    initiales_longues(mots, 4)
    initiales_longues([], 1)
    ```

    <Correction>
    ```python
    def initiales_longues(mots, seuil):
        gardes = filter(lambda mot: len(mot) >= seuil, mots)
        return list(map(lambda mot: mot[0], gardes))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'initiales_longues' in locals(), "La fonction 'initiales_longues' n'est pas définie."
mots = ["chat", "python", "os", "loup"]
assert initiales_longues(mots, 4) == ["c", "p", "l"]
assert mots == ["chat", "python", "os", "loup"]
assert initiales_longues(["a", "bb"], 3) == []
assert initiales_longues([], 1) == []
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 5 : DIFFICILE (5.1 à 5.6)         */}
  {/* ========================================== */}

  <ExerciseSection id="fonct-5-1" label="5.1 [Difficile] - Somme des carrés des pairs">
    <Enonce>
    ### Exercice 5.1 [Difficile] : Somme des carrés des pairs
    **Écrire une fonction `somme_carres_pairs(nombres)` qui prend une liste d'entiers. Avec `filter`, elle ne garde que les entiers pairs, avec `map` elle calcule leur carré, puis avec `functools.reduce` elle renvoie la somme de ces carrés. S'il n'y a aucun pair, le résultat est 0. La liste d'origine ne doit pas être modifiée.**

    ```python
    from functools import reduce

    def somme_carres_pairs(nombres):
        pass

    nombres = [-2, 1, 2, 3]
    somme_carres_pairs(nombres)
    somme_carres_pairs([])
    ```

    <Correction>
    ```python
    from functools import reduce

    def somme_carres_pairs(nombres):
        pairs = filter(lambda n: n % 2 == 0, nombres)
        carres = map(lambda n: n * n, pairs)
        return reduce(lambda acc, x: acc + x, carres, 0)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'somme_carres_pairs' in locals(), "La fonction 'somme_carres_pairs' n'est pas définie."
nombres = [-2, 1, 2, 3]
assert somme_carres_pairs(nombres) == 8
assert nombres == [-2, 1, 2, 3]
assert somme_carres_pairs([1, 2, 3, 4]) == 20
assert somme_carres_pairs([1, 3]) == 0
assert somme_carres_pairs([]) == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonct-5-2" label="5.2 [Difficile] - Produit des longueurs paires">
    <Enonce>
    ### Exercice 5.2 [Difficile] : Produit des longueurs paires
    **Écrire une fonction `produit_longueurs_paires(mots)` qui prend une liste de chaînes. Avec `filter`, elle ne garde que les mots de longueur paire, avec `map` elle récupère ces longueurs, puis avec `functools.reduce` elle renvoie leur produit. S'il n'y a aucun mot de longueur paire, le résultat est 1. La liste d'origine ne doit pas être modifiée.**

    ```python
    from functools import reduce

    def produit_longueurs_paires(mots):
        pass

    mots = ["ab", "c", "defg", "xy"]
    produit_longueurs_paires(mots)
    produit_longueurs_paires([])
    ```

    <Correction>
    ```python
    from functools import reduce

    def produit_longueurs_paires(mots):
        pairs = filter(lambda mot: len(mot) % 2 == 0, mots)
        longueurs = map(len, pairs)
        return reduce(lambda acc, n: acc * n, longueurs, 1)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'produit_longueurs_paires' in locals(), "La fonction 'produit_longueurs_paires' n'est pas définie."
mots = ["ab", "c", "defg", "xy"]
assert produit_longueurs_paires(mots) == 16
assert mots == ["ab", "c", "defg", "xy"]
assert produit_longueurs_paires(["a", "bbb"]) == 1
assert produit_longueurs_paires([]) == 1
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonct-5-3" label="5.3 [Difficile] - Bilan des admis">
    <Enonce>
    ### Exercice 5.3 [Difficile] : Bilan des admis
    **Écrire une fonction `bilan_admis(copies, seuil)` qui prend une liste de dictionnaires `{"nom", "note", "absent"}` et un entier `seuil`. Avec `filter`, elle ne garde que les copies non absentes dont la note est supérieure ou égale à `seuil` (une note égale au seuil est admise). Avec `map` puis `functools.reduce`, elle renvoie le tuple `(nombre, somme)` de ces notes. S'il n'y a aucun admis, le résultat est `(0, 0)`. La liste d'origine ne doit pas être modifiée.**

    ```python
    from functools import reduce

    def bilan_admis(copies, seuil):
        pass

    copies = [
        {"nom": "Lea", "note": 12, "absent": False},
        {"nom": "Noah", "note": 10, "absent": False},
        {"nom": "Ines", "note": 8, "absent": False},
        {"nom": "Adam", "note": 15, "absent": True},
    ]
    bilan_admis(copies, 10)
    bilan_admis([], 10)
    ```

    <Correction>
    ```python
    from functools import reduce

    def bilan_admis(copies, seuil):
        notes = map(
            lambda copie: copie["note"],
            filter(lambda copie: (not copie["absent"]) and copie["note"] >= seuil, copies),
        )
        return reduce(lambda acc, note: (acc[0] + 1, acc[1] + note), notes, (0, 0))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'bilan_admis' in locals(), "La fonction 'bilan_admis' n'est pas définie."
copies = [
    {"nom": "Lea", "note": 12, "absent": False},
    {"nom": "Noah", "note": 10, "absent": False},
    {"nom": "Ines", "note": 8, "absent": False},
    {"nom": "Adam", "note": 15, "absent": True},
]
assert bilan_admis(copies, 10) == (2, 22)
assert copies == [
    {"nom": "Lea", "note": 12, "absent": False},
    {"nom": "Noah", "note": 10, "absent": False},
    {"nom": "Ines", "note": 8, "absent": False},
    {"nom": "Adam", "note": 15, "absent": True},
]
assert bilan_admis([{"nom": "Lea", "note": 10, "absent": False}], 10) == (1, 10)
assert bilan_admis([{"nom": "Ines", "note": 9, "absent": False}], 10) == (0, 0)
assert bilan_admis([], 10) == (0, 0)
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonct-5-4" label="5.4 [Difficile] - Voyelles des mots pairs">
    <Enonce>
    ### Exercice 5.4 [Difficile] : Voyelles des mots pairs
    **Écrire une fonction `somme_voyelles_pairs(mots)` qui prend une liste de chaînes. Avec `filter`, elle ne garde que les mots de longueur paire. Pour chacun, avec `filter` elle compte les voyelles `a, e, i, o, u, y` (majuscules comprises), puis avec `functools.reduce` elle renvoie la somme de ces comptes. Un mot pair sans voyelle compte pour 0. S'il n'y a aucun mot de longueur paire, le résultat est 0. La liste d'origine ne doit pas être modifiée.**

    ```python
    from functools import reduce

    def somme_voyelles_pairs(mots):
        pass

    mots = ["chat", "chien", "PYTHON", "os"]
    somme_voyelles_pairs(mots)
    somme_voyelles_pairs([""])
    somme_voyelles_pairs([])
    ```

    <Correction>
    ```python
    from functools import reduce

    def somme_voyelles_pairs(mots):
        voyelles = "aeiouyAEIOUY"

        def nombre_voyelles(mot):
            return len(list(filter(lambda lettre: lettre in voyelles, mot)))

        comptes = map(nombre_voyelles, filter(lambda mot: len(mot) % 2 == 0, mots))
        return reduce(lambda acc, n: acc + n, comptes, 0)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'somme_voyelles_pairs' in locals(), "La fonction 'somme_voyelles_pairs' n'est pas définie."
mots = ["chat", "chien", "PYTHON", "os"]
assert somme_voyelles_pairs(mots) == 4
assert mots == ["chat", "chien", "PYTHON", "os"]
assert somme_voyelles_pairs(["Rythme", "bb", "a"]) == 2
assert somme_voyelles_pairs([""]) == 0
assert somme_voyelles_pairs(["a", "bbb"]) == 0
assert somme_voyelles_pairs([]) == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonct-5-5" label="5.5 [Difficile] - Gagnants ex aequo">
    <Enonce>
    ### Exercice 5.5 [Difficile] : Gagnants ex aequo
    **Écrire une fonction `gagnants(votes)` qui prend une liste de tuples `(nom, voix)`, avec des voix entières supérieures ou égales à 0. Avec `functools.reduce`, elle détermine le meilleur total de voix, puis avec `filter` et `map` elle renvoie la liste des noms qui l'atteignent, dans l'ordre d'apparition. En cas d'égalité, tous les noms ex aequo sont renvoyés. Une liste vide renvoie `[]`. La liste d'origine ne doit pas être modifiée.**

    ```python
    from functools import reduce

    def gagnants(votes):
        pass

    votes = [("Ana", 3), ("Bo", 5), ("Clem", 5), ("Dina", 1)]
    gagnants(votes)
    gagnants([("A", 0), ("B", 0)])
    gagnants([])
    ```

    <Correction>
    ```python
    from functools import reduce

    def gagnants(votes):
        meilleur = reduce(lambda acc, vote: vote[1] if vote[1] > acc else acc, votes, -1)
        return list(map(lambda vote: vote[0], filter(lambda vote: vote[1] == meilleur, votes)))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'gagnants' in locals(), "La fonction 'gagnants' n'est pas définie."
votes = [("Ana", 3), ("Bo", 5), ("Clem", 5), ("Dina", 1)]
assert gagnants(votes) == ["Bo", "Clem"]
assert votes == [("Ana", 3), ("Bo", 5), ("Clem", 5), ("Dina", 1)]
assert gagnants([("A", 2), ("B", 2)]) == ["A", "B"]
assert gagnants([("A", 0), ("B", 0)]) == ["A", "B"]
assert gagnants([("A", 1), ("B", 4)]) == ["B"]
assert gagnants([]) == []
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fonct-5-6" label="5.6 [Difficile] - Dépense sous un plafond">
    <Enonce>
    ### Exercice 5.6 [Difficile] : Dépense sous un plafond
    **Écrire une fonction `depense_sous_plafond(achats, plafond)` qui prend une liste de dictionnaires `{"article", "prix", "quantite"}` et un entier `plafond`. Avec `filter`, elle ne garde que les achats de quantité strictement positive dont le prix est inférieur ou égal au plafond (un prix égal au plafond est gardé). Avec `map`, elle calcule `prix * quantite` pour chacun, puis avec `functools.reduce` elle renvoie la somme de ces montants. S'il n'y a aucun achat retenu, le résultat est 0. La liste d'origine ne doit pas être modifiée.**

    ```python
    from functools import reduce

    def depense_sous_plafond(achats, plafond):
        pass

    achats = [
        {"article": "cahier", "prix": 3, "quantite": 2},
        {"article": "stylo", "prix": 5, "quantite": 1},
        {"article": "livre", "prix": 12, "quantite": 1},
        {"article": "gomme", "prix": 1, "quantite": 0},
    ]
    depense_sous_plafond(achats, 5)
    depense_sous_plafond([], 5)
    ```

    <Correction>
    ```python
    from functools import reduce

    def depense_sous_plafond(achats, plafond):
        montants = map(
            lambda achat: achat["prix"] * achat["quantite"],
            filter(lambda achat: achat["quantite"] > 0 and achat["prix"] <= plafond, achats),
        )
        return reduce(lambda acc, montant: acc + montant, montants, 0)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'depense_sous_plafond' in locals(), "La fonction 'depense_sous_plafond' n'est pas définie."
achats = [
    {"article": "cahier", "prix": 3, "quantite": 2},
    {"article": "stylo", "prix": 5, "quantite": 1},
    {"article": "livre", "prix": 12, "quantite": 1},
    {"article": "gomme", "prix": 1, "quantite": 0},
]
assert depense_sous_plafond(achats, 5) == 11
assert achats == [
    {"article": "cahier", "prix": 3, "quantite": 2},
    {"article": "stylo", "prix": 5, "quantite": 1},
    {"article": "livre", "prix": 12, "quantite": 1},
    {"article": "gomme", "prix": 1, "quantite": 0},
]
assert depense_sous_plafond([{"article": "stylo", "prix": 5, "quantite": 2}], 5) == 10
assert depense_sous_plafond([{"article": "livre", "prix": 12, "quantite": 1}], 5) == 0
assert depense_sous_plafond([], 5) == 0
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
