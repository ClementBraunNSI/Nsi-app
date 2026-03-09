import hashlib
import time

def test_hachage():
    texte = input("Entrez le texte à hacher : ")
    texte_bytes = texte.encode('utf-8')
    hash_obj = hashlib.sha256(texte_bytes)
    empreinte = hash_obj.hexdigest()
    print(f"SHA‑256('{texte}') = {empreinte}")

if __name__ == "__main__":
    test_hachage()

class Block:
	def __init__ (self, index:int, timestamp:str, data:str, previous_hash:str):
		self.Index = index
		self.Timestamp = timestamp
		self.Data = data
		self.Previous_hash = previous_hash
		self.Blockhash = none
