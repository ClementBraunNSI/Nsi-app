---
title: 'Algorithmes : Système de Vote'
description: 'Implémentation de différents systèmes de scrutin (Majoritaire, Condorcet)'
level: premiere
chapter: Projets
icon: "\U0001F5F3️"
badgeId: premiere_projet_vote
prerequisites: []
---

# 🗳️ Projet - Simulateur de Système de Vote

Dans ce projet, nous allons programmer un système de dépouillement de vote. Nous verrons que le mode de scrutin (la règle du jeu) peut changer le vainqueur, même avec les mêmes votes !

Ce projet touche à l'algorithmique et aux structures de données (listes, dictionnaires).

## 1. Scrutin Majoritaire à un tour

C'est le système le plus simple : celui qui a le plus de voix gagne.

<ExerciseTabs courseId="proj_vote_maj" courseTitle="Majoritaire">
  <ExerciseSection id="vote-maj-1" label="Modélisation">
    <Enonce>
      On représente les votes par une liste de candidats choisis par les électeurs.
      
      Exemple : `urnes = ["Alice", "Bob", "Alice", "Charlie", "Bob", "Alice"]`
      
      Créez une fonction `depouiller_majoritaire(urnes)` qui :
      1. Compte les voix pour chaque candidat (utilisez un dictionnaire).
      2. Affiche les résultats.
      3. Renvoie le nom du vainqueur.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Scrutin Majoritaire à deux tours

Si personne n'a la majorité absolue (> 50%), on organise un second tour entre les deux premiers.

<ExerciseTabs courseId="proj_vote_maj2" courseTitle="Deux Tours">
  <ExerciseSection id="vote-maj2-1" label="Premier Tour">
    <Enonce>
      Modifiez votre fonction précédente pour qu'elle renvoie les pourcentages de chaque candidat.
      
      Si un candidat a > 50%, il gagne.
      Sinon, identifiez les deux candidats ayant le plus de voix (les "finalistes").
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="vote-maj2-2" label="Second Tour">
    <Enonce>
      Pour le second tour, nous avons besoin des préférences des électeurs.
      Au lieu d'un seul nom, chaque électeur donne son classement.
      
      Exemple de bulletin : `["Alice", "Charlie", "Bob"]` (Alice préférée à Charlie, lui-même préféré à Bob).
      
      Créez une fonction `duel(bulletins, candidat1, candidat2)` qui :
      1. Parcourt tous les bulletins.
      2. Pour chaque bulletin, regarde qui est classé avant l'autre (entre candidat1 et candidat2).
      3. Compte les points.
      4. Détermine le gagnant du duel.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. Le Paradoxe de Condorcet 🤯

Un vainqueur de Condorcet est un candidat qui battrait *tous* les autres candidats en duel singulier.

<ExerciseTabs courseId="proj_vote_condorcet" courseTitle="Condorcet">
  <ExerciseSection id="vote-condorcet-1" label="Matrice de Duels">
    <Enonce>
      Créez une fonction `matrice_duels(bulletins, candidats)` qui organise tous les duels possibles.
      
      Exemple : Alice vs Bob, Alice vs Charlie, Bob vs Charlie.
      
      Pour chaque paire, utilisez votre fonction `duel` pour voir qui l'emporte.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="vote-condorcet-2" label="Vainqueur de Condorcet">
    <Enonce>
      Analysez les résultats :
      Existe-t-il un candidat qui a gagné **tous** ses duels ?
      
      Si oui, c'est le vainqueur de Condorcet. Affichez-le.
      Si non, on est dans une situation de "Paradoxe de Condorcet" (Pierre bat Feuille, Feuille bat Ciseaux, Ciseaux bat Pierre).
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Méthode de Borda 📊

La méthode de Borda est un système de vote pondéré. L'idée est de donner des points à chaque candidat en fonction de sa position dans le classement de chaque électeur.

<ExerciseTabs courseId="proj_vote_borda" courseTitle="Méthode de Borda">
  <ExerciseSection id="vote-borda-1" label="Calcul des points">
    <Enonce>
      On suppose qu'il y a $N$ candidats.
      Pour chaque bulletin de vote (qui est un classement) :
      *   Le 1er candidat reçoit $N-1$ points.
      *   Le 2ème reçoit $N-2$ points.
      *   ...
      *   Le dernier reçoit 0 point.

      Créez une fonction `calculer_borda(bulletins, candidats)` qui :
      1. Initialise les scores à 0.
      2. Parcourt chaque bulletin.
      3. Attribue les points correspondants.
      4. Renvoie le dictionnaire des scores.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="vote-borda-2" label="Comparaison">
    <Enonce>
      Utilisez vos trois méthodes (Majoritaire, Condorcet, Borda) sur le même ensemble de bulletins.
      
      Trouvez un exemple de votes où le vainqueur est différent selon la méthode utilisée !
      
      C'est ce qu'on appelle un **paradoxe électoral**.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 5. Pour aller plus loin 🚀

*   **Interface Graphique** : Utilisez `tkinter` ou `pygame` pour visualiser les résultats sous forme de diagrammes bâtons.
*   **Jugement Majoritaire** : Renseignez-vous sur cette méthode utilisée pour évaluer les candidats par "mentions" (Très bien, Bien, Assez bien...) plutôt que par classement.
