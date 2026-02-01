import hashlib
import time

# --- PARTIE 1 : LE HACHAGE (Warm-up) ---

def test_hachage():
    print("\n--- Exercice 1.1 : Premier Hash ---")
    texte = input("Entrez un texte à hacher : ")
    # 1. Encodage
    texte_bytes = texte.encode('utf-8')
    # 2. Hachage
    hash_object = hashlib.sha256(texte_bytes)
    # 3. Conversion
    print(f"Hash SHA-256 : {hash_object.hexdigest()}")

def demo_avalanche():
    print("\n--- Exercice 1.2 : Effet Avalanche ---")
    mot1 = "Blockchain"
    mot2 = "blockchain"
    
    hash1 = hashlib.sha256(mot1.encode()).hexdigest()
    hash2 = hashlib.sha256(mot2.encode()).hexdigest()
    
    print(f"'{mot1}' : {hash1}")
    print(f"'{mot2}' : {hash2}")
    print("Observez la différence totale malgré la seule majuscule !")

# --- PARTIE 2 : CLASSE BLOCK ---

class Block:
    def __init__(self, index, data, previous_hash):
        self.index = index
        self.timestamp = time.time()
        self.data = data
        self.previous_hash = previous_hash
        self.nonce = 0 # Pour la Partie 5 (Minage)
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        # On concatène toutes les infos du bloc pour créer une empreinte unique
        block_string = f"{self.index}{self.timestamp}{self.data}{self.previous_hash}{self.nonce}"
        return hashlib.sha256(block_string.encode()).hexdigest()

    def mine_block(self, difficulty):
        # Partie 5 : Proof of Work
        target = "0" * difficulty
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()
        print(f"  ⛏️  Bloc miné ! Nonce: {self.nonce} | Hash: {self.hash}")

    def __str__(self):
        # Exercice 2.3 : Affichage propre
        return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"

# --- PARTIE 3 : CLASSE BLOCKCHAIN ---

class Blockchain:
    def __init__(self):
        self.chain = [self.create_genesis_block()]
        self.difficulty = 4 # Partie 5 : Difficulté du minage

    def create_genesis_block(self):
        return Block(0, "Genesis Block", "0")

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, new_data):
        last_block = self.get_latest_block()
        new_block = Block(
            index=last_block.index + 1,
            data=new_data,
            previous_hash=last_block.hash
        )
        # Minage avant ajout (Partie 5)
        new_block.mine_block(self.difficulty)
        self.chain.append(new_block)

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i-1]

            # Vérification 1 : Hash cohérent ?
            if current_block.hash != current_block.calculate_hash():
                print(f"ERREUR Bloc {i}: Hash invalide (Données modifiées ?)")
                return False

            # Vérification 2 : Lien précédent valide ?
            if current_block.previous_hash != previous_block.hash:
                print(f"ERREUR Bloc {i}: Lien brisé avec le bloc précédent")
                return False

        return True

# --- PROGRAMME PRINCIPAL ---

if __name__ == "__main__":
    # Décommentez pour tester la partie 1
    # test_hachage()
    # demo_avalanche()

    print("\n--- Initialisation de la Blockchain ---")
    my_coin = Blockchain()

    print("\n--- Ajout de blocs (Minage en cours...) ---")
    my_coin.add_block("Alice envoie 10 BTC à Bob")
    my_coin.add_block("Bob envoie 5 BTC à Charlie")

    print("\n--- Visualisation de la chaîne ---")
    for bloc in my_coin.chain:
        print(bloc)

    # --- PARTIE 4 : SCENARIO D'ATTAQUE ---
    
    print("\n--- ÉTAPE A : Vérification initiale ---")
    print(f"La chaîne est-elle valide ? {my_coin.is_chain_valid()}") # True

    print("\n--- ÉTAPE B : Attaque Naïve (Modification de donnée) ---")
    print("Le hacker modifie le bloc 1...")
    my_coin.chain[1].data = "Alice envoie 1000 BTC à HACKER"
    
    print(f"La chaîne est-elle valide ? {my_coin.is_chain_valid()}") 
    # False car le hash du bloc 1 ne correspond plus à "Alice...HACKER"

    print("\n--- ÉTAPE C : Attaque Intelligente (Recalcul du hash) ---")
    print("Le hacker recalcule le hash du bloc 1 pour masquer la modification...")
    my_coin.chain[1].hash = my_coin.chain[1].calculate_hash()
    
    print(f"La chaîne est-elle valide ? {my_coin.is_chain_valid()}")
    # False car le bloc 2 pointe toujours vers l'ANCIEN hash du bloc 1.
    # Le lien est brisé !

    print("\n--- Conclusion ---")
    print("Pour réussir, le hacker devrait reminer le bloc 1, puis le 2, puis le 3...")
