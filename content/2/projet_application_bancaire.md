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
Ce projet consiste à ranger les comptes dans un dictionnaire, puis écrire le dépôt, le retrait, la consultation et le menu.

**Ressources :**
- [Code de départ](resources/app_back.py) : s'il est fourni en classe, il ne contient pas les fonctions à écrire. Sinon, partir d'un fichier vide `banque.py`.

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
      Créer un dictionnaire vide `comptes`.

      La clé est le numéro (`"12345"`). La valeur est un dictionnaire avec `nom` (`str`), `solde` (`float`) et `transactions` (liste de textes).

    <Correction>
    ```python
    comptes = {}
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    assert 'comptes' in globals(), "Le dictionnaire doit s'appeler comptes."
    assert isinstance(comptes, dict), "comptes doit être un dictionnaire."
    assert comptes == {}, "comptes doit être vide au départ."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="bank-struct-2" label="Création de compte" type="python">
    <Enonce>
      Écrire `creer_compte(comptes, numero, nom, solde_initial)`.

      1. Si `numero` est déjà une clé, afficher `Compte déjà existant.` et renvoyer `False`. Le dictionnaire ne change pas.
      2. Si `solde_initial` est inférieur à 0, afficher `Montant invalide.` et renvoyer `False`.
      3. Sinon ajouter le compte, avec une liste `transactions` vide, et renvoyer `True`.

      *Tester avec :*

      ```python
      creer_compte(comptes, "12345", "Alice", 1000.0)  # True
      creer_compte(comptes, "67890", "Bob", 500.0)     # True
      creer_compte(comptes, "12345", "Alice", 100.0)   # False
      ```

      Après le troisième appel, le solde d'Alice est toujours `1000.0`. Bob existe, et son historique est vide.

      *Attention : un numéro inconnu ne crée jamais le compte au passage. On le refuse plus loin avec `Compte introuvable.`*

    <Correction>
    ```python
    def creer_compte(comptes, numero, nom, solde_initial):
        if numero in comptes:
            print("Compte déjà existant.")
            return False
        if solde_initial < 0:
            print("Montant invalide.")
            return False
        comptes[numero] = {"nom": nom, "solde": solde_initial, "transactions": []}
        return True

    comptes = {}
    print(creer_compte(comptes, "12345", "Alice", 1000.0))
    print(creer_compte(comptes, "67890", "Bob", 500.0))
    print(creer_compte(comptes, "12345", "Alice", 100.0))
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    essai = {}
    assert creer_compte(essai, "12345", "Alice", 1000.0) is True, "Un nouveau numéro : creer_compte renvoie True."
    assert essai == {"12345": {"nom": "Alice", "solde": 1000.0, "transactions": []}}, "Le compte ajouté contient nom, solde et une liste transactions vide."
    assert creer_compte(essai, "67890", "Bob", 500.0) is True, "Bob est créé."
    assert creer_compte(essai, "12345", "Alice", 100.0) is False, "Un numéro déjà pris : creer_compte renvoie False."
    assert essai["12345"]["solde"] == 1000.0, "Le compte existant ne change pas : Alice reste à 1000.0."
    assert creer_compte(essai, "55555", "Chloé", -5.0) is False, "Un solde initial négatif est refusé."
    assert "55555" not in essai, "Un compte refusé n'est pas ajouté."
    assert creer_compte(essai, "00000", "Zoé", 0.0) is True, "Un solde initial de 0 est accepté."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 2. Dépôt et retrait <Icone nom="euro" />

Chaque ligne d'historique commence par `+ ` ou `- `, puis le montant. Exemples : `"+ 200.0"`, `"- 50.0"`. L'ordre est celui des opérations, de la plus ancienne à la plus récente.

Toutes les fonctions de mouvement renvoient `True` quand l'opération a eu lieu, `False` sinon.

<ExerciseTabs courseId="proj_bank_ops" courseTitle="Opérations">
  <ExerciseSection id="bank-ops-1" label="Dépôt" type="python">
    <CodeDepart>
    ```python
    comptes = {
        "12345": {"nom": "Alice", "solde": 1000.0, "transactions": []},
        "67890": {"nom": "Bob", "solde": 500.0, "transactions": []},
    }
    ```
    </CodeDepart>
    <Enonce>
      Écrire `deposer(comptes, numero, montant)`.

      1. Compte absent : afficher `Compte introuvable.` et renvoyer `False`.
      2. `montant` inférieur ou égal à 0 : afficher `Montant invalide.` et renvoyer `False`. Le solde ne change pas, rien n'est écrit dans l'historique.
      3. Sinon ajouter `montant` au solde, ajouter le texte `"+ "` suivi du montant à `transactions`, et renvoyer `True`.

      Après `deposer(comptes, "12345", 200.0)`, Alice est à `1200.0` et l'historique contient une seule ligne : `"+ 200.0"`.

      `deposer(comptes, "99999", 10.0)` renvoie `False` et ne crée pas le compte `"99999"`.

    <Correction>
    ```python
    def deposer(comptes, numero, montant):
        if numero not in comptes:
            print("Compte introuvable.")
            return False
        if montant <= 0:
            print("Montant invalide.")
            return False
        comptes[numero]["solde"] += montant
        comptes[numero]["transactions"].append("+ " + str(montant))
        return True

    print(deposer(comptes, "12345", 200.0))
    print(comptes["12345"])
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    essai = {"12345": {"nom": "Alice", "solde": 1000.0, "transactions": []}}
    assert deposer(essai, "12345", 200.0) is True, "Un dépôt valide renvoie True."
    assert essai["12345"]["solde"] == 1200.0, "Après un dépôt de 200.0, Alice est à 1200.0."
    assert essai["12345"]["transactions"] == ["+ 200.0"], "L'historique contient une seule ligne : + 200.0"
    assert deposer(essai, "99999", 10.0) is False, "Un compte inconnu : deposer renvoie False."
    assert "99999" not in essai, "Un compte inconnu n'est pas créé au passage."
    assert deposer(essai, "12345", 0) is False and deposer(essai, "12345", -5.0) is False, "Un montant nul ou négatif est refusé."
    assert essai["12345"]["solde"] == 1200.0 and len(essai["12345"]["transactions"]) == 1, "Un dépôt refusé ne change ni le solde ni l'historique."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="bank-ops-2" label="Retrait" type="python">
    <CodeDepart>
    ```python
    comptes = {
        "12345": {"nom": "Alice", "solde": 1200.0, "transactions": ["+ 200.0"]},
        "67890": {"nom": "Bob", "solde": 500.0, "transactions": []},
    }
    ```
    </CodeDepart>
    <Enonce>
      Écrire `retirer(comptes, numero, montant)`.

      Mêmes contrôles que le dépôt pour le compte inconnu et le montant interdit. Contrôle en plus : si `montant` est strictement supérieur au solde, afficher `Solde insuffisant.` et renvoyer `False`. Rien n'est enregistré.

      *Attention : le solde ne devient jamais négatif.*

      Enchaîner sur le compte d'Alice (solde 1200 après le dépôt) :

      ```python
      retirer(comptes, "12345", 50.0)    # True, solde 1150.0
      retirer(comptes, "12345", 2000.0)  # False, solde toujours 1150.0
      ```

      L'historique vaut alors `["+ 200.0", "- 50.0"]`. Le retrait de 2000 n'ajoute pas de ligne. Le dépôt initial de 1000 n'y figure pas.

    <Correction>
    ```python
    def retirer(comptes, numero, montant):
        if numero not in comptes:
            print("Compte introuvable.")
            return False
        if montant <= 0:
            print("Montant invalide.")
            return False
        if montant > comptes[numero]["solde"]:
            print("Solde insuffisant.")
            return False
        comptes[numero]["solde"] -= montant
        comptes[numero]["transactions"].append("- " + str(montant))
        return True

    print(retirer(comptes, "12345", 50.0))
    print(retirer(comptes, "12345", 2000.0))
    print(comptes["12345"])
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    essai = {"12345": {"nom": "Alice", "solde": 1200.0, "transactions": ["+ 200.0"]}}
    assert retirer(essai, "12345", 50.0) is True, "Un retrait possible renvoie True."
    assert essai["12345"]["solde"] == 1150.0, "Après un retrait de 50.0, Alice est à 1150.0."
    assert retirer(essai, "12345", 2000.0) is False, "Un retrait supérieur au solde renvoie False."
    assert essai["12345"]["solde"] == 1150.0, "Un retrait refusé ne change pas le solde."
    assert essai["12345"]["transactions"] == ["+ 200.0", "- 50.0"], "L'historique vaut ['+ 200.0', '- 50.0'] : le retrait refusé n'ajoute pas de ligne."
    assert retirer(essai, "99999", 10.0) is False and "99999" not in essai, "Un compte inconnu est refusé et n'est pas créé."
    assert retirer(essai, "12345", -1.0) is False, "Un montant négatif est refusé."
    assert retirer(essai, "12345", 1150.0) is True and essai["12345"]["solde"] == 0, "On peut retirer tout le solde, sans passer sous 0."
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="bank-ops-3" label="Consultation" type="python">
    <CodeDepart>
    ```python
    comptes = {
        "12345": {"nom": "Alice", "solde": 1150.0, "transactions": ["+ 200.0", "- 50.0"]},
        "67890": {"nom": "Bob", "solde": 500.0, "transactions": []},
    }
    ```
    </CodeDepart>
    <Enonce>
      Écrire `verifier_solde(comptes, numero)`. Elle affiche le solde et le renvoie. Compte inconnu : afficher `Compte introuvable.` et renvoyer `-1.0`.

      Écrire `voir_transactions(comptes, numero)`. Elle affiche chaque ligne puis renvoie la liste. Compte inconnu : le même message, et une liste vide. Compte sans opération : afficher `Aucune opération.` et renvoyer `[]`.

      Sur le scénario complet, `verifier_solde(comptes, "12345")` affiche `1150.0`. Bob, jamais mouvementé, a le solde `500.0` et le message `Aucune opération.`

    <Correction>
    ```python
    def verifier_solde(comptes, numero):
        if numero not in comptes:
            print("Compte introuvable.")
            return -1.0
        print(comptes[numero]["solde"])
        return comptes[numero]["solde"]

    def voir_transactions(comptes, numero):
        if numero not in comptes:
            print("Compte introuvable.")
            return []
        transactions = comptes[numero]["transactions"]
        if len(transactions) == 0:
            print("Aucune opération.")
            return []
        for ligne in transactions:
            print(ligne)
        return transactions

    verifier_solde(comptes, "12345")
    voir_transactions(comptes, "67890")
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    import io, contextlib
    def _sortie(fonction, *arguments):
        tampon = io.StringIO()
        with contextlib.redirect_stdout(tampon):
            valeur = fonction(*arguments)
        return valeur, tampon.getvalue()
    essai = {"12345": {"nom": "Alice", "solde": 1150.0, "transactions": ["+ 200.0", "- 50.0"]}, "67890": {"nom": "Bob", "solde": 500.0, "transactions": []}}
    valeur, texte = _sortie(verifier_solde, essai, "12345")
    assert valeur == 1150.0 and "1150.0" in texte, "verifier_solde affiche et renvoie 1150.0 pour Alice."
    valeur, texte = _sortie(verifier_solde, essai, "99999")
    assert valeur == -1.0 and "Compte introuvable." in texte, "Compte inconnu : afficher Compte introuvable. et renvoyer -1.0."
    valeur, texte = _sortie(voir_transactions, essai, "12345")
    assert valeur == ["+ 200.0", "- 50.0"], "voir_transactions renvoie la liste des opérations d'Alice."
    assert texte.split("\n")[:2] == ["+ 200.0", "- 50.0"], "voir_transactions affiche chaque ligne, dans l'ordre."
    valeur, texte = _sortie(voir_transactions, essai, "67890")
    assert valeur == [] and "Aucune opération." in texte, "Bob n'a aucune opération : afficher Aucune opération. et renvoyer []."
    valeur, texte = _sortie(voir_transactions, essai, "99999")
    assert valeur == [] and "Compte introuvable." in texte, "Compte inconnu : afficher Compte introuvable. et renvoyer []."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 3. Le menu <Icone nom="banknote" />

<ExerciseTabs courseId="proj_bank_ui" courseTitle="Interface">
  <ExerciseSection id="bank-ui-1" label="Menu principal" type="python">
    <CodeDepart>
    ```python
    def creer_compte(comptes, numero, nom, solde_initial):
        if numero in comptes:
            print("Compte déjà existant.")
            return False
        if solde_initial < 0:
            print("Montant invalide.")
            return False
        comptes[numero] = {"nom": nom, "solde": solde_initial, "transactions": []}
        return True

    def deposer(comptes, numero, montant):
        if numero not in comptes:
            print("Compte introuvable.")
            return False
        if montant <= 0:
            print("Montant invalide.")
            return False
        comptes[numero]["solde"] += montant
        comptes[numero]["transactions"].append("+ " + str(montant))
        return True

    def retirer(comptes, numero, montant):
        if numero not in comptes:
            print("Compte introuvable.")
            return False
        if montant <= 0:
            print("Montant invalide.")
            return False
        if montant > comptes[numero]["solde"]:
            print("Solde insuffisant.")
            return False
        comptes[numero]["solde"] -= montant
        comptes[numero]["transactions"].append("- " + str(montant))
        return True

    def verifier_solde(comptes, numero):
        if numero not in comptes:
            print("Compte introuvable.")
            return -1.0
        print(comptes[numero]["solde"])
        return comptes[numero]["solde"]

    def voir_transactions(comptes, numero):
        if numero not in comptes:
            print("Compte introuvable.")
            return []
        transactions = comptes[numero]["transactions"]
        if len(transactions) == 0:
            print("Aucune opération.")
            return []
        for ligne in transactions:
            print(ligne)
        return transactions
    ```
    </CodeDepart>
    <Enonce>
      Écrire `main()` avec une boucle qui réaffiche le menu jusqu'au choix `6`.

      ```text
      --- MENU BANQUE ---
      1. Créer un compte
      2. Faire un dépôt
      3. Faire un retrait
      4. Vérifier le solde
      5. Voir les transactions
      6. Quitter
      ```

      Chaque option demande le numéro, puis le nom et le solde initial pour une création, ou le montant pour un dépôt ou un retrait. Les montants sont convertis en `float`. Elle appelle ensuite la fonction correspondante. Un choix autre que 1 à 6 affiche `Choix invalide.` et revient au menu. Le choix `6` termine la fonction.
      Les fonctions des étapes précédentes sont déjà dans l'éditeur. Appeler `main()` à la fin du programme.

      Rejouer ensuite au clavier : Alice 1000, Bob 500, dépôt 200 sur Alice, retrait 50 sur Alice, solde 1150, retrait 2000 refusé.

    <Correction>
    ```python
    comptes = {}

    def main():
        while True:
            print("--- MENU BANQUE ---")
            print("1. Créer un compte")
            print("2. Faire un dépôt")
            print("3. Faire un retrait")
            print("4. Vérifier le solde")
            print("5. Voir les transactions")
            print("6. Quitter")
            choix = input("Choix : ")
            if choix == "6":
                return
            if choix == "1":
                numero = input("Numéro : ")
                nom = input("Nom : ")
                solde = float(input("Solde initial : "))
                creer_compte(comptes, numero, nom, solde)
            elif choix == "2":
                numero = input("Numéro : ")
                montant = float(input("Montant : "))
                deposer(comptes, numero, montant)
            elif choix == "3":
                numero = input("Numéro : ")
                montant = float(input("Montant : "))
                retirer(comptes, numero, montant)
            elif choix == "4":
                verifier_solde(comptes, input("Numéro : "))
            elif choix == "5":
                voir_transactions(comptes, input("Numéro : "))
            else:
                print("Choix invalide.")

    main()
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    ENTREES = ["6"]
    import io, contextlib
    saisies = ["1", "12345", "Alice", "1000", "1", "67890", "Bob", "500", "2", "12345", "200", "3", "12345", "50", "4", "12345", "3", "12345", "2000", "9", "6"]
    def input(question=""):
        return saisies.pop(0)
    comptes.clear()
    tampon = io.StringIO()
    with contextlib.redirect_stdout(tampon):
        main()
    texte = tampon.getvalue()
    assert saisies == [], "main() doit lire les saisies dans l'ordre : choix, numéro, puis nom et solde ou montant, et s'arrêter au choix 6."
    assert comptes["12345"]["solde"] == 1150.0, "Après le scénario, Alice est à 1150.0."
    assert comptes["67890"]["solde"] == 500.0, "Bob reste à 500.0."
    assert "--- MENU BANQUE ---" in texte, "Le menu est affiché à chaque tour."
    assert "1150.0" in texte, "Le choix 4 affiche le solde d'Alice : 1150.0."
    assert "Solde insuffisant." in texte, "Le retrait de 2000 est refusé : Solde insuffisant."
    assert "Choix invalide." in texte, "Un choix hors de 1 à 6 affiche Choix invalide."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

## 4. Simulation et rendu <Icone nom="flask-conical" />

<ExerciseTabs courseId="proj_bank_test" courseTitle="Validation">
  <ExerciseSection id="bank-test-1" label="Scénario de test" type="python">
    <CodeDepart>
    ```python
    def creer_compte(comptes, numero, nom, solde_initial):
        if numero in comptes:
            print("Compte déjà existant.")
            return False
        if solde_initial < 0:
            print("Montant invalide.")
            return False
        comptes[numero] = {"nom": nom, "solde": solde_initial, "transactions": []}
        return True

    def deposer(comptes, numero, montant):
        if numero not in comptes:
            print("Compte introuvable.")
            return False
        if montant <= 0:
            print("Montant invalide.")
            return False
        comptes[numero]["solde"] += montant
        comptes[numero]["transactions"].append("+ " + str(montant))
        return True

    def retirer(comptes, numero, montant):
        if numero not in comptes:
            print("Compte introuvable.")
            return False
        if montant <= 0:
            print("Montant invalide.")
            return False
        if montant > comptes[numero]["solde"]:
            print("Solde insuffisant.")
            return False
        comptes[numero]["solde"] -= montant
        comptes[numero]["transactions"].append("- " + str(montant))
        return True
    ```
    </CodeDepart>
    <Enonce>
      En bas du fichier, laisser un bloc qui part d'un dictionnaire vide et enchaîne les appels ci-dessous, y compris les trois `False`.

      ```python
      creer_compte(comptes, "12345", "Alice", 1000.0)   # True
      creer_compte(comptes, "67890", "Bob", 500.0)      # True
      creer_compte(comptes, "12345", "Alice", 100.0)    # False
      deposer(comptes, "12345", 200.0)                  # True
      retirer(comptes, "12345", 50.0)                   # True
      retirer(comptes, "12345", 2000.0)                 # False
      deposer(comptes, "99999", 10.0)                   # False
      ```

      Afficher le booléen renvoyé par chaque appel, puis le solde et l'historique d'Alice. On doit lire `1150.0`, puis les deux lignes `+ 200.0` et `- 50.0`.

    <Correction>
    ```python
    comptes = {}
    print(creer_compte(comptes, "12345", "Alice", 1000.0))
    print(creer_compte(comptes, "67890", "Bob", 500.0))
    print(creer_compte(comptes, "12345", "Alice", 100.0))
    print(deposer(comptes, "12345", 200.0))
    print(retirer(comptes, "12345", 50.0))
    print(retirer(comptes, "12345", 2000.0))
    print(deposer(comptes, "99999", 10.0))
    print(comptes["12345"]["solde"])
    for ligne in comptes["12345"]["transactions"]:
        print(ligne)
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    lignes = [l.strip() for l in SORTIE.strip().splitlines()]
    assert [l for l in lignes if l in ("True", "False")] == ["True", "True", "False", "True", "True", "False", "False"], "Les sept appels affichent True, True, False, True, True, False, False."
    assert "1150.0" in lignes, "Le solde d'Alice affiché est 1150.0."
    assert lignes[-2:] == ["+ 200.0", "- 50.0"], "L'historique d'Alice se termine par + 200.0 puis - 50.0."
    assert comptes["12345"]["solde"] == 1150.0, "Le scénario part d'un dictionnaire comptes vide."
    ```
    </Verification>
  </ExerciseSection>
</ExerciseTabs>

**Ce qu'on rend.** Un fichier `banque.py` : commentaire d'en-tête avec le nom et la classe, les fonctions `creer_compte`, `deposer`, `retirer`, `verifier_solde`, `voir_transactions` et `main`, le scénario Alice / Bob, et le menu.

## 5. Pour aller plus loin

*   **Virement.** `virer(comptes, source, destination, montant)` retire sur un compte et dépose sur l'autre. Si le retrait échoue, le compte destinataire ne bouge pas.
*   **Relevé.** Afficher le nom du titulaire, le solde, puis l'historique, sous le titre `Relevé du compte 12345`.
