---
title: "C# et les Données : Fichiers CSV et Bases de Données"
description: "Apprendre à persister des données en C# : du fichier CSV simple à la base de données MariaDB."
level: "2"
chapter: "BTS SIO 1 : B2 - Développement (SLAM)"
icon: "💾"
---

# 💾 Persistance des Données en C#

Dans ce cours, nous allons voir comment **sauvegarder** et **lire** des données pour qu'elles ne soient pas perdues à la fermeture de l'application.

Nous aborderons deux méthodes :
1.  **Fichiers CSV** : Simple, rapide, lisible par Excel.
2.  **Base de Données (MariaDB/MySQL)** : Robuste, sécurisé, multi-utilisateurs.

---

## 📄 Partie 1 : Gestion des Fichiers CSV

Le format CSV (*Comma-Separated Values*) est un format texte où les données sont séparées par des points-virgules (`;`) ou des virgules (`,`).

Exemple de fichier `clients.csv` :
```csv
Id;Nom;Email
1;Dupont;alice@email.com
2;Martin;bob@email.com
```

### 1. Lire un fichier CSV

Pour lire un fichier, on utilise la classe `StreamReader` (dans `System.IO`).

```csharp
using System;
using System.IO;
using System.Collections.Generic;

public class Client
{
    public int Id { get; set; }
    public string Nom { get; set; }
    public string Email { get; set; }
}

public class CsvManager
{
    public List<Client> LireClients(string cheminFichier)
    {
        List<Client> liste = new List<Client>();

        try
        {
            // Vérifier si le fichier existe
            if (!File.Exists(cheminFichier))
            {
                Console.WriteLine("Erreur : Fichier introuvable.");
                return liste;
            }

            // Ouverture du fichier en lecture
            using (StreamReader sr = new StreamReader(cheminFichier))
            {
                string ligne;
                // On saute l'en-tête (première ligne)
                sr.ReadLine(); 

                // On lit ligne par ligne jusqu'à la fin
                while ((ligne = sr.ReadLine()) != null)
                {
                    string[] colonnes = ligne.Split(';'); // Découpage

                    if (colonnes.Length >= 3)
                    {
                        Client c = new Client();
                        c.Id = int.Parse(colonnes[0]);
                        c.Nom = colonnes[1];
                        c.Email = colonnes[2];
                        
                        liste.Add(c);
                    }
                }
            }
        }
        catch (Exception e)
        {
            Console.WriteLine("Erreur de lecture : " + e.Message);
        }

        return liste;
    }
}
```

### 2. Écrire dans un fichier CSV

Pour écrire, on utilise `StreamWriter`.

```csharp
public void EcrireClient(string cheminFichier, Client nouveauClient)
{
    try
    {
        // Le paramètre 'true' signifie qu'on AJOUTE à la fin (Append)
        // Si on met 'false', on écrase tout le fichier !
        using (StreamWriter sw = new StreamWriter(cheminFichier, true))
        {
            // On formate la ligne avec des points-virgules
            string ligne = $"{nouveauClient.Id};{nouveauClient.Nom};{nouveauClient.Email}";
            sw.WriteLine(ligne);
        }
        Console.WriteLine("Sauvegarde réussie !");
    }
    catch (Exception e)
    {
        Console.WriteLine("Erreur d'écriture : " + e.Message);
    }
}
```

---

## 🐬 Partie 2 : Connexion à une Base de Données (MariaDB / MySQL)

Pour relier une application C# à une vraie base de données, on utilise généralement **ADO.NET** avec une librairie spécifique comme `MySqlConnector`.

### Pré-requis

1.  Avoir un serveur MariaDB/MySQL lancé (ex: WAMP, XAMPP, ou Docker).
2.  Installer le package NuGet : **`MySql.Data`** ou **`MySqlConnector`**.

### 1. La Chaîne de Connexion (ConnectionString)

C'est la phrase magique qui permet de trouver la base de données.

```csharp
string connectionString = "Server=localhost;Database=ma_boutique;User=root;Password=;";
```

### 2. Lire des données (SELECT)

```csharp
using MySql.Data.MySqlClient; // Nécessite le package NuGet

public void LireClientsDeLaBase()
{
    string connectionString = "Server=localhost;Database=ma_boutique;User=root;Password=;";

    // On crée la connexion
    using (MySqlConnection conn = new MySqlConnection(connectionString))
    {
        try
        {
            conn.Open(); // On ouvre la porte
            Console.WriteLine("Connexion réussie !");

            string sql = "SELECT id, nom, email FROM clients";
            
            // On prépare la commande
            using (MySqlCommand cmd = new MySqlCommand(sql, conn))
            {
                // On exécute et on récupère un "Reader" (curseur)
                using (MySqlDataReader reader = cmd.ExecuteReader())
                {
                    // On boucle tant qu'il y a des lignes
                    while (reader.Read())
                    {
                        int id = reader.GetInt32("id"); // ou reader.GetInt32(0)
                        string nom = reader.GetString("nom");
                        string email = reader.GetString("email");

                        Console.WriteLine($"Client {id} : {nom} ({email})");
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Erreur SQL : " + ex.Message);
        }
    } // Ici, la connexion se ferme automatiquement grâce au 'using'
}
```

### 3. Écrire des données (INSERT) avec Paramètres

⚠️ **Attention aux Injections SQL !** Ne concaténez jamais des chaînes directement (`"VALUES ('" + nom + "')"`). Utilisez toujours des **paramètres**.

```csharp
public void AjouterClient(string nom, string email)
{
    string connectionString = "Server=localhost;Database=ma_boutique;User=root;Password=;";

    using (MySqlConnection conn = new MySqlConnection(connectionString))
    {
        try
        {
            conn.Open();

            // Requête paramétrée avec @nom et @email
            string sql = "INSERT INTO clients (nom, email) VALUES (@nom, @email)";

            using (MySqlCommand cmd = new MySqlCommand(sql, conn))
            {
                // On remplace les paramètres par les vraies valeurs (sécurisé)
                cmd.Parameters.AddWithValue("@nom", nom);
                cmd.Parameters.AddWithValue("@email", email);

                // ExecuteNonQuery() pour INSERT, UPDATE, DELETE
                int lignesAffectees = cmd.ExecuteNonQuery();
                
                Console.WriteLine($"{lignesAffectees} client ajouté.");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("Erreur d'ajout : " + ex.Message);
        }
    }
}
```

### 4. Résumé des objets ADO.NET

| Objet | Rôle |
| :--- | :--- |
| `MySqlConnection` | Établit le tuyau vers la base de données. |
| `MySqlCommand` | Transporte la requête SQL (SELECT, INSERT...). |
| `MySqlDataReader` | Permet de lire les résultats ligne par ligne (lecture seule, rapide). |
| `ExecuteReader()` | Pour les `SELECT`. |
| `ExecuteNonQuery()` | Pour les `INSERT`, `UPDATE`, `DELETE` (retourne le nombre de lignes modifiées). |
| `ExecuteScalar()` | Pour récupérer une seule valeur (ex: `SELECT COUNT(*)`). |

---

## 🛠️ Exercice Pratique

1.  Créez une base de données `gestion_stock` avec une table `produits (id, nom, prix)`.
2.  Créez une application console C#.
3.  Codez une méthode `ImporterCSV()` qui lit un fichier `produits.csv` et insère chaque produit dans la base de données MariaDB.
