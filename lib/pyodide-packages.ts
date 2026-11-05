/**
 * Charge les modules demandés par un exercice. Tous figurent dans le lock servi par le site
 * (public/vendor/pyodide, préparé par scripts/copy-vendor-assets.mjs), y compris folium et geopy :
 * pas de micropip, donc pas d'appel à PyPI depuis le navigateur de l'élève.
 */
export async function loadPythonPackages(pyodide: any, packages: string[] = []) {
  const normalized = [...new Set(packages.map((pkg) => pkg.trim()).filter(Boolean).map((pkg) => (pkg === 'PIL' ? 'Pillow' : pkg)))];
  if (normalized.length === 0) return;
  await pyodide.loadPackage(normalized);
}
