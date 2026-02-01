---
title: Algorithmes Gloutons
description: Introduction aux stratégies d'optimisation gloutonnes (Rendu de monnaie, Sac à dos)
level: Première
chapter: 8
icon: cookie
---

# Algorithmes Gloutons

## Définitions et Concepts

### Qu'est-ce qu'un algorithme glouton ?

Un **algorithme glouton** (Greedy Algorithm) est un algorithme qui suit une heuristique simple : faire le **meilleur choix local** à chaque étape, dans l'espoir que ces choix locaux mèneront à une **solution globale optimale**.

*   **Principe** : À chaque étape, on prend ce qui semble être le meilleur morceau, sans se soucier des conséquences futures.
*   **Avantage** : Souvent simple à programmer et très rapide.
*   **Inconvénient** : Ne donne pas toujours la solution optimale absolue (sauf pour certains problèmes spécifiques).

!!! quote "Analogie de l'Alpiniste"
    Un alpiniste veut atteindre le plus haut sommet. Une stratégie gloutonne consisterait à toujours monter la pente la plus raide devant lui. Cela peut l'amener à un pic local, mais pas forcément au sommet le plus haut de la chaîne de montagnes (il peut être bloqué sur une petite colline).

---

## Le Problème du Rendu de Monnaie

### Le Problème
On doit rendre une somme d'argent en utilisant le **minimum de pièces et billets** possible.

### Stratégie Gloutonne
La stratégie naturelle est celle que nous utilisons tous les jours :
1.  Prendre la plus grande pièce/billet dont la valeur est inférieure ou égale au montant restant.
2.  L'ajouter au rendu et soustraire sa valeur du montant.
3.  Répéter jusqu'à ce que le montant soit nul.

### Système Canonique
Avec le système monétaire européen (1, 2, 5, 10, 20, 50, 100...), l'algorithme glouton donne **toujours** la solution optimale. On dit que le système est **canonique**.

### Contre-Exemple (Système non canonique)
Imaginons un système de pièces : `{1, 3, 4}`.
Pour rendre **6** :
*   **Glouton** : Prend 4 (reste 2), puis 1, puis 1. -> **3 pièces** (4+1+1).
*   **Optimal** : Prendre 3, puis 3. -> **2 pièces** (3+3).
*   Ici, l'algorithme glouton n'est pas optimal !

### Implémentation Python

!!! example "Algorithme de Rendu de Monnaie"
    ```python
    def rendu_monnaie(montant, systeme):
        """
        Rend la monnaie sur le montant avec le système donné (liste décroissante).
        """
        pieces_rendues = []
        for piece in systeme:
            while montant >= piece:
                pieces_rendues.append(piece)
                montant = montant - piece
        return pieces_rendues

    # Test
    systeme_euro = [50, 20, 10, 5, 2, 1]
    print(rendu_monnaie(49, systeme_euro))
    # Résultat attendu : [20, 20, 5, 2, 2]
    ```

---

## Problème du Sac à Dos (Knapsack Problem)

### Le Problème
On dispose d'un sac à dos avec une capacité de poids maximale (ex: 15 kg).
On a une liste d'objets, chacun ayant un **poids** et une **valeur**.
Objectif : Remplir le sac pour maximiser la **valeur totale** sans dépasser le poids limite.

### Stratégies Gloutonnes Possibles
On peut choisir les objets selon plusieurs critères :
1.  **Prendre les plus précieux d'abord** : On risque de remplir le sac avec des objets lourds très vite.
2.  **Prendre les plus légers d'abord** : On aura beaucoup d'objets, mais peut-être de faible valeur.
3.  **Prendre le meilleur rapport Valeur/Poids** : C'est souvent la meilleure heuristique gloutonne.

### Exemple
Capacité : 15 kg.

| Objet | Poids (kg) | Valeur (€) | Rapport V/P |
| :--- | :---: | :---: | :---: |
| A | 12 | 100 | 8.3 |
| B | 4 | 40 | 10 |
| C | 4 | 40 | 10 |
| D | 4 | 40 | 10 |

*   **Glouton (Valeur)** : Prend A (100€, 12kg). Reste 3kg. Plus rien ne rentre. Total = **100€**.
*   **Optimal** : Prend B, C, D (4+4+4=12kg). Total = 40+40+40 = **120€**.

L'algorithme glouton ne garantit pas l'optimum pour le problème du sac à dos, mais donne une approximation rapide.

---

## Planification de Tâches

### Le Problème
On a un ensemble de tâches avec une heure de début et une heure de fin. On ne peut faire qu'une tâche à la fois.
Objectif : Sélectionner le maximum de tâches compatibles.

### Stratégie Gloutonne Efficace
Pour maximiser le nombre de tâches, la meilleure stratégie gloutonne est de **toujours choisir la tâche qui se termine le plus tôt** (parmi celles compatibles avec celles déjà choisies).

### Algorithme
1.  Trier les tâches par **heure de fin croissante**.
2.  Sélectionner la première tâche.
3.  Parcourir les suivantes : si la tâche commence après la fin de la dernière choisie, on la prend.

!!! example "Implémentation"
    ```python
    def planification_taches(taches):
        # taches est une liste de tuples (nom, debut, fin)
        # On trie par heure de fin (index 2)
        taches_triees = sorted(taches, key=lambda x: x[2])
        
        selection = []
        derniere_fin = 0
        
        for tache in taches_triees:
            nom, debut, fin = tache
            if debut >= derniere_fin:
                selection.append(tache)
                derniere_fin = fin
                
        return selection
    ```
