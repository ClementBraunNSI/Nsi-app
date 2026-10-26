---
title: 'Exercices : Listes et tuples'
description: "Fiche d'exercices papier sur les listes et tuples"
level: premiere
chapter: Structures de données linéaires
icon: "notebook-pen"
badgeId: premiere_fiche_exercices_papier
prerequisites:
  - python_exercices_listes
audience: public
---


<ExerciseTabs courseId="listes-tuples" courseTitle="Listes et tuples">

  <ExerciseSection id="exo-1-1" label="1.1 - Création de tuple" type="python">
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

  <ExerciseSection id="exo-1-2" label="1.2 - Accès élément tuple" type="python">
    <CodeDepart>
    ```python
    mon_tuple = ("pomme", "banane", "cerise")
    ```
    </CodeDepart>
    <Enonce>
    ### Exercice 1.2 : Accès à un élément
    **Afficher l'élément à l'indice 1 du tuple `mon_tuple`.**
    
    *Pour la vérification, stocker le résultat dans une variable `element_1`.*
    
    <Correction>
    ```python
    element_1 = mon_tuple[1]
    print(element_1)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'element_1' in globals(), "La variable 'element_1' n'est pas définie."
    assert element_1 == "banane", "L'élément à l'indice 1 de mon_tuple est 'banane'."
    assert "banane" in SORTIE, "Le programme doit afficher l'élément trouvé."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-2-1" label="2.1 - Création de liste" type="python">
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

  <ExerciseSection id="exo-2-2" label="2.2 - Accès élément liste" type="python">
    <CodeDepart>
    ```python
    ma_liste = ["chien", "chat", "lapin"]
    ```
    </CodeDepart>
    <Enonce>
    ### Exercice 2.2 : Accès à un élément
    **Afficher l'élément à l'indice 2 de la liste `ma_liste`.**
    
    *Pour la vérification, stocker le résultat dans une variable `element_2`.*
    
    <Correction>
    ```python
    element_2 = ma_liste[2]
    print(element_2)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'element_2' in globals(), "La variable 'element_2' n'est pas définie."
    assert element_2 == "lapin", "L'élément à l'indice 2 de ma_liste est 'lapin'."
    assert "lapin" in SORTIE, "Le programme doit afficher l'élément trouvé."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-2-3" label="2.3 - Modification liste" type="python">
    <CodeDepart>
    ```python
    ma_liste = ["chien", "chat", "lapin"]
    ```
    </CodeDepart>
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
    assert ma_liste == ["chien", "chat", "hamster"], "ma_liste doit valoir ['chien', 'chat', 'hamster']."
    assert "hamster" in SORTIE, "Le programme doit afficher la liste mise à jour."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-2-4" label="2.4 - Ajout élément" type="python">
    <CodeDepart>
    ```python
    ma_liste = ["chien", "chat", "hamster"]
    ```
    </CodeDepart>
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
    assert ma_liste == ["chien", "chat", "hamster", "oiseau"], "ma_liste doit valoir ['chien', 'chat', 'hamster', 'oiseau']."
    assert "oiseau" in SORTIE, "Le programme doit afficher la liste."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-2-5" label="2.5 - Ajout multiple" type="python">
    <CodeDepart>
    ```python
    ma_liste = ["chien", "chat", "hamster", "oiseau"]
    ```
    </CodeDepart>
    <Enonce>
    ### Exercice 2.5 : Ajout de plusieurs éléments
    **Ajouter les éléments `"poisson"` et `"tortue"` à la liste en une seule opération (concaténation).**

    <Correction>
    ```python
    ma_liste = ma_liste + ["poisson", "tortue"]
    print(ma_liste)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert ma_liste == ["chien", "chat", "hamster", "oiseau", "poisson", "tortue"], "ma_liste doit se terminer par 'poisson' puis 'tortue', une seule fois chacun."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-3-1" label="3.1 - Création liste nombres" type="python">
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

  <ExerciseSection id="exo-3-2" label="3.2 - Premier et dernier" type="python">
    <CodeDepart>
    ```python
    nombres = [3, 8, 12, 5, 10]
    ```
    </CodeDepart>
    <Enonce>
    ### Exercice 3.2 : Premier et dernier élément
    **Afficher le premier et le dernier élément de la liste `nombres` en utilisant les indices.**
    
    *Stocker le premier élément dans `premier` et le dernier dans `dernier`.*
    
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
    assert 'premier' in globals(), "La variable 'premier' n'est pas définie."
    assert 'dernier' in globals(), "La variable 'dernier' n'est pas définie."
    assert premier == 3, "Le premier élément de nombres est 3."
    assert dernier == 10, "Le dernier élément de nombres est 10."
    assert "3" in SORTIE and "10" in SORTIE, "Le programme doit afficher le premier et le dernier élément."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-3-3" label="3.3 - Parcours liste" type="python">
    <CodeDepart>
    ```python
    nombres = [3, 8, 12, 5, 10]
    ```
    </CodeDepart>
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
    lignes = [l for l in SORTIE.strip().splitlines() if l.strip()]
    assert len(lignes) == 5, "Le programme doit afficher une ligne par élément : 5 lignes."
    assert all(str(i) in lignes[i] and str(v) in lignes[i] for i, v in enumerate([3, 8, 12, 5, 10])), "Chaque ligne doit contenir l'indice et l'élément : 0 et 3, puis 1 et 8, etc."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-3-4" label="3.4 - Ajout fin" type="python">
    <CodeDepart>
    ```python
    nombres = [3, 8, 12, 5, 10]
    ```
    </CodeDepart>
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
    assert nombres == [3, 8, 12, 5, 10, 15], "nombres doit valoir [3, 8, 12, 5, 10, 15]."
    assert "15" in SORTIE, "Le programme doit afficher la liste."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-3-5" label="3.5 - Insertion" type="python">
    <CodeDepart>
    ```python
    nombres = [3, 8, 12, 5, 10, 15]
    ```
    </CodeDepart>
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
    assert nombres == [3, 7, 8, 12, 5, 10, 15], "nombres doit valoir [3, 7, 8, 12, 5, 10, 15]."
    assert "7" in SORTIE, "Le programme doit afficher la nouvelle liste."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-3-6" label="3.6 - Suppression" type="python">
    <CodeDepart>
    ```python
    nombres = [3, 7, 8, 12, 5, 10, 15]
    ```
    </CodeDepart>
    <Enonce>
    ### Exercice 3.6 : Suppression
    **Supprimer l'élément à l'indice 3 de la liste `nombres`. Afficher la liste mise à jour.**

    <Correction>
    ```python
    del nombres[3]
    print(nombres)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert nombres == [3, 7, 8, 5, 10, 15], "Après suppression de l'indice 3, nombres doit valoir [3, 7, 8, 5, 10, 15]."
    assert "[3, 7, 8, 5, 10, 15]" in SORTIE, "Le programme doit afficher la liste mise à jour."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-4-1" label="4.1 - Concaténation" type="python">
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

  <ExerciseSection id="exo-4-3" label="4.3 - Répétition" type="python">
    <CodeDepart>
    ```python
    liste_A = ["rouge", "bleu", "vert"]
    liste_B = ["jaune", "noir"]
    ```
    </CodeDepart>
    <Enonce>
    ### Exercice 4.3 : Répétition
    **Multiplier la liste `liste_A` par 2 pour obtenir une liste répétée deux fois. Afficher le résultat.**
    
    *Stocker le résultat dans `liste_A_repetee`.*
    
    <Correction>
    ```python
    liste_A_repetee = liste_A * 2
    print(liste_A_repetee)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'liste_A_repetee' in globals(), "La variable 'liste_A_repetee' n'est pas définie."
    assert liste_A_repetee == ["rouge", "bleu", "vert", "rouge", "bleu", "vert"], "liste_A * 2 répète la liste deux fois."
    assert liste_A == ["rouge", "bleu", "vert"], "liste_A ne doit pas être modifiée."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
