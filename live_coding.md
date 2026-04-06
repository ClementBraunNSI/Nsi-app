# Tests de Live-Coding : Projet AutoRent

## 1. C# : Calcul du devis avec remise (Logique métier)
**Consigne :** "Écris une méthode `CalculerDevis(double prixJournalier, int nbJours)` qui retourne le coût total de la location. Si la location dépasse 7 jours, une remise de 10% doit s'appliquer sur le total."
* **Ce que ça évalue :** La logique conditionnelle basique (`if`), les mathématiques simples et la signature d'une méthode.
* **Attendu :** ```csharp
  public double CalculerDevis(double prixJournalier, int nbJours) {
      double total = prixJournalier * nbJours;
      if (nbJours > 7) {
          total = total * 0.90; // ou total -= total * 0.10;
      }
      return total;
  }
  ```

## 2. C# : Polymorphisme d'affichage (POO)
**Consigne :** "Dans la classe `Moto` qui hérite de `Vehicule`, écris la méthode `AfficherDetails()` en utilisant l'override. Elle doit afficher la plaque, la marque, et sa propriété spécifique : la cylindrée."
* **Ce que ça évalue :** La syntaxe de l'héritage (`override`), l'interpolation de chaînes (`$""`), et l'appel potentiel à `base.AfficherDetails()` (bonus s'ils y pensent).
* **Attendu :**
  ```csharp
  public override void AfficherDetails() {
      Console.WriteLine($"Moto {Marque} ({Immatriculation}) - Cylindrée : {Cylindree}cc");
  }
  ```

## 3. PHP : Attribution de l'icône (Logique Front)
**Consigne :** "Crée une petite fonction PHP `getIcone($type)` qui prend en paramètre le type de véhicule (ex: 'Voiture', 'Moto', 'CampingCar') et retourne l'emoji correspondant (🚗, 🏍️, 🚐). Si le type est inconnu, retourne un point d'interrogation (❓)."
* **Ce que ça évalue :** L'utilisation d'un `switch` ou de `if/elseif` en PHP, et la gestion d'un cas par défaut.
* **Attendu :**
  ```php
  function getIcone($type) {
      switch($type) {
          case 'Voiture': return '🚗';
          case 'Moto': return '🏍️';
          case 'CampingCar': return '🚐';
          default: return '❓';
      }
  }
  ```

## 4. C# : Instanciation depuis un tableau (Factory simplifiée)
**Consigne :** "Imagine que tu viens de lire une ligne du CSV et de faire un `.Split(';')`. Tu as un tableau de chaînes `string[] data`. Écris le bout de code (`if` ou `switch`) qui vérifie la première case (`data[0]`) et instancie soit une `Voiture`, soit une `Moto` dans une variable `Vehicule v`."
* **Ce que ça évalue :** L'accès aux tableaux, l'instanciation d'objets, et le polymorphisme (stocker une classe fille dans une variable de la classe mère).
* **Attendu :**
  ```csharp
  Vehicule v = null;
  if (data[0] == "Voiture") {
      v = new Voiture(); 
      // Bonus s'ils commencent à remplir des propriétés
  } else if (data[0] == "Moto") {
      v = new Moto();
  }
  ```

## 5. PHP : Formatage du prix en badge HTML
**Consigne :** "Tu as une variable `$prix = 35;` et une variable `$etat = 'Disponible';`. Écris le code HTML/PHP mélangé qui affiche ce prix dans une `div`. Si l'état est 'Disponible', la div doit avoir la classe CSS 'badge-success', sinon la classe 'badge-danger'."
* **Ce que ça évalue :** L'intégration de conditions PHP directement au sein du code HTML (templating basique).
* **Attendu :**
  ```php
  <?php $classeCss = ($etat == 'Disponible') ? 'badge-success' : 'badge-danger'; ?>
  <div class="<?php echo $classeCss; ?>">
      Prix : <?php echo $prix; ?> € / jour
  </div>
  ```

## 6. C# : Filtrage avec LINQ ou boucle foreach
**Consigne :** "Tu as une liste `List<Vehicule> parc`. Écris une méthode qui parcourt cette liste et retourne le nombre total de véhicules dont l'état est 'En maintenance'."
* **Ce que ça évalue :** Le parcours de collection (`foreach`) et le comptage avec condition, ou l'utilisation efficace de LINQ (`.Count()`).
* **Attendu (version foreach) :**
  ```csharp
  int compteur = 0;
  foreach(Vehicule v in parc) {
      if(v.Etat == "En maintenance") compteur++;
  }
  return compteur;
  ```
  *Attendu (version LINQ) :* ```csharp
  return parc.Count(v => v.Etat == "En maintenance");
  ```

## 7. C# : Sécurisation d'une propriété (Encapsulation)
**Consigne :** "Dans la classe `Vehicule`, écris la propriété `Prix` complète (avec get et set). Dans le `set`, ajoute une vérification : si la valeur qu'on essaie de lui donner est négative, le prix doit être forcé à 0."
* **Ce que ça évalue :** La compréhension des accesseurs/mutateurs (`get` / `set`) et la protection des données internes d'une classe.
* **Attendu :**
  ```csharp
  private double prix;
  public double Prix {
      get { return prix; }
      set { 
          if (value < 0) { prix = 0; } 
          else { prix = value; } 
      }
  }
  ```