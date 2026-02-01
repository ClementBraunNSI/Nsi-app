# TP : Création d'une Mini-Blockchain en Python

**Public :** BTS SIO SLAM 1ère année
**Module :** Cybersécurité & Programmation Objet
**Durée estimée :** 4 heures

---

## Objectifs Pédagogiques
1.  **Cybersécurité :**
    *   Comprendre le hachage (SHA-256) et l'effet avalanche.
    *   Comprendre l'intégrité des données par chaînage de blocs.
    *   Comprendre le principe de "Proof of Work" (Preuve de travail).
2.  **Programmation (Python) :**
    *   Pratiquer la POO : Classes, Constructeurs, Méthodes d'instance, Méthodes spéciales (`__str__`).
    *   Manipuler des librairies standards (`hashlib`, `time`).
    *   Algorithmie : Boucles de validation et de recherche (minage).

---

## Introduction : Le Grand Livre Numérique

Une blockchain est une base de données distribuée et sécurisée. Imaginez un grand cahier où tout le monde peut écrire, mais :
1.  **Immuable :** Une fois écrit, on ne peut plus effacer ni modifier une ligne sans que cela se voie.
2.  **Chronologique :** Chaque page est liée à la précédente.
3.  **Sécurisé :** Pour valider une page, il faut résoudre un problème mathématique complexe.

Dans ce TP, nous allons construire ce mécanisme de zéro.

---

## Partie 1 : Le Hachage (Les fondations)

Pour sécuriser notre chaîne, nous avons besoin d'une empreinte digitale numérique unique pour chaque bloc. C'est le rôle des fonctions de hachage.

### 📚 Tutoriel : Le module `hashlib`

En Python, le hachage se fait en 3 étapes strictes :
1.  **Encoder** la chaîne en octets (`.encode()`).
2.  **Hacher** avec l'algorithme (`hashlib.sha256()`).
3.  **Convertir** en hexadécimal pour la lecture (`.hexdigest()`).

**Exemple complet :**
```python
import hashlib

texte = "Bonjour BTS SIO"
# 1. Encodage (String -> Bytes)
texte_bytes = texte.encode('utf-8')
# 2. Hachage
hash_object = hashlib.sha256(texte_bytes)
# 3. Conversion (Bytes -> Hex String)
empreinte = hash_object.hexdigest()

print(empreinte)
# Résultat : a2c4e... (64 caractères)
```

### 📝 Exercice 1.1 : Premier Hash
1.  Créer un fichier `blockchain.py`.
2.  Importer les modules `hashlib` et `time`.
3.  Créer une fonction `test_hachage()` qui demande une saisie utilisateur, calcule son SHA-256 et l'affiche.

### 📝 Exercice 1.2 : L'Effet Avalanche
L'effet avalanche signifie qu'une modification minime de l'entrée change radicalement la sortie.
1.  Dans votre script, hacher le mot `"Blockchain"`.
2.  Hacher le mot `"blockchain"` (minuscule).
3.  Comparer les deux résultats caractère par caractère. Se ressemblent-ils ?
    *   *Réponse attendue : Non, ils sont totalement différents.*

---

## Partie 2 : La Brique Élémentaire (Classe `Block`)

Un bloc est un conteneur qui regroupe des informations. Dans une blockchain, il contient obligatoirement une référence au bloc précédent.

### 📚 Théorie : Structure d'un bloc
Un bloc contient généralement :
*   `index` : Sa position (0, 1, 2...).
*   `timestamp` : Sa date de création.
*   `data` : Les données stockées (ex: "Alice doit 10€ à Bob").
*   `previous_hash` : L'empreinte du bloc d'avant (le lien !).
*   `hash` : Sa propre empreinte (calculée à partir de tout le reste).

### 📝 Exercice 2.1 : Le Constructeur
Créer la classe `Block` avec son constructeur :

```python
class Block:
    def __init__(self, index, data, previous_hash):
        self.index = index
        self.timestamp = time.time()
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash() # On le calcule tout de suite
```

### 📝 Exercice 2.2 : Calculer l'empreinte
Ajouter la méthode `calculate_hash` à la classe `Block`.
Elle doit :
1.  Concaténer tous les attributs (`index`, `timestamp`, `data`, `previous_hash`) en une seule chaîne de caractères.
2.  Retourner le hash SHA-256 de cette chaîne.

*Astuce : Utilisez `str(self.index)` pour convertir les nombres en texte avant concaténation.*

### 📝 Exercice 2.3 : Un affichage propre (`__str__`)
Pour faciliter le débogage, ajouter la méthode spéciale `__str__` :
```python
    def __str__(self):
        return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"
```
*Testez en créant un bloc manuellement dans votre `main` et en l'affichant avec `print(mon_bloc)`.*

---

## Partie 3 : La Chaîne (Classe `Blockchain`)

La Blockchain est le gestionnaire. C'est une liste ordonnée de blocs.

### 📝 Exercice 3.1 : Le Genesis Block
Le premier bloc est spécial car il n'a pas de prédécesseur. On l'appelle le "Genesis Block".
Créer la classe `Blockchain` :
```python
class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]

    def create_genesis_block(self):
        # Retourne un Block avec index=0, data="Genesis", previous_hash="0"
        return Block(0, "Genesis", "0")
```

### 📝 Exercice 3.2 : Ajouter un maillon
Pour ajouter un bloc, il faut respecter la règle d'or : **Le `previous_hash` du nouveau bloc DOIT être le `hash` du dernier bloc de la chaîne.**

Ajouter la méthode `add_block(self, new_data)` :
1.  Récupérer le dernier bloc de la liste `self.chain` (C'est le "parent").
2.  Créer un nouvel objet `Block` avec :
    *   Index = Index du parent + 1
    *   Data = `new_data`
    *   Previous Hash = Hash du parent
3.  Ajouter ce nouveau bloc à la liste `self.chain`.

### 📝 Exercice 3.3 : Visualisation
Dans le programme principal (`if __name__ == "__main__":`), simuler une utilisation :
1.  Instancier la Blockchain.
2.  Ajouter 3 blocs avec des transactions fictives ("A envoie à B", "B envoie à C"...).
3.  Parcourir la liste `chain` avec une boucle et afficher chaque bloc.
4.  Vérifier visuellement que le `Prev` du bloc N correspond au `Hash` du bloc N-1.

---

## Partie 4 : Sécurité et Attaque (Le cœur du sujet)

C'est ici que nous allons comprendre pourquoi la blockchain est sécurisée.

### 📝 Exercice 4.1 : L'Inspecteur (`is_chain_valid`)
Ajouter une méthode `is_chain_valid(self)` qui retourne `True` ou `False`.
Elle doit parcourir la chaîne (à partir du bloc 1, pas 0) et vérifier DEUX conditions pour chaque bloc :
1.  **Intégrité des données :** Recalculer le hash du bloc courant. Est-il identique à celui stocké dans `bloc.hash` ? (Sinon, les données ont été altérées).
2.  **Intégrité du lien :** Le `previous_hash` du bloc courant est-il identique au `hash` du bloc précédent ? (Sinon, la chaîne est brisée).

### 📝 Exercice 4.2 : Scénario d'attaque complet
Dans le `main`, réalisez le scénario suivant étape par étape :

**Étape A : Tout va bien**
*   Afficher "Chaîne valide ?" -> Doit afficher `True`.

**Étape B : Le vol (Attaque naïve)**
*   Le hacker modifie une donnée dans le passé :
    `mon_coin.chain[1].data = "Hacker s'est donné 1000 BTC"`
*   Afficher "Chaîne valide après attaque ?" -> Doit afficher `False`.
*   *Pourquoi ?* Le hash stocké dans le bloc 1 ne correspond plus à ses nouvelles données.

**Étape C : La dissimulation (Attaque intelligente)**
*   Le hacker est malin. Il recalcule le hash du bloc 1 pour qu'il soit valide avec les nouvelles données :
    `mon_coin.chain[1].hash = mon_coin.chain[1].calculate_hash()`
*   Afficher "Chaîne valide après tentative de correction ?" -> Doit afficher `False`.
*   *Pourquoi ?* Le bloc 2 pointe toujours vers l'ANCIEN hash du bloc 1. Le lien est brisé entre 1 et 2.

**Conclusion :** Pour réussir son attaque, le hacker devrait recalculer le hash du bloc 1, PUIS le hash du bloc 2 (pour mettre à jour son previous_hash), PUIS le bloc 3... jusqu'à la fin de la chaîne. C'est possible... sauf si on ajoute du **Minage**.

---

## Partie 5 : Proof of Work (Le Minage)

Pour empêcher le recalcul rapide de toute la chaîne, on impose une contrainte de temps : le minage. Il faut trouver un hash qui commence par un certain nombre de zéros (la "difficulté").

### 📝 Exercice 5.1 : Le Nonce
Le `nonce` est un nombre arbitraire qu'on va modifier jusqu'à trouver le bon hash.
1.  Ajouter `self.nonce = 0` dans le `__init__` de `Block`.
2.  Ajouter `self.nonce` à la concaténation dans `calculate_hash`.

### 📝 Exercice 5.2 : La Pioche (`mine_block`)
Ajouter la méthode `mine_block(self, difficulty)` dans `Block`.
Principe :
1.  Définir la cible (ex: "0000" si difficulté = 4).
2.  Tant que `self.hash` ne commence pas par la cible :
    *   Incrémenter `self.nonce`.
    *   Recalculer `self.hash`.
3.  Quand c'est trouvé, afficher "Bloc miné !" et le hash.

### 📝 Exercice 5.3 : Intégration
Modifier `add_block` dans `Blockchain` :
*   Avant d'ajouter le bloc à la liste, appeler `new_block.mine_block(difficulty)`.
*   Fixer une difficulté de 4 (dans `__init__` de Blockchain).

### 📝 Exercice 5.4 : Le Challenge (Benchmark)
Testez le temps de minage :
*   Avec difficulté = 2 (Instantané)
*   Avec difficulté = 4 (Quelques secondes)
*   Avec difficulté = 5 (Peut prendre 10-30 secondes)
*   Avec difficulté = 6 (Très long... ne pas lancer en cours sauf si PC puissant !)

Cela prouve qu'il est impossible pour un hacker de recalculer toute une chaîne de milliers de blocs : cela prendrait des années.
