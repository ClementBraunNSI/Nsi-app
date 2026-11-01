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

Un arbre a une racine, et il n'existe qu'un seul chemin entre deux nœuds. Beaucoup de situations ne respectent pas ces règles : deux villes peuvent être reliées par plusieurs routes, deux comptes peuvent se suivre mutuellement sans qu'aucun ne soit au « sommet » du réseau, et une page web peut renvoyer vers une autre page qui revient vers elle. On modélise ces situations par un **graphe**.

> Un graphe $G = (S, A)$ est un ensemble $S$ de **sommets** et un ensemble $A$ de liaisons entre ces sommets.

Les sommets représentent les entités, comme des villes, des comptes ou des machines. Les liaisons peuvent être de plusieurs natures, et le vocabulaire change selon les cas.

Si la relation va dans les deux sens, comme « est ami avec » ou « est relié par une route à double sens », le graphe est **non orienté** et les liaisons s'appellent des **arêtes**. Si la relation a un sens, comme « suit tel compte » ou « contient un lien vers », le graphe est **orienté** et l'on parle d'**arcs**. Si chaque liaison a un coût (une distance, une durée, un prix), le graphe est **pondéré**. Un graphe peut être à la fois orienté et pondéré, par exemple pour représenter des rues à sens unique avec leur longueur.

## Représenter un graphe en mémoire

Plusieurs structures sont possibles, et le bon choix dépend du nombre de liaisons.

La **matrice d'adjacence** est un tableau à deux dimensions. `M[i][j]` vaut 1 s'il existe une arête entre i et j, et 0 sinon. Sur un graphe non orienté, la matrice est symétrique.

| | A | B | C |
|---|---|---|---|
| **A** | 0 | 1 | 0 |
| **B** | 1 | 0 | 1 |
| **C** | 0 | 1 | 0 |

Pour savoir si A et B sont reliés, il suffit de lire une case. En revanche, pour un graphe de mille sommets qui n'a que quelques arêtes, la matrice est presque entièrement remplie de zéros : elle occupe une place proportionnelle au carré du nombre de sommets pour très peu d'information. On dit alors que le graphe est **creux**, et la matrice n'est pas une bonne représentation.

La **liste d'adjacence** ne stocke que les voisins. En Python, un dictionnaire dont les clés sont les sommets convient très bien.

```python
graphe = {
    "A": ["B"],
    "B": ["A", "C"],
    "C": ["B"]
}
```

La mémoire utilisée dépend alors du nombre réel d'arêtes, et parcourir les amis de B revient à parcourir une liste courte. Vérifier si une liaison existe demande en revanche de chercher dans cette liste, ce qui est un peu moins direct que lire `M[i][j]`. Comme les graphes étudiés ici sont presque toujours creux, on préfère cette représentation.

<GraphVisualizer />

## Parcourir un graphe

On parcourt un graphe un peu comme un arbre, avec une différence importante : un graphe peut contenir un **cycle**. Si l'on ne note pas les sommets déjà visités, le parcours risque de tourner indéfiniment.

Le parcours en **largeur** (*breadth-first search*, BFS) explore par vagues. Il visite d'abord les voisins du départ, puis les voisins de ces voisins, et ainsi de suite. Dans un graphe non pondéré, la première fois qu'on atteint un sommet, on y est arrivé par un plus court chemin, en nombre d'arêtes. C'est un peu comme un GPS très simple, qui compterait les carrefours et non les kilomètres.

Le parcours en **profondeur** (*depth-first search*, DFS) s'enfonce le plus loin possible, puis revient en arrière quand il est bloqué. Il convient aux labyrinthes, et c'est souvent avec lui qu'on détecte un cycle : on en repère un quand on retombe sur un sommet encore « en cours de visite », et pas seulement sur un sommet déjà terminé.

Les deux parcours ont besoin d'un ensemble de sommets marqués : sans ce marquage, les cycles du graphe les feraient boucler sans fin.

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
    
    1.  Représenter ce graphe sous forme de dictionnaire d'adjacence.
    2.  Écrire une fonction `sont_amis(graphe, p1, p2)` qui renvoie True s'ils sont connectés directement.

    <Correction>
    ```python
    graphe = {
        "Alice": ["Bob", "Charlie"],
        "Bob": ["Alice", "David"],
        "Charlie": ["Alice"],
        "David": ["Bob"],
    }

    def sont_amis(graphe, p1, p2):
        return p2 in graphe[p1]
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'graphe' in globals(), "Le dictionnaire d'adjacence doit s'appeler graphe."
    assert {k: sorted(v) for k, v in graphe.items()} == {"Alice": ["Bob", "Charlie"], "Bob": ["Alice", "David"], "Charlie": ["Alice"], "David": ["Bob"]}, "Le dictionnaire ne décrit pas les amitiés de l'énoncé."
    assert sont_amis(graphe, "Alice", "Bob") is True, "Alice et Bob sont amis."
    assert sont_amis(graphe, "David", "Bob") is True, "David et Bob sont amis."
    assert sont_amis(graphe, "Alice", "David") is False, "Alice et David ne sont pas amis directement."
    assert sont_amis({"X": ["Y"], "Y": ["X"], "Z": []}, "Z", "X") is False, "sont_amis doit utiliser le graphe reçu en paramètre."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="graphe-ex-2" label="Voisins" type="python">
    <CodeDepart>
    ```python
    graphe = {
        "Alice": ["Bob", "Charlie"],
        "Bob": ["Alice", "David"],
        "Charlie": ["Alice"],
        "David": ["Bob"],
    }
    ```
    </CodeDepart>
    <Enonce>
    ### Trouver les voisins
    Écrire une fonction `nb_amis(graphe, personne)` qui renvoie le nombre d'amis d'une personne.

    <Correction>
    ```python
    def nb_amis(graphe, personne):
        return len(graphe[personne])
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    reseau = {"Alice": ["Bob", "Charlie"], "Bob": ["Alice", "David"], "Charlie": ["Alice"], "David": ["Bob"]}
    assert nb_amis(reseau, "Alice") == 2, "Alice a 2 amis."
    assert nb_amis(reseau, "Charlie") == 1, "Charlie a 1 ami."
    assert nb_amis({"Seul": []}, "Seul") == 0, "Une personne sans ami en a 0."
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
