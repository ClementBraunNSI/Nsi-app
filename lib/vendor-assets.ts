/**
 * Monaco, Pyodide et les images de Blockly sont servis par le site (copiés dans public/vendor par scripts/copy-vendor-assets.mjs) :
 * aucun CDN ne reçoit l'adresse IP des élèves. Pyodide est le même que celui de la vérification côté serveur.
 */
export const MONACO_VS_URL = '/vendor/monaco/vs';
export const PYODIDE_SCRIPT_URL = '/vendor/pyodide/pyodide.js';
// Images et curseurs de Blockly ; sans cette option, ils viennent de blockly-demo.appspot.com.
export const BLOCKLY_MEDIA_URL = '/vendor/blockly/media/';

/** Adresse complète, que loadPyodide préfère à un chemin relatif. Seulement dans le navigateur. */
export function pyodideIndexURL() {
  return new URL('/vendor/pyodide/', window.location.href).href;
}
