---
title: Introduction à la POO en C#
description: 'Les bases de la Programmation Orientée Objet : concepts, classes et objets.'
level: '2'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
icon: "target"
prerequisites:
  - csharp_csv_bdd
audience: public
---

# Introduction à la POO en C#

Jusqu'ici, un programme était une suite de fonctions qui se transmettent des variables. Cette organisation suffit pour un calcul, mais elle devient difficile à maintenir dès qu'un même « client » possède un nom, un solde et plusieurs opérations qui doivent rester cohérentes entre elles. La **programmation orientée objet** regroupe ces données et ces opérations dans un **objet**. On décrit alors chaque élément du programme par ce qu'il est et par ce qu'il sait faire.

Cette approche facilite la réutilisation, car une classe écrite pour un écran peut servir au suivant, et la maintenance, car un changement de règle se fait dans la classe et non dans dix fonctions éparpillées. Elle rend aussi le programme plus modulaire, puisque chaque classe a un rôle précis, et elle permet l'abstraction : celui qui utilise un compte appelle `Deposer` sans avoir à savoir comment le solde est stocké.

## L'objet et la classe

Un **objet** réunit des **données**, qui décrivent ce qu'il est, et des **comportements**, qui décrivent ce qu'il fait. Les données s'appellent des attributs ou des propriétés, et les comportements des méthodes. Un chien a par exemple un nom, une race, un âge, une couleur et un poids, et il peut aboyer, manger, courir ou dormir. Données et comportements sont liés : `Manger` peut modifier le poids, parce que les deux appartiennent au même objet.

Une **classe** est le modèle des objets. De même qu'un plan d'architecte n'est pas une maison, la classe `Chien` n'est pas un chien. On peut construire autant d'objets que nécessaire à partir du même plan : Rex et Bella sont deux objets qui ont les mêmes propriétés, mais pas les mêmes valeurs.

## Écrire la classe

Une classe comporte trois parties : les propriétés, le constructeur, qui leur donne une valeur à la création de l'objet, et les méthodes.

```csharp
public class NomDeLaClasse
{
    // Propriétés (données)
    
    // Constructeur (initialisation)
    
    // Méthodes (comportements)
}
```

Voici un chien complet. Les propriétés sont en syntaxe automatique : `{ get; set; }` crée automatiquement une variable cachée, qu'il n'est pas nécessaire d'écrire. Le **constructeur** porte le même nom que la classe et n'a pas de type de retour. Il s'exécute au moment du `new` : c'est là qu'on donne un nom, une race, un âge et un poids au chien. Les méthodes utilisent ensuite ces valeurs : `Manger` augmente un peu le poids, car l'action modifie l'état de l'objet, qui reste enregistré dans l'objet.

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

## Plusieurs instances d'une classe

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

## Contrôler l'accès aux propriétés

`public string Nom { get; set; }` est la forme la plus courte. `get` permet de lire la valeur et `set` de la modifier : n'importe quel code qui a accès à l'objet peut donc changer le nom.

On restreint cet accès quand la donnée ne doit pas être modifiée librement. `Solde` peut être lu depuis l'extérieur, mais seul le compte peut le modifier, grâce à `{ get; private set; }`. `NumeroCompte` n'a pas de `set` : on peut l'affecter dans le constructeur, mais il ne peut plus changer ensuite. `Deposer` est le seul moyen d'augmenter le solde, et cette méthode refuse un montant négatif.

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

Quand la règle est plus précise qu'un simple `private set`, on écrit la propriété en entier, avec un champ privé associé, appelé *backing field*. Ici, un âge qui n'est pas compris entre 0 et 150 est refusé. `value` désigne la valeur que l'on essaie d'affecter.

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

## Plusieurs constructeurs

Si aucun constructeur n'est écrit, C# en fournit un, vide et sans paramètre. Dès qu'un constructeur est écrit, ce constructeur par défaut disparaît, et il faut le réécrire s'il est encore utile.

```csharp
public class Point
{
    public int X { get; set; }
    public int Y { get; set; }
    // public Point() { } // Créé automatiquement
}
```

Écrire deux constructeurs avec des paramètres différents s'appelle une **surcharge**. Un rectangle se construit avec une largeur et une hauteur, ou avec un seul côté quand c'est un carré.

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

Pour éviter que le second constructeur répète les affectations, `: this(cote, cote)` lui fait appeler le premier. La règle « largeur et hauteur sont fixées ensemble » n'est ainsi écrite qu'une seule fois.

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

Pour éviter que le second constructeur répète les affectations, `: this(cote, cote)` lui fait appeler le premier. La règle « largeur et hauteur sont fixées ensemble » ## La valeur de retour d'une méthode

Une méthode `void` agit sans rien renvoyer. Une méthode typée `int`, `string` ou autre calcule une valeur et la renvoie avec `return`. Le code appelant peut ensuite l'afficher, la stocker ou la transmettre à une autre méthode.

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

La **surcharge** existe aussi pour les méthodes. Plusieurs méthodes portent alors le même nom, mais reçoivent des paramètres différents. Le compilateur choisit celle qui correspond à l'appel. `Afficher(3)` n'est pas `Afficher("3")`.

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

## Les trois piliers de la POO

L'**encapsulation** cache les détails internes et n'expose que ce qui est utile. Trois niveaux d'accès sont très courants : `public` rend un élément visible partout, `private` seulement dans la classe, et `protected` dans la classe et dans ses classes filles. Le solde privé ne peut être modifié que par `Deposer`, qui vérifie le montant. Personne de l'extérieur ne peut écrire `_solde = -1000`.

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

L'**héritage** permet à une classe de recevoir les propriétés et les méthodes d'une autre classe. Le symbole `:` se lit « hérite de », et `base(nom)` appelle le constructeur de la classe mère avant le corps de la classe fille. `Chien` sait ainsi `Manger` sans avoir écrit cette méthode, alors que `Aboyer` lui est propre. Le cours suivant reprend ce mécanisme en détail.

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

Le **polymorphisme** permet à des objets de classes différentes de répondre à la même méthode, chacun à sa façon. En C#, il faut l'autoriser explicitement : dans la classe mère, `virtual` indique que les filles peuvent remplacer la méthode, et dans la fille, `override` indique qu'elle la remplace. Contrairement à Java, une méthode C# n'est pas virtuelle par défaut. Sans `virtual`, la méthode de la fille ne redéfinit pas celle de la mère, elle la masque, et un appel à travers une variable de type `Animal` garderait le comportement de la mère.

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

On range alors un chien et un chat dans une `List<Animal>`. La boucle ne manipule que des `Animal`, mais à l'exécution, c'est la méthode de l'objet réel qui est appelée.

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

La programmation objet repose sur trois principes : l'encapsulation, l'héritage et le polymorphisme. L'encapsulation protège l'état des objets, l'héritage permet de partager ce qui est commun, et le polymorphisme laisse chaque classe fille définir son propre comportement, sans que le code appelant ait besoin de la connaître.
