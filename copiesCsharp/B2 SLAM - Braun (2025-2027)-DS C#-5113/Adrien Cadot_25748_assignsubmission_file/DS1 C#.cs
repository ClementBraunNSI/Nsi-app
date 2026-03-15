using System;
using System.Collections.Generic;

namespace MyCompiler {
    class Renard {
        string Id;
        string Surnom;
        int Age;
        double Poids;
        int NiveauSociabilite;
        bool EstMalade;

        public Renard(string id, string surnom, int age, double poids, int niveausociabilite){
            Id = id;
            Surnom = surnom;
            Age = age;
            poids = poids;
            NiveauSociabilite = niveausociabilite;
            EstMalade = false;
        }

        public int CalculerIndiceCompatibilite(Renard renard, Renard autreRenard){
            int score=50;
            if (renard.Age - autreRenard.Age < 6){
                score = score + 20;
            }
            if (renard.Poids - autreRenard.Poids > 3  &! autreRenard.Poids - renard.Poids > 3){
                score = score - 15;
            }
            if (renard.EstMalade == true &! autreRenard.EstMalade == true &! renard.EstMalade == true && autreRenard.EstMalade == true){
                score = score - 30;
            }
            score = score + (renard.NiveauSociabilite + autreRenard.NiveauSociabilite / 2) * 2;
            return(score);
        }
        public static void Main{
            kumi = Renard("REN-001", "Kumi", 8, 5.2, 10);
            Console.Writeline(kumi);
        }

    class Enclos{
        string Nom;
        int CapaciteMax;
        list<Renard> _pensionnaires (private: get, private: set);

        public Enclos (string nom, int capacitemax, list<Renard> liste){
            Nom = nom;
            CapaciteMax = capacitemax;
            _pensionnaires = liste;
        }

        public bool PeutAccueillir(){
            int cpt = 0;
            foreach(i in _pensionnaires){
                cpt = cpt + 1;
            }
            if (cpt < capacitemax){
                return true;
            }
            return false;
        }
        
    }
    class ReserverNaturelle{
        string NomReserve;
        list<Enclos> _secteurs (private: get, private: set);

        public ReserverNaturelle(string nom, list<Enclos> enclos){
            NomReserve = nom;
            _pensionnaires = enclos;
        }
    }
}