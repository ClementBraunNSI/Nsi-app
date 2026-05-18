---
title: 'DS : Gestion d''un refuge animalier (C# / POO)'
description: 'Devoir surveillé de 2h — application console C# (encapsulation, héritage, polymorphisme).'
level: '4'
chapter: BTS SIO 1 SLAM
icon: "\U0001F43A"
prerequisites:
  - introduction_poo
  - exercices_poo
---

# DS Pratique — Refuge animalier « La Tanière du Renard »

**Durée :** 2 heures  
**Matériel autorisé :** cours, documentation C# (papier ou en ligne), notes personnelles  
**Matériel interdit :** intelligence artificielle, code généré automatiquement, communication entre candidats  

**Compétences évaluées (référentiel SLAM) :**
- Concevoir une solution applicative structurée en POO
- Implémenter une logique métier en C#
- Utiliser encapsulation, héritage et polymorphisme

---

## 1) Contexte

Le refuge associatif **« La Tanière du Renard »** accueille des animaux en attente d'adoption. Chaque animal possède des informations communes (identifiant, nom, âge, état de santé) et des caractéristiques propres à son espèce.

Le refuge souhaite une **application console C#** permettant au responsable de :
- enregistrer les animaux du refuge ;
- consulter les fiches ;
- filtrer les animaux adoptables ;
- calculer une estimation des coûts mensuels d'entretien.

---

## 2) Cahier des charges fonctionnel

### A. Modèle métier (POO)

L'application doit modéliser **trois types d'animaux** à partir d'une entité générale `ANIMAL`, puis de trois spécialisations.

**Schéma relationnel à respecter :**

```text
ANIMAL (Id, Nom, Age, Etat)
  • Id : entier, clé primaire
  • Nom : texte, non vide
  • Age : entier strictement positif
  • Etat : {Disponible, EnSoin, Adopte}

CHIEN (IdAnimal, Race, EstEducateur)
  • IdAnimal : entier, clé primaire, clé étrangère → ANIMAL(Id)
  • Race : texte
  • EstEducateur : booléen

CHAT (IdAnimal, Pelage, EstSterilise)
  • IdAnimal : entier, clé primaire, clé étrangère → ANIMAL(Id)
  • Pelage : texte
  • EstSterilise : booléen

NAC (IdAnimal, Espece, DureeVieMoyenne)
  • IdAnimal : entier, clé primaire, clé étrangère → ANIMAL(Id)
  • Espece : texte
  • DureeVieMoyenne : entier (en années), strictement positif
```

> **Traduction attendue en C# :** ce schéma relationnel doit être implémenté par une hiérarchie de classes :
> - classe mère `Animal` pour l'entité `ANIMAL` ;
> - classes filles `Chien`, `Chat`, `Nac` pour les spécialisations.
>
> Les méthodes métier ne figurent pas dans le schéma relationnel, mais doivent être codées dans les classes (voir ci-dessous).

**Architecture C# attendue :**

| Classe | Rôle |
|---|---|
| `Animal` (+ `Chien`, `Chat`, `Nac`) | Modéliser **un** animal et son comportement propre |
| `Refuge` | Gérer **l'ensemble** des animaux du refuge (la `List<Animal>` est ici) |
| `Program` | Afficher le menu console et appeler les méthodes de `Refuge` |

**Méthodes à implémenter dans `Animal` (et redéfinir si nécessaire dans les classes filles) :**

| Méthode | Description |
|---|---|
| `virtual void AfficherFiche()` | Affiche la fiche complète de l'animal |
| `virtual double CalculerCoutMensuel()` | Calcule le coût mensuel estimé |
| `virtual string ObtenirType()` | Retourne `"Chien"`, `"Chat"`, `"Nac"` ou `"Animal"` |
| `bool EstAdoptable()` | Retourne `true` si `Etat == Disponible` |
| `void ChangerEtat(string nouvelEtat)` | Modifie l'état avec contrôle (`Disponible`, `EnSoin`, `Adopte`) |

**Méthodes à implémenter dans la classe `Refuge` :**

| Attribut | Description |
|---|---|
| `public List<Animal> _animaux` | Liste polymorphique de tous les animaux du refuge |

| Méthode | Description |
|---|---|
| `void AjouterAnimal(Animal animal)` | Ajoute un animal si l'identifiant n'existe pas déjà |
| `void AfficherTous()` | Affiche toutes les fiches (en parcourant `_animaux`) |
| `void AfficherAdoptables()` | Affiche uniquement les animaux avec `EstAdoptable() == true` |
| `Animal RechercherParId(int id)` | Retourne l'animal trouvé, ou `null` si absent |
| `double CalculerCoutMensuelTotal()` | Somme des `CalculerCoutMensuel()` de tous les animaux |
| `int CompterParType(string type)` | Compte les animaux d'un type donné (via `ObtenirType()`) |
| `int CompterTotal()` | Retourne le nombre total d'animaux |
| `bool IdExiste(int id)` | Vérifie si un identifiant est déjà utilisé |

**Contraintes POO obligatoires :**

1. **Encapsulation**
   - Les attributs doivent être **privés** (ou protégés si justifié).
   - L'accès se fait via des **propriétés** avec validation :
     - `Age` > 0
     - `Nom` non vide
     - `Id` > 0

2. **Héritage**
   - `Chien`, `Chat` et `Nac` **héritent** de `Animal`.
   - Factoriser tout ce qui est commun dans `Animal`.

3. **Polymorphisme**
   - `AfficherFiche()`, `CalculerCoutMensuel()` et `ObtenirType()` sont **virtuelles** dans `Animal`.
   - Chaque classe fille **redéfinit** (`override`) ces méthodes avec un comportement spécifique.
   - Les animaux sont stockés dans une **`List<Animal>`** au sein de la classe **`Refuge`** (attribut privé `_animaux`).

**Tarification indicative (à respecter) :**

| Type | Coût mensuel de base |
|---|---|
| `Animal` (cas générique) | 40 € |
| `Chien` | 55 € (+ 15 € si non éducateur) |
| `Chat` | 45 € (+ 10 € si non stérilisé) |
| `Nac` | 30 € (+ 0,5 € × `DureeVieMoyenne`) |

### B. Gestion du refuge (logique métier)

L'application doit permettre :

1. **Ajouter un animal** (choix du type : Chien / Chat / Nac, puis saisie des informations).
2. **Afficher tous les animaux** (triés par type, puis par nom).
3. **Afficher les animaux adoptables**.
4. **Rechercher un animal par identifiant**.
5. **Afficher les statistiques** :
   - nombre total d'animaux ;
   - nombre par type ;
   - coût mensuel total estimé du refuge (somme des `CalculerCoutMensuel()`).
6. **Quitter** l'application.

### C. Robustesse

- Le menu ne doit **pas planter** en cas de saisie invalide.
- Les erreurs de saisie doivent afficher un message explicite et revenir au menu.
- Une tentative d'ajout avec des données invalides doit être refusée.

---

## 3) Fonctionnement attendu de l'application console

Scénario type :

```text
=== REFUGE : La Tanière du Renard ===
1. Ajouter un animal
2. Afficher tous les animaux
3. Afficher les animaux adoptables
4. Rechercher par identifiant
5. Afficher les statistiques
0. Quitter
Votre choix : 1

Type d'animal (1=Chien, 2=Chat, 3=Nac) : 1
Id : 101
Nom : Rusty
Age : 4
Race : Border Collie
Est éducateur ? (o/n) : o

Animal ajouté avec succès.
```

Exemple d'affichage polymorphe :

```text
[CHIEN] #101 - Rusty (4 ans) - Disponible
Race : Border Collie | Educateur : Oui
Cout mensuel estime : 55,00 EUR
```

---

## 4) Déroulement du DS (2 heures)

### Partie 1 — Analyse et conception (25 min, sur papier)

1. Donner le diagramme de classe du sujet (tables, clés primaires, clés étrangères, cardinalités). Indiquer clairement le lien entre `ANIMAL` et chaque spécialisation (`CHIEN`, `CHAT`, `NAC`).
2. Répondre brièvement (5 lignes max par question) :
   - Qu'est-ce que l'**encapsulation** ? Donner un exemple lié au refuge.
   - Pourquoi utiliser une `List<Animal>` plutôt que trois listes séparées ?
   - À quoi servent `virtual` et `override` dans ce sujet ?

### Partie 2 — Développement C# (1 h 35)

**Travail à réaliser :**

1. Créer un projet Console C# (`RefugeTaniere`).
2. Implémenter la hiérarchie `Animal` → `Chien`, `Chat`, `Nac`.
3. Implémenter la classe `Refuge` avec la `List<Animal>` et les méthodes de gestion.
4. Implémenter le menu dans `Program` en s'appuyant sur un objet `Refuge`.
5. Initialiser le refuge avec **au moins 4 animaux de types différents** (saisie au démarrage ou données de test dans le code).
6. Tester au minimum les cas suivants :
   - affichage global ;
   - filtre adoptables ;
   - recherche par id existant / inexistant ;
   - statistiques avec coût total.

> **Conseil temps :**  
> - 35 min : classes + encapsulation  
> - 35 min : héritage + polymorphisme  
> - 25 min : menu + tests  

---

## 5) Livrables attendus

À rendre en fin de DS :

1. **Feuille de conception** (schéma relationnel + réponses Partie 1)
2. **Projet C# complet** (au minimum les fichiers `.cs` principaux)
3. **Captures console** ou copie des sorties de test (3 exécutions minimum)

---

## 6) Données de test fournies

Les données suivantes peuvent être préchargées dans le programme pour faciliter les tests :

| Type | Id | Nom | Age | Etat | Spécificités |
|---|---:|---|---:|---|---|
| Chien | 101 | Rusty | 4 | Disponible | Border Collie, éducateur |
| Chat | 102 | Mimi | 2 | EnSoin | Poil long, stérilisée |
| Nac | 103 | Crackers | 1 | Disponible | Hamster, 3 ans |
| Chien | 104 | Rex | 8 | Adopte | Berger, non éducateur |
