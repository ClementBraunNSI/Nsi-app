# Correction & Barème — DS POO : Gestion de Datacenter et Virtualisation

## Barème Global (20 points)

*   **Respect des conventions (Encapsulation, Nommage, C# valide) : -0.5 pt par erreur récurrente.**

---

### Partie 1 : La Machine Virtuelle (5 points)
*   **Propriétés (2 pts) :** Types corrects (0.5) + Getters/Setters présents et pertinents (1) + Encapsulation (0.5).
*   **Constructeur (1.5 pts) :** Paramètres corrects (0.5) + Initialisation des propriétés (0.5) + `EstActive` à `false` par défaut (0.5).
*   **CalculerScorePerformance (1.5 pts) :**
    *   Signature (retourne `double`) (0.5).
    *   Calcul mathématique correct (1).

### Partie 2 : L'Hyperviseur (8 points)
*   **Propriétés & Attributs (1.5 pts) :** Nom et Max(Vcpu,Ram,Disque) (0.5) + Liste privée de VMs (1).
*   **Constructeur (1 pt) :** Initialisation variables (0.5) + Instanciation de la liste (très important) (0.5).
*   **CalculerRessourcesUtilisees (2 pts) :**
    *   Boucle sur la liste `_vms` (0.5).
    *   Condition `EstActive == true` (0.5).
    *   Accumulation des 3 ressources (0.5).
    *   Affichage propre formaté (0.5).
*   **PeutAccueillir (2 pts) :**
    *   Boucle pour calculer le total DÉJÀ PRÉSENT (actif ou non) (1).
    *   Vérification `(total + vm.nouvelle) <= Max` pour les 3 ressources (1).
*   **AjouterVM (1.5 pts) :** Appel à `PeutAccueillir` (0.5) + Ajout `.Add` (0.5) + Affichages (0.5).

### Partie 3 : Le Datacenter (7 points)
*   **Attributs (1 pt) :** Liste privée d'hyperviseurs.
*   **RechercherHoteIdeal (3.5 pts) :**
    *   Boucle sur le parc (0.5).
    *   Utilisation de `PeutAccueillir(vm)` (1).
    *   Logique de recherche du max : variable tampon `meilleurHote` et `maxRamLibre` (1).
    *   Calcul correct de la RAM libre (`MaxRam - RamUtilisee`) (0.5).
    *   Retour du bon hyperviseur ou null (0.5).
*   **AfficherStatistiquesGlobales (2.5 pts) :**
    *   Nombre total d'hyperviseurs (`_parc.Count`) (0.5).
    *   Nombre total de VMs (Double boucle ou `Count` accumulé) (1).
    *   Calcul du taux d'occupation CPU (Somme Vcpu utilisé / Somme MaxVcpu * 100) avec attention à la division entière (1).

---

## Code Source de Correction (C#)

```csharp
using System;
using System.Collections.Generic;

namespace DatacenterVirtualisation
{
    // --- PARTIE 1 ---
    public class MachineVirtuelle
    {
        public string Id { get; private set; } // Lecture seule après création
        public string Nom { get; set; }
        public int Vcpu { get; private set; }
        public int Ram { get; private set; }
        public int Disque { get; private set; }
        public bool EstActive { get; set; }

        public MachineVirtuelle(string id, string nom, int vcpu, int ram, int disque)
        {
            Id = id;
            Nom = nom;
            Vcpu = vcpu;
            Ram = ram;
            Disque = disque;
            EstActive = false; // Par défaut
        }

        public double CalculerScorePerformance()
        {
            return (Vcpu * 10) + (Ram * 5) + (Disque * 0.5);
        }
    }

    // --- PARTIE 2 ---
    public class Hyperviseur
    {
        public string Nom { get; set; }
        public int MaxVcpu { get; set; }
        public int MaxRam { get; set; }
        public int MaxDisque { get; set; }
        private List<MachineVirtuelle> _vms;

        public Hyperviseur(string nom, int maxVcpu, int maxRam, int maxDisque)
        {
            Nom = nom;
            MaxVcpu = maxVcpu;
            MaxRam = maxRam;
            MaxDisque = maxDisque;
            _vms = new List<MachineVirtuelle>();
        }

        // Accesseur public en lecture seule pour pouvoir compter les VMs depuis le Datacenter
        public List<MachineVirtuelle> GetVms() 
        {
            return _vms;
        }

        public void CalculerRessourcesUtilisees()
        {
            int totalVcpu = 0, totalRam = 0, totalDisque = 0;

            foreach (MachineVirtuelle vm in _vms)
            {
                if (vm.EstActive)
                {
                    totalVcpu += vm.Vcpu;
                    totalRam += vm.Ram;
                    totalDisque += vm.Disque;
                }
            }

            Console.WriteLine($"CPU: {totalVcpu}/{MaxVcpu}, RAM: {totalRam}/{MaxRam} Go, Disque: {totalDisque}/{MaxDisque} Go");
        }

        public bool PeutAccueillir(MachineVirtuelle nouvelleVm)
        {
            int totalVcpuAlloues = 0;
            int totalRamAllouee = 0;
            int totalDisqueAlloue = 0;

            // On additionne TOUTES les VMs, même éteintes
            foreach (MachineVirtuelle vm in _vms)
            {
                totalVcpuAlloues += vm.Vcpu;
                totalRamAllouee += vm.Ram;
                totalDisqueAlloue += vm.Disque;
            }

            // On vérifie si l'ajout de la nouvelle dépasse les limites
            if ((totalVcpuAlloues + nouvelleVm.Vcpu) <= MaxVcpu &&
                (totalRamAllouee + nouvelleVm.Ram) <= MaxRam &&
                (totalDisqueAlloue + nouvelleVm.Disque) <= MaxDisque)
            {
                return true;
            }

            return false;
        }

        // Helper method pour le datacenter (pour trouver l'hôte avec le plus de RAM libre)
        public int GetRamLibre()
        {
            int ramOccupee = 0;
            foreach (MachineVirtuelle vm in _vms)
            {
                ramOccupee += vm.Ram;
            }
            return MaxRam - ramOccupee;
        }

        public void AjouterVM(MachineVirtuelle vm)
        {
            if (PeutAccueillir(vm))
            {
                _vms.Add(vm);
                Console.WriteLine("VM ajoutée avec succès sur " + Nom);
            }
            else
            {
                Console.WriteLine("Erreur : Capacité insuffisante sur " + Nom);
            }
        }
    }

    // --- PARTIE 3 ---
    public class Datacenter
    {
        private List<Hyperviseur> _parc;

        public Datacenter()
        {
            _parc = new List<Hyperviseur>();
        }

        public void AjouterHyperviseur(Hyperviseur h)
        {
            _parc.Add(h);
        }

        public Hyperviseur RechercherHoteIdeal(MachineVirtuelle vm)
        {
            Hyperviseur meilleurHote = null;
            int maxRamLibre = -1;

            foreach (Hyperviseur hv in _parc)
            {
                if (hv.PeutAccueillir(vm))
                {
                    int ramLibre = hv.GetRamLibre();
                    
                    if (ramLibre > maxRamLibre)
                    {
                        maxRamLibre = ramLibre;
                        meilleurHote = hv;
                    }
                }
            }

            return meilleurHote;
        }

        public void AfficherStatistiquesGlobales()
        {
            int totalVms = 0;
            double vcpuUtiliseGlobal = 0;
            double vcpuMaxGlobal = 0;

            foreach (Hyperviseur hv in _parc)
            {
                totalVms += hv.GetVms().Count;
                vcpuMaxGlobal += hv.MaxVcpu;
                
                foreach (MachineVirtuelle vm in hv.GetVms())
                {
                    if (vm.EstActive) // Ou toutes, selon l'interprétation. Disons actives.
                    {
                        vcpuUtiliseGlobal += vm.Vcpu;
                    }
                }
            }

            Console.WriteLine($"--- Statistiques Globales ---");
            Console.WriteLine($"Total Hyperviseurs : {_parc.Count}");
            Console.WriteLine($"Total VMs hébergées : {totalVms}");
            
            if (vcpuMaxGlobal > 0)
            {
                double tauxCpu = (vcpuUtiliseGlobal / vcpuMaxGlobal) * 100;
                Console.WriteLine($"Taux d'occupation CPU global : {Math.Round(tauxCpu, 2)}%");
            }
        }
    }

    // --- MAIN DE TEST ---
    class Program
    {
        public static void Main(string[] args)
        {
            Datacenter monCloud = new Datacenter();

            Hyperviseur hv1 = new Hyperviseur("HV-01", 32, 128, 2000);
            Hyperviseur hv2 = new Hyperviseur("HV-02", 64, 256, 4000);
            
            monCloud.AjouterHyperviseur(hv1);
            monCloud.AjouterHyperviseur(hv2);

            MachineVirtuelle webVm = new MachineVirtuelle("VM-WEB", "Apache", 4, 8, 100);
            
            Hyperviseur hote = monCloud.RechercherHoteIdeal(webVm);
            
            if (hote != null)
            {
                hote.AjouterVM(webVm);
                webVm.EstActive = true;
            }

            monCloud.AfficherStatistiquesGlobales();
        }
    }
}
```