import hashlib
import time


def test_hachage (texte):
	texte_bytes = texte.encode('utf-8')
	# 2. Hachage
	hash_object = hashlib.sha256(texte_bytes)
	# 3. Conversion (Bytes -> Hex String)
	empreinte = hash_object.hexdigest()

	print(empreinte)
# Résultat : a2c4e... (64 caractères)
test1 = print (test_hachage("Blockchain"))
test2 = print (test_hachage("blockchain"))

#1.2.3 les résultats sont complétement différents.
