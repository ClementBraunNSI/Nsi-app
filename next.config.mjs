/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cette option aide Turbopack à trouver ses repères
  transpilePackages: ['lucide-react'],
  // La vérification des exercices lance lib/pyodide-check-child.cjs, qui charge Pyodide :
  // aucun import ne les relie, il faut donc les embarquer explicitement avec la page d'exercice.
  outputFileTracingIncludes: {
    '/exercice/[id]': ['./lib/pyodide-check-child.cjs', './node_modules/pyodide/**/*'],
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