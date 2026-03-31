---
title: 'Algorithmique : Diviser pour Régner'
description: 'Méthode de résolution par décomposition (Tri fusion, etc.).'
level: terminale
chapter: Algorithmique
icon: "\U0001F52A"
badgeId: terminale_diviser_regner
prerequisites:
  - algo_recherche_textuelle
---

# 🔪 Diviser pour Régner (Divide and Conquer)

C'est une méthode algorithmique puissante qui consiste à :
1.  **Diviser** le problème en sous-problèmes plus petits.
2.  **Régner** (Résoudre) les sous-problèmes (souvent récursivement).
3.  **Combiner** les solutions des sous-problèmes pour obtenir la solution globale.

## 1. Exemple phare : Le Tri Fusion (Merge Sort)

Pour trier une liste de 100 nombres :
1.  **Diviser** : On coupe la liste en deux listes de 50.
2.  **Régner** : On trie récursivement ces deux moitiés. (On recoupe jusqu'à avoir des listes de 1 élément, qui sont déjà triées !).
3.  **Combiner** : On fusionne les deux listes triées pour en faire une grande liste triée.

### Complexité
Le tri fusion est très efficace : sa complexité est toujours en **O(n log n)**, contrairement au tri par insertion ou sélection qui sont en O(n²) dans le pire des cas.

## 2. Exemple : Rotation d'image

Pour faire tourner une image carrée de 90° :
1.  On découpe l'image en 4 quadrants (Haut-Gauche, Haut-Droit, Bas-Gauche, Bas-Droit).
2.  On tourne récursivement chaque quadrant.
3.  On déplace les quadrants à leur nouvelle place (HG -> HD, HD -> BD, BD -> BG, BG -> HG).

## 3. Recherche Dichotomique

La recherche dichotomique (vue en 1ère) est aussi un algorithme "Diviser pour Régner" (mais sans l'étape "Combiner" car on ne garde qu'une moitié).

---

<ExerciseTabs courseId="terminale_diviser_regner" courseTitle="Exos Diviser Régner">

  <ExerciseSection id="div-ex-1" label="Fusion de listes">
    <Enonce>
    ### Algorithme de Fusion
    On dispose de deux listes **déjà triées** :
    `L1 = [1, 3, 5, 7]` et `L2 = [2, 4, 6, 8]`
    
    Écrivez une fonction `fusion(l1, l2)` qui renvoie une seule liste triée `[1, 2, 3, 4, 5, 6, 7, 8]` en parcourant les listes une seule fois.
    
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
