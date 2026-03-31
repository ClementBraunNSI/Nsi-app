---
title: C - Tableaux - Exercices
description: Exercices pratiques sur les tableaux en C
level: particuliers
chapter: Programmation en C
icon: "\U0001F4CA"
allowedStudents:
  - Cléo
prerequisites:
  - exercices-fonctions
---

<ExerciseTabs courseId="c-tableaux-exos" courseTitle="C - Tableaux - Exercices">
  <ExerciseSection id="exo-1-1" label="1.1 - Déclaration et initialisation">
    <Enonce>
    ### Exercice 1.1 : Créer et afficher un tableau
    **Créez un programme qui :**
    - Déclare un tableau de 5 entiers : `int nombres[5] = {3, 7, 1, 9, 4};`
    - Affiche tous les éléments du tableau
    - Affiche la somme des éléments

    <Correction>
    ```c
    #include <stdio.h>

    int main() {
        int nombres[5] = {3, 7, 1, 9, 4};
        int somme = 0;
        
        printf("Tableau : ");
        for (int i = 0; i < 5; i++) {
            printf("%d ", nombres[i]);
            somme += nombres[i];
        }
        printf("\n");
        printf("Somme : %d\n", somme);
        
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

  <ExerciseSection id="exo-1-2" label="1.2 - Recherche du maximum">
    <Enonce>
    ### Exercice 1.2 : Trouver le maximum
    **Créez un programme qui :**
    - Déclare un tableau de notes : `int notes[6] = {12, 15, 8, 19, 14, 16};`
    - Trouve et affiche la note maximale
    - Affiche l'indice de la note maximale

    <Correction>
    ```c
    #include <stdio.h>

    int main() {
        int notes[6] = {12, 15, 8, 19, 14, 16};
        int max = notes[0];
        int indice_max = 0;
        
        for (int i = 1; i < 6; i++) {
            if (notes[i] > max) {
                max = notes[i];
                indice_max = i;
            }
        }
        
        printf("Note maximale : %d\n", max);
        printf("Indice de la note max : %d\n", indice_max);
        
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

  <ExerciseSection id="exo-1-3" label="1.3 - Inversion d'un tableau">
    <Enonce>
    ### Exercice 1.3 : Inverser un tableau
    **Créez un programme qui :**
    - Déclare un tableau : `int tab[5] = {1, 2, 3, 4, 5};`
    - Crée un deuxième tableau contenant les éléments dans l'ordre inverse
    - Affiche les deux tableaux

    <Correction>
    ```c
    #include <stdio.h>

    int main() {
        int tab[5] = {1, 2, 3, 4, 5};
        int inverse[5];
        
        // Inversion
        for (int i = 0; i < 5; i++) {
            inverse[i] = tab[4 - i];
        }
        
        printf("Tableau original : ");
        for (int i = 0; i < 5; i++) {
            printf("%d ", tab[i]);
        }
        printf("\n");
        
        printf("Tableau inversé : ");
        for (int i = 0; i < 5; i++) {
            printf("%d ", inverse[i]);
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
</ExerciseTabs>
