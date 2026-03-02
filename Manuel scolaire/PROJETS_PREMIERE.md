# 💡 Idées de Projets NSI Première

Ce document recense des idées de mini-projets à proposer aux élèves après chaque grand chapitre de Python. L'objectif est de consolider les acquis par la pratique ludique.

## 🟢 Niveau 1 : Variables & Conditions
*Prérequis : `input()`, `print()`, `if/else`, opérations mathématiques.*

### 1. Le Juste Prix 🏷️
*   **Concept** : L'ordinateur choisit un nombre (fixe ou aléatoire si import random vu). L'utilisateur doit deviner.
*   **Logique** : Si `prop < secret` -> "C'est plus !", sinon "C'est moins !".
*   **Extension** : Ajouter un compteur d'essais limité (Game Over).

### 2. Convertisseur d'Unités 🌡️
*   **Concept** : Un menu demande "1. Celsius -> Fahrenheit", "2. Km -> Miles", "3. Euros -> Dollars".
*   **Logique** : Utilisation de `if/elif/else` pour traiter le choix et appliquer la formule.
*   **Extension** : Gérer les erreurs de saisie (ex: température < -273.15°C).

### 3. Le Choixpeau Magique 🧙‍♂️
*   **Concept** : Un quiz de personnalité en 5 questions ("Tu préfères le courage ou la ruse ?").
*   **Logique** : Chaque réponse ajoute des points à une maison (Gryffondor, Serpentard...). À la fin, on affiche la maison gagnante.
*   **Compétence** : Gestion de variables compteurs.

---

## 🟠 Niveau 2 : Boucles & Fonctions
*Prérequis : `while`, `for`, `def`, `return`.*

### 4. Dessin avec Turtle 🐢
*   **Concept** : Créer des fonctions pour dessiner des formes géométriques paramétrables (`carre(cote)`, `etoile(taille)`).
*   **Logique** : Utiliser des boucles pour répéter les traits.
*   **Projet** : Dessiner un drapeau ou une ville générée aléatoirement.

### 5. Générateur de Mots de Passe 🔐
*   **Concept** : L'utilisateur demande un mot de passe de longueur N avec/sans majuscules/chiffres.
*   **Logique** : Boucle pour construire la chaîne caractère par caractère.
*   **Extension** : Tester la robustesse d'un mot de passe saisi.

### 6. Casino : La Machine à Sous 🎰
*   **Concept** : L'utilisateur a 100€ de mise. Il parie. 3 symboles s'affichent.
*   **Logique** : Si 3 identiques -> Jackpot (x10). Si 2 identiques -> Rembourse (x2). Sinon perdu. Boucle `while` tant que `argent > 0`.

---

## 🔴 Niveau 3 : Listes & Tuples
*Prérequis : Indexation, `append`, parcours de liste.*

### 7. Le Pendu ☠️
*   **Concept** : Deviner un mot lettre par lettre.
*   **Structure** : Une liste pour le mot secret, une liste pour l'état actuel `['_', 'A', '_', 'E']`.
*   **Logique** : Vérifier si la lettre proposée est `in` mot. Mettre à jour l'affichage.

### 8. Gestionnaire de Notes 📝
*   **Concept** : Saisir des notes, calculer la moyenne, trouver la note max/min.
*   **Logique** : Stocker les notes dans une liste. Créer des fonctions `calculer_moyenne(liste)`, `trouver_max(liste)`.
*   **Extension** : Ajouter des coefficients (liste de tuples `(note, coeff)`).

### 9. Mastermind (Simplifié) 🧠
*   **Concept** : L'ordinateur génère une combinaison de 4 couleurs `['R', 'V', 'B', 'J']`.
*   **Logique** : L'utilisateur propose une liste. Le programme renvoie le nombre de "Bien placé" et "Mal placé".

---

## ⚫ Niveau 4 : Dictionnaires & Données Structurées
*Prérequis : Clés/Valeurs, CSV (optionnel), JSON.*

### 10. Pokedex / Répertoire 📱
*   **Concept** : Stocker des contacts ou des Pokémons.
*   **Structure** : Dictionnaire de dictionnaires.
    ```python
    pokedex = {
        "Pikachu": {"type": "Electrik", "pv": 35},
        "Bulbizarre": {"type": "Plante", "pv": 45}
    }
    ```
*   **Fonctionnalités** : Ajouter, Rechercher par nom, Filtrer par type.

### 11. Analyseur de Texte (Faux Moteur de Recherche) 🔍
*   **Concept** : Analyser un long texte (copier-coller d'un livre).
*   **Logique** : Compter l'occurrence de chaque mot.
*   **Structure** : Dictionnaire `mot -> nombre_occurrences`.
*   **Affichage** : Quels sont les 5 mots les plus fréquents ?

### 12. Quiz Capitales (Data) 🌍
*   **Concept** : Un dictionnaire `pays -> capitale`.
*   **Jeu** : Poser 10 questions aléatoires. Compter les points.
*   **Extension** : Stocker les scores dans un fichier externe.

---

## 🟣 Projets Web & Transversaux
*Prérequis : HTML/CSS/JS ou Python Web.*

### 13. "Un Héros dont vous êtes le Héros" (Web) ⚔️
*   **Concept** : Site web avec une histoire à embranchements.
*   **Technique** : Pages HTML liées ou JavaScript pour gérer les choix.

### 14. Cryptographie : Chiffre de César (Python) 🕵️
*   **Concept** : Chiffrer/Déchiffrer un message en décalant les lettres.
*   **Logique** : Manipulation des codes ASCII (`ord()`, `chr()`).

### 15. Pixel Art (Python + Image) 🎨
*   **Concept** : Générer une image au format PPM (texte simple) via un script Python.
*   **Logique** : Écrire dans un fichier texte les valeurs RVB pixel par pixel pour créer un dégradé ou un drapeau.
