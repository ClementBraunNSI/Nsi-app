---
title: C - Algorithmes de Tri - Exercices
description: 'Exercices guidés sur les tris : sélection, insertion et dénombrement'
level: particuliers
chapter: Programmation en C
icon: "\U0001F504"
prerequisites:
  - exercices-affectations-types
---

<ExerciseTabs courseId="c-tris-exos" courseTitle="C - Algorithmes de Tri - Exercices">
  
  <ExerciseSection id="tri-selection" label="1. Tri par Sélection">
    <Enonce>
    ### Principe du Tri par Sélection
    Le tri par sélection consiste à rechercher le plus petit élément du tableau et à l'échanger avec le premier élément. On recommence ensuite avec le reste du tableau (à partir du deuxième élément), et ainsi de suite.

    **Pseudo-code :**
    ```text
    Fonction indice_mini(tableau, taille, debut)
        ind_mini = debut
        Pour i allant de debut à taille - 1
            Si tableau[i] < tableau[ind_mini]
                ind_mini = i
        Retourner ind_mini

    Fonction tri_selection(tableau, taille)
        Pour i allant de 0 à taille - 1
            ind_mini = indice_mini(tableau, taille, i)
            Echanger tableau[i] et tableau[ind_mini]
    ```

    ### Exercice 1 : Implémentation du Tri par Sélection
    **Écrivez un programme en C qui :**
    1. Initialise un tableau d'entiers non trié (ex: `{64, 25, 12, 22, 11}`).
    2. Implémente la fonction `void triSelection(int tab[], int taille)`.
    3. Affiche le tableau avant et après le tri.

    </Enonce>
    <Verification>
    ```c
    // Vérifier que le tableau est trié dans l'ordre croissant
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="tri-insertion" label="2. Tri par Insertion">
    <Enonce>
    ### Principe du Tri par Insertion
    Le tri par insertion fonctionne comme le tri d'un jeu de cartes en main. On prend les éléments un par un et on les insère à leur bonne place dans la partie déjà triée du tableau.

    **Pseudo-code :**
    ```text
    Fonction inserer(tableau, taille, debut)
        i = debut
        Tant que i > 0 et tableau[i-1] > tableau[i]
            Echanger tableau[i-1] et tableau[i]
            i = i - 1

    Fonction tri_insertion(tableau, taille)
        Pour i allant de 1 à taille - 1
            inserer(tableau, taille, i)
    ```

    ### Exercice 2 : Implémentation du Tri par Insertion
    **Écrivez un programme en C qui :**
    1. Initialise un tableau d'entiers (ex: `{12, 11, 13, 5, 6}`).
    2. Implémente la fonction `void triInsertion(int tab[], int taille)`.
    3. Affiche chaque étape du tri (état du tableau à chaque itération de la boucle principale).

    </Enonce>
    <Verification>
    ```c
    // Vérifier que les petits éléments "remontent" vers le début
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="tri-denombrement" label="3. Tri par Dénombrement (Counting Sort)">
    <Enonce>
    ### Principe du Tri par Dénombrement
    C'est un tri non comparatif. Il compte le nombre d'occurrences de chaque valeur distincte. Cette technique est efficace quand les valeurs sont des entiers compris dans un intervalle spécifique (borné).
    
    *Exemple : Si on a des notes entre 0 et 20.*

    **Pseudo-code :**
    ```text
    Fonction maxi(tableau, taille)
        maximum = tableau[0]
        Pour i allant de 0 à taille - 1
            Si tableau[i] > maximum
                maximum = tableau[i]
        Retourner maximum

    Fonction denombrement(tableau, taille, maximum)
        compteur = tableau de taille (maximum + 1) initialisé à 0
        Pour i allant de 0 à taille - 1
            compteur[tableau[i]]++
        Retourner compteur

    Fonction tri_denombrement(tableau, taille)
        maximum = maxi(tableau, taille)
        tab_denombrement = denombrement(tableau, taille, maximum)
        tab_res = allocation mémoire pour taille entiers
        
        Pour i allant de 0 à taille - 1
            Pour j allant de 0 à maximum
                Si tab_denombrement[j] > 0
                    tab_res[i] = j
                    tab_denombrement[j]--
                    Sortir de la boucle interne (break)
        Retourner tab_res
    ```

    ### Exercice 3 : Implémentation Simple
    On simplifie ici : on suppose qu'on trie des notes entre 0 et 20.
    1. Créez un tableau `notes[]` avec des valeurs entre 0 et 20.
    2. Créez un tableau `compteur[21]` initialisé à 0.
    3. Parcourez `notes` pour remplir `compteur` (histogramme).
    4. Reconstruisez le tableau `notes` trié en lisant `compteur`.

    </Enonce>
    <Verification>
    ```c
    // Vérifier que toutes les occurrences sont préservées
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
