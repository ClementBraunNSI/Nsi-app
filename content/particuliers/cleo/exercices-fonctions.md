---
title: C - Fonctions - Exercices
description: Organiser le code en fonctions réutilisables
level: particuliers
chapter: Programmation en C
icon: ⚙️
allowedStudents:
  - Cléo
prerequisites:
  - exercices-tableaux-2d
---

<ExerciseTabs courseId="c-fonctions" courseTitle="C - Fonctions">
  <ExerciseSection id="fonctions-1-1" label="1.1 - Introduction">
    <Enonce>
    ### Exercice 1.1 : Afficher Bonjour
    **Écrire une fonction `void dire_bonjour()` qui affiche simplement "Bonjour tout le monde !" suivi d'un saut de ligne.**

    <Correction>
    ```c
    #include <stdio.h>

    void dire_bonjour() {
        printf("Bonjour tout le monde !\n");
    }

    int main() {
        dire_bonjour();
        dire_bonjour();  // Peut être appelée plusieurs fois
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

  <ExerciseSection id="fonctions-1-2" label="1.2 - Fonctions avec paramètres">
    <Enonce>
    ### Exercice 1.2 : Calcul de l'aire
    **Écrire une fonction `float aire_rectangle(float longueur, float largeur)` qui renvoie l'aire du rectangle.**

    <Correction>
    ```c
    #include <stdio.h>

    float aire_rectangle(float longueur, float largeur) {
        return longueur * largeur;
    }

    int main() {
        float l = 5.5, L = 3.2;
        printf("Aire : %.2f m²\n", aire_rectangle(l, L));
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

  <ExerciseSection id="fonctions-1-3" label="1.3 - Fonctions avec retour">
    <Enonce>
    ### Exercice 1.3 : Somme de deux entiers
    **Écrire une fonction `int somme(int a, int b)` qui renvoie la somme de a et b.**

    <Correction>
    ```c
    #include <stdio.h>

    int somme(int a, int b) {
        return a + b;
    }

    int main() {
        int resultat = somme(5, 3);
        printf("5 + 3 = %d\n", resultat);
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
