---
title: "L'Héritage et le Polymorphisme en C#"
description: "Approfondissement sur l'héritage, les classes abstraites et le polymorphisme."
level: "2"
chapter: "BTS SIO 1 : B2 - Développement (SLAM)"
icon: "🧬"
---

# 🧬 L'Héritage en C#

## 1. Concept Fondamental

L'héritage est un mécanisme qui permet à une classe (appelée **classe dérivée** ou *fille*) de récupérer les propriétés et méthodes d'une autre classe (appelée **classe de base** ou *mère*).

Cela permet de respecter le principe **DRY** (Don't Repeat Yourself) en factorisant le code commun.

### Syntaxe

En C#, on utilise le symbole `:` pour indiquer l'héritage.

```csharp
// Classe Mère (Parent)
public class Vehicule
{
    public string Marque { get; set; }
    
    public void Demarrer()
    {
        Console.WriteLine("Le véhicule démarre.");
    }
}

// Classe Fille (Enfant)
public class Voiture : Vehicule
{
    public int NombrePortes { get; set; }
}
```

Ici, `Voiture` possède automatiquement `Marque` et `Demarrer()`, en plus de son propre attribut `NombrePortes`.

---

## 2. Le Mot-clé `base` et les Constructeurs

Les constructeurs ne sont **pas hérités**. Si la classe mère a un constructeur qui prend des arguments, la classe fille **doit** l'appeler explicitement via le mot-clé `base`.

```csharp
public class Personne
{
    public string Nom { get; set; }

    public Personne(string nom)
    {
        Nom = nom;
    }
}

public class Etudiant : Personne
{
    public string Classe { get; set; }

    // On appelle le constructeur du parent avec ": base(nom)"
    public Etudiant(string nom, string classe) : base(nom)
    {
        Classe = classe;
    }
}
```

Si vous oubliez `: base(...)`, le compilateur essaiera d'appeler le constructeur par défaut (`Personne()`), et s'il n'existe pas, cela provoquera une erreur.

---

## 3. Le Polymorphisme : `virtual` et `override`

C'est la capacité d'une méthode à se comporter différemment selon l'objet qui l'appelle, même si on manipule l'objet via son type parent.

Pour qu'une méthode puisse être modifiée par les enfants, elle doit être marquée **`virtual`**.
L'enfant utilise **`override`** pour la réécrire.

```csharp
public class Animal
{
    public virtual void Crier() // Autorise la modification
    {
        Console.WriteLine("L'animal fait un bruit.");
    }
}

public class Chat : Animal
{
    public override void Crier() // Remplace le comportement
    {
        Console.WriteLine("Miaou !");
    }
}

public class Chien : Animal
{
    public override void Crier()
    {
        Console.WriteLine("Wouf !");
    }
}
```

### Exemple d'utilisation

```csharp
List<Animal> mesAnimaux = new List<Animal>();
mesAnimaux.Add(new Chat());
mesAnimaux.Add(new Chien());

foreach (Animal a in mesAnimaux)
{
    a.Crier(); 
    // Affiche "Miaou !" puis "Wouf !"
    // C'est la magie du polymorphisme : la bonne méthode est appelée au runtime.
}
```

---

## 4. Classes Abstraites (`abstract`)

Une classe abstraite est une classe qu'on **ne peut pas instancier** (on ne peut pas faire `new Animal()`). Elle sert uniquement de modèle pour les classes filles.

Elle peut contenir des **méthodes abstraites** : des méthodes sans corps que les enfants **doivent obligatoirement** implémenter.

```csharp
public abstract class Forme
{
    public string Couleur { get; set; }
    
    // Méthode abstraite : pas de { }, juste un ;
    // Les enfants SONT OBLIGÉS de coder cette méthode
    public abstract double CalculerAire();
    
    // On peut aussi avoir des méthodes normales
    public void AfficherCouleur()
    {
        Console.WriteLine($"Je suis {Couleur}");
    }
}

public class Carre : Forme
{
    public double Cote { get; set; }
    
    public override double CalculerAire()
    {
        return Cote * Cote;
    }
}
```

---

## 5. Le mot-clé `sealed` (Scellé)

Si vous voulez empêcher l'héritage d'une classe, utilisez `sealed`.

```csharp
public sealed class CompteSecurise
{
    // ...
}

// public class Piratage : CompteSecurise -> ERREUR COMPILATION
```

On peut aussi sceller une méthode pour empêcher qu'elle soit `override` plus bas dans la descendance.

---