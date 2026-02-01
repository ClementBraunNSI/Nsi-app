<style>
/* Styles modernes pour le TP Web et HTTP */
.course-header {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.05));
    backdrop-filter: blur(20px);
    border-radius: 24px;
    padding: 3rem;
    margin: 2rem 0;
    border: 1px solid rgba(102, 126, 234, 0.2);
    text-align: center;
}

.course-title {
    font-size: 3rem;
    font-weight: 700;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 1rem;
}

.course-subtitle {
    color: #7f8c8d;
    font-size: 1.2rem;
    font-weight: 300;
    margin-bottom: 2rem;
}

.timeline-section {
    background: var(--md-default-bg-color);
    border-radius: 20px;
    padding: 2rem;
    margin: 2rem 0;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.section-title {
    font-size: 2.2rem;
    font-weight: 600;
    color: #667eea;
    margin-bottom: 2rem;
    text-align: center;
}

.definition-box {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.05));
    border-left: 5px solid #667eea;
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem 0;
    backdrop-filter: blur(10px);
}

.definition-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #667eea;
    margin-bottom: 1rem;
}

.definition-content {
    color: var(--md-default-fg-color);
    font-size: 1.1rem;
    line-height: 1.6;
}

.highlight-fact {
    background: rgba(255, 193, 7, 0.1);
    border-left: 4px solid #ffc107;
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 8px;
    font-weight: 500;
}

.fact-content {
    color: var(--md-default-fg-color);
    font-weight: 500;
    line-height: 1.6;
}

.info-box {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.05));
    border-left: 5px solid #667eea;
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem 0;
    backdrop-filter: blur(10px);
}

.info-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #667eea;
    margin-bottom: 1rem;
}

.info-content {
    color: var(--md-default-fg-color);
    font-size: 1.1rem;
    line-height: 1.6;
}

.code-example {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    color: #2c3e50;
    padding: 1.5rem;
    border-radius: 12px;
    margin: 1.5rem 0;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Courier New', monospace;
    overflow-x: auto;
    border: 1px solid rgba(102, 126, 234, 0.3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    position: relative;
}

.code-example::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px 12px 0 0;
}

.code-example pre {
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.6;
    white-space: pre-wrap;
    word-break: break-word;
}

@media (max-width: 768px) {
    .code-example {
        padding: 1rem;
        font-size: 0.85rem;
    }
    
    .code-example pre {
        font-size: 0.8rem;
        line-height: 1.5;
    }
}

.code-title {
    color: #2e7d32;
    font-weight: 700;
    margin-bottom: 1rem;
    font-size: 1rem;
    text-shadow: none;
}

.options-grid {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin: 2rem 0;
}

@media (min-width: 1200px) {
    .options-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    }
}

.option-card {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.1));
    border-radius: 15px;
    padding: 2rem;
    border: 1px solid rgba(102, 126, 234, 0.3);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.option-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.5);
}

.option-title {
    font-weight: 600;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    color: #667eea;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.option-description {
    font-size: 1rem;
    color: var(--md-default-fg-color);
    margin-bottom: 1.5rem;
    font-weight: 500;
    opacity: 0.9;
}

.steps-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin: 1.5rem 0;
}

.step-card {
    background: rgba(102, 126, 234, 0.1);
    border-radius: 10px;
    padding: 1rem;
    text-align: center;
    border: 1px solid rgba(102, 126, 234, 0.2);
}

.step-number {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 0.5rem;
}

.step-text {
    font-size: 0.9rem;
    color: var(--md-default-fg-color);
    font-weight: 500;
}

.help-section {
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.1), rgba(255, 152, 0, 0.05));
    border-left: 5px solid #ffc107;
    border-radius: 12px;
    padding: 2rem;
    margin: 2rem 0;
    backdrop-filter: blur(10px);
}

.help-title {
    font-size: 1.3rem;
    font-weight: 600;
    color: #f39c12;
    margin-bottom: 1rem;
}

.problem-item {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
    border-left: 3px solid #e74c3c;
}

.problem-title {
    font-weight: 600;
    color: #e74c3c;
    margin-bottom: 0.5rem;
}

.problem-solution {
    color: var(--md-default-fg-color);
    font-size: 0.95rem;
    line-height: 1.5;
}
</style>

<div class="course-header">
    <h1 class="course-title">🎨 Création de pages WEB dynamiques</h1>
    <p class="course-subtitle">Tableaux de maîtres revisités avec des renards</p>
</div>

<div class="timeline-section">
    <div class="definition-box">
        <div class="definition-title">🎯 Objectif du projet</div>
        <div class="definition-content">
            Le but de ce projet est de créer une page web présentant un tableau de maître revisité avec des renards. Chaque élève travaillera sur un tableau différent, qu'il choisira ou tirera au sort parmi une sélection de 18 tableaux.
        </div>
    </div>
    
    <div class="info-box">
        <div class="info-title">📁 Ressources fournies</div>
        <div class="info-content">
            Vous retrouverez un dossier contenant :
            <ul>
                <li>Un exemple de CSS</li>
                <li>Une fonction JavaScript gérant le changement d'images</li>
                <li>Le formulaire de base</li>
            </ul>
            <br>
            Voici la maquette : <a href="maquette_.zip"><strong>📦 maquette</strong></a>
        </div>
    </div>
</div>

<div class="timeline-section">
    <h2 class="section-title">🎨 La page Web et son style</h2>
    
    <div class="definition-box">
        <div class="definition-title">📋 Contenu requis</div>
        <div class="definition-content">
            Vous devrez créer une page web présentant le tableau revisité qui vous a été attribué. Votre page devra inclure :
            <ul>
                <li>Une présentation du tableau original (titre, auteur, date, contexte historique)</li>
                <li>Une présentation du tableau revisité avec des renards</li>
                <li>Une histoire inventée autour de ce tableau et de ses personnages renards</li>
                <li>Des éléments visuels et textuels mettant en valeur votre créativité</li>
            </ul>
        </div>
    </div>
    
    <div class="info-box">
        <div class="info-title">📁 Structure des dossiers</div>
        <div class="info-content">
            Vous réaliserez une arborescence correcte avec :
            <ul>
                <li>Les images dans le dossier <strong>images</strong></li>
                <li>Les feuilles de style dans un dossier <strong>styles</strong></li>
                <li>Les scripts JavaScript dans un dossier <strong>scripts</strong></li>
                <li>La page web nommée <strong>index.html</strong> à la racine de l'arborescence</li>
            </ul>
        </div>
    </div>
    
    <div class="code-example">
        <div class="code-title">📂 Organisation des fichiers</div>
        <pre>
projet-tableau-renard/
├── index.html
├── images/
│   ├── tableau-original.jpg
│   └── tableau-renard.jpg
├── styles/
│   └── style.css
└── scripts/
    └── script.js
        </pre>
    </div>
    
    <div class="highlight-fact">
        <div class="fact-content">
            <strong>💡 Exemple :</strong> Voici un exemple de structure de fichiers pour votre projet :<br>
            <img src="./exemple_kanagafox.png" alt="Exemple de structure" style="max-width: 100%; margin-top: 1rem; border-radius: 8px;">
        </div>
    </div>
</div>

<div class="timeline-section">
    <h2 class="section-title">⚡ 2 - Dynamiser la page avec JavaScript</h2>
    
    <div class="definition-box">
        <div class="definition-title">🎯 Objectif</div>
        <div class="definition-content">
            Pour rendre votre page plus interactive, vous allez ajouter <strong>une seule fonctionnalité JavaScript simple</strong>. Le code complet vous est fourni, vous devrez simplement le copier et l'adapter à votre projet.
        </div>
    </div>
    
    <div class="info-box">
        <div class="info-title">📋 Étapes à suivre</div>
        <div class="info-content">
            <div class="steps-grid">
                <div class="step-card">
                    <div class="step-number">1</div>
                    <div class="step-text">Choisissez UNE fonctionnalité parmi celles proposées</div>
                </div>
                <div class="step-card">
                    <div class="step-number">2</div>
                    <div class="step-text">Copiez le code HTML dans index.html</div>
                </div>
                <div class="step-card">
                    <div class="step-number">3</div>
                    <div class="step-text">Copiez le JavaScript dans scripts/script.js</div>
                </div>
                <div class="step-card">
                    <div class="step-number">4</div>
                    <div class="step-text">Copiez le CSS dans styles/style.css</div>
                </div>
                <div class="step-card">
                    <div class="step-number">5</div>
                    <div class="step-text">Testez votre page dans le navigateur</div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="options-grid">
    <div class="option-card">
        <div class="option-title">🖼️ Option 1 : Bouton pour changer d'image (FACILE)</div>
        <div class="option-description">
            <strong>Ce que ça fait :</strong> Un bouton qui permet de passer du tableau original au tableau avec des renards.
        </div>
        
        <div class="code-example">
            <div class="code-title">📝 Code HTML à ajouter dans votre page</div>
            <pre>&lt;button id="bouton-image"&gt;Voir la version renard&lt;/button&gt;
&lt;img id="image-tableau" src="images/tableau-original.jpg" alt="Tableau"&gt;</pre>
        </div>
        
        <div class="code-example">
            <div class="code-title">⚡ Code JavaScript à mettre dans scripts/script.js</div>
            <pre>// Variables pour stocker les éléments
const bouton = document.getElementById('bouton-image');
const image = document.getElementById('image-tableau');

// Variable pour savoir quelle image est affichée
let imageOriginale = true;

// Fonction qui s'exécute quand on clique sur le bouton
bouton.addEventListener('click', function() {
    if (imageOriginale) {
        // Changer vers l'image renard
        image.src = 'images/tableau-renard.jpg';
        bouton.textContent = 'Voir l\'original';
        imageOriginale = false;
    } else {
        // Revenir à l'image originale
        image.src = 'images/tableau-original.jpg';
        bouton.textContent = 'Voir la version renard';
        imageOriginale = true;
    }
});</pre>
        </div>
        
        <div class="code-example">
            <div class="code-title">🎨 Code CSS à ajouter dans styles/style.css</div>
            <pre>#bouton-image {
    background-color: #ff6b35;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 5px;
    cursor: pointer;
    margin: 20px 0;
}

#bouton-image:hover {
    background-color: #e55a2b;
}

#image-tableau {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
}</pre>
        </div>
    </div>

    <div class="option-card">
        <div class="option-title">🌙 Option 2 : Mode Jour/Nuit (MOYEN)</div>
        <div class="option-description">
            <strong>Ce que ça fait :</strong> Un bouton qui change les couleurs de toute la page (fond sombre/clair).
        </div>
        
        <div class="code-example">
            <div class="code-title">📝 Code HTML à ajouter</div>
            <pre>&lt;button id="bouton-mode"&gt;🌙 Mode nuit&lt;/button&gt;</pre>
        </div>
        
        <div class="code-example">
            <div class="code-title">⚡ Code JavaScript à mettre dans scripts/script.js</div>
            <pre>// Récupérer le bouton et le body de la page
const boutonMode = document.getElementById('bouton-mode');
const body = document.body;

// Fonction qui s'exécute quand on clique sur le bouton
boutonMode.addEventListener('click', function() {
    // Ajouter ou enlever la classe 'mode-nuit'
    body.classList.toggle('mode-nuit');
    
    // Changer le texte du bouton selon le mode
    if (body.classList.contains('mode-nuit')) {
        boutonMode.textContent = '☀️ Mode jour';
    } else {
        boutonMode.textContent = '🌙 Mode nuit';
    }
});</pre>
        </div>
        
        <div class="code-example">
            <div class="code-title">🎨 Code CSS à ajouter dans styles/style.css</div>
            <pre>/* Style du bouton */
#bouton-mode {
    background-color: #4a90e2;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 14px;
    position: fixed;
    top: 20px;
    right: 20px;
}

/* Styles pour le mode nuit */
.mode-nuit {
    background-color: #1a1a1a;
    color: #ffffff;
}

.mode-nuit h1, .mode-nuit h2, .mode-nuit h3 {
    color: #ffffff;
}

.mode-nuit p {
    color: #cccccc;
}</pre>
        </div>
    </div>

    <div class="option-card">
        <div class="option-title">👆 Option 3 : Affichage de texte au clic (TRÈS FACILE)</div>
        <div class="option-description">
            <strong>Ce que ça fait :</strong> Cliquer sur l'image affiche un texte caché avec des informations sur le tableau.
        </div>
        
        <div class="code-example">
            <div class="code-title">📝 Code HTML à ajouter</div>
            <pre>&lt;img id="image-cliquable" src="images/tableau-renard.jpg" alt="Tableau" style="cursor: pointer;"&gt;
&lt;p id="texte-cache" style="display: none;"&gt;🦊 Les renards ont envahi ce tableau ! Découvrez leur histoire...&lt;/p&gt;</pre>
        </div>
        
        <div class="code-example">
            <div class="code-title">⚡ Code JavaScript à mettre dans scripts/script.js</div>
            <pre>// Récupérer l'image et le texte
const imageCliquable = document.getElementById('image-cliquable');
const texteCache = document.getElementById('texte-cache');

// Fonction qui s'exécute quand on clique sur l'image
imageCliquable.addEventListener('click', function() {
    // Vérifier si le texte est caché ou visible
    if (texteCache.style.display === 'none') {
        texteCache.style.display = 'block'; // Montrer le texte
    } else {
        texteCache.style.display = 'none';  // Cacher le texte
    }
});</pre>
        </div>
        
        <div class="code-example">
            <div class="code-title">🎨 Code CSS à ajouter dans styles/style.css</div>
            <pre>#image-cliquable {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    transition: transform 0.2s;
}

#image-cliquable:hover {
    transform: scale(1.02);
}

#texte-cache {
    background-color: #fff3cd;
    border: 2px solid #ffeaa7;
    padding: 15px;
    border-radius: 8px;
    margin-top: 15px;
    font-style: italic;
    text-align: center;
}</pre>
        </div>
    </div>
</div>
<div class="timeline-section">
    <h2 class="section-title">📚 Ressources utiles</h2>
    
    <div class="info-box">
        <div class="info-title">🔗 Liens utiles</div>
        <div class="info-content">
            <ul>
                <li><a href="https://developer.mozilla.org/fr/docs/Web/JavaScript" target="_blank">MDN Web Docs - JavaScript</a></li>
                <li><a href="https://www.w3schools.com/js/" target="_blank">W3Schools - JavaScript Tutorial</a></li>
                <li><a href="https://css-tricks.com/" target="_blank">CSS Tricks</a></li>
                <li><a href="https://fonts.google.com/" target="_blank">Google Fonts</a></li>
            </ul>
        </div>
    </div>
    
    <div class="highlight-fact">
        <div class="fact-content">
            <strong>🎉 Bon travail et amusez-vous bien avec ce projet créatif !</strong> 🦊🎨
        </div>
    </div>
</div>
