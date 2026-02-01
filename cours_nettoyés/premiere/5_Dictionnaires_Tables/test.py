import csv

liste_a_remplir = []
with open('communes.csv', newline='') as fichier_csv:
   lecteur = csv.DictReader(fichier_csv, delimiter=',')   # Objet DictReader (itérateur)
   for ligne in lecteur:
      liste_a_remplir.append(dict(ligne))

for ligne in liste_a_remplir:
   if ligne['code_departement'] == '62':
        print(ligne['nom_commune']) 

print(type(liste_a_remplir))
print(type(liste_a_remplir[0]))