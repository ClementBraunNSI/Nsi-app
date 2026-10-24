---
title: 'C# et les Données : Fichiers CSV et Bases de Données'
description: >-
  Apprendre à persister des données en C# : du fichier CSV simple à la base de
  données MariaDB.
level: '2'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
icon: "\U0001F4BE"
prerequisites: []
audience: public
---

# Persistance des données en C#

Une liste de clients créée dans `Main` disparaît quand la console se ferme. **Persister**, c'est écrire ces données quelque part où elles survivent au programme, puis les relire au démarrage suivant. Deux endroits suffisent pour commencer. Le **fichier CSV** est un texte, simple, ouvrable dans Excel, adapté à un seul utilisateur et à un petit volume. La **base MariaDB ou MySQL** tient plusieurs utilisateurs, des requêtes, et des règles d'intégrité. On commence par le fichier, parce qu'on y voit chaque ligne. On passe à la base quand le fichier ne suffit plus.

## Lire et écrire un CSV

CSV veut dire *Comma-Separated Values*. En pratique française, le séparateur est souvent le point-virgule, parce que la virgule sert déjà aux décimaux. Chaque ligne est un enregistrement. La première ligne nomme les colonnes.

```csv
Id;Nom;Email
1;Dupont;alice@email.com
2;Martin;bob@email.com
```

Pour lire, on ouvre un `StreamReader` (`System.IO`). On vérifie que le fichier existe, on saute l'en-tête, puis on découpe chaque ligne avec `Split(';')`. Trois colonnes donnent un `Client`. Moins de trois, on ignore la ligne : un fichier abîmé ne doit pas faire planter toute la lecture.

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

`using` ferme le fichier à la sortie du bloc, même si une exception survient. `int.Parse` échoue si la première colonne n'est pas un entier : le `catch` affiche le message au lieu de laisser le programme mourir en silence.

Pour ajouter un client, `StreamWriter` ouvre le même fichier. Le deuxième argument `true` veut dire **ajouter** à la fin. `false` efface tout le fichier avant d'écrire. C'est l'erreur classique : on croit ajouter une ligne, on ne garde que la dernière.

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

Le CSV a une limite simple. Deux programmes qui écrivent en même temps se marchent dessus. Une recherche « tous les clients dont le nom commence par D » relit le fichier entier. Dès que plusieurs personnes doivent travailler sur les mêmes données, on passe à une base.

## Se connecter à MariaDB ou MySQL

Le pont entre C# et la base s'appelle **ADO.NET**. Pour MariaDB ou MySQL, on ajoute le paquet NuGet `MySql.Data` ou `MySqlConnector`. Le serveur doit déjà tourner : WAMP, XAMPP, ou un conteneur Docker.

La **chaîne de connexion** dit où est le serveur, quelle base ouvrir, avec quel compte.

```csharp
string connectionString = "Server=localhost;Database=ma_boutique;User=root;Password=;";
```

`root` sans mot de passe convient à un poste de cours. Ce n'est pas un compte à laisser sur une machine exposée.

Une lecture suit toujours le même geste. On ouvre la connexion, on prépare une commande `SELECT`, on obtient un `MySqlDataReader`, on avance ligne par ligne. `GetInt32("id")` lit la colonne par son nom. L'indice `0` lirait la première colonne. Le nom résiste mieux à un changement d'ordre dans le `SELECT`.

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

Pour un `INSERT`, on ne colle jamais le nom dans la requête avec des guillemets. `"VALUES ('" + nom + "')"` est une injection SQL : une apostrophe dans le nom casse la requête, ou pire, la transforme. On écrit des **paramètres**, `@nom` et `@email`, et l'on donne les valeurs à part. Le pilote les transmet comme des données, pas comme du SQL.

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

`ExecuteNonQuery` ne renvoie pas de lignes. Il renvoie combien de lignes ont été touchées. Un ajout réussi vaut `1`.

| Objet | Rôle |
| :--- | :--- |
| `MySqlConnection` | Établit le tuyau vers la base de données. |
| `MySqlCommand` | Transporte la requête SQL (SELECT, INSERT...). |
| `MySqlDataReader` | Permet de lire les résultats ligne par ligne (lecture seule, rapide). |
| `ExecuteReader()` | Pour les `SELECT`. |
| `ExecuteNonQuery()` | Pour les `INSERT`, `UPDATE`, `DELETE` (retourne le nombre de lignes modifiées). |
| `ExecuteScalar()` | Pour récupérer une seule valeur (ex: `SELECT COUNT(*)`). |

`ExecuteScalar` sert quand la réponse est une seule cellule, un compte ou un maximum. Ouvrir un reader pour ça marche, mais on transporte une table là où un nombre suffit.

## Exercice

1. Créez une base `gestion_stock` avec une table `produits (id, nom, prix)`.
2. Créez une application console C#.
3. Codez une méthode `ImporterCSV()` qui lit un fichier `produits.csv` et insère chaque produit dans la base de données MariaDB.
