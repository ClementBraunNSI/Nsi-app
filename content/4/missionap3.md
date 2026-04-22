---
title: Mission AP3
description: Evolution de la mission AP2 vers une architecture MVC et une application graphique C#
level: '4'
chapter: BTS SIO 1 SLAM AP
icon: "🧩"
prerequisites:
  - missionap2
---

Mission 3 : Evolution Architecturale de la solution AutoRent

**Durée :** 12h (4h/semaine en 3 semaines) **Atelier de professionnalisation - Semestre 2**

1) Compétences abordées

*   B1.3 Développer la présence en ligne de l'organisation
*   B2.1 Concevoir et développer une solution applicative
*   B2.2 Assurer la maintenance corrective ou évolutive d'une solution applicative

---

2) Contexte

**Suite directe de la Mission 2**

La mission AP2 a permis de construire une première version fonctionnelle :
1. Une application C# en mode Console pour traiter et structurer les véhicules.
2. Une interface Web en PHP pour afficher le catalogue des véhicules disponibles.

L'entreprise souhaite maintenant faire évoluer cette base vers une architecture plus professionnelle et maintenable.

Les deux évolutions obligatoires sont :
1. Remplacer l'approche Web actuelle par une **architecture MVC**.
2. Remplacer l'application Console C# par une **application graphique** (WinForms, WPF, Avalonia, ou technologie équivalente validée par l'enseignant).

---

3) Recherche Préliminaire (Veille Technologique)

Avant de démarrer le développement, vous devez produire une courte **note de synthèse** (1 page max) sur les thèmes suivants :

1.  **Architecture MVC :**
    *   Quel est le rôle de chaque couche (`Model`, `View`, `Controller`) ?
    *   En quoi MVC améliore-t-il la maintenabilité par rapport à une page PHP procédurale ?
    *   Quels éléments permettent de sécuriser l'architecture MVC ?

2.  **Application graphique C# :**
    *   Différence entre logique métier et logique d'interface utilisateur.
    *   Bonnes pratiques d'événements UI (boutons, saisies, validation utilisateur).
    
---

4) Cahier des Charges

Le projet doit respecter les contraintes techniques et fonctionnelles suivantes :

**A. Refonte de l'application Web en MVC**
*   Structurer le projet en respectant l'architecture de base du modèle MVC.
*   Le contrôleur doit gérer :
    *   l'affichage du catalogue,
    *   les filtres par type,
    *   la consultation d'un détail véhicule,
    *   un tri simple par prix.
*   Les vues doivent rester concentrées sur l'affichage (uniquement les véhicules disponibles).
*   Les modèles doivent porter les données et la validation de base.

**B. Evolution de l'application C# vers une interface graphique**
*   Supprimer le menu console et proposer une interface graphique claire.
*   L'écran principal doit permettre :
    *   affichage de la flotte,
    *   filtres par type et état,
    *   recherche par immatriculation,
    *   simulation de devis,
    *   affichage de statistiques,
    *   export des données vers la couche Web (CSV).
*   Les validations de saisie doivent être gérées proprement (messages utilisateur explicites).
*   La logique métier ne doit pas être directement codée dans les événements UI.

---

5) Fonctionnement attendu de l'application C# graphique

L'application C# devient un outil de gestion visuel pour l'agent AutoRent.

1.  **Démarrage :** chargement automatique des données (fichier source ou persistance locale).
2.  **Écran principal :**
    *   grille/liste des véhicules,
    *   zone de recherche,
    *   filtres (type, état),
    *   bouton d'actualisation.
3.  **Fonctions métier :**
    *   simulation de devis,
    *   calcul d'indicateurs (ex: revenu potentiel),
    *   export vers le format attendu par l'application Web MVC.
4.  **Sécurité de l'application :**
    *   aucune erreur brute affichée à l'utilisateur,
    *   gestion des erreurs de saisie et de données.


---

6) Développement de l'Application Web MVC (Partie 3)

L'application web devient la vitrine publique de la flotte **disponible**. 
**Rappel : La page d'accueil est la vitrine qui affiche tous les véhicules **DISPONIBLES** sous forme de grille**

**Travail à faire :**

1.  **Structure MVC :**
    *   implémenter les modèles de données,
    *   créer les contrôleurs **principaux**,

2.  **Fonctionnalités :**
    *   afficher les véhicules disponibles,
    *   filtrer par type,
    *   trier par prix,
    *   afficher une fiche détaillée.

3.  **Ergonomie :**
    *   interface lisible,
    *   composants réutilisables,
    *   design cohérent (CSS propre dans un fichier externe).

4. **Sécurité :**
    * Encodage des caractères HTML,
    * Respect des normes de sécurité (cf cours Injections SQL et failles XSS),
    * Appeler tous les fichiers extérieurs avec la bonne instruction

---

8) Livrables attendus

*   **Le Code Source C#** (Projet graphique complet, commenté).
*   **Le Code Source Web MVC** (Modèles, contrôleurs, vues, CSS).
*   **Le Diagramme de Classes UML** (mis à jour par rapport à AP2).
*   **Un Guide Utilisateur** (PDF avec captures d'écran).
*   **Une archive finale** nommée : `AP3_AutoRent_NOM1_NOM2.zip` (si le rendu ne s'appelle pas ainsi, une pénalité de 2 points sera appliquée).

!!! danger "IA"
    *   **Toute suspicion d'utilisation d'IA à but uniquement génératif entraînera la note de 0/20**
