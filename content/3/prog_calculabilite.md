---
title: Calculabilité et Décidabilité
description: 'Limites de l''informatique : ce qui peut être calculé ou non.'
level: TNSI
order: 100
chapter: Langages et Programmation
icon: "octagon-x"
badgeId: terminale_calculabilite
prerequisites:
  - prog_recursivite
audience: public
---

# Calculabilité et décidabilité

On a parfois l'impression qu'un ordinateur assez puissant finira par répondre à n'importe quelle question, pourvu qu'on lui laisse du temps. En 1936, Alan Turing montre que ce n'est pas le cas : il existe des problèmes pour lesquels aucun algorithme ne peut donner la réponse. Cette limite ne vient ni de la mémoire ni de la vitesse des machines, mais du calcul lui-même.

## La machine de Turing

La **machine de Turing** est un modèle théorique, volontairement simple. Elle a un **ruban** infini, découpé en cases, qui lui sert de mémoire. Une **tête** lit et écrit une case, puis se déplace d'un cran. Un **état** interne indique où elle en est de son calcul. Enfin, une **table de transition** précise, pour chaque état et chaque symbole lu, ce qu'il faut écrire, de quel côté se déplacer et dans quel état passer. Cette table est le programme.

La thèse de Church-Turing affirme que tout ce qu'un algorithme peut calculer, une machine de Turing peut le calculer. Un ordinateur n'est donc pas « plus puissant » qu'elle, au sens où il ne peut pas calculer davantage de choses : il est seulement plus pratique et plus rapide. S'il existe un problème qu'aucune machine de Turing ne résout, aucun langage de programmation ne le résoudra non plus.

## Calculabilité et décidabilité

Un problème est **calculable** s'il existe un algorithme, donc une machine de Turing, qui produit la réponse en un temps fini. Trier une liste ou trouver un plus court chemin sont des problèmes calculables, car on connaît des algorithmes qui s'arrêtent, même si le calcul peut être long pour de très grandes données.

Un problème de **décision** ne demande qu'un oui ou un non. Il est **décidable** s'il existe un algorithme qui, pour n'importe quelle entrée, répond correctement et s'arrête. Pour qu'un problème soit décidable, il faut donc une méthode qui se termine toujours.

## Le problème de l'arrêt

La question est la suivante : peut-on écrire un programme `TestArret(P, E)` qui reçoit un programme `P` et une entrée `E`, et qui dit si `P`, lancé sur `E`, va s'arrêter, ou s'il va boucler indéfiniment ?

La réponse est non. Ce problème est **indécidable**.

On le montre par l'absurde. Supposons que `TestArret` existe et ne se trompe jamais. On construit alors un programme `Paradoxe(P)` qui l'utilise de la façon suivante :

1. Il appelle `TestArret(P, P)`.
2. Si `TestArret` annonce que `P` s'arrête, `Paradoxe` entre dans une boucle infinie, `while True: pass`.
3. Si `TestArret` annonce que `P` boucle, `Paradoxe` s'arrête tout de suite.

On lance alors `Paradoxe(Paradoxe)`. `TestArret(Paradoxe, Paradoxe)` doit dire soit « il s'arrête », soit « il boucle ».

Si elle dit « il s'arrête », la règle 2 fait entrer `Paradoxe` dans une boucle. Il ne s'arrête donc pas. La réponse était fausse.

Si elle dit « il boucle », la règle 3 fait s'arrêter `Paradoxe` immédiatement. Il ne boucle donc pas. La réponse était fausse aussi.

Les deux branches se contredisent. L'hypothèse de départ est donc fausse : `TestArret` ne peut pas exister. Aucun programme ne peut, pour tous les programmes et toutes les entrées, prédire l'arrêt.

Un ordinateur plus rapide, ou même quantique, ne permet pas de contourner ce résultat, car il exécuterait le même type d'algorithmes. Le problème ne vient pas de la durée du calcul, mais du fait qu'aucune méthode générale ne peut se terminer en donnant toujours la bonne réponse.

---

<ExerciseTabs courseId="terminale_calculabilite" courseTitle="Quiz Turing">

  <ExerciseSection id="calc-ex-1" label="Vrai ou Faux" type="lecture">
    <Enonce>
    ### Questions de compréhension
    1.  Une machine de Turing est moins puissante qu'un PC moderne. (Vrai/Faux)
    2.  Le problème de l'arrêt est indécidable. (Vrai/Faux)
    3.  Un problème indécidable le sera toujours, même avec un ordinateur quantique surpuissant. (Vrai/Faux)
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
