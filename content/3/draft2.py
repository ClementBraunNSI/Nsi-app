def prix_final ( prix , reduction ) :
    """Applique une reduction en p o u r c e n t a g e"""

    prix_reduit = prix * (1 - reduction / 100)
    if prix_reduit == prix * 0.9:
        print ( " Reduction de 10% appliquee " )
        return prix_reduit

print(prix_final(100,10))