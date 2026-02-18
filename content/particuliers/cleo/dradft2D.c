#include <stdlib.h>
#include <stdio.h>

int* max_tab_2D(int** tab, int nb_lignes, int nb_colonnes ){
    int ligne_maxi = 0;
    int valeur_maxi = tab[0][0];

    for (int i = 0 ; i < nb_lignes ; i++){
        for (int j = 0 ; j < nb_colonnes ; j ++){
            if (tab[i][j] > valeur_maxi){
                valeur_maxi = tab[i][j];
                ligne_maxi = i;
            }
        }
    }
    int* res = malloc(sizeof(int)*2);
    res[0] = ligne_maxi;
    res[1] = valeur_maxi;
    return res;
}

int* max_tab_2D_v2(int nb_lignes, int nb_colonnes, int matrice[nb_lignes][nb_colonnes]){
    int ligne_maxi = 0;
    int valeur_maxi = matrice[0][0];

    for (int i = 0 ; i < nb_lignes ; i++){
        for (int j = 0 ; j < nb_colonnes ; j ++){
            if (matrice[i][j] > valeur_maxi){
                valeur_maxi = matrice[i][j];
                ligne_maxi = i;
            }
        }
    }
    int* res = malloc(sizeof(int)*2);
    res[0] = valeur_maxi;
    res[1] =  ligne_maxi;
    return res;
}

void remplir_tables(int ligne, int colonne, int table[ligne][colonne] ){
    for (int i = 0 ; i < ligne ; i++){
        for (int j = 0 ; j < colonne ; j++){
            table[i][j] = (i+1)*(j+1);
        }
    }
}
void ajouter_coup_morpion(int ligne, int colonne, char symbole, int morpion[3][3]){
    morpion[ligne][colonne] = symbole;
}

int main(void){

    /*
    int mat[3][3] = {{1,2,3},{4,5,6},{7,8,9}};

    int* ptrs[3];
    for (int i = 0 ; i < 3; i++){
        ptrs[i] = mat[i];
    }

    int* maxis = max_tab_2D_v2(3, 3, mat);

    printf("%d ligne du maxi", maxis[1]);
    printf("%d valeur maxi", maxis[0]);
    free(maxis);*/

    int table[10][10];

    remplir_tables(10, 10, table);

    for(int i = 0; i < 10; i++){
        for (int j = 0 ; j < 10 ; j++){
            printf("%d ", table[i][j]);
        }
        printf("\n");
    }
}

