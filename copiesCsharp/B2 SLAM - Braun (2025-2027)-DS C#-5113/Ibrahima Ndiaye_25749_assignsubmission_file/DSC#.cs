using System;
using System.Collections.Generic;

class Renard {
    public string Id {get;set;}
    public string  Surnom {get;set;}
    public int Age {get;set;}
    public double Poids {get;set;}
    public int NiveauSociabilite {get;set;}
    public bool EstMalade {get;set;}

    public Renard (string id, string surnom, int age, double poids, int niveauSociabilite, bool EstMalade = false)
    {
        Id = id;
        Surnom = surnom;
        Age = age;
        Poids = poids;
        NiveauSociabilite = niveauSociabilite;
    }

    public void CalculerIndiceCompatibilite(Renard autreRenard)
    {
        int score = 50;
        if((Renard.Age - autreRenard.Age) < 6){
            score = score + 20;
            return score;
        }

        if((Renard.Poids - autreRenard.Poids) > 3 ){
            score = score - 15;
            return score;
        }

        if( Renard.EstMalade  autreRenard.EstMalade){
            score = score - 30;
            return score;
        }

        return score =  score + ((Renard.NiveauSociabilite + autreRenard.NiveauSociabilite) / 2);
        
    }
}

class Enclos{
    public string Nom {get; set;}
    public int CapaciteMax {get; set;}
    private List<Renard> _pensionnaires {get; set;}

    public Enclos ( string nom, int capaciteMax)
    {
    Nom = nom;
    CapaciteMax = capaciteMax;
    _pensionnaires = new List<Renard>();
    }

    public void PeutAccueillir()
    {
         int compteur = 0;
        foreach(Renard e in _pensionnaires){
             compteur = compteur + 1;
            return compteur;
        }
        if( compteur > CapaciteMax){
            return true;
        }else{
            return false;
        }
    }

    public void Ajouter(Renard r){
        if(_pensionnaires.PeutAccueillir()){
            _pensionnaires.Add(r);
            return true;
        }else{
            return false;
        }
    }

    public void VerifierHarmonie(){
        int compteurv2 = 0;
        foreach(Renard e in _pensionnaires){
            compteurv2 = compteurv2 + 1;
            return compteurv2;
        }

        if( compteurv2 >= 2){
            return true;
        }
        
    }
}

class ReserveNaturelle{
    public string NomReserve {get; set;}
    public List<Enclos> _secteurs {get; set;}

    public ReserveNaturelle(string nomReserve)
    {
        NomReserve = nomReserve;
        _secteurs = new List<Enclos>();
    }

    public void AjouterEnclos(Enclos e){
        _secteurs.Add(e);
    }

    public void PlacerNouveauRenard(Renard nouveauRenard)
    {
        foreach(Enclos i in _secteurs)
        {
            if(Enclos.PeutAccueillir){
                AjouterEnclos(Enclos nouveauRenard);
                Console.WriteLine($"Le renard { nouveauRenard.Surnom} a été placé dans l'enclos {i}");
                return true;
            }else{
                Console.WriteLine($"Urgence : Plus de place dans la réserve pour {nouveauRenard}")
            }
        }
    }
}

class main{
    ReserveNaturelle LeTerrierSur = new ReserveNaturelle();

    Enclos e1 = new Enclos("Bois", 2);
    Enclos e2 = new Enclos("Colline, 5");

    
}










