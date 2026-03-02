---
title: "Calculabilité et Décidabilité"
description: "Limites de l'informatique : ce qui peut être calculé ou non."
level: terminale
chapter: "Langages et Programmation"
icon: "🛑"
badgeId: "terminale_calculabilite"
---

# 🛑 Calculabilité et Décidabilité

L'ordinateur est-il tout puissant ? Peut-il résoudre n'importe quel problème mathématique ou logique ?
Alan Turing a prouvé en 1936 que la réponse est **NON**.

## 1. La Machine de Turing

C'est un modèle théorique d'ordinateur, très simple mais capable de calculer tout ce qui est calculable.
Elle est composée de :
*   Un **ruban infini** (mémoire) divisé en cases.
*   Une **tête de lecture/écriture** qui se déplace sur le ruban.
*   Un **registre d'état** (mémoire interne).
*   Une **table de transition** (le programme).

Thèse de Church-Turing : **Tout algorithme peut être exécuté par une machine de Turing.**

## 2. Calculabilité

Un problème est **calculable** s'il existe un algorithme (une machine de Turing) qui donne la réponse en un temps fini.
*   *Exemple calculable* : Trier une liste, trouver le plus court chemin.

## 3. Décidabilité

Un problème de décision (réponse OUI/NON) est **décidable** s'il existe un algorithme qui répond OUI ou NON correctement pour n'importe quelle entrée.

### Le Problème de l'Arrêt (Halting Problem)
Question : *Peut-on écrire un programme `TestArret(P, E)` qui prend un programme P et une entrée E, et qui dit si P va s'arrêter ou boucler à l'infini ?*

**Réponse : NON.** Ce problème est **indécidable**.

### Preuve par l'absurde (Paradoxe)
Imaginons que `TestArret` existe.
Créons un programme vicieux `Paradoxe(P)` :
1.  Il appelle `TestArret(P, P)`.
2.  Si `TestArret` dit "P s'arrête" -> `Paradoxe` entre dans une boucle infinie `while True: pass`.
3.  Si `TestArret` dit "P boucle" -> `Paradoxe` s'arrête immédiatement.

Maintenant, lançons `Paradoxe(Paradoxe)`.
*   S'il s'arrête -> Il devrait boucler.
*   S'il boucle -> Il devrait s'arrêter.
*   **Contradiction !** Donc `TestArret` ne peut pas exister.

## 4. Conclusion

Il existe des problèmes insolubles par ordinateur. L'informatique a des limites théoriques absolues.

---

<ExerciseTabs courseId="terminale_calculabilite" courseTitle="Quiz Turing">

  <ExerciseSection id="calc-ex-1" label="Vrai ou Faux">
    <Enonce>
    ### Questions de compréhension
    1.  Une machine de Turing est moins puissante qu'un PC moderne. (Vrai/Faux)
    2.  Le problème de l'arrêt est indécidable. (Vrai/Faux)
    3.  Un problème indécidable le sera toujours, même avec un ordinateur quantique surpuissant. (Vrai/Faux)
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
