---
title: 'Exercices : Circuits Logiques'
description: 'Cours sur Exercices : Circuits Logiques'
level: premiere
chapter: Architecture matérielle
icon: ⚡
badgeId: premiere_fiche_exo_circuits
prerequisites:
  - archi_circuits
---


<ExerciseTabs courseId="circuits-logiques" courseTitle="Circuits Logiques">

  <ExerciseSection id="exo-1" label="1 - Identification">
    <Enonce>
    ### Exercice 1 : Circuits et portes

    **1. Pour les deux schémas suivants, donner les portes logiques qui les composent. Quelle est la différence entre ces 2 schémas?**

    ![Exercices : Circuits Logiques](/content/2/04_Architecture_d_une_machine/ex1_1.png)

    ![Exercices : Circuits Logiques](/content/2/04_Architecture_d_une_machine/ex1_2.png)

    *Astuce : il est possible de partir du début et retranscrire tous les résultats des portes logiques.*

    **2. Donner la table de vérité du deuxième circuit.**
    
    <Correction>
    **1. Identification :**
    *   **Circuit 1 :** Comporte des portes NOT, AND, OR. C'est un XOR (OU exclusif) réalisé avec des portes de base.
        *   Équation : `(a or b) and not(a and b)`
    *   **Circuit 2 :** Comporte aussi des portes NOT, AND, OR. C'est aussi un XOR mais réalisé différemment.
        *   Équation : `(a and not b) or (not a and b)`
    
    Les deux circuits réalisent la même fonction logique : le **XOR**.

    **2. Table de vérité (Circuit 2) :**

    | a | b | S |
    |---|---|---|
    | 0 | 0 | 0 |
    | 0 | 1 | 1 |
    | 1 | 0 | 1 |
    | 1 | 1 | 0 |

    **Vérification Python :**
    ```python
    def circuit2(a, b):
        return (a and not b) or (not a and b)

    print(f"0 0 -> {int(circuit2(0, 0))}")
    print(f"0 1 -> {int(circuit2(0, 1))}")
    print(f"1 0 -> {int(circuit2(1, 0))}")
    print(f"1 1 -> {int(circuit2(1, 1))}")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    # Simulation du circuit XOR
    def xor_circuit(a, b):
        return (a and not b) or (not a and b)

    assert xor_circuit(0, 0) == 0
    assert xor_circuit(0, 1) == 1
    assert xor_circuit(1, 0) == 1
    assert xor_circuit(1, 1) == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-2" label="2 - Équations">
    <Enonce>
    ### Exercice 2 : Circuits vers équations

    **Pour chacun de ces circuits, donner l'équation booléenne correspondante**

    **Circuit 1:**
    ![Exercices : Circuits Logiques](/content/2/04_Architecture_d_une_machine/ex2_1.png)

    **Circuit 2:**
    ![Exercices : Circuits Logiques](/content/2/04_Architecture_d_une_machine/ex2_2.png)

    **Circuit 3:**
    ![Exercices : Circuits Logiques](/content/2/04_Architecture_d_une_machine/ex2_3.png)
    
    <Correction>
    **Circuit 1 :**
    `S = (a and b) or c`

    **Circuit 2 :**
    `S = not(a or b)` (Porte NOR)

    **Circuit 3 :**
    `S = (a or b) and (c or d)`
    </Correction>
    </Enonce>
    <Verification>
    ```python
    # Pas de vérification automatique simple pour des équations textuelles, 
    # mais on peut simuler les fonctions si besoin.
    pass 
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-4" label="4 - Simplification">
    <Enonce>
    ### Exercice 4 : Simplification de circuits

    **Simplifiez les expressions booléennes suivantes en utilisant les lois de De Morgan et les propriétés de l'algèbre booléenne :**

    1. `not (a and b) or (not a or not b)`
    2. `(a and b) or (a and not b)`
    3. `not (not a or not b) and (a or b)`

    *Rappel des lois principales :*
    - Loi de De Morgan : `not(A and B) = (not A) or (not B)`
    - Distributivité : `A and (B or C) = (A and B) or (A and C)`
    - Idempotence : `A and A = A`, `A or A = A`
    - Tiers exclu : `A or not A = 1`, `A and not A = 0`
    
    <Correction>
    **1. `not (a and b) or (not a or not b)`**
    *   `not (a and b)` est équivalent à `(not a or not b)` (De Morgan).
    *   L'expression devient : `(not a or not b) or (not a or not b)`
    *   Par idempotence (`X or X = X`) : `not a or not b` (ou `not (a and b)`)

    **2. `(a and b) or (a and not b)`**
    *   Factorisation par `a` : `a and (b or not b)`
    *   `b or not b` vaut 1 (Vrai).
    *   Donc : `a and 1` = `a`

    **3. `not (not a or not b) and (a or b)`**
    *   De Morgan sur la première partie : `not (not a or not b)` = `not(not a) and not(not b)` = `a and b`
    *   L'expression devient : `(a and b) and (a or b)`
    *   Absorption : si `a` et `b` sont vrais, alors `a or b` est vrai.
    *   Donc : `a and b`
    </Correction>
    </Enonce>
    <Verification>
    ```python
    # Vérification par simulation exhaustive (Preuve par table de vérité)
    
    # Cas 2 : (a and b) or (a and not b) == a
    def expr2(a, b): return (a and b) or (a and not b)
    for a in [0, 1]:
        for b in [0, 1]:
            assert expr2(a, b) == a, f"Échec pour a={a}, b={b}"

    # Cas 3 : not (not a or not b) and (a or b) == a and b
    def expr3(a, b): return (not (not a or not b)) and (a or b)
    def simple3(a, b): return a and b
    for a in [0, 1]:
        for b in [0, 1]:
            assert expr3(a, b) == simple3(a, b)
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-5" label="5 - Analyse">
    <Enonce>
    ### Exercice 5 : Analyse de circuits complexes

    **Soit un circuit avec 3 entrées A, B, C et une sortie S, défini par :**
    `S = (A and B) or (B and C) or (A and C)`

    **Questions :**
    1. Construisez la table de vérité complète de ce circuit
    2. Dans quels cas la sortie S vaut-elle 1 ?
    3. Ce circuit implémente quelle fonction logique ? (Indice : fonction de vote)
    4. Combien de portes logiques minimum faut-il pour réaliser ce circuit ?
    
    <Correction>
    **1. Table de vérité :**

    | A | B | C | S |
    |---|---|---|---|
    | 0 | 0 | 0 | 0 |
    | 0 | 0 | 1 | 0 |
    | 0 | 1 | 0 | 0 |
    | 0 | 1 | 1 | 1 |
    | 1 | 0 | 0 | 0 |
    | 1 | 0 | 1 | 1 |
    | 1 | 1 | 0 | 1 |
    | 1 | 1 | 1 | 1 |

    **2. S vaut 1 quand :**
    Au moins deux des entrées valent 1.

    **3. Fonction :**
    C'est une fonction de **Majorité** (ou Vote). La sortie est à 1 si la majorité des entrées sont à 1.

    **4. Portes logiques :**
    L'expression `(A and B) or (B and C) or (A and C)` nécessite :
    - 3 portes AND
    - 2 portes OR (ou 1 porte OR à 3 entrées)
    Total : 4 ou 5 portes.
    </Correction>
    </Enonce>
    <Verification>
    ```python
    def majorite(a, b, c):
        return (a and b) or (b and c) or (a and c)

    # Vérification : S=1 ssi somme(a,b,c) >= 2
    for a in [0, 1]:
        for b in [0, 1]:
            for c in [0, 1]:
                somme = a + b + c
                res = majorite(a, b, c)
                if somme >= 2:
                    assert res == 1
                else:
                    assert res == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-6" label="6 - Additionneur">
    <Enonce>
    ### Exercice 6 : Conception d'un additionneur

    **Concevez un circuit additionneur 1 bit.**
    
    Un additionneur 1 bit prend en entrée :
    - `A` et `B` : les deux bits à additionner
    - `Cin` : la retenue d'entrée

    Et produit en sortie :
    - `S` : la somme
    - `Cout` : la retenue de sortie

    **Questions :**
    1. Établissez la table de vérité de cet additionneur
    2. Trouvez les équations booléennes pour S et Cout
    
    <Correction>
    **1. Table de vérité :**

    | Cin | A | B | S | Cout |
    |-----|---|---|---|------|
    | 0   | 0 | 0 | 0 | 0    |
    | 0   | 0 | 1 | 1 | 0    |
    | 0   | 1 | 0 | 1 | 0    |
    | 0   | 1 | 1 | 0 | 1    |
    | 1   | 0 | 0 | 1 | 0    |
    | 1   | 0 | 1 | 0 | 1    |
    | 1   | 1 | 0 | 0 | 1    |
    | 1   | 1 | 1 | 1 | 1    |

    **2. Équations :**
    - **S (Somme) :** Vaut 1 si le nombre de 1 en entrée est impair (1 ou 3).
        - `S = A xor B xor Cin`
    - **Cout (Retenue sortante) :** Vaut 1 si au moins deux entrées valent 1.
        - `Cout = (A and B) or (Cin and (A xor B))`
        - Ou simplement (Majorité) : `Cout = (A and B) or (A and Cin) or (B and Cin)`
    </Correction>
    </Enonce>
    <Verification>
    ```python
    def additionneur(a, b, cin):
        # Somme arithmétique
        somme_arith = a + b + cin
        
        # Simulation logique
        s = (a ^ b) ^ cin  # XOR
        cout = (a and b) or (cin and (a ^ b))
        
        # Vérification
        # Le bit de poids faible de la somme arithmétique doit être S
        assert s == somme_arith % 2
        # Le bit de poids fort (retenue) doit être Cout
        assert cout == somme_arith // 2
        
        return s, cout

    # Test exhaustif
    for a in [0, 1]:
        for b in [0, 1]:
            for cin in [0, 1]:
                additionneur(a, b, cin)
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-7" label="7 - Multiplexeur">
    <Enonce>
    ### Exercice 7 : Multiplexeur

    **Analysez ce multiplexeur 2 vers 1 :**

    Un multiplexeur 2→1 a :
    - Deux entrées de données : `D0`, `D1`
    - Une entrée de sélection : `S`
    - Une sortie : `Y`

    Fonctionnement :
    - Si `S = 0`, alors `Y = D0`
    - Si `S = 1`, alors `Y = D1`

    **Questions :**
    1. Écrivez l'équation booléenne de Y
    2. Construisez la table de vérité
    
    <Correction>
    **1. Équation :**
    `Y = (D0 and not S) or (D1 and S)`

    **2. Table de vérité :**

    | S | D1 | D0 | Y |
    |---|----|----|---|
    | 0 | 0  | 0  | 0 |
    | 0 | 0  | 1  | 1 |
    | 0 | 1  | 0  | 0 |
    | 0 | 1  | 1  | 1 |
    | 1 | 0  | 0  | 0 |
    | 1 | 0  | 1  | 0 |
    | 1 | 1  | 0  | 1 |
    | 1 | 1  | 1  | 1 |
    </Correction>
    </Enonce>
    <Verification>
    ```python
    def mux21(d0, d1, s):
        return (d0 and not s) or (d1 and s)

    # Vérification
    # Si S=0, Y doit valoir D0
    assert mux21(0, 1, 0) == 0
    assert mux21(1, 0, 0) == 1
    
    # Si S=1, Y doit valoir D1
    assert mux21(0, 1, 1) == 1
    assert mux21(1, 0, 1) == 0
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
