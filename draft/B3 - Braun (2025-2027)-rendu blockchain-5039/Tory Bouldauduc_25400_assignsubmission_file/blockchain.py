exercice 1.1 :
	
import hashlib
import time

def test_hachage():
    texte = input ('Rentrez un texte:')
    # 1. Encodage (String -> Bytes)
    texte_bytes = texte.encode('utf-8')
    # 2. Hachage
    hash_object = hashlib.sha256(texte_bytes)
    # 3. Conversion (Bytes -> Hex String)
    empreinte = hash_object.hexdigest()
    
    print('Empreinte SHA-256 :' empreinte)*
    
Exercice 1.2:
	
import hashlib
def hachage(mot):
	return hashlib.sha256(mot.encode('utf-8)).hexdigest()
	
hash1 = hachage('Blockchain')
hash2 = hachage('Blockchain')

print('Blockchain :', hash1)
print('Blockchain :', hash2)

print('comparaison:)
for i in range(len(hash1)):
	if hash1[i]== hash2[i]:
		print(f'Position {i} : identique ({hash1[i]})')
	else:
		print(f'Position {i} : différent ({hash1[i]} = {hash2[i]})')
		
exercice 2

import hashlib
import time 

class Block:
	def __init__(self, index, data, previous_hash):
		self.index = index
		self.timestamp = time.time()
		self.data = data
		self.previous_hash = previous_hash
		self.hash = self.calculate_hash()
	
	def calculate_hash(self):
		contenu = (
		   str(self.index)
		   + str(self.timestamp)
		   + str(self.data)
		   + str(self.previous_hash)
		)
		return hashlib.sha256(contenu.encode('utf-8')).hexdigest()
		
    def __str__(self):
		return f"Block #{self.index} [Data: {self.data}] [Hash: {self.hash}] [Prev: {self.previous_hash}]"
		
Exercice 3 :
	
	import hashlib 
    import

		


