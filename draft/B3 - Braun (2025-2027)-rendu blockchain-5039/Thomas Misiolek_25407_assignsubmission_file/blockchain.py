import hashlib 
import time 


## Exercice1.1

# def test_hachage():
	# donnee = input("Entrez qlq :")
	# donnee_bytes = donnee.encode('utf-8')
	# hash_object = hashlib.sha256(donnee_bytes)
	# empreinte = hash_object.hexdigest()
	
	# print(empreinte)
# test_hachage()

## Exercice1.2

# def test_hachage2():
	# donnee = "Blockchain"
	# donnee_bytes = donnee.encode('utf-8')
	# hash_object = hashlib.sha256(donnee_bytes)
	# empreinte = hash_object.hexdigest()
	
	# print(empreinte)
# test_hachage2()

# def test_hachage3():
	# donnee = "blockchain"
	# donnee_bytes = donnee.encode('utf-8')
	# hash_object = hashlib.sha256(donnee_bytes)
	# empreinte = hash_object.hexdigest()
	
	# print(empreinte)
# test_hachage3()

## Exercice2.1

class Block:
	def __init__(self, index:int, timestamp:int, data:str, previous_hash:str, Blockhash:str):
		self.Index = index
		self.Timestamp = timestamp
		self.Data = data
		self.Previous_hash = previous_hash
		self.Blockhash = None
		

## Exercice2.2

def calculate_hash(self)->str:
	self.Index + " " + str(self.Timestamp) + " " + self.Data + " " + self.Previous_hash
	return self.hash
	

	

def __str__(self):
	return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"
