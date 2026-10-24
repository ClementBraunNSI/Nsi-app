---
title: 'Algorithmique : Diviser pour Régner'
description: 'Méthode de résolution par décomposition (Tri fusion, etc.).'
level: TNSI
order: 120
chapter: Algorithmique
icon: "\U0001F52A"
badgeId: terminale_diviser_regner
prerequisites:
  - algo_recherche_textuelle
audience: public
---

# Diviser pour régner

**Diviser pour régner**, c'est refuser de résoudre le gros problème d'un coup. On le **découpe** en sous-problèmes de la même nature, plus petits. On **résout** ces sous-problèmes, en général par le même algorithme, donc par un appel récursif, jusqu'à des cas assez petits pour répondre directement. On **combine** ensuite les solutions partielles pour obtenir la solution du problème de départ. Les trois verbes comptent. Un découpage qui ne se recombine pas n'a pas fini le travail.

## Le tri fusion

Pour trier une liste, le **tri fusion** coupe la liste en deux moitiés. Il trie la moitié gauche par un appel récursif, puis la moitié droite. Une liste d'un seul élément, ou une liste vide, est déjà triée : c'est le cas de base, on ne coupe plus. Reste à **fusionner** deux listes triées en une seule liste triée.

La fusion ne retrie pas tout. Elle compare les têtes des deux listes, prend la plus petite, et recommence. Chaque élément est regardé une fois. Fusionner deux listes de taille $n/2$ coûte donc un temps proportionnel à $n$.

Le coût total suit le découpage. Il y a environ $\log_2 n$ étages de coupes, et à chaque étage l'ensemble des fusions parcourt les $n$ éléments. La complexité est **toujours** $O(n \log n)$, dans le meilleur des cas comme dans le pire. Le tri par insertion et le tri par sélection, eux, sont en $O(n^2)$ dans le pire des cas : ils recommencent des comparaisons sur des portions déjà vues. Le tri fusion paie le prix d'une liste auxiliaire pour la fusion, et gagne la régularité du $n \log n$.

## Tourner une image carrée

Le même schéma s'applique à une image carrée qu'on veut tourner de 90 degrés. On la découpe en quatre quadrants : haut-gauche, haut-droit, bas-gauche, bas-droit. On tourne chaque quadrant par un appel récursif. Puis on déplace les quatre blocs : le haut-gauche va en haut-droite, le haut-droit en bas-droite, le bas-droit en bas-gauche, le bas-gauche en haut-gauche. Le cas de base est un quadrant d'un pixel, qu'il n'y a pas à tourner. Diviser, régner, combiner : le déplacement des quadrants est l'étape qui recompose l'image.

## La dichotomie, presque

La recherche dichotomique vue en Première est du même esprit, avec une économie. On coupe la zone en deux, et l'on **jette** une moitié au lieu de résoudre les deux. Il n'y a rien à combiner : la réponse est celle de la moitié conservée. On parle encore de diviser pour régner, en notant que l'étape « combiner » est vide. Ce n'est pas le cas du tri fusion, où les deux moitiés travaillent et où la fusion est indispensable.

<ExerciseTabs courseId="terminale_diviser_regner" courseTitle="Exos Diviser Régner">

  <ExerciseSection id="div-ex-1" label="Fusion de listes" type="python">
    <Enonce>
    ### Algorithme de Fusion
    On dispose de deux listes **déjà triées** :
    `L1 = [1, 3, 5, 7]` et `L2 = [2, 4, 6, 8]`
    
    Écrivez une fonction `fusion(l1, l2)` qui renvoie une seule liste triée `[1, 2, 3, 4, 5, 6, 7, 8]` en parcourant les listes une seule fois.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
