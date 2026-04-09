---
title: 'TP : Structures et Pointeurs en C'
level: particuliers
chapter: 'C : Programmation Structurée'
badgeId: c_structs
meta: 'Struct, Typedef, Pointeurs, Allocation Dynamique'
prerequisites:
  - cours-structures-pointeurs
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
    <Correction>
    ```c
    #include <stdio.h>

    typedef struct {
        int h;
        int m;
        int s;
    } Heure;

    void afficher_heure(Heure t) {
        printf("%02d:%02d:%02d\n", t.h, t.m, t.s);
    }

    int main() {
        Heure reveil = {9, 5, 2};
        afficher_heure(reveil);
        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>
    #include <math.h>

    typedef struct {
        float x;
        float y;
    } Point;

    float distance(Point a, Point b) {
        return sqrt(pow(b.x - a.x, 2) + pow(b.y - a.y, 2));
    }

    int main() {
        Point A = {0.0, 0.0};
        Point B = {3.0, 4.0};
        
        printf("Distance AB : %.2f\n", distance(A, B)); // Affiche 5.00
        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>

    typedef struct {
        float re;
        float im;
    } Complexe;

    Complexe addition(Complexe z1, Complexe z2) {
        Complexe res;
        res.re = z1.re + z2.re;
        res.im = z1.im + z2.im;
        return res;
    }

    int main() {
        Complexe z1 = {1.0, 2.0};
        Complexe z2 = {3.0, -4.0};
        
        Complexe somme = addition(z1, z2);
        
        printf("Somme : %.2f + %.2fi\n", somme.re, somme.im);
        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>

    typedef struct {
        int h;
        int m;
        int s;
    } Heure;

    void tick(Heure *t) {
        t->s++;
        if (t->s > 59) {
            t->s = 0;
            t->m++;
            if (t->m > 59) {
                t->m = 0;
                t->h++;
                if (t->h > 23) {
                    t->h = 0;
                }
            }
        }
    }

    int main() {
        Heure reveil = {23, 59, 59};
        tick(&reveil);
        printf("%02d:%02d:%02d\n", reveil.h, reveil.m, reveil.s); // Affiche 00:00:00
        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>

    typedef struct {
        float longueur;
        float largeur;
    } Rectangle;

    void init_rect(Rectangle *r, float L, float l) {
        r->longueur = L;
        r->largeur = l;
    }

    float perimetre(Rectangle *r) {
        return 2 * (r->longueur + r->largeur);
    }

    float surface(Rectangle *r) {
        return r->longueur * r->largeur;
    }

    int main() {
        Rectangle rect;
        init_rect(&rect, 5.0, 3.0);
        
        printf("Perimetre : %.2f\n", perimetre(&rect)); // 16.00
        printf("Surface : %.2f\n", surface(&rect));     // 15.00
        
        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>
    #include <string.h>

    typedef struct {
        char nom[50];
        float moyenne;
    } Etudiant;

    int main() {
        Etudiant classe[3];
        
        // Initialisation
        strcpy(classe[0].nom, "Alice"); classe[0].moyenne = 15.0;
        strcpy(classe[1].nom, "Bob"); classe[1].moyenne = 8.0;
        strcpy(classe[2].nom, "Charlie"); classe[2].moyenne = 12.0;
        
        float somme = 0;
        
        printf("Etudiants ayant la moyenne :\n");
        for (int i = 0; i < 3; i++) {
            if (classe[i].moyenne >= 10.0) {
                printf("- %s\n", classe[i].nom);
            }
            somme += classe[i].moyenne;
        }
        
        printf("Moyenne generale : %.2f\n", somme / 3.0);
        
        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>

    typedef struct {
        float x;
        float y;
        float z;
    } Vecteur3D;

    Vecteur3D produit_vectoriel(Vecteur3D u, Vecteur3D v) {
        Vecteur3D w;
        w.x = u.y * v.z - u.z * v.y;
        w.y = u.z * v.x - u.x * v.z;
        w.z = u.x * v.y - u.y * v.x;
        return w;
    }

    int main() {
        Vecteur3D u = {1, 0, 0};
        Vecteur3D v = {0, 1, 0};
        
        Vecteur3D w = produit_vectoriel(u, v);
        
        printf("w = (%.1f, %.1f, %.1f)\n", w.x, w.y, w.z); // Affiche (0.0, 0.0, 1.0)
        
        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>
    #include <string.h>

    typedef struct {
        char nom[50];
        int pv;
        int force;
    } Personnage;

    void attaquer(Personnage *attaquant, Personnage *cible) {
        cible->pv -= attaquant->force;
        printf("%s attaque %s ! %s perd %d PV.\n", 
               attaquant->nom, cible->nom, cible->nom, attaquant->force);
    }

    int est_vivant(Personnage p) {
        return p.pv > 0;
    }

    int main() {
        Personnage hero = {"Arthur", 50, 5};
        Personnage monstre = {"Monstre", 30, 8};

        while (est_vivant(hero) && est_vivant(monstre)) {
            attaquer(&hero, &monstre);
            if (est_vivant(monstre)) {
                attaquer(&monstre, &hero);
            }
        }

        if (est_vivant(hero)) {
            printf("%s a gagne !\n", hero.nom);
        } else {
            printf("%s est mort...\n", hero.nom);
        }

        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>
    #include <string.h>

    typedef struct {
        char titre[100];
        char auteur[100];
        int id;
        int est_emprunte;
    } Livre;

    Livre bibliotheque[100];
    int nb_livres = 0;

    void ajouter_livre(char *titre, char *auteur, int id) {
        if (nb_livres < 100) {
            strcpy(bibliotheque[nb_livres].titre, titre);
            strcpy(bibliotheque[nb_livres].auteur, auteur);
            bibliotheque[nb_livres].id = id;
            bibliotheque[nb_livres].est_emprunte = 0;
            nb_livres++;
        }
    }

    void emprunter_livre(int id) {
        for (int i = 0; i < nb_livres; i++) {
            if (bibliotheque[i].id == id) {
                if (bibliotheque[i].est_emprunte == 1) {
                    printf("Erreur : Le livre '%s' est deja emprunte.\n", bibliotheque[i].titre);
                } else {
                    bibliotheque[i].est_emprunte = 1;
                    printf("Succes : Vous avez emprunte '%s'.\n", bibliotheque[i].titre);
                }
                return;
            }
        }
        printf("Erreur : Livre ID %d introuvable.\n", id);
    }

    void afficher_disponibles() {
        printf("--- Livres Disponibles ---\n");
        for (int i = 0; i < nb_livres; i++) {
            if (bibliotheque[i].est_emprunte == 0) {
                printf("[%d] %s de %s\n", bibliotheque[i].id, bibliotheque[i].titre, bibliotheque[i].auteur);
            }
        }
    }

    int main() {
        ajouter_livre("1984", "George Orwell", 101);
        ajouter_livre("Dune", "Frank Herbert", 102);
        
        afficher_disponibles();
        emprunter_livre(101);
        afficher_disponibles();
        emprunter_livre(101); // Doit afficher une erreur
        
        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>
    #include <string.h>

    typedef struct {
        int numero;
        char rue[100];
        int code_postal;
        char ville[50];
    } Adresse;

    typedef struct {
        char nom[50];
        char prenom[50];
        Adresse adresse_facturation;
        Adresse adresse_livraison;
    } Client;

    void afficher_client(Client c) {
        printf("Client : %s %s\n", c.prenom, c.nom);
        printf("Facturation : %d %s, %d %s\n", 
               c.adresse_facturation.numero, c.adresse_facturation.rue,
               c.adresse_facturation.code_postal, c.adresse_facturation.ville);
        printf("Livraison : %d %s, %d %s\n", 
               c.adresse_livraison.numero, c.adresse_livraison.rue,
               c.adresse_livraison.code_postal, c.adresse_livraison.ville);
    }

    int main() {
        Client client1;
        strcpy(client1.nom, "Dupont");
        strcpy(client1.prenom, "Jean");
        
        client1.adresse_facturation.numero = 10;
        strcpy(client1.adresse_facturation.rue, "Rue de la Paix");
        client1.adresse_facturation.code_postal = 75001;
        strcpy(client1.adresse_facturation.ville, "Paris");

        int meme_adresse = 1; // Imaginons que l'utilisateur a repondu oui
        
        if (meme_adresse) {
            // Copie magique de toute la structure !
            client1.adresse_livraison = client1.adresse_facturation;
        }

        afficher_client(client1);
        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>
    #include <stdlib.h>
    #include <string.h>

    typedef struct {
        char nom[50];
        float moyenne;
    } Etudiant;

    Etudiant* creer_etudiant(char *nom, float moyenne) {
        // Allocation sur le tas (Heap)
        Etudiant *nouveau = (Etudiant*)malloc(sizeof(Etudiant));
        
        if (nouveau != NULL) {
            strcpy(nouveau->nom, nom);
            nouveau->moyenne = moyenne;
        }
        return nouveau;
    }

    int main() {
        // e est un pointeur !
        Etudiant *e = creer_etudiant("Cleo", 18.5);
        
        if (e != NULL) {
            // On utilise -> pour acceder aux champs via un pointeur
            printf("Etudiant : %s, Moyenne : %.1f\n", e->nom, e->moyenne);
            
            // TRES IMPORTANT : liberer la memoire
            free(e);
        }
        
        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>
    #include <stdlib.h>

    typedef struct {
        float x;
        float y;
    } Point;

    int main() {
        int n;
        printf("Combien de points voulez-vous ? ");
        scanf("%d", &n);

        // Allocation dynamique d'un tableau de n Points
        Point *tab = (Point*)malloc(n * sizeof(Point));

        if (tab == NULL) {
            printf("Erreur d'allocation memoire.\n");
            return 1;
        }

        // Remplissage
        for (int i = 0; i < n; i++) {
            printf("Point %d - x : ", i+1);
            scanf("%f", &tab[i].x);
            printf("Point %d - y : ", i+1);
            scanf("%f", &tab[i].y);
        }

        // Affichage
        printf("\n--- Liste des points ---\n");
        for (int i = 0; i < n; i++) {
            printf("P%d(%.2f, %.2f)\n", i+1, tab[i].x, tab[i].y);
        }

        // Liberation !
        free(tab);

        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>
    #include <stdlib.h>
    #include <string.h>

    typedef struct {
        char nom[50];
        float poids;
        int valeur;
    } Objet;

    typedef struct {
        Objet *objets;
        int capacite_max;
        int nb_objets;
    } Inventaire;

    Inventaire* creer_inventaire(int capacite) {
        Inventaire *inv = (Inventaire*)malloc(sizeof(Inventaire));
        inv->capacite_max = capacite;
        inv->nb_objets = 0;
        // Tableau dynamique d'objets
        inv->objets = (Objet*)malloc(capacite * sizeof(Objet));
        return inv;
    }

    void ajouter_objet(Inventaire *inv, char *nom, float poids, int valeur) {
        if (inv->nb_objets >= inv->capacite_max) {
            printf("Inventaire plein ! Impossible d'ajouter %s.\n", nom);
            return;
        }
        
        // On ajoute a l'indice actuel, puis on incremente
        strcpy(inv->objets[inv->nb_objets].nom, nom);
        inv->objets[inv->nb_objets].poids = poids;
        inv->objets[inv->nb_objets].valeur = valeur;
        
        inv->nb_objets++;
        printf("Ajoute : %s\n", nom);
    }

    void liberer_inventaire(Inventaire *inv) {
        free(inv->objets); // D'abord libérer le tableau interne
        free(inv);         // Ensuite libérer la structure principale
    }

    int main() {
        Inventaire *sac = creer_inventaire(2); // Sac de 2 places
        
        ajouter_objet(sac, "Epee en Fer", 3.5, 150);
        ajouter_objet(sac, "Potion de Soin", 0.5, 20);
        ajouter_objet(sac, "Bouclier lourd", 5.0, 300); // Doit echouer
        
        liberer_inventaire(sac);
        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>
    #include <stdlib.h>
    #include <string.h>

    typedef struct Chanson {
        char titre[100];
        int duree; // en secondes
        struct Chanson *suivante; // Pointeur vers le maillon suivant
    } Chanson;

    void ajouter_chanson(Chanson **playlist, char *titre, int duree) {
        Chanson *nouvelle = (Chanson*)malloc(sizeof(Chanson));
        strcpy(nouvelle->titre, titre);
        nouvelle->duree = duree;
        nouvelle->suivante = NULL;

        if (*playlist == NULL) {
            *playlist = nouvelle; // La liste etait vide
        } else {
            Chanson *courante = *playlist;
            while (courante->suivante != NULL) {
                courante = courante->suivante;
            }
            courante->suivante = nouvelle; // Ajout a la fin
        }
    }

    void afficher_playlist(Chanson *playlist) {
        Chanson *courante = playlist;
        int i = 1;
        while (courante != NULL) {
            printf("%d. %s (%ds)\n", i++, courante->titre, courante->duree);
            courante = courante->suivante;
        }
    }

    int main() {
        Chanson *ma_playlist = NULL; // Liste vide au depart
        
        ajouter_chanson(&ma_playlist, "Bohemian Rhapsody", 354);
        ajouter_chanson(&ma_playlist, "Hotel California", 390);
        
        afficher_playlist(ma_playlist);
        
        // (Il faudrait aussi coder une fonction pour free toute la liste !)
        return 0;
    }
    ```
    </Correction>
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
    <Correction>
    ```c
    #include <stdio.h>
    #include <string.h>

    typedef struct {
        char description[100];
        int priorite; // 1 = max
    } Tache;

    Tache todo[100];
    int nb_taches = 0;

    void ajouter_tache(char *desc, int prio) {
        strcpy(todo[nb_taches].description, desc);
        todo[nb_taches].priorite = prio;
        nb_taches++;
    }

    void prochaine_tache() {
        if (nb_taches == 0) {
            printf("Aucune tache a faire !\n");
            return;
        }

        int index_min = 0;
        // Recherche de la plus haute priorite (valeur la plus basse)
        for (int i = 1; i < nb_taches; i++) {
            if (todo[i].priorite < todo[index_min].priorite) {
                index_min = i;
            }
        }

        printf("-> Prochaine tache : %s (Prio: %d)\n", 
               todo[index_min].description, todo[index_min].priorite);

        // Suppression (on ecrase avec la derniere pour eviter de tout decaler)
        todo[index_min] = todo[nb_taches - 1];
        nb_taches--;
    }

    int main() {
        ajouter_tache("Faire les courses", 3);
        ajouter_tache("Payer loyer", 1);
        ajouter_tache("Cinema", 5);

        prochaine_tache(); // Payer loyer
        prochaine_tache(); // Faire les courses
        prochaine_tache(); // Cinema
        prochaine_tache(); // Vide

        return 0;
    }
    ```
    </Correction>
  </ExerciseSection>

</ExerciseTabs>
