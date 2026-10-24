---
title: Introduction à la POO en C#
description: 'Les bases de la Programmation Orientée Objet : concepts, classes et objets.'
level: '2'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
icon: "\U0001F3AF"
prerequisites:
  - csharp_csv_bdd
audience: public
---

# Introduction à la POO en C#

Jusqu'ici, un programme est une suite de fonctions qui se passent des variables. Cela tient pour un calcul. Cela se défait dès que le même « client » possède un nom, un solde, et trois opérations qui doivent rester cohérentes entre elles. La **programmation orientée objet** range ces données et ces opérations dans un **objet**. On pense alors comme on décrit une chose : ce qu'elle est, ce qu'elle sait faire.

On y gagne en réutilisation, parce qu'une classe écrite pour un écran sert au suivant. En maintenance, parce qu'un changement de règle se fait dans la classe, pas dans dix fonctions éparpillées. En modularité, parce que chaque classe a un sujet. Et en abstraction : celui qui utilise un compte appelle `Deposer`, il n'a pas à savoir comment le solde est rangé.

## L'objet et la classe

Un **objet** réunit des **données**, ce qu'il est, et des **comportements**, ce qu'il fait. Les données s'appellent attributs ou propriétés. Les comportements s'appellent méthodes. Un chien a un nom, une race, un âge, une couleur, un poids. Il aboie, mange, court, dort. Les deux vont ensemble : `Manger` peut modifier le poids, parce que les deux appartiennent au même objet.

Une **classe** est le modèle. Le plan d'architecte n'est pas une maison. La classe `Chien` n'est pas un chien. On construit autant d'objets qu'on veut à partir du même plan. Rex et Bella sont deux objets. Ils ont les mêmes propriétés, pas les mêmes valeurs.

## Écrire la classe

Une classe se lit en trois bandes : les propriétés, le constructeur qui les remplit à la naissance, les méthodes.

```csharp
public class NomDeLaClasse
{
    // Propriétés (données)
    
    // Constructeur (initialisation)
    
    // Méthodes (comportements)
}
```

Voici un chien complet. Les propriétés sont en syntaxe automatique : `{ get; set; }` crée, derrière, une variable que vous n'écrivez pas. Le **constructeur** porte le même nom que la classe. Il n'a pas de type de retour. Il s'exécute au `new`, et c'est le moment de donner un nom, une race, un âge, un poids. Les méthodes utilisent ces valeurs. `Manger` augmente un peu le poids : l'action modifie l'état, et l'état reste dans l'objet.

```csharp
using System;

public class Chien
{
    // ========== PROPRIÉTÉS ==========
    // Ce sont les caractéristiques du chien
    
    public string Nom { get; set; }
    public string Race { get; set; }
    public int Age { get; set; }
    public double Poids { get; set; }
    
    // ========== CONSTRUCTEUR ==========
    // Méthode spéciale appelée lors de la création d'un objet
    // Elle porte le MÊME NOM que la classe
    
    public Chien(string nom, string race, int age, double poids)
    {
        Nom = nom;
        Race = race;
        Age = age;
        Poids = poids;
    }
    
    // ========== MÉTHODES ==========
    // Ce sont les actions que le chien peut faire
    
    public void Aboyer()
    {
        Console.WriteLine($"{Nom} fait : Wouf wouf !");
    }
    
    public void SePresenter()
    {
        Console.WriteLine($"Je m'appelle {Nom}, je suis un {Race} de {Age} ans.");
    }
    
    public void Manger(string nourriture)
    {
        Console.WriteLine($"{Nom} mange {nourriture}.");
        Poids += 0.1; // Le chien prend un peu de poids
    }
    
    public void Vieillir()
    {
        Age++;
        Console.WriteLine($"{Nom} a maintenant {Age} ans.");
    }
}
```

## Deux chiens, deux mémoires

`new` fabrique une **instance**. `monChien` et `autreChien` sont deux objets distincts, même s'ils sont du type `Chien`. Faire vieillir Rex ne change pas l'âge de Bella.

```csharp
public class Program
{
    public static void Main()
    {
        // Créer un premier chien
        Chien monChien = new Chien("Rex", "Berger Allemand", 3, 25.5);
        
        // Utiliser les méthodes
        monChien.SePresenter();  // Affiche: Je m'appelle Rex, je suis un Berger Allemand de 3 ans.
        monChien.Aboyer();       // Affiche: Rex fait : Wouf wouf !
        monChien.Manger("des croquettes");  // Affiche: Rex mange des croquettes.
        
        // Accéder aux propriétés
        Console.WriteLine($"Poids de {monChien.Nom} : {monChien.Poids} kg");
        
        // Créer un deuxième chien (même classe, objet différent)
        Chien autreChien = new Chien("Bella", "Labrador", 5, 28.0);
        autreChien.SePresenter();
        autreChien.Aboyer();
        
        // Les deux chiens sont INDÉPENDANTS
        monChien.Vieillir();  // Rex vieillit
        Console.WriteLine($"Âge de Bella : {autreChien.Age}"); // Bella n'a pas vieilli !
    }
}
```

## Décider qui a le droit de modifier

`public string Nom { get; set; }` est la forme la plus courte. `get` lit, `set` écrit, et n'importe quel code qui voit l'objet peut changer le nom.

On serre cela quand la donnée ne doit pas être libre. `Solde` se lit de l'extérieur, mais seul le compte le modifie : `{ get; private set; }`. `NumeroCompte` n'a pas de `set`. On peut encore l'affecter dans le constructeur, ensuite il est figé. `Deposer` est le seul chemin pour augmenter le solde, et il refuse un montant négatif.

```csharp
public class CompteBancaire
{
    // Lecture publique, modification privée
    public double Solde { get; private set; }
    
    // Propriété en lecture seule (pas de set)
    public string NumeroCompte { get; }
    
    public CompteBancaire(string numero, double soldeInitial)
    {
        NumeroCompte = numero;  // On peut initialiser dans le constructeur
        Solde = soldeInitial;
    }
    
    public void Deposer(double montant)
    {
        if (montant > 0)
        {
            Solde += montant;
            Console.WriteLine($"Dépôt de {montant}€. Nouveau solde : {Solde}€");
        }
    }
}
```

Quand la règle est plus précise qu'un simple `private set`, on écrit la propriété en entier, avec un champ privé derrière, le *backing field*. Ici, un âge hors de 0 à 150 est refusé. `value` est le nom que C# donne à ce qu'on essaie d'affecter.

```csharp
public class Personne
{
    private int _age;  // Variable privée (backing field)
    
    public int Age
    {
        get { return _age; }
        set 
        {
            if (value >= 0 && value <= 150) 
                _age = value;
            else 
                Console.WriteLine("Âge invalide !");
        }
    }
}
```

## Plusieurs façons de construire

Si vous n'écrivez aucun constructeur, C# en fournit un, vide, sans paramètre. Dès que vous en écrivez un, celui-là disparaît. Il faut le remettre à la main si vous en avez encore besoin.

```csharp
public class Point
{
    public int X { get; set; }
    public int Y { get; set; }
    // public Point() { } // Créé automatiquement
}
```

Deux constructeurs du même nom, avec des paramètres différents, c'est une **surcharge**. Un rectangle se construit avec une largeur et une hauteur, ou avec un seul côté quand c'est un carré.

```csharp
public class Rectangle
{
    public int Largeur { get; set; }
    public int Hauteur { get; set; }
    
    // Constructeur 1 : avec paramètres
    public Rectangle(int largeur, int hauteur)
    {
        Largeur = largeur;
        Hauteur = hauteur;
    }
    
    // Constructeur 2 : pour un carré
    public Rectangle(int cote)
    {
        Largeur = cote;
        Hauteur = cote;
    }
}
```

Le second répète l'affectation. `: this(cote, cote)` le fait appeler le premier. La règle « largeur et hauteur sont posées ensemble » n'est écrite qu'une fois.

```csharp
public class Rectangle
{
    public int Largeur { get; set; }
    public int Hauteur { get; set; }
    
    // Constructeur principal
    public Rectangle(int largeur, int hauteur)
    {
        Largeur = largeur;
        Hauteur = hauteur;
    }
    
    // Constructeur qui appelle le principal avec "this"
    public Rectangle(int cote) : this(cote, cote)
    {
        // Le constructeur ci-dessus est appelé automatiquement
    }
}
```

## Ce qu'une méthode rend

Une méthode `void` agit et ne renvoie rien. Une méthode typée `int`, `string`, ou autre, calcule une valeur et la rend avec `return`. L'appelant décide ensuite de l'afficher, de la stocker, de la passer plus loin.

```csharp
public class Calculatrice
{
    // Méthode qui retourne un résultat
    public int Additionner(int a, int b)
    {
        return a + b;
    }
    
    // Méthode qui ne retourne rien (void)
    public void AfficherResultat(int resultat)
    {
        Console.WriteLine($"Le résultat est : {resultat}");
    }
}
```

La **surcharge** existe aussi pour les méthodes. Même nom, paramètres différents. Le compilateur choisit celle qui correspond à l'appel. `Afficher(3)` n'est pas `Afficher("3")`.

```csharp
public class Afficheur
{
    public void Afficher(int nombre) 
    { 
        Console.WriteLine($"Nombre : {nombre}"); 
    }
    
    public void Afficher(string texte) 
    { 
        Console.WriteLine($"Texte : {texte}"); 
    }
    
    public void Afficher(int nombre, string unite) 
    { 
        Console.WriteLine($"{nombre} {unite}"); 
    }
}
```

## Trois piliers

L'**encapsulation** cache le détail et n'expose que ce qui est utile. Trois niveaux reviennent sans cesse. `public` est visible partout. `private` ne l'est que dans la classe. `protected` l'est dans la classe et dans ses filles. Le solde privé ne se touche que par `Deposer`, qui vérifie le montant. Personne de l'extérieur ne peut écrire `_solde = -1000`.

```csharp
public class CompteBancaire
{
    private double _solde;  // Privé : protégé de l'extérieur
    
    public double Solde     // Public : accessible via une propriété
    { 
        get { return _solde; }
        private set { _solde = value; }
    }
    
    public void Deposer(double montant)  // Public : méthode accessible
    {
        if (montant > 0)
            _solde += montant;
    }
}
```

L'**héritage** fait qu'une classe reçoit les propriétés et les méthodes d'une autre. `:` se lit « hérite de ». `base(nom)` appelle le constructeur de la mère avant le corps de la fille. `Chien` sait `Manger` sans l'avoir écrit, et `Aboyer` lui appartient en propre. Le cours suivant reprend ce mécanisme en détail.

```csharp
// CLASSE MÈRE
public class Animal
{
    public string Nom { get; set; }
    
    public Animal(string nom) 
    { 
        Nom = nom; 
    }
    
    public void Manger() 
    { 
        Console.WriteLine($"{Nom} mange."); 
    }
}

// CLASSE FILLE
public class Chien : Animal  // ":" signifie "hérite de"
{
    public string Race { get; set; }
    
    // "base" appelle le constructeur de la classe mère
    public Chien(string nom, string race) : base(nom)
    {
        Race = race;
    }
    
    public void Aboyer() 
    { 
        Console.WriteLine("Wouf !"); 
    }
}
```

```csharp
Chien monChien = new Chien("Rex", "Berger Allemand");
monChien.Manger();  // Méthode héritée de Animal
monChien.Aboyer();  // Méthode propre à Chien
```

Le **polymorphisme** veut que des objets de classes différentes répondent à la même méthode, chacun à sa façon. En C#, il faut l'autoriser. Dans la mère, `virtual` dit que les filles ont le droit de remplacer la méthode. Dans la fille, `override` dit qu'elles le font. Contrairement à Java, une méthode C# n'est pas virtuelle toute seule. Sans `virtual`, la fille ne redéfinit pas : elle cache, et l'appel via une variable `Animal` garderait le comportement de la mère.

```csharp
public class Animal
{
    public virtual void FaireDuBruit()  // "virtual" permet la redéfinition
    {
        Console.WriteLine("L'animal fait du bruit");
    }
}

public class Chien : Animal
{
    public override void FaireDuBruit()  // "override" redéfinit la méthode
    {
        Console.WriteLine("Wouf wouf !");
    }
}

public class Chat : Animal
{
    public override void FaireDuBruit()
    {
        Console.WriteLine("Miaou !");
    }
}
```

On range alors un chien et un chat dans une `List<Animal>`. La boucle ne connaît que `Animal`. À l'exécution, c'est la méthode de l'objet réel qui part.

```csharp
List<Animal> animaux = new List<Animal>();
animaux.Add(new Chien("Rex", "Labrador"));
animaux.Add(new Chat("Minou", "Persan"));

foreach (Animal animal in animaux)
{
    animal.FaireDuBruit();  // Appelle la version appropriée
}
// Affiche :
// Wouf wouf !
// Miaou !
```

Encapsulation, héritage, polymorphisme. Le premier protège l'état. Le deuxième partage ce qui est commun. Le troisième laisse chaque fille décider du geste, sans que le code qui appelle ait à connaître la fille.
