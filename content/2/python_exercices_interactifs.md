---
title: 'Exercices : Les listes et les tuples'
description: 'Cours sur Exercices : Les listes et les tuples'
level: premiere
chapter: Structures de données linéaires
icon: "\U0001F5B1️"
badgeId: premiere_fiche_exercices_interactifs
prerequisites:
  - structures_lineaires_tp
---


<ExerciseTabs courseId="listes-tuples-interactif" courseTitle="Listes et Tuples">

  <ExerciseSection id="intro-1" label="1 - Création de tuple">
    <Enonce>
    ### Exercice 1 : Création de tuple
    **Créer un tuple nommé `mon_tuple` contenant les éléments 'a', 'b', 'c', 'd'.**
    **Afficher le contenu du tuple dans le terminal.**
    
    <Correction>
    ```python
    mon_tuple = ('a', 'b', 'c', 'd')
    print(mon_tuple)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'mon_tuple' in locals(), "La variable 'mon_tuple' n'est pas définie."
    assert isinstance(mon_tuple, tuple), "'mon_tuple' doit être un tuple."
    assert mon_tuple == ('a', 'b', 'c', 'd'), "Le contenu du tuple est incorrect."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="intro-2" label="2 - Création de liste">
    <Enonce>
    ### Exercice 2 : Création de liste
    **Créer une liste nommée `ma_liste` contenant les éléments 'a', 'b', 'c', 'd'.**
    **Afficher le contenu de la liste dans le terminal.**
    
    <Correction>
    ```python
    ma_liste = ['a', 'b', 'c', 'd']
    print(ma_liste)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'ma_liste' in locals(), "La variable 'ma_liste' n'est pas définie."
    assert isinstance(ma_liste, list), "'ma_liste' doit être une liste."
    assert ma_liste == ['a', 'b', 'c', 'd'], "Le contenu de la liste est incorrect."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="intro-3" label="3 - Modification">
    <Enonce>
    ### Exercice 3 : Modification d'éléments
    **Modifier le deuxième élément de `ma_liste` par 'z'.**
    **Vérifier la modification en affichant la liste dans le terminal.**
    
    <Correction>
    ```python
    ma_liste[1] = 'z'
    print(ma_liste)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'ma_liste' in locals(), "La variable 'ma_liste' n'est pas définie."
    assert ma_liste[1] == 'z', "Le deuxième élément devrait être 'z'."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="intro-4" label="4 - Ajout et suppression">
    <Enonce>
    ### Exercice 4 : Ajout et suppression
    **1. Ajouter l'élément 'f' dans `ma_liste`.**
    **2. Supprimer le premier élément de `ma_liste`.**
    **Vérifier les modifications en affichant la liste dans le terminal.**
    
    <Correction>
    ```python
    ma_liste.append('f')
    ma_liste.pop(0)
    print(ma_liste)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'ma_liste' in locals(), "La variable 'ma_liste' n'est pas définie."
    assert 'f' in ma_liste, "'f' devrait être dans la liste."
    assert ma_liste[0] != 'a', "Le premier élément 'a' devrait être supprimé."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="easy-1" label="Easy 1 - Somme">
    <Enonce>
    ### Exercice Easy 1 : Somme d'éléments
    **Écrire une fonction `somme_elements` qui prend une liste de nombres en paramètres et renvoie la somme de tous les éléments.**
    
    *Exemple : `somme_elements([1, 2, 3, 4])` doit renvoyer 10.*
    
    <Correction>
    ```python
    def somme_elements(liste: list) -> int:
        somme = 0
        for elt in liste:
            somme = somme + elt
        return somme
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert somme_elements([1, 2, 3, 4]) == 10, "La somme de [1,2,3,4] doit être 10."
    assert somme_elements([]) == 0, "La somme d'une liste vide doit être 0."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="easy-2" label="Easy 2 - Compter pairs">
    <Enonce>
    ### Exercice Easy 2 : Compter les nombres pairs
    **Écrire une fonction `compter_pairs` qui prend une liste d'entiers et renvoie le nombre d'éléments pairs dans cette liste.**
    
    <Correction>
    ```python
    def compter_pairs(liste: list) -> int:
        nombre_pairs = 0
        for elt in liste:
            if elt % 2 == 0:
                nombre_pairs = nombre_pairs + 1
        return nombre_pairs
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert compter_pairs([1, 2, 3, 4, 5]) == 2, "Il y a 2 nombres pairs dans [1,2,3,4,5]."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-1" label="Med 1 - Filtrer positifs">
    <Enonce>
    ### Exercice Med 1 : Filtrer les nombres positifs
    **Écrire une fonction `filtrer_positifs` qui prend une liste de nombres et renvoie une nouvelle liste contenant uniquement les nombres strictement positifs.**
    
    <Correction>
    ```python
    def filtrer_positifs(liste: list) -> list:
        positifs = []
        for elt in liste:
            if elt > 0:
                positifs.append(elt)
        return positifs
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert filtrer_positifs([-1, 0, 3, -7, 8]) == [3, 8], "Le résultat pour [-1, 0, 3, -7, 8] doit être [3, 8]."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-2" label="Med 2 - Valeurs uniques">
    <Enonce>
    ### Exercice Med 2 : Valeurs uniques
    **Écrire une fonction `valeurs_uniques` qui prend une liste et renvoie une nouvelle liste contenant les éléments sans doublons (dans l'ordre d'apparition).**
    
    <Correction>
    ```python
    def valeurs_uniques(liste: list) -> list:
        liste_valeurs = []
        for elt in liste:
            if elt not in liste_valeurs:
                liste_valeurs.append(elt)
        return liste_valeurs
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert valeurs_uniques([1, 2, 2, 3, 4, 4]) == [1, 2, 3, 4], "Les doublons doivent être supprimés."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-3" label="Med 3 - Concaténation">
    <Enonce>
    ### Exercice Med 3 : Concaténer des chaînes
    **Écrire une fonction `concatener_chaines` qui prend une liste de chaînes de caractères et renvoie une seule chaîne qui est la concaténation de toutes les chaînes de la liste.**
    
    <Correction>
    ```python
    def concatener_chaines(liste: list) -> str:
        concatenation = ""
        for chaine in liste:
            concatenation = concatenation + chaine
        return concatenation
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert concatener_chaines(["Bonjour", " ", "le", " ", "monde"]) == "Bonjour le monde"
    assert concatener_chaines(["a", "b", "c"]) == "abc"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-4" label="Med 4 - Inverser">
    <Enonce>
    ### Exercice Med 4 : Inverser une liste
    **Écrire une fonction `inverser_liste` qui prend une liste et renvoie une nouvelle liste avec les éléments dans l'ordre inverse.**
    
    <Correction>
    ```python
    def inverser_liste(liste: list) -> list:
        liste_inversee = []
        for i in range(len(liste)-1, -1, -1):
            liste_inversee.append(liste[i])
        return liste_inversee
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert inverser_liste([1, 2, 3]) == [3, 2, 1]
    assert inverser_liste([]) == []
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-5" label="Med 5 - Pairs/Impairs">
    <Enonce>
    ### Exercice Med 5 : Séparer pairs et impairs
    **Écrire une fonction `separer_pairs_impairs` qui prend une liste d'entiers et renvoie deux listes : une avec les éléments pairs et une autre avec les éléments impairs.**
    
    <Correction>
    ```python
    def separer_pairs_impairs(liste: list) -> tuple:
        pairs = []
        impairs = []
        for elt in liste:
            if elt % 2 == 0:
                pairs.append(elt)
            else:
                impairs.append(elt)
        return pairs, impairs
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert separer_pairs_impairs([1, 2, 3, 4, 5]) == ([2, 4], [1, 3, 5])
    assert separer_pairs_impairs([1, 3, 5]) == ([], [1, 3, 5])
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-6" label="Med 6 - Diviseurs">
    <Enonce>
    ### Exercice Med 6 : Recherche des diviseurs
    **Écrire une fonction `diviseurs` qui prend un entier en paramètre et renvoie la liste de ses diviseurs.**
    
    <Correction>
    ```python
    def diviseurs(valeur: int) -> list:
        diviseurs = []
        for i in range(1, valeur+1):
            if valeur % i == 0:
                diviseurs.append(i)
        return diviseurs
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert diviseurs(6) == [1, 2, 3, 6]
    assert diviseurs(10) == [1, 2, 5, 10]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-7" label="Med 7 - Croissante">
    <Enonce>
    ### Exercice Med 7 : Liste croissante
    **Écrire une fonction `est_croissante` qui prend une liste d'entiers en paramètre et renvoie True si les éléments de la liste sont dans l'ordre croissant, False sinon.**
    
    <Correction>
    ```python
    def est_croissante(liste: list) -> bool:
        i = 0
        while i < len(liste) - 1 and liste[i] <= liste[i+1]:
            i = i + 1
        return i == len(liste)-1
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert est_croissante([1, 2, 3, 4]) == True
    assert est_croissante([1, 3, 2, 4]) == False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-8" label="Med 8 - Échange">
    <Enonce>
    ### Exercice Med 8 : Échange de valeurs
    **Écrire une fonction `echange` qui prend en paramètres une liste et deux indices, et échange les valeurs aux positions i et j dans la liste passée en paramètres. (La fonction modifie la liste en place et ne renvoie rien)**
    
    <Correction>
    ```python
    def echange(liste: list, i: int, j: int) -> None:
        liste[i], liste[j] = liste[j], liste[i]
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    l = [1, 2, 3, 4]
    echange(l, 1, 2)
    assert l == [1, 3, 2, 4]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="medium-9" label="Med 9 - Rangement">
    <Enonce>
    ### Exercice Med 9 : Rangement de valeurs
    **Écrire une fonction `rangement_valeurs` qui prend en paramètre une liste et un élément, et renvoie 3 listes : une liste contenant les valeurs inférieures à l'élément, une liste avec l'élément si présent, et une liste avec les valeurs supérieures.**
    
    <Correction>
    ```python
    def rangement_valeurs(liste: list, valeur: int) -> tuple:
        inferieures = []
        egales = []
        superieures = []
        for elt in liste:
            if elt > valeur:
                superieures.append(elt)
            elif elt == valeur:
                egales.append(elt)
            else:
                inferieures.append(elt)
        return inferieures, egales, superieures
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert rangement_valeurs([1, 7, 4, 3, 6, 2, 8], 5) == ([1, 4, 3, 2], [], [7, 6, 8])
    assert rangement_valeurs([1, 2, 4, 3, 6, 2, 8], 2) == ([1], [2, 2], [4, 3, 6, 8])
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="important-1" label="Imp 1 - Présence">
    <Enonce>
    ### Exercice Imp 1 : Recherche d'un élément
    **Écrire une fonction `presence` qui prend en paramètre une valeur et une liste et renvoie `True` si la valeur demandée est dans la liste, `False` sinon.**
    
    <Correction>
    ```python
    def presence(valeur: int, liste: list) -> bool:
        present = False
        for elt in liste:
            if elt == valeur:
                present = True
        return present
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert presence(3, [1, 2, 3, 4]) == True
    assert presence(5, [1, 2, 3, 4]) == False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="important-2" label="Imp 2 - Minimum">
    <Enonce>
    ### Exercice Imp 2 : Minimum d'une liste
    **Écrire une fonction `minimum` qui prend en paramètre une liste et renvoie la valeur minimale dans la liste.**
    
    <Correction>
    ```python
    def minimum(liste: list) -> int:
        mini = liste[0]
        for elt in liste:
            if elt < mini:
                mini = elt
        return mini
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert minimum([3, 1, 9, 2]) == 1
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="important-3" label="Imp 3 - Maximum">
    <Enonce>
    ### Exercice Imp 3 : Maximum d'une liste
    **Écrire une fonction `maximum` qui prend en paramètre une liste et renvoie la valeur maximale dans la liste.**
    
    <Correction>
    ```python
    def maximum(liste: list) -> int:
        maxi = liste[0]
        for elt in liste:
            if elt > maxi:
                maxi = elt
        return maxi
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert maximum([3, 1, 9, 2]) == 9
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="hard-1" label="Hard 1 - Voyelles">
    <Enonce>
    ### Exercice Hard 1 : Compteur de voyelles
    **Écrire une fonction `compter_voyelles` qui prend une liste de chaînes de caractères et renvoie le nombre total de voyelles présentes dans toutes les chaînes.**
    
    <Correction>
    ```python
    def compter_voyelles(liste: list) -> int:
        voyelles = "aeiouyAEIOUY"
        nombre_voyelles = 0
        for mot in liste:
            for lettre in mot:
                if lettre in voyelles:
                    nombre_voyelles += 1
        return nombre_voyelles
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert compter_voyelles(["chat", "chien"]) == 3
    assert compter_voyelles(["bonjour", "python"]) == 4
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="hard-2" label="Hard 2 - Doublons">
    <Enonce>
    ### Exercice Hard 2 : Éléments en double
    **Écrire une fonction `valeurs_en_double` qui prend une liste et renvoie une nouvelle liste contenant uniquement les éléments qui apparaissent plus d'une fois (sans répétitions supplémentaires).**
    
    <Correction>
    ```python
    def valeurs_en_double(liste: list) -> list:
        doublons = []
        deja_vus = []
        for elt in liste:
            if elt in deja_vus and elt not in doublons:
                doublons.append(elt)
            else:
                deja_vus.append(elt)
        return doublons
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert sorted(valeurs_en_double([1, 2, 2, 3, 4, 4, 5])) == [2, 4]
    assert sorted(valeurs_en_double(["a", "b", "a", "c", "b", "d"])) == ["a", "b"]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="hard-3" label="Hard 3 - Indice">
    <Enonce>
    ### Exercice Hard 3 : Recherche d'indice
    **Écrire une fonction `indice_element` qui prend une liste et un élément, et renvoie l'indice de la première occurrence de cet élément dans la liste, ou -1 s'il n'est pas présent.**
    
    <Correction>
    ```python
    def indice_element(liste: list, valeur: int) -> int:
        i = 0
        while i < len(liste) and liste[i] != valeur:
            i += 1
        if i == len(liste):
            return -1
        return i
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert indice_element([10, 20, 30], 20) == 1
    assert indice_element([10, 20, 30], 40) == -1
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="hard-4" label="Hard 4 - Fusion">
    <Enonce>
    ### Exercice Hard 4 : Fusion sans doublons
    **Écrire une fonction `fusionner_sans_doublons` qui prend en paramètres deux listes et renvoie une nouvelle liste contenant tous les éléments des deux listes sans doublons.**
    
    <Correction>
    ```python
    def fusionner_sans_doublons(liste1: list, liste2: list) -> list:
        resultat = []
        for elt in liste1:
            if elt not in resultat:
                resultat.append(elt)
        for elt in liste2:
            if elt not in resultat:
                resultat.append(elt)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert sorted(fusionner_sans_doublons([1, 2, 3], [2, 3, 4])) == [1, 2, 3, 4]
    assert sorted(fusionner_sans_doublons(['a', 'b'], ['b', 'c', 'a'])) == ['a', 'b', 'c']
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>

</ExerciseTabs>
