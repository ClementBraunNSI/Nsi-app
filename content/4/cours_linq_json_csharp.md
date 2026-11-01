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

Une flotte de véhicules est stockée en mémoire dans une liste. On veut obtenir les véhicules disponibles, les trois plus chers, le prix moyen ou un regroupement par type. Une boucle `foreach` peut le faire, mais elle mélange le parcours, les tests et l'accumulation des résultats. **LINQ** permet au contraire de décrire directement le résultat voulu : le code indique *ce que* l'on cherche, et le compilateur se charge du parcours.

La seconde partie du chapitre porte sur le **JSON**. Une liste en mémoire disparaît quand le programme s'arrête. Le JSON est un format texte qui permet de la sauvegarder dans un fichier, ou de l'échanger avec une autre application. LINQ sert donc à interroger les données, et JSON à les conserver.

## Interroger une liste avec LINQ

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

`Where` filtre les éléments : ici, il ne garde que les véhicules dont `EstDisponible` est vrai. `OrderByDescending` trie du prix le plus élevé au plus faible, et `Take(3)` ne garde que les trois premiers de ce tri, c'est-à-dire les trois plus chers, et non les trois premiers de la liste d'origine. L'ordre des appels compte : placer `Take` avant `OrderByDescending` prendrait les trois premiers véhicules dans l'ordre actuel de la liste, puis les trierait.

`Any` indique s'il reste au moins un élément. On l'utilise avant `Average`, car une moyenne sur une collection vide lève une exception. L'opérateur ternaire renvoie alors `0m`, un décimal, quand la flotte est vide : l'entier `0` ne serait pas du même type que le prix.

`GroupBy` rassemble les véhicules qui ont le même `Type`. `Select` transforme chaque groupe en un objet anonyme qui contient la clé du groupe, le nombre de véhicules et le prix moyen. `g.Key` correspond au type, et `g` se parcourt comme la liste des véhicules de ce type.

Les méthodes à connaître sont `Where`, `Select`, `OrderBy`, `OrderByDescending`, `Take`, `FirstOrDefault`, `Any`, `Count`, `Average`, `GroupBy`. `FirstOrDefault` renvoie le premier élément qui convient, ou la valeur par défaut du type s'il n'y en a pas. Pour un type référence, cette valeur est `null`, et il faut donc la tester avant de lire une propriété.

## Écrire et relire un fichier JSON

`System.Text.Json` transforme une liste d'objets en texte, et le texte en liste. `VehiculeDto` représente l'objet tel qu'on le sauvegarde : il ne contient que les propriétés publiques, et non le service qui les calcule.

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

`WriteIndented` ajoute des retours à la ligne pour que le fichier soit facile à relire. Sans cette option, le JSON reste correct, mais il est compact. `Load` ne suppose pas que le fichier existe : au premier lancement, il renvoie une liste vide, et l'application démarre normalement. Comme `Deserialize` peut renvoyer `null`, l'opérateur `??` remplace ce résultat par une liste vide, ce qui évite de tester `null` à chaque utilisation.

Trois situations peuvent faire échouer un chargement écrit sans précaution. La première, le fichier absent, vient d'être traitée. La deuxième est un JSON invalide, par exemple un fichier tronqué ou une accolade en trop : `Deserialize` lève alors une exception, qu'il faut rattraper pour afficher un message explicite et renvoyer une liste vide, au lieu de laisser l'erreur remonter jusqu'à l'interface. La troisième est une collection vide passée à `Average`, que le test `Any` ci-dessous permet d'éviter.

```csharp
decimal moyennePrix = flotte.Any() ? flotte.Average(v => v.PrixJournalier) : 0m;
```

Une boucle `foreach` reste plus lisible quand le calcul comporte beaucoup de cas particuliers. LINQ est préférable dès que le traitement s'exprime simplement par une suite de méthodes. Le mieux est d'essayer les deux versions et de garder celle qui se relit le plus facilement.

## Exercices d'application

### Exercice 1
Écrire 3 requêtes LINQ :
- les véhicules disponibles ;
- les 5 véhicules les plus chers ;
- le prix moyen par type.

### Exercice 2
Écrire `Save` et `Load` pour une liste `ClientDto` dans `clients.json`.

### Exercice 3
Gérer les erreurs de chargement JSON (renvoyer une liste vide et afficher un message explicite).

### Exercice 4
Transformer une boucle `foreach` existante en LINQ, puis comparer la lisibilité des deux versions.

## TP guidé (1h)

1. Ajouter un service `StatsService` basé sur LINQ.
2. Ajouter `Save/Load` JSON sur l'inventaire.
3. Afficher 5 statistiques à l'écran.
4. Vérifier le comportement sur données vides.

## Livrable attendu

- Fichier JSON fonctionnel.
- 5 requêtes LINQ métier commentées.
- Gestion des cas limites sans crash.
