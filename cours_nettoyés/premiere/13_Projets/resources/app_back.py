# Application Bancaire Simple

# Base de données des comptes
comptes = {}

def creer_compte(numero_compte, nom, solde_initial=0):
    if numero_compte not in comptes:
        comptes[numero_compte] = {
            "nom": nom,
            "solde": solde_initial,
            "transactions": []
        }
        print(f"Compte créé pour {nom}")
    else:
        print("Ce numéro de compte existe déjà")

def deposer(numero_compte, montant):
    if numero_compte in comptes:
        comptes[numero_compte]["solde"] += montant
        comptes[numero_compte]["transactions"].append(f"Dépôt: +{montant}€")
        print(f"Dépôt de {montant}€ effectué")
    else:
        print("Compte non trouvé")

def retirer(numero_compte, montant):
    if numero_compte in comptes:
        if comptes[numero_compte]["solde"] >= montant:
            comptes[numero_compte]["solde"] -= montant
            comptes[numero_compte]["transactions"].append(f"Retrait: -{montant}€")
            print(f"Retrait de {montant}€ effectué")
        else:
            print("Solde insuffisant")
    else:
        print("Compte non trouvé")

def verifier_solde(numero_compte):
    if numero_compte in comptes:
        solde = comptes[numero_compte]["solde"]
        nom = comptes[numero_compte]["nom"]
        print(f"Solde de {nom}: {solde}€")
    else:
        print("Compte non trouvé")

def voir_transactions(numero_compte):
    if numero_compte in comptes:
        print(f"\nTransactions pour {comptes[numero_compte]['nom']}:")
        for transaction in comptes[numero_compte]["transactions"]:
            print(transaction)
    else:
        print("Compte non trouvé")

def afficher_menu():
    print("\n=== Menu Bancaire ===")
    print("1. Créer un compte")
    print("2. Faire un dépôt")
    print("3. Faire un retrait")
    print("4. Vérifier le solde")
    print("5. Voir les transactions")
    print("6. Quitter")
    return input("Choisissez une option (1-6): ")

def main():
    while True:
        choix = afficher_menu()
        
        if choix == "1":
            numero = input("Entrez le numéro de compte: ")
            nom = input("Entrez le nom: ")
            try:
                initial = float(input("Entrez le solde initial (0 si vide): "))
                creer_compte(numero, nom, initial)
            except ValueError:
                print("Montant invalide. Veuillez entrer un nombre.")
                
        elif choix == "2":
            numero = input("Entrez le numéro de compte: ")
            try:
                montant = float(input("Entrez le montant à déposer: "))
                deposer(numero, montant)
            except ValueError:
                print("Montant invalide. Veuillez entrer un nombre.")
                
        elif choix == "3":
            numero = input("Entrez le numéro de compte: ")
            try:
                montant = float(input("Entrez le montant à retirer: "))
                retirer(numero, montant)
            except ValueError:
                print("Montant invalide. Veuillez entrer un nombre.")
                
        elif choix == "4":
            numero = input("Entrez le numéro de compte: ")
            verifier_solde(numero)
            
        elif choix == "5":
            numero = input("Entrez le numéro de compte: ")
            voir_transactions(numero)
            
        elif choix == "6":
            print("Merci d'avoir utilisé notre système bancaire!")
            break
            
        else:
            print("Option invalide. Veuillez réessayer.")

if __name__ == "__main__":
    main()