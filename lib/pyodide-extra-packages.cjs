// Modules demandés par les fiches mais absents du lock Pyodide : leurs roues (Python pur)
// sont rangées dans lib/pyodide-wheels. Leurs dépendances, elles, sont dans le lock.
// Utilisé par lib/pyodide-check-child.cjs (vérification serveur) et scripts/audit-exercises.mjs.
// Le navigateur, lui, les installe avec micropip (lib/pyodide-packages.ts).
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const WHEELS_DIR = path.join(__dirname, "pyodide-wheels");

// Module demandé : roues à déballer (dans l'ordre) et paquets du lock à charger avant.
const EXTRA = {
  branca: { wheels: ["branca"], lock: ["jinja2"] },
  folium: { wheels: ["branca", "folium"], lock: ["jinja2", "numpy", "requests", "ssl", "xyzservices"] },
  geographiclib: { wheels: ["geographiclib"], lock: [] },
  geopy: { wheels: ["geographiclib", "geopy"], lock: ["ssl"] },
};

function wheelFile(name) {
  const file = fs.readdirSync(WHEELS_DIR).find((entry) => entry.startsWith(name + "-") && entry.endsWith(".whl"));
  if (!file) throw new Error("Roue absente : " + name);
  return path.join(WHEELS_DIR, file);
}

/** Charge les modules demandés : ceux du lock avec loadPackage, les autres depuis lib/pyodide-wheels. */
async function loadExercisePackagesInto(pyodide, packages, loaded = new Set()) {
  const names = packages.map((name) => (name === "PIL" ? "Pillow" : String(name)));
  const fromLock = [];
  const wheels = [];
  for (const name of names) {
    const extra = EXTRA[name.toLowerCase()];
    if (extra) {
      fromLock.push(...extra.lock);
      wheels.push(...extra.wheels);
    } else {
      fromLock.push(name);
    }
  }
  const lockToLoad = [...new Set(fromLock)].filter((name) => !loaded.has(name));
  if (lockToLoad.length > 0) {
    await pyodide.loadPackage(lockToLoad, { messageCallback: () => {}, errorCallback: () => {} });
    lockToLoad.forEach((name) => loaded.add(name));
  }
  for (const name of [...new Set(wheels)]) {
    if (loaded.has(name)) continue;
    const octets = fs.readFileSync(wheelFile(name));
    // Pyodide refuse un Buffer de Node : il veut un Uint8Array simple.
    pyodide.unpackArchive(new Uint8Array(octets.buffer, octets.byteOffset, octets.byteLength), "wheel");
    loaded.add(name);
  }
}

module.exports = { loadExercisePackagesInto };
