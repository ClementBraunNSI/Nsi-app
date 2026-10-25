---
title: Algorithmes de Recherche Textuelle
description: 'Recherche de motifs dans un texte : Naïf et Boyer-Moore.'
level: TNSI
order: 110
chapter: Algorithmique
icon: "search"
badgeId: terminale_algo_texte
prerequisites: []
audience: public
---

# Recherche textuelle

Le problème est celui de `Ctrl+F` ou de `grep` : trouver les occurrences d'un **motif** dans un **texte**. Le texte a une longueur $N$, le motif une longueur $M$. On veut les positions où les $M$ caractères du motif coïncident avec le texte. Tout l'enjeu est de ne pas tout recomparer à chaque décalage.

## Glisser d'un cran : la recherche naïve

On aligne le motif au début du texte. On compare les lettres une par une, de la gauche vers la droite. Au premier désaccord, on décale le motif d'**un seul cran**, et l'on recommence. On s'arrête quand le motif dépasse la fin du texte.

Dans le pire des cas, presque chaque position coûte $M$ comparaisons. Le texte `AAAAAAAA` et le motif `AAAB` en sont l'image : on échoue sur la dernière lettre, après avoir reconnu tout le début, puis on recommence un cran plus loin. La complexité est $O(N \times M)$. Sur un génome, ou sur un livre entier, ce produit se fait sentir.

## Boyer-Moore : comparer par la fin

L'algorithme de **Boyer-Moore**, dans la version simplifiée du cours, compare d'abord la **dernière** lettre du motif. Un désaccord renseigne sur un saut, parfois bien plus long qu'un cran. C'est la règle du **mauvais caractère**.

On est alignés sur une fenêtre du texte. La lettre du texte en face de la fin du motif est $X$.

Si $X$ n'apparaît **nulle part** dans le motif, aucune fenêtre qui recouvrirait encore ce $X$ ne peut réussir. On saute de toute la longueur du motif.

Si $X$ apparaît dans le motif, on décale pour aligner ce $X$ du texte avec une occurrence de $X$ dans le motif. On ne teste pas les positions intermédiaires : elles échoueraient sur cette lettre.

Prenons le texte `L'ALGORITHME` et le motif `RITHME`, de longueur 6. La première fenêtre couvre `L'ALGO`. On compare par la fin : le `E` du motif est en face du `O`. Ce n'est pas la même lettre, et `O` n'est pas dans `RITHME`. On décale donc de 6. La fenêtre suivante tombe exactement sur `RITHME`, et la comparaison réussit. La recherche naïve, elle, aurait tenté les cinq alignements intermédiaires.

Dans le meilleur des cas, et c'est souvent le cas des textes ordinaires, chaque essai saute d'environ $M$ caractères. La complexité est alors **sous-linéaire**, de l'ordre de $O(N/M)$. Plus le motif est long, plus les sauts sont grands, et plus la recherche va vite. Ce n'est pas une borne pour le pire des cas : un motif et un texte mal accordés peuvent forcer beaucoup plus de comparaisons. La version complète de Boyer-Moore ajoute d'autres règles de décalage pour rester efficace même là. Au programme, la règle du mauvais caractère suffit à comprendre d'où vient le saut.

Pour préparer ces sauts, on calcule à l'avance la dernière position de chaque lettre dans le motif. Une lettre absente se marque par une sentinelle, par exemple $-1$. Au moment du désaccord, la table dit de combien décaler, sans reparcourir le motif.

<ExerciseTabs courseId="terminale_algo_texte" courseTitle="Exercices Boyer-Moore">

  <ExerciseSection id="texte-ex-1" label="Prétraitement" type="lecture">
    <Enonce>
    ### Table des sauts
    Pour Boyer-Moore, on pré-calcule un dictionnaire donnant la dernière position de chaque lettre dans le motif.
    
    Motif : `"BANANA"`
    Longueur : 6
    
    Remplir la table :
    *   `"A"` : dernière position ?
    *   `"N"` : dernière position ?
    *   `"B"` : dernière position ?
    *   Autres lettres : -1
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
