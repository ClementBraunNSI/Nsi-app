---
title: 'Les tests unitaires en C#'
description: 'Cours détaillé sur la démarche AAA, les tests nominaux/limites/exceptions et l’isolation de la logique métier.'
level: '2'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
icon: "✅"
prerequisites:
  - introduction_poo
---

# Les tests unitaires en C#

## 1) Pourquoi tester ?

Les tests unitaires permettent de :
- sécuriser les évolutions,
- détecter les régressions,
- documenter le comportement attendu.

## 2) Structure AAA

Chaque test suit la logique :
- **Arrange** : préparer le contexte.
- **Act** : exécuter l'action testée.
- **Assert** : vérifier le résultat.

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

## 3) Types de tests à couvrir

- **Test nominal** : cas classique attendu.
- **Test limite** : valeur frontière (0, vide, null).
- **Test d'exception** : comportement en erreur.

```csharp
[Fact]
public void CalculerDevis_DureeZero_LeveArgumentException()
{
    var service = new VehiculeService(new InMemoryVehiculeRepository());
    Assert.Throws<ArgumentException>(() => service.CalculerDevis(50m, 0));
}
```

## 4) Isoler la logique métier

Pour tester vite et bien, éviter CSV/BDD réels :
- utiliser un repository mémoire (`InMemoryRepository`),
- injecter ce repository dans le service.

## 5) Organisation d'un projet de tests

1. Créer projet test (`xUnit` ou `NUnit`).
2. Ajouter la référence au projet métier.
3. Créer des classes de tests par service (`VehiculeServiceTests`, `StatsServiceTests`).
4. Nommer clairement les méthodes de test.

## 6) Exercices d'application

### Exercice 1
Écrire un test nominal `CalculerDevis` sur 3 jours.

### Exercice 2
Écrire un test limite sur durée invalide (`0` ou négatif).

### Exercice 3
Écrire un test d'exception métier sur prix journalier invalide.

### Exercice 4
Écrire 2 tests pour un service de statistiques (`moyenne` et `top 3`).

## 7) TP guidé (1h)

1. Créer le projet de tests.
2. Ajouter `InMemoryVehiculeRepository`.
3. Écrire 6 à 10 tests couvrant :
   - calcul devis,
   - validation,
   - exceptions,
   - statistiques.
4. Exécuter la suite et corriger les échecs.

## 8) Livrable attendu

- Projet de tests compilable.
- Au moins 6 tests passants.
- Présence des 3 catégories (nominal, limite, exception).
