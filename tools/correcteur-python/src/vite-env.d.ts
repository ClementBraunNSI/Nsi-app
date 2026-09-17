/// <reference types="vite/client" />

interface PyodideInterface {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (options: { batched: (msg: string) => void }) => void;
  setStderr: (options: { batched: (msg: string) => void }) => void;
}

interface Window {
  loadPyodide: (config?: { indexURL?: string }) => Promise<PyodideInterface>;
}
