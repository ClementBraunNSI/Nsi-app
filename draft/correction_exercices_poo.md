---
title: "Correction TP : Les Bases de la POO en C#"
description: "Solutions complètes pour le TP POO - Bases"
level: "2"
chapter: "BTS SIO 1 : B2 - Développement (SLAM)"
icon: "✅"
---

# ✅ Correction du TP POO

Voici une proposition de correction pour les exercices du TP. N'oubliez pas qu'il peut y avoir plusieurs façons de coder la même solution !

---

## 🏦 Exercice 1 : Compte Bancaire

```csharp
using System;

public class CompteBancaire
{
    // Propriétés
    public string Titulaire { get; set; }
    public double Solde { get; private set; } // Modification privée uniquement

    // Constructeur
    public CompteBancaire(string titulaire, double soldeInitial = 0)
    {
        Titulaire = titulaire;
        Solde = soldeInitial;
    }

    // Méthodes
    public void Deposer(double montant)
    {
        if (montant > 0)
        {
            Solde += montant;
            Console.WriteLine($"Dépôt de {montant}€ effectué.");
        }
        else
        {
            Console.WriteLine("Le montant du dépôt doit être positif.");
        }
    }

    public void Retirer(double montant)
    {
        if (montant <= 0)
        {
            Console.WriteLine("Le montant du retrait doit être positif.");
            return;
        }

        if (Solde >= montant)
        {
            Solde -= montant;
            Console.WriteLine($"Retrait de {montant}€ effectué.");
        }
        else
        {
            Console.WriteLine($"Solde insuffisant pour retirer {montant}€.");
        }
    }

    public void AfficherInfos()
    {
        Console.WriteLine($"Compte de {Titulaire} : {Solde}€");
    }
}

// Classe de Test (Main)
public class Program
{
    public static void Main()
    {
        CompteBancaire compte1 = new CompteBancaire("Alice Dupont", 100);
        
        compte1.AfficherInfos();
        
        compte1.Deposer(50);
        compte1.AfficherInfos();
        
        compte1.Retirer(30);
        compte1.AfficherInfos();
        
        compte1.Retirer(200); // Test solde insuffisant
        compte1.AfficherInfos();
    }
}
```

---

## 📚 Exercice 2 : Gestion de Livres

```csharp
using System;

public class Livre
{
    // Propriétés
    public string Titre { get; set; }
    public string Auteur { get; set; }
    public int AnneePublication { get; set; }
    public bool EstEmprunte { get; private set; }

    // Constructeur
    public Livre(string titre, string auteur, int annee)
    {
        Titre = titre;
        Auteur = auteur;
        AnneePublication = annee;
        EstEmprunte = false; // Par défaut
    }

    // Méthodes
    public void Emprunter()
    {
        if (EstEmprunte)
        {
            Console.WriteLine($"Le livre \"{Titre}\" est déjà emprunté.");
        }
        else
        {
            EstEmprunte = true;
            Console.WriteLine($"Le livre \"{Titre}\" a été emprunté.");
        }
    }

    public void Retourner()
    {
        if (EstEmprunte)
        {
            EstEmprunte = false;
            Console.WriteLine($"Le livre \"{Titre}\" a été retourné.");
        }
        else
        {
            Console.WriteLine($"Le livre \"{Titre}\" était déjà disponible.");
        }
    }

    public void AfficherInfos()
    {
        string statut = EstEmprunte ? "Emprunté" : "Disponible";
        Console.WriteLine($"{Titre} par {Auteur} ({AnneePublication}) - Statut : {statut}");
    }

    public int CalculerAge()
    {
        // On suppose l'année actuelle est 2025
        return 2025 - AnneePublication;
    }
}
```

---

## 🎓 Exercice 3 : Gestion d'Étudiants

```csharp
using System;
using System.Collections.Generic;

public class Etudiant
{
    public string Nom { get; set; }
    public string Prenom { get; set; }
    public int NumeroEtudiant { get; } // Lecture seule
    
    // Liste privée pour stocker les notes
    private List<double> notes;

    public Etudiant(string nom, string prenom, int numeroEtudiant)
    {
        Nom = nom;
        Prenom = prenom;
        NumeroEtudiant = numeroEtudiant;
        notes = new List<double>();
    }

    public void AjouterNote(double note)
    {
        if (note >= 0 && note <= 20)
        {
            notes.Add(note);
        }
        else
        {
            Console.WriteLine("Note invalide. La note doit être entre 0 et 20.");
        }
    }

    public double CalculerMoyenne()
    {
        if (notes.Count == 0) return 0;

        double somme = 0;
        foreach (double note in notes)
        {
            somme += note;
        }
        return somme / notes.Count;
    }

    public string ObtenirMention()
    {
        double moyenne = CalculerMoyenne();
        
        if (moyenne >= 16) return "Très bien";
        if (moyenne >= 14) return "Bien";
        if (moyenne >= 12) return "Assez bien";
        if (moyenne >= 10) return "Passable";
        return "Insuffisant";
    }

    public int NombreDeNotes()
    {
        return notes.Count;
    }

    public void AfficherInfos()
    {
        Console.WriteLine($"Étudiant N°{NumeroEtudiant} : {Prenom} {Nom}");
        Console.WriteLine($"Nombre de notes : {NombreDeNotes()}");
        
        if (NombreDeNotes() > 0)
        {
            Console.WriteLine($"Moyenne : {CalculerMoyenne():F2}/20 - Mention : {ObtenirMention()}");
        }
        else
        {
            Console.WriteLine("Aucune note pour le moment.");
        }
    }
}
```

---

## 🚗 Exercice 4 : Concessionnaire Automobile

### Classe Voiture

```csharp
public class Voiture
{
    public string Marque { get; set; }
    public string Modele { get; set; }
    public int Annee { get; set; }
    public double Prix { get; set; }
    public int Kilometrage { get; set; }
    public bool EstVendue { get; private set; }

    public Voiture(string marque, string modele, int annee, double prix, int km)
    {
        Marque = marque;
        Modele = modele;
        Annee = annee;
        Prix = prix;
        Kilometrage = km;
        EstVendue = false;
    }

    public void Vendre()
    {
        if (!EstVendue)
        {
            EstVendue = true;
            Console.WriteLine($"La voiture {Marque} {Modele} a été vendue.");
        }
        else
        {
            Console.WriteLine("Cette voiture est déjà vendue.");
        }
    }

    public void AppliquerRemise(double pourcentage)
    {
        if (pourcentage > 0 && pourcentage <= 100)
        {
            double reduction = Prix * (pourcentage / 100);
            Prix -= reduction;
            Console.WriteLine($"Remise de {pourcentage}% appliquée. Nouveau prix : {Prix}€");
        }
    }

    public void AfficherInfos()
    {
        string statut = EstVendue ? "Vendue" : "Disponible";
        Console.WriteLine($"{Marque} {Modele} ({Annee}) - {Prix}€ - {Kilometrage} km - Statut : {statut}");
    }
}
```

### Classe Concessionnaire

```csharp
using System.Collections.Generic;
using System.Linq; // Utile pour les recherches simplifiées

public class Concessionnaire
{
    public string Nom { get; set; }
    public string Ville { get; set; }
    private List<Voiture> voitures;

    public Concessionnaire(string nom, string ville)
    {
        Nom = nom;
        Ville = ville;
        voitures = new List<Voiture>();
    }

    public void AjouterVoiture(Voiture v)
    {
        voitures.Add(v);
        Console.WriteLine($"Voiture ajoutée : {v.Marque} {v.Modele}");
    }

    public void AfficherVoituresDisponibles()
    {
        foreach (var v in voitures)
        {
            if (!v.EstVendue)
            {
                v.AfficherInfos();
            }
        }
    }

    public int NombreVoituresDisponibles()
    {
        int compteur = 0;
        foreach (var v in voitures)
        {
            if (!v.EstVendue) compteur++;
        }
        return compteur;
    }

    public Voiture VoitureLaMoinsChere()
    {
        Voiture moinsChere = null;
        double prixMin = double.MaxValue;

        foreach (var v in voitures)
        {
            if (!v.EstVendue && v.Prix < prixMin)
            {
                prixMin = v.Prix;
                moinsChere = v;
            }
        }
        return moinsChere;
    }

    public double ValeurStockTotal()
    {
        double total = 0;
        foreach (var v in voitures)
        {
            if (!v.EstVendue) total += v.Prix;
        }
        return total;
    }

    public void AfficherStatistiques()
    {
        Console.WriteLine($"=== Concessionnaire {Nom} ({Ville}) ===");
        Console.WriteLine($"Nombre total de voitures : {voitures.Count}");
        Console.WriteLine($"Voitures disponibles : {NombreVoituresDisponibles()}");
        Console.WriteLine($"Valeur totale du stock : {ValeurStockTotal()}€");
    }
}
```

---

## 📂 Exercice 5 : Import CSV

```csharp
using System;
using System.Collections.Generic;
using System.IO;

public class Produit
{
    public string Reference { get; set; }
    public string Nom { get; set; }
    public double Prix { get; set; }
    public int Quantite { get; set; }

    public Produit(string reference, string nom, double prix, int quantite)
    {
        Reference = reference;
        Nom = nom;
        Prix = prix;
        Quantite = quantite;
    }

    public void Afficher()
    {
        Console.WriteLine($"[{Reference}] {Nom} : {Prix}€ (Quantité: {Quantite})");
    }
}

public class Magasin
{
    public List<Produit> Stock { get; set; }

    public Magasin()
    {
        Stock = new List<Produit>();
    }

    public void ImporterProduits(string cheminFichier)
    {
        Console.WriteLine($"Tentative d'importation du fichier {cheminFichier}...");

        try
        {
            if (!File.Exists(cheminFichier))
            {
                Console.WriteLine("Erreur : Le fichier n'existe pas.");
                return;
            }

            string[] lignes = File.ReadAllLines(cheminFichier);

            foreach (string ligne in lignes)
            {
                // On saute les lignes vides si nécessaire
                if (string.IsNullOrWhiteSpace(ligne)) continue;

                string[] colonnes = ligne.Split(';');

                // Vérification basique du format (4 colonnes attendues)
                if (colonnes.Length >= 4)
                {
                    string reference = colonnes[0];
                    string nom = colonnes[1];
                    // Utilisation de TryParse pour éviter les crashs si le format numérique est mauvais
                    double.TryParse(colonnes[2], out double prix);
                    int.TryParse(colonnes[3], out int qte);

                    Produit p = new Produit(reference, nom, prix, qte);
                    Stock.Add(p);
                }
            }
            Console.WriteLine($"Importation réussie ! {Stock.Count} produits ajoutés.");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Une erreur est survenue : {ex.Message}");
        }
    }
}
```

---

## 🐾 Exercice 6 : Animaux et Héritage

### Classe Mère Animal

```csharp
public class Animal
{
    public string Nom { get; set; }
    public int Age { get; set; }
    public double Poids { get; set; }
    public bool EstAdopte { get; private set; }

    public Animal(string nom, int age, double poids)
    {
        Nom = nom;
        Age = age;
        Poids = poids;
        EstAdopte = false;
    }

    public void Adopter()
    {
        if (!EstAdopte)
        {
            EstAdopte = true;
            Console.WriteLine($"{Nom} a été adopté(e) !");
        }
    }

    public void Vieillir()
    {
        Age++;
        Console.WriteLine($"{Nom} a maintenant {Age} ans.");
    }

    // Méthode virtuelle pour être redéfinie
    public virtual void AfficherInfos()
    {
        string statut = EstAdopte ? "Adopté" : "Disponible";
        Console.WriteLine($"Animal : {Nom} - {Age} ans - {Poids} kg - Statut : {statut}");
    }
}
```

### Classes Filles (Chien, Chat, Oiseau)

```csharp
public class Chien : Animal
{
    public string Race { get; set; }

    public Chien(string nom, int age, double poids, string race) 
        : base(nom, age, poids) // Appel au constructeur parent
    {
        Race = race;
    }

    public void Aboyer()
    {
        Console.WriteLine($"{Nom} aboie : Wouf wouf !");
    }

    public override void AfficherInfos()
    {
        string statut = EstAdopte ? "Adopté" : "Disponible";
        Console.WriteLine($"🐕 Chien : {Nom} ({Race}) - {Age} ans - {Poids} kg - Statut : {statut}");
    }
}

public class Chat : Animal
{
    public string Couleur { get; set; }

    public Chat(string nom, int age, double poids, string couleur) 
        : base(nom, age, poids)
    {
        Couleur = couleur;
    }

    public void Miauler()
    {
        Console.WriteLine($"{Nom} miaule : Miaou !");
    }

    public override void AfficherInfos()
    {
        string statut = EstAdopte ? "Adopté" : "Disponible";
        Console.WriteLine($"🐱 Chat : {Nom} ({Couleur}) - {Age} ans - {Poids} kg - Statut : {statut}");
    }
}

public class Oiseau : Animal
{
    public double EnvergureAiles { get; set; }

    public Oiseau(string nom, int age, double poids, double envergure) 
        : base(nom, age, poids)
    {
        EnvergureAiles = envergure;
    }

    public void Chanter()
    {
        Console.WriteLine($"{Nom} chante : Cui cui !");
    }

    public override void AfficherInfos()
    {
        string statut = EstAdopte ? "Adopté" : "Disponible";
        Console.WriteLine($"🐦 Oiseau : {Nom} - {Age} ans - {Poids} kg - Envergure : {EnvergureAiles} cm - Statut : {statut}");
    }
}
```

### Classe Refuge

```csharp
using System.Collections.Generic;

public class Refuge
{
    public string Nom { get; set; }
    public List<Animal> Animaux { get; set; }

    public Refuge(string nom)
    {
        Nom = nom;
        Animaux = new List<Animal>();
    }

    public void AjouterAnimal(Animal animal)
    {
        Animaux.Add(animal);
        Console.WriteLine($"{animal.Nom} a été ajouté au refuge.");
    }

    public void AfficherTousLesAnimaux()
    {
        Console.WriteLine($"\n=== Animaux du refuge {Nom} ===");
        foreach (var animal in Animaux)
        {
            animal.AfficherInfos(); // Polymorphisme !
        }
    }

    public void AfficherAnimauxDisponibles()
    {
        Console.WriteLine("\n=== Animaux disponibles à l'adoption ===");
        foreach (var animal in Animaux)
        {
            if (!animal.EstAdopte)
            {
                animal.AfficherInfos();
            }
        }
    }

    public void AfficherStatistiques()
    {
        int chiens = 0, chats = 0, oiseaux = 0, dispo = 0;

        foreach (var animal in Animaux)
        {
            if (animal is Chien) chiens++;
            if (animal is Chat) chats++;
            if (animal is Oiseau) oiseaux++;
            if (!animal.EstAdopte) dispo++;
        }

        Console.WriteLine($"\n=== Statistiques du refuge {Nom} ===");
        Console.WriteLine($"Total d'animaux : {Animaux.Count}");
        Console.WriteLine($"Chiens : {chiens}");
        Console.WriteLine($"Chats : {chats}");
        Console.WriteLine($"Oiseaux : {oiseaux}");
        Console.WriteLine($"Disponibles à l'adoption : {dispo}");
    }
}
```
