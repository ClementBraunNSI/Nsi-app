---
title: "TP : Structures et Pointeurs en C"
chapter: "C : Programmation Structurée"
badgeId: "c_structs"
meta: "Struct, Typedef, Pointeurs, Allocation Dynamique"
---

<ExerciseTabs courseId="c_structs" courseTitle="TP C - Structures">

  <ExerciseSection id="tp-c-exo1" label="1. Le Temps qui passe">
    <Enonce>
    ## 🕒 Exercice 1 : Gestion du Temps (Débutant)

    ### Objectif
    Créer une structure pour représenter une heure (Heures, Minutes, Secondes) et écrire une fonction pour l'afficher proprement.

    ### Étapes
    1.  Définir une structure `Heure` avec 3 entiers : `h`, `m`, `s`.
    2.  Écrire une fonction `afficher_heure(Heure t)` qui affiche l'heure au format `HH:MM:SS` (ex: `09:05:02`).
    3.  Dans le `main`, créer une variable `reveil` initialisée à 9h, 5min, 2sec et l'afficher.

    ### Rappel Formatage
    Utilisez `%02d` dans `printf` pour forcer l'affichage sur 2 chiffres (ex: 5 devient 05).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo2" label="2. Distance Points">
    <Enonce>
    ## 📍 Exercice 2 : Géométrie (Débutant)

    ### Objectif
    Manipuler des coordonnées et utiliser la librairie mathématique.

    ### Étapes
    1.  Définir une structure `Point` avec deux flottants `x` et `y`.
    2.  Écrire une fonction `distance(Point a, Point b)` qui retourne la distance euclidienne entre les deux points.
    3.  Formule : $\sqrt{(x_b - x_a)^2 + (y_b - y_a)^2}$
    4.  Tester avec le point A(0,0) et B(3,4). Le résultat doit être 5.0.

    *Note : N'oubliez pas d'inclure `<math.h>` et de compiler avec `-lm` si nécessaire.*
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo3" label="3. Nombres Complexes">
    <Enonce>
    ## 🌀 Exercice 3 : Nombres Complexes (Débutant)

    ### Objectif
    Créer une "méthode" d'addition qui retourne une nouvelle structure.

    ### Étapes
    1.  Définir une structure `Complexe` (partie réelle `re`, partie imaginaire `im`).
    2.  Écrire une fonction `addition(Complexe z1, Complexe z2)` qui retourne un **nouveau** `Complexe` correspondant à la somme.
    3.  Dans le `main`, additionner $1 + 2i$ et $3 - 4i$. Afficher le résultat ($4 - 2i$).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo4" label="4. Passage par Pointeur">
    <Enonce>
    ## 🔄 Exercice 4 : Modification d'État (Intermédiaire)

    ### Objectif
    Comprendre pourquoi les pointeurs sont indispensables pour modifier une structure.

    ### Étapes
    1.  Reprendre la structure `Heure` de l'exercice 1.
    2.  Écrire une fonction `tick(Heure *t)` (Notez le pointeur !) qui ajoute une seconde à l'heure.
    3.  **Attention aux retenues :**
        *   Si secondes > 59 -> secondes = 0 et minutes + 1
        *   Si minutes > 59 -> minutes = 0 et heures + 1
        *   Si heures > 23 -> heures = 0
    4.  Tester en passant de `23:59:59` à `00:00:00`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo5" label="5. Rectangle & Pointeur">
    <Enonce>
    ## ▭ Exercice 5 : Rectangle (Intermédiaire)

    ### Objectif
    Manipuler des pointeurs de structure.

    ### Étapes
    1.  Définir une structure `Rectangle` (longueur, largeur).
    2.  Écrire une fonction `init_rect(Rectangle *r, float L, float l)` qui initialise les champs du rectangle pointé par `r`.
    3.  Écrire une fonction `perimetre(Rectangle *r)` qui retourne le périmètre.
    4.  Écrire une fonction `surface(Rectangle *r)` qui retourne l'aire.
    5.  Dans le `main`, déclarer un rectangle sans l'initialiser, puis utiliser `init_rect` pour le configurer.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo6" label="6. Tableau de Structures">
    <Enonce>
    ## 👥 Exercice 6 : Classe d'Étudiants (Intermédiaire)

    ### Objectif
    Gérer un tableau de structures.

    ### Étapes
    1.  Définir `Etudiant` (nom, moyenne).
    2.  Dans le `main`, créer un tableau `Etudiant classe[3]`.
    3.  Remplir le tableau avec des données (ex: "Alice" 15, "Bob" 8, "Charlie" 12).
    4.  Écrire une boucle qui affiche le nom des étudiants ayant la moyenne (>= 10).
    5.  Calculer et afficher la moyenne générale de la classe.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo7" label="7. Produit Vectoriel">
    <Enonce>
    ## 🏹 Exercice 7 : Vecteurs 3D (Intermédiaire)

    ### Objectif
    Retourner une structure calculée à partir de deux autres.

    ### Étapes
    1.  Structure `Vecteur3D` (x, y, z).
    2.  Fonction `produit_vectoriel(Vecteur3D u, Vecteur3D v)` qui retourne un vecteur $w = u \wedge v$.
    3.  Rappel mathématique :
        *   $w.x = u.y * v.z - u.z * v.y$
        *   $w.y = u.z * v.x - u.x * v.z$
        *   $w.z = u.x * v.y - u.y * v.x$
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo8" label="8. RPG : Héros">
    <Enonce>
    ## ⚔️ Exercice 8 : Mini RPG (Avancé)

    ### Objectif
    Simuler un combat tour par tour.

    ### Étapes
    1.  Structure `Personnage` : `nom` (char*), `pv` (int), `force` (int).
    2.  Fonction `attaquer(Personnage *attaquant, Personnage *cible)` :
        *   La cible perd autant de PV que la force de l'attaquant.
        *   Afficher "X attaque Y ! Y perd Z PV."
    3.  Fonction `est_vivant(Personnage p)` : retourne 1 (vrai) si pv > 0, sinon 0.
    4.  Dans le `main`, créer "Arthur" (50 PV, 5 Force) et "Monstre" (30 PV, 8 Force).
    5.  Faire une boucle `while` où ils s'attaquent tour à tour jusqu'à ce que l'un meure.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo9" label="9. Gestion Bibliothèque">
    <Enonce>
    ## 📚 Exercice 9 : Bibliothèque (Avancé)

    ### Objectif
    Gestion complète avec tableau et recherche.

    ### Étapes
    1.  Structure `Livre` : `titre`, `auteur`, `id`, `est_emprunte` (int 0 ou 1).
    2.  Créer un tableau `bibliotheque[100]` et une variable `nb_livres`.
    3.  Fonction `ajouter_livre(...)` qui ajoute un livre au tableau.
    4.  Fonction `emprunter_livre(int id)` : cherche le livre par son ID et passe `est_emprunte` à 1. Gérer les erreurs (livre introuvable ou déjà emprunté).
    5.  Fonction `afficher_disponibles()` : liste les livres non empruntés.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo10" label="10. Structures Imbriquées">
    <Enonce>
    ## 🏠 Exercice 10 : Structures dans Structures (Expert)

    ### Objectif
    Manipuler des données hiérarchiques.

    ### Étapes
    1.  Structure `Adresse` : `numero`, `rue`, `code_postal`, `ville`.
    2.  Structure `Client` : `nom`, `prenom`, `adresse_facturation` (type Adresse), `adresse_livraison` (type Adresse).
    3.  Fonction `afficher_client(Client c)` qui affiche tout proprement.
    4.  Dans le `main`, initialiser un client.
    5.  **Défi :** Demander à l'utilisateur si l'adresse de livraison est la même que la facturation. Si oui, copier la structure adresse facturation dans livraison (`client.livraison = client.facturation`).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo11" label="11. Allocation Dynamique">
    <Enonce>
    ## 🧠 Exercice 11 : Allocation Dynamique (Expert)

    ### Objectif
    Créer une structure sur le tas (Heap) au lieu de la pile (Stack).

    ### Étapes
    1.  Reprendre la structure `Etudiant` (nom, moyenne).
    2.  Écrire une fonction `creer_etudiant(char *nom, float moyenne)` qui :
        *   Utilise `malloc` pour allouer la mémoire d'un `Etudiant`.
        *   Initialise les champs (attention à `strcpy` pour le nom).
        *   Retourne le pointeur `Etudiant*`.
    3.  Dans le `main`, créer un étudiant via cette fonction.
    4.  L'afficher.
    5.  **Important :** Libérer la mémoire avec `free` à la fin.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo12" label="12. Tableau Dynamique">
    <Enonce>
    ## 📈 Exercice 12 : Tableau Dynamique de Structures (Expert +)

    ### Objectif
    Gérer un nombre d'éléments inconnu à la compilation.

    ### Étapes
    1.  Demander à l'utilisateur combien de points il veut saisir (`n`).
    2.  Allouer dynamiquement un tableau de `n` structures `Point` (`Point *tab = malloc(...)`).
    3.  Faire une boucle pour remplir les coordonnées de chaque point.
    4.  Afficher tous les points.
    5.  Libérer le tableau.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo13" label="13. Inventaire Jeu">
    <Enonce>
    ## 🎒 Exercice 13 : Inventaire de Jeu Vidéo (Expert)

    ### Contexte
    Dans un RPG, le joueur possède un inventaire limité en poids.

    ### Objectif
    Gérer un tableau dynamique d'objets avec contrainte.

    ### Étapes
    1.  Structure `Objet` : `nom` (char*), `poids` (float), `valeur` (int).
    2.  Structure `Inventaire` :
        *   `objets` (pointeur vers `Objet`, tableau dynamique)
        *   `capacite_max` (int, nombre de slots)
        *   `nb_objets` (int, actuel)
    3.  Fonction `ajouter_objet(Inventaire *inv, Objet o)` :
        *   Vérifie s'il reste de la place.
        *   Si oui, ajoute l'objet.
        *   Sinon, affiche "Inventaire plein !".
    4.  **Défi :** Ajouter une fonction `trier_par_valeur` qui trie les objets du plus cher au moins cher (Bubble Sort ou QSort).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo14" label="14. Liste Chaînée (Playlist)">
    <Enonce>
    ## 🎵 Exercice 14 : Playlist Musicale (Expert +)

    ### Contexte
    Une playlist est une liste de chansons où l'on peut facilement ajouter ou supprimer un titre au milieu. C'est le cas parfait pour une liste chaînée.

    ### Étapes
    1.  Structure `Chanson` (Maillon) :
        *   `titre` (char*)
        *   `artiste` (char*)
        *   `duree` (int, en secondes)
        *   `suivante` (pointeur vers `struct Chanson`)
    2.  Fonction `ajouter_chanson(Chanson **playlist, char *titre, ...)` : ajoute à la fin.
    3.  Fonction `supprimer_chanson(Chanson **playlist, char *titre)` : cherche et supprime le maillon (attention à recoller les morceaux de la chaîne !).
    4.  Fonction `duree_totale(Chanson *playlist)` : parcourt et somme les durées.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-c-exo15" label="15. Gestionnaire de Tâches">
    <Enonce>
    ## ✅ Exercice 15 : Todo List Prioritaire (Bonus)

    ### Contexte
    On veut gérer une liste de tâches, mais on veut toujours récupérer la tâche la plus urgente en premier.

    ### Objectif
    Implémenter une file d'attente prioritaire simple.

    ### Étapes
    1.  Structure `Tache` :
        *   `description` (char*)
        *   `priorite` (int, 1=Urgent, 5=Faible)
    2.  Créer un tableau dynamique de Tâches.
    3.  Fonction `ajouter_tache(...)`.
    4.  Fonction `prochaine_tache(...)` :
        *   Parcourt le tableau pour trouver la tâche avec la priorité la plus petite (la plus urgente).
        *   L'affiche et la supprime du tableau (en décalant les autres).
    5.  Scénario : Ajouter "Faire les courses" (3), "Payer loyer" (1), "Cinéma" (5). Vérifier que "Payer loyer" sort en premier.
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
