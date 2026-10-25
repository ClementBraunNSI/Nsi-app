---
title: Graphes
description: 'Modélisation de réseaux, sommets, arêtes et algorithmes.'
level: TNSI
order: 180
chapter: Structures de données
icon: "network"
badgeId: terminale_graphes
prerequisites:
  - structures_arbres
audience: public
---

# Graphes

Un arbre a une racine, et un seul chemin entre deux nœuds. Beaucoup de situations refusent cette discipline. Deux villes sont reliées par plusieurs routes, deux comptes se suivent sans qu'il y ait de « sommet du réseau », une page web pointe vers une autre qui finit par revenir vers elle. On modélise cela par un **graphe**.

> Un graphe $G = (S, A)$ est un ensemble $S$ de **sommets** et un ensemble $A$ de liaisons entre ces sommets.

Les sommets sont les entités : des villes, des comptes, des machines. Les liaisons sont de plusieurs natures, et le vocabulaire change avec elles.

Si la relation va dans les deux sens, « est ami avec », « est relié par une route sans sens unique », le graphe est **non orienté** et les liaisons s'appellent des **arêtes**. Si la relation a un sens, « suit tel compte », « lien hypertexte vers », le graphe est **orienté** et l'on parle d'**arcs**. Si la liaison a un coût, des kilomètres, un temps, un prix, le graphe est **pondéré**. On peut être orienté et pondéré à la fois : une rue en sens unique, avec une longueur.

## Ranger un graphe en mémoire

Il faut choisir une structure, et le bon choix dépend du nombre de liaisons.

La **matrice d'adjacence** est un tableau à deux dimensions. `M[i][j]` vaut 1 s'il existe une arête entre i et j, et 0 sinon. Sur un graphe non orienté, la matrice est symétrique.

| | A | B | C |
|---|---|---|---|
| **A** | 0 | 1 | 0 |
| **B** | 1 | 0 | 1 |
| **C** | 0 | 1 | 0 |

Savoir si A et B sont reliés est immédiat : on lit une case. En revanche, un graphe de mille sommets et de quelques arêtes remplit presque entièrement la matrice de zéros. On paie un carré en mémoire pour peu d'information. On dit alors que le graphe est creux, et la matrice est un mauvais réflexe.

La **liste d'adjacence** ne stocke que les voisins. En Python, un dictionnaire dont les clés sont les sommets convient très bien.

```python
graphe = {
    "A": ["B"],
    "B": ["A", "C"],
    "C": ["B"]
}
```

La mémoire suit le nombre réel d'arêtes. Parcourir les amis de B, c'est parcourir une liste courte. Vérifier une liaison précise demande de chercher dans cette liste, ce qui est un peu moins direct que lire `M[i][j]`. Pour les graphes que vous manipulerez, presque toujours creux, on préfère cette forme.

<GraphVisualizer />

## Parcourir sans tourner en rond

On parcourt un graphe un peu comme un arbre, avec une différence qui casse les algorithmes naïfs : il peut y avoir un **cycle**. Si l'on ne note pas les sommets déjà vus, on revient indéfiniment sur ses pas.

Le parcours en **largeur** (*breadth-first search*, BFS) explore par vagues. D'abord les voisins du départ, puis les voisins des voisins. Dans un graphe non pondéré, la première fois qu'on atteint un sommet, on y est arrivé par un plus court chemin, en nombre d'arêtes. C'est le GPS le plus simple, celui qui compte les carrefours et pas les kilomètres.

Le parcours en **profondeur** (*depth-first search*, DFS) s'enfonce le plus loin possible, puis revient en arrière quand il est bloqué. Il convient aux labyrinthes, et c'est avec lui qu'on détecte souvent un cycle : on retombe sur un sommet encore « en cours de visite », pas seulement déjà terminé.

Les deux ont besoin d'un ensemble de sommets marqués. Sans cette marque, la structure du graphe, pas celle de l'algorithme, les fait boucler.

---

<ExerciseTabs courseId="terminale_graphes" courseTitle="Exercices Graphes">

  <ExerciseSection id="graphe-ex-1" label="Implémentation" type="python">
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

  <ExerciseSection id="graphe-ex-2" label="Voisins" type="python">
    <Enonce>
    ### Trouver les voisins
    Écrivez une fonction `nb_amis(graphe, personne)` qui renvoie le nombre d'amis d'une personne.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
