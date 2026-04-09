---
title: C - Affectations & Types - Exercices
description: Exercices pratiques sur les variables et opérateurs en C
level: particuliers
chapter: Programmation en C
icon: "\U0001F4DD"
prerequisites:
  - cours-structures-controle
---

<ExerciseTabs courseId="c-affectations-types-exos" courseTitle="C - Affectations & Types - Exercices">
  <ExerciseSection id="exo-1-1" label="1.1 - Variables et types">
    <Enonce>
    ### Exercice 1.1 : Déclaration de variables
    **Déclarez et initialisez les variables suivantes :**
    - Un entier `age` avec la valeur 18
    - Un flottant `prix` avec la valeur 19.99
    - Un caractère `grade` avec la valeur 'A'
    - Affichez ces variables avec printf()

    <Correction>
    ```c
    #include <stdio.h>

    int main() {
        int age = 18;
        float prix = 19.99f;
        char grade = 'A';
        
        printf("Age : %d\n", age);
        printf("Prix : %.2f\n", prix);
        printf("Grade : %c\n", grade);
        
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

  <ExerciseSection id="exo-1-2" label="1.2 - Opérateurs arithmétiques">
    <Enonce>
    ### Exercice 1.2 : Calculs simples
    **Créez un programme qui :**
    - Déclare deux entiers `a = 15` et `b = 7`
    - Calcule et affiche leur somme, différence, produit et quotient
    - Calcule et affiche le reste de la division

    <Correction>
    ```c
    #include <stdio.h>

    int main() {
        int a = 15, b = 7;
        
        printf("a = %d, b = %d\n", a, b);
        printf("Somme : %d\n", a + b);
        printf("Différence : %d\n", a - b);
        printf("Produit : %d\n", a * b);
        printf("Quotient : %d\n", a / b);
        printf("Reste : %d\n", a % b);
        
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

  <ExerciseSection id="exo-1-3" label="1.3 - Entrées utilisateur">
    <Enonce>
    ### Exercice 1.3 : Saisie et calcul
    **Créez un programme qui :**
    - Demande à l'utilisateur son âge
    - Demande l'âge d'un ami
    - Calcule et affiche la somme des âges
    - Calcule et affiche la différence d'âge

    <Correction>
    ```c
    #include <stdio.h>

    int main() {
        int age1, age2;
        
        printf("Quel est votre âge ? ");
        scanf("%d", &age1);
        
        printf("Quel est l'âge de votre ami ? ");
        scanf("%d", &age2);
        
        printf("Somme des âges : %d\n", age1 + age2);
        printf("Différence d'âge : %d\n", age1 - age2);
        
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
