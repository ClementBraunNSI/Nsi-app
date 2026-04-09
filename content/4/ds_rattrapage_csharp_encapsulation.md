---
title: 'DS Rattrapage — Programmation Orientée Objet (C#)'
description: 'Sujet de rattrapage : encapsulation et modelisation en classes imbriquees (Festival, Scene, Performance).'
level: '2'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
icon: "📝"
prerequisites:
  - introduction_poo
  - bts_poo_basics
---

## DS — Programmation Orientée Objet (C#)

**Sujet : Gestion d'un Festival Numerique**  
**Durée : 2h00 — Coefficient : 4**

---

## Contexte

Vous développez le module de gestion d'un festival numérique.  
Votre mission est de modéliser :

- les **performances** (concert, conférence, atelier),
- les **scènes** qui regroupent des performances,
- le **festival** qui regroupe plusieurs scènes.

Le sujet impose une modélisation imbriquée :

- `Festival` possède une liste de `Scene`
- `Scene` possède une liste de `Performance`

---

## Consignes Générales

- Ne pas utiliser d'héritage ni de polymorphisme.
- Écrire du code C# valide.
- Respecter strictement l'encapsulation (attributs privés, propriétés publiques).
- Respecter les conventions de nommage (PascalCase, camelCase).
- Valider les durées, capacités et tarifs (interdire les valeurs négatives).

---

## Partie 1 : La Performance (5 points)

Une performance est une prestation programmée sur une scène.

### Travail à faire

1. Écrire la classe `Performance`.
2. Déclarer les propriétés suivantes :
   - `Id` (`string`) : identifiant unique (ex: `"PERF-042"`),
   - `Titre` (`string`),
   - `Intervenant` (`string`),
   - `DureeMinutes` (`int`),
   - `Tarif` (`double`).
3. Écrire un constructeur `Performance(string id, string titre, string intervenant, int dureeMinutes, double tarif)` qui initialise tous les attributs.
4. Écrire une méthode `double CalculerRecette(int nbSpectateurs)` qui prend en paramètre le nombre de spectateurs et qui renvoie la recette `Tarif * nbSpectateurs` (utiliser `0` si `nbSpectateurs < 0`).
5. Mettre en place les validations minimales : imposer `DureeMinutes > 0` et `Tarif >= 0`.

---

## Partie 2 : La Scène (8 points)

Une scène peut accueillir plusieurs performances.

### Travail à faire

1. Écrire la classe `Scene`.
2. Déclarer :
   - `Nom` (`string`) : nom de la scène (ex: `"Main Stage"`),
   - `Capacite` (`int`) : capacité maximale,
   - `_performances` (`List<Performance>`) : liste privée des performances.
3. Écrire un constructeur `Scene(string nom, int capacite)` qui initialise `Nom`, `Capacite` et la liste `_performances`.
4. Écrire une méthode `void AjouterPerformance(Performance p)` qui prend en paramètre une performance, qui refuse `null`, puis qui ajoute l'objet à la liste si valide.
5. Écrire une méthode `int CalculerDureeTotale()` qui ne prend pas de paramètre et qui renvoie la somme des `DureeMinutes` de toutes les performances.
6. Écrire une méthode `double CalculerRecettePotentielle()` qui ne prend pas de paramètre et qui renvoie la recette théorique de la scène : `Somme(Performance.Tarif) * Capacite`.

---

## Partie 3 : Le Festival (7 points)

Le festival regroupe plusieurs scènes et doit fournir une vision globale.

### Travail à faire

1. Écrire la classe `Festival`.
2. Déclarer :
   - `NomFestival` (`string`),
   - `Ville` (`string`),
   - `_scenes` (`List<Scene>`) : liste privée des scènes.
3. Écrire un constructeur `Festival(string nomFestival, string ville)` qui initialise les attributs et la liste `_scenes`.
4. Écrire une méthode `void AjouterScene(Scene s)` qui prend en paramètre une scène, qui refuse `null`, puis qui ajoute la scène au festival.
5. Écrire une méthode `int CalculerNombreTotalPerformances()` qui ne prend pas de paramètre et qui renvoie le nombre total de performances de toutes les scènes.
6. Écrire une méthode `int CalculerDureeTotaleFestival()` qui ne prend pas de paramètre et qui renvoie la durée totale (en minutes) du festival.
7. Écrire une méthode `double CalculerRecettePotentielleGlobale()` qui ne prend pas de paramètre et qui renvoie la somme des recettes potentielles de toutes les scènes.
8. Écrire une méthode `void AfficherStatistiquesGlobales()` qui affiche :
   - le nombre de scènes,
   - le nombre total de performances,
   - la durée totale,
   - la recette potentielle globale.


## Annexe : Exemple d'utilisation (Main)

```csharp
public static void Main(string[] args)
{
    // 1. Création du festival
    Festival festival = new Festival("Numerik Live", "Lille");

    // 2. Création d'une scène
    Scene sceneA = new Scene("Main Stage", 500);
    festival.AjouterScene(sceneA);

    // 3. Création d'une performance
    Performance perf1 = new Performance("PERF-001", "IA Générative", "L. Martin", 45, 12.0);

    // 4. Ajout de la performance à la scène
    sceneA.AjouterPerformance(perf1);

    // 5. Affichage global
    festival.AfficherStatistiquesGlobales();
}
```

