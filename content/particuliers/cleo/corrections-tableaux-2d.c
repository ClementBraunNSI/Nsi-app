#include <stdio.h>
#include <stdlib.h>

/**
 * CORRECTION EXERCICES TABLEAUX 2D - C
 * 
 * Ce fichier regroupe les corrections des exercices de tableaux 2D.
 * Chaque exercice est encapsulé dans une fonction.
 * Le main() principal permet de choisir l'exercice à exécuter.
 */

// ==========================================
// PROTOTYPES
// ==========================================

void exo_1_1_morpion();
void exo_1_2_tables();
void exo_1_3_diagonale();
void exo_1_4_somme_totale();
void exo_1_5_damier();

void exo_2_1_sommes();
void exo_2_2_maximum();
void exo_2_3_transposee();
void exo_2_4_symetrie();
void exo_2_5_recherche();

void exo_3_1_malloc();
void exo_3_2_identite();
void exo_3_3_pascal();

// ==========================================
// MAIN MENU
// ==========================================

int main() {
    int choice;
    do {
        printf("\n============================================\n");
        printf("       CORRECTION EXERCICES TABLEAUX 2D       \n");
        printf("============================================\n");
        printf("--- NIVEAU 1 : FACILE ---\n");
        printf(" 1. Morpion\n");
        printf(" 2. Table de Multiplication\n");
        printf(" 3. Diagonale\n");
        printf(" 4. Somme Totale\n");
        printf(" 5. Damier\n");
        printf("\n--- NIVEAU 2 : MOYEN ---\n");
        printf(" 6. Somme des Lignes\n");
        printf(" 7. Maximum\n");
        printf(" 8. Transposée\n");
        printf(" 9. Symétrie\n");
        printf("10. Recherche\n");
        printf("\n--- NIVEAU 3 : DIFFICILE ---\n");
        printf("11. Malloc Basique\n");
        printf("12. Matrice Identité\n");
        printf("13. Triangle de Pascal\n");
        printf("\n 0. Quitter\n");
        printf("============================================\n");
        printf("Votre choix : ");
        
        if (scanf("%d", &choice) != 1) {
            // Vider le buffer si l'entrée n'est pas un nombre
            while(getchar() != '\n');
            choice = -1;
        }

        switch(choice) {
            case 1: exo_1_1_morpion(); break;
            case 2: exo_1_2_tables(); break;
            case 3: exo_1_3_diagonale(); break;
            case 4: exo_1_4_somme_totale(); break;
            case 5: exo_1_5_damier(); break;
            case 6: exo_2_1_sommes(); break;
            case 7: exo_2_2_maximum(); break;
            case 8: exo_2_3_transposee(); break;
            case 9: exo_2_4_symetrie(); break;
            case 10: exo_2_5_recherche(); break;
            case 11: exo_3_1_malloc(); break;
            case 12: exo_3_2_identite(); break;
            case 13: exo_3_3_pascal(); break;
            case 0: printf("Au revoir !\n"); break;
            default: printf("Choix invalide.\n");
        }
        
        if(choice != 0) {
            printf("\nAppuyez sur Entrée pour continuer...");
            while(getchar() != '\n'); // Vider le buffer
            getchar(); // Attendre une touche
        }

    } while(choice != 0);

    return 0;
}

// ==========================================
// NIVEAU 1
// ==========================================

// --- 1.1 Morpion ---
void afficher_grille_morpion(char g[3][3]) {
    printf("\n");
    for(int i = 0; i < 3; i++) {
        printf(" %c | %c | %c \n", g[i][0], g[i][1], g[i][2]);
        if(i < 2) printf("---|---|---\n");
    }
    printf("\n");
}

void exo_1_1_morpion() {
    printf("\n--- EXERCICE 1.1 : MORPION ---\n");
    char grille[3][3] = {
        {' ', ' ', ' '},
        {' ', ' ', ' '},
        {' ', ' ', ' '}
    };
    printf("--- Grille vide ---");
    afficher_grille_morpion(grille);
    
    grille[1][1] = 'X';
    grille[0][0] = 'O';
    
    printf("--- Grille modifiée ---");
    afficher_grille_morpion(grille);
}

// --- 1.2 Tables ---
void exo_1_2_tables() {
    printf("\n--- EXERCICE 1.2 : TABLES DE MULTIPLICATION ---\n");
    int table[10][10];

    // Remplissage
    for(int i = 0; i < 10; i++) {
        for(int j = 0; j < 10; j++) {
            table[i][j] = (i + 1) * (j + 1);
        }
    }

    // Affichage
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
}

// --- 1.3 Diagonale ---
void exo_1_3_diagonale() {
    printf("\n--- EXERCICE 1.3 : DIAGONALE ---\n");
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
}

// --- 1.4 Somme Totale ---
void exo_1_4_somme_totale() {
    printf("\n--- EXERCICE 1.4 : SOMME TOTALE ---\n");
    int notes[3][5] = {
        {10, 12, 15, 8, 11},
        {14, 16, 18, 12, 13},
        {9, 11, 10, 8, 14}
    };

    int somme = 0;
    // On a 3 élèves (lignes) et 5 matières (colonnes)
    
    for(int i = 0; i < 3; i++) {
        for(int j = 0; j < 5; j++) {
            somme += notes[i][j];
        }
    }

    float moyenne = (float)somme / 15.0;
    printf("Somme totale : %d\n", somme);
    printf("Moyenne globale : %.2f\n", moyenne);
}

// --- 1.5 Damier ---
void exo_1_5_damier() {
    printf("\n--- EXERCICE 1.5 : DAMIER ---\n");
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
            printf("%d ", damier[i][j]); 
        }
        printf("\n");
    }
}

// ==========================================
// NIVEAU 2
// ==========================================

// --- 2.1 Sommes ---
void afficher_sommes_lignes(int mat[3][4], int lignes) {
    for(int i = 0; i < lignes; i++) {
        int somme = 0;
        for(int j = 0; j < 4; j++) {
            somme += mat[i][j];
        }
        printf("Somme ligne %d : %d\n", i, somme);
    }
}

void exo_2_1_sommes() {
    printf("\n--- EXERCICE 2.1 : SOMME DES LIGNES ---\n");
    int matrice[3][4] = {
        {1, 2, 3, 4},
        {5, 5, 5, 5},
        {10, 20, 30, 40}
    };
    afficher_sommes_lignes(matrice, 3);
}

// --- 2.2 Maximum ---
void exo_2_2_maximum() {
    printf("\n--- EXERCICE 2.2 : MAXIMUM ---\n");
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
}

// --- 2.3 Transposée ---
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

void exo_2_3_transposee() {
    printf("\n--- EXERCICE 2.3 : TRANSPOSEE ---\n");
    int matrice[3][3] = {
        {1, 2, 3},
        {4, 5, 6},
        {7, 8, 9}
    };
    afficher_transposee(matrice);
}

// --- 2.4 Symétrie ---
int est_symetrique(int mat[3][3]) {
    for(int i = 0; i < 3; i++) {
        for(int j = 0; j < 3; j++) {
            if(mat[i][j] != mat[j][i]) {
                return 0; // Faux
            }
        }
    }
    return 1; // Vrai
}

void exo_2_4_symetrie() {
    printf("\n--- EXERCICE 2.4 : SYMETRIE ---\n");
    int sym[3][3] = {
        {1, 2, 3}, 
        {2, 5, 6}, 
        {3, 6, 9}
    };
    
    int pas_sym[3][3] = {
        {1, 2, 3}, 
        {4, 5, 6}, 
        {7, 8, 9}
    };

    printf("Test symétrique : %s\n", est_symetrique(sym) ? "OUI" : "NON");
    printf("Test non symétrique : %s\n", est_symetrique(pas_sym) ? "OUI" : "NON");
}

// --- 2.5 Recherche ---
int contient_valeur(int mat[3][4], int valeur) {
    for(int i = 0; i < 3; i++) {
        for(int j = 0; j < 4; j++) {
            if(mat[i][j] == valeur) {
                return 1; // Trouvé
            }
        }
    }
    return 0; // Non trouvé
}

void exo_2_5_recherche() {
    printf("\n--- EXERCICE 2.5 : RECHERCHE ---\n");
    int grille[3][4] = {
        {10, 20, 30, 40},
        {50, 60, 70, 80},
        {90, 100, 110, 120}
    };

    int cible;
    printf("Quel nombre cherchez-vous ? ");
    scanf("%d", &cible);

    if(contient_valeur(grille, cible)) {
        printf("Le nombre %d est dans la grille !\n", cible);
    } else {
        printf("Le nombre %d n'est pas là.\n", cible);
    }
}

// ==========================================
// NIVEAU 3
// ==========================================

// --- 3.1 Malloc ---
void exo_3_1_malloc() {
    printf("\n--- EXERCICE 3.1 : MALLOC ---\n");
    int L, C;
    printf("Nombre de lignes ? ");
    scanf("%d", &L);
    printf("Nombre de colonnes ? ");
    scanf("%d", &C);

    // 1. Allocation
    int **matrice = (int **)malloc(L * sizeof(int *));
    for(int i = 0; i < L; i++) {
        matrice[i] = (int *)malloc(C * sizeof(int));
    }

    // 2. Remplissage
    int compteur = 0;
    for(int i = 0; i < L; i++) {
        for(int j = 0; j < C; j++) {
            matrice[i][j] = compteur++;
        }
    }

    // 3. Affichage
    printf("\n--- Matrice Dynamique ---\n");
    for(int i = 0; i < L; i++) {
        for(int j = 0; j < C; j++) {
            printf("%3d ", matrice[i][j]);
        }
        printf("\n");
    }

    // 4. Libération
    for(int i = 0; i < L; i++) {
        free(matrice[i]);
    }
    free(matrice);
}

// --- 3.2 Identité ---
int **creer_matrice_identite(int n) {
    int **mat = (int **)malloc(n * sizeof(int *));
    for(int i = 0; i < n; i++) {
        mat[i] = (int *)calloc(n, sizeof(int)); // calloc initialise à 0
    }

    for(int i = 0; i < n; i++) {
        mat[i][i] = 1;
    }
    return mat;
}

void exo_3_2_identite() {
    printf("\n--- EXERCICE 3.2 : IDENTITE ---\n");
    int N = 5;
    int **id = creer_matrice_identite(N);

    printf("Matrice Identité de taille %d :\n", N);
    for(int i = 0; i < N; i++) {
        for(int j = 0; j < N; j++) {
            printf("%d ", id[i][j]);
        }
        printf("\n");
    }

    for(int i = 0; i < N; i++) free(id[i]);
    free(id);
}

// --- 3.3 Pascal ---
void exo_3_3_pascal() {
    printf("\n--- EXERCICE 3.3 : PASCAL ---\n");
    int H;
    printf("Hauteur du triangle ? ");
    scanf("%d", &H);

    int **triangle = (int **)malloc(H * sizeof(int *));

    for(int i = 0; i < H; i++) {
        triangle[i] = (int *)malloc((i + 1) * sizeof(int));
        
        triangle[i][0] = 1;
        triangle[i][i] = 1;
        
        for(int j = 1; j < i; j++) {
            triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j];
        }
    }

    for(int i = 0; i < H; i++) {
        for(int j = 0; j <= i; j++) {
            printf("%d ", triangle[i][j]);
        }
        printf("\n");
    }

    for(int i = 0; i < H; i++) free(triangle[i]);
    free(triangle);
}
