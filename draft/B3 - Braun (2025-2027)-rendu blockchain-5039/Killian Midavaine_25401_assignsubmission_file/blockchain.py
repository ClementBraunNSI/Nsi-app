import hashlib
import time

texte = "Bonjour BTS SIO"
# 1. Encodage (String -> Bytes)
texte_bytes = texte.encode('utf-8')

# 2. Hachage
hash_object = hashlib.sha256(texte_bytes)

# 3. Conversion (Bytes -> Hex String)
empreinte = hash_object.hexdigest()

print(empreinte)
# Résultat : a2c4e... (64 caractères)



def test_hachage():
	donnees = input("Entrez le mot ou le texte que vous voulez hacher.")
	donnee_bytes = donnees.encode('utf-8')
	hash_object = hashlib.sha256(donnee_bytes)
	empreinte = hash_object_hexdigest()


	print(empreinte)
test_hachage()

def test_hachage2():
	donnee = "Blockchain"
	donnee_bytes = donnee_encode('utf-8')
	hash_object = hashlib.sha256(donnee_bytes)
	empreinte = hash_object.hexdigest()
	
	print(empreinte)
test_hachage2()

def test_hachage3():
	donnee = "Blockchain"
	donnee_bytes = donnee_encode('utf-8')
	hash_object = hashlib.sha256(donnee_bytes)
	empreinte = hash_object.hexdigest()

	print(empreinte)
test_hachage3()


class block:
	
	def __init__(self,index:int,timestamp:int,data:str,previous_hash:str,blockhash:str):
		self.Index = index
		self.Timestamp = timestamp
		self.Data = data
		self.Previous_hash = previous_hash
		self.Blockhash = blockhash
		
		
		
		
		
		
		

