---
title: 'Algorithmique : Diviser pour Régner'
description: 'Méthode de résolution par décomposition (Tri fusion, etc.).'
level: TNSI
order: 120
chapter: Algorithmique
icon: "scissors"
badgeId: terminale_diviser_regner
prerequisites:
  - algo_recherche_textuelle
audience: public
---

# Diviser pour régner

La méthode **diviser pour régner** consiste à ne pas résoudre un gros problème d'un seul coup. On le **découpe** d'abord en sous-problèmes plus petits, de même nature. On **résout** ensuite ces sous-problèmes, en général avec le même algorithme, donc par un appel récursif, jusqu'à obtenir des cas assez petits pour être résolus directement. On **combine** enfin les solutions partielles pour obtenir la solution du problème de départ. Les trois étapes sont nécessaires : tant que les solutions ne sont pas recombinées, le problème n'est pas résolu.

## Le tri fusion

Pour trier une liste, le **tri fusion** coupe la liste en deux moitiés. Il trie la moitié gauche par un appel récursif, puis la moitié droite. Une liste d'un seul élément, ou une liste vide, est déjà triée : c'est le cas de base, où l'on arrête de couper. Il reste alors à **fusionner** deux listes triées en une seule liste triée.

La fusion ne trie pas tout à nouveau : elle compare les premiers éléments des deux listes, prend le plus petit, puis recommence. Chaque élément n'est examiné qu'une fois. Fusionner deux listes de taille $n/2$ coûte donc un temps proportionnel à $n$.

Le coût total dépend du découpage. Il y a environ $\log_2 n$ étages de coupes, et à chaque étage l'ensemble des fusions parcourt les $n$ éléments. La complexité est **toujours** $O(n \log n)$, dans le meilleur des cas comme dans le pire. Le tri par insertion et le tri par sélection sont, eux, en $O(n^2)$ dans le pire des cas, car ils refont des comparaisons sur des portions déjà examinées. Le tri fusion utilise en revanche une liste auxiliaire pour la fusion, mais garantit toujours une complexité en $n \log n$.

## Faire pivoter une image carrée

Le même schéma s'applique à une image carrée qu'on veut tourner de 90 degrés. On la découpe en quatre quadrants : haut-gauche, haut-droit, bas-gauche, bas-droit. On tourne chaque quadrant par un appel récursif. Puis on déplace les quatre blocs : le haut-gauche va en haut-droite, le haut-droit en bas-droite, le bas-droit en bas-gauche, le bas-gauche en haut-gauche. Le cas de base est un quadrant d'un seul pixel, qu'il n'est pas nécessaire de faire pivoter. Ici, c'est le déplacement des quadrants qui constitue l'étape de combinaison.

## Le cas de la dichotomie

La recherche dichotomique vue en Première repose sur la même idée, en plus simple. On coupe la zone en deux, mais on **écarte** une moitié au lieu de résoudre les deux. Il n'y a donc rien à combiner, puisque la réponse est celle de la moitié conservée. On parle tout de même de diviser pour régner, avec une étape de combinaison vide. Ce n'est pas le cas du tri fusion, où les deux moitiés sont traitées et où la fusion est indispensable.

<ExerciseTabs courseId="terminale_diviser_regner" courseTitle="Exos Diviser Régner">

  <ExerciseSection id="div-ex-1" label="Fusion de listes" type="python">
    <Enonce>
    ### Algorithme de Fusion
    On dispose de deux listes **déjà triées** :
    `L1 = [1, 3, 5, 7]` et `L2 = [2, 4, 6, 8]`
    
    Écrire une fonction `fusion(l1, l2)` qui renvoie une seule liste triée `[1, 2, 3, 4, 5, 6, 7, 8]` en parcourant les listes une seule fois.

    <Correction>
    ```python
    def fusion(l1, l2):
        resultat = []
        i, j = 0, 0
        while i < len(l1) and j < len(l2):
            if l1[i] <= l2[j]:
                resultat.append(l1[i])
                i += 1
            else:
                resultat.append(l2[j])
                j += 1
        return resultat + l1[i:] + l2[j:]
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert fusion([1, 3, 5, 7], [2, 4, 6, 8]) == [1, 2, 3, 4, 5, 6, 7, 8], "fusion([1, 3, 5, 7], [2, 4, 6, 8]) doit renvoyer [1, 2, 3, 4, 5, 6, 7, 8]."
    assert fusion([], [1, 2]) == [1, 2], "Une liste vide : on renvoie l'autre liste."
    assert fusion([1, 2, 9], []) == [1, 2, 9], "Une liste vide : on renvoie l'autre liste."
    assert fusion([1, 4, 4], [2, 4]) == [1, 2, 4, 4, 4], "Les doublons sont gardés."
    assert fusion([5, 6, 7], [1, 2]) == [1, 2, 5, 6, 7], "Les éléments restants de la plus longue liste sont ajoutés à la fin."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
