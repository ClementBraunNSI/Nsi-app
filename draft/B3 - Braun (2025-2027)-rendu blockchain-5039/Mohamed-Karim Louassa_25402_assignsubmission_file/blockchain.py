import hashlib
import time



def test_hachage():
	donnee= input("Entrez qlq:")
	donnee_bytes=donnee.encode('utf-8')
	hash_object = hashlib.sha256(donnee_bytes)
	empreinte=hash_object.hexdigest()
	
	print(empreinte)
test_hachage()

def test_hachage2():
	donnee="Blockchain"
	donnee_bytes=donnee.encode('utf-8')
	hash_object=hashlib.sha256(donnee_bytes)
	empreinte=hash_object.hexdigest()
	
	print(empreinte)
test_hachage2()

def test_hachage3():
	donnee="Blockchain"
	donnee_bytes=donnee.encode('utf-8')
	hash_object=hashlib.sha256(donnee_bytes)
	empreinte=hash_object.hexdigest()
	print(empreinte)
test_hachage3()

class Block:
	def __init__(self, index:int, timestamp:int, data:str, previous_hash:str, Blockhash:str):
		self.Index= index
		self.Timestamp= timestamp
