---
title: 'TP Remédiation : Les Bases Absolues de la POO en C#'
chapter: 'BTS SIO 1 : B2 - Développement (SLAM)'
badgeId: bts_poo_remediation
meta: 'Classes, Objets, Constructeurs, Instance, Static'
prerequisites:
  - premiers_pas_csharp
---

<Admonition type="warning" title="Objectif de cette séance">
Ce TP est spécialement conçu pour reprendre les bases de la Programmation Orientée Objet (POO) en C#. Suite à l'évaluation, plusieurs confusions ont été identifiées (syntaxe C#, différence entre Classe et Objet, abus du mot-clé `static`). L'objectif aujourd'hui est de **déconstruire ces erreurs** pas à pas.
</Admonition>

<ExerciseTabs courseId="bts_poo_remediation" courseTitle="Remédiation POO">
  
  <ExerciseSection id="tp-remed-exo1" label="Étape 1 - La Syntaxe de Base">
    <Enonce>
    ## 🧱 Étape 1 : Syntaxe C# et Création de Classe

    La première étape pour réussir en C# est de maîtriser sa syntaxe stricte. Une classe est un **plan de construction** (un moule).

    ### Les règles d'or (à lire attentivement) :
    1. **Les Propriétés :** On utilise `get; set;` pour définir une propriété accessible de l'extérieur.
    2. **Le Constructeur :** Il porte **exactement le même nom que la classe**. Il n'a **pas de type de retour** (ni `void`, ni `int`).
    3. **Pas de `static` partout :** Le mot clé `static` signifie "appartient au moule global". Or, en POO, on veut que chaque objet ait ses propres valeurs. **Retirez le mot `static` de vos méthodes et propriétés !**

    ### 📋 Travail à faire

    Créez une classe `Joueur` dans un fichier C# propre :

    1. Déclarez les propriétés suivantes (avec `{ get; set; }`) :
       - `Pseudo` (texte)
       - `Niveau` (entier)
       - `EstPremium` (booléen)

    2. Créez le constructeur :
       - Il doit prendre en paramètre le `pseudo` et le `niveau`.
       - Il doit initialiser `EstPremium` à `false` par défaut.

    3. Créez une méthode `AfficherProfil()` :
       - Elle ne prend **aucun paramètre**.
       - Elle affiche dans la console : *"Joueur [Pseudo] - Niveau [Niveau]"*.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-remed-exo2" label="Étape 2 - L'Instanciation (Le mot 'new')">
    <Enonce>
    ## 🪄 Étape 2 : L'Instanciation (Donner vie au code)

    Une classe est juste un plan. Pour l'utiliser, il faut créer des **Objets** à partir de ce plan. C'est ce qu'on appelle l'**Instanciation**.
    En C#, cela nécessite obligatoirement l'utilisation du mot-clé `new`.

    <Admonition type="danger" title="L'erreur classique">
    `Joueur j1 = Joueur("Alex", 10);` ❌ **FAUX !** (C'est du Python, pas du C#).
    `Joueur j1 = new Joueur("Alex", 10);` ✅ **VRAI !**
    </Admonition>

    ### 📋 Travail à faire

    Dans votre méthode `Main` :
    1. Créez un joueur nommé "Shadow" de niveau 5.
    2. Créez un deuxième joueur nommé "Light" de niveau 42.
    3. Passez le joueur "Light" en Premium (`EstPremium = true`).
    4. Appelez la méthode `AfficherProfil()` sur vos deux joueurs.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-remed-exo3" label="Étape 3 - Interaction entre Objets (Le mot 'this')">
    <Enonce>
    ## ⚔️ Étape 3 : Interaction entre Objets

    Le but de la POO est de faire interagir des objets entre eux. 
    Lorsqu'un objet A interagit avec un objet B, l'objet A est représenté par le mot-clé `this` (moi-même), et l'objet B est passé en paramètre.

    <Admonition type="warning" title="La règle du 'this'">
    Ne confondez jamais la classe (`Joueur`) et l'instance (`this`).
    Pour lire le pseudo du joueur actuel, on écrit `this.Pseudo` (ou juste `Pseudo`), mais **JAMAIS** `Joueur.Pseudo`.
    </Admonition>

    ### 📋 Travail à faire

    Retournez dans votre classe `Joueur` et ajoutez une méthode `Attaquer` :
    
    1. La méthode s'appelle `Attaquer(Joueur cible)`.
    2. Elle compare le niveau du joueur actuel (`this.Niveau`) avec le niveau de la cible (`cible.Niveau`).
    3. Si le joueur actuel a un niveau strictement supérieur à la cible :
       - Afficher : *"[Mon Pseudo] écrase [Pseudo de la cible] !"*
    4. Sinon :
       - Afficher : *"[Mon Pseudo] a perdu contre [Pseudo de la cible]..."*

    Testez cette méthode dans le `Main` en faisant attaquer "Shadow" contre "Light", puis "Light" contre "Shadow".
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-remed-exo4" label="Étape 4 - Les Listes d'Objets">
    <Enonce>
    ## 📦 Étape 4 : Stocker des objets dans une Liste

    Dans le DS, beaucoup ont bloqué sur la notion de `List<Renard>`.
    Une liste est un objet de la classe `List`. Pour l'utiliser, il faut donc l'instancier avec `new` !

    ### 📋 Travail à faire

    Créez une nouvelle classe `Guilde` :
    
    1. Ajoutez une propriété `NomGuilde` (texte).
    2. Ajoutez une propriété privée `_membres` de type `List<Joueur>`.
    3. Créez le constructeur de la Guilde (il prend le nom en paramètre, et **doit initialiser la liste à vide avec `new List<Joueur>()`**).
    4. Créez une méthode `AjouterMembre(Joueur j)` qui utilise `_membres.Add(j)`.
    5. Créez une méthode `AfficherMembres()` qui fait un `foreach` pour afficher le pseudo de chaque joueur de la guilde.

    Dans le `Main`, créez une guilde "Les Phénix", ajoutez-y vos joueurs, et affichez les membres.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-remed-exo5" label="Étape 5 - Algorithmes de recherche dans une Liste">
    <Enonce>
    ## 🔍 Étape 5 : Explorer et analyser une Liste

    Maintenant que vous savez ajouter des éléments dans une liste, il faut savoir exploiter ces données. Dans le DS, c'était le rôle des méthodes `PeutAccueillir` ou `VerifierHarmonie`.

    ### 📋 Travail à faire

    Dans votre classe `Guilde`, ajoutez les méthodes suivantes :

    1. **`CalculerNiveauMoyen()`** : 
       - Retourne un `double`.
       - Calcule et retourne la moyenne des niveaux de tous les membres de la guilde. 
       - *Attention : gérez le cas où la guilde est vide (retournez 0).*

    2. **`TrouverMeilleurJoueur()`** :
       - Retourne un objet `Joueur`.
       - Parcourt la liste pour trouver le joueur avec le niveau le plus élevé et le retourne.
       - *Astuce : créez une variable temporaire `Joueur meilleur = _membres[0];` avant votre boucle.*

    3. **`ExclureMembre(string pseudoCible)`** :
       - Retourne un `bool` (`true` si le joueur a été trouvé et exclu, `false` sinon).
       - Cherche le joueur par son pseudo dans la liste et le supprime (utilisez `_membres.Remove(joueur)`).

    Testez ces méthodes dans votre `Main`.
    </Enonce>
  </ExerciseSection>

  <ExerciseSection id="tp-remed-exo6" label="Étape 6 - Interaction entre Guildes (Le Boss Final)">
    <Enonce>
    ## 🏰 Étape 6 : GvG (Guilde vs Guilde)

    C'est l'épreuve finale. Vous allez faire interagir deux objets `Guilde` entre eux, en utilisant les méthodes que vous venez de créer !

    ### 📋 Travail à faire

    Dans la classe `Guilde`, créez la méthode suivante :

    **`DeclarerGuerre(Guilde guildeAdverse)`** :
    - La méthode ne retourne rien (`void`).
    - Elle compare le niveau moyen de la guilde actuelle (`this`) avec celui de la `guildeAdverse`.
    - La guilde avec le niveau moyen le plus bas **perd son meilleur joueur** ! Ce joueur est exclu de la guilde perdante, et rejoint automatiquement la guilde gagnante.
    - Affichez dans la console un résumé épique du combat (qui gagne, qui est transféré).

    Dans le `Main`, créez deux guildes, remplissez-les de joueurs de niveaux différents, et lancez la guerre !
    </Enonce>
  </ExerciseSection>

</ExerciseTabs>
