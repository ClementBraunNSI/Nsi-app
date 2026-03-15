# Correction Évaluation Machine — POO (C#)

## Gestion d'une Réserve Naturelle de Renards

Voici une proposition de correction complète pour le sujet.

---

### Partie 1 : La Classe Renard

```csharp
using System;

public class Renard
{
    // Propriétés
    public string Id { get; set; }
    public string Surnom { get; set; }
    public int Age { get; set; } // En mois
    public double Poids { get; set; } // En kg
    public int NiveauSociabilite { get; set; } // 1 à 10
    public bool EstMalade { get; set; }

    // Constructeur
    public Renard(string id, string surnom, int age, double poids, int niveauSociabilite)
    {
        Id = id;
        Surnom = surnom;
        Age = age;
        Poids = poids;
        NiveauSociabilite = niveauSociabilite;
        EstMalade = false; // Par défaut en bonne santé
    }

    // Méthode CalculerIndiceCompatibilite
    public int CalculerIndiceCompatibilite(Renard autreRenard)
    {
        int score = 50;

        // 1. Différence d'âge < 6 mois
        int diffAge = Math.Abs(this.Age - autreRenard.Age);
        if (diffAge < 6)
        {
            score += 20;
        }

        // 2. Différence de poids > 3 kg
        double diffPoids = Math.Abs(this.Poids - autreRenard.Poids);
        if (diffPoids > 3.0)
        {
            score -= 15;
        }

        // 3. Maladie
        if (this.EstMalade || autreRenard.EstMalade)
        {
            score -= 30;
        }

        // 4. Sociabilité (Moyenne * 2)
        double moyenneSociabilite = (this.NiveauSociabilite + autreRenard.NiveauSociabilite) / 2.0;
        score += (int)(moyenneSociabilite * 2);

        // Contrainte 0 - 100
        if (score < 0) score = 0;
        if (score > 100) score = 100;
        
        // Alternative moderne : score = Math.Clamp(score, 0, 100);

        return score;
    }
}
```

---

### Partie 2 : La Classe Enclos

```csharp
using System.Collections.Generic;

public class Enclos
{
    // Propriétés
    public string Nom { get; set; }
    public int CapaciteMax { get; set; }
    
    // Attribut privé pour la liste
    private List<Renard> _pensionnaires;

    // Constructeur
    public Enclos(string nom, int capaciteMax)
    {
        Nom = nom;
        CapaciteMax = capaciteMax;
        _pensionnaires = new List<Renard>();
    }

    // Méthode PeutAccueillir
    public bool PeutAccueillir()
    {
        // Retourne true si le nombre de renards est strictement inférieur au max
        return _pensionnaires.Count < CapaciteMax;
    }

    // Méthode AjouterRenard
    public bool AjouterRenard(Renard r)
    {
        if (PeutAccueillir())
        {
            _pensionnaires.Add(r);
            return true;
        }
        else
        {
            return false;
        }
    }

    // Méthode VerifierHarmonie
    public bool VerifierHarmonie()
    {
        // S'il y a moins de 2 renards, pas de conflit possible
        if (_pensionnaires.Count < 2)
        {
            return true;
        }

        // On récupère les deux premiers renards
        Renard r1 = _pensionnaires[0];
        Renard r2 = _pensionnaires[1];

        // On calcule leur compatibilité
        int compatibilite = r1.CalculerIndiceCompatibilite(r2);

        // Si < 40, conflit
        if (compatibilite < 40)
        {
            return false;
        }

        return true;
    }
}
```

---

### Partie 3 : La Classe ReserveNaturelle et Main

```csharp
using System;
using System.Collections.Generic;

public class ReserveNaturelle
{
    public string NomReserve { get; set; }
    private List<Enclos> _secteurs;

    public ReserveNaturelle(string nom)
    {
        NomReserve = nom;
        _secteurs = new List<Enclos>();
    }

    public void AjouterEnclos(Enclos e)
    {
        _secteurs.Add(e);
    }

    public bool PlacerNouveauRenard(Renard nouveauRenard)
    {
        // Algorithme de placement
        foreach (Enclos enclos in _secteurs)
        {
            // On cherche le premier enclos avec de la place
            if (enclos.PeutAccueillir())
            {
                enclos.AjouterRenard(nouveauRenard);
                Console.WriteLine($"Le renard {nouveauRenard.Surnom} a été placé dans l'enclos {enclos.Nom}");
                return true; // On arrête dès qu'on a trouvé
            }
        }

        // Si on arrive ici, c'est qu'aucun enclos n'a pu l'accueillir
        Console.WriteLine($"Urgence : Plus de place dans la réserve pour {nouveauRenard.Surnom} !");
        return false;
    }
}

// Simulation (Main)
public class Program
{
    public static void Main()
    {
        // 1. Création de la réserve
        ReserveNaturelle maReserve = new ReserveNaturelle("Le Terrier Sûr");

        // 2. Ajout des enclos
        Enclos enclosBois = new Enclos("Bois", 2);
        Enclos enclosColline = new Enclos("Colline", 5);
        
        maReserve.AjouterEnclos(enclosBois);
        maReserve.AjouterEnclos(enclosColline);

        // 3. Création des renards
        // Renard 1 : Standard
        Renard r1 = new Renard("R01", "Zorro", 12, 6.5, 8);
        
        // Renard 2 : Très différent (Vieux, Gros, malade -> Conflit assuré avec R1)
        Renard r2 = new Renard("R02", "Bernie", 60, 12.0, 2);
        r2.EstMalade = true;

        // Renard 3 : Jeune
        Renard r3 = new Renard("R03", "Filou", 14, 6.0, 9);

        // 4. Placement
        maReserve.PlacerNouveauRenard(r1); // Va dans "Bois" (reste 1 place)
        maReserve.PlacerNouveauRenard(r2); // Va dans "Bois" (reste 0 place)
        maReserve.PlacerNouveauRenard(r3); // "Bois" plein -> Va dans "Colline"

        // 5. Vérification Harmonie
        // Dans "Bois", il y a Zorro et Bernie.
        // Diff âge > 6 mois (+0)
        // Diff poids > 3kg (-15)
        // Bernie malade (-30)
        // Moyenne sociabilité (8+2)/2 = 5 -> *2 = +10
        // Score total : 50 - 15 - 30 + 10 = 15
        // 15 < 40 -> Harmonie = FALSE

        bool estHarmonieux = enclosBois.VerifierHarmonie();
        Console.WriteLine($"L'enclos Bois est-il harmonieux ? {estHarmonieux}");
    }
}
```
