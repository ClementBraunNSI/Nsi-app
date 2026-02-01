---
title: "Exercices : Tri et Fusion"
chapter: "Dictionnaires et Traitement de tables"
badgeId: "tri-fusion"
meta: "Exercices sur le tri et la fusion de données en Python"
---

<ExerciseTabs courseId="tri-fusion" courseTitle="Tri et Fusion de Données">

  <ExerciseSection id="tri-tables" label="Tri de Tables">
    <Enonce>
    ### Tri de données
    
    On manipule toujours notre liste de dictionnaires `villes`.
    
    **1. Tri alphabétique**
    Écrire une fonction `trier_par_nom(villes)` qui trie la liste des villes par ordre alphabétique de leur nom.
    *Indice : Utilisez `sorted()` ou `.sort()` avec le paramètre `key` et une fonction lambda.*
    
    **2. Tri numérique**
    Écrire une fonction `trier_par_latitude(villes)` qui trie les villes du Sud au Nord (latitude croissante).
    *Attention : Pensez à convertir la latitude en float.*
    
    **3. Top K**
    Écrire une fonction `top_k_nord(villes, k)` qui renvoie les `k` villes les plus au Nord (latitude la plus élevée).
    
    <Correction>
    ```python
    def trier_par_nom(villes):
        # Utilisation de sorted qui renvoie une nouvelle liste
        return sorted(villes, key=lambda x: x['nom_commune_postal'])

    def trier_par_latitude(villes):
        # On doit gérer la conversion en float pour le tri
        # On ignore les valeurs vides ou invalides
        def get_lat(ville):
            try:
                return float(ville['latitude'])
            except ValueError:
                return -90.0 # Valeur par défaut
        
        return sorted(villes, key=get_lat)

    def top_k_nord(villes, k):
        # On trie par latitude décroissante (reverse=True)
        def get_lat(ville):
            try:
                return float(ville['latitude'])
            except ValueError:
                return -90.0
                
        villes_triees = sorted(villes, key=get_lat, reverse=True)
        return villes_triees[:k]
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    villes_test = [
        {'nom_commune_postal': 'B', 'latitude': '10'},
        {'nom_commune_postal': 'A', 'latitude': '20'}
    ]
    
    # Test Tri Nom
    res_nom = trier_par_nom(villes_test)
    assert res_nom[0]['nom_commune_postal'] == 'A'
    
    # Test Tri Latitude
    res_lat = trier_par_latitude(villes_test)
    assert res_lat[0]['latitude'] == '10' # 10 < 20
    
    # Test Top K
    res_top = top_k_nord(villes_test, 1)
    assert res_top[0]['nom_commune_postal'] == 'A' # 20 > 10
    ```
    </Verification>
  </ExerciseSection>

  <ExerciseSection id="fusion-tables" label="Fusion de Tables">
    <Enonce>
    ### Fusion de données (Jointure)
    
    On dispose d'une seconde table `regions` qui associe un code département à une région.
    
    ```python
    regions = [
        {'code_dept': '01', 'nom_region': 'Auvergne-Rhône-Alpes'},
        {'code_dept': '75', 'nom_region': 'Île-de-France'},
        # ...
    ]
    ```
    
    **Objectif**
    Écrire une fonction `ajouter_region(villes, regions)` qui crée une nouvelle liste de villes où chaque dictionnaire contient une clé supplémentaire `nom_region`.
    La jointure se fait sur `code_departement` (dans villes) et `code_dept` (dans regions).
    
    <Correction>
    ```python
    def ajouter_region(villes, regions):
        # Étape 1 : Optimisation (création d'un dictionnaire de correspondance)
        # Cela évite une double boucle imbriquée coûteuse
        dept_to_region = {}
        for r in regions:
            dept_to_region[r['code_dept']] = r['nom_region']
            
        villes_enrichies = []
        for ville in villes:
            # Création d'une copie pour ne pas modifier l'original
            ville_new = ville.copy()
            code = ville.get('code_departement')
            
            # Ajout de la région si le code existe
            if code in dept_to_region:
                ville_new['nom_region'] = dept_to_region[code]
            else:
                ville_new['nom_region'] = "Inconnue"
                
            villes_enrichies.append(ville_new)
            
        return villes_enrichies
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    villes_test = [{'nom': 'Paris', 'code_departement': '75'}]
    regions_test = [{'code_dept': '75', 'nom_region': 'IDF'}]
    
    res = ajouter_region(villes_test, regions_test)
    assert res[0]['nom_region'] == 'IDF'
    ```
    </Verification>
  </ExerciseSection>
  
  <ExerciseSection id="algo-fusion" label="Algo - Fusion">
    <Enonce>
    ### Algorithme de Fusion (Listes triées)
    
    C'est un classique de l'algorithmique, utilisé dans le **Tri Fusion**.
    
    **Objectif**
    Écrire une fonction `fusionner(liste1, liste2)` qui prend deux listes d'entiers **déjà triées** par ordre croissant et renvoie une nouvelle liste triée contenant tous les éléments.
    
    *Contrainte : Vous ne devez pas utiliser `.sort()` ou `sorted()`. Vous devez parcourir les deux listes simultanément.*
    
    Exemple :
    `[1, 3, 5]` et `[2, 4]` donnent `[1, 2, 3, 4, 5]`
    
    <Correction>
    ```python
    def fusionner(liste1, liste2):
        resultat = []
        i1 = 0 # Indice pour liste1
        i2 = 0 # Indice pour liste2
        
        # Tant qu'il reste des éléments dans les deux listes
        while i1 < len(liste1) and i2 < len(liste2):
            if liste1[i1] <= liste2[i2]:
                resultat.append(liste1[i1])
                i1 += 1
            else:
                resultat.append(liste2[i2])
                i2 += 1
                
        # S'il reste des éléments dans liste1
        while i1 < len(liste1):
            resultat.append(liste1[i1])
            i1 += 1
            
        # S'il reste des éléments dans liste2
        while i2 < len(liste2):
            resultat.append(liste2[i2])
            i2 += 1
            
        return resultat
    ```
    </Correction>
    </Enonce>
    <Verification>
    ```python
    l1 = [1, 3, 5]
    l2 = [2, 4, 6]
    res = fusionner(l1, l2)
    assert res == [1, 2, 3, 4, 5, 6]
    
    # Test listes vides
    assert fusionner([], [1]) == [1]
    assert fusionner([1], []) == [1]
    ```
    </Verification>
  </ExerciseSection>

</ExerciseTabs>
