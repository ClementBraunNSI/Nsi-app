/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cette option aide Turbopack à trouver ses repères
  transpilePackages: ['lucide-react'],
  typescript: {
    // !! ATTENTION !!
    // Permet de déployer même s'il y a des erreurs TypeScript.
    ignoreBuildErrors: true,
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