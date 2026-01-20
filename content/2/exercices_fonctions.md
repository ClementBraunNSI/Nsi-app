---
title: "Exercices : Les Fonctions"
chapter: "Introduction à Python"
meta: "Définition, Paramètres et Valeurs de retour"
---

<ExerciseTabs>
  <ExerciseSection id="intro" label="1. Introduction">
    ## Concept de fonction

    ### Exercice 1.1 : Calcul de la moyenne
    **Écrire une fonction `moyenne` qui prend deux nombres en paramètres et renvoie leur moyenne.**

    <Correction>
    ```python
    def moyenne(a, b):
        return (a + b) / 2
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="easy" label="2. Niveau Facile">
    ## En-têtes et signatures

    ### Exercice 2.1 : Fonction est_pair (En-tête)
    **Écrire l'en-tête d'une fonction `est_pair` qui prend en paramètre un nombre entier et renvoie un booléen.**

    <Correction>
    ```python
    def est_pair(n: int) -> bool:
        # L'en-tête est la ligne au-dessus
        return n % 2 == 0
    ```
    </Correction>

    ### Exercice 2.2 : Afficher la somme
    **Écrire l'en-tête d'une fonction `afficher_somme` qui prend deux nombres en paramètres et ne renvoie rien (procédure).**

    <Correction>
    ```python
    def afficher_somme(a, b) -> None:
        print(a + b)
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="hard" label="3. Niveau Difficile">
    ## Logique et types

    ### Exercice 3.1 : Fonction parité
    **Écrire une fonction `parite` qui prend un entier en paramètre et renvoie `True` si le nombre est pair, `False` sinon. Utilisez le type hinting.**
    *Exemple : parite(7) doit renvoyer False.*

    <Correction>
    ```python
    def parite(nombre: int) -> bool:
        return nombre % 2 == 0
    ```
    </Correction>
  </ExerciseSection>
</ExerciseTabs>