---
title: Récursivité
description: Principe des fonctions récursives et pile d'exécution.
level: TNSI
order: 90
chapter: Langages et Programmation
icon: "refresh-cw"
badgeId: terminale_recursivite
prerequisites:
  - prog_modularite_mise_au_point
audience: public
---

# La récursivité

Une fonction est **récursive** lorsqu'elle s'appelle elle-même. On s'en sert quand un problème se décompose en un problème de la même forme, plus petit. La factorielle, le parcours d'un arbre, les tours de Hanoï : à chaque fois, la question sur $n$ se ramène à la même question sur $n - 1$, ou sur une partie de la structure. Sans une condition qui arrête les appels, la fonction ne revient jamais.

## Deux morceaux, pas un

Il faut un **cas de base** et un **appel récursif**. Le cas de base est la situation assez simple pour répondre sans se rappeler. L'appel récursif doit rapprocher les arguments de ce cas. Si les arguments ne diminuent pas, ou si le cas de base est inatteignable, les appels s'empilent jusqu'à l'erreur.

La factorielle de $n$, notée $n!$, est le produit des entiers de 1 à $n$. On convient que $0! = 1$, et que $n! = n \times (n-1)!$ dès que $n > 0$. La première ligne est le cas de base. La seconde est l'appel.

```python
def factorielle(n):
    # 1. Cas de base
    if n == 0:
        return 1
    # 2. Appel récursif
    else:
        return n * factorielle(n - 1)
```

`factorielle(3)` ne sait pas encore multiplier. Elle demande `factorielle(2)`, qui demande `factorielle(1)`, qui demande `factorielle(0)`. C'est seulement là qu'une fonction répond `1`, sans appel supplémentaire. Les autres reprennent alors leur multiplication, de l'intérieur vers l'extérieur.

## La pile d'appels

L'interpréteur range les appels en cours dans une **pile**. Chaque appel est une assiette : les paramètres, l'endroit où il faudra reprendre. On empile à l'appel, on dépile au `return`.

Pour `factorielle(3)` :

1. Appel `factorielle(3)` : besoin de `factorielle(2)`, donc on empile
2. Appel `factorielle(2)` : besoin de `factorielle(1)`, donc on empile
3. Appel `factorielle(1)` : besoin de `factorielle(0)`, donc on empile
4. Appel `factorielle(0)` : renvoie `1`, donc on dépile
5. Reprise de `factorielle(1)` : calcule `1 * 1 = 1`, donc on dépile
6. Reprise de `factorielle(2)` : calcule `2 * 1 = 2`, donc on dépile
7. Reprise de `factorielle(3)` : calcule `3 * 2 = 6`, donc on dépile

Le résultat est 6. Au plus fort de l'exécution, quatre appels étaient en attente les uns sur les autres. Ce n'est pas « la fonction qui tourne en même temps qu'elle-même » : ce sont quatre contextes distincts, chacun avec son propre `n`.

<CallStackVisualizer />

Si le cas de base manque, ou si la profondeur dépasse la limite de l'interpréteur (1000 appels par défaut en Python), la pile déborde. Python lève alors `RecursionError`. On appelle cela un dépassement de pile.

## Récursif et itératif

Une récursion peut se réécrire avec une boucle. Quand les appels ne sont pas de simples appels en dernière ligne, la boucle doit gérer elle-même une pile : c'est ce que l'interpréteur faisait tout seul. Dans l'autre sens, une boucle peut se reformuler par un appel récursif. Les deux écrivent le même calcul. Ils ne coûtent pas la même mémoire.

La version itérative de la factorielle garde un accumulateur et n'empile rien. Elle est souvent plus économe. La version récursive est souvent plus courte à écrire quand la structure est déjà un arbre, un graphe, ou un découpage comme les tours de Hanoï : le cas de base et l'appel collent à la définition du problème.

En résumé, une fonction récursive s'appelle elle-même, avec un cas de base qui arrête, et des arguments qui s'en rapprochent. Chaque appel attend sur la pile jusqu'au `return`. Oublier le cas de base, ou descendre trop profond, lève `RecursionError`. On choisit la récursion quand elle rend le problème lisible, et la boucle quand l'empilement n'apporte rien.

<ExerciseTabs courseId="terminale_recursivite" courseTitle="Exercices Récursivité">

  <ExerciseSection id="rec-ex-1" label="Somme Récursive" type="python">
    <Enonce>
    ### Somme des entiers
    Écrire une fonction récursive `somme(n)` qui calcule la somme des entiers de 0 à `n`.
    *   Exemple : `somme(4)` doit renvoyer `4 + 3 + 2 + 1 + 0 = 10`.
    
    **Indices :**
    *   Cas de base : Quelle est la somme si n = 0 ?
    *   Récursion : `somme(n) = n + somme(...)` ?

    <Correction>
    ```python
    def somme(n):
        if n == 0:
            return 0
        return n + somme(n - 1)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert somme(0) == 0, "somme(0) doit renvoyer 0 (cas de base)."
    assert somme(4) == 10, "somme(4) doit renvoyer 10."
    assert somme(10) == 55, "somme(10) doit renvoyer 55."
    assert "somme" in somme.__code__.co_names, "La fonction doit être récursive : elle s'appelle elle-même."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="rec-ex-2" label="Fibonacci" type="python">
    <Enonce>
    ### Suite de Fibonacci <Icone nom="rabbit" />
    La suite est définie par :
    *   $F_0 = 0$
    *   $F_1 = 1$
    *   $F_n = F_{n-1} + F_{n-2}$ pour $n \ge 2$
    
    Écrire la fonction récursive `fibonacci(n)`.

    <Correction>
    ```python
    def fibonacci(n):
        if n < 2:
            return n
        return fibonacci(n - 1) + fibonacci(n - 2)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert fibonacci(0) == 0, "fibonacci(0) doit renvoyer 0."
    assert fibonacci(1) == 1, "fibonacci(1) doit renvoyer 1."
    assert fibonacci(2) == 1, "fibonacci(2) doit renvoyer 1."
    assert fibonacci(7) == 13, "fibonacci(7) doit renvoyer 13."
    assert fibonacci(15) == 610, "fibonacci(15) doit renvoyer 610."
    assert "fibonacci" in fibonacci.__code__.co_names, "La fonction doit être récursive."
    ```
    </Verification>
  </ExerciseSection>
  
  <ExerciseSection id="rec-ex-3" label="Palindrome" type="python">
    <Enonce>
    ### Détection de Palindrome
    Un palindrome se lit pareil dans les deux sens (ex: "LAVAL", "RADAR").
    Écrire une fonction récursive `est_palindrome(mot)` qui renvoie `True` ou `False`.
    
    **Principe :**
    *   Si le mot a 0 ou 1 lettre -> C'est un palindrome (Base).
    *   Si la première et la dernière lettre sont différentes -> Faux.
    *   Sinon -> On teste le sous-mot sans la première ni la dernière lettre.

    <Correction>
    ```python
    def est_palindrome(mot):
        if len(mot) <= 1:
            return True
        if mot[0] != mot[-1]:
            return False
        return est_palindrome(mot[1:-1])
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert est_palindrome("RADAR") is True, "RADAR est un palindrome."
    assert est_palindrome("LAVAL") is True, "LAVAL est un palindrome."
    assert est_palindrome("RENARD") is False, "RENARD n'est pas un palindrome."
    assert est_palindrome("") is True, "Le mot vide est un palindrome."
    assert est_palindrome("A") is True, "Un mot d'une lettre est un palindrome."
    assert est_palindrome("ABBA") is True, "ABBA est un palindrome."
    assert est_palindrome("ABCA") is False, "ABCA n'est pas un palindrome."
    assert "est_palindrome" in est_palindrome.__code__.co_names, "La fonction doit être récursive."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
