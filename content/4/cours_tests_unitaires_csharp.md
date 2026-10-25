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

Un test unitaire exécute **une** action du service et compare le résultat à une valeur qu'on a décidée à l'avance. Il ne lance pas l'application. Il ne clique pas dans l'interface. Quand on modifie le calcul d'un devis, on relance la suite : les cas déjà justes doivent le rester. Un test qui casse signale une régression, un comportement qui marchait et qui ne marche plus. La méthode de test, bien nommée, documente aussi le contrat : « cinq jours à 40 euros, ça fait 200 ».

## Arrange, Act, Assert

Chaque test se lit en trois temps. **Arrange** prépare les objets. **Act** appelle la méthode, une seule. **Assert** vérifie. Mélanger les trois rend un échec illisible : on ne sait plus si la donnée de départ était fausse ou si le calcul l'est.

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

`[Fact]` marque la méthode comme un cas xUnit, sans paramètre. Le nom dit le scénario et le résultat attendu : `CalculerDevis`, 5 jours, 200. `40m` est un `decimal`. On n'utilise pas un `double` pour un prix : les arrondis binaires n'ont rien à faire dans un devis. `Assert.Equal` échoue si `total` n'est pas 200, et le rapport de test montre les deux valeurs.

On couvre trois familles. Le **nominal** est le cas ordinaire, celui de l'exemple. La **limite** est la frontière : durée 0, liste vide, référence `null`, premier jour encore valide. L'**exception** est le refus : la méthode doit lever, pas renvoyer un total absurde.

```csharp
[Fact]
public void CalculerDevis_DureeZero_LeveArgumentException()
{
    var service = new VehiculeService(new InMemoryVehiculeRepository());
    Assert.Throws<ArgumentException>(() => service.CalculerDevis(50m, 0));
}
```

`Assert.Throws` n'appelle pas la méthode tout de suite. Il reçoit une lambda, l'exécute, et échoue si `ArgumentException` n'est pas levée. Si la méthode renvoyait 0 sans protester, le test serait rouge. C'est le but.

## Ne pas tester le disque en même temps que le devis

`CalculerDevis` ne doit pas dépendre d'un CSV ou d'une base pour qu'on puisse le vérifier. On lui injecte un dépôt **en mémoire**. Le test reste rapide, il ne laisse pas de fichier, et un échec pointe le calcul, pas une ligne mal lue. C'est le rôle de l'interface vue dans le cours sur les contrats : `VehiculeService` reçoit un `IVehiculeRepository`, et le test fournit `InMemoryVehiculeRepository`.

Le projet de tests est un projet à part, xUnit ou NUnit. On y ajoute une référence vers le projet métier, pas l'inverse : le métier ne doit pas connaître ses tests. Une classe de tests par service, `VehiculeServiceTests`, `StatsServiceTests`. Les méthodes portent le cas dans leur nom. On lance la suite après chaque correction, pas seulement la veille du rendu.

## Exercices d'application

### Exercice 1
Écrire un test nominal `CalculerDevis` sur 3 jours.

### Exercice 2
Écrire un test limite sur durée invalide (`0` ou négatif).

### Exercice 3
Écrire un test d'exception métier sur prix journalier invalide.

### Exercice 4
Écrire 2 tests pour un service de statistiques (`moyenne` et `top 3`).

## TP guidé (1h)

1. Créer le projet de tests.
2. Ajouter `InMemoryVehiculeRepository`.
3. Écrire 6 à 10 tests couvrant :
   - calcul devis,
   - validation,
   - exceptions,
   - statistiques.
4. Exécuter la suite et corriger les échecs.

## Livrable attendu

- Projet de tests compilable.
- Au moins 6 tests passants.
- Présence des 3 catégories (nominal, limite, exception).
