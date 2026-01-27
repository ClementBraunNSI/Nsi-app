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
    <Verification>
    ```python
assert 'moyenne' in locals(), "La fonction 'moyenne' n'est pas définie."
assert callable(moyenne), "'moyenne' doit être une fonction."
assert moyenne(10, 20) == 15, "moyenne(10, 20) devrait renvoyer 15."
assert moyenne(0, 10) == 5, "moyenne(0, 10) devrait renvoyer 5."
    ```
    </Verification>
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
    <Verification>
assert 'est_pair' in locals(), "La fonction 'est_pair' n'est pas définie."
assert callable(est_pair), "'est_pair' doit être une fonction."
assert est_pair(4) is True, "est_pair(4) doit renvoyer True."
assert est_pair(5) is False, "est_pair(5) doit renvoyer False."
    </Verification>
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
    <Verification>
    ```python
assert 'afficher_somme' in locals(), "La fonction 'afficher_somme' n'est pas définie."
assert callable(afficher_somme), "'afficher_somme' doit être une fonction."
assert afficher_somme(2, 3) is None, "La fonction ne doit rien renvoyer (None)."
    ```
    </Verification>
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
    <Verification>
    ```python
assert 'parite' in locals(), "La fonction 'parite' n'est pas définie."
assert callable(parite), "'parite' doit être une fonction."
assert parite(8) is True, "parite(8) doit renvoyer True."
assert parite(7) is False, "parite(7) doit renvoyer False."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>