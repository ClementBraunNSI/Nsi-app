---
title: "Introduction à la POO en C#"
description: "Les bases de la Programmation Orientée Objet : concepts, classes et objets."
level: "2"
chapter: "BTS SIO 1 : B2 - Développement (SLAM)"
icon: "🎯"
---

## 🌟 Introduction

La Programmation Orientée Objet (POO) est un paradigme de programmation qui organise le code autour du concept d'**objets** plutôt que de fonctions et de logique. C'est une approche naturelle qui reflète la façon dont nous pensons au monde réel.

> **Pourquoi la POO ?**
>
> - ✅ **Réutilisabilité** : Le code peut être réutilisé dans différents contextes
> - ✅ **Maintenabilité** : Plus facile à comprendre et à modifier
> - ✅ **Modularité** : Le code est organisé en modules logiques
> - ✅ **Abstraction** : Cache la complexité et montre seulement l'essentiel


## 📦 Les Concepts Fondamentaux

### Qu'est-ce qu'un Objet ?

Un **objet** est une entité qui combine :

- Des **données** (ce qu'il EST) → appelées **attributs** ou **propriétés**
- Des **comportements** (ce qu'il FAIT) → appelées **méthodes**

**Analogie du monde réel :** Prenons l'exemple d'un **chien** :

- **Données** : nom, race, âge, couleur, poids
- **Comportements** : aboyer(), manger(), courir(), dormir()

### Qu'est-ce qu'une Classe ?

Une **classe** est un **modèle** (blueprint) qui définit la structure et le comportement des objets.

**Analogie :**

- La classe = le plan d'architecte d'une maison
- L'objet = la maison construite d'après ce plan

On peut construire **plusieurs maisons** (objets) à partir du **même plan** (classe).


## 🏗️ Créer sa Première Classe

### Syntaxe de Base

```csharp
public class NomDeLaClasse
{
    // Propriétés (données)
    
    // Constructeur (initialisation)
    
    // Méthodes (comportements)
}
```

### Exemple Concret : La Classe `Chien`

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

**Explications :**

- **`public class Chien`** : Définit le modèle
- **Propriétés** : `Nom`, `Race`, `Age`, `Poids` définissent l'état de l'objet
- **Constructeur** : `public Chien(...)` permet d'initialiser les propriétés lors de la création
- **Méthodes** : `Aboyer`, `SePresenter` définissent le comportement

---

## 🎮 Utiliser la Classe (Créer des Objets)

Une fois la classe définie, on peut créer des **instances** (des objets spécifiques) dans le programme principal.

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

## 🔐 Les Propriétés en C#

### Propriétés Auto-implémentées

```csharp
public string Nom { get; set; }
```

C'est la syntaxe la plus simple. C# crée automatiquement une variable privée en arrière-plan.

- **`get`** : permet de **lire** la valeur
- **`set`** : permet de **modifier** la valeur

### Contrôler l'Accès

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

### Propriétés avec Validation (Full Properties)

Parfois, on veut valider les valeurs avant de les accepter.

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

## 🏗️ Les Constructeurs

### Constructeur par Défaut

Si vous ne définissez AUCUN constructeur, C# en crée un automatiquement (vide).

```csharp
public class Point
{
    public int X { get; set; }
    public int Y { get; set; }
    // public Point() { } // Créé automatiquement
}
```

### Surcharge de Constructeurs

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

### Chaînage de Constructeurs

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

## ⚙️ Les Méthodes

### Types de Méthodes

- **`void`** : La méthode effectue une action mais ne retourne rien
- **Type (int, string, ...)** : La méthode retourne un résultat

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

### Surcharge de Méthodes (Overloading)

Même nom, paramètres différents.

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


## 🎯 Les Piliers de la POO

### 1. L'Encapsulation

**Définition :** Cacher les détails internes et exposer seulement ce qui est nécessaire.

**Modificateurs d'accès :**

- **`public`** : Accessible de partout
- **`private`** : Accessible seulement dans la classe
- **`protected`** : Accessible dans la classe et ses classes dérivées

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

### 2. L'Héritage

**Définition :** Une classe peut hériter des propriétés et méthodes d'une autre classe.

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

**Utilisation :**

```csharp
Chien monChien = new Chien("Rex", "Berger Allemand");
monChien.Manger();  // Méthode héritée de Animal
monChien.Aboyer();  // Méthode propre à Chien
```

### 3. Le Polymorphisme et Méthodes Virtuelles

**Définition :** Le polymorphisme est la capacité d'objets de classes différentes à répondre à la même méthode de manière spécifique. Cela est rendu possible grâce aux **méthodes virtuelles**.

#### Le couple `virtual` / `override`

Pour permettre la redéfinition d'une méthode, C# impose une règle explicite :

1. **Dans la classe mère** : On ajoute le mot-clé **`virtual`** pour autoriser les enfants à modifier la méthode.
2. **Dans la classe fille** : On utilise le mot-clé **`override`** pour indiquer qu'on remplace le comportement d'origine.

> 💡 **Note :** Contrairement à d'autres langages (comme Java), en C#, les méthodes ne sont pas virtuelles par défaut. Il faut explicitement donner la permission de les modifier.

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

**Utilisation avec polymorphisme :**

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
