---

title: "Arbres binaires de recherche et Algorithmes"
chapter: "Terminale NSI · Structures avancées"
meta: "Révision ABR, implémentations et complexité"
access: "private"
allowedStudents: ["Roméo VILLARROYA","Clément BRAUN"]
---

<ExerciseTabs courseId="abr-revision" courseTitle="Révision ABR">
  <ExerciseSection id="abr-1" label="1. Rappels théoriques">
    <Enonce>
## 1. Rappels théoriques

### 1.1 Définitions

**Un arbre binaire de recherche (ABR) est un arbre binaire qui respecte la propriété suivante :**

- Pour tout nœud, toutes les valeurs du sous-arbre gauche sont strictement inférieures à la valeur du nœud
- Pour tout nœud, toutes les valeurs du sous-arbre droit sont supérieures ou égales à la valeur du nœud

**Vocabulaire important :**

- **Nœud** : élément de l'arbre contenant une valeur (clé)
- **Racine** : nœud au sommet de l'arbre
- **Feuille** : nœud sans enfants
- **Taille** : nombre total de nœuds dans l'arbre
- **Hauteur** : longueur du plus long chemin de la racine à une feuille

### 1.2 Complexité

Dans un ABR équilibré, les opérations de recherche, insertion et suppression ont une complexité en **O(log₂ n)**.

Dans le pire des cas (arbre dégénéré en liste chaînée), la complexité devient **O(n)**.

---
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="abr-2" label="2. Exercice 1 : Construction et propriétés">
    <Enonce>
## 2. Exercice 1 : Construction et propriétés

### Question 1 : Dessiner l'arbre

On insère successivement les valeurs suivantes dans un ABR initialement vide :

**50, 30, 70, 20, 40, 60, 80**

Dessiner l'arbre binaire de recherche obtenu.

### Question 2 : Mesures de l'arbre

Pour l'arbre construit à la question 1, déterminer :

- La taille de l'arbre
- La hauteur de l'arbre
- Le nombre de feuilles
- Les valeurs minimale et maximale

### Question 3 : Ordre d'insertion différent

On insère maintenant les mêmes valeurs mais dans cet ordre :

**20, 30, 40, 50, 60, 70, 80**

- Dessiner le nouvel arbre obtenu
- Quelle est sa hauteur ?
- Que peut-on en conclure sur l'importance de l'ordre d'insertion ?

---
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="abr-3" label="3. Exercice 2 : Parcours d'arbres">
    <Enonce>
## 3. Exercice 2 : Parcours d'arbres

On considère l'ABR suivant :

```
        45
       /  \
     25    65
    /  \   / \
   15  35 55 75
```

### Question 1 : Parcours

Donner le résultat des parcours suivants :

- **Parcours préfixe** (racine, gauche, droite)
- **Parcours infixe** (gauche, racine, droite)
- **Parcours suffixe** (gauche, droite, racine)
- **Parcours en largeur**

### Question 2 : Propriété du parcours infixe

Que remarquez-vous concernant le parcours infixe d'un ABR ? Expliquer pourquoi.

---
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="abr-4" label="4. Exercice 3 : Implémentation en Python">
    <Enonce>
## 4. Exercice 3 : Implémentation en Python

### Question 1 : Classes Noeud et Arbre

On souhaite représenter un ABR avec deux classes :
- Une classe `Noeud` qui représente un nœud avec une clé
- Une classe `Arbre` qui contient une racine (un nœud), un fils gauche et un fils droit (qui sont des arbres)

Compléter les classes suivantes :

```python
class Noeud:
    def __init__(self, cle):
        self.cle = cle

class Arbre:
    def __init__(self, racine=None, gauche=None, droit=None):
        self.racine = racine  # un Noeud ou None
        self.gauche = gauche  # un Arbre ou None
        self.droit = droit    # un Arbre ou None
    
    def est_vide(self):
        """Renvoie True si l'arbre est vide"""
        return self.racine is None
```

### Question 2 : Méthode de recherche

Écrire une méthode `recherche(self, valeur)` qui renvoie `True` si la valeur est présente dans l'arbre, `False` sinon.

```python
def recherche(self, valeur):
    """Recherche récursive d'une valeur dans l'ABR"""
    # Votre code ici
    pass
```

### Question 3 : Méthode d'insertion

Écrire une méthode `inserer(self, valeur)` qui insère une nouvelle valeur dans l'ABR en respectant la propriété d'ordre.

```python
def inserer(self, valeur):
    """Insertion récursive d'une valeur dans l'ABR"""
    # Votre code ici
    pass
```

### Question 4 : Méthode de calcul de la taille

Écrire une méthode `taille(self)` qui calcule le nombre de nœuds dans l'arbre.

```python
def taille(self):
    """Calcule récursivement le nombre de nœuds dans l'arbre"""
    # Votre code ici
    pass
```

### Question 5 : Méthode de calcul de la hauteur

Écrire une méthode `hauteur(self)` qui calcule la hauteur de l'arbre (la hauteur d'un arbre vide est -1, celle d'une feuille est 0).

```python
def hauteur(self):
    """Calcule récursivement la hauteur de l'arbre"""
    # Votre code ici
    pass
```

### Question 6 : Utilisation

Écrire un exemple d'utilisation de vos classes pour créer l'arbre de l'exercice 1 (avec les valeurs 50, 30, 70, 20, 40, 60, 80) et afficher sa taille et sa hauteur.

---
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="abr-5" label="5. Exercice 4 : Analyse de complexité">
    <Enonce>
## 5. Exercice 4 : Analyse de complexité

### Question 1 : Comparaison des structures

Compléter le tableau suivant en indiquant la complexité temporelle dans le meilleur et le pire cas :

| Opération  | Liste chaînée | ABR (meilleur cas) | ABR (pire cas) |
|------------|---------------|---------------------|----------------|
| Recherche  |               |                     |                |
| Insertion  |               |                     |                |

### Question 2 : Encadrement de la hauteur

Pour un ABR contenant n nœuds, donner un encadrement de sa hauteur h en fonction de n. Justifier vos réponses.

**Hauteur minimale :** 

**Hauteur maximale :**

---
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="abr-6" label="6. Exercice bonus : Vérification d'un ABR">
    <Enonce>
## 6. Exercice bonus : Vérification d'un ABR

Écrire une méthode `est_abr(self)` qui vérifie si un arbre binaire donné est bien un arbre binaire de recherche.

```python
def est_abr(self):
    """Vérifie si l'arbre respecte la propriété d'ABR"""
    # Votre code ici
    pass
```

**Indice :** Une approche consiste à vérifier que le parcours infixe de l'arbre produit une liste triée par ordre croissant. Vous pouvez d'abord écrire une méthode `parcours_infixe(self)` qui renvoie la liste des valeurs dans l'ordre infixe.

---
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>
