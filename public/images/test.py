mot = "bonjour"

temp = "-"*len(mot)
compteur = 0
while temp != mot and compteur < 10:
    lettre = input("Donnez une lettre : ")
    if lettre in mot:
        for i in range(len(mot)):
            if mot[i] == lettre :
                temp = temp[:i] + lettre + temp[i+1:]
    else:
        
        compteur += 1
    print(temp)
print("Vous avez gagné !")