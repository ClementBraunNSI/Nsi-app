export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans py-24">
      <div className="max-w-4xl mx-auto px-8">
        <h1 className="text-4xl font-black text-slate-900 mb-12 tracking-tight">Mentions légales</h1>
        
        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Éditeur du site</h2>
            <p>
              <strong>Clément Braun</strong><br />
              Enseignant certifié NSI<br />
              Email : clementbraun@supwallon.fr
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Hébergement</h2>
            <p>
              Ce site est hébergé par GitHub Pages et Vercel.<br />
              <br />
              <strong>GitHub Inc.</strong><br />
              88 Colin P Kelly Jr St<br />
              San Francisco, CA 94107<br />
              États-Unis<br />
              <br />
              <strong>Vercel Inc.</strong><br />
              440 N Barranca Ave #4133<br />
              Covina, CA 91723<br />
              États-Unis<br />
              <br />
              Les données utilisateur nécessaires au fonctionnement de la plateforme sont sauvegardées et hébergées
              via <strong>Supabase</strong>. Supabase s'appuie sur une infrastructure cloud basée sur AWS, avec un
              hébergement des données en Irlande, au sein de l'Union européenne.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Propriété intellectuelle</h2>
            <p>
              Le contenu de ce site (textes, images, cours, exercices) est protégé par le droit d'auteur 
              et reste la propriété exclusive de Clément Braun. Toute reproduction, distribution, modification, 
              adaptation, retransmission ou publication, même partielle, de ces différents éléments est 
              strictement interdite sans l'accord exprès par écrit de Clément Braun.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Protection des données personnelles (RGPD)</h2>
            
            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Responsable du traitement</h3>
            <p>
              Le responsable du traitement des données personnelles est :<br />
              <strong>Clément Braun</strong><br />
              Email : clementbraun@supwallon.fr
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Données collectées et finalités</h3>
            
            <h4 className="text-lg font-medium text-slate-900 mb-2 mt-4">Pour les cours particuliers</h4>
            <p className="mb-4">
              Pour les cours particuliers, seules les données strictement nécessaires au fonctionnement du compte
              sont traitées :
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Prénom</strong> : pour l'identification pédagogique de l'élève</li>
              <li><strong>Adresse e-mail</strong> : utilisée uniquement pour la connexion au compte</li>
              <li><strong>Mot de passe</strong> : utilisé uniquement pour l'authentification sécurisée</li>
              <li><strong>Finalités</strong> : permettre à l'élève d'accéder à son compte et permettre à l'enseignant
              (Clément Braun) de suivre sa progression via un dashboard personnalisé</li>
            </ul>
            <p className="mb-4">
              Les comptes sont créés manuellement par l'enseignant ; il n'existe pas d'inscription publique autonome.
              Les données ne sont <strong>jamais exportées</strong> ni partagées avec des tiers et sont uniquement
              utilisées dans le cadre pédagogique.
            </p>

            <h4 className="text-lg font-medium text-slate-900 mb-2 mt-4">Pour les cours en classe</h4>
            <p className="mb-4">
              Dans le cadre scolaire (en classe), le même principe est appliqué : seules les données minimales
              nécessaires au service sont utilisées.
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Prénom</strong> : pour l'identification pédagogique de l'élève</li>
              <li><strong>Adresse e-mail et mot de passe</strong> : pour l'accès sécurisé au compte</li>
              <li><strong>Finalités</strong> : permettre à l'élève d'accéder à son dashboard personnel et permettre
              à l'enseignant de suivre sa progression</li>
            </ul>
            <p>
              Les comptes sont créés directement par l'enseignant. Ces données ne sont <strong>pas exportées</strong>
              et sont uniquement utilisées pour le dashboard
              de l'étudiant et le suivi pédagogique par l'enseignant.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Base légale du traitement</h3>
            <p>
              Le traitement de vos données personnelles repose sur :<br />
              - Le <strong>consentement</strong> explicite de l'utilisateur (ou de ses représentants légaux pour les mineurs)<br />
              - L'<strong>intérêt légitime</strong> dans le cadre du suivi pédagogique
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Durée de conservation</h3>
            <p className="mb-3">
              <strong>Cours particuliers :</strong> Les données personnelles (prénom, e-mail de connexion) sont conservées pendant
              la durée des cours particuliers, puis supprimées <strong>1 mois après la fin des cours</strong>. 
              À ce moment, les exercices et cours réalisés deviennent publics et anonymisés dans la base de données 
              du site, sans aucune donnée personnelle associée.
            </p>
            <p>
              <strong>Cours en classe :</strong> Les données personnelles (prénom, e-mail de connexion) sont conservées
              pendant l'année scolaire en cours, puis <strong>supprimées à la fin de l'année scolaire</strong>.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Vos droits</h3>
            <p className="mb-3">
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, 
              vous disposez des droits suivants :
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Droit d'accès</strong> : vous pouvez demander à consulter vos données personnelles</li>
              <li><strong>Droit de rectification</strong> : vous pouvez demander la modification de vos données 
              à tout moment si elles sont inexactes ou incomplètes</li>
              <li><strong>Droit à l'effacement</strong> : vous pouvez demander la suppression de vos données 
              à tout moment</li>
              <li><strong>Droit à la limitation du traitement</strong> : vous pouvez demander la suspension 
              du traitement de vos données</li>
              <li><strong>Droit d'opposition</strong> : vous pouvez vous opposer au traitement de vos données</li>
              <li><strong>Droit à la portabilité</strong> : vous pouvez demander à recevoir vos données dans 
              un format structuré</li>
            </ul>
            <p>
              Pour exercer ces droits, vous pouvez contacter le responsable du traitement à l'adresse email : 
              clementbraun@supwallon.fr. Vous disposez également du droit d'introduire une réclamation auprès 
              de la CNIL (Commission Nationale de l'Informatique et des Libertés) si vous estimez que vos droits 
              ne sont pas respectés.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Sécurité des données</h3>
            <p>
              Nous mettons en œuvre toutes les mesures techniques et organisationnelles appropriées afin de garantir 
              un niveau de sécurité adapté au risque, conformément aux exigences du RGPD. Les données sont stockées 
              de manière sécurisée via Supabase, sur une infrastructure AWS localisée en Irlande, et ne sont
              accessibles qu'à l'enseignant responsable du site.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Liens externes</h3>
            <p>
              Ce site peut contenir des liens vers des sites externes. Nous ne sommes pas responsables des pratiques 
              de confidentialité de ces sites tiers. Nous vous encourageons à lire leurs politiques de confidentialité 
              respectives.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Conditions générales d'utilisation (CGU)</h2>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Objet</h3>
            <p>
              Les présentes CGU encadrent l'accès et l'utilisation de la plateforme pédagogique "La tanière du code".
              En utilisant le site, l'utilisateur accepte les présentes conditions.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Accès au service</h3>
            <p>
              Le site propose des contenus accessibles publiquement (cours, ressources, projets) et des espaces
              réservés aux utilisateurs disposant d'un compte. Les comptes sont créés manuellement par l'éditeur
              du site ; aucune inscription libre n'est proposée.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Utilisation des comptes</h3>
            <p className="mb-3">
              Chaque utilisateur s'engage à utiliser la plateforme de manière conforme à sa finalité pédagogique.
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Ne pas partager ses identifiants de connexion</li>
              <li>Ne pas perturber le fonctionnement du site ou des services associés</li>
              <li>Respecter les règles de courtoisie et de respect dans les échanges pédagogiques</li>
            </ul>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Suspension et suppression de compte</h3>
            <p>
              En cas de non-respect des présentes conditions, de comportement inadapté ou d'usage détourné
              de la plateforme, l'éditeur se réserve la possibilité de suspendre temporairement ou de supprimer
              un compte, après appréciation de la situation et, lorsque cela est possible, information préalable
              de l'utilisateur ou de ses représentants légaux.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Propriété intellectuelle et usage autorisé</h3>
            <p>
              Les contenus publiés sur la plateforme sont destinés à un usage pédagogique personnel. Toute
              reproduction, diffusion ou exploitation commerciale non autorisée est interdite.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Limitation de responsabilité</h3>
            <p>
              L'éditeur met en œuvre les moyens raisonnables pour assurer la disponibilité et la fiabilité du site,
              sans garantie d'absence totale d'interruption, d'erreur ou d'indisponibilité temporaire.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Modification des CGU</h3>
            <p>
              Les présentes CGU peuvent être modifiées à tout moment pour s'adapter aux évolutions du service,
              techniques ou réglementaires. La date de dernière mise à jour figurant en bas de page fait foi.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">Droit applicable et juridiction compétente</h3>
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige et à défaut de résolution amiable,
              les juridictions françaises territorialement compétentes seront seules compétentes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies</h2>
            <p>
              Ce site n'utilise pas de cookies de suivi, de profilage ou de publicité. Aucun cookie n'est déposé 
              sur votre navigateur lors de votre visite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
            <p>
              Pour toute question concernant ce site, les mentions légales ou la protection de vos données personnelles, 
              vous pouvez contacter Clément Braun à l'adresse email : clementbraun@supwallon.fr
            </p>
            <p className="mt-4">
              Si vous estimez, après contact, que vos droits ne sont pas respectés, vous pouvez déposer une réclamation
              auprès de la CNIL (<a className="text-orange-600 hover:text-orange-700 underline" href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
            </p>
          </section>

          <section className="text-sm text-slate-600 mt-12 pt-8 border-t border-slate-200">
            <p>
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}