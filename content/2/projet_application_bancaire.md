---
title: 'Dictionnaires : App Bancaire'
description: Création d'une application bancaire simple en Python
level: premiere
chapter: Projets
icon: "landmark"
badgeId: premiere_application_bancaire
prerequisites:
  - projet_simulation_propagation
audience: public
---

# <Icone nom="landmark" /> Projet - Application Bancaire Simple

Le but de ce projet est de créer une petite banque en console, en Python.
Dans ce projet, nous allons ranger les comptes dans un dictionnaire, puis écrire le dépôt, le retrait, la consultation et le menu.

**Ressources :**
- [Code de départ](resources/app_back.py) : s'il est fourni en classe, il ne contient pas les fonctions à écrire. Sinon, partez d'un fichier vide `banque.py`.

## 1. Les comptes <Icone nom="credit-card" />

Chaque compte est un dictionnaire. La clé de `comptes` est le numéro, une chaîne. La valeur contient le nom, le solde et l'historique.

```python
comptes = {
    "12345": {
        "nom": "Alice",
        "solde": 1000.0,
        "transactions": []
    }
}
```

Le solde initial n'est pas une transaction : `transactions` commence vide. Les fonctions reçoivent `comptes` en premier paramètre, pour qu'on puisse les tester sans menu.

<ExerciseTabs courseId="proj_bank_struct" courseTitle="Structure des Comptes">
  <ExerciseSection id="bank-struct-1" label="Base de données" type="python">
    <Enonce>
      Créez un dictionnaire vide `comptes`.

      La clé est le numéro (`"12345"`). La valeur est un dictionnaire avec `nom` (`str`), `solde` (`float`) et `transactions` (liste de textes).
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="bank-struct-2" label="Création de compte" type="python">
    <Enonce>
      Écrivez `creer_compte(comptes, numero, nom, solde_initial)`.

      1. Si `numero` est déjà une clé, affichez `Compte déjà existant.` et renvoyez `False`. Le dictionnaire ne change pas.
      2. Si `solde_initial` est inférieur à 0, affichez `Montant invalide.` et renvoyez `False`.
      3. Sinon ajoutez le compte, avec une liste `transactions` vide, et renvoyez `True`.

      *Testez avec :*

      ```python
      creer_compte(comptes, "12345", "Alice", 1000.0)  # True
      creer_compte(comptes, "67890", "Bob", 500.0)     # True
      creer_compte(comptes, "12345", "Alice", 100.0)   # False
      ```

      Après le troisième appel, le solde d'Alice est toujours `1000.0`. Bob existe, et son historique est vide.

      *Attention : un numéro inconnu ne crée jamais le compte au passage. On le refuse plus loin avec `Compte introuvable.`*
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 2. Dépôt et retrait <Icone nom="euro" />

Chaque ligne d'historique commence par `+ ` ou `- `, puis le montant. Exemples : `"+ 200.0"`, `"- 50.0"`. L'ordre est celui des opérations, de la plus ancienne à la plus récente.

Toutes les fonctions de mouvement renvoient `True` quand l'opération a eu lieu, `False` sinon.

<ExerciseTabs courseId="proj_bank_ops" courseTitle="Opérations">
  <ExerciseSection id="bank-ops-1" label="Dépôt" type="python">
    <Enonce>
      Écrivez `deposer(comptes, numero, montant)`.

      1. Compte absent : affichez `Compte introuvable.` et renvoyez `False`.
      2. `montant` inférieur ou égal à 0 : affichez `Montant invalide.` et renvoyez `False`. Le solde ne change pas, rien n'est écrit dans l'historique.
      3. Sinon ajoutez `montant` au solde, ajoutez le texte `"+ "` suivi du montant à `transactions`, et renvoyez `True`.

      Après `deposer(comptes, "12345", 200.0)`, Alice est à `1200.0` et l'historique contient une seule ligne : `"+ 200.0"`.

      `deposer(comptes, "99999", 10.0)` renvoie `False` et ne crée pas le compte `"99999"`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="bank-ops-2" label="Retrait" type="lecture">
    <Enonce>
      Écrivez `retirer(comptes, numero, montant)`.

      Mêmes contrôles que le dépôt pour le compte inconnu et le montant interdit. Contrôle en plus : si `montant` est strictement supérieur au solde, affichez `Solde insuffisant.` et renvoyez `False`. Rien n'est enregistré.

      *Attention : le solde ne devient jamais négatif.*

      Enchaînez sur le compte d'Alice (solde 1200 après le dépôt) :

      ```python
      retirer(comptes, "12345", 50.0)    # True, solde 1150.0
      retirer(comptes, "12345", 2000.0)  # False, solde toujours 1150.0
      ```

      L'historique vaut alors `["+ 200.0", "- 50.0"]`. Le retrait de 2000 n'ajoute pas de ligne. Le dépôt initial de 1000 n'y figure pas.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="bank-ops-3" label="Consultation" type="lecture">
    <Enonce>
      Écrivez `verifier_solde(comptes, numero)`. Elle affiche le solde et le renvoie. Compte inconnu : affichez `Compte introuvable.` et renvoyez `-1.0`.

      Écrivez `voir_transactions(comptes, numero)`. Elle affiche chaque ligne puis renvoie la liste. Compte inconnu : le même message, et une liste vide. Compte sans opération : affichez `Aucune opération.` et renvoyez `[]`.

      Sur le scénario complet, `verifier_solde(comptes, "12345")` affiche `1150.0`. Bob, jamais mouvementé, a le solde `500.0` et le message `Aucune opération.`
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 3. Le menu <Icone nom="banknote" />

<ExerciseTabs courseId="proj_bank_ui" courseTitle="Interface">
  <ExerciseSection id="bank-ui-1" label="Menu principal" type="lecture">
    <Enonce>
      Écrivez `main()` avec une boucle qui réaffiche le menu jusqu'au choix `6`.

      ```text
      --- MENU BANQUE ---
      1. Créer un compte
      2. Faire un dépôt
      3. Faire un retrait
      4. Vérifier le solde
      5. Voir les transactions
      6. Quitter
      ```

      Chaque option demande le numéro, et le montant quand il le faut, puis appelle la fonction correspondante. Un choix autre que 1 à 6 affiche `Choix invalide.` et revient au menu. Le choix `6` termine la fonction.

      Rejouez ensuite au clavier : Alice 1000, Bob 500, dépôt 200 sur Alice, retrait 50 sur Alice, solde 1150, retrait 2000 refusé.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

## 4. Simulation et rendu <Icone nom="flask-conical" />

<ExerciseTabs courseId="proj_bank_test" courseTitle="Validation">
  <ExerciseSection id="bank-test-1" label="Scénario de test" type="lecture">
    <Enonce>
      En bas du fichier, laissez un bloc qui part d'un dictionnaire vide et enchaîne les appels ci-dessous, y compris les trois `False`.

      ```python
      creer_compte(comptes, "12345", "Alice", 1000.0)   # True
      creer_compte(comptes, "67890", "Bob", 500.0)      # True
      creer_compte(comptes, "12345", "Alice", 100.0)    # False
      deposer(comptes, "12345", 200.0)                  # True
      retirer(comptes, "12345", 50.0)                   # True
      retirer(comptes, "12345", 2000.0)                 # False
      deposer(comptes, "99999", 10.0)                   # False
      ```

      Affichez le booléen renvoyé par chaque appel, puis le solde et l'historique d'Alice. On doit lire `1150.0`, puis les deux lignes `+ 200.0` et `- 50.0`.
    </Enonce>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un fichier `banque.py` : commentaire d'en-tête avec le nom et la classe, les fonctions `creer_compte`, `deposer`, `retirer`, `verifier_solde`, `voir_transactions` et `main`, le scénario Alice / Bob, et le menu.

## 5. Pour aller plus loin

*   **Virement.** `virer(comptes, source, destination, montant)` retire sur un compte et dépose sur l'autre. Si le retrait échoue, le compte destinataire ne bouge pas.
*   **Relevé.** Affichez le nom du titulaire, le solde, puis l'historique, sous le titre `Relevé du compte 12345`.
