---
title: "C - Exercices Tableaux 2D"
description: "Exercices progressifs sur les matrices"
level: "particuliers"
chapter: "Programmation en C"
icon: "💪"
allowedStudents: ["Cléo CHILAIN"]
---

<ExerciseTabs courseId="c-tableaux-2d-exos" courseTitle="C - Tableaux 2D - Exercices">

  <!-- ==================== NIVEAU 1 ==================== -->
  
  <ExerciseSection id="exo-1-1" label="1.1 - Morpion (Statique)">
    <Enonce>
    ### Exercice 1.1 : La Grille de Morpion
    **Objectif** : Manipuler un tableau 2D de caractères.
    
    1. Créer un tableau statique `char grille[3][3]` initialisé avec des espaces `' '`.
    2. Afficher la grille vide (avec des `|` pour séparer les colonnes).
    3. Placer un 'X' au centre (`[1][1]`) et un 'O' en haut à gauche (`[0][0]`).
    4. Afficher la grille modifiée.

    <Correction>
    ```c
    #include <stdio.h>

    void afficher_grille(char g[3][3]) {
        printf("\n");
        for(int i = 0; i < 3; i++) {
            printf(" %c | %c | %c \n", g[i][0], g[i][1], g[i][2]);
            if(i < 2) printf("---|---|---\n");
        }
        printf("\n");
    }

    int main() {
        // 1. Initialisation avec des espaces
        char grille[3][3] = {
            {' ', ' ', ' '},
            {' ', ' ', ' '},
            {' ', ' ', ' '}
        };

        printf("--- Grille vide ---");
        afficher_grille(grille);

        // 2. Modification
        grille[1][1] = 'X'; // Centre
        grille[0][0] = 'O'; // Haut gauche

        printf("--- Grille modifiée ---");
        afficher_grille(grille);

        return 0;
    }
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```c
    // Vérification basique
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-1-2" label="1.2 - Table de Multiplication">
    <Enonce>
    ### Exercice 1.2 : Table de Multiplication
    **Objectif** : Utiliser des boucles imbriquées pour remplir un tableau.

    1. Déclarer un tableau `int table[10][10]`.
    2. Utiliser deux boucles imbriquées pour remplir le tableau : `table[i][j] = (i+1) * (j+1)`.
    3. Afficher la table joliment formatée (utiliser `%3d` pour aligner les nombres).

    <Correction>
    ```c
    #include <stdio.h>

    int main() {
        int table[10][10];

        // 1. Remplissage
        for(int i = 0; i < 10; i++) {
            for(int j = 0; j < 10; j++) {
                table[i][j] = (i + 1) * (j + 1);
            }
        }

        // 2. Affichage
        printf("   X |");
        for(int j=1; j<=10; j++) printf("%4d", j);
        printf("\n-----+");
        for(int j=1; j<=10; j++) printf("----");
        printf("\n");

        for(int i = 0; i < 10; i++) {
            printf("%4d |", i + 1); // En-tête de ligne
            for(int j = 0; j < 10; j++) {
                printf("%4d", table[i][j]);
            }
            printf("\n");
        }

        return 0;
    }
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```c
    // Vérification basique
    ```
    </Verification>
  </ExerciseSection>

  <!-- ==================== NIVEAU 2 ==================== -->

  <ExerciseSection id="exo-2-1" label="2.1 - Somme des Lignes">
    <Enonce>
    ### Exercice 2.1 : Somme des Lignes
    **Objectif** : Parcourir et analyser les données.

    Écrire une fonction qui prend un tableau `int matrice[3][4]` et affiche la somme de chaque ligne.

    **Données :**
    ```c
    int matrice[3][4] = {
        {1, 2, 3, 4},
        {5, 5, 5, 5},
        {10, 20, 30, 40}
    };
    ```

    <Correction>
    ```c
    #include <stdio.h>

    // En C statique, il faut préciser la 2ème dimension
    void afficher_sommes(int mat[3][4], int lignes) {
        for(int i = 0; i < lignes; i++) {
            int somme = 0;
            for(int j = 0; j < 4; j++) {
                somme += mat[i][j];
            }
            printf("Somme ligne %d : %d\n", i, somme);
        }
    }

    int main() {
        int matrice[3][4] = {
            {1, 2, 3, 4},
            {5, 5, 5, 5},
            {10, 20, 30, 40}
        };

        afficher_sommes(matrice, 3);
        return 0;
    }
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```c
    // Vérification basique
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-2-2" label="2.2 - Le Maximum">
    <Enonce>
    ### Exercice 2.2 : Recherche du Maximum
    Trouver la valeur maximale dans une matrice donnée et afficher ses coordonnées (ligne, colonne).

    <Correction>
    ```c
    #include <stdio.h>

    int main() {
        int matrice[3][4] = {
            {12, 45, 78, 23},
            {56, 99, 12, 34}, // Max est ici (99)
            {10, 20, 30, 40}
        };

        int max = matrice[0][0];
        int max_i = 0, max_j = 0;

        for(int i = 0; i < 3; i++) {
            for(int j = 0; j < 4; j++) {
                if(matrice[i][j] > max) {
                    max = matrice[i][j];
                    max_i = i;
                    max_j = j;
                }
            }
        }

        printf("Le maximum est %d à la position [%d][%d]\n", max, max_i, max_j);
        return 0;
    }
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```c
    // Vérification basique
    ```
    </Verification>
  </ExerciseSection>

  <!-- ==================== NIVEAU 3 ==================== -->

  <ExerciseSection id="exo-3-1" label="3.1 - Allocation Dynamique">
    <Enonce>
    ### Exercice 3.1 : Création Dynamique (Malloc)
    **Objectif** : Maîtriser `malloc` et `free` pour les tableaux 2D.

    1. Demander à l'utilisateur le nombre de lignes (`L`) et de colonnes (`C`).
    2. Allouer dynamiquement une matrice `int **matrice` de taille `L x C`.
    3. Remplir avec des nombres séquentiels (0, 1, 2...).
    4. Afficher la matrice.
    5. **Important** : Libérer proprement la mémoire à la fin.

    <Correction>
    ```c
    #include <stdio.h>
    #include <stdlib.h>

    int main() {
        int L, C;
        printf("Nombre de lignes ? ");
        scanf("%d", &L);
        printf("Nombre de colonnes ? ");
        scanf("%d", &C);

        // 1. Allocation des lignes (tableau de pointeurs)
        int **matrice = (int **)malloc(L * sizeof(int *));
        
        // 2. Allocation des colonnes pour chaque ligne
        for(int i = 0; i < L; i++) {
            matrice[i] = (int *)malloc(C * sizeof(int));
        }

        // 3. Remplissage
        int compteur = 0;
        for(int i = 0; i < L; i++) {
            for(int j = 0; j < C; j++) {
                matrice[i][j] = compteur++;
            }
        }

        // 4. Affichage
        printf("\n--- Matrice Dynamique ---\n");
        for(int i = 0; i < L; i++) {
            for(int j = 0; j < C; j++) {
                printf("%3d ", matrice[i][j]);
            }
            printf("\n");
        }

        // 5. Libération (Ordre inverse)
        for(int i = 0; i < L; i++) {
            free(matrice[i]); // Libérer chaque ligne
        }
        free(matrice); // Libérer le tableau de pointeurs

        return 0;
    }
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```c
    // Vérification basique
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="exo-3-2" label="3.2 - Matrice Identité">
    <Enonce>
    ### Exercice 3.2 : Matrice Identité
    Créer une fonction `creer_identite(int n)` qui retourne une matrice identité de taille `N x N` (allouée dynamiquement).
    
    *Rappel : Une matrice identité a des `1` sur la diagonale et des `0` ailleurs.*

    <Correction>
    ```c
    #include <stdio.h>
    #include <stdlib.h>

    int **creer_identite(int n) {
        // Allocation
        int **mat = (int **)malloc(n * sizeof(int *));
        for(int i = 0; i < n; i++) {
            mat[i] = (int *)calloc(n, sizeof(int)); // calloc initialise à 0 !
        }

        // Remplissage de la diagonale
        for(int i = 0; i < n; i++) {
            mat[i][i] = 1;
        }

        return mat;
    }

    int main() {
        int N = 5;
        int **id = creer_identite(N);

        printf("Matrice Identité de taille %d :\n", N);
        for(int i = 0; i < N; i++) {
            for(int j = 0; j < N; j++) {
                printf("%d ", id[i][j]);
            }
            printf("\n");
        }

        // Libération
        for(int i = 0; i < N; i++) free(id[i]);
        free(id);

        return 0;
    }
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```c
    // Vérification basique
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
