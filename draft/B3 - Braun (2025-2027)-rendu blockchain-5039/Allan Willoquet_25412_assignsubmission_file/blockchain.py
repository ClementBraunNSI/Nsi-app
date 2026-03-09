import hashlib 
from time import *

#ex1
#text = input ("saisie un text:")
def test_hachage(text):
    text = text.encode('utf-8')
    hash_objet = hashlib.sha256(text)
    empreinte = hash_objet.hexdigest()
    print (empreinte)

#test_hachage(text)

blockchain = 'ef7797e13d3a75526946a3bcf00daec9fc9c9c4d51ddc7cc5df888f74dd434d1'
Blockchain = '625da44e4eaf58d61cf048d168aa6f5e492dea166d8bb54ec06c30de07db57e1'

#partie 2 ex1
class Block:

    def __init__ (self, index: int, timestamp: int, data: str, previous_hash: str):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.nonce = 0  #<- partie 5 ex 1
        self.previous_hash = previous_hash
        
    #ex2
    def calculate_hash (self):
        text = ''
        text += str(self.index) + str(self.timestamp) + self.data + self.previous_hash + self.nonce # <- partie 5 ex 1
        text = text.encode('utf-8')
        hash_objet = hashlib.sha256(text)
        empreinte = hash_objet.hexdigest()
        return empreinte
    
    #partie 5 ex2
    def mine_block(self, difficulty):
        cible = "0" * difficulty  
        while self.hash[:difficulty] != cible:
            self.nonce += 1
            self.hash = self.calculate_hash()
        print(f"Bloc miné ! Hash : {self.hash}")
        
    #ex3
    def __str__(self):
        return f"Block {self.index} [Data: {self.data}] [Hash: {self.calculate_hash()}] [Prev: {self.previous_hash}]"


b1 = Block(1,1,"alice doit 10 à bob", "0")
#print (b1.calculate_hash())


#partie 3 ex1 
class Blockchain:
    
    def __init__ (self):
        self.Blockchain = []
        genesis = Block(0,time(), "", "0")
        self.Blockchain.append(genesis)
        
    #ex2
    def add_block (self, new_data):
        parent = self.Blockchain[-1]
        b2 = Block(parent.index + 1, time(), new_data, parent.calculate_hash())
        self.Blockchain.append(b2)
        #partie 5 ex3
        print(f"Minage du bloc {new_block.index}...")
        new_block.mine_block(self.difficulty)
        self.chain.append(new_block)
        
    #ex3
'''b = Blockchain()
if __name__ == "__main__":
    b.add_block ("A envoie à B")
    b.add_block ("B envoie à C")
    b.add_block ("C envoie à D")
    for i in range (len(b.Blockchain)):
        print (b.Blockchain[i])'''

#parie 4 ex 1
    def is_chain_valid(self):
        for i in range(1, len(self.Blockchain)):
            current_block = self.Blockchain[i]
            previous_block = self.Blockchain[i - 1]
                if current_block.calculate_hash() != current_block.calculate_hash():
                    print(f"Bloc {i} corrompu : hash incorrect")
                    return False
                if current_block.previous_hash != previous_block.calculate_hash():
                    print(f"Bloc {i} brisé : previous_hash incorrect")
                    return False
    return True

#ex2
if __name__ == "__main__":
    mon_coin = Blockchain()
    mon_coin.add_block("Alice envoie 10 BTC à Bob")
    mon_coin.add_block("Bob envoie 5 BTC à Charlie")
    mon_coin.add_block("Charlie envoie 2 BTC à Dave")

    print("Étape A : Tout va bien")
    print("Chaîne valide ?", mon_coin.is_chain_valid())  # True
    print()

    print("Étape B : Attaque naïve")
    mon_coin.chain[1].data = "Hacker s'est donné 1000 BTC"
    print("Chaîne valide après attaque ?", mon_coin.is_chain_valid())  # False
    print("Pourquoi ? Le hash stocké dans le bloc 1 ne correspond plus à ses nouvelles données.")
    print()

    print("Étape C : Attaque intelligente")
    mon_coin.chain[1].hash = mon_coin.chain[1].calculate_hash()
    print("Chaîne valide après tentative de correction ?", mon_coin.is_chain_valid())  
    print("Pourquoi ? Le bloc 2 pointe toujours vers l'ANCIEN hash du bloc 1. Le lien est brisé entre 1 et 2.")
    print()

#partie 5 ex4
if __name__ == "__main__":
    mine_block(2)  # Instantané
    mine_block(4)  # Quelques secondes
    mine_block(5)  # Peut prendre 10-30 secondes
    # test_mining_time(6)  # Très long, lancer seulement sur PC puissant !
    

