---
title: 'Les interfaces en C#'
description: 'Cours détaillé sur les interfaces, l’injection de dépendances et l’architecture en couches.'
level: '2'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
icon: "🧩"
prerequisites:
  - introduction_poo
  - cours_heritage_csharp
---

# Les interfaces en C#

## 1) Pourquoi utiliser des interfaces ?

Une interface décrit un **contrat** : elle indique ce qu'une classe doit proposer, sans imposer l'implémentation.

Objectifs :
- réduire le couplage,
- faciliter les tests,
- faciliter l'évolution du code.

## 2) Syntaxe et principes

```csharp
public interface IVehiculeRepository
{
    List<Vehicule> GetAll();
    Vehicule? GetByImmat(string immat);
    void Save(Vehicule vehicule);
    void Delete(string immat);
}
```

Une classe implémente ensuite ce contrat :

```csharp
public class CsvVehiculeRepository : IVehiculeRepository
{
    public List<Vehicule> GetAll() => new List<Vehicule>();
    public Vehicule? GetByImmat(string immat) => null;
    public void Save(Vehicule vehicule) { }
    public void Delete(string immat) { }
}
```

## 3) Interface vs classe abstraite

- **Interface** : contrat pur, pas d'état métier.
- **Classe abstraite** : base partagée avec attributs/propriétés et comportement partiel.

## 4) Injection de dépendance (constructeur)

```csharp
public class VehiculeService
{
    private readonly IVehiculeRepository _repository;

    public VehiculeService(IVehiculeRepository repository)
    {
        _repository = repository;
    }

    public List<Vehicule> Lister() => _repository.GetAll();
}
```

Avec cette approche, on peut remplacer l'implémentation (`Csv`, `Sql`, `InMemory`) sans toucher au service.

## 5) Mini architecture recommandée

- `Domain` : classes métier.
- `Services` : logique applicative.
- `Infrastructure` : accès données.

## 6) Exercices d'application

### Exercice 1
Écrire une interface `IClientRepository` avec 4 méthodes CRUD.

### Exercice 2
Implémenter `IClientRepository` dans une classe `InMemoryClientRepository`.

### Exercice 3
Créer un `ClientService` injecté avec `IClientRepository`.

### Exercice 4
Remplacer l'implémentation `InMemory` par une implémentation `Csv` sans modifier le service.

## 7) TP guidé (1h)

1. Créer `IVehiculeRepository`.
2. Créer `CsvVehiculeRepository`.
3. Créer `InMemoryVehiculeRepository`.
4. Injecter le repository dans `VehiculeService`.
5. Vérifier que le code fonctionne avec les 2 implémentations.

## 8) Livrable attendu

- Projet compilable.
- Séparation claire `Domain / Services / Infrastructure`.
- Exemple d'injection fonctionnel.
