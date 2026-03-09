import hashlib
from datetime import datetime

class Block: 
    def __init__(self, index: int, timestamp: str, data: str, previous_hash: str):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.nonce = 0
        self.hash = self.calculate_hash()
        
    def calculate_hash(self):
        mots = f"{self.index},{self.timestamp},{self.data},{self.previous_hash},{self.nonce}" 
        texte_bytes = mots.encode('utf-8')
        hash_object = hashlib.sha256(texte_bytes)
        return hash_object.hexdigest()

    def mine_block(self, difficulty):
        target = "0" * difficulty
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()
        print(f"Bloc miné ! Hash: {self.hash}")
        
    def __str__(self) -> str:
        return f"Block #{self.index} [Nonce: {self.nonce}] [Hash: {self.hash}]"

class Blockchain: 
    def __init__(self):
        self.chain = []
        self.difficulty = 4
        genesisblock = Block(0, datetime.now(), "Genesis Block", "0")
        genesisblock.mine_block(self.difficulty)
        self.chain.append(genesisblock) 
        
    def add_block(self, new_data):
        lastbloc = self.chain[-1]
        new_index = lastbloc.index + 1
        previous_hash = lastbloc.hash 
        new_Block = Block(new_index, datetime.now(), new_data, previous_hash)
        new_Block.mine_block(self.difficulty)
        self.chain.append(new_Block)

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i-1]
            if current.hash != current.calculate_hash():
                return False
            if current.previous_hash != previous.hash:
                return False
        return True

if __name__ == "__main__":
    mon_coin = Blockchain()
    
    print("\nAjout du bloc 1...")
    mon_coin.add_block("Alice doit 20€ à Bob")
    
    print("\nAjout du bloc 2...")
    mon_coin.add_block("Bob envoie 5€ à Charlie")

    print(f"\nBlockchain valide : {mon_coin.is_chain_valid()}")