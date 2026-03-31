---
title: Premiers pas en C#
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
badgeId: bts_csharp_intro
meta: 'Syntaxe, Conditions, Boucles et Listes'
prerequisites:
  - cours_heritage_csharp
---

<ExerciseTabs courseId="bts_csharp_intro" courseTitle="Badge Premiers Pas en C#">
  
  <ExerciseSection id="csharp-variables-1" label="1. Variables & Affichage">
    ## Variables et Méthodes simples

    ### 🏗️ Structure fondamentale en C#

    En C#, toutes les fonctions (qu'on appelle alors **méthodes**) doivent être définies à l'intérieur d'une **classe**. Pour exécuter votre code, vous devez également inclure une méthode spéciale appelée `Main` qui servira de point d'entrée.

    ```csharp
    public class Program 
    { 
        // VOS FONCTIONS ICI
        public static string Saluer(string nom) 
        { 
            return $"Bonjour, {nom}!"; 
        } 

        // VOTRE BAC À SABLE (Point d'entrée)
        public static void Main() 
        { 
            Console.WriteLine(Program.Saluer("Alice")); 
        } 
    }
    ```

    ### 💾 Types de variables

    En C#, chaque variable doit avoir un **type déclaré** :
    - `int` : nombres entiers
    - `double` : nombres décimaux
    - `string` : chaînes de caractères
    - `bool` : valeurs booléennes (true/false)

    ```csharp
    int age = 25;
    double prix = 19.99;
    string nom = "Alice";
    bool estMajeur = true;
    ```

    ### 💬 Affichage dans la console

    La méthode `Console.WriteLine()` permet d'afficher du texte dans la console.

    ```csharp
    Console.WriteLine("Bonjour le monde !");
    Console.WriteLine(age); // Affiche la valeur de la variable
    ```

    ---

    ### Exercice 1.1 — Message de bienvenue
    **Écrire une méthode `static void AfficherBienvenue()` qui affiche "Bienvenue en C# !" dans la console.**

    <Correction>
    ```csharp
    public static void AfficherBienvenue()
    {
        Console.WriteLine("Bienvenue en C# !");
    }
    ```
    </Correction>

    ### Exercice 1.2 — Présentation complète
    **Écrire une méthode `static void SePresenter(string prenom, string ville)` qui affiche "Je m'appelle [prenom] et j'habite [ville]".**

    <Correction>
    ```csharp
    public static void SePresenter(string prenom, string ville)
    {
        Console.WriteLine($"Je m'appelle {prenom} et j'habite {ville}");
    }
    ```
    </Correction>

    ### Exercice 1.3 — Calcul d'âge futur
    **Écrire une méthode `static int AgeDans10Ans(int ageActuel)` qui retourne l'âge dans 10 ans.**

    <Correction>
    ```csharp
    public static int AgeDans10Ans(int ageActuel)
    {
        return ageActuel + 10;
    }
    ```
    </Correction>

    ### Exercice 1.4 — Conversion de température
    **Écrire une méthode `static double CelsiusVersFahrenheit(double celsius)`. Formule : `(celsius * 9/5) + 32`.**

    <Correction>
    ```csharp
    public static double CelsiusVersFahrenheit(double celsius)
    {
        return (celsius * 9.0 / 5.0) + 32;
    }
    ```
    </Correction>

    ### Exercice 1.5 — Moyenne de trois notes
    **Écrire une méthode `static double Moyenne(double n1, double n2, double n3)` qui retourne la moyenne des trois nombres.**

    <Correction>
    ```csharp
    public static double Moyenne(double n1, double n2, double n3)
    {
        return (n1 + n2 + n3) / 3.0;
    }
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="csharp-conditions-2" label="2. Conditions">
    ## Les structures conditionnelles

    ### ⚖️ Structure `if` / `else`

    Les conditions permettent d'exécuter du code selon des critères spécifiques.

    ```csharp
    if (age >= 18) 
    {
        Console.WriteLine("Vous êtes majeur");
    } 
    else 
    {
        Console.WriteLine("Vous êtes mineur");
    }
    ```

    ### Opérateurs de comparaison

    - `a > b` : Supérieur
    - `a < b` : Inférieur
    - `a >= b` : Supérieur ou égal
    - `a <= b` : Inférieur ou égal
    - `a == b` : Égalité
    - `a != b` : Différence

    ### Structure `if` / `else if` / `else`

    ```csharp
    if (age <= 12) 
    {
        Console.WriteLine("Enfant");
    } 
    else if (age <= 17) 
    {
        Console.WriteLine("Ado");
    }
    else 
    {
        Console.WriteLine("Adulte");
    }
    ```

    ---

    ### Exercice 2.1 — Le plus grand
    **Écrire une méthode `static int Max(int a, int b)` qui retourne le plus grand des deux nombres.**

    <Correction>
    ```csharp
    public static int Max(int a, int b)
    {
        if (a > b)
        {
            return a;
        }
        else
        {
            return b;
        }
    }
    ```
    </Correction>

    ### Exercice 2.2 — Vérification de longueur
    **Écrire une méthode `static bool EstMotLong(string mot)` qui retourne `true` si le mot fait plus de 5 caractères, sinon `false`.**

    <Correction>
    ```csharp
    public static bool EstMotLong(string mot)
    {
        return mot.Length > 5;
    }
    ```
    </Correction>

    ### Exercice 2.3 — Catégorie d'âge
    **Écrire une méthode `static string CategorieAge(int age)` qui retourne "Enfant" (&lt;=12), "Ado" (&lt;=17), "Adulte" (&lt;=59) ou "Senior".**

    <Correction>
    ```csharp
    public static string CategorieAge(int age)
    {
        if (age <= 12)
        {
            return "Enfant";
        }
        else if (age <= 17)
        {
            return "Ado";
        }
        else if (age <= 59)
        {
            return "Adulte";
        }
        else
        {
            return "Senior";
        }
    }
    ```
    </Correction>

    ### Exercice 2.4 — Billet de train
    **Écrire une méthode `static double CalculerPrixTrain(int age, double km)` selon les règles : 0.20€/km. -50% si &lt;12 ans, -30% si >=65 ans. -10€ si >200km.**

    <Correction>
    ```csharp
    public static double CalculerPrixTrain(int age, double km)
    {
        double prix = km * 0.20;
        
        // Réduction selon l'âge
        if (age < 12)
        {
            prix = prix * 0.5; // -50%
        }
        else if (age >= 65)
        {
            prix = prix * 0.7; // -30%
        }
        
        // Réduction si plus de 200 km
        if (km > 200)
        {
            prix = prix - 10;
        }
        
        return prix;
    }
    ```
    </Correction>
  </ExerciseSection>

  <ExerciseSection id="csharp-boucles-3" label="3. Boucles">
    ## Itérations (For & While)

    ### 🔄 Boucle `for`

    Répète un code un nombre défini de fois.

    ```csharp
    for (int i = 0; i < 10; i++) 
    {
        Console.WriteLine(i); // Affiche de 0 à 9
    }
    ```

    ### 🔄 Boucle `while`

    Répète un code tant qu'une condition reste vraie.

    ```csharp
    int i = 0;
    while (i < 10) 
    {
        Console.WriteLine(i);
        i++; // Incrémentation obligatoire
    }
    ```

    ### Parcourir une chaîne de caractères

    ```csharp
    string texte = "Bonjour";
    for (int i = 0; i < texte.Length; i++)
    {
        Console.WriteLine(texte[i]); // Affiche chaque caractère
    }
    ```

    ---

    ### Exercice 3.1 — Compter jusqu'à N
    **Écrire une méthode `static void CompterJusqua(int n)` qui affiche les nombres de 1 à n.**

    ### Exercice 3.2 — Table de multiplication
    **Écrire une méthode `static void AfficherTable(int n)` qui affiche la table de multiplication de n (de 1 à 10).**

    ### Exercice 3.3 — Somme 1 à N
    **Écrire une méthode `static int SommeJusqua(int n)` qui calcule la somme des entiers de 1 à n.**

    ### Exercice 3.4 — Compter voyelles
    **Écrire une méthode `static int CompterVoyelles(string texte)` qui retourne le nombre de voyelles.**

    ### Exercice 3.5 — Palindrome
    **Écrire une méthode `static bool EstPalindrome(string texte)` qui vérifie si le texte est un palindrome.**

    ### Exercice 3.6 — Puissance de 2
    **Écrire une méthode `static void AfficherPuissances(int n)` qui affiche toutes les puissances de 2 inférieures ou égales à n.**

    ### Exercice 3.7 — Triangle d'étoiles
    **Écrire une méthode `static void DessinerTriangle(int hauteur)` qui affiche un triangle rectangle d'étoiles.**

    ### Exercice 3.8 — Factorielle
    **Écrire une méthode `static int Factorielle(int n)` qui retourne la factorielle de n (n!).**

    ### Exercice 3.9 — Nombre Premier
    **Écrire une méthode `static bool EstPremier(int n)` qui retourne true si n est un nombre premier.**

    ### Exercice 3.10 — Inverser une chaîne
    **Écrire une méthode `static string InverserChaine(string texte)` qui retourne la chaîne inversée.**
  </ExerciseSection>

  <ExerciseSection id="csharp-listes-4" label="4. Listes">
    ## Collections dynamiques (List)

    ### 📋 Création et manipulation

    Les listes sont des collections dynamiques qui peuvent contenir plusieurs éléments du même type.

    ```csharp
    // Créer une liste vide
    List<int> maListe = new List<int>();

    // Ajouter un élément
    maListe.Add(10);

    // Créer une liste avec des valeurs initiales
    List<int> autreListe = new List<int>{10, 20, 30};

    // Ajouter plusieurs éléments
    maListe.AddRange(autreListe);

    // Accéder à un élément par son index
    int premierElement = maListe[0];

    // Connaître le nombre d'éléments
    int taille = maListe.Count;
    ```

    ### Parcourir une liste

    ```csharp
    // Parcours avec for
    for (int i = 0; i < maListe.Count; i++) 
    {
        Console.WriteLine(maListe[i]);
    }

    // Parcours avec foreach
    foreach (int nombre in maListe) 
    {
        Console.WriteLine(nombre);
    }
    ```

    ---

    ### Exercice 4.1 — Somme des éléments
    **Écrire une méthode `static int Somme(List<int> nombres)` qui retourne la somme des éléments.**

    ### Exercice 4.2 — Compter les pairs
    **Écrire une méthode `static int CompterPairs(List<int> nombres)` qui retourne le nombre d'éléments pairs.**

    ### Exercice 4.3 — Trouver le Maximum
    **Écrire une méthode `static int TrouverMax(List<int> nombres)` qui retourne la plus grande valeur.**

    ### Exercice 4.4 — Filtrer les Positifs
    **Écrire une méthode `static List<int> FiltrerPositifs(List<int> nombres)` qui retourne une nouvelle liste ne contenant que les nombres positifs.**

    ### Exercice 4.5 — Concaténation
    **Écrire une méthode `static string Concatener(List<string> mots)` qui assemble les mots séparés par un espace.**

    ### Exercice 4.6 — Inverser la liste
    **Écrire une méthode `static List<int> InverserListe(List<int> nombres)` qui retourne une nouvelle liste inversée.**

    ### Exercice 4.7 — Recherche d'élément
    **Écrire une méthode `static int TrouverIndex(List<int> nombres, int valeur)` qui retourne l'index de la valeur ou -1.**

    ### Exercice 4.8 — Moyenne
    **Écrire une méthode `static double CalculerMoyenne(List<double> notes)` qui retourne la moyenne des notes.**

    ### Exercice 4.9 — Uniques
    **Écrire une méthode `static List<int> SupprimerDoublons(List<int> nombres)` qui retourne la liste sans doublons.**
  </ExerciseSection>
</ExerciseTabs>
