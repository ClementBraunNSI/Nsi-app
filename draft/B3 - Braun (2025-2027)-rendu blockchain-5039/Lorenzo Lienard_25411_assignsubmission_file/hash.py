import hashlib
from time import time

class Block:
    def __init__(self, index, timestamp, data, previous_hash):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        block_string = (
            str(self.index) +
            str(self.timestamp) +
            str(self.data) +
            str(self.previous_hash)
        )
        return hashlib.sha256(block_string.encode('utf-8')).hexdigest()

    def __str__(self):
        return f"Block {self.index} | Data: {self.data} | Hash: {self.hash} | Prev: {self.previous_hash}"


class Blockchain:
    def __init__(self):
        self.chain = []
        genesis_block = Block(0, time(), "Bloc Genesis", "0")
        self.chain.append(genesis_block)

    def add_block(self, new_data):
        parent = self.chain[-1]
        new_block = Block(parent.index + 1, time(), new_data, parent.hash)
        self.chain.append(new_block)

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            if current_block.hash != current_block.calculate_hash():
                print(f"Bloc {i} : Hash invalide")
                return False
            
            if current_block.previous_hash != previous_block.hash:
                print(f"Bloc {i} : chaine brisé")
                return False
        
        print("La chaîne est valide !")
        return True
        


if __name__ == "__main__":

    blockchain = Blockchain()

    blockchain.add_block("A envoie à B")
    blockchain.add_block("B envoie à C")
    blockchain.add_block("C envoie à D")

    for block in blockchain.chain:
        print(block)
    
    for i in range(1, len(blockchain.chain)):
        print(f"Bloc {i}")
        print("Prev du bloc courant :", blockchain.chain[i].previous_hash)
        print("Hash du bloc précédent :", blockchain.chain[i-1].hash)
        print("Correspondance :", blockchain.chain[i].previous_hash == blockchain.chain[i-1].hash)

        
    

        



