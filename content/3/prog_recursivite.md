---
title: "Récursivité"
description: "Principe des fonctions récursives et pile d'exécution."
level: terminale
chapter: "Langages et Programmation"
icon: "🔄"
badgeId: "terminale_recursivite"
---

# 🔄 La Récursivité

Une fonction est dite **récursive** si elle **s'appelle elle-même** dans sa propre définition. C'est un concept puissant pour résoudre des problèmes qui peuvent être décomposés en sous-problèmes identiques plus petits.

## 1. Anatomie d'une fonction récursive

Pour qu'une fonction récursive fonctionne correctement (et ne tourne pas à l'infini 💥), elle doit impérativement comporter deux parties :

1.  **Le Cas de Base (Condition d'arrêt)** : C'est la situation simple où la fonction peut répondre directement sans s'appeler elle-même. C'est ce qui arrête la récursion.
2.  **L'Appel Récursif** : La fonction s'appelle elle-même avec des arguments qui la rapprochent du cas de base.

### Exemple : La Factorielle

La factorielle de $n$ ($n!$) est le produit des nombres de 1 à $n$.
*   Mathématiquement :
    *   $0! = 1$
    *   $n! = n \times (n-1)!$ pour $n > 0$

```python
def factorielle(n):
    # 1. Cas de base
    if n == 0:
        return 1
    # 2. Appel récursif
    else:
        return n * factorielle(n - 1)
```

## 2. La Pile d'Exécution (Call Stack)

Comment l'ordinateur gère-t-il cela ? Il utilise une **pile**.
Imaginez une pile d'assiettes. À chaque appel de fonction, on ajoute une assiette (un contexte d'exécution) sur la pile. Quand une fonction se termine (return), on retire l'assiette.

**Exemple pour `factorielle(3)` :**

1.  Appel `factorielle(3)` : besoin de `factorielle(2)` -> **Empile**
2.  Appel `factorielle(2)` : besoin de `factorielle(1)` -> **Empile**
3.  Appel `factorielle(1)` : besoin de `factorielle(0)` -> **Empile**
4.  Appel `factorielle(0)` : renvoie `1` (Cas de base !) -> **Dépile**
5.  Reprise `factorielle(1)` : calcule `1 * 1 = 1` -> **Dépile**
6.  Reprise `factorielle(2)` : calcule `2 * 1 = 2` -> **Dépile**
7.  Reprise `factorielle(3)` : calcule `3 * 2 = 6` -> **Dépile**
8.  Résultat final : 6.

⚠️ **Stack Overflow** : Si vous oubliez le cas de base ou si la récursion est trop profonde (par défaut 1000 en Python), la pile déborde et le programme plante (`RecursionError`).

## 3. Récursif vs Itératif

Tout programme récursif peut être écrit de manière itérative (avec des boucles `for` ou `while`), et inversement.

*   **Itératif** : Souvent plus efficace en mémoire (pas d'empilement).
*   **Récursif** : Souvent plus élégant et plus simple à écrire pour certains problèmes (arbres, graphes, tours de Hanoï).

---

<ExerciseTabs courseId="terminale_recursivite" courseTitle="Exercices Récursivité">

  <ExerciseSection id="rec-ex-1" label="Somme Récursive">
    <Enonce>
    ### Somme des entiers
    Écrivez une fonction récursive `somme(n)` qui calcule la somme des entiers de 0 à `n`.
    *   Exemple : `somme(4)` doit renvoyer `4 + 3 + 2 + 1 + 0 = 10`.
    
    **Indices :**
    *   Cas de base : Quelle est la somme si n = 0 ?
    *   Récursion : `somme(n) = n + somme(...)` ?
    
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="rec-ex-2" label="Fibonacci">
    <Enonce>
    ### Suite de Fibonacci 🐰
    La suite est définie par :
    *   $F_0 = 0$
    *   $F_1 = 1$
    *   $F_n = F_{n-1} + F_{n-2}$ pour $n \ge 2$
    
    Écrivez la fonction récursive `fibonacci(n)`.
    
    </Enonce>
  </ExerciseSection>
  
  <ExerciseSection id="rec-ex-3" label="Palindrome">
    <Enonce>
    ### Détection de Palindrome
    Un palindrome se lit pareil dans les deux sens (ex: "LAVAL", "RADAR").
    Écrivez une fonction récursive `est_palindrome(mot)` qui renvoie `True` ou `False`.
    
    **Principe :**
    *   Si le mot a 0 ou 1 lettre -> C'est un palindrome (Base).
    *   Si la première et la dernière lettre sont différentes -> Faux.
    *   Sinon -> On teste le sous-mot sans la première ni la dernière lettre.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
