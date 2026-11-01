---
title: 'C# et les Données : Fichiers CSV et Bases de Données'
description: >-
  Apprendre à persister des données en C# : du fichier CSV simple à la base de
  données MariaDB.
level: '2'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
icon: "save"
prerequisites: []
audience: public
---

# Persistance des données en C#

Une liste de clients créée dans `Main` disparaît quand la console se ferme. **Persister** des données consiste à les enregistrer à un endroit où elles sont conservées après l'arrêt du programme, pour pouvoir les relire au démarrage suivant. Deux solutions suffisent pour commencer. Le **fichier CSV** est un simple fichier texte, que l'on peut ouvrir dans Excel, adapté à un seul utilisateur et à un petit volume de données. La **base MariaDB ou MySQL**, elle, gère plusieurs utilisateurs, des requêtes et des règles d'intégrité. On commence par le fichier, où chaque ligne est visible, puis on passe à la base quand le fichier ne suffit plus.

## Lire et écrire un CSV

CSV veut dire *Comma-Separated Values*. En pratique française, le séparateur est souvent le point-virgule, parce que la virgule sert déjà aux décimaux. Chaque ligne est un enregistrement. La première ligne nomme les colonnes.

```csv
Id;Nom;Email
1;Dupont;alice@email.com
2;Martin;bob@email.com
```

Pour lire, on ouvre un `StreamReader` (`System.IO`). On vérifie que le fichier existe, on saute l'en-tête, puis on découpe chaque ligne avec `Split(';')`. Une ligne de trois colonnes donne un `Client`. Une ligne qui en a moins est ignorée, car un fichier abîmé ne doit pas faire échouer toute la lecture.

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

`using` ferme le fichier à la sortie du bloc, même si une exception survient. `int.Parse` échoue si la première colonne n'est pas un entier : le `catch` affiche alors le message d'erreur au lieu de laisser le programme s'arrêter brutalement.

Pour ajouter un client, `StreamWriter` ouvre le même fichier. Le deuxième argument, `true`, signifie que l'on **ajoute** à la fin du fichier, alors que `false` efface tout le fichier avant d'écrire. C'est une erreur classique : on croit ajouter une ligne, mais on ne garde que la dernière.

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

Le CSV a des limites. Si deux programmes écrivent en même temps, leurs modifications entrent en conflit, et une recherche comme « tous les clients dont le nom commence par D » oblige à relire tout le fichier. Dès que plusieurs personnes doivent travailler sur les mêmes données, il vaut mieux passer à une base.

## Se connecter à MariaDB ou MySQL

Le pont entre C# et la base s'appelle **ADO.NET**. Pour MariaDB ou MySQL, on ajoute le paquet NuGet `MySql.Data` ou `MySqlConnector`. Le serveur doit déjà tourner : WAMP, XAMPP, ou un conteneur Docker.

La **chaîne de connexion** indique où se trouve le serveur, quelle base ouvrir et avec quel compte.

```csharp
string connectionString = "Server=localhost;Database=ma_boutique;User=root;Password=;";
```

Le compte `root` sans mot de passe convient à un poste de cours, mais il ne faut jamais le laisser sur une machine accessible depuis le réseau.

Une lecture suit toujours les mêmes étapes : on ouvre la connexion, on prépare une commande `SELECT`, on obtient un `MySqlDataReader`, puis on lit les résultats ligne par ligne. `GetInt32("id")` lit la colonne par son nom. L'indice `0` lirait la première colonne, mais le nom reste correct même si l'ordre des colonnes du `SELECT` change.

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

Pour un `INSERT`, on ne colle jamais le nom dans la requête avec des guillemets. `"VALUES ('" + nom + "')"` est une injection SQL : une apostrophe dans le nom casse la requête, ou pire, la transforme. On écrit des **paramètres**, `@nom` et `@email`, et l'on donne les valeurs à part. Le pilote les transmet alors comme des données, et non comme du SQL.

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

`ExecuteNonQuery` ne renvoie pas de lignes, mais le nombre de lignes modifiées. Un ajout réussi vaut `1`.

| Objet | Rôle |
| :--- | :--- |
| `MySqlConnection` | Établit la connexion avec la base de données. |
| `MySqlCommand` | Transporte la requête SQL (SELECT, INSERT...). |
| `MySqlDataReader` | Permet de lire les résultats ligne par ligne (lecture seule, rapide). |
| `ExecuteReader()` | Pour les `SELECT`. |
| `ExecuteNonQuery()` | Pour les `INSERT`, `UPDATE`, `DELETE` (retourne le nombre de lignes modifiées). |
| `ExecuteScalar()` | Pour récupérer une seule valeur (ex: `SELECT COUNT(*)`). |

`ExecuteScalar` sert quand la réponse est une seule cellule, un compte ou un maximum. Ouvrir un reader fonctionnerait aussi, mais il transporterait une table entière alors qu'un nombre suffit.

## Exercice

1. Créer une base `gestion_stock` avec une table `produits (id, nom, prix)`.
2. Créer une application console C#.
3. Coder une méthode `ImporterCSV()` qui lit un fichier `produits.csv` et insère chaque produit dans la base de données MariaDB.
