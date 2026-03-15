using System;
using System.Collections.Generic;

  // Partie 1
	public class Renard {
		
		  public void Contruscteur(Id:string,Surnom:string,Age:int,Poids:double,NiveauSociabilite:int) :
		  //Init
        Id = id;
        Surnom = surnom;
        Age = age;
        Poids = poids;
        NiveauSociabilite = niveausociabilite;
        EstMalade = false;
    
      public void CalculerIndiceComptatibilite(Renard, autreRenard ,point:int):
      Point = point; 
      // si les renards on 6 mois d'écard ( la moitier d'1 ans donc 1/0.50 ) alors on ajoute 20 pnt 
      if (Renard[age] != autreRenard[age] == age/0.50) {
        point + 20;
      } 
      // si les renards on un poids superieur a 3 on leur retire 15 pnt
      if (Renard[poids] != autreRenard[poids] > 3) {
        point - 15;
      }
      // si les renards sont malades - 30 pnt 
      if (Renard[EstMalade = true ] != autreRenard[EstMalade = true ]) {
        point - 30;
      }
    
      return Console.WriteLine(point + niveausociabilite *2); 
  }
  
  // Partie 2
  	public class Enclos {
		  _pensionnaies (list<Renard>, private);
		
		  public void Contruscteur(Nom:string,CapaciteMax:int,) :
		  //Init
		    Nom = nom;
		    CapaciteMax = capacitemax;
		    _pensionnaies = newList(_pensionnaies);
		  
		  public void PeutAcceuillir():
		  // si le nombre de renard et inferieur a la capacitemax max return true sinon false
		    if (Renard.count < capacitemax) {
		      return true;
		    else
		      return false;
		    }
		  
		
		  public void AjouterRenard(Renard r);
		  // si PeutAcceuillir = true alors on ajoute un renard sinon on return false
		    if (PeutAcceuillir = true )
		      add.list<Renard>;
		    else
		      return false;
		    
		    
		  public void VerifierHarmonie():
        return bool;
      
        //si moin de 2 renard return true sinon comparer les 2 1er. 
        if (Renard.count < 2)
          return true
        // else 
    
    // Partie 3
  	public class ReserveNaturelle {
		  _secteurs (list<Enclos>, private);
		
		  public void Contruscteur(Nom:string,CapaciteMax:int,) :
		    //Init
		    NomReserve = nomreserve;
		    _secteurs = newList(_secteurs);
		
    
      public void AjouterEnclos(Enclos e):
      //ajout de la liste enclos a secteurs
        _secteurs.add(list[Enclos])
  
      public void PlacerNouveauRenard(Renard nouveauRenard):
        // parcourir tout les Enclos
        // trouver le 1er qui PeutAcceuillir() le Renard
        AjouterRenard(Enclos); // on ajoute le renard a lenclos 
        Console.WriteLine("Le renard "{surnom}"a était placé dans l'Enclos "{nom});
        return true;
  
      // si pas de place afficher message et return false
  
  
  public class Program {
    public void Main {
      add.ReserveNaturelle("Le terrier Sûr");
      add.Enclos("Bois",capacitemax=2);
      add.Enclos("Colline", capacitemax=5);
      add.Renard("");
      add.Renard("");
      add.Renard("");
      ReserveNaturelle.PlacerNouveauRenard("","","");
      VerifierHarmonie(Enclos("Bois"));
      
    }
  }