---
title: "Exercices : Spécification"
chapter: "Introduction à Python"
badgeId: "specifications-python"
meta: "Docstrings, Type Hinting et Documentation"
---

<ExerciseTabs courseId="specifications-python" courseTitle="Spécification">
  <ExerciseSection id="specs-1-1" label="1.1 - Documenter est_pair">
    <Enonce>
    ### Exercice 1.1 : Documenter est_pair
    **Ajouter une docstring complète à la fonction `est_pair` suivante :**
    ```python
    def est_pair(n):
        return n % 2 == 0
    ```

    <Correction>
    ```python
    def est_pair(n):
        """
        Détermine si un nombre est pair.
        Paramètres :
            n (int) : Le nombre à tester.
        Retourne :
            bool : True si n est pair, False sinon.
        """
        return n % 2 == 0
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="specs-2-1" label="2.1 - Spécification de compter_mots">
    <Enonce>
    ### Exercice 2.1 : Spécification de compter_mots
    **Proposer une spécification (docstring) pour la fonction `compter_mots` :**
    ```python
    def compter_mots(phrase):
        compteur = 1
        for carac in phrase:
            if carac == ' ':
                compteur = compteur + 1
        return compteur
    ```

    <Correction>
    ```python
    def compter_mots(phrase):
        """
        Compte le nombre de mots dans une phrase (basé sur les espaces).
        Paramètres :
            phrase (str) : La chaîne de caractères à analyser.
        Retourne :
            int : Le nombre de mots détectés.
        """
        compteur = 1
        for carac in phrase:
            if carac == ' ':
                compteur = compteur + 1
        return compteur
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="specs-2-2" label="2.2 - Spécification de surface">
    <Enonce>
    ### Exercice 2.2 : Spécification de surface
    **Proposer une spécification pour la fonction `surface` :**
    ```python
    def surface(rayon):
        pi = 3.14159
        aire = pi * rayon ** 2
        return aire
    ```

    <Correction>
    ```python
    def surface(rayon):
        """
        Calcule l'aire d'un disque à partir de son rayon.
        Paramètres :
            rayon (float) : Le rayon du disque.
        Retourne :
            float : L'aire du disque.
        """
        pi = 3.14159
        aire = pi * rayon ** 2
        return aire
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="specs-3-1" label="3.1 - Synthèse (Somme, Moyenne, Périmètre)">
    <Enonce>
    ### Exercice 3.1 : Somme, Moyenne et Périmètre
    **Écrivez les fonctions complètes (code + spécification) pour :**
    1. Calculer la somme d'une liste.
    2. Calculer la moyenne de deux nombres.
    3. Calculer le périmètre d'un rectangle.

    <Correction>
    ```python
    def calculer_somme_liste(liste_nombres):
        """
        Calcule la somme des éléments d'une liste de nombres.
        """
        somme = 0
        for nombre in liste_nombres:
            somme += nombre
        return somme

    def calculer_moyenne(a, b):
        """
        Calcule la moyenne de deux nombres.
        """
        return (a + b) / 2

    def calculer_perimetre_rectangle(longueur, largeur):
        """
        Calcule le périmètre d'un rectangle.
        """
        return 2 * (longueur + largeur)
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>