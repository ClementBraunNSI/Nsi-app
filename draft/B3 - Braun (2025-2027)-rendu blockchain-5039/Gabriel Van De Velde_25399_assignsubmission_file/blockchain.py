# import hashlib
# import time

# def test_hachage():
    # texte = input('Entrez le texte à hacher : ') 
    
    # texte_bytes = texte.encode('utf-8')
    # hash_object = hashlib.sha256(texte_bytes)
    # empreinte = hash_object.hexdigest()
    # print(empreinte)

# test_hachage()

class block:
	def __init__(index:str, timestamp:int ,data:str ,previous_hash:str ,Hash:str):
		
		self.index = Index
		self.timestamp = Timestamp 
		self.data = Data 
		self.previous_hash = Previous_hash
		self.hash = Hash		

def calculate_hash(self)->str:
	str(self.index) + " " + self.timestamp + " " + self.data + " " + self.previous_hash
	
	return self.hash 

def __str__(self):
	return f"block #{self.index}  [Data: {self.data}] [Hash: {self.data}] [Prev: {self.previous_hash}]"
	
main = block()
