---
title: 'Exercices : Listes et tuples'
description: 'Cours sur Exercices : Listes et tuples'
level: premiere
chapter: Structures de données linéaires
icon: "\U0001F4DD"
badgeId: premiere_fiche_exercices_papier
prerequisites:
  - python_exercices_interactifs
---


<ExerciseTabs courseId="listes-tuples" courseTitle="Listes et tuples">

  <ExerciseSection id="exo-1-1" label="1.1 - Création de tuple">
    <Enonce>
    ### Exercice 1.1 : Création de tuple
    **Créer un tuple nommé `mon_tuple` contenant les éléments suivants : `"pomme"`, `"banane"`, `"cerise"`.**
    
    <Correction>
    ```python
    mon_tuple = ("pomme", "banane", "cerise")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'mon_tuple' in locals(), "La variable 'mon_tuple' n'est pas définie."
    assert isinstance(mon_tuple, tuple), "'mon_tuple' doit être un tuple."
    assert mon_tuple == ("pomme", "banane", "cerise"), "Le contenu du tuple est incorrect."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-1-2" label="1.2 - Accès élément tuple">
    <Enonce>
    ### Exercice 1.2 : Accès à un élément
    **Afficher l'élément à l'indice 1 du tuple `mon_tuple`.**
    
    *Pour la vérification, stockez le résultat dans une variable `element_1`.*
    
    <Correction>
    ```python
    element_1 = mon_tuple[1]
    print(element_1)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'mon_tuple' in locals(), "Veuillez d'abord définir 'mon_tuple'."
    assert 'element_1' in locals(), "La variable 'element_1' n'est pas définie."
    assert element_1 == mon_tuple[1], "La variable 'element_1' ne contient pas la bonne valeur."
    assert element_1 == "banane", "L'élément à l'indice 1 devrait être 'banane'."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-2-1" label="2.1 - Création de liste">
    <Enonce>
    ### Exercice 2.1 : Création de liste
    **Créer une liste nommée `ma_liste` avec les éléments suivants : `"chien"`, `"chat"`, `"lapin"`.**
    
    <Correction>
    ```python
    ma_liste = ["chien", "chat", "lapin"]
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'ma_liste' in locals(), "La variable 'ma_liste' n'est pas définie."
    assert isinstance(ma_liste, list), "'ma_liste' doit être une liste."
    assert ma_liste == ["chien", "chat", "lapin"], "Le contenu de la liste est incorrect."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-2-2" label="2.2 - Accès élément liste">
    <Enonce>
    ### Exercice 2.2 : Accès à un élément
    **Afficher l'élément à l'indice 2 de la liste `ma_liste`.**
    
    *Pour la vérification, stockez le résultat dans une variable `element_2`.*
    
    <Correction>
    ```python
    element_2 = ma_liste[2]
    print(element_2)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'ma_liste' in locals(), "Veuillez d'abord définir 'ma_liste'."
    assert 'element_2' in locals(), "La variable 'element_2' n'est pas définie."
    assert element_2 == ma_liste[2], "La variable 'element_2' ne contient pas la bonne valeur."
    assert element_2 == "lapin", "L'élément à l'indice 2 devrait être 'lapin'."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-2-3" label="2.3 - Modification liste">
    <Enonce>
    ### Exercice 2.3 : Modification d'un élément
    **Remplacer l'élément `"lapin"` par `"hamster"` dans `ma_liste`. Afficher la liste mise à jour.**
    
    <Correction>
    ```python
    ma_liste[2] = "hamster"
    print(ma_liste)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'ma_liste' in locals(), "La variable 'ma_liste' n'est pas définie."
    assert ma_liste[2] == "hamster", "Le 3ème élément devrait être 'hamster'."
    assert len(ma_liste) == 3, "La taille de la liste ne devrait pas changer."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-2-4" label="2.4 - Ajout élément">
    <Enonce>
    ### Exercice 2.4 : Ajout d'un élément
    **Ajouter l'élément `"oiseau"` à la fin de la liste `ma_liste`. Afficher la liste.**
    
    <Correction>
    ```python
    ma_liste.append("oiseau")
    print(ma_liste)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'ma_liste' in locals(), "La variable 'ma_liste' n'est pas définie."
    assert ma_liste[-1] == "oiseau", "Le dernier élément devrait être 'oiseau'."
    assert len(ma_liste) == 4, "La liste devrait contenir 4 éléments."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-2-5" label="2.5 - Ajout multiple">
    <Enonce>
    ### Exercice 2.5 : Ajout de plusieurs éléments
    **Ajouter les éléments `"poisson"` et `"tortue"` à la liste en une seule opération (concaténation).**
    
    <Correction>
    ```python
    ma_liste = ma_liste + ["poisson", "tortue"]
    # Ou
    ma_liste.extend(["poisson", "tortue"])
    print(ma_liste)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'ma_liste' in locals(), "La variable 'ma_liste' n'est pas définie."
    assert "poisson" in ma_liste, "'poisson' devrait être dans la liste."
    assert "tortue" in ma_liste, "'tortue' devrait être dans la liste."
    assert len(ma_liste) >= 6, "La liste devrait contenir au moins 6 éléments."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-3-1" label="3.1 - Création liste nombres">
    <Enonce>
    ### Exercice 3.1 : Liste de nombres
    **Créer une liste de nombres `nombres` contenant : `3, 8, 12, 5, 10`.**
    
    <Correction>
    ```python
    nombres = [3, 8, 12, 5, 10]
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'nombres' in locals(), "La variable 'nombres' n'est pas définie."
    assert nombres == [3, 8, 12, 5, 10], "La liste 'nombres' est incorrecte."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-3-2" label="3.2 - Premier et dernier">
    <Enonce>
    ### Exercice 3.2 : Premier et dernier élément
    **Afficher le premier et le dernier élément de la liste `nombres` en utilisant les indices.**
    
    *Stockez le premier élément dans `premier` et le dernier dans `dernier`.*
    
    <Correction>
    ```python
    premier = nombres[0]
    dernier = nombres[-1]
    print(premier, dernier)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'nombres' in locals(), "Veuillez d'abord définir 'nombres'."
    assert 'premier' in locals(), "La variable 'premier' n'est pas définie."
    assert 'dernier' in locals(), "La variable 'dernier' n'est pas définie."
    assert premier == 3, "Le premier élément devrait être 3."
    assert dernier == 10, "Le dernier élément devrait être 10."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-3-3" label="3.3 - Parcours liste">
    <Enonce>
    ### Exercice 3.3 : Parcours avec indices
    **Utiliser une boucle pour afficher tous les éléments de la liste `nombres` avec leur indice correspondant.**
    
    <Correction>
    ```python
    for i in range(len(nombres)):
        print(f"Indice {i} : {nombres[i]}")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'nombres' in locals(), "La variable 'nombres' n'est pas définie."
    # Pas de vérification stricte pour l'affichage, on vérifie juste que la liste existe.
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-3-4" label="3.4 - Ajout fin">
    <Enonce>
    ### Exercice 3.4 : Ajout à la fin
    **Ajouter le nombre `15` à la fin de la liste `nombres`, puis afficher la liste.**
    
    <Correction>
    ```python
    nombres.append(15)
    print(nombres)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'nombres' in locals(), "La variable 'nombres' n'est pas définie."
    assert nombres[-1] == 15, "Le dernier élément devrait être 15."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-3-5" label="3.5 - Insertion">
    <Enonce>
    ### Exercice 3.5 : Insertion
    **Insérer le nombre `7` à l'indice 1 dans `nombres`. Afficher la nouvelle liste.**
    
    <Correction>
    ```python
    nombres.insert(1, 7)
    print(nombres)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'nombres' in locals(), "La variable 'nombres' n'est pas définie."
    assert nombres[1] == 7, "L'élément à l'indice 1 devrait être 7."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-3-6" label="3.6 - Suppression">
    <Enonce>
    ### Exercice 3.6 : Suppression
    **Supprimer l'élément à l'indice 3 de la liste `nombres`. Afficher la liste mise à jour.**
    
    <Correction>
    ```python
    del nombres[3]
    # Ou
    nombres.pop(3)
    print(nombres)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'nombres' in locals(), "La variable 'nombres' n'est pas définie."
    # La liste initiale était [3, 8, 12, 5, 10]
    # + 15 -> [3, 8, 12, 5, 10, 15]
    # insert 7 à 1 -> [3, 7, 8, 12, 5, 10, 15]
    # del 3 (valeur 12) -> [3, 7, 8, 5, 10, 15]
    assert 12 not in nombres, "L'élément 12 devrait avoir été supprimé."
    assert nombres[3] == 5, "Le nouvel élément à l'indice 3 devrait être 5."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-4-1" label="4.1 - Concaténation">
    <Enonce>
    ### Exercice 4.1 : Concaténation
    **1. Créer deux listes : `liste_A = ["rouge", "bleu", "vert"]` et `liste_B = ["jaune", "noir"]`.**
    **2. Concaténer les deux listes pour obtenir une nouvelle liste appelée `liste_C`. L'afficher.**
    
    <Correction>
    ```python
    liste_A = ["rouge", "bleu", "vert"]
    liste_B = ["jaune", "noir"]
    liste_C = liste_A + liste_B
    print(liste_C)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'liste_A' in locals() and 'liste_B' in locals(), "Les listes A et B doivent être définies."
    assert 'liste_C' in locals(), "La liste C n'est pas définie."
    assert liste_C == ["rouge", "bleu", "vert", "jaune", "noir"], "La liste C est incorrecte."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-4-3" label="4.3 - Répétition">
    <Enonce>
    ### Exercice 4.3 : Répétition
    **Multiplier la liste `liste_A` par 2 pour obtenir une liste répétée deux fois. Afficher le résultat.**
    
    *Stockez le résultat dans `liste_A_repetee`.*
    
    <Correction>
    ```python
    liste_A_repetee = liste_A * 2
    print(liste_A_repetee)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'liste_A' in locals(), "La variable 'liste_A' n'est pas définie."
    assert 'liste_A_repetee' in locals(), "La variable 'liste_A_repetee' n'est pas définie."
    assert liste_A_repetee == ["rouge", "bleu", "vert", "rouge", "bleu", "vert"], "La liste répétée est incorrecte."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
