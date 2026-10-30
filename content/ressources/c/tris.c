#include <stdio.h>
#include <stdlib.h>

int indice_mini(int* tab, int taille, int debut){
    int ind_mini = debut;

    for (int i = debut ; i < taille ; i++){
        if (tab[i] < tab[ind_mini]){
            ind_mini = i;
        }
    }
    return ind_mini;
}

void tri_selection(int* tab, int taille){
    for (int i = 0 ; i < taille ; i++){
        int ind_mini = indice_mini(tab, taille, i);
        int temp = tab[i];
        tab[i] = tab[ind_mini];
        tab[ind_mini] = temp;
    }
}

void inserer(int* tab, int taille, int debut){
    int i = debut;
    while (i > 0 && tab[i-1] > tab[i]){
        int temp = tab[i-1];
        tab[i-1] = tab[i];
        tab[i] = temp;
        i -=1;
    }
}

void tri_insertion(int* tab, int taille){
    for (int i = 1; i < taille; i++){
        inserer(tab, taille, i);
    }
}

int maxi(int* tab, int taille){
    int maximum = tab[0];
    for (int i = 0 ; i < taille; i++){
        if (tab[i] > maximum){
            maximum = tab[i];
        }
    }
    return maximum;
}

int* denombrement(int* tab, int taille, int maximum){
    int* compteur = malloc((maximum+1) * sizeof(int));
    for(int i = 0 ; i < maximum+1; i++){
        compteur[i] = 0;
    }

    for(int i = 0; i < taille; i++){
        compteur[tab[i]]++;
    }
    
    return compteur;
}

int* tri_denombrement(int* tab, int taille){
    int maximum = maxi(tab, taille);
    int* tab_denombrement = denombrement(tab, taille, maximum);
    int* tab_res = malloc(taille*sizeof(int));
    for (int i = 0 ; i < taille; i++){
        
        for(int j = 0; j < maximum+1; j++){
            if(tab_denombrement[j] > 0){
                tab_res[i] = j;
                tab_denombrement[j]--;
                break;
            }
        }
    }
    return tab_res;
}

void afficher_tableau(int* tab, int taille){
    for(int i = 0 ; i < taille ; i++){
        printf("%d ", tab[i]);
    }
    printf("\n");
}

int main(void){
    int tab[5] = {1,5,3,2,6};
    int taille = sizeof(tab)/sizeof(tab[0]); 
    int maximum = maxi(tab, taille);
    int* tab_denombrement = tri_denombrement(tab,taille);
    //tri_insertion(tab,taille );
    //tri_selection(tab, taille);
    afficher_tableau(tab_denombrement, taille);
}