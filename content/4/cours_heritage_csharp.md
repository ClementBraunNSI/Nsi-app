---
title: L'Héritage et le Polymorphisme en C#
description: 'Approfondissement sur l''héritage, les classes abstraites et le polymorphisme.'
level: '2'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
icon: "\U0001F9EC"
prerequisites:
  - introduction_poo
audience: public
---

# L'héritage en C#

Une classe `Voiture` et une classe `Moto` répéteraient les mêmes champs — une marque, une méthode pour démarrer — si chacune était écrite à part. L'**héritage** évite cette copie. La **classe dérivée**, la fille, reçoit les propriétés et les méthodes de la **classe de base**, la mère, et n'ajoute que ce qui lui est propre. C'est le principe **DRY** : *Don't Repeat Yourself*, on n'écrit pas deux fois le même comportement.

En C#, le symbole `:` place la fille à droite de la mère.

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

`Voiture` a déjà `Marque` et `Demarrer()`, plus son propre `NombrePortes`. On ne les a pas réécrits. On les a reçus.

## Le constructeur ne s'hérite pas

Les constructeurs ne passent pas de la mère à la fille. Si la mère exige un argument, la fille doit appeler ce constructeur elle-même, avec `base`.

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

`: base(nom)` s'exécute avant le corps du constructeur de `Etudiant`. Le nom est rangé par la mère. La classe est rangée par la fille. Si vous omettez `: base(...)`, le compilateur cherche un constructeur `Personne()` sans argument. Ici, il n'existe pas. La compilation échoue. Ce n'est pas un oubli anodin : la fille n'a pas le droit de naître sans que la mère ait initialisé ce qu'elle possède.

## Une méthode, plusieurs comportements

Le **polymorphisme** permet d'appeler la même méthode sur une liste d'objets, et d'obtenir le comportement de chacun, même quand la variable est du type de la mère. En C#, une méthode n'est pas remplaçable par défaut. La mère la marque `virtual` pour autoriser la réécriture. La fille la marque `override` pour la remplacer.

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

On range alors un chat et un chien dans une liste d'`Animal`. La variable de boucle est un `Animal`. L'appel `Crier()` choisit pourtant la méthode de l'objet réel, au moment de l'exécution.

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

Sans `virtual` et `override`, la boucle appellerait `Animal.Crier` pour les deux, et l'on n'entendrait que « L'animal fait un bruit. ». Le type de la variable dirait le comportement. Avec `override`, c'est le type de l'objet qui le dit.

## Une classe qu'on ne construit pas

Une classe **abstraite** sert de modèle. On ne peut pas écrire `new Forme()` : une forme sans précision n'existe pas dans le programme. Elle peut porter des champs et des méthodes ordinaires, et aussi des **méthodes abstraites**, déclarées sans corps. Chaque fille concrète doit les écrire.

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

`AfficherCouleur` est héritée telle quelle. `CalculerAire` n'a pas de version dans `Forme` : un carré et un disque ne calculent pas la même chose, et la mère refuse d'inventer une formule. Oublier `override` dans `Carre`, et le compilateur refuse la classe. C'est le contrat. Une classe abstraite peut aussi contenir du code partagé. Une interface, vue dans le cours suivant, ne contient que des signatures.

## Fermer la descendance

`sealed` interdit d'hériter d'une classe. On s'en sert quand le type ne doit plus être étendu, par exemple un compte dont le comportement de sécurité ne doit pas être redéfini par une classe surprise.

```csharp
public sealed class CompteSecurise
{
    // ...
}

// public class Piratage : CompteSecurise -> ERREUR COMPILATION
```

On peut aussi sceller une méthode déjà redéfinie, pour que les petites-filles ne puissent plus la remplacer. La chaîne s'arrête là où vous posez `sealed`.
