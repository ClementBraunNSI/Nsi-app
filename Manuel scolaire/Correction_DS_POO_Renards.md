# Correction & Barème — DS POO : Gestion d'une Réserve Naturelle de Renards

## Barème Global (20 points)

*   **Respect des conventions (Encapsulation, Nommage, C# valide) : -0.5 pt par erreur récurrente.**

---

### Partie 1 : Le Renard (6 points)
*   **Propriétés (2 pts) :** Types corrects (0.5) + Getters/Setters présents (1) + Encapsulation respectée (0.5).
*   **Constructeur (1.5 pts) :** Paramètres corrects (0.5) + Initialisation des propriétés (0.5) + `EstMalade` à `false` par défaut (0.5).
*   **CalculerIndiceCompatibilite (2.5 pts) :**
    *   Signature correcte (0.5).
    *   Score de base à 50 (0.25).
    *   Condition âge (`Math.Abs` ou `if`) et +20 pts (0.5).
    *   Condition poids et -15 pts (0.5).
    *   Condition maladie (`||`) et -30 pts (0.25).
    *   Calcul moyenne sociabilité et ajout (0.25).
    *   Limitation entre 0 et 100 (`Math.Clamp` ou `if/else`) (0.25).

### Partie 2 : L'Enclos (6 points)
*   **Propriétés (1.5 pts) :** Nom et Capacité (0.5) + Liste privée de renards (1).
*   **Constructeur (1 pt) :** Initialisation variables (0.5) + Instanciation de la liste (très important) (0.5).
*   **PeutAccueillir (1 pt) :** Comparaison `.Count` avec `CapaciteMax` (1).
*   **AjouterRenard (1 pt) :** Appel à `PeutAccueillir` (0.5) + Ajout `.Add` et retours de booléens (0.5).
*   **VerifierHarmonie (1.5 pts) :**
    *   Vérification `.Count < 2` (0.5).
    *   Appel de la méthode `CalculerIndiceCompatibilite` sur les indices `[0]` et `[1]` (0.5).
    *   Condition `< 40` et retours (0.5).

### Partie 3 : La Réserve (8 points)
*   **Attributs & Constructeur (1.5 pts) :** Liste d'enclos (0.5) + Initialisation (1).
*   **AjouterEnclos (0.5 pt) :** Méthode `.Add()` (0.5).
*   **PlacerNouveauRenard (3.5 pts) :**
    *   Boucle `foreach` ou `for` sur les enclos (1).
    *   Condition `PeutAccueillir` (1).
    *   Appel `AjouterRenard` (0.5).
    *   Affichage et retour `true` / `break` (0.5).
    *   Message d'urgence et retour `false` si boucle terminée (0.5).
*   **Main / Simulation (2.5 pts) :**
    *   Création Réserve et 2 Enclos (0.5).
    *   Création 3 Renards avec caractéristiques demandées (1).
    *   Appel `PlacerNouveauRenard` (0.5).
    *   Appel `VerifierHarmonie` et affichage (0.5).

---

## Code Source de Correction (C#)

```csharp
using System;
using System.Collections.Generic;

namespace ReserveRenards
{
    // --- PARTIE 1 ---
    public class Renard
    {
        public string Id { get; set; }
        public string Surnom { get; set; }
        public int Age { get; set; }
        public double Poids { get; set; }
        public int NiveauSociabilite { get; set; }
        public bool EstMalade { get; set; }

        public Renard(string id, string surnom, int age, double poids, int niveauSociabilite)
        {
            Id = id;
            Surnom = surnom;
            Age = age;
            Poids = poids;
            NiveauSociabilite = niveauSociabilite;
            EstMalade = false; // Par défaut
        }

        public int CalculerIndiceCompatibilite(Renard autreRenard)
        {
            int score = 50;

            if (Math.Abs(this.Age - autreRenard.Age) < 6)
            {
                score += 20;
            }

            if (Math.Abs(this.Poids - autreRenard.Poids) > 3.0)
            {
                score -= 15;
            }

            if (this.EstMalade || autreRenard.EstMalade)
            {
                score -= 30;
            }

            int moyenneSociabilite = (this.NiveauSociabilite + autreRenard.NiveauSociabilite) / 2;
            score += (moyenneSociabilite * 2);

            // Limitation entre 0 et 100
            return Math.Clamp(score, 0, 100);
            
            /* Alternative sans Math.Clamp :
            if (score < 0) return 0;
            if (score > 100) return 100;
            return score;
            */
        }
    }

    // --- PARTIE 2 ---
    public class Enclos
    {
        public string Nom { get; set; }
        public int CapaciteMax { get; set; }
        private List<Renard> _pensionnaires;

        public Enclos(string nom, int capaciteMax)
        {
            Nom = nom;
            CapaciteMax = capaciteMax;
            _pensionnaires = new List<Renard>();
        }

        public bool PeutAccueillir()
        {
            return _pensionnaires.Count < CapaciteMax;
        }

        public bool AjouterRenard(Renard r)
        {
            if (PeutAccueillir())
            {
                _pensionnaires.Add(r);
                return true;
            }
            return false;
        }

        public bool VerifierHarmonie()
        {
            if (_pensionnaires.Count < 2)
            {
                return true;
            }

            Renard r1 = _pensionnaires[0];
            Renard r2 = _pensionnaires[1];

            if (r1.CalculerIndiceCompatibilite(r2) < 40)
            {
                return false;
            }

            return true;
        }
    }

    // --- PARTIE 3 ---
    public class ReserveNaturelle
    {
        public string NomReserve { get; set; }
        private List<Enclos> _secteurs;

        public ReserveNaturelle(string nomReserve)
        {
            NomReserve = nomReserve;
            _secteurs = new List<Enclos>();
        }

        public void AjouterEnclos(Enclos e)
        {
            _secteurs.Add(e);
        }

        public bool PlacerNouveauRenard(Renard nouveauRenard)
        {
            foreach (Enclos enclos in _secteurs)
            {
                if (enclos.PeutAccueillir())
                {
                    enclos.AjouterRenard(nouveauRenard);
                    Console.WriteLine($"Le renard {nouveauRenard.Surnom} a été placé dans l'enclos {enclos.Nom}.");
                    return true;
                }
            }

            Console.WriteLine($"Urgence : Plus de place dans la réserve pour {nouveauRenard.Surnom} !");
            return false;
        }
    }

    // --- SIMULATION ---
    class Program
    {
        static void Main(string[] args)
        {
            ReserveNaturelle leTerrierSur = new ReserveNaturelle("Le Terrier Sûr");

            Enclos bois = new Enclos("Bois", 2);
            Enclos colline = new Enclos("Colline", 5);

            leTerrierSur.AjouterEnclos(bois);
            leTerrierSur.AjouterEnclos(colline);

            // Renard 1 et 2 très différents pour rater l'harmonie
            Renard rox = new Renard("REN-01", "Rox", 12, 5.5, 8);
            Renard bandit = new Renard("REN-02", "Bandit", 36, 10.0, 2);
            bandit.EstMalade = true; // Chute de compatibilité massive
            
            Renard foxy = new Renard("REN-03", "Foxy", 10, 5.0, 9);

            leTerrierSur.PlacerNouveauRenard(rox);
            leTerrierSur.PlacerNouveauRenard(bandit);
            leTerrierSur.PlacerNouveauRenard(foxy); // Ira dans "Colline" car "Bois" est plein (capacité 2)

            bool harmonieBois = bois.VerifierHarmonie();
            Console.WriteLine($"L'enclos Bois est-il harmonieux ? {harmonieBois}");
        }
    }
}
```