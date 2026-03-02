---
title: "Dictionnaires : App Bancaire"
description: "Création d'une application bancaire simple en Python"
level: premiere
chapter: "Projets"
icon: "🏦"
badgeId: "premiere_application_bancaire"
---

import ExerciseTabs from '../../components/interactive/ExerciseTabs';
import { Enonce } from '../../components/interactive/ExerciseTabs';

# 🏦 Projet - Application Bancaire Simple

Le but de ce projet est de créer une application bancaire simple en utilisant Python.
Nous allons nous concentrer sur la gestion des comptes bancaires et des transactions en utilisant les dictionnaires.

Vous pouvez télécharger le code de base ici : [Code source](resources/app_back.py).

## 1. Le système de comptes

Chaque compte bancaire possède les caractéristiques suivantes :
- `nom` (str) : Nom du titulaire
- `solde` (float) : Montant disponible
- `transactions` (list) : Historique des opérations

<ExerciseTabs courseId="proj_bank_struct" courseTitle="Structure des Comptes">
  <ExerciseSection id="bank-struct-1" label="Base de données">
    <Enonce>
      Créez un dictionnaire vide `comptes` qui servira de base de données.
      La clé sera le **numéro de compte** (ex: "FR76..."), et la valeur sera le dictionnaire des détails du compte.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="bank-struct-2" label="Création de compte">
    <Enonce>
      Créez la fonction `creer_compte(numero, nom, solde_initial)` qui :
      1. Vérifie si le numéro de compte n'existe pas déjà.
      2. Crée un dictionnaire avec `nom`, `solde` et une liste `transactions` vide.
      3. Ajoute ce dictionnaire dans `comptes`.
      
      Exemple d'appel :
      ```python
      creer_compte("12345", "Alice", 100.0)
      ```
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Les opérations bancaires

<ExerciseTabs courseId="proj_bank_ops" courseTitle="Opérations">
  <ExerciseSection id="bank-ops-1" label="Dépôt">
    <Enonce>
      Créez la fonction `deposer(numero, montant)` qui :
      1. Vérifie que le compte existe.
      2. Ajoute le montant au solde.
      3. Enregistre la transaction dans la liste `transactions` (ex: `"+ 50.0"`).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="bank-ops-2" label="Retrait">
    <Enonce>
      Créez la fonction `retirer(numero, montant)` qui :
      1. Vérifie que le compte existe.
      2. Vérifie que le solde est suffisant.
      3. Retire le montant.
      4. Enregistre la transaction (ex: `"- 20.0"`).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="bank-ops-3" label="Consultation">
    <Enonce>
      Créez deux fonctions :
      *   `verifier_solde(numero)` : Affiche le solde actuel.
      *   `voir_transactions(numero)` : Affiche l'historique des opérations.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. Interface utilisateur

<ExerciseTabs courseId="proj_bank_ui" courseTitle="Interface">
  <ExerciseSection id="bank-ui-1" label="Menu Principal">
    <Enonce>
      Créez une fonction `main()` avec une boucle infinie qui affiche le menu suivant :

      ```text
      --- MENU BANQUE ---
      1. Créer un compte
      2. Faire un dépôt
      3. Faire un retrait
      4. Vérifier le solde
      5. Voir les transactions
      6. Quitter
      ```

      Utilisez `input()` pour récupérer le choix et demander les informations nécessaires (numéro de compte, montant...).
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Tests 🧪

<ExerciseTabs courseId="proj_bank_test" courseTitle="Validation">
  <ExerciseSection id="bank-test-1" label="Scénario de test">
    <Enonce>
      Testez votre application avec le scénario suivant :
      1. Créer un compte pour Alice avec 1000€.
      2. Créer un compte pour Bob avec 500€.
      3. Faire un dépôt de 200€ sur le compte d'Alice.
      4. Faire un retrait de 50€ sur le compte d'Alice.
      5. Vérifier le solde d'Alice (devrait être 1150€).
      6. Tenter un retrait de 2000€ (doit être refusé).
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>
