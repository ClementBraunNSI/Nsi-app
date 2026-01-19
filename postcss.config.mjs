export default {
  plugins: {
    '@tailwindcss/postcss': {},
  },
  typescript: {
    // !! ATTENTION !!
    // Permet de déployer même s'il y a des erreurs TypeScript.
    ignoreBuildErrors: true,
  }
}