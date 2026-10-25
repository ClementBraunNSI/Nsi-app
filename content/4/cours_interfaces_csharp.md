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

Une classe mélange souvent deux choses : le geste métier, « enregistrer ce véhicule », et le détail technique, « l'écrire dans un CSV » ou « l'écrire dans SQL ». Le jour où le stockage change, tout le service est à rouvrir. Une **interface** sépare les deux. Elle décrit un **contrat** : les méthodes qu'une classe devra fournir, sans une ligne de leur corps. Le service dépend du contrat. L'implémentation se branche derrière.

On y gagne trois fois. Le service n'est plus couplé à un fichier ou à une base. Les tests peuvent fournir une fausse implémentation, en mémoire, sans disque. Et l'on peut remplacer le CSV par SQL sans réécrire la logique qui liste ou qui supprime.

## Écrire le contrat, puis une classe qui le tient

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

`GetByImmat` renvoie `Vehicule?` : un véhicule, ou `null` si l'immatriculation est inconnue. Le contrat le dit. Chaque classe qui prétend être un dépôt de véhicules doit offrir ces quatre méthodes. Le compilateur refuse une implémentation incomplète.

```csharp
public class CsvVehiculeRepository : IVehiculeRepository
{
    public List<Vehicule> GetAll() => new List<Vehicule>();
    public Vehicule? GetByImmat(string immat) => null;
    public void Save(Vehicule vehicule) { }
    public void Delete(string immat) { }
}
```

`: IVehiculeRepository` est la promesse. Les corps, ici, sont vides : ils montrent la forme. Un vrai dépôt CSV lirait le fichier dans `GetAll` et l'écrirait dans `Save`.

Une **classe abstraite** n'est pas la même chose. Elle peut porter des propriétés, un début de comportement, et laisser quelques méthodes abstraites aux filles. On s'en sert quand plusieurs classes partagent déjà du code. L'interface, elle, ne partage que des signatures. Une classe peut implémenter plusieurs interfaces. Elle ne peut hériter que d'une classe.

## Recevoir le contrat, pas la classe concrète

L'**injection par le constructeur** donne au service son dépôt de l'extérieur. Le service ne fait pas `new CsvVehiculeRepository()`. Il reçoit un `IVehiculeRepository`, et il l'utilise.

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

`readonly` empêche de remplacer le dépôt après la construction. `Lister` ne sait pas s'il parle à un CSV, à SQL, ou à une liste en mémoire. On écrit `new VehiculeService(new CsvVehiculeRepository())` au démarrage de l'application, ou `new VehiculeService(new InMemoryVehiculeRepository())` dans un test. Le service ne change pas.

On range souvent le projet en trois couches. Le **domaine** contient les classes métier, `Vehicule`, `Client`. Les **services** contiennent la logique : calculer un devis, lister, valider. L'**infrastructure** contient l'accès aux données : CSV, SQL, fichiers JSON. Les interfaces vivent du côté de ce que le service a le droit de demander. Les classes concrètes vivent dans l'infrastructure. La flèche de dépendance va vers le contrat, pas vers le fichier.

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
