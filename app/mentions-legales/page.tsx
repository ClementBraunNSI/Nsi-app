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
              GitHub Inc.<br />
              88 Colin P Kelly Jr St<br />
              San Francisco, CA 94107<br />
              États-Unis
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Propriété intellectuelle</h2>
            <p>
              Le contenu de ce site (textes, images, cours) est protégé par le droit d'auteur. 
              Toute reproduction ou utilisation sans autorisation préalable est interdite.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Données personnelles</h2>
            <p>
              Ce site ne collecte aucune donnée personnelle. Les liens vers les sites externes 
              relèvent de la responsabilité de leurs propriétaires respectifs.

              Lors d'une création de compte, celle-ci est créée sans utiliser de données personnelles.
              Les seules pouvant être utilisées sont le nom et le prénom de l'étudiant lors de la création de compte qui ne sont pas obligatoires.
              Ces noms et prénoms ne sont pas utilisées pour des traitements particuliers si ce n'est que l'étudiant sache qu'il est bien sur son compte et que l'enseignant (Clément BRAUN) sache quels exercices l'étudiant a réalisé sur un dashboard personnalisé.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies</h2>
            <p>
              Ce site n'utilise pas de cookies de suivi ou de publicité.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
            <p>
              Pour toute question concernant ce site, vous pouvez me contacter à l'adresse email ci-dessus.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}