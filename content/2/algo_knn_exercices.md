---
title: Exercices KNN
description: >-
  Exercices pratiques sur l'algorithme des K Plus Proches Voisins (calculs
  manuels, implémentation Python, analyse).
level: premiere
chapter: Algorithmique
icon: "\U0001F3CB️"
badgeId: premiere_exercices
prerequisites:
  - algo_knn
---


# Exercices : Algorithme des K Plus Proches Voisins

## Exercice 1 : Compréhension du principe

!!! question "Question"
    1.  Expliquez avec vos propres mots le principe de l'algorithme des K plus proches voisins.
    2.  Est-ce un algorithme d'apprentissage supervisé ou non supervisé ? Pourquoi ?
    3.  Quelle est la différence entre l'utilisation de KNN pour la classification et pour la régression ?

??? success "Correction"
    1.  **Principe** : Pour classer un nouvel élément, on regarde ses $K$ voisins les plus proches dans les données connues. L'élément prend la classe majoritaire parmi ces voisins (ou la moyenne des valeurs pour une régression). C'est le principe du "dis-moi qui tu hantes, je te dirai qui tu es".
    2.  C'est un algorithme d'**apprentissage supervisé** car il nécessite un jeu de données d'entraînement où les réponses (les classes ou valeurs) sont déjà connues (étiquetées) pour pouvoir faire des prédictions.
    3.  **Classification** : On prédit une **catégorie** (classe discrète) par vote majoritaire des voisins.
    **Régression** : On prédit une **valeur numérique** (continue) en faisant la moyenne des valeurs des voisins.

## Exercice 2 : Calcul de distance euclidienne

!!! question "Question"
    Soient deux points $A(2, 5)$ et $B(5, 9)$ dans un plan cartésien.
    Calculez la distance euclidienne entre ces deux points.

??? success "Correction"
    La formule de la distance euclidienne est $d = \sqrt{(x_B - x_A)^2 + (y_B - y_A)^2}$.
    
    $$ d = \sqrt{(5 - 2)^2 + (9 - 5)^2} $$
    $$ d = \sqrt{3^2 + 4^2} $$
    $$ d = \sqrt{9 + 16} $$
    $$ d = \sqrt{25} $$
    $$ d = 5 $$

## Exercice 3 : Application manuelle (K=1 et K=3)

On dispose des données d'entraînement suivantes (taille en cm, poids en kg) classées en "Enfant" (E) ou "Adulte" (A) :

*   $P1(120, 30)$ : **E**
*   $P2(165, 60)$ : **A**
*   $P3(110, 25)$ : **E**
*   $P4(175, 75)$ : **A**
*   $P5(130, 35)$ : **E**

On veut classer un nouvel individu $X(125, 32)$.

!!! question "Question"
    1.  Calculez la distance (au carré pour simplifier, car l'ordre reste le même) entre $X$ et chaque point $P1$ à $P5$.
    2.  Quelle est la classe de $X$ pour $K=1$ ?
    3.  Quelle est la classe de $X$ pour $K=3$ ?

??? success "Correction"
    **1. Distances au carré ($d^2 = \Delta x^2 + \Delta y^2$) :**
    
    *   $X \leftrightarrow P1(120, 30)$ : $(125-120)^2 + (32-30)^2 = 5^2 + 2^2 = 25 + 4 = \mathbf{29}$
    *   $X \leftrightarrow P2(165, 60)$ : $(125-165)^2 + (32-60)^2 = (-40)^2 + (-28)^2 = 1600 + 784 = 2384$
    *   $X \leftrightarrow P3(110, 25)$ : $(125-110)^2 + (32-25)^2 = 15^2 + 7^2 = 225 + 49 = \mathbf{274}$
    *   $X \leftrightarrow P4(175, 75)$ : $(125-175)^2 + (32-75)^2 = (-50)^2 + (-43)^2 = 2500 + 1849 = 4349$
    *   $X \leftrightarrow P5(130, 35)$ : $(125-130)^2 + (32-35)^2 = (-5)^2 + (-3)^2 = 25 + 9 = \mathbf{34}$
    
    **2. Pour K=1 :**
    Le voisin le plus proche est $P1$ (distance² = 29). Sa classe est **E**.
    Donc $X$ est classé **Enfant**.
    
    **3. Pour K=3 :**
    Les 3 voisins les plus proches sont :
    1.  $P1$ (29) -> **E**
    2.  $P5$ (34) -> **E**
    3.  $P3$ (274) -> **E**
    
    Les 3 votes sont "Enfant". Donc $X$ est classé **Enfant**.

## Exercice 4 : Influence de K

!!! question "Question"
    On considère un jeu de données avec deux classes (Rouge et Bleu) mélangées.
    
    1.  Que se passe-t-il si on choisit $K = 1$ ? Le modèle est-il sensible au bruit ?
    2.  Que se passe-t-il si on choisit $K$ égal au nombre total de points dans le jeu de données ?

??? success "Correction"
    1.  **Si K=1** : Le modèle copie exactement les données d'entraînement. Si un point rouge est accidentellement au milieu des bleus (bruit), toute une zone autour de lui deviendra rouge. Le modèle est **très sensible au bruit** et risque le **surapprentissage** (overfitting). Les frontières de décision seront très irrégulières.
    
    2.  **Si K = N (total)** : Pour tout nouveau point, l'algorithme regardera *tous* les points existants. La classe majoritaire globale gagnera toujours. Le modèle prédira toujours la même classe (la plus fréquente) quel que soit l'entrée. C'est du **sous-apprentissage** (underfitting).

## Exercice 5 : Implémentation de la distance

!!! question "À coder"
    Implémentez en Python une fonction `distance_euclidienne(point1, point2)` qui prend deux listes de coordonnées (ex: `[x, y]`) et retourne leur distance.
    
    *Rappel : `sqrt` est dans le module `math`.*

```python
import math

def distance_euclidienne(point1, point2):
    """
    Calcule la distance euclidienne entre deux points
    point1 et point2 sont des listes [x, y]
    """
    # À compléter
    pass

# Test
p1 = [1, 2]
p2 = [4, 6]
print(distance_euclidienne(p1, p2)) # Doit afficher 5.0
```

??? success "Correction"
    ```python
    import math

    def distance_euclidienne(point1, point2):
        somme_carres = 0
        for i in range(len(point1)):
            somme_carres += (point1[i] - point2[i])**2
        return math.sqrt(somme_carres)
        
    # Version avec compréhension de liste (plus concise)
    # return math.sqrt(sum([(a - b)**2 for a, b in zip(point1, point2)]))
    ```

## Exercice 6 : Recherche des voisins

!!! question "À coder"
    On dispose d'une liste de données :
    `donnees = [[1, 2, 'A'], [4, 6, 'B'], [1, 3, 'A'], [5, 7, 'B']]`
    Chaque élément est `[x, y, classe]`.
    
    Écrivez une fonction `proches_voisins(donnees, cible, k)` qui retourne les $k$ plus proches voisins du point `cible` (ex: `[2, 2]`).

```python
def proches_voisins(donnees, cible, k):
    """
    Retourne la liste des k plus proches voisins
    """
    # 1. Calculer les distances pour tous les points
    distances = []
    # ...
    
    # 2. Trier par distance
    # ...
    
    # 3. Renvoyer les k premiers
    pass
```

??? success "Correction"
    ```python
    def proches_voisins(donnees, cible, k):
        distances = []
        for point in donnees:
            # On ne prend que les coordonnées pour le calcul (point[:2])
            dist = distance_euclidienne(point[:2], cible)
            distances.append((dist, point))
        
        # Tri selon la distance (le premier élément du tuple)
        distances.sort(key=lambda x: x[0])
        
        # On extrait juste les points des k premiers résultats
        voisins = [d[1] for d in distances[:k]]
        return voisins
    ```

## Exercice 7 : Prédiction de classe (Vote majoritaire)

!!! question "À coder"
    Écrivez une fonction `predire_classe(voisins)` qui prend une liste de voisins (ex: `[[1, 2, 'A'], [4, 6, 'B'], ...]`) et retourne la classe la plus fréquente.

```python
def predire_classe(voisins):
    # À compléter
    pass
```

??? success "Correction"
    ```python
    def predire_classe(voisins):
        compteur = {}
        for v in voisins:
            classe = v[2] # La classe est le 3ème élément
            if classe in compteur:
                compteur[classe] += 1
            else:
                compteur[classe] = 1
        
        # Trouver la classe avec le max d'occurrences
        classe_majoritaire = max(compteur, key=compteur.get)
        return classe_majoritaire
    ```

## Exercice 8 : Système de recommandation de films

On souhaite recommander des films à un utilisateur en se basant sur les goûts d'utilisateurs similaires.
Chaque utilisateur a noté 3 genres de films sur 5 : Action, Comédie, Drame.

| Utilisateur | Action | Comédie | Drame | Note Sci-Fi (Cible) |
| :--- | :---: | :---: | :---: | :---: |
| Alice | 5 | 2 | 4 | **1** |
| Bob | 1 | 5 | 2 | **5** |
| Charlie | 4 | 3 | 5 | **2** |
| Diana | 2 | 4 | 1 | **5** |

**Nouvel utilisateur Eve** : Action=4, Comédie=1, Drame=5.
On veut prédire sa note pour **Sci-Fi** avec $K=2$.

!!! question "Question"
    1.  Calculez les distances entre Eve et les 4 autres utilisateurs (sur les 3 genres connus).
    2.  Identifiez les 2 voisins les plus proches.
    3.  Prédisez la note Sci-Fi pour Eve (moyenne des voisins ou moyenne pondérée par l'inverse de la distance).

??? success "Correction"
    **1. Calcul des distances (sur Action, Comédie, Drame) :**
    Eve : `[4, 1, 5]`
    
    *   Alice `[5, 2, 4]` : $\sqrt{(4-5)^2 + (1-2)^2 + (5-4)^2} = \sqrt{1+1+1} = \sqrt{3} \approx 1.73$
    *   Bob `[1, 5, 2]` : $\sqrt{(4-1)^2 + (1-5)^2 + (5-2)^2} = \sqrt{9+16+9} = \sqrt{34} \approx 5.83$
    *   Charlie `[4, 3, 5]` : $\sqrt{(4-4)^2 + (1-3)^2 + (5-5)^2} = \sqrt{0+4+0} = \sqrt{4} = 2.00$
    *   Diana `[2, 4, 1]` : $\sqrt{(4-2)^2 + (1-4)^2 + (5-1)^2} = \sqrt{4+9+16} = \sqrt{29} \approx 5.39$
    
    **2. Les 2 plus proches voisins :**
    *   Alice (dist 1.73) -> Note Sci-Fi : **1**
    *   Charlie (dist 2.00) -> Note Sci-Fi : **2**
    
    **3. Prédiction :**
    *   Moyenne simple : $(1 + 2) / 2 = \mathbf{1.5}$
    *   Moyenne pondérée (optionnelle) : Alice est plus proche, sa note compte plus. Le résultat serait proche de 1.5 également (environ 1.46).
    
    On prédit donc que Eve n'aimera pas trop la Sci-Fi (Note ~1.5/5).

## Exercice 9 : Optimisations et variantes (Approfondissement)

!!! question "Analyse"
    Analysez ces améliorations possibles de l'algorithme K-NN :
    
    1.  **k-NN pondéré** : Les voisins plus proches ont plus d'influence dans le vote.
    2.  **Normalisation** : Mettre toutes les caractéristiques à la même échelle (ex: 0 à 1).
    3.  **Distance de Manhattan** : $|x_1-x_2| + |y_1-y_2|$ au lieu de la distance euclidienne.
    
    *   Dans quel cas la normalisation est-elle indispensable ?
    *   Quel est l'avantage de la distance de Manhattan ?

??? success "Correction"
    1.  **k-NN pondéré** : Utile quand $K$ est grand ou quand certains voisins sont beaucoup plus proches que d'autres. Cela évite que des voisins "lointains" aient autant de poids que des voisins très proches.
    
    2.  **Normalisation** : **Indispensable** quand les caractéristiques ont des unités ou des ordres de grandeur différents (ex: Âge vs Salaire). Sans normalisation, la caractéristique avec les plus grandes valeurs écraserait complètement les autres dans le calcul de distance.
        *   *Exemple de normalisation Min-Max :* $valeur_{norm} = \frac{valeur - min}{max - min}$
    
    3.  **Distance de Manhattan** :
        *   Formule : $d = \sum |x_i - y_i|$
        *   Avantage : Moins sensible aux valeurs aberrantes (outliers) que la distance euclidienne (qui met les différences au carré, amplifiant les grands écarts). Souvent préférée en très haute dimension.
