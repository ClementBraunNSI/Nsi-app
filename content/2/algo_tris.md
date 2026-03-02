---
title: "TP : Algorithmes de Tri"
description: "Comprendre et implémenter les tris par sélection et insertion"
level: premiere
chapter: "Algorithmique"
icon: "📶"
badgeId: "premiere_tris"
meta: "Durée : 2 heures · Objectif : Implémenter les algorithmes classiques"
---

<ExerciseTabs courseId="premiere_tris" courseTitle="TP Algorithmes de Tri">

  <ExerciseSection id="tri-selection" label="Tri par Sélection">
    <Enonce>
    ## Le Tri par Sélection

    ### 1. Le Concept
    Le tri par sélection est intuitif : on cherche le plus petit élément de la liste et on le place en première position. Puis on cherche le plus petit parmi ceux qui restent, et on le place en seconde position, et ainsi de suite.

    **Algorithme en français :**
    1.  Parcourir toute la liste pour trouver le minimum.
    2.  Échanger ce minimum avec le premier élément de la zone non triée.
    3.  Répéter l'opération sur le reste de la liste (sans le premier élément désormais trié).

    ### 2. Exemple pas à pas
    Liste initiale : `[5, 2, 4, 6, 1, 3]`

    | Tour | Liste (Gras = Trié) | Action |
    | :--- | :--- | :--- |
    | Début | `[5, 2, 4, 6, 1, 3]` | Le minimum est **1** (index 4). On l'échange avec 5. |
    | 1 | `[**1**, 2, 4, 6, 5, 3]` | Reste `[2, 4, 6, 5, 3]`. Le min est **2**. Déjà bien placé. |
    | 2 | `[**1, 2**, 4, 6, 5, 3]` | Reste `[4, 6, 5, 3]`. Le min est **3**. On l'échange avec 4. |
    | 3 | `[**1, 2, 3**, 6, 5, 4]` | Reste `[6, 5, 4]`. Le min est **4**. On l'échange avec 6. |
    | 4 | `[**1, 2, 3, 4**, 5, 6]` | Reste `[5, 6]`. Le min est **5**. Déjà bien placé. |
    | Fin | `[**1, 2, 3, 4, 5**, 6]` | Le dernier est forcément le plus grand. |

    ### 3. À vous de jouer !

    Nous allons implémenter ce tri étape par étape.

    **Exercice A : Trouver le minimum**
    Écrire une fonction `indice_min(liste, debut)` qui renvoie **l'indice** de la valeur la plus petite dans la partie de la liste commençant à `debut`.

    ```python
    def indice_min(liste, debut):
        # Votre code ici
        pass

    # Test : indice_min([5, 2, 4, 6, 1, 3], 0) doit renvoyer 4 (car 1 est à l'indice 4)
    # Test : indice_min([5, 2, 4, 6, 1, 3], 2) doit renvoyer 5 (car 3 est le plus petit après l'indice 2)
    ```

    **Exercice B : L'algorithme complet**
    Utilisez la fonction précédente pour écrire `tri_selection(liste)`.
    Cette fonction ne renvoie rien mais modifie la liste directement (tri en place).

    ```python
    def tri_selection(liste):
        # Pour chaque position i de 0 à la fin...
        # 1. Trouver l'indice du minimum à partir de i
        # 2. Échanger l'élément en i avec l'élément minimum trouvé
        pass
    ```

    <Correction>
    ```python
    def indice_min(liste, debut):
        i_min = debut
        for i in range(debut + 1, len(liste)):
            if liste[i] < liste[i_min]:
                i_min = i
        return i_min

    def tri_selection(liste):
        n = len(liste)
        for i in range(n):
            # On cherche le candidat pour la position i
            min_idx = indice_min(liste, i)
            
            # On échange (si nécessaire)
            if min_idx != i:
                liste[i], liste[min_idx] = liste[min_idx], liste[i]
        
        return liste # On peut la renvoyer pour le confort, même si modifiée en place
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ma_liste = [5, 2, 4, 6, 1, 3]
    tri_selection(ma_liste)
    assert ma_liste == [1, 2, 3, 4, 5, 6]

    test_2 = [10, -2, 0]
    tri_selection(test_2)
    assert test_2 == [-2, 0, 10]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="tri-insertion" label="Tri par Insertion">
    <Enonce>
    ## Le Tri par Insertion

    ### 1. Le Concept
    C'est la méthode du joueur de cartes. On prend les cartes une par une et on les insère à leur place dans la main déjà triée.

    **Algorithme en français :**
    1.  On considère que le premier élément est déjà trié.
    2.  On prend le deuxième élément et on le place correctement par rapport au premier.
    3.  On prend le troisième et on l'insère dans les deux premiers, etc.

    ### 2. Exemple pas à pas
    Liste initiale : `[5, 2, 4, 6, 1, 3]`

    | Tour | Liste (Gras = Zone Triée) | Carte piochée | Action |
    | :--- | :--- | :--- | :--- |
    | Début | `[**5**, 2, 4, 6, 1, 3]` | - | 5 est seul, donc trié. |
    | 1 | `[**2, 5**, 4, 6, 1, 3]` | **2** | 2 < 5, on décale 5 et on place 2 devant. |
    | 2 | `[**2, 4, 5**, 6, 1, 3]` | **4** | 4 < 5 mais 4 > 2. On l'insère au milieu. |
    | 3 | `[**2, 4, 5, 6**, 1, 3]` | **6** | 6 > 5. Reste à sa place. |
    | 4 | `[**1, 2, 4, 5, 6**, 3]` | **1** | 1 est le plus petit, il redescend tout en bas. |
    | Fin | `[**1, 2, 3, 4, 5, 6**]` | **3** | S'insère entre 2 et 4. |

    ### 3. À vous de jouer !

    **Exercice A : Insérer une valeur**
    Le cœur de l'algorithme est de prendre une valeur à un indice `i` et de la faire "remonter" vers la gauche tant qu'elle est plus petite que son voisin de gauche.

    Écrire la fonction `tri_insertion(liste)`.
    
    *Aide :*
    Utiliser une boucle `for` de `1` à `len(liste)` pour parcourir les éléments à trier.
    À l'intérieur, utiliser une boucle `while` pour décaler les éléments vers la droite tant que c'est nécessaire.

    ```python
    def tri_insertion(liste):
        # Pour chaque élément à partir du 2ème (indice 1)...
        # Mémoriser la valeur à insérer (clef)
        # Décaler les éléments précédents plus grands que la clef vers la droite
        # Placer la clef dans le "trou" laissé
        pass
    ```

    <Correction>
    ```python
    def tri_insertion(liste):
        n = len(liste)
        # On commence à 1 car l'élément 0 est considéré comme déjà trié
        for i in range(1, n):
            clef = liste[i]
            j = i
            
            # Décalage vers la droite des éléments plus grands que la clef
            while j > 0 and liste[j - 1] > clef:
                liste[j] = liste[j - 1]
                j = j - 1
            
            # Insertion de la clef à sa nouvelle place
            liste[j] = clef
            
        return liste
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import random
    
    # Test basique
    l1 = [5, 2, 4, 6, 1, 3]
    tri_insertion(l1)
    assert l1 == [1, 2, 3, 4, 5, 6]

    # Test liste déjà triée
    l2 = [1, 2, 3]
    tri_insertion(l2)
    assert l2 == [1, 2, 3]

    # Test liste inversée
    l3 = [3, 2, 1]
    tri_insertion(l3)
    assert l3 == [1, 2, 3]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="tri-denombrement" label="Bonus : Dénombrement">
    <Enonce>
    ## Pour aller plus loin : Le Tri par Dénombrement

    Les tris précédents fonctionnent par **comparaison** (est-ce que A < B ?).
    Le tri par dénombrement est différent : il **compte** les éléments. Il est très rapide mais ne fonctionne que pour des entiers positifs bornés (ex: des notes sur 20).

    ### Algorithme
    1.  On compte combien de fois apparaît chaque valeur.
    2.  On reconstruit la liste en répétant chaque valeur son nombre de fois.

    **Exercice Bonus :**
    Écrire `tri_denombrement(liste, max_val)` où `max_val` est la valeur maximale possible dans la liste.

    <Correction>
    ```python
    def tri_denombrement(liste, max_val):
        # 1. Création des compteurs (de 0 à max_val inclus)
        compteurs = [0] * (max_val + 1)
        
        # 2. Comptage
        for valeur in liste:
            compteurs[valeur] += 1
            
        # 3. Reconstruction
        resultat = []
        for val, count in enumerate(compteurs):
            # On ajoute 'count' fois la valeur 'val'
            resultat.extend([val] * count)
            
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    notes = [15, 10, 15, 20, 0, 10]
    # Les notes sont entre 0 et 20
    triees = tri_denombrement(notes, 20)
    assert triees == [0, 10, 10, 15, 15, 20]
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="tri-bonus" label="Bonus : Visualisation">
    <Enonce>
    ## Bonus : Visualisation (Tri à Bulles)
    
    Voici une visualisation interactive d'un autre algorithme de tri très connu : le **Tri à Bulles**.
    Bien qu'il soit moins efficace que le tri par insertion ou sélection, il est intéressant à observer.
    
    <AlgorithmRace />
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
