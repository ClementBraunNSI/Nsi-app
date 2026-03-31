---
title: 'Réseaux : Protocoles de Routage'
description: 'Comment les paquets trouvent leur chemin sur Internet (RIP, OSPF).'
level: terminale
chapter: 'Architectures matérielles, OS & Réseaux'
icon: "\U0001F310"
badgeId: terminale_routage
prerequisites:
  - archi_soc
---

# 🌐 Protocoles de Routage

Internet est un maillage de réseaux interconnectés par des **routeurs**.
Quand vous envoyez une donnée, elle doit trouver le "meilleur chemin" pour arriver à destination. C'est le rôle des **protocoles de routage**.

## 1. Tables de Routage

Chaque routeur possède une **table de routage** qui lui dit : "Pour aller vers telle adresse IP, passe par telle interface (ou tel voisin)".
Ces tables peuvent être :
*   **Statiques** : Configurées manuellement (simple mais pas robuste aux pannes).
*   **Dynamiques** : Mises à jour automatiquement par des protocoles (RIP, OSPF).

## 2. RIP (Routing Information Protocol)

*   **Type** : Vecteur de distance.
*   **Métrique** : Le **nombre de sauts** (hop count). C'est-à-dire le nombre de routeurs à traverser.
*   **Fonctionnement** : Chaque routeur envoie sa table à ses voisins toutes les 30s.
*   **Limite** : Max 15 sauts (au-delà, c'est considéré inaccessible).
*   **Avantage** : Simple.
*   **Inconvénient** : Ne prend pas en compte la vitesse de la liaison (il préfère 1 saut lent à 2 sauts très rapides).

## 3. OSPF (Open Shortest Path First)

*   **Type** : État de liens (Link State).
*   **Métrique** : Le **coût** (souvent inversement proportionnel à la bande passante : `10^8 / débit`).
*   **Fonctionnement** : Chaque routeur connaît la topologie complète du réseau (carte) et calcule le chemin le plus rapide avec l'algorithme de **Dijkstra**.
*   **Avantage** : Très efficace, choisit vraiment le chemin le plus rapide.
*   **Inconvénient** : Plus complexe, demande plus de calcul CPU aux routeurs.

---

<ExerciseTabs courseId="terminale_routage" courseTitle="Exercices Routage">

  <ExerciseSection id="routage-ex-1" label="Comparaison RIP/OSPF">
    <Enonce>
    ### Choix du chemin
    On veut aller de A à B.
    *   Chemin 1 : Passe par R1 (1 saut), débit 56 kbps (très lent).
    *   Chemin 2 : Passe par R2 et R3 (2 sauts), débit 1 Gbps (fibre optique).
    
    1.  Quel chemin choisit RIP ?
    2.  Quel chemin choisit OSPF ?
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
