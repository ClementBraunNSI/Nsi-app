---
title: "Graphes"
description: "Modélisation de réseaux, sommets, arêtes et algorithmes."
level: terminale
chapter: "Structures de données"
icon: "🕸️"
badgeId: "terminale_graphes"
---

# 🕸️ Les Graphes

Les graphes sont des structures relationnelles permettant de modéliser des réseaux complexes : réseaux sociaux, cartes routières, réseaux informatiques, liens web, etc.

## 1. Définitions

Un graphe $G = (S, A)$ est composé de :
*   **S (Sommets)** : Les nœuds du réseau (ex: Villes, Utilisateurs).
*   **A (Arêtes/Arcs)** : Les liaisons entre les sommets.

### Types de Graphes
*   **Non orienté** : Les liaisons sont bidirectionnelles (ex: "est ami avec"). On parle d'**arêtes**.
*   **Orienté** : Les liaisons ont un sens (ex: "suit sur Twitter"). On parle d'**arcs**.
*   **Pondéré** : Les liaisons ont un poids/coût (ex: distance en km).

## 2. Représentations en mémoire

Comment stocker un graphe dans un ordinateur ? Deux méthodes principales.

### 2.1 Matrice d'Adjacence
Un tableau 2D (grille) où `M[i][j] = 1` s'il y a une arête entre i et j, sinon 0.

| | A | B | C |
|---|---|---|---|
| **A** | 0 | 1 | 0 |
| **B** | 1 | 0 | 1 |
| **C** | 0 | 1 | 0 |

*   ✅ Accès rapide pour vérifier une liaison `(i, j)`.
*   ❌ Gourmand en mémoire si le graphe est creux (peu d'arêtes).

### 2.2 Liste d'Adjacence (Dictionnaire)
Un dictionnaire où chaque clé est un sommet, et la valeur est la liste de ses voisins.

```python
graphe = {
    "A": ["B"],
    "B": ["A", "C"],
    "C": ["B"]
}
```

*   ✅ Économe en mémoire.
*   ✅ Facile de parcourir les voisins d'un sommet.

## 3. Algorithmes de Parcours

Comme pour les arbres, on peut parcourir un graphe. Attention aux **cycles** (boucles) : il faut noter les sommets déjà visités pour ne pas tourner en rond !

### 3.1 Parcours en Largeur (BFS - Breadth First Search)
On explore en "ondes concentriques". Utile pour trouver le **plus court chemin** dans un graphe non pondéré (GPS simple).

### 3.2 Parcours en Profondeur (DFS - Depth First Search)
On part le plus loin possible avant de revenir. Utile pour résoudre des labyrinthes ou détecter des cycles.

---

<ExerciseTabs courseId="terminale_graphes" courseTitle="Exercices Graphes">

  <ExerciseSection id="graphe-ex-1" label="Implémentation">
    <Enonce>
    ### Création de Graphe
    On considère le graphe suivant (réseau social) :
    *   Alice est amie avec Bob et Charlie.
    *   Bob est ami avec Alice et David.
    *   Charlie est ami avec Alice.
    *   David est ami avec Bob.
    
    1.  Représentez ce graphe sous forme de dictionnaire d'adjacence.
    2.  Écrivez une fonction `sont_amis(graphe, p1, p2)` qui renvoie True s'ils sont connectés directement.
    
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="graphe-ex-2" label="Voisins">
    <Enonce>
    ### Trouver les voisins
    Écrivez une fonction `nb_amis(graphe, personne)` qui renvoie le nombre d'amis d'une personne.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
