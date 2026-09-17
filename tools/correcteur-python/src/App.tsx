import { useCallback, useState } from 'react';
import { exportCsv } from '@nsi-tools/shared/csv';
import { AppShell } from './components/AppShell';
import { loadPyodideRuntime, runPythonIsolated } from './pyodide';

type Mode = 'batch' | 'paste';

interface ResultRow {
  filename: string;
  status: 'OK' | 'ÉCHEC';
  details: string;
}

const DEFAULT_TESTS = `# Tests à exécuter après le code élève
# assert ma_fonction(2) == 4
`;

export default function App() {
  const [mode, setMode] = useState<Mode>('batch');
  const [files, setFiles] = useState<{ name: string; content: string }[]>([]);
  const [pasteCode, setPasteCode] = useState('');
  const [tests, setTests] = useState(DEFAULT_TESTS);
  const [results, setResults] = useState<ResultRow[]>([]);
  const [running, setRunning] = useState(false);
  const [pyodideReady, setPyodideReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const ensurePyodide = useCallback(async () => {
    if (!pyodideReady) {
      setStatusMessage('Chargement de Pyodide…');
      await loadPyodideRuntime();
      setPyodideReady(true);
      setStatusMessage('');
    }
    return loadPyodideRuntime();
  }, [pyodideReady]);

  async function handleFileUpload(fileList: FileList | null) {
    if (!fileList) return;
    const entries = await Promise.all(
      Array.from(fileList)
        .filter((f) => f.name.endsWith('.py'))
        .map(async (f) => ({ name: f.name, content: await f.text() })),
    );
    setFiles((prev) => {
      const map = new Map(prev.map((p) => [p.name, p]));
      for (const entry of entries) map.set(entry.name, entry);
      return Array.from(map.values());
    });
  }

  async function runCorrection() {
    setRunning(true);
    setResults([]);
    try {
      const pyodide = await ensurePyodide();
      const targets =
        mode === 'paste'
          ? [{ name: 'collage.py', content: pasteCode }]
          : files;

      if (targets.length === 0) {
        setStatusMessage('Aucun fichier à corriger.');
        return;
      }

      const rows: ResultRow[] = [];
      for (const target of targets) {
        setStatusMessage(`Exécution : ${target.name}…`);
        const result = await runPythonIsolated(pyodide, target.content, tests);
        rows.push({
          filename: target.name,
          status: result.ok ? 'OK' : 'ÉCHEC',
          details: result.details || result.stderr || result.stdout || '—',
        });
      }
      setResults(rows);
      setStatusMessage(`${rows.length} fichier(s) traité(s).`);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setRunning(false);
    }
  }

  function handleExportCsv() {
    if (results.length === 0) return;
    exportCsv(
      results.map((r) => ({
        filename: r.filename,
        status: r.status,
        details: r.details,
      })),
      'correctpy-rapport.csv',
    );
  }

  return (
    <AppShell>
      <div className="mb-6 flex gap-2">
        <button
          type="button"
          onClick={() => setMode('batch')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            mode === 'batch'
              ? 'bg-[var(--app-primary)] text-[var(--app-bg)]'
              : 'border border-[var(--app-border)] text-[var(--app-muted)]'
          }`}
        >
          Fichiers multiples
        </button>
        <button
          type="button"
          onClick={() => setMode('paste')}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            mode === 'paste'
              ? 'bg-[var(--app-primary)] text-[var(--app-bg)]'
              : 'border border-[var(--app-border)] text-[var(--app-muted)]'
          }`}
        >
          Collage unique
        </button>
      </div>

      <div className="space-y-6">
        {mode === 'batch' ? (
          <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
            <label htmlFor="file-upload" className="mb-2 block text-sm font-medium">
              Importer des copies Python (.py)
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".py"
              multiple
              onChange={(e) => void handleFileUpload(e.target.files)}
              className="block w-full text-sm text-[var(--app-muted)]"
            />
            {files.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-[var(--app-muted)]">
                {files.map((f) => (
                  <li key={f.name}>• {f.name}</li>
                ))}
              </ul>
            )}
          </section>
        ) : (
          <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
            <label htmlFor="paste-code" className="mb-2 block text-sm font-medium">
              Code Python à corriger
            </label>
            <textarea
              id="paste-code"
              value={pasteCode}
              onChange={(e) => setPasteCode(e.target.value)}
              rows={12}
              spellCheck={false}
              className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
              placeholder="def ma_fonction(x):\n    return x * 2"
            />
          </section>
        )}

        <section className="rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
          <label htmlFor="tests" className="mb-2 block text-sm font-medium">
            Tests (assertions Python)
          </label>
          <textarea
            id="tests"
            value={tests}
            onChange={(e) => setTests(e.target.value)}
            rows={8}
            spellCheck={false}
            className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] px-3 py-2 text-sm text-[var(--app-text)]"
          />
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => void runCorrection()}
            disabled={running}
            className="rounded-lg bg-[var(--app-primary)] px-6 py-2 font-medium text-[var(--app-bg)] disabled:opacity-50"
          >
            {running ? 'Exécution…' : 'Lancer la correction'}
          </button>
          {results.length > 0 && (
            <button
              type="button"
              onClick={handleExportCsv}
              className="rounded-lg border border-[var(--app-border)] px-5 py-2 text-sm text-[var(--app-muted)] hover:border-[var(--app-primary)]"
            >
              Export CSV
            </button>
          )}
          {statusMessage && (
            <span className="text-sm text-[var(--app-muted)]">{statusMessage}</span>
          )}
        </div>

        {results.length > 0 && (
          <section className="overflow-x-auto rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[var(--app-border)] text-[var(--app-muted)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Fichier</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Détails</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => (
                  <tr key={row.filename} className="border-b border-[var(--app-border)] last:border-0">
                    <td className="px-4 py-3 font-mono">{row.filename}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
                          row.status === 'OK'
                            ? 'bg-[var(--app-primary)]/20 text-[var(--app-primary)]'
                            : 'bg-red-900/40 text-red-400'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="max-w-md truncate px-4 py-3 font-mono text-xs text-[var(--app-muted)]">
                      {row.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </AppShell>
  );
}
