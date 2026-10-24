// Vérification d'un exercice Python avec Pyodide, dans un processus Node à part.
//
// Lancé par lib/run-exercise-check.ts : lit sur l'entrée standard
// { runner, user, tests, packages } et écrit sur la sortie standard le JSON renvoyé par _nsi_run.
// Node existe partout (Vercel compris), contrairement à python3.
//
// Le code de l'élève ne doit atteindre ni les fichiers ni les variables du serveur :
// environnement vide, `import js` pointe vers un objet vide, et les accès de Node
// au système (fs, modules natifs, système de fichiers hôte de Pyodide) sont retirés
// avant d'exécuter quoi que ce soit.
"use strict";

const os = require("node:os");
const path = require("node:path");

function readStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    process.stdin.on("data", (chunk) => chunks.push(chunk));
    process.stdin.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    process.stdin.on("error", reject);
  });
}

function harden(pyodide) {
  for (const target of [pyodide.FS && pyodide.FS.filesystems, pyodide._module]) {
    if (!target) continue;
    for (const key of ["NODEFS", "NODERAWFS"]) {
      try {
        delete target[key];
      } catch {}
    }
  }
  for (const key of ["binding", "_linkedBinding", "dlopen", "getBuiltinModule", "mainModule", "chdir", "kill", "setuid", "setgid"]) {
    try {
      Object.defineProperty(process, key, { value: undefined, configurable: false, writable: false });
    } catch {}
  }
  process.env = {};
}

async function main() {
  const payload = JSON.parse(await readStdin());
  const write = process.stdout.write.bind(process.stdout);
  const { loadPyodide } = require("pyodide");

  const pyodide = await loadPyodide({
    jsglobals: Object.create(null),
    packageCacheDir: path.join(os.tmpdir(), "nsi-pyodide-packages"),
    stdout: () => {},
    stderr: () => {},
  });

  const packages = Array.isArray(payload.packages) ? payload.packages.map(String) : [];
  if (packages.length > 0) {
    const names = packages.map((name) => (name === "PIL" ? "Pillow" : name));
    await pyodide.loadPackage(names, { messageCallback: () => {}, errorCallback: () => {} });
  }

  harden(pyodide);

  pyodide.globals.set("__nsi_user", String(payload.user || ""));
  pyodide.globals.set("__nsi_tests", String(payload.tests || ""));
  pyodide.runPython(String(payload.runner || ""));
  const out = pyodide.runPython("json.dumps(_nsi_run(__nsi_user, __nsi_tests), ensure_ascii=False)");
  write(String(out), () => process.exit(0));
}

main().catch(() => process.exit(1));
