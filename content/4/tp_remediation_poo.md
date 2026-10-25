---
title: 'TP Remédiation : Les Bases Absolues de la POO en C#'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
badgeId: bts_poo_remediation
meta: 'Classes, Objets, Constructeurs, Instance, Static'
prerequisites:
  - premiers_pas_csharp
audience: public
---

<Admonition type="warning" title="Objectif de cette séance">
Ce TP est spécialement conçu pour reprendre les bases de la Programmation Orientée Objet (POO) en C#. Suite à l'évaluation, plusieurs confusions ont été identifiées (syntaxe C#, différence entre Classe et Objet, abus du mot-clé `static`). L'objectif aujourd'hui est de **déconstruire ces erreurs** pas à pas.
</Admonition>

<ExerciseTabs courseId="bts_poo_remediation" courseTitle="Remédiation POO">
  
  <ExerciseSection id="tp-remed-exo1" label="Étape 1 - La Syntaxe de Base" type="autre">
    <Enonce>
    ## <Icone nom="brick-wall" /> Étape 1 : Syntaxe C# et Création de Classe

    La première étape pour réussir en C# est de maîtriser sa syntaxe stricte. Une classe est un **plan de construction** (un moule).

    ### Les règles d'or (à lire attentivement) :
    1. **Les Propriétés :** On utilise `get; set;` pour définir une propriété accessible de l'extérieur.
    2. **Le Constructeur :** Il porte **exactement le même nom que la classe**. Il n'a **pas de type de retour** (ni `void`, ni `int`).
    3. **Pas de `static` partout :** Le mot clé `static` signifie "appartient au moule global". Or, en POO, on veut que chaque objet ait ses propres valeurs. **Retirer le mot `static` des méthodes et propriétés !**

    ### <Icone nom="clipboard-list" /> Travail à faire

    Créer une classe `Joueur` dans un fichier C# propre :

    1. Déclarer les propriétés suivantes (avec `{ get; set; }`) :
       - `Pseudo` (texte)
       - `Niveau` (entier)
       - `EstPremium` (booléen)

    2. Créer le constructeur :
       - Il doit prendre en paramètre le `pseudo` et le `niveau`.
       - Il doit initialiser `EstPremium` à `false` par défaut.

    3. Créer une méthode `AfficherProfil()` :
       - Elle ne prend **aucun paramètre**.
       - Elle affiche dans la console : *"Joueur [Pseudo] - Niveau [Niveau]"*.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-remed-exo2" label="Étape 2 - L'Instanciation (Le mot 'new')" type="autre">
    <Enonce>
    ## <Icone nom="wand" /> Étape 2 : L'Instanciation (Donner vie au code)

    Une classe est juste un plan. Pour l'utiliser, il faut créer des **Objets** à partir de ce plan. C'est ce qu'on appelle l'**Instanciation**.
    En C#, cela nécessite obligatoirement l'utilisation du mot-clé `new`.

    <Admonition type="danger" title="L'erreur classique">
    `Joueur j1 = Joueur("Alex", 10);` <Icone nom="circle-x" /> **FAUX !** (C'est du Python, pas du C#).
    `Joueur j1 = new Joueur("Alex", 10);` <Icone nom="circle-check" /> **VRAI !**
    </Admonition>

    ### <Icone nom="clipboard-list" /> Travail à faire

    Dans la méthode `Main` :
    1. Créer un joueur nommé "Shadow" de niveau 5.
    2. Créer un deuxième joueur nommé "Light" de niveau 42.
    3. Passer le joueur "Light" en Premium (`EstPremium = true`).
    4. Appeler la méthode `AfficherProfil()` sur les deux joueurs.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-remed-exo3" label="Étape 3 - Interaction entre Objets (Le mot 'this')" type="autre">
    <Enonce>
    ## <Icone nom="swords" /> Étape 3 : Interaction entre Objets

    Le but de la POO est de faire interagir des objets entre eux. 
    Lorsqu'un objet A interagit avec un objet B, l'objet A est représenté par le mot-clé `this` (moi-même), et l'objet B est passé en paramètre.

    <Admonition type="warning" title="La règle du 'this'">
    Ne confonder jamais la classe (`Joueur`) et l'instance (`this`).
    Pour lire le pseudo du joueur actuel, on écrit `this.Pseudo` (ou juste `Pseudo`), mais **JAMAIS** `Joueur.Pseudo`.
    </Admonition>

    ### <Icone nom="clipboard-list" /> Travail à faire

    Retourner dans la classe `Joueur` et ajouter une méthode `Attaquer` :
    
    1. La méthode s'appelle `Attaquer(Joueur cible)`.
    2. Elle compare le niveau du joueur actuel (`this.Niveau`) avec le niveau de la cible (`cible.Niveau`).
    3. Si le joueur actuel a un niveau strictement supérieur à la cible :
       - Afficher : *"[Mon Pseudo] écrase [Pseudo de la cible] !"*
    4. Sinon :
       - Afficher : *"[Mon Pseudo] a perdu contre [Pseudo de la cible]..."*

    Tester cette méthode dans le `Main` en faisant attaquer "Shadow" contre "Light", puis "Light" contre "Shadow".
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-remed-exo4" label="Étape 4 - Les Listes d'Objets" type="autre">
    <Enonce>
    ## <Icone nom="package" /> Étape 4 : Stocker des objets dans une Liste

    Dans le DS, beaucoup ont bloqué sur la notion de `List<Renard>`.
    Une liste est un objet de la classe `List`. Pour l'utiliser, il faut donc l'instancier avec `new` !

    ### <Icone nom="clipboard-list" /> Travail à faire

    Créer une nouvelle classe `Guilde` :
    
    1. Ajouter une propriété `NomGuilde` (texte).
    2. Ajouter une propriété privée `_membres` de type `List<Joueur>`.
    3. Créer le constructeur de la Guilde (il prend le nom en paramètre, et **doit initialiser la liste à vide avec `new List<Joueur>()`**).
    4. Créer une méthode `AjouterMembre(Joueur j)` qui utilise `_membres.Add(j)`.
    5. Créer une méthode `AfficherMembres()` qui fait un `foreach` pour afficher le pseudo de chaque joueur de la guilde.

    Dans le `Main`, créer une guilde "Les Phénix", y ajouter les joueurs, et afficher les membres.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-remed-exo5" label="Étape 5 - Algorithmes de recherche dans une Liste" type="autre">
    <Enonce>
    ## <Icone nom="search" /> Étape 5 : Explorer et analyser une Liste

    Une fois les éléments ajoutés dans une liste, il faut savoir exploiter ces données. Dans le DS, c'était le rôle des méthodes `PeutAccueillir` ou `VerifierHarmonie`.

    ### <Icone nom="clipboard-list" /> Travail à faire

    Dans la classe `Guilde`, ajouter les méthodes suivantes :

    1. **`CalculerNiveauMoyen()`** : 
       - Retourne un `double`.
       - Calcule et retourne la moyenne des niveaux de tous les membres de la guilde. 
       - *Attention : gérer le cas où la guilde est vide (retourner 0).*

    2. **`TrouverMeilleurJoueur()`** :
       - Retourne un objet `Joueur`.
       - Parcourt la liste pour trouver le joueur avec le niveau le plus élevé et le retourne.
       - *Astuce : créer une variable temporaire `Joueur meilleur = _membres[0];` avant la boucle.*

    3. **`ExclureMembre(string pseudoCible)`** :
       - Retourne un `bool` (`true` si le joueur a été trouvé et exclu, `false` sinon).
       - Cherche le joueur par son pseudo dans la liste et le supprime (utiliser `_membres.Remove(joueur)`).

    Tester ces méthodes dans le `Main`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-remed-exo6" label="Étape 6 - Interaction entre Guildes (Le Boss Final)" type="autre">
    <Enonce>
    ## <Icone nom="castle" /> Étape 6 : GvG (Guilde vs Guilde)

    C'est l'épreuve finale. Faire interagir deux objets `Guilde` entre eux, avec les méthodes qui viennent d'être créées !

    ### <Icone nom="clipboard-list" /> Travail à faire

    Dans la classe `Guilde`, créer la méthode suivante :

    **`DeclarerGuerre(Guilde guildeAdverse)`** :
    - La méthode ne retourne rien (`void`).
    - Elle compare le niveau moyen de la guilde actuelle (`this`) avec celui de la `guildeAdverse`.
    - La guilde avec le niveau moyen le plus bas **perd son meilleur joueur** ! Ce joueur est exclu de la guilde perdante, et rejoint automatiquement la guilde gagnante.
    - Afficher dans la console un résumé épique du combat (qui gagne, qui est transféré).

    Dans le `Main`, créer deux guildes, les remplir de joueurs de niveaux différents, et lancer la guerre !
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
