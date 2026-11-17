/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cette option aide Turbopack à trouver ses repères
  transpilePackages: ['lucide-react'],
  // Tableaux de la Chasse aux Ren'Arts et captures des bugs : des images de 1 à 2,5 Mo passent par des actions serveur,
  // au-delà du 1 Mo permis par défaut.
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  // La vérification des exercices lance lib/pyodide-check-child.cjs, qui charge Pyodide,
  // et charge sql.js par un require dynamique : aucun import ne les relie,
  // il faut donc les embarquer explicitement avec la page d'exercice.
  outputFileTracingIncludes: {
    '/exercice/[id]': [
      './lib/pyodide-check-child.cjs',
      './lib/pyodide-extra-packages.cjs',
      './lib/pyodide-wheels/*.whl',
      './node_modules/pyodide/**/*',
      './node_modules/sql.js/dist/sql-asm.js',
    ],
    // Correction automatique des évaluations, lancée depuis le tableau de bord de l'enseignant.
    '/admin/evaluations/[id]': [
      './lib/pyodide-check-child.cjs',
      './lib/pyodide-extra-packages.cjs',
      './lib/pyodide-wheels/*.whl',
      './node_modules/pyodide/**/*',
      './node_modules/sql.js/dist/sql-asm.js',
    ],
    // Défi du lundi : vérification de l'élève, et test de la correction par l'enseignant.
    '/defi': [
      './lib/pyodide-check-child.cjs',
      './lib/pyodide-extra-packages.cjs',
      './lib/pyodide-wheels/*.whl',
      './node_modules/pyodide/**/*',
      './node_modules/sql.js/dist/sql-asm.js',
    ],
    '/admin/defis': [
      './lib/pyodide-check-child.cjs',
      './lib/pyodide-extra-packages.cjs',
      './lib/pyodide-wheels/*.whl',
      './node_modules/pyodide/**/*',
      './node_modules/sql.js/dist/sql-asm.js',
    ],
    '/admin/defis/[id]': [
      './lib/pyodide-check-child.cjs',
      './lib/pyodide-extra-packages.cjs',
      './lib/pyodide-wheels/*.whl',
      './node_modules/pyodide/**/*',
      './node_modules/sql.js/dist/sql-asm.js',
    ],
  },
  // Monaco et Pyodide servis par le site : des dizaines de fichiers, inutile de les revalider à chaque page.
  async headers() {
    return [
      {
        source: '/vendor/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/cours",
        destination: "/",
        statusCode: 301,
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;