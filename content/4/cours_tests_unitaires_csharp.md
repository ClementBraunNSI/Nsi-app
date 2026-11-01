---
title: 'Les tests unitaires en C#'
description: 'Cours détaillé sur la démarche AAA, les tests nominaux/limites/exceptions et l''isolation de la logique métier.'
level: '2'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
icon: "circle-check"
prerequisites:
  - introduction_poo
audience: public
---

# Les tests unitaires en C#

Un test unitaire exécute **une** action d'un service et compare le résultat à une valeur fixée à l'avance, sans lancer l'application ni utiliser l'interface. Quand on modifie le calcul d'un devis, on relance l'ensemble des tests : les cas qui étaient justes doivent le rester. Un test qui échoue signale une **régression**, c'est-à-dire un comportement qui fonctionnait et qui ne fonctionne plus. Une méthode de test bien nommée documente aussi le comportement attendu, par exemple « cinq jours à 40 euros donnent 200 euros ».

## Arrange, Act, Assert

Chaque test se déroule en trois temps. **Arrange** prépare les objets, **Act** appelle une seule méthode et **Assert** vérifie le résultat. Mélanger ces trois étapes rend un échec difficile à comprendre, car on ne sait plus si c'est la donnée de départ ou le calcul qui est faux.

```csharp
[Fact]
public void CalculerDevis_5Jours_Retourne200()
{
    // Arrange
    var service = new VehiculeService(new InMemoryVehiculeRepository());

    // Act
    decimal total = service.CalculerDevis(40m, 5);

    // Assert
    Assert.Equal(200m, total);
}
```

`[Fact]` marque la méthode comme un cas xUnit, sans paramètre. Le nom de la méthode indique le scénario et le résultat attendu : `CalculerDevis`, 5 jours, 200. `40m` est un `decimal`. On n'utilise pas de `double` pour un prix, car les erreurs d'arrondi du binaire n'ont pas leur place dans un devis. `Assert.Equal` échoue si `total` ne vaut pas 200, et le rapport de test affiche alors les deux valeurs.

On teste trois familles de cas. Le cas **nominal** est le cas ordinaire, comme celui de l'exemple. Le cas **limite** se situe à une frontière : une durée de 0, une liste vide, une référence `null` ou le premier jour encore valide. Le cas d'**exception** correspond à un refus : la méthode doit lever une exception, et non renvoyer un total absurde.

```csharp
[Fact]
public void CalculerDevis_DureeZero_LeveArgumentException()
{
    var service = new VehiculeService(new InMemoryVehiculeRepository());
    Assert.Throws<ArgumentException>(() => service.CalculerDevis(50m, 0));
}
```

`Assert.Throws` n'appelle pas la méthode tout de suite : il reçoit une lambda, l'exécute, et échoue si aucune `ArgumentException` n'est levée. Si la méthode renvoyait 0 sans signaler d'erreur, le test échouerait, ce qui est justement l'effet recherché.

## Isoler la logique métier

Pour pouvoir être vérifié, `CalculerDevis` ne doit dépendre ni d'un fichier CSV ni d'une base de données. On lui fournit donc un dépôt **en mémoire**. Le test reste ainsi rapide, il ne crée aucun fichier, et un échec désigne clairement le calcul, et non une ligne mal lue. C'est le rôle de l'interface vue dans le cours sur les contrats : `VehiculeService` reçoit un `IVehiculeRepository`, et le test fournit `InMemoryVehiculeRepository`.

Le projet de tests est un projet à part, xUnit ou NUnit. On y ajoute une référence vers le projet métier, mais pas l'inverse, car le code métier ne doit pas dépendre de ses tests. On écrit une classe de tests par service, par exemple `VehiculeServiceTests` et `StatsServiceTests`, et le nom de chaque méthode décrit le cas testé. Il faut relancer les tests après chaque correction, et pas seulement la veille du rendu.

## Exercices d'application

### Exercice 1
Écrire un test nominal `CalculerDevis` sur 3 jours.

### Exercice 2
Écrire un test limite pour une durée invalide (`0` ou négative).

### Exercice 3
Écrire un test d'exception métier pour un prix journalier invalide.

### Exercice 4
Écrire 2 tests pour un service de statistiques (`moyenne` et `top 3`).

## TP guidé (1h)

1. Créer le projet de tests.
2. Ajouter `InMemoryVehiculeRepository`.
3. Écrire 6 à 10 tests couvrant :
   - le calcul du devis ;
   - la validation ;
   - les exceptions ;
   - les statistiques.
4. Exécuter la suite et corriger les échecs.

## Livrable attendu

- Projet de tests compilable.
- Au moins 6 tests passants.
- Présence des 3 catégories (nominal, limite, exception).
