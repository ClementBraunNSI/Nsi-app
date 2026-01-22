---
title: "Premiers pas en C#"
chapter: "BTS SIO 1 : B2 - Développement (SLAM)"
badgeId: "bts_csharp_intro"
meta: "Syntaxe, Conditions, Boucles et Listes"
---

<ExerciseTabs courseId="bts_csharp_intro" courseTitle="Badge Premiers Pas en C#">
  
  <ExerciseSection id="csharp-variables-1" label="1. Variables & Affichage">
    ## Variables et Méthodes simples

    En C#, l'affichage se fait principalement via `Console.WriteLine()`. Les variables doivent être typées (int, string, double, etc.).

    ### Exercice 1.1 — Message de bienvenue
    **Écrire une méthode `static void AfficherBienvenue()` qui affiche "Bienvenue en C# !" dans la console.**

    ### Exercice 1.2 — Présentation complète
    **Écrire une méthode `static void SePresenter(string prenom, string ville)` qui affiche "Je m'appelle [prenom] et j'habite [ville]".**

    ### Exercice 1.3 — Calcul d'âge futur
    **Écrire une méthode `static int AgeDans10Ans(int ageActuel)` qui retourne l'âge dans 10 ans.**

    ### Exercice 1.4 — Conversion de température
    **Écrire une méthode `static double CelsiusVersFahrenheit(double celsius)`. Formule : `(celsius * 9/5) + 32`.**

    ### Exercice 1.5 — Moyenne de trois notes
    **Écrire une méthode `static double Moyenne(double n1, double n2, double n3)` qui retourne la moyenne des trois nombres.**
  </ExerciseSection>

  <ExerciseSection id="csharp-conditions-2" label="2. Conditions">
    ## Les structures conditionnelles

    ### Exercice 2.1 — Le plus grand
    **Écrire une méthode `static int Max(int a, int b)` qui retourne le plus grand des deux nombres.**

    ### Exercice 2.2 — Vérification de longueur
    **Écrire une méthode `static bool EstMotLong(string mot)` qui retourne `true` si le mot fait plus de 5 caractères, sinon `false`.**

    ### Exercice 2.3 — Catégorie d'âge
    **Écrire une méthode `static string CategorieAge(int age)` qui retourne "Enfant" (&lt;=12), "Ado" (&lt;=17), "Adulte" (&lt;=59) ou "Senior".**

    ### Exercice 2.4 — Billet de train
    **Écrire une méthode `static double CalculerPrixTrain(int age, double km)` selon les règles : 0.20€/km. -50% si &lt;12 ans, -30% si >=65 ans. -10€ si >200km.**
  </ExerciseSection>

  <ExerciseSection id="csharp-boucles-3" label="3. Boucles">
    ## Itérations (For & While)

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
  </ExerciseSection>

  <ExerciseSection id="csharp-listes-4" label="4. Listes">
    ## Collections dynamiques (List)

    ### Exercice 4.1 — Somme des éléments
    **Écrire une méthode `static int Somme(List<int> nombres)` qui retourne la somme des éléments.**

    ### Exercice 4.2 — Compter les pairs
    **Écrire une méthode `static int CompterPairs(List<int> nombres)` qui retourne le nombre d'éléments pairs.**

    ### Exercice 4.3 — Trouver le Maximum
    **Écrire une méthode `static int TrouverMax(List<int> nombres)` qui retourne la plus grande valeur.**
  </ExerciseSection>
</ExerciseTabs>