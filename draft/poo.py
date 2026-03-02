class Voiture:

    def __init__(self, marque:str, modele:str, nb_portes : int,
                nb_ch : int, autonomie : int, couleur : str):
                self.Marque = marque
                self.Modele = modele
                self.Nb_portes = nb_portes
                self.Nb_ch = nb_ch
                self.Autonomie = autonomie
                self.Couleur = couleur
                self.Allumee = False
    
    def allumer_voiture(self):
        if self.Allumee == False:
            self.Allumee = True
        else:
            print("Voiture déja allumée")
    
    def __str__(self)->str:
        return self.Marque + " " + self.Modele + " " + str(self.Nb_ch)
twingo = Voiture("Renault", "Twingo", 3, 133, 400, "bleu")
twingo.allumer_voiture()
twingo.allumer_voiture()
