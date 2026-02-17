---
title: "C - Exercices Tableaux 2D"
description: "Exercices progressifs sur les matrices"
level: "particuliers"
chapter: "Programmation en C"
icon: "💪"
allowedStudents: ["Cléo CHILAIN"]
---

<ExerciseTabs courseId="c-tableaux-2d-levels" courseTitle="C - Tableaux 2D - Niveaux">

  <ExerciseSection id="level-1" label="Niveau 1 - Facile">
    <Enonce>
      ### Exercices de Niveau 1 : Utilisation Simple
      
      Dans ce niveau, vous allez manipuler des tableaux statiques simples.
    </Enonce>
    
    <ExerciseTabs courseId="c-tableaux-2d-exos" courseTitle="Niveau 1">
      <ExerciseSection id="exo-1-1" label="1.1 - Morpion">
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

      <ExerciseSection id="exo-1-2" label="1.2 - Tables">
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

      <ExerciseSection id="exo-1-3" label="1.3 - Diagonale">
        <Enonce>
        ### Exercice 1.3 : La Diagonale
        **Objectif** : Accéder aux éléments spécifiques d'une matrice.

        1. Déclarer une matrice carrée `int mat[4][4]` avec des valeurs quelconques.
        2. Afficher uniquement les éléments de la **diagonale principale** (ceux où `i == j`).
        3. Afficher ensuite les éléments de la **diagonale secondaire** (ceux où `i + j == taille - 1`).

        <Correction>
        ```c
        #include <stdio.h>

        int main() {
            int mat[4][4] = {
                {1, 2, 3, 4},
                {5, 6, 7, 8},
                {9, 10, 11, 12},
                {13, 14, 15, 16}
            };

            printf("Diagonale principale : ");
            for(int i = 0; i < 4; i++) {
                printf("%d ", mat[i][i]);
            }
            printf("\n");

            printf("Diagonale secondaire : ");
            for(int i = 0; i < 4; i++) {
                printf("%d ", mat[i][3-i]);
            }
            printf("\n");

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

      <ExerciseSection id="exo-1-4" label="1.4 - Somme Totale">
        <Enonce>
        ### Exercice 1.4 : Somme Totale
        **Objectif** : Parcourir tout le tableau pour accumuler une valeur.

        1. Déclarer un tableau `int notes[3][5]` représentant les notes de 3 élèves sur 5 matières.
        2. Initialiser avec des valeurs de votre choix (entre 0 et 20).
        3. Calculer la somme totale de toutes les notes et la moyenne globale.
        
        <Correction>
        ```c
        #include <stdio.h>

        int main() {
            int notes[3][5] = {
                {10, 12, 15, 8, 11},
                {14, 16, 18, 12, 13},
                {9, 11, 10, 8, 14}
            };

            int somme = 0;
            // On a 3 élèves (lignes) et 5 matières (colonnes)
            // Donc 3 * 5 = 15 notes au total
            
            for(int i = 0; i < 3; i++) {
                for(int j = 0; j < 5; j++) {
                    somme += notes[i][j];
                }
            }

            float moyenne = (float)somme / 15.0;
            printf("Somme totale : %d\n", somme);
            printf("Moyenne globale : %.2f\n", moyenne);

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

      <ExerciseSection id="exo-1-5" label="1.5 - Damier">
        <Enonce>
        ### Exercice 1.5 : Le Damier
        **Objectif** : Utiliser les indices `i` et `j` pour créer un motif.

        1. Créer un tableau `int damier[8][8]`.
        2. Remplir le tableau avec des `0` et des `1` pour former un damier (cases alternées).
        3. Astuce : La case est noire (1) si la somme `i + j` est paire, sinon blanche (0).
        4. Afficher le damier (utiliser `1 ` et `0 ` pour l'affichage).

        <Correction>
        ```c
        #include <stdio.h>

        int main() {
            int damier[8][8];

            for(int i = 0; i < 8; i++) {
                for(int j = 0; j < 8; j++) {
                    if((i + j) % 2 == 0) {
                        damier[i][j] = 1; // Case noire
                    } else {
                        damier[i][j] = 0; // Case blanche
                    }
                }
            }

            printf("--- Damier ---\n");
            for(int i = 0; i < 8; i++) {
                for(int j = 0; j < 8; j++) {
                    // Affiche 1 ou 0
                    printf("%d ", damier[i][j]); 
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
    </ExerciseTabs>
  </ExerciseSection>

  <ExerciseSection id="level-2" label="Niveau 2 - Moyen">
    <Enonce>
      ### Exercices de Niveau 2 : Fonctions
      
      Ici, nous allons créer des fonctions pour manipuler nos tableaux 2D.
    </Enonce>

    <ExerciseTabs courseId="c-tableaux-2d-exos" courseTitle="Niveau 2">
      <ExerciseSection id="exo-2-1" label="2.1 - Sommes">
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

      <ExerciseSection id="exo-2-2" label="2.2 - Maximum">
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

      <ExerciseSection id="exo-2-3" label="2.3 - Transposée">
        <Enonce>
        ### Exercice 2.3 : Transposée d'une Matrice
        **Objectif** : Manipuler les indices pour inverser lignes et colonnes.

        Écrire une fonction `afficher_transposee(int mat[3][3])` qui affiche la matrice en échangeant les lignes et les colonnes.
        
        *Exemple : La ligne 0 devient la colonne 0.*

        <Correction>
        ```c
        #include <stdio.h>

        void afficher_transposee(int mat[3][3]) {
            printf("--- Transposée ---\n");
            for(int i = 0; i < 3; i++) {
                for(int j = 0; j < 3; j++) {
                    // On affiche mat[j][i] au lieu de mat[i][j]
                    printf("%d ", mat[j][i]);
                }
                printf("\n");
            }
        }

        int main() {
            int matrice[3][3] = {
                {1, 2, 3},
                {4, 5, 6},
                {7, 8, 9}
            };

            afficher_transposee(matrice);
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

      <ExerciseSection id="exo-2-4" label="2.4 - Symétrie">
        <Enonce>
        ### Exercice 2.4 : Matrice Symétrique
        **Objectif** : Vérifier une propriété géométrique d'une matrice.

        Une matrice est symétrique si elle est égale à sa transposée, c'est-à-dire si `mat[i][j] == mat[j][i]` pour tout i, j.
        
        Écrire une fonction `int est_symetrique(int mat[3][3])` qui retourne `1` (vrai) si la matrice est symétrique, `0` (faux) sinon.

        Testez avec :
        ```c
        int sym[3][3] = {{1, 2, 3}, {2, 5, 6}, {3, 6, 9}}; // Symétrique
        int pas_sym[3][3] = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}}; // Pas symétrique
        ```

        <Correction>
        ```c
        #include <stdio.h>

        int est_symetrique(int mat[3][3]) {
            for(int i = 0; i < 3; i++) {
                // On peut commencer j à 0, ou optimiser en commençant à i + 1
                for(int j = 0; j < 3; j++) {
                    if(mat[i][j] != mat[j][i]) {
                        return 0; // Faux dès qu'on trouve une différence
                    }
                }
            }
            return 1; // Vrai si on a tout parcouru sans erreur
        }

        int main() {
            int sym[3][3] = {
                {1, 2, 3}, 
                {2, 5, 6}, 
                {3, 6, 9}
            };
            
            if(est_symetrique(sym)) {
                printf("La matrice est symétrique.\n");
            } else {
                printf("La matrice n'est pas symétrique.\n");
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

      <ExerciseSection id="exo-2-5" label="2.5 - Recherche">
        <Enonce>
        ### Exercice 2.5 : Recherche d'une Valeur
        **Objectif** : Fonction de recherche avec retour rapide.

        Écrire une fonction `int contient(int mat[3][4], int valeur)` qui cherche si `valeur` est présente dans le tableau.
        
        - Retourne `1` si trouvé.
        - Retourne `0` si non trouvé.
        
        Dans le `main`, demandez à l'utilisateur un nombre et dites-lui s'il est dans la grille.

        <Correction>
        ```c
        #include <stdio.h>

        int contient(int mat[3][4], int valeur) {
            for(int i = 0; i < 3; i++) {
                for(int j = 0; j < 4; j++) {
                    if(mat[i][j] == valeur) {
                        return 1; // Trouvé ! On quitte la fonction immédiatement
                    }
                }
            }
            return 0; // Si on arrive ici, c'est qu'on a rien trouvé
        }

        int main() {
            int grille[3][4] = {
                {10, 20, 30, 40},
                {50, 60, 70, 80},
                {90, 100, 110, 120}
            };

            int cible;
            printf("Quel nombre cherchez-vous ? ");
            scanf("%d", &cible);

            if(contient(grille, cible)) {
                printf("Le nombre %d est dans la grille !\n", cible);
            } else {
                printf("Le nombre %d n'est pas là.\n", cible);
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
    </ExerciseTabs>
  </ExerciseSection>

  <ExerciseSection id="level-3" label="Niveau 3 - Difficile">
    <Enonce>
      ### Exercices de Niveau 3 : Allocation Dynamique
      
      Passons aux choses sérieuses avec `malloc`, `free` et les tableaux de pointeurs.
    </Enonce>

    <ExerciseTabs courseId="c-tableaux-2d-exos" courseTitle="Niveau 3">
      <ExerciseSection id="exo-3-1" label="3.1 - Malloc">
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

      <ExerciseSection id="exo-3-2" label="3.2 - Identité">
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

      <ExerciseSection id="exo-3-3" label="3.3 - Pascal">
        <Enonce>
        ### Exercice 3.3 : Triangle de Pascal (Tableau Irrégulier)
        **Objectif** : Allouer des lignes de tailles différentes.

        Le triangle de Pascal est une structure où chaque ligne `i` contient `i+1` éléments.
        
        1. Demander à l'utilisateur la hauteur `H` du triangle.
        2. Allouer un tableau de pointeurs `triangle` de taille `H`.
        3. Pour chaque ligne `i`, allouer un tableau de taille `i + 1`.
        4. Remplir le triangle : 
           - Les bords valent 1 (`T[i][0]` et `T[i][i]`).
           - Les autres valent la somme des deux au-dessus (`T[i][j] = T[i-1][j-1] + T[i-1][j]`).
        5. Afficher le triangle.
        6. Libérer la mémoire.

        <Correction>
        ```c
        #include <stdio.h>
        #include <stdlib.h>

        int main() {
            int H;
            printf("Hauteur du triangle ? ");
            scanf("%d", &H);

            // 1. Allocation du tableau de pointeurs
            int **triangle = (int **)malloc(H * sizeof(int *));

            // 2. Allocation des lignes (tailles variables)
            for(int i = 0; i < H; i++) {
                triangle[i] = (int *)malloc((i + 1) * sizeof(int));
                
                // 3. Remplissage
                triangle[i][0] = 1; // Premier élément
                triangle[i][i] = 1; // Dernier élément
                
                for(int j = 1; j < i; j++) {
                    triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j];
                }
            }

            // 4. Affichage
            for(int i = 0; i < H; i++) {
                for(int j = 0; j <= i; j++) {
                    printf("%d ", triangle[i][j]);
                }
                printf("\n");
            }

            // 5. Libération
            for(int i = 0; i < H; i++) free(triangle[i]);
            free(triangle);

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
  </ExerciseSection>

</ExerciseTabs>
