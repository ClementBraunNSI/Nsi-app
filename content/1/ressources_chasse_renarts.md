---
title: 'Ressouces : Fichiers Chasse aux Ren-Arts'
chapter: Web
badgeId: seconde_ressources_renards
meta: 'Durée : Web'
prerequisites: []
---

## Telechargement

- [Telecharger le projet eleve (ZIP)](/content/1/projet_site_eleve.zip)

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Titre du site</title>
        <link rel="stylesheet" type="text/css" href="style.css"/>
        <meta charset="utf-8">
    </head>
    <body>
        <div class="container">
            <div class="nom_eleve">
                Prénom de l'élève
            </div>
            
            <div class = "presentation">
                <div class ="image">
                    <div>
                        <div>
                            image du tableau original
                        </div>
                        <div>
                            titre du tableau original - artiste - date 
                        </div>
                        <div class="div_tableau_description">
                            paragraphe de description du tableau original
                        </div>
                    </div>
                </div>
                <div class ="image">
                    <div>
                        image du tableau renardisé
                    </div>
                    <div>
                        titre du tableau renardisé 
                    </div>
                        <div class="div_tableau_description">
                            paragraphe de description du tableau original
                        </div>
                </div>
                <div class="caracteristiques">
                    liste à puces des caractéristiques du tableau original (taille, année, lieu de conservation, technique, matériaux, etc.)
                </div>
            </div>
            
        </div>
    </body>
</html>
```

```css
/*Fond*/
.container{
    border: solid;
    border-color: beige;
}

.localisation{
    border:solid;
    border-color:turquoise;
}
.image{
    border: solid;
    border-color: pink;
}
/* Texte du titre*/
.mt {
    font-size: 60px;
    text-align: center;
    margin-top: 20px;
    color :#BA8E23;
}

/* Div de présentation */
.image_principale {
    width: 400px;
    height: 400px;
    display: block;
    object-fit: cover;
    margin: 0 auto;
}

.nom_eleve{
    font-size: 40px;
    margin-left: 45%;
    border: solid;
    border-color: purple;
}

.presentation{
    display: flex;
    gap : 16px;
    border: solid;
    border-color: yellow;
}

.container {
    display: flex;
    flex-direction: column;
    gap: 13px;
    border: solid;
    border-color: green;
  }

.image_rival{
    width: 15%;
}

.div_tableau_description{
    padding-left:20%;
    border: solid;
    border-color: red;
}
.caracteristiques{
    display: flex;
    flex-direction : column;
    gap: 16px;
    text-align: center;
    border: solid;
    border-color: blue;
}
```