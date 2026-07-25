const PYODIDE_BUILTIN_PACKAGES = new Set([
  'pandas',
  'numpy',
  'matplotlib',
  'Pillow',
  'micropip',
  'scipy',
]);

export async function loadPythonPackages(pyodide: any, packages: string[] = []) {
  const normalized = [...new Set(packages.map((pkg) => pkg.trim()).filter(Boolean))];
  if (normalized.length === 0) return;

  const builtIn = normalized
    .map((pkg) => (pkg === 'PIL' ? 'Pillow' : pkg))
    .filter((pkg) => PYODIDE_BUILTIN_PACKAGES.has(pkg));
  const viaMicropip = normalized.filter(
    (pkg) => !PYODIDE_BUILTIN_PACKAGES.has(pkg) && pkg !== 'PIL'
  );

  if (builtIn.length > 0) {
    await pyodide.loadPackage(builtIn);
  }

  if (viaMicropip.length > 0) {
    if (!builtIn.includes('micropip')) {
      await pyodide.loadPackage('micropip');
    }
    await pyodide.runPythonAsync(`
import micropip
for pkg in ${JSON.stringify(viaMicropip)}:
    await micropip.install(pkg)
`);
  }
}
