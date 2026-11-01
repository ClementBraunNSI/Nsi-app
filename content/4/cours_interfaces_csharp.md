---
title: 'Les interfaces en C#'
description: 'Cours détaillé sur les interfaces, l''injection de dépendances et l''architecture en couches.'
level: '2'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
icon: "puzzle"
prerequisites:
  - introduction_poo
  - cours_heritage_csharp
audience: public
---

# Les interfaces en C#

Une classe mélange souvent deux choses : l'action métier, comme enregistrer un véhicule, et le détail technique, comme l'écrire dans un fichier CSV ou dans une base SQL. Si le mode de stockage change, il faut alors modifier tout le service. Une **interface** permet de séparer ces deux aspects. Elle décrit un **contrat**, c'est-à-dire la liste des méthodes qu'une classe devra fournir, sans écrire leur code. Le service dépend seulement de ce contrat, et l'implémentation concrète vient s'y brancher.

Cette séparation a trois avantages. Le service ne dépend plus d'un fichier ou d'une base. Les tests peuvent lui fournir une fausse implémentation, qui garde les données en mémoire sans utiliser le disque. Enfin, on peut remplacer le CSV par SQL sans réécrire la logique qui liste ou supprime les véhicules.

## Écrire une interface et l'implémenter

`interface` déclare les signatures. Elle ne contient ni champs métier ni constructeur qui rangerait un état. Par convention, le nom commence par `I`.

```csharp
public interface IVehiculeRepository
{
    List<Vehicule> GetAll();
    Vehicule? GetByImmat(string immat);
    void Save(Vehicule vehicule);
    void Delete(string immat);
}
```

`GetByImmat` renvoie `Vehicule?`, c'est-à-dire un véhicule, ou `null` si l'immatriculation est inconnue : le contrat l'indique explicitement. Toute classe qui implémente ce dépôt de véhicules doit fournir ces quatre méthodes, et le compilateur refuse une implémentation incomplète.

```csharp
public class CsvVehiculeRepository : IVehiculeRepository
{
    public List<Vehicule> GetAll() => new List<Vehicule>();
    public Vehicule? GetByImmat(string immat) => null;
    public void Save(Vehicule vehicule) { }
    public void Delete(string immat) { }
}
```

`: IVehiculeRepository` indique que la classe respecte le contrat. Ici, les corps des méthodes sont vides, car l'exemple ne montre que leur forme. Un vrai dépôt CSV lirait le fichier dans `GetAll` et l'écrirait dans `Save`.

Une **classe abstraite** est une notion différente. Elle peut contenir des propriétés et une partie du comportement, en laissant quelques méthodes abstraites à définir dans les classes filles. On l'utilise quand plusieurs classes partagent déjà du code. Une interface, elle, ne contient que des signatures. Enfin, une classe peut implémenter plusieurs interfaces, mais elle ne peut hériter que d'une seule classe.

## L'injection de dépendances

L'**injection par le constructeur** consiste à fournir le dépôt au service depuis l'extérieur. Le service ne crée pas lui-même un `new CsvVehiculeRepository()` : il reçoit un `IVehiculeRepository` et l'utilise.

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

`readonly` empêche de remplacer le dépôt après la construction. `Lister` ne sait pas s'il utilise un fichier CSV, une base SQL ou une liste en mémoire. On écrit `new VehiculeService(new CsvVehiculeRepository())` au démarrage de l'application, ou `new VehiculeService(new InMemoryVehiculeRepository())` dans un test, sans modifier le service.

On organise souvent le projet en trois couches. Le **domaine** contient les classes métier, comme `Vehicule` ou `Client`. Les **services** contiennent la logique, par exemple le calcul d'un devis, l'affichage d'une liste ou la validation des données. L'**infrastructure** gère l'accès aux données, en CSV, en SQL ou en JSON. Les interfaces sont placées du côté des services, qui les utilisent, alors que les classes concrètes sont placées dans l'infrastructure. Le service dépend ainsi du contrat, et non du fichier.

## Exercices d'application

### Exercice 1
Écrire une interface `IClientRepository` avec 4 méthodes CRUD.

### Exercice 2
Implémenter `IClientRepository` dans une classe `InMemoryClientRepository`.

### Exercice 3
Créer un `ClientService` injecté avec `IClientRepository`.

### Exercice 4
Remplacer l'implémentation `InMemory` par une implémentation `Csv` sans modifier le service.

## TP guidé (1h)

1. Créer `IVehiculeRepository`.
2. Créer `CsvVehiculeRepository`.
3. Créer `InMemoryVehiculeRepository`.
4. Injecter le repository dans `VehiculeService`.
5. Vérifier que le code fonctionne avec les 2 implémentations.

## Livrable attendu

- Projet compilable.
- Séparation claire `Domain / Services / Infrastructure`.
- Exemple d'injection fonctionnel.
