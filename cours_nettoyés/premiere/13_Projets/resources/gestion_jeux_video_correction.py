ludotheque = {}

def ajouter_jeu(ludotheque:list, titre : str, plateforme:str, annee:int, genre:str,statut:str):
    for jeu in ludotheque:
        if jeu["titre"] == titre:
            return False
        