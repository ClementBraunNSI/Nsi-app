---
title: 'LINQ et JSON en C#'
description: 'Cours détaillé sur les requêtes LINQ, la sérialisation JSON et la robustesse des traitements.'
level: '2'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
icon: "chart-column"
prerequisites:
  - introduction_poo
  - csharp_csv_bdd
audience: public
---

# LINQ et JSON en C#

Une flotte de véhicules tient en mémoire dans une liste. On veut ceux qui sont disponibles, les trois plus chers, le prix moyen, le regroupement par type. Une boucle `foreach` sait le faire, et elle mélange le parcours, le test et l'accumulation. **LINQ** décrit le résultat. La lecture dit *quoi*, le compilateur s'occupe du parcours.

L'autre moitié du chapitre est le **JSON**. La liste disparaît quand le processus s'arrête. Le JSON est le texte dans lequel on la sauvegarde, et le format que l'on échange avec une autre application. LINQ interroge. JSON persiste.

## Interroger la flotte

`flotte` est une liste de véhicules. Chaque méthode renvoie une nouvelle requête, ou une valeur. `ToList()` force le calcul et range le résultat dans une liste.

```csharp
var disponibles = flotte.Where(v => v.EstDisponible).ToList();
var top3 = flotte.OrderByDescending(v => v.PrixJournalier).Take(3).ToList();
var moyenne = flotte.Any() ? flotte.Average(v => v.PrixJournalier) : 0m;

var statsParType = flotte
    .GroupBy(v => v.Type)
    .Select(g => new { Type = g.Key, Nombre = g.Count(), PrixMoyen = g.Average(v => v.PrixJournalier) })
    .ToList();
```

`Where` filtre. Ici, on ne garde que les véhicules dont `EstDisponible` est vrai. `OrderByDescending` trie du plus grand prix au plus petit. `Take(3)` ne conserve que les trois premiers de ce tri : ce sont les trois plus chers, pas les trois premiers de la liste d'origine. L'ordre des appels compte. `Take` avant `OrderByDescending` prendrait trois véhicules au hasard de l'ordre actuel, puis les trierait.

`Any` répond s'il reste au moins un élément. On s'en sert avant `Average`, parce qu'une moyenne sur une collection vide lève une exception. Le ternaire renvoie `0m`, un décimal, quand la flotte est vide. `0` entier ne serait pas du même type que le prix.

`GroupBy` rassemble les véhicules qui ont le même `Type`. `Select` transforme chaque groupe en un objet anonyme : la clé du groupe, le nombre de véhicules, le prix moyen. `g.Key` est le type. `g` se parcourt comme la liste des véhicules de ce type.

Les méthodes à connaître sont `Where`, `Select`, `OrderBy`, `OrderByDescending`, `Take`, `FirstOrDefault`, `Any`, `Count`, `Average`, `GroupBy`. `FirstOrDefault` renvoie le premier élément qui convient, ou la valeur par défaut du type s'il n'y en a pas. Sur un type référence, cette valeur est `null`. On la teste avant de lire une propriété.

## Écrire et relire un fichier JSON

`System.Text.Json` transforme une liste d'objets en texte, et le texte en liste. `VehiculeDto` est l'objet tel qu'on accepte de le sauvegarder : les propriétés publiques, pas le service qui les calcule.

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

`WriteIndented` ajoute des retours à la ligne. Le fichier se relit à l'œil. Sans cette option, le JSON est correct, simplement compact. `Load` ne suppose pas que le fichier existe : au premier lancement, il renvoie une liste vide, et l'application démarre. `Deserialize` peut renvoyer `null`. L'opérateur `??` le remplace par une liste vide, pour que l'appelant ne teste pas `null` à chaque usage.

Trois cas font planter un chargement naïf. Le fichier absent : on l'a traité. Le JSON invalide, un fichier coupé, une accolade en trop : `Deserialize` lève. Il faut l'attraper, prévenir avec un message explicite, et renvoyer une liste vide plutôt que de laisser l'exception sortir jusqu'à l'interface. La collection vide devant `Average` : le test `Any` ci-dessous évite l'exception.

```csharp
decimal moyennePrix = flotte.Any() ? flotte.Average(v => v.PrixJournalier) : 0m;
```

Une boucle `foreach` qui accumule à la main reste lisible quand le calcul a beaucoup de cas particuliers. LINQ gagne dès que la phrase tient en une chaîne de méthodes. On réécrit, on compare, on garde la version qu'on relit sans se tromper.

## Exercices d'application

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

## TP guidé (1h)

1. Ajouter un service `StatsService` basé sur LINQ.
2. Ajouter `Save/Load` JSON sur l'inventaire.
3. Afficher 5 statistiques à l'écran.
4. Vérifier le comportement sur données vides.

## Livrable attendu

- Fichier JSON fonctionnel.
- 5 requêtes LINQ métier commentées.
- Gestion des cas limites sans crash.
