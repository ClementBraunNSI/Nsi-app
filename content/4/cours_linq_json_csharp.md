---
title: 'LINQ et JSON en C#'
description: 'Cours détaillé sur les requêtes LINQ, la sérialisation JSON et la robustesse des traitements.'
level: '2'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
icon: "📊"
prerequisites:
  - introduction_poo
  - csharp_csv_bdd
---

# LINQ et JSON en C#

## 1) Pourquoi LINQ et JSON ?

- **LINQ** : interroger/transformer des collections de façon lisible.
- **JSON** : sauvegarder et échanger les données d'une application.

## 2) LINQ essentiel

Soit une liste `flotte` de véhicules.

```csharp
var disponibles = flotte.Where(v => v.EstDisponible).ToList();
var top3 = flotte.OrderByDescending(v => v.PrixJournalier).Take(3).ToList();
var moyenne = flotte.Any() ? flotte.Average(v => v.PrixJournalier) : 0m;

var statsParType = flotte
    .GroupBy(v => v.Type)
    .Select(g => new { Type = g.Key, Nombre = g.Count(), PrixMoyen = g.Average(v => v.PrixJournalier) })
    .ToList();
```

Méthodes à maîtriser :
- `Where`, `Select`, `OrderBy`, `OrderByDescending`, `Take`, `FirstOrDefault`, `Any`, `Count`, `Average`, `GroupBy`.

## 3) JSON avec `System.Text.Json`

```csharp
using System.Text.Json;

public static class VehiculeStorage
{
    public static void Save(string path, List<VehiculeDto> vehicules)
    {
        var json = JsonSerializer.Serialize(vehicules, new JsonSerializerOptions { WriteIndented = true });
        File.WriteAllText(path, json);
    }

    public static List<VehiculeDto> Load(string path)
    {
        if (!File.Exists(path))
            return new List<VehiculeDto>();

        var json = File.ReadAllText(path);
        return JsonSerializer.Deserialize<List<VehiculeDto>>(json) ?? new List<VehiculeDto>();
    }
}
```

## 4) Gérer les erreurs utiles

Cas à traiter :
- fichier absent,
- JSON invalide,
- collection vide pour `Average`.

```csharp
decimal moyennePrix = flotte.Any() ? flotte.Average(v => v.PrixJournalier) : 0m;
```

## 5) Exercices d'application

### Exercice 1
Écrire 3 requêtes LINQ :
- véhicules disponibles,
- top 5 par prix,
- prix moyen par type.

### Exercice 2
Écrire `Save` et `Load` pour une liste `ClientDto` dans `clients.json`.

### Exercice 3
Gérer les erreurs de chargement JSON (retour liste vide + message explicite).

### Exercice 4
Transformer une boucle `foreach` existante en LINQ, puis comparer lisibilité.

## 6) TP guidé (1h)

1. Ajouter un service `StatsService` basé sur LINQ.
2. Ajouter `Save/Load` JSON sur l'inventaire.
3. Afficher 5 statistiques à l'écran.
4. Vérifier le comportement sur données vides.

## 7) Livrable attendu

- Fichier JSON fonctionnel.
- 5 requêtes LINQ métier commentées.
- Gestion des cas limites sans crash.
