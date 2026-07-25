---
title: 'TP Python : Réseaux sociaux'
description: 'Modéliser un réseau d''amis avec networkx (graphes) et pandas.'
level: seconde
chapter: Réseaux sociaux
icon: "🐍"
prerequisites:
  - Cours_Reseaux_Sociaux
---

<ExerciseTabs courseId="tp-python-reseaux" courseTitle="TP Python : Réseaux sociaux" packages="networkx,pandas">

  <ExerciseSection id="rs-0" label="Important ⚠️ - Avant de commencer">
    <Enonce>
      ### Important ⚠️ - Avant de commencer

      En cours, vous avez vu qu'un réseau social peut se modéliser par un **graphe** : des **sommets** (utilisateurs) reliés par des **arêtes** (amitiés).

      | Bibliothèque | Usage |
      |-------------|-------|
      | **networkx** | Créer et analyser un graphe de relations |
      | **pandas** | Tableau des profils utilisateurs |

      **Dans le Lab NSI**, les modules sont chargés automatiquement.

      **Exemple networkx :**

      ```python
      import networkx as nx

      G = nx.Graph()
      G.add_node("Alice")
      G.add_node("Bob")
      G.add_edge("Alice", "Bob")
      print(G.number_of_nodes())  # 2
      ```
    </Enonce>
    <Verification>
```python
assert True, "Consignes lues."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="rs-1" label="Introduction 🦊 - Créer un graphe">
    <Enonce>
      ### Introduction 🦊 - Créer un graphe

      **Mission :** Créez un graphe non orienté `reseau` avec **networkx**, ajoutez les utilisateurs `"Alice"`, `"Bob"` et `"Charlie"` comme sommets, puis stockez le nombre d'utilisateurs dans `nb_utilisateurs`.

      *Indice :* `import networkx as nx`, `G = nx.Graph()`, `G.add_node("...")`, `G.number_of_nodes()`.
    </Enonce>
    <Verification>
```python
import networkx as nx

assert 'reseau' in locals(), "Créez un graphe nommé reseau."
assert 'nb_utilisateurs' in locals(), "Comptez les utilisateurs."
assert isinstance(reseau, nx.Graph), "reseau doit être un networkx.Graph."
assert nb_utilisateurs == 3, "Le graphe doit contenir 3 utilisateurs."
assert set(reseau.nodes()) == {"Alice", "Bob", "Charlie"}, "Ajoutez Alice, Bob et Charlie."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="rs-2" label="Introduction 🦊 - Relier des amis">
    <Enonce>
      ### Introduction 🦊 - Relier des amis

      Une **amitié** entre deux personnes est une **arête** du graphe.

      **Mission :** Créez un graphe `reseau` avec les utilisateurs Alice, Bob et Charlie. Ajoutez les amitiés suivantes :

      - Alice ↔ Bob
      - Bob ↔ Charlie

      Stockez le nombre d'amitiés dans `nb_amities`.

      *Indice :* `G.add_edge("Alice", "Bob")` crée une arête entre deux amis.
    </Enonce>
    <Verification>
```python
import networkx as nx

assert 'reseau' in locals(), "Créez le graphe reseau."
assert 'nb_amities' in locals(), "Comptez les amitiés."
assert nb_amities == 2, "Il y a 2 liens d'amitié."
assert reseau.has_edge("Alice", "Bob"), "Alice et Bob sont amis."
assert reseau.has_edge("Bob", "Charlie"), "Bob et Charlie sont amis."
assert not reseau.has_edge("Alice", "Charlie"), "Alice et Charlie ne sont pas amis directement."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="rs-3" label="Introduction 🦊 - Nombre d'amis">
    <Enonce>
      ### Introduction 🦊 - Nombre d'amis

      Le **degré** d'un sommet = son nombre d'amis dans le réseau.

      **Mission :** À partir du graphe fourni, stockez le nombre d'amis de **Bob** dans `amis_bob`.

      ```python
      import networkx as nx

      reseau = nx.Graph()
      reseau.add_edges_from([
          ("Alice", "Bob"),
          ("Bob", "Charlie"),
          ("Bob", "Diana"),
      ])
      ```

      *Indice :* `reseau.degree("Bob")` ou `len(list(reseau.neighbors("Bob")))`.
    </Enonce>
    <Verification>
```python
import networkx as nx

reseau = nx.Graph()
reseau.add_edges_from([
    ("Alice", "Bob"),
    ("Bob", "Charlie"),
    ("Bob", "Diana"),
])

assert 'amis_bob' in locals(), "Créez la variable amis_bob."
assert amis_bob == reseau.degree("Bob"), "Comptez les arêtes connectées à Bob."
assert amis_bob == 3, "Bob a 3 amis dans ce réseau."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="rs-4" label="Introduction 🦊 - Vérifier une amitié">
    <Enonce>
      ### Introduction 🦊 - Vérifier une amitié

      **Mission :** À partir du graphe fourni, vérifiez si **Alice** et **Charlie** sont amis. Stockez le résultat (`True` ou `False`) dans `alice_charlie_amis`.

      ```python
      import networkx as nx

      reseau = nx.Graph()
      reseau.add_edges_from([
          ("Alice", "Bob"),
          ("Bob", "Charlie"),
      ])
      ```

      *Indice :* `reseau.has_edge("Alice", "Charlie")`
    </Enonce>
    <Verification>
```python
import networkx as nx

reseau = nx.Graph()
reseau.add_edges_from([
    ("Alice", "Bob"),
    ("Bob", "Charlie"),
])

assert 'alice_charlie_amis' in locals(), "Créez alice_charlie_amis."
assert alice_charlie_amis == reseau.has_edge("Alice", "Charlie"), "Vérifiez l'arête entre Alice et Charlie."
assert alice_charlie_amis == False, "Alice et Charlie ne sont pas amis directement."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="rs-5" label="Facile 🦊 - Tableau des profils">
    <Enonce>
      ### Facile 🦊 - Tableau des profils

      On peut croiser un **tableau pandas** (profils) et un **graphe** (amitiés).

      **Mission :** Créez un DataFrame `profils` à partir du tableau ci-dessous, puis stockez la ville de **Charlie** dans `ville_charlie`.

      | Prénom | Âge | Ville |
      |--------|-----|-------|
      | Alice | 15 | Lyon |
      | Bob | 16 | Paris |
      | Charlie | 15 | Marseille |

      *Indice :* filtrez avec `profils[profils["Prénom"] == "Charlie"]`.
    </Enonce>
    <Verification>
```python
import pandas as pd

profils_ref = pd.DataFrame({
    "Prénom": ["Alice", "Bob", "Charlie"],
    "Âge": [15, 16, 15],
    "Ville": ["Lyon", "Paris", "Marseille"],
})

assert 'profils' in locals(), "Créez le DataFrame profils."
assert 'ville_charlie' in locals(), "Trouvez la ville de Charlie."
assert len(profils) == 3, "Le tableau contient 3 profils."
assert ville_charlie == profils_ref.loc[profils_ref["Prénom"] == "Charlie", "Ville"].iloc[0]
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="rs-6" label="Facile 🦊 - L'utilisateur le plus populaire">
    <Enonce>
      ### Facile 🦊 - L'utilisateur le plus populaire

      **Mission :** Dans le graphe fourni, trouvez l'utilisateur qui a le **plus d'amis** et stockez son prénom dans `plus_populaire`.

      ```python
      import networkx as nx

      reseau = nx.Graph()
      reseau.add_edges_from([
          ("Alice", "Bob"),
          ("Alice", "Charlie"),
          ("Alice", "Diana"),
          ("Bob", "Charlie"),
      ])
      ```

      *Indice :* `nx.degree(reseau)` renvoie le degré de chaque sommet. Cherchez le maximum.
    </Enonce>
    <Verification>
```python
import networkx as nx

reseau = nx.Graph()
reseau.add_edges_from([
    ("Alice", "Bob"),
    ("Alice", "Charlie"),
    ("Alice", "Diana"),
    ("Bob", "Charlie"),
])
degres = dict(reseau.degree())
attendu = max(degres, key=degres.get)

assert 'plus_populaire' in locals(), "Trouvez l'utilisateur le plus populaire."
assert plus_populaire == attendu, "Choisissez le sommet avec le degré maximal."
assert plus_populaire == "Alice", "Alice a le plus d'amis."
```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="rs-7" label="Facile 🦊 - Graphe depuis un tableau">
    <Enonce>
      ### Facile 🦊 - Graphe depuis un tableau

      **Mission :** Créez un graphe `reseau` à partir du tableau de **paires d'amis** ci-dessous (chaque ligne = une amitié). Stockez le nombre total d'arêtes dans `nb_amities`.

      | Utilisateur 1 | Utilisateur 2 |
      |---------------|---------------|
      | Alice | Bob |
      | Bob | Charlie |
      | Charlie | Diana |
      | Alice | Diana |

      *Indice :* créez un DataFrame puis parcourez les lignes pour appeler `add_edge`.
    </Enonce>
    <Verification>
```python
import networkx as nx

assert 'reseau' in locals(), "Créez le graphe reseau."
assert 'nb_amities' in locals(), "Comptez les arêtes."
assert nb_amities == 4, "Le tableau contient 4 paires d'amis."
assert reseau.number_of_edges() == 4, "Ajoutez une arête par ligne du tableau."
assert reseau.has_edge("Alice", "Diana"), "Alice et Diana sont amis."
```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
