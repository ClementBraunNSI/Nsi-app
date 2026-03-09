import hashlib
import time

def test_hachage():
	user = input("nom d'utilisateur")
	
	user_bytes = user.encode('utf-8')
	
	hash_object = hashlib.sha256(user_bytes)
	
	empreinte = hash_object.hexdigest()
	
	print(empreinte)

test_hachage()


class Block:
	def  __init__(self,index:int,timestamp:str,data:str,previous_hash:str,):
		self.Index = index
		self.Timestamp = timestamp
		self.Data = data
		self.Previous_hash = previous_hash
		self.blockhash = None
		
	def calculate_hash(self): 
		conc = self.Index + self.Timestamp + self.Data + self.Previous_hash
		
		conc_bytes = conc.encode('utf-8')
	
	hash_object = hashlib.sha256(conc_bytes)
	
	empreinte = hash_object.hexdigest()
	
	print(empreinte)
		

plop = Block(1,"12/25/2050","ss","dfgdfdfgdfgdf")
