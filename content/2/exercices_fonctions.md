---
title: "Exercices : Les Fonctions"
chapter: "Introduction à Python"
badgeId: "les-fonctions-python"
meta: "Définition, Paramètres et Valeurs de retour"
---

{/* L'id 'les-fonctions-python' doit correspondre à l'identifiant 
  utilisé dans votre base de données pour cette fiche précise. 
*/}
<ExerciseTabs courseId="les-fonctions-python" courseTitle="Les Fonctions">
  
  <ExerciseSection id="fonctions-1-1" label="1.1 - Calcul de la moyenne">
    <Enonce>
    ### Exercice 1.1 : Calcul de la moyenne
    **Écrire une fonction `moyenne` qui prend deux nombres en paramètres et renvoie leur moyenne.**

    <Correction>
    ```python
    def moyenne(a, b):
        return (a + b) / 2
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="fonctions-2-1" label="2.1 - Fonction est_pair (En-tête)">
    <Enonce>
    ### Exercice 2.1 : Fonction est_pair (En-tête)
    **Écrire l'en-tête d'une fonction `est_pair` qui prend en paramètre un nombre entier et renvoie un booléen.**

    <Correction>
    ```python
    def est_pair(n: int) -> bool:
        # L'en-tête est la ligne au-dessus
        return n % 2 == 0
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="fonctions-2-2" label="2.2 - Afficher la somme">
    <Enonce>
    ### Exercice 2.2 : Afficher la somme
    **Écrire l'en-tête d'une fonction `afficher_somme` qui prend deux nombres en paramètres et ne renvoie rien (procédure).**

    <Correction>
    ```python
    def afficher_somme(a, b) -> None:
        print(a + b)
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="fonctions-3-1" label="3.1 - Fonction parité">
    <Enonce>
    ### Exercice 3.1 : Fonction parité
    **Écrire une fonction `parite` qui prend un entier en paramètre et renvoie `True` si le nombre est pair, `False` sinon. Utilisez le type hinting.**
    *Exemple : parite(7) doit renvoyer False.*

    <Correction>
    ```python
    def parite(nombre: int) -> bool:
        return nombre % 2 == 0
    ```
    </Correction>
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>