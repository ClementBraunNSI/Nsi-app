---
title: 'Exercices : Les listes'
description: 'Création, parcours, modification et algorithmes sur les listes — fiche progressive par niveau.'
icon: "\U0001F5B1️"
chapter: Structures de données linéaires
badgeId: premiere_exercices_listes
meta: 'Listes Python : indices, parcours, méthodes et algorithmes'
level: premiere
prerequisites:
  - python_exercices_fonctions
---

<ExerciseTabs courseId="les-listes-python" courseTitle="Les listes">

  {/* ========================================== */}
  {/* CATÉGORIE 1 : INTRODUCTION (1.1 à 1.6)      */}
  {/* ========================================== */}

  <ExerciseSection id="listes-1-1" label="1.1 [Introduction] - Création d'un tuple">
    <Enonce>
    ### Exercice 1.1 [Introduction] : Création d'un tuple
    **Écrire une fonction `creer_tuple` qui renvoie le tuple `('a', 'b', 'c', 'd')`.**

    <Correction>
    ```python
    def creer_tuple() -> tuple:
        return ('a', 'b', 'c', 'd')
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'creer_tuple' in locals(), "La fonction 'creer_tuple' n'est pas définie."
assert creer_tuple() == ('a', 'b', 'c', 'd')
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-1-2" label="1.2 [Introduction] - Création d'une liste">
    <Enonce>
    ### Exercice 1.2 [Introduction] : Création d'une liste
    **Écrire une fonction `creer_liste` qui renvoie la liste `['a', 'b', 'c', 'd']`.**

    <Correction>
    ```python
    def creer_liste() -> list:
        return ['a', 'b', 'c', 'd']
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'creer_liste' in locals(), "La fonction 'creer_liste' n'est pas définie."
assert creer_liste() == ['a', 'b', 'c', 'd']
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-1-3" label="1.3 [Introduction] - Accès par indice">
    <Enonce>
    ### Exercice 1.3 [Introduction] : Accès par indice
    **Écrire une fonction `deuxieme_element` qui prend une liste non vide et renvoie son deuxième élément (indice 1).**

    <Correction>
    ```python
    def deuxieme_element(liste: list):
        return liste[1]
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'deuxieme_element' in locals(), "La fonction 'deuxieme_element' n'est pas définie."
assert deuxieme_element(['x', 'y', 'z']) == 'y'
assert deuxieme_element([10, 20, 30]) == 20
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-1-4" label="1.4 [Introduction] - Modifier un élément">
    <Enonce>
    ### Exercice 1.4 [Introduction] : Modifier un élément
    **Écrire une fonction `remplacer_deuxieme` qui prend une liste et une valeur `nouveau`, remplace le deuxième élément par `nouveau`, et renvoie la liste modifiée.**

    <Correction>
    ```python
    def remplacer_deuxieme(liste: list, nouveau) -> list:
        liste[1] = nouveau
        return liste
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'remplacer_deuxieme' in locals(), "La fonction 'remplacer_deuxieme' n'est pas définie."
assert remplacer_deuxieme(['a', 'b', 'c'], 'z') == ['a', 'z', 'c']
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-1-5" label="1.5 [Introduction] - Ajouter à la fin">
    <Enonce>
    ### Exercice 1.5 [Introduction] : Ajouter à la fin
    **Écrire une fonction `ajouter_fin` qui prend une liste et une valeur, ajoute la valeur à la fin avec `.append()`, et renvoie la liste.**

    <Correction>
    ```python
    def ajouter_fin(liste: list, valeur) -> list:
        liste.append(valeur)
        return liste
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'ajouter_fin' in locals(), "La fonction 'ajouter_fin' n'est pas définie."
assert ajouter_fin(['a', 'b'], 'f') == ['a', 'b', 'f']
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-1-6" label="1.6 [Introduction] - Supprimer le premier">
    <Enonce>
    ### Exercice 1.6 [Introduction] : Supprimer le premier
    **Écrire une fonction `supprimer_premier` qui prend une liste non vide, supprime son premier élément avec `.pop(0)`, et renvoie la liste.**

    <Correction>
    ```python
    def supprimer_premier(liste: list) -> list:
        liste.pop(0)
        return liste
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'supprimer_premier' in locals(), "La fonction 'supprimer_premier' n'est pas définie."
assert supprimer_premier(['a', 'b', 'c']) == ['b', 'c']
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 2 : FACILE (2.1 à 2.6)            */}
  {/* ========================================== */}

  <ExerciseSection id="listes-2-1" label="2.1 [Facile] - Somme des éléments">
    <Enonce>
    ### Exercice 2.1 [Facile] : Somme des éléments
    **Écrire une fonction `somme_elements` qui prend une liste de nombres et renvoie la somme de tous ses éléments (boucle `for`).**

    <Correction>
    ```python
    def somme_elements(liste: list) -> int:
        somme = 0
        for elt in liste:
            somme += elt
        return somme
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'somme_elements' in locals(), "La fonction 'somme_elements' n'est pas définie."
assert somme_elements([1, 2, 3, 4]) == 10
assert somme_elements([]) == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-2-2" label="2.2 [Facile] - Compter les pairs">
    <Enonce>
    ### Exercice 2.2 [Facile] : Compter les pairs
    **Écrire une fonction `compter_pairs` qui prend une liste d'entiers et renvoie le nombre d'éléments pairs.**

    <Correction>
    ```python
    def compter_pairs(liste: list) -> int:
        compteur = 0
        for elt in liste:
            if elt % 2 == 0:
                compteur += 1
        return compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'compter_pairs' in locals(), "La fonction 'compter_pairs' n'est pas définie."
assert compter_pairs([1, 2, 3, 4, 5]) == 2
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-2-3" label="2.3 [Facile] - Longueur d'une liste">
    <Enonce>
    ### Exercice 2.3 [Facile] : Longueur d'une liste
    **Écrire une fonction `longueur_liste` qui prend une liste et renvoie son nombre d'éléments, sans utiliser `len()`.**

    <Correction>
    ```python
    def longueur_liste(liste: list) -> int:
        compteur = 0
        for _ in liste:
            compteur += 1
        return compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'longueur_liste' in locals(), "La fonction 'longueur_liste' n'est pas définie."
assert longueur_liste([1, 2, 3]) == 3
assert longueur_liste([]) == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-2-4" label="2.4 [Facile] - Dernier élément">
    <Enonce>
    ### Exercice 2.4 [Facile] : Dernier élément
    **Écrire une fonction `dernier_element` qui prend une liste non vide et renvoie son dernier élément, sans utiliser d'indice négatif ni `len()`.**

    <Correction>
    ```python
    def dernier_element(liste: list):
        index = 0
        for _ in liste:
            index += 1
        return liste[index - 1]
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'dernier_element' in locals(), "La fonction 'dernier_element' n'est pas définie."
assert dernier_element([10, 20, 30]) == 30
assert dernier_element(['a']) == 'a'
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-2-5" label="2.5 [Facile] - Présence d'une valeur">
    <Enonce>
    ### Exercice 2.5 [Facile] : Présence d'une valeur
    **Écrire une fonction `contient` qui prend une liste et une valeur, et renvoie `True` si la valeur est présente, `False` sinon (parcours avec boucle, sans `in`).**

    <Correction>
    ```python
    def contient(liste: list, valeur) -> bool:
        for elt in liste:
            if elt == valeur:
                return True
        return False
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'contient' in locals(), "La fonction 'contient' n'est pas définie."
assert contient([1, 2, 3], 2) is True
assert contient([1, 2, 3], 9) is False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-2-6" label="2.6 [Facile] - Doubler les valeurs">
    <Enonce>
    ### Exercice 2.6 [Facile] : Doubler les valeurs
    **Écrire une fonction `doubler_valeurs` qui prend une liste de nombres et renvoie une **nouvelle** liste où chaque élément est multiplié par 2.**

    <Correction>
    ```python
    def doubler_valeurs(liste: list) -> list:
        resultat = []
        for elt in liste:
            resultat.append(elt * 2)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'doubler_valeurs' in locals(), "La fonction 'doubler_valeurs' n'est pas définie."
assert doubler_valeurs([1, 2, 3]) == [2, 4, 6]
assert doubler_valeurs([]) == []
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 3 : MOYEN (3.1 à 3.6)             */}
  {/* ========================================== */}

  <ExerciseSection id="listes-3-1" label="3.1 [Moyen] - Filtrer les positifs">
    <Enonce>
    ### Exercice 3.1 [Moyen] : Filtrer les positifs
    **Écrire une fonction `filtrer_positifs` qui prend une liste de nombres et renvoie une nouvelle liste avec uniquement les nombres strictement positifs.**

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
assert 'filtrer_positifs' in locals(), "La fonction 'filtrer_positifs' n'est pas définie."
assert filtrer_positifs([-1, 0, 3, -7, 8]) == [3, 8]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-3-2" label="3.2 [Moyen] - Valeurs uniques">
    <Enonce>
    ### Exercice 3.2 [Moyen] : Valeurs uniques
    **Écrire une fonction `valeurs_uniques` qui prend une liste et renvoie une nouvelle liste sans doublons, en conservant l'ordre d'apparition.**

    <Correction>
    ```python
    def valeurs_uniques(liste: list) -> list:
        resultat = []
        for elt in liste:
            if elt not in resultat:
                resultat.append(elt)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'valeurs_uniques' in locals(), "La fonction 'valeurs_uniques' n'est pas définie."
assert valeurs_uniques([1, 2, 2, 3, 4, 4]) == [1, 2, 3, 4]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-3-3" label="3.3 [Moyen] - Concaténer des chaînes">
    <Enonce>
    ### Exercice 3.3 [Moyen] : Concaténer des chaînes
    **Écrire une fonction `concatener_chaines` qui prend une liste de chaînes et renvoie leur concaténation.**

    <Correction>
    ```python
    def concatener_chaines(liste: list) -> str:
        resultat = ""
        for chaine in liste:
            resultat += chaine
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'concatener_chaines' in locals(), "La fonction 'concatener_chaines' n'est pas définie."
assert concatener_chaines(["Bonjour", " ", "le", " ", "monde"]) == "Bonjour le monde"
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-3-4" label="3.4 [Moyen] - Inverser une liste">
    <Enonce>
    ### Exercice 3.4 [Moyen] : Inverser une liste
    **Écrire une fonction `inverser_liste` qui prend une liste et renvoie une nouvelle liste avec les éléments dans l'ordre inverse.**

    <Correction>
    ```python
    def inverser_liste(liste: list) -> list:
        resultat = []
        for i in range(len(liste) - 1, -1, -1):
            resultat.append(liste[i])
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'inverser_liste' in locals(), "La fonction 'inverser_liste' n'est pas définie."
assert inverser_liste([1, 2, 3]) == [3, 2, 1]
assert inverser_liste([]) == []
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-3-5" label="3.5 [Moyen] - Séparer pairs et impairs">
    <Enonce>
    ### Exercice 3.5 [Moyen] : Séparer pairs et impairs
    **Écrire une fonction `separer_pairs_impairs` qui prend une liste d'entiers et renvoie un tuple `(pairs, impairs)`.**

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
assert 'separer_pairs_impairs' in locals(), "La fonction 'separer_pairs_impairs' n'est pas définie."
assert separer_pairs_impairs([1, 2, 3, 4, 5]) == ([2, 4], [1, 3, 5])
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-3-6" label="3.6 [Moyen] - Diviseurs">
    <Enonce>
    ### Exercice 3.6 [Moyen] : Diviseurs
    **Écrire une fonction `diviseurs` qui prend un entier positif et renvoie la liste de tous ses diviseurs.**

    <Correction>
    ```python
    def diviseurs(valeur: int) -> list:
        resultat = []
        for i in range(1, valeur + 1):
            if valeur % i == 0:
                resultat.append(i)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'diviseurs' in locals(), "La fonction 'diviseurs' n'est pas définie."
assert diviseurs(6) == [1, 2, 3, 6]
assert diviseurs(10) == [1, 2, 5, 10]
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 4 : AVANCÉ (4.1 à 4.6)            */}
  {/* ========================================== */}

  <ExerciseSection id="listes-4-1" label="4.1 [Avancé] - Liste croissante">
    <Enonce>
    ### Exercice 4.1 [Avancé] : Liste croissante
    **Écrire une fonction `est_croissante` qui prend une liste d'entiers et renvoie `True` si les éléments sont en ordre croissant (non strict), `False` sinon.**

    <Correction>
    ```python
    def est_croissante(liste: list) -> bool:
        for i in range(len(liste) - 1):
            if liste[i] > liste[i + 1]:
                return False
        return True
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'est_croissante' in locals(), "La fonction 'est_croissante' n'est pas définie."
assert est_croissante([1, 2, 3, 4]) is True
assert est_croissante([1, 3, 2, 4]) is False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-4-2" label="4.2 [Avancé] - Échange de valeurs">
    <Enonce>
    ### Exercice 4.2 [Avancé] : Échange de valeurs
    **Écrire une fonction `echange` qui prend une liste et deux indices `i`, `j`, échange les valeurs à ces positions **en place**, et ne renvoie rien (`None`).**

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

  <ExerciseSection id="listes-4-3" label="4.3 [Avancé] - Rangement par rapport à une valeur">
    <Enonce>
    ### Exercice 4.3 [Avancé] : Rangement par rapport à une valeur
    **Écrire une fonction `rangement_valeurs` qui prend une liste et une valeur `seuil`, et renvoie un tuple de trois listes : éléments inférieurs, égaux, supérieurs.**

    <Correction>
    ```python
    def rangement_valeurs(liste: list, seuil: int) -> tuple:
        inferieurs = []
        egaux = []
        superieurs = []
        for elt in liste:
            if elt > seuil:
                superieurs.append(elt)
            elif elt == seuil:
                egaux.append(elt)
            else:
                inferieurs.append(elt)
        return inferieurs, egaux, superieurs
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'rangement_valeurs' in locals(), "La fonction 'rangement_valeurs' n'est pas définie."
assert rangement_valeurs([1, 7, 4, 3, 6, 2, 8], 5) == ([1, 4, 3, 2], [], [7, 6, 8])
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-4-4" label="4.4 [Avancé] - Recherche d'un élément">
    <Enonce>
    ### Exercice 4.4 [Avancé] : Recherche d'un élément
    **Écrire une fonction `presence` qui prend une valeur et une liste, et renvoie `True` si la valeur est dans la liste, `False` sinon (boucle, sans opérateur `in`).**

    <Correction>
    ```python
    def presence(valeur, liste: list) -> bool:
        for elt in liste:
            if elt == valeur:
                return True
        return False
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'presence' in locals(), "La fonction 'presence' n'est pas définie."
assert presence(3, [1, 2, 3, 4]) is True
assert presence(5, [1, 2, 3, 4]) is False
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-4-5" label="4.5 [Avancé] - Minimum">
    <Enonce>
    ### Exercice 4.5 [Avancé] : Minimum d'une liste
    **Écrire une fonction `minimum` qui prend une liste de nombres non vide et renvoie la valeur minimale, sans utiliser `min()`.**

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
assert 'minimum' in locals(), "La fonction 'minimum' n'est pas définie."
assert minimum([3, 1, 9, 2]) == 1
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-4-6" label="4.6 [Avancé] - Maximum">
    <Enonce>
    ### Exercice 4.6 [Avancé] : Maximum d'une liste
    **Écrire une fonction `maximum` qui prend une liste de nombres non vide et renvoie la valeur maximale, sans utiliser `max()`.**

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
assert 'maximum' in locals(), "La fonction 'maximum' n'est pas définie."
assert maximum([3, 1, 9, 2]) == 9
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 5 : DIFFICILE (5.1 à 5.6)         */}
  {/* ========================================== */}

  <ExerciseSection id="listes-5-1" label="5.1 [Difficile] - Voyelles dans des mots">
    <Enonce>
    ### Exercice 5.1 [Difficile] : Voyelles dans des mots
    **Écrire une fonction `compter_voyelles_mots` qui prend une liste de chaînes et renvoie le nombre total de voyelles dans tous les mots.**

    <Correction>
    ```python
    def compter_voyelles_mots(mots: list) -> int:
        voyelles = "aeiouyAEIOUY"
        total = 0
        for mot in mots:
            for lettre in mot:
                if lettre in voyelles:
                    total += 1
        return total
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'compter_voyelles_mots' in locals(), "La fonction 'compter_voyelles_mots' n'est pas définie."
assert compter_voyelles_mots(["chat", "chien"]) == 3
assert compter_voyelles_mots(["bonjour", "python"]) == 4
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-5-2" label="5.2 [Difficile] - Valeurs en double">
    <Enonce>
    ### Exercice 5.2 [Difficile] : Valeurs en double
    **Écrire une fonction `valeurs_en_double` qui prend une liste et renvoie une nouvelle liste des éléments qui apparaissent au moins deux fois (une seule fois chacun dans le résultat).**

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
assert 'valeurs_en_double' in locals(), "La fonction 'valeurs_en_double' n'est pas définie."
assert sorted(valeurs_en_double([1, 2, 2, 3, 4, 4, 5])) == [2, 4]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-5-3" label="5.3 [Difficile] - Indice d'un élément">
    <Enonce>
    ### Exercice 5.3 [Difficile] : Indice d'un élément
    **Écrire une fonction `indice_element` qui prend une liste et une valeur, et renvoie l'indice de la première occurrence, ou `-1` si absente.**

    <Correction>
    ```python
    def indice_element(liste: list, valeur) -> int:
        for i in range(len(liste)):
            if liste[i] == valeur:
                return i
        return -1
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'indice_element' in locals(), "La fonction 'indice_element' n'est pas définie."
assert indice_element([10, 20, 30], 20) == 1
assert indice_element([10, 20, 30], 40) == -1
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-5-4" label="5.4 [Difficile] - Fusion sans doublons">
    <Enonce>
    ### Exercice 5.4 [Difficile] : Fusion sans doublons
    **Écrire une fonction `fusionner_sans_doublons` qui prend deux listes et renvoie une nouvelle liste avec tous les éléments des deux, sans doublons (ordre conservé).**

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
assert 'fusionner_sans_doublons' in locals(), "La fonction 'fusionner_sans_doublons' n'est pas définie."
assert sorted(fusionner_sans_doublons([1, 2, 3], [2, 3, 4])) == [1, 2, 3, 4]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-5-5" label="5.5 [Difficile] - Compter les occurrences">
    <Enonce>
    ### Exercice 5.5 [Difficile] : Compter les occurrences
    **Écrire une fonction `compter_occurrences` qui prend une liste et une valeur, et renvoie combien de fois cette valeur apparaît.**

    <Correction>
    ```python
    def compter_occurrences(liste: list, valeur) -> int:
        compteur = 0
        for elt in liste:
            if elt == valeur:
                compteur += 1
        return compteur
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'compter_occurrences' in locals(), "La fonction 'compter_occurrences' n'est pas définie."
assert compter_occurrences([1, 2, 2, 3, 2], 2) == 3
assert compter_occurrences([1, 2, 3], 9) == 0
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-5-6" label="5.6 [Difficile] - Supprimer une valeur">
    <Enonce>
    ### Exercice 5.6 [Difficile] : Supprimer une valeur
    **Écrire une fonction `supprimer_valeur` qui prend une liste et une valeur, et renvoie une **nouvelle** liste sans aucune occurrence de cette valeur.**

    <Correction>
    ```python
    def supprimer_valeur(liste: list, valeur) -> list:
        resultat = []
        for elt in liste:
            if elt != valeur:
                resultat.append(elt)
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'supprimer_valeur' in locals(), "La fonction 'supprimer_valeur' n'est pas définie."
assert supprimer_valeur([1, 2, 3, 2, 4], 2) == [1, 3, 4]
    ```
    </Verification>
  </ExerciseSection>

  {/* ========================================== */}
  {/* CATÉGORIE 6 : EXPERT (6.1 à 6.3)            */}
  {/* ========================================== */}

  <ExerciseSection id="listes-6-1" label="6.1 [Expert] - Rotation à gauche">
    <Enonce>
    ### Exercice 6.1 [Expert] : Rotation à gauche
    **Écrire une fonction `rotation_gauche` qui prend une liste non vide et renvoie une nouvelle liste où le premier élément est déplacé à la fin.**
    *Exemple : `[1, 2, 3, 4]` → `[2, 3, 4, 1]`.*

    <Correction>
    ```python
    def rotation_gauche(liste: list) -> list:
        if len(liste) == 0:
            return []
        resultat = []
        for i in range(1, len(liste)):
            resultat.append(liste[i])
        resultat.append(liste[0])
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'rotation_gauche' in locals(), "La fonction 'rotation_gauche' n'est pas définie."
assert rotation_gauche([1, 2, 3, 4]) == [2, 3, 4, 1]
assert rotation_gauche([7]) == [7]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-6-2" label="6.2 [Expert] - Fusion de deux listes triées">
    <Enonce>
    ### Exercice 6.2 [Expert] : Fusion de deux listes triées
    **Écrire une fonction `fusion_triee` qui prend deux listes d'entiers déjà triées par ordre croissant et renvoie une nouvelle liste triée contenant tous les éléments, sans utiliser `sort()` ni `sorted()`.**

    <Correction>
    ```python
    def fusion_triee(liste1: list, liste2: list) -> list:
        resultat = []
        i = 0
        j = 0
        while i < len(liste1) and j < len(liste2):
            if liste1[i] <= liste2[j]:
                resultat.append(liste1[i])
                i += 1
            else:
                resultat.append(liste2[j])
                j += 1
        while i < len(liste1):
            resultat.append(liste1[i])
            i += 1
        while j < len(liste2):
            resultat.append(liste2[j])
            j += 1
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'fusion_triee' in locals(), "La fonction 'fusion_triee' n'est pas définie."
assert fusion_triee([1, 3, 5], [2, 4, 6]) == [1, 2, 3, 4, 5, 6]
assert fusion_triee([], [2, 3]) == [2, 3]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="listes-6-3" label="6.3 [Expert] - Médiane d'une liste">
    <Enonce>
    ### Exercice 6.3 [Expert] : Médiane d'une liste
    **Écrire une fonction `mediane` qui prend une liste de nombres **non vide** déjà triée par ordre croissant et renvoie sa médiane (élément central si la longueur est impaire).**

    <Correction>
    ```python
    def mediane(liste: list) -> float:
        milieu = len(liste) // 2
        if len(liste) % 2 == 1:
            return liste[milieu]
        return (liste[milieu - 1] + liste[milieu]) / 2
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
assert 'mediane' in locals(), "La fonction 'mediane' n'est pas définie."
assert mediane([1, 2, 3]) == 2
assert mediane([1, 2, 3, 4]) == 2.5
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
