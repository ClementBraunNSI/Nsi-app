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
void afficher_grille_morpion(int L, int C, char g[L][C]) {
    printf("\n");
    for(int i = 0; i < L; i++) {
        printf(" %c | %c | %c \n", g[i][0], g[i][1], g[i][2]);
        if(i < L-1) printf("---|---|---\n");
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
    afficher_grille_morpion(3, 3, grille);
    
    grille[1][1] = 'X';
    grille[0][0] = 'O';
    
    printf("--- Grille modifiée ---");
    afficher_grille_morpion(3, 3, grille);
}

// --- 1.2 Tables ---
void remplir_table(int L, int C, int table[L][C]) {
    for(int i = 0; i < L; i++) {
        for(int j = 0; j < C; j++) {
            table[i][j] = (i + 1) * (j + 1);
        }
    }
}

void afficher_table(int L, int C, int table[L][C]) {
    printf("   X |");
    for(int j=1; j<=C; j++) printf("%4d", j);
    printf("\n-----+");
    for(int j=1; j<=C; j++) printf("----");
    printf("\n");

    for(int i = 0; i < L; i++) {
        printf("%4d |", i + 1); // En-tête de ligne
        for(int j = 0; j < C; j++) {
            printf("%4d", table[i][j]);
        }
        printf("\n");
    }
}

void exo_1_2_tables() {
    printf("\n--- EXERCICE 1.2 : TABLES DE MULTIPLICATION ---\n");
    int table[10][10];

    remplir_table(10, 10, table);
    afficher_table(10, 10, table);
}

// --- 1.3 Diagonale ---
void afficher_diagonales(int L, int C, int mat[L][C]) {
    printf("Diagonale principale : ");
    for(int i = 0; i < L; i++) {
        printf("%d ", mat[i][i]);
    }
    printf("\n");

    printf("Diagonale secondaire : ");
    for(int i = 0; i < L; i++) {
        printf("%d ", mat[i][C-1-i]);
    }
    printf("\n");
}

void exo_1_3_diagonale() {
    printf("\n--- EXERCICE 1.3 : DIAGONALE ---\n");
    int mat[4][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12},
        {13, 14, 15, 16}
    };

    afficher_diagonales(4, 4, mat);
}

// --- 1.4 Somme Totale ---
void afficher_statistiques(int L, int C, int notes[L][C]) {
    int somme = 0;
    
    for(int i = 0; i < L; i++) {
        for(int j = 0; j < C; j++) {
            somme += notes[i][j];
        }
    }

    float moyenne = (float)somme / (float)(L * C);
    printf("Somme totale : %d\n", somme);
    printf("Moyenne globale : %.2f\n", moyenne);
}

void exo_1_4_somme_totale() {
    printf("\n--- EXERCICE 1.4 : SOMME TOTALE ---\n");
    int notes[3][5] = {
        {10, 12, 15, 8, 11},
        {14, 16, 18, 12, 13},
        {9, 11, 10, 8, 14}
    };

    afficher_statistiques(3, 5, notes);
}

// --- 1.5 Damier ---
void generer_damier(int L, int C, int damier[L][C]) {
    for(int i = 0; i < L; i++) {
        for(int j = 0; j < C; j++) {
            if((i + j) % 2 == 0) {
                damier[i][j] = 1; // Case noire
            } else {
                damier[i][j] = 0; // Case blanche
            }
        }
    }
}

void afficher_damier(int L, int C, int damier[L][C]) {
    printf("--- Damier ---\n");
    for(int i = 0; i < L; i++) {
        for(int j = 0; j < C; j++) {
            printf("%d ", damier[i][j]); 
        }
        printf("\n");
    }
}

void exo_1_5_damier() {
    printf("\n--- EXERCICE 1.5 : DAMIER ---\n");
    int damier[8][8];

    generer_damier(8, 8, damier);
    afficher_damier(8, 8, damier);
}

// ==========================================
// NIVEAU 2
// ==========================================

// --- 2.1 Sommes ---
void afficher_sommes_lignes(int L, int C, int mat[L][C]) {
    for(int i = 0; i < L; i++) {
        int somme = 0;
        for(int j = 0; j < C; j++) {
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
    afficher_sommes_lignes(3, 4, matrice);
}

// --- 2.2 Maximum ---
void trouver_et_afficher_maximum(int L, int C, int matrice[L][C]) {
    int max = matrice[0][0];
    int max_i = 0, max_j = 0;

    for(int i = 0; i < L; i++) {
        for(int j = 0; j < C; j++) {
            if(matrice[i][j] > max) {
                max = matrice[i][j];
                max_i = i;
                max_j = j;
            }
        }
    }

    printf("Le maximum est %d à la position [%d][%d]\n", max, max_i, max_j);
}

void exo_2_2_maximum() {
    printf("\n--- EXERCICE 2.2 : MAXIMUM ---\n");
    int matrice[3][4] = {
        {12, 45, 78, 23},
        {56, 99, 12, 34}, // Max est ici (99)
        {10, 20, 30, 40}
    };

    trouver_et_afficher_maximum(3, 4, matrice);
}

// --- 2.3 Transposée ---
void afficher_transposee(int L, int C, int mat[L][C]) {
    printf("--- Transposée ---\n");
    for(int i = 0; i < L; i++) {
        for(int j = 0; j < C; j++) {
            // On affiche mat[j][i] au lieu de mat[i][j]
            // Attention : pour une transposée visuelle d'une matrice carrée ou rectangulaire
            // Ici l'exercice initial était carré [3][3].
            // Si on veut afficher la transposée, on itère sur les colonnes puis les lignes de l'originale
            // Ou on considère que c'est une matrice carrée pour l'échange d'indices simple.
            // L'énoncé initial disait "inverser lignes et colonnes" avec exemple carré.
            // Pour être générique : on parcourt C lignes et L colonnes pour l'affichage.
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
    afficher_transposee(3, 3, matrice);
}

// --- 2.4 Symétrie ---
int est_symetrique(int L, int C, int mat[L][C]) {
    if (L != C) return 0; // Une matrice non carrée ne peut pas être symétrique

    for(int i = 0; i < L; i++) {
        for(int j = 0; j < C; j++) {
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

    printf("Test symétrique : %s\n", est_symetrique(3, 3, sym) ? "OUI" : "NON");
    printf("Test non symétrique : %s\n", est_symetrique(3, 3, pas_sym) ? "OUI" : "NON");
}

// --- 2.5 Recherche ---
int contient_valeur(int L, int C, int mat[L][C], int valeur) {
    for(int i = 0; i < L; i++) {
        for(int j = 0; j < C; j++) {
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

    if(contient_valeur(3, 4, grille, cible)) {
        printf("Le nombre %d est dans la grille !\n", cible);
    } else {
        printf("Le nombre %d n'est pas là.\n", cible);
    }
}

// ==========================================
// NIVEAU 3
// ==========================================

// --- 3.1 Malloc ---
int **allouer_matrice(int L, int C) {
    int **matrice = (int **)malloc(L * sizeof(int *));
    for(int i = 0; i < L; i++) {
        matrice[i] = (int *)malloc(C * sizeof(int));
    }
    return matrice;
}

void remplir_matrice_sequentielle(int **matrice, int L, int C) {
    int compteur = 0;
    for(int i = 0; i < L; i++) {
        for(int j = 0; j < C; j++) {
            matrice[i][j] = compteur++;
        }
    }
}

void afficher_matrice_dynamique(int **matrice, int L, int C) {
    printf("\n--- Matrice Dynamique ---\n");
    for(int i = 0; i < L; i++) {
        for(int j = 0; j < C; j++) {
            printf("%3d ", matrice[i][j]);
        }
        printf("\n");
    }
}

void liberer_matrice(int **matrice, int L) {
    for(int i = 0; i < L; i++) {
        free(matrice[i]);
    }
    free(matrice);
}

void exo_3_1_malloc() {
    printf("\n--- EXERCICE 3.1 : MALLOC ---\n");
    int L, C;
    printf("Nombre de lignes ? ");
    scanf("%d", &L);
    printf("Nombre de colonnes ? ");
    scanf("%d", &C);

    // 1. Allocation
    int **matrice = allouer_matrice(L, C);

    // 2. Remplissage
    remplir_matrice_sequentielle(matrice, L, C);

    // 3. Affichage
    afficher_matrice_dynamique(matrice, L, C);

    // 4. Libération
    liberer_matrice(matrice, L);
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

void afficher_matrice_identite(int **id, int N) {
    printf("Matrice Identité de taille %d :\n", N);
    for(int i = 0; i < N; i++) {
        for(int j = 0; j < N; j++) {
            printf("%d ", id[i][j]);
        }
        printf("\n");
    }
}

void exo_3_2_identite() {
    printf("\n--- EXERCICE 3.2 : IDENTITE ---\n");
    int N = 5;
    int **id = creer_matrice_identite(N);

    afficher_matrice_identite(id, N);
    liberer_matrice(id, N);
}

// --- 3.3 Pascal ---
int **creer_triangle_pascal(int H) {
    int **triangle = (int **)malloc(H * sizeof(int *));

    for(int i = 0; i < H; i++) {
        triangle[i] = (int *)malloc((i + 1) * sizeof(int));
        
        triangle[i][0] = 1;
        triangle[i][i] = 1;
        
        for(int j = 1; j < i; j++) {
            triangle[i][j] = triangle[i-1][j-1] + triangle[i-1][j];
        }
    }
    return triangle;
}

void afficher_triangle_pascal(int **triangle, int H) {
    for(int i = 0; i < H; i++) {
        for(int j = 0; j <= i; j++) {
            printf("%d ", triangle[i][j]);
        }
        printf("\n");
    }
}

void exo_3_3_pascal() {
    printf("\n--- EXERCICE 3.3 : PASCAL ---\n");
    int H;
    printf("Hauteur du triangle ? ");
    scanf("%d", &H);

    int **triangle = creer_triangle_pascal(H);
    afficher_triangle_pascal(triangle, H);
    liberer_matrice(triangle, H);
}
