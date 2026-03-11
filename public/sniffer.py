import os
try:
    import requests
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests"])
    import requests
try:
    from bs4 import BeautifulSoup
except ImportError:
    import subprocess
    import sys
    subprocess.check_call([sys.executable, "-m", "pip", "install", "beautifulsoup4"])
    from bs4 import BeautifulSoup
from urllib.parse import urljoin

url = "https://kxs.fr/sujets/terminale-ecrit"

# Création du dossier qui va contenir les PDFs
dossier_telechargement = os.path.join(os.path.dirname(__file__), "annales")
os.makedirs(dossier_telechargement, exist_ok=True)

print(f"Connexion au site : {url} ...")
response = requests.get(url)
response.raise_for_status()

# Parsing de la page
soup = BeautifulSoup(response.text, 'html.parser')

# Récupération de tous les liens
liens = soup.find_all('a')
pdfs_trouves = 0

print("Début du téléchargement des fichiers PDF...\n")

for lien in liens:
    href = lien.get('href')
    # On vérifie si le lien pointe vers un fichier PDF
    if href and href.lower().endswith('.pdf'):
        # On construit l'URL absolue (au cas où le lien soit relatif)
        url_pdf = urljoin(url, href)
        
        # On extrait le nom du fichier depuis l'URL
        nom_fichier = url_pdf.split('/')[-1]
        chemin_fichier = os.path.join(dossier_telechargement, nom_fichier)
        
        # On télécharge le fichier s'il n'a pas déjà été téléchargé
        if not os.path.exists(chemin_fichier):
            print(f"Téléchargement : {nom_fichier}")
            try:
                pdf_response = requests.get(url_pdf)
                pdf_response.raise_for_status()
                with open(chemin_fichier, 'wb') as f:
                    f.write(pdf_response.content)
                pdfs_trouves += 1
            except requests.exceptions.RequestException as e:
                print(f"Erreur lors du téléchargement de {nom_fichier} : {e}")
        else:
            print(f"Déjà existant : {nom_fichier}")

print(f"\nOpération terminée ! {pdfs_trouves} fichiers PDF ont été téléchargés dans le dossier '{dossier_telechargement}'.")