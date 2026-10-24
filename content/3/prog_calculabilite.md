---
title: Calculabilité et Décidabilité
description: 'Limites de l''informatique : ce qui peut être calculé ou non.'
level: TNSI
order: 100
chapter: Langages et Programmation
icon: "\U0001F6D1"
badgeId: terminale_calculabilite
prerequisites:
  - prog_recursivite
audience: public
---

# Calculabilité et décidabilité

On a parfois l'impression qu'un ordinateur assez puissant finira par répondre à n'importe quelle question, pourvu qu'on lui laisse du temps. Alan Turing, en 1936, montre que non. Il existe des problèmes pour lesquels aucun algorithme ne donnera la réponse. Ce n'est pas une question de mémoire ou de vitesse. C'est une limite du calcul lui-même.

## Une machine très pauvre, et pourtant suffisante

La **machine de Turing** est un modèle théorique, volontairement simple. Elle a un **ruban** infini, découpé en cases, qui lui sert de mémoire. Une **tête** lit et écrit une case, puis se déplace d'un cran. Un **état** interne retient où elle en est dans son raisonnement. Une **table de transition** dit, pour chaque état et chaque symbole lu, quoi écrire, de quel côté bouger, et dans quel état passer. Cette table est le programme.

La thèse de Church-Turing affirme que tout ce qu'un algorithme peut calculer, une machine de Turing peut le calculer. Votre ordinateur n'est pas « plus puissant » qu'elle au sens de ce qu'il peut finir par obtenir. Il est seulement plus commode, et plus rapide. S'il existe un problème qu'aucune machine de Turing ne résout, aucun langage de programmation ne le résoudra non plus.

## Calculable, décidable

Un problème est **calculable** s'il existe un algorithme, donc une machine de Turing, qui produit la réponse en un temps fini. Trier une liste, trouver un plus court chemin : on connaît des algorithmes qui s'arrêtent. Le problème est calculable, même si, pour de très grandes données, on n'a pas envie d'attendre.

Un problème de **décision** ne demande qu'un oui ou un non. Il est **décidable** s'il existe un algorithme qui, pour n'importe quelle entrée, répond correctement et s'arrête. Décidable est donc plus précis que « on saurait peut-être » : il faut une méthode qui termine toujours.

## Le problème de l'arrêt

La question est la suivante. Peut-on écrire un programme `TestArret(P, E)` qui reçoit un programme `P` et une entrée `E`, et qui dit si `P`, lancé sur `E`, va s'arrêter, ou s'il va boucler indéfiniment ?

La réponse est non. Ce problème est **indécidable**.

On le montre par l'absurde. Supposons que `TestArret` existe, et qu'il se trompe jamais. On construit alors un programme `Paradoxe(P)` qui s'en sert contre lui-même :

1. Il appelle `TestArret(P, P)`.
2. Si `TestArret` annonce que `P` s'arrête, `Paradoxe` entre dans une boucle infinie, `while True: pass`.
3. Si `TestArret` annonce que `P` boucle, `Paradoxe` s'arrête tout de suite.

Lançons `Paradoxe(Paradoxe)`. `TestArret(Paradoxe, Paradoxe)` doit dire soit « il s'arrête », soit « il boucle ».

Si elle dit « il s'arrête », la règle 2 fait entrer `Paradoxe` dans une boucle. Il ne s'arrête donc pas. La réponse était fausse.

Si elle dit « il boucle », la règle 3 fait s'arrêter `Paradoxe` immédiatement. Il ne boucle donc pas. La réponse était fausse aussi.

Les deux branches se contredisent. L'hypothèse de départ tombe : `TestArret` ne peut pas exister. Aucun programme ne peut, pour tous les programmes et toutes les entrées, prédire l'arrêt.

Un ordinateur plus rapide, ou quantique, ne contourne pas cela. Il exécuterait le même genre d'algorithmes. Le problème n'est pas la durée du calcul. C'est qu'aucune procédure générale ne termine en donnant toujours la bonne réponse.

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
