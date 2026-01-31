# TP - Audit RGPD d'un site web réel
<style>
.course-tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 2rem 0; padding: 0; }
.course-tab { background: #f5f5f5; color: #333; border: none; padding: 1rem 1.5rem; border-radius: 8px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; flex: 1; min-width: 220px; text-align: center; }
.course-tab:hover { background: #e0e0e0; transform: translateY(-2px); }
.course-tab.active { background: linear-gradient(135deg, #ffb347 0%, #ff8c42 100%); color: white; box-shadow: 0 4px 12px rgba(255, 179, 71, 0.4); }
.course-content { display: none; margin-top: 2rem; padding: 2rem; background: #fafafa; border-radius: 12px; border: 1px solid #e0e0e0; }
.course-content.active { display: block; }
.course-header { background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(155, 89, 182, 0.05)); backdrop-filter: blur(20px); border-radius: 24px; padding: 2rem; margin: 2rem 0; border: 1px solid rgba(52, 152, 219, 0.2); text-align: center; }
.section-title { font-size: 2rem; font-weight: 700; background: linear-gradient(135deg, #3498db 0%, #9b59b6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0; }
.content-text { color: var(--md-default-fg-color); line-height: 1.7; margin: 1rem 0; font-size: 1.02rem; }
.concept-section { background: var(--md-default-bg-color); border-radius: 20px; padding: 1.5rem; margin: 1.5rem 0; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); }
h3.subsection-title { font-size: 1.6rem; font-weight: 600; color: #3498db; margin: 0 0 0.8rem 0; padding-bottom: 0.4rem; border-bottom: 2px solid rgba(52, 152, 219, 0.25); }
h4.subsubsection-title { font-size: 1.2rem; font-weight: 600; color: #2c3e50; margin: 1rem 0 0.6rem 0; padding-bottom: 0.3rem; border-bottom: 1px dashed rgba(44, 62, 80, 0.3); }
.course-subtitle { color: #7f8c8d; font-size: 1rem; font-weight: 300; margin-top: 0.5rem; }
.definition-box { background: linear-gradient(135deg, rgba(52, 152, 219, 0.1), rgba(155, 89, 182, 0.05)); border-left: 5px solid #3498db; border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; backdrop-filter: blur(10px); }
.definition-title { font-size: 1.2rem; font-weight: 600; color: #3498db; margin-bottom: 0.8rem; }
.definition-content { color: var(--md-default-fg-color); font-size: 1.02rem; line-height: 1.6; }
.exercise-cards { display: flex; flex-direction: column; gap: 1rem; padding: 1rem 0; max-width: 100%; }
.exercise-card { background: var(--md-default-bg-color); border-radius: 8px; padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); border-left: 3px solid #3498db; width: 100%; }
.exercise-title { margin: 0 0 0.5rem 0; color: var(--md-primary-fg-color); font-size: 1.05rem; font-weight: 600; }
.exercise-content { line-height: 1.6; }
.difficulty-badge { display: inline-block; padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem; font-weight: 500; margin-bottom: 0.5rem; background: rgba(52, 152, 219, 0.1); color: #3498db; }
/* Table Styles */
table { width: 100%; border-collapse: collapse; margin: 1rem 0; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
th { background: #f8f9fa; color: #2c3e50; font-weight: 600; padding: 12px 15px; text-align: left; border-bottom: 2px solid #e9ecef; }
td { padding: 12px 15px; border-bottom: 1px solid #e9ecef; color: #495057; vertical-align: top; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: #f8f9fa; }
</style>

<script>
function showCourseSection(sectionId, button) {
  const allContents = document.querySelectorAll('.course-content');
  const allTabs = document.querySelectorAll('.course-tab');
  allContents.forEach(c => c.classList.remove('active'));
  allTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
  const target = document.getElementById(sectionId);
  if (target) target.classList.add('active');
  if (button) { button.classList.add('active'); button.setAttribute('aria-selected', 'true'); }
  try { const url = new URL(window.location); url.hash = sectionId; history.replaceState(null, '', url); } catch (e) {}
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
document.addEventListener('DOMContentLoaded', function() {
  const firstTab = document.querySelector('.course-tab');
  if (firstTab) firstTab.click();
});
</script>

<div class="course-header">
  <h2 class="section-title">TP - Audit RGPD d'un site web réel</h2>
  <p class="course-subtitle">BTS SIO 1ère année · Bloc B3.1 : Protéger les données à caractère personnel</p>
  <p><strong>Durée : 2 heures</strong> · <strong>Travail : en binôme</strong></p>
</div>

<div class="concept-section">
  <h3 class="subsection-title">Contexte</h3>
  <div class="content-text">
    Un technicien en cybersécurité peut réaliser des audits de conformité RGPD pour des clients ou des entreprise. Ce TP met en situation réelle d'audit d'un site web.
  </div>
</div>

<div class="definition-box">
  <div class="definition-title">Rappel</div>
  <div class="definition-content">
    Le RGPD impose des obligations strictes aux sites web qui collectent des données personnelles. Un audit RGPD permet d'identifier les écarts entre les pratiques actuelles et les exigences légales.
  </div>
</div>

<div class="course-tabs" role="tablist" aria-label="Parties du TP">
  <button id="tab-course-part1" class="course-tab" role="tab" aria-controls="course-part1" aria-selected="false" onclick="showCourseSection('course-part1', this)">1. Outils & Découverte</button>
  <button id="tab-course-part2" class="course-tab" role="tab" aria-controls="course-part2" aria-selected="false" onclick="showCourseSection('course-part2', this)">2. Audit Complet</button>
  <button id="tab-course-part3" class="course-tab" role="tab" aria-controls="course-part3" aria-selected="false" onclick="showCourseSection('course-part3', this)">3. Recommandations</button>
  <button id="tab-course-part4" class="course-tab" role="tab" aria-controls="course-part4" aria-selected="false" onclick="showCourseSection('course-part4', this)">4. Mentions Légales</button>
  <noscript>Activez JavaScript pour naviguer entre les onglets du TP.</noscript>
</div>

<!-- PARTIE 1 -->
<div id="course-part1" class="course-content" role="tabpanel" aria-labelledby="tab-course-part1">
  <div class="course-header">
    <h2 class="section-title">Partie 1 : Découverte des outils d'audit (20 min)</h2>
  </div>

  <div class="concept-section">
    <h3 class="subsection-title">Outils à utiliser</h3>
    
    <h4 class="subsubsection-title">1. Extension navigateur : Cookie-Editor</h4>
    <div class="content-text">
      <strong>Installation :</strong>
      <ol>
        <li>Ouvrir Chrome ou Firefox</li>
        <li>Aller dans le Web Store / Add-ons</li>
        <li>Rechercher "Cookie-Editor"</li>
        <li>Cliquer sur "Ajouter à Chrome/Firefox"</li>
        <li>L'icône apparaît dans la barre d'outils</li>
      </ol>
      <strong>Utilisation :</strong>
      <ol>
        <li>Aller sur un site web</li>
        <li>Cliquer sur l'icône Cookie-Editor</li>
        <li>Observer la liste des cookies avec leurs caractéristiques</li>
      </ol>
    </div>

    <h4 class="subsubsection-title">2. Outil en ligne : Cookiebot Cookie Scanner</h4>
    <div class="content-text">
      <strong>Accès :</strong> <a href="https://www.cookiebot.com/fr/cookie-checker/" target="_blank">https://www.cookiebot.com/fr/cookie-checker/</a><br>
      <strong>Utilisation :</strong>
      <ol>
        <li>Ouvrir le site Cookiebot</li>
        <li>Entrer l'URL du site à analyser</li>
        <li>Cliquer sur "Scanner"</li>
        <li>Attendre le rapport (30 secondes environ)</li>
        <li>Consulter les résultats</li>
      </ol>
    </div>
  </div>

  <div class="exercise-cards">
    <div class="exercise-card">
      <div class="difficulty-badge">Prise en main</div>
      <h4 class="exercise-title">Exercice de prise en main</h4>
      <div class="exercise-content">
        <p><strong>Site de démonstration :</strong> <a href="https://www.lemonde.fr" target="_blank">https://www.lemonde.fr</a></p>
        
        <h5 style="margin-top:1rem; color:#2c3e50; font-weight:600;">Étape 1 : Analyser les cookies avec Cookie-Editor</h5>
        <ol>
          <li>Ouvrir le site lemonde.fr en navigation privée (Ctrl+Shift+N)</li>
          <li>Cliquer sur l'icône Cookie-Editor</li>
          <li>Observer les cookies déposés</li>
        </ol>
        <ul>
          <li>Combien de cookies sont déposés ?</li>
          <li>Identifier 3 cookies et noter leur nom et durée de vie</li>
          <li>Y a-t-il des cookies de domaines externes (tiers) ?</li>
        </ul>

        <h5 style="margin-top:1rem; color:#2c3e50; font-weight:600;">Étape 2 : Analyser avec Cookiebot Scanner</h5>
        <ol>
          <li>Aller sur <a href="https://www.cookiebot.com/fr/cookie-checker/" target="_blank">https://www.cookiebot.com/fr/cookie-checker/</a></li>
          <li>Entrer l'URL : https://www.lemonde.fr</li>
          <li>Lancer le scan</li>
          <li>Observer le rapport généré</li>
        </ol>
        <ul>
          <li>Combien de cookies par catégorie (essentiels, analytiques, marketing) ?</li>
          <li>Le bandeau de consentement est-il conforme selon Cookiebot ?</li>
        </ul>
      </div>
    </div>
  </div>
</div>

<!-- PARTIE 2 -->
<div id="course-part2" class="course-content" role="tabpanel" aria-labelledby="tab-course-part2">
  <div class="course-header">
    <h2 class="section-title">Partie 2 : Audit complet d'un site web (50 min)</h2>
  </div>

  <div class="concept-section">
    <h3 class="subsection-title">Sites à auditer</h3>
    <p class="content-text"><strong>Choisir un site à analyser, un site de la liste suivante peut être utilisé :</strong></p>
    <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
      <ul style="flex: 1; min-width: 250px;">
        <li><a href="https://www.fnac.com" target="_blank">https://www.fnac.com</a></li>
        <li><a href="https://www.cdiscount.com" target="_blank">https://www.cdiscount.com</a></li>
        <li><a href="https://www.darty.com" target="_blank">https://www.darty.com</a></li>
        <li><a href="https://www.20minutes.fr" target="_blank">https://www.20minutes.fr</a></li>
        <li><a href="https://www.lequipe.fr" target="_blank">https://www.lequipe.fr</a></li>
      </ul>
      <ul style="flex: 1; min-width: 250px;">
        <li><a href="https://www.doctolib.fr" target="_blank">https://www.doctolib.fr</a></li>
        <li><a href="https://www.leboncoin.fr" target="_blank">https://www.leboncoin.fr</a></li>
        <li><a href="https://www.pole-emploi.fr" target="_blank">https://www.pole-emploi.fr</a></li>
        <li><a href="https://www.service-public.fr" target="_blank">https://www.service-public.fr</a></li>
        <li><a href="https://www.ameli.fr" target="_blank">https://www.ameli.fr</a></li>
      </ul>
    </div>
    <p class="content-text" style="font-size: 0.9rem; margin-top: 1rem;">
      <em>Sites historiques ou minimalistes (utiles pour comparaison) :</em><br>
      <a href="http://www.perdu.com" target="_blank">http://www.perdu.com</a>, 
      <a href="http://www.gnu.org" target="_blank">http://www.gnu.org</a>, 
      <a href="http://info.cern.ch" target="_blank">http://info.cern.ch</a>
    </p>
  </div>

  <h3 class="subsection-title" style="margin-top: 2rem;">Grille d'audit RGPD</h3>
  <p>Compléter la grille suivante pour le site choisi :</p>

  <div class="exercise-cards">
    <div class="exercise-card">
      <h4 class="exercise-title">A. IDENTIFICATION DU SITE</h4>
      <div class="exercise-content">
        <table>
          <thead>
            <tr>
              <th style="width: 30%;">Critère</th>
              <th>Informations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>URL du site</strong></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Nom de l'organisation</strong></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Type de site</strong></td>
              <td>E-commerce / Média / Service / Institutionnel</td>
            </tr>
            <tr>
              <td><strong>Date de l'audit</strong></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Auditeurs</strong></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="exercise-card">
      <h4 class="exercise-title">B. ANALYSE DES COOKIES</h4>
      <div class="exercise-content">
        <h5 style="margin-top:0.5rem; color:#3498db;">B1. Inventaire des cookies</h5>
        <p><strong>Méthode :</strong> Utiliser Cookiebot Scanner pour obtenir un rapport automatique.</p>
        <ol>
            <li>Aller sur <a href="https://www.cookiebot.com/fr/cookie-checker/" target="_blank">https://www.cookiebot.com/fr/cookie-checker/</a></li>
            <li>Entrer l'URL du site à auditer</li>
            <li>Lancer le scan</li>
            <li>Copier les résultats ci-dessous</li>
        </ol>

        <table>
          <thead>
            <tr>
              <th style="width: 40%;">Critère</th>
              <th>Résultat</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Nombre total de cookies</strong></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Cookies essentiels</strong></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Cookies analytiques</strong></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Cookies marketing/publicitaires</strong></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Cookies non classés</strong></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <p><em>Y-a-t-il des cookies qui envoient les données dans d'autres pays ? Qui viennent d'autres services ou sites ?</em></p>
        <p><strong>Captures d'écran à réaliser :</strong> Rapport Cookiebot (vue d'ensemble), Liste détaillée des cookies (au moins 1 catégorie)</p>

        <h5 style="margin-top:1rem; color:#3498db;">B2. Bandeau de consentement</h5>
        <p><strong>Analyser le bandeau de consentement du site</strong></p>

        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Critère</th>
              <th style="width: 15%;">Oui/Non</th>
              <th>Observations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Un bandeau de consentement apparaît-il ?</strong></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Peut-on refuser tous les cookies facilement ?</strong></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Le bouton "Refuser" est-il aussi visible que "Accepter" ?</strong></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Peut-on personnaliser ses choix par catégorie ?</strong></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Y a-t-il des cookies déposés AVANT le consentement ?</strong></td>
              <td></td>
              <td>(vérifier avec Cookie-Editor)</td>
            </tr>
          </tbody>
        </table>

        <p><strong>Captures d'écran à réaliser :</strong> Bandeau de consentement initial, Interface de personnalisation (si disponible)</p>
      </div>
    </div>

    <div class="exercise-card">
      <h4 class="exercise-title">C. FORMULAIRES ET COLLECTE DE DONNÉES</h4>
      <div class="exercise-content">
        <p><strong>Identifier un formulaire sur le site</strong> (inscription, contact, newsletter, commande...)</p>

        <table>
          <thead>
            <tr>
              <th style="width: 30%;">Critère</th>
              <th>Résultat</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Type de formulaire</strong></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Données collectées</strong></td>
              <td>(lister : nom, email, téléphone, adresse, etc.)</td>
            </tr>
            <tr>
              <td><strong>Données obligatoires</strong></td>
              <td>(lesquelles ?)</td>
            </tr>
          </tbody>
        </table>

        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Critère</th>
              <th style="width: 15%;">Oui/Non</th>
              <th>Observations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Mention d'information RGPD présente ?</strong></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Finalité de collecte clairement indiquée ?</strong></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Case de consentement pour newsletter/prospection ?</strong></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Case pré-cochée ?</strong></td>
              <td></td>
              <td>(NON conforme si oui)</td>
            </tr>
            <tr>
              <td><strong>Lien vers politique de confidentialité ?</strong></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <p><strong>Capture d'écran à réaliser :</strong> Formulaire avec mentions RGPD visibles</p>
      </div>
    </div>

    <div class="exercise-card">
      <h4 class="exercise-title">D. POLITIQUE DE CONFIDENTIALITÉ</h4>
      <div class="exercise-content">
        <p><strong>Trouver et analyser la politique de confidentialité du site</strong></p>

        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Critère</th>
              <th style="width: 15%;">Oui/Non</th>
              <th>Observations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Document facilement accessible ?</strong></td>
              <td></td>
              <td>(combien de clics ?)</td>
            </tr>
            <tr>
              <td><strong>Identité du responsable de traitement ?</strong></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Finalités de la collecte expliquées ?</strong></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Durée de conservation précisée ?</strong></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Destinataires des données mentionnés ?</strong></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Droits des utilisateurs listés ?</strong></td>
              <td></td>
              <td>(accès, rectification, effacement...)</td>
            </tr>
            <tr>
              <td><strong>Procédure pour exercer ses droits ?</strong></td>
              <td></td>
              <td>(email, formulaire...)</td>
            </tr>
            <tr>
              <td><strong>Date de dernière mise à jour ?</strong></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <div class="exercise-card">
      <h4 class="exercise-title">E. DROITS DES UTILISATEURS</h4>
      <div class="exercise-content">
        <p><strong>Rechercher comment exercer ses droits RGPD sur le site</strong></p>

        <table>
          <thead>
            <tr>
              <th style="width: 30%;">Droit</th>
              <th style="width: 15%;">Accessible ?</th>
              <th>Comment ?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Droit d'accès</strong></td>
              <td>Oui/Non</td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Droit de rectification</strong></td>
              <td>Oui/Non</td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Droit à l'effacement</strong></td>
              <td>Oui/Non</td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Droit d'opposition</strong></td>
              <td>Oui/Non</td>
              <td></td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <div class="exercise-card">
      <h4 class="exercise-title">F. SÉCURITÉ</h4>
      <div class="exercise-content">
        
        <table>
          <thead>
            <tr>
              <th style="width: 50%;">Critère</th>
              <th style="width: 15%;">Oui/Non</th>
              <th>Observations</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Le site utilise-t-il HTTPS ?</strong></td>
              <td></td>
              <td>(vérifier le cadenas)</td>
            </tr>
            <tr>
              <td><strong>Certificat SSL valide ?</strong></td>
              <td></td>
              <td>(cliquer sur le cadenas)</td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>

  <div class="concept-section">
    <h3 class="subsection-title">Synthèse de l'audit</h3>
    
    <h4 class="subsubsection-title">Niveau de conformité global</h4>
    <p>Évaluer le niveau de conformité RGPD du site :</p>
    <ul style="list-style: none; padding-left: 0;">
      <li><input type="checkbox" disabled> <strong>Conforme</strong> : Peu ou pas de violations détectées</li>
      <li><input type="checkbox" disabled> <strong>Partiellement conforme</strong> : Quelques non-conformités</li>
      <li><input type="checkbox" disabled> <strong>Non conforme</strong> : Violations importantes du RGPD</li>
    </ul>

    <h4 class="subsubsection-title">Violations identifiées</h4>
    <p><strong>Lister les violations détectées :</strong></p>

    <table>
      <thead>
        <tr>
          <th style="width: 70%;">Violation</th>
          <th>Gravité (Faible/Moyenne/Élevée)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
        <tr>
          <td></td>
          <td></td>
        </tr>
      </tbody>
    </table>

  </div>
</div>

<!-- PARTIE 3 -->
<div id="course-part3" class="course-content" role="tabpanel" aria-labelledby="tab-course-part3">
  <div class="course-header">
    <h2 class="section-title">Partie 3 : Recommandations de mise en conformité (40 min)</h2>
  </div>

  <div class="concept-section">
    <h3 class="subsection-title">Catalogue des solutions RGPD</h3>
    <p class="content-text">Utiliser ce catalogue pour proposer des solutions adaptées aux violations identifiées.</p>
    
    <div style="overflow-x: auto;">
      <table>
        <thead>
          <tr>
            <th>Violation détectée</th>
            <th>Solution recommandée</th>
            <th>Complexité</th>
            <th>Coût estimé</th>
            <th>Délai</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Cookies déposés avant consentement</td><td>Implémenter une CMP (Consent Management Platform) comme Axeptio, Cookiebot ou Didomi</td><td>Moyenne</td><td>1500-3000€/an</td><td>1 mois</td></tr>
          <tr><td>Pas de HTTPS</td><td>Installer un certificat SSL (Let's Encrypt gratuit ou certificat payant)</td><td>Faible</td><td>0-100€/an</td><td>1 semaine</td></tr>
          <tr><td>Politique de confidentialité absente ou incomplète</td><td>Rédiger une politique avec générateur CNIL ou prestataire juridique</td><td>Faible</td><td>0-500€</td><td>2 semaines</td></tr>
          <tr><td>Pas de bouton "Supprimer mon compte"</td><td>Développer une fonctionnalité dans l'espace utilisateur</td><td>Moyenne</td><td>500-1500€</td><td>1 mois</td></tr>
          <tr><td>Mots de passe mal protégés (MD5, SHA1)</td><td>Migrer vers bcrypt ou argon2 (développement)</td><td>Élevée</td><td>2000-5000€</td><td>2-3 mois</td></tr>
          <tr><td>Pas de consentement newsletter</td><td>Ajouter checkbox non pré-cochée + système de double opt-in</td><td>Faible</td><td>300-800€</td><td>2 semaines</td></tr>
          <tr><td>Conservation illimitée des données</td><td>Définir politique de rétention + script de purge automatique</td><td>Moyenne</td><td>1000-2000€</td><td>1-2 mois</td></tr>
          <tr><td>Données sensibles en clair</td><td>Chiffrer la base de données (AES-256)</td><td>Élevée</td><td>3000-8000€</td><td>2-3 mois</td></tr>
          <tr><td>Formulaire sans mention RGPD</td><td>Ajouter mentions légales + lien vers politique de confidentialité</td><td>Faible</td><td>0-200€</td><td>1 semaine</td></tr>
          <tr><td>Pas de bouton "Tout refuser" pour les cookies</td><td>Modifier le bandeau de consentement pour ajouter un bouton visible</td><td>Faible</td><td>500-1000€</td><td>2 semaines</td></tr>
          <tr><td>Case newsletter pré-cochée</td><td>Modifier le formulaire pour décocher par défaut</td><td>Faible</td><td>100-300€</td><td>1 semaine</td></tr>
          <tr><td>Transferts hors UE non mentionnés</td><td>Mettre à jour la politique de confidentialité</td><td>Faible</td><td>0-300€</td><td>1 semaine</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="exercise-cards">
    <div class="exercise-card">
      <h4 class="exercise-title">Top 3 des violations prioritaires</h4>
      <div class="exercise-content">
        <p><strong>Parmi toutes les violations identifiées, sélectionner les 3 plus graves et compléter le tableau ci-dessous.</strong></p>

        <table>
          <tbody>
            <tr>
              <td style="width: 40%;"><strong>Nature de la violation</strong></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Gravité</strong></td>
              <td>Faible / Moyenne / Élevée</td>
            </tr>
            <tr>
              <td><strong>Pourquoi c'est grave ?</strong> (risque pour l'utilisateur et pour l'entreprise)</td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Solution recommandée</strong> (utiliser le catalogue ci-dessus)</td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Complexité</strong></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Coût estimé</strong></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Délai de mise en œuvre</strong></td>
              <td></td>
            </tr>
            <tr>
              <td><strong>Priorité</strong></td>
              <td>Haute / Moyenne / Basse</td>
            </tr>
            <tr>
              <td><strong>Justification de la priorité</strong></td>
              <td></td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>

    <div class="exercise-card">
      <div class="difficulty-badge">Livrables</div>
      <h4 class="exercise-title">Livrables attendus</h4>
      <div class="exercise-content">
        <p><strong>À rendre à la fin du TP :</strong></p>
        <ol>
          <li><strong>Grille d'audit complétée</strong> (parties A à G)</li>
          <li><strong>Top 3 des violations</strong> avec solutions du catalogue</li>
          <li><strong>Synthèse 1 page</strong></li>
          <li><strong>5 captures d'écran minimum</strong> :
            <ul>
              <li>Rapport Cookiebot</li>
              <li>Bandeau de consentement</li>
              <li>Liste des cookies (Cookie-Editor ou Cookiebot)</li>
              <li>Formulaire avec mentions RGPD</li>
              <li>Politique de confidentialité</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  </div>
</div>

<!-- PARTIE 4 -->
<div id="course-part4" class="course-content" role="tabpanel" aria-labelledby="tab-course-part4">
  <div class="course-header">
    <h2 class="section-title">Partie 4 : Rédaction des mentions légales (30 min)</h2>
  </div>

  <div class="concept-section">
    <h3 class="subsection-title">Mise en situation</h3>
    <div class="content-text">
      Vous travaillez en tant que consultants en conformité numérique. Votre client, l'association <strong>Le Refuge des Renards Polaires</strong>, souhaite lancer un site e-commerce pour vendre des produits dérivés (mugs, t-shirts, peluches, stickers) afin de financer ses activités de protection des renards.
      <br><br>
      Le site doit être conforme au RGPD et aux obligations légales françaises (LCEN) avant sa mise en ligne.
    </div>
  </div>

  <div class="exercise-cards">
    <div class="exercise-card">
      <div class="difficulty-badge">Client</div>
      <h4 class="exercise-title">Informations Client</h4>
      <div class="exercise-content">
        <ul style="list-style: none; padding-left: 0; line-height: 1.8;">
         <li><strong>Nom :</strong> Le Refuge des Renards Polaires</li> 
         <li><strong>Statut juridique :</strong> Association loi 1901</li> 
         <li><strong>Siège social :</strong> Port-aux-Français, 98417 Îles Kerguelen, TAAF, France</li> 
         <li><strong>Email :</strong> contact@refugedesrenards.fr</li> 
         <li><strong>Téléphone :</strong> +262 984 00 01 23</li> 
         <li><strong>N° SIRET :</strong> 123 456 789 00012</li> 
         <li><strong>Directeur de publication :</strong> Marie Dubois (Présidente de l'association)</li> 
         <li><strong>Hébergeur :</strong> OVH — 2 rue Kellermann, 59100 Roubaix</li>
        </ul>
      </div>
    </div>

    <div class="exercise-card">
      <div class="difficulty-badge">Code HTML</div>
      <h4 class="exercise-title">Exercice : Rédiger la page HTML de mentions légales</h4>
      <div class="exercise-content">
        <p>En vous aidant des informations client ci-dessus, rédigez le code HTML d'une page de mentions légales conforme.</p>
        <p><strong>Structure attendue :</strong></p>
        <ul>
            <li>Titre de la section (h1 ou h2)</li>
            <li>Identité de l'éditeur du site</li>
            <li>Coordonnées de l'hébergeur</li>
            <li>Propriété intellectuelle</li>
            <li>Protection des données personnelles (bref rappel + lien vers politique de confidentialité)</li>
        </ul>
        <p><em>Utilisez les balises sémantiques HTML5 appropriées (section, article, h2, p, address, etc.).</em></p>
      </div>
    </div>
  </div>
</div>
