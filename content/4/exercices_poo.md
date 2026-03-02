---
title: "TP : Les Bases de la POO en C#"
chapter: "BTS SIO 1 : B2 - Développement (SLAM)"
badgeId: "bts_poo_basics"
meta: "Classes, Objets, Propriétés, Constructeurs, Héritage"
---

<ExerciseTabs courseId="bts_poo_basics" courseTitle="TP POO - Bases">
  
  <ExerciseSection id="tp-poo-exercice1" label="Exercice 1 - Compte Bancaire">
    <Enonce>
    ## 🏦 Exercice 1 : Gestion de Compte Bancaire (Niveau Débutant)

    ### Contexte
    Vous devez créer un système simple pour gérer un compte bancaire avec des opérations de base.

    ### 📋 Étapes à réaliser

    **Étape 1 : Créer la classe `CompteBancaire`**

    Créez une classe `CompteBancaire` avec les propriétés suivantes :
    - `string Titulaire` (propriété publique avec get et set)
    - `double Solde` (propriété publique avec get et **private** set - le solde ne peut être modifié que par les méthodes de la classe)

    **Étape 2 : Ajouter un constructeur**

    Créez un constructeur qui prend en paramètres :
    - Le nom du titulaire
    - Le solde initial (par défaut 0)

    **Étape 3 : Ajouter les méthodes**

    Implémentez les méthodes suivantes :

    ```csharp
    // Déposer de l'argent sur le compte
    public void Deposer(double montant)
    {
        // Si le montant est positif, l'ajouter au solde
        // Afficher un message de confirmation
    }

    // Retirer de l'argent du compte
    public void Retirer(double montant)
    {
        // Si le montant est positif ET qu'il y a assez d'argent
        // Retirer le montant du solde
        // Sinon afficher un message d'erreur
    }

    // Afficher les informations du compte
    public void AfficherInfos()
    {
        // Afficher : "Compte de [Titulaire] : [Solde]€"
    }
    ```

    **Étape 4 : Tester dans le Main**

    ```csharp
    public static void Main()
    {
        // Créer un compte avec 100€ de solde initial
        CompteBancaire compte1 = new CompteBancaire("Alice Dupont", 100);
        
        // Afficher les informations
        compte1.AfficherInfos();
        
        // Déposer 50€
        compte1.Deposer(50);
        compte1.AfficherInfos();
        
        // Retirer 30€
        compte1.Retirer(30);
        compte1.AfficherInfos();
        
        // Essayer de retirer 200€ (plus que le solde)
        compte1.Retirer(200);
        compte1.AfficherInfos();
    }
    ```

    ### 🎯 Résultat attendu
    ```
    Compte de Alice Dupont : 100€
    Dépôt de 50€ effectué.
    Compte de Alice Dupont : 150€
    Retrait de 30€ effectué.
    Compte de Alice Dupont : 120€
    Solde insuffisant pour retirer 200€
    Compte de Alice Dupont : 120€
    ```

    ### 💡 Concepts travaillés
    - Création d'une classe simple
    - Propriétés avec contrôle d'accès (`private set`)
    - Constructeur avec paramètres
    - Méthodes qui modifient l'état de l'objet

    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-poo-exercice2" label="Exercice 2 - Bibliothèque">
    <Enonce>
    ## 📚 Exercice 2 : Gestion de Livres (Niveau Débutant/Intermédiaire)

    ### Contexte
    Vous devez créer un système pour gérer des livres dans une bibliothèque.

    ### 📋 Étapes à réaliser

    **Étape 1 : Créer la classe `Livre`**

    Créez une classe `Livre` avec les propriétés suivantes :
    - `string Titre`
    - `string Auteur`
    - `int AnneePublication`
    - `bool EstEmprunte` (propriété avec **private set**)

    **Étape 2 : Ajouter un constructeur**

    Le constructeur doit prendre en paramètres le titre, l'auteur et l'année de publication.
    Par défaut, un livre n'est pas emprunté (`EstEmprunte = false`).

    **Étape 3 : Ajouter les méthodes**

    ```csharp
    // Emprunter le livre
    public void Emprunter()
    {
        // Si le livre n'est pas déjà emprunté, le marquer comme emprunté
        // Afficher un message approprié
    }

    // Retourner le livre
    public void Retourner()
    {
        // Si le livre est emprunté, le marquer comme disponible
        // Afficher un message approprié
    }

    // Afficher les informations du livre
    public void AfficherInfos()
    {
        // Afficher : "Titre par Auteur (Année) - Statut : Disponible/Emprunté"
    }

    // Calculer l'âge du livre
    public int CalculerAge()
    {
        // Retourner la différence entre l'année actuelle (2025) et l'année de publication
    }
    ```

    **Étape 4 : Tester dans le Main**

    ```csharp
    public static void Main()
    {
        // Créer plusieurs livres
        Livre livre1 = new Livre("1984", "George Orwell", 1949);
        Livre livre2 = new Livre("Le Petit Prince", "Antoine de Saint-Exupéry", 1943);
        
        // Afficher les informations
        livre1.AfficherInfos();
        Console.WriteLine($"Âge du livre : {livre1.CalculerAge()} ans");
        
        // Emprunter le livre
        livre1.Emprunter();
        livre1.AfficherInfos();
        
        // Essayer de l'emprunter à nouveau
        livre1.Emprunter();
        
        // Retourner le livre
        livre1.Retourner();
        livre1.AfficherInfos();
    }
    ```

    ### 🎯 Résultat attendu
    ```
    1984 par George Orwell (1949) - Statut : Disponible
    Âge du livre : 76 ans
    Le livre "1984" a été emprunté.
    1984 par George Orwell (1949) - Statut : Emprunté
    Ce livre est déjà emprunté.
    Le livre "1984" a été retourné.
    1984 par George Orwell (1949) - Statut : Disponible
    ```

    ### 💡 Concepts travaillés
    - Gestion d'état (disponible/emprunté)
    - Validation avant modification
    - Calcul basé sur les propriétés
    - Messages contextuels
  
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-poo-exercice3" label="Exercice 3 - Étudiants">
    <Enonce>
    ## 🎓 Exercice 3 : Gestion d'Étudiants (Niveau Intermédiaire)

    ### Contexte
    Vous devez créer un système pour gérer des étudiants avec leurs notes et calculs de moyenne.

    ### 📋 Étapes à réaliser

    **Étape 1 : Créer la classe `Etudiant`**

    Créez une classe `Etudiant` avec les propriétés suivantes :
    - `string Nom`
    - `string Prenom`
    - `int NumeroEtudiant` (propriété en lecture seule - `{ get; }`)
    - `List<double> Notes` (propriété privée : `private List<double> notes`)

    **Étape 2 : Ajouter un constructeur**

    Le constructeur doit prendre en paramètres le nom, le prénom et le numéro d'étudiant.
    Il doit initialiser la liste de notes comme une liste vide.

    ```csharp
    public Etudiant(string nom, string prenom, int numeroEtudiant)
    {
        Nom = nom;
        Prenom = prenom;
        NumeroEtudiant = numeroEtudiant;
        notes = new List<double>();
    }
    ```

    **Étape 3 : Ajouter les méthodes**

    ```csharp
    // Ajouter une note
    public void AjouterNote(double note)
    {
        // Si la note est entre 0 et 20, l'ajouter à la liste
        // Sinon afficher un message d'erreur
    }

    // Calculer la moyenne
    public double CalculerMoyenne()
    {
        // Si la liste est vide, retourner 0
        // Sinon calculer et retourner la moyenne des notes
    }

    // Obtenir la mention
    public string ObtenirMention()
    {
        // Calculer la moyenne
        // Retourner la mention appropriée :
        // >= 16 : "Très bien"
        // >= 14 : "Bien"
        // >= 12 : "Assez bien"
        // >= 10 : "Passable"
        // < 10 : "Insuffisant"
    }

    // Afficher le nombre de notes
    public int NombreDeNotes()
    {
        // Retourner le nombre d'éléments dans la liste de notes
    }

    // Afficher les informations complètes
    public void AfficherInfos()
    {
        // Afficher : "Étudiant N°[Numéro] : [Prénom] [Nom]"
        // Afficher : "Nombre de notes : [X]"
        // Afficher : "Moyenne : [XX.XX]/20 - Mention : [Mention]"
    }
    ```

    **Étape 4 : Tester dans le Main**

    ```csharp
    public static void Main()
    {
        // Créer un étudiant
        Etudiant etudiant1 = new Etudiant("Martin", "Sophie", 12345);
        
        // Ajouter des notes
        etudiant1.AjouterNote(15);
        etudiant1.AjouterNote(12);
        etudiant1.AjouterNote(16.5);
        etudiant1.AjouterNote(14);
        
        // Essayer d'ajouter une note invalide
        etudiant1.AjouterNote(25);
        
        // Afficher les informations
        etudiant1.AfficherInfos();
        
        // Créer un deuxième étudiant
        Etudiant etudiant2 = new Etudiant("Dubois", "Thomas", 12346);
        etudiant2.AjouterNote(18);
        etudiant2.AjouterNote(17.5);
        etudiant2.AjouterNote(16);
        etudiant2.AfficherInfos();
    }
    ```

    ### 🎯 Résultat attendu
    ```
    Note invalide. La note doit être entre 0 et 20.
    Étudiant N°12345 : Sophie Martin
    Nombre de notes : 4
    Moyenne : 14.38/20 - Mention : Bien
    Étudiant N°12346 : Thomas Dubois
    Nombre de notes : 3
    Moyenne : 17.17/20 - Mention : Très bien
    ```

    ### 💡 Concepts travaillés
    - Propriété en lecture seule
    - Collection privée (encapsulation)
    - Calculs sur collections
    - Validation de données
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-poo-exercice4" label="Exercice 4 - Concessionnaire">
    <Enonce>
    ## 🚗 Exercice 4 : Gestion de Concessionnaire (Niveau Intermédiaire/Avancé)

    ### Contexte
    Un concessionnaire automobile a besoin d'un système pour gérer son inventaire de voitures. Vous devez créer deux classes qui travaillent ensemble : `Voiture` et `Concessionnaire`.

    ### 📋 Étapes à réaliser

    **Étape 1 : Créer la classe `Voiture`**

    Créez une classe `Voiture` avec les propriétés suivantes :
    - `string Marque`
    - `string Modele`
    - `int Annee`
    - `double Prix`
    - `int Kilometrage`
    - `bool EstVendue` (propriété avec **private set**)

    **Étape 2 : Constructeur de `Voiture`**

    Créez un constructeur qui initialise la marque, le modèle, l'année, le prix et le kilométrage.
    Par défaut, la propriété `EstVendue` doit être initialisée à `false`.

    **Étape 3 : Méthodes de `Voiture`**

    Implémentez les méthodes suivantes :

    ```csharp
    // Marquer la voiture comme vendue
    public void Vendre()
    {
        // Si la voiture n'est pas déjà vendue :
        // - Passer EstVendue à true
        // - Afficher un message de confirmation
        // Sinon :
        // - Afficher que la voiture est déjà vendue
    }

    // Afficher les informations de la voiture
    public void AfficherInfos()
    {
        // Afficher : "[Marque] [Modele] ([Année]) - [Prix]€ - [Kilometrage] km - Statut : [Disponible/Vendue]"
    }

    // Calculer l'âge de la voiture
    public int CalculerAge()
    {
        // Retourner la différence entre l'année actuelle (2025) et l'Année de la voiture
    }

    // Appliquer une remise sur le prix
    public void AppliquerRemise(double pourcentage)
    {
        // Réduire le Prix du pourcentage donné
        // Afficher le nouveau prix
    }
    ```

    **Étape 4 : Créer la classe `Concessionnaire`**

    Créez une classe `Concessionnaire` avec les propriétés suivantes :
    - `string Nom` (lecture/écriture)
    - `string Ville` (lecture/écriture)
    - `List<Voiture> voitures` (attribut privé pour stocker la liste des voitures)

    **Constructeur :**
    - Initialise le nom et la ville.
    - Initialise la liste de voitures (vide au départ).

    **Méthodes à implémenter :**

    ```csharp
    // Ajouter une voiture à l'inventaire
    public void AjouterVoiture(Voiture voiture)
    {
        // Ajouter la voiture à la liste
        // Afficher un message : "Voiture ajoutée : [Marque] [Modele]"
    }

    // Afficher toutes les voitures disponibles (non vendues)
    public void AfficherVoituresDisponibles()
    {
        // Parcourir la liste
        // Si la voiture n'est pas vendue (!v.EstVendue), appeler sa méthode AfficherInfos()
    }

    // Compter le nombre de voitures disponibles
    public int NombreVoituresDisponibles()
    {
        // Retourner le nombre de voitures dans la liste qui ne sont pas vendues
    }

    // Trouver la voiture la moins chère disponible
    public Voiture VoitureLaMoinsChere()
    {
        // Parcourir les voitures disponibles
        // Retourner celle qui a le prix le plus bas
        // Retourner null si aucune voiture n'est disponible
    }

    // Calculer la valeur totale du stock disponible
    public double ValeurStockTotal()
    {
        // Retourner la somme des prix de toutes les voitures NON vendues
    }

    // Afficher les statistiques du concessionnaire
    public void AfficherStatistiques()
    {
        // Afficher :
        // "=== Concessionnaire [Nom] ([Ville]) ==="
        // "Nombre total de voitures : [Total]"
        // "Voitures disponibles : [NombreDispo]"
        // "Valeur totale du stock : [Valeur]€"
    }
    ```

    **Étape 5 : Tester dans le Main**

    ```csharp
    public static void Main()
    {
        // Créer un concessionnaire
        Concessionnaire concession = new Concessionnaire("Auto Premium", "Paris");
        
        // Créer des voitures
        Voiture v1 = new Voiture("Renault", "Clio", 2020, 15000, 25000);
        Voiture v2 = new Voiture("Peugeot", "308", 2019, 18000, 35000);
        Voiture v3 = new Voiture("Citroën", "C3", 2021, 14000, 15000);
        Voiture v4 = new Voiture("BMW", "Série 3", 2022, 35000, 10000);
        
        // Ajouter les voitures au concessionnaire
        concession.AjouterVoiture(v1);
        concession.AjouterVoiture(v2);
        concession.AjouterVoiture(v3);
        concession.AjouterVoiture(v4);
        
        // Afficher les statistiques
        concession.AfficherStatistiques();
        
        // Afficher les voitures disponibles
        Console.WriteLine("\n--- Voitures disponibles ---");
        concession.AfficherVoituresDisponibles();
        
        // Vendre une voiture
        Console.WriteLine("\n--- Vente ---");
        v2.Vendre();
        
        // Appliquer une remise
        Console.WriteLine("\n--- Remise ---");
        v1.AppliquerRemise(10); // 10% de remise
        
        // Afficher les nouvelles statistiques
        Console.WriteLine("\n--- Statistiques mises à jour ---");
        concession.AfficherStatistiques();
        
        // Trouver la voiture la moins chère
        Console.WriteLine("\n--- Voiture la moins chère ---");
        Voiture moins_chere = concession.VoitureLaMoinsChere();
        if (moins_chere != null)
        {
            moins_chere.AfficherInfos();
        }
    }
    ```

    ### 🎯 Résultat attendu
    ```
    Voiture ajoutée : Renault Clio
    Voiture ajoutée : Peugeot 308
    Voiture ajoutée : Citroën C3
    Voiture ajoutée : BMW Série 3

    === Concessionnaire Auto Premium (Paris) ===
    Nombre total de voitures : 4
    Voitures disponibles : 4
    Valeur totale du stock : 82000€

    --- Voitures disponibles ---
    Renault Clio (2020) - 15000€ - 25000 km - Statut : Disponible
    Peugeot 308 (2019) - 18000€ - 35000 km - Statut : Disponible
    Citroën C3 (2021) - 14000€ - 15000 km - Statut : Disponible
    BMW Série 3 (2022) - 35000€ - 10000 km - Statut : Disponible

    --- Vente ---
    La voiture Peugeot 308 a été vendue.

    --- Remise ---
    Remise de 10% appliquée. Nouveau prix : 13500€

    --- Statistiques mises à jour ---
    === Concessionnaire Auto Premium (Paris) ===
    Nombre total de voitures : 4
    Voitures disponibles : 3
    Valeur totale du stock : 62500€

    --- Voiture la moins chère ---
    Renault Clio (2020) - 13500€ - 25000 km - Statut : Disponible
    ```

    ### 💡 Concepts travaillés
    - **Composition** : Un concessionnaire contient une liste de voitures
    - Manipulation de collections d'objets
    - Communication entre objets
    - Calculs sur des collections d'objets
    - Recherche dans une collection
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-poo-exercice5" label="Exercice 5 - Import CSV">
    <Enonce>
    ## 📂 Exercice 5 : Importation de Données CSV (Niveau Intermédiaire)

    ### Contexte
    Votre magasin reçoit régulièrement la liste de ses nouveaux produits sous forme de fichier CSV (Comma Separated Values).
    Vous devez créer un programme capable de lire ce fichier et de transformer chaque ligne en un objet `Produit` utilisable dans votre application.

    ### 📄 Le fichier CSV (`produits.csv`)
    Voici le contenu du fichier que vous devrez traiter :
    ```csv
    A100;Ecran 24 pouces;150.00;10
    B200;Clavier mécanique;89.99;5
    C300;Souris sans fil;25.50;20
    D400;Tapis de souris;12.00;50
    ```
    Chaque ligne correspond à : `Référence;Nom;Prix;Quantité`

    ### 📋 Étapes à réaliser

    **Étape 1 : Créer la classe `Produit`**
    
    Créez une classe avec les propriétés suivantes :
    - `string Reference`
    - `string Nom`
    - `double Prix`
    - `int Quantite`
    
    Ajoutez un constructeur pour initialiser ces valeurs et une méthode `Afficher()` pour voir les détails du produit.

    **Étape 2 : Comprendre la lecture de fichier**
    
    Pour lire un fichier en C#, on utilise le namespace `System.IO`.
    La méthode la plus simple est `File.ReadAllLines(chemin)` qui retourne un tableau de chaînes (une case par ligne).

    Exemple d'utilisation :
    ```csharp
    using System.IO; // Indispensable en haut du fichier

    // Lecture du fichier
    string[] lignes = File.ReadAllLines("mon_fichier.csv");
    
    foreach (string ligne in lignes)
    {
        // ligne contient par exemple : "A100;Ecran 24 pouces;150.00;10"
        
        // On découpe la ligne à chaque point-virgule
        string[] colonnes = ligne.Split(';'); 
        
        string refProduit = colonnes[0]; // "A100"
        string nomProduit = colonnes[1]; // "Ecran 24 pouces"
        
        // Attention : il faut convertir les chaînes en nombres !
        double prix = double.Parse(colonnes[2]); // "150.00" -> 150.0
        int qte = int.Parse(colonnes[3]);        // "10" -> 10
        
        // Ici, vous pouvez créer votre objet Produit...
    }
    ```

    **Étape 3 : Créer la classe `Magasin`**
    
    Elle doit contenir :
    - Une liste de produits `List<Produit> Stock`.
    - Un constructeur qui initialise la liste.
    - Une méthode `ImporterProduits(string cheminFichier)` :
      - Cette méthode doit lire le fichier ligne par ligne.
      - Pour chaque ligne, elle crée un objet `Produit` et l'ajoute au `Stock`.
      - ⚠️ **Important :** Utilisez un bloc `try...catch` pour gérer le cas où le fichier n'existe pas.

    **Étape 4 : Tester dans le Main**
    
    1. Créez manuellement un fichier `produits.csv` à la racine de votre projet avec le contenu donné plus haut.
    2. Dans le `Main`, instanciez un `Magasin`.
    3. Appelez la méthode `ImporterProduits("produits.csv")`.
    4. Affichez le contenu du stock pour vérifier que tout a bien été chargé.

    ### 🎯 Résultat attendu
    ```
    Tentative d'importation du fichier produits.csv...
    Importation réussie ! 4 produits ajoutés.

    --- Stock du Magasin ---
    [A100] Ecran 24 pouces : 150€ (Quantité: 10)
    [B200] Clavier mécanique : 89.99€ (Quantité: 5)
    [C300] Souris sans fil : 25.5€ (Quantité: 20)
    [D400] Tapis de souris : 12€ (Quantité: 50)
    ```

    ### 💡 Concepts travaillés
    - Manipulation de fichiers (`System.IO`)
    - Traitement de chaînes de caractères (`Split`)
    - Conversion de types (`Parse`)
    - Gestion des exceptions (`try/catch`)
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-poo-exercice6-animaux" label="Exercice 6 - Héritage (Animaux)">
    <Enonce>
    ## 🐾 Exercice 6 : Animaux et Héritage (Niveau Avancé)

    ### Contexte
    Vous devez créer un système de gestion d'animaux dans un refuge en utilisant l'héritage pour éviter la duplication de code.

    ### 📋 Étapes à réaliser

    **Étape 1 : Créer la classe mère `Animal`**

    ```csharp
    public class Animal
    {
        // Propriétés communes : Nom, Age, Poids, EstAdopte (private set)

        // Constructeur pour initialiser nom, age, poids (EstAdopte = false)

        // Méthode Adopter() : passe EstAdopte à true si ce n'est pas déjà le cas

        // Méthode Vieillir() : augmente l'âge de 1

        // Méthode virtuelle AfficherInfos() : affiche les infos de base
    }
    ```

    **Étape 2 : Créer la classe `Chien` qui hérite d'`Animal`**

    ```csharp
    public class Chien : Animal
    {
        // Propriété spécifique : Race

        // Constructeur : appelle le constructeur de base

        // Méthode Aboyer() : affiche "Wouf wouf"

        // Redéfinition de AfficherInfos() : affiche avec l'émoji chien et la race
    }
    ```

    **Étape 3 : Créer la classe `Chat` qui hérite d'`Animal`**

    ```csharp
    public class Chat : Animal
    {
        // Propriété spécifique : Couleur

        // Constructeur

        // Méthode Miauler() : affiche "Miaou"

        // Redéfinition de AfficherInfos()
    }
    ```

    **Étape 4 : Créer la classe `Oiseau` qui hérite d'`Animal`**

    ```csharp
    public class Oiseau : Animal
    {
        // Propriété spécifique : EnvergureAiles (en cm)

        // Constructeur

        // Méthode Chanter() : affiche "Cui cui"

        // Redéfinition de AfficherInfos()
    }
    ```

    **Étape 5 : Créer la classe `Refuge`**

    ```csharp
    public class Refuge
    {
        // Propriété Nom et liste d'animaux (List<Animal>)

        // Constructeur

        // Méthode AjouterAnimal(Animal animal)

        // Méthode AfficherTousLesAnimaux()

        // Méthode AfficherAnimauxDisponibles() : affiche seulement les animaux non adoptés

        // Méthode AfficherStatistiques() : compte et affiche le nombre de chiens, chats, oiseaux et le total disponible
        // Astuce : utilisez le mot-clé "is" pour vérifier le type (ex: if (animal is Chien))
    }
    ```

    **Étape 6 : Tester dans le Main**

    ```csharp
    public static void Main()
    {
        // 1. Créer un refuge

        // 2. Créer plusieurs animaux (chiens, chats, oiseaux)

        // 3. Ajouter les animaux au refuge

        // 4. Afficher tous les animaux

        // 5. Tester les méthodes spécifiques (Aboyer, Miauler...)

        // 6. Faire adopter quelques animaux

        // 7. Faire vieillir un animal

        // 8. Afficher les animaux disponibles et les statistiques
    }
    ```

    ### 🎯 Résultat attendu
    ```
    Rex a été ajouté au refuge.
    Bella a été ajouté au refuge.
    Minou a été ajouté au refuge.
    Félix a été ajouté au refuge.
    Kiwi a été ajouté au refuge.

    === Animaux du refuge Les Amis des Animaux ===
    🐕 Chien : Rex (Berger Allemand) - 3 ans - 25.5 kg - Statut : Disponible
    🐕 Chien : Bella (Labrador) - 5 ans - 18 kg - Statut : Disponible
    🐱 Chat : Minou (Tigré) - 2 ans - 4.5 kg - Statut : Disponible
    🐱 Chat : Félix (Noir) - 4 ans - 5 kg - Statut : Disponible
    🐦 Oiseau : Kiwi - 1 ans - 0.3 kg - Envergure : 25 cm - Statut : Disponible

    --- Test des méthodes spécifiques ---
    Rex aboie : Wouf wouf !
    Minou miaule : Miaou !
    Kiwi chante : Cui cui !

    --- Adoptions ---
    Rex a été adopté(e) !
    Minou a été adopté(e) !

    --- Anniversaire ---
    Bella a maintenant 6 ans.

    === Animaux disponibles à l'adoption ===
    🐕 Chien : Bella (Labrador) - 6 ans - 18 kg - Statut : Disponible
    🐱 Chat : Félix (Noir) - 4 ans - 5 kg - Statut : Disponible
    🐦 Oiseau : Kiwi - 1 ans - 0.3 kg - Envergure : 25 cm - Statut : Disponible

    === Statistiques du refuge Les Amis des Animaux ===
    Total d'animaux : 5
    Chiens : 2
    Chats : 2
    Oiseaux : 1
    Disponibles à l'adoption : 3
    ```
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-poo-exercice6" label="Exercice 6 - Héritage Véhicules">
    <Enonce>
    ## 🏍️ Exercice 6 : Concessionnaire Multi-Véhicules

    ### Contexte
    Le concessionnaire de l'exercice 4 s'agrandit ! Il ne vend plus seulement des voitures, mais aussi des motos et des quads.
    Vous devez refactoriser votre code pour utiliser l'héritage.

    ### 📋 Étapes à réaliser

    **Étape 1 : Créer la classe mère `Vehicule`**

    ```csharp
    public class Vehicule
    {
        // Propriétés communes : Marque, Modele, Annee, Prix, EstVendu

        // Constructeur

        // Méthode Vendre()

        // Méthode AppliquerRemise(double pourcentage)

        // Méthode virtuelle AfficherInfos()
    }
    ```

    **Étape 2 : Adapter la classe `Voiture`**

    ```csharp
    public class Voiture : Vehicule
    {
        // Propriété spécifique : Kilometrage

        // Constructeur (appelle base)

        // Redéfinition de AfficherInfos()
    }
    ```

    **Étape 3 : Créer la classe `Moto`**

    ```csharp
    public class Moto : Vehicule
    {
        // Propriété spécifique : Cylindree (int, en cc)

        // Constructeur

        // Redéfinition de AfficherInfos() (avec émoji 🏍️)
    }
    ```

    **Étape 4 : Créer la classe `Quad`**

    ```csharp
    public class Quad : Vehicule
    {
        // Propriété spécifique : EstHomologueRoute (bool)

        // Constructeur

        // Redéfinition de AfficherInfos()
    }
    ```

    **Étape 5 : Adapter le `Concessionnaire`**

    ```csharp
    public class Concessionnaire
    {
        // Liste de Vehicule au lieu de Liste de Voiture

        // Adapter les méthodes AjouterVehicule, AfficherVehiculesDisponibles, etc.

        // Dans AfficherStatistiques, compter Voitures, Motos, Quads
    }
    ```

    **Étape 6 : Tester**

    ```csharp
    public static void Main()
    {
        // Créer le concessionnaire

        // Créer des Voitures, Motos, Quads

        // Les ajouter au concessionnaire

        // Tester la vente, les remises et l'affichage
    }
    ```

    ### 🎯 Résultat attendu
    Le programme doit afficher la liste hétérogène de véhicules et les statistiques par type.
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>